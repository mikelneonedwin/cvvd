#!/usr/bin/env bash
set -euo pipefail

PROFILE_PATH="data/profile.yaml"
OUTPUT_PATH="public/cv.pdf"

if ! git rev-parse --verify origin/main >/dev/null 2>&1; then
  CHANGED=1
else
  if git diff --quiet origin/main -- "$PROFILE_PATH"; then
    CHANGED=0
  else
    CHANGED=1
  fi
fi

if [ "$CHANGED" -eq 0 ]; then
  echo "No changes to $PROFILE_PATH; skipping PDF generation."
  exit 0
fi

echo "$PROFILE_PATH changed; generating $OUTPUT_PATH"
bun run scripts/generate-pdf-standalone.ts "$OUTPUT_PATH"

git add "$OUTPUT_PATH"
if git diff --cached --quiet -- "$OUTPUT_PATH"; then
  echo "PDF is up to date."
else
  echo "Generated PDF changed. Please commit $OUTPUT_PATH and push again."
  exit 1
fi
