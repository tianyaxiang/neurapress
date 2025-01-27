import { TemplateProps } from '@/types/template'

export function WechatTemplate({ content, className }: TemplateProps) {
  return (
    <div className={`wechat-template ${className || ''}`}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
} 