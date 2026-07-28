"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type View = "universe" | "projects" | "about" | "contact";
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
  { title: "蓝调夜行", scene: "URBAN BLUES", src: "/audio/blue-night.mp3" },
  { title: "雨停在旧站台", scene: "POP BALLAD", src: "/audio/rain-old-platform.mp3" },
  { title: "梨园照山河", scene: "CHINESE FUSION", src: "/audio/opera-mountains.mp3" },
  { title: "RUN INTO THE THUNDER", scene: "ENGLISH ROCK", src: "/audio/run-into-thunder.mp3" },
  { title: "GOLD ON THE FLOOR", scene: "DANCE POP", src: "/audio/gold-on-floor.mp3" },
];

const universeTiles = [
  { key: "catalog" as ProjectKey, src: "/images/og-cassie-music.jpg", className: "orbit-tile tile-one", label: "16 SONGS" },
  { key: "event" as ProjectKey, src: "/images/cassie-editorial.jpg", className: "orbit-tile tile-two", label: "LIVE OPS" },
  { key: "editorial" as ProjectKey, src: "/images/universe/pet-cover.png", className: "orbit-tile tile-three", label: "AI EDITORIAL" },
  { key: "review" as ProjectKey, src: "/images/cassie-headshot.jpg", className: "orbit-tile tile-four", label: "CONTENT QA" },
  { key: "editorial" as ProjectKey, src: "/images/universe/pet-preview.png", className: "orbit-tile tile-five", label: "GENERATIVE" },
  { key: "scouting" as ProjectKey, src: "/images/universe/pet-ui.png", className: "orbit-tile tile-six", label: "DATA SIGNALS" },
  { key: "copyright" as ProjectKey, src: "/images/universe/cat-photo.jpg", className: "orbit-tile tile-seven", label: "RIGHTS" },
];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  return `${Math.floor(value / 60)}:${Math.floor(value % 60).toString().padStart(2, "0")}`;
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

function SoundGate({ enter }: { enter: (sound: boolean) => void }) {
  return (
    <div className="sound-gate" role="dialog" aria-modal="true" aria-label="作品集声音入口">
      <div className="gate-stars" aria-hidden="true">
        <i /><i /><i /><i /><i />
      </div>
      <div className="gate-ring">
        <button onClick={() => enter(true)}>
          <span>CLICK ANYWHERE</span>
          <strong>TO TURN ON<br />YOUR SOUND</strong>
          <small>让音乐被听见，也被正确地运营</small>
        </button>
      </div>
      <button className="enter-muted" onClick={() => enter(false)}>静音进入 · ENTER WITHOUT SOUND</button>
    </div>
  );
}

function Universe({
  openProject,
  chooseView,
}: {
  openProject: (key: ProjectKey) => void;
  chooseView: (view: View) => void;
}) {
  const fieldRef = useRef<HTMLElement>(null);
  const move = (event: React.PointerEvent<HTMLElement>) => {
    const box = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - 0.5;
    const y = (event.clientY - box.top) / box.height - 0.5;
    fieldRef.current?.style.setProperty("--mx", `${x * 22}px`);
    fieldRef.current?.style.setProperty("--my", `${y * 18}px`);
  };

  return (
    <main className="universe" id="main-content" ref={fieldRef} onPointerMove={move}>
      <div className="universe-grid" aria-hidden="true" />
      {universeTiles.map((tile, index) => (
        <button
          className={tile.className}
          key={`${tile.key}-${index}`}
          onClick={() => openProject(tile.key)}
          aria-label={`打开项目：${projects.find((project) => project.key === tile.key)?.title}`}
        >
          <Image unoptimized src={tile.src} alt="" fill sizes="(max-width: 700px) 42vw, 18vw" />
          <span>{tile.label}</span>
        </button>
      ))}
      <div className="universe-intro">
        <p>WELCOME</p>
        <h1>
          TO CASSIE ZHA&apos;S UNIVERSE<br />
          OF MUSIC CONTENT + RIGHTS<br />
          AND AI MUSIC OPERATIONS
        </h1>
        <small>音乐内容运营 · 版权与创作者合作 · AI 音乐实践</small>
      </div>
      <WordNavigation view="universe" chooseView={chooseView} />
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
        <Image unoptimized src="/images/cassie-headshot.jpg" alt="查文鑫职业头像" width={760} height={980} />
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
  return (
    <div className="player-overlay" role="dialog" aria-modal="true" aria-label="音乐播放器">
      <button className="player-close" onClick={close}>CLOSE ×</button>
      <p className="playing-label">PLAYING NOW</p>
      <button className={`equalizer ${playing ? "is-playing" : ""}`} onClick={toggle} aria-label={playing ? "暂停" : "播放"}>
        <i /><i /><i />
        <span>{playing ? "Ⅱ" : "▶"}</span>
      </button>
      <div className="player-copy">
        <strong>{track.title}</strong>
        <span>FROM {track.scene}</span>
      </div>
      <input
        type="range"
        min="0"
        max={duration || 0}
        value={Math.min(current, duration || 0)}
        onChange={(event) => seek(Number(event.target.value))}
        aria-label="播放进度"
      />
      <small>{formatTime(current)} / {formatTime(duration)}</small>
    </div>
  );
}

export default function PortfolioExperience() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("universe");
  const [activeProject, setActiveProject] = useState<ProjectKey | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    document.body.style.overflow = playerOpen || mobileMenu || !entered ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [playerOpen, mobileMenu, entered]);

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

  const startAudio = async (index: number, open = true) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (trackIndex !== index) {
      audio.pause();
      audio.src = tracks[index].src;
      audio.load();
      setTrackIndex(index);
    }
    if (open) setPlayerOpen(true);
    try {
      await audio.play();
    } catch {
      setPlaying(false);
    }
  };

  const enter = async (withSound: boolean) => {
    setEntered(true);
    if (withSound) await startAudio(0, false);
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
      <a className="skip-link" href="#main-content">跳到主要内容</a>
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

      {!entered && <SoundGate enter={enter} />}

      <div className={`site-shell ${entered ? "is-visible" : ""}`}>
        <header className="site-header">
          <Brand onHome={() => chooseView("universe")} />
          <button className="now-playing" onClick={() => setPlayerOpen(true)}>
            <i className={playing ? "is-playing" : ""} />
            {playing ? "PLAYING" : "LISTEN"}
          </button>
          <button className={`menu-button ${mobileMenu ? "is-open" : ""}`} onClick={() => setMobileMenu((value) => !value)} aria-label="打开导航">
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
          <Universe openProject={openProject} chooseView={chooseView} />
        ) : view === "projects" ? (
          <ProjectsIndex openProject={openProject} chooseView={chooseView} />
        ) : view === "about" ? (
          <About chooseView={chooseView} />
        ) : (
          <Contact chooseView={chooseView} />
        )}
      </div>

      {mobileMenu && (
        <nav className="mobile-menu" aria-label="移动端导航">
          <button onClick={() => chooseView("projects")}><span>01</span>THE WORK</button>
          <button onClick={() => chooseView("about")}><span>02</span>ABOUT ME</button>
          <button onClick={() => chooseView("contact")}><span>03</span>CONTACT</button>
        </nav>
      )}

      {playerOpen && (
        <PlayerOverlay
          trackIndex={trackIndex}
          playing={playing}
          current={current}
          duration={duration}
          close={() => setPlayerOpen(false)}
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
