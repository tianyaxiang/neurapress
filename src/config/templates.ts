import { Template } from '@/types/template'

export const templates: Template[] = [
  {
    id: 'wechat',
    name: '微信公众号',
    styles: 'wechat-template',
    subTemplates: [
      {
        id: 'default',
        name: '默认样式',
        styles: 'wechat-default',
        transform: (content: string) => {
          return content
            .replace(/<h1>/g, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 1em;">')
            .replace(/<p>/g, '<p style="margin-bottom: 1em; color: #333; line-height: 1.75;">')
        }
      },
      {
        id: 'elegant',
        name: '优雅简约',
        styles: 'wechat-elegant',
        transform: (content: string) => {
          return content
            .replace(/<h1>/g, '<h1 style="font-size: 26px; font-weight: 600; margin-bottom: 1.2em; color: #2c3e50;">')
            .replace(/<p>/g, '<p style="margin-bottom: 1.2em; color: #34495e; line-height: 1.8; letter-spacing: 0.05em;">')
        }
      },
      {
        id: 'modern',
        name: '现代商务',
        styles: 'wechat-modern',
        transform: (content: string) => {
          return content
            .replace(/<h1>/g, '<h1 style="font-size: 28px; font-weight: bold; margin-bottom: 1em; color: #1a202c; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5em;">')
            .replace(/<p>/g, '<p style="margin-bottom: 1.1em; color: #4a5568; line-height: 1.85; font-size: 16px;">')
        }
      },
      {
        id: 'creative',
        name: '创意活力',
        styles: 'wechat-creative',
        transform: (content: string) => {
          return content
            .replace(/<h1>/g, '<h1 style="font-size: 24px; font-weight: bold; margin-bottom: 1em; color: #2d3748; background: linear-gradient(to right, #4299e1, #667eea); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">')
            .replace(/<p>/g, '<p style="margin-bottom: 1em; color: #4a5568; line-height: 1.75; border-left: 3px solid #4299e1; padding-left: 1em;">')
        }
      }
    ],
    transform: (content: string) => content // 默认转换
  },
  {
    id: 'xiaohongshu',
    name: '小红书',
    styles: 'xiaohongshu-template',
    transform: (content: string) => {
      // 小红书特定的转换逻辑
      return content
        .replace(/<h1>/g, '<h1 style="font-size: 20px; font-weight: bold; margin-bottom: 0.5em;">')
        .replace(/<p>/g, '<p style="margin-bottom: 0.8em; color: #222; line-height: 1.6;">')
    }
  }
] 