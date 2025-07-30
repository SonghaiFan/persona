// Theme Manager - Dynamic theme generation and management
class ThemeManager {
  constructor() {
    this.themeStyleElement = null;
    this.initializeThemeStyles();
  }

  /**
   * Initialize dynamic theme styles
   */
  initializeThemeStyles() {
    // Create or get existing style element for dynamic themes
    this.themeStyleElement = document.getElementById('dynamic-themes') || this.createThemeStyleElement();
  }

  /**
   * Create a style element for dynamic themes
   */
  createThemeStyleElement() {
    const styleElement = document.createElement('style');
    styleElement.id = 'dynamic-themes';
    styleElement.type = 'text/css';
    document.head.appendChild(styleElement);
    return styleElement;
  }

  /**
   * Generate CSS for all versions dynamically
   * @param {Object} versions - Version configuration from data.json
   * @param {string} themeBase - Theme class prefix (e.g., 'theme-')
   */
  generateThemeCSS(versions, themeBase = 'theme-') {
    let css = '';
    
    Object.entries(versions).forEach(([versionKey, versionConfig]) => {
      const themeClass = `${themeBase}${versionKey}`;
      const themeColor = versionConfig.theme_color;
      
      css += this.generateVersionThemeCSS(themeClass, themeColor);
    });

    // Apply the generated CSS
    this.themeStyleElement.textContent = css;
  }

  /**
   * Generate CSS for a specific version theme
   * @param {string} themeClass - CSS class name
   * @param {string} themeColor - Hex color code
   */
  generateVersionThemeCSS(themeClass, themeColor) {
    // Convert hex to RGB for rgba usage
    const rgb = this.hexToRgb(themeColor);
    const rgbaColor = rgb ? `${rgb.r}, ${rgb.g}, ${rgb.b}` : '0, 0, 0';

    return `
/* ${themeClass} Theme */
body.${themeClass} {
  --theme-color: ${themeColor};
}

body.${themeClass} h1 {
  color: var(--theme-color);
}

body.${themeClass} h2 {
  color: var(--theme-color);
  border-bottom: 1px solid var(--divider-color);
}

body.${themeClass} h2 i {
  color: var(--theme-color);
}

body.${themeClass} .skill-dot.filled {
  background-color: var(--theme-color);
}

body.${themeClass} .contact-link {
  color: var(--theme-color);
}

body.${themeClass} .version-select {
  border-color: var(--theme-color);
}

body.${themeClass} .version-select:focus {
  border-color: var(--theme-color);
  box-shadow: 0 0 0 2px rgba(${rgbaColor}, 0.1);
}

`;
  }

  /**
   * Convert hex color to RGB
   * @param {string} hex - Hex color code
   * @returns {Object|null} RGB object or null if invalid
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }

  /**
   * Apply theme to body element
   * @param {string} versionKey - Version identifier
   * @param {string} themeBase - Theme class prefix
   */
  applyTheme(versionKey, themeBase = 'theme-') {
    // Remove all existing theme classes
    const bodyClasses = document.body.classList;
    const existingThemeClasses = Array.from(bodyClasses).filter(cls => cls.startsWith(themeBase));
    existingThemeClasses.forEach(cls => bodyClasses.remove(cls));

    // Add new theme class
    bodyClasses.add(`${themeBase}${versionKey}`);
  }

  /**
   * Get all available theme classes from versions
   * @param {Object} versions - Version configuration
   * @param {string} themeBase - Theme class prefix
   * @returns {Array} Array of theme class names
   */
  getAvailableThemeClasses(versions, themeBase = 'theme-') {
    return Object.keys(versions).map(versionKey => `${themeBase}${versionKey}`);
  }

  /**
   * Validate theme color format
   * @param {string} color - Color value to validate
   * @returns {boolean} True if valid hex color
   */
  isValidHexColor(color) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  }

  /**
   * Generate theme preview for version switcher
   * @param {string} themeColor - Hex color code
   * @returns {string} CSS for theme preview
   */
  generateThemePreview(themeColor) {
    return `
      .theme-preview {
        display: inline-block;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background-color: ${themeColor};
        margin-right: 6px;
        border: 1px solid var(--divider-color);
      }
    `;
  }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;