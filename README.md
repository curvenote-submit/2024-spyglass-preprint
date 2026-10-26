# Spyglass: A Reproducible & Interactive Preprint

Source for the interactive companion to *Spyglass: a framework for reproducible and shareable neuroscience research* ([bioRxiv 10.1101/2024.01.25.577295](https://doi.org/10.1101/2024.01.25.577295)), published as a [MyST](https://mystmd.org) site through Curvenote. The same repository is the [repo2docker](https://repo2docker.readthedocs.io) source for the BinderHub image that runs the notebooks.

## Layout

| Path | What it is |
| --- | --- |
| `curvenote.yml`, `index.md`, `data-review.md` | The article and its table of contents |
| `notebooks/`, `notebook-images/` | Spyglass tutorial notebooks, synced from upstream (do not edit by hand) |
| `notebooks/00_HubQuickStart.ipynb` | Maintained here; kept by the sync |
| `SPYGLASS_COMMIT` | The upstream Spyglass commit the article and image are built from |
| `wheels/` | Spyglass wheel built from that commit |
| `environment.yml`, `apt.txt`, `start` | repo2docker configuration for the BinderHub image |
| `scripts/` | Utilities for updating all of the above |

## Pinned Spyglass version

`SPYGLASS_COMMIT` pins [LorenFrankLab/spyglass](https://github.com/LorenFrankLab/spyglass) at [`6122f076`](https://github.com/LorenFrankLab/spyglass/commit/6122f076918cb0bbda220d71419848e9d71150a7) (`0.5.5a1-33-g6122f076`), the head of `master` on 22 Jan 2026 and the code state when bioRxiv v5 was posted on 29 Jan 2026.

The image installs Spyglass from the wheel in `wheels/`, so it contains the built package but not the Spyglass source tree.

## Updating Spyglass

Requires `git`, `rsync`, `python3` and [`uv`](https://docs.astral.sh/uv/).

```bash
scripts/update-spyglass.sh            # rebuild everything from SPYGLASS_COMMIT
scripts/update-spyglass.sh <sha|ref>  # pin a new commit (e.g. origin/master), then rebuild
```

This runs, in order:

1. `scripts/build-wheel.sh`: checks out the commit into `.spyglass/` (git-ignored), builds `wheels/spyglass_neuro-<version>.whl`, removes the previous wheel and points `environment.yml` at the new one.
2. `scripts/sync-notebooks.sh`: replaces `notebooks/` and `notebook-images/` with the upstream versions, deleting files upstream no longer has (except those listed in `KEEP`).
3. `scripts/update-toc.py`: regenerates the `curvenote.yml` table of contents, grouping notebooks by the first digit of their filename.

Each step can also be run on its own. Afterwards, review the diff and commit. `index.md` deliberately doesn't list individual notebooks, so it needs no update.

To install the same Spyglass build locally:

```bash
pip install wheels/spyglass_neuro-*.whl
```

## Building the image

repo2docker builds the image from the repository root. To test it locally:

```bash
repo2docker --no-run .
```
