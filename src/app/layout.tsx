import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NeuraPress - 专业的内容转换工具",
  description: "将 Markdown 转换为微信公众号和小红书样式的专业工具",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className={cn(
        inter.className,
        "h-full bg-gray-50 antialiased"
      )}>
        {children}
      </body>
    </html>
  );
} 