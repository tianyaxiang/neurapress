import { Copy, Plus, Save, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WechatStylePicker } from '../../template/WechatStylePicker'
import { TemplateManager } from '../../template/TemplateManager'
import { StyleConfigDialog } from '../StyleConfigDialog'
import { ArticleList } from '../ArticleList'
import { type Article } from '../constants'
import { type RendererOptions } from '@/lib/markdown'

interface EditorToolbarProps {
  value: string
  isDraft: boolean
  showPreview: boolean
  selectedTemplate: string
  onSave: () => void
  onCopy: () => void
  onCopyPreview: () => void
  onNewArticle: () => void
  onArticleSelect: (article: Article) => void
  onTemplateSelect: (template: string) => void
  onTemplateChange: () => void
  onStyleOptionsChange: (options: RendererOptions) => void
  onPreviewToggle: () => void
  styleOptions: RendererOptions
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
  styleOptions
}: EditorToolbarProps) {
  return (
    <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="container mx-auto">
        <div className="p-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
              <ArticleList 
                onSelect={onArticleSelect}
                currentContent={value}
                onNew={onNewArticle}
              />
              <button
                onClick={onNewArticle}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors w-full sm:w-auto justify-center bg-muted text-muted-foreground hover:bg-muted/90"
              >
                <Plus className="h-4 w-4" />
                新建文章
              </button>
              <WechatStylePicker 
                value={selectedTemplate} 
                onSelect={onTemplateSelect} 
              />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <TemplateManager onTemplateChange={onTemplateChange} />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <StyleConfigDialog
                value={styleOptions}
                onChangeAction={onStyleOptionsChange}
              />
              <div className="hidden sm:block h-6 w-px bg-border" />
              <button
                onClick={onPreviewToggle}
                className={cn(
                  "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors w-full sm:w-auto justify-center",
                  showPreview 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                <Smartphone className="h-4 w-4" />
                {showPreview ? '编辑' : '预览'}
              </button>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {isDraft && (
                <span className="text-sm text-muted-foreground">未保存</span>
              )}
              <button
                onClick={onSave}
                className={cn(
                  "inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-sm transition-colors flex-1 sm:flex-none",
                  isDraft 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-muted text-muted-foreground hover:bg-muted/90"
                )}
              >
                <Save className="h-4 w-4" />
                <span>保存</span>
              </button>
              <button
                onClick={onCopy}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-muted text-muted-foreground hover:bg-muted/90 text-sm transition-colors flex-1 sm:flex-none"
              >
                <Copy className="h-4 w-4" />
                <span>复制源码</span>
              </button>
              <button
                onClick={onCopyPreview}
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 text-sm transition-colors flex-1 sm:flex-none"
              >
                <Copy className="h-4 w-4" />
                <span>复制预览</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 