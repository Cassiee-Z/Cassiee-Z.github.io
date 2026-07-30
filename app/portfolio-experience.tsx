"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getTrackLyrics } from "./track-lyrics";

type View = "universe" | "songs" | "projects" | "about" | "contact";
type EntryPhase = "gate" | "zooming" | "ready";
type ProjectKey =
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
    key: "catalog",
    no: "001",
    title: "从 16 首 AI 歌曲到可运营曲库",
    english: "AI MUSIC CATALOG",
    field: "音乐内容 · 曲库产品化",
    intro: "把“生成歌曲”推进到可检索、可评估、可分发的音乐内容资产。",
    metrics: [
      ["16", "首可发布成品"],
      ["4", "层曲库元数据"],
      ["5", "类分发场景"],
    ],
    sections: [
      {
        label: "01 / THE QUESTION",
        title: "生成不是终点，内容要能进入运营判断。",
        body: [
          "我将 16 首 AI 歌曲从零散音频整理为曲库样本：统一命名、补充风格与场景标签、记录版本，并设计适用于选歌、分发和复盘的评估维度。",
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
    no: "002",
    title: "中文新歌与潜力音乐人数据侦察",
    english: "DISCOVERY SIGNALS",
    field: "自主研究 · 数据分析",
    intro: "用公开榜单建立候选池，把“爆款直觉”拆成可补数、可复核的筛选流程。",
    metrics: [
      ["5", "维初筛模型"],
      ["4W", "建议观察周期"],
      ["1", "份自主研究"],
    ],
    sections: [
      {
        label: "01 / THE QUESTION",
        title: "公开榜单能筛出“值得补数”的候选人吗？",
        body: [
          "本案例不把榜单名次等同于爆款结论，而是模拟内容运营岗位的第一轮侦察：建立候选池、拆解评价字段、标记信息缺口，再决定下一步向谁要数据。",
          "案例性质：自主行业研究。公开事实与个人分析假设分开标注。",
        ],
      },
      {
        label: "02 / THE FILTER",
        title: "信息不足时，不制造精确分数。",
        body: [
          "初筛框架由榜单信号、社交传播、场景适配、版权就绪度与差异化构成。榜单只用于发现，合作判断必须补齐连续趋势与权利信息。",
        ],
        items: ["榜单信号 30%", "社交传播 20%", "场景适配 20%", "版权就绪 20%", "差异化 10%"],
      },
      {
        label: "03 / DATA REQUEST",
        title: "真正推进合作前，需要向平台与创作者要什么？",
        body: [
          "连续四周日榜/周榜、完播收藏分享率、短视频 BGM 使用趋势、受众画像，以及词曲、录音制品、表演者与授权范围的完整信息。",
        ],
      },
    ],
  },
  {
    key: "copyright",
    no: "003",
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
    no: "004",
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
    no: "005",
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
    no: "006",
    title: "AI 内容实验：短视频与图文",
    english: "AI EDITORIAL LAB",
    field: "个人实践 · 持续更新",
    intro: "从热点判断到脚本、生成、剪辑与发布，验证轻量内容生产链路。",
    metrics: [
      ["6", "步内容工作流"],
      ["1", "篇完整图文案例"],
      ["∞", "持续实验"],
    ],
    sections: [
      {
        label: "01 / SHORT VIDEO",
        title: "热点不是终点，要转译成适合账号的内容。",
        body: [
          "我负责热点判断、脚本、图像生成、语音与口型、剪辑、标题发布和数据复盘。页面暂不公开粉丝与播放数据，重点展示对生产流程的理解。",
        ],
        items: ["HOTSPOT", "SCRIPT", "GENERATE", "EDIT", "PUBLISH", "REVIEW"],
      },
      {
        label: "02 / EDITORIAL",
        title: "把复杂生成过程，写成读者能看完的故事。",
        body: [
          "公众号案例《小屁屁 Pet 生成记》记录从宠物照片到角色设定、动画表与交互场景的完整过程，验证选题结构、图文叙事与视觉排版能力。",
        ],
      },
      {
        label: "03 / NEXT",
        title: "让创作实验进入持续运营。",
        body: [
          "公众号发布终稿、短视频后台数据与小红书代表文章待完成最终审校后公开；现阶段不虚构成果数字。",
        ],
      },
    ],
  },
];

const tracks = [
  { title: "蓝调夜行", scene: "URBAN BLUES", description: "夜色、铜管与都市行进感交织的 AI 音乐实验。", src: "/audio/blue-night.mp3" },
  { title: "雨停在旧站台", scene: "POP BALLAD", description: "以旧站台和雨后余韵构建的叙事流行作品。", src: "/audio/rain-old-platform.mp3" },
  { title: "梨园照山河", scene: "CHINESE FUSION", description: "戏曲音色与现代编曲交织的文化融合尝试。", src: "/audio/opera-mountains.mp3" },
  { title: "RUN INTO THE THUNDER", scene: "ENGLISH ROCK", description: "高能鼓组与电吉他共同推进的英文摇滚作品。", src: "/audio/run-into-thunder.mp3" },
  { title: "GOLD ON THE FLOOR", scene: "DANCE POP", description: "面向舞蹈与短视频场景的律动流行作品。", src: "/audio/gold-on-floor.mp3" },
  { title: "未发送的晚安", scene: "MIDNIGHT MESSAGE", description: "夜间消息感与克制叙事构成的情绪作品。", src: "/audio/unsent-goodnight.mp3" },
  { title: "凌晨四点的便利店", scene: "CITY POP", description: "都市深夜场景下的 City Pop 氛围实验。", src: "/audio/four-am-store.mp3" },
  { title: "把夜走成清晨", scene: "DAWN WALK", description: "从暗夜走向晨光的渐进式情绪叙事。", src: "/audio/night-to-morning.mp3" },
  { title: "百年新章", scene: "CEREMONIAL", description: "面向庆典与文化场景的宏阔融合创作。", src: "/audio/century-new-chapter.mp3" },
  { title: "逆着光生长", scene: "UPLIFTING POP", description: "强调向上能量与副歌推动力的流行作品。", src: "/audio/grow-against-light.mp3" },
  { title: "把名字写进风里", scene: "AIRY POP", description: "轻盈空气感与离别意象交织的流行作品。", src: "/audio/name-in-wind.mp3" },
  { title: "月亮没有回信", scene: "LUNAR BALLAD", description: "围绕等待与失落展开的月夜抒情作品。", src: "/audio/moon-no-reply.mp3" },
  { title: "SWINGING HARD", scene: "BRASS & GROOVE", description: "铜管、律动与现场感驱动的 Groove 实验。", src: "/audio/swinging-hard.mp3" },
  { title: "风从长江吹来", scene: "RIVER FUSION", description: "江河意象与地域文化融合的音乐作品。", src: "/audio/wind-from-yangtze.mp3" },
  { title: "玻璃海", scene: "AMBIENT POP", description: "透明质感与漂浮空间感构成的氛围流行作品。", src: "/audio/glass-sea.mp3" },
  { title: "仍在路上", scene: "FORWARD", description: "面向前行叙事与成长主题的鼓舞型作品。", src: "/audio/still-on-road.mp3" },
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
  { id: "blue", title: "蓝调夜行", subtitle: "URBAN BLUES", src: "/images/covers/blue-night-v3.jpg", art: "blue", x: -37, y: -26, z: 150, rx: -3, ry: 12, size: 16, trackIndex: 0 },
  { id: "rain", title: "雨停在旧站台", subtitle: "POP BALLAD", src: "/images/covers/rain-old-platform-v3.jpg", art: "rain", x: 27, y: -28, z: -90, rx: 4, ry: -10, size: 11, trackIndex: 1 },
  { id: "opera", title: "梨园照山河", subtitle: "CHINESE FUSION", src: "/images/covers/opera-mountains.jpg", art: "opera", x: -13, y: -20, z: 135, rx: -2, ry: 5, size: 13, trackIndex: 2 },
  { id: "thunder", title: "RUN INTO THE THUNDER", subtitle: "ENGLISH ROCK", src: "/images/covers/run-into-thunder-v3.jpg", art: "thunder", x: 38, y: 4, z: 100, rx: 2, ry: -13, size: 17, trackIndex: 3 },
  { id: "gold", title: "GOLD ON THE FLOOR", subtitle: "DANCE POP", src: "/images/covers/gold-on-floor-v3.jpg", art: "gold", x: -31, y: 23, z: -130, rx: -5, ry: 9, size: 12, trackIndex: 4 },
  { id: "goodnight", title: "未发送的晚安", subtitle: "MIDNIGHT MESSAGE", src: "/images/covers/unsent-goodnight-v4.jpg", art: "violet", x: -11, y: -34, z: -340, rx: 8, ry: 4, size: 8, trackIndex: 5 },
  { id: "store", title: "凌晨四点的便利店", subtitle: "CITY POP", src: "/images/covers/four-am-store-v3.jpg", art: "store", x: 42, y: -18, z: -390, rx: -4, ry: -16, size: 8, trackIndex: 6 },
  { id: "morning", title: "把夜走成清晨", subtitle: "DAWN WALK", src: "/images/covers/night-to-morning-v3.jpg", art: "dawn", x: -44, y: -4, z: -260, rx: 6, ry: 14, size: 9, trackIndex: 7 },
  { id: "chapter", title: "百年新章", subtitle: "CEREMONIAL", src: "/images/covers/century-new-chapter-v3.jpg", art: "crimson", x: 20, y: 29, z: -300, rx: -7, ry: -7, size: 9, trackIndex: 8 },
  { id: "light", title: "逆着光生长", subtitle: "UPLIFTING POP", src: "/images/covers/grow-against-light-v3.jpg", art: "light", x: 44, y: 28, z: -220, rx: 5, ry: -15, size: 10, trackIndex: 9 },
  { id: "wind", title: "把名字写进风里", subtitle: "AIRY POP", src: "/images/covers/name-in-wind-v3.jpg", art: "wind", x: -15, y: 32, z: 70, rx: 4, ry: 3, size: 11, trackIndex: 10 },
  { id: "moon", title: "月亮没有回信", subtitle: "LUNAR BALLAD", src: "/images/covers/moon-no-reply-v3.jpg", art: "moon", x: 16, y: -39, z: -480, rx: 7, ry: -2, size: 7, trackIndex: 11 },
  { id: "swing", title: "SWINGING HARD", subtitle: "BRASS & GROOVE", src: "/images/covers/swinging-hard-v3.jpg", art: "swing", x: -45, y: 36, z: -430, rx: -5, ry: 17, size: 8, trackIndex: 12 },
  { id: "river", title: "风从长江吹来", subtitle: "RIVER FUSION", src: "/images/covers/wind-from-yangtze-v3.jpg", art: "river", x: 31, y: 38, z: -470, rx: 5, ry: -9, size: 7, trackIndex: 13 },
  { id: "glass", title: "玻璃海", subtitle: "AMBIENT POP", src: "/images/covers/glass-sea-v3.jpg", art: "glass", x: -25, y: -7, z: -510, rx: -8, ry: 8, size: 7, trackIndex: 14 },
  { id: "road", title: "仍在路上", subtitle: "FORWARD", src: "/images/covers/still-on-road-v3.jpg", art: "road", x: 7, y: 38, z: -180, rx: -4, ry: -2, size: 9, trackIndex: 15 },
];

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

function parseLyricLines(rawLyrics?: string | null): LyricLine[] {
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
    if (text === "```" || (lines.length === 0 && /^《[^》]+》$/.test(text))) {
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

function buildLyricCues(rawLyrics: string | null | undefined, duration: number): LyricCue[] {
  const lines = parseLyricLines(rawLyrics);
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
      <button className={view === "projects" ? "is-active" : ""} onClick={() => chooseView("projects")}>THE</button>
      <button className={view === "projects" ? "is-active" : ""} onClick={() => chooseView("projects")}>WORK</button>
      <span>AND</span>
      <button className={view === "about" ? "is-active" : ""} onClick={() => chooseView("about")}>ABOUT</button>
      <button className={view === "about" ? "is-active" : ""} onClick={() => chooseView("about")}>ME</button>
      <span>OR</span>
      <button className={view === "contact" ? "is-active" : ""} onClick={() => chooseView("contact")}>CONTACT</button>
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
      <button
        className="sound-gate__enter"
        onClick={() => { if (!zooming) enter(true); }}
        aria-disabled={zooming}
        aria-label="开启声音并进入音乐宇宙"
        autoFocus
      >
        <span className="sound-gate__prompt" id="sound-gate-title" aria-hidden="true">
          <span>CLICK</span>
          <span>ANYWHERE</span>
          <span>TO</span>
          <span>TURN</span>
          <span>ON</span>
          <span>YOUR</span>
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
  chooseView,
  playTrack,
  activeTrack,
  playing,
  interactive,
}: {
  openProject: (key: ProjectKey) => void;
  chooseView: (view: View) => void;
  playTrack: (index: number) => void;
  activeTrack: number;
  playing: boolean;
  interactive: boolean;
}) {
  const { cameraRef, handlers, shouldSuppressClick } = useInertialCamera(interactive);
  const [pointerHoverId, setPointerHoverId] = useState<string | null>(null);
  const [focusId, setFocusId] = useState<string | null>(null);
  const hoverTimerRef = useRef<number | null>(null);
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

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current !== null) window.clearTimeout(hoverTimerRef.current);
      if (cursorFrameRef.current !== null) window.cancelAnimationFrame(cursorFrameRef.current);
    };
  }, []);

  useEffect(() => {
    if (!pointerHoverId) {
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
      <span className="sr-only">让音乐被听见：探索 Cassie 的 16 首 AI 音乐作品。</span>
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
                    onPointerEnter={(event) => {
                      moveLearnMore(event);
                      scheduleHover(plane, event.pointerType);
                    }}
                    onPointerLeave={() => clearPointerHover(plane.id)}
                    onFocus={() => setFocusId(plane.id)}
                    onBlur={() => setFocusId((current) => current === plane.id ? null : current)}
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
      <div className={`music-universe__hud ${focusedPlane ? "is-showing-track" : ""}`}>
        {focusedPlane ? (
          <div className="music-universe__focus-copy" key={focusedPlane.id} aria-live="polite">
            <h1>{focusedPlane.title}</h1>
            <span className="music-universe__focus-scene">{focusedPlane.subtitle}</span>
            <p className="music-universe__focus-description">
              {focusedPlane.trackIndex !== undefined
                ? tracks[focusedPlane.trackIndex].description
                : "从生成歌曲到可检索、可评估、可分发的音乐内容资产。"}
            </p>
            <small>FROM THE 16-TRACK AI MUSIC CATALOG · CLICK TO LISTEN</small>
          </div>
        ) : (
          <>
            <button onClick={() => chooseView("songs")} aria-label="打开歌曲索引">
              <i>＋</i>
              <span>MUSIC INDEX</span>
            </button>
            <p>MOVE TO EXPLORE · HOVER TO FOCUS · CLICK TO LISTEN</p>
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
  chooseView,
}: {
  playTrack: (index: number) => void;
  chooseView: (view: View) => void;
}) {
  return (
    <main className="song-index" id="main-content">
      <button className="space-back" onClick={() => chooseView("universe")}>
        ← BACK TO SPACE VIEW
      </button>
      <div className="song-index__heading">
        <span>SONG INDEX</span>
        <p>16 TRACKS · CLICK TO LISTEN</p>
      </div>
      <div className="song-index__grid">
        {tracks.map((track, index) => (
          <button key={track.src} onClick={() => playTrack(index)}>
            <span>{String(index + 1).padStart(3, "0")}</span>
            <strong>{track.title}</strong>
            <em>{track.scene}</em>
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
        <p>2023 — 2026</p>
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

function TrackList({ playTrack }: { playTrack: (index: number) => void }) {
  return (
    <div className="project-tracks">
      {tracks.map((track, index) => (
        <button key={track.src} onClick={() => playTrack(index)}>
          <span>{String(index + 1).padStart(3, "0")}</span>
          <strong>{track.title}</strong>
          <em>{track.scene}</em>
          <i>PLAY ↗</i>
        </button>
      ))}
    </div>
  );
}

function ProjectDetail({
  project,
  onBack,
  openProject,
  playTrack,
}: {
  project: Project;
  onBack: () => void;
  openProject: (key: ProjectKey) => void;
  playTrack: (index: number) => void;
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
        {project.key === "event" || project.key === "review" ? (
          <Image unoptimized src="/images/cassie-editorial.jpg" alt="查文鑫个人项目视觉" fill sizes="100vw" />
        ) : project.key === "editorial" ? (
          <Image unoptimized src="/images/universe/pet-cover.png" alt="AI 内容实验项目视觉" fill sizes="100vw" />
        ) : (
          <Image unoptimized src="/images/og-cassie-music.jpg" alt="音乐内容作品集视觉" fill sizes="100vw" />
        )}
        <div>
          <small>A CASE BY CASSIE ZHA</small>
          <strong>{project.english}</strong>
        </div>
      </section>

      <section className="metric-band">
        {project.metrics.map(([value, label]) => (
          <div key={label}><strong>{value}</strong><span>{label}</span></div>
        ))}
      </section>

      {project.key === "catalog" && (
        <section className="listening-section">
          <p>SELECTED AUDIO / 点击进入全屏播放器</p>
          <h2>LISTEN TO THE CATALOG</h2>
          <TrackList playTrack={playTrack} />
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

      {(project.key === "event" || project.key === "editorial") && (
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
          <p>2016—2020 · 南京艺术学院</p>
          <strong>作曲与作曲技术理论 · 本科</strong>
          <p>2023—2026 · 南京艺术学院</p>
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
            <span>CATALOG / 16 TRACKS</span>
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
          <article><span>2023.12—2024.03</span><h2>江苏省委组织部</h2><p>独立审核上千份材料，参与新媒体文案、脚本与短视频运营。</p></article>
          <article><span>2023.07—2024.03</span><h2>欧拉艺术空间</h2><p>创作者沟通、歌词交易协助与版权风险材料整理。</p></article>
          <article><span>1 YEAR</span><h2>研究生会学术部部长</h2><p>活动策划、跨团队协同与现场落地。</p></article>
        </div>
      </section>

      <section className="about-scene numbers-scene">
        <p>THE WORK SO FAR</p>
        <h2><span>16</span> SONGS</h2>
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
  current,
  duration,
  close,
  toggle,
  seek,
}: {
  trackIndex: number;
  playing: boolean;
  current: number;
  duration: number;
  close: () => void;
  toggle: () => void;
  seek: (value: number) => void;
}) {
  const track = tracks[trackIndex];
  const plane = universePlanes[trackIndex];
  const lyricViewportRef = useRef<HTMLOListElement>(null);
  const lyricLineRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lyricCues = useMemo(
    () => buildLyricCues(getTrackLyrics(track.src), duration),
    [duration, track.src],
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
              className={`player-cover__toggle ${playing ? "is-playing" : ""}`}
              onClick={toggle}
              aria-label={playing ? "暂停" : "播放"}
            >
              <span>{playing ? "Ⅱ" : "▶"}</span>
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
            <small>{formatTime(current)} / {formatTime(duration)}</small>
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

export default function PortfolioExperience() {
  const [entryPhase, setEntryPhase] = useState<EntryPhase>("gate");
  const [view, setView] = useState<View>("universe");
  const [activeProject, setActiveProject] = useState<ProjectKey | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const entryTimerRef = useRef<number | null>(null);
  const entryStartedRef = useRef(false);
  const trackIndexRef = useRef(0);
  const playerOpenerRef = useRef<HTMLElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    document.body.style.overflow = playerOpen || mobileMenu || entryPhase !== "ready" ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [playerOpen, mobileMenu, entryPhase]);

  useEffect(() => {
    return () => {
      if (entryTimerRef.current !== null) window.clearTimeout(entryTimerRef.current);
    };
  }, []);

  const chooseView = (next: View) => {
    setView(next);
    setActiveProject(null);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProject = (key: ProjectKey) => {
    setView("projects");
    setActiveProject(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
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

  const closeMobileMenu = () => {
    setMobileMenu(false);
    window.requestAnimationFrame(() => menuButtonRef.current?.focus());
  };

  const startAudio = async (index: number, open = true) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (trackIndexRef.current !== index) {
      audio.pause();
      audio.src = tracks[index].src;
      audio.load();
      trackIndexRef.current = index;
      setTrackIndex(index);
      setCurrent(0);
      setDuration(0);
    }
    if (open) openPlayer();
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
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
    entryTimerRef.current = window.setTimeout(finishEntry, 4400);
  };

  const toggleAudio = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      try { await audio.play(); } catch { setPlaying(false); }
    } else {
      audio.pause();
    }
  };

  const active = projects.find((project) => project.key === activeProject);

  return (
    <>
      {entryPhase === "ready" && !playerOpen && !mobileMenu && (
        <a className="skip-link" href="#main-content">跳到主要内容</a>
      )}
      <audio
        ref={audioRef}
        src={tracks[0].src}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onDurationChange={(event) => setDuration(event.currentTarget.duration)}
        onCanPlay={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => {
          setCurrent(event.currentTarget.currentTime);
          if (Number.isFinite(event.currentTarget.duration)) setDuration(event.currentTarget.duration);
        }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => { setPlaying(false); setCurrent(0); }}
      />

      {entryPhase !== "ready" && <SoundGate phase={entryPhase} enter={enter} />}

      <div
        className={`site-shell ${entryPhase !== "gate" ? "is-visible" : ""} ${entryPhase === "zooming" ? "is-arriving" : ""}`}
        aria-hidden={entryPhase !== "ready" || playerOpen || mobileMenu}
        inert={entryPhase !== "ready" || playerOpen || mobileMenu ? true : undefined}
      >
        <header className="site-header">
          <Brand onHome={() => chooseView("universe")} />
          <button className="now-playing" onClick={openPlayer}>
            <i className={playing ? "is-playing" : ""} />
            {playing ? "PLAYING" : "LISTEN"}
          </button>
          <button
            ref={menuButtonRef}
            className={`menu-button ${mobileMenu ? "is-open" : ""}`}
            onClick={() => setMobileMenu(true)}
            aria-label="打开导航"
          >
            <i /><i />
          </button>
        </header>

        {active ? (
          <ProjectDetail
            project={active}
            onBack={() => { setActiveProject(null); window.scrollTo({ top: 0, behavior: "smooth" }); }}
            openProject={openProject}
            playTrack={(index) => startAudio(index)}
          />
        ) : view === "universe" ? (
          <MusicUniverse
            openProject={openProject}
            chooseView={chooseView}
            playTrack={(index) => startAudio(index)}
            activeTrack={trackIndex}
            playing={playing}
            interactive={entryPhase === "ready"}
          />
        ) : view === "songs" ? (
          <SongIndex playTrack={(index) => startAudio(index)} chooseView={chooseView} />
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
          className="mobile-menu"
          aria-label="移动端导航"
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
          current={current}
          duration={duration}
          close={closePlayer}
          toggle={toggleAudio}
          seek={(value) => {
            if (audioRef.current) audioRef.current.currentTime = value;
            setCurrent(value);
          }}
        />
      )}
    </>
  );
}
