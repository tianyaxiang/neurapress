import { useState, useEffect } from 'react'
import { convertToWechat } from '@/lib/markdown'

// 计算阅读时间（假设每分钟阅读300字）
const calculateReadingTime = (text: string): string => {
  const words = text.trim().length
  const minutes = Math.ceil(words / 300)
  return `${minutes} 分钟`
}

// 计算字数
const calculateWordCount = (text: string): string => {
  const count = text.trim().length
  return count.toLocaleString()
}

// 从 HTML 中提取纯文本
const extractTextFromHtml = (html: string): string => {
  // 创建一个临时的 div 元素
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = html
  // 获取纯文本内容
  return tempDiv.textContent || ''
}

export const useWordStats = (content: string) => {
  const [wordCount, setWordCount] = useState('0')
  const [readingTime, setReadingTime] = useState('1 分钟')

  useEffect(() => {
    // 首先将 Markdown 转换为 HTML
    const html = convertToWechat(content, {})
    // 从 HTML 中提取纯文本
    const plainText = extractTextFromHtml(html)
    // 计算字数和阅读时间
    setWordCount(calculateWordCount(plainText))
    setReadingTime(calculateReadingTime(plainText))
  }, [content])

  return { wordCount, readingTime }
} 