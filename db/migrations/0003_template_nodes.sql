-- template_nodes : 〇〇が好き！テンプレート
-- ユーザーが自作したものも system が seed したものも同じテーブルに入る
-- path[] でナビゲーションツリーを表現（末端ほどインデックスが深い）
-- questions は jsonb: [{label: text, placeholder: text}]

create table if not exists memoria.template_nodes (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  name_alt    text[],                          -- 検索用ゆらぎ表記（スノーマン, snow man 等）
  path        text[] not null,                 -- ["スポーツ", "野球", "NPB"]
  questions   jsonb not null default '[]',     -- [{label, placeholder}]
  created_by  text not null default 'system',  -- 'system' or user_id
  status      text not null default 'active',  -- 'active' | 'pending' | 'deleted'
  created_at  timestamptz default now()
);

create index if not exists template_nodes_path_idx on memoria.template_nodes using gin(path);
create index if not exists template_nodes_status_idx on memoria.template_nodes(status);
