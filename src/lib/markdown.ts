import { Marked } from 'marked'
import type { CSSProperties } from 'react'
import type { Tokens } from 'marked'

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

// 预处理函数
function preprocessMarkdown(markdown: string): string {
  // 处理 ** 语法，但排除已经是 HTML 的部分
  return markdown.replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
}

// Initialize marked instance
const marked = new Marked()

// 创建基础渲染器
const baseRenderer = new marked.Renderer()

// 重写 strong 渲染器
baseRenderer.strong = function(text) {
  return `<strong>${text}</strong>`
}

// 应用配置和渲染器
marked.setOptions({
  gfm: true,
  breaks: true,
  async: false,
  pedantic: false,
  renderer: baseRenderer
})

export function convertToWechat(markdown: string, options: RendererOptions = {}): string {
  // 创建渲染器
  const customRenderer = new marked.Renderer()

  // 继承基础渲染器
  Object.setPrototypeOf(customRenderer, baseRenderer)

  customRenderer.heading = function({ text, depth }: Tokens.Heading) {
    const style = options.block?.[`h${depth}` as keyof typeof options.block]
    const styleStr = cssPropertiesToString(style)
    return `<h${depth}${styleStr ? ` style="${styleStr}"` : ''}>${text}</h${depth}>`
  }

  customRenderer.paragraph = function({ text }: Tokens.Paragraph) {
    const style = options.block?.p
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer: customRenderer })
    return `<p${styleStr ? ` style="${styleStr}"` : ''}>${content}</p>`
  }

  customRenderer.blockquote = function({ text }: Tokens.Blockquote) {
    const style = options.block?.blockquote
    const styleStr = cssPropertiesToString(style)
    return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${text}</blockquote>`
  }

  customRenderer.code = function({ text, lang }: Tokens.Code) {
    const style = options.block?.code_pre
    const styleStr = cssPropertiesToString(style)
    return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${lang || ''}">${text}</code></pre>`
  }

  customRenderer.codespan = function({ text }: Tokens.Codespan) {
    const style = options.inline?.codespan
    const styleStr = cssPropertiesToString(style)
    return `<code${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
  }

  customRenderer.em = function({ text }: Tokens.Em) {
    const style = options.inline?.em
    const styleStr = cssPropertiesToString(style)
    return `<em${styleStr ? ` style="${styleStr}"` : ''}>${text}</em>`
  }

  customRenderer.strong = function({ text }: Tokens.Strong) {
    const style = options.inline?.strong
    const styleStr = cssPropertiesToString(style)
    return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${text}</strong>`
  }

  customRenderer.link = function({ href, title, text }: Tokens.Link) {
    const style = options.inline?.link
    const styleStr = cssPropertiesToString(style)
    return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${text}</a>`
  }

  customRenderer.image = function({ href, title, text }: Tokens.Image) {
    const style = options.block?.image
    const styleStr = cssPropertiesToString(style)
    return `<img src="${href}"${title ? ` title="${title}"` : ''} alt="${text}"${styleStr ? ` style="${styleStr}"` : ''} />`
  }

  customRenderer.list = function(body: Tokens.List) {
    const ordered = body.ordered
    const tag = ordered ? 'ol' : 'ul'
    const style = options.block?.[ordered ? 'ol' : 'ul']
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(body.raw)
    const content = marked.Parser.parseInline(tokens, { renderer: customRenderer })
    return `<${tag}${styleStr ? ` style="${styleStr}"` : ''}>${content}</${tag}>`
  }

  customRenderer.listitem = function(item: Tokens.ListItem) {
    const style = options.inline?.listitem
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(item.text)
    const content = marked.Parser.parseInline(tokens, { renderer: customRenderer })
    return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
  }

  // Convert Markdown to HTML using the custom renderer
  const html = marked.parse(markdown, { renderer: customRenderer }) as string

  // Apply base styles
  const baseStyles = baseStylesToString(options.base)
  return baseStyles ? `<div style="${baseStyles}">${html}</div>` : html
}

export function convertToXiaohongshu(markdown: string): string {
  // 预处理 markdown
  markdown = preprocessMarkdown(markdown)

  const renderer = new marked.Renderer()
  
  // 自定义渲染规则
  renderer.heading = function({ text, depth }: Tokens.Heading) {
    const fontSize = {
      [1]: '20px',
      [2]: '18px',
      [3]: '16px',
      [4]: '15px',
      [5]: '14px',
      [6]: '14px'
    }[depth] || '14px'

    return `<h${depth} style="margin-top: 25px; margin-bottom: 12px; font-weight: bold; font-size: ${fontSize}; color: #222;">${text}</h${depth}>`
  }

  renderer.paragraph = function({ text }: Tokens.Paragraph) {
    return `<p style="margin-bottom: 16px; line-height: 1.6; font-size: 15px; color: #222;">${text}</p>`
  }

  // 使用自定义渲染器转换 Markdown
  return marked.parse(markdown, { renderer }) as string
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