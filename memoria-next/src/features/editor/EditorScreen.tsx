"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { profilesApi } from "@/api/profiles";
import { settingsApi } from "@/api/settings";
import { stickerGiftsApi } from "@/api/stickerGifts";
import { PLAN_LIMITS } from "@/config/planLimits";
import AuthScreen from "@/features/auth/AuthScreen";
import TemplatePickerModal from "@/features/editor/TemplatePickerModal";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
import type { TemplateNode } from "@/api/templateNodes";
import type {
  CardInfoItem,
  CustomSticker,
  Field,
  Link as ProfileLink,
  Profile,
  StickerGiftInboxItem,
  StickerItem,
  UserSettings,
} from "@/types";

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

// ── Helpers ──────────────────────────────────────────────────────────────────


function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }
function fileToLabel(f: string) {
  return f.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").replace(/ color$/, "").trim();
}
function initialOf(name: string) { return (name || "?")[0].toUpperCase(); }
function cloneProfile(p: Profile): Profile {
  return { ...p, fields: [...p.fields], links: [...p.links], stickers: [...p.stickers] };
}
function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") resolve(result);
      else reject(new Error("failed to read image"));
    };
    reader.onerror = () => reject(reader.error ?? new Error("failed to read image"));
    reader.readAsDataURL(file);
  });
}
function resolveStickerSrc(stickerId: string) {
  return stickerId.startsWith("data:") ? stickerId : `/stamp/${stickerId}`;
}

/** QRカードのテキスト初期値をプロフィールから生成 */
function buildDefaultCardItems(p: Profile): CardInfoItem[] {
  const getField = (label: string) => p.fields.find((f) => f.label === label)?.value ?? "";
  return [
    { id: crypto.randomUUID(), label: "名前",         value: getField("名前") || p.patternName },
    { id: crypto.randomUUID(), label: "ニックネーム", value: getField("ニックネーム") },
    { id: crypto.randomUUID(), label: "ひとこと",     value: p.description },
  ];
}


/** 手動でパターンを追加するときのデフォルト構造 */
function buildDefaultProfile(name: string): Profile {
  const mf = (groupId: string, label: string, value: string): Field =>
    ({ id: crypto.randomUUID(), groupId, label, value, visible: true });
  return {
    id: crypto.randomUUID(), publicSlug: crypto.randomUUID().replace(/-/g, "").slice(0, 12), handle: null, isPublic: true,
    patternName: name, audience: "", description: "",
    themeId: "default", frameId: "none",
    fields: [
      mf("basic",        "名前",               "まだ名前なし"),
      mf("basic",        "ニックネーム",        "まだない"),
      mf("basic",        "呼ばれたい名前",      "好きに呼んで"),
      mf("basic",        "出身地",              "地球！"),
      mf("conversation", "家族構成",            "親はいる"),
      mf("whatif",       "自分を動物に例えると", "二足歩行のいきもの！"),
      mf("life",         "落ち着く場所",        "ベッドの中"),
      mf("life",         "ついやってしまうこと", "ネット"),
      mf("values",       "尊敬する人",          "エジソン"),
      mf("favorite",     "最近ハマってること",   "推し活"),
      mf("favorite",     "昔ハマってたこと",    "つかまり立ち"),
      mf("favorite",     "推し",                "秘密！"),
      mf("free",         "自由記入欄",          "とりあえず、いろいろ書いてみよう！"),
    ],
    links: [], stickers: [], avatarSrc: null, cardConfig: null,
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

type Tab = "preview" | "settings" | "qr" | "stickers" | "frame";
type BusyKind = "load" | "create" | "save" | "delete" | null;

// モバイルフッタ用（プレビュータブを先頭に追加）
const TABS: { id: Tab; icon: string; labelJa: string; labelEn: string }[] = [
  { id: "preview",  icon: "👁",  labelJa: "プレビュー", labelEn: "Preview"  },
  { id: "settings", icon: "📝", labelJa: "項目",       labelEn: "Fields"   },
  { id: "qr",       icon: "🎴", labelJa: "QRカード",   labelEn: "QR Card"  },
  { id: "stickers", icon: "🏷",  labelJa: "シール",     labelEn: "Stickers" },
  { id: "frame",    icon: "🖼",  labelJa: "フレーム",   labelEn: "Frame"    },
];
// PCパネルタブ用（プレビュータブは不要：常にカードが見えているため）
const DESKTOP_TABS = TABS.filter((t) => t.id !== "preview");

// ── Component ────────────────────────────────────────────────────────────────

const DEFAULT_SETTINGS: UserSettings = {
  plan: "free",
  language: "ja",
  customStickers: [],
  groups: [],
};

export default function EditorScreen() {
  const { session, logout } = useSession();
  const { t } = useLang();

  const [profiles,  setProfiles]  = useState<Profile[]>([]);
  const [activeId,  setActiveId]  = useState<string | null>(null);
  const [draft,     setDraft]     = useState<Profile | null>(null);
  const [busy,      setBusy]      = useState<BusyKind>("load");
  const [error,     setError]     = useState<string | null>(null);
  const [settings,  setSettings]  = useState<UserSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<Tab>("settings");
  const [selectedStickerIdx, setSelectedStickerIdx] = useState<number | null>(null);
  const [editingLabelId,     setEditingLabelId]     = useState<string | null>(null);
  const [editingLinkId,      setEditingLinkId]      = useState<string | null>(null);
  const [giftToHandle,       setGiftToHandle]       = useState("");
  const [giftStickerSrc,     setGiftStickerSrc]     = useState("");
  const [giftBusy,           setGiftBusy]           = useState(false);
  const [giftNotice,         setGiftNotice]         = useState<string | null>(null);
  const [giftInbox,          setGiftInbox]          = useState<StickerGiftInboxItem[]>([]);
  const [giftInboxBusy,      setGiftInboxBusy]      = useState(false);
  const [metaOpen,           setMetaOpen]           = useState(false);
  const [showAddModal,       setShowAddModal]        = useState(false);
  const [newPatternName,     setNewPatternName]      = useState("");
  const [frameConfirmOpen,   setFrameConfirmOpen]   = useState(false);
  const [frameConfirmData,   setFrameConfirmData]   = useState<{ themeId: string; frameId: string } | null>(null);
  const [stickerModalOpen,   setStickerModalOpen]   = useState(false);
  const [stickerModalPage,   setStickerModalPage]   = useState(0);
  const [stickerToast,       setStickerToast]       = useState(false);
  const [templatePickerOpen, setTemplatePickerOpen] = useState(false);

  // ── QRカードビルダー state ──────────────────────────────────────────────────
  const [qrTemplateFile,       setQrTemplateFile]       = useState(CARD_TEMPLATES[0].file);
  const [qrItems,              setQrItems]              = useState<CardInfoItem[]>([]);
  const [qrCardStickers,       setQrCardStickers]       = useState<StickerItem[]>([]);
  const [qrSelectedStickerIdx, setQrSelectedStickerIdx] = useState<number | null>(null);
  const [qrTemplatePickerOpen, setQrTemplatePickerOpen] = useState(false);
  const [qrStickerPickerOpen,  setQrStickerPickerOpen]  = useState(false);
  const [qrStickerPickerPage,  setQrStickerPickerPage]  = useState(0);
  const [qrExporting,          setQrExporting]          = useState(false);
  const [qrExportError,        setQrExportError]        = useState<string | null>(null);
  const [qrCopied,             setQrCopied]             = useState(false);
  const [qrImgSrc,             setQrImgSrc]             = useState("");
  const [qrFormatOpenId,       setQrFormatOpenId]       = useState<string | null>(null);
  const [qrAddPickerOpen,      setQrAddPickerOpen]      = useState(false);

  const paperRef       = useRef<HTMLDivElement>(null);
  const dragState      = useRef<{ idx: number; ox: number; oy: number } | null>(null);
  const autoSaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDraft    = useRef<Profile | null>(null);  // stale-closure guard for drag
  const toastTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrCardRef      = useRef<HTMLDivElement>(null);
  // qrCardExportRef廃止 → generateQrPngは可視カード(qrCardRef)を直接キャプチャ
  const qrCardWrapRef  = useRef<HTMLDivElement>(null);
  const qrDragState    = useRef<{ idx: number; ox: number; oy: number } | null>(null);
  const qrAutoSaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrOgUploadTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDraftIdRef  = useRef<string | null>(null);  // prevents re-init on same profile
  const [qrCardScale,  setQrCardScale]  = useState(1);

  // keep latestDraft in sync
  useEffect(() => { latestDraft.current = draft; }, [draft]);

  // QRコードURL（公開中なら実URL、未公開ならサンプル）
  const qrUrl = useMemo(() =>
    draft?.isPublic && draft?.publicSlug
      ? `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}?via=qr`
      : "https://profile.ac7.co.jp",
    [draft?.isPublic, draft?.publicSlug]
  );

  // qrUrl が変わるたびに QR data URL を生成（canvas 不要・タイミング依存なし）
  useEffect(() => {
    QRCode.toDataURL(qrUrl, { width: 100, margin: 1, color: { dark: "#000000", light: "#ffffff" } })
      .then(setQrImgSrc)
      .catch(() => {});
  }, [qrUrl]);

  // ── Load ──────────────────────────────────────────────────────────────────

  const load = useCallback(async () => {
    setBusy("load");
    setError(null);
    const [res, settingsRes] = await Promise.all([
      profilesApi.list(),
      settingsApi.get(),
    ]);

    if (settingsRes.ok) setSettings(settingsRes.data);
    if (!res.ok) { setBusy(null); setError(res.error); return; }

    setBusy(null);
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

  const loadGiftInbox = useCallback(async () => {
    setGiftInboxBusy(true);
    const res = await stickerGiftsApi.inbox();
    setGiftInboxBusy(false);
    if (!res.ok) {
      setGiftNotice(res.error);
      return;
    }
    setGiftInbox(res.data);
  }, []);

  useEffect(() => {
    if (session.status !== "user") {
      setGiftInbox([]);
      return;
    }
    void loadGiftInbox();
  }, [loadGiftInbox, session.status]);

  // ── QRカード状態の初期化（プロフィール切り替え時） ────────────────────────
  useEffect(() => {
    if (!activeId) return;
    if (initDraftIdRef.current === activeId) return;  // already initialized
    initDraftIdRef.current = activeId;
    const p = profiles.find((x) => x.id === activeId);
    if (!p) return;
    if (p.cardConfig) {
      setQrTemplateFile(p.cardConfig.templateFile);
      setQrItems(p.cardConfig.items);
      setQrCardStickers(p.cardConfig.cardStickers);
    } else {
      setQrTemplateFile(CARD_TEMPLATES[0].file);
      setQrItems(buildDefaultCardItems(p));
      setQrCardStickers([]);
    }
    setQrSelectedStickerIdx(null);
  }, [activeId, profiles]);

  // ── QRカードスケーリング（コンテナ幅に合わせてfit） ──────────────────────
  useEffect(() => {
    const el = qrCardWrapRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const available = entry.contentRect.width;
      if (available > 0) setQrCardScale(Math.min(1, available / 480));
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab]); // activeTab が "qr" になった瞬間に要素が出現するのでそのタイミングで再接続

  // ── Save ──────────────────────────────────────────────────────────────────

  async function doSave(target: Profile) {
    if (autoSaveTimer.current) { clearTimeout(autoSaveTimer.current); autoSaveTimer.current = null; }
    setBusy("save");
    setError(null);
    const res = await profilesApi.update(target.id, target);
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => prev.map((p) => p.id === target.id ? { ...target } : p));

    // QRタブが表示中ならOG画像を自動生成・保存（バックグラウンド）
    if (qrCardRef.current) {
      void (async () => {
        try {
          const dataUrl = await generateQrPng();
          await uploadQrOgImage(dataUrl);
        } catch { /* OG自動生成は非クリティカル */ }
      })();
    }
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
    setEditingLabelId(null);
    setEditingLinkId(null);
  }

  async function handleCreate(name?: string) {
    if (profiles.length >= planLimits.patterns) {
      showLimitError("patterns");
      return;
    }
    const next = buildDefaultProfile(name?.trim() || "新しいパターン");
    setBusy("create");
    const res = await profilesApi.create(next);
    setBusy(null);
    if (!res.ok) { setError(res.error); return; }
    setProfiles((prev) => [...prev, next]);
    setActiveId(next.id);
    setDraft(cloneProfile(next));
    setActiveTab("settings");
    setMetaOpen(true);
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
  function addTemplateToPattern(node: TemplateNode) {
    if (!draft) return;
    const newFields: Field[] = node.questions.map((q) => ({
      id: crypto.randomUUID(),
      groupId: node.name,   // テンプレート名をグループIDとして使用
      label: q.label,
      value: "",
      visible: true,
    }));
    applyAndSave({ ...draft, fields: [...draft.fields, ...newFields] });
  }

  function addFieldToGroup(groupId: string) {
    if (!draft) return;
    if (draft.fields.length >= planLimits.fieldsPerPattern) {
      showLimitError("fields");
      return;
    }
    const nf: Field = { id: crypto.randomUUID(), groupId, label: "", value: "", visible: true };
    const next = { ...draft, fields: [...draft.fields, nf] };
    setDraft(next); setEditingLabelId(nf.id); scheduleAutoSave(next);
  }
  function removeField(id: string) {
    if (!draft) return;
    applyAndSave({ ...draft, fields: draft.fields.filter((f) => f.id !== id) });
    if (editingLabelId === id) setEditingLabelId(null);
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

  function handleAddSticker(stickerId: string) {
    if (!draft) return;
    const item = { id: crypto.randomUUID(), stickerId, x: 50, y: 50, scale: 1 };
    const next = { ...draft, stickers: [...draft.stickers, item] };
    setSelectedStickerIdx(next.stickers.length - 1);
    applyAndSave(next);
  }
  async function handleDeleteCustomSticker(id: string) {
    const nextCustomStickers = customStickers.filter((s) => s.id !== id);
    const nextSettings: UserSettings = { ...settings, customStickers: nextCustomStickers };
    const res = await settingsApi.update(nextSettings);
    if (res.ok) setSettings(nextSettings);
  }

  async function handleCustomStickerUpload(file: File) {
    if (!planLimits.customStickerUpload) {
      setError(t("カスタムシールのアップロードはProプランで使えます。", "Custom sticker upload requires Pro plan."));
      return;
    }
    try {
      const raw = await readFileAsDataUrl(file);
      // canvas でリサイズ（最大長辺 100px、透明保持のため PNG）
      const assetSrc = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 100;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const w = Math.max(1, Math.round(img.width  * scale));
          const h = Math.max(1, Math.round(img.height * scale));
          const canvas = document.createElement("canvas");
          canvas.width  = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("canvas")); return; }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/png"));
        };
        img.onerror = () => reject(new Error("img load failed"));
        img.src = raw;
      });
      const nextCustomStickers: CustomSticker[] = [
        { id: crypto.randomUUID(), label: fileToLabel(file.name || "custom"), assetSrc },
        ...customStickers,
      ];
      const nextSettings: UserSettings = {
        ...settings,
        customStickers: nextCustomStickers,
      };
      const res = await settingsApi.update(nextSettings);
      if (!res.ok) {
        setError(res.error);
        return;
      }
      setSettings(nextSettings);
      setError(null);
    } catch {
      setError(t("画像の読み込みに失敗しました。", "Failed to load the sticker image."));
    }
  }
  async function handleAvatarUpload(file: File) {
    try {
      const raw = await readFileAsDataUrl(file);
      // canvas でリサイズ（最大 512px 正方形）
      const resized = await new Promise<string>((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          const MAX = 512;
          const scale = Math.min(1, MAX / Math.max(img.width, img.height));
          const w = Math.round(img.width  * scale);
          const h = Math.round(img.height * scale);
          const canvas = document.createElement("canvas");
          canvas.width  = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");
          if (!ctx) { reject(new Error("canvas")); return; }
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL("image/jpeg", 0.82));
        };
        img.onerror = () => reject(new Error("img load failed"));
        img.src = raw;
      });
      if (!draft) return;
      applyAndSave({ ...draft, avatarSrc: resized });
    } catch {
      setError(t("画像の読み込みに失敗しました。", "Failed to load the image."));
    }
  }

  async function handleSendStickerGift() {
    const toHandle = giftToHandle.trim().replace(/^@+/, "");
    if (!toHandle) {
      setGiftNotice(t("受け取り相手のhandleを入力してください。", "Please enter recipient handle."));
      return;
    }
    const selected = customStickers.find((sticker) => sticker.assetSrc === giftStickerSrc);
    if (!selected) {
      setGiftNotice(t("贈るシールを選んでください。", "Please select a sticker to gift."));
      return;
    }

    setGiftBusy(true);
    const res = await stickerGiftsApi.send(toHandle, {
      label: selected.label,
      assetSrc: selected.assetSrc,
    });
    setGiftBusy(false);

    if (!res.ok) {
      setGiftNotice(res.error);
      return;
    }

    setGiftToHandle("");
    setGiftStickerSrc("");
    setGiftNotice(t("シールを贈りました。", "Sticker gift sent."));
  }
  async function handleAcceptStickerGift(id: string) {
    setGiftBusy(true);
    const res = await stickerGiftsApi.accept(id);
    setGiftBusy(false);
    if (!res.ok) {
      setGiftNotice(res.error);
      return;
    }

    const settingsRes = await settingsApi.get();
    if (settingsRes.ok) setSettings(settingsRes.data);
    await loadGiftInbox();
    setGiftNotice(
      res.data.added
        ? t("受け取りました。シール一覧に追加されました。", "Accepted. Added to your sticker list.")
        : t("受け取りました（すでに同じシールを所持しています）。", "Accepted (you already had this sticker).")
    );
  }
  async function handleRejectStickerGift(id: string) {
    setGiftBusy(true);
    const res = await stickerGiftsApi.reject(id);
    setGiftBusy(false);
    if (!res.ok) {
      setGiftNotice(res.error);
      return;
    }
    await loadGiftInbox();
    setGiftNotice(t("ギフトを辞退しました。", "Gift rejected."));
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
    let ox = 0, oy = 0;
    if (paperRef.current && draft) {
      const rect = paperRef.current.getBoundingClientRect();
      const s = draft.stickers[idx];
      if (s) {
        const curX = ((e.clientX - rect.left) / rect.width)  * 100;
        const curY = ((e.clientY - rect.top)  / rect.height) * 100;
        ox = curX - s.x;
        oy = curY - s.y;
      }
    }
    dragState.current = { idx, ox, oy };
  }

  function onPaperPointerMove(e: React.PointerEvent) {
    const ds = dragState.current;
    if (!ds || !paperRef.current) return;
    e.preventDefault();
    const rect = paperRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100 - ds.ox, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100 - ds.oy, 0, 92);
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

  // フレーム確認モーダル：選択した瞬間はまだ保存せず、プレビューを見せてから確定
  function handlePreviewTheme(themeId: string) {
    if (!draft) return;
    setFrameConfirmData({ themeId, frameId: draft.frameId ?? "none" });
    setFrameConfirmOpen(true);
  }
  function handlePreviewFrame(frameId: string) {
    if (!draft) return;
    setFrameConfirmData({ themeId: draft.themeId ?? "default", frameId });
    setFrameConfirmOpen(true);
  }
  function handleFrameConfirm() {
    if (!draft || !frameConfirmData) return;
    applyAndSave({ ...draft, themeId: frameConfirmData.themeId, frameId: frameConfirmData.frameId });
    setFrameConfirmOpen(false);
    setFrameConfirmData(null);
  }
  function handleFrameCancel() {
    setFrameConfirmOpen(false);
    setFrameConfirmData(null);
  }

  // シール貼りつきトースト
  function handleAddStickerWithToast(stickerId: string) {
    handleAddSticker(stickerId);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setStickerToast(true);
    toastTimer.current = setTimeout(() => setStickerToast(false), 2000);
  }

  // ── QRカードビルダー ───────────────────────────────────────────────────────

  function scheduleQrConfigSave(template: string, items: CardInfoItem[], stickers: StickerItem[]) {
    // ── QRカード設定を保存（700ms debounce）
    if (qrAutoSaveTimer.current) clearTimeout(qrAutoSaveTimer.current);
    qrAutoSaveTimer.current = setTimeout(() => {
      if (!draft) return;
      const config = { templateFile: template, items, cardStickers: stickers };
      void profilesApi.update(draft.id, { cardConfig: config });
      setProfiles((prev) => prev.map((p) => p.id === draft.id ? { ...p, cardConfig: config } : p));
    }, 700);

    // ── OG画像を自動更新（1500ms debounce・公開プロフかつQRタブ表示中のみ）
    if (qrOgUploadTimer.current) clearTimeout(qrOgUploadTimer.current);
    qrOgUploadTimer.current = setTimeout(async () => {
      if (!qrCardRef.current) return;                                        // QRタブが非表示
      if (!latestDraft.current?.isPublic || !latestDraft.current?.publicSlug) return; // 非公開
      try {
        const dataUrl = await generateQrPng();
        void uploadQrOgImage(dataUrl);
      } catch { /* silent: OG自動更新失敗は致命的でない */ }
    }, 1500);
  }

  function applyQrTemplate(file: string) {
    setQrTemplateFile(file);
    scheduleQrConfigSave(file, qrItems, qrCardStickers);
  }

  function handleAddQrItem() {
    const next: CardInfoItem[] = [...qrItems, { id: crypto.randomUUID(), label: "", value: "" }];
    setQrItems(next);
    scheduleQrConfigSave(qrTemplateFile, next, qrCardStickers);
  }

  function handleUpdateQrItem(id: string, patch: Partial<CardInfoItem>) {
    const next = qrItems.map((it) => it.id === id ? { ...it, ...patch } : it);
    setQrItems(next);
    scheduleQrConfigSave(qrTemplateFile, next, qrCardStickers);
  }

  function handleDeleteQrItem(id: string) {
    const next = qrItems.filter((it) => it.id !== id);
    setQrItems(next);
    scheduleQrConfigSave(qrTemplateFile, next, qrCardStickers);
  }

  function handleAddQrItemFromField(label: string, value: string) {
    const next: CardInfoItem[] = [...qrItems, { id: crypto.randomUUID(), label, value }];
    setQrItems(next);
    scheduleQrConfigSave(qrTemplateFile, next, qrCardStickers);
    setQrAddPickerOpen(false);
  }

  function handleAddQrSticker(stickerId: string) {
    const item: StickerItem = { id: crypto.randomUUID(), stickerId, x: 50, y: 50, scale: 1 };
    const next = [...qrCardStickers, item];
    setQrCardStickers(next);
    setQrSelectedStickerIdx(next.length - 1);
    scheduleQrConfigSave(qrTemplateFile, qrItems, next);
  }

  function handleDeleteQrSticker(idx: number) {
    const next = qrCardStickers.filter((_, i) => i !== idx);
    setQrSelectedStickerIdx(null);
    setQrCardStickers(next);
    scheduleQrConfigSave(qrTemplateFile, qrItems, next);
  }

  function handleResizeQrSticker(idx: number, delta: number) {
    const next = qrCardStickers.map((s, i) =>
      i === idx ? { ...s, scale: clamp((s.scale ?? 1) + delta, 0.3, 3) } : s
    );
    setQrCardStickers(next);
    scheduleQrConfigSave(qrTemplateFile, qrItems, next);
  }

  function onQrStickerPointerDown(e: React.PointerEvent, idx: number) {
    if ((e.target as HTMLElement).closest("[data-sticker-control]")) return;
    e.preventDefault(); e.stopPropagation();
    setQrSelectedStickerIdx(idx);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    let ox = 0, oy = 0;
    if (qrCardRef.current) {
      const rect = qrCardRef.current.getBoundingClientRect();
      const s = qrCardStickers[idx];
      if (s) {
        const curX = ((e.clientX - rect.left) / rect.width)  * 100;
        const curY = ((e.clientY - rect.top)  / rect.height) * 100;
        ox = curX - s.x;
        oy = curY - s.y;
      }
    }
    qrDragState.current = { idx, ox, oy };
  }

  function onQrCardPointerMove(e: React.PointerEvent) {
    const ds = qrDragState.current;
    if (!ds || !qrCardRef.current) return;
    e.preventDefault();
    const rect = qrCardRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100 - ds.ox, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100 - ds.oy, 0, 92);
    setQrCardStickers((prev) => prev.map((s, i) => i === ds.idx ? { ...s, x, y } : s));
  }

  function onQrCardPointerUp() {
    if (!qrDragState.current) return;
    qrDragState.current = null;
    scheduleQrConfigSave(qrTemplateFile, qrItems, qrCardStickers);
  }

  async function generateQrPng(): Promise<string> {
    // 可視カードを使う（export用隠しカードはoff-screen描画スキップ問題あり）
    const visibleCard = qrCardRef.current;
    if (!visibleCard) throw new Error("no card ref");
    setQrSelectedStickerIdx(null);
    const freshQr = await QRCode.toDataURL(qrUrl, { width: 100, margin: 1, color: { dark: "#000000", light: "#ffffff" } });
    setQrImgSrc(freshQr);
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    // style オプションはクローンにのみ適用される → 実際のDOMは変更しない
    // position:relative にしないと foreignObject 内で幅が 317px に誤計算される
    return toPng(visibleCard, {
      pixelRatio: 2,
      cacheBust: true,
      width: 480,
      height: 290,
      canvasWidth: 960,
      canvasHeight: 580,
      style: {
        position: "relative",
        transform: "none",
        width: "480px",
        height: "290px",
      },
    });
  }

  async function uploadQrOgImage(dataUrl: string): Promise<void> {
    if (!draft) return;
    try {
      const blob = await (await fetch(dataUrl)).blob();
      await fetch(`/api/og/${draft.id}`, {
        method:  "POST",
        body:    blob,
        headers: { "Content-Type": "image/png" },
      });
    } catch { /* OG upload failure is non-critical */ }
  }

  async function handleQrCardSave() {
    setQrExporting(true); setQrExportError(null);
    try {
const dataUrl = await generateQrPng();
      void uploadQrOgImage(dataUrl);           // OG image を非同期でアップ
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `memoria-card-${draft?.patternName ?? "card"}.png`;
      a.click();
    } catch { setQrExportError("画像の生成に失敗しました。"); }
    finally { setQrExporting(false); }
  }

  async function handleQrCardShare() {
    setQrExporting(true); setQrExportError(null);
    try {
const dataUrl = await generateQrPng();
      void uploadQrOgImage(dataUrl);           // OG image を非同期でアップ
      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `memoria-card-${draft?.patternName ?? "card"}.png`, { type: "image/png" });
      if (typeof navigator.share === "function" && navigator.canShare?.({ files: [file] })) {
        await navigator.share({ title: draft?.patternName, text: `${qrItems[0]?.value ?? ""}のプロフィール`, files: [file] });
      } else {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = file.name;
        a.click();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (!msg.includes("AbortError") && !msg.includes("cancel")) setQrExportError("シェアに失敗しました。");
    } finally { setQrExporting(false); }
  }

  async function handleQrXShare() {
    if (!draft?.isPublic || !draft.publicSlug) return;
    setQrExporting(true); setQrExportError(null);
    try {
const dataUrl = await generateQrPng();
      void uploadQrOgImage(dataUrl);
      const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}`;
      const text = `${qrItems[0]?.value ?? draft.patternName}のプロフィール`;
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(profileUrl)}&text=${encodeURIComponent(text)}`,
        "_blank", "noopener,noreferrer"
      );
    } catch { setQrExportError("画像の生成に失敗しました。"); }
    finally { setQrExporting(false); }
  }

  async function handleQrCopyUrl() {
    if (!draft?.isPublic || !draft.publicSlug) return;
    setQrExporting(true); setQrExportError(null);
    try {
const dataUrl = await generateQrPng();
      void uploadQrOgImage(dataUrl);
      const profileUrl = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}`;
      await navigator.clipboard.writeText(profileUrl);
      setQrCopied(true);
      setTimeout(() => setQrCopied(false), 2500);
    } catch { setQrExportError("コピーに失敗しました。"); }
    finally { setQrExporting(false); }
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
  const planLimits = PLAN_LIMITS[settings.plan];
  const customStickers: CustomSticker[] = (Array.isArray(settings.customStickers) ? settings.customStickers : [])
    .map((entry): CustomSticker | null => {
      if (!entry || typeof entry !== "object") return null;
      const value = entry as { id?: unknown; label?: unknown; assetSrc?: unknown };
      if (typeof value.assetSrc !== "string" || value.assetSrc.length === 0) return null;
      return {
        id:
          typeof value.id === "string" && value.id.length > 0
            ? value.id
            : value.assetSrc.slice(0, 80),
        label: typeof value.label === "string" && value.label.length > 0 ? value.label : "Custom",
        assetSrc: value.assetSrc,
      };
    })
    .filter((entry): entry is CustomSticker => entry !== null);

  function showLimitError(kind: "patterns" | "fields") {
    if (kind === "patterns") {
      setError(
        t(
          `パターン上限（${planLimits.patterns}件）に達しました。`,
          `Pattern limit reached (${planLimits.patterns}).`
        )
      );
      return;
    }
    setError(
      t(
        `項目上限（${planLimits.fieldsPerPattern}件）に達しました。`,
        `Field limit reached (${planLimits.fieldsPerPattern}).`
      )
    );
  }

  // ── カードプレビュー（静的・フレーム確認モーダル用） ──────────────────────

  function renderCardPreview(d: Profile) {
    return (
      <div
        className={`profile-paper theme-${d.themeId || "default"}${d.frameId && d.frameId !== "none" ? " has-image-frame" : ""}`}
        style={d.frameId && d.frameId !== "none" ? { "--frame-url": `url('/frame/${d.frameId}')` } as React.CSSProperties : { position: "relative" }}
      >
        <div className="paper-lines" />
        <div className="profile-content">
          <header className="profile-head">
            <div className="avatar">
              {d.avatarSrc
                ? <img src={d.avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> // eslint-disable-line @next/next/no-img-element
                : <span>{initialOf(d.patternName)}</span>
              }
            </div>
            <div>
              <p className="muted" style={{ margin: 0, fontSize: "13px" }}>
                {d.patternName}{d.audience ? ` / ${d.audience}` : ""}
              </p>
              <h2 className="profile-name">{d.description || d.patternName}</h2>
            </div>
          </header>
          {d.fields.filter((f) => f.visible && f.value).map((f) => (
            <div key={f.id} className="answer">
              <span className="muted small">{f.label}</span>
              <strong>{f.value}</strong>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ── QRカードビュー（カードエリアに表示） ─────────────────────────────────

  function renderQrCardPaper({
    nodeRef,
    scale = 1,
    interactive = false,
    exportMode = false,
  }: {
    nodeRef?: React.Ref<HTMLDivElement>;
    scale?: number;
    interactive?: boolean;
    exportMode?: boolean;
  }) {
    if (!draft) return null;
    const avatarInitial = (qrItems[0]?.value || draft.patternName || "?")[0].toUpperCase();
    const paperStyle: React.CSSProperties = { touchAction: "none" };
    if (!exportMode) {
      paperStyle.transform = `scale(${scale})`;
      paperStyle.transformOrigin = "top left";
      paperStyle.position = "absolute";
    }

    return (
      <div
        ref={nodeRef}
        className="qr-card-paper"
        style={paperStyle}
        onPointerMove={interactive ? onQrCardPointerMove : undefined}
        onPointerUp={interactive ? onQrCardPointerUp : undefined}
        onClick={interactive ? (e) => {
            if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
            setQrSelectedStickerIdx(null);
          } : undefined}
      >
          {/* 背景 */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`/card/${qrTemplateFile}`} alt="" className="qr-card-bg" crossOrigin="anonymous" />

          {/* 左エリア */}
          <div className="qr-card-left">
            <div className="qr-card-avatar">
              {draft.avatarSrc
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={draft.avatarSrc} alt="" className="qr-card-avatar-img" />
                : <span>{avatarInitial}</span>
              }
            </div>
            <div className="qr-card-info">
              {qrItems.map((item) => item.value ? (
                <p key={item.id} style={{
                  margin: "1px 0", lineHeight: 1.3,
                  color:    item.color    ?? "#222222",
                  fontSize: item.fontSize ?? 16,
                }}>
                  {item.label && (
                    <span style={{ opacity: 0.6, fontSize: "0.75em", marginRight: "0.3em" }}>
                      {item.label}
                    </span>
                  )}
                  {item.value}
                </p>
              ) : null)}
            </div>
          </div>

          {/* 右エリア */}
          <div className="qr-card-right">
            <div className="qr-card-qr-wrap">
              {/* QRCode.toDataURL()で生成したdata URLをimgで表示。html-to-imageが確実に取り込める */}
              {qrImgSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrImgSrc} width={100} height={100} alt="QR" style={{ display: "block" }} />
              )}
            </div>
          </div>

          {/* ウォーターマーク */}
          <div style={{
            position: "absolute", bottom: 6, right: 8, zIndex: 100,
            fontSize: 9, color: "rgba(0,0,0,0.45)", pointerEvents: "none",
            fontFamily: "sans-serif", letterSpacing: 0.2, lineHeight: 1,
          }}>
            [memoria] https://profile.ac7.co.jp
          </div>

          {/* シール */}
          {qrCardStickers.map((s, idx) => {
            const sz    = Math.round(52 * (s.scale ?? 1));
            const isSel = interactive && qrSelectedStickerIdx === idx;
            const src   = s.stickerId.startsWith("data:") ? s.stickerId : `/stamp/${s.stickerId}`;
            return (
              <div
                key={s.id} data-sticker-el="1"
                className={`placed-sticker${isSel ? " selected" : ""}`}
                style={{ left: `${(s.x / 100) * 480}px`, top: `${(s.y / 100) * 290}px`, width: `${sz}px`, cursor: interactive ? "grab" : "default", touchAction: "none", zIndex: 10 }}
                onPointerDown={interactive ? (e) => onQrStickerPointerDown(e, idx) : undefined}
              >
                {isSel && (
                  <div className="placed-sticker-controls" data-sticker-control="true">
                    <button type="button" className="sticker-ctl"
                      onClick={(e) => { e.stopPropagation(); handleResizeQrSticker(idx, -0.2); }}>−</button>
                    <button type="button" className="sticker-ctl"
                      onClick={(e) => { e.stopPropagation(); handleResizeQrSticker(idx, 0.2); }}>＋</button>
                    <button type="button" className="sticker-ctl danger"
                      onClick={(e) => { e.stopPropagation(); handleDeleteQrSticker(idx); }}>×</button>
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

  function renderQrCardView() {
    if (!draft) return null;
    return (
      /* コンテナ: 実幅を ResizeObserver で計測してスケール係数を決定 */
      <div ref={qrCardWrapRef} style={{ width: "100%", overflow: "hidden" }}>
        {/* スケール用ラッパー: transform-origin top left で縮小するとcollapse対策に高さも明示 */}
        <div style={{
          width: 480 * qrCardScale,
          height: 290 * qrCardScale,
          position: "relative",
        }}>
          {renderQrCardPaper({ nodeRef: qrCardRef, scale: qrCardScale, interactive: true })}
        </div>
        {/* export用隠しカードは廃止 → generateQrPng が可視カードを直接キャプチャ */}
      </div>
    );
  }

  // ── QRカードパネル（右パネルに表示） ──────────────────────────────────────

  function renderQrPanel() {
    if (!draft) return null;
    const stickerChoices = [
      ...customStickers.map((s) => ({ id: s.assetSrc, src: s.assetSrc, label: s.label })),
      ...STAMP_FILES.map((f)   => ({ id: f, src: `/stamp/${f}`, label: fileToLabel(f) })),
    ];
    return (
      <div className="stack" style={{ gap: "10px" }}>

        {/* 非公開警告 */}
        {!draft.isPublic && (
          <p className="muted small" style={{ margin: 0, background: "var(--pink-soft)", padding: "8px 10px", borderRadius: "6px" }}>
            ⚠️ {t("このプロフィールは非公開です。", "This profile is private. ")}
            <button
              type="button"
              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--blue, #3b82f6)", textDecoration: "underline", padding: 0, fontSize: "inherit" }}
              onClick={() => setMetaOpen(true)}
            >
              {t("▼ 公開設定を開く", "Open sharing settings ▼")}
            </button>
          </p>
        )}

        {/* 背景変更 */}
        <button type="button" className="button secondary" style={{ width: "100%" }}
          onClick={() => setQrTemplatePickerOpen(true)}>
          🖼 {t("背景を変える", "Change background")}
        </button>

        {/* シール */}
        <button type="button" className="button" style={{ width: "100%" }}
          onClick={() => { setQrStickerPickerPage(0); setQrStickerPickerOpen(true); }}>
          🏷 {t("シールを貼る", "Add sticker")}
        </button>
        {qrCardStickers.length > 0 && (
          <button type="button" className="button secondary"
            style={{ width: "100%", color: "var(--pink)", fontSize: "12px", minHeight: "auto", padding: "4px 10px" }}
            onClick={() => { setQrCardStickers([]); scheduleQrConfigSave(qrTemplateFile, qrItems, []); }}>
            {t("シールを全部はがす", "Remove all stickers")}
          </button>
        )}

        {/* テキスト編集 */}
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <strong style={{ fontSize: "13px" }}>{t("テキスト内容", "Text items")}</strong>
            <button type="button" className="icon-button mini-button"
              onClick={() => setQrAddPickerOpen(true)}
              title={t("項目を追加", "Add item")}>＋</button>
          </div>
          {/* 書式ポップオーバー用バックドロップ */}
          {qrFormatOpenId && (
            <div
              style={{ position: "fixed", inset: 0, zIndex: 9998 }}
              onClick={() => setQrFormatOpenId(null)}
            />
          )}

          <div className="stack" style={{ gap: "6px" }}>
            {qrItems.map((item) => {
              const isFormatOpen = qrFormatOpenId === item.id;
              const currentColor = item.color    ?? "#222222";
              const currentSize  = item.fontSize ?? 16;
              return (
                <div key={item.id} className="qr-item-row" style={{ position: "relative" }}>
                  {/* 1行: ラベル・内容・書式ボタン・削除ボタン */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto auto", gap: "4px", alignItems: "center" }}>
                    <input
                      style={{ fontSize: "12px" }}
                      placeholder={t("ラベル", "Label")}
                      value={item.label}
                      onChange={(e) => handleUpdateQrItem(item.id, { label: e.target.value })}
                    />
                    <input
                      style={{ fontSize: "12px" }}
                      placeholder={t("内容", "Value")}
                      value={item.value}
                      onChange={(e) => handleUpdateQrItem(item.id, { value: e.target.value })}
                    />
                    {/* 書式ボタン（色ドット + Aa） */}
                    <button
                      type="button"
                      onClick={() => setQrFormatOpenId(isFormatOpen ? null : item.id)}
                      title={t("書式設定", "Format")}
                      style={{
                        minHeight: "auto", padding: "2px 5px", fontSize: "11px", fontWeight: 700,
                        border: "1px solid var(--line)", borderRadius: "4px", background: isFormatOpen ? "var(--paper-strong)" : "var(--panel)",
                        cursor: "pointer", display: "flex", alignItems: "center", gap: "3px", position: "relative", zIndex: 9999,
                      }}
                    >
                      <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: currentColor, border: "1px solid #ccc", flexShrink: 0 }} />
                      <span style={{ color: "var(--ink)" }}>Aa</span>
                    </button>
                    <button type="button"
                      style={{ minHeight: "auto", padding: "2px 6px", color: "var(--pink)", fontSize: "14px", background: "none", border: "none", cursor: "pointer" }}
                      onClick={() => handleDeleteQrItem(item.id)}>×</button>
                  </div>

                  {/* 書式ポップオーバー */}
                  {isFormatOpen && (
                    <div style={{
                      position: "absolute", bottom: "calc(100% + 4px)", right: 0,
                      background: "var(--panel)", border: "1px solid var(--line)", borderRadius: "8px",
                      padding: "10px 14px", boxShadow: "0 4px 20px rgba(0,0,0,0.18)",
                      zIndex: 9999, display: "flex", gap: "14px", alignItems: "center", whiteSpace: "nowrap",
                    }}>
                      <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--muted)" }}>
                        {t("文字色", "Color")}
                        <input
                          type="color"
                          value={currentColor}
                          style={{ width: "32px", height: "26px", padding: "1px", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer" }}
                          onChange={(e) => handleUpdateQrItem(item.id, { color: e.target.value })}
                        />
                      </label>
                      <label style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--muted)" }}>
                        {t("サイズ", "Size")}
                        <select
                          value={currentSize}
                          style={{ fontSize: "12px", padding: "2px 4px" }}
                          onChange={(e) => handleUpdateQrItem(item.id, { fontSize: Number(e.target.value) })}
                        >
                          {[9, 10, 11, 12, 13, 14, 16, 18, 20].map((s) => (
                            <option key={s} value={s}>{s}px</option>
                          ))}
                        </select>
                      </label>
                      {/* プレビュー */}
                      <span style={{
                        fontSize: currentSize, color: currentColor, fontWeight: 600,
                        padding: "1px 6px", background: "#e8e0d8", borderRadius: "4px",
                      }}>Aa</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* SNSシェア */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleQrXShare()}
            disabled={qrExporting || !draft?.isPublic}
            title={draft?.isPublic ? undefined : t("公開設定が必要です", "Make profile public first")}>
            {qrExporting ? "…" : "𝕏 でシェア"}
          </button>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleQrCopyUrl()}
            disabled={qrExporting || !draft?.isPublic}>
            {qrCopied ? "✓ " + t("コピー済み", "Copied!") : "🔗 " + t("URLをコピー", "Copy URL")}
          </button>
        </div>
        {!draft?.isPublic && (
          <p className="muted small" style={{ margin: 0, fontSize: "11px" }}>
            ⚠️ {t("X/URLシェアには公開設定が必要です", "Publish your profile to enable X share & URL copy")}
          </p>
        )}

        {/* デプロイ確認用ビルドバージョン */}
        <p style={{ margin: 0, fontSize: "10px", color: "var(--muted, #aaa)", textAlign: "right", opacity: 0.6 }}>
          build: {process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev"}
        </p>

        {/* QRカード専用ページへ */}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: "10px" }}>
          <a
            href={`/card/${draft.id}`}
            className="button secondary"
            style={{ width: "100%", fontSize: "12px" }}
            target="_blank" rel="noreferrer"
          >
            🔗 {t("大画面で編集", "Open full editor")}
          </a>
        </div>

        {/* 背景テンプレートピッカー（インラインモーダル） */}
        {qrTemplatePickerOpen && (
          <div className="sticker-picker-backdrop"
            onClick={() => setQrTemplatePickerOpen(false)} role="dialog" aria-modal="true">
            <div className="sticker-picker-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sticker-picker-header">
                <strong>{t("背景を選ぶ", "Choose background")}</strong>
                <button type="button" className="qr-modal-close"
                  style={{ position: "static", margin: 0 }}
                  onClick={() => setQrTemplatePickerOpen(false)} aria-label="閉じる">×</button>
              </div>
              <div className="sticker-picker-grid">
                {CARD_TEMPLATES.map((tpl) => (
                  <button key={tpl.file} type="button"
                    className={`sticker-choice${qrTemplateFile === tpl.file ? " active" : ""}`}
                    onClick={() => { applyQrTemplate(tpl.file); setQrTemplatePickerOpen(false); }}
                    title={tpl.label}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={`/card/${tpl.file}`} alt={tpl.label}
                      style={{ width: "52px", height: "36px", objectFit: "cover", borderRadius: "4px" }} />
                    <span className="muted small" style={{ fontSize: "10px" }}>{tpl.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* シールピッカー */}
        {qrStickerPickerOpen && (() => {
          const PER_PAGE   = 16;
          const totalPages = Math.ceil(stickerChoices.length / PER_PAGE);
          const page       = Math.min(qrStickerPickerPage, totalPages - 1);
          const pageItems  = stickerChoices.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
          return (
            <div className="sticker-picker-backdrop"
              onClick={() => setQrStickerPickerOpen(false)} role="dialog" aria-modal="true">
              <div className="sticker-picker-modal" onClick={(e) => e.stopPropagation()}>
                <div className="sticker-picker-header">
                  <strong>{t("シールを選ぶ", "Pick a sticker")}</strong>
                  <button type="button" className="qr-modal-close"
                    style={{ position: "static", margin: 0 }}
                    onClick={() => setQrStickerPickerOpen(false)} aria-label="閉じる">×</button>
                </div>
                <div className="sticker-picker-grid">
                  {pageItems.map((sticker) => (
                    <button key={sticker.id} type="button" className="sticker-choice"
                      onClick={() => handleAddQrSticker(sticker.id)} title={sticker.label}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={sticker.src} alt={sticker.label}
                        style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    </button>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="sticker-picker-pagination">
                    <button type="button" className="button secondary"
                      style={{ minHeight: "auto", padding: "4px 14px" }}
                      disabled={page === 0} onClick={() => setQrStickerPickerPage(page - 1)}>
                      ← {t("前へ", "Prev")}
                    </button>
                    <span className="muted small">{page + 1} / {totalPages}</span>
                    <button type="button" className="button secondary"
                      style={{ minHeight: "auto", padding: "4px 14px" }}
                      disabled={page >= totalPages - 1} onClick={() => setQrStickerPickerPage(page + 1)}>
                      {t("次へ", "Next")} →
                    </button>
                  </div>
                )}
                <p className="muted small" style={{ margin: "8px 0 0", textAlign: "center", fontSize: "12px" }}>
                  {t("複数貼れます。終わったら × で閉じてください", "You can add multiple. Close with × when done.")}
                </p>
              </div>
            </div>
          );
        })()}

        {/* ── 項目追加ピッカー ──────────────────────────────────────────── */}
        {qrAddPickerOpen && (() => {
          // プロフ項目をグループ別に整理
          const grouped: Record<string, Field[]> = {};
          for (const f of draft.fields) {
            if (!f.value) continue;  // 値のない項目は除外
            const gid = f.groupId || "basic";
            if (!grouped[gid]) grouped[gid] = [];
            grouped[gid].push(f);
          }
          const usedGroups = GROUP_ORDER.filter((g) => grouped[g]?.length);
          return (
            <div className="sticker-picker-backdrop"
              onClick={() => setQrAddPickerOpen(false)} role="dialog" aria-modal="true">
              <div className="sticker-picker-modal" onClick={(e) => e.stopPropagation()}
                style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <div className="sticker-picker-header">
                  <strong>{t("項目を追加", "Add item")}</strong>
                  <button type="button" className="qr-modal-close"
                    style={{ position: "static", margin: 0 }}
                    onClick={() => setQrAddPickerOpen(false)} aria-label="閉じる">×</button>
                </div>
                <p className="muted small" style={{ margin: "4px 0 10px", fontSize: "12px" }}>
                  {t("プロフ項目から選ぶと値をコピーして追加します（以降は独立）", "Values are copied once from your profile and managed independently")}
                </p>
                <div className="stack" style={{ gap: "6px" }}>
                  {usedGroups.map((gid) => {
                    const [lJa, lEn] = GROUP_LABELS[gid] ?? [gid, gid];
                    return (
                      <details key={gid} open className="field-group">
                        <summary>
                          <span>{t(lJa, lEn)}</span>
                        </summary>
                        <div className="field-list">
                          {(grouped[gid] ?? []).map((field) => (
                            <button
                              key={field.id}
                              type="button"
                              className="field-card"
                              style={{ width: "100%", textAlign: "left", cursor: "pointer", padding: "6px 10px", display: "grid", gap: "2px" }}
                              onClick={() => handleAddQrItemFromField(field.label, field.value)}
                            >
                              <span className="muted small" style={{ fontSize: "11px" }}>{field.label}</span>
                              <strong style={{ fontSize: "13px" }}>{field.value}</strong>
                            </button>
                          ))}
                        </div>
                      </details>
                    );
                  })}
                </div>
                {/* 新規（空白） */}
                <div style={{ borderTop: "1px solid var(--line)", marginTop: "10px", paddingTop: "10px" }}>
                  <button type="button" className="button secondary" style={{ width: "100%" }}
                    onClick={() => { handleAddQrItem(); setQrAddPickerOpen(false); }}>
                    ＋ {t("空白の項目を新規追加", "Add blank item")}
                  </button>
                </div>
              </div>
            </div>
          );
        })()}
      </div>
    );
  }

  // ── Panel: シール ─────────────────────────────────────────────────────────

  function renderStickerPanel() {
    return (
      <div className="stack" style={{ gap: "10px" }}>

        {/* シールを貼るボタン → モーダルで選ぶ */}
        <button
          type="button"
          className="button"
          style={{ width: "100%", minHeight: "52px", fontSize: "15px", gap: "8px" }}
          onClick={() => { setStickerModalPage(0); setStickerModalOpen(true); }}
        >
          🏷 {t("シールを貼る", "Add sticker")}
        </button>

        {stickers.length > 0 && (
          <button
            type="button" className="button secondary"
            style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto", color: "var(--pink)", width: "100%" }}
            onClick={() => draft && applyAndSave({ ...draft, stickers: [] })}
          >
            {t("全部はがす", "Remove all stickers")}
          </button>
        )}

        <div className="sticker-upload-box">
          <strong>{t("カスタムシール", "Custom sticker")}</strong>
          {customStickers.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", margin: "4px 0" }}>
              {customStickers.map((sticker) => (
                <div key={sticker.id} style={{ position: "relative", display: "inline-flex" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sticker.assetSrc}
                    alt={sticker.label}
                    title={sticker.label}
                    style={{ width: "52px", height: "52px", objectFit: "contain", borderRadius: "6px", background: "var(--bg)", border: "1px solid var(--line)" }}
                  />
                  <button
                    type="button"
                    onClick={() => void handleDeleteCustomSticker(sticker.id)}
                    title={t("削除", "Delete")}
                    style={{
                      position: "absolute", top: "-6px", right: "-6px",
                      width: "18px", height: "18px", borderRadius: "50%",
                      background: "var(--pink)", color: "#fff", border: "none",
                      fontSize: "11px", lineHeight: 1, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      padding: 0,
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          {planLimits.customStickerUpload ? (
            <label className="file-button">
              <span>{t("＋ 画像をアップロード", "＋ Upload image")}</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleCustomStickerUpload(file);
                  e.currentTarget.value = "";
                }}
              />
            </label>
          ) : (
            <p className="muted small" style={{ margin: 0 }}>
              {t("カスタムシールのアップロードはProプランで使えます。", "Custom sticker upload is available on the Pro plan.")}
            </p>
          )}
        </div>
        {/* シールをあげる・受け取りBOX は交換帳実装後に有効化 */}
        {false && <div className="sticker-upload-box">
          <div style={{ display: "flex", justifyContent: "space-between", gap: "8px", alignItems: "center" }}>
            <strong>{t("受け取りBOX", "Inbox")}</strong>
            <button
              type="button"
              className="button secondary"
              style={{ minHeight: "auto", padding: "3px 8px", fontSize: "12px" }}
              onClick={() => void loadGiftInbox()}
              disabled={giftInboxBusy || giftBusy}
            >
              {t("更新", "Refresh")}
            </button>
          </div>
          {giftInboxBusy ? (
            <p className="muted small" style={{ margin: 0 }}>{t("読み込み中...", "Loading...")}</p>
          ) : giftInbox.length === 0 ? (
            <p className="muted small" style={{ margin: 0 }}>{t("受け取り待ちはありません。", "No pending gifts.")}</p>
          ) : (
            <div className="stack" style={{ gap: "6px" }}>
              {giftInbox.map((gift) => (
                <div key={gift.id} className="field-card" style={{ padding: "8px" }}>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={gift.stickerAssetSrc}
                      alt={gift.stickerLabel}
                      style={{ width: "36px", height: "36px", objectFit: "contain", flex: "0 0 auto" }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <strong style={{ fontSize: "12px", display: "block" }}>{gift.stickerLabel}</strong>
                      <span className="muted small">
                        {gift.senderHandle ? `@${gift.senderHandle}` : t("匿名", "Anonymous")}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
                    <button
                      type="button"
                      className="button secondary"
                      style={{ minHeight: "auto", padding: "3px 8px", fontSize: "12px" }}
                      onClick={() => void handleAcceptStickerGift(gift.id)}
                      disabled={giftBusy}
                    >
                      {t("受け取る", "Accept")}
                    </button>
                    <button
                      type="button"
                      className="button secondary"
                      style={{ minHeight: "auto", padding: "3px 8px", fontSize: "12px", color: "var(--pink)" }}
                      onClick={() => void handleRejectStickerGift(gift.id)}
                      disabled={giftBusy}
                    >
                      {t("辞退", "Reject")}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>}
      </div>
    );
  }

  // ── Panel: フレーム ───────────────────────────────────────────────────────

  function renderFramePanel() {
    if (!draft) return null;
    return (
      <div className="stack">
        <p className="muted small" style={{ margin: "0 0 2px" }}>
          {t("選ぶとプレビューを確認できます", "Select to preview before applying")}
        </p>
        <div>
          <p className="muted small" style={{ margin: "0 0 6px" }}>{t("テーマ（用紙の色）", "Paper theme")}</p>
          <div className="theme-grid">
            {THEMES.map((th) => (
              <button
                key={th.id} type="button"
                className={`theme-choice${draft.themeId === th.id ? " active" : ""}`}
                onClick={() => handlePreviewTheme(th.id)}
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
                onClick={() => handlePreviewFrame(fr.id)}
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

  // ── Panel: 設定（フィールド・基本情報） ───────────────────────────────────

  function renderSettingsPanel() {
    if (!draft) return null;
    return (
      <div className="stack">

        {/* フィールド */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
            <h3 style={{ margin: 0, fontSize: "14px" }}>{t("プロフィール項目", "Profile fields")}</h3>
            <button
              type="button"
              className="button secondary"
              style={{ fontSize: "12px", padding: "3px 10px", minHeight: "auto" }}
              onClick={() => setTemplatePickerOpen(true)}
            >
              ＋ {t("質問グループを追加", "Add question group")}
            </button>
          </div>
          <div className="stack" style={{ gap: "6px" }}>
            {allGroups.map((groupId) => {
              const fields = fieldsByGroup[groupId] || [];
              const [lJa, lEn] = GROUP_LABELS[groupId] ?? [groupId, groupId];
              return (
                <details key={groupId} className="field-group" open={groupId === "basic"}>
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
                      <div key={field.id} className={`field-row${field.visible ? "" : " field-row--hidden"}`}>
                        {/* ラベル行: テキスト表示 / タップで編集 + 👁 + × */}
                        <div className="field-row-head">
                          {editingLabelId === field.id ? (
                            <input
                              className="field-label-input"
                              value={field.label}
                              onChange={(e) => updateField(field.id, { label: e.target.value })}
                              onBlur={() => setEditingLabelId(null)}
                              onKeyDown={(e) => { if (e.key === "Enter") setEditingLabelId(null); }}
                              autoFocus
                              placeholder={t("ラベル名", "Label")}
                            />
                          ) : (
                            <span
                              className="field-label-text"
                              onClick={() => setEditingLabelId(field.id)}
                              title={t("タップでラベル名を編集", "Tap to edit label")}
                            >
                              {field.label || <em className="muted">{t("ラベル未設定", "No label")}</em>}
                            </span>
                          )}
                          <span className="field-row-icons">
                            <button
                              type="button"
                              className={`field-icon-btn${field.visible ? "" : " field-icon-btn--off"}`}
                              onClick={() => updateField(field.id, { visible: !field.visible })}
                              title={field.visible ? t("非表示にする", "Hide") : t("表示にする", "Show")}
                            >
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                                <circle cx="12" cy="12" r="3"/>
                              </svg>
                            </button>
                            <button
                              type="button"
                              className="field-icon-btn field-icon-btn--delete"
                              onClick={() => removeField(field.id)}
                              title={t("削除", "Delete")}
                            >
                              ×
                            </button>
                          </span>
                        </div>
                        {/* 値: 常に入力フォーム */}
                        <input
                          className="field-value-input"
                          value={field.value}
                          onChange={(e) => updateField(field.id, { value: e.target.value })}
                          placeholder={t("（未設定）", "(unset)")}
                        />
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

      {/* パターン選択＆基本情報アコーディオン */}
      {draft && (
        <div className="pattern-meta-block">
          <div className="pattern-meta-header">
            <button
              type="button"
              className="pattern-meta-toggle"
              onClick={() => setMetaOpen(!metaOpen)}
            >
              <span className="pattern-meta-arrow">{metaOpen ? "▲" : "▼"}</span>
              {profiles.length > 1 ? (
                <select
                  value={activeId ?? ""}
                  onChange={(e) => { selectProfile(e.target.value); }}
                  onClick={(e) => e.stopPropagation()}
                  className="pattern-meta-select"
                >
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>{p.patternName}</option>
                  ))}
                </select>
              ) : (
                <span className="pattern-meta-name">
                  {t("パターン情報の設定", "Pattern settings")}：{draft.patternName}
                </span>
              )}
            </button>
            <button
              type="button"
              className="icon-button mini-button"
              onClick={() => setMetaOpen(!metaOpen)}
              title={t("パターン情報の設定", "Pattern settings")}
              style={{ flexShrink: 0, fontSize: "11px", padding: "0 8px", letterSpacing: "0.02em" }}
            >
              {t("設定", "Settings")}
            </button>
            <button
              type="button"
              className="icon-button mini-button"
              onClick={() => { setNewPatternName(""); setShowAddModal(true); }}
              disabled={busy === "create"}
              title={t("新しいパターンを追加", "Add new pattern")}
              style={{ flexShrink: 0 }}
            >
              ＋
            </button>
          </div>

          {/* アコーディオン本体 */}
          {metaOpen && (
            <div className="pattern-meta-body">
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

              {/* 公開設定 */}
              <div style={{ fontSize: "13px", color: "var(--muted)", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span>{t("公開設定", "Public sharing")}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    id="isPublicCheck"
                    type="checkbox"
                    checked={draft.isPublic}
                    onChange={(e) => {
                      const isPublic = e.target.checked;
                      const publicSlug = isPublic && !draft.publicSlug
                        ? crypto.randomUUID().replace(/-/g, "").slice(0, 12)
                        : draft.publicSlug;
                      applyAndSave({ ...draft, isPublic, publicSlug });
                    }}
                    style={{ flexShrink: 0, cursor: "pointer", width: "16px", height: "16px" }}
                  />
                  <label htmlFor="isPublicCheck" style={{ cursor: "pointer", margin: 0, padding: 0, display: "inline", color: "inherit", fontSize: "inherit", gap: 0 }}>
                    {t("公開する（URLシェア・QRコード有効）", "Make public (URL sharing & QR enabled)")}
                  </label>
                </div>
                {draft.isPublic && draft.publicSlug && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                    <span className="muted small" style={{ wordBreak: "break-all" }}>
                      {`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}`}
                    </span>
                    <button
                      type="button"
                      className="button secondary"
                      style={{ fontSize: "11px", padding: "2px 10px", minHeight: "auto", flexShrink: 0 }}
                      onClick={() => {
                        const url = `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}`;
                        void navigator.clipboard.writeText(url);
                      }}
                    >
                      {t("コピー", "Copy")}
                    </button>
                  </div>
                )}
              </div>

              {/* アバター画像アップロード */}
              <div style={{ fontSize: "13px", color: "var(--muted)", display: "grid", gap: "6px" }}>
                <span>{t("プロフィール画像", "Profile photo")}</span>
                <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                  <div className="avatar" style={{ flexShrink: 0, width: "48px", height: "48px", fontSize: "18px" }}>
                    {draft.avatarSrc
                      // eslint-disable-next-line @next/next/no-img-element
                      ? <img src={draft.avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} />
                      : <span>{initialOf(draft.patternName)}</span>
                    }
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    <label className="file-button" style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto" }}>
                      <span>{t("画像を選ぶ", "Choose photo")}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handleAvatarUpload(f);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
                    {draft.avatarSrc && (
                      <button
                        type="button"
                        className="button secondary"
                        style={{ fontSize: "12px", padding: "4px 10px", minHeight: "auto", color: "var(--pink)" }}
                        onClick={() => applyAndSave({ ...draft, avatarSrc: null })}
                      >
                        {t("削除", "Remove")}
                      </button>
                    )}
                  </div>
                </div>
                <p className="muted small" style={{ margin: 0 }}>
                  {t("最大512px・JPEGに変換して保存", "Resized to 512px max, saved as JPEG")}
                </p>
              </div>
            </div>
          )}
        </div>
      )}


      {/* メインワークスペース: data-tab をCSSで参照してカード/パネルの表示制御 */}
      <div className="editor-workspace" data-tab={activeTab}>

        {/* プロフィールカード / QRカード */}
        <div className="editor-card-area">
          {draft && activeTab === "qr" ? (
            <div className="editor-card-wrap">
              {renderQrCardView()}
              {/* QRカードをダウンロード・シェア */}
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button
                  type="button"
                  className="button"
                  style={{ flex: 1, minHeight: "40px", fontSize: "13px" }}
                  onClick={() => void handleQrCardSave()}
                  disabled={qrExporting}
                >
                  {qrExporting ? t("生成中…", "Generating…") : "💾 " + t("QRカードを保存", "Save QR card")}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  style={{ flex: 1, minHeight: "40px", fontSize: "13px" }}
                  onClick={() => void handleQrCardShare()}
                  disabled={qrExporting}
                >
                  {qrExporting ? "…" : "📤 " + t("シェア", "Share")}
                </button>
              </div>
              {qrExportError && <p className="error-text" style={{ margin: "6px 0 0" }}>{qrExportError}</p>}
            </div>
          ) : draft ? (
            <div className="editor-card-wrap">
              <div
                className={`profile-paper theme-${draft.themeId || "default"}${draft.frameId && draft.frameId !== "none" ? " has-image-frame" : ""}`}
                ref={paperRef}
                onClick={onPaperClick}
                onPointerMove={onPaperPointerMove}
                onPointerUp={onPaperPointerUp}
                style={{
                  cursor: "default", userSelect: "none",
                  ...(draft.frameId && draft.frameId !== "none"
                    ? { "--frame-url": `url('/frame/${draft.frameId}')` } as React.CSSProperties
                    : {}),
                }}
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
                      <img src={resolveStickerSrc(s.stickerId)} alt=""
                        style={{ width: "100%", display: "block", pointerEvents: "none" }} />
                    </div>
                  );
                })}

                {/* プロフィール内容 */}
                <div className="profile-content">
                  <header className="profile-head">
                    {/* アバター：クリック／タップで画像アップロード */}
                    <label className="avatar avatar-upload" title={t("タップして画像を変更", "Tap to change photo")}>
                      {draft.avatarSrc
                        ? <img src={draft.avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> // eslint-disable-line @next/next/no-img-element
                        : <span>{initialOf(draft.patternName)}</span>
                      }
                      <span className="avatar-upload-overlay">
                        <span>📷</span>
                        <span>{t("タップして\n変更", "Tap to\nchange")}</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) void handleAvatarUpload(f);
                          e.currentTarget.value = "";
                        }}
                      />
                    </label>
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
            {/* デスクトップ用タブ（プレビュータブは不要なので除外） */}
            <div className="editor-panel-tabs">
              {DESKTOP_TABS.map((tab) => (
                <button key={tab.id} type="button"
                  className={`editor-panel-tab${activeTab === tab.id ? " active" : ""}`}
                  onClick={() => setActiveTab(tab.id)}>
                  <span>{tab.icon}</span>
                  <span>{t(tab.labelJa, tab.labelEn)}</span>
                </button>
              ))}
            </div>
            <div className="editor-panel-content">
              {/* デスクトップでプレビュータブのまま来た場合は項目を表示 */}
              {(activeTab === "stickers")                           && renderStickerPanel()}
              {(activeTab === "frame")                              && renderFramePanel()}
              {(activeTab === "qr")                                 && renderQrPanel()}
              {(activeTab === "settings" || activeTab === "preview") && renderSettingsPanel()}
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

      {/* ── パターン追加モーダル ─────────────────────────────────────────── */}
      {showAddModal && (
        <div className="qr-overlay" onClick={() => setShowAddModal(false)} role="dialog" aria-modal="true">
          <div className="qr-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "360px" }}>
            <button type="button" className="qr-modal-close" onClick={() => setShowAddModal(false)} aria-label="閉じる">
              ×
            </button>
            <p className="qr-modal-label">{t("パターンを追加", "Add pattern")}</p>
            <p className="muted small" style={{ margin: "0 0 16px", lineHeight: 1.7 }}>
              {t(
                "パターンごとにデザインやシール、表示項目を変えられます。友達用と仕事用を切り分けたり、イベントごとに使い分けることができます。",
                "Each pattern can have its own design, stickers, and fields. Great for separating friends vs. work, or event-specific profiles."
              )}
            </p>
            <label style={{ display: "grid", gap: "6px", fontSize: "13px", color: "var(--muted)" }}>
              {t("パターン名", "Pattern name")}
              <input
                value={newPatternName}
                onChange={(e) => setNewPatternName(e.target.value)}
                placeholder={t("例：友達、仕事、推し活", "e.g. Friends, Work, Hobbies")}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    void handleCreate(newPatternName);
                    setShowAddModal(false);
                  }
                }}
                autoFocus
              />
            </label>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="button"
                style={{ flex: 1 }}
                disabled={busy === "create"}
                onClick={() => {
                  void handleCreate(newPatternName);
                  setShowAddModal(false);
                }}
              >
                {busy === "create" ? t("追加中...", "Adding...") : t("追加する", "Add")}
              </button>
              <button type="button" className="button secondary" onClick={() => setShowAddModal(false)}>
                {t("キャンセル", "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── フレーム確認モーダル ──────────────────────────────────────────── */}
      {frameConfirmOpen && frameConfirmData && draft && (
        <div className="frame-confirm-backdrop" onClick={handleFrameCancel} role="dialog" aria-modal="true">
          <div className="frame-confirm-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="qr-modal-close" onClick={handleFrameCancel} aria-label="閉じる">×</button>
            <p className="qr-modal-label" style={{ marginBottom: "12px" }}>
              {t("こんな感じでいいですか？", "Does this look good?")}
            </p>
            <div className="frame-confirm-preview-wrap">
              {renderCardPreview({ ...draft, themeId: frameConfirmData.themeId, frameId: frameConfirmData.frameId })}
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "16px" }}>
              <button
                type="button"
                className="button"
                style={{ flex: 1 }}
                onClick={handleFrameConfirm}
              >
                {t("これにする", "Apply")}
              </button>
              <button type="button" className="button secondary" onClick={handleFrameCancel}>
                {t("キャンセル", "Cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── シール選択モーダル ────────────────────────────────────────────── */}
      {stickerModalOpen && (() => {
        const stickerChoices = [
          ...customStickers.map((sticker) => ({
            id: sticker.assetSrc,
            label: sticker.label,
            src: sticker.assetSrc,
            source: "custom" as const,
          })),
          ...STAMP_FILES.map((file) => ({
            id: file,
            label: fileToLabel(file),
            src: `/stamp/${file}`,
            source: "preset" as const,
          })),
        ];
        const PER_PAGE   = 16;
        const totalPages = Math.ceil(stickerChoices.length / PER_PAGE);
        const page       = Math.min(stickerModalPage, totalPages - 1);
        const pageItems  = stickerChoices.slice(page * PER_PAGE, (page + 1) * PER_PAGE);
        return (
          <div className="sticker-picker-backdrop" onClick={() => setStickerModalOpen(false)} role="dialog" aria-modal="true">
            <div className="sticker-picker-modal" onClick={(e) => e.stopPropagation()}>
              <div className="sticker-picker-header">
                <strong>{t("シールを選ぶ", "Pick a sticker")}</strong>
                <button
                  type="button"
                  className="qr-modal-close"
                  style={{ position: "static", margin: 0 }}
                  onClick={() => setStickerModalOpen(false)}
                  aria-label="閉じる"
                >
                  ×
                </button>
              </div>
              <div className="sticker-picker-grid">
                {pageItems.map((sticker) => (
                  <button
                    key={`${sticker.source}:${sticker.id}`}
                    type="button"
                    className="sticker-choice"
                    onClick={() => handleAddStickerWithToast(sticker.id)}
                    title={sticker.label}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={sticker.src} alt={sticker.label}
                      style={{ width: "52px", height: "52px", objectFit: "contain" }} />
                    <span className="muted small" style={{ fontSize: "10px", lineHeight: 1.2 }}>
                      {sticker.source === "custom" ? `${sticker.label}★` : sticker.label}
                    </span>
                  </button>
                ))}
              </div>
              {totalPages > 1 && (
                <div className="sticker-picker-pagination">
                  <button
                    type="button"
                    className="button secondary"
                    style={{ minHeight: "auto", padding: "4px 14px" }}
                    disabled={page === 0}
                    onClick={() => setStickerModalPage(page - 1)}
                  >
                    ← {t("前へ", "Prev")}
                  </button>
                  <span className="muted small">{page + 1} / {totalPages}</span>
                  <button
                    type="button"
                    className="button secondary"
                    style={{ minHeight: "auto", padding: "4px 14px" }}
                    disabled={page >= totalPages - 1}
                    onClick={() => setStickerModalPage(page + 1)}
                  >
                    {t("次へ", "Next")} →
                  </button>
                </div>
              )}
              <p className="muted small" style={{ margin: "8px 0 0", textAlign: "center", fontSize: "12px" }}>
                {t("複数貼れます。終わったら × で閉じてください", "You can add multiple. Close with × when done.")}
              </p>
            </div>
          </div>
        );
      })()}

      {/* ── シール貼り付きトースト ────────────────────────────────────────── */}
      {stickerToast && (
        <div className="sticker-toast" role="status" aria-live="polite">
          🏷 {t("シールをはりました", "Sticker added!")}
        </div>
      )}

      {templatePickerOpen && (
        <TemplatePickerModal
          onClose={() => setTemplatePickerOpen(false)}
          onAdd={addTemplateToPattern}
        />
      )}
    </div>
  );
}
