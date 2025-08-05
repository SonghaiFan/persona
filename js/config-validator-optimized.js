// Configuration Validator - Elegant validation with functional approach
class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate complete resume data with elegant chaining
   * @param {Object} data - Resume data to validate
   */
  validateResumeData(data) {
    this._reset();

    return this._validateChain(data, [
      this._validateTopLevel,
      this._validateVersionConfig,
      this._validateVersions,
      this._validateCoreSections,
    ]);
  }

  /**
   * Execute validation chain
   * @private
   */
  _validateChain(data, validators) {
    validators.forEach((validator) => validator.call(this, data));

    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
    };
  }

  /**
   * Reset validation state
   * @private
   */
  _reset() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate top-level structure with smart checks
   * @private
   */
  _validateTopLevel(data) {
    if (!data || data.constructor !== Object) {
      return this._addError("Data must be a valid object");
    }

    this._checkRequired(data, ["versions"], "section");
    this._checkRecommended(
      data,
      ["education", "technical_skills", "projects"],
      "section"
    );
  }

  /**
   * Validate version configuration elegantly
   * @private
   */
  _validateVersionConfig(data) {
    const { version_config } = data;
    if (!version_config) return;

    if (version_config.constructor !== Object) {
      return this._addWarning("version_config should be an object");
    }

    // Validate with type checking
    this._validateField(version_config, "default_version", "string", false);
    this._validateField(version_config, "theme_base", "string", false);
    this._validateField(version_config, "available_sections", "array", false);
    this._validateField(version_config, "skill_categories", "array", false);
  }

  /**
   * Validate versions with concise iteration
   * @private
   */
  _validateVersions(data) {
    const { versions } = data;
    if (!versions || versions.constructor !== Object) {
      return this._addError("versions must be an object");
    }

    const versionKeys = Object.keys(versions);
    if (!versionKeys.length) {
      return this._addError("At least one version configuration is required");
    }

    versionKeys.forEach((key) =>
      this._validateSingleVersion(key, versions[key])
    );
  }

  /**
   * Validate single version with elegant field checking
   * @private
   */
  _validateSingleVersion(key, version) {
    const context = `Version "${key}"`;

    if (!version || version.constructor !== Object) {
      return this._addError(`${context}: Configuration must be an object`);
    }

    // Required fields validation
    const requiredFields = [
      ["display_name", "string"],
      ["summary", "string"],
      ["skills_focus", "array"],
      ["sections_order", "array"],
    ];

    requiredFields.forEach(([name, type]) => {
      if (!version[name]) {
        this._addError(`${context}: Missing required field "${name}"`);
      } else if (!this._isType(version[name], type)) {
        this._addError(`${context}: Field "${name}" must be of type ${type}`);
      }
    });

    // Optional field validation
    if (version.theme_color && !this._isValidHexColor(version.theme_color)) {
      this._addError(
        `${context}: Invalid theme_color format "${version.theme_color}"`
      );
    }

    if (version.projects_limit && !Number.isInteger(version.projects_limit)) {
      this._addWarning(`${context}: projects_limit should be an integer`);
    }
  }

  /**
   * Validate core data sections
   * @private
   */
  _validateCoreSections(data) {
    if (data.education) this._validateEducation(data.education);
    if (data.technical_skills)
      this._validateTechnicalSkills(data.technical_skills);
    if (data.projects) this._validateProjects(data.projects);
    if (data.publications) this._validatePublications(data.publications);
  }

  /**
   * Validate education section elegantly
   * @private
   */
  _validateEducation(education) {
    if (!Array.isArray(education)) {
      return this._addError("education must be an array");
    }

    education.forEach((edu, index) => {
      const context = `Education item ${index + 1}`;
      ["degree", "institution", "period"].forEach((field) => {
        if (!edu[field]) this._addError(`${context}: Missing ${field} field`);
      });
    });
  }

  /**
   * Validate technical skills with modern approach
   * @private
   */
  _validateTechnicalSkills(technicalSkills) {
    if (technicalSkills.constructor !== Object) {
      return this._addError("technical_skills must be an object");
    }

    Object.entries(technicalSkills).forEach(([category, skillData]) => {
      const context = `Skill category "${category}"`;

      if (!skillData.title) this._addError(`${context}: Missing title field`);

      if (!Array.isArray(skillData.items)) {
        return this._addError(`${context}: items must be an array`);
      }

      skillData.items.forEach((item, index) => {
        const itemContext = `${context}, item ${index + 1}`;
        if (!item.name) this._addError(`${itemContext}: Missing name field`);

        if (
          item.level &&
          (!Number.isInteger(item.level) || item.level < 1 || item.level > 5)
        ) {
          this._addError(
            `${itemContext}: level must be an integer between 1 and 5`
          );
        }

        if (item.keywords && !Array.isArray(item.keywords)) {
          this._addError(`${itemContext}: keywords must be an array`);
        }
      });
    });
  }

  /**
   * Validate projects section
   * @private
   */
  _validateProjects(projects) {
    if (!Array.isArray(projects)) {
      return this._addError("projects must be an array");
    }

    projects.forEach((project, index) => {
      const context = `Project ${index + 1}`;
      if (!project.title) this._addError(`${context}: Missing title field`);

      ["features", "items"].forEach((field) => {
        if (project[field] && !Array.isArray(project[field])) {
          this._addError(`${context}: ${field} must be an array`);
        }
      });
    });
  }

  /**
   * Validate publications section
   * @private
   */
  _validatePublications(publications) {
    if (!Array.isArray(publications)) {
      return this._addError("publications must be an array");
    }

    publications.forEach((pub, index) => {
      const context = `Publication ${index + 1}`;
      ["title", "authors", "venue", "year", "type"].forEach((field) => {
        if (!pub[field]) this._addError(`${context}: Missing ${field} field`);
      });

      if (pub.year && !Number.isInteger(parseInt(pub.year))) {
        this._addWarning(`${context}: Year should be a valid integer`);
      }
    });
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  /**
   * Check required fields
   * @private
   */
  _checkRequired(obj, fields, type) {
    fields.forEach((field) => {
      if (!obj[field]) this._addError(`Missing required ${type}: ${field}`);
    });
  }

  /**
   * Check recommended fields
   * @private
   */
  _checkRecommended(obj, fields, type) {
    fields.forEach((field) => {
      if (!obj[field])
        this._addWarning(`Recommended ${type} missing: ${field}`);
    });
  }

  /**
   * Validate field type elegantly
   * @private
   */
  _validateField(obj, field, type, required = true) {
    if (!obj[field]) {
      if (required) this._addError(`${field} is required`);
      return;
    }

    if (!this._isType(obj[field], type)) {
      this._addError(`${field} must be of type ${type}`);
    }
  }

  /**
   * Type checking utility
   * @private
   */
  _isType(value, type) {
    const typeCheckers = {
      string: (v) => typeof v === "string",
      array: (v) => Array.isArray(v),
      object: (v) => v && v.constructor === Object,
      number: (v) => typeof v === "number",
      boolean: (v) => typeof v === "boolean",
    };

    return typeCheckers[type]?.(value) || false;
  }

  /**
   * Validate hex color with modern regex
   * @private
   */
  _isValidHexColor(color) {
    return /^#[A-Fa-f0-9]{3,6}$/.test(color);
  }

  /**
   * Add error message
   * @private
   */
  _addError(message) {
    this.errors.push(message);
  }

  /**
   * Add warning message
   * @private
   */
  _addWarning(message) {
    this.warnings.push(message);
  }

  /**
   * Generate elegant validation report
   */
  generateReport(validationResult) {
    const { isValid, errors, warnings } = validationResult;
    let report = "=== Resume Data Validation Report ===\n\n";

    report += isValid ? "✅ Validation PASSED\n" : "❌ Validation FAILED\n";

    if (errors.length) {
      report +=
        "\n🚨 ERRORS:\n" +
        errors.map((error, i) => `${i + 1}. ${error}`).join("\n");
    }

    if (warnings.length) {
      report +=
        "\n⚠️ WARNINGS:\n" +
        warnings.map((warning, i) => `${i + 1}. ${warning}`).join("\n");
    }

    if (!errors.length && !warnings.length) {
      report += "\n✨ No issues found!";
    }

    return report;
  }
}

// Export for use in other modules
window.ConfigValidator = ConfigValidator;
