---
title: Using this Tutorial
---

The Spyglass tutorial notebooks walk through every pipeline end to end, from setup and
data ingestion through spike sorting, position tracking, LFP analysis, and neural
decoding. They are listed in the navigation, grouped by pipeline. Every notebook can be
read here; most can also be run from here.

:::{figure alt="The tutorial notebooks grouped by pipeline, in the order to run them. Green notebooks run on this site; dashed grey notebooks need a separate environment, with the reason under each."} ./images/notebook-workflow.svg
The tutorial notebooks by pipeline, in the order to run them. Green notebooks run on
this site; grey ones need a separate environment.
:::

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

:::{figure alt="The notebooks that run on this site, by section, with what each one does and any changes made for this site."} ./images/notebooks-on-site.svg
The notebooks that run on this site, with what each one does. Green notes say what
differs on this site.
:::

### Get Started

To get started, open the [](./notebooks/00_Spyglass_Smoke_Test.ipynb) notebook and hit the "Run" button. It will launch your server and open the smoke test notebook. Run that notebook as normal to checks that the server is ready and data is available.

:::{figure alt="To get started, open the notebook. It checks that the server is ready and data is available."} ./images/tldr-go-to-smoke-test.png
To get started, open the notebook. It checks that the server is ready and data is available.
:::

## What needs a separate environment

These notebooks need data, hardware or lab infrastructure the hosted servers don't
have. Each has a note at the top saying why. You can still read them here, and run them
in your own Spyglass installation.

:::{figure #fig-notebooks-separate-environment alt="The notebooks that need a separate environment, by section, with what each one does and what it needs."} ./images/notebooks-separate-environment.svg
The notebooks that need a separate environment, with what each one does and needs.
:::

To set up that environment, follow [Local Machine Setup](./notebooks/00_Setup.ipynb). It
covers installing Spyglass, the optional dependencies these notebooks use (DeepLabCut,
keypoint-MoSeq, and `jax` for decoding on a GPU), and setting up a database, either your
own with Docker or an existing lab server. The 32 GB `mediumnwb20230802.nwb` recording is
linked from [Insert Data](./notebooks/02_Insert_Data.ipynb). The Frank Lab recordings
used by `12`, `21`, `22` and `60` aren't linked from the notebooks.

## Running Spyglass on your own machine

To install Spyglass and set up its database yourself, follow
[Local Machine Setup](./notebooks/00_Setup.ipynb), or the
[Spyglass installation guide](https://lorenfranklab.github.io/spyglass/). The
environment used on this site, including its pinned package versions, is in the
downloadable MECA bundle, under `binder/`.
