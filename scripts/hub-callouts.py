"""Add a callout to the top of upstream notebooks that don't run (or don't fully
run) on the BinderHub, and retitle 00_Setup.

Run after scripts/sync-notebooks.sh. Each callout is a markdown cell tagged
`hub-callout`, inserted after the notebook's title cell; notebooks that already
have one are left alone. Notebooks maintained in this repository (KEEP in
sync-notebooks.sh) carry their hub notes in the file itself.
"""

import json
import sys
from pathlib import Path

NOTEBOOKS = Path(__file__).resolve().parent.parent / "notebooks"

NOT_ON_HUB = "This notebook doesn't run on this hub"
SMOKE = "[00_Spyglass_Smoke_Test](./00_Spyglass_Smoke_Test.ipynb)"
MEDIUM = (
    "It uses `mediumnwb20230802.nwb`, a 32 GB recording, and results from running "
    "the earlier pipelines on it. That file isn't on this hub's shared data disk, "
    "which holds only `minirec20230622.nwb`."
)
DLC = (
    "It needs DeepLabCut, which isn't installed here, a GPU, which this hub doesn't "
    "have, and Frank Lab recordings that aren't on this hub."
)

CALLOUTS = {
    "00_Setup": ("note", "Only needed on your own computer",
        "This notebook explains how to install Spyglass and set up its database on your "
        "own machine. On this hub that is already done: Spyglass is installed and each "
        f"server has its own database. Start with {SMOKE} instead."),
    "03_Data_Sync": ("warning", NOT_ON_HUB,
        "Syncing data needs a lab's sharing setup: a Kachery zone with its credentials, "
        "a resource daemon serving that zone, and a database shared by the whole lab. "
        "Each server on this hub is a temporary container with its own database and no "
        "Kachery account, so you can read this notebook but not run it."),
    "10_Spike_SortingV0": ("note", "Runs on this hub except the last step",
        "Every step runs with `minirec20230622.nwb` except the last two code cells, which "
        "make a FigURL curation view. That needs a registered Kachery account, so here "
        "those cells fail with `Client not registered`. This is the legacy pipeline; "
        "[10_Spike_SortingV1](./10_Spike_SortingV1.ipynb) is the current one."),
    "11_Spike_Sorting_Analysis": ("warning", NOT_ON_HUB, MEDIUM),
    "12_Burst_Merge_Curation": ("warning", NOT_ON_HUB,
        "It uses `eliot20221022_.nwb`, a Frank Lab recording that isn't on this hub."),
    "21_DLC": ("warning", NOT_ON_HUB, DLC),
    "22_DLC_Loop": ("warning", NOT_ON_HUB, DLC),
    "32_Ripple_Detection": ("warning", NOT_ON_HUB, MEDIUM),
    "50_MUA_Detection": ("warning", NOT_ON_HUB, MEDIUM),
    "60_MoSeq": ("warning", NOT_ON_HUB,
        "It needs keypoint-MoSeq, which isn't installed here, and a Frank Lab recording "
        "(`SC100020230912_.nwb`) that isn't on this hub."),
}

# Shown in the table of contents; the filename stays, as most notebooks link to it.
TITLES = {"00_Setup": ("# Setup", "# Local Machine Setup")}

for name, (kind, title, body) in CALLOUTS.items():
    path = NOTEBOOKS / f"{name}.ipynb"
    if not path.exists():
        sys.exit(f"{path.name} not found: upstream renamed or removed it; update CALLOUTS")
    nb = json.loads(path.read_text())
    if any("hub-callout" in c["metadata"].get("tags", []) for c in nb["cells"]):
        continue
    if name in TITLES:
        old, new = TITLES[name]
        src = nb["cells"][0]["source"]
        if not src[0].startswith(old):
            sys.exit(f"{path.name}: first line isn't {old!r}; update TITLES")
        src[0] = src[0].replace(old, new, 1)
    source = f":::{{{kind}}} {title}\n{body}\n:::".splitlines(keepends=True)
    cell = {"cell_type": "markdown", "metadata": {"tags": ["hub-callout"]}, "source": source}
    if "id" in nb["cells"][0]:
        cell = {"cell_type": "markdown", "id": "hub-callout", **cell}
    nb["cells"].insert(1, cell)
    path.write_text(json.dumps(nb, indent=1, ensure_ascii=False) + "\n")
    print(f"Added hub callout to {path.name}")
