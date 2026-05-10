// フロントに置いてよい公開設定だけをここに集約する。
// 絶対に置いてはいけないもの:
//   - SUPABASE_SERVICE_ROLE_KEY (RLS を無効化できる管理キー)
//   - 任意の secret / password / private key
// anon key は JWT 内が role:anon の公開キーで、フロント直書きで問題ない。

export const SUPABASE_URL = "https://api.ac7.co.jp";
export const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzc2ODA3MDMxLCJleHAiOjI1MzQwMjMwMDc5OX0.Sfm2Qw-o9nccJs8UPJxgnHOL1vykBE63jZPJoEbY8kI";
