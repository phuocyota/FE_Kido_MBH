#!/bin/bash
set -e

git pull
npm install
npm run build

sudo rm -rf /var/www/fe.parent.kidocanteent.kidoedu.vn/*
sudo cp -r dist/* /var/www/fe.parent.kidocanteent.kidoedu.vn/

sudo nginx -t
sudo systemctl reload nginx

echo "Deploy xong"