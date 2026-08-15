# Portfolio Roadmap

Last updated: 2026-08-15

Only unfinished work is kept here. Finished improvements are represented by the code and commit history.

## In Progress

### Complete the Experience / Workplace Content

The section and admin editor are ready, but the real content still needs to be written.

- Add the company or workplace name.
- Add the position, employment type, dates, and location or remote status.
- Write a short role description and the main responsibilities.
- Add technologies, achievements, and what was learned.
- Keep the current placeholder until the information is ready to publish.

### Polish Light Mode

- Introduce shared theme variables for surfaces, text, borders, highlights, and shadows.
- Improve contrast in navigation, project cards, Experience, FAQ, Contacts, and the project modal.
- Refine the light glass effect and reduce overly bright borders.
- Balance the sun glow so nearby content stays readable.
- Check keyboard focus and text contrast in every section.
- Test the complete theme on desktop and mobile.

### Fine-Tune Weather on Real Devices

- Test rain landing and splash timing on Safari, Chrome, and mobile devices.
- Reduce particle quantity automatically on slower devices if needed.
- Verify the four-mode click cycle after viewport rotation and resizing.
- Keep reduced-motion behavior calm and usable.

## Planned

### Add a PDF Version of the Portfolio

- Create a clean one- or two-page A4 layout.
- Include the introduction, skills, experience, education, certification, selected projects, and contacts.
- Add clickable project, GitHub, LinkedIn, and live-portfolio links.
- Keep the PDF readable in black and white and use a body font suited to numbers.
- Add a Download Portfolio PDF button after the Experience content is final.
- Keep the PDF updated when major project or experience information changes.

### Optional Remote Admin in the Future

The current editor is intentionally local-only and writes to the project source. A remotely available admin would require real authentication and a backend or a carefully scoped GitHub integration.

- Choose a hosting/backend solution.
- Add authenticated access and server-side authorization.
- Validate and sanitize all edits server-side.
- Keep an audit or version history and a safe rollback path.

## Suggested Order

1. Write and approve the Experience content.
2. Finish the light-mode polish.
3. Test and fine-tune weather on real devices.
4. Create the PDF.
5. Consider a remote admin only if editing away from the local project becomes necessary.
