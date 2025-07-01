'use client'

import { Textarea } from '@/components/ui/textarea'
import { XiaohongshuMarkdownToolbar } from './XiaohongshuMarkdownToolbar'

interface XiaohongshuEditorProps {
  markdown: string
  textareaRef: React.RefObject<HTMLTextAreaElement>
  onTextChange: (value: string) => void
  onToolbarInsert: (text: string, options?: { wrap?: boolean; placeholder?: string; suffix?: string }) => void
}

export function XiaohongshuEditor({
  markdown,
  textareaRef,
  onTextChange,
  onToolbarInsert,
}: XiaohongshuEditorProps) {
  return (
    <div className="w-1/2 flex flex-col border-r">
      {/* Markdown工具栏 */}
      <XiaohongshuMarkdownToolbar onInsert={onToolbarInsert} />

      <div className="flex-1">
        <Textarea
          ref={textareaRef}
          value={markdown}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder="在这里输入你的Markdown内容..."
          className="h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm rounded-none"
        />
      </div>
    </div>
  )
} 