# Automatic seasonal themes

The public portfolio has no theme picker. Dates use each visitor's local calendar and recur every year, including the entire final day:

- Halloween: October 20 through November 3. Amber Moon or Silver Mist.
- Christmas: December 20 through January 20 of the following year. Snow or Fireside.
- All other dates: the original portfolio.

A first visit in each annual event chooses either style with equal probability. The choice is saved in localStorage for that browser and annual event. On later page loads there is a 25% chance of switching to the other style and a 75% chance of retaining it. This averages 2–3 switches per ten refreshes; it is probabilistic, not a quota. An open page does not reroll on focus or midnight. It does reconcile event boundaries at local midnight and when returning to the tab.

Blocked storage still permits random event selection. If scene images fail to decode, the original scene and loader are restored. Original weather controls, content tabs and loading text remain shared. Seasonal loading illustrations replace only the rain-cloud illustration. Motion respects reduced-motion preferences and pauses while the tab is hidden.

## Files and assets

`script/seasonal-calendar.js` contains dates and selection rules; `script/seasonal.js` handles storage and scheduling. `script/seasonal-effects.js` and `style/seasonal.css` render the scene. `script/seasonal-loader.js` and `style/seasonal-loader.css` provide the themed intro.

`images/seasons/` contains four styles, each with desktop, portrait and transparent foreground WebP layers. The exports are lossless WebP at 3840×2160 (desktop/foreground) and 1290×2796 (portrait). They are resampled from smaller generated originals, not native 4K detail. Generation prompts and source/export dimensions are recorded in `seasonal-assets.json`. Unpublished design studio files and PNG masters remain excluded from Git.

## Validation

Run the local server at port 8864, then:

```sh
node script/check-seasonal-calendar.cjs
node script/check-seasonal.cjs
node script/check-seasonal-intro.cjs
node script/check-seasonal-decorations.cjs
node script/check-project-top.cjs
node script/check-admin-seasons.cjs
node script/check-github-sync.cjs
node script/check-mobile.cjs
```

Browser tests require Playwright and Chrome. `PORTFOLIO_TEST_URL` can target another server for the seasonal browser tests. The calendar tests cover inclusive boundaries across future years and the December/January cycle. Browser suites check all four styles on desktop, phone and landscape, the original layout at nine sizes, persistence, event transitions, storage/image failures, original controls, parallax, bats and staged loading animations.

## Local decoration review

The Halloween loader includes the supplied hanging pumpkin garland. Winter uses softly lit frosted bulbs on the same original light tube; positioning avoids loading text and progress. Ghost concepts 01, 05 and 08 are small, translucent corner visitors behind the glass panel. Staggered visits can overlap, fade over several seconds, ripple slowly and respond to pointer/scroll depth. Ghosts have no glow or speech bubbles, hide for project dialogs and reduced motion, and are disposed when leaving Halloween. Original bat artwork and the complete flight/wing renderer remain unchanged.

The ignored `seasonal-preview.html?theme=snow` is a local review wrapper, with `amber`, `silver`, `snow`, `fireside` and `original` available through the query string. It replaces only its embedded document's calendar bootstrap so both events can be reviewed year round. It does not add public theme controls or change the real calendar.

## Admin previews and publishing

The local desktop admin's Themes section switches previews without reloading or modifying content. A preview is encoded as `?admin=1&preview=THEME`; the override is ignored on public hosts. Returning to Automatic removes the preview parameter. The replay link opens a separate tab, preserving unsaved editor form values.

The repository sync reads all pages of public repositories and writes the generated list only after a successful complete scan. Rate limits and language API failures leave the previous data intact. Credentials are sent only to the GitHub API. The scheduled workflow serializes runs, commits changes and explicitly requests a Pages rebuild when data changes; manual and configuration-triggered runs also request publication. GitHub scheduled jobs are best-effort and may be delayed.
