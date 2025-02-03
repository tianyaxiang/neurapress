import { useCallback, useRef } from 'react'

export const useScrollSync = () => {
  const isScrolling = useRef<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout>()
  const lastScrollTop = useRef<number>(0)

  const handleEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    // 如果是由于输入导致的滚动，不进行同步
    if (e.currentTarget.selectionStart !== e.currentTarget.selectionEnd) {
      return
    }
    
    if (isScrolling.current) return
    
    const textarea = e.currentTarget
    const previewContainer = document.querySelector('.preview-container .overflow-y-auto')
    if (!previewContainer) return

    // 检查滚动方向和幅度
    const currentScrollTop = textarea.scrollTop
    const scrollDiff = currentScrollTop - lastScrollTop.current
    
    // 如果滚动幅度太小，忽略此次滚动
    if (Math.abs(scrollDiff) < 5) return
    
    isScrolling.current = true
    lastScrollTop.current = currentScrollTop

    try {
      const scrollPercentage = currentScrollTop / (textarea.scrollHeight - textarea.clientHeight)
      const targetScrollTop = scrollPercentage * (previewContainer.scrollHeight - previewContainer.clientHeight)
      
      previewContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'instant'
      })
    } finally {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 50)
    }
  }, [])

  return { handleEditorScroll }
} 