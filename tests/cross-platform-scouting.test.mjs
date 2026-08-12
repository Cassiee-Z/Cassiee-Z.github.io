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
  assert.match(source, /279 首去重作品中，41 首（14\.7%）命中两榜/);
  assert.match(source, /当日 Top 100 艺人作品数/);
  assert.match(source, /官方页面证据/);

  await access(
    new URL(
      "../public/data/scouting/cross-platform/current-charts.json",
      import.meta.url,
    ),
  );
});

test("ships a downloadable Excel scouting workflow", async () => {
  const source = await readFile(new URL("../app/portfolio-experience.tsx", import.meta.url), "utf8");
  for (const phrase of ["数据透视表", "VLOOKUP", "条件格式", "数据校验", "中文新歌与潜力音乐人数据侦察.xlsx"]) {
    assert.match(source, new RegExp(phrase));
  }
});
