# Data Review: External Data & Files Referenced by the Notebooks

This is a working research note (not part of the published site) surveying every
external dataset, file, config, and service that the tutorial notebooks in
`notebooks/` (and their `notebooks/py_scripts/*.py` mirrors) load, download, or
otherwise depend on. The goal is to scope what a fully reproducible, self-contained
version of this package would need to vendor, mirror, or document.

Notebooks were scanned by extracting cell source text (markdown + code, excluding
embedded outputs) and grepping for URLs, file paths, environment variables, and
config file references. `py_scripts/*.py` (jupytext mirrors of the notebooks) were
scanned directly.

Three files in `notebooks/` are exact duplicates of others under different numbering
(`01_Insert_Data.ipynb` = `02_Insert_Data.ipynb`, `02_Data_Sync.ipynb` =
`03_Data_Sync.ipynb`, `03_Merge_Tables.ipynb` = `04_Merge_Tables.ipynb`) and are
**not** part of the site's table of contents — they're included below only where
they add nothing new (i.e. never separately, since content is identical to the
canonical file).

## Example datasets (raw NWB files)

The "Getting Started" notebooks depend on example NWB recordings hosted outside this
repo. These are the primary reproducibility dependency — without them, most
downstream notebooks (spike sorting, position, LFP, decoding) have no data to run on.

| Notebook(s) | Reference | Type | Notes |
|---|---|---|---|
| `02_Insert_Data.ipynb`, `00_HubQuickStart.ipynb` | [ucsf.box.com/s/k3sgql6z475oia848q1rgms4zdh4rkjn](https://ucsf.box.com/s/k3sgql6z475oia848q1rgms4zdh4rkjn) | External download (UCSF Box) | `minirec20230622.nwb`, 0.3 GB — minimal example recording, used throughout the Getting Started and pipeline notebooks |
| `02_Insert_Data.ipynb`, `00_HubQuickStart.ipynb` | [ucsf.box.com/s/2qbhxghzpttfam4b7q7j8eg0qkut0opa](https://ucsf.box.com/s/2qbhxghzpttfam4b7q7j8eg0qkut0opa) | External download (UCSF Box) | `mediumnwb20230802.nwb`, 32 GB — full-featured dataset, used in the Quick Start demo and spike sorting analysis |
| `02_Insert_Data.ipynb` | [ucsf.box.com/s/26je2eytjpqepyznwpm92020ztjuaomb](https://ucsf.box.com/s/26je2eytjpqepyznwpm92020ztjuaomb) | External download (UCSF Box) | `montague20200802.nwb`, 8 GB — full experimental recording |
| `02_Insert_Data.ipynb`, `04_PopulateConfigFile.ipynb` | [dandiarchive.org/dandiset/000447](https://dandiarchive.org/dandiset/000447/0.230316.2133/files?location=sub-JDS-NFN-AM2&page=1) | External download (DANDI Archive) | `sub-JDS-NFN-AM2_behavior+ecephys.nwb`, 5 GB — used specifically to demonstrate the custom config-YAML ingestion path for non-conforming NWB files |
| `02_Insert_Data.ipynb` (text only) | `/stelmo/nwb/raw` | Internal filesystem path | Mentioned as an alternative source "for those in the UCSF network" — not accessible outside the Frank lab |

## Referenced-by-name only (no download link in notebook)

These NWB files are used by later pipeline notebooks but are assumed to already exist
in the user's local Spyglass raw-data directory (`$SPYGLASS_BASE_DIR/raw`). No URL or
download instructions are given for them — they appear to be Frank-lab-internal
recordings distributed out of band (e.g. via Kachery sync, `03_Data_Sync.ipynb`, or
direct filesystem access).

| Notebook(s) | File referenced | Notes |
|---|---|---|
| `24_Linearization.ipynb` | `chimi20200216_new.nwb` | Mentioned in a comment as an example of "detailed data"; the notebook actually runs on `minirec20230622.nwb` |
| `02_Data_Sync.ipynb` / `03_Data_Sync.ipynb` | `Winnie20220713_.nwb` | Used to demonstrate fetching an LFP analysis result via Kachery |
| `21_DLC.ipynb` / `22_DLC_Loop.ipynb` | `J1620210529_.nwb`, `peanut20201103_.nwb` | Used as example videos for DeepLabCut training/loop demo |
| `21_DLC.ipynb` | `J1620210604_.nwb` | Used for the pose-estimation step |
| `11_Spike_Sorting_Analysis.ipynb` | `mediumnwb20230802_.nwb` | Analysis copy of the medium example dataset |

## Configuration & environment files

Files the notebooks expect to find locally (created by the user, or shipped as
examples inside the main `spyglass` package repo — not this preprint repo).

| Notebook(s) | Reference | Type | Notes |
|---|---|---|---|
| Nearly all notebooks (`00_Setup`, `01_Insert_Data`/`02_Insert_Data`, `02_Data_Sync`/`03_Data_Sync`, `03_Merge_Tables`/`04_Merge_Tables`, `05_Export`, `10_Spike_SortingV0/V1`, `11_Curation`/`11_CurationV0`, `20_Position_Trodes`, `21_DLC`/`21_Position_DLC_1`, `22_DLC_Loop`) | `dj_local_conf.json` | Local config file (user-created) | DataJoint database connection config; loaded via `dj.config.load("dj_local_conf.json")` at the top of nearly every notebook |
| `00_Setup.ipynb` | `environment.yml`, `environment_position.yml` | Repo file (in main `spyglass` repo, not this one) | Conda environment specs for base install and the DeepLabCut/position extra |
| `02_Insert_Data.ipynb`, `04_PopulateConfigFile.ipynb` | `examples/config_yaml/entries.yaml` | Example file in the main `spyglass` package repo | Template for pre-populating lookup tables (`Lab`, `Probe`, `DataAcquisitionDevice`, etc.) before NWB ingestion |
| `02_Insert_Data.ipynb`, `04_PopulateConfigFile.ipynb` | `sub-JDS-NFN-AM2_behavior+ecephys_rly_spyglass_config.yaml` (`*_spyglass_config.yaml` pattern) | User-authored, placed next to the NWB file | Per-file override config for NWB files that don't follow Spyglass naming conventions |
| `21_DLC.ipynb`, `22_DLC_Loop.ipynb` | `config.yaml` (DeepLabCut project config) | Generated by DeepLabCut | Standard DLC project config, created when a new DLC project is instantiated |

## Local storage layout (environment variables)

Not files pulled from the internet, but external-to-the-notebook state that must be
present on disk for anything to run. Set in `00_Setup.ipynb` and referenced
implicitly by every downstream notebook.

| Variable | Purpose |
|---|---|
| `SPYGLASS_BASE_DIR` | Root of all local Spyglass data |
| `SPYGLASS_RECORDING_DIR`, `SPYGLASS_SORTING_DIR`, `SPYGLASS_VIDEO_DIR`, `SPYGLASS_WAVEFORMS_DIR`, `SPYGLASS_TEMP_DIR` | Subdirectories under `SPYGLASS_BASE_DIR` for pipeline-specific intermediate/output data |
| `KACHERY_CLOUD_DIR`, `KACHERY_TEMP_DIR`, `KACHERY_ZONE` | Local cache and zone selection for Kachery-based file sharing |
| (DeepLabCut) `/nimbus/deeplabcut/video` | Hard-coded Frank-lab internal path where `.h264`→`.mp4` converted pose-estimation videos are cached (`21_DLC.ipynb`) |

## External services (not static files, but live dependencies)

| Notebook(s) | Service | Purpose |
|---|---|---|
| `02_Data_Sync.ipynb`/`03_Data_Sync.ipynb`, `10_Spike_SortingV0.ipynb`, `11_Curation.ipynb`/`11_CurationV0.ipynb` | [Kachery Cloud](https://github.com/flatironinstitute/kachery-cloud) (zones `franklab.default`, `franklab.collaborator`, `franklab.public`) | Peer-to-peer sharing of NWB/analysis files between Spyglass users |
| `10_Spike_SortingV0.ipynb`, `11_Curation.ipynb`/`11_CurationV0.ipynb` | [sortingview.vercel.app](https://sortingview.vercel.app) (via generated `workspace_uri`) | Web app for interactive manual curation of spike sorting results (Figurl-based) |
| `05_Export.ipynb` | [DANDI Archive](https://dandiarchive.org) (account + `dandiset create`) | Destination for uploading exported raw/intermediate NWB files for a published paper |
| `05_Export.ipynb` | MySQL `option-files` | Referenced for exporting DB credentials/dumps as part of the Docker export process |
| Nearly all notebooks | DataJoint-backed MySQL database (host set in `dj_local_conf.json`) | The actual analysis database every pipeline populates/queries — external infrastructure, not shipped with this repo |

## Gaps relative to the paper

The main preprint's Figure 5 cross-lab decoding demo uses **DANDI:000937** (Frank
lab) and **DANDI:000059** (Buzsáki lab, NYU) — see `index.md`. Neither dataset ID
appears anywhere in these tutorial notebooks; the only DANDI dataset referenced here
is **000447**, used solely for the custom-config-YAML ingestion example. The code
that actually reproduces Figure 5 lives in the separate
[`spyglass-paper`](https://github.com/LorenFrankLab/spyglass-paper) repo, not in
`notebooks/` — worth pulling in if full paper reproducibility is the goal.

## Known asset gaps (carried over from the build)

Three notebooks reference images that aren't present in this repo's `notebooks/`
directory (`../notebook-images/*.png` — `workspace.png`, `recording.png`,
`unittable.png`, `curation.png`, `dlc_scratch.png`), and two DLC notebooks have
internal "Table of Contents" anchor links that don't resolve. These were flagged
during the initial site build and are unrelated to the external-data survey above,
but are worth fixing alongside any reproducibility work.
