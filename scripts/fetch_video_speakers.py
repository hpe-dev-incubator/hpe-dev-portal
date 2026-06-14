#!/usr/bin/env python3
"""
Resolve speaker/author names for all video markdown files — no API key required.

Resolution order (stops at first success):
  1. Cross-reference matching content/event/ file (matched by YouTube ID in event
     frontmatter `link` field), extract person names from event body text.
  2. Fetch YouTube video description via yt-dlp (no API key), parse speaker patterns.
  3. Flag for manual review if both sources yield nothing.

Files already having a non-generic author value are skipped entirely.
Generic values treated as unset: "HPE Developer Team", "HPE Developer", "HPE", ""

────────────────────────────────────────────────────────────────────────────────
SETUP (one-time)
────────────────────────────────────────────────────────────────────────────────
  # Activate the project virtualenv
  source .venv/bin/activate

  # Install dependencies (if not already installed)
  pip install yt-dlp pyyaml

────────────────────────────────────────────────────────────────────────────────
USAGE
────────────────────────────────────────────────────────────────────────────────
  # Dry-run: event cross-reference only (fast, no network calls, offline)
  .venv/bin/python scripts/fetch_video_speakers.py --skip-ytdlp

  # Dry-run: event cross-ref + yt-dlp fallback for remaining videos (~1 min)
  .venv/bin/python scripts/fetch_video_speakers.py

  # Apply resolved names: event cross-ref + yt-dlp, write to markdown files
  .venv/bin/python scripts/fetch_video_speakers.py --update

  # Apply resolved names: event cross-ref only (skip yt-dlp), write to files
  .venv/bin/python scripts/fetch_video_speakers.py --skip-ytdlp --update

────────────────────────────────────────────────────────────────────────────────
OPTIONS
────────────────────────────────────────────────────────────────────────────────
  --update      Write the resolved author name back into each markdown file.
                Without this flag, the script is a dry-run (prints only, no writes).

  --skip-ytdlp  Skip the yt-dlp YouTube fetch pass. Uses event cross-referencing
                only. Much faster (no network calls). Resolves fewer files but with
                zero rate-limiting risk.

────────────────────────────────────────────────────────────────────────────────
OUTPUT
────────────────────────────────────────────────────────────────────────────────
  The script prints a table:
    - "event"          → resolved from a matching content/event/ file
    - "yt-dlp"         → resolved from YouTube video description
    - "yt-dlp uploader"→ resolved from YouTube channel/uploader name
    - [MANUAL REVIEW]  → no name found; check the printed description preview

  After resolving, edit remaining files manually:
    content/video/<slug>.md  →  change the `author:` field

────────────────────────────────────────────────────────────────────────────────
"""

import argparse
import re
import sys
import time
from pathlib import Path

import yaml

try:
    import yt_dlp
    HAS_YTDLP = True
except ImportError:
    HAS_YTDLP = False

CONTENT_VIDEO_DIR = Path(__file__).parent.parent / "content" / "video"
CONTENT_EVENT_DIR = Path(__file__).parent.parent / "content" / "event"

GENERIC_AUTHORS = {
    "hpe developer team",
    "hpe developer",
    "hpe",
    "",
}

# Structured patterns to find person names in event body text and YouTube descriptions.
# Intentionally conservative — only patterns with very low false-positive risk.
#
# IMPORTANT: Use (?-i:...) around the name capture group so that [A-Z] stays
# case-sensitive even when re.IGNORECASE is set on the pattern. This prevents
# lowercase connectors like "and" from being greedily captured into the name.
_N = r"(?-i:([A-Z][a-z]+(?: [A-Z][a-z]+)+))"  # case-sensitive name capture

SPEAKER_PATTERNS = [
    # "Speaker: Name" / "Presented by Name" / "Host: Name"
    re.compile(rf"(?:Speaker|Presenter|Presented by|Host|Author)[:\s]+{_N}", re.IGNORECASE),
    # "Name from [the/our] HPE ..."
    re.compile(rf"{_N}\s+from\s+(?:the\s+|our\s+)?HPE\b", re.IGNORECASE),
    # "Name (a former HPE ...)" / "Name (HPE ...)"
    re.compile(rf"{_N}\s+\((?:a (?:former|current) )?HPE\b", re.IGNORECASE),
    # "Name of Hewlett Packard ..."
    re.compile(rf"{_N}\s+of\s+Hewlett\b", re.IGNORECASE),
    # "Name, HPE Senior/Principal/Distinguished/Director ..."
    re.compile(rf"{_N},\s+(?:HPE |Senior |Principal |Chief |Distinguished )", re.IGNORECASE),
    # "to hear/see Name discuss/present/talk/demonstrate"
    re.compile(rf"(?:to hear|to see|hear)\s+{_N}\s+(?:discuss|present|talk|walk|demonstrate|explore|share)", re.IGNORECASE),
]

GENERIC_UPLOADERS = {
    "hpe developer",
    "hpe",
    "hewlett packard enterprise",
    "hpe technology",
}

# Regex to extract YouTube ID from a URL
YT_ID_RE = re.compile(r"(?:youtube\.com/watch\?v=|youtu\.be/)([A-Za-z0-9_-]{11})")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def parse_frontmatter(file_path: Path):
    content = file_path.read_text(encoding="utf-8")
    if not content.startswith("---"):
        return {}, content
    parts = content.split("---", 2)
    if len(parts) < 3:
        return {}, content
    fm = yaml.safe_load(parts[1]) or {}
    return fm, parts[2]


def write_frontmatter(file_path: Path, fm: dict, body: str):
    dumped = yaml.dump(fm, default_flow_style=False, allow_unicode=True, sort_keys=False)
    file_path.write_text(f"---\n{dumped}---{body}", encoding="utf-8")


def _is_proper_name(s: str) -> bool:
    """Return True if every word in s starts with an uppercase letter.
    This guards against IGNORECASE regex capturing lowercase words like 'and'.
    """
    words = s.split()
    return (
        2 <= len(words) <= 3
        and all(len(w) >= 2 for w in words)
        and all(w[0].isupper() for w in words)
    )


def extract_names_from_text(text: str) -> list[str]:
    """
    Extract likely person names from free-form text using structured patterns only.
    Returns a list of matched names (empty if nothing matches).
    No generic word-pair fallback — structured patterns only to avoid false positives.
    """
    if not text:
        return []

    # Common English nouns/adjectives that appear in titles but are not person-name words
    NON_NAME_WORDS = {
        "revolutionary", "innovative", "powerful", "scalable", "secure", "advanced",
        "comprehensive", "complete", "critical", "enterprise", "platform", "solution",
        "approach", "strategy", "session", "webinar", "workshop", "demo", "panel",
        "team", "group", "series", "community", "network", "system", "service",
        # Job titles that can appear before "of Hewlett" / "from HPE"
        "deputy", "director", "senior", "principal", "chief", "vice", "president",
        "executive", "manager", "engineer", "architect", "fellow", "distinguished",
        "officer", "lead", "head",
    }

    found = []
    seen = set()
    for pattern in SPEAKER_PATTERNS:
        for match in pattern.finditer(text):
            name = match.group(1).strip()
            if (
                _is_proper_name(name)
                and not any(w.lower() in NON_NAME_WORDS for w in name.split())
                and name not in seen
            ):
                seen.add(name)
                found.append(name)
    return found


def fetch_video_info_ytdlp(video_id: str) -> dict | None:
    """Fetch YouTube video metadata using yt-dlp (no API key required)."""
    if not HAS_YTDLP:
        return None
    url = f"https://www.youtube.com/watch?v={video_id}"
    ydl_opts = {"quiet": True, "no_warnings": True, "skip_download": True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get("title", ""),
                "description": info.get("description", ""),
                "uploader": info.get("uploader", ""),
            }
    except Exception as exc:
        print(f"    [WARN] yt-dlp failed for {video_id}: {exc}", file=sys.stderr)
        return None


# ---------------------------------------------------------------------------
# Build event lookup: youtube_id -> event body text
# ---------------------------------------------------------------------------

def build_event_lookup() -> dict[str, str]:
    """Return {youtube_id: event_body_text} for all event files."""
    lookup = {}
    for ef in CONTENT_EVENT_DIR.glob("*.md"):
        text = ef.read_text(encoding="utf-8")
        parts = text.split("---", 2)
        if len(parts) < 3:
            continue
        fm = yaml.safe_load(parts[1]) or {}
        link = fm.get("link", "") or ""
        m = YT_ID_RE.search(link)
        if m:
            lookup[m.group(1)] = parts[2].strip()
    return lookup


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    parser = argparse.ArgumentParser(
        description="Resolve speaker author names for video markdown files"
    )
    parser.add_argument("--update", action="store_true", help="Write resolved authors into markdown files")
    parser.add_argument("--skip-ytdlp", action="store_true", help="Skip yt-dlp fallback (event cross-ref only)")
    args = parser.parse_args()

    if not HAS_YTDLP and not args.skip_ytdlp:
        print("[WARN] yt-dlp not installed — running event cross-ref only. Install with: pip install yt-dlp")

    md_files = sorted(CONTENT_VIDEO_DIR.glob("*.md"))
    print(f"Found {len(md_files)} video markdown files")

    needs_resolution = []
    skipped = []

    for path in md_files:
        fm, body = parse_frontmatter(path)
        author = str(fm.get("author", "")).strip()
        youtubeid = str(fm.get("youtubeid", "")).strip()
        if not youtubeid:
            skipped.append((path.name, "no youtubeid"))
            continue
        if author.lower() not in GENERIC_AUTHORS:
            skipped.append((path.name, f"already set: {author!r}"))
            continue
        needs_resolution.append((path, fm, body, youtubeid))

    print(f"Needs resolution: {len(needs_resolution)} | Already set (skipped): {len(skipped)}\n")

    if not needs_resolution:
        print("Nothing to do.")
        return

    # Pass 1: event file cross-referencing
    print("Pass 1: Cross-referencing content/event/ files …")
    event_lookup = build_event_lookup()
    print(f"  Event lookup contains {len(event_lookup)} YouTube ID → event body entries\n")

    after_pass1 = []  # files still needing resolution after pass 1

    pass1_resolved = []

    for path, fm, body, vid_id in needs_resolution:
        event_body = event_lookup.get(vid_id)
        if event_body:
            names = extract_names_from_text(event_body)
            if names:
                speaker = " & ".join(names[:2])  # cap at 2 speakers
                pass1_resolved.append((path, fm, body, vid_id, speaker, "event"))
                continue
        after_pass1.append((path, fm, body, vid_id))

    print(f"  Resolved via event cross-ref: {len(pass1_resolved)}")
    print(f"  Remaining after pass 1:       {len(after_pass1)}\n")

    # Pass 2: yt-dlp fallback
    pass2_resolved = []
    unresolved = []
    failed = []

    if after_pass1 and not args.skip_ytdlp and HAS_YTDLP:
        print(f"Pass 2: Fetching YouTube descriptions via yt-dlp for {len(after_pass1)} remaining videos …")
        print("  (this may take a minute at ~0.5s per video)\n")

        for path, fm, body, vid_id in after_pass1:
            info = fetch_video_info_ytdlp(vid_id)
            time.sleep(0.5)
            if not info:
                failed.append((path, fm, body, vid_id, "", ""))
                continue
            names = extract_names_from_text(info["description"])
            if names:
                speaker = " & ".join(names[:2])
                pass2_resolved.append((path, fm, body, vid_id, speaker, "yt-dlp"))
            elif info["uploader"] and info["uploader"].lower() not in GENERIC_UPLOADERS:
                pass2_resolved.append((path, fm, body, vid_id, info["uploader"], "yt-dlp uploader"))
            else:
                unresolved.append((path, fm, body, vid_id, info["title"], info["description"][:300]))
    else:
        unresolved = [(p, f, b, v, "", "") for p, f, b, v in after_pass1]

    # --- Combined report ---
    all_resolved = pass1_resolved + pass2_resolved

    print(f"\n{'='*130}")
    print(f"{'File':<55} {'Source':<14} {'Resolved Author'}")
    print("-" * 130)

    for path, fm, body, vid_id, speaker, source in all_resolved:
        print(f"{path.name:<55} {source:<14} {speaker}")

    print(f"\n{'='*130}")
    print(
        f"Resolved: {len(all_resolved)} "
        f"(event: {len(pass1_resolved)}, yt-dlp: {len(pass2_resolved)}) | "
        f"Manual review: {len(unresolved)} | "
        f"Fetch failed: {len(failed)}"
    )

    if unresolved:
        print(f"\n{'='*130}")
        print("MANUAL REVIEW NEEDED:\n")
        for path, fm, body, vid_id, yt_title, desc_preview in unresolved:
            print(f"  File:    {path.name}")
            if yt_title:
                print(f"  Title:   {yt_title}")
            print(f"  VideoID: {vid_id}")
            if desc_preview:
                print(f"  Desc:    {desc_preview!r}")
            print()

    # --- Write ---
    if args.update and all_resolved:
        print(f"\nUpdating {len(all_resolved)} markdown files …")
        for path, fm, body, vid_id, speaker, source in all_resolved:
            fm["author"] = speaker
            write_frontmatter(path, fm, body)
            print(f"  {path.name:<55} →  {speaker!r}")
        print("Done.")
    elif all_resolved:
        print(f"\nRun with --update to write {len(all_resolved)} resolved names into the markdown files.")


if __name__ == "__main__":
    main()
