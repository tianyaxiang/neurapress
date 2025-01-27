import { TemplateProps } from '@/types/template'

export function XiaohongshuTemplate({ content, className }: TemplateProps) {
  return (
    <div className={`xiaohongshu-template ${className || ''}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
} 