#!/bin/bash
[ -f .env ] && source .env
npm run build
sudo -E PORT=80 npm start
