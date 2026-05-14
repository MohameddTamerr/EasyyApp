function buildDashboardPage() {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Easy App Dashboard</title>
    <style>
      :root {
        --bg: #eef5fb;
        --card: #ffffff;
        --border: #d7e8f5;
        --text: #102a63;
        --muted: #5b6f8f;
        --accent: #0b7ff3;
        --success-bg: #eaf8f0;
        --success-text: #107245;
        --danger-bg: #fdf0ef;
        --danger-text: #b73d32;
        --pending-bg: #eef4fb;
        --pending-text: #476789;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: Arial, sans-serif;
        background: linear-gradient(180deg, #f4f9fd 0%, #e9f3fa 100%);
        color: var(--text);
      }
      .wrap {
        width: min(1220px, calc(100% - 28px));
        margin: 0 auto;
        padding: 24px 0 40px;
      }
      .topbar,
      .hero,
      .search-wrap,
      .filters-wrap,
      .stat-card,
      .project-card,
      .empty-state {
        background: var(--card);
        border: 1px solid var(--border);
        box-shadow: 0 14px 36px rgba(16,42,99,.06);
      }
      .topbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        padding: 14px 16px;
        border-radius: 24px;
        margin-bottom: 18px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .brand-mark {
        width: 42px;
        height: 42px;
        display: grid;
        place-items: center;
        border-radius: 14px;
        background: linear-gradient(135deg, #0b7ff3, #2eafff);
        color: #fff;
        font-weight: 900;
      }
      .brand strong {
        display: block;
        font-size: 16px;
      }
      .brand span {
        display: block;
        margin-top: 3px;
        font-size: 13px;
        color: var(--muted);
      }
      .nav {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
      }
      .nav a {
        text-decoration: none;
        padding: 11px 15px;
        border-radius: 14px;
        background: #e8f2fb;
        color: var(--text);
        font-weight: 700;
      }
      .nav a.primary {
        background: var(--accent);
        color: #fff;
      }
      .hero {
        border-radius: 28px;
        padding: 28px 30px;
        margin-bottom: 18px;
      }
      .hero h1 {
        margin: 0 0 10px;
        font-size: 34px;
      }
      .hero p,
      .hero-note,
      .page-note {
        margin: 0;
        color: var(--muted);
        line-height: 1.75;
      }
      .hero-note {
        margin-top: 14px;
        font-size: 14px;
      }
      .hero-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 18px;
      }
      .hero-actions a {
        text-decoration: none;
        color: #fff;
        background: var(--accent);
        padding: 12px 16px;
        border-radius: 14px;
        font-weight: 700;
      }
      .hero-actions a.secondary {
        background: #dfeefa;
        color: var(--text);
      }
      .stats {
        display: grid;
        grid-template-columns: repeat(4, minmax(0, 1fr));
        gap: 12px;
        margin-bottom: 18px;
      }
      .stat-card {
        border-radius: 22px;
        padding: 18px;
      }
      .stat-card span {
        display: block;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        margin-bottom: 8px;
      }
      .stat-card strong {
        font-size: 30px;
      }
      .tools {
        display: grid;
        grid-template-columns: 1.4fr auto;
        gap: 12px;
        margin-bottom: 18px;
      }
      .search-wrap,
      .filters-wrap {
        border-radius: 22px;
        padding: 14px;
      }
      .search-wrap input,
      .admin-note {
        width: 100%;
        border: 0;
        outline: none;
        color: var(--text);
        font-size: 15px;
        background: transparent;
        font-family: inherit;
      }
      .admin-note {
        min-height: 84px;
        padding: 12px 14px;
        border: 1px solid var(--border);
        border-radius: 14px;
        background: #f8fbff;
        resize: vertical;
      }
      .filters-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .filter-btn,
      .status-btn,
      .save-btn {
        border: 0;
        cursor: pointer;
        font-weight: 800;
      }
      .filter-btn {
        border-radius: 12px;
        padding: 10px 14px;
        background: #e7f1fa;
        color: var(--text);
      }
      .filter-btn.active {
        background: var(--accent);
        color: #fff;
      }
      .project-list {
        display: grid;
        gap: 16px;
      }
      .project-card {
        border-radius: 24px;
        padding: 22px;
      }
      .project-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
        margin-bottom: 16px;
      }
      .project-head h2 {
        margin: 0;
        font-size: 24px;
      }
      .project-head p {
        margin: 8px 0 0;
        color: var(--muted);
      }
      .project-topline {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 10px;
      }
      .project-meta {
        display: grid;
        gap: 8px;
        text-align: right;
        font-size: 14px;
        color: var(--muted);
        font-weight: 700;
      }
      .status-pill {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border-radius: 999px;
        padding: 8px 12px;
        font-size: 12px;
        font-weight: 800;
        text-transform: capitalize;
      }
      .status-pending {
        background: var(--pending-bg);
        color: var(--pending-text);
      }
      .status-done {
        background: var(--success-bg);
        color: var(--success-text);
      }
      .status-cancelled {
        background: var(--danger-bg);
        color: var(--danger-text);
      }
      .summary-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 12px;
      }
      .summary-row,
      .admin-box {
        padding: 14px 15px;
        border: 1px solid var(--border);
        border-radius: 16px;
        background: #f8fbff;
      }
      .summary-row span,
      .admin-box label {
        display: block;
        color: var(--muted);
        font-size: 13px;
        margin-bottom: 6px;
        font-weight: 700;
      }
      .summary-row strong {
        line-height: 1.6;
      }
      .card-actions,
      .admin-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      .status-btn,
      .save-btn {
        border-radius: 12px;
        padding: 10px 14px;
      }
      .status-btn.pending {
        background: var(--pending-bg);
        color: var(--pending-text);
      }
      .status-btn.done {
        background: var(--success-bg);
        color: var(--success-text);
      }
      .status-btn.cancelled {
        background: var(--danger-bg);
        color: var(--danger-text);
      }
      .save-btn {
        background: var(--accent);
        color: #fff;
      }
      .empty-state {
        border-radius: 24px;
        padding: 28px;
        text-align: center;
        color: var(--muted);
      }
      .page-note {
        margin-top: 16px;
        font-size: 13px;
      }
      code {
        font-family: Consolas, monospace;
      }
      @media (max-width: 900px) {
        .stats {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
        .tools {
          grid-template-columns: 1fr;
        }
        .project-head {
          flex-direction: column;
        }
        .project-meta {
          text-align: left;
        }
        .summary-grid {
          grid-template-columns: 1fr;
        }
      }
      @media (max-width: 640px) {
        .topbar {
          flex-direction: column;
          align-items: stretch;
        }
        .stats {
          grid-template-columns: 1fr;
        }
      }
    </style>
  </head>
  <body>
    <main class="wrap">
      <header class="topbar">
        <div class="brand">
          <div class="brand-mark">EA</div>
          <div>
            <strong>Easy App Dashboard</strong>
            <span>Manage briefs, admin notes, and project status</span>
          </div>
        </div>
        <nav class="nav">
          <a class="primary" href="/dashboard">Dashboard</a>
          <a href="/">New Project</a>
          <a href="/api/submissions">JSON Export</a>
        </nav>
      </header>

      <section class="hero">
        <h1>Project Orders</h1>
        <p>Search your projects, review details, add internal notes, and move each order to pending, done, or cancelled.</p>
        <div class="hero-note">Vercel note: create a private Blob store and add <code>BLOB_READ_WRITE_TOKEN</code> in your project environment variables. Without that token, the app falls back to local JSON storage for development only.</div>
        <div class="hero-actions">
          <a href="/">Create New Project</a>
          <a class="secondary" href="/submissions">Project List</a>
        </div>
      </section>

      <section class="stats" id="stats"></section>

      <section class="tools">
        <div class="search-wrap">
          <input id="searchInput" type="search" placeholder="Search by client, email, service, phone, website, notes, or summary text">
        </div>
        <div class="filters-wrap" id="filterBox">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="pending">Pending</button>
          <button class="filter-btn" data-filter="done">Done</button>
          <button class="filter-btn" data-filter="cancelled">Cancelled</button>
        </div>
      </section>

      <section class="project-list" id="projectList">
        <div class="empty-state">Loading projects...</div>
      </section>
      <p class="page-note">Admin features in this dashboard use the same submission API as the public form. Deploy the same project to Vercel and set the environment variables there.</p>
    </main>

    <script>
      const statsEl = document.getElementById("stats");
      const listEl = document.getElementById("projectList");
      const searchInput = document.getElementById("searchInput");
      const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
      let allSubmissions = [];
      let activeFilter = "all";

      function escapeHtmlClient(value) {
        return String(value || "")
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
      }

      function normalizeStatus(status) {
        return ["pending", "done", "cancelled"].includes(status) ? status : "pending";
      }

      function searchableText(submission) {
        return [
          submission.clientName,
          submission.clientEmail,
          submission.phone,
          submission.currentWebsite,
          submission.notes,
          submission.serviceType,
          submission.status,
          submission.adminNote,
          ...(submission.summaryItems || []).flatMap((item) => [item.label, item.value])
        ].join(" ").toLowerCase();
      }

      function renderStats(submissions) {
        const counts = {
          total: submissions.length,
          pending: submissions.filter((item) => normalizeStatus(item.status) === "pending").length,
          done: submissions.filter((item) => normalizeStatus(item.status) === "done").length,
          cancelled: submissions.filter((item) => normalizeStatus(item.status) === "cancelled").length
        };

        statsEl.innerHTML = [
          ["Total Projects", counts.total],
          ["Pending", counts.pending],
          ["Done", counts.done],
          ["Cancelled", counts.cancelled]
        ].map(([label, value]) => \`
          <article class="stat-card">
            <span>\${label}</span>
            <strong>\${value}</strong>
          </article>\`).join("");
      }

      function renderProjects(submissions) {
        if (!submissions.length) {
          listEl.innerHTML = '<div class="empty-state">No projects match the current search or filter.</div>';
          return;
        }

        listEl.innerHTML = submissions.map((submission) => {
          const status = normalizeStatus(submission.status);
          const rows = (submission.summaryItems || []).map((item) => \`
            <div class="summary-row">
              <span>\${escapeHtmlClient(item.label)}</span>
              <strong>\${escapeHtmlClient(item.value)}</strong>
            </div>\`).join("");

          return \`
            <article class="project-card">
              <div class="project-head">
                <div>
                  <div class="project-topline">
                    <h2>\${escapeHtmlClient(submission.clientName || "Unknown client")}</h2>
                    <span class="status-pill status-\${status}">\${status}</span>
                  </div>
                  <p>\${escapeHtmlClient(submission.serviceType || "Project Brief")} • \${escapeHtmlClient(submission.clientEmail || "")}</p>
                </div>
                <div class="project-meta">
                  <span>#\${escapeHtmlClient(submission.submissionVersion || "1")}</span>
                  <span>\${escapeHtmlClient(submission.submissionDate || submission.createdAt || "")}</span>
                </div>
              </div>
              <div class="summary-grid">\${rows}</div>
              <div class="admin-box" style="margin-top:16px;">
                <label for="note-\${escapeHtmlClient(submission.id)}">Admin Note</label>
                <textarea class="admin-note" id="note-\${escapeHtmlClient(submission.id)}" data-id="\${escapeHtmlClient(submission.id)}">\${escapeHtmlClient(submission.adminNote || "")}</textarea>
                <div class="admin-actions">
                  <button class="save-btn" data-save-note="\${escapeHtmlClient(submission.id)}">Save Note</button>
                </div>
              </div>
              <div class="card-actions">
                <button class="status-btn pending" data-id="\${escapeHtmlClient(submission.id)}" data-status="pending">Mark Pending</button>
                <button class="status-btn done" data-id="\${escapeHtmlClient(submission.id)}" data-status="done">Mark Done</button>
                <button class="status-btn cancelled" data-id="\${escapeHtmlClient(submission.id)}" data-status="cancelled">Mark Cancelled</button>
              </div>
            </article>\`;
        }).join("");
      }

      function applyFilters() {
        const query = searchInput.value.trim().toLowerCase();
        const filtered = allSubmissions.filter((submission) => {
          const matchesFilter = activeFilter === "all" || normalizeStatus(submission.status) === activeFilter;
          const matchesSearch = !query || searchableText(submission).includes(query);
          return matchesFilter && matchesSearch;
        });

        renderStats(allSubmissions);
        renderProjects(filtered);
      }

      async function loadSubmissions() {
        const response = await fetch("/api/submissions");
        allSubmissions = await response.json();
        applyFilters();
      }

      async function patchSubmission(id, patch) {
        const response = await fetch(\`/api/submissions/\${id}\`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(patch)
        });
        if (!response.ok) return null;
        const updated = await response.json();
        allSubmissions = allSubmissions.map((item) => item.id === updated.id ? updated : item);
        applyFilters();
        return updated;
      }

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeFilter = button.dataset.filter;
          filterButtons.forEach((item) => item.classList.toggle("active", item === button));
          applyFilters();
        });
      });

      searchInput.addEventListener("input", applyFilters);
      listEl.addEventListener("click", async (event) => {
        const statusButton = event.target.closest(".status-btn");
        if (statusButton) {
          await patchSubmission(statusButton.dataset.id, { status: statusButton.dataset.status });
          return;
        }

        const noteButton = event.target.closest("[data-save-note]");
        if (noteButton) {
          const id = noteButton.dataset.saveNote;
          const textarea = document.getElementById(\`note-\${id}\`);
          if (!textarea) return;
          await patchSubmission(id, { adminNote: textarea.value });
        }
      });

      loadSubmissions().catch(() => {
        listEl.innerHTML = '<div class="empty-state">Could not load submissions.</div>';
      });
    </script>
  </body>
</html>`;
}

module.exports = {
  buildDashboardPage
};
