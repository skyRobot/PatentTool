# Canadian Examination Defect Taxonomy

## Purpose

This taxonomy organizes the main issue categories a Canadian patent examiner may consider during examination. It is intended for product design, workflow modelling, checklist creation, and future implementation planning.

It is not legal advice and should be validated against current CIPO guidance, the Patent Act, the Patent Rules, MOPOP, and internal CIPO practice before production use.

## Design Principles

- The taxonomy should help examiners remember what to review.
- The taxonomy should not force examiners to raise objections.
- AI may suggest potential issues, but the examiner decides whether a defect exists.
- Each issue should support evidence capture: claim text, description passage, drawing reference, prior-art passage, or examiner reasoning.

## Top-Level Categories

1. Intake and Public Status
2. Formal Requirements
3. Claim Form and Clarity
4. Description and Support
5. Subject Matter and Utility
6. Unity of Invention
7. Prior Art and Patentability
8. Double Patenting and Related Application Issues
9. Amendments and New Matter
10. Closeout Quality Checks

## 1. Intake And Public Status

### Potential Issues

- Application or patent number cannot be verified.
- Application is not open to public inspection when external processing is requested.
- Latest claims or description are unavailable.
- Uploaded documents do not match the expected application.
- Claim set version is unclear.
- Description, claims, drawings, abstract, or sequence listing may be missing.

### AI Assistance

- Look up bibliographic and status information.
- Check possible OPI/public availability.
- Compare uploaded document metadata against application number.
- Detect claim numbering and document completeness.

### Examiner Judgment

- Decide which document set is under examination.
- Decide whether external AI/search tools may be used.
- Confirm whether the intake package is sufficient to proceed.

## 2. Formal Requirements

### Potential Issues

- Title is not short or precise.
- Abstract is missing, unclear, too broad, or not representative.
- Drawings are missing where necessary.
- Drawings are unclear or inconsistent with the description.
- Description formatting or required elements are deficient.
- Sequence listing is missing or not in the required format.
- Claim numbering, dependencies, or page formatting create procedural issues.

### AI Assistance

- Check for presence of title, abstract, claims, description, drawings, and sequence listing indicators.
- Flag inconsistent reference numerals or terminology.
- Detect dependent claim structure and numbering anomalies.

### Examiner Judgment

- Decide whether a formal defect should be raised.
- Decide whether a drawing or sequence listing issue is material.

## 3. Claim Form And Clarity

### Potential Issues

- Claim language is unclear.
- Claim is not concise.
- Claim terms lack antecedent basis.
- Claim scope is ambiguous.
- Relative terms are used without sufficient context.
- Essential elements may be missing.
- Claim categories are inconsistent or confusing.
- Dependency relationships are improper or unclear.
- Multiple alternatives make the scope uncertain.
- Functional language obscures the boundaries of the claim.

### AI Assistance

- Parse independent and dependent claims.
- Identify terms with possible antecedent-basis problems.
- Highlight inconsistent terms across claims and description.
- Flag relative, subjective, or undefined terms.
- Suggest a claim tree and dependency map.

### Examiner Judgment

- Decide whether the claim scope is actually unclear.
- Decide whether the issue is significant enough to raise.
- Decide how to explain the clarity concern.

## 4. Description And Support

### Potential Issues

- Claims are not fully supported by the description.
- Broad claim language is not supported by disclosed embodiments.
- Amendments introduce unsupported subject matter.
- Description does not enable the claimed invention.
- Description does not describe the invention sufficiently.
- Description does not support functional or result-oriented claim language.
- Terms in the claims are not adequately explained in the description.
- Drawings and description are inconsistent.

### AI Assistance

- Map claim limitations to description passages.
- Highlight limitations with weak or missing support.
- Compare claim terminology against description terminology.
- Identify broad genus language and narrower examples.
- Flag potentially unsupported amendments if document history is available.

### Examiner Judgment

- Decide whether support is legally sufficient.
- Decide whether disclosure enables the claimed invention.
- Decide whether a support or sufficiency objection should be made.

## 5. Subject Matter And Utility

### Potential Issues

- Claimed subject matter may not fall within statutory categories.
- Claimed subject matter may be an abstract idea, disembodied method, scientific principle, theorem, or non-statutory subject matter.
- Computer-implemented claims may lack a patentable practical application.
- Diagnostic, medical-use, or method-of-medical-treatment issues may arise.
- Claimed invention may lack utility.
- Promised or asserted utility may not be established or soundly predicted where required.

### AI Assistance

- Classify claim category and technical field.
- Flag computer-implemented, diagnostic, medical-use, or data-processing claim patterns.
- Extract asserted advantages and utility statements from the description.
- Identify claim elements that appear technical or non-technical.

### Examiner Judgment

- Decide the essential elements and actual subject matter.
- Decide whether the claim is statutory.
- Decide whether utility is established.
- Apply current CIPO practice and law.

## 6. Unity Of Invention

### Potential Issues

- Claims may relate to more than one invention.
- Independent claims may lack a common inventive concept.
- Dependent claim groups may split into unrelated embodiments.
- Prior art may destroy a shared inventive concept and create lack of unity.

### AI Assistance

- Cluster claims by shared features.
- Identify common technical features across independent claims.
- Suggest possible invention groups.
- Update unity analysis after prior art is considered.

### Examiner Judgment

- Decide whether there is a single general inventive concept.
- Decide whether lack of unity should be raised.
- Decide which claims belong to which group.

## 7. Prior Art And Patentability

### Potential Issues

- Claim lacks novelty over one prior-art reference.
- Claim is obvious in view of one or more references and common general knowledge.
- Prior-art date or availability is uncertain.
- Reference does not actually disclose the mapped limitation.
- Combination reasoning is weak or hindsight-driven.
- Non-patent literature is unreliable or poorly dated.
- Foreign patent family documents need verification.

### AI Assistance

- Generate search queries from claim limitations.
- Search for candidate art using approved sources, including Perplexity where permitted.
- Extract relevant passages and figures.
- Produce preliminary element-by-element mappings.
- Identify missing claim limitations in a reference.
- Separate novelty mapping from obviousness combination reasoning.

### Examiner Judgment

- Decide whether a reference is citable and relevant.
- Decide whether a limitation is disclosed.
- Decide whether differences are material.
- Decide whether a combination is reasonable.
- Decide whether common general knowledge is properly supported.
- Own the final novelty or obviousness reasoning.

## 8. Double Patenting And Related Application Issues

### Potential Issues

- Claims may overlap with commonly owned patents or applications.
- Claims may be coterminous or not patentably distinct from related claims.
- Divisional applications may raise overlap concerns.
- Priority, family, or ownership information may need review.

### AI Assistance

- Identify related Canadian applications and patents.
- Compare claim language across related cases.
- Flag high-overlap claim sets.
- Summarize family relationships.

### Examiner Judgment

- Decide whether double patenting is actually present.
- Decide whether related-application information is legally relevant.

## 9. Amendments And New Matter

### Potential Issues

- Amended claims introduce matter not reasonably inferable from the original disclosure.
- Description amendments add new technical information.
- Drawings or examples add unsupported subject matter.
- Claim broadening after amendment creates new support issues.

### AI Assistance

- Compare current documents to prior versions if available.
- Highlight added, deleted, and changed claim language.
- Map added features to original disclosure.

### Examiner Judgment

- Decide whether new matter has been added.
- Decide whether the amendment is supported by the application as filed.

## 10. Closeout Quality Checks

### Potential Issues

- Not all independent claims were reviewed.
- A dependent claim was affected by an issue but not considered.
- AI suggestions were accepted without examiner reasoning.
- Prior-art mapping lacks source passages.
- A defect is raised without clear claim language and evidence.
- Novelty and obviousness reasoning are mixed together unclearly.
- Unresolved issues remain hidden.

### AI Assistance

- Generate a closeout checklist.
- Identify unreviewed claims or unresolved flags.
- Detect conclusions without evidence.
- Summarize accepted, rejected, edited, and pending AI suggestions.

### Examiner Judgment

- Decide whether the examination record is complete.
- Decide whether reasoning is ready for review or reporting.
- Decide what remains for a later action.

## Suggested Status Values

- Not reviewed
- AI suggested
- Examiner reviewing
- Examiner accepted
- Examiner rejected
- Examiner modified
- Needs evidence
- Needs senior input
- Resolved
- Deferred

## Suggested Evidence Types

- Claim passage
- Description passage
- Drawing reference
- Abstract passage
- Prior-art passage
- Patent family reference
- File-history passage
- Examiner reasoning note
- Reviewer note

## Sources To Validate Before Implementation

- Patent Act
- Patent Rules
- Current MOPOP chapters and updates
- CIPO practice notices
- CIPO national examination quality standards
- CIPO internal examination policies, if available

