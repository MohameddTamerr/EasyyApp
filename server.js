const http = require("http");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const { buildDashboardPage } = require("./lib/dashboard-page");
const { listSubmissions, saveSubmission, updateSubmission } = require("./lib/store");
const { sendClientConfirmation } = require("./lib/email");

const PORT = Number(process.env.PORT || 3001);
const ROOT = __dirname;

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpg": "image/jpeg",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp"
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Origin": "*",
    "Content-Type": "application/json; charset=utf-8"
  });
  res.end(JSON.stringify(payload));
}

function getRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 1024 * 1024) {
        reject(new Error("Body too large"));
        req.destroy();
      }
    });
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

async function parseJsonBody(req, res) {
  try {
    const raw = await getRequestBody(req);
    return raw ? JSON.parse(raw) : {};
  } catch {
    sendJson(res, 400, { ok: false, error: "Invalid JSON body." });
    return null;
  }
}

async function handleSubmitBrief(req, res) {
  const body = await parseJsonBody(req, res);
  if (body === null) return;

  try {
    const submission = await saveSubmission(body);
    const mailResult = await sendClientConfirmation(submission);
    sendJson(res, 200, {
      ok: true,
      stored: true,
      emailSent: mailResult.emailSent,
      warning: mailResult.warning
    });
  } catch (error) {
    sendJson(res, 400, {
      ok: false,
      error: error.message || "Submission failed."
    });
  }
}

async function handleUpdateSubmission(req, res, id) {
  const body = await parseJsonBody(req, res);
  if (body === null) return;

  try {
    const updated = await updateSubmission(id, body);
    if (!updated) {
      sendJson(res, 404, { ok: false, error: "Submission not found." });
      return;
    }
    sendJson(res, 200, updated);
  } catch (error) {
    sendJson(res, 400, { ok: false, error: error.message || "Update failed." });
  }
}

function serveStatic(req, res, pathname) {
  const decoded = decodeURIComponent(pathname);
  const safePath = decoded === "/" ? "/main copy.html" : decoded;

  if (safePath.includes("..") || path.basename(safePath).startsWith(".")) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  const filePath = path.join(ROOT, safePath);
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, data) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(data);
  });
}

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const submissionMatch = pathname.match(/^\/api\/submissions\/([^/]+)$/);

  if (req.method === "OPTIONS") {
    sendJson(res, 204, {});
    return;
  }

  if (req.method === "POST" && pathname === "/api/submit-brief") {
    await handleSubmitBrief(req, res);
    return;
  }

  if (req.method === "PATCH" && submissionMatch) {
    await handleUpdateSubmission(req, res, submissionMatch[1]);
    return;
  }

  if (req.method === "GET" && pathname === "/api/submissions") {
    const submissions = await listSubmissions();
    sendJson(res, 200, submissions);
    return;
  }

  if (req.method === "GET" && (pathname === "/dashboard" || pathname === "/submissions")) {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildDashboardPage());
    return;
  }

  if (req.method === "GET") {
    serveStatic(req, res, pathname);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Method not allowed");
});

server.listen(PORT, () => {
  console.log(`Easy App server running on http://localhost:${PORT}`);
});
