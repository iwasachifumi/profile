import {
  STORAGE_KEY, AUTH_SESSION_KEY, AUTH_PREFS_KEY,
  USER_STATE_KEY_PREFIX, GUEST_STATE_KEY, PROFILE_BASE_URL, PLAN_LIMITS, LANGUAGES
} from './constants.js';
import { I18N } from './i18n.js';
import { FIELD_GROUPS, DEFAULT_GROUP_IDS, LINK_TYPES, THEMES, PAPER_FRAMES, STICKERS, DEMO_PROFILES } from './data.js';
import { makeId } from './utils.js';
import { fetchAllForUser, syncStateToSupabase } from './lib/db.js';

// ── mutable state ────────────────────────────────────────────────────────────

export let authSession = loadAuthSession();
export let authModeTab = "register";
export let state = loadState(authSession);
export let activePatternId = state.activePatternId || state.patterns[0].id;
export let activeProfileTab = state.activeProfileTab || "general";
export let selectedExchangeId = state.selectedExchangeId || (state.exchanges[0] && state.exchanges[0].id);
export let activeBookView = state.activeBookView || "list";
export let stickerPage = state.stickerPage || 1;
export let selectedStickerPatternId = "";
export let selectedStickerIndex = -1;
export let toastTimer = 0;

// ── setters ───────────────────────────────────────────────────────────────────

export function setAuthModeTab(v) { authModeTab = v; }
export function setActivePatternId(v) { activePatternId = v; }
export function setActiveProfileTab(v) { activeProfileTab = v; }
export function setSelectedExchangeId(v) { selectedExchangeId = v; }
export function setActiveBookView(v) { activeBookView = v; }
export function setStickerPage(v) { stickerPage = v; }
export function setSelectedStickerPatternId(v) { selectedStickerPatternId = v; }
export function setSelectedStickerIndex(v) { selectedStickerIndex = v; }
export function setToastTimer(v) { toastTimer = v; }

// ── auth ─────────────────────────────────────────────────────────────────────

export function hasActiveSession() {
  return authSession.mode === "guest" || authSession.mode === "user";
}

export function stateStorageKey(session = authSession) {
  if (session.mode === "guest") return GUEST_STATE_KEY;
  if (session.mode === "user" && session.userId) return `${USER_STATE_KEY_PREFIX}${session.userId}`;
  return "";
}

export function loadPreferredLanguage() {
  try {
    const raw = localStorage.getItem(AUTH_PREFS_KEY);
    if (!raw) return "ja";
    const parsed = JSON.parse(raw);
    return LANGUAGES.includes(parsed.language) ? parsed.language : "ja";
  } catch {
    return "ja";
  }
}

export function savePreferredLanguage(language) {
  if (!LANGUAGES.includes(language)) return;
  try {
    localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify({ language }));
  } catch {
    // ignore preference persistence errors
  }
}

// user モードの復元は Supabase Auth (localStorage 経由) が担当する。
// この関数は guest モードだけを sessionStorage から復元する。
// user モードの authSession は main.js 起動時 / events.js のサインインハンドラで
// saveAuthSession() 経由で投入される。
export function loadAuthSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return { mode: "none" };
    const parsed = JSON.parse(raw);
    if (parsed.mode === "guest") {
      return {
        mode: "guest",
        startedAt: parsed.startedAt || ""
      };
    }
    return { mode: "none" };
  } catch {
    return { mode: "none" };
  }
}

export function saveAuthSession(session) {
  authSession = session;
  if (!session || session.mode === "none") {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

// ── state management ─────────────────────────────────────────────────────────

export function applyState(nextState) {
  state = normalizeState(nextState);
  activePatternId = state.activePatternId || (state.patterns[0] && state.patterns[0].id) || "";
  if (!findPattern(activePatternId) && state.patterns[0]) activePatternId = state.patterns[0].id;
  activeProfileTab = state.activeProfileTab || "general";
  if (activeProfileTab !== "general" && !findPattern(activeProfileTab)) activeProfileTab = activePatternId;
  selectedExchangeId = state.selectedExchangeId || (state.exchanges[0] && state.exchanges[0].id) || "";
  activeBookView = state.activeBookView === "detail" ? "detail" : "list";
  stickerPage = Number.isFinite(Number(state.stickerPage)) && Number(state.stickerPage) > 0 ? Number(state.stickerPage) : 1;
  selectedStickerPatternId = "";
  selectedStickerIndex = -1;
}

export function defaultState() {
  // pattern.id は memoria.profiles.id (uuid) と一致させるため UUID で生成する。
  const studyId = crypto.randomUUID();
  const businessId = crypto.randomUUID();

  return {
    plan: "free",
    language: loadPreferredLanguage(),
    activePatternId: studyId,
    activeProfileTab: "general",
    selectedExchangeId: "",
    activeBookView: "list",
    stickerPage: 1,
    groups: FIELD_GROUPS.map((group) => ({ ...group })),
    customStickers: [],
    patterns: [
      {
        id: studyId,
        patternName: "勉強会用",
        audience: "勉強会",
        description: "技術イベントやコミュニティで渡すプロフィール。",
        themeId: "friends",
        frameId: "none",
        fields: [
          { key: "displayName", group: "basic", label: "表示名", value: "なまえ", visible: true },
          { key: "handle", group: "basic", label: "呼ばれ方", value: "呼ばれたい名前", visible: true },
          { key: "title", group: "work", label: "所属・肩書き", value: "作っているもの / していること", visible: true },
          { key: "oneLiner", group: "basic", label: "ひとこと", value: "今日はこの話がしたいです。", visible: true },
          { key: "topics", group: "conversation", label: "話しかけてほしい話題", value: "Web、イベント、プロダクト", visible: true },
          { key: "favorite", group: "favorite", label: "好きなもの", value: "コーヒー、道具、散歩", visible: true }
        ],
        links: [
          { id: makeId("link"), type: "website", label: "Web", url: "https://example.com", visible: true }
        ],
        stickers: [
          { id: "hello", x: 68, y: 16, rotation: 5 }
        ]
      },
      {
        id: businessId,
        patternName: "ビジネス用",
        audience: "ビジネス",
        description: "仕事や展示会で渡すプロフィール。",
        themeId: "business",
        frameId: "none",
        fields: [
          { key: "displayName", group: "basic", label: "表示名", value: "氏名", visible: true },
          { key: "handle", group: "basic", label: "呼ばれ方", value: "名字", visible: true },
          { key: "title", group: "work", label: "所属・肩書き", value: "会社 / 役割", visible: true },
          { key: "oneLiner", group: "basic", label: "ひとこと", value: "事業や相談できることを短く書く。", visible: true },
          { key: "topics", group: "conversation", label: "話したいこと", value: "協業、導入相談、イベント情報", visible: true }
        ],
        links: [
          { id: makeId("link"), type: "website", label: "Web", url: "https://example.com/business", visible: true }
        ],
        stickers: [
          { id: "met", x: 72, y: 72, rotation: -4 }
        ]
      }
    ],
    exchanges: []
  };
}

export function loadState(session = authSession) {
  const preferredLanguage = loadPreferredLanguage();
  const baseState = normalizeState(defaultState());
  baseState.language = preferredLanguage;

  const key = stateStorageKey(session);
  if (!key) return baseState;

  try {
    const storage = session.mode === "guest" ? sessionStorage : localStorage;
    let raw = storage.getItem(key);
    if (!raw && session.mode === "guest") {
      raw = localStorage.getItem(STORAGE_KEY);
    }
    if (!raw) return baseState;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.patterns) || parsed.patterns.length === 0) return baseState;
    const merged = normalizeState({ ...baseState, ...parsed });
    merged.language = LANGUAGES.includes(merged.language) ? merged.language : preferredLanguage;
    return merged;
  } catch {
    return baseState;
  }
}

export function normalizeState(nextState) {
  const savedGroups = Array.isArray(nextState.groups) ? nextState.groups : [];
  const patternIds = (nextState.patterns || []).map((pattern) => pattern.id);
  const defaultIds = DEFAULT_GROUP_IDS;
  const customGroups = savedGroups
    .filter((group) => group && group.id && group.name && !defaultIds.has(group.id))
    .map((group) => normalizeGroup(group, patternIds));

  nextState.groups = FIELD_GROUPS.map((group) => normalizeGroup(savedGroups.find((saved) => saved.id === group.id) || group, patternIds)).concat(customGroups);
  nextState.plan = nextState.plan === "pro" ? "pro" : "free";
  nextState.language = LANGUAGES.includes(nextState.language) ? nextState.language : "ja";
  nextState.patterns = nextState.patterns.map((pattern) => normalizePattern(pattern, nextState.language));
  const customStickers = Array.isArray(nextState.customStickers) ? nextState.customStickers : [];
  nextState.customStickers = customStickers
    .filter((sticker) => sticker && sticker.id && sticker.assetSrc)
    .map((sticker) => ({
      id: sticker.id,
      label: sticker.label || "Custom",
      assetSrc: sticker.assetSrc,
      source: "custom",
      className: sticker.className || "sticker-blue",
      variant: "asset",
      owned: true
    }));
  nextState.activeBookView = nextState.activeBookView === "detail" ? "detail" : "list";
  nextState.stickerPage = Number.isFinite(Number(nextState.stickerPage)) && Number(nextState.stickerPage) > 0 ? Number(nextState.stickerPage) : 1;
  return nextState;
}

function normalizeGroup(group, patternIds) {
  const savedPatternIds = Array.isArray(group.patternIds) ? group.patternIds.filter((id) => patternIds.includes(id)) : patternIds;
  return {
    id: group.id,
    name: group.name,
    patternIds: savedPatternIds.length ? savedPatternIds : patternIds
  };
}

function normalizePattern(pattern, language = "ja") {
  const linkFallback = language === "en" ? "Link" : "リンク";
  const fieldFallback = language === "en" ? "Field" : "項目";
  const audienceFallback = language === "en" ? "Audience" : "用途";
  const descriptionSuffix = language === "en" ? " profile." : "向けのプロフィール。";
  const links = Array.isArray(pattern.links) ? [...pattern.links] : [];
  const fields = (pattern.fields || [])
    .filter((field) => {
      if (field.key !== "links") return true;
      if (field.value) {
        links.push({
          id: makeId("link"),
          type: "website",
          label: field.label || linkFallback,
          url: field.value,
          visible: field.visible !== false
        });
      }
      return false;
    })
    .map((field) => ({
      uid: field.uid || field.key || makeId("fuid"),
      key: field.key || makeId("field"),
      group: field.group || guessFieldGroup(field.key),
      label: field.label || fieldFallback,
      value: field.value || "",
      visible: true
    }));

  return {
    ...pattern,
    description: pattern.description || `${pattern.audience || audienceFallback}${descriptionSuffix}`,
    frameId: getPaperFrame(pattern.frameId).id,
    fields,
    links: links.map((link) => ({
      id: link.id || makeId("link"),
      type: link.type || "website",
      label: link.label || translateForLanguage(`linkType.${link.type || "website"}`, language),
      url: link.url || "",
      visible: link.visible !== false
    })),
    stickers: Array.isArray(pattern.stickers) ? pattern.stickers : []
  };
}

function guessFieldGroup(key) {
  if (key === "title") return "work";
  if (key === "topics") return "conversation";
  if (key === "favorite") return "favorite";
  return "basic";
}

export function saveState() {
  state.activePatternId = activePatternId;
  state.activeProfileTab = activeProfileTab;
  state.selectedExchangeId = selectedExchangeId || "";
  state.activeBookView = activeBookView;
  state.stickerPage = stickerPage;
  savePreferredLanguage(currentLanguage());
  const key = stateStorageKey(authSession);
  if (!key) return;
  const storage = authSession.mode === "guest" ? sessionStorage : localStorage;
  storage.setItem(key, JSON.stringify(state));

  // user モードなら Supabase へも debounce 同期する。
  // 構造変化(削除)はここでは表現できないので、削除アクション側で
  // 個別に db.deleteProfile / db.deleteExchange を呼ぶこと。
  if (authSession.mode === "user") {
    scheduleSupabaseSync();
  }
}

// ── Supabase 同期 ────────────────────────────────────────────────────────────

let _syncTimer = 0;
let _syncPending = false;
const SYNC_DEBOUNCE_MS = 1500;

function scheduleSupabaseSync() {
  _syncPending = true;
  if (_syncTimer) return;
  _syncTimer = setTimeout(runSupabaseSync, SYNC_DEBOUNCE_MS);
}

async function runSupabaseSync() {
  _syncTimer = 0;
  if (!_syncPending) return;
  _syncPending = false;
  if (authSession.mode !== "user" || !authSession.userId) return;
  const { error } = await syncStateToSupabase(authSession.userId, authSession.email, state);
  if (error) {
    // ネットワーク切れ等のフォールバック: localStorage にはすでに書いてあるので
    // ロスト無し。ログだけ出して次回保存タイミングで再試行される。
    console.warn("[memoria] Supabase sync failed", error);
  }
}

// 即時同期(タブクローズ前等で使う想定。現状はexport だけ用意)。
export async function flushSupabaseSync() {
  if (_syncTimer) {
    clearTimeout(_syncTimer);
    _syncTimer = 0;
  }
  if (_syncPending) await runSupabaseSync();
}

// 起動時に Supabase からユーザーデータをロードして state に反映する。
// - 行が0件なら初回ログインとみなし、defaultState を投入(seed)
// - 取得に失敗したら localStorage にあるキャッシュを使う(既存の loadState フォールバック)
export async function loadStateFromSupabase(user) {
  if (!user || !user.id) return false;
  const result = await fetchAllForUser(user.id);
  if (result.error) {
    console.warn("[memoria] Supabase fetch failed, falling back to local cache", result.error);
    applyState(loadState(authSession));
    return false;
  }

  const isFirstLogin = result.profiles.length === 0 && !result.settings;
  const baseState = normalizeState(defaultState());

  if (isFirstLogin) {
    // 初回: defaultState(UUID 付き)をそのまま投入する
    applyState(baseState);
    saveState(); // localStorage キャッシュ + scheduleSupabaseSync() が走る
    return true;
  }

  // 既存データから state を復元
  const settingsData = result.settings?.data || {};
  const merged = normalizeState({
    ...baseState,
    plan: result.settings?.plan ?? "free",
    language: result.settings?.language ?? baseState.language,
    customStickers: settingsData.customStickers ?? [],
    groups: settingsData.groups ?? baseState.groups,
    patterns: result.profiles.length ? result.profiles : baseState.patterns,
    exchanges: result.exchanges ?? []
  });
  applyState(merged);
  // ローカルキャッシュも最新化(オフライン時の表示用)
  const key = stateStorageKey(authSession);
  if (key) {
    const storage = authSession.mode === "guest" ? sessionStorage : localStorage;
    storage.setItem(key, JSON.stringify(state));
  }
  return true;
}

// ── i18n ──────────────────────────────────────────────────────────────────────

export function currentLanguage() {
  return LANGUAGES.includes(state.language) ? state.language : "ja";
}

export function translateForLanguage(key, language, vars = {}) {
  const dict = I18N[language] || I18N.ja;
  const fallback = I18N.ja[key] || key;
  let text = dict[key] || fallback;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

export function t(key, vars = {}) {
  return translateForLanguage(key, currentLanguage(), vars);
}

// ── plan helpers ──────────────────────────────────────────────────────────────

export function getCurrentPlan() {
  return state.plan === "pro" ? "pro" : "free";
}

export function getPlanLimit(limitKey, plan = getCurrentPlan()) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits[limitKey];
}

export function formatLimit(limitValue, language = currentLanguage()) {
  if (Number.isFinite(limitValue)) return String(limitValue);
  return language === "en" ? "Unlimited" : "無制限";
}

export function countGroupTotal() {
  return getFieldGroups().length;
}

export function countFieldTotal() {
  const fieldUids = new Set();
  state.patterns.forEach((pattern) => {
    pattern.fields.forEach((field) => {
      if (!field || field.key === "displayName") return;
      fieldUids.add(field.uid || `${field.group}:${field.label}`);
    });
  });
  return fieldUids.size;
}

export function countExchangeTotal() {
  return Array.isArray(state.exchanges) ? state.exchanges.length : 0;
}

// ── label helpers ─────────────────────────────────────────────────────────────

export function getGroupLabel(group) {
  if (DEFAULT_GROUP_IDS.has(group.id)) {
    const key = `group.${group.id}`;
    const defaultName = FIELD_GROUPS.find((item) => item.id === group.id)?.name || "";
    const jaName = I18N.ja[key];
    const enName = I18N.en[key];
    if (!group.name || group.name === defaultName || group.name === jaName || group.name === enName) {
      return t(key);
    }
  }
  return group.name;
}

export function getLinkTypeLabel(typeId) {
  const key = `linkType.${typeId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return getLinkType(typeId).name;
}

export function getThemeName(theme) {
  const key = `theme.${theme.id}.name`;
  const translated = t(key);
  return translated === key ? theme.name : translated;
}

export function getThemeDescription(theme) {
  const key = `theme.${theme.id}.description`;
  const translated = t(key);
  return translated === key ? theme.description : translated;
}

// ── chrome (topbar/nav DOM updates) ──────────────────────────────────────────

export function chromeLabels(language = currentLanguage()) {
  const isEn = language === "en";
  return {
    settingsAria: isEn ? "Open settings" : "設定を開く",
    notice: isEn ? "Notice from team" : "運営からのお知らせ",
    nav: {
      mine: "my page",
      design: "Design",
      stickers: isEn ? "Stickers" : "シール",
      book: isEn ? "People" : "会った人",
      guide: isEn ? "Guide" : "使い方"
    }
  };
}

export function updateChromeCopy() {
  const lang = currentLanguage();
  const labels = chromeLabels(lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.textContent = t(node.dataset.i18n || "");
  });
  document.querySelectorAll("[data-nav]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const key = node.dataset.nav || "";
    if (labels.nav[key]) node.textContent = labels.nav[key];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel || ""));
  });
  const settingsButton = document.querySelector(".topbar-settings");
  if (settingsButton instanceof HTMLElement) {
    settingsButton.setAttribute("aria-label", labels.settingsAria);
    settingsButton.setAttribute("title", labels.settingsAria);
  }
  const opsNotice = document.querySelector(".ops-notice");
  if (opsNotice instanceof HTMLElement) opsNotice.textContent = labels.notice;
  updateLanguageSwitch();
}

export function updateLanguageSwitch() {
  const lang = currentLanguage();
  document.querySelectorAll(".lang-btn[data-language]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const active = node.dataset.language === lang;
    node.classList.toggle("active", active);
    if (node instanceof HTMLButtonElement) node.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

// ── getters ───────────────────────────────────────────────────────────────────

export function getActivePattern() {
  return findPattern(activePatternId) || state.patterns[0];
}

export function getActiveProfileTab() {
  if (activeProfileTab === "general") return "general";
  if (findPattern(activeProfileTab)) return activeProfileTab;
  return "general";
}

export function findPattern(id) {
  return state.patterns.find((pattern) => pattern.id === id);
}

export function findProfile(id) {
  return findPattern(id) || DEMO_PROFILES.find((profile) => profile.id === id);
}

export function findExchange(id) {
  return state.exchanges.find((exchange) => exchange.id === id);
}

export function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) || THEMES[0];
}

export function getPaperFrame(id) {
  return PAPER_FRAMES.find((frame) => frame.id === id) || PAPER_FRAMES[0];
}

export function getPaperFrameName(frame) {
  if (currentLanguage() === "en") return frame.nameEn || frame.nameJa || frame.id;
  return frame.nameJa || frame.nameEn || frame.id;
}

export function getPaperFrameDescription(frame) {
  if (currentLanguage() === "en") return frame.descriptionEn || frame.descriptionJa || "";
  return frame.descriptionJa || frame.descriptionEn || "";
}

export function getPaperFrameStyle(frame) {
  if (!frame || frame.id === "none" || !frame.src || !frame.width) return "";
  const slice = frame.slice || {};
  const top = Number(slice.top) || 0;
  const right = Number(slice.right) || 0;
  const bottom = Number(slice.bottom) || 0;
  const left = Number(slice.left) || 0;
  const width = Number(frame.width) || 0;
  const repeat = frame.repeat || "stretch";
  return [
    `border:${width}px solid transparent`,
    `border-image-source:url('${frame.src}')`,
    `border-image-slice:${top} ${right} ${bottom} ${left}`,
    `border-image-width:${width}px`,
    `border-image-repeat:${repeat}`,
    "border-radius:0"
  ].join(";");
}

export function getCustomStickers() {
  if (!Array.isArray(state.customStickers)) return [];
  return state.customStickers.map((sticker, index) => ({
    id: sticker.id || `custom_${index + 1}`,
    label: sticker.label || "Custom",
    className: sticker.className || "sticker-blue",
    color: sticker.color || "#dcecff",
    source: "custom",
    owned: true,
    variant: "asset",
    assetSrc: sticker.assetSrc
  }));
}

export function getStickerCatalog(options = {}) {
  const includeCustom = options.includeCustom !== false;
  if (!includeCustom) return STICKERS;
  return STICKERS.concat(getCustomStickers());
}

export function getStickerPickerCatalog() {
  if (getCurrentPlan() !== "pro") return STICKERS;
  return getStickerCatalog({ includeCustom: true });
}

export function getSticker(id) {
  return getStickerCatalog({ includeCustom: true }).find((sticker) => sticker.id === id);
}

export function getLinkType(id) {
  return LINK_TYPES.find((type) => type.id === id) || LINK_TYPES[0];
}

export function getFieldGroups() {
  return Array.isArray(state.groups) && state.groups.length ? state.groups : FIELD_GROUPS;
}

export function getFieldGroup(id) {
  return getFieldGroups().find((group) => group.id === id) || getFieldGroups()[0];
}

export function isGroupVisibleForPattern(group, patternId) {
  if (!findPattern(patternId)) return true;
  return !Array.isArray(group.patternIds) || group.patternIds.includes(patternId);
}

export function renderGroupPatternSummary(group) {
  const visible = state.patterns.filter((pattern) => isGroupVisibleForPattern(group, pattern.id));
  if (visible.length === state.patterns.length) return t("groups.summaryAll");
  if (visible.length === 0) return t("groups.summaryNone");
  return visible.map((pattern) => pattern.patternName).join(" / ");
}

export function findField(pattern, fieldKey) {
  return pattern.fields.find((field) => field.key === fieldKey);
}

export function getDisplayName(profile) {
  return getFieldValue(profile, "displayName") || t("display.nameFallback");
}

export function getFieldValue(profile, key) {
  return profile.fields.find((field) => field.key === key)?.value || "";
}

export function countVisibleFields(pattern) {
  const visibleGroupIds = new Set(getFieldGroups().filter((group) => isGroupVisibleForPattern(group, pattern.id)).map((group) => group.id));
  return pattern.fields.filter((field) => visibleGroupIds.has(field.group)).length + (pattern.links || []).filter((link) => link.visible && link.url).length;
}

export function getPublicUrl(profileId) {
  return `${PROFILE_BASE_URL}${encodeURIComponent(profileId)}`;
}

export function formatDate(value) {
  const locale = currentLanguage() === "en" ? "en-US" : "ja-JP";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}
