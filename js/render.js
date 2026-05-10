import {
  state, authSession, authModeTab, activePatternId, activeProfileTab, selectedExchangeId,
  stickerPage, selectedStickerPatternId, selectedStickerIndex,
  setActiveProfileTab, setSelectedExchangeId, setStickerPage,
  hasActiveSession, updateChromeCopy, currentLanguage, t,
  getActivePattern, getActiveProfileTab, findPattern, findProfile,
  getFieldGroups, getFieldGroup, isGroupVisibleForPattern, renderGroupPatternSummary,
  getGroupLabel, getLinkTypeLabel, getThemeName, getThemeDescription,
  getPaperFrame, getPaperFrameName, getPaperFrameDescription, getPaperFrameStyle,
  getDisplayName, getFieldValue, getSticker, getStickerPickerCatalog,
  getCurrentPlan, formatDate, saveState, getPublicUrl
} from './store.js';
import { THEMES, PAPER_FRAMES, STICKERS_PER_PAGE, DEMO_PROFILES, LINK_TYPES } from './data.js';
import { PLAN_LIMITS } from './constants.js';
import { escapeHtml, escapeAttribute, linkify, makeStickerImage, initialOf, clamp } from './utils.js';

// ── routing ───────────────────────────────────────────────────────────────────

export function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "profile" && parts[1]) return { name: "profile", id: parts[1] };
  if (parts[0] === "design") return { name: "design" };
  if (parts[0] === "stickers") return { name: "stickers" };
  if (parts[0] === "book") return { name: "book" };
  if (parts[0] === "guide") return { name: "guide" };
  if (parts[0] === "settings") return { name: "settings" };
  return { name: "mine" };
}

function updateNav(name) {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    node.classList.toggle("active", node.dataset.nav === name);
  });
}

export function render() {
  const app = document.querySelector("#app");
  const route = parseRoute();
  updateNav(route.name);
  updateChromeCopy();
  document.querySelector('.topnav').style.display = hasActiveSession() ? '' : 'none';

  if (route.name === "profile") {
    app.innerHTML = renderPublicProfile(route.id);
    return;
  }

  if (!hasActiveSession()) {
    app.innerHTML = renderAuthGate();
    return;
  }

  if (route.name === "design") { app.innerHTML = renderDesign(); return; }
  if (route.name === "stickers") { app.innerHTML = renderStickers(); return; }
  if (route.name === "book") { app.innerHTML = renderBook(); return; }
  if (route.name === "guide") { app.innerHTML = renderGuide(); return; }
  if (route.name === "settings") { app.innerHTML = renderSettings(); return; }

  app.innerHTML = renderMine();
}

// ── auth screen ───────────────────────────────────────────────────────────────

function authCopy() {
  const isEn = currentLanguage() === "en";
  return {
    title: isEn ? "Start Memoria" : "Memoria をはじめる",
    subtitle: isEn
      ? "Sign up with email, or try first without registration."
      : "メール登録で使い始めるか、登録せずにおためし利用できます。",
    registerTab: isEn ? "Register" : "新規登録",
    loginTab: isEn ? "Login" : "ログイン",
    email: isEn ? "Email" : "メールアドレス",
    password: isEn ? "Password" : "パスワード",
    passwordConfirm: isEn ? "Confirm password" : "パスワード確認",
    registerButton: isEn ? "Create account" : "アカウント作成",
    loginButton: isEn ? "Login" : "ログイン",
    trialTitle: isEn ? "Use without registration" : "登録せずに利用する",
    trialDesc: isEn
      ? "Trial mode stores data only in this browser session on this device."
      : "おためし利用では、この端末の現在セッションにのみデータが保存されます。",
    trialButton: isEn ? "Start trial" : "おためし開始",
    soon: isEn ? "Google / Apple login will be added later." : "Google / Apple ログインは今後追加予定です。",
    localOnly: isEn ? "MVP note: account data is stored only in your browser." : "MVP注記: アカウント情報はブラウザ内保存です。"
  };
}

function renderAuthGate() {
  const copy = authCopy();
  const registerActive = authModeTab !== "login";
  return `
    <section class="auth-shell">
      <article class="panel pad auth-card stack">
        <div>
          <h1>${copy.title}</h1>
          <p class="muted">${copy.subtitle}</p>
        </div>
        <div class="auth-mode-tabs" role="tablist" aria-label="auth mode">
          <button type="button" class="auth-mode-btn ${registerActive ? "active" : ""}" data-action="auth-set-mode" data-auth-mode="register">${copy.registerTab}</button>
          <button type="button" class="auth-mode-btn ${registerActive ? "" : "active"}" data-action="auth-set-mode" data-auth-mode="login">${copy.loginTab}</button>
        </div>
        ${registerActive ? `
          <div class="auth-form stack">
            <label>${copy.email}<input type="email" data-auth-register-email autocomplete="email"></label>
            <label>${copy.password}<input type="password" data-auth-register-password autocomplete="new-password"></label>
            <label>${copy.passwordConfirm}<input type="password" data-auth-register-password-confirm autocomplete="new-password"></label>
            <button type="button" data-action="auth-register">${copy.registerButton}</button>
          </div>
        ` : `
          <div class="auth-form stack">
            <label>${copy.email}<input type="email" data-auth-login-email autocomplete="username"></label>
            <label>${copy.password}<input type="password" data-auth-login-password autocomplete="current-password"></label>
            <button type="button" data-action="auth-login">${copy.loginButton}</button>
          </div>
        `}
        <div class="auth-guest stack">
          <strong>${copy.trialTitle}</strong>
          <p class="muted small">${copy.trialDesc}</p>
          <button type="button" class="secondary" data-action="auth-start-guest">${copy.trialButton}</button>
        </div>
        <p class="muted small">${copy.soon}</p>
        <p class="muted small">${copy.localOnly}</p>
      </article>
    </section>
  `;
}

// ── mine / pattern editor ─────────────────────────────────────────────────────

function renderMine() {
  const tabId = getActiveProfileTab();
  const pattern = tabId === "general" ? getActivePattern() : findPattern(tabId);

  return `
    <section class="section-title">
      <div>
        <h1>${t("mine.title")}</h1>
        <p class="muted">${t("mine.subtitle")}</p>
      </div>
      ${pattern ? `<a class="button secondary" href="#profile/${pattern.id}">${t("mine.viewPublic")}</a>` : ""}
    </section>

    <section class="panel pad pattern-toolbar">
      <div class="pattern-label">
        <span>${t("mine.pattern")}</span>
        <button type="button" class="icon-button" data-action="add-pattern" aria-label="${t("mine.addPattern")}" title="${t("mine.addPattern")}">+</button>
      </div>
      ${renderProfileTabs({ includeGeneral: true })}
    </section>

    ${tabId === "general" ? renderGeneralTab() : renderPatternTabEditor(pattern)}
  `;
}

function renderGeneralTab() {
  return `
    <div class="phone-workspace">
      <section class="panel pad stack phone-screen">
        ${renderGroupManager()}
      </section>
    </div>
  `;
}

function renderPatternTabEditor(pattern) {
  if (!pattern) {
    setActiveProfileTab("general");
    return renderGeneralTab();
  }

  return `
    <div class="phone-workspace">
      <section class="panel pad stack phone-screen" aria-label="${t("pattern.editorAria")}">
        <div class="section-title">
          <div>
            <h2>${escapeHtml(pattern.patternName)}</h2>
            <span class="muted small">${escapeHtml(pattern.audience)} / ${escapeHtml(pattern.description)}</span>
          </div>
          <button type="button" class="icon-button" data-action="open-pattern-editor" data-pattern-id="${pattern.id}" aria-label="${t("pattern.edit")}" title="${t("pattern.edit")}">&#9998;</button>
        </div>
        ${renderPatternEditor(pattern)}
        <div class="row">
          <a class="button secondary" href="#profile/${pattern.id}">${t("pattern.preview")}</a>
          <a class="button secondary" href="#design">${t("pattern.design")}</a>
          <a class="button secondary" href="#stickers">${t("pattern.stickers")}</a>
        </div>
      </section>
    </div>
  `;
}

export function renderProfileTabs(options = {}) {
  const includeGeneral = options.includeGeneral !== false;
  const active = includeGeneral ? getActiveProfileTab() : activePatternId;
  return `
    <div class="profile-tabs" role="tablist" aria-label="${t("tab.aria")}">
      ${includeGeneral ? `
        <button type="button" class="profile-tab ${active === "general" ? "active" : ""}" data-action="select-profile-tab" data-tab-id="general">
          <strong>${t("general.title")}</strong>
          <span>${t("general.sharedSettings")}</span>
        </button>
      ` : ""}
      ${state.patterns.map((pattern) => `
        <button type="button" class="profile-tab ${active === pattern.id ? "active" : ""}" data-action="select-profile-tab" data-tab-id="${pattern.id}">
          <strong>${escapeHtml(pattern.patternName)}</strong>
          <span>${escapeHtml(pattern.audience)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderPatternEditor(pattern) {
  return `
    <div class="stack">
      ${renderAvatarEditor(pattern)}
      ${renderFieldGroups(pattern)}
      ${renderLinksEditor(pattern)}
    </div>
  `;
}

function renderFieldEditor(pattern, field) {
  return `
    <div class="field-card">
      <div class="field-card-head">
        <strong>${escapeHtml(field.label)}</strong>
        <button type="button" class="icon-button more-button" data-action="open-field-editor" data-pattern-id="${pattern.id}" data-field-key="${field.key}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      <p>${linkify(escapeHtml(field.value || t("fields.unset")))}</p>
    </div>
  `;
}

function renderFieldGroups(pattern) {
  return `
    <div class="stack">
      <h3>${t("fields.title")}</h3>
      ${getFieldGroups().map((group) => {
        if (!isGroupVisibleForPattern(group, pattern.id)) return "";
        const fields = pattern.fields.filter((field) => field.group === group.id);
        return `
          <details class="field-group" open>
            <summary>
              <span>${escapeHtml(getGroupLabel(group))} <span class="muted small">${t("fields.count", { count: fields.length })}</span></span>
              <button type="button" class="icon-button mini-button" data-action="open-add-field" data-pattern-id="${pattern.id}" data-group-id="${group.id}" aria-label="${t("fields.add")}" title="${t("fields.add")}">+</button>
            </summary>
            <div class="field-list">
              ${fields.length ? fields.map((field) => renderFieldEditor(pattern, field)).join("") : `<p class="muted small">${t("fields.none")}</p>`}
            </div>
          </details>
        `;
      }).join("")}
    </div>
  `;
}

function renderGroupManager() {
  const groups = getFieldGroups().map((group) => ({ group, items: collectSharedFieldsByGroup(group.id) }));
  return `
    <div class="stack">
      <div class="section-title">
        <h3>${t("fields.title")}</h3>
        <button type="button" data-action="open-add-group">${t("groups.addTitle")}</button>
      </div>
      <div class="group-stack">
        ${groups.map(({ group, items }) => renderGeneralGroupBlock(group, items)).join("")}
      </div>
    </div>
  `;
}

function renderGeneralGroupBlock(group, items) {
  const summary = renderGroupPatternSummary(group);
  return `
    <details class="group-block group-accordion" open>
      <summary class="group-block-head">
        <span class="group-block-title">
          <strong>${escapeHtml(getGroupLabel(group))}</strong>
          <span class="muted small">[${escapeHtml(summary)}]</span>
        </span>
      </summary>
      <div class="group-block-actions">
        <button type="button" class="secondary mini-add-item" data-action="open-add-general-field" data-group-id="${group.id}">${t("fields.add")}</button>
        <button type="button" class="icon-button mini-button" data-action="open-group-editor" data-group-id="${group.id}" aria-label="${t("groups.edit")}" title="${t("groups.edit")}">&#9998;</button>
      </div>
      <div class="group-items">
        ${items.length ? items.map((item) => renderGeneralFieldCard(item)).join("") : `<p class="muted small">${t("fields.none")}</p>`}
      </div>
    </details>
  `;
}

function renderGeneralFieldCard(item) {
  return `
    <div class="field-card">
      <div class="field-card-head">
        <strong>${escapeHtml(item.label)}</strong>
        <button type="button" class="icon-button more-button" data-action="open-general-field-editor" data-field-uid="${item.uid}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      <p>${linkify(escapeHtml(item.value || t("fields.unset")))}</p>
    </div>
  `;
}

function collectSharedFieldsByGroup(groupId) {
  const map = new Map();
  state.patterns.forEach((pattern) => {
    if (!isGroupVisibleForPattern(getFieldGroup(groupId), pattern.id)) return;
    pattern.fields.forEach((field) => {
      if (field.group !== groupId) return;
      if (field.key === "displayName") return;
      const uid = field.uid || `${groupId}:${field.label}`;
      if (!map.has(uid)) {
        map.set(uid, {
          uid,
          label: field.label || t("field.newLabel"),
          value: field.value || "",
          patternIds: new Set(),
          fieldRefs: []
        });
      }
      const item = map.get(uid);
      item.patternIds.add(pattern.id);
      if (!item.value && field.value) item.value = field.value;
      item.fieldRefs.push({ patternId: pattern.id, fieldKey: field.key });
    });
  });
  return Array.from(map.values()).map((item) => {
    const names = state.patterns.filter((pattern) => item.patternIds.has(pattern.id)).map((pattern) => pattern.patternName);
    return {
      ...item,
      summary: names.length ? names.join(" / ") : t("groups.summaryNone")
    };
  });
}

function renderLinksEditor(pattern) {
  const links = pattern.links || [];
  return `
    <div class="stack">
      <div class="section-title">
        <h3>${t("links.title")}</h3>
        <button type="button" class="icon-button mini-button" data-action="open-add-link" data-pattern-id="${pattern.id}" aria-label="${t("links.add")}" title="${t("links.add")}">+</button>
      </div>
      <div class="link-list">
        ${links.map((link) => renderLinkCard(pattern, link)).join("") || `<p class="muted small">${t("links.none")}</p>`}
      </div>
    </div>
  `;
}

function renderLinkCard(pattern, link) {
  const urlText = formatLinkText(link.url);
  const visibility = link.visible ? t("links.visible") : t("groups.summaryNone");
  return `
    <div class="field-card link-card">
      <div class="field-card-head">
        <strong>${escapeHtml(getLinkTypeLabel(link.type))}</strong>
        <button type="button" class="icon-button more-button" data-action="open-link-editor" data-pattern-id="${pattern.id}" data-link-id="${link.id}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      ${link.url ? `<a class="link-card-url" href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(urlText)}</a>` : `<p class="muted small">${t("fields.unset")}</p>`}
      <span class="muted small">${visibility}</span>
    </div>
  `;
}

function formatLinkText(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const tail = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${parsed.hostname}${tail}`.slice(0, 72);
  } catch {
    return String(url).slice(0, 72);
  }
}

// ── design ────────────────────────────────────────────────────────────────────

function renderThemeChoice(pattern, theme) {
  const active = pattern.themeId === theme.id ? " active" : "";
  const locked = !theme.free && state.plan === "free";
  return `
    <button type="button" class="theme-choice${active}${locked ? " locked" : ""}" data-action="set-theme" data-theme-id="${theme.id}">
      <strong>${escapeHtml(getThemeName(theme))}</strong>
      <span class="muted small">${escapeHtml(getThemeDescription(theme))}</span>
    </button>
  `;
}

function renderFrameChoice(pattern, frame) {
  const active = (pattern.frameId || "none") === frame.id ? " active" : "";
  const thumb = frame.src
    ? `<div class="frame-thumb"><img src="${escapeAttribute(frame.src)}" alt="${escapeAttribute(getPaperFrameName(frame))}"></div>`
    : `<div class="frame-thumb frame-thumb-none"><span>${currentLanguage() === "en" ? "No frame" : "枠なし"}</span></div>`;
  return `
    <button type="button" class="frame-choice${active}" data-action="open-frame-preview" data-frame-id="${frame.id}">
      ${thumb}
      <strong>${escapeHtml(getPaperFrameName(frame))}</strong>
      <span class="muted small">${escapeHtml(getPaperFrameDescription(frame))}</span>
    </button>
  `;
}

function renderDesign() {
  const pattern = getActivePattern();
  const frameSectionTitle = currentLanguage() === "en" ? "Frame" : "フレーム";
  return `
    <section class="section-title">
      <div>
        <h1>${t("design.title")}</h1>
        <p class="muted">${t("design.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("design.backMine")}</a>
    </section>
    <section class="panel pad pattern-toolbar">
      ${renderProfileTabs({ includeGeneral: false })}
    </section>
      <div class="split">
        <section class="panel pad stack">
          <h2>${t("design.paper")}</h2>
          <div class="theme-grid">
            ${THEMES.map((theme) => renderThemeChoice(pattern, theme)).join("")}
          </div>
          <h2>${frameSectionTitle}</h2>
          <div class="frame-grid">
            ${PAPER_FRAMES.map((frame) => renderFrameChoice(pattern, frame)).join("")}
          </div>
        </section>
      <section class="stack">
        <div class="section-title">
          <h2>${t("design.preview")}</h2>
          <a class="button secondary" href="#stickers">${t("design.toStickers")}</a>
        </div>
        ${renderProfilePaper(pattern, { editable: false })}
      </section>
    </div>
  `;
}

// ── stickers ──────────────────────────────────────────────────────────────────

function renderStickers() {
  const pattern = getActivePattern();
  const stickerCatalog = getStickerPickerCatalog();
  const totalPages = Math.max(1, Math.ceil(stickerCatalog.length / STICKERS_PER_PAGE));
  const currentPage = clamp(Number(stickerPage) || 1, 1, totalPages);
  if (currentPage !== stickerPage) setStickerPage(currentPage);
  const start = (currentPage - 1) * STICKERS_PER_PAGE;
  const pageItems = stickerCatalog.slice(start, start + STICKERS_PER_PAGE);
  return `
    <section class="section-title">
      <div>
        <h1>${t("stickers.title")}</h1>
        <p class="muted">${t("stickers.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("stickers.backMine")}</a>
    </section>
    <section class="panel pad pattern-toolbar">
      ${renderProfileTabs({ includeGeneral: false })}
    </section>
    <div class="split">
      <section class="panel pad stack">
        <h2>${t("stickers.panel")}</h2>
        ${renderCustomStickerUploader()}
        <div class="sticker-grid">
          ${pageItems.map((sticker) => renderStickerChoice(sticker)).join("")}
        </div>
        ${renderStickerPagination(currentPage, totalPages)}
      </section>
      <section class="stack">
        <div class="section-title">
          <div>
            <h2>${t("stickers.placement")}</h2>
            <span class="muted small">${escapeHtml(pattern.patternName)}</span>
          </div>
          <span class="muted small">${t("stickers.drag")}</span>
        </div>
        ${renderProfilePaper(pattern, { editable: true })}
      </section>
    </div>
  `;
}

// ── public profile ────────────────────────────────────────────────────────────

function renderPublicProfile(profileId) {
  const profile = findProfile(profileId);
  if (!profile) {
    return `
      <section class="empty-state">
        <h1>${t("public.notFoundTitle")}</h1>
        <p class="muted">${t("public.notFoundDesc")}</p>
        <a class="button" href="#mine">${t("public.backMine")}</a>
      </section>
    `;
  }

  const already = state.exchanges.some((exchange) => exchange.targetProfileId === profile.id);

  return `
    <section class="section-title">
      <div>
        <h1>${escapeHtml(getDisplayName(profile))}</h1>
        <p class="muted">${escapeHtml(profile.patternName)} / ${escapeHtml(profile.audience)}</p>
      </div>
      <a class="button secondary" href="#mine">${t("public.back")}</a>
    </section>

    <div class="split">
      ${renderProfilePaper(profile, { editable: false })}
      <aside class="profile-actions">
        <h2>${t("public.exchangeTitle")}</h2>
        <p class="muted">${t("public.exchangeDesc")}</p>
        <label>
          ${t("public.eventLabel")}
          <input data-exchange-event value="${t("public.eventDefault")}">
        </label>
        <button type="button" data-action="save-exchange" data-profile-id="${profile.id}">
          ${already ? t("public.exchangeAgain") : t("public.exchangeAdd")}
        </button>
        <a class="button secondary" href="#book">${t("public.viewBook")}</a>
      </aside>
    </div>
  `;
}

// ── book ──────────────────────────────────────────────────────────────────────

function renderBook() {
  const sorted = [...state.exchanges].sort((a, b) => b.exchangedAt.localeCompare(a.exchangedAt));
  const selected = sorted.find((exchange) => exchange.id === selectedExchangeId) || sorted[0];
  if (selected && selectedExchangeId !== selected.id) {
    setSelectedExchangeId(selected.id);
    saveState();
  }

  return `
    <section class="section-title">
      <div>
        <h1>${t("book.title")}</h1>
        <p class="muted">${t("book.subtitle")}</p>
      </div>
      <div class="row">
        <a class="button secondary" href="#profile/${DEMO_PROFILES[0].id}">${t("book.openDemo")}</a>
        <a class="button secondary" href="#mine">${t("book.myQr")}</a>
      </div>
    </section>

    <div class="book-layout">
      <aside class="panel pad stack">
        <div class="section-title">
          <h2>${t("book.history")}</h2>
          <span class="muted small">${t("book.count", { count: sorted.length })}</span>
        </div>
        ${sorted.length ? `<div class="exchange-list">${sorted.map(renderExchangeListItem).join("")}</div>` : renderEmptyBook()}
      </aside>
      <section class="panel pad">
        ${selected ? renderExchangeDetail(selected) : renderNoExchangeDetail()}
      </section>
    </div>
  `;
}

// ── guide ─────────────────────────────────────────────────────────────────────

function renderGuide() {
  const steps = [
    { badge: t("guide.step1.badge"), title: t("guide.step1.title"), desc: t("guide.step1.desc"), art: "profile" },
    { badge: t("guide.step2.badge"), title: t("guide.step2.title"), desc: t("guide.step2.desc"), art: "og" },
    { badge: t("guide.step3.badge"), title: t("guide.step3.title"), desc: t("guide.step3.desc"), art: "seen" },
    { badge: t("guide.step4.badge"), title: t("guide.step4.title"), desc: t("guide.step4.desc"), art: "hello" }
  ];

  return `
    <section class="section-title">
      <div>
        <h1>${t("guide.title")}</h1>
        <p class="muted">${t("guide.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("guide.openMvp")}</a>
    </section>

    <section class="guide-grid">
      ${steps.map((step) => `
        <article class="panel pad guide-card">
          <div class="guide-card-head">
            <span class="guide-badge">${escapeHtml(step.badge)}</span>
            <h2>${escapeHtml(step.title)}</h2>
          </div>
          <div class="guide-illust">
            ${renderGuideIllustration(step.art)}
          </div>
          <p class="muted">${escapeHtml(step.desc)}</p>
        </article>
      `).join("")}
    </section>
  `;
}

// ── settings ──────────────────────────────────────────────────────────────────

export function settingsCopy() {
  const isEn = currentLanguage() === "en";
  return {
    title: isEn ? "Settings" : "設定",
    subtitle: isEn ? "Plan, account, export, and policy links." : "プラン・アカウント・出力・規約情報をまとめています。",
    usage: isEn ? "How It Works" : "サービスの使い方",
    usageDesc: isEn ? "Open usage page" : "使い方ページを開く",
    account: isEn ? "Account (email & auth logs)" : "登録情報（メールアドレス・認証ログ）",
    accountDesc: isEn ? "sample@memoria.app / Password, Google (last login: 2026-05-09)" : "sample@memoria.app / パスワード・Google（最終ログイン: 2026-05-09）",
    planCompare: isEn ? "Free vs Paid" : "無料版と有料版",
    planCompareDesc: isEn ? "Compare limits and paid features." : "上限と有料機能の違いです。",
    freePlanName: isEn ? "Free" : "無料版",
    paidPlanName: isEn ? "Paid" : "有料版",
    featurePatterns: isEn ? "Patterns" : "パターン",
    featureGroups: isEn ? "Groups" : "グループ",
    featureFields: isEn ? "Fields" : "項目",
    featureStickers: isEn ? "Sticker use" : "シール",
    featureCsv: isEn ? "CSV export" : "CSV出力",
    featureExchanges: isEn ? "Met-people records" : "会った人の記録",
    stickerFree: isEn ? "designated only" : "指定シールのみ",
    stickerPaid: isEn ? "custom image upload" : "任意画像アップロード可",
    csvFree: isEn ? "not available" : "利用不可",
    csvPaid: isEn ? "available" : "利用可",
    currentPlanLabel: isEn ? "Current plan" : "現在のプラン",
    buyPaid: isEn ? "Purchase paid plan" : "有料版を購入",
    paidEnabled: isEn ? "Paid plan enabled" : "有料版利用中",
    csv: isEn ? "Export met-people CSV" : "会った人の記録CSV出力",
    csvBadge: isEn ? "Pro" : "有料",
    csvDesc: isEn ? "Available on paid plans" : "有料プランで利用可能",
    orgTitle: isEn ? "For teams / organizations" : "団体・法人向け",
    orgDesc: isEn
      ? "We will provide bulk user pre-registration and QR code issuance."
      : "先にまとめてユーザー登録し、QRコードを発行する仕組みを提供予定です。",
    web: isEn ? "Memoria Website" : "MemoriaのWebページ",
    terms: isEn ? "Terms of Service" : "会員規約",
    privacy: isEn ? "Privacy Policy" : "プライバシーポリシー",
    company: isEn ? "Operator Info" : "運営情報",
    external: isEn ? "Open in new tab" : "別窓で開く",
    proTitle: isEn ? "Paid feature" : "有料機能",
    proBody: isEn ? "CSV export is available on paid plans." : "CSV出力は有料プランで利用できます。"
  };
}

function renderPlanComparison(copy) {
  const currentPlan = getCurrentPlan();
  const rows = [
    { label: copy.featurePatterns, free: String(PLAN_LIMITS.free.patterns), pro: String(PLAN_LIMITS.pro.patterns) },
    { label: copy.featureGroups, free: String(PLAN_LIMITS.free.groups), pro: String(PLAN_LIMITS.pro.groups) },
    { label: copy.featureFields, free: String(PLAN_LIMITS.free.fields), pro: String(PLAN_LIMITS.pro.fields) },
    { label: copy.featureExchanges, free: String(PLAN_LIMITS.free.exchanges), pro: String(PLAN_LIMITS.pro.exchanges) === "Infinity" ? (currentLanguage() === "en" ? "Unlimited" : "無制限") : String(PLAN_LIMITS.pro.exchanges) },
    { label: copy.featureStickers, free: copy.stickerFree, pro: copy.stickerPaid },
    { label: copy.featureCsv, free: copy.csvFree, pro: copy.csvPaid }
  ];
  return `
    <article class="settings-item settings-plan">
      <strong>${copy.planCompare}</strong>
      <span class="muted small">${copy.planCompareDesc}</span>
      <div class="plan-compare">
        <div class="plan-col">
          <h4>${copy.freePlanName}</h4>
          ${rows.map((row) => `<div class="plan-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.free)}</strong></div>`).join("")}
        </div>
        <div class="plan-col">
          <h4>${copy.paidPlanName}</h4>
          ${rows.map((row) => `<div class="plan-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.pro)}</strong></div>`).join("")}
        </div>
      </div>
      <div class="plan-actions">
        <span class="muted small">${copy.currentPlanLabel}: ${currentPlan === "pro" ? copy.paidPlanName : copy.freePlanName}</span>
        <button type="button" class="secondary" data-action="open-plan-upgrade" ${currentPlan === "pro" ? "disabled" : ""}>${currentPlan === "pro" ? copy.paidEnabled : copy.buyPaid}</button>
      </div>
    </article>
  `;
}

function formatAuthTimestamp(value) {
  if (!value) return "-";
  try {
    return formatDate(value);
  } catch {
    return "-";
  }
}

function renderAccountStatus() {
  const isEn = currentLanguage() === "en";
  if (authSession.mode === "user") {
    const email = authSession.email || "-";
    const lastLogin = formatAuthTimestamp(authSession.lastLoginAt);
    return {
      description: isEn
        ? `${email} / Email login (last login: ${lastLogin})`
        : `${email} / メールログイン（最終ログイン: ${lastLogin}）`,
      action: `<button type="button" class="secondary settings-account-action" data-action="auth-logout">${isEn ? "Sign out" : "ログアウト"}</button>`
    };
  }
  if (authSession.mode === "guest") {
    return {
      description: isEn
        ? "Trial mode (session only on this device). Register to keep data."
        : "おためし利用中（この端末のセッションのみ）。データを残すには登録してください。",
      action: `<button type="button" class="secondary settings-account-action" data-action="auth-logout">${isEn ? "Back to auth" : "認証選択へ戻る"}</button>`
    };
  }
  return {
    description: isEn ? "Not authenticated" : "未認証",
    action: ""
  };
}

function renderSettings() {
  const copy = settingsCopy();
  const account = renderAccountStatus();
  return `
    <section class="section-title">
      <div>
        <h1>${copy.title}</h1>
        <p class="muted">${copy.subtitle}</p>
      </div>
      <a class="button secondary" href="#mine">${t("mine.title")}</a>
    </section>
    <section class="panel pad settings-menu">
      <a class="settings-item" href="#guide">
        <strong>${copy.usage}</strong>
        <span class="muted small">${copy.usageDesc}</span>
      </a>
      ${renderPlanComparison(copy)}
      <article class="settings-item">
        <strong>${copy.account}</strong>
        <span class="muted small">${account.description}</span>
        ${account.action}
      </article>
      <button type="button" class="settings-item settings-action" data-action="open-csv-upgrade">
        <strong>${copy.csv} <span class="settings-badge">${copy.csvBadge}</span></strong>
        <span class="muted small">${copy.csvDesc}</span>
      </button>
      <article class="settings-item">
        <strong>${copy.orgTitle}</strong>
        <span class="muted small">${copy.orgDesc}</span>
      </article>
      <a class="settings-item" href="https://profile.ac7.co.jp/" target="_blank" rel="noreferrer">
        <strong>${copy.web}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/terms" target="_blank" rel="noreferrer">
        <strong>${copy.terms}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/privacy" target="_blank" rel="noreferrer">
        <strong>${copy.privacy}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/about" target="_blank" rel="noreferrer">
        <strong>${copy.company}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
    </section>
  `;
}

// ── book sub-renders ──────────────────────────────────────────────────────────

function renderEmptyBook() {
  return `
    <div class="empty-state stack">
      <strong>${t("book.noHistoryTitle")}</strong>
      <p class="muted">${t("book.noHistoryDesc")}</p>
      <a class="button" href="#profile/${DEMO_PROFILES[0].id}">${t("book.openDemo")}</a>
    </div>
  `;
}

function renderNoExchangeDetail() {
  return `
    <div class="empty-state">
      <h2>${t("book.selectTitle")}</h2>
      <p class="muted">${t("book.selectDesc")}</p>
    </div>
  `;
}

function renderExchangeListItem(exchange) {
  const active = exchange.id === selectedExchangeId ? " active" : "";
  return `
    <button type="button" class="exchange-card${active}" data-action="select-exchange" data-exchange-id="${exchange.id}">
      <strong>${escapeHtml(exchange.snapshot.displayName)}</strong>
      <span class="muted small">${formatDate(exchange.exchangedAt)} / ${escapeHtml(exchange.eventName || t("book.eventUnset"))}</span>
      <span class="muted small">${escapeHtml(exchange.snapshot.title || "")}</span>
    </button>
  `;
}

function renderExchangeDetail(exchange) {
  const tagsValue = (exchange.tags || []).join(", ");
  return `
    <div class="stack">
      <div class="section-title">
        <h2>${t("book.cardTitle")}</h2>
        <a class="button secondary" href="#profile/${exchange.targetProfileId}">${t("book.currentProfile")}</a>
      </div>
      <div class="snapshot">
        <div class="avatar">${escapeHtml(initialOf(exchange.snapshot.displayName))}</div>
        <div>
          <h3>${escapeHtml(exchange.snapshot.displayName)}</h3>
          <p class="muted">${escapeHtml(exchange.snapshot.title || "")}</p>
          <p>${escapeHtml(exchange.snapshot.oneLiner || "")}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(exchange.method)}</span>
            <span class="tag">${escapeHtml(exchange.eventName || t("book.eventUnset"))}</span>
            <span class="tag">${formatDate(exchange.exchangedAt)}</span>
          </div>
        </div>
      </div>
      <label>
        ${t("book.note")}
        <textarea data-exchange-note="${exchange.id}">${escapeHtml(exchange.privateNote || "")}</textarea>
      </label>
      <label>
        ${t("book.tags")}
        <input data-exchange-tags="${exchange.id}" value="${escapeAttribute(tagsValue)}" placeholder="${t("book.tagsPlaceholder")}">
      </label>
      <p class="muted small">${t("book.noteHint")}</p>
    </div>
  `;
}

// ── profile paper ─────────────────────────────────────────────────────────────

export function renderProfilePaper(profile, options) {
  const visibleFields = profile.fields.filter((field) => field.visible && field.key !== "displayName");
  const visibleLinks = (profile.links || []).filter((link) => link.visible && link.url);
  const themeClass = `theme-${profile.themeId === "pink" ? "friends" : profile.themeId}`;
  const frame = getPaperFrame(profile.frameId);
  const frameStyle = getPaperFrameStyle(frame);
  return `
    <article class="profile-paper ${themeClass}${frame.id !== "none" ? " has-image-frame" : ""}" data-profile-paper="${profile.id}" ${frameStyle ? `style="${escapeAttribute(frameStyle)}"` : ""} ${options.editable ? "data-action=\"clear-sticker-selection\"" : ""}>
      <div class="paper-lines"></div>
      ${profile.stickers.map((sticker, index) => renderPlacedSticker(sticker, index, options.editable, profile.id)).join("")}
      <div class="profile-content">
        <header class="profile-head">
          ${renderProfileAvatar(profile)}
          <div>
            <p class="muted">${escapeHtml(profile.patternName)} / ${escapeHtml(profile.audience)}</p>
            <h2 class="profile-name">${escapeHtml(getDisplayName(profile))}</h2>
          </div>
        </header>
        ${renderAnswerGroups(visibleFields, profile)}
        ${visibleLinks.length ? renderProfileLinks(visibleLinks) : ""}
      </div>
    </article>
  `;
}

function renderPlacedSticker(stickerPlacement, index, editable, patternId) {
  const sticker = getSticker(stickerPlacement.id);
  if (!sticker) return "";
  const size = clamp(Number(stickerPlacement.size || 116), 64, 220);
  const selected = editable && selectedStickerPatternId === patternId && selectedStickerIndex === index;
  return `
    <div
      class="placed-sticker ${sticker.className}${selected ? " selected" : ""}"
      style="left: ${Number(stickerPlacement.x).toFixed(1)}%; top: ${Number(stickerPlacement.y).toFixed(1)}%; width: ${size}px; transform: rotate(${Number(stickerPlacement.rotation || 0).toFixed(1)}deg);"
      data-sticker-index="${index}"
      data-pattern-id="${patternId}"
      ${editable ? "data-action=\"select-placed-sticker\"" : ""}
      ${editable ? "data-draggable-sticker=\"true\"" : ""}
    >
      ${editable && selected ? `
        <div class="placed-sticker-controls" data-sticker-control="true">
          <button type="button" class="sticker-ctl" data-sticker-control="true" data-action="resize-placed-sticker" data-sticker-index="${index}" data-delta="-12" aria-label="${t("sticker.decrease")}">−</button>
          <button type="button" class="sticker-ctl" data-sticker-control="true" data-action="resize-placed-sticker" data-sticker-index="${index}" data-delta="12" aria-label="${t("sticker.increase")}">＋</button>
          <button type="button" class="sticker-ctl danger" data-sticker-control="true" data-action="remove-placed-sticker" data-sticker-index="${index}" aria-label="${t("sticker.remove")}">×</button>
        </div>
      ` : ""}
      ${renderStickerImage(sticker)}
    </div>
  `;
}

function renderAnswerGroups(fields, profile) {
  const groups = getFieldGroups()
    .filter((group) => isGroupVisibleForPattern(group, profile.id))
    .map((group) => ({ group, fields: fields.filter((field) => field.group === group.id) }))
    .filter((item) => item.fields.length > 0);

  return groups.map(({ group, fields: groupFields }) => `
    <section class="profile-group">
      <h3>${escapeHtml(getGroupLabel(group))}</h3>
      <dl class="answer-grid">
        ${groupFields.map(renderAnswer).join("")}
      </dl>
    </section>
  `).join("");
}

function renderProfileLinks(links) {
  return `
    <section class="profile-group">
      <h3>${t("profile.linksTitle")}</h3>
      <div class="profile-links">
        ${links.map((link) => `
          <a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(getLinkTypeLabel(link.type))}</span>
            <strong>${escapeHtml(formatLinkText(link.url) || link.url)}</strong>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAnswer(field) {
  return `
    <div class="answer">
      <dt>${escapeHtml(field.label)}</dt>
      <dd>${linkify(escapeHtml(field.value))}</dd>
    </div>
  `;
}

// ── guide illustrations ───────────────────────────────────────────────────────

function renderGuideIllustration(kind) {
  if (kind === "profile") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="profile illustration">
        <rect x="12" y="14" width="124" height="142" rx="14" fill="#fff6ea" stroke="#d8cfc7"/>
        <circle cx="74" cy="56" r="24" fill="#dff0ea" stroke="#2f7568" stroke-width="2"/>
        <rect x="40" y="88" width="68" height="10" rx="5" fill="#b7aca2"/>
        <rect x="32" y="106" width="84" height="8" rx="4" fill="#d8cfc7"/>
        <rect x="32" y="120" width="72" height="8" rx="4" fill="#d8cfc7"/>
        <rect x="164" y="26" width="142" height="120" rx="16" fill="#eef5ff" stroke="#c8d9ef"/>
        <rect x="182" y="46" width="104" height="12" rx="6" fill="#5f87b5"/>
        <rect x="182" y="68" width="88" height="9" rx="4.5" fill="#96aecd"/>
        <rect x="182" y="84" width="96" height="9" rx="4.5" fill="#96aecd"/>
        <rect x="182" y="100" width="72" height="9" rx="4.5" fill="#96aecd"/>
      </svg>
    `;
  }

  if (kind === "og") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="open graph illustration">
        <rect x="16" y="30" width="124" height="112" rx="12" fill="#ffffff" stroke="#d8cfc7"/>
        <rect x="32" y="46" width="92" height="54" rx="10" fill="#f8e0e8"/>
        <rect x="32" y="108" width="72" height="8" rx="4" fill="#b7aca2"/>
        <rect x="32" y="122" width="58" height="8" rx="4" fill="#d8cfc7"/>
        <path d="M154 86h34" stroke="#2f7568" stroke-width="4" stroke-linecap="round"/>
        <path d="M182 78l14 8-14 8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="204" y="26" width="102" height="120" rx="14" fill="#f7fbff" stroke="#c8d9ef"/>
        <rect x="218" y="42" width="74" height="40" rx="8" fill="#dff0ea"/>
        <rect x="218" y="90" width="70" height="8" rx="4" fill="#89a5c8"/>
        <rect x="218" y="104" width="56" height="8" rx="4" fill="#b7c9e0"/>
        <circle cx="286" cy="114" r="10" fill="#2f5f8f"/>
        <text x="286" y="118" text-anchor="middle" font-size="10" fill="#fff" font-family="Segoe UI, sans-serif">OG</text>
      </svg>
    `;
  }

  if (kind === "seen") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="seen greeting illustration">
        <rect x="20" y="30" width="120" height="108" rx="12" fill="#fffaf3" stroke="#d8cfc7"/>
        <circle cx="56" cy="66" r="16" fill="#dff0ea" stroke="#2f7568"/>
        <rect x="80" y="58" width="46" height="8" rx="4" fill="#8ca8c9"/>
        <rect x="80" y="74" width="38" height="8" rx="4" fill="#b9cbe2"/>
        <rect x="34" y="102" width="92" height="22" rx="11" fill="#2f7568"/>
        <text x="80" y="116" text-anchor="middle" font-size="12" fill="#fff" font-family="Segoe UI, sans-serif">みたよ</text>
        <rect x="178" y="24" width="122" height="122" rx="14" fill="#ffffff" stroke="#d8cfc7"/>
        <rect x="194" y="42" width="90" height="12" rx="6" fill="#5f87b5"/>
        <rect x="194" y="64" width="76" height="9" rx="4.5" fill="#b2c4dc"/>
        <rect x="194" y="80" width="84" height="9" rx="4.5" fill="#b2c4dc"/>
        <rect x="194" y="96" width="62" height="9" rx="4.5" fill="#b2c4dc"/>
        <circle cx="282" cy="116" r="12" fill="#f5c84c" stroke="#d3a533"/>
        <text x="282" y="120" text-anchor="middle" font-size="13" fill="#684f15" font-family="Segoe UI, sans-serif">✓</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 320 170" role="img" aria-label="app hello illustration">
      <rect x="26" y="26" width="112" height="120" rx="18" fill="#ffffff" stroke="#d8cfc7"/>
      <rect x="182" y="26" width="112" height="120" rx="18" fill="#ffffff" stroke="#d8cfc7"/>
      <circle cx="82" cy="62" r="18" fill="#e4eef8" stroke="#5f87b5"/>
      <circle cx="238" cy="62" r="18" fill="#f8e0e8" stroke="#b94d70"/>
      <rect x="52" y="96" width="60" height="24" rx="12" fill="#2f7568"/>
      <rect x="208" y="96" width="60" height="24" rx="12" fill="#2f7568"/>
      <text x="82" y="112" text-anchor="middle" font-size="11" fill="#fff" font-family="Segoe UI, sans-serif">こんにちは</text>
      <text x="238" y="112" text-anchor="middle" font-size="11" fill="#fff" font-family="Segoe UI, sans-serif">こんにちは</text>
      <path d="M132 70h56" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6"/>
      <path d="M182 62l14 8-14 8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M138 78l-14-8 14-8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

// ── avatar / sticker renders ──────────────────────────────────────────────────

function renderProfileAvatar(profile, className = "") {
  const extraClass = className ? ` ${className}` : "";
  const src = profile.avatarDataUrl || "";
  if (src) {
    return `<div class="avatar${extraClass}"><img src="${escapeAttribute(src)}" alt="${t("avatar.alt")}"></div>`;
  }
  return `<div class="avatar${extraClass}"><span>${escapeHtml(initialOf(getDisplayName(profile)))}</span></div>`;
}

function renderAvatarEditor(pattern) {
  return `
    <div class="add-box">
      <h3>${t("avatar.title")}</h3>
      <div class="avatar-editor">
        ${renderProfileAvatar(pattern, "preview-avatar")}
        <div class="avatar-editor-actions">
          <label class="file-button">
            <span>${t("avatar.pick")}</span>
            <input type="file" accept="image/*" data-profile-image-upload data-pattern-id="${pattern.id}">
          </label>
          ${pattern.avatarDataUrl ? `<button type="button" class="ghost cute-ghost" data-action="clear-profile-image" data-pattern-id="${pattern.id}">${t("avatar.clear")}</button>` : ""}
        </div>
      </div>
      <p class="muted small">${t("avatar.help")}</p>
    </div>
  `;
}

function renderStickerImage(sticker) {
  const src = sticker.assetSrc || makeStickerImage(sticker);
  return `<img class="sticker-image" src="${escapeAttribute(src)}" alt="${escapeAttribute(sticker.label)}">`;
}

function renderStickerChoice(sticker) {
  return `
    <button type="button" class="sticker-choice" data-action="add-sticker" data-sticker-id="${sticker.id}">
      ${renderStickerImage(sticker)}
      <span class="muted small">${getStickerSourceText(sticker.source)}</span>
    </button>
  `;
}

function renderCustomStickerUploader() {
  const isEn = currentLanguage() === "en";
  const isPro = getCurrentPlan() === "pro";
  const title = isEn ? "Custom Sticker" : "オリジナルシール";
  if (isPro) {
    return `
      <div class="sticker-upload-box">
        <strong>${title}</strong>
        <label class="file-button">
          <span>${isEn ? "Upload image" : "画像をアップロード"}</span>
          <input type="file" accept="image/*" data-custom-sticker-upload>
        </label>
      </div>
    `;
  }
  return `
    <div class="sticker-upload-box">
      <strong>${title}</strong>
      <p class="muted small">${isEn ? "Paid plan can upload any image as a sticker." : "有料版では任意の画像をシールとして追加できます。"}</p>
      <button type="button" class="secondary" data-action="open-plan-upgrade">${isEn ? "See paid plan" : "有料版をみる"}</button>
    </div>
  `;
}

function renderStickerPagination(currentPage, totalPages) {
  if (totalPages <= 1) return `<p class="muted small">1 / 1</p>`;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(`<button type="button" class="icon-button sticker-page-button ${i === currentPage ? "active" : ""}" data-action="sticker-page" data-page="${i}" aria-label="${t("stickers.page", { page: i })}">${i}</button>`);
  }

  return `
    <div class="sticker-pager">
      <button type="button" class="secondary" data-action="sticker-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>${t("stickers.prev")}</button>
      <div class="sticker-page-list">${pages.join("")}</div>
      <button type="button" class="secondary" data-action="sticker-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>${t("stickers.next")}</button>
    </div>
  `;
}

function getStickerSourceText(source) {
  if (source === "custom") return currentLanguage() === "en" ? "Custom" : "オリジナル";
  return t("stickers.free");
}

// ── QR code ───────────────────────────────────────────────────────────────────

export function makeQrSvg(text) {
  try {
    const matrix = makeQrMatrixV3L(text);
    const quiet = 4;
    const cell = 6;
    const size = matrix.length + quiet * 2;
    const rects = [];
    matrix.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) rects.push(`<rect x="${(x + quiet) * cell}" y="${(y + quiet) * cell}" width="${cell}" height="${cell}"/>`);
      });
    });
    return `
      <svg viewBox="0 0 ${size * cell} ${size * cell}" role="img" aria-label="${t("qr.aria")}">
        <rect width="${size * cell}" height="${size * cell}" fill="#fff"/>
        <g fill="#111">${rects.join("")}</g>
      </svg>
    `;
  } catch {
    return `<div class="empty-state small">${t("qr.tooLong")}</div>`;
  }
}

function makeQrMatrixV3L(text) {
  const version = 3;
  const size = version * 4 + 17;
  const dataCodewords = 55;
  const eccCodewords = 15;
  const bytes = Array.from(new TextEncoder().encode(text));
  if (bytes.length > 53) throw new Error("QR payload too long for version 3-L");

  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const setFunction = (x, y, dark) => {
    matrix[y][x] = dark;
    reserved[y][x] = true;
  };

  drawFinder(matrix, reserved, 0, 0);
  drawFinder(matrix, reserved, size - 7, 0);
  drawFinder(matrix, reserved, 0, size - 7);
  drawAlignment(matrix, reserved, 22, 22);

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }

  reserveFormatAreas(reserved, size);
  setFunction(8, size - 8, true);

  const data = makeDataCodewords(bytes, dataCodewords);
  const ecc = reedSolomonRemainder(data, reedSolomonDivisor(eccCodewords));
  const allCodewords = data.concat(ecc);
  const bits = [];
  allCodewords.forEach((codeword) => pushBits(bits, codeword, 8));

  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vert = 0; vert < size; vert += 1) {
      const y = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        if (reserved[y][x]) continue;
        const bit = bitIndex < bits.length ? bits[bitIndex] : 0;
        const mask = (x + y) % 2 === 0;
        matrix[y][x] = Boolean(bit ^ mask);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }

  drawFormatBits(matrix, reserved, size, 0);
  return matrix;
}

function drawFinder(matrix, reserved, left, top) {
  const size = matrix.length;
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const x = left + dx;
      const y = top + dy;
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      const dark =
        dx >= 0 && dx <= 6 && dy >= 0 && dy <= 6 &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      matrix[y][x] = dark;
      reserved[y][x] = true;
    }
  }
}

function drawAlignment(matrix, reserved, centerX, centerY) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      matrix[centerY + dy][centerX + dx] = distance !== 1;
      reserved[centerY + dy][centerX + dx] = true;
    }
  }
}

function reserveFormatAreas(reserved, size) {
  for (let i = 0; i <= 8; i += 1) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  reserved[8][8] = true;
  reserved[7][8] = true;
  reserved[8][7] = true;
  for (let i = 0; i < 8; i += 1) reserved[8][size - 1 - i] = true;
  for (let i = 0; i < 7; i += 1) reserved[size - 1 - i][8] = true;
}

function drawFormatBits(matrix, reserved, size, mask) {
  const bits = formatBits(mask);
  const getBit = (i) => ((bits >>> i) & 1) === 1;
  const set = (x, y, dark) => {
    matrix[y][x] = dark;
    reserved[y][x] = true;
  };

  for (let i = 0; i <= 5; i += 1) set(8, i, getBit(i));
  set(8, 7, getBit(6));
  set(8, 8, getBit(7));
  set(7, 8, getBit(8));
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, getBit(i));
  for (let i = 0; i < 8; i += 1) set(size - 1 - i, 8, getBit(i));
  for (let i = 8; i < 15; i += 1) set(8, size - 15 + i, getBit(i));
  set(8, size - 8, true);
}

function formatBits(mask) {
  const errorCorrectionLevelL = 1;
  const data = (errorCorrectionLevelL << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i += 1) {
    rem = (rem << 1) ^ (((rem >>> 9) & 1) ? 0x537 : 0);
  }
  return ((data << 10) | rem) ^ 0x5412;
}

function makeDataCodewords(bytes, capacity) {
  const bits = [];
  pushBits(bits, 0x4, 4);
  pushBits(bits, bytes.length, 8);
  bytes.forEach((byte) => pushBits(bits, byte, 8));

  const capacityBits = capacity * 8;
  pushBits(bits, 0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) value = (value << 1) | bits[i + j];
    codewords.push(value);
  }

  for (let pad = 0; codewords.length < capacity; pad += 1) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11);
  }

  return codewords;
}

function pushBits(bits, value, count) {
  for (let i = count - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
}

function reedSolomonDivisor(degree) {
  const result = Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonRemainder(data, divisor) {
  const result = Array(divisor.length).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] ^= gfMultiply(coefficient, factor);
    });
  });
  return result;
}

function gfMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
