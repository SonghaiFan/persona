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
      ${section.highlights
        .map(
          (highlight) => `
        <li>${highlight}</li>
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

  // Sort categories by importance
  const categoryOrder = [
    "programming_languages",
    "web_technologies",
    "visualization",
    "ai_ml",
    "developer_tools",
    "research_skills",
  ];

  const sortedCategories = categoryOrder
    .map((key) => [key, skills[key]])
    .filter(([_, value]) => value);

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
                      <span class="skill-name-text">${item.name}</span>
                      <span class="skill-keywords">${item.keywords
                        .slice(0, 2)
                        .join(", ")}${
                item.keywords.length > 2 ? "..." : ""
              }</span>
                    </div>
                  </div>
                  <div class="skill-level">
                    ${Array.from(
                      { length: 5 },
                      (_, i) => `
                      <div class="skill-circle${
                        i < item.level ? " filled" : ""
                      }"></div>
                    `
                    ).join("")}
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
      <ul>
        ${project.highlights
          .map(
            (highlight) => `
          <li>${highlight}</li>
        `
          )
          .join("")}
      </ul>
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
