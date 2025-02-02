import { marked } from 'marked'
import type { Tokens } from 'marked'
import type { RendererOptions } from './types'
import { cssPropertiesToString } from './styles'
import { highlightCode } from './code-highlight'

export class MarkdownRenderer {
  private renderer: typeof marked.Renderer.prototype
  private options: RendererOptions

  constructor(options: RendererOptions) {
    this.options = options
    this.renderer = new marked.Renderer()
    this.initializeRenderer()
  }

  private initializeRenderer() {
    // 重写 heading 方法
    this.renderer.heading = ({ text, depth }: Tokens.Heading) => {
      const headingKey = `h${depth}` as keyof RendererOptions['block']
      const headingStyle = (this.options.block?.[headingKey] || {})
      const style = {
        ...headingStyle,
        color: this.options.base?.themeColor
      }
      const styleStr = cssPropertiesToString(style)
      const tokens = marked.Lexer.lexInline(text)
      const content = marked.Parser.parseInline(tokens, { renderer: this.renderer })
      return `<h${depth}${styleStr ? ` style="${styleStr}"` : ''}>${content}</h${depth}>`
    }

    // 重写 paragraph 方法
    this.renderer.paragraph = ({ text, tokens }: Tokens.Paragraph) => {
      const paragraphStyle = (this.options.block?.p || {})
      const style = {
        ...paragraphStyle,
        fontSize: this.options.base?.fontSize,
        lineHeight: this.options.base?.lineHeight
      }
      const styleStr = cssPropertiesToString(style)

      // 处理段落中的内联标记
      let content = text
      if (tokens) {
        content = tokens.map(token => {
          if (token.type === 'text') {
            const inlineTokens = marked.Lexer.lexInline(token.text)
            return marked.Parser.parseInline(inlineTokens, { renderer: this.renderer })
          }
          return marked.Parser.parseInline([token], { renderer: this.renderer })
        }).join('')
      } else {
        const inlineTokens = marked.Lexer.lexInline(text)
        content = marked.Parser.parseInline(inlineTokens, { renderer: this.renderer })
      }

      return `<p${styleStr ? ` style="${styleStr}"` : ''}>${content}</p>`
    }

    // 重写 blockquote 方法
    this.renderer.blockquote = ({ text }: Tokens.Blockquote) => {
      const blockquoteStyle = (this.options.block?.blockquote || {})
      const style = {
        ...blockquoteStyle,
        borderLeft: `4px solid ${this.options.base?.themeColor || '#1a1a1a'}`
      }
      const styleStr = cssPropertiesToString(style)
      const tokens = marked.Lexer.lexInline(text)
      const content = marked.Parser.parseInline(tokens, { renderer: this.renderer })
      
      return `<blockquote${styleStr ? ` style="${styleStr}"` : ''}>${content}</blockquote>`
    }

    // 重写 code 方法
    this.renderer.code = ({ text, lang }: Tokens.Code) => {  
      const codeStyle = (this.options.block?.code_pre || {})
      const style = {
        ...codeStyle
      }
      const styleStr = cssPropertiesToString(style)
      
      const highlighted = highlightCode(text, lang || '', this.options.codeTheme || 'github')
      
      return `<pre${styleStr ? ` style="${styleStr}"` : ''}><code class="language-${lang || ''}">${highlighted}</code></pre>`
    }

    // 重写 codespan 方法
    this.renderer.codespan = ({ text }: Tokens.Codespan) => {  
      const codespanStyle = (this.options.inline?.codespan || {})
      const styleStr = cssPropertiesToString(codespanStyle)
      return `<code${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
    }

    // 重写 em 方法
    this.renderer.em = ({ text }: Tokens.Em) => {
      const emStyle = (this.options.inline?.em || {})
      const style = {
        ...emStyle,
        fontStyle: 'italic'
      }
      const styleStr = cssPropertiesToString(style)
      const tokens = marked.Lexer.lexInline(text)
      const content = marked.Parser.parseInline(tokens, { renderer: this.renderer })
      
      return `<em${styleStr ? ` style="${styleStr}"` : ''}>${content}</em>`
    }

    // 重写 strong 方法
    this.renderer.strong = ({ text }: Tokens.Strong) => {
      const strongStyle = (this.options.inline?.strong || {})
      const style = {
        ...strongStyle,
        color: this.options.base?.themeColor,
        fontWeight: 'bold'
      }
      const styleStr = cssPropertiesToString(style)
      const tokens = marked.Lexer.lexInline(text)
      const content = marked.Parser.parseInline(tokens, { renderer: this.renderer })
      
      return `<strong${styleStr ? ` style="${styleStr}"` : ''}>${content}</strong>`
    }

    // 重写 link 方法
    this.renderer.link = ({ href, title, text }: Tokens.Link) => {
      const linkStyle = (this.options.inline?.link || {})
      const styleStr = cssPropertiesToString(linkStyle)
      return `<a href="${href}"${title ? ` title="${title}"` : ''}${styleStr ? ` style="${styleStr}"` : ''}>${text}</a>`
    }

    // 重写 image 方法
    this.renderer.image = ({ href, title, text }: Tokens.Image) => {
      const imageStyle = (this.options.block?.image || {})
      const style = {
        ...imageStyle,
        maxWidth: '100%',
        display: 'block',
        margin: '0.5em auto'
      }
      const styleStr = cssPropertiesToString(style)
      return `<img src="${href}"${title ? ` title="${title}"` : ''} alt="${text}"${styleStr ? ` style="${styleStr}"` : ''}>`
    }

    // 重写 list 方法
    this.renderer.list = (token: Tokens.List) => {
      const tag = token.ordered ? 'ol' : 'ul'
      const listStyle = (this.options.block?.[tag] || {})
      const style = {
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
        return this.renderer.listitem({ ...item, text: itemText })
      }).join('')
      
      return `<${tag}${startAttr}${styleStr ? ` style="${styleStr}"` : ''}>${items}</${tag}>`
    }

    // 重写 listitem 方法
    this.renderer.listitem = (item: Tokens.ListItem) => {
      const listitemStyle = (this.options.inline?.listitem || {})
      const style = {
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
            return this.renderer.list(token as Tokens.List)
          } else {
            // 处理其他类型的 token
            const tokens = marked.Lexer.lexInline(token.raw)
            return marked.Parser.parseInline(tokens, { renderer: this.renderer })
          }
        }).join('')
      } else {
        // 如果没有 tokens，则按普通文本处理
        const tokens = marked.Lexer.lexInline(content)
        content = marked.Parser.parseInline(tokens, { renderer: this.renderer })
      }
      
      return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
    }

    // 添加删除线支持
    this.renderer.del = ({ text }: Tokens.Del) => {
      const delStyle = (this.options.inline?.del || {})
      const styleStr = cssPropertiesToString(delStyle)
      return `<del${styleStr ? ` style="${styleStr}"` : ''}>${text}</del>`
    }
  }

  public getRenderer(): typeof marked.Renderer.prototype {
    return this.renderer
  }
} 