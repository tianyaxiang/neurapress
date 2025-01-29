import { Copy, Save, Smartphone } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MobileToolbarProps {
  showPreview: boolean
  isDraft: boolean
  onPreviewToggle: () => void
  onSave: () => void
  onCopy: () => void
  onCopyPreview: () => void
}

export function MobileToolbar({
  showPreview,
  isDraft,
  onPreviewToggle,
  onSave,
  onCopy,
  onCopyPreview
}: MobileToolbarProps) {
  return (
    <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t p-2 flex justify-around">
      <button
        onClick={onPreviewToggle}
        className={cn(
          "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
          showPreview 
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        <Smartphone className="h-5 w-5" />
        {showPreview ? '编辑' : '预览'}
      </button>
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
        onClick={onCopy}
        className="flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs text-muted-foreground transition-colors relative"
      >
        <Copy className="h-5 w-5" />
        源码
      </button>
      <button
        onClick={onCopyPreview}
        className={cn(
          "flex flex-col items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors relative",
          "hover:bg-primary/10 active:bg-primary/20",
          showPreview ? "text-primary" : "text-muted-foreground"
        )}
      >
        <Copy className="h-5 w-5" />
        复制预览
      </button>
    </div>
  )
} 