#!/usr/bin/env bash
# Replace notebooks/ and notebook-images/ with the versions in .spyglass/.
# Files upstream no longer has are deleted, except the notebooks listed in
# KEEP, which are maintained in this repository.
set -euo pipefail
cd "$(dirname "$0")/.."

KEEP=(
  00_HubQuickStart.ipynb
  # From curvenote/spyglass-preprint-tutorial (binder-minimal-env): a hub smoke
  # test, and upstream notebooks edited to run on the BinderHub with minirec.
  # Each edit is marked "Binder hub:". Port upstream changes into them by hand.
  00_Spyglass_Smoke_Test.ipynb
  02_Insert_Data.ipynb
  04_Merge_Tables.ipynb
  05_Export.ipynb
  10_Spike_SortingV1.ipynb
  24_Linearization.ipynb
  30_LFP.ipynb
  40_Extracting_Clusterless_Waveform_Features.ipynb
  41_Decoding_Clusterless.ipynb
  42_Decoding_SortedSpikes.ipynb
)

scripts/fetch-spyglass.sh

EXCLUDES=()
for f in "${KEEP[@]}"; do EXCLUDES+=(--exclude "/$f"); done

rsync -a --delete "${EXCLUDES[@]}" .spyglass/notebooks/ notebooks/
rsync -a --delete .spyglass/notebook-images/ notebook-images/

echo "Synced notebooks/ and notebook-images/"
