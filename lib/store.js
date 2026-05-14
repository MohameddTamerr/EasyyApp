const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const DATA_DIR = path.join(ROOT, "data");
const LOCAL_FILE = path.join(DATA_DIR, "submissions.json");
const VALID_STATUSES = new Set(["pending", "done", "cancelled"]);

let blobSdkPromise;

function ensureLocalStore() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(LOCAL_FILE)) {
    fs.writeFileSync(LOCAL_FILE, "[]", "utf8");
  }
}

function useBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

async function getBlobSdk() {
  if (!blobSdkPromise) blobSdkPromise = import("@vercel/blob");
  return blobSdkPromise;
}

function normalizeSubmission(submission) {
  const status = VALID_STATUSES.has(submission.status) ? submission.status : "pending";
  return {
    ...submission,
    status,
    adminNote: String(submission.adminNote || "").trim()
  };
}

function getBlobPath(id) {
  return `submissions/${id}.json`;
}

function readLocalSubmissions() {
  ensureLocalStore();
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf8"));
  } catch {
    return [];
  }
}

function writeLocalSubmissions(submissions) {
  ensureLocalStore();
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(submissions, null, 2), "utf8");
}

function createSubmissionRecord(payload) {
  const submissionLanguage = String(payload.submissionLanguage || "EN").trim();
  const summaryItems = Array.isArray(payload.summaryItems)
    ? payload.summaryItems.map((item) => ({
        label: String(item.label || "").trim(),
        value: String(item.value || "").trim() || "Not answered"
      }))
    : [];

  return normalizeSubmission({
    id: Date.now().toString(36),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    clientName: String(payload.clientName || "").trim(),
    clientEmail: String(payload.clientEmail || "").trim(),
    phone: String(payload.phone || "").trim(),
    currentWebsite: String(payload.currentWebsite || "").trim(),
    notes: String(payload.notes || "").trim(),
    serviceType: String(payload.serviceType || "Project Brief").trim(),
    submissionLanguage,
    submissionDate: String(payload.submissionDate || "").trim(),
    submissionVersion: String(payload.submissionVersion || "1").trim(),
    logoFileName: String(payload.logoFileName || "").trim(),
    summaryText: String(payload.summaryText || "").trim(),
    summaryItems,
    status: "pending",
    adminNote: ""
  });
}

function validateSubmissionRecord(submission) {
  return Boolean(submission.clientName && submission.clientEmail && Array.isArray(submission.summaryItems) && submission.summaryItems.length);
}

async function streamToString(stream) {
  if (!stream) return "";
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let output = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    output += decoder.decode(value, { stream: true });
  }
  output += decoder.decode();
  return output;
}

async function readBlobSubmission(pathname) {
  const { get } = await getBlobSdk();
  const result = await get(pathname, {
    access: "private",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  if (!result) return null;
  const text = await streamToString(result.stream);
  return normalizeSubmission(JSON.parse(text));
}

async function writeBlobSubmission(submission) {
  const { put } = await getBlobSdk();
  await put(getBlobPath(submission.id), JSON.stringify(normalizeSubmission(submission), null, 2), {
    access: "private",
    allowOverwrite: true,
    cacheControlMaxAge: 60,
    contentType: "application/json",
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
}

async function listBlobSubmissions() {
  const { list } = await getBlobSdk();
  const blobs = [];
  let cursor;

  do {
    const result = await list({
      prefix: "submissions/",
      cursor,
      limit: 1000,
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    blobs.push(...(result.blobs || []));
    cursor = result.cursor;
  } while (cursor);

  const submissions = await Promise.all(
    blobs.map(async (blob) => {
      try {
        return await readBlobSubmission(blob.pathname);
      } catch {
        return null;
      }
    })
  );

  return submissions
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

async function saveSubmission(payload) {
  const submission = createSubmissionRecord(payload);
  if (!validateSubmissionRecord(submission)) {
    throw new Error("Missing required submission data.");
  }

  if (useBlobStorage()) {
    await writeBlobSubmission(submission);
    return submission;
  }

  const submissions = readLocalSubmissions();
  submissions.unshift(submission);
  writeLocalSubmissions(submissions);
  return submission;
}

async function listSubmissions() {
  if (useBlobStorage()) {
    return listBlobSubmissions();
  }

  return readLocalSubmissions()
    .map(normalizeSubmission)
    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
}

async function updateSubmission(id, patch) {
  const cleanPatch = {};
  if (patch.status !== undefined) {
    const nextStatus = String(patch.status || "").trim().toLowerCase();
    if (!VALID_STATUSES.has(nextStatus)) {
      throw new Error("Invalid status value.");
    }
    cleanPatch.status = nextStatus;
  }
  if (patch.adminNote !== undefined) {
    cleanPatch.adminNote = String(patch.adminNote || "").trim();
  }

  if (!Object.keys(cleanPatch).length) {
    throw new Error("No valid fields to update.");
  }

  if (useBlobStorage()) {
    const current = await readBlobSubmission(getBlobPath(id));
    if (!current) return null;
    const updated = normalizeSubmission({
      ...current,
      ...cleanPatch,
      updatedAt: new Date().toISOString()
    });
    await writeBlobSubmission(updated);
    return updated;
  }

  const submissions = readLocalSubmissions();
  const index = submissions.findIndex((submission) => submission.id === id);
  if (index === -1) return null;

  submissions[index] = normalizeSubmission({
    ...submissions[index],
    ...cleanPatch,
    updatedAt: new Date().toISOString()
  });
  writeLocalSubmissions(submissions);
  return submissions[index];
}

module.exports = {
  VALID_STATUSES,
  listSubmissions,
  saveSubmission,
  updateSubmission,
  useBlobStorage
};
