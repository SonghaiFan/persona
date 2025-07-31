// Main JavaScript file for resume rendering
let resumeData = null;
let versionsData = null;
let currentVersion = "data-viz";

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // Load both data files
    const [resumeResponse, versionsResponse] = await Promise.all([
      fetch("data/profile.json"),
      fetch("data/versions.json"),
    ]);

    resumeData = await resumeResponse.json();
    versionsData = await versionsResponse.json();

    // Set default version from config
    currentVersion = versionsData.config.default_version;

    // Render header from profile data
    renderHeader(resumeData);

    // Initialize version switcher
    initVersionSwitcher();

    // Apply initial theme with dynamic colors
    applyTheme(currentVersion);

    // Render initial version
    renderResume(resumeData, versionsData, currentVersion);

    // 确保内容渲染完成后再执行分页
    setTimeout(() => {
      if (typeof autoPaginate === "function") {
        autoPaginate();
      }

      // 分页完成后显示页面，消除闪动
      setTimeout(() => {
        document.body.classList.remove("loading");
        document.body.classList.add("loaded");
      }, 50);
    }, 100);
  } catch (error) {
    console.error("Error loading resume data:", error);
    // 即使出错也要显示页面
    document.body.classList.remove("loading");
    document.body.classList.add("loaded");
  }
});

function renderHeader(profileData) {
  const personal = profileData.personal_info;

  // Set the name
  const nameElement = document.getElementById("headerName");
  if (nameElement) {
    nameElement.textContent = personal.name;
  }

  // Build contact info
  const contactContainer = document.getElementById("headerContactInfo");
  if (contactContainer) {
    // Extract readable link text from URLs
    const githubText = personal.links.github.replace(
      "https://github.com/",
      "github.com/"
    );
    const websiteText = personal.links.website.replace("https://", "");
    const linkedinText = personal.links.linkedin.replace(
      "https://www.linkedin.com/in/",
      "linkedin.com/in/"
    );

    contactContainer.innerHTML = `
      <div class="contact-info-row">
        <span class="contact-item">
          <i class="fas fa-map-marker-alt"></i> ${personal.location}
        </span>
        <span class="contact-item">
          <i class="fas fa-phone"></i> ${personal.phone}
        </span>
        <span class="contact-item">
          <i class="fas fa-envelope"></i> ${personal.email}
        </span>
      </div>
      <div class="contact-info-row">
        <span class="contact-item">
          <i class="fab fa-github"></i>
          <a href="${personal.links.github}" target="_blank" class="contact-link">
            ${githubText}
          </a>
        </span>
        <span class="contact-item">
          <i class="fas fa-globe"></i>
          <a href="${personal.links.website}" target="_blank" class="contact-link">
            ${websiteText}
          </a>
        </span>
        <span class="contact-item">
          <i class="fab fa-linkedin"></i>
          <a href="${personal.links.linkedin}" target="_blank" class="contact-link">
            ${linkedinText}
          </a>
        </span>
      </div>
    `;
  }
}

function initVersionSwitcher() {
  const versionSelect = document.getElementById("versionSelect");
  if (versionSelect && versionsData) {
    // Clear existing options
    versionSelect.innerHTML = "";

    // Add options from versions data
    Object.keys(versionsData.versions).forEach((versionKey) => {
      const version = versionsData.versions[versionKey];
      const option = document.createElement("option");
      option.value = versionKey;
      option.textContent = version.display_name;
      versionSelect.appendChild(option);
    });

    versionSelect.value = currentVersion;

    versionSelect.addEventListener("change", (e) => {
      currentVersion = e.target.value;
      handleVersionChange(currentVersion);
    });
  } else {
    console.warn("Version switcher not initialized - missing element or data");
  }
}

function applyTheme(version) {
  if (!versionsData || !versionsData.versions[version]) {
    console.warn(
      `Cannot apply theme - versionsData or version not found: ${version}`
    );
    return;
  }

  const versionConfig = versionsData.versions[version];
  const themeColor = versionConfig.theme_color;

  // Remove all existing theme classes
  document.body.classList.remove(
    "theme-data-viz",
    "theme-ux-research",
    "theme-ai-consultant"
  );

  // Add the new theme class
  document.body.classList.add(`theme-${version}`);

  // Dynamically set the theme color CSS custom property
  document.documentElement.style.setProperty("--theme-color", themeColor);
}

function handleVersionChange(version) {
  // Check if data is loaded
  if (!versionsData || !resumeData) {
    console.warn("Data not loaded yet, cannot change version");
    return;
  }

  // Show loading state during transition
  document.body.style.opacity = "0.8";

  // Clear all existing pages first
  resetPageLayout();

  // Apply new theme with dynamic colors
  applyTheme(version);

  // Re-render content
  renderResume(resumeData, versionsData, version);

  // Re-run pagination after content change
  setTimeout(() => {
    if (typeof autoPaginate === "function") {
      autoPaginate();
    }

    // Restore opacity after layout is complete
    setTimeout(() => {
      document.body.style.opacity = "1";
    }, 50);
  }, 100);
}

function resetPageLayout() {
  // Remove all pages except the first one
  const book = document.getElementById("book");
  const pages = book.querySelectorAll(".page");

  // Keep only the first page, remove all others
  for (let i = 1; i < pages.length; i++) {
    pages[i].remove();
  }

  // Clear the first page content (except header)
  const firstPage = book.querySelector(".page");
  if (firstPage) {
    const header = firstPage.querySelector("header");
    firstPage.innerHTML = "";
    if (header) {
      firstPage.appendChild(header);
    }
  }
}

function renderResume(profileData, versionsData, version = "data-viz") {
  const page = document.querySelector(".page");

  // Preserve header before clearing
  const header = document.querySelector("header");

  // Clear existing content
  page.innerHTML = "";

  // Re-add header if it exists
  if (header) {
    page.appendChild(header);
  }

  // Get version-specific configuration
  if (
    !versionsData ||
    !versionsData.versions ||
    !versionsData.versions[version]
  ) {
    console.error(
      `Version configuration not found for: ${version}`,
      "Available versions:",
      versionsData?.versions ? Object.keys(versionsData.versions) : "none"
    );
    return;
  }

  const versionConfig = versionsData.versions[version];
  const contentConfig = versionConfig.content_config;
  const sectionsOrder = contentConfig.sections_order;
  const summary = versionConfig.summary;
  const skillsFocus = contentConfig.skills_focus;
  const projectsLimit = contentConfig.projects_limit;

  // Render sections in version-specific order
  sectionsOrder.forEach((sectionName) => {
    switch (sectionName) {
      case "summary":
        if (summary) {
          renderSummary(summary, page);
        }
        break;
      case "technical_skills":
        if (
          profileData.technical_skills &&
          Object.keys(profileData.technical_skills).length > 0
        ) {
          renderTechnicalSkills(
            profileData.technical_skills,
            page,
            skillsFocus
          );
        }
        break;
      case "work_experience":
        if (profileData.work_experience && profileData.work_experience.length > 0) {
          renderWorkExperience(profileData.work_experience, page);
        }
        break;
      case "education":
        if (profileData.education && profileData.education.length > 0) {
          renderEducation(profileData.education, page);
        }
        break;
      case "phd_research":
        if (
          profileData.phd_research &&
          profileData.phd_research.sections.length > 0
        ) {
          renderPhDResearch(profileData.phd_research, page);
        }
        break;
      case "projects":
        // Get version-specific projects
        if (profileData.projects && profileData.projects.length > 0) {
          const projectsToRender = profileData.projects.slice(0, projectsLimit);
          renderProjects(projectsToRender, page, contentConfig.project_focus);
        }
        break;
      case "publications":
        if (profileData.publications && profileData.publications.length > 0) {
          renderPublications(profileData.publications, page);
        }
        break;
      case "certifications":
        if (
          profileData.certifications &&
          profileData.certifications.length > 0
        ) {
          renderCertifications(profileData.certifications, page);
        }
        break;
      case "certifications":
        if (data.certifications && data.certifications.length > 0) {
          renderCertifications(data.certifications, page);
        }
        break;
    }
  });
}

function createSection(id, title, icon) {
  const section = document.createElement("section");
  section.id = id;

  const h2 = document.createElement("h2");
  h2.innerHTML = `<i class="${icon}"></i> ${title}`;
  section.appendChild(h2);

  return section;
}

function renderSummary(summary, container) {
  const section = createSection(
    "professional-summary",
    "Professional Summary",
    "fas fa-user-circle"
  );

  const p = document.createElement("p");
  p.textContent = summary;
  section.appendChild(p);

  container.appendChild(section);
}

function renderEducation(education, container) {
  const section = createSection(
    "education",
    "Education",
    "fas fa-graduation-cap"
  );

  education.forEach((edu) => {
    const eduItem = document.createElement("div");
    eduItem.className = "education-item";

    const title = document.createElement("div");
    title.className = "education-title";
    title.textContent = edu.degree;
    eduItem.appendChild(title);

    const institution = document.createElement("div");
    institution.className = "institution";
    institution.textContent = `${edu.institution} (${edu.period})`;
    eduItem.appendChild(institution);

    if (edu.research) {
      const research = document.createElement("div");
      research.textContent = edu.research;
      eduItem.appendChild(research);
    }

    if (edu.gpa) {
      const gpa = document.createElement("div");
      gpa.textContent = edu.gpa;
      eduItem.appendChild(gpa);
    }

    if (edu.highlights && edu.highlights.length > 0) {
      const ul = document.createElement("ul");
      edu.highlights.forEach((highlight) => {
        const li = document.createElement("li");
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
  const section = createSection(
    "phd-research",
    "Research Focus",
    "fas fa-microscope"
  );

  research.sections.forEach((researchSection) => {
    const h3 = document.createElement("h3");
    h3.textContent = researchSection.title;
    section.appendChild(h3);

    const ul = document.createElement("ul");
    researchSection.items.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item.point;

      if (item.detail) {
        const detail = document.createElement("p");
        detail.className = "research-item-detail";
        detail.textContent = item.detail;
        li.appendChild(detail);
      }

      ul.appendChild(li);
    });
    section.appendChild(ul);
  });

  container.appendChild(section);
}

function renderTechnicalSkills(skills, container, skillsFocus = null) {
  const section = createSection(
    "technical-skills",
    "Technical Skills",
    "fas fa-cubes"
  );

  let sortedCategories = Object.entries(skills).filter(
    ([_, value]) => value && value.items && value.items.length > 0
  );

  // Sort categories based on skills focus if provided
  if (skillsFocus && skillsFocus.length > 0) {
    sortedCategories.sort((a, b) => {
      const indexA = skillsFocus.indexOf(a[0]);
      const indexB = skillsFocus.indexOf(b[0]);

      // If both are in focus list, sort by focus order
      if (indexA !== -1 && indexB !== -1) {
        return indexA - indexB;
      }
      // If only A is in focus, A comes first
      if (indexA !== -1 && indexB === -1) return -1;
      // If only B is in focus, B comes first
      if (indexA === -1 && indexB !== -1) return 1;
      // If neither are in focus, maintain original order
      return 0;
    });
  }

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

    category.items
      .sort((a, b) => b.level - a.level)
      .forEach((item) => {
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

function renderProjects(projects, container, projectFocus = null) {
  const section = createSection("projects", "Selected Projects", "fas fa-star");

  projects.forEach((project) => {
    const projectItem = document.createElement("div");
    projectItem.className = "project-item";

    const title = document.createElement("h3");
    title.textContent = project.title;
    projectItem.appendChild(title);

    // Use version-specific project focus if available, otherwise use original description
    const descriptionText =
      projectFocus && projectFocus[project.title]
        ? projectFocus[project.title]
        : project.description;

    if (descriptionText) {
      const description = document.createElement("p");
      description.className = "project-description";
      description.textContent = descriptionText;
      projectItem.appendChild(description);
    }

    if (project.features && project.features.length > 0) {
      const featuresUl = document.createElement("ul");
      featuresUl.className = "project-features";
      project.features.forEach((feature) => {
        const li = document.createElement("li");
        li.textContent = feature;
        featuresUl.appendChild(li);
      });
      projectItem.appendChild(featuresUl);
    }

    if (project.tech_stack) {
      const techStack = document.createElement("p");
      techStack.className = "project-tech-stack";
      techStack.textContent = project.tech_stack;
      projectItem.appendChild(techStack);
    }

    if (project.items && project.items.length > 0) {
      const caseStudiesDiv = document.createElement("div");
      caseStudiesDiv.className = "project-case-studies";

      project.items.forEach((caseStudy) => {
        const caseStudyItem = document.createElement("div");
        caseStudyItem.className = "case-study-item";

        const caseTitle = document.createElement("h4");
        caseTitle.textContent = caseStudy.title;
        caseStudyItem.appendChild(caseTitle);

        const caseUl = document.createElement("ul");
        caseStudy.details.forEach((detail) => {
          const li = document.createElement("li");
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
  const section = createSection("publications", "Publications", "fas fa-book");

  const sortedPublications = [...publications].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;
    if (a.type === "Paper" && b.type === "Poster") return -1;
    if (a.type === "Poster" && b.type === "Paper") return 1;
    return 0;
  });

  sortedPublications.forEach((pub) => {
    const pubItem = document.createElement("div");
    pubItem.className = "publication-item";

    const title = document.createElement("div");
    title.className = "publication-title";
    title.textContent = pub.title;
    pubItem.appendChild(title);

    const meta = document.createElement("div");
    meta.className = "publication-meta";

    const authors = document.createElement("div");
    authors.className = "publication-authors";
    authors.textContent = pub.authors;
    meta.appendChild(authors);

    const venue = document.createElement("div");
    venue.className = "publication-venue";

    const venueSpan = document.createElement("span");
    venueSpan.textContent = `${pub.venue} (${pub.year})`;
    venue.appendChild(venueSpan);

    const typeSpan = document.createElement("span");
    typeSpan.className = "publication-type";
    typeSpan.textContent = pub.type;
    venue.appendChild(typeSpan);

    meta.appendChild(venue);
    pubItem.appendChild(meta);
    section.appendChild(pubItem);
  });

  container.appendChild(section);
}

function renderCertifications(certifications, container) {
  const section = createSection(
    "certifications",
    "Certifications",
    "fas fa-certificate"
  );
  const ul = document.createElement("ul");

  certifications.forEach((cert) => {
    const li = document.createElement("li");
    li.textContent = cert;
    ul.appendChild(li);
  });

  section.appendChild(ul);
  container.appendChild(section);
}

function renderWorkExperience(workExperience, container) {
  const section = createSection(
    "work-experience",
    "Work Experience",
    "fas fa-briefcase"
  );

  workExperience.forEach((job) => {
    const jobItem = document.createElement("div");
    jobItem.className = "work-experience-item";

    const jobHeader = document.createElement("div");
    jobHeader.className = "job-header";

    const jobTitle = document.createElement("div");
    jobTitle.className = "job-title";
    jobTitle.textContent = job.title;
    jobHeader.appendChild(jobTitle);

    const jobMeta = document.createElement("div");
    jobMeta.className = "job-meta";

    const companyLocation = document.createElement("div");
    companyLocation.className = "company-location";
    companyLocation.textContent = `${job.company}, ${job.location}`;
    jobMeta.appendChild(companyLocation);

    const periodType = document.createElement("div");
    periodType.className = "period-type";
    periodType.textContent = `${job.period}${job.type ? ` • ${job.type}` : ''}`;
    jobMeta.appendChild(periodType);

    jobHeader.appendChild(jobMeta);
    jobItem.appendChild(jobHeader);

    if (job.responsibilities && job.responsibilities.length > 0) {
      const responsibilitiesUl = document.createElement("ul");
      responsibilitiesUl.className = "job-responsibilities";
      job.responsibilities.forEach((responsibility) => {
        const li = document.createElement("li");
        li.textContent = responsibility;
        responsibilitiesUl.appendChild(li);
      });
      jobItem.appendChild(responsibilitiesUl);
    }

    if (job.achievements && job.achievements.length > 0) {
      const achievementsDiv = document.createElement("div");
      achievementsDiv.className = "job-achievements";
      
      const achievementsTitle = document.createElement("div");
      achievementsTitle.className = "achievements-title";
      achievementsTitle.textContent = "Key Achievements:";
      achievementsDiv.appendChild(achievementsTitle);

      const achievementsUl = document.createElement("ul");
      achievementsUl.className = "achievements-list";
      job.achievements.forEach((achievement) => {
        const li = document.createElement("li");
        li.textContent = achievement;
        achievementsUl.appendChild(li);
      });
      achievementsDiv.appendChild(achievementsUl);
      jobItem.appendChild(achievementsDiv);
    }

    section.appendChild(jobItem);
  });

  container.appendChild(section);
}
