// Hide loading bar and cloud
setTimeout(function () {
  const preloadItems = document.querySelector(".progress-bar-main-container");
  const cloud = document.querySelector(".cloud");

  preloadItems.classList.add("hidden");
  cloud.classList.add("hidden");
}, 3300);

// Start fading the complete intro
setTimeout(function () {
  const preloader = document.querySelector(".loading-container");
  preloader.classList.add("hidden");

  setTimeout(function () {
    preloader.style.display = "none";
  }, 600);
}, 4400);

//cloud raindrops
function rain() {
  //creating rain properties
  let cloud = document.querySelector(".cloud");
  let e = document.createElement("div");
  let left = Math.floor(Math.random() * 235) + 45;
  let width = Math.random() * 5;
  let height = Math.random() * 50;
  let duration = Math.floor(Math.random() * 6) + 1;

  //styling
  e.classList.add("drop");
  cloud.appendChild(e);
  e.style.left = left + "px";
  e.style.width = 0.3 + width + "px";
  e.style.height = 0.5 + height + "px";
  e.style.animationDuration = duration + "s";

  // removes each drop after 2 s
  setTimeout(function () {
    cloud.removeChild(e);
  }, 2000);
}

//creates every 20ms each drop
let intervalId = setInterval(function () {
  rain();
}, 20);

//timeout after 9s it stops creating divs
setTimeout(function () {
  clearInterval(intervalId);
}, 9000);

// main outside border rain

const rainContainer = document.querySelector(".weather");
const activeRainParticles = new Set();

function createDrop() {
  const containerRect = rainContainer.getBoundingClientRect();

  if (containerRect.width === 0 || containerRect.height === 0) return;

  // The falling streak and its splash share one parent and therefore one exact X center.
  const particle = document.createElement("div");
  const streak = document.createElement("span");
  const splash = document.createElement("span");

  particle.className = "rain-particle";
  streak.className = "rain-streak";
  splash.className = "rain-splash";

  const streakHeight = Math.random() * 20 + 10;
  const fallDuration = Math.random() * 850 + 550;
  const splashSafeEdge = 18;
  const usableWidth = Math.max(containerRect.width - splashSafeEdge * 2, 0);
  const impactX = splashSafeEdge + Math.random() * usableWidth;

  particle.style.left = `${impactX}px`;
  streak.style.height = `${streakHeight}px`;
  particle.append(streak, splash);
  rainContainer.appendChild(particle);
  activeRainParticles.add(particle);

  // The streak's bottom edge lands exactly on the splash line.
  const landingY = Math.max(containerRect.height - streakHeight, 0);
  const fallAnimation = streak.animate(
    [
      {
        transform: `translate(-50%, -${streakHeight}px)`,
        opacity: 0.35,
      },
      {
        transform: `translate(-50%, ${landingY}px)`,
        opacity: 0.72,
      },
    ],
    {
      duration: fallDuration,
      easing: "linear",
      fill: "forwards",
    },
  );

  function removeParticle() {
    activeRainParticles.delete(particle);
    particle.remove();
  }

  fallAnimation.finished
    .then(() => {
      fallAnimation.cancel();
      streak.style.opacity = "0";
      particle.classList.add("has-impact");

      const cleanupTimer = setTimeout(removeParticle, 700);

      splash.addEventListener("animationend", (event) => {
        if (event.animationName !== "rain-splash") return;

        clearTimeout(cleanupTimer);
        removeParticle();
      });
    })
    .catch(removeParticle);
}

// 🌥 clouds
function createCloud() {
  const weather = document.querySelector(".weather");

  const cloud = document.createElement("div");
  cloud.classList.add("cloud-item");

  //size
  const scale = Math.random() * 1.2 + 0.8;

  const baseWidth = Math.random() * 140 + 120;
  const baseHeight = baseWidth * 0.45;

  cloud.style.width = baseWidth + "px";
  cloud.style.height = baseHeight + "px";

  // spawn position
  const x = Math.random() * 90 + 5; // 5–95vw
  const y = Math.random() * 75 + 1; // 1–76vh

  cloud.style.left = x + "vw";
  cloud.style.top = y + "vh";

  //parralax system
  const depth = Math.random(); // 0 = far, 1 = near

  cloud.style.opacity = depth * 0.5 + 0.35;
  cloud.style.filter = `blur(${depth * 2}px)`;

  // start invisible → fade in
  cloud.style.opacity = 0;
  weather.appendChild(cloud);

  requestAnimationFrame(() => {
    cloud.style.transition = "opacity 2.5s ease";
    cloud.style.opacity = depth * 0.5 + 0.4;
  });

  //cloud shape
  const puffs = 4 + Math.floor(Math.random() * 3);

  for (let i = 0; i < puffs; i++) {
    const puff = document.createElement("span");

    const size = Math.random() * 70 + 40;

    puff.style.position = "absolute";
    puff.style.width = size + "px";
    puff.style.height = size + "px";
    puff.style.background = "white";
    puff.style.borderRadius = "50%";

    puff.style.left = Math.random() * 120 + "px";
    puff.style.top = Math.random() * 50 + "px";

    puff.style.opacity = 0.9;

    cloud.appendChild(puff);
  }

  const direction = Math.random() > 0.5 ? 1 : -1;

  // far clouds = slower, near clouds = slightly faster
  const duration =
    depth < 0.5
      ? Math.random() * 55 + 40 // far (slow)
      : Math.random() * 45 + 35; // near (faster )

  const distance = Math.random() * 120 + 80;

  cloud.animate(
    [
      { transform: `translateX(0px) scale(${scale})` },
      { transform: `translateX(${direction * distance}vw) scale(${scale})` },
    ],
    {
      duration: duration * 1000,
      iterations: 1,
      easing: "linear",
      fill: "forwards",
    },
  );

  //fadeout
  setTimeout(
    () => {
      cloud.style.transition = "opacity 3s ease";
      cloud.style.opacity = "0";

      setTimeout(() => {
        cloud.remove();
      }, 3000);
    },
    (duration - 3) * 1000,
  );
}

// Content is loaded from portfolio-content.js and stays in memory while the page is open.
// The local admin can write this object back to that code file, but nothing is stored in
// localStorage or sessionStorage.
const sourcePortfolioContent = window.PORTFOLIO_CONTENT || {};
let portfolioContent =
  typeof structuredClone === "function"
    ? structuredClone(sourcePortfolioContent)
    : JSON.parse(JSON.stringify(sourcePortfolioContent));

function setEditableText(element, value, path) {
  element.textContent = value ?? "";
  element.dataset.adminPath = path;
  return element;
}

function createEditableElement(tagName, value, path, className = "") {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  return setEditableText(element, value, path);
}

const projectTimeline = document.querySelector(".timeline");
const desktopProjectPagination = window.matchMedia("(min-width: 769px)");
const projectSectionTemplates = new Map(
  Array.from(
    projectTimeline.querySelectorAll(":scope > [data-project-group]"),
  ).map((group) => [
    group.dataset.projectGroup,
    group.querySelector(".timeline-item.text-only")?.cloneNode(true) || null,
  ]),
);
const PROJECT_SECTIONS_PER_PAGE = 5;
let currentProjectPage = 0;
let projectPageBusy = false;

function setContentValue(path, value) {
  const parts = path.split(".");
  let target = portfolioContent;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = /^\d+$/.test(parts[index])
      ? Number(parts[index])
      : parts[index];
    target = target?.[part];
    if (target === undefined || target === null) return false;
  }

  const finalPart = /^\d+$/.test(parts.at(-1))
    ? Number(parts.at(-1))
    : parts.at(-1);
  target[finalPart] = value;
  return true;
}

function renderProfile() {
  const profile = portfolioContent.profile;
  if (!profile) return;

  setEditableText(
    document.getElementById("portfolio-name"),
    profile.name,
    "profile.name",
  );
  setEditableText(
    document.getElementById("portfolio-role"),
    profile.role,
    "profile.role",
  );

  const mainPanel = document.getElementById("panel-main");
  mainPanel.replaceChildren(
    ...(profile.intro || []).map((paragraph, index) =>
      createEditableElement("p", paragraph, `profile.intro.${index}`),
    ),
  );
}

function renderExperience() {
  const panel = document.getElementById("panel-experience");
  const entries = portfolioContent.experience || [];

  if (entries.length === 0) {
    const placeholderContent = portfolioContent.profile.experiencePlaceholder;
    const placeholder = document.createElement("div");
    placeholder.className = "experience-placeholder";
    placeholder.append(
      createEditableElement(
        "span",
        placeholderContent.label,
        "profile.experiencePlaceholder.label",
        "draft-label",
      ),
      createEditableElement(
        "h2",
        placeholderContent.title,
        "profile.experiencePlaceholder.title",
      ),
      createEditableElement(
        "p",
        placeholderContent.body,
        "profile.experiencePlaceholder.body",
      ),
      createEditableElement(
        "p",
        placeholderContent.note,
        "profile.experiencePlaceholder.note",
        "draft-note",
      ),
    );
    panel.replaceChildren(placeholder);
    return;
  }

  const list = document.createElement("div");
  list.className = "experience-list";

  entries.forEach((entry, index) => {
    const card = document.createElement("article");
    card.className = "experience-entry";

    const header = document.createElement("header");
    const headingWrap = document.createElement("div");
    const role = createEditableElement(
      "h2",
      entry.role,
      `experience.${index}.role`,
    );
    const company = createEditableElement(
      "p",
      entry.company,
      `experience.${index}.company`,
      "experience-company",
    );
    headingWrap.append(role, company);
    header.appendChild(headingWrap);

    if (entry.current) {
      const current = document.createElement("span");
      current.className = "experience-current";
      current.textContent = "Current";
      header.appendChild(current);
    }

    const meta = document.createElement("p");
    meta.className = "experience-meta";
    const metaFields = [
      [entry.employmentType, `experience.${index}.employmentType`],
      [entry.dates, `experience.${index}.dates`],
      [entry.location, `experience.${index}.location`],
    ].filter(([value]) => value);

    metaFields.forEach(([value, path], metaIndex) => {
      if (metaIndex > 0) meta.appendChild(document.createTextNode(" · "));
      meta.appendChild(createEditableElement("span", value, path));
    });

    const description = createEditableElement(
      "p",
      entry.description,
      `experience.${index}.description`,
      "experience-description",
    );

    card.append(header, meta, description);

    if (entry.responsibilities?.length) {
      const responsibilities = document.createElement("ul");
      responsibilities.className = "experience-responsibilities";
      entry.responsibilities.forEach((responsibility, responsibilityIndex) => {
        responsibilities.appendChild(
          createEditableElement(
            "li",
            responsibility,
            `experience.${index}.responsibilities.${responsibilityIndex}`,
          ),
        );
      });
      card.appendChild(responsibilities);
    }

    if (entry.technologies?.length) {
      const technologies = document.createElement("div");
      technologies.className = "experience-technologies";
      entry.technologies.forEach((technology, technologyIndex) => {
        technologies.appendChild(
          createEditableElement(
            "span",
            technology,
            `experience.${index}.technologies.${technologyIndex}`,
          ),
        );
      });
      card.appendChild(technologies);
    }

    list.appendChild(card);
  });

  panel.replaceChildren(list);
}

function renderProjects() {
  const projects = portfolioContent.projects || [];
  const fallbackSections = Array.from(
    projectSectionTemplates,
    ([id, template]) => ({
      id,
      eyebrow:
        template?.querySelector(".date")?.textContent?.trim() ||
        "Project collection",
      title: template?.querySelector(".title")?.textContent?.trim() || id,
    }),
  );

  if (
    !Array.isArray(portfolioContent.projectSections) ||
    portfolioContent.projectSections.length === 0
  ) {
    portfolioContent.projectSections = fallbackSections;
  }

  projects.forEach((project) => {
    if (project.group === "featured") project.group = "banner";
    if (
      !portfolioContent.projectSections.some(
        (section) => section.id === project.group,
      )
    ) {
      portfolioContent.projectSections.push({
        id: project.group,
        eyebrow: "Project collection",
        title: project.group,
      });
    }
  });

  const sections = portfolioContent.projectSections;
  const usesPagedProjects = desktopProjectPagination.matches;
  const pageCount = Math.max(
    1,
    Math.ceil(sections.length / PROJECT_SECTIONS_PER_PAGE),
  );
  currentProjectPage = usesPagedProjects
    ? Math.min(currentProjectPage, pageCount - 1)
    : 0;

  const pagination = document.createElement("nav");
  const paginationLabel = document.createElement("span");
  const pageButtons = document.createElement("div");
  const pages = document.createElement("div");

  pagination.className = "project-pagination";
  pagination.hidden = !usesPagedProjects;
  pagination.setAttribute("aria-label", "Project pages");
  paginationLabel.className = "project-pagination-label";
  paginationLabel.textContent = "Page";
  pageButtons.className = "project-page-buttons";
  pages.className = "project-pages";

  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const pageButton = document.createElement("button");
    pageButton.type = "button";
    pageButton.dataset.projectPage = String(pageIndex);
    pageButton.textContent = String(pageIndex + 1);
    pageButton.setAttribute("aria-label", `Open project page ${pageIndex + 1}`);
    pageButton.addEventListener("click", () => {
      if (pageIndex >= currentProjectPage) return;
      showProjectPage(pageIndex, "backward");
    });
    pageButtons.appendChild(pageButton);

    const page = document.createElement("div");
    page.className = "project-page";
    page.dataset.projectPagePanel = String(pageIndex);
    page.hidden = usesPagedProjects && pageIndex !== currentProjectPage;

    const pageSections = sections.slice(
      pageIndex * PROJECT_SECTIONS_PER_PAGE,
      (pageIndex + 1) * PROJECT_SECTIONS_PER_PAGE,
    );

    pageSections.forEach((section) => {
      const sectionIndex = sections.indexOf(section);
      const group = document.createElement("section");
      const template = projectSectionTemplates.get(section.id);
      const header = template?.cloneNode(true) || document.createElement("div");

      group.className = `container-library${template ? "" : " custom-library"}`;
      group.dataset.projectGroup = section.id;
      header.classList.add("timeline-item", "text-only");
      header.setAttribute("role", "button");
      header.setAttribute("tabindex", "0");
      header.setAttribute(
        "aria-label",
        `Bring ${section.title} folder to front`,
      );

      if (!template) {
        const symbol = document.createElement("span");
        symbol.className = "featured-symbol";
        symbol.setAttribute("aria-hidden", "true");
        symbol.textContent = "◆";
        header.append(
          symbol,
          document.createElement("span"),
          document.createElement("span"),
        );
        header.children[1].className = "date";
        header.children[2].className = "title";
      }

      setEditableText(
        header.querySelector(".date"),
        section.eyebrow,
        `projectSections.${sectionIndex}.eyebrow`,
      );
      setEditableText(
        header.querySelector(".title"),
        section.title,
        `projectSections.${sectionIndex}.title`,
      );
      group.appendChild(header);

      const sectionProjects = projects.filter(
        (project) => project.group === section.id,
      );
      sectionProjects.forEach((project) => {
        const projectIndex = projects.indexOf(project);
        const item = document.createElement("div");
        item.className = "timeline-item";
        item.dataset.modal = project.id;
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-haspopup", "dialog");

        if (project.favorite) {
          item.classList.add("featured-project");
          const badge = document.createElement("span");
          badge.className = "project-badge";
          badge.textContent = "Favourite";
          item.appendChild(badge);
        }

        item.append(
          createEditableElement(
            "span",
            project.date,
            `projects.${projectIndex}.date`,
            "date",
          ),
          createEditableElement(
            "span",
            project.title,
            `projects.${projectIndex}.title`,
            "title",
          ),
        );
        group.appendChild(item);
      });

      if (sectionProjects.length === 0) {
        const empty = document.createElement("p");
        empty.className = "project-section-empty";
        empty.textContent = "This folder is ready for its first project.";
        group.appendChild(empty);
      }

      page.appendChild(group);
    });

    pages.appendChild(page);
  }

  const mobileTopButton = document.createElement("button");
  mobileTopButton.type = "button";
  mobileTopButton.className = "project-mobile-top";
  mobileTopButton.innerHTML = '<span aria-hidden="true">↑</span> Go to top';
  mobileTopButton.addEventListener("click", () => {
    document
      .querySelector(".messages")
      .scrollTo({ top: 0, behavior: "smooth" });
  });

  pagination.append(paginationLabel, pageButtons);
  // The desktop page control belongs below the folders and remains visible
  // while the folder stack itself scrolls.
  projectTimeline.replaceChildren(pages, pagination, mobileTopButton);
  updateProjectPagination();
}

function updateProjectPagination() {
  projectTimeline.querySelectorAll("[data-project-page]").forEach((button) => {
    const pageIndex = Number(button.dataset.projectPage);
    const isCurrent = pageIndex === currentProjectPage;
    const isFuture = pageIndex > currentProjectPage;
    button.hidden = isFuture;
    button.disabled = isCurrent;
    button.classList.toggle("is-current", isCurrent);
    if (isCurrent) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
}

async function showProjectPage(targetPage, direction = "forward") {
  if (!desktopProjectPagination.matches) return;
  const pagePanels = Array.from(
    projectTimeline.querySelectorAll("[data-project-page-panel]"),
  );
  if (
    projectPageBusy ||
    targetPage === currentProjectPage ||
    targetPage < 0 ||
    targetPage >= pagePanels.length
  ) {
    return;
  }

  const outgoing = pagePanels[currentProjectPage];
  const incoming = pagePanels[targetPage];
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const duration = reducedMotion ? 1 : 260;
  const outgoingY = direction === "forward" ? -34 : 34;
  const incomingY = direction === "forward" ? 34 : -34;

  projectPageBusy = true;
  await outgoing
    .animate(
      [
        { opacity: 1, transform: "translateY(0)" },
        { opacity: 0, transform: `translateY(${outgoingY}px)` },
      ],
      { duration, easing: "cubic-bezier(0.4, 0, 0.2, 1)", fill: "forwards" },
    )
    .finished.catch(() => {});

  outgoing.hidden = true;
  outgoing.getAnimations().forEach((animation) => animation.cancel());
  incoming.hidden = false;
  currentProjectPage = targetPage;
  updateProjectPagination();
  const projectPagesScroller = projectTimeline.querySelector(".project-pages");
  if (projectPagesScroller) projectPagesScroller.scrollTop = 0;

  await incoming
    .animate(
      [
        { opacity: 0, transform: `translateY(${incomingY}px)` },
        { opacity: 1, transform: "translateY(0)" },
      ],
      {
        duration: reducedMotion ? 1 : 320,
        easing: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    )
    .finished.catch(() => {});
  projectPageBusy = false;
}

function renderFaq() {
  const panel = document.getElementById("panel-faq");
  const profile = portfolioContent.profile;
  const fragment = document.createDocumentFragment();

  (portfolioContent.faq || []).forEach((item, index) => {
    const faqItem = document.createElement("div");
    faqItem.className = "faq-item";
    faqItem.append(
      createEditableElement("h3", item.question, `faq.${index}.question`),
      createEditableElement("p", item.answer, `faq.${index}.answer`),
    );
    fragment.appendChild(faqItem);
  });

  const firstLine = document.createElement("div");
  firstLine.className = "line";
  const opinion = document.createElement("div");
  opinion.className = "faq-item opinion";
  opinion.appendChild(
    createEditableElement("p", profile.opinion, "profile.opinion"),
  );
  const secondLine = document.createElement("div");
  secondLine.className = "line";

  const education = document.createElement("div");
  education.className = "education";
  education.appendChild(
    createEditableElement(
      "h3",
      profile.educationHeading || "Education",
      "profile.educationHeading",
    ),
  );

  (profile.education || []).forEach((entry, index) => {
    const school = document.createElement("p");
    const degree = createEditableElement(
      "strong",
      entry.degree,
      `profile.education.${index}.degree`,
    );
    const institution = createEditableElement(
      "span",
      entry.institution,
      `profile.education.${index}.institution`,
    );
    school.append(degree, document.createTextNode(", "), institution);
    education.append(
      school,
      createEditableElement(
        "p",
        entry.period,
        `profile.education.${index}.period`,
      ),
    );

    if (entry.note) {
      education.appendChild(
        createEditableElement(
          "p",
          entry.note,
          `profile.education.${index}.note`,
        ),
      );
    }

    if (index < profile.education.length - 1)
      education.appendChild(document.createElement("br"));
  });

  const thirdLine = document.createElement("div");
  thirdLine.className = "line";
  const certifications = document.createElement("div");
  certifications.className = "certifications";
  const certificationHeading = createEditableElement(
    "h3",
    profile.certification.heading,
    "profile.certification.heading",
  );
  const certificationParagraph = document.createElement("p");
  const certificateLink = createEditableElement(
    "a",
    profile.certification.label,
    "profile.certification.label",
  );
  certificateLink.href = profile.certification.url;
  certificateLink.target = "_blank";
  certificateLink.rel = "noopener noreferrer";
  certificateLink.dataset.adminHrefPath = "profile.certification.url";
  certificationParagraph.appendChild(certificateLink);
  certifications.append(certificationHeading, certificationParagraph);

  fragment.append(
    firstLine,
    opinion,
    secondLine,
    education,
    thirdLine,
    certifications,
  );
  panel.replaceChildren(fragment);
}

function renderContact() {
  const profile = portfolioContent.profile;
  const contact = profile.contact;
  const phoneButton = document.getElementById("contact-phone");
  const emailButton = document.getElementById("contact-email");

  setEditableText(
    document.getElementById("contact-heading"),
    profile.contactHeading,
    "profile.contactHeading",
  );
  setEditableText(
    document.getElementById("contact-phone-value"),
    contact.phone,
    "profile.contact.phone",
  );
  setEditableText(
    document.getElementById("contact-email-value"),
    contact.email,
    "profile.contact.email",
  );
  setEditableText(
    document.getElementById("contact-location"),
    contact.location,
    "profile.contact.location",
  );
  setEditableText(
    document.getElementById("contact-birth-date"),
    contact.birthDate,
    "profile.contact.birthDate",
  );

  phoneButton.dataset.copy = contact.phone;
  emailButton.dataset.copy = contact.email;
  document.getElementById("contact-linkedin").href = contact.linkedin;
  document.getElementById("contact-github").href = contact.github;
}

function renderPortfolioContent() {
  renderProfile();
  renderExperience();
  renderProjects();
  renderFaq();
  renderContact();
  document.dispatchEvent(new CustomEvent("portfolio:contentrender"));
}

renderPortfolioContent();

desktopProjectPagination.addEventListener("change", () => {
  currentProjectPage = 0;
  renderProjects();
  document.dispatchEvent(new CustomEvent("portfolio:contentrender"));
});

const links = document.querySelectorAll(".link");
const messages = document.querySelectorAll(".message");
const messagesScroller = document.querySelector(".messages");

function bringProjectFolderToFront(header) {
  const folder = header.closest(".container-library");

  if (!folder) return;

  if (desktopProjectPagination.matches) {
    const page = folder.closest(".project-page");
    const scroller = folder.closest(".project-pages");

    if (!page || !scroller) return;

    const folders = Array.from(
      page.querySelectorAll(":scope > .container-library"),
    );
    const folderIndex = folders.indexOf(folder);
    const pageGap = Number.parseFloat(getComputedStyle(page).rowGap) || 0;
    const normalTop = folders
      .slice(0, Math.max(0, folderIndex))
      .reduce((position, item) => position + item.offsetHeight + pageGap, 0);
    const stickyTop = Number.parseFloat(getComputedStyle(folder).top) || 0;

    scroller.scrollTo({
      top: Math.max(0, normalTop - stickyTop),
      behavior: "smooth",
    });
    return;
  }

  const scrollerRect = messagesScroller.getBoundingClientRect();
  const folderRect = folder.getBoundingClientRect();

  messagesScroller.scrollTo({
    top: messagesScroller.scrollTop + folderRect.top - scrollerRect.top,
    behavior: "smooth",
  });
}

// Event delegation continues working after renderProjects()
// recreates all the folders.
projectTimeline.addEventListener("click", (event) => {
  if (!(event.target instanceof Element)) return;

  const header = event.target.closest(".timeline-item.text-only");

  if (!header) return;

  bringProjectFolderToFront(header);
});

projectTimeline.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") {
    return;
  }

  if (!(event.target instanceof Element)) return;

  const header = event.target.closest(".timeline-item.text-only");

  if (!header) return;

  event.preventDefault();
  bringProjectFolderToFront(header);
});

let currentPanel = document.querySelector(".message.active");
let navSwitchTimer;

links.forEach((link, linkIndex) => {
  link.addEventListener("click", () => {
    const nextPanel = document.getElementById(link.dataset.panel);
    if (!nextPanel || nextPanel === currentPanel) return;

    links.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
      item.setAttribute("tabindex", "-1");
    });

    link.classList.add("active");
    link.setAttribute("aria-selected", "true");
    link.setAttribute("tabindex", "0");

    currentPanel.classList.remove("fade-in");

    clearTimeout(navSwitchTimer);
    navSwitchTimer = setTimeout(() => {
      messages.forEach((message) =>
        message.classList.remove("active", "fade-in"),
      );
      nextPanel.classList.add("active");

      messagesScroller.classList.toggle(
        "is-project-view",
        nextPanel.id === "panel-projects",
      );
      document.querySelector(".messages").scrollTop = 0;

      requestAnimationFrame(() => {
        nextPanel.classList.add("fade-in");
      });

      currentPanel = nextPanel;
    }, 500); // match CSS transition
  });

  link.addEventListener("keydown", (event) => {
    const previousKeys = ["ArrowLeft", "ArrowUp"];
    const nextKeys = ["ArrowRight", "ArrowDown"];
    let targetIndex = null;

    if (previousKeys.includes(event.key))
      targetIndex = (linkIndex - 1 + links.length) % links.length;
    if (nextKeys.includes(event.key))
      targetIndex = (linkIndex + 1) % links.length;
    if (event.key === "Home") targetIndex = 0;
    if (event.key === "End") targetIndex = links.length - 1;
    if (targetIndex === null) return;

    event.preventDefault();
    links[targetIndex].focus();
    links[targetIndex].click();
  });
});

//Magnetic move
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  links.forEach((link) => {
    const strength = 15; // lower = softer movement

    link.addEventListener("mousemove", (e) => {
      const rect = link.getBoundingClientRect();

      // mouse position relative to center
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      // normalize movement
      const moveX = (x / rect.width) * strength;
      const moveY = (y / rect.height) * strength;

      link.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });

    link.addEventListener("mouseleave", () => {
      link.style.transform = "translate(0, 0)";
    });
  });
}

// show first message initially
messages[0].classList.add("fade-in");

function projectsAreAtScrollEnd() {
  if (!desktopProjectPagination.matches) return false;
  const projectPagesScroller = projectTimeline.querySelector(".project-pages");
  if (!projectPagesScroller) return false;
  return (
    projectPagesScroller.scrollTop + projectPagesScroller.clientHeight >=
    projectPagesScroller.scrollHeight - 4
  );
}

function advanceProjectPageFromScroll() {
  const pageCount = projectTimeline.querySelectorAll(
    "[data-project-page-panel]",
  ).length;
  if (currentPanel?.id !== "panel-projects" || !projectsAreAtScrollEnd())
    return false;
  if (currentProjectPage >= pageCount - 1 || projectPageBusy) return false;

  showProjectPage(currentProjectPage + 1, "forward");
  return true;
}

messagesScroller.addEventListener(
  "wheel",
  (event) => {
    if (event.deltaY <= 0 || !advanceProjectPageFromScroll()) return;
    event.preventDefault();
  },
  { passive: false },
);

let projectTouchStartY = null;
messagesScroller.addEventListener(
  "touchstart",
  (event) => {
    projectTouchStartY = event.touches[0]?.clientY ?? null;
  },
  { passive: true },
);
messagesScroller.addEventListener(
  "touchend",
  (event) => {
    if (projectTouchStartY === null) return;
    const endY = event.changedTouches[0]?.clientY ?? projectTouchStartY;
    const swipedUp = projectTouchStartY - endY > 36;
    projectTouchStartY = null;
    if (swipedUp) advanceProjectPageFromScroll();
  },
  { passive: true },
);

const modal = document.getElementById("project-modal");
const titleEl = document.getElementById("modal-title");
const descEl = document.getElementById("modal-desc");
const modalUrlEl = document.getElementById("modal-url");
const modalExternalLink = document.getElementById("modal-external-link");
const modalRepoLink = document.getElementById("modal-repo-link");
const projectFrame = document.getElementById("project-frame");
const projectFrameLoader = document.getElementById("project-frame-loader");
const closeModalButton = modal.querySelector(".close-btn");
let lastModalTrigger = null;
let hasProjectPreview = false;

function openProject(item) {
  const project = (portfolioContent.projects || []).find(
    (entry) => entry.id === item.dataset.modal,
  );
  if (!project) return;

  const projectUrl = project.liveUrl?.trim() || "";
  titleEl.textContent = project.title;
  descEl.textContent = project.description;
  modalExternalLink.hidden = !projectUrl;
  modalExternalLink.href = projectUrl || "#";
  modalRepoLink.hidden = !project.repoUrl;
  modalRepoLink.href = project.repoUrl || "#";
  modalUrlEl.textContent = (projectUrl || project.repoUrl || "No live preview")
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");
  projectFrame.title = `${project.title} interactive preview`;
  projectFrameLoader.classList.remove("hidden");
  projectFrameLoader.textContent = projectUrl
    ? "Loading interactive preview…"
    : "No live preview URL yet — use View source or add a live URL in the local admin.";
  hasProjectPreview = false;
  projectFrame.src = "about:blank";

  if (projectUrl) {
    try {
      // A fresh query avoids showing an older cached deployment after a project update.
      const previewUrl = new URL(projectUrl, window.location.href);
      previewUrl.searchParams.set("portfolioPreview", Date.now().toString());
      hasProjectPreview = true;
      projectFrame.src = previewUrl.href;
    } catch {
      projectFrameLoader.textContent =
        "This live preview URL is invalid. Edit it from the local admin.";
    }
  }

  modal.classList.add("active");
  modal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
  lastModalTrigger = item;
  closeModalButton.focus();
}

projectTimeline.addEventListener("click", (event) => {
  const item = event.target.closest(".timeline-item[data-modal]");
  if (
    !item ||
    (document.body.classList.contains("admin-inline-editing") &&
      event.target.closest("[data-admin-path]"))
  ) {
    return;
  }
  openProject(item);
});

projectTimeline.addEventListener("keydown", (event) => {
  const item = event.target.closest(".timeline-item[data-modal]");
  if (!item || (event.key !== "Enter" && event.key !== " ")) return;
  if (event.target.matches("[contenteditable='true']")) return;

  event.preventDefault();
  openProject(item);
});

function closeProjectModal() {
  if (!modal.classList.contains("active")) return;

  modal.classList.remove("active");
  modal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  projectFrame.src = "about:blank";
  projectFrameLoader.classList.remove("hidden");
  lastModalTrigger?.focus();
}

closeModalButton.addEventListener("click", closeProjectModal);
modal.onclick = (e) => {
  if (e.target === modal) closeProjectModal();
};

projectFrame.addEventListener("load", () => {
  if (modal.classList.contains("active") && hasProjectPreview) {
    projectFrameLoader.classList.add("hidden");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (modal.classList.contains("active")) closeProjectModal();
    return;
  }

  if (event.key !== "Tab" || !modal.classList.contains("active")) return;

  const focusable = Array.from(
    modal.querySelectorAll("a[href], button:not([disabled]), iframe"),
  );
  const firstItem = focusable[0];
  const lastItem = focusable[focusable.length - 1];

  if (event.shiftKey && document.activeElement === firstItem) {
    event.preventDefault();
    lastItem.focus();
  } else if (!event.shiftKey && document.activeElement === lastItem) {
    event.preventDefault();
    firstItem.focus();
  }
});

// Click-to-copy contact details
const copyToast = document.getElementById("copy-toast");
let copyToastTimer;

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Clipboard copy failed");
}

document.querySelectorAll(".contact-copy").forEach((button) => {
  button.addEventListener("click", async () => {
    try {
      await copyText(button.dataset.copy);
      const copiedItem = button.closest(".copyable-contact");
      copiedItem.classList.add("copied");
      const copiedLabel = button
        .getAttribute("aria-label")
        .replace(/^Copy /, "");
      copyToast.textContent =
        copiedLabel.charAt(0).toUpperCase() + copiedLabel.slice(1) + " copied";
      copyToast.classList.add("visible");

      clearTimeout(copyToastTimer);
      copyToastTimer = setTimeout(() => {
        copyToast.classList.remove("visible");
        copiedItem.classList.remove("copied");
      }, 1600);
    } catch {
      copyToast.textContent = "Could not copy — please copy it manually";
      copyToast.classList.add("visible");
      clearTimeout(copyToastTimer);
      copyToastTimer = setTimeout(
        () => copyToast.classList.remove("visible"),
        2200,
      );
    }
  });
});

// Central weather system
const moon = document.querySelector(".moon");
const sun = document.querySelector(".sun");
const bgVideo = document.getElementById("bg_main");
const starField = document.getElementById("star-field");

const weatherModes = {
  storm: {
    label: "Storm",
    symbol: "↯",
    panel: "rgba(20, 20, 20, 0.79)",
    tab: "rgba(40, 40, 40, 0.85)",
  },
  day: {
    label: "Day",
    symbol: "●",
    panel: "rgba(104, 126, 154, 0.78)",
    tab: "rgba(116, 139, 166, 0.9)",
  },
  sunset: {
    label: "Sunset",
    symbol: "◒",
    panel: "rgba(101, 48, 58, 0.8)",
    tab: "rgba(121, 61, 62, 0.91)",
  },
  "clear-night": {
    label: "Clear night",
    symbol: "✦",
    panel: "rgba(10, 18, 35, 0.82)",
    tab: "rgba(15, 27, 49, 0.92)",
  },
};

let currentWeather = null;
let celestialTransitioning = false;
let borderRainInterval;
let cloudInterval;
let rainResizeTimer;

function startRain() {
  stopRain();

  const spawnDelay = window.matchMedia("(max-width: 700px)").matches ? 62 : 38;
  borderRainInterval = setInterval(createDrop, spawnDelay);
}

function stopRain() {
  clearInterval(borderRainInterval);

  activeRainParticles.forEach((particle) => {
    particle
      .getAnimations({ subtree: true })
      .forEach((animation) => animation.cancel());
    particle.remove();
  });
  activeRainParticles.clear();
}

function showClouds(minDelay = 700, maxDelay = 1250) {
  hideClouds();

  function spawn() {
    createCloud();
    cloudInterval = setTimeout(
      spawn,
      Math.random() * (maxDelay - minDelay) + minDelay,
    );
  }

  spawn();
}

function hideClouds() {
  clearTimeout(cloudInterval);

  document.querySelectorAll(".cloud-item").forEach((c) => c.remove());
}

function playVideo() {
  const playPromise = bgVideo.play();
  playPromise?.catch(() => {});
}

function stopVideo() {
  bgVideo.pause();
}

function buildStars() {
  const starCount = window.matchMedia("(max-width: 600px)").matches ? 42 : 76;
  const fragment = document.createDocumentFragment();

  starField.replaceChildren();

  for (let index = 0; index < starCount; index += 1) {
    const star = document.createElement("span");
    const size = Math.random() * 2.2 + 0.7;

    star.className = "star";
    star.style.setProperty("--star-x", `${Math.random() * 100}%`);
    star.style.setProperty("--star-y", `${Math.random() * 92}%`);
    star.style.setProperty("--star-size", `${size}px`);
    star.style.setProperty("--star-delay", `${Math.random() * -5}s`);
    star.style.setProperty("--star-speed", `${Math.random() * 2.8 + 2.2}s`);
    fragment.appendChild(star);
  }

  starField.appendChild(fragment);
}

function isSunWeather(mode) {
  return mode === "day" || mode === "sunset";
}

function resetCelestialMotion(celestial) {
  celestial.classList.remove("go-up", "go-down", "is-visible", "is-measuring");
  celestial.style.removeProperty("left");
  celestial.style.removeProperty("top");
  celestial.style.removeProperty("--celestial-enter-x");
  celestial.style.removeProperty("--celestial-enter-y");
  celestial.style.removeProperty("--celestial-enter-duration");
  celestial.style.removeProperty("--celestial-exit-x");
  celestial.style.removeProperty("--celestial-exit-y");
  celestial.style.removeProperty("--celestial-exit-duration");
  celestial.removeAttribute("data-departing-weather");
}

function prepareCelestialEntrance(celestial) {
  // Measure the body's final weather-specific resting position without allowing
  // that temporary state to paint on screen.
  celestial.classList.add("is-measuring");
  const restingRect = celestial.getBoundingClientRect();
  celestial.classList.remove("is-measuring");

  // The original portfolio launched every moon and sun from 40vw. Keeping that
  // shared X position preserves the old diagonal path, while placing the top
  // just below the viewport guarantees that every body begins fully off-screen.
  const sharedStartLeft = window.innerWidth * 0.4;
  const sharedStartTop =
    window.innerHeight + Math.max(24, restingRect.height * 0.12);
  const enterX = sharedStartLeft - restingRect.left;
  const enterY = sharedStartTop - restingRect.top;
  const enterDistance = Math.hypot(enterX, enterY);
  const enterDuration = Math.min(4.8, Math.max(3.1, enterDistance / 250 + 0.5));

  celestial.style.setProperty("--celestial-enter-x", `${enterX}px`);
  celestial.style.setProperty("--celestial-enter-y", `${enterY}px`);
  celestial.style.setProperty(
    "--celestial-enter-duration",
    `${enterDuration.toFixed(2)}s`,
  );
}

function prepareCelestialExit(celestial, restingRect) {
  // Every body leaves up and slightly right. The vertical distance is calculated
  // from its own current position, so the low red sun travels farther than the
  // top moon/sun and still finishes completely above the viewport.
  const exitTop = -restingRect.height - Math.max(36, window.innerHeight * 0.16);
  const isRedSun = celestial.dataset.departingWeather === "sunset";

  const exitRight = isRedSun
    ? Math.max(120, window.innerWidth * 0.95)
    : Math.max(42, window.innerWidth * 0.09);
  const exitY = exitTop - restingRect.top;
  const exitDistance = Math.hypot(exitRight, exitY);
  const exitDuration = Math.min(3, Math.max(1.25, exitDistance / 400 + 0.3));

  celestial.style.setProperty("--celestial-exit-x", `${exitRight}px`);
  celestial.style.setProperty("--celestial-exit-y", `${exitY}px`);
  celestial.style.setProperty(
    "--celestial-exit-duration",
    `${exitDuration.toFixed(2)}s`,
  );
}

[sun, moon].forEach((celestial) => {
  celestial.addEventListener("animationend", (event) => {
    if (
      event.animationName !== "go-up" ||
      !celestial.classList.contains("go-up")
    )
      return;

    celestial.classList.remove("go-up");
    celestial.classList.add("is-visible");
    celestial.style.removeProperty("--celestial-enter-x");
    celestial.style.removeProperty("--celestial-enter-y");
    celestial.style.removeProperty("--celestial-enter-duration");
    celestialTransitioning = false;
  });
});

function transitionCelestial(showSun, previousWeather, outgoingRect) {
  const wasShowingSun = previousWeather ? isSunWeather(previousWeather) : null;

  if (wasShowingSun === showSun) return;

  const incoming = showSun ? sun : moon;
  const outgoing = previousWeather ? (wasShowingSun ? sun : moon) : null;

  // Clear the previous finished animations before starting a fresh weather change.
  resetCelestialMotion(sun);
  resetCelestialMotion(moon);

  prepareCelestialEntrance(incoming);
  celestialTransitioning = true;

  if (outgoing && outgoingRect) {
    // Keep the disappearing body at its exact current viewport position. Its
    // weather marker also preserves the crescent/red-sun appearance while it exits.
    outgoing.style.left = `${outgoingRect.left}px`;
    outgoing.style.top = `${outgoingRect.top}px`;
    outgoing.dataset.departingWeather = previousWeather;
    prepareCelestialExit(outgoing, outgoingRect);
    outgoing.classList.add("go-down");
  }

  // The outgoing and incoming bodies start on the same frame. This recreates
  // the original overlapping transition without leaving an empty waiting gap.
  void incoming.offsetWidth;
  incoming.classList.add("go-up");
}

function updateCelestialAccessibility(showSun) {
  sun.tabIndex = showSun ? 0 : -1;
  moon.tabIndex = showSun ? -1 : 0;
  sun.setAttribute("aria-hidden", String(!showSun));
  moon.setAttribute("aria-hidden", String(showSun));
}

function setWeather(mode) {
  const config = weatherModes[mode];
  if (!config || mode === currentWeather) return;

  const previousWeather = currentWeather;
  const showSun = isSunWeather(mode);
  const wasShowingSun = previousWeather ? isSunWeather(previousWeather) : null;
  const outgoing =
    previousWeather && wasShowingSun !== showSun
      ? wasShowingSun
        ? sun
        : moon
      : null;
  const outgoingRect = outgoing?.getBoundingClientRect() || null;

  stopRain();
  hideClouds();
  stopVideo();

  currentWeather = mode;
  document.body.dataset.weather = mode;
  document.documentElement.style.setProperty("--overlay-color", config.panel);
  document.documentElement.style.setProperty("--overlay-color-tab", config.tab);
  transitionCelestial(showSun, previousWeather, outgoingRect);

  if (mode === "storm") {
    startRain();
    playVideo();
  } else if (mode === "day") {
    showClouds(720, 1300);
  } else if (mode === "sunset") {
    showClouds(1500, 2600);
  }

  updateCelestialAccessibility(showSun);
  document.dispatchEvent(
    new CustomEvent("portfolio:weatherchange", { detail: { mode } }),
  );
}

// Full moon → sun → crescent moon → red sunset sun.
const weatherOrder = ["storm", "day", "clear-night", "sunset"];

function showNextWeather() {
  if (celestialTransitioning) return;

  const currentIndex = weatherOrder.indexOf(currentWeather);
  const nextIndex =
    currentIndex < 0 ? 0 : (currentIndex + 1) % weatherOrder.length;
  setWeather(weatherOrder[nextIndex]);
}

[moon, sun].forEach((celestial) => {
  celestial.addEventListener("click", showNextWeather);
  celestial.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    showNextWeather();
  });
});

window.addEventListener("resize", () => {
  clearTimeout(rainResizeTimer);
  rainResizeTimer = setTimeout(() => {
    if (currentWeather === "storm") startRain();
  }, 160);
});

buildStars();
setWeather(portfolioContent.settings?.defaultWeather || "storm");

const adminRequested =
  new URLSearchParams(window.location.search).get("admin") === "1";
const localAdminHosts = new Set(["localhost", "127.0.0.1", "::1"]);
const desktopAdminViewport = window.matchMedia("(min-width: 1024px)");

if (
  adminRequested &&
  localAdminHosts.has(window.location.hostname) &&
  desktopAdminViewport.matches
) {
  const adminApi = {
    getContent: () => portfolioContent,
    replaceContent(nextContent) {
      portfolioContent = nextContent;
      window.PORTFOLIO_CONTENT = portfolioContent;
      renderPortfolioContent();
    },
    renderContent: renderPortfolioContent,
    setContentValue,
    setWeather,
    getWeather: () => currentWeather,
    weatherModes,
  };

  window.portfolioAdminApi = adminApi;
  const adminModuleUrl = new URL("./script/admin.js?v=3", window.location.href);
  import(adminModuleUrl.href)
    .then(({ initPortfolioAdmin }) => initPortfolioAdmin(adminApi))
    .catch((error) =>
      console.error("Could not initialize the local portfolio admin.", error),
    );
}
