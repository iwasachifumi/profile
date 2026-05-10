import {
  state, authSession, authModeTab, activePatternId, activeProfileTab,
  selectedExchangeId, activeBookView, stickerPage,
  selectedStickerPatternId, selectedStickerIndex, toastTimer,
  setAuthModeTab, setActivePatternId, setActiveProfileTab, setSelectedExchangeId,
  setActiveBookView, setStickerPage, setSelectedStickerPatternId,
  setSelectedStickerIndex, setToastTimer,
  hasActiveSession, currentLanguage, t,
  saveState, applyState, loadState, loadStateFromSupabase,
  getActivePattern, findPattern, findProfile, findExchange, findField,
  getTheme, getPaperFrame, getSticker, getStickerPickerCatalog,
  getCurrentPlan, getPlanLimit, countGroupTotal, countFieldTotal, countExchangeTotal,
  getFieldGroup, isGroupVisibleForPattern, getLinkTypeLabel, getThemeName,
  getPaperFrameName, getPaperFrameDescription,
  getDisplayName, getFieldValue, getPublicUrl, formatLimit,
  saveAuthSession, savePreferredLanguage
} from './store.js';
import {
  signUpWithEmail, signInWithEmail, signOut as supabaseSignOut
} from './lib/auth.js';
import { render, parseRoute, renderProfilePaper, settingsCopy } from './render.js';
import { LINK_TYPES, STICKERS_PER_PAGE } from './data.js';
import { PLAN_LIMITS, LANGUAGES } from './constants.js';
import {
  makeId, readFileAsDataUrl, sanitizeEmail, isValidEmail,
  escapeHtml, escapeAttribute, clamp, formatStampLabel
} from './utils.js';

// ── event handlers ────────────────────────────────────────────────────────────

export function handleInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.bind) {
    const pattern = findPattern(target.dataset.patternId);
    if (!pattern) return;
    pattern[target.dataset.bind] = target.value;
    saveState();
    softRenderMine();
  }

  if (target.dataset.exchangeNote) {
    const exchange = findExchange(target.dataset.exchangeNote);
    if (!exchange) return;
    exchange.privateNote = target.value;
    saveState();
  }

  if (target.dataset.exchangeTags) {
    const exchange = findExchange(target.dataset.exchangeTags);
    if (!exchange) return;
    exchange.tags = target.value.split(",").map((tag) => tag.trim()).filter(Boolean);
    saveState();
  }
}

export async function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.patternPicker !== undefined) {
    setActivePatternId(target.value);
    saveState();
    render();
  }

  if (target.dataset.profileImageUpload !== undefined && target instanceof HTMLInputElement) {
    const file = target.files && target.files[0];
    if (!file) return;
    const pattern = findPattern(target.dataset.patternId);
    if (!pattern) return;
    try {
      pattern.avatarDataUrl = await readFileAsDataUrl(file);
      saveState();
      render();
    } catch {
      showToast(t("toast.imageLoadFail"));
    } finally {
      target.value = "";
    }
  }

  if (target.dataset.customStickerUpload !== undefined && target instanceof HTMLInputElement) {
    const file = target.files && target.files[0];
    if (!file) return;
    if (getCurrentPlan() !== "pro") {
      openLimitUpgradeModal("customSticker");
      target.value = "";
      return;
    }
    try {
      const dataUrl = await readFileAsDataUrl(file);
      addCustomSticker(file.name || "custom", dataUrl);
      const totalPages = Math.max(1, Math.ceil(getStickerPickerCatalog().length / STICKERS_PER_PAGE));
      setStickerPage(totalPages);
      saveState();
      render();
    } catch {
      showToast(t("toast.imageLoadFail"));
    } finally {
      target.value = "";
    }
  }
}

export function handleClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "set-language") {
    setLanguage(actionTarget.dataset.language);
    return;
  }

  if (action === "auth-set-mode") {
    setAuthModeTab(actionTarget.dataset.authMode === "login" ? "login" : "register");
    render();
    return;
  }

  if (action === "auth-register") {
    registerWithEmail();
    return;
  }

  if (action === "auth-login") {
    loginWithEmail();
    return;
  }

  if (action === "auth-start-guest") {
    openGuestStartModal();
    return;
  }

  if (action === "auth-confirm-guest") {
    startGuestSession();
    return;
  }

  if (action === "auth-logout") {
    logoutSession();
    return;
  }

  if (action === "select-pattern") {
    const patternId = actionTarget.dataset.patternId;
    setActivePatternId(patternId);
    setActiveProfileTab(patternId);
    saveState();
    render();
  }

  if (action === "select-profile-tab") {
    const tabId = actionTarget.dataset.tabId;
    setActiveProfileTab(tabId);
    if (tabId !== "general") setActivePatternId(tabId);
    saveState();
    render();
  }

  if (action === "add-pattern") {
    addPattern();
  }

  if (action === "open-pattern-editor") {
    openPatternEditor(actionTarget.dataset.patternId);
  }

  if (action === "save-pattern-editor") {
    savePatternEditor(actionTarget.dataset.patternId);
  }

  if (action === "add-group") {
    addGroup();
  }

  if (action === "open-add-group") {
    openAddGroupEditor();
  }

  if (action === "save-new-group") {
    saveNewGroup();
  }

  if (action === "open-group-editor") {
    openGroupEditor(actionTarget.dataset.groupId);
  }

  if (action === "save-group-editor") {
    saveGroupEditor(actionTarget.dataset.groupId);
  }

  if (action === "open-add-field") {
    event.preventDefault();
    openAddFieldEditor(actionTarget.dataset.patternId, actionTarget.dataset.groupId);
  }

  if (action === "open-add-general-field") {
    event.preventDefault();
    openAddGeneralFieldEditor(actionTarget.dataset.groupId);
  }

  if (action === "save-new-general-field") {
    saveNewGeneralField(actionTarget.dataset.groupId);
  }

  if (action === "save-new-field") {
    saveNewField(actionTarget.dataset.patternId, actionTarget.dataset.groupId);
  }

  if (action === "open-field-editor") {
    openFieldEditor(actionTarget.dataset.patternId, actionTarget.dataset.fieldKey);
  }

  if (action === "open-general-field-editor") {
    openGeneralFieldEditor(actionTarget.dataset.fieldUid);
  }

  if (action === "save-field-editor") {
    saveFieldEditor(actionTarget.dataset.patternId, actionTarget.dataset.fieldKey);
  }

  if (action === "save-general-field-editor") {
    saveGeneralFieldEditor(actionTarget.dataset.fieldUid);
  }

  if (action === "remove-field") {
    removeField(actionTarget.dataset.patternId, actionTarget.dataset.fieldKey);
  }

  if (action === "remove-general-field") {
    removeGeneralField(actionTarget.dataset.fieldUid);
  }

  if (action === "open-add-link") {
    openAddLinkEditor(actionTarget.dataset.patternId);
  }

  if (action === "save-new-link") {
    saveNewLink(actionTarget.dataset.patternId);
  }

  if (action === "open-link-editor") {
    openLinkEditor(actionTarget.dataset.patternId, actionTarget.dataset.linkId);
  }

  if (action === "save-link-editor") {
    saveLinkEditor(actionTarget.dataset.patternId, actionTarget.dataset.linkId);
  }

  if (action === "remove-link") {
    removeLink(actionTarget.dataset.patternId, actionTarget.dataset.linkId);
  }

  if (action === "open-csv-upgrade") {
    if (getCurrentPlan() === "pro") {
      const isEn = currentLanguage() === "en";
      openUpgradeModal(
        isEn ? "CSV export (coming soon)" : "CSV出力（準備中）",
        isEn ? "CSV export UI will be added in a future update." : "CSV出力UIは今後のアップデートで追加します。",
        { showPlanButton: false }
      );
      return;
    }
    const copy = settingsCopy();
    openUpgradeModal(copy.proTitle, copy.proBody);
  }

  if (action === "open-plan-upgrade") {
    openPlanUpgradeModal();
  }

  if (action === "activate-pro-plan") {
    activateProPlan();
  }

  if (action === "open-theme-preview") {
    openThemePreview(actionTarget.dataset.themeId);
  }

  if (action === "open-frame-preview") {
    openFramePreview(actionTarget.dataset.frameId);
  }

  if (action === "apply-frame") {
    applyFrame(actionTarget.dataset.frameId);
    return;
  }

  if (action === "apply-theme") {
    applyTheme(actionTarget.dataset.themeId);
  }

  if (action === "set-theme") {
    const theme = getTheme(actionTarget.dataset.themeId);
    if (!theme.free && state.plan === "free") {
      openUpgradeModal(t("upgrade.theme.title"), t("upgrade.theme.body", { theme: getThemeName(theme) }));
      return;
    }
    const pattern = getActivePattern();
    pattern.themeId = actionTarget.dataset.themeId;
    saveState();
    render();
  }

  if (action === "add-sticker") {
    addSticker(actionTarget.dataset.stickerId);
  }

  if (action === "select-placed-sticker") {
    const index = Number(actionTarget.dataset.stickerIndex);
    const patternId = actionTarget.dataset.patternId || "";
    if (!Number.isInteger(index) || !patternId) return;
    if (selectedStickerPatternId === patternId && selectedStickerIndex === index) return;
    setSelectedStickerPatternId(patternId);
    setSelectedStickerIndex(index);
    render();
    return;
  }

  if (action === "clear-sticker-selection") {
    if (selectedStickerIndex !== -1 || selectedStickerPatternId) {
      setSelectedStickerPatternId("");
      setSelectedStickerIndex(-1);
      render();
    }
    return;
  }

  if (action === "remove-placed-sticker") {
    const pattern = getActivePattern();
    const index = Number(actionTarget.dataset.stickerIndex);
    if (!Number.isInteger(index) || index < 0 || index >= pattern.stickers.length) return;
    pattern.stickers.splice(index, 1);
    if (selectedStickerPatternId === pattern.id) {
      if (selectedStickerIndex === index) {
        setSelectedStickerIndex(-1);
        setSelectedStickerPatternId("");
      } else if (selectedStickerIndex > index) {
        setSelectedStickerIndex(selectedStickerIndex - 1);
      }
    }
    saveState();
    render();
  }

  if (action === "resize-placed-sticker") {
    const pattern = getActivePattern();
    const index = Number(actionTarget.dataset.stickerIndex);
    const delta = Number(actionTarget.dataset.delta) || 0;
    const placement = pattern.stickers[index];
    if (!placement) return;
    placement.size = clamp(Number(placement.size || 116) + delta, 64, 220);
    saveState();
    render();
  }

  if (action === "sticker-page") {
    setStickerPage(Math.max(1, Number(actionTarget.dataset.page) || 1));
    saveState();
    render();
  }

  if (action === "copy-url") {
    copyText(actionTarget.dataset.url);
  }

  if (action === "save-exchange") {
    saveExchange(actionTarget.dataset.profileId);
  }

  if (action === "select-exchange") {
    setSelectedExchangeId(actionTarget.dataset.exchangeId);
    setActiveBookView("detail");
    saveState();
    render();
  }

  if (action === "select-book-view") {
    setActiveBookView(actionTarget.dataset.bookView === "detail" ? "detail" : "list");
    saveState();
    render();
  }

  if (action === "clear-profile-image") {
    const pattern = findPattern(actionTarget.dataset.patternId);
    if (!pattern) return;
    pattern.avatarDataUrl = "";
    saveState();
    render();
  }

  if (action === "close-modal") {
    closeModal();
  }
}

export function handleStickerDrag(event) {
  if (event.target.closest("[data-sticker-control]")) return;
  const stickerNode = event.target.closest("[data-draggable-sticker]");
  if (!stickerNode) return;

  const paper = stickerNode.closest("[data-profile-paper]");
  const pattern = getActivePattern();
  const sticker = pattern.stickers[Number(stickerNode.dataset.stickerIndex)];
  if (!paper || !sticker) return;

  event.preventDefault();
  stickerNode.setPointerCapture(event.pointerId);

  const move = (moveEvent) => {
    const rect = paper.getBoundingClientRect();
    const x = ((moveEvent.clientX - rect.left) / rect.width) * 100;
    const y = ((moveEvent.clientY - rect.top) / rect.height) * 100;
    const widthPct = (stickerNode.offsetWidth / rect.width) * 100;
    const heightPct = (stickerNode.offsetHeight / rect.height) * 100;
    sticker.x = clamp(x, 0, Math.max(0, 100 - widthPct));
    sticker.y = clamp(y, 0, Math.max(0, 100 - heightPct));
    stickerNode.style.left = `${sticker.x.toFixed(1)}%`;
    stickerNode.style.top = `${sticker.y.toFixed(1)}%`;
  };

  const up = () => {
    stickerNode.removeEventListener("pointermove", move);
    stickerNode.removeEventListener("pointerup", up);
    stickerNode.removeEventListener("pointercancel", up);
    saveState();
  };

  stickerNode.addEventListener("pointermove", move);
  stickerNode.addEventListener("pointerup", up);
  stickerNode.addEventListener("pointercancel", up);
}

// ── soft render ───────────────────────────────────────────────────────────────

function softRenderMine() {
  const route = parseRoute();
  if (route.name !== "mine") return;
  const previewHost = document.querySelector("[data-profile-paper]");
  if (!previewHost) return;
  previewHost.outerHTML = renderProfilePaper(getActivePattern(), { editable: true });
}

// ── pattern ───────────────────────────────────────────────────────────────────

function addPattern() {
  const patternLimit = getPlanLimit("patterns");
  if (state.patterns.length >= patternLimit) {
    openLimitUpgradeModal("patterns");
    return;
  }

  // pattern.id は memoria.profiles.id (uuid) と整合させるため UUID で発番
  const id = crypto.randomUUID();
  const source = getActivePattern();
  const next = JSON.parse(JSON.stringify(source));
  next.id = id;
  next.patternName = t("pattern.newName");
  next.audience = t("pattern.newAudience");
  state.patterns.push(next);
  state.groups.forEach((group) => {
    if (!Array.isArray(group.patternIds)) group.patternIds = [];
    if (!group.patternIds.includes(id)) group.patternIds.push(id);
  });
  setActivePatternId(id);
  setActiveProfileTab(id);
  saveState();
  render();
  openPatternEditor(id);
}

function openPatternEditor(patternId) {
  const pattern = findPattern(patternId);
  if (!pattern) return;

  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="pattern-editor-title">
      <div class="section-title">
        <h2 id="pattern-editor-title">${t("pattern.editorTitle")}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("pattern.name")}
          <input data-modal-pattern-name value="${escapeAttribute(pattern.patternName)}">
        </label>
        <label>
          ${t("pattern.audience")}
          <input data-modal-pattern-audience value="${escapeAttribute(pattern.audience)}">
        </label>
        <label>
          ${t("pattern.description")}
          <textarea data-modal-pattern-description>${escapeHtml(pattern.description)}</textarea>
        </label>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-pattern-editor" data-pattern-id="${pattern.id}">${t("modal.save")}</button>
        </div>
      </div>
    </section>
  `);
}

function savePatternEditor(patternId) {
  const pattern = findPattern(patternId);
  if (!pattern) return;

  pattern.patternName = document.querySelector("[data-modal-pattern-name]")?.value.trim() || pattern.patternName;
  pattern.audience = document.querySelector("[data-modal-pattern-audience]")?.value.trim() || pattern.audience;
  pattern.description = document.querySelector("[data-modal-pattern-description]")?.value.trim() || pattern.description;

  saveState();
  closeModal();
  render();
}

// ── groups ────────────────────────────────────────────────────────────────────

function addGroup() {
  openAddGroupEditor();
}

function openAddGroupEditor() {
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-group-title">
      <div class="section-title">
        <h2 id="new-group-title">${t("groups.addTitle")}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("groups.name")}
          <input data-modal-new-group-name placeholder="${t("groups.placeholder")}">
        </label>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-new-group">${t("modal.add")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveNewGroup() {
  const name = document.querySelector("[data-modal-new-group-name]")?.value.trim() || "";
  if (!name) {
    showToast(t("toast.groupNameRequired"));
    return;
  }
  if (countGroupTotal() >= getPlanLimit("groups")) {
    openLimitUpgradeModal("groups");
    return;
  }

  state.groups.push({
    id: makeId("group"),
    name,
    patternIds: state.patterns.map((pattern) => pattern.id)
  });
  saveState();
  closeModal();
  render();
}

function openGroupEditor(groupId) {
  const group = getFieldGroup(groupId);
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="group-editor-title">
      <div class="section-title">
        <h2 id="group-editor-title">${t("group.editorTitle")}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("groups.name")}
          <input data-modal-group-name value="${escapeAttribute(group.name || "")}">
        </label>
        <fieldset class="target-picker">
          <legend>${t("group.visiblePatterns")}</legend>
          ${state.patterns.map((pattern) => `
            <label class="checkline">
              <input type="checkbox" data-modal-group-pattern value="${pattern.id}" ${isGroupVisibleForPattern(group, pattern.id) ? "checked" : ""}>
              ${escapeHtml(pattern.patternName)}
            </label>
          `).join("")}
        </fieldset>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-group-editor" data-group-id="${group.id}">${t("modal.save")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveGroupEditor(groupId) {
  const group = getFieldGroup(groupId);
  const name = document.querySelector("[data-modal-group-name]")?.value.trim();
  const patternIds = Array.from(document.querySelectorAll("[data-modal-group-pattern]:checked")).map((node) => node.value);

  if (name) group.name = name;
  group.patternIds = patternIds.length ? patternIds : state.patterns.map((pattern) => pattern.id);
  syncGroupFields(group.id);

  saveState();
  closeModal();
  render();
}

function syncGroupFields(groupId) {
  const templates = new Map();
  state.patterns.forEach((pattern) => {
    pattern.fields
      .filter((field) => field.group === groupId)
      .forEach((field) => {
        if (!templates.has(field.uid)) templates.set(field.uid, field);
      });
  });

  state.patterns.forEach((pattern) => {
    if (!isGroupVisibleForPattern(getFieldGroup(groupId), pattern.id)) return;
    templates.forEach((template) => {
      if (pattern.fields.some((field) => field.uid === template.uid)) return;
      pattern.fields.push({
        uid: template.uid,
        key: makeId("field"),
        group: groupId,
        label: template.label,
        value: "",
        visible: true
      });
    });
  });
}

// ── fields (general) ──────────────────────────────────────────────────────────

function openAddGeneralFieldEditor(groupId) {
  const group = getFieldGroup(groupId);
  if (!group) return;
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-general-field-title">
      <div class="section-title">
        <div>
          <h2 id="new-general-field-title">${t("field.addTitle")}</h2>
          <span class="muted small">${escapeHtml(group.name || group.id)}</span>
        </div>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("field.label")}
          <input data-modal-general-field-label placeholder="${t("field.placeholderLabel")}">
        </label>
        <label>
          ${t("field.content")}
          <textarea data-modal-general-field-value placeholder="${t("field.placeholderValue")}"></textarea>
        </label>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-new-general-field" data-group-id="${group.id}">${t("modal.add")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveNewGeneralField(groupId) {
  if (countFieldTotal() >= getPlanLimit("fields")) {
    openLimitUpgradeModal("fields");
    return;
  }
  const label = document.querySelector("[data-modal-general-field-label]")?.value.trim() || t("field.newLabel");
  const value = document.querySelector("[data-modal-general-field-value]")?.value.trim() || "";
  const uid = makeId("fuid");
  state.patterns.forEach((pattern) => {
    if (!isGroupVisibleForPattern(getFieldGroup(groupId), pattern.id)) return;
    pattern.fields.push({ uid, key: makeId("field"), group: groupId, label, value, visible: true });
  });
  saveState();
  closeModal();
  render();
}

function findSharedFieldByUid(fieldUid) {
  for (const pattern of state.patterns) {
    const field = pattern.fields.find((item) => item.uid === fieldUid && item.key !== "displayName");
    if (field) return { pattern, field };
  }
  return null;
}

function openGeneralFieldEditor(fieldUid) {
  const found = findSharedFieldByUid(fieldUid);
  if (!found) return;
  const count = state.patterns.filter((pattern) => pattern.fields.some((field) => field.uid === fieldUid)).length;
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="general-field-editor-title">
      <div class="section-title">
        <h2 id="general-field-editor-title">${t("field.editTitle")}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("field.label")}
          <input data-modal-general-field-label value="${escapeAttribute(found.field.label)}">
        </label>
        <label>
          ${t("field.content")}
          <textarea data-modal-general-field-value>${escapeHtml(found.field.value || "")}</textarea>
        </label>
        <p class="muted small">${t("fields.count", { count })}</p>
        <div class="modal-actions">
          <button type="button" class="ghost" data-action="remove-general-field" data-field-uid="${fieldUid}">${t("modal.remove")}</button>
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-general-field-editor" data-field-uid="${fieldUid}">${t("modal.save")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveGeneralFieldEditor(fieldUid) {
  const label = document.querySelector("[data-modal-general-field-label]")?.value.trim();
  const value = document.querySelector("[data-modal-general-field-value]")?.value.trim() || "";
  if (!label) return;
  state.patterns.forEach((pattern) => {
    pattern.fields.forEach((field) => {
      if (field.uid === fieldUid) { field.label = label; field.value = value; }
    });
  });
  saveState();
  closeModal();
  render();
}

function removeGeneralField(fieldUid) {
  state.patterns.forEach((pattern) => {
    pattern.fields = pattern.fields.filter((field) => field.uid !== fieldUid);
  });
  saveState();
  closeModal();
  render();
}

// ── fields (pattern-specific) ─────────────────────────────────────────────────

function openAddFieldEditor(patternId, groupId) {
  const pattern = findPattern(patternId);
  const group = getFieldGroup(groupId);
  if (!pattern || !group) return;

  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-field-title">
      <div class="section-title">
        <div>
          <h2 id="new-field-title">${t("field.addTitle")}</h2>
          <span class="muted small">${escapeHtml(group.name || group.id)}</span>
        </div>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("field.label")}
          <input data-modal-field-label placeholder="${t("field.placeholderLabel")}">
        </label>
        <label>
          ${t("field.content")}
          <textarea data-modal-field-value placeholder="${t("field.placeholderValue")}"></textarea>
        </label>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-new-field" data-pattern-id="${pattern.id}" data-group-id="${group.id}">${t("modal.add")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveNewField(patternId, groupId) {
  const pattern = findPattern(patternId);
  if (!pattern) return;
  if (countFieldTotal() >= getPlanLimit("fields")) {
    openLimitUpgradeModal("fields");
    return;
  }

  const label = document.querySelector("[data-modal-field-label]")?.value.trim() || t("field.newLabel");
  const value = document.querySelector("[data-modal-field-value]")?.value.trim() || "";
  const uid = makeId("fuid");

  state.patterns.forEach((targetPattern) => {
    if (!isGroupVisibleForPattern(getFieldGroup(groupId), targetPattern.id)) return;
    targetPattern.fields.push({ uid, key: makeId("field"), group: groupId, label, value, visible: true });
  });

  saveState();
  closeModal();
  render();
}

function openFieldEditor(patternId, fieldKey) {
  const pattern = findPattern(patternId);
  const field = pattern && findField(pattern, fieldKey);
  if (!pattern || !field) return;

  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="field-editor-title">
      <div class="section-title">
        <h2 id="field-editor-title">${t("field.editTitle")}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${t("field.label")}
          <input data-modal-field-label value="${escapeAttribute(field.label)}">
        </label>
        <label>
          ${t("field.content")}
          <textarea data-modal-field-value>${escapeHtml(field.value)}</textarea>
        </label>
        <div class="modal-actions">
          <button type="button" class="ghost" data-action="remove-field" data-pattern-id="${pattern.id}" data-field-key="${field.key}">${t("modal.remove")}</button>
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-field-editor" data-pattern-id="${pattern.id}" data-field-key="${field.key}">${t("modal.save")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveFieldEditor(patternId, fieldKey) {
  const pattern = findPattern(patternId);
  const field = pattern && findField(pattern, fieldKey);
  if (!pattern || !field) return;

  const label = document.querySelector("[data-modal-field-label]")?.value.trim() || field.label;
  const value = document.querySelector("[data-modal-field-value]")?.value.trim() || "";
  state.patterns.forEach((targetPattern) => {
    const targetField = targetPattern.fields.find((item) => item.uid === field.uid);
    if (targetField) { targetField.label = label; targetField.value = value; }
  });

  saveState();
  closeModal();
  render();
}

function removeField(patternId, fieldKey) {
  const pattern = findPattern(patternId) || getActivePattern();
  const field = findField(pattern, fieldKey);
  if (!field || field.key === "displayName") return;
  state.patterns.forEach((targetPattern) => {
    targetPattern.fields = targetPattern.fields.filter((item) => item.uid !== field.uid);
  });
  saveState();
  closeModal();
  render();
}

// ── links ─────────────────────────────────────────────────────────────────────

function linkModalCopy() {
  const isEn = currentLanguage() === "en";
  return {
    addTitle: isEn ? "Add Link" : "リンクを追加",
    editTitle: isEn ? "Edit Link" : "リンクを編集",
    type: t("links.type"),
    url: t("links.url"),
    show: t("links.visible"),
    urlPlaceholder: "https://"
  };
}

function openAddLinkEditor(patternId) {
  const pattern = findPattern(patternId) || getActivePattern();
  if (!pattern) return;
  const copy = linkModalCopy();
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="link-add-title">
      <div class="section-title">
        <h2 id="link-add-title">${copy.addTitle}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${copy.type}
          <select data-modal-link-type>
            ${LINK_TYPES.map((type) => `<option value="${type.id}">${escapeHtml(getLinkTypeLabel(type.id))}</option>`).join("")}
          </select>
        </label>
        <label>
          ${copy.url}
          <input data-modal-link-url placeholder="${copy.urlPlaceholder}">
        </label>
        <label class="checkline">
          <input type="checkbox" data-modal-link-visible checked>
          ${copy.show}
        </label>
        <div class="modal-actions">
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-new-link" data-pattern-id="${pattern.id}">${t("modal.add")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveNewLink(patternId) {
  const pattern = findPattern(patternId) || getActivePattern();
  if (!pattern) return;
  const type = document.querySelector("[data-modal-link-type]")?.value || "website";
  const url = document.querySelector("[data-modal-link-url]")?.value.trim() || "";
  const visible = Boolean(document.querySelector("[data-modal-link-visible]")?.checked);
  pattern.links.push({ id: makeId("link"), type, label: getLinkTypeLabel(type), url, visible });
  saveState();
  closeModal();
  render();
}

function openLinkEditor(patternId, linkId) {
  const pattern = findPattern(patternId) || getActivePattern();
  const link = pattern && pattern.links.find((item) => item.id === linkId);
  if (!pattern || !link) return;
  const copy = linkModalCopy();
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="link-edit-title">
      <div class="section-title">
        <h2 id="link-edit-title">${copy.editTitle}</h2>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="stack">
        <label>
          ${copy.type}
          <select data-modal-link-type>
            ${LINK_TYPES.map((type) => `<option value="${type.id}" ${type.id === link.type ? "selected" : ""}>${escapeHtml(getLinkTypeLabel(type.id))}</option>`).join("")}
          </select>
        </label>
        <label>
          ${copy.url}
          <input data-modal-link-url value="${escapeAttribute(link.url)}" placeholder="${copy.urlPlaceholder}">
        </label>
        <label class="checkline">
          <input type="checkbox" data-modal-link-visible ${link.visible ? "checked" : ""}>
          ${copy.show}
        </label>
        <div class="modal-actions">
          <button type="button" class="ghost" data-action="remove-link" data-pattern-id="${pattern.id}" data-link-id="${link.id}">${t("modal.remove")}</button>
          <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
          <button type="button" data-action="save-link-editor" data-pattern-id="${pattern.id}" data-link-id="${link.id}">${t("modal.save")}</button>
        </div>
      </div>
    </section>
  `);
}

function saveLinkEditor(patternId, linkId) {
  const pattern = findPattern(patternId) || getActivePattern();
  const link = pattern && pattern.links.find((item) => item.id === linkId);
  if (!pattern || !link) return;
  const type = document.querySelector("[data-modal-link-type]")?.value || link.type;
  const url = document.querySelector("[data-modal-link-url]")?.value.trim() || "";
  const visible = Boolean(document.querySelector("[data-modal-link-visible]")?.checked);
  link.type = type;
  link.label = getLinkTypeLabel(type);
  link.url = url;
  link.visible = visible;
  saveState();
  closeModal();
  render();
}

function removeLink(patternId, linkId) {
  const pattern = findPattern(patternId) || getActivePattern();
  if (!pattern) return;
  pattern.links = pattern.links.filter((link) => link.id !== linkId);
  saveState();
  closeModal();
  render();
}

// ── design ────────────────────────────────────────────────────────────────────

function applyTheme(themeId) {
  const theme = getTheme(themeId);
  if (!theme.free && state.plan === "free") {
    openUpgradeModal(t("upgrade.theme.title"), t("upgrade.theme.body", { theme: getThemeName(theme) }));
    return;
  }
  const pattern = getActivePattern();
  pattern.themeId = themeId;
  saveState();
  render();
}

function openThemePreview(themeId) {
  applyTheme(themeId);
}

function openFramePreview(frameId) {
  const frame = getPaperFrame(frameId);
  const pattern = getActivePattern();
  if (!pattern) return;
  const isEn = currentLanguage() === "en";
  const previewProfile = { ...pattern, frameId: frame.id };
  openModal(`
    <section class="modal-dialog frame-preview-modal" role="dialog" aria-modal="true" aria-labelledby="frame-preview-title">
      <div class="section-title">
        <div>
          <h2 id="frame-preview-title">${escapeHtml(getPaperFrameName(frame))}</h2>
          <span class="muted small">${escapeHtml(getPaperFrameDescription(frame))}</span>
        </div>
        <button type="button" class="icon-button" data-action="close-modal" aria-label="${t("modal.close")}" title="${t("modal.close")}">×</button>
      </div>
      <div class="frame-preview-wrap">
        ${renderProfilePaper(previewProfile, { editable: false })}
      </div>
      <div class="modal-actions">
        <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
        <button type="button" data-action="apply-frame" data-frame-id="${frame.id}" ${pattern.frameId === frame.id ? "disabled" : ""}>${isEn ? "Apply" : "このデザインに決定"}</button>
      </div>
    </section>
  `);
}

function applyFrame(frameId) {
  const frame = getPaperFrame(frameId);
  const pattern = getActivePattern();
  if (!pattern) return;
  pattern.frameId = frame.id;
  saveState();
  closeModal();
  render();
}

// ── stickers ──────────────────────────────────────────────────────────────────

function addSticker(stickerId) {
  const sticker = getSticker(stickerId);
  if (!sticker) return;

  const pattern = getActivePattern();
  pattern.stickers.push({
    id: stickerId,
    x: 12 + ((pattern.stickers.length * 13) % 60),
    y: 14 + ((pattern.stickers.length * 17) % 62),
    rotation: (pattern.stickers.length % 2 === 0 ? 5 : -6),
    size: 116
  });
  setSelectedStickerPatternId(pattern.id);
  setSelectedStickerIndex(pattern.stickers.length - 1);
  saveState();
  render();
}

function addCustomSticker(fileName, assetSrc) {
  const label = formatStampLabel(fileName);
  if (!Array.isArray(state.customStickers)) state.customStickers = [];
  state.customStickers.unshift({
    id: makeId("custom_stamp"),
    label,
    assetSrc,
    source: "custom",
    className: "sticker-blue",
    variant: "asset",
    owned: true
  });
}

// ── upgrade / plan ────────────────────────────────────────────────────────────

function getLimitUpgradeCopy(kind) {
  const isEn = currentLanguage() === "en";
  if (kind === "patterns") {
    return {
      title: isEn ? "Pattern limit reached" : "パターン上限に達しました",
      body: isEn
        ? `Free plan supports up to ${PLAN_LIMITS.free.patterns} patterns. Paid plan supports up to ${PLAN_LIMITS.pro.patterns}.`
        : `無料版はパターン${PLAN_LIMITS.free.patterns}件までです。有料版は${PLAN_LIMITS.pro.patterns}件まで作成できます。`
    };
  }
  if (kind === "groups") {
    return {
      title: isEn ? "Group limit reached" : "グループ上限に達しました",
      body: isEn
        ? `Free plan supports up to ${PLAN_LIMITS.free.groups} groups. Paid plan supports up to ${PLAN_LIMITS.pro.groups}.`
        : `無料版はグループ${PLAN_LIMITS.free.groups}件までです。有料版は${PLAN_LIMITS.pro.groups}件まで作成できます。`
    };
  }
  if (kind === "fields") {
    return {
      title: isEn ? "Field limit reached" : "項目上限に達しました",
      body: isEn
        ? `Free plan supports up to ${PLAN_LIMITS.free.fields} profile fields. Paid plan supports up to ${PLAN_LIMITS.pro.fields}.`
        : `無料版は項目${PLAN_LIMITS.free.fields}件までです。有料版は${PLAN_LIMITS.pro.fields}件まで作成できます。`
    };
  }
  if (kind === "exchanges") {
    return {
      title: isEn ? "Met-people limit reached" : "会った人の記録上限に達しました",
      body: isEn
        ? `Free plan stores up to ${PLAN_LIMITS.free.exchanges} records. Paid plan is ${formatLimit(PLAN_LIMITS.pro.exchanges, "en")}.`
        : `無料版は会った人の記録を${PLAN_LIMITS.free.exchanges}件まで保持できます。有料版は${formatLimit(PLAN_LIMITS.pro.exchanges, "ja")}です。`
    };
  }
  if (kind === "customSticker") {
    return {
      title: isEn ? "Custom sticker is paid feature" : "オリジナルシールは有料機能です",
      body: isEn
        ? "Free plan can use designated stickers only. Paid plan can upload your own images as stickers."
        : "無料版は指定シールのみ利用できます。有料版では自分の画像をシールとして追加できます。"
    };
  }
  return {
    title: isEn ? "Paid feature" : "有料機能",
    body: isEn ? "This feature is available on paid plans." : "この機能は有料プランで利用できます。"
  };
}

function openLimitUpgradeModal(kind) {
  const copy = getLimitUpgradeCopy(kind);
  openUpgradeModal(copy.title, copy.body);
}

function openUpgradeModal(title, body, options = {}) {
  const showPlanButton = options.showPlanButton !== false && getCurrentPlan() !== "pro";
  const planButtonLabel = currentLanguage() === "en" ? "See paid plan" : "有料版をみる";
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="upgrade-title">
      <h2 id="upgrade-title">${escapeHtml(title)}</h2>
      <p>${escapeHtml(body)}</p>
      <div class="modal-actions">
        ${showPlanButton ? `<button type="button" class="secondary" data-action="open-plan-upgrade">${planButtonLabel}</button>` : ""}
        <button type="button" data-action="close-modal">${t("modal.close")}</button>
      </div>
    </section>
  `);
}

function openPlanUpgradeModal() {
  const isEn = currentLanguage() === "en";
  const lines = [
    `${isEn ? "Patterns" : "パターン"}: ${PLAN_LIMITS.free.patterns} / ${PLAN_LIMITS.pro.patterns}`,
    `${isEn ? "Groups" : "グループ"}: ${PLAN_LIMITS.free.groups} / ${PLAN_LIMITS.pro.groups}`,
    `${isEn ? "Fields" : "項目"}: ${PLAN_LIMITS.free.fields} / ${PLAN_LIMITS.pro.fields}`,
    `${isEn ? "Met-people records" : "会った人の記録"}: ${PLAN_LIMITS.free.exchanges} / ${formatLimit(PLAN_LIMITS.pro.exchanges, currentLanguage())}`,
    `${isEn ? "Stickers" : "シール"}: ${isEn ? "designated only" : "指定のみ"} / ${isEn ? "custom image upload" : "画像アップロード可"}`,
    `${isEn ? "CSV export" : "CSV出力"}: ${isEn ? "paid only" : "有料のみ"}`
  ];
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="plan-upgrade-title">
      <h2 id="plan-upgrade-title">${isEn ? "Paid Plan" : "有料プラン"}</h2>
      <div class="stack">
        ${lines.map((line) => `<p class="muted small">${escapeHtml(line)}</p>`).join("")}
      </div>
      <div class="modal-actions">
        <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
        <button type="button" data-action="activate-pro-plan" ${getCurrentPlan() === "pro" ? "disabled" : ""}>${isEn ? "Purchase (MVP)" : "購入する（MVP）"}</button>
      </div>
    </section>
  `);
}

function activateProPlan() {
  if (getCurrentPlan() === "pro") { closeModal(); return; }
  state.plan = "pro";
  saveState();
  closeModal();
  render();
  showToast(currentLanguage() === "en" ? "Paid plan enabled." : "有料プランを有効化しました。");
}

// ── modal ─────────────────────────────────────────────────────────────────────

export function openModal(content) {
  const root = document.querySelector("#modal-root");
  root.innerHTML = `<div class="modal-backdrop">${content}</div>`;
}

export function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
}

function getInputValue(selector) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLInputElement)) return "";
  return node.value.trim();
}

// ── auth ──────────────────────────────────────────────────────────────────────
// 認証は js/lib/auth.js (Supabase Auth ラッパー) 経由で扱う。
// この層では「Supabase」という単語を出さず、success/error の判定だけ行う。

// 共通: サインイン成功後の状態反映
// Supabase からデータをロードしてから render する。失敗時は loadStateFromSupabase
// 内で localStorage キャッシュへフォールバックされる(別端末データは見えない)。
async function startUserSession(user) {
  saveAuthSession({
    mode: "user",
    userId: user.id,
    email: user.email,
    lastLoginAt: user.lastLoginAt || new Date().toISOString()
  });
  await loadStateFromSupabase({ id: user.id, email: user.email });
  saveState();
  closeModal();
  if (window.location.hash.startsWith("#profile/")) window.location.hash = "#mine";
  render();
}

// 認証エラーコード → 表示メッセージ
function authErrorMessage(error, isEn) {
  if (!error) return isEn ? "Authentication failed." : "認証に失敗しました。";
  const code = (error.code || "").toLowerCase();
  const msg = (error.message || "").toLowerCase();
  if (code.includes("invalid") || msg.includes("invalid login")) {
    return isEn ? "Invalid email or password." : "メールアドレスまたはパスワードが正しくありません。";
  }
  if (code.includes("user_already_exists") || msg.includes("already registered") || msg.includes("already exists")) {
    return isEn ? "This email is already registered." : "このメールアドレスは登録済みです。";
  }
  if (code.includes("weak_password") || msg.includes("password")) {
    return isEn ? "Password is too weak (min 8 chars)." : "パスワードが弱すぎます(8文字以上)。";
  }
  if (msg.includes("network") || msg.includes("fetch")) {
    return isEn ? "Network error. Please retry." : "通信エラーです。もう一度お試しください。";
  }
  return error.message || (isEn ? "Authentication failed." : "認証に失敗しました。");
}

async function registerWithEmail() {
  const isEn = currentLanguage() === "en";
  const email = sanitizeEmail(getInputValue("[data-auth-register-email]"));
  const password = getInputValue("[data-auth-register-password]");
  const confirm = getInputValue("[data-auth-register-password-confirm]");

  if (!email || !password || !confirm) {
    showToast(isEn ? "Please fill in all fields." : "すべて入力してください。");
    return;
  }
  if (!isValidEmail(email)) {
    showToast(isEn ? "Please enter a valid email." : "有効なメールアドレスを入力してください。");
    return;
  }
  if (password.length < 8) {
    showToast(isEn ? "Password must be at least 8 characters." : "パスワードは8文字以上にしてください。");
    return;
  }
  if (password !== confirm) {
    showToast(isEn ? "Passwords do not match." : "パスワードが一致しません。");
    return;
  }

  const result = await signUpWithEmail(email, password);
  if (result.error) {
    const code = (result.error.code || "").toLowerCase();
    const msg  = (result.error.message || "").toLowerCase();
    const alreadyRegistered =
      code.includes("user_already_exists") ||
      msg.includes("already registered") ||
      msg.includes("already exists");

    if (alreadyRegistered) {
      // GoTrue は onestep と auth.users を共有するため、onestep 登録済みのアドレスは
      // 登録エラーになる。そのままログインタブへ誘導し、メールを引き継ぐ。
      showToast(isEn
        ? "This email is already registered. Please log in."
        : "このメールアドレスはすでに登録済みです。ログインタブからサインインしてください。");
      setAuthModeTab("login");
      render();
      const loginEmailInput = document.querySelector("[data-auth-login-email]");
      if (loginEmailInput) loginEmailInput.value = email;
      return;
    }

    showToast(authErrorMessage(result.error, isEn));
    return;
  }
  if (result.needsEmailConfirm || !result.user) {
    showToast(isEn
      ? "Confirmation email sent. Please verify, then sign in."
      : "確認メールを送信しました。認証してからログインしてください。");
    return;
  }
  startUserSession(result.user);
  showToast(isEn ? "Account created and logged in." : "アカウントを作成してログインしました。");
}

async function loginWithEmail() {
  const isEn = currentLanguage() === "en";
  const email = sanitizeEmail(getInputValue("[data-auth-login-email]"));
  const password = getInputValue("[data-auth-login-password]");
  if (!email || !password) {
    showToast(isEn ? "Please enter email and password." : "メールアドレスとパスワードを入力してください。");
    return;
  }
  const result = await signInWithEmail(email, password);
  if (result.error || !result.user) {
    showToast(authErrorMessage(result.error, isEn));
    return;
  }
  startUserSession(result.user);
  showToast(isEn ? "Logged in." : "ログインしました。");
}

function openGuestStartModal() {
  const isEn = currentLanguage() === "en";
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="guest-start-title">
      <h2 id="guest-start-title">${isEn ? "Start trial without registration" : "登録せずにおためし開始"}</h2>
      <p>${isEn
        ? "Trial mode stores data only in this browser session on this device. If you close the session before registering, data cannot be authenticated or recovered."
        : "おためし利用のデータは、この端末の現在セッションにのみ保存されます。登録前にセッションが終了すると、データの認証・復元はできません。"}
      </p>
      <div class="modal-actions">
        <button type="button" class="secondary" data-action="close-modal">${t("modal.close")}</button>
        <button type="button" data-action="auth-confirm-guest">${isEn ? "Continue trial" : "このまま開始"}</button>
      </div>
    </section>
  `);
}

function startGuestSession() {
  const isEn = currentLanguage() === "en";
  saveAuthSession({ mode: "guest", startedAt: new Date().toISOString() });
  applyState(loadState(authSession));
  saveState();
  closeModal();
  if (window.location.hash.startsWith("#profile/")) window.location.hash = "#mine";
  render();
  showToast(isEn ? "Trial mode started." : "おためし利用を開始しました。");
}

async function logoutSession() {
  const isEn = currentLanguage() === "en";
  savePreferredLanguage(currentLanguage());
  // ゲストモードは Supabase 関与しないので signOut は user モードだけ呼ぶ
  if (authSession.mode === "user") {
    await supabaseSignOut();
  }
  saveAuthSession({ mode: "none" });
  applyState(loadState(authSession));
  setAuthModeTab("register");
  closeModal();
  window.location.hash = "#mine";
  render();
  showToast(isEn ? "Signed out." : "ログアウトしました。");
}

// ── exchange ──────────────────────────────────────────────────────────────────

function saveExchange(profileId) {
  const profile = findProfile(profileId);
  if (!profile) {
    showToast(t("toast.profileNotFound"));
    return;
  }
  const exchangeLimit = getPlanLimit("exchanges");
  if (Number.isFinite(exchangeLimit) && countExchangeTotal() >= exchangeLimit) {
    openLimitUpgradeModal("exchanges");
    return;
  }
  const rawEventName = document.querySelector("[data-exchange-event]")?.value || t("public.eventDefault");
  const eventName = rawEventName.trim() || t("book.eventUnset");

  const snapshot = {
    displayName: getDisplayName(profile),
    patternName: profile.patternName,
    title: getFieldValue(profile, "title"),
    oneLiner: getFieldValue(profile, "oneLiner"),
    profileUrl: getPublicUrl(profile.id)
  };
  const exchange = {
    // exchange.id は memoria.exchanges.id (uuid) と整合させる
    id: crypto.randomUUID(),
    targetProfileId: profile.id,
    method: "QR/URL",
    eventName,
    exchangedAt: new Date().toISOString(),
    snapshot,
    privateNote: "",
    tags: []
  };

  state.exchanges.unshift(exchange);
  setSelectedExchangeId(exchange.id);
  saveState();
  showToast(t("toast.exchangeAdded"));
  window.location.hash = "#book";
}

// ── i18n ──────────────────────────────────────────────────────────────────────

export function setLanguage(language) {
  if (!LANGUAGES.includes(language) || state.language === language) return;
  state.language = language;
  savePreferredLanguage(language);
  if (hasActiveSession()) saveState();
  render();
}

// ── toast / clipboard ─────────────────────────────────────────────────────────

export function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  setToastTimer(setTimeout(() => toast.classList.remove("show"), 2200));
}

function copyText(text) {
  if (navigator.clipboard) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(t("toast.copySuccess")))
      .catch(() => showToast(t("toast.copyFail")));
    return;
  }
  showToast(t("toast.copyFail"));
}
