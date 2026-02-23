#!/bin/bash
# Fails build if raw hex values found outside token files
VIOLATIONS=$(grep -rn '#[0-9a-fA-F]\{3,8\}' \
  --include='*.tsx' \
  --include='*.ts' \
  --include='*.css' \
  --exclude='tokens.css' \
  --exclude='*.test.*' \
  src/app src/components src/hooks src/lib 2>/dev/null | wc -l)

if [ "$VIOLATIONS" -gt 0 ]; then
  echo 'Raw hex values found outside token files:'
  grep -rn '#[0-9a-fA-F]\{3,8\}' \
    --include='*.tsx' --include='*.ts' --include='*.css' \
    --exclude='tokens.css' --exclude='*.test.*' \
    src/app src/components src/hooks src/lib
  exit 1
fi
echo 'No raw hex values found outside token files'
