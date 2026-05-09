const STORAGE_KEY = "memoria-mvp-state-v1";
const AUTH_USERS_KEY = "memoria-mvp-auth-users-v1";
const AUTH_SESSION_KEY = "memoria-mvp-auth-session-v1";
const AUTH_PREFS_KEY = "memoria-mvp-prefs-v1";
const USER_STATE_KEY_PREFIX = `${STORAGE_KEY}:user:`;
const GUEST_STATE_KEY = `${STORAGE_KEY}:guest`;
const PROFILE_BASE_URL = "https://profile.ac7.co.jp/p/";
const PLAN_LIMITS = {
  free: {
    patterns: 2,
    groups: 10,
    fields: 100,
    exchanges: 100
  },
  pro: {
    patterns: 10,
    groups: 50,
    fields: 200,
    exchanges: Number.POSITIVE_INFINITY
  }
};
const LANGUAGES = ["ja", "en"];

const I18N = {
  ja: {
    "brand.homeAria": "Memoria ホーム",
    "brand.tagline": "みんなのプロフ帳",
    "nav.aria": "メインメニュー",
    "nav.mine": "自分のページ",
    "nav.design": "台帳デザイン",
    "nav.stickers": "シール帳",
    "nav.book": "会った人",
    "nav.guide": "使い方",
    "lang.aria": "言語切替",
    "mine.title": "自分のページ",
    "mine.subtitle": "相手に渡す公開内容を用途ごとに切り替えます。",
    "mine.viewPublic": "公開ページを見る",
    "mine.pattern": "パターン",
    "mine.addPattern": "パターン追加",
    "general.title": "全般",
    "general.autosave": "保存は自動",
    "general.sharedSettings": "共通設定",
    "pattern.editorAria": "プロフィール編集",
    "pattern.edit": "パターン編集",
    "pattern.preview": "プレビュー",
    "pattern.design": "台帳デザイン",
    "pattern.stickers": "シール帳",
    "pattern.editorTitle": "パターン編集",
    "pattern.name": "パターン名",
    "pattern.audience": "公開範囲メモ",
    "pattern.description": "説明",
    "pattern.newName": "新しいプロフィール",
    "pattern.newAudience": "公開範囲",
    "tab.aria": "プロフィールパターン",
    "fields.title": "表示項目",
    "fields.none": "項目なし",
    "fields.count": "{count}件",
    "fields.edit": "項目編集",
    "fields.add": "項目追加",
    "fields.unset": "未入力",
    "groups.title": "グループ",
    "groups.edit": "グループ編集",
    "groups.addTitle": "グループ追加",
    "groups.name": "グループ名",
    "groups.placeholder": "例: 推し / イベント / 登壇情報",
    "groups.add": "追加",
    "groups.summaryAll": "すべてのパターン",
    "groups.summaryNone": "非表示",
    "group.editorTitle": "グループ編集",
    "group.visiblePatterns": "表示するパターン",
    "links.title": "リンク / SNS",
    "links.none": "リンクなし",
    "links.type": "種類",
    "links.label": "表示名",
    "links.url": "URL",
    "links.visible": "表示",
    "links.add": "追加",
    "links.remove": "削除",
    "links.placeholder": "例: X",
    "avatar.title": "プロフィール画像",
    "avatar.alt": "プロフィール画像",
    "avatar.pick": "画像をえらぶ",
    "avatar.clear": "画像をクリア",
    "avatar.help": "アップすると円形で表示されます。",
    "design.title": "台帳デザイン",
    "design.subtitle": "プロフィールパターンごとに台紙を切り替えます。",
    "design.backMine": "自分のページへ",
    "design.paper": "台紙",
    "design.preview": "プレビュー",
    "design.toStickers": "シール帳へ",
    "stickers.title": "シール帳",
    "stickers.subtitle": "所持シールを選び、台帳上で配置します。",
    "stickers.backMine": "自分のページへ",
    "stickers.panel": "シール",
    "stickers.placement": "配置",
    "stickers.drag": "ドラッグで移動",
    "stickers.free": "無料",
    "stickers.prev": "前へ",
    "stickers.next": "次へ",
    "stickers.page": "ページ {page}",
    "public.notFoundTitle": "プロフィールが見つかりません",
    "public.notFoundDesc": "ローカルMVP内に存在しないプロフィールです。",
    "public.backMine": "自分のページへ",
    "public.back": "戻る",
    "public.exchangeTitle": "交換する",
    "public.exchangeDesc": "交換帳に保存した時点で、交換日とスナップショットを残します。",
    "public.eventLabel": "会ったイベント",
    "public.eventDefault": "今日のイベント",
    "public.exchangeAgain": "交換帳にもう一度記録",
    "public.exchangeAdd": "交換帳に追加",
    "public.viewBook": "会った人を見る",
    "book.title": "会った人",
    "book.subtitle": "交換した日、交換時点の相手、話したことを残します。",
    "book.openDemo": "デモ相手を開く",
    "book.myQr": "自分のQRへ",
    "book.history": "交換履歴",
    "book.count": "{count}件",
    "book.noHistoryTitle": "まだ交換履歴がありません。",
    "book.noHistoryDesc": "デモ相手のプロフィールを開いて、交換帳に追加できます。",
    "book.selectTitle": "記録する相手を選んでください",
    "book.selectDesc": "交換すると、ここにスナップショットと自分用メモが表示されます。",
    "book.eventUnset": "イベント未設定",
    "book.cardTitle": "交換カード",
    "book.currentProfile": "現在プロフィールへ",
    "book.note": "自分用メモ",
    "book.tags": "タグ",
    "book.tagsPlaceholder": "例: React, 展示会, 次回連絡",
    "book.noteHint": "メモとタグは相手には表示しません。",
    "guide.title": "使い方",
    "guide.subtitle": "Memoriaでプロフィール交換を始める流れです。",
    "guide.openMvp": "MVPを開く",
    "guide.step1.badge": "①",
    "guide.step1.title": "自分のプロフィール帳をつくれる",
    "guide.step1.desc": "用途別パターンで公開内容を切り替えできます。友達用・ビジネス用などを作って使い分け。",
    "guide.step2.badge": "②",
    "guide.step2.title": "SNSにプロフィールを貼れる（OpenGraph対応）",
    "guide.step2.desc": "公開URLをSNSへ貼ると、カード形式でプロフィールが伝わる想定です。",
    "guide.step3.badge": "③",
    "guide.step3.title": "「みたよ」で挨拶できる",
    "guide.step3.desc": "Memoria登録者同士なら、プロフィール閲覧時に「みたよ」を送信。送った人・送られた人はそれぞれリストに記録されます。",
    "guide.step4.badge": "④",
    "guide.step4.title": "アプリ版では相互「こんにちは」",
    "guide.step4.desc": "アプリで向かい合って「こんにちは」ボタンを押すと、互いのプロフィールをその場で確認できます。",
    "modal.close": "閉じる",
    "modal.save": "保存",
    "modal.add": "追加",
    "modal.remove": "削除",
    "field.addTitle": "項目追加",
    "field.editTitle": "項目編集",
    "field.label": "ラベル",
    "field.content": "内容",
    "field.placeholderLabel": "例: 好きな服",
    "field.placeholderValue": "例: 古着とスニーカー",
    "field.newLabel": "新しい項目",
    "upgrade.pattern.title": "プロフィールパターン追加",
    "upgrade.pattern.body": "無料プランではプロフィールパターンを{limit}件まで作れます。パターン追加には有料プランが必要です。",
    "upgrade.theme.title": "有料デザイン",
    "upgrade.theme.body": "{theme} は有料プランで使える台紙です。",
    "toast.imageLoadFail": "画像の読み込みに失敗しました。",
    "toast.groupNameRequired": "グループ名を入力してください。",
    "toast.profileNotFound": "プロフィールが見つかりません。",
    "toast.exchangeAdded": "交換帳に追加しました。",
    "toast.copySuccess": "URLをコピーしました。",
    "toast.copyFail": "コピーできない環境です。URL欄からコピーしてください。",
    "display.nameFallback": "なまえ",
    "sticker.decrease": "縮小",
    "sticker.increase": "拡大",
    "sticker.remove": "削除",
    "profile.linksTitle": "リンク / SNS",
    "qr.aria": "プロフィールQRコード",
    "qr.tooLong": "QR化できるURL長を超えました。",
    "group.basic": "基本",
    "group.work": "仕事・活動",
    "group.favorite": "好きなもの",
    "group.conversation": "話しかけてほしいこと",
    "group.free": "自由項目",
    "linkType.website": "Web",
    "linkType.x": "X",
    "linkType.instagram": "Instagram",
    "linkType.github": "GitHub",
    "linkType.linkedin": "LinkedIn",
    "linkType.other": "その他",
    "theme.friends.name": "友達用ノート",
    "theme.friends.description": "手書きメモとプロフ帳の懐かしさを出す台紙。",
    "theme.business.name": "ビジネス整理帳",
    "theme.business.description": "展示会や商談後にも見返しやすい落ち着いた台紙。",
    "theme.study.name": "勉強会グリーン",
    "theme.study.description": "コミュニティや勉強会向けのやわらかい台紙。",
    "theme.pink.name": "ピンク台紙",
    "theme.pink.description": "かわいく飾るための有料台紙。"
  },
  en: {
    "brand.homeAria": "Memoria home",
    "brand.tagline": "Your book of people",
    "nav.aria": "Primary navigation",
    "nav.mine": "My Page",
    "nav.design": "Paper Design",
    "nav.stickers": "Sticker Book",
    "nav.book": "People Met",
    "nav.guide": "How It Works",
    "lang.aria": "Language switcher",
    "mine.title": "My Page",
    "mine.subtitle": "Switch public profile content by context.",
    "mine.viewPublic": "Open Public Page",
    "mine.pattern": "Pattern",
    "mine.addPattern": "Add Pattern",
    "general.title": "General",
    "general.autosave": "Auto saved",
    "general.sharedSettings": "Shared settings",
    "pattern.editorAria": "Profile editor",
    "pattern.edit": "Edit Pattern",
    "pattern.preview": "Preview",
    "pattern.design": "Paper Design",
    "pattern.stickers": "Sticker Book",
    "pattern.editorTitle": "Edit Pattern",
    "pattern.name": "Pattern Name",
    "pattern.audience": "Audience Note",
    "pattern.description": "Description",
    "pattern.newName": "New Profile",
    "pattern.newAudience": "Audience",
    "tab.aria": "Profile patterns",
    "fields.title": "Profile Fields",
    "fields.none": "No fields yet",
    "fields.count": "{count} items",
    "fields.edit": "Edit field",
    "fields.add": "Add field",
    "fields.unset": "Not set",
    "groups.title": "Groups",
    "groups.edit": "Edit group",
    "groups.addTitle": "Add Group",
    "groups.name": "Group name",
    "groups.placeholder": "e.g. Favorites / Event / Career",
    "groups.add": "Add",
    "groups.summaryAll": "All patterns",
    "groups.summaryNone": "Hidden",
    "group.editorTitle": "Edit Group",
    "group.visiblePatterns": "Visible in patterns",
    "links.title": "Links / SNS",
    "links.none": "No links",
    "links.type": "Type",
    "links.label": "Label",
    "links.url": "URL",
    "links.visible": "Show",
    "links.add": "Add",
    "links.remove": "Remove",
    "links.placeholder": "e.g. X",
    "avatar.title": "Profile Image",
    "avatar.alt": "Profile image",
    "avatar.pick": "Choose Image",
    "avatar.clear": "Clear Image",
    "avatar.help": "Uploaded image is shown as a circle.",
    "design.title": "Paper Design",
    "design.subtitle": "Switch profile paper by pattern.",
    "design.backMine": "Back to My Page",
    "design.paper": "Paper",
    "design.preview": "Preview",
    "design.toStickers": "To Sticker Book",
    "stickers.title": "Sticker Book",
    "stickers.subtitle": "Pick stickers and place them on your paper.",
    "stickers.backMine": "Back to My Page",
    "stickers.panel": "Stickers",
    "stickers.placement": "Placement",
    "stickers.drag": "Drag to move",
    "stickers.free": "Free",
    "stickers.prev": "Prev",
    "stickers.next": "Next",
    "stickers.page": "Page {page}",
    "public.notFoundTitle": "Profile Not Found",
    "public.notFoundDesc": "This profile does not exist in the local MVP.",
    "public.backMine": "Back to My Page",
    "public.back": "Back",
    "public.exchangeTitle": "Exchange",
    "public.exchangeDesc": "Saving records the date and a snapshot.",
    "public.eventLabel": "Event",
    "public.eventDefault": "Today's event",
    "public.exchangeAgain": "Record Again",
    "public.exchangeAdd": "Add to Book",
    "public.viewBook": "View People Met",
    "book.title": "People Met",
    "book.subtitle": "Keep date, snapshot, and memo from each exchange.",
    "book.openDemo": "Open Demo Profile",
    "book.myQr": "My QR",
    "book.history": "Exchange History",
    "book.count": "{count} items",
    "book.noHistoryTitle": "No exchange history yet.",
    "book.noHistoryDesc": "Open the demo profile and add one to your book.",
    "book.selectTitle": "Select a person to view details",
    "book.selectDesc": "After exchange, snapshot and memo appear here.",
    "book.eventUnset": "Event not set",
    "book.cardTitle": "Exchange Card",
    "book.currentProfile": "Open Current Profile",
    "book.note": "Private memo",
    "book.tags": "Tags",
    "book.tagsPlaceholder": "e.g. React, Conference, Follow-up",
    "book.noteHint": "Memo and tags are private to you.",
    "guide.title": "How It Works",
    "guide.subtitle": "How profile exchange works in Memoria.",
    "guide.openMvp": "Open MVP",
    "guide.step1.badge": "1",
    "guide.step1.title": "Create your own profile notebook",
    "guide.step1.desc": "Switch public content by pattern for friends, business, study groups, and more.",
    "guide.step2.badge": "2",
    "guide.step2.title": "Share profile on SNS (OpenGraph ready)",
    "guide.step2.desc": "When you paste your public URL on SNS, it is intended to show as a profile card.",
    "guide.step3.badge": "3",
    "guide.step3.title": "Say “Seen you” when viewing",
    "guide.step3.desc": "If both users are registered, viewing a profile can send a greeting. Sent and received greetings are logged in lists.",
    "guide.step4.badge": "4",
    "guide.step4.title": "Mutual “Hello” in the app",
    "guide.step4.desc": "In the app flow, both users tap “Hello” to quickly confirm each other's profiles.",
    "modal.close": "Close",
    "modal.save": "Save",
    "modal.add": "Add",
    "modal.remove": "Remove",
    "field.addTitle": "Add Field",
    "field.editTitle": "Edit Field",
    "field.label": "Label",
    "field.content": "Content",
    "field.placeholderLabel": "e.g. Favorite outfit",
    "field.placeholderValue": "e.g. Vintage + sneakers",
    "field.newLabel": "New field",
    "upgrade.pattern.title": "Add Profile Pattern",
    "upgrade.pattern.body": "Free plan allows up to {limit} profile patterns. Upgrade to add more.",
    "upgrade.theme.title": "Paid Design",
    "upgrade.theme.body": "{theme} is available on paid plans.",
    "toast.imageLoadFail": "Failed to load image.",
    "toast.groupNameRequired": "Enter a group name.",
    "toast.profileNotFound": "Profile not found.",
    "toast.exchangeAdded": "Added to exchange book.",
    "toast.copySuccess": "URL copied.",
    "toast.copyFail": "Copy unavailable. Please copy from URL field.",
    "display.nameFallback": "Name",
    "sticker.decrease": "Smaller",
    "sticker.increase": "Larger",
    "sticker.remove": "Remove",
    "profile.linksTitle": "Links / SNS",
    "qr.aria": "Profile QR code",
    "qr.tooLong": "URL is too long for QR generation.",
    "group.basic": "Basics",
    "group.work": "Work & Activity",
    "group.favorite": "Favorites",
    "group.conversation": "Topics to start with",
    "group.free": "Custom",
    "linkType.website": "Web",
    "linkType.x": "X",
    "linkType.instagram": "Instagram",
    "linkType.github": "GitHub",
    "linkType.linkedin": "LinkedIn",
    "linkType.other": "Other",
    "theme.friends.name": "Friends Note",
    "theme.friends.description": "A nostalgic paper style with handwritten vibe.",
    "theme.business.name": "Business Sheet",
    "theme.business.description": "Calm and easy to scan after events and meetings.",
    "theme.study.name": "Study Green",
    "theme.study.description": "Soft style for communities and study groups.",
    "theme.pink.name": "Pink Paper",
    "theme.pink.description": "Cute premium paper style."
  }
};

const FIELD_GROUPS = [
  { id: "basic", name: "基本" },
  { id: "work", name: "仕事・活動" },
  { id: "favorite", name: "好きなもの" },
  { id: "conversation", name: "話しかけてほしいこと" },
  { id: "free", name: "自由項目" }
];
const DEFAULT_GROUP_IDS = new Set(FIELD_GROUPS.map((group) => group.id));

const LINK_TYPES = [
  { id: "website", name: "Web" },
  { id: "x", name: "X" },
  { id: "instagram", name: "Instagram" },
  { id: "github", name: "GitHub" },
  { id: "linkedin", name: "LinkedIn" },
  { id: "other", name: "その他" }
];

const THEMES = [
  { id: "friends", name: "友達用ノート", description: "手書きメモとプロフ帳の懐かしさを出す台紙。", free: true },
  { id: "business", name: "ビジネス整理帳", description: "展示会や商談後にも見返しやすい落ち着いた台紙。", free: true },
  { id: "study", name: "勉強会グリーン", description: "コミュニティや勉強会向けのやわらかい台紙。", free: false },
  { id: "pink", name: "ピンク台紙", description: "かわいく飾るための有料台紙。", free: false }
];

const PAPER_FRAMES = [
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

const STICKERS = [
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

const STICKERS_PER_PAGE = 18;
const stampStickers = loadStampStickers(window.MEMORIA_STAMP_MANIFEST);
if (stampStickers.length) {
  STICKERS.length = 0;
  STICKERS.push(...stampStickers);
}
STICKERS.forEach((sticker) => {
  sticker.owned = true;
  sticker.source = "free";
});

const DEMO_PROFILES = [
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

let authSession = loadAuthSession();
let authModeTab = "register";
let state = loadState(authSession);
let activePatternId = state.activePatternId || state.patterns[0].id;
let activeProfileTab = state.activeProfileTab || "general";
let selectedExchangeId = state.selectedExchangeId || (state.exchanges[0] && state.exchanges[0].id);
let activeBookView = state.activeBookView || "list";
let stickerPage = state.stickerPage || 1;
let selectedStickerPatternId = "";
let selectedStickerIndex = -1;
let toastTimer = 0;

function hasActiveSession() {
  return authSession.mode === "guest" || authSession.mode === "user";
}

function stateStorageKey(session = authSession) {
  if (session.mode === "guest") return GUEST_STATE_KEY;
  if (session.mode === "user" && session.userId) return `${USER_STATE_KEY_PREFIX}${session.userId}`;
  return "";
}

function loadPreferredLanguage() {
  try {
    const raw = localStorage.getItem(AUTH_PREFS_KEY);
    if (!raw) return "ja";
    const parsed = JSON.parse(raw);
    return LANGUAGES.includes(parsed.language) ? parsed.language : "ja";
  } catch {
    return "ja";
  }
}

function savePreferredLanguage(language) {
  if (!LANGUAGES.includes(language)) return;
  try {
    localStorage.setItem(AUTH_PREFS_KEY, JSON.stringify({ language }));
  } catch {
    // ignore preference persistence errors
  }
}

function loadAuthUsers() {
  try {
    const raw = localStorage.getItem(AUTH_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((user) => user && user.id && user.email && typeof user.password === "string")
      .map((user) => ({
        id: user.id,
        email: sanitizeEmail(user.email),
        password: user.password,
        createdAt: user.createdAt || "",
        lastLoginAt: user.lastLoginAt || ""
      }));
  } catch {
    return [];
  }
}

function saveAuthUsers(users) {
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
}

function findAuthUser(userId) {
  return loadAuthUsers().find((user) => user.id === userId);
}

function loadAuthSession() {
  try {
    const raw = sessionStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return { mode: "none" };
    const parsed = JSON.parse(raw);
    if (parsed.mode === "guest") {
      return {
        mode: "guest",
        startedAt: parsed.startedAt || ""
      };
    }
    if (parsed.mode === "user" && parsed.userId) {
      const user = findAuthUser(parsed.userId);
      if (!user) return { mode: "none" };
      return {
        mode: "user",
        userId: user.id,
        email: user.email,
        lastLoginAt: user.lastLoginAt || parsed.lastLoginAt || ""
      };
    }
    return { mode: "none" };
  } catch {
    return { mode: "none" };
  }
}

function saveAuthSession(session) {
  authSession = session;
  if (!session || session.mode === "none") {
    sessionStorage.removeItem(AUTH_SESSION_KEY);
    return;
  }
  sessionStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function applyState(nextState) {
  state = normalizeState(nextState);
  activePatternId = state.activePatternId || (state.patterns[0] && state.patterns[0].id) || "";
  if (!findPattern(activePatternId) && state.patterns[0]) activePatternId = state.patterns[0].id;
  activeProfileTab = state.activeProfileTab || "general";
  if (activeProfileTab !== "general" && !findPattern(activeProfileTab)) activeProfileTab = activePatternId;
  selectedExchangeId = state.selectedExchangeId || (state.exchanges[0] && state.exchanges[0].id) || "";
  activeBookView = state.activeBookView === "detail" ? "detail" : "list";
  stickerPage = Number.isFinite(Number(state.stickerPage)) && Number(state.stickerPage) > 0 ? Number(state.stickerPage) : 1;
  selectedStickerPatternId = "";
  selectedStickerIndex = -1;
}

function currentLanguage() {
  return LANGUAGES.includes(state.language) ? state.language : "ja";
}

function translateForLanguage(key, language, vars = {}) {
  const dict = I18N[language] || I18N.ja;
  const fallback = I18N.ja[key] || key;
  let text = dict[key] || fallback;
  Object.entries(vars).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });
  return text;
}

function t(key, vars = {}) {
  return translateForLanguage(key, currentLanguage(), vars);
}

function getCurrentPlan() {
  return state.plan === "pro" ? "pro" : "free";
}

function getPlanLimit(limitKey, plan = getCurrentPlan()) {
  const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  return limits[limitKey];
}

function formatLimit(limitValue, language = currentLanguage()) {
  if (Number.isFinite(limitValue)) return String(limitValue);
  return language === "en" ? "Unlimited" : "無制限";
}

function countGroupTotal() {
  return getFieldGroups().length;
}

function countFieldTotal() {
  const fieldUids = new Set();
  state.patterns.forEach((pattern) => {
    pattern.fields.forEach((field) => {
      if (!field || field.key === "displayName") return;
      fieldUids.add(field.uid || `${field.group}:${field.label}`);
    });
  });
  return fieldUids.size;
}

function countExchangeTotal() {
  return Array.isArray(state.exchanges) ? state.exchanges.length : 0;
}

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

function getGroupLabel(group) {
  if (DEFAULT_GROUP_IDS.has(group.id)) {
    const key = `group.${group.id}`;
    const defaultName = FIELD_GROUPS.find((item) => item.id === group.id)?.name || "";
    const jaName = I18N.ja[key];
    const enName = I18N.en[key];
    if (!group.name || group.name === defaultName || group.name === jaName || group.name === enName) {
      return t(key);
    }
  }
  return group.name;
}

function getLinkTypeLabel(typeId) {
  const key = `linkType.${typeId}`;
  const translated = t(key);
  if (translated !== key) return translated;
  return getLinkType(typeId).name;
}

function getThemeName(theme) {
  const key = `theme.${theme.id}.name`;
  const translated = t(key);
  return translated === key ? theme.name : translated;
}

function getThemeDescription(theme) {
  const key = `theme.${theme.id}.description`;
  const translated = t(key);
  return translated === key ? theme.description : translated;
}

function chromeLabels(language = currentLanguage()) {
  const isEn = language === "en";
  return {
    settingsAria: isEn ? "Open settings" : "設定を開く",
    notice: isEn ? "Notice from team" : "運営からのお知らせ",
    nav: {
      mine: "my page",
      design: "Design",
      stickers: isEn ? "Stickers" : "シール",
      book: isEn ? "People" : "会った人",
      guide: isEn ? "Guide" : "使い方"
    }
  };
}

function updateChromeCopy() {
  const lang = currentLanguage();
  const labels = chromeLabels(lang);
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.textContent = t(node.dataset.i18n || "");
  });
  document.querySelectorAll("[data-nav]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const key = node.dataset.nav || "";
    if (labels.nav[key]) node.textContent = labels.nav[key];
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    node.setAttribute("aria-label", t(node.dataset.i18nAriaLabel || ""));
  });
  const settingsButton = document.querySelector(".topbar-settings");
  if (settingsButton instanceof HTMLElement) {
    settingsButton.setAttribute("aria-label", labels.settingsAria);
    settingsButton.setAttribute("title", labels.settingsAria);
  }
  const opsNotice = document.querySelector(".ops-notice");
  if (opsNotice instanceof HTMLElement) opsNotice.textContent = labels.notice;
  updateLanguageSwitch();
}

function updateLanguageSwitch() {
  const lang = currentLanguage();
  document.querySelectorAll(".lang-btn[data-language]").forEach((node) => {
    if (!(node instanceof HTMLElement)) return;
    const active = node.dataset.language === lang;
    node.classList.toggle("active", active);
    if (node instanceof HTMLButtonElement) node.setAttribute("aria-pressed", active ? "true" : "false");
  });
}

function setLanguage(language) {
  if (!LANGUAGES.includes(language) || state.language === language) return;
  state.language = language;
  savePreferredLanguage(language);
  if (hasActiveSession()) saveState();
  render();
}

window.addEventListener("hashchange", render);
document.addEventListener("input", handleInput);
document.addEventListener("change", handleChange);
document.addEventListener("click", handleClick);
document.addEventListener("pointerdown", handleStickerDrag);

render();

function defaultState() {
  const studyId = makeId("pat");
  const businessId = makeId("pat");

  return {
    plan: "free",
    language: loadPreferredLanguage(),
    activePatternId: studyId,
    activeProfileTab: "general",
    selectedExchangeId: "",
    activeBookView: "list",
    stickerPage: 1,
    groups: FIELD_GROUPS.map((group) => ({ ...group })),
    customStickers: [],
    patterns: [
      {
        id: studyId,
        patternName: "勉強会用",
        audience: "勉強会",
        description: "技術イベントやコミュニティで渡すプロフィール。",
        themeId: "friends",
        frameId: "none",
        fields: [
          { key: "displayName", group: "basic", label: "表示名", value: "なまえ", visible: true },
          { key: "handle", group: "basic", label: "呼ばれ方", value: "呼ばれたい名前", visible: true },
          { key: "title", group: "work", label: "所属・肩書き", value: "作っているもの / していること", visible: true },
          { key: "oneLiner", group: "basic", label: "ひとこと", value: "今日はこの話がしたいです。", visible: true },
          { key: "topics", group: "conversation", label: "話しかけてほしい話題", value: "Web、イベント、プロダクト", visible: true },
          { key: "favorite", group: "favorite", label: "好きなもの", value: "コーヒー、道具、散歩", visible: true }
        ],
        links: [
          { id: makeId("link"), type: "website", label: "Web", url: "https://example.com", visible: true }
        ],
        stickers: [
          { id: "hello", x: 68, y: 16, rotation: 5 }
        ]
      },
      {
        id: businessId,
        patternName: "ビジネス用",
        audience: "ビジネス",
        description: "仕事や展示会で渡すプロフィール。",
        themeId: "business",
        frameId: "none",
        fields: [
          { key: "displayName", group: "basic", label: "表示名", value: "氏名", visible: true },
          { key: "handle", group: "basic", label: "呼ばれ方", value: "名字", visible: true },
          { key: "title", group: "work", label: "所属・肩書き", value: "会社 / 役割", visible: true },
          { key: "oneLiner", group: "basic", label: "ひとこと", value: "事業や相談できることを短く書く。", visible: true },
          { key: "topics", group: "conversation", label: "話したいこと", value: "協業、導入相談、イベント情報", visible: true }
        ],
        links: [
          { id: makeId("link"), type: "website", label: "Web", url: "https://example.com/business", visible: true }
        ],
        stickers: [
          { id: "met", x: 72, y: 72, rotation: -4 }
        ]
      }
    ],
    exchanges: []
  };
}

function loadState(session = authSession) {
  const preferredLanguage = loadPreferredLanguage();
  const baseState = normalizeState(defaultState());
  baseState.language = preferredLanguage;

  const key = stateStorageKey(session);
  if (!key) return baseState;

  try {
    const storage = session.mode === "guest" ? sessionStorage : localStorage;
    let raw = storage.getItem(key);
    if (!raw && session.mode === "guest") {
      raw = localStorage.getItem(STORAGE_KEY);
    }
    if (!raw) return baseState;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed.patterns) || parsed.patterns.length === 0) return baseState;
    const merged = normalizeState({ ...baseState, ...parsed });
    merged.language = LANGUAGES.includes(merged.language) ? merged.language : preferredLanguage;
    return merged;
  } catch {
    return baseState;
  }
}

function normalizeState(nextState) {
  const savedGroups = Array.isArray(nextState.groups) ? nextState.groups : [];
  const patternIds = (nextState.patterns || []).map((pattern) => pattern.id);
  const defaultIds = DEFAULT_GROUP_IDS;
  const customGroups = savedGroups
    .filter((group) => group && group.id && group.name && !defaultIds.has(group.id))
    .map((group) => normalizeGroup(group, patternIds));

  nextState.groups = FIELD_GROUPS.map((group) => normalizeGroup(savedGroups.find((saved) => saved.id === group.id) || group, patternIds)).concat(customGroups);
  nextState.plan = nextState.plan === "pro" ? "pro" : "free";
  nextState.language = LANGUAGES.includes(nextState.language) ? nextState.language : "ja";
  nextState.patterns = nextState.patterns.map((pattern) => normalizePattern(pattern, nextState.language));
  const customStickers = Array.isArray(nextState.customStickers) ? nextState.customStickers : [];
  nextState.customStickers = customStickers
    .filter((sticker) => sticker && sticker.id && sticker.assetSrc)
    .map((sticker) => ({
      id: sticker.id,
      label: sticker.label || "Custom",
      assetSrc: sticker.assetSrc,
      source: "custom",
      className: sticker.className || "sticker-blue",
      variant: "asset",
      owned: true
    }));
  nextState.activeBookView = nextState.activeBookView === "detail" ? "detail" : "list";
  nextState.stickerPage = Number.isFinite(Number(nextState.stickerPage)) && Number(nextState.stickerPage) > 0 ? Number(nextState.stickerPage) : 1;
  return nextState;
}

function normalizeGroup(group, patternIds) {
  const savedPatternIds = Array.isArray(group.patternIds) ? group.patternIds.filter((id) => patternIds.includes(id)) : patternIds;
  return {
    id: group.id,
    name: group.name,
    patternIds: savedPatternIds.length ? savedPatternIds : patternIds
  };
}

function normalizePattern(pattern, language = "ja") {
  const linkFallback = language === "en" ? "Link" : "リンク";
  const fieldFallback = language === "en" ? "Field" : "項目";
  const audienceFallback = language === "en" ? "Audience" : "用途";
  const descriptionSuffix = language === "en" ? " profile." : "向けのプロフィール。";
  const links = Array.isArray(pattern.links) ? [...pattern.links] : [];
  const fields = (pattern.fields || [])
    .filter((field) => {
      if (field.key !== "links") return true;
      if (field.value) {
        links.push({
          id: makeId("link"),
          type: "website",
          label: field.label || linkFallback,
          url: field.value,
          visible: field.visible !== false
        });
      }
      return false;
    })
    .map((field) => ({
      uid: field.uid || field.key || makeId("fuid"),
      key: field.key || makeId("field"),
      group: field.group || guessFieldGroup(field.key),
      label: field.label || fieldFallback,
      value: field.value || "",
      visible: true
    }));

  return {
    ...pattern,
    description: pattern.description || `${pattern.audience || audienceFallback}${descriptionSuffix}`,
    frameId: getPaperFrame(pattern.frameId).id,
    fields,
    links: links.map((link) => ({
      id: link.id || makeId("link"),
      type: link.type || "website",
      label: link.label || translateForLanguage(`linkType.${link.type || "website"}`, language),
      url: link.url || "",
      visible: link.visible !== false
    })),
    stickers: Array.isArray(pattern.stickers) ? pattern.stickers : []
  };
}

function guessFieldGroup(key) {
  if (key === "title") return "work";
  if (key === "topics") return "conversation";
  if (key === "favorite") return "favorite";
  return "basic";
}

function saveState() {
  state.activePatternId = activePatternId;
  state.activeProfileTab = activeProfileTab;
  state.selectedExchangeId = selectedExchangeId || "";
  state.activeBookView = activeBookView;
  state.stickerPage = stickerPage;
  savePreferredLanguage(currentLanguage());
  const key = stateStorageKey(authSession);
  if (!key) return;
  const storage = authSession.mode === "guest" ? sessionStorage : localStorage;
  storage.setItem(key, JSON.stringify(state));
}

function render() {
  const app = document.querySelector("#app");
  const route = parseRoute();
  updateNav(route.name);
  updateChromeCopy();

  if (route.name === "profile") {
    app.innerHTML = renderPublicProfile(route.id);
    return;
  }

  if (!hasActiveSession()) {
    app.innerHTML = renderAuthGate();
    return;
  }

  if (route.name === "design") {
    app.innerHTML = renderDesign();
    return;
  }

  if (route.name === "stickers") {
    app.innerHTML = renderStickers();
    return;
  }

  if (route.name === "book") {
    app.innerHTML = renderBook();
    return;
  }

  if (route.name === "guide") {
    app.innerHTML = renderGuide();
    return;
  }

  if (route.name === "settings") {
    app.innerHTML = renderSettings();
    return;
  }

  app.innerHTML = renderMine();
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const parts = hash.split("/").filter(Boolean);
  if (parts[0] === "profile" && parts[1]) return { name: "profile", id: parts[1] };
  if (parts[0] === "design") return { name: "design" };
  if (parts[0] === "stickers") return { name: "stickers" };
  if (parts[0] === "book") return { name: "book" };
  if (parts[0] === "guide") return { name: "guide" };
  if (parts[0] === "settings") return { name: "settings" };
  return { name: "mine" };
}

function updateNav(name) {
  document.querySelectorAll("[data-nav]").forEach((node) => {
    node.classList.toggle("active", node.dataset.nav === name);
  });
}

function authCopy() {
  const isEn = currentLanguage() === "en";
  return {
    title: isEn ? "Start Memoria" : "Memoria をはじめる",
    subtitle: isEn
      ? "Sign up with email, or try first without registration."
      : "メール登録で使い始めるか、登録せずにおためし利用できます。",
    registerTab: isEn ? "Register" : "新規登録",
    loginTab: isEn ? "Login" : "ログイン",
    email: isEn ? "Email" : "メールアドレス",
    password: isEn ? "Password" : "パスワード",
    passwordConfirm: isEn ? "Confirm password" : "パスワード確認",
    registerButton: isEn ? "Create account" : "アカウント作成",
    loginButton: isEn ? "Login" : "ログイン",
    trialTitle: isEn ? "Use without registration" : "登録せずに利用する",
    trialDesc: isEn
      ? "Trial mode stores data only in this browser session on this device."
      : "おためし利用では、この端末の現在セッションにのみデータが保存されます。",
    trialButton: isEn ? "Start trial" : "おためし開始",
    soon: isEn ? "Google / Apple login will be added later." : "Google / Apple ログインは今後追加予定です。",
    localOnly: isEn ? "MVP note: account data is stored only in your browser." : "MVP注記: アカウント情報はブラウザ内保存です。"
  };
}

function renderAuthGate() {
  const copy = authCopy();
  const registerActive = authModeTab !== "login";
  return `
    <section class="auth-shell">
      <article class="panel pad auth-card stack">
        <div>
          <h1>${copy.title}</h1>
          <p class="muted">${copy.subtitle}</p>
        </div>
        <div class="auth-mode-tabs" role="tablist" aria-label="auth mode">
          <button type="button" class="auth-mode-btn ${registerActive ? "active" : ""}" data-action="auth-set-mode" data-auth-mode="register">${copy.registerTab}</button>
          <button type="button" class="auth-mode-btn ${registerActive ? "" : "active"}" data-action="auth-set-mode" data-auth-mode="login">${copy.loginTab}</button>
        </div>
        ${registerActive ? `
          <div class="auth-form stack">
            <label>${copy.email}<input type="email" data-auth-register-email autocomplete="email"></label>
            <label>${copy.password}<input type="password" data-auth-register-password autocomplete="new-password"></label>
            <label>${copy.passwordConfirm}<input type="password" data-auth-register-password-confirm autocomplete="new-password"></label>
            <button type="button" data-action="auth-register">${copy.registerButton}</button>
          </div>
        ` : `
          <div class="auth-form stack">
            <label>${copy.email}<input type="email" data-auth-login-email autocomplete="username"></label>
            <label>${copy.password}<input type="password" data-auth-login-password autocomplete="current-password"></label>
            <button type="button" data-action="auth-login">${copy.loginButton}</button>
          </div>
        `}
        <div class="auth-guest stack">
          <strong>${copy.trialTitle}</strong>
          <p class="muted small">${copy.trialDesc}</p>
          <button type="button" class="secondary" data-action="auth-start-guest">${copy.trialButton}</button>
        </div>
        <p class="muted small">${copy.soon}</p>
        <p class="muted small">${copy.localOnly}</p>
      </article>
    </section>
  `;
}

function renderMine() {
  const tabId = getActiveProfileTab();
  const pattern = tabId === "general" ? getActivePattern() : findPattern(tabId);

  return `
    <section class="section-title">
      <div>
        <h1>${t("mine.title")}</h1>
        <p class="muted">${t("mine.subtitle")}</p>
      </div>
      ${pattern ? `<a class="button secondary" href="#profile/${pattern.id}">${t("mine.viewPublic")}</a>` : ""}
    </section>

    <section class="panel pad pattern-toolbar">
      <div class="pattern-label">
        <span>${t("mine.pattern")}</span>
        <button type="button" class="icon-button" data-action="add-pattern" aria-label="${t("mine.addPattern")}" title="${t("mine.addPattern")}">+</button>
      </div>
      ${renderProfileTabs({ includeGeneral: true })}
    </section>

    ${tabId === "general" ? renderGeneralTab() : renderPatternTabEditor(pattern)}
  `;
}

function renderGeneralTab() {
  return `
    <div class="phone-workspace">
      <section class="panel pad stack phone-screen">
        ${renderGroupManager()}
      </section>
    </div>
  `;
}

function renderPatternTabEditor(pattern) {
  if (!pattern) {
    activeProfileTab = "general";
    return renderGeneralTab();
  }

  return `
    <div class="phone-workspace">
      <section class="panel pad stack phone-screen" aria-label="${t("pattern.editorAria")}">
        <div class="section-title">
          <div>
            <h2>${escapeHtml(pattern.patternName)}</h2>
            <span class="muted small">${escapeHtml(pattern.audience)} / ${escapeHtml(pattern.description)}</span>
          </div>
          <button type="button" class="icon-button" data-action="open-pattern-editor" data-pattern-id="${pattern.id}" aria-label="${t("pattern.edit")}" title="${t("pattern.edit")}">&#9998;</button>
        </div>
        ${renderPatternEditor(pattern)}
        <div class="row">
          <a class="button secondary" href="#profile/${pattern.id}">${t("pattern.preview")}</a>
          <a class="button secondary" href="#design">${t("pattern.design")}</a>
          <a class="button secondary" href="#stickers">${t("pattern.stickers")}</a>
        </div>
      </section>
    </div>
  `;
}

function renderProfileTabs(options = {}) {
  const includeGeneral = options.includeGeneral !== false;
  const active = includeGeneral ? getActiveProfileTab() : activePatternId;
  return `
    <div class="profile-tabs" role="tablist" aria-label="${t("tab.aria")}">
      ${includeGeneral ? `
        <button type="button" class="profile-tab ${active === "general" ? "active" : ""}" data-action="select-profile-tab" data-tab-id="general">
          <strong>${t("general.title")}</strong>
          <span>${t("general.sharedSettings")}</span>
        </button>
      ` : ""}
      ${state.patterns.map((pattern) => `
        <button type="button" class="profile-tab ${active === pattern.id ? "active" : ""}" data-action="select-profile-tab" data-tab-id="${pattern.id}">
          <strong>${escapeHtml(pattern.patternName)}</strong>
          <span>${escapeHtml(pattern.audience)}</span>
        </button>
      `).join("")}
    </div>
  `;
}

function renderPatternEditor(pattern) {
  return `
    <div class="stack">
      ${renderAvatarEditor(pattern)}
      ${renderFieldGroups(pattern)}
      ${renderLinksEditor(pattern)}
    </div>
  `;
}

function renderFieldEditor(pattern, field) {
  return `
    <div class="field-card">
      <div class="field-card-head">
        <strong>${escapeHtml(field.label)}</strong>
        <button type="button" class="icon-button more-button" data-action="open-field-editor" data-pattern-id="${pattern.id}" data-field-key="${field.key}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      <p>${linkify(escapeHtml(field.value || t("fields.unset")))}</p>
    </div>
  `;
}

function renderFieldGroups(pattern) {
  return `
    <div class="stack">
      <h3>${t("fields.title")}</h3>
      ${getFieldGroups().map((group) => {
        if (!isGroupVisibleForPattern(group, pattern.id)) return "";
        const fields = pattern.fields.filter((field) => field.group === group.id);
        return `
          <details class="field-group" open>
            <summary>
              <span>${escapeHtml(getGroupLabel(group))} <span class="muted small">${t("fields.count", { count: fields.length })}</span></span>
              <button type="button" class="icon-button mini-button" data-action="open-add-field" data-pattern-id="${pattern.id}" data-group-id="${group.id}" aria-label="${t("fields.add")}" title="${t("fields.add")}">+</button>
            </summary>
            <div class="field-list">
              ${fields.length ? fields.map((field) => renderFieldEditor(pattern, field)).join("") : `<p class="muted small">${t("fields.none")}</p>`}
            </div>
          </details>
        `;
      }).join("")}
    </div>
  `;
}

function renderGroupManager() {
  const groups = getFieldGroups().map((group) => ({ group, items: collectSharedFieldsByGroup(group.id) }));
  return `
    <div class="stack">
      <div class="section-title">
        <h3>${t("fields.title")}</h3>
        <button type="button" data-action="open-add-group">${t("groups.addTitle")}</button>
      </div>
      <div class="group-stack">
        ${groups.map(({ group, items }) => renderGeneralGroupBlock(group, items)).join("")}
      </div>
    </div>
  `;
}

function renderGeneralGroupBlock(group, items) {
  const summary = renderGroupPatternSummary(group);
  return `
    <details class="group-block group-accordion" open>
      <summary class="group-block-head">
        <span class="group-block-title">
          <strong>${escapeHtml(getGroupLabel(group))}</strong>
          <span class="muted small">[${escapeHtml(summary)}]</span>
        </span>
      </summary>
      <div class="group-block-actions">
        <button type="button" class="secondary mini-add-item" data-action="open-add-general-field" data-group-id="${group.id}">${t("fields.add")}</button>
        <button type="button" class="icon-button mini-button" data-action="open-group-editor" data-group-id="${group.id}" aria-label="${t("groups.edit")}" title="${t("groups.edit")}">&#9998;</button>
      </div>
      <div class="group-items">
        ${items.length ? items.map((item) => renderGeneralFieldCard(item)).join("") : `<p class="muted small">${t("fields.none")}</p>`}
      </div>
    </details>
  `;
}

function renderGeneralFieldCard(item) {
  return `
    <div class="field-card">
      <div class="field-card-head">
        <strong>${escapeHtml(item.label)}</strong>
        <button type="button" class="icon-button more-button" data-action="open-general-field-editor" data-field-uid="${item.uid}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      <p>${linkify(escapeHtml(item.value || t("fields.unset")))}</p>
    </div>
  `;
}

function collectSharedFieldsByGroup(groupId) {
  const map = new Map();
  state.patterns.forEach((pattern) => {
    if (!isGroupVisibleForPattern(getFieldGroup(groupId), pattern.id)) return;
    pattern.fields.forEach((field) => {
      if (field.group !== groupId) return;
      if (field.key === "displayName") return;
      const uid = field.uid || `${groupId}:${field.label}`;
      if (!map.has(uid)) {
        map.set(uid, {
          uid,
          label: field.label || t("field.newLabel"),
          value: field.value || "",
          patternIds: new Set(),
          fieldRefs: []
        });
      }
      const item = map.get(uid);
      item.patternIds.add(pattern.id);
      if (!item.value && field.value) item.value = field.value;
      item.fieldRefs.push({ patternId: pattern.id, fieldKey: field.key });
    });
  });
  return Array.from(map.values()).map((item) => {
    const names = state.patterns.filter((pattern) => item.patternIds.has(pattern.id)).map((pattern) => pattern.patternName);
    return {
      ...item,
      summary: names.length ? names.join(" / ") : t("groups.summaryNone")
    };
  });
}

function renderLinksEditor(pattern) {
  const links = pattern.links || [];
  return `
    <div class="stack">
      <div class="section-title">
        <h3>${t("links.title")}</h3>
        <button type="button" class="icon-button mini-button" data-action="open-add-link" data-pattern-id="${pattern.id}" aria-label="${t("links.add")}" title="${t("links.add")}">+</button>
      </div>
      <div class="link-list">
        ${links.map((link) => renderLinkCard(pattern, link)).join("") || `<p class="muted small">${t("links.none")}</p>`}
      </div>
    </div>
  `;
}

function renderLinkCard(pattern, link) {
  const urlText = formatLinkText(link.url);
  const visibility = link.visible ? t("links.visible") : t("groups.summaryNone");
  return `
    <div class="field-card link-card">
      <div class="field-card-head">
        <strong>${escapeHtml(getLinkTypeLabel(link.type))}</strong>
        <button type="button" class="icon-button more-button" data-action="open-link-editor" data-pattern-id="${pattern.id}" data-link-id="${link.id}" aria-label="${t("fields.edit")}" title="${t("fields.edit")}">&#9998;</button>
      </div>
      ${link.url ? `<a class="link-card-url" href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(urlText)}</a>` : `<p class="muted small">${t("fields.unset")}</p>`}
      <span class="muted small">${visibility}</span>
    </div>
  `;
}

function formatLinkText(url) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    const tail = parsed.pathname === "/" ? "" : parsed.pathname;
    return `${parsed.hostname}${tail}`.slice(0, 72);
  } catch {
    return String(url).slice(0, 72);
  }
}

function renderThemeChoice(pattern, theme) {
  const active = pattern.themeId === theme.id ? " active" : "";
  const locked = !theme.free && state.plan === "free";
  return `
    <button type="button" class="theme-choice${active}${locked ? " locked" : ""}" data-action="set-theme" data-theme-id="${theme.id}">
      <strong>${escapeHtml(getThemeName(theme))}</strong>
      <span class="muted small">${escapeHtml(getThemeDescription(theme))}</span>
    </button>
  `;
}

function renderFrameChoice(pattern, frame) {
  const active = (pattern.frameId || "none") === frame.id ? " active" : "";
  const thumb = frame.src
    ? `<div class="frame-thumb"><img src="${escapeAttribute(frame.src)}" alt="${escapeAttribute(getPaperFrameName(frame))}"></div>`
    : `<div class="frame-thumb frame-thumb-none"><span>${currentLanguage() === "en" ? "No frame" : "枠なし"}</span></div>`;
  return `
    <button type="button" class="frame-choice${active}" data-action="open-frame-preview" data-frame-id="${frame.id}">
      ${thumb}
      <strong>${escapeHtml(getPaperFrameName(frame))}</strong>
      <span class="muted small">${escapeHtml(getPaperFrameDescription(frame))}</span>
    </button>
  `;
}

function renderDesign() {
  const pattern = getActivePattern();
  const frameSectionTitle = currentLanguage() === "en" ? "Frame" : "フレーム";
  return `
    <section class="section-title">
      <div>
        <h1>${t("design.title")}</h1>
        <p class="muted">${t("design.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("design.backMine")}</a>
    </section>
    <section class="panel pad pattern-toolbar">
      ${renderProfileTabs({ includeGeneral: false })}
    </section>
      <div class="split">
        <section class="panel pad stack">
          <h2>${t("design.paper")}</h2>
          <div class="theme-grid">
            ${THEMES.map((theme) => renderThemeChoice(pattern, theme)).join("")}
          </div>
          <h2>${frameSectionTitle}</h2>
          <div class="frame-grid">
            ${PAPER_FRAMES.map((frame) => renderFrameChoice(pattern, frame)).join("")}
          </div>
        </section>
      <section class="stack">
        <div class="section-title">
          <h2>${t("design.preview")}</h2>
          <a class="button secondary" href="#stickers">${t("design.toStickers")}</a>
        </div>
        ${renderProfilePaper(pattern, { editable: false })}
      </section>
    </div>
  `;
}

function renderStickers() {
  const pattern = getActivePattern();
  const stickerCatalog = getStickerPickerCatalog();
  const totalPages = Math.max(1, Math.ceil(stickerCatalog.length / STICKERS_PER_PAGE));
  const currentPage = clamp(Number(stickerPage) || 1, 1, totalPages);
  if (currentPage !== stickerPage) stickerPage = currentPage;
  const start = (currentPage - 1) * STICKERS_PER_PAGE;
  const pageItems = stickerCatalog.slice(start, start + STICKERS_PER_PAGE);
  return `
    <section class="section-title">
      <div>
        <h1>${t("stickers.title")}</h1>
        <p class="muted">${t("stickers.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("stickers.backMine")}</a>
    </section>
    <section class="panel pad pattern-toolbar">
      ${renderProfileTabs({ includeGeneral: false })}
    </section>
    <div class="split">
      <section class="panel pad stack">
        <h2>${t("stickers.panel")}</h2>
        ${renderCustomStickerUploader()}
        <div class="sticker-grid">
          ${pageItems.map((sticker) => renderStickerChoice(sticker)).join("")}
        </div>
        ${renderStickerPagination(currentPage, totalPages)}
      </section>
      <section class="stack">
        <div class="section-title">
          <div>
            <h2>${t("stickers.placement")}</h2>
            <span class="muted small">${escapeHtml(pattern.patternName)}</span>
          </div>
          <span class="muted small">${t("stickers.drag")}</span>
        </div>
        ${renderProfilePaper(pattern, { editable: true })}
      </section>
    </div>
  `;
}

function renderPublicProfile(profileId) {
  const profile = findProfile(profileId);
  if (!profile) {
    return `
      <section class="empty-state">
        <h1>${t("public.notFoundTitle")}</h1>
        <p class="muted">${t("public.notFoundDesc")}</p>
        <a class="button" href="#mine">${t("public.backMine")}</a>
      </section>
    `;
  }

  const already = state.exchanges.some((exchange) => exchange.targetProfileId === profile.id);

  return `
    <section class="section-title">
      <div>
        <h1>${escapeHtml(getDisplayName(profile))}</h1>
        <p class="muted">${escapeHtml(profile.patternName)} / ${escapeHtml(profile.audience)}</p>
      </div>
      <a class="button secondary" href="#mine">${t("public.back")}</a>
    </section>

    <div class="split">
      ${renderProfilePaper(profile, { editable: false })}
      <aside class="profile-actions">
        <h2>${t("public.exchangeTitle")}</h2>
        <p class="muted">${t("public.exchangeDesc")}</p>
        <label>
          ${t("public.eventLabel")}
          <input data-exchange-event value="${t("public.eventDefault")}">
        </label>
        <button type="button" data-action="save-exchange" data-profile-id="${profile.id}">
          ${already ? t("public.exchangeAgain") : t("public.exchangeAdd")}
        </button>
        <a class="button secondary" href="#book">${t("public.viewBook")}</a>
      </aside>
    </div>
  `;
}

function renderBook() {
  const sorted = [...state.exchanges].sort((a, b) => b.exchangedAt.localeCompare(a.exchangedAt));
  const selected = sorted.find((exchange) => exchange.id === selectedExchangeId) || sorted[0];
  if (selected && selectedExchangeId !== selected.id) {
    selectedExchangeId = selected.id;
    saveState();
  }

  return `
    <section class="section-title">
      <div>
        <h1>${t("book.title")}</h1>
        <p class="muted">${t("book.subtitle")}</p>
      </div>
      <div class="row">
        <a class="button secondary" href="#profile/${DEMO_PROFILES[0].id}">${t("book.openDemo")}</a>
        <a class="button secondary" href="#mine">${t("book.myQr")}</a>
      </div>
    </section>

    <div class="book-layout">
      <aside class="panel pad stack">
        <div class="section-title">
          <h2>${t("book.history")}</h2>
          <span class="muted small">${t("book.count", { count: sorted.length })}</span>
        </div>
        ${sorted.length ? `<div class="exchange-list">${sorted.map(renderExchangeListItem).join("")}</div>` : renderEmptyBook()}
      </aside>
      <section class="panel pad">
        ${selected ? renderExchangeDetail(selected) : renderNoExchangeDetail()}
      </section>
    </div>
  `;
}

function renderGuide() {
  const steps = [
    {
      badge: t("guide.step1.badge"),
      title: t("guide.step1.title"),
      desc: t("guide.step1.desc"),
      art: "profile"
    },
    {
      badge: t("guide.step2.badge"),
      title: t("guide.step2.title"),
      desc: t("guide.step2.desc"),
      art: "og"
    },
    {
      badge: t("guide.step3.badge"),
      title: t("guide.step3.title"),
      desc: t("guide.step3.desc"),
      art: "seen"
    },
    {
      badge: t("guide.step4.badge"),
      title: t("guide.step4.title"),
      desc: t("guide.step4.desc"),
      art: "hello"
    }
  ];

  return `
    <section class="section-title">
      <div>
        <h1>${t("guide.title")}</h1>
        <p class="muted">${t("guide.subtitle")}</p>
      </div>
      <a class="button secondary" href="#mine">${t("guide.openMvp")}</a>
    </section>

    <section class="guide-grid">
      ${steps.map((step) => `
        <article class="panel pad guide-card">
          <div class="guide-card-head">
            <span class="guide-badge">${escapeHtml(step.badge)}</span>
            <h2>${escapeHtml(step.title)}</h2>
          </div>
          <div class="guide-illust">
            ${renderGuideIllustration(step.art)}
          </div>
          <p class="muted">${escapeHtml(step.desc)}</p>
        </article>
      `).join("")}
    </section>
  `;
}

function settingsCopyLegacy() {
  const isEn = currentLanguage() === "en";
  return {
    title: isEn ? "Settings" : "設定",
    subtitle: isEn ? "Help, account, export, and policy links." : "使い方・登録情報・規約リンクをまとめています。",
    usage: isEn ? "How It Works" : "サービスの使い方",
    usageDesc: isEn ? "Open usage page" : "使い方ページを開く",
    account: isEn ? "Account (email & auth logs)" : "登録情報（メールアドレス・認証記録）",
    accountDesc: isEn ? "sample@memoria.app / Password, Google (last login: 2026-05-09)" : "sample@memoria.app / パスワード, Google（最終ログイン: 2026-05-09）",
    csv: isEn ? "Export met-people CSV" : "会った人の記録CSV出力",
    csvBadge: isEn ? "Pro" : "有料",
    csvDesc: isEn ? "Available on paid plans" : "有料プランで利用可能",
    web: isEn ? "Memoria Website" : "MemoriaのWebページ",
    terms: isEn ? "Terms of Service" : "会員規約",
    privacy: isEn ? "Privacy Policy" : "プライバシーポリシー",
    company: isEn ? "Operator Info" : "運営情報",
    external: isEn ? "Open in new tab" : "別窓で開く",
    proTitle: isEn ? "Pro feature" : "有料機能",
    proBody: isEn ? "CSV export is available on paid plans." : "CSV出力は有料プランでご利用いただけます。"
  };
}

function renderSettingsLegacy() {
  const copy = settingsCopy();
  return `
    <section class="section-title">
      <div>
        <h1>${copy.title}</h1>
        <p class="muted">${copy.subtitle}</p>
      </div>
      <a class="button secondary" href="#mine">${t("mine.title")}</a>
    </section>
    <section class="panel pad settings-menu">
      <a class="settings-item" href="#guide">
        <strong>${copy.usage}</strong>
        <span class="muted small">${copy.usageDesc}</span>
      </a>
      <article class="settings-item">
        <strong>${copy.account}</strong>
        <span class="muted small">${copy.accountDesc}</span>
      </article>
      <button type="button" class="settings-item settings-action" data-action="open-csv-upgrade">
        <strong>${copy.csv} <span class="settings-badge">${copy.csvBadge}</span></strong>
        <span class="muted small">${copy.csvDesc}</span>
      </button>
      <a class="settings-item" href="https://profile.ac7.co.jp/" target="_blank" rel="noreferrer">
        <strong>${copy.web}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/terms" target="_blank" rel="noreferrer">
        <strong>${copy.terms}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/privacy" target="_blank" rel="noreferrer">
        <strong>${copy.privacy}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/about" target="_blank" rel="noreferrer">
        <strong>${copy.company}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
    </section>
  `;
}

function settingsCopy() {
  const isEn = currentLanguage() === "en";
  return {
    title: isEn ? "Settings" : "設定",
    subtitle: isEn ? "Plan, account, export, and policy links." : "プラン・アカウント・出力・規約情報をまとめています。",
    usage: isEn ? "How It Works" : "サービスの使い方",
    usageDesc: isEn ? "Open usage page" : "使い方ページを開く",
    account: isEn ? "Account (email & auth logs)" : "登録情報（メールアドレス・認証ログ）",
    accountDesc: isEn ? "sample@memoria.app / Password, Google (last login: 2026-05-09)" : "sample@memoria.app / パスワード・Google（最終ログイン: 2026-05-09）",
    planCompare: isEn ? "Free vs Paid" : "無料版と有料版",
    planCompareDesc: isEn ? "Compare limits and paid features." : "上限と有料機能の違いです。",
    freePlanName: isEn ? "Free" : "無料版",
    paidPlanName: isEn ? "Paid" : "有料版",
    featurePatterns: isEn ? "Patterns" : "パターン",
    featureGroups: isEn ? "Groups" : "グループ",
    featureFields: isEn ? "Fields" : "項目",
    featureStickers: isEn ? "Sticker use" : "シール",
    featureCsv: isEn ? "CSV export" : "CSV出力",
    featureExchanges: isEn ? "Met-people records" : "会った人の記録",
    stickerFree: isEn ? "designated only" : "指定シールのみ",
    stickerPaid: isEn ? "custom image upload" : "任意画像アップロード可",
    csvFree: isEn ? "not available" : "利用不可",
    csvPaid: isEn ? "available" : "利用可",
    currentPlanLabel: isEn ? "Current plan" : "現在のプラン",
    buyPaid: isEn ? "Purchase paid plan" : "有料版を購入",
    paidEnabled: isEn ? "Paid plan enabled" : "有料版利用中",
    csv: isEn ? "Export met-people CSV" : "会った人の記録CSV出力",
    csvBadge: isEn ? "Pro" : "有料",
    csvDesc: isEn ? "Available on paid plans" : "有料プランで利用可能",
    orgTitle: isEn ? "For teams / organizations" : "団体・法人向け",
    orgDesc: isEn
      ? "We will provide bulk user pre-registration and QR code issuance."
      : "先にまとめてユーザー登録し、QRコードを発行する仕組みを提供予定です。",
    web: isEn ? "Memoria Website" : "MemoriaのWebページ",
    terms: isEn ? "Terms of Service" : "会員規約",
    privacy: isEn ? "Privacy Policy" : "プライバシーポリシー",
    company: isEn ? "Operator Info" : "運営情報",
    external: isEn ? "Open in new tab" : "別窓で開く",
    proTitle: isEn ? "Paid feature" : "有料機能",
    proBody: isEn ? "CSV export is available on paid plans." : "CSV出力は有料プランで利用できます。"
  };
}

function renderPlanComparison(copy) {
  const currentPlan = getCurrentPlan();
  const rows = [
    { label: copy.featurePatterns, free: String(PLAN_LIMITS.free.patterns), pro: String(PLAN_LIMITS.pro.patterns) },
    { label: copy.featureGroups, free: String(PLAN_LIMITS.free.groups), pro: String(PLAN_LIMITS.pro.groups) },
    { label: copy.featureFields, free: String(PLAN_LIMITS.free.fields), pro: String(PLAN_LIMITS.pro.fields) },
    { label: copy.featureExchanges, free: String(PLAN_LIMITS.free.exchanges), pro: formatLimit(PLAN_LIMITS.pro.exchanges) },
    { label: copy.featureStickers, free: copy.stickerFree, pro: copy.stickerPaid },
    { label: copy.featureCsv, free: copy.csvFree, pro: copy.csvPaid }
  ];
  return `
    <article class="settings-item settings-plan">
      <strong>${copy.planCompare}</strong>
      <span class="muted small">${copy.planCompareDesc}</span>
      <div class="plan-compare">
        <div class="plan-col">
          <h4>${copy.freePlanName}</h4>
          ${rows.map((row) => `<div class="plan-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.free)}</strong></div>`).join("")}
        </div>
        <div class="plan-col">
          <h4>${copy.paidPlanName}</h4>
          ${rows.map((row) => `<div class="plan-row"><span>${escapeHtml(row.label)}</span><strong>${escapeHtml(row.pro)}</strong></div>`).join("")}
        </div>
      </div>
      <div class="plan-actions">
        <span class="muted small">${copy.currentPlanLabel}: ${currentPlan === "pro" ? copy.paidPlanName : copy.freePlanName}</span>
        <button type="button" class="secondary" data-action="open-plan-upgrade" ${currentPlan === "pro" ? "disabled" : ""}>${currentPlan === "pro" ? copy.paidEnabled : copy.buyPaid}</button>
      </div>
    </article>
  `;
}

function formatAuthTimestamp(value) {
  if (!value) return "-";
  try {
    return formatDate(value);
  } catch {
    return "-";
  }
}

function renderAccountStatus() {
  const isEn = currentLanguage() === "en";
  if (authSession.mode === "user") {
    const email = authSession.email || "-";
    const lastLogin = formatAuthTimestamp(authSession.lastLoginAt);
    return {
      description: isEn
        ? `${email} / Email login (last login: ${lastLogin})`
        : `${email} / メールログイン（最終ログイン: ${lastLogin}）`,
      action: `<button type="button" class="secondary settings-account-action" data-action="auth-logout">${isEn ? "Sign out" : "ログアウト"}</button>`
    };
  }
  if (authSession.mode === "guest") {
    return {
      description: isEn
        ? "Trial mode (session only on this device). Register to keep data."
        : "おためし利用中（この端末のセッションのみ）。データを残すには登録してください。",
      action: `<button type="button" class="secondary settings-account-action" data-action="auth-logout">${isEn ? "Back to auth" : "認証選択へ戻る"}</button>`
    };
  }
  return {
    description: isEn ? "Not authenticated" : "未認証",
    action: ""
  };
}

function renderSettings() {
  const copy = settingsCopy();
  const account = renderAccountStatus();
  return `
    <section class="section-title">
      <div>
        <h1>${copy.title}</h1>
        <p class="muted">${copy.subtitle}</p>
      </div>
      <a class="button secondary" href="#mine">${t("mine.title")}</a>
    </section>
    <section class="panel pad settings-menu">
      <a class="settings-item" href="#guide">
        <strong>${copy.usage}</strong>
        <span class="muted small">${copy.usageDesc}</span>
      </a>
      ${renderPlanComparison(copy)}
      <article class="settings-item">
        <strong>${copy.account}</strong>
        <span class="muted small">${account.description}</span>
        ${account.action}
      </article>
      <button type="button" class="settings-item settings-action" data-action="open-csv-upgrade">
        <strong>${copy.csv} <span class="settings-badge">${copy.csvBadge}</span></strong>
        <span class="muted small">${copy.csvDesc}</span>
      </button>
      <article class="settings-item">
        <strong>${copy.orgTitle}</strong>
        <span class="muted small">${copy.orgDesc}</span>
      </article>
      <a class="settings-item" href="https://profile.ac7.co.jp/" target="_blank" rel="noreferrer">
        <strong>${copy.web}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/terms" target="_blank" rel="noreferrer">
        <strong>${copy.terms}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/privacy" target="_blank" rel="noreferrer">
        <strong>${copy.privacy}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
      <a class="settings-item" href="https://profile.ac7.co.jp/about" target="_blank" rel="noreferrer">
        <strong>${copy.company}</strong>
        <span class="muted small">${copy.external}</span>
      </a>
    </section>
  `;
}

function renderEmptyBook() {
  return `
    <div class="empty-state stack">
      <strong>${t("book.noHistoryTitle")}</strong>
      <p class="muted">${t("book.noHistoryDesc")}</p>
      <a class="button" href="#profile/${DEMO_PROFILES[0].id}">${t("book.openDemo")}</a>
    </div>
  `;
}

function renderNoExchangeDetail() {
  return `
    <div class="empty-state">
      <h2>${t("book.selectTitle")}</h2>
      <p class="muted">${t("book.selectDesc")}</p>
    </div>
  `;
}

function renderExchangeListItem(exchange) {
  const active = exchange.id === selectedExchangeId ? " active" : "";
  return `
    <button type="button" class="exchange-card${active}" data-action="select-exchange" data-exchange-id="${exchange.id}">
      <strong>${escapeHtml(exchange.snapshot.displayName)}</strong>
      <span class="muted small">${formatDate(exchange.exchangedAt)} / ${escapeHtml(exchange.eventName || t("book.eventUnset"))}</span>
      <span class="muted small">${escapeHtml(exchange.snapshot.title || "")}</span>
    </button>
  `;
}

function renderExchangeDetail(exchange) {
  const tagsValue = (exchange.tags || []).join(", ");
  return `
    <div class="stack">
      <div class="section-title">
        <h2>${t("book.cardTitle")}</h2>
        <a class="button secondary" href="#profile/${exchange.targetProfileId}">${t("book.currentProfile")}</a>
      </div>
      <div class="snapshot">
        <div class="avatar">${escapeHtml(initialOf(exchange.snapshot.displayName))}</div>
        <div>
          <h3>${escapeHtml(exchange.snapshot.displayName)}</h3>
          <p class="muted">${escapeHtml(exchange.snapshot.title || "")}</p>
          <p>${escapeHtml(exchange.snapshot.oneLiner || "")}</p>
          <div class="tag-row">
            <span class="tag">${escapeHtml(exchange.method)}</span>
            <span class="tag">${escapeHtml(exchange.eventName || t("book.eventUnset"))}</span>
            <span class="tag">${formatDate(exchange.exchangedAt)}</span>
          </div>
        </div>
      </div>
      <label>
        ${t("book.note")}
        <textarea data-exchange-note="${exchange.id}">${escapeHtml(exchange.privateNote || "")}</textarea>
      </label>
      <label>
        ${t("book.tags")}
        <input data-exchange-tags="${exchange.id}" value="${escapeAttribute(tagsValue)}" placeholder="${t("book.tagsPlaceholder")}">
      </label>
      <p class="muted small">${t("book.noteHint")}</p>
    </div>
  `;
}

function renderProfilePaper(profile, options) {
  const visibleFields = profile.fields.filter((field) => field.visible && field.key !== "displayName");
  const visibleLinks = (profile.links || []).filter((link) => link.visible && link.url);
  const themeClass = `theme-${profile.themeId === "pink" ? "friends" : profile.themeId}`;
  const frame = getPaperFrame(profile.frameId);
  const frameStyle = getPaperFrameStyle(frame);
  return `
    <article class="profile-paper ${themeClass}${frame.id !== "none" ? " has-image-frame" : ""}" data-profile-paper="${profile.id}" ${frameStyle ? `style="${escapeAttribute(frameStyle)}"` : ""} ${options.editable ? "data-action=\"clear-sticker-selection\"" : ""}>
      <div class="paper-lines"></div>
      ${profile.stickers.map((sticker, index) => renderPlacedSticker(sticker, index, options.editable, profile.id)).join("")}
      <div class="profile-content">
        <header class="profile-head">
          ${renderProfileAvatar(profile)}
          <div>
            <p class="muted">${escapeHtml(profile.patternName)} / ${escapeHtml(profile.audience)}</p>
            <h2 class="profile-name">${escapeHtml(getDisplayName(profile))}</h2>
          </div>
        </header>
        ${renderAnswerGroups(visibleFields, profile)}
        ${visibleLinks.length ? renderProfileLinks(visibleLinks) : ""}
      </div>
    </article>
  `;
}

function renderPlacedSticker(stickerPlacement, index, editable, patternId) {
  const sticker = getSticker(stickerPlacement.id);
  if (!sticker) return "";
  const size = clamp(Number(stickerPlacement.size || 116), 64, 220);
  const selected = editable && selectedStickerPatternId === patternId && selectedStickerIndex === index;
  return `
    <div
      class="placed-sticker ${sticker.className}${selected ? " selected" : ""}"
      style="left: ${Number(stickerPlacement.x).toFixed(1)}%; top: ${Number(stickerPlacement.y).toFixed(1)}%; width: ${size}px; transform: rotate(${Number(stickerPlacement.rotation || 0).toFixed(1)}deg);"
      data-sticker-index="${index}"
      data-pattern-id="${patternId}"
      ${editable ? "data-action=\"select-placed-sticker\"" : ""}
      ${editable ? "data-draggable-sticker=\"true\"" : ""}
    >
      ${editable && selected ? `
        <div class="placed-sticker-controls" data-sticker-control="true">
          <button type="button" class="sticker-ctl" data-sticker-control="true" data-action="resize-placed-sticker" data-sticker-index="${index}" data-delta="-12" aria-label="${t("sticker.decrease")}">−</button>
          <button type="button" class="sticker-ctl" data-sticker-control="true" data-action="resize-placed-sticker" data-sticker-index="${index}" data-delta="12" aria-label="${t("sticker.increase")}">＋</button>
          <button type="button" class="sticker-ctl danger" data-sticker-control="true" data-action="remove-placed-sticker" data-sticker-index="${index}" aria-label="${t("sticker.remove")}">×</button>
        </div>
      ` : ""}
      ${renderStickerImage(sticker)}
    </div>
  `;
}

function renderAnswerGroups(fields, profile) {
  const groups = getFieldGroups()
    .filter((group) => isGroupVisibleForPattern(group, profile.id))
    .map((group) => ({ group, fields: fields.filter((field) => field.group === group.id) }))
    .filter((item) => item.fields.length > 0);

  return groups.map(({ group, fields: groupFields }) => `
    <section class="profile-group">
      <h3>${escapeHtml(getGroupLabel(group))}</h3>
      <dl class="answer-grid">
        ${groupFields.map(renderAnswer).join("")}
      </dl>
    </section>
  `).join("");
}

function renderProfileLinks(links) {
  return `
    <section class="profile-group">
      <h3>${t("profile.linksTitle")}</h3>
      <div class="profile-links">
        ${links.map((link) => `
          <a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">
            <span>${escapeHtml(getLinkTypeLabel(link.type))}</span>
            <strong>${escapeHtml(formatLinkText(link.url) || link.url)}</strong>
          </a>
        `).join("")}
      </div>
    </section>
  `;
}

function renderAnswer(field) {
  return `
    <div class="answer">
      <dt>${escapeHtml(field.label)}</dt>
      <dd>${linkify(escapeHtml(field.value))}</dd>
    </div>
  `;
}

function renderGuideIllustration(kind) {
  if (kind === "profile") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="profile illustration">
        <rect x="12" y="14" width="124" height="142" rx="14" fill="#fff6ea" stroke="#d8cfc7"/>
        <circle cx="74" cy="56" r="24" fill="#dff0ea" stroke="#2f7568" stroke-width="2"/>
        <rect x="40" y="88" width="68" height="10" rx="5" fill="#b7aca2"/>
        <rect x="32" y="106" width="84" height="8" rx="4" fill="#d8cfc7"/>
        <rect x="32" y="120" width="72" height="8" rx="4" fill="#d8cfc7"/>
        <rect x="164" y="26" width="142" height="120" rx="16" fill="#eef5ff" stroke="#c8d9ef"/>
        <rect x="182" y="46" width="104" height="12" rx="6" fill="#5f87b5"/>
        <rect x="182" y="68" width="88" height="9" rx="4.5" fill="#96aecd"/>
        <rect x="182" y="84" width="96" height="9" rx="4.5" fill="#96aecd"/>
        <rect x="182" y="100" width="72" height="9" rx="4.5" fill="#96aecd"/>
      </svg>
    `;
  }

  if (kind === "og") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="open graph illustration">
        <rect x="16" y="30" width="124" height="112" rx="12" fill="#ffffff" stroke="#d8cfc7"/>
        <rect x="32" y="46" width="92" height="54" rx="10" fill="#f8e0e8"/>
        <rect x="32" y="108" width="72" height="8" rx="4" fill="#b7aca2"/>
        <rect x="32" y="122" width="58" height="8" rx="4" fill="#d8cfc7"/>
        <path d="M154 86h34" stroke="#2f7568" stroke-width="4" stroke-linecap="round"/>
        <path d="M182 78l14 8-14 8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="204" y="26" width="102" height="120" rx="14" fill="#f7fbff" stroke="#c8d9ef"/>
        <rect x="218" y="42" width="74" height="40" rx="8" fill="#dff0ea"/>
        <rect x="218" y="90" width="70" height="8" rx="4" fill="#89a5c8"/>
        <rect x="218" y="104" width="56" height="8" rx="4" fill="#b7c9e0"/>
        <circle cx="286" cy="114" r="10" fill="#2f5f8f"/>
        <text x="286" y="118" text-anchor="middle" font-size="10" fill="#fff" font-family="Segoe UI, sans-serif">OG</text>
      </svg>
    `;
  }

  if (kind === "seen") {
    return `
      <svg viewBox="0 0 320 170" role="img" aria-label="seen greeting illustration">
        <rect x="20" y="30" width="120" height="108" rx="12" fill="#fffaf3" stroke="#d8cfc7"/>
        <circle cx="56" cy="66" r="16" fill="#dff0ea" stroke="#2f7568"/>
        <rect x="80" y="58" width="46" height="8" rx="4" fill="#8ca8c9"/>
        <rect x="80" y="74" width="38" height="8" rx="4" fill="#b9cbe2"/>
        <rect x="34" y="102" width="92" height="22" rx="11" fill="#2f7568"/>
        <text x="80" y="116" text-anchor="middle" font-size="12" fill="#fff" font-family="Segoe UI, sans-serif">みたよ</text>
        <rect x="178" y="24" width="122" height="122" rx="14" fill="#ffffff" stroke="#d8cfc7"/>
        <rect x="194" y="42" width="90" height="12" rx="6" fill="#5f87b5"/>
        <rect x="194" y="64" width="76" height="9" rx="4.5" fill="#b2c4dc"/>
        <rect x="194" y="80" width="84" height="9" rx="4.5" fill="#b2c4dc"/>
        <rect x="194" y="96" width="62" height="9" rx="4.5" fill="#b2c4dc"/>
        <circle cx="282" cy="116" r="12" fill="#f5c84c" stroke="#d3a533"/>
        <text x="282" y="120" text-anchor="middle" font-size="13" fill="#684f15" font-family="Segoe UI, sans-serif">✓</text>
      </svg>
    `;
  }

  return `
    <svg viewBox="0 0 320 170" role="img" aria-label="app hello illustration">
      <rect x="26" y="26" width="112" height="120" rx="18" fill="#ffffff" stroke="#d8cfc7"/>
      <rect x="182" y="26" width="112" height="120" rx="18" fill="#ffffff" stroke="#d8cfc7"/>
      <circle cx="82" cy="62" r="18" fill="#e4eef8" stroke="#5f87b5"/>
      <circle cx="238" cy="62" r="18" fill="#f8e0e8" stroke="#b94d70"/>
      <rect x="52" y="96" width="60" height="24" rx="12" fill="#2f7568"/>
      <rect x="208" y="96" width="60" height="24" rx="12" fill="#2f7568"/>
      <text x="82" y="112" text-anchor="middle" font-size="11" fill="#fff" font-family="Segoe UI, sans-serif">こんにちは</text>
      <text x="238" y="112" text-anchor="middle" font-size="11" fill="#fff" font-family="Segoe UI, sans-serif">こんにちは</text>
      <path d="M132 70h56" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-dasharray="6 6"/>
      <path d="M182 62l14 8-14 8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M138 78l-14-8 14-8" fill="none" stroke="#2f7568" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;
}

function renderProfileAvatar(profile, className = "") {
  const extraClass = className ? ` ${className}` : "";
  const src = profile.avatarDataUrl || "";
  if (src) {
    return `<div class="avatar${extraClass}"><img src="${escapeAttribute(src)}" alt="${t("avatar.alt")}"></div>`;
  }
  return `<div class="avatar${extraClass}"><span>${escapeHtml(initialOf(getDisplayName(profile)))}</span></div>`;
}

function renderAvatarEditor(pattern) {
  return `
    <div class="add-box">
      <h3>${t("avatar.title")}</h3>
      <div class="avatar-editor">
        ${renderProfileAvatar(pattern, "preview-avatar")}
        <div class="avatar-editor-actions">
          <label class="file-button">
            <span>${t("avatar.pick")}</span>
            <input type="file" accept="image/*" data-profile-image-upload data-pattern-id="${pattern.id}">
          </label>
          ${pattern.avatarDataUrl ? `<button type="button" class="ghost cute-ghost" data-action="clear-profile-image" data-pattern-id="${pattern.id}">${t("avatar.clear")}</button>` : ""}
        </div>
      </div>
      <p class="muted small">${t("avatar.help")}</p>
    </div>
  `;
}

function renderStickerImage(sticker) {
  const src = sticker.assetSrc || makeStickerImage(sticker);
  return `<img class="sticker-image" src="${escapeAttribute(src)}" alt="${escapeAttribute(sticker.label)}">`;
}

function renderStickerChoice(sticker) {
  return `
    <button type="button" class="sticker-choice" data-action="add-sticker" data-sticker-id="${sticker.id}">
      ${renderStickerImage(sticker)}
      <span class="muted small">${getStickerSourceText(sticker.source)}</span>
    </button>
  `;
}

function renderCustomStickerUploader() {
  const isEn = currentLanguage() === "en";
  const isPro = getCurrentPlan() === "pro";
  const title = isEn ? "Custom Sticker" : "オリジナルシール";
  if (isPro) {
    return `
      <div class="sticker-upload-box">
        <strong>${title}</strong>
        <label class="file-button">
          <span>${isEn ? "Upload image" : "画像をアップロード"}</span>
          <input type="file" accept="image/*" data-custom-sticker-upload>
        </label>
      </div>
    `;
  }
  return `
    <div class="sticker-upload-box">
      <strong>${title}</strong>
      <p class="muted small">${isEn ? "Paid plan can upload any image as a sticker." : "有料版では任意の画像をシールとして追加できます。"}</p>
      <button type="button" class="secondary" data-action="open-plan-upgrade">${isEn ? "See paid plan" : "有料版をみる"}</button>
    </div>
  `;
}

function renderStickerPagination(currentPage, totalPages) {
  if (totalPages <= 1) return `<p class="muted small">1 / 1</p>`;

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(`<button type="button" class="icon-button sticker-page-button ${i === currentPage ? "active" : ""}" data-action="sticker-page" data-page="${i}" aria-label="${t("stickers.page", { page: i })}">${i}</button>`);
  }

  return `
    <div class="sticker-pager">
      <button type="button" class="secondary" data-action="sticker-page" data-page="${Math.max(1, currentPage - 1)}" ${currentPage === 1 ? "disabled" : ""}>${t("stickers.prev")}</button>
      <div class="sticker-page-list">${pages.join("")}</div>
      <button type="button" class="secondary" data-action="sticker-page" data-page="${Math.min(totalPages, currentPage + 1)}" ${currentPage === totalPages ? "disabled" : ""}>${t("stickers.next")}</button>
    </div>
  `;
}

function getStickerSourceText(source) {
  if (source === "custom") return currentLanguage() === "en" ? "Custom" : "オリジナル";
  return t("stickers.free");
}

function handleInput(event) {
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

async function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.dataset.patternPicker !== undefined) {
    activePatternId = target.value;
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
      stickerPage = totalPages;
      saveState();
      render();
    } catch {
      showToast(t("toast.imageLoadFail"));
    } finally {
      target.value = "";
    }
  }
}

function handleClick(event) {
  const actionTarget = event.target.closest("[data-action]");
  if (!actionTarget) return;

  const action = actionTarget.dataset.action;

  if (action === "set-language") {
    setLanguage(actionTarget.dataset.language);
    return;
  }

  if (action === "auth-set-mode") {
    authModeTab = actionTarget.dataset.authMode === "login" ? "login" : "register";
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
    activePatternId = actionTarget.dataset.patternId;
    activeProfileTab = activePatternId;
    saveState();
    render();
  }

  if (action === "select-profile-tab") {
    activeProfileTab = actionTarget.dataset.tabId;
    if (activeProfileTab !== "general") activePatternId = activeProfileTab;
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
    selectedStickerPatternId = patternId;
    selectedStickerIndex = index;
    render();
    return;
  }

  if (action === "clear-sticker-selection") {
    if (selectedStickerIndex !== -1 || selectedStickerPatternId) {
      selectedStickerPatternId = "";
      selectedStickerIndex = -1;
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
        selectedStickerIndex = -1;
        selectedStickerPatternId = "";
      } else if (selectedStickerIndex > index) {
        selectedStickerIndex -= 1;
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
    const nextSize = clamp(Number(placement.size || 116) + delta, 64, 220);
    placement.size = nextSize;
    saveState();
    render();
  }

  if (action === "sticker-page") {
    const nextPage = Number(actionTarget.dataset.page) || 1;
    stickerPage = Math.max(1, nextPage);
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
    selectedExchangeId = actionTarget.dataset.exchangeId;
    activeBookView = "detail";
    saveState();
    render();
  }

  if (action === "select-book-view") {
    activeBookView = actionTarget.dataset.bookView === "detail" ? "detail" : "list";
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

function handleStickerDrag(event) {
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

function softRenderMine() {
  const route = parseRoute();
  if (route.name !== "mine") return;
  const previewHost = document.querySelector("[data-profile-paper]");
  if (!previewHost) return;
  previewHost.outerHTML = renderProfilePaper(getActivePattern(), { editable: true });
}

function addPattern() {
  const patternLimit = getPlanLimit("patterns");
  if (state.patterns.length >= patternLimit) {
    openLimitUpgradeModal("patterns");
    return;
  }

  const id = makeId("pat");
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
  activePatternId = id;
  activeProfileTab = id;
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
          <input data-modal-group-name value="${escapeAttribute(getGroupLabel(group))}">
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

function openAddGeneralFieldEditor(groupId) {
  const group = getFieldGroup(groupId);
  if (!group) return;
  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-general-field-title">
      <div class="section-title">
        <div>
          <h2 id="new-general-field-title">${t("field.addTitle")}</h2>
          <span class="muted small">${escapeHtml(getGroupLabel(group))}</span>
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
    pattern.fields.push({
      uid,
      key: makeId("field"),
      group: groupId,
      label,
      value,
      visible: true
    });
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
      if (field.uid === fieldUid) {
        field.label = label;
        field.value = value;
      }
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

function openAddFieldEditor(patternId, groupId) {
  const pattern = findPattern(patternId);
  const group = getFieldGroup(groupId);
  if (!pattern || !group) return;

  openModal(`
    <section class="modal-dialog" role="dialog" aria-modal="true" aria-labelledby="new-field-title">
      <div class="section-title">
        <div>
          <h2 id="new-field-title">${t("field.addTitle")}</h2>
          <span class="muted small">${escapeHtml(getGroupLabel(group))}</span>
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
    targetPattern.fields.push({
      uid,
      key: makeId("field"),
      group: groupId,
      label,
      value,
      visible: true
    });
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
    if (targetField) {
      targetField.label = label;
      targetField.value = value;
    }
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
  pattern.links.push({
    id: makeId("link"),
    type,
    label: getLinkTypeLabel(type),
    url,
    visible
  });
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
  selectedStickerPatternId = pattern.id;
  selectedStickerIndex = pattern.stickers.length - 1;
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
  if (getCurrentPlan() === "pro") {
    closeModal();
    return;
  }
  state.plan = "pro";
  saveState();
  closeModal();
  render();
  showToast(currentLanguage() === "en" ? "Paid plan enabled." : "有料プランを有効化しました。");
}

function openModal(content) {
  const root = document.querySelector("#modal-root");
  root.innerHTML = `<div class="modal-backdrop">${content}</div>`;
}

function closeModal() {
  document.querySelector("#modal-root").innerHTML = "";
}

function sanitizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getInputValue(selector) {
  const node = document.querySelector(selector);
  if (!(node instanceof HTMLInputElement)) return "";
  return node.value.trim();
}

function startUserSession(user) {
  const users = loadAuthUsers();
  const target = users.find((item) => item.id === user.id);
  const now = new Date().toISOString();
  if (target) {
    target.lastLoginAt = now;
    saveAuthUsers(users);
  }
  saveAuthSession({
    mode: "user",
    userId: user.id,
    email: user.email,
    lastLoginAt: now
  });
  applyState(loadState(authSession));
  saveState();
  closeModal();
  if (window.location.hash.startsWith("#profile/")) {
    window.location.hash = "#mine";
  }
  render();
}

function registerWithEmail() {
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

  const users = loadAuthUsers();
  if (users.some((user) => user.email === email)) {
    showToast(isEn ? "This email is already registered." : "このメールアドレスは登録済みです。");
    return;
  }

  const now = new Date().toISOString();
  const user = {
    id: makeId("usr"),
    email,
    password,
    createdAt: now,
    lastLoginAt: now
  };
  users.unshift(user);
  saveAuthUsers(users);
  startUserSession(user);
  showToast(isEn ? "Account created and logged in." : "アカウントを作成してログインしました。");
}

function loginWithEmail() {
  const isEn = currentLanguage() === "en";
  const email = sanitizeEmail(getInputValue("[data-auth-login-email]"));
  const password = getInputValue("[data-auth-login-password]");
  if (!email || !password) {
    showToast(isEn ? "Please enter email and password." : "メールアドレスとパスワードを入力してください。");
    return;
  }
  const users = loadAuthUsers();
  const user = users.find((item) => item.email === email);
  if (!user || user.password !== password) {
    showToast(isEn ? "Invalid email or password." : "メールアドレスまたはパスワードが正しくありません。");
    return;
  }
  startUserSession(user);
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
  saveAuthSession({
    mode: "guest",
    startedAt: new Date().toISOString()
  });
  applyState(loadState(authSession));
  saveState();
  closeModal();
  if (window.location.hash.startsWith("#profile/")) {
    window.location.hash = "#mine";
  }
  render();
  showToast(isEn ? "Trial mode started." : "おためし利用を開始しました。");
}

function logoutSession() {
  const isEn = currentLanguage() === "en";
  savePreferredLanguage(currentLanguage());
  saveAuthSession({ mode: "none" });
  applyState(loadState(authSession));
  authModeTab = "register";
  closeModal();
  window.location.hash = "#mine";
  render();
  showToast(isEn ? "Signed out." : "ログアウトしました。");
}

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

  const snapshot = createSnapshot(profile);
  const exchange = {
    id: makeId("ex"),
    targetProfileId: profile.id,
    method: "QR/URL",
    eventName,
    exchangedAt: new Date().toISOString(),
    snapshot,
    privateNote: "",
    tags: []
  };

  state.exchanges.unshift(exchange);
  selectedExchangeId = exchange.id;
  saveState();
  showToast(t("toast.exchangeAdded"));
  window.location.hash = "#book";
}

function createSnapshot(profile) {
  return {
    displayName: getDisplayName(profile),
    patternName: profile.patternName,
    title: getFieldValue(profile, "title"),
    oneLiner: getFieldValue(profile, "oneLiner"),
    profileUrl: getPublicUrl(profile.id)
  };
}

function getActivePattern() {
  return findPattern(activePatternId) || state.patterns[0];
}

function getActiveProfileTab() {
  if (activeProfileTab === "general") return "general";
  if (findPattern(activeProfileTab)) return activeProfileTab;
  return "general";
}

function findPattern(id) {
  return state.patterns.find((pattern) => pattern.id === id);
}

function findProfile(id) {
  return findPattern(id) || DEMO_PROFILES.find((profile) => profile.id === id);
}

function findExchange(id) {
  return state.exchanges.find((exchange) => exchange.id === id);
}

function getTheme(id) {
  return THEMES.find((theme) => theme.id === id) || THEMES[0];
}

function getPaperFrame(id) {
  return PAPER_FRAMES.find((frame) => frame.id === id) || PAPER_FRAMES[0];
}

function getPaperFrameName(frame) {
  if (currentLanguage() === "en") return frame.nameEn || frame.nameJa || frame.id;
  return frame.nameJa || frame.nameEn || frame.id;
}

function getPaperFrameDescription(frame) {
  if (currentLanguage() === "en") return frame.descriptionEn || frame.descriptionJa || "";
  return frame.descriptionJa || frame.descriptionEn || "";
}

function getPaperFrameStyle(frame) {
  if (!frame || frame.id === "none" || !frame.src || !frame.width) return "";
  const slice = frame.slice || {};
  const top = Number(slice.top) || 0;
  const right = Number(slice.right) || 0;
  const bottom = Number(slice.bottom) || 0;
  const left = Number(slice.left) || 0;
  const width = Number(frame.width) || 0;
  const repeat = frame.repeat || "stretch";
  return [
    `border:${width}px solid transparent`,
    `border-image-source:url('${frame.src}')`,
    `border-image-slice:${top} ${right} ${bottom} ${left}`,
    `border-image-width:${width}px`,
    `border-image-repeat:${repeat}`,
    "border-radius:0"
  ].join(";");
}

function getCustomStickers() {
  if (!Array.isArray(state.customStickers)) return [];
  return state.customStickers.map((sticker, index) => ({
    id: sticker.id || `custom_${index + 1}`,
    label: sticker.label || "Custom",
    className: sticker.className || "sticker-blue",
    color: sticker.color || "#dcecff",
    source: "custom",
    owned: true,
    variant: "asset",
    assetSrc: sticker.assetSrc
  }));
}

function getStickerCatalog(options = {}) {
  const includeCustom = options.includeCustom !== false;
  if (!includeCustom) return STICKERS;
  return STICKERS.concat(getCustomStickers());
}

function getStickerPickerCatalog() {
  if (getCurrentPlan() !== "pro") return STICKERS;
  return getStickerCatalog({ includeCustom: true });
}

function getSticker(id) {
  return getStickerCatalog({ includeCustom: true }).find((sticker) => sticker.id === id);
}

function loadStampStickers(manifest) {
  if (!Array.isArray(manifest) || manifest.length === 0) return [];
  return manifest
    .map((entry, index) => {
      const isString = typeof entry === "string";
      const file = isString ? entry : entry?.file;
      if (!file) return null;
      const src = isString ? `stamp/${file}` : (entry.src || `stamp/${file}`);
      return {
        id: isString ? `stamp_${index + 1}` : (entry.id || `stamp_${index + 1}`),
        label: isString ? formatStampLabel(file) : (entry.label || formatStampLabel(file)),
        className: entry?.className || "sticker-blue",
        color: entry?.color || "#dcecff",
        source: entry?.source || "free",
        owned: entry?.owned !== false,
        variant: "asset",
        assetSrc: src
      };
    })
    .filter(Boolean);
}

function formatStampLabel(fileName) {
  const base = String(fileName || "")
    .replace(/\.[^.]+$/, "")
    .replaceAll(/[_-]+/g, " ")
    .trim();
  return base || "STAMP";
}

function getLinkType(id) {
  return LINK_TYPES.find((type) => type.id === id) || LINK_TYPES[0];
}

function getFieldGroups() {
  return Array.isArray(state.groups) && state.groups.length ? state.groups : FIELD_GROUPS;
}

function getFieldGroup(id) {
  return getFieldGroups().find((group) => group.id === id) || getFieldGroups()[0];
}

function isGroupVisibleForPattern(group, patternId) {
  if (!findPattern(patternId)) return true;
  return !Array.isArray(group.patternIds) || group.patternIds.includes(patternId);
}

function renderGroupPatternSummary(group) {
  const visible = state.patterns.filter((pattern) => isGroupVisibleForPattern(group, pattern.id));
  if (visible.length === state.patterns.length) return t("groups.summaryAll");
  if (visible.length === 0) return t("groups.summaryNone");
  return visible.map((pattern) => pattern.patternName).join(" / ");
}

function findField(pattern, fieldKey) {
  return pattern.fields.find((field) => field.key === fieldKey);
}

function getDisplayName(profile) {
  return getFieldValue(profile, "displayName") || t("display.nameFallback");
}

function getFieldValue(profile, key) {
  return profile.fields.find((field) => field.key === key)?.value || "";
}

function countVisibleFields(pattern) {
  const visibleGroupIds = new Set(getFieldGroups().filter((group) => isGroupVisibleForPattern(group, pattern.id)).map((group) => group.id));
  return pattern.fields.filter((field) => visibleGroupIds.has(field.group)).length + (pattern.links || []).filter((link) => link.visible && link.url).length;
}

function getPublicUrl(profileId) {
  return `${PROFILE_BASE_URL}${encodeURIComponent(profileId)}`;
}

function initialOf(name) {
  const trimmed = String(name || "M").trim();
  return trimmed.slice(0, 1).toUpperCase();
}

function makeId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function formatDate(value) {
  const locale = currentLanguage() === "en" ? "en-US" : "ja-JP";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const raw = String(reader.result || "");
      const img = new Image();
      img.onload = () => {
        const maxEdge = 960;
        const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
        const width = Math.max(1, Math.round(img.width * scale));
        const height = Math.max(1, Math.round(img.height * scale));
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(raw);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        const isPng = (file.type || "").toLowerCase() === "image/png";
        resolve(canvas.toDataURL(isPng ? "image/png" : "image/jpeg", isPng ? undefined : 0.86));
      };
      img.onerror = () => reject(new Error("image_decode_error"));
      img.src = raw;
    };
    reader.onerror = () => reject(reader.error || new Error("file_read_error"));
    reader.readAsDataURL(file);
  });
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

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function linkify(value) {
  return value.replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noreferrer">$1</a>');
}

function makeStickerImage(sticker) {
  const palettes = {
    smile: { bg: "#ffd452", ink: "#2b220e", sub: "#fff5c5" },
    heart: { bg: "#ffd1e3", ink: "#8e265f", sub: "#ffc0d8" },
    friends: { bg: "#ffe8b0", ink: "#3a2a08", sub: "#fff2cc" },
    kawaii: { bg: "#ffd9f0", ink: "#8d2f6e", sub: "#ffeaf8" },
    heart_frame: { bg: "#ffd3eb", ink: "#a02f72", sub: "#ffe8f6" },
    emoji: { bg: sticker.color || "#dcecff", ink: "#22201f", sub: "#eff4ff" },
    default: { bg: sticker.color || "#dcecff", ink: "#22201f", sub: "#eff4ff" }
  };
  const palette = palettes[sticker.variant] || palettes.default;

  let body = "";

  if (sticker.variant === "smile") {
    body = `
      <circle cx="80" cy="52" r="35" fill="${palette.bg}" stroke="#a67a00" stroke-width="4"/>
      <circle cx="52" cy="49" r="7" fill="${palette.ink}"/>
      <circle cx="108" cy="49" r="7" fill="${palette.ink}"/>
      <path d="M46 69c6 8 14 12 24 12s18-4 24-12" fill="none" stroke="${palette.ink}" stroke-width="6" stroke-linecap="round"/>
      <text x="80" y="34" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="14" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "heart") {
    body = `
      <path d="M25 52c0-20 16-35 35-35 8 0 14 2 20 8 6-6 12-8 20-8 19 0 35 15 35 35 0 18-10 30-25 40-16 11-30 20-30 20s-14-9-30-20C35 82 25 70 25 52z" fill="${palette.bg}" stroke="#c5538d" stroke-width="4"/>
      <path d="M36 44c0-8 6-13 12-13 5 0 8 2 12 7 4-5 7-7 12-7 6 0 12 5 12 13 0 12-9 18-24 29-15-11-24-17-24-29z" fill="${palette.ink}" opacity=".82"/>
      <path d="M96 61c0-6 4-10 9-10 4 0 6 2 9 6 3-4 5-6 9-6 5 0 9 4 9 10 0 9-6 14-18 22-12-8-18-13-18-22z" fill="${palette.ink}" opacity=".52"/>
      <text x="70" y="84" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="15" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "friends") {
    body = `
      <ellipse cx="80" cy="52" rx="56" ry="34" fill="${palette.bg}" stroke="#c09a3d" stroke-width="4"/>
      <circle cx="54" cy="52" r="18" fill="${palette.sub}" stroke="#8b6a1f" stroke-width="3"/>
      <circle cx="103" cy="52" r="18" fill="#fff3d4" stroke="#8b6a1f" stroke-width="3"/>
      <circle cx="48" cy="50" r="2.8" fill="${palette.ink}"/>
      <circle cx="59" cy="50" r="2.8" fill="${palette.ink}"/>
      <path d="M48 59c3 3 6 4 10 4 4 0 7-1 10-4" fill="none" stroke="${palette.ink}" stroke-width="2.7" stroke-linecap="round"/>
      <circle cx="97" cy="50" r="2.8" fill="${palette.ink}"/>
      <circle cx="108" cy="50" r="2.8" fill="${palette.ink}"/>
      <path d="M97 59c3 3 6 4 10 4 4 0 7-1 10-4" fill="none" stroke="${palette.ink}" stroke-width="2.7" stroke-linecap="round"/>
      <text x="80" y="32" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="14" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  } else if (sticker.variant === "kawaii") {
    body = `
      <ellipse cx="80" cy="54" rx="54" ry="30" fill="${palette.bg}" stroke="#bf5f95" stroke-width="4"/>
      <path d="M42 34l5 10 11 2-8 8 2 11-10-6-10 6 2-11-8-8 11-2z" fill="${palette.ink}" opacity=".85"/>
      <path d="M117 35l3 7 8 1-6 6 2 8-7-4-7 4 2-8-6-6 8-1z" fill="${palette.ink}" opacity=".65"/>
      <text x="82" y="66" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="15" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
      <path d="M65 77h55" stroke="${palette.ink}" stroke-width="3" stroke-linecap="round" opacity=".55"/>
    `;
  } else if (sticker.variant === "heart_frame") {
    body = `
      <path d="M80 16c14 0 26 9 30 22 14 2 26 13 26 28 0 16-13 28-29 28H53C37 94 24 82 24 66c0-15 12-27 26-28 4-13 16-22 30-22z" fill="${palette.sub}" stroke="#bf4f8f" stroke-width="4"/>
      <rect x="42" y="29" width="76" height="48" rx="10" fill="#ffffff" stroke="#d76fa5" stroke-width="3" stroke-dasharray="5 4"/>
      <path d="M21 24c0-5 4-8 8-8 3 0 5 1 7 4 2-3 4-4 7-4 4 0 8 3 8 8 0 7-5 11-15 18-10-7-15-11-15-18z" fill="#d93f8d"/>
      <path d="M112 87c0-5 4-8 8-8 3 0 5 1 7 4 2-3 4-4 7-4 4 0 8 3 8 8 0 7-5 11-15 18-10-7-15-11-15-18z" fill="#d93f8d"/>
      <text x="80" y="58" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="11" fill="${palette.ink}">${escapeSvg("PHOTO")}</text>
      <text x="80" y="82" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="11" fill="${palette.ink}" opacity=".8">${escapeSvg("♥ frame")}</text>
    `;
  } else if (sticker.variant === "emoji") {
    body = `
      <path d="M32 31c10-10 22-13 48-13s38 3 48 13c10 10 12 22 12 22s-2 12-12 22c-10 10-22 13-48 13s-38-3-48-13c-10-10-12-22-12-22s2-12 12-22z" fill="${palette.bg}" stroke="#22201f" stroke-opacity=".2" stroke-width="3"/>
      <circle cx="33" cy="31" r="5" fill="${palette.sub}" opacity=".75"/>
      <circle cx="127" cy="74" r="6" fill="${palette.sub}" opacity=".75"/>
      <text x="80" y="59" text-anchor="middle" font-family="'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', 'Segoe UI', sans-serif" font-size="30">${escapeSvg(sticker.emoji || "✨")}</text>
      <text x="80" y="85" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="10.5" fill="${palette.ink}" letter-spacing=".6">${escapeSvg(sticker.label)}</text>
    `;
  } else {
    body = `
      <path d="M30 33c11-9 25-12 50-12s39 3 50 12c10 9 12 19 12 19s-2 10-12 19c-11 9-25 12-50 12s-39-3-50-12c-10-9-12-19-12-19s2-10 12-19z" fill="${palette.bg}" stroke="#22201f" stroke-opacity=".26" stroke-width="3"/>
      <text x="80" y="61" text-anchor="middle" font-family="'Arial Black', 'Segoe UI', sans-serif" font-size="18" fill="${palette.ink}">${escapeSvg(sticker.label)}</text>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="104" viewBox="0 0 160 104">
      ${body}
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function escapeSvg(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function makeQrSvg(text) {
  try {
    const matrix = makeQrMatrixV3L(text);
    const quiet = 4;
    const cell = 6;
    const size = matrix.length + quiet * 2;
    const rects = [];
    matrix.forEach((row, y) => {
      row.forEach((dark, x) => {
        if (dark) rects.push(`<rect x="${(x + quiet) * cell}" y="${(y + quiet) * cell}" width="${cell}" height="${cell}"/>`);
      });
    });
    return `
      <svg viewBox="0 0 ${size * cell} ${size * cell}" role="img" aria-label="${t("qr.aria")}">
        <rect width="${size * cell}" height="${size * cell}" fill="#fff"/>
        <g fill="#111">${rects.join("")}</g>
      </svg>
    `;
  } catch {
    return `<div class="empty-state small">${t("qr.tooLong")}</div>`;
  }
}

function makeQrMatrixV3L(text) {
  const version = 3;
  const size = version * 4 + 17;
  const dataCodewords = 55;
  const eccCodewords = 15;
  const bytes = Array.from(new TextEncoder().encode(text));
  if (bytes.length > 53) throw new Error("QR payload too long for version 3-L");

  const matrix = Array.from({ length: size }, () => Array(size).fill(false));
  const reserved = Array.from({ length: size }, () => Array(size).fill(false));
  const setFunction = (x, y, dark) => {
    matrix[y][x] = dark;
    reserved[y][x] = true;
  };

  drawFinder(matrix, reserved, 0, 0);
  drawFinder(matrix, reserved, size - 7, 0);
  drawFinder(matrix, reserved, 0, size - 7);
  drawAlignment(matrix, reserved, 22, 22);

  for (let i = 8; i < size - 8; i += 1) {
    setFunction(i, 6, i % 2 === 0);
    setFunction(6, i, i % 2 === 0);
  }

  reserveFormatAreas(reserved, size);
  setFunction(8, size - 8, true);

  const data = makeDataCodewords(bytes, dataCodewords);
  const ecc = reedSolomonRemainder(data, reedSolomonDivisor(eccCodewords));
  const allCodewords = data.concat(ecc);
  const bits = [];
  allCodewords.forEach((codeword) => pushBits(bits, codeword, 8));

  let bitIndex = 0;
  let upward = true;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right -= 1;
    for (let vert = 0; vert < size; vert += 1) {
      const y = upward ? size - 1 - vert : vert;
      for (let j = 0; j < 2; j += 1) {
        const x = right - j;
        if (reserved[y][x]) continue;
        const bit = bitIndex < bits.length ? bits[bitIndex] : 0;
        const mask = (x + y) % 2 === 0;
        matrix[y][x] = Boolean(bit ^ mask);
        bitIndex += 1;
      }
    }
    upward = !upward;
  }

  drawFormatBits(matrix, reserved, size, 0);
  return matrix;
}

function drawFinder(matrix, reserved, left, top) {
  const size = matrix.length;
  for (let dy = -1; dy <= 7; dy += 1) {
    for (let dx = -1; dx <= 7; dx += 1) {
      const x = left + dx;
      const y = top + dy;
      if (x < 0 || y < 0 || x >= size || y >= size) continue;
      const dark =
        dx >= 0 &&
        dx <= 6 &&
        dy >= 0 &&
        dy <= 6 &&
        (dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4));
      matrix[y][x] = dark;
      reserved[y][x] = true;
    }
  }
}

function drawAlignment(matrix, reserved, centerX, centerY) {
  for (let dy = -2; dy <= 2; dy += 1) {
    for (let dx = -2; dx <= 2; dx += 1) {
      const distance = Math.max(Math.abs(dx), Math.abs(dy));
      matrix[centerY + dy][centerX + dx] = distance !== 1;
      reserved[centerY + dy][centerX + dx] = true;
    }
  }
}

function reserveFormatAreas(reserved, size) {
  for (let i = 0; i <= 8; i += 1) {
    if (i !== 6) {
      reserved[8][i] = true;
      reserved[i][8] = true;
    }
  }
  reserved[8][8] = true;
  reserved[7][8] = true;
  reserved[8][7] = true;

  for (let i = 0; i < 8; i += 1) reserved[8][size - 1 - i] = true;
  for (let i = 0; i < 7; i += 1) reserved[size - 1 - i][8] = true;
}

function drawFormatBits(matrix, reserved, size, mask) {
  const bits = formatBits(mask);
  const getBit = (i) => ((bits >>> i) & 1) === 1;
  const set = (x, y, dark) => {
    matrix[y][x] = dark;
    reserved[y][x] = true;
  };

  for (let i = 0; i <= 5; i += 1) set(8, i, getBit(i));
  set(8, 7, getBit(6));
  set(8, 8, getBit(7));
  set(7, 8, getBit(8));
  for (let i = 9; i < 15; i += 1) set(14 - i, 8, getBit(i));

  for (let i = 0; i < 8; i += 1) set(size - 1 - i, 8, getBit(i));
  for (let i = 8; i < 15; i += 1) set(8, size - 15 + i, getBit(i));
  set(8, size - 8, true);
}

function formatBits(mask) {
  const errorCorrectionLevelL = 1;
  const data = (errorCorrectionLevelL << 3) | mask;
  let rem = data;
  for (let i = 0; i < 10; i += 1) {
    rem = (rem << 1) ^ (((rem >>> 9) & 1) ? 0x537 : 0);
  }
  return ((data << 10) | rem) ^ 0x5412;
}

function makeDataCodewords(bytes, capacity) {
  const bits = [];
  pushBits(bits, 0x4, 4);
  pushBits(bits, bytes.length, 8);
  bytes.forEach((byte) => pushBits(bits, byte, 8));

  const capacityBits = capacity * 8;
  pushBits(bits, 0, Math.min(4, capacityBits - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let value = 0;
    for (let j = 0; j < 8; j += 1) value = (value << 1) | bits[i + j];
    codewords.push(value);
  }

  for (let pad = 0; codewords.length < capacity; pad += 1) {
    codewords.push(pad % 2 === 0 ? 0xec : 0x11);
  }

  return codewords;
}

function pushBits(bits, value, count) {
  for (let i = count - 1; i >= 0; i -= 1) bits.push((value >>> i) & 1);
}

function reedSolomonDivisor(degree) {
  const result = Array(degree).fill(0);
  result[degree - 1] = 1;
  let root = 1;
  for (let i = 0; i < degree; i += 1) {
    for (let j = 0; j < degree; j += 1) {
      result[j] = gfMultiply(result[j], root);
      if (j + 1 < degree) result[j] ^= result[j + 1];
    }
    root = gfMultiply(root, 0x02);
  }
  return result;
}

function reedSolomonRemainder(data, divisor) {
  const result = Array(divisor.length).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ result.shift();
    result.push(0);
    divisor.forEach((coefficient, index) => {
      result[index] ^= gfMultiply(coefficient, factor);
    });
  });
  return result;
}

function gfMultiply(x, y) {
  let z = 0;
  for (let i = 7; i >= 0; i -= 1) {
    z = (z << 1) ^ ((z >>> 7) * 0x11d);
    z ^= ((y >>> i) & 1) * x;
  }
  return z & 0xff;
}
