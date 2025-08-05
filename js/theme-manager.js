// Theme Manager - Elegant dynamic theme generation
class ThemeManager {
  constructor() {
    this.themeStyleElement = this._getOrCreateStyleElement();
  }

  /**
   * Get or create dynamic theme style element
   * @private
   */
  _getOrCreateStyleElement() {
    const existing = document.getElementById("dynamic-themes");
    if (existing) return existing;

    const styleElement = Object.assign(document.createElement("style"), {
      id: "dynamic-themes",
      type: "text/css",
    });
    document.head.appendChild(styleElement);
    return styleElement;
  }

  /**
   * Generate CSS for all versions with modern template literals
   * @param {Object} versions - Version configurations
   * @param {string} themeBase - Theme class prefix
   */
  generateThemeCSS(versions, themeBase = "theme-") {
    this.themeStyleElement.textContent = Object.entries(versions)
      .map(([key, config]) =>
        this._generateVersionCSS(`${themeBase}${key}`, config.theme_color)
      )
      .join("\n");
  }

  /**
   * Generate elegant CSS for specific version theme
   * @private
   */
  _generateVersionCSS(themeClass, themeColor) {
    const rgba = this._hexToRgba(themeColor, 0.1);

    return `
/* ${themeClass} Theme */
body.${themeClass} {
  --theme-color: ${themeColor};
  --theme-rgba: ${rgba};
}

body.${themeClass} :is(h1, h2 i, .contact-link) { color: var(--theme-color); }
body.${themeClass} h2 { color: var(--theme-color); border-bottom: 1px solid var(--divider-color); }
body.${themeClass} .skill-dot.filled { background-color: var(--theme-color); }
body.${themeClass} .version-select { 
  border-color: var(--theme-color);
  &:focus { border-color: var(--theme-color); box-shadow: 0 0 0 2px var(--theme-rgba); }
}`;
  }

  /**
   * Convert hex to RGBA with specified alpha
   * @private
   */
  _hexToRgba(hex, alpha = 1) {
    const rgb = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16));
    return rgb
      ? `rgba(${rgb.join(", ")}, ${alpha})`
      : `rgba(0, 0, 0, ${alpha})`;
  }

  /**
   * Apply theme with elegant class management
   * @param {string} versionKey - Version identifier
   * @param {string} themeBase - Theme class prefix
   */
  applyTheme(versionKey, themeBase = "theme-") {
    const { classList } = document.body;
    const newTheme = `${themeBase}${versionKey}`;

    // Remove existing themes and add new one
    [...classList]
      .filter((cls) => cls.startsWith(themeBase))
      .forEach((cls) => classList.remove(cls));
    classList.add(newTheme);
  }

  /**
   * Validate hex color with modern regex
   * @param {string} color - Color value to validate
   */
  isValidHexColor(color) {
    return /^#[A-Fa-f0-9]{3,6}$/.test(color);
  }

  /**
   * Get available theme classes
   * @param {Object} versions - Version configurations
   * @param {string} themeBase - Theme prefix
   */
  getAvailableThemeClasses(versions, themeBase = "theme-") {
    return Object.keys(versions).map((key) => `${themeBase}${key}`);
  }

  /**
   * Generate theme preview CSS
   * @param {string} themeColor - Hex color code
   */
  generateThemePreview(themeColor) {
    return `.theme-preview {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${themeColor};
      margin-right: 6px;
      border: 1px solid var(--divider-color);
    }`;
  }
}

// Export for use in other modules
window.ThemeManager = ThemeManager;
