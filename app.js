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
const THEMES = [
  { id: "system", name: "System", desc: "Follows your device" },
  { id: "light", name: "Paper", desc: "Blueprint paper, indigo" },
  { id: "dark", name: "Ink", desc: "Deep navy, teal accent" },
  { id: "midnight", name: "Midnight", desc: "Deep blue night" },
  { id: "nord", name: "Nord", desc: "Arctic, muted blues" },
  { id: "sand", name: "Sand", desc: "Warm paper tones" },
  { id: "forest", name: "Forest", desc: "Dark with green accent" },
  { id: "rose", name: "Rosé", desc: "Soft and light" },
  { id: "contrast", name: "High contrast", desc: "Maximum legibility" },
];
const LIGHT_THEMES = new Set(["light", "sand", "rose"]);
const ACCENTS = ["#5b5bd6", "#2f6fed", "#0f9d8f", "#16a34a", "#ea580c", "#e11d48", "#8b5cf6"];
const darkQuery = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;
const resolvedTheme = () => { const t = S.theme || "system"; return t === "system" ? (darkQuery && darkQuery.matches ? "dark" : "light") : t; };
const ICON_SUN = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>`;
const ICON_MOON = `<svg viewBox="0 0 24 24"><path d="M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z"/></svg>`;
function applyTheme() {
  const r = document.documentElement, t = resolvedTheme();
  r.dataset.theme = t;
  r.dataset.density = S.density || "comfortable";
  r.dataset.keys = S.keys === false ? "off" : "on";
  r.style.fontSize = { s: "14px", m: "15px", l: "16.5px" }[S.fontSize || "m"];
  if (S.accent) r.style.setProperty("--accent", S.accent); else r.style.removeProperty("--accent");
  const q = document.getElementById("theme-quick");
  if (q) q.innerHTML = LIGHT_THEMES.has(t) ? ICON_MOON : ICON_SUN;
}
if (darkQuery) darkQuery.addEventListener("change", () => { if ((S.theme || "system") === "system") { applyTheme(); if (tab === "settings") render(); } });

// ---------- helpers ----------
const ICON_SEARCH = `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>`;
const pageHead = (title, sub = "") => `<div class="page-head"><h2>${title}</h2>${sub ? `<p class="muted">${sub}</p>` : ""}</div>`;
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
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
    ${TIERS.map((t) => `<div class="card"><div class="row between"><h3 style="margin:0">${esc(t.name)}</h3><span class="pill">${esc(t.bar)}</span></div>
      <p>${esc(t.emphasis)}</p>
      ${local ? `<p><b>Toronto &amp; KW examples:</b> ${t.names.map((n) => `<span class="tag">${esc(n)}</span>`).join("")}</p>` : ""}</div>`).join("")}
    <div class="card"><h3 style="margin-top:0">My application tracker</h3>
      <div class="row"><input id="c-name" placeholder="Company"><select id="c-tier">${TIERS.map((t) => `<option value="${t.id}">${esc(t.name)}</option>`).join("")}</select>
      <button class="btn primary" id="c-add">Add</button></div>
      ${S.companies.length ? `<table><tr><th>Company</th><th class="hide-sm">Tier</th><th>Status</th><th>Notes</th><th></th></tr>${S.companies.map((c, i) => `<tr>
        <td>${esc(c.name)}</td><td class="hide-sm muted">${esc(tierName(c.tier))}</td>
        <td><select data-cstatus="${i}">${STATUSES.map((s) => `<option ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}</select></td>
        <td><input data-cnote="${i}" value="${esc(c.note)}" placeholder="Interview date, contact..."></td>
        <td class="actions">${c.posting && allPostings().some((p) => p.id === c.posting) ? `<button class="btn small ghost" data-rlview="${esc(c.posting)}">Posting</button>` : ""}<button class="btn small" data-cdel="${i}">Remove</button></td></tr>`).join("")}</table>` : `<p class="muted">Add companies you're applying to, or add them from a posting in Roles.</p>`}</div>`;
  },

  settings() {
    const cur = S.theme || "system", T = TRACKS.ai, st = trState("ai");
    const prev = (id) => `<div class="tp" data-theme="${id}"><div class="tp-card"><i class="l1"></i><i class="l2"></i><div class="row2"><i class="acc"></i><i class="ok"></i></div></div></div>`;
    const seg = (attr, val, opts) => `<div class="seg">${opts.map(([v, l]) => `<button ${attr}="${v}" class="${val === v ? "on" : ""}">${l}</button>`).join("")}</div>`;
    return pageHead("Settings", "Appearance, your plan, and backups. Everything is saved in this browser.") + `
      <div class="card">
        <div class="section-head"><h3>Theme</h3><span class="muted">Now showing: ${esc(THEMES.find((t) => t.id === resolvedTheme())?.name || "")}</span></div>
        <div class="theme-grid">${THEMES.map((t) => `<button class="theme-card ${cur === t.id ? "on" : ""}" data-theme-pick="${t.id}">
          <div class="theme-prev">${t.id === "system" ? prev("light") + prev("dark") : prev(t.id)}</div>
          <div class="theme-meta"><span>${esc(t.name)}</span>${cur === t.id ? '<span class="check">&#10003;</span>' : ""}</div>
          <div class="theme-desc">${esc(t.desc)}</div></button>`).join("")}</div>
        <div class="setting"><div><b>Accent color</b><div class="muted">Use the theme's own accent, or pick one.</div></div>
          <div class="swatches"><button class="swatch auto ${!S.accent ? "on" : ""}" data-accent="" title="Theme default"></button>
            ${ACCENTS.map((c) => `<button class="swatch ${S.accent === c ? "on" : ""}" data-accent="${c}" style="background:${c}" title="${c}"></button>`).join("")}</div></div>
        <div class="setting"><div><b>Text size</b><div class="muted">Scales the whole interface.</div></div>
          ${seg("data-fs", S.fontSize || "m", [["s", "Small"], ["m", "Default"], ["l", "Large"]])}</div>
        <div class="setting"><div><b>Density</b><div class="muted">Compact tightens spacing in cards and lists.</div></div>
          ${seg("data-dens", S.density || "comfortable", [["comfortable", "Comfortable"], ["compact", "Compact"]])}</div>
      </div>
      <div class="card"><h3>Keyboard</h3>
        <div class="setting"><div><b>Single-key shortcuts</b><div class="muted">The letter beside each page in the top bar opens it (<kbd>H</kbd> Home, <kbd>A</kbd> AI / LLM, <kbd>S</kbd> Settings...), and <kbd>\`</kbd> opens the console. They never fire while you're typing. Turn them off if they get in the way of a screen reader or voice control.</div></div>
          ${seg("data-shortcuts", S.keys === false ? "off" : "on", [["on", "On"], ["off", "Off"]])}</div>
        <div class="setting"><div><b>Always on</b><div class="muted"><kbd>Ctrl</kbd> <kbd>K</kbd> or <kbd>/</kbd> opens search, where <kbd>Tab</kbd> switches the filter. The console button in the top bar opens the console.</div></div></div>
      </div>
      <div class="card"><h3>Your plan</h3>
        <div class="setting"><div><b>Where you're starting from</b><div class="muted">New to AI: AI from zero comes first. Know the basics: start at machine learning fundamentals, with AI from zero as an option.</div></div>
          ${seg("data-level", S.level || "new", LEVELS)}</div>
        <div class="setting"><div><b>${esc(T.name)} start date</b><div class="muted">${st.start ? `Week ${trackWeek("ai")} of ${T.weeks.length}.` : "Not started. Pick a date or start it from the track's Overview."}</div></div>
          <input type="date" data-trstartdate="ai" value="${st.start || ""}"></div>
      </div>
      <div class="card"><h3>Backup</h3>
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
  const sec = sectionOf(tab);
  if (sec === "ai") $("#view").innerHTML = trackView(sec, tab.split(":")[1]);
  else if (sec === "roles") $("#view").innerHTML = roleView(tab.split(":")[1]);
  else if (sec === "interview") $("#view").innerHTML = interviewView(tab.split(":")[1]);
  else $("#view").innerHTML = (views[tab] || views.home)();
  renderNav();
  syncUrl();
}
$("#nav").addEventListener("click", (e) => {
  const b = e.target.closest("button");
  if (!b) return;
  if (b.dataset.track) { const k = b.dataset.track; go(S.lastTab?.[k] || defaultTab(k)); }
  else if (b.dataset.nav) go(b.dataset.nav);
});
$("#subnav").addEventListener("click", (e) => { const b = e.target.closest("button[data-tab]"); if (b) go(b.dataset.tab); });

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
  if (t.closest("#theme-quick")) { S.theme = LIGHT_THEMES.has(resolvedTheme()) ? "dark" : "light"; save(); applyTheme(); return render(); }
  if (t.closest("#brand")) return go("home");
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
