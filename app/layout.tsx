import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "查文鑫 Cassie｜音乐内容运营作品集",
    template: "%s｜查文鑫 Cassie",
  },
  description:
    "音乐内容运营、版权与创作者合作、AI 音乐实践。查文鑫的项目作品集与研究档案。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "查文鑫 Cassie｜音乐内容运营作品集",
    description: "用音乐专业判断，让内容进入运营。",
    type: "website",
    images: ["/images/og-cassie-music.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
