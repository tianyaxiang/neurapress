import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function markdownToHtml(markdown: string, template: string) {
  // 这里添加 markdown 转换逻辑
  return markdown
} 