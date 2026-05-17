import { loadStampStickers } from './utils.js';

export const FIELD_GROUPS = [
  { id: "basic", name: "基本" },
  { id: "work", name: "仕事・活動" },
  { id: "favorite", name: "好きなもの" },
  { id: "conversation", name: "話しかけてほしいこと" },
  { id: "free", name: "自由項目" }
];
export const DEFAULT_GROUP_IDS = new Set(FIELD_GROUPS.map((group) => group.id));

export const LINK_TYPES = [
  { id: "website", name: "Web" },
  { id: "x", name: "X" },
  { id: "instagram", name: "Instagram" },
  { id: "github", name: "GitHub" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "other", name: "その他" }
];

export const THEMES = [
  { id: "friends", name: "友達用ノート", description: "手書きメモとプロフ帳の懐かしさを出す台紙。", free: true },
  { id: "business", name: "ビジネス整理帳", description: "展示会や商談後にも見返しやすい落ち着いた台紙。", free: true },
  { id: "study", name: "勉強会グリーン", description: "コミュニティや勉強会向けのやわらかい台紙。", free: false },
  { id: "pink", name: "ピンク台紙", description: "かわいく飾るための有料台紙。", free: false }
];

export const PAPER_FRAMES = [
  {
    id: "none",
    nameJa: "標準",
    nameEn: "Default",
    descriptionJa: "枠なし",
    descriptionEn: "No frame",
    src: "",
    slice: { top: 0, right: 0, bottom: 0, left: 0 },
    width: 0,
    repeat: "stretch",
    free: true
  },
  {
    id: "ribbon_top_red",
    nameJa: "リボン枠",
    nameEn: "Ribbon Top",
    descriptionJa: "上部リボン付き",
    descriptionEn: "Top ribbon frame",
    src: "frame/f1165_2.png",
    slice: { top: 120, right: 18, bottom: 18, left: 18 },
    width: 18,
    repeat: "stretch",
    free: true
  },
  {
    id: "ribbon_corner_gold",
    nameJa: "コーナーリボン",
    nameEn: "Corner Ribbon",
    descriptionJa: "四隅リボン",
    descriptionEn: "Ribbon corners",
    src: "frame/f0385_1.png",
    slice: { top: 24, right: 24, bottom: 24, left: 24 },
    width: 20,
    repeat: "stretch",
    free: true
  },
  {
    id: "pink_kira_frame",
    nameJa: "きらきらピンク",
    nameEn: "Pink Sparkle",
    descriptionJa: "ピンク星飾り",
    descriptionEn: "Pink sparkle frame",
    src: "frame/okumonof_kiraf523-1536x864.png",
    slice: { top: 84, right: 84, bottom: 84, left: 84 },
    width: 22,
    repeat: "stretch",
    free: true
  }
];

export const STICKERS = [
  { id: "hello", label: "SMILE", className: "sticker-blue", color: "#dcecff", source: "free", owned: true, variant: "smile" },
  { id: "met", label: "HEART", className: "sticker-green", color: "#ffd7e7", source: "free", owned: true, variant: "heart" },
  { id: "event", label: "仲良し!", className: "sticker-tape", color: "#ffe8b0", source: "event", owned: true, variant: "friends" },
  { id: "spark", label: "KAWAII!", className: "sticker-pink", color: "#ffdcea", source: "paid", owned: false, variant: "kawaii" },
  { id: "note", label: "PHOTO", className: "sticker-tape", color: "#ffd2ee", source: "paid", owned: false, variant: "heart_frame" }
];

STICKERS.push(
  { id: "cat_01", label: "CAT", className: "sticker-pink", color: "#ffe2ef", source: "free", owned: true, variant: "emoji", emoji: "🐱" },
  { id: "cat_02", label: "CAT CUTE", className: "sticker-blue", color: "#e5f0ff", source: "paid", owned: false, variant: "emoji", emoji: "😺" },
  { id: "apple_01", label: "APPLE", className: "sticker-tape", color: "#ffe6ea", source: "free", owned: true, variant: "emoji", emoji: "🍎" },
  { id: "apple_02", label: "GREEN APPLE", className: "sticker-green", color: "#e7f8dc", source: "event", owned: true, variant: "emoji", emoji: "🍏" },
  { id: "dog_01", label: "DOG", className: "sticker-tape", color: "#fce9cf", source: "free", owned: true, variant: "emoji", emoji: "🐶" },
  { id: "dog_02", label: "PUPPY", className: "sticker-blue", color: "#e8f2ff", source: "paid", owned: false, variant: "emoji", emoji: "🐕" },
  { id: "puppy_01", label: "BABY DOG", className: "sticker-pink", color: "#ffe5f4", source: "event", owned: true, variant: "emoji", emoji: "🦴" },
  { id: "puppy_02", label: "PAW", className: "sticker-green", color: "#ecf7ef", source: "paid", owned: false, variant: "emoji", emoji: "🐾" },
  { id: "fish_01", label: "FISH", className: "sticker-blue", color: "#e3f5ff", source: "free", owned: true, variant: "emoji", emoji: "🐟" },
  { id: "fish_02", label: "GOLDFISH", className: "sticker-tape", color: "#fff1cf", source: "event", owned: true, variant: "emoji", emoji: "🐠" },
  { id: "sun_01", label: "SUN", className: "sticker-tape", color: "#ffe9a6", source: "free", owned: true, variant: "emoji", emoji: "☀️" },
  { id: "sun_02", label: "SUNSET", className: "sticker-pink", color: "#ffdccc", source: "paid", owned: false, variant: "emoji", emoji: "🌇" },
  { id: "sunflower_01", label: "SUNFLOWER", className: "sticker-green", color: "#f1ffd8", source: "free", owned: true, variant: "emoji", emoji: "🌻" },
  { id: "sunflower_02", label: "BLOOM", className: "sticker-tape", color: "#fff0bf", source: "paid", owned: false, variant: "emoji", emoji: "🌼" },
  { id: "clown_01", label: "CLOWN", className: "sticker-pink", color: "#ffe3ee", source: "event", owned: true, variant: "emoji", emoji: "🤡" },
  { id: "clown_02", label: "WEIRD CLOWN", className: "sticker-blue", color: "#e5ebff", source: "paid", owned: false, variant: "emoji", emoji: "🎪" },
  { id: "parfait_01", label: "PARFAIT", className: "sticker-pink", color: "#ffe6f0", source: "free", owned: true, variant: "emoji", emoji: "🍨" },
  { id: "parfait_02", label: "CHOCO PARFAIT", className: "sticker-tape", color: "#ffe3c2", source: "paid", owned: false, variant: "emoji", emoji: "🍫" },
  { id: "candy_01", label: "CANDY", className: "sticker-blue", color: "#e7f0ff", source: "free", owned: true, variant: "emoji", emoji: "🍬" },
  { id: "candy_02", label: "LOLLIPOP", className: "sticker-pink", color: "#ffe0f3", source: "event", owned: true, variant: "emoji", emoji: "🍭" },
  { id: "moon_01", label: "MOON", className: "sticker-blue", color: "#e0e7ff", source: "free", owned: true, variant: "emoji", emoji: "🌙" },
  { id: "moon_02", label: "NIGHT", className: "sticker-green", color: "#e5f4ff", source: "paid", owned: false, variant: "emoji", emoji: "🌌" },
  { id: "star_01", label: "STAR", className: "sticker-tape", color: "#fff0b3", source: "free", owned: true, variant: "emoji", emoji: "⭐" },
  { id: "star_02", label: "SPARKLE", className: "sticker-pink", color: "#ffe7f6", source: "event", owned: true, variant: "emoji", emoji: "✨" },
  { id: "ribbon_01", label: "RIBBON", className: "sticker-pink", color: "#ffdff0", source: "free", owned: true, variant: "emoji", emoji: "🎀" },
  { id: "ribbon_02", label: "BOW", className: "sticker-blue", color: "#e6efff", source: "paid", owned: false, variant: "emoji", emoji: "🏷️" },
  { id: "cake_01", label: "CAKE", className: "sticker-tape", color: "#ffe6c5", source: "free", owned: true, variant: "emoji", emoji: "🍰" },
  { id: "cake_02", label: "BIRTHDAY", className: "sticker-pink", color: "#ffe0eb", source: "event", owned: true, variant: "emoji", emoji: "🎂" },
  { id: "princess_01", label: "PRINCESS", className: "sticker-pink", color: "#ffe2f7", source: "paid", owned: false, variant: "emoji", emoji: "👸" },
  { id: "princess_02", label: "TIARA", className: "sticker-tape", color: "#fff0c7", source: "event", owned: true, variant: "emoji", emoji: "👑" },
  { id: "kitten_01", label: "KITTEN", className: "sticker-green", color: "#e8f8ea", source: "free", owned: true, variant: "emoji", emoji: "🐈" },
  { id: "kitten_02", label: "BABY CAT", className: "sticker-blue", color: "#e6f0ff", source: "paid", owned: false, variant: "emoji", emoji: "😸" },
  { id: "house_01", label: "HOUSE", className: "sticker-tape", color: "#ffe9cf", source: "free", owned: true, variant: "emoji", emoji: "🏠" },
  { id: "house_02", label: "HOME SWEET", className: "sticker-green", color: "#e8f7df", source: "event", owned: true, variant: "emoji", emoji: "🏡" },
  { id: "rainbow_01", label: "RAINBOW", className: "sticker-pink", color: "#ffe5fb", source: "free", owned: true, variant: "emoji", emoji: "🌈" },
  { id: "rainbow_02", label: "CLOUD", className: "sticker-blue", color: "#e8f3ff", source: "paid", owned: false, variant: "emoji", emoji: "☁️" },
  { id: "ring_01", label: "RING", className: "sticker-tape", color: "#fff0cb", source: "event", owned: true, variant: "emoji", emoji: "💍" },
  { id: "ring_02", label: "GEM", className: "sticker-blue", color: "#e0eeff", source: "paid", owned: false, variant: "emoji", emoji: "💎" }
);

export const STICKERS_PER_PAGE = 18;

const stampStickers = loadStampStickers(window.MEMORIA_STAMP_MANIFEST);
if (stampStickers.length) {
  STICKERS.length = 0;
  STICKERS.push(...stampStickers);
}
STICKERS.forEach((sticker) => {
  sticker.owned = true;
  sticker.source = "free";
});

export const DEMO_PROFILES = [
  {
    id: "demo-study-akari",
    patternName: "勉強会用",
    audience: "勉強会",
    description: "勉強会で話しかけてもらうための公開内容。",
    themeId: "study",
    frameId: "none",
    fields: [
      { key: "displayName", group: "basic", label: "表示名", value: "佐藤あかり", visible: true },
      { key: "handle", group: "basic", label: "呼ばれ方", value: "あかりさん", visible: true },
      { key: "title", group: "work", label: "所属・肩書き", value: "フロントエンドエンジニア", visible: true },
      { key: "oneLiner", group: "basic", label: "ひとこと", value: "アクセシビリティとUI設計の話が好きです。", visible: true },
      { key: "topics", group: "conversation", label: "話したいこと", value: "React、デザインシステム、イベント運営", visible: true }
    ],
    links: [
      { id: "demo-akari-web", type: "website", label: "Portfolio", url: "https://example.com/akari", visible: true },
      { id: "demo-akari-x", type: "x", label: "X", url: "https://x.com/example", visible: true }
    ],
    stickers: [
      { id: "event", x: 70, y: 12, rotation: 6 },
      { id: "hello", x: 7, y: 78, rotation: -5 }
    ]
  },
  {
    id: "demo-business-ren",
    patternName: "ビジネス用",
    audience: "展示会",
    description: "展示会や商談で渡すための公開内容。",
    themeId: "business",
    frameId: "none",
    fields: [
      { key: "displayName", group: "basic", label: "表示名", value: "高橋レン", visible: true },
      { key: "handle", group: "basic", label: "呼ばれ方", value: "レン", visible: true },
      { key: "title", group: "work", label: "所属・肩書き", value: "SaaS事業開発", visible: true },
      { key: "oneLiner", group: "basic", label: "ひとこと", value: "現場オペレーションを軽くする仕組みを作っています。", visible: true },
      { key: "topics", group: "conversation", label: "話したいこと", value: "展示会、CRM、業務改善", visible: true }
    ],
    links: [
      { id: "demo-ren-web", type: "website", label: "Company", url: "https://example.com/ren", visible: true },
      { id: "demo-ren-linkedin", type: "linkedin", label: "LinkedIn", url: "https://linkedin.com", visible: true }
    ],
    stickers: [
      { id: "met", x: 73, y: 76, rotation: -4 }
    ]
  }
];
