# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web-based resume/portfolio site for Songhai Fan (Frank), a PhD researcher in Human-Centered Computing. The project is a client-side application that renders resume content dynamically from JSON data.

## Architecture

### Core Structure
- **index.html**: Main HTML structure with page template and content source container
- **js/main.js**: JavaScript module with pagination system that renders resume data across multiple A4 pages
- **styles/main.css**: Comprehensive CSS with A4 print optimization and multi-page support
- **data/data.json**: Structured resume content in JSON format
- **data/Photo.jpg**: Profile photo (currently commented out in HTML)

### Key Design Patterns
- **Pagination System**: Automatic content distribution across A4-sized pages with height calculations
- **Data-Driven Rendering**: All content is loaded from `data.json` and rendered via JavaScript
- **Template-Based Pages**: Uses HTML template element to create consistent page structure
- **Dynamic Height Management**: Real-time measurement of content to prevent page overflow
- **Print-First Design**: Each page is exactly A4 size (210mm x 297mm) for perfect PDF output

## Development Commands

This is a static website with no build process. Development workflow:

1. **Local Development**: Open `index.html` in a browser or use a local server:
   ```bash
   # Using Python 3
   python -m http.server 8000
   
   # Using Node.js (if http-server is installed)
   npx http-server
   ```

2. **Content Updates**: Modify `data/data.json` to update resume content
3. **Styling**: Edit `styles/main.css` for visual changes
4. **Functionality**: Modify `js/main.js` for rendering logic

## Key Technical Features

### Pagination System
- **PaginationManager Class**: Handles automatic content distribution across pages
- **Height Calculation**: Converts pixel measurements to millimeters for accurate page fitting
- **Dynamic Page Creation**: Creates new pages when content exceeds available space
- **Header Management**: Adds header only to the first page
- **Content Overflow Prevention**: Ensures no content is cut off between pages

### CSS Architecture
- **Multi-Page Layout**: Each `.page` element is exactly A4 size (210mm x 297mm)
- **Print Media Queries**: Perfect page breaks with `page-break-after: always`
- **Screen Preview**: Gray background and shadows to visualize individual pages
- **CSS Variables**: Color scheme and dimensions defined in `:root`
- **Grid Layouts**: Skills section uses 2-column grid, publications use flex layouts

### JavaScript Architecture
- **PaginationManager**: Core class managing page creation and content distribution
- **Async Data Loading**: Fetches JSON data on DOM content loaded
- **DOM Element Creation**: All content is created programmatically for better control
- **Height Measurement**: Temporary DOM insertion to measure element heights
- **Modular Rendering**: Separate functions for each resume section with pagination support

### Data Structure
The JSON follows a specific schema:
- `summary`: Professional summary text
- `education`: Array of degree objects with institution, period, highlights
- `technical_skills`: Nested object with skill categories and proficiency levels
- `projects`: Array with case studies sub-structure
- `publications`: Array with academic publication metadata
- `phd_research`: Structured research accomplishments

## Content Management

To update resume content:
1. Edit `data/data.json` following the existing schema
2. Skills use 1-5 star rating system (`level` property)
3. Publications auto-sort by year (descending) then type (Papers before Posters)
4. Projects support nested case studies with detail arrays

## Print Considerations

The design is optimized for A4 printing:
- Fixed page dimensions prevent content overflow
- Print media queries adjust margins and spacing
- Page break controls prevent awkward section splits
- Color scheme maintains readability in print