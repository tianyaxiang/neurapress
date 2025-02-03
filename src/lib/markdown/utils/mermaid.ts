import mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'
import type { MermaidError, MermaidTheme } from '../types/mermaid'
import { createMermaidConfig } from '../config/mermaid'

/**
 * 初始化 Mermaid
 */
export const initializeMermaid = (theme: MermaidTheme = 'default', config?: Partial<MermaidConfig>) => {
  const defaultConfig = createMermaidConfig(theme)
  mermaid.initialize({
    ...defaultConfig,
    ...config
  })
}

/**
 * 渲染单个 Mermaid 图表
 */
export const renderMermaidDiagram = async (
  content: string,
  config?: Partial<MermaidConfig>
): Promise<{ svg: string }> => {
  try {
    // 先尝试解析，检查语法错误
    await mermaid.parse(content)

    // 生成唯一 ID
    const id = `mermaid-${Date.now()}-${Math.random().toString(36).substring(2)}`
    
    // 渲染图表
    return await mermaid.render(id, content)
  } catch (error) {
    const mermaidError: MermaidError = {
      content,
      message: error instanceof Error ? error.message : '未知错误',
      error: error instanceof Error ? error : new Error('未知错误')
    }
    throw mermaidError
  }
}

/**
 * 批量渲染页面中的 Mermaid 图表
 */
export const renderMermaidDiagrams = async (selector = '.mermaid') => {
  try {
    const elements = document.querySelectorAll<HTMLElement>(selector)
    if (!elements.length) return

    for (const element of Array.from(elements)) {
      try {
        // 如果已经渲染过，跳过
        if (element.querySelector('svg')) continue

        // 获取图表源码
        const source = element.textContent?.trim() || ''
        if (!source) continue

        // 渲染图表
        const { svg } = await renderMermaidDiagram(source)
        element.innerHTML = svg
      } catch (error) {
        console.error('Failed to render mermaid diagram:', error)
        const errorMessage = error instanceof Error ? error.message : '图表渲染失败'
        const errorContent = element.textContent?.trim() || ''
        element.innerHTML = `
          <div class="mermaid-error rounded-lg overflow-hidden border border-red-200">
            <div class="bg-red-50 p-3 text-red-700 text-sm">${errorMessage}</div>
            <pre class="bg-white p-3 m-0 text-sm overflow-x-auto">${errorContent}</pre>
          </div>
        `
      }
    }
  } catch (error) {
    console.error('Failed to initialize mermaid:', error)
  }
}

/**
 * 获取当前主题
 */
export const getCurrentTheme = (): MermaidTheme => {
  if (typeof window === 'undefined') return 'default'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'default'
} 