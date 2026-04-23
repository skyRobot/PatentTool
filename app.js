const phases = [
  { id: "intake", title: "Intake", kicker: "Phase 01" },
  { id: "first-pass", title: "Examiner First Pass", kicker: "Phase 02" },
  { id: "challenge", title: "AI Challenge Reveal", kicker: "Phase 03" },
  { id: "claims", title: "Claim Understanding", kicker: "Phase 04" },
  { id: "defects", title: "Defect Review", kicker: "Phase 05" },
  { id: "search", title: "Prior-Art Search", kicker: "Phase 06" },
  { id: "analysis", title: "Patentability Analysis", kicker: "Phase 07" },
  { id: "closeout", title: "Closeout Checklist", kicker: "Phase 08" },
  { id: "summary", title: "Session Summary", kicker: "Phase 09" },
];

const concernTypes = [
  "Clarity",
  "Support",
  "Unity",
  "Subject matter",
  "Formalities",
  "Prior-art search",
];

const defectCategories = [
  ["Claim Form and Clarity", "Antecedent basis, relative language, unclear scope, dependencies."],
  ["Description and Support", "Claim terms mapped to passages, broad language checked against embodiments."],
  ["Subject Matter and Utility", "Statutory category, practical application, asserted utility."],
  ["Unity of Invention", "Common inventive concept and possible claim groupings."],
  ["Formal Requirements", "Title, abstract, drawings, numbering, sequence-listing indicators."],
  ["Prior Art and Patentability", "Novelty, obviousness, reference dates, and mapping quality."],
  ["Double Patenting", "Related applications or high-overlap claim sets."],
  ["Amendments and New Matter", "Added features and support in the original disclosure."],
];

const sampleClaims = `1. A computer-implemented irrigation control system comprising a soil moisture sensor, a weather data receiver, and a controller configured to adjust a watering schedule based on a predicted evapotranspiration value and a crop stress threshold.

2. The system of claim 1, wherein the controller transmits an alert to a mobile device when the crop stress threshold exceeds a user-defined limit.

3. The system of claim 1, wherein the weather data receiver obtains forecast precipitation data from a remote server.

4. A method of operating an irrigation system comprising receiving soil moisture data, calculating a predicted evapotranspiration value, comparing the value to a crop stress threshold, and modifying a watering schedule based on the comparison.`;

const sampleDescription = `The disclosure relates to automated irrigation systems for agricultural fields. In some embodiments, a controller receives soil moisture data from one or more in-field probes and receives forecast precipitation data from a remote weather service.

The controller may calculate an evapotranspiration estimate using temperature, humidity, solar radiation, and wind speed data. The estimate may be compared with a crop stress threshold selected for a crop type. If the threshold indicates stress, the controller adjusts a watering schedule and may send a notification to a user's mobile device.

Examples describe tomato and corn fields using threshold profiles stored in a memory. The system may reduce watering before forecast rainfall and increase watering during a heat event.`;

const state = {
  current: 0,
  claims: [],
  suggestions: [],
  candidates: [],
  searchQueries: [],
  claimInsights: [],
  analysisRows: [],
  firstPassLocked: false,
  selectedConcerns: new Set(),
  claimMapApproved: false,
  defectDecisions: {},
  score: 0,
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function setApiStatus(message, tone = "neutral") {
  const status = $("#api-status");
  if (!status) return;
  status.textContent = message;
  status.dataset.tone = tone;
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || `Request failed with ${response.status}`);
  }
  return payload;
}

function switchPhase(index) {
  state.current = Math.max(0, Math.min(phases.length - 1, index));
  const phase = phases[state.current];

  $$(".screen").forEach((screen) => screen.classList.toggle("is-active", screen.id === phase.id));
  $$(".phase").forEach((button, buttonIndex) => {
    button.classList.toggle("is-active", button.dataset.phase === phase.id);
    button.classList.toggle("is-done", buttonIndex < state.current);
  });

  $("#phase-title").textContent = phase.title;
  $("#phase-kicker").textContent = phase.kicker;
  $("#progress-fill").style.width = `${((state.current + 1) / phases.length) * 100}%`;

  if (phase.id === "summary") renderSummary();
  if (phase.id === "closeout") renderChecklist();
  if (phase.id === "analysis") renderAnalysis();
}

function parseClaims(text) {
  const normalized = text.trim().replace(/\r/g, "");
  if (!normalized) return [];

  const matches = [...normalized.matchAll(/(?:^|\n)\s*(\d+)\.\s+([\s\S]*?)(?=\n\s*\d+\.|$)/g)];
  return matches.map((match) => {
    const number = match[1];
    const text = match[2].replace(/\s+/g, " ").trim();
    const dependency = text.match(/\bclaim\s+(\d+)\b/i)?.[1] || null;
    const category = /method\b/i.test(text) ? "Method" : /system|apparatus|device\b/i.test(text) ? "System" : "Claim";
    const limitations = text
      .split(/\bcomprising\b|, and |;| wherein | based on | configured to /i)
      .map((part) => part.trim())
      .filter((part) => part.length > 18)
      .slice(0, 5);
    return { number, text, dependency, category, limitations };
  });
}

function createSuggestions() {
  const independent = state.claims.find((claim) => !claim.dependency) || state.claims[0];
  const firstClaim = independent?.number || "1";
  return [
    {
      id: "clarity-threshold",
      type: "Clarity",
      title: "Potentially unclear threshold language",
      detail: `Claim ${firstClaim} uses “crop stress threshold”. The description gives examples, but the boundary of the threshold may need examiner review.`,
      evidence: "Claim language + description threshold profiles",
      decision: null,
    },
    {
      id: "support-evapo",
      type: "Support",
      title: "Support check for predicted evapotranspiration",
      detail: "The description lists inputs for an estimate. Confirm whether that passage supports the breadth of the calculated value in the claim.",
      evidence: "Description paragraph mentioning temperature, humidity, solar radiation, and wind speed",
      decision: null,
    },
    {
      id: "search-angle",
      type: "Prior-art search",
      title: "Search angle: forecast-driven irrigation adjustment",
      detail: "Search should likely combine soil moisture sensing, weather forecast data, and dynamic watering schedule adjustment.",
      evidence: "Claim feature grouping",
      decision: null,
    },
  ];
}

function updateScore() {
  const decidedSuggestions = state.suggestions.filter((item) => item.decision).length;
  const reviewedDefects = Object.values(state.defectDecisions).filter(Boolean).length;
  const firstPass = state.firstPassLocked ? 15 : 0;
  const claimMap = state.claimMapApproved ? 15 : 0;
  const candidates = state.candidates.filter((item) => item.relevance).length * 4;
  state.score = firstPass + claimMap + decidedSuggestions * 10 + reviewedDefects * 4 + candidates;
  $("#score").textContent = state.score;
}

function renderConcerns() {
  $("#concern-chips").innerHTML = concernTypes
    .map((label) => `<button class="chip" type="button" data-concern="${label}">${label}</button>`)
    .join("");
}

function renderClaims() {
  const preview = $("#claim-preview");
  const claimMap = $("#claim-map");
  const insightByNumber = new Map(state.claimInsights.map((insight) => [String(insight.number), insight]));

  if (!state.claims.length) {
    preview.className = "claim-preview empty";
    preview.textContent = "Build the package to preview parsed claims.";
    claimMap.innerHTML = "";
    return;
  }

  preview.className = "claim-preview";
  preview.innerHTML = state.claims
    .map(
      (claim) => `
        <div class="claim-line">
          <strong>Claim ${claim.number}</strong>
          <p>${escapeHtml(claim.text)}</p>
          <span class="source-tag">${claim.dependency ? `Depends on claim ${claim.dependency}` : "Independent"} · ${claim.category}</span>
        </div>
      `,
    )
    .join("");

  claimMap.innerHTML = state.claims
    .map(
      (claim) => {
        const insight = insightByNumber.get(String(claim.number));
        const limitations = insight?.limitations?.length ? insight.limitations : claim.limitations;
        const supportCues = insight?.supportCues || [];
        return `
        <article class="claim-item">
          <p class="eyebrow">Claim ${escapeHtml(claim.number)} · ${escapeHtml(insight?.category || claim.category)}</p>
          <h3>${claim.dependency ? `Dependent from claim ${escapeHtml(claim.dependency)}` : "Independent claim"}</h3>
          <textarea data-claim-edit="${escapeHtml(claim.number)}">${escapeHtml(claim.text)}</textarea>
          <div>
            ${limitations.map((limitation) => `<span class="limitation">${escapeHtml(limitation)}</span>`).join("")}
          </div>
          ${
            supportCues.length
              ? `<p><strong>Support cues:</strong> ${supportCues.map(escapeHtml).join("; ")}</p>`
              : ""
          }
        </article>
      `;
      },
    )
    .join("");
}

function renderSuggestions() {
  const list = $("#suggestion-list");
  $("#challenge-status").textContent = state.firstPassLocked ? "Challenge open" : "First pass required";

  if (!state.firstPassLocked) {
    list.innerHTML = `<article class="suggestion"><h3>AI challenge is hidden</h3><p>Complete and lock the examiner first pass before suggestions are revealed.</p></article>`;
    return;
  }

  list.innerHTML = state.suggestions
    .map(
      (item) => `
        <article class="suggestion">
          <header>
            <div>
              <span class="source-tag">AI-generated · ${escapeHtml(item.type)}</span>
              <h3>${escapeHtml(item.title)}</h3>
            </div>
            <span class="pill">${escapeHtml(item.decision || "Undecided")}</span>
          </header>
          <p>${escapeHtml(item.detail)}</p>
          <p><strong>Evidence cue:</strong> ${escapeHtml(item.evidence)}</p>
          ${
            item.claimNumbers?.length
              ? `<p><strong>Claims:</strong> ${item.claimNumbers.map(escapeHtml).join(", ")}</p>`
              : ""
          }
          ${item.confidence ? `<span class="source-tag">Confidence: ${escapeHtml(item.confidence)}</span>` : ""}
          <div class="decision-row" data-suggestion="${escapeHtml(item.id)}">
            ${["Accept", "Reject", "Modify", "Uncertain"].map((decision) => `<button class="${item.decision === decision ? "is-active" : ""}" type="button">${decision}</button>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderDefects() {
  $("#defect-grid").innerHTML = defectCategories
    .map(
      ([title, detail]) => `
        <article class="defect-card">
          <h3>${title}</h3>
          <p>${detail}</p>
          <select data-defect="${title}">
            <option value="">Not reviewed</option>
            <option value="No issue">Reviewed: no issue</option>
            <option value="Adopted issue">Adopted issue</option>
            <option value="Deferred">Deferred</option>
            <option value="Needs evidence">Needs evidence</option>
          </select>
        </article>
      `,
    )
    .join("");
  updateDefectCount();
}

function updateDefectCount() {
  const count = Object.values(state.defectDecisions).filter(Boolean).length;
  $("#defect-count").textContent = `${count} reviewed`;
}

function renderSearch() {
  const features = state.searchQueries.length
    ? state.searchQueries
    : state.claims.flatMap((claim) => claim.limitations).slice(0, 4);
  $("#query-list").innerHTML = features.length
    ? features
        .map(
          (feature) => `
            <div class="query">
              <strong>${escapeHtml(feature)}</strong>
              <span class="source-tag">${state.searchQueries.length ? "Perplexity query" : "Examiner may edit before search"}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="query">Approve or build a claim map to generate feature-based queries.</div>`;

  renderCandidates();
}

function generateCandidates() {
  state.candidates = [
    {
      id: "ref-1",
      title: "Smart irrigation controller using weather forecast data",
      date: "2019",
      passage: "Discloses adjusting watering schedules using forecast rainfall and soil sensor measurements.",
      relevanceCue: "Soil sensor + weather forecast + watering schedule adjustment",
      risk: "Demo-only candidate; replace with Perplexity search for real references.",
      relevance: null,
    },
    {
      id: "ref-2",
      title: "Crop stress notification platform",
      date: "2021",
      passage: "Describes mobile alerts when a calculated plant stress value exceeds a selected threshold.",
      relevanceCue: "Crop stress threshold + mobile alert",
      risk: "Demo-only candidate; replace with Perplexity search for real references.",
      relevance: null,
    },
  ];
  renderCandidates();
}

function renderCandidates() {
  $("#candidate-list").innerHTML = state.candidates
    .map(
      (candidate) => `
        <article class="candidate">
          <header>
            <div>
              <span class="source-tag">${escapeHtml(candidate.source || "Demo candidate")} · ${escapeHtml(candidate.date || "Unknown date")}</span>
              <h3>${candidate.url ? `<a href="${escapeHtml(candidate.url)}" target="_blank" rel="noreferrer">${escapeHtml(candidate.title)}</a>` : escapeHtml(candidate.title)}</h3>
            </div>
            <span class="pill">${escapeHtml(candidate.relevance || "Unreviewed")}</span>
          </header>
          <p>${escapeHtml(candidate.passage)}</p>
          ${candidate.relevanceCue ? `<p><strong>Relevance cue:</strong> ${escapeHtml(candidate.relevanceCue)}</p>` : ""}
          ${candidate.risk ? `<p><strong>Caveat:</strong> ${escapeHtml(candidate.risk)}</p>` : ""}
          <div class="decision-row" data-candidate="${escapeHtml(candidate.id)}">
            ${["Relevant", "Weak", "Reject"].map((decision) => `<button class="${candidate.relevance === decision ? "is-active" : ""}" type="button">${decision}</button>`).join("")}
          </div>
        </article>
      `,
    )
    .join("");
}

function renderAnalysis() {
  if (state.analysisRows.length) {
    $("#analysis-table").innerHTML = state.analysisRows
      .map(
        (row) => `
          <div class="analysis-row">
            <span class="status-dot ${/appears disclosed/i.test(row.mapping || "") ? "ok" : "warn"}"></span>
            <div>
              <strong>${escapeHtml(row.limitation || "Claim limitation")}</strong>
              <p>${escapeHtml(row.candidateTitle || "Candidate reference")}: ${escapeHtml(row.mapping || "examiner review needed")}</p>
              <p><strong>Examiner question:</strong> ${escapeHtml(row.examinerQuestion || "Confirm whether the source actually discloses this limitation.")}</p>
            </div>
            <span class="source-tag">Perplexity cue</span>
          </div>
        `,
      )
      .join("");
    return;
  }

  const reference = state.candidates.find((candidate) => candidate.relevance === "Relevant") || state.candidates[0];
  const limitations = state.claims[0]?.limitations || [];
  $("#analysis-table").innerHTML = limitations.length
    ? limitations
        .map(
          (limitation, index) => `
            <div class="analysis-row">
              <span class="status-dot ${index % 2 === 0 ? "ok" : "warn"}"></span>
              <div>
                <strong>${escapeHtml(limitation)}</strong>
                <p>${reference ? `MVP mapping against ${escapeHtml(reference.title)}: ${index % 2 === 0 ? "candidate passage appears relevant; examiner must confirm disclosure." : "possible gap or claim construction issue to resolve."}` : "Generate candidates before mapping references."}</p>
              </div>
              <span class="source-tag">${index % 2 === 0 ? "Novelty cue" : "Question"}</span>
            </div>
          `,
        )
        .join("")
    : `<div class="analysis-row"><span class="status-dot warn"></span><div><strong>No claim limitations yet</strong><p>Build the package to create a preliminary chart.</p></div></div>`;
}

function renderChecklist() {
  const checks = [
    ["Package created", state.claims.length > 0, "Claims and description have been pasted and parsed."],
    ["First pass locked", state.firstPassLocked, "Examiner-authored observations exist before AI reveal."],
    ["AI suggestions reviewed", state.suggestions.length && state.suggestions.every((item) => item.decision), "Each simulated AI suggestion has a decision."],
    ["Claim map approved", state.claimMapApproved, "Claim breakdown was examiner approved or edited."],
    ["Defect categories reviewed", Object.values(state.defectDecisions).filter(Boolean).length >= 5, "Most core categories have been considered."],
    ["Evidence trail started", state.candidates.some((item) => item.relevance), "Prior-art candidates have examiner relevance decisions."],
  ];

  $("#checklist").innerHTML = checks
    .map(
      ([title, passed, detail]) => `
        <div class="check">
          <span class="status-dot ${passed ? "ok" : "warn"}"></span>
          <div>
            <strong>${title}</strong>
            <p>${detail}</p>
          </div>
          <span class="source-tag">${passed ? "Complete" : "Open"}</span>
        </div>
      `,
    )
    .join("");
}

function renderSummary() {
  const appNumber = $("#application-number").value || "Demo case";
  const decisions = state.suggestions.reduce((total, item) => {
    if (item.decision) total[item.decision] = (total[item.decision] || 0) + 1;
    return total;
  }, {});
  const reviewedDefects = Object.values(state.defectDecisions).filter(Boolean).length;

  $("#summary-title").textContent = `${appNumber} · first-pass examination note`;
  $("#summary-copy").textContent = `${state.claims.length} claims parsed, ${reviewedDefects} defect categories reviewed, and ${state.candidates.filter((item) => item.relevance).length} prior-art candidates triaged. The examiner remains the source of truth for every adopted conclusion.`;

  $("#judgment-trail").innerHTML = [
    ["Examiner concerns", [...state.selectedConcerns].join(", ") || "None selected"],
    ["AI accepted", decisions.Accept || 0],
    ["AI rejected", decisions.Reject || 0],
    ["AI modified", decisions.Modify || 0],
    ["AI uncertain", decisions.Uncertain || 0],
    ["Quality score", state.score],
  ]
    .map(([label, value]) => `<div class="trail-item"><strong>${escapeHtml(label)}</strong><span>${escapeHtml(value)}</span></div>`)
    .join("");
}

function buildCase() {
  const claimsText = $("#claims-input").value;
  state.claims = parseClaims(claimsText);
  state.suggestions = createSuggestions();
  state.searchQueries = [];
  state.claimInsights = [];
  state.analysisRows = [];
  state.claimMapApproved = false;
  state.candidates = [];
  renderClaims();
  renderSuggestions();
  renderSearch();
  renderAnalysis();
  renderChecklist();
  updateScore();
  if (state.claims.length) switchPhase(1);
}

function normalizeSuggestions(suggestions) {
  return (suggestions || []).map((item, index) => ({
    id: item.id || `ai-${index + 1}`,
    type: item.type || "AI review",
    title: item.title || "Review candidate",
    detail: item.detail || "Perplexity identified this as worth examiner review.",
    evidence: item.evidence || "Review claim and description text.",
    claimNumbers: item.claimNumbers || [],
    confidence: item.confidence || "medium",
    decision: null,
  }));
}

async function runAiReview() {
  if (!$("#claims-input").value.trim() || !$("#description-input").value.trim()) {
    setApiStatus("Paste claims and a description before running Perplexity review.", "warn");
    return;
  }

  if (!state.claims.length) buildCase();
  setApiStatus("Running Perplexity review for defects, support cues, claim insights, and search angles...", "loading");

  try {
    const payload = await postJson("/api/examine", {
      applicationNumber: $("#application-number").value,
      claims: $("#claims-input").value,
      description: $("#description-input").value,
      firstPass: `${$("#inventive-concept").value}\n${$("#first-pass-notes").value}`,
    });

    state.suggestions = normalizeSuggestions(payload.suggestions);
    state.claimInsights = payload.claimInsights || [];
    state.searchQueries = payload.searchQueries || [];
    renderSuggestions();
    renderClaims();
    renderSearch();
    updateScore();
    setApiStatus("Perplexity review loaded. Lock the first pass to reveal and judge the AI suggestions.", "ok");
  } catch (error) {
    setApiStatus(error.message, "error");
  }
}

async function runPriorArtSearch() {
  if (!$("#claims-input").value.trim()) {
    setApiStatus("Paste claims before running prior-art search.", "warn");
    return;
  }

  if (!state.claims.length) buildCase();
  setApiStatus("Searching for real prior-art leads with Perplexity Sonar...", "loading");

  try {
    const payload = await postJson("/api/prior-art", {
      claims: $("#claims-input").value,
      description: $("#description-input").value,
      claimInsights: state.claimInsights,
      searchQueries: state.searchQueries,
    });

    state.searchQueries = payload.queries || state.searchQueries;
    state.candidates = (payload.candidates || []).map((candidate, index) => ({
      id: candidate.id || `real-ref-${index + 1}`,
      title: candidate.title || "Prior-art lead",
      date: candidate.date || "Unknown",
      url: candidate.url || "",
      passage: candidate.passage || "Review the source for mapped disclosure.",
      relevanceCue: candidate.relevanceCue || "",
      risk: candidate.risk || "Examiner must verify source date, availability, and mapping.",
      source: "Perplexity lead",
      relevance: null,
    }));
    state.analysisRows = payload.analysisRows || [];
    renderSearch();
    renderCandidates();
    renderAnalysis();
    updateScore();
    setApiStatus("Prior-art leads loaded. Treat them as search leads until examiner verified.", "ok");
    switchPhase(5);
  } catch (error) {
    setApiStatus(error.message, "error");
  }
}

function init() {
  renderConcerns();
  renderClaims();
  renderSuggestions();
  renderDefects();
  renderSearch();
  switchPhase(0);

  $$(".phase").forEach((button, index) => button.addEventListener("click", () => switchPhase(index)));
  $("#prev-phase").addEventListener("click", () => switchPhase(state.current - 1));
  $("#next-phase").addEventListener("click", () => switchPhase(state.current + 1));

  $("#load-sample").addEventListener("click", () => {
    $("#application-number").value = "CA 3,123,456";
    $("#claim-set").value = "Latest amended claims · demo sample";
    $("#claims-input").value = sampleClaims;
    $("#description-input").value = sampleDescription;
  });

  $("#build-case").addEventListener("click", buildCase);
  $("#run-ai-review")?.addEventListener("click", runAiReview);

  $("#concern-chips").addEventListener("click", (event) => {
    const button = event.target.closest("[data-concern]");
    if (!button) return;
    const concern = button.dataset.concern;
    if (state.selectedConcerns.has(concern)) state.selectedConcerns.delete(concern);
    else state.selectedConcerns.add(concern);
    button.classList.toggle("is-selected");
  });

  $("#complete-first-pass").addEventListener("click", () => {
    state.firstPassLocked = true;
    if (!state.suggestions.length) state.suggestions = createSuggestions();
    renderSuggestions();
    updateScore();
    switchPhase(2);
  });

  $("#suggestion-list").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const row = event.target.closest("[data-suggestion]");
    if (!button || !row) return;
    const suggestion = state.suggestions.find((item) => item.id === row.dataset.suggestion);
    suggestion.decision = button.textContent;
    renderSuggestions();
    updateScore();
  });

  $("#approve-claim-map").addEventListener("click", () => {
    state.claimMapApproved = true;
    updateScore();
    renderSearch();
  });

  $("#defect-grid").addEventListener("change", (event) => {
    const select = event.target.closest("[data-defect]");
    if (!select) return;
    state.defectDecisions[select.dataset.defect] = select.value;
    updateDefectCount();
    updateScore();
  });

  $("#generate-search").addEventListener("click", () => {
    state.analysisRows = [];
    generateCandidates();
  });
  $("#run-prior-art")?.addEventListener("click", runPriorArtSearch);

  $("#candidate-list").addEventListener("click", (event) => {
    const button = event.target.closest("button");
    const row = event.target.closest("[data-candidate]");
    if (!button || !row) return;
    const candidate = state.candidates.find((item) => item.id === row.dataset.candidate);
    candidate.relevance = button.textContent;
    renderCandidates();
    updateScore();
  });

  $("#refresh-checklist").addEventListener("click", renderChecklist);
}

init();
