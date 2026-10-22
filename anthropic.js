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
const OPENAI_LEARN = {
  verified: "2026-10-13",
  url: "https://academy.openai.com/pages/courses",
  tracks: [
    ["Apply AI at Work", "For knowledge workers: AI basics, then repeatable workflows and directing work with agents."],
    ["Build with AI", "For builders: the AI Builder courses on designing, building, evaluating and deploying AI solutions with Codex and the OpenAI API."],
    ["Lead AI Adoption", "For leaders: work through one AI initiative and draft an AI strategy, with ownership, governance, a roadmap and an adoption plan."],
    ["Teach and Learn with AI", "For education: using AI to study, teach and learn faster."],
  ],
  certs: "not yet verified",
};

const lessonTags = (tids) => tids.map((tid) => topicById(AI, tid)).filter(Boolean).map((t) => `<button class="tag tag-btn" ${goLearn("ai", t.id)}>${esc(t.title)}</button>`).join("");

function claudeEligibility() {
  return `<div class="callout eligibility" role="note"><b>Eligibility.</b> Anthropic currently limits these exams to people employed by Claude Partner Network
    organizations. Check eligibility on the <a href="${CLAUDE.academy}" target="_blank" rel="noopener">Partner Academy</a> before you plan around it.</div>`;
}

function claudeCoursesCard() {
  return `<div class="card" id="claude-courses"><div class="section-head"><h3>Anthropic courses, in order</h3>${verifiedTag(CLAUDE.verified)}</div>
    <p class="muted" style="margin-top:0">Free, self-paced courses from Anthropic Academy. Start at the top: each one builds on the one before.</p>
    <ol class="course-list">${CLAUDE.courses.map((c) => `<li id="course-${c.id}"><div class="row between" style="align-items:flex-start"><div style="flex:1;min-width:0"><a href="${c.url}" target="_blank" rel="noopener"><b>${esc(c.title)}</b> &nearr;</a>
      <div class="muted">${esc(c.desc)}</div>${c.lessons.length ? `<div class="rl-tags" style="margin-top:6px">${lessonTags(c.lessons)}</div>` : ""}</div></div></li>`).join("")}</ol>
    <a class="btn small ghost" href="${CLAUDE.catalog}" target="_blank" rel="noopener">Full Anthropic course catalog &nearr;</a></div>`;
}

function claudeCertsSummary() {
  return `<div class="card" id="claude-certs"><div class="section-head"><h3>Claude certifications</h3>${verifiedTag(CLAUDE.verified)}</div>
    ${claudeEligibility()}
    <div class="list" style="margin-top:10px">${CLAUDE_CERTS.map((c) => `<div class="li"><div><span class="t">${esc(c.name)}</span><div class="muted">${esc(c.why)}</div></div>
      <a class="btn small ghost" href="${c.link}" target="_blank" rel="noopener">Official page &nearr;</a></div>`).join("")}</div>
    <p class="muted" style="margin-bottom:0">Exam prices and formats change: see each official page. Track your plan for each exam on <button class="link-btn inline-link" data-trgo="ai|certs|">the Certs page</button>.</p></div>`;
}

function openAICard() {
  const O = OPENAI_LEARN;
  return `<div class="card" id="openai-learn"><div class="section-head"><h3>OpenAI Academy</h3>${verifiedTag(O.verified)}</div>
    <p class="muted" style="margin-top:0">OpenAI's own free courses, grouped into four tracks:</p>
    <ul>${O.tracks.map(([t, d]) => `<li><b>${esc(t)}</b>: ${esc(d)}</li>`).join("")}</ul>
    <p><b>OpenAI certifications:</b> <span class="badge due">${esc(O.certs)}</span> <span class="muted">We couldn't confirm a current, generally available OpenAI certification on OpenAI's own pages, so none is listed.</span></p>
    <a class="btn small ghost" href="${O.url}" target="_blank" rel="noopener">OpenAI Academy courses &nearr;</a></div>`;
}

// The top-level page (#/claude).
function claudeView() {
  return `<section class="card hero t-claude">
      <div style="position:relative;z-index:1">
        <div class="eyebrow">Official courses &amp; certifications</div>
        <h1>Claude &amp; Anthropic</h1>
        <p>Anthropic's own courses on using and building with Claude, in the order to take them, and the Claude certifications. Every link goes to the official page.</p>
        <div class="row" style="margin-top:14px"><a class="btn primary" href="${CLAUDE.courses[0].url}" target="_blank" rel="noopener">Start with ${esc(CLAUDE.courses[0].title)} &nearr;</a>
          <button class="btn" data-trgo="ai|certs|">Plan a certification</button></div>
      </div>
    </section>
    ${claudeCoursesCard()}${claudeCertsSummary()}${openAICard()}`;
}

// The same content inside Learn > Lessons (reference/claude-and-anthropic in the folder tree).
function claudeLearnPage() {
  return `<div class="label">Claude &amp; Anthropic</div><h2>Official courses &amp; certifications</h2>
    <p class="muted">Anthropic's courses pair well with the lessons here: each course lists the lessons it builds on.</p>
    ${claudeCoursesCard()}${claudeCertsSummary()}${openAICard()}`;
}
