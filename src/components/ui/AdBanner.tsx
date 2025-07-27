"use client"

import * as React from "react"
import { X } from "lucide-react"
import { Button } from "./button"
import { Card } from "./card"
import { cn } from "@/lib/utils"

interface AdBannerProps {
  id?: string // 广告ID，用于本地存储
  imageUrl?: string
  title?: string
  description?: string
  linkUrl?: string
  className?: string
  onClose?: () => void
  expireDays?: number // 关闭后多少天内不再显示，默认7天
  floating?: boolean // 是否浮动显示
}

const AdBanner = React.forwardRef<HTMLDivElement, AdBannerProps>(
  ({ 
    id = "default-ad",
    imageUrl = "/assets/img/neurapress-web-app.jpg", 
    title = "NeuraPress - 让 Markdown 编辑更简单",
    description = "专业的 Markdown 编辑器，支持微信公众号、小红书等多平台格式导出",
    linkUrl = "#",
    className,
    onClose,
    expireDays = 7,
    floating = false,
    ...props 
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(true)
    const storageKey = `ad_banner2_closed_${id}`

    // 检查广告是否已被关闭且未过期
    React.useEffect(() => {
      try {
        const closedData = localStorage.getItem(storageKey)
        if (closedData) {
          const { timestamp } = JSON.parse(closedData)
          const expireTime = timestamp + (expireDays * 24 * 60 * 60 * 1000)
          if (Date.now() < expireTime) {
            setIsVisible(false)
            return
          } else {
            // 过期了，清除存储
            localStorage.removeItem(storageKey)
          }
        }
      } catch (error) {
        console.warn('AdBanner localStorage error:', error)
      }
    }, [storageKey, expireDays])

    const handleClose = () => {
      setIsVisible(false)
      
      // 保存关闭状态到localStorage
      try {
        localStorage.setItem(storageKey, JSON.stringify({
          timestamp: Date.now()
        }))
      } catch (error) {
        console.warn('AdBanner localStorage save error:', error)
      }
      
      onClose?.()
    }

    const handleClick = () => {
      if (linkUrl && linkUrl !== "#") {
        window.open(linkUrl, "_blank")
      }
    }

    if (!isVisible) return null

    // 浮动模式的样式
    const floatingStyles = floating ? {
      position: 'fixed' as const,
      bottom: '20px',
      right: '20px',
      zIndex: 1000,
      width: '180px',
    } : {}

    return (
      <Card
        ref={ref}
        style={floatingStyles}
        className={cn(
          floating 
            ? "relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-lg animate-in slide-in-from-bottom-2 duration-500" 
            : "relative overflow-hidden bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-md hover:shadow-lg transition-all duration-300",
          className
        )}
        {...props}
      >
        {/* 关闭按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 z-10 h-6 w-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div 
          className={cn(
            "cursor-pointer",
            floating 
              ? "p-4 pb-3" 
              : "flex items-center gap-4 p-4"
          )}
          onClick={handleClick}
        >
          {floating ? (
            // 浮动模式：垂直布局，图片在上
            <div className="space-y-4">
              {/* 顶部图片 */}
              <div className="flex justify-center pt-2">
                <div className="w-25 h-25 rounded-lg overflow-hidden shadow-sm">
                  <img
                    src="/assets/img/qun.png"
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // 如果图片加载失败，回退到默认的D图标
                      const target = e.currentTarget;
                      target.style.display = 'none';
                      const fallback = target.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div 
                    className="w-full h-full bg-black dark:bg-white rounded-lg flex items-center justify-center"
                    style={{ display: 'none' }}
                  >
                    <span className="text-white dark:text-black font-bold text-2xl">D</span>
                  </div>
                </div>
              </div>
              
            
              {/* 底部标识 */}
              <div className="text-center text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide pt-2">
                ADS VIA NEURAPRESS
              </div>
            </div>
          ) : (
            // 非浮动模式：水平布局
            <>
              {/* 左侧图片 */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
                  <img
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' fill='%23f3f4f6'/%3E%3Ctext x='32' y='32' text-anchor='middle' dy='0.3em' font-family='Arial' font-size='12' fill='%236b7280'%3EAD%3C/text%3E%3C/svg%3E"
                    }}
                  />
                </div>
              </div>

              {/* 右侧内容 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {description}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* 装饰性渐变 - 仅非浮动模式显示 */}
        {!floating && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent pointer-events-none" />
        )}
      </Card>
    )
  }
)

AdBanner.displayName = "AdBanner"

export { AdBanner, type AdBannerProps } 