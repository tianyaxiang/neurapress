import type { MermaidConfig } from 'mermaid'

export interface MermaidRendererProps {
  /** Mermaid 图表的源代码 */
  content: string
  /** 自定义类名 */
  className?: string
  /** 自定义配置，会与默认配置合并 */
  config?: Partial<MermaidConfig>
  /** 渲染完成的回调 */
  onRender?: (svg: string) => void
  /** 渲染失败的回调 */
  onError?: (error: MermaidError) => void
}

export interface MermaidError {
  /** 原始内容 */
  content: string
  /** 错误信息 */
  message: string
  /** 错误对象 */
  error: Error
}

export interface MermaidThemeVariables {
  primaryColor: string
  primaryBorderColor: string
  primaryTextColor: string
  lineColor: string
  textColor: string
  fontSize: string
  fontFamily: string
}

export type MermaidTheme = 'default' | 'dark' | 'neutral' | 'forest' 