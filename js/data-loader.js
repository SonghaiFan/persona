// Data Loader - Handle loading and merging multiple data files
class DataLoader {
  constructor() {
    this.profileData = null;
    this.versionsData = null;
    this.mergedData = null;
  }

  /**
   * Load all data files
   * @returns {Promise<Object>} Merged data object
   */
  async loadData() {
    try {
      // Load both files in parallel
      const [profileResponse, versionsResponse] = await Promise.all([
        fetch('data/profile.json'),
        fetch('data/versions.json')
      ]);

      // Check if responses are ok
      if (!profileResponse.ok) {
        throw new Error(`Failed to load profile.json: ${profileResponse.status} ${profileResponse.statusText}`);
      }
      if (!versionsResponse.ok) {
        throw new Error(`Failed to load versions.json: ${versionsResponse.status} ${versionsResponse.statusText}`);
      }

      // Parse JSON data
      this.profileData = await profileResponse.json();
      this.versionsData = await versionsResponse.json();

      // Merge and validate data
      this.mergedData = this.mergeData(this.profileData, this.versionsData);
      
      console.log('✅ Successfully loaded and merged data files');
      return this.mergedData;

    } catch (error) {
      console.error('❌ Failed to load data:', error.message);
      
      // Try fallback to legacy data.json
      return await this.loadLegacyData();
    }
  }

  /**
   * Fallback to legacy data.json if new structure fails
   * @returns {Promise<Object>} Legacy data object
   */
  async loadLegacyData() {
    try {
      console.warn('⚠️ Falling back to legacy data.json structure');
      const response = await fetch('data/data.json');
      
      if (!response.ok) {
        throw new Error(`Failed to load data.json: ${response.status} ${response.statusText}`);
      }
      
      const legacyData = await response.json();
      console.log('✅ Successfully loaded legacy data.json');
      return legacyData;

    } catch (error) {
      console.error('❌ Failed to load legacy data:', error.message);
      throw new Error('Could not load any data files. Please check your data structure.');
    }
  }

  /**
   * Merge profile and versions data
   * @param {Object} profile - Profile data
   * @param {Object} versions - Versions configuration
   * @returns {Object} Merged data object
   */
  mergeData(profile, versions) {
    // Validate input data
    if (!profile || typeof profile !== 'object') {
      throw new Error('Invalid profile data structure');
    }
    if (!versions || typeof versions !== 'object' || !versions.versions) {
      throw new Error('Invalid versions data structure');
    }

    // Create merged data structure
    const merged = {
      // Version configuration (legacy compatibility)
      version_config: versions.config || {
        default_version: Object.keys(versions.versions)[0],
        theme_base: 'theme-',
        available_sections: ['summary', 'technical_skills', 'projects', 'phd_research', 'education', 'publications', 'certifications'],
        skill_categories: this.getAvailableSkillCategories(profile)
      },

      // Version definitions with merged content
      versions: this.mergeVersionsWithProfile(versions.versions, profile),

      // Base profile data (for legacy compatibility and direct access)
      ...profile
    };

    return merged;
  }

  /**
   * Merge version configurations with profile data
   * @param {Object} versions - Version configurations
   * @param {Object} profile - Profile data
   * @returns {Object} Merged versions object
   */
  mergeVersionsWithProfile(versions, profile) {
    const mergedVersions = {};

    Object.entries(versions).forEach(([versionKey, versionConfig]) => {
      mergedVersions[versionKey] = {
        // Basic version info
        display_name: versionConfig.display_name,
        theme_color: versionConfig.theme_color,
        icon: versionConfig.icon,
        summary: versionConfig.summary,

        // Content configuration (legacy compatibility) - validate skills exist
        skills_focus: this.validateSkillsFocus(versionConfig.content_config?.skills_focus, profile),
        sections_order: versionConfig.content_config?.sections_order || ['summary', 'technical_skills', 'projects', 'education'],
        projects_limit: versionConfig.content_config?.projects_limit || 5,

        // Project focus (legacy compatibility)
        project_focus: this.generateProjectFocus(versionConfig, profile),

        // New structured content config
        content_config: versionConfig.content_config,
        content_overrides: versionConfig.content_overrides
      };
    });

    return mergedVersions;
  }

  /**
   * Generate project focus mapping for legacy compatibility
   * @param {Object} versionConfig - Version configuration
   * @param {Object} profile - Profile data
   * @returns {Object} Project focus mapping
   */
  generateProjectFocus(versionConfig, profile) {
    const projectFocus = {};
    
    if (versionConfig.content_overrides?.project_descriptions) {
      // Map project IDs to titles for legacy compatibility
      const projectIdToTitle = {};
      if (profile.projects) {
        profile.projects.forEach(project => {
          projectIdToTitle[project.id] = project.title;
        });
      }

      // Convert ID-based overrides to title-based for legacy system
      Object.entries(versionConfig.content_overrides.project_descriptions).forEach(([projectId, description]) => {
        const projectTitle = projectIdToTitle[projectId];
        if (projectTitle) {
          projectFocus[projectTitle] = description;
        }
      });
    }

    return projectFocus;
  }

  /**
   * Get filtered projects for a specific version
   * @param {string} versionKey - Version identifier
   * @returns {Array} Filtered projects array
   */
  getVersionProjects(versionKey) {
    if (!this.mergedData || !this.profileData) {
      return [];
    }

    const versionConfig = this.versionsData.versions[versionKey];
    if (!versionConfig) {
      return this.profileData.projects || [];
    }

    const includeProjects = versionConfig.content_config?.include_projects;
    if (!includeProjects) {
      return this.profileData.projects || [];
    }

    // Filter projects by ID and apply overrides
    const filteredProjects = this.profileData.projects
      .filter(project => includeProjects.includes(project.id))
      .map(project => {
        const override = versionConfig.content_overrides?.project_descriptions?.[project.id];
        if (override) {
          return { ...project, description: override };
        }
        return project;
      });

    // Limit number of projects
    const limit = versionConfig.content_config?.projects_limit || filteredProjects.length;
    return filteredProjects.slice(0, limit);
  }

  /**
   * Get version-specific skill categories
   * @param {string} versionKey - Version identifier
   * @returns {Array} Ordered skill categories
   */
  getVersionSkillCategories(versionKey) {
    if (!this.versionsData) {
      return [];
    }

    const versionConfig = this.versionsData.versions[versionKey];
    return versionConfig?.content_config?.skills_focus || [];
  }

  /**
   * Get version-specific sections order
   * @param {string} versionKey - Version identifier
   * @returns {Array} Ordered sections array
   */
  getVersionSectionsOrder(versionKey) {
    if (!this.versionsData) {
      return [];
    }

    const versionConfig = this.versionsData.versions[versionKey];
    return versionConfig?.content_config?.sections_order || [];
  }

  /**
   * Validate data structure after loading
   * @returns {Object} Validation result
   */
  validateData() {
    if (!this.mergedData) {
      return { isValid: false, error: 'No data loaded' };
    }

    // Basic structure validation
    if (!this.mergedData.versions || Object.keys(this.mergedData.versions).length === 0) {
      return { isValid: false, error: 'No versions configured' };
    }

    return { isValid: true };
  }

  /**
   * Get data loading statistics
   * @returns {Object} Statistics about loaded data
   */
  getLoadingStats() {
    if (!this.mergedData) {
      return { loaded: false };
    }

    return {
      loaded: true,
      structure: 'separated', // or 'legacy'
      versions: Object.keys(this.mergedData.versions).length,
      projects: this.profileData?.projects?.length || 0,
      publications: this.profileData?.publications?.length || 0,
      skills: this.profileData?.technical_skills ? Object.keys(this.profileData.technical_skills).length : 0,
      sections: this.mergedData.version_config?.available_sections?.length || 0
    };
  }

  /**
   * Get available skill categories from profile data
   * @param {Object} profile - Profile data
   * @returns {Array} Available skill category keys
   */
  getAvailableSkillCategories(profile) {
    if (!profile || !profile.technical_skills) {
      return [];
    }
    return Object.keys(profile.technical_skills);
  }

  /**
   * Validate that skills focus references exist in profile
   * @param {Array} skillsFocus - Skills focus array from version
   * @param {Object} profile - Profile data
   * @returns {Array} Valid skill categories only
   */
  validateSkillsFocus(skillsFocus, profile) {
    if (!skillsFocus || !Array.isArray(skillsFocus)) {
      return this.getAvailableSkillCategories(profile);
    }

    const availableCategories = this.getAvailableSkillCategories(profile);
    const validCategories = skillsFocus.filter(category => 
      availableCategories.includes(category)
    );

    // Warn about invalid categories
    const invalidCategories = skillsFocus.filter(category => 
      !availableCategories.includes(category)
    );
    
    if (invalidCategories.length > 0) {
      console.warn(`⚠️ Invalid skill categories found: ${invalidCategories.join(', ')}`);
      console.warn(`📋 Available categories: ${availableCategories.join(', ')}`);
    }

    return validCategories.length > 0 ? validCategories : availableCategories;
  }

  /**
   * Reload data (useful for development)
   * @returns {Promise<Object>} Reloaded data
   */
  async reload() {
    console.log('🔄 Reloading data...');
    this.profileData = null;
    this.versionsData = null;
    this.mergedData = null;
    return await this.loadData();
  }
}

// Export for use in other modules
window.DataLoader = DataLoader;