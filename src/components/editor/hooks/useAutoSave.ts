import { useCallback, useEffect, useRef } from 'react'
import { AUTO_SAVE_DELAY } from '../constants'

export function useAutoSave(value: string, setIsDraft: (isDraft: boolean) => void) {
  const autoSaveTimerRef = useRef<NodeJS.Timeout>()

  const handleEditorChange = useCallback((v: string) => {
    setIsDraft(true)
    
    // 清除之前的定时器
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    
    // 设置新的自动保存定时器
    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem('wechat_editor_draft', v)
      setIsDraft(false)
    }, AUTO_SAVE_DELAY)
  }, [setIsDraft])

  // 清理自动保存定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

  return { handleEditorChange }
} 