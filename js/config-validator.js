// Configuration Validator - Validate resume data structure and version configurations
class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate complete resume data structure
   * @param {Object} data - Resume data to validate
   * @returns {Object} Validation result with errors and warnings
   */
  validateResumeData(data) {
    this.reset();

    // Validate top-level structure
    this.validateTopLevelStructure(data);

    // Validate version configuration
    if (data.version_config) {
      this.validateVersionConfig(data.version_config);
    }

    // Validate versions
    if (data.versions) {
      this.validateVersions(data.versions);
    }

    // Validate core data sections
    this.validateCoreDataSections(data);

    return {
      isValid: this.errors.length === 0,
      errors: [...this.errors],
      warnings: [...this.warnings],
    };
  }

  /**
   * Reset validation state
   */
  reset() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate top-level data structure
   * @param {Object} data - Resume data
   */
  validateTopLevelStructure(data) {
    if (!data || typeof data !== "object") {
      this.addError("Data must be a valid object");
      return;
    }

    // Required top-level sections
    const requiredSections = ["versions"];
    requiredSections.forEach((section) => {
      if (!data[section]) {
        this.addError(`Missing required section: ${section}`);
      }
    });

    // Recommended sections
    const recommendedSections = ["education", "technical_skills", "projects"];
    recommendedSections.forEach((section) => {
      if (!data[section]) {
        this.addWarning(`Recommended section missing: ${section}`);
      }
    });
  }

  /**
   * Validate version configuration
   * @param {Object} versionConfig - Version configuration object
   */
  validateVersionConfig(versionConfig) {
    if (!versionConfig || typeof versionConfig !== "object") {
      this.addWarning("version_config should be an object");
      return;
    }

    // Validate default_version
    if (
      versionConfig.default_version &&
      typeof versionConfig.default_version !== "string"
    ) {
      this.addError("version_config.default_version must be a string");
    }

    // Validate theme_base
    if (
      versionConfig.theme_base &&
      typeof versionConfig.theme_base !== "string"
    ) {
      this.addError("version_config.theme_base must be a string");
    }

    // Validate available_sections
    if (versionConfig.available_sections) {
      if (!Array.isArray(versionConfig.available_sections)) {
        this.addError("version_config.available_sections must be an array");
      } else if (versionConfig.available_sections.length === 0) {
        this.addWarning("version_config.available_sections is empty");
      }
    }

    // Validate skill_categories
    if (versionConfig.skill_categories) {
      if (!Array.isArray(versionConfig.skill_categories)) {
        this.addError("version_config.skill_categories must be an array");
      }
    }
  }

  /**
   * Validate all versions
   * @param {Object} versions - Versions object
   */
  validateVersions(versions) {
    if (!versions || typeof versions !== "object") {
      this.addError("versions must be an object");
      return;
    }

    const versionKeys = Object.keys(versions);
    if (versionKeys.length === 0) {
      this.addError("At least one version configuration is required");
      return;
    }

    versionKeys.forEach((key) => {
      this.validateSingleVersion(key, versions[key]);
    });
  }

  /**
   * Validate a single version configuration
   * @param {string} key - Version key
   * @param {Object} version - Version configuration
   */
  validateSingleVersion(key, version) {
    const context = `Version "${key}"`;

    if (!version || typeof version !== "object") {
      this.addError(`${context}: Configuration must be an object`);
      return;
    }

    // Required fields
    const requiredFields = [
      { name: "display_name", type: "string" },
      { name: "summary", type: "string" },
      { name: "skills_focus", type: "array" },
      { name: "sections_order", type: "array" },
    ];

    requiredFields.forEach((field) => {
      if (!version[field.name]) {
        this.addError(`${context}: Missing required field "${field.name}"`);
      } else if (!this.validateFieldType(version[field.name], field.type)) {
        this.addError(
          `${context}: Field "${field.name}" must be of type ${field.type}`
        );
      }
    });

    // Optional fields with validation
    if (version.theme_color && !this.isValidHexColor(version.theme_color)) {
      this.addError(
        `${context}: Invalid theme_color format "${version.theme_color}"`
      );
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
