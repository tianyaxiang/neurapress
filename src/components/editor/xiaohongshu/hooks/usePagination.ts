import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS, PAGE_SETTINGS, type PageMode, type PageNumberPosition } from '../constants'

export function usePagination() {
  const [pageMode, setPageMode] = useState<PageMode>('single')
  const [pageNumberPosition, setPageNumberPosition] = useState<PageNumberPosition>('none')
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
    
    // 简单的分页策略：按h2标题分页
    const sections = html.split(/<h2[^>]*>/i)
    
    if (sections.length <= 1) {
      // 没有h2标题，按内容长度分页
      const maxLength = 1500 // 每页最大字符数
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
      // 按h2标题分页
      if (sections[0].trim()) {
        pages.push(sections[0])
      }
      
      for (let i = 1; i < sections.length; i++) {
        pages.push('<h2>' + sections[i])
      }
    }

    setPageContents(pages.length > 0 ? pages : [html])
    setTotalPages(pages.length > 0 ? pages.length : 1)
    setCurrentPage(1)
  }, [pageMode])

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
    
    if (savedPageMode && (savedPageMode === 'single' || savedPageMode === 'multiple')) {
      setPageMode(savedPageMode)
    }
    
    if (savedPageNumberPosition && ['none', 'bottom', 'bottom-right'].includes(savedPageNumberPosition)) {
      setPageNumberPosition(savedPageNumberPosition)
    }
  }, [])

  return {
    // 状态
    pageMode,
    pageNumberPosition,
    currentPage,
    totalPages,
    pageContents,
    
    // 操作
    handlePageModeChange,
    handlePageNumberPositionChange,
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