import { marked, type Tokens } from 'marked'
import type { CSSProperties } from 'react'

// 配置 marked 选项
marked.setOptions({
  gfm: true,
  breaks: true,
  headerIds: false,
  mangle: false,
})

// 将 React CSSProperties 转换为 CSS 字符串
function cssPropertiesToString(style: React.CSSProperties = {}): string {
  return Object.entries(style)
    .map(([key, value]) => {
      // 转换驼峰命名为连字符命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      // 处理对象类型的值
      if (value && typeof value === 'object') {
        if ('toString' in value) {
          return `${cssKey}: ${value.toString()}`
        }
        return `${cssKey}: ${JSON.stringify(value)}`
      }
      return `${cssKey}: ${value}`
    })
    .filter(Boolean)
    .join(';')
}

// 将基础样式选项转换为 CSS 字符串
function baseStylesToString(base: RendererOptions['base'] = {}): string {
  const styles: string[] = []
  
  if (base.primaryColor) {
    styles.push(`--md-primary-color: ${base.primaryColor}`)
  }
  if (base.textAlign) {
    styles.push(`text-align: ${base.textAlign}`)
  }
  if (base.lineHeight) {
    styles.push(`line-height: ${base.lineHeight}`)
  }

  return styles.join(';')
}

export function convertToWechat(markdown: string, options: RendererOptions = {}): string {
  const renderer = new marked.Renderer()
  // 标题渲染
  renderer.heading = ({ tokens, depth }: { tokens: Tokens.Generic[]; depth: number }) => {
    const style = options.block?.[`h${depth}` as keyof RendererOptions['block']]
    const styleStr = cssPropertiesToString(style)
    const content = tokens.map(token => token.text).join('')
    return `<h${depth}${styleStr ? ` style="${styleStr}"` : ''}>${content}</h${depth}>`
  } 

  // 段落渲染
  renderer.paragraph = (text) => {
    const style = options.block?.p
    const styleStr = cssPropertiesToString(style)   
    const content = typeof text === 'object' ? (text.text || text.toString()) : text

    return `<p${styleStr ? ` style="${styleStr}"` : ''}>${content}</p>`
  }

  // 引用渲染
  renderer.blockquote = (quote) => {
    const style = options.block?.blockquote
    const styleStr = cssPropertiesToString(style)
    const content = typeof quote === 'object' ? (quote.text || quote.toString()) : quote

    return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${content}</blockquote>`
  }

  // 代码块渲染
  renderer.code = ({ text, lang = '' }: { text: string; lang?: string }) => {
    const style = options.block?.code_pre
    const styleStr = cssPropertiesToString(style)
    return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${lang}">${text}</code></pre>`
  }

  // 行内代码渲染
  renderer.codespan = (code) => {
    const style = options.inline?.codespan
    const styleStr = cssPropertiesToString(style)
    return `<code${styleStr ? ` style="${styleStr}"` : ''}>${code}</code>`
  }

  // 强调（斜体）渲染
  renderer.em = (text) => {
    const style = options.inline?.em
    const styleStr = cssPropertiesToString(style)
    return `<em${styleStr ? ` style="${styleStr}"` : ''}>${text}</em>`
  }

  // 加粗渲染
  renderer.strong = (text) => {
    const style = options.inline?.strong
    const styleStr = cssPropertiesToString(style)
    return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${text}</strong>`
  }

  // 链接渲染
  renderer.link = (href, title, text) => {
    const style = options.inline?.link
    const styleStr = cssPropertiesToString(style)
    return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${text}</a>`
  }

  // 图片渲染
  renderer.image = (href, title, text) => {
    const style = options.block?.image
    const styleStr = cssPropertiesToString(style)
    return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''} />`
  }

  // 列表渲染
  renderer.list = (token: Tokens.List) => {
    const tag = token.ordered ? 'ol' : 'ul'
    const style = options.block?.[token.ordered ? 'ol' : 'ul']
    const styleStr = cssPropertiesToString(style)
    return `<${tag}${styleStr ? ` style="${styleStr}"` : ''}>${token.items.map(item => item.text).join('')}</${tag}>`
  }

  // 列表项渲染
  renderer.listitem = (text) => {
    const style = options.inline?.listitem
    const styleStr = cssPropertiesToString(style)
    return `<li${styleStr ? ` style="${styleStr}"` : ''}>${text}</li>`
  }

  marked.use({ renderer })

  // 转换 Markdown 为 HTML
  const html = marked.parse(markdown, { async: false }) as string

  // 应用基础样式
  const baseStyles = baseStylesToString(options.base)
  return baseStyles ? `<div style="${baseStyles}">${html}</div>` : html
}

// 转换为小红书格式
export function convertToXiaohongshu(markdown: string): string {
  // 配置小红书特定的样式
  const xiaohongshuRenderer = new marked.Renderer()
  
  xiaohongshuRenderer.heading = (text, level) => {
    const fontSize = {
      1: '20px',
      2: '18px',
      3: '16px',
      4: '15px',
      5: '14px',
      6: '14px'
    }[level]

    return `<h${level} style="margin-top: 25px; margin-bottom: 12px; font-weight: bold; font-size: ${fontSize}; color: #222;">${text}</h${level}>`
  }

  xiaohongshuRenderer.paragraph = (text) => {
    return `<p style="margin-bottom: 16px; line-height: 1.6; font-size: 15px; color: #222;">${text}</p>`
  }

  marked.setOptions({ renderer: xiaohongshuRenderer })

  let html = marked(markdown)
  html = `<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, sans-serif; color: #222; line-height: 1.6;">${html}</div>`

  return html
}

type RendererOptions = {
  base?: {
    primaryColor?: string
    textAlign?: string
    lineHeight?: string | number
  }
  block?: {
    h1?: CSSProperties
    h2?: CSSProperties
    h3?: CSSProperties
    h4?: CSSProperties
    h5?: CSSProperties
    h6?: CSSProperties
    p?: CSSProperties
    blockquote?: CSSProperties
    code_pre?: CSSProperties
    image?: CSSProperties
    ul?: CSSProperties
    ol?: CSSProperties
  }
  inline?: {
    strong?: CSSProperties
    em?: CSSProperties
    codespan?: CSSProperties
    link?: CSSProperties
    listitem?: CSSProperties
  }
}

export type { RendererOptions }