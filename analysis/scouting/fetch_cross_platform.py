#!/usr/bin/env python3
"""Collect a source-backed cross-platform music-chart snapshot.

The script intentionally ingests only sources that are publicly readable and
machine-verifiable at collection time:

* Apple Music China Top 100 (Apple's official RSS/Marketing Tools feed)
* NetEase Cloud Music charts exposed by music.163.com

Spotify, Douyin music and short-video sound/effect signals are represented in
the source-availability manifest only.  No ranks, play counts, usage counts or
trend values are invented for gated/manual sources.

Outputs are written to ``public/data/scouting/cross-platform`` as both a dated
immutable snapshot and a stable ``current`` copy.  Raw responses are retained
under ``analysis/scouting/source/cross-platform`` for auditability.
"""

from __future__ import annotations

import argparse
import csv
import json
import shutil
import sys
import time
import urllib.error
import urllib.request
from dataclasses import dataclass
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any, Iterable
from zoneinfo import ZoneInfo


SHANGHAI = ZoneInfo("Asia/Shanghai")
PROJECT_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_PUBLIC_DIR = PROJECT_ROOT / "public" / "data" / "scouting" / "cross-platform"
DEFAULT_RAW_DIR = Path(__file__).resolve().parent / "source" / "cross-platform"

APPLE_URL = "https://rss.marketingtools.apple.com/api/v2/cn/music/most-played/100/songs.json"
APPLE_PAGE_URL = "https://music.apple.com/cn/new/top-charts"


@dataclass(frozen=True)
class NetEaseChart:
    key: str
    chart_id: int
    expected_name: str
    expected_cadence: str

    @property
    def endpoint(self) -> str:
        return f"https://music.163.com/api/playlist/detail?id={self.chart_id}&n=100"

    @property
    def page_url(self) -> str:
        return f"https://music.163.com/discover/toplist?id={self.chart_id}"


NETEASE_CHARTS = (
    NetEaseChart("rising", 19723756, "飙升榜", "daily"),
    NetEaseChart("new", 3779629, "新歌榜", "daily"),
    NetEaseChart("original", 2884035, "原创榜", "weekly"),
    NetEaseChart("potential", 5338990334, "潜力爆款榜", "weekly"),
    NetEaseChart("realtime_share", 18176153161, "实时分享榜", "hourly"),
)

CSV_FIELDS = (
    "snapshot_id",
    "collected_at",
    "chart_date",
    "platform",
    "market",
    "chart_key",
    "chart_name",
    "chart_id",
    "chart_size",
    "rank",
    "rank_percentile",
    "track_id",
    "track_name",
    "artist_id",
    "artist_name",
    "album_id",
    "album_name",
    "release_date",
    "genres",
    "previous_rank",
    "movement",
    "track_url",
    "artwork_url",
    "source_page_url",
    "source_data_url",
)


def iso_shanghai(value: datetime) -> str:
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(SHANGHAI).isoformat(timespec="seconds")


def epoch_ms_to_iso(value: Any) -> str | None:
    if not isinstance(value, (int, float)) or value <= 0:
        return None
    try:
        return iso_shanghai(datetime.fromtimestamp(value / 1000, tz=timezone.utc))
    except (OverflowError, OSError, ValueError):
        return None


def epoch_ms_to_date(value: Any) -> str | None:
    timestamp = epoch_ms_to_iso(value)
    return timestamp[:10] if timestamp else None


def fetch_json(url: str, timeout: int, attempts: int = 3) -> dict[str, Any]:
    request = urllib.request.Request(
        url,
        headers={
            "Accept": "application/json,text/plain,*/*",
            "Referer": "https://music.163.com/",
            "User-Agent": "Cassie-Zha-Portfolio-Research/1.1 (+source-backed chart snapshot)",
        },
    )
    last_error: Exception | None = None
    for attempt in range(1, attempts + 1):
        try:
            with urllib.request.urlopen(request, timeout=timeout) as response:
                if response.status != 200:
                    raise RuntimeError(f"HTTP {response.status} for {url}")
                charset = response.headers.get_content_charset() or "utf-8"
                return json.loads(response.read().decode(charset))
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError, RuntimeError) as exc:
            last_error = exc
            if attempt < attempts:
                time.sleep(attempt)
    raise RuntimeError(f"Failed to fetch {url} after {attempts} attempts: {last_error}")


def rank_percentile(rank: int, chart_size: int) -> float:
    """Return a comparable 1..100 in-chart percentile (higher is better)."""
    if chart_size <= 0 or rank < 1 or rank > chart_size:
        raise ValueError(f"Invalid rank/chart size: {rank}/{chart_size}")
    return round(100 * (chart_size - rank + 1) / chart_size, 2)


def normalize_apple(
    payload: dict[str, Any], snapshot_id: str, collected_at: str
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    feed = payload.get("feed")
    if not isinstance(feed, dict):
        raise ValueError("Apple response is missing feed")
    results = feed.get("results")
    if not isinstance(results, list) or not results:
        raise ValueError("Apple response contains no chart results")

    updated = parsedate_to_datetime(feed["updated"])
    source_updated_at = iso_shanghai(updated)
    chart_date = source_updated_at[:10]
    chart_size = len(results)
    rows: list[dict[str, Any]] = []
    for rank, track in enumerate(results, start=1):
        genres = [genre.get("name", "") for genre in track.get("genres", []) if genre.get("name")]
        rows.append(
            {
                "snapshot_id": snapshot_id,
                "collected_at": collected_at,
                "chart_date": chart_date,
                "platform": "apple_music",
                "market": str(feed.get("country") or "cn").upper(),
                "chart_key": "cn_top_100",
                "chart_name": str(feed.get("title") or "Apple Music 中国热门歌曲 Top 100"),
                "chart_id": "apple_music_cn_most_played_100",
                "chart_size": chart_size,
                "rank": rank,
                "rank_percentile": rank_percentile(rank, chart_size),
                "track_id": str(track.get("id") or ""),
                "track_name": str(track.get("name") or ""),
                "artist_id": str(track.get("artistId") or ""),
                "artist_name": str(track.get("artistName") or ""),
                "album_id": "",
                "album_name": "",
                "release_date": track.get("releaseDate"),
                "genres": " | ".join(genres),
                "previous_rank": None,
                "movement": None,
                "track_url": str(track.get("url") or ""),
                "artwork_url": str(track.get("artworkUrl100") or ""),
                "source_page_url": APPLE_PAGE_URL,
                "source_data_url": APPLE_URL,
            }
        )

    meta = {
        "platform": "apple_music",
        "chart_key": "cn_top_100",
        "chart_name": rows[0]["chart_name"],
        "market": "CN",
        "source_updated_at": source_updated_at,
        "chart_date": chart_date,
        "rows": chart_size,
        "source_page_url": APPLE_PAGE_URL,
        "source_data_url": APPLE_URL,
        "source_class": "official_public_machine_readable",
        "notes": "Apple official RSS/Marketing Tools feed; rank is array order.",
    }
    return rows, meta


def netease_result(payload: dict[str, Any]) -> dict[str, Any]:
    if payload.get("code") != 200:
        raise ValueError(f"NetEase response code is not 200: {payload.get('code')}")
    result = payload.get("result") or payload.get("playlist")
    if not isinstance(result, dict):
        raise ValueError("NetEase response is missing result/playlist")
    return result


def normalize_netease(
    chart: NetEaseChart,
    payload: dict[str, Any],
    snapshot_id: str,
    collected_at: str,
) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    result = netease_result(payload)
    tracks = result.get("tracks")
    if not isinstance(tracks, list) or not tracks:
        raise ValueError(f"NetEase {chart.expected_name} contains no tracks")
    if int(result.get("id") or 0) != chart.chart_id:
        raise ValueError(f"NetEase chart id mismatch for {chart.key}")
    actual_name = str(result.get("name") or "")
    if actual_name != chart.expected_name:
        raise ValueError(f"NetEase chart name mismatch: expected {chart.expected_name}, got {actual_name}")

    chart_size = len(tracks)
    source_updated_at = epoch_ms_to_iso(result.get("updateTime"))
    chart_date = source_updated_at[:10] if source_updated_at else collected_at[:10]
    rows: list[dict[str, Any]] = []
    for rank, track in enumerate(tracks, start=1):
        artists = track.get("artists") or []
        album = track.get("album") or {}
        previous_rank_raw = track.get("lastRank")
        previous_rank = previous_rank_raw if isinstance(previous_rank_raw, int) and previous_rank_raw > 0 else None
        movement = previous_rank - rank if previous_rank is not None else None
        rows.append(
            {
                "snapshot_id": snapshot_id,
                "collected_at": collected_at,
                "chart_date": chart_date,
                "platform": "netease_cloud_music",
                "market": "CN",
                "chart_key": chart.key,
                "chart_name": actual_name,
                "chart_id": str(chart.chart_id),
                "chart_size": chart_size,
                "rank": rank,
                "rank_percentile": rank_percentile(rank, chart_size),
                "track_id": str(track.get("id") or ""),
                "track_name": str(track.get("name") or ""),
                "artist_id": " | ".join(str(artist.get("id") or "") for artist in artists),
                "artist_name": " | ".join(str(artist.get("name") or "") for artist in artists),
                "album_id": str(album.get("id") or ""),
                "album_name": str(album.get("name") or ""),
                "release_date": epoch_ms_to_date(track.get("publishTime")),
                "genres": "",
                "previous_rank": previous_rank,
                "movement": movement,
                "track_url": f"https://music.163.com/song?id={track.get('id')}",
                "artwork_url": str(album.get("picUrl") or ""),
                "source_page_url": chart.page_url,
                "source_data_url": chart.endpoint,
            }
        )

    declared_count = result.get("trackCount")
    description = str(result.get("description") or "")
    caveats: list[str] = []
    if isinstance(declared_count, int) and declared_count != chart_size:
        caveats.append(f"declared trackCount={declared_count}, returned rows={chart_size}")
    if "100首" in description and chart_size != 100:
        caveats.append(f"chart description says 100 tracks, endpoint returned {chart_size}")

    meta = {
        "platform": "netease_cloud_music",
        "chart_key": chart.key,
        "chart_id": chart.chart_id,
        "chart_name": actual_name,
        "market": "CN",
        "cadence": chart.expected_cadence,
        "source_updated_at": source_updated_at,
        "chart_date": chart_date,
        "rows": chart_size,
        "declared_track_count": declared_count,
        "description": description,
        "source_page_url": chart.page_url,
        "source_data_url": chart.endpoint,
        "source_class": "official_domain_public_undocumented_endpoint",
        "caveats": caveats,
        "notes": (
            "Public response from music.163.com. The endpoint is on the platform's official domain "
            "but is not treated as a documented developer API; schema/stability risk remains."
        ),
    }
    return rows, meta


def validate_rows(rows: list[dict[str, Any]], chart_meta: list[dict[str, Any]]) -> dict[str, Any]:
    errors: list[str] = []
    warnings: list[str] = []
    chart_checks: list[dict[str, Any]] = []

    for meta in chart_meta:
        key = (meta["platform"], meta["chart_key"])
        subset = [row for row in rows if (row["platform"], row["chart_key"]) == key]
        ranks = [int(row["rank"]) for row in subset]
        track_ids = [row["track_id"] for row in subset]
        sequential_ranks = ranks == list(range(1, len(subset) + 1))
        unique_ranks = len(ranks) == len(set(ranks))
        unique_tracks = len(track_ids) == len(set(track_ids))
        required_complete = all(row["track_id"] and row["track_name"] and row["artist_name"] for row in subset)
        percentile_valid = all(0 < float(row["rank_percentile"]) <= 100 for row in subset)
        if not sequential_ranks:
            errors.append(f"{key}: ranks are not sequential")
        if not unique_ranks:
            errors.append(f"{key}: duplicate ranks")
        if not unique_tracks:
            errors.append(f"{key}: duplicate track IDs")
        if not required_complete:
            errors.append(f"{key}: missing track ID/name/artist")
        if not percentile_valid:
            errors.append(f"{key}: invalid rank percentile")
        for caveat in meta.get("caveats", []):
            warnings.append(f"{key}: {caveat}")
        chart_checks.append(
            {
                "platform": key[0],
                "chart_key": key[1],
                "rows": len(subset),
                "sequential_ranks": sequential_ranks,
                "unique_ranks": unique_ranks,
                "unique_tracks": unique_tracks,
                "required_fields_complete": required_complete,
                "rank_percentile_valid": percentile_valid,
            }
        )

    composite_keys = [
        (row["snapshot_id"], row["platform"], row["chart_key"], row["track_id"]) for row in rows
    ]
    if len(composite_keys) != len(set(composite_keys)):
        errors.append("Duplicate snapshot/platform/chart/track composite key")

    return {
        "status": "pass" if not errors else "fail",
        "grain": "snapshot_id × platform × chart_key × track_id",
        "row_count": len(rows),
        "chart_count": len(chart_meta),
        "checks": chart_checks,
        "errors": errors,
        "warnings": warnings,
    }


def availability_manifest(snapshot_id: str, collected_at: str, chart_meta: list[dict[str, Any]]) -> dict[str, Any]:
    accessible_charts = [
        {
            "platform": meta["platform"],
            "chart_key": meta["chart_key"],
            "chart_name": meta["chart_name"],
            "rows": meta["rows"],
            "chart_date": meta["chart_date"],
            "source_class": meta["source_class"],
            "source_page_url": meta["source_page_url"],
        }
        for meta in chart_meta
    ]
    return {
        "schema_version": "1.0",
        "snapshot_id": snapshot_id,
        "collected_at": collected_at,
        "timezone": "Asia/Shanghai",
        "rank_percentile_definition": (
            "100 × (chart_size − rank + 1) ÷ chart_size; higher is better; "
            "this normalizes position within a chart, not audience size across platforms."
        ),
        "sources": [
            {
                "platform": "apple_music",
                "availability": "public_machine_readable",
                "ingestion": "automated",
                "values_in_snapshot": True,
                "officiality": "official Apple feed",
                "source_url": APPLE_URL,
                "limitations": "China market only in this snapshot; no public stream counts.",
            },
            {
                "platform": "netease_cloud_music",
                "availability": "public_official_domain_undocumented",
                "ingestion": "automated_with_schema_checks",
                "values_in_snapshot": True,
                "officiality": "music.163.com official domain; endpoint is not documented as a developer API",
                "source_url": "https://music.163.com/discover/toplist",
                "limitations": (
                    "Schema and availability may change; public rank order only. Popularity/score fields are "
                    "not used because their business definition is undocumented."
                ),
            },
            {
                "platform": "spotify",
                "availability": "gated",
                "ingestion": "manual_authorized_export_required",
                "values_in_snapshot": False,
                "officiality": "Spotify Charts",
                "source_url": "https://charts.spotify.com/home",
                "limitations": (
                    "Charts/downloads require an authenticated session and have no Mainland China chart. "
                    "Do not infer Global/HK/TW/SG/MY ranks without an authorized export."
                ),
            },
            {
                "platform": "douyin_music",
                "availability": "permission_gated",
                "ingestion": "official_open_platform_authorization_or_manual_capture_required",
                "values_in_snapshot": False,
                "officiality": "Douyin Open Platform capability",
                "source_url": "https://developer.open-douyin.com/capacity-center-page/capacity-detail/7180545630253629498",
                "limitations": "No rank, usage or growth values are emitted without granted API permission.",
            },
            {
                "platform": "short_video_sound_effects",
                "availability": "manual_observation_only",
                "ingestion": "manual_evidence_capture_required",
                "values_in_snapshot": False,
                "officiality": "no verified public official unified sound-effect chart identified",
                "source_url": None,
                "limitations": (
                    "Label any future sample '热门原声/音效观察（人工采集，非官方榜单）'; "
                    "retain screenshot, URL and capture time for every observation."
                ),
            },
        ],
        "accessible_charts": accessible_charts,
    }


def write_json(path: Path, value: Any) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def write_csv(path: Path, rows: Iterable[dict[str, Any]]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDS, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def copy_current(snapshot_dir: Path, public_dir: Path) -> None:
    for filename in ("charts.json", "charts.csv", "availability.json", "quality.json"):
        shutil.copyfile(snapshot_dir / filename, public_dir / f"current-{filename}")


def collect(public_dir: Path, raw_dir: Path, timeout: int) -> dict[str, Any]:
    now = datetime.now(SHANGHAI)
    snapshot_id = now.strftime("%Y%m%dT%H%M%S%z")
    collected_at = now.isoformat(timespec="seconds")
    snapshot_dir = public_dir / "snapshots" / snapshot_id
    raw_snapshot_dir = raw_dir / snapshot_id

    apple_payload = fetch_json(APPLE_URL, timeout)
    raw_snapshot_dir.mkdir(parents=True, exist_ok=True)
    write_json(raw_snapshot_dir / "apple-music-cn-top100.json", apple_payload)
    rows, apple_meta = normalize_apple(apple_payload, snapshot_id, collected_at)
    chart_meta = [apple_meta]

    for chart in NETEASE_CHARTS:
        payload = fetch_json(chart.endpoint, timeout)
        write_json(raw_snapshot_dir / f"netease-{chart.key}.json", payload)
        chart_rows, meta = normalize_netease(chart, payload, snapshot_id, collected_at)
        rows.extend(chart_rows)
        chart_meta.append(meta)

    quality = validate_rows(rows, chart_meta)
    if quality["status"] != "pass":
        write_json(raw_snapshot_dir / "failed-quality.json", quality)
        raise RuntimeError(f"Snapshot validation failed: {quality['errors']}")

    availability = availability_manifest(snapshot_id, collected_at, chart_meta)
    bundle = {
        "schema_version": "1.0",
        "snapshot_id": snapshot_id,
        "collected_at": collected_at,
        "timezone": "Asia/Shanghai",
        "grain": quality["grain"],
        "rank_percentile_definition": availability["rank_percentile_definition"],
        "charts": chart_meta,
        "rows": rows,
    }
    write_json(snapshot_dir / "charts.json", bundle)
    write_csv(snapshot_dir / "charts.csv", rows)
    write_json(snapshot_dir / "availability.json", availability)
    write_json(snapshot_dir / "quality.json", quality)
    copy_current(snapshot_dir, public_dir)
    write_json(raw_snapshot_dir / "manifest.json", {"snapshot_id": snapshot_id, "collected_at": collected_at, "charts": chart_meta})

    return {
        "snapshot_id": snapshot_id,
        "collected_at": collected_at,
        "rows": len(rows),
        "charts": {f"{meta['platform']}:{meta['chart_key']}": meta["rows"] for meta in chart_meta},
        "quality": quality["status"],
        "warnings": quality["warnings"],
        "output": str(snapshot_dir),
    }


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--public-dir", type=Path, default=DEFAULT_PUBLIC_DIR)
    parser.add_argument("--raw-dir", type=Path, default=DEFAULT_RAW_DIR)
    parser.add_argument("--timeout", type=int, default=30)
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    try:
        summary = collect(args.public_dir.resolve(), args.raw_dir.resolve(), args.timeout)
    except Exception as exc:  # concise CLI failure; raw failed evidence is retained where possible
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
