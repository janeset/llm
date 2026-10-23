"use strict";
// Global search (Ctrl+K or "/"): one index over every content file, built the first time search
// opens. Each entry knows how to open itself, using the same state + go() the pages use.
// Loaded before app.js; it only uses app.js / track globals at call time.

const SEARCH_TYPES = [
  // [type, label, weight, chip]: weight breaks ties between equally good matches; chip tags each result row
  ["command", "Pages & commands", 5, "Go"], ["lesson", "Lessons", 6, "Lesson"], ["claude", "Claude & Anthropic", 5, "Claude"], ["question", "Interview questions", 4, "Question"],
  ["lab", "Labs & projects", 4, "Project"], ["skill", "Role skills", 4, "Skill"], ["posting", "Postings", 4, "Posting"], ["story", "Your stories", 3, "Story"], ["video", "IBM videos", 1, "Video"],
];
// The filter tabs across the top of the palette: [type ("" for everything), label]
const PAL_FILTERS = [["", "All"], ["lesson", "Lessons"], ["question", "Questions"], ["lab", "Projects"], ["video", "Videos"]];
const stripHtml = (h) => String(h || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&[#\w]+;/g, " ").replace(/\s+/g, " ").trim();

// After navigating, bring an element into view under the sticky header and flash it.
function revealEl(sel) {
  const n = document.querySelector(sel);
  if (!n) return;
  n.scrollIntoView({ block: "start" }); window.scrollBy(0, -130);
  n.classList.add("flash"); setTimeout(() => n.classList.remove("flash"), 1600);
}

let searchIndex = null;
function buildSearchIndex() {
  const out = [];
  const add = (type, title, sub, text, open) => out.push({ type, title, sub, open, hay: (title + " " + sub + " " + text).toLowerCase(), text });

  // AI / LLM track and Roles lessons
  ["ai", "roles"].forEach((id) => {
    const T = TRACKS[id];
    T.topics.forEach((t) => add("lesson", t.title, t.zero ? `${T.name} · ${ZERO_PARTS[t.zero]}` : T.name, stripHtml(t.body), () => { trState(id).sel = t.id; go(id + ":learn"); }));
    T.questions.forEach((q) => add("question", q.q, `${T.name} · ${(topicById(T, q.topic) || {}).title || ""}`, q.a, () => {
      (views._trqf = views._trqf || {})[id] = { topic: q.topic, status: "" };
      go(id + ":questions"); revealEl(`[data-trshow="${id}:${q.id}"]`);
      const b = document.querySelector(`[data-trshow="${id}:${q.id}"]`); if (b) b.closest(".card").classList.add("flash");
    }));
    T.labs.forEach((l) => add("lab", l.title, `${T.name} · ${T.labsName}`, (l.goal || "") + " " + (l.stack || ""), () => { views._trlab = l.id; go(id + ":labs"); revealEl("#lab-" + l.id); }));
  });

  // Claude & Anthropic: official courses and certifications, and the OpenAI Academy entry
  CLAUDE.courses.forEach((c, i) => add("claude", c.title, `Claude & Anthropic · Course ${i + 1}`, c.desc, () => { go("claude"); revealEl("#course-" + c.id); }));
  CLAUDE_CERTS.forEach((c) => add("claude", c.name, "Claude & Anthropic · Certification", c.why + " " + CLAUDE.eligibility, () => go("ai:certs")));
  add("claude", "OpenAI Academy", "OpenAI · Courses", OPENAI_LEARN.tracks.map((tr) => [tr.name, tr.audience, tr.desc, ...oaCourses(tr).map(([c]) => c)].join(" ")).join(" ") + " certification not yet verified", () => { go("claude"); revealEl("#openai-learn"); });

  // Roles: skills and postings
  SKILLS.forEach((s) => add("skill", s.name, `Role skill · ${s.area}`, (SKILL_KEYWORDS[s.id] || []).join(" "), () => { views._rlf = { area: s.area, level: "" }; go("roles:skills"); revealEl(`[data-rlconf="${s.id}"]`); }));
  allPostings().forEach((p) => add("posting", `${p.title} · ${p.company}`, `Posting · ${roleById(p.role).name}`, p.summary || "", () => { rlState().role = p.role; go("roles:postings"); revealEl("#posting-" + p.id); }));

  // IBM Technology videos (titles only)
  const seen = new Set();
  IBM_PLAYLIST_GROUPS.forEach((g) => g.lists.forEach((pl) => (IBM_PLAYLIST_VIDEOS[pl.id] || []).forEach(([vid, title]) => {
    if (seen.has(vid)) return; // the same video can sit in several playlists
    seen.add(vid);
    add("video", title, `IBM · ${pl.title}`, "", () => {
      trState("ai").ibmSel = "pl:" + pl.id; (views._ibmPlay = views._ibmPlay || {})[pl.id] = vid; save(); go("ai:ibm");
    });
  })));
  return out;
}

// Stories are user data, so they're added fresh on every search rather than cached.
function storyEntries() {
  return (S.stories || []).map((s) => ({ type: "story", title: s.title || "Untitled story", sub: "STAR story", text: [s.s, s.t, s.a, s.r].join(" "),
    hay: [s.title, s.s, s.t, s.a, s.r, (s.themes || []).join(" ")].join(" ").toLowerCase(), open: () => { views._ivEdit = s.id; go("interview:stories"); } }));
}

// Pages and actions, built fresh each time because "Continue" and the theme toggle depend on current state.
// With an empty query they're what the palette shows, so the next step is always one keystroke away.
function commandEntries() {
  const out = [], add = (title, sub, words, open) => out.push({ type: "command", title, sub, text: "", hay: (title + " " + sub + " " + words).toLowerCase(), open });
  const next = pathNext(TRACKS.ai);
  if (next) add(`Continue: ${next.title}`, "Your next lesson", "next lesson continue resume", () => { trState("ai").sel = next.id; go("ai:learn"); });
  add("Home", "Page", "start today", () => go("home"));
  add("Learn: Overview", "Page", "ai llm course track progress", () => go("ai:overview"));
  add("Learn: Lessons", "Page", "ai llm lessons track", () => go("ai:learn"));
  add("Learn: Roadmap", "Page", "ai llm weeks plan schedule", () => go("ai:roadmap"));
  add("Claude & Anthropic", "Page", "anthropic official courses certifications openai academy", () => go("claude"));
  add("Interview: Mock interview", "Page", "practice timed mock", () => go("interview:mock"));
  add("Roles", "Page", "postings skills readiness jobs", () => go(S.lastTab?.roles || defaultTab("roles")));
  add("Companies", "Page", "tracker applications employers", () => go("companies"));
  add("Settings", "Page", "theme appearance accent backup export shortcuts keyboard", () => go("settings"));
  add("Open the console", "Command · or press `", "terminal console shell commands", () => openConsole());
  const dark = !LIGHT_THEMES.has(resolvedTheme());
  add(`Switch to the ${dark ? "light" : "dark"} theme`, "Command", "theme appearance dark light mode", () => { S.theme = dark ? "light" : "dark"; save(); applyTheme(); render(); });
  return out;
}

function runSearch(q, only = "") {
  q = q.trim().toLowerCase();
  if (!q) return [];
  if (!searchIndex) searchIndex = buildSearchIndex();
  const terms = q.split(/\s+/), weight = Object.fromEntries(SEARCH_TYPES.map(([t, , w]) => [t, w]));
  // Short terms must start a word ("rag" shouldn't match "storage"); longer ones match anywhere.
  const reEsc = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = (t) => new RegExp((t.length < 4 ? "(^|[^a-z0-9])" : "") + reEsc(t));
  const termRes = terms.map(re), phrase = re(q);
  const startRes = terms.map((t) => new RegExp("(^|[^a-z0-9])" + reEsc(t)));
  const hits = [];
  for (const e of searchIndex.concat(storyEntries(), commandEntries())) {
    if (only && e.type !== only) continue;
    if (!termRes.every((r) => r.test(e.hay))) continue;
    const title = e.title.toLowerCase();
    let score = weight[e.type] * 6;
    if (title === q) score += 120; else if (title.startsWith(q)) score += 90; else if (phrase.test(title)) score += 50;
    score += startRes.filter((r) => r.test(title)).length * 20 + termRes.filter((r) => r.test(title)).length * 5;
    if (e.sub.toLowerCase().includes(q)) score += 5;
    hits.push({ e, score });
  }
  hits.sort((a, b) => b.score - a.score || a.e.title.length - b.e.title.length);
  return hits.slice(0, 60).map((h) => h.e);
}

// ~120 characters of body text around the first matching term, with the terms highlighted.
function snippet(e, q) {
  if (!e.text) return "";
  const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean), low = e.text.toLowerCase();
  if (terms.every((t) => e.title.toLowerCase().includes(t))) return esc(e.text.slice(0, 110)) + (e.text.length > 110 ? "…" : "");
  const found = terms.map((t) => low.indexOf(t)).filter((i) => i >= 0);
  if (!found.length) return "";
  const at = Math.min(...found);
  const from = Math.max(0, at - 40), part = e.text.slice(from, from + 130);
  return (from ? "…" : "") + markTerms(part, terms) + (from + 130 < e.text.length ? "…" : "");
}
function markTerms(s, terms) {
  const re = new RegExp("(" + terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")", "gi");
  return s.split(re).map((p, i) => (i % 2 ? `<mark>${esc(p)}</mark>` : esc(p))).join("");
}

// ---------------- dialog ----------------
let searchHits = [], searchPos = 0, palFilter = "", palReturn = null;
// Opens the palette, optionally with a query already typed (the console's `search` command).
function openSearch(q) {
  let dlg = document.getElementById("search-dlg");
  if (!dlg) {
    dlg = document.createElement("dialog");
    dlg.id = "search-dlg";
    dlg.innerHTML = `<div class="search-panel">
      <label class="search">${ICON_SEARCH}<input id="gs-q" placeholder="Search lessons, questions, projects, or type a page..." autocomplete="off" spellcheck="false" aria-label="Search" aria-controls="gs-res"><kbd>esc</kbd></label>
      <div class="pal-tabs" id="gs-tabs" role="tablist" aria-label="Filter results"></div>
      <div id="gs-res" class="gs-res" role="listbox"></div>
      <div class="gs-foot muted"><span><kbd>&uarr;</kbd><kbd>&darr;</kbd> move</span><span><kbd>&crarr;</kbd> open</span><span><kbd>Tab</kbd> filter</span><span class="r"><kbd>\`</kbd> console</span></div></div>`;
    document.body.appendChild(dlg);
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
    // Give focus back to where it was; otherwise it can stay on the hidden input, where keys (Enter included) still reach the palette
    dlg.addEventListener("close", () => {
      if (palReturn && palReturn !== document.body && document.contains(palReturn)) palReturn.focus();
      else if (dlg.contains(document.activeElement)) document.activeElement.blur();
    });
    $("#gs-q", dlg).addEventListener("input", (e) => { searchPos = 0; drawSearch(e.target.value); });
    $("#gs-q", dlg).addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!searchHits.length) return;
        searchPos = (searchPos + (e.key === "ArrowDown" ? 1 : -1) + searchHits.length) % searchHits.length;
        markActive();
      } else if (e.key === "Enter" && searchHits[searchPos]) { e.preventDefault(); pickHit(searchPos); }
      else if (e.key === "Tab") { e.preventDefault(); setPalFilter(PAL_FILTERS[(PAL_FILTERS.findIndex(([t]) => t === palFilter) + (e.shiftKey ? -1 : 1) + PAL_FILTERS.length) % PAL_FILTERS.length][0]); }
    });
    $("#gs-tabs", dlg).addEventListener("click", (e) => { const b = e.target.closest("[data-palf]"); if (b) { setPalFilter(b.dataset.palf); $("#gs-q").focus(); } });
    $("#gs-res", dlg).addEventListener("click", (e) => { const r = e.target.closest("[data-gs]"); if (r) pickHit(+r.dataset.gs); });
    $("#gs-res", dlg).addEventListener("mousemove", (e) => { const r = e.target.closest("[data-gs]"); if (r && +r.dataset.gs !== searchPos) { searchPos = +r.dataset.gs; markActive(); } });
  }
  if (dlg.open) return;
  palReturn = document.activeElement; palFilter = "";
  dlg.showModal();
  const inp = $("#gs-q", dlg);
  if (typeof q === "string") inp.value = q;
  inp.select(); searchPos = 0; drawSearch(inp.value);
}
function setPalFilter(t) { palFilter = t; searchPos = 0; drawSearch($("#gs-q").value); }
const chipOf = (type) => SEARCH_TYPES.find(([t]) => t === type)[3];
const hitRow = (h, i, terms, sn) => `<div class="gs-hit" role="option" data-gs="${i}"><div><div class="gs-t">${terms ? markTerms(h.title, terms) : esc(h.title)}</div>
  <div class="gs-s muted">${esc(h.sub)}</div>${sn ? `<div class="gs-x muted">${sn}</div>` : ""}</div><span class="chip">${esc(chipOf(h.type))}</span></div>`;
function drawSearch(q) {
  const box = $("#gs-res"), hits = runSearch(q, palFilter);
  // Filter tabs, with how many results each would show for this query
  const all = q.trim() ? runSearch(q) : [];
  $("#gs-tabs").innerHTML = PAL_FILTERS.map(([t, l]) => {
    const n = q.trim() ? all.filter((h) => !t || h.type === t).length : 0;
    return `<button role="tab" data-palf="${t}" aria-selected="${t === palFilter}" class="${t === palFilter ? "on" : ""}">${l}${n ? ` <small>${n > 59 ? "60+" : n}</small>` : ""}</button>`;
  }).join("");
  if (!q.trim()) {
    if (palFilter) { searchHits = []; box.innerHTML = `<div class="gs-empty muted">Type to search ${esc(PAL_FILTERS.find(([t]) => t === palFilter)[1].toLowerCase())}.</div>`; return; }
    searchHits = commandEntries();
    box.innerHTML = `<div class="gs-group">Jump to</div>` + searchHits.map((h, i) => hitRow(h, i)).join("") +
      `<div class="gs-empty muted">Or search lessons, questions, projects, postings and videos. Try <b>rag</b>, <b>embeddings</b> or <b>agents</b>.</div>`;
    markActive();
    return;
  }
  // grouped by type, groups ordered by their best hit; each row carries its type
  const groups = [];
  hits.forEach((h) => { let g = groups.find((x) => x.type === h.type); if (!g) groups.push((g = { type: h.type, list: [] })); if (g.list.length < (palFilter ? 40 : 8)) g.list.push(h); });
  searchHits = groups.flatMap((g) => g.list);
  if (!searchHits.length) { box.innerHTML = `<div class="gs-empty muted">No results for "${esc(q)}"${palFilter ? " in this filter. Press Tab for the others" : ""}.</div>`; return; }
  const terms = q.trim().toLowerCase().split(/\s+/);
  box.innerHTML = searchHits.map((h, i) => hitRow(h, i, terms, snippet(h, q))).join("");
  markActive();
}
function markActive() {
  document.querySelectorAll("#gs-res .gs-hit").forEach((n) => {
    const on = +n.dataset.gs === searchPos;
    n.classList.toggle("on", on); n.setAttribute("aria-selected", on);
    if (on) n.scrollIntoView({ block: "nearest" });
  });
}
function pickHit(i) {
  const h = searchHits[i];
  document.getElementById("search-dlg").close();
  if (h) h.open();
}

document.addEventListener("keydown", (e) => {
  const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
  if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); openSearch(); }
  else if (e.key === "/" && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); openSearch(); }
});
document.addEventListener("click", (e) => { if (e.target.closest("#search-open, [data-open-search]")) openSearch(); });
