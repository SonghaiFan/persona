// Utility Functions - Elegant JavaScript patterns and helpers
class DOMUtils {
  /**
   * Modern element creation with fluid API
   * @param {string} tag - Element tag name
   * @param {Object} options - Element configuration
   */
  static create(tag, options = {}) {
    const element = document.createElement(tag);

    // Apply properties using modern techniques
    Object.entries(options).forEach(([key, value]) => {
      if (key === "children" && Array.isArray(value)) {
        value.forEach((child) => element.appendChild(child));
      } else if (key === "events" && typeof value === "object") {
        Object.entries(value).forEach(([event, handler]) => {
          element.addEventListener(event, handler);
        });
      } else if (key === "attributes" && typeof value === "object") {
        Object.entries(value).forEach(([attr, val]) => {
          element.setAttribute(attr, val);
        });
      } else if (key === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else {
        element[key] = value;
      }
    });

    return element;
  }

  /**
   * Query selector with modern optional chaining support
   * @param {string} selector - CSS selector
   * @param {Element} context - Search context (default: document)
   */
  static $(selector, context = document) {
    return context.querySelector(selector);
  }

  /**
   * Query all with immediate array return
   * @param {string} selector - CSS selector
   * @param {Element} context - Search context (default: document)
   */
  static $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  }

  /**
   * Elegant text content setter with fallback
   * @param {string} selector - CSS selector
   * @param {string} text - Text content
   */
  static setText(selector, text) {
    const element = this.$(selector);
    if (element) element.textContent = text;
    return element;
  }

  /**
   * Safe innerHTML setter
   * @param {string} selector - CSS selector
   * @param {string} html - HTML content
   */
  static setHTML(selector, html) {
    const element = this.$(selector);
    if (element) element.innerHTML = html;
    return element;
  }

  /**
   * Modern class manipulation
   * @param {string} selector - CSS selector
   * @param {Object} classes - Class operations
   */
  static toggleClasses(selector, classes) {
    const element = this.$(selector);
    if (!element) return null;

    Object.entries(classes).forEach(([className, action]) => {
      if (action === "add") element.classList.add(className);
      else if (action === "remove") element.classList.remove(className);
      else if (action === "toggle") element.classList.toggle(className);
    });

    return element;
  }
}

class DataUtils {
  /**
   * Safe property access with default value
   * @param {Object} obj - Source object
   * @param {string} path - Property path (dot notation)
   * @param {*} defaultValue - Default value if path not found
   */
  static get(obj, path, defaultValue = null) {
    return (
      path.split(".").reduce((current, prop) => current?.[prop], obj) ??
      defaultValue
    );
  }

  /**
   * Group array by property with modern Map
   * @param {Array} array - Source array
   * @param {string|Function} keySelector - Property name or function
   */
  static groupBy(array, keySelector) {
    const getKey =
      typeof keySelector === "function"
        ? keySelector
        : (item) => item[keySelector];

    return array.reduce((groups, item) => {
      const key = getKey(item);
      groups.set(key, [...(groups.get(key) || []), item]);
      return groups;
    }, new Map());
  }

  /**
   * Deep merge objects with modern spread syntax
   * @param {Object} target - Target object
   * @param {...Object} sources - Source objects
   */
  static merge(target, ...sources) {
    return sources.reduce(
      (result, source) => {
        Object.entries(source).forEach(([key, value]) => {
          if (value && typeof value === "object" && !Array.isArray(value)) {
            result[key] = this.merge(result[key] || {}, value);
          } else {
            result[key] = value;
          }
        });
        return result;
      },
      { ...target }
    );
  }

  /**
   * Debounce function with modern Promise support
   * @param {Function} func - Function to debounce
   * @param {number} delay - Delay in milliseconds
   */
  static debounce(func, delay) {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      return new Promise((resolve) => {
        timeoutId = setTimeout(() => resolve(func(...args)), delay);
      });
    };
  }

  /**
   * Throttle function with trailing execution
   * @param {Function} func - Function to throttle
   * @param {number} limit - Limit in milliseconds
   */
  static throttle(func, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }
}

class FormatterUtils {
  /**
   * Format date with modern Intl API
   * @param {Date|string} date - Date to format
   * @param {Object} options - Formatting options
   */
  static formatDate(date, options = {}) {
    const dateObj = date instanceof Date ? date : new Date(date);
    const defaultOptions = { year: "numeric", month: "long", day: "numeric" };

    return new Intl.DateTimeFormat("en-US", {
      ...defaultOptions,
      ...options,
    }).format(dateObj);
  }

  /**
   * Format numbers with locale support
   * @param {number} number - Number to format
   * @param {Object} options - Formatting options
   */
  static formatNumber(number, options = {}) {
    return new Intl.NumberFormat("en-US", options).format(number);
  }

  /**
   * Truncate text with elegant ellipsis
   * @param {string} text - Text to truncate
   * @param {number} maxLength - Maximum length
   * @param {string} suffix - Suffix for truncated text
   */
  static truncate(text, maxLength, suffix = "...") {
    return text.length <= maxLength
      ? text
      : `${text.slice(0, maxLength)}${suffix}`;
  }

  /**
   * Convert camelCase to readable title
   * @param {string} camelCase - CamelCase string
   */
  static camelToTitle(camelCase) {
    return camelCase
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }
}

// Export utilities globally for backward compatibility
window.DOMUtils = DOMUtils;
window.DataUtils = DataUtils;
window.FormatterUtils = FormatterUtils;

// Modern shorthand exports
window.DOM = DOMUtils;
window.Data = DataUtils;
window.Format = FormatterUtils;
