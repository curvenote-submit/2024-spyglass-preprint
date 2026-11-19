---
title: "Spyglass: A Reproducible & Interactive Preprint"
subtitle: An interactive companion to the Spyglass neuroscience data analysis framework
abstract: >-
  Scientific progress depends on reliable and reproducible results, which are
  accelerated when data are shared and re-analyzed to address new questions.
  Current approaches to storing and analyzing neural data involve bespoke formats
  and software that make replication and reuse difficult. Spyglass is an
  open-source data management and analysis framework, written in Python, that
  addresses this need. It uses the Neurodata Without Borders (NWB) standard and
  DataJoint-managed relational pipelines to provide reproducible analyses for
  common neuroscience tasks — spectral filtering, spike sorting, pose tracking,
  and neural decoding — and to support sharing of raw data, intermediate results,
  and final outputs within and across labs. This site is an interactive,
  executable companion to the original preprint: the Spyglass tutorial
  notebooks, at the version of Spyglass the preprint describes, with an
  environment you can launch in your browser.
---

## About this site

This site is an **interactive companion** to the preprint
[*"Spyglass: a framework for reproducible and shareable neuroscience research"*](https://www.biorxiv.org/content/10.1101/2024.01.25.577295v5)
[@Lee2024spyglass]. The preprint describes Spyglass; this site
lets you use it. It brings together the Spyglass tutorial notebooks, which walk through
every pipeline the paper describes, and a ready-made environment to run them in, so you
can try the framework without installing anything.

The paper argues that neuroscience needs shareable, reproducible analysis pipelines.
This site aims to practice what the paper preaches: the tutorials are not just
described, but can be run and inspected directly. See [Tutorial 101](./tutorial-101.md) for
what runs here.

**Looking for the paper itself?** Read the full preprint on bioRxiv:
[biorxiv.org/content/10.1101/2024.01.25.577295v5](https://www.biorxiv.org/content/10.1101/2024.01.25.577295v5)

## What is Spyglass?

Reproducing a neuroscience analysis end-to-end is hard in practice: raw data is rarely
shared, critical metadata and manual curation steps go undocumented, and analysis
parameters are often buried in one-off scripts. **Spyglass** is an open-source,
Python-based data management and analysis framework built to close this gap. It
combines:

- **[NWB (Neurodata Without Borders)](https://www.nwb.org/)** as the standardized data
  format for all raw and intermediate data, so every file is self-describing and
  immediately shareable (e.g. via [DANDI](https://dandiarchive.org/)).
- **[DataJoint](https://datajoint.com/)**, a relational database framework, to define
  analysis pipelines as dependency-tracked database tables. Populating a table runs the
  analysis; the table row records exactly which data and parameters produced it.
- **Kachery** and **Figurl** for peer-to-peer data sharing and interactive, web-based
  visualizations that can be explored in any browser without local software.

### Pipeline design: four table types

Spyglass pipelines are built from four kinds of DataJoint tables that separate *what*
you want to compute from *how* it gets computed:

- **Data tables** — pointers to data objects (from the raw NWB file or an upstream
  analysis step).
- **Parameter tables** — named, reusable sets of parameters for an analysis.
- **Selection tables** — pair a data entry with a parameter entry, defining a specific
  job to run.
- **Compute tables** — execute the analysis for a given Selection entry and store the
  result (often as a new NWB file), which can itself feed downstream pipelines.

This structure makes it easy to apply multiple parameter sets — or entirely different
algorithms — to the same data and compare results, while keeping full provenance of
which data and parameters produced every output.

### Built-in pipelines

Spyglass ships with ready-to-use pipelines for common systems-neuroscience workflows,
integrating community packages like
[SpikeInterface](https://github.com/SpikeInterface/spikeinterface),
[GhostiPy](https://github.com/kemerelab/ghostipy), [DeepLabCut](https://www.mackenziemathislab.org/deeplabcut),
[MoSeq](https://github.com/dattalab/moseq2-app), and [Pynapple](https://github.com/pynapple-org/pynapple):

| Pipeline | Purpose |
|---|---|
| Spectral / LFP | Filter broadband voltage traces into LFP and theta bands; detect sharp-wave ripples |
| Spike sorting | Detect and sort spikes from extracellular recordings, with manual/automatic curation |
| Position processing | Track animal position from video (Trodes, DeepLabCut), linearize track position |
| Neural decoding | Fit state-space models to decode latent position from spiking activity |
| MUA / MoSeq | Detect multiunit activity events; behavioral pose sequencing |

The framework is extensible — new pipelines can be added for other NWB-compatible data
types (e.g. photometry, optical physiology).

### Sharing, reproducibility, and export

Beyond running analyses, Spyglass provides tooling to make results reproducible and
shareable end to end:

- An **Export** system that traces every table entry touched while generating a
  manuscript's figures, and packages the corresponding raw and intermediate NWB files
  for upload to [DANDI](https://dandiarchive.org/).
- A **Docker export** template (`spyglass-export-docker`) that packages a populated
  database and matching Python environment into shareable containers with a linked
  JupyterHub.
- **Kachery**, for controlled, peer-to-peer sharing of NWB files among named
  collaborators without a central file host.
- **Figurl**, for generating shareable URLs to interactive, web-based visualizations of
  pipeline outputs (e.g. spike sorting curation, decoding results).

### Cross-lab replication demo

The paper demonstrates Spyglass's generalizability by applying the same clusterless
state-space decoding pipeline to hippocampal recordings from **two different labs** (UCSF
and the Buzsáki lab at NYU, both available on DANDI). The pipeline successfully
recovered known theta-sequence dynamics in both datasets, and applied to a
medial-septum cooling manipulation in the NYU dataset, revealed a previously
uncharacterized effect: cooling reduced the extent and rate of decoded-position
deviation from the animal's true position, despite leaving single-neuron spatial tuning
unaffected — illustrating how a shared, reproducible pipeline can both replicate prior
results and surface new findings from existing data.

## Links & resources

- Original preprint (bioRxiv): [10.1101/2024.01.25.577295v5](https://www.biorxiv.org/content/10.1101/2024.01.25.577295v5)
- Spyglass source & tutorials: [github.com/LorenFrankLab/spyglass](https://github.com/LorenFrankLab/spyglass)
- Code for the paper's Figure 5 (cross-lab decoding demo): [github.com/LorenFrankLab/spyglass-paper](https://github.com/LorenFrankLab/spyglass-paper)
- Data: Frank lab dataset [DANDI:000937](https://dandiarchive.org/dandiset/000937); Buzsáki lab dataset [DANDI:000059](https://dandiarchive.org/dandiset/000059)

## Citation

> Lee, K.H., Denovellis, E.L., Ly, R., Magland, J., Soules, J., Comrie, A.E., et al., &
> Frank, L.M. (2024). Spyglass: a framework for reproducible and shareable neuroscience
> research. *bioRxiv* 2024.01.25.577295. https://doi.org/10.1101/2024.01.25.577295
