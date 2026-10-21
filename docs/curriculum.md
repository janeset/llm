# AI / LLM Prep curriculum review

What the strongest AI-engineering programs and current hiring data say, the curriculum this app follows as a result,
how the app's content compared with it before this change, and what was changed. All sources were checked on
**21 Oct 2026**.

## 1. Research

### How much evidence is there that programs get people hired?

Very little that is audited and AI-specific. No program found publishes independently checked placement numbers
for **AI Engineer** roles. The best evidence available is of three weaker kinds, and this review weighted them in
this order:

1. **What employers ask for**: thousands of job descriptions, and the interview processes companies disclose.
2. **What programs teach and how**, for programs with large, visible communities and graded projects.
3. **Self-reported outcomes** (alumni stories, ratings), noted but not relied on.

Bootcamp placement claims (78-92%) are mostly self-reported and count any tech job; an aggregator notes that only
a few schools publish CIRR-audited outcomes ([Eduleague](https://eduleague.ng/2026/09/10/ai-machine-learning-bootcamp-job-guarantees-the-hidden-reality-behind-us-placement-stats/),
[Nucamp ranking](https://www.nucamp.co/blog/top-10-ai-and-machine-learning-bootcamps-in-2026-ranked-by-outcomes)).
Codesmith is the one school found with CIRR-audited outcomes, but they cover its whole software-engineering program,
not AI roles ([Codesmith](https://codesmith.io/blog/against-the-odds-codesmith-2023-24-salary-outcomes-prove-its-still-worth-it-to-invest-in-tech-education)).

### What employers ask for

| Finding | Source |
| --- | --- |
| 6,964 "AI Engineer" postings (Feb-Aug 2026): Python 70.8%, LLMs 62.2%, any agent skill 55.4%, AWS 40.3%, RAG 39.8%, ML 38.0%, CI/CD 36.8%, prompt engineering 34.7%, APIs 26.5%, Docker 24.4%, vector databases 23.7%, observability 22.2%, TypeScript 19.3%, PyTorch 18.2%, MCP 14.1%, model evaluation 11.6% | [AI Engineering Field Guide: skills](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/role/02-skills.md) |
| No framework dominates: LangChain 22.0%, LangGraph 13.8%, LlamaIndex 8.3% | same |
| 889 roles (Jan 2026): ~70% build LLM applications, 28.5% build platforms for them, under 2% are classic ML. RAG 35.9%, prompt engineering 29.1%, fine-tuning 8.5%. Self-hosting, fine-tuning and inference optimization are secondary duties | [AI Shipping Labs](https://aishippinglabs.com/blog/what-is-an-ai-engineer-based-on-job-descriptions) |
| Real work splits roughly 50% orchestration (RAG, agents), 40% evals, 10% efficiency (caching, routing). The hardest problems are debugging: why an instruction was ignored, which chunk caused a hallucination. Model training is rare | [Field Guide: reality vs postings](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/role/05-reality-vs-postings.md) |

### What interviews test

| Finding | Source |
| --- | --- |
| Median 4 interview steps (3-5 typical): recruiter screen, technical round, hiring manager, behavioural, take-home (2-3 h), panel. Some companies run one round with AI tools allowed and one without | [Field Guide: interview process](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/01-interview-process.md) |
| Take-homes (33% of companies with a disclosed process): RAG 40%+, agents 30%+, conversational 20%+, document processing 15%, LLM-as-judge 10%+. Graders weigh evaluation methodology; skipping evals is "the biggest differentiator"; the defence/walkthrough round (45-90 min) often matters more than the code | [Field Guide: take-homes](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/06-home-assignments.md) |
| AI system design: frame (5-10 min), architecture (10-15), deep dive (20-30), trade-offs (10-15), wrap-up. Recurring patterns: RAG, feedback loops, hallucination mitigation, scale and cost. Avoid agents where a workflow will do | [Field Guide: AI system design](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/04-ai-system-design.md) |
| Coding: multi-level implementation rounds (key-value store, LRU cache) and ML coding such as debugging embedding code | [Field Guide: coding](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/02-coding.md) |
| Theory is conceptual and usually a follow-up: temperature/top-p, context limits, transformers and self-attention, KV cache, tokenization, RAG failure points, agent loops and termination, eval metrics, golden sets. Fine-tuning internals only when the posting needs them | [Field Guide: theory](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/01-theory.md) |
| A 4-5 round applied-AI loop: phone screen ("200-page PDF, what happens between enter and the answer?"), take-home with a 20-question eval and recall@5, live debugging ("an agent loops forever"), system design, and a customer/product-sense round that candidates underestimate. Expect "how do you know your judge is reliable?" | [techinterview.org](https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/) |
| OWASP Top 10 for LLM Applications 2025: prompt injection, sensitive information disclosure, supply chain, data and model poisoning, improper output handling, excessive agency, system prompt leakage, vector and embedding weaknesses, misinformation, unbounded consumption | [OWASP GenAI](https://genai.owasp.org/llm-top-10/) |

### Programs

| Program | What it teaches | How it teaches | What makes graduates hireable | Outcome evidence |
| --- | --- | --- | --- | --- |
| [LLM Zoomcamp (DataTalks.Club)](https://raw.githubusercontent.com/DataTalksClub/llm-zoomcamp/main/README.md) | Agentic RAG starting from keyword search, vector search, orchestration, evaluation (offline and online), monitoring, hybrid search and reranking | ~10 weeks, homework, 3-week capstone; certificate needs the project **and three written peer reviews**; bonus points for learning in public | Capstone must have a knowledge base, retrieval, an evaluation, a UI and monitoring | Testimonials and public project lists only |
| [Hugging Face Agents Course](https://huggingface.co/learn/agents-course/unit0/introduction) | Thought-action-observation loop, chat templates, frameworks, use cases; bonus units on fine-tuning for function calling and on observability and evaluation | ~1 unit a week (3-4 h), hands-on Spaces, final agent scored on a benchmark leaderboard | A working agent with a measured score | None published |
| [Hugging Face MCP Course](https://huggingface.co/learn/mcp-course/unit0/introduction) (with Anthropic) | MCP fundamentals, an end-to-end MCP app, a deployed MCP app | Theory units plus use-case assignments; certificate for the use-case units | A shared, deployed MCP server | None published |
| [Anthropic Academy](https://anthropic.skilljar.com/) | Building with the Claude API, Intro to MCP, MCP Advanced Topics, Claude Code in Action, Claude Code 101, Introduction to agent skills, Introduction to subagents, AI Fluency | Free, self-paced, quizzes, completion certificates | Vendor-accurate API, MCP, skills and coding-agent practice | None published |
| [DeepLearning.AI](https://www.deeplearning.ai/courses/) | Agentic AI (reflection, tool use, planning, multi-agent), RAG (26 h), Pydantic for LLM workflows, guardrails, post-training (SFT, DPO, online RL), Claude Code, spec-driven development with coding agents | Short video courses with notebooks | Breadth; one professional certificate | None published |
| [AI Evals for Engineers & PMs (Parlance Labs, Maven)](https://maven.com/parlance-labs/evals) | Error analysis, evaluator design and validation, CI/CD regression tests, red-teaming, cost experiments | 8 weeks live, 6 coding assignments with walkthroughs, office hours | Evaluation, the skill postings and take-homes reward most | 4.7/5 from 1,042 reviews; 4,500+ students (self-reported); no hiring data |
| [fast.ai Practical Deep Learning](https://course.fast.ai/) | Deployment in lesson 2, neural-net foundations, a model from scratch in lesson 5 | Top-down: a working model first, then how it works | Shipped projects | Alumni anecdotes (Google Brain, OpenAI) only |
| [Full Stack Deep Learning LLM Bootcamp](https://www.fullstackdeeplearning.com/llm-bootcamp) (2023) | "Launch an LLM app in one hour" first, then foundations, prompting, augmented models, UX for language interfaces, LLMOps | Recorded lectures and a worked project | Shipping early | None; content dated |
| [AI Makerspace AI Engineering Bootcamp](https://maven.com/aimakerspace/ai-eng-bootcamp) ([milestones](https://absorbing-toaster-713.notion.site/The-AI-Engineering-Bootcamp-Certification-256cd547af3d808a9c95e8f6efb8fb5a)) | LLM and agent applications | Two builds a week, 85% required on every assignment, a certification challenge after week 5, Demo Day in week 10 | Public demo of a capstone | Startup claims, unverified |
| [Microsoft Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) | 21 lessons alternating Learn and Build, responsible AI in lesson 3, UX for AI apps, fine-tuning, open models | Videos, written lessons, code samples | Breadth for beginners | None |
| [AI Engineering (Chip Huyen, O'Reilly)](https://github.com/chiphuyen/aie-book/blob/main/ToC.md) | Two evaluation chapters **before** prompt engineering; RAG and agents; fine-tuning; dataset engineering; inference optimization; architecture and user feedback | Book | The reference most AI-engineering syllabi follow | n/a |
| [Building effective agents (Anthropic)](https://www.anthropic.com/engineering/building-effective-agents) | Workflows (chaining, routing, parallelization, orchestrator-workers, evaluator-optimizer) vs agents; start simple; design tools for the model | Engineering guide | The vocabulary interviewers use | n/a |

The common thread in the programs with the most visible graduate work (LLM Zoomcamp, AI Makerspace, the Hugging Face
courses): **a graded build every week or unit, evaluation built into the capstone, and public work** (peer review,
leaderboards, Demo Day).

## 2. The polished curriculum

Modules in the order the app now teaches them. Each module ends with a build.

| # | Module | Lessons (app ids) | Build |
| --- | --- | --- | --- |
| 0 | Before you start: Python (external course), terminal, Git, secrets, JSON, HTTP | AI from zero: `az-model`, `az-ml`, `az-llm`, `az-tokens`, `az-api`, `toolkit` | Shared with week 1 |
| 1 | Fundamentals: models, training vs inference, ML basics, metrics, neural networks, attention | `mlbasics`, `neural` | First working AI app (`firstapp`) |
| 2 | How LLMs work: tokens, context, next-token prediction, sampling, pre/post-training, hallucination, reasoning models | `foundations`, `tokenization`, `sampling` | Streaming chat assistant (`chatapp`) |
| 3 | Calling models: requests, streaming, multi-turn, errors, retries, rate limits, cost, choosing a model | `apis` | (same) |
| 4 | Prompt & context engineering | `prompting` | Measured extractor (`extracteval`) |
| 5 | Structured output: schemas, validation, retries | `structured` | (same) |
| 6 | Evals I: golden sets, graders, error analysis | `evals` | (same) |
| 7 | Embeddings & vector search: similarity, chunking, vector databases, keyword and hybrid search, reranking | `embeddings`, `vectorstores` | Document extractor (`docextract`) |
| 8 | Documents & multimodal: images, PDFs, audio | `multimodal` | (same) |
| 9 | AI coding assistants: plan, review, test | `assistants` | Used from here on |
| 10 | RAG: pipeline, citations, grounding, permissions, failure diagnosis | `rag` | RAG over your own documents (`rag`) |
| 11 | Tools & function calling | `tools` | Tool-using assistant with approvals (`agent`) |
| 12 | Agents: workflows vs agents, planning, memory, subagents, guardrails, approvals, debugging loops | `agents` | (same) |
| 13 | MCP & Skills | `mcp` | MCP server + skill, red-teamed (`mcpskill`) |
| 14 | Safety & security: injection, jailbreaks, PII, OWASP LLM Top 10, red-teaming, responsible AI | `safety` | (same) |
| 15 | Evals II & LLMOps: judges, CI gates, online evals and A/B tests; caching, latency, cost limits, observability, gateways | `evalsci`, `llmops` | Eval harness in CI (`evalharness`) |
| 16 | Models you run and adapt: local models, quantization, memory math, fine-tuning vs RAG vs prompting, LoRA, distillation, datasets | `localmodels`, `customization` | Local model behind a gateway (`localgw`) |
| 17 | Getting hired: LLM system design, coding rounds, take-homes, deep dives, customer round, STAR, portfolio | `sysdesign`, `hired` (plus the Interview page and Roles > Behavioural prep) | Deployed app (`deploy`) and portfolio rehearsal (`portfolio`) |

The 10-week plan puts 2-3 lessons and at least one build in every week. In the app's sidebar, neighbouring modules
share a heading (11 headings in all), and some builds cover two or three modules, as the table shows.

### Changes from the proposed curriculum, one line each

1. **Evals moved from #14 to #6, split into Evals I (early) and Evals II (with production).** The book most programs follow puts evaluation before prompt engineering ([Huyen ToC](https://github.com/chiphuyen/aie-book/blob/main/ToC.md)), and take-home graders call missing evaluation the biggest differentiator ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/06-home-assignments.md)).
2. **Error analysis added to Evals I** (read failures, label them, count the labels): the core of the most-reviewed evals course ([Parlance Labs](https://maven.com/parlance-labs/evals)), and evals are ~40% of real work ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/role/05-reality-vs-postings.md)).
3. **Judge calibration, CI regression gates and A/B tests added to Evals II**: "how do you know your judge is reliable?" is a standard question ([techinterview.org](https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/)); LLM Zoomcamp teaches offline and online evaluation ([README](https://raw.githubusercontent.com/DataTalksClub/llm-zoomcamp/main/README.md)).
4. **Multimodal moved from #13 to before RAG and centred on documents**: document processing is 15% of take-homes and RAG take-homes start from document upload ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/06-home-assignments.md)).
5. **AI coding assistants moved from #17 to before the first large project**: Anthropic teaches an Explore, Plan, Code, Commit workflow ([Academy](https://anthropic.skilljar.com/)) and some interviews run one round with AI tools and one without ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/01-interview-process.md)).
6. **Safety moved directly after MCP and agents**: excessive agency and improper output handling are OWASP risks that tools create ([OWASP](https://genai.owasp.org/llm-top-10/)).
7. **Local models and customization moved late and kept to one lesson each**: they are secondary duties ([AI Shipping Labs](https://aishippinglabs.com/blog/what-is-an-ai-engineer-based-on-job-descriptions)) and fine-tuning internals aren't asked by default ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/01-theory.md)).
8. **Transformers stay conceptual, plus a hands-on neuron, gradient step and attention step**: interviewers care more about building than internals ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/01-theory.md)); fast.ai builds a model from scratch only after students have shipped one ([fast.ai](https://course.fast.ai/)).
9. **Reasoning models, KV cache and post-training (SFT, RLHF, DPO) added to Module 2**: on the theory list ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/01-theory.md)) and a DeepLearning.AI course ([courses](https://www.deeplearning.ai/courses/)).
10. **Keyword search, hybrid fusion and reranking taught as code**: LLM Zoomcamp starts RAG from keyword search and ends with hybrid search and reranking ([README](https://raw.githubusercontent.com/DataTalksClub/llm-zoomcamp/main/README.md)).
11. **"Debug this" exercises in every module**: the hardest day-to-day problems are debugging ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/role/05-reality-vs-postings.md)), and live rounds ask you to fix a looping agent ([techinterview.org](https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/)).
12. **Module 0 keeps Python external and adds a developer-toolkit lesson**: LLM Zoomcamp and the Hugging Face courses list Python as a prerequisite rather than teaching it, and expect the command line ([README](https://raw.githubusercontent.com/DataTalksClub/llm-zoomcamp/main/README.md)); this repo deliberately removed its Python lessons in favour of a free course.
13. **MCP and Skills merged into one module built as code** (a JSON-RPC server and a SKILL.md you write): Hugging Face and Anthropic teach MCP through building a server ([HF MCP](https://huggingface.co/learn/mcp-course/unit0/introduction), [Academy](https://anthropic.skilljar.com/)); MCP appears in 14.1% of postings.
14. **Getting hired adds the customer/product-sense round, the take-home defence and a 5-step system design framework** ([techinterview.org](https://www.techinterview.org/post/3233476824/ai-engineer-interview-rag-agents-evals/), [Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/04-ai-system-design.md)).
15. **Every build is measured and explained: an eval step, a trade-offs README, a cost estimate, and a short walkthrough video** ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/interview/questions/06-home-assignments.md); LLM Zoomcamp's capstone requires evaluation and monitoring). The new builds include these steps; for the existing projects, whose steps are saved by position, the week-10 portfolio build adds them.
16. **8 weeks became 10, with a build every week**: LLM Zoomcamp runs ~10 weeks with a 3-week project, AI Makerspace two builds a week to a week-10 Demo Day ([milestones](https://absorbing-toaster-713.notion.site/The-AI-Engineering-Bootcamp-Certification-256cd547af3d808a9c95e8f6efb8fb5a)).
17. **Cut: framework-specific modules** (LangChain, LangGraph): no framework dominates postings ([Field Guide](https://github.com/alexeygrigorev/ai-engineering-field-guide/blob/main/role/02-skills.md)) and Anthropic advises starting with the API directly ([Building effective agents](https://www.anthropic.com/engineering/building-effective-agents)).
18. **Not duplicated here**: cloud platforms (40% of postings) belong to the sibling Cloud Prep app, data-structures coding rounds to DSA Prep, and general system design to System Design Prep.
19. **Peer review, as LLM Zoomcamp requires, can't be enforced in a static app**: the portfolio build asks learners to swap reviews using a written rubric instead.

## 3. The app before this change

| Module | Existed | Thin | Missing |
| --- | --- | --- | --- |
| 0 Before you start | `az-api` (requests, JSON, keys); Python linked externally | | Terminal, Git, `.gitignore`, env vars, HTTP headers |
| 1 Fundamentals | `az-model`, `az-ml`, `mlbasics` (splits, metrics) | Neural networks: one sentence; attention: a weighted-average exercise | Neuron, activation, gradient descent, attention scores |
| 2 How LLMs work | `az-llm`, `az-tokens`, `foundations`, `tokenization`, `sampling` | Post-training; `tokenization` had 1 interview question, `sampling` none | Reasoning models, KV cache, top-p exercise |
| 3 Calling models | `apis` (status codes, cost, turns) | 2 interview questions | Streaming exercise, backoff with retry-after, choosing a model |
| 4 Prompt & context | `prompting` | Context engineering was a glossary entry | Packing a context budget |
| 5 Structured output | `structured` (missing keys, types, parsing) | 1 interview question | Schema rules (enums, ranges), retry with the error fed back |
| 6 Evals I | `evals` (normalize, accuracy, run) | Placed late (week 6) | Error analysis |
| 7 Embeddings & search | `embeddings`, `vectorstores`; Roles `permrag` (RRF) | Hybrid search and reranking described only | Keyword scoring, fusion, reranking exercises |
| 8 Multimodal | `multimodal` (media types, image size, image blocks) | No interview questions beyond 1 | Audio, PDF batching, image token cost |
| 9 Coding assistants | Roles `aicoding` (checks only) | No exercises | Plan-review-test practice |
| 10 RAG | `rag`; Roles `permrag` | | Retrieval vs generation diagnosis, MRR, citation checks |
| 11 Tools | `tools` (spec, find calls, dispatch) | | Argument validation, parallel results |
| 12 Agents | `agents`; Roles `entagents` (approvals, retries) | | Loop detection, approval gates, orchestrator-workers, memory |
| 13 MCP & Skills | One interview question and one quiz item | | **Whole module** |
| 14 Safety | `safety` | OWASP named only in a video title | Output handling, exfiltration links, system prompt leaks, attack success rate |
| 15 Evals II & LLMOps | `llmops`; Roles `aiobs`, `cicd`, `selfhost` gateway notes | Judges only described | Judge calibration, CI gates, A/B tests, budget guards, fallbacks, rate limits |
| 16 Local & customization | `customization`; Roles `selfhost` (memory math, vLLM) | | Beginner local-model lesson (Ollama, GGUF, OpenAI-compatible endpoints, local vs cloud), LoRA maths |
| 17 Getting hired | Interview page (mocks, STAR bank); Roles `behavioral` | | System design framework, coding rounds, take-homes, deep dives, customer round |
| Builds | `firstapp`, `chatapp`, `rag`, `agent`, `evalharness`, `deploy`; Roles `knowledge`, `gateway` | | Builds for weeks 3, 4, 7, 9, 10 (MCP server + skill, local model behind a gateway) |

Across the 17 main lessons there were 52 exercises (all "write a function", none "debug this") and 31 interview
questions; 14 lessons had fewer than the 3 questions the teaching rules ask for. No lesson said why it mattered on
the job.

## 4. Changes made

Done in this order, each step verified before the next.

| Step | Change | Size |
| --- | --- | --- |
| 1 | Engine: "Why it matters on the job" opener (`why`), debug-this exercises (`debug: true`: buggy starter, its own instructions and badge), projects merged by `extendTrack` | S |
| 2 | Module 0: `toolkit` lesson (in `ai-zero.js`) and interview questions for every AI from zero lesson | M |
| 3 | Modules 1-3: `neural` lesson; post-training, reasoning models and the KV cache in `foundations`; exercises and questions for `mlbasics`, `tokenization`, `sampling`, `apis` | L |
| 4 | Modules 4-6: context engineering, schema validation and retries, error analysis; `extracteval` build | M |
| 5 | Modules 7-10: keyword, hybrid and rerank exercises; documents and audio; `assistants` lesson; RAG diagnosis and permissions; `docextract` build | L |
| 6 | Modules 11-14: tool loop and agent exercises; `mcp` lesson; OWASP Top 10, jailbreaks and output handling in `safety`; `mcpskill` build | L |
| 7 | Modules 15-17: `evalsci`, `localmodels`, `sysdesign` and `hired` lessons; LLMOps and customization exercises; `localgw` and `portfolio` builds | L |
| 8 | Layout: modules as sidebar headings, the 10-week plan, project order, short Learn addresses (`#/ai/learn/mcp`, `ollama`, `system-design`...), glossary, README | S |

| | Before | After |
| --- | --- | --- |
| Lessons (AI from zero + main) | 22 (5 + 17) | 30 (6 + 24) |
| Exercises | 72 | 159, of which 23 are Debug this |
| Interview questions | 31 | 100; every lesson has at least 3 |
| Quiz questions | 36 | 53 |
| Builds (projects) | 6 | 11, one or more every week |
| Weeks | 8 | 10 |
| Glossary terms | 62 | 115 |

**Verification.** In the app's own Python runtime (Pyodide 0.26.4, Python 3.12), all 180 exercises in the AI / LLM
and Roles tracks pass their model answers with no warnings, every starter fails its tests (so no placeholder or
unfixed bug passes by accident), and all 30 worked examples run. A structural check confirms every AI lesson has an
opener, at least 3 exercises and 3 interview questions, a sidebar heading and a week; every project is in a week;
every in-lesson link and short address resolves.

**Kept as they were, on purpose.** Exercise keys, lesson ids and project step order are unchanged, so saved
progress stays put; learners who had finished a lesson that gained exercises need to pass the new ones for it to
count as complete again. Python basics stay on an external course. The Roles lessons are unchanged apart from a
project hint that pointed at exercises that didn't exist (it now points at `replicas_needed`).
