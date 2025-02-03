'use client'

import { useEffect, useRef } from 'react'
import type { MermaidRendererProps } from '../types/mermaid'
import { getCurrentTheme, initializeMermaid, renderMermaidDiagram } from '../utils/mermaid'
import { useTheme } from 'next-themes'

export function MermaidRenderer({
  content,
  className = '',
  config,
  onRender,
  onError
}: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        // 初始化 mermaid
        const currentTheme = getCurrentTheme()
        initializeMermaid(currentTheme, config)

        // 清空容器内容
        containerRef.current.innerHTML = ''

        // 创建新的渲染容器
        const renderContainer = document.createElement('div')
        renderContainer.className = 'mermaid-render'
        containerRef.current.appendChild(renderContainer)

        // 渲染图表
        const { svg } = await renderMermaidDiagram(content, config)
        
        // 更新内容
        if (containerRef.current) {
          renderContainer.innerHTML = svg
          // 添加原始内容的隐藏元素，用于复制等功能
          const sourceElement = document.createElement('div')
          sourceElement.className = 'mermaid-source'
          sourceElement.style.display = 'none'
          sourceElement.textContent = content
          containerRef.current.appendChild(sourceElement)
        }

        // 调用渲染完成回调
        onRender?.(svg)
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error)
        
        if (!containerRef.current) return
        
        // 显示错误信息
        containerRef.current.innerHTML = `
          <div class="mermaid-error rounded-lg overflow-hidden border border-red-200">
            <div class="bg-red-50 p-3 text-red-700 text-sm">
              Mermaid 语法错误
            </div>
            <pre class="mermaid-source bg-white p-3 m-0 text-sm overflow-x-auto whitespace-pre-wrap break-all">
              ${content}
            </pre>
            <div class="bg-red-50 p-3 text-red-600 text-sm border-t border-red-200 whitespace-pre-wrap break-all">
              ${error instanceof Error ? error.message : '未知错误'}
            </div>
          </div>
        `

        // 调用错误回调
        if (error instanceof Error) {
          onError?.({
            content,
            message: error.message,
            error
          })
        }
      }
    }

    renderDiagram()
  }, [content, config, theme, onRender, onError])

  return (
    <div
      ref={containerRef}
      className={`mermaid ${className}`}
      data-theme={theme}
    />
  )
} 