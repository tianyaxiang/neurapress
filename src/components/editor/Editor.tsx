'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { useState } from 'react'
import { TemplateSelector } from '../template/TemplateSelector'
import { cn } from '@/lib/utils'

const templates = [
  {
    id: 'wechat',
    transform: (html: string) => html, // Add your transform logic here
    styles: 'wechat-specific-styles'
  }
  // Add more templates as needed
]

const Editor = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [preview, setPreview] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: '<p>开始编辑...</p>',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px]',
      },
    },
  })

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId)
  }

  const getPreviewContent = () => {
    if (!editor || !selectedTemplate) return ''
    const template = templates.find(t => t.id === selectedTemplate)
    if (!template) return editor.getHTML()
    return template.transform(editor.getHTML())
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <TemplateSelector onSelect={handleTemplateSelect} />
        <button
          onClick={() => setPreview(!preview)}
          className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {preview ? '编辑' : '预览'}
        </button>
      </div>
      
      <div className="border rounded-lg p-4">
        {preview ? (
          <div className={cn(
            "prose max-w-none",
            selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
          )}>
            <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
          </div>
        ) : (
          <EditorContent editor={editor} />
        )}
      </div>
    </div>
  )
}

export default Editor 