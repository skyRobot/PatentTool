# Product Brief: Examination Flow

## Working Name

Examination Flow is a quality-first, gameful workspace for Canadian patent examiners. It helps examiners conduct complete, defensible examinations while making the work feel more engaging, structured, and rewarding.

## Product Thesis

The application should not make examination automatic. It should make active examination easier to perform well.

The core design principle is:

> The AI is the challenger, not the authority. The examiner remains the decision-maker.

AI should accelerate reading, comparison, search, extraction, and organization. Examiners should make the substantive judgment calls: whether a defect exists, whether prior art is relevant, whether a limitation is disclosed, whether a combination is fair, and whether the final reasoning is persuasive.

## Target Users

- Primary users: CIPO patent examiners conducting national examination.
- Secondary users: senior examiners, section heads, trainers, quality reviewers, and operational leaders.
- Future scale: approximately 800+ examiners, which means the product must support consistency, privacy, auditability, and healthy incentives.

## Core Goals

- Increase examination quality by ensuring required issues are actively considered.
- Reduce cognitive overhead by organizing claims, documents, prior art, and reasoning in one flow.
- Make examination more engaging without rewarding speed or shallow output.
- Encourage examiner skepticism toward AI-generated suggestions.
- Create a defensible record of what the examiner reviewed, accepted, rejected, or corrected.
- Support learning and calibration across examiners without turning the workplace into a toxic leaderboard.

## Non-Goals For Version 1

- The app does not decide patentability.
- The app does not automatically generate final examination decisions without examiner reasoning.
- The app does not reward examiners for issuing more objections, citing more references, or finishing faster.
- The app does not replace official CIPO systems of record.
- The app does not assume Canadian Patent Database data will always be complete or machine-readable.

## User Experience Principles

- Start with the examiner's own review before revealing AI suggestions where anchoring risk is high.
- Make every AI suggestion easy to accept, reject, correct, or mark as uncertain.
- Reward examiner judgment, not AI agreement.
- Show progress through examination phases, not just task completion.
- Keep the interface calm, evidence-based, and professional even when game mechanics are present.
- Preserve examiner autonomy and expertise.

## AI/Human Division Of Labour

### AI Should Do

- Parse claims into limitations and feature groups.
- Identify terms that may need clarity review.
- Compare claim limitations against the description for possible support issues.
- Suggest candidate unity groupings.
- Generate prior-art search queries.
- Use the Perplexity API or other approved search sources to surface candidate references.
- Extract passages from references.
- Build preliminary claim charts.
- Flag inconsistencies, missing evidence, and unaddressed claims.
- Draft neutral summaries and checklist status.

### Examiner Should Do

- Define the actual invention under examination.
- Confirm or edit the AI's claim breakdown.
- Decide whether a clarity issue is material.
- Decide whether description support is sufficient.
- Decide whether a reference is relevant.
- Decide whether a claim limitation is disclosed.
- Decide whether an obviousness combination is reasonable.
- Decide whether a defect should be raised.
- Own the final reasoning.

## Game Design Principles

The game layer should create mastery, progress, and challenge while avoiding bad incentives.

### Reward

- Finding a real issue the AI missed.
- Correctly rejecting a weak AI suggestion.
- Improving a claim map.
- Completing review of all required claims and defect categories.
- Providing precise evidence citations.
- Writing clear reasoning.
- Demonstrating calibration when a reviewer later agrees with the examiner's decision.

### Do Not Reward

- Number of objections raised.
- Number of references cited.
- Fastest completion time.
- Accepting AI suggestions.
- Long reports.
- More defects without quality validation.

## Candidate Game Mechanics

- Case progress map: Start, Understand, Check, Search, Analyze, Close.
- Blind first pass: examiner records initial observations before AI suggestions appear.
- AI challenge mode: examiner earns credit for improving or correcting AI output.
- Evidence streaks: recognition for decisions tied to exact claim language and source passages.
- Calibration badges: quality-weighted recognition based on reviewer agreement.
- Private mastery dashboard: individual progress without public pressure.
- Team missions: optional collaborative challenges around quality skills.
- Seasonal quests: focused practice on support, clarity, unity, novelty, or obviousness.

## Trust And Safety Requirements

- Every AI output must be visibly labelled as AI-generated.
- The app must record whether the examiner accepted, rejected, edited, or ignored each AI suggestion.
- The final examination checklist must distinguish AI suggestions from examiner-adopted reasoning.
- The app should require examiner-authored or examiner-confirmed reasoning before a conclusion is marked complete.
- The app should detect passive acceptance patterns and encourage independent review.
- The app should avoid exposing confidential or non-public application data to external APIs unless approved and legally permitted.

## Version 1 Product Scope

Version 1 should help an examiner conduct a complete, defensible first-pass examination on one Canadian patent application.

Core capabilities:

- Manual upload of latest claims and description.
- Optional Canadian application or patent number intake.
- Claim parsing and examiner-editable claim map.
- Structured clarity and support review.
- Prior-art candidate search through Perplexity, subject to data policy.
- Examiner-controlled relevance review.
- Claim chart workspace for novelty and obviousness.
- End-of-flow checklist.
- Session summary showing accepted, rejected, and unresolved AI suggestions.

## Success Metrics

Quality metrics:

- Percentage of independent claims actively reviewed.
- Percentage of AI suggestions explicitly accepted, rejected, or edited.
- Percentage of conclusions with evidence citations.
- Reviewer agreement with examiner reasoning.
- Reduction in missed required issue categories.

Engagement metrics:

- Voluntary return usage.
- Completion of examination flow stages.
- Use of challenge/correction features.
- Examiner satisfaction and perceived usefulness.

Risk metrics:

- AI suggestion acceptance rate without edits or reasoning.
- Over-citation rate.
- Excessive objection rate.
- Time pressure effects.
- Disparities across technology areas or examiner levels.

## Open Product Questions

- What data can legally be sent to external AI/search APIs?
- Should the first version support only published/OPI applications?
- Which CIPO systems, if any, can the app integrate with?
- Should social mechanics be private, team-based, or fully opt-in?
- Who validates calibration rewards: senior examiner, reviewer, automated later-outcome signal, or a mix?
- Should the first version generate a draft office action, or only a structured examination note?

