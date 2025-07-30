// Main JavaScript file for resume rendering
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data/data.json");
    const data = await response.json();
    renderResume(data);
    
    // 确保内容渲染完成后再执行分页
    setTimeout(() => {
      if (typeof autoPaginate === 'function') {
        autoPaginate();
      }
      
      // 分页完成后显示页面，消除闪动
      setTimeout(() => {
        document.body.classList.remove('loading');
        document.body.classList.add('loaded');
      }, 50);
    }, 100);
  } catch (error) {
    console.error("Error loading resume data:", error);
    // 即使出错也要显示页面
    document.body.classList.remove('loading');
    document.body.classList.add('loaded');
  }
});

function renderResume(data) {
  const page = document.querySelector('.page');
  
  // Add header first
  const header = document.querySelector('header');
  if (header) {
    page.appendChild(header);
  }
  
  // Render each section
  if (data.summary) {
    renderSummary(data.summary, page);
  }

  if (data.technical_skills && Object.keys(data.technical_skills).length > 0) {
    renderTechnicalSkills(data.technical_skills, page);
  }

  if (data.education && data.education.length > 0) {
    renderEducation(data.education, page);
  }

  if (data.phd_research && data.phd_research.sections.length > 0) {
    renderPhDResearch(data.phd_research, page);
  }

  if (data.projects && data.projects.length > 0) {
    renderProjects(data.projects, page);
  }

  if (data.publications && data.publications.length > 0) {
    renderPublications(data.publications, page);
  }

  if (data.certifications && data.certifications.length > 0) {
    renderCertifications(data.certifications, page);
  }
}

function createSection(id, title, icon) {
  const section = document.createElement('section');
  section.id = id;
  
  const h2 = document.createElement('h2');
  h2.innerHTML = `<i class="${icon}"></i> ${title}`;
  section.appendChild(h2);
  
  return section;
}

function renderSummary(summary, container) {
  const section = createSection('professional-summary', 'Professional Summary', 'fas fa-user-circle');
  
  const p = document.createElement('p');
  p.textContent = summary;
  section.appendChild(p);
  
  container.appendChild(section);
}

function renderEducation(education, container) {
  const section = createSection('education', 'Education', 'fas fa-graduation-cap');
  
  education.forEach(edu => {
    const eduItem = document.createElement('div');
    eduItem.className = 'education-item';
    
    const title = document.createElement('div');
    title.className = 'education-title';
    title.textContent = edu.degree;
    eduItem.appendChild(title);
    
    const institution = document.createElement('div');
    institution.className = 'institution';
    institution.textContent = `${edu.institution} (${edu.period})`;
    eduItem.appendChild(institution);
    
    if (edu.research) {
      const research = document.createElement('div');
      research.textContent = edu.research;
      eduItem.appendChild(research);
    }
    
    if (edu.gpa) {
      const gpa = document.createElement('div');
      gpa.textContent = edu.gpa;
      eduItem.appendChild(gpa);
    }
    
    if (edu.highlights && edu.highlights.length > 0) {
      const ul = document.createElement('ul');
      edu.highlights.forEach(highlight => {
        const li = document.createElement('li');
        li.textContent = highlight;
        ul.appendChild(li);
      });
      eduItem.appendChild(ul);
    }
    
    section.appendChild(eduItem);
  });
  
  container.appendChild(section);
}

function renderPhDResearch(research, container) {
  const section = createSection('phd-research', 'Research Focus', 'fas fa-microscope');
  
  research.sections.forEach(researchSection => {
    const h3 = document.createElement('h3');
    h3.textContent = researchSection.title;
    section.appendChild(h3);
    
    const ul = document.createElement('ul');
    researchSection.items.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item.point;
      
      if (item.detail) {
        const detail = document.createElement('p');
        detail.className = 'research-item-detail';
        detail.textContent = item.detail;
        li.appendChild(detail);
      }
      
      ul.appendChild(li);
    });
    section.appendChild(ul);
  });
  
  container.appendChild(section);
}

function renderTechnicalSkills(skills, container) {
  const section = createSection('technical-skills', 'Technical Skills', 'fas fa-laptop-code');
  
  const sortedCategories = Object.entries(skills).filter(
    ([_, value]) => value && value.items && value.items.length > 0
  );

  const skillsGrid = document.createElement("div");
  skillsGrid.className = "skills-grid";
  
  sortedCategories.forEach(([_, category]) => {
    const skillCategory = document.createElement("div");
    skillCategory.className = "skill-category";
    
    const skillTitle = document.createElement("div");
    skillTitle.className = "skill-title";
    skillTitle.textContent = category.title;
    skillCategory.appendChild(skillTitle);
    
    const skillItems = document.createElement("div");
    skillItems.className = "skill-items";
    
    category.items.sort((a, b) => b.level - a.level).forEach(item => {
      const skillItem = document.createElement("div");
      skillItem.className = "skill-item";
      
      const skillNameGroup = document.createElement("div");
      skillNameGroup.className = "skill-name-group";
      
      const skillName = document.createElement("div");
      skillName.className = "skill-name";
      
      const skillNameText = document.createElement("span");
      skillNameText.className = "skill-name-text";
      skillNameText.textContent = item.name || "";
      
      const skillKeywords = document.createElement("span");
      skillKeywords.className = "skill-keywords";
      skillKeywords.textContent = (item.keywords || []).join(", ");
      
      skillName.appendChild(skillNameText);
      skillName.appendChild(skillKeywords);
      skillNameGroup.appendChild(skillName);
      
      const skillLevel = document.createElement("div");
      skillLevel.className = "skill-level";
      
      const skillRating = document.createElement("div");
      skillRating.className = "skill-rating";
      
      // Create 5 dots for Material Design rating
      for (let i = 1; i <= 5; i++) {
        const dot = document.createElement("div");
        dot.className = "skill-dot";
        if (i <= (item.level || 0)) {
          dot.classList.add("filled");
        }
        skillRating.appendChild(dot);
      }
      
      skillLevel.appendChild(skillRating);
      
      skillItem.appendChild(skillNameGroup);
      skillItem.appendChild(skillLevel);
      skillItems.appendChild(skillItem);
    });
    
    skillCategory.appendChild(skillItems);
    skillsGrid.appendChild(skillCategory);
  });
  
  section.appendChild(skillsGrid);
  container.appendChild(section);
}

function renderProjects(projects, container) {
  const section = createSection('projects', 'Selected Projects', 'fas fa-project-diagram');
  
  projects.forEach(project => {
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    
    const title = document.createElement('h3');
    title.textContent = project.title;
    projectItem.appendChild(title);
    
    if (project.description) {
      const description = document.createElement('p');
      description.className = 'project-description';
      description.textContent = project.description;
      projectItem.appendChild(description);
    }
    
    if (project.features && project.features.length > 0) {
      const featuresUl = document.createElement('ul');
      featuresUl.className = 'project-features';
      project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresUl.appendChild(li);
      });
      projectItem.appendChild(featuresUl);
    }
    
    if (project.tech_stack) {
      const techStack = document.createElement('p');
      techStack.className = 'project-tech-stack';
      techStack.textContent = project.tech_stack;
      projectItem.appendChild(techStack);
    }
    
    if (project.case_studies && project.case_studies.length > 0) {
      const caseStudiesDiv = document.createElement('div');
      caseStudiesDiv.className = 'project-case-studies';
      
      project.case_studies.forEach(caseStudy => {
        const caseStudyItem = document.createElement('div');
        caseStudyItem.className = 'case-study-item';
        
        const caseTitle = document.createElement('h4');
        caseTitle.textContent = caseStudy.title;
        caseStudyItem.appendChild(caseTitle);
        
        const caseUl = document.createElement('ul');
        caseStudy.details.forEach(detail => {
          const li = document.createElement('li');
          li.textContent = detail;
          caseUl.appendChild(li);
        });
        caseStudyItem.appendChild(caseUl);
        caseStudiesDiv.appendChild(caseStudyItem);
      });
      
      projectItem.appendChild(caseStudiesDiv);
    }
    
    section.appendChild(projectItem);
  });
  
  container.appendChild(section);
}

function renderPublications(publications, container) {
  const section = createSection('publications', 'Publications', 'fas fa-book');
  
  const sortedPublications = [...publications].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;
    if (a.type === "Paper" && b.type === "Poster") return -1;
    if (a.type === "Poster" && b.type === "Paper") return 1;
    return 0;
  });
  
  sortedPublications.forEach(pub => {
    const pubItem = document.createElement('div');
    pubItem.className = 'publication-item';
    
    const title = document.createElement('div');
    title.className = 'publication-title';
    title.textContent = pub.title;
    pubItem.appendChild(title);
    
    const meta = document.createElement('div');
    meta.className = 'publication-meta';
    
    const authors = document.createElement('div');
    authors.className = 'publication-authors';
    authors.textContent = pub.authors;
    meta.appendChild(authors);
    
    const venue = document.createElement('div');
    venue.className = 'publication-venue';
    
    const venueSpan = document.createElement('span');
    venueSpan.textContent = `${pub.venue} (${pub.year})`;
    venue.appendChild(venueSpan);
    
    const typeSpan = document.createElement('span');
    typeSpan.className = 'publication-type';
    typeSpan.textContent = pub.type;
    venue.appendChild(typeSpan);
    
    meta.appendChild(venue);
    pubItem.appendChild(meta);
    section.appendChild(pubItem);
  });
  
  container.appendChild(section);
}

function renderCertifications(certifications, container) {
  const section = createSection('certifications', 'Certifications', 'fas fa-certificate');
  const ul = document.createElement('ul');
  
  certifications.forEach(cert => {
    const li = document.createElement('li');
    li.textContent = cert;
    ul.appendChild(li);
  });
  
  section.appendChild(ul);
  container.appendChild(section);
}