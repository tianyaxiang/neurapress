'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { type RendererOptions } from '@/lib/markdown'
import { useEditorSync } from './hooks/useEditorSync'
import { useAutoSave } from './hooks/useAutoSave'
import { EditorToolbar } from './components/EditorToolbar'
import { EditorPreview } from './components/EditorPreview'
import { MarkdownToolbar } from './components/MarkdownToolbar'
import { type PreviewSize } from './constants'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { codeThemes, type CodeThemeId } from '@/config/code-themes'
import '@/styles/code-themes.css'
import { templates } from '@/config/wechat-templates'
import { cn } from '@/lib/utils'
import { usePreviewContent } from './hooks/usePreviewContent'
import { useEditorKeyboard } from './hooks/useEditorKeyboard'
import { useScrollSync } from './hooks/useScrollSync'
import { useWordStats } from './hooks/useWordStats'
import { useCopy } from './hooks/useCopy'

export default function WechatEditor() {
  const { toast } = useToast()
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  
  // 状态管理
  const [value, setValue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('default')
  const [showPreview, setShowPreview] = useState(true)
  const [styleOptions, setStyleOptions] = useState<RendererOptions>({})
  const [previewSize, setPreviewSize] = useState<PreviewSize>('medium')
  const [isDraft, setIsDraft] = useState(false)
  const [codeTheme, setCodeTheme] = useLocalStorage<CodeThemeId>('code-theme', codeThemes[0].id)

  // 使用自定义 hooks
  const { handleScroll } = useEditorSync(editorRef)
  const { handleEditorChange } = useAutoSave(value, setIsDraft)
  const { handleEditorScroll } = useScrollSync()

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

  const { isConverting, previewContent } = usePreviewContent({
    value,
    selectedTemplate,
    styleOptions,
    codeTheme
  })

  const { handleKeyDown } = useEditorKeyboard({
    value,
    onChange: (newValue) => {
      setValue(newValue)
      handleEditorChange(newValue)
    },
    onSave: handleSave
  })

  // 处理编辑器输入
  const handleInput = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    const currentPosition = {
      start: e.target.selectionStart,
      end: e.target.selectionEnd,
      scrollTop: e.target.scrollTop
    }
    
    setValue(newValue)
    handleEditorChange(newValue)
    
    requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.scrollTop = currentPosition.scrollTop
        textareaRef.current.setSelectionRange(currentPosition.start, currentPosition.end)
      }
    })
  }, [handleEditorChange])

  const { handleCopy } = useCopy()

  // 处理复制
  const onCopy = useCallback(async () => {
    return handleCopy(window.getSelection(), previewContent)
  }, [handleCopy, previewContent])

  // 处理放弃草稿
  const handleDiscardDraft = useCallback(() => {
    const savedContent = localStorage.getItem('wechat_editor_content')
    localStorage.removeItem('wechat_editor_draft')
    setValue(savedContent || '')
    setIsDraft(false)
    toast({
      title: "已放弃草稿",
      description: "已恢复到上次保存的内容",
      duration: 2000
    })
  }, [toast])

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
      newText = value.substring(0, start) + 
                text + selectedText + (options.suffix || text) + 
                value.substring(end)
      newCursorPos = start + text.length + selectedText.length + (options.suffix?.length || text.length)
    } else {
      const insertText = selectedText || options?.placeholder || ''
      newText = value.substring(0, start) + 
                text + insertText + (options?.suffix || '') + 
                value.substring(end)
      newCursorPos = start + text.length + insertText.length + (options?.suffix?.length || 0)
    }

    setValue(newText)
    handleEditorChange(newText)

    requestAnimationFrame(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    })
  }, [value, handleEditorChange])

  // 处理模版选择
  const handleTemplateSelect = useCallback((templateId: string) => {
    setSelectedTemplate(templateId)
    setStyleOptions({})
  }, [])

  // 清除编辑器内容
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清除所有内容吗？')) {
      setValue('')
      handleEditorChange('')
      toast({
        title: "已清除",
        description: "编辑器内容已清除",
        duration: 2000
      })
    }
  }, [handleEditorChange, toast])

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

  // 加载已保存的内容
  useEffect(() => {
    const draftContent = localStorage.getItem('wechat_editor_draft')
    const savedContent = localStorage.getItem('wechat_editor_content')
    
    if (draftContent) {
      setValue(draftContent)
      setIsDraft(true)
      toast({
        description: "已恢复未保存的草稿",
        action: <ToastAction altText="放弃" onClick={handleDiscardDraft}>放弃草稿</ToastAction>,
        duration: 5000,
      })
    } else if (savedContent) {
      setValue(savedContent)
    }
  }, [toast, handleDiscardDraft])

  const { wordCount, readingTime } = useWordStats(value)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="hidden sm:block">
        <EditorToolbar 
          value={value}
          isDraft={isDraft}
          showPreview={showPreview}
          selectedTemplate={selectedTemplate}
          onSave={handleSave}
          onCopy={onCopy}
          onCopyPreview={onCopy}
          onNewArticle={handleNewArticle}
          onArticleSelect={handleArticleSelect}
          onTemplateSelect={handleTemplateSelect}
          onTemplateChange={() => setValue(value)}
          onStyleOptionsChange={setStyleOptions}
          onPreviewToggle={() => setShowPreview(!showPreview)}
          styleOptions={styleOptions}
          wordCount={wordCount}
          readingTime={readingTime}
          codeTheme={codeTheme}
          onCodeThemeChange={setCodeTheme}
        />
      </div>
      
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        {/* Mobile View */}
        <div className="sm:hidden flex-1 flex flex-col">
          <div className="flex items-center justify-between p-2 border-b bg-background">
            <div className="flex-1 mr-2">
              <select
                value={selectedTemplate}
                onChange={(e) => handleTemplateSelect(e.target.value)}
                className="w-full p-2 rounded-md border"
              >
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClear}
                className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs text-destructive hover:bg-muted transition-colors"
                title="清除内容"
              >
                清除
              </button>
              <button
                onClick={onCopy}
                className="flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs text-primary hover:bg-muted transition-colors"
              >
                复制
              </button>
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              <div 
                ref={editorRef}
                className={cn(
                  "h-full",
                  selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
                )}
              >
                <textarea
                  ref={textareaRef}
                  value={value}
                  onChange={handleInput}
                  onKeyDown={handleKeyDown}
                  onScroll={handleEditorScroll}
                  className="w-full h-full resize-none outline-none p-4 font-mono text-base leading-relaxed overflow-y-scroll scrollbar-none"
                  placeholder="开始写作..."
                  spellCheck={false}
                />
              </div>
            </div>
            <div className="flex-1">
              <EditorPreview 
                previewRef={previewRef}
                selectedTemplate={selectedTemplate}
                previewSize={previewSize}
                isConverting={isConverting}
                previewContent={previewContent}
                codeTheme={codeTheme}
                onPreviewSizeChange={setPreviewSize}
              />
            </div>
          </div>
        </div>

        {/* Desktop Split View */}
        <div className="hidden sm:flex flex-1 flex-row">
          <div 
            ref={editorRef}
            className={cn(
              "editor-container bg-background transition-all duration-300 ease-in-out flex flex-col h-full",
              showPreview 
                ? "w-1/2 border-r" 
                : "w-full",
              selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
            )}
          >
            <MarkdownToolbar onInsert={handleToolbarInsert} />
            <div className="flex-1 overflow-hidden">
              <textarea
                ref={textareaRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onScroll={handleEditorScroll}
                className="w-full h-full resize-none outline-none p-4 font-mono text-base leading-relaxed overflow-y-scroll scrollbar-none"
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
              codeTheme={codeTheme}
              onPreviewSizeChange={setPreviewSize}
            />
          )}
        </div>
      </div>

      {/* 底部状态栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-background border-t h-10 flex items-center justify-end px-4 gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>{wordCount} 字</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
          <span>约 {readingTime}</span>
        </div>
      </div>

      {/* 为底部工具栏添加间距 */}
      <div className="h-10" />
    </div>
  )
}