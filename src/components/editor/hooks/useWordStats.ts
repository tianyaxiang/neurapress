import { useState, useEffect } from 'react'

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

export const useWordStats = (content: string) => {
  const [wordCount, setWordCount] = useState('0')
  const [readingTime, setReadingTime] = useState('1 分钟')

  useEffect(() => {
    const plainText = content.replace(/<[^>]+>/g, '')
    setWordCount(calculateWordCount(plainText))
    setReadingTime(calculateReadingTime(plainText))
  }, [content])

  return { wordCount, readingTime }
} 