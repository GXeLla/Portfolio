# Portfolio V3 ideas and plan

Read this file before working on the V3 redesign. Keep it updated as ideas are
discussed and decisions are made so future Codex sessions can continue the work.

## Project context

- V3 redesign branch: `design/portfolio-v3`, in the `Portfolio` folder.
- V2 maintenance branch: `maintenance/portfolio-v2`, in the separate `Portfolio-v2` folder.
- The live portfolio deploys from `main` and currently runs V2.
- V3 starts with all current V2 files. Keep V3 work on its redesign branch.
- This file records planning; an idea alone is not an instruction to implement it.

## Planning status and instructions for future sessions

- Current phase: capture, analyze, refine, and adjust ideas only. Do not implement
  the redesign until Giorgi asks to begin implementation.
- Read this entire file when resuming V3 work. Briefly recap the concept and open
  questions so Giorgi can review it before adding more ideas.
- Add new ideas without silently dropping earlier ones. If a new idea conflicts
  with an earlier decision, resolve it with Giorgi and update the document.
- Treat the direction below as the current concept, not a finished specification.
- Giorgi is currently creating the animated vinyl player and continuing work on
  the final background animations. He may download/export the vinyl separately;
  the final asset structure is not decided yet.
- No final V3 background has been delivered yet. Giorgi will provide the final
  version, then implementation will begin together with him.
- Latest concept update: November 1, 2026.

## V3 vision

An immersive, cinematic portfolio built around beautiful, smooth, aesthetic
scenes, realistic musical objects, and camera movement between places. The
background is a central part of the experience, with its own interaction mode.
The interface, transitions, lighting, and audio should feel connected to the
same world.

Giorgi describes the desired visual quality as “Higsfield”: cinematic framing,
polished lighting, smooth motion, and a striking overall atmosphere. Keep this
wording as a visual reference; the exact reference and scenes are still to come.

## Unique loading screen

- V3 needs a distinctive loading experience of its own.
- No concept or prepared assets exist yet. Leave the design open for later.

## Scenes, lighting, and movement

- Backgrounds should feel exceptionally smooth, beautiful, and atmospheric.
- Giorgi will define the places and create all the scenes later.
- Moving between sections should feel like a camera traveling between rooms or
  different places: moving upward, passing through a window, or crossing into
  another environment.
- Travel can reach a near-supersonic speed: the route is largely unreadable,
  followed by a fast arrival in the next place. Exact pacing is still open.
- Light mode should change the scene's lighting and atmosphere, rather than
  simply switching colors or introducing a sun.
- The intended light-mode mood is around 5–6 a.m.: softly illuminated early
  morning, without a red sky. Giorgi used the word “sunset,” but the stated time
  suggests dawn; confirm the reference before designing the lighting.

## Music and musical objects

### Initial scope

- Begin with two musical objects: a vinyl player and a piano, with instrumental
  music that feels connected to the instrument or player producing it.
- Start with one piano track and one vinyl track. The longer-term concept allows
  multiple tracks and different performances for each instrument.
- The environment may eventually contain more music players and other kinds of
  interactive objects. Their scope and behavior will be described later.

### Vinyl interaction and playback

- The tonearm (the player's “stick”) should be draggable.
- Moving the tonearm away from the record stops playback.
- Different vinyl music should have visually different discs.
- When a track finishes, animate the tonearm moving away, remove the disc,
  introduce another disc, and automatically start the next track.
- The exact disc-changing mechanism and how a visitor restarts playback after
  manually moving the tonearm are still open.

### Piano playback

- After a piece finishes, the piano rests for a while, then begins a different
  piece automatically.
- The rest duration and visitor controls for the piano are not decided yet.

### Audio across places

- Audio should behave as though it belongs to the environment.
- Switching portfolio tabs/sections determines which music plays, such as vinyl
  or piano. This refers to navigation within the portfolio.
- If Giorgi develops a distinct concept for every tab, each will have its own
  place and corresponding musical source.
- Otherwise, use random selection where dedicated concepts are missing. The
  exact fallback rules and what is randomized will be refined later.
- During camera travel, the departing place's music gradually fades until it is
  barely noticeable.
- On arrival at a different place, that place's music begins from the start.
- The exact tab-to-place and tab-to-instrument assignments, and whether any
  sources can play together, are still open questions.

## Sound mode and background interaction

- A sound button opens an immersive mode: the UI disappears with a smooth 3D
  visual transition, leaving only the background visible.
- Background sound interactions become available in this mode. Further
  background interactions will be specified by Giorgi later.
- Provide adjustable volume. The current concept does not use sound-on and
  sound-off buttons; keep the sound-mode entry button distinct from a mute toggle.
- Stopping vinyl playback is a physical interaction with its tonearm.
- How visitors exit sound mode and return to the portfolio UI is undecided.

## Portfolio interface and navigation

- The UI should feel smooth and visually connected to the scenes.
- V3 should not use modals.
- Keep the main menu on the left and show section content on the right.
- Aim to retain all five current portfolio sections. Final content and any
  restructuring will be reviewed later.

## Product showcase: scrolling iframe wheel

- Showcase products Giorgi has worked on using full iframe views.
- Scrolling moves each iframe along a curved, oval-like path on the right side,
  creating the impression of rotating a wheel in 3D.
- An iframe enters from the bottom-right corner at a smaller scale, then grows
  as it approaches the center-right focus position.
- At center-right, it settles into a visually anchored viewing position.
- Continuing to scroll moves it upward toward the top-right while it scales
  down, making room for the next product.
- Include a smooth quick-find feature for locating products directly. Its
  appearance and controls are still open.
- Scroll pacing, focus duration, and interaction with the embedded product are
  still to be designed.

## Direction established so far

- Develop V3 separately while keeping V2 available for maintenance.
- Use immersive scenes, cinematic transitions, and realistic musical objects as
  the core creative direction.
- Use left-side navigation and right-side content without modals.
- Explore the piano, vinyl player, sound mode, and curved iframe showcase as
  described above.
- Stay in the ideas phase until Giorgi supplies more direction and asks to build.

## Open questions for later

These are a backlog for future discussion, not blockers to recording ideas.

- What is the unique loading-screen concept?
- What exact visual reference does “Higsfield” describe?
- What are the places, their scene assets, and their relationship to each section?
- Which tabs get dedicated musical places, and how should random selection work
  for the remaining tabs?
- What is the precise early-morning lighting reference?
- How does a visitor leave sound mode and restore navigation?
- What interactions will the background support beyond the musical objects?
- How are tracks selected, and how do manual controls affect automatic playback?
- How does the piano respond to visitor interaction?
- How should quick-find navigation and scrolling inside an iframe work together?
- How should these experiences adapt to phones, keyboard input, and reduced
  motion preferences?
- How should initial audio start when a browser requires visitor interaction
  before allowing playback?

## Existing notes

- Verify rain landing and splash timing on physical phones, including Safari.
- Check the weather particle limit on older hardware.

The local content editor is documented in [ADMIN.md](ADMIN.md).
