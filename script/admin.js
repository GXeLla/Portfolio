const LOCAL_ADMIN_HOSTS = new Set(["localhost", "127.0.0.1", "::1"]);
const DESKTOP_ADMIN_QUERY = "(min-width: 1024px)";

function getValueByPath(source, path) {
  return path.split(".").reduce((value, part) => {
    const key = /^\d+$/.test(part) ? Number(part) : part;
    return value?.[key];
  }, source);
}

function normalizeLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeCommaList(value) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function slugify(value) {
  return (
    value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "section"
  );
}

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), Math.max(minimum, maximum));
}

function createListCard({ title, meta, index, type, draggable = false, favorite = null }) {
  const card = document.createElement("article");
  const editButton = document.createElement("button");
  const text = document.createElement("span");
  const heading = document.createElement("strong");
  const description = document.createElement("small");

  card.className = "admin-list-card";
  card.dataset.adminItemIndex = String(index);
  card.dataset.adminItemType = type;

  if (draggable) {
    const dragHandle = document.createElement("span");
    dragHandle.className = "admin-list-drag";
    dragHandle.draggable = true;
    dragHandle.dataset.adminDragSource = "";
    dragHandle.setAttribute("role", "img");
    dragHandle.setAttribute("aria-label", `Drag ${title || "item"} to reorder`);
    dragHandle.title = "Drag to reorder";
    dragHandle.textContent = "⠿";
    card.appendChild(dragHandle);
  }

  editButton.type = "button";
  editButton.className = "admin-list-edit";
  editButton.dataset.adminEditIndex = String(index);
  editButton.dataset.adminEditType = type;
  heading.textContent = title || "Untitled item";
  description.textContent = meta || "Click to edit";
  text.append(heading, description);
  editButton.appendChild(text);
  card.appendChild(editButton);

  if (favorite !== null) {
    const favoriteButton = document.createElement("button");
    favoriteButton.type = "button";
    favoriteButton.className = "admin-favorite-toggle";
    favoriteButton.dataset.adminFavoriteIndex = String(index);
    favoriteButton.setAttribute("aria-pressed", String(favorite));
    favoriteButton.setAttribute(
      "aria-label",
      favorite ? `Remove ${title} from favourites` : `Mark ${title} as favourite`,
    );
    favoriteButton.title = favorite ? "Remove Favourite" : "Make Favourite";
    favoriteButton.textContent = favorite ? "★" : "☆";
    card.appendChild(favoriteButton);
  }

  return card;
}

function reorderAroundTarget(items, sourceIndex, targetIndex, placeAfter) {
  const source = items[sourceIndex];
  const target = items[targetIndex];
  if (!source || !target || source === target) return false;

  items.splice(sourceIndex, 1);
  const updatedTargetIndex = items.indexOf(target);
  items.splice(updatedTargetIndex + (placeAfter ? 1 : 0), 0, source);
  return true;
}

function downloadContentFile(fileText) {
  const blob = new Blob([fileText], { type: "text/javascript;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = objectUrl;
  link.download = "portfolio-content.js";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
}

export function initPortfolioAdmin(api) {
  if (!LOCAL_ADMIN_HOSTS.has(window.location.hostname)) return;
  if (!window.matchMedia(DESKTOP_ADMIN_QUERY).matches) return;

  const shell = document.createElement("div");
  shell.className = "portfolio-admin";
  shell.innerHTML = `
    <button class="admin-launcher" id="admin-launcher" type="button" aria-expanded="false" aria-controls="admin-panel">
      Admin
    </button>

    <section class="admin-panel" id="admin-panel" role="dialog" aria-modal="false" aria-label="Local portfolio admin" aria-hidden="true">
      <header class="admin-header" data-admin-panel-handle>
        <div class="admin-folder-tab" aria-hidden="true">PORTFOLIO</div>
        <div>
          <span>Local editing mode · drag this header</span>
          <h2>Portfolio Admin</h2>
          <p>Resize from the lower-right corner. Nothing is stored in the browser.</p>
        </div>
        <button class="admin-close" id="admin-close" type="button" aria-label="Close admin panel">✕</button>
      </header>

      <div class="admin-quick-actions">
        <button id="admin-inline-toggle" type="button" aria-pressed="false">Edit text on page</button>
        <span id="admin-dirty-status" role="status">No unsaved edits</span>
      </div>

      <nav class="admin-tabs" role="tablist" aria-label="Admin sections">
        <button type="button" role="tab" aria-selected="true" data-admin-tab="overview">Overview</button>
        <button type="button" role="tab" aria-selected="false" data-admin-tab="experience">Experience</button>
        <button type="button" role="tab" aria-selected="false" data-admin-tab="projects">Projects</button>
        <button type="button" role="tab" aria-selected="false" data-admin-tab="faq">FAQ</button>
      </nav>

      <div class="admin-body">
        <section class="admin-section is-active" data-admin-section="overview">
          <div class="admin-section-heading">
            <h3>General content</h3>
            <p>Edit the main copy and contact information. Education text can also be edited directly on the page.</p>
          </div>
          <form id="admin-overview-form" class="admin-form">
            <label>Name<input data-admin-field="profile.name" required /></label>
            <label>Role<input data-admin-field="profile.role" required /></label>
            <label class="admin-field-wide">Introduction — paragraph 1<textarea data-admin-field="profile.intro.0" rows="4"></textarea></label>
            <label class="admin-field-wide">Introduction — paragraph 2<textarea data-admin-field="profile.intro.1" rows="4"></textarea></label>
            <label>Phone<input data-admin-field="profile.contact.phone" /></label>
            <label>Email<input data-admin-field="profile.contact.email" type="email" /></label>
            <label>Location<input data-admin-field="profile.contact.location" /></label>
            <label>Birth date<input data-admin-field="profile.contact.birthDate" /></label>
            <label class="admin-field-wide">LinkedIn URL<input data-admin-field="profile.contact.linkedin" type="url" /></label>
            <label class="admin-field-wide">GitHub URL<input data-admin-field="profile.contact.github" type="url" /></label>
            <label class="admin-field-wide">FAQ opinion<textarea data-admin-field="profile.opinion" rows="3"></textarea></label>
            <label>Certificate label<input data-admin-field="profile.certification.label" /></label>
            <label>Certificate URL<input data-admin-field="profile.certification.url" /></label>
          </form>
        </section>

        <section class="admin-section" data-admin-section="experience" hidden>
          <div class="admin-section-heading">
            <h3>Job experience</h3>
            <p>Add a role or select an existing entry to edit it.</p>
          </div>
          <div class="admin-list" id="admin-experience-list"></div>
          <form id="admin-experience-form" class="admin-form admin-entry-form">
            <input name="index" type="hidden" />
            <label>Role<input name="role" required /></label>
            <label>Company<input name="company" required /></label>
            <label>Employment type<input name="employmentType" placeholder="Full-time, Internship…" /></label>
            <label>Dates<input name="dates" placeholder="Aug 2026 – Present" /></label>
            <label class="admin-field-wide">Location / remote<input name="location" /></label>
            <label class="admin-field-wide">Description<textarea name="description" rows="4" required></textarea></label>
            <label class="admin-field-wide">Responsibilities — one per line<textarea name="responsibilities" rows="5"></textarea></label>
            <label class="admin-field-wide">Technologies — comma separated<input name="technologies" placeholder="JavaScript, SCSS, Angular" /></label>
            <label class="admin-checkbox"><input name="current" type="checkbox" /> Currently working here</label>
            <div class="admin-form-actions admin-field-wide">
              <button class="admin-primary" type="submit">Save experience</button>
              <button type="button" data-admin-clear="experience">New entry</button>
              <button class="admin-danger" id="admin-delete-experience" type="button" hidden>Delete</button>
            </div>
          </form>
        </section>

        <section class="admin-section" data-admin-section="projects" hidden>
          <div class="admin-section-heading">
            <h3>Projects, folders & banners</h3>
            <p>Projects are displayed oldest first within each folder. Use dates to control that order, and drag projects into another folder to recategorize them.</p>
          </div>

          <div class="admin-subsection">
            <div class="admin-subsection-heading">
              <div><span>Public folders</span><h4>Project sections</h4></div>
              <button type="button" data-admin-clear="section">+ New section</button>
            </div>
            <div class="admin-list admin-section-list" id="admin-project-section-list"></div>
            <form id="admin-project-section-form" class="admin-form admin-compact-form">
              <input name="index" type="hidden" />
              <label>Small heading / date<input name="eyebrow" required placeholder="Creative development" /></label>
              <label>Folder title<input name="title" required placeholder="Banner & ad work" /></label>
              <div class="admin-form-actions admin-field-wide">
                <button class="admin-primary" type="submit">Save section</button>
                <button type="button" data-admin-clear="section">Clear</button>
                <button class="admin-danger" id="admin-delete-section" type="button" hidden>Delete section</button>
              </div>
            </form>
          </div>

          <div class="admin-subsection">
            <div class="admin-subsection-heading">
              <div><span>Sortable content</span><h4>Projects</h4></div>
              <button type="button" data-admin-clear="project">+ New project</button>
            </div>
            <div class="admin-project-groups" id="admin-project-list"></div>
          </div>

          <form id="admin-project-form" class="admin-form admin-entry-form">
            <input name="index" type="hidden" />
            <label>Project name<input name="title" required /></label>
            <label>Date<input name="date" placeholder="Aug 15, 2026" /></label>
            <label>Section<select name="group" required></select></label>
            <label>Technologies<input name="technologies" placeholder="Angular, TypeScript, SCSS" /></label>
            <label class="admin-checkbox"><input name="favorite" type="checkbox" /> Show Favourite badge</label>
            <label class="admin-field-wide">Description<textarea name="description" rows="5" required></textarea></label>
            <label class="admin-field-wide">Live preview URL<input name="liveUrl" type="url" placeholder="https://…" /></label>
            <label class="admin-field-wide">GitHub repository URL<input name="repoUrl" type="url" placeholder="https://github.com/…" /></label>
            <div class="admin-form-actions admin-field-wide">
              <button class="admin-primary" type="submit">Save project</button>
              <button type="button" data-admin-clear="project">New project</button>
              <button class="admin-danger" id="admin-delete-project" type="button" hidden>Delete</button>
            </div>
          </form>
        </section>

        <section class="admin-section" data-admin-section="faq" hidden>
          <div class="admin-section-heading">
            <h3>FAQ</h3>
            <p>Drag questions up or down to update their order on the website.</p>
          </div>
          <div class="admin-list" id="admin-faq-list"></div>
          <form id="admin-faq-form" class="admin-form admin-entry-form">
            <input name="index" type="hidden" />
            <label class="admin-field-wide">Question<input name="question" required /></label>
            <label class="admin-field-wide">Answer<textarea name="answer" rows="5" required></textarea></label>
            <div class="admin-form-actions admin-field-wide">
              <button class="admin-primary" type="submit">Save FAQ</button>
              <button type="button" data-admin-clear="faq">New question</button>
              <button class="admin-danger" id="admin-delete-faq" type="button" hidden>Delete</button>
            </div>
          </form>
        </section>
      </div>

      <footer class="admin-footer">
        <span class="admin-resize-hint" aria-hidden="true">Drag corner to resize ↘</span>
        <button id="admin-save-preview" type="button">Save preview <small>(memory only)</small></button>
        <button class="admin-write" id="admin-write-code" type="button">Write changes to code</button>
      </footer>
    </section>

    <aside class="admin-weather-dock" id="admin-weather-dock" data-dock-side="left" aria-label="Admin weather controls">
      <header class="admin-weather-handle" data-admin-weather-handle>
        <span class="admin-weather-grip" aria-hidden="true">⠿</span>
        <div><small>Atmosphere</small><strong id="admin-weather-current">Storm</strong></div>
        <span>Drag to dock</span>
      </header>
      <div class="admin-weather-options" role="group" aria-label="Default weather">
        <button type="button" data-admin-weather="storm"><span aria-hidden="true">☾</span><small>Storm</small></button>
        <button type="button" data-admin-weather="day"><span aria-hidden="true">●</span><small>Day</small></button>
        <button type="button" data-admin-weather="clear-night"><span aria-hidden="true">☽</span><small>Half moon</small></button>
        <button type="button" data-admin-weather="sunset"><span aria-hidden="true">◉</span><small>Sunset</small></button>
      </div>
    </aside>

    <div class="admin-toast" id="admin-toast" role="status" aria-live="polite"></div>
  `;
  document.body.appendChild(shell);

  const content = api.getContent();
  if (!Array.isArray(content.projectSections)) content.projectSections = [];

  const launcher = shell.querySelector("#admin-launcher");
  const panel = shell.querySelector("#admin-panel");
  const panelHandle = shell.querySelector("[data-admin-panel-handle]");
  const closeButton = shell.querySelector("#admin-close");
  const inlineButton = shell.querySelector("#admin-inline-toggle");
  const dirtyStatus = shell.querySelector("#admin-dirty-status");
  const overviewForm = shell.querySelector("#admin-overview-form");
  const experienceForm = shell.querySelector("#admin-experience-form");
  const sectionForm = shell.querySelector("#admin-project-section-form");
  const projectForm = shell.querySelector("#admin-project-form");
  const faqForm = shell.querySelector("#admin-faq-form");
  const experienceList = shell.querySelector("#admin-experience-list");
  const sectionList = shell.querySelector("#admin-project-section-list");
  const projectList = shell.querySelector("#admin-project-list");
  const faqList = shell.querySelector("#admin-faq-list");
  const deleteExperienceButton = shell.querySelector("#admin-delete-experience");
  const deleteSectionButton = shell.querySelector("#admin-delete-section");
  const deleteProjectButton = shell.querySelector("#admin-delete-project");
  const deleteFaqButton = shell.querySelector("#admin-delete-faq");
  const savePreviewButton = shell.querySelector("#admin-save-preview");
  const writeCodeButton = shell.querySelector("#admin-write-code");
  const weatherDock = shell.querySelector("#admin-weather-dock");
  const weatherHandle = shell.querySelector("[data-admin-weather-handle]");
  const weatherCurrent = shell.querySelector("#admin-weather-current");
  const toast = shell.querySelector("#admin-toast");
  let inlineEditing = false;
  let dirty = false;
  let toastTimer;
  let dragState = null;

  function showToast(message, isError = false) {
    toast.textContent = message;
    toast.classList.toggle("is-error", isError);
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3400);
  }

  function setDirty(nextDirty = true) {
    dirty = nextDirty;
    dirtyStatus.textContent = dirty ? "Edits are only in memory" : "Code matches this preview";
    dirtyStatus.classList.toggle("is-dirty", dirty);
  }

  function populateOverview() {
    overviewForm.querySelectorAll("[data-admin-field]").forEach((field) => {
      field.value = getValueByPath(api.getContent(), field.dataset.adminField) ?? "";
    });
  }

  function saveOverviewToMemory() {
    overviewForm.querySelectorAll("[data-admin-field]").forEach((field) => {
      api.setContentValue(field.dataset.adminField, field.value.trim());
    });
  }

  function populateProjectSectionOptions(preferredValue = "") {
    const select = projectForm.elements.group;
    const currentValue = preferredValue || select.value;
    select.replaceChildren();

    api.getContent().projectSections.forEach((section) => {
      const option = document.createElement("option");
      option.value = section.id;
      option.textContent = `${section.eyebrow} · ${section.title}`;
      select.appendChild(option);
    });

    if (Array.from(select.options).some((option) => option.value === currentValue)) {
      select.value = currentValue;
    }
  }

  function renderExperienceList() {
    experienceList.replaceChildren();
    const entries = api.getContent().experience;

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "admin-empty";
      empty.textContent = "No experience entry yet. Use the form below when you are ready.";
      experienceList.appendChild(empty);
      return;
    }

    entries.forEach((entry, index) => {
      experienceList.appendChild(
        createListCard({
          title: entry.role,
          meta: [entry.company, entry.dates].filter(Boolean).join(" · "),
          index,
          type: "experience",
        }),
      );
    });
  }

  function renderSectionList() {
    sectionList.replaceChildren();
    api.getContent().projectSections.forEach((section, index) => {
      const count = api.getContent().projects.filter((project) => project.group === section.id).length;
      sectionList.appendChild(
        createListCard({
          title: section.title,
          meta: `${section.eyebrow} · ${count} project${count === 1 ? "" : "s"}`,
          index,
          type: "section",
          draggable: true,
        }),
      );
    });
  }

  function renderProjectList() {
    projectList.replaceChildren();
    const projects = api.getContent().projects;

    api.getContent().projectSections.forEach((section) => {
      const group = document.createElement("section");
      const heading = document.createElement("header");
      const title = document.createElement("strong");
      const count = document.createElement("span");
      const items = document.createElement("div");
      const sectionProjects = projects.filter((project) => project.group === section.id);

      group.className = "admin-project-group";
      group.dataset.adminProjectDropGroup = section.id;
      title.textContent = section.title;
      count.textContent = `${sectionProjects.length}`;
      items.className = "admin-list";
      heading.append(title, count);
      group.append(heading, items);

      if (!sectionProjects.length) {
        const empty = document.createElement("p");
        empty.className = "admin-empty admin-drop-empty";
        empty.textContent = "Drop a project here";
        items.appendChild(empty);
      }

      sectionProjects.forEach((project) => {
        const index = projects.indexOf(project);
        items.appendChild(
          createListCard({
            title: project.title,
            meta: project.date || "No date",
            index,
            type: "project",
            draggable: true,
            favorite: Boolean(project.favorite),
          }),
        );
      });
      projectList.appendChild(group);
    });
  }

  function renderFaqList() {
    faqList.replaceChildren();
    api.getContent().faq.forEach((item, index) => {
      faqList.appendChild(
        createListCard({
          title: item.question,
          meta: item.answer,
          index,
          type: "faq",
          draggable: true,
        }),
      );
    });
  }

  function clearExperienceForm() {
    experienceForm.reset();
    experienceForm.elements.index.value = "";
    deleteExperienceButton.hidden = true;
  }

  function clearSectionForm() {
    sectionForm.reset();
    sectionForm.elements.index.value = "";
    deleteSectionButton.hidden = true;
  }

  function clearProjectForm() {
    projectForm.reset();
    projectForm.elements.index.value = "";
    populateProjectSectionOptions(api.getContent().projectSections[0]?.id || "");
    deleteProjectButton.hidden = true;
  }

  function clearFaqForm() {
    faqForm.reset();
    faqForm.elements.index.value = "";
    deleteFaqButton.hidden = true;
  }

  function editExperience(index) {
    const entry = api.getContent().experience[index];
    if (!entry) return;
    const form = experienceForm.elements;

    form.index.value = String(index);
    form.role.value = entry.role || "";
    form.company.value = entry.company || "";
    form.employmentType.value = entry.employmentType || "";
    form.dates.value = entry.dates || "";
    form.location.value = entry.location || "";
    form.description.value = entry.description || "";
    form.responsibilities.value = (entry.responsibilities || []).join("\n");
    form.technologies.value = (entry.technologies || []).join(", ");
    form.current.checked = Boolean(entry.current);
    deleteExperienceButton.hidden = false;
    experienceForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function editSection(index) {
    const section = api.getContent().projectSections[index];
    if (!section) return;
    sectionForm.elements.index.value = String(index);
    sectionForm.elements.eyebrow.value = section.eyebrow || "";
    sectionForm.elements.title.value = section.title || "";
    deleteSectionButton.hidden = false;
    sectionForm.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function editProject(index) {
    const project = api.getContent().projects[index];
    if (!project) return;
    const form = projectForm.elements;

    populateProjectSectionOptions(project.group);
    form.index.value = String(index);
    form.title.value = project.title || "";
    form.date.value = project.date || "";
    form.group.value = project.group || api.getContent().projectSections[0]?.id || "";
    form.technologies.value = (project.technologies || []).join(", ");
    form.description.value = project.description || "";
    form.liveUrl.value = project.liveUrl || "";
    form.repoUrl.value = project.repoUrl || "";
    form.favorite.checked = Boolean(project.favorite);
    deleteProjectButton.hidden = false;
    projectForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function editFaq(index) {
    const item = api.getContent().faq[index];
    if (!item) return;
    faqForm.elements.index.value = String(index);
    faqForm.elements.question.value = item.question || "";
    faqForm.elements.answer.value = item.answer || "";
    deleteFaqButton.hidden = false;
    faqForm.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function applyInlineEditing() {
    document.body.classList.toggle("admin-inline-editing", inlineEditing);
    document.querySelectorAll("[data-admin-path]").forEach((element) => {
      element.contentEditable = inlineEditing ? "true" : "false";
      element.spellcheck = inlineEditing;
    });
    inlineButton.setAttribute("aria-pressed", String(inlineEditing));
    inlineButton.textContent = inlineEditing ? "Stop editing page text" : "Edit text on page";
  }

  function syncWeatherButtons(mode = api.getWeather()) {
    shell.querySelectorAll("[data-admin-weather]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.adminWeather === mode));
    });
    weatherCurrent.textContent = api.weatherModes[mode]?.label || mode;
  }

  function refreshAdminLists() {
    const selectedProjectGroup = projectForm.elements.group.value;
    renderExperienceList();
    renderSectionList();
    renderProjectList();
    renderFaqList();
    populateProjectSectionOptions(selectedProjectGroup);
    applyInlineEditing();
  }

  function refreshContent(message) {
    api.renderContent();
    refreshAdminLists();
    setDirty();
    if (message) showToast(message);
  }

  function openPanel() {
    panel.classList.add("is-open");
    panel.setAttribute("aria-hidden", "false");
    launcher.setAttribute("aria-expanded", "true");
    launcher.hidden = true;
  }

  function closePanel({ restoreFocus = true } = {}) {
    panel.classList.remove("is-open");
    panel.setAttribute("aria-hidden", "true");
    launcher.setAttribute("aria-expanded", "false");
    launcher.hidden = false;
    if (restoreFocus) launcher.focus();
  }

  function clearDropIndicators() {
    shell.querySelectorAll(".is-drop-before, .is-drop-after, .is-drop-zone").forEach((element) => {
      element.classList.remove("is-drop-before", "is-drop-after", "is-drop-zone");
    });
  }

  function makePanelDraggable() {
    let pointerState = null;

    panelHandle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0 || event.target.closest("button, input, textarea, select, a")) return;
      const rect = panel.getBoundingClientRect();
      pointerState = {
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      panel.style.left = `${rect.left}px`;
      panel.style.top = `${rect.top}px`;
      panel.classList.add("is-dragging");
      panelHandle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    panelHandle.addEventListener("pointermove", (event) => {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      panel.style.left = `${clamp(event.clientX - pointerState.offsetX, 12, window.innerWidth - panel.offsetWidth - 12)}px`;
      panel.style.top = `${clamp(event.clientY - pointerState.offsetY, 12, window.innerHeight - panel.offsetHeight - 12)}px`;
    });

    function finishPanelDrag(event) {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      pointerState = null;
      panel.classList.remove("is-dragging");
      if (panelHandle.hasPointerCapture(event.pointerId)) panelHandle.releasePointerCapture(event.pointerId);
    }

    panelHandle.addEventListener("pointerup", finishPanelDrag);
    panelHandle.addEventListener("pointercancel", finishPanelDrag);

    const keepPanelInViewport = () => {
      const rect = panel.getBoundingClientRect();
      panel.style.left = `${clamp(rect.left, 12, window.innerWidth - rect.width - 12)}px`;
      panel.style.top = `${clamp(rect.top, 12, window.innerHeight - rect.height - 12)}px`;
    };
    new ResizeObserver(keepPanelInViewport).observe(panel);
    window.addEventListener("resize", keepPanelInViewport);
  }

  function makeWeatherDockDraggable() {
    let pointerState = null;

    function dockWeather(side) {
      weatherDock.dataset.dockSide = side;
      weatherDock.style.top = "auto";
      weatherDock.style.bottom = "18px";
      weatherDock.style.left = side === "left" ? "18px" : "auto";
      weatherDock.style.right = side === "right" ? "18px" : "auto";
      weatherDock.classList.remove("is-dragging");
    }

    weatherHandle.addEventListener("pointerdown", (event) => {
      if (event.button !== 0) return;
      const rect = weatherDock.getBoundingClientRect();
      pointerState = {
        pointerId: event.pointerId,
        offsetX: event.clientX - rect.left,
        offsetY: event.clientY - rect.top,
      };
      weatherDock.style.left = `${rect.left}px`;
      weatherDock.style.top = `${rect.top}px`;
      weatherDock.style.right = "auto";
      weatherDock.style.bottom = "auto";
      weatherDock.classList.add("is-dragging");
      weatherHandle.setPointerCapture(event.pointerId);
      event.preventDefault();
    });

    weatherHandle.addEventListener("pointermove", (event) => {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      weatherDock.style.left = `${clamp(event.clientX - pointerState.offsetX, 10, window.innerWidth - weatherDock.offsetWidth - 10)}px`;
      weatherDock.style.top = `${clamp(event.clientY - pointerState.offsetY, 10, window.innerHeight - weatherDock.offsetHeight - 10)}px`;
    });

    function finishWeatherDrag(event) {
      if (!pointerState || event.pointerId !== pointerState.pointerId) return;
      const rect = weatherDock.getBoundingClientRect();
      const dockCenter = rect.left + rect.width / 2;
      const side = dockCenter < window.innerWidth / 2 ? "left" : "right";
      pointerState = null;
      if (weatherHandle.hasPointerCapture(event.pointerId)) weatherHandle.releasePointerCapture(event.pointerId);
      dockWeather(side);
    }

    weatherHandle.addEventListener("pointerup", finishWeatherDrag);
    weatherHandle.addEventListener("pointercancel", finishWeatherDrag);
    window.addEventListener("resize", () => dockWeather(weatherDock.dataset.dockSide || "left"));
    dockWeather("left");
  }

  launcher.addEventListener("click", openPanel);
  closeButton.addEventListener("click", closePanel);

  shell.querySelectorAll("[data-admin-tab]").forEach((tab) => {
    tab.addEventListener("click", () => {
      shell.querySelectorAll("[data-admin-tab]").forEach((item) => {
        item.setAttribute("aria-selected", String(item === tab));
      });
      shell.querySelectorAll("[data-admin-section]").forEach((section) => {
        const active = section.dataset.adminSection === tab.dataset.adminTab;
        section.hidden = !active;
        section.classList.toggle("is-active", active);
      });
    });
  });

  inlineButton.addEventListener("click", () => {
    inlineEditing = !inlineEditing;
    applyInlineEditing();
    showToast(inlineEditing ? "Click highlighted website text to edit it." : "Inline editing stopped.");
  });

  document.addEventListener(
    "click",
    (event) => {
      if (!inlineEditing || !event.target.closest("[data-admin-path]")) return;
      event.stopPropagation();
      if (event.target.closest("a")) event.preventDefault();
    },
    true,
  );

  document.addEventListener("input", (event) => {
    const editable = event.target.closest("[data-admin-path][contenteditable='true']");
    if (!editable) return;
    const path = editable.dataset.adminPath;
    const value = editable.innerText.replace(/\u00a0/g, " ").trim();
    api.setContentValue(path, value);
    const matchingOverviewField = Array.from(overviewForm.querySelectorAll("[data-admin-field]")).find(
      (field) => field.dataset.adminField === path,
    );
    if (matchingOverviewField) matchingOverviewField.value = value;
    setDirty();
  });

  document.addEventListener("portfolio:contentrender", applyInlineEditing);
  document.addEventListener("portfolio:weatherchange", (event) => syncWeatherButtons(event.detail.mode));
  overviewForm.addEventListener("input", () => setDirty());

  shell.addEventListener("click", (event) => {
    const favoriteButton = event.target.closest("[data-admin-favorite-index]");
    if (favoriteButton) {
      const project = api.getContent().projects[Number(favoriteButton.dataset.adminFavoriteIndex)];
      if (!project) return;
      project.favorite = !project.favorite;
      refreshContent(project.favorite ? "Favourite badge added." : "Favourite badge removed.");
      return;
    }

    const editButton = event.target.closest("[data-admin-edit-type]");
    if (!editButton) return;
    const index = Number(editButton.dataset.adminEditIndex);
    if (editButton.dataset.adminEditType === "experience") editExperience(index);
    if (editButton.dataset.adminEditType === "section") editSection(index);
    if (editButton.dataset.adminEditType === "project") editProject(index);
    if (editButton.dataset.adminEditType === "faq") editFaq(index);
  });

  shell.addEventListener("dragstart", (event) => {
    const handle = event.target.closest("[data-admin-drag-source]");
    const card = handle?.closest("[data-admin-item-type]");
    if (!card) return;
    dragState = {
      type: card.dataset.adminItemType,
      index: Number(card.dataset.adminItemIndex),
    };
    card.classList.add("is-dragging");
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", `${dragState.type}:${dragState.index}`);
  });

  shell.addEventListener("dragover", (event) => {
    if (!dragState) return;
    clearDropIndicators();
    const targetCard = event.target.closest("[data-admin-item-type]");
    const projectGroup = event.target.closest("[data-admin-project-drop-group]");

    if (targetCard?.dataset.adminItemType === dragState.type) {
      event.preventDefault();
      const rect = targetCard.getBoundingClientRect();
      targetCard.classList.add(event.clientY > rect.top + rect.height / 2 ? "is-drop-after" : "is-drop-before");
      return;
    }

    if (dragState.type === "project" && projectGroup) {
      event.preventDefault();
      projectGroup.classList.add("is-drop-zone");
    }
  });

  shell.addEventListener("drop", (event) => {
    if (!dragState) return;
    event.preventDefault();
    const targetCard = event.target.closest("[data-admin-item-type]");
    const projectGroup = event.target.closest("[data-admin-project-drop-group]");
    let changed = false;

    if (targetCard?.dataset.adminItemType === dragState.type) {
      const targetIndex = Number(targetCard.dataset.adminItemIndex);
      const rect = targetCard.getBoundingClientRect();
      const placeAfter = event.clientY > rect.top + rect.height / 2;

      if (dragState.type === "faq") {
        changed = reorderAroundTarget(api.getContent().faq, dragState.index, targetIndex, placeAfter);
      } else if (dragState.type === "section") {
        changed = reorderAroundTarget(
          api.getContent().projectSections,
          dragState.index,
          targetIndex,
          placeAfter,
        );
      } else if (dragState.type === "project") {
        const projects = api.getContent().projects;
        const source = projects[dragState.index];
        const target = projects[targetIndex];
        if (source && target && source !== target) {
          source.group = target.group;
          changed = reorderAroundTarget(projects, dragState.index, targetIndex, placeAfter);
        }
      }
    } else if (dragState.type === "project" && projectGroup) {
      const projects = api.getContent().projects;
      const source = projects[dragState.index];
      if (source) {
        projects.splice(dragState.index, 1);
        source.group = projectGroup.dataset.adminProjectDropGroup;
        const lastGroupIndex = projects.reduce(
          (lastIndex, project, index) => (project.group === source.group ? index : lastIndex),
          -1,
        );
        projects.splice(lastGroupIndex + 1, 0, source);
        changed = true;
      }
    }

    dragState = null;
    clearDropIndicators();
    shell.querySelectorAll(".is-dragging").forEach((element) => element.classList.remove("is-dragging"));
    if (changed) refreshContent("Order updated in the in-memory preview.");
  });

  shell.addEventListener("dragend", () => {
    dragState = null;
    clearDropIndicators();
    shell.querySelectorAll(".is-dragging").forEach((element) => element.classList.remove("is-dragging"));
  });

  experienceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = experienceForm.elements;
    const index = form.index.value === "" ? -1 : Number(form.index.value);
    const entry = {
      id: index >= 0 ? api.getContent().experience[index].id : `experience-${Date.now().toString(36)}`,
      role: form.role.value.trim(),
      company: form.company.value.trim(),
      employmentType: form.employmentType.value.trim(),
      dates: form.dates.value.trim(),
      location: form.location.value.trim(),
      description: form.description.value.trim(),
      responsibilities: normalizeLines(form.responsibilities.value),
      technologies: normalizeCommaList(form.technologies.value),
      current: form.current.checked,
    };
    if (index >= 0) api.getContent().experience[index] = entry;
    else api.getContent().experience.push(entry);
    clearExperienceForm();
    refreshContent("Experience saved to the in-memory preview.");
  });

  sectionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const sections = api.getContent().projectSections;
    const form = sectionForm.elements;
    const index = form.index.value === "" ? -1 : Number(form.index.value);
    let id = index >= 0 ? sections[index].id : slugify(form.title.value);

    if (index < 0) {
      const baseId = id;
      let suffix = 2;
      while (sections.some((section) => section.id === id)) {
        id = `${baseId}-${suffix}`;
        suffix += 1;
      }
    }

    const section = {
      id,
      eyebrow: form.eyebrow.value.trim(),
      title: form.title.value.trim(),
    };
    if (index >= 0) sections[index] = section;
    else sections.push(section);
    clearSectionForm();
    refreshContent("Project section saved.");
  });

  projectForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = projectForm.elements;
    const index = form.index.value === "" ? -1 : Number(form.index.value);
    const existingId = index >= 0 ? api.getContent().projects[index].id : "";
    const project = {
      id: existingId || `${slugify(form.title.value)}-${Date.now().toString(36)}`,
      group: form.group.value,
      technologies: normalizeCommaList(form.technologies.value),
      date: form.date.value.trim(),
      title: form.title.value.trim(),
      description: form.description.value.trim(),
      liveUrl: form.liveUrl.value.trim(),
      repoUrl: form.repoUrl.value.trim(),
      favorite: form.favorite.checked,
    };
    if (index >= 0) api.getContent().projects[index] = project;
    else api.getContent().projects.push(project);
    clearProjectForm();
    refreshContent("Project saved to the in-memory preview.");
  });

  faqForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const form = faqForm.elements;
    const index = form.index.value === "" ? -1 : Number(form.index.value);
    const item = {
      question: form.question.value.trim(),
      answer: form.answer.value.trim(),
    };
    if (index >= 0) api.getContent().faq[index] = item;
    else api.getContent().faq.push(item);
    clearFaqForm();
    refreshContent("FAQ saved to the in-memory preview.");
  });

  deleteExperienceButton.addEventListener("click", () => {
    const rawIndex = experienceForm.elements.index.value;
    if (rawIndex === "" || !window.confirm("Delete this experience entry from the preview?")) return;
    api.getContent().experience.splice(Number(rawIndex), 1);
    clearExperienceForm();
    refreshContent("Experience removed from the preview.");
  });

  deleteSectionButton.addEventListener("click", () => {
    const rawIndex = sectionForm.elements.index.value;
    if (rawIndex === "") return;
    const section = api.getContent().projectSections[Number(rawIndex)];
    const hasProjects = api.getContent().projects.some((project) => project.group === section?.id);
    if (hasProjects) {
      showToast("Move or delete the projects in this section before deleting the folder.", true);
      return;
    }
    if (!window.confirm(`Delete the “${section.title}” section?`)) return;
    api.getContent().projectSections.splice(Number(rawIndex), 1);
    clearSectionForm();
    clearProjectForm();
    refreshContent("Project section removed.");
  });

  deleteProjectButton.addEventListener("click", () => {
    const rawIndex = projectForm.elements.index.value;
    if (rawIndex === "" || !window.confirm("Delete this project from the preview?")) return;
    api.getContent().projects.splice(Number(rawIndex), 1);
    clearProjectForm();
    refreshContent("Project removed from the preview.");
  });

  deleteFaqButton.addEventListener("click", () => {
    const rawIndex = faqForm.elements.index.value;
    if (rawIndex === "" || !window.confirm("Delete this FAQ item from the preview?")) return;
    api.getContent().faq.splice(Number(rawIndex), 1);
    clearFaqForm();
    refreshContent("FAQ removed from the preview.");
  });

  shell.querySelectorAll("[data-admin-clear]").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.adminClear === "experience") clearExperienceForm();
      if (button.dataset.adminClear === "section") clearSectionForm();
      if (button.dataset.adminClear === "project") clearProjectForm();
      if (button.dataset.adminClear === "faq") clearFaqForm();
    });
  });

  shell.querySelectorAll("[data-admin-weather]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.adminWeather;
      api.getContent().settings.defaultWeather = mode;
      api.setWeather(mode);
      syncWeatherButtons(mode);
      setDirty();
      showToast(`${api.weatherModes[mode].label} is now the default atmosphere.`);
    });
  });

  savePreviewButton.addEventListener("click", () => {
    saveOverviewToMemory();
    api.renderContent();
    refreshAdminLists();
    setDirty();
    showToast("Preview saved in memory. Write it to code before refreshing.");
  });

  writeCodeButton.addEventListener("click", async () => {
    saveOverviewToMemory();
    api.renderContent();
    const contentForCode = structuredClone(api.getContent());
    // GitHub-managed projects are regenerated by the workflow. Keep them out
    // of the handwritten source when the local admin writes this file.
    contentForCode.projects = contentForCode.projects.filter(
      (project) => !project.isGitHubManaged,
    );
    const fileText = `/* Generated by the local Portfolio Admin. */\nwindow.PORTFOLIO_CONTENT = ${JSON.stringify(
      contentForCode,
      null,
      2,
    )};\n`;

    writeCodeButton.disabled = true;
    writeCodeButton.textContent = "Choose Portfolio folder…";
    try {
      if ("showDirectoryPicker" in window) {
        const root = await window.showDirectoryPicker({ mode: "readwrite" });
        try {
          await root.getFileHandle("index.html");
        } catch {
          throw new Error("Choose the Portfolio folder that directly contains index.html.");
        }
        const scriptDirectory = await root.getDirectoryHandle("script", { create: true });
        const contentFile = await scriptDirectory.getFileHandle("portfolio-content.js", { create: true });
        const writable = await contentFile.createWritable();
        await writable.write(fileText);
        await writable.close();
        setDirty(false);
        showToast("Code updated: script/portfolio-content.js is ready to commit.");
      } else {
        downloadContentFile(fileText);
        showToast("Downloaded portfolio-content.js. Replace the copy inside your script folder.");
      }
    } catch (error) {
      if (error?.name !== "AbortError") showToast(error.message || "Could not write the content file.", true);
    } finally {
      writeCodeButton.disabled = false;
      writeCodeButton.textContent = "Write changes to code";
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && panel.classList.contains("is-open")) closePanel();
  });

  populateOverview();
  clearExperienceForm();
  clearSectionForm();
  clearProjectForm();
  clearFaqForm();
  refreshAdminLists();
  syncWeatherButtons();
  makePanelDraggable();
  makeWeatherDockDraggable();
  setDirty(false);
  closePanel({ restoreFocus: false });
}
