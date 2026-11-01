// Keep open print previews in sync with the content currently shown on the site,
// including local admin previews that have not been written to disk yet.
(() => {
  const previews = new Set();
  const targetOrigin = location.origin === "null" ? "*" : location.origin;
  function updatePreview(preview) {
    if (preview.closed) { previews.delete(preview); return; }
    preview.postMessage({ type: "portfolio:pdf-content", content: portfolioContent }, targetOrigin);
  }
  document.addEventListener("click", event => {
    const link = event.target.closest?.("[data-portfolio-pdf]");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
    const preview = window.open(link.href, "_blank");
    if (!preview) return; // Keep the normal link fallback if popups are blocked.
    event.preventDefault();
    previews.add(preview);
  });
  window.addEventListener("message", event => {
    if (event.origin !== location.origin || !previews.has(event.source)) return;
    if (event.data?.type === "portfolio:pdf-ready") updatePreview(event.source);
  });
  document.addEventListener("portfolio:contentrender", () => previews.forEach(updatePreview));
})();
