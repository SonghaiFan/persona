# Quick Resume Setup - 2 Minutes ⚡

Get your multi-version resume running in 2 minutes using AI to generate your data!

## Method 1: AI Generated (Recommended - 2 minutes)

### Step 1: Copy This Prompt to ChatGPT/Claude

`````
I need you to generate JSON data for a dynamic resume system. Please create two separate JSON files based on my information:

**IMPORTANT INSTRUCTIONS:**
1. Create TWO separate JSON files: profile.json and versions.json
2. Follow the exact structure shown in the examples below
3. Use realistic, professional content based on my background
4. Create 3 versions with different focuses
5. Ensure all project IDs are consistent between files

**My Background:**
[PASTE YOUR BACKGROUND HERE - education, jobs, skills, projects, etc.]

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
      "degree": "Your Degree",
      "institution": "University Name, Country",
      "period": "Start Date – End Date",
      "highlights": ["Key achievements or coursework"]
    }
  ],
  "work_experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "location": "City, Country",
      "period": "Start Date – End Date",
      "type": "Full-time/Part-time",
      "responsibilities": [
        "Key responsibility or achievement",
        "Another important task or project"
      ],
      "achievements": [
        "Quantifiable achievement with metrics",
        "Recognition or award received"
      ]
    }
  ],
  "technical_skills": {
    "programming": {
      "title": "Programming & Development",
      "items": [
        {
          "name": "Skill Name",
          "level": 4,
          "keywords": ["Tool1", "Tool2", "Framework3"]
        }
      ]
    },
    "tools_platforms": {
      "title": "Tools & Platforms",
      "items": [...]
    }
  },
  "projects": [
    {
      "id": "project-1",
      "title": "Project Title",
      "description": "Project description",
      "features": ["Key feature 1", "Key feature 2"],
      "tech_stack": "Technologies used",
      "year": "2023"
    }
  ],
  "certifications": ["Certification Name – Provider (Year)"],
  "languages": [
    {
      "language": "Language Name",
      "proficiency": "Native/Fluent/Conversational"
    }
  ]
}
````

**VERSIONS.JSON Structure:**

```json
{
  "config": {
    "default_version": "version-1"
  },
  "versions": {
    "version-1": {
      "display_name": "Version 1 Name",
      "theme_color": "#1976d2",
      "icon": "fas fa-laptop-code",
      "summary": "Professional summary for this version",
      "content_config": {
        "skills_focus": ["programming", "tools_platforms"],
        "sections_order": [
          "summary",
          "work_experience", 
          "technical_skills",
          "projects",
          "education",
          "certifications"
        ],
        "projects_limit": 3,
        "include_projects": ["project-1"]
      },
      "content_overrides": {
        "project_descriptions": {
          "project-1": "Version-specific project description"
        }
      }
    }
  }
}
```

Generate both files with realistic content. Make sure project IDs match between files and skills levels are realistic (1-5 scale).

`````

### Step 2: Copy AI Results to Your Files

1. Copy the generated `profile.json` content → save as `data/profile.json`
2. Copy the generated `versions.json` content → save as `data/versions.json`

### Step 3: Start Server & View

```bash
cd persona
python -m http.server 8000
# Open http://localhost:8000
```

## Method 2: Manual Setup (5 minutes)

### Edit `data/profile.json` - Your Basic Info

```json
{
  "personal_info": {
    "name": "Your Name",
    "email": "you@email.com",
    "phone": "+1 234 567 8900",
    "location": "City, Country",
    "links": {
      "linkedin": "https://linkedin.com/in/yourname",
      "github": "https://github.com/yourname"
    }
  },

  "education": [
    {
      "degree": "Your Degree", 
      "institution": "University Name",
      "period": "2020-2024"
    }
  ],

  "work_experience": [
    {
      "title": "Software Developer",
      "company": "Tech Company Inc",
      "location": "San Francisco, CA",
      "period": "2022 – Present",
      "type": "Full-time",
      "responsibilities": [
        "Developed and maintained web applications using React and Node.js",
        "Collaborated with cross-functional teams to deliver features on time"
      ],
      "achievements": [
        "Improved application performance by 40% through code optimization",
        "Led a team of 3 developers on major product feature"
      ]
    }
  ],

  "technical_skills": {
    "programming": {
      "title": "Programming",
      "items": [
        {
          "name": "Python",
          "level": 4,
          "keywords": ["Django", "Flask", "Data Science"]
        },
        {
          "name": "JavaScript",
          "level": 3,
          "keywords": ["React", "Node.js", "Vue"]
        }
      ]
    },
    "tools": {
      "title": "Tools & Platforms",
      "items": [
        { "name": "AWS", "level": 3, "keywords": ["EC2", "S3", "Lambda"] },
        {
          "name": "Docker",
          "level": 4,
          "keywords": ["Containers", "Kubernetes"]
        }
      ]
    }
  },

  "projects": [
    {
      "id": "project1",
      "title": "Your Cool Project",
      "description": "What it does and why it's awesome",
      "tech_stack": "Python, React, PostgreSQL",
      "year": "2024"
    }
  ],

  "certifications": ["AWS Certified Developer (2024)"],
  "languages": [{ "language": "English", "proficiency": "Native" }]
}
```

### Edit `data/versions.json` - Your 3 Resume Versions

```json
{
  "config": { "default_version": "fullstack" },

  "versions": {
    "fullstack": {
      "display_name": "Full Stack Developer",
      "theme_color": "#1976d2",
      "summary": "Full Stack Developer with 3+ years building scalable web applications. Expert in React, Python, and cloud deployment.",
      "content_config": {
        "skills_focus": ["programming", "tools"],
        "sections_order": [
          "summary",
          "work_experience",
          "technical_skills",
          "projects",
          "education"
        ],
        "include_projects": ["project1"]
      }
    },

    "frontend": {
      "display_name": "Frontend Developer",
      "theme_color": "#e91e63",
      "summary": "Frontend Developer specializing in React and modern JavaScript. Passionate about creating intuitive user experiences.",
      "content_config": {
        "skills_focus": ["programming", "tools"],
        "sections_order": [
          "summary",
          "work_experience",
          "technical_skills",
          "projects",
          "education"
        ],
        "include_projects": ["project1"]
      }
    },

    "backend": {
      "display_name": "Backend Developer",
      "theme_color": "#4caf50",
      "summary": "Backend Developer with expertise in Python, databases, and cloud architecture. Focus on building robust, scalable systems.",
      "content_config": {
        "skills_focus": ["programming", "tools"],
        "sections_order": [
          "summary",
          "work_experience",
          "technical_skills",
          "projects",
          "education"
        ],
        "include_projects": ["project1"]
      }
    }
  }
}
```

## Print to PDF

1. Press `Ctrl+P` (or `Cmd+P` on Mac)
2. Set paper size to **A4**
3. Enable **"Background graphics"**
4. Click Print to PDF

## Done! 🎉

Your resume now has multiple versions that automatically switch themes and content focus. Use the dropdown in the top-right to switch between versions.

---

## Why Use the AI Method?

✅ **No JSON writing** - Just describe your background in plain English
✅ **Professional content** - AI writes polished descriptions and summaries
✅ **Consistent structure** - AI follows the exact format needed
✅ **Multiple versions** - Automatically creates 3 targeted resume versions
✅ **2 minutes total** - Fastest way to get a working resume system

## Need More Customization?

### Skill Categories

You can use **any category names**:

```json
"technical_skills": {
  "frontend_development": {"title": "Frontend", "items": [...]},
  "backend_systems": {"title": "Backend", "items": [...]},
  "devops_tools": {"title": "DevOps", "items": [...]}
}
```

### Project Descriptions Per Version

```json
"content_overrides": {
  "project_descriptions": {
    "project1": "Frontend-focused description of this project"
  }
}
```

### More Sections

Add any of these to your `profile.json`:

- `work_experience`: Professional work history with responsibilities and achievements
- `publications`: Academic papers
- `certifications`: Professional certifications
- `phd_research`: Research experience
- `interests`: Personal interests

### Common Issues

- **File not loading?** Check JSON syntax at [jsonlint.com](https://jsonlint.com)
- **Version switcher shows in PDF?** Enable "Background graphics" in print settings
- **Want different colors?** Change `theme_color` to any hex color like `#ff5722`

That's it! See `RESUME_GUIDE.md` for complete documentation.

```

```
