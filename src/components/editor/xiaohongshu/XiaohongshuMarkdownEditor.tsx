'use client'

import { useRef, useEffect } from 'react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { XiaohongshuToolbar } from './components/XiaohongshuToolbar'
import { XiaohongshuEditor } from './components/XiaohongshuEditor'
import { XiaohongshuPreview } from './components/XiaohongshuPreview'
import { useXiaohongshuEditor } from './hooks/useXiaohongshuEditor'
import { useImageGeneration } from './hooks/useImageGeneration'
import { usePreviewControls } from './hooks/usePreviewControls'
import { useToolbarInsert } from './hooks/useToolbarInsert'
import { usePagination } from './hooks/usePagination'

export default function XiaohongshuMarkdownEditor() {
  const previewRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // 使用自定义Hooks
  const {
    markdown,
    selectedTemplate,
    parsedHtml,
    isDraft,
    setMarkdown,
    setSelectedTemplate,
    handleSave,
    copyHTML,
    copyMarkdown,
  } = useXiaohongshuEditor()

  const { isGeneratingImage, generateImage } = useImageGeneration()
  
  const {
    zoom,
    isFullscreen,
    toggleFullscreen,
    zoomIn,
    zoomOut,
  } = usePreviewControls()

  const {
    pageMode,
    pageNumberPosition,
    pageSize,
    currentPage,
    totalPages,
    hasMultiplePages,
    hasPrevPage,
    hasNextPage,
    handlePageModeChange,
    handlePageNumberPositionChange,
    handlePageSizeChange,
    splitContentToPages,
    goToPage,
    goToNextPage,
    goToPrevPage,
    getCurrentPageContent,
    pageContents,
  } = usePagination()

  const { handleToolbarInsert } = useToolbarInsert(
    markdown,
    setMarkdown,
    textareaRef
  )

  // 当内容或分页模式变化时，重新分页
  useEffect(() => {
    if (parsedHtml) {
      splitContentToPages(parsedHtml)
    }
  }, [parsedHtml, splitContentToPages])

  // 处理图片生成
  const handleGenerateImage = () => {
    generateImage(
      previewRef,
      pageMode,
      pageContents,
      getCurrentPageContent,
      goToPage,
      currentPage
    )
  }

  // 获取当前页面显示内容
  const displayContent = getCurrentPageContent()

  return (
    <TooltipProvider>
      <div className="h-full flex flex-col bg-background">
        {/* 顶部工具栏 */}
        <XiaohongshuToolbar
          selectedTemplate={selectedTemplate}
          isDraft={isDraft}
          isGeneratingImage={isGeneratingImage}
          pageMode={pageMode}
          pageNumberPosition={pageNumberPosition}
          pageSize={pageSize}
          totalPages={totalPages}
          onTemplateChange={setSelectedTemplate}
          onSave={handleSave}
          onCopyMarkdown={copyMarkdown}
          onCopyHTML={copyHTML}
          onGenerateImage={handleGenerateImage}
          onPageModeChange={handlePageModeChange}
          onPageNumberPositionChange={handlePageNumberPositionChange}
          onPageSizeChange={handlePageSizeChange}
        />

        {/* 编辑器区域 */}
        <div className="flex-1 flex">
          {/* 编辑区域 */}
          <XiaohongshuEditor
            markdown={markdown}
            textareaRef={textareaRef}
            onTextChange={setMarkdown}
            onToolbarInsert={handleToolbarInsert}
          />

          {/* 预览区域 */}
          <XiaohongshuPreview
            previewRef={previewRef}
            selectedTemplate={selectedTemplate}
            parsedHtml={displayContent}
            zoom={zoom}
            isFullscreen={isFullscreen}
            pageMode={pageMode}
            currentPage={currentPage}
            totalPages={totalPages}
            hasPrevPage={hasPrevPage}
            hasNextPage={hasNextPage}
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onToggleFullscreen={toggleFullscreen}
            onPrevPage={goToPrevPage}
            onNextPage={goToNextPage}
            onGoToPage={goToPage}
          />
        </div>
      </div>
    </TooltipProvider>
  )
} 