'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Copy, Eye, Pencil } from 'lucide-react'

export default function XiaohongshuEditor() {
  const [preview, setPreview] = useState(false)

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>开始编辑小红书笔记...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] max-w-none',
      },
    },
  })

  const getPreviewContent = () => {
    if (!editor) return ''
    return editor.getHTML()
      .replace(/<h1>/g, '<h1 style="font-size: 20px; font-weight: bold; margin-bottom: 0.5em;">')
      .replace(/<p>/g, '<p style="margin-bottom: 0.8em; color: #222; line-height: 1.6;">')
  }

  const copyContent = () => {
    const content = getPreviewContent()
    navigator.clipboard.writeText(content)
      .then(() => alert('内容已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setPreview(!preview)}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200"
        >
          {preview ? (
            <>
              <Pencil className="h-4 w-4" />
              编辑
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              预览
            </>
          )}
        </button>

        {preview && (
          <button
            onClick={copyContent}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
          >
            <Copy className="h-4 w-4" />
            复制内容
          </button>
        )}
      </div>
      
      <div className={cn(
        "border rounded-lg",
        preview ? "bg-gray-50" : "bg-white"
      )}>
        {preview ? (
          <div className="prose max-w-none xiaohongshu-template p-6">
            <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          </div>
        ) : (
          <div className="p-6">
            <EditorContent editor={editor} />
          </div>
        )}
      </div>
    </div>
  )
} 