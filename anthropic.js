"use strict";
// Claude & Anthropic track: Anthropic's official courses (Anthropic Academy on Skilljar) and Claude
// certifications (Claude Partner Academy), plus the OpenAI Academy entry. Rendered on its own page
// (#/claude), in the AI track's Learn sidebar and on its Certs page, and indexed by search.
//
// Everything here was checked on the official pages on the date in `verified`. Titles, order and links
// come from those pages; prices are deliberately not stored. When you re-check a page, update its date;
// when something can't be checked, say "not yet verified" in the UI rather than guessing.

const CLAUDE = {
  verified: "2026-10-13",
  catalog: "https://anthropic.skilljar.com/",
  // Learning order for this app: fluency first, then everyday Claude, then building with the API and MCP.
  courses: [
    { id: "ai-fluency", title: "AI Fluency: Framework & Foundations", url: "https://anthropic.skilljar.com/ai-fluency-framework-foundations",
      desc: "Practical skills for working with AI productively, responsibly and safely. For people new to Claude and experienced AI users alike.", lessons: ["az-model", "safety"] },
    { id: "claude-101", title: "Claude 101", url: "https://anthropic.skilljar.com/claude-101",
      desc: "Using Claude in daily work: its core features, with pointers to more advanced topics.", lessons: ["prompting"] },
    { id: "claude-api", title: "Building with the Claude API", url: "https://anthropic.skilljar.com/claude-with-the-anthropic-api",
      desc: "Building Claude-powered applications through the API: prompting, tool use, retrieval and agent workflows. For software engineers moving into AI development.", lessons: ["apis", "tools", "rag", "agents"] },
    { id: "mcp-intro", title: "Introduction to Model Context Protocol", url: "https://anthropic.skilljar.com/introduction-to-model-context-protocol",
      desc: "Building MCP servers and clients in Python with tools, resources and prompts, to connect Claude to external services.", lessons: ["tools"] },
    { id: "mcp-advanced", title: "Model Context Protocol: Advanced Topics", url: "https://anthropic.skilljar.com/model-context-protocol-advanced-topics",
      desc: "Sampling, notifications, file access and transports, for developers building MCP servers and clients.", lessons: ["tools", "agents"] },
  ],
  academy: "https://anthropic-partners.skilljar.com/page/faq-certifications",
  eligibility: "Anthropic currently limits these exams to people employed by Claude Partner Network organizations. Check eligibility on the Partner Academy before you plan around it.",
};

// Claude certifications, shown on the AI track's Certs page. `topics` are lessons in this app that relate to
// the exam's subject; they are not Anthropic's exam blueprint.
const CLAUDE_CERTS = [
  { id: "cc-associate", code: "Associate – Foundations", name: "Claude Certified Associate – Foundations", provider: "Anthropic", level: "Foundations", tag: "",
    link: "https://anthropic-partners.skilljar.com/claude-certified-associate-foundations-certification", verified: CLAUDE.verified,
    why: "Anthropic's entry-level Claude certification. Per Anthropic's FAQ it does not count toward Claude Partner Network eligibility.", topics: ["foundations", "prompting", "safety"] },
  { id: "cc-developer", code: "Developer – Foundations", name: "Claude Certified Developer – Foundations", provider: "Anthropic", level: "Foundations", tag: "",
    link: "https://anthropic-partners.skilljar.com/claude-certified-developer-foundations-certification", verified: CLAUDE.verified,
    why: "For developers building with Claude. Counts toward Claude Partner Network eligibility.", topics: ["apis", "prompting", "structured", "tools", "agents", "evals"] },
  { id: "cc-architect", code: "Architect – Foundations", name: "Claude Certified Architect – Foundations", provider: "Anthropic", level: "Foundations", tag: "",
    link: "https://anthropic-partners.skilljar.com/claude-certified-architect-foundations-certification", verified: CLAUDE.verified,
    why: "For people designing Claude-based systems. Counts toward Claude Partner Network eligibility.", topics: ["agents", "tools", "prompting", "structured", "tokenization"] },
  { id: "cc-architect-pro", code: "Architect – Professional", name: "Claude Certified Architect – Professional", provider: "Anthropic", level: "Professional", tag: "",
    link: "https://anthropic-partners.skilljar.com/claude-certified-architect-professional-certification", verified: CLAUDE.verified,
    why: "The professional-level architect exam. Counts toward Claude Partner Network eligibility.", topics: ["agents", "rag", "evals", "safety", "llmops"] },
];
AI.certs.push(...CLAUDE_CERTS);

// OpenAI: only what could be confirmed on OpenAI's own site. The course hub and its four tracks were
// verified; no OpenAI certification page could be verified, so the UI says so.
// The four tracks in the order the course hub shows them. Each track's courses come in groups ([label, courses]; the
// label is null for a single group), and each course is [title, url, who it's for or what it uses], all as OpenAI
// labels them. `pick` marks the track that fits this app's AI engineering course best.
const OA = (slug) => `https://academy.openai.com/public/courses/${slug}`;
const OPENAI_LEARN = {
  verified: "2026-10-22",
  url: "https://academy.openai.com/pages/courses",
  tracks: [
    { name: "Apply AI at Work", audience: "Knowledge workers", desc: "AI basics, then repeatable workflows and directing work with agents.",
      groups: [[null, [["AI Foundations", OA("ai-foundations-dnq5w"), "New to AI"], ["Applied AI Foundations", OA("applied-ai-foundations-szsmv"), "Some experience"],
        ["Agents and Workflows", OA("agents-and-workflows-y0qoc"), "Comfortable using AI"]]]] },
    { name: "Build with AI", audience: "Builders", pick: true, desc: "The AI Builder courses: scope, build, evaluate and run AI solutions with the OpenAI API and Codex.",
      groups: [["OpenAI API", [["Scope AI Solutions", OA("scope-ai-solutions-kjplw")], ["Evaluate AI Applications", OA("evaluate-ai-applications-pxds7")],
        ["Design and Build Agentic Systems", OA("design-and-build-agentic-systems-k5uke")], ["Build with Retrieval-Augmented Generation", OA("build-with-retrieval-augmented-generation-2v6xg")],
        ["Optimize AI Application Performance", OA("optimize-ai-application-performance-1k50h")]]],
        ["Codex", [["Get Started with Codex", OA("get-started-with-codex-jkhsq")], ["Extend Codex Workflows", OA("extend-codex-workflows-4e61p")],
          ["Scale Codex Across Governed Teams and Systems", OA("scale-codex-across-teams-and-systems-jr83a")]]]] },
    { name: "Lead AI Adoption", audience: "Leaders", desc: "Work through one AI initiative and draft an AI strategy, with ownership, governance, a roadmap and an adoption plan.",
      groups: [[null, [["AI Leadership", OA("ai-leadership-kaf7k")]]]] },
    { name: "Teach and Learn with AI", audience: "Education", desc: "Using AI to study, teach and learn faster.",
      groups: [[null, [["AI for Educators", OA("ai-for-educators-lc8j1"), "For educators"], ["AI for College Students", OA("ai-for-college-students-gxgmr"), "For college students"]]]] },
  ],
  certs: "not yet verified",
};
const oaCourses = (tr) => tr.groups.flatMap(([, cs]) => cs);

const lessonTags = (tids) => tids.map((tid) => topicById(AI, tid)).filter(Boolean).map((t) => `<button class="tag tag-btn" ${goLearn("ai", t.id)}>${esc(t.title)}</button>`).join("");

function claudeEligibility() {
  return `<div class="callout eligibility" role="note"><b>Eligibility.</b> Anthropic currently limits these exams to people employed by Claude Partner Network
    organizations. Check eligibility on the <a href="${CLAUDE.academy}" target="_blank" rel="noopener">Partner Academy</a> before you plan around it.</div>`;
}

// The cards take the heading level that fits where they're shown: h2 on the Claude & Anthropic page, h3 inside
// Learn and on the Certifications page.
function claudeCoursesCard(h = 3) {
  return `<section class="card" id="claude-courses" aria-labelledby="h-claude-courses"><div class="section-head"><h${h} class="card-title" id="h-claude-courses">Anthropic courses, in order</h${h}>${verifiedTag(CLAUDE.verified)}</div>
    <p class="muted" style="margin-top:0">Free, self-paced courses from Anthropic Academy. Start at the top: each one builds on the one before.</p>
    <ol class="course-list">${CLAUDE.courses.map((c, i) => `<li id="course-${c.id}"><span class="course-n" aria-hidden="true">${i + 1}</span><div class="course-body">
      <a href="${c.url}" target="_blank" rel="noopener"><b>${esc(c.title)}</b> ${NEW_TAB}</a><p class="muted">${esc(c.desc)}</p>
      ${c.lessons.length ? `<div class="course-lessons"><span class="label">Related lessons here</span>${lessonTags(c.lessons)}</div>` : ""}</div></li>`).join("")}</ol>
    <a class="btn small ghost" href="${CLAUDE.catalog}" target="_blank" rel="noopener">Full Anthropic course catalog ${NEW_TAB}</a></section>`;
}

function claudeCertsSummary(h = 3) {
  return `<section class="card" id="claude-certs" aria-labelledby="h-claude-certs"><div class="section-head"><h${h} class="card-title" id="h-claude-certs">Claude certifications</h${h}>${verifiedTag(CLAUDE.verified)}</div>
    ${claudeEligibility()}
    <ul class="cert-list">${CLAUDE_CERTS.map((c) => `<li><div class="cert-body"><span class="t">${esc(c.name)}</span> <span class="chip">${esc(c.level)}</span><p class="muted">${esc(c.why)}</p></div>
      <a class="btn small ghost" href="${c.link}" target="_blank" rel="noopener">Official page<span class="sr-only"> for ${esc(c.name)}</span> ${NEW_TAB}</a></li>`).join("")}</ul>
    <p class="muted" style="margin-bottom:0">Exam prices and formats change: see each official page. Track your plan for each exam on <button class="link-btn inline-link" data-trgo="ai|certs|">the Certifications page</button>.</p></section>`;
}

function openAICard(h = 3) {
  const O = OPENAI_LEARN;
  return `<section class="card" id="openai-learn" aria-labelledby="h-openai"><div class="section-head"><h${h} class="card-title" id="h-openai">OpenAI Academy</h${h}>${verifiedTag(O.verified)}</div>
    <p class="muted" style="margin-top:0">OpenAI's own free courses, in four tracks by who they're for. Courses are listed in OpenAI's order.</p>
    <div class="oa-grid">${O.tracks.map((tr) => {
      const n = oaCourses(tr).length;
      return `<section class="oa-track ${tr.pick ? "pick" : ""}" aria-labelledby="oa-${slugOf(tr.name)}">
        <div class="oa-head"><h${h + 1} class="oa-name" id="oa-${slugOf(tr.name)}">${esc(tr.name)}</h${h + 1}><span class="chip">${esc(tr.audience)}</span></div>
        ${tr.pick ? `<p class="oa-pick"><b>Best match for this course:</b> the API and Codex skills AI engineering roles ask for.</p>` : ""}
        <p class="muted">${esc(tr.desc)}</p>
        ${tr.groups.map(([label, cs]) => `${label ? `<div class="label oa-group">${esc(label)}</div>` : ""}
          <ol class="oa-courses">${cs.map(([title, url, note]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(title)} ${NEW_TAB}</a>${note ? `<span class="muted">${esc(note)}</span>` : ""}</li>`).join("")}</ol>`).join("")}
        <p class="oa-count muted">${n} course${n === 1 ? "" : "s"}</p></section>`;
    }).join("")}</div>
    <div class="callout oa-certs" role="note"><b>OpenAI certifications</b> <span class="badge due">${esc(O.certs)}</span>
      <p>We couldn't confirm a current, generally available OpenAI certification on OpenAI's own pages, so none is listed. The courses above are learning only. For an exam to plan around, see the Claude certifications on <button class="link-btn inline-link" data-trgo="ai|certs|">the Certifications page</button>.</p></div>
    <a class="btn small ghost" href="${O.url}" target="_blank" rel="noopener">All OpenAI Academy courses ${NEW_TAB}</a></section>`;
}

// The top-level page (#/claude): the sections in a reading column, a row of jumps to them, and beside them the
// lessons in this app that the courses build on.
function claudeView() {
  const jumps = [["claude-courses", "Anthropic courses"], ["claude-certs", "Claude certifications"], ["openai-learn", "OpenAI Academy"]];
  const lessons = [...new Set(CLAUDE.courses.flatMap((c) => c.lessons))].map((tid) => topicById(AI, tid)).filter(Boolean);
  return pageHead("Claude &amp; Anthropic", "Anthropic's own courses on using and building with Claude, in the order to take them, and the Claude certifications. Every link goes to the official page and opens in a new tab.", {
      eyebrow: "Official courses &amp; certifications",
      actions: `<a class="btn primary" href="${CLAUDE.courses[0].url}" target="_blank" rel="noopener">Start with ${esc(CLAUDE.courses[0].title)} ${NEW_TAB}</a><button class="btn" data-trgo="ai|certs|">Plan a certification</button>` })
    + `<nav class="toc" aria-label="On this page"><span class="label" aria-hidden="true">On this page</span><ul>${jumps.map(([id, l]) => `<li><button class="toc-link" data-scrollto="${id}">${l}</button></li>`).join("")}</ul></nav>
    <div class="doc-layout">
      <div class="doc-main">${claudeCoursesCard(2)}${claudeCertsSummary(2)}${openAICard(2)}</div>
      <aside class="doc-side" aria-labelledby="h-claude-lessons"><div class="card side-box"><h2 class="card-title" id="h-claude-lessons">Lessons these courses build on</h2>
        <p class="muted">In Learn, with exercises that run in your browser.</p>
        <ul class="side-links">${lessons.map((t) => `<li><button class="link-btn" ${goLearn("ai", t.id)}>${esc(t.title)}</button></li>`).join("")}</ul></div></aside>
    </div>`;
}

// The same content inside Learn > Lessons (reference/claude-and-anthropic in the folder tree).
function claudeLearnPage() {
  return `<div class="label">Claude &amp; Anthropic</div><h1>Official courses &amp; certifications</h1>
    <p class="muted">Anthropic's courses pair well with the lessons here: each course lists the lessons it builds on.</p>
    ${claudeCoursesCard(2)}${claudeCertsSummary(2)}${openAICard(2)}`;
}
