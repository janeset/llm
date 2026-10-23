"use strict";
// Roles section: role switcher, skill demand computed from the postings (built-in + added in the app), readiness, posting fit, and
// the shared track engine (trackview.js) for Learn / Questions / Quiz / Projects.
// Data: roles.js (roles, skills, postings) and roles-learn.js (ROLES lessons and questions).

TRACKS.roles = ROLES;
TRACK_ICON.roles = `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/></svg>`;

const ROLE_LEVELS = [["", "Not yet"], ["learning", "Learning"], ["confident", "Confident"]];
const LEVEL_VALUE = { learning: 0.5, confident: 1 };
const roleById = (id) => ROLE_DEFS.find((r) => r.id === id);
const skillById = (id) => SKILLS.find((s) => s.id === id);
// Built-in postings plus the ones added in the app (saved in this browser). Postings for a role
// this version doesn't cover (e.g. imported from the combined Prep Hub, or the removed AI Cloud Engineer
// role) are left out, and skills that no longer exist are dropped from the rest.
const knownSkills = (ids) => (ids || []).filter((id) => skillById(id));
const allPostings = () => POSTINGS.filter((p) => !p.local || S.localMarket).concat(S.myPostings || []).filter((p) => roleById(p.role))
  .map((p) => (p.required.every(skillById) && p.preferred.every(skillById) ? p : Object.assign({}, p, { required: knownSkills(p.required), preferred: knownSkills(p.preferred) })));
const roleName = (id) => (id === "all" ? "All roles" : roleById(id).name);

function rlState() {
  const st = trState("roles");
  if (st.role !== "all" && !roleById(st.role)) st.role = ROLE_DEFS[0].id;
  st.conf = st.conf || {};
  return st;
}

// Skills for a role (or "all"), weighted by how often postings ask for them: required counts 2,
// preferred 1. Baseline skills with no posting demand yet get weight 1. Ties keep the order the
// postings list skills in (most central first).
function roleDemand(role) {
  const posts = allPostings().filter((p) => role === "all" || p.role === role);
  const rows = new Map();
  const row = (id) => {
    if (!rows.has(id)) rows.set(id, { skill: skillById(id), req: [], pref: [], base: false, pos: Infinity });
    return rows.get(id);
  };
  (role === "all" ? ROLE_DEFS : [roleById(role)]).forEach((r) => r.baseline.forEach((id) => { row(id).base = true; }));
  posts.forEach((p) => {
    p.required.forEach((id, i) => { const r = row(id); r.req.push(p); r.pos = Math.min(r.pos, i); });
    p.preferred.forEach((id, i) => { const r = row(id); r.pref.push(p); r.pos = Math.min(r.pos, 100 + i); });
  });
  const list = [...rows.values()].map((r) => Object.assign(r, { score: 2 * r.req.length + r.pref.length }))
    .map((r) => Object.assign(r, { weight: r.score || 1 }))
    .sort((a, b) => b.score - a.score || a.pos - b.pos || b.base - a.base || a.skill.name.localeCompare(b.skill.name));
  return { posts, list };
}
const levelOf = (id) => rlState().conf[id] || "";
function roleReadiness(list) {
  const total = list.reduce((n, r) => n + r.weight, 0);
  return total ? list.reduce((n, r) => n + r.weight * (LEVEL_VALUE[levelOf(r.skill.id)] || 0), 0) / total : 0;
}
function postingFit(p) {
  const total = 2 * p.required.length + p.preferred.length;
  const got = p.required.reduce((n, id) => n + 2 * (LEVEL_VALUE[levelOf(id)] || 0), 0) + p.preferred.reduce((n, id) => n + (LEVEL_VALUE[levelOf(id)] || 0), 0);
  return total ? got / total : 0;
}

// ---------------- small pieces ----------------
function roleSwitch(st) {
  return `<div class="role-switch"><div class="seg">${[...ROLE_DEFS.map((r) => [r.id, r.name]), ["all", "All roles"]].map(([id, name]) => {
    const n = allPostings().filter((p) => id === "all" || p.role === id).length;
    return `<button data-rlrole="${id}" class="${st.role === id ? "on" : ""}">${esc(name)} <span class="muted">${n}</span></button>`;
  }).join("")}</div></div>`;
}
function demandText(r, nPosts) {
  if (!r.req.length && !r.pref.length) return "Baseline (not in a posting yet)";
  const who = (ps) => ps.map((p) => p.company).join(", ");
  return [r.req.length ? `Required in ${r.req.length}/${nPosts}` : "", r.pref.length ? `preferred in ${r.pref.length}/${nPosts}` : ""].filter(Boolean).join(", ") +
    ` <span class="muted">(${esc(who([...new Set([...r.req, ...r.pref])]))})</span>`;
}
function learnLinks(s) {
  return `<span class="rl-tags">` + s.learn.map(([tr, tid]) => {
    const t = topicById(TRACKS[tr], tid);
    return t ? `<button class="tag tag-btn" ${goLearn(tr, tid)} title="${esc(TRACKS[tr].name)}">${tr === "roles" ? "" : `<span class="muted">${esc(TRACKS[tr].short)}:&nbsp;</span>`}${esc(t.title)}</button>` : "";
  }).join("") + "</span>";
}
const levelBadge = (id) => { const l = levelOf(id); return l === "confident" ? '<span class="badge done">Confident</span>' : l === "learning" ? '<span class="badge due">Learning</span>' : '<span class="badge">Not yet</span>'; };
function skillTag(id) {
  const s = skillById(id), first = s.learn.find(([tr, tid]) => topicById(TRACKS[tr], tid));
  if (!first) return `<span class="tag lv-${levelOf(id) || "none"}" title="Covered in the Cloud Prep version">${esc(s.name)}</span>`;
  return `<button class="tag tag-btn lv-${levelOf(id) || "none"}" ${goLearn(first[0], first[1])} title="Open lesson">${esc(s.name)}</button>`;
}
// The application-tracker entry for a posting: linked by id, or (older entries) by company name.
const trackerEntry = (p) => S.companies.find((c) => c.posting === p.id) || S.companies.find((c) => !c.posting && c.name.toLowerCase() === p.company.toLowerCase());
const inTracker = (p) => !!trackerEntry(p);

// ---------------- pages ----------------
function roleView(sub) {
  const st = rlState();
  switch (sub) {
    case "skills": return rlSkills(st);
    case "postings": return rlPostings(st);
    case "learn": return trLearn(ROLES, st);
    case "questions": return trQuestions(ROLES, st);
    case "quiz": return trQuiz(ROLES, st);
    case "labs": return trLabs(ROLES, st);
    default: return rlOverview(st);
  }
}

function rlOverview(st) {
  const { posts, list } = roleDemand(st.role), ready = roleReadiness(list), role = st.role === "all" ? null : roleById(st.role);
  const confident = list.filter((r) => levelOf(r.skill.id) === "confident").length;
  const lessonsDone = ROLES.topics.filter((t) => topicDone(ROLES, t)).length;
  const top = list.filter((r) => r.score).slice(0, 8), shownTop = top.length ? top : list.slice(0, 8);
  const maxScore = Math.max(1, ...list.map((r) => r.score));
  const gaps = list.filter((r) => levelOf(r.skill.id) !== "confident").slice(0, 5);
  return roleSwitch(st) + pageHead(esc(roleName(st.role)), `${esc(role ? role.tagline : "Every role combined: the skills employers ask for most across all the postings you've collected.")}.`, {
      eyebrow: `${posts.length} posting${posts.length === 1 ? "" : "s"} · ${list.length} skills tracked`,
      actions: `<button class="btn primary" data-nav-go="roles:skills">Rate your skills &rarr;</button><button class="btn" data-nav-go="roles:postings">View postings</button>`,
      aside: ring(ready, "ready") })
    + `${posts.length ? "" : `<div class="callout" style="margin-bottom:var(--gap)">No postings for this role yet, so the skills below are a <b>baseline</b> for the role. Add postings on the Postings tab and the demand numbers will come from real employers.</div>`}
    <div class="grid">
      <div class="card"><div class="label">Postings</div><div class="stat">${posts.length}</div><div class="muted">${allPostings().length} across all roles</div></div>
      <div class="card"><div class="label">Skills confident</div><div class="stat">${confident}<small> / ${list.length}</small></div><div class="bar"><i style="width:${(100 * confident / Math.max(1, list.length)) | 0}%"></i></div></div>
      <div class="card"><div class="label">Role lessons completed</div><div class="stat">${lessonsDone}<small> / ${ROLES.topics.length}</small></div><div class="muted">Gap lessons in Learn</div></div>
      <div class="card"><div class="label">Readiness</div><div class="stat">${Math.round(ready * 100)}%</div><div class="muted">Weighted by posting demand</div></div>
    </div>
    <div class="cols-2">
      <div class="card"><div class="section-head"><h2 class="card-title">${top.length ? "Most requested" : "Baseline skills"}</h2><button class="btn small ghost" data-nav-go="roles:skills">All skills &rarr;</button></div>
        <div class="list">${shownTop.map((r) => `<div class="li"><div style="flex:1;min-width:0"><span class="t">${esc(r.skill.name)}</span>
          <div class="muted" style="font-size:.84rem">${demandText(r, posts.length)}</div>
          ${r.score ? `<div class="bar" style="margin-top:6px"><i style="width:${(100 * r.score / maxScore) | 0}%"></i></div>` : ""}</div>${levelBadge(r.skill.id)}</div>`).join("")}</div></div>
      <div class="card"><div class="section-head"><h2 class="card-title">Biggest gaps</h2><span class="muted">Highest demand, not yet confident</span></div>
        <div class="list">${gaps.length ? gaps.map((r) => `<div class="li"><div style="flex:1;min-width:0"><span class="t">${esc(r.skill.name)}</span><div>${learnLinks(r.skill)}</div></div>${levelBadge(r.skill.id)}</div>`).join("")
          : `<div class="empty"><span class="big">&#127881;</span>You've marked every skill for this role as confident.</div>`}</div></div>
    </div>
    <div class="card"><h2 class="card-title">How this section grows</h2>
      <p class="muted" style="margin-bottom:0">Each posting you add (on the Postings tab) or share in chat is filed under a role and mapped to the shared skill list: must-haves and core duties count as <b>required</b>, nice-to-haves as <b>preferred</b>. Demand and readiness update automatically, and new lessons are only added for real gaps. Rate yourself on the Skills tab; readiness weights each skill by how often employers ask for it.</p></div>`;
}

function rlSkills(st) {
  const { posts, list } = roleDemand(st.role), f = views._rlf = views._rlf || { area: "", level: "" };
  const shown = list.filter((r) => (!f.area || r.skill.area === f.area) && (!f.level || (f.level === "none" ? !levelOf(r.skill.id) : levelOf(r.skill.id) === f.level)));
  return roleSwitch(st) + pageHead(`Skills · ${esc(roleName(st.role))} <span class="muted">${shown.length}</span>`, "Sorted by how often postings ask for each skill. Rate yourself honestly; lessons for each skill are one click away.") +
    `<div class="card toolbar">
      <select data-rlf="area"><option value="">All areas</option>${SKILL_AREAS.map((a) => `<option ${f.area === a ? "selected" : ""}>${esc(a)}</option>`).join("")}</select>
      <select data-rlf="level">${[["", "Any level"], ["none", "Not yet"], ["learning", "Learning"], ["confident", "Confident"]].map(([v, l]) => `<option value="${v}" ${f.level === v ? "selected" : ""}>${l}</option>`).join("")}</select>
      <span class="muted">Readiness ${Math.round(roleReadiness(list) * 100)}% · ${posts.length} posting${posts.length === 1 ? "" : "s"}</span></div>` +
    (shown.length ? `<div class="card"><div class="table-wrap"><table class="skills-table"><tr><th>Skill</th><th class="hide-sm">Demand</th><th class="hide-sm">Learn</th><th>Your level</th></tr>
      ${shown.map((r) => `<tr><td><b style="font-weight:600">${esc(r.skill.name)}</b><div class="muted" style="font-size:.8rem">${esc(r.skill.area)}</div><div class="show-sm" style="font-size:.84rem">${demandText(r, posts.length)}</div><div class="show-sm">${learnLinks(r.skill)}</div></td>
        <td class="hide-sm" style="font-size:.86rem">${demandText(r, posts.length)}</td>
        <td class="hide-sm">${learnLinks(r.skill)}</td>
        <td><select data-rlconf="${r.skill.id}">${ROLE_LEVELS.map(([v, l]) => `<option value="${v}" ${levelOf(r.skill.id) === v ? "selected" : ""}>${l}</option>`).join("")}</select></td></tr>`).join("")}
    </table></div></div>` : `<div class="card empty">No skills match these filters.</div>`);
}

function rlPostings(st) {
  const posts = allPostings().filter((p) => st.role === "all" || p.role === st.role).slice().sort((a, b) => b.added.localeCompare(a.added));
  const d = views._rlDraft;
  return roleSwitch(st) + pageHead(`Postings · ${esc(roleName(st.role))} <span class="muted">${posts.length}</span>`, "Real job postings behind this section. Fit is your weighted coverage of each posting's required (x2) and preferred skills.") +
    localMarketToggle() + (d ? rlForm(d) : `<div class="row" style="margin-bottom:var(--gap)"><button class="btn primary" data-rldnew>+ Add a posting</button><span class="muted">Paste a posting, confirm the skills it asks for, and every number in Roles updates.</span></div>`) +
    (posts.length ? posts.map((p) => {
      const fit = postingFit(p), entry = trackerEntry(p);
      return `<div class="card posting" id="posting-${esc(p.id)}">
        <div class="section-head"><div><h2 class="card-title">${esc(p.title)}</h2><div class="muted">${esc(p.company)}</div></div>
          <div class="row">${p.mine ? '<span class="badge plain">Added by you</span>' : ""}<span class="badge accent">${esc(roleById(p.role).name)}</span><span class="badge ${fit >= 0.7 ? "done" : fit >= 0.4 ? "due" : "plain"}">Fit ${Math.round(fit * 100)}%</span></div></div>
        <div class="row" style="margin-bottom:10px">${[p.location, p.mode, p.pay, p.seniority, `Added ${p.added}`].filter(Boolean).map((x) => `<span class="pill">${esc(x)}</span>`).join("")}</div>
        ${p.summary ? `<p>${esc(p.summary)}</p>` : ""}
        <div class="bar" style="margin-bottom:12px"><i style="width:${Math.round(fit * 100)}%"></i></div>
        <div class="label">Required (${p.required.length})</div><div style="margin:4px 0 10px">${p.required.map(skillTag).join("")}</div>
        <div class="label">Preferred (${p.preferred.length})</div><div style="margin:4px 0 10px">${p.preferred.map(skillTag).join("") || '<span class="muted">None listed</span>'}</div>
        <p class="muted" style="font-size:.8rem;margin-top:0">Tag colours: green confident, amber learning, grey not yet. Click a skill to open its lesson.</p>
        ${p.prep && p.prep.length ? `<h3>How to prepare</h3><ul>${p.prep.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : ""}
        <div class="row">${entry ? `<span class="label" style="margin:0">Application</span><select data-rlstatus="${esc(p.id)}" aria-label="Application status">${STATUSES.map((x) => `<option ${x === entry.status ? "selected" : ""}>${x}</option>`).join("")}</select><button class="btn small ghost" data-nav-go="companies">Open tracker</button>`
          : `<button class="btn small primary" data-rltrack="${esc(p.id)}">Add to application tracker</button>`}
          ${p.link ? `<a class="btn small ghost" href="${esc(p.link)}" target="_blank" rel="noopener">${p.mine ? "Posting link" : "Employer careers page"} &nearr;</a>` : ""}
          ${p.mine ? `<span style="flex:1"></span><button class="btn small" data-rledit="${esc(p.id)}">Edit</button><button class="btn small danger" data-rldel="${esc(p.id)}">Delete</button>` : ""}</div></div>`;
    }).join("") : `<div class="card empty"><span class="big">&#128203;</span>No postings for ${esc(roleName(st.role))} yet. Add one above.</div>`) +
    `<div class="card"><h2 class="card-title">Getting more out of a posting</h2><p class="muted" style="margin-bottom:0">Postings you add here are saved in this browser (and in Settings &rsaquo; Export). They can only use skills that already exist. If a posting asks for something the skill list doesn't cover, share it in Claude Code chat and new lessons, questions and projects will be written for the gap.</p></div>`;
}

// ---------------- add / edit a posting ----------------
const blankDraft = (role) => ({ id: null, role: role === "all" ? ROLE_DEFS[0].id : role, company: "", title: "", location: "", mode: "", pay: "", seniority: "", link: "", text: "", summary: "", prep: "", required: [], preferred: [], sug: null });

// Suggest skills from posting text using SKILL_KEYWORDS. Anything first mentioned after a
// "preferred / nice to have / asset" heading is suggested as preferred, the rest as required.
function suggestSkills(text) {
  const low = " " + String(text).toLowerCase().replace(/\s+/g, " ") + " ";
  const m = /(preferred|nice[- ]to[- ]have|bonus points|considered an asset|would be an asset|assets?:|desirable|it's a plus|is a plus)/.exec(low);
  const cut = m ? m.index : Infinity, out = {};
  const reEsc = (k) => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  Object.entries(SKILL_KEYWORDS).forEach(([id, kws]) => {
    let first = Infinity;
    kws.forEach((k) => {
      const hit = new RegExp("(^|[^a-z0-9+#.])" + reEsc(k) + (k.length <= 4 ? "(?=$|[^a-z0-9+#])" : "")).exec(low);
      if (hit) first = Math.min(first, hit.index);
    });
    if (first < Infinity) out[id] = first < cut ? "req" : "pref";
  });
  return out;
}

function rlForm(d) {
  const field = (k, label, ph = "", req = false) => `<label class="fld"><span>${label}${req ? ' <b class="M">*</b>' : ""}</span><input data-rld="${k}" value="${esc(d[k])}" placeholder="${esc(ph)}" autocomplete="off"></label>`;
  const pick = (id) => (d.required.includes(id) ? "req" : d.preferred.includes(id) ? "pref" : "");
  const sug = d.sug || {};
  return `<div class="card rl-form" id="rl-form">
    <div class="section-head"><h2 class="card-title">${d.id ? "Edit posting" : "Add a posting"}</h2><button class="btn small ghost" data-rldcancel>Cancel</button></div>
    <div class="form-grid">
      <label class="fld"><span>Role <b class="M">*</b></span><select data-rld="role">${ROLE_DEFS.map((r) => `<option value="${r.id}" ${d.role === r.id ? "selected" : ""}>${esc(r.name)}</option>`).join("")}</select></label>
      ${field("company", "Company", "e.g. Shopify", true)}${field("title", "Job title", "e.g. AI Engineer", true)}${field("location", "Location", "e.g. City, region")}
      <label class="fld"><span>Work mode</span><select data-rld="mode">${["", "On-site", "Hybrid", "Remote"].map((m) => `<option value="${m}" ${d.mode === m ? "selected" : ""}>${m || "Not stated"}</option>`).join("")}</select></label>
      ${field("pay", "Pay", "e.g. $120,000 - $140,000")}${field("seniority", "Seniority", "e.g. 3+ years")}${field("link", "Link", "https://...")}
    </div>
    <label class="fld"><span>Posting text</span><textarea data-rld="text" rows="7" placeholder="Paste the full posting here, including the requirements and nice-to-haves.">${esc(d.text)}</textarea></label>
    <div class="row" style="margin:10px 0 4px"><button class="btn" data-rldsuggest>&#10022; Suggest skills from the text</button>
      <span class="muted">${d.sug ? `Found ${Object.keys(sug).length} skills in the text. Check each one below; suggestions are marked &#10022;.` : "Matches the text against the skill list. You confirm every skill."}</span></div>
    <div class="section-head" style="margin-top:14px"><h3 style="margin:0">Skills <span class="muted">${d.required.length} required · ${d.preferred.length} preferred</span></h3></div>
    <p class="muted" style="margin-top:4px"><b>Required</b> = must-haves and core duties (count x2). <b>Preferred</b> = nice-to-haves and assets.</p>
    ${SKILL_AREAS.map((a) => `<div class="label" style="margin-top:12px">${esc(a)}</div><div class="rl-pick">${SKILLS.filter((s) => s.area === a).map((s) => `<div class="rl-pick-row ${pick(s.id) ? "on" : ""}">
      <span>${esc(s.name)}${sug[s.id] ? ` <span class="sug" title="Found in the text (${sug[s.id] === "req" ? "required" : "preferred"} section)">&#10022;</span>` : ""}</span>
      <div class="seg">${[["", "&mdash;"], ["req", "Required"], ["pref", "Preferred"]].map(([v, l]) => `<button data-rldskill="${s.id}|${v}" class="${pick(s.id) === v ? "on" : ""}">${l}</button>`).join("")}</div></div>`).join("")}</div>`).join("")}
    <label class="fld" style="margin-top:14px"><span>Summary (optional)</span><textarea data-rld="summary" rows="2" placeholder="One or two lines on the team and the work. Left blank, the start of the posting text is used.">${esc(d.summary)}</textarea></label>
    <label class="fld"><span>How to prepare (optional, one note per line)</span><textarea data-rld="prep" rows="3" placeholder="e.g. Prepare a story about shipping a RAG feature">${esc(d.prep)}</textarea></label>
    <div class="row between" style="margin-top:12px"><span class="M" id="rld-msg" role="alert"></span><div class="row"><button class="btn ghost" data-rldcancel>Cancel</button><button class="btn primary" data-rldsave>${d.id ? "Save changes" : "Save posting"}</button></div></div>
  </div>`;
}

function saveDraft() {
  const d = views._rlDraft, msg = (t) => { $("#rld-msg").textContent = t; };
  if (!d.company.trim() || !d.title.trim()) return msg("Add the company and job title.");
  if (!d.required.length) return msg("Mark at least one skill as required.");
  const text = d.text.trim(), summary = d.summary.trim() || (text.length > 280 ? text.slice(0, 280).replace(/\s+\S*$/, "") + "…" : text);
  S.myPostings = S.myPostings || [];
  const old = d.id && S.myPostings.find((p) => p.id === d.id);
  const p = {
    id: d.id || "my-" + Date.now().toString(36), mine: true, role: d.role, tier: 2,
    company: d.company.trim(), title: d.title.trim(), location: d.location.trim(), mode: d.mode, pay: d.pay.trim(), seniority: d.seniority.trim(),
    link: /^https?:\/\//i.test(d.link.trim()) ? d.link.trim() : "", added: old ? old.added : today(),
    summary, text, required: d.required.slice(), preferred: d.preferred.slice(), prep: d.prep.split("\n").map((x) => x.trim()).filter(Boolean),
  };
  if (old) S.myPostings[S.myPostings.indexOf(old)] = p; else { S.myPostings.push(p); bump(); }
  rlState().role = p.role; views._rlDraft = null; searchIndex = null; save();
  render(); revealEl("#posting-" + p.id);
}

// ---------------- home card ----------------
function rolesHomeCard() {
  const rows = ROLE_DEFS.map((r) => {
    const { posts, list } = roleDemand(r.id), pct = roleReadiness(list);
    return `<div class="li"><div><span class="t">${esc(r.name)}</span><div class="muted">${posts.length} posting${posts.length === 1 ? "" : "s"} · ${Math.round(pct * 100)}% ready</div></div>
      <div class="bar" style="width:70px;margin:0"><i style="width:${Math.round(pct * 100)}%"></i></div></div>`;
  }).join("");
  return `<div class="card track-card t-roles">
    <div class="tc-head"><span class="tc-icon">${TRACK_ICON.roles}</span><div><h3>Roles</h3><p class="muted">Prep shaped by real postings for AI engineering</p></div></div>
    <div class="list">${rows}</div>
    <div class="row"><button class="btn primary" data-track-go="roles">Continue &rarr;</button></div></div>`;
}

// ---------------- events ----------------
const rlRerender = () => rerender();
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-rlrole], [data-rltrack], [data-rldnew], [data-rldcancel], [data-rldsuggest], [data-rldskill], [data-rldsave], [data-rledit], [data-rldel], [data-rlview]");
  if (!b) return;
  const d = b.dataset, draft = views._rlDraft;
  if (d.rlrole) { rlState().role = d.rlrole; save(); return rlRerender(); }
  if (d.rlview !== undefined) { const p = allPostings().find((x) => x.id === d.rlview); if (p) { rlState().role = p.role; go("roles:postings"); revealEl("#posting-" + p.id); } return; }
  if (d.rldnew !== undefined) { views._rlDraft = blankDraft(rlState().role); render(); return revealEl("#rl-form"); }
  if (d.rldcancel !== undefined) { views._rlDraft = null; return rlRerender(); }
  if (d.rledit) {
    const p = (S.myPostings || []).find((x) => x.id === d.rledit);
    if (p) { views._rlDraft = Object.assign(blankDraft(p.role), p, { prep: (p.prep || []).join("\n"), required: p.required.slice(), preferred: p.preferred.slice(), sug: null }); render(); revealEl("#rl-form"); }
    return;
  }
  if (d.rldel) {
    const p = (S.myPostings || []).find((x) => x.id === d.rldel);
    if (p && confirm(`Delete the ${p.title} posting at ${p.company}? Your tracker entry stays.`)) { S.myPostings.splice(S.myPostings.indexOf(p), 1); searchIndex = null; save(); }
    return rlRerender();
  }
  if (d.rldsuggest !== undefined && draft) {
    // Fill in suggestions but never overwrite a choice you've already made.
    draft.sug = suggestSkills(draft.text);
    Object.entries(draft.sug).forEach(([id, v]) => { if (!draft.required.includes(id) && !draft.preferred.includes(id)) (v === "req" ? draft.required : draft.preferred).push(id); });
    return rlRerender();
  }
  if (d.rldskill && draft) {
    const [id, v] = d.rldskill.split("|");
    draft.required = draft.required.filter((x) => x !== id); draft.preferred = draft.preferred.filter((x) => x !== id);
    if (v === "req") draft.required.push(id); else if (v === "pref") draft.preferred.push(id);
    return rlRerender();
  }
  if (d.rldsave !== undefined && draft) return saveDraft();
  const p = allPostings().find((x) => x.id === d.rltrack);
  if (p && !inTracker(p)) { S.companies.push({ name: p.company, tier: p.tier || 2, status: "Researching", note: `${p.title} (${p.location || "location not stated"})`, posting: p.id }); bump(); save(); }
  rlRerender();
});
document.addEventListener("change", (e) => {
  const d = e.target.dataset || {};
  if (d.rlconf) {
    const st = rlState();
    if (e.target.value) { if (e.target.value === "confident" && st.conf[d.rlconf] !== "confident") bump(); st.conf[d.rlconf] = e.target.value; } else delete st.conf[d.rlconf];
    save(); return rlRerender();
  }
  if (d.rlf) { views._rlf[d.rlf] = e.target.value; return render(); }
  if (d.rlstatus) { const p = allPostings().find((x) => x.id === d.rlstatus), c = p && trackerEntry(p); if (c) { c.status = e.target.value; save(); } return; }
  if (d.rld && views._rlDraft) views._rlDraft[d.rld] = e.target.value;
});
document.addEventListener("input", (e) => {
  const k = (e.target.dataset || {}).rld;
  if (k && views._rlDraft) views._rlDraft[k] = e.target.value;
});
