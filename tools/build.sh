#!/bin/sh
# Builds the site locally (Docker) to check it before pushing.
# The CV PDFs in assets/cv/ are the professor's own CVs: replace the files to update them.
set -e
cd "$(dirname "$0")/.."
OUT="$(mktemp -d)"
docker run --rm -v "$PWD":/site -v "$OUT":/out site-jekyll jekyll build -d /out/site --quiet
echo "Built in $OUT/site"
