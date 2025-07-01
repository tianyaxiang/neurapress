'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import html2canvas from 'html2canvas'
import { cn } from '@/lib/utils'
import { Copy, Download, Eye, Pencil, Palette, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2, Minimize2, Bold, Italic, List, ListOrdered, Quote, Code, Link as LinkIcon, Image, Table, Heading1, Heading2, Heading3, Minus, CheckSquare, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import { Logo } from '@/components/icons/Logo'
import Link from 'next/link'

// 小红书模板配置
const xiaohongshuTemplates = {
  default: {
    name: '默认模板',
    id: 'default',
    styles: 'xiaohongshu-default'
  },
  cute: {
    name: '可爱风格',
    id: 'cute',
    styles: 'xiaohongshu-cute'
  },
  minimal: {
    name: '极简风格',
    id: 'minimal',
    styles: 'xiaohongshu-minimal'
  },
  elegant: {
    name: '优雅风格',
    id: 'elegant',
    styles: 'xiaohongshu-elegant'
  }
}

const defaultMarkdown = `# 我的小红书笔记 📱

## 今天想分享的内容 ✨

**粗体文字强调重点**

*斜体文字表达情感*

### 小贴士 💡

- 第一个要点
- 第二个要点  
- 第三个要点

> 引用一些有意思的话

\`\`\`
代码片段示例
console.log('Hello Xiaohongshu!');
\`\`\`

---

记得点赞收藏哦～ ❤️`

export default function XiaohongshuMarkdownEditor() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [selectedTemplate, setSelectedTemplate] = useState('default')
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [parsedHtml, setParsedHtml] = useState('')
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isDraft, setIsDraft] = useState(false)
  const previewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  // 配置marked
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
  }, [])

  // 异步解析markdown为HTML
  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const html = await marked.parse(markdown)
        setParsedHtml(html)
      } catch (error) {
        console.error('Markdown parsing error:', error)
        setParsedHtml('<p>解析错误</p>')
      }
    }
    
    parseMarkdown()
  }, [markdown])

  // 处理文本变化
  const handleTextChange = useCallback((value: string) => {
    setMarkdown(value)
    setIsDraft(true)
  }, [])

  // 保存内容
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem('xiaohongshu_editor_content', markdown)
      setIsDraft(false)
      toast({
        title: "保存成功",
        description: "内容已保存到本地",
        duration: 2000
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "保存失败",
        description: "无法保存内容，请检查浏览器存储空间",
      })
    }
  }, [markdown, toast])

  // 工具栏插入文本
  const handleToolbarInsert = useCallback((text: string, options?: { wrap?: boolean; placeholder?: string; suffix?: string }) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = markdown.substring(start, end)
    const scrollTop = textarea.scrollTop

    let insertText = text
    
    if (options?.wrap) {
      if (selectedText) {
        insertText = text + selectedText + (options.suffix || text)
      } else {
        insertText = text + (options.placeholder || '') + (options.suffix || text)
      }
    } else {
      insertText = text + (selectedText || options?.placeholder || '')
    }

    const newValue = markdown.substring(0, start) + insertText + markdown.substring(end)
    handleTextChange(newValue)

    // 恢复光标位置
    setTimeout(() => {
      if (textarea) {
        textarea.focus()
        textarea.scrollTop = scrollTop
        if (options?.wrap && !selectedText) {
          const newPos = start + text.length + (options.placeholder?.length || 0)
          textarea.setSelectionRange(newPos, newPos)
        } else {
          const newPos = start + insertText.length
          textarea.setSelectionRange(newPos, newPos)
        }
      }
    }, 0)
  }, [markdown, handleTextChange])

  // 复制HTML内容
  const copyHTML = async () => {
    try {
      await navigator.clipboard.writeText(parsedHtml)
      toast({
        title: "复制成功",
        description: "HTML内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请重试",
        variant: "destructive",
      })
    }
  }

  // 复制Markdown内容
  const copyMarkdown = async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast({
        title: "复制成功", 
        description: "Markdown内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请重试",
        variant: "destructive",
      })
    }
  }

  // 生成图片
  const generateImage = async () => {
    if (!previewRef.current) return

    setIsGeneratingImage(true)
    try {
      // 只截取预览内容部分，不包括工具栏和边框
      const contentElement = previewRef.current.querySelector('.preview-content')
      if (!contentElement) {
        throw new Error('预览内容未找到')
      }

      const canvas = await html2canvas(contentElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2, // 提高清晰度
        useCORS: true,
        allowTaint: true,
        height: (contentElement as HTMLElement).scrollHeight,
        width: (contentElement as HTMLElement).scrollWidth,
      })

      // 下载图片
      const link = document.createElement('a')
      link.download = `xiaohongshu-note-${Date.now()}.png`
      link.href = canvas.toDataURL()
      link.click()

      toast({
        title: "图片生成成功",
        description: "图片已自动下载",
      })
    } catch (error) {
      console.error('Image generation error:', error)
      toast({
        title: "图片生成失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  // 全屏切换
  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 加载保存的内容
  useEffect(() => {
    const savedContent = localStorage.getItem('xiaohongshu_editor_content')
    if (savedContent) {
      setMarkdown(savedContent)
      setIsDraft(false)
    }
  }, [])

  const currentTemplate = xiaohongshuTemplates[selectedTemplate as keyof typeof xiaohongshuTemplates]

  // Markdown工具栏配置
  const markdownTools: Array<{ 
    icon: React.ReactNode; 
    title: string; 
    text: string; 
    wrap?: boolean; 
    placeholder?: string; 
    suffix?: string; 
  } | { type: 'separator' }> = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: '标题 1',
      text: '# ',
      placeholder: '标题'
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: '标题 2',
      text: '## ',
      placeholder: '标题'
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      title: '标题 3',
      text: '### ',
      placeholder: '标题'
    },
    { type: 'separator' },
    {
      icon: <Bold className="h-4 w-4" />,
      title: '粗体',
      text: '**',
      wrap: true,
      placeholder: '粗体文本'
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: '斜体',
      text: '*',
      wrap: true,
      placeholder: '斜体文本'
    },
    { type: 'separator' },
    {
      icon: <List className="h-4 w-4" />,
      title: '无序列表',
      text: '- ',
      placeholder: '列表项'
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: '有序列表',
      text: '1. ',
      placeholder: '列表项'
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      title: '任务列表',
      text: '- [ ] ',
      placeholder: '任务'
    },
    { type: 'separator' },
    {
      icon: <Quote className="h-4 w-4" />,
      title: '引用',
      text: '> ',
      placeholder: '引用文本'
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: '代码块',
      text: '```\n',
      wrap: true,
      suffix: '\n```',
      placeholder: '在此输入代码'
    },
    { type: 'separator' },
    {
      icon: <LinkIcon className="h-4 w-4" />,
      title: '链接',
      text: '[',
      wrap: true,
      suffix: '](url)',
      placeholder: '链接文本'
    },
    {
      icon: <Image className="h-4 w-4" />,
      title: '图片',
      text: '![',
      wrap: true,
      suffix: '](url)',
      placeholder: '图片描述'
    },
    { type: 'separator' },
    {
      icon: <Table className="h-4 w-4" />,
      title: '表格',
      text: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |',
      placeholder: ''
    },
    {
      icon: <Minus className="h-4 w-4" />,
      title: '分割线',
      text: '\n---\n',
      placeholder: ''
    }
  ]

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background">
        {/* 顶部工具栏 */}
        <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
                  <Logo className="w-6 h-6" />
                  小红书编辑器
                </Link>
                <div className="flex items-center gap-3">
                  <Palette className="h-4 w-4 text-muted-foreground" />
                  <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(xiaohongshuTemplates).map(([key, template]) => (
                        <SelectItem key={key} value={key}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {isDraft ? '未保存' : '已保存'}
                </span>
                <Button
                  variant={isDraft ? "default" : "outline"}
                  size="sm"
                  onClick={handleSave}
                >
                  <Save className="h-4 w-4 mr-1" />
                  保存
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyMarkdown}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制MD
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyHTML}
                >
                  <Copy className="h-4 w-4 mr-1" />
                  复制HTML
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={generateImage}
                  disabled={isGeneratingImage}
                >
                  {isGeneratingImage ? (
                    <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-b-transparent" />
                  ) : (
                    <ImageIcon className="h-4 w-4 mr-1" />
                  )}
                  生成图片
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 编辑器区域 */}
        <div className="flex-1 flex">
          {/* 编辑区域 */}
          <div className="w-1/2 flex flex-col border-r">
           

            {/* Markdown工具栏 */}
            <div className="flex items-center gap-0.5 px-2 py-1 border-b">
              {markdownTools.map((tool, index) => {
                if ('type' in tool && tool.type === 'separator') {
                  return <Separator key={index} orientation="vertical" className="mx-0.5 h-4" />
                }

                const toolButton = tool as { 
                  icon: React.ReactNode; 
                  title: string; 
                  text: string; 
                  wrap?: boolean; 
                  placeholder?: string; 
                  suffix?: string; 
                }

                return (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={(e) => {
                          e.preventDefault()
                          handleToolbarInsert(toolButton.text, {
                            wrap: toolButton.wrap,
                            placeholder: toolButton.placeholder,
                            suffix: toolButton.suffix
                          })
                        }}
                      >
                        {toolButton.icon}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{toolButton.title}</p>
                    </TooltipContent>
                  </Tooltip>
                )
              })}
            </div>

            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={markdown}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="在这里输入你的Markdown内容..."
                className="h-full resize-none border-0 focus-visible:ring-0 font-mono text-sm rounded-none"
              />
            </div>
          </div>

          {/* 预览区域 */}
          <div 
            ref={previewRef}
            className={cn(
              "preview-container bg-background transition-all duration-300 ease-in-out flex flex-col",
              "w-1/2",
              "markdown-body relative",
              currentTemplate?.styles
            )}
          >
            {/* 预览工具栏 */}
            <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between z-10">
              <div className="flex items-center gap-0.5 px-4 py-2">
                <span className="text-sm text-muted-foreground">预览效果</span>
              </div>
              <div className="flex items-center gap-4 px-4 py-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setZoom(zoom => Math.max(zoom - 10, 50))}
                    className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
                    disabled={zoom <= 50}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-muted-foreground">{zoom}%</span>
                  <button
                    onClick={() => setZoom(zoom => Math.min(zoom + 10, 200))}
                    className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
                    disabled={zoom >= 200}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </button>
                </div>
                <button
                  onClick={toggleFullscreen}
                  className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
                >
                  {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* 预览内容 */}
            <div 
              className="flex-1 overflow-auto"
              style={{ zoom: `${zoom}%` }}
            >
              <div className={cn(
                "preview-content py-4",
                "prose prose-slate dark:prose-invert max-w-none",
                "xiaohongshu-preview"
              )}>
                <div 
                  className="px-6"
                  dangerouslySetInnerHTML={{ __html: parsedHtml }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
} 