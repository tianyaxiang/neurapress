'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { templates } from '@/config/wechat-templates'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { convertToWechat } from '@/lib/markdown'
import { type RendererOptions } from '@/lib/markdown'
import { useEditorSync } from './hooks/useEditorSync'
import { useAutoSave } from './hooks/useAutoSave'
import { EditorToolbar } from './components/EditorToolbar'
import { EditorPreview } from './components/EditorPreview'
import { MarkdownToolbar } from './components/MarkdownToolbar'
import { type PreviewSize } from './constants'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { WechatStylePicker } from '@/components/template/WechatStylePicker'
import { Copy } from 'lucide-react'

export default function WechatEditor() {
  const { toast } = useToast()
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default')
  const [showPreview, setShowPreview] = useState(true)
  const [styleOptions, setStyleOptions] = useState<RendererOptions>({})
  const [previewSize, setPreviewSize] = useState<PreviewSize>('medium')
  const [isConverting, setIsConverting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [cursorPosition, setCursorPosition] = useState<{ start: number; end: number }>({ start: 0, end: 0 })

  // 使用自定义 hooks
  const { handleScroll } = useEditorSync(editorRef)
  const { handleEditorChange } = useAutoSave(value, setIsDraft)

  // 处理编辑器输入
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    handleEditorChange(newValue)
    // 保存光标位置
    setCursorPosition({
      start: e.target.selectionStart,
      end: e.target.selectionEnd
    })
  }, [handleEditorChange])

  // 处理Tab键
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const textarea = e.currentTarget
      const start = textarea.selectionStart
      const end = textarea.selectionEnd

      // 插入两个空格作为缩进
      const newValue = value.substring(0, start) + '  ' + value.substring(end)
      setValue(newValue)
      handleEditorChange(newValue)

      // 恢复光标位置
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2
      })
    }
  }, [value, handleEditorChange])

  // 获取预览内容
  const getPreviewContent = useCallback(() => {
    if (!value) return ''
    
    const template = templates.find(t => t.id === selectedTemplate)
    const mergedOptions: RendererOptions = {
      base: {
        ...(template?.options?.base || {}),
        ...styleOptions.base,
      },
      block: {
        ...(template?.options?.block || {}),
        ...(styleOptions.block || {}),
        // 合并标题样式，保留模版中的其他样式属性
        h1: { 
          ...(template?.options?.block?.h1 || {}),
          ...(styleOptions.block?.h1 || {}),
          fontSize: styleOptions.block?.h1?.fontSize || template?.options?.block?.h1?.fontSize || '24px',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          borderBottom: `2px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
        },
        h2: { 
          ...(template?.options?.block?.h2 || {}),
          ...(styleOptions.block?.h2 || {}),
          fontSize: styleOptions.block?.h2?.fontSize || template?.options?.block?.h2?.fontSize || '20px',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          borderBottom: `2px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
        },
        h3: { 
          ...(template?.options?.block?.h3 || {}),
          ...(styleOptions.block?.h3 || {}),
          fontSize: styleOptions.block?.h3?.fontSize || template?.options?.block?.h3?.fontSize || '1.1em',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          borderLeft: `3px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
        },
        p: {
          ...(template?.options?.block?.p || {}),
          ...(styleOptions.block?.p || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
          lineHeight: styleOptions.base?.lineHeight || template?.options?.base?.lineHeight || 2
        },
        ol: {
          ...(template?.options?.block?.ol || {}),
          ...(styleOptions.block?.ol || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        },
        ul: {
          ...(template?.options?.block?.ul || {}),
          ...(styleOptions.block?.ul || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        }
      },
      inline: {
        ...(template?.options?.inline || {}),
        ...(styleOptions.inline || {}),
        listitem: {
          ...(template?.options?.inline?.listitem || {}),
          ...(styleOptions.inline?.listitem || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        }
      }
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
  }, [value, selectedTemplate, styleOptions])

  // 手动保存
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('wechat_editor_content', value)
      setIsDraft(false)
      toast({
        title: "保存成功",
        description: "内容已保存到本地",
        duration: 3000
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "保存失败",
        description: "无法保存内容，请检查浏览器存储空间",
        action: <ToastAction altText="重试">重试</ToastAction>,
      })
    }
  }, [value, toast])

  // 监听快捷键保存事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleSave])

  // 延迟更新预览内容
  useEffect(() => {
    if (!showPreview) return
    
    setIsConverting(true)
    const updatePreview = async () => {
      try {
        const content = getPreviewContent()
        setPreviewContent(content)
      } finally {
        setIsConverting(false)
      }
    }
    updatePreview()
  }, [value, selectedTemplate, styleOptions, showPreview, getPreviewContent])

  // 加载已保存的内容
  useEffect(() => {
    const draftContent = localStorage.getItem('wechat_editor_draft')
    const savedContent = localStorage.getItem('wechat_editor_content')
    
    if (draftContent) {
      setValue(draftContent)
      setIsDraft(true)
      toast({
        description: "已恢复未保存的草稿",
        action: <ToastAction altText="放弃">放弃草稿</ToastAction>,
        duration: 5000,
      })
    } else if (savedContent) {
      setValue(savedContent)
    }
  }, [toast])

  // 渲染预览内容
  const renderPreview = useCallback(() => {
    const content = getPreviewContent()
    return (
      <div 
        className="preview-content" 
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }, [getPreviewContent])

  const handleCopy = useCallback(async () => {
    try {
      const htmlContent = getPreviewContent()
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      const plainText = tempDiv.textContent || tempDiv.innerText

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([htmlContent], { type: 'text/html' }),
          'text/plain': new Blob([plainText], { type: 'text/plain' })
        })
      ])

      toast({
        title: "复制成功",
        description: "已复制预览内容",
        duration: 2000
      })
    } catch (err) {
      console.error('Copy error:', err)
      try {
        await navigator.clipboard.writeText(previewContent)
        toast({
          title: "复制成功",
          description: "已复制预览内容（仅文本）",
          duration: 2000
        })
      } catch (fallbackErr) {
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "无法访问剪贴板，请检查浏览器权限",
          action: <ToastAction altText="重试">重试</ToastAction>,
        })
      }
    }
  }, [previewRef, toast, getPreviewContent])

  // 检测是否为移动设备
  const isMobile = useCallback(() => {
    if (typeof window === 'undefined') return false
    return window.innerWidth < 640
  }, [])

  // 自动切换预览模式
  useEffect(() => {
    const handleResize = () => {
      if (isMobile()) {
        setPreviewSize('full')
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isMobile])

  // 处理文章选择
  const handleArticleSelect = useCallback((article: { content: string, template: string }) => {
    setValue(article.content)
    setSelectedTemplate(article.template)
    setIsDraft(false)
    toast({
      title: "加载成功",
      description: "已加载选中的文章",
      duration: 2000
    })
  }, [toast])

  // 处理新建文章
  const handleNewArticle = useCallback(() => {
    if (isDraft) {
      toast({
        title: "提示",
        description: "当前文章未保存，是否继续？",
        action: (
          <ToastAction altText="继续" onClick={() => {
            setValue('# 新文章\n\n开始写作...')
            setIsDraft(false)
          }}>
            继续
          </ToastAction>
        ),
        duration: 5000,
      })
      return
    }

    setValue('# 新文章\n\n开始写作...')
    setIsDraft(false)
  }, [isDraft, toast])

  // 处理工具栏插入文本
  const handleToolbarInsert = useCallback((text: string, options?: { wrap?: boolean; placeholder?: string; suffix?: string }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    
    let newText = ''
    let newCursorPos = 0

    if (options?.wrap && selectedText) {
      // 如果有选中文本且需要包裹
      newText = value.substring(0, start) + 
                text + selectedText + (options.suffix || text) + 
                value.substring(end)
      newCursorPos = start + text.length + selectedText.length + (options.suffix?.length || text.length)
    } else {
      // 插入新文本
      const insertText = selectedText || options?.placeholder || ''
      newText = value.substring(0, start) + 
                text + insertText + (options?.suffix || '') + 
                value.substring(end)
      newCursorPos = start + text.length + insertText.length + (options?.suffix?.length || 0)
    }

    setValue(newText)
    handleEditorChange(newText)

    // 恢复焦点并设置光标位置
    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    })
  }, [value, handleEditorChange])

  // 处理模版选择
  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId)
    // 重置样式设置为模版默认值
    setStyleOptions({})
  }, [])

  return (
    <div className="h-full flex flex-col">
      <div className="hidden sm:block">
        <EditorToolbar 
          value={value}
          isDraft={isDraft}
          showPreview={showPreview}
          selectedTemplate={selectedTemplate}
          onSave={handleSave}
          onCopy={handleCopy}
          onCopyPreview={handleCopy}
          onNewArticle={handleNewArticle}
          onArticleSelect={handleArticleSelect}
          onTemplateSelect={handleTemplateSelect}
          onTemplateChange={() => setValue(value)}
          onStyleOptionsChange={setStyleOptions}
          onPreviewToggle={() => setShowPreview(!showPreview)}
          styleOptions={styleOptions}
        />
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Mobile View */}
        <div className="sm:hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-background">
            <div className="flex-1 mr-2">
              <WechatStylePicker 
                value={selectedTemplate} 
                onSelect={handleTemplateSelect}
              />
            </div>
            <button
              onClick={() => {
                handleCopy()
                  .then(() => {
                    toast({
                      title: "复制成功",
                      description: "已复制预览内容到剪贴板",
                      duration: 2000
                    })
                  })
                  .catch(() => {
                    toast({
                      variant: "destructive",
                      title: "复制失败",
                      description: "无法访问剪贴板，请检查浏览器权限",
                      duration: 2000
                    })
                  })
              }}
              className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs text-primary hover:bg-muted transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              复制
            </button>
          </div>
          <Tabs defaultValue="editor" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor">编辑</TabsTrigger>
              <TabsTrigger value="preview">预览</TabsTrigger>
            </TabsList>
            <TabsContent value="editor" className="flex-1 data-[state=inactive]:hidden">
              <div 
                ref={editorRef}
                className={cn(
                  "h-full overflow-y-auto",
                  selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
                )}
              >
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  className="w-full h-full resize-none outline-none p-4 font-mono text-base leading-relaxed"
                  placeholder="开始写作..."
                  spellCheck={false}
                />
              </div>
            </TabsContent>
            <TabsContent value="preview" className="flex-1 data-[state=inactive]:hidden">
              <div className="h-full overflow-y-auto">
                <EditorPreview 
                  previewRef={previewRef}
                  selectedTemplate={selectedTemplate}
                  previewSize={previewSize}
                  isConverting={isConverting}
                  previewContent={previewContent}
                  onPreviewSizeChange={setPreviewSize}
                />
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Split View */}
        <div className="hidden sm:flex flex-1 flex-row">
          <div 
            ref={editorRef}
            className={cn(
              "editor-container bg-background transition-all duration-300 ease-in-out flex flex-col",
              showPreview 
                ? "h-full w-1/2 border-r" 
                : "h-full w-full",
              selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
            )}
          >
            <MarkdownToolbar onInsert={handleToolbarInsert} />
            <div className="flex-1">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                className="w-full h-full resize-none outline-none p-4 font-mono text-base leading-relaxed"
                placeholder="开始写作..."
                spellCheck={false}
              />
            </div>
          </div>
          
          {showPreview && (
            <EditorPreview 
              previewRef={previewRef}
              selectedTemplate={selectedTemplate}
              previewSize={previewSize}
              isConverting={isConverting}
              previewContent={previewContent}
              onPreviewSizeChange={setPreviewSize}
            />
          )}
        </div>
      </div>
    </div>
  )
}