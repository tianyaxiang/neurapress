import { Copy, Save, Settings, Image, Link } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

interface MobileToolbarProps {
  showPreview: boolean
  isDraft: boolean
  onPreviewToggle: () => void
  onSave: () => void
  onCopy: () => void
  onCopyPreview: () => void
  onImageUpload?: (file: File) => Promise<string>
  onLinkInsert?: (url: string) => void
}

export function MobileToolbar({
  showPreview,
  isDraft,
  onPreviewToggle,
  onSave,
  onCopy,
  onCopyPreview,
  onImageUpload,
  onLinkInsert
}: MobileToolbarProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t">
      <div className="flex items-center justify-between p-2">
        <div className="flex items-center gap-2">
          <button
            onClick={onSave}
            className={cn(
              "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
              isDraft 
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            <Save className="h-5 w-5" />
            保存
            {isDraft && <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />}
          </button>
          <button
            onClick={onCopyPreview}
            className="flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground transition-colors"
          >
            <Copy className="h-5 w-5" />
            复制
          </button>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button className="p-1 rounded-md text-muted-foreground">
              <Settings className="h-5 w-5" />
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[40vh]">
            <div className="grid grid-cols-4 gap-4 p-4">
              <button
                onClick={onCopy}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/80"
              >
                <Copy className="h-6 w-6" />
                <span className="text-xs">复制源码</span>
              </button>
              <button
                onClick={onCopyPreview}
                className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/80"
              >
                <Copy className="h-6 w-6" />
                <span className="text-xs">复制预览</span>
              </button>
              {onImageUpload && (
                <button
                  onClick={() => {
                    const input = document.createElement('input')
                    input.type = 'file'
                    input.accept = 'image/*'
                    input.onchange = async (e) => {
                      const file = (e.target as HTMLInputElement).files?.[0]
                      if (file && onImageUpload) {
                        try {
                          await onImageUpload(file)
                        } catch (error) {
                          console.error('Image upload failed:', error)
                        }
                      }
                    }
                    input.click()
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/80"
                >
                  <Image className="h-6 w-6" />
                  <span className="text-xs">插入图片</span>
                </button>
              )}
              {onLinkInsert && (
                <button
                  onClick={() => {
                    const url = window.prompt('请输入链接地址')
                    if (url && onLinkInsert) {
                      onLinkInsert(url)
                    }
                  }}
                  className="flex flex-col items-center gap-2 p-3 rounded-lg border hover:bg-muted/80"
                >
                  <Link className="h-6 w-6" />
                  <span className="text-xs">插入链接</span>
                </button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  )
} 