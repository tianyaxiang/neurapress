'use client'

import { MainNav } from '@/components/nav/MainNav'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-full">
      <MainNav />
      <main className="py-10">
        <div className="container mx-auto">
          <div className="mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                内容转换工具
              </h1>
              <p className="mt-2 text-sm text-gray-600">
                选择需要使用的功能
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Link 
                href="/wechat"
                className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  微信公众号
                  <span className="absolute inset-0"></span>
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  将内容转换为微信公众号格式，支持多种样式模板
                </p>
              </Link>

              <Link 
                href="/xiaohongshu"
                className="group relative rounded-lg border border-gray-200 bg-white p-6 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900">
                  小红书
                  <span className="absolute inset-0"></span>
                </h3>
                <p className="mt-2 text-sm text-gray-600">
                  将内容转换为小红书笔记格式，轻松发布内容
                </p>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 