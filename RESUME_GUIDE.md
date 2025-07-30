# Dynamic Multi-Version Resume System - Complete Guide

## Overview

This is a highly extensible, dynamic resume system that generates A4-optimized, PDF-ready resumes from structured JSON data. The system supports unlimited resume versions for different job types, each with customizable content focus, theme colors, and project emphasis.

### Key Features

- 🎯 **Multi-Version Support**: Create unlimited resume versions for different roles
- 🎨 **Dynamic Themes**: Automatic color theme generation for each version
- 📱 **Responsive Design**: Perfect on screen and optimized for A4 printing
- 🔄 **Zero-Code Version Addition**: Add new versions by editing JSON only
- 📊 **Smart Content Filtering**: Show/hide content based on version requirements
- 🛡️ **Data Validation**: Automatic error checking and reporting
- 📦 **Modular Data Structure**: Separated base profile and version configurations

## Default Versions Included

The system comes with three pre-configured professional versions:

- **🎨 Data Visualisation** (Blue theme) - Focus on D3.js, Power BI, interactive dashboards
- **👥 UX Research** (Black theme) - Emphasis on user studies, usability testing, HCI
- **🤖 AI Consultant** (Green theme) - Highlighting LLMs, generative AI, business AI solutions

## Quick Start

### 1. Setup and Run

```bash
# Clone or download the project
cd persona

# Start local server (choose one):
python -m http.server 8000        # Python
npx http-server                   # Node.js
php -S localhost:8000             # PHP

# Open in browser
open http://localhost:8000
```

### 2. Switch Versions

- Use the dropdown in the top-right corner
- Select between Data Visualisation, UX Research, or AI Consultant
- Content automatically reorganizes for the selected audience

### 3. Print to PDF

- Press `Ctrl+P` (or `Cmd+P` on Mac)
- Set paper size to A4
- Enable "Background graphics"
- The version switcher automatically hides in print mode

### 4. Customize Content

- Edit `data/profile.json` for your basic information
- Edit `data/versions.json` to add new versions or modify existing ones

## Data Structure (Separated Files)

The system now uses **two separate JSON files** for better organization:

### 1. Profile Data (`data/profile.json`)

Contains all your **permanent information** that doesn't change between versions:

```json
{
  "personal_info": {
    "name": "Your Name",
    "location": "City, Country",
    "email": "email@example.com",
    "links": { "github": "...", "linkedin": "..." }
  },
  "education": [...],
  "technical_skills": {...},
  "projects": [
    {
      "id": "project-id",
      "title": "Project Title",
      "description": "Base description",
      "features": [...],
      "tech_stack": "Technologies used",
      "year": "2023"
    }
  ],
  "publications": [...],
  "certifications": [...],
  "languages": [...],
  "interests": [...]
}
```

### 2. Version Configuration (`data/versions.json`)

Contains **version-specific settings** and content overrides:

```json
{
  "config": {
    "default_version": "data-viz",
    "theme_base": "theme-",
    "available_sections": ["summary", "technical_skills", "projects", "..."],
    "skill_categories": ["ai_ml", "data_science", "web_technologies", "..."]
  },
  "versions": {
    "version-key": {
      "display_name": "Human Readable Name",
      "theme_color": "#1976d2",
      "icon": "fas fa-icon-name",
      "summary": "Version-specific professional summary",

      "content_config": {
        "skills_focus": ["category1", "category2"],
        "sections_order": ["summary", "technical_skills", "projects"],
        "projects_limit": 4,
        "include_projects": ["project-id-1", "project-id-2"]
      },

      "content_overrides": {
        "project_descriptions": {
          "project-id-1": "Version-specific description for this project",
          "project-id-2": "Another version-specific angle"
        }
      }
    }
  }
}
```

#### Version Configuration Fields:

- **`summary`**: Professional summary tailored for this version
- **`skills_focus`**: Array defining skill category display order
- **`sections_order`**: Array defining resume section order
- **`projects_limit`**: Number of projects to display
- **`project_focus`**: Object mapping project titles to version-specific descriptions

### Core Data Sections

#### Education

```json
"education": [
  {
    "degree": "PhD in Human-Centered Computing",
    "institution": "University Name, Country",
    "period": "Oct 2021 – Jul 2025 Expected",
    "research": "Research: Specific Area", // Optional
    "highlights": ["Key achievement or coursework"] // Optional
  }
]
```

#### PhD Research

```json
"phd_research": {
  "sections": [
    {
      "title": "Research Area | Key Methods | Focus",
      "items": [
        {
          "point": "Specific research accomplishment or methodology"
        }
      ]
    }
  ]
}
```

#### Technical Skills (Fully Flexible Categories)

```json
"technical_skills": {
  "any_category_key": {
    "title": "Category Display Name",
    "items": [
      {
        "name": "Skill Name",
        "level": 5, // 1-5 scale
        "keywords": ["Tool1", "Tool2", "Framework3"]
      }
    ]
  },
  "another_category": {
    "title": "Another Category",
    "items": [...]
  }
}
```

**Category Keys**: You can use **any key names** you want! Examples:

- `artificial_intelligence`, `machine_learning`, `deep_learning`
- `frontend_development`, `backend_development`, `devops`
- `data_analysis`, `statistical_modeling`, `business_intelligence`
- `product_management`, `project_leadership`, `strategic_planning`
- `design_systems`, `user_research`, `prototyping`

The system automatically detects all available categories from your `technical_skills` object.

**🎯 Flexible Skills System Benefits:**

- ✅ **No hardcoded categories**: Use any category names that fit your profession
- ✅ **Automatic validation**: System warns if version references non-existent categories
- ✅ **Dynamic ordering**: Categories appear in the order you specify in `skills_focus`
- ✅ **Industry agnostic**: Works for any profession or specialization

**🔧 Industry-Specific Examples:**

For **Product Managers**:

```json
"technical_skills": {
  "product_strategy": {"title": "Product Strategy & Planning", "items": [...]},
  "data_driven_decisions": {"title": "Analytics & Data", "items": [...]},
  "technical_collaboration": {"title": "Technical Collaboration", "items": [...]}
}
```

For **DevOps Engineers**:

```json
"technical_skills": {
  "cloud_platforms": {"title": "Cloud Infrastructure", "items": [...]},
  "cicd_automation": {"title": "CI/CD & Automation", "items": [...]},
  "monitoring_security": {"title": "Monitoring & Security", "items": [...]}
}
```

For **Digital Marketers**:

```json
"technical_skills": {
  "marketing_automation": {"title": "Marketing Automation", "items": [...]},
  "digital_advertising": {"title": "Digital Advertising", "items": [...]},
  "analytics_optimization": {"title": "Analytics & Optimization", "items": [...]}
}
```

See `skill-category-examples.json` for complete examples across different industries.

#### Projects

```json
"projects": [
  {
    "title": "Project Name",
    "description": "Default project description",
    "features": ["Key feature or accomplishment"],
    "tech_stack": "Technologies used", // Optional
    "items": [ // Optional
      {
        "title": "Case Study Name",
        "details": ["Specific detail or outcome"]
      }
    ]
  }
]
```

#### Publications

```json
"publications": [
  {
    "title": "Publication Title",
    "authors": "Author list with your name highlighted",
    "venue": "Conference/Journal Name",
    "year": "2024",
    "type": "Paper" // or "Poster", "Workshop Paper", etc.
  }
]
```

#### Other Sections

```json
"certifications": ["Certification Name – Provider (Year)"],
"languages": [
  {
    "language": "Language Name",
    "proficiency": "Native/Fluent/Conversational"
  }
],
"interests": ["Interest description with specific details"]
```

## Customization Guide

### Adding a New Version (Easy Way)

The system now supports **fully dynamic version management**! No code changes needed.

1. **Add to `data/versions.json` only:**

   ```json
   "versions": {
     "new-version": {
       "display_name": "New Version Name",
       "theme_color": "#e91e63",
       "icon": "fas fa-briefcase",
       "summary": "Version-specific professional summary",

       "content_config": {
         "skills_focus": ["ai_ml", "data_science"],
         "sections_order": ["summary", "technical_skills", "projects"],
         "projects_limit": 3,
         "include_projects": ["causal-network-viz", "perspectiva-tool"]
       },

       "content_overrides": {
         "project_descriptions": {
           "causal-network-viz": "New angle description for this project",
           "perspectiva-tool": "Different focus for this project"
         }
       }
     }
   }
   ```

2. **That's it!** The system will automatically:
   - Generate HTML dropdown options
   - Create dynamic theme CSS
   - Validate the configuration
   - Enable version switching
   - Filter and reorder content per version

### Version Configuration Reference

```json
{
  "version_config": {
    "default_version": "version-key-to-load-first",
    "theme_base": "theme-",
    "available_sections": ["summary", "technical_skills", "projects", "..."],
    "skill_categories": ["ai_ml", "data_science", "web_technologies", "..."]
  },
  "versions": {
    "version-key": {
      "display_name": "Human Readable Name", // Required
      "theme_color": "#1976d2", // Required (hex format)
      "icon": "fas fa-icon-name", // Optional
      "summary": "Professional summary text", // Required
      "skills_focus": ["category1", "category2"], // Required (array)
      "sections_order": ["summary", "skills"], // Required (array)
      "projects_limit": 4, // Optional (default: 5)
      "project_focus": {
        // Optional
        "Project Title": "Version-specific description"
      }
    }
  }
}
```

### Advanced Version Management

The system includes JavaScript APIs for dynamic version management:

```javascript
// Get version manager instance
const versionManager = window.versionManager;

// Add new version at runtime
versionManager.addVersion("new-key", {
  display_name: "New Version",
  theme_color: "#ff5722",
  summary: "Dynamic version summary",
  skills_focus: ["ai_ml", "data_science"],
  sections_order: ["summary", "technical_skills"],
});

// Remove version
versionManager.removeVersion("version-key");

// Get version statistics
console.log(versionManager.getVersionStats());

// Export/Import configurations
const config = versionManager.exportConfiguration();
versionManager.importConfiguration(config);
```

### Theme Color Customization

Current theme colors in `styles/main.css`:

```css
--data-viz-theme: #1976d2; /* Blue */
--ux-research-theme: #000000; /* Black */
--ai-consultant-theme: #008035; /* Green */
```

Elements that use theme colors:

- Main heading (h1)
- Section headings (h2)
- Section icons
- Skill rating dots
- Contact links
- Version selector border

### Content Guidelines

#### Professional Summary

- 2-3 sentences maximum
- Include specific technologies relevant to the version
- Highlight unique value proposition
- Use action words and measurable achievements

#### Technical Skills

- Use 1-5 rating scale consistently
- Include 3-5 relevant keywords per skill
- Order by proficiency level (highest first)
- Keep skill names concise

#### Projects

- Write project titles that are descriptive but not too long
- Focus on outcomes and impact
- Use version-specific descriptions to highlight relevant aspects
- Include specific technologies and methodologies

#### Publications

- Auto-sorted by year (descending) then type (Papers before Posters)
- Bold or highlight your name in author lists
- Use official venue names and years

## Print/PDF Guidelines

### Optimization Settings

- **Page Size**: A4 (210mm × 297mm)
- **Margins**: 8mm minimum
- **Print Scale**: 100%
- **Background Graphics**: Enabled (for theme colors)

### Browser Print Settings

1. **Chrome/Edge**: Ctrl+P → More Settings → Paper Size: A4
2. **Firefox**: Ctrl+P → Paper Size: A4
3. **Safari**: Cmd+P → Paper Size: A4

### Best Practices

- Preview each version before printing
- Check page breaks between sections
- Ensure version switcher is hidden in print preview
- Verify theme colors appear correctly

## Troubleshooting

### Common Issues

#### 1. **Data Loading Errors**

```
❌ Failed to load profile.json: 404 Not Found
```

**Solutions:**

- Ensure `data/profile.json` exists and is valid JSON
- Check file permissions and server configuration
- Use browser dev tools (F12) → Network tab to see actual error
- System automatically falls back to legacy `data.json` if available

#### 2. **Version Configuration Errors**

```
❌ Version "new-version" is missing required fields: display_name, summary
```

**Solutions:**

- Check `data/versions.json` structure matches the schema
- Ensure all required fields are present: `display_name`, `summary`, `content_config`
- Validate JSON syntax with [jsonlint.com](https://jsonlint.com)

#### 3. **Theme Colors Not Applying**

**Symptoms:** All versions look the same, no color differences
**Solutions:**

- Verify `theme_color` uses valid hex format: `#1976d2`
- Check browser console for CSS generation errors
- Ensure theme colors are distinct enough to be visible

#### 4. **Projects Not Filtering Correctly**

**Symptoms:** Wrong projects showing for a version
**Solutions:**

- Check `include_projects` array contains valid project IDs from `profile.json`
- Verify project IDs match exactly (case-sensitive)
- Ensure `projects_limit` is not set too low

#### 5. **Print/PDF Issues**

**Symptoms:** Version switcher visible in PDF, poor page breaks
**Solutions:**

- Enable "Background graphics" in browser print settings
- Set paper size to A4 in print dialog
- Use "Print to PDF" option instead of third-party PDF generators
- Check `@media print` CSS rules are loaded

#### 6. **Console Validation Warnings**

```
⚠️ Resume data validation warnings:
  - Recommended section missing: projects
```

**Solutions:**

- These are warnings, not errors - system still works
- Add missing sections to improve completeness
- Use `ConfigValidator` for detailed validation reports

### Data Validation Tools

#### Automated Validation

The system automatically validates data on load:

```javascript
// Check validation in browser console
console.log(versionManager.getVersionStats());

// Manual validation
const validator = new ConfigValidator();
const result = validator.validateResumeData(resumeData);
console.log(validator.generateReport(result));
```

#### Manual Checks

Before deploying changes:

1. **JSON Syntax**: Use [jsonlint.com](https://jsonlint.com) to validate
2. **Project IDs**: Ensure IDs in `versions.json` match those in `profile.json`
3. **Skill Categories**: Verify skill focus arrays reference existing categories
4. **Theme Colors**: Test colors are distinct and professional
5. **Content Length**: Check all versions fit within reasonable page limits

### Development Tools

#### Data Reloading (Development)

```javascript
// Reload data without refreshing page
await dataLoader.reload();
versionManager.initialize(resumeData);
```

#### Version Management API

```javascript
// Get detailed statistics
console.log(versionManager.getVersionStats());

// Export configuration for backup
const backup = versionManager.exportConfiguration();
localStorage.setItem("resume-backup", JSON.stringify(backup));

// Add version programmatically
versionManager.addVersion("test-version", {
  display_name: "Test Version",
  theme_color: "#ff5722",
  summary: "Test summary",
  content_config: {
    skills_focus: ["ai_ml"],
    sections_order: ["summary", "technical_skills"],
    projects_limit: 2,
    include_projects: ["causal-network-viz"],
  },
});
```

## File Structure

```
persona/
├── index.html              # Main HTML structure
├── js/
│   ├── main.js            # Core rendering logic
│   ├── theme-manager.js   # Dynamic theme generation
│   ├── version-manager.js # Version configuration management
│   ├── data-loader.js     # Multi-file data loading
│   ├── config-validator.js # Data validation utilities
│   └── paginate.js        # Auto-pagination system
├── styles/
│   └── main.css           # Base styling (themes now dynamic)
├── data/
│   ├── profile.json       # Permanent profile data
│   ├── versions.json      # Version-specific configurations
│   ├── data.json          # Legacy data (fallback)
│   └── Photo.jpg          # Profile photo (optional)
├── version-template.json   # Template for new versions
├── RESUME_GUIDE.md        # This guide
└── README.md              # Project overview
```

## Architecture Overview

### Core Components

1. **DataLoader**: Loads and merges profile.json + versions.json
2. **VersionManager**: Handles version configuration, validation, and switching
3. **ThemeManager**: Generates dynamic CSS themes for each version
4. **ConfigValidator**: Validates data structure and provides error reporting
5. **Main Renderer**: Processes resume data and renders content

### Data Flow

```
profile.json + versions.json → DataLoader → ConfigValidator → VersionManager → ThemeManager → Renderer → DOM
```

### Benefits of Separated Data Structure

- **🔄 No Duplication**: Base info written once, used everywhere
- **📝 Easy Maintenance**: Update skills/projects in one place
- **🎯 Version Focus**: Version files only contain what's different
- **⚡ Better Performance**: Load and cache base data separately
- **🛡️ Data Integrity**: Clearer separation reduces errors
- **📦 Modular**: Can share profile.json across multiple resume systems

### Extensibility Features

- **Zero-code version addition**: Just edit versions.json, no code changes
- **Dynamic theme generation**: Themes created automatically from colors
- **Runtime version management**: Add/remove versions via JavaScript API
- **Comprehensive validation**: Automatic error detection and reporting
- **Flexible project filtering**: Include/exclude projects per version
- **Smart fallback**: Automatically falls back to legacy data.json if needed

## Contributing

When modifying the system:

1. Test all three versions after changes
2. Verify print output in multiple browsers
3. Validate JSON data structure
4. Check responsive behavior
5. Ensure accessibility standards

## Best Practices

### Content Strategy

#### Professional Summaries

- **Length**: 2-3 sentences maximum per version
- **Keywords**: Include industry-specific terms for each version
- **Value Proposition**: Lead with your unique strength for that role
- **Quantifiable Impact**: Include metrics when possible

**Example:**

```json
"summary": "Data Scientist with 5+ years creating ML models that increased revenue by 40%. Expert in Python, TensorFlow, and cloud platforms with 15+ published papers in top-tier conferences."
```

#### Project Descriptions

- **Version-Specific Angles**: Same project, different emphasis
- **Technical Depth**: Match the audience's technical level
- **Impact Focus**: Business outcomes for industry roles, research impact for academic roles
- **Concrete Examples**: Specific technologies, team sizes, timelines

#### Skills Organization

- **Relevance Order**: Most important skills first for each version
- **Honest Assessment**: Use the 1-5 scale consistently
- **Keyword Rich**: Include tools and frameworks in keywords array
- **Current Technologies**: Keep up with industry trends

### Data Management

#### Version Control

```bash
# Backup your configurations
cp data/profile.json data/profile.backup.json
cp data/versions.json data/versions.backup.json

# Version control with git
git add data/
git commit -m "Update resume data for Q4 applications"
```

#### Content Updates

1. **Batch Updates**: Update profile.json once, benefits all versions
2. **Version Testing**: Check all versions after profile changes
3. **Incremental Changes**: Test one version modification at a time
4. **Validation First**: Run validation before important applications

#### File Organization

```
data/
├── profile.json          # Master data - update carefully
├── versions.json         # Version configs - safe to experiment
├── archive/
│   ├── profile-2024.json # Yearly backups
│   └── versions-old.json # Previous configurations
└── templates/
    └── new-version-template.json # Template for new versions
```

### Performance Optimization

#### Loading Speed

- **Image Optimization**: Compress profile photos
- **JSON Minification**: Remove unnecessary whitespace for production
- **CDN Usage**: Use CDN links for external resources
- **Caching**: Set proper cache headers for static files

#### Print Quality

- **Color Choices**: Ensure good contrast for both screen and print
- **Font Sizes**: Test readability at different scales
- **Page Breaks**: Check content flow across pages
- **Margin Safety**: Keep important content within safe print margins

### Security and Privacy

#### Data Protection

- **Sensitive Information**: Consider what to include in public repos
- **Contact Details**: Use professional email addresses
- **Links Validation**: Ensure all external links are current and professional
- **Version Control**: Don't commit sensitive data to public repositories

#### Deployment

```bash
# For public deployment, consider:
# 1. Remove sensitive personal details
# 2. Use environment variables for contact info
# 3. Implement basic analytics if needed
```

### Advanced Usage

#### Multiple Profiles

```javascript
// Support multiple people's resumes
const profiles = {
  "john-doe": await fetch("data/profiles/john-doe.json"),
  "jane-smith": await fetch("data/profiles/jane-smith.json"),
};
```

#### Custom Themes

```css
/* Add custom theme colors */
:root {
  --custom-theme-1: #e91e63; /* Pink */
  --custom-theme-2: #3f51b5; /* Indigo */
  --custom-theme-3: #009688; /* Teal */
}
```

#### Integration with External APIs

```javascript
// Fetch data from external sources
const linkedinData = await fetch("/api/linkedin-profile");
const githubStats = await fetch("/api/github-stats");
// Merge with existing profile data
```

## 

## LLM Prompt for Data Generation

Use this prompt with ChatGPT, Claude, or other LLMs to generate resume data that's compatible with this system:

````
I need you to generate JSON data for a dynamic resume system. Please create two separate JSON files based on my information:

**IMPORTANT INSTRUCTIONS:**
1. Create TWO separate JSON files: profile.json and versions.json
2. Follow the exact structure shown in the examples below
3. Use realistic, professional content
4. Ensure all project IDs are consistent between files
5. Create 3 versions: "data-viz", "ux-research", and "ai-consultant"

**My Background:**
[Insert your background information here - education, experience, skills, projects, etc.]

**PROFILE.JSON Structure:**
```json
{
  "personal_info": {
    "name": "Your Full Name",
    "location": "City, Country",
    "phone": "Phone Number",
    "email": "email@example.com",
    "links": {
      "github": "GitHub URL",
      "website": "Personal Website",
      "linkedin": "LinkedIn URL"
    }
  },
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University Name, Country",
      "period": "Start Date – End Date",
      "research": "Research focus (if applicable)",
      "highlights": ["Key achievements or coursework"]
    }
  ],
  "technical_skills": {
    "artificial_intelligence": {
      "title": "AI & Machine Learning",
      "items": [
        {
          "name": "Skill Name",
          "level": 4,
          "keywords": ["Tool1", "Tool2", "Framework3"]
        }
      ]
    },
    "data_analysis": {
      "title": "Data Science & Analytics",
      "items": [...]
    },
    "software_development": {
      "title": "Software Development",
      "items": [...]
    },
    "user_research": {
      "title": "Research & UX Skills",
      "items": [...]
    }
  },
  "projects": [
    {
      "id": "project-1-id",
      "title": "Project Title",
      "description": "Base project description",
      "features": ["Key feature 1", "Key feature 2"],
      "tech_stack": "Technologies used",
      "year": "2023"
    }
  ],
  "publications": [
    {
      "title": "Publication Title",
      "authors": "Author list with your name highlighted",
      "venue": "Conference/Journal Name",
      "year": "2024",
      "type": "Paper"
    }
  ],
  "certifications": ["Certification Name – Provider (Year)"],
  "languages": [
    {
      "language": "Language Name",
      "proficiency": "Native/Fluent/Conversational"
    }
  ],
  "interests": ["Interest description with specific details"]
}
````

**VERSIONS.JSON Structure:**

```json
{
  "config": {
    "default_version": "data-viz",
    "theme_base": "theme-",
    "available_sections": [
      "summary",
      "technical_skills",
      "projects",
      "phd_research",
      "education",
      "publications",
      "certifications"
    ],
    "skill_categories": [
      "artificial_intelligence",
      "data_analysis",
      "software_development",
      "user_research"
    ]
  },
  "versions": {
    "data-viz": {
      "display_name": "Data Visualisation",
      "theme_color": "#1976d2",
      "icon": "fas fa-chart-bar",
      "summary": "Version-specific professional summary for data visualization roles",
      "content_config": {
        "skills_focus": [
          "data_analysis",
          "software_development",
          "artificial_intelligence",
          "user_research"
        ],
        "sections_order": [
          "summary",
          "technical_skills",
          "projects",
          "education",
          "publications",
          "certifications"
        ],
        "projects_limit": 4,
        "include_projects": ["project-1-id", "project-2-id"]
      },
      "content_overrides": {
        "project_descriptions": {
          "project-1-id": "Data visualization focused description of this project"
        }
      }
    },
    "ux-research": {
      "display_name": "UX Research",
      "theme_color": "#000000",
      "icon": "fas fa-users",
      "summary": "Version-specific summary for UX research roles",
      "content_config": {
        "skills_focus": [
          "user_research",
          "software_development",
          "data_analysis",
          "artificial_intelligence"
        ],
        "sections_order": [
          "summary",
          "technical_skills",
          "projects",
          "education",
          "publications"
        ],
        "projects_limit": 3,
        "include_projects": ["project-1-id", "project-2-id"]
      },
      "content_overrides": {
        "project_descriptions": {
          "project-1-id": "UX research focused description emphasizing user studies and design"
        }
      }
    },
    "ai-consultant": {
      "display_name": "AI Consultant",
      "theme_color": "#008035",
      "icon": "fas fa-robot",
      "summary": "Version-specific summary for AI consulting roles",
      "content_config": {
        "skills_focus": [
          "artificial_intelligence",
          "data_analysis",
          "user_research",
          "software_development"
        ],
        "sections_order": [
          "summary",
          "technical_skills",
          "projects",
          "education",
          "publications"
        ],
        "projects_limit": 4,
        "include_projects": ["project-1-id", "project-2-id"]
      },
      "content_overrides": {
        "project_descriptions": {
          "project-1-id": "AI and ML focused description highlighting algorithms and business impact"
        }
      }
    }
  }
}
```

Please generate both files with realistic content based on my background. Ensure:

- All project IDs match between files
- Skills levels are realistic (1-5 scale)
- Professional summaries are distinct for each version
- Theme colors are professional hex codes
- All required fields are included

```
---

## Summary

This dynamic multi-version resume system provides a professional, extensible solution for creating targeted resumes. With separated data files, automatic validation, dynamic theming, and comprehensive documentation, it's designed to grow with your career while maintaining ease of use.

The system's modular architecture ensures that you can easily adapt it to new requirements, add additional versions for different career paths, and maintain all your professional information in one centralized, well-organized location.
```
