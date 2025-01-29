import { cn } from '@/lib/utils'
import { PREVIEW_SIZES, type PreviewSize } from '../constants'
import { Loader2 } from 'lucide-react'
import { templates } from '@/config/wechat-templates'

interface EditorPreviewProps {
  previewRef: React.RefObject<HTMLDivElement>
  selectedTemplate: string
  previewSize: PreviewSize
  isConverting: boolean
  previewContent: string
  onPreviewSizeChange: (size: PreviewSize) => void
}

export function EditorPreview({
  previewRef,
  selectedTemplate,
  previewSize,
  isConverting,
  previewContent,
  onPreviewSizeChange
}: EditorPreviewProps) {
  return (
    <div 
      ref={previewRef}
      className={cn(
        "preview-container bg-background transition-all duration-300 ease-in-out flex flex-col",
        "h-[50%] sm:h-full sm:w-1/2",
        "markdown-body",
        selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
      )}
    >
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b px-4 py-2 flex items-center justify-between z-10 sticky top-0">
        <div className="text-sm text-muted-foreground">预览效果</div>
        <div className="flex items-center gap-2">
          <select
            value={previewSize}
            onChange={(e) => onPreviewSizeChange(e.target.value as PreviewSize)}
            className="text-sm border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-background text-foreground"
          >
            {Object.entries(PREVIEW_SIZES).map(([key, { label }]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="min-h-full py-8 px-4">
          <div 
            className={cn(
              "bg-background mx-auto rounded-lg transition-all duration-300",
              previewSize === 'full' ? '' : 'border shadow-sm'
            )}
            style={{ 
              width: PREVIEW_SIZES[previewSize].width,
              maxWidth: '100%'
            }}
          >
            {isConverting ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <div className={cn(
                "preview-content py-4",
                "prose prose-slate dark:prose-invert max-w-none",
                selectedTemplate && templates.find(t => t.id === selectedTemplate)?.styles
              )}>
                <div className="px-6" dangerouslySetInnerHTML={{ __html: previewContent }} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 