"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Profile, StickerItem } from "@/types";

// ── スタンプカタログ ───────────────────────────────────────────────────────────

interface StickerDef {
  id: string;
  label: string;
  color: string;
  emoji?: string;
  variant: "smile" | "heart" | "friends" | "emoji";
}

const CATALOG: StickerDef[] = [
  { id: "smile",       label: "SMILE",      color: "#ffd452", variant: "smile" },
  { id: "heart",       label: "HEART",      color: "#ffd1e3", variant: "heart" },
  { id: "friends",     label: "仲良し!",    color: "#ffe8b0", variant: "friends" },
  { id: "cat",         label: "CAT",        color: "#ffe2ef", emoji: "🐱", variant: "emoji" },
  { id: "dog",         label: "DOG",        color: "#fce9cf", emoji: "🐶", variant: "emoji" },
  { id: "star",        label: "STAR",       color: "#fff0b3", emoji: "⭐", variant: "emoji" },
  { id: "sparkle",     label: "SPARKLE",    color: "#ffe7f6", emoji: "✨", variant: "emoji" },
  { id: "ribbon",      label: "RIBBON",     color: "#ffdff0", emoji: "🎀", variant: "emoji" },
  { id: "cake",        label: "CAKE",       color: "#ffe6c5", emoji: "🍰", variant: "emoji" },
  { id: "moon",        label: "MOON",       color: "#e0e7ff", emoji: "🌙", variant: "emoji" },
  { id: "rainbow",     label: "RAINBOW",    color: "#ffe5fb", emoji: "🌈", variant: "emoji" },
  { id: "sunflower",   label: "FLOWER",     color: "#f1ffd8", emoji: "🌻", variant: "emoji" },
  { id: "fish",        label: "FISH",       color: "#e3f5ff", emoji: "🐟", variant: "emoji" },
  { id: "candy",       label: "CANDY",      color: "#e7f0ff", emoji: "🍬", variant: "emoji" },
  { id: "apple",       label: "APPLE",      color: "#ffe6ea", emoji: "🍎", variant: "emoji" },
  { id: "crown",       label: "CROWN",      color: "#fff0c7", emoji: "👑", variant: "emoji" },
];

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function makeSvg(def: StickerDef): string {
  const ink = "#22201f";
  let body = "";
  if (def.variant === "smile") {
    body = `<circle cx="80" cy="50" r="34" fill="${def.color}" stroke="#a67a00" stroke-width="4"/>
      <circle cx="52" cy="47" r="7" fill="${ink}"/><circle cx="108" cy="47" r="7" fill="${ink}"/>
      <path d="M46 66c6 8 14 12 24 12s18-4 24-12" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      <text x="80" y="32" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="13" fill="${ink}">${esc(def.label)}</text>`;
  } else if (def.variant === "heart") {
    body = `<path d="M25 50c0-20 16-34 35-34 8 0 14 2 20 8 6-6 12-8 20-8 19 0 35 14 35 34 0 18-10 30-25 40-16 11-30 20-30 20s-14-9-30-20C35 80 25 68 25 50z" fill="${def.color}" stroke="#c5538d" stroke-width="4"/>
      <text x="80" y="82" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="13" fill="#8e265f">${esc(def.label)}</text>`;
  } else if (def.variant === "friends") {
    body = `<ellipse cx="80" cy="52" rx="56" ry="34" fill="${def.color}" stroke="#c09a3d" stroke-width="4"/>
      <circle cx="54" cy="52" r="17" fill="#fff3d4" stroke="#8b6a1f" stroke-width="3"/>
      <circle cx="106" cy="52" r="17" fill="#fff3d4" stroke="#8b6a1f" stroke-width="3"/>
      <text x="80" y="32" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="13" fill="${ink}">${esc(def.label)}</text>`;
  } else {
    body = `<path d="M32 31c10-10 22-13 48-13s38 3 48 13c10 10 12 22 12 22s-2 12-12 22c-10 10-22 13-48 13s-38-3-48-13c-10-10-12-22-12-22s2-12 12-22z" fill="${def.color}" stroke="#22201f" stroke-opacity=".18" stroke-width="3"/>
      <text x="80" y="59" text-anchor="middle" font-family="Apple Color Emoji,Segoe UI Emoji,sans-serif" font-size="30">${esc(def.emoji ?? "✨")}</text>
      <text x="80" y="83" text-anchor="middle" font-family="Arial Black,sans-serif" font-size="10" fill="${ink}">${esc(def.label)}</text>`;
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="104" viewBox="0 0 160 104">${body}</svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const CATALOG_SRCS = Object.fromEntries(CATALOG.map((d) => [d.id, makeSvg(d)]));

// ── ヘルパー ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

// ── コンポーネント ────────────────────────────────────────────────────────────

export default function StickersScreen() {
  const { session } = useSession();
  const { t } = useLang();

  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState<"load" | "save" | null>("load");
  const [error, setError] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  const paperRef = useRef<HTMLDivElement>(null);
  // ドラッグ中の状態
  const dragState = useRef<{ idx: number; ox: number; oy: number } | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeId) ?? null;

  // プロフィール読み込み
  const load = useCallback(async () => {
    setBusy("load");
    setError(null);
    const res = await profilesApi.list();
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles(res.data);
    setActiveId((cur) => cur ?? res.data[0]?.id ?? null);
  }, []);

  useEffect(() => {
    if (session.status === "user") void load();
  }, [load, session.status]);

  // シールを更新して保存
  async function saveStickers(profileId: string, stickers: StickerItem[]) {
    setBusy("save");
    setError(null);
    const res = await profilesApi.update(profileId, { stickers });
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => prev.map((p) => p.id === profileId ? { ...p, stickers } : p));
  }

  // カタログからシールを追加（中央に配置）
  function handleAddSticker(defId: string) {
    if (!activeProfile) return;
    const newItem: StickerItem = {
      id: crypto.randomUUID(),
      stickerId: defId,
      x: 50,
      y: 50,
      scale: 1,
    };
    const next = [...activeProfile.stickers, newItem];
    setSelectedIdx(next.length - 1);
    void saveStickers(activeProfile.id, next);
  }

  // シール削除
  function handleDelete(idx: number) {
    if (!activeProfile) return;
    const next = activeProfile.stickers.filter((_, i) => i !== idx);
    setSelectedIdx(null);
    void saveStickers(activeProfile.id, next);
  }

  // サイズ変更
  function handleResize(idx: number, delta: number) {
    if (!activeProfile) return;
    const next = activeProfile.stickers.map((s, i) =>
      i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.4, 2.5) } : s
    );
    void saveStickers(activeProfile.id, next);
  }

  // ── ドラッグ ──────────────────────────────────────────────────────────────

  function onPointerDown(e: React.PointerEvent, idx: number) {
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx(idx);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    const paper = paperRef.current;
    if (!paper) return;
    const rect = paper.getBoundingClientRect();
    const s = activeProfile!.stickers[idx];
    const sizeW = 100 * (s.scale ?? 1);
    const sizeH = 65 * (s.scale ?? 1);
    dragState.current = {
      idx,
      ox: e.clientX - rect.left - (s.x / 100) * rect.width + sizeW / 2,
      oy: e.clientY - rect.top  - (s.y / 100) * rect.height + sizeH / 2,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !activeProfile || !paperRef.current) return;
    e.preventDefault();
    const rect = paperRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 95);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 95);
    setProfiles((prev) => prev.map((p) =>
      p.id === activeId
        ? { ...p, stickers: p.stickers.map((s, i) => i === ds.idx ? { ...s, x, y } : s) }
        : p
    ));
  }

  async function onPointerUp(e: React.PointerEvent) {
    const ds = dragState.current;
    dragState.current = null;
    if (!ds || !activeProfile) return;
    const stickers = profiles.find((p) => p.id === activeId)?.stickers;
    if (stickers) await saveStickers(activeProfile.id, stickers);
  }

  // ── 背景クリックで選択解除 ────────────────────────────────────────────────

  function onPaperClick(e: React.MouseEvent) {
    if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
    setSelectedIdx(null);
  }

  // ── ガード ────────────────────────────────────────────────────────────────

  if (session.status === "loading") {
    return <main className="app-shell"><p className="muted">{t("読み込み中...", "Loading...")}</p></main>;
  }
  if (session.status === "guest") {
    return <AuthScreen redirectOnAuth="/stickers" />;
  }

  const stickers = activeProfile?.stickers ?? [];

  return (
    <main className="app-shell">
      {/* タイトル */}
      <section className="section-title">
        <div>
          <h1>{t("シール", "Stickers")}</h1>
          <p className="muted">{t("プロフィールにシールを貼ろう", "Decorate your profile card")}</p>
        </div>
        <Link className="button secondary" href="/mine">{t("マイページへ", "Back to mine")}</Link>
      </section>

      {/* パターン選択 */}
      {profiles.length > 0 && (
        <section className="panel pad pattern-toolbar">
          <span className="muted small">{t("パターン", "Pattern")}</span>
          {profiles.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`profile-tab${p.id === activeId ? " active" : ""}`}
              onClick={() => { setActiveId(p.id); setSelectedIdx(null); }}
            >
              <strong>{p.patternName}</strong>
              <span className="muted small">{p.audience}</span>
            </button>
          ))}
        </section>
      )}

      {error && <p className="error-text">{error}</p>}
      {busy === "load" && <p className="muted">{t("読み込み中...", "Loading...")}</p>}

      {activeProfile && (
        <div className="split">
          {/* 左: シールカタログ */}
          <section className="panel pad stack">
            <h2 style={{ margin: 0 }}>{t("シールを選ぶ", "Pick a sticker")}</h2>
            <p className="muted small">{t("クリックして台紙に追加できます", "Click to add to your card")}</p>
            <div className="sticker-grid">
              {CATALOG.map((def) => (
                <button
                  key={def.id}
                  type="button"
                  className="sticker-choice"
                  onClick={() => handleAddSticker(def.id)}
                  title={def.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={CATALOG_SRCS[def.id]} alt={def.label} style={{ width: "80px", height: "52px" }} />
                  <span className="muted small">{def.label}</span>
                </button>
              ))}
            </div>
            {busy === "save" && <p className="muted small">{t("保存中...", "Saving...")}</p>}
          </section>

          {/* 右: プロフィール台紙 */}
          <section className="stack">
            <div className="section-title">
              <div>
                <h2 style={{ margin: 0 }}>{t("シールの配置", "Sticker placement")}</h2>
                <span className="muted small">{activeProfile.patternName}</span>
              </div>
              <span className="muted small">{t("ドラッグで移動", "Drag to move")}</span>
            </div>

            <div
              className={`profile-paper theme-${activeProfile.themeId || "default"}`}
              ref={paperRef}
              onClick={onPaperClick}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{ cursor: "default", userSelect: "none" }}
            >
              <div className="paper-lines" />

              {/* 配置済みシール */}
              {stickers.map((s, idx) => {
                const src = CATALOG_SRCS[s.stickerId];
                const sz = Math.round(100 * (s.scale ?? 1));
                const isSelected = selectedIdx === idx;
                return (
                  <div
                    key={s.id}
                    data-sticker-el="1"
                    className={`placed-sticker${isSelected ? " selected" : ""}`}
                    style={{
                      left: `${s.x}%`,
                      top: `${s.y}%`,
                      width: `${sz}px`,
                      cursor: "grab",
                      touchAction: "none",
                    }}
                    onPointerDown={(e) => onPointerDown(e, idx)}
                  >
                    {isSelected && (
                      <div className="placed-sticker-controls" data-sticker-control="true">
                        <button
                          type="button"
                          className="sticker-ctl"
                          onClick={(e) => { e.stopPropagation(); handleResize(idx, -0.2); }}
                          aria-label="縮小"
                        >−</button>
                        <button
                          type="button"
                          className="sticker-ctl"
                          onClick={(e) => { e.stopPropagation(); handleResize(idx, 0.2); }}
                          aria-label="拡大"
                        >＋</button>
                        <button
                          type="button"
                          className="sticker-ctl danger"
                          onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}
                          aria-label="削除"
                        >×</button>
                      </div>
                    )}
                    {src
                      ? <img src={src} alt="" style={{ width: "100%", display: "block", pointerEvents: "none" }} />
                      : <span style={{ fontSize: "2em" }}>{s.stickerId}</span>
                    }
                  </div>
                );
              })}

              {/* プロフィール内容（簡易表示） */}
              <div className="profile-content">
                <header className="profile-head">
                  <div className="avatar">
                    <span>{(activeProfile.patternName[0] ?? "M").toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="muted">{activeProfile.patternName} / {activeProfile.audience}</p>
                    <h2 className="profile-name">{activeProfile.description || activeProfile.patternName}</h2>
                  </div>
                </header>
                {activeProfile.fields.filter((f) => f.visible && f.value).slice(0, 4).map((f) => (
                  <div key={f.id} className="answer">
                    <span className="muted small">{f.label}</span>
                    <strong>{f.value}</strong>
                  </div>
                ))}
              </div>
            </div>

            {stickers.length > 0 && (
              <p className="muted small" style={{ textAlign: "center" }}>
                {t(`シール ${stickers.length} 枚`, `${stickers.length} sticker(s)`)}
                {" — "}
                <button
                  type="button"
                  className="ghost"
                  style={{ fontSize: "inherit", color: "var(--pink)" }}
                  onClick={() => { setSelectedIdx(null); void saveStickers(activeProfile.id, []); }}
                >
                  {t("全部はがす", "Remove all")}
                </button>
              </p>
            )}
          </section>
        </div>
      )}
    </main>
  );
}
