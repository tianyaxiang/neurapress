import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, PAGE_SETTINGS, pageSizeOptions, type PageMode, type PageNumberPosition, type PageSizeOption } from '../constants'

export function usePagination() {
  const [pageMode, setPageMode] = useState<PageMode>('single')
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberPosition>('none')
  const [pageSize, setPageSize] = useState<PageSizeOption>(PAGE_SETTINGS.defaultPageSize)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageContents, setPageContents] = useState<string[]>([])

  // 切换页面模式
  const handlePageModeChange = useCallback((mode: PageMode) => {
    setPageMode(mode)
    setCurrentPage(1)
    localStorage.setItem(STORAGE_KEYS.PAGE_MODE, mode)
  }, [])

  // 切换页码位置
  const handlePageNumberPositionChange = useCallback((position: PageNumberPosition) => {
    setPageNumberPosition(position)
    localStorage.setItem(STORAGE_KEYS.PAGE_NUMBER_POSITION, position)
  }, [])

  // 切换分页大小
  const handlePageSizeChange = useCallback((size: PageSizeOption) => {
    setPageSize(size)
    setCurrentPage(1)
    localStorage.setItem(STORAGE_KEYS.PAGE_SIZE, size)
  }, [])

  // 分页内容处理
  const splitContentToPages = useCallback((html: string) => {
    if (pageMode === 'single') {
      setPageContents([html])
      setTotalPages(1)
      setCurrentPage(1)
      return
    }

    // 多页模式：按标题或内容长度分页
    const pages: string[] = []
    const maxLength = pageSizeOptions[pageSize].maxLength
    
    // 简单的分页策略：按h2标题分页
    const sections = html.split(/<h2[^>]*>/i)
    
    if (sections.length <= 1) {
      // 没有h2标题，按内容长度分页
      let currentContent = html
      
      while (currentContent.length > maxLength) {
        let splitIndex = currentContent.substring(0, maxLength).lastIndexOf('</p>')
        if (splitIndex === -1) {
          splitIndex = currentContent.substring(0, maxLength).lastIndexOf(' ')
        }
        if (splitIndex === -1) {
          splitIndex = maxLength
        }
        
        pages.push(currentContent.substring(0, splitIndex))
        currentContent = currentContent.substring(splitIndex)
      }
      
      if (currentContent.trim()) {
        pages.push(currentContent)
      }
    } else {
      // 按h2标题分页，但也要考虑内容长度限制
      if (sections[0].trim()) {
        pages.push(sections[0])
      }
      
      for (let i = 1; i < sections.length; i++) {
        const sectionContent = '<h2>' + sections[i]
        
        // 如果单个段落内容过长，需要进一步分页
        if (sectionContent.length > maxLength) {
          let remainingContent = sectionContent
          
          while (remainingContent.length > maxLength) {
            let splitIndex = remainingContent.substring(0, maxLength).lastIndexOf('</p>')
            if (splitIndex === -1) {
              splitIndex = remainingContent.substring(0, maxLength).lastIndexOf(' ')
            }
            if (splitIndex === -1) {
              splitIndex = maxLength
            }
            
            pages.push(remainingContent.substring(0, splitIndex))
            remainingContent = remainingContent.substring(splitIndex)
          }
          
          if (remainingContent.trim()) {
            pages.push(remainingContent)
          }
        } else {
          pages.push(sectionContent)
        }
      }
    }

    setPageContents(pages.length > 0 ? pages : [html])
    setTotalPages(pages.length > 0 ? pages.length : 1)
    setCurrentPage(1)
  }, [pageMode, pageSize])

  // 导航功能
  const goToPage = useCallback((page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }, [totalPages])

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
    }
  }, [currentPage, totalPages])

  const goToPrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
    }
  }, [currentPage])

  // 获取当前页内容
  const getCurrentPageContent = useCallback(() => {
    const content = pageContents[currentPage - 1] || ''
    
    // 添加页码（如果需要）
    if (pageNumberPosition !== 'none' && totalPages > 1) {
      const pageNumber = `<div class="page-number page-number-${pageNumberPosition}">${currentPage} / ${totalPages}</div>`
      return content + pageNumber
    }
    
    return content
  }, [pageContents, currentPage, pageNumberPosition, totalPages])

  // 加载保存的设置
  useEffect(() => {
    const savedPageMode = localStorage.getItem(STORAGE_KEYS.PAGE_MODE) as PageMode
    const savedPageNumberPosition = localStorage.getItem(STORAGE_KEYS.PAGE_NUMBER_POSITION) as PageNumberPosition
    const savedPageSize = localStorage.getItem(STORAGE_KEYS.PAGE_SIZE) as PageSizeOption
    
    if (savedPageMode && (savedPageMode === 'single' || savedPageMode === 'multiple')) {
      setPageMode(savedPageMode)
    }
    
    if (savedPageNumberPosition && ['none', 'bottom', 'bottom-right'].includes(savedPageNumberPosition)) {
      setPageNumberPosition(savedPageNumberPosition)
    }
    
    if (savedPageSize && savedPageSize in pageSizeOptions) {
      setPageSize(savedPageSize)
    }
  }, [])

  return {
    // 状态
    pageMode,
    pageNumberPosition,
    pageSize,
    currentPage,
    totalPages,
    pageContents,
    
    // 操作
    handlePageModeChange,
    handlePageNumberPositionChange,
    handlePageSizeChange,
    splitContentToPages,
    goToPage,
    goToNextPage,
    goToPrevPage,
    getCurrentPageContent,
    
    // 计算属性
    hasMultiplePages: totalPages > 1,
    hasPrevPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  }
} 