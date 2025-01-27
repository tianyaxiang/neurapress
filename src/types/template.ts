export interface SubTemplate {
  id: string
  name: string
  styles: string
  transform: (content: string) => string
}

export interface Template {
  id: string
  name: string
  styles: string
  subTemplates?: SubTemplate[]
  transform: (content: string) => string
}

export interface TemplateProps {
  content: string
  className?: string
  subTemplateId?: string
} 