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
    // 保存原始样式
    const originalStyles = {
      height: contentElement.style.height,
      minHeight: contentElement.style.minHeight,
      width: contentElement.style.width,
      display: contentElement.style.display,
      flexDirection: contentElement.style.flexDirection,
      justifyContent: contentElement.style.justifyContent,
      alignItems: contentElement.style.alignItems,
      margin: contentElement.style.margin,
      padding: contentElement.style.padding,
      boxSizing: contentElement.style.boxSizing,
    }

    // 设置标准尺寸
    const standardWidth = 720
    const standardHeight = Math.max(contentElement.scrollHeight, 960)
    
    // 添加生成中的样式类并设置固定尺寸
    contentElement.classList.add('generating-image')
    contentElement.style.minHeight = `${standardHeight}px`
    contentElement.style.height = `${standardHeight}px`
    contentElement.style.width = `${standardWidth}px`
    contentElement.style.display = 'flex'
    contentElement.style.flexDirection = 'column'
    contentElement.style.justifyContent = 'flex-start'
    contentElement.style.alignItems = 'center'
    contentElement.style.margin = '0 auto'
    contentElement.style.padding = '40px 60px'
    contentElement.style.boxSizing = 'border-box'
    
    // 计算合适的缩放比例以确保最小分辨率
    const minWidth = 720
    const minHeight = 960
    
    // 计算缩放比例，确保至少达到最小分辨率
    const scaleX = Math.max(minWidth / standardWidth, 1)
    const scaleY = Math.max(minHeight / standardHeight, 1)
    const scale = Math.max(scaleX, scaleY, 2) // 最小缩放2倍以保证清晰度
    
    const canvas = await html2canvas(contentElement, {
      backgroundColor: '#ffffff',
      scale: scale,
      useCORS: true,
      allowTaint: true,
      height: standardHeight,
      width: standardWidth,
      logging: false, // 关闭日志以提高性能
      imageTimeout: 15000, // 增加图片加载超时时间
      x: 0,
      y: 0,
      scrollX: 0,
      scrollY: 0,
    })

    // 恢复原始样式
    contentElement.classList.remove('generating-image')
    Object.assign(contentElement.style, originalStyles)

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

    // 先遍历所有页面，计算最大高度以确保一致性
    let maxHeight = 0
    let maxWidth = 0
    const pageElements: HTMLElement[] = []
    
    for (let i = 0; i < pageContents.length; i++) {
      const pageNumber = i + 1
      goToPage(pageNumber)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const contentElement = previewContainer.querySelector('.preview-content') as HTMLElement
      if (contentElement) {
        maxHeight = Math.max(maxHeight, contentElement.scrollHeight)
        maxWidth = Math.max(maxWidth, contentElement.scrollWidth)
        pageElements.push(contentElement.cloneNode(true) as HTMLElement)
      }
    }

    // 设置统一的最小高度，确保所有页面高度一致
    const standardHeight = Math.max(maxHeight, 960) // 至少960px高度
    const standardWidth = Math.max(maxWidth, 720)   // 至少720px宽度

    // 为每一页生成图片
    for (let i = 0; i < pageContents.length; i++) {
      const pageNumber = i + 1
      
      // 切换到当前页
      goToPage(pageNumber)
      
      // 等待页面渲染
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 查找预览内容元素
      const contentElement = previewContainer.querySelector('.preview-content') as HTMLElement
      if (!contentElement) {
        continue
      }

      // 保存原始样式
      const originalStyles = {
        height: contentElement.style.height,
        minHeight: contentElement.style.minHeight,
        width: contentElement.style.width,
        display: contentElement.style.display,
        flexDirection: contentElement.style.flexDirection,
        justifyContent: contentElement.style.justifyContent,
        alignItems: contentElement.style.alignItems,
        margin: contentElement.style.margin,
        padding: contentElement.style.padding,
        boxSizing: contentElement.style.boxSizing,
      }
      
      // 添加生成中的样式类并设置固定尺寸
      contentElement.classList.add('generating-image')
      contentElement.style.minHeight = `${standardHeight}px`
      contentElement.style.height = `${standardHeight}px`
      contentElement.style.width = `${standardWidth}px`
      contentElement.style.display = 'flex'
      contentElement.style.flexDirection = 'column'
      contentElement.style.justifyContent = 'flex-start'
      contentElement.style.alignItems = 'center'
      contentElement.style.margin = '0 auto'
      contentElement.style.padding = '40px 60px'
      contentElement.style.boxSizing = 'border-box'

      // 计算合适的缩放比例以确保最小分辨率
      const minWidth = 720
      const minHeight = 960
      
      // 计算缩放比例，确保至少达到最小分辨率
      const scaleX = Math.max(minWidth / standardWidth, 1)
      const scaleY = Math.max(minHeight / standardHeight, 1)
      const scale = Math.max(scaleX, scaleY, 2) // 最小缩放2倍以保证清晰度

      // 生成当前页的图片
      const canvas = await html2canvas(contentElement, {
        backgroundColor: '#ffffff',
        scale: scale,
        useCORS: true,
        allowTaint: true,
        height: standardHeight, // 使用统一高度
        width: standardWidth,   // 使用统一宽度
        logging: false,
        imageTimeout: 15000,
        x: 0, // 从左边开始截取
        y: 0, // 从顶部开始截取
        scrollX: 0,
        scrollY: 0,
      })

      // 恢复原始样式
      contentElement.classList.remove('generating-image')
      Object.assign(contentElement.style, originalStyles)

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

        const canvas = await generateSingleImage(contentElement as HTMLElement)
        
        // 获取生成的图片尺寸
        const generatedWidth = canvas.width
        const generatedHeight = canvas.height
        const aspectRatio = (generatedWidth / generatedHeight).toFixed(2)
        
        toast({
          title: "图片生成成功",
          description: `图片已自动下载 (${generatedWidth}×${generatedHeight}, 比例${aspectRatio}:1)。建议上传3:4至2:1比例、分辨率不低于720*960的照片获得最佳效果`,
        })
      } else {
        // 多页模式
        await generateMultipleImages(previewRef, pageContents, getCurrentPageContent, goToPage)
        
        // 恢复到原来的页面
        goToPage(currentPage)
        
        toast({
          title: "图片生成成功",
          description: `已生成 ${pageContents.length} 张高度一致的图片并打包为ZIP文件。所有图片已优化为统一尺寸，确保视觉效果一致。`,
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