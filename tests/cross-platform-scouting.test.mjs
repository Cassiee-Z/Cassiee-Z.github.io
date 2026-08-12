import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("ships a source-bounded cross-platform scouting case", async () => {
  const source = await readFile(
    new URL("../app/portfolio-experience.tsx", import.meta.url),
    "utf8",
  );

  assert.match(source, /Apple Music 中国/);
  assert.match(source, /Spotify/);
  assert.match(source, /网易云音乐/);
  assert.match(source, /抖音音乐/);
  assert.match(source, /热门原声 \/ 音效/);
  assert.match(source, /登录受限/);
  assert.match(source, /接口需权限/);
  assert.match(source, /非官方观察/);
  assert.match(source, /单日结构快照，不代表趋势/);
  assert.match(source, /排名百分位/);
  assert.match(source, /320 条榜单记录中，41 首作品出现跨榜复现/);

  await access(
    new URL(
      "../public/data/scouting/cross-platform/current-charts.json",
      import.meta.url,
    ),
  );
});
