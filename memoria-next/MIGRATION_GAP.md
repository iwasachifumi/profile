# React/Next Migration Gap (2026-05-14)

## 目的
旧 `js/` 実装から `memoria-next/src` への移行で、残タスクを先に可視化して
「新機能追加前に基盤を固める」ための作業台帳。

## 現状サマリ
- API ルートは主要エンドポイントが揃っている
- `lint` / `build` は通る
- 認証は HttpOnly Cookie + `credentials: "include"` 構成
- ただし旧実装にあった一部機能は未移植、または簡略化されている

## 優先度 P0（今やる）

1. 文字化け対策を全画面で統一
   - 既に実施: `useLang().t()` で「文字化けJA文字列をENにフォールバック」
   - 残り: 直書き文言（`t()` を通っていない箇所）を段階的に置換

2. 言語設定の単一化
   - 既に実施: `LanguageProvider` が localStorage + `/api/settings` を初期同期
   - 残り: 画面側で `settings.language` を参照していない箇所の統一

3. 旧/新の実行経路の明確化
   - `src/app/mine/page.tsx` は `EditorScreen` を使用
   - `MineScreen` など未使用コンポーネントが残っているため、運用対象を確定する

## 優先度 P1（React化の実質完了条件）

1. プラン制限ロジックの移植
   - 旧実装にあった上限制御（patterns/groups/fields/exchanges/custom stickers）
   - 現在の Next 側は `settings.plan` はあるが、UI/操作制御が未接続

2. カスタムステッカーの移植
   - `customStickers` は型/DBには存在
   - 画像アップロードUIと保存経路（旧 `data-custom-sticker-upload` 相当）が未移植

3. グループ可視性ルールの移植
   - 旧実装は group ごとに pattern 表示制御を持っていた
   - Next 側は簡略化されているため、仕様確定が必要

4. 公開プロフィール導線の最終整合
   - `slug` / `handle` / `id` の用途をUIで混同しない状態に揃える

## 優先度 P2（整理）

1. 旧 `js/` の凍結方針
   - 参照しないことを確認して archive へ移動
2. 文言管理の統一
   - `t(ja, en)` 直書きから辞書キー方式へ寄せるか、方針を固定
3. 未使用スタイル/コンポーネントの削除

## 次サイクルの実行順（提案）
1. `EditorScreen` を基準実装として固定（未使用画面の扱いを決定）
2. `plan` 制限の最小版（patterns/groups/fields/exchanges）を実装
3. カスタムステッカー upload を移植
4. `js/` 参照ゼロ確認後に凍結
