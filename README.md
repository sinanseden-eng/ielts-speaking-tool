# Speaking Studio

A responsive, browser-based IELTS Speaking practice website. Six original theme packs connect all three parts: **Home & hometown**, **Travel & discovery**, **Technology & daily life**, **Learning & skills**, **Nature & outdoors**, and **Food & traditions**.

## Included

- 78 practice tasks: six Part 1 questions, one Part 2 cue card and six Part 3 questions per theme.
- 108 contextual vocabulary entries, each with a definition and an original example.
- Part-specific guiding phrases and a contextual sentence starter.
- A notes area, five reflection checks and a next-step field for every task.
- Manual start, pause, resume and reset clocks. Part 2 has separate one-minute preparation and two-minute speaking stages; learners switch stages manually. Part 1/3 offer four- and five-minute whole-set timers.
- Saved notes and task progress in browser localStorage, isolated by theme, part and question.
- Text export of all practice in the selected theme, including notes and reflection.
- Keyboard navigation, native modal dialogs, mobile layouts and reduced-motion support.
- An assessment guide and the supplied public IELTS Speaking band descriptors.

## Run locally

No build, framework, account, API key or package installation is required. Serve `dist/` with any static web server:

```sh
python3 -m http.server 8080 --directory dist
```

Visit `http://localhost:8080`. Use the same origin when returning to saved practice. Opening the HTML as a `file:` URL may restrict browser storage. Notes remain on the current browser/device and are never uploaded by this app. If storage is unavailable or full, the app displays a warning and still supports export. Running timers reset on reload or a change of part/theme; changing questions in the same part preserves the running clock. Timers use wall-clock deadlines so returning from a background tab updates the remaining time correctly.

## Deploy

Publish the `dist` directory on any static host. For GitHub Pages, the included manual workflow uploads `dist` without a build: enable Pages with **GitHub Actions** as its source in repository settings, then run **Deploy static site to Pages** from the Actions tab. Pages deployment is not automatically enabled by creating the source files.

## Development

`dist/content.js` contains the original task packs, examples, phrases and reflection checks. `dist/app.js` implements the UI, persistence, export and clocks. `dist/styles.css` defines the responsive design. `dist/index.html` provides the accessible page structure. Google Fonts enhances the typography when available; system fonts are used otherwise.

```sh
npm run check
```

Checks cover content completeness, task isolation and persistence, manual timer transitions, pause/resume, delayed background-tab updates, and storage failure recovery. No external test dependencies are needed.

## Educational scope and sources

Test structure and timing were checked against the [official IELTS Academic Speaking format](https://ielts.org/take-a-test/test-types/ielts-academic-test/ielts-academic-format-speaking). The supplied [Speaking band descriptors](dist/ielts-speaking-band-descriptors.pdf) inform the condensed reflection guidance. The site’s prompts, vocabulary examples and phrases are original teaching material.

Part 1 theme sets are learning activities; the real interview covers a range of familiar topics. Part 3 expands the Part 2 topic into broader discussion. Planning notes and language support are scaffolds for practice; the real test provides preparation notes for Part 2. Reflection checks and practice markers do not award or predict a band score. There is no recording, speech recognition or automated assessment.

Independent educational resource; not affiliated with or endorsed by IELTS. IELTS and the supplied descriptors remain the property of their respective rights holders.
