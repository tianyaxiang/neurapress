'use client'

import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import { useState, useCallback, useEffect, useRef, useMemo, Suspense } from 'react'
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
import { MobileToolbar } from './components/MobileToolbar'
import { type PreviewSize } from './constants'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.css'
import type { BytemdPlugin } from 'bytemd'

export default function WechatEditor() {
  const { toast } = useToast()
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('creative')
  const [showPreview, setShowPreview] = useState(true)
  const [styleOptions, setStyleOptions] = useState<RendererOptions>({})
  const [previewSize, setPreviewSize] = useState<PreviewSize>('medium')
  const [isConverting, setIsConverting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const [previewContent, setPreviewContent] = useState('')
  const [plugins, setPlugins] = useState<BytemdPlugin[]>([])

  // 使用自定义 hooks
  const { handleScroll } = useEditorSync(editorRef)
  const { handleEditorChange } = useAutoSave(value, setIsDraft)

  // 获取预览内容
  const getPreviewContent = useCallback(() => {
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

  // 监听快捷键保存事件
  useEffect(() => {
    const handleSaveShortcut = (e: CustomEvent<string>) => {
      handleSave()
    }
    
    window.addEventListener('bytemd-save', handleSaveShortcut as EventListener)
    return () => {
      window.removeEventListener('bytemd-save', handleSaveShortcut as EventListener)
    }
  }, [handleSave])

  const copyContent = useCallback(() => {
    const content = getPreviewContent()
    navigator.clipboard.writeText(content)
      .then(() => toast({
        title: "复制成功",
        description: "已复制源代码到剪贴板",
        duration: 2000
      }))
      .catch(err => toast({
        variant: "destructive",
        title: "复制失败",
        description: "无法访问剪贴板，请检查浏览器权限",
        action: <ToastAction altText="重试">重试</ToastAction>,
      }))
  }, [getPreviewContent, toast])

  const handleCopy = useCallback(async () => {
    const previewContent = previewRef.current?.querySelector('.preview-content') as HTMLElement | null
    if (!previewContent) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "未找到预览内容",
        duration: 2000
      })
      return
    }

    try {
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = previewContent.innerHTML

      const template = templates.find(t => t.id === selectedTemplate)
      if (template) {
        tempDiv.className = template.styles
      }

      if (!tempDiv.innerHTML.trim()) {
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "预览内容为空",
          duration: 2000
        })
        return
      }

      const htmlBlob = new Blob([tempDiv.innerHTML], { type: 'text/html' })
      const textBlob = new Blob([tempDiv.innerText], { type: 'text/plain' })

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob
        })
      ])

      toast({
        title: "复制成功",
        description: template 
          ? "已复制预览内容（包含样式）" 
          : "已复制预览内容",
        duration: 2000
      })
    } catch (err) {
      console.error('Copy error:', err)
      try {
        await navigator.clipboard.writeText(previewContent.innerText)
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
  }, [selectedTemplate, toast, previewRef])

  // 创建编辑器插件
  const createEditorPlugin = useCallback((): BytemdPlugin => {
    return {
      actions: [
        {
          title: '保存',
          icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>',
          handler: {
            type: 'action',
            click: (ctx: any) => {
              const event = new CustomEvent('bytemd-save', { detail: ctx.editor.getValue() })
              window.dispatchEvent(event)
            }
          }
        }
      ]
    }
  }, [])

  // 加载插件
  useEffect(() => {
    const loadPlugins = async () => {
      try {
        const [gfmPlugin, breaksPlugin, frontmatterPlugin, mathPlugin, mermaidPlugin, highlightPlugin] = await Promise.all([
          import('@bytemd/plugin-gfm').then(m => m.default()),
          import('@bytemd/plugin-breaks').then(m => m.default()),
          import('@bytemd/plugin-frontmatter').then(m => m.default()),
          import('@bytemd/plugin-math').then(m => m.default({
            katexOptions: { throwOnError: false, output: 'html' }
          })),
          import('@bytemd/plugin-mermaid').then(m => m.default({ theme: 'default' })),
          import('@bytemd/plugin-highlight').then(m => m.default())
        ])

        setPlugins([
          gfmPlugin,
          breaksPlugin,
          frontmatterPlugin,
          mathPlugin,
          mermaidPlugin,
          highlightPlugin,
          createEditorPlugin()
        ])
      } catch (error) {
        console.error('Failed to load editor plugins:', error)
        toast({
          variant: "destructive",
          title: "加载失败",
          description: "编辑器插件加载失败，部分功能可能无法使用",
          duration: 5000,
        })
      }
    }

    loadPlugins()
  }, [createEditorPlugin, toast])

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

  return (
    <div className="h-full flex flex-col">
      <EditorToolbar 
        value={value}
        isDraft={isDraft}
        showPreview={showPreview}
        selectedTemplate={selectedTemplate}
        onSave={handleSave}
        onCopy={copyContent}
        onCopyPreview={handleCopy}
        onNewArticle={handleNewArticle}
        onArticleSelect={handleArticleSelect}
        onTemplateSelect={setSelectedTemplate}
        onTemplateChange={() => setValue(value)}
        onStyleOptionsChange={setStyleOptions}
        onPreviewToggle={() => setShowPreview(!showPreview)}
        styleOptions={styleOptions}
      />
      
      <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
        <div 
          ref={editorRef}
          className={cn(
            "editor-container bg-background transition-all duration-300 ease-in-out",
            showPreview 
              ? "h-[50%] sm:h-full sm:w-1/2 border-b sm:border-r" 
              : "h-full w-full",
            selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
          )}
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Suspense fallback={<div className="flex-1 flex items-center justify-center">加载编辑器...</div>}>
            <div className="flex-1 overflow-auto">
              <Editor
                value={value}
                plugins={plugins}
                onChange={(v) => {
                  setValue(v)
                  handleEditorChange(v)
                }}
                uploadImages={async (files: File[]) => {
                  return []
                }}
              />
            </div>
          </Suspense>
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

      <MobileToolbar 
        showPreview={showPreview}
        isDraft={isDraft}
        onPreviewToggle={() => setShowPreview(!showPreview)}
        onSave={handleSave}
        onCopy={copyContent}
        onCopyPreview={handleCopy}
      />
    </div>
  )
}