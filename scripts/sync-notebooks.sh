#!/usr/bin/env bash
# Replace notebooks/ and notebook-images/ with the versions in .spyglass/.
# Files upstream no longer has are deleted, except the notebooks listed in
# KEEP, which are maintained in this repository.
set -euo pipefail
cd "$(dirname "$0")/.."

KEEP=(00_HubQuickStart.ipynb)

scripts/fetch-spyglass.sh

EXCLUDES=()
for f in "${KEEP[@]}"; do EXCLUDES+=(--exclude "/$f"); done

rsync -a --delete "${EXCLUDES[@]}" .spyglass/notebooks/ notebooks/
rsync -a --delete .spyglass/notebook-images/ notebook-images/

echo "Synced notebooks/ and notebook-images/"
