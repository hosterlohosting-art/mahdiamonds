#!/bin/bash
set -e

echo "✦ [1/4] Pulling latest repository commits..."
git pull origin main

echo "✦ [2/4] Installing dependencies..."
npm ci

echo "✦ [3/4] Building Next.js production bundle..."
npm run build

echo "✦ [4/4] Reloading PM2 process (Zero Downtime)..."
pm2 reload mah-diamonds

echo "✓ MAH Diamonds successfully deployed and live!"
