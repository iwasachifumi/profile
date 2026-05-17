# Memoria プロジェクト構造

## ⚠️ 作業前に必読

このリポジトリには **2世代のコードが共存** している。
修正・機能追加は必ず `memoria-next/` に対して行うこと。

---

## ディレクトリ構成

| ディレクトリ | 説明 | 触るか |
|---|---|---|
| `memoria-next/` | **現行コード（Next.js）** | ✅ ここを修正する |
| `mvp/` | 旧MVPコード（静的サイト）。参照用。 | ❌ 触らない |
| `deploy/` | nginx 設定など | 必要に応じて |
| `db/` | DB マイグレーション | 必要に応じて |
| `decisions.md` | 設計判断の記録 | 参照のみ |

---

## サーバー・デプロイ

- 本番サーバー: `ubuntu@163.43.131.43`（さくらクラウド）
- SSH 鍵: `~/.ssh/profile_sakura_ed25519`
- PM2 プロセス名: `memoria`（port 3001）
- Supabase: `/home/ubuntu/supabase/docker/`

デプロイ手順:
```bash
ssh ubuntu@163.43.131.43
cd /var/www/profile   # または memoria-next のあるパス（要確認）
git pull
# pm2 restart memoria など（要確認）
```

接続情報の詳細は `SynergyCoreFW/SERVER_CONFIG.md` を参照。
