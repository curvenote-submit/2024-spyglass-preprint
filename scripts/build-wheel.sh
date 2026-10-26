#!/usr/bin/env bash
# Build a Spyglass wheel from .spyglass/ into wheels/, replacing any previous
# wheel, and point environment.yml at it. Requires uv.
set -euo pipefail
cd "$(dirname "$0")/.."

scripts/fetch-spyglass.sh

rm -f wheels/spyglass_neuro-*.whl
uv build --quiet --wheel --out-dir wheels .spyglass
# uv ignores its output directory by default; the wheel is committed here.
rm -f wheels/.gitignore

WHEEL=$(ls wheels/spyglass_neuro-*.whl)
sed -i.bak -E "s|\./wheels/spyglass_neuro-[^ ]+\.whl|./$WHEEL|" environment.yml
rm environment.yml.bak
grep -q "./$WHEEL" environment.yml || { echo "environment.yml has no ./wheels/spyglass_neuro-*.whl line to update" >&2; exit 1; }

echo "Built $WHEEL"
