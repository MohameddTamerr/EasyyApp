const { saveSubmission } = require("../lib/store");
const { sendClientConfirmation } = require("../lib/email");

function getPublicErrorMessage(error) {
  if (error && error.code === "STORAGE_NOT_CONFIGURED") {
    return "Submissions are not configured yet. Add BLOB_READ_WRITE_TOKEN in Vercel, then redeploy.";
  }
  return (error && error.message) || "Submission failed.";
}

module.exports = async (req, res) => {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Access-Control-Allow-Methods", "POST,OPTIONS");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  try {
    const submission = await saveSubmission(req.body || {});
    const mailResult = await sendClientConfirmation(submission);

    res.statusCode = 200;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      ok: true,
      stored: true,
      emailSent: mailResult.emailSent,
      warning: mailResult.warning
    }));
  } catch (error) {
    res.statusCode = error && error.code === "STORAGE_NOT_CONFIGURED" ? 500 : 400;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify({
      ok: false,
      error: getPublicErrorMessage(error)
    }));
  }
};
