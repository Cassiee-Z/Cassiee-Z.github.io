import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Cassie's recruiter-facing portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<title>查文鑫 Cassie｜音乐内容运营作品集<\/title>/);
  assert.match(html, /首推《冬烬之地》原创概念影片/);
  assert.match(html, /ENTER/);
  assert.match(html, /MUSIC INDEX/);
  assert.match(html, /FEATURED FILM/);
  assert.match(html, /蓝调夜行/);
  assert.match(html, /雨停在旧站台/);
  assert.match(html, /梨园照山河/);
  assert.match(html, /静音进入/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("ships audio, profile, social and recruiter download assets", async () => {
  const files = [
    "../public/audio-stream/blue-night.m4a",
    "../public/audio-stream/rain-old-platform.m4a",
    "../public/audio-stream/opera-mountains.m4a",
    "../public/audio-stream/run-into-thunder.m4a",
    "../public/audio-stream/gold-on-floor.m4a",
    "../public/audio-stream/unsent-goodnight.m4a",
    "../public/audio-stream/four-am-store.m4a",
    "../public/audio-stream/night-to-morning.m4a",
    "../public/audio-stream/century-new-chapter.m4a",
    "../public/audio-stream/grow-against-light.m4a",
    "../public/audio-stream/name-in-wind.m4a",
    "../public/audio-stream/moon-no-reply.m4a",
    "../public/audio-stream/swinging-hard.m4a",
    "../public/audio-stream/wind-from-yangtze.m4a",
    "../public/audio-stream/glass-sea.m4a",
    "../public/audio-stream/still-on-road.m4a",
    "../public/audio-stream/midnight-signal.m4a",
    "../public/audio-stream/winter-embers.m4a",
    "../public/images/cassie-editorial.jpg",
    "../public/images/cassie-headshot.jpg",
    "../public/images/og-cassie-music.jpg",
    "../public/images/og-cassie-data-scouting.png",
    "../public/images/covers/blue-night.jpg",
    "../public/images/covers/rain-old-platform.jpg",
    "../public/images/covers/opera-mountains.jpg",
    "../public/images/covers/run-thunder.jpg",
    "../public/images/covers/blue-night-v3.jpg",
    "../public/images/covers/rain-old-platform-v3.jpg",
    "../public/images/covers/unsent-goodnight-v3.jpg",
    "../public/images/covers/name-in-wind-v3.jpg",
    "../public/images/covers/moon-no-reply-v3.jpg",
    "../public/images/covers/glass-sea-v3.jpg",
    "../public/images/covers/run-into-thunder-v3.jpg",
    "../public/images/covers/grow-against-light-v3.jpg",
    "../public/images/covers/still-on-road-v3.jpg",
    "../public/images/covers/gold-on-floor-v3.jpg",
    "../public/images/covers/unsent-goodnight-v4.jpg",
    "../public/images/covers/night-to-morning-v3.jpg",
    "../public/images/covers/century-new-chapter-v3.jpg",
    "../public/images/covers/swinging-hard-v3.jpg",
    "../public/images/covers/four-am-store-v3.jpg",
    "../public/images/covers/wind-from-yangtze-v3.jpg",
    "../public/images/covers/midnight-signal.jpg",
    "../public/images/covers/winter-embers.jpg",
    "../public/images/projects/winter-embers-poster-v2.jpg",
    "../public/images/scouting/guohai.jpg",
    "../public/images/scouting/liangshi-dongtian.jpg",
    "../public/images/scouting/wan-hongsha.jpg",
    "../public/images/scouting/zhouxuan.jpg",
    "../public/images/scouting/benfu-chaowuxian.jpg",
    "../public/images/scouting/evidence/apple-music-cn-top-charts-20260812.jpg",
    "../public/images/scouting/evidence/netease-rising-20260812.jpg",
    "../public/images/scouting/evidence/tme-yobang-20260811.jpg",
    "../public/images/editorial/catalog-operations-article.jpg",
    "../public/images/editorial/ai-tools-article.jpg",
    "../public/video/winter-embers-film-v2.mp4",
    "../public/video/winter-embers-teaser.mp4",
    "../public/data/scouting/tme-yobang-w28-w31.csv",
    "../public/data/scouting/scouting-watchlist.csv",
    "../public/data/scouting/scouting-summary.json",
    "../public/data/scouting/cross-platform/current-charts.json",
    "../public/data/scouting/cross-platform/current-charts.csv",
    "../public/data/scouting/cross-platform/current-availability.json",
    "../public/data/scouting/cross-platform/current-quality.json",
    "../public/docs/Cassie_Zha_Wenxin_Resume_CN.pdf",
    "../public/docs/Cassie_2-Day_Music_Ops_Cram_Plan.pdf",
    "../public/docs/从16首AI歌曲到可运营曲库_查文鑫.docx",
    "../public/docs/从16首AI歌曲到可运营曲库_查文鑫.pdf",
    "../public/docs/六款AI音乐工具实测_查文鑫.docx",
    "../public/docs/六款AI音乐工具实测_查文鑫.pdf",
  ];

  await Promise.all(files.map((file) => access(new URL(file, import.meta.url))));
  const source = await readFile(
    new URL("../app/portfolio-experience.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /从 16 首 AI 歌曲到持续扩展的可运营曲库/);
  assert.match(source, /中文新歌与潜力音乐人数据侦察/);
  assert.match(source, /观察分 ≠ 爆款概率/);
  assert.match(source, /先发现失真字段，再开始评分/);
  assert.match(source, /过海/);
  assert.match(source, /两世洞天/);
  assert.match(source, /万海东/);
  assert.match(source, /歌词商用未署名事件：版权风险复盘/);
  assert.match(source, /公开事实与个人分析假设分开标注/);
  assert.match(source, /该事项未获得最终解决/);
  assert.match(source, /电话号码仅放在下载简历中/);
  assert.match(source, /凌晨四点的便利店/);
  assert.match(source, /风从长江吹来/);
  assert.match(source, /wind-from-yangtze\.m4a/);
  assert.match(source, /MIDNIGHT SIGNAL/);
  assert.match(source, /midnight-signal\.m4a/);
  assert.match(source, /《冬烬之地》：原创配乐与概念预告片/);
  assert.match(source, /winter-embers\.m4a/);
  assert.match(source, /winter-embers-film-v2\.mp4/);
  assert.match(source, /完整视听版本/);
  assert.match(source, /影片 01:59/);
  assert.match(source, /controls/);
  assert.match(source, /playsInline/);
  assert.match(source, /preload="metadata"/);
  assert.match(source, /preload="auto"/);
  assert.match(source, /LOADING · 正在缓冲/);
  assert.match(source, /音乐内容研究与 AI 工具实测/);
  assert.match(source, /从16首AI歌曲到可运营曲库/);
  assert.match(source, /六款AI音乐工具实测/);
  assert.match(source, /PDF 阅读版/);
  assert.match(source, /DOCX 原稿/);
});
