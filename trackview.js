"use strict";
// Track engine for AI / LLM Prep (data in ai.js, ai-more.js, ai-zero.js) and the Roles lessons, plus the
// Home page. Loaded before app.js; it only calls app.js helpers (esc, $, vids, yt, execPy, render, S, save,
// today, dayDiff, streak...) at event/render time, after app.js has run.

TRACKS.ai = AI;

const TRACK_TABS = (id) => TRACKS[id].tabs || [["overview", "Overview"], ["roadmap", "Roadmap"], ["learn", "Learn"], ["questions", "Questions"], ["quiz", "Quiz"], ["labs", TRACKS[id].labsName], ["certs", "Certs"]];
const CERT_STATUSES = ["Not planned", "Planning", "Studying", "Booked", "Passed"];
const TRACK_ICON = {
  ai: `<svg viewBox="0 0 24 24"><path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/></svg>`,
};

function sectionOf(t) {
  const m = /^(ai|roles|interview):/.exec(t);
  return m ? m[1] : null;
}

function trState(id) {
  S.tr = S.tr || {};
  S.tr[id] = Object.assign({ start: null, read: {}, qa: {}, quiz: {}, labs: {}, certs: {}, ex: {}, sel: null }, S.tr[id] || {});
  return S.tr[id];
}
function bump() { const t = today(); S.activity[t] = (S.activity[t] || 0) + 1; }
function trackWeek(id) {
  const st = trState(id), T = TRACKS[id];
  if (!st.start) return 0;
  return Math.min(T.weeks.length, Math.max(1, Math.floor(dayDiff(st.start, today()) / 7) + 1));
}
const labDone = (id, lab) => lab.steps.every((_, k) => trState(id).labs[`${lab.id}:${k}`]);
const labSteps = (id, lab) => lab.steps.filter((_, k) => trState(id).labs[`${lab.id}:${k}`]).length;
// Cross-links can name a track this version doesn't have; those come back undefined.
const topicById = (T, tid) => (T ? T.topics.find((t) => t.id === tid) : undefined);
const channelLink = (T, prefix = "") => T.channel ? `<a class="btn small ghost" href="${T.channel.url}" target="_blank" rel="noopener">${prefix}${esc(T.channel.name)} channel &nearr;</a>` : "";
const goLearn = (id, tid) => `data-trgo="${id}|learn|${tid}"`;
// `code` spans and **bold** in hints and notes (the text is escaped first).
const md = (s) => esc(s).replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>");

// ---------------- learning path & completion ----------------
// Where the learner is starting from (S.level): "new" puts AI from zero (ai-zero.js, topics with `zero` set)
// first; "code" keeps the topic order and leaves the beginner lessons as optional extras. Unset counts as new
// until the learner picks.
const LEVELS = [["new", "New to AI"], ["code", "I know the AI basics"]];
const beginnerLevel = () => S.level !== "code";
const ZERO_PARTS = { ai: "AI from zero" };
// Shown at the top of every AI from zero lesson: the exercises assume some Python, and this app doesn't teach it.
// The Python prerequisite: the app doesn't teach Python, so it points to one free course (checked on its own site).
const PY_COURSE = { name: "Kaggle Learn: Python", url: "https://www.kaggle.com/learn/python", verified: "2026-10-13" };
const pyCourseLink = () => `<a href="${PY_COURSE.url}" target="_blank" rel="noopener">Learn the Python basics first</a> (${esc(PY_COURSE.name)}, free, about 5 hours; ${verifiedTag(PY_COURSE.verified)})`;
const ZERO_PY_NOTE_HTML = () => `<p class="callout zero-note">These exercises use a little Python: functions, lists, loops and dictionaries. New to Python? ${pyCourseLink()}.</p>`;
// Exercise progress is keyed by each exercise's stable `key`, so reordering exercises never moves progress.
const exKey = (id, tid, ex) => `${id}:${tid}-${ex.key}`;
const exPassed = (id, t) => (t.exercises || []).filter((ex) => trState(id).ex[exKey(id, t.id, ex)]).length;
// A lesson without exercises is completed by its checks: the quiz questions on that topic, all answered correctly.
function topicChecks(T, tid) {
  const t = topicById(T, tid);
  return t && t.exercises && t.exercises.length ? [] : T.quiz.filter((q) => q.topic === tid);
}
function topicDone(T, t) {
  if (t.exercises && t.exercises.length) return exPassed(T.id, t) === t.exercises.length;
  const qs = topicChecks(T, t.id), st = trState(T.id);
  return qs.length > 0 && qs.every((q) => st.quiz[q.id] === true);
}
// Lessons in sidebar order. Learners who already code skip the beginner lessons.
function learnPath(T) {
  const ts = T.groups.flatMap(([, ids]) => ids).map((tid) => topicById(T, tid));
  return beginnerLevel() ? ts : ts.filter((t) => !t.zero);
}
const pathNext = (T) => learnPath(T).find((t) => !topicDone(T, t));
const zeroLessons = (T, part) => T.groups.flatMap(([, ids]) => ids).map((tid) => topicById(T, tid)).filter((t) => t.zero && (!part || t.zero === part));
// The lesson Learn opens on when none is selected: the next unfinished one on the path.
const defaultLesson = (T) => (pathNext(T) || learnPath(T)[0]).id;

// Progress saved before exercises had stable keys used each exercise's position (ai:apis-0). Every old key
// maps to the exercise's key now; the softmax exercise moved from How LLMs work to the Sampling lesson.
// roles:aiobs-0 (log redaction) isn't here: it repeated the Safety exercise, so it was replaced.
const EX_MOVED = {
  ai: {
    "foundations-0": "sampling-softmax", "apis-0": "apis-cost", "apis-1": "apis-turn", "prompting-0": "prompting-render",
    "structured-0": "structured-parsejson", "embeddings-0": "embeddings-cosine", "embeddings-1": "embeddings-topk",
    "vectorstores-0": "vectorstores-chunk", "rag-0": "rag-prompt", "rag-1": "rag-recall", "tools-0": "tools-dispatch",
    "agents-0": "agents-loop", "evals-0": "evals-accuracy", "evals-1": "evals-run", "safety-0": "safety-redact",
    "safety-1": "safety-wrap", "llmops-0": "llmops-lru", "mlbasics-0": "mlbasics-confusion", "mlbasics-1": "mlbasics-prf1",
    "tokenization-0": "tokenization-bpe", "tokenization-1": "tokenization-history", "customization-0": "customization-dataset",
    "multimodal-0": "multimodal-imageblock", "cloudai-0": "cloudai-region",
  },
  roles: {
    "selfhost-0": "selfhost-gpumem", "entagents-0": "entagents-retry", "entagents-1": "entagents-review",
    "permrag-0": "permrag-secure", "aifrontend-0": "aifrontend-sse", "integration-0": "integration-sync",
    "mfgdata-0": "mfgdata-bom", "gpucloud-0": "gpucloud-replicas",
  },
};
// Runs on load and on import. Old "Mark as reviewed" ticks (st.read) are kept in the data but no longer
// count: lessons are complete only when their exercises or checks pass.
function migrateTrackProgress(s) {
  for (const [id, moves] of Object.entries(EX_MOVED)) {
    const st = s.tr && s.tr[id], code = s.code || {};
    for (const [from, to] of Object.entries(moves)) {
      const f = `${id}:${from}`, t = `${id}:${to}`;
      if (st && st.ex) { if (st.ex[f] && !st.ex[t]) st.ex[t] = true; delete st.ex[f]; }
      if (code["tx:" + f] != null && code["tx:" + t] == null) code["tx:" + t] = code["tx:" + f];
      delete code["tx:" + f];
    }
  }
  if (s.level !== "new" && s.level !== "code") delete s.level;
  // The Python beginner lessons were removed. Their exercise progress (ai:pz-*) stays in the data so old backups still
  // round-trip, but a saved selection pointing at one of its lessons falls back to the learning path.
  if (s.tr && s.tr.ai && /^pz-/.test(s.tr.ai.sel || "")) s.tr.ai.sel = null;
  return s;
}

function trackProgress(id) {
  const T = TRACKS[id], st = trState(id), path = learnPath(T);
  const done = path.filter((t) => topicDone(T, t)).length, labs = T.labs.filter((l) => labDone(id, l)).length;
  const answered = Object.keys(st.quiz).length, correct = Object.values(st.quiz).filter(Boolean).length;
  const got = T.questions.filter((q) => st.qa[q.id] === "got").length;
  const exTotal = path.reduce((n, t) => n + (t.exercises || []).length, 0), exDone = path.reduce((n, t) => n + exPassed(id, t), 0);
  const units = path.length + T.labs.length;
  return { done, lessons: path.length, labs, answered, correct, got, exTotal, exDone, pct: units ? (done + labs) / units : 0 };
}
function ring(pct, label, size = 120) {
  const C = 2 * Math.PI * 52;
  return `<div class="ring" style="width:${size}px;height:${size}px"><svg viewBox="0 0 120 120"><circle class="track" cx="60" cy="60" r="52" fill="none" stroke-width="10"/>
    <circle class="prog" cx="60" cy="60" r="52" fill="none" stroke-width="10" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - pct)}"/></svg>
    <div class="ring-label"><b>${Math.round(pct * 100)}%</b><span>${label}</span></div></div>`;
}

// ---------------- navigation ----------------
function renderNav() {
  const sec = sectionOf(tab);
  document.querySelectorAll("#nav button").forEach((b) => b.classList.toggle("active", (b.dataset.nav && b.dataset.nav === tab) || (!!b.dataset.track && b.dataset.track === sec)));
  showActiveNav();
  const sub = $("#subnav");
  if (!sub) return;
  if (!sec) { sub.hidden = true; sub.innerHTML = ""; return; }
  const items = sec === "interview" ? IV_TABS.map(([k, l]) => ["interview:" + k, l]) : TRACK_TABS(sec).map(([k, l]) => [sec + ":" + k, l]);
  sub.hidden = false;
  sub.innerHTML = `<div class="subnav-inner"><span class="subnav-title t-${sec}">${TRACK_ICON[sec]}${sec === "interview" ? "Interview" : esc(TRACKS[sec].name)}</span>
    <div class="subnav-tabs">${items.map(([k, l]) => `<button data-tab="${k}" class="${k === tab ? "active" : ""}">${esc(l)}</button>`).join("")}</div></div>`;
}
// On narrow screens the main nav scrolls sideways: keep the current tab in view, and fade the edge
// that has more tabs behind it so people know to swipe.
function navEdges() {
  const n = $("#nav");
  n.classList.toggle("more-left", n.scrollLeft > 1);
  n.classList.toggle("more-right", n.scrollLeft + n.clientWidth < n.scrollWidth - 1);
}
let navWatched = false;
function showActiveNav() {
  const n = $("#nav"), a = n.querySelector("button.active");
  if (!navWatched) { n.addEventListener("scroll", navEdges, { passive: true }); new ResizeObserver(navEdges).observe(n); navWatched = true; }
  if (a && n.scrollWidth > n.clientWidth) {
    const l = a.offsetLeft - n.offsetLeft, r = l + a.offsetWidth;
    if (l < n.scrollLeft) n.scrollLeft = l - 24;
    else if (r > n.scrollLeft + n.clientWidth) n.scrollLeft = r - n.clientWidth + 24;
  }
  navEdges();
}
// The page a top-level section opens on the first time.
const defaultTab = (k) => (k === "interview" ? "interview:mock" : k + ":overview");
function go(t) {
  tab = t;
  const s = sectionOf(t);
  if (s) { S.lastTab = S.lastTab || {}; S.lastTab[s] = t; save(); }
  render();
  window.scrollTo(0, 0);
}

// ---------------- home ----------------
const levelPick = () => `<div class="card level-pick"><h3 style="margin-top:0">Where are you starting from?</h3>
  <p class="muted">This sets the order of the lessons. You can change it any time in Settings.</p>
  <div class="level-opts">
    <button class="level-opt" data-level="new"><b>New to AI</b><span class="muted">Start with AI from zero (what a model, training and an LLM are), then machine learning fundamentals. You need a little Python.</span></button>
    <button class="level-opt" data-level="code"><b>I know the AI basics</b><span class="muted">Skip AI from zero and start at machine learning fundamentals. AI from zero stays available as an option.</span></button>
  </div>
  <p class="muted" style="margin-bottom:0">New to Python? ${pyCourseLink()}.</p></div>`;

// The beginner lessons on Home: first for new learners, marked optional for people who already code.
function zeroHomeCard() {
  const T = TRACKS.ai, opt = !beginnerLevel();
  const part = (p) => {
    const ls = zeroLessons(T, p), n = ls.filter((t) => topicDone(T, t)).length;
    return `<div><div class="section-head"><h3 style="margin:0">${esc(ZERO_PARTS[p])}</h3><span class="muted">${n} / ${ls.length} lessons</span></div>
      <div class="list">${ls.map((t, i) => `<div class="li"><div><span class="t">${i + 1}. ${esc(t.title)}</span><div class="muted">${exPassed("ai", t)} / ${t.exercises.length} exercises</div></div>
        <div class="row">${topicDone(T, t) ? '<span class="badge done">Done</span>' : ""}<button class="btn small" ${goLearn("ai", t.id)}>Open</button></div></div>`).join("")}</div></div>`;
  };
  return `<div class="card zero-card ${opt ? "optional" : ""}"><div class="section-head"><h3 style="margin:0">${opt ? "AI from zero (optional)" : "AI from zero: the beginner lessons"}</h3></div>
    <p class="muted">${opt ? "Skip these if you know the basics, or use them to fill gaps: what models, training and LLMs are, in plain language." : "No machine-learning background needed. Each lesson explains one idea step by step with a worked example, then gives you small exercises that run right here in the browser, each with an example, a hint and a model answer. Nothing needs an API key."}</p>
    ${ZERO_PY_NOTE_HTML()}${part("ai")}</div>`;
}

function homeView() {
  const hr = new Date().getHours(), hello = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
  const dateStr = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
  const st = streak(), todayCount = S.activity[today()] || 0;
  const T = TRACKS.ai, s = trState("ai"), wk = trackWeek("ai"), next = pathNext(T);
  // Before the first passed exercise, Home shows one action (Start here) and no zero-valued stats.
  // Only current exercises count: hidden progress kept from removed lessons (pz-*) doesn't.
  const started = Object.keys(TRACKS).some((id) => TRACKS[id].topics.some((t) => exPassed(id, t)));
  const main = !next ? `<button class="btn primary" data-trgo="ai|quiz|">Every lesson done. Take a quiz &rarr;</button>`
    : started ? `<button class="btn primary" ${goLearn("ai", next.id)}>Continue: ${esc(next.title)} &rarr;</button>`
    : `<button class="btn primary btn-lg" ${goLearn("ai", next.id)}>Start here &rarr;</button><span class="muted">First lesson: ${esc(next.title)}</span>`;

  const trackCard = (id) => {
    const T = TRACKS[id], s = trState(id), p = trackProgress(id), wk = trackWeek(id);
    const w = wk ? T.weeks[wk - 1] : T.weeks[0], nextTopic = pathNext(T);
    return `<div class="card track-card t-${id}">
      <div class="tc-head"><span class="tc-icon">${TRACK_ICON[id]}</span><div><h3>${esc(T.name)}</h3><p class="muted">${esc(T.tagline)}</p></div></div>
      <div class="tc-body">${ring(p.pct, `${p.done + p.labs}/${p.lessons + T.labs.length} done`, 104)}
        <div class="tc-meta"><div class="label">${wk ? `Week ${wk} of ${T.weeks.length}` : "Not started"}</div><div>${esc(w.title)}</div>
          ${nextTopic ? `<div class="muted">Next: ${esc(nextTopic.title)}</div>` : ""}
          ${p.answered ? `<span class="badge plain">Quiz ${Math.round(100 * p.correct / p.answered)}%</span>` : ""}</div></div>
      <div class="row">${s.start ? `<button class="btn primary" data-track-go="${id}">Continue &rarr;</button>` : `<button class="btn primary" data-trstart="${id}">Start the ${T.weeks.length}-week plan</button><button class="btn ghost" data-track-go="${id}">Explore</button>`}</div></div>`;
  };

  return `<section class="card hero home-hero">
      <div style="position:relative;z-index:1">
        <div class="eyebrow">${esc(dateStr)}</div>
        <h1>${hello}.</h1>
        <p>AI engineering prep for LLM roles: short lessons with small Python exercises checked right in your browser, then hands-on projects. You need basic Python; no API key needed to start.</p>
        <div class="row" style="margin-top:14px">${main}</div>
      </div>
    </section>
    ${S.level ? "" : levelPick()}
    ${started ? `<div class="row home-stats"><span class="badge plain">&#128293; ${st} day streak</span><span class="badge plain">${todayCount} thing${todayCount === 1 ? "" : "s"} done today</span></div>` : ""}
    ${zeroHomeCard()}
    ${started ? `<div class="track-grid">${trackCard("ai")}${rolesHomeCard()}</div>` : ""}
    <div class="cols-2">
      <div class="card"><h3>A sustainable weekly rhythm</h3>
        <table><tr><th>Day</th><th>Focus</th></tr>
          <tr><td>Mon / Wed</td><td>One lesson + its exercises (60 min)</td></tr>
          <tr><td>Tue / Thu</td><td>The week's build: build, evaluate, write it up (90 min)</td></tr>
          <tr><td>Fri</td><td>Interview questions out loud, or a mock interview (45 min)</td></tr>
          <tr><td>Sat</td><td>The week's third lesson, or its videos and a practice quiz (60 min)</td></tr>
          <tr><td>Sun</td><td>Finish the build's README, light review, plan the week (60-90 min)</td></tr></table>
        <p class="muted">Employers want evidence: a deployed RAG or agent project with an eval harness beats any certificate.</p></div>
      <div class="card"><div class="section-head"><h3>Your ${T.weeks.length} weeks</h3><button class="btn small ghost" data-trgo="ai|roadmap|">Roadmap &rarr;</button></div><div class="list">
        ${beginnerLevel() ? `<div class="li"><div><span class="t">Before week 1</span><div class="muted">AI from zero, at your own pace</div></div></div>` : ""}
        ${T.weeks.map((w) => `<div class="li"><div><span class="t">Week ${w.n}</span><div class="muted">${esc(w.title)}</div></div>${w.n === wk ? '<span class="badge accent">This week</span>' : ""}</div>`).join("")}
      </div>${s.start ? "" : `<p class="muted">Start the plan from the track card to track your current week.</p>`}</div>
    </div>`;
}

// ---------------- track pages ----------------
function trackView(id, sub) {
  const T = TRACKS[id], st = trState(id);
  switch (sub) {
    case "roadmap": return trRoadmap(T, st);
    case "learn": return trLearn(T, st);
    case "questions": return trQuestions(T, st);
    case "quiz": return trQuiz(T, st);
    case "labs": return trLabs(T, st);
    case "certs": return trCerts(T, st);
    case "ibm": return ibmView(T, st);
    default: return trOverview(T, st);
  }
}

// "2 / 4 exercises" (or checks) under a lesson in lists.
function topicCount(T, t) {
  if (t.exercises && t.exercises.length) return `${exPassed(T.id, t)} / ${t.exercises.length} exercises`;
  const qs = topicChecks(T, t.id), st = trState(T.id);
  return qs.length ? `${qs.filter((q) => st.quiz[q.id] === true).length} / ${qs.length} checks` : "";
}
function topicRow(T, st, tid) {
  const t = topicById(T, tid);
  return `<div class="li"><div><span class="t">${esc(t.title)}</span><div class="muted">${topicCount(T, t)}</div></div>
    <div class="row">${topicDone(T, t) ? '<span class="badge done">Done</span>' : '<span class="badge">To do</span>'}<button class="btn small" ${goLearn(T.id, tid)}>Open</button></div></div>`;
}
function labRow(T, lab) {
  const n = labSteps(T.id, lab);
  return `<div class="li"><div><span class="t">${esc(lab.title)}</span><div class="muted">${esc(T.labsName.slice(0, -1))} · ${esc(lab.level)} · ${esc(lab.time)}</div></div>
    <div class="row"><span class="badge ${n === lab.steps.length ? "done" : ""}">${n}/${lab.steps.length} steps</span><button class="btn small" data-trgo="${T.id}|labs|${lab.id}">Open</button></div></div>`;
}

function trOverview(T, st) {
  const id = T.id, p = trackProgress(id), wk = trackWeek(id), w = wk ? T.weeks[wk - 1] : T.weeks[0];
  const nextTopic = pathNext(T);
  return `<section class="card hero t-${id}">
      <div style="position:relative;z-index:1">
        <div class="eyebrow">${wk ? `Week ${wk} of ${T.weeks.length}` : "Not started yet"}</div>
        <h1>${esc(T.name)}</h1>
        <p>${esc(T.tagline)}. ${wk ? `This week: <b style="color:var(--text)">${esc(w.title)}</b>.` : `${T.weeks.length} weeks, a build every week, about 8 hours a week.`}</p>
        <div class="row" style="margin-top:14px">
          ${nextTopic ? `<button class="btn primary" ${goLearn(id, nextTopic.id)}>${p.done ? "Continue" : "Start here"}: ${esc(nextTopic.title)} &rarr;</button>` : `<button class="btn primary" data-trgo="${id}|quiz|">Take a quiz &rarr;</button>`}
          ${st.start ? "" : `<button class="btn" data-trstart="${id}">Start the ${T.weeks.length}-week plan</button>`}
          <button class="btn" data-trgo="${id}|roadmap|">View roadmap</button>
        </div>
      </div>
      ${ring(p.pct, `${p.done + p.labs}/${p.lessons + T.labs.length} done`)}
    </section>
    <div class="grid">
      <div class="card"><div class="label">Lessons completed</div><div class="stat">${p.done}<small> / ${p.lessons}</small></div><div class="bar"><i style="width:${(100 * p.done / p.lessons) | 0}%"></i></div><div class="muted">${p.exDone}/${p.exTotal} exercises passed</div></div>
      <div class="card"><div class="label">Questions mastered</div><div class="stat">${p.got}<small> / ${T.questions.length}</small></div><div class="muted">Interview question bank</div></div>
      <div class="card"><div class="label">Quiz accuracy</div><div class="stat">${p.answered ? Math.round(100 * p.correct / p.answered) + "%" : "-"}</div><div class="muted">${p.answered} answered</div></div>
      <div class="card"><div class="label">${esc(T.labsName)} completed</div><div class="stat">${p.labs}<small> / ${T.labs.length}</small></div><div class="muted">Self-reported: you tick the steps</div></div>
    </div>
    <div class="cols-2">
      <div class="card"><div class="section-head"><h3>${wk ? "This week" : "Week 1 preview"} · ${esc(w.title)}</h3></div>
        <p class="muted">${esc(w.goal)}</p>
        ${!wk && beginnerLevel() && zeroLessons(T).some((t) => !topicDone(T, t)) ? `<p class="muted">New to AI? Do <button class="link-btn inline-link" ${goLearn(id, zeroLessons(T)[0].id)}>AI from zero</button> first.</p>` : ""}
        <div class="list">${w.topics.map((t) => topicRow(T, st, t)).join("")}${w.labs.map((l) => labRow(T, T.labs.find((x) => x.id === l))).join("")}
          ${!w.topics.length && !w.labs.length ? `<div class="li"><span>Review week: quizzes and the question bank.</span><button class="btn small" data-trgo="${id}|quiz|">Quiz</button></div>` : ""}</div></div>
      <div class="card"><div class="section-head"><h3>Certifications</h3><button class="btn small ghost" data-trgo="${id}|certs|">All certs &rarr;</button></div>
        <div class="list">${T.certs.map((c) => `<div class="li"><div><span class="t">${esc(c.code)}</span><div class="muted">${esc(c.name)}</div></div><span class="badge ${st.certs[c.id]?.status === "Passed" ? "done" : "plain"}">${esc(st.certs[c.id]?.status || "Not planned")}</span></div>`).join("")}</div></div>
    </div>
    <div class="card"><div class="section-head"><h3>Full courses</h3><span class="row">${verifiedTag(VIDEOS_VERIFIED)}${channelLink(T, "Recommended channel: ")}</span></div>${vids(T.videos.courses)}</div>`;
}

function trRoadmap(T, st) {
  const wk = trackWeek(T.id), zero = zeroLessons(T);
  const zeroBlock = zero.length ? (() => {
    const done = zero.filter((t) => topicDone(T, t)).length;
    return `<details class="card week" ${beginnerLevel() && done < zero.length ? "open" : ""}>
      <summary><span style="flex:1">${beginnerLevel() ? "Before week 1 · AI from zero" : "Optional · AI from zero"}</span><span class="muted">${done}/${zero.length}</span></summary>
      <p class="muted">${beginnerLevel() ? "For people new to AI. Take them at your own pace before the weekly plan starts." : "Plain-language AI basics, if you want a refresher."}</p>
      <div class="list">${zero.map((t) => topicRow(T, st, t.id)).join("")}</div></details>`;
  })() : "";
  return pageHead(`${esc(T.name)} roadmap`, `${T.weeks.length} weeks. ${st.start ? `Started ${st.start}; change the date in Settings.` : "Start the plan from the Overview to track your current week."}`) + zeroBlock +
    T.weeks.map((w) => {
      const done = w.topics.filter((t) => topicDone(T, topicById(T, t))).length + w.labs.filter((l) => labDone(T.id, T.labs.find((x) => x.id === l))).length, total = w.topics.length + w.labs.length;
      return `<details class="card week ${w.n === wk ? "current" : ""}" ${w.n === wk || (!wk && w.n === 1) ? "open" : ""}>
        <summary><span style="flex:1">Week ${w.n} · ${esc(w.title)}</span>${w.n === wk ? '<span class="badge accent">This week</span>' : ""}<span class="muted">${total ? `${done}/${total}` : "review"}</span></summary>
        <p class="muted">${esc(w.goal)}</p>
        <div class="list">${w.topics.map((t) => topicRow(T, st, t)).join("")}${w.labs.map((l) => labRow(T, T.labs.find((x) => x.id === l))).join("")}
          ${!total ? `<div class="li"><span>Take full quizzes and drill the question bank.</span><div class="row"><button class="btn small" data-trgo="${T.id}|quiz|">Quiz</button><button class="btn small" data-trgo="${T.id}|questions|">Questions</button></div></div>` : ""}</div></details>`;
    }).join("");
}

// ---------------- learn ----------------
// Turns a Learn address into a lesson id: exact ids, then the track's aliases (short or old addresses such
// as "python" or "softmax"), then a unique id or title prefix of 3+ characters. null if nothing matches.
const slugOf = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
function resolveLesson(T, raw) {
  if (!raw) return null;
  if (raw === "courses" || raw === "glossary" || (raw === "claude" && T.id === "ai") || topicById(T, raw)) return raw;
  const k = slugOf(raw);
  if (topicById(T, k)) return k;
  if ((T.aliases || {})[k]) return T.aliases[k];
  if (k.length < 3) return null;
  const hits = T.topics.filter((t) => t.id.startsWith(k) || slugOf(t.title).startsWith(k));
  return hits.length === 1 ? hits[0].id : null;
}

function trLearn(T, st) {
  const id = T.id, sel = st.sel || defaultLesson(T), opt = !beginnerLevel();
  const side = T.groups.map(([g, tids]) => {
    const optional = opt && tids.every((tid) => topicById(T, tid).zero);
    return `<div class="side-h" style="cursor:default">${esc(g)}${optional ? ' <span class="muted">(optional)</span>' : ""}</div>` + tids.map((tid) => {
      const t = topicById(T, tid);
      return `<button class="side-i ${sel === tid ? "active" : ""}" data-trsel="${id}|${tid}"><span class="lbl">${esc(t.title)}</span><span class="muted lbl">${topicDone(T, t) ? "✓" : ""}</span></button>`;
    }).join("");
  }).join("") + `<div class="side-h" style="cursor:default">Reference</div>
    ${T.glossary && T.glossary.length ? `<button class="side-i ${sel === "glossary" ? "active" : ""}" data-trsel="${id}|glossary"><span class="lbl">Glossary</span><span class="muted lbl">${T.glossary.length}</span></button>` : ""}
    ${T.videos.courses && T.videos.courses.length ? `<button class="side-i ${sel === "courses" ? "active" : ""}" data-trsel="${id}|courses"><span class="lbl">Full courses</span></button>` : ""}
    ${id === "ai" ? `<button class="side-i ${sel === "claude" ? "active" : ""}" data-trsel="${id}|claude"><span class="lbl">Claude &amp; Anthropic</span></button>` : ""}`;
  const body = sel === "courses" && T.videos.courses ? `<h2>Full courses</h2><p class="muted">Long-form videos to watch in chunks alongside the plan. ${verifiedTag(VIDEOS_VERIFIED)}</p><div class="card">${vids(T.videos.courses)}</div>`
    : sel === "glossary" && T.glossary ? trGlossary(T) : sel === "claude" && id === "ai" ? claudeLearnPage() : topicById(T, sel) ? trTopic(T, st, sel) : trMissing(T, sel);
  return `<div class="ref-layout"><aside class="ref-side">${side}</aside><section class="ref-main">${body}</section></div>`;
}

// A Learn address that matches no lesson (mistyped or from an older version). Lessons aren't locked, so
// say so and offer the next lesson on the path instead of silently opening another page.
function trMissing(T, sel) {
  const to = pathNext(T) || learnPath(T)[0];
  return `<div class="label">Learn</div><h2>Lesson not found</h2>
    <div class="card"><p>There's no lesson at <code>${esc(sel)}</code>. The link may be mistyped or from an older version of the app.</p>
      <p class="muted">Lessons aren't locked: you can open any of them from the sidebar.</p>
      <div class="row"><button class="btn primary" data-trsel="${T.id}|${to.id}">Go to ${esc(to.title)} &rarr;</button></div></div>`;
}

function trGlossary(T) {
  const q = ((views._trgl = views._trgl || {})[T.id] || "").toLowerCase();
  const list = T.glossary.filter(([term, def]) => !q || term.toLowerCase().includes(q) || def.toLowerCase().includes(q));
  return `<h2>Glossary <span class="muted">${list.length}</span></h2><p class="muted">Key terms in one line each. Great for a last review before an interview or exam.</p>
    <div class="card toolbar"><label class="search">${ICON_SEARCH}<input data-trgl="${T.id}" placeholder="Search terms..." value="${esc(views._trgl[T.id] || "")}" autocomplete="off"></label></div>
    <div class="card"><dl class="gloss">${list.map(([term, def]) => `<dt>${esc(term)}</dt><dd>${esc(def)}</dd>`).join("") || '<p class="muted">No matching terms.</p>'}</dl></div>`;
}

// Previous / Next along the learner's path. A lesson outside it (a beginner lesson for someone who
// already codes) steps through its own part, then on to the first lesson of the path.
function trNav(T, tid) {
  const path = learnPath(T);
  let i = path.findIndex((t) => t.id === tid), prev, next;
  if (i >= 0) { prev = path[i - 1]; next = path[i + 1]; }
  else {
    const zs = zeroLessons(T), k = zs.findIndex((t) => t.id === tid);
    prev = zs[k - 1]; next = zs[k + 1] || path[0];
  }
  return `<div class="row between">${prev ? `<button class="btn" data-trsel="${T.id}|${prev.id}">&larr; ${esc(prev.title)}</button>` : "<span></span>"}
    ${next ? `<button class="btn primary" data-trsel="${T.id}|${next.id}">Next: ${esc(next.title)} &rarr;</button>` : `<button class="btn primary" data-trgo="${T.id}|quiz|">Take a quiz &rarr;</button>`}</div>`;
}
// The Python note, then "Lesson 2 of 5 in AI from zero. Next: ..." on beginner lessons.
function zeroPos(T, t) {
  const ls = zeroLessons(T, t.zero), i = ls.findIndex((x) => x.id === t.id);
  const nx = ls[i + 1] || learnPath(T).find((x) => !x.zero);
  return ZERO_PY_NOTE_HTML() + `<p class="lesson-pos">Lesson ${i + 1} of ${ls.length} in ${esc(ZERO_PARTS[t.zero])}.${nx ? ` Next: <button class="link-btn inline-link" data-trsel="${T.id}|${nx.id}">${esc(nx.zero && nx.zero !== t.zero ? ZERO_PARTS[nx.zero] + ": " + nx.title : nx.title)}</button>` : ""}</p>`;
}

function exerciseCard(id, tid, ex, j, st) {
  const key = exKey(id, tid, ex), ref = `${id}|${tid}|${ex.key}`, rid = `trres-${id}-${tid}-${ex.key}`;
  return `<div class="card ex-card"><h3 class="ex-title">Exercise ${j + 1}${ex.debug ? ' <span class="badge M">Debug this</span>' : ""}${st.ex[key] ? ' <span class="badge done">Passed</span>' : ""}</h3>
    <p>${md(ex.prompt)}</p>
    ${ex.example ? `<div class="ex-example"><div class="label">Example</div><pre>${esc(ex.example)}</pre></div>` : ""}
    <p class="ex-instr" id="instr-${rid}">${ex.debug ? "This code runs but has a bug. Find it and fix it, then press <b>Run tests</b>." : "Replace the placeholder (<code>pass</code>) with your code, then press <b>Run tests</b>."}</p>
    <textarea data-trcode="${ref}" aria-describedby="instr-${rid}" rows="${Math.max(5, ex.starter.split("\n").length + 2)}" spellcheck="false" aria-label="Your code for exercise ${j + 1}">${esc(S.code["tx:" + key] ?? ex.starter)}</textarea>
    <div class="row"><button class="btn primary small" data-trex="${ref}">Run tests</button><button class="btn small" data-trexreset="${ref}">Reset</button></div>
    <pre id="${rid}" class="muted" style="display:none"></pre>
    ${ex.hint ? `<details class="ex-help"><summary>Hint</summary><p>${md(ex.hint)}</p></details>` : ""}
    ${ex.solution ? `<details class="ex-help"><summary>Model answer</summary><p class="muted">Try the hint first. If you open this, read it line by line, then close it and type your own version: that's what makes it stick.</p><pre>${esc(ex.solution)}</pre></details>` : ""}</div>`;
}

// Checks: the topic's quiz questions, answered inline. All correct completes a lesson without exercises.
function checkCard(T, st, q, n) {
  const pick = (views._trck = views._trck || {})[q.id], done = pick !== undefined, solved = st.quiz[q.id] === true;
  const shown = done ? pick : solved ? q.answer : undefined;
  return `<div class="card"><h3 class="ex-title">Check ${n}${solved ? ' <span class="badge done">Correct</span>' : ""}</h3>
    <p style="font-weight:600;margin-top:0">${esc(q.q)}</p>
    <div class="quiz-opts">${q.options.map((o, k) => `<button class="quiz-opt ${shown !== undefined ? (k === q.answer ? "right" : k === shown ? "wrong" : "") : ""}" data-trck="${T.id}|${q.id}|${k}" ${shown !== undefined ? "disabled" : ""}><span class="qk">${"ABCD"[k]}</span>${esc(o)}</button>`).join("")}</div>
    ${done ? `<p class="${pick === q.answer ? "s-solved" : "M"}" style="margin-top:12px"><b>${pick === q.answer ? "Correct." : "Not quite."}</b> <span style="color:var(--text);font-weight:400">${esc(q.why)}</span></p>${pick === q.answer ? "" : `<button class="btn small" data-trckre="${q.id}">Try again</button>`}` : ""}</div>`;
}

function trTopic(T, st, tid) {
  const id = T.id, t = topicById(T, tid);
  const group = (T.groups.find(([, ids]) => ids.includes(tid)) || [""])[0], shown = views._trq = views._trq || {};
  const exs = t.exercises || [], checks = topicChecks(T, tid);
  const status = exs.length ? `${exPassed(id, t)} / ${exs.length} exercises passed. Your code runs against tests right here; Python loads on first run. Pass every exercise to complete this lesson.`
    : checks.length ? `${checks.filter((q) => st.quiz[q.id] === true).length} / ${checks.length} checks answered correctly. Answer every check correctly to complete this lesson.` : "";
  const example = t.example ? `<h3>Try it</h3><pre>${esc(t.example)}</pre>
    <div class="row"><button class="btn small" data-trrun="${id}|${tid}">Run this example</button></div><pre id="trrun-${id}-${tid}" class="muted" hidden></pre>` : "";
  const codes = (t.code || []).map((c, k) => `<div class="card"><div class="section-head"><h3>${esc(c.label)}</h3><button class="btn small" data-trcopy="${id}|${tid}|${k}">Copy</button></div>
    <p class="muted code-note">For reference: this runs on your own computer with the tools installed${/anthropic|client\./.test(c.code) ? " and an API key (a paid account)" : ""}. You don't need to run it to complete this lesson.</p><pre>${esc(c.code)}</pre></div>`).join("");
  const vlist = (T.videos[tid] || []).concat(t.videos || []);
  const hasQ = T.questions.some((q) => q.topic === tid), hasQuiz = T.quiz.some((q) => q.topic === tid);
  return `<div class="label">${esc(group)}</div><h2>${esc(t.title)}</h2>${t.zero ? zeroPos(T, t) : ""}
    ${status ? `<p class="muted">${status}</p>` : ""}
    <div class="card lesson-body">${t.why ? `<p class="callout why"><b>Why it matters on the job:</b> ${t.why}</p>` : ""}${t.body}${example}</div>${codes}
    ${exs.length ? `<div class="label" style="margin:6px 0 8px">Exercises (run in your browser)</div>${exs.map((ex, j) => exerciseCard(id, tid, ex, j, st)).join("")}` : ""}
    ${checks.length ? `<div class="label" style="margin:6px 0 8px">Checks: answer each one correctly to complete this lesson</div>${checks.map((q, n) => checkCard(T, st, q, n + 1)).join("")}` : ""}
    ${t.cards && t.cards.length ? `<div class="card"><h3>Flash cards</h3><p class="muted">Say your answer, then reveal it. These are for review and don't affect completion.</p>${t.cards.map(([q, a], k) => { const key = `${id}:${tid}:${k}`; return `<div class="flash"><div class="row between"><b>${esc(q)}</b>
      <button class="btn small ${shown[key] ? "ghost" : ""}" data-trq="${key}">${shown[key] ? "Hide" : "Show answer"}</button></div>${shown[key] ? `<p class="flash-a">${esc(a)}</p>` : ""}</div>`; }).join("")}</div>` : ""}
    <div class="card"><div class="section-head"><h3>Videos</h3><span class="row"><a class="btn small" href="${yt(t.yt || t.title + " LLM explained")}" target="_blank" rel="noopener">More videos &nearr;</a>${t.zero ? "" : channelLink(T)}</span></div>
      ${vlist.length ? vids(vlist) : `<p class="muted">No verified video for this lesson yet; the search link finds popular ones.</p>`}</div>
    ${hasQ || hasQuiz ? `<div class="row" style="margin-bottom:var(--gap)">${hasQ ? `<button class="btn ghost" data-trgo="${id}|questions|${tid}">Interview questions on this</button>` : ""}${hasQuiz ? `<button class="btn ghost" data-trgo="${id}|quiz|${tid}">Quiz on this</button>` : ""}</div>` : ""}
    ${trNav(T, tid)}`;
}

// ---------------- questions ----------------
function trQuestions(T, st) {
  const id = T.id, f = (views._trqf = views._trqf || {})[id] = (views._trqf[id] || { topic: "", status: "" });
  const shown = views._tra = views._tra || {};
  const list = T.questions.filter((q) => (!f.topic || q.topic === f.topic) && (!f.status || (f.status === "new" ? !st.qa[q.id] : st.qa[q.id] === f.status)));
  const got = T.questions.filter((q) => st.qa[q.id] === "got").length, rev = T.questions.filter((q) => st.qa[q.id] === "review").length;
  return pageHead(`Interview questions <span class="muted">${list.length}</span>`, "Say your answer out loud first (or write it down), then reveal the model answer and mark how you did.") +
    `<div class="card toolbar">
      <select data-trqf="${id}|topic"><option value="">All topics</option>${T.topics.filter((t) => !t.zero || T.questions.some((q) => q.topic === t.id)).map((t) => `<option value="${t.id}" ${f.topic === t.id ? "selected" : ""}>${esc(t.title)}</option>`).join("")}</select>
      <select data-trqf="${id}|status">${[["", "Any status"], ["new", "Not tried"], ["review", "Review again"], ["got", "Got it"]].map(([v, l]) => `<option value="${v}" ${f.status === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <span class="muted">${got} got it · ${rev} to review · ${T.questions.length - got - rev} not tried</span></div>` +
    (list.length ? list.map((q) => {
      const key = `${id}:${q.id}`, s = st.qa[q.id];
      return `<div class="card"><div class="section-head"><span class="label">${esc(topicById(T, q.topic).title)}</span>${s === "got" ? '<span class="badge done">Got it</span>' : s === "review" ? '<span class="badge due">Review again</span>' : ""}</div>
        <p style="font-weight:600;font-size:1.02rem;margin-top:0">${esc(q.q)}</p>
        ${shown[key] ? `<div class="callout">${esc(q.a)}</div>` : ""}
        <div class="row" style="margin-top:12px"><button class="btn small ${shown[key] ? "ghost" : ""}" data-trshow="${key}">${shown[key] ? "Hide answer" : "Show model answer"}</button>
          <button class="btn small ${s === "got" ? "primary" : ""}" data-trqa="${id}|${q.id}|got">Got it</button>
          <button class="btn small" data-trqa="${id}|${q.id}|review">Review again</button></div></div>`;
    }).join("") : `<div class="card empty">No questions match these filters.</div>`);
}

// ---------------- quiz ----------------
function trQuiz(T, st) {
  const id = T.id, f = (views._tqf = views._tqf || {})[id] = (views._tqf[id] || { tag: "", topic: "" });
  const pool = T.quiz.filter((q) => (!f.tag || q.tags.includes(f.tag)) && (!f.topic || q.topic === f.topic));
  const set = (views._tqs = views._tqs || {})[id], chosen = (views._tqa = views._tqa || {})[id] = views._tqa[id] || {};
  const qs = set ? set.map((qid) => T.quiz.find((q) => q.id === qid)).filter(Boolean) : pool;
  const answered = qs.filter((q) => chosen[q.id] !== undefined), right = answered.filter((q) => chosen[q.id] === q.answer).length;
  const tags = [...new Set(T.quiz.flatMap((q) => q.tags))];
  const certName = (tag) => (T.tagNames || {})[tag] || (T.certs.find((c) => c.tag === tag) || {}).code || tag;
  return pageHead("Practice quiz", "Multiple choice. Filter by topic, or take a random 10-question set.") +
    `<div class="card toolbar">
      ${tags.length ? `<select data-tqf="${id}|tag"><option value="">${esc(T.tagLabel || "All exams")}</option>${tags.map((t) => `<option value="${t}" ${f.tag === t ? "selected" : ""}>${esc(certName(t))}</option>`).join("")}</select>` : ""}
      <select data-tqf="${id}|topic"><option value="">All topics</option>${T.topics.filter((t) => !t.zero).map((t) => `<option value="${t.id}" ${f.topic === t.id ? "selected" : ""}>${esc(t.title)}</option>`).join("")}</select>
      <button class="btn primary" data-tqnew="${id}">Random 10</button>${set ? `<button class="btn" data-tqall="${id}">Show all ${pool.length}</button>` : ""}
      <button class="btn ghost" data-tqreset="${id}">Clear answers</button></div>
    <div class="card row between"><div><b>${set ? "Random set" : "All matching questions"}:</b> ${answered.length}/${qs.length} answered${answered.length ? `, <b>${Math.round(100 * right / answered.length)}%</b> correct` : ""}</div>
      ${answered.length === qs.length && qs.length ? `<span class="badge ${right / qs.length >= 0.7 ? "done" : "due"}">${right / qs.length >= 0.7 ? "Passing range" : "Keep practicing"}</span>` : ""}</div>` +
    (qs.length ? qs.map((q, n) => {
      const c = chosen[q.id], done = c !== undefined;
      return `<div class="card"><div class="section-head"><span class="label">Q${n + 1} · ${esc(topicById(T, q.topic).title)}</span><span class="row">${q.tags.map((t) => `<span class="tag">${esc(certName(t))}</span>`).join("")}</span></div>
        <p style="font-weight:600;margin-top:0">${esc(q.q)}</p>
        <div class="quiz-opts">${q.options.map((o, k) => `<button class="quiz-opt ${done ? (k === q.answer ? "right" : k === c ? "wrong" : "") : ""}" data-tq="${id}|${q.id}|${k}" ${done ? "disabled" : ""}><span class="qk">${"ABCD"[k]}</span>${esc(o)}</button>`).join("")}</div>
        ${done ? `<p class="${c === q.answer ? "s-solved" : "M"}" style="margin-top:12px"><b>${c === q.answer ? "Correct." : "Not quite."}</b> <span style="color:var(--text);font-weight:400">${esc(q.why)}</span></p>` : ""}</div>`;
    }).join("") : `<div class="card empty">No questions match these filters.</div>`);
}

// ---------------- labs ----------------
// A step is a string, or { do, see, hint }: what to do, what you should see when it worked, and a hint.
const labStep = (s) => (typeof s === "string" ? { do: s } : s);
function trLabs(T, st) {
  const id = T.id, focus = views._trlab;
  return pageHead(esc(T.labsName), "Hands-on work to put on your resume. Projects are self-reported: the app can't see your code, so tick each step yourself when you've done it and seen the result it describes.") +
    T.labs.map((l) => {
      const n = labSteps(id, l), all = n === l.steps.length;
      return `<div class="card lab ${focus === l.id ? "focus" : ""}" id="lab-${l.id}">
        <div class="section-head"><h3>${esc(l.title)}</h3><span class="badge ${all ? "done" : ""}">${n}/${l.steps.length} steps</span></div>
        <div class="row" style="margin-bottom:10px"><span class="pill">${esc(l.level)}</span><span class="pill">${esc(l.time)}</span><span class="pill">Self-reported</span>${l.stack.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>
        <p>${esc(l.goal)}</p>
        ${l.before ? `<div class="callout before"><b>Before you start</b><ul>${l.before.map((b) => `<li>${md(b)}</li>`).join("")}</ul></div>` : ""}
        <div class="bar" style="margin-bottom:10px"><i style="width:${(100 * n / l.steps.length) | 0}%"></i></div>
        ${l.steps.map((raw, k) => { const s = labStep(raw); return `<div class="lab-step"><label class="check"><input type="checkbox" data-trlab="${id}|${l.id}|${k}" ${st.labs[`${l.id}:${k}`] ? "checked" : ""}><span><b>Step ${k + 1}.</b> ${md(s.do)}</span></label>
          ${s.see ? `<p class="lab-see"><span class="label">You should see</span> ${md(s.see)}</p>` : ""}
          ${s.hint ? `<details class="ex-help lab-hint"><summary>Hint</summary><p>${md(s.hint)}</p></details>` : ""}</div>`; }).join("")}
        <div class="callout" style="margin-top:12px"><b>Cost &amp; safety:</b> ${esc(l.cost)}</div>
        <h3>Resume bullet</h3><div class="row between resume"><p style="margin:0;flex:1">${esc(l.resume)}</p><button class="btn small" data-trres="${id}|${l.id}">Copy</button></div>
        <h3>Stretch goals</h3><ul>${l.stretch.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>`;
    }).join("");
}

// ---------------- certs ----------------
function trCerts(T, st) {
  const id = T.id;
  return pageHead("Certifications", "Exam content and rules change, so always confirm details on the official page before booking. Each entry shows when it was last checked.") +
    (T.certs.some((c) => c.provider === "Anthropic") ? claudeEligibility() : "") +
    `<div class="track-grid" style="margin-top:var(--gap)">${T.certs.map((c) => {
      const s = st.certs[c.id] || {};
      return `<div class="card cert"><div class="section-head"><span class="badge accent">${esc(c.provider)} · ${esc(c.level)}</span><b class="cert-code">${esc(c.code)}</b></div>
        <h3 style="margin-top:6px">${esc(c.name)}</h3><p class="muted">${esc(c.why)}</p>${c.verified ? `<p style="margin:0">${verifiedTag(c.verified)}</p>` : ""}
        <div class="label" style="margin-top:10px">Related lessons</div><div>${c.topics.map((tid) => `<button class="tag tag-btn" ${goLearn(id, tid)}>${esc(topicById(T, tid).title)}</button>`).join("")}</div>
        <div class="row" style="margin-top:12px"><select data-trcert="${id}|${c.id}">${CERT_STATUSES.map((v) => `<option ${v === (s.status || "Not planned") ? "selected" : ""}>${v}</option>`).join("")}</select>
          <input type="date" data-trcertdate="${id}|${c.id}" value="${esc(s.date || "")}" title="Exam date"></div>
        <div class="row" style="margin-top:12px">${T.quiz.some((q) => q.tags.includes(c.tag)) ? `<button class="btn small primary" data-tqtag="${id}|${c.tag}">Practice questions</button>` : ""}
          <a class="btn small ghost" href="${c.link}" target="_blank" rel="noopener">Official page &nearr;</a></div></div>`;
    }).join("")}</div>
    ${T.id === "ai" ? claudeCoursesCard() + openAICard() : ""}`;
}

// ---------------- running exercises and examples ----------------
const exByKey = (id, tid, key) => (topicById(TRACKS[id], tid).exercises || []).find((ex) => ex.key === key);
async function runTrackExercise(id, tid, k) {
  const ex = exByKey(id, tid, k), key = exKey(id, tid, ex), rid = `trres-${id}-${tid}-${k}`;
  const code = document.querySelector(`[data-trcode="${id}|${tid}|${k}"]`).value;
  const res = document.getElementById(rid);
  // The untouched starter is only a placeholder (or, for a debug exercise, the bug): don't run it, say what to do instead.
  if (code.trim() === ex.starter.trim()) {
    res.style.display = "block"; res.className = "M";
    res.textContent = ex.debug ? "Fix the bug in the code first, then press Run tests." : "Replace the placeholder (pass) with your code first, then press Run tests.";
    return;
  }
  S.code["tx:" + key] = code; save();
  res.style.display = "block"; res.className = "muted"; res.textContent = pyStatus();
  const { out, err, loadErr } = await execPy(code + "\n\n" + ex.tests, true);
  if (loadErr) { res.textContent = err; res.className = "M"; return; }
  if (err) { res.textContent = "Not yet:\n" + err + (out ? "\n\nOutput:\n" + out : "") + (ex.hint ? "\n\nStuck? Open the hint below." : ""); res.className = "M"; return; }
  const st = trState(id);
  if (!st.ex[key]) bump();
  st.ex[key] = true; save();
  rerender();
  const r = document.getElementById(rid); r.style.display = "block"; r.className = "s-solved"; r.textContent = "All tests passed!" + (out ? "\n\nOutput:\n" + out : "");
}
async function runTrackExample(id, tid) {
  const t = topicById(TRACKS[id], tid), box = document.getElementById(`trrun-${id}-${tid}`);
  box.hidden = false; box.className = "muted"; box.textContent = pyStatus();
  const { out, err } = await execPy(t.example, true);
  box.className = err ? "M" : ""; box.textContent = (out || "") + (err ? "Error: " + err : "") || "(no output)";
}

// ---------------- events ----------------
document.addEventListener("click", (e) => {
  const t = e.target;
  const el = (sel) => t.closest(sel);
  let b;
  if ((b = el("[data-level]"))) { S.level = b.dataset.level; save(); return rerender(); }
  if ((b = el("[data-track-go]"))) { const k = b.dataset.trackGo; return go(S.lastTab?.[k] || defaultTab(k)); }
  if ((b = el("[data-nav-go]"))) return go(b.dataset.navGo);
  if ((b = el("[data-trstart]"))) { const st = trState(b.dataset.trstart); st.start = st.start || today(); save(); return go(b.dataset.trstart + ":overview"); }
  if ((b = el("[data-trgo]"))) {
    const [id, sub, arg] = b.dataset.trgo.split("|"), st = trState(id);
    if (sub === "learn" && arg) st.sel = arg;
    if (sub === "questions") ((views._trqf = views._trqf || {})[id] = { topic: arg || "", status: "" });
    if (sub === "quiz") { (views._tqf = views._tqf || {})[id] = { tag: "", topic: arg || "" }; (views._tqs = views._tqs || {})[id] = null; }
    views._trlab = sub === "labs" ? arg : null;
    save(); go(id + ":" + sub);
    if (sub === "labs" && arg) { const n = document.getElementById("lab-" + arg); if (n) n.scrollIntoView({ block: "start" }); window.scrollBy(0, -120); }
    return;
  }
  if ((b = el("[data-trsel]"))) { const [id, tid] = b.dataset.trsel.split("|"); trState(id).sel = tid; save(); render(); return window.scrollTo(0, 0); }
  if ((b = el("[data-trq]"))) { views._trq = views._trq || {}; views._trq[b.dataset.trq] = !views._trq[b.dataset.trq]; return rerender(); }
  if ((b = el("[data-trshow]"))) { views._tra = views._tra || {}; views._tra[b.dataset.trshow] = !views._tra[b.dataset.trshow]; return rerender(); }
  if ((b = el("[data-trqa]"))) {
    const [id, qid, v] = b.dataset.trqa.split("|"), st = trState(id);
    if (st.qa[qid] !== v && v === "got") bump();
    st.qa[qid] = v; save(); return rerender();
  }
  if ((b = el("[data-trex]"))) { const [id, tid, k] = b.dataset.trex.split("|"); return runTrackExercise(id, tid, k); }
  if ((b = el("[data-trexreset]"))) { const [id, tid, k] = b.dataset.trexreset.split("|"); delete S.code["tx:" + exKey(id, tid, exByKey(id, tid, k))]; save(); return rerender(); }
  if ((b = el("[data-trrun]"))) { const [id, tid] = b.dataset.trrun.split("|"); return runTrackExample(id, tid); }
  if ((b = el("[data-trck]"))) {
    const [id, qid, k] = b.dataset.trck.split("|"), q = TRACKS[id].quiz.find((x) => x.id === qid), st = trState(id);
    (views._trck = views._trck || {})[qid] = +k;
    st.quiz[qid] = +k === q.answer; if (st.quiz[qid]) bump(); save();
    return rerender();
  }
  if ((b = el("[data-trckre]"))) { delete (views._trck || {})[b.dataset.trckre]; return rerender(); }
  if ((b = el("[data-trcopy]"))) {
    const [id, tid, k] = b.dataset.trcopy.split("|");
    return navigator.clipboard?.writeText(topicById(TRACKS[id], tid).code[+k].code).then(() => { b.textContent = "Copied!"; }, () => {});
  }
  if ((b = el("[data-trres]"))) {
    const [id, lid] = b.dataset.trres.split("|");
    return navigator.clipboard?.writeText(TRACKS[id].labs.find((l) => l.id === lid).resume).then(() => { b.textContent = "Copied!"; }, () => {});
  }
  if ((b = el("[data-tq]"))) {
    const [id, qid, k] = b.dataset.tq.split("|"), q = TRACKS[id].quiz.find((x) => x.id === qid), st = trState(id);
    views._tqa = views._tqa || {}; (views._tqa[id] = views._tqa[id] || {})[qid] = +k;
    st.quiz[qid] = +k === q.answer; bump(); save();
    return rerender();
  }
  if ((b = el("[data-tqnew]"))) {
    const id = b.dataset.tqnew, T = TRACKS[id], f = (views._tqf || {})[id] || { tag: "", topic: "" };
    const pool = T.quiz.filter((q) => (!f.tag || q.tags.includes(f.tag)) && (!f.topic || q.topic === f.topic)).map((q) => q.id);
    for (let i = pool.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [pool[i], pool[j]] = [pool[j], pool[i]]; }
    (views._tqs = views._tqs || {})[id] = pool.slice(0, 10);
    (views._tqa = views._tqa || {})[id] = {};
    render(); return window.scrollTo(0, 0);
  }
  if ((b = el("[data-tqall]"))) { (views._tqs = views._tqs || {})[b.dataset.tqall] = null; return render(); }
  if ((b = el("[data-tqreset]"))) { (views._tqa = views._tqa || {})[b.dataset.tqreset] = {}; return render(); }
  if ((b = el("[data-tqtag]"))) {
    const [id, tag] = b.dataset.tqtag.split("|");
    (views._tqf = views._tqf || {})[id] = { tag, topic: "" }; (views._tqs = views._tqs || {})[id] = null; (views._tqa = views._tqa || {})[id] = {};
    return go(id + ":quiz");
  }
});

document.addEventListener("change", (e) => {
  const t = e.target, d = t.dataset || {};
  if (d.trlab) {
    const [id, lid, k] = d.trlab.split("|"), st = trState(id);
    if (t.checked) { st.labs[`${lid}:${k}`] = true; bump(); } else delete st.labs[`${lid}:${k}`];
    save(); return rerender();
  }
  if (d.trqf) { const [id, key] = d.trqf.split("|"); views._trqf[id][key] = t.value; return render(); }
  if (d.tqf) { const [id, key] = d.tqf.split("|"); views._tqf[id][key] = t.value; (views._tqs = views._tqs || {})[id] = null; return render(); }
  if (d.trcert) { const [id, cid] = d.trcert.split("|"), st = trState(id); st.certs[cid] = Object.assign({}, st.certs[cid], { status: t.value }); if (t.value === "Passed") bump(); save(); return; }
  if (d.trcertdate) { const [id, cid] = d.trcertdate.split("|"), st = trState(id); st.certs[cid] = Object.assign({}, st.certs[cid], { date: t.value }); save(); return; }
  if (d.trstartdate) { const st = trState(d.trstartdate); st.start = t.value || null; save(); return render(); }
});

// Placeholder lines in exercise starters are a bare `pass`. Typing while the caret is on one replaces it, so
// the placeholder never lingers next to real code; a keyboard user tabbing into an untouched box lands on it.
const PLACEHOLDER = /^([ \t]*)pass[ \t]*$/m;
function placeholderRange(ta) {
  const lines = ta.value.split("\n");
  let at = 0;
  for (const line of lines) {
    const m = PLACEHOLDER.exec(line);
    if (m) {
      const from = at + m[1].length, to = at + line.length;
      if (ta.selectionStart >= at && ta.selectionEnd <= to) return [from, to];
    }
    at += line.length + 1;
  }
  return null;
}
document.addEventListener("beforeinput", (e) => {
  const ta = e.target;
  if (!ta.dataset || !ta.dataset.trcode || !/^(insert|delete)/.test(e.inputType) || /LineBreak|Paragraph/.test(e.inputType)) return;
  const r = placeholderRange(ta);
  if (r) ta.setSelectionRange(r[0], r[1]);
});
document.addEventListener("focusin", (e) => {
  const ta = e.target, d = ta.dataset || {};
  if (!d.trcode) return;
  const [id, tid, k] = d.trcode.split("|"), ex = exByKey(id, tid, k);
  if (ta.value !== ex.starter) return;
  // Only for keyboard focus: a mouse click places its own caret after this event.
  if (ta.matches(":focus-visible")) {
    const i = ta.value.search(PLACEHOLDER); if (i >= 0) { const m = PLACEHOLDER.exec(ta.value); ta.setSelectionRange(i + m[1].length, i + m[0].length); }
  }
});

document.addEventListener("input", (e) => {
  const d = e.target.dataset || {};
  if (d.trcode) { const [id, tid, k] = d.trcode.split("|"); S.code["tx:" + exKey(id, tid, exByKey(id, tid, k))] = e.target.value; save(); }
  if (d.trgl) {
    views._trgl[d.trgl] = e.target.value; const pos = e.target.selectionStart; render();
    const el = document.querySelector(`[data-trgl="${d.trgl}"]`); el.focus(); el.setSelectionRange(pos, pos);
  }
});
