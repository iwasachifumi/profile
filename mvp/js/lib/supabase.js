// Supabase クライアントの単一生成箇所。
// "逃げやすい設計" のためのロックイン境界 — Supabase を剥がすときはここと
// js/lib/auth.js を差し替えれば済むようにしておく。
// 他のモジュールから直接 supabase-js を import しないこと。

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "../config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,        // localStorage にセッション保存(リロードで復元)
    autoRefreshToken: true,      // アクセストークン自動更新
    detectSessionInUrl: true     // OAuth コールバック後の URL 内トークン拾い(将来用)
  },
  // Memoria のテーブルは memoria schema に集約。
  // from('profiles') が memoria.profiles を意味するようにデフォルトを変えておく。
  // public schema を触りたい場合は supabase.schema('public').from(...) と明示する。
  db: { schema: "memoria" }
});
