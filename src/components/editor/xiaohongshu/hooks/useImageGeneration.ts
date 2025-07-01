import { useState, useCallback } from 'react'
import html2canvas from 'html2canvas'
import JSZip from 'jszip'
import { useToast } from '@/components/ui/use-toast'
import type { PageMode } from '../constants'

export function useImageGeneration() {
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const { toast } = useToast()

  // 生成单张图片
  const generateSingleImage = useCallback(async (
    contentElement: HTMLElement,
    filename: string = `xiaohongshu-note-${Date.now()}.png`
  ) => {
    const canvas = await html2canvas(contentElement, {
      backgroundColor: '#ffffff',
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      height: contentElement.scrollHeight,
      width: contentElement.scrollWidth,
    })

    // 下载图片
    const link = document.createElement('a')
    link.download = filename
    link.href = canvas.toDataURL()
    link.click()

    return canvas
  }, [])

  // 生成多张图片并打包为zip
  const generateMultipleImages = useCallback(async (
    previewRef: React.RefObject<HTMLDivElement>,
    pageContents: string[],
    getCurrentPageContent: () => string,
    goToPage: (page: number) => void
  ) => {
    const zip = new JSZip()
    const timestamp = Date.now()
    
    // 获取预览容器
    const previewContainer = previewRef.current
    if (!previewContainer) {
      throw new Error('预览容器未找到')
    }

    // 为每一页生成图片
    for (let i = 0; i < pageContents.length; i++) {
      const pageNumber = i + 1
      
      // 切换到当前页
      goToPage(pageNumber)
      
      // 等待页面渲染
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 查找预览内容元素
      const contentElement = previewContainer.querySelector('.preview-content')
      if (!contentElement) {
        continue
      }

      // 生成当前页的图片
      const canvas = await html2canvas(contentElement as HTMLElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: true,
        allowTaint: true,
        height: (contentElement as HTMLElement).scrollHeight,
        width: (contentElement as HTMLElement).scrollWidth,
      })

      // 将canvas转换为blob并添加到zip
      const dataURL = canvas.toDataURL('image/png')
      const base64Data = dataURL.split(',')[1]
      const filename = `xiaohongshu-note-${String(pageNumber).padStart(2, '0')}.png`
      
      zip.file(filename, base64Data, { base64: true })
    }

    // 生成zip文件并下载
    const zipBlob = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.download = `xiaohongshu-notes-${timestamp}.zip`
    link.href = URL.createObjectURL(zipBlob)
    link.click()
    
    // 清理URL对象
    URL.revokeObjectURL(link.href)
  }, [])

  // 主要的图片生成方法
  const generateImage = useCallback(async (
    previewRef: React.RefObject<HTMLDivElement>,
    pageMode: PageMode,
    pageContents: string[],
    getCurrentPageContent: () => string,
    goToPage: (page: number) => void,
    currentPage: number
  ) => {
    if (!previewRef.current) return

    setIsGeneratingImage(true)
    try {
      if (pageMode === 'single' || pageContents.length <= 1) {
        // 单页模式或只有一页内容
        const contentElement = previewRef.current.querySelector('.preview-content')
        if (!contentElement) {
          throw new Error('预览内容未找到')
        }

        await generateSingleImage(contentElement as HTMLElement)
        
        toast({
          title: "图片生成成功",
          description: "图片已自动下载",
        })
      } else {
        // 多页模式
        await generateMultipleImages(previewRef, pageContents, getCurrentPageContent, goToPage)
        
        // 恢复到原来的页面
        goToPage(currentPage)
        
        toast({
          title: "图片生成成功",
          description: `已生成 ${pageContents.length} 张图片并打包为ZIP文件`,
        })
      }
    } catch (error) {
      console.error('Image generation error:', error)
      toast({
        title: "图片生成失败",
        description: "请重试",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }, [generateSingleImage, generateMultipleImages, toast])

  return {
    isGeneratingImage,
    generateImage,
  }
} 