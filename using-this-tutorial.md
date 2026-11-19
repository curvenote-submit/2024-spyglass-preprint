---
title: Using this Tutorial
---

The Spyglass tutorial notebooks walk through every pipeline end to end, from setup and
data ingestion through spike sorting, position tracking, LFP analysis, and neural
decoding. They are listed in the navigation, grouped by pipeline. Every notebook can be
read here; most can also be run from here.

The notebooks come from Spyglass at commit
[`6122f07`](https://github.com/LorenFrankLab/spyglass/commit/6122f076918cb0bbda220d71419848e9d71150a7),
the code described in version 5 of the preprint. Where a notebook was changed to run in
the hosted environment, the change is marked **Binder hub:**.

## Running them from this site

When you launch the notebooks from this site, you get your own temporary Jupyter server
with Spyglass installed, its own MySQL database, and the tutorial's example recording,
`minirec20230622.nwb` (a 42-second recording, 240 MB). There's nothing to set up:

1. Open `00_Spyglass_Smoke_Test` first. It checks that the server is ready.
2. Then work through the notebooks **in order**, starting with `02_Insert_Data`. Later
   notebooks build on what earlier ones put in the database.

Each server has 2 GB of memory and one CPU, and **nothing is kept**: the database and
any files you create are deleted when the server stops, after an hour without use. A new
server starts with an empty database, so start again from `02_Insert_Data`. Running every
notebook below takes about 22 minutes, most of it in notebook 40.

| Runs from this site | Notes |
|---|---|
| `01_Concepts`, `02_Insert_Data`, `04_Merge_Tables`, `05_Export` | `02` skips its optional 5 GB DANDI example and `05` skips the DANDI upload. The last cell of `04` deletes the session after asking you to confirm: answer **no** to continue with the later notebooks. |
| `10_Spike_SortingV1` | The FigURL curation view needs a Kachery account, so it's off. |
| `10_Spike_SortingV0` | The legacy pipeline. Runs except its last two cells (the FigURL view). |
| `20_Position_Trodes`, `24_Linearization`, `30_LFP`, `31_Theta` | Run as published. |
| `40`, `41` and `42` (clusterless and sorted-spikes decoding) | Adapted to the short example recording. Every step runs, but with about 10 seconds of position data the decoding results are only illustrative. |

## What needs a separate environment

These notebooks need data, hardware or lab infrastructure the hosted servers don't
have. Each has a note at the top saying why. You can still read them here, and run them
in your own Spyglass installation.

| Notebook | Needs |
|---|---|
| `00_HubQuickStart` | A pre-populated database and the full `mediumnwb20230802.nwb` recording (32 GB) |
| `03_Data_Sync` | A lab's Kachery zone, credentials and shared database |
| `11_Spike_Sorting_Analysis`, `32_Ripple_Detection`, `50_MUA_Detection` | The full `mediumnwb20230802.nwb` recording (32 GB) |
| `12_Burst_Merge_Curation` | A Frank Lab recording |
| `21_DLC`, `22_DLC_Loop` | DeepLabCut, a GPU and Frank Lab recordings |
| `60_MoSeq` | keypoint-MoSeq and a Frank Lab recording |

## Running Spyglass on your own machine

To install Spyglass and set up its database yourself, follow
[Local Machine Setup](./notebooks/00_Setup.ipynb), or the
[Spyglass installation guide](https://lorenfranklab.github.io/spyglass/). The
environment used on this site, including its pinned package versions, is in the
downloadable MECA bundle, under `binder/`.

:::{card} Start here: Spyglass Smoke Test →
:link: ./notebooks/00_Spyglass_Smoke_Test.ipynb

Launch the notebooks and check that your server is ready, then work through the
tutorials in order.
:::
