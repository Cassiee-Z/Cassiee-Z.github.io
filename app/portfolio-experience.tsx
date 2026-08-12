"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTrackLyrics } from "./track-lyrics";

type View = "universe" | "songs" | "projects" | "about" | "contact";
type EntryPhase = "gate" | "zooming" | "ready";
type ProjectKey =
  | "winter-embers"
  | "catalog"
  | "scouting"
  | "copyright"
  | "review"
  | "event"
  | "editorial";

type Project = {
  key: ProjectKey;
  no: string;
  title: string;
  english: string;
  field: string;
  intro: string;
  metrics: [string, string][];
  sections: { label: string; title: string; body: string[]; items?: string[] }[];
};

const projects: Project[] = [
  {
    key: "winter-embers",
    no: "001",
    title: "《冬烬之地》：原创配乐与概念预告片",
    english: "THE LAND OF WINTER EMBERS",
    field: "原创科幻短片配乐 · 影视音乐概念创作",
    intro: "围绕冰封世界、文明遗迹与母女告别构建的原创视听概念项目。",
    metrics: [
      ["01:59", "完整概念影片"],
      ["ORIGINAL", "同名原创配乐"],
      ["FULL CUT", "完整视听版本"],
    ],
    sections: [
      {
        label: "01 / WORLD",
        title: "冰原之下，仍有一座为生者等待的城市。",
        body: [
          "无尽寒冬覆盖世界，部族世代生活在“白脊”冰墙之下。年迈的守火人带领女儿抵达黑碑祭坛，将即将熄灭的火种归还冰原。",
          "仪式结束后，黑碑唤醒的并非亡者，而是一座沉睡数百年的地下城市。火种从来不是献给死者的祭品，而是母亲为后来者打开的一扇门。",
        ],
      },
      {
        label: "02 / SCORE DESIGN",
        title: "冷 / 静 / 裂变 / 余温，构成配乐的叙事轨迹。",
        body: [
          "音乐从低频持续音、疏离空气感与冰晶质感出发，建立辽阔而压迫的冰原空间；母亲摘下面具后，声场逐渐收窄，以克制的脉冲与机械质感贴近人物。",
          "献祭时声音短暂坠入近乎真空的寂静，随后由苏醒的低频力量和逐渐打开的和声揭示地下世界；结尾仍保留尚未消散的寒意。",
        ],
        items: ["COLD / 冰封表层", "STILLNESS / 克制停顿", "RUPTURE / 地下苏醒", "EMBER / 余温留存"],
      },
      {
        label: "03 / CORE EXPRESSION",
        title: "不是描写死亡，而是让生命成为后来者的入口。",
        body: [
          "配乐不只承担画面情绪背景，也参与隐藏真相、推动献祭与完成视觉揭示。母亲用仅剩的生命完成一次代际交付；新的家园得以开启，但打开它的人已经无法抵达。",
        ],
      },
      {
        label: "04 / FINAL CUT",
        title: "完整概念影片与同名原创配乐已上线。",
        body: [
          "本页公开 1 分 59 秒同名科幻概念影片与 3 分钟原创配乐，以完整视听段落呈现冰原巨构、母女告别、献祭与地下城市揭示之间的叙事关系。",
        ],
      },
    ],
  },
  {
    key: "catalog",
    no: "002",
    title: "从 16 首 AI 歌曲到持续扩展的可运营曲库",
    english: "AI MUSIC CATALOG",
    field: "音乐内容 · 曲库产品化",
    intro: "把“生成歌曲”推进到可检索、可评估、可分发的音乐内容资产。",
    metrics: [
      ["18", "首当前曲目"],
      ["4", "层曲库元数据"],
      ["5", "类分发场景"],
    ],
    sections: [
      {
        label: "01 / THE QUESTION",
        title: "生成不是终点，内容要能进入运营判断。",
        body: [
          "我以最初 16 首 AI 歌曲为基础，将零散音频整理为曲库样本：统一命名、补充风格与场景标签、记录版本，并设计适用于选歌、分发和复盘的评估维度。当前曲库已扩展至 18 首音乐作品，新增 K-pop 歌曲与影视配乐案例。",
          "这不是一套 AI 工具展示，而是一种把创作结果转译为内容资产的工作方法。",
        ],
      },
      {
        label: "02 / THE MODEL",
        title: "四层元数据，让每首歌可以被找到、比较与使用。",
        body: [
          "Track：曲名、语言、风格、情绪、BPM、时长。Version：模型、提示词、生成批次、保留原因。",
          "Segment：高光片段、前奏长度、可剪辑点。Distribution：目标人群、平台、内容模板与验证指标。",
        ],
        items: ["TRACK", "VERSION", "SEGMENT", "DISTRIBUTION"],
      },
      {
        label: "03 / THE DECISION",
        title: "先按使用场景找歌，再用真实数据验证。",
        body: [
          "当前将作品分为夜间城市、情绪叙事、文化融合、运动激励与庆典舞曲五类，下一步补齐平台数据、版本对照和高光片段时间码。",
        ],
      },
      {
        label: "04 / VISUAL DISCLOSURE",
        title: "参考画风与原创场景分开说明。",
        body: [
          "曲库封面以用户提供的视觉资料进行二度创作。其中《未发送的晚安》参考用户提供的蓝粉纸感旅行插画画风；人物、夜间列车场景、构图与文字均为重新创作，未直接使用参考图中的角色、产品版式或文案。",
        ],
      },
    ],
  },
  {
    key: "scouting",
    no: "003",
    title: "中文新歌与潜力音乐人数据侦察",
    english: "DISCOVERY SIGNALS",
    field: "自主研究 · 数据分析",
    intro: "以腾讯音乐完成候选初筛，再把 Apple Music、Spotify、网易云与抖音拆成可补数、可复核的跨平台验证流程。",
    metrics: [
      ["6", "条平台信号线"],
      ["3", "个当前可复核快照源"],
      ["5+5", "歌 / 人观察名单"],
    ],
    sections: [
      {
        label: "01 / THE DECISION",
        title: "先回答“下一轮向谁补数”，不把观察分包装成爆款概率。",
        body: [
          "本案例模拟音乐内容运营的第一轮侦察：从腾讯音乐由你榜 2026 年第 28 - 31 期的 800 条记录中建立候选池，再用榜位、动量、持续性、播放热度与推荐度筛出优先补数对象。",
          "观察分只用于候选排序。公开事实、分析假设与待补平台数据在页面中分开标注。",
        ],
      },
      {
        label: "02 / THE BOUNDARY",
        title: "先做数据质量检查，再决定哪些字段可以进入判断。",
        body: [
          "四期数据的传播度与喜好度均为 0，无法区分候选，因此从评分中剔除；畅销度仅作为过滤条件，降低成熟粉丝购买力对候选排序的影响。",
        ],
        items: ["当前位置 30%", "名次动量 25%", "持续性 20%", "播放热度 15%", "推荐度 10%"],
      },
      {
        label: "03 / NEXT ROUND",
        title: "真正推进内容测试或合作前，还要补齐跨平台证据。",
        body: [
          "Apple Music 用于观察完整播放市场结构；Spotify 验证海外华语扩散；网易云补新人发现与社区传播；抖音补 BGM 使用和短视频改编信号。各平台原始名次不直接横比，权限受限与人工观察数据单独标注。",
        ],
      },
    ],
  },
  {
    key: "copyright",
    no: "004",
    title: "歌词商用未署名事件：版权风险复盘",
    english: "RIGHTS REVIEW",
    field: "真实经历 · 匿名化复盘",
    intro: "从一次没有书面合同的歌词交易，回看署名、授权范围与证据链为何必须前置。",
    metrics: [
      ["1", "个真实案例"],
      ["6", "项授权检查"],
      ["0", "个夸大结论"],
    ],
    sections: [
      {
        label: "01 / CONTEXT",
        title: "口头“买断”，并不自动回答所有权利问题。",
        body: [
          "在欧拉艺术空间实习期间，我对接过一位个人歌手与作词同学。双方以口头方式完成歌词买卖；歌曲后来用于综艺录制，却没有标注作词人。",
          "该事项未获得最终解决。以下是当事人求助后，我所做的材料整理、风险识别与沟通协助复盘，不代表法律结论。",
        ],
      },
      {
        label: "02 / TIMELINE",
        title: "交易发生在前，权利问题暴露在后。",
        body: [
          "口头交易 → 节目使用 → 作词人事后求助 → 归集沟通、作品与付款记录 → 因录制完成且双方不在本地，事件未能解决。",
        ],
        items: ["交易对象", "权利方式", "媒介与场景", "地区与期限", "署名方式", "证据留存"],
      },
      {
        label: "03 / LEARNING",
        title: "版权沟通的价值，是让模糊问题在使用之前被看见。",
        body: [
          "未来项目中，我会在交付前明确作品对象、许可或转让、可使用平台、期限地区、转授权、二次传播、署名、费用节点与违约处理，并由专业法务确认。",
        ],
      },
    ],
  },
  {
    key: "review",
    no: "005",
    title: "上千份内容审核与质检",
    english: "CONTENT QUALITY ASSURANCE",
    field: "江苏省委组织部 · 实习",
    intro: "在高密度材料中维持准确、合规、一致，并把审核能力迁移到音乐内容运营。",
    metrics: [
      ["1000+", "独立审核材料"],
      ["7", "类质检维度"],
      ["1", "次优秀实习生"],
    ],
    sections: [
      {
        label: "01 / THE ROLE",
        title: "大量内容中，判断标准必须稳定。",
        body: [
          "参与全国“两红两优”相关材料审核，独立处理上千份申报内容；同时参与新媒体文案、脚本策划与短视频运营。",
          "这段经历训练了我快速定位问题、保持判断标准并完成闭环反馈的能力。",
        ],
      },
      {
        label: "02 / QA SYSTEM",
        title: "把审核拆成七种可以复用的检查。",
        body: [
          "检查合规性、事实准确性、材料充分性、格式规范性、价值导向、表述质量与重复内容。不同批次使用同一判断框架，减少遗漏。",
        ],
        items: ["合规", "准确", "充分", "规范", "导向", "表述", "重复"],
      },
      {
        label: "03 / TRANSFER",
        title: "审核能力，同样适用于歌曲入库与内容上架。",
        body: [
          "歌曲信息、版权材料、艺人资料和发布文案，也需要准确、完整、规范与风险意识。我可以把既有能力迁移到曲库入库、资料校验与运营质检。",
        ],
      },
    ],
  },
  {
    key: "event",
    no: "006",
    title: "南艺 520：从策划到全场落地",
    english: "LIVE CONTENT OPERATIONS",
    field: "学生总负责人 · 2025",
    intro: "统筹节目、内容、舞台物料、志愿者与后勤，让大型校园内容项目顺利发生。",
    metrics: [
      ["20+", "家主流媒体报道"],
      ["全流程", "学生总负责人"],
      ["跨学院", "节目与资源协同"],
    ],
    sections: [
      {
        label: "01 / THE MANDATE",
        title: "让创意、节目与现场资源在同一张图上运行。",
        body: [
          "作为“南艺 520”项目学生总负责人，我负责统筹规划与落地：对接各学院节目，推进文案、PPT、大屏内容、志愿者、后勤及周边发放。",
          "项目于 2025 年 5 月举行，获新华社等 20 余家主流媒体报道。",
        ],
      },
      {
        label: "02 / DELIVERY MAP",
        title: "策划、内容、协同、现场与传播，必须同步推进。",
        body: [
          "我把主题与流程拆成时间表，连接学院、表演团队与执行人员，并跟进现场动线、物料、突发情况及媒体素材归集。",
        ],
        items: ["策划", "内容", "协同", "现场", "传播"],
      },
      {
        label: "03 / EVIDENCE",
        title: "结果可见，证据仍在整理。",
        body: [
          "新华社等媒体报道截图、公众号推文和现场物料尚未归档完成，页面保留证据占位，后续替换为可核验图证。",
        ],
      },
    ],
  },
  {
    key: "editorial",
    no: "007",
    title: "音乐内容研究与 AI 工具实测",
    english: "MUSIC EDITORIAL & TOOL RESEARCH",
    field: "方法论写作 · 工具评测",
    intro: "把创作经验转译为可复核的方法、选型结论与运营动作。",
    metrics: [
      ["2", "篇完整研究文章"],
      ["25", "页原始文档"],
      ["6", "款 AI 音乐工具"],
    ],
    sections: [
      {
        label: "01 / CATALOG OPERATIONS",
        title: "从 16 首歌曲出发，建立可运营的音乐资产。",
        body: [
          "文章《从16首AI歌曲到可运营曲库》将音乐判断拆成 Track、Version、Segment 与 Distribution 四层数据，并用统一 ID、标签、16 维评测和版本证据连接筛选、分发与复盘。",
          "结论严格区分已完成资产与待采集数据：尚未完成的评分、时间码和平台播放结果不做虚构排名或效果结论。",
        ],
        items: ["TRACK / 作品主数据", "VERSION / 版本证据", "SEGMENT / 时间码", "DISTRIBUTION / 分发反馈"],
      },
      {
        label: "02 / TOOL BENCHMARK",
        title: "六款工具不做万能排名，只回答具体任务怎么选。",
        body: [
          "《六款AI音乐工具实测》基于中文歌曲、英文同输入对照、Jazz 与器乐任务，比较 Suno、Mureka、Udio、SOUNDRAW、AIVA 和 Stable Audio 的人声、编曲、可控性与导出能力。",
          "文章保留测试范围、不可比项和授权时点说明，把主观体验限定在本人当前样本与工作流内。",
        ],
        items: ["SUNO", "MUREKA", "UDIO", "SOUNDRAW", "AIVA", "STABLE AUDIO"],
      },
      {
        label: "03 / EDITORIAL METHOD",
        title: "把体验写成可查证、可更新的运营判断。",
        body: [
          "两篇文章都采用结论先行、证据分层、表格化比较与边界说明。网页提供快速摘要，招聘方也可下载 DOCX 原稿或字体兼容的 PDF 阅读版检查完整方法与图表。",
        ],
      },
    ],
  },
];

const scoutingSongs = [
  {
    rank: "01",
    song: "过海",
    artist: "王赫野 / 黄龄",
    score: 87.5,
    trajectory: [113, 50, 43, 28],
    signal: "四周连续上榜并由 113 位升至 28 位，当前榜位、动量与持续性同时成立。",
    cover: "/images/scouting/guohai.jpg",
    href: "https://y.qq.com/n/ryqq/songDetail/003DEzAQ3HSB9l",
  },
  {
    rank: "02",
    song: "两世洞天",
    artist: "黄星",
    score: 75.8,
    trajectory: [58, 39, 31, 35],
    signal: "四周稳定在 TOP 60，平均推荐度 70.2、畅销度 8.7，适合补做内容口碑与受众验证。",
    cover: "/images/scouting/liangshi-dongtian.jpg",
    href: "https://y.qq.com/n/ryqq/songDetail/001rRVzh2m7RJB",
  },
  {
    rank: "03",
    song: "挽红纱",
    artist: "龚琳娜 / 张云雷",
    score: 73.2,
    trajectory: [49, 33, 48, 42],
    signal: "四周维持 TOP 50，平均推荐度 68.5；需要补看传统文化内容场景与跨圈层受众结构。",
    cover: "/images/scouting/wan-hongsha.jpg",
    href: "https://y.qq.com/n/ryqq/songDetail/000QQHy712ZX4T",
  },
  {
    rank: "04",
    song: "周旋",
    artist: "王以太 / 艾热 AIR",
    score: 71.3,
    trajectory: [40, 27, 47, 47],
    signal: "四周保持 TOP 50、平均播放热度 78.2；当前动量回落，需判断是正常波动还是传播衰减。",
    cover: "/images/scouting/zhouxuan.jpg",
    href: "https://y.qq.com/n/ryqq/songDetail/0009cN231s93BH",
  },
  {
    rank: "05",
    song: "奔赴超无限",
    artist: "周深 / 北京环球度假区",
    score: 67.0,
    trajectory: [122, 53],
    signal: "两周上升 69 位且畅销度仅 1.4；IP 合作可能放大曝光，需拆分活动流量与自然留存。",
    cover: "/images/scouting/benfu-chaowuxian.jpg",
    href: "https://y.qq.com/n/ryqq/songDetail/002sjXkp1KKKUX",
  },
];

const scoutingArtists = [
  {
    artist: "万海东",
    label: "双曲复现",
    evidence: "2 首作品 / 7 个曲周；《山风山风等等我》进入 TOP 13，《有风的日落》连续四周上榜。",
  },
  {
    artist: "黄星",
    label: "推荐信号",
    evidence: "《两世洞天》四周维持 TOP 60，推荐度高而畅销度低，适合补受众与内容口碑数据。",
  },
  {
    artist: "吴琳珂 Moske",
    label: "持续上榜",
    evidence: "《失眠了》四周连续上榜并由 88 位升至 72 位，值得验证自然播放与收藏转化。",
  },
  {
    artist: "老中青民谣 / 小巷先生",
    label: "后程爬升",
    evidence: "《都有这一天》三周由 183 位升至 85 位，是低畅销度样本中的强爬升信号。",
  },
  {
    artist: "庄淇玟29",
    label: "低成本测试",
    evidence: "《爱你是我的秘密》三周由 154 位升至 103 位，适合以短视频内容测试验证真实响应。",
  },
];

const hiddenQualitySongs = [
  ["在两个心中间坐下 Two Worlds", "CY Leo / 王菀之", "11", "8.22"],
  ["Darling u", "邹沛沛", "13", "8.22"],
  ["无忧", "周菲戈", "16", "8.18"],
];

const scoutingPlatforms = [
  {
    platform: "腾讯音乐",
    access: "已采集",
    accessTone: "ready",
    role: "国内综合热度基线",
    signal: "由你榜四期周榜、浪潮榜专业评价",
    method: "已进入当前候选初筛",
    href: "https://chart.tencentmusic.com/",
  },
  {
    platform: "Apple Music 中国",
    access: "公开快照",
    accessTone: "ready",
    role: "完整播放与经典曲库结构",
    signal: "中国区 Top 100 的艺人及发行年代结构",
    method: "作为市场结构切片，不推断增长趋势",
    href: "https://music.apple.com/cn/new/top-charts",
  },
  {
    platform: "Spotify",
    access: "登录受限",
    accessTone: "gated",
    role: "海外华语与国际扩散",
    signal: "Global、香港、台湾、新加坡、马来西亚榜单",
    method: "取得同日授权快照后再纳入交叉验证",
    href: "https://charts.spotify.com/home",
  },
  {
    platform: "网易云音乐",
    access: "公开快照",
    accessTone: "ready",
    role: "新人发现与社区传播",
    signal: "飙升、新歌、原创、实时分享、潜力爆款榜",
    method: "同批公开榜单可复核；各榜日期不同，历史序列仍需持续采集",
    href: "https://music.163.com/discover/toplist",
  },
  {
    platform: "抖音音乐",
    access: "接口需权限",
    accessTone: "gated",
    role: "短视频传播与改编潜力",
    signal: "热歌、飙升、原创榜及音乐使用量",
    method: "获得开放平台权限后补入真实使用数据",
    href: "https://developer.open-douyin.com/capacity-center-page/capacity-detail/7180545630253629498",
  },
  {
    platform: "热门原声 / 音效",
    access: "非官方观察",
    accessTone: "manual",
    role: "梗音、对白、环境声机会",
    signal: "人工记录公开页面中的使用样本与内容场景",
    method: "不称抖音官方音效榜，不与歌曲榜名次混算",
  },
] as const;

const appleArtistSnapshot = [
  ["周杰伦", 30],
  ["林俊杰", 11],
  ["孙燕姿", 6],
  ["陈奕迅", 6],
] as const;

const appleYearSnapshot = [
  [1997, 1], [1998, 0], [1999, 3], [2000, 5], [2001, 2], [2002, 3],
  [2003, 4], [2004, 4], [2005, 7], [2006, 5], [2007, 7], [2008, 6],
  [2009, 5], [2010, 6], [2011, 1], [2012, 6], [2013, 2], [2014, 5],
  [2015, 4], [2016, 4], [2017, 1], [2018, 1], [2019, 3], [2020, 1],
  [2021, 0], [2022, 0], [2023, 1], [2024, 2], [2025, 1], [2026, 10],
] as const;

const neteaseChartSnapshot = [
  { chart: "飙升榜", returned: 100, reference: 100, cadence: "每日", updated: "2026.08.12", tone: "complete" },
  { chart: "新歌榜", returned: 100, reference: 100, cadence: "每日", updated: "2026.08.12", tone: "complete" },
  { chart: "原创榜", returned: 100, reference: 100, cadence: "每周", updated: "2026.08.06", tone: "complete" },
  { chart: "潜力爆款榜", returned: 10, reference: 200, cadence: "每周", updated: "2026.08.11", tone: "partial" },
  { chart: "实时分享榜", returned: 10, reference: 100, cadence: "每小时", updated: "2026.08.12", tone: "partial" },
] as const;

const neteaseOverlapSnapshot = [
  { label: "只命中一个榜单", value: 238, share: 85.3 },
  { label: "同时命中两个榜单", value: 41, share: 14.7 },
] as const;

const neteaseIntersectionSnapshot = [
  { label: "飙升 × 新歌", value: 22, charts: ["rising", "new"] },
  { label: "新歌 × 原创", value: 13, charts: ["new", "original"] },
  { label: "飙升 × 实时分享", value: 5, charts: ["rising", "realtime"] },
  { label: "原创 × 实时分享", value: 1, charts: ["original", "realtime"] },
] as const;

const scoutingEvidence = [
  {
    src: "/images/scouting/evidence/apple-music-cn-top-charts-20260812.jpg",
    alt: "Apple Music 中国区热门歌曲排行榜公开页面截图",
    source: "APPLE MUSIC 中国区",
    chart: "热门歌曲排行",
    captured: "截取于 2026.08.12",
    href: "https://music.apple.com/cn/new/top-charts",
  },
  {
    src: "/images/scouting/evidence/netease-rising-20260812.jpg",
    alt: "网易云音乐飙升榜公开页面截图",
    source: "网易云音乐",
    chart: "飙升榜",
    captured: "截取于 2026.08.12",
    href: "https://music.163.com/discover/toplist?id=19723756",
  },
  {
    src: "/images/scouting/evidence/tme-yobang-20260811.jpg",
    alt: "腾讯音乐由你榜公开页面截图",
    source: "腾讯音乐榜",
    chart: "由你榜",
    captured: "截取于 2026.08.11",
    href: "https://chart.tencentmusic.com/",
  },
] as const;

const scoutingSignalRoles = [
  {
    signal: "完整播放",
    sources: "腾讯音乐 / Apple Music / Spotify / 网易云",
    decision: "验证歌曲是否跨平台进入稳定收听场景",
  },
  {
    signal: "社区发现",
    sources: "网易云音乐",
    decision: "寻找小基盘但出现原创、分享或飙升复现的作品",
  },
  {
    signal: "短视频使用",
    sources: "抖音音乐",
    decision: "验证片段传播、改编空间与内容生产效率",
  },
  {
    signal: "原声 / 音效",
    sources: "人工公开样本",
    decision: "单独识别非歌曲型声音内容机会，不混入歌曲热度分",
  },
] as const;

const tracks = [
  { title: "蓝调夜行", scene: "URBAN BLUES", description: "夜色、铜管与都市行进感交织的 AI 音乐实验。", src: "/audio-stream/blue-night.m4a" },
  { title: "雨停在旧站台", scene: "POP BALLAD", description: "以旧站台和雨后余韵构建的叙事流行作品。", src: "/audio-stream/rain-old-platform.m4a" },
  { title: "梨园照山河", scene: "CHINESE FUSION", description: "戏曲音色与现代编曲交织的文化融合尝试。", src: "/audio-stream/opera-mountains.m4a" },
  { title: "RUN INTO THE THUNDER", scene: "ENGLISH ROCK", description: "高能鼓组与电吉他共同推进的英文摇滚作品。", src: "/audio-stream/run-into-thunder.m4a" },
  { title: "GOLD ON THE FLOOR", scene: "DANCE POP", description: "面向舞蹈与短视频场景的律动流行作品。", src: "/audio-stream/gold-on-floor.m4a" },
  { title: "未发送的晚安", scene: "MIDNIGHT MESSAGE", description: "夜间消息感与克制叙事构成的情绪作品。", src: "/audio-stream/unsent-goodnight.m4a" },
  { title: "凌晨四点的便利店", scene: "CITY POP", description: "都市深夜场景下的 City Pop 氛围实验。", src: "/audio-stream/four-am-store.m4a" },
  { title: "把夜走成清晨", scene: "DAWN WALK", description: "从暗夜走向晨光的渐进式情绪叙事。", src: "/audio-stream/night-to-morning.m4a" },
  { title: "百年新章", scene: "CEREMONIAL", description: "面向庆典与文化场景的宏阔融合创作。", src: "/audio-stream/century-new-chapter.m4a" },
  { title: "逆着光生长", scene: "UPLIFTING POP", description: "强调向上能量与副歌推动力的流行作品。", src: "/audio-stream/grow-against-light.m4a" },
  { title: "把名字写进风里", scene: "AIRY POP", description: "轻盈空气感与离别意象交织的流行作品。", src: "/audio-stream/name-in-wind.m4a" },
  { title: "月亮没有回信", scene: "LUNAR BALLAD", description: "围绕等待与失落展开的月夜抒情作品。", src: "/audio-stream/moon-no-reply.m4a" },
  { title: "SWINGING HARD", scene: "BRASS & GROOVE", description: "铜管、律动与现场感驱动的 Groove 实验。", src: "/audio-stream/swinging-hard.m4a" },
  { title: "风从长江吹来", scene: "RIVER FUSION", description: "江河意象与地域文化融合的音乐作品。", src: "/audio-stream/wind-from-yangtze.m4a" },
  { title: "玻璃海", scene: "AMBIENT POP", description: "透明质感与漂浮空间感构成的氛围流行作品。", src: "/audio-stream/glass-sea.m4a" },
  { title: "仍在路上", scene: "FORWARD", description: "面向前行叙事与成长主题的鼓舞型作品。", src: "/audio-stream/still-on-road.m4a" },
  { title: "MIDNIGHT SIGNAL", scene: "K-POP / SYNTH POP", description: "以午夜城市感与情绪推进为核心，在鲜明旋律、节奏张力与舞台化想象之间建立统一表达。", src: "/audio-stream/midnight-signal.m4a" },
  { title: "冬烬之地", scene: "SCI-FI FILM SCORE", description: "以“冷 / 静 / 裂变 / 余温”为轨迹，为冰原文明、母女告别与地下城市揭示构建叙事配乐。", src: "/audio-stream/winter-embers.m4a" },
];

const learnMoreLetters = "LEARN MORE".split("");
const learnMoreLambdas = [18, 15, 13, 11, 9.5, 8.5, 7.5, 6.7, 6, 5.5];

type UniversePlane = {
  id: string;
  title: string;
  subtitle: string;
  src?: string;
  art: string;
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  size: number;
  trackIndex?: number;
};

const universePlanes: UniversePlane[] = [
  { id: "blue", title: "蓝调夜行", subtitle: "URBAN BLUES", src: "/images/covers/blue-night-v3.jpg", art: "blue", x: -42, y: -31, z: 150, rx: -3, ry: 12, size: 13, trackIndex: 0 },
  { id: "rain", title: "雨停在旧站台", subtitle: "POP BALLAD", src: "/images/covers/rain-old-platform-v3.jpg", art: "rain", x: -22, y: -38, z: -90, rx: 4, ry: -10, size: 9, trackIndex: 1 },
  { id: "opera", title: "梨园照山河", subtitle: "CHINESE FUSION", src: "/images/covers/opera-mountains.jpg", art: "opera", x: 0, y: -39, z: 135, rx: -2, ry: 5, size: 10, trackIndex: 2 },
  { id: "thunder", title: "RUN INTO THE THUNDER", subtitle: "ENGLISH ROCK", src: "/images/covers/run-into-thunder-v3.jpg", art: "thunder", x: 22, y: -36, z: 100, rx: 2, ry: -13, size: 12, trackIndex: 3 },
  { id: "gold", title: "GOLD ON THE FLOOR", subtitle: "DANCE POP", src: "/images/covers/gold-on-floor-v3.jpg", art: "gold", x: 42, y: -29, z: -130, rx: -5, ry: 9, size: 11, trackIndex: 4 },
  { id: "goodnight", title: "未发送的晚安", subtitle: "MIDNIGHT MESSAGE", src: "/images/covers/unsent-goodnight-v4.jpg", art: "violet", x: 46, y: -10, z: -260, rx: 8, ry: 4, size: 8, trackIndex: 5 },
  { id: "store", title: "凌晨四点的便利店", subtitle: "CITY POP", src: "/images/covers/four-am-store-v3.jpg", art: "store", x: 44, y: 10, z: -180, rx: -4, ry: -16, size: 9, trackIndex: 6 },
  { id: "morning", title: "把夜走成清晨", subtitle: "DAWN WALK", src: "/images/covers/night-to-morning-v3.jpg", art: "dawn", x: 39, y: 30, z: -210, rx: 6, ry: 14, size: 8, trackIndex: 7 },
  { id: "chapter", title: "百年新章", subtitle: "CEREMONIAL", src: "/images/covers/century-new-chapter-v3.jpg", art: "crimson", x: 23, y: 39, z: -240, rx: -7, ry: -7, size: 8, trackIndex: 8 },
  { id: "light", title: "逆着光生长", subtitle: "UPLIFTING POP", src: "/images/covers/grow-against-light-v3.jpg", art: "light", x: 5, y: 42, z: -90, rx: 5, ry: -15, size: 9, trackIndex: 9 },
  { id: "wind", title: "把名字写进风里", subtitle: "AIRY POP", src: "/images/covers/name-in-wind-v3.jpg", art: "wind", x: -13, y: 40, z: 70, rx: 4, ry: 3, size: 9, trackIndex: 10 },
  { id: "moon", title: "月亮没有回信", subtitle: "LUNAR BALLAD", src: "/images/covers/moon-no-reply-v3.jpg", art: "moon", x: -31, y: 34, z: -320, rx: 7, ry: -2, size: 8, trackIndex: 11 },
  { id: "swing", title: "SWINGING HARD", subtitle: "BRASS & GROOVE", src: "/images/covers/swinging-hard-v3.jpg", art: "swing", x: -44, y: 22, z: -160, rx: -5, ry: 17, size: 8, trackIndex: 12 },
  { id: "river", title: "风从长江吹来", subtitle: "RIVER FUSION", src: "/images/covers/wind-from-yangtze-v3.jpg", art: "river", x: -46, y: 3, z: -270, rx: 5, ry: -9, size: 8, trackIndex: 13 },
  { id: "glass", title: "玻璃海", subtitle: "AMBIENT POP", src: "/images/covers/glass-sea-v3.jpg", art: "glass", x: -44, y: -14, z: -360, rx: -8, ry: 8, size: 8, trackIndex: 14 },
  { id: "road", title: "仍在路上", subtitle: "FORWARD", src: "/images/covers/still-on-road-v3.jpg", art: "road", x: -30, y: -23, z: -120, rx: -4, ry: -2, size: 9, trackIndex: 15 },
  { id: "midnight-signal", title: "MIDNIGHT SIGNAL", subtitle: "K-POP / SYNTH POP", src: "/images/covers/midnight-signal.jpg", art: "signal", x: 31, y: -19, z: 140, rx: 5, ry: -12, size: 11, trackIndex: 16 },
  { id: "winter-embers", title: "冬烬之地", subtitle: "SCI-FI FILM SCORE", src: "/images/covers/winter-embers.jpg", art: "embers", x: 30, y: 21, z: 180, rx: -2, ry: 4, size: 11, trackIndex: 17 },
];

const gatePlaneIds = new Set(["blue", "thunder", "goodnight", "chapter", "swing", "midnight-signal"]);
const mobileFeaturedTracks = [16, 0, 3, 5, 17];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
}

type LyricLine = {
  text: string;
  gapBefore: number;
};

type LyricCue = LyricLine & {
  at: number;
};

function parseLyricLines(rawLyrics?: string | null, trackTitle?: string): LyricLine[] {
  if (!rawLyrics) return [];
  const lines: LyricLine[] = [];
  let gapBefore = 0;

  rawLyrics.split(/\r?\n/).forEach((rawLine) => {
    const text = rawLine.trim();
    if (!text) {
      gapBefore = Math.min(2.4, gapBefore + 0.45);
      return;
    }
    if (/^\[[^\]]+\]$/.test(text)) {
      gapBefore = Math.min(2.4, gapBefore + 1.15);
      return;
    }
    if (
      text === "```"
      || (
        lines.length === 0
        && (text === trackTitle || /^《[^》]+》$/.test(text))
      )
    ) {
      return;
    }
    lines.push({ text, gapBefore });
    gapBefore = 0;
  });

  return lines;
}

function lyricLineWeight(text: string) {
  const compact = text.replace(/\s+/g, "");
  const hasCjk = /[\u3400-\u9fff]/.test(compact);
  const units = hasCjk
    ? Array.from(compact).length
    : Math.max(1, text.trim().split(/\s+/).length * 1.55);
  return Math.max(2.25, Math.min(7.4, 1.25 + units * 0.36));
}

function buildLyricCues(
  rawLyrics: string | null | undefined,
  duration: number,
  trackTitle?: string,
): LyricCue[] {
  const lines = parseLyricLines(rawLyrics, trackTitle);
  if (!lines.length) return [];

  if (!Number.isFinite(duration) || duration <= 0) {
    return lines.map((line, index) => ({ ...line, at: 7 + index * 4 }));
  }

  const leadIn = Math.min(15, Math.max(6, duration * 0.045));
  const tail = Math.min(10, Math.max(4, duration * 0.03));
  const usable = Math.max(lines.length * 1.8, duration - leadIn - tail);
  const totalWeight = lines.reduce(
    (sum, line) => sum + line.gapBefore + lyricLineWeight(line.text),
    0,
  );
  let elapsed = leadIn;

  return lines.map((line) => {
    elapsed += (line.gapBefore / totalWeight) * usable;
    const cue = { ...line, at: elapsed };
    elapsed += (lyricLineWeight(line.text) / totalWeight) * usable;
    return cue;
  });
}

function findActiveLyric(cues: LyricCue[], current: number) {
  let low = 0;
  let high = cues.length - 1;
  let active = -1;

  while (low <= high) {
    const middle = Math.floor((low + high) / 2);
    if (cues[middle].at <= current) {
      active = middle;
      low = middle + 1;
    } else {
      high = middle - 1;
    }
  }

  return active;
}

function Brand({ onHome }: { onHome: () => void }) {
  return (
    <button className="brand-mark" onClick={onHome} aria-label="返回作品集首页">
      <strong>CASSIE ZHA</strong>
      <span>MUSIC CONTENT</span>
    </button>
  );
}

function WordNavigation({
  view,
  chooseView,
}: {
  view: View;
  chooseView: (view: View) => void;
}) {
  return (
    <nav className="word-nav" aria-label="主要导航">
      <button
        className={view === "songs" || view === "universe" ? "is-active" : ""}
        aria-current={view === "songs" || view === "universe" ? "page" : undefined}
        onClick={() => chooseView("songs")}
      >MUSIC</button>
      <button
        className={view === "projects" ? "is-active" : ""}
        aria-current={view === "projects" ? "page" : undefined}
        onClick={() => chooseView("projects")}
      >WORK</button>
      <button
        className={view === "about" ? "is-active" : ""}
        aria-current={view === "about" ? "page" : undefined}
        onClick={() => chooseView("about")}
      >ABOUT</button>
      <button
        className={view === "contact" ? "is-active" : ""}
        aria-current={view === "contact" ? "page" : undefined}
        onClick={() => chooseView("contact")}
      >CONTACT</button>
    </nav>
  );
}

function trapDialogFocus(event: React.KeyboardEvent<HTMLElement>) {
  if (event.key !== "Tab") return;
  const focusable = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]):not([aria-disabled="true"]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute("inert"));
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function useInertialCamera(enabled: boolean) {
  const cameraRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ yaw: 0, pitch: 0 });
  const currentRef = useRef({ yaw: 0, pitch: 0 });
  const suppressClickUntilRef = useRef(0);
  const dragRef = useRef({
    active: false,
    moved: false,
    pointerId: -1,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0,
  });

  useEffect(() => {
    const camera = cameraRef.current;
    if (!camera) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!enabled || reduceMotion) {
      camera.style.setProperty("--camera-yaw", "0deg");
      camera.style.setProperty("--camera-pitch", "0deg");
      camera.style.setProperty("--camera-blur", "0px");
      camera.style.setProperty("--camera-sway", "0deg");
      return;
    }

    let frame = 0;
    const render = () => {
      const current = currentRef.current;
      const target = targetRef.current;
      const yawDistance = target.yaw - current.yaw;
      const pitchDistance = target.pitch - current.pitch;
      current.yaw += yawDistance * 0.035;
      current.pitch += pitchDistance * 0.035;
      const motionBlur = Math.min(1.15, Math.hypot(yawDistance, pitchDistance) * 0.085);
      const cameraSway = Math.max(-1.6, Math.min(1.6, yawDistance * 0.16));
      camera.style.setProperty("--camera-yaw", `${current.yaw.toFixed(3)}deg`);
      camera.style.setProperty("--camera-pitch", `${current.pitch.toFixed(3)}deg`);
      camera.style.setProperty("--camera-x", `${(-current.yaw * 4.4).toFixed(2)}px`);
      camera.style.setProperty("--camera-y", `${(current.pitch * 3.2).toFixed(2)}px`);
      camera.style.setProperty("--camera-blur", `${motionBlur.toFixed(2)}px`);
      camera.style.setProperty("--camera-sway", `${cameraSway.toFixed(3)}deg`);
      frame = window.requestAnimationFrame(render);
    };
    frame = window.requestAnimationFrame(render);
    return () => window.cancelAnimationFrame(frame);
  }, [enabled]);

  const onPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!enabled) return;
    if (dragRef.current.active) {
      const dx = event.clientX - dragRef.current.startX;
      const dy = event.clientY - dragRef.current.startY;
      if (!dragRef.current.moved && Math.hypot(dx, dy) < 8) return;
      if (!dragRef.current.moved) {
        dragRef.current.moved = true;
        event.currentTarget.setPointerCapture(event.pointerId);
      }
      targetRef.current.yaw = Math.max(-12, Math.min(12, dragRef.current.startYaw + dx * 0.035));
      targetRef.current.pitch = Math.max(-9, Math.min(9, dragRef.current.startPitch - dy * 0.035));
      event.preventDefault();
      return;
    }
    if (event.pointerType !== "mouse") return;
    const box = event.currentTarget.getBoundingClientRect();
    targetRef.current.yaw = ((event.clientX - box.left) / box.width - 0.5) * 18;
    targetRef.current.pitch = -((event.clientY - box.top) / box.height - 0.5) * 12;
  };

  const onPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (!enabled || event.pointerType === "mouse") return;
    dragRef.current = {
      active: true,
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startYaw: targetRef.current.yaw,
      startPitch: targetRef.current.pitch,
    };
  };

  const onPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (!dragRef.current.active || dragRef.current.pointerId !== event.pointerId) return;
    if (dragRef.current.moved) suppressClickUntilRef.current = performance.now() + 450;
    dragRef.current.active = false;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
  };

  const onPointerLeave = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType === "mouse" && !dragRef.current.active) {
      targetRef.current = { yaw: 0, pitch: 0 };
    }
  };

  return {
    cameraRef,
    handlers: {
      onPointerMove,
      onPointerDown,
      onPointerUp,
      onPointerCancel: onPointerUp,
      onLostPointerCapture: onPointerUp,
      onPointerLeave,
    },
    shouldSuppressClick: () => {
      const suppress = performance.now() < suppressClickUntilRef.current;
      if (suppress) suppressClickUntilRef.current = 0;
      return suppress;
    },
  };
}

function SoundGate({
  phase,
  enter,
}: {
  phase: EntryPhase;
  enter: (sound: boolean) => void;
}) {
  const zooming = phase === "zooming";
  return (
    <div
      className={`sound-gate ${zooming ? "sound-gate--zooming" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="声音设置"
      onKeyDown={(event) => {
        if (event.key === "Escape" && !zooming) {
          event.preventDefault();
          enter(false);
          return;
        }
        trapDialogFocus(event);
      }}
    >
      <div className="sound-gate__depth" aria-hidden="true">
        {universePlanes.filter((plane) => gatePlaneIds.has(plane.id)).map((plane, index) => (
          <span
            className="gate-cover"
            key={plane.id}
            style={{
              "--gate-x": `${[13, 81, 26, 70, 9, 89][index]}%`,
              "--gate-y": `${[18, 14, 75, 78, 48, 46][index]}%`,
              "--gate-z": `${[-320, -180, -410, -270, -520, -450][index]}px`,
              "--gate-rx": `${plane.rx}deg`,
              "--gate-ry": `${plane.ry}deg`,
              "--gate-size": `${[14, 17, 12, 13, 10, 11][index]}vw`,
              "--gate-order": index,
            } as CSSProperties}
          >
            {plane.src && <Image unoptimized src={plane.src} alt="" fill sizes="18vw" />}
          </span>
        ))}
      </div>
      <button
        className="sound-gate__enter"
        onClick={() => { if (!zooming) enter(true); }}
        aria-disabled={zooming}
        aria-label="开启声音并进入音乐宇宙"
        autoFocus
      >
        <span className="sound-gate__prompt" id="sound-gate-title" aria-hidden="true">
          <span>ENTER</span>
          <span>CASSIE&apos;S</span>
          <span>MUSIC</span>
          <span>UNIVERSE</span>
          <span>WITH</span>
          <span>SOUND</span>
        </span>
        <span className="sr-only">点击任意位置开启声音并进入 Cassie 的音乐宇宙</span>
      </button>
      <button
        className="enter-muted"
        onClick={() => { if (!zooming) enter(false); }}
        aria-disabled={zooming}
      >
        ENTER WITHOUT SOUND · 静音进入
      </button>
    </div>
  );
}

function MusicUniverse({
  openProject,
  openFilm,
  chooseView,
  playTrack,
  warmTrack,
  activeTrack,
  playing,
  interactive,
}: {
  openProject: (key: ProjectKey) => void;
  openFilm: () => void;
  chooseView: (view: View) => void;
  playTrack: (index: number) => void;
  warmTrack: (index: number) => void;
  activeTrack: number;
  playing: boolean;
  interactive: boolean;
}) {
  const featuredVideoRef = useRef<HTMLVideoElement>(null);
  const [featuredFilmUnavailable, setFeaturedFilmUnavailable] = useState(false);
  const { cameraRef, handlers, shouldSuppressClick } = useInertialCamera(interactive);
  const [pointerHoverId, setPointerHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
  const planeButtonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [rovingPlaneIndex, setRovingPlaneIndex] = useState(0);
  const cursorLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const cursorFrameRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -120, y: -120, initialized: false });
  const cursorPositionsRef = useRef(
    learnMoreLetters.map(() => ({ x: -120, y: -120 })),
  );
  const activeId = pointerHoverId ?? focusId;
  const focusedPlane = activeId
    ? universePlanes.find((plane) => plane.id === activeId) ?? null
    : null;
  const pointerHoveredPlane = pointerHoverId
    ? universePlanes.find((plane) => plane.id === pointerHoverId) ?? null
    : null;

  const pauseFeaturedPreview = () => featuredVideoRef.current?.pause();
  const playFeaturedPreview = () => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    featuredVideoRef.current?.play().catch(() => undefined);
  };
  const openFeaturedFilm = () => {
    pauseFeaturedPreview();
    openFilm();
  };

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
      if (cursorFrameRef.current !== null) window.cancelAnimationFrame(cursorFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pointerHoverId || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      pointerRef.current.initialized = false;
      if (cursorFrameRef.current !== null) {
        window.cancelAnimationFrame(cursorFrameRef.current);
        cursorFrameRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    const animate = (time: number) => {
      const pointer = pointerRef.current;
      const positions = cursorPositionsRef.current;
      const dt = Math.min(0.05, Math.max(0.001, (time - lastTime) / 1000));
      lastTime = time;

      if (!pointer.initialized) {
        let startX = pointer.x + 18;
        positions.forEach((position, index) => {
          position.x = startX;
          position.y = pointer.y - 16;
          startX += learnMoreLetters[index] === " " ? 7 : 10;
        });
        pointer.initialized = true;
      }

      positions.forEach((position, index) => {
        const previous = positions[index - 1];
        const targetX = index === 0
          ? pointer.x + 18
          : previous.x + (learnMoreLetters[index - 1] === " " ? 7 : 10);
        const targetY = index === 0 ? pointer.y - 16 : previous.y;
        const alpha = 1 - Math.exp(-learnMoreLambdas[index] * dt);
        position.x += (targetX - position.x) * alpha;
        position.y += (targetY - position.y) * alpha;
        const letter = cursorLettersRef.current[index];
        if (letter) {
          letter.style.transform = `translate3d(${position.x.toFixed(2)}px, ${position.y.toFixed(2)}px, 0)`;
        }
      });

      cursorFrameRef.current = window.requestAnimationFrame(animate);
    };

    cursorFrameRef.current = window.requestAnimationFrame(animate);
    return () => {
      if (cursorFrameRef.current !== null) {
        window.cancelAnimationFrame(cursorFrameRef.current);
        cursorFrameRef.current = null;
      }
    };
  }, [pointerHoverId]);

  const scheduleHover = (plane: UniversePlane, pointerType: string) => {
    if (pointerType !== "mouse") return;
    if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = window.setTimeout(() => {
      setPointerHoverId(plane.id);
      hoverTimerRef.current = null;
    }, 100);
  };

  const clearPointerHover = (planeId?: string) => {
    if (hoverTimerRef.current !== null) {
      window.clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setPointerHoverId((current) => (!planeId || current === planeId ? null : current));
  };

  const moveLearnMore = (event: React.PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    pointerRef.current.x = event.clientX;
    pointerRef.current.y = event.clientY;
  };

  return (
    <main
      className={`music-universe ${focusedPlane ? "is-focused" : ""}`}
      id="main-content"
      tabIndex={-1}
    >
      <span className="sr-only">首推《冬烬之地》原创概念影片，同屏可探索 Cassie 的 18 首音乐作品。</span>
      <article
        className={`featured-film ${focusedPlane ? "is-background" : ""}`}
        aria-labelledby="featured-film-title"
        aria-hidden={focusedPlane ? true : undefined}
        inert={focusedPlane ? true : undefined}
      >
        <button
          className="featured-film__visual"
          onClick={openFeaturedFilm}
          onPointerEnter={playFeaturedPreview}
          onPointerLeave={pauseFeaturedPreview}
          onFocus={playFeaturedPreview}
          onBlur={pauseFeaturedPreview}
          aria-label="观看首推作品《冬烬之地》完整概念影片"
        >
          {featuredFilmUnavailable ? (
            <Image unoptimized src="/images/projects/winter-embers-poster-v2.jpg" alt="" fill sizes="58vw" />
          ) : (
            <video
              ref={featuredVideoRef}
              muted
              loop
              playsInline
              preload="metadata"
              poster="/images/projects/winter-embers-poster-v2.jpg"
              aria-hidden="true"
              onError={() => setFeaturedFilmUnavailable(true)}
            >
              <source src="/video/winter-embers-teaser.mp4" type="video/mp4" />
            </video>
          )}
          <span className="featured-film__scrim" aria-hidden="true" />
          <span className="featured-film__play" aria-hidden="true">PLAY FILM</span>
        </button>
        <div className="featured-film__copy">
          <span>FEATURED FILM / 首推影片</span>
          <h1 id="featured-film-title">冬烬之地</h1>
          <p>原创科幻概念影片与同名配乐，以声音推动世界揭示。</p>
          <button onClick={() => openProject("winter-embers")}>查看创作案例</button>
        </div>
      </article>
      <section
        className="music-universe__stage"
        aria-label="可探索的歌曲专辑宇宙"
        {...handlers}
        onPointerMove={(event) => {
          handlers.onPointerMove(event);
          moveLearnMore(event);
        }}
        onPointerLeave={(event) => {
          handlers.onPointerLeave(event);
          clearPointerHover();
        }}
      >
        <div className="music-universe__arrival">
          <div className="music-universe__camera" ref={cameraRef}>
            <div className="music-universe__world">
              <div className="music-universe__haze" aria-hidden="true" />
              {universePlanes.map((plane, index) => {
                const isTrack = plane.trackIndex !== undefined;
                const isPlaying = isTrack && activeTrack === plane.trackIndex && playing;
                const isHovered = activeId === plane.id;
                const isDimmed = activeId !== null && !isHovered;
                const baseOpacity = Math.max(0.38, Math.min(0.64, 0.5 + plane.z / 1400));
                const style = {
                  "--plane-x": `${plane.x}vw`,
                  "--plane-y": `${plane.y}vh`,
                  "--plane-z": `${plane.z}px`,
                  "--plane-rx": `${plane.rx}deg`,
                  "--plane-ry": `${plane.ry}deg`,
                  "--plane-size": `${plane.size}vw`,
                  "--plane-opacity": baseOpacity.toFixed(2),
                } as React.CSSProperties;
                return (
                  <button
                    className={[
                      "music-plane",
                      `art-${plane.art}`,
                      isPlaying ? "is-playing" : "",
                      isHovered ? "is-hovered" : "",
                      isDimmed ? "is-dimmed" : "",
                    ].filter(Boolean).join(" ")}
                    style={style}
                    key={plane.id}
                    ref={(element) => { planeButtonRefs.current[index] = element; }}
                    tabIndex={index === rovingPlaneIndex ? 0 : -1}
                    onPointerEnter={(event) => {
                      moveLearnMore(event);
                      if (isTrack) warmTrack(plane.trackIndex!);
                      scheduleHover(plane, event.pointerType);
                    }}
                    onPointerLeave={() => clearPointerHover(plane.id)}
                    onFocus={() => {
                      setRovingPlaneIndex(index);
                      setFocusId(plane.id);
                      if (isTrack) warmTrack(plane.trackIndex!);
                    }}
                    onBlur={() => setFocusId((current) => current === plane.id ? null : current)}
                    onKeyDown={(event) => {
                      const direction = event.key === "ArrowRight" || event.key === "ArrowDown"
                        ? 1
                        : event.key === "ArrowLeft" || event.key === "ArrowUp"
                          ? -1
                          : 0;
                      if (!direction) return;
                      event.preventDefault();
                      const nextIndex = (index + direction + universePlanes.length) % universePlanes.length;
                      setRovingPlaneIndex(nextIndex);
                      planeButtonRefs.current[nextIndex]?.focus();
                    }}
                    onClick={(event) => {
                      if (shouldSuppressClick()) {
                        event.preventDefault();
                        return;
                      }
                      if (isTrack) playTrack(plane.trackIndex!);
                      else openProject("catalog");
                    }}
                    aria-label={isTrack ? `播放歌曲：${plane.title}` : `查看曲库项目：${plane.title}`}
                  >
                    <span className="music-plane__art">
                      {plane.src ? (
                        <Image
                          unoptimized
                          src={plane.src}
                          alt=""
                          fill
                          sizes="(max-width: 760px) 34vw, 18vw"
                        />
                      ) : (
                        <span className="generated-cover" aria-hidden="true"><i /><b>{String(index + 1).padStart(2, "0")}</b></span>
                      )}
                    </span>
                    <span className="music-plane__meta">
                      <strong>{plane.title}</strong>
                      <small>{plane.subtitle} · {isTrack ? "PLAY" : "CATALOG"}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <nav className="mobile-universe-tracks" aria-label="首屏歌曲快捷试听">
        {mobileFeaturedTracks.map((trackIndex) => {
          const track = tracks[trackIndex];
          const plane = universePlanes.find((item) => item.trackIndex === trackIndex)!;
          return (
            <button
              key={track.src}
              onClick={() => playTrack(trackIndex)}
              onPointerEnter={() => warmTrack(trackIndex)}
              onFocus={() => warmTrack(trackIndex)}
              aria-label={`播放歌曲：${track.title}`}
            >
              <span>
                {plane.src && <Image unoptimized src={plane.src} alt="" fill sizes="28vw" />}
                <i aria-hidden="true">PLAY</i>
              </span>
              <strong>{track.title}</strong>
            </button>
          );
        })}
      </nav>
      <div className={`music-universe__hud ${focusedPlane ? "is-showing-track" : ""}`}>
        {focusedPlane ? (
          <div className="music-universe__focus-copy" key={focusedPlane.id} aria-live="polite">
            <h2>{focusedPlane.title}</h2>
            <span className="music-universe__focus-scene">{focusedPlane.subtitle}</span>
            <p className="music-universe__focus-description">
              {focusedPlane.trackIndex !== undefined
                ? tracks[focusedPlane.trackIndex].description
                : "从生成歌曲到可检索、可评估、可分发的音乐内容资产。"}
            </p>
            <small>FROM THE 18-TRACK MUSIC CATALOG · CLICK TO LISTEN</small>
          </div>
        ) : (
          <>
            <button onClick={() => chooseView("songs")} aria-label="打开歌曲索引">
              <i>＋</i>
              <span>MUSIC INDEX / 18 首歌曲</span>
            </button>
            <p>拖动探索 · 悬停聚焦 · 点击试听</p>
          </>
        )}
      </div>
      <div className={`learn-more-cursor ${pointerHoveredPlane ? "is-visible" : ""}`} aria-hidden="true">
        {learnMoreLetters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            ref={(element) => { cursorLettersRef.current[index] = element; }}
          >
            {character === " " ? "\u00a0" : character}
          </span>
        ))}
      </div>
      <WordNavigation view="universe" chooseView={chooseView} />
    </main>
  );
}

function SongIndex({
  playTrack,
  warmTrack,
  chooseView,
}: {
  playTrack: (index: number) => void;
  warmTrack: (index: number) => void;
  chooseView: (view: View) => void;
}) {
  return (
    <main className="song-index" id="main-content">
      <button className="space-back" onClick={() => chooseView("universe")}>
        ← 返回音乐宇宙
      </button>
      <div className="song-index__heading">
        <span>SONG INDEX / 歌曲目录</span>
        <p>18 TRACKS · 点击试听</p>
      </div>
      <div className="song-index__featured" aria-label="精选试听">
        {mobileFeaturedTracks.map((trackIndex) => {
          const track = tracks[trackIndex];
          const plane = universePlanes.find((item) => item.trackIndex === trackIndex)!;
          return (
            <button
              key={track.src}
              onPointerEnter={() => warmTrack(trackIndex)}
              onFocus={() => warmTrack(trackIndex)}
              onClick={() => playTrack(trackIndex)}
            >
              <span className="song-index__cover">
                {plane.src && <Image unoptimized src={plane.src} alt={`${track.title}专辑封面`} fill sizes="(max-width: 760px) 44vw, 15vw" />}
                <i aria-hidden="true">PLAY</i>
              </span>
              <strong>{track.title}</strong>
              <em>{track.scene}</em>
            </button>
          );
        })}
      </div>
      <div className="song-index__grid">
        {tracks.map((track, index) => (
          <button
            key={track.src}
            onPointerEnter={() => warmTrack(index)}
            onFocus={() => warmTrack(index)}
            onClick={() => playTrack(index)}
          >
            <span>{String(index + 1).padStart(3, "0")}</span>
            <strong>{track.title}</strong>
            <em>{track.scene}</em>
            <i aria-hidden="true">PLAY</i>
          </button>
        ))}
      </div>
      <WordNavigation view="songs" chooseView={chooseView} />
    </main>
  );
}

function ProjectsIndex({
  openProject,
  chooseView,
}: {
  openProject: (key: ProjectKey) => void;
  chooseView: (view: View) => void;
}) {
  return (
    <main className="projects-index" id="main-content">
      <button className="space-back" onClick={() => chooseView("universe")}>← BACK TO SPACE VIEW</button>
      <div className="index-heading">
        <span>SELECTED WORK</span>
        <p>2023 - 2026</p>
      </div>
      <div className="project-rows">
        {projects.map((project) => (
          <button key={project.key} onClick={() => openProject(project.key)}>
            <span>{project.no}</span>
            <strong>{project.title}</strong>
            <em>{project.english}</em>
          </button>
        ))}
      </div>
      <WordNavigation view="projects" chooseView={chooseView} />
    </main>
  );
}

function TrackList({
  playTrack,
  warmTrack,
}: {
  playTrack: (index: number) => void;
  warmTrack: (index: number) => void;
}) {
  return (
    <div className="project-tracks">
      {tracks.map((track, index) => (
        <button
          key={track.src}
          onPointerEnter={() => warmTrack(index)}
          onFocus={() => warmTrack(index)}
          onClick={() => playTrack(index)}
        >
          <span>{String(index + 1).padStart(3, "0")}</span>
          <strong>{track.title}</strong>
          <em>{track.scene}</em>
          <i>PLAY ↗</i>
        </button>
      ))}
    </div>
  );
}

function ScoutingCase() {
  return (
    <section className="scouting-case" aria-labelledby="scouting-case-title">
      <header className="scouting-executive">
        <p>EXECUTIVE SUMMARY / 结论先行</p>
        <h2 id="scouting-case-title">5 首歌进入下一轮补数，5 组音乐人进入观察名单。</h2>
        <div className="scouting-executive__copy">
          <p>
            分析覆盖 2026 年 7 月 13 日至 8 月 9 日四期完整周榜。观察分用于决定“先向谁补数据”，
            不是爆款概率、签约建议或价值判断。
          </p>
          <span>DATA SNAPSHOT / 2026.08.11</span>
        </div>
      </header>

      <section className="scouting-quality" aria-labelledby="scouting-quality-title">
        <div>
          <p>01 / DATA QUALITY</p>
          <h3 id="scouting-quality-title">先发现失真字段，再开始评分。</h3>
        </div>
        <div className="scouting-quality__grid">
          <article>
            <strong>800 / 800</strong>
            <span>周 × 名次粒度唯一</span>
            <p>每期 200 首、名次 1 - 200，无周内重复记录。</p>
          </article>
          <article>
            <strong>100%</strong>
            <span>传播度与喜好度为零</span>
            <p>两列无法区分候选，明确剔除，不制造无效精确度。</p>
          </article>
          <article>
            <strong>22.25</strong>
            <span>畅销度样本中位数</span>
            <p>只保留不高于中位数的候选，降低成熟购买盘干扰。</p>
          </article>
        </div>
        <div className="scouting-formula" aria-label="观察分计算方法">
          <span><b>30%</b> 当前位置</span>
          <span><b>25%</b> 名次动量</span>
          <span><b>20%</b> 持续性</span>
          <span><b>15%</b> 播放热度</span>
          <span><b>10%</b> 推荐度</span>
        </div>
      </section>

      <section className="scouting-watchlist" aria-labelledby="scouting-watchlist-title">
        <div className="scouting-section-heading">
          <p>02 / SONG WATCHLIST</p>
          <h3 id="scouting-watchlist-title">值得优先补数的 5 首歌</h3>
          <span>观察分 ≠ 爆款概率</span>
        </div>
        <div className="scouting-song-list">
          {scoutingSongs.map((item) => (
            <article className="scouting-song" key={item.song}>
              <span className="scouting-song__rank">{item.rank}</span>
              <a className="scouting-song__cover" href={item.href} target="_blank" rel="noreferrer" aria-label={`在腾讯音乐打开《${item.song}》`}>
                <Image unoptimized src={item.cover} alt={`${item.song}专辑封面`} fill sizes="(max-width: 720px) 28vw, 132px" />
              </a>
              <div className="scouting-song__identity">
                <h4>{item.song}</h4>
                <p>{item.artist}</p>
                <div className="scouting-trajectory" aria-label={`${item.song}四周榜位轨迹`}>
                  {item.trajectory.map((value, index) => (
                    <span key={`${item.song}-${index}`}>{value}</span>
                  ))}
                </div>
              </div>
              <div className="scouting-song__signal">
                <p>{item.signal}</p>
                <a href={item.href} target="_blank" rel="noreferrer">OPEN OFFICIAL TRACK ↗</a>
              </div>
              <div className="scouting-score">
                <strong>{item.score.toFixed(1)}</strong>
                <span>OBSERVATION SCORE</span>
                <i><b style={{ width: `${item.score}%` }} /></i>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="scouting-artists" aria-labelledby="scouting-artists-title">
        <div className="scouting-section-heading">
          <p>03 / ARTIST WATCHLIST</p>
          <h3 id="scouting-artists-title">从“单曲信号”走向“艺人复现”</h3>
          <span>优先寻找连续性，而非一次性高点</span>
        </div>
        <div className="scouting-artist-list">
          {scoutingArtists.map((item, index) => (
            <article key={item.artist}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <h4>{item.artist}</h4>
                <em>{item.label}</em>
              </div>
              <p>{item.evidence}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="scouting-cross scouting-cross-platform" aria-labelledby="scouting-cross-title">
        <div className="scouting-section-heading scouting-cross__heading">
          <p>04 / CROSS-PLATFORM RADAR</p>
          <h3 id="scouting-cross-title">六条信号线不是六张相同的榜单，而是不同的市场证据。</h3>
          <span>公开快照、权限受限与人工观察分开呈现</span>
        </div>

        <div className="scouting-platform-grid" aria-label="六类平台与声音数据源">
          {scoutingPlatforms.map((item, index) => (
            <article
              className="scouting-platform-card"
              data-index={String(index + 1).padStart(2, "0")}
              key={`card-${item.platform}`}
            >
              <div>
                <h4>{item.platform}</h4>
                <span className={`scouting-cross__status is-${item.accessTone}`}>{item.access}</span>
              </div>
              <strong>{item.role}</strong>
              <p>{item.signal}</p>
            </article>
          ))}
        </div>

        <div className="scouting-cross__matrix scouting-matrix" role="region" aria-labelledby="scouting-cross-matrix-title" tabIndex={0}>
          <h4 id="scouting-cross-matrix-title">平台覆盖与数据状态矩阵</h4>
          <table>
            <caption>截至 2026 年 8 月 12 日的跨平台数据可用性、信号角色与使用边界</caption>
            <thead>
              <tr>
                <th scope="col">平台</th>
                <th scope="col">数据状态</th>
                <th scope="col">主要角色</th>
                <th scope="col">观察信号</th>
                <th scope="col">本轮处理</th>
              </tr>
            </thead>
            <tbody>
              {scoutingPlatforms.map((item) => (
                <tr key={item.platform}>
                  <th scope="row">
                    {item.href ? (
                      <a href={item.href} target="_blank" rel="noreferrer">{item.platform} ↗</a>
                    ) : item.platform}
                  </th>
                  <td><span className={`scouting-cross__status is-${item.accessTone}`}>{item.access}</span></td>
                  <td>{item.role}</td>
                  <td>{item.signal}</td>
                  <td>{item.method}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <section className="scouting-chart scouting-chart--apple" aria-labelledby="scouting-apple-title">
          <header className="scouting-chart__header">
            <div>
              <p>APPLE MUSIC CN / ONE-DAY SNAPSHOT</p>
              <h4 id="scouting-apple-title">中国区 Top 100 呈现“头部集中 + 经典曲库占比较高”。</h4>
            </div>
            <span>2026.08.12 · 单日结构快照，不代表趋势</span>
          </header>
          <div className="scouting-viz-grid">
            <figure className="scouting-viz scouting-viz--ranking">
              <figcaption>
                <strong>当日 Top 100 艺人作品数</strong>
                <span>单位：榜内作品数（首）· 按作品数降序</span>
              </figcaption>
              <div className="scouting-viz-kpis" aria-label="Apple Music 榜单艺人集中度摘要">
                <p><strong>29</strong><span>位艺人</span></p>
                <p><strong>30%</strong><span>TOP 1 占比</span></p>
                <p><strong>53%</strong><span>TOP 4 占比</span></p>
              </div>
              <div className="scouting-viz-axis scouting-viz-axis--horizontal" aria-hidden="true">
                <span>0</span><span>10</span><span>20</span><span>30 首</span>
              </div>
              <ol className="scouting-viz-ranking" aria-label="Apple Music 中国区 Top 100 艺人作品数前四名">
                {appleArtistSnapshot.map(([label, value], index) => (
                  <li key={label}>
                    <span className="scouting-viz-rank">{String(index + 1).padStart(2, "0")}</span>
                    <span className="scouting-viz-label">{label}</span>
                    <span className="scouting-viz-track" aria-hidden="true">
                      <i style={{ "--viz-value": `${(value / 30) * 100}%` } as CSSProperties} />
                    </span>
                    <strong>{value} <small>· {value}%</small></strong>
                  </li>
                ))}
              </ol>
              <p className="scouting-viz-footnote">其余 25 位艺人合计 47 首；“其他”不是一位可与单艺人横比的对象，因此不作为第五根柱。</p>
            </figure>
            <figure className="scouting-viz scouting-viz--histogram">
              <figcaption>
                <strong>榜内作品的发行年份分布</strong>
                <span>发行年 1997 - 2026 · 单位：作品数（首）</span>
              </figcaption>
              <div className="scouting-viz-histogram" aria-label="Apple Music 中国区 Top 100 作品发行年份分布">
                <div className="scouting-viz-y-axis" aria-hidden="true"><span>10</span><span>5</span><span>0</span></div>
                <ol>
                  {appleYearSnapshot.map(([year, value]) => (
                    <li key={year} className={year === 2026 ? "is-current" : undefined}>
                      <span className="scouting-viz-column" style={{ "--viz-value": `${value * 10}%` } as CSSProperties}>
                        <i />
                        {value > 0 && <strong>{value}</strong>}
                      </span>
                      <small>{year === 1997 || year % 5 === 0 || year === 2026 ? year : ""}</small>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="scouting-viz-annotations">
                <p><strong>58 首</strong><span>发行于 2010 年及以前</span></p>
                <p><strong>10 首</strong><span>发行于 2026 年（截至快照日）</span></p>
              </div>
              <p className="scouting-viz-footnote">横轴是作品发行年份，不是榜单历史走势；空年份按 0 首显示。</p>
            </figure>
          </div>
          <p className="scouting-chart__note">
            周杰伦 30 首、林俊杰 11 首、孙燕姿与陈奕迅各 6 首；2010 年及以前作品占 58 首。
            这只能说明当日榜单结构，不能据此声称经典作品正在增长或“回流”。
          </p>
        </section>

        <section className="scouting-chart scouting-chart--netease" aria-labelledby="scouting-netease-title">
          <header className="scouting-chart__header">
            <div>
              <p>NETEASE CLOUD MUSIC / REPRODUCIBLE SNAPSHOT</p>
              <h4 id="scouting-netease-title">279 首去重作品中，41 首（14.7%）命中两榜；无三榜复现。</h4>
            </div>
            <span>同批采集 · 各榜更新时间与更新频率不同</span>
          </header>
          <div className="scouting-viz-stack">
            <figure className="scouting-viz scouting-viz--coverage">
              <figcaption>
                <strong>本次公开响应覆盖</strong>
                <span>分子＝实际返回条目；分母＝官方榜单目录标示的曲目数。不是热度、播放量或得分。</span>
              </figcaption>
              <div className="scouting-viz-axis scouting-viz-axis--coverage" aria-hidden="true">
                <span>0</span><span>50</span><span>100</span><span>150</span><span>200 条</span>
              </div>
              <ol className="scouting-viz-coverage" aria-label="网易云音乐五张榜单公开响应覆盖情况">
                {neteaseChartSnapshot.map((item) => (
                  <li key={item.chart} className={`is-${item.tone}`}>
                    <div className="scouting-viz-coverage__meta">
                      <strong>{item.chart}</strong>
                      <span>{item.cadence}更新 · 榜单日期 {item.updated}</span>
                    </div>
                    <span className="scouting-viz-track" aria-hidden="true">
                      <i style={{ "--viz-value": `${(item.returned / 200) * 100}%` } as CSSProperties} />
                      <b style={{ "--viz-reference": `${(item.reference / 200) * 100}%` } as CSSProperties} />
                    </span>
                    <strong>{item.returned}/{item.reference}</strong>
                  </li>
                ))}
              </ol>
              <p className="scouting-viz-footnote">官方榜单目录标示潜力爆款榜 200 首、实时分享榜 100 首；本次公开响应均仅取得前 10 条。缺失记录不能解释为未上榜。</p>
            </figure>
            <div className="scouting-viz-grid">
              <figure className="scouting-viz scouting-viz--composition">
                <figcaption>
                  <strong>去重作品按命中榜单数分布</strong>
                  <span>基数：279 首去重作品</span>
                </figcaption>
                <div className="scouting-viz-composition" role="img" aria-label="238 首只命中一个榜单，占 85.3%；41 首命中两个榜单，占 14.7%">
                  {neteaseOverlapSnapshot.map((item) => (
                    <span key={item.label} className={item.value === 41 ? "is-highlight" : undefined} style={{ "--viz-value": `${item.share}%` } as CSSProperties}>
                      <i />
                    </span>
                  ))}
                </div>
                <dl className="scouting-viz-legend">
                  {neteaseOverlapSnapshot.map((item) => (
                    <div key={item.label}>
                      <dt>{item.label}</dt>
                      <dd><strong>{item.value}</strong> 首 · {item.share}%</dd>
                    </div>
                  ))}
                </dl>
                <p className="scouting-viz-footnote">没有作品在本批数据中命中三张或更多榜单。</p>
              </figure>
              <figure className="scouting-viz scouting-viz--upset">
                <figcaption>
                  <strong>两榜交集排名</strong>
                  <span>单位：重合作品数（首）</span>
                </figcaption>
                <ol aria-label="网易云音乐两榜交集作品数排名">
                  {neteaseIntersectionSnapshot.map((item, index) => (
                    <li key={item.label}>
                      <span className="scouting-viz-rank">{String(index + 1).padStart(2, "0")}</span>
                      <span className="scouting-viz-label">{item.label}</span>
                      <span className="scouting-viz-track" aria-hidden="true"><i style={{ "--viz-value": `${(item.value / 22) * 100}%` } as CSSProperties} /></span>
                      <strong>{item.value}</strong>
                      <span className="scouting-viz-upset-dots" aria-hidden="true">
                        {["rising", "new", "original", "realtime"].map((chart) => <i key={chart} className={item.charts.includes(chart) ? "is-active" : undefined} />)}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className="scouting-viz-footnote">点阵从左至右：飙升、新歌、原创、实时分享。潜力爆款榜本批未与其他榜单复现。</p>
              </figure>
            </div>
          </div>
          <p className="scouting-chart__note">
            同平台各榜不是独立样本，跨榜复现仅用于安排“继续人工听审”的优先级，不等于播放规模、增长趋势或商业价值。
          </p>
        </section>

        <section className="scouting-evidence" aria-labelledby="scouting-evidence-title">
          <header className="scouting-evidence__header">
            <p>EVIDENCE / 官方页面证据</p>
            <h4 id="scouting-evidence-title">让榜单结论回到可查看的公开页面。</h4>
            <span>截图用于记录当时页面状态；可复算数据仍以下载区的 CSV / JSON 为准。</span>
          </header>
          <div className="scouting-evidence__grid">
            {scoutingEvidence.map((item) => (
              <figure className="scouting-evidence__card" key={item.src}>
                <a href={item.href} target="_blank" rel="noreferrer">
                  <Image src={item.src} alt={item.alt} width={1200} height={750} sizes="(max-width: 760px) 100vw, 33vw" />
                </a>
                <figcaption>
                  <p>{item.source}</p>
                  <strong>{item.chart}</strong>
                  <span>{item.captured}</span>
                  <a href={item.href} target="_blank" rel="noreferrer">查看公开来源 ↗</a>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="scouting-cross__signals scouting-signal-map" aria-labelledby="scouting-signal-roles-title">
          <div className="scouting-cross__signals-heading">
            <p>SIGNAL ROLES / 信号分工</p>
            <h4 id="scouting-signal-roles-title">先让每类数据回答自己的问题，再做交叉验证。</h4>
          </div>
          <div className="scouting-cross__signal-grid">
            {scoutingSignalRoles.map((item, index) => (
              <article key={item.signal}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h5>{item.signal}</h5>
                <p>{item.sources}</p>
                <strong>{item.decision}</strong>
              </article>
            ))}
          </div>
          <aside className="scouting-cross__boundary scouting-method-note" aria-label="跨平台比较边界">
            <strong>COMPARISON BOUNDARY</strong>
            <p>
              原始榜位、播放量和使用量不跨平台直接相加。后续取得同日数据后，先转换为榜内排名百分位，
              再记录跨平台命中与持续性；Spotify 与抖音在权限开放前不填充估算值。“热门原声 / 音效”仅为人工公开样本观察，非抖音官方音效榜。
            </p>
          </aside>
        </section>
      </section>

      <section className="scouting-wave" aria-labelledby="scouting-wave-title">
        <div className="scouting-wave__statement">
          <p>05 / QUALITY ≠ POPULARITY</p>
          <h3 id="scouting-wave-title"><strong>4 / 20</strong>专业评价与后续大众榜单曝光，并不重合。</h3>
          <p>
            2026 年 6 月腾讯音乐浪潮榜 TOP20 中，只有 4 首出现在随后四期由你榜 TOP200。
            因此“质量池”和“热度池”需要并行侦察，不能用单一榜单互相替代。
          </p>
        </div>
        <div className="scouting-wave__list">
          <div className="scouting-wave__legend">
            <span>专业榜优质样本</span><span>浪潮榜位</span><span>专业得分</span>
          </div>
          {hiddenQualitySongs.map(([song, artist, rank, score]) => (
            <div key={song}>
              <span><b>{song}</b><small>{artist}</small></span>
              <strong>{rank}</strong>
              <strong>{score}</strong>
            </div>
          ))}
          <p>以上 3 首均未进入随后四期由你榜 TOP200；它们是“继续做内容场景验证”的质量池样本，而非失败样本。</p>
        </div>
      </section>

      <section className="scouting-next-data" aria-labelledby="scouting-next-title">
        <p>06 / NEXT DATA REQUEST</p>
        <div>
          <h3 id="scouting-next-title">公开榜单完成初筛，后台数据决定下一步。</h3>
          <ol>
            <li><span>PLATFORM</span><p>播放增速、完播、收藏、分享、搜索来源与受众画像</p></li>
            <li><span>SHORT VIDEO</span><p>BGM 使用量、投稿增速、完播率、衍生话题与代表内容</p></li>
            <li><span>RIGHTS</span><p>词曲、录音制品、表演者、期限、地区、平台与转授权范围</p></li>
          </ol>
        </div>
      </section>

      <footer className="scouting-sources">
        <div>
          <p>SOURCES / 公开来源</p>
          <a href="https://chart.tencentmusic.com/" target="_blank" rel="noreferrer">腾讯音乐榜 ↗</a>
          <a href="https://www.tencentmusic.com/zh-cn/wave-chart.html" target="_blank" rel="noreferrer">腾讯音乐浪潮榜评选细则 ↗</a>
          <a href="https://music.apple.com/cn/new/top-charts" target="_blank" rel="noreferrer">Apple Music 中国排行榜 ↗</a>
          <a href="https://charts.spotify.com/home" target="_blank" rel="noreferrer">Spotify Charts（登录受限）↗</a>
          <a href="https://music.163.com/discover/toplist" target="_blank" rel="noreferrer">网易云音乐榜单 ↗</a>
          <a href="https://developer.open-douyin.com/capacity-center-page/capacity-detail/7180545630253629498" target="_blank" rel="noreferrer">抖音音乐榜单能力说明 ↗</a>
        </div>
        <div>
          <p>DOWNLOAD / 可复核数据</p>
          <a className="scouting-workbook-download" href="/docs/查文鑫_中文新歌与潜力音乐人数据侦察.xlsx" download>音乐数据侦察分析工作簿 XLSX ↓</a>
          <div className="scouting-workbook-proof" aria-label="Excel 可复核分析能力">
            <p>EXCEL WORKFLOW / 可复核分析能力</p>
            <span><b>数据透视表</b><small>按平台、榜单、艺人及期数聚合</small></span>
            <span><b>VLOOKUP</b><small>回填榜单口径与候选综合分</small></span>
            <span><b>条件格式</b><small>突出 Top10、涨跌、风险与缺失</small></span>
            <span><b>数据校验</b><small>规范状态、场景、版权与人工评分</small></span>
          </div>
          <a href="/data/scouting/scouting-watchlist.csv" download>5 首候选清单 CSV ↓</a>
          <a href="/data/scouting/tme-yobang-w28-w31.csv" download>四期周榜快照 CSV ↓</a>
          <a href="/data/scouting/scouting-summary.json" download>方法与结果 JSON ↓</a>
          <a href="/data/scouting/cross-platform/current-charts.csv" download>Apple / 网易云当日榜单 CSV ↓</a>
          <a href="/data/scouting/cross-platform/current-charts.json" download>跨平台标准化快照 JSON ↓</a>
          <a href="/data/scouting/cross-platform/current-availability.json" download>平台权限与可用性 JSON ↓</a>
          <a href="/data/scouting/cross-platform/current-quality.json" download>数据质量检查 JSON ↓</a>
        </div>
        <small>公开事实与个人分析假设分开标注 · 工作簿含原始数据、字段字典、VLOOKUP、数据透视公式、条件格式与数据校验；可直接检查公式和下拉规则 · 腾讯音乐数据快照 2026.08.11 · Apple Music 单日快照 2026.08.12 · 本研究不构成商业、版权或签约建议</small>
      </footer>
    </section>
  );
}

function ProjectDetail({
  project,
  onBack,
  openProject,
  playTrack,
  warmTrack,
  pauseAudio,
}: {
  project: Project;
  onBack: () => void;
  openProject: (key: ProjectKey) => void;
  playTrack: (index: number) => void;
  warmTrack: (index: number) => void;
  pauseAudio: () => void;
}) {
  const index = projects.findIndex((item) => item.key === project.key);
  const next = projects[(index + 1) % projects.length];
  return (
    <main className={`project-detail detail-${project.key}`} id="main-content">
      <button className="space-back detail-back" onClick={onBack}>← BACK TO ALL PROJECTS</button>
      <header className="detail-title">
        <p>{project.no} / {project.field}</p>
        <h1>{project.title}</h1>
        <h2>{project.english}</h2>
        <span>{project.intro}</span>
      </header>

      <section className="project-poster" aria-label={project.english}>
        {project.key === "winter-embers" ? (
          <Image unoptimized src="/images/projects/winter-embers-poster-v2.jpg" alt="冰原巨构与中央余烬光源的《冬烬之地》项目视觉" fill sizes="100vw" priority />
        ) : project.key === "scouting" ? (
          <Image unoptimized src="/images/scouting/guohai.jpg" alt="中文新歌数据侦察候选歌曲《过海》专辑封面" fill sizes="100vw" priority />
        ) : project.key === "event" || project.key === "review" ? (
          <Image unoptimized src="/images/cassie-editorial.jpg" alt="查文鑫个人项目视觉" fill sizes="100vw" />
        ) : project.key === "editorial" ? (
          <Image unoptimized src="/images/editorial/catalog-operations-article.jpg" alt="《从16首AI歌曲到可运营曲库》文章首页" fill sizes="100vw" />
        ) : (
          <Image unoptimized src="/images/og-cassie-music.jpg" alt="音乐内容作品集视觉" fill sizes="100vw" />
        )}
        {project.key !== "winter-embers" && (
          <div>
            <small>A CASE BY CASSIE ZHA</small>
            <strong>{project.english}</strong>
          </div>
        )}
      </section>

      <section className="metric-band">
        {project.metrics.map(([value, label]) => (
          <div key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      {project.key === "winter-embers" && (
        <section className="film-preview" aria-labelledby="winter-preview-title">
          <div className="film-preview__heading">
            <div>
              <p>FILM / 完整视听版本</p>
              <h2 id="winter-preview-title">A DOOR BENEATH THE ICE</h2>
            </div>
            <p>影片 01:59 · 原创配乐 03:00<br />原创科幻概念创作</p>
          </div>
          <div className="film-preview__frame">
            <video
              controls
              playsInline
              preload="metadata"
              poster="/images/projects/winter-embers-poster-v2.jpg"
              aria-label="《冬烬之地》完整科幻概念影片"
              onPlay={pauseAudio}
            >
              <source src="/video/winter-embers-film-v2.mp4" type="video/mp4" />
              你的浏览器暂不支持视频播放。
            </video>
            <span>THE LAND OF WINTER EMBERS / 2026</span>
          </div>
          <div className="film-preview__footer">
            <p>原创科幻概念影片 · 以同名配乐驱动视听叙事</p>
            <button
              onPointerEnter={() => warmTrack(17)}
              onFocus={() => warmTrack(17)}
              onClick={() => playTrack(17)}
            >
              PLAY FULL ORIGINAL SCORE / 播放完整配乐 ↗
            </button>
          </div>
        </section>
      )}

      {project.key === "catalog" && (
        <section className="listening-section">
          <p>SELECTED AUDIO / 点击进入全屏播放器</p>
          <h2>LISTEN TO THE CATALOG</h2>
          <TrackList playTrack={playTrack} warmTrack={warmTrack} />
        </section>
      )}

      {project.key === "scouting" && <ScoutingCase />}

      {project.key === "editorial" && (
        <section className="article-library" aria-labelledby="article-library-title">
          <header className="article-library__header">
            <div>
              <p>SELECTED WRITING / 完整文章</p>
              <h2 id="article-library-title">READ THE WORK, NOT JUST THE CLAIM.</h2>
            </div>
            <p>网页先呈现方法与结论；DOCX 保留原始排版，PDF 为跨设备阅读版。</p>
          </header>
          <div className="article-library__grid">
            <article className="article-card">
              <div className="article-card__preview">
                <Image unoptimized src="/images/editorial/catalog-operations-article.jpg" alt="《从16首AI歌曲到可运营曲库》文章首页预览" fill sizes="(max-width: 760px) 88vw, 36vw" />
                <span>ARTICLE 01 / 13 PAGES</span>
              </div>
              <div className="article-card__body">
                <p>MUSIC CATALOG OPERATIONS · 2026.07.26</p>
                <h3>从16首AI歌曲到可运营曲库</h3>
                <h4>标签、筛选与分发方法</h4>
                <p>用曲库主数据、16维评测与版本证据，建立可查找、可判断、可分发、可复盘的音乐资产工作流。</p>
                <ul>
                  <li>四层数据模型与统一资产 ID</li>
                  <li>标签、16 维听审与 A/B 版本证据</li>
                  <li>从生成到分发反馈的七步闭环</li>
                </ul>
                <div className="article-card__actions">
                  <a href="/docs/从16首AI歌曲到可运营曲库_查文鑫.pdf" target="_blank" rel="noreferrer">PDF 阅读版 ↗</a>
                  <a href="/docs/从16首AI歌曲到可运营曲库_查文鑫.docx" download>DOCX 原稿 ↓</a>
                </div>
              </div>
            </article>
            <article className="article-card">
              <div className="article-card__preview">
                <Image unoptimized src="/images/editorial/ai-tools-article.jpg" alt="《六款AI音乐工具实测》文章首页预览" fill sizes="(max-width: 760px) 88vw, 36vw" />
                <span>ARTICLE 02 / 12 PAGES</span>
              </div>
              <div className="article-card__body">
                <p>TOOL BENCHMARK · 2026.07.23</p>
                <h3>六款AI音乐工具实测</h3>
                <h4>中英文歌词、器乐生成与导出能力</h4>
                <p>从中文歌曲、英文同输入对照与 Jazz 案例出发，评估“能生成”之外的真实运营价值。</p>
                <ul>
                  <li>六平台任务边界与证据范围</li>
                  <li>人声、编曲、可控性与导出比较</li>
                  <li>按任务定位工具，不做绝对能力排名</li>
                </ul>
                <div className="article-card__actions">
                  <a href="/docs/六款AI音乐工具实测_查文鑫.pdf" target="_blank" rel="noreferrer">PDF 阅读版 ↗</a>
                  <a href="/docs/六款AI音乐工具实测_查文鑫.docx" download>DOCX 原稿 ↓</a>
                </div>
              </div>
            </article>
          </div>
          <p className="article-library__note">PDF 阅读版由系统兼容排版生成，内容与原稿一致；完整原始版式请下载 DOCX。</p>
        </section>
      )}

      {project.sections.map((section) => (
        <section className="story-section" key={section.label}>
          <p>{section.label}</p>
          <div>
            <h2>{section.title}</h2>
            {section.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            {section.items && (
              <ul>
                {section.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        </section>
      ))}

      {project.key === "event" && (
        <aside className="evidence-space">
          <span>EVIDENCE SLOT / 待补证据</span>
          <p>这里保留公开材料、后台截图或发布链接的位置，后续以可核验内容替换。</p>
        </aside>
      )}

      <button className="next-case" onClick={() => openProject(next.key)}>
        <span>NEXT PROJECT / {next.no}</span>
        <strong>{next.title}</strong>
        <em>{next.english} →</em>
      </button>
    </main>
  );
}

function About({ chooseView }: { chooseView: (view: View) => void }) {
  return (
    <main className="about-story" id="main-content">
      <aside className="story-progress" aria-hidden="true"><span>01</span><i /><i /><i /><i /><span>05</span></aside>

      <section className="about-scene about-opening">
        <Image unoptimized src="/images/cassie-editorial.jpg" alt="查文鑫在北京天坛" fill sizes="100vw" priority />
        <div className="scene-shade" />
        <p>COMPOSER → RESEARCHER → OPERATOR</p>
        <h1>CASSIE IS A<br />MUSIC CONTENT<br />OPERATOR</h1>
        <small>先理解音乐，再组织内容。</small>
      </section>

      <section className="about-scene education-scene">
        <div className="giant-type">
          <span>COMPOSITION</span>
          <i>+</i>
          <span>POP MUSIC</span>
          <span>RESEARCH</span>
        </div>
        <div className="scene-copy">
          <p>2016 - 2020 · 南京艺术学院</p>
          <strong>作曲与作曲技术理论 · 本科</strong>
          <p>2023 - 2026 · 南京艺术学院</p>
          <strong>音乐与舞蹈学（流行音乐研究）· 硕士应届生</strong>
        </div>
      </section>

      <section className="about-scene experience-scene">
        <div className="vertical-places" aria-hidden="true">
          CONTENT<br />RIGHTS<br />ARTIST<br />RESEARCH<br />LIVE<br />AI MUSIC
        </div>
        <div className="experience-portrait">
          <div className="experience-portrait__image">
            <Image
              unoptimized
              src="/images/cassie-temple-portrait-v2.jpg"
              alt="查文鑫在北京天坛的全身彩色照片"
              fill
              sizes="(max-width: 760px) 58vw, 30vw"
            />
          </div>
          <div className="portrait-catalog" aria-hidden="true">
            <span>CATALOG / 18 TRACKS</span>
            <div>
              {universePlanes.slice(0, 4).map((plane) => (
                <Image
                  key={plane.id}
                  unoptimized
                  src={plane.src!}
                  alt=""
                  width={54}
                  height={54}
                />
              ))}
            </div>
          </div>
          <div className="portrait-signal" aria-hidden="true">
            <i />
            <span>CONTENT × RIGHTS × DATA</span>
          </div>
        </div>
        <div className="experience-copy">
          <article><span>2023.12 - 2024.03</span><h2>江苏省委组织部</h2><p>独立审核上千份材料，参与新媒体文案、脚本与短视频运营。</p></article>
          <article><span>2023.07 - 2024.03</span><h2>欧拉艺术空间</h2><p>创作者沟通、歌词交易协助与版权风险材料整理。</p></article>
          <article><span>1 YEAR</span><h2>研究生会学术部部长</h2><p>活动策划、跨团队协同与现场落地。</p></article>
        </div>
      </section>

      <section className="about-scene numbers-scene">
        <p>THE WORK SO FAR</p>
        <h2><span>18</span> TRACKS</h2>
        <h2><span>1000+</span> REVIEWS</h2>
        <h2><span>20+</span> MEDIA</h2>
        <small>音乐创作 × 内容审核 × 项目统筹</small>
      </section>

      <section className="about-scene research-scene">
        <p>RESEARCH / AWARDS / READINESS</p>
        <h2>专业研究，<br />必须能回到内容现场。</h2>
        <div className="research-columns">
          <div>
            <span>SELECTED RESEARCH</span>
            <p>《“梗”文化对当代流行音乐形式与内容的塑造研究》</p>
            <p>《黑神话：悟空》游戏音乐中的跨媒介叙事与文化认同研究</p>
            <p>《流行歌曲创作中“人声器乐化”现象初探》</p>
            <p>《人工智能对音乐的影响》</p>
          </div>
          <div>
            <span>SELECTED RECOGNITION</span>
            <p>研究生学业奖学金一等奖（Top 5%）</p>
            <p>南京艺术学院优秀研究生</p>
            <p>江苏省委组织部“优秀实习生”</p>
            <p>CET-6 · 普通话二甲 · 高中音乐教师资格证</p>
          </div>
        </div>
        <a href="/docs/Cassie_Zha_Wenxin_Resume_CN.pdf" download>DOWNLOAD FULL BIO / 中文简历 ↓</a>
      </section>

      <WordNavigation view="about" chooseView={chooseView} />
    </main>
  );
}

function Contact({ chooseView }: { chooseView: (view: View) => void }) {
  return (
    <main className="contact-page" id="main-content">
      <p>CONTACT / AVAILABILITY</p>
      <h1>LET&apos;S MAKE<br />MUSIC <em>MOVE.</em></h1>
      <div className="contact-copy">
        <p>音乐内容运营 · 版权与创作者合作 · AI 音乐实践</p>
        <p>北京 / 上海 / 深圳 / 杭州 · 一周内到岗<br />接受线下实习与全职机会</p>
      </div>
      <a className="contact-email" href="mailto:1376856506@qq.com">1376856506@qq.com ↗</a>
      <div className="contact-downloads">
        <a href="/docs/Cassie_Zha_Wenxin_Resume_CN.pdf" download>中文简历 / PDF ↓</a>
        <a href="/docs/Cassie_2-Day_Music_Ops_Cram_Plan.pdf" download>两天突击清单 / PDF ↓</a>
      </div>
      <small>电话号码仅放在下载简历中，减少公开页面骚扰。</small>
      <WordNavigation view="contact" chooseView={chooseView} />
    </main>
  );
}

function PlayerOverlay({
  trackIndex,
  playing,
  loading,
  current,
  duration,
  close,
  toggle,
  seek,
  error,
  retry,
}: {
  trackIndex: number;
  playing: boolean;
  loading: boolean;
  current: number;
  duration: number;
  close: () => void;
  toggle: () => void;
  seek: (value: number) => void;
  error: string | null;
  retry: () => void;
}) {
  const track = tracks[trackIndex];
  const plane = universePlanes.find((item) => item.trackIndex === trackIndex) ?? universePlanes[trackIndex];
  const lyricViewportRef = useRef<HTMLOListElement>(null);
  const lyricLineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lyricCues = useMemo(
    () => buildLyricCues(getTrackLyrics(track.src), duration, track.title),
    [duration, track.src, track.title],
  );
  const activeLyricIndex = useMemo(
    () => findActiveLyric(lyricCues, current),
    [current, lyricCues],
  );
  const songProgress = duration > 0
    ? Math.max(0, Math.min(1, current / duration))
    : 0;

  useEffect(() => {
    const viewport = lyricViewportRef.current;
    const targetIndex = Math.max(0, activeLyricIndex);
    const line = lyricLineRefs.current[targetIndex];
    if (!viewport || !line) return;

    const top = line.offsetTop - (viewport.clientHeight - line.offsetHeight) / 2;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    viewport.scrollTo({
      top: Math.max(0, top),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  }, [activeLyricIndex, track.src]);

  return (
    <div
      className="player-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
          return;
        }
        trapDialogFocus(event);
      }}
    >
      {plane.src && (
        <div className="player-overlay__backdrop" aria-hidden="true">
          <Image unoptimized src={plane.src} alt="" fill sizes="100vw" />
        </div>
      )}
      <button className="player-close" onClick={close} aria-label="关闭播放器" autoFocus>CLOSE ×</button>
      <div className="player-stage">
        <section className="player-main" aria-label="当前播放歌曲">
          <p className="playing-label">PLAYING NOW</p>
          <div className="player-cover">
            {plane.src ? (
              <Image
                unoptimized
                src={plane.src}
                alt={`${track.title}专辑封面`}
                fill
                sizes="(max-width: 760px) 28vw, 34vw"
                priority
              />
            ) : (
              <span className={`generated-cover art-${plane.art}`} aria-hidden="true"><i /><b>{String(trackIndex + 1).padStart(2, "0")}</b></span>
            )}
            <button
              className={`player-cover__toggle ${playing ? "is-playing" : ""} ${loading ? "is-loading" : ""}`}
              onClick={toggle}
              aria-label={loading ? "正在缓冲，点击暂停" : playing ? "暂停" : "播放"}
            >
              <span>{loading ? "•••" : playing ? "Ⅱ" : "▶"}</span>
            </button>
          </div>
          <div className="player-copy">
            <h2 id="player-title">{track.title}</h2>
            <span>FROM {track.scene}</span>
          </div>
          <div className="player-progress">
            <input
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={Math.min(current, duration || 0)}
              onChange={(event) => seek(Number(event.target.value))}
              aria-label="播放进度"
              aria-valuetext={`${formatTime(current)} / ${formatTime(duration)}`}
              disabled={!duration}
            />
            <small>{loading ? "LOADING · 正在缓冲" : `${formatTime(current)} / ${formatTime(duration)}`}</small>
            {error && (
              <div className="player-error" role="alert">
                <span>{error}</span>
                <button onClick={retry}>重新加载</button>
              </div>
            )}
          </div>
        </section>

        <section className="lyrics-panel" aria-labelledby="lyrics-title">
          <p className="lyrics-panel__label" id="lyrics-title">LYRICS / 歌词</p>
          {lyricCues.length ? (
            <>
              <span className="lyrics-rail" aria-hidden="true">
                <i style={{ top: `${(songProgress * 100).toFixed(2)}%` }} />
              </span>
              <ol className="lyrics-viewport" ref={lyricViewportRef}>
                {lyricCues.map((cue, index) => {
                  const distance = activeLyricIndex < 0
                    ? Math.min(3, index + 1)
                    : Math.min(3, Math.abs(index - activeLyricIndex));
                  return (
                    <li
                      key={`${cue.at.toFixed(3)}-${cue.text}`}
                      ref={(element) => { lyricLineRefs.current[index] = element; }}
                      data-distance={distance}
                      aria-current={index === activeLyricIndex ? "true" : undefined}
                    >
                      {cue.text}
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <div className="lyrics-empty">
              <strong>INSTRUMENTAL</strong>
              <span>纯音乐</span>
              <p>本曲无人声歌词，请直接聆听完整音乐。</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function FilmOverlay({
  close,
  pauseAudio,
  openCase,
}: {
  close: () => void;
  pauseAudio: () => void;
  openCase: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoState, setVideoState] = useState<"loading" | "ready" | "error">("loading");
  const retryVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    setVideoState("loading");
    video.load();
    video.play().catch(() => undefined);
  };
  return (
    <div
      className="film-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="film-overlay-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          close();
          return;
        }
        trapDialogFocus(event);
      }}
    >
      <button className="film-overlay__close" onClick={close} autoFocus>关闭 ×</button>
      <header className="film-overlay__header">
        <span>FEATURED FILM / 首推影片</span>
        <h2 id="film-overlay-title">冬烬之地</h2>
        <p>THE LAND OF WINTER EMBERS · 01:59</p>
      </header>
      <div className="film-overlay__frame">
        <video
          ref={videoRef}
          controls
          autoPlay
          playsInline
          preload="auto"
          poster="/images/projects/winter-embers-poster-v2.jpg"
          onPlay={pauseAudio}
          onCanPlay={() => setVideoState("ready")}
          onWaiting={() => setVideoState("loading")}
          onError={() => setVideoState("error")}
          aria-label="《冬烬之地》完整科幻概念影片"
        >
          <source src="/video/winter-embers-film-v2.mp4" type="video/mp4" />
          你的浏览器暂不支持视频播放。
        </video>
        {videoState !== "ready" && (
          <div className={`film-overlay__status is-${videoState}`} role={videoState === "error" ? "alert" : "status"}>
            {videoState === "error" ? (
              <><span>影片暂时无法载入</span><button onClick={retryVideo}>重新加载</button></>
            ) : (
              <span>影片载入中</span>
            )}
          </div>
        )}
      </div>
      <footer className="film-overlay__footer">
        <p>原创科幻概念影片与同名原创配乐</p>
        <button onClick={openCase}>查看创作案例</button>
      </footer>
    </div>
  );
}

export default function PortfolioExperience() {
  const [entryPhase, setEntryPhase] = useState<EntryPhase>("gate");
  const [view, setView] = useState<View>("universe");
  const [activeProject, setActiveProject] = useState<ProjectKey | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loadingTrack, setLoadingTrack] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [filmOpen, setFilmOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const entryTimerRef = useRef<number | null>(null);
  const entryStartedRef = useRef(false);
  const trackIndexRef = useRef(0);
  const playerOpenerRef = useRef<HTMLElement | null>(null);
  const filmOpenerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const warmTimerRef = useRef<number | null>(null);
  const warmedTracksRef = useRef(new Set<number>());

  useEffect(() => {
    document.body.style.overflow = playerOpen || filmOpen || mobileMenu || entryPhase !== "ready" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [playerOpen, filmOpen, mobileMenu, entryPhase]);

  useEffect(() => {
    return () => {
      if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current);
      if (warmTimerRef.current !== null) window.clearTimeout(warmTimerRef.current);
    };
  }, []);

  const scrollToPageStart = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    window.requestAnimationFrame(() => document.getElementById("main-content")?.focus());
  };

  const chooseView = (next: View) => {
    setView(next);
    setActiveProject(null);
    setMobileMenu(false);
    scrollToPageStart();
  };

  const openProject = (key: ProjectKey) => {
    setView("projects");
    setActiveProject(key);
    scrollToPageStart();
  };

  const openPlayer = () => {
    playerOpenerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setPlayerOpen(true);
  };

  const closePlayer = () => {
    setPlayerOpen(false);
    window.requestAnimationFrame(() => playerOpenerRef.current?.focus());
  };

  const openFilm = () => {
    filmOpenerRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    audioRef.current?.pause();
    setFilmOpen(true);
  };

  const closeFilm = () => {
    setFilmOpen(false);
    window.requestAnimationFrame(() => filmOpenerRef.current?.focus());
  };

  const closeMobileMenu = () => {
    setMobileMenu(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const warmTrack = (index: number) => {
    if (warmedTracksRef.current.has(index) || trackIndexRef.current === index) return;
    if (warmTimerRef.current !== null) window.clearTimeout(warmTimerRef.current);
    warmTimerRef.current = window.setTimeout(() => {
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
      if (!connection?.saveData) {
        const audio = new Audio();
        audio.preload = "metadata";
        audio.src = tracks[index].src;
        warmedTracksRef.current.add(index);
      }
      warmTimerRef.current = null;
    }, 220);
  };

  const startAudio = async (index: number, open = true) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (warmTimerRef.current !== null) {
      window.clearTimeout(warmTimerRef.current);
      warmTimerRef.current = null;
    }
    setMediaError(null);
    if (trackIndexRef.current !== index) {
      setLoadingTrack(true);
      audio.pause();
      audio.src = tracks[index].src;
      audio.load();
      trackIndexRef.current = index;
      setTrackIndex(index);
      setCurrent(0);
      setDuration(0);
    } else if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) {
      setLoadingTrack(true);
    }
    if (open) openPlayer();
    try {
      await audio.play();
      setLoadingTrack(false);
    } catch {
      setPlaying(false);
      setLoadingTrack(false);
    }
  };

  const retryAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    setMediaError(null);
    setLoadingTrack(true);
    audio.src = tracks[trackIndexRef.current].src;
    audio.load();
    void audio.play().catch(() => {
      setLoadingTrack(false);
      setMediaError("音频暂时无法载入，请稍后重试。");
    });
  };

  const finishEntry = () => {
    if (entryTimerRef.current !== null) {
      window.clearTimeout(entryTimerRef.current);
      entryTimerRef.current = null;
    }
    setEntryPhase("ready");
    window.requestAnimationFrame(() => document.getElementById("main-content")?.focus());
  };

  const enter = (withSound: boolean) => {
    if (entryStartedRef.current || entryPhase !== "gate") return;
    entryStartedRef.current = true;
    if (withSound) void startAudio(0, false);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      finishEntry();
      return;
    }
    setEntryPhase("zooming");
    entryTimerRef.current = window.setTimeout(finishEntry, 3000);
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      if (audio.readyState < HTMLMediaElement.HAVE_FUTURE_DATA) setLoadingTrack(true);
      try {
        await audio.play();
        setLoadingTrack(false);
      } catch {
        setPlaying(false);
        setLoadingTrack(false);
      }
    } else {
      audio.pause();
    }
  };

  const active = projects.find((project) => project.key === activeProject);

  return (
    <>
      {entryPhase === "ready" && !playerOpen && !filmOpen && !mobileMenu && (
        <a className="skip-link" href="#main-content">跳到主要内容</a>
      )}
      <audio
        ref={audioRef}
        src={tracks[0].src}
        preload="metadata"
        playsInline
        onLoadStart={() => setLoadingTrack(true)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onCanPlay={(event) => {
          setDuration(event.currentTarget.duration);
          if (event.currentTarget.paused) setLoadingTrack(false);
        }}
        onWaiting={() => setLoadingTrack(true)}
        onStalled={() => setLoadingTrack(true)}
        onTimeUpdate={(event) => {
          setCurrent(event.currentTarget.currentTime);
          if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
        }}
        onPlay={() => setPlaying(true)}
        onPlaying={() => { setPlaying(true); setLoadingTrack(false); }}
        onPause={() => { setPlaying(false); setLoadingTrack(false); }}
        onError={() => {
          setPlaying(false);
          setLoadingTrack(false);
          setMediaError("音频暂时无法载入，请稍后重试。");
        }}
        onEnded={() => { setPlaying(false); setLoadingTrack(false); setCurrent(0); }}
      />

      {entryPhase !== "ready" && <SoundGate phase={entryPhase} enter={enter} />}

      <div
        className={`site-shell ${entryPhase !== "gate" ? "is-visible" : ""} ${entryPhase === "zooming" ? "is-arriving" : ""}`}
        aria-hidden={entryPhase !== "ready" || playerOpen || filmOpen || mobileMenu}
        inert={entryPhase !== "ready" || playerOpen || filmOpen || mobileMenu ? true : undefined}
      >
        <header className="site-header">
          <Brand onHome={() => chooseView("universe")} />
          <button
            className="now-playing"
            onClick={openPlayer}
            aria-label={`${playing ? "正在播放" : "打开播放器"}：${tracks[trackIndex].title}`}
          >
            <i className={playing ? "is-playing" : ""} />
            <span>{playing ? `PLAYING · ${tracks[trackIndex].title}` : "LISTEN / 播放器"}</span>
          </button>
          <button
            ref={menuButtonRef}
            className={`menu-button ${mobileMenu ? "is-open" : ""}`}
            onClick={() => setMobileMenu(true)}
            aria-label="打开导航"
            aria-expanded={mobileMenu}
            aria-controls="mobile-navigation"
          >
            <i /><i />
          </button>
        </header>

        {active ? (
          <ProjectDetail
            project={active}
            onBack={() => { setActiveProject(null); scrollToPageStart(); }}
            openProject={openProject}
            playTrack={(index) => startAudio(index)}
            warmTrack={warmTrack}
            pauseAudio={() => audioRef.current?.pause()}
          />
        ) : view === "universe" ? (
          <MusicUniverse
            openProject={openProject}
            openFilm={openFilm}
            chooseView={chooseView}
            playTrack={(index) => startAudio(index)}
            warmTrack={warmTrack}
            activeTrack={trackIndex}
            playing={playing}
            interactive={entryPhase === "ready"}
          />
        ) : view === "songs" ? (
          <SongIndex
            playTrack={(index) => startAudio(index)}
            warmTrack={warmTrack}
            chooseView={chooseView}
          />
        ) : view === "projects" ? (
          <ProjectsIndex openProject={openProject} chooseView={chooseView} />
        ) : view === "about" ? (
          <About chooseView={chooseView} />
        ) : (
          <Contact chooseView={chooseView} />
        )}
      </div>

      {mobileMenu && (
        <nav
          id="mobile-navigation"
          className="mobile-menu"
          aria-label="移动端导航"
          role="dialog"
          aria-modal="true"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.preventDefault();
              closeMobileMenu();
              return;
            }
            trapDialogFocus(event);
          }}
        >
          <button className="mobile-menu__close" onClick={closeMobileMenu} autoFocus>CLOSE ×</button>
          <button onClick={() => chooseView("songs")}><span>01</span>MUSIC INDEX</button>
          <button onClick={() => chooseView("projects")}><span>02</span>THE WORK</button>
          <button onClick={() => chooseView("about")}><span>03</span>ABOUT ME</button>
          <button onClick={() => chooseView("contact")}><span>04</span>CONTACT</button>
        </nav>
      )}

      {playerOpen && (
        <PlayerOverlay
          trackIndex={trackIndex}
          playing={playing}
          loading={loadingTrack}
          current={current}
          duration={duration}
          close={closePlayer}
          toggle={toggleAudio}
          seek={(value) => {
            if (audioRef.current) audioRef.current.currentTime = value;
            setCurrent(value);
          }}
          error={mediaError}
          retry={retryAudio}
        />
      )}

      {filmOpen && (
        <FilmOverlay
          close={closeFilm}
          pauseAudio={() => audioRef.current?.pause()}
          openCase={() => {
            setFilmOpen(false);
            openProject("winter-embers");
          }}
        />
      )}
    </>
  );
}
