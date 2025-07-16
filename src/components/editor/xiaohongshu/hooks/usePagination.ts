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
    const minLength = Math.floor(maxLength * 0.4) // 最小页面内容长度为最大长度的40%
    
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
        
        const pageContent = currentContent.substring(0, splitIndex)
        const remainingContent = currentContent.substring(splitIndex)
        
        // 如果剩余内容太少，合并到当前页
        if (remainingContent.trim().length < minLength && remainingContent.trim().length > 0) {
          pages.push(currentContent)
          break
        } else {
          pages.push(pageContent)
          currentContent = remainingContent
        }
      }
      
      if (currentContent.trim()) {
        // 检查最后一页是否内容太少
        if (pages.length > 0 && currentContent.trim().length < minLength) {
          // 将最后一页内容合并到前一页
          const lastPage = pages.pop()
          pages.push(lastPage + currentContent)
        } else {
          pages.push(currentContent)
        }
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
            
            const pageContent = remainingContent.substring(0, splitIndex)
            remainingContent = remainingContent.substring(splitIndex)
            
            // 如果剩余内容太少，合并到当前页
            if (remainingContent.trim().length < minLength && remainingContent.trim().length > 0) {
              pages.push(remainingContent)
              break
            } else {
              pages.push(pageContent)
            }
          }
          
          if (remainingContent.trim() && remainingContent.length >= minLength) {
            pages.push(remainingContent)
          }
        } else {
          // 检查是否应该与前一页合并
          if (pages.length > 0 && sectionContent.length < minLength) {
            const lastPage = pages.pop()
            pages.push(lastPage + sectionContent)
          } else {
            pages.push(sectionContent)
          }
        }
      }
    }

    // 最终检查：确保没有过短的页面
    const optimizedPages: string[] = []
    for (let i = 0; i < pages.length; i++) {
      const currentPage = pages[i]
      
      if (currentPage.trim().length < minLength && i < pages.length - 1) {
        // 如果当前页内容太少且不是最后一页，尝试与下一页合并
        const nextPage = pages[i + 1]
        if (currentPage.length + nextPage.length <= maxLength * 1.2) {
          pages[i + 1] = currentPage + nextPage
          continue
        }
      }
      
      optimizedPages.push(currentPage)
    }

    setPageContents(optimizedPages.length > 0 ? optimizedPages : [html])
    setTotalPages(optimizedPages.length > 0 ? optimizedPages.length : 1)
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
    let content = pageContents[currentPage - 1] || ''
    
    // 为内容较少的页面添加填充，确保高度一致
    if (totalPages > 1 && content.length < pageSizeOptions[pageSize].maxLength * 0.6) {
      // 如果当前页内容少于60%的最大长度，添加空白填充
      const paddingDiv = '<div class="page-content-padding" style="height: 200px; visibility: hidden;"></div>'
      content += paddingDiv
    }
    
    // 添加页码（如果需要）
    if (pageNumberPosition !== 'none' && totalPages > 1) {
      const pageNumber = `<div class="page-number page-number-${pageNumberPosition}">${currentPage} / ${totalPages}</div>`
      return content + pageNumber
    }
    
    return content
  }, [pageContents, currentPage, pageNumberPosition, totalPages, pageSize])

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