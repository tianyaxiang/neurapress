import type { CSSProperties } from 'react'
import type { CodeThemeId } from '@/config/code-themes'

export interface StyleOptions {
  // Layout
  display?: string
  position?: string
  top?: string | number
  left?: string | number
  right?: string | number
  bottom?: string | number
  width?: string | number
  height?: string | number
  margin?: string | number
  marginTop?: string | number
  marginRight?: string | number
  marginBottom?: string | number
  marginLeft?: string | number
  padding?: string | number
  paddingTop?: string | number
  paddingRight?: string | number
  paddingBottom?: string | number
  paddingLeft?: string | number
  maxWidth?: string | number
  
  // Typography
  color?: string
  fontSize?: string | number
  fontFamily?: string
  fontWeight?: string | number
  fontStyle?: string
  lineHeight?: string | number
  textAlign?: 'left' | 'center' | 'right' | 'justify'
  textDecoration?: string
  textIndent?: string | number
  letterSpacing?: string | number
  whiteSpace?: string
  wordBreak?: string
  
  // Border & Background
  border?: string
  borderTop?: string
  borderRight?: string
  borderBottom?: string
  borderLeft?: string
  borderRadius?: string
  borderCollapse?: string
  background?: string
  backgroundColor?: string
  backgroundImage?: string
  
  // List
  listStyle?: string
  listStyleType?: string
  listStylePosition?: string
  
  // Flexbox
  alignItems?: string
  justifyContent?: string
  flexDirection?: string
  flexWrap?: string
  gap?: string
  
  // Other
  opacity?: number
  overflow?: string
  overflowX?: string
  overflowY?: string
  verticalAlign?: string
  userSelect?: string
  cursor?: string
  zIndex?: number
  boxShadow?: string
  transition?: string
  transform?: string
  WebkitBackgroundClip?: string
  WebkitTextFillColor?: string
}

export interface RendererOptions {
  base?: {
    themeColor?: string
    fontSize?: string
    lineHeight?: string
    textAlign?: 'left' | 'center' | 'right'
    fontFamily?: string
    padding?: string
    margin?: string
    maxWidth?: string
    wordBreak?: string
    whiteSpace?: string
    color?: string
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
    ul?: StyleOptions
    ol?: StyleOptions
    table?: StyleOptions
    th?: StyleOptions
    td?: StyleOptions
    thead?: StyleOptions
    footnotes?: StyleOptions
    latex?: StyleOptions
    mermaid?: StyleOptions
  }
  inline?: {
    strong?: StyleOptions
    em?: StyleOptions
    codespan?: StyleOptions
    link?: StyleOptions
    listitem?: StyleOptions
    checkbox?: StyleOptions
    del?: StyleOptions
    footnote?: StyleOptions
    latex?: StyleOptions
  }
  codeTheme?: CodeThemeId
} 