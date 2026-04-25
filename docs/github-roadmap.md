# GitHub Roadmap

## Purpose

This roadmap translates the product brief, Canadian examination taxonomy, and examiner workflow into a systematic GitHub development plan. It is intended to guide milestones, issues, acceptance criteria, and future engineering decisions before implementation begins.

## Roadmap Principles

- Build quality infrastructure before automation.
- Keep examiner judgment central in every milestone.
- Treat AI output as provisional until the examiner accepts, rejects, or edits it.
- Avoid game mechanics that reward speed, volume, or passive AI acceptance.
- Ship small vertical slices that can be tested with realistic examination scenarios.
- Record decisions in docs before they become code.

## Suggested Repository Structure

```text
docs/
  product-brief.md
  canadian-examination-taxonomy.md
  examiner-workflow.md
  github-roadmap.md
  adr/
  research/
  specs/
```

Future implementation directories should be chosen after architecture decisions are made.

## Milestone 0: Product And Policy Foundation

### Goal

Clarify the product boundaries, examination model, AI guardrails, and data-use assumptions before implementation.

### Candidate Issues

- Create product brief.
- Create Canadian examination defect taxonomy.
- Create examiner workflow.
- Validate defect taxonomy against current CIPO sources.
- Identify data that may not be sent to external APIs.
- Decide whether version 1 supports only OPI/public applications.
- Draft AI usage and examiner-judgment principles.
- Define initial success metrics and risk metrics.
- Create ADR template.

### Acceptance Criteria

- Core docs exist and are reviewed.
- Legal/policy unknowns are explicitly listed.
- AI/human responsibility split is documented.
- Version 1 scope is constrained and understandable.

## Milestone 1: UX Prototype And Workflow Validation

### Goal

Design the user journey before building production systems.

### Candidate Issues

- Sketch intake screen.
- Sketch examiner first-pass screen.
- Sketch AI challenge reveal screen.
- Sketch claim map workspace.
- Sketch defect review workspace.
- Sketch prior-art candidate review workspace.
- Sketch novelty and obviousness claim chart views.
- Sketch closeout checklist.
- Sketch private progress and game feedback dashboard.
- Validate workflow with sample examiner personas.

### Acceptance Criteria

- A user can understand the start-middle-end flow from the prototype.
- The prototype clearly separates examiner-authored content from AI suggestions.
- The first-pass-before-AI-reveal interaction is represented.
- Game mechanics are visible but do not dominate the examination task.

## Milestone 2: Document Intake And Case Setup

### Goal

Allow an examiner to create a case workspace from uploaded documents and, later, from a Canadian application or patent number.

### Candidate Issues

- Define case data model.
- Define document data model.
- Define claim data model.
- Support manual upload of claims.
- Support manual upload of description.
- Detect claim numbering.
- Detect independent and dependent claims.
- Build initial claim dependency tree.
- Add application/patent number field.
- Research Canadian Patent Database/CDAS retrieval options.
- Add OPI/public-status check placeholder.
- Add document-version warning when source is uncertain.

### Acceptance Criteria

- Examiner can create a case manually using uploaded claims and description.
- App identifies claims and dependencies with reviewable confidence.
- Examiner can correct parsed claim data.
- App does not assume automatic database retrieval is reliable.

## Milestone 3: Examiner First Pass

### Goal

Prevent AI anchoring by capturing the examiner's initial observations before AI suggestions are shown.

### Candidate Issues

- Build claim reading view.
- Add examiner annotation tools.
- Add issue category palette.
- Allow initial inventive-concept note.
- Allow initial clarity/support/unity/search concern markers.
- Store first-pass observations separately from AI suggestions.
- Add "reveal AI challenge" transition.

### Acceptance Criteria

- Examiner can complete a meaningful first pass without seeing AI suggestions.
- First-pass observations are preserved for later comparison.
- App can distinguish examiner-originated issues from AI-originated suggestions.

## Milestone 4: Claim Parsing And Feature Mapping

### Goal

Create an examiner-editable claim map that becomes the foundation for support review and prior-art analysis.

### Candidate Issues

- Parse independent claims into limitations.
- Parse dependent claims into additional limitations.
- Add editable limitation labels.
- Add feature grouping.
- Add claim category detection.
- Add terminology consistency check.
- Add confidence indicators for AI-parsed limitations.
- Add examiner approval state for each claim map.

### Acceptance Criteria

- Examiner can accept, reject, or edit AI-parsed limitations.
- Each limitation can be linked to support passages and prior-art passages later.
- No limitation is treated as final until examiner-approved or examiner-edited.

## Milestone 5: Defect Review Framework

### Goal

Implement the structured defect taxonomy as a review workspace.

### Candidate Issues

- Add defect category model.
- Add issue status model.
- Add evidence type model.
- Build clarity review panel.
- Build support review panel.
- Build formalities review panel.
- Build subject-matter and utility review placeholder.
- Build unity review placeholder.
- Build new-matter review placeholder.
- Add "accepted/rejected/modified/deferred" decision controls.
- Add reasoning field for adopted issues.
- Add unresolved issue queue.

### Acceptance Criteria

- Examiner can review every major issue category from the taxonomy.
- Examiner can mark AI suggestions as accepted, rejected, modified, or deferred.
- Adopted issues require evidence or reasoning before closeout.

## Milestone 6: Support And Clarity Assistance

### Goal

Use AI to assist with two high-value non-prior-art defect categories while keeping judgment human-owned.

### Candidate Issues

- Map claim terms to description passages.
- Flag possible unsupported limitations.
- Flag broad terms with narrow examples.
- Flag possible antecedent-basis issues.
- Flag inconsistent terminology.
- Flag subjective or relative terms.
- Create examiner correction workflow for false positives.
- Create "AI missed issue" workflow for examiner-added issues.

### Acceptance Criteria

- AI suggestions are reviewable and editable.
- Examiner can identify false positives and missed issues.
- The system rewards corrections without rewarding more objections.

## Milestone 7: Prior-Art Search Integration

### Goal

Use Perplexity or another approved search provider to surface candidate references for examiner review.

### Candidate Issues

- Define external search data policy.
- Create Perplexity API integration ADR.
- Add search-query generation from approved claim features.
- Add examiner query review before search execution.
- Add candidate reference list.
- Extract reference metadata.
- Extract candidate passages.
- Add source-date reliability warning.
- Add examiner relevance decision controls.
- Store rejected references and rejection reasons.

### Acceptance Criteria

- Examiner approves or edits searches before they run.
- Candidate references are never treated as citable until examiner-reviewed.
- App records why references were accepted or rejected.
- External API use respects data policy.

## Milestone 8: Novelty And Obviousness Workspace

### Goal

Help examiners map candidate art to claims while preserving human reasoning.

### Candidate Issues

- Build novelty claim chart.
- Build obviousness comparison workspace.
- Link claim limitations to prior-art passages.
- Identify unmapped limitations.
- Allow examiner to accept, reject, or edit each mapping.
- Add difference summary between claim and reference.
- Add combination reasoning field.
- Add common general knowledge evidence field.
- Prevent novelty and obviousness reasoning from being mixed accidentally.

### Acceptance Criteria

- Examiner can create an element-by-element analysis.
- Each adopted mapping has a source passage.
- Examiner owns final novelty or obviousness conclusion.
- Missing limitations remain visible.

## Milestone 9: Gameful Quality Layer

### Goal

Make examination fun while reinforcing active judgment and quality.

### Candidate Issues

- Define point events.
- Define badge events.
- Define anti-gaming rules.
- Add private progress dashboard.
- Add AI-missed-issue reward.
- Add false-positive rejection reward.
- Add evidence-quality reward.
- Add claim-coverage reward.
- Add passive-acceptance warning.
- Add team/seasonal mission concept doc.

### Acceptance Criteria

- Points are tied to quality behaviors, not output volume.
- App does not reward speed, number of objections, or number of citations.
- Examiner can receive positive feedback for disagreeing with AI.
- Public leaderboard behavior is excluded from version 1 unless explicitly approved.

## Milestone 10: Closeout Checklist And Session Summary

### Goal

Ensure each examination session ends with a clear, defensible summary.

### Candidate Issues

- Build closeout checklist.
- Check independent claim coverage.
- Check issue category coverage.
- Check adopted issues for evidence.
- Check adopted issues for examiner reasoning.
- Check unresolved/deferred items.
- Generate session summary.
- Distinguish examiner-originated findings from AI-originated suggestions.
- Export structured notes as permitted.

### Acceptance Criteria

- Examiner can see what was reviewed, unresolved, accepted, rejected, and modified.
- Final summary does not present AI suggestions as examiner conclusions unless adopted.
- Checklist supports quality review and training.

## Milestone 11: Review, Calibration, And Scaling

### Goal

Prepare the system for many examiners while preserving healthy incentives and quality oversight.

### Candidate Issues

- Add senior examiner review workflow.
- Add calibration feedback model.
- Add reviewer agreement signal.
- Add anonymized quality analytics concept.
- Add team-level mission concept.
- Add privacy and access-control review.
- Add audit-log requirements.
- Add performance requirements for 800+ examiners.
- Add governance model for AI prompts and model updates.

### Acceptance Criteria

- Reviewers can validate or challenge examiner conclusions.
- Calibration rewards depend on quality review, not raw activity.
- Scaling concerns are documented before enterprise rollout.

## Cross-Cutting Labels

Suggested GitHub labels:

- `area:product`
- `area:ux`
- `area:ai`
- `area:data`
- `area:search`
- `area:gamification`
- `area:quality`
- `area:security`
- `area:policy`
- `area:docs`
- `type:research`
- `type:adr`
- `type:prototype`
- `type:feature`
- `type:test`
- `risk:privacy`
- `risk:ai-reliance`
- `risk:incentives`
- `priority:p0`
- `priority:p1`
- `priority:p2`

## Suggested Issue Template

```markdown
## Goal

What user or product outcome does this issue support?

## Background

What context, policy, workflow, or design assumption matters?

## Scope

- In scope:
- Out of scope:

## Acceptance Criteria

- 

## AI/Human Judgment Check

How does this feature preserve examiner decision-making?

## Incentive Check

Could this reward speed, volume, or passive AI acceptance? If yes, how do we prevent that?

## Data/Privacy Check

Does this involve confidential, non-public, or externally transmitted data?
```

## Suggested ADR Template

```markdown
# ADR: Title

## Status

Proposed

## Context

What decision needs to be made?

## Decision

What are we choosing?

## Consequences

What improves, what gets harder, and what risks remain?

## Alternatives Considered

- 
```

## First Five GitHub Issues To Create

1. Validate Canadian examination defect taxonomy against current CIPO sources.
2. Decide version 1 data policy for external AI and Perplexity use.
3. Design examiner first-pass and AI challenge reveal workflow.
4. Define case, document, claim, issue, evidence, and decision data models.
5. Prototype closeout checklist and session summary.

## Recommended Build Sequence

1. Documentation and policy foundation.
2. UX prototype.
3. Manual document intake.
4. Claim parsing and examiner-editable claim map.
5. Examiner first pass and AI challenge reveal.
6. Defect review framework.
7. Support and clarity AI assistance.
8. Prior-art search integration.
9. Novelty and obviousness workspace.
10. Gameful quality layer.
11. Closeout, review, calibration, and scaling.

