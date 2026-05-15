"use client";

import { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import type { CustomSticker, Profile, StickerItem } from "@/types";

// ── カードテンプレート一覧（public/card 内） ────────────────────────────────

const CARD_TEMPLATES = [
  { file: "Sky-5.png",                         label: "青空" },
  { file: "Sky-7.png",                         label: "夕暮れ" },
  { file: "Sky-8.png",                         label: "夜空" },
  { file: "Sky-9.png",                         label: "星空" },
  { file: "Sky-10.png",                        label: "朝空" },
  { file: "Sky-20.png",                        label: "昼空" },
  { file: "Sky-31.png",                        label: "雲" },
  { file: "Sky-41.png",                        label: "霞" },
  { file: "Sky-67.png",                        label: "夕空2" },
  { file: "Sky-68.png",                        label: "夜明け" },
  { file: "Floral-pattern-gerbera-8.png",      label: "フラワー" },
  { file: "Floral-pattern-gerbera-11.png",     label: "フラワー2" },
  { file: "Floral-pattern-sunflower-11.png",   label: "ひまわり" },
  { file: "Rose-pattern-5.png",                label: "ローズ" },
  { file: "Simple-pedicel-pattern-60.png",     label: "ボタニカル" },
  { file: "Scenery-white-clover-5.png",        label: "クローバー" },
  { file: "Scenery-white-clover-6.png",        label: "クローバー2" },
  { file: "Scenery-white-clover-8.png",        label: "クローバー3" },
  { file: "PC-wallpaper-others-1.png",         label: "ウォール1" },
  { file: "PC-wallpaper-others-2.png",         label: "ウォール2" },
  { file: "PC-wallpaper-others-3.png",         label: "ウォール3" },
  { file: "PC-wallpaper-others-4.png",         label: "ウォール4" },
  { file: "PC-wallpaper-others-6.png",         label: "ウォール6" },
  { file: "Virtual-background-room-3.png",     label: "ルーム1" },
  { file: "Virtual-background-room-6.png",     label: "ルーム2" },
  { file: "Virtual-background-room-8.png",     label: "ルーム3" },
  { file: "Virtual-background-room-14.png",    label: "ルーム4" },
];

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

const STICKERS_PER_PAGE = 16;

// ── Helpers ──────────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}
function getFieldValue(profile: Profile, label: string) {
  return profile.fields.find((f) => f.label === label)?.value ?? "";
}

// ── Types ────────────────────────────────────────────────────────────────────

interface CardInfo {
  name:        string;
  nickname:    string;
  description: string;
  handle:      string;
}

interface Props {
  profile:       Profile;
  url:           string;
  customStickers: CustomSticker[];
  onClose:       () => void;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function QrCardBuilder({ profile, url, onClose, customStickers }: Props) {
  // step
  const [step, setStep] = useState<"template" | "edit">("template");

  // template
  const [templateFile, setTemplateFile] = useState(CARD_TEMPLATES[0].file);

  // editable card info（プロフィールから初期値を取る）
  const [cardInfo, setCardInfo] = useState<CardInfo>({
    name:        getFieldValue(profile, "名前") || profile.patternName,
    nickname:    getFieldValue(profile, "ニックネーム"),
    description: profile.description,
    handle:      profile.handle ? `@${profile.handle}` : "",
  });

  // stickers on card
  const [cardStickers,       setCardStickers]       = useState<StickerItem[]>([]);
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);

  // sticker picker modal
  const [stickerPickerOpen,  setStickerPickerOpen]  = useState(false);
  const [stickerPickerPage,  setStickerPickerPage]  = useState(0);

  // info edit panel
  const [infoOpen, setInfoOpen] = useState(false);

  // export
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const cardRef  = useRef<HTMLDivElement>(null);
  const dragState = useRef<{ idx: number } | null>(null);

  // ── Sticker drag ────────────────────────────────────────────────────────

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
    setCardStickers((prev) =>
      prev.map((s, i) => i === ds.idx ? { ...s, x, y } : s)
    );
  }

  function onCardPointerUp() {
    dragState.current = null;
  }

  function handleAddSticker(stickerId: string) {
    setCardStickers((prev) => [
      ...prev,
      { id: crypto.randomUUID(), stickerId, x: 50, y: 50, scale: 1 },
    ]);
    setSelectedStickerIdx(cardStickers.length); // select the newly added one
  }

  function handleDeleteSticker(idx: number) {
    setCardStickers((prev) => prev.filter((_, i) => i !== idx));
    setSelectedStickerIdx(null);
  }

  function handleResizeSticker(idx: number, delta: number) {
    setCardStickers((prev) =>
      prev.map((s, i) =>
        i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.3, 3) } : s
      )
    );
  }

  // ── Export ──────────────────────────────────────────────────────────────

  async function generatePng(): Promise<string> {
    if (!cardRef.current) throw new Error("card not mounted");
    setSelectedStickerIdx(null); // 選択リングを非表示にしてから撮影
    // DOM 更新を待つ
    await new Promise((r) => setTimeout(r, 80));
    return toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
  }

  async function handleSave() {
    setExporting(true);
    setExportError(null);
    try {
      const dataUrl = await generatePng();
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `memoria-card-${profile.patternName}.png`;
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
      const file  = new File([blob], `memoria-card-${profile.patternName}.png`, { type: "image/png" });

      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          title: profile.patternName,
          text:  `${cardInfo.name}のプロフィール`,
          files: [file],
        });
      } else {
        // Share API 非対応 → ダウンロードにフォールバック
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = `memoria-card-${profile.patternName}.png`;
        a.click();
      }
    } catch (err) {
      // ユーザーがキャンセルした場合は無視
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("AbortError") && !msg.includes("cancel")) {
        setExportError("シェアに失敗しました。");
      }
    } finally {
      setExporting(false);
    }
  }

  // ── Sticker picker ──────────────────────────────────────────────────────

  const stickerChoices = [
    ...customStickers.map((s) => ({ id: s.assetSrc, src: s.assetSrc, label: s.label })),
    ...STAMP_FILES.map((f) => ({ id: f, src: `/stamp/${f}`, label: f.replace(/\.[^.]+$/, "") })),
  ];
  const totalStickerPages = Math.ceil(stickerChoices.length / STICKERS_PER_PAGE);
  const stickerPage       = Math.min(stickerPickerPage, totalStickerPages - 1);
  const stickerPageItems  = stickerChoices.slice(stickerPage * STICKERS_PER_PAGE, (stickerPage + 1) * STICKERS_PER_PAGE);

  // ── Card JSX (shared between preview and export target) ─────────────────

  const avatarInitial = (cardInfo.name || profile.patternName || "?")[0].toUpperCase();

  function renderCard() {
    return (
      <div
        ref={cardRef}
        className="qr-card-paper"
        onPointerMove={onCardPointerMove}
        onPointerUp={onCardPointerUp}
        onClick={(e) => {
          if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
          setSelectedStickerIdx(null);
        }}
      >
        {/* 背景画像 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/card/${templateFile}`}
          alt=""
          className="qr-card-bg"
          crossOrigin="anonymous"
        />

        {/* 左エリア（半透明白オーバーレイ） */}
        <div className="qr-card-left">
          {/* アバター */}
          <div className="qr-card-avatar">
            {profile.avatarSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatarSrc} alt="" className="qr-card-avatar-img" crossOrigin="anonymous" />
            ) : (
              <span>{avatarInitial}</span>
            )}
          </div>

          {/* テキスト情報 */}
          <div className="qr-card-info">
            {cardInfo.name && (
              <p className="qr-card-name">{cardInfo.name}</p>
            )}
            {cardInfo.nickname && (
              <p className="qr-card-nickname">{cardInfo.nickname}</p>
            )}
            {cardInfo.description && (
              <p className="qr-card-desc">{cardInfo.description}</p>
            )}
            {cardInfo.handle && (
              <p className="qr-card-handle">{cardInfo.handle}</p>
            )}
          </div>
        </div>

        {/* 右エリア（QRコード） */}
        <div className="qr-card-right">
          <div className="qr-card-qr-wrap">
            <QRCodeSVG value={url} size={100} />
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

  // ── Step: テンプレート選択 ──────────────────────────────────────────────

  if (step === "template") {
    return (
      <div className="qr-overlay" onClick={onClose} role="dialog" aria-modal="true">
        <div className="qr-card-builder" onClick={(e) => e.stopPropagation()}>
          <div className="qr-card-builder-header">
            <button type="button" className="qr-modal-close" onClick={onClose} aria-label="閉じる">×</button>
            <strong>カードのデザインを選ぶ</strong>
          </div>

          <div className="qr-card-template-grid">
            {CARD_TEMPLATES.map((tpl) => (
              <button
                key={tpl.file}
                type="button"
                className={`qr-card-template-btn${templateFile === tpl.file ? " active" : ""}`}
                onClick={() => setTemplateFile(tpl.file)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`/card/${tpl.file}`} alt={tpl.label} className="qr-card-template-thumb" />
                <span className="qr-card-template-label">{tpl.label}</span>
              </button>
            ))}
          </div>

          <div className="qr-card-builder-footer">
            <button
              type="button"
              className="button"
              style={{ flex: 1 }}
              onClick={() => setStep("edit")}
            >
              このデザインで作る →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Step: カード編集 ────────────────────────────────────────────────────

  return (
    <div className="qr-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="qr-card-builder" onClick={(e) => e.stopPropagation()}>

        {/* ヘッダー */}
        <div className="qr-card-builder-header">
          <button
            type="button"
            className="button secondary"
            style={{ minHeight: "auto", padding: "4px 10px", fontSize: "12px" }}
            onClick={() => setStep("template")}
          >
            ← デザイン変更
          </button>
          <strong style={{ flex: 1, textAlign: "center" }}>カードを編集</strong>
          <button type="button" className="qr-modal-close" style={{ position: "static", margin: 0 }} onClick={onClose} aria-label="閉じる">×</button>
        </div>

        {/* カードプレビュー */}
        <div className="qr-card-preview-wrap">
          {renderCard()}
        </div>

        {/* 操作エリア */}
        <div className="qr-card-controls">

          {/* エラー */}
          {exportError && <p className="error-text" style={{ margin: 0 }}>{exportError}</p>}

          {/* 情報編集アコーディオン */}
          <div className="qr-card-info-accordion">
            <button
              type="button"
              className="qr-card-info-toggle"
              onClick={() => setInfoOpen(!infoOpen)}
            >
              <span>✏️ テキスト内容を編集</span>
              <span>{infoOpen ? "▲" : "▼"}</span>
            </button>
            {infoOpen && (
              <div className="qr-card-info-fields">
                {(["name", "nickname", "description", "handle"] as const).map((key) => (
                  <label key={key} style={{ display: "grid", gap: "2px", fontSize: "12px", color: "var(--muted)" }}>
                    { key === "name" ? "名前" : key === "nickname" ? "ニックネーム" : key === "description" ? "ひとこと" : "ハンドル" }
                    <input
                      value={cardInfo[key]}
                      onChange={(e) => setCardInfo((prev) => ({ ...prev, [key]: e.target.value }))}
                      placeholder={key === "handle" ? "@..." : ""}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* シール追加ボタン */}
          <button
            type="button"
            className="button secondary"
            style={{ width: "100%" }}
            onClick={() => { setStickerPickerPage(0); setStickerPickerOpen(true); }}
          >
            🏷 シールを貼る
          </button>

          {/* 保存・シェアボタン */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="button secondary"
              style={{ flex: 1 }}
              onClick={() => void handleSave()}
              disabled={exporting}
            >
              {exporting ? "生成中..." : "💾 PNG保存"}
            </button>
            <button
              type="button"
              className="button"
              style={{ flex: 1 }}
              onClick={() => void handleShare()}
              disabled={exporting}
            >
              {exporting ? "生成中..." : "📤 シェア"}
            </button>
          </div>
        </div>
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
              <button
                type="button"
                className="qr-modal-close"
                style={{ position: "static", margin: 0 }}
                onClick={() => setStickerPickerOpen(false)}
                aria-label="閉じる"
              >×</button>
            </div>
            <div className="sticker-picker-grid">
              {stickerPageItems.map((sticker) => (
                <button
                  key={sticker.id}
                  type="button"
                  className="sticker-choice"
                  onClick={() => { handleAddSticker(sticker.id); }}
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
                <button
                  type="button"
                  className="button secondary"
                  style={{ minHeight: "auto", padding: "4px 14px" }}
                  disabled={stickerPage === 0}
                  onClick={() => setStickerPickerPage(stickerPage - 1)}
                >← 前へ</button>
                <span className="muted small">{stickerPage + 1} / {totalStickerPages}</span>
                <button
                  type="button"
                  className="button secondary"
                  style={{ minHeight: "auto", padding: "4px 14px" }}
                  disabled={stickerPage >= totalStickerPages - 1}
                  onClick={() => setStickerPickerPage(stickerPage + 1)}
                >次へ →</button>
              </div>
            )}
            <p className="muted small" style={{ margin: 0, textAlign: "center", fontSize: "12px" }}>
              複数貼れます。終わったら × で閉じてください
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
