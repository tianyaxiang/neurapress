'use client'

import { cn } from '@/lib/utils'
import { PREVIEW_SIZES, type PreviewSize } from '../constants'
import { Loader2, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react'
import { templates } from '@/config/wechat-templates'
import { useState, useRef, useEffect, useMemo } from 'react'
import { type CodeThemeId } from '@/config/code-themes'
import { useTheme } from 'next-themes'
import '@/styles/code-themes.css'
import mermaid from 'mermaid'

interface EditorPreviewProps {
  previewRef: React.RefObject<HTMLDivElement>
  selectedTemplate?: string
  previewSize: PreviewSize
  isConverting: boolean
  previewContent: string
  codeTheme: CodeThemeId
  onPreviewSizeChange: (size: PreviewSize) => void
}

export function EditorPreview({
  previewRef,
  selectedTemplate,
  previewSize,
  isConverting,
  previewContent,
  codeTheme,
  onPreviewSizeChange
}: EditorPreviewProps) {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const isScrolling = useRef<boolean>(false)
  const { theme } = useTheme()

  // 初始化 Mermaid
  useEffect(() => {
    mermaid.initialize({
      theme: theme === 'dark' ? 'dark' : 'default',
      startOnLoad: false,
      securityLevel: 'loose',
      fontFamily: 'var(--font-sans)',
      fontSize: 14,
      flowchart: {
        htmlLabels: true,
        curve: 'basis',
        padding: 15,
        useMaxWidth: false,
        defaultRenderer: 'dagre-d3'
      },
      sequence: {
        useMaxWidth: false,
        boxMargin: 10,
        mirrorActors: false,
        bottomMarginAdj: 2,
        rightAngles: true,
        showSequenceNumbers: false
      },
      pie: {
        useMaxWidth: true,
        textPosition: 0.5,
        useWidth: 800
      },
      gantt: {
        useMaxWidth: false,
        leftPadding: 75,
        rightPadding: 20
      }
    })
  }, [theme])

  // 使用 memo 包装预览内容
  const PreviewContent = useMemo(() => {
    return (
      <div className={cn(
        "preview-content py-4",
        "prose prose-slate dark:prose-invert max-w-none",
        selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
      )}>
        <div 
          className="px-6"
          dangerouslySetInnerHTML={{ __html: previewContent }}
        />
      </div>
    )
  }, [previewContent, selectedTemplate])

  // 渲染 Mermaid 图表
  useEffect(() => {
    const renderMermaid = async () => {
      try {
        const elements = document.querySelectorAll('.mermaid')
        if (!elements.length) return

        // 重新初始化所有图表
        await Promise.all(Array.from(elements).map(async (element) => {
          try {
            // 获取内容
            const content = element.textContent?.trim() || ''
            if (!content) return

            // 清空容器
            element.innerHTML = ''
            
            // 重新渲染
            const { svg } = await mermaid.render(
              `mermaid-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
              content
            )

            // 更新内容
            element.innerHTML = svg

            // 添加暗色模式支持
            if (theme === 'dark') {
              const svgElement = element.querySelector('svg')
              if (svgElement) {
                svgElement.style.filter = 'invert(0.85)'
              }
            }
          } catch (error) {
            console.error('Failed to render mermaid diagram:', {
              error,
              element,
              content: element.textContent
            })
            element.innerHTML = `
              <div class="rounded-lg overflow-hidden border border-red-200">
                <div class="bg-red-50 p-3 text-red-700 text-sm">
                  Failed to render diagram
                </div>
                <pre class="bg-white p-3 m-0 text-sm overflow-x-auto whitespace-pre-wrap break-all">
                  ${element.textContent || ''}
                </pre>
                <div class="bg-red-50 p-3 text-red-600 text-sm border-t border-red-200">
                  ${error instanceof Error ? error.message : 'Unknown error'}
                </div>
              </div>
            `
          }
        }))
      } catch (error) {
        console.error('Failed to initialize mermaid diagrams:', error)
      }
    }

    if (!isConverting) {
      renderMermaid()
    }
  }, [previewContent, theme, isConverting])

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

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50))
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      previewRef.current?.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  return (
    <div 
      ref={previewRef}
      className={cn(
        "preview-container bg-background transition-all duration-300 ease-in-out flex flex-col",
        "h-full sm:w-1/2",
        "markdown-body relative",
        selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles,
        `code-theme-${codeTheme}`
      )}
    >
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between z-10 sticky top-0 left-0 right-0">
        <div className="flex items-center gap-0.5 px-2">
          <span className="text-sm text-muted-foreground">预览效果</span>
        </div>
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">{zoom}%</span>
            <button
              onClick={handleZoomIn}
              className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={previewSize}
              onChange={(e) => onPreviewSizeChange(e.target.value as PreviewSize)}
              className="text-sm border rounded px-2 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
            >
              {Object.entries(PREVIEW_SIZES).map(([key, { label }]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <button
              onClick={toggleFullscreen}
              className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
            >
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto"
        onScroll={(e) => {
          const container = e.currentTarget
          const textarea = document.querySelector('.editor-container textarea')
          if (!textarea || isScrolling.current) return
          isScrolling.current = true

          try {
            const scrollPercentage = container.scrollTop / (container.scrollHeight - container.clientHeight)
            const textareaScrollTop = scrollPercentage * (textarea.scrollHeight - textarea.clientHeight)
            textarea.scrollTop = textareaScrollTop
          } finally {
            requestAnimationFrame(() => {
              isScrolling.current = false
            })
          }
        }}
      >
        <div className="h-full py-8 px-4">
          <div 
            className={cn(
              "bg-background mx-auto rounded-lg transition-all duration-300",
              previewSize === 'full' ? '' : 'border shadow-sm'
            )}
            style={{ 
              width: PREVIEW_SIZES[previewSize].width,
              maxWidth: '100%',
              transform: `scale(${zoom / 100})`,
              transformOrigin: 'top center',
              transition: 'transform 0.2s ease-in-out'
            }}
          >
            {isConverting ? (
              <div className="flex flex-col items-center justify-center gap-2 p-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">正在生成预览...</span>
              </div>
            ) : PreviewContent}
          </div>
        </div>
      </div>
    </div>
  )
} 