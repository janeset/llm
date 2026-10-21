"use strict";
// Console (the ` key) and single-key shortcuts ([H] Home, [A] AI / LLM, ...): a small pop-up terminal for
// getting around and checking progress, in the style of Stripe's developer site. Loaded after search.js and
// before app.js; it only uses app.js and track globals at call time.

// Pages `open` knows, by the name you type.
const CON_PAGES = {
  home: "home", ai: "ai:overview", roadmap: "ai:roadmap", learn: "ai:learn", ibm: "ai:ibm", videos: "ai:ibm",
  questions: "ai:questions", quiz: "ai:quiz", projects: "ai:labs", certs: "ai:certs", claude: "claude",
  interview: "interview:mock", mock: "interview:mock", stories: "interview:stories", history: "interview:history",
  roles: "roles:overview", postings: "roles:postings", skills: "roles:skills", companies: "companies", settings: "settings",
};
const CON_HELP = [
  ["open <page or lesson>", "go to a page (see ls) or a lesson: open softmax, open rag"],
  ["ls", "list the pages you can open"],
  ["lessons", "your lessons in order, with what's done"],
  ["next", "open your next lesson"],
  ["week", "this week's plan and build"],
  ["progress", "lessons, exercises, projects, quiz and streak"],
  ["theme [name]", "list the themes, or switch: theme ink"],
  ["search <words>", "search everything in the palette"],
  ["clear", "clear the screen"],
  ["exit", "close the console (or Esc)"],
];

// "AI PREP" in the figlet standard font, built from per-letter rows so the columns always line up.
const CON_GLYPHS = {
  A: ["    _    ", "   / \\   ", "  / _ \\  ", " / ___ \\ ", "/_/   \\_\\"],
  I: [" ___ ", "|_ _|", " | | ", " | | ", "|___|"],
  P: [" ____  ", "|  _ \\ ", "| |_) |", "|  __/ ", "|_|    "],
  R: [" ____  ", "|  _ \\ ", "| |_) |", "|  _ < ", "|_| \\_\\"],
  E: [" _____ ", "| ____|", "|  _|  ", "| |___ ", "|_____|"],
  " ": ["   ", "   ", "   ", "   ", "   "],
};
const conBanner = (word) => [0, 1, 2, 3, 4].map((r) => [...word].map((c) => CON_GLYPHS[c][r]).join("")).join("\n");

let conHistory = [], conHistPos = 0, conReturnFocus = null;

function openConsole() {
  let box = document.getElementById("console");
  if (!box) {
    box = document.createElement("section");
    box.id = "console"; box.className = "console"; box.hidden = true;
    box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Console");
    box.innerHTML = `<div class="con-bar"><span class="dots" aria-hidden="true"><i></i><i></i></span><span>Console</span><button type="button" data-con-close title="Close (Esc)" aria-label="Close the console">&times;</button></div>
      <div class="con-out" id="con-out" aria-live="polite"></div>
      <label class="con-in"><b aria-hidden="true">$</b><input id="con-q" autocomplete="off" spellcheck="false" aria-label="Console command"></label>`;
    document.body.appendChild(box);
    conPrint(`<div class="ascii" aria-hidden="true">${esc(conBanner("AI PREP"))}</div><div class="rule"></div>Type <b>help</b> to see the commands. Try <b>next</b>, <b>week</b> or <b>open softmax</b>.<div class="rule"></div>`);
    $("#con-q", box).addEventListener("keydown", conKey);
    box.addEventListener("click", (e) => {
      if (e.target.closest("[data-con-close]")) return closeConsole();
      const l = e.target.closest("[data-con-run]");
      if (l) conRun(l.dataset.conRun);
      else if (!e.target.closest("a, button") && !String(window.getSelection())) $("#con-q").focus();
    });
  }
  if (box.hidden) conReturnFocus = document.activeElement;
  box.hidden = false;
  document.getElementById("console-open")?.classList.add("on");
  $("#con-q").focus();
}
function closeConsole() {
  const box = document.getElementById("console");
  if (!box || box.hidden) return;
  box.hidden = true;
  document.getElementById("console-open")?.classList.remove("on");
  // Focus goes back where it was, and never stays on the hidden input (where the shortcut keys would be ignored)
  if (conReturnFocus && conReturnFocus !== document.body && document.contains(conReturnFocus)) conReturnFocus.focus();
  else if (box.contains(document.activeElement)) document.activeElement.blur();
}
const toggleConsole = () => { const b = document.getElementById("console"); b && !b.hidden ? closeConsole() : openConsole(); };

function conPrint(html, cls = "") {
  const out = $("#con-out"), d = document.createElement("div");
  if (cls) d.className = cls;
  d.innerHTML = html;
  out.appendChild(d);
  out.scrollTop = out.scrollHeight;
}
// A command you can click in the output (runs it as if typed).
const conLink = (cmd, label = cmd) => `<button type="button" class="lnk" data-con-run="${esc(cmd)}">${esc(label)}</button>`;

function conKey(e) {
  const inp = e.target;
  if (e.key === "Enter") { const v = inp.value; inp.value = ""; conRun(v); }
  else if (e.key === "Escape") { e.preventDefault(); closeConsole(); }
  else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
    if (!conHistory.length) return;
    e.preventDefault();
    conHistPos = Math.max(0, Math.min(conHistory.length, conHistPos + (e.key === "ArrowUp" ? -1 : 1)));
    inp.value = conHistory[conHistPos] || "";
  } else if (e.key === "Tab") {
    // Complete a command, or a page name after open / cd
    e.preventDefault();
    const m = /^(\s*)(\S*)(\s+)?(\S*)$/.exec(inp.value);
    if (!m) return;
    const [, lead, cmd, gap, arg] = m;
    const pick = (opts, part) => { const hits = opts.filter((o) => o.startsWith(part.toLowerCase())); return hits.length === 1 ? hits[0] : null; };
    if (!gap) { const c = pick(["clear", "exit", "help", "lessons", "ls", "next", "open", "progress", "search", "theme", "week"], cmd); if (c) inp.value = lead + c + " "; }
    else if (/^(open|cd)$/i.test(cmd)) { const p = pick(Object.keys(CON_PAGES), arg); if (p) inp.value = `${lead}${cmd} ${p}`; }
  }
}

function conRun(raw) {
  const line = String(raw || "").trim();
  conPrint(`<b>$</b> ${esc(line)}`, "cmd");
  if (!line) return;
  conHistory.push(line); conHistPos = conHistory.length;
  const [cmd, ...rest] = line.split(/\s+/), arg = rest.join(" "), T = TRACKS.ai;
  switch (cmd.toLowerCase()) {
    case "help": case "?":
      return conPrint(CON_HELP.map(([c, d]) => `<b>${esc(c.padEnd(22))}</b><span class="dim">${esc(d)}</span>`).join("\n"));
    case "ls":
      return conPrint(Object.keys(CON_PAGES).map((p) => conLink("open " + p, p)).join("  "));
    case "open": case "cd": case "go": {
      if (!arg) return conPrint(`Open what? Try ${conLink("ls")} for pages or ${conLink("lessons")} for lessons.`, "dim");
      const k = arg.toLowerCase();
      if (CON_PAGES[k]) { go(CON_PAGES[k]); return conPrint(`Opened ${esc(k)}.`, "ok"); }
      const id = resolveLesson(T, k);
      if (id && (topicById(T, id) || id === "glossary")) {
        trState("ai").sel = id; go("ai:learn");
        return conPrint(`Opened ${esc(topicById(T, id)?.title || "the glossary")}.`, "ok");
      }
      return conPrint(`No page or lesson called "${esc(arg)}". Try ${conLink("ls")} or ${conLink("lessons")}.`, "err");
    }
    case "lessons": {
      const next = pathNext(T);
      return conPrint(learnPath(T).map((t, i) => {
        const done = topicDone(T, t), mark = done ? `<span class="ok">✓</span>` : t === next ? `<b>→</b>` : `<span class="dim">·</span>`;
        return `${mark} ${String(i + 1).padStart(2)}  ${conLink("open " + t.id, t.title)}${t === next ? ` <span class="dim">(next)</span>` : ""}`;
      }).join("\n"));
    }
    case "next": {
      const next = pathNext(T);
      if (!next) return conPrint(`Every lesson is done. Try the ${conLink("open quiz", "quiz")}.`, "ok");
      trState("ai").sel = next.id; go("ai:learn");
      return conPrint(`Opened ${esc(next.title)}.`, "ok");
    }
    case "week": {
      const wk = trackWeek("ai"), w = T.weeks[(wk || 1) - 1];
      const head = wk ? `Week ${wk} of ${T.weeks.length}: ${esc(w.title)}` : `Not started. Week 1 of ${T.weeks.length}: ${esc(w.title)}`;
      return conPrint(`<b>${head}</b>\n${esc(w.goal)}${wk ? "" : `\n<span class="dim">Start the plan on ${conLink("open ai", "AI / LLM > Overview")} to track your week.</span>`}`);
    }
    case "progress": case "status": {
      const p = trackProgress("ai"), quiz = p.answered ? `${Math.round(100 * p.correct / p.answered)}% (${p.correct}/${p.answered})` : "not started";
      const rows = [["Lessons", `${p.done} / ${p.lessons}`], ["Exercises", `${p.exDone} / ${p.exTotal}`], ["Projects", `${p.labs} / ${T.labs.length}`], ["Quiz", quiz],
        ["Streak", `${streak()} day${streak() === 1 ? "" : "s"}`], ["Today", `${S.activity[today()] || 0} done`]];
      return conPrint(rows.map(([k, v]) => `<span class="dim">${k.padEnd(10)}</span>${esc(v)}`).join("\n"));
    }
    case "theme": {
      if (!arg) return conPrint(THEMES.map((t) => `${(S.theme || "system") === t.id ? "<b>*</b>" : " "} ${conLink("theme " + t.name.toLowerCase(), t.name)}${" ".repeat(Math.max(1, 15 - t.name.length))}<span class="dim">${esc(t.desc)}</span>`).join("\n"));
      const k = arg.toLowerCase(), t = THEMES.find((x) => x.id === k || x.name.toLowerCase() === k);
      if (!t) return conPrint(`No theme called "${esc(arg)}". Type ${conLink("theme")} to list them.`, "err");
      S.theme = t.id; save(); applyTheme(); render();
      return conPrint(`Theme: ${esc(t.name)}.`, "ok");
    }
    case "search": closeConsole(); return openSearch(arg);
    case "clear": $("#con-out").innerHTML = ""; return;
    case "exit": case "close": case "quit": return closeConsole();
    default: return conPrint(`Unknown command "${esc(cmd)}". Type ${conLink("help")} for the list.`, "err");
  }
}

// Single-key shortcuts: the letters shown in the main nav, ` for the console. Off in Settings turns them all off.
document.addEventListener("keydown", (e) => {
  if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
  if (/^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable || document.querySelector("dialog[open]")) return;
  if (e.key === "Escape") return closeConsole();
  if (S.keys === false) return;
  if (e.key === "`") { e.preventDefault(); return toggleConsole(); }
  const b = e.key.length === 1 && document.querySelector(`#nav button[data-key="${e.key.toLowerCase()}"]`);
  if (b) { e.preventDefault(); b.click(); }
});
document.addEventListener("click", (e) => { if (e.target.closest("#console-open")) toggleConsole(); });
