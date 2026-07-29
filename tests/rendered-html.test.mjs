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
  assert.match(html, /让音乐被听见/);
  assert.match(html, /CLICK/);
  assert.match(html, /MUSIC INDEX/);
  assert.match(html, /蓝调夜行/);
  assert.match(html, /雨停在旧站台/);
  assert.match(html, /梨园照山河/);
  assert.match(html, /静音进入/);
  assert.doesNotMatch(html, /Your site is taking shape|react-loading-skeleton/);
});

test("ships audio, profile, social and recruiter download assets", async () => {
  const files = [
    "../public/audio/blue-night.mp3",
    "../public/audio/rain-old-platform.mp3",
    "../public/audio/opera-mountains.mp3",
    "../public/audio/run-into-thunder.mp3",
    "../public/audio/gold-on-floor.mp3",
    "../public/images/cassie-editorial.jpg",
    "../public/images/cassie-headshot.jpg",
    "../public/images/og-cassie-music.jpg",
    "../public/images/covers/blue-night.jpg",
    "../public/images/covers/rain-old-platform.jpg",
    "../public/images/covers/opera-mountains.jpg",
    "../public/images/covers/run-thunder.jpg",
    "../public/docs/Cassie_Zha_Wenxin_Resume_CN.pdf",
    "../public/docs/Cassie_2-Day_Music_Ops_Cram_Plan.pdf",
  ];

  await Promise.all(files.map((file) => access(new URL(file, import.meta.url))));
  const source = await readFile(
    new URL("../app/portfolio-experience.tsx", import.meta.url),
    "utf8",
  );
  assert.match(source, /从 16 首 AI 歌曲到可运营曲库/);
  assert.match(source, /中文新歌与潜力音乐人数据侦察/);
  assert.match(source, /歌词商用未署名事件：版权风险复盘/);
  assert.match(source, /公开事实与个人分析假设分开标注/);
  assert.match(source, /该事项未获得最终解决/);
  assert.match(source, /电话号码仅放在下载简历中/);
});
