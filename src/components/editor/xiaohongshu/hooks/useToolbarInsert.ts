import { useCallback } from 'react'

interface InsertOptions {
  wrap?: boolean
  placeholder?: string
  suffix?: string
}

export function useToolbarInsert(
  markdown: string,
  setMarkdown: (value: string) => void,
  textareaRef: React.RefObject<HTMLTextAreaElement>
) {
  const handleToolbarInsert = useCallback((text: string, options?: InsertOptions) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end)
    const scrollTop = textarea.scrollTop

    let insertText = text
    
    if (options?.wrap) {
      if (selectedText) {
        insertText = text + selectedText + (options.suffix || text)
      } else {
        insertText = text + (options.placeholder || '') + (options.suffix || text)
      }
    } else {
      insertText = text + (selectedText || options?.placeholder || '')
    }

    const newValue = markdown.substring(0, start) + insertText + markdown.substring(end)
    setMarkdown(newValue)

    // 恢复光标位置
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.scrollTop = scrollTop
        if (options?.wrap && !selectedText) {
          const newPos = start + text.length + (options.placeholder?.length || 0)
          textarea.setSelectionRange(newPos, newPos)
        } else {
          const newPos = start + insertText.length
          textarea.setSelectionRange(newPos, newPos)
        }
      }
    }, 0)
  }, [markdown, setMarkdown, textareaRef])

  return { handleToolbarInsert }
} 