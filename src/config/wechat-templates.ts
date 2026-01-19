import type { RendererOptions } from '@/lib/markdown'
import { convertExternalLinksToFootnotes } from '@/lib/utils/links-to-footnotes'

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
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'nebula',
    name: '星云（未来）',
    description: '霓虹紫蓝渐变，强调科技感与视觉冲击',
    styles: 'prose-nebula',
    options: {
      base: { themeColor: '#6C5CE7', fontSize: '15px', color: '#1f2933' },
      block: {
        h1: { fontSize: '1.9rem', margin: '1.8rem 0 1rem', fontWeight: 800, color: '#2b2f3a' },
        h2: {
          fontSize: '1.35rem',
          color: '#ffffff',
          margin: '1.6rem 0 0.9rem',
          padding: '0.85rem 1.1rem',
          background: 'linear-gradient(90deg,#6C5CE7 0%, #00B4D8 100%)',
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: 700,
          letterSpacing: '0.4px',
          lineHeight: 1.2,
          wordBreak: 'break-word',
          boxShadow: '0 8px 24px rgba(108,92,231,0.12)'
        },
        h3: { fontSize: '1rem', color: '#2b2f3a', margin: '1.3rem 0 0.8rem', paddingLeft: '8px', borderLeft: '4px solid rgba(108,92,231,0.6)' },
        p: { fontSize: '15px', color: '#374151', margin: '1rem 0', lineHeight: 1.8 }
      },
      inline: { strong: { color: '#475569', fontWeight: 700 }, em: { color: '#6C5CE7' }, link: { color: '#00B4D8' } }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'skyline',
    name: '天穹（都市）',
    description: '冷蓝灰配色，适合产品公告与技术解析',
    styles: 'prose-skyline',
    options: {
      base: { themeColor: '#2B8CF0', fontSize: '15px', color: '#2b3440' },
      block: {
        h1: { fontSize: '1.75rem', color: '#1f2a37', margin: '1.8rem 0 0.9rem', fontWeight: 800 },
        h2: {
          fontSize: '1.25rem',
          color: '#0f1724',
          margin: '1.5rem 0 0.9rem',
          padding: '0.7rem 1rem',
          background: 'linear-gradient(90deg, rgba(43,140,240,0.08) 0%, rgba(43,140,240,0.02) 100%)',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 700,
          lineHeight: 1.25,
          boxShadow: '0 4px 14px rgba(43,140,240,0.06)'
        },
        h3: { fontSize: '0.98rem', paddingLeft: '8px', borderLeft: '4px solid #2B8CF0', margin: '1.5rem 0 0.8rem', color: '#1f2a37' },
        p: { fontSize: '15px', color: '#374151', margin: '1rem 0', lineHeight: 1.8 }
      },
      inline: { strong: { color: '#2B8CF0', fontWeight: 700 }, em: { color: '#475569' }, link: { color: '#1E90FF' } }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'circuit',
    name: '电路（暗色）',
    description: '暗色背景与荧光绿点缀，适合深色主题与技术工程文档',
    styles: 'prose-circuit',
    options: {
      base: { themeColor: '#00FF9A', fontSize: '15px', color: '#d6e2e0' },
      block: {
        h1: { fontSize: '1.6rem', color: '#e6f7f0', margin: '1.6rem 0 0.9rem', fontWeight: 800 },
        h2: {
          fontSize: '1.15rem',
          color: '#00ff9a',
          margin: '1.4rem 0 0.8rem',
          padding: '0.6rem 0.9rem',
          background: 'linear-gradient(90deg, rgba(0,255,154,0.06) 0%, rgba(0,0,0,0.05) 100%)',
          borderRadius: '8px',
          textAlign: 'center',
          fontWeight: 700,
          lineHeight: 1.25,
          wordBreak: 'break-word',
          boxShadow: '0 6px 20px rgba(0,255,154,0.06)'
        },
        h3: { fontSize: '0.95rem', paddingLeft: '8px', borderLeft: '4px solid rgba(0,255,154,0.2)', margin: '1.4rem 0 0.8rem', color: '#cdeee2' },
        p: { fontSize: '15px', color: '#cbdfe0', margin: '1rem 0', lineHeight: 1.75 }
      },
      inline: { strong: { color: '#00FF9A', fontWeight: 700 }, em: { color: '#9feacd' }, link: { color: '#00e6a8' } }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'jade',
    name: '玉白（雅致）',
    description: '柔和的玉色卡片风，适合读书笔记与轻商务',
    styles: 'prose-jade',
    options: {
      base: {
        themeColor: '#00a886',
        fontSize: '16px',
        color: '#2b3a36'
      },
      block: {
        h1: {
          fontSize: '1.6rem',
          color: '#0f5a45',
          margin: '1.75rem 0 1rem',
          fontWeight: 700,
          paddingBottom: '0.6rem',
          borderBottom: '2px solid #00a886'
        },
        h2: {
          fontSize: '1.2rem',
          color: '#0f5a45',
          margin: '1.6rem 0 0.9rem',
          padding: '0.6rem 0.9rem',
          background: 'linear-gradient(90deg, rgba(0,168,134,0.08) 0%, rgba(0,168,134,0.02) 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 600,
          letterSpacing: '0.3px',
          lineHeight: 1.25,
          wordBreak: 'break-word',
          boxShadow: '0 2px 8px rgba(0,168,134,0.05)'
        },
        h3: {
          fontSize: '0.95rem',
          lineHeight: 1.4,
          padding: '0.5em 0 0.75em 0.875em',
          margin: '1.5rem 0 0.9rem',
          borderLeft: '4px solid #00a886',
          color: '#0f5a45'
        },
        p: {
          fontSize: '15px',
          color: '#3a4a45',
          margin: '0.9rem 0',
          lineHeight: 1.8,
          textAlign: 'justify'
        }
      },
      inline: {
        strong: { color: '#007a60', fontWeight: 700 },
        em: { color: '#006a56', fontStyle: 'italic' },
        link: { color: '#00a886', textDecoration: 'underline' }
      }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'mint',
    name: '薄荷（清新）',
    description: '轻盈薄荷调，适合生活类与轻量内容展示',
    styles: 'prose-mint',
    options: {
      base: { themeColor: '#7BE4B8', fontSize: '16px', color: '#2f3b37' },
      block: {
        h1: { fontSize: '1.6rem', color: '#0b4d3f', margin: '1.75rem 0 1rem', fontWeight: 700 },
        h2: {
          fontSize: '1.15rem',
          color: '#0b4d3f',
          margin: '1.5rem 0 0.9rem',
          padding: '0.6rem 0.9rem',
          background: 'linear-gradient(90deg, rgba(123,228,184,0.12) 0%, rgba(123,228,184,0.02) 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 600,
          lineHeight: 1.25,
          wordBreak: 'break-word'
        },
        h3: { fontSize: '0.95rem', paddingLeft: '8px', borderLeft: '4px solid #7BE4B8', margin: '1.4rem 0 0.8rem', color: '#0b4d3f' },
        p: { fontSize: '15px', color: '#3b4a44', margin: '0.9rem 0', lineHeight: 1.8 }
      },
      inline: { strong: { color: '#0a6b4f', fontWeight: 700 }, em: { color: '#006a56' }, link: { color: '#0a6b4f' } }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'pine',
    name: '松石（沉稳）',
    description: '深色松石风，适合正式公告与产品文档',
    styles: 'prose-pine',
    options: {
      base: { themeColor: '#066155', fontSize: '16px', color: '#2b3b37' },
      block: {
        h1: { fontSize: '1.75rem', color: '#054e45', margin: '2rem 0 1rem', fontWeight: 700, borderBottom: '3px solid #066155' },
        h2: {
          fontSize: '1.2rem',
          color: '#054e45',
          margin: '1.8rem 0 1rem',
          padding: '0.7rem 1rem',
          background: 'linear-gradient(90deg, rgba(6,97,85,0.08) 0%, rgba(6,97,85,0.02) 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 700,
          lineHeight: 1.3,
          wordBreak: 'break-word',
          boxShadow: '0 2px 10px rgba(6,97,85,0.06)'
        },
        h3: { fontSize: '0.95rem', paddingLeft: '8px', borderLeft: '5px solid #066155', margin: '1.6rem 0 0.9rem', color: '#054e45' },
        p: { fontSize: '15px', color: '#394b45', margin: '1rem 0', lineHeight: 1.8 }
      },
      inline: { strong: { color: '#066155', fontWeight: 700 }, em: { color: '#066155' }, link: { color: '#066155' } }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'simple',
    name: '简洁风格',
    description: '雷军公众号文章样式',
    styles: '',
    options: {
      base: {
        themeColor: 'rgb(255, 104, 39)',
        fontSize: '16px',
        lineHeight: '1.75em',
      },
      block: {
        h1: {
          textAlign: 'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin: '1em 8px',
          color: 'rgb(255, 104, 39)',
          fontSize: '24px',
          letterSpacing: '1px',
        },
        h2: {
          textAlign: 'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin: '1em 8px',
          color: 'rgb(255, 104, 39)',
          fontSize: '24px',
          letterSpacing: '1px',
        },
        h3: {
          textAlign: 'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin: '1em 8px',
          fontSize: '16px',
          fontWeight: 'bold',
        },
        p: {
          textAlign: 'justify',
          textIndent: '0em',
          lineHeight: '1.75em',
          margin: '1em 8px',
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
    transform: (html: string) => convertExternalLinksToFootnotes(html)
  },
  {
    id: 'emerald',
    name: '翡翠绿（商务）',
    description: '商务型翡翠绿卡片风格，适合公司号/产品公告/商业文档',
    styles: 'prose-emerald',
    options: {
      base: {
        themeColor: '#009874',
        fontSize: '16px',
        color: '#2d3748'
      },
      block: {
        h1: {
          fontSize: '1.75rem',
          color: '#006651',
          margin: '2rem 0 1.25rem',
          fontWeight: 700,
          paddingBottom: '0.875rem',
          borderBottom: '3px solid #009874',
          letterSpacing: '-0.02em'
        },
        h2: {
          fontSize: '1.175rem',
          color: '#006651',
          margin: '2rem 0 1.25rem',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(90deg, rgba(0,152,116,0.08) 0%, rgba(0,152,116,0.02) 100%)',
          borderRadius: '10px',
          textAlign: 'center',
          fontWeight: 600,
          letterSpacing: '0.4px',
          lineHeight: 1.3,
          wordBreak: 'break-word',
          maxWidth: '100%',
          boxShadow: '0 1px 6px rgba(0,152,116,0.06)',
          borderLeft: '4px solid #009874'
        },
        h3: {
          fontSize: '0.95rem',
          lineHeight: 1.4,
          padding: '0.5em 0 0.75em 0.875em',
          margin: '1.75rem 0 1rem',
          borderLeft: '5px solid #009874',
          borderBottom: '1px dashed #d1e8e0',
          color: '#006651',
          background: 'linear-gradient(90deg, rgba(0,152,116,0.08) 0%, transparent 85%)',
        },
        h4: {
          fontSize: '1rem',
          color: '#009874',
          margin: '1.5rem 0 0.75rem',
          fontWeight: 600,
          letterSpacing: '0.2px'
        },
        p: {
          fontSize: '15px',
          color: '#4a5568',
          margin: '1rem 0',
          lineHeight: 1.8,
          textAlign: 'justify',
          letterSpacing: '0.3px'
        },
        blockquote: {
          fontSize: '15px',
          color: '#4a5568',
          borderLeft: '5px solid #009874',
          padding: '1rem 1.25rem',
          margin: '1.5rem 0',
          background: 'linear-gradient(90deg, rgba(0,152,116,0.08) 0%, rgba(230,245,241,0.4) 100%)',
          borderRadius: '0 10px 10px 0',
          fontStyle: 'italic'
        },
        ol: {
          paddingLeft: '1.5em',
          color: '#2d3748',
          margin: '1rem 0'
        },
        ul: {
          listStyle: 'none',
          paddingLeft: '1.5em',
          color: '#2d3748',
          margin: '1rem 0'
        },
        code_pre: {
          fontSize: '13px',
          overflowX: 'auto',
          borderRadius: '10px',
          padding: '1.25rem',
          lineHeight: '1.6',
          margin: '1.5rem 0',
          background: 'linear-gradient(135deg, #f0faf7 0%, #f5fffe 100%)',
          border: '1px solid #d1e8e0',
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.04), 0 2px 6px rgba(0,152,116,0.08)',
          wordBreak: 'break-all'
        },
        code: {
          fontFamily: '"SF Mono", "Menlo", "Monaco", "Consolas", "Courier New", monospace',
          fontSize: '13px',
          color: '#1a4a3a',
          lineHeight: '1.6'
        },
        image: {
          display: 'block',
          width: '100% !important',
          margin: '1.5rem auto',
          borderRadius: '10px',
          border: '1px solid #e2f0ec',
          boxShadow: '0 4px 12px rgba(0,152,116,0.1)'
        },
        table: {
          margin: '1.75rem 0',
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #d1e8e0',
          borderRadius: '10px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,75,60,0.08)'
        },
        thead: {
          background: 'linear-gradient(90deg, #e6f5f1 0%, #f0faf7 100%)',
          fontWeight: 700,
          color: '#006651',
          borderBottom: '2px solid #d1e8e0'
        },
        th: {
          padding: '1rem 1.25rem',
          textAlign: 'left',
          fontSize: '14px',
          letterSpacing: '0.5px'
        },
        td: {
          border: 'none',
          borderBottom: '1px solid #e2f0ec',
          padding: '0.875rem 1.25rem',
          color: '#4a5568',
          fontSize: '15px'
        },
        footnotes: {
          margin: '1rem 0',
          fontSize: '13px',
          color: '#718096'
        }
      },
      inline: {
        listitem: {
          display: 'block',
          margin: '0.5rem 0',
          color: '#2d3748'
        },
        strong: {
          color: '#006651',
          fontWeight: 700
        },
        em: {
          color: '#009874',
          fontStyle: 'italic'
        },
        link: {
          color: '#009874',
          textDecoration: 'underline',
          fontWeight: 500
        },
        codespan: {
          fontSize: '90%',
          color: '#1a4a3a',
          background: '#e6f5f1',
          padding: '0.25em 0.5em',
          borderRadius: '4px',
          fontFamily: '"SF Mono", "Monaco", "Menlo", monospace',
          fontWeight: 500
        },
        footnote: {
          fontSize: '12px',
          color: '#718096',
          fontWeight: 500
        }
      }
    },
    transform: (html: string) => convertExternalLinksToFootnotes(html)
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
    transform: (html: string) => convertExternalLinksToFootnotes(html)
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
          padding: "1em",
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
    transform: (html: string) => convertExternalLinksToFootnotes(html)
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
      return convertExternalLinksToFootnotes(`<section id="nice" style="margin: 0; padding: 10px 20px; background-color: rgb(251, 247, 238); width: auto; font-family: PingFangSC-regular, sans-serif; font-size: 16px; color: rgb(0, 0, 0); line-height: 1.5em; word-spacing: 0; letter-spacing: 0; word-break: break-word; overflow-wrap: break-word; text-align: left;">${html}</section>`);
    }
  }
]; 