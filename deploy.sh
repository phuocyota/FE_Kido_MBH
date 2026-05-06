#!/usr/bin/env bash
set -euo pipefail

git pull
npm install
npm run build -- --mode production

sudo systemctl reload nginx
