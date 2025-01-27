import { MainNav } from '@/components/nav/MainNav'
import WechatEditor from '@/components/editor/WechatEditor'

export default function WechatPage() {
  return (
    <div className="min-h-full">
      <MainNav />
      <main className="py-6">
        <div className="container mx-auto px-4">

          <div className="bg-white rounded-lg shadow-sm border">
            <WechatEditor />
          </div>
        </div>
      </main>
    </div>
  )
} 