import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function escapeXml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

const covers = [
  {
    input: "public/images/covers/blue-night-v2.png",
    output: "public/images/covers/blue-night-v3.jpg",
    number: "01",
    title: "蓝调夜行",
    english: "BLUE NIGHT / URBAN BLUES",
    titleSize: 72,
  },
  {
    input: "public/images/covers/rain-old-platform-v2.png",
    output: "public/images/covers/rain-old-platform-v3.jpg",
    number: "02",
    title: "雨停在旧站台",
    english: "AFTER THE RAIN / POP BALLAD",
    titleSize: 60,
  },
  {
    input: "public/images/covers/unsent-goodnight-v2.png",
    output: "public/images/covers/unsent-goodnight-v3.jpg",
    number: "06",
    title: "未发送的晚安",
    english: "UNSENT GOODNIGHT / MIDNIGHT MESSAGE",
    titleSize: 60,
  },
  {
    input: "public/images/covers/name-in-wind-v2.png",
    output: "public/images/covers/name-in-wind-v3.jpg",
    number: "11",
    chapter: "POETIC NATURE",
    title: "把名字写进风里",
    english: "WRITE MY NAME IN THE WIND / AIRY POP",
    titleSize: 56,
    theme: "light",
  },
  {
    input: "public/images/covers/moon-no-reply-v2.png",
    output: "public/images/covers/moon-no-reply-v3.jpg",
    number: "12",
    chapter: "POETIC NATURE",
    title: "月亮没有回信",
    english: "NO REPLY FROM THE MOON / LUNAR BALLAD",
    titleSize: 58,
    theme: "light",
    align: "right",
  },
  {
    input: "public/images/covers/glass-sea-v2.png",
    output: "public/images/covers/glass-sea-v3.jpg",
    number: "15",
    chapter: "POETIC NATURE",
    title: "玻璃海",
    english: "GLASS SEA / AMBIENT POP",
    titleSize: 72,
    theme: "light",
    align: "right",
  },
  {
    input: "public/images/covers/run-into-thunder-v2.png",
    output: "public/images/covers/run-into-thunder-v3.jpg",
    number: "04",
    chapter: "FORWARD MOTION",
    title: "RUN INTO THE THUNDER",
    english: "ENGLISH ROCK / HIGH-ENERGY ANTHEM",
    titleSize: 49,
    titleFamily: "Helvetica Neue, Arial, sans-serif",
    titleTracking: 1.2,
    align: "right",
  },
  {
    input: "public/images/covers/grow-against-light-v2.png",
    output: "public/images/covers/grow-against-light-v3.jpg",
    number: "10",
    chapter: "FORWARD MOTION",
    title: "逆着光生长",
    english: "GROWING AGAINST THE LIGHT / UPLIFTING POP",
    titleSize: 62,
    align: "right",
  },
  {
    input: "public/images/covers/still-on-road-v2.png",
    output: "public/images/covers/still-on-road-v3.jpg",
    number: "16",
    chapter: "FORWARD MOTION",
    title: "仍在路上",
    english: "STILL ON THE ROAD / FORWARD",
    titleSize: 68,
    theme: "light",
  },
  {
    input: "public/images/covers/gold-on-floor-v2.png",
    output: "public/images/covers/gold-on-floor-v3.jpg",
    number: "05",
    chapter: "STAGE & GROOVE",
    title: "GOLD ON THE FLOOR",
    english: "DANCE POP / KINETIC GROOVE",
    titleSize: 48,
    titleFamily: "Helvetica Neue, Arial, sans-serif",
    titleTracking: 1.4,
    align: "right",
  },
  {
    input: "public/images/covers/unsent-goodnight-illustrated-v2.png",
    output: "public/images/covers/unsent-goodnight-v4.jpg",
    number: "06",
    chapter: "NIGHT CITY",
    title: "未发送的晚安",
    english: "UNSENT GOODNIGHT / MIDNIGHT MESSAGE",
    titleSize: 58,
    theme: "light",
  },
  {
    input: "public/images/covers/night-to-morning-v2.png",
    output: "public/images/covers/night-to-morning-v3.jpg",
    number: "08",
    chapter: "NIGHT TO DAWN",
    title: "把夜走成清晨",
    english: "WALK THE NIGHT INTO DAWN",
    titleSize: 58,
  },
  {
    input: "public/images/covers/century-new-chapter-v2.png",
    output: "public/images/covers/century-new-chapter-v3.jpg",
    number: "09",
    chapter: "CULTURAL FUSION",
    title: "百年新章",
    english: "A NEW CENTURY / CEREMONIAL",
    titleSize: 68,
    theme: "light",
  },
  {
    input: "public/images/covers/swinging-hard-v2.png",
    output: "public/images/covers/swinging-hard-v3.jpg",
    number: "13",
    chapter: "STAGE & GROOVE",
    title: "SWINGING HARD",
    english: "BRASS & GROOVE / LATE NIGHT",
    titleSize: 54,
    titleFamily: "Helvetica Neue, Arial, sans-serif",
    titleTracking: 1.8,
    align: "right",
  },
];

for (const cover of covers) {
  const lightTheme = cover.theme === "light";
  const rightAligned = cover.align === "right";
  const textColor = lightTheme ? "#25292a" : "#f2f0e8";
  const fadeColor = lightTheme ? "#f7f0e2" : "#07111c";
  const bottomFadeColor = lightTheme ? "#f5ede1" : "#030812";
  const anchor = rightAligned ? "end" : "start";
  const titleX = rightAligned ? 1184 : 70;
  const lineX1 = rightAligned ? 1080 : 70;
  const lineX2 = rightAligned ? 1184 : 174;
  const chapter = escapeXml(cover.chapter ?? "NIGHT CITY");
  const title = escapeXml(cover.title);
  const english = escapeXml(cover.english);
  const overlay = Buffer.from(`
    <svg width="1254" height="1254" viewBox="0 0 1254 1254" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topFade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="${fadeColor}" stop-opacity="${lightTheme ? ".54" : ".62"}"/>
          <stop offset=".68" stop-color="${fadeColor}" stop-opacity="${lightTheme ? ".10" : ".16"}"/>
          <stop offset="1" stop-color="${fadeColor}" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="bottomFade" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stop-color="${bottomFadeColor}" stop-opacity="${lightTheme ? ".52" : ".62"}"/>
          <stop offset="1" stop-color="${bottomFadeColor}" stop-opacity="0"/>
        </linearGradient>
        <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
          <feOffset dy="2"/>
          <feComponentTransfer><feFuncA type="linear" slope=".7"/></feComponentTransfer>
          <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width="1254" height="310" fill="url(#topFade)"/>
      <rect y="1040" width="1254" height="214" fill="url(#bottomFade)"/>

      <g fill="${textColor}" ${lightTheme ? "" : "filter=\"url(#softShadow)\""}>
        <text x="${titleX}" y="65" text-anchor="${anchor}"
          font-family="Helvetica Neue, Arial, sans-serif"
          font-size="16" font-weight="500" letter-spacing="4.6"
          opacity=".84">${cover.number} / ${chapter}</text>
        <line x1="${lineX1}" y1="92" x2="${lineX2}" y2="92" stroke="${textColor}" stroke-width="1" opacity=".62"/>
        <text x="${titleX}" y="174" text-anchor="${anchor}"
          font-family="${cover.titleFamily ?? "Hiragino Sans GB, PingFang SC, sans-serif"}"
          font-size="${cover.titleSize}" font-weight="600" letter-spacing="${cover.titleTracking ?? 7}">${title}</text>
        <text x="${rightAligned ? 1181 : 73}" y="220" text-anchor="${anchor}"
          font-family="Helvetica Neue, Arial, sans-serif"
          font-size="18" font-weight="500" letter-spacing="3.8"
          opacity=".82">${english}</text>
      </g>

      <g fill="${textColor}" font-family="Helvetica Neue, Arial, sans-serif"
        font-size="15" font-weight="500" letter-spacing="3.8" opacity=".78">
        <text x="70" y="1190">CASSIE / AI MUSIC ARCHIVE</text>
        <text x="1184" y="1190" text-anchor="end">${cover.number} / 16</text>
      </g>
    </svg>
  `);

  await sharp(path.join(root, cover.input))
    .composite([{ input: overlay, top: 0, left: 0 }])
    .jpeg({ quality: 91, chromaSubsampling: "4:4:4", progressive: true })
    .toFile(path.join(root, cover.output));
}
