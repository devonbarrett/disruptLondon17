#!/bin/bash
[ -f .env ] && source .env
sudo -E PORT=80 npm start
