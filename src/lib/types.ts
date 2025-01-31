import type { CSSProperties } from 'react'

export interface RendererOptions {
  base?: {
    primaryColor?: string
    textAlign?: string
    lineHeight?: string
  }
  block?: {
    h1?: CSSProperties
    h2?: CSSProperties
    h3?: CSSProperties
    h4?: CSSProperties
    h5?: CSSProperties
    h6?: CSSProperties
    p?: CSSProperties
    blockquote?: CSSProperties
    code_pre?: CSSProperties
    code?: CSSProperties
    image?: CSSProperties
    ol?: CSSProperties
    ul?: CSSProperties
  }
  inline?: {
    strong?: CSSProperties
    em?: CSSProperties
    codespan?: CSSProperties
    link?: CSSProperties
    listitem?: CSSProperties
  }
}

export interface StyleOptions {
  padding?: string
  maxWidth?: string
  margin?: string
  wordBreak?: string
  whiteSpace?: string
  color?: string
  '@media (max-width: 768px)'?: {
    margin?: string
    padding?: string
    fontSize?: string
  }
} 