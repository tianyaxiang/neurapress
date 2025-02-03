import type { MermaidConfig } from 'mermaid'
import type { MermaidTheme, MermaidThemeVariables } from '../types/mermaid'

const defaultThemeVariables: MermaidThemeVariables = {
  primaryColor: '#4f46e5',
  primaryBorderColor: '#4f46e5',
  primaryTextColor: '#000000',
  lineColor: '#666666',
  textColor: '#333333',
  fontSize: '14px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif'
}

const darkThemeVariables: MermaidThemeVariables = {
  primaryColor: '#6366f1',
  primaryBorderColor: '#6366f1',
  primaryTextColor: '#ffffff',
  lineColor: '#999999',
  textColor: '#ffffff',
  fontSize: '14px',
  fontFamily: defaultThemeVariables.fontFamily
}

export const themeVariables: Record<MermaidTheme, MermaidThemeVariables> = {
  default: defaultThemeVariables,
  dark: darkThemeVariables,
  neutral: {
    ...defaultThemeVariables,
    primaryColor: '#6b7280',
    primaryBorderColor: '#6b7280'
  },
  forest: {
    ...defaultThemeVariables,
    primaryColor: '#059669',
    primaryBorderColor: '#059669'
  }
}

export const createMermaidConfig = (theme: MermaidTheme = 'default'): MermaidConfig => ({
  theme: 'base',
  themeVariables: themeVariables[theme],
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
    padding: 15,
    nodeSpacing: 50,
    rankSpacing: 50,
    useMaxWidth: false
  },
  sequence: {
    useMaxWidth: false,
    boxMargin: 10,
    mirrorActors: false,
    bottomMarginAdj: 2
  },
  pie: {
    textPosition: 0.75,
    useMaxWidth: true
  },
  startOnLoad: false,
  securityLevel: 'loose'
}) 