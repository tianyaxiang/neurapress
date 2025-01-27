'use client'

import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import { useState } from 'react'
import { templates } from '@/config/wechat-templates'
import { cn } from '@/lib/utils'
import { Copy, Smartphone } from 'lucide-react'
import { WechatStylePicker } from '../template/WechatStylePicker'
import { StyleConfigDialog } from './StyleConfigDialog'
import { convertToWechat } from '@/lib/markdown'
import { type RendererOptions } from '@/lib/markdown'
import { TemplateManager } from '../template/TemplateManager'
import 'bytemd/dist/index.css'

const plugins = [
  gfm(),
  highlight(),
]

export default function WechatEditor() {
  const [value, setValue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [showPreview, setShowPreview] = useState(true)
  const [styleOptions, setStyleOptions] = useState<RendererOptions>({})

  const handleEditorChange = (v: any) => {
   
    if (typeof v === 'string') { 
      setValue(v)
    } else if (v?.value && typeof v.value === 'string') {
      setValue(v.value)
    } else {
      console.warn('Unexpected editor value:', v)
      setValue('')
    }
  }

  const getPreviewContent = () => {
    if (!value) return ''
    
    const template = templates.find(t => t.id === selectedTemplate)
    const mergedOptions = {
      ...styleOptions,
      ...(template?.options || {})
    }
    
    const html = convertToWechat(value, mergedOptions)
    if (!template?.transform) return html
    
    try {
      const transformed = template.transform(html)
      if (transformed && typeof transformed === 'object') {
        const result = transformed as { html?: string; content?: string }
        if (result.html) return result.html
        if (result.content) return result.content
        return JSON.stringify(transformed)
      }
      return transformed || html
    } catch (error) {
      console.error('Template transformation error:', error)
      return html
    }
  }

  const copyContent = () => {
    const content = getPreviewContent()
    navigator.clipboard.writeText(content)
      .then(() => alert('内容已复制到剪贴板'))
      .catch(err => console.error('复制失败:', err))
  }

  const handleTemplateChange = () => {
    setValue(value)
  }

  const handleCopy = () => {
    const previewContent = document.querySelector('.preview-content')
    if (!previewContent) return

    // 创建一个临时容器来保持样式
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = previewContent.innerHTML
    
    // 复制计算后的样式
    const styles = window.getComputedStyle(previewContent)
    const importantStyles = {
      'font-family': styles.fontFamily,
      'font-size': styles.fontSize,
      'color': styles.color,
      'line-height': styles.lineHeight,
      'text-align': styles.textAlign,
      'white-space': styles.whiteSpace,
      'margin': styles.margin,
      'padding': styles.padding
    }
    
    // 应用样式到临时容器
    Object.assign(tempDiv.style, importantStyles)
    
    // 将临时容器添加到文档中（隐藏）
    tempDiv.style.position = 'fixed'
    tempDiv.style.left = '-9999px'
    document.body.appendChild(tempDiv)
    
    // 创建选区并复制
    const range = document.createRange()
    range.selectNode(tempDiv)
    const selection = window.getSelection()
    if (selection) {
      selection.removeAllRanges()
      selection.addRange(range)
      
      try {
        document.execCommand('copy')
        alert('预览内容（带格式）已复制到剪贴板')
      } catch (err) {
        console.error('复制失败:', err)
      }
      
      selection.removeAllRanges()
    }
    
    // 清理临时元素
    document.body.removeChild(tempDiv)
  }

  return (
    <div>
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <WechatStylePicker 
              value={selectedTemplate} 
              onSelect={setSelectedTemplate} 
            />
            <TemplateManager onTemplateChange={handleTemplateChange} />
            <StyleConfigDialog
              value={styleOptions}
              onChange={setStyleOptions}
            />
            <button
              onClick={() => setShowPreview(!showPreview)}
              className={cn(
                "inline-flex items-center gap-1.5 px-3 py-2 rounded-md text-sm",
                showPreview 
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              <Smartphone className="h-4 w-4" />
              预览
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={copyContent}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <Copy className="h-4 w-4" />
              复制源码
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm"
            >
              <Copy className="h-4 w-4" />
              复制预览
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex">
        <div className={cn(
          "border-r bg-white transition-all duration-200",
          showPreview ? "w-1/2" : "w-full",
          selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
        )}>
          <div className="h-[calc(100vh-140px)] overflow-auto">
            <Editor
              value={value}
              plugins={plugins}
              onChange={handleEditorChange}
              editorConfig={{
                mode: 'split'
              }}
            />
          </div>
        </div>

        {showPreview && (
          <div className="w-1/2 bg-gray-50">
            <div className="sticky top-0 border-b bg-white p-3 z-10">
              <div className="mx-auto w-8 h-1 bg-gray-200 rounded-full" />
            </div>
            <div className="p-6 preview-container" style={{ height: 'calc(100vh - 140px)', overflowY: 'auto' }}>
              <div className="max-w-[375px] mx-auto bg-white shadow-sm rounded-lg">
                <div className={cn(
                  "prose max-w-none p-4",
                  selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
                )}>
                  <div 
                    dangerouslySetInnerHTML={{ __html: getPreviewContent() }}
                    className="preview-content"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}