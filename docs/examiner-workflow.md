# Examiner Workflow

## Purpose

This document describes the intended flow for a Canadian patent examiner using the application. It is designed around active human examination, with AI serving as a challenger, organizer, and evidence assistant.

## Core Flow

1. Intake
2. Examiner First Pass
3. AI Challenge Reveal
4. Claim Understanding
5. Defect Review
6. Prior-Art Search
7. Patentability Analysis
8. Human Reasoning
9. Closeout Checklist
10. Session Summary

## Phase 1: Intake

### Examiner Actions

- Enter Canadian application or patent number.
- Confirm whether the application is open to public inspection or otherwise permitted for processing.
- Upload the latest claims and description if automatic retrieval is unavailable or not trusted.
- Confirm which claim set is being examined.

### AI/System Actions

- Attempt to verify bibliographic and status information.
- Detect whether key documents are present.
- Parse claims, description, drawings references, abstract, and sequence listing indicators where available.
- Warn if public status or document version is uncertain.

### Output

- Confirmed examination package.
- Document version note.
- Claim list and dependency tree.
- Data-use warning if external tools may be restricted.

## Phase 2: Examiner First Pass

### Purpose

This phase reduces AI anchoring. The examiner reviews the claim set before seeing AI-generated defect suggestions.

### Examiner Actions

- Read the independent claims.
- Mark initial concerns.
- Identify the likely inventive concept.
- Mark any obvious clarity, support, unity, subject-matter, or search concerns.

### AI/System Actions

- Keep AI suggestions hidden.
- Provide annotation tools and a simple issue palette.
- Track what the examiner identified independently.

### Output

- Examiner-owned initial issue map.
- Baseline for later AI challenge comparison.

## Phase 3: AI Challenge Reveal

### Purpose

The AI appears as a second reviewer whose work can be beaten, corrected, accepted, or rejected.

### Examiner Actions

- Compare AI suggestions against the examiner's first-pass notes.
- Mark each AI suggestion as accepted, rejected, modified, or uncertain.
- Add reasoning for important disagreements.

### AI/System Actions

- Reveal AI-suggested claim breakdown, issue flags, and search angles.
- Highlight where AI found something the examiner did not.
- Highlight where the examiner found something the AI missed.
- Award quality-oriented points for useful corrections and missed-AI catches.

### Output

- Difference map between examiner first pass and AI suggestions.
- Updated issue queue.
- Game events tied to examiner judgment.

## Phase 4: Claim Understanding

### Examiner Actions

- Review AI-generated limitation breakdown.
- Edit feature labels.
- Confirm claim categories and dependencies.
- Identify essential terms requiring support or clarity review.

### AI/System Actions

- Break claims into limitations.
- Group related claim features.
- Link dependent claims to parent limitations.
- Suggest terminology consistency issues.

### Output

- Examiner-approved claim map.
- Feature list for support review and prior-art search.

## Phase 5: Defect Review

### Examiner Actions

- Work through issue categories: clarity, support, sufficiency, subject matter, utility, unity, formalities, new matter, and related concerns.
- Accept, reject, or modify AI-suggested issues.
- Add evidence and reasoning for each issue to be raised.

### AI/System Actions

- Map claim terms to description passages.
- Flag possible clarity and antecedent-basis issues.
- Suggest support gaps.
- Suggest unity clusters.
- Check for missing formal elements.
- Identify unresolved categories before the examiner moves on.

### Output

- Reviewed issue list.
- Evidence-backed defect candidates.
- Rejected AI suggestions with examiner reasoning where appropriate.

## Phase 6: Prior-Art Search

### Examiner Actions

- Review AI-generated search strategy.
- Approve, edit, or add search queries.
- Decide which candidate references are relevant enough to analyze.
- Reject weak or irrelevant AI-surfaced references.

### AI/System Actions

- Generate search queries from approved claim features.
- Use approved external tools such as the Perplexity API where permitted.
- Return candidate patent and non-patent references.
- Extract candidate passages, figures, and publication dates.
- Warn when a reference date or source reliability is uncertain.

### Output

- Search log.
- Candidate reference list.
- Examiner relevance decisions.

## Phase 7: Patentability Analysis

### Examiner Actions

- Select references for novelty or obviousness analysis.
- Confirm or correct claim charts.
- Identify missing limitations.
- Decide whether a reference anticipates a claim.
- Decide whether a combination supports an obviousness position.

### AI/System Actions

- Build preliminary novelty charts.
- Build possible obviousness comparison tables.
- Identify claim limitations not found in a reference.
- Separate single-reference novelty analysis from multi-reference obviousness analysis.
- Suggest questions the examiner should resolve.

### Output

- Examiner-approved or examiner-rejected claim charts.
- Novelty findings.
- Obviousness reasoning workspace.
- List of references not used and why.

## Phase 8: Human Reasoning

### Examiner Actions

- Write or confirm the reasoning for each adopted issue.
- Explain why rejected AI suggestions were not adopted when material.
- Distinguish evidence from conclusion.
- Decide what should appear in a report or internal note.

### AI/System Actions

- Offer neutral drafting assistance.
- Detect unsupported conclusions.
- Suggest clearer structure.
- Preserve examiner edits as the source of truth.

### Output

- Examiner-owned reasoning notes.
- Draft report skeleton or internal examination summary.

## Phase 9: Closeout Checklist

### Examiner Actions

- Confirm that required phases are complete.
- Resolve or defer open issues.
- Confirm that every adopted issue has evidence and reasoning.
- Confirm that AI suggestions were not blindly accepted.

### AI/System Actions

- Check claim coverage.
- Check issue-category coverage.
- Check evidence completeness.
- Check unresolved flags.
- Generate a final checklist.

### Output

- Completed quality checklist.
- Unresolved/deferred issue list.
- Ready-for-review status.

## Phase 10: Session Summary

### Examiner Actions

- Review final session summary.
- Export or save notes as permitted.
- Optionally submit for senior review or calibration.

### AI/System Actions

- Summarize the examination session.
- Distinguish examiner-originated findings from AI-originated suggestions.
- Summarize accepted, rejected, modified, and missed-AI items.
- Update private progress and mastery indicators.

### Output

- Examination session summary.
- Quality and game progress summary.
- Audit trail of AI suggestions and examiner decisions.

## Game Events

### Positive Events

- Examiner finds a valid issue before AI reveal.
- Examiner identifies a valid issue the AI missed.
- Examiner rejects a weak AI suggestion with sound reasoning.
- Examiner improves an AI claim map.
- Examiner adds precise evidence to a conclusion.
- Examiner completes all required issue categories.
- Reviewer later agrees with examiner reasoning.

### Events That Should Not Earn Points

- Accepting AI suggestions without edits or reasoning.
- Raising more objections.
- Citing more references.
- Finishing faster.
- Producing longer notes.

## Checklist Template

- Intake package confirmed.
- Public/processing status checked.
- Latest claim set confirmed.
- Independent claims reviewed.
- Dependent claims reviewed as needed.
- Claim map approved or edited by examiner.
- Clarity reviewed.
- Support reviewed.
- Sufficiency reviewed.
- Subject matter reviewed.
- Utility reviewed.
- Unity reviewed.
- Formalities reviewed.
- New matter reviewed if amendments are present.
- Prior-art search strategy reviewed by examiner.
- Candidate references accepted or rejected by examiner.
- Novelty analysis completed where relevant.
- Obviousness analysis completed where relevant.
- Double patenting considered where relevant.
- All adopted issues have evidence.
- All adopted issues have examiner reasoning.
- AI suggestions were accepted, rejected, modified, or deferred.
- Unresolved items are listed.
- Session summary generated.

