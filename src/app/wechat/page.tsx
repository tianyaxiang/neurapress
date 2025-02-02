import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Dynamically import WechatEditor with no SSR
const WechatEditor = dynamic(() => import('@/components/editor/WechatEditor'), {
  ssr: false,
  loading: () => (
    <div className="h-full bg-background flex items-center justify-center">
      <div className="animate-pulse">Loading editor...</div>
    </div>
  ),
})

export default function WechatPage() {
  return (
    <main className="h-full bg-background flex flex-col">
      <div className="flex-1 relative">
        <Suspense fallback={
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse">Loading editor...</div>
          </div>
        }>
          <WechatEditor />
        </Suspense>
      </div>
    </main>
  )
} 