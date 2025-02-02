'use client'

import { useState } from 'react'
import { Copy, Plus, Save, Smartphone, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WechatStylePicker } from '../../template/WechatStylePicker'
import { TemplateManager } from '../../template/TemplateManager'
import { StyleConfigDialog } from '../StyleConfigDialog'
import { ArticleList } from '../ArticleList'
import { type Article } from '../constants'
import { type RendererOptions } from '@/lib/types'
import { ThemeToggle } from '@/components/theme/ThemeToggle'
import { Logo } from '@/components/icons/Logo'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { CodeThemeSelector } from '../CodeThemeSelector'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { codeThemes, type CodeThemeId } from '@/config/code-themes'

interface EditorToolbarProps {
  value: string
  isDraft: boolean
  showPreview: boolean
  selectedTemplate: string
  styleOptions: RendererOptions
  codeTheme: CodeThemeId
  wordCount: string
  readingTime: string
  onSave: () => void
  onCopy: () => Promise<boolean>
  onCopyPreview: () => Promise<boolean>
  onNewArticle: () => void
  onArticleSelect: (article: { content: string, template: string }) => void
  onTemplateSelect: (templateId: string) => void
  onTemplateChange: () => void
  onStyleOptionsChange: (options: RendererOptions) => void
  onPreviewToggle: () => void
  onCodeThemeChange: (theme: CodeThemeId) => void
}

export function EditorToolbar({
  value,
  isDraft,
  showPreview,
  selectedTemplate,
  onSave,
  onCopy,
  onCopyPreview,
  onNewArticle,
  onArticleSelect,
  onTemplateSelect,
  onTemplateChange,
  onStyleOptionsChange,
  onPreviewToggle,
  styleOptions,
  codeTheme,
  onCodeThemeChange,
  wordCount,
  readingTime
}: EditorToolbarProps) {
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      const result = await onCopy()
      if (result) {
        toast({
          title: "复制成功",
          description: "已复制源码内容",
          duration: 2000
        })
      } else {
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "无法访问剪贴板，请检查浏览器权限",
          action: <ToastAction altText="重试">重试</ToastAction>,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "发生错误，请重试",
        action: <ToastAction altText="重试">重试</ToastAction>,
      })
    }
  }

  const handleCopyPreview = async () => {
    try {
      const result = await onCopyPreview()
      if (result) {
        toast({
          title: "复制成功",
          description: "已复制预览内容",
          duration: 2000
        })
      } else {
        toast({
          variant: "destructive",
          title: "复制失败",
          description: "无法访问剪贴板，请检查浏览器权限",
          action: <ToastAction altText="重试">重试</ToastAction>,
        })
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "复制失败",
        description: "发生错误，请重试",
        action: <ToastAction altText="重试">重试</ToastAction>,
      })
    }
  }

  return (
    <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="px-4">
        <div className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-primary hidden sm:flex items-center gap-2">
                <Logo className="w-6 h-6" />
                NeuraPress
              </Link>
              <ArticleList 
                onSelect={onArticleSelect}
                currentContent={value}
                onNew={onNewArticle}
              />
              <WechatStylePicker 
                value={selectedTemplate} 
                onSelect={onTemplateSelect} 
              /> 
              <CodeThemeSelector 
                value={codeTheme} 
                onChange={onCodeThemeChange} 
              />
              <StyleConfigDialog
                value={styleOptions}
                onChangeAction={onStyleOptionsChange}
              />
               <TemplateManager onTemplateChange={onTemplateChange} />
              <button
                onClick={onPreviewToggle}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors justify-center",
                  showPreview 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                <Smartphone className="h-4 w-4" />
                {showPreview ? '编辑' : '预览'}
              </button>
            </div>
            <div className="flex items-center gap-4">
              {isDraft && (
                <span className="text-sm text-muted-foreground">未保存</span>
              )}
              <button
                onClick={onSave}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors",
                  isDraft 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                <Save className="h-4 w-4" />
                <span>保存</span>
              </button>
              <button
                onClick={handleCopy}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-muted text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>复制源码</span>
              </button>
              <button
                onClick={handleCopyPreview}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors"
              >
                <Copy className="h-4 w-4" />
                <span>复制预览</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 