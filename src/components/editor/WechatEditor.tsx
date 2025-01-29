'use client'

import { Editor } from '@bytemd/react'
import gfm from '@bytemd/plugin-gfm'
import highlight from '@bytemd/plugin-highlight'
import breaks from '@bytemd/plugin-breaks'
import frontmatter from '@bytemd/plugin-frontmatter'
import math from '@bytemd/plugin-math'
import mermaid from '@bytemd/plugin-mermaid'
import { useState, useCallback, useEffect, useRef, useMemo } from 'react'
import { templates } from '@/config/wechat-templates'
import { cn } from '@/lib/utils'
import { Copy, Smartphone, Loader2, Save, Plus } from 'lucide-react'
import { WechatStylePicker } from '../template/WechatStylePicker'
import { StyleConfigDialog } from './StyleConfigDialog'
import { convertToWechat } from '@/lib/markdown'
import { type RendererOptions } from '@/lib/markdown'
import { TemplateManager } from '../template/TemplateManager'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import 'bytemd/dist/index.css'
import 'highlight.js/styles/github.css'
import 'katex/dist/katex.css'
import type { BytemdPlugin } from 'bytemd'
import { ArticleList } from './ArticleList'

const PREVIEW_SIZES = {
  small: { width: '360px', label: '小屏' },
  medium: { width: '390px', label: '中屏' },
  large: { width: '420px', label: '大屏' },
  full: { width: '100%', label: '全屏' },
} as const

type PreviewSize = keyof typeof PREVIEW_SIZES

const AUTO_SAVE_DELAY = 3000 // 自动保存延迟（毫秒）

export default function WechatEditor() {
  const { toast } = useToast()
  const autoSaveTimerRef = useRef<NodeJS.Timeout>()
  const editorRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)
  const [value, setValue] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<string>('creative')
  const [showPreview, setShowPreview] = useState(true)
  const [styleOptions, setStyleOptions] = useState<RendererOptions>({})
  const [previewSize, setPreviewSize] = useState<PreviewSize>('medium')
  const [isConverting, setIsConverting] = useState(false)
  const [isDraft, setIsDraft] = useState(false)

  // 防止滚动事件循环的标志
  const isScrolling = useRef(false)

  // 同步滚动处理
  const handleScroll = useCallback((event: Event) => {
    const source = event.target
    // 检查是否是编辑器滚动
    const isEditor = source instanceof Element && source.closest('.editor-container')
    
    if (!editorRef.current) return
    
    const editorElement = editorRef.current.querySelector('.bytemd-editor')
    if (!editorElement) return
    
    // 防止滚动事件循环
    if (isScrolling.current) return
    isScrolling.current = true
    
    try {
      if (isEditor) {
        const sourceScrollTop = (source as Element).scrollTop
        const sourceMaxScroll = (source as Element).scrollHeight - (source as Element).clientHeight
        const percentage = sourceScrollTop / sourceMaxScroll
        
        const windowMaxScroll = document.documentElement.scrollHeight - window.innerHeight
        window.scrollTo({
          top: percentage * windowMaxScroll,
          behavior: 'auto'
        })
      } else {
        const windowScrollTop = window.scrollY
        const windowMaxScroll = document.documentElement.scrollHeight - window.innerHeight
        const percentage = windowScrollTop / windowMaxScroll
        
        const targetScrollTop = percentage * (editorElement.scrollHeight - editorElement.clientHeight)
        editorElement.scrollTop = targetScrollTop
      }
    } finally {
      // 确保在下一帧重置标志
      requestAnimationFrame(() => {
        isScrolling.current = false
      })
    }
  }, [])

  // 添加滚动事件监听
  useEffect(() => {
    const editorElement = editorRef.current?.querySelector('.bytemd-editor')
    
    if (editorElement) {
      editorElement.addEventListener('scroll', handleScroll, { passive: true })
      window.addEventListener('scroll', handleScroll, { passive: true })
      
      return () => {
        editorElement.removeEventListener('scroll', handleScroll)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [handleScroll])

  // 自动保存处理
  const handleEditorChange = useCallback((v: string) => {
    setValue(v)
    setIsDraft(true)
    
    // 清除之前的定时器
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current)
    }
    
    // 设置新的自动保存定时器
    autoSaveTimerRef.current = setTimeout(() => {
      localStorage.setItem('wechat_editor_draft', v)
      toast({
        description: "内容已自动保存",
        duration: 2000
      })
    }, AUTO_SAVE_DELAY)
  }, [toast])

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

  // 清理自动保存定时器
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [])

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
  }

  const handleTemplateChange = () => {
    setValue(value)
  }

  const handleCopy = async () => {
    // 使用 bytemd 编辑器的预览区域
    const previewContent = editorRef.current?.querySelector('.bytemd-preview .markdown-body')
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
      // 创建一个临时容器
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = previewContent.innerHTML

      // 应用模板样式
      const template = templates.find(t => t.id === selectedTemplate)
      if (template) {
        tempDiv.className = template.styles
      }

      // 处理图片
      const images = tempDiv.querySelectorAll('img')
      images.forEach(img => {
        // 确保图片使用绝对路径
        if (img.src.startsWith('/')) {
          img.src = window.location.origin + img.src
        }
      })

      // 处理代码块
      const codeBlocks = tempDiv.querySelectorAll('pre code')
      codeBlocks.forEach(code => {
        if (code.parentElement) {
          code.parentElement.style.whiteSpace = 'pre-wrap'
          code.parentElement.style.wordWrap = 'break-word'
        }
      })

      // 应用样式选项
      const mergedOptions = {
        ...styleOptions,
        ...(template?.options || {})
      }

      // 应用标题样式
      const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6')
      headings.forEach(heading => {
        const level = heading.tagName.toLowerCase()
        const style = mergedOptions.block?.[level as keyof RendererOptions['block']]
        if (style && heading instanceof HTMLElement) {
          Object.assign(heading.style, style)
        }
      })

      // 应用段落样式
      const paragraphs = tempDiv.querySelectorAll('p')
      paragraphs.forEach(p => {
        if (mergedOptions.block?.p && p instanceof HTMLElement) {
          Object.assign(p.style, mergedOptions.block.p)
        }
      })

      // 应用引用样式
      const blockquotes = tempDiv.querySelectorAll('blockquote')
      blockquotes.forEach(quote => {
        if (mergedOptions.block?.blockquote && quote instanceof HTMLElement) {
          Object.assign(quote.style, mergedOptions.block.blockquote)
        }
      })

      // 应用行内代码样式
      const inlineCodes = tempDiv.querySelectorAll(':not(pre) > code')
      inlineCodes.forEach(code => {
        if (mergedOptions.inline?.codespan && code instanceof HTMLElement) {
          Object.assign(code.style, mergedOptions.inline.codespan)
        }
      })

      // 使用 Clipboard API 复制
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
      // 降级处理：尝试使用 execCommand
      try {
        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = previewContent.innerHTML
        document.body.appendChild(tempDiv)
        const range = document.createRange()
        range.selectNode(tempDiv)
        const selection = window.getSelection()
        if (selection) {
          selection.removeAllRanges()
          selection.addRange(range)
          document.execCommand('copy')
          selection.removeAllRanges()
        }
        document.body.removeChild(tempDiv)
        toast({
          title: "复制成功",
          description: "已复制预览内容（兼容模式）",
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
  }

  // 创建编辑器插件
  const createEditorPlugin = useCallback((): BytemdPlugin => {
    const applyTemplateStyles = (markdownBody: Element, selectedTemplateId: string, options: RendererOptions) => {
      const template = templates.find(t => t.id === selectedTemplateId)
      if (template) {
        markdownBody.classList.add(template.styles)
        
        // 应用模板的样式配置
        const mergedOptions = {
          ...options,
          ...(template.options || {})
        }

        // 应用标题样式
        const headings = markdownBody.querySelectorAll('h1, h2, h3, h4, h5, h6')
        headings.forEach(heading => {
          const level = heading.tagName.toLowerCase()
          const style = mergedOptions.block?.[level as keyof RendererOptions['block']]
          if (style && heading instanceof HTMLElement) {
            Object.assign(heading.style, style)
          }
        })

        // 应用段落样式
        const paragraphs = markdownBody.querySelectorAll('p')
        paragraphs.forEach(p => {
          if (mergedOptions.block?.p && p instanceof HTMLElement) {
            Object.assign(p.style, mergedOptions.block.p)
          }
        })

        // 应用引用样式
        const blockquotes = markdownBody.querySelectorAll('blockquote')
        blockquotes.forEach(quote => {
          if (mergedOptions.block?.blockquote && quote instanceof HTMLElement) {
            Object.assign(quote.style, mergedOptions.block.blockquote)
          }
        })

        // 应用代码块样式
        const codeBlocks = markdownBody.querySelectorAll('pre code')
        codeBlocks.forEach(code => {
          if (mergedOptions.block?.code_pre && code.parentElement instanceof HTMLElement) {
            Object.assign(code.parentElement.style, mergedOptions.block.code_pre)
          }
        })

        // 应用行内代码样式
        const inlineCodes = markdownBody.querySelectorAll(':not(pre) > code')
        inlineCodes.forEach(code => {
          if (mergedOptions.inline?.codespan && code instanceof HTMLElement) {
            Object.assign(code.style, mergedOptions.inline.codespan)
          }
        })
      }
    }

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
        },
        {
          title: '复制预览内容',
          icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>',
          handler: {
            type: 'action',
            click: handleCopy
          }
        },
        {
          title: '复制源码',
          icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>',
          handler: {
            type: 'action',
            click: copyContent
          }
        },
        {
          title: '预览尺寸',
          icon: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 3H3v18h18V3z"></path><path d="M21 13H3"></path><path d="M12 3v18"></path></svg>',
          handler: {
            type: 'dropdown',
            actions: Object.entries(PREVIEW_SIZES).map(([key, { label }]) => ({
              title: label,
              handler: {
                type: 'action',
                click: () => {
                  setPreviewSize(key as PreviewSize)
                  const previewContent = editorRef.current?.querySelector('.bytemd-preview .markdown-body')
                  if (previewContent) {
                    const container = previewContent.parentElement
                    if (container) {
                      const size = PREVIEW_SIZES[key as PreviewSize]
                      container.style.maxWidth = size.width
                      container.style.margin = '0 auto'
                      container.style.transition = 'max-width 0.3s ease'
                      container.style.textAlign = 'center'
                    }
                  }
                }
              }
            }))
          }
        }
      ],
      viewerEffect({ markdownBody }) {
        // 图片加载优化
        const images = markdownBody.querySelectorAll('img')
        images.forEach(img => {
          if (img instanceof HTMLImageElement) {
            img.style.opacity = '0'
            img.style.transition = 'opacity 0.3s ease'
            img.onload = () => img.style.opacity = '1'
            img.onerror = () => {
              img.style.opacity = '1'
              img.style.filter = 'grayscale(1)'
              img.title = '图片加载失败'
            }
          }
        })

        // 链接优化
        const links = markdownBody.querySelectorAll('a')
        links.forEach(link => {
          if (link instanceof HTMLAnchorElement) {
            link.target = '_blank'
            link.rel = 'noopener noreferrer'
          }
        })

        // 应用模板样式
        if (selectedTemplate) {
          applyTemplateStyles(markdownBody, selectedTemplate, styleOptions)
        }

        // 设置预览容器宽度
        const container = markdownBody.parentElement
        if (container) {
          const size = PREVIEW_SIZES[previewSize]
          container.style.maxWidth = size.width
          container.style.margin = '0 auto'
          container.style.transition = 'max-width 0.3s ease'
        }
      }
    }
  }, [selectedTemplate, styleOptions, handleCopy, copyContent, previewSize, setPreviewSize, editorRef])

  // 使用创建的插件
  const plugins = useMemo(() => [
    gfm(),  // 使用默认配置
    breaks(),
    frontmatter(),
    math({
      // 配置数学公式渲染
      katexOptions: {
        throwOnError: false,
        output: 'html'
      }
    }),
    mermaid({
      // 配置 Mermaid 图表渲染
      theme: 'default'
    }),
    highlight({
      // 配置代码高亮
      init: (hljs) => {
        // 可以在这里注册额外的语言
      }
    }),
    createEditorPlugin()
  ], [createEditorPlugin])

  // 检测是否为移动设备
  const isMobile = useCallback(() => {
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
    // 如果有未保存的内容，提示用户
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

    // 直接新建
    setValue('# 新文章\n\n开始写作...')
    setIsDraft(false)
  }, [isDraft, toast])

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
        <div className="container mx-auto">
          <div className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <ArticleList 
                  onSelect={handleArticleSelect}
                  currentContent={value}
                  onNew={handleNewArticle}
                />
                <button
                  onClick={handleNewArticle}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors w-full sm:w-auto justify-center bg-muted text-muted-foreground hover:bg-muted/90"
                >
                  <Plus className="h-4 w-4" />
                  新建文章
                </button>
                <WechatStylePicker 
                  value={selectedTemplate} 
                  onSelect={setSelectedTemplate} 
                />
                <div className="hidden sm:block h-6 w-px bg-border" />
                <TemplateManager onTemplateChange={handleTemplateChange} />
                <div className="hidden sm:block h-6 w-px bg-border" />
                <StyleConfigDialog
                  value={styleOptions}
                  onChange={setStyleOptions}
                />
                <div className="hidden sm:block h-6 w-px bg-border" />
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors w-full sm:w-auto justify-center",
                    showPreview 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/90"
                  )}
                >
                  <Smartphone className="h-4 w-4" />
                  {showPreview ? '编辑' : '预览'}
                </button>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                {isDraft && (
                  <span className="text-sm text-muted-foreground">未保存</span>
                )}
                <button
                  onClick={handleSave}
                  className={cn(
                    "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors flex-1 sm:flex-none",
                    isDraft 
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "bg-muted text-muted-foreground hover:bg-muted/90"
                  )}
                >
                  <Save className="h-4 w-4" />
                  <span>保存</span>
                </button>
                <button
                  onClick={copyContent}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 text-sm transition-colors flex-1 sm:flex-none"
                >
                  <Copy className="h-4 w-4" />
                  <span>复制源码</span>
                </button>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors flex-1 sm:flex-none"
                >
                  <Copy className="h-4 w-4" />
                  <span>复制预览</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
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
          <div className="flex-1 overflow-auto">
            <Editor
              value={value}
              plugins={plugins}
              onChange={handleEditorChange}
              uploadImages={async (files: File[]) => {
                return []
              }}
            />
          </div>
        </div>
        
        {showPreview && (
          <div 
            ref={previewRef}
            className={cn(
              "preview-container bg-background transition-all duration-300 ease-in-out flex flex-col",
              "h-[50%] sm:h-full sm:w-1/2",
              "markdown-body",
              selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
            )}
          >
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2 flex items-center justify-between z-10 sticky top-0">
              <div className="text-sm text-muted-foreground">预览效果</div>
              <div className="flex items-center gap-2">
                <select
                  value={previewSize}
                  onChange={(e) => setPreviewSize(e.target.value as PreviewSize)}
                  className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
                >
                  {Object.entries(PREVIEW_SIZES).map(([key, { label }]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <div className="min-h-full py-8 px-4">
                <div 
                  className={cn(
                    "bg-background mx-auto rounded-lg transition-all duration-300",
                    previewSize === 'full' ? '' : 'border shadow-sm'
                  )}
                  style={{ 
                    width: PREVIEW_SIZES[previewSize].width,
                    maxWidth: '100%'
                  }}
                >
                  {isConverting ? (
                    <div className="flex items-center justify-center p-8">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className={cn(
                      "preview-content py-4",
                      "prose prose-slate dark:prose-invert max-w-none",
                      selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
                    )}>
                      <div className="px-6" dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 移动端底部工具栏 */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-2 flex justify-around">
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={cn(
            "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
            showPreview 
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Smartphone className="h-5 w-5" />
          {showPreview ? '编辑' : '预览'}
        </button>
        <button
          onClick={handleSave}
          className={cn(
            "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
            isDraft 
              ? "text-primary"
              : "text-muted-foreground"
          )}
        >
          <Save className="h-5 w-5" />
          保存
          {isDraft && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}
        </button>
        <button
          onClick={copyContent}
          className="flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground transition-colors relative"
        >
          <Copy className="h-5 w-5" />
          源码
        </button>
        <button
          onClick={handleCopy}
          className={cn(
            "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
            "hover:bg-primary/10 active:bg-primary/20",
            showPreview ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Copy className="h-5 w-5" />
          复制预览
        </button>
      </div>
    </div>
  )
}