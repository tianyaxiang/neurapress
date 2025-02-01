import { Marked } from 'marked'
import type { CSSProperties } from 'react'
import type { Tokens } from 'marked'

// 将样式对象转换为 CSS 字符串
function cssPropertiesToString(style: StyleOptions = {}): string {
  return Object.entries(style)
    .filter(([_, value]) => value !== undefined)
    .map(([key, value]) => {
      // 转换驼峰命名为连字符命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      return `${cssKey}: ${value}`
    })
    .join(';')
}

// 将基础样式选项转换为 CSS 字符串
function baseStylesToString(base: RendererOptions['base'] = {}): string {
  const styles: string[] = []

  if (base.lineHeight) {
    styles.push(`line-height: ${base.lineHeight}`)
  }
  if (base.fontSize) {
    styles.push(`font-size: ${base.fontSize}`)
  }

  return styles.join(';')
}

// 预处理函数
function preprocessMarkdown(markdown: string): string {
  return markdown
    // 处理 ** 语法，但排除已经是 HTML 的部分
    .replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
    // 处理无序列表的 - 标记，但排除代码块内的部分
    .replace(/^(?!\s*```)([ \t]*)-\s+/gm, '$1• ')
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

const defaultOptions: RendererOptions = {
  base: {
    primaryColor: '#333333',
    textAlign: 'left',
    lineHeight: '1.75',
    fontSize: '15px',
    themeColor: '#1a1a1a'
  },
  block: {
    h1: { fontSize: '24px' },
    h2: { fontSize: '20px' },
    h3: { fontSize: '18px' },
    p: { fontSize: '15px', color: '#333333' },
    code_pre: { fontSize: '14px', color: '#333333' },
    blockquote: { fontSize: '15px', color: '#666666' }
  },
  inline: {
    link: { color: '#576b95' },
    codespan: { color: '#333333' },
    em: { color: '#666666' }
  }
}

export function convertToWechat(markdown: string, options: RendererOptions = defaultOptions): string {
  const renderer = new marked.Renderer()
  
  // 继承基础渲染器
  Object.setPrototypeOf(renderer, baseRenderer)

  // 合并选项
  const mergedOptions = {
    base: { ...defaultOptions.base, ...options.base },
    block: { ...defaultOptions.block, ...options.block },
    inline: { ...defaultOptions.inline, ...options.inline }
  }

  renderer.heading = function({ text, depth }: Tokens.Heading) {
    const style = {
      ...mergedOptions.block?.[`h${depth}`],
      color: mergedOptions.base?.themeColor, // 使用主题颜色
      textAlign: mergedOptions.base?.textAlign // 添加文本对齐
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    return `<h${depth}${styleStr ? ` style="${styleStr}"` : ''}>${content}</h${depth}>`
  }

  renderer.paragraph = function({ text }: Tokens.Paragraph) {
    const style = mergedOptions.block?.p || {}
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    return `<p style="${styleStr}">${content}</p>`
  }

  renderer.blockquote = function({ text }: Tokens.Blockquote) {
    const style = mergedOptions.block?.blockquote
    const styleStr = cssPropertiesToString(style)
    return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${text}</blockquote>`
  }

  renderer.code = function({ text, lang }: Tokens.Code) {
    const style = mergedOptions.block?.code_pre
    const styleStr = cssPropertiesToString(style)
    return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${lang || ''}">${text}</code></pre>`
  }

  renderer.codespan = function({ text }: Tokens.Codespan) {
    const style = mergedOptions.inline?.codespan
    const styleStr = cssPropertiesToString(style)
    return `<code${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
  }

  renderer.em = function({ text }: Tokens.Em) {
    const style = mergedOptions.inline?.em
    const styleStr = cssPropertiesToString(style)
    return `<em${styleStr ? ` style="${styleStr}"` : ''}>${text}</em>`
  }

  renderer.strong = function({ text }: Tokens.Strong) {
    const style = mergedOptions.inline?.strong
    const styleStr = cssPropertiesToString(style)
    return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${text}</strong>`
  }

  renderer.link = function({ href, title, text }: Tokens.Link) {
    const style = mergedOptions.inline?.link
    const styleStr = cssPropertiesToString(style)
    return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${text}</a>`
  }

  renderer.image = function({ href, title, text }: Tokens.Image) {
    const style = mergedOptions.block?.image
    const styleStr = cssPropertiesToString(style)
    return `<img src="${href}"${title ? ` title="${title}"` : ''} alt="${text}"${styleStr ? ` style="${styleStr}"` : ''} />`
  }

// 重写 list 方法
renderer.list = function(token: Tokens.List): string {
    const tag = token.ordered ? 'ol' : 'ul'
    try {
      const style = mergedOptions.block?.[token.ordered ? 'ol' : 'ul']
      const styleStr = cssPropertiesToString(style)
      const startAttr = token.ordered && token.start !== 1 ? ` start="${token.start}"` : ''
      
      return `<${tag}${startAttr}${styleStr ? ` style="${styleStr}"` : ''}>${token.items.map(item => renderer.listitem(item)).join('')}</${tag}>`
    } catch (error) {
      console.error(`Error rendering list: ${error}`)
      return `<${tag}>${token.items.map(item => renderer.listitem(item)).join('')}</${tag}>`
    }
}

// 重写 listitem 方法
renderer.listitem = function(item: Tokens.ListItem) {
    try {
      const style = mergedOptions.inline?.listitem
      const styleStr = cssPropertiesToString(style)
      
      // 移除列表项开头的破折号和空格
      let itemText = item.text.replace(/^- /, '')
      
      // 处理任务列表项
      if (item.task) {
        const checkbox = `<input type="checkbox"${item.checked ? ' checked=""' : ''} disabled="" /> `
        itemText = checkbox + itemText
      }
      
      // 使用 Lexer 和 Parser 处理剩余的内联标记
      const tokens = marked.Lexer.lexInline(itemText)
      const content = marked.Parser.parseInline(tokens, { renderer })
      
      return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
    } catch (error) {
      console.error(`Error rendering list item: ${error}`)
      return `<li>${item.text}</li>`
    }
  }
  
  // Convert Markdown to HTML using the custom renderer
  const html = marked.parse(markdown, { renderer }) as string

  // Apply base styles
  const baseStyles = baseStylesToString(mergedOptions.base)
  return baseStyles ? `<section style="${baseStyles}">${html}</section>` : html
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

export interface StyleOptions {
  fontSize?: string
  color?: string
  margin?: string
  padding?: string
  border?: string
  borderLeft?: string
  borderBottom?: string
  borderRadius?: string
  background?: string
  fontWeight?: string
  fontStyle?: string
  textDecoration?: string
  display?: string
  lineHeight?: string | number
  textAlign?: string
  paddingLeft?: string
  overflowX?: string
  width?: string
  letterSpacing?: string
  fontFamily?: string
  WebkitBackgroundClip?: string
  WebkitTextFillColor?: string
  listStyle?: string
  '@media (max-width: 768px)'?: {
    margin?: string
    padding?: string
    fontSize?: string
  }
}

export interface RendererOptions {
  base?: {
    primaryColor?: string
    textAlign?: string
    lineHeight?: string | number
    fontSize?: string
    themeColor?: string
    padding?: string
    maxWidth?: string
    margin?: string
    wordBreak?: string
    whiteSpace?: string
    color?: string
    fontFamily?: string
  }
  block?: {
    [key: string]: StyleOptions
  }
  inline?: {
    [key: string]: StyleOptions
  }
  dark?: {
    base?: {
      color?: string
    }
    block?: {
      [key: string]: {
        color?: string
        background?: string
        border?: string
        borderLeftColor?: string
        boxShadow?: string
      }
    }
  }
}