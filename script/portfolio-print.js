// The standalone page uses the source file; FAQ previews also receive live
// snapshots from their opener. Render text through DOM APIs, never HTML strings.
function renderPortfolioDocument(content) {
  // Edit only known wording. Newly edited source text passes through unchanged
  // so the live PDF never masks later updates from the admin.
  const polishedCopy = new Map([
    ["Front End Web Developer", "Front-End Developer"],
    ["I am a front-end developer learning and building my skills in JavaScript and Angular. Most of my experience comes from self-study, school projects, and personal side-projects, where I’ve practiced creating real applications and experimenting with new ideas.", "Front-end developer building interactive web applications with JavaScript, Angular, and React. My experience comes from self-directed learning, coursework, and personal projects, with a focus on responsive interfaces, animation, and practical application development."],
    ["I am eager to learn and grow, and I believe I can bring value through my curiosity, persistence, and willingness to take on challenges. I’m looking for opportunities to contribute, improve my skills, and grow alongside a supportive team.", "I’m seeking an opportunity to contribute to a collaborative team, strengthen my development skills, and help turn ideas into thoughtful, usable web experiences."],
    ["My favourite current project: a visual CSS animation library for creating, previewing, organizing, copying, and exporting reusable animations.", "A visual library for creating and previewing CSS animations. Organize reusable animations, copy their code, and export them for use in other projects."],
    ["This is an idle game built with Angular, designed to showcase game mechanics, world progression, and UI interactions in a web app environment. Unlike a traditional clicker, this game runs in the background, giving players resources and progress even while they’re idle.", "An Angular idle game combining background resource generation, world progression, and interactive game interfaces. Players continue to accumulate resources and progress while idle."],
    ["A full Angular project for ordering Thai food online. Uses real APIs for products, cart, and checkout functionality.", "An Angular food-ordering application connected to real APIs, covering product browsing, cart management, and checkout."],
    ["Idle Game Loading Screens (Angular)", "Idle Loader — Angular Idle Game"],
    ["Thai Food Ordering (Angular + APIs)", "Thai Food Ordering — Angular & APIs"],
    ["Angular E-shop", "Angular E-shop — E-commerce Application"],
    ["First Angular e-commerce project.", "An e-commerce application built with Angular, developed as a practical project to build experience with the framework."],
    ["Drop-out after 1 year", "One year of study; degree not completed."],
    ["View my certificates (PDF)", "View certificates ↗"],
  ]);
  const polish = text => polishedCopy.get(text) || text;
  const profile = content.profile;
  const root = document.getElementById("portfolio-document");
  root.replaceChildren();
  document.title = `${profile.name} — Portfolio PDF`;
  const livePortfolio = "https://gxella.github.io/Portfolio/";
  const element = (tag, text, parent = root, className = "") => {
    const node = document.createElement(tag);
    node.textContent = polish(text);
    node.className = className;
    parent.append(node);
    return node;
  };
  const link = (label, url, parent) => {
    if (!url) return;
    let resolved;
    try { resolved = new URL(url, livePortfolio); } catch { return; }
    if (!["https:", "mailto:", "tel:"].includes(resolved.protocol)) return;
    const node = element("a", label, parent);
    node.href = resolved.href;
    node.target = "_blank";
    node.rel = "noopener noreferrer";
  };
  const header = element("header", "", root, "document-header");
  const masthead = element("div", "", header, "masthead");
  element("span", "Portfolio / Development", masthead, "eyebrow");
  element("span", "GK /", masthead, "monogram").setAttribute("aria-hidden", "true");
  element("h1", profile.name, header);
  const headerBottom = element("div", "", header, "header-bottom");
  element("p", profile.role, headerBottom, "role");
  element("span", profile.contact.location, headerBottom, "location");

  const layout = element("div", "", root, "document-layout");
  const sidebar = element("aside", "", layout, "document-sidebar");
  const section = (title, parent, className = "") => {
    const node = element("section", "", parent, className);
    element("h2", title, node);
    return node;
  };
  const contacts = section("Contact", sidebar, "contact");
  link(profile.contact.email, `mailto:${profile.contact.email}`, contacts);
  link(profile.contact.phone, `tel:${profile.contact.phone.replace(/\s/g, "")}`, contacts);
  const social = element("div", "", contacts, "social-links");
  link("GitHub ↗", profile.contact.github, social);
  link("LinkedIn ↗", profile.contact.linkedin, social);
  link("Online portfolio ↗", livePortfolio, contacts);

  const skillsSection = section("Toolkit", sidebar);
  const skills = new Set(profile.skills || ["HTML", "CSS / SCSS", "JavaScript", "Angular", "React", "Tailwind CSS", "Responsive interfaces", "CSS animation"]);
  content.experience.forEach(entry => (entry.technologies || []).forEach(skill => skills.add(skill)));
  const skillList = element("ul", "", skillsSection, "skills");
  skills.forEach(skill => element("li", skill, skillList));

  const education = section(profile.educationHeading, sidebar, "education");
  profile.education.forEach(entry => {
    const article = element("article", "", education);
    element("p", entry.period, article, "meta");
    element("h3", entry.degree, article);
    element("p", entry.institution, article);
    if (entry.note) element("p", entry.note, article, "meta");
  });
  const certification = section(profile.certification.heading, sidebar);
  link(profile.certification.label, profile.certification.url, certification);

  const body = element("div", "", layout, "document-body");
  const about = section("01 / Profile", body, "profile");
  profile.intro.forEach(text => element("p", text, about));
  if (content.experience.length) {
    const experience = section("02 / Experience", body, "experience");
    content.experience.forEach(entry => {
      const article = element("article", "", experience);
      element("h3", `${entry.role} — ${entry.company}`, article);
      element("p", [entry.dates, entry.employmentType, entry.location].filter(Boolean).join(" · "), article, "meta");
      element("p", entry.description, article);
      if (entry.responsibilities?.length) {
        const list = element("ul", "", article);
        entry.responsibilities.forEach(text => element("li", text, list));
      }
      if (entry.technologies?.length) element("p", entry.technologies.join(" · "), article, "meta");
    });
  }
  const projects = section(`${content.experience.length ? "03" : "02"} / Selected work`, body, "projects");
  // Favorites are the owner's selection signal. Fill remaining places with
  // the strongest current projects, and never show more than three.
  const preferred = ["p13", "p12", "p8"];
  const rank = project => preferred.includes(project.id) ? preferred.indexOf(project.id) : preferred.length;
  const selected = [...content.projects].sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)) || rank(a) - rank(b)).slice(0, 3);
  selected.forEach((project, index) => {
    const article = element("article", "", projects);
    const metadata = element("div", "", article, "project-meta");
    element("span", `P / ${String(index + 1).padStart(2, "0")}`, metadata, "project-number");
    element("span", project.date, metadata, "meta");
    element("h3", project.title, article);
    element("p", project.description, article);
    const links = element("div", "", article, "project-links");
    if (project.liveUrl) link("View live project", project.liveUrl, links);
    if (project.repoUrl) link("Source on GitHub", project.repoUrl, links);
  });
  const footer = element("footer", "", root, "document-footer");
  link("More work & experiments ↗", livePortfolio, footer);
  element("span", `Updated / ${new Date().toISOString().slice(0, 10)}`, footer);
  document.documentElement.dataset.ready = "true";
}

(() => {
  renderPortfolioDocument(window.PORTFOLIO_CONTENT);
  const targetOrigin = location.origin === "null" ? "*" : location.origin;
  window.addEventListener("message", event => {
    if (!window.opener || event.source !== window.opener || event.origin !== location.origin) return;
    if (event.data?.type !== "portfolio:pdf-content") return;
    renderPortfolioDocument(event.data.content);
  });
  const requestLatest = () => window.opener?.postMessage({ type: "portfolio:pdf-ready" }, targetOrigin);
  requestLatest();
  window.addEventListener("focus", requestLatest);
  document.getElementById("save-portfolio-pdf")?.addEventListener("click", () => window.print());
})();
