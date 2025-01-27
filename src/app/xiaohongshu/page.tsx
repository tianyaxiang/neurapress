import { MainNav } from '@/components/nav/MainNav'
import XiaohongshuEditor from '@/components/editor/XiaohongshuEditor'

export default function XiaohongshuPage() {
  return (
    <div className="min-h-full">
      <MainNav />
      <main className="py-10">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                小红书笔记编辑器
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                编辑内容，预览效果，一键复制
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border p-6">
              <XiaohongshuEditor />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 