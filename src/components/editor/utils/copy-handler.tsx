import React from "react"

declare global {
  interface Window {
    mermaid: {
      init: (config: any, nodes: NodeListOf<Element>) => Promise<void>
    }
  }
}

type ToastFunction = {
  (props: {
    title?: string
    description?: string
    action?: React.ReactElement
    duration?: number
    variant?: "default" | "destructive"
  }): void
}

interface CopyHandlerOptions {
  toast: ToastFunction
}

/**
 * 处理 Mermaid 图表的复制
 */
async function handleMermaidCopy(mermaidElement: Element): Promise<boolean> {
  const svgElement = mermaidElement.querySelector('svg')
  if (!svgElement) return false

  // 获取原始的 Mermaid 代码
  const originalCode = mermaidElement.getAttribute('data-source') || ''
  
  // 创建一个临时的 canvas 来转换 SVG 为图片
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Failed to get canvas context')

  // 设置 canvas 尺寸为 SVG 的实际尺寸
  const svgRect = svgElement.getBoundingClientRect()
  canvas.width = svgRect.width
  canvas.height = svgRect.height

  // 创建图片对象
  const img = new Image()
  const svgData = new XMLSerializer().serializeToString(svgElement)
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' })
  const url = URL.createObjectURL(svgBlob)

  // 等待图片加载
  await new Promise((resolve, reject) => {
    img.onload = resolve
    img.onerror = reject
    img.src = url
  })

  // 绘制图片到 canvas
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.drawImage(img, 0, 0)

  // 转换为 PNG
  const pngBlob = await new Promise<Blob>((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), 'image/png', 1.0)
  })

  // 清理
  URL.revokeObjectURL(url)

  // 复制为图片、HTML 和原始文本
  await navigator.clipboard.write([
    new ClipboardItem({
      'image/png': pngBlob,
      'text/html': new Blob([svgElement.outerHTML], { type: 'text/html' }),
      'text/plain': new Blob([originalCode], { type: 'text/plain' })
    })
  ])

  return true
}

/**
 * 处理预览内容的复制
 */
async function handlePreviewCopy(previewContent: string): Promise<boolean> {
  // 创建临时容器来处理内容
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = previewContent

  // 等待所有 Mermaid 图表渲染完成
  const mermaidElements = tempDiv.querySelectorAll('.mermaid')
  if (mermaidElements.length > 0) {
    try {
      // 确保 mermaid 已经初始化
      if (typeof window.mermaid !== 'undefined') {
        // 重新初始化所有图表
        await window.mermaid.init(undefined, mermaidElements)
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error)
    }
  }

  // 处理所有的 Mermaid 图表
  const mermaidDiagrams = tempDiv.querySelectorAll('.mermaid svg')
  mermaidDiagrams.forEach(svg => {
    const container = svg.closest('.mermaid')
    if (container) {
      // 保存原始的 SVG 内容
      const originalSvg = svg.cloneNode(true)
      container.innerHTML = ''
      container.appendChild(originalSvg)
    }
  })

  // 获取处理后的 HTML 内容
  const htmlContent = tempDiv.innerHTML
  const plainText = tempDiv.textContent || tempDiv.innerText

  // 复制到剪贴板
  await navigator.clipboard.write([
    new ClipboardItem({
      'text/html': new Blob([htmlContent], { type: 'text/html' }),
      'text/plain': new Blob([plainText], { type: 'text/plain' })
    })
  ])

  return true
}

/**
 * 复制处理器
 */
export async function copyHandler(
  selection: Selection | null,
  previewContent: string,
  options: CopyHandlerOptions
): Promise<boolean> {
  const { toast } = options

  try {
    // 检查是否有选中的 Mermaid 图表
    if (selection && !selection.isCollapsed) {
      const selectedNode = selection.anchorNode?.parentElement
      if (selectedNode) {
        const mermaidElement = selectedNode.closest('.mermaid')
        if (mermaidElement) {
          const success = await handleMermaidCopy(mermaidElement)
          if (success) {
            toast({
              title: "复制成功",
              description: "已复制图表（支持粘贴为图片或源代码）",
              duration: 2000
            })
            return true
          }
        }
      }
    }

    // 复制整个预览内容
    const success = await handlePreviewCopy(previewContent)
    if (success) {
      toast({
        title: "复制成功",
        description: "已复制预览内容",
        duration: 2000
      })
      return true
    }

    return false
  } catch (err) {
    console.error('Copy error:', err)
    try {
      await navigator.clipboard.writeText(previewContent)
      toast({
        title: "复制成功",
        description: "已复制预览内容（仅文本）",
        duration: 2000
      })
      return true
    } catch (fallbackErr) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "无法访问剪贴板，请检查浏览器权限",
        action: (
          <button onClick={() => window.location.reload()} className="hover:bg-secondary">
            重试
          </button>
        )
      })
      return false
    }
  }
} 