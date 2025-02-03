import { useCallback, useEffect } from 'react'

interface UseEditorKeyboardProps {
  value: string
  onChange: (value: string) => void
  onSave: () => void
}

export const useEditorKeyboard = ({
  value,
  onChange,
  onSave
}: UseEditorKeyboardProps) => {
  // 处理Tab键
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // 插入两个空格作为缩进
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      onChange(newValue)

      // 恢复光标位置
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }, [value, onChange])

  // 监听快捷键保存事件
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        onSave()
      }
    }
    
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [onSave])

  return { handleKeyDown }
} 