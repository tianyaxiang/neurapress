import { useState, useCallback, useEffect } from 'react'
import { templates } from '@/config/wechat-templates'
import { convertToWechat, getCodeThemeStyles, type RendererOptions } from '@/lib/markdown'
import { type CodeThemeId } from '@/config/code-themes'
import { useToast } from '@/components/ui/use-toast'
import { initializeMermaid } from '@/lib/markdown/mermaid-utils'

interface UsePreviewContentProps {
  value: string
  selectedTemplate: string
  styleOptions: RendererOptions
  codeTheme: CodeThemeId
}

export const usePreviewContent = ({
  value,
  selectedTemplate,
  styleOptions,
  codeTheme
}: UsePreviewContentProps) => {
  const { toast } = useToast()
  const [isConverting, setIsConverting] = useState(false)
  const [previewContent, setPreviewContent] = useState('')

  const getPreviewContent = useCallback(() => {
    if (!value) return ''
    
    const template = templates.find(t => t.id === selectedTemplate)
    const mergedOptions: RendererOptions = {
      base: {
        ...(template?.options?.base || {}),
        ...styleOptions.base,
      },
      block: {
        ...(template?.options?.block || {}),
        ...(styleOptions.block || {}),
        code_pre: {
          ...(template?.options?.block?.code_pre || {}),
          ...(styleOptions.block?.code_pre || {}),
          ...getCodeThemeStyles(codeTheme)
        },
        h1: {
          ...(template?.options?.block?.h1 || {}),
          ...(styleOptions.block?.h1 || {}),
          fontSize: styleOptions.block?.h1?.fontSize || template?.options?.block?.h1?.fontSize || '24px',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          ...(template?.options?.block?.h1?.borderBottom && {
            borderBottom: `2px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
          })
        },
        h2: {
          ...(template?.options?.block?.h2 || {}),
          ...(styleOptions.block?.h2 || {}),
          fontSize: styleOptions.block?.h2?.fontSize || template?.options?.block?.h2?.fontSize || '20px',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          ...(template?.options?.block?.h2?.borderBottom && {
            borderBottom: `2px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
          })
        },
        h3: {
          ...(template?.options?.block?.h3 || {}),
          ...(styleOptions.block?.h3 || {}),
          fontSize: styleOptions.block?.h3?.fontSize || template?.options?.block?.h3?.fontSize || '1.1em',
          color: styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a',
          ...(template?.options?.block?.h3?.borderLeft && {
            borderLeft: `3px solid ${styleOptions.base?.themeColor || template?.options?.base?.themeColor || '#1a1a1a'}`
          })
        },
        p: {
          ...(template?.options?.block?.p || {}),
          ...(styleOptions.block?.p || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
          lineHeight: styleOptions.base?.lineHeight || template?.options?.base?.lineHeight || 2
        },
        ol: {
          ...(template?.options?.block?.ol || {}),
          ...(styleOptions.block?.ol || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        },
        ul: {
          ...(template?.options?.block?.ul || {}),
          ...(styleOptions.block?.ul || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        }
      },
      inline: {
        ...(template?.options?.inline || {}),
        ...(styleOptions.inline || {}),
        listitem: {
          ...(template?.options?.inline?.listitem || {}),
          ...(styleOptions.inline?.listitem || {}),
          fontSize: styleOptions.base?.fontSize || template?.options?.base?.fontSize || '15px',
        }
      },
      codeTheme
    }
    
    const html = convertToWechat(value, mergedOptions)
   
    if (!template?.transform) return html
    
    try {
      const transformed = template.transform(html)
      if (transformed && typeof transformed === 'object') {
        const result = transformed as { html?: string; content?: string }
        if (result.html) return result.html
        if (result.content) return result.content
        return JSON.stringify(transformed)
      }
      return transformed || html
    } catch (error) {
      console.error('Template transformation error:', error)
      return html
    }
  }, [value, selectedTemplate, styleOptions, codeTheme])

  useEffect(() => {
    const updatePreview = async () => {
      if (!value) {
        setPreviewContent('')
        return
      }
      
      setIsConverting(true)
      try {
        const content = getPreviewContent()
        setPreviewContent(content)

        // 等待 DOM 更新
        await new Promise(resolve => setTimeout(resolve, 50))

        // 渲染 Mermaid 图表
        try {
          await initializeMermaid()
        } catch (error) {
          console.error('Failed to initialize Mermaid:', error)
        }
      } catch (error) {
        console.error('Error updating preview:', error)
        toast({
          variant: "destructive",
          title: "预览更新失败",
          description: "生成预览内容时发生错误",
        })
      } finally {
        setIsConverting(false)
      }
    }

    updatePreview()
  }, [value, selectedTemplate, styleOptions, codeTheme, getPreviewContent, toast])

  return {
    isConverting,
    previewContent,
    getPreviewContent
  }
} 