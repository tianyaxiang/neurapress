import type { RendererOptions } from '@/lib/markdown'

export interface Template {
  id: string
  name: string
  description: string
  styles: string
  options: RendererOptions
  transform?: (html: string) => string | { html?: string; content?: string }
}

export const templates: Template[] = [
  {
    id: 'default',
    name: '默认样式',
    description: '清晰简约的默认样式',
    styles: '',
    options: {
        base: {
            themeColor: 'rgb(0, 179, 138)',
            fontFamily: '-apple-system-font, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei UI", "Microsoft YaHei", Arial, sans-serif',
            textAlign: 'left',
            lineHeight: '2',
            padding: '1rem 1.5rem',
            maxWidth: '100%',
            margin: '0 auto',
            wordBreak: 'break-word',
            whiteSpace: 'pre-wrap',
            fontSize: '15px',
            color: '#333'
          },
          block: {    // 一级标题
            h1: {
              display: 'table',
              padding: '0 1em',
              borderBottom: '2px solid var(--themeColor)',
              margin: '2em auto 1em',
              color: 'hsl(var(--foreground))',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center'
            },
        
            // 二级标题
            h2: {
              display: 'table',
              padding: '0 0.2em',
              margin: '2em auto 2em',
              color: '#fff',
              background: 'var(--themeColor)',
              fontSize: '1.2em',
              fontWeight: 'bold',
              textAlign: 'center'
            },
        
            // 三级标题
            h3: {
              paddingLeft: '8px',
              borderLeft: '3px solid var(--themeColor)',
              margin: '2em 8px 0.75em 0',
              color: 'hsl(var(--foreground))',
              fontSize: '1.1em',
              fontWeight: 'bold',
              lineHeight: '1.2'
            },
        
            // 四级标题
            h4: {
              'margin': `2em 8px 0.5em`,
              'color': `var(--themeColor)`,
              'fontSize': `1em`,
              'fontWeight': `bold`,
            },
        
            // 五级标题
            h5: {
              'margin': `1.5em 8px 0.5em`,
              'color': `var(--themeColor)`,
              'fontSize': `1em`,
              'fontWeight': `bold`,
            },
        
            // 六级标题
            h6: {
              'margin': `1.5em 8px 0.5em`,
              'fontSize': `1em`,
              'color': `var(--themeColor)`,
            },
        
            // 段落
            p: {
              'fontSize': `var(--fontSize)`,
              'margin': `1.5em 8px`,
              'letterSpacing': `0.1em`,
              'color': `hsl(var(--foreground))`,
              'textAlign': `justify`,
            },
        
            // 引用
            blockquote: {
              fontStyle: 'normal',
              padding: '1em',
              borderLeft: '4px solid var(--themeColor)',
              borderRadius: '6px',
              color: 'rgba(0,0,0,0.5)',
              background: 'var(--blockquote-background)',
              margin: '0 0 1em 0'
            },
        
            // 代码块
            code_pre: {
              'fontSize': `14px`,
              'overflowX': `auto`,
              'borderRadius': `8px`,
              'padding': `1em`,
              'lineHeight': `1.5`,
              'margin': `10px 8px`,
            },
        
            // 行内代码
            code: {
              margin: '0',
              fontFamily: 'Menlo, Operator Mono, Consolas, Monaco, monospace'
            },
        
            // 图片
            image: {
              'display': `block`,
              'width': `100% !important`,
              'margin': `0.1em auto 0.5em`,
              'borderRadius': `4px`,
            },
        
            // 有序列表
            ol: {
              paddingLeft: '1em',
              color: 'hsl(var(--foreground))'
            },
        
            // 无序列表
            ul: {
              listStyle: 'circle',
              paddingLeft: '1em',
              color: 'hsl(var(--foreground))'
            },
        
            footnotes: {
              'margin': `0.5em 8px`,
              'fontSize': `80%`,
              'color': `hsl(var(--foreground))`,
            },

            table: {
              textAlign: 'center',
              margin: '1em 8px',
              color: 'hsl(var(--foreground))'
            },

            thead: {
              'background': `rgba(0, 0, 0, 0.05)`,
              'fontWeight': `bold`,
              'color': `hsl(var(--foreground))`,
            },

            td: {
              border: '1px solid #dfdfdf',
              padding: '0.25em 0.5em',
              color: '#3f3f3f',
            },

          
          },
          inline: {
            listitem: {
              display: 'block',
              margin: '0.2em 8px',
              color: 'hsl(var(--foreground))'
            },
        
            codespan: {
              'fontSize': `90%`,
              'color': `#d14`,
              'background': `rgba(27,31,35,.05)`,
              'padding': `3px 5px`,
              'borderRadius': `4px`,
              // 'word-break': `break-all`,
            },
        
            em: {
              'fontStyle': `italic`,
              'fontSize': `inherit`,
            },
        
            link: {
              color: `#576b95`,
            },
      
            // 字体加粗样式
            strong: {
              'color': `var(--themeColor)`,
              'fontWeight': `bold`,
              'fontSize': `inherit`,
            },
        
            footnote: {
              'fontSize': `12px`,
              'color': `hsl(var(--foreground))`,
            }
          }
        },
        transform: (html: string) => html
  },
  {
    id: 'simple',
    name: '简洁风格',
    description: '雷军公众号文章样式',
    styles: '',
    options: {
      base: {
        themeColor: 'rgb(255, 104, 39)',
        fontSize:'16px',
        lineHeight: '1.75em',
      },
      block: {
        h1: {
          textAlign:'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin:'1em 8px',
          color: 'rgb(255, 104, 39)',
          fontSize: '24px',
          letterSpacing: '1px',
        },
        h2: {
          textAlign:'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin:'1em 8px',
          color: 'rgb(255, 104, 39)',
          fontSize: '24px',
          letterSpacing: '1px',
        },
        h3: {
          textAlign:'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin:'1em 8px',
          fontSize: '16px',
          fontWeight: 'bold',
        },
        p: {
          textAlign:'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin:'1em 8px',
          fontSize: '16px',
          fontFamily: 'mp-quote, PingFang SC, system-ui, -apple-system, BlinkMacSystemFont, Helvetica Neue, Hiragino Sans GB, Microsoft YaHei UI, Microsoft YaHei, Arial, sans-serif',
          letterSpacing: '1px',
        }
      },
      inline: {
        strong: {
          color: '#16a34a',
          fontWeight: 'bold'
        },
        em: {
          fontStyle: 'italic',
          color: '#666'
        },
        link: {
          color: '#3b82f6',
          textDecoration: 'underline'
        }
      }
    },
    transform: (html: string) => html
  },
  {
    id: 'elegant',
    name: '优雅风格',
    description: '适合文学、艺术类文章',
    styles: 'prose-elegant',
    options: {
      base: {
        themeColor: '#16a34a',
        textAlign: 'left',
        lineHeight: '1.75',
        padding: '1rem 1.5rem',
        maxWidth: '100%',
        margin: '0 auto',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '15px',
        color: '#333'
      },
      block: {
        h1: {
          display: 'table',
          padding: '0 1.2em',
          borderBottom: '2px solid #16a34a',
          margin: '2.5em auto 1.2em',
          fontSize: '1.4em',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        h2: {
            display: 'table',
            padding: '0 1.5em',
            borderBottom: '2px solid #16a34a',
            margin: '2.5em auto 1.2em',
            fontSize: '1.4em',
            fontWeight: 'bold',
            textAlign: 'center'
        },
        h3: {
          paddingLeft: '8px',
          borderLeft: '3px solid var(--themeColor)',
          margin: '2em 8px 0.75em 0',
          color: 'hsl(var(--foreground))',
          fontSize: '1.1em',
          fontWeight: 'bold',
          lineHeight: 1.2
        },
        p: {
          fontSize: '15px',
          margin: '1.8em 8px',
          letterSpacing: '0.12em',
          color: '#2c3e50',
          textAlign: 'justify',
          lineHeight: 1.8
        }
      },
      inline: {
        strong: {
          color: '#16a34a',
          fontWeight: 'bold'
        },
        em: {
          fontStyle: 'italic',
          color: '#666'
        },
        link: {
          color: '#3b82f6',
          textDecoration: 'underline'
        }
      }
    },
    transform: (html: string) => html
  },
  {
    id: 'creative',
    name: '科技主题',
    description: '适合科技技术类文章',
    styles: 'prose-creative',
    options: {
      base: {
        themeColor: '#4299e1',
        textAlign: 'left',
        lineHeight: '1.8',
        fontSize: '15px'
      },
      block: {
        h1: {
          fontSize: '26px',
          background: 'linear-gradient(45deg, #4299e1, #667eea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '32px 0 16px',
          fontWeight: 'bold'
        },
        h2: {
          fontSize: '22px',
          background: 'linear-gradient(45deg, #4299e1, #667eea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '24px 0 12px',
          fontWeight: 'bold'
        },
        h3: {
          fontSize: '18px',
          background: 'linear-gradient(45deg, #4299e1, #667eea)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          margin: '20px 0 10px',
          fontWeight: 'bold'
        },
        p: {
          fontSize: '15px',
          color: '#4a5568',
          margin: '20px 0',
          lineHeight: 1.75,
        },
        blockquote: {
          fontSize: '15px',
          color: '#718096',
          borderLeft: '4px solid #4299e1',
          padding:"1em",
          margin: '24px 0',
          background: 'rgba(66, 153, 225, 0.1)'
        }
      },
      inline: {
       
        strong: {
          color: '#4299e1',
          fontWeight: 'bold'
        },
        em: {
          color: '#4a5568',
          fontStyle: 'italic'
        },
        link: {
          color: '#4299e1',
          textDecoration: 'underline'
        }
      }
    },
    transform: (html: string) => html
  },
  {
    id: 'smartisan',
    name: '锤子便签',
    description: '简洁优雅的锤子便签风格',
    styles: 'prose-smartisan',
    options: {
      base: {
        themeColor: 'rgb(99, 87, 83)',
        fontFamily: '-apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        textAlign: 'left',
        lineHeight: '1.75',
        padding: '1.2rem',
        margin: '0 auto',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
        fontSize: '16px',
        color: 'rgb(99, 87, 83)'
      },
      block: {
        h1: {
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#333333',
          margin: '1.5em 0 1em',
          padding: '0.5em 0',
          textAlign: 'center'
        },
        h2: {
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333333',
          margin: '1.5em 0 1em',
          padding: '0.3em 0',
          textAlign: 'left'
        },
        h3: {
          fontSize: '18px',
          fontWeight: 'bold',
          color: '#333333',
          margin: '1.2em 0 0.8em',
          paddingLeft: '0.8em',
        },
        p: {
          margin: '1.2em 0',
          lineHeight: '1.8',
          color: '#333333',
          fontSize: '16px',
          textAlign: 'justify',
          letterSpacing: '0.05em'
        },
        blockquote: {
          margin: '1.2em 0',
          padding: '1em 1.2em',
          borderLeft: '4px solid gba(0, 0, 0, 0.4)',
          background: '#F8F9FA',
          borderRadius: '0 4px 4px 0',
          color: '#666666'
        },
        ul: {
          margin: '1em 0',
          paddingLeft: '1.5em',
          listStyle: 'disc',
          color: '#333333'
        },
        ol: {
          margin: '1em 0',
          paddingLeft: '1.5em',
          listStyle: 'decimal',
          color: '#333333'
        },
        code_pre: {
          margin: '1.2em 0',
          padding: '1em',
          background: '#F8F9FA',
          borderRadius: '4px',
          fontSize: '14px',
          fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace',
          overflowX: 'auto'
        },
        image: {
          margin: '1.2em auto',
          display: 'block',
          borderRadius: '4px'
        }
      },
      inline: {
        strong: {
          color: '#FF6E42',
          fontWeight: 'bold'
        },
        em: {
          fontStyle: 'italic',
          color: '#666666'
        },
        link: {
          color: '#FF6E42',
          textDecoration: 'none',
          borderBottom: '1px solid #FF6E42'
        },
        codespan: {
          background: '#F8F9FA',
          padding: '0.2em 0.4em',
          borderRadius: '3px',
          fontSize: '0.9em',
          color: '#FF6E42',
          fontFamily: 'Menlo, Monaco, Consolas, "Courier New", monospace'
        },
        listitem: {
          margin: '0.5em 0',
          lineHeight: '1.8'
        }
      }
    },
    transform: (html: string) => {
      return `<section id="nice" style="margin: 0; padding: 10px 20px; background-color: rgb(251, 247, 238); width: auto; font-family: PingFangSC-regular, sans-serif; font-size: 16px; color: rgb(0, 0, 0); line-height: 1.5em; word-spacing: 0; letter-spacing: 0; word-break: break-word; overflow-wrap: break-word; text-align: left;">
        ${html}
      </section>`;
    }
  }
]; 