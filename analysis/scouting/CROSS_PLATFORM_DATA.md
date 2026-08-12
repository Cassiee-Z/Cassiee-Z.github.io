# 跨平台榜单快照

## 运行

在项目根目录执行：

```bash
python3 analysis/scouting/fetch_cross_platform.py
```

脚本会生成：

- `public/data/scouting/cross-platform/current-charts.json`
- `public/data/scouting/cross-platform/current-charts.csv`
- `public/data/scouting/cross-platform/current-availability.json`
- `public/data/scouting/cross-platform/current-quality.json`
- `public/data/scouting/cross-platform/snapshots/<snapshot_id>/...`

原始响应保留在 `analysis/scouting/source/cross-platform/<snapshot_id>/`，用于审计和复核。

## 数据边界

- Apple Music：中国区官方 RSS/Marketing Tools Top 100。
- 网易云音乐：来自 `music.163.com` 官方域名公开响应，但并非正式开发者 API，因此存在结构和可用性变化风险。
- Spotify：需登录/授权导出；当前只记录来源状态，不生成榜位。
- 抖音音乐：需开放平台权限或人工留证；当前不生成榜位、使用量或增速。
- 热门原声/音效：未确认统一公开官方榜单，只允许人工观察并保留截图、链接和采集时间。

`rank_percentile` 的计算方式是：

```text
100 × (榜单长度 − 当前名次 + 1) ÷ 榜单长度
```

它只表示一首歌在**各自榜单内部**的位置，不能被解释为跨平台播放规模、用户规模或爆款概率。
