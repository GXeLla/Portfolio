# Local Portfolio Admin

The admin panel is deliberately available only while the portfolio is running on your own computer. Normal visitors to the deployed GitHub Pages site cannot open it.

## Open It on Your Mac

1. Open the `Portfolio` folder in VS Code.
2. Start the site with Live Server or another local web server.
3. Add `?admin=1` to the local URL. For example:

   `http://127.0.0.1:5500/?admin=1`

   If Live Server includes a folder in the address, keep that folder and add the query at the end.
4. Open the URL in a desktop window at least 1024px wide. The Portfolio Admin starts closed; click the **Admin** button in the upper-right corner when you want to open it.

The editor is desktop-only. It is intentionally not created on phones or narrow tablet windows.

## Edit and Save

- Use **Overview** for your name, role, introduction, contact details, opinion text, and certificate.
- Use **Experience**, **Projects**, and **FAQ** to add, edit, or remove entries.
- Drag the admin window by its header and resize it from its lower-right corner.
- In **Projects**, drag folders to change their public order. Drag projects between folders to reorder or recategorize them.
- Use **New section** to create another public project folder. Every five folders become one project page.
- Click the star beside a project to add or remove its Favourite badge without creating a separate Favourite section.
- Drag FAQ cards to change their public order.
- Use the separate weather dock at the bottom to preview a mode and choose the default atmosphere.
- Drag the weather dock across the screen. Releasing it left of the exact screen centre docks it bottom-left; otherwise it docks bottom-right.
- Turn on **Edit text on page** to click and edit supported text directly in the portfolio preview.
- **Save preview (memory only)** updates the current preview. Refreshing or closing the tab discards changes that have not been written.
- **Write changes to code** asks you to select the exact `Portfolio` project folder, validates it, and writes `script/portfolio-content.js`.
- Review that changed file, test the site, and then commit and push it normally with Git.

Chrome or Edge supports direct folder writing. If the browser does not support it, the panel downloads a replacement `portfolio-content.js`; move that file into the project's `script` folder.

## Privacy and Storage

- The admin module is not loaded on the public site, even if someone adds `?admin=1` there.
- It does not use `localStorage` or `sessionStorage`.
- Unsaved changes exist only in the current page memory.
- Direct writing happens only after you choose the project folder in the browser's protected folder picker.

This is a safe local editing workflow for a static portfolio. A true online admin that only one account can access would require server-side authentication; a password placed in public JavaScript would not be secure.
