// Data Loader - Elegant data loading and merging
class DataLoader {
  constructor() {
    this.profileData = null;
    this.versionsData = null;
    this.mergedData = null;
  }

  /**
   * Load all data files with elegant error handling
   */
  async loadData() {
    try {
      const [profile, versions] = await this._loadFiles([
        "profile.json",
        "versions.json",
      ]);
      this.profileData = profile;
      this.versionsData = versions;
      this.mergedData = this._mergeData(profile, versions);

      console.log("✅ Successfully loaded and merged data files");
      return this.mergedData;
    } catch (error) {
      console.error("❌ Failed to load data:", error.message);
      return await this._loadLegacyFallback();
    }
  }

  /**
   * Load multiple files in parallel
   * @private
   */
  async _loadFiles(filenames) {
    const responses = await Promise.all(
      filenames.map((filename) => fetch(`data/${filename}`))
    );

    // Check all responses are ok
    responses.forEach((response, index) => {
      if (!response.ok) {
        throw new Error(
          `Failed to load ${filenames[index]}: ${response.status}`
        );
      }
    });

    return Promise.all(responses.map((response) => response.json()));
  }

  /**
   * Elegant fallback to legacy structure
   * @private
   */
  async _loadLegacyFallback() {
    console.warn("⚠️ Falling back to legacy data.json structure");
    try {
      const [legacyData] = await this._loadFiles(["data.json"]);
      console.log("✅ Successfully loaded legacy data.json");
      return legacyData;
    } catch {
      throw new Error(
        "Could not load any data files. Please check your data structure."
      );
    }
  }

  /**
   * Merge profile and versions data elegantly
   * @private
   */
  _mergeData(profile, versions) {
    this._validateInputData(profile, versions);

    return {
      version_config: versions.config || this._createDefaultConfig(profile),
      versions: this._mergeVersionsWithProfile(versions.versions, profile),
      ...profile, // Spread profile data for legacy compatibility
    };
  }

  /**
   * Validate input data structure
   * @private
   */
  _validateInputData(profile, versions) {
    if (!profile?.constructor === Object) {
      throw new Error("Invalid profile data structure");
    }
    if (!versions?.versions) {
      throw new Error("Invalid versions data structure");
    }
  }

  /**
   * Create default configuration
   * @private
   */
  _createDefaultConfig(profile) {
    return {
      default_version: Object.keys(this.versionsData.versions)[0],
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
      skill_categories: Object.keys(profile.technical_skills || {}),
    };
  }

  /**
   * Merge versions with profile data using modern techniques
   * @private
   */
  _mergeVersionsWithProfile(versions, profile) {
    return Object.fromEntries(
      Object.entries(versions).map(([key, config]) => [
        key,
        {
          display_name: config.display_name,
          theme_color: config.theme_color,
          icon: config.icon,
          summary: config.summary,
          skills_focus: this._validateSkillsFocus(
            config.content_config?.skills_focus,
            profile
          ),
          sections_order: config.content_config?.sections_order || [
            "summary",
            "technical_skills",
            "projects",
            "education",
          ],
          projects_limit: config.content_config?.projects_limit || 5,
          project_focus: this._generateProjectFocus(config, profile),
          content_config: config.content_config,
          content_overrides: config.content_overrides,
        },
      ])
    );
  }

  /**
   * Generate project focus mapping with modern destructuring
   * @private
   */
  _generateProjectFocus(versionConfig, profile) {
    const projectOverrides =
      versionConfig.content_overrides?.project_descriptions;
    if (!projectOverrides) return {};

    const projectIdToTitle = Object.fromEntries(
      (profile.projects || []).map(({ id, title }) => [id, title])
    );

    return Object.fromEntries(
      Object.entries(projectOverrides)
        .map(([id, description]) => [projectIdToTitle[id], description])
        .filter(([title]) => title) // Filter out undefined titles
    );
  }

  // ==========================================================================
  // PUBLIC API - Data Access Methods
  // ==========================================================================

  /**
   * Get filtered projects for specific version
   */
  getVersionProjects(versionKey) {
    if (!this.mergedData?.profileData) return [];

    const { content_config, content_overrides } =
      this.versionsData.versions[versionKey] || {};
    const { include_projects, projects_limit = Infinity } =
      content_config || {};

    return (this.profileData.projects || [])
      .filter(
        (project) => !include_projects || include_projects.includes(project.id)
      )
      .map((project) => ({
        ...project,
        description:
          content_overrides?.project_descriptions?.[project.id] ||
          project.description,
      }))
      .slice(0, projects_limit);
  }

  /**
   * Get version-specific skill categories
   */
  getVersionSkillCategories(versionKey) {
    return (
      this.versionsData?.versions[versionKey]?.content_config?.skills_focus ||
      []
    );
  }

  /**
   * Get version-specific sections order
   */
  getVersionSectionsOrder(versionKey) {
    return (
      this.versionsData?.versions[versionKey]?.content_config?.sections_order ||
      []
    );
  }

  // ==========================================================================
  // VALIDATION & UTILITIES
  // ==========================================================================

  /**
   * Validate data structure after loading
   */
  validateData() {
    if (!this.mergedData) return { isValid: false, error: "No data loaded" };

    const hasVersions =
      this.mergedData.versions &&
      Object.keys(this.mergedData.versions).length > 0;
    return hasVersions
      ? { isValid: true }
      : { isValid: false, error: "No versions configured" };
  }

  /**
   * Get comprehensive data loading statistics
   */
  getLoadingStats() {
    if (!this.mergedData) return { loaded: false };

    return {
      loaded: true,
      structure: "separated",
      versions: Object.keys(this.mergedData.versions).length,
      projects: this.profileData?.projects?.length || 0,
      publications: this.profileData?.publications?.length || 0,
      skills: Object.keys(this.profileData?.technical_skills || {}).length,
      sections: this.mergedData.version_config?.available_sections?.length || 0,
    };
  }

  /**
   * Validate skills focus with intelligent fallbacks
   * @private
   */
  _validateSkillsFocus(skillsFocus, profile) {
    if (!Array.isArray(skillsFocus)) {
      return Object.keys(profile.technical_skills || {});
    }

    const availableCategories = Object.keys(profile.technical_skills || {});
    const validCategories = skillsFocus.filter((category) =>
      availableCategories.includes(category)
    );
    const invalidCategories = skillsFocus.filter(
      (category) => !availableCategories.includes(category)
    );

    if (invalidCategories.length) {
      console.warn(
        `⚠️ Invalid skill categories: ${invalidCategories.join(", ")}`
      );
      console.warn(`📋 Available: ${availableCategories.join(", ")}`);
    }

    return validCategories.length ? validCategories : availableCategories;
  }

  /**
   * Reload data for development
   */
  async reload() {
    console.log("🔄 Reloading data...");
    Object.assign(this, {
      profileData: null,
      versionsData: null,
      mergedData: null,
    });
    return await this.loadData();
  }
}

// Export for use in other modules
window.DataLoader = DataLoader;
