import { marked } from 'marked'
import type { Tokens, TokenizerAndRendererExtension } from 'marked'
import type { RendererOptions } from './types'
import { cssPropertiesToString } from './styles'
import { highlightCode } from './code-highlight'
import katex from 'katex'

// 自定义 LaTeX 块的 Token 类型
interface LatexBlockToken extends Tokens.Generic {
  type: 'latexBlock'
  raw: string
  text: string
}

// 自定义 Mermaid 块的 Token 类型
interface MermaidBlockToken extends Tokens.Generic {
  type: 'mermaidBlock'
  raw: string
  text: string
}

export class MarkdownRenderer {
  private renderer: typeof marked.Renderer.prototype
  private options: RendererOptions

  constructor(options: RendererOptions) {
    this.options = options
    this.renderer = new marked.Renderer()
    this.initializeRenderer()
    this.initializeLatexExtension()
    this.initializeMermaidExtension()
  }

  private initializeLatexExtension() {
    // 添加 LaTeX 块的 tokenizer
    const latexBlockTokenizer: TokenizerAndRendererExtension = {
      name: 'latexBlock',
      level: 'block',
      start(src: string) {
        return src.match(/^\$\$/)?.index
      },
      tokenizer(src: string) {
        const rule = /^\$\$([\s\S]*?)\$\$/
        const match = rule.exec(src)
        if (match) {
          const content = match[1].trim()
          return {
            type: 'latexBlock',
            raw: match[0],
            tokens: [],
            text: content
          }
        }
      },
      renderer: (token) => {
        try {
          const latexStyle = (this.options.block?.latex || {})
          const style = {
            ...latexStyle,
            display: 'block',
            margin: '1em 0',
            textAlign: 'center' as const
          }
          const styleStr = cssPropertiesToString(style)
          const rendered = katex.renderToString(token.text, {
            displayMode: true,
            throwOnError: false
          })
          return `<div${styleStr ? ` style="${styleStr}"` : ''}>${rendered}</div>`
        } catch (error) {
          console.error('LaTeX rendering error:', error)
          return token.raw
        }
      }
    }

    // 注册扩展
    marked.use({ extensions: [latexBlockTokenizer] })
  }

  private initializeMermaidExtension() {
    // 添加 Mermaid 块的 tokenizer
    const mermaidBlockTokenizer: TokenizerAndRendererExtension = {
      name: 'mermaidBlock',
      level: 'block',
      start(src: string) {
        // 支持两种格式：```mermaid 和 ``` 后面跟 mermaid 内容
        return src.match(/^```(?:mermaid\s*$|[\s\n]*pie\s+|[\s\n]*graph\s+|[\s\n]*sequenceDiagram\s+|[\s\n]*gantt\s+|[\s\n]*classDiagram\s+|[\s\n]*flowchart\s+)/)?.index
      },
      tokenizer(src: string) {
        // 匹配两种格式
        const rule = /^```(?:mermaid\s*\n)?([\s\S]*?)\n*```(?:\s*\n|$)/
        const match = rule.exec(src)
        if (match) {
          const content = match[1].trim()
          // 检查内容是否是 mermaid 图表
          if (content.match(/^(?:pie\s+|graph\s+|sequenceDiagram\s+|gantt\s+|classDiagram\s+|flowchart\s+)/)) {
            // 如果是饼图，添加 showData 选项
            const processedContent = content.startsWith('pie') 
              ? `pie showData\n${content.replace(/^pie\s*/, '').trim()}`
              : content
            return {
              type: 'mermaidBlock',
              raw: match[0],
              tokens: [],
              text: processedContent
            }
          }
        }
      },
      renderer: (token) => {
        try {
          const mermaidStyle = (this.options.block?.mermaid || {})
          const style = {
            ...mermaidStyle,
            display: 'block',
            margin: '1em 0',
            textAlign: 'center' as const,
            background: 'transparent'
          }
          const styleStr = cssPropertiesToString(style)
          
          // Remove the random ID generation since it's not needed
          // Return a simple div with the mermaid class and content
          return `<div${styleStr ? ` style="${styleStr}"` : ''} class="mermaid">${token.text}</div>`
        } catch (error) {
          console.error('Mermaid rendering error:', error)
          return `<pre><code class="language-mermaid">${token.text}</code></pre>`
        }
      }
    }

    // 注册扩展
    marked.use({ extensions: [mermaidBlockTokenizer] })
  }

  private initializeRenderer() {
    // 重写 text 方法来处理行内 LaTeX 公式
    this.renderer.text = (token: Tokens.Text | Tokens.Escape) => {
      // 只处理行内公式
      return token.text.replace(/(?<!\$)\$([^\n$]+?)\$/g, (match, inline) => {
        try {
          return katex.renderToString(inline.trim(), {
            displayMode: false,
            throwOnError: false
          })
        } catch (error) {
          console.error('LaTeX inline rendering error:', error)
          return match
        }
      })
    }

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
      return `<code class="inline-code"${styleStr ? ` style="${styleStr}"` : ''}>${text}</code>`
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
      
      return `<em${styleStr ? ` style="${styleStr}"` : ''}>${content}</em>`    }

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
      
      // 处理嵌套列表和内容
      let content = item.text
      if (item.tokens) {
        content = item.tokens.map(token => {
          if (token.type === 'list') {
            // 递归处理嵌套列表
            return this.renderer.list(token as Tokens.List)
          } else if (token.type === 'text' || token.type === 'paragraph') {
            // 处理文本节点和段落节点
            // 首先处理块级公式
            const processedText = (token.text || token.raw).replace(/\$\$([\s\S]+?)\$\$/g, (match: string, formula: string) => {
              try {
                const latexStyle = (this.options.block?.latex || {})
                const style = {
                  ...latexStyle,
                  display: 'block',
                  margin: '1em 0',
                  textAlign: 'center' as const
                }
                const styleStr = cssPropertiesToString(style)
                const rendered = katex.renderToString(formula.trim(), {
                  displayMode: true,
                  throwOnError: false
                })
                return `<div${styleStr ? ` style="${styleStr}"` : ''}>${rendered}</div>`
              } catch (error) {
                console.error('LaTeX block rendering error:', error)
                return match
              }
            })
            
            // 然后处理其他内联标记
            const inlineTokens = marked.Lexer.lexInline(processedText)
            return marked.Parser.parseInline(inlineTokens, { renderer: this.renderer })
          } else {
            // 对于其他类型的 token，直接使用其原始内容
            return token.raw
          }
        }).join('')
      } else {
        // 如果没有 tokens，则按普通文本处理
        const inlineTokens = marked.Lexer.lexInline(content)
        content = marked.Parser.parseInline(inlineTokens, { renderer: this.renderer })
      }
      
      // 处理任务列表项
      if (item.task) {
        const checkbox = `<input type="checkbox"${item.checked ? ' checked=""' : ''} disabled="" /> `
        content = checkbox + content
      }
      
      return `<li${styleStr ? ` style="${styleStr}"` : ''}>${content}</li>`
    }

    // 添加删除线支持
    this.renderer.del = ({ text }: Tokens.Del) => {
      const styleOptions = (this.options.inline?.del || {})
      const styleStr = cssPropertiesToString(styleOptions)
      return `<del${styleStr ? ` style="${styleStr}"` : ''}>${text}</del>`
    }
  }

  public getRenderer(): typeof marked.Renderer.prototype {
    return this.renderer
  }
}
