import { useCallback, useEffect, useRef } from 'react'

export function useEditorSync(editorRef: React.RefObject<HTMLDivElement>) {
  // 防止滚动事件循环的标志
  const isScrolling = useRef(false)

  // 同步滚动处理
  const handleScroll = useCallback((event: Event) => {
    const source = event.target
    // 检查是否是编辑器滚动
    const isEditor = source instanceof Element && source.closest('.editor-container')
    
    if (!editorRef.current) return
    
    const editorElement = editorRef.current.querySelector('.bytemd-editor')
    if (!editorElement) return
    
    // 防止滚动事件循环
    if (isScrolling.current) return
    isScrolling.current = true
    
    try {
      if (isEditor) {
        const sourceScrollTop = (source as Element).scrollTop
        const sourceMaxScroll = (source as Element).scrollHeight - (source as Element).clientHeight
        const percentage = sourceScrollTop / sourceMaxScroll
        
        const windowMaxScroll = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({
          top: percentage * windowMaxScroll,
          behavior: 'auto'
        })
      } else {
        const windowScrollTop = window.scrollY
        const windowMaxScroll = document.documentElement.scrollHeight - window.innerHeight
        const percentage = windowScrollTop / windowMaxScroll
        
        const targetScrollTop = percentage * (editorElement.scrollHeight - editorElement.clientHeight)
        editorElement.scrollTop = targetScrollTop
      }
    } finally {
      // 确保在下一帧重置标志
      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }
  }, [editorRef])

  // 添加滚动事件监听
  useEffect(() => {
    const editorElement = editorRef.current?.querySelector('.bytemd-editor')
    
    if (editorElement) {
      editorElement.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        editorElement.removeEventListener('scroll', handleScroll)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  return { handleScroll }
} 