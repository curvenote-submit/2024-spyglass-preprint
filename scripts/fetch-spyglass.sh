#!/usr/bin/env bash
# Check out the Spyglass commit named in SPYGLASS_COMMIT into .spyglass/.
# SPYGLASS_COMMIT may hold any git ref (e.g. origin/master); it is rewritten
# to the full commit SHA.
set -euo pipefail
cd "$(dirname "$0")/.."

REF=$(tr -d '[:space:]' < SPYGLASS_COMMIT)

if [ ! -d .spyglass/.git ]; then
  # Blobless clone: full history and tags (needed for the package version)
  # without downloading every file revision.
  git clone --filter=blob:none --no-checkout https://github.com/LorenFrankLab/spyglass.git .spyglass
fi

if [ "$(git -C .spyglass rev-parse HEAD 2>/dev/null)" != "$REF" ]; then
  git -C .spyglass fetch --quiet --tags origin
  SHA=$(git -C .spyglass rev-parse --verify "$REF^{commit}")
  git -C .spyglass checkout --quiet --detach --force "$SHA"
  echo "$SHA" > SPYGLASS_COMMIT
fi

# Drop build artefacts from any previous run.
git -C .spyglass clean --quiet -fdx

echo "Spyglass $(git -C .spyglass describe --tags) ($(git -C .spyglass rev-parse --short HEAD)) in .spyglass/"
