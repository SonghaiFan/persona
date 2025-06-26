// Main JavaScript file for resume interactivity
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const response = await fetch("data/data.json");
    const data = await response.json();
    renderResume(data);
  } catch (error) {
    console.error("Error loading resume data:", error);
  }
});

function renderResume(data) {
  // Render each section only if data exists
  if (data.summary) {
    renderSummary(data.summary);
  }

  if (data.education && data.education.length > 0) {
    renderEducation(data.education);
  }

  if (data.phd_research && data.phd_research.sections.length > 0) {
    renderPhDResearch(data.phd_research);
  }

  if (data.technical_skills && Object.keys(data.technical_skills).length > 0) {
    renderTechnicalSkills(data.technical_skills);
  }

  if (data.publications && data.publications.length > 0) {
    renderPublications(data.publications);
  }

  if (data.projects && data.projects.length > 0) {
    renderProjects(data.projects);
  }

  if (data.certifications && data.certifications.length > 0) {
    renderCertifications(data.certifications);
  }
}

function showSection(id) {
  const section = document.querySelector(`#${id}`);
  if (section) {
    section.style.display = "block";
  }
}

function renderSummary(summary) {
  const summarySection = document.querySelector("#professional-summary");
  if (!summarySection) return;

  showSection("professional-summary");
  const summaryP = summarySection.querySelector("p");
  if (summaryP) {
    summaryP.textContent = summary;
  }
}

function renderEducation(education) {
  const educationSection = document.querySelector("#education");
  if (!educationSection) return;

  showSection("education");
  educationSection.innerHTML += education
    .map(
      (edu) => `
    <div class="education-item">
      <div class="education-title">${edu.degree}</div>
      <div class="institution">
        ${edu.institution} (${edu.period})
      </div>
      ${edu.research ? `<div>${edu.research}</div>` : ""}
      ${edu.gpa ? `<div>${edu.gpa}</div>` : ""}
      ${
        edu.highlights
          ? `
        <ul>
          ${edu.highlights
            .map(
              (highlight) => `
            <li>${highlight}</li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

function renderPhDResearch(research) {
  const researchSection = document.querySelector("#phd-research");
  if (!researchSection) return;

  showSection("phd-research");
  researchSection.innerHTML += research.sections
    .map(
      (section) => `
    <h3>${section.title}</h3>
    <ul>
      ${section.items
        .map(
          (item) => `
        <li>
          ${item.point}
          ${
            item.detail
              ? `<p class="research-item-detail">${item.detail}</p>`
              : ""
          }
        </li>
      `
        )
        .join("")}
    </ul>
  `
    )
    .join("");
}

function renderTechnicalSkills(skills) {
  const skillsSection = document.querySelector("#technical-skills");
  if (!skillsSection) return;

  showSection("technical-skills");

  // Dynamically get all categories in the order they appear in the data
  const sortedCategories = Object.entries(skills).filter(
    ([_, value]) => value && value.items && value.items.length > 0
  );

  const skillsGrid = document.createElement("div");
  skillsGrid.className = "skills-grid";

  skillsGrid.innerHTML = sortedCategories
    .map(
      ([key, category]) => `
      <div class="skill-category">
        <div class="skill-title">${category.title}</div>
        <div class="skill-items">
          ${category.items
            .sort((a, b) => b.level - a.level)
            .map(
              (item) => `
                <div class="skill-item">
                  <div class="skill-name-group">
                    <div class="skill-name">
                      <span class="skill-name-text">${item.name || ""}</span>
                      <span class="skill-keywords">${(item.keywords || []).join(
                        ", "
                      )}</span>
                    </div>
                  </div>
                  <div class="skill-level">
                    <span class="star-rating">${"★".repeat(
                      item.level || 0
                    )}${"☆".repeat(5 - (item.level || 0))}</span>
                  </div>
                </div>
              `
            )
            .join("")}
        </div>
      </div>
    `
    )
    .join("");

  // Clear existing content and append the new grid
  while (skillsSection.children.length > 1) {
    skillsSection.removeChild(skillsSection.lastChild);
  }
  skillsSection.appendChild(skillsGrid);
}

function renderProjects(projects) {
  const projectsSection = document.querySelector("#projects");
  if (!projectsSection) return;

  showSection("projects");
  projectsSection.innerHTML += projects
    .map(
      (project) => `
    <div class="project-item">
      <h3>${project.title}</h3>
      ${
        project.description
          ? `<p class="project-description">${project.description}</p>`
          : ""
      }
      ${
        project.features && project.features.length > 0
          ? `
        <ul class="project-features">
          ${project.features
            .map(
              (feature) => `
            <li>${feature}</li>
          `
            )
            .join("")}
        </ul>
      `
          : ""
      }
      ${
        project.tech_stack
          ? `<p class="project-tech-stack">${project.tech_stack}</p>`
          : ""
      }
      ${
        project.case_studies && project.case_studies.length > 0
          ? `
        <div class="project-case-studies">
          ${project.case_studies
            .map(
              (caseStudy) => `
                <div class="case-study-item">
                  <h4>${caseStudy.title}</h4>
                  <ul>
                    ${caseStudy.details
                      .map(
                        (detail) => `
                          <li>${detail}</li>
                        `
                      )
                      .join("")}
                  </ul>
                </div>
              `
            )
            .join("")}
        </div>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

function renderCertifications(certifications) {
  const certificationsSection = document.querySelector("#certifications");
  if (!certificationsSection) return;

  showSection("certifications");
  const ul = certificationsSection.querySelector("ul");
  if (ul) {
    ul.innerHTML = certifications
      .map(
        (cert) => `
      <li>${cert}</li>
    `
      )
      .join("");
  }
}

function renderLanguages(languages) {
  const languagesSection = document.querySelector("#languages");
  if (!languagesSection) return;

  showSection("languages");
  const ul = languagesSection.querySelector("ul");
  if (ul) {
    ul.innerHTML = languages
      .map(
        (lang) => `
          <li>${lang.language}: <span class="highlight">${lang.proficiency}</span></li>
        `
      )
      .join("");
  }
}

function renderInterests(interests) {
  const interestsSection = document.querySelector("#interests");
  if (!interestsSection) return;

  showSection("interests");
  const ul = interestsSection.querySelector("ul");
  if (ul) {
    ul.innerHTML = interests
      .map(
        (interest) => `
          <li>${interest}</li>
        `
      )
      .join("");
  }
}

function renderPublications(publications) {
  const publicationsSection = document.querySelector("#publications");
  if (!publicationsSection) return;

  showSection("publications");

  const sortedPublications = [...publications].sort((a, b) => {
    // First sort by year
    const yearDiff = b.year - a.year;
    if (yearDiff !== 0) return yearDiff;

    // Then sort by type (Papers before Posters)
    if (a.type === "Paper" && b.type === "Poster") return -1;
    if (a.type === "Poster" && b.type === "Paper") return 1;
    return 0;
  });

  publicationsSection.innerHTML += sortedPublications
    .map(
      (pub) => `
        <div class="publication-item">
          <div class="publication-title">${pub.title}</div>
          <div class="publication-meta">
            <div class="publication-authors">${pub.authors}</div>
            <div class="publication-venue">
              <span>${pub.venue} (${pub.year})</span>
              <span class="publication-type">${pub.type}</span>
            </div>
          </div>
        </div>
      `
    )
    .join("");
}
