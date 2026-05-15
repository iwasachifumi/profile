"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { profilesApi } from "@/api/profiles";
import { settingsApi } from "@/api/settings";
import { useSession } from "@/store/session";
import type { CardConfig, CardInfoItem, CustomSticker, Profile, StickerItem } from "@/types";

// ── カードテンプレート ────────────────────────────────────────────────────────

const CARD_TEMPLATES = [
  { file: "Sky-5.png",                       label: "青空" },
  { file: "Sky-7.png",                       label: "夕暮れ" },
  { file: "Sky-8.png",                       label: "夜空" },
  { file: "Sky-9.png",                       label: "星空" },
  { file: "Sky-10.png",                      label: "朝空" },
  { file: "Sky-20.png",                      label: "昼空" },
  { file: "Sky-31.png",                      label: "雲" },
  { file: "Sky-41.png",                      label: "霞" },
  { file: "Sky-67.png",                      label: "夕空2" },
  { file: "Sky-68.png",                      label: "夜明け" },
  { file: "Floral-pattern-gerbera-8.png",    label: "フラワー" },
  { file: "Floral-pattern-gerbera-11.png",   label: "フラワー2" },
  { file: "Floral-pattern-sunflower-11.png", label: "ひまわり" },
  { file: "Rose-pattern-5.png",              label: "ローズ" },
  { file: "Simple-pedicel-pattern-60.png",   label: "ボタニカル" },
  { file: "Scenery-white-clover-5.png",      label: "クローバー" },
  { file: "Scenery-white-clover-6.png",      label: "クローバー2" },
  { file: "Scenery-white-clover-8.png",      label: "クローバー3" },
  { file: "PC-wallpaper-others-1.png",       label: "ウォール1" },
  { file: "PC-wallpaper-others-2.png",       label: "ウォール2" },
  { file: "PC-wallpaper-others-3.png",       label: "ウォール3" },
  { file: "PC-wallpaper-others-4.png",       label: "ウォール4" },
  { file: "PC-wallpaper-others-6.png",       label: "ウォール6" },
  { file: "Virtual-background-room-3.png",   label: "ルーム1" },
  { file: "Virtual-background-room-6.png",   label: "ルーム2" },
  { file: "Virtual-background-room-8.png",   label: "ルーム3" },
  { file: "Virtual-background-room-14.png",  label: "ルーム4" },
];

const STAMP_FILES = [
  "mikeneko.png","kuroneko.png","cat_black.png","hamster.png",
  "kyohishiba.png","nezumi_2.png","frog_sit.png","tori.png",
  "hetauma_tora2.png","hetauma_usa8.png","kanasi_l.png","couple2_l.png",
  "dancing_l.png","yakimoti_oyako.png",
  "apple.png","candy.png","candy2.png","candy_2.png",
  "hetauma_candy.png","shortcake.png","ichigo.png","ginger-cookie.png",
  "heart_2.png","good.png","star.png","sun.png",
  "garland.png","garland_ribbon.png","garland_star_right.png",
  "sirotumeline.png","azisai_ame_line_r.png","hiyoko_line3.png",
  "ribon_thin.png","yuki_line2.png","hasami_kiritori_hai.png",
  "Orange_line01.png","usa_koi3.png",
  "1037_color.png","1123_color.png","9663_color.png",
  "11656_color.png","16366_color.png","16441_color.png",
  "16970_color.png","17322_color.png","23868_color.png",
  "24815_color.png","24820_color.png","24850_color.png",
  "24941_color.png","25085.png","25676_color.png",
  "25698_color.png","26490_color.png","26568_color.png","26568.png",
];

const STICKERS_PER_PAGE = 16;

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function getField(profile: Profile, label: string) {
  return profile.fields.find((f) => f.label === label)?.value ?? "";
}
function buildInitialItems(profile: Profile): CardInfoItem[] {
  return [
    { id: crypto.randomUUID(), label: "名前",         value: getField(profile, "名前") || profile.patternName },
    { id: crypto.randomUUID(), label: "ニックネーム", value: getField(profile, "ニックネーム") },
    { id: crypto.randomUUID(), label: "ひとこと",     value: profile.description },
    { id: crypto.randomUUID(), label: "ハンドル",     value: profile.handle ? `@${profile.handle}` : "" },
  ];
}

// ── Component ────────────────────────────────────────────────────────────────

export default function QrCardScreen({ profileId }: { profileId: string }) {
  const router  = useRouter();
  const { session } = useSession();

  // ── Data ──────────────────────────────────────────────────────────────────

  const [profile,        setProfile]        = useState<Profile | null>(null);
  const [loading,        setLoading]        = useState(true);
  const [loadError,      setLoadError]      = useState<string | null>(null);
  const [customStickers, setCustomStickers] = useState<CustomSticker[]>([]);

  // ── Card builder state ────────────────────────────────────────────────────

  const [templateFile,       setTemplateFile]       = useState(CARD_TEMPLATES[0].file);
  const [items,              setItems]              = useState<CardInfoItem[]>([]);
  const [cardStickers,       setCardStickers]       = useState<StickerItem[]>([]);
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);

  // ── UI state ──────────────────────────────────────────────────────────────

  const [infoOpen,          setInfoOpen]          = useState(false);
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);
  const [stickerPickerPage, setStickerPickerPage] = useState(0);
  const [saving,            setSaving]            = useState(false);
  const [savedRecently,     setSavedRecently]     = useState(false);
  const [exporting,         setExporting]         = useState(false);
  const [exportError,       setExportError]       = useState<string | null>(null);

  const previewWrapRef = useRef<HTMLDivElement>(null);

  // ── Refs ──────────────────────────────────────────────────────────────────

  const cardRef       = useRef<HTMLDivElement>(null);
  const dragState     = useRef<{ idx: number } | null>(null);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    const [profilesRes, settingsRes] = await Promise.all([
      profilesApi.list(),
      settingsApi.get(),
    ]);

    if (!profilesRes.ok) { setLoadError(profilesRes.error); setLoading(false); return; }
    const found = profilesRes.data.find((p) => p.id === profileId) ?? null;
    if (!found) { setLoadError("プロフィールが見つかりません"); setLoading(false); return; }

    setProfile(found);

    // cardConfig が保存済みならそれを使う、なければプロフィールから初期値
    if (found.cardConfig) {
      setTemplateFile(found.cardConfig.templateFile);
      setItems(found.cardConfig.items);
      setCardStickers(found.cardConfig.cardStickers);
    } else {
      setItems(buildInitialItems(found));
    }

    if (settingsRes.ok) {
      const raw = settingsRes.data.customStickers;
      setCustomStickers(Array.isArray(raw) ? raw.filter((s): s is CustomSticker =>
        typeof s?.assetSrc === "string" && s.assetSrc.length > 0
      ) : []);
    }

    setLoading(false);
  }, [profileId]);

  useEffect(() => {
    if (session.status === "user") void load();
  }, [load, session.status]);

  // ── Auto-save card config ─────────────────────────────────────────────────

  function scheduleCardConfigSave(config: CardConfig) {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(() => void saveCardConfig(config), 700);
  }

  async function saveCardConfig(config: CardConfig) {
    if (!profile) return;
    setSaving(true);
    await profilesApi.update(profile.id, { cardConfig: config });
    setSaving(false);
    setSavedRecently(true);
    setTimeout(() => setSavedRecently(false), 2000);
  }

  function applyTemplate(file: string) {
    setTemplateFile(file);
    scheduleCardConfigSave({ templateFile: file, items, cardStickers });
  }

  function applyItems(next: CardInfoItem[]) {
    setItems(next);
    scheduleCardConfigSave({ templateFile, items: next, cardStickers });
  }

  function applyCardStickers(next: StickerItem[]) {
    setCardStickers(next);
    scheduleCardConfigSave({ templateFile, items, cardStickers: next });
  }

  // ── Sticker drag ──────────────────────────────────────────────────────────

  function onStickerPointerDown(e: React.PointerEvent, idx: number) {
    if ((e.target as HTMLElement).closest("[data-sticker-control]")) return;
    e.preventDefault();
    e.stopPropagation();
    setSelectedStickerIdx(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragState.current = { idx };
  }

  function onCardPointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !cardRef.current) return;
    e.preventDefault();
    const rect = cardRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 92);
    setCardStickers((prev) => prev.map((s, i) => i === ds.idx ? { ...s, x, y } : s));
  }

  function onCardPointerUp() {
    if (!dragState.current) return;
    dragState.current = null;
    // ポインターアップ後に一括保存
    scheduleCardConfigSave({ templateFile, items, cardStickers });
  }

  function handleAddSticker(stickerId: string) {
    const next: StickerItem[] = [
      ...cardStickers,
      { id: crypto.randomUUID(), stickerId, x: 50, y: 50, scale: 1 },
    ];
    setCardStickers(next);
    setSelectedStickerIdx(next.length - 1);
    scheduleCardConfigSave({ templateFile, items, cardStickers: next });
  }

  function handleDeleteSticker(idx: number) {
    const next = cardStickers.filter((_, i) => i !== idx);
    setSelectedStickerIdx(null);
    applyCardStickers(next);
  }

  function handleResizeSticker(idx: number, delta: number) {
    const next = cardStickers.map((s, i) =>
      i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.3, 3) } : s
    );
    applyCardStickers(next);
  }

  // ── Export ────────────────────────────────────────────────────────────────

  async function generatePng(): Promise<string> {
    if (!cardRef.current) throw new Error("card not mounted");
    setSelectedStickerIdx(null);
    await new Promise((r) => setTimeout(r, 80));
    return toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
  }

  async function handleSave() {
    setExporting(true);
    setExportError(null);
    try {
      const dataUrl = await generatePng();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `memoria-card-${profile?.patternName ?? "card"}.png`;
      a.click();
    } catch (err) {
      setExportError("画像の生成に失敗しました。");
      console.error(err);
    } finally {
      setExporting(false);
    }
  }

  async function handleShare() {
    setExporting(true);
    setExportError(null);
    try {
      const dataUrl = await generatePng();
      const res   = await fetch(dataUrl);
      const blob  = await res.blob();
      const file  = new File([blob], `memoria-card-${profile?.patternName ?? "card"}.png`, { type: "image/png" });
      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: profile?.patternName, text: `${items[0]?.value ?? ""}のプロフィール`, files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `memoria-card-${profile?.patternName ?? "card"}.png`;
        a.click();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("AbortError") && !msg.includes("cancel")) {
        setExportError("シェアに失敗しました。");
      }
    } finally {
      setExporting(false);
    }
  }

  // ── Sticker picker data ───────────────────────────────────────────────────

  const stickerChoices = [
    ...customStickers.map((s) => ({ id: s.assetSrc, src: s.assetSrc, label: s.label })),
    ...STAMP_FILES.map((f) => ({ id: f, src: `/stamp/${f}`, label: f.replace(/\.[^.]+$/, "") })),
  ];
  const totalStickerPages = Math.ceil(stickerChoices.length / STICKERS_PER_PAGE);
  const stickerPage       = Math.min(stickerPickerPage, totalStickerPages - 1);
  const pageStickers      = stickerChoices.slice(stickerPage * STICKERS_PER_PAGE, (stickerPage + 1) * STICKERS_PER_PAGE);

  // ── Card render ───────────────────────────────────────────────────────────

  const avatarInitial = ((items[0]?.value || profile?.patternName) ?? "?")[0].toUpperCase();
  const qrUrl = profile?.isPublic && profile.publicSlug
    ? `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${profile.publicSlug}?via=qr`
    : "https://profile.ac7.co.jp"; // 非公開の場合はダミーURL

  function renderCard(forExport = false) {
    return (
      <div
        ref={forExport ? undefined : cardRef}
        className="qr-card-paper"
        style={{ touchAction: "none" }}
        onPointerMove={onCardPointerMove}
        onPointerUp={onCardPointerUp}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
          setSelectedStickerIdx(null);
        }}
      >
        {/* 背景 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/card/${templateFile}`} alt="" className="qr-card-bg" crossOrigin="anonymous" />

        {/* 左エリア */}
        <div className="qr-card-left">
          <div className="qr-card-avatar">
            {profile?.avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarSrc} alt="" className="qr-card-avatar-img" crossOrigin="anonymous" />
            ) : (
              <span>{avatarInitial}</span>
            )}
          </div>
          <div className="qr-card-info">
            {items.map((item) => item.value ? (
              <p key={item.id} style={{
                margin: "1px 0", lineHeight: 1.3,
                color:    item.color    ?? "#222222",
                fontSize: item.fontSize ?? 16,
              }}>
                {item.value}
              </p>
            ) : null)}
          </div>
        </div>

        {/* 右エリア */}
        <div className="qr-card-right">
          <div className="qr-card-qr-wrap">
            <QRCodeSVG value={qrUrl} size={100} />
          </div>
          <p className="qr-card-tagline">Memoriaで見てね</p>
        </div>

        {/* シール */}
        {cardStickers.map((s, idx) => {
          const sz    = Math.round(52 * (s.scale ?? 1));
          const isSel = selectedStickerIdx === idx;
          const src   = s.stickerId.startsWith("data:") ? s.stickerId : `/stamp/${s.stickerId}`;
          return (
            <div
              key={s.id}
              data-sticker-el="1"
              className={`placed-sticker${isSel ? " selected" : ""}`}
              style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${sz}px`, cursor: "grab", touchAction: "none", zIndex: 10 }}
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
              <img src={src} alt="" crossOrigin="anonymous"
                style={{ width: "100%", display: "block", pointerEvents: "none" }} />
            </div>
          );
        })}
      </div>
    );
  }

  // ── Guards ────────────────────────────────────────────────────────────────

  if (session.status === "loading" || loading) {
    return (
      <main className="qr-card-page">
        <div className="qr-card-page-header">
          <button type="button" className="button secondary" style={{ minHeight: "auto", padding: "6px 14px" }}
            onClick={() => router.push("/mine")}>← マイページ</button>
          <strong>QRカードを作る</strong>
        </div>
        <p className="muted" style={{ padding: "40px", textAlign: "center" }}>読み込み中...</p>
      </main>
    );
  }

  if (loadError || !profile) {
    return (
      <main className="qr-card-page">
        <div className="qr-card-page-header">
          <button type="button" className="button secondary" style={{ minHeight: "auto", padding: "6px 14px" }}
            onClick={() => router.push("/mine")}>← マイページ</button>
          <strong>QRカードを作る</strong>
        </div>
        <p className="error-text" style={{ padding: "20px" }}>{loadError ?? "プロフィールが見つかりません"}</p>
      </main>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <main className="qr-card-page">

      {/* ページヘッダー */}
      <div className="qr-card-page-header">
        <button
          type="button"
          className="button secondary"
          style={{ minHeight: "auto", padding: "6px 14px", fontSize: "13px" }}
          onClick={() => router.push("/mine")}
        >
          ← マイページ
        </button>
        <div style={{ flex: 1, textAlign: "center" }}>
          <strong style={{ fontSize: "15px" }}>QRカードを作る</strong>
          {profile.patternName && (
            <span className="muted small" style={{ display: "block", fontSize: "11px" }}>
              {profile.patternName}
            </span>
          )}
        </div>
        <span className="muted small" style={{ fontSize: "11px", minWidth: "60px", textAlign: "right" }}>
          {saving ? "保存中…" : savedRecently ? "✓ 保存済" : ""}
        </span>
      </div>

      {/* 非公開警告 */}
      {!profile.isPublic && (
        <div className="qr-card-warn">
          ⚠️ このプロフィールは非公開です。QRコードを有効にするには
          <button
            type="button"
            className="button secondary"
            style={{ fontSize: "12px", minHeight: "auto", padding: "2px 8px", marginLeft: "6px" }}
            onClick={() => router.push("/mine")}
          >
            公開設定 →
          </button>
        </div>
      )}

      {/* テンプレートストリップ */}
      <div className="qr-card-template-strip">
        {CARD_TEMPLATES.map((tpl) => (
          <button
            key={tpl.file}
            type="button"
            className={`qr-card-strip-btn${templateFile === tpl.file ? " active" : ""}`}
            onClick={() => applyTemplate(tpl.file)}
            title={tpl.label}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/card/${tpl.file}`} alt={tpl.label} className="qr-card-strip-thumb" />
            <span className="qr-card-strip-label">{tpl.label}</span>
          </button>
        ))}
      </div>

      {/* カードプレビュー */}
      <div className="qr-card-page-preview" ref={previewWrapRef}>
        {renderCard()}
      </div>

      {/* コントロール */}
      <div className="qr-card-page-controls">

        {exportError && <p className="error-text" style={{ margin: 0 }}>{exportError}</p>}

        {/* テキスト編集アコーディオン */}
        <div className="qr-card-info-accordion">
          <div className="qr-card-info-toggle" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", padding: 0, flex: 1, textAlign: "left", display: "flex", justifyContent: "space-between" }}
              onClick={() => setInfoOpen(!infoOpen)}>
              <span>✏️ テキスト内容を編集</span>
              <span>{infoOpen ? "▲" : "▼"}</span>
            </button>
            <button type="button" style={{ background: "none", border: "none", cursor: "pointer", fontSize: "18px", padding: "0 4px", lineHeight: 1 }}
              onClick={() => applyItems([...items, { id: crypto.randomUUID(), label: "", value: "" }])}
              title="項目を追加">＋</button>
          </div>
          {infoOpen && (
            <div className="qr-card-info-fields">
              {items.map((item) => (
                <div key={item.id} style={{ display: "grid", gap: "4px", borderBottom: "1px solid var(--line)", paddingBottom: "8px" }}>
                  {/* ラベル + 内容 + 削除 */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "4px", alignItems: "center" }}>
                    <input
                      style={{ fontSize: "12px" }}
                      placeholder="ラベル"
                      value={item.label}
                      onChange={(e) => applyItems(items.map((it) => it.id === item.id ? { ...it, label: e.target.value } : it))}
                    />
                    <input
                      style={{ fontSize: "12px" }}
                      placeholder="内容"
                      value={item.value}
                      onChange={(e) => applyItems(items.map((it) => it.id === item.id ? { ...it, value: e.target.value } : it))}
                    />
                    <button type="button"
                      style={{ background: "none", border: "none", cursor: "pointer", color: "var(--pink)", fontSize: "16px", padding: "0 4px" }}
                      onClick={() => applyItems(items.filter((it) => it.id !== item.id))}>×</button>
                  </div>
                  {/* 文字色 + 文字サイズ */}
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--muted)" }}>
                      文字色
                      <input
                        type="color"
                        value={item.color ?? "#222222"}
                        style={{ width: "30px", height: "24px", padding: "1px", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer" }}
                        onChange={(e) => applyItems(items.map((it) => it.id === item.id ? { ...it, color: e.target.value } : it))}
                      />
                    </label>
                    <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--muted)" }}>
                      サイズ
                      <select
                        value={item.fontSize ?? 16}
                        style={{ fontSize: "12px" }}
                        onChange={(e) => applyItems(items.map((it) => it.id === item.id ? { ...it, fontSize: Number(e.target.value) } : it))}
                      >
                        {[9, 10, 11, 12, 13, 14, 16, 18, 20].map((s) => (
                          <option key={s} value={s}>{s}px</option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* シール */}
        <button
          type="button"
          className="button secondary"
          style={{ width: "100%" }}
          onClick={() => { setStickerPickerPage(0); setStickerPickerOpen(true); }}
        >
          🏷 シールを貼る
        </button>
        {cardStickers.length > 0 && (
          <button
            type="button"
            className="button secondary"
            style={{ width: "100%", color: "var(--pink)", fontSize: "12px", minHeight: "auto", padding: "4px 10px" }}
            onClick={() => applyCardStickers([])}
          >
            シールを全部はがす
          </button>
        )}

        {/* 保存・シェア */}
        <div style={{ display: "flex", gap: "10px" }}>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleSave()} disabled={exporting}>
            {exporting ? "生成中…" : "💾 PNG保存"}
          </button>
          <button type="button" className="button" style={{ flex: 1 }}
            onClick={() => void handleShare()} disabled={exporting}>
            {exporting ? "生成中…" : "📤 シェア"}
          </button>
        </div>

        <p className="muted small" style={{ margin: 0, textAlign: "center", fontSize: "11px" }}>
          シールはドラッグで移動できます
        </p>
      </div>

      {/* シール選択モーダル */}
      {stickerPickerOpen && (
        <div
          className="sticker-picker-backdrop"
          onClick={() => setStickerPickerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="sticker-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sticker-picker-header">
              <strong>シールを選ぶ</strong>
              <button type="button" className="qr-modal-close" style={{ position: "static", margin: 0 }}
                onClick={() => setStickerPickerOpen(false)} aria-label="閉じる">×</button>
            </div>
            <div className="sticker-picker-grid">
              {pageStickers.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  className="sticker-choice"
                  onClick={() => handleAddSticker(sticker.id)}
                  title={sticker.label}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={sticker.src} alt={sticker.label}
                    style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                </button>
              ))}
            </div>
            {totalStickerPages > 1 && (
              <div className="sticker-picker-pagination">
                <button type="button" className="button secondary"
                  style={{ minHeight: "auto", padding: "4px 14px" }}
                  disabled={stickerPage === 0}
                  onClick={() => setStickerPickerPage(stickerPage - 1)}>← 前へ</button>
                <span className="muted small">{stickerPage + 1} / {totalStickerPages}</span>
                <button type="button" className="button secondary"
                  style={{ minHeight: "auto", padding: "4px 14px" }}
                  disabled={stickerPage >= totalStickerPages - 1}
                  onClick={() => setStickerPickerPage(stickerPage + 1)}>次へ →</button>
              </div>
            )}
            <p className="muted small" style={{ margin: 0, textAlign: "center", fontSize: "12px" }}>
              複数貼れます。終わったら × で閉じてください
            </p>
          </div>
        </div>
      )}
    </main>
  );
}
