// The beginner lessons, for people with no machine-learning background: "AI from zero" (what models,
// training, LLMs, tokens and API calls are, in plain language). Merged into AI by extendTrack, ahead of the
// main topics. Topics carry `zero: "ai"`; trackview.js puts them first for new learners and marks them
// optional for people who already know the basics. The exercises assume a little Python. Each exercise has a stable `key`, a plain prompt, an example, a hint and a
// model answer. The AI exercises simulate the model with small Python functions or lookup tables, so nothing
// needs an API key. body is trusted HTML (written here). Code avoids backslashes (template literals).

const ZERO_TOPICS = [
  // ---------------- AI from zero ----------------
  {
    id: "az-model", zero: "ai", title: "What a model is and what training means", yt: "what is an AI model and training explained simply",
    videos: [IBM("qYNweeDHiyU", "AI, Machine Learning, Deep Learning and Generative AI Explained")],
    body: `<p>"AI" covers many things, but almost all of today's AI is built from <b>models</b>. This lesson explains what a model is and what people mean when they say a model was "trained". No maths beyond multiplication.</p>
      <h3>A model turns an input into a prediction</h3>
      <p>A <b>model</b> is a function, like a Python function: an input goes in and an output comes out. The output is a <b>prediction</b>, a best guess: a photo goes in and "cat" comes out; an email goes in and "spam" comes out; a sentence goes in and the most likely next word comes out.</p>
      <p>The difference from a normal function is <i>who decides how it behaves</i>. You don't write the rules by hand. Inside the model are numbers called <b>parameters</b> (also called <i>weights</i>), and the model's behaviour depends on them. Change the numbers and you change the predictions.</p>
      <h3>Training: finding good numbers from examples</h3>
      <p><b>Training</b> means finding parameter values that make good predictions. You need <b>training data</b>: examples where you already know the right answer. Then:</p>
      <ol><li>Let the model predict an answer for each example.</li>
      <li>Measure how wrong it was: the <b>error</b> (also called <i>loss</i>). A simple error is the distance between the prediction and the right answer, ignoring the sign. Python's <code>abs()</code> gives that: <code>abs(3 - 5)</code> is 2, and so is <code>abs(5 - 3)</code>.</li>
      <li>Adjust the parameters to make the total error smaller.</li>
      <li>Repeat until the error stops shrinking.</li></ol>
      <p>Once trained, the parameters are fixed and you use the model on new inputs it has never seen. That's called <b>inference</b>. When you chat with an AI assistant, you're doing inference; the training happened months earlier.</p>
      <h3>Worked example: a reading-time model</h3>
      <p>We want to predict how many minutes an article takes to read from its number of words. Our model has one parameter, <code>k</code>: <i>minutes = words &times; k</i>. Our training data is three articles we timed: 1000 words took 4 minutes, 2000 took 9, 500 took 2.</p>
      <ol><li>Try <code>k = 0.003</code>: predictions are 3, 6 and 1.5 minutes. Errors are 1, 3 and 0.5: total 4.5.</li>
      <li>Try <code>k = 0.004</code>: predictions 4, 8, 2. Errors 0, 1, 0: total 1.</li>
      <li>Try <code>k = 0.005</code>: predictions 5, 10, 2.5. Errors 1, 1, 0.5: total 2.5.</li>
      <li>The lowest total error is at <code>k = 0.004</code>, so that's our trained parameter. For a new 1500-word article the model predicts 6 minutes.</li></ol>
      <p>Real models work the same way at a vastly bigger scale: billions of parameters instead of one, billions of examples instead of three, and a clever method called <i>gradient descent</i> that works out which way to nudge every parameter instead of trying values one by one. The idea is identical: <b>adjust the numbers to reduce the error on examples</b>.</p>`,
    example: `# Training data: (words, minutes it actually took)
articles = [(1000, 4), (2000, 9), (500, 2)]

def guess_minutes(words, k):      # the model: one parameter, k
    return words * k

def how_wrong(k):                  # total error over all examples
    total = 0
    for words, minutes in articles:
        total = total + abs(guess_minutes(words, k) - minutes)
    return total

for k in [0.003, 0.004, 0.005]:    # "training" by trying values
    print("k =", k, "total error =", how_wrong(k))

print("1500 words takes about", guess_minutes(1500, 0.004), "minutes")   # inference
`,
    cards: [
      ["What is a model's parameter?", "A number inside the model that controls its predictions. Training finds good values for the parameters; big models have billions of them."],
      ["Training vs inference?", "Training adjusts the parameters using examples with known answers. Inference uses the finished model to predict answers for new inputs."],
    ],
    exercises: [
      { key: "predict", prompt: "A model predicts a restaurant tip from the bill: tip = bill × rate, where rate is the model's one parameter. Write predict_tip(bill, rate) that returns the predicted tip.",
        example: "predict_tip(50, 0.15) returns 7.5",
        hint: "Multiply the two inputs: `return bill * rate`.",
        starter: "def predict_tip(bill, rate):\n    pass\n",
        tests: `assert predict_tip(50, 0.15) == 7.5, f"predict_tip(50, 0.15) should be 7.5, got {predict_tip(50, 0.15)}"
assert predict_tip(100, 0.2) == 20
assert predict_tip(0, 0.18) == 0`,
        solution: `def predict_tip(bill, rate):
    return bill * rate` },
      { key: "error", prompt: "Write error(predicted, actual) that returns how far a prediction is from the right answer, always as a positive number (or 0 when it's exactly right).",
        example: "error(7, 10) returns 3\nerror(10, 7) returns 3\nerror(5, 5) returns 0",
        hint: "Subtract, then use `abs(...)` to drop the minus sign: `abs(predicted - actual)`.",
        starter: "def error(predicted, actual):\n    pass\n",
        tests: `assert error(7, 10) == 3, f"error(7, 10) should be 3, got {error(7, 10)}"
assert error(10, 7) == 3, "the error is never negative"
assert error(5, 5) == 0`,
        solution: `def error(predicted, actual):
    return abs(predicted - actual)` },
      { key: "total-error", prompt: "Write total_error(rate, examples). examples is a list of (bill, tip) pairs from real meals. For each pair, predict the tip as bill × rate and measure the error against the real tip; return the sum of all the errors.",
        example: "total_error(0.1, [(100, 15), (40, 4)]) returns 5.0\n(predictions 10 and 4; errors 5 and 0)",
        hint: "A running total. Loop with `for bill, tip in examples:` and add `abs(bill * rate - tip)` each time. (Each exercise runs on its own, so write the calculation here rather than calling your earlier functions.)",
        starter: "def total_error(rate, examples):\n    pass\n",
        tests: `assert abs(total_error(0.1, [(100, 15), (40, 4)]) - 5) < 1e-9, f"got {total_error(0.1, [(100, 15), (40, 4)])}"
assert abs(total_error(0.15, [(100, 15), (40, 6)])) < 1e-9, "a perfect rate has total error 0"
assert total_error(0.2, []) == 0, "no examples, no error"`,
        solution: `def total_error(rate, examples):
    total = 0
    for bill, tip in examples:
        total = total + abs(bill * rate - tip)
    return total` },
      { key: "train", prompt: "Now train the model. Write best_rate(rates, examples): try every rate in the list and return the one with the smallest total error on the examples. If two tie, return the one that comes first.",
        example: "best_rate([0.1, 0.15, 0.2], [(100, 15), (40, 6)]) returns 0.15",
        hint: "Keep the best rate so far and its error. For each rate, work out its total error (a loop inside the loop, as in the last exercise). If it's smaller than the best error so far, remember this rate. Start the best error at `None` and treat None as \"nothing yet\", or start it with the first rate's error.",
        starter: "def best_rate(rates, examples):\n    pass\n",
        tests: `data = [(100, 15), (40, 6), (60, 9)]
assert best_rate([0.1, 0.15, 0.2], data) == 0.15, f"0.15 fits these meals exactly; got {best_rate([0.1, 0.15, 0.2], data)}"
assert best_rate([0.25, 0.2], [(100, 21)]) == 0.2
assert best_rate([0.1, 0.3], [(10, 2)]) == 0.1, "a tie goes to the first rate"`,
        solution: `def best_rate(rates, examples):
    best = None
    best_error = None
    for rate in rates:
        total = 0
        for bill, tip in examples:
            total = total + abs(bill * rate - tip)
        if best_error is None or total < best_error:
            best = rate
            best_error = total
    return best` },
    ],
  },
  {
    id: "az-ml", zero: "ai", title: "Machine learning: learning patterns from examples", yt: "machine learning explained simply for beginners",
    videos: [IBM("9gGnTQTYNaE", "What is Machine Learning?")],
    body: `<p><b>Machine learning</b> (ML) is the craft of building models by letting them learn patterns from examples, instead of writing the rules yourself. You saw the core idea in the last lesson; this one adds the vocabulary and two classic ways to learn.</p>
      <h3>Rules vs learning</h3>
      <p>To flag spam by hand, you'd write rules: "if the email contains 'free money', it's spam". Spammers change their wording and your rules fall behind. With ML you collect thousands of emails already marked spam or not spam, and the model finds the patterns itself.</p>
      <h3>The vocabulary</h3>
      <ul><li><b>Features</b>: the inputs the model looks at, usually numbers. For a house: its size and number of bedrooms.</li>
      <li><b>Label</b>: the right answer for an example: the house's sale price, or "spam".</li>
      <li><b>Supervised learning</b>: learning from examples that have labels. Most of what you'll meet is this.</li>
      <li><b>Classification</b> predicts a category ("spam" or "not spam"). <b>Regression</b> predicts a number (a price).</li></ul>
      <h3>Way 1: nearest neighbour</h3>
      <p>The simplest learner just remembers the examples. To predict for a new input, find the example whose features are <b>closest</b> and copy its label. For one feature, "closest" is the smallest difference. For two features, picture each example as a point on a map, with one feature across and one up, and use the straight-line distance between points: for points (x1, y1) and (x2, y2) that's the square root of (x1 - x2)&sup2; + (y1 - y2)&sup2;. In Python, <code>**</code> raises to a power: <code>3 ** 2</code> is 9, and <code>9 ** 0.5</code> is the square root, 3.0.</p>
      <h3>Way 2: fitting a line</h3>
      <p>For regression with one feature, a model can be a straight line: <i>prediction = slope &times; x + intercept</i>. The slope says how much the prediction grows for each extra unit of x; the intercept is the prediction at x = 0. "Fitting" the line means choosing the slope and intercept with the smallest error on the examples. There's a standard recipe (the <i>least squares</i> line) that uses only averages, multiplying and dividing; the last exercise walks you through it.</p>
      <h3>Testing on examples the model hasn't seen</h3>
      <p>A model can score perfectly on its training examples just by memorizing them, and then fail on anything new. That's called <b>overfitting</b>. So before training, put some labelled examples aside as <b>test data</b>, train on the rest, and measure on the test data. To take part of a list, use <b>slicing</b>: <code>items[:3]</code> is the first three items, <code>items[3:]</code> is everything from position 3 on.</p>
      <h3>Worked example: guessing a price from the nearest house</h3>
      <ol><li>We know three houses: 50 m&sup2; sold for $400k, 80 m&sup2; for $600k, 120 m&sup2; for $850k.</li>
      <li>A new house is 75 m&sup2;. Its differences from the known sizes are 25, 5 and 45.</li>
      <li>The smallest difference is 5, the 80 m&sup2; house, so we guess $600k.</li></ol>`,
    example: `sizes = [50, 80, 120]          # feature: square metres
prices = [400, 600, 850]       # label: price in $1000s
new_size = 75

closest = 0                     # position of the closest house so far
for i in range(len(sizes)):
    gap = abs(sizes[i] - new_size)
    print("house", i, "is", gap, "m2 away")
    if gap < abs(sizes[closest] - new_size):
        closest = i
print("guess:", prices[closest])   # 600

print(3 ** 2, 9 ** 0.5)        # 9 3.0
print(sizes[:2], sizes[2:])    # [50, 80] [120]
`,
    cards: [
      ["Classification or regression: predicting tomorrow's temperature?", "Regression: the answer is a number. Predicting 'rain' or 'no rain' would be classification."],
      ["Why keep test data aside?", "To measure how the model does on examples it never saw in training. A model can memorize its training data (overfitting) and still fail on new inputs."],
    ],
    exercises: [
      { key: "distance", prompt: "Write distance(p, q) for two points given as (x, y) pairs. Return the straight-line distance: the square root of (x1 - x2)² + (y1 - y2)².",
        example: "distance((0, 0), (3, 4)) returns 5.0",
        hint: "Unpack the pairs first: `x1, y1 = p` and `x2, y2 = q`. Then `((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5`.",
        starter: "def distance(p, q):\n    pass\n",
        tests: `assert distance((0, 0), (3, 4)) == 5, f"distance((0, 0), (3, 4)) should be 5, got {distance((0, 0), (3, 4))}"
assert distance((1, 1), (1, 1)) == 0, "a point is 0 away from itself"
assert distance((2, 5), (-1, 1)) == 5`,
        solution: `def distance(p, q):
    x1, y1 = p
    x2, y2 = q
    return ((x1 - x2) ** 2 + (y1 - y2) ** 2) ** 0.5` },
      { key: "nearest", prompt: "Write nearest_label(point, examples). Each example is a pair: ((x, y), label). Return the label of the example closest to point. If two are equally close, use the first.",
        example: `examples = [((1, 1), "apple"), ((8, 9), "melon")]\nnearest_label((2, 1), examples) returns "apple"`,
        hint: "Loop with `for (x, y), label in examples:`. Work out the distance to point (the formula from the last exercise), and keep the label with the smallest distance so far. Only replace it when a distance is strictly smaller, so ties keep the first.",
        starter: "def nearest_label(point, examples):\n    pass\n",
        tests: `fruit = [((1, 1), "apple"), ((8, 9), "melon"), ((2, 3), "pear")]
assert nearest_label((2, 1), fruit) == "apple", f"got {nearest_label((2, 1), fruit)!r}"
assert nearest_label((7, 7), fruit) == "melon"
assert nearest_label((2, 4), fruit) == "pear"
assert nearest_label((0, 0), [((1, 0), "a"), ((0, 1), "b")]) == "a", "a tie goes to the first example"`,
        solution: `def nearest_label(point, examples):
    px, py = point
    best_label = None
    best_dist = None
    for (x, y), label in examples:
        d = ((x - px) ** 2 + (y - py) ** 2) ** 0.5
        if best_dist is None or d < best_dist:
            best_label = label
            best_dist = d
    return best_label` },
      { key: "split", prompt: "Write split_data(examples, n_test) that returns two lists, (train, test): test is the last n_test examples, train is everything before them. n_test can be 0.",
        example: "split_data([1, 2, 3, 4, 5], 2) returns ([1, 2, 3], [4, 5])\nsplit_data([1, 2, 3], 0) returns ([1, 2, 3], [])",
        hint: "Work out where the test part starts: `cut = len(examples) - n_test`. Then slice: `examples[:cut]` and `examples[cut:]`. Return both with `return train, test`. (Watch out: `examples[-0:]` is the whole list, which is why the cut position is safer.)",
        starter: "def split_data(examples, n_test):\n    pass\n",
        tests: `assert split_data([1, 2, 3, 4, 5], 2) == ([1, 2, 3], [4, 5]), f"got {split_data([1, 2, 3, 4, 5], 2)}"
assert split_data([1, 2, 3], 0) == ([1, 2, 3], []), "n_test = 0 keeps everything for training"
assert split_data(["a", "b"], 2) == ([], ["a", "b"])`,
        solution: `def split_data(examples, n_test):
    cut = len(examples) - n_test
    return examples[:cut], examples[cut:]` },
      { key: "fit-line", prompt: "Fit a line to points. Write fit_line(xs, ys) returning (slope, intercept). The recipe: mx and my are the averages of xs and ys. slope = (sum of (x - mx) × (y - my) over all points) / (sum of (x - mx)² over all points). intercept = my - slope × mx.",
        example: "fit_line([1, 2, 3], [3, 5, 7]) returns (2.0, 1.0)\n(the points lie exactly on y = 2x + 1)",
        hint: "Averages first: `mx = sum(xs) / len(xs)` (and the same for ys). Then loop `for i in range(len(xs)):` and keep two running totals, `top = top + (xs[i] - mx) * (ys[i] - my)` and `bottom = bottom + (xs[i] - mx) ** 2`. slope is top / bottom.",
        starter: "def fit_line(xs, ys):\n    pass\n",
        tests: `slope, intercept = fit_line([1, 2, 3], [3, 5, 7])
assert abs(slope - 2) < 1e-9 and abs(intercept - 1) < 1e-9, f"expected (2.0, 1.0), got {(slope, intercept)}"
slope, intercept = fit_line([0, 2, 4], [1, 2, 3])
assert abs(slope - 0.5) < 1e-9 and abs(intercept - 1) < 1e-9
slope, intercept = fit_line([1, 2, 3, 4], [2, 3, 5, 6])
assert abs(slope - 1.4) < 1e-9 and abs(intercept - 0.5) < 1e-9, "points not exactly on a line still get the best-fitting one"`,
        solution: `def fit_line(xs, ys):
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    top = 0
    bottom = 0
    for i in range(len(xs)):
        top = top + (xs[i] - mx) * (ys[i] - my)
        bottom = bottom + (xs[i] - mx) ** 2
    slope = top / bottom
    return slope, my - slope * mx` },
    ],
  },
  {
    id: "az-llm", zero: "ai", title: "What an LLM does: predicting the next token", yt: "how large language models work explained simply",
    videos: [V("LPZh9BOjkQs", "Large Language Models explained briefly", "3Blue1Brown"), IBM("5sLYAQS9sWQ", "How Large Language Models Work")],
    body: `<p>An <b>LLM</b> (large language model) is the kind of model behind chat assistants such as Claude and ChatGPT. It sounds magical, but its core job is simple to state: <b>given some text, predict what comes next</b>.</p>
      <h3>One piece at a time</h3>
      <p>An LLM reads and writes text in small pieces called <b>tokens</b>. A token is often a whole common word ("the", "cat") or part of a longer word; the next lesson, <button class="link-btn inline-link" data-trgo="ai|learn|az-tokens">Tokens and the context window</button>, covers them properly. For now, think "word".</p>
      <p>For the text so far, the model gives every possible next token a <b>probability</b>: a number from 0 (impossible) to 1 (certain), where all the options add up to 1. After "The cat sat on the", "mat" might get 0.4, "floor" 0.2, "sofa" 0.1, and so on.</p>
      <h3>Generating text is a loop</h3>
      <ol><li>Look at the text so far and get the probabilities for the next token.</li>
      <li>Pick one token.</li>
      <li>Add it to the end of the text.</li>
      <li>Repeat, until the model picks a special "stop" token or hits a length limit.</li></ol>
      <p>That's all generation is. A long answer is thousands of single-token predictions, each one looking at everything written before it, including its own earlier tokens.</p>
      <h3>How it picks</h3>
      <p>Always taking the most likely token is called <b>greedy</b> picking. It's predictable but can be dull and repetitive, so models usually <i>sample</i>: pick at random, but weighted by the probabilities, so "mat" is chosen 40% of the time. A setting called <b>temperature</b> controls how adventurous that picking is: low temperature sticks to the likeliest tokens, high temperature takes more chances. That's why the same question can get different answers each time. The maths is in a later lesson, <button class="link-btn inline-link" data-trgo="ai|learn|sampling">Sampling in depth</button>.</p>
      <h3>Where the probabilities come from</h3>
      <p>Training. The model is shown enormous amounts of text and, at every position, asked to predict the next token; its parameters are adjusted to reduce the error, exactly as in <button class="link-btn inline-link" data-trgo="ai|learn|az-model">What a model is</button>. Your exercises build a tiny version: it learns by <i>counting</i> which word follows which in a sentence. A real LLM is far cleverer about context, but it's the same game.</p>
      <h3>Why LLMs make things up</h3>
      <p>The model predicts <i>likely-sounding</i> text; nothing in the loop checks facts. When it doesn't know, it can produce a fluent, confident and wrong answer. This is called a <b>hallucination</b>, and much of AI engineering (later topics) is about reducing and catching it.</p>
      <h3>Worked example: one prediction step</h3>
      <p>The table below is a pretend model. For each word it lists the possible next words with their probabilities. To predict after "the", we look up <code>table["the"]</code> and take the word with the highest probability. Python's <code>max(options, key=options.get)</code> does that in one step: it compares the keys by their values. Your exercises write the full loop.</p>`,
    example: `# A pretend model: for each word, the next words it could predict and their probabilities
table = {
    "the": {"cat": 0.5, "dog": 0.3, "end": 0.2},
    "cat": {"sat": 0.7, "ran": 0.3},
    "sat": {"down": 0.9, "up": 0.1},
}
options = table["the"]
print("after 'the' the model predicts:", options)
print("probabilities add up to", sum(options.values()))

best = max(options, key=options.get)   # the word with the highest probability
print("greedy pick:", best)            # cat
`,
    cards: [
      ["In one sentence, what does an LLM do?", "It predicts the next token of text from everything before it, adds it, and repeats, which is how it writes a whole answer."],
      ["What is a hallucination?", "Fluent, confident output that's false or unsupported, because the model predicts likely text rather than checking facts."],
    ],
    exercises: [
      { key: "most-likely", prompt: "Write most_likely(options): options is a dictionary mapping each possible next word to its probability. Return the word with the highest probability (the greedy pick). If two tie, return the one that comes first in the dictionary.",
        example: `most_likely({"mat": 0.4, "floor": 0.2, "sofa": 0.1}) returns "mat"`,
        hint: "Loop `for word, p in options.items():` and keep the best word and best probability so far; replace them only when p is strictly bigger.",
        starter: "def most_likely(options):\n    pass\n",
        tests: `assert most_likely({"mat": 0.4, "floor": 0.2, "sofa": 0.1}) == "mat"
assert most_likely({"a": 0.1, "b": 0.6, "c": 0.3}) == "b"
assert most_likely({"x": 0.5, "y": 0.5}) == "x", "a tie goes to the first word"`,
        solution: `def most_likely(options):
    best = None
    best_p = -1
    for word, p in options.items():
        if p > best_p:
            best = word
            best_p = p
    return best` },
      { key: "probabilities", prompt: "Turn counts into probabilities. Write to_probabilities(counts): counts maps words to how many times they were seen. Return a new dictionary with each count divided by the total of all counts, so the values add up to 1.",
        example: `to_probabilities({"mat": 3, "floor": 1}) returns {"mat": 0.75, "floor": 0.25}`,
        hint: "First the total: `total = sum(counts.values())`. Then build a new dict in a loop: `probs[word] = count / total`.",
        starter: "def to_probabilities(counts):\n    pass\n",
        tests: `assert to_probabilities({"mat": 3, "floor": 1}) == {"mat": 0.75, "floor": 0.25}
p = to_probabilities({"a": 1, "b": 1, "c": 2})
assert p == {"a": 0.25, "b": 0.25, "c": 0.5}
assert abs(sum(p.values()) - 1) < 1e-9, "probabilities add up to 1"`,
        solution: `def to_probabilities(counts):
    total = sum(counts.values())
    probs = {}
    for word, count in counts.items():
        probs[word] = count / total
    return probs` },
      { key: "next-counts", prompt: "Train a tiny language model by counting. Write count_next(words): words is a list of words in order. Return a dictionary where each word maps to another dictionary counting the words that came straight after it.",
        example: `count_next(["the", "cat", "the", "dog", "the", "cat"]) returns\n{"the": {"cat": 2, "dog": 1}, "cat": {"the": 1}, "dog": {"the": 1}}`,
        hint: "Loop over positions with `for i in range(len(words) - 1):` so `words[i + 1]` always exists. Take `w = words[i]` and `nxt = words[i + 1]`. If w isn't a key yet, set `table[w] = {}`. Then count nxt inside `table[w]` with the counting pattern.",
        starter: "def count_next(words):\n    pass\n",
        tests: `assert count_next(["the", "cat", "the", "dog", "the", "cat"]) == {"the": {"cat": 2, "dog": 1}, "cat": {"the": 1}, "dog": {"the": 1}}
assert count_next(["hi"]) == {}, "one word has nothing after it"
assert count_next(["a", "a", "a"]) == {"a": {"a": 2}}`,
        solution: `def count_next(words):
    table = {}
    for i in range(len(words) - 1):
        w = words[i]
        nxt = words[i + 1]
        if w not in table:
            table[w] = {}
        table[w][nxt] = table[w].get(nxt, 0) + 1
    return table` },
      { key: "generate", prompt: "Write the generation loop. generate(table, start, n): table maps each word to a dictionary of next-word probabilities (or counts). Starting from start, pick the most likely next word n times, adding each to the list. Return the list of words, starting with start. Stop early if the current word isn't in the table.",
        example: `table = {"the": {"cat": 0.6, "dog": 0.4}, "cat": {"sat": 1.0}}\ngenerate(table, "the", 3) returns ["the", "cat", "sat"]\n(it stops after "sat": the table has nothing for it)`,
        hint: "Start with `words = [start]`. Loop `for i in range(n):`. Let `current = words[-1]`; if it's not in table, `break` (that ends the loop early). Otherwise pick the best next word from `table[current]` (as in exercise 1, or with `max(options, key=options.get)`) and append it.",
        starter: "def generate(table, start, n):\n    pass\n",
        tests: `table = {"the": {"cat": 0.6, "dog": 0.4}, "cat": {"sat": 1.0}}
assert generate(table, "the", 3) == ["the", "cat", "sat"], f"got {generate(table, 'the', 3)}"
assert generate(table, "the", 1) == ["the", "cat"], "n is how many words to add"
assert generate(table, "dog", 5) == ["dog"], "no entry for the start word: just the start"
loop = {"a": {"b": 1}, "b": {"a": 1}}
assert generate(loop, "a", 4) == ["a", "b", "a", "b", "a"]`,
        solution: `def generate(table, start, n):
    words = [start]
    for i in range(n):
        current = words[-1]
        if current not in table:
            break
        options = table[current]
        words.append(max(options, key=options.get))
    return words` },
    ],
  },
  {
    id: "az-tokens", zero: "ai", title: "Tokens and the context window", yt: "what are tokens in LLMs explained simply",
    videos: [IBM("-QVoIxEpFkM", "What is a Context Window? Unlocking LLM Secrets")],
    body: `<p>LLMs don't see letters or whole sentences. They see <b>tokens</b>, and almost everything practical about them (price, speed and how much text they can handle) is counted in tokens.</p>
      <h3>What a token is</h3>
      <p>A <b>tokenizer</b> is the part of the system that cuts text into tokens before the model sees it, and turns the model's output tokens back into text. Common words are usually one token ("the", "house"). Rare or long words are split into pieces ("tokenization" might be "token" + "ization"). Punctuation is usually its own token, and the space before a word is often part of that word's token.</p>
      <p>A handy rule of thumb for English: <b>one token is about 4 characters, or about three quarters of a word</b>. So 100 words is roughly 130 tokens. Code, numbers and many other languages use more tokens per word. Each model family has its own tokenizer, so exact counts differ; providers offer tools to count precisely.</p>
      <h3>Why tokens matter</h3>
      <ul><li><b>Cost:</b> you pay per token, for what you send in and what comes back.</li>
      <li><b>Speed:</b> the model writes one token at a time, so longer answers take longer.</li>
      <li><b>Limits:</b> the context window, below.</li>
      <li><b>Odd mistakes:</b> because models see tokens, not letters, a question like "how many r's are in strawberry?" is surprisingly hard for them.</li></ul>
      <h3>The context window</h3>
      <p>The <b>context window</b> is the maximum number of tokens a model can work with at once: <b>everything you send plus the answer it writes</b>. If a model has a 200,000-token window and you send 150,000 tokens, at most 50,000 are left for the reply. Send too much and the request is rejected.</p>
      <p>Anything outside the context window, the model simply doesn't know about. It has no memory between requests: a chat app makes the model "remember" the conversation by sending the earlier messages again each time. When a conversation gets too long, the app has to drop or shorten the oldest parts, which is why long chats can "forget" what was said at the start.</p>
      <h3>Worked example: estimating with the rules of thumb</h3>
      <ol><li>A paragraph has 60 words. By the "three quarters of a word" rule that's about 60 &times; 4 / 3 = 80 tokens.</li>
      <li>A small model has a 1,000-token window and we want up to 300 tokens of answer. That leaves 700 tokens for our input.</li>
      <li>So we can send about 8 such paragraphs (8 &times; 80 = 640), not 9 (720).</li></ol>`,
    example: `text = "The quick brown fox jumps over the lazy dog. It was not amused!"
words = text.split()
print(len(words), "words,", len(text), "characters")
estimate = len(words) * 4 / 3        # about 3/4 of a word per token
print("about", round(estimate), "tokens")

window = 1000                         # the model's context window
answer_room = 300                     # tokens we keep free for the reply
per_paragraph = 80
print("paragraphs that fit:", (window - answer_room) // per_paragraph)   # 8
`,
    cards: [
      ["Roughly how many tokens is 300 English words?", "About 400: a token is about three quarters of a word, or 4 characters."],
      ["What counts against the context window?", "Everything the model works with in one request: the system instructions, the conversation history, any documents, and the answer it writes."],
    ],
    exercises: [
      { key: "estimate", prompt: "Write rough_tokens(text) that estimates the number of tokens with the 4-characters rule: the number of characters divided by 4, rounded up to a whole number.",
        example: `rough_tokens("abcd") returns 1\nrough_tokens("abcde") returns 2\nrough_tokens("") returns 0`,
        hint: "Rounding up a division by 4 has a neat trick with `//` (which rounds down): add 3 first. `(len(text) + 3) // 4`.",
        starter: "def rough_tokens(text):\n    pass\n",
        tests: `assert rough_tokens("abcd") == 1
assert rough_tokens("abcde") == 2, "5 characters is more than one token's worth, so round up to 2"
assert rough_tokens("") == 0
assert rough_tokens("x" * 400) == 100`,
        solution: `def rough_tokens(text):
    return (len(text) + 3) // 4` },
      { key: "fits", prompt: "Write fits(input_tokens, max_output, window) that returns True if the input plus the space kept for the answer fits in the context window, and False otherwise.",
        example: "fits(700, 300, 1000) returns True\nfits(701, 300, 1000) returns False",
        hint: "Add the two and compare: `input_tokens + max_output <= window`. Exactly full still fits.",
        starter: "def fits(input_tokens, max_output, window):\n    pass\n",
        tests: `assert fits(700, 300, 1000) is True, "exactly full still fits"
assert fits(701, 300, 1000) is False
assert fits(10, 10, 200000) is True`,
        solution: `def fits(input_tokens, max_output, window):
    return input_tokens + max_output <= window` },
      { key: "split-tokens", prompt: "Write a toy tokenizer. split_tokens(text) returns a list where each word is a token and each punctuation mark (. , ! ?) is its own token. Spaces separate tokens but aren't tokens themselves.",
        example: `split_tokens("Hi, Bob!") returns ["Hi", ",", "Bob", "!"]`,
        hint: "Go through the text one character at a time with `for ch in text:`, building the current word in a variable that starts as `\"\"`. On a space or punctuation mark, if the current word isn't empty, append it and reset it; then, for punctuation, append the mark too. Otherwise add ch to the current word. After the loop, don't forget a last word.",
        starter: "def split_tokens(text):\n    pass\n",
        tests: `assert split_tokens("Hi, Bob!") == ["Hi", ",", "Bob", "!"], f"got {split_tokens('Hi, Bob!')}"
assert split_tokens("one two") == ["one", "two"], "the last word counts too"
assert split_tokens("Wait... what?") == ["Wait", ".", ".", ".", "what", "?"]
assert split_tokens("") == []`,
        solution: `def split_tokens(text):
    tokens = []
    word = ""
    for ch in text:
        if ch == " " or ch in ".,!?":
            if word != "":
                tokens.append(word)
                word = ""
            if ch != " ":
                tokens.append(ch)
        else:
            word = word + ch
    if word != "":
        tokens.append(word)
    return tokens` },
      { key: "keep-last", prompt: "When a conversation is too long, apps keep the most recent part. Write keep_last(tokens, window) that returns the last window tokens of the list (or the whole list if it's shorter). window can be 0.",
        example: `keep_last(["a", "b", "c", "d"], 2) returns ["c", "d"]\nkeep_last(["a"], 5) returns ["a"]\nkeep_last(["a", "b"], 0) returns []`,
        hint: "Slicing from a position keeps everything after it. The cut is at `len(tokens) - window`, but it can't go below 0: use `max(0, len(tokens) - window)`.",
        starter: "def keep_last(tokens, window):\n    pass\n",
        tests: `assert keep_last(["a", "b", "c", "d"], 2) == ["c", "d"]
assert keep_last(["a"], 5) == ["a"], "a short list is kept whole"
assert keep_last(["a", "b"], 0) == [], "a window of 0 keeps nothing"`,
        solution: `def keep_last(tokens, window):
    cut = max(0, len(tokens) - window)
    return tokens[cut:]` },
    ],
  },
  {
    id: "az-api", zero: "ai", title: "Calling a model: request in, response out", yt: "what is an API explained simply",
    videos: [IBM("lsMQRaeKNDk", "What is a REST API?")],
    body: `<p>Big models run on the provider's computers, not yours. Your program talks to them through an <b>API</b> (application programming interface): an agreed way for one program to ask another to do something, here over the internet. You send a <b>request</b>; you get back a <b>response</b>.</p>
      <h3>What a request looks like</h3>
      <p>Requests and responses travel as <b>JSON</b>, a text format for data that looks almost exactly like Python dictionaries and lists. A request to a chat model says:</p>
      <ul><li><b>model</b>: which model to use.</li>
      <li><b>max_tokens</b>: the most tokens the answer may use. It caps cost and length.</li>
      <li><b>messages</b>: the conversation so far, as a list. Each message has a <b>role</b> (<code>"user"</code> for you, <code>"assistant"</code> for the model) and its <b>content</b> (the text).</li></ul>
      <h3>What comes back</h3>
      <ul><li><b>content</b>: a list of blocks; the answer's text is in the first block's <code>"text"</code>.</li>
      <li><b>stop_reason</b>: why it stopped. <code>"end_turn"</code> means it finished; <code>"max_tokens"</code> means it hit your cap and the answer was <b>cut off</b>.</li>
      <li><b>usage</b>: how many tokens went in (<code>input_tokens</code>) and came out (<code>output_tokens</code>). That's what you're billed for.</li></ul>
      <h3>Cost, keys and waiting</h3>
      <p>Providers price models <b>per million tokens</b>, with output tokens costing more than input. For example, at $3 per million input tokens and $15 per million output tokens, a request with 2,000 tokens in and 500 out costs 2,000 &times; 3 / 1,000,000 + 500 &times; 15 / 1,000,000 = $0.0135. Small per call, but it adds up across thousands of calls, so set a spending limit in the provider's console.</p>
      <p>To use a real API you need an <b>API key</b>: a long secret string that works like a password for your account (and its bill). Keep it out of your code and out of git; the projects show how. <b>You don't need one for this course's lessons</b>: the exercises use a pretend model written in Python that answers from a lookup table.</p>
      <p>Each call also takes time: the <b>latency</b>, how long you wait for the answer. It grows with the length of the answer, since tokens are written one at a time.</p>
      <h3>Worked example</h3>
      <p>The example builds a request as a dictionary, sends it to <code>fake_model</code> (a stand-in for the real API that looks up canned answers), then reads the text, the stop reason and the token counts out of the response, and works out the cost. The real thing, in <button class="link-btn inline-link" data-trgo="ai|learn|apis">Calling LLM APIs</button>, has exactly this shape.</p>`,
    example: `def fake_model(request):          # stands in for the provider's API
    answers = {"What is RAG?": "Retrieval-augmented generation: look things up, then answer."}
    question = request["messages"][-1]["content"]
    text = answers.get(question, "I don't know.")
    return {
        "content": [{"type": "text", "text": text}],
        "stop_reason": "end_turn",
        "usage": {"input_tokens": len(question) // 4 + 1, "output_tokens": len(text) // 4 + 1},
    }

request = {
    "model": "tiny-model",
    "max_tokens": 200,
    "messages": [{"role": "user", "content": "What is RAG?"}],
}
response = fake_model(request)
print(response["content"][0]["text"])
print("stopped because:", response["stop_reason"])
usage = response["usage"]
cost = usage["input_tokens"] * 3 / 1_000_000 + usage["output_tokens"] * 15 / 1_000_000
print(usage, "cost: $" + str(round(cost, 6)))
`,
    cards: [
      ["A response's stop_reason is 'max_tokens'. What happened?", "The answer hit the max_tokens cap you set and was cut off. Raise the cap or ask for a shorter answer."],
      ["Why keep an API key out of your code?", "It's a password to your paid account. Code gets shared and pushed to git, and anyone with the key can run up your bill."],
    ],
    exercises: [
      { key: "request", prompt: "Write make_request(question, max_tokens=100) that returns a request dictionary with three keys: \"model\" set to \"tiny-model\", \"max_tokens\" set to max_tokens, and \"messages\" set to a list holding one message: a dictionary with \"role\" \"user\" and \"content\" the question.",
        example: `make_request("Hi") returns\n{"model": "tiny-model", "max_tokens": 100, "messages": [{"role": "user", "content": "Hi"}]}`,
        hint: "`max_tokens=100` in the brackets means the parameter is 100 unless the caller passes another value. Return one dictionary literal; the messages value is a list with one dict inside: `[{\"role\": \"user\", \"content\": question}]`.",
        starter: "def make_request(question, max_tokens=100):\n    pass\n",
        tests: `assert make_request("Hi") == {"model": "tiny-model", "max_tokens": 100, "messages": [{"role": "user", "content": "Hi"}]}, f"got {make_request('Hi')}"
assert make_request("Why?", 50)["max_tokens"] == 50
assert make_request("Why?")["messages"][0]["content"] == "Why?"`,
        solution: `def make_request(question, max_tokens=100):
    return {
        "model": "tiny-model",
        "max_tokens": max_tokens,
        "messages": [{"role": "user", "content": question}],
    }` },
      { key: "reply-text", prompt: "Write reply_text(response) that returns the answer's text from a response: the \"text\" of the first block in the \"content\" list.",
        example: `reply_text({"content": [{"type": "text", "text": "Hello!"}], "stop_reason": "end_turn"}) returns "Hello!"`,
        hint: "Go one step at a time: `response[\"content\"]` is a list, `[0]` takes its first block, and `[\"text\"]` takes the text from that block.",
        starter: "def reply_text(response):\n    pass\n",
        tests: `r = {"content": [{"type": "text", "text": "Hello!"}], "stop_reason": "end_turn", "usage": {"input_tokens": 3, "output_tokens": 2}}
assert reply_text(r) == "Hello!", f"got {reply_text(r)!r}"
assert reply_text({"content": [{"type": "text", "text": "42"}]}) == "42"`,
        solution: `def reply_text(response):
    return response["content"][0]["text"]` },
      { key: "cut-off", prompt: "Write was_cut_off(response) that returns True if the answer was cut off because it hit max_tokens, and False otherwise.",
        example: `was_cut_off({"stop_reason": "max_tokens"}) returns True\nwas_cut_off({"stop_reason": "end_turn"}) returns False`,
        hint: "Compare the stop reason with the text \"max_tokens\": `response[\"stop_reason\"] == \"max_tokens\"`.",
        starter: "def was_cut_off(response):\n    pass\n",
        tests: `assert was_cut_off({"stop_reason": "max_tokens"}) is True
assert was_cut_off({"stop_reason": "end_turn"}) is False`,
        solution: `def was_cut_off(response):
    return response["stop_reason"] == "max_tokens"` },
      { key: "budget", prompt: "Write calls_in_budget(budget, tokens_per_call, price_per_million) that returns how many whole calls you can afford: each call uses tokens_per_call tokens, priced at price_per_million dollars per million tokens, and budget is in dollars.",
        example: "calls_in_budget(10, 1500, 3) returns 2222\n(each call costs 1500 × 3 / 1,000,000 = $0.0045)",
        hint: "Cost of one call: `tokens_per_call * price_per_million / 1_000_000`. Then whole calls: `int(budget / cost)` (int drops the part after the decimal point).",
        starter: "def calls_in_budget(budget, tokens_per_call, price_per_million):\n    pass\n",
        tests: `assert calls_in_budget(10, 1500, 3) == 2222, f"got {calls_in_budget(10, 1500, 3)}"
assert calls_in_budget(1, 3000, 15) == 22
assert calls_in_budget(0, 1000, 3) == 0
assert type(calls_in_budget(10, 1500, 3)) is int, "return a whole number"`,
        solution: `def calls_in_budget(budget, tokens_per_call, price_per_million):
    cost = tokens_per_call * price_per_million / 1_000_000
    return int(budget / cost)` },
    ],
  },
  {
    id: "toolkit", zero: "ai", title: "Developer toolkit: terminal, Git, secrets, JSON and HTTP", yt: "command line git environment variables beginners tutorial",
    body: `<p>Every project in this course, and every take-home assignment you'll get in interviews, is the same shape: a folder of code kept in <b>Git</b>, run from a <b>terminal</b>, holding a secret <b>API key</b> that must never be shared, and talking to a model over <b>HTTP</b> in <b>JSON</b>. This lesson covers the few tools you need for that, with an example of each.</p>
      <h3>The terminal</h3>
      <p>The <b>terminal</b> (also called the command line or shell) is a text window where you type commands instead of clicking. It always has a <b>current folder</b>, and commands act on it. The handful you'll use constantly:</p>
      <table><tr><th>Command</th><th>What it does</th></tr>
      <tr><td><code>cd projects/chat</code></td><td>Change into a folder (<code>cd ..</code> goes up one)</td></tr>
      <tr><td><code>ls</code> (macOS, Linux) or <code>dir</code> (Windows)</td><td>List the files in the current folder</td></tr>
      <tr><td><code>python app.py</code></td><td>Run a Python script</td></tr>
      <tr><td><code>python -m venv .venv</code></td><td>Create a <b>virtual environment</b>: a private folder of installed packages for this one project, so projects don't break each other</td></tr>
      <tr><td><code>source .venv/bin/activate</code> (macOS, Linux) or <code>.venv&#92;Scripts&#92;activate</code> (Windows)</td><td>Switch the terminal to use that environment</td></tr>
      <tr><td><code>pip install anthropic</code></td><td>Install a package into the active environment; <code>pip freeze &gt; requirements.txt</code> records what you installed so others can repeat it</td></tr></table>
      <h3>Git: saving versions of your code</h3>
      <p><b>Git</b> records versions of a folder. A <b>repository</b> (repo) is a folder Git tracks; a <b>commit</b> is a saved snapshot with a message (<code>git add .</code> then <code>git commit -m "Add retry logic"</code>); <b>GitHub</b> is a website that hosts repos, and <code>git push</code> uploads your commits there. Your portfolio is a set of GitHub repos, so commit small, working steps with clear messages.</p>
      <p>A file named <b>.gitignore</b> lists paths Git must never track. Every AI project should ignore at least <code>.env</code> (your secrets), <code>.venv/</code> (installed packages, which can be recreated) and <code>__pycache__/</code> (Python's compiled files). Create it <i>before</i> your first commit: once a key is committed, it stays in the history even if you delete the file later.</p>
      <h3>Secrets and environment variables</h3>
      <p>An <b>environment variable</b> is a named setting that lives in your terminal session or server, outside your code. Programs read them at run time; in Python, <code>os.environ.get("ANTHROPIC_API_KEY")</code>. For local work, people keep them in a <b>.env file</b>, one <code>NAME=value</code> per line, loaded by a package such as <code>python-dotenv</code>. The code can then be shared freely and the key can't leak with it. If a key ever lands in git or a chat, <b>revoke it</b> in the provider's console and make a new one.</p>
      <h3>JSON and HTTP</h3>
      <p><b>JSON</b> is text that looks like Python dicts and lists (<code>{"model": "x", "max_tokens": 100}</code>); <code>json.dumps</code> turns Python data into JSON text and <code>json.loads</code> turns it back. <b>HTTP</b> is how programs talk over the web. A request has a <b>method</b> (<code>GET</code> to read, <code>POST</code> to send data), a <b>URL</b>, <b>headers</b> (labelled extra information, such as <code>content-type: application/json</code> or the API key) and a <b>body</b> (the JSON). The response has a <b>status code</b> (200 OK, 4xx your request was wrong, 5xx the server failed), headers of its own (a 429 "too many requests" often carries <code>retry-after: 30</code>, meaning wait 30 seconds) and a body.</p>
      <h3>Worked example</h3>
      <p>The example reads a pretend .env file into a dictionary (printing only the names, never the key), checks the .gitignore, then builds the HTTP request a model SDK would send for you.</p>`,
    example: `import json
NL = chr(10)

env_file = "# my secrets" + NL + "ANTHROPIC_API_KEY=sk-ant-example-123" + NL + "MODEL=claude-opus-5-5"
settings = {}
for line in env_file.split(NL):
    if line and not line.startswith("#"):
        name, value = line.split("=", 1)
        settings[name] = value
print("loaded:", sorted(settings))            # names only: never print a key

gitignore = [".env", ".venv/", "__pycache__/"]
print(".env is ignored by git:", ".env" in gitignore)

request = {
    "method": "POST",
    "url": "https://api.example.com/v1/messages",
    "headers": {"content-type": "application/json", "x-api-key": "(from the environment)"},
    "body": json.dumps({"model": settings["MODEL"], "max_tokens": 100}),
}
print(request["method"], request["url"])
print(request["body"])
`,
    cards: [
      ["Where should an API key live during development?", "In an environment variable, usually loaded from a .env file that .gitignore lists, never in the code or the repo."],
      ["You pushed a commit containing an API key. What do you do?", "Revoke the key in the provider's console and create a new one. Deleting the file or commit isn't enough: the key is in the history and may already be copied."],
    ],
    exercises: [
      { key: "parse-env", prompt: "Write parse_env(text) that reads the lines of a .env file into a dictionary. Skip blank lines, comment lines starting with #, and lines without =. Split each line at the first = only, strip spaces from the name and value, and remove one pair of matching quotes (\" or ') around the value.",
        example: `parse_env("# keys" + NL + "MODEL = small " + NL + 'GREETING="hi there"') returns\n{"MODEL": "small", "GREETING": "hi there"}`,
        hint: "Loop over `text.split(chr(10))`. `line.split(\"=\", 1)` splits at the first = only. A value is quoted when it's at least 2 characters long, its first and last characters are the same, and that character is one of `['\"', \"'\"]`; then keep `value[1:-1]`.",
        starter: "def parse_env(text):\n    pass\n",
        tests: `NL = chr(10)
text = "# keys" + NL + "ANTHROPIC_API_KEY=sk-ant-123" + NL + NL + "MODEL = small " + NL + 'GREETING="hi there"' + NL + "NAME='Ada'"
assert parse_env(text) == {"ANTHROPIC_API_KEY": "sk-ant-123", "MODEL": "small", "GREETING": "hi there", "NAME": "Ada"}, parse_env(text)
assert parse_env("URL=https://x.io/?a=1") == {"URL": "https://x.io/?a=1"}, "split at the first = only"
assert parse_env("just text") == {}, "lines without = are skipped"
assert parse_env("") == {}`,
        solution: `def parse_env(text):
    values = {}
    for line in text.split(chr(10)):
        line = line.strip()
        if line == "" or line.startswith("#") or "=" not in line:
            continue
        name, value = line.split("=", 1)
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in ['"', "'"]:
            value = value[1:-1]
        values[name.strip()] = value
    return values` },
      { key: "gitignore", prompt: "Write is_ignored(path, patterns) with simplified .gitignore rules. path uses / between folders, like \"src/app.py\". A pattern ending in / (\".venv/\") matches when any folder in the path has that name. A pattern starting with *. (\"*.log\") matches file names ending in that extension. Any other pattern matches when the file name (the last part of the path) is exactly the pattern.",
        example: `pats = [".env", ".venv/", "*.log"]\nis_ignored("config/.env", pats) returns True\nis_ignored(".env.example", pats) returns False`,
        hint: "`parts = path.split(\"/\")`: the folders are `parts[:-1]` and the file name is `parts[-1]`. For a folder pattern compare `pattern[:-1]` with each folder; for `*.ext` use `name.endswith(pattern[1:])`.",
        starter: "def is_ignored(path, patterns):\n    pass\n",
        tests: `pats = [".env", ".venv/", "__pycache__/", "*.log"]
assert is_ignored(".env", pats) is True
assert is_ignored("config/.env", pats) is True, "a file-name pattern matches in any folder"
assert is_ignored(".venv/lib/site.py", pats) is True
assert is_ignored("src/__pycache__/app.pyc", pats) is True
assert is_ignored("logs/run.log", pats) is True
assert is_ignored("app.py", pats) is False
assert is_ignored(".env.example", pats) is False, "the example file (with no real values) is meant to be committed"`,
        solution: `def is_ignored(path, patterns):
    parts = path.split("/")
    folders, name = parts[:-1], parts[-1]
    for p in patterns:
        if p.endswith("/"):
            if p[:-1] in folders:
                return True
        elif p.startswith("*."):
            if name.endswith(p[1:]):
                return True
        elif name == p:
            return True
    return False` },
      { key: "headers", prompt: "Write parse_headers(raw) for HTTP response headers: raw has one \"Name: value\" per line. Return a dictionary with each name lowercased (header names ignore case) and each value stripped. Split each line at the first colon only, because values can contain colons.",
        example: `parse_headers("Retry-After: 30" + NL + "Date: Tue, 21 Oct 2026 10:00:00 GMT") returns\n{"retry-after": "30", "date": "Tue, 21 Oct 2026 10:00:00 GMT"}`,
        hint: "Loop over `raw.split(chr(10))`, skip lines without a colon, then `name, value = line.split(\":\", 1)`.",
        starter: "def parse_headers(raw):\n    pass\n",
        tests: `NL = chr(10)
h = parse_headers("Content-Type: application/json" + NL + "Retry-After: 30" + NL + "Date: Tue, 21 Oct 2026 10:00:00 GMT")
assert h["content-type"] == "application/json"
assert h["retry-after"] == "30", "names are lowercased"
assert h["date"] == "Tue, 21 Oct 2026 10:00:00 GMT", "split at the first colon only"
assert parse_headers("") == {}`,
        solution: `def parse_headers(raw):
    headers = {}
    for line in raw.split(chr(10)):
        if ":" not in line:
            continue
        name, value = line.split(":", 1)
        headers[name.strip().lower()] = value.strip()
    return headers` },
      { key: "no-fallback-key", debug: true, prompt: "A teammate's load_api_key falls back to a key pasted into the code when the environment variable is missing. That key ends up in git, and on a new machine the app fails later with a confusing 401 error. Fix it: return the key when ANTHROPIC_API_KEY is set and not empty; otherwise raise RuntimeError with a message that names ANTHROPIC_API_KEY. (env is a dictionary standing in for os.environ.)",
        example: `load_api_key({"ANTHROPIC_API_KEY": "sk-ant-real"}) returns "sk-ant-real"\nload_api_key({}) raises RuntimeError("Set ANTHROPIC_API_KEY ...")`,
        hint: "Read the value with `env.get(\"ANTHROPIC_API_KEY\")` (no fallback). `if not key:` covers both missing (None) and empty. Fail early, with a message that tells the person exactly what to set.",
        starter: `def load_api_key(env):
    return env.get("ANTHROPIC_API_KEY", "sk-ant-api03-PASTE-YOUR-KEY-HERE")
`,
        tests: `assert load_api_key({"ANTHROPIC_API_KEY": "sk-ant-real"}) == "sk-ant-real"
for env in [{}, {"ANTHROPIC_API_KEY": ""}]:
    try:
        load_api_key(env)
        raise SystemExit("a missing or empty key must raise RuntimeError, not fall back to a pasted key")
    except RuntimeError as e:
        assert "ANTHROPIC_API_KEY" in str(e), "say which variable to set"`,
        solution: `def load_api_key(env):
    key = env.get("ANTHROPIC_API_KEY")
    if not key:
        raise RuntimeError("Set ANTHROPIC_API_KEY in your environment or .env file")
    return key` },
    ],
  },
];

extendTrack(AI, {
  topics: ZERO_TOPICS,
  groups: [
    ["AI from zero", ZERO_TOPICS.filter((t) => t.zero === "ai").map((t) => t.id)],
    ...AI.groups,
  ],
  glossary: [
    ["API", "Application programming interface: an agreed way for one program to ask another to do something, often over the internet."],
    ["API key", "A secret string that identifies your account to a paid API, like a password. Keep it out of code and git."],
    ["CI (continuous integration)", "Checks such as tests and evals that run automatically on every code change, e.g. in GitHub Actions."],
    ["Class (Python)", "A bundle of data and the functions (methods) that work on it; LRUCache(2) creates an object from the LRUCache class."],
    ["Decorator (Python)", "A line starting with @ above a function that wraps it to add behaviour, such as turning it into a tool definition."],
    ["HTTP status code", "The number a web server returns with each response: 200 OK, 4xx a problem with the request (429 rate limited), 5xx a server problem."],
    ["Import / module (Python)", "import loads a module, a file of ready-made code such as json, math, re or an installed SDK."],
    ["JSON schema", "A description of the shape JSON data must have: which keys, what type each value is, which are required."],
    ["Context engineering", "Choosing what goes into the context window (instructions, history, documents, tool results) so the model has what it needs and nothing it doesn't."],
    ["Feature", "An input a machine-learning model looks at, such as a house's size."],
    ["Inference", "Using a trained model to make predictions on new inputs."],
    ["JSON", "A text format for data (objects, lists, strings, numbers) that looks like Python dicts and lists; how APIs send data."],
    ["Label", "The right answer attached to a training example."],
    ["Latency", "How long you wait for a response; for LLMs it grows with the length of the output."],
    ["Machine learning", "Building models that learn patterns from examples instead of following hand-written rules."],
    ["Model", "A function whose behaviour is set by learned numbers (parameters); it turns an input into a prediction."],
    ["Parameter (weight)", "A number inside a model that training adjusts; large language models have billions."],
    ["Probability", "A number from 0 (impossible) to 1 (certain); the probabilities of all options add up to 1."],
    ["Tokenizer", "The component that splits text into tokens for a model and turns output tokens back into text."],
    ["Training", "Adjusting a model's parameters to reduce its error on examples with known answers."],
  ],
});

// Short or older Learn addresses that clearly mean a lesson (#/ai/learn/start, #/ai/learn/softmax).
AI.aliases = {
  zero: "az-model", start: "az-model", "start-here": "az-model", beginner: "az-model", "ai-from-zero": "az-model", model: "az-model", training: "az-model", "next-token": "az-llm", tokens: "az-tokens", "context-window": "az-tokens", api: "az-api",
  ml: "mlbasics", "machine-learning": "mlbasics", llm: "foundations", llms: "foundations", "how-llms-work": "foundations",
  softmax: "sampling", temperature: "sampling", logits: "sampling", "llm-apis": "apis", prompts: "prompting", "prompt-engineering": "prompting",
  json: "structured", "structured-output": "structured", vectors: "embeddings", "vector-search": "vectorstores", "vector-db": "vectorstores", chunking: "vectorstores",
  "tool-use": "tools", "function-calling": "tools", agent: "agents", eval: "evals", testing: "evals", security: "safety", "prompt-injection": "safety",
  ops: "llmops", "fine-tuning": "customization", finetuning: "customization", images: "multimodal",
};
