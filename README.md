# Examination Flow MVP Demo

This is a lightweight live demo for the planning-doc MVP. The public version runs with dummy data only, so it can be hosted as a static site without API keys or backend infrastructure.

## Run locally

```bash
npm start
```

Then open `http://localhost:5173`.

For later Perplexity features, create a local `.env` file in this folder with:

```bash
PERPLEXITY_API_KEY="your_api_key_here"
```

For static hosting, upload `index.html`, `styles.css`, `app.js`, and optionally `docs/` and `README.md`.

## Demo flow

1. Load the sample case or paste claims and a description.
2. Build the examination package.
3. Complete the examiner first pass before revealing simulated AI suggestions.
4. Accept, reject, modify, or mark AI suggestions uncertain.
5. Generate demo prior-art candidates and preliminary mapping cues.
6. Review the claim map, defect categories, search candidates, analysis chart, closeout checklist, and summary.

## Data note

The public demo uses simulated suggestions only. Later Perplexity results should be treated as search leads and review candidates, not examiner-adopted conclusions.
# PatentTool
