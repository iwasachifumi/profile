# Memoria DB マイグレーション

Memoria のスキーマ定義を Supabase Self-hosted (api.ac7.co.jp) に適用するための SQL ファイル群。

設計の背景は [decisions.md](../decisions.md) を参照。

## 構成

```
db/
  migrations/
    0001_init.sql   -- 初期スキーマ(memoria schema, profiles/exchanges/user_settings, RLS)
```

ファイル名は `NNNN_description.sql` の連番。新しい変更は新しいファイルとして追加し、既存ファイルは編集しない(本番に適用済みのため)。

## 適用手順

### 方法 A: Supabase Studio の SQL Editor(推奨、手軽)

1. https://studio.ac7.co.jp/ にログイン
2. 該当プロジェクトを開く
3. SQL Editor で `db/migrations/NNNN_*.sql` の内容を貼り付けて Run
4. 適用後、`Database > Schemas` で `memoria` schema が見えることを確認

### 方法 B: psql 直接(VM SSH 経由)

```bash
ssh ubuntu@163.43.131.43
docker exec -i <supabase_db_container> psql -U postgres -d postgres < /path/to/0001_init.sql
```

コンテナ名は `docker ps | grep supabase` で確認。

## 適用後にやること

### 1. PostgREST に schema を公開する

Supabase Studio の `API > Settings`(または Supabase config の `db-schemas`)に **`memoria`** を追加する。`public` だけが公開されている初期状態のままだと、フロントから `memoria.profiles` を叩けない。

### 2. OAuth プロバイダの設定

Supabase Studio の `Authentication > Providers` で以下を有効化する。クライアント ID / Secret は別途 GCP / Apple Developer 側で発行する必要あり。

- **Google**: GCP Console の OAuth 2.0 クライアント ID(Web 用)を作成 → `https://api.ac7.co.jp/auth/v1/callback` を承認済みリダイレクト URI に登録 → クライアント ID / Secret を Supabase に貼る
- **Apple**: Apple Developer($99/年)で Service ID / Key を発行 → 同じく Supabase に貼る

### 3. Site URL と Redirect URLs

Supabase の `Authentication > URL Configuration` で:

- Site URL: `https://profile.ac7.co.jp`
- Redirect URLs に同じドメインを追加(必要なら開発用 `http://localhost:*` も)

## ロールバック

このプロジェクトでは MVP 段階のため down マイグレーションは用意しない。

巻き戻したい場合は手動で対応:

```sql
drop schema memoria cascade;
```

ただし本番データが入った後はこの手は使えない。本格運用以降に移行ツール(sqitch, dbmate 等)導入を検討する。
