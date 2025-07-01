"use client"

import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Logo } from '@/components/icons/Logo'
import { Loader2 } from 'lucide-react'
import { AdBanner } from '@/components/ui/AdBanner'

const LoadingLogo = () => (
  <div className="h-full bg-background flex items-center justify-center">
    <div className="flex flex-col items-center mt-20">
      <div className="flex items-center justify-center">
        <Logo className="w-20 h-20" />
        <p className="text-lg font-medium text-foreground">让 Markdown 编辑更简单</p>
      </div> 
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>正在加载编辑器</span>
          <Loader2 className="w-5 h-5 animate-spin" />
        </div>
      </div>
    </div>
  </div>
)

// Dynamically import WechatEditor with no SSR
const WechatEditor = dynamic(() => import('@/components/editor/WechatEditor'), {
  ssr: false,
  loading: () => (
    <LoadingLogo />
  ),
})

export default function WechatPage() {
  return (
    <main className="h-full bg-background flex flex-col">
      <div className="flex-1 relative">
        <Suspense fallback={
          <LoadingLogo />
        }>
          <WechatEditor />
        </Suspense>
      </div>
      
      {/* 浮动广告位 */}
      <AdBanner
        id="wechat-editor-banner-v1"
        title="诗词有典小程序"
        description=""
        expireDays={1}
        floating={true}
        onClose={() => {
          console.log('广告已关闭')
        }}
      />
    </main>
  )
} 