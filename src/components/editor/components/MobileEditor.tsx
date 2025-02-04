'use client'

import { type RefObject } from 'react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Copy } from 'lucide-react'
import { EditorPreview } from './EditorPreview'
import { type PreviewSize } from '../constants'
import { type CodeThemeId } from '@/config/code-themes'

interface MobileEditorProps {
  textareaRef: RefObject<HTMLTextAreaElement>
  previewRef: RefObject<HTMLDivElement>
  value: string
  selectedTemplate: string
  previewSize: PreviewSize
  codeTheme: CodeThemeId
  previewContent: string
  isConverting: boolean
  onValueChange: (value: string) => void
  onEditorChange: (value: string) => void
  onEditorScroll: (e: React.UIEvent<HTMLTextAreaElement>) => void
  onPreviewSizeChange: (size: PreviewSize) => void
  onCopy: () => Promise<boolean>
}

export function MobileEditor({
  textareaRef,
  previewRef,
  value,
  selectedTemplate,
  previewSize,
  codeTheme,
  previewContent,
  isConverting,
  onValueChange,
  onEditorChange,
  onEditorScroll,
  onPreviewSizeChange,
  onCopy
}: MobileEditorProps) {
  return (
    <div className="md:hidden h-full">
      <Tabs defaultValue="edit" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">编辑</TabsTrigger>
          <TabsTrigger value="preview">预览</TabsTrigger>
        </TabsList>
        <TabsContent 
          value="edit" 
          className="flex-1 hidden data-[state=active]:flex flex-col"
        >
          <div className="relative flex-1">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={e => {
                const scrollTop = e.target.scrollTop;
                onValueChange(e.target.value)
                onEditorChange(e.target.value)
                // 保持滚动位置
                requestAnimationFrame(() => {
                  if (textareaRef.current) {
                    textareaRef.current.scrollTop = scrollTop;
                  }
                });
              }}
              onScroll={e => {
                if (textareaRef.current) {
                  onEditorScroll(e)
                }
              }}
              className="absolute inset-0 w-full h-full resize-none border-0 bg-background p-4 focus:outline-none"
              placeholder="开始写作..."
            />
          </div>
        </TabsContent>
        <TabsContent 
          value="preview" 
          className="flex-1 hidden data-[state=active]:flex flex-col"
        >
          <div className="relative flex-1">
            
            <EditorPreview
              previewRef={previewRef}
              selectedTemplate={selectedTemplate}
              previewSize={previewSize}
              isConverting={isConverting}
              previewContent={previewContent}
              codeTheme={codeTheme}
              showToolbar={false}
              onPreviewSizeChange={onPreviewSizeChange}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 