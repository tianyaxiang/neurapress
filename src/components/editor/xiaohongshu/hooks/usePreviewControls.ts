import { useState, useEffect, useCallback } from 'react'
import { STORAGE_KEYS } from '../constants'

export function usePreviewControls() {
  const [zoom, setZoom] = useState(100)
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 全屏切换
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
        setIsFullscreen(true)
      } else {
        await document.exitFullscreen()
        setIsFullscreen(false)
      }
    } catch (error) {
      console.error('Fullscreen toggle failed:', error)
    }
  }, [])

  // 缩放控制
  const zoomIn = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 10, 200)
      localStorage.setItem(STORAGE_KEYS.ZOOM, newZoom.toString())
      return newZoom
    })
  }, [])

  const zoomOut = useCallback(() => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 10, 50)
      localStorage.setItem(STORAGE_KEYS.ZOOM, newZoom.toString())
      return newZoom
    })
  }, [])

  // 监听全屏状态变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }
    
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // 加载保存的缩放级别
  useEffect(() => {
    const savedZoom = localStorage.getItem(STORAGE_KEYS.ZOOM)
    if (savedZoom) {
      const zoomValue = parseInt(savedZoom, 10)
      if (zoomValue >= 50 && zoomValue <= 200) {
        setZoom(zoomValue)
      }
    }
  }, [])

  return {
    zoom,
    isFullscreen,
    toggleFullscreen,
    zoomIn,
    zoomOut,
  }
} 