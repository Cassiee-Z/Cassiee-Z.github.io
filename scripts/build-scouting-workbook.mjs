import fs from "node:fs/promises";
import path from "node:path";
import { Workbook, SpreadsheetFile } from "@oai/artifact-tool";

const root = process.cwd();
const tmePath = path.join(root, "public/data/scouting/tme-yobang-w28-w31.csv");
const crossPath = path.join(root, "public/data/scouting/cross-platform/current-charts.csv");
const watchPath = path.join(root, "public/data/scouting/scouting-watchlist.csv");
const outputPath = path.join(root, "outputs/019fa8b5-df67-7011-8435-fc2b75420bee/查文鑫_中文新歌与潜力音乐人数据侦察.xlsx");
const publicPath = path.join(root, "public/docs/查文鑫_中文新歌与潜力音乐人数据侦察.xlsx");
const previewDir = path.join(root, "outputs/019fa8b5-df67-7011-8435-fc2b75420bee/previews");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { field += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field.replace(/\r$/, "")); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length || row.length) { row.push(field.replace(/\r$/, "")); rows.push(row); }
  if (rows[0]?.[0]) rows[0][0] = rows[0][0].replace(/^\uFEFF/, "");
  return rows;
}

const readCsv = async (file) => parseCsv(await fs.readFile(file, "utf8"));
const [tmeRows, crossRows, watchRows] = await Promise.all([readCsv(tmePath), readCsv(crossPath), readCsv(watchPath)]);

const toNumber = (value) => {
  if (value === "" || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : value;
};

const typedRows = (rows, numericHeaders) => {
  const headers = rows[0];
  return [headers, ...rows.slice(1).map((row) => row.map((v, i) => numericHeaders.has(headers[i]) ? toNumber(v) : v))];
};

const tme = typedRows(tmeRows, new Set(["issue", "rank", "track_id", "last_week_rank", "on_chart_weeks", "history_highest_rank", "uni_index", "play_heat", "spread", "preference", "sales", "recommendation"]));
const cross = typedRows(crossRows, new Set(["chart_size", "rank", "rank_percentile", "previous_rank", "movement"]));
const watch = typedRows(watchRows, new Set(["score", "appearances", "first_rank", "latest_rank", "improvement", "average_play", "average_recommendation", "average_sales"]));

const wb = Workbook.create();
const guide = wb.worksheets.add("01_使用说明");
const crossSheet = wb.worksheets.add("02_跨平台原始数据");
const tmeSheet = wb.worksheets.add("03_TME原始数据");
const review = wb.worksheets.add("04_候选复核");
const pivot = wb.worksheets.add("05_数据透视表");
const dashboard = wb.worksheets.add("06_侦察看板");
const dictionary = wb.worksheets.add("07_字典与参数");
for (const sheet of [guide, crossSheet, tmeSheet, review, pivot, dashboard, dictionary]) sheet.showGridLines = false;

const palette = { black: "#0A0A09", panel: "#181714", cream: "#F1EBDD", gold: "#B69152", muted: "#8B867D", line: "#D8D0C0", input: "#FFF3C4", formula: "#E8E6E0", green: "#DDEAD8", red: "#F4D4D0" };
const titleStyle = { fill: palette.black, font: { color: palette.cream, bold: true, size: 20 }, verticalAlignment: "center" };
const sectionStyle = { fill: palette.panel, font: { color: palette.cream, bold: true, size: 11 }, verticalAlignment: "center" };
const headerStyle = { fill: palette.gold, font: { color: palette.black, bold: true, size: 10 }, verticalAlignment: "center", wrapText: true };

function setTitle(sheet, range, text, subtitle) {
  sheet.getRange(range).merge();
  sheet.getRange(range.split(":")[0]).values = [[text]];
  sheet.getRange(range).format = titleStyle;
  const start = range.split(":")[0];
  const row = Number(start.match(/\d+/)[0]);
  const colA = start.match(/[A-Z]+/)[0];
  const endCol = range.split(":")[1].match(/[A-Z]+/)[0];
  sheet.getRange(`${colA}${row + 1}:${endCol}${row + 1}`).merge();
  sheet.getRange(`${colA}${row + 1}`).values = [[subtitle]];
  sheet.getRange(`${colA}${row + 1}:${endCol}${row + 1}`).format = { fill: palette.black, font: { color: palette.muted, italic: true, size: 9 }, verticalAlignment: "center" };
}

setTitle(guide, "A1:H1", "中文新歌与潜力音乐人数据侦察", "Cassie Zha｜Excel 可复核分析工作台｜数据截止 2026-08-12");
guide.getRange("A4:H4").merge(); guide.getRange("A4").values = [["这不是静态截图：可查看公式、切换下拉选项、筛选数据并刷新分析逻辑。"]]; guide.getRange("A4:H4").format = sectionStyle;
guide.getRange("A6:B12").values = [
  ["工作表", "用途"], ["02_跨平台原始数据", "Apple Music / 网易云 420 条标准化快照；VLOOKUP 回填榜单口径"], ["03_TME原始数据", "腾讯音乐由你榜第 28—31 期 800 条；VLOOKUP 标记入选候选"], ["04_候选复核", "人工复核区；使用数据校验下拉与条件格式"], ["05_数据透视表", "按平台、榜单、艺人和期数汇总；使用 Excel 数据透视公式"], ["06_侦察看板", "核心 KPI 与候选评分图"], ["07_字典与参数", "VLOOKUP、下拉选项和阈值的唯一来源"]
];
guide.getRange("A6:B6").format = headerStyle;
guide.getRange("D6:H6").merge(); guide.getRange("D6").values = [["四项 Excel 能力如何落地"]]; guide.getRange("D6:H6").format = headerStyle;
guide.getRange("D7:H11").values = [
  ["数据透视表", "05 页按平台/榜单/艺人/期数聚合记录数、平均排名和 Top10 数", null, null, null],
  ["VLOOKUP", "02 页回填平台与频率；03 页按 qq_track_mid 回填候选综合分", null, null, null],
  ["条件格式", "高分候选、Top10、排名涨跌、缺失映射与重复记录自动显色", null, null, null],
  ["数据校验", "跟进状态、内容场景、版权状态、人工评分均限制为标准选项", null, null, null],
  ["颜色说明", "淡黄＝人工输入；灰色＝公式；金色＝重点；红色＝风险/待核验", null, null, null],
];
guide.getRange("A14:H18").values = [
  ["口径与边界", null, null, null, null, null, null, null],
  ["1", "跨平台榜位只比较榜内相对位置，不把 Apple 第1名与网易第1名解释为相同播放量。", null, null, null, null, null, null],
  ["2", "腾讯音乐第32期截图只作最新页面证据；本工作簿结构化趋势范围仍为第28—31期。", null, null, null, null, null, null],
  ["3", "Spotify 需登录、抖音需开放平台权限；缺失记为“未采集”，不填0。", null, null, null, null, null, null],
  ["4", "网易实时分享榜页面称100首，但公开响应仅返回10条；分析以实际返回量标记。", null, null, null, null, null, null],
];
guide.getRange("A14:H14").format = sectionStyle;
guide.getRange("B15:H18").merge(true); guide.getRange("B15:H18").format.wrapText = true;
guide.getRange("A1:H18").format.rowHeight = 24; guide.getRange("1:2").format.rowHeight = 34;
guide.getRange("A:A").format.columnWidth = 16; guide.getRange("B:B").format.columnWidth = 46; guide.getRange("D:D").format.columnWidth = 18; guide.getRange("E:H").format.columnWidth = 14;

setTitle(dictionary, "A1:R1", "字段字典与参数", "所有查找、下拉选项与阈值均引用本页，避免在公式内写死");
dictionary.getRange("A4:E10").values = [
  ["chart_key", "榜单中文名", "平台中文名", "更新频率", "来源等级"],
  ["cn_top_100", "热门歌曲排行", "Apple Music", "每日公开快照", "官方公开"],
  ["rising", "飙升榜", "网易云音乐", "每日", "官方页面/公开响应"],
  ["new", "新歌榜", "网易云音乐", "每日", "官方页面/公开响应"],
  ["original", "原创榜", "网易云音乐", "每周四", "官方页面/公开响应"],
  ["potential", "潜力爆款榜", "网易云音乐", "每周二", "公开响应仅10条"],
  ["realtime_share", "实时分享榜", "网易云音乐", "每小时", "公开响应仅10条"],
];
dictionary.getRange("G4:J9").values = [
  ["qq_track_mid", "综合分", "候选歌名", "候选艺人"],
  ...watch.slice(1).map((r) => [r[11], r[2], r[0], r[1]]),
];
dictionary.getRange("L4:L8").values = [["跟进状态"], ["观察"], ["优先跟进"], ["已联系"], ["暂缓"]];
dictionary.getRange("M4:M9").values = [["内容场景"], ["歌单"], ["短视频"], ["影视"], ["品牌"], ["现场"]];
dictionary.getRange("N4:N8").values = [["版权状态"], ["待确认"], ["可联系"], ["已授权"], ["存在风险"]];
dictionary.getRange("O4:O7").values = [["复核结论"], ["继续观察"], ["进入听审"], ["暂缓"]];
dictionary.getRange("Q4:R8").values = [["阈值", "数值"], ["高潜综合分", 80], ["中潜综合分", 70], ["Top排名", 10], ["销售中位数", 22.24]];
for (const r of ["A4:E4", "G4:J4", "L4:O4", "Q4:R4"]) dictionary.getRange(r).format = headerStyle;
dictionary.getRange("A4:R10").format.borders = { preset: "inside", style: "thin", color: palette.line };
dictionary.getRange("A:R").format.columnWidth = 16; dictionary.getRange("B:B").format.columnWidth = 22; dictionary.getRange("J:J").format.columnWidth = 28;

setTitle(crossSheet, "A1:AE1", "跨平台原始数据", "420 条 Apple Music / 网易云标准化快照｜灰色列由 VLOOKUP 与公式生成");
const crossHeaders = [...cross[0], "平台中文名_VLOOKUP", "榜单中文名_VLOOKUP", "更新频率_VLOOKUP", "作品唯一键", "是否Top10", "发行年份"];
crossSheet.getRangeByIndexes(3, 0, cross.length, crossHeaders.length).values = [crossHeaders, ...cross.slice(1).map((r) => [...r, null, null, null, null, null, null])];
crossSheet.getRange(`Z5`).formulas = [["=IFERROR(VLOOKUP(F5,'07_字典与参数'!$A$5:$E$10,3,FALSE),\"待映射\")"]]; crossSheet.getRange(`Z5:Z${cross.length + 3}`).fillDown();
crossSheet.getRange(`AA5`).formulas = [["=IFERROR(VLOOKUP(F5,'07_字典与参数'!$A$5:$E$10,2,FALSE),\"待映射\")"]]; crossSheet.getRange(`AA5:AA${cross.length + 3}`).fillDown();
crossSheet.getRange(`AB5`).formulas = [["=IFERROR(VLOOKUP(F5,'07_字典与参数'!$A$5:$E$10,4,FALSE),\"待映射\")"]]; crossSheet.getRange(`AB5:AB${cross.length + 3}`).fillDown();
crossSheet.getRange(`AC5`).formulas = [["=D5&\"|\"&F5&\"|\"&L5"]]; crossSheet.getRange(`AC5:AC${cross.length + 3}`).fillDown();
crossSheet.getRange(`AD5`).formulas = [["=IF(J5<=10,\"是\",\"否\")"]]; crossSheet.getRange(`AD5:AD${cross.length + 3}`).fillDown();
crossSheet.getRange(`AE5`).formulas = [["=IFERROR(YEAR(R5),\"缺失\")"]]; crossSheet.getRange(`AE5:AE${cross.length + 3}`).fillDown();
crossSheet.tables.add(`A4:AE${cross.length + 3}`, true, "CrossPlatformRaw").style = "TableStyleMedium2";
crossSheet.freezePanes.freezeRows(4); crossSheet.freezePanes.freezeColumns(2);
crossSheet.getRange("A4:AE4").format = headerStyle; crossSheet.getRange(`Z5:AE${cross.length + 3}`).format.fill = palette.formula;
crossSheet.getRange(`J5:J${cross.length + 3}`).conditionalFormats.add("cellIs", { operator: "lessThanOrEqual", formula: 10, format: { fill: palette.gold, font: { bold: true, color: palette.black } } });
crossSheet.getRange(`K5:K${cross.length + 3}`).conditionalFormats.add("colorScale", { colors: ["#EFE9DD", "#D7BC83", "#9A6A25"], thresholds: ["min", "50%", "max"] });
crossSheet.getRange(`AC5:AC${cross.length + 3}`).conditionalFormats.add("duplicateValues", { format: { fill: palette.red, font: { color: "#7A1712" } } });
crossSheet.getRange(`Z5:AB${cross.length + 3}`).conditionalFormats.add("containsText", { text: "待映射", format: { fill: palette.red, font: { color: "#7A1712" } } });
crossSheet.getRange("A:AE").format.columnWidth = 15; crossSheet.getRange("M:M").format.columnWidth = 28; crossSheet.getRange("N:N").format.columnWidth = 22; crossSheet.getRange("V:Y").format.columnWidth = 35;

setTitle(tmeSheet, "A1:W1", "腾讯音乐由你榜原始数据", "第28—31期共800条｜VLOOKUP 按 qq_track_mid 标记候选综合分与名称");
const tmeHeaders = [...tme[0], "候选综合分_VLOOKUP", "候选歌名_VLOOKUP", "入选状态"];
tmeSheet.getRangeByIndexes(3, 0, tme.length, tmeHeaders.length).values = [tmeHeaders, ...tme.slice(1).map((r) => [...r, null, null, null])];
tmeSheet.getRange("U5").formulas = [["=IFERROR(VLOOKUP(I5,'07_字典与参数'!$G$5:$J$9,2,FALSE),\"未入选\")"]]; tmeSheet.getRange(`U5:U${tme.length + 3}`).fillDown();
tmeSheet.getRange("V5").formulas = [["=IFERROR(VLOOKUP(I5,'07_字典与参数'!$G$5:$J$9,3,FALSE),\"—\")"]]; tmeSheet.getRange(`V5:V${tme.length + 3}`).fillDown();
tmeSheet.getRange("W5").formulas = [["=IF(U5=\"未入选\",\"否\",\"是\")"]]; tmeSheet.getRange(`W5:W${tme.length + 3}`).fillDown();
tmeSheet.tables.add(`A4:W${tme.length + 3}`, true, "TMERaw").style = "TableStyleMedium2";
tmeSheet.freezePanes.freezeRows(4); tmeSheet.freezePanes.freezeColumns(2);
tmeSheet.getRange("A4:W4").format = headerStyle; tmeSheet.getRange(`U5:W${tme.length + 3}`).format.fill = palette.formula;
tmeSheet.getRange(`E5:E${tme.length + 3}`).conditionalFormats.add("cellIs", { operator: "lessThanOrEqual", formula: 10, format: { fill: palette.gold, font: { bold: true, color: palette.black } } });
tmeSheet.getRange(`U5:U${tme.length + 3}`).conditionalFormats.add("colorScale", { colors: ["#EFE9DD", "#DFC68E", "#7F5A20"], thresholds: ["min", "50%", "max"] });
tmeSheet.getRange("A:W").format.columnWidth = 15; tmeSheet.getRange("G:H").format.columnWidth = 24; tmeSheet.getRange("T:T").format.columnWidth = 38;

setTitle(review, "A1:N1", "候选曲库人工复核", "黄色区域可编辑；下拉规则统一来自 07_字典与参数");
const reviewHeaders = ["qq_track_mid", "歌名", "艺人", "综合分", "上榜次数", "最新排名", "名次改善", "平均播放热度", "平均推荐度", "跟进状态", "内容场景", "版权状态", "人工评分", "复核结论"];
review.getRange("A4:N9").values = [reviewHeaders, ...watch.slice(1).map((r) => [r[11], r[0], r[1], r[2], r[3], r[6], r[7], r[8], r[9], "观察", "歌单", "待确认", 70, "继续观察"])];
review.tables.add("A4:N9", true, "CandidateReview").style = "TableStyleMedium2";
review.getRange("A4:N4").format = headerStyle; review.getRange("J5:N9").format.fill = palette.input;
review.getRange("J5:J50").dataValidation = { rule: { type: "list", formula1: "'07_字典与参数'!$L$5:$L$8" } };
review.getRange("K5:K50").dataValidation = { rule: { type: "list", formula1: "'07_字典与参数'!$M$5:$M$9" } };
review.getRange("L5:L50").dataValidation = { rule: { type: "list", formula1: "'07_字典与参数'!$N$5:$N$8" } };
review.getRange("M5:M50").dataValidation = { rule: { type: "whole", operator: "between", formula1: 0, formula2: 100 } };
review.getRange("N5:N50").dataValidation = { rule: { type: "list", formula1: "'07_字典与参数'!$O$5:$O$7" } };
review.getRange("D5:D9").conditionalFormats.add("colorScale", { colors: ["#F4D4D0", "#FFF1BF", "#DDEAD8"], thresholds: ["min", "50%", "max"] });
review.getRange("G5:G9").conditionalFormats.add("cellIs", { operator: "greaterThan", formula: 0, format: { fill: palette.green, font: { color: "#1E5B2D", bold: true } } });
review.getRange("G5:G9").conditionalFormats.add("cellIs", { operator: "lessThan", formula: 0, format: { fill: palette.red, font: { color: "#7A1712", bold: true } } });
review.getRange("L5:L50").conditionalFormats.add("containsText", { text: "待确认", format: { fill: palette.red, font: { color: "#7A1712" } } });
review.freezePanes.freezeRows(4); review.getRange("A:N").format.columnWidth = 16; review.getRange("B:C").format.columnWidth = 24;

setTitle(pivot, "A1:U1", "数据透视表", "可视汇总兼容各版本；Q 列保留 Excel 365 动态 PIVOTBY 公式，可检查并随源数据刷新");
pivot.getRange("A4:D4").values = [["平台", "榜单", "记录数", "平均排名"]]; pivot.getRange("A4:D4").format = headerStyle;
const chartLabels = { cn_top_100: ["Apple Music", "热门歌曲排行"], rising: ["网易云音乐", "飙升榜"], new: ["网易云音乐", "新歌榜"], original: ["网易云音乐", "原创榜"], potential: ["网易云音乐", "潜力爆款榜"], realtime_share: ["网易云音乐", "实时分享榜"] };
const chartAgg = new Map();
for (const r of cross.slice(1)) {
  const entry = chartAgg.get(r[5]) || { rows: 0, sumRank: 0 };
  entry.rows += 1; entry.sumRank += r[9]; chartAgg.set(r[5], entry);
}
const pivotFallback = [...chartAgg.entries()].map(([key, v]) => [...chartLabels[key], v.rows, v.sumRank / v.rows]);
pivot.getRangeByIndexes(4, 0, pivotFallback.length, 4).values = pivotFallback;
pivot.getRange("Q4:U4").merge(); pivot.getRange("Q4").values = [["EXCEL 365 动态数据透视公式"]]; pivot.getRange("Q4:U4").format = headerStyle;
pivot.getRange("Q5").formulas = [["=IFERROR(PIVOTBY('02_跨平台原始数据'!$Z$5:$Z$424,'02_跨平台原始数据'!$AA$5:$AA$424,'02_跨平台原始数据'!$J$5:$J$424,AVERAGE,3,0,-2,0),\"请用 Excel 365 打开以刷新\")"]];
pivot.getRange("F4:H4").values = [["艺人", "榜内作品数", "最高排名"]]; pivot.getRange("F4:H4").format = headerStyle;
const appleRows = cross.slice(1).filter(r => r[3] === "apple_music");
const artists = new Map();
for (const r of appleRows) { const a = r[14]; const e = artists.get(a) || { count: 0, best: 999 }; e.count += 1; e.best = Math.min(e.best, r[9]); artists.set(a, e); }
const artistSummary = [...artists.entries()].sort((a,b) => b[1].count-a[1].count || a[1].best-b[1].best).map(([a,v]) => [a,v.count,v.best]);
pivot.getRangeByIndexes(4,5,artistSummary.length,3).values = artistSummary;
pivot.getRange("J4:M4").values = [["TME候选", "第28期", "第29期", "第30期"]]; pivot.getRange("J4:M4").format = headerStyle;
const tmeData = tme.slice(1);
const watchMids = watch.slice(1).map(r=>r[11]);
const trend = watchMids.map((mid, i) => {
  const label = watch[i+1][0];
  return [label, ...[202628,202629,202630].map(issue => tmeData.find(r=>r[0]===issue && r[8]===mid)?.[4] ?? null), tmeData.find(r=>r[0]===202631 && r[8]===mid)?.[4] ?? null];
});
pivot.getRange("J4:N4").values = [["TME候选", "第28期", "第29期", "第30期", "第31期"]]; pivot.getRangeByIndexes(4,9,trend.length,5).values = trend;
pivot.getRange("A15:E15").merge(); pivot.getRange("A15").values = [["注：PIVOTBY 是 Excel 365 的数据透视公式；左侧兼容视图保留相同口径，旧版 Excel 仍可直接阅读结果。"]]; pivot.getRange("A15:E15").format = { fill: palette.formula, font: { color: "#4C4942", italic: true }, wrapText: true };
pivot.getRange("A:Q").format.columnWidth = 16; pivot.getRange("F:F").format.columnWidth = 24; pivot.getRange("J:J").format.columnWidth = 24;

setTitle(dashboard, "A1:N1", "音乐潜力侦察看板", "1,220 条结构化记录｜6 张公开榜单｜5 首候选｜数据、判断与权限边界分开呈现");
dashboard.getRange("A4:C7").merge(); dashboard.getRange("A4").values = [[1220]]; dashboard.getRange("A4:C7").format = { fill: palette.panel, font: { color: palette.gold, bold: true, size: 30 }, horizontalAlignment: "center", verticalAlignment: "center" };
dashboard.getRange("D4:F7").merge(); dashboard.getRange("D4").values = [[6]]; dashboard.getRange("D4:F7").format = { fill: palette.panel, font: { color: palette.gold, bold: true, size: 30 }, horizontalAlignment: "center", verticalAlignment: "center" };
dashboard.getRange("G4:I7").merge(); dashboard.getRange("G4").values = [[5]]; dashboard.getRange("G4:I7").format = { fill: palette.panel, font: { color: palette.gold, bold: true, size: 30 }, horizontalAlignment: "center", verticalAlignment: "center" };
dashboard.getRange("J4:L7").merge(); dashboard.getRange("J4").formulas = [["=MAX('04_候选复核'!$D$5:$D$9)"]]; dashboard.getRange("J4:L7").format = { fill: palette.panel, font: { color: palette.gold, bold: true, size: 30 }, horizontalAlignment: "center", verticalAlignment: "center" };
dashboard.getRange("A8:C8").merge(); dashboard.getRange("A8").values = [["榜单记录"]]; dashboard.getRange("D8:F8").merge(); dashboard.getRange("D8").values = [["公开榜单"]]; dashboard.getRange("G8:I8").merge(); dashboard.getRange("G8").values = [["候选作品"]]; dashboard.getRange("J8:L8").merge(); dashboard.getRange("J8").values = [["最高综合分"]];
dashboard.getRange("A8:L8").format = { fill: palette.panel, font: { color: palette.cream, size: 10 }, horizontalAlignment: "center" };
dashboard.getRange("A11:B16").values = [["候选作品","综合分"], ...watch.slice(1).map(r=>[r[0],r[2]])]; dashboard.getRange("A11:B11").format = headerStyle;
const scoreChart = dashboard.charts.add("bar", dashboard.getRange("A11:B16")); scoreChart.title = "候选作品综合分（分）"; scoreChart.hasLegend = false; scoreChart.setPosition("D11", "L25"); scoreChart.xAxis = { numberFormatCode: "0", textStyle: { fontSize: 9 } };
dashboard.getRange("A28:L31").merge(); dashboard.getRange("A28").values = [["决策建议：公开榜单用于发现信号，平台后台数据用于验证增长，版权材料决定是否推进合作。所有榜单分数均为听审优先级，不构成商业价值预测。"]]; dashboard.getRange("A28:L31").format = { fill: palette.formula, font: { color: "#4C4942", size: 11 }, wrapText: true, verticalAlignment: "center" };
dashboard.getRange("A:N").format.columnWidth = 14;

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(path.dirname(publicPath), { recursive: true });
await fs.mkdir(previewDir, { recursive: true });
const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
await fs.copyFile(outputPath, publicPath);

const previewSpecs = [
  ["01_使用说明", "A1:H18"], ["02_跨平台原始数据", "A1:AE16"], ["03_TME原始数据", "A1:W16"],
  ["04_候选复核", "A1:N10"], ["05_数据透视表", "A1:U22"], ["06_侦察看板", "A1:N31"], ["07_字典与参数", "A1:R12"],
];
for (const [sheetName, range] of previewSpecs) {
  const img = await wb.render({ sheetName, range, scale: 1.2, format: "png" });
  await fs.writeFile(path.join(previewDir, `${sheetName}.png`), new Uint8Array(await img.arrayBuffer()));
}

const keyInspect = await wb.inspect({ kind: "table", range: "04_候选复核!A1:N12", include: "values,formulas", tableMaxRows: 12, tableMaxCols: 14, maxChars: 8000 });
const formulaInspect = await wb.inspect({ kind: "formula", sheetId: "02_跨平台原始数据", range: "Z4:AE15", maxChars: 6000, options: { maxResults: 60 } });
const errorInspect = await wb.inspect({ kind: "match", searchTerm: "#REF!|#DIV/0!|#VALUE!|#N/A", options: { useRegex: true, maxResults: 100 }, summary: "final formula error scan" });
console.log(keyInspect.ndjson);
console.log(formulaInspect.ndjson);
console.log(errorInspect.ndjson);
console.log(JSON.stringify({ outputPath, publicPath, previewDir }));
