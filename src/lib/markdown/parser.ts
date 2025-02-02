import { marked } from 'marked'
import type { RendererOptions } from './types'
import { MarkdownRenderer } from './renderer'
import { baseStylesToString } from './styles'

export class MarkdownParser {
  private options: RendererOptions
  private renderer: MarkdownRenderer

  constructor(options: RendererOptions) {
    this.options = options
    this.renderer = new MarkdownRenderer(options)
    this.initializeMarked()
  }

  private initializeMarked() {
    marked.use({
      gfm: true,
      breaks: true,
      async: false,
      pedantic: false
    })

    marked.use({
      breaks: true,
      gfm: true,
      walkTokens(token) {
        // 确保列表项被正确处理
        if (token.type === 'list') {
          (token as any).items.forEach((item: any) => {
            if (item.task) {
              item.checked = !!item.checked
            }
          })
        }
      }
    })

    // 添加脚注支持
    const options = this.options // 在闭包中保存 options 引用
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
            return token as any
          }
          return undefined
        },
        renderer(token: any) {
          const footnoteStyle = (options?.inline?.footnote || {})
          const styleStr = Object.entries(footnoteStyle)
            .map(([key, value]) => `${key}:${value}`)
            .join(';')
          return `<sup${styleStr ? ` style="${styleStr}"` : ''}><a href="#fn-${token.text}">[${token.text}]</a></sup>`
        }
      }]
    })
  }

  public parse(markdown: string): string {
    const preprocessed = this.preprocessMarkdown(markdown)
    const html = marked.parse(preprocessed, { renderer: this.renderer.getRenderer() }) as string
    const baseStyles = baseStylesToString(this.options.base)
    return baseStyles ? `<section style="${baseStyles}">${html}</section>` : html
  }

  // 预处理 markdown 文本
  private preprocessMarkdown(markdown: string): string {
    return markdown
      // 处理 ** 语法，但排除已经是 HTML 的部分
      .replace(/(?<!<[^>]*)\*\*([^*]+)\*\*(?![^<]*>)/g, '<strong>$1</strong>')
      // 处理无序列表的 - 标记，但排除代码块内的部分
      .replace(/^(?!\s*```)([ \t]*)-\s+/gm, '$1• ')
  }
} 