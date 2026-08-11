from __future__ import annotations

from pathlib import Path
from textwrap import dedent

import nbformat
from nbclient import NotebookClient


HERE = Path(__file__).resolve().parent
NOTEBOOK_PATH = HERE / "chinese_new_music_scouting.ipynb"


def markdown(text: str):
    return nbformat.v4.new_markdown_cell(dedent(text).strip())


def code(text: str):
    return nbformat.v4.new_code_cell(dedent(text).strip())


notebook = nbformat.v4.new_notebook()
notebook["metadata"] = {
    "kernelspec": {
        "display_name": "Python 3",
        "language": "python",
        "name": "python3",
    },
    "language_info": {"name": "python", "version": "3"},
}
notebook["cells"] = [
    markdown(
        """
        # 中文新歌与潜力音乐人数据侦察

        ## TL;DR

        基于腾讯音乐由你榜四期完整周榜（2026-07-13—2026-08-09）与最新可取的腾讯音乐浪潮榜（2026年6月），本研究从 800 条周榜记录、336 首歌、199 组艺人中，筛出 5 首值得补充后台数据的歌曲与 5 组潜力音乐人观察对象。

        这里的“观察分”不是爆款概率，也不是签约建议。它只回答一个更克制的问题：**公开数据有限时，下一轮最值得向谁补要播放、互动、受众与版权信息？**
        """
    ),
    markdown(
        """
        ## Context & Methods

        候选条件：最新完整周排名 21—120；四周内至少上榜 2 次；平均畅销度不高于全样本中位数。观察分 = 30% 当前位置 + 25% 名次动量 + 20% 持续性 + 15% 播放热度 + 10% 推荐度。

        ### Key Assumptions

        - 榜单用于发现信号，不直接等同于市场潜力、内容质量或商业价值。
        - 畅销度只作为过滤条件，不进入评分，降低成熟粉丝购买力对候选排序的影响。
        - 传播度与喜好度在四期接口中均为 0，判定为不可用字段并剔除。
        - 真正的合作判断仍需补齐完播、收藏、分享、短视频使用、受众画像与权利链信息。
        """
    ),
    code(
        """
        import json
        from pathlib import Path

        ROOT = Path.cwd()
        if ROOT.name != "scouting":
            ROOT = ROOT / "analysis" / "scouting"
        summary = json.loads((ROOT.parents[1] / "public" / "data" / "scouting" / "scouting-summary.json").read_text())
        summary["dataset"], summary["data_quality"]["zero_rates"]
        """
    ),
    markdown(
        """
        ## Data

        数据粒度为“周榜期 × 歌曲”。每期均验证为 200 行、200 个唯一名次与 200 首唯一歌曲，名次范围 1—200。四期合计 800 行，无周内重复。
        """
    ),
    code(
        """
        for check in summary["data_quality"]["checks"]:
            print(check)
        print("可用字段:", summary["data_quality"]["usable_fields"])
        print("剔除字段:", summary["data_quality"]["excluded_fields"])
        """
    ),
    markdown("## Results"),
    code(
        """
        for item in summary["watchlist"]:
            print(
                f'{item["song"]} / {item["artist"]}: '
                f'观察分 {item["score"]}; 轨迹 {" → ".join(map(str, item["trajectory"]))}; '
                f'平均播放热度 {item["average_play"]}; 平均畅销度 {item["average_sales"]}'
            )
        """
    ),
    code(
        """
        for item in summary["artist_watchlist"]:
            print(f'{item["artist"]}: {item["rationale"]}')
        """
    ),
    markdown(
        """
        ## Takeaways

        1. 《过海》在四周由 113 位升至 28 位，是样本中最完整的“持续上升 + 多周验证”信号。
        2. 万海东有两首作品在观察期形成榜单信号，其中《山风山风等等我》进入 TOP 13，艺人层面的复现比单曲偶发更值得跟进。
        3. 最新浪潮榜 TOP20 只有 4 首进入随后四期由你榜 TOP200，说明专业评价与大众榜单曝光并不重合；“质量池”和“热度池”应并行侦察。
        4. 下一步不是继续堆公开榜单，而是补齐平台后台、短视频传播与版权就绪度，再决定内容测试或合作沟通。

        数据来源：[腾讯音乐榜](https://chart.tencentmusic.com/)；[腾讯音乐浪潮榜评选细则](https://www.tencentmusic.com/zh-cn/wave-chart.html)。
        """
    ),
]

nbformat.write(notebook, NOTEBOOK_PATH)
client = NotebookClient(notebook, timeout=120, kernel_name="python3")
executed = client.execute(cwd=str(HERE))
nbformat.write(executed, NOTEBOOK_PATH)
print(NOTEBOOK_PATH)
