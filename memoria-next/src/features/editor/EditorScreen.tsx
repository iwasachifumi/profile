"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { toPng } from "html-to-image";
import { profilesApi } from "@/api/profiles";
import { settingsApi } from "@/api/settings";
import { stickerGiftsApi } from "@/api/stickerGifts";
import { PLAN_LIMITS } from "@/config/planLimits";
import AuthScreen from "@/features/auth/AuthScreen";
import QrModal from "@/features/qr/QrModal";
import { useSession } from "@/store/session";
import { useLang } from "@/store/language";
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
    { id: crypto.randomUUID(), label: "ハンドル",     value: p.handle ? `@${p.handle}` : "" },
  ];
}

/** 新規プロフィールのデフォルト構造（初回自動作成・手動追加で共用） */
function buildDefaultProfile(name: string): Profile {
  const mf = (groupId: string, label: string, value: string): Field =>
    ({ id: crypto.randomUUID(), groupId, label, value, visible: true });
  return {
    id: crypto.randomUUID(), publicSlug: null, handle: null, isPublic: false,
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

type Tab = "preview" | "settings" | "qr" | "stickers" | "frame" | "friends";
type BusyKind = "load" | "create" | "save" | "delete" | null;

// モバイルフッタ用（プレビュータブを先頭に追加）
const TABS: { id: Tab; icon: string; labelJa: string; labelEn: string }[] = [
  { id: "preview",  icon: "👁",  labelJa: "プレビュー", labelEn: "Preview"  },
  { id: "settings", icon: "📝", labelJa: "項目",       labelEn: "Fields"   },
  { id: "qr",       icon: "🎴", labelJa: "QRカード",   labelEn: "QR Card"  },
  { id: "stickers", icon: "🏷",  labelJa: "シール",     labelEn: "Stickers" },
  { id: "frame",    icon: "🖼",  labelJa: "フレーム",   labelEn: "Frame"    },
  { id: "friends",  icon: "👥",  labelJa: "友達",       labelEn: "Friends"  },
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
  const [savedRecently,      setSavedRecently]      = useState(false);
  const [editingLabelId,     setEditingLabelId]     = useState<string | null>(null);
  const [editingLinkId,      setEditingLinkId]      = useState<string | null>(null);
  const [giftToHandle,       setGiftToHandle]       = useState("");
  const [giftStickerSrc,     setGiftStickerSrc]     = useState("");
  const [giftBusy,           setGiftBusy]           = useState(false);
  const [giftNotice,         setGiftNotice]         = useState<string | null>(null);
  const [giftInbox,          setGiftInbox]          = useState<StickerGiftInboxItem[]>([]);
  const [giftInboxBusy,      setGiftInboxBusy]      = useState(false);
  const [qrOpen,             setQrOpen]             = useState(false);
  const [metaOpen,           setMetaOpen]           = useState(false);
  const [showAddModal,       setShowAddModal]        = useState(false);
  const [newPatternName,     setNewPatternName]      = useState("");
  const [frameConfirmOpen,   setFrameConfirmOpen]   = useState(false);
  const [frameConfirmData,   setFrameConfirmData]   = useState<{ themeId: string; frameId: string } | null>(null);
  const [stickerModalOpen,   setStickerModalOpen]   = useState(false);
  const [stickerModalPage,   setStickerModalPage]   = useState(0);
  const [stickerToast,       setStickerToast]       = useState(false);

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

  const paperRef       = useRef<HTMLDivElement>(null);
  const dragState      = useRef<{ idx: number } | null>(null);
  const autoSaveTimer  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestDraft    = useRef<Profile | null>(null);  // stale-closure guard for drag
  const toastTimer     = useRef<ReturnType<typeof setTimeout> | null>(null);
  const qrCardRef      = useRef<HTMLDivElement>(null);
  const qrCardWrapRef  = useRef<HTMLDivElement>(null);
  const qrDragState    = useRef<{ idx: number } | null>(null);
  const qrAutoSaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const initDraftIdRef  = useRef<string | null>(null);  // prevents re-init on same profile
  const [qrCardScale,  setQrCardScale]  = useState(1);

  // keep latestDraft in sync
  useEffect(() => { latestDraft.current = draft; }, [draft]);

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

    // ── 初回ログイン: プロフィールが 0 件なら自動作成 ─────────────────────
    if (res.data.length === 0) {
      const newProfile = buildDefaultProfile("プロフィール");
      const createRes  = await profilesApi.create(newProfile);
      setBusy(null);
      if (!createRes.ok) { setError(createRes.error); return; }
      setProfiles([newProfile]);
      setActiveId(newProfile.id);
      setDraft(cloneProfile(newProfile));
      setActiveTab("settings");
      setMetaOpen(true);
      return;
    }

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

  // ── 公開・QR ──────────────────────────────────────────────────────────────

  function handleTogglePublic(makePublic: boolean) {
    if (!draft) return;
    // 公開にする場合、slug が未設定ならランダム生成（10文字英数字）
    const slug = makePublic && !draft.publicSlug
      ? crypto.randomUUID().replace(/-/g, "").slice(0, 10)
      : draft.publicSlug;
    applyAndSave({ ...draft, isPublic: makePublic, publicSlug: slug });
  }

  // ── Field ops ─────────────────────────────────────────────────────────────

  function updateField(id: string, patch: Partial<Field>) {
    if (!draft) return;
    applyAndSave({ ...draft, fields: draft.fields.map((f) => f.id === id ? { ...f, ...patch } : f) });
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
  async function handleCustomStickerUpload(file: File) {
    if (!planLimits.customStickerUpload) {
      setError(t("Pro plan required for custom sticker upload.", "Pro plan required for custom sticker upload."));
      return;
    }
    try {
      const assetSrc = await readFileAsDataUrl(file);
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
      setError(t("Failed to load the sticker image.", "Failed to load the sticker image."));
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
    if (qrAutoSaveTimer.current) clearTimeout(qrAutoSaveTimer.current);
    qrAutoSaveTimer.current = setTimeout(() => {
      if (!draft) return;
      const config = { templateFile: template, items, cardStickers: stickers };
      void profilesApi.update(draft.id, { cardConfig: config });
      setProfiles((prev) => prev.map((p) => p.id === draft.id ? { ...p, cardConfig: config } : p));
    }, 700);
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
    qrDragState.current = { idx };
  }

  function onQrCardPointerMove(e: React.PointerEvent) {
    const ds = qrDragState.current;
    if (!ds || !qrCardRef.current) return;
    e.preventDefault();
    const rect = qrCardRef.current.getBoundingClientRect();
    const x = clamp(((e.clientX - rect.left) / rect.width)  * 100, 0, 92);
    const y = clamp(((e.clientY - rect.top)  / rect.height) * 100, 0, 92);
    setQrCardStickers((prev) => prev.map((s, i) => i === ds.idx ? { ...s, x, y } : s));
  }

  function onQrCardPointerUp() {
    if (!qrDragState.current) return;
    qrDragState.current = null;
    scheduleQrConfigSave(qrTemplateFile, qrItems, qrCardStickers);
  }

  async function generateQrPng(): Promise<string> {
    if (!qrCardRef.current) throw new Error("no card ref");
    setQrSelectedStickerIdx(null);
    await new Promise((r) => setTimeout(r, 80));
    return toPng(qrCardRef.current, { pixelRatio: 2, cacheBust: true });
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
      <div className={`profile-paper theme-${d.themeId || "default"}`} style={{ position: "relative" }}>
        <div className="paper-lines" />
        {d.frameId && d.frameId !== "none" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`/frame/${d.frameId}`} alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", pointerEvents: "none", zIndex: 1 }} />
        )}
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

  function renderQrCardView() {
    if (!draft) return null;
    const qrUrl = draft.isPublic && draft.publicSlug
      ? `${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}?via=qr`
      : "https://profile.ac7.co.jp";
    const avatarInitial = (qrItems[0]?.value || draft.patternName || "?")[0].toUpperCase();
    return (
      /* コンテナ: 実幅を ResizeObserver で計測してスケール係数を決定 */
      <div ref={qrCardWrapRef} style={{ width: "100%", overflow: "hidden" }}>
        {/* スケール用ラッパー: transform-origin top left で縮小するとcollapse対策に高さも明示 */}
        <div style={{
          width: 480 * qrCardScale,
          height: 290 * qrCardScale,
          position: "relative",
        }}>
        <div
          ref={qrCardRef}
          className="qr-card-paper"
          style={{ touchAction: "none", transform: `scale(${qrCardScale})`, transformOrigin: "top left", position: "absolute" }}
          onPointerMove={onQrCardPointerMove}
          onPointerUp={onQrCardPointerUp}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest("[data-sticker-el]")) return;
            setQrSelectedStickerIdx(null);
          }}
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
                  margin: "1px 0", lineHeight: 1.3, textShadow: "0 1px 2px rgba(0,0,0,.5)",
                  color:    item.color    ?? "#ffffff",
                  fontSize: item.fontSize ?? 11,
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
          {qrCardStickers.map((s, idx) => {
            const sz    = Math.round(52 * (s.scale ?? 1));
            const isSel = qrSelectedStickerIdx === idx;
            const src   = s.stickerId.startsWith("data:") ? s.stickerId : `/stamp/${s.stickerId}`;
            return (
              <div
                key={s.id} data-sticker-el="1"
                className={`placed-sticker${isSel ? " selected" : ""}`}
                style={{ left: `${s.x}%`, top: `${s.y}%`, width: `${sz}px`, cursor: "grab", touchAction: "none", zIndex: 10 }}
                onPointerDown={(e) => onQrStickerPointerDown(e, idx)}
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
        </div> {/* /scale wrapper */}
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
            ⚠️ このプロフィールは非公開です。QRコードを有効にするには「項目」タブから公開設定してください。
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
            <button type="button" className="icon-button mini-button" onClick={handleAddQrItem}>＋</button>
          </div>
          <div className="stack" style={{ gap: "8px" }}>
            {qrItems.map((item) => (
              <div key={item.id} className="qr-item-row">
                {/* 行1: ラベル + 内容 + 削除ボタン */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr auto", gap: "4px", alignItems: "center" }}>
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
                  <button type="button" className="icon-button"
                    style={{ color: "var(--pink)", flexShrink: 0, minHeight: "auto", padding: "2px 6px" }}
                    onClick={() => handleDeleteQrItem(item.id)}>×</button>
                </div>
                {/* 行2: 文字色 + 文字サイズ */}
                <div style={{ display: "flex", gap: "8px", alignItems: "center", paddingLeft: "2px" }}>
                  <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--muted)" }}>
                    {t("色", "Color")}
                    <input
                      type="color"
                      value={item.color ?? "#ffffff"}
                      style={{ width: "28px", height: "22px", padding: "1px", border: "1px solid var(--line)", borderRadius: "4px", cursor: "pointer" }}
                      onChange={(e) => handleUpdateQrItem(item.id, { color: e.target.value })}
                    />
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--muted)" }}>
                    {t("サイズ", "Size")}
                    <select
                      value={item.fontSize ?? 11}
                      style={{ fontSize: "11px", padding: "1px 2px" }}
                      onChange={(e) => handleUpdateQrItem(item.id, { fontSize: Number(e.target.value) })}
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
        </div>

        {/* 保存・シェア・X */}
        {qrExportError && <p className="error-text" style={{ margin: 0 }}>{qrExportError}</p>}

        {/* SNS シェア行 */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleQrXShare()}
            disabled={qrExporting || !draft?.isPublic}
            title={draft?.isPublic ? undefined : t("公開設定が必要です", "Make profile public first")}>
            {qrExporting ? t("生成中…", "…") : "𝕏 でシェア"}
          </button>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleQrCopyUrl()}
            disabled={qrExporting || !draft?.isPublic}>
            {qrCopied ? "✓ " + t("コピー済み", "Copied!") : "🔗 " + t("URLをコピー", "Copy URL")}
          </button>
        </div>

        {/* PNG保存・端末シェア行 */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="button" className="button secondary" style={{ flex: 1 }}
            onClick={() => void handleQrCardSave()} disabled={qrExporting}>
            {qrExporting ? t("生成中…", "Generating…") : "💾 PNG保存"}
          </button>
          <button type="button" className="button" style={{ flex: 1 }}
            onClick={() => void handleQrCardShare()} disabled={qrExporting}>
            {qrExporting ? t("生成中…", "Generating…") : "📤 シェア"}
          </button>
        </div>

        {!draft?.isPublic && (
          <p className="muted small" style={{ margin: 0, fontSize: "11px" }}>
            ⚠️ {t("X/URLシェアには公開設定が必要です（「項目」タブから）", "Publish your profile to enable X share & URL copy")}
          </p>
        )}
        <p className="muted small" style={{ margin: 0, textAlign: "center", fontSize: "11px" }}>
          {t("シェア・保存時にOG画像が自動生成されます", "OG image is auto-generated on share/save")}
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
          <strong>{t("Custom sticker", "Custom sticker")}</strong>
          {planLimits.customStickerUpload ? (
            <label className="file-button">
              <span>{t("Upload image", "Upload image")}</span>
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
              {t("Pro plan can upload custom sticker images.", "Pro plan can upload custom sticker images.")}
            </p>
          )}
        </div>
        <div className="sticker-upload-box">
          <strong>{t("シールをあげる", "Gift sticker")}</strong>
          {planLimits.customStickerUpload && customStickers.length > 0 ? (
            <div className="stack" style={{ gap: "6px" }}>
              <label style={{ display: "grid", gap: "4px" }}>
                <span className="muted small">{t("贈るシール", "Sticker")}</span>
                <select
                  value={giftStickerSrc}
                  onChange={(e) => setGiftStickerSrc(e.target.value)}
                  disabled={giftBusy}
                >
                  <option value="">{t("選択してください", "Select sticker")}</option>
                  {customStickers.map((sticker) => (
                    <option key={sticker.id} value={sticker.assetSrc}>
                      {sticker.label}
                    </option>
                  ))}
                </select>
              </label>
              <label style={{ display: "grid", gap: "4px" }}>
                <span className="muted small">{t("相手のhandle", "Recipient handle")}</span>
                <input
                  value={giftToHandle}
                  placeholder="@handle"
                  onChange={(e) => setGiftToHandle(e.target.value)}
                  disabled={giftBusy}
                />
              </label>
              <button
                type="button"
                className="button secondary"
                onClick={() => void handleSendStickerGift()}
                disabled={giftBusy}
              >
                {giftBusy ? t("送信中...", "Sending...") : t("シールを送る", "Send sticker")}
              </button>
            </div>
          ) : (
            <p className="muted small" style={{ margin: 0 }}>
              {t("カスタムシールを持っているProユーザーが利用できます。", "Available for pro users with custom stickers.")}
            </p>
          )}
          {giftNotice && <p className="muted small" style={{ margin: 0 }}>{giftNotice}</p>}
        </div>
        <div className="sticker-upload-box">
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
        </div>
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

        {/* ── パターン選択＆基本情報アコーディオン ──────────────────────── */}
        <div className="pattern-meta-block">
          {/* ヘッダー行: ▼パターン名 / 複数時はselectも / ＋ボタン */}
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
                  {t("パターン名", "Pattern")}：{draft.patternName}
                </span>
              )}
            </button>
            <button
              type="button"
              className="icon-button mini-button"
              onClick={() => { setNewPatternName(""); setShowAddModal(true); }}
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

        {/* 公開・QRコード */}
        <div className="meta-block" style={{
          background: "linear-gradient(135deg, #f0fff8 0%, #eaf4ff 100%)",
          borderColor: "#9ecfba",
        }}>
          <p className="meta-block-title" style={{ color: "#2f7568" }}>
            {t("公開・QRコード", "Public & QR")}
          </p>
          {draft.isPublic && draft.publicSlug ? (
            <div className="stack" style={{ gap: "8px" }}>
              <p className="muted small" style={{ margin: 0 }}>
                {t("公開中", "Public")}:{" "}
                <a
                  href={`/profile/${draft.publicSlug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ color: "var(--blue)", fontSize: "12px" }}
                >
                  /profile/{draft.publicSlug}
                </a>
              </p>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="button"
                  onClick={() => setQrOpen(true)}
                  style={{ flex: 1 }}
                >
                  📲 {t("QRコードを表示", "Show QR code")}
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => handleTogglePublic(false)}
                >
                  {t("非公開にする", "Make private")}
                </button>
              </div>
            </div>
          ) : (
            <div className="stack" style={{ gap: "6px" }}>
              <p className="muted small" style={{ margin: 0 }}>
                {t(
                  "公開するとQRコードでプロフ交換ができます",
                  "Go public to share your profile via QR code"
                )}
              </p>
              <button
                type="button"
                className="button"
                onClick={() => handleTogglePublic(true)}
              >
                🔓 {t("公開してQRコードを使う", "Make public & use QR")}
              </button>
            </div>
          )}
        </div>

        {/* フィールド */}
        <div>
          <h3 style={{ margin: "0 0 8px", fontSize: "14px" }}>{t("プロフィール項目", "Profile fields")}</h3>
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
              onClick={() => { setNewPatternName(""); setShowAddModal(true); }}
              disabled={busy === "create"}
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

      {/* メインワークスペース: data-tab をCSSで参照してカード/パネルの表示制御 */}
      <div className="editor-workspace" data-tab={activeTab}>

        {/* プロフィールカード / QRカード */}
        <div className="editor-card-area">
          {draft && activeTab === "qr" ? (
            <div className="editor-card-wrap">
              {renderQrCardView()}
            </div>
          ) : draft ? (
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
                      <img src={resolveStickerSrc(s.stickerId)} alt=""
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
                    <div className="avatar">
                      {draft.avatarSrc
                        ? <img src={draft.avatarSrc} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" }} /> // eslint-disable-line @next/next/no-img-element
                        : <span>{initialOf(draft.patternName)}</span>
                      }
                    </div>
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
              {(activeTab === "friends")                            && renderFriendsPanel()}
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

      {/* ── QRコードモーダル ─────────────────────────────────────────────── */}
      {qrOpen && draft?.isPublic && draft?.publicSlug && (
        <QrModal
          url={`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/profile/${draft.publicSlug}?via=qr`}
          patternName={draft.patternName}
          profile={draft}
          onClose={() => setQrOpen(false)}
        />
      )}

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
    </div>
  );
}
