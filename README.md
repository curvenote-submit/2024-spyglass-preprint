# Spyglass: A Reproducible & Interactive Preprint

Source for the interactive companion to *Spyglass: a framework for reproducible and shareable neuroscience research* ([bioRxiv 10.1101/2024.01.25.577295](https://doi.org/10.1101/2024.01.25.577295)), published as a [MyST](https://mystmd.org) site through Curvenote. The article's MECA export is the [repo2docker](https://repo2docker.readthedocs.io) source for the BinderHub image that runs the notebooks.

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

The image is built with repo2docker from the article's MECA export, not the whole repository. `curvenote.yml` controls what goes into the bundle:

- `requirements`: `environment.yml`, `apt.txt`, `start` and `wheels/*.whl`
- `resources`: `notebook-images/*` and `notebooks/py_scripts/*.py`
- notebooks are included because they are in the `toc`

Any other file the image needs must be added to `requirements` or `resources`. To build the bundle and test the image locally:

```bash
curvenote build --meca                        # writes _build/exports/curvenote.zip
unzip -q _build/exports/curvenote.zip -d _build/meca
repo2docker --Repo2Docker.platform=linux/amd64 --no-run --image-name spyglass-preprint:test _build/meca/bundle
```

Always pass `--Repo2Docker.platform=linux/amd64`: an arm64 build (the default on Apple silicon) fails because some pinned conda packages don't exist for arm64. repo2docker skips the build if the image name already exists, so remove the old image or use a new name. Importing `spyglass` connects to the database, so test it alongside a `datajoint/mysql:8.0` container.
