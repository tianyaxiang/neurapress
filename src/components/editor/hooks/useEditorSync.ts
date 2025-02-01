import { useCallback, useRef } from 'react'

export function useEditorSync(editorRef: React.RefObject<HTMLDivElement>) {
  // 防止滚动事件循环的标志
  const isScrolling = useRef(false)

  // 同步滚动处理
  const handleScroll = useCallback((event: React.UIEvent<HTMLTextAreaElement>) => {
    if (!editorRef.current || isScrolling.current) return
    isScrolling.current = true

    try {
      const textarea = event.currentTarget
      const previewContainer = editorRef.current.parentElement?.querySelector('.preview-container')
      if (!previewContainer) return

      const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
      const previewScrollTop = scrollPercentage * (previewContainer.scrollHeight - previewContainer.clientHeight)
      
      previewContainer.scrollTop = previewScrollTop
    } finally {
      // 确保在下一帧重置标志
      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }
  }, [editorRef])

  return { handleScroll }
} 