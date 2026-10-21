// Roles lessons: only the gaps that the AI track doesn't already cover, written from
// what the collected postings ask for. Skills link to these and to existing track lessons.
// body HTML is trusted (written here). Exercise and code-sample text avoids backslashes and
// dollar-brace sequences because it lives in template literals.

const ROLES = {
  id: "roles", name: "Roles", short: "Roles",
  tagline: "Prep driven by real job postings",
  labsName: "Projects",
  tabs: [["overview", "Overview"], ["skills", "Skills"], ["postings", "Postings"], ["learn", "Learn"], ["questions", "Questions"], ["quiz", "Quiz"], ["labs", "Projects"]],
  tagLabel: "All roles",
  tagNames: { ai: "AI Engineer" },
  weeks: [], certs: [],
  aliases: { azdevops: "cicd" },
  channel: IBM_CHANNEL,
  // IBM Technology explainers (ids and titles confirmed via YouTube oEmbed).
  videos: {
    selfhost: [IBM("McLdlg5Gc9s", "What is vLLM? Efficient AI Inference for Large Language Models"), IBM("5RIOQuHOihY", "What is Ollama? Running Local LLMs Made Simple"), IBM("0ujh7hfutq0", "Llama.cpp vs vLLM: Which Local LLM Engine Actually Scales?"), IBM("qZBibWYcKH4", "How AI Models Scale Beyond a Single GPU Across LLM Workloads"), IBM("LfdK-v0SbGI", "GPUs: Explained"), IBM("XtT5i0ZeHHE", "AI Inference: The Secret to AI's Superpowers"), IBM("CNKGgOphAPM", "LLM‑D Explained: Building Next‑Gen AI with LLMs, RAG & Kubernetes"), IBM("o0gkdZBtwEg", "How KV Cache Speeds Up LLMs for Faster AI Models on GPUs")],
    entagents: [IBM("BacJ6sEhqMo", "The Four Types of Memory Every AI Agent Needs"), IBM("9iS-YYLIXiw", "What is Human In The Loop with AI? How HITL Shapes AI Systems"), IBM("cmEJ-5zYKHA", "Why AI Agents Need A Human in the Loop Now"), IBM("UMYtqHptYvA", "Guide to Architect Secure AI Agents: Best Practices for Safety")],
    permrag: [IBM("r0Dciuq0knU", "Top 3 RAG Retrieval Strategies: Sparse, Dense, & Hybrid Explained"), IBM("y7sXDpffzQQ", "What is a Knowledge Graph?"), IBM("Za7aG-ooGLQ", "GraphRAG Explained: AI Retrieval with Knowledge Graphs & Cypher")],
    aiobs: [IBM("hLvwoow3XTk", "OpenTelemetry: Simplifying Hybrid Cloud Monitoring"), IBM("jWDCnJKouhw", "Are Your AI Agents Flying Blind? The Truth About AgentOps"), IBM("iZX6d0OdZys", "What Is MLflow? Tracing AI Agents & LLM Workflows")],
    mfgdata: [IBM("2hnoGo27uf8", "What is a Digital Twin?")],
    aicoding: [IBM("mViFYTwWvcM", "Spec-Driven Development: AI Assisted Coding Explained"), IBM("4wMRXmLpdA8", "AI in the SDLC: Rethinking AI Coding Tools & AI Agents"), IBM("c57vAe-mMLo", "How AI Is Changing Code Reviews & Software Development")],
  },
  groups: [
    ["Building AI systems", ["selfhost", "entagents", "permrag", "aifrontend"]],
    ["Data & integration", ["pgvector", "integration", "mfgdata"]],
    ["Delivery & operations", ["cicd", "aiobs"]],
    ["Working style", ["aicoding", "behavioral"]],
  ],

  topics: [
    // ---------------- Building AI systems ----------------
    {
      id: "selfhost", title: "Self-hosting & serving models", yt: "vLLM serving LLMs explained",
      body: `<p>Many enterprises run some models themselves: data can't leave the network, costs are predictable at high volume, or they need a specific open-weight model. Postings call this <b>local inference</b>, <b>model serving</b> or <b>AI platform infrastructure</b>.</p>
        <h3>The serving stack</h3>
        <ul>
          <li><b>Inference servers:</b> <b>vLLM</b> and <b>SGLang</b> (high-throughput GPU serving), <b>NVIDIA Triton / NIM</b> (packaged NVIDIA serving), <b>llama.cpp / Ollama</b> (laptops, CPUs and small GPUs, great for dev). Most expose an <b>OpenAI-compatible HTTP API</b>, so app code can switch between local and cloud models.</li>
          <li><b>Why throughput tricks matter:</b> <b>continuous batching</b> adds new requests to a running batch instead of waiting, and <b>paged KV cache</b> (vLLM's PagedAttention) avoids wasting GPU memory. Together they multiply requests per GPU.</li>
          <li><b>Quantization</b> stores weights in 8 or 4 bits instead of 16, cutting memory roughly 2-4x for a small quality loss. Always re-run your evals after quantizing.</li>
          <li><b>Embedding and reranking services</b> are models too: run them as their own small services (often CPU or a small GPU) so retrieval scales separately from generation.</li></ul>
        <h3>GPU memory, roughly</h3>
        <p><b>Weights</b> = parameters x bytes per parameter (8B params at 16-bit is about 16 GB). <b>KV cache</b> = 2 (keys and values) x layers x hidden size x tokens x batch x bytes, and it grows with context length and concurrency. Models with grouped-query attention store fewer KV heads, so real numbers are often smaller; the formula gives a safe upper bound for interview math.</p>
        <h3>Model gateways</h3>
        <p>A <b>gateway</b> sits between apps and every model (local and cloud): one API, authentication, per-team quotas and budgets, routing and fallbacks (local first, cloud if overloaded), caching, and central logging. Examples: <b>LiteLLM</b> proxy, an API-management product's AI gateway policies (token limits, load balancing across deployments), or a thin service of your own.</p>
        <h3>Capacity and performance testing</h3>
        <ul>
          <li>Measure <b>time to first token (TTFT)</b>, <b>output tokens per second</b>, <b>p50/p95 latency</b> and <b>error rate</b> while stepping up concurrency, with realistic prompt and output lengths.</li>
          <li>Find the knee: the concurrency where p95 latency jumps. Capacity = the load just below it, minus headroom.</li>
          <li>Tools: k6, Locust, or the benchmark scripts that ship with vLLM.</li></ul>
        <div class="callout"><b>Local vs cloud, in one sentence:</b> local wins on data control and steady high volume; cloud wins on frontier quality, zero ops and bursty traffic. Many teams run both behind a gateway.</div>`,
      code: [{ label: "Calling a local vLLM or Ollama server with the OpenAI-compatible API", code: `# vllm serve meta-llama/Llama-3.1-8B-Instruct --port 8000
# (or: ollama serve, then use port 11434 and path /v1)
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="not-needed-locally")
resp = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Summarize this ECO in two sentences: ..."}],
    max_tokens=200,
)
print(resp.choices[0].message.content)` }],
      exercises: [{
        key: "weights", prompt: "Write weights_gb(params_billion, bits) returning the GPU memory the model weights alone need, in GB: params × bits / 8 bytes, with params in billions so the answer comes out in GB directly.",
        example: "weights_gb(8, 16) returns 16.0\nweights_gb(70, 4) returns 35.0",
        hint: "Each parameter takes bits / 8 bytes, and a billion bytes is a GB, so `params_billion * bits / 8`.",
        starter: `def weights_gb(params_billion, bits):
    pass
`,
        tests: `assert weights_gb(8, 16) == 16, f"8B params at 16 bits is 16 GB, got {weights_gb(8, 16)}"
assert weights_gb(70, 4) == 35, "4-bit quantization: 70B params in 35 GB"
assert weights_gb(1, 8) == 1`,
        solution: `def weights_gb(params_billion, bits):
    return params_billion * bits / 8`,
      }, {
        key: "backend", prompt: "A model gateway routes each request. Write choose_backend(sensitive, local_up): sensitive data must stay on the local model, so return \"local\" if it's up and \"reject\" if not. Other requests prefer \"local\" when it's up and fall back to \"cloud\".",
        example: `choose_backend(True, False) returns "reject"\nchoose_backend(False, False) returns "cloud"`,
        hint: "Handle sensitive first: `if sensitive: return \"local\" if local_up else \"reject\"`. Then the same shape with \"cloud\".",
        starter: `def choose_backend(sensitive, local_up):
    pass
`,
        tests: `assert choose_backend(True, True) == "local"
assert choose_backend(True, False) == "reject", "sensitive data never goes to the cloud fallback"
assert choose_backend(False, True) == "local"
assert choose_backend(False, False) == "cloud"`,
        solution: `def choose_backend(sensitive, local_up):
    if local_up:
        return "local"
    return "reject" if sensitive else "cloud"`,
      }, {
        key: "gpumem", prompt: "Implement gpu_memory_gb(params_billion, bits, layers, hidden, context_tokens, batch=1, kv_bits=16). Weights take params × bits/8 bytes; the KV cache takes 2 × layers × hidden × context_tokens × batch × kv_bits/8 bytes (assume no grouped-query attention). Return the total in GB (1e9 bytes), rounded to 1 decimal.",
        example: "gpu_memory_gb(8, 16, 32, 4096, 8192) returns 20.3\n(16 GB of weights + about 4.3 GB of KV cache)",
        hint: "Work in bytes: weights = `params_billion * 1e9 * bits / 8`, kv = `2 * layers * hidden * context_tokens * batch * kv_bits / 8`. Return `round((weights + kv) / 1e9, 1)`.",
        starter: `def gpu_memory_gb(params_billion, bits, layers, hidden, context_tokens, batch=1, kv_bits=16):
    pass
`,
        tests: `assert gpu_memory_gb(8, 16, 32, 4096, 0) == 16.0, "weights only: 8B params at 16 bits is 16 GB"
assert gpu_memory_gb(8, 16, 32, 4096, 8192) == 20.3
assert gpu_memory_gb(8, 4, 32, 4096, 8192) == 8.3, "4-bit weights shrink only the weights"
assert gpu_memory_gb(8, 4, 32, 4096, 8192, batch=4) == 21.2, "KV cache grows with batch size"`,
        solution: `def gpu_memory_gb(params_billion, bits, layers, hidden, context_tokens, batch=1, kv_bits=16):
    weights = params_billion * 1e9 * bits / 8
    kv = 2 * layers * hidden * context_tokens * batch * kv_bits / 8
    return round((weights + kv) / 1e9, 1)`,
      }],
      cards: [
        ["Why do most self-hosted inference servers expose an OpenAI-compatible API?", "So application code, SDKs and gateways can switch between local and cloud models by changing a base URL and model name, not rewriting integrations."],
        ["What is continuous batching?", "The server adds new requests to the in-flight batch as soon as slots free up instead of waiting for a whole batch to finish, keeping the GPU busy and raising throughput."],
        ["Your 8B model fits on the GPU, but it runs out of memory under load. Why?", "The KV cache grows with context length and concurrent requests. Cap max context and concurrency, use a quantized KV cache or a paged cache, or add GPUs/replicas."],
        ["What does a model gateway give an enterprise?", "One API for all models, central auth and audit logging, per-team quotas and budgets, routing and fallbacks between local and cloud models, and caching."],
      ],
    },
    {
      id: "entagents", title: "Production agents: memory, approvals & failure handling", yt: "AI agents human in the loop production patterns",
      body: `<p>A demo agent calls tools in a loop. A production agent that touches ERP, PLM or file shares needs <b>state, limits, approvals, recovery and an audit trail</b>. This is where postings separate "has built a chatbot" from "can ship agents".</p>
        <h3>Structure first</h3>
        <ul>
          <li><b>Prefer workflows over free-roaming agents</b> when the steps are known: a fixed graph (classify, retrieve, draft, review) is easier to test. Use an open-ended agent loop only where the path genuinely varies.</li>
          <li><b>Frameworks</b> (LangGraph, Semantic Kernel, the OpenAI / Claude Agent SDKs, AutoGen) give you state graphs, checkpoints and tool plumbing. Know one, and know what it does under the hood: it's still a loop of model calls and tool calls.</li>
          <li><b>Step and cost budgets:</b> cap iterations, tool calls, tokens and wall-clock time per task. Stop with a clear message instead of looping forever.</li></ul>
        <h3>Memory</h3>
        <ul>
          <li><b>Working memory:</b> the current conversation and scratchpad, trimmed or summarized to fit the context window.</li>
          <li><b>Long-term memory:</b> facts and preferences stored outside the model (a database or vector store) and retrieved when relevant. Scope it per user or project, and let users see and delete it.</li>
          <li><b>Checkpoints:</b> persist agent state after each step so a crash or an approval wait can resume instead of starting over.</li></ul>
        <h3>Tools that act safely</h3>
        <ul>
          <li><b>Least privilege:</b> each tool gets its own narrowly scoped credentials, and calls run <b>as the user</b> (on-behalf-of) where possible, so the agent can never see or do more than the person could.</li>
          <li><b>Read vs write:</b> reads can run automatically; writes (create a work order, update a BOM, send an email) go through a <b>human approval step</b> showing exactly what will change. Offer <b>dry-run</b> previews.</li>
          <li><b>Validate arguments</b> against a schema and an allow-list before executing; tool arguments are model output and may be wrong or injected.</li>
          <li><b>Idempotency keys</b> on writes so a retry never creates two work orders.</li></ul>
        <h3>When things fail</h3>
        <ul>
          <li><b>Transient errors</b> (timeouts, 429, 503): retry with exponential backoff and jitter. <b>Permanent errors</b> (400, validation): don't retry; return the error to the model or the user.</li>
          <li><b>Circuit breakers</b> stop calling a dependency that keeps failing, so one broken system doesn't stall every task.</li>
          <li><b>Graceful degradation:</b> fall back to a smaller model, a cached answer, or "I couldn't reach PLM; here's what I found elsewhere".</li>
          <li><b>Audit log</b> every step: who asked, what the model proposed, who approved, what executed, and the result.</li></ul>`,
      exercises: [{
          key: "describe", prompt: "An approval screen must show exactly what an agent wants to do. Write describe_change(call) for call = {\"tool\": name, \"args\": {...}} returning \"name(key=value, ...)\" with the arguments sorted by key.",
          example: `describe_change({"tool": "create_work_order", "args": {"qty": 5, "part_number": "A-1"}})\nreturns "create_work_order(part_number=A-1, qty=5)"`,
          hint: "Build a list of `key + \"=\" + str(value)` for each key in `sorted(call[\"args\"])`, then join it with `\", \"` inside the brackets.",
          starter: `def describe_change(call):
    pass
`,
          tests: `assert describe_change({"tool": "create_work_order", "args": {"qty": 5, "part_number": "A-1"}}) == "create_work_order(part_number=A-1, qty=5)"
assert describe_change({"tool": "ping", "args": {}}) == "ping()"`,
          solution: `def describe_change(call):
    parts = [key + "=" + str(call["args"][key]) for key in sorted(call["args"])]
    return call["tool"] + "(" + ", ".join(parts) + ")"`,
        },
        {
          key: "retry", prompt: "Implement call_with_retry(fn, max_attempts=3, base_delay=0.5, sleep=time.sleep). Call fn(); if it raises TransientError, sleep base_delay × 2^attempt and try again, up to max_attempts calls in total. Re-raise after the last attempt (without sleeping). Any other exception must propagate immediately with no retry.",
          example: "A function that fails twice with TransientError and then succeeds: the delays are [0.5, 1.0] and the result comes back.",
          hint: "`for attempt in range(max_attempts):` call fn inside `try:` and return its result. In `except TransientError:`, re-raise with a bare `raise` if this was the last attempt, otherwise `sleep(base_delay * 2 ** attempt)`. Other exceptions aren't caught, so they propagate by themselves.",
          starter: `import time

class TransientError(Exception):
    pass

def call_with_retry(fn, max_attempts=3, base_delay=0.5, sleep=time.sleep):
    pass
`,
          tests: `delays = []
calls = {"n": 0}
def flaky():
    calls["n"] += 1
    if calls["n"] < 3:
        raise TransientError("503")
    return "ok"
assert call_with_retry(flaky, sleep=delays.append) == "ok"
assert delays == [0.5, 1.0], "back off 0.5s then 1.0s"
delays.clear()
def always_down():
    raise TransientError("timeout")
try:
    call_with_retry(always_down, max_attempts=4, base_delay=1, sleep=delays.append)
    assert False, "should re-raise after the last attempt"
except TransientError:
    pass
assert delays == [1, 2, 4], "no sleep after the final attempt"
delays.clear()
def bad_request():
    raise ValueError("invalid part number")
try:
    call_with_retry(bad_request, sleep=delays.append)
    assert False, "non-transient errors must not be retried"
except ValueError:
    pass
assert delays == []`,
          solution: `import time

class TransientError(Exception):
    pass

def call_with_retry(fn, max_attempts=3, base_delay=0.5, sleep=time.sleep):
    for attempt in range(max_attempts):
        try:
            return fn()
        except TransientError:
            if attempt == max_attempts - 1:
                raise
            sleep(base_delay * 2 ** attempt)`,
        },
        {
          key: "review", prompt: "Implement review_action(call, policy) as the gate before an agent's tool call runs. call is {\"tool\": name, \"args\": {...}}; policy maps tool name to {\"mode\": \"auto\" or \"approve\", \"args\": [allowed arg names]}. Return \"deny\" for unknown tools or if the argument names differ from the policy in any way (missing or extra); otherwise \"allow\" for auto tools and \"needs_approval\" for approve tools.",
          example: `review_action({"tool": "search_docs", "args": {"query": "servo"}}, POLICY) returns "allow"\nreview_action({"tool": "delete_project", "args": {"id": 7}}, POLICY) returns "deny"`,
          hint: "Look the tool up in policy (deny if missing). Compare the argument names as sets: `set(call[\"args\"]) != set(rule[\"args\"])` means deny. Then map the mode to the answer.",
          starter: `def review_action(call, policy):
    pass
`,
          tests: `POLICY = {
    "search_docs": {"mode": "auto", "args": ["query"]},
    "get_bom": {"mode": "auto", "args": ["part_number"]},
    "create_work_order": {"mode": "approve", "args": ["part_number", "qty"]},
}
assert review_action({"tool": "search_docs", "args": {"query": "servo spec"}}, POLICY) == "allow"
assert review_action({"tool": "create_work_order", "args": {"part_number": "A-1", "qty": 5}}, POLICY) == "needs_approval"
assert review_action({"tool": "delete_project", "args": {"id": 7}}, POLICY) == "deny", "unknown tools are denied"
assert review_action({"tool": "get_bom", "args": {}}, POLICY) == "deny", "missing argument"
assert review_action({"tool": "get_bom", "args": {"part_number": "A-1", "sql": "DROP TABLE"}}, POLICY) == "deny", "unexpected argument"`,
          solution: `def review_action(call, policy):
    rule = policy.get(call["tool"])
    if rule is None or set(call["args"]) != set(rule["args"]):
        return "deny"
    return "allow" if rule["mode"] == "auto" else "needs_approval"`,
        },
      ],
      cards: [
        ["When would you use a fixed workflow instead of an autonomous agent?", "When the steps are known in advance. Workflows are predictable, cheaper and testable step by step; keep open-ended agent loops for tasks whose path genuinely varies."],
        ["How do you stop an agent from creating duplicate records when it retries?", "Send an idempotency key with each write (derived from the task and step), so the target system treats a repeated call as the same operation."],
        ["Which tool calls should need human approval?", "Anything that writes, spends, sends or deletes, or is hard to reverse. Show the exact proposed change, let the user edit or reject it, and log the decision."],
        ["What should an agent audit log contain?", "The requesting user, the input, each model proposal, tool calls with arguments and results, approvals (who and when), final output, model and prompt versions, and timing and cost."],
      ],
    },
    {
      id: "permrag", title: "Permission-aware retrieval & reranking", yt: "RAG document level security access control",
      body: `<p>Basic RAG (in the AI track) answers from a pile of documents. <b>Enterprise search</b> must also answer: <b>is this person allowed to see this chunk?</b> Getting this wrong leaks HR files, customer contracts or export-controlled drawings through a helpful summary.</p>
        <h3>Security trimming</h3>
        <ul>
          <li><b>Capture ACLs at ingest:</b> store who can read each document (users, groups, project membership) as metadata on every chunk.</li>
          <li><b>Filter at query time</b> using the caller's identity (e.g. the groups in their identity provider's token). <b>Pre-filtering</b> (filter inside the search) is safest; <b>post-filtering</b> top-k results can leave you with too few results, so over-fetch or use engines that filter during the index scan.</li>
          <li><b>Default deny:</b> a chunk with missing or unknown ACLs is not returned.</li>
          <li><b>Keep ACLs in sync:</b> permission changes and deletions in the source system must reach the index quickly. Stale ACLs are a security bug, not a freshness bug.</li>
          <li><b>Never rely on the prompt</b> ("don't reveal HR data") for access control. The model can only leak what you put in its context.</li></ul>
        <h3>Hybrid retrieval and fusion</h3>
        <p>Engineering content is full of part numbers, error codes and drawing IDs that keyword search (BM25) finds and embeddings miss. Run both and fuse with <b>reciprocal rank fusion (RRF)</b>: score = sum over lists of 1 / (k + rank), with k around 60. It needs no score normalization.</p>
        <h3>Reranking</h3>
        <ul>
          <li>Retrieve a generous candidate set (say 50) cheaply, then a <b>cross-encoder reranker</b> reads query and chunk together and reorders them; keep the top 5-10 for the prompt.</li>
          <li>Rerankers are slower per item but much more accurate. Measure recall@k and answer quality with and without one before you pay for it.</li></ul>
        <h3>Beyond chunks</h3>
        <p><b>Knowledge graphs</b> (parts, assemblies, projects, customers and their relationships) answer structural questions vector search can't, like "which active projects use this servo?". Many teams combine a graph or SQL lookup with text retrieval.</p>`,
      exercises: [{
        key: "can-read", prompt: "Write can_read(doc_groups, user_groups): return True if the user shares at least one group with the document. A document with no groups is readable by nobody (default deny).",
        example: `can_read({"eng", "sales"}, ["eng"]) returns True\ncan_read(set(), ["eng"]) returns False`,
        hint: "Loop over user_groups and return True as soon as one is `in doc_groups`; return False after the loop. (Or use set intersection: `bool(set(doc_groups) & set(user_groups))`.)",
        starter: `def can_read(doc_groups, user_groups):
    pass
`,
        tests: `assert can_read({"eng", "sales"}, ["eng"]) is True
assert can_read({"hr"}, ["eng", "sales"]) is False
assert can_read(set(), ["eng"]) is False, "no groups means no access"
assert can_read({"eng"}, []) is False`,
        solution: `def can_read(doc_groups, user_groups):
    for g in user_groups:
        if g in doc_groups:
            return True
    return False`,
      }, {
        key: "rrf", prompt: "Reciprocal rank fusion scores a document by its positions in several ranked lists. Write rrf_score(ranks, k=60): ranks is the list of positions (starting at 1) where the document appears; return the sum of 1 / (k + rank).",
        example: "rrf_score([1, 3]) returns 1/61 + 1/63, about 0.0323\nrrf_score([]) returns 0",
        hint: "A running total: `total += 1 / (k + r)` for each rank r.",
        starter: `def rrf_score(ranks, k=60):
    pass
`,
        tests: `assert abs(rrf_score([1, 3]) - (1 / 61 + 1 / 63)) < 1e-12
assert rrf_score([]) == 0
assert rrf_score([1], k=0) == 1.0
assert rrf_score([1]) > rrf_score([2]), "a better position scores higher"`,
        solution: `def rrf_score(ranks, k=60):
    total = 0
    for r in ranks:
        total += 1 / (k + r)
    return total`,
      }, {
        key: "secure", prompt: "Implement secure_hybrid(keyword, vector, acl, groups, top_k=3, k=60). keyword and vector are ranked lists of doc ids. acl maps doc id to the set of groups allowed to read it (docs missing from acl are denied). First drop docs the user can't read (user's groups intersect the doc's groups), then fuse the remaining rankings with RRF (rank starts at 1 within each filtered list) and return the top_k ids by score, ties broken by id.",
        example: `With an HR-only document ranked first by keyword search, a user in "eng" never sees it:\nsecure_hybrid(kw, vec, ACL, ["eng"]) returns ["d2", "d1", "d4"]`,
        hint: "Filter each list first with your can_read logic (`acl.get(d, set())`). Then for each filtered list, `for rank, d in enumerate(lst, 1): scores[d] = scores.get(d, 0) + 1 / (k + rank)`. Sort by `(-score, id)` and take the first top_k.",
        starter: `def secure_hybrid(keyword, vector, acl, groups, top_k=3, k=60):
    pass
`,
        tests: `ACL = {"d1": {"eng"}, "d2": {"eng", "sales"}, "d3": {"hr"}, "d4": {"eng"}, "d5": {"sales"}}
kw = ["d3", "d1", "d2", "d9"]
vec = ["d2", "d3", "d4", "d1"]
assert secure_hybrid(kw, vec, ACL, ["eng"]) == ["d2", "d1", "d4"]
assert "d3" not in secure_hybrid(kw, vec, ACL, ["eng", "sales"], top_k=5), "HR-only doc must never leak"
assert "d9" not in secure_hybrid(kw, vec, ACL, ["eng"], top_k=5), "docs with no ACL are denied by default"
assert secure_hybrid(kw, vec, ACL, ["hr"]) == ["d3"]
assert secure_hybrid(["d5"], [], ACL, ["sales"]) == ["d5"]`,
        solution: `def secure_hybrid(keyword, vector, acl, groups, top_k=3, k=60):
    allowed = lambda d: bool(acl.get(d, set()) & set(groups))
    scores = {}
    for ranked in (keyword, vector):
        kept = [d for d in ranked if allowed(d)]
        for rank, d in enumerate(kept, 1):
            scores[d] = scores.get(d, 0) + 1 / (k + rank)
    ordered = sorted(scores, key=lambda d: (-scores[d], d))
    return ordered[:top_k]`,
      }],
      cards: [
        ["Why not just tell the model 'don't reveal confidential documents'?", "Prompts aren't access control: injection or simple mistakes bypass them. Filter by the user's permissions before anything reaches the context window."],
        ["Pre-filtering vs post-filtering in vector search?", "Pre-filtering restricts the search to allowed chunks, so you always get k permitted results. Post-filtering searches everything and drops disallowed hits, which can leave too few results unless you over-fetch."],
        ["Why use reciprocal rank fusion?", "Keyword and vector scores are on different scales. RRF combines rankings only by position, so it's simple and robust without normalization."],
        ["What does a cross-encoder reranker do differently from an embedding search?", "It reads the query and each candidate together and scores relevance directly, which is more accurate but too slow for the whole corpus, so it's used on a shortlist."],
      ],
    },
    {
      id: "aifrontend", title: "AI frontends & backends: React, TypeScript, APIs", yt: "streaming LLM responses React server sent events",
      body: `<p>Postings for AI engineers often require <b>React + TypeScript</b> and a backend in <b>Python plus .NET/C# or Node.js</b>. The AI-specific part is mostly about streaming, citations, progress and trust.</p>
        <h3>UI patterns that make AI usable</h3>
        <ul>
          <li><b>Stream responses</b> token by token (Server-Sent Events or a streamed fetch). Show a stop button wired to an <code>AbortController</code>.</li>
          <li><b>Citations:</b> render sources as clickable chips that open the document at the cited page or section, so engineers can verify instead of trusting.</li>
          <li><b>Show progress for agents:</b> "Searching PDM...", "Reading 3 drawings...", "Drafting". Long silent waits feel broken.</li>
          <li><b>Approval UI</b> for agent actions: a clear diff or summary of what will change, with Approve / Edit / Reject.</li>
          <li><b>Feedback:</b> thumbs up/down with an optional reason, stored with the trace ID so it can feed your evals.</li>
          <li><b>Honest states:</b> distinct UI for "no relevant documents found", "you don't have access", and errors.</li></ul>
        <h3>Typed contracts end to end</h3>
        <ul>
          <li>Define request and response schemas once (Pydantic in FastAPI, or an OpenAPI spec) and <b>generate TypeScript types</b> for the frontend, so a backend change breaks the build, not production.</li>
          <li>Validate untrusted data at the edge with Zod (TypeScript) or Pydantic (Python).</li></ul>
        <h3>Backends</h3>
        <ul>
          <li><b>Python (FastAPI):</b> where AI libraries live; <code>StreamingResponse</code> for SSE; background workers (Celery, RQ, or a queue consumer) for ingestion.</li>
          <li><b>.NET / C#:</b> ASP.NET Core minimal APIs, strong Entra ID integration (Microsoft.Identity.Web), Semantic Kernel for AI; common in Microsoft-heavy enterprises.</li>
          <li><b>Node.js:</b> Express or Fastify, natural for SSE and a TypeScript-everywhere team.</li>
          <li>Production basics in any stack: authentication and authorization, input validation, structured error responses, structured logging with correlation IDs, configuration from environment and secrets stores, health endpoints.</li></ul>`,
      code: [
        { label: "FastAPI: stream model output as Server-Sent Events", code: `from fastapi import FastAPI
from fastapi.responses import StreamingResponse
import anthropic

app = FastAPI()
client = anthropic.Anthropic()

@app.get("/ask")
def ask(q: str):
    def events():
        with client.messages.stream(model="claude-opus-5-5", max_tokens=800,
                                    messages=[{"role": "user", "content": q}]) as stream:
            for text in stream.text_stream:
                yield "data: " + text.replace(chr(10), " ") + chr(10) + chr(10)
        yield "data: [DONE]" + chr(10) + chr(10)
    return StreamingResponse(events(), media_type="text/event-stream")` },
        { label: "React + TypeScript: consume the stream with a stop button", code: `import { useRef, useState } from "react";

export function Ask() {
  const [answer, setAnswer] = useState("");
  const controller = useRef<AbortController | null>(null);

  async function ask(q: string) {
    controller.current = new AbortController();
    setAnswer("");
    const res = await fetch("/ask?q=" + encodeURIComponent(q), { signal: controller.current.signal });
    const reader = res.body!.pipeThrough(new TextDecoderStream()).getReader();
    let buffer = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buffer += value;
      const events = buffer.split("\\n\\n");   // blank line ends an event
      buffer = events.pop() ?? "";
      for (const e of events) {
        const data = e.replace(/^data: ?/, "");
        if (data === "[DONE]") return;
        setAnswer((a) => a + data);
      }
    }
  }

  return (
    <div>
      <button onClick={() => ask("What torque spec does the gripper use?")}>Ask</button>
      <button onClick={() => controller.current?.abort()}>Stop</button>
      <p>{answer}</p>
    </div>
  );
}` },
      ],
      exercises: [{
        key: "sse-event", prompt: "Server-Sent Events send each message as a line starting with \"data: \" followed by a blank line. Write sse_event(data) that formats one event: \"data: \" + data + two new lines. NL = chr(10) is provided.",
        example: `sse_event("Hello") returns "data: Hello" + NL + NL`,
        hint: "Concatenate the three parts: `\"data: \" + data + NL + NL`.",
        starter: `NL = chr(10)

def sse_event(data):
    pass
`,
        tests: `assert sse_event("Hello") == "data: Hello" + NL + NL, repr(sse_event("Hello"))
assert sse_event("[DONE]").startswith("data: [DONE]")`,
        solution: `NL = chr(10)

def sse_event(data):
    return "data: " + data + NL + NL`,
      }, {
        key: "error-body", prompt: "APIs should return structured errors the frontend can show honestly. Write error_response(status, message, trace_id) returning {\"error\": {\"status\": status, \"message\": message, \"trace_id\": trace_id}}. status must be an HTTP error code from 400 to 599; raise ValueError otherwise.",
        example: `error_response(403, "No access to this document", "t-42") returns\n{"error": {"status": 403, "message": "No access to this document", "trace_id": "t-42"}}`,
        hint: "Check `400 <= status <= 599` first and raise if not; then return the nested dict.",
        starter: `def error_response(status, message, trace_id):
    pass
`,
        tests: `assert error_response(403, "No access to this document", "t-42") == {"error": {"status": 403, "message": "No access to this document", "trace_id": "t-42"}}
for bad in [200, 302, 600]:
    try:
        error_response(bad, "x", "t"); raise SystemExit("expected ValueError for " + str(bad))
    except ValueError:
        pass`,
        solution: `def error_response(status, message, trace_id):
    if not 400 <= status <= 599:
        raise ValueError("not an error status: " + str(status))
    return {"error": {"status": status, "message": message, "trace_id": trace_id}}`,
      }, {
        key: "sse", prompt: "Implement parse_sse(chunks): chunks is a list of strings as they arrive from the network (an event can be split anywhere). Events end with a blank line (two newlines). Collect lines starting with \"data:\" (drop the prefix and one optional space); join multiple data lines with a newline. Skip events with no data lines (e.g. \": keep-alive\" comments). Stop at the payload [DONE]. Return the list of payloads; ignore an incomplete trailing event. NL = chr(10) is provided.",
        example: `parse_sse(["data: Hel" + NL + NL + "data: lo" + NL + NL + "data: [DONE]" + NL + NL]) returns ["Hel", "lo"]`,
        hint: "Join all chunks into one buffer first, then split it on NL + NL: every piece except the last is a complete event. For each event, collect the data lines (`line[5:]`, dropping one leading space), skip events with none, and stop at [DONE].",
        starter: `NL = chr(10)

def parse_sse(chunks):
    pass
`,
        tests: `stream = "data: Hel" + NL + NL + "data: lo" + NL + NL + ": keep-alive" + NL + NL + "data: [DONE]" + NL + NL + "data: ignored" + NL + NL
assert parse_sse([stream]) == ["Hel", "lo"]
pieces = [stream[i:i + 3] for i in range(0, len(stream), 3)]
assert parse_sse(pieces) == ["Hel", "lo"], "events can be split across chunks"
assert parse_sse(["data: a" + NL + "data: b" + NL + NL]) == ["a" + NL + "b"], "multi-line data joins with newlines"
assert parse_sse(["data: partial"]) == [], "incomplete events wait for more data"`,
        solution: `NL = chr(10)

def parse_sse(chunks):
    events = "".join(chunks).split(NL + NL)[:-1]   # the last piece is incomplete (or empty)
    payloads = []
    for event in events:
        data = []
        for line in event.split(NL):
            if line.startswith("data:"):
                value = line[5:]
                data.append(value[1:] if value.startswith(" ") else value)
        if not data:
            continue
        payload = NL.join(data)
        if payload == "[DONE]":
            break
        payloads.append(payload)
    return payloads`,
      }],
      cards: [
        ["Why stream LLM responses to the browser?", "Users see output within a second instead of waiting for the whole answer, and they can stop a bad answer early, saving tokens."],
        ["How do you keep frontend and backend types in sync?", "Define schemas once (Pydantic models or an OpenAPI spec) and generate TypeScript types or a client from them, so mismatches fail at build time."],
        ["What makes an AI answer trustworthy to an engineer?", "Clickable citations to the exact source, clear 'not found' or 'no access' states instead of guesses, and a quick way to give feedback."],
      ],
    },

    // ---------------- Data & integration ----------------
    {
      id: "pgvector", title: "PostgreSQL, pgvector & safe migrations", yt: "pgvector PostgreSQL vector search tutorial",
      body: `<p>Many teams keep vectors <b>next to their relational data</b> in PostgreSQL with the <b>pgvector</b> extension: one database, transactions, joins, row-level permissions and familiar backups. Postings also ask for <b>strong SQL</b> and <b>safe work with production databases</b>, which is mostly about migrations.</p>
        <h3>pgvector essentials</h3>
        <ul>
          <li><code>CREATE EXTENSION vector;</code> then a column like <code>embedding vector(1024)</code> sized to your embedding model.</li>
          <li>Distance operators: <code>&lt;=&gt;</code> cosine distance, <code>&lt;-&gt;</code> L2, <code>&lt;#&gt;</code> negative inner product. Order by distance and <code>LIMIT k</code>.</li>
          <li><b>Indexes:</b> <b>HNSW</b> (better recall/speed, slower to build, more memory) or <b>IVFFlat</b> (faster to build, needs training data). Match the operator class to the distance, e.g. <code>vector_cosine_ops</code>.</li>
          <li><b>Filtering:</b> combine <code>WHERE</code> clauses (project, ACL group, document type) with the vector order. Approximate indexes can return fewer than k rows after filtering; newer pgvector versions support iterative index scans to keep searching.</li>
          <li><b>Hybrid search in one database:</b> a <code>tsvector</code> column with a GIN index for full-text, fused with vector results.</li></ul>
        <h3>SQL skills interviewers check</h3>
        <ul>
          <li>Joins, aggregates, window functions, CTEs; reading <code>EXPLAIN ANALYZE</code>; choosing indexes for real query patterns.</li>
          <li>Schema design: keys, constraints, normalization vs pragmatic denormalization, soft deletes and audit columns.</li>
          <li>MySQL vs PostgreSQL: both are common; know that PostgreSQL has richer types (JSONB, arrays, vectors) and MySQL schema changes often use online DDL or tools like gh-ost.</li></ul>
        <h3>Changing a production database safely</h3>
        <ul>
          <li><b>Expand, migrate, contract:</b> add the new column or table (backward compatible), deploy code that writes both, backfill in small batches, switch reads, and only then drop the old structure in a later release.</li>
          <li><b>Avoid long locks:</b> <code>CREATE INDEX CONCURRENTLY</code> in PostgreSQL; set a <code>lock_timeout</code>; never rewrite a big table in one transaction at peak time.</li>
          <li><b>Versioned migrations</b> in source control (Alembic, Flyway, EF Core migrations, Prisma), reviewed in PRs and run by the pipeline, not by hand.</li>
          <li>Test on a production-sized copy, take a backup or snapshot first, and have a rollback plan.</li></ul>`,
      code: [{ label: "pgvector: schema, index and a filtered hybrid query", code: `CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE chunks (
  id          bigserial PRIMARY KEY,
  doc_id      text NOT NULL,
  project     text NOT NULL,
  acl_groups  text[] NOT NULL,
  content     text NOT NULL,
  content_tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
  embedding   vector(1024) NOT NULL
);
CREATE INDEX CONCURRENTLY chunks_embedding_hnsw ON chunks USING hnsw (embedding vector_cosine_ops);
CREATE INDEX CONCURRENTLY chunks_tsv ON chunks USING gin (content_tsv);

-- :query_embedding, :query_text and :user_groups are bind parameters
WITH vec AS (
  SELECT id, row_number() OVER (ORDER BY embedding <=> :query_embedding) AS r
  FROM chunks WHERE acl_groups && :user_groups
  ORDER BY embedding <=> :query_embedding LIMIT 50
), kw AS (
  SELECT id, row_number() OVER (ORDER BY ts_rank(content_tsv, q) DESC) AS r
  FROM chunks, websearch_to_tsquery('english', :query_text) q
  WHERE content_tsv @@ q AND acl_groups && :user_groups
  ORDER BY ts_rank(content_tsv, q) DESC LIMIT 50
)
SELECT id, SUM(1.0 / (60 + r)) AS rrf
FROM (SELECT * FROM vec UNION ALL SELECT * FROM kw) both_lists
GROUP BY id ORDER BY rrf DESC LIMIT 10;` }],
      cards: [
        ["Why keep embeddings in PostgreSQL instead of a separate vector database?", "One system to run and secure, transactional consistency with the source rows, SQL joins and filters (projects, permissions), and existing backups. A dedicated vector DB can win at very large scale."],
        ["HNSW vs IVFFlat?", "HNSW: better speed/recall trade-off and no training step, but slower to build and uses more memory. IVFFlat: quicker to build and smaller, needs representative data to build lists, and recall depends on how many lists you probe."],
        ["How do you rename a heavily used column with no downtime?", "Expand and contract: add the new column, write to both, backfill in batches, switch reads, then drop the old column in a later release."],
        ["Why CREATE INDEX CONCURRENTLY?", "A normal index build blocks writes to the table until it finishes; the concurrent build avoids that (it's slower and can't run inside a transaction)."],
      ],
    },
    {
      id: "integration", title: "Enterprise integration: REST, SOAP, GraphQL, events & files", yt: "enterprise integration patterns REST SOAP GraphQL event driven",
      body: `<p>AI is only as useful as the systems it can reach. Enterprise integration means dealing with <b>different protocols, data models, owners and failure modes</b>, often around applications that are decades old.</p>
        <h3>Interface styles</h3>
        <ul>
          <li><b>REST + JSON:</b> the default. Know pagination, filtering, versioning, rate limits (429 plus Retry-After), ETags and idempotent methods.</li>
          <li><b>SOAP:</b> XML envelopes described by a <b>WSDL</b>, often with WS-Security. Still common in ERP and older enterprise systems. Generate clients rather than hand-writing XML: <code>zeep</code> in Python, <code>dotnet-svcutil</code> in .NET.</li>
          <li><b>GraphQL:</b> one endpoint with a typed schema; clients ask for exactly the fields they need. Watch for the N+1 query problem (batch with DataLoader) and expensive queries (depth and cost limits).</li>
          <li><b>Events and messaging:</b> Service Bus, Event Grid, Kafka, RabbitMQ. Delivery is usually at-least-once, so <b>consumers must be idempotent</b>. Use the <b>outbox pattern</b> so a database change and its event can't get out of sync.</li>
          <li><b>File-based:</b> CSV/XML drops on SFTP or a share, nightly exports. Validate, quarantine bad files, and track what has been processed.</li></ul>
        <h3>Keeping an AI index in sync</h3>
        <ul>
          <li><b>Incremental sync:</b> store a <b>watermark</b> (last modified timestamp or change token) and fetch only newer records; use change data capture (CDC) or webhooks where the source supports them.</li>
          <li><b>Version checks:</b> never let an older record overwrite a newer one when messages arrive out of order.</li>
          <li><b>Deletes and permission changes</b> must flow through too, or the assistant keeps citing documents that no longer exist or that the user lost access to.</li>
          <li><b>Contextualize</b> while indexing: attach project, part number, revision, lifecycle state and owner, so retrieval can filter and answers can cite precisely.</li></ul>
        <h3>Across ownership boundaries</h3>
        <ul>
          <li><b>Identity mapping:</b> the same part or customer has different IDs in PLM, ERP and MES; keep an explicit mapping and say which system is the source of truth for each field.</li>
          <li><b>Data contracts:</b> agree on schemas and change notice with each system owner; validate incoming data and alert on drift.</li>
          <li><b>Protect the source:</b> respect rate limits, run heavy reads off-peak or from replicas, and never write to a system of record without its owner agreeing to the path.</li></ul>`,
      exercises: [{
        key: "map-ids", prompt: "The same part has different IDs in PLM and ERP. Write to_erp_ids(plm_ids, mapping) that returns (mapped, missing): mapped is the list of ERP IDs for the PLM IDs found in mapping (in order), missing is the list of PLM IDs with no mapping.",
        example: `to_erp_ids(["P-1", "P-9"], {"P-1": "E-100"}) returns (["E-100"], ["P-9"])`,
        hint: "Two lists, one loop: `if pid in mapping:` append `mapping[pid]` to mapped, else append pid to missing. Return both.",
        starter: `def to_erp_ids(plm_ids, mapping):
    pass
`,
        tests: `assert to_erp_ids(["P-1", "P-9"], {"P-1": "E-100"}) == (["E-100"], ["P-9"])
assert to_erp_ids([], {}) == ([], [])
assert to_erp_ids(["P-2", "P-1"], {"P-1": "E-1", "P-2": "E-2"}) == (["E-2", "E-1"], [])`,
        solution: `def to_erp_ids(plm_ids, mapping):
    mapped, missing = [], []
    for pid in plm_ids:
        if pid in mapping:
            mapped.append(mapping[pid])
        else:
            missing.append(pid)
    return mapped, missing`,
      }, {
        key: "paginate", prompt: "REST APIs return big results a page at a time. Write fetch_all(fetch_page): call fetch_page(cursor) starting with cursor None; each call returns {\"items\": [...], \"next\": cursor or None}. Keep calling with the returned cursor until next is None, and return all the items in order.",
        example: "With three pages of 2, 2 and 1 items, fetch_all returns all 5 items and calls fetch_page 3 times.",
        hint: "`cursor = None`, `items = []`, then a `while True:` loop: get a page, `items.extend(page[\"items\"])`, set cursor to `page[\"next\"]`, and `break` when it's None.",
        starter: `def fetch_all(fetch_page):
    pass
`,
        tests: `PAGES = {None: {"items": [1, 2], "next": "c2"}, "c2": {"items": [3, 4], "next": "c3"}, "c3": {"items": [5], "next": None}}
seen = []
def fetch_page(cursor):
    seen.append(cursor)
    return PAGES[cursor]
assert fetch_all(fetch_page) == [1, 2, 3, 4, 5]
assert seen == [None, "c2", "c3"], "follow the cursors in order, starting from None"
assert fetch_all(lambda c: {"items": [], "next": None}) == []`,
        solution: `def fetch_all(fetch_page):
    items = []
    cursor = None
    while True:
        page = fetch_page(cursor)
        items.extend(page["items"])
        cursor = page["next"]
        if cursor is None:
            return items`,
      }, {
        key: "sync", prompt: "Implement incremental_sync(records, watermark, store). Skip records with updated_at <= watermark. For the rest, upsert into store[id] = {\"version\", \"data\"} only if there's no stored version or the record's version is newer; if the record has \"deleted\": True (and is newer), remove it from store. Return the new watermark: the highest updated_at among records newer than the old watermark (or the old watermark if none).",
        example: "A batch with an older version arriving after a newer one leaves the newer version in the store; a newer record marked deleted removes the entry.",
        hint: "Loop over records newer than the watermark, tracking the highest updated_at. For each, compare its version with `store.get(id, {}).get(\"version\")`; act only if there's none or the record's is higher. Use `store.pop(id, None)` for deletes.",
        starter: `def incremental_sync(records, watermark, store):
    pass
`,
        tests: `store = {}
batch1 = [
    {"id": "P-100", "version": 1, "updated_at": 10, "data": "Gripper rev A"},
    {"id": "P-200", "version": 1, "updated_at": 11, "data": "Conveyor rev A"},
]
mark = incremental_sync(batch1, 0, store)
assert mark == 11 and set(store) == {"P-100", "P-200"}
assert incremental_sync(batch1, mark, store) == 11, "already-seen records change nothing"
batch2 = [
    {"id": "P-100", "version": 3, "updated_at": 15, "data": "Gripper rev C"},
    {"id": "P-100", "version": 2, "updated_at": 14, "data": "Gripper rev B"},
    {"id": "P-200", "version": 2, "updated_at": 16, "deleted": True},
]
mark = incremental_sync(batch2, mark, store)
assert mark == 16
assert store == {"P-100": {"version": 3, "data": "Gripper rev C"}}, "older versions must not overwrite newer ones"
snapshot = dict(store)
incremental_sync(batch2, 11, store)
assert store == snapshot, "replaying a batch is idempotent"`,
        solution: `def incremental_sync(records, watermark, store):
    new_mark = watermark
    for r in records:
        if r["updated_at"] <= watermark:
            continue
        new_mark = max(new_mark, r["updated_at"])
        current = store.get(r["id"], {}).get("version")
        if current is not None and r["version"] <= current:
            continue
        if r.get("deleted"):
            store.pop(r["id"], None)
        else:
            store[r["id"]] = {"version": r["version"], "data": r["data"]}
    return new_mark`,
      }],
      cards: [
        ["Why must event consumers be idempotent?", "Most brokers deliver at least once, so the same message can arrive twice (retries, redeliveries). Processing it twice must have the same effect as once."],
        ["What problem does the outbox pattern solve?", "Writing to the database and publishing an event aren't atomic. Writing the event to an outbox table in the same transaction, then relaying it, guarantees they never disagree."],
        ["You must call an old SOAP service from Python. How?", "Generate a client from the WSDL with zeep, wrap it in a small typed adapter with timeouts, retries and logging, and expose a clean REST or tool interface to the rest of the system."],
        ["What's the N+1 problem in GraphQL?", "Resolving a list and then a field per item triggers one query per item. Batch and cache lookups per request (DataLoader) to make it a couple of queries."],
      ],
    },
    {
      id: "mfgdata", title: "Manufacturing & engineering data", yt: "PLM vs ERP vs MES explained",
      body: `<p>Postings from manufacturers and automation companies list systems like <b>CAD/PDM, PLM, ERP and MES</b>. You don't need to have run them, but you need the vocabulary to ask good questions and design sensible integrations.</p>
        <h3>The systems</h3>
        <table><tr><th>System</th><th>What it holds</th><th>Examples</th></tr>
          <tr><td><b>CAD</b></td><td>3D models and drawings</td><td>SOLIDWORKS, Inventor, NX, CATIA</td></tr>
          <tr><td><b>PDM</b></td><td>Vault for CAD files: versions, check-in/out, references between parts and assemblies</td><td>SOLIDWORKS PDM, Autodesk Vault</td></tr>
          <tr><td><b>PLM</b></td><td>The product record: parts, BOMs, revisions, lifecycle states, change orders, documents</td><td>Teamcenter, Windchill, 3DEXPERIENCE</td></tr>
          <tr><td><b>ERP</b></td><td>Business side: orders, purchasing, inventory, costs, finance, the manufacturing BOM</td><td>SAP, Dynamics 365, Epicor, Infor</td></tr>
          <tr><td><b>MES</b></td><td>The shop floor: work orders in progress, routing, machine and quality data, traceability</td><td>Opcenter, Plex, FactoryTalk</td></tr></table>
        <h3>Concepts that come up</h3>
        <ul>
          <li><b>BOM (bill of materials):</b> a tree of assemblies and parts with quantities. The <b>EBOM</b> (engineering) is how it's designed; the <b>MBOM</b> (manufacturing) is how it's built and bought.</li>
          <li><b>Revisions and lifecycle states:</b> In Work, Released, Obsolete. An assistant must cite the <b>released</b> revision unless asked otherwise.</li>
          <li><b>ECR / ECO / ECN:</b> engineering change request, order and notice: the formal path for changing a released design.</li>
          <li><b>OPC UA and PLC data:</b> standard ways machines publish signals; feeds MES, dashboards and digital twins.</li>
          <li><b>Custom automation builders</b> design a new machine per customer, so <b>reusing past designs, quotes and lessons learned</b> is a natural AI use case.</li></ul>
        <h3>OpenUSD, Omniverse and digital twins</h3>
        <ul>
          <li><b>OpenUSD</b> (Universal Scene Description, from Pixar, now stewarded by the Alliance for OpenUSD) is a format for composing 3D scenes from <b>layers</b>: prims (objects) with attributes, combined via references, payloads and variants, so many teams and tools can work on one scene without overwriting each other.</li>
          <li><b>NVIDIA Omniverse</b> is a platform built on OpenUSD for real-time simulation, robotics (Isaac Sim) and <b>digital twins</b>: a virtual copy of a machine or line used for design reviews, virtual commissioning and operator training.</li>
          <li>Integration angle: pipelines that convert CAD into USD, attach metadata (part numbers, revisions, sensor tags) as attributes, and keep the twin in step with PLM changes. The Python API is the <code>pxr</code> module (<code>pip install usd-core</code>).</li></ul>
        <h3>AI use cases worth sketching</h3>
        <ul><li>Search past machine designs and documents by description ("pick-and-place cell for vials, under 2 m wide").</li>
          <li>BOM and change-order Q&amp;A with citations to the released revision.</li>
          <li>Drafting quotes or risk lists from similar past projects.</li>
          <li>Service assistants over manuals, drawings and field reports.</li></ul>`,
      exercises: [{
        key: "released", prompt: "An assistant should cite the released revision. Write latest_released(revisions): revisions is a list of {\"rev\", \"state\"} dicts, oldest first. Return the rev of the newest one whose state is \"Released\", or None.",
        example: `latest_released([{"rev": "A", "state": "Released"}, {"rev": "B", "state": "Released"}, {"rev": "C", "state": "In Work"}]) returns "B"`,
        hint: "Loop through all of them, remembering the rev each time you see a Released one; the last one remembered is the newest. Start with None.",
        starter: `def latest_released(revisions):
    pass
`,
        tests: `revs = [{"rev": "A", "state": "Released"}, {"rev": "B", "state": "Released"}, {"rev": "C", "state": "In Work"}]
assert latest_released(revs) == "B", "C is still In Work"
assert latest_released([{"rev": "A", "state": "Obsolete"}]) is None
assert latest_released([]) is None`,
        solution: `def latest_released(revisions):
    found = None
    for r in revisions:
        if r["state"] == "Released":
            found = r["rev"]
    return found`,
      }, {
        key: "where-used", prompt: "Write where_used(bom, part): bom maps an assembly to a list of (child, quantity) pairs. Return a sorted list of the assemblies that directly contain part.",
        example: `where_used(BOM, "SERVO") returns ["GRIPPER", "ROBOT"]`,
        hint: "Loop `for assembly, children in bom.items():` and check whether any child name equals part. Collect matches, then return `sorted(...)`.",
        starter: `def where_used(bom, part):
    pass
`,
        tests: `BOM = {"CELL": [("ROBOT", 2), ("GUARD", 1)], "ROBOT": [("SERVO", 6), ("GRIPPER", 1)], "GRIPPER": [("SERVO", 1), ("FINGER", 2)]}
assert where_used(BOM, "SERVO") == ["GRIPPER", "ROBOT"]
assert where_used(BOM, "ROBOT") == ["CELL"]
assert where_used(BOM, "CELL") == [], "nothing contains the top assembly"`,
        solution: `def where_used(bom, part):
    users = []
    for assembly, children in bom.items():
        for child, qty in children:
            if child == part:
                users.append(assembly)
                break
    return sorted(users)`,
      }, {
        key: "bom", prompt: "Implement explode_bom(bom, part, qty=1): bom maps an assembly to a list of (child, quantity) pairs; parts not in bom (or with no children) are purchased leaf parts. Return a dict of total leaf-part quantities needed to build qty of part. Shared subassemblies must be counted every place they appear.",
        example: `explode_bom(BOM, "GRIPPER") returns {"SERVO": 1, "FINGER": 2}\nexplode_bom(BOM, "BOLT") returns {"BOLT": 1}`,
        hint: "Recursion (a function calling itself) fits trees: if part has no children, return `{part: qty}`. Otherwise, for each (child, n), call `explode_bom(bom, child, qty * n)` and add its counts into a running dict.",
        starter: `def explode_bom(bom, part, qty=1):
    pass
`,
        tests: `BOM = {
    "CELL": [("ROBOT", 2), ("GUARD", 1)],
    "ROBOT": [("SERVO", 6), ("GRIPPER", 1)],
    "GRIPPER": [("SERVO", 1), ("FINGER", 2)],
    "GUARD": [("PANEL", 4), ("BOLT", 16)],
}
assert explode_bom(BOM, "GRIPPER") == {"SERVO": 1, "FINGER": 2}
assert explode_bom(BOM, "CELL") == {"SERVO": 14, "FINGER": 4, "PANEL": 4, "BOLT": 16}
assert explode_bom(BOM, "CELL", qty=3)["SERVO"] == 42
assert explode_bom(BOM, "BOLT") == {"BOLT": 1}, "a leaf part is its own result"`,
        solution: `def explode_bom(bom, part, qty=1):
    children = bom.get(part)
    if not children:
        return {part: qty}
    total = {}
    for child, n in children:
        for leaf, count in explode_bom(bom, child, qty * n).items():
            total[leaf] = total.get(leaf, 0) + count
    return total`,
      }],
      cards: [
        ["PLM vs ERP in one line each?", "PLM is the engineering record of the product (parts, BOMs, revisions, changes); ERP runs the business around it (orders, purchasing, inventory, cost)."],
        ["EBOM vs MBOM?", "The EBOM reflects the design structure from engineering; the MBOM reorganizes it for how the product is actually built and sourced, adding things like packaging and consumables."],
        ["Why must an engineering assistant care about lifecycle state?", "Answering from an In Work or Obsolete revision can send wrong specs to the shop floor. Default to Released and say which revision you cited."],
        ["What is OpenUSD good for in manufacturing?", "Composing large 3D scenes (machines, lines, factories) from layers that different tools and teams own, which makes it a common base for simulation and digital twins such as Omniverse."],
      ],
    },

    // ---------------- Delivery & operations ----------------
    {
      id: "cicd", title: "CI/CD for AI services", yt: "GitHub Actions CI/CD pipeline tutorial",
      body: `<p>Postings ask for Git-based workflows, pull requests, automated quality checks and CI/CD. The examples here use <b>GitHub Actions</b>; GitLab CI, Jenkins and other tools use the same ideas with different vocabulary.</p>
        <table><tr><th>Concept</th><th>What it looks like</th></tr>
          <tr><td>Pipeline definition</td><td><code>.github/workflows/*.yml</code>: jobs, steps, reusable workflows</td></tr>
          <tr><td>Deploy credentials</td><td><b>OIDC federation</b>: the pipeline exchanges a short-lived token for access, so no long-lived secret is stored</td></tr>
          <tr><td>Secrets and config</td><td>Repository or environment secrets, or a secrets manager read at deploy time</td></tr>
          <tr><td>Gated deploys</td><td>Environments with required reviewers</td></tr>
          <tr><td>PR rules</td><td>Branch protection or rulesets with required checks</td></tr></table>
        <h3>A solid pipeline for an AI service</h3>
        <ol>
          <li><b>On every PR:</b> lint, type-check, unit tests, dependency and secret scanning.</li>
          <li><b>Integration tests</b> against containers for the database and a mocked or sandbox model.</li>
          <li><b>AI eval gate:</b> run the golden-set evals; block the merge if groundedness, task success or safety scores drop below thresholds.</li>
          <li><b>Build the image once</b>, scan it, tag it with the commit SHA, push to your container registry.</li>
          <li><b>Deploy to dev, then test, then prod</b> with approvals; run database migrations as a pipeline step; smoke-test after each deploy.</li>
          <li><b>Rollback:</b> redeploy the previous image tag (for example <code>kubectl rollout undo</code>); keep migrations backward compatible so rollback is safe.</li></ol>
        <h3>Testing pyramid, including AI</h3>
        <p>Many fast unit tests; fewer integration and end-to-end tests; <b>load tests</b> before launches (k6, Locust); <b>security tests</b> (SAST, dependency scans, prompt-injection red-team cases); and <b>AI evals</b> on every prompt or model change. The Evals lesson in the AI track covers building the eval harness.</p>`,
      code: [{ label: ".github/workflows/ci.yml: test, eval gate, build and deploy with approval", code: `name: ci
on:
  pull_request: { branches: [main] }
  push: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: pip install -r requirements.txt -r requirements-dev.txt
      - run: ruff check . && mypy app && pytest -q
      - name: AI eval gate
        run: python evals/run.py --min-groundedness 0.85 --min-task-success 0.8

  build:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t ghcr.io/my-org/knowledge-api:"$GITHUB_SHA" .
      - run: docker push ghcr.io/my-org/knowledge-api:"$GITHUB_SHA"

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment: prod              # required reviewers are configured on the environment
    permissions: { id-token: write, contents: read }   # OIDC: no stored deploy secret
    steps:
      - run: kubectl set image deployment/knowledge-api api=ghcr.io/my-org/knowledge-api:"$GITHUB_SHA" && kubectl rollout status deployment/knowledge-api` }],
      cards: [
        ["What is OIDC federation for a pipeline?", "The pipeline proves its identity with a short-lived OIDC token that the target trusts, instead of a stored client secret, so there's no long-lived credential to leak or rotate."],
        ["Why build the container image once and promote it?", "The exact artifact you tested is what reaches production; rebuilding per environment can pull different dependencies."],
        ["Where do AI evals fit in CI/CD?", "As a gate on PRs that change prompts, models, retrieval or tools: run the golden set, compare with the baseline, and block merges that regress quality or safety."],
      ],
    },
    {
      id: "aiobs", title: "Observability for AI applications", yt: "OpenTelemetry LLM observability tracing",
      body: `<p>"Instrument applications and AI workflows with logs, metrics, traces, evaluation results, usage data and alerts while protecting sensitive information" is close to a quote you'll see in postings. Classic observability (see the Cloud Prep app) still applies; AI adds new signals and new privacy risks.</p>
        <h3>Traces are the backbone</h3>
        <ul>
          <li>Use <b>OpenTelemetry</b>: one trace per user request, with spans for retrieval, reranking, each model call and each tool call. Propagate the trace ID to the frontend so feedback links back to it.</li>
          <li>OpenTelemetry's <b>GenAI semantic conventions</b> standardize attributes like the model name, operation and input/output token counts, so tools can chart them consistently.</li>
          <li>Backends: Grafana stack, Datadog, your platform's monitoring service, or LLM-focused tools such as Langfuse or Arize Phoenix.</li></ul>
        <h3>What to measure</h3>
        <ul>
          <li><b>Performance:</b> time to first token, total latency (p50/p95), tokens per second, queue time.</li>
          <li><b>Cost and usage:</b> input/output tokens and cost per request, per feature, per team; cache hit rate.</li>
          <li><b>Reliability:</b> error and timeout rates per model and tool, retries, fallbacks taken, 429s.</li>
          <li><b>Quality in production:</b> user feedback, sampled online evals (groundedness, citation validity), "no answer" rate, retrieval hit rate.</li>
          <li><b>Safety:</b> blocked prompts, injection detections, approvals rejected.</li></ul>
        <h3>Protect sensitive data</h3>
        <ul><li>Prompts and outputs can contain personal data, credentials or confidential designs. <b>Redact before logging</b>, store full content only where policy allows, with restricted access and short retention.</li>
          <li>Log IDs and metadata by default (document IDs, not document text).</li></ul>
        <h3>Alerts that matter</h3>
        <p>Alert on symptoms users feel: p95 latency, error rate, cost per hour spikes, quality score drops, quota nearly exhausted. Every alert should link to a runbook.</p>`,
      code: [{ label: "OpenTelemetry span around a model call (Python)", code: `from opentelemetry import trace

tracer = trace.get_tracer("knowledge-api")

def answer(question, chunks):
    with tracer.start_as_current_span("chat claude-opus-5-5") as span:
        span.set_attribute("gen_ai.operation.name", "chat")
        span.set_attribute("gen_ai.request.model", "claude-opus-5-5")
        span.set_attribute("app.retrieved_doc_ids", [c["doc_id"] for c in chunks])  # IDs, not text
        resp = client.messages.create(model="claude-opus-5-5", max_tokens=800, messages=build(question, chunks))
        span.set_attribute("gen_ai.usage.input_tokens", resp.usage.input_tokens)
        span.set_attribute("gen_ai.usage.output_tokens", resp.usage.output_tokens)
        return resp` }],
      exercises: [{
        key: "span", prompt: "Write span_attrs(model, input_tokens, output_tokens) returning the OpenTelemetry GenAI attributes for a model call: {\"gen_ai.request.model\": model, \"gen_ai.usage.input_tokens\": input_tokens, \"gen_ai.usage.output_tokens\": output_tokens}.",
        example: `span_attrs("claude-opus-5-5", 1200, 300) returns\n{"gen_ai.request.model": "claude-opus-5-5", "gen_ai.usage.input_tokens": 1200, "gen_ai.usage.output_tokens": 300}`,
        hint: "Return one dict literal with those three keys.",
        starter: `def span_attrs(model, input_tokens, output_tokens):
    pass
`,
        tests: `assert span_attrs("claude-opus-5-5", 1200, 300) == {"gen_ai.request.model": "claude-opus-5-5", "gen_ai.usage.input_tokens": 1200, "gen_ai.usage.output_tokens": 300}`,
        solution: `def span_attrs(model, input_tokens, output_tokens):
    return {
        "gen_ai.request.model": model,
        "gen_ai.usage.input_tokens": input_tokens,
        "gen_ai.usage.output_tokens": output_tokens,
    }`,
      }, {
        key: "percentile", prompt: "Latency targets use percentiles: p95 is the value 95% of requests are at or below. Write percentile(values, p) using the nearest-rank method: sort the values, then take the one at position ceil(p / 100 × n), counting from 1. Raise ValueError for an empty list.",
        example: "percentile([120, 80, 300, 95, 110], 50) returns 110\npercentile(list(range(1, 101)), 95) returns 95",
        hint: "`s = sorted(values)`, `rank = math.ceil(p / 100 * len(s))`, and since lists count from 0, return `s[max(rank, 1) - 1]`.",
        starter: `import math

def percentile(values, p):
    pass
`,
        tests: `assert percentile([120, 80, 300, 95, 110], 50) == 110
assert percentile(list(range(1, 101)), 95) == 95
assert percentile([5, 1, 9], 100) == 9, "p100 is the maximum"
assert percentile([7], 95) == 7
try:
    percentile([], 95); raise SystemExit("expected ValueError")
except ValueError:
    pass`,
        solution: `import math

def percentile(values, p):
    if not values:
        raise ValueError("no values")
    s = sorted(values)
    rank = math.ceil(p / 100 * len(s))
    return s[max(rank, 1) - 1]`,
      }, {
        key: "cost-alert", prompt: "Alert on cost spikes. Write cost_spike(hourly_costs, factor): hourly_costs lists the cost of each hour, oldest first. Return True if the latest hour costs more than factor × the average of all the earlier hours. With fewer than two hours there's nothing to compare, so return False.",
        example: "cost_spike([2, 2, 2, 7], 2) returns True (7 > 2 × 2)\ncost_spike([2, 3, 4], 2) returns False (4 is not more than 2 × 2.5)",
        hint: "`earlier = hourly_costs[:-1]` and `latest = hourly_costs[-1]`; the average is `sum(earlier) / len(earlier)`.",
        starter: `def cost_spike(hourly_costs, factor):
    pass
`,
        tests: `assert cost_spike([2, 2, 2, 7], 2) is True
assert cost_spike([2, 3, 4], 2) is False
assert cost_spike([5], 2) is False, "one hour has nothing to compare against"
assert cost_spike([1, 1, 2], 2) is False, "exactly factor times the average is not a spike"`,
        solution: `def cost_spike(hourly_costs, factor):
    if len(hourly_costs) < 2:
        return False
    earlier = hourly_costs[:-1]
    return hourly_costs[-1] > factor * sum(earlier) / len(earlier)`,
      }],
      cards: [
        ["What belongs on a trace for a RAG request?", "Spans for query rewriting, retrieval, reranking, each model call and tool call, with timings, token counts, model name, retrieved document IDs and errors, all under one trace ID."],
        ["Why log document IDs instead of the retrieved text?", "The text may be confidential or personal. IDs let you reproduce and debug with proper access, without copying sensitive content into the logging system."],
        ["Which AI metrics deserve alerts?", "p95 latency, error and timeout rates, cost-per-hour spikes, quota near exhaustion, and drops in online quality scores or feedback."],
      ],
    },

    // ---------------- Working style ----------------
    {
      id: "aicoding", title: "Working with AI coding assistants", yt: "Claude Code workflow tips",
      body: `<p>Postings now ask for <b>active, effective use of AI coding assistants</b> (Claude Code, Codex, Cursor, Copilot) <b>with human review, security, testing and accountability</b>. Expect questions like "walk me through how you use them" and "how do you make sure the output is right?"</p>
        <h3>A workflow that holds up</h3>
        <ul>
          <li><b>Plan first:</b> ask for a plan or design, review it, then implement in small steps. Big one-shot changes are hard to review.</li>
          <li><b>Give context:</b> project instruction files (CLAUDE.md, AGENTS.md, Cursor rules) with build commands, conventions and no-go areas.</li>
          <li><b>Tests as the contract:</b> write or have it write the failing test first, then the implementation; run the suite every step.</li>
          <li><b>Review every line</b> like a colleague's PR: correctness, edge cases, security, naming, needless complexity. You own what you merge.</li>
          <li><b>Good fits:</b> boilerplate, tests, migrations, refactors, reading unfamiliar code, docs, one-off scripts, debugging with logs. <b>Careful fits:</b> auth, crypto, concurrency, data deletion, anything you can't verify.</li></ul>
        <h3>Guardrails</h3>
        <ul><li>Never paste secrets, customer data or export-controlled designs into tools your company hasn't approved.</li>
          <li>Keep permissions tight: review commands before they run against shared environments.</li>
          <li>Watch for invented APIs and outdated library usage; check against the docs.</li>
          <li>Measure it honestly: where it saves time, and where it costs time in review.</li></ul>
        <div class="callout"><b>Interview tip:</b> have one concrete story: the task, how you prompted and reviewed, a mistake the assistant made that you caught, and the time saved.</div>`,
      cards: [
        ["An interviewer asks how you use AI coding tools. What's a strong answer shape?", "A concrete workflow (plan, small steps, tests first, review every diff), where it helps most, a real example of catching a mistake, and how you protect secrets and data."],
        ["What should never go into an unapproved AI tool?", "Secrets and credentials, personal or customer data, and confidential or export-controlled designs or code, per company policy."],
      ],
    },
    {
      id: "behavioral", title: "Behavioural prep for AI engineering roles", yt: "STAR method behavioral interview software engineer",
      body: `<p>AI postings increasingly describe <b>how</b> you work: from an architect's direction, with evidence, comfortable being wrong. Prepare stories with the <b>STAR</b> shape (Situation, Task, Action, Result) and real numbers.</p>
        <h3>Stories to have ready</h3>
        <ul>
          <li><b>Evidence changed a decision:</b> you prototyped or benchmarked two options and the data picked the winner (yours or not).</li>
          <li><b>Testing disproved your assumption:</b> what you believed, what the test showed, how you pivoted without defensiveness, and what you documented so others benefit.</li>
          <li><b>Disagree and commit:</b> you argued for an alternative with trade-offs, the decision went the other way, and you executed it fully.</li>
          <li><b>Production incident:</b> how you diagnosed it across system boundaries, communicated, fixed, and prevented a repeat.</li>
          <li><b>Working with non-engineers:</b> engineers, operations or subject-matter experts shaped what you built; you changed the design to fit their real workflow.</li>
          <li><b>Leaving things maintainable:</b> runbooks, architecture records, reusable libraries, handover.</li></ul>
        <h3>Working from an architect's direction</h3>
        <p>Show that you can take an approved architecture and own the details: break it into increments with acceptance criteria, raise risks early, propose alternatives <b>with evidence</b>, and document decisions (architecture decision records).</p>
        <div class="callout">Keep each story to about two minutes, end with the result and what you learned, and map your stories to the posting's own phrases.</div>`,
      cards: [
        ["Tell me about a time testing proved you wrong.", "STAR: the assumption, the test or eval that disproved it, how quickly you changed course, the result, and how you captured the lesson (docs, a reusable check, an ADR)."],
        ["How do you propose an alternative to an architect's plan?", "Build a small prototype or benchmark, compare on the criteria that matter (quality, latency, cost, risk), present trade-offs briefly, and commit to whatever is decided."],
      ],
    },
  ],

  questions: [
    { id: "r1", topic: "selfhost", q: "When would you run a model locally instead of calling a cloud API?", a: "When data can't leave the network, when steady high volume makes owned GPUs cheaper, when you need a specific open-weight or fine-tuned model, or for offline/edge use. Trade-offs: GPU cost and scarcity, ops burden, and usually lower quality than frontier models. Put both behind a gateway and decide per use case with evals and cost data." },
    { id: "r2", topic: "selfhost", q: "How would you load-test a self-hosted LLM endpoint?", a: "Use realistic prompt and output lengths, step concurrency up with k6 or Locust, and record time to first token, tokens per second, p50/p95 latency and errors. Find where p95 jumps, set capacity below it with headroom, and repeat after changing model, quantization or server settings." },
    { id: "r3", topic: "selfhost", q: "What is a model gateway and what would you put in it?", a: "A single entry point between apps and all models: authentication, per-team quotas and budgets, routing (local first, cloud fallback), retries, caching, logging of usage and cost, and policy such as content filters. It decouples apps from providers and gives central control." },
    { id: "r4", topic: "entagents", q: "Design an agent that can create work orders in an ERP system safely.", a: "Read-only tools run automatically; create_work_order is a write that requires human approval showing exact fields. Validate arguments against a schema and allow-list, run calls with the user's own permissions, attach an idempotency key, cap steps and cost, retry only transient errors, and log every proposal, approval and result. Evaluate on a test set of requests including adversarial ones." },
    { id: "r5", topic: "entagents", q: "How do you give an assistant memory without creating a privacy problem?", a: "Keep working memory trimmed or summarized per session; store long-term memory in a database scoped per user/project with clear retention; let users view and delete it; never mix memories across users; and don't store secrets or sensitive data unless policy allows." },
    { id: "r6", topic: "entagents", q: "An external system the agent depends on starts timing out. What should happen?", a: "Retry with backoff and jitter a few times; then a circuit breaker stops calling it for a while; the agent tells the user what's unavailable and continues with other sources or a partial answer; alerts fire; the trace shows exactly which tool failed." },
    { id: "r7", topic: "permrag", q: "How do you make sure a RAG assistant never shows a user a document they can't open?", a: "Capture ACLs at ingest and store them on every chunk; take the user's identity and groups from their token; filter during retrieval (default deny for missing ACLs); sync permission changes and deletes quickly; test with users in different groups; never rely on the prompt for access control." },
    { id: "r8", topic: "permrag", q: "Your engineering search misses exact part numbers. What do you change?", a: "Add keyword search (BM25 / full-text) alongside vectors and fuse with RRF, index part numbers as metadata for exact filters, consider a reranker on the merged shortlist, and measure recall@k on a set of real queries before and after." },
    { id: "r9", topic: "pgvector", q: "Walk through adding a vector search feature to an existing PostgreSQL application.", a: "Enable pgvector, add a table or column sized to the embedding model, backfill embeddings in batches with a worker, build an HNSW index concurrently, add a full-text column for hybrid search, filter by tenant/ACL in the same query, and monitor latency and recall. Ship the schema change via versioned, backward-compatible migrations." },
    { id: "r10", topic: "pgvector", q: "How do you make a risky schema change on a production database?", a: "Expand and contract in small backward-compatible steps, use concurrent index builds and lock timeouts, backfill in batches off-peak, test on a production-sized copy, take a backup, run migrations through the pipeline, and have a tested rollback path." },
    { id: "r11", topic: "integration", q: "You need to connect an AI assistant to a legacy SOAP ERP service. How do you approach it?", a: "Read the WSDL, generate a client (zeep or dotnet-svcutil), wrap it in a small adapter with timeouts, retries, mapping to clean types and logging; respect rate limits and use read-only credentials; expose narrow tools to the agent; and agree on the integration with the ERP owner." },
    { id: "r12", topic: "integration", q: "How would you keep a search index in sync with PLM documents?", a: "Incremental sync using a watermark or change feed, upserts guarded by version so older updates never win, propagate deletes and ACL changes, enrich with project, revision and lifecycle state, run as a monitored worker with dead-letter handling, and alert on lag." },
    { id: "r13", topic: "mfgdata", q: "Explain the difference between PDM, PLM, ERP and MES to a software engineer.", a: "PDM manages CAD files and versions; PLM manages the product definition (parts, BOMs, revisions, changes); ERP runs the business (orders, purchasing, inventory, cost); MES runs the shop floor (work in progress, routing, quality, traceability). Data flows roughly CAD to PDM to PLM to ERP to MES." },
    { id: "r14", topic: "mfgdata", q: "What AI use cases would you propose for a custom automation machine builder?", a: "Search and reuse of past machine designs and documents, BOM and change-order Q&A with citations to released revisions, drafting quotes and risk lists from similar projects, service assistants over manuals and field reports, and summarizing engineering changes. Start with the one with clear data access and a measurable outcome." },
    { id: "r16", topic: "selfhost", q: "How do you plan capacity for an LLM feature expected to reach 20 requests per second?", a: "Measure tokens per request and what one replica (or deployment) sustains at the latency target; replicas = demand / per-replica throughput plus 20-30% headroom; check quotas and PTU vs pay-as-you-go; load-test; and set autoscaling on queue depth with warm replicas." },
    { id: "r17", topic: "cicd", q: "Describe a CI/CD pipeline for an LLM-powered API.", a: "PR checks (lint, types, unit tests, secret and dependency scans), integration tests, an AI eval gate against a golden set, build the image once tagged with the commit, scan and push to the registry, deploy through environments with approvals, run migrations, smoke-test, and roll back by redeploying the previous tag." },
    { id: "r18", topic: "aiobs", q: "What would you instrument in a production RAG application?", a: "OpenTelemetry traces with spans for retrieval, reranking, model and tool calls; latency (TTFT, p95), tokens and cost per request; errors, retries and 429s; retrieval hit rate and online eval scores; user feedback tied to trace IDs; with redaction so prompts and documents don't leak into logs." },
    { id: "r19", topic: "aifrontend", q: "What makes a good UI for an AI assistant used by engineers?", a: "Streaming with a stop button, clickable citations to exact sources, visible progress for multi-step work, clear 'not found' and 'no access' states, approval screens for actions, and quick feedback that feeds evaluation." },
    { id: "r20", topic: "aicoding", q: "How do you use AI coding assistants while keeping quality and security?", a: "Plan before coding, keep changes small, use tests as the contract, review every diff as if a colleague wrote it, keep project instructions in the repo, never share secrets or restricted data, and verify APIs against docs. Use them most for boilerplate, tests, refactors and exploration." },
    { id: "r21", topic: "behavioral", q: "Tell me about a time a prototype or benchmark changed a technical decision.", a: "Use STAR: the decision and options, how you designed a fair comparison (same data, clear metrics like quality, latency, cost), the result, the decision it led to, and what you documented for the team." },
    { id: "r22", topic: "behavioral", q: "How do you work when an architect sets the direction but you disagree with part of it?", a: "Understand the reasons first, then raise the concern with evidence (a quick prototype or numbers) and clear trade-offs; once decided, commit fully and make it succeed; record the decision and any follow-up checks." },
  ],

  quiz: [
    { id: "rq1", tags: ["ai"], topic: "selfhost", q: "Which technique lets an inference server add new requests to a batch that is already running?", options: ["Continuous batching", "Quantization", "Speculative caching", "Sharding"], answer: 0, why: "Continuous (in-flight) batching slots new requests in as others finish, keeping the GPU busy." },
    { id: "rq2", tags: ["ai"], topic: "selfhost", q: "Roughly how much GPU memory do the weights of an 8-billion-parameter model need at 16-bit precision?", options: ["2 GB", "8 GB", "16 GB", "64 GB"], answer: 2, why: "8 billion parameters x 2 bytes = 16 GB, before the KV cache and runtime overhead." },
    { id: "rq3", tags: ["ai"], topic: "selfhost", q: "What's the main reason to put a model gateway in front of local and cloud models?", options: ["To train models faster", "Central auth, quotas, routing, fallbacks and usage logging through one API", "To replace the vector database", "To avoid writing prompts"], answer: 1, why: "A gateway centralizes access control, budgets, routing and observability across providers." },
    { id: "rq4", tags: ["ai"], topic: "entagents", q: "An agent proposes to update a released BOM. What should happen first?", options: ["Execute it if the model is confident", "Ask the model to double-check itself", "Show the exact change to a human for approval and log the decision", "Retry until it succeeds"], answer: 2, why: "Writes to systems of record need human approval with a clear preview, plus an audit trail." },
    { id: "rq5", tags: ["ai"], topic: "entagents", q: "Which error should NOT be retried automatically?", options: ["HTTP 503 Service Unavailable", "HTTP 429 Too Many Requests", "A network timeout", "HTTP 400 validation error"], answer: 3, why: "A 400 means the request itself is wrong; retrying sends the same bad request again." },
    { id: "rq6", tags: ["ai"], topic: "permrag", q: "Where should document permissions be enforced in an enterprise RAG system?", options: ["In the system prompt", "During retrieval, using the user's identity, before content reaches the model", "Only in the frontend", "After the model answers, by scanning the text"], answer: 1, why: "Filter at retrieval with default deny; the model can only leak what's in its context." },
    { id: "rq7", tags: ["ai"], topic: "permrag", q: "Reciprocal rank fusion scores a document by:", options: ["Its cosine similarity only", "The sum of 1 / (k + rank) across result lists", "Its BM25 score divided by length", "The number of times it was clicked"], answer: 1, why: "RRF combines positions from each ranked list, avoiding score normalization." },
    { id: "rq8", tags: ["ai"], topic: "pgvector", q: "Which PostgreSQL statement builds an index without blocking writes?", options: ["CREATE INDEX LOCKFREE", "CREATE INDEX CONCURRENTLY", "REINDEX FAST", "ALTER TABLE ... ONLINE"], answer: 1, why: "CONCURRENTLY avoids the write lock (it's slower and can't run inside a transaction)." },
    { id: "rq9", tags: ["ai"], topic: "pgvector", q: "In pgvector, the operator <=> computes:", options: ["Cosine distance", "Euclidean distance", "Inner product", "Jaccard similarity"], answer: 0, why: "<=> is cosine distance; <-> is L2 and <#> is negative inner product." },
    { id: "rq10", tags: ["ai"], topic: "integration", q: "Why must message consumers be idempotent?", options: ["Brokers usually deliver at least once, so duplicates happen", "It makes messages smaller", "SOAP requires it", "It removes the need for retries"], answer: 0, why: "With at-least-once delivery, processing the same message twice must be safe." },
    { id: "rq11", tags: ["ai"], topic: "integration", q: "A SOAP service is described by a:", options: ["GraphQL schema", "WSDL document", "OpenAPI YAML only", "Protobuf file"], answer: 1, why: "SOAP services publish a WSDL describing operations and XML message types." },
    { id: "rq12", tags: ["ai"], topic: "mfgdata", q: "Which system is the usual home of parts, BOMs, revisions and engineering change orders?", options: ["MES", "ERP", "PLM", "CRM"], answer: 2, why: "PLM holds the product definition and its change process; ERP and MES consume it." },
    { id: "rq15", tags: ["ai"], topic: "selfhost", q: "Which signal is best for autoscaling GPU inference replicas?", options: ["CPU usage", "Disk space", "Queue depth or concurrent requests", "Number of pods"], answer: 2, why: "GPU serving is bound by request load and the GPU, not CPU; scale on queue depth or concurrency." },
    { id: "rq17", tags: ["ai"], topic: "cicd", q: "Workload identity federation in a pipeline means:", options: ["Sharing one admin password", "Exchanging a short-lived OIDC token for cloud access instead of storing a secret", "Running builds on-premises", "Disabling approvals"], answer: 1, why: "Federated credentials remove long-lived secrets from CI/CD." },
    { id: "rq18", tags: ["ai"], topic: "aiobs", q: "What should a production AI app log by default about retrieved documents?", options: ["Full document text", "Document IDs and metadata", "Nothing at all", "Users' passwords"], answer: 1, why: "IDs enable debugging without copying confidential content into logs." },
    // Checks for the lessons without coding exercises: answering all of a lesson's questions correctly completes it.
    { id: "rq19", tags: ["ai"], topic: "pgvector", q: "Which pgvector index usually gives the best recall and query speed, at the cost of slower builds and more memory?", options: ["IVFFlat", "HNSW", "B-tree", "GIN"], answer: 1, why: "HNSW is the usual choice for recall and speed; IVFFlat builds faster but needs training data, and B-tree and GIN serve ordinary columns and full-text search." },
    { id: "rq21", tags: ["ai"], topic: "cicd", q: "Where should an AI eval gate run in a CI/CD pipeline?", options: ["Only after deploying to production", "On pull requests, blocking the merge when scores drop below thresholds", "Once a quarter", "Only on developers' laptops"], answer: 1, why: "Running the golden-set evals on every PR catches quality regressions before they merge." },
    { id: "rq22", tags: ["ai"], topic: "cicd", q: "Why build the container image once and tag it with the commit SHA?", options: ["The same tested image is promoted through every environment, and rollback means redeploying a previous tag", "It makes the image smaller", "Registries require it", "It removes the need for tests"], answer: 0, why: "Build once, deploy many: what you tested is exactly what reaches production, and every version stays addressable for rollback." },
    { id: "rq23", tags: ["ai"], topic: "aicoding", q: "What's the safest way to use an AI coding assistant on a large change?", options: ["Ask for the whole feature in one prompt and merge it", "Plan first, implement in small steps with tests, and review every diff", "Let it run commands against production to check its work", "Skip review whenever the tests it wrote pass"], answer: 1, why: "Small, planned, tested steps keep each diff reviewable, and you stay accountable for what you merge." },
    { id: "rq24", tags: ["ai"], topic: "aicoding", q: "Which of these should never go into an AI tool your company hasn't approved?", options: ["A public library's documentation", "Customer data and credentials", "An open-source error message", "A question about Python syntax"], answer: 1, why: "Secrets, personal or customer data and confidential designs stay out of unapproved tools." },
    { id: "rq25", tags: ["ai"], topic: "aicoding", q: "An assistant suggests a library function you've never seen. What do you do?", options: ["Trust it: models know every API", "Check it against the library's documentation, since assistants can invent or misremember APIs", "Ask the assistant whether it's sure", "Remove the library"], answer: 1, why: "Invented or outdated APIs are a common failure; the docs are the source of truth." },
    { id: "rq26", tags: ["ai"], topic: "behavioral", q: "In behavioural interviews, STAR stands for:", options: ["Situation, Task, Action, Result", "Skills, Training, Achievements, References", "Start, Try, Adjust, Repeat", "Strategy, Tactics, Analysis, Review"], answer: 0, why: "Situation and Task set the scene, Action is what you did, Result is the outcome (with numbers if you have them)." },
    { id: "rq27", tags: ["ai"], topic: "behavioral", q: "You disagree with part of an architect's plan. The strongest approach is to:", options: ["Quietly build your own version", "Raise the concern with evidence such as a prototype or benchmark, then commit to whatever is decided", "Refuse to start until the plan changes", "Go straight to their manager"], answer: 1, why: "Evidence and clear trade-offs make the case; committing once decided shows you can work from an architect's direction." },
    { id: "rq28", tags: ["ai"], topic: "behavioral", q: "About how long should one behavioural story take to tell?", options: ["About 10 seconds", "About two minutes, ending with the result and what you learned", "Ten minutes or more", "As long as the interviewer allows"], answer: 1, why: "Two minutes is long enough for real detail and short enough to leave time for follow-up questions." },
  ],

  // Steps keep their order (progress is saved by position): what to do, what you should see, and a hint.
  labs: [
    {
      id: "knowledge", title: "Engineering knowledge assistant (capstone)", level: "Advanced", time: "20-30 hours",
      stack: ["React + TypeScript", "FastAPI", "PostgreSQL + pgvector", "LLM API", "Docker", "GitHub Actions"],
      goal: "An assistant over engineering documents (manuals, drawings' metadata, change orders) that answers with citations, respects permissions, and can draft one action behind human approval. It matches what manufacturing and enterprise AI roles describe almost line by line.",
      before: [
        "**Cost:** embeddings for 100 documents cost cents; answering questions during development costs a few dollars with a mid-size model; the CI eval gate adds a little per run. Cloud deployment is optional and is where costs grow.",
        "**Set spending limits** with the model provider and, if you deploy, a cloud budget alert.",
        "**Keep keys out of code and git:** `.env` plus `.gitignore` locally, pipeline secrets in CI, and a secrets manager if you deploy.",
        "**Free alternative:** run PostgreSQL + pgvector in Docker, embed with `sentence-transformers`, and generate with a local model through Ollama. Swap in a hosted model later for quality.",
      ],
      steps: [
        { do: "Collect 50-100 public engineering documents (equipment manuals, datasheets) and give each a fake project, revision, lifecycle state and ACL group",
          see: "A folder of documents plus a metadata file (CSV or JSON) with one row per document.",
          hint: "Vendors publish manuals and datasheets as PDFs; invent the project, revision and group values so you can test permissions." },
        { do: "Ingest: parse, chunk, embed and store in PostgreSQL + pgvector with metadata and a full-text column",
          see: "`SELECT count(*) FROM chunks` matches the chunk count, and a test query ordered by `embedding <=> ...` returns sensible chunks.",
          hint: "The schema in the pgvector lesson has the columns and indexes you need." },
        { do: "Retrieval: hybrid search fused with RRF, filtered by the caller's groups (default deny)",
          see: "A user in one group never gets another group's chunks, and exact part numbers are found.",
          hint: "Your `can_read`, `rrf_score` and `secure_hybrid` exercises are this step in Python." },
        { do: "Answer with streaming and clickable citations; cite only Released revisions unless asked",
          see: "Answers stream in, each citation opens the right document, and In Work revisions aren't cited.",
          hint: "Filter on lifecycle state in the retrieval query, not in the prompt." },
        { do: "Add one write tool (e.g. draft a change request) that requires approval in the UI and is audit-logged",
          see: "The tool call pauses with an approval dialog showing the exact change, and the audit log records who approved it.",
          hint: "Your `describe_change` and `review_action` exercises are the gate." },
        { do: "React + TypeScript frontend: streaming, stop button, citations, approval dialog, thumbs feedback",
          see: "All five work in the browser, and feedback is stored with the trace ID.",
          hint: "The streaming sample in the AI frontends lesson covers the stop button with `AbortController`." },
        { do: "Evals: a golden set of 30+ questions (including no-access and injection cases) scored for groundedness and permission leaks, run in CI as a gate",
          see: "A PR that breaks permission filtering fails the pipeline.",
          hint: "Include questions asked as users who shouldn't see the answer; a leak is a failed case." },
        { do: "Observability: OpenTelemetry traces, token and cost metrics, redacted logs",
          see: "One trace per question showing retrieval, model and tool spans, with token counts and no document text in the logs.",
          hint: "Your `span_attrs` and `percentile` exercises cover the attributes and the p95 metric." },
        { do: "Containerize (non-root, OpenShift-friendly) and deploy via a pipeline to a cloud container service or a local Kubernetes/OpenShift (CRC) cluster",
          see: "The pipeline builds the image, deploys it, and a smoke test passes against the deployed URL.",
          hint: "Group-0 writable paths and a high port keep the image OpenShift-friendly: run as a non-root user and don't assume a fixed UID." },
        { do: "Write the README: architecture diagram, eval results, decisions and trade-offs",
          see: "A reader understands what it does, how well it works (numbers), and why you built it this way, in five minutes.",
          hint: "Lead with a screenshot and the eval table; keep decisions as short bullet points." },
      ],
      cost: "Use a small embedding model and cap generation tokens; run Postgres locally in Docker. If deploying to the cloud, set a budget alert and delete resources when done.",
      resume: "Built a permission-aware engineering knowledge assistant (React/TypeScript, FastAPI, PostgreSQL + pgvector) with hybrid retrieval, cited streaming answers and human-approved agent actions; an eval suite in CI blocked regressions in groundedness and access control.",
      stretch: ["Add a cross-encoder reranker and report the recall@5 change", "Sync documents incrementally from a mock PLM REST API and a SOAP service", "Run the generator on a local model via vLLM or Ollama behind a gateway, with cloud fallback"],
    },
    {
      id: "gateway", title: "Self-hosted model platform with a gateway", level: "Advanced", time: "12-18 hours",
      stack: ["Kubernetes or OpenShift (kind / CRC)", "Ollama or vLLM", "LiteLLM", "OpenTelemetry + Grafana", "k6"],
      goal: "Serve an open-weight model and an embedding model on Kubernetes behind a gateway with auth, quotas, cloud fallback and dashboards, then load-test it and publish the capacity numbers.",
      before: [
        "**Cost:** free if you run everything locally on CPU with kind or OpenShift Local. The optional cloud fallback calls a paid API (cents during testing); cloud GPUs cost dollars per hour.",
        "**Set a spending limit** on the cloud model account used for fallback, and stop any cloud GPU as soon as you finish a test.",
        "**Keep keys out of code and git:** store the fallback API key and the gateway's master key as Kubernetes Secrets, created from the command line, never committed in YAML.",
        "**Free alternative:** leave out the cloud fallback entirely and route between two local models instead.",
      ],
      steps: [
        { do: "Deploy an inference server (Ollama on CPU is fine; vLLM if you have a GPU) with resource requests, probes and a persistent model cache",
          see: "`kubectl get pods` shows it Running and Ready, and a request through `kubectl port-forward` returns an answer.",
          hint: "Put the model files on a persistent volume so restarts don't download them again." },
        { do: "Deploy an embedding model as a separate service",
          see: "A request returns a vector of the expected length.",
          hint: "Ollama serves embedding models too; a separate Deployment lets you scale it independently." },
        { do: "Put LiteLLM in front: API keys per team, rate limits, routing to local first with fallback to a cloud model",
          see: "Two team keys get separate limits, and stopping the local model makes requests fall back to the cloud model.",
          hint: "Your `choose_backend` exercise is the routing rule; LiteLLM's config file expresses it." },
        { do: "Add OpenTelemetry traces and metrics (latency, tokens, errors) with a Grafana dashboard",
          see: "A dashboard showing requests per minute, p95 latency, tokens and errors, updating as you send requests.",
          hint: "Start with the gateway's own metrics endpoint before adding custom spans." },
        { do: "Load-test with k6 at increasing concurrency; record TTFT, tokens/s and p95; find the knee",
          see: "A table or chart where p95 latency jumps sharply past some concurrency level: that's the knee.",
          hint: "Use realistic prompt and output lengths, and step concurrency up (1, 2, 4, 8...) rather than jumping straight to a high number." },
        { do: "Write a capacity note: replicas needed for a target load, with headroom and cost per 1,000 requests",
          see: "One page with the target load, measured per-replica throughput, replica count and cost.",
          hint: "Your `replicas_needed` exercise (AI / LLM > LLM system design interviews) does the arithmetic." },
        { do: "Automate the deploy with a pipeline and Helm or Kustomize; document rollback",
          see: "A commit triggers a deploy, and the documented rollback command restores the previous version.",
          hint: "Tag images with the commit SHA so rollback is redeploying a known tag." },
      ],
      cost: "Run locally with kind or OpenShift Local (CRC) on CPU to stay free. Cloud GPUs are expensive: if you use one, stop it immediately after testing.",
      resume: "Deployed a self-hosted LLM platform on Kubernetes with a gateway providing per-team quotas and cloud fallback, instrumented with OpenTelemetry, and load-tested to document capacity (p95 latency vs concurrency) and cost per request.",
      stretch: ["Autoscale on queue depth with KEDA", "Compare a 4-bit and 16-bit model on your evals and throughput", "Add semantic caching and measure the hit rate"],
    },
  ],

  glossary: [
    ["BOM", "Bill of materials: the tree of assemblies and parts, with quantities, that make up a product."],
    ["Circuit breaker", "A pattern that stops calling a failing dependency for a while so failures don't cascade."],
    ["Continuous batching", "Adding new requests to a running inference batch as slots free up, to keep GPUs busy."],
    ["Digital twin", "A virtual model of a physical machine or line kept in sync with it, used for simulation and monitoring."],
    ["EBOM / MBOM", "Engineering vs manufacturing bill of materials: as designed vs as built and sourced."],
    ["ECO", "Engineering change order: the approved instruction to change a released design."],
    ["ERP", "Enterprise resource planning: orders, purchasing, inventory, finance."],
    ["Expand and contract", "Making schema changes in backward-compatible steps: add, migrate, then remove the old structure later."],
    ["Idempotency key", "A unique key sent with a write so repeating the request doesn't repeat its effect."],
    ["KV cache", "Stored attention keys and values for tokens already processed; grows with context length and concurrency."],
    ["MES", "Manufacturing execution system: shop-floor work orders, routing, quality and traceability."],
    ["Model gateway", "A proxy in front of models providing one API, auth, quotas, routing, fallbacks and logging."],
    ["OpenUSD", "Universal Scene Description: an open format for composing 3D scenes from layers, used for digital twins."],
    ["Outbox pattern", "Writing events to a table in the same transaction as the data change, then publishing them reliably."],
    ["PDM", "Product data management: version control for CAD files and their references."],
    ["pgvector", "PostgreSQL extension adding a vector type, distance operators and approximate nearest-neighbour indexes."],
    ["PLM", "Product lifecycle management: parts, BOMs, revisions, lifecycle states and change processes."],
    ["Quantization", "Storing model weights in fewer bits (e.g. 4 or 8) to cut memory and cost, with some quality loss."],
    ["RRF", "Reciprocal rank fusion: combining ranked lists by summing 1 / (k + rank)."],
    ["SCC", "Security context constraint: OpenShift's policy controlling what pods may do (user IDs, privileges, volumes)."],
    ["Security trimming", "Filtering search results to only what the current user is allowed to see."],
    ["TTFT", "Time to first token: how long until a streamed response starts."],
    ["Watermark", "The last-processed timestamp or change token used for incremental sync."],
    ["Workload identity federation", "Letting a pipeline or workload exchange a short-lived OIDC token for cloud access instead of storing secrets."],
  ],
};
