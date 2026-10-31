# Speaking Studio

A responsive, browser-based IELTS Speaking practice website. Six original theme packs connect all three parts: **Home & hometown**, **Travel & discovery**, **Technology & daily life**, **Learning & skills**, **Nature & outdoors**, and **Food & traditions**.

## Included

- 78 practice tasks: six Part 1 questions, one Part 2 cue card and six Part 3 questions per theme.
- 108 contextual vocabulary entries, each with a definition and an original example.
- Part-specific expression starters, all four words or fewer, and a contextual starter.
- Five separate screens in one task card: Question → Plan → Note style → Speak → Review. Only the active stage is shown. The student starts the clock manually; the checklist appears when time ends or they choose **I’ve finished**.
- A guided keyword planner for every task: choose expressions, add target words in task-specific sections, then choose a spidergram or an ordered list. Every entry is limited to four words, including pasted text. All notes appear with a sticky, manually started response clock. Five reflection checks and a short next-step goal finish each task.
- Manual start, pause, resume and reset clocks. Part 2 has an optional one-minute planning clock and a separate two-minute response clock. Neither clock starts the other. Part 1/3 retain selectable four- and five-minute practice limits; students can finish a response earlier. Each new task gets a fresh clock. Editing a plan pauses the response clock.
- Colour sweeps, sparkle transitions, note pop-ins and gentle speaking animation. A persistent motion toggle and system reduced-motion support disable animations.
- Saved words, expressions, chosen note-taking layout, active stage and task progress in browser localStorage, isolated by theme, part and question.
- Text export of all practice in the selected theme, including grouped plan entries, expression starters, reflection and original notes from earlier versions.
- Keyboard navigation, native modal dialogs, mobile layouts and reduced-motion support.
- An assessment guide and the supplied public IELTS Speaking band descriptors.

## Run locally

No build, framework, account, API key or package installation is required. Serve `dist/` with any static web server:

```sh
python3 -m http.server 8080 --directory dist
```

Visit `http://localhost:8080`. Use the same origin when returning to saved practice. Opening the HTML as a `file:` URL may restrict browser storage. Plans remain on the current browser/device and are never uploaded by this app. If storage is unavailable or full, the app displays a warning and still supports export. Running timers reset on reload or a change of part/theme. Changing questions stops and resets the response clock. A fresh task begins at the question screen; returning to a saved task restores its stage. A keyword plan and a chosen layout are required before speaking. Reloading a speaking screen requires starting the new clock before finishing. The review stage is available only after a response finishes. Editing pauses the response clock too. Timers use wall-clock deadlines so returning from a background tab updates the remaining time correctly.

## Deploy

### Netlify with GitHub

Connect this repository and select the `main` branch. The root `netlify.toml` sets the build and publish locations automatically:

| Setting | Value |
| --- | --- |
| Framework preset | None / Other |
| Base directory | Repository root (`.`) |
| Build command | `npm run build` |
| Publish directory | `dist` |

The build command validates the existing static files; it does not require a bundler or any dependencies. No API keys or environment variables are required. Netlify must publish the contents of `dist`, so that `dist/index.html` becomes the site's `/index.html`. Publishing the repository root leaves the homepage missing.

For an already connected project, pushing this configuration to `main` triggers its normal Git deployment. If automatic builds are paused, choose **Trigger deploy → Deploy site** in the Netlify Deploys tab. Netlify's root file configuration overrides matching build and publish settings in its dashboard.

### Other static hosts

Publish the `dist` directory on any static host. For GitHub Pages, the included manual workflow uploads `dist` without a build: enable Pages with **GitHub Actions** as its source in repository settings, then run **Deploy static site to Pages** from the Actions tab. Pages deployment is not automatically enabled by creating the source files.

## Development

`dist/content.js` contains the original task packs, examples, phrases and reflection checks. `dist/planner.js` defines the four-word validation, task-specific sections, plan state and migration rules. `dist/app.js` implements the planner UI, responsive spidergram connectors, persistence, export and independent clocks. `dist/styles.css` defines the responsive design. `dist/index.html` provides the accessible page structure. Google Fonts enhances the typography when available; system fonts are used otherwise.

```sh
npm run check
```

Checks cover content completeness, four-word limits on all supplied and custom entries, duplicate handling, plan persistence and task isolation, layout readiness, exactly one visible stage, forward-stage guards, saved stage restoration, early finish and automatic expiry leading to review, retry and next-task behaviour, motion preferences, manual timer transitions, independent preparation and response timing, delayed background-tab updates, legacy note preservation and storage failure recovery. No external test dependencies are needed.

## Educational scope and sources

Test structure and timing were checked against the [official IELTS Academic Speaking format](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking). The supplied [Speaking band descriptors](dist/ielts-speaking-band-descriptors.pdf) inform the condensed reflection guidance. The site’s prompts, vocabulary examples and phrases are original teaching material.

Part 1 theme sets are learning activities; the real interview covers a range of familiar topics. Part 3 expands the Part 2 topic into broader discussion. Planning notes and language support are scaffolds for practice; the real test provides preparation notes for Part 2. Reflection checks and practice markers do not award or predict a band score. There is no recording, speech recognition or automated assessment.

Independent educational resource; not affiliated with or endorsed by IELTS. IELTS and the supplied descriptors remain the property of their respective rights holders.
