"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { profilesApi } from "@/api/profiles";
import AuthScreen from "@/features/auth/AuthScreen";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { Profile, StickerItem } from "@/types";

// ── /stamp/ の実画像カタログ ────────────────────────────────────────────────

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

function fileToLabel(file: string) {
  return file
    .replace(/\.[^.]+$/, "")
    .replace(/[_-]+/g, " ")
    .replace(/ color$/, "")
    .trim();
}

// ── ヘルパー ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function resolveStickerSrc(stickerId: string) {
  return stickerId.startsWith("data:") ? stickerId : `/stamp/${stickerId}`;
}

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
  const dragState = useRef<{ idx: number } | null>(null);

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

  // シール保存
  async function saveStickers(profileId: string, stickers: StickerItem[]) {
    setBusy("save");
    setError(null);
    const res = await profilesApi.update(profileId, { stickers });
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => prev.map((p) => p.id === profileId ? { ...p, stickers } : p));
  }

  // カタログからシールを追加（中央）
  function handleAdd(file: string) {
    if (!activeProfile) return;
    const item: StickerItem = {
      id: crypto.randomUUID(),
      stickerId: file,
      x: 50,
      y: 50,
      scale: 1,
    };
    const next = [...activeProfile.stickers, item];
    setSelectedIdx(next.length - 1);
    void saveStickers(activeProfile.id, next);
  }

  // 削除
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
      i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.3, 3) } : s
    );
    void saveStickers(activeProfile.id, next);
  }

  // ── ドラッグ（Pointer Events） ────────────────────────────────────────────

  function onPointerDown(e: React.PointerEvent, idx: number) {
    // コントロールボタン（拡大縮小・削除）内のクリックはドラッグ開始しない
    if ((e.target as HTMLElement).closest("[data-sticker-control]")) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedIdx(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { idx };
  }

  function onPointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !activeProfile || !paperRef.current) return;
    e.preventDefault();
    const rect = paperRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 92);
    setProfiles((prev) => prev.map((p) =>
      p.id === activeId
        ? { ...p, stickers: p.stickers.map((s, i) => i === ds.idx ? { ...s, x, y } : s) }
        : p
    ));
  }

  async function onPointerUp() {
    if (!dragState.current || !activeProfile) { dragState.current = null; return; }
    dragState.current = null;
    const stickers = profiles.find((p) => p.id === activeId)?.stickers;
    if (stickers) await saveStickers(activeProfile.id, stickers);
  }

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
          {/* 左: スタンプカタログ */}
          <section className="panel pad stack">
            <h2 style={{ margin: 0 }}>{t("シールを選ぶ", "Pick a sticker")}</h2>
            <p className="muted small">{t("クリックして台紙に追加します", "Click to add to your card")}</p>
            <div className="sticker-grid">
              {STAMP_FILES.map((file) => (
                <button
                  key={file}
                  type="button"
                  className="sticker-choice"
                  onClick={() => handleAdd(file)}
                  title={fileToLabel(file)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/stamp/${file}`}
                    alt={fileToLabel(file)}
                    style={{ width: "72px", height: "72px", objectFit: "contain" }}
                  />
                  <span className="muted small">{fileToLabel(file)}</span>
                </button>
              ))}
            </div>
            {busy === "save" && <p className="muted small">{t("保存中...", "Saving...")}</p>}
          </section>

          {/* 右: 台紙 */}
          <section className="stack">
            <div className="section-title">
              <div>
                <h2 style={{ margin: 0 }}>{t("シールの配置", "Sticker placement")}</h2>
                <span className="muted small">{activeProfile.patternName}</span>
              </div>
              <span className="muted small">{t("ドラッグで移動", "Drag to move")}</span>
            </div>

            <div
              className={`profile-paper theme-${activeProfile.themeId || "default"}${activeProfile.frameId && activeProfile.frameId !== "none" ? " has-image-frame" : ""}`}
              ref={paperRef}
              onClick={onPaperClick}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              style={{
                cursor: "default", userSelect: "none",
                ...(activeProfile.frameId && activeProfile.frameId !== "none"
                  ? { "--frame-url": `url('/frame/${activeProfile.frameId}')` } as React.CSSProperties
                  : {}),
              }}
            >
              <div className="paper-lines" />

              {stickers.map((s, idx) => {
                const sz = Math.round(80 * (s.scale ?? 1));
                const isSelected = selectedIdx === idx;
                return (
                  <div
                    key={s.id}
                    data-sticker-el="1"
                    className={`placed-sticker${isSelected ? " selected" : ""}`}
                    style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${sz}px`, cursor: "grab", touchAction: "none" }}
                    onPointerDown={(e) => onPointerDown(e, idx)}
                  >
                    {isSelected && (
                      <div className="placed-sticker-controls" data-sticker-control="true">
                        <button type="button" className="sticker-ctl"
                          onClick={(e) => { e.stopPropagation(); handleResize(idx, -0.2); }}>−</button>
                        <button type="button" className="sticker-ctl"
                          onClick={(e) => { e.stopPropagation(); handleResize(idx, 0.2); }}>＋</button>
                        <button type="button" className="sticker-ctl danger"
                          onClick={(e) => { e.stopPropagation(); handleDelete(idx); }}>×</button>
                      </div>
                    )}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolveStickerSrc(s.stickerId)}
                      alt=""
                      style={{ width: "100%", display: "block", pointerEvents: "none" }}
                    />
                  </div>
                );
              })}


              {/* プロフィール内容 */}
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
