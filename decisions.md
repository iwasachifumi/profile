# Memoria 技術判断ログ (Architecture Decisions)

このファイルは Memoria の構成にまつわる「決まったこと」と「その理由」を残す。
プロジェクトに参加する人間 / AI アシスタント(Claude, GPT 等)が判断基準を共有するために使う。

最新の判断が上に積まれる。覆る場合は新しいエントリで上書きし、古いエントリは「Superseded by ...」と付記して残す。

---

## 2026-05-09: バックエンドは既存 Supabase Self-hosted に相乗りする(逃げやすい設計を維持)

### 決定

Memoria の DB / 認証は、同 VM で稼働中の **既存 Supabase Self-hosted インスタンス (`api.ac7.co.jp`)** に相乗りする。専用 Postgres や専用 API サーバは立てない。

ただし将来 Supabase を剥がせる状態を保つため、以下を縛りとする。

#### 使うもの(ロックイン低)

- **Postgres**(標準 SQL、Supabase 外でも動く)
- **RLS (Row Level Security) ポリシー**(Postgres 標準機能)
- **GoTrue (Supabase Auth)** — Email/Password + Google OAuth + Apple OAuth
  - JWT 検証は Memoria 側で薄く実装し、後で Auth.js / Lucia 等に差し替え可能な境界を保つ
- **`supabase-js` SDK** は使うが、**呼び出しは薄いラッパー**(例: `src/db.js`, `src/auth.js`)に集約してアプリ本体に直接散らさない

#### 使わないもの(ロックイン高)

- ❌ Supabase Realtime
- ❌ Supabase Storage(画像は nginx 配信 or 別経路で扱う)
- ❌ Supabase Edge Functions
- ❌ pg_graphql、pgvector 等の Supabase 独自 / 重い拡張

### 検討した代替案

1. **Memoria 専用に Postgres + Node API を別建て**
   → 自前認証(Auth.js / Lucia)+ 自前 OAuth 配線 + 自前メール送信(SES等)が必要になり、コードと運用コストが大幅増。プロセス・メモリ的にも軽くなるとは限らない。却下。

2. **Firebase / Cloudflare D1 など別 SaaS / PaaS**
   → 既存 Supabase 資産を捨てることになり、運用対象が増える。却下。

3. **完全自前(DB から認証まで全部実装)**
   → MVP には過剰。Apple OAuth の Service ID / Key 周りまで自前で扱うのは負荷が高い。却下。

### 「Supabase を外したい」議論への回答

- Supabase が VM を圧迫している懸念があった。軽量化済み(不要コンテナを停止済み)であり、Memoria が追加するのはテーブル数件 + 小トラフィックなので増分は無視できる範囲、と判断した。
- ロックイン懸念は「層ごとに違う」という整理で対応。Postgres / RLS は標準機能でロックインゼロ、Realtime/Storage/Edge Functions は使わない、で剥離可能性を確保する。

### 影響範囲

- 既存 `app.js` の localStorage ベース認証 (`memoria-mvp-auth-users-v1`, `memoria-mvp-auth-session-v1`) は段階的に Supabase Auth に置き換える。
- 既存ローカルユーザーの移行は MVP では考慮しない(初回ログインで作り直し)。
- フロントは引き続き静的(ビルドなし)。`@supabase/supabase-js` は CDN ロードで足す前提。

### スキーマ詳細決定(2026-05-09 追記)

- **Schema 名**: `memoria`(既存 Supabase インスタンスに schema 追加で同居、別 project は切らない)
- **公開URLキー**: `public_slug`(nanoid、アプリ側生成)。**有料会員のみ `handle` を併用可能**(/p/&lt;slug&gt; でも /p/&lt;handle&gt; でも引ける)
- **email の扱い**: `auth.users` を join せず、`memoria.user_settings.email` に冗長コピーする(RLS 周りで join しにくい場面の回避策)
- **OAuth 発行**: iwasa 側で Google / Apple のクライアント発行作業を担当(Apple Developer \$99/年 を含む)
- **既存ローカルユーザー移行**: 無視。MVP 段階で localStorage はダミーデータ前提のため初回ログインで作り直し
- DDL は [db/migrations/0001_init.sql](db/migrations/0001_init.sql) を正本とする

---

## 後回し(deferred)タスク

優先度が下がっているが合意済みの項目。実装フェーズに入るときはこの順で前提を確認する。

### QR コードの印刷対応(コンビニプリント想定)

- 想定 UX: 装飾済み QR を PNG で保存 → セブン netprint / ファミマ・ローソン ネットワークプリント のアプリにアップ → 店舗で印刷。クライアント完結、サーバ実装不要。
- 名刺サイズ (91×55mm) の A4 面付けプリセットを用意して「プリ交換」体験を作る。Memoria の差別化レイヤーになる。
- **前提タスク**: `makeQrMatrixV3L` のエラー訂正レベルを **L → M (15% 復元)** に上げる。印刷劣化・折れ耐性のため。画面表示の堅牢性も上がるので印刷をやらなくても単独で意味がある。
- 出力解像度: L 判 300dpi で QR 一辺 3cm 想定なら Canvas 出力 350px 以上。

### QR コードのデコ編集(優先度: 高、これから着手)

- 形は **(c) 単純なバナー(角丸 + 縫い目風点線)** をベースに、複数デザインから**ユーザーが編集モードで選ぶ**。
- ラベル文言は i18n 対応(`t()` を使う既存仕組みに乗せる)。
- 上ラベル / 下ラベル / 端の小装飾(★♡)を組み合わせ可能にする想定。
