import type { CSSProperties } from 'react'
import type { CodeThemeId } from '@/config/code-themes'

export interface RendererOptions {
  base?: {
    themeColor?: string
    fontSize?: string
    lineHeight?: string
    textAlign?: string
  }
  block?: {
    h1?: StyleOptions
    h2?: StyleOptions
    h3?: StyleOptions
    h4?: StyleOptions
    h5?: StyleOptions
    h6?: StyleOptions
    p?: StyleOptions
    blockquote?: StyleOptions
    code_pre?: StyleOptions
    code?: StyleOptions
    image?: StyleOptions
    ol?: StyleOptions
    ul?: StyleOptions
  }
  inline?: {
    strong?: StyleOptions
    em?: StyleOptions
    codespan?: StyleOptions
    link?: StyleOptions
    listitem?: StyleOptions
  }
  codeTheme?: CodeThemeId
}

export interface StyleOptions {
  padding?: string
  maxWidth?: string
  margin?: string
  wordBreak?: 'normal' | 'break-all' | 'keep-all' | 'break-word'
  whiteSpace?: 'normal' | 'nowrap' | 'pre' | 'pre-wrap' | 'pre-line' | 'break-spaces'
  color?: string
  display?: string
  fontSize?: string
  fontWeight?: string
  textAlign?: string
  paddingLeft?: string
  marginLeft?: string
  borderLeft?: string
  lineHeight?: string | number
  letterSpacing?: string
  fontStyle?: string
  borderRadius?: string
  background?: string
  marginBottom?: string
  alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch'
  gap?: string
  overflowX?: string
  fontFamily?: string
  width?: string
  listStyle?: string
  borderStyle?: string
  borderWidth?: string
  borderColor?: string
  WebkitTransformOrigin?: string
  transformOrigin?: string
  transform?: string
  height?: string
  textIndent?: string | number
  borderCollapse?: 'collapse' | 'separate' | 'initial' | 'inherit'
  border?: string
  textDecoration?: string
  borderBottom?: string
  WebkitBackgroundClip?: string
  WebkitTextFillColor?: string
  '@media (max-width: 768px)'?: {
    margin?: string
    padding?: string
    fontSize?: string
  }
} 