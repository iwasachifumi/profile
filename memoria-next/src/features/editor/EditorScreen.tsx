"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Field, Link as ProfileLink, Profile } from "@/types";

// ── Constants ────────────────────────────────────────────────────────────────

const STAMP_FILES = [
  "mikeneko.png", "kuroneko.png", "cat_black.png", "hamster.png",
  "kyohishiba.png", "nezumi_2.png", "frog_sit.png", "tori.png",
  "hetauma_tora2.png", "hetauma_usa8.png", "kanasi_l.png", "couple2_l.png",
  "dancing_l.png", "yakimoti_oyako.png",
  "apple.png", "candy.png", "candy2.png", "candy_2.png",
  "hetauma_candy.png", "shortcake.png", "ichigo.png", "ginger-cookie.png",
  "heart_2.png", "good.png", "star.png", "sun.png",
  "garland.png", "garland_ribbon.png", "garland_star_right.png",
  "sirotumeline.png", "azisai_ame_line_r.png", "hiyoko_line3.png",
  "ribon_thin.png", "yuki_line2.png", "hasami_kiritori_hai.png",
  "Orange_line01.png", "usa_koi3.png",
  "1037_color.png", "1123_color.png", "9663_color.png",
  "11656_color.png", "16366_color.png", "16441_color.png",
  "16970_color.png", "17322_color.png", "23868_color.png",
  "24815_color.png", "24820_color.png", "24850_color.png",
  "24941_color.png", "25085.png", "25676_color.png",
  "25698_color.png", "26490_color.png", "26568_color.png", "26568.png",
];

const FRAMES = [
  { id: "none",                           labelJa: "枠なし",    file: null },
  { id: "f0385_1.png",                    labelJa: "リボン",    file: "f0385_1.png" },
  { id: "f0716_1.png",                    labelJa: "スター",    file: "f0716_1.png" },
  { id: "f0658_1.png",                    labelJa: "フラワー",  file: "f0658_1.png" },
  { id: "f1165_2.png",                    labelJa: "クラシック",file: "f1165_2.png" },
  { id: "kawahu106-1536x864.png",         labelJa: "花わく",    file: "kawahu106-1536x864.png" },
  { id: "kirahoshi-1536x864.png",         labelJa: "キラ星",    file: "kirahoshi-1536x864.png" },
  { id: "kirakiraandf116-1536x864.png",   labelJa: "キラキラ",  file: "kirakiraandf116-1536x864.png" },
  { id: "neon057-1536x864.png",           labelJa: "ネオン",    file: "neon057-1536x864.png" },
  { id: "okumonof_mangaf41-1536x864.png", labelJa: "マンガ",    file: "okumonof_mangaf41-1536x864.png" },
];

const THEMES = [
  { id: "default",  labelJa: "ナチュラル", labelEn: "Natural"  },
  { id: "business", labelJa: "ビジネス",   labelEn: "Business" },
  { id: "study",    labelJa: "スタディ",   labelEn: "Study"    },
  { id: "friends",  labelJa: "フレンズ",   labelEn: "Friends"  },
];

const GROUP_LABELS: Record<string, [string, string]> = {
  basic:        ["基本",           "Basic"],
  life:         ["生活",           "Life"],
  work:         ["仕事・学び",      "Work"],
  favorite:     ["趣味・エンタメ",  "Interests"],
  food:         ["食・好み",        "Food"],
  conversation: ["人間関係",        "Relationships"],
  digital:      ["ネット・デジタル", "Digital"],
  values:       ["価値観・内面",     "Values"],
  whatif:       ["もしも系",        "What if"],
  free:         ["フリー",          "Free"],
};

const GROUP_ORDER = [
  "basic", "life", "work", "favorite", "food",
  "conversation", "digital", "values", "whatif", "free",
];

const LINK_TYPE_LABELS: Record<string, string> = {
  website: "Web", x: "X", instagram: "Instagram",
  github: "GitHub", linkedin: "LinkedIn", other: "Other",
};
const LINK_TYPE_OPTIONS = Object.entries(LINK_TYPE_LABELS).map(([id, label]) => ({ id, label }));

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function fileToLabel(f: string) {
  return f.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/ color$/, "").trim();
}
function initialOf(name: string) { return (name || "?")[0].toUpperCase(); }
function cloneProfile(p: Profile): Profile {
  return { ...p, fields: [...p.fields], links: [...p.links], stickers: [...p.stickers] };
}

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "stickers" | "frame" | "friends" | "settings";
type BusyKind = "load" | "create" | "save" | "delete" | null;

const TABS: { id: Tab; icon: string; labelJa: string; labelEn: string }[] = [
  { id: "stickers", icon: "🏷", labelJa: "シール",   labelEn: "Stickers" },
  { id: "frame",    icon: "🖼", labelJa: "フレーム", labelEn: "Frame"    },
  { id: "friends",  icon: "👥", labelJa: "友達",     labelEn: "Friends"  },
  { id: "settings", icon: "⚙️", labelJa: "設定",     labelEn: "Settings" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function EditorScreen() {
  const { session, logout } = useSession();
  const { t } = useLang();

  const [profiles,  setProfiles]  = useState<Profile[]>([]);
  const [activeId,  setActiveId]  = useState<string | null>(null);
  const [draft,     setDraft]     = useState<Profile | null>(null);
  const [busy,      setBusy]      = useState<BusyKind>("load");
  const [error,     setError]     = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);
  const [savedRecently,      setSavedRecently]      = useState(false);
  const [editingFieldId,     setEditingFieldId]     = useState<string | null>(null);
  const [editingLinkId,      setEditingLinkId]      = useState<string | null>(null);

  const paperRef      = useRef<HTMLDivElement>(null);
  const dragState     = useRef<{ idx: number } | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDraft   = useRef<Profile | null>(null);  // stale-closure guard for drag

  // keep latestDraft in sync
  useEffect(() => { latestDraft.current = draft; }, [draft]);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setBusy("load");
    setError(null);
    const res = await profilesApi.list();
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles(res.data);
    setActiveId((cur) => {
      const nextId = cur ?? res.data[0]?.id ?? null;
      const found  = res.data.find((p) => p.id === nextId) ?? null;
      setDraft(found ? cloneProfile(found) : null);
      return nextId;
    });
  }, []);

  useEffect(() => {
    if (session.status === "user") void load();
  }, [load, session.status]);

  // ── Save ──────────────────────────────────────────────────────────────────

  async function doSave(target: Profile) {
    if (autoSaveTimer.current) { clearTimeout(autoSaveTimer.current); autoSaveTimer.current = null; }
    setBusy("save");
    setError(null);
    const res = await profilesApi.update(target.id, target);
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => prev.map((p) => p.id === target.id ? { ...target } : p));
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2000);
  }

  function scheduleAutoSave(next: Profile) {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => void doSave(next), 700);
  }

  function applyAndSave(next: Profile) { setDraft(next); scheduleAutoSave(next); }

  // ── Pattern ───────────────────────────────────────────────────────────────

  function selectProfile(id: string) {
    const p = profiles.find((x) => x.id === id);
    if (!p) return;
    setActiveId(id);
    setDraft(cloneProfile(p));
    setSelectedStickerIdx(null);
    setEditingFieldId(null);
    setEditingLinkId(null);
  }

  async function handleCreate() {
    const next: Profile = {
      id: crypto.randomUUID(), publicSlug: null, handle: null, isPublic: false,
      patternName: "新しいパターン", audience: "", description: "",
      themeId: "default", frameId: "none", fields: [], links: [], stickers: [],
    };
    setBusy("create");
    const res = await profilesApi.create(next);
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => [...prev, next]);
    setActiveId(next.id);
    setDraft(cloneProfile(next));
    setActiveTab("settings");
  }

  async function handleDeletePattern() {
    if (!draft) return;
    if (!confirm(t("このパターンを削除しますか？", "Delete this pattern?"))) return;
    setBusy("delete");
    const res = await profilesApi.remove(draft.id);
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    const remaining = profiles.filter((p) => p.id !== draft.id);
    setProfiles(remaining);
    const next = remaining[0] ?? null;
    setActiveId(next?.id ?? null);
    setDraft(next ? cloneProfile(next) : null);
  }

  // ── Field ops ─────────────────────────────────────────────────────────────

  function updateField(id: string, patch: Partial<Field>) {
    if (!draft) return;
    applyAndSave({ ...draft, fields: draft.fields.map((f) => f.id === id ? { ...f, ...patch } : f) });
  }
  function addFieldToGroup(groupId: string) {
    if (!draft) return;
    const nf: Field = { id: crypto.randomUUID(), groupId, label: "", value: "", visible: true };
    const next = { ...draft, fields: [...draft.fields, nf] };
    setDraft(next); setEditingFieldId(nf.id); scheduleAutoSave(next);
  }
  function removeField(id: string) {
    if (!draft) return;
    applyAndSave({ ...draft, fields: draft.fields.filter((f) => f.id !== id) });
    if (editingFieldId === id) setEditingFieldId(null);
  }
  function removeGroup(groupId: string) {
    if (!draft) return;
    applyAndSave({ ...draft, fields: draft.fields.filter((f) => f.groupId !== groupId) });
  }

  // ── Link ops ──────────────────────────────────────────────────────────────

  function updateLink(id: string, patch: Partial<ProfileLink>) {
    if (!draft) return;
    applyAndSave({ ...draft, links: draft.links.map((l) => l.id === id ? { ...l, ...patch } : l) });
  }
  function addLink() {
    if (!draft) return;
    const nl: ProfileLink = { id: crypto.randomUUID(), type: "website", label: "Web", url: "", visible: true };
    const next = { ...draft, links: [...draft.links, nl] };
    setDraft(next); setEditingLinkId(nl.id); scheduleAutoSave(next);
  }
  function removeLink(id: string) {
    if (!draft) return;
    applyAndSave({ ...draft, links: draft.links.filter((l) => l.id !== id) });
    if (editingLinkId === id) setEditingLinkId(null);
  }

  // ── Sticker ops ───────────────────────────────────────────────────────────

  function handleAddSticker(file: string) {
    if (!draft) return;
    const item = { id: crypto.randomUUID(), stickerId: file, x: 50, y: 50, scale: 1 };
    const next = { ...draft, stickers: [...draft.stickers, item] };
    setSelectedStickerIdx(next.stickers.length - 1);
    applyAndSave(next);
  }
  function handleDeleteSticker(idx: number) {
    if (!draft) return;
    setSelectedStickerIdx(null);
    applyAndSave({ ...draft, stickers: draft.stickers.filter((_, i) => i !== idx) });
  }
  function handleResizeSticker(idx: number, delta: number) {
    if (!draft) return;
    applyAndSave({
      ...draft,
      stickers: draft.stickers.map((s, i) =>
        i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.3, 3) } : s
      ),
    });
  }

  // ── Drag ──────────────────────────────────────────────────────────────────

  function onStickerPointerDown(e: React.PointerEvent, idx: number) {
    if ((e.target as HTMLElement).closest("[data-sticker-control]")) return;
    e.preventDefault(); e.stopPropagation();
    setSelectedStickerIdx(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { idx };
  }

  function onPaperPointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !paperRef.current) return;
    e.preventDefault();
    const rect = paperRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 92);
    setDraft((prev) =>
      prev ? { ...prev, stickers: prev.stickers.map((s, i) => i === ds.idx ? { ...s, x, y } : s) } : prev
    );
  }

  function onPaperPointerUp() {
    if (!dragState.current) return;
    dragState.current = null;
    const cur = latestDraft.current;
    if (cur) void doSave(cur);
  }

  function onPaperClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
    setSelectedStickerIdx(null);
  }

  // ── Design ────────────────────────────────────────────────────────────────

  function handleSetTheme(themeId: string) {
    if (!draft) return; applyAndSave({ ...draft, themeId });
  }
  function handleSetFrame(frameId: string) {
    if (!draft) return; applyAndSave({ ...draft, frameId });
  }

  // ── Guards ────────────────────────────────────────────────────────────────

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("確認中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/mine" />;
  }

  // ── Computed ──────────────────────────────────────────────────────────────

  const stickers = draft?.stickers ?? [];

  const fieldsByGroup: Record<string, Field[]> = {};
  if (draft) {
    for (const field of draft.fields) {
      const gid = field.groupId || "basic";
      if (!fieldsByGroup[gid]) fieldsByGroup[gid] = [];
      fieldsByGroup[gid].push(field);
    }
  }
  const allGroups  = [...new Set([...GROUP_ORDER, ...Object.keys(fieldsByGroup)])]
    .filter((g) => (fieldsByGroup[g]?.length ?? 0) > 0);
  const hiddenGroups = GROUP_ORDER.filter((g) => !fieldsByGroup[g]?.length);

  // ── Panel: シール ─────────────────────────────────────────────────────────

  function renderStickerPanel() {
    return (
      <div className="stack" style={{ gap: "10px" }}>
        <p className="muted small" style={{ margin: 0 }}>{t("タップしてカードに貼る", "Tap to add to card")}</p>
        <div className="sticker-grid">
          {STAMP_FILES.map((file) => (
            <button
              key={file} type="button" className="sticker-choice"
              onClick={() => { handleAddSticker(file); setActiveTab("stickers"); }}
              title={fileToLabel(file)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`/stamp/${file}`} alt={fileToLabel(file)}
                style={{ width: "56px", height: "56px", objectFit: "contain" }} />
              <span className="muted small">{fileToLabel(file)}</span>
            </button>
          ))}
        </div>
        {stickers.length > 0 && (
          <button
            type="button" className="button secondary"
            style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto", color: "var(--pink)", width: "100%" }}
            onClick={() => draft && applyAndSave({ ...draft, stickers: [] })}
          >
            {t("全部はがす", "Remove all stickers")}
          </button>
        )}
      </div>
    );
  }

  // ── Panel: フレーム ───────────────────────────────────────────────────────

  function renderFramePanel() {
    if (!draft) return null;
    return (
      <div className="stack">
        <div>
          <p className="muted small" style={{ margin: "0 0 6px" }}>{t("テーマ（用紙の色）", "Paper theme")}</p>
          <div className="theme-grid">
            {THEMES.map((th) => (
              <button
                key={th.id} type="button"
                className={`theme-choice${draft.themeId === th.id ? " active" : ""}`}
                onClick={() => handleSetTheme(th.id)}
              >
                <strong style={{ fontSize: "13px" }}>{t(th.labelJa, th.labelEn)}</strong>
              </button>
            ))}
          </div>
        </div>
        <div>
          <p className="muted small" style={{ margin: "0 0 6px" }}>{t("フレーム", "Frame")}</p>
          <div className="frame-grid">
            {FRAMES.map((fr) => (
              <button
                key={fr.id} type="button"
                className={`frame-choice${draft.frameId === fr.id ? " active" : ""}`}
                onClick={() => handleSetFrame(fr.id)}
              >
                <div className={`frame-thumb${fr.id === "none" ? " frame-thumb-none" : ""}`}>
                  {fr.id === "none"
                    ? <span style={{ fontSize: "12px" }}>{t("なし", "None")}</span>
                    : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={`/frame/${fr.file ?? ""}`} alt={fr.labelJa}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    )
                  }
                </div>
                <strong style={{ fontSize: "11px" }}>{fr.labelJa}</strong>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Panel: 友達 ───────────────────────────────────────────────────────────

  function renderFriendsPanel() {
    return (
      <div className="stack" style={{ textAlign: "center", padding: "28px 0" }}>
        <p style={{ fontSize: "40px", margin: 0 }}>👥</p>
        <p style={{ margin: "8px 0 0", fontWeight: 700 }}>{t("名刺交換", "Card Exchange")}</p>
        <p className="muted small" style={{ margin: "4px 0 0" }}>
          {t("近日公開予定です", "Coming soon")}
        </p>
      </div>
    );
  }

  // ── Panel: 設定（フィールド・基本情報） ───────────────────────────────────

  function renderSettingsPanel() {
    if (!draft) return null;
    return (
      <div className="stack">
        {/* 基本 */}
        <div className="stack" style={{ gap: "8px" }}>
          <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
            {t("パターン名", "Pattern name")}
            <input value={draft.patternName}
              onChange={(e) => { const n = { ...draft, patternName: e.target.value }; setDraft(n); scheduleAutoSave(n); }} />
          </label>
          <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
            {t("対象", "Audience")}
            <input value={draft.audience} placeholder={t("例：仕事、友人", "e.g. work, friends")}
              onChange={(e) => { const n = { ...draft, audience: e.target.value }; setDraft(n); scheduleAutoSave(n); }} />
          </label>
          <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
            {t("ひとこと", "Description")}
            <input value={draft.description}
              onChange={(e) => { const n = { ...draft, description: e.target.value }; setDraft(n); scheduleAutoSave(n); }} />
          </label>
        </div>

        {/* フィールド */}
        <div>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px" }}>{t("プロフィール項目", "Profile fields")}</h3>
          <div className="stack" style={{ gap: "6px" }}>
            {allGroups.map((groupId) => {
              const fields = fieldsByGroup[groupId] || [];
              const [lJa, lEn] = GROUP_LABELS[groupId] ?? [groupId, groupId];
              return (
                <details key={groupId} className="field-group">
                  <summary>
                    <span>
                      {t(lJa, lEn)}{" "}
                      <span className="muted small">{fields.length}{t("件", "")}</span>
                    </span>
                    <span style={{ display: "flex", gap: "4px" }}>
                      <button type="button" className="icon-button mini-button"
                        onClick={(e) => { e.preventDefault(); addFieldToGroup(groupId); }}>+</button>
                      <button type="button" className="icon-button mini-button"
                        onClick={(e) => { e.preventDefault(); removeGroup(groupId); }}
                        style={{ color: "var(--pink)" }}>×</button>
                    </span>
                  </summary>
                  <div className="field-list">
                    {fields.map((field) => (
                      <div key={field.id} className="field-card">
                        <div className="field-card-head">
                          <strong>{field.label || t("ラベル未設定", "No label")}</strong>
                          <button type="button" className="icon-button more-button"
                            onClick={() => setEditingFieldId(editingFieldId === field.id ? null : field.id)}>
                            &#9998;
                          </button>
                        </div>
                        {editingFieldId === field.id ? (
                          <div className="stack" style={{ gap: "6px" }}>
                            <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                              {t("ラベル", "Label")}
                              <input value={field.label} autoFocus
                                onChange={(e) => updateField(field.id, { label: e.target.value })} />
                            </label>
                            <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                              {t("内容", "Value")}
                              <input value={field.value}
                                onChange={(e) => updateField(field.id, { value: e.target.value })} />
                            </label>
                            <div className="row" style={{ gap: "8px" }}>
                              <label className="checkline" style={{ fontSize: "12px" }}>
                                <input type="checkbox" checked={field.visible} style={{ width: "auto" }}
                                  onChange={(e) => updateField(field.id, { visible: e.target.checked })} />
                                {t("公開", "Visible")}
                              </label>
                              <button type="button" onClick={() => removeField(field.id)}
                                style={{ background: "none", border: "none", color: "var(--pink)", fontSize: "12px", cursor: "pointer", padding: "2px 4px", minHeight: "auto" }}>
                                {t("削除", "Remove")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p style={{ margin: 0 }}>
                            {field.value || <span className="muted">{t("（未設定）", "(unset)")}</span>}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </details>
              );
            })}

            {hiddenGroups.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", paddingTop: "4px" }}>
                <span className="muted small" style={{ width: "100%", fontSize: "11px" }}>
                  {t("非表示のグループ:", "Hidden groups:")}
                </span>
                {hiddenGroups.map((gid) => {
                  const [lJa, lEn] = GROUP_LABELS[gid] ?? [gid, gid];
                  return (
                    <button key={gid} type="button" className="button secondary"
                      style={{ fontSize: "12px", padding: "3px 10px", minHeight: "auto" }}
                      onClick={() => addFieldToGroup(gid)}>
                      + {t(lJa, lEn)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* リンク */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>{t("リンク", "Links")}</h3>
            <button type="button" className="icon-button mini-button" onClick={addLink}>+</button>
          </div>
          <div className="link-list">
            {draft.links.map((link) => (
              <div key={link.id} className="field-card link-card">
                <div className="field-card-head">
                  <strong>{LINK_TYPE_LABELS[link.type] ?? link.type}</strong>
                  <button type="button" className="icon-button more-button"
                    onClick={() => setEditingLinkId(editingLinkId === link.id ? null : link.id)}>
                    &#9998;
                  </button>
                </div>
                {editingLinkId === link.id ? (
                  <div className="stack" style={{ gap: "6px" }}>
                    <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                      {t("種類", "Type")}
                      <select value={link.type}
                        onChange={(e) => updateLink(link.id, { type: e.target.value, label: LINK_TYPE_LABELS[e.target.value] ?? e.target.value })}>
                        {LINK_TYPE_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                      </select>
                    </label>
                    <label style={{ fontSize: "13px", color: "var(--muted)", gap: "4px", display: "grid" }}>
                      URL
                      <input type="url" value={link.url} placeholder="https://"
                        onChange={(e) => updateLink(link.id, { url: e.target.value })} />
                    </label>
                    <div className="row" style={{ gap: "8px" }}>
                      <label className="checkline" style={{ fontSize: "12px" }}>
                        <input type="checkbox" checked={link.visible} style={{ width: "auto" }}
                          onChange={(e) => updateLink(link.id, { visible: e.target.checked })} />
                        {t("公開", "Visible")}
                      </label>
                      <button type="button" onClick={() => removeLink(link.id)}
                        style={{ background: "none", border: "none", color: "var(--pink)", fontSize: "12px", cursor: "pointer", padding: "2px 4px", minHeight: "auto" }}>
                        {t("削除", "Remove")}
                      </button>
                    </div>
                  </div>
                ) : link.url ? (
                  <a className="link-card-url" href={link.url} target="_blank" rel="noreferrer">
                    {link.url.replace(/^https?:\/\//, "").slice(0, 50)}
                  </a>
                ) : (
                  <p className="muted small" style={{ margin: 0 }}>{t("（URL未設定）", "(no URL)")}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* アクション */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "12px", display: "grid", gap: "8px" }}>
          <button type="button" className="button secondary"
            style={{ color: "var(--pink)", borderColor: "#e8b4c0" }}
            onClick={() => void handleDeletePattern()} disabled={busy === "delete"}>
            {t("このパターンを削除", "Delete this pattern")}
          </button>
          <button type="button" className="button secondary" onClick={() => void logout()}>
            {t("ログアウト", "Sign out")}
          </button>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="editor-root">
      {error && <p className="error-text" style={{ margin: "6px 14px 0" }}>{error}</p>}

      {/* パターン選択バー */}
      <div className="editor-pattern-bar">
        {busy === "load" ? (
          <span className="muted small">{t("読み込み中...", "Loading...")}</span>
        ) : (
          <>
            {profiles.map((p) => (
              <button key={p.id} type="button"
                className={`profile-tab${p.id === activeId ? " active" : ""}`}
                style={{ minWidth: "90px" }}
                onClick={() => selectProfile(p.id)}>
                <strong>{p.patternName}</strong>
                <span>{p.audience || "—"}</span>
              </button>
            ))}
            <button type="button" className="icon-button"
              onClick={() => void handleCreate()} disabled={busy === "create"}
              title={t("パターンを追加", "Add pattern")}>
              +
            </button>
            <span className="muted small" style={{ marginLeft: "auto", whiteSpace: "nowrap", fontSize: "11px" }}>
              {busy === "save"
                ? t("保存中…", "Saving…")
                : savedRecently ? "✓ " + t("保存済み", "Saved") : ""}
            </span>
          </>
        )}
      </div>

      {/* メインワークスペース */}
      <div className="editor-workspace">

        {/* プロフィールカード（WYSIWYG） */}
        <div className="editor-card-area">
          {draft ? (
            <div className="editor-card-wrap">
              <div
                className={`profile-paper theme-${draft.themeId || "default"}`}
                ref={paperRef}
                onClick={onPaperClick}
                onPointerMove={onPaperPointerMove}
                onPointerUp={onPaperPointerUp}
                style={{ cursor: "default", userSelect: "none" }}
              >
                <div className="paper-lines" />

                {/* シール */}
                {stickers.map((s, idx) => {
                  const sz = Math.round(80 * (s.scale ?? 1));
                  const isSel = selectedStickerIdx === idx;
                  return (
                    <div
                      key={s.id} data-sticker-el="1"
                      className={`placed-sticker${isSel ? " selected" : ""}`}
                      style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${sz}px`, cursor: "grab", touchAction: "none" }}
                      onPointerDown={(e) => onStickerPointerDown(e, idx)}
                    >
                      {isSel && (
                        <div className="placed-sticker-controls" data-sticker-control="true">
                          <button type="button" className="sticker-ctl"
                            onClick={(e) => { e.stopPropagation(); handleResizeSticker(idx, -0.2); }}>−</button>
                          <button type="button" className="sticker-ctl"
                            onClick={(e) => { e.stopPropagation(); handleResizeSticker(idx, 0.2); }}>＋</button>
                          <button type="button" className="sticker-ctl danger"
                            onClick={(e) => { e.stopPropagation(); handleDeleteSticker(idx); }}>×</button>
                        </div>
                      )}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={`/stamp/${s.stickerId}`} alt=""
                        style={{ width: "100%", display: "block", pointerEvents: "none" }} />
                    </div>
                  );
                })}

                {/* フレーム */}
                {draft.frameId && draft.frameId !== "none" && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={`/frame/${draft.frameId}`} alt=""
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
                      objectFit: "cover", pointerEvents: "none", zIndex: 1 }} />
                )}

                {/* プロフィール内容 */}
                <div className="profile-content">
                  <header className="profile-head">
                    <div className="avatar"><span>{initialOf(draft.patternName)}</span></div>
                    <div>
                      <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
                        {draft.patternName}{draft.audience ? ` / ${draft.audience}` : ""}
                      </p>
                      <h2 className="profile-name">{draft.description || draft.patternName}</h2>
                    </div>
                  </header>
                  {draft.fields.filter((f) => f.visible && f.value).map((f) => (
                    <div key={f.id} className="answer">
                      <span className="muted small">{f.label}</span>
                      <strong>{f.value}</strong>
                    </div>
                  ))}
                  {draft.links.filter((l) => l.visible && l.url).map((l) => (
                    <div key={l.id} className="answer">
                      <span className="muted small">{l.label || l.type}</span>
                      <a href={l.url} target="_blank" rel="noreferrer"
                        style={{ color: "var(--blue)", fontSize: "13px" }}>
                        {l.url.replace(/^https?:\/\//, "").slice(0, 40)}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* カード下のアクションリンク */}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px", justifyContent: "flex-end" }}>
                <a className="button secondary" href={`/preview/${draft.id}`}
                  style={{ fontSize: "12px", padding: "4px 12px", minHeight: "auto" }}>
                  {t("プレビュー", "Preview")}
                </a>
                {draft.isPublic && draft.publicSlug && (
                  <a className="button secondary" href={`/profile/${draft.publicSlug}`} target="_blank" rel="noreferrer"
                    style={{ fontSize: "12px", padding: "4px 12px", minHeight: "auto" }}>
                    {t("公開ページ", "Public page")}
                  </a>
                )}
              </div>
            </div>
          ) : busy !== "load" ? (
            <div className="empty-state" style={{ textAlign: "center", width: "100%", maxWidth: "480px" }}>
              <p className="muted">{t("＋でパターンを追加してください", "Click + to add a pattern")}</p>
            </div>
          ) : null}
        </div>

        {/* ツールパネル */}
        {draft && (
          <div className="editor-panel-area">
            {/* デスクトップ用タブ（モバイルは非表示） */}
            <div className="editor-panel-tabs">
              {TABS.map((tab) => (
                <button key={tab.id} type="button"
                  className={`editor-panel-tab${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <span>{tab.icon}</span>
                  <span>{t(tab.labelJa, tab.labelEn)}</span>
                </button>
              ))}
            </div>
            <div className="editor-panel-content">
              {activeTab === "stickers" && renderStickerPanel()}
              {activeTab === "frame"    && renderFramePanel()}
              {activeTab === "friends"  && renderFriendsPanel()}
              {activeTab === "settings" && renderSettingsPanel()}
            </div>
          </div>
        )}
      </div>

      {/* モバイル固定フッタタブ */}
      <nav className="editor-tabs-bar">
        {TABS.map((tab) => (
          <button key={tab.id} type="button"
            className={`editor-tab-btn${activeTab === tab.id ? " active" : ""}`}
            onClick={() => setActiveTab(tab.id)}>
            <span className="editor-tab-icon">{tab.icon}</span>
            <span>{t(tab.labelJa, tab.labelEn)}</span>
          </button>
        ))}
      </nav>
      <div className="editor-bottom-pad" />
    </div>
  );
}
