# Spyglass: A Reproducible & Interactive Preprint

Source for the interactive companion to *Spyglass: a framework for reproducible and shareable neuroscience research* ([bioRxiv 10.1101/2024.01.25.577295](https://doi.org/10.1101/2024.01.25.577295)), published as a [MyST](https://mystmd.org) site through Curvenote. The article's MECA export is the [repo2docker](https://repo2docker.readthedocs.io) source for the image that runs the notebooks on the Frank Lab BinderHub (`hhmi-frank`).

The environment and the hub edits to the notebooks were developed and tested in [curvenote/spyglass-preprint-tutorial](https://github.com/curvenote/spyglass-preprint-tutorial) (branch `binder-minimal-env`).

## Layout

| Path | What it is |
| --- | --- |
| `curvenote.yml`, `index.md`, `data-review.md` | The article and its table of contents |
| `notebooks/`, `notebook-images/` | The Spyglass tutorial notebooks and their images |
| `binder/` | repo2docker configuration for the image |
| `dj_local_conf.json` | The DataJoint/Spyglass config the notebooks load (database login, data folders under `~/spyglass_data`) |

## Spyglass version

The image installs Spyglass at commit [`6122f07`](https://github.com/LorenFrankLab/spyglass/commit/6122f076918cb0bbda220d71419848e9d71150a7) (22 Jan 2026, version `0.5.5a2.dev33`). That's the commit [curvenote/spyglass](https://github.com/curvenote/spyglass) tags as `snapshot/biorxiv-v5`: the code described in bioRxiv v5 of the preprint. The notebooks are copied from the same commit.

## Notebooks

The upstream tutorials use two example files: `minirec20230622.nwb` (240 MB, a 42-second recording) and `mediumnwb20230802.nwb` (32 GB). The 32 GB file doesn't fit on the hub's 16 GB shared disk, so the notebooks that run on the hub use **minirec**. Work through them **in order**, starting with `00_Spyglass_Smoke_Test`, which checks that the server is ready. Later notebooks build on what earlier ones put in the database.

Every change from the upstream notebooks is marked with a `# Binder hub:` comment, or a **Binder hub:** note or callout in the text.

| Notebook | Status on the hub |
| --- | --- |
| `00_HubQuickStart` | **Doesn't run.** Written for the previous hub: it needs a pre-populated database and `mediumnwb20230802.nwb`. |
| `00_Setup` | Titled "Local Machine Setup". For installing Spyglass on your own computer; the hub needs none of it. |
| `00_Spyglass_Smoke_Test` | Hub-specific: checks packages, database, Spyglass imports and the NWB file. |
| `01_Concepts` | Runs as upstream. |
| `02_Insert_Data` | Runs. The final "real data" example needs a 5 GB DANDI file that isn't on the shared drive, so it is skipped with a message. |
| `03_Data_Sync` | **Doesn't run.** Needs a lab's Kachery zone, credentials and shared database. |
| `04_Merge_Tables` | Runs. The last cell deletes the session after asking you to confirm. **Answer no** if you want to continue with the later notebooks. |
| `05_Export` | Runs. The DANDI upload step is skipped unless you add your own DANDI account details. |
| `10_Spike_SortingV0` | Upstream, unchanged. Runs except the last two cells (the FigURL curation view), which need a Kachery account. |
| `10_Spike_SortingV1` | Runs. Making the FigURL curation view needs a Kachery account, so it's off by default. |
| `11_Spike_Sorting_Analysis`, `32_Ripple_Detection`, `50_MUA_Detection` | **Don't run.** Need `mediumnwb20230802.nwb`. |
| `12_Burst_Merge_Curation` | **Doesn't run.** Needs a Frank Lab recording that isn't on the hub. |
| `20_Position_Trodes`, `24_Linearization`, `30_LFP`, `31_Theta` | Run. |
| `21_DLC`, `22_DLC_Loop` | **Don't run.** Need DeepLabCut, a GPU and Frank Lab recordings. |
| `40_Extracting_Clusterless_Waveform_Features`, `41_Decoding_Clusterless`, `42_Decoding_SortedSpikes` | **Ported to minirec.** Every step runs, but with ~10 s of position data the decoding results are only illustrative. 40 uses 8 of the 32 tetrodes and takes 13–15 minutes on 1 CPU. It uses a 50 µV spike threshold, since lower thresholds detect mostly noise and run the decoder out of memory. 42 decodes from all 3 minirec units, which notebook 10's curation labels as noise. |
| `60_MoSeq` | **Doesn't run.** Needs keypoint-MoSeq and a Frank Lab recording. |

Every notebook that doesn't fully run on the hub, and `00_Setup`, has a callout after its title saying so.

`notebooks/py_scripts/` holds upstream's jupytext mirrors of the notebooks. They don't include the hub edits.

### Run times and memory

Measured on the `hhmi-frank` hub on 18 Nov 2026, running every notebook that runs, in order, in one user server (2 GB / 1 CPU). Memory in use is the whole container (MySQL, Jupyter and the kernel), without file cache.

| Notebook | Time | Peak memory in use |
| --- | --- | --- |
| 00 smoke test | 61 s | – |
| 01, 02, 04, 05 | 6–37 s each | – |
| 10 spike sorting V1 | 117 s | 0.81 GiB |
| 20, 24, 30, 31 | 9–49 s each | ≤ 0.80 GiB |
| 40 waveform features | 12.6 min | 0.99 GiB |
| 41 clusterless decoding | 65 s | 0.93 GiB |
| 42 sorted-spikes decoding | 21 s | 0.77 GiB |

The whole sequence takes about 21 minutes, most of it in notebook 40.

## What is in the image

The image is built with repo2docker from the article's MECA export, not the whole repository. repo2docker reads only `binder/`.

| File | Purpose |
| --- | --- |
| `binder/environment.yml` | Python 3.9 + Spyglass at the commit above. Versions are pinned; changes from upstream's environment are marked `hub:`. |
| `binder/apt.txt` | OpenCV runtime libraries, graphviz, and the MySQL 8.0 server and client. |
| `binder/postBuild` | At build time: creates an empty MySQL data directory (user `root`, password `tutorial`) and links `~/.datajoint_config.json` to `dj_local_conf.json`. |
| `binder/start` | Every time a server starts: starts MySQL on `127.0.0.1:3306` and links NWB files from the shared data folder into `~/spyglass_data/raw`. |
| `binder/resolved-packages.txt` | For reference only: every conda, pip and apt package version in the tested image. repo2docker does not read it. |

`curvenote.yml` controls what goes into the bundle:

- `requirements`: `binder/*` and `dj_local_conf.json`
- `resources`: `notebook-images/*`, `notebooks/*.md` and `notebooks/py_scripts/*.py`
- notebooks are included because they are in the `toc`

Any other file the image needs must be added to `requirements` or `resources`.

### Database

Spyglass needs a MySQL server. A small MySQL 8.0 server runs **inside each user's container**:

- It only listens on `127.0.0.1`, so other users and pods can't reach it. The fixed `tutorial` password protects nothing beyond that container.
- It is tuned for the 2G memory limit (`performance_schema` off, 64 MB InnoDB buffer pool).
- **Nothing persists.** The database and everything under `~/spyglass_data` are deleted when the server stops (after 1 hour idle). Each new server starts with an empty database, so start again from `02_Insert_Data`.

### Data

Notebooks read the tutorial data from the read-only shared folder (`$SHARED_DATA_DIR`, `/home/jovyan/data`). Admins should copy this file there:

| Shared path | Size | Source |
| --- | --- | --- |
| `spyglass/raw/minirec20230622.nwb` | 240,712,080 bytes (~230 MiB) | <https://ucsf.box.com/shared/static/k3sgql6z475oia848q1rgms4zdh4rkjn.nwb> (sha256 `637df8ea3c9d7c3b0c6c562bb2bcfd6ae7e8f99df979404a72c601da3bbfb09f`) |

`start` links every `*.nwb` in `$SHARED_DATA_DIR/spyglass/raw/` (or directly in `$SHARED_DATA_DIR`) into `~/spyglass_data/raw/`. That folder is writable, so Spyglass can create its `<name>_.nwb` copy next to the original.

## Building and testing locally

Build the MECA bundle, then the image from it:

```bash
curvenote build --meca                        # writes _build/exports/curvenote.zip
unzip -q _build/exports/curvenote.zip -d _build/meca
pip install jupyter-repo2docker==2026.4.0
repo2docker --Repo2Docker.platform=linux/amd64 --no-run --image-name spyglass-preprint:test _build/meca/bundle
```

Always pass `--Repo2Docker.platform=linux/amd64`: an arm64 build (the default on Apple silicon) fails because some pinned conda packages don't exist for arm64. repo2docker skips the build if the image name already exists, so remove the old image or use a new name.

Run one notebook headless with the hub's limits:

```bash
docker run --rm --memory=2g --cpus=1 \
  -e SHARED_DATA_DIR=/home/jovyan/data -v /path/to/shared:/home/jovyan/data:ro \
  spyglass-preprint:test \
  bash -c 'cd notebooks && jupyter nbconvert --to notebook --execute --output /tmp/out.ipynb 00_Spyglass_Smoke_Test.ipynb'
```

To preview the article site, run `curvenote start`.
