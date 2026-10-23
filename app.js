"use strict";
// ---------- state ----------
const KEY = "ai-prep-v1";
const STATUSES = ["Researching", "Applied", "Screen", "Interview", "Offer", "Rejected"];

const iso = (d) => { const z = new Date(d.getTime() - d.getTimezoneOffset() * 60000); return z.toISOString().slice(0, 10); };
const today = () => iso(new Date());
const addDays = (s, n) => { const d = new Date(s + "T00:00:00"); d.setDate(d.getDate() + n); return iso(d); };
const dayDiff = (a, b) => Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);

const blankState = () => ({ companies: [], code: {}, activity: {} });
function load() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  return migrateTrackProgress(Object.assign(blankState(), s || {})); // trackview.js
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { alert("Could not save to browser storage."); } }

// ---------- appearance ----------
// Each theme pairs one base colour family with one accent (style.css has the palettes and where they come from).
const THEMES = [
  { id: "system", name: "System", desc: "Follows your device: Paper or Ink" },
  { id: "midnight", name: "Midnight", desc: "Deep blue + bright blue (default)" },
  { id: "dark", name: "Ink", desc: "Deep navy + teal" },
  { id: "tokyo", name: "Tokyo Night", desc: "Night blue + soft blue" },
  { id: "mocha", name: "Catppuccin Mocha", desc: "Dark pastel + mauve" },
  { id: "rosepine", name: "Rosé Pine", desc: "Muted purple + rose" },
  { id: "dracula", name: "Dracula", desc: "Grey-purple + purple" },
  { id: "kanagawa", name: "Kanagawa", desc: "Sumi ink + gold" },
  { id: "gruvbox", name: "Gruvbox", desc: "Retro brown + orange" },
  { id: "everforest", name: "Everforest", desc: "Green-grey + sage" },
  { id: "nord", name: "Nord", desc: "Arctic grey + frost blue" },
  { id: "forest", name: "Forest", desc: "Dark green + mint" },
  { id: "peach", name: "Navy & Peach", desc: "Duotone: navy + peach" },
  { id: "lime", name: "Violet & Lime", desc: "Duotone: ultraviolet + neon lime" },
  { id: "contrast", name: "High contrast", desc: "Black + yellow, maximum legibility" },
  { id: "light", name: "Paper", desc: "Blueprint paper + indigo", light: true },
  { id: "latte", name: "Catppuccin Latte", desc: "Light pastel + mauve", light: true },
  { id: "dawn", name: "Rosé Pine Dawn", desc: "Warm cream + pine", light: true },
  { id: "solarized", name: "Solarized Light", desc: "Cream + blue", light: true },
  { id: "crimson", name: "Crimson & Cream", desc: "Duotone: cream + crimson", light: true },
  { id: "sand", name: "Sand", desc: "Warm paper + burnt orange", light: true },
  { id: "rose", name: "Rosé", desc: "Blush white + pink", light: true },
];
const LIGHT_THEMES = new Set(THEMES.filter((t) => t.light).map((t) => t.id));
// Text size: [key, label, root font size]. Everything is sized in rem, so this scales the whole interface.
const FONT_SIZES = [["s", "Small", "14px"], ["m", "Default", "16px"], ["l", "Large", "17.5px"], ["xl", "Larger", "19px"], ["xxl", "Largest", "21px"]];
const DEFAULT_THEME = "midnight"; // used until you pick one; index.html applies it before first paint too
const ACCENTS = ["#5b5bd6", "#2f6fed", "#0f9d8f", "#16a34a", "#ea580c", "#e11d48", "#8b5cf6"];
const darkQuery = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
// A saved theme that no longer exists falls back to the default
const resolvedTheme = () => { const t = THEMES.some((x) => x.id === S.theme) ? S.theme : DEFAULT_THEME; return t === "system" ? (darkQuery && darkQuery.matches ? "dark" : "light") : t; };
const ICON_SUN = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>`;
function applyTheme() {
  const r = document.documentElement, t = resolvedTheme();
  r.dataset.theme = t;
  r.dataset.density = S.density || "comfortable";
  r.dataset.keys = S.keys === false ? "off" : "on";
  r.style.fontSize = (FONT_SIZES.find(([k]) => k === S.fontSize) || FONT_SIZES[1])[2];
  if (S.accent) r.style.setProperty("--accent", S.accent); else r.style.removeProperty("--accent");
  if (S.treeW) r.style.setProperty("--tree-w", S.treeW + "px"); else r.style.removeProperty("--tree-w");
  if (document.querySelector(".topbar-inner")) fitHeader(); // text size changes the header's width
  const q = document.getElementById("theme-quick");
  if (q) { q.innerHTML = LIGHT_THEMES.has(t) ? ICON_MOON : ICON_SUN; q.setAttribute("aria-label", `Switch to the ${LIGHT_THEMES.has(t) ? "dark" : "light"} theme`); }
}
if (darkQuery) darkQuery.addEventListener("change", () => { if ((S.theme || DEFAULT_THEME) === "system") { applyTheme(); if (tab === "settings") render(); } });

// ---------- helpers ----------
const ICON_SEARCH = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
// A page's header: the title (the page's one h1) and a line on what the page is for. Optional: an eyebrow above the
// title, a row of actions under it, and an aside on the right (a progress ring).
const pageHead = (title, sub = "", o = {}) => `<header class="page-head"><div class="page-head-main">
  ${o.eyebrow ? `<p class="eyebrow">${o.eyebrow}</p>` : ""}<h1>${title}</h1>${sub ? `<p class="page-sub">${sub}</p>` : ""}
  ${o.actions ? `<div class="row page-actions">${o.actions}</div>` : ""}</div>${o.aside ? `<div class="page-head-aside">${o.aside}</div>` : ""}</header>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
// After the text of a link that opens in a new tab: the arrow for the eye, the words for screen readers
const NEW_TAB = `<span aria-hidden="true">&nearr;</span><span class="sr-only"> (opens in a new tab)</span>`;
const $ = (sel, root = document) => root.querySelector(sel);
function fmt(s) { return String(Math.floor(s / 60)).padStart(2, "0") + ":" + String(s % 60).padStart(2, "0"); }

function streak() {
  let n = 0, d = today();
  if (!S.activity[d]) d = addDays(d, -1); // today may not be done yet
  while (S.activity[d]) { n++; d = addDays(d, -1); }
  return n;
}
// Click-to-play video cards (the iframe only loads when clicked).
const vids = (list) => !list || !list.length ? "" : `<div class="vgrid">${list.map((v) =>
  `<div class="vcard" data-vid="${v.id}" role="button" tabindex="0" title="Play video"><img loading="lazy" alt="" src="https://i.ytimg.com/vi/${v.id}/mqdefault.jpg"><span class="play">&#9654;</span>
   <div class="vt">${esc(v.title)}<br><span class="muted">${esc(v.ch)}</span></div></div>`).join("")}</div>`;
const yt = (q) => `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;

// ---------- Python in the browser (lesson exercises) ----------
let pyodide = null, pyLoading = null;
const PY_TIMEOUT_S = 30;
async function loadPy() {
  if (!window.loadPyodide) await new Promise((res, rej) => {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"; s.onload = res;
    s.onerror = () => { s.remove(); rej(new Error("Could not load Python (Pyodide). Check your connection, then press Run again.")); };
    document.head.appendChild(s);
  });
  return (pyodide = await loadPyodide());
}
// Loads Python once. Gives up with a clear message after PY_TIMEOUT_S (a slow load that finishes later is
// still kept, so the next Run works); a failed load can be retried.
async function ensurePy() {
  if (pyodide) return pyodide;
  if (!pyLoading) {
    let timer;
    const timeout = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`Python didn't load within ${PY_TIMEOUT_S} seconds. Check your connection, then press Run again.`)), PY_TIMEOUT_S * 1000); });
    const load = loadPy();
    load.catch(() => {});
    pyLoading = Promise.race([load, timeout]).finally(() => { clearTimeout(timer); pyLoading = null; });
  }
  return pyLoading;
}
// What to show while code runs: loading Python is the slow part, and only happens once.
const pyStatus = () => (pyodide ? "Running..." : `Loading Python... (first run only; this can take up to ${PY_TIMEOUT_S} seconds)`);
// Runs code (optionally in a fresh namespace); resolves { out, err, loadErr } and never throws. loadErr: Python itself didn't load.
async function execPy(code, fresh) {
  let out = "", err = "";
  try {
    const py = await ensurePy();
    py.setStdout({ batched: (t) => (out += t + "\n") });
    py.setStderr({ batched: (t) => (out += t + "\n") });
    try { await py.runPythonAsync(code, fresh ? { globals: py.globals.get("dict")() } : undefined); }
    catch (e) { err = String(e.message || e).trim().split("\n").filter(Boolean).slice(-1)[0]; }
  } catch (e) { return { out, err: e.message, loadErr: true }; }
  return { out, err };
}

// ---------- companies ----------
const TIERS = [
  {
    id: 1, name: "Big tech & top-paying product companies", bar: "Deep fundamentals",
    emphasis: "LLM fundamentals in depth (tokens, attention, sampling, fine-tuning), ML and LLM system design, evaluation, plus regular coding rounds.",
    names: ["Google (Kitchener-Waterloo / Toronto)", "Amazon (Toronto)", "Microsoft", "Shopify", "Cohere", "Intuit", "Uber (Toronto)"],
  },
  {
    id: 2, name: "Mid-size tech & startups", bar: "Shipping features",
    emphasis: "Shipping LLM features: RAG, agents, evals and cost control. Often a practical take-home building a small AI app, then a discussion of your design choices.",
    names: ["Faire", "Clio", "Wealthsimple", "D2L", "OpenText", "Descartes", "Dayforce", "Thomson Reuters", "Miovision", "Magnet Forensics", "Communitech-area startups"],
  },
  {
    id: 3, name: "Banks, insurers & other local employers", bar: "Responsible AI",
    emphasis: "Integrating managed LLM services or Copilot with existing systems, data privacy and responsible-AI controls, and explaining AI trade-offs clearly to non-technical stakeholders.",
    names: ["RBC", "TD", "Scotiabank", "BMO", "CIBC", "Manulife", "Sun Life", "Canada Life", "Intact", "Equitable Bank", "Ontario Public Service", "Eclipse Automation (Cambridge)"],
  },
];

// The optional local job market (Toronto & Kitchener-Waterloo): example employers on Companies and the
// built-in local postings in Roles. Off by default; one setting shared by both pages.
const localMarketToggle = () => `<label class="card check local-toggle"><input type="checkbox" data-localmkt ${S.localMarket ? "checked" : ""}>
  <span><b>Show the Toronto &amp; Kitchener-Waterloo job market</b><br><span class="muted">Adds local example employers on Companies and built-in local postings in Roles.</span></span></label>`;

// Tips shown on the Interview setup page.
const MOCK_TIPS = [
  "Restate the question and say what you'd clarify (users, data, latency, cost, risk).",
  "Give the short answer first, then how it works under the hood.",
  "Tie it to something you built: the design, how you evaluated it, what changed in production.",
  "Name the failure modes (hallucination, prompt injection, drift) and how you'd catch them.",
  "Mention cost and latency, and how you'd measure quality over time.",
  "Finish with a one-sentence summary.",
];

// ---------- views ----------
const views = {
  home() { return homeView(); },
  claude() { return claudeView(); },

  companies() {
    const tierName = (id) => (TIERS.find((t) => t.id === +id) || { name: "" }).name, local = !!S.localMarket;
    return pageHead("Companies", "What AI interviews look like at each kind of employer. Tiers are general guidance, not inside information: check recent postings and interview reports (Glassdoor, Levels.fyi) for each employer.") + `
    ${localMarketToggle()}
    ${TIERS.map((t) => `<div class="card"><div class="row between"><h2 class="card-title" style="margin:0">${esc(t.name)}</h2><span class="pill">${esc(t.bar)}</span></div>
      <p>${esc(t.emphasis)}</p>
      ${local ? `<p><b>Toronto &amp; KW examples:</b> ${t.names.map((n) => `<span class="tag">${esc(n)}</span>`).join("")}</p>` : ""}</div>`).join("")}
    <div class="card"><h2 class="card-title">My application tracker</h2>
      <div class="row"><input id="c-name" placeholder="Company"><select id="c-tier">${TIERS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select>
      <button class="btn primary" id="c-add">Add</button></div>
      ${S.companies.length ? `<table><tr><th>Company</th><th class="hide-sm">Tier</th><th>Status</th><th>Notes</th><th></th></tr>${S.companies.map((c, i) => `<tr>
        <td>${esc(c.name)}</td><td class="hide-sm muted">${esc(tierName(c.tier))}</td>
        <td><select data-cstatus="${i}">${STATUSES.map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
        <td><input data-cnote="${i}" value="${esc(c.note)}" placeholder="Interview date, contact..."></td>
        <td class="actions">${c.posting && allPostings().some((p) => p.id === c.posting) ? `<button class="btn small ghost" data-rlview="${esc(c.posting)}">Posting</button>` : ""}<button class="btn small" data-cdel="${i}">Remove</button></td></tr>`).join("")}</table>` : `<p class="muted">Add companies you're applying to, or add them from a posting in Roles.</p>`}</div>`;
  },

  settings() {
    const cur = THEMES.some((x) => x.id === S.theme) ? S.theme : DEFAULT_THEME, T = TRACKS.ai, st = trState("ai");
    const prev = (id) => `<div class="tp" data-theme="${id}"><div class="tp-card"><i class="l1"></i><i class="l2"></i><div class="row2"><i class="acc"></i><i class="ok"></i></div></div></div>`;
    const seg = (attr, val, opts) => `<div class="seg">${opts.map(([v, l]) => `<button ${attr}="${v}" class="${val === v ? "on" : ""}">${l}</button>`).join("")}</div>`;
    return pageHead("Settings", "Appearance, your plan, and backups. Everything is saved in this browser.") + `
      <div class="card">
        <div class="section-head"><h2 class="card-title">Theme</h2><span class="muted">Now showing: ${esc(THEMES.find((t) => t.id === resolvedTheme())?.name || "")}</span></div>
        ${[["Dark", THEMES.filter((t) => !t.light)], ["Light", THEMES.filter((t) => t.light)]].map(([h, ts]) => `<div class="label theme-group">${h}</div>
        <div class="theme-grid">${ts.map((t) => `<button class="theme-card ${cur === t.id ? "on" : ""}" data-theme-pick="${t.id}">
          <div class="theme-prev">${t.id === "system" ? prev("light") + prev("dark") : prev(t.id)}</div>
          <div class="theme-meta"><span>${esc(t.name)}</span>${cur === t.id ? '<span class="check">&#10003;</span>' : ""}</div>
          <div class="theme-desc">${esc(t.desc)}</div></button>`).join("")}</div>`).join("")}
        <div class="setting"><div><b>Accent color</b><div class="muted">Use the theme's own accent, or pick one.</div></div>
          <div class="swatches"><button class="swatch auto ${!S.accent ? "on" : ""}" data-accent="" title="Theme default"></button>
            ${ACCENTS.map((c) => `<button class="swatch ${S.accent === c ? "on" : ""}" data-accent="${c}" style="background:${c}" title="${c}"></button>`).join("")}</div></div>
        <div class="setting"><div><b>Text size</b><div class="muted">Scales the whole interface.</div></div>
          ${seg("data-fs", S.fontSize || "m", FONT_SIZES)}</div>
        <div class="setting"><div><b>Density</b><div class="muted">Compact tightens spacing in cards and lists.</div></div>
          ${seg("data-dens", S.density || "comfortable", [["comfortable", "Comfortable"], ["compact", "Compact"]])}</div>
      </div>
      <div class="card"><h2 class="card-title">Keyboard</h2>
        <div class="setting"><div><b>Single-key shortcuts</b><div class="muted"><kbd>H</kbd> Home, <kbd>L</kbd> Learn, <kbd>C</kbd> Claude &amp; Anthropic, <kbd>J</kbd> Jobs, <kbd>S</kbd> Settings, and <kbd>\`</kbd> opens the console. They never fire while you're typing. Turn them off if they get in the way of a screen reader or voice control.</div></div>
          ${seg("data-shortcuts", S.keys === false ? "off" : "on", [["on", "On"], ["off", "Off"]])}</div>
        <div class="setting"><div><b>Always on</b><div class="muted"><kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd> opens search, where <kbd>Tab</kbd> switches the filter. The console button in the top bar opens the console.</div></div></div>
      </div>
      <div class="card"><h2 class="card-title">Your plan</h2>
        <div class="setting"><div><b>Where you're starting from</b><div class="muted">New to AI: AI from zero comes first. Know the basics: start at machine learning fundamentals, with AI from zero as an option.</div></div>
          ${seg("data-level", S.level || "new", LEVELS)}</div>
        <div class="setting"><div><b>${esc(T.name)} start date</b><div class="muted">${st.start ? `Week ${trackWeek("ai")} of ${T.weeks.length}.` : "Not started. Pick a date or start it from the track's Overview."}</div></div>
          <input type="date" data-trstartdate="ai" value="${st.start || ""}"></div>
      </div>
      <div class="card"><h2 class="card-title">Backup</h2>
        <div class="setting"><div><b>Your data</b><div class="muted">Progress lives in this browser only. Export now and then so you don't lose it. An export from the combined Prep Hub app imports here too.</div></div>
          <div class="row"><button class="btn" id="s-export">Export</button>
            <label class="btn">Import<input type="file" id="s-import" accept="application/json"></label>
            <button class="btn danger" id="s-reset">Reset everything</button></div></div>
      </div>`;
  },
};

// ---------- wiring ----------
let tab = "home";
function render() {
  const sec = sectionOf(tab), treeTop = document.querySelector(".tree")?.scrollTop;
  let html = sec === "ai" ? trackView(sec, tab.split(":")[1]) : sec === "roles" ? roleView(tab.split(":")[1])
    : sec === "interview" ? interviewView(tab.split(":")[1]) : (views[tab] || views.home)();
  // Interview, Roles and Companies share the Jobs tab and its folder tree
  if (isJobs(tab)) { S.lastJobs = tab; html = `<div class="tree-layout">${jobsTree()}<section class="tree-main">${crumbsHtml()}${html}</section></div>`; }
  $("#view").innerHTML = html;
  highlightCode($("#view"));
  // Segmented controls are toggle buttons: say which one is selected, not only by its look
  $("#view").querySelectorAll(".seg > button").forEach((b) => b.setAttribute("aria-pressed", b.classList.contains("on")));
  renderNav();
  document.title = pageTitle();
  syncUrl();
  placeTree(treeTop);
  // Focus left on a menu's label or chevron would stay in the top bar; let go of it so go() moves it to the new page
  if (document.activeElement?.closest(".dd")) document.activeElement.blur();
}
// Copies text for a Copy button. The button says "Copied" for two seconds and screen readers hear it too; where the
// clipboard isn't available (a page opened from a file), it says how to copy instead.
const copyLabels = new WeakMap(); // a button's own label while it shows "Copied"
function copyText(text, b) {
  const flash = (label, msg) => {
    if (!copyLabels.has(b)) copyLabels.set(b, b.innerHTML);
    b.textContent = label; b.classList.add("copied");
    announce(msg);
    clearTimeout(b._copyTimer);
    b._copyTimer = setTimeout(() => { b.innerHTML = copyLabels.get(b); copyLabels.delete(b); b.classList.remove("copied"); }, 2000);
  };
  const fail = () => flash("Select and copy", "Couldn't copy here. Select the text and copy it instead.");
  if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(() => flash("Copied", "Copied to the clipboard."), fail); else fail();
}
// Says a short status message to screen readers ("Copied", "Round 2 of 4") through the live region in index.html.
// Emptied first, so the same message twice in a row is still read out.
function announce(msg) {
  const s = $("#sr-status");
  s.textContent = "";
  setTimeout(() => { s.textContent = msg; }, 60);
}
// The window title names the page ("Postings · Jobs · AI Prep"), so browser tabs, history and screen readers
// can tell pages apart.
function pageTitle() {
  const trail = crumbTrail(), own = { claude: "Claude & Anthropic", settings: "Settings" }[tab];
  if (trail.length) return `${trail[trail.length - 1][0]} · ${trail[0][0]} · AI Prep`;
  return own ? `${own} · AI Prep` : "AI Prep · LLM engineering";
}
$("#nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  const dd = b.closest(".dd");
  // The chevron opens its menu (keeping it open if hovering already showed it) and closes it on a second press;
  // the label beside it goes to the section
  if (b.classList.contains("dd-toggle")) return dd.classList.contains("open") ? closeMenu(dd) : setMenuOpen(dd, true);
  // A pick in a menu closes it. The page itself opens through the data-nav-go / data-trgo handlers.
  if (b.closest(".dd-panel")) return closeMenu(dd);
  if (b.dataset.track) { const k = b.dataset.track; go(S.lastTab?.[k] || defaultTab(k)); }
  else if ("jobs" in b.dataset) go(S.lastJobs || "interview:mock");
  else if (b.dataset.nav) go(b.dataset.nav);
});
// Learn and Jobs menus. Keyboard focus alone never opens one, so Tab moves straight along the top bar: the chevron
// (or Down / Up arrow on either button) opens it, and Esc, a pick, a click elsewhere or focus leaving closes it.
// With a mouse they also open on hover, and .shut keeps one closed after a pick until the pointer leaves.
const canHover = window.matchMedia ? matchMedia("(hover: hover)") : { matches: false };
const menuShown = (dd) => !dd.classList.contains("shut") && (dd.classList.contains("open") || (canHover.matches && dd.matches(":hover")));
const syncMenu = (dd) => $(".dd-toggle", dd).setAttribute("aria-expanded", menuShown(dd));
// A menu opens under its link, shifted left when it would run past the window's right edge
function placeMenu(dd) {
  const p = $(".dd-panel", dd), over = dd.getBoundingClientRect().left - 8 + p.offsetWidth - (document.documentElement.clientWidth - 16);
  p.style.left = over > 0 ? `${-8 - over}px` : "";
}
function setMenuOpen(dd, open) {
  document.querySelectorAll(".dd.open").forEach((x) => { if (x !== dd) { x.classList.remove("open"); syncMenu(x); } });
  dd.classList.toggle("open", open);
  if (open) { dd.classList.remove("shut"); placeMenu(dd); }
  syncMenu(dd);
}
function closeMenu(dd, refocus) {
  dd.classList.remove("open");
  if (canHover.matches && dd.matches(":hover")) dd.classList.add("shut");
  if (refocus) $(".dd-toggle", dd).focus();
  syncMenu(dd);
}
document.querySelectorAll(".dd").forEach((dd) => {
  dd.addEventListener("mouseenter", () => { placeMenu(dd); syncMenu(dd); });
  dd.addEventListener("mouseleave", () => { dd.classList.remove("shut"); syncMenu(dd); });
  dd.addEventListener("focusout", (e) => { if (!dd.contains(e.relatedTarget)) { dd.classList.remove("open"); syncMenu(dd); } });
  // Esc closes the menu and puts focus back on its chevron. Down / Up arrow opens it at the first / last link,
  // then moves between its links.
  dd.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuShown(dd)) { e.stopPropagation(); closeMenu(dd, true); return; }
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
    e.preventDefault();
    if (!menuShown(dd)) setMenuOpen(dd, true);
    const items = [...dd.querySelectorAll(".dd-panel button")], i = items.indexOf(document.activeElement), down = e.key === "ArrowDown";
    (i < 0 ? items[down ? 0 : items.length - 1] : items[(i + (down ? 1 : -1) + items.length) % items.length])?.focus();
  });
});
document.addEventListener("click", (e) => { if (!e.target.closest(".dd")) document.querySelectorAll(".dd.open").forEach((dd) => closeMenu(dd)); });
$("#subnav").addEventListener("click", (e) => { const b = e.target.closest("button[data-tab]"); if (b) go(b.dataset.tab); });

// Phone menu: the burger opens the sheet under the header. Picking a page, clicking outside it or Esc closes it.
const menuOpen = () => $(".topbar").classList.contains("menu-open");
function setMenu(open) {
  if (!open && $("#menu-sheet").contains(document.activeElement)) $("#menu-open").focus(); // focus never stays in the hidden sheet
  if (!open && sheetOpen !== null) { sheetOpen = null; renderMenus(); } // next time it opens on the current section
  $(".topbar").classList.toggle("menu-open", open);
  $("#menu-open").setAttribute("aria-expanded", open);
  $("#menu-open").innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${open ? "M6 6l12 12M18 6 6 18" : "M4 7h16M4 12h16M4 17h16"}"/></svg>`;
}
document.addEventListener("click", (e) => {
  if (e.target.closest("#menu-open")) return setMenu(!menuOpen());
  // Learn and Jobs expand in place, one at a time; the choice holds until the menu closes
  const sec = e.target.closest("[data-sheet]");
  if (sec) {
    sheetOpen = sec.getAttribute("aria-expanded") === "true" ? "" : sec.dataset.sheet;
    document.querySelectorAll("[data-sheet]").forEach((b) => { const on = b.dataset.sheet === sheetOpen; b.setAttribute("aria-expanded", on); $("#sheet-" + b.dataset.sheet).hidden = !on; });
    return;
  }
  if (menuOpen() && (e.target.closest("#menu-sheet button") || !e.target.closest(".topbar"))) setMenu(false);
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && menuOpen()) setMenu(false); });
// Skip link: straight to the page's heading, without changing the address (the hash is the router's)
$("#skip").addEventListener("click", (e) => { e.preventDefault(); focusPage(); });
// The links fold into the burger menu below 980px, or sooner when they don't fit (large text sizes)
function fitHeader() {
  const bar = $(".topbar"), inner = $(".topbar-inner");
  bar.classList.remove("tight");
  bar.classList.toggle("tight", innerWidth <= 980 || inner.scrollWidth > inner.clientWidth);
}
window.addEventListener("resize", fitHeader);
document.fonts?.ready.then(fitHeader);
// The header gets its bottom border once the page scrolls under it
const markScrolled = () => $(".topbar").classList.toggle("scrolled", window.scrollY > 4);
window.addEventListener("scroll", markScrolled, { passive: true });

document.addEventListener("click", (e) => {
  const t = e.target;
  // appearance
  const tp = t.closest("[data-theme-pick]");
  if (tp) { S.theme = tp.dataset.themePick; save(); applyTheme(); return render(); }
  const ac = t.closest("[data-accent]");
  if (ac) { S.accent = ac.dataset.accent || null; save(); applyTheme(); return render(); }
  if (t.dataset.fs) { S.fontSize = t.dataset.fs; save(); applyTheme(); return render(); }
  if (t.dataset.dens) { S.density = t.dataset.dens; save(); applyTheme(); return render(); }
  if (t.dataset.shortcuts) { S.keys = t.dataset.shortcuts === "on"; save(); applyTheme(); return rerender(); }
  if (t.closest("#theme-quick")) { S.theme = LIGHT_THEMES.has(resolvedTheme()) ? DEFAULT_THEME : "light"; save(); applyTheme(); return render(); }
  if (t.closest("#settings-open")) return go("settings");
  if (t.closest("#brand")) return go("home");
  // "On this page" jumps: scroll the section under the header and give its heading focus. (A #id link would
  // change the address, which belongs to the router.)
  const jump = t.closest("[data-scrollto]");
  if (jump) {
    // From the folder tree on a phone, the tree folds away first (as it does after picking a page)
    if (jump.closest(".tree") && getComputedStyle($(".tree")).position !== "sticky") rerender();
    const sec = document.getElementById(jump.dataset.scrollto), h = sec && (sec.querySelector("h2, h3") || sec);
    if (!sec) return;
    revealEl("#" + sec.id);
    h.tabIndex = -1; h.focus({ preventScroll: true });
    return;
  }
  const vc = t.closest(".vcard");
  if (vc) {
    vc.outerHTML = `<div class="vcard playing"><div class="video"><iframe src="https://www.youtube-nocookie.com/embed/${vc.dataset.plist ? "videoseries?list=" + vc.dataset.plist + "&" : vc.dataset.vid + "?"}autoplay=1" title="Video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe></div></div>`;
    return;
  }
  if (t.dataset.cdel) { S.companies.splice(+t.dataset.cdel, 1); save(); return render(); }
  switch (t.id) {
    case "c-add": {
      const name = $("#c-name").value.trim(); if (!name) return;
      S.companies.push({ name, tier: +$("#c-tier").value, status: "Researching", note: "" }); save(); return render();
    }
    case "s-export": {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([JSON.stringify(S, null, 2)], { type: "application/json" }));
      a.download = `ai-progress-${today()}.json`; a.click(); return;
    }
    case "s-reset": if (confirm("Delete all progress? This cannot be undone.")) { S = blankState(); save(); searchIndex = null; render(); } return;
  }
});

document.addEventListener("change", (e) => {
  const t = e.target;
  if ("localmkt" in t.dataset) { S.localMarket = t.checked; searchIndex = null; save(); return rerender(); }
  if (t.dataset.cstatus) { S.companies[+t.dataset.cstatus].status = t.value; save(); }
  else if (t.dataset.cnote) { S.companies[+t.dataset.cnote].note = t.value; save(); }
  else if (t.id === "s-import" && t.files[0]) {
    t.files[0].text().then((txt) => {
      // accepts this app's exports and the combined Prep Hub's (whose track progress lives in S.tr)
      try { const d = JSON.parse(txt); if (!d || typeof d !== "object" || !("activity" in d)) throw 0; S = migrateTrackProgress(Object.assign(load(), d)); searchIndex = null; save(); render(); }
      catch (err) { alert("That file isn't a valid progress export."); }
    });
  }
});

applyTheme();
if (location.hash.length > 2) applyPath(location.hash);
render();
markScrolled();
