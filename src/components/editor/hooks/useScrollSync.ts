import { useCallback, useRef } from 'react'

export const useScrollSync = () => {
  const isScrolling = useRef<boolean>(false)
  const scrollTimeout = useRef<NodeJS.Timeout>()

  const handleEditorScroll = useCallback((e: React.UIEvent<HTMLTextAreaElement>) => {
    if (isScrolling.current) return
    
    const textarea = e.currentTarget
    const previewContainer = document.querySelector('.preview-container')?.querySelector('.flex-1.overflow-y-auto')
    if (!previewContainer) return

    isScrolling.current = true

    try {
      const scrollPercentage = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight)
      const targetScrollTop = scrollPercentage * (previewContainer.scrollHeight - previewContainer.clientHeight)
      
      previewContainer.scrollTop = targetScrollTop
    } finally {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 50)
    }
  }, [])

  const handlePreviewScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    if (isScrolling.current) return
    
    const previewContainer = e.currentTarget
    const textarea = document.querySelector('.editor-container textarea')
    if (!textarea) return

    isScrolling.current = true

    try {
      const scrollPercentage = previewContainer.scrollTop / (previewContainer.scrollHeight - previewContainer.clientHeight)
      const targetScrollTop = scrollPercentage * (textarea.scrollHeight - textarea.clientHeight)
      
      textarea.scrollTop = targetScrollTop
    } finally {
      if (scrollTimeout.current) {
        clearTimeout(scrollTimeout.current)
      }
      scrollTimeout.current = setTimeout(() => {
        isScrolling.current = false
      }, 50)
    }
  }, [])

  return { handleEditorScroll, handlePreviewScroll }
} 