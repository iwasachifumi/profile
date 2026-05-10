-- Memoria 初期スキーマ
-- 適用先: 既存 Supabase Self-hosted (api.ac7.co.jp)
-- 方針: db/README.md と decisions.md を参照
--
-- 適用前提:
--   - extension `pgcrypto` が有効(gen_random_uuid のため)
--   - auth.users は Supabase が作成済み
-- 適用後:
--   - Supabase Studio の API > Schemas に `memoria` を追加して PostgREST 公開する

create schema if not exists memoria;
create extension if not exists pgcrypto;

-- ============================================================
-- 1. profiles : プロフィール本体(=既存の pattern)
-- ============================================================
-- 1ユーザーが複数枚持てる。public_slug が QR/共有URL のキー。
-- 有料会員は handle も併用可能(/p/<slug> でも /p/<handle> でも引ける)。
create table memoria.profiles (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid not null references auth.users(id) on delete cascade,
  public_slug   text unique,                              -- nanoid。アプリ側で生成
  handle        text unique,                              -- 有料会員のみ設定可。アプリ側で plan チェック
  is_public     boolean not null default false,
  pattern_name  text not null,
  audience      text,
  description   text,
  theme_id      text,
  frame_id      text,
  fields        jsonb not null default '[]'::jsonb,
  links         jsonb not null default '[]'::jsonb,
  stickers      jsonb not null default '[]'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  -- handle の文字種制限。slug と衝突しないよう、handle は英字始まりに寄せる。
  constraint handle_format check (handle is null or handle ~ '^[a-zA-Z][a-zA-Z0-9_]{2,29}$')
);
create index profiles_owner_idx       on memoria.profiles (owner_id);
create index profiles_public_slug_idx on memoria.profiles (public_slug) where public_slug is not null;
create index profiles_handle_idx      on memoria.profiles (handle)      where handle is not null;

-- ============================================================
-- 2. exchanges : 交換履歴(完全プライベート)
-- ============================================================
create table memoria.exchanges (
  id                 uuid primary key default gen_random_uuid(),
  owner_id           uuid not null references auth.users(id) on delete cascade,
  target_profile_id  uuid references memoria.profiles(id) on delete set null,
  method             text not null default 'QR/URL',
  event_name         text,
  exchanged_at       timestamptz not null default now(),
  snapshot           jsonb not null,
  private_note       text default '',
  tags               text[] default array[]::text[]
);
create index exchanges_owner_time_idx on memoria.exchanges (owner_id, exchanged_at desc);

-- ============================================================
-- 3. user_settings : 本人UI設定 + email 冗長コピー
-- ============================================================
-- email は auth.users と join しなくて済むようにここに冗長コピー。
-- アプリ側のサインアップ完了フックで投入する想定。
create table memoria.user_settings (
  user_id     uuid primary key references auth.users(id) on delete cascade,
  email       text,
  plan        text not null default 'free',
  language    text not null default 'ja',
  data        jsonb not null default '{}'::jsonb,   -- customStickers / groups override 等
  updated_at  timestamptz not null default now()
);

-- ============================================================
-- updated_at 自動更新トリガ
-- ============================================================
create or replace function memoria.touch_updated_at()
returns trigger as $$
begin
  new.updated_at := now();
  return new;
end;
$$ language plpgsql;

create trigger profiles_touch
  before update on memoria.profiles
  for each row execute function memoria.touch_updated_at();

create trigger user_settings_touch
  before update on memoria.user_settings
  for each row execute function memoria.touch_updated_at();

-- ============================================================
-- RLS
-- ============================================================
alter table memoria.profiles      enable row level security;
alter table memoria.exchanges     enable row level security;
alter table memoria.user_settings enable row level security;

-- profiles
-- 自分のは全権、他人のは「公開フラグON かつ slug あり」だけ SELECT 可能
create policy "profiles_owner_all"
  on memoria.profiles
  for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "profiles_public_read"
  on memoria.profiles
  for select
  using (is_public = true and public_slug is not null);

-- exchanges : 完全プライベート
create policy "exchanges_owner_all"
  on memoria.exchanges
  for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

-- user_settings : 自分だけ
create policy "user_settings_owner_all"
  on memoria.user_settings
  for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- ============================================================
-- 権限付与(PostgREST 経由のロール)
-- ============================================================
-- Supabase 標準の anon / authenticated ロールに schema 利用権を渡す。
-- 実テーブルへの操作は RLS が制御するので grant は緩めでよい。
grant usage on schema memoria to anon, authenticated;
grant select on memoria.profiles to anon;                       -- public_read を許すため
grant select, insert, update, delete on memoria.profiles      to authenticated;
grant select, insert, update, delete on memoria.exchanges     to authenticated;
grant select, insert, update, delete on memoria.user_settings to authenticated;
