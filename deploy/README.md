# Memoria デプロイ手順

## 構成概要

```
GitHub (main branch)
  ↓ push
  ↓ GitHub Actions (自動) または 手動 git pull
さくらクラウド Ubuntu VM (163.43.131.43)
  /var/www/profile/   ← git clone
  ↓
nginx (/etc/nginx/sites-available/profile)
  ↓
Cloudflare Proxy (CDN / SSL / DDoS保護)
  ↓
https://profile.ac7.co.jp/
```

## 接続情報

| 項目 | 値 |
|------|-----|
| サーバ | さくらのクラウド Ubuntu 22.04 |
| SSH | `ssh ubuntu@163.43.131.43` |
| デプロイ先 | `/var/www/profile/` |
| ファイル所有者 | `ubuntu:ubuntu` |
| nginx設定 | `/etc/nginx/sites-available/profile` |
| 証明書 | Let's Encrypt (`/etc/letsencrypt/live/profile.ac7.co.jp/`) |

## 手動デプロイ

```bash
ssh ubuntu@163.43.131.43
cd /var/www/profile && git pull origin main
```

これだけ。静的サイトなので nginx reload も不要。

## 自動デプロイ

main への push で GitHub Actions が自動実行される。
`.github/workflows/deploy.yml` を参照。

初回セットアップ(GitHub Secrets に以下を登録):

| Secret名 | 内容 |
|---------|------|
| `SSH_PRIVATE_KEY` | サーバへの SSH 秘密鍵 |
| `SSH_KNOWN_HOSTS` | `ssh-keyscan 163.43.131.43` の出力 |

## 将来 build が増えたとき

現状は静的配信のみだが、以下が増えたら手順を追加する:

```bash
cd /var/www/profile
git pull origin main
npm run stamp:build   # stamp/manifest.js の再生成が必要なとき
```

## 証明書更新の注意

Cloudflare Proxy ON(オレンジ雲)の状態では、certbot の HTTP-01 チャレンジが
Cloudflare を経由するため自動更新が失敗することがある。

失敗した場合の対処:
1. Cloudflare ダッシュボードで profile.ac7.co.jp を一時的にグレー雲(DNS Only)に変更
2. `sudo certbot renew` を実行
3. 成功したらオレンジ雲に戻す

または DNS-01 チャレンジ(Cloudflare API Token 方式)に切り替える。

## 同居サービス

同じ VM 上で以下が稼働中。デプロイ時に影響は出ないが、nginx 設定を変更する場合は注意。

- `onestep.ac7.co.jp` — Next.js (PM2, :4000)
- `api.ac7.co.jp` — Supabase Kong (Docker, :8000)
- `studio.ac7.co.jp` — Supabase Studio (Docker, :3000)
