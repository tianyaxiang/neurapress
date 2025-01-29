import { useCallback, useEffect, useRef } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { AUTO_SAVE_DELAY } from '../constants'

export function useAutoSave(value: string, setIsDraft: (isDraft: boolean) => void) {
  const { toast } = useToast()
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
      toast({
        description: "内容已自动保存",
        duration: 2000
      })
    }, AUTO_SAVE_DELAY)
  }, [toast, setIsDraft])

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