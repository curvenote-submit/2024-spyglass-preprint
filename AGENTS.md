# AGENTS.md

This repo is a Curvenote article (`curvenote.yml`, `index.md`) and the repo2docker source for its BinderHub image. Spyglass is pinned to one upstream commit in `SPYGLASS_COMMIT`; see `README.md` for the layout.

## Updating to a new Spyglass commit

1. Branch from `main`. Merging to `main` publishes the site, so never commit there directly.
2. Run `scripts/update-spyglass.sh <sha-or-ref>` (needs `git`, `rsync`, `python3`, `uv`). It writes the full SHA to `SPYGLASS_COMMIT`, rebuilds the wheel in `wheels/`, updates the wheel line in `environment.yml`, syncs `notebooks/` and `notebook-images/`, and regenerates the TOC in `curvenote.yml`.
3. If `update-toc.py` exits with "No TOC section title", upstream added a new notebook group: add its title to `SECTIONS` in `scripts/update-toc.py` (take the name from upstream `docs/mkdocs.yml`) and rerun.
4. Check the result:
   - `git status` shows exactly one wheel in `wheels/`, and `environment.yml` references it.
   - `.spyglass/pyproject.toml` dependencies don't conflict with the pins in `environment.yml`. Raise or remove the conflicting pins; don't touch unrelated ones.
   - Deleted and added notebooks match upstream renames or removals, and `00_HubQuickStart.ipynb` is still there.
5. Commit the pin, wheel and environment update separately from the notebook sync, and name the short SHA and `git -C .spyglass describe --tags` in the messages.
6. Open a PR. The Curvenote preview workflow builds a draft of the site.

## Rules

- Don't edit `notebooks/`, `notebook-images/` or the `toc:` block in `curvenote.yml` by hand; the scripts overwrite them. Notebooks maintained in this repo go in `KEEP` in `scripts/sync-notebooks.sh`.
- Don't list individual notebooks in `index.md`; the TOC is the only notebook list.
- Don't add Spyglass source to the repo (no submodule or vendored copy). repo2docker copies the whole repo into the image, and only the built wheel should ship.
- `.spyglass/` is a git-ignored scratch checkout; it's safe to delete.
