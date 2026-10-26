#!/usr/bin/env bash
# Move the article to a Spyglass commit: rebuild the wheel, sync notebooks and
# notebook-images, and regenerate the curvenote.yml table of contents.
#
#   scripts/update-spyglass.sh               # rebuild from SPYGLASS_COMMIT
#   scripts/update-spyglass.sh <sha-or-ref>  # pin a new commit, then rebuild
set -euo pipefail
cd "$(dirname "$0")/.."

if [ $# -gt 0 ]; then
  echo "$1" > SPYGLASS_COMMIT
fi

scripts/build-wheel.sh
scripts/sync-notebooks.sh
python3 scripts/update-toc.py
