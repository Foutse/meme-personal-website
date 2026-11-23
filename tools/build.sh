#!/bin/sh
# Builds the site locally (Docker) and regenerates the CV PDFs in assets/cv/.
# Usage: sh tools/build.sh     then commit and push.
set -e
cd "$(dirname "$0")/.."
OUT="$(mktemp -d)"
docker run --rm -v "$PWD":/site -v "$OUT":/out site-jekyll jekyll build -d /out/site --quiet
PORT=$(python3 -c 'import socket;s=socket.socket();s.bind(("127.0.0.1",0));print(s.getsockname()[1])')
(cd "$OUT/site" && python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1) & SRV=$!
sleep 1
CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
for L in en fr; do
  P=$([ "$L" = fr ] && echo /fr/cv/print/ || echo /cv/print/)
  "$CHROME" --headless=new --disable-gpu --no-pdf-header-footer --user-data-dir="$OUT/chrome-$L" \
    --print-to-pdf="assets/cv/foutse-momo-cv-$L.pdf" "http://127.0.0.1:$PORT$P" 2>/dev/null
done
kill $SRV
echo "Built. CV PDFs updated in assets/cv/"
