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
  element("h1", profile.name);
  element("p", profile.role, root, "role");
  const contacts = element("div", "", root, "contact");
  element("span", profile.contact.location, contacts);
  link(profile.contact.email, `mailto:${profile.contact.email}`, contacts);
  link(profile.contact.phone, `tel:${profile.contact.phone.replace(/\s/g, "")}`, contacts);
  link("GitHub", profile.contact.github, contacts);
  link("LinkedIn", profile.contact.linkedin, contacts);
  link("Live portfolio", livePortfolio, contacts);
  element("h2", "Profile");
  profile.intro.forEach(text => element("p", text));
  element("h2", "Skills");
  const skills = new Set(profile.skills || ["HTML", "CSS / SCSS", "JavaScript", "Angular", "React", "Tailwind CSS", "Responsive interfaces", "CSS animation"]);
  content.experience.forEach(entry => (entry.technologies || []).forEach(skill => skills.add(skill)));
  element("p", [...skills].join(" · "));
  if (content.experience.length) element("h2", "Experience");
  content.experience.forEach(entry => {
    const article = element("article", "");
    element("h3", `${entry.role} — ${entry.company}`, article);
    element("p", [entry.dates, entry.employmentType, entry.location].filter(Boolean).join(" · "), article, "meta");
    element("p", entry.description, article);
    if (entry.responsibilities?.length) {
      const list = element("ul", "", article);
      entry.responsibilities.forEach(text => element("li", text, list));
    }
    if (entry.technologies?.length) element("p", entry.technologies.join(" · "), article, "meta");
  });
  element("h2", profile.educationHeading);
  profile.education.forEach(entry => {
    const article = element("article", "");
    element("h3", `${entry.degree} — ${entry.institution}`, article);
    element("p", [entry.period, polish(entry.note)].filter(Boolean).join(" · "), article, "meta");
  });
  element("h2", profile.certification.heading);
  link(profile.certification.label, profile.certification.url, root);
  const projects = element("section", "", root, "projects");
  element("h2", "Selected projects", projects);
  // Favorites are the owner's selection signal. Fill remaining places with
  // the strongest current projects, and never show more than three.
  const preferred = ["p13", "p12", "p8"];
  const rank = project => preferred.includes(project.id) ? preferred.indexOf(project.id) : preferred.length;
  const selected = [...content.projects].sort((a, b) => Number(Boolean(b.favorite)) - Number(Boolean(a.favorite)) || rank(a) - rank(b)).slice(0, 3);
  selected.forEach(project => {
    const article = element("article", "", projects);
    element("h3", project.title, article);
    element("p", project.date, article, "meta");
    element("p", project.description, article);
    const links = element("div", "", article, "contact");
    if (project.liveUrl) link("View live project", project.liveUrl, links);
    if (project.repoUrl) link("Source on GitHub", project.repoUrl, links);
  });
  const footer = element("p", "Explore more work on ", root, "note");
  link("my portfolio", livePortfolio, footer);
  footer.append(document.createTextNode(` · Updated ${new Date().toISOString().slice(0, 10)}`));
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
