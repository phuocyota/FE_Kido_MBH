#!/usr/bin/env bash
set -euo pipefail

git pull
npm run build -- --mode production
