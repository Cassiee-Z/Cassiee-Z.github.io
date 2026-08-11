from __future__ import annotations

import csv
import json
import statistics
import urllib.parse
import urllib.request
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
SOURCE_DIR = Path(__file__).resolve().parent / "source"
PUBLIC_DATA_DIR = ROOT / "public" / "data" / "scouting"

API_BASE = "https://chart.tencentmusic.com/unichartsapi"
ISSUES = ["202628", "202629", "202630", "202631"]
ISSUE_RANGE = "2026-07-13—2026-08-09"
ARTIST_WATCHLIST = ["万海东", "黄星", "吴琳珂Moske", "老中青民谣,小巷先生", "庄淇玟29"]
HIDDEN_QUALITY_TRACKS = ["Darling u", "无忧", "在两个心中间坐下 Two Worlds"]


def fetch_json(path: str, params: dict[str, object]) -> dict:
    query = urllib.parse.urlencode(params)
    request = urllib.request.Request(
        f"{API_BASE}{path}?{query}",
        headers={"User-Agent": "Cassie-Zha-Portfolio-Research/1.0"},
    )
    with urllib.request.urlopen(request, timeout=30) as response:
        payload = json.load(response)
    if payload.get("code") != "0":
        raise RuntimeError(f"Tencent Music API error: {payload}")
    return payload


def dimension_map(track: dict) -> dict[str, float]:
    return {item["name"]: float(item["index"]) for item in track["classifyIndices"]}


def flatten_week(issue: str, payload: dict) -> list[dict]:
    issue_info = payload["data"]["content"]
    rows = []
    for track in issue_info["chartsList"]:
        dimensions = dimension_map(track)
        rows.append(
            {
                "issue": issue,
                "issue_title": issue_info["title"],
                "start_date": issue_info["startDateForTitle"],
                "end_date": issue_info["endDateForTitle"],
                "rank": int(track["rank"]),
                "track_id": int(track["uniTrackId"]),
                "song_name": track["songName"],
                "artist_name": track["singerName"],
                "qq_track_mid": track["qyTrackMid"],
                "cover_url": track["hdCoverImages"],
                "new_flag": bool(track["newFlag"]),
                "last_week_rank": int(track["lastWeekRank"] or 0),
                "on_chart_weeks": int(track["onChartWeeks"] or 0),
                "history_highest_rank": int(track["historyHighestRank"] or 0),
                "uni_index": float(track["uniIndexNew"]),
                "play_heat": dimensions["播放热度"],
                "spread": dimensions["传播度"],
                "preference": dimensions["喜好度"],
                "sales": dimensions["畅销度"],
                "recommendation": dimensions["推荐度"],
            }
        )
    return rows


def validate(rows: list[dict]) -> dict:
    checks = []
    for issue in ISSUES:
        week = [row for row in rows if row["issue"] == issue]
        ranks = [row["rank"] for row in week]
        track_ids = [row["track_id"] for row in week]
        checks.append(
            {
                "issue": issue,
                "rows": len(week),
                "unique_ranks": len(set(ranks)),
                "unique_tracks": len(set(track_ids)),
                "rank_range": [min(ranks), max(ranks)],
            }
        )
        assert len(week) == 200
        assert len(set(ranks)) == 200 and min(ranks) == 1 and max(ranks) == 200
        assert len(set(track_ids)) == 200

    zero_rates = {
        field: round(sum(row[field] == 0 for row in rows) / len(rows), 4)
        for field in ["play_heat", "spread", "preference", "sales", "recommendation"]
    }
    assert zero_rates["spread"] == 1.0
    assert zero_rates["preference"] == 1.0
    assert zero_rates["play_heat"] == 0
    assert zero_rates["sales"] == 0
    assert zero_rates["recommendation"] == 0

    return {
        "checks": checks,
        "zero_rates": zero_rates,
        "usable_fields": ["rank", "play_heat", "sales", "recommendation"],
        "excluded_fields": ["spread", "preference"],
    }


def build_track_histories(rows: list[dict]) -> dict[int, list[dict]]:
    histories: dict[int, list[dict]] = defaultdict(list)
    for row in rows:
        histories[row["track_id"]].append(row)
    for history in histories.values():
        history.sort(key=lambda row: row["issue"])
    return histories


def score_candidates(rows: list[dict], histories: dict[int, list[dict]]) -> list[dict]:
    sales_median = statistics.median(row["sales"] for row in rows)
    candidates = []
    for history in histories.values():
        latest = history[-1]
        appearances = len(history)
        average_sales = statistics.mean(row["sales"] for row in history)
        if appearances < 2 or not 21 <= latest["rank"] <= 120 or average_sales > sales_median:
            continue

        improvement = history[0]["rank"] - latest["rank"]
        current_position = max(0.0, min(100.0, 121 - latest["rank"]))
        momentum = max(0.0, min(100.0, 50 + improvement / 2))
        persistence = appearances / len(ISSUES) * 100
        average_play = statistics.mean(row["play_heat"] for row in history)
        average_recommendation = statistics.mean(row["recommendation"] for row in history)
        score = (
            0.30 * current_position
            + 0.25 * momentum
            + 0.20 * persistence
            + 0.15 * average_play
            + 0.10 * average_recommendation
        )
        candidates.append(
            {
                "song": latest["song_name"],
                "artist": latest["artist_name"],
                "score": round(score, 1),
                "appearances": appearances,
                "trajectory": [row["rank"] for row in history],
                "first_rank": history[0]["rank"],
                "latest_rank": latest["rank"],
                "improvement": improvement,
                "average_play": round(average_play, 1),
                "average_recommendation": round(average_recommendation, 1),
                "average_sales": round(average_sales, 1),
                "qq_track_mid": latest["qq_track_mid"],
                "cover_url": latest["cover_url"],
            }
        )
    return sorted(candidates, key=lambda row: row["score"], reverse=True)


def artist_watchlist(rows: list[dict]) -> list[dict]:
    result = []
    rationale = {
        "万海东": "两首作品同时形成连续榜单信号，代表作一首进入 TOP 13，避免把单曲偶发上榜误判为艺人势能。",
        "黄星": "《两世洞天》四周维持 TOP 60，并呈现推荐度高、畅销度低的结构，适合补做内容口碑与受众画像验证。",
        "吴琳珂Moske": "《失眠了》四周连续上榜并由 88 位升至 72 位，播放热度稳定而畅销度低，值得测试自然内容传播。",
        "老中青民谣,小巷先生": "《都有这一天》三周由 183 位升至 85 位，是样本中较强的后程爬升信号之一。",
        "庄淇玟29": "《爱你是我的秘密》三周由 154 位升至 103 位，低畅销度下保持播放热度，适合小预算内容验证。",
    }

    for artist in ARTIST_WATCHLIST:
        artist_rows = [row for row in rows if row["artist_name"] == artist]
        songs: dict[str, list[dict]] = defaultdict(list)
        for row in artist_rows:
            songs[row["song_name"]].append(row)
        for history in songs.values():
            history.sort(key=lambda row: row["issue"])
        representative = min(
            songs.items(), key=lambda item: min(row["rank"] for row in item[1])
        )
        representative_name, representative_history = representative
        latest_issue = max(row["issue"] for row in artist_rows)
        latest_rows = [row for row in artist_rows if row["issue"] == latest_issue]
        result.append(
            {
                "artist": artist,
                "tracks_in_window": len(songs),
                "track_weeks": len(artist_rows),
                "best_rank": min(row["rank"] for row in artist_rows),
                "latest_best_rank": min(row["rank"] for row in latest_rows),
                "representative_track": representative_name,
                "trajectory": [row["rank"] for row in representative_history],
                "average_play": round(statistics.mean(row["play_heat"] for row in artist_rows), 1),
                "average_recommendation": round(
                    statistics.mean(row["recommendation"] for row in artist_rows), 1
                ),
                "average_sales": round(statistics.mean(row["sales"] for row in artist_rows), 1),
                "qq_track_mid": representative_history[-1]["qq_track_mid"],
                "cover_url": representative_history[-1]["cover_url"],
                "rationale": rationale[artist],
            }
        )
    return result


def wave_summary(payload: dict, histories: dict[int, list[dict]]) -> dict:
    songs = payload["data"]["content"]
    chart_track_ids = set(histories)
    overlap = [song for song in songs if song["uniSongId"] in chart_track_ids]
    hidden_quality = []
    for song in songs:
        if song["songName"] not in HIDDEN_QUALITY_TRACKS:
            continue
        hidden_quality.append(
            {
                "song": song["songName"],
                "artist": "/".join(song["singers"]),
                "wave_rank": song["rank"],
                "professional_score": float(song["showScore"]),
                "company": song["companyName"],
                "four_week_top200_appearances": 0,
                "cover_url": song["songCoverUrl"],
            }
        )
    return {
        "issue": songs[0]["chartIssueInfo"],
        "tracks": len(songs),
        "intersection_count": len(overlap),
        "intersection_tracks": [song["songName"] for song in overlap],
        "hidden_quality": hidden_quality,
    }


def write_csv(path: Path, rows: list[dict], fields: list[str]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields, extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rows)


def run() -> dict:
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

    weekly_payloads = {}
    rows = []
    for issue in ISSUES:
        payload = fetch_json(
            "/pc/yobang/history",
            {"issue": issue, "offset": 0, "limit": 200, "platform": "pc"},
        )
        weekly_payloads[issue] = payload
        rows.extend(flatten_week(issue, payload))
        (SOURCE_DIR / f"tme-yobang-{issue}.json").write_text(
            json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8"
        )

    wave_payload = fetch_json("/pc/uniprorec/song", {"start": 0, "end": 20})
    (SOURCE_DIR / "tme-wave-latest.json").write_text(
        json.dumps(wave_payload, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    quality = validate(rows)
    histories = build_track_histories(rows)
    candidates = score_candidates(rows, histories)
    watchlist = candidates[:5]
    artist_candidates = artist_watchlist(rows)
    wave = wave_summary(wave_payload, histories)

    summary = {
        "snapshot_as_of": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "timezone": "Asia/Shanghai",
        "period": ISSUE_RANGE,
        "issues": ISSUES,
        "source": {
            "name": "腾讯音乐由你榜 / 腾讯音乐浪潮榜",
            "chart_url": "https://chart.tencentmusic.com/",
            "method_url": "https://www.tencentmusic.com/zh-cn/wave-chart.html",
        },
        "dataset": {
            "rows": len(rows),
            "unique_tracks": len(histories),
            "unique_artists": len({row["artist_name"] for row in rows}),
            "weeks": len(ISSUES),
        },
        "data_quality": quality,
        "methodology": {
            "candidate_filter": "最新完整周排名21—120；四周内至少上榜2次；平均畅销度不高于全样本中位数。",
            "sales_median": round(statistics.median(row["sales"] for row in rows), 2),
            "score_formula": "30%当前位置 + 25%名次动量 + 20%持续性 + 15%播放热度 + 10%推荐度",
            "excluded_from_score": ["传播度", "喜好度", "畅销度"],
        },
        "watchlist": watchlist,
        "artist_watchlist": artist_candidates,
        "wave": wave,
    }

    weekly_fields = [
        "issue",
        "issue_title",
        "start_date",
        "end_date",
        "rank",
        "track_id",
        "song_name",
        "artist_name",
        "qq_track_mid",
        "new_flag",
        "last_week_rank",
        "on_chart_weeks",
        "history_highest_rank",
        "uni_index",
        "play_heat",
        "spread",
        "preference",
        "sales",
        "recommendation",
        "cover_url",
    ]
    write_csv(PUBLIC_DATA_DIR / "tme-yobang-w28-w31.csv", rows, weekly_fields)
    write_csv(
        PUBLIC_DATA_DIR / "scouting-watchlist.csv",
        watchlist,
        [
            "song",
            "artist",
            "score",
            "appearances",
            "trajectory",
            "first_rank",
            "latest_rank",
            "improvement",
            "average_play",
            "average_recommendation",
            "average_sales",
            "qq_track_mid",
            "cover_url",
        ],
    )
    (PUBLIC_DATA_DIR / "scouting-summary.json").write_text(
        json.dumps(summary, ensure_ascii=False, indent=2), encoding="utf-8"
    )
    return summary


if __name__ == "__main__":
    report = run()
    print(json.dumps(report, ensure_ascii=False, indent=2))
