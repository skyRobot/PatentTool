const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 5173);
const ROOT = __dirname;
const PERPLEXITY_URL = "https://api.perplexity.ai/v1/sonar";
const ENV_PATH = path.join(ROOT, ".env");

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".md": "text/markdown; charset=utf-8",
};

function loadEnvFile() {
  if (!fs.existsSync(ENV_PATH)) return;

  const lines = fs.readFileSync(ENV_PATH, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const separator = trimmed.indexOf("=");
    if (separator === -1) continue;

    const key = trimmed.slice(0, separator).trim();
    let value = trimmed.slice(separator + 1).trim();
    value = value.replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

loadEnvFile();

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => {
      data += chunk;
      if (data.length > 1_500_000) {
        reject(new Error("Request body is too large."));
        req.destroy();
      }
    });
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
    req.on("error", reject);
  });
}

function extractJson(text) {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1] : trimmed;
  const firstBrace = candidate.indexOf("{");
  const lastBrace = candidate.lastIndexOf("}");
  if (firstBrace === -1 || lastBrace === -1) {
    throw new Error("Perplexity did not return JSON.");
  }
  return JSON.parse(candidate.slice(firstBrace, lastBrace + 1));
}

function limitText(value, maxLength) {
  return String(value || "").slice(0, maxLength);
}

async function callPerplexity({ messages, model = "sonar-pro", disableSearch = false }) {
  if (!process.env.PERPLEXITY_API_KEY) {
    const error = new Error("Missing PERPLEXITY_API_KEY. Set it before starting the server.");
    error.status = 401;
    throw error;
  }

  const response = await fetch(PERPLEXITY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.15,
      max_tokens: 2600,
      web_search_options: {
        disable_search: disableSearch,
        search_mode: "web",
      },
    }),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || `Perplexity API returned ${response.status}.`);
    error.status = response.status;
    error.details = payload;
    throw error;
  }

  const content = payload.choices?.[0]?.message?.content || "";
  return {
    json: extractJson(content),
    citations: payload.citations || [],
    searchResults: payload.search_results || [],
    usage: payload.usage || null,
  };
}

function examinationPrompt({ applicationNumber, claims, description, firstPass }) {
  return [
    {
      role: "system",
      content:
        "You are an evidence-focused assistant for a Canadian patent examiner. You are not the authority and must not make final legal conclusions. Identify review candidates only. Return strict JSON with no markdown.",
    },
    {
      role: "user",
      content: `Review the pasted patent claims and description for an MVP Canadian examination workflow.

Return JSON exactly in this shape:
{
  "suggestions": [
    {
      "id": "short-stable-id",
      "type": "Clarity | Support | Subject matter | Utility | Unity | Formalities | Prior-art search | New matter | Double patenting",
      "title": "short issue title",
      "detail": "why this is worth examiner review, without final legal conclusion",
      "evidence": "specific claim language or description passage cue",
      "claimNumbers": ["1"],
      "confidence": "low | medium | high"
    }
  ],
  "claimInsights": [
    {
      "number": "1",
      "category": "System | Method | Use | Product | Other",
      "limitations": ["concise limitation labels"],
      "supportCues": ["description cues to verify"]
    }
  ],
  "searchQueries": ["precise prior-art search query strings"]
}

Rules:
- Prefer concrete, evidence-tethered candidates over broad comments.
- Include likely false-positive risk when applicable.
- Do not cite statutes unless you are certain; phrase as examiner review prompts.
- Keep to at most 8 suggestions and 8 search queries.

Application/patent number: ${limitText(applicationNumber, 120)}
Examiner first-pass notes: ${limitText(firstPass, 2000)}

Claims:
${limitText(claims, 30000)}

Description:
${limitText(description, 40000)}`,
    },
  ];
}

function priorArtPrompt({ claims, description, claimInsights, searchQueries }) {
  return [
    {
      role: "system",
      content:
        "You help a patent examiner prepare a prior-art search. You must distinguish search leads from examiner-adopted findings. Return strict JSON with no markdown.",
    },
    {
      role: "user",
      content: `Find real prior-art search leads for the pasted claims. Use web-grounded search. Prefer patent/publication pages, Google Patents, Espacenet, Lens, USPTO, WIPO, journal, standards, or product documentation when relevant.

Return JSON exactly in this shape:
{
  "queries": ["search query actually useful for this claim set"],
  "candidates": [
    {
      "id": "short-stable-id",
      "title": "reference title",
      "date": "publication/priority/public date if available or Unknown",
      "url": "source URL if available",
      "passage": "short source-based relevance cue",
      "relevanceCue": "which claim limitation(s) this may map to",
      "risk": "date/source/mapping caveat"
    }
  ],
  "analysisRows": [
    {
      "limitation": "claim limitation",
      "candidateTitle": "candidate title",
      "mapping": "appears disclosed | possible partial disclosure | not found",
      "examinerQuestion": "question examiner should resolve"
    }
  ]
}

Rules:
- These are leads, not final novelty or obviousness conclusions.
- Include source URLs when available.
- Include date/source reliability caveats.
- Keep to at most 6 candidates and 10 analysis rows.

Existing claim insights:
${limitText(JSON.stringify(claimInsights || []), 6000)}

Initial search queries:
${limitText(JSON.stringify(searchQueries || []), 3000)}

Claims:
${limitText(claims, 30000)}

Description:
${limitText(description, 12000)}`,
    },
  ];
}

async function handleApi(req, res) {
  try {
    if (req.method === "GET" && req.url === "/api/health") {
      sendJson(res, 200, {
        ok: true,
        perplexityConfigured: Boolean(process.env.PERPLEXITY_API_KEY),
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/examine") {
      const body = await readBody(req);
      const result = await callPerplexity({
        messages: examinationPrompt(body),
        disableSearch: true,
      });
      sendJson(res, 200, {
        ...result.json,
        citations: result.citations,
        searchResults: result.searchResults,
        usage: result.usage,
      });
      return;
    }

    if (req.method === "POST" && req.url === "/api/prior-art") {
      const body = await readBody(req);
      const result = await callPerplexity({
        messages: priorArtPrompt(body),
        disableSearch: false,
      });
      sendJson(res, 200, {
        ...result.json,
        citations: result.citations,
        searchResults: result.searchResults,
        usage: result.usage,
      });
      return;
    }

    sendJson(res, 404, { error: "API route not found." });
  } catch (error) {
    sendJson(res, error.status || 500, {
      error: error.message,
      details: error.details,
    });
  }
}

function serveStatic(req, res) {
  const requestPath = req.url === "/" ? "/index.html" : decodeURIComponent(req.url.split("?")[0]);
  const filePath = path.normalize(path.join(ROOT, requestPath));

  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(filePath)] || "application/octet-stream",
    });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  if (req.url.startsWith("/api/")) {
    handleApi(req, res);
    return;
  }
  serveStatic(req, res);
});

server.listen(PORT, () => {
  console.log(`Examination Flow demo running at http://127.0.0.1:${PORT}`);
});
