# Portfolio

Welcome to my portfolio.
This project showcases my work, skills, and ongoing development as a frontend developer.

## About

This portfolio serves as a digital resume, presenting my projects and experiments in a clear and structured way.
It is designed to demonstrate both my technical abilities and attention to detail in building user interfaces.

The project is built using core web technologies without frameworks, allowing full control over structure, styling, and behavior.

## Features

* Responsive design optimized for different screen sizes
* Project showcases with descriptions and external links
* Light/Dark mode toggle for accessibility and personalization
* Interactive elements such as hover effects and smooth animations
* Focus on clean UI and consistent visual experience
* Local-only content admin that writes approved edits back to the source file

## Technologies Used

* HTML5
* SCSS (CSS3)
* JavaScript
* Git & GitHub

## Project Structure

The project is organized in a simple and scalable way:

* `index.html` – main structure
* `style/` – SCSS and compiled CSS files
* `script/` – JavaScript logic and editable portfolio content
* `assets/` – images and static resources

## Local Admin

Run the portfolio locally and add `?admin=1` to the URL to edit content and weather settings. See [ADMIN.md](./ADMIN.md) for the complete workflow and privacy details.

## Live Demo

A live version of the portfolio can be viewed at:
https://gxella.github.io/Portfolio/

## Accessibility Warning

This portfolio includes animations, dark color schemes, and visual effects such as rain and flashes.
These elements may not be suitable for individuals with photosensitivity or similar sensitivities.
Please proceed with caution if you are affected by such effects.

## Contact Information

Feel free to reach out:

- **Email**: g.xelashvili2001@gmail.com
- **LinkedIn**: [LinkedIn: Giorgi Khelashvili](https://linkedin.com/in/giorgi-khelashvili-701978248)

---

This project reflects continuous learning, experimentation, and incremental improvement in frontend development.

## Theme and PDF maintenance

Install development tools with `npm ci`. Compile SCSS with `npm run build:css` after changing styles.

FAQ → **Open portfolio PDF** opens an A4 preview with a **Save as PDF** button.
Choose Save as PDF in the browser's print dialog. The preview receives the website's current
content and updates when local admin changes are applied, including new Experience entries,
selected projects, education, and contacts. The PDF omits FAQ answers and empty Experience placeholders.
It features at most three projects: favorites first, then Motion Shelf, Idle Loader, and Angular E-shop
to fill remaining places. Mark a project as Favourite to prioritize it. Known descriptions are polished
for the PDF; newly edited wording appears as written. Page count grows when Experience content is added.
Saved PDF files are snapshots; open the FAQ option again to export a newer copy.
The same PDF preview link appears after Experience when entries have been added; the empty placeholder stays unchanged.

Opened directly, `portfolio-print.html` renders from `script/portfolio-content.js`.
For an optional checked-in snapshot, generate `assets/portfolio.pdf` with `npm run build:pdf` after installing Chromium with
`npx playwright install chromium`. Alternatively, point `CHROME_PATH` at an installed Chrome executable.
The document uses an original black-and-white A4 layout with a muted teal accent, a dark nameplate,
a contact/toolkit sidebar, and numbered project entries. Contact and project links remain clickable.
The current content fits one page; longer experience content flows onto additional pages.
Both the preview print styles and snapshot generator preserve background colors in the PDF.

The FAQ preview needs no manual PDF rebuild. Regenerate the optional snapshot after major changes
and inspect page breaks before committing it. The website continues to use the local desktop admin at `?admin=1`.

## Weather verification

Rain now targets the splash's visible top border, measured from its layout, rather than the viewport bottom.
The existing splash animation and timing are unchanged. Chrome geometry checks across 25 drops and five
viewport sizes measured zero horizontal streak offset and less than 0.02px vertical error. A simulated
two-core device with 6× CPU throttling stayed within the 12-particle cap. These checks do not replace
testing on older physical devices. Safari automation was unavailable because “Allow remote automation”
is disabled; Safari and phone checks remain in `Ideas.md`.
