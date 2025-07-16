'use client'

import { ZoomIn, ZoomOut, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { xiaohongshuTemplates, type XiaohongshuTemplateId, type PageMode, type PageNumberPosition } from '../constants'

interface XiaohongshuPreviewProps {
  previewRef: React.RefObject<HTMLDivElement>
  selectedTemplate: XiaohongshuTemplateId
  parsedHtml: string
  zoom: number
  isFullscreen: boolean
  pageMode: PageMode
  currentPage: number
  totalPages: number
  hasPrevPage: boolean
  hasNextPage: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onToggleFullscreen: () => void
  onPrevPage: () => void
  onNextPage: () => void
  onGoToPage: (page: number) => void
}

export function XiaohongshuPreview({
  previewRef,
  selectedTemplate,
  parsedHtml,
  zoom,
  isFullscreen,
  pageMode,
  currentPage,
  totalPages,
  hasPrevPage,
  hasNextPage,
  onZoomIn,
  onZoomOut,
  onToggleFullscreen,
  onPrevPage,
  onNextPage,
  onGoToPage,
}: XiaohongshuPreviewProps) {
  const currentTemplate = xiaohongshuTemplates[selectedTemplate]

  return (
    <div 
      ref={previewRef}
      className={cn(
        "preview-container bg-background transition-all duration-300 ease-in-out flex flex-col",
        "w-1/2",
        "markdown-body relative",
        currentTemplate?.styles
      )}
    >
      {/* 预览工具栏 */}
      <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b flex items-center justify-between z-10">
        <div className="flex items-center gap-0.5 px-4 py-2">
          <span className="text-sm text-muted-foreground">
            预览效果
            {pageMode === 'multiple' && totalPages > 1 && (
              <span className="ml-2 text-xs">
                {currentPage} / {totalPages}
              </span>
            )}
          </span>
        </div>
        
        <div className="flex items-center gap-4 px-4 py-2">
          {/* 分页导航 */}
          {pageMode === 'multiple' && totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={onPrevPage}
                disabled={!hasPrevPage}
                className="p-1 rounded hover:bg-muted/80 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              
              {/* 页码快速跳转 */}
              <div className="flex items-center gap-1 mx-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum: number
                  if (totalPages <= 5) {
                    pageNum = i + 1
                  } else if (currentPage <= 3) {
                    pageNum = i + 1
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i
                  } else {
                    pageNum = currentPage - 2 + i
                  }
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => onGoToPage(pageNum)}
                      className={cn(
                        "w-6 h-6 text-xs rounded",
                        currentPage === pageNum
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-muted/80 text-muted-foreground"
                      )}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              
              <button
                onClick={onNextPage}
                disabled={!hasNextPage}
                className="p-1 rounded hover:bg-muted/80 text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
          
          {/* 缩放控制 */}
          <div className="flex items-center gap-2">
            <button
              onClick={onZoomOut}
              className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">{zoom}%</span>
            <button
              onClick={onZoomIn}
              className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>
          
          <button
            onClick={onToggleFullscreen}
            className="p-1 rounded hover:bg-muted/80 text-muted-foreground"
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* 预览内容 */}
      <div 
        className="flex-1 overflow-auto"
        style={{ zoom: `${zoom}%` }}
      >
        <div className={cn(
          "preview-content py-4",
          "prose prose-slate dark:prose-invert max-w-none",
          "xiaohongshu-preview",
          pageMode === 'multiple' ? 'multi-page' : 'single-page'
        )}>
          <div 
            className="px-6"
            dangerouslySetInnerHTML={{ __html: parsedHtml }}
          />
        </div>
      </div>
    </div>
  )
} 