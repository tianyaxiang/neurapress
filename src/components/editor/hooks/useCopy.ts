'use client'

import { useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { initializeMermaid } from '@/lib/markdown/mermaid-utils'

export const useCopy = () => {
  const { toast } = useToast()

  const copyToClipboard = useCallback(async (contentElement: HTMLElement | null) => {
    if (!contentElement) return false

    try {
      // 创建临时容器并渲染内容
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = contentElement.innerHTML
      document.body.appendChild(tempDiv)

      // 处理 Mermaid 图表
      const mermaidElements = tempDiv.querySelectorAll('.mermaid')
      if (mermaidElements.length > 0) {
        // 重新初始化 Mermaid
        await initializeMermaid()
        // 等待渲染完成
        await new Promise(resolve => setTimeout(resolve, 100))
      }

      // 获取处理后的内容
      const processedContent = tempDiv.innerHTML
      const plainText = tempDiv.textContent || ''

      try {
        // 使用 Clipboard API 写入富文本
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/html': new Blob([processedContent], { type: 'text/html' }),
            'text/plain': new Blob([plainText], { type: 'text/plain' })
          })
        ])
      } catch (error) {
        // 降级处理：尝试以纯文本方式复制
        await navigator.clipboard.writeText(plainText)
      }

      // 清理临时 div
      document.body.removeChild(tempDiv)
      return true
    } catch (error) {
      console.error('Failed to copy content:', error)
      return false
    }
  }, [])

  const handleCopy = useCallback(async (selection: Selection | null, content: string) => {
    try {
      // 如果有选中的文本，使用选中的内容
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0)
        const container = range.cloneContents()
        const div = document.createElement('div')
        div.appendChild(container)
        return await copyToClipboard(div)
      }

      // 否则复制整个内容
      return await copyToClipboard(document.getElementById(content))
    } catch (error) {
      console.error('Handle copy error:', error)
      return false
    }
  }, [copyToClipboard])

  return {
    handleCopy,
    copyToClipboard
  }
} 