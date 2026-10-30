# Intelligence layer v7

The landing page and visual composition are preserved. Prompt version: `analyst-v7.1`; KB version: `preferences-v1`; taxonomy: `functions-v1`.

## Pipeline

Raw text → semantic Parser → canonical IDs → Item Interpretation → Pattern Analyst → Critic → Writer → optional visual brief and images → result → optional feedback.

Item Interpretation keeps multiple possible experience functions per item, confidence and a short structured basis. These are hypotheses, not personality facts. User context overrides priors. Analyst must acknowledge every canonical item in a coverage pass, compare competing mechanisms and identify counterevidence; not every item must participate in the selected result. Main evidence still requires three unique real IDs, patterns two or more, with 1–4 patterns and 0–4 pairs. No hard technical-area gate. Internal quality scores are retained for research but stripped from public responses. No hidden chain of thought is requested or stored.

`knowledge/functions.json` is an extensible taxonomy of 35 experience functions. `knowledge/preference-functions.json` contains versioned candidate mappings, warnings and references. Research sources motivate general experience constructs; they do not scientifically validate the mapping of a favourite object to an individual's motive. Editorial mappings are marked `curated`. Liking is not wanting. Interpretations, patterns and prose must not become diagnoses, personality labels, automatic compliments or deficit narratives.

## Pseudonymous research data

The unchecked consent setting sends `research_consent:false` by default. The entire analysis works without research storage. With no consent, product research code performs zero storage reads or writes, feedback/event requests are not sent by the UI, and no automatic training takes place. Local input drafts remain browser-session storage, independently of research consent.

With explicit consent, the server writes private JSON dataset files to the Sites R2 binding `RESEARCH`. This file-based dataset is for manual review and prompt/KB regression work, not for accounts or automatic learning. No public read/list API exists.

Object layout:

- `pseudonymous-research/v7/<random UUID>/session.json`: raw input, parsed items, structured function hypotheses, coverage, competing hypothesis summaries, final result, internal scores, model and versions, consent version and timestamp.
- `.../feedback.json`: optional rating 1–5, most interesting component and optional short correction. Latest feedback is a separate file to avoid overwriting the immutable original analysis record.
- `.../events/<random UUID>.json`: only enrichment, repeat-analysis and share-card-saving events. There are no accordion events because the explanations are already open. No generic page, click or keystroke tracking.

Files are joined by `anonymous_session_id` / result UUID. Enriched analyses carry `initial_result_id` pointing to the first consented result. The client must provide the previous result's scoped signed capability to establish this link. The token is not an account/authentication identifier, contains no identity data and expires after 30 days. Feedback and event writes require current explicit consent, a valid capability and an existing record. Cross-origin browser writes are rejected. Storage failure never cancels analysis and is reported as unavailable rather than falsely claiming research was saved.

The application does not read or persist email, name from an account, OpenAI user ID, IP, location, cookies or authentication headers in this dataset. Raw input and optional feedback can contain names and other personal details; this is **pseudonymous research data**, not a fully anonymous dataset. Consent copy says so. This application-level guarantee does not describe hosting-provider operational logs.

## Evaluation

`npm test` runs the offline suite before publication. It includes semantic input regression with mocked model outputs, pipeline/ID/context checks, complete coverage and counterevidence checks, 10 persona fixtures spanning different interests, consent/storage/capability checks and UI state tests.

`node scripts/evaluate-v7.mjs` prints usage without making paid calls. `node scripts/evaluate-v7.mjs --live` requires an existing `OPENAI_API_KEY` in the execution environment, then runs the ten personas through the real six-stage text pipeline and a separate quality evaluator. It assesses diversity, specificity, coverage, evidence, fabrication, surprise and personality-label avoidance, and flags repeated headlines. Reports go to ignored `.eval-output/`; nothing updates prompts or KB automatically. A human must review results and feed selected failures back into regression fixtures.

Offline fixtures and checks do not prove the semantic quality or diversity of real API results. Live API and browser rendering must be evaluated separately; do not report the ten-persona model evaluation as passed merely because the offline suite passed.
