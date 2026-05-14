const nodemailer = require("nodemailer");

let transporter;

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: String(process.env.SMTP_SECURE || "true").toLowerCase() === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  return transporter;
}

function canSendMail() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS && (process.env.MAIL_FROM || process.env.SMTP_USER));
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderSummaryRows(summaryItems) {
  return summaryItems
    .map(
      ({ label, value }) => `
        <tr>
          <td style="padding:12px 14px;border:1px solid #d7e8f5;background:#f7fbff;color:#5b6f8f;font-weight:700;width:34%;">${escapeHtml(label)}</td>
          <td style="padding:12px 14px;border:1px solid #d7e8f5;color:#102a63;line-height:1.65;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
}

function renderEmailShell({ eyebrow, title, intro, summaryItems, footer }) {
  return `<!doctype html>
<html lang="en">
  <body style="margin:0;background:#edf5fb;font-family:Arial,sans-serif;color:#102a63;">
    <div style="max-width:760px;margin:0 auto;padding:32px 18px;">
      <div style="background:#ffffff;border:1px solid #d7e8f5;border-radius:28px;overflow:hidden;box-shadow:0 18px 48px rgba(16,42,99,.08);">
        <div style="padding:28px 32px;background:linear-gradient(135deg,#f8fcff,#e5f2fb);border-bottom:1px solid #d7e8f5;">
          <div style="font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:#5b6f8f;">${escapeHtml(eyebrow)}</div>
          <h1 style="margin:12px 0 0;font-size:30px;line-height:1.2;color:#102a63;">${escapeHtml(title)}</h1>
          <p style="margin:14px 0 0;font-size:15px;line-height:1.75;color:#4f6282;">${escapeHtml(intro)}</p>
        </div>
        <div style="padding:28px 32px;">
          <table style="width:100%;border-collapse:collapse;border-spacing:0;border-radius:18px;overflow:hidden;">
            ${renderSummaryRows(summaryItems)}
          </table>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.75;color:#5b6f8f;">${escapeHtml(footer)}</p>
        </div>
      </div>
    </div>
  </body>
</html>`;
}

async function sendClientConfirmation(submission) {
  if (!canSendMail()) {
    return {
      emailSent: false,
      warning: "Submission was saved, but the mail server is not configured yet."
    };
  }

  const subject =
    submission.submissionLanguage === "AR"
      ? "تم استلام استبيان مشروعك | Easy App"
      : "We received your project brief | Easy App";

  const html = renderEmailShell({
    eyebrow: submission.submissionLanguage === "AR" ? "تأكيد الاستلام" : "Submission received",
    title: submission.submissionLanguage === "AR" ? "تم استلام استبيان مشروعك" : "Your project brief was received",
    intro:
      submission.submissionLanguage === "AR"
        ? "شكرًا لك. فيما يلي نسخة من تفاصيل الاستبيان التي تم إرسالها. سيقوم فريقنا بالمراجعة والتواصل معك قريبًا."
        : "Thank you. Below is a copy of the details you submitted. Our team will review your brief and contact you soon.",
    summaryItems: submission.summaryItems,
    footer:
      submission.submissionLanguage === "AR"
        ? "هذه الرسالة مرسلة من فريق Easy App."
        : "This message was sent by the Easy App team."
  });

  try {
    await getTransporter().sendMail({
      from: process.env.MAIL_FROM || process.env.SMTP_USER,
      to: submission.clientEmail,
      replyTo: process.env.SMTP_USER,
      subject,
      text: submission.summaryText || submission.summaryItems.map(({ label, value }) => `${label}: ${value}`).join("\n"),
      html
    });

    return { emailSent: true };
  } catch {
    return {
      emailSent: false,
      warning: "Submission was saved, but the confirmation email failed."
    };
  }
}

module.exports = {
  sendClientConfirmation
};
