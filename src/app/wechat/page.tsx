import { MainNav } from '@/components/nav/MainNav'
import WechatEditor from '@/components/editor/WechatEditor'

export default function WechatPage() {
  return (
    <div className="min-h-full">
      <MainNav />
      <main className="py-6">
        <div className="container mx-auto px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              微信公众号编辑器
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              编辑内容，预览效果，一键复制
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border">
            <WechatEditor />
          </div>
        </div>
      </main>
    </div>
  )
} 