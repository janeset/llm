# AI / LLM Prep

AI engineering prep for LLM roles: a 10-week track with
runnable Python exercises and projects, IBM Technology videos,
and the skills real AI Engineer postings ask for. No build step, no backend: plain HTML, CSS and
JavaScript. One of four Job Preps apps, each in its own repo: DSA Prep, Cloud Prep, AI / LLM Prep and System Design Prep.

**Live:** https://janeset.github.io/AI-jobPrep-static/

You need basic Python for the exercises; the app doesn't teach it. It links one free course,
[Kaggle Learn: Python](https://www.kaggle.com/learn/python) (about 5 hours), from Home and the AI from zero lessons.

## Run it

```bash
python -m http.server 5176
```

Then visit http://localhost:5176. Opening `index.html` directly also works, but embedded videos need a server.

## What's inside

| Page | What it does |
| --- | --- |
| Home | Says what the site is for in one headline ("Learn to build with LLMs, then get hired for it."), who it's for, and one **Start here** button (it opens the first lesson, named beside it) with the 10-week roadmap as a quiet link and the free Python course for anyone who needs it. Beside it, the course in numbers (weeks, lessons, exercises, projects, questions), counted from the content. Then "Where are you starting from?" (New to AI, or I know the AI basics) until you pick; it sets where Start here goes, and once you pick, focus moves to Start here and its new lesson is announced. **What's here** has four entry points, each labelled by kind (Learn is the course, Claude & Anthropic the official resources, Jobs the career tools, Console & search the tools); each card's heading is its link, and the whole card is clickable. Then the beginner lessons, one row per lesson, and **How the course works** (a weekly rhythm and the 10 weeks, one line each). Once you pass your first exercise, Start here becomes Continue, the numbers become your progress (lessons, exercises, projects, streak, today, week) and the course and role cards appear under "Pick up where you left off" |
| Learn (the AI / LLM course) | Browsed as a folder tree on the left, styled like the console (press **L**), with a breadcrumb above each page (Learn / Lessons / module / lesson): pages are files, lessons sit in module folders under `learn/`, IBM playlists and lesson videos under `ibm-videos/`, builds under `projects/`; folders you open or close stay that way, and on phones the tree folds into one line above the page. Overview, roadmap, lessons, interview question bank, exam-style quiz, projects with resume bullets, certification paths. The **Overview** is Learn's front page: what the course is, Start here (or Continue) and the roadmap, **Start the plan today** (it sets today as week 1 so the page can show this week's work; every lesson is open either way), then **How the course is organised** (every module in order with the weeks of the plan that teach it, each opening on its first unfinished lesson), this week's lessons and build, certifications, practice and reference, and the full courses. Progress numbers and the progress ring appear once there's progress to show. Learn starts with **AI from zero** (6 lessons for people with no ML background, ending with the developer toolkit: terminal, Git, secrets, JSON and HTTP; optional for people who know the basics; the exercises use a little Python, and a note links a free Python course), then 24 lessons in 10 modules, from fundamentals to getting hired (the curriculum and the research behind it are in [docs/curriculum.md](docs/curriculum.md)). Every lesson opens with why it matters on the job, has a worked example you can run (every code example has a **Copy** button), at least 3 Python exercises checked in the browser (each with an example, a hint and a model answer) and at least 3 interview questions with model answers; nothing needs an API key. **Debug this** exercises start from buggy code to fix instead of a `pass` placeholder. A lesson is complete when all its exercises pass (Roles lessons without code: when all their checks are answered correctly). Every week ends with a build, 11 projects in all: week 1's is a small milestone, **First working AI app** (a script that gets a structured JSON response from a model API, finished in one or two sessions), and week 10's is a portfolio, take-home rehearsal and mock loop. Projects are self-reported, with what to do, what you should see and a hint for each step, and a cost / API-key note before each project |
| Claude & Anthropic | Anthropic's official courses in learning order (AI Fluency: Framework & Foundations, Claude 101, Building with the Claude API, then the two MCP courses), the four Claude certifications with Anthropic's Partner Network eligibility note, and the OpenAI Academy courses: one panel per track (who it's for, what it covers, its courses in order and linked, with Build with AI split into OpenAI API and Codex and marked as the best match for this course), then a note that no OpenAI certification could be confirmed. Every entry links to the official page (links say they open in a new tab) and shows a "last verified" date. Laid out like Learn and Jobs: a folder tree on the left jumps to every course, certification and OpenAI track and opens the lessons these courses build on, and the sections fill the rest of the window (on phones the tree folds into one line and a row of "On this page" jumps takes its place). Each course lists the lessons here that relate to it. Also under Learn > Lessons > reference in the folder tree, and on the Certifications page |
| Learn > IBM Videos | Every IBM Technology playlist playable in the app with done-tracking and links to matching lessons, an expandable list of every video in each playlist, the IBM videos picked for each lesson, and a title search |
| Jobs: Interview | One **Jobs** tab (press **J**) holds Interview, Roles and Companies, browsed as a folder tree like AI / LLM: `interview/`, `roles/` (with its own `learn/` and `projects/` folders) and `companies`. Interview: Timed mock interviews (technical questions for AI Engineer, plus behavioural) with self-scoring; weak answers are flagged "Review again" in the question bank. The setup page explains the three steps (pick a format, answer each round out loud, score yourself and save). During a mock the page says which round you're on, the round clock says its state in words (Not started, Running, Paused, Over time), the model answer or tip opens under its button, and moving between rounds puts focus on the new question and announces it. Abandon asks first; Finish & save asks first when rounds aren't scored, then opens History. The mock is saved as you go, so you can leave (to read the related lesson, say) and come back. STAR story bank with theme and skill coverage; history |
| Jobs: Roles | AI Engineer: skill demand across postings, self-rating and readiness, per-posting fit and prep notes, an **Add posting** form with skill suggestions, gap lessons, questions, quiz and projects |
| Jobs: Companies | What AI interviews look like at each tier of employer, and an application tracker linked to postings. The Toronto & Kitchener-Waterloo job market (example employers here, built-in local postings in Roles) is an optional setting, off by default, on Companies and Roles > Postings |
| Settings | Opens from the gear icon in the top bar (or press **S**; on phones it's under Tools in the menu). 22 themes, each one base colour plus one accent: Midnight (the default), Ink, Paper and High contrast, popular editor palettes (Tokyo Night, Catppuccin Mocha and Latte, Rosé Pine and Dawn, Dracula, Kanagawa, Gruvbox, Everforest, Nord, Solarized Light) and duotone pairings (Navy & Peach, Violet & Lime, Crimson & Cream); System follows your device with Paper and Ink. Every theme passes WCAG AA (4.5:1) for text, muted text, links and buttons, on cards and on the page background; status text (Done, Review again, warnings, the timer) uses the theme's green, amber and red pulled toward white or black so it passes too. Accent colour, text size, density, single-key shortcuts on or off, where you're starting from, plan start date, export / import |
| Search | **Ctrl+K** (or **/**) opens a command palette. Empty, it lists where to jump: your next lesson, the main pages (including Claude & Anthropic), the console and a light / dark switch. Type to search lessons, Claude & Anthropic courses and certifications, questions, projects, role skills, postings, IBM videos and your stories; **Tab** switches between All, Lessons, Questions, Projects and Videos |
| Header and menus | The page uses the whole browser window, with a side margin that grows with the screen, and long reading text keeps a comfortable line length. The brand (AI Prep, with "LLM engineering" set apart on wide screens) goes Home. The sections are **Home**, **Learn**, **Claude & Anthropic** and **Jobs**; the current one is marked with a bar under it as well as its colour. **Learn** and **Jobs** go to their section; the chevron beside each opens its menu (so does hovering with a mouse, or Down / Up arrow on either button, which also moves between the menu's links). Keyboard focus alone never opens a menu, so Tab moves straight along the top bar, and Esc, a pick, a click elsewhere or focus leaving closes it. Each menu starts with a line on what the section holds: the Learn menu groups its pages into Course and Practice & reference, then lists the modules with lessons done and the next lesson; the Jobs menu lists Interview, Roles and Companies. On the right: the tools (search, **Console**), then light / dark and Settings, then one **Start here** button that becomes **Continue** (your next lesson) once you pass an exercise. Below 980px the links, Console and Settings move into a menu under the burger button, where Learn and Jobs expand in place, one at a time, and Tools holds Search, Console and Settings; Start here stays in the top bar. A **Skip to content** link comes first for keyboard users, each page has its own window title ("Postings · Jobs · AI Prep") and one h1, and short status messages (exercise test results, copied, round changes, a saved mock) are announced to screen readers |
| Console and shortcuts | Single keys open each page (**H** Home, **L** Learn (**A**, its old letter, still works), **C** Claude & Anthropic, **J** Jobs, **S** Settings), and **`** opens a console: `open softmax`, `next`, `week`, `progress`, `lessons`, `theme ink`, `search rag`, `help`. Shortcuts never fire while you're typing and can be turned off in Settings |

Python exercises are auto-graded in the browser via [Pyodide](https://pyodide.org) (loaded from a CDN on first run, with a loading message and a 30-second timeout). Each exercise says above its code box to replace the `pass` placeholder; typing on that line replaces it, and an untouched starter is not run. Exercises have a stable `key`; progress is saved under it, so exercises can be reordered without moving anyone's progress.

### Short Learn addresses

Some Learn addresses are deliberate shortcuts to a lesson, listed in `AI.aliases` (`ai-zero.js`) and
`aliases` in `roles-learn.js`. For example `#/ai/learn/softmax` opens **Sampling in depth: logits,
softmax and temperature** (the lesson with the softmax exercise), `#/ai/learn/start` opens the first
lesson, and `#/roles/learn/azdevops` opens the CI/CD lesson it was renamed to. The address bar then
shows the lesson's own address. The start of a lesson's id or title also works when it matches only
one lesson (`#/ai/learn/sampl`). Anything else shows "Lesson not found".

## Files

| File | Contents |
| --- | --- |
| `index.html`, `style.css`, `app.js` | App shell, design system / themes (type scale, section spacing, a spacing scale, the reading width and colour tokens, including text-safe status colours, at the top of `style.css`; a full-width header with menus, round icon buttons and pill buttons after Awwwards; keycaps and palette after Linea Prompt; outlined chips and a console after Stripe Dot Dev; see [docs/design-inspiration.md](docs/design-inspiration.md)), the phone menu, the shared page header (`pageHead`: eyebrow, the page's h1, a line on what it's for, actions and an optional progress ring), status announcements for screen readers (`announce`), Copy buttons (`copyText`), Home / Companies / Settings and the Python runner. The menus' contents, the breadcrumbs (`crumbTrail`) and Home are built in `trackview.js` |
| `tracks.js` | Video helpers (including `IBM`), the track registry and `extendTrack` (loaded first) |
| `ai.js`, `ai-more.js` | AI / LLM track content, and extra lessons (including Sampling in depth), exercises, questions and glossary merged into it |
| `ai-zero.js` | The beginner lessons (AI from zero), plus short Learn addresses (`#/ai/learn/start`, `#/ai/learn/softmax`) |
| `ai-modules.js` | The curriculum update: newer lessons (neural networks, AI coding assistants, MCP and Skills, evals in production, local models, system design, getting hired), "why it matters" openers, more exercises including Debug this, interview and quiz questions, the week 3, 4, 7, 9 and 10 projects, and the module and 10-week layout |
| `docs/curriculum.md` | The research (programs, job-posting and interview data, with sources), the curriculum it led to, and how the content compared before this update |
| `trackview.js` | Track engine (overview, learn, questions, quiz, projects, certs), the AI / LLM and Jobs folder trees, and the Home page: the learning path for each starting level, earned lesson completion, exercise cards, and the migration of saved exercise progress to stable exercise keys |
| `anthropic.js` | Claude & Anthropic: official courses, Claude certifications, the OpenAI Academy entry, "last verified" dates, and the page / Learn / Certs rendering |
| `ibmvideos.js`, `ibmplaylists.js` | IBM Technology playlists, the IBM Videos tab, and every video in each playlist |
| `roles.js` | Role definitions, the shared skill catalog, skill keywords and built-in postings |
| `roles-learn.js` | Roles lessons, exercises, questions, quiz (including the checks for lessons without code), projects and glossary |
| `roleview.js` | Roles pages: demand, readiness, postings and the add-posting form |
| `interview.js` | Mock interviews, behavioural question bank, STAR story bank and mock history |
| `router.js` | URL routing (`#/ai/learn/rag`, `#/ai/ibm/...`, `#/interview/mock`...): refresh, Back/Forward and bookmarks |
| `search.js` | Search index, pages and commands, and the Ctrl+K command palette |
| `console.js` | The console (**`** key) and the single-key page shortcuts |

## Keeping external links current

Every certification, course list and video list shows a **Last verified** date. Change a date only after
re-checking that content: `PY_COURSE.verified` in `trackview.js` (the free Python course), `CLAUDE.verified` and `OPENAI_LEARN.verified` in `anthropic.js` (official
Anthropic and OpenAI pages), and `VIDEOS_VERIFIED` in `tracks.js` (every YouTube video and playlist id,
checked through YouTube's oEmbed endpoint). Exam prices are deliberately not stored: link to the official page.

## Your data

Progress is stored in the browser's `localStorage` under `ai-prep-v1`, including postings you
add, stories and mock history. Use **Settings > Export** to back it up. Backups from before stable exercise keys still import: progress moves to the new keys, and old "Mark as reviewed" ticks are kept but no longer count as complete. Progress from the removed Python beginner lessons (`pz-*` keys) is kept in the data and in exports, but not shown. An export from the
combined Prep Hub app imports here too (its AI track, IBM and Roles progress carries over).

## License

Copyright (c) 2026 Jane S. All rights reserved. See [LICENSE](LICENSE).
