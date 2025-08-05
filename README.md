# Frankie Résumé 📄

> **Super Simple Yet Powerful Resume Template**  
> The minimalist approach to professional resumes - just HTML, CSS, and JavaScript. No frameworks, no dependencies, no complexity.

## ✨ Why Frankie Résumé?

**Pure Simplicity** - Built with the fundamental web trio:

- 📄 **HTML** - Clean, semantic structure
- 🎨 **CSS** - Beautiful Material Design styling
- ⚡ **JavaScript** - Dynamic content rendering
- 🚫 **Zero Dependencies** - No frameworks, no build tools, no package managers

**One Template, Multiple Versions** - Easily switch between different resume versions for different roles or industries.

**Edit Once, Deploy Anywhere** - Just modify the JSON data file and you're ready to go!

---

## 🚀 Quick Start

### The 3-Step Resume Revolution

```bash
# 1. Fork this repository to your GitHub account
# 2. Edit data/profile.json with your information
# 3. Print the page - you get your resume done! 🎉
```

### Detailed Steps

### 1. Clone & Customize

```bash
git clone https://github.com/SonghaiFan/persona.git
cd persona
```

### 2. Edit Your Data

Open `data/profile.json` and replace with your information:

```json
{
  "personal_info": {
    "first_name": "Your",
    "last_name": "Name",
    "first_name_pronounce": "your-pronunciation",
    "last_name_pronounce": "name-pronunciation",
    "nickname": "Nickname"
    // ... rest of your data
  }
}
```

### 3. Add More Versions

Create additional JSON files in the `data/` folder:

- `data/tech-focused.json` - For tech roles
- `data/business-focused.json` - For business roles
- `data/creative-focused.json` - For creative roles

### 4. Launch & Print

Open `index.html` in any web browser, select your preferred version, and hit **Ctrl+P** (or **Cmd+P** on Mac) to print. That's it! 🎉

**Real Example**: Check out how the current `profile.json` creates a complete PhD researcher resume with multiple specialized versions - just by editing JSON data!

---

## 🎯 Unlimited Versions for Your Job Hunt

**Create as many resume versions as you need!** The beauty of Frank Résumé lies in its flexibility:

### 📊 **Built-in Example Versions**

The template comes with 5 professionally crafted versions:

- 🔬 **Data Scientist/Analyst** - Statistical modeling & analytics focus
- 🤖 **NLP/AI Engineer** - Machine learning & language processing
- 👥 **UX Researcher** - Human-centered design & research
- 📈 **Data Viz Developer** - Interactive visualization & web development
- 🗄️ **Data Engineer** - Big data infrastructure & pipelines

### 🚀 **Your Custom Versions**

Create unlimited versions for any role or industry:

```
data/
├── profile.json           # Your master data
├── versions.json          # Version configurations
├── frontend-developer.json
├── product-manager.json
├── marketing-analyst.json
├── startup-founder.json
├── consultant.json
└── academic-researcher.json
```

### 🎨 **Each Version Can Have:**

- **Different summaries** - Tailored to specific role requirements
- **Reordered sections** - Highlight what matters most for each job
- **Selected skills** - Show relevant expertise for the position
- **Custom project descriptions** - Frame your work for different audiences
- **Unique color themes** - Match company branding or personal preference
- **Focused content** - Emphasize publications for academia, metrics for business

### 💡 **Smart Strategy Examples:**

- **Startup Role**: Emphasize innovation, full-stack skills, rapid prototyping
- **Enterprise Role**: Highlight scalability, teamwork, process optimization
- **Academic Position**: Focus on research, publications, methodology
- **Consulting**: Emphasize problem-solving, diverse industry experience
- **Remote Work**: Showcase communication, self-direction, digital collaboration

**One profile data → Infinite targeted resumes!** 🎯

---

## 📁 Project Structure

```
persona/
├── index.html          # Main resume page
├── main.css           # All styling (Material Design)
├── main.js            # Dynamic content rendering
├── data/
│   ├── profile.json   # Your main resume data
│   └── versions.json  # Available resume versions
└── README.md          # You are here
```

**That's literally it.** Three core files, two data files. No `node_modules`, no build process, no configuration hell.

---

## 🎯 Features

### 📱 **Print-Ready & Responsive**

- Perfectly formatted for A4 printing
- Responsive design for all screen sizes
- Professional typography and spacing

### 🎨 **Beautiful Design**

- Material Design inspired
- Clean, minimalist aesthetic
- Multiple color themes
- Elegant typography with custom fonts

### 🔄 **Multi-Version Support**

- Switch between resume versions instantly
- Tailor content for different job applications
- Maintain multiple specializations

### 📊 **Smart Content Organization**

- Automatic pagination
- Skill rating system
- Project showcases with case studies
- Publication listings
- Work experience with achievements

### 🔧 **Developer Friendly**

- Pure HTML/CSS/JS - edit with any text editor
- No build process required
- Host anywhere (GitHub Pages, Netlify, etc.)
- Easy to customize and extend

---

## 🎨 Customization

### Color Themes

The template includes multiple built-in themes. Colors are defined using CSS custom properties:

```css
:root {
  --primary-color: #000000;
  --secondary-color: #616161;
  --accent-color: #1e1e1e;
  /* Easy to customize! */
}
```

### Typography

Uses Google Fonts with fallbacks:

- **Inter** - Clean, professional sans-serif
- **Nothing You Could Do** - Handwritten app title
- Perfect print optimization

### Layout

Responsive grid system that works everywhere:

- Desktop: Full-width professional layout
- Print: Optimized A4 format
- Mobile: Stacked, touch-friendly design

---

## 🚀 Deployment

### GitHub Pages (Recommended)

1. Push your customized resume to GitHub
2. Enable GitHub Pages in repository settings
3. Your resume is live at `https://yourusername.github.io/persona`

### Other Options

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repo
- **Any Web Server**: Upload the files

---

## 📋 Data Structure

Your resume data lives in `data/profile.json`. Here's the structure:

```json
{
  "personal_info": {
    "first_name": "Songhai",
    "last_name": "Fan",
    "nickname": "Frank",
    "email": "your.email@domain.com",
    "phone": "+1-xxx-xxx-xxxx",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/yourprofile",
    "github": "github.com/yourusername",
    "website": "yourwebsite.com"
  },
  "education": [...],
  "work_experience": [...],
  "skills": [...],
  "projects": [...],
  "publications": [...]
}
```

See the existing `profile.json` for complete examples.

---

## 🎯 Perfect For

- **Job Seekers** - Multiple targeted resumes
- **Freelancers** - Professional project showcases
- **Academics** - Publication and research listings
- **Developers** - Technical skill demonstrations
- **Anyone** - Who wants a beautiful, simple resume

---

## 🤝 Contributing

This project thrives on simplicity. If you have ideas that maintain the "zero-dependency" philosophy:

1. Fork the repository
2. Create your feature branch
3. Keep it simple and lightweight
4. Submit a pull request

---

## 📄 License

MIT License - Use it, modify it, share it!

---

## 💡 Philosophy

> "The best tools are the ones you can understand completely."

Frankie Résumé believes in the power of simplicity. In a world of complex frameworks and overwhelming build processes, sometimes the best solution is the simplest one. Three files, zero dependencies, infinite possibilities.

**Why complicate when you can create?**

---

_Made with ❤️ for job seekers who value simplicity and effectiveness._
