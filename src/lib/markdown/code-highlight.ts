import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-nginx'
import type { CodeThemeId } from '@/config/code-themes'
import { getTokenStyles } from './styles'

// Helper function to recursively process tokens
function processToken(token: string | Prism.Token, codeTheme: CodeThemeId): string {
  if (typeof token === 'string') {
    return token
  }

  const tokenStyle = getTokenStyles(codeTheme, token.type)
  const content = Array.isArray(token.content)
    ? token.content.map(t => processToken(t, codeTheme)).join('')
    : processToken(token.content, codeTheme)

  return `<span style="${tokenStyle}">${content}</span>`
}

export function highlightCode(text: string, lang: string, codeTheme: CodeThemeId): string {
  if (!lang || !Prism.languages[lang]) {
    return text
  }

  try {
    const grammar = Prism.languages[lang]
    const lines = text.split('\n')
    const lineNumbersWidth = lines.length.toString().length * 8 + 20

    return lines.map((line, index) => {
      const lineTokens = Prism.tokenize(line, grammar)
      const processedLine = lineTokens.map(t => processToken(t, codeTheme)).join('')
      return `<div class="code-line"><span class="line-number" style="width:${lineNumbersWidth}px;color:#999;padding-right:1em;text-align:right;display:inline-block;user-select:none;">${index + 1}</span>${processedLine}</div>`
    }).join('\n')
  } catch (error) {
    console.error(`Error highlighting code: ${error}`)
    return text
  }
} 