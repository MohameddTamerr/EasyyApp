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
        box-shadow: 0 14px 36px rgba(16, 42, 99, 0.06);
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
      .topbar-actions {
        display: flex;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
      }
      .lang-switch {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px;
        border-radius: 999px;
        background: #e8f2fb;
      }
      .lang-switch button {
        border: 0;
        background: transparent;
        color: var(--muted);
        font-weight: 800;
        border-radius: 999px;
        padding: 9px 13px;
        cursor: pointer;
      }
      .lang-switch button.active {
        background: var(--accent);
        color: #fff;
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
      .admin-actions,
      .asset-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 16px;
      }
      .asset-link,
      .status-btn,
      .save-btn {
        border-radius: 12px;
        padding: 10px 14px;
      }
      .asset-link {
        display: inline-flex;
        align-items: center;
        text-decoration: none;
        background: #e7f1fa;
        color: var(--text);
        font-weight: 800;
      }
      .status-btn[disabled],
      .save-btn[disabled] {
        cursor: wait;
        opacity: 0.72;
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
      .status-btn.is-current {
        box-shadow: inset 0 0 0 2px rgba(16, 42, 99, 0.12);
        opacity: 0.56;
      }
      .save-btn {
        background: var(--accent);
        color: #fff;
      }
      .status-feedback {
        min-height: 20px;
        margin-top: 10px;
        font-size: 13px;
        font-weight: 700;
        color: var(--muted);
      }
      .status-feedback.success {
        color: var(--success-text);
      }
      .status-feedback.error {
        color: var(--danger-text);
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
      body[dir="rtl"] .brand,
      body[dir="rtl"] .project-topline,
      body[dir="rtl"] .hero-actions,
      body[dir="rtl"] .filters-wrap,
      body[dir="rtl"] .card-actions,
      body[dir="rtl"] .admin-actions,
      body[dir="rtl"] .asset-actions,
      body[dir="rtl"] .topbar-actions,
      body[dir="rtl"] .nav {
        flex-direction: row-reverse;
      }
      body[dir="rtl"] .topbar,
      body[dir="rtl"] .project-head {
        direction: rtl;
      }
      body[dir="rtl"] .project-meta {
        text-align: left;
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
            <strong id="brandTitle">Easy App Dashboard</strong>
            <span id="brandSub">Manage briefs, admin notes, and project status</span>
          </div>
        </div>
        <div class="topbar-actions">
          <div class="lang-switch" aria-label="Language switcher">
            <button type="button" class="lang-btn active" data-lang="en">EN</button>
            <button type="button" class="lang-btn" data-lang="ar">AR</button>
          </div>
          <nav class="nav">
            <a class="primary" href="/dashboard" id="navDashboard">Dashboard</a>
            <a href="/" id="navNewProject">New Project</a>
            <a href="/api/submissions" id="navJson">JSON Export</a>
          </nav>
        </div>
      </header>

      <section class="hero">
        <h1 id="heroTitle">Project Orders</h1>
        <p id="heroDesc">Search your projects, review details, add internal notes, and move each order to pending, done, or cancelled.</p>
        <div class="hero-note" id="heroNote">Vercel note: create a private Blob store and add <code>BLOB_READ_WRITE_TOKEN</code> in your project environment variables. Without that token, the app falls back to local JSON storage for development only.</div>
        <div class="hero-actions">
          <a href="/" id="heroCreate">Create New Project</a>
          <a class="secondary" href="/submissions" id="heroList">Project List</a>
        </div>
      </section>

      <section class="stats" id="stats"></section>

      <section class="tools">
        <div class="search-wrap">
          <input id="searchInput" type="search" placeholder="Search by client, email, service, phone, website, notes, or summary text">
        </div>
        <div class="filters-wrap" id="filterBox">
          <button class="filter-btn active" data-filter="all" id="filterAll">All</button>
          <button class="filter-btn" data-filter="pending" id="filterPending">Pending</button>
          <button class="filter-btn" data-filter="done" id="filterDone">Done</button>
          <button class="filter-btn" data-filter="cancelled" id="filterCancelled">Cancelled</button>
        </div>
      </section>

      <section class="project-list" id="projectList">
        <div class="empty-state" id="loadingText">Loading projects...</div>
      </section>
      <p class="page-note" id="pageNote">Admin features in this dashboard use the same submission API as the public form. Deploy the same project to Vercel and set the environment variables there.</p>
    </main>

    <script>
      const LANG_STORAGE_KEY = "easy-app-language";
      const statsEl = document.getElementById("stats");
      const listEl = document.getElementById("projectList");
      const searchInput = document.getElementById("searchInput");
      const filterButtons = Array.from(document.querySelectorAll(".filter-btn"));
      const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
      let allSubmissions = [];
      let activeFilter = "all";
      let currentLang = "en";

      const dashboardText = {
        en: {
          brandTitle: "Easy App Dashboard",
          brandSub: "Manage briefs, admin notes, and project status",
          navDashboard: "Dashboard",
          navNewProject: "New Project",
          navJson: "JSON Export",
          heroTitle: "Project Orders",
          heroDesc: "Search your projects, review details, add internal notes, and move each order to pending, done, or cancelled.",
          heroNote: 'Vercel note: create a private Blob store and add <code>BLOB_READ_WRITE_TOKEN</code> in your project environment variables. Without that token, the app falls back to local JSON storage for development only.',
          heroCreate: "Create New Project",
          heroList: "Project List",
          searchPlaceholder: "Search by client, email, service, phone, website, notes, or summary text",
          filterAll: "All",
          filterPending: "Pending",
          filterDone: "Done",
          filterCancelled: "Cancelled",
          loading: "Loading projects...",
          pageNote: "Admin features in this dashboard use the same submission API as the public form. Deploy the same project to Vercel and set the environment variables there.",
          totalProjects: "Total Projects",
          pending: "Pending",
          done: "Done",
          cancelled: "Cancelled",
          noProjects: "No projects match the current search or filter.",
          unknownClient: "Unknown client",
          projectBrief: "Project Brief",
          adminNote: "Admin Note",
          saveNote: "Save Note",
          markPending: "Mark Pending",
          markDone: "Mark Done",
          markCancelled: "Mark Cancelled",
          currentStatus: "Current status",
          savingStatus: "Saving status",
          saved: "Saved",
          savingNote: "Saving admin note...",
          noteSaved: "Admin note saved",
          updateError: "Could not update project.",
          noteError: "Could not save admin note.",
          loadError: "Could not load submissions.",
          downloadLogo: "Download Uploaded Logo"
        },
        ar: {
          brandTitle: "لوحة تحكم Easy App",
          brandSub: "إدارة الطلبات والملاحظات الداخلية وحالة المشروع",
          navDashboard: "لوحة التحكم",
          navNewProject: "طلب جديد",
          navJson: "تصدير JSON",
          heroTitle: "طلبات المشاريع",
          heroDesc: "ابحث في الطلبات، راجع التفاصيل، أضف ملاحظات داخلية، وغيّر حالة كل مشروع إلى قيد الانتظار أو مكتمل أو ملغي.",
          heroNote: 'ملاحظة Vercel: أنشئ مخزن Blob خاصًا وأضف <code>BLOB_READ_WRITE_TOKEN</code> داخل متغيرات البيئة. بدون هذا الرمز سيعود التطبيق إلى التخزين المحلي للتطوير فقط.',
          heroCreate: "إنشاء طلب جديد",
          heroList: "قائمة الطلبات",
          searchPlaceholder: "ابحث بالعميل أو البريد أو الخدمة أو الهاتف أو الموقع أو الملاحظات أو الملخص",
          filterAll: "الكل",
          filterPending: "قيد الانتظار",
          filterDone: "مكتمل",
          filterCancelled: "ملغي",
          loading: "جارٍ تحميل الطلبات...",
          pageNote: "ميزات الإدارة في هذه اللوحة تستخدم نفس واجهة الإرسال الخاصة بالنموذج العام. انشر نفس المشروع على Vercel وأضف متغيرات البيئة هناك.",
          totalProjects: "إجمالي المشاريع",
          pending: "قيد الانتظار",
          done: "مكتمل",
          cancelled: "ملغي",
          noProjects: "لا توجد طلبات مطابقة للبحث أو الفلتر الحالي.",
          unknownClient: "عميل غير معروف",
          projectBrief: "استبيان مشروع",
          adminNote: "ملاحظة داخلية",
          saveNote: "حفظ الملاحظة",
          markPending: "تعيين قيد الانتظار",
          markDone: "تعيين مكتمل",
          markCancelled: "تعيين ملغي",
          currentStatus: "الحالة الحالية",
          savingStatus: "جارٍ حفظ الحالة",
          saved: "تم الحفظ",
          savingNote: "جارٍ حفظ الملاحظة...",
          noteSaved: "تم حفظ الملاحظة",
          updateError: "تعذر تحديث المشروع.",
          noteError: "تعذر حفظ الملاحظة.",
          loadError: "تعذر تحميل الطلبات.",
          downloadLogo: "تنزيل الشعار المرفوع"
        }
      };

      function t(key) {
        return dashboardText[currentLang][key] || dashboardText.en[key] || key;
      }

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

      function statusLabel(status) {
        const normalized = normalizeStatus(status);
        if (normalized === "done") return t("done");
        if (normalized === "cancelled") return t("cancelled");
        return t("pending");
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

      function renderChrome() {
        document.documentElement.lang = currentLang;
        document.body.dir = currentLang === "ar" ? "rtl" : "ltr";
        document.getElementById("brandTitle").textContent = t("brandTitle");
        document.getElementById("brandSub").textContent = t("brandSub");
        document.getElementById("navDashboard").textContent = t("navDashboard");
        document.getElementById("navNewProject").textContent = t("navNewProject");
        document.getElementById("navJson").textContent = t("navJson");
        document.getElementById("heroTitle").textContent = t("heroTitle");
        document.getElementById("heroDesc").textContent = t("heroDesc");
        document.getElementById("heroNote").innerHTML = t("heroNote");
        document.getElementById("heroCreate").textContent = t("heroCreate");
        document.getElementById("heroList").textContent = t("heroList");
        searchInput.placeholder = t("searchPlaceholder");
        document.getElementById("filterAll").textContent = t("filterAll");
        document.getElementById("filterPending").textContent = t("filterPending");
        document.getElementById("filterDone").textContent = t("filterDone");
        document.getElementById("filterCancelled").textContent = t("filterCancelled");
        document.getElementById("pageNote").textContent = t("pageNote");
        langButtons.forEach((button) => {
          button.classList.toggle("active", button.dataset.lang === currentLang);
        });
      }

      function renderStats(submissions) {
        const counts = {
          total: submissions.length,
          pending: submissions.filter((item) => normalizeStatus(item.status) === "pending").length,
          done: submissions.filter((item) => normalizeStatus(item.status) === "done").length,
          cancelled: submissions.filter((item) => normalizeStatus(item.status) === "cancelled").length
        };

        statsEl.innerHTML = [
          [t("totalProjects"), counts.total],
          [t("pending"), counts.pending],
          [t("done"), counts.done],
          [t("cancelled"), counts.cancelled]
        ].map(([label, value]) => \`
          <article class="stat-card">
            <span>\${label}</span>
            <strong>\${value}</strong>
          </article>\`).join("");
      }

      function renderProjects(submissions) {
        if (!submissions.length) {
          listEl.innerHTML = '<div class="empty-state">' + escapeHtmlClient(t("noProjects")) + '</div>';
          return;
        }

        listEl.innerHTML = submissions.map((submission) => {
          const status = normalizeStatus(submission.status);
          const submissionId = escapeHtmlClient(submission.id);
          const logoDownloadName = escapeHtmlClient(submission.logoFileName || ("logo-" + submission.id + ".png"));
          const logoDownload = submission.logoFileDataUrl
            ? '<div class="asset-actions"><a class="asset-link" href="' + escapeHtmlClient(submission.logoFileDataUrl) + '" download="' + logoDownloadName + '">' + escapeHtmlClient(t("downloadLogo")) + '</a></div>'
            : "";
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
                    <h2>\${escapeHtmlClient(submission.clientName || t("unknownClient"))}</h2>
                    <span class="status-pill status-\${status}">\${statusLabel(status)}</span>
                  </div>
                  <p>\${escapeHtmlClient(submission.serviceType || t("projectBrief"))} • \${escapeHtmlClient(submission.clientEmail || "")}</p>
                </div>
                <div class="project-meta">
                  <span>#\${escapeHtmlClient(submission.submissionVersion || "1")}</span>
                  <span>\${escapeHtmlClient(submission.submissionDate || submission.createdAt || "")}</span>
                </div>
              </div>
              <div class="summary-grid">\${rows}</div>
              \${logoDownload}
              <div class="admin-box" style="margin-top:16px;">
                <label for="note-\${submissionId}">\${escapeHtmlClient(t("adminNote"))}</label>
                <textarea class="admin-note" id="note-\${submissionId}" data-id="\${submissionId}">\${escapeHtmlClient(submission.adminNote || "")}</textarea>
                <div class="admin-actions">
                  <button class="save-btn" data-save-note="\${submissionId}">\${escapeHtmlClient(t("saveNote"))}</button>
                </div>
              </div>
              <div class="card-actions">
                <button class="status-btn pending \${status === "pending" ? "is-current" : ""}" data-id="\${submissionId}" data-status="pending" \${status === "pending" ? "disabled" : ""}>\${escapeHtmlClient(t("markPending"))}</button>
                <button class="status-btn done \${status === "done" ? "is-current" : ""}" data-id="\${submissionId}" data-status="done" \${status === "done" ? "disabled" : ""}>\${escapeHtmlClient(t("markDone"))}</button>
                <button class="status-btn cancelled \${status === "cancelled" ? "is-current" : ""}" data-id="\${submissionId}" data-status="cancelled" \${status === "cancelled" ? "disabled" : ""}>\${escapeHtmlClient(t("markCancelled"))}</button>
              </div>
              <div class="status-feedback" id="status-feedback-\${submissionId}">\${escapeHtmlClient(t("currentStatus"))}: \${statusLabel(status)}</div>
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
        const payload = await response.json();
        if (!response.ok) {
          throw new Error(payload && payload.error ? payload.error : t("loadError"));
        }
        allSubmissions = Array.isArray(payload) ? payload : [];
        applyFilters();
      }

      async function patchSubmission(id, patch) {
        const response = await fetch(\`/api/submissions/\${id}\`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(patch)
        });
        const payload = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(payload && payload.error ? payload.error : t("updateError"));
        }
        const updated = payload;
        allSubmissions = allSubmissions.map((item) => item.id === updated.id ? updated : item);
        applyFilters();
        return updated;
      }

      function setStatusFeedback(id, message, tone) {
        const feedback = document.getElementById(\`status-feedback-\${id}\`);
        if (!feedback) return;
        feedback.className = "status-feedback" + (tone ? \` \${tone}\` : "");
        feedback.textContent = message;
      }

      function setCardBusy(id, busy) {
        const buttons = Array.from(document.querySelectorAll(\`.status-btn[data-id="\${id}"], [data-save-note="\${id}"]\`));
        buttons.forEach((button) => {
          button.disabled = busy;
        });
      }

      function setDashboardLanguage(lang) {
        currentLang = lang === "ar" ? "ar" : "en";
        try {
          localStorage.setItem(LANG_STORAGE_KEY, currentLang);
        } catch {}
        renderChrome();
        applyFilters();
      }

      filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
          activeFilter = button.dataset.filter;
          filterButtons.forEach((item) => item.classList.toggle("active", item === button));
          applyFilters();
        });
      });

      langButtons.forEach((button) => {
        button.addEventListener("click", () => {
          setDashboardLanguage(button.dataset.lang);
        });
      });

      searchInput.addEventListener("input", applyFilters);

      listEl.addEventListener("click", async (event) => {
        const statusButton = event.target.closest(".status-btn");
        if (statusButton) {
          const id = statusButton.dataset.id;
          const status = statusButton.dataset.status;
          if (!id || !status) return;
          setCardBusy(id, true);
          setStatusFeedback(id, t("savingStatus") + ": " + statusLabel(status));
          try {
            await patchSubmission(id, { status });
            setStatusFeedback(id, t("saved") + ". " + t("currentStatus") + ": " + statusLabel(status), "success");
          } catch (error) {
            const message = error && error.message ? error.message : t("updateError");
            setStatusFeedback(id, message, "error");
          } finally {
            setCardBusy(id, false);
          }
          return;
        }

        const noteButton = event.target.closest("[data-save-note]");
        if (noteButton) {
          const id = noteButton.dataset.saveNote;
          const textarea = document.getElementById(\`note-\${id}\`);
          if (!textarea) return;
          setCardBusy(id, true);
          setStatusFeedback(id, t("savingNote"));
          try {
            await patchSubmission(id, { adminNote: textarea.value });
            const current = allSubmissions.find((item) => item.id === id);
            setStatusFeedback(id, t("noteSaved") + ". " + t("currentStatus") + ": " + statusLabel(current && current.status), "success");
          } catch (error) {
            const message = error && error.message ? error.message : t("noteError");
            setStatusFeedback(id, message, "error");
          } finally {
            setCardBusy(id, false);
          }
        }
      });

      try {
        const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
        if (savedLang === "ar" || savedLang === "en") currentLang = savedLang;
      } catch {}

      renderChrome();

      loadSubmissions().catch((error) => {
        const message = error && error.message ? error.message : t("loadError");
        listEl.innerHTML = \`<div class="empty-state">\${escapeHtmlClient(message)}</div>\`;
      });
    </script>
  </body>
</html>`;
}

module.exports = {
  buildDashboardPage
};
