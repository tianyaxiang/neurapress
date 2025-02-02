import { Marked } from 'marked'
import type { CSSProperties } from 'react'
import type { Tokens } from 'marked'
import { codeThemes, type CodeThemeId } from '@/config/code-themes'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-nginx'
import { StyleOptions, type RendererOptions } from '@/lib/types'

// 将样式对象转换为 CSS 字符串
function cssPropertiesToString(style: StyleOptions = {}): string {
  if (!style) return ''

  return Object.entries(style)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      // 处理媒体查询
      if (key === '@media (max-width: 768px)') {
        return ''  // 我们不在内联样式中包含媒体查询
      }
      
      // 转换驼峰命名为连字符命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      
      // 处理数字值
      if (typeof value === 'number' && !cssKey.includes('line-height')) {
        value = `${value}px`
      }

      return `${cssKey}: ${value}`
    })
    .filter(Boolean)  // 移除空字符串
    .join(';')
}

// 将基础样式选项转换为 CSS 字符串
function baseStylesToString(base: RendererOptions['base'] = {}): string {
  if (!base) return ''

  const styles: string[] = []

  if (base.lineHeight) {
    styles.push(`line-height: ${base.lineHeight}`)
  }
  if (base.fontSize) {
    styles.push(`font-size: ${base.fontSize}`)
  }
  if (base.textAlign) {
    styles.push(`text-align: ${base.textAlign}`)
  }
  if (base.themeColor) {
    styles.push(`--theme-color: ${base.themeColor}`)
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
const marked = new Marked({
  gfm: true,
  breaks: true,
  async: false,
  pedantic: false
})

// 重写 marked 配置
marked.use({
  breaks: true,
  gfm: true,
  walkTokens(token: Tokens.Generic) {
    // 确保列表项被正确处理
    if (token.type === 'list') {
      (token as Tokens.List).items.forEach(item => {
        if (item.task) {
          item.checked = !!item.checked
        }
      })
    }
  }
})

const defaultOptions: RendererOptions = {
  base: {
    themeColor: '#1a1a1a',
    fontSize: '15px',
    lineHeight: '1.75',
    textAlign: 'left'
  },
  block: {
    code_pre: {
      fontSize: '14px',
      overflowX: 'auto',
      borderRadius: '8px',
      padding: '1em',
      lineHeight: '1.5',
      margin: '10px 8px'
    },
    table: {
      width: '100%',
      marginBottom: '1em',
      borderCollapse: 'collapse',
      fontSize: '14px'
    },
    th: {
      padding: '0.5em 1em',
      borderBottom: '2px solid var(--theme-color)',
      textAlign: 'left',
      fontWeight: 'bold'
    },
    td: {
      padding: '0.5em 1em',
      borderBottom: '1px solid #eee'
    },
    footnotes: {
      marginTop: '2em',
      paddingTop: '1em',
      borderTop: '1px solid #eee',
      fontSize: '0.9em',
      color: '#666'
    }
  },
  inline: {
    link: { color: '#576b95' },
    codespan: { color: '#333333' },
    em: { color: '#666666' },
    del: { color: '#999999', textDecoration: 'line-through' },
    checkbox: {
      marginRight: '0.5em',
      verticalAlign: 'middle'
    }
  }
}

// 获取代码主题的样式
export function getCodeThemeStyles(theme: CodeThemeId): StyleOptions {
  const themeConfig = codeThemes.find(t => t.id === theme)
  if (!themeConfig) return {}

  return {
    background: themeConfig.theme.background,
    color: themeConfig.theme.text,
  }
}

// 获取代码token的样式
function getTokenStyles(theme: CodeThemeId, tokenType: string): string {
  const themeConfig = codeThemes.find(t => t.id === theme)
  if (!themeConfig) return ''

  const tokenColor = themeConfig.theme[tokenType as keyof typeof themeConfig.theme]
  if (!tokenColor) return ''
  return `color: ${tokenColor};`
}

export function convertToWechat(markdown: string, options: RendererOptions = defaultOptions): string {
  const renderer = new marked.Renderer()
  
  // 合并选项
  const mergedOptions = {
    base: { ...defaultOptions.base, ...options.base },
    block: { ...defaultOptions.block, ...options.block },
    inline: { ...defaultOptions.inline, ...options.inline },
    codeTheme: options.codeTheme || codeThemes[0].id
  }

  // 重写 heading 方法
  renderer.heading = function({ text, depth }: Tokens.Heading) {
    const headingKey = `h${depth}` as keyof RendererOptions['block']
    const headingStyle = (mergedOptions.block?.[headingKey] || {}) as StyleOptions
    const style: StyleOptions = {
      ...headingStyle,
      color: mergedOptions.base?.themeColor
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    return `<h${depth}${styleStr ? ` style="${styleStr}"` : ''}>${content}</h${depth}>`
  }

  // 重写 paragraph 方法
  renderer.paragraph = function({ text, tokens }: Tokens.Paragraph) {
    const paragraphStyle = (mergedOptions.block?.p || {}) as StyleOptions
    const style: StyleOptions = {
      ...paragraphStyle,
      fontSize: mergedOptions.base?.fontSize,
      lineHeight: mergedOptions.base?.lineHeight
    }
    const styleStr = cssPropertiesToString(style)

    // 处理段落中的内联标记
    let content = text
    if (tokens) {
      content = tokens.map(token => {
        if (token.type === 'text') {
          const inlineTokens = marked.Lexer.lexInline(token.text)
          return marked.Parser.parseInline(inlineTokens, { renderer })
        }
        return marked.Parser.parseInline([token], { renderer })
      }).join('')
    } else {
      const inlineTokens = marked.Lexer.lexInline(text)
      content = marked.Parser.parseInline(inlineTokens, { renderer })
    }

    return `<p${styleStr ? ` style="${styleStr}"` : ''}>${content}</p>`
  }

  // 重写 blockquote 方法
  renderer.blockquote = function({ text }: Tokens.Blockquote) {
    const blockquoteStyle = (mergedOptions.block?.blockquote || {}) as StyleOptions
    const style: StyleOptions = {
      ...blockquoteStyle,
      borderLeft: `4px solid ${mergedOptions.base?.themeColor || '#1a1a1a'}`
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    
    return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${content}</blockquote>`
  }

  // 重写 code 方法
  renderer.code = function({ text, lang }: Tokens.Code) {  
    const codeStyle = (mergedOptions.block?.code_pre || {}) as StyleOptions
    const style: StyleOptions = {
      ...codeStyle,
      ...getCodeThemeStyles(mergedOptions.codeTheme)
    }
    const styleStr = cssPropertiesToString(style)
    
    // 代码高亮处理
    let highlighted = text
    if (lang && Prism.languages[lang]) {
      // Helper function to recursively process tokens
      const processToken = (token: string | Prism.Token, lineNumber?: number): string => {
        if (typeof token === 'string') {
          return token
        }

        const tokenStyle = getTokenStyles(mergedOptions.codeTheme, token.type)
        const content = Array.isArray(token.content)
          ? token.content.map(t => processToken(t)).join('')
          : processToken(token.content)

        return `<span style="${tokenStyle}">${content}</span>`
      }

      try {
        const grammar = Prism.languages[lang]
        const tokens = Prism.tokenize(text, grammar)
        const lines = text.split('\n')
        const lineNumbersWidth = lines.length.toString().length * 8 + 20
        
        highlighted = lines.map((line, index) => {
          const lineTokens = Prism.tokenize(line, grammar)
          const processedLine = lineTokens.map(t => processToken(t, index + 1)).join('')
          return `<div class="code-line"><span class="line-number" style="width:${lineNumbersWidth}px;color:#999;padding-right:1em;text-align:right;display:inline-block;user-select:none;">${index + 1}</span>${processedLine}</div>`
        }).join('\n')
      } catch (error) {
        console.error(`Error highlighting code: ${error}`)
      }
    }

    return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${lang || ''}">${highlighted}</code></pre>`
  }

  // 重写 codespan 方法
  renderer.codespan = function({ text }: Tokens.Codespan) {  
    const codespanStyle = (mergedOptions.inline?.codespan || {}) as StyleOptions
    const style: StyleOptions = {
      ...codespanStyle
    }
    const styleStr = cssPropertiesToString(style)
    return `<code${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
  }

  // 重写 em 方法
  renderer.em = function({ text }: Tokens.Em) {
    const emStyle = (mergedOptions.inline?.em || {}) as StyleOptions
    const style: StyleOptions = {
      ...emStyle,
      fontStyle: 'italic'
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    
    return `<em${styleStr ? ` style="${styleStr}"` : ''}>${content}</em>`
  }

  // 重写 strong 方法
  renderer.strong = function({ text }: Tokens.Strong) {
    const strongStyle = (mergedOptions.inline?.strong || {}) as StyleOptions
    const style: StyleOptions = {
      ...strongStyle,
      color: mergedOptions.base?.themeColor,
      fontWeight: 'bold'
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    
    return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${content}</strong>`
  }

  // 重写 link 方法
  renderer.link = function({ href, title, text }: Tokens.Link) {
    const linkStyle = (mergedOptions.inline?.link || {}) as StyleOptions
    const style: StyleOptions = {
      ...linkStyle
    }
    const styleStr = cssPropertiesToString(style)
    const tokens = marked.Lexer.lexInline(text)
    const content = marked.Parser.parseInline(tokens, { renderer })
    return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${content}</a>`
  }

  // 重写 image 方法
  renderer.image = function({ href, title, text }: Tokens.Image) {
    const imageStyle = (mergedOptions.block?.image || {}) as StyleOptions
    const style: StyleOptions = {
      ...imageStyle,
      maxWidth: '100%',
      display: 'block',
      margin: '0.5em auto'
    }
    const styleStr = cssPropertiesToString(style)
    return `<img src="${href}"${title ? ` title="${title}"` : ''} alt="${text}"${styleStr ? ` style="${styleStr}"` : ''}>`
  }

  // 重写 list 方法
  renderer.list = function(token: Tokens.List) {
    const tag = token.ordered ? 'ol' : 'ul'
    const listStyle = (mergedOptions.block?.[tag] || {}) as StyleOptions
    const style: StyleOptions = {
      ...listStyle,
      listStyle: token.ordered ? 'decimal' : 'disc',
      paddingLeft: '2em',
      marginBottom: '16px'
    }
    const styleStr = cssPropertiesToString(style)
    const startAttr = token.ordered && token.start !== 1 ? ` start="${token.start}"` : ''
    
    const items = token.items.map(item => {
      let itemText = item.text
      if (item.task) {
        const checkbox = `<input type="checkbox"${item.checked ? ' checked=""' : ''} disabled="" /> `
        itemText = checkbox + itemText
      }
      return renderer.listitem({ ...item, text: itemText })
    }).join('')
    
    return `<${tag}${startAttr}${styleStr ? ` style="${styleStr}"` : ''}>${items}</${tag}>`
  }

  // 重写 listitem 方法
  renderer.listitem = function(item: Tokens.ListItem) {
    const listitemStyle = (mergedOptions.inline?.listitem || {}) as StyleOptions
    const style: StyleOptions = {
      ...listitemStyle,
      marginBottom: '8px',
      display: 'list-item'
    }
    const styleStr = cssPropertiesToString(style)
    
    // 处理嵌套列表
    let content = item.text
    if (item.tokens) {
      content = item.tokens.map(token => {
        if (token.type === 'list') {
          // 递归处理嵌套列表
          return renderer.list(token as Tokens.List)
        } else {
          // 处理其他类型的 token
          const tokens = marked.Lexer.lexInline(token.raw)
          return marked.Parser.parseInline(tokens, { renderer })
        }
      }).join('')
    } else {
      // 如果没有 tokens，则按普通文本处理
      const tokens = marked.Lexer.lexInline(content)
      content = marked.Parser.parseInline(tokens, { renderer })
    }
    
    return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
  }



  // 添加删除线支持
  renderer.del = function({ text }: Tokens.Del) {
    const delStyle = (mergedOptions.inline?.del || {}) as StyleOptions
    const styleStr = cssPropertiesToString(delStyle)
    return `<del${styleStr ? ` style="${styleStr}"` : ''}>${text}</del>`
  }

  // 添加脚注支持
  const footnotes = new Map<string, string>()

  marked.use({
    extensions: [{
      name: 'footnote',
      level: 'inline',
      start(src: string) { 
        const match = src.match(/^\[\^([^\]]+)\]/)
        return match ? match.index : undefined 
      },
      tokenizer(src: string) {
        const match = /^\[\^([^\]]+)\]/.exec(src)
        if (match) {
          const token = {
            type: 'footnote',
            raw: match[0],
            text: match[1],
            tokens: []
          }
          return token as unknown as Tokens.Generic
        }
        return undefined
      },
      renderer(token: unknown) {
        const footnoteToken = token as { text: string }
        const footnoteStyle = (mergedOptions.inline?.footnote || {}) as StyleOptions
        const styleStr = cssPropertiesToString(footnoteStyle)
        return `<sup${styleStr ? ` style="${styleStr}"` : ''}><a href="#fn-${footnoteToken.text}">[${footnoteToken.text}]</a></sup>`
      }
    }]
  })

  // Convert Markdown to HTML using the custom renderer
  const html = marked.parse(markdown, { renderer }) as string

  // Apply base styles
  const baseStyles = baseStylesToString(mergedOptions.base)
  return baseStyles ? `<section style="${baseStyles}">${html}</section>` : html
}

export type { RendererOptions }