import { Copy, Save, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { WechatStylePicker } from '../../template/WechatStylePicker'

interface MobileToolbarProps {
  showPreview: boolean
  isDraft: boolean
  onPreviewToggle: () => void
  onSave: () => void
  onCopy: () => void
  onCopyPreview: () => void
  selectedTemplate: string
  onTemplateSelect: (template: string) => void
}

export function MobileToolbar({
  showPreview,
  isDraft,
  onPreviewToggle,
  onSave,
  onCopy,
  onCopyPreview,
  selectedTemplate,
  onTemplateSelect
}: MobileToolbarProps) {
  return (
    <div className="bg-background border-t">
      <div className="flex flex-col">
        <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="p-2">
            <WechatStylePicker 
              value={selectedTemplate} 
              onSelect={onTemplateSelect}
            />
          </div>
        </div>
        <div className="flex items-center justify-between p-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <button
            onClick={onCopyPreview}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors mr-2"
          >
            <Copy className="h-4 w-4" />
            复制预览
          </button>

          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center justify-center p-2 rounded-md text-muted-foreground hover:bg-muted/80">
                <Settings className="h-4 w-4" />
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[30vh]">
              <div className="flex flex-col gap-4 p-4">
                <button
                  onClick={onSave}
                  className={cn(
                    "flex items-center justify-center gap-2 px-4 py-2 rounded-md text-sm transition-colors",
                    isDraft 
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Save className="h-4 w-4" />
                  保存文章
                  {isDraft && <span className="w-2 h-2 bg-primary-foreground rounded-full" />}
                </button>
                <button
                  onClick={onCopy}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-muted text-muted-foreground text-sm"
                >
                  <Copy className="h-4 w-4" />
                  复制源码
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
} 