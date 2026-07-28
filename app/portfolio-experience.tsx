"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type View = "work" | "about" | "contact";
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
  eyebrow: string;
  intro: string;
  tags: string[];
};

const projects: Project[] = [
  {
    key: "catalog",
    no: "01",
    title: "从 16 首 AI 歌曲到可运营曲库",
    english: "AI MUSIC CATALOG",
    eyebrow: "音乐内容 · 曲库产品化",
    intro: "把“生成歌曲”推进到可检索、可评估、可分发的内容资产。",
    tags: ["16 首成品", "四层元数据", "A/B 版本", "场景分发"],
  },
  {
    key: "scouting",
    no: "02",
    title: "中文新歌与潜力音乐人数据侦察",
    english: "DISCOVERY SIGNALS",
    eyebrow: "自主研究 · 数据分析",
    intro: "用公开榜单搭建候选池，并把“爆款直觉”拆成可补数、可复核的筛选流程。",
    tags: ["公开数据", "候选池", "评分框架", "决策边界"],
  },
  {
    key: "copyright",
    no: "03",
    title: "歌词商用未署名事件：版权风险复盘",
    english: "RIGHTS REVIEW",
    eyebrow: "真实经历 · 匿名化复盘",
    intro: "从一次没有书面合同的歌词交易，回看署名、授权范围与证据链为何必须前置。",
    tags: ["权利链", "风险识别", "合同要点", "沟通协助"],
  },
  {
    key: "review",
    no: "04",
    title: "上千份内容审核与质检",
    english: "CONTENT QA",
    eyebrow: "江苏省委组织部 · 实习",
    intro: "把政策内容审核拆成稳定、可追踪的七类检查维度。",
    tags: ["1000+ 材料", "内容审核", "新媒体", "质量标准"],
  },
  {
    key: "event",
    no: "05",
    title: "南艺 520：从策划到全场落地",
    english: "LIVE CONTENT OPS",
    eyebrow: "学生总负责人 · 2025",
    intro: "统筹节目、内容、舞台物料、志愿者与后勤，让大型校园内容项目顺利发生。",
    tags: ["统筹策划", "跨院协作", "20+ 媒体", "现场执行"],
  },
  {
    key: "editorial",
    no: "06",
    title: "AI 内容实验：短视频与图文",
    english: "AI EDITORIAL LAB",
    eyebrow: "个人实践 · 持续更新",
    intro: "从热点判断到脚本、生成、剪辑与发布，验证轻量内容生产链路。",
    tags: ["短视频", "公众号", "AI 工作流", "复盘"],
  },
];

const tracks = [
  {
    title: "蓝调夜行",
    subtitle: "夜间城市 · Urban Blues",
    src: "/audio/blue-night.mp3",
  },
  {
    title: "雨停在旧站台",
    subtitle: "情绪叙事 · Pop Ballad",
    src: "/audio/rain-old-platform.mp3",
  },
  {
    title: "梨园照山河",
    subtitle: "国风戏韵 · Chinese Fusion",
    src: "/audio/opera-mountains.mp3",
  },
  {
    title: "Run Into the Thunder",
    subtitle: "运动场景 · English Rock",
    src: "/audio/run-into-thunder.mp3",
  },
  {
    title: "Gold on the Floor",
    subtitle: "庆典场景 · Dance Pop",
    src: "/audio/gold-on-floor.mp3",
  },
];

const catalog = [
  "蓝调夜行",
  "未发送的晚安",
  "凌晨四点的便利店",
  "雨停在旧站台",
  "把夜走成清晨",
  "百年新章",
  "逆着光生长",
  "把名字写进风里",
  "月亮没有回信",
  "Swinging Hard",
  "风从长江吹来",
  "玻璃海",
  "Run Into the Thunder",
  "梨园照山河",
  "仍在路上",
  "Gold on the Floor",
];

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

function TrackPlayer({
  title,
  subtitle,
  src,
  onStart,
}: {
  title: string;
  subtitle: string;
  src: string;
  onStart: () => void;
}) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const stop = (event: Event) => {
      if ((event as CustomEvent).detail !== src) {
        audioRef.current?.pause();
      }
    };
    window.addEventListener("cassie-track-play", stop);
    return () => window.removeEventListener("cassie-track-play", stop);
  }, [src]);

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      onStart();
      window.dispatchEvent(
        new CustomEvent("cassie-track-play", { detail: src }),
      );
      await audio.play();
    } else {
      audio.pause();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    const value = Number(event.target.value);
    audioRef.current.currentTime = value;
    setCurrent(value);
  };

  return (
    <div className="track-row">
      <button
        className="track-play"
        onClick={toggle}
        aria-label={`${playing ? "暂停" : "播放"} ${title}`}
      >
        <span>{playing ? "Ⅱ" : "▶"}</span>
      </button>
      <div className="track-copy">
        <strong>{title}</strong>
        <small>{subtitle}</small>
      </div>
      <div className="track-progress">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={Math.min(current, duration || 0)}
          onChange={seek}
          aria-label={`${title} 播放进度`}
        />
        <span>
          {formatTime(current)} / {formatTime(duration)}
        </span>
      </div>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onTimeUpdate={(event) => setCurrent(event.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
      />
    </div>
  );
}

function EvidenceSlot({ children }: { children: React.ReactNode }) {
  return (
    <div className="evidence-slot">
      <span>EVIDENCE SLOT · 待补证据</span>
      <p>{children}</p>
    </div>
  );
}

function ProjectHeader({
  project,
  onBack,
}: {
  project: Project;
  onBack: () => void;
}) {
  return (
    <header className="project-hero">
      <button className="text-button back-button" onClick={onBack}>
        ← 返回项目索引
      </button>
      <p className="kicker">
        {project.no} / {project.eyebrow}
      </p>
      <h1>{project.title}</h1>
      <p className="project-english">{project.english}</p>
      <p className="project-intro">{project.intro}</p>
      <div className="tag-row">
        {project.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </header>
  );
}

function CatalogProject({ onStart }: { onStart: () => void }) {
  return (
    <>
      <section className="metrics-grid four">
        <div>
          <strong>16</strong>
          <span>首可发布成品</span>
        </div>
        <div>
          <strong>4</strong>
          <span>层曲库元数据</span>
        </div>
        <div>
          <strong>16</strong>
          <span>维内容评估框架</span>
        </div>
        <div>
          <strong>3</strong>
          <span>首保留 A/B 候选版本</span>
        </div>
      </section>

      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — PROBLEM</p>
          <h2>生成不是终点，内容要能进入运营判断。</h2>
        </div>
        <div className="body-copy">
          <p>
            我将 16 首 AI 歌曲从零散音频整理为曲库样本：统一命名、补充标签、记录版本，
            并设计适用于选歌、分发和复盘的评估维度。
          </p>
          <p>
            这不是一套“AI 工具展示”，而是一种把创作结果转译为内容资产的工作方法。
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">02 — LISTEN</p>
        <h2>五首代表作试听</h2>
        <p className="section-lead">
          横跨夜间城市、情绪叙事、国风融合、运动与庆典五类使用场景。
        </p>
        <div className="track-list">
          {tracks.map((track) => (
            <TrackPlayer key={track.src} {...track} onStart={onStart} />
          ))}
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">03 — MODEL</p>
        <div className="process-grid">
          {[
            ["TRACK", "曲名、语言、风格、情绪、BPM、时长"],
            ["VERSION", "模型、提示词、生成批次、保留原因"],
            ["SEGMENT", "高光片段、前奏长度、可剪辑点、适配场景"],
            ["DISTRIBUTION", "目标人群、平台、内容模板、验证指标"],
          ].map(([name, copy], index) => (
            <div className="process-card" key={name}>
              <span>0{index + 1}</span>
              <h3>{name}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-section split">
        <div>
          <p className="section-no">04 — DECISION</p>
          <h2>先按场景找歌，再按数据验证。</h2>
        </div>
        <div className="decision-list">
          <p>
            <span>夜间城市</span> 蓝调夜行 / 把夜走成清晨 / 凌晨四点的便利店
          </p>
          <p>
            <span>情绪叙事</span> 月亮没有回信 / 未发送的晚安 / 雨停在旧站台
          </p>
          <p>
            <span>文化融合</span> 梨园照山河 / 风从长江吹来
          </p>
          <p>
            <span>运动庆典</span> Run Into the Thunder / Gold on the Floor
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">05 — FULL CATALOG</p>
        <div className="catalog-grid">
          {catalog.map((track, index) => (
            <div key={track}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {track}
            </div>
          ))}
        </div>
        <EvidenceSlot>
          16×16 评分、版本对照音频与高光片段时间码正在补齐；当前页面只展示已有成品与已建立的方法。
        </EvidenceSlot>
      </section>
    </>
  );
}

function ScoutingProject() {
  const growth = [
    ["非订阅音乐服务", 39.2],
    ["在线音乐服务", 22.9],
    ["音乐订阅", 16.0],
  ];
  return (
    <>
      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — QUESTION</p>
          <h2>公开榜单能筛出“值得补数”的候选人吗？</h2>
        </div>
        <div className="body-copy">
          <p>
            本案例不把榜单名次等同于爆款结论，而是模拟内容运营岗位的第一轮侦察：
            建立候选池、拆解评价字段、标记信息缺口，再决定下一步向谁要数据。
          </p>
          <p className="note">
            案例性质：自主行业研究。公开事实与个人分析假设分开标注。
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">02 — BUSINESS SIGNAL</p>
        <h2>内容与 IP 的非订阅价值正在加速。</h2>
        <p className="section-lead">
          腾讯音乐 2025 财年公开数据，单位为同比增幅。
        </p>
        <div className="bar-chart">
          {growth.map(([label, value]) => (
            <div className="bar-row" key={label}>
              <span>{label}</span>
              <div className="bar-track">
                <i style={{ width: `${Number(value) * 2.2}%` }} />
              </div>
              <strong>+{value}%</strong>
            </div>
          ))}
        </div>
        <p className="chart-caption">
          推论：除会员订阅外，广告、艺人商品、演出与版权相关业务值得在选歌时一并考虑；
          这不是对单曲表现的因果判断。
        </p>
      </section>

      <section className="editorial-section">
        <p className="section-no">03 — TRIAGE MODEL</p>
        <h2>五维初筛，不在信息不足时制造精确分数。</h2>
        <div className="score-grid">
          {[
            ["30%", "榜单信号", "名次、在榜周期、跨平台覆盖"],
            ["20%", "社交传播", "分享、收藏、评论与 UGC 使用"],
            ["20%", "场景适配", "高光片段、剪辑空间、内容模板"],
            ["20%", "版权就绪", "权利主体、授权范围、交付材料"],
            ["10%", "差异化", "人设、声音辨识度与内容叙事"],
          ].map(([weight, title, copy]) => (
            <div className="score-card" key={title}>
              <strong>{weight}</strong>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-section split">
        <div>
          <p className="section-no">04 — WORKED SAMPLE</p>
          <h2>Q1 Top 10 只够建立观察池，不够宣布“潜力股”。</h2>
        </div>
        <div className="body-copy">
          <p>
            QQ 音乐 2026 年第一季度公开榜单中，头部艺人占据多数；
            《一半一半》（杨博睿 / INDEcompany）可作为“非头部合作样本”进入补数队列。
          </p>
          <p>
            “非头部”是本案例的人工分类假设，并非平台标签。下一步必须补齐连续四周排名、
            收藏/分享率、UGC 使用趋势与版权清晰度，才可决定是否推进合作。
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">05 — DATA REQUEST</p>
        <div className="request-grid">
          {[
            "连续 4 周日榜 / 周榜变化",
            "完播、收藏、分享与评论率",
            "短视频 BGM 使用量与增速",
            "受众城市、年龄与新老听众",
            "词曲、录音制品与表演权主体",
            "可授权平台、期限、地区与场景",
          ].map((item) => (
            <div key={item}>+ {item}</div>
          ))}
        </div>
      </section>

      <section className="source-block">
        <span>PRIMARY SOURCES · 访问于 2026.07</span>
        <a
          href="https://ir.tencentmusic.com/2026-03-17-Tencent-Music-Entertainment-Group-Announces-Fourth-Quarter-and-Full-Year-2025-Unaudited-Financial-Results"
          target="_blank"
          rel="noreferrer"
        >
          腾讯音乐 2025 财年业绩 ↗
        </a>
        <a
          href="https://ir.tencentmusic.com/2026-05-12-Tencent-Music-Entertainment-Group-Announces-First-Quarter-2026-Unaudited-Financial-Results"
          target="_blank"
          rel="noreferrer"
        >
          腾讯音乐 2026 Q1 业绩 ↗
        </a>
        <a
          href="https://www.tencentmusic.com/en-us/uni-chart.html"
          target="_blank"
          rel="noreferrer"
        >
          TME 由你榜计算说明 ↗
        </a>
        <a
          href="https://www.sina.cn/news/detail/5290804693966032.html"
          target="_blank"
          rel="noreferrer"
        >
          QQ 音乐 2026 Q1 榜单公开信息 ↗
        </a>
      </section>
    </>
  );
}

function CopyrightProject() {
  return (
    <>
      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — CONTEXT</p>
          <h2>口头“买断”，并不自动回答所有权利问题。</h2>
        </div>
        <div className="body-copy">
          <p>
            在欧拉艺术空间实习期间，我对接过一位个人歌手与作词同学。
            双方以口头方式完成歌词买卖；歌曲后来用于综艺录制，却没有标注作词人。
          </p>
          <p>
            该事项未获得最终解决。以下内容是我在当事人求助后所做的材料整理、
            风险识别与沟通协助复盘，不代表法律结论。
          </p>
        </div>
      </section>

      <section className="editorial-section">
        <p className="section-no">02 — TIMELINE</p>
        <div className="timeline">
          {[
            ["01", "口头交易", "约定歌词买卖，但未签署书面合同。"],
            ["02", "节目使用", "歌手将歌曲用于综艺录制，未标注作词人姓名。"],
            ["03", "事后介入", "作词人联系我说明困扰，我开始协助梳理事实。"],
            ["04", "材料整理", "归集沟通记录、作品文件与付款等可用证据。"],
            ["05", "风险复盘", "由于录制完成且双方不在本地，事件未能解决。"],
          ].map(([no, title, copy]) => (
            <div key={no}>
              <span>{no}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="editorial-section split">
        <div>
          <p className="section-no">03 — LEARNING</p>
          <h2>授权前置清单</h2>
        </div>
        <div className="checklist">
          {[
            "明确交易对象：词、曲、录音制品，还是完整歌曲",
            "明确权利方式：许可使用或著作财产权转让",
            "写清媒介、场景、地区、期限与是否可转授权",
            "保留署名方式、交付版本、费用与付款节点",
            "约定节目播出、剪辑、宣传与二次传播",
            "保存创作底稿、文件时间、沟通与付款证据",
          ].map((item) => (
            <p key={item}>
              <span>✓</span>
              {item}
            </p>
          ))}
        </div>
      </section>

      <section className="rights-chain">
        <p className="section-no">04 — RIGHTS CHAIN OBSERVATION</p>
        <h2>一首歌进入短视频与综艺，要经过哪些权利与授权链条？</h2>
        <div className="rights-flow">
          <div>词 / 曲著作权</div>
          <i>→</i>
          <div>录音制作者权</div>
          <i>→</i>
          <div>表演者权</div>
          <i>→</i>
          <div>平台 / 节目使用</div>
        </div>
        <p>
          自主行业观察：实际项目需根据使用方式逐项核对复制、发行、信息网络传播、
          表演、改编、摄制及署名等事项，并由专业法务确认。
        </p>
      </section>
    </>
  );
}

function ReviewProject() {
  return (
    <>
      <section className="metrics-grid three">
        <div>
          <strong>1000+</strong>
          <span>独立审核材料</span>
        </div>
        <div>
          <strong>7</strong>
          <span>类质检维度</span>
        </div>
        <div>
          <strong>1</strong>
          <span>次优秀实习生</span>
        </div>
      </section>
      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — ROLE</p>
          <h2>高密度材料中的准确、合规与一致。</h2>
        </div>
        <div className="body-copy">
          <p>
            参与全国“两红两优”相关材料审核，独立处理上千份申报内容；
            同时参与新媒体文案、脚本策划与短视频运营。
          </p>
          <p>
            这段经历训练了我在大量文本中快速定位问题、保持判断标准并完成闭环反馈的能力。
          </p>
        </div>
      </section>
      <section className="editorial-section">
        <p className="section-no">02 — QA SYSTEM</p>
        <div className="qa-grid">
          {[
            ["合规性", "内容是否符合申报与发布要求"],
            ["准确性", "人物、事实、时间与数据是否一致"],
            ["充分性", "关键材料是否齐全、论据是否完整"],
            ["规范性", "字体、行距、格式与附件是否统一"],
            ["价值导向", "叙事立场与社会表达是否稳妥"],
            ["表述质量", "语义、标点、用词与逻辑是否清楚"],
            ["重复检查", "材料内部及批次间是否重复"],
          ].map(([title, copy], index) => (
            <div key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="editorial-section split">
        <div>
          <p className="section-no">03 — TRANSFER</p>
          <h2>迁移到音乐内容运营</h2>
        </div>
        <div className="body-copy">
          <p>
            对歌曲信息、版权材料、艺人资料与发布文案进行结构化检查，
            同样需要准确性、完整性、规范性和风险意识。
          </p>
          <p>
            我可以把既有审核能力迁移到曲库入库、内容上架、艺人资料校验与运营质检。
          </p>
        </div>
      </section>
    </>
  );
}

function EventProject() {
  return (
    <>
      <section className="metrics-grid three">
        <div>
          <strong>20+</strong>
          <span>家主流媒体报道</span>
        </div>
        <div>
          <strong>全流程</strong>
          <span>学生总负责人</span>
        </div>
        <div>
          <strong>跨学院</strong>
          <span>节目与资源协同</span>
        </div>
      </section>
      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — MANDATE</p>
          <h2>让创意、节目与现场资源在同一张图上运行。</h2>
        </div>
        <div className="body-copy">
          <p>
            作为“南艺 520”项目学生总负责人，我负责统筹规划与落地：
            对接各学院节目、推进文案与 PPT、大屏内容、志愿者、后勤及周边发放。
          </p>
          <p>
            项目于 2025 年 5 月举行，获新华社等 20 余家主流媒体报道。
          </p>
        </div>
      </section>
      <section className="editorial-section">
        <p className="section-no">02 — DELIVERY MAP</p>
        <div className="delivery-map">
          {[
            ["策划", "主题、流程、任务拆解与时间表"],
            ["内容", "文案、PPT、LED 大屏与节目衔接"],
            ["协同", "学院、表演团队、志愿者与后勤"],
            ["现场", "物料、周边、动线、突发情况处理"],
            ["传播", "媒体素材归集与复盘"],
          ].map(([title, copy]) => (
            <div key={title}>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <EvidenceSlot>
          新华社等媒体报道截图、公众号推文与现场物料正在归档，后续将替换为可核验图证。
        </EvidenceSlot>
      </section>
    </>
  );
}

function EditorialProject() {
  return (
    <>
      <section className="editorial-section split">
        <div>
          <p className="section-no">01 — SHORT VIDEO</p>
          <h2>从热点到可发布内容的轻量生产链。</h2>
        </div>
        <div className="body-copy">
          <p>
            断续运营 AI 萌宠短视频，覆盖热点判断、脚本、图像生成、语音与口型、
            剪辑、标题发布和数据复盘。代表性尝试将影视热梗转译为猫咪说话内容。
          </p>
          <p>
            页面暂不公开粉丝与播放数据，重点展示我对短内容生产流程的理解。
          </p>
        </div>
      </section>
      <section className="workflow-strip">
        {["HOTSPOT", "SCRIPT", "GENERATE", "EDIT", "PUBLISH", "REVIEW"].map(
          (item, index) => (
            <div key={item}>
              <span>0{index + 1}</span>
              {item}
            </div>
          ),
        )}
      </section>
      <section className="editorial-section split">
        <div>
          <p className="section-no">02 — EDITORIAL</p>
          <h2>把复杂生成过程写成读者能看完的故事。</h2>
        </div>
        <div className="body-copy">
          <p>
            公众号案例《小屁屁 Pet 生成记》记录从宠物照片到角色设定、
            动画表与交互场景的完整过程，验证选题结构、图文叙事与视觉排版能力。
          </p>
          <p>小红书与公众号岗位向文章将按投递方向继续补充。</p>
        </div>
      </section>
      <EvidenceSlot>
        公众号发布终稿、短视频后台数据与小红书代表文章待完成最终审校后公开。
      </EvidenceSlot>
    </>
  );
}

function ProjectDetail({
  project,
  onBack,
  onStartTrack,
}: {
  project: Project;
  onBack: () => void;
  onStartTrack: () => void;
}) {
  return (
    <article className="project-detail">
      <ProjectHeader project={project} onBack={onBack} />
      {project.key === "catalog" && <CatalogProject onStart={onStartTrack} />}
      {project.key === "scouting" && <ScoutingProject />}
      {project.key === "copyright" && <CopyrightProject />}
      {project.key === "review" && <ReviewProject />}
      {project.key === "event" && <EventProject />}
      {project.key === "editorial" && <EditorialProject />}
      <button className="next-project" onClick={onBack}>
        <span>BACK TO</span>
        查看全部项目 →
      </button>
    </article>
  );
}

function WorkView({ openProject }: { openProject: (key: ProjectKey) => void }) {
  return (
    <main className="work-view" id="main-content">
      <header className="work-intro">
        <p className="kicker">SELECTED WORK · 2023—2026</p>
        <h1>
          用音乐专业判断，
          <br />
          让内容进入运营。
        </h1>
        <p>
          音乐内容运营 <i>/</i> 版权与创作者合作 <i>/</i> AI 音乐实践
        </p>
      </header>
      <section className="project-index" aria-label="项目列表">
        {projects.map((project) => (
          <button
            key={project.key}
            className="project-index-row"
            onClick={() => openProject(project.key)}
          >
            <span className="project-no">{project.no}</span>
            <span className="project-title-wrap">
              <small>{project.eyebrow}</small>
              <strong>{project.title}</strong>
              <em>{project.english}</em>
            </span>
            <span className="project-arrow">↗</span>
          </button>
        ))}
      </section>
    </main>
  );
}

function AboutView() {
  return (
    <main className="about-view" id="main-content">
      <section className="about-hero">
        <div className="about-copy">
          <p className="kicker">ABOUT CASSIE</p>
          <h1>先理解音乐，<br />再组织内容。</h1>
          <p>
            我是查文鑫，南京艺术学院音乐与舞蹈学（流行音乐研究）硕士应届生。
            本科接受作曲与作曲技术理论训练，研究生阶段关注流行音乐、媒介与文化。
          </p>
          <p>
            我希望在音乐内容运营、版权或创作者合作岗位上，
            把专业判断、沟通推进与内容执行结合起来。
          </p>
        </div>
        <div className="portrait-frame">
          <Image
            src="/images/cassie-editorial.jpg"
            alt="查文鑫个人照片"
            width={1200}
            height={1800}
            priority
          />
          <span>NANJING / 2026</span>
        </div>
      </section>

      <section className="about-section">
        <p className="section-no">EDUCATION</p>
        <div className="education-row">
          <span>2023—2026</span>
          <h2>南京艺术学院</h2>
          <p>硕士 · 音乐与舞蹈学（流行音乐研究）</p>
        </div>
        <div className="education-row">
          <span>2016—2020</span>
          <h2>南京艺术学院</h2>
          <p>本科 · 作曲与作曲技术理论</p>
        </div>
      </section>

      <section className="about-section">
        <p className="section-no">EXPERIENCE</p>
        <div className="experience-row">
          <span>2023.12—2024.03</span>
          <div>
            <h2>江苏省委组织部</h2>
            <p>内容审核与新媒体实习 · 独立审核上千份材料，参与文案、脚本与短视频运营。</p>
          </div>
        </div>
        <div className="experience-row">
          <span>2023.07—2024.03</span>
          <div>
            <h2>南京欧拉文化传播有限公司</h2>
            <p>音乐商务实习 · 艺人/创作者沟通、歌词交易协助与版权风险材料整理。</p>
          </div>
        </div>
        <div className="experience-row">
          <span>1 YEAR</span>
          <div>
            <h2>研究生会学术部部长</h2>
            <p>统筹学术活动与大型校园内容项目，负责策划、协同与现场落地。</p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <p className="section-no">SELECTED RESEARCH</p>
        <div className="publication-list">
          <p>
            <span>2025</span>
            《“梗”文化对当代流行音乐形式与内容的塑造研究》·《艺术科技》
          </p>
          <p>
            <span>2025</span>
            《黑神话：悟空》游戏音乐中的跨媒介叙事与文化认同研究 · 硕士学位论文
          </p>
          <p>
            <span>2024</span>
            《流行歌曲创作中“人声器乐化”现象初探》·《艺术评鉴》第 10 期
          </p>
          <p>
            <span>2024</span>
            《人工智能对音乐的影响》·《焦点》
          </p>
          <p>
            <span>2025</span>
            《艺术介入老旧社区改造的债券回报》· 学术论坛优秀论文
          </p>
        </div>
      </section>

      <section className="about-section about-two-column">
        <div>
          <p className="section-no">AWARDS</p>
          <ul>
            <li>南京艺术学院研究生学业奖学金一等奖（Top 5%）</li>
            <li>南京艺术学院研究生学业奖学金二等奖</li>
            <li>南京艺术学院优秀研究生</li>
            <li>谢海燕奖学金</li>
            <li>江苏省委组织部“优秀实习生”</li>
            <li>南京大学生赛艇公开赛优秀志愿者</li>
          </ul>
        </div>
        <div>
          <p className="section-no">TOOLS & CERTIFICATES</p>
          <ul>
            <li>Suno / Mureka / Udio / SOUNDRAW / AIVA / Stable Audio</li>
            <li>剪映 / Logic / Cubase / Office</li>
            <li>数据分析：基础实践，正在强化</li>
            <li>CET-6 / 普通话二甲 / 高中音乐教师资格证</li>
          </ul>
        </div>
      </section>
    </main>
  );
}

function ContactView() {
  return (
    <main className="contact-view" id="main-content">
      <p className="kicker">CONTACT / AVAILABILITY</p>
      <h1>
        LET&apos;S MAKE
        <br />
        MUSIC <em>MOVE.</em>
      </h1>
      <p className="contact-lead">
        寻找音乐内容运营、版权及创作者合作相关机会。
        <br />
        北京 / 上海 / 深圳 / 杭州 · 一周内到岗 · 接受线下实习与全职。
      </p>
      <a className="email-link" href="mailto:1376856506@qq.com">
        1376856506@qq.com ↗
      </a>
      <div className="download-grid">
        <a href="/docs/Cassie_Zha_Wenxin_Resume_CN.pdf" download>
          <span>01</span>
          <strong>中文简历</strong>
          <small>PDF · 含联系电话 ↓</small>
        </a>
        <a href="/docs/Cassie_2-Day_Music_Ops_Cram_Plan.pdf" download>
          <span>02</span>
          <strong>两天突击清单</strong>
          <small>版权 + 数据分析 + 投递准备 ↓</small>
        </a>
      </div>
      <p className="privacy-note">电话号码仅放在下载简历中，减少公开页面骚扰。</p>
    </main>
  );
}

export default function PortfolioExperience() {
  const [entered, setEntered] = useState(false);
  const [view, setView] = useState<View>("work");
  const [activeProject, setActiveProject] = useState<ProjectKey | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const introAudioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const stored = window.sessionStorage.getItem("cassie-portfolio-entered");
      if (stored === "yes") setEntered(true);
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const enter = async (withSound: boolean) => {
    setEntered(true);
    setSoundOn(withSound);
    window.sessionStorage.setItem("cassie-portfolio-entered", "yes");
    if (withSound && introAudioRef.current) {
      introAudioRef.current.volume = 0.24;
      try {
        await introAudioRef.current.play();
      } catch {
        setSoundOn(false);
      }
    }
  };

  const toggleSound = async () => {
    const audio = introAudioRef.current;
    if (!audio) return;
    if (soundOn) {
      audio.pause();
      setSoundOn(false);
    } else {
      window.dispatchEvent(
        new CustomEvent("cassie-track-play", { detail: "intro" }),
      );
      try {
        await audio.play();
        setSoundOn(true);
      } catch {
        setSoundOn(false);
      }
    }
  };

  const chooseView = (next: View) => {
    setView(next);
    setActiveProject(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openProject = (key: ProjectKey) => {
    setActiveProject(key);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const active = projects.find((project) => project.key === activeProject);

  return (
    <>
      <a className="skip-link" href="#main-content">
        跳到主要内容
      </a>
      <audio
        ref={introAudioRef}
        src="/audio/blue-night.mp3"
        preload="metadata"
        onEnded={() => setSoundOn(false)}
      />

      {!entered && (
        <div className="sound-gate" role="dialog" aria-modal="true">
          <div className="gate-orbit" aria-hidden="true">
            <span>LISTEN · OBSERVE · CONNECT · OPERATE ·</span>
          </div>
          <div className="gate-content">
            <p>CASSIE ZHA / MUSIC CONTENT PORTFOLIO</p>
            <h1>
              让音乐被听见，
              <br />
              也被正确地运营。
            </h1>
            <button className="gate-primary" onClick={() => enter(true)}>
              <span className="sound-wave">▮▮▮</span>
              开启声音进入
            </button>
            <button className="gate-secondary" onClick={() => enter(false)}>
              静音进入
            </button>
            <small>声音不会自动播放，由你决定。</small>
          </div>
        </div>
      )}

      <div className={`site-shell ${entered ? "is-entered" : ""}`}>
        <header className="site-header">
          <button className="brand" onClick={() => chooseView("work")}>
            <strong>查文鑫</strong>
            <span>CASSIE ZHA</span>
          </button>
          <div className="header-actions">
            <span className="availability">AVAILABLE · 2026</span>
            <button className="sound-toggle" onClick={toggleSound}>
              <i className={soundOn ? "is-on" : ""} />
              {soundOn ? "SOUND ON" : "MUTED"}
            </button>
          </div>
        </header>

        {active ? (
          <ProjectDetail
            project={active}
            onBack={() => {
              setActiveProject(null);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onStartTrack={() => {
              introAudioRef.current?.pause();
              setSoundOn(false);
            }}
          />
        ) : view === "work" ? (
          <WorkView openProject={openProject} />
        ) : view === "about" ? (
          <AboutView />
        ) : (
          <ContactView />
        )}

        <footer className="site-footer">
          <nav aria-label="主要导航">
            <button
              className={view === "work" && !activeProject ? "active" : ""}
              onClick={() => chooseView("work")}
            >
              <span>01</span>作品
            </button>
            <button
              className={view === "about" ? "active" : ""}
              onClick={() => chooseView("about")}
            >
              <span>02</span>关于
            </button>
            <button
              className={view === "contact" ? "active" : ""}
              onClick={() => chooseView("contact")}
            >
              <span>03</span>联系
            </button>
          </nav>
          <p>© 2026 CASSIE ZHA · MADE FOR MUSIC TO MOVE</p>
        </footer>
      </div>
    </>
  );
}
