"use strict";
// Interview section: timed mock interviews (technical questions for your target role + behavioural),
// a STAR story bank tagged by theme and skill, and mock history with weak-spot suggestions.
// Draws on the TRACKS question banks (AI / LLM track and Roles), ROLES and SKILLS.
// Loaded before app.js; it only uses app.js / track globals at call time.
// State: S.ivActive (the mock in progress), S.ivMocks (finished mocks), S.stories (STAR stories).

const IV_TABS = [["mock", "Mock interview"], ["stories", "Story bank"], ["history", "History"]];
TRACK_ICON.interview = `<svg viewBox="0 0 24 24"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z"/><path d="M8.5 10.5h7M8.5 13.5h4.5"/></svg>`;

const STORY_THEMES = [
  ["conflict", "Conflict & disagreement"], ["failure", "Failure & mistakes"], ["leadership", "Leadership & ownership"],
  ["ambiguity", "Ambiguity & unclear problems"], ["impact", "Impact & results"], ["learning", "Learning something fast"],
  ["teamwork", "Teamwork & helping others"], ["pressure", "Deadlines & pressure"], ["customer", "Users & stakeholders"],
];
const themeName = (k) => (STORY_THEMES.find(([id]) => id === k) || [k, k])[1];

// Common behavioural questions, tagged with the themes a good story for them covers.
const BEHAVIORAL_QS = [
  { id: "b1", q: "Tell me about yourself.", themes: ["impact"], tip: "Two minutes: present (current work and a highlight), past (how you got here), future (why this role). End on why you want this job." },
  { id: "b2", q: "Tell me about a time you disagreed with a teammate or your manager.", themes: ["conflict"], tip: "Show you understood their view, used evidence, and committed once a decision was made. Avoid making the other person the villain." },
  { id: "b3", q: "Tell me about a project that failed or a mistake you made.", themes: ["failure"], tip: "Own it plainly, spend most of the time on what you changed afterwards, and give a later example where the lesson paid off." },
  { id: "b4", q: "Describe a time you took ownership of something outside your job description.", themes: ["leadership"], tip: "Why you noticed it, why nobody else had picked it up, what you did, and the measurable result." },
  { id: "b5", q: "Tell me about a time you had to work with unclear or changing requirements.", themes: ["ambiguity"], tip: "How you reduced the uncertainty: questions you asked, a prototype, a decision you documented, check-ins." },
  { id: "b6", q: "What's the project you're most proud of?", themes: ["impact"], tip: "Pick one with a clear 'I' contribution and numbers. Be ready for deep technical follow-ups on it." },
  { id: "b7", q: "Tell me about a time you had to learn a new technology quickly.", themes: ["learning"], tip: "What you had to learn, how (docs, small spikes, asking experts), how fast, and what you delivered with it." },
  { id: "b8", q: "Describe a time you helped a struggling teammate.", themes: ["teamwork"], tip: "Show empathy and specifics: pairing, unblocking, reviewing. Keep the teammate's dignity intact." },
  { id: "b9", q: "Tell me about a time you missed a deadline or nearly did.", themes: ["pressure", "failure"], tip: "When you saw the risk, how early you raised it, what you cut or traded, and what you'd plan differently." },
  { id: "b10", q: "Tell me about a time you had to push back on a stakeholder or customer request.", themes: ["customer", "conflict"], tip: "Understand the underlying need, offer an alternative that meets it, and show how the relationship stayed good." },
  { id: "b11", q: "Describe a time you improved a process or tool for your team.", themes: ["leadership", "impact"], tip: "Before and after, with a number (time saved, errors reduced), and how you got others to adopt it." },
  { id: "b12", q: "Tell me about a technical decision you made with incomplete information.", themes: ["ambiguity"], tip: "The options, how you limited the downside (reversible choice, feature flag), and how you checked it later." },
  { id: "b13", q: "Tell me about a time you received critical feedback.", themes: ["learning", "failure"], tip: "Describe the feedback without defending yourself, what you changed, and evidence the change stuck." },
  { id: "b14", q: "Describe a time you handled a production incident.", themes: ["pressure"], tip: "Timeline: detect, mitigate, communicate, root cause, follow-up actions. Stress calm communication." },
  { id: "b15", q: "Tell me about a time you influenced people without having authority over them.", themes: ["leadership", "teamwork"], tip: "Data, prototypes and finding allies. Show you listened and adjusted the proposal." },
  { id: "b16", q: "Tell me about a time you balanced quality against speed.", themes: ["pressure", "ambiguity"], tip: "What 'good enough' meant, what you deliberately left out, and how you made the shortcut safe (tests, follow-up ticket)." },
  { id: "b17", q: "Describe a time you explained something technical to a non-technical audience.", themes: ["customer"], tip: "Analogies, focusing on decisions and trade-offs rather than mechanics, and checking understanding." },
  { id: "b18", q: "Tell me about a time you went above and beyond for a user.", themes: ["customer", "impact"], tip: "The user's problem, why it mattered, what you did, and how you knew it helped." },
  { id: "b19", q: "Tell me about a time you worked across teams to deliver something.", themes: ["teamwork"], tip: "Dependencies, how you aligned priorities and kept everyone informed, and the outcome." },
  { id: "b20", q: "Describe a bug or problem that took you a long time to solve.", themes: ["learning", "pressure"], tip: "Your debugging method (hypotheses, narrowing down, instrumentation), the root cause and the guard you added." },
  { id: "b21", q: "Tell me about a time you used data to make a decision.", themes: ["impact", "ambiguity"], tip: "The question, the data and its limits, the decision, and what happened next." },
  { id: "b22", q: "Describe a time you had too many priorities at once.", themes: ["pressure"], tip: "How you ranked them (impact, urgency, who's blocked), what you said no to, and how you communicated it." },
  { id: "b23", q: "Tell me about a time you mentored someone or shared knowledge.", themes: ["leadership", "teamwork"], tip: "What they needed, your approach, and how they grew. Docs or talks you wrote count too." },
  { id: "b24", q: "Why do you want to work here, and why this role?", themes: ["impact"], tip: "Connect specific things about the company and the posting to your experience and goals. Research first." },
  { id: "b25", q: "Tell me about a time you changed your mind after seeing new evidence.", themes: ["learning", "conflict"], tip: "What you believed, what changed it, and how you updated the plan and told others." },
];

const IV_ROLES = [["ai", "AI Engineer"]];
const IV_FORMATS = {
  standard: { name: "Technical loop · 45 min", rounds: [["tech", 10], ["tech", 10], ["tech", 10], ["beh", 15]] },
  short: { name: "Short · 30 min", rounds: [["tech", 10], ["tech", 10], ["beh", 10]] },
  tech: { name: "Technical only · 40 min", rounds: [["tech", 10], ["tech", 10], ["tech", 10], ["tech", 10]] },
};
const ROUND_NAMES = { tech: "Technical", beh: "Behavioural" };
const SCORES = [[1, "Struggled"], [2, "Partly"], [3, "Solid"], [4, "Strong"]];

function ivState() {
  S.ivMocks = S.ivMocks || [];
  S.stories = S.stories || [];
  S.ivPrefs = Object.assign({ role: IV_ROLES[0][0], format: "standard" }, S.ivPrefs || {});
  if (!IV_ROLES.some(([id]) => id === S.ivPrefs.role)) S.ivPrefs.role = IV_ROLES[0][0];
  if (!IV_FORMATS[S.ivPrefs.format]) S.ivPrefs.format = "standard";
  // a mock started in the combined Prep Hub app can hold rounds this version can't show
  if (S.ivActive && !S.ivActive.rounds.every((r) => ROUND_NAMES[r.kind] && (!r.track || TRACKS[r.track]))) S.ivActive = null;
  return S;
}
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pickFrom = (...pools) => { for (const p of pools) if (p.length) return shuffle(p)[0]; return null; };

// ---------------- dealing rounds ----------------
// Recent mocks' items are skipped so consecutive mocks don't repeat.
function recentRefs() { return new Set(ivState().ivMocks.slice(-5).flatMap((m) => m.rounds.map((r) => r.ref))); }

function techPool(role) {
  const banks = ["ai", "roles"];
  return banks.flatMap((id) => TRACKS[id].questions.filter((q) => q.topic !== "behavioral").map((q) => ({ track: id, q })));
}
function dealRound(kind, role, used) {
  const fresh = (ref) => !used.has(ref);
  if (kind === "tech") {
    const pool = techPool(role), stat = (x) => trState(x.track).qa[x.q.id];
    const x = pickFrom(pool.filter((y) => stat(y) === "review" && fresh(y.q.id)), pool.filter((y) => !stat(y) && fresh(y.q.id)), pool.filter((y) => fresh(y.q.id)), pool);
    return { ref: x.q.id, track: x.track, title: x.q.q };
  }
  const beh = BEHAVIORAL_QS.concat(ROLES.questions.filter((q) => q.topic === "behavioral").map((q) => ({ id: q.id, q: q.q, themes: ["impact"], answer: q.a })));
  // favour themes with no story yet, so practice fills the gaps
  const covered = new Set(ivState().stories.flatMap((s) => s.themes));
  const q = pickFrom(beh.filter((b) => fresh(b.id) && b.themes.some((t) => !covered.has(t))), beh.filter((b) => fresh(b.id)), beh);
  return { ref: q.id, title: q.q };
}
function startMock() {
  const st = ivState(), { role, format } = st.ivPrefs, used = recentRefs();
  const rounds = IV_FORMATS[format].rounds.map(([kind, mins]) => {
    const r = Object.assign({ kind, mins, score: 0, notes: "", acc: 0, since: null, shown: false }, dealRound(kind, role, used));
    used.add(r.ref);
    return r;
  });
  st.ivActive = { id: "m" + Date.now().toString(36), date: today(), role, format, cur: 0, rounds };
  bump(); save();
}
const roundSecs = (r) => r.acc + (r.since ? (Date.now() - r.since) / 1000 : 0);
function pauseRound(r) { if (r.since) { r.acc = roundSecs(r); r.since = null; } }

// ---------------- pages ----------------
let ivTimer = null;
function interviewView(sub) {
  clearInterval(ivTimer); ivTimer = null;
  ivState();
  if (sub === "stories") return ivStories();
  if (sub === "history") return ivHistory();
  return S.ivActive ? ivRun(S.ivActive) : ivSetup();
}
const ivHead = (title, subtitle) => pageHead(title, subtitle);

function ivSetup() {
  const st = ivState(), p = st.ivPrefs, last = st.ivMocks[st.ivMocks.length - 1];
  const fmt = IV_FORMATS[p.format], mins = fmt.rounds.reduce((n, [, m]) => n + m, 0);
  // With one role there's nothing to choose, so it's shown as a fact rather than a one-button control
  const role = IV_ROLES.length > 1 ? `<div class="seg" role="group" aria-labelledby="lbl-ivrole">${IV_ROLES.map(([id, l]) => `<button data-ivrole="${id}" class="${p.role === id ? "on" : ""}">${esc(l)}</button>`).join("")}</div>`
    : `<span class="pill">${esc(IV_ROLES[0][1])}</span>`;
  return pageHead("Mock interview", "A timed set of rounds dealt from your own prep: technical questions for your target role (ones you marked Review again come first) and a behavioural question. Answer out loud as if someone is listening, then score yourself honestly.", {
      eyebrow: last ? `${st.ivMocks.length} mock${st.ivMocks.length === 1 ? "" : "s"} done · last on ${esc(last.date)}` : "",
      actions: last ? `<button class="btn small" data-nav-go="interview:history">See your history</button>` : "" })
    + `<ol class="iv-flow" aria-label="How a mock interview works">
        <li><b>Pick a format</b><span class="muted">How many rounds, and how long each one lasts.</span></li>
        <li><b>Answer each round out loud</b><span class="muted">Every round has its own timer. It starts when you press Start round, and you can pause it.</span></li>
        <li><b>Score yourself, then save</b><span class="muted">Weak technical answers come back as Review again in your question bank. History keeps every mock.</span></li>
      </ol>
    <section class="card iv-setup" aria-labelledby="h-ivsetup"><h2 class="card-title" id="h-ivsetup">Set up your mock</h2>
      <div class="setting"><div><b id="lbl-ivrole">Target role</b><div class="muted">Picks the technical question bank.</div></div>${role}</div>
      <div class="setting"><div><b id="lbl-ivformat">Format</b><div class="muted">${fmt.rounds.length} rounds, ${mins} minutes: ${fmt.rounds.map(([k, m]) => `${ROUND_NAMES[k]} ${m} min`).join(", ")}</div></div>
        <div class="seg" role="group" aria-labelledby="lbl-ivformat">${Object.entries(IV_FORMATS).map(([id, f]) => `<button data-ivformat="${id}" class="${p.format === id ? "on" : ""}">${esc(f.name)}</button>`).join("")}</div></div>
      <div class="iv-start"><button class="btn primary btn-lg" data-ivstart>Start mock interview &rarr;</button>
        <span class="muted">Nothing is timed until you press Start round. The mock is saved as you go, so you can leave and come back to it.</span></div></section>
    <div class="cols-2">
      <section class="card" aria-labelledby="h-ivtips"><h2 class="card-title" id="h-ivtips">How to answer</h2><ol>${MOCK_TIPS.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></section>
      <section class="card" aria-labelledby="h-ivstar"><h2 class="card-title" id="h-ivstar">Behavioural answers: STAR</h2><ul>
        <li><b>Situation</b>: one or two sentences of context.</li><li><b>Task</b>: what you were responsible for.</li>
        <li><b>Action</b>: what <i>you</i> did, in detail. Most of the answer goes here.</li><li><b>Result</b>: the outcome, with a number if you can, and what you learned.</li></ul>
        <div class="row"><button class="btn small" data-nav-go="interview:stories">Open your story bank (${st.stories.length})</button></div></section>
    </div>`;
}

// The round clock's state in words, so it never rests on colour alone
const clockState = (r) => {
  const over = r.mins * 60 - roundSecs(r) < 0;
  return r.since ? (over ? "Over time" : "Running") : roundSecs(r) ? (over ? "Paused, over time" : "Paused") : "Not started";
};
function ivRun(m) {
  const r = m.rounds[m.cur], n = m.rounds.length, secs = roundSecs(r), left = r.mins * 60 - secs;
  if (r.since) ivTimer = setInterval(tickIv, 1000);
  const steps = m.rounds.map((x, i) => `<li class="iv-step ${i === m.cur ? "on" : ""} ${x.score ? "done" : ""}"${i === m.cur ? ' aria-current="step"' : ""}>${i + 1}<span class="iv-step-name">. ${ROUND_NAMES[x.kind]}</span>${x.score ? ` · ${x.score}/4<span class="sr-only"> scored</span>` : ""}</li>`).join("");
  return `<header class="page-head iv-head"><div class="page-head-main"><h1>Mock interview</h1><p class="page-sub">Round ${m.cur + 1} of ${n} · ${esc(IV_FORMATS[m.format].name)}</p></div></header>
    <div class="card iv-bar">
      <ol class="iv-steps" aria-label="Rounds">${steps}</ol>
      <div class="iv-clock"><span class="iv-state ${left < 0 ? "over" : ""}" id="iv-state">${clockState(r)}</span>
        <span id="iv-timer" class="timer ${left < 0 ? "over" : ""}" role="timer"><span class="sr-only">${left < 0 ? "Over time by " : "Time left: "}</span>${fmtLeft(left)}</span>
        <button class="btn ${r.since ? "" : "primary"}" data-ivclock>${r.since ? "Pause" : secs ? "Resume" : "Start round"}</button></div></div>
    ${roundBody(m, r)}
    <section class="card" aria-labelledby="h-ivscore"><div class="section-head"><h2 class="card-title" id="h-ivscore">Score this round</h2><span class="muted">Be honest: weak rounds come back in History and in your question bank.</span></div>
      <div class="seg iv-score" role="group" aria-labelledby="h-ivscore">${SCORES.map(([v, l]) => `<button data-ivscore="${v}" class="${r.score === v ? "on" : ""}"><b>${v}</b> <span>${l}</span></button>`).join("")}</div>
      <label class="fld" style="margin-top:12px"><span>Notes: what went well, what to fix</span><textarea data-ivnotes rows="3" placeholder="e.g. Jumped to code before clarifying input size">${esc(r.notes)}</textarea></label>
      <div class="iv-actions"><button class="btn ghost danger" data-ivquit>Abandon mock</button>
        <div class="row">${m.cur > 0 ? `<button class="btn" data-ivgo="${m.cur - 1}">&larr; Previous round</button>` : ""}
        ${m.cur < n - 1 ? `<button class="btn primary" data-ivgo="${m.cur + 1}">Next round &rarr;</button>` : `<button class="btn primary" data-ivfinish>Finish &amp; save</button>`}</div></div></section>`;
}
const fmtLeft = (s) => (s < 0 ? "+" : "") + fmt(Math.abs(Math.round(s)));
function tickIv() {
  const m = S.ivActive, el = $("#iv-timer");
  if (!m || !el) { clearInterval(ivTimer); ivTimer = null; return; }
  const r = m.rounds[m.cur], left = r.mins * 60 - roundSecs(r), wasOver = el.classList.contains("over");
  el.firstChild.textContent = left < 0 ? "Over time by " : "Time left: ";
  el.lastChild.textContent = fmtLeft(left); el.classList.toggle("over", left < 0);
  $("#iv-state").textContent = clockState(r); $("#iv-state").classList.toggle("over", left < 0);
  if (left < 0 && !wasOver) announce("Time's up for this round. The clock keeps counting the extra time.");
}

function roundBody(m, r) {
  // The answer sits after its button, and the button says whether it's showing
  const reveal = (label, html) => `<button class="btn small ${r.shown ? "ghost" : ""}" data-ivshow aria-expanded="${r.shown}" aria-controls="iv-reveal">${r.shown ? "Hide" : "Show"} ${label}</button>
    <div class="callout iv-reveal" id="iv-reveal" ${r.shown ? "" : "hidden"}>${html}</div>`;
  const head = (extra = "") => `<div class="label">Round ${m.cur + 1} · ${ROUND_NAMES[r.kind]} · ${r.mins} min</div>${extra}`;
  if (r.kind === "tech") {
    const T = TRACKS[r.track], q = T.questions.find((x) => x.id === r.ref), t = topicById(T, q.topic);
    return `<section class="card iv-round" aria-labelledby="iv-q">${head()}<h2 class="iv-q" id="iv-q">${esc(q.q)}</h2>
      <div class="row" style="margin-bottom:10px"><span class="pill">${esc(T.name)}</span>${t ? `<span class="pill">${esc(t.title)}</span>` : ""}</div>
      <p class="muted">Answer in about two minutes: the short answer first, then how it works, a trade-off, and an example from your own work.</p>
      ${reveal("model answer", esc(q.a))}
      ${t ? `<p class="iv-lesson muted">Related lesson: <button class="link-btn inline-link" ${goLearn(T.id, t.id)}>${esc(t.title)}</button>. Your mock stays in progress while you're there.</p>` : ""}</section>`;
  }
  const q = BEHAVIORAL_QS.find((x) => x.id === r.ref) || (() => { const x = ROLES.questions.find((y) => y.id === r.ref); return x && { q: x.q, themes: ["impact"], tip: x.a }; })();
  const stories = ivState().stories.filter((s) => s.themes.some((t) => q.themes.includes(t)));
  return `<section class="card iv-round" aria-labelledby="iv-q">${head()}<h2 class="iv-q" id="iv-q">${esc(q.q)}</h2>
    <div class="row" style="margin-bottom:10px">${q.themes.map((t) => `<span class="pill">${esc(themeName(t))}</span>`).join("")}</div>
    <p class="muted">Use STAR and keep it to about two minutes. Most of the time goes on your Actions; finish with a measurable Result.</p>
    ${reveal("tip", esc(q.tip))}</section>
    <section class="card" aria-labelledby="h-ivstories"><div class="section-head"><h2 class="card-title" id="h-ivstories">Your matching stories <span class="muted">${stories.length}</span></h2><button class="btn small ghost" data-ivnewstory="${q.themes.join(",")}">+ Write a story for this</button></div>
      ${stories.length ? stories.map((s) => `<details class="iv-story"><summary>${esc(s.title || "Untitled story")}</summary>${starHtml(s)}</details>`).join("")
        : `<p class="muted" style="margin:0">No story covers ${q.themes.map((t) => `<b>${esc(themeName(t).toLowerCase())}</b>`).join(" or ")} yet. Answer from memory now, then write it up in the story bank.</p>`}</section>`;
}
const starHtml = (s) => `<dl class="star">${[["Situation", s.s], ["Task", s.t], ["Action", s.a], ["Result", s.r]].map(([k, v]) => `<dt>${k}</dt><dd>${esc(v || "—")}</dd>`).join("")}</dl>`;

function finishMock() {
  const m = S.ivActive;
  m.rounds.forEach(pauseRound);
  // Technical rounds feed the question bank: weak answers come back as "Review again".
  m.rounds.filter((r) => r.kind === "tech" && r.score).forEach((r) => { trState(r.track).qa[r.ref] = r.score >= 3 ? "got" : "review"; });
  S.ivMocks.push({ id: m.id, date: m.date, role: m.role, format: m.format, rounds: m.rounds.map(({ kind, ref, track, title, mins, score, notes, acc }) => ({ kind, ref, track, title, mins, score, notes, secs: Math.round(acc) })) });
  S.ivActive = null; bump(); save();
}
// After starting a mock or changing round, focus goes to the round's question (so the page doesn't drop keyboard and
// screen reader users back at the top) and the round number is announced.
function ivFocusRound(prefix) {
  const m = S.ivActive, q = $("#iv-q");
  if (!m || !q) return;
  q.tabIndex = -1; q.focus({ preventScroll: true });
  announce(`${prefix ? prefix + " " : ""}Round ${m.cur + 1} of ${m.rounds.length}: ${ROUND_NAMES[m.rounds[m.cur].kind]}.`);
}

// ---------------- history ----------------
// The question bank behind your most recent weak technical round.
const weakTrack = () => { const r = ivState().ivMocks.flatMap((m) => m.rounds).filter((x) => x.kind === "tech" && x.score && x.score < 3 && TRACKS[x.track]).pop(); return r ? r.track : "ai"; };
function ivHistory() {
  // mocks imported from the combined app can hold round kinds this version doesn't have
  const mine = ivState().ivMocks.filter((m) => m.rounds.every((r) => ROUND_NAMES[r.kind])), mocks = mine.slice().reverse();
  const byKind = Object.keys(ROUND_NAMES).map((k) => {
    const rs = mine.flatMap((m) => m.rounds).filter((r) => r.kind === k && r.score);
    return { k, n: rs.length, avg: rs.length ? rs.reduce((a, r) => a + r.score, 0) / rs.length : 0 };
  });
  const weakest = byKind.filter((x) => x.n).sort((a, b) => a.avg - b.avg)[0];
  const advice = {
    tech: ["Drill the questions you marked Review again.", `data-ivreview="${esc(weakTrack())}"`, "Questions to review"],
    beh: ["Write STAR stories for the themes you haven't covered.", 'data-nav-go="interview:stories"', "Story bank"],
  };
  return ivHead(`History <span class="muted">${mocks.length}</span>`, "Every finished mock, with your scores per round type. Weak technical answers are also flagged in the question bank.") +
    `<div class="grid">${byKind.map((x) => `<div class="card"><div class="label">${ROUND_NAMES[x.k]}</div><div class="stat">${x.n ? x.avg.toFixed(1) : "–"}<small> / 4</small></div><div class="muted">${x.n} round${x.n === 1 ? "" : "s"} scored</div></div>`).join("")}</div>` +
    (weakest && weakest.avg < 3 ? `<div class="callout" style="margin-bottom:var(--gap)"><b>Weakest area: ${ROUND_NAMES[weakest.k]}</b> (${weakest.avg.toFixed(1)} / 4). ${advice[weakest.k][0]} <button class="btn small" ${advice[weakest.k][1]}>${advice[weakest.k][2]} &rarr;</button></div>` : "") +
    (mocks.length ? mocks.map((m) => {
      const scored = m.rounds.filter((r) => r.score), avg = scored.length ? scored.reduce((a, r) => a + r.score, 0) / scored.length : 0;
      return `<details class="card iv-mock"><summary><span style="flex:1"><b>${esc(m.date)}</b> · ${esc((IV_ROLES.find(([id]) => id === m.role) || ["", m.role])[1])} · ${esc(IV_FORMATS[m.format] ? IV_FORMATS[m.format].name : "")}</span>
        ${m.rounds.map((r) => `<span class="badge ${r.score >= 3 ? "done" : r.score ? "due" : ""}" title="${esc(r.title)}">${ROUND_NAMES[r.kind]} ${r.score || "–"}</span>`).join("")}<span class="muted">avg ${avg ? avg.toFixed(1) : "–"}</span></summary>
        <div class="list" style="margin-top:10px">${m.rounds.map((r) => `<div class="li"><div style="flex:1;min-width:0"><span class="t">${ROUND_NAMES[r.kind]}: ${esc(r.title)}</span>
          <div class="muted">${r.score ? `${r.score}/4 ${SCORES[r.score - 1][1]}` : "Not scored"} · ${fmt(r.secs || 0)} of ${r.mins}:00</div>${r.notes ? `<div style="margin-top:4px;white-space:pre-wrap">${esc(r.notes)}</div>` : ""}</div></div>`).join("")}</div>
        <div class="row" style="margin-top:10px;justify-content:flex-end"><button class="btn small danger" data-ivdel="${esc(m.id)}">Delete</button></div></details>`;
    }).join("") : `<div class="card empty"><span class="big">&#127908;</span>No mocks yet. <button class="btn small primary" data-nav-go="interview:mock">Start one</button></div>`);
}

// ---------------- story bank ----------------
const blankStory = (themes = []) => ({ id: null, title: "", s: "", t: "", a: "", r: "", themes, skills: [] });
function ivStories() {
  const st = ivState(), stories = st.stories;
  if (views._ivEdit && !views._ivDraft) {
    const s = stories.find((x) => x.id === views._ivEdit);
    views._ivDraft = s ? JSON.parse(JSON.stringify(s)) : blankStory();
  }
  views._ivEdit = null;
  const d = views._ivDraft, role = rlState().role;
  const themeCount = (k) => stories.filter((s) => s.themes.includes(k)).length;
  const topSkills = roleDemand(role).list.slice(0, 10).map((r) => r.skill);
  const skillCovered = (id) => stories.some((s) => s.skills.includes(id));
  return ivHead(`Story bank <span class="muted">${stories.length}</span>`, "Write each story once in STAR form and tag it. Mock interviews show your matching stories in behavioural rounds.") +
    (d ? storyForm(d) : `<div class="row" style="margin-bottom:var(--gap)"><button class="btn primary" data-ivnewstory="">+ New story</button><span class="muted">Aim for 6-8 strong stories that together cover every theme.</span></div>`) +
    `<div class="cols-2">
      <div class="card"><h2 class="card-title">Theme coverage</h2><div class="list">${STORY_THEMES.map(([k, l]) => { const n = themeCount(k); return `<div class="li"><span>${esc(l)}</span>${n ? `<span class="badge done">${n} stor${n === 1 ? "y" : "ies"}</span>` : `<button class="btn small" data-ivnewstory="${k}">Write one</button>`}</div>`; }).join("")}</div></div>
      <div class="card"><h2 class="card-title">Top skills for ${esc(roleName(role))}</h2><p class="muted" style="margin-top:0">The most requested skills in your postings. A story that shows each one makes your answers concrete.</p>
        <div class="rl-tags">${topSkills.map((s) => `<span class="tag ${skillCovered(s.id) ? "lv-confident" : "lv-none"}" title="${skillCovered(s.id) ? "Covered by a story" : "No story yet"}">${skillCovered(s.id) ? "&#10003; " : ""}${esc(s.name)}</span>`).join("")}</div></div>
    </div>` +
    (stories.length ? stories.map((s) => `<div class="card" id="story-${esc(s.id)}"><div class="section-head"><h2 class="card-title">${esc(s.title || "Untitled story")}</h2>
        <div class="row"><button class="btn small" data-ivedit="${esc(s.id)}">Edit</button><button class="btn small danger" data-ivsdel="${esc(s.id)}">Delete</button></div></div>
        <div class="row" style="margin:8px 0">${s.themes.map((t) => `<span class="pill">${esc(themeName(t))}</span>`).join("")}${s.skills.map((id) => skillById(id)).filter(Boolean).map((k) => `<span class="tag">${esc(k.name)}</span>`).join("")}</div>
        ${starHtml(s)}</div>`).join("") : d ? "" : `<div class="card empty"><span class="big">&#128221;</span>No stories yet. Start with your proudest project and one failure you learned from.</div>`);
}
function storyForm(d) {
  const area = (k, label, ph) => `<label class="fld"><span>${label}</span><textarea data-ivs="${k}" rows="${k === "a" ? 4 : 2}" placeholder="${esc(ph)}">${esc(d[k])}</textarea></label>`;
  return `<div class="card" id="iv-form"><div class="section-head"><h2 class="card-title">${d.id ? "Edit story" : "New story"}</h2><button class="btn small ghost" data-ivscancel>Cancel</button></div>
    <label class="fld" style="margin-top:12px"><span>Title</span><input data-ivs="title" value="${esc(d.title)}" placeholder="e.g. Cut report generation from 2 hours to 5 minutes" autocomplete="off"></label>
    ${area("s", "Situation", "Where you were, the team, what was going on.")}${area("t", "Task", "What you were responsible for, and why it mattered.")}
    ${area("a", "Action", "What you did, step by step. Say 'I', not 'we'.")}${area("r", "Result", "The outcome with numbers if you can, and what you learned.")}
    <div class="label" style="margin-top:6px">Themes</div><div class="rl-tags" style="margin:6px 0 12px">${STORY_THEMES.map(([k, l]) => `<button class="tag tag-btn ${d.themes.includes(k) ? "lv-confident" : ""}" data-ivtheme="${k}">${esc(l)}</button>`).join("")}</div>
    <div class="label">Skills it shows</div><div class="rl-tags" style="margin:6px 0">${d.skills.map((id) => skillById(id)).filter(Boolean).map((s) => `<button class="tag tag-btn lv-confident" data-ivskill="${s.id}" title="Remove">${esc(s.name)} &times;</button>`).join("")}
      <select data-ivaddskill aria-label="Add a skill"><option value="">+ Add a skill</option>${SKILL_AREAS.map((a) => `<optgroup label="${esc(a)}">${SKILLS.filter((s) => s.area === a && !d.skills.includes(s.id)).map((s) => `<option value="${s.id}">${esc(s.name)}</option>`).join("")}</optgroup>`).join("")}</select></div>
    <div class="row between" style="margin-top:12px"><span class="M" id="ivs-msg" role="alert"></span><div class="row"><button class="btn ghost" data-ivscancel>Cancel</button><button class="btn primary" data-ivssave>${d.id ? "Save changes" : "Save story"}</button></div></div></div>`;
}
function saveStory() {
  const d = views._ivDraft;
  if (!d.title.trim() && !d.a.trim()) { $("#ivs-msg").textContent = "Give the story a title or at least the Action."; return; }
  const st = ivState(), s = Object.assign({}, d, { id: d.id || "s" + Date.now().toString(36), updated: today() });
  const i = st.stories.findIndex((x) => x.id === s.id);
  if (i >= 0) st.stories[i] = s; else { st.stories.push(s); bump(); }
  views._ivDraft = null; save(); render(); revealEl("#story-" + s.id);
}

// ---------------- events ----------------
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-ivreview], [data-ivrole], [data-ivformat], [data-ivstart], [data-ivclock], [data-ivscore], [data-ivgo], [data-ivfinish], [data-ivquit], [data-ivshow], [data-ivdel], [data-ivnewstory], [data-ivedit], [data-ivsdel], [data-ivscancel], [data-ivssave], [data-ivtheme], [data-ivskill]");
  if (!b) return;
  const d = b.dataset, st = ivState(), m = st.ivActive, r = m && m.rounds[m.cur];
  if (d.ivreview) { (views._trqf = views._trqf || {})[d.ivreview] = { topic: "", status: "review" }; return go(d.ivreview + ":questions"); }
  if (d.ivrole) { st.ivPrefs.role = d.ivrole; save(); return rerender(); }
  if (d.ivformat) { st.ivPrefs.format = d.ivformat; save(); return rerender(); }
  if (d.ivstart !== undefined) { startMock(); render(); window.scrollTo(0, 0); return ivFocusRound("Mock started."); }
  if (d.ivclock !== undefined && r) { if (r.since) pauseRound(r); else r.since = Date.now(); save(); return rerender(); }
  if (d.ivscore && r) { r.score = +d.ivscore; save(); return rerender(); }
  if (d.ivshow !== undefined && r) { r.shown = !r.shown; save(); return rerender(); }
  if (d.ivgo && m) {
    const wasRunning = !!r.since; pauseRound(r);
    m.cur = +d.ivgo;
    if (wasRunning && !m.rounds[m.cur].score) m.rounds[m.cur].since = Date.now(); // keep the clock going into the next round
    save(); render(); window.scrollTo(0, 0);
    return ivFocusRound("");
  }
  if (d.ivfinish !== undefined && m) {
    const unscored = m.rounds.filter((x) => !x.score).length;
    if (unscored && !confirm(`${unscored} round${unscored === 1 ? " isn't" : "s aren't"} scored yet. Save anyway?`)) return;
    finishMock(); go("interview:history");
    return announce("Mock saved. It's at the top of your history.");
  }
  if (d.ivquit !== undefined && m) {
    if (confirm("Abandon this mock? It won't be saved.")) { st.ivActive = null; save(); render(); focusPage(); announce("Mock abandoned. Nothing was saved."); }
    return;
  }
  if (d.ivdel) { if (confirm("Delete this mock from your history?")) { st.ivMocks = st.ivMocks.filter((x) => x.id !== d.ivdel); save(); } return rerender(); }
  // stories
  if (d.ivnewstory !== undefined) { views._ivDraft = blankStory(d.ivnewstory ? d.ivnewstory.split(",") : []); go("interview:stories"); return revealEl("#iv-form"); }
  if (d.ivedit) { views._ivEdit = d.ivedit; views._ivDraft = null; render(); return revealEl("#iv-form"); }
  if (d.ivsdel) { if (confirm("Delete this story?")) { st.stories = st.stories.filter((x) => x.id !== d.ivsdel); searchIndex = null; save(); } return rerender(); }
  if (d.ivscancel !== undefined) { views._ivDraft = null; return rerender(); }
  if (d.ivssave !== undefined && views._ivDraft) return saveStory();
  if (d.ivtheme && views._ivDraft) { const t = views._ivDraft.themes, i = t.indexOf(d.ivtheme); if (i >= 0) t.splice(i, 1); else t.push(d.ivtheme); return rerender(); }
  if (d.ivskill && views._ivDraft) { views._ivDraft.skills = views._ivDraft.skills.filter((x) => x !== d.ivskill); return rerender(); }
});
document.addEventListener("input", (e) => {
  const d = e.target.dataset || {};
  if (d.ivnotes !== undefined && S.ivActive) { S.ivActive.rounds[S.ivActive.cur].notes = e.target.value; save(); }
  if (d.ivs && views._ivDraft) views._ivDraft[d.ivs] = e.target.value;
});
document.addEventListener("change", (e) => {
  const d = e.target.dataset || {};
  if (d.ivaddskill !== undefined && views._ivDraft && e.target.value) { views._ivDraft.skills.push(e.target.value); rerender(); }
});
