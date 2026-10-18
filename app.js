// Main Application Controller for OmniTool Hub v4.0 Ultra (100% English)

const THEMES_LIST = [
  { id: "nebula", name: "Nebula Glass", swatch: "linear-gradient(135deg,#6366f1,#a855f7)" },
  { id: "cyberpunk", name: "Cyberpunk 2077", swatch: "linear-gradient(135deg,#ec4899,#eab308)" },
  { id: "aurora", name: "Aurora Emerald", swatch: "linear-gradient(135deg,#10b981,#06b6d4)" },
  { id: "synthwave", name: "Sunset Synth", swatch: "linear-gradient(135deg,#f97316,#ec4899)" },
  { id: "ocean", name: "Deep Ocean", swatch: "linear-gradient(135deg,#0ea5e9,#3b82f6)" },
  { id: "crimson", name: "Crimson Matrix", swatch: "linear-gradient(135deg,#e11d48,#f97316)" },
  { id: "gold", name: "Royal Gold", swatch: "linear-gradient(135deg,#ca8a04,#fde047)" },
  { id: "arctic", name: "Arctic Daylight", swatch: "linear-gradient(135deg,#e2e8f0,#4f46e5)" },
  { id: "sakura", name: "Sakura Daylight", swatch: "linear-gradient(135deg,#fbcfe8,#db2777)" },
  { id: "terminal", name: "Retro Terminal", swatch: "linear-gradient(135deg,#052e16,#22c55e)" }
];

const AppState = {
  activePage: "hub",
  activeCategory: "all",
  searchQuery: "",
  favoritesOnly: false,
  compactView: false,
  currentToolId: null,
  theme: localStorage.getItem("omnitool_theme") || "nebula",
  favorites: JSON.parse(localStorage.getItem("omnitool_favs") || "[]"),
  recents: JSON.parse(localStorage.getItem("omnitool_recents") || "[]")
};

const DEVELOPER_EMAIL = "amank022008@gmail.com";

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(AppState.theme);
  initThemeStudio();
  initSidebar();
  initQuickCategoryPills();
  updateCounters();
  renderRecentTools();
  renderToolsGrid();
  setupEventListeners();
  setupComplaintDesk();
  checkDeepLinkUrl();
  lucide.createIcons();
});

function applyTheme(themeId) {
  AppState.theme = themeId;
  document.documentElement.setAttribute("data-theme", themeId);
  localStorage.setItem("omnitool_theme", themeId);
  const found = THEMES_LIST.find(t => t.id === themeId);
  const label = document.getElementById("currentThemeLabel");
  if (label && found) label.textContent = found.name.split(" ")[0];
}

function initThemeStudio() {
  const grid = document.getElementById("themeGridList");
  grid.innerHTML = THEMES_LIST.map(t => `
    <button data-theme-pick="${t.id}" class="p-2 rounded-xl glass-btn flex items-center gap-2 text-left text-xs font-semibold">
      <span class="w-4 h-4 rounded-full shrink-0 border border-white/20" style="background:${t.swatch}"></span>
      <span class="truncate">${t.name}</span>
    </button>
  `).join("");

  grid.querySelectorAll("[data-theme-pick]").forEach(btn => {
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.themePick);
      document.getElementById("themeDropdown").classList.add("hidden");
    });
  });
}

function updateCounters() {
  document.getElementById("totalToolsCountBadge").textContent = ALL_TOOLS.length;
  document.getElementById("heroTotalCount").textContent = ALL_TOOLS.length.toLocaleString();
  updateFavBadge();
}

function updateFavBadge() {
  const badge = document.getElementById("favCountBadge");
  if (AppState.favorites.length > 0) {
    badge.textContent = AppState.favorites.length;
    badge.classList.remove("hidden");
  } else {
    badge.classList.add("hidden");
  }
}

function switchPage(pageId) {
  AppState.activePage = pageId;
  document.querySelectorAll(".page-section").forEach(sec => sec.classList.add("hidden"));
  const target = document.getElementById(`page-${pageId}`);
  if (target) target.classList.remove("hidden");

  document.querySelectorAll(".nav-tab-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.navPage === pageId);
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function initSidebar() {
  const nav = document.getElementById("categoryList");
  let html = `
    <button data-cat="all" class="cat-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition accent-gradient text-white shadow-md">
      <div class="flex items-center gap-2.5">
        <i data-lucide="layout-grid" class="w-4 h-4"></i>
        <span>All 28 Categories</span>
      </div>
      <span class="text-[11px] font-mono opacity-90">${ALL_TOOLS.length}</span>
    </button>
  `;

  CATEGORIES_DATA.forEach(cat => {
    html += `
      <button data-cat="${cat.id}" class="cat-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium theme-text-primary hover:opacity-85 transition">
        <div class="flex items-center gap-2.5 truncate">
          <i data-lucide="${cat.icon}" class="w-4 h-4 accent-text shrink-0"></i>
          <span class="truncate">${cat.num}.${cat.name}</span>
        </div>
        <span class="text-[10px] font-mono glass-badge px-1.5 py-0.5 rounded">${cat.tools.length}</span>
      </button>
    `;
  });

  nav.innerHTML = html;

  nav.querySelectorAll(".cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      AppState.activeCategory = btn.dataset.cat;
      AppState.favoritesOnly = false;
      switchPage("hub");
      highlightActiveCategory();
      renderToolsGrid();
      closeMobileSidebar();
    });
  });
}

function initQuickCategoryPills() {
  const bar = document.getElementById("quickCategoryPills");
  bar.innerHTML = `<button data-pill="all" class="pill-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold accent-gradient text-white transition">All (${ALL_TOOLS.length})</button>` +
    CATEGORIES_DATA.map(c => `
      <button data-pill="${c.id}" class="pill-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-btn transition">
        #${c.num}${c.name}
      </button>
    `).join("");

  bar.querySelectorAll(".pill-btn").forEach(b => {
    b.addEventListener("click", () => {
      AppState.activeCategory = b.dataset.pill;
      AppState.favoritesOnly = false;
      highlightActiveCategory();
      renderToolsGrid();
    });
  });
}

function highlightActiveCategory() {
  document.querySelectorAll(".cat-btn").forEach(btn => {
    if (btn.dataset.cat === AppState.activeCategory && !AppState.favoritesOnly) {
      btn.className = "cat-btn w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition accent-gradient text-white shadow-md";
    } else {
      btn.className = "cat-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium theme-text-primary hover:opacity-85 transition";
    }
  });

  document.querySelectorAll(".pill-btn").forEach(btn => {
    if (btn.dataset.pill === AppState.activeCategory && !AppState.favoritesOnly) {
      btn.className = "pill-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold accent-gradient text-white transition";
    } else {
      btn.className = "pill-btn shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-semibold glass-btn transition";
    }
  });
}

function renderToolsGrid() {
  const grid = document.getElementById("toolsGrid");
  const emptyState = document.getElementById("emptyState");
  const q = AppState.searchQuery.toLowerCase().trim();

  if (AppState.favoritesOnly) {
    document.getElementById("activeCategoryPill").textContent = "Starred Favorites";
    document.getElementById("activeCategoryTitle").textContent = "Your Bookmarked Workspaces";
    document.getElementById("activeCategoryDesc").textContent = "Quick access to your starred tools and calculators.";
  } else if (AppState.activeCategory === "all") {
    document.getElementById("activeCategoryPill").textContent = "All 28 Categories";
    document.getElementById("activeCategoryTitle").textContent = `The 1,050+ All-in-One Digital Swiss Army Knife`;
    document.getElementById("activeCategoryDesc").textContent = "Every single operation has its own dedicated interactive workspace — PDF manipulation, HTML5 Image Studio, Audio/Video tools, Developer formatters, AI Prompt Engineering, ROS2 Robotics, FinTech calculators, and Cyber-Defense utilities.";
  } else {
    const catObj = CATEGORIES_DATA.find(c => c.id === AppState.activeCategory);
    if (catObj) {
      document.getElementById("activeCategoryPill").textContent = `Category #${catObj.num} •${catObj.tools.length} Tools`;
      document.getElementById("activeCategoryTitle").textContent = catObj.name;
      document.getElementById("activeCategoryDesc").textContent = catObj.description;
    }
  }

  const filtered = ALL_TOOLS.filter(t => {
    if (AppState.favoritesOnly && !AppState.favorites.includes(t.id)) return false;
    if (!AppState.favoritesOnly && AppState.activeCategory !== "all" && t.categoryId !== AppState.activeCategory) return false;
    if (q && !t.name.toLowerCase().includes(q) && !t.categoryName.toLowerCase().includes(q) && !String(t.id).includes(q)) return false;
    return true;
  });

  document.getElementById("showingCountText").textContent = `Showing ${filtered.length} of${ALL_TOOLS.length} tools`;

  if (filtered.length === 0) {
    grid.innerHTML = "";
    emptyState.classList.remove("hidden");
    return;
  }

  emptyState.classList.add("hidden");

  if (AppState.compactView) {
    grid.className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5";
  } else {
    grid.className = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3.5";
  }

  grid.innerHTML = filtered.map(tool => {
    const isFav = AppState.favorites.includes(tool.id);
    if (AppState.compactView) {
      return `
        <div data-tool-id="${tool.id}" class="tool-card rounded-xl px-3.5 py-2.5 cursor-pointer flex items-center justify-between gap-2">
          <div class="flex items-center gap-2.5 min-w-0">
            <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded glass-badge shrink-0">#${tool.id}</span>
            <h3 class="text-xs font-bold theme-text-primary truncate">${tool.name}</h3>
          </div>
          <div class="flex items-center gap-1 shrink-0">
            <button data-share-card="${tool.id}" class="p-1 rounded hover:opacity-80 theme-text-muted" title="Share Direct Link">
              <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
            </button>
            <button data-fav-btn="${tool.id}" class="p-1 rounded ${isFav ? "text-amber-400" : "theme-text-muted"}" title="Bookmark">
              <i data-lucide="star" class="w-3.5 h-3.5 ${isFav ? "fill-amber-400" : ""}"></i>
            </button>
          </div>
        </div>
      `;
    }

    return `
      <div data-tool-id="${tool.id}" class="tool-card group rounded-2xl p-4 cursor-pointer flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <span class="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-lg glass-badge">#${tool.id}</span>
            <div class="flex items-center gap-1">
              <button data-share-card="${tool.id}" class="p-1.5 rounded-lg glass-btn" title="Share this tool directly">
                <i data-lucide="share-2" class="w-3.5 h-3.5"></i>
              </button>
              <button data-fav-btn="${tool.id}" class="p-1.5 rounded-lg glass-btn ${isFav ? "text-amber-400" : ""}" title="Bookmark Tool">
                <i data-lucide="star" class="w-3.5 h-3.5 ${isFav ? "fill-amber-400" : ""}"></i>
              </button>
            </div>
          </div>
          <h3 class="text-sm font-extrabold theme-text-primary leading-snug">${tool.name}</h3>
        </div>
        <div class="mt-4 pt-2.5 border-t theme-border flex items-center justify-between text-[11px] theme-text-muted">
          <span class="truncate max-w-[68%] font-medium">${tool.categoryName}</span>
          <span class="accent-text group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-bold">Launch <i data-lucide="arrow-up-right" class="w-3.5 h-3.5"></i></span>
        </div>
      </div>
    `;
  }).join("");

  lucide.createIcons();

  // Attach 3D Spotlight mouse tracker + click handlers
  grid.querySelectorAll(".tool-card").forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    });

    card.addEventListener("click", (e) => {
      const favBtn = e.target.closest("[data-fav-btn]");
      if (favBtn) {
        e.stopPropagation();
        toggleFavorite(parseInt(favBtn.dataset.favBtn, 10));
        return;
      }
      const shareBtn = e.target.closest("[data-share-card]");
      if (shareBtn) {
        e.stopPropagation();
        shareToolDirectLink(parseInt(shareBtn.dataset.shareCard, 10));
        return;
      }
      openToolModal(parseInt(card.dataset.toolId, 10));
    });
  });
}

async function shareToolDirectLink(toolId) {
  const tool = ALL_TOOLS.find(t => t.id === toolId);
  if (!tool) return;
  const shareUrl = `${window.location.origin}${window.location.pathname}?tool=${tool.id}`;
  if (navigator.share) {
    try {
      await navigator.share({
        title: `OmniTool Hub — #${tool.id}${tool.name}`,
        text: `Launch "${tool.name}" (${tool.categoryName}) directly in your browser on OmniTool Hub:`,
        url: shareUrl
      });
      return;
    } catch {}
  }
  await navigator.clipboard.writeText(shareUrl);
  alert(`Direct link copied for #${tool.id} ${tool.name}:\n${shareUrl}`);
}

function toggleFavorite(toolId) {
  const idx = AppState.favorites.indexOf(toolId);
  if (idx > -1) AppState.favorites.splice(idx, 1);
  else AppState.favorites.push(toolId);
  localStorage.setItem("omnitool_favs", JSON.stringify(AppState.favorites));
  updateFavBadge();
  renderToolsGrid();
}

function addRecentTool(toolId) {
  AppState.recents = [toolId, ...AppState.recents.filter(id => id !== toolId)].slice(0, 10);
  localStorage.setItem("omnitool_recents", JSON.stringify(AppState.recents));
  renderRecentTools();
}

function renderRecentTools() {
  const sec = document.getElementById("recentToolsSection");
  const cont = document.getElementById("recentToolsContainer");
  if (!AppState.recents.length) {
    sec.classList.add("hidden");
    return;
  }
  sec.classList.remove("hidden");
  cont.innerHTML = AppState.recents.map(id => {
    const t = ALL_TOOLS.find(x => x.id === id);
    if (!t) return "";
    return `
      <button data-recent-id="${t.id}" class="shrink-0 px-3 py-1.5 rounded-xl glass-btn text-xs font-semibold flex items-center gap-2">
        <span class="text-[10px] font-mono accent-text">#${t.id}</span>
        <span>${t.name}</span>
      </button>
    `;
  }).join("");

  cont.querySelectorAll("[data-recent-id]").forEach(btn => {
    btn.addEventListener("click", () => openToolModal(parseInt(btn.dataset.recentId, 10)));
  });
}

function showModalToast(msg) {
  const toast = document.getElementById("universalActionToast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  setTimeout(() => toast.classList.add("hidden"), 3500);
}

function openToolModal(toolId) {
  const tool = ALL_TOOLS.find(t => t.id === toolId);
  if (!tool) return;

  AppState.currentToolId = tool.id;
  addRecentTool(toolId);

  const modal = document.getElementById("toolModal");
  document.getElementById("modalToolId").textContent = `#${tool.id}`;
  document.getElementById("modalToolTitle").textContent = tool.name;
  document.getElementById("modalToolCategory").textContent = `${tool.categoryNum}.${tool.categoryName}`;

  const extLinks = document.getElementById("modalExternalLinks");
  if (tool.websites && tool.websites.length) {
    extLinks.innerHTML = tool.websites.map(w =>
      `<a href="https://www.google.com/search?q=${encodeURIComponent(w + ' ' + tool.name)}" target="_blank" rel="noopener" class="px-2.5 py-1 rounded-lg glass-btn text-xs font-medium">${w} ↗</a>`
    ).join("");
  } else {
    extLinks.innerHTML = "";
  }

  const workspace = document.getElementById("modalWorkspace");
  ToolEngine.renderWorkspace(tool, workspace);

  modal.classList.remove("hidden");
  modal.classList.add("flex");
  lucide.createIcons();
}

function closeToolModal() {
  const modal = document.getElementById("toolModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function closeMobileSidebar() {
  document.getElementById("sidebar").classList.add("-translate-x-full");
  document.getElementById("sidebarBackdrop").classList.add("hidden");
}

function checkDeepLinkUrl() {
  const params = new URLSearchParams(window.location.search);
  const toolParam = params.get("tool");
  if (toolParam) {
    const id = parseInt(toolParam, 10);
    if (!isNaN(id)) openToolModal(id);
  }
}

// Setup Complaint & Support Form -> amank022008@gmail.com
function setupComplaintDesk() {
  const form = document.getElementById("complaintForm");
  const statusBox = document.getElementById("complaintStatusBox");

  const buildTicketPayload = () => {
    const name = document.getElementById("compName").value.trim() || "Anonymous User";
    const email = document.getElementById("compEmail").value.trim() || "Not provided";
    const type = document.getElementById("compType").value;
    const toolRef = document.getElementById("compTool").value.trim() || "General Platform";
    const priority = document.getElementById("compPriority").value;
    const msg = document.getElementById("compMessage").value.trim();
    const ticketId = "OMNI-" + Math.floor(100000 + Math.random() * 900000);

    const subject = `[OmniTool Hub ${type} #${ticketId}] (${priority}) -${toolRef}`;
    const body = [
      `Hello Aman Kumar,`,
      ``,
      `A new ${type} ticket has been submitted on OmniTool Hub v4.0:`,
      `--------------------------------------------------`,
      `Ticket ID: #${ticketId}`,
      `Sender Name: ${name}`,
      `Sender Email: ${email}`,
      `Category: ${type}`,
      `Affected Tool: ${toolRef}`,
      `Severity: ${priority}`,
      `Timestamp: ${new Date().toLocaleString()}`,
      `--------------------------------------------------`,
      `Description:`,
      msg,
      `--------------------------------------------------`
    ].join("\n");

    return { subject, body, ticketId };
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const { subject, body, ticketId } = buildTicketPayload();
    window.location.href = `mailto:${DEVELOPER_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    statusBox.classList.remove("hidden");
    statusBox.innerHTML = `✅ Support Ticket <b>#${ticketId}</b> generated! Opening your default email client addressed to <b>${DEVELOPER_EMAIL}</b>.`;
  });

  document.getElementById("sendGmailWebBtn").addEventListener("click", () => {
    if (!form.reportValidity()) return;
    const { subject, body, ticketId } = buildTicketPayload();
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(DEVELOPER_EMAIL)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank", "noopener");
    statusBox.classList.remove("hidden");
    statusBox.innerHTML = `✅ Support Ticket <b>#${ticketId}</b> opened directly in Gmail Web addressed to <b>${DEVELOPER_EMAIL}</b>!`;
  });

  document.getElementById("copyComplaintBtn").addEventListener("click", async () => {
    const { subject, body } = buildTicketPayload();
    await navigator.clipboard.writeText(`To: ${DEVELOPER_EMAIL}\nSubject: ${subject}\n\n${body}`);
    statusBox.classList.remove("hidden");
    statusBox.innerHTML = `✅ Ticket text copied to clipboard! You can paste and email it directly to <b>${DEVELOPER_EMAIL}</b>.`;
  });
}

function setupEventListeners() {
  document.querySelectorAll("[data-nav-page]").forEach(btn => {
    btn.addEventListener("click", () => switchPage(btn.dataset.navPage));
  });

  const searchInput = document.getElementById("globalSearchInput");
  searchInput.addEventListener("input", (e) => {
    AppState.searchQuery = e.target.value;
    if (AppState.activePage !== "hub") switchPage("hub");
    renderToolsGrid();
  });

  window.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      switchPage("hub");
      searchInput.focus();
    }
    if (e.key === "Escape") {
      closeToolModal();
      document.getElementById("themeDropdown").classList.add("hidden");
    }
  });

  // Theme Popover Toggle
  const themeBtn = document.getElementById("themeMenuBtn");
  const themeDrop = document.getElementById("themeDropdown");
  themeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    themeDrop.classList.toggle("hidden");
  });
  document.addEventListener("click", (e) => {
    if (!themeDrop.contains(e.target) && e.target !== themeBtn) {
      themeDrop.classList.add("hidden");
    }
  });

  // Grid vs Compact View Mode
  const gridBtn = document.getElementById("viewGridBtn");
  const compBtn = document.getElementById("viewCompactBtn");
  gridBtn.addEventListener("click", () => {
    AppState.compactView = false;
    gridBtn.className = "px-3 py-1.5 rounded-xl text-xs font-semibold accent-gradient text-white flex items-center gap-1.5";
    compBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium theme-text-muted hover:opacity-80 flex items-center gap-1.5";
    renderToolsGrid();
  });
  compBtn.addEventListener("click", () => {
    AppState.compactView = true;
    compBtn.className = "px-3 py-1.5 rounded-xl text-xs font-semibold accent-gradient text-white flex items-center gap-1.5";
    gridBtn.className = "px-3 py-1.5 rounded-xl text-xs font-medium theme-text-muted hover:opacity-80 flex items-center gap-1.5";
    renderToolsGrid();
  });

  document.getElementById("favoritesFilterBtn").addEventListener("click", () => {
    AppState.favoritesOnly = !AppState.favoritesOnly;
    switchPage("hub");
    highlightActiveCategory();
    renderToolsGrid();
  });

  document.getElementById("resetSearchBtn").addEventListener("click", () => {
    AppState.activeCategory = "all";
    AppState.searchQuery = "";
    AppState.favoritesOnly = false;
    searchInput.value = "";
    highlightActiveCategory();
    renderToolsGrid();
  });

  document.getElementById("clearRecentBtn").addEventListener("click", () => {
    AppState.recents = [];
    localStorage.removeItem("omnitool_recents");
    renderRecentTools();
  });

  document.getElementById("closeModalBtn").addEventListener("click", closeToolModal);
  document.getElementById("toolModal").addEventListener("click", (e) => {
    if (e.target.id === "toolModal") closeToolModal();
  });

  document.getElementById("universalShareOutputBtn").addEventListener("click", () => {
    ToolEngine.shareCurrentArtifact(showModalToast);
  });

  document.getElementById("universalDownloadOutputBtn").addEventListener("click", () => {
    ToolEngine.downloadCurrentArtifact(showModalToast);
  });

  document.getElementById("universalCopyOutputBtn").addEventListener("click", async () => {
    await navigator.clipboard.writeText(ToolEngine.currentArtifact.text || "");
    showModalToast("Copied to clipboard!");
  });

  document.getElementById("modalShareToolLinkBtn").addEventListener("click", () => {
    if (AppState.currentToolId) shareToolDirectLink(AppState.currentToolId);
  });

  document.getElementById("modalReportIssueBtn").addEventListener("click", () => {
    const t = ALL_TOOLS.find(x => x.id === AppState.currentToolId);
    closeToolModal(); 
    switchPage("complaint");
    if (t) {
      document.getElementById("compTool").value = `#${t.id} ${t.name} (${t.categoryName})`;
      document.getElementById("compMessage").focus();
    }
  });

  document.getElementById("mobileMenuBtn").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("-translate-x-full");
    document.getElementById("sidebarBackdrop").classList.toggle("hidden");
  });
  document.getElementById("sidebarBackdrop").addEventListener("click", closeMobileSidebar);

  document.getElementById("brandHomeBtn").addEventListener("click", () => {
    AppState.activeCategory = "all";
    AppState.favoritesOnly = false;
    AppState.searchQuery = "";
    searchInput.value = "";
    switchPage("hub");
    highlightActiveCategory();
    renderToolsGrid();
  });
}