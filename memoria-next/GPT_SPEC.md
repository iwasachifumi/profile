# Memoria — React 移植 仕様書（GPT 向け）

## 概要

Memoria は「プロフ帳」アプリです。
現在の vanilla JS 実装（`js/` フォルダ）を Next.js + React に移植します。

## バックエンド（実装済み）

Next.js API Routes が担当します。フロントエンドはすべて `credentials: "include"` で fetch してください。

### 認証（HttpOnly Cookie）

```
POST /api/auth/register  { email, password }          → 登録 + 自動ログイン
POST /api/auth/login     { email, password }          → ログイン
POST /api/auth/logout    {}                           → ログアウト
GET  /api/auth/me                                    → セッション確認 → { id, email }
```

- 認証情報は HttpOnly Cookie で管理（フロントから JWT は見えない）
- 初期表示時に `GET /api/auth/me` を呼んでログイン状態を判定する
- 未ログイン時は認証画面を表示

### データ API

```
GET    /api/profiles            → プロフィール一覧
POST   /api/profiles            → 新規作成  body: Profile
PUT    /api/profiles/:id        → 更新      body: Partial<Profile>
DELETE /api/profiles/:id        → 削除

GET    /api/exchanges           → 交換履歴一覧
POST   /api/exchanges           → 新規作成  body: Exchange
PUT    /api/exchanges/:id       → 更新      body: Partial<Exchange>
DELETE /api/exchanges/:id       → 削除

GET    /api/settings            → 設定取得
PUT    /api/settings            → 設定更新  body: UserSettings

GET    /api/public/:slug        → 公開プロフィール（認証不要）
GET    /api/public/handle/:handle → 同上
```

### レスポンス形式

```ts
// 成功
{ ok: true, data: T }

// エラー
{ ok: false, error: string }
```

## 型定義（src/types/index.ts に定義済み）

```ts
interface Profile {
  id: string;           // crypto.randomUUID() で生成
  publicSlug: string | null;
  handle: string | null;
  isPublic: boolean;
  patternName: string;
  audience: string;
  description: string;
  themeId: string;
  frameId: string;
  fields: Field[];
  links: Link[];
  stickers: StickerItem[];
}

interface Exchange {
  id: string;
  targetProfileId: string | null;
  method: string;
  eventName: string | null;
  exchangedAt: string;    // ISO 8601
  snapshot: Record<string, unknown>;
  privateNote: string;
  tags: string[];
}

interface UserSettings {
  plan: "free" | "pro";
  language: "ja" | "en";
  customStickers: unknown[];
  groups: unknown[];
}
```

## フォルダ構成（React 側）

✅ = 実装済み　📝 = GPT が実装する

```
src/
├── api/                      ✅ 全ファイル実装済み
│   ├── _client.ts            ✅ fetch ラッパ（credentials:include 付き）
│   ├── auth.ts               ✅ register / login / logout / me
│   ├── profiles.ts           ✅ list / create / update / remove
│   ├── exchanges.ts          ✅ list / create / update / remove
│   ├── settings.ts           ✅ get / update
│   └── public.ts             ✅ getBySlug / getByHandle
├── store/
│   ├── session.ts            ✅ SessionProvider + useSession hook
│   └── ui.ts                 ✅ UiProvider + useUi hook（dispatch ベース）
├── features/                 📝 GPT が実装
│   ├── auth/                 📝 ログイン・登録フォーム
│   ├── profiles/             📝 プロフィール編集 UI
│   ├── exchanges/            📝 交換帳 UI
│   ├── settings/             📝 設定画面
│   └── public-profile/       📝 公開プロフィール表示
└── app/
    ├── layout.tsx            ✅ SessionProvider + UiProvider 組み込み済み
    ├── page.tsx              📝 ルートリダイレクト or 認証振り分け
    ├── mine/page.tsx         📝 プロフィール編集画面
    ├── book/page.tsx         📝 交換帳
    └── profile/[slug]/page.tsx 📝 公開プロフィール
```

### session.ts の使い方

```tsx
const { session, login, logout, register } = useSession();

if (session.status === "loading") return <Loading />;
if (session.status === "guest")  return <AuthScreen />;
// session.status === "user" → session.user.email が使える
```

### ui.ts の使い方

```tsx
const { ui, dispatch } = useUi();

// タブ切り替え例
dispatch({ type: "SET_AUTH_TAB", payload: "login" });
dispatch({ type: "SET_ACTIVE_PATTERN", payload: patternId });
dispatch({ type: "OPEN_MODAL", payload: "delete-confirm" });
```

## 移植元ファイル

- `js/render.js`  — UI の描画ロジック（コンポーネントに分割）
- `js/events.js`  — イベントハンドラ（コンポーネント内の handler に）
- `js/store.js`   — 状態管理（React state / Context に）
- `js/data.js`    — 定数・マスターデータ（そのまま移植可）
- `js/constants.js` — 定数（そのまま移植可）
- `js/utils.js`   — ユーティリティ（そのまま移植可）
- `css/`          — スタイルはそのまま流用可（globals.css に）

## 注意事項

- `js/lib/supabase.js`, `js/lib/auth.js`, `js/lib/db.js` は **使わない**（バックエンド側で置き換え済み）
- `js/config.js` の Supabase 設定は **使わない**
- ID 生成は `crypto.randomUUID()` を使う
- localStorage への認証情報の保存は **しない**
- 言語切り替え（ja/en）は UserSettings.language で管理
- 多言語対応は既存の `t()` 関数の仕組みを踏襲すること

## フェーズ分け

1. **Phase 1** ✅ 完了: API Routes・API client・store・layout
2. **Phase 2** 📝: 認証画面（register/login フォーム）
3. **Phase 3** 📝: プロフィール編集画面（/mine）
4. **Phase 4** 📝: 交換帳（/book）
5. **Phase 5** 📝: 公開プロフィール（/profile/[slug]）

**GPT への依頼はPhase 2 から。** まず `src/features/auth/` と `src/app/page.tsx` を実装してください。
