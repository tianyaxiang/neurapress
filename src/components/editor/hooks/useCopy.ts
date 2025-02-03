import { useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { initializeMermaid } from '@/lib/markdown/mermaid-utils'

export const useCopy = () => {
  const { toast } = useToast()

  const copyToClipboard = useCallback(async (content: string) => {
    try {
      // 创建临时容器并渲染内容
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = content
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

      // 清理临时 div
      document.body.removeChild(tempDiv)

      // 使用 Clipboard API 写入富文本
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([processedContent], { type: 'text/html' }),
          'text/plain': new Blob([content.replace(/<[^>]+>/g, '')], { type: 'text/plain' })
        })
      ])

      toast({
        title: "复制成功",
        description: "内容已复制，可直接粘贴到公众号编辑器",
        duration: 2000
      })
      return true
    } catch (error) {
      console.error('Copy error:', error)
      try {
        // 降级处理：尝试以纯文本方式复制
        await navigator.clipboard.writeText(content.replace(/<[^>]+>/g, ''))
        toast({
          title: "复制成功",
          description: "已复制为纯文本内容",
          duration: 2000
        })
        return true
      } catch (fallbackError) {
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "无法访问剪贴板，请检查浏览器权限",
          duration: 2000
        })
        return false
      }
    }
  }, [toast])

  const handleCopy = useCallback(async (selection: Selection | null, content: string) => {
    try {
      // 如果有选中的文本，使用选中的内容
      if (selection && !selection.isCollapsed) {
        const range = selection.getRangeAt(0)
        const container = range.cloneContents()
        const div = document.createElement('div')
        div.appendChild(container)
        return await copyToClipboard(div.innerHTML)
      }

      // 否则复制整个内容
      return await copyToClipboard(content)
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