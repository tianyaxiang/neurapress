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
import { Copy, Smartphone, Loader2, Save } from 'lucide-react'
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
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
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
    const previewContent = document.querySelector('.preview-content')
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
      
      // 使用与预览相同的转换逻辑
      const template = templates.find(t => t.id === selectedTemplate)    

      const mergedOptions = {
        ...styleOptions,
        ...(template?.options || {})
      }
      // 使用相同的转换逻辑获取内容
      const html = convertToWechat(value, mergedOptions)
      let finalHtml = html
    
      if (template?.transform) {
        try {
          const transformed = template.transform(html)
          if (transformed && typeof transformed === 'object') {
            const result = transformed as { html?: string; content?: string }
            if (result.html) finalHtml = result.html
            else if (result.content) finalHtml = result.content
            else finalHtml = JSON.stringify(transformed)
          } else {
            finalHtml = transformed || html
          }
        } catch (error) {
          console.error('Template transformation error:', error)
          finalHtml = html
        }
      }
      
      // 设置转换后的内容
      tempDiv.innerHTML = finalHtml

      // 应用模板样式类
      if (template) {
        tempDiv.className = template.styles
      }
      alert(tempDiv.innerHTML)

      // 使用 Blob 和 Clipboard API 复制
      const blob = new Blob([tempDiv.innerHTML], { type: 'text/html' })
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': blob
        })
      ])

      toast({
        title: "复制成功",
        description: template 
          ? "已复制预览内容（使用当前模板样式）" 
          : "已复制预览内容（无样式）",
        duration: 2000
      })
    } catch (err) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "无法访问剪贴板，请检查浏览器权限",
        action: <ToastAction altText="重试">重试</ToastAction>,
      })
      console.error('Copy error:', err)
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
              // 触发自定义事件
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
            click: async (ctx: any) => {
              const previewContent = ctx.preview?.querySelector('.markdown-body')
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
                
                // 使用 Blob 和 Clipboard API 复制
                const blob = new Blob([tempDiv.innerHTML], { type: 'text/html' })
                await navigator.clipboard.write([
                  new ClipboardItem({
                    'text/html': blob
                  })
                ])

                toast({
                  title: "复制成功",
                  description: "已复制预览内容（包含样式）",
                  duration: 2000
                })
              } catch (err) {
                toast({
                  variant: "destructive",
                  title: "复制失败",
                  description: "无法访问剪贴板，请检查浏览器权限",
                  action: <ToastAction altText="重试">重试</ToastAction>,
                })
                console.error('Copy error:', err)
              }
            }
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
      }
    }
  }, [selectedTemplate, styleOptions])

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

  return (
    <div className="h-[calc(100vh-4rem)]">
      <div className="border-b bg-background sticky top-0 z-20">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <WechatStylePicker 
                value={selectedTemplate} 
                onSelect={setSelectedTemplate} 
              />
              <div className="h-6 w-px bg-border" />
              <TemplateManager onTemplateChange={handleTemplateChange} />
              <div className="h-6 w-px bg-border" />
              <StyleConfigDialog
                value={styleOptions}
                onChange={setStyleOptions}
              />
              <div className="h-6 w-px bg-border" />
              <button
                onClick={() => setShowPreview(!showPreview)}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  showPreview 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                <Smartphone className="h-4 w-4" />
                {showPreview ? '隐藏预览' : '显示预览'}
              </button>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 text-sm transition-colors"
              >
                <Save className="h-4 w-4" />
                保存
              </button>
              <button
                onClick={copyContent}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                复制源码
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                复制预览
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <div 
          ref={editorRef}
          className={cn(
            "editor-container border-r bg-background transition-all duration-300 ease-in-out overflow-hidden",
            showPreview ? "w-1/2" : "w-full",
            selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
          )}
        >
          <Editor
            value={value}
            plugins={plugins}
            onChange={handleEditorChange}
            uploadImages={async (files: File[]) => {
              return []
            }}
          />
        </div>
        
        {showPreview && (
          <div 
            ref={previewRef}
            className={cn(
              "preview-container bg-background transition-all duration-300 ease-in-out w-1/2 flex flex-col",
              "markdown-body",
              selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
            )}
          >
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2 flex items-center justify-between z-10">
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
              <div 
                className={cn(
                  "bg-background mx-auto",
                  previewSize === 'full' ? '' : 'border shadow-sm'
                )}
                style={{ width: PREVIEW_SIZES[previewSize].width }}
              >
                {isConverting ? (
                  <div className="flex items-center justify-center p-8">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <div className={cn(
                    "preview-content py-6 px-6",
                    "prose prose-slate dark:prose-invert max-w-none",
                    selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
                  )}>
                    <div dangerouslySetInnerHTML={{ __html: getPreviewContent() }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}