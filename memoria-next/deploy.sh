#!/bin/bash
# Memoria デプロイスクリプト
# 使い方: bash deploy.sh
# または: ./deploy.sh（要 chmod +x deploy.sh）

set -e  # エラーが出たら即停止

DEPLOY_DIR="/var/www/profile/memoria-next"
PM2_NAME="memoria"

echo "=== [1/4] git pull ==="
cd "$DEPLOY_DIR"
git pull

echo "=== [2/4] npm ci (依存関係) ==="
npm ci

echo "=== [3/4] npm run build ==="
export BUILD_SHA=$(git rev-parse --short HEAD)
echo "BUILD_SHA=$BUILD_SHA"
npm run build

echo "=== [4/4] pm2 restart ==="
pm2 restart "$PM2_NAME"

echo ""
echo "✅ デプロイ完了"
pm2 status "$PM2_NAME"
