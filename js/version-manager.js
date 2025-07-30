// Version Manager - Dynamic version configuration and validation
class VersionManager {
  constructor() {
    this.versions = {};
    this.versionConfig = {};
    this.currentVersion = null;
    this.themeManager = new ThemeManager();
  }

  /**
   * Initialize version manager with data
   * @param {Object} data - Complete resume data including versions
   */
  initialize(data) {
    // Validate data using ConfigValidator
    const validator = new ConfigValidator();
    const validationResult = validator.validateResumeData(data);
    
    if (!validationResult.isValid) {
      console.error('❌ Resume data validation failed:');
      validationResult.errors.forEach(error => console.error(`  - ${error}`));
      
      // Still try to continue with warnings
      if (validationResult.errors.some(error => error.includes('versions'))) {
        throw new Error('Critical validation errors found. Cannot initialize version manager.');
      }
    }
    
    if (validationResult.warnings.length > 0) {
      console.warn('⚠️ Resume data validation warnings:');
      validationResult.warnings.forEach(warning => console.warn(`  - ${warning}`));
    }
    
    if (validationResult.isValid) {
      console.log('✅ Resume data validation passed');
    }
    
    this.versions = data.versions;
    this.versionConfig = data.version_config || this.getDefaultConfig();
    this.currentVersion = this.versionConfig.default_version || Object.keys(this.versions)[0];
    
    // Generate dynamic themes
    this.themeManager.generateThemeCSS(this.versions, this.versionConfig.theme_base);
    
    // Initialize version selector
    this.initializeVersionSelector();
  }

  /**
   * Get default configuration if not provided
   */
  getDefaultConfig() {
    return {
      default_version: Object.keys(this.versions)[0],
      theme_base: 'theme-',
      available_sections: ['summary', 'technical_skills', 'projects', 'phd_research', 'education', 'publications', 'certifications'],
      skill_categories: ['ai_ml', 'data_science', 'web_technologies', 'research_skills']
    };
  }

  /**
   * Validate data structure
   * @param {Object} data - Resume data to validate
   */
  validateDataStructure(data) {
    if (!data.versions || typeof data.versions !== 'object') {
      throw new Error('Invalid data structure: versions object is required');
    }

    if (Object.keys(data.versions).length === 0) {
      throw new Error('At least one version configuration is required');
    }

    // Validate each version
    Object.entries(data.versions).forEach(([key, version]) => {
      this.validateVersionConfig(key, version);
    });
  }

  /**
   * Validate individual version configuration
   * @param {string} key - Version key
   * @param {Object} version - Version configuration
   */
  validateVersionConfig(key, version) {
    const requiredFields = ['display_name', 'summary', 'skills_focus', 'sections_order'];
    const missingFields = requiredFields.filter(field => !version[field]);
    
    if (missingFields.length > 0) {
      throw new Error(`Version "${key}" is missing required fields: ${missingFields.join(', ')}`);
    }

    // Validate theme color if provided
    if (version.theme_color && !this.themeManager.isValidHexColor(version.theme_color)) {
      console.warn(`Version "${key}" has invalid theme_color: ${version.theme_color}. Using default.`);
      version.theme_color = '#666666'; // Default color
    }

    // Set defaults for optional fields
    version.theme_color = version.theme_color || '#666666';
    version.icon = version.icon || 'fas fa-file-alt';
    version.projects_limit = version.projects_limit || 5;
    version.project_focus = version.project_focus || {};
  }

  /**
   * Initialize version selector dropdown
   */
  initializeVersionSelector() {
    const versionSelect = document.getElementById('versionSelect');
    if (!versionSelect) {
      console.error('Version selector element not found');
      return;
    }

    // Clear existing options
    versionSelect.innerHTML = '';

    // Generate options from versions
    Object.entries(this.versions).forEach(([key, version]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = version.display_name;
      
      // Add icon if available
      if (version.icon) {
        option.setAttribute('data-icon', version.icon);
      }
      
      versionSelect.appendChild(option);
    });

    // Set current version
    versionSelect.value = this.currentVersion;

    // Add event listener
    versionSelect.addEventListener('change', (e) => {
      this.switchVersion(e.target.value);
    });
  }

  /**
   * Switch to a different version
   * @param {string} versionKey - Version to switch to
   */
  switchVersion(versionKey) {
    if (!this.versions[versionKey]) {
      console.error(`Version "${versionKey}" not found`);
      return;
    }

    this.currentVersion = versionKey;
    
    // Apply theme
    this.themeManager.applyTheme(versionKey, this.versionConfig.theme_base);
    
    // Trigger version change event
    this.dispatchVersionChangeEvent(versionKey);
  }

  /**
   * Dispatch custom event for version change
   * @param {string} versionKey - New version key
   */
  dispatchVersionChangeEvent(versionKey) {
    const event = new CustomEvent('versionChanged', {
      detail: {
        version: versionKey,
        config: this.versions[versionKey]
      }
    });
    document.dispatchEvent(event);
  }

  /**
   * Get current version configuration
   * @returns {Object} Current version configuration
   */
  getCurrentVersionConfig() {
    return this.versions[this.currentVersion];
  }

  /**
   * Get all available versions
   * @returns {Object} All version configurations
   */
  getAllVersions() {
    return this.versions;
  }

  /**
   * Add a new version dynamically
   * @param {string} key - Version key
   * @param {Object} config - Version configuration
   */
  addVersion(key, config) {
    try {
      this.validateVersionConfig(key, config);
      this.versions[key] = config;
      
      // Regenerate themes
      this.themeManager.generateThemeCSS(this.versions, this.versionConfig.theme_base);
      
      // Refresh version selector
      this.initializeVersionSelector();
      
      console.log(`Version "${key}" added successfully`);
    } catch (error) {
      console.error(`Failed to add version "${key}":`, error.message);
    }
  }

  /**
   * Remove a version
   * @param {string} key - Version key to remove
   */
  removeVersion(key) {
    if (Object.keys(this.versions).length <= 1) {
      console.error('Cannot remove the last remaining version');
      return;
    }

    if (this.currentVersion === key) {
      // Switch to first available version
      const remainingVersions = Object.keys(this.versions).filter(v => v !== key);
      this.switchVersion(remainingVersions[0]);
    }

    delete this.versions[key];
    
    // Regenerate themes
    this.themeManager.generateThemeCSS(this.versions, this.versionConfig.theme_base);
    
    // Refresh version selector
    this.initializeVersionSelector();
    
    console.log(`Version "${key}" removed successfully`);
  }

  /**
   * Get version statistics
   * @returns {Object} Statistics about versions
   */
  getVersionStats() {
    const versions = Object.entries(this.versions);
    return {
      total: versions.length,
      current: this.currentVersion,
      themes: versions.map(([key, config]) => ({
        key,
        name: config.display_name,
        color: config.theme_color
      })),
      sections: [...new Set(versions.flatMap(([_, config]) => config.sections_order))],
      skills: [...new Set(versions.flatMap(([_, config]) => config.skills_focus))]
    };
  }

  /**
   * Export version configuration for backup
   * @returns {Object} Exportable version configuration
   */
  exportConfiguration() {
    return {
      version_config: this.versionConfig,
      versions: this.versions,
      current_version: this.currentVersion,
      exported_at: new Date().toISOString()
    };
  }

  /**
   * Import version configuration
   * @param {Object} config - Configuration to import
   */
  importConfiguration(config) {
    try {
      if (config.versions) {
        this.validateDataStructure(config);
        this.versions = config.versions;
        this.versionConfig = config.version_config || this.versionConfig;
        this.currentVersion = config.current_version || Object.keys(this.versions)[0];
        
        this.themeManager.generateThemeCSS(this.versions, this.versionConfig.theme_base);
        this.initializeVersionSelector();
        this.switchVersion(this.currentVersion);
        
        console.log('Configuration imported successfully');
      }
    } catch (error) {
      console.error('Failed to import configuration:', error.message);
    }
  }
}

// Export for use in other modules
window.VersionManager = VersionManager;