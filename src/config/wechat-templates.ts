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
        primaryColor: '#000000',
        textAlign: 'left',
        lineHeight: '1.75'
      },
      block: {
        h1: {
          display: 'table',
          padding: '0 1em',
          borderBottom: '2px solid var(--md-primary-color)',
          margin: '2em auto 1em',
          color: 'hsl(var(--foreground))',
          fontSize: '1.2em',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        h2: {
          display: 'table',
          padding: '0 0.2em',
          margin: '4em auto 2em',
          color: '#fff',
          background: 'var(--md-primary-color)',
          fontSize: '1.2em',
          fontWeight: 'bold',
          textAlign: 'center'
        },
        h3: {
          paddingLeft: '8px',
          borderLeft: '3px solid var(--md-primary-color)',
          margin: '2em 8px 0.75em 0',
          color: 'hsl(var(--foreground))',
          fontSize: '1.1em',
          fontWeight: 'bold',
          lineHeight: 1.2
        },
        p: {
          margin: '1.5em 8px',
          lineHeight: 1.75,
          letterSpacing: '0.1em',
          color: 'hsl(var(--foreground))',
          textAlign: 'justify'
        },
        blockquote: {
          fontStyle: 'normal',
          padding: '1em',
          borderLeft: '4px solid var(--md-primary-color)',
          borderRadius: '6px',
          color: 'rgba(0,0,0,0.5)',
          background: 'var(--blockquote-background)',
          margin: '0 0 1em 0'
        },
        code_pre: {
          fontSize: '14px',
          overflowX: 'auto',
          borderRadius: '8px',
          padding: '1em',
          lineHeight: 1.5,
          margin: '10px 8px'
        },
        image: {
          display: 'block',
          width: '100%',
          margin: '0.1em auto 0.5em',
          borderRadius: '4px'
        }
      },
      inline: {
        strong: {
          color: 'var(--md-primary-color)',
          fontWeight: 'bold'
        },
        em: {
          fontStyle: 'italic'
        },
        codespan: {
          fontSize: '90%',
          color: '#d14',
          background: 'rgba(27,31,35,.05)',
          padding: '3px 5px',
          borderRadius: '4px'
        },
        link: {
          color: '#576b95'
        }
      }
    },
    transform: (html) => html
  },
  {
    id: 'elegant',
    name: '优雅风格',
    description: '适合文学、艺术类文章',
    styles: 'prose-elegant',
    options: {
      base: {
        primaryColor: '#16a34a',
        textAlign: 'justify',
        lineHeight: '1.8'
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
          padding: '0.2em 1em',
          margin: '4em auto 2em',
          color: '#fff',
          background: '#16a34a',
          fontSize: '1.2em',
          fontWeight: 'bold',
          textAlign: 'center',
          borderRadius: '4px'
        },
        h3: {
          paddingLeft: '8px',
          borderLeft: '3px solid var(--md-primary-color)',
          margin: '2em 8px 0.75em 0',
          color: 'hsl(var(--foreground))',
          fontSize: '1.1em',
          fontWeight: 'bold',
          lineHeight: 1.2
        },
        p: {
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
    transform: (html) => html
  },
  {
    id: 'creative',
    name: '创意活力',
    description: '适合营销、活动类文章',
    styles: 'prose-creative',
    options: {
      base: {
        primaryColor: '#4299e1',
        textAlign: 'left',
        lineHeight: '1.8',
        fontSize: '50px'
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
          borderLeft: '3px solid #4299e1',
          paddingLeft: '1em'
        },
        blockquote: {
          fontSize: '15px',
          color: '#718096',
          borderLeft: '4px solid #4299e1',
          paddingLeft: '1em',
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
    transform: (html) => html
  }
] 