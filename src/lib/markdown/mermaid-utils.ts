import mermaid from 'mermaid'

declare global {
  interface Window {
    mermaid: {
      init: (config: any, nodes: NodeListOf<Element>) => Promise<void>
      initialize: (config: any) => void
    }
  }
}

// Mermaid 配置
export const MERMAID_CONFIG = {
  theme: 'default' as const,
  themeVariables: {
    primaryColor: '#4f46e5',
    primaryBorderColor: '#4f46e5',
    primaryTextColor: '#000000',
    lineColor: '#666666',
    textColor: '#333333',
    fontSize: '14px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif'
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis' as const,
    padding: 15,
    nodeSpacing: 50,
    rankSpacing: 50,
    useMaxWidth: false
  },
  sequence: {
    useMaxWidth: false,
    boxMargin: 10,
    mirrorActors: false,
    bottomMarginAdj: 2
  },
  pie: {
    textPosition: 0.75,
    useMaxWidth: true
  },
  startOnLoad: false,
  securityLevel: 'loose' as const
}

/**
 * 初始化 Mermaid
 */
export const initializeMermaid = async () => {
  try {
    // 初始化配置
    mermaid.initialize(MERMAID_CONFIG)

    // 获取所有 mermaid 图表
    const elements = document.querySelectorAll('.mermaid')
    if (!elements.length) return

    // 遍历并渲染每个图表
    for (const element of Array.from(elements)) {
      try {
        // 如果已经渲染过，跳过
        if (element.querySelector('svg')) continue

        // 获取图表源码
        const source = element.textContent || ''
        if (!source.trim()) continue

        // 渲染图表
        const { svg } = await mermaid.render(
          'mermaid-' + Math.random().toString(36).substring(2),
          source
        )

        // 更新内容
        element.innerHTML = svg
      } catch (err) {
        console.error('Failed to render mermaid diagram:', err)
        element.innerHTML = `<div class="mermaid-error">图表渲染失败</div>`
      }
    }
  } catch (err) {
    console.error('Failed to initialize mermaid:', err)
  }
} 