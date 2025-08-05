# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Frankie Résumé** is a pure vanilla web application for creating multi-version, dynamically generated resumes. It's built with zero dependencies using HTML, CSS, and JavaScript, following a "super simple yet powerful" philosophy. The application loads resume data from JSON files and renders different versions tailored for specific roles or industries.

## Development Commands

Since this is a pure HTML/CSS/JavaScript project, there are no build commands or package managers involved:

- **Local Development**: Open `index.html` directly in a web browser
- **Live Testing**: Use a simple HTTP server like `python -m http.server 8000` or `npx serve .`
- **Print Testing**: Use browser print preview (Ctrl+P / Cmd+P) to test A4 formatting

## Code Architecture

### Core Structure
```
persona/
├── index.html          # Main application entry point
├── main.css           # All styling with Material Design principles
├── main.js            # Complete application logic in one file
├── data/
│   ├── profile.json   # Main resume data (personal info, skills, projects, etc.)
│   └── versions.json  # Version configurations and themes
└── logo.svg           # Application branding
```

### Key Architecture Principles

**Single-File Approach**: Following KISS, DRY, YAGNI principles:
- `main.js` contains all JavaScript logic in one consolidated file
- `main.css` contains all styles with CSS custom properties for theming
- No build process, no dependencies, no complexity

**Data-Driven Rendering**: 
- Resume content lives in `data/profile.json` (personal info, education, work experience, skills, projects, publications)
- Version configurations in `data/versions.json` define different resume variations
- Each version has its own theme color, summary, skill selection, and section ordering

**Dynamic Version Switching**:
- 5 built-in versions: Data Scientist, NLP/AI Engineer, UX Researcher, Data Viz Developer, Data Engineer
- Each version reorders sections, highlights different skills, and applies custom project descriptions
- Theme colors and styling update dynamically via CSS custom properties

### JavaScript Architecture (`main.js`)

**Global State Management**:
- `resumeData`: Main profile data from profile.json
- `versionsData`: Version configurations from versions.json  
- `currentVersion`: Currently selected resume version

**Core Functions**:
- `loadData()`: Handles loading JSON files with fallback support
- `renderResume()`: Main rendering orchestrator based on version config
- `autoPaginate()`: Automatic A4 page splitting for print layouts
- `switchVersion()`: Handles version switching with smooth transitions

**Rendering Pipeline**:
1. Load and validate JSON data
2. Generate dynamic CSS themes for each version
3. Render header with pronunciation guides
4. Render sections in version-specific order
5. Auto-paginate content for A4 print format

### CSS Architecture (`main.css`)

**Material Design System**:
- Comprehensive color palette with semantic naming
- Typography scale optimized for print (6px-36px range)
- CSS custom properties for easy theming
- A4-specific dimensions and spacing

**Print-First Design**:
- Optimized for A4 paper dimensions (210mm × 297mm)
- Print-safe colors and typography
- Page break handling for multi-page resumes

## Data Structure

### Profile Data (`data/profile.json`)
- `personal_info`: Contact details with pronunciation guides
- `education`: Academic background with highlights
- `work_experience`: Professional experience with achievements
- `skills_pool`: Comprehensive skill definitions with proficiency levels
- `projects`: Project portfolio with case studies
- `publications`: Academic publications with metadata
- `certifications`: Professional certifications

### Version Configuration (`data/versions.json`)
- `config`: Global settings and defaults
- `versions`: Individual version definitions with:
  - `display_name`: Human-readable version name
  - `theme_color`: Primary color for the version
  - `summary`: Version-specific professional summary
  - `content_config`: Section ordering, skill selection, project limits
  - `content_overrides`: Custom descriptions for specific versions

## Working with the Codebase

**Adding New Resume Versions**:
1. Add new version object to `versions.json`
2. Define theme color, summary, and content configuration
3. Specify skill selection and section ordering
4. Add any content overrides for custom descriptions

**Modifying Resume Content**:
1. Edit `data/profile.json` for base content changes
2. Use `content_overrides` in versions.json for version-specific customizations
3. Skills are selected per version via `selected_skills` array

**Styling Changes**:
1. Modify CSS custom properties in `:root` for global changes
2. Theme-specific colors are generated dynamically in JavaScript
3. Print styles are integrated throughout, not separate

**Testing Different Versions**:
1. Open index.html in browser
2. Use version selector in header to switch between versions
3. Test print layout with browser print preview
4. Verify auto-pagination works correctly for content length

This architecture enables rapid resume customization while maintaining clean, dependency-free code that works anywhere.