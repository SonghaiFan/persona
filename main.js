// Unified Resume App - Consolidated JavaScript following KISS, DRY, YAGNI principles
// =============================================================================

// Global Application State
let resumeData = null;
let versionsData = null;
let currentVersion = "data-viz";

// =============================================================================
// UTILITY FUNCTIONS - Essential helpers only
// =============================================================================

// Simple debounce function
function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// DOM element creation helper
function createElement(tag, options = {}) {
  const element = document.createElement(tag);
  if (options.className) element.className = options.className;
  if (options.textContent) element.textContent = options.textContent;
  if (options.innerHTML) element.innerHTML = options.innerHTML;
  if (options.children)
    options.children.forEach((child) => element.appendChild(child));
  return element;
}

// Shorthand creators
const createDiv = (className, content) =>
  createElement("div", { className, textContent: content });
const createSection = (id, title, icon) => {
  const section = createElement("section", { className: "section" });
  section.id = id;
  const h2 = createElement("h2", {
    innerHTML: `<i class="${icon}"></i> ${title}`,
  });
  section.appendChild(h2);
  return section;
};

// =============================================================================
// DATA LOADING - Simplified data loading with fallback
// =============================================================================

async function loadData() {
  try {
    // Try new separated structure first
    const [profileRes, versionsRes] = await Promise.all([
      fetch("data/profile.json"),
      fetch("data/versions.json"),
    ]);

    if (profileRes.ok && versionsRes.ok) {
      const [profile, versions] = await Promise.all([
        profileRes.json(),
        versionsRes.json(),
      ]);

      resumeData = profile;
      versionsData = versions;
      currentVersion =
        versions.config?.default_version || Object.keys(versions.versions)[0];

      console.log("✅ Loaded separated data structure");
      return true;
    }

    // Fallback to legacy structure
    const legacyRes = await fetch("data/data.json");
    if (legacyRes.ok) {
      const legacyData = await legacyRes.json();
      resumeData = legacyData;
      versionsData = legacyData;
      currentVersion =
        legacyData.config?.default_version ||
        Object.keys(legacyData.versions)[0];

      console.log("✅ Loaded legacy data structure");
      return true;
    }

    throw new Error("No data files found");
  } catch (error) {
    console.error("❌ Failed to load data:", error);
    showError("Failed to load resume data. Please refresh the page.");
    return false;
  }
}

function showError(message) {
  document.body.innerHTML = `<div class="error-message">${message}</div>`;
}

// =============================================================================
// VALIDATION - Essential validation only
// =============================================================================

function validateData() {
  if (!resumeData || !versionsData) return false;

  // Basic structure validation
  if (
    !versionsData.versions ||
    Object.keys(versionsData.versions).length === 0
  ) {
    console.error("No versions found in data");
    return false;
  }

  // Validate current version exists
  if (!versionsData.versions[currentVersion]) {
    currentVersion = Object.keys(versionsData.versions)[0];
    console.warn(`Invalid current version, switching to: ${currentVersion}`);
  }

  return true;
}

// =============================================================================
// THEME MANAGEMENT - Simplified theme handling
// =============================================================================

function generateThemeCSS() {
  let css = "";
  Object.entries(versionsData.versions).forEach(([key, config]) => {
    const themeColor = config.theme_color || "#666666";
    const rgba = hexToRgba(themeColor, 0.1);

    css += `
/* Theme: ${key} */
body.theme-${key} {
  --theme-color: ${themeColor};
  --theme-rgba: ${rgba};
}

body.theme-${key} :is(h1, h2 i, .contact-link) { color: var(--theme-color); }
body.theme-${key} h2 { color: var(--theme-color); border-bottom: 1px solid var(--divider-color); }
body.theme-${key} .skill-dot.filled { background-color: var(--theme-color); }
body.theme-${key} .version-select { 
  border-color: var(--theme-color);
}
body.theme-${key} .version-select:focus { 
  border-color: var(--theme-color); 
  box-shadow: 0 0 0 2px var(--theme-rgba); 
}
`;
  });

  // Inject or update styles
  let styleElement = document.getElementById("dynamic-themes");
  if (!styleElement) {
    styleElement = createElement("style", { id: "dynamic-themes" });
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = css;
}

function hexToRgba(hex, alpha = 1) {
  const rgb = hex.match(/\w\w/g)?.map((x) => parseInt(x, 16));
  return rgb ? `rgba(${rgb.join(", ")}, ${alpha})` : `rgba(0, 0, 0, ${alpha})`;
}

function applyTheme(version) {
  // Remove existing theme classes
  document.body.classList.forEach((cls) => {
    if (cls.startsWith("theme-")) document.body.classList.remove(cls);
  });

  // Add new theme class
  document.body.classList.add(`theme-${version}`);
}

// =============================================================================
// PAGINATION - Simplified auto-pagination
// =============================================================================

function autoPaginate() {
  const book = document.getElementById("book");
  const pages = book.querySelectorAll(".page");

  // Reset - keep only first page
  for (let i = 1; i < pages.length; i++) {
    pages[i].remove();
  }

  const firstPage = book.querySelector(".page");
  const pageHeight = firstPage.clientHeight;

  splitPage(firstPage);

  function splitPage(page) {
    while (page.scrollHeight > pageHeight) {
      const newPage = page.cloneNode(false);
      page.after(newPage);

      while (page.scrollHeight > pageHeight && page.lastChild) {
        newPage.prepend(page.lastChild);
      }

      if (newPage.scrollHeight > pageHeight) {
        splitPage(newPage);
      }
    }
  }
}

// =============================================================================
// UI RENDERING - Consolidated rendering functions
// =============================================================================

function renderHeaderInPage(container) {
  const personal = resumeData.personal_info;

  // Create header section inside the page
  const headerSection = createElement("header", { className: "page-header" });

  const headerContent = createDiv("header-content");

  // Name
  const headerText = createDiv("header-text");
  const name = createElement("h1", { textContent: personal.name });
  headerText.appendChild(name);

  // Contact info
  const contactInfo = createDiv("contact-info");
  const githubText = personal.links.github.replace(
    "https://github.com/",
    "github.com/"
  );
  const websiteText = personal.links.website.replace("https://", "");
  const linkedinText = personal.links.linkedin.replace(
    "https://www.linkedin.com/in/",
    "linkedin.com/in/"
  );

  contactInfo.innerHTML = `
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
        <a href="${personal.links.github}" target="_blank" class="contact-link">${githubText}</a>
      </span>
      <span class="contact-item">
        <i class="fas fa-globe"></i>
        <a href="${personal.links.website}" target="_blank" class="contact-link">${websiteText}</a>
      </span>
      <span class="contact-item">
        <i class="fab fa-linkedin"></i>
        <a href="${personal.links.linkedin}" target="_blank" class="contact-link">${linkedinText}</a>
      </span>
    </div>
  `;

  headerContent.appendChild(headerText);
  headerContent.appendChild(contactInfo);
  headerSection.appendChild(headerContent);

  container.appendChild(headerSection);
}

function initVersionSwitcher() {
  const versionSelect = document.getElementById("versionSelect");
  if (!versionSelect || !versionsData) return;

  // Clear and populate options
  versionSelect.innerHTML = "";
  Object.entries(versionsData.versions).forEach(([key, version]) => {
    const option = new Option(version.display_name, key);
    versionSelect.appendChild(option);
  });

  versionSelect.value = currentVersion;
  versionSelect.addEventListener("change", (e) =>
    switchVersion(e.target.value)
  );
}

function switchVersion(version) {
  if (!versionsData.versions[version]) return;

  currentVersion = version;
  document.body.style.opacity = "0.8";

  // Clear content and re-render
  const firstPage = document.querySelector(".page");
  firstPage.innerHTML = "";

  applyTheme(version);
  renderResume();

  setTimeout(() => {
    autoPaginate();
    setTimeout(() => (document.body.style.opacity = "1"), 50);
  }, 100);
}

function renderResume() {
  const page = document.querySelector(".page");
  const versionConfig = versionsData.versions[currentVersion];
  const sectionsOrder =
    versionConfig.content_config?.sections_order ||
    versionConfig.sections_order ||
    [];

  // First render the header inside the page
  renderHeaderInPage(page);

  sectionsOrder.forEach((sectionName) => {
    switch (sectionName) {
      case "summary":
        if (versionConfig.summary) renderSummary(versionConfig.summary, page);
        break;
      case "technical_skills":
        if (resumeData.skills_pool) renderTechnicalSkills(page, versionConfig);
        break;
      case "education":
        if (resumeData.education) renderEducation(resumeData.education, page);
        break;
      case "projects":
        if (resumeData.projects) renderProjects(page, versionConfig);
        break;
      case "publications":
        if (resumeData.publications)
          renderPublications(resumeData.publications, page);
        break;
      case "work_experience":
        if (resumeData.work_experience)
          renderWorkExperience(resumeData.work_experience, page);
        break;
      case "phd_research":
        if (resumeData.phd_research)
          renderPhDResearch(resumeData.phd_research, page);
        break;
      case "certifications":
        if (resumeData.certifications)
          renderCertifications(resumeData.certifications, page);
        break;
    }
  });
}

// Section rendering functions
function renderSummary(summary, container) {
  const section = createSection(
    "professional-summary",
    "Summary",
    "fas fa-user-circle"
  );
  const p = createElement("p", { textContent: summary });
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
    const eduItem = createDiv("education-item");

    const leftColumn = createDiv("education-left");
    leftColumn.appendChild(createDiv("education-title", edu.degree));
    if (edu.research) leftColumn.appendChild(createDiv("", edu.research));
    if (edu.gpa) leftColumn.appendChild(createDiv("", edu.gpa));
    if (edu.highlights?.length) {
      const ul = createElement("ul");
      edu.highlights.forEach((highlight) => {
        ul.appendChild(createElement("li", { textContent: highlight }));
      });
      leftColumn.appendChild(ul);
    }

    const rightColumn = createDiv("education-right");
    rightColumn.appendChild(createDiv("institution", edu.institution));
    rightColumn.appendChild(createDiv("education-period", edu.period));

    eduItem.appendChild(leftColumn);
    eduItem.appendChild(rightColumn);
    section.appendChild(eduItem);
  });

  container.appendChild(section);
}

function renderTechnicalSkills(container, versionConfig) {
  const section = createSection("technical-skills", "Skills", "fas fa-cubes");
  const skillsGrid = createDiv("skills-grid");

  const selectedSkillIds = versionConfig.content_config?.selected_skills || [];
  const skillsPool = resumeData.skills_pool;

  // Group skills by selection
  const selectedSkills = [];
  const unselectedSkills = [];

  Object.entries(skillsPool).forEach(([skillId, skill]) => {
    const skillData = { ...skill, id: skillId };
    if (selectedSkillIds.includes(skillId)) {
      selectedSkills.push(skillData);
    } else {
      unselectedSkills.push(skillData);
    }
  });

  // Sort by level
  selectedSkills.sort((a, b) => b.level - a.level);
  unselectedSkills.sort((a, b) => b.level - a.level);

  // Render selected skills
  selectedSkills.forEach((skill) => {
    const skillItem = createDiv("skill-item skill-selected");
    skillItem.appendChild(createSkillHeader(skill));
    skillItem.appendChild(createSkillDetails(skill, true));
    skillsGrid.appendChild(skillItem);
  });

  // Render unselected skills container
  if (unselectedSkills.length > 0) {
    const unselectedContainer = createDiv(
      "skill-item skill-unselected-container"
    );
    const unselectedList = createDiv("unselected-skills-list");

    unselectedSkills.forEach((skill) => {
      const unselectedSkill = createDiv("unselected-skill-item");
      unselectedSkill.appendChild(createSkillHeader(skill, true));
      unselectedSkill.appendChild(createSkillDetails(skill, false));
      unselectedList.appendChild(unselectedSkill);
    });

    unselectedContainer.appendChild(unselectedList);
    skillsGrid.appendChild(unselectedContainer);
  }

  section.appendChild(skillsGrid);
  container.appendChild(section);
}

function createSkillHeader(skill, isUnselected = false) {
  const header = createDiv(
    isUnselected ? "unselected-skill-header" : "skill-header"
  );
  const nameGroup = createDiv("skill-name-group");
  const name = createDiv(
    isUnselected ? "unselected-skill-name" : "skill-name",
    skill.name
  );
  nameGroup.appendChild(name);

  const level = createDiv("skill-level");
  const rating = createDiv("skill-rating");

  for (let i = 1; i <= 5; i++) {
    const dot = createDiv("skill-dot");
    if (i <= skill.level) dot.classList.add("filled");
    rating.appendChild(dot);
  }

  level.appendChild(rating);
  header.appendChild(nameGroup);
  header.appendChild(level);
  return header;
}

function createSkillDetails(skill, showAll = true) {
  const details = createDiv(
    showAll ? "skill-details" : "unselected-skill-details"
  );

  // Get all available categories from the skill object dynamically
  const allCategories = Object.keys(skill)
    .filter((key) => Array.isArray(skill[key]) && skill[key].length > 0)
    .map((key) => ({
      key,
      label: key.toUpperCase().replace(/_/g, " "),
    }));

  // Show all categories or just the first two
  const categoriesToShow = showAll ? allCategories : allCategories.slice(0, 2);

  categoriesToShow.forEach(({ key, label }) => {
    const subcategory = createDiv("skill-subcategory");
    subcategory.appendChild(
      createElement("span", {
        className: "skill-content",
        textContent: skill[key].join(", "),
      })
    );
    subcategory.appendChild(
      createElement("span", {
        className: "skill-label",
        textContent: label,
      })
    );
    details.appendChild(subcategory);
  });

  return details;
}

function renderProjects(container, versionConfig) {
  const section = createSection("projects", "Projects", "fas fa-star");
  const projectsLimit = versionConfig.content_config?.projects_limit || 5;
  const projectOverrides =
    versionConfig.content_overrides?.project_descriptions;

  resumeData.projects.slice(0, projectsLimit).forEach((project) => {
    const projectItem = createDiv("project-item");
    const mainContent = createDiv("project-main-content");

    // Left column
    const leftColumn = createDiv("project-left");
    leftColumn.appendChild(createDiv("project-title", project.title));

    const description = projectOverrides?.[project.id] || project.description;
    if (description) {
      leftColumn.appendChild(createDiv("project-description", description));
    }

    if (project.features?.length) {
      const ul = createElement("ul", { className: "project-features" });
      project.features.forEach((feature) => {
        ul.appendChild(createElement("li", { textContent: feature }));
      });
      leftColumn.appendChild(ul);
    }

    // Right column
    const rightColumn = createDiv("project-right");
    if (project.tech_stack) {
      rightColumn.appendChild(createDiv("tech-stack", project.tech_stack));
    }

    mainContent.appendChild(leftColumn);
    mainContent.appendChild(rightColumn);
    projectItem.appendChild(mainContent);

    // Case studies
    if (project.items?.length) {
      const caseStudiesDiv = createDiv("project-case");
      project.items.forEach((caseStudy) => {
        const caseItem = createDiv("case-item");
        caseItem.appendChild(
          createElement("h4", { textContent: caseStudy.title })
        );

        const ul = createElement("ul");
        caseStudy.details.forEach((detail) => {
          ul.appendChild(createElement("li", { textContent: detail }));
        });
        caseItem.appendChild(ul);
        caseStudiesDiv.appendChild(caseItem);
      });
      projectItem.appendChild(caseStudiesDiv);
    }

    section.appendChild(projectItem);
  });

  container.appendChild(section);
}

function renderPublications(publications, container) {
  const section = createSection("publications", "Publications", "fas fa-book");

  const sorted = [...publications].sort((a, b) => {
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;
    if (a.type === "Paper" && b.type === "Poster") return -1;
    if (a.type === "Poster" && b.type === "Paper") return 1;
    return 0;
  });

  sorted.forEach((pub) => {
    const pubItem = createDiv("publication-item");

    const leftColumn = createDiv("publication-left");
    leftColumn.appendChild(createDiv("publication-title", pub.title));
    leftColumn.appendChild(createDiv("publication-authors", pub.authors));

    const rightColumn = createDiv("publication-right");
    rightColumn.appendChild(
      createDiv("publication-venue", `${pub.venue} (${pub.type})`)
    );
    rightColumn.appendChild(createDiv("publication-time", pub.year));

    pubItem.appendChild(leftColumn);
    pubItem.appendChild(rightColumn);
    section.appendChild(pubItem);
  });

  container.appendChild(section);
}

function renderWorkExperience(workExperience, container) {
  const section = createSection("work-experience", "Work", "fas fa-briefcase");

  workExperience.forEach((job) => {
    const jobItem = createDiv("work-experience-item");

    const leftColumn = createDiv("work-left");
    leftColumn.appendChild(createDiv("job-title", job.title));

    if (job.responsibilities?.length) {
      const ul = createElement("ul", { className: "job-responsibilities" });
      job.responsibilities.forEach((resp) => {
        ul.appendChild(createElement("li", { textContent: resp }));
      });
      leftColumn.appendChild(ul);
    }

    if (job.achievements?.length) {
      const achievementsDiv = createDiv("job-achievements");
      achievementsDiv.appendChild(
        createDiv("achievements-title", "Key Achievements:")
      );

      const ul = createElement("ul", { className: "achievements-list" });
      job.achievements.forEach((achievement) => {
        ul.appendChild(createElement("li", { textContent: achievement }));
      });
      achievementsDiv.appendChild(ul);
      leftColumn.appendChild(achievementsDiv);
    }

    const rightColumn = createDiv("work-right");
    rightColumn.appendChild(
      createDiv("company-location", `${job.company}, ${job.location}`)
    );
    rightColumn.appendChild(
      createDiv(
        "period-type",
        `${job.period}${job.type ? ` • ${job.type}` : ""}`
      )
    );

    jobItem.appendChild(leftColumn);
    jobItem.appendChild(rightColumn);
    section.appendChild(jobItem);
  });

  container.appendChild(section);
}

function renderPhDResearch(research, container) {
  const section = createSection(
    "phd-research",
    "Research",
    "fas fa-microscope"
  );

  research.sections.forEach((researchSection) => {
    const h3 = createElement("h3", { textContent: researchSection.title });
    section.appendChild(h3);

    const ul = createElement("ul");
    researchSection.items.forEach((item) => {
      const li = createElement("li", { textContent: item.point });
      if (item.detail) {
        const detail = createElement("p", {
          className: "research-item-detail",
          textContent: item.detail,
        });
        li.appendChild(detail);
      }
      ul.appendChild(li);
    });
    section.appendChild(ul);
  });

  container.appendChild(section);
}

function renderCertifications(certifications, container) {
  const section = createSection(
    "certifications",
    "Certifications",
    "fas fa-certificate"
  );
  const ul = createElement("ul");
  certifications.forEach((cert) => {
    ul.appendChild(createElement("li", { textContent: cert }));
  });
  section.appendChild(ul);
  container.appendChild(section);
}

// =============================================================================
// APPLICATION INITIALIZATION
// =============================================================================

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const dataLoaded = await loadData();
    if (!dataLoaded || !validateData()) return;

    generateThemeCSS();
    initVersionSwitcher();
    applyTheme(currentVersion);
    renderResume();

    // Initialize pagination and mark as loaded
    setTimeout(() => {
      autoPaginate();
      setTimeout(() => {
        document.body.classList.remove("loading");
        document.body.classList.add("loaded");
      }, 50);
    }, 100);
  } catch (error) {
    console.error("Application initialization failed:", error);
    showError("Failed to initialize application. Please refresh the page.");
  }
});

// Window resize handler for pagination
window.addEventListener(
  "resize",
  debounce(() => {
    document.body.style.opacity = "0.7";
    autoPaginate();
    setTimeout(() => (document.body.style.opacity = "1"), 100);
  }, 300)
);
