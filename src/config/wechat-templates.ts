import type { RendererOptions } from '@/lib/types'

export interface Template {
  id: string
  name: string
  description: string
  styles: string
  options: RendererOptions
  transform: (html: string) => string
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
          marginBottom: '1em'
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
    id: 'modern',
    name: '现代商务',
    description: '适合商业、科技类文章',
    styles: 'prose-modern',
    options: {
      base: {
        primaryColor: '#111827',
        textAlign: 'left',
        lineHeight: '1.75'
      },
      block: {
        h1: {
          fontSize: '26px',
          color: '#111827',
          margin: '32px 0 16px',
          fontWeight: 'bold'
        },
        h2: {
          fontSize: '22px',
          color: '#111827',
          margin: '24px 0 12px',
          fontWeight: 'bold'
        },
        h3: {
          fontSize: '18px',
          color: '#111827',
          margin: '20px 0 10px',
          fontWeight: 'bold'
        },
        p: {
          fontSize: '15px',
          color: '#374151',
          margin: '20px 0',
          lineHeight: 1.6
        },
        blockquote: {
          fontSize: '15px',
          color: '#4b5563',
          borderLeft: '4px solid #e5e7eb',
          paddingLeft: '1em',
          margin: '24px 0'
        },
        code_pre: {
          fontSize: '14px',
          background: '#f9fafb',
          padding: '1em',
          borderRadius: '6px',
          margin: '20px 0'
        }
      },
      inline: {
        strong: {
          color: '#111827',
          fontWeight: 'bold'
        },
        em: {
          color: '#374151',
          fontStyle: 'italic'
        },
        link: {
          color: '#2563eb',
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
        lineHeight: '1.8'
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
          lineHeight: 1.6,
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
  },
  {
    id: 'minimal',
    name: '极简风格',
    description: '简约清新的设计风格',
    styles: 'prose-minimal',
    options: {
      base: {
        primaryColor: '#000000',
        textAlign: 'left',
        lineHeight: '1.8'
      },
      block: {
        h1: {
          fontSize: '24px',
          color: '#000000',
          margin: '36px 0 18px',
          fontWeight: '500'
        },
        h2: {
          fontSize: '20px',
          color: '#000000',
          margin: '28px 0 14px',
          fontWeight: '500'
        },
        h3: {
          fontSize: '18px',
          color: '#000000',
          margin: '24px 0 12px',
          fontWeight: '500'
        },
        p: {
          fontSize: '15px',
          color: '#1a1a1a',
          margin: '24px 0',
          lineHeight: 1.8
        },
        blockquote: {
          borderLeft: '2px solid #000',
          margin: '24px 0',
          paddingLeft: '1.5em',
          color: '#666666'
        },
        code_pre: {
          fontSize: '14px',
          color: '#1a1a1a',
          background: '#f5f5f5',
          padding: '1em',
          borderRadius: '4px'
        }
      },
      inline: {
        strong: {
          color: '#000000',
          fontWeight: '600'
        },
        em: {
          color: '#666666',
          fontStyle: 'italic'
        },
        link: {
          color: '#0066cc',
          textDecoration: 'underline'
        }
      }
    },
    transform: (html) => html

  },
  {
    id: 'ios-notes',
    name: '备忘录风格',
    description: '仿 iOS 备忘录风格',
    styles: 'prose-ios-notes',
    options: {
      base: {
        primaryColor: '#FF9500',
        textAlign: 'left',
        lineHeight: '1.6'
      },
      block: {
        h1: {
          fontSize: '24px',
          color: '#1C1C1E',
          margin: '32px 0 16px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text"'
        },
        h2: {
          fontSize: '20px',
          color: '#1C1C1E',
          margin: '24px 0 12px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text"'
        },
        h3: {
          fontSize: '18px',
          color: '#1C1C1E',
          margin: '20px 0 10px',
          fontWeight: '600',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text"'
        },
        p: {
          fontSize: '17px',
          color: '#333333',
          margin: '16px 0',
          lineHeight: 1.6,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text"'
        },
        blockquote: {
          fontSize: '17px',
          color: '#666666',
          borderLeft: '4px solid #FF9500',
          background: '#FAFAFA',
          padding: '12px 16px',
          margin: '16px 0',
          borderRadius: '4px'
        },
        code_pre: {
          fontSize: '15px',
          background: '#F2F2F7',
          padding: '12px 16px',
          borderRadius: '8px',
          margin: '16px 0',
          fontFamily: 'Menlo, Monaco, "SF Mono", monospace'
        },
        ul: {
          paddingLeft: '24px',
          margin: '16px 0'
        },
        ol: {
          paddingLeft: '24px',
          margin: '16px 0'
        }
      },
      inline: {
        strong: {
          color: '#1C1C1E',
          fontWeight: '600'
        },
        em: {
          color: '#666666',
          fontStyle: 'italic'
        },
        link: {
          color: '#007AFF',
          textDecoration: 'none'
        },
        codespan: {
          color: '#E73C3E',
          background: '#F2F2F7',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '90%',
          fontFamily: 'Menlo, Monaco, "SF Mono", monospace'
        }
      }
    },
    transform: (html) => html
  }
] 