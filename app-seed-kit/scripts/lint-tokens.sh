#!/bin/bash
# Fails if raw hex color values found outside token files and tests
grep -rn '#[0-9a-fA-F]\{3,8\}' \
  --include='*.tsx' \
  --include='*.ts' \
  src/app src/components src/hooks src/lib 2>/dev/null \
  && echo 'RAW HEX FOUND — FIX BEFORE COMMITTING' && exit 1 \
  || echo 'Token lint passed'
