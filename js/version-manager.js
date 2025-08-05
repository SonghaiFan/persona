// Version Manager - Dynamic version configuration and validation
class VersionManager {
  constructor() {
    this.versions = {};
    this.versionConfig = {};
    this.currentVersion = null;
    this.themeManager = new ThemeManager();
  }

  /**
   * Initialize version manager with data validation and setup
   * @param {Object} data - Complete resume data including versions
   */
  initialize(data) {
    this._validateAndLogResults(data);
    this._setupConfiguration(data);
    this._initializeUI();
  }

  /**
   * Validate data and log results
   * @private
   */
  _validateAndLogResults(data) {
    const { isValid, errors, warnings } =
      new ConfigValidator().validateResumeData(data);

    const logMessages = (messages, type, icon) =>
      messages.forEach((msg) => console[type](`  - ${msg}`));

    if (!isValid) {
      console.error("❌ Resume data validation failed:");
      logMessages(errors, "error");

      if (errors.some((error) => error.includes("versions"))) {
        throw new Error(
          "Critical validation errors found. Cannot initialize version manager."
        );
      }
    }

    if (warnings.length) {
      console.warn("⚠️ Resume data validation warnings:");
      logMessages(warnings, "warn");
    }

    if (isValid) console.log("✅ Resume data validation passed");
  }

  /**
   * Setup configuration from data
   * @private
   */
  _setupConfiguration(data) {
    this.versions = data.versions;
    this.versionConfig = data.version_config || this.getDefaultConfig();
    this.currentVersion =
      this.versionConfig.default_version || Object.keys(this.versions)[0];
  }

  /**
   * Initialize UI components
   * @private
   */
  _initializeUI() {
    this.themeManager.generateThemeCSS(
      this.versions,
      this.versionConfig.theme_base
    );
    this.initializeVersionSelector();
  }

  /**
   * Get default configuration with modern defaults
   */
  getDefaultConfig() {
    return {
      default_version: Object.keys(this.versions)?.[0],
      theme_base: "theme-",
      available_sections: [
        "summary",
        "technical_skills",
        "projects",
        "phd_research",
        "education",
        "publications",
        "certifications",
      ],
      skill_categories: [
        "ai_ml",
        "data_science",
        "web_technologies",
        "research_skills",
      ],
    };
  }

  /**
   * Validate data structure with comprehensive checks
   * @param {Object} data - Resume data to validate
   */
  validateDataStructure(data) {
    const { versions } = data;

    if (!versions || typeof versions !== "object") {
      throw new Error("Invalid data structure: versions object is required");
    }

    const versionKeys = Object.keys(versions);
    if (!versionKeys.length) {
      throw new Error("At least one version configuration is required");
    }

    // Validate each version with better error context
    versionKeys.forEach((key) =>
      this.validateVersionConfig(key, versions[key])
    );
  }

  /**
   * Validate individual version configuration with smart defaults
   * @param {string} key - Version key
   * @param {Object} version - Version configuration
   */
  validateVersionConfig(key, version) {
    const requiredFields = [
      "display_name",
      "summary",
      "skills_focus",
      "sections_order",
    ];
    const missingFields = requiredFields.filter((field) => !version[field]);

    if (missingFields.length) {
      throw new Error(
        `Version "${key}" is missing required fields: ${missingFields.join(
          ", "
        )}`
      );
    }

    // Validate and set theme color with fallback
    if (
      version.theme_color &&
      !this.themeManager.isValidHexColor(version.theme_color)
    ) {
      console.warn(
        `Version "${key}" has invalid theme_color: ${version.theme_color}. Using default.`
      );
    }

    // Apply smart defaults
    Object.assign(version, {
      theme_color: version.theme_color || "#666666",
      icon: version.icon || "fas fa-file-alt",
      projects_limit: version.projects_limit || 5,
      project_focus: version.project_focus || {},
    });
  }

  /**
   * Initialize version selector dropdown with modern DOM manipulation
   */
  initializeVersionSelector() {
    const versionSelect = document.getElementById("versionSelect");
    if (!versionSelect) {
      console.error("Version selector element not found");
      return;
    }

    // Clear and populate options efficiently
    versionSelect.innerHTML = "";
    const fragment = document.createDocumentFragment();

    Object.entries(this.versions).forEach(([key, version]) => {
      const option = new Option(version.display_name, key);
      if (version.icon) option.setAttribute("data-icon", version.icon);
      fragment.appendChild(option);
    });

    versionSelect.appendChild(fragment);
    versionSelect.value = this.currentVersion;

    // Single event listener with arrow function
    versionSelect.addEventListener("change", (e) =>
      this.switchVersion(e.target.value)
    );
  }

  /**
   * Switch to different version with validation and event dispatch
   * @param {string} versionKey - Version to switch to
   */
  switchVersion(versionKey) {
    if (!this.versions[versionKey]) {
      console.error(`Version "${versionKey}" not found`);
      return;
    }

    this.currentVersion = versionKey;
    this.themeManager.applyTheme(versionKey, this.versionConfig.theme_base);
    this._dispatchVersionChangeEvent(versionKey);
  }

  /**
   * Dispatch custom version change event
   * @private
   */
  _dispatchVersionChangeEvent(versionKey) {
    document.dispatchEvent(
      new CustomEvent("versionChanged", {
        detail: {
          version: versionKey,
          config: this.versions[versionKey],
        },
      })
    );
  }

  // ==========================================================================
  // PUBLIC API METHODS - Getters and Data Access
  // ==========================================================================

  /**
   * Get current version configuration
   */
  getCurrentVersionConfig() {
    return this.versions[this.currentVersion];
  }

  /**
   * Get all available versions
   */
  getAllVersions() {
    return this.versions;
  }

  // ==========================================================================
  // VERSION MANAGEMENT - Add, Remove, Import/Export
  // ==========================================================================

  /**
   * Add new version with validation and UI refresh
   * @param {string} key - Version key
   * @param {Object} config - Version configuration
   */
  addVersion(key, config) {
    try {
      this.validateVersionConfig(key, config);
      this.versions[key] = config;
      this._refreshVersionUI();
      console.log(`Version "${key}" added successfully`);
    } catch (error) {
      console.error(`Failed to add version "${key}":`, error.message);
    }
  }

  /**
   * Remove version with safety checks
   * @param {string} key - Version key to remove
   */
  removeVersion(key) {
    if (Object.keys(this.versions).length <= 1) {
      console.error("Cannot remove the last remaining version");
      return;
    }

    if (this.currentVersion === key) {
      const remainingVersions = Object.keys(this.versions).filter(
        (v) => v !== key
      );
      this.switchVersion(remainingVersions[0]);
    }

    delete this.versions[key];
    this._refreshVersionUI();
    console.log(`Version "${key}" removed successfully`);
  }

  /**
   * Refresh version-related UI components
   * @private
   */
  _refreshVersionUI() {
    this.themeManager.generateThemeCSS(
      this.versions,
      this.versionConfig.theme_base
    );
    this.initializeVersionSelector();
  }

  // ==========================================================================
  // ANALYTICS & UTILITIES - Statistics and Configuration Management
  // ==========================================================================

  /**
   * Get comprehensive version statistics
   */
  getVersionStats() {
    const versions = Object.entries(this.versions);
    return {
      total: versions.length,
      current: this.currentVersion,
      themes: versions.map(([key, config]) => ({
        key,
        name: config.display_name,
        color: config.theme_color,
      })),
      sections: [
        ...new Set(versions.flatMap(([_, config]) => config.sections_order)),
      ],
      skills: [
        ...new Set(versions.flatMap(([_, config]) => config.skills_focus)),
      ],
    };
  }

  /**
   * Export configuration for backup with metadata
   */
  exportConfiguration() {
    return {
      version_config: this.versionConfig,
      versions: this.versions,
      current_version: this.currentVersion,
      exported_at: new Date().toISOString(),
    };
  }

  /**
   * Import configuration with validation and error handling
   * @param {Object} config - Configuration to import
   */
  importConfiguration(config) {
    try {
      if (!config.versions) {
        throw new Error("Invalid configuration: missing versions");
      }

      this.validateDataStructure(config);

      // Update configuration
      Object.assign(this, {
        versions: config.versions,
        versionConfig: config.version_config || this.versionConfig,
        currentVersion:
          config.current_version || Object.keys(config.versions)[0],
      });

      // Refresh UI
      this._refreshVersionUI();
      this.switchVersion(this.currentVersion);

      console.log("Configuration imported successfully");
    } catch (error) {
      console.error("Failed to import configuration:", error.message);
    }
  }
}

// Export for use in other modules
window.VersionManager = VersionManager;
