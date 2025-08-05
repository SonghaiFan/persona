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
      this._validateCoreSections
    ]);
  }

  /**
   * Execute validation chain
   * @private
   */
  _validateChain(data, validators) {
    validators.forEach(validator => validator.call(this, data));
    
    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings]
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
    if (!data?.constructor === Object) {
      return this._addError("Data must be a valid object");
    }

    this._checkRequired(data, ['versions'], 'section');
    this._checkRecommended(data, ['education', 'technical_skills', 'projects'], 'section');
  }

  /**
   * Validate version configuration elegantly
   * @private
   */
  _validateVersionConfig(data) {
    const { version_config } = data;
    if (!version_config) return;

    if (!version_config?.constructor === Object) {
      return this._addWarning("version_config should be an object");
    }

    // Validate with type checking
    this._validateField(version_config, 'default_version', 'string', false);
    this._validateField(version_config, 'theme_base', 'string', false);
    this._validateField(version_config, 'available_sections', 'array', false);
    this._validateField(version_config, 'skill_categories', 'array', false);
  }
  /**
   * Validate versions with concise iteration
   * @private
   */
  _validateVersions(data) {
    const { versions } = data;
    if (!versions?.constructor === Object) {
      return this._addError("versions must be an object");
    }

    const versionKeys = Object.keys(versions);
    if (!versionKeys.length) {
      return this._addError("At least one version configuration is required");
    }

    versionKeys.forEach(key => this._validateSingleVersion(key, versions[key]));
  }

  /**
   * Validate single version with elegant field checking
   * @private
   */
  _validateSingleVersion(key, version) {
    const context = `Version "${key}"`;
    
    if (!version?.constructor === Object) {
      return this._addError(`${context}: Configuration must be an object`);
    }

    // Required fields validation
    const requiredFields = [
      ['display_name', 'string'],
      ['summary', 'string'],
      ['skills_focus', 'array'],
      ['sections_order', 'array']
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
      this._addError(`${context}: Invalid theme_color format "${version.theme_color}"`);
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
    this._validateEducation(data.education);
    this._validateTechnicalSkills(data.technical_skills);
    this._validateProjects(data.projects);
    this._validatePublications(data.publications);
  }

    if (version.icon && typeof version.icon !== "string") {
      this.addError(`${context}: icon must be a string`);
    }

    if (version.projects_limit && !Number.isInteger(version.projects_limit)) {
      this.addError(`${context}: projects_limit must be an integer`);
    }

    if (version.project_focus && typeof version.project_focus !== "object") {
      this.addError(`${context}: project_focus must be an object`);
    }

    // Validate skills_focus array contents
    if (version.skills_focus && Array.isArray(version.skills_focus)) {
      if (version.skills_focus.length === 0) {
        this.addWarning(`${context}: skills_focus array is empty`);
      }
      version.skills_focus.forEach((skill) => {
        if (typeof skill !== "string") {
          this.addError(`${context}: All skills_focus items must be strings`);
        }
      });
    }

    // Validate sections_order array contents
    if (version.sections_order && Array.isArray(version.sections_order)) {
      if (version.sections_order.length === 0) {
        this.addWarning(`${context}: sections_order array is empty`);
      }
      version.sections_order.forEach((section) => {
        if (typeof section !== "string") {
          this.addError(`${context}: All sections_order items must be strings`);
        }
      });
    }
  }

  /**
   * Validate core data sections
   * @param {Object} data - Resume data
   */
  validateCoreDataSections(data) {
    // Validate education
    if (data.education) {
      this.validateEducation(data.education);
    }

    // Validate technical_skills
    if (data.technical_skills) {
      this.validateTechnicalSkills(data.technical_skills);
    }

    // Validate projects
    if (data.projects) {
      this.validateProjects(data.projects);
    }

    // Validate publications
    if (data.publications) {
      this.validatePublications(data.publications);
    }

    // Validate phd_research
    if (data.phd_research) {
      this.validatePhDResearch(data.phd_research);
    }
  }

  /**
   * Validate education section
   * @param {Array} education - Education array
   */
  validateEducation(education) {
    if (!Array.isArray(education)) {
      this.addError("education must be an array");
      return;
    }

    education.forEach((edu, index) => {
      const context = `Education item ${index + 1}`;

      if (!edu.degree) {
        this.addError(`${context}: Missing degree field`);
      }
      if (!edu.institution) {
        this.addError(`${context}: Missing institution field`);
      }
      if (!edu.period) {
        this.addError(`${context}: Missing period field`);
      }
    });
  }

  /**
   * Validate Skills section
   * @param {Object} technicalSkills - Skills object
   */
  validateTechnicalSkills(technicalSkills) {
    if (typeof technicalSkills !== "object") {
      this.addError("technical_skills must be an object");
      return;
    }

    Object.entries(technicalSkills).forEach(([category, skillData]) => {
      const context = `Skill category "${category}"`;

      if (!skillData.title) {
        this.addError(`${context}: Missing title field`);
      }

      if (!skillData.items || !Array.isArray(skillData.items)) {
        this.addError(`${context}: items must be an array`);
        return;
      }

      skillData.items.forEach((item, index) => {
        const itemContext = `${context}, item ${index + 1}`;

        if (!item.name) {
          this.addError(`${itemContext}: Missing name field`);
        }

        if (
          item.level &&
          (!Number.isInteger(item.level) || item.level < 1 || item.level > 5)
        ) {
          this.addError(
            `${itemContext}: level must be an integer between 1 and 5`
          );
        }

        if (item.keywords && !Array.isArray(item.keywords)) {
          this.addError(`${itemContext}: keywords must be an array`);
        }
      });
    });
  }

  /**
   * Validate projects section
   * @param {Array} projects - Projects array
   */
  validateProjects(projects) {
    if (!Array.isArray(projects)) {
      this.addError("projects must be an array");
      return;
    }

    projects.forEach((project, index) => {
      const context = `Project ${index + 1}`;

      if (!project.title) {
        this.addError(`${context}: Missing title field`);
      }

      if (project.features && !Array.isArray(project.features)) {
        this.addError(`${context}: features must be an array`);
      }

      if (project.items && !Array.isArray(project.items)) {
        this.addError(`${context}: items must be an array`);
      }
    });
  }

  /**
   * Validate publications section
   * @param {Array} publications - Publications array
   */
  validatePublications(publications) {
    if (!Array.isArray(publications)) {
      this.addError("publications must be an array");
      return;
    }

    publications.forEach((pub, index) => {
      const context = `Publication ${index + 1}`;

      const requiredFields = ["title", "authors", "venue", "year", "type"];
      requiredFields.forEach((field) => {
        if (!pub[field]) {
          this.addError(`${context}: Missing ${field} field`);
        }
      });

      if (pub.year && !Number.isInteger(parseInt(pub.year))) {
        this.addWarning(`${context}: Year should be a valid integer`);
      }
    });
  }

  /**
   * Validate PhD research section
   * @param {Object} phdResearch - PhD research object
   */
  validatePhDResearch(phdResearch) {
    if (typeof phdResearch !== "object") {
      this.addError("phd_research must be an object");
      return;
    }

    if (!phdResearch.sections || !Array.isArray(phdResearch.sections)) {
      this.addError("phd_research.sections must be an array");
      return;
    }

    phdResearch.sections.forEach((section, index) => {
      const context = `PhD research section ${index + 1}`;

      if (!section.title) {
        this.addError(`${context}: Missing title field`);
      }

      if (!section.items || !Array.isArray(section.items)) {
        this.addError(`${context}: items must be an array`);
      }
    });
  }

  /**
   * Validate field type
   * @param {*} value - Value to validate
   * @param {string} expectedType - Expected type
   * @returns {boolean} True if type matches
   */
  validateFieldType(value, expectedType) {
    switch (expectedType) {
      case "string":
        return typeof value === "string";
      case "array":
        return Array.isArray(value);
      case "object":
        return typeof value === "object" && !Array.isArray(value);
      case "number":
        return typeof value === "number";
      case "boolean":
        return typeof value === "boolean";
      default:
        return false;
    }
  }

  /**
   * Check if string is valid hex color
   * @param {string} color - Color string to validate
   * @returns {boolean} True if valid hex color
   */
  isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  /**
   * Add error to validation results
   * @param {string} message - Error message
   */
  addError(message) {
    this.errors.push(message);
  }

  /**
   * Add warning to validation results
   * @param {string} message - Warning message
   */
  addWarning(message) {
    this.warnings.push(message);
  }

  /**
   * Generate validation report
   * @param {Object} validationResult - Result from validateResumeData
   * @returns {string} Formatted validation report
   */
  generateReport(validationResult) {
    let report = "=== Resume Data Validation Report ===\n\n";

    if (validationResult.isValid) {
      report += "✅ Validation PASSED\n";
    } else {
      report += "❌ Validation FAILED\n";
    }

    if (validationResult.errors.length > 0) {
      report += "\n🚨 ERRORS:\n";
      validationResult.errors.forEach((error, index) => {
        report += `${index + 1}. ${error}\n`;
      });
    }

    if (validationResult.warnings.length > 0) {
      report += "\n⚠️  WARNINGS:\n";
      validationResult.warnings.forEach((warning, index) => {
        report += `${index + 1}. ${warning}\n`;
      });
    }

    if (
      validationResult.errors.length === 0 &&
      validationResult.warnings.length === 0
    ) {
      report += "\n✨ No issues found!";
    }

    return report;
  }
}

// Export for use in other modules
window.ConfigValidator = ConfigValidator;
