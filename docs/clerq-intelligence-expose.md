# ClerQ Intelligence: A Working Theory of Care in the Gaps

*A profile*

There's a particular kind of AI-for-health pitch that has become easy to spot, because it always starts in the same place: a demo, a phone with full bars, a symptom checker that talks back in fluent English. ClerQ Intelligence, a small clinical AI company out of Dar es Salaam, starts somewhere else entirely: with the assumption that the phone has no signal, may never have one this week, and that the person holding it needs an answer anyway. That inversion, unglamorous as it sounds, turns out to be the whole company.

---

## Founding, and the partnership underneath it

ClerQ was conceived and built by Emmanuel Chesco, now in his third year of medical school at Muhimbili University of Health and Allied Sciences. Chesco is also one of the co-founders of Nama Labs, the research studio that ClerQ sits alongside. Emmanuel built ClerQ, and Daudi Raphael joined him at the earliest stage because he shared the vision, becoming the working partner and clinical co-investigator behind the product from early on, now serving as Chief of Strategic Partnerships. Together, they formed the core founding dynamic behind ClerQ's clinical and technical direction.

The rest of the leadership bench reads like a company trying to get its unglamorous scaffolding right early rather than late: Godson Madeha as Chief of Policy and Regulations, Mikael Nsengi as Chief Safety and Compliance Officer, Tunu Kassim as Chief Financial and Marketing Officer. Five people, four of them carrying governance-shaped titles, at a stage where most startups this size haven't hired past "engineer" and "growth." Whether that's foresight or over-structuring for the moment is the kind of question only time answers, but it signals where the company thinks the real risk lives: not in the model, but in the accountability around the model.

---

## The product, and what it refuses to assume

ClerQ's flagship is a clinical decision support system, built directly on Tanzania's Standard Treatment Guidelines rather than on a general medical-knowledge model trained mostly on Western clinical literature. The distinction sounds almost bureaucratic until you sit with what it actually means: most "AI doctor" products, wherever they're built, inherit the evidentiary assumptions of whatever corpus trained them. A model trained overwhelmingly on American and European clinical text will, by default, reason like an American or European clinician, right down to which conditions it considers common, which drugs it reaches for first, which tests it assumes are available. ClerQ's bet is that this isn't a fine-tuning problem to patch later. It's a foundational choice to make at the start: ground the system in the guideline a Tanzanian clinician is actually accountable to, and build every downstream decision around that, not around borrowed authority from elsewhere.

The second foundational choice is about hardware and connectivity, and it's arguably the more radical of the two. ClerQ is built offline-first, for low-spec Android devices, not as a fallback mode for when the network drops, but as the primary designed condition. This is a harder engineering problem than it sounds, and a less fundable one: it's much easier to raise money for "AI clinical assistant" than for "AI clinical assistant that deliberately runs slower and dumber so it works on a four-year-old Tecno with no signal." ClerQ has apparently chosen the harder, less fundable version, on the theory that the easier version simply doesn't work for the clinicians it's meant to serve.

---

## Sema: the deepest research bet the team has made public

The most intellectually serious thing to come out of ClerQ's orbit so far isn't the app: it's Sema, a project built by Nama Labs in close coordination with ClerQ, tackling a problem that sits one layer beneath any single product: small AI models reason well in English and poorly in Swahili, and the standard industry fix (throw more Swahili training data at the problem) is not available to a team without a research budget or a mountain of digitized Swahili text sitting around.

What makes Sema worth dwelling on is the shape of the bet it makes. The team's own writing on the project is refreshingly honest that it isn't a novel architecture ("closer to plumbing than to a new architecture" is roughly how they frame it themselves), and that modesty is doing real work. Instead of asking a model to translate Swahili into fluent English and back, which is a genuinely hard generative problem full of ambiguity, Sema anchors: it takes a Swahili sentence, strips it down word by word to its dictionary root, tags the grammar, attaches a plain gloss, and hands that skeleton (not fluent prose, but a structural x-ray) to a model that already reasons well in English. The response comes back not as machine-generated Swahili, which fails silently and fluently when it's wrong, but through bilingual templates and fields the team controls directly. It is, deliberately, a system that trades fluency for legibility, betting that in a setting where a wrong answer about a dosage can hurt someone, a slightly stiffer answer you can verify beats a smooth one you can't.

The empirical honesty extends to where the approach doesn't help. Past a certain model size, the team found their own anchoring added almost nothing: a negative result most companies would quietly omit rather than publish. And the strongest positive result wasn't where they expected it: not in conversational fluency, but in document retrieval, where stripping Swahili's grammatical prefixes and suffixes before indexing took a retrieval benchmark from barely passing to near-perfect. That's the kind of finding that only surfaces if you're willing to test your own assumptions rigorously enough to be wrong in public: a research posture that reads less like a startup's marketing writeup and more like an actual lab notebook, warts included.

---

## A wider research posture, not a single product

Sema sits alongside Rafiki, a digital twin training framework also built with Nama Labs, and the two together point to something broader than either project individually: ClerQ's research interests aren't really "clinical AI" in the narrow sense. They cluster around a set of harder, less marketable questions: how do you get useful machine intelligence to run entirely at the edge, with no dependency on a server that might not be reachable; how do you build systems whose failure modes are visible and inspectable rather than silent and fluent; how do you serve a population whose language, hardware, and connectivity were never the default case any major AI lab optimized for. Deterministic-over-generative where it matters, auditable-over-impressive as a working principle, infrastructure treated as a first-class design constraint rather than an afterthought. These show up again and again across the team's public work, closer to a research philosophy than a product roadmap.

It's a philosophy with a cost. Every one of these choices is slower to build and harder to pitch than the more conventional alternative. A generic LLM wrapper ships faster than an offline-first system grounded in local guidelines; a fluent generative translator is an easier demo than a deterministic anchoring layer that sometimes just says "unresolved" and stops. ClerQ appears to have decided, consistently, to take the slower and more honest path at each of these forks, and to publish the reasoning behind that choice rather than just the result.

---

## Hakiki: the part of ClerQ that isn't for patients at all

There's a version of "clinical AI validation" that most companies skip because it's invisible to end users and expensive to build properly: the tooling that lets you prove your rules are right before anyone downstream depends on them. ClerQ has built that piece anyway, under the name Hakiki (Swahili for "verify" or "authenticate"), which is about as on-the-nose a name as a rule-validation engine could ask for.

Hakiki is currently request-only, not a public product, and it's worth being precise about what it is and isn't. It isn't the patient-facing clinical decision support tool: it's the machine that proves that tool's reasoning is sound before it ever reaches a clinician. Every clinical rule in ClerQ's system, every symptom weight, every treatment threshold, every drug contraindication, is encoded as declarative data, versioned and reviewable, rather than buried in application code. The stated invariant is blunt about why: STG and NEMLIT guidelines change, and when they do, the fix should be a new data file, not a code change and a redeploy. Hakiki is the console where that data gets audited, chapter by chapter, against the guideline it claims to encode, with every rule traceable back to a verbatim quote and page number from the source document, so a regulator can check the system's reasoning against the guideline line by line rather than take the company's word for it.

That auditability isn't cosmetic. The engine's confidence scores are explicitly not probabilities (there is no dataset, no statistical model behind them): they're a bar-crossing ratio the team is candid about: how far past a clinician-authored threshold has the evidence gone. A severe presentation with even one red-flag finding can saturate confidence immediately, because the underlying guideline says severity shouldn't wait for a majority vote of symptoms; a routine presentation needs a fuller cluster of evidence to clear its bar. It's a deliberately unfashionable design choice in an industry that mostly reaches for machine-learned risk scores, but it means every number the system produces can be explained, in guideline language, to the person who has to act on it.

Hakiki also functions as connective tissue rather than a closed box. It exposes a clinical MCP server, letting outside AI tooling (the team names Claude, Cursor, and their own Antigravity setup) query the STG guidelines and the underlying decision engine directly, with a review layer that only proposes changes rather than silently writing them. That's a notable choice for a small team: rather than keeping the guideline-encoding work locked inside one proprietary interface, they've built a protocol-level door into it, decoupling "who can reason over Tanzania's treatment guidelines" from "who built the original tool."

Taken together with Sema and Rafiki, Hakiki completes a picture of a company whose real product, in a sense, isn't any single app: it's an increasingly rigorous pipeline for turning a national clinical guideline into something machine-checkable, auditable, and safely swappable as the guideline itself evolves. It's the least visible of ClerQ's public work, and arguably the part doing the most structural work underneath everything else.

---

*This profile draws on ClerQ Intelligence's public writing, published research (including the Nama Labs/ClerQ Medium writeup on Sema), and public repository documentation. It reflects the state of the company's public work as of this writing and does not claim comprehensiveness beyond what has been made public.*

