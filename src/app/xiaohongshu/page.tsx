import XiaohongshuMarkdownEditor from '@/components/editor/xiaohongshu/XiaohongshuMarkdownEditor'
import { Toaster } from '@/components/ui/toaster'

export default function XiaohongshuPage() {
  return (
    <main className="h-full bg-background flex flex-col">
      <div className="flex-1 relative">
        <XiaohongshuMarkdownEditor />
      </div>

      <Toaster />
    </main>
  )
} 