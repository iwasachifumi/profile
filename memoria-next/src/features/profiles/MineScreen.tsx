"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Field, Link as ProfileLink, Profile } from "@/types";

// ── 定数 ─────────────────────────────────────────────────────────────────────

const GROUP_LABELS: Record<string, [string, string]> = {
  basic:        ["基本",              "Basic"],
  life:         ["生活",              "Life"],
  work:         ["仕事・学び",         "Work & Learning"],
  favorite:     ["趣味・エンタメ",     "Interests"],
  food:         ["食・好み",           "Food & Taste"],
  conversation: ["人間関係",           "Relationships"],
  digital:      ["ネット・デジタル",    "Digital"],
  values:       ["価値観・内面",        "Values"],
  whatif:       ["もしも系",           "What if"],
  free:         ["フリー",             "Free"],
};

const LINK_TYPE_LABELS: Record<string, string> = {
  website:   "Web",
  x:         "X",
  instagram: "Instagram",
  github:    "GitHub",
  linkedin:  "LinkedIn",
  other:     "Other",
};

const LINK_TYPE_OPTIONS = Object.entries(LINK_TYPE_LABELS).map(([id, label]) => ({ id, label }));

const THEME_OPTIONS = [
  { id: "default",  label: "ナチュラル" },
  { id: "business", label: "ビジネス" },
  { id: "study",    label: "スタディ" },
  { id: "friends",  label: "フレンズ" },
];

// ── helpers ───────────────────────────────────────────────────────────────────

function createDefaultField(): Field {
  return {
    id: crypto.randomUUID(),
    groupId: "basic",
    label: "",
    value: "",
    visible: true,
  };
}

function createDefaultLink(): ProfileLink {
  return {
    id: crypto.randomUUID(),
    type: "website",
    label: "Web",
    url: "",
    visible: true,
  };
}

function createProfileDraft(): Profile {
  return {
    id: crypto.randomUUID(),
    publicSlug: null,
    handle: null,
    isPublic: false,
    patternName: "新しいパターン",
    audience: "",
    description: "",
    themeId: "default",
    frameId: "none",
    fields: [],
    links: [],
    stickers: [],
  };
}

function cloneProfile(profile: Profile): Profile {
  return {
    ...profile,
    fields: [...profile.fields],
    links: [...profile.links],
    stickers: [...profile.stickers],
  };
}

function initialOf(name: string) {
  return (name || "?")[0].toUpperCase();
}

type BusyKind = "load" | "create" | "save" | "delete" | null;

// ── メイン ────────────────────────────────────────────────────────────────────

export default function MineScreen() {
  const { session, logout } = useSession();
  const { t } = useLang();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Profile | null>(null);
  const [busy, setBusy] = useState<BusyKind>("load");
  const [error, setError] = useState<string | null>(null);

  // フィールド / リンクのインライン編集 UI
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingLinkId, setEditingLinkId] = useState<string | null>(null);
  // 基本情報（patternName / audience）の編集
  const [editingBasic, setEditingBasic] = useState(false);
  // 自動保存
  const [savedRecently, setSavedRecently] = useState(false);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── データ読み込み ──────────────────────────────────────────────────────────

  const loadProfiles = useCallback(async () => {
    setBusy("load");
    setError(null);
    const result = await profilesApi.list();
    setBusy(null);
    if (!result.ok) {
      setProfiles([]);
      setSelectedId(null);
      setDraft(null);
      setError(result.error);
      return;
    }
    setProfiles(result.data);
    setSelectedId((currentId) => {
      const nextId = currentId ?? result.data[0]?.id ?? null;
      const found = result.data.find((p) => p.id === nextId) ?? null;
      setDraft(found ? cloneProfile(found) : null);
      return nextId;
    });
  }, []);

  useEffect(() => {
    if (session.status === "user") void loadProfiles();
  }, [loadProfiles, session.status]);

  // ── ハンドラ ────────────────────────────────────────────────────────────────

  function handleSelect(profile: Profile) {
    setSelectedId(profile.id);
    setDraft(cloneProfile(profile));
    setEditingFieldId(null);
    setEditingLinkId(null);
    setEditingBasic(false);
  }

  async function handleCreate() {
    const next = createProfileDraft();
    setBusy("create");
    setError(null);
    const result = await profilesApi.create(next);
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setProfiles((current) => [...current, next]);
    handleSelect(next);
    setEditingBasic(true);
  }

  // 実際の保存処理（draft を引数で受け取ってステール閉包を回避）
  async function doSave(target: Profile) {
    if (autoSaveTimer.current) { clearTimeout(autoSaveTimer.current); autoSaveTimer.current = null; }
    setBusy("save");
    setError(null);
    const result = await profilesApi.update(target.id, {
      publicSlug: target.publicSlug,
      handle: target.handle,
      isPublic: target.isPublic,
      patternName: target.patternName,
      audience: target.audience,
      description: target.description,
      themeId: target.themeId,
      frameId: target.frameId,
      fields: target.fields,
      links: target.links,
      stickers: target.stickers,
    });
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setProfiles((current) => current.map((p) => (p.id === target.id ? { ...target } : p)));
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2000);
  }

  // 変更から 700ms 後に自動保存
  function scheduleAutoSave(next: Profile) {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => void doSave(next), 700);
  }

  // 手動保存ボタン用
  function handleSave() {
    if (!draft) return;
    void doSave(draft);
  }

  async function handleDelete() {
    if (!selectedId) return;
    const removingId = selectedId;
    setBusy("delete");
    setError(null);
    const result = await profilesApi.remove(removingId);
    setBusy(null);
    if (!result.ok) { setError(result.error); return; }
    setProfiles((current) => {
      const next = current.filter((p) => p.id !== removingId);
      const nextSelected = next[0] ?? null;
      setSelectedId(nextSelected?.id ?? null);
      setDraft(nextSelected ? cloneProfile(nextSelected) : null);
      return next;
    });
  }

  // フィールド操作
  function updateField(id: string, patch: Partial<Field>) {
    if (!draft) return;
    const next = { ...draft, fields: draft.fields.map((f) => (f.id === id ? { ...f, ...patch } : f)) };
    setDraft(next); scheduleAutoSave(next);
  }
  function addFieldToGroup(groupId: string) {
    if (!draft) return;
    const newField = { ...createDefaultField(), groupId };
    const next = { ...draft, fields: [...draft.fields, newField] };
    setDraft(next); setEditingFieldId(newField.id); scheduleAutoSave(next);
  }
  function removeField(id: string) {
    if (!draft) return;
    const next = { ...draft, fields: draft.fields.filter((f) => f.id !== id) };
    setDraft(next); if (editingFieldId === id) setEditingFieldId(null); scheduleAutoSave(next);
  }
  function removeGroup(groupId: string) {
    if (!draft) return;
    const next = { ...draft, fields: draft.fields.filter((f) => f.groupId !== groupId) };
    setDraft(next); scheduleAutoSave(next);
  }

  // リンク操作
  function updateLink(id: string, patch: Partial<ProfileLink>) {
    if (!draft) return;
    const next = { ...draft, links: draft.links.map((l) => (l.id === id ? { ...l, ...patch } : l)) };
    setDraft(next); scheduleAutoSave(next);
  }
  function addLink() {
    if (!draft) return;
    const newLink = createDefaultLink();
    const next = { ...draft, links: [...draft.links, newLink] };
    setDraft(next); setEditingLinkId(newLink.id); scheduleAutoSave(next);
  }
  function removeLink(id: string) {
    if (!draft) return;
    const next = { ...draft, links: draft.links.filter((l) => l.id !== id) };
    setDraft(next); if (editingLinkId === id) setEditingLinkId(null); scheduleAutoSave(next);
  }

  // ── ガード ──────────────────────────────────────────────────────────────────

  if (session.status === "loading") {
    return (
      <main className="app-shell">
        <p className="muted">{t("確認中...", "Loading...")}</p>
      </main>
    );
  }

  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/mine" />;
  }

  // ── フィールドのグループ別表示 ───────────────────────────────────────────────

  const fieldsByGroup: Record<string, Field[]> = {};
  if (draft) {
    for (const field of draft.fields) {
      const gid = field.groupId || "basic";
      if (!fieldsByGroup[gid]) fieldsByGroup[gid] = [];
      fieldsByGroup[gid].push(field);
    }
  }
  const groupOrder = ["basic", "life", "work", "favorite", "food", "conversation", "digital", "values", "whatif", "free"];
  const activeGroups = [
    ...groupOrder.filter((g) => fieldsByGroup[g]?.length),
    ...Object.keys(fieldsByGroup).filter((g) => !groupOrder.includes(g)),
  ];
  // 項目が1件以上あるグループのみ表示（× で削除すると消える）
  const allGroups = [...new Set([...groupOrder, ...Object.keys(fieldsByGroup)])]
    .filter((g) => (fieldsByGroup[g]?.length ?? 0) > 0);
  // 削除済み（空）の標準グループ — 復元ボタンに使う
  const hiddenGroups = groupOrder.filter((g) => !fieldsByGroup[g]?.length);

  // ── レンダリング ─────────────────────────────────────────────────────────────

  return (
    <main className="app-shell">
      {/* ── セクションタイトル ───────────────────────────────────────────────── */}
      <section className="section-title">
        <div>
          <h1>{t("マイページ", "My page")}</h1>
          <p className="muted">
            {session.user.isGuest
              ? t("ゲスト利用中 — 設定からログイン登録するとデータを保持できます", "Guest mode — register in settings to keep your data")
              : session.user.email}
          </p>
        </div>
        <div className="row">
          {draft && draft.isPublic && draft.publicSlug && (
            <Link className="button secondary" href={`/profile/${draft.publicSlug}`}>
              {t("公開ページを見る", "View public page")}
            </Link>
          )}
          <button
            type="button"
            className="secondary"
            onClick={() => void logout()}
          >
            {t("ログアウト", "Sign out")}
          </button>
        </div>
      </section>

      {/* ── パターンタブ ─────────────────────────────────────────────────────── */}
      <section className="panel pad pattern-toolbar">
        <div className="pattern-label">
          <span>{t("パターン", "Pattern")}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => void handleCreate()}
            disabled={busy === "create"}
            aria-label={t("パターンを追加", "Add pattern")}
            title={t("パターンを追加", "Add pattern")}
          >
            +
          </button>
        </div>
        <div className="profile-tabs" role="tablist" aria-label={t("パターン選択", "Pattern tabs")}>
          {busy === "load" ? (
            <span className="muted small">{t("読み込み中...", "Loading...")}</span>
          ) : profiles.length === 0 ? (
            <span className="muted small">{t("パターンがありません。＋で追加してください。", "No patterns yet. Click + to add one.")}</span>
          ) : (
            profiles.map((profile) => (
              <button
                key={profile.id}
                type="button"
                className={`profile-tab${selectedId === profile.id ? " active" : ""}`}
                role="tab"
                aria-selected={selectedId === profile.id}
                onClick={() => handleSelect(profile)}
              >
                <strong>{profile.patternName || t("無題", "Untitled")}</strong>
                <span>{profile.audience || "—"}</span>
              </button>
            ))
          )}
        </div>
      </section>

      {/* ── エディター ───────────────────────────────────────────────────────── */}
      {draft ? (
        <div className="phone-workspace">
          <section className="panel pad stack phone-screen" aria-label={t("プロフィール編集", "Profile editor")}>

            {/* パターン名 + 削除 */}
            <div className="section-title">
              <div>
                {editingBasic ? (
                  <div className="stack" style={{ gap: "6px" }}>
                    <input
                      value={draft.patternName}
                      onChange={(e) => { const n = { ...draft, patternName: e.target.value }; setDraft(n); scheduleAutoSave(n); }}
                      placeholder={t("パターン名", "Pattern name")}
                      style={{ fontSize: "18px", fontWeight: "800" }}
                      autoFocus
                    />
                    <input
                      value={draft.audience}
                      onChange={(e) => { const n = { ...draft, audience: e.target.value }; setDraft(n); scheduleAutoSave(n); }}
                      placeholder={t("対象（例：仕事、友人）", "Audience (e.g. work, friends)")}
                    />
                  </div>
                ) : (
                  <>
                    <h2>{draft.patternName || t("無題", "Untitled")}</h2>
                    <span className="muted small">{draft.audience || t("対象未設定", "No audience set")}</span>
                  </>
                )}
              </div>
              <div className="row" style={{ gap: "6px" }}>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => setEditingBasic((v) => !v)}
                  title={t("パターン名を編集", "Edit pattern name")}
                >
                  &#9998;
                </button>
                <button
                  type="button"
                  className="icon-button"
                  onClick={() => void handleDelete()}
                  disabled={busy === "delete"}
                  title={t("このパターンを削除", "Delete this pattern")}
                  style={{ color: "var(--pink)" }}
                >
                  &#x2715;
                </button>
              </div>
            </div>

            {/* アバター + テーマ */}
            <div className="add-box">
              <h3 style={{ margin: "0 0 10px" }}>{t("アバター・デザイン", "Avatar & design")}</h3>
              <div className="avatar-editor">
                <div className="avatar preview-avatar">
                  <span>{initialOf(draft.patternName)}</span>
                </div>
                <div className="avatar-editor-actions">
                  <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                    {t("テーマ", "Theme")}
                    <select
                      value={draft.themeId}
                      onChange={(e) => { const n = { ...draft, themeId: e.target.value }; setDraft(n); scheduleAutoSave(n); }}
                    >
                      {THEME_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.label}</option>
                      ))}
                    </select>
                  </label>
                </div>
              </div>
              <p className="muted small" style={{ marginTop: "8px" }}>
                {t("シールや台紙は「デザイン」「シール」メニューから設定できます。", "Set frame and stickers from the Design & Stickers menus.")}
              </p>
            </div>

            {/* ── 項目 ─────────────────────────────────────────────────────── */}
            <div className="stack">
              <h3 style={{ margin: 0 }}>{t("情報", "Info")}</h3>

              {allGroups.map((groupId) => {
                const fields = fieldsByGroup[groupId] || [];
                const [labelJa, labelEn] = GROUP_LABELS[groupId] ?? [groupId, groupId];
                return (
                  <details key={groupId} className="field-group" open={fields.length > 0 || activeGroups.includes(groupId)}>
                    <summary>
                      <span>
                        {t(labelJa, labelEn)}{" "}
                        <span className="muted small">{t(`${fields.length}件`, `${fields.length} items`)}</span>
                      </span>
                      <span style={{ display: "flex", gap: "4px", alignItems: "center" }}>
                        <button
                          type="button"
                          className="icon-button mini-button"
                          onClick={(e) => { e.preventDefault(); addFieldToGroup(groupId); }}
                          aria-label={t("項目を追加", "Add item")}
                          title={t("項目を追加", "Add item")}
                        >
                          +
                        </button>
                        <button
                          type="button"
                          className="icon-button mini-button"
                          onClick={(e) => { e.preventDefault(); removeGroup(groupId); }}
                          aria-label={t("グループを削除", "Remove group")}
                          title={t("グループごと削除", "Remove all items in this group")}
                          style={{ color: "var(--pink)" }}
                        >
                          ×
                        </button>
                      </span>
                    </summary>
                    <div className="field-list">
                      {fields.length === 0 ? (
                        <p className="muted small" style={{ padding: "0 0 4px" }}>{t("（未設定）", "(empty)")}</p>
                      ) : (
                        fields.map((field) => (
                          <div key={field.id} className="field-card">
                            <div className="field-card-head">
                              <strong>{field.label || t("ラベル未設定", "No label")}</strong>
                              <button
                                type="button"
                                className="icon-button more-button"
                                onClick={() => setEditingFieldId(editingFieldId === field.id ? null : field.id)}
                                aria-label={t("編集", "Edit")}
                                title={t("編集", "Edit")}
                              >
                                &#9998;
                              </button>
                            </div>

                            {editingFieldId === field.id ? (
                              <div className="stack" style={{ gap: "8px" }}>
                                <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                                  {t("ラベル", "Label")}
                                  <input
                                    value={field.label}
                                    onChange={(e) => updateField(field.id, { label: e.target.value })}
                                    autoFocus
                                  />
                                </label>
                                <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                                  {t("内容", "Value")}
                                  <input
                                    value={field.value}
                                    onChange={(e) => updateField(field.id, { value: e.target.value })}
                                  />
                                </label>
                                <div className="row" style={{ gap: "8px" }}>
                                  <label className="checkline" style={{ fontSize: "12px" }}>
                                    <input
                                      type="checkbox"
                                      checked={field.visible}
                                      style={{ width: "auto" }}
                                      onChange={(e) => updateField(field.id, { visible: e.target.checked })}
                                    />
                                    {t("公開", "Visible")}
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => removeField(field.id)}
                                    style={{ background: "none", border: "none", color: "var(--pink)", fontSize: "12px", cursor: "pointer", padding: "2px 4px", minHeight: "auto" }}
                                  >
                                    {t("削除", "Remove")}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p>{field.value || <span className="muted">{t("（未設定）", "(unset)")}</span>}</p>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </details>
                );
              })}

              {/* 削除済みグループの復元ボタン */}
              {hiddenGroups.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "4px" }}>
                  <span className="muted small" style={{ width: "100%", fontSize: "11px" }}>
                    {t("非表示のグループ（クリックで復元）:", "Hidden groups (click to restore):")}
                  </span>
                  {hiddenGroups.map((gid) => {
                    const [lJa, lEn] = GROUP_LABELS[gid] ?? [gid, gid];
                    return (
                      <button
                        key={gid}
                        type="button"
                        className="button secondary"
                        style={{ fontSize: "12px", padding: "3px 10px", minHeight: "auto" }}
                        onClick={() => addFieldToGroup(gid)}
                      >
                        + {t(lJa, lEn)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* ── リンク ─────────────────────────────────────────────────────── */}
            <div className="stack">
              <div className="section-title">
                <h3 style={{ margin: 0 }}>{t("リンク", "Links")}</h3>
                <button
                  type="button"
                  className="icon-button mini-button"
                  onClick={addLink}
                  aria-label={t("リンクを追加", "Add link")}
                  title={t("リンクを追加", "Add link")}
                >
                  +
                </button>
              </div>
              <div className="link-list">
                {draft.links.length === 0 ? (
                  <p className="muted small">{t("リンクがありません。", "No links yet.")}</p>
                ) : (
                  draft.links.map((link) => (
                    <div key={link.id} className="field-card link-card">
                      <div className="field-card-head">
                        <strong>{LINK_TYPE_LABELS[link.type] ?? link.type}</strong>
                        <button
                          type="button"
                          className="icon-button more-button"
                          onClick={() => setEditingLinkId(editingLinkId === link.id ? null : link.id)}
                          aria-label={t("編集", "Edit")}
                        >
                          &#9998;
                        </button>
                      </div>

                      {editingLinkId === link.id ? (
                        <div className="stack" style={{ gap: "8px" }}>
                          <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                            {t("種類", "Type")}
                            <select
                              value={link.type}
                              onChange={(e) => updateLink(link.id, { type: e.target.value, label: LINK_TYPE_LABELS[e.target.value] ?? e.target.value })}
                            >
                              {LINK_TYPE_OPTIONS.map((opt) => (
                                <option key={opt.id} value={opt.id}>{opt.label}</option>
                              ))}
                            </select>
                          </label>
                          <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                            URL
                            <input
                              type="url"
                              value={link.url}
                              onChange={(e) => updateLink(link.id, { url: e.target.value })}
                              placeholder="https://"
                            />
                          </label>
                          <div className="row" style={{ gap: "8px" }}>
                            <label className="checkline" style={{ fontSize: "12px" }}>
                              <input
                                type="checkbox"
                                checked={link.visible}
                                style={{ width: "auto" }}
                                onChange={(e) => updateLink(link.id, { visible: e.target.checked })}
                              />
                              {t("公開", "Visible")}
                            </label>
                            <button
                              type="button"
                              onClick={() => removeLink(link.id)}
                              style={{ background: "none", border: "none", color: "var(--pink)", fontSize: "12px", cursor: "pointer", padding: "2px 4px", minHeight: "auto" }}
                            >
                              {t("削除", "Remove")}
                            </button>
                          </div>
                        </div>
                      ) : link.url ? (
                        <a
                          className="link-card-url"
                          href={link.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {link.url.replace(/^https?:\/\//, "").slice(0, 60)}
                        </a>
                      ) : (
                        <p className="muted small">{t("（URL未設定）", "(no URL)")}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* ── エラー表示 ────────────────────────────────────────────────── */}
            {error && <p className="error-text">{error}</p>}

            {/* ── 保存ステータス + 遷移リンク ──────────────────────────────── */}
            <div className="row">
              <button
                type="button"
                onClick={handleSave}
                disabled={busy === "save"}
                style={savedRecently ? { background: "var(--green, #22c55e)", color: "#fff", borderColor: "transparent" } : undefined}
              >
                {busy === "save"
                  ? t("保存中...", "Saving...")
                  : savedRecently
                  ? t("✓ 保存済み", "✓ Saved")
                  : t("保存", "Save")}
              </button>
              <Link className="button secondary" href={`/preview/${draft.id}`}>
                {t("プレビュー", "Preview")}
              </Link>
              <Link className="button secondary" href="/design">
                {t("デザイン", "Design")}
              </Link>
              <Link className="button secondary" href="/stickers">
                {t("シール", "Stickers")}
              </Link>
            </div>

          </section>
        </div>
      ) : busy !== "load" ? (
        <div className="empty-state">
          <p className="muted">{t("＋ボタンでパターンを追加してください。", "Click + to create your first pattern.")}</p>
        </div>
      ) : null}
    </main>
  );
}
