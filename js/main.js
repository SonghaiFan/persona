// Main JavaScript file for resume rendering
let resumeData = null;
let versionsData = null;
let currentVersion = "data-viz";

// ==========================================================================
// HELPER FUNCTIONS FOR DOM ELEMENT CREATION
// ==========================================================================

/**
 * Creates a div element with specified class name
 * @param {string} className - CSS class name
 * @returns {HTMLElement} - Created div element
 */
function createDiv(className) {
  const div = document.createElement("div");
  if (className) {
    div.className = className;
  }
  return div;
}

/**
 * Creates a span element with specified class name and text content
 * @param {string} className - CSS class name
 * @param {string} text - Text content
 * @returns {HTMLElement} - Created span element
 */
function createSpan(className, text) {
  const span = document.createElement("span");
  if (className) {
    span.className = className;
  }
  if (text) {
    span.textContent = text;
  }
  return span;
}

/**
 * Creates a list item with specified text content
 * @param {string} text - Text content
 * @returns {HTMLElement} - Created li element
 */
function createListItem(text) {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

/**
 * Creates a list with specified items
 * @param {string[]} items - Array of text items
 * @param {string} className - Optional CSS class name
 * @returns {HTMLElement} - Created ul element
 */
function createList(items, className = "") {
  const ul = document.createElement("ul");
  if (className) {
    ul.className = className;
  }
  items.forEach((item) => {
    ul.appendChild(createListItem(item));
  });
  return ul;
}

// ==========================================================================
// MAIN APPLICATION CODE
// ==========================================================================

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
          profileData.skills_pool &&
          Object.keys(profileData.skills_pool).length > 0
        ) {
          renderTechnicalSkills(
            profileData.skills_pool,
            profileData.skill_categories,
            page,
            contentConfig.selected_skills
          );
        }
        break;
      case "work_experience":
        if (
          profileData.work_experience &&
          profileData.work_experience.length > 0
        ) {
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
          const projectOverrides =
            versionConfig.content_overrides?.project_descriptions;
          renderProjects(projectsToRender, page, projectOverrides);
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
    "Summary",
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
    const eduItem = createDiv("education-item");

    // Left column
    const leftColumn = createDiv("education-left");
    const title = createDiv("education-title");
    title.textContent = edu.degree;
    leftColumn.appendChild(title);

    // Right column
    const rightColumn = createDiv("education-right");
    const institution = createDiv("institution");
    institution.textContent = edu.institution;
    rightColumn.appendChild(institution);

    const period = createDiv("education-period");
    period.textContent = edu.period;
    rightColumn.appendChild(period);

    // Add additional content to left column
    if (edu.research) {
      const research = createDiv();
      research.textContent = edu.research;
      leftColumn.appendChild(research);
    }

    if (edu.gpa) {
      const gpa = createDiv();
      gpa.textContent = edu.gpa;
      leftColumn.appendChild(gpa);
    }

    if (edu.highlights && edu.highlights.length > 0) {
      const ul = createList(edu.highlights);
      leftColumn.appendChild(ul);
    }

    eduItem.appendChild(leftColumn);
    eduItem.appendChild(rightColumn);

    section.appendChild(eduItem);
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
    const h3 = document.createElement("h3");
    h3.textContent = researchSection.title;
    section.appendChild(h3);

    const ul = document.createElement("ul");
    researchSection.items.forEach((item) => {
      const li = createListItem(item.point);

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

function renderTechnicalSkills(
  skillsPool,
  skillCategories,
  container,
  selectedSkillIds = []
) {
  const section = createSection("technical-skills", "Skills", "fas fa-cubes");

  // Group ALL skills by category, mark which are selected
  const skillsByCategory = {};

  Object.entries(skillsPool).forEach(([skillId, skill]) => {
    const categoryId = skill.category;
    if (!skillsByCategory[categoryId]) {
      skillsByCategory[categoryId] = [];
    }
    skillsByCategory[categoryId].push({
      ...skill,
      id: skillId,
      isSelected: selectedSkillIds.includes(skillId),
    });
  });

  // Sort skills within each category: selected first, then by level (highest first)
  Object.keys(skillsByCategory).forEach((categoryId) => {
    skillsByCategory[categoryId].sort((a, b) => {
      // First sort by selection status (selected skills first)
      if (a.isSelected && !b.isSelected) return -1;
      if (!a.isSelected && b.isSelected) return 1;
      // Then sort by level (highest first)
      return b.level - a.level;
    });
  });

  const skillsGrid = document.createElement("div");
  skillsGrid.className = "skills-grid";

  // Sort categories by number of selected skills (most selected first)
  const sortedCategories = Object.entries(skillsByCategory).sort(
    ([, skillsA], [, skillsB]) => {
      const selectedCountA = skillsA.filter((skill) => skill.isSelected).length;
      const selectedCountB = skillsB.filter((skill) => skill.isSelected).length;
      return selectedCountB - selectedCountA;
    }
  );

  // Separate selected and unselected skills
  const selectedSkills = [];
  const unselectedSkills = [];

  Object.entries(skillsByCategory).forEach(([categoryId, skills]) => {
    skills.forEach((skill) => {
      if (skill.isSelected) {
        selectedSkills.push(skill);
      } else {
        unselectedSkills.push(skill);
      }
    });
  });

  // Sort selected skills by level (highest first)
  selectedSkills.sort((a, b) => b.level - a.level);

  // Sort unselected skills by level (highest first)
  unselectedSkills.sort((a, b) => b.level - a.level);

  // Render selected skills in the first 3 grid positions
  selectedSkills.forEach((skill) => {
    const skillItem = document.createElement("div");
    skillItem.className = "skill-item skill-selected";

    const skillHeader = document.createElement("div");
    skillHeader.className = "skill-header";

    const skillNameGroup = document.createElement("div");
    skillNameGroup.className = "skill-name-group";

    const skillName = document.createElement("div");
    skillName.className = "skill-name";

    const skillNameText = document.createElement("span");
    skillNameText.className = "skill-name-text";
    skillNameText.textContent = skill.name || "";

    skillName.appendChild(skillNameText);
    skillNameGroup.appendChild(skillName);

    const skillLevel = document.createElement("div");
    skillLevel.className = "skill-level";

    const skillRating = document.createElement("div");
    skillRating.className = "skill-rating";

    // Create 5 dots for Material Design rating
    for (let i = 1; i <= 5; i++) {
      const dot = document.createElement("div");
      dot.className = "skill-dot";
      if (i <= (skill.level || 0)) {
        dot.classList.add("filled");
      }
      skillRating.appendChild(dot);
    }

    skillLevel.appendChild(skillRating);
    skillHeader.appendChild(skillNameGroup);
    skillHeader.appendChild(skillLevel);
    skillItem.appendChild(skillHeader);

    // Show all 4 subcategories for selected skills
    const skillDetails = document.createElement("div");
    skillDetails.className = "skill-details";

    // Tech Stack
    if (skill.tech_stack && skill.tech_stack.length > 0) {
      const techStackDiv = document.createElement("div");
      techStackDiv.className = "skill-subcategory";
      const techStackContent = document.createElement("span");
      techStackContent.className = "skill-content";
      techStackContent.textContent = skill.tech_stack.join(", ");
      techStackDiv.appendChild(techStackContent);
      const techStackLabel = document.createElement("span");
      techStackLabel.className = "skill-label";
      techStackLabel.textContent = "TECH STACK";
      techStackDiv.appendChild(techStackLabel);
      skillDetails.appendChild(techStackDiv);
    }

    // Core Skills
    if (skill.core_skill && skill.core_skill.length > 0) {
      const coreSkillDiv = document.createElement("div");
      coreSkillDiv.className = "skill-subcategory";
      const coreSkillContent = document.createElement("span");
      coreSkillContent.className = "skill-content";
      coreSkillContent.textContent = skill.core_skill.join(", ");
      coreSkillDiv.appendChild(coreSkillContent);
      const coreSkillLabel = document.createElement("span");
      coreSkillLabel.className = "skill-label";
      coreSkillLabel.textContent = "CORE SKILLS";
      coreSkillDiv.appendChild(coreSkillLabel);
      skillDetails.appendChild(coreSkillDiv);
    }

    // Methodology
    if (skill.methodology && skill.methodology.length > 0) {
      const methodologyDiv = document.createElement("div");
      methodologyDiv.className = "skill-subcategory";
      const methodologyContent = document.createElement("span");
      methodologyContent.className = "skill-content";
      methodologyContent.textContent = skill.methodology.join(", ");
      methodologyDiv.appendChild(methodologyContent);
      const methodologyLabel = document.createElement("span");
      methodologyLabel.className = "skill-label";
      methodologyLabel.textContent = "METHODOLOGY";
      methodologyDiv.appendChild(methodologyLabel);
      skillDetails.appendChild(methodologyDiv);
    }

    // Use Scenarios
    if (skill.use_scenario && skill.use_scenario.length > 0) {
      const useScenarioDiv = document.createElement("div");
      useScenarioDiv.className = "skill-subcategory";
      const useScenarioContent = document.createElement("span");
      useScenarioContent.className = "skill-content";
      useScenarioContent.textContent = skill.use_scenario.join(", ");
      useScenarioDiv.appendChild(useScenarioContent);
      const useScenarioLabel = document.createElement("span");
      useScenarioLabel.className = "skill-label";
      useScenarioLabel.textContent = "USE SCENARIOS";
      useScenarioDiv.appendChild(useScenarioLabel);
      skillDetails.appendChild(useScenarioDiv);
    }

    skillItem.appendChild(skillDetails);
    skillsGrid.appendChild(skillItem);
  });

  // Create a combined cell for unselected skills in the bottom-right position
  if (unselectedSkills.length > 0) {
    const unselectedContainer = document.createElement("div");
    unselectedContainer.className = "skill-item skill-unselected-container";
    unselectedContainer.style.gridColumn = "2";
    unselectedContainer.style.gridRow = "2";

    const unselectedList = document.createElement("div");
    unselectedList.className = "unselected-skills-list";

    unselectedSkills.forEach((skill) => {
      const unselectedSkill = document.createElement("div");
      unselectedSkill.className = "unselected-skill-item";

      const skillHeader = document.createElement("div");
      skillHeader.className = "unselected-skill-header";

      const skillName = document.createElement("span");
      skillName.className = "unselected-skill-name";
      skillName.textContent = skill.name || "";

      const skillLevel = document.createElement("div");
      skillLevel.className = "skill-level";

      const skillRating = document.createElement("div");
      skillRating.className = "skill-rating";

      // Create 5 dots for Material Design rating
      for (let i = 1; i <= 5; i++) {
        const dot = document.createElement("div");
        dot.className = "skill-dot";
        if (i <= (skill.level || 0)) {
          dot.classList.add("filled");
        }
        skillRating.appendChild(dot);
      }

      skillLevel.appendChild(skillRating);
      skillHeader.appendChild(skillName);
      skillHeader.appendChild(skillLevel);
      unselectedSkill.appendChild(skillHeader);

      // Show only Tech Stack and Core Skills for unselected skills
      const skillDetails = document.createElement("div");
      skillDetails.className = "unselected-skill-details";

      // Tech Stack
      if (skill.tech_stack && skill.tech_stack.length > 0) {
        const techStackDiv = document.createElement("div");
        techStackDiv.className = "skill-subcategory";
        const techStackContent = document.createElement("span");
        techStackContent.className = "skill-content";
        techStackContent.textContent = skill.tech_stack.join(", ");
        techStackDiv.appendChild(techStackContent);
        const techStackLabel = document.createElement("span");
        techStackLabel.className = "skill-label";
        techStackLabel.textContent = "TECH STACK";
        techStackDiv.appendChild(techStackLabel);
        skillDetails.appendChild(techStackDiv);
      }

      // Core Skills
      if (skill.core_skill && skill.core_skill.length > 0) {
        const coreSkillDiv = document.createElement("div");
        coreSkillDiv.className = "skill-subcategory";
        const coreSkillContent = document.createElement("span");
        coreSkillContent.className = "skill-content";
        coreSkillContent.textContent = skill.core_skill.join(", ");
        coreSkillDiv.appendChild(coreSkillContent);
        const coreSkillLabel = document.createElement("span");
        coreSkillLabel.className = "skill-label";
        coreSkillLabel.textContent = "CORE SKILLS";
        coreSkillDiv.appendChild(coreSkillLabel);
        skillDetails.appendChild(coreSkillDiv);
      }

      unselectedSkill.appendChild(skillDetails);
      unselectedList.appendChild(unselectedSkill);
    });

    unselectedContainer.appendChild(unselectedList);
    skillsGrid.appendChild(unselectedContainer);
  }

  section.appendChild(skillsGrid);
  container.appendChild(section);
}

function renderProjects(projects, container, projectFocus = null) {
  const section = createSection("projects", "Projects", "fas fa-star");

  projects.forEach((project) => {
    const projectItem = createDiv("project-item");

    // Main content area with two columns
    const mainContent = createDiv("project-main-content");

    // Left column
    const leftColumn = createDiv("project-left");
    const title = createDiv("project-title");
    title.textContent = project.title;
    leftColumn.appendChild(title);

    // Use version-specific project focus if available, otherwise use original description
    const descriptionText =
      projectFocus && projectFocus[project.id]
        ? projectFocus[project.id]
        : project.description;

    if (descriptionText) {
      const description = createDiv("project-description");
      description.textContent = descriptionText;
      leftColumn.appendChild(description);
    }

    if (project.features && project.features.length > 0) {
      const featuresUl = createList(project.features, "project-features");
      leftColumn.appendChild(featuresUl);
    }

    // Right column
    const rightColumn = createDiv("project-right");

    if (project.tech_stack) {
      const techStack = createDiv("tech-stack");
      techStack.textContent = project.tech_stack;
      rightColumn.appendChild(techStack);
    }

    // Add columns to main content
    mainContent.appendChild(leftColumn);
    mainContent.appendChild(rightColumn);
    projectItem.appendChild(mainContent);

    // Case studies span full width below the two-column layout
    if (project.items && project.items.length > 0) {
      const caseStudiesDiv = createDiv("project-case");

      project.items.forEach((caseStudy) => {
        const caseStudyItem = createDiv("case-item");

        const caseTitle = document.createElement("h4");
        caseTitle.textContent = caseStudy.title;
        caseStudyItem.appendChild(caseTitle);

        const caseUl = createList(caseStudy.details);
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
    const pubItem = createDiv("publication-item");

    // Left column
    const leftColumn = createDiv("publication-left");
    const title = createDiv("publication-title");
    title.textContent = pub.title;
    leftColumn.appendChild(title);

    const authors = createDiv("publication-authors");
    authors.textContent = pub.authors;
    leftColumn.appendChild(authors);

    // Right column
    const rightColumn = createDiv("publication-right");
    const venue = createDiv("publication-venue");
    venue.textContent = `${pub.venue} (${pub.type})`;
    rightColumn.appendChild(venue);

    const typeSpan = createDiv("publication-time");
    typeSpan.textContent = pub.year;
    rightColumn.appendChild(typeSpan);

    pubItem.appendChild(leftColumn);
    pubItem.appendChild(rightColumn);
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
  const ul = createList(certifications);

  section.appendChild(ul);
  container.appendChild(section);
}

function renderWorkExperience(workExperience, container) {
  const section = createSection("work-experience", "Work", "fas fa-briefcase");

  workExperience.forEach((job) => {
    const jobItem = createDiv("work-experience-item");

    // Left column
    const leftColumn = createDiv("work-left");
    const jobTitle = createDiv("job-title");
    jobTitle.textContent = job.title;
    leftColumn.appendChild(jobTitle);

    // Right column
    const rightColumn = createDiv("work-right");
    const companyLocation = createDiv("company-location");
    companyLocation.textContent = `${job.company}, ${job.location}`;
    rightColumn.appendChild(companyLocation);

    const periodType = createDiv("period-type");
    periodType.textContent = `${job.period}${job.type ? ` • ${job.type}` : ""}`;
    rightColumn.appendChild(periodType);

    // Add responsibilities and achievements to left column
    if (job.responsibilities && job.responsibilities.length > 0) {
      const responsibilitiesUl = createList(
        job.responsibilities,
        "job-responsibilities"
      );
      leftColumn.appendChild(responsibilitiesUl);
    }

    if (job.achievements && job.achievements.length > 0) {
      const achievementsDiv = createDiv("job-achievements");
      const achievementsTitle = createDiv("achievements-title");
      achievementsTitle.textContent = "Key Achievements:";
      achievementsDiv.appendChild(achievementsTitle);

      const achievementsUl = createList(job.achievements, "achievements-list");
      achievementsDiv.appendChild(achievementsUl);
      leftColumn.appendChild(achievementsDiv);
    }

    jobItem.appendChild(leftColumn);
    jobItem.appendChild(rightColumn);

    section.appendChild(jobItem);
  });

  container.appendChild(section);
}
