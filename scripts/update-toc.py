"""Regenerate the table of contents in curvenote.yml from the notebooks/ folder.

Notebooks are grouped by the first digit of their filename, following the
batches in the Spyglass notebooks README. index.md comes first and
data-review.md last.
"""

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

SECTIONS = {
    "0": "Getting Started",
    "1": "Spike Sorting Pipeline",
    "2": "Position Pipeline",
    "3": "LFP Pipeline",
    "4": "Decoding Pipeline",
    "5": "MUA Detection",
    "6": "Behavior Syllables",
}

groups = {}
for notebook in sorted((ROOT / "notebooks").glob("[0-9]*.ipynb")):
    groups.setdefault(notebook.name[0], []).append(notebook.name)

lines = ["  toc:", "    - file: index.md"]
for digit, names in sorted(groups.items()):
    if digit not in SECTIONS:
        sys.exit(f"No TOC section title for notebooks starting with {digit}: {names}")
    lines += [f"    - title: {SECTIONS[digit]}", "      children:"]
    lines += [f"        - file: notebooks/{name}" for name in names]
lines.append("    - file: data-review.md")

config = ROOT / "curvenote.yml"
text, count = re.subn(
    r"^  toc:\n(?:    .*\n)*", "\n".join(lines) + "\n", config.read_text(), flags=re.M
)
if count != 1:
    sys.exit("Could not find project.toc in curvenote.yml")
config.write_text(text)
print(f"Updated curvenote.yml toc with {sum(map(len, groups.values()))} notebooks")
