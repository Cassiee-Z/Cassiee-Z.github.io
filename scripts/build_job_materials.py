from pathlib import Path
from textwrap import shorten

from reportlab.lib.colors import Color, HexColor, black, white
from reportlab.lib.pagesizes import A4
from reportlab.lib.utils import ImageReader
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfgen import canvas


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "docs"
HEADSHOT = ROOT / "public" / "images" / "cassie-headshot.jpg"

W, H = A4
INK = HexColor("#0A0A0A")
PAPER = HexColor("#F5F3EE")
MUTED = HexColor("#66645F")
LINE = HexColor("#D4D0C6")
ACID = HexColor("#94C93D")
SOFT = HexColor("#ECE9E1")


def register_fonts():
    pdfmetrics.registerFont(
        TTFont("CN", "/System/Library/Fonts/STHeiti Medium.ttc", subfontIndex=0)
    )
    pdfmetrics.registerFont(
        TTFont("CNSong", "/System/Library/Fonts/Supplemental/Songti.ttc", subfontIndex=0)
    )
    pdfmetrics.registerFont(
        TTFont("Arial", "/System/Library/Fonts/Supplemental/Arial.ttf")
    )
    pdfmetrics.registerFont(
        TTFont("ArialBold", "/System/Library/Fonts/Supplemental/Arial Bold.ttf")
    )


def split_text(text, font, size, max_width):
    lines = []
    for paragraph in text.split("\n"):
        current = ""
        for char in paragraph:
            candidate = current + char
            if current and pdfmetrics.stringWidth(candidate, font, size) > max_width:
                lines.append(current)
                current = char
            else:
                current = candidate
        lines.append(current)
    return lines


def draw_text(c, text, x, y, max_width, font="CN", size=8, leading=12, color=INK):
    c.setFont(font, size)
    c.setFillColor(color)
    lines = split_text(text, font, size, max_width)
    for line in lines:
        c.drawString(x, y, line)
        y -= leading
    return y


def draw_bullet(
    c,
    text,
    x,
    y,
    max_width,
    font="CN",
    size=7.5,
    leading=10.5,
    bullet_color=ACID,
):
    c.setFillColor(bullet_color)
    c.circle(x + 2, y + 2.3, 1.35, fill=1, stroke=0)
    return draw_text(c, text, x + 9, y, max_width - 9, font, size, leading, MUTED) - 2


def draw_label(c, text, x, y, width, color=ACID):
    c.setFillColor(color)
    c.setFont("ArialBold", 6.2)
    c.drawString(x, y, text)
    c.setStrokeColor(LINE)
    c.setLineWidth(0.45)
    c.line(x, y - 6, x + width, y - 6)
    return y - 19


def draw_section_title(c, title, x, y):
    c.setFont("CN", 10.5)
    c.setFillColor(INK)
    c.drawString(x, y, title)
    c.setFillColor(ACID)
    c.rect(x, y - 6, 18, 1.3, fill=1, stroke=0)
    return y - 18


def draw_headshot(c, x, y, width, height):
    c.saveState()
    path = c.beginPath()
    path.roundRect(x, y, width, height, 8)
    c.clipPath(path, stroke=0, fill=0)
    image = ImageReader(str(HEADSHOT))
    iw, ih = image.getSize()
    scale = max(width / iw, height / ih)
    dw, dh = iw * scale, ih * scale
    c.drawImage(
        image,
        x - (dw - width) / 2,
        y - (dh - height) / 2,
        dw,
        dh,
        mask="auto",
    )
    c.restoreState()


def build_resume():
    path = OUT / "Cassie_Zha_Wenxin_Resume_CN.pdf"
    c = canvas.Canvas(str(path), pagesize=A4)
    c.setTitle("查文鑫｜音乐内容运营中文简历")
    c.setAuthor("查文鑫 Cassie Zha")

    margin = 30
    banner_h = 118
    c.setFillColor(INK)
    c.rect(0, H - banner_h, W, banner_h, fill=1, stroke=0)
    c.setFillColor(ACID)
    c.setFont("ArialBold", 6.5)
    c.drawString(margin, H - 28, "MUSIC CONTENT / RIGHTS / CREATOR COLLABORATION")
    c.setFillColor(white)
    c.setFont("CNSong", 25)
    c.drawString(margin, H - 62, "查文鑫")
    c.setFont("Arial", 11.5)
    c.setFillColor(HexColor("#BEBBB3"))
    c.drawString(margin + 92, H - 61, "CASSIE ZHA")
    c.setFont("CN", 8.2)
    c.setFillColor(white)
    c.drawString(margin, H - 85, "音乐内容运营｜版权与创作者合作｜AI 音乐实践")
    c.setFont("CN", 7.1)
    c.setFillColor(HexColor("#AAA79F"))
    c.drawString(
        margin,
        H - 104,
        "19941509725  ·  1376856506@qq.com  ·  北京 / 上海 / 深圳 / 杭州  ·  一周内到岗",
    )
    draw_headshot(c, W - margin - 63, H - banner_h + 15, 63, 88)

    left_x = margin
    gap = 20
    left_w = 354
    right_x = left_x + left_w + gap
    right_w = W - margin - right_x
    y_left = H - banner_h - 24
    y_right = y_left

    # Left column
    y_left = draw_section_title(c, "个人简介", left_x, y_left)
    summary = (
        "南京艺术学院音乐与舞蹈学（流行音乐研究）2026 届硕士，本科为作曲与作曲技术理论。"
        "具备音乐内容判断、创作者沟通、内容审核与项目统筹经验；正在将 16 首 AI 歌曲整理为可检索、"
        "可评估、可分发的曲库样本。"
    )
    y_left = draw_text(c, summary, left_x, y_left, left_w, size=7.7, leading=11.2, color=MUTED) - 11

    y_left = draw_section_title(c, "实习与项目经历", left_x, y_left)
    c.setFont("ArialBold", 6.2)
    c.setFillColor(ACID)
    c.drawString(left_x, y_left, "2023.12—2024.03")
    c.setFont("CN", 9.5)
    c.setFillColor(INK)
    c.drawString(left_x + 83, y_left, "江苏省委组织部｜内容审核与新媒体实习")
    y_left -= 14
    y_left = draw_bullet(
        c,
        "独立审核全国“两红两优”相关材料 1000+ 份，从合规、准确、充分、格式、价值导向、表述与重复七类维度完成质检。",
        left_x,
        y_left,
        left_w,
    )
    y_left = draw_bullet(
        c,
        "参与新媒体文案、脚本策划与短视频运营；获“优秀实习生”称号。",
        left_x,
        y_left,
        left_w,
    )
    y_left -= 4

    c.setFont("ArialBold", 6.2)
    c.setFillColor(ACID)
    c.drawString(left_x, y_left, "2023.07—2024.03")
    c.setFont("CN", 9.5)
    c.setFillColor(INK)
    c.drawString(left_x + 83, y_left, "南京欧拉文化传播有限公司｜音乐商务实习")
    y_left -= 14
    y_left = draw_bullet(
        c,
        "对接艺人及创作者，协助歌词交易沟通；在一项综艺商用未署名事件中整理作品、沟通与付款等材料并进行风险复盘。",
        left_x,
        y_left,
        left_w,
    )
    y_left = draw_bullet(
        c,
        "该事项未最终解决；由此形成授权范围、署名、媒介、期限、付款与证据留存的前置检查清单。",
        left_x,
        y_left,
        left_w,
    )
    y_left -= 4

    c.setFont("ArialBold", 6.2)
    c.setFillColor(ACID)
    c.drawString(left_x, y_left, "2025.05")
    c.setFont("CN", 9.5)
    c.setFillColor(INK)
    c.drawString(left_x + 83, y_left, "“南艺 520”｜学生总负责人")
    y_left -= 14
    y_left = draw_bullet(
        c,
        "统筹主题策划、跨学院节目、文案/PPT/LED 大屏、志愿者、后勤及周边发放，跟进全流程落地；获新华社等 20 余家主流媒体报道。",
        left_x,
        y_left,
        left_w,
    )
    y_left -= 8

    y_left = draw_section_title(c, "代表作品", left_x, y_left)
    c.setFont("CN", 9.4)
    c.setFillColor(INK)
    c.drawString(left_x, y_left, "从 16 首 AI 歌曲到可运营曲库｜自主项目")
    y_left -= 14
    y_left = draw_bullet(
        c,
        "完成 16 首可发布 AI 歌曲，覆盖中文流行、爵士、英文运动与庆典场景；保留提示词、歌词与版本材料。",
        left_x,
        y_left,
        left_w,
    )
    y_left = draw_bullet(
        c,
        "设计 Track / Version / Segment / Distribution 四层元数据与 16 维内容评估框架，支持选歌、A/B 版本与场景分发。",
        left_x,
        y_left,
        left_w,
    )
    y_left -= 3
    c.setFont("CN", 9.4)
    c.setFillColor(INK)
    c.drawString(left_x, y_left, "中文新歌与潜力音乐人数据侦察｜自主研究")
    y_left -= 14
    y_left = draw_bullet(
        c,
        "基于公开榜单建立候选池，用榜单、传播、场景、版权就绪度与差异化五维框架标记补数优先级；明确事实、假设和数据缺口。",
        left_x,
        y_left,
        left_w,
    )

    # Right column
    y_right = draw_label(c, "EDUCATION", right_x, y_right, right_w)
    c.setFont("CN", 9.2)
    c.setFillColor(INK)
    c.drawString(right_x, y_right, "南京艺术学院")
    y_right -= 13
    y_right = draw_text(
        c,
        "硕士｜音乐与舞蹈学（流行音乐研究）\n2023—2026｜应届生",
        right_x,
        y_right,
        right_w,
        size=7.2,
        leading=10,
        color=MUTED,
    )
    y_right -= 5
    c.setFont("CN", 9.2)
    c.setFillColor(INK)
    c.drawString(right_x, y_right, "南京艺术学院")
    y_right -= 13
    y_right = draw_text(
        c,
        "本科｜作曲与作曲技术理论\n2016—2020",
        right_x,
        y_right,
        right_w,
        size=7.2,
        leading=10,
        color=MUTED,
    )
    y_right -= 12

    y_right = draw_label(c, "SKILLS", right_x, y_right, right_w)
    for title, body in [
        ("音乐内容", "风格/情绪/场景判断、歌曲策划、曲库标签"),
        ("AI 音乐", "Suno、Mureka、Udio、SOUNDRAW、AIVA、Stable Audio"),
        ("制作工具", "剪映、Logic、Cubase、Office"),
        ("版权基础", "主体/客体、词曲/录音/表演权、许可与转让、署名、信息网络传播"),
        ("数据分析", "基础实践，正在强化"),
    ]:
        c.setFont("CN", 7.6)
        c.setFillColor(INK)
        c.drawString(right_x, y_right, title)
        y_right -= 10
        y_right = draw_text(
            c, body, right_x, y_right, right_w, size=6.7, leading=9.2, color=MUTED
        )
        y_right -= 3
    y_right -= 6

    y_right = draw_label(c, "SELECTED RESEARCH", right_x, y_right, right_w)
    for year, title in [
        ("2025", "《“梗”文化对当代流行音乐形式与内容的塑造研究》"),
        ("2025", "《黑神话：悟空》游戏音乐中的跨媒介叙事与文化认同研究（学位论文）"),
        ("2024", "《流行歌曲创作中“人声器乐化”现象初探》"),
        ("2024", "《人工智能对音乐的影响》"),
    ]:
        c.setFont("ArialBold", 6)
        c.setFillColor(ACID)
        c.drawString(right_x, y_right, year)
        y_right = draw_text(
            c,
            title,
            right_x + 28,
            y_right,
            right_w - 28,
            size=6.7,
            leading=9.2,
            color=MUTED,
        )
        y_right -= 4
    y_right -= 6

    y_right = draw_label(c, "AWARDS & CERTIFICATES", right_x, y_right, right_w)
    awards = [
        "研究生学业奖学金一等奖（Top 5%）",
        "研究生学业奖学金二等奖",
        "南京艺术学院优秀研究生",
        "谢海燕奖学金",
        "江苏省委组织部“优秀实习生”",
        "CET-6｜普通话二甲｜高中音乐教师资格证",
    ]
    for item in awards:
        y_right = draw_bullet(
            c, item, right_x, y_right, right_w, size=6.65, leading=9.2
        )

    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(left_x + left_w + gap / 2, H - banner_h - 24, left_x + left_w + gap / 2, 28)
    c.setFont("Arial", 5.7)
    c.setFillColor(HexColor("#99958D"))
    c.drawRightString(W - margin, 17, "PORTFOLIO: PUBLIC LINK PROVIDED WITH APPLICATION · 2026.07")
    c.save()
    return path


def draw_plan_header(c, day, title, subtitle):
    c.setFillColor(INK)
    c.rect(0, H - 134, W, 134, fill=1, stroke=0)
    c.setFillColor(ACID)
    c.setFont("ArialBold", 7)
    c.drawString(35, H - 31, f"CASSIE'S 2-DAY MUSIC OPS CRAM PLAN / {day}")
    c.setFillColor(white)
    c.setFont("CNSong", 28)
    c.drawString(35, H - 70, title)
    c.setFont("CN", 8)
    c.setFillColor(HexColor("#B9B5AC"))
    c.drawString(35, H - 96, subtitle)
    c.setFont("Arial", 6.3)
    c.drawString(35, H - 116, "8—10 HOURS · OUTPUT-DRIVEN · INTERVIEW-READY")
    return H - 160


def draw_time_block(c, y, time, title, goal, tasks, deliverable, accent=ACID):
    x = 35
    total_w = W - 70
    c.setStrokeColor(LINE)
    c.setFillColor(white)
    block_h = 122
    c.roundRect(x, y - block_h, total_w, block_h, 8, fill=1, stroke=1)
    c.setFillColor(accent)
    c.roundRect(x, y - block_h, 8, block_h, 8, fill=1, stroke=0)
    c.rect(x + 4, y - block_h, 4, block_h, fill=1, stroke=0)

    c.setFont("ArialBold", 7)
    c.setFillColor(accent)
    c.drawString(x + 19, y - 20, time)
    c.setFont("CN", 13)
    c.setFillColor(INK)
    c.drawString(x + 95, y - 22, title)
    c.setFont("CN", 7.2)
    c.setFillColor(MUTED)
    c.drawString(x + 95, y - 38, goal)

    task_x = x + 19
    task_y = y - 57
    for task in tasks:
        task_y = draw_bullet(
            c,
            task,
            task_x,
            task_y,
            total_w - 42,
            size=7.05,
            leading=9.6,
            bullet_color=accent,
        )
    c.setFillColor(SOFT)
    c.roundRect(x + 19, y - block_h + 12, total_w - 38, 18, 4, fill=1, stroke=0)
    c.setFont("CN", 6.7)
    c.setFillColor(MUTED)
    c.drawString(x + 28, y - block_h + 18, f"交付物｜{deliverable}")
    return y - block_h - 13


def draw_footer(c, page, note):
    c.setStrokeColor(LINE)
    c.line(35, 35, W - 35, 35)
    c.setFont("CN", 6.3)
    c.setFillColor(MUTED)
    c.drawString(35, 22, note)
    c.setFont("ArialBold", 6.3)
    c.drawRightString(W - 35, 22, f"0{page} / 02")


def build_cram_plan():
    path = OUT / "Cassie_2-Day_Music_Ops_Cram_Plan.pdf"
    c = canvas.Canvas(str(path), pagesize=A4)
    c.setTitle("查文鑫｜两天音乐内容运营突击清单")
    c.setAuthor("查文鑫 Cassie Zha")

    # Day 1
    y = draw_plan_header(
        c,
        "DAY 01",
        "补齐版权骨架，建立数据语言",
        "目标：能把真实案例讲清楚，并用一张表完成歌曲初筛。",
    )
    y = draw_time_block(
        c,
        y,
        "09:00—12:30",
        "音乐版权：从权利层到授权单",
        "先会识别问题，再学习专业术语。",
        [
            "通读《著作权法》：作品、作者、署名权，复制/发行/表演/信息网络传播等权利；重点看许可使用与转让合同。",
            "画出三层对象：词曲作品｜录音制品｜表演；给每层写出常见权利主体与所需材料。",
            "用“综艺商用未署名”事件练习：事实—缺口—风险—下一步，绝不表述为已解决或法律结论。",
        ],
        "1 页权利链图 + 1 份授权前置检查清单 + 90 秒案例讲稿",
    )
    y = draw_time_block(
        c,
        y,
        "13:30—17:30",
        "音乐数据：从指标到选歌决策",
        "不追求复杂建模，先掌握正确的业务判断顺序。",
        [
            "建立“曝光→点击/播放→完播→收藏/分享→关注/转化”漏斗，写清每项指标的分母。",
            "为 10 首公开榜单歌曲建表：排名、在榜周期、平台、艺人类型、场景、高光片段、UGC 线索、版权信息、数据缺口。",
            "练习三条结论模板：已知事实｜分析假设｜还需要什么数据；禁止用单个榜单名次直接宣布爆款。",
        ],
        "10 首观察池表格 + 3 条证据化判断 + 1 个补数优先级",
    )
    y = draw_time_block(
        c,
        y,
        "19:00—21:00",
        "岗位语言：把经历翻译成 TME 能力",
        "每段经历只回答“我做了什么、如何判断、结果/边界是什么”。",
        [
            "准备 5 个 STAR：1000+ 内容审核、欧拉版权事件、南艺 520、16 首 AI 曲库、AI 短视频。",
            "逐条对齐岗位：数据侦察｜音乐人评估与沟通｜内容全流程｜版权商务支持。",
            "录音两遍自我介绍：60 秒版与 120 秒版；删掉“我不熟”“数据很少”等自我否定表达。",
        ],
        "5 张 STAR 卡 + 60/120 秒自我介绍音频",
    )
    draw_footer(c, 1, "学习资料以官方法律文本为准；清单用于面试准备，不构成法律意见。")
    c.showPage()

    # Day 2
    y = draw_plan_header(
        c,
        "DAY 02",
        "完成证据包，进行投递演练",
        "目标：把网站、简历、案例和面试表达连成同一套可信叙事。",
    )
    y = draw_time_block(
        c,
        y,
        "09:00—12:00",
        "作品集证据：补最值钱的三类",
        "只补能改变招聘判断的材料，不做低价值美化。",
        [
            "南艺 520：整理 3—5 张新闻/现场截图，标注媒体、日期、本人职责；替换网站证据位。",
            "AI 曲库：为 5 首代表作补提示词、版本对照和 30 秒高光时间码；统一文件命名。",
            "内容运营：选 1 篇公众号或小红书文章完成终稿，保留选题、结构、配图与发布版本。",
        ],
        "南艺证据包 + 5 首歌曲卡 + 1 篇可公开文章",
    )
    y = draw_time_block(
        c,
        y,
        "13:00—16:00",
        "面试模拟：版权、数据与协作",
        "用追问验证边界意识，而不是背答案。",
        [
            "版权追问：当对方说“已买断”时，你要确认哪些对象、权利、媒介、期限、地区与署名事项？",
            "数据追问：一首歌播放高但收藏低，你会如何判断；哪些数据不足以支持签约？",
            "协作追问：音乐人不回消息、节目临时变更、审核量激增时，如何排优先级并留痕？",
        ],
        "12 道问答卡 + 3 段两分钟录音 + 1 轮自我复盘",
    )
    y = draw_time_block(
        c,
        y,
        "16:30—21:00",
        "定向投递：岗位拆解与版本管理",
        "每次投递做轻定制，不改动事实。",
        [
            "建立投递表：公司、岗位、城市、截止时间、JD 关键词、简历版本、作品集链接、跟进状态。",
            "按岗位切换前三项：内容岗突出曲库/审核；版权岗突出权利链/沟通；音乐人运营突出侦察/协同。",
            "先完成 8—12 个高匹配投递，再扩展到北京、上海、深圳、杭州的音乐平台、厂牌、版权公司与内容团队。",
        ],
        "投递追踪表 + 3 版开场摘要 + 8—12 个高匹配投递",
    )
    draw_footer(c, 2, "优先级：证据可信度 > 岗位匹配度 > 视觉完善度 > 发布数量。")
    c.save()
    return path


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    register_fonts()
    resume = build_resume()
    plan = build_cram_plan()
    print(resume)
    print(plan)
