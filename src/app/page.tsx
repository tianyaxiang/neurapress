'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MainNav } from '@/components/nav/MainNav'
import { Logo } from '@/components/icons/Logo'
import {
  FileText,
  Smartphone,
  Eye,
  Copy,
  Palette,
  Zap,
  ArrowRight,
  Github,
  Twitter,
  Mail,
  Crown,
  ExternalLink
} from 'lucide-react'

const features = [
  {
    icon: Eye,
    title: '实时预览',
    description: '所见即所得的编辑体验，实时查看最终效果'
  },
  {
    icon: Smartphone,
    title: '移动端支持',
    description: '完美适配手机端，随时随地编辑内容'
  },
  {
    icon: FileText,
    title: '微信风格',
    description: '专为微信公众号优化的排版样式'
  },
  {
    icon: Palette,
    title: '样式定制',
    description: '丰富的样式选项，打造独特的视觉效果'
  },
  {
    icon: Copy,
    title: '一键复制',
    description: '支持复制带格式的内容，直接粘贴使用'
  },
  {
    icon: Zap,
    title: '快速高效',
    description: '基于 Next.js 构建，性能卓越，体验流畅'
  }
]

const platforms = [
  {
    name: '微信公众号',
    description: '专业的微信公众号内容编辑器，支持丰富的排版样式',
    href: '/wechat',
    color: 'bg-green-500'
  },
  {
    name: '小红书笔记',
    description: '优化的小红书内容编辑体验，一键生成精美笔记',
    href: '/xiaohongshu',
    color: 'bg-red-500'
  }
]

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Logo className="w-20 h-20 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              让 <span className="text-primary">Markdown</span> 编辑更简单
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              NeuraPress 是一个现代化的 Markdown 编辑器，专注于提供优质的内容排版体验。
              响应式设计，支持移动设备，让创作变得更加高效。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="text-lg px-8 bg-green-600 hover:bg-green-700">
                <Link href="/wechat">
                  微信公众号编辑器
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" className="text-lg px-8 bg-red-500 hover:bg-red-600">
                <Link href="/xiaohongshu">
                  小红书笔记编辑器
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700">
                <Link href="https://mp.leti.ltd/" target="_blank">
                  <Crown className="mr-2 h-5 w-5" />
                  NeuraPress Pro
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                <Link href="https://github.com/tianyaxiang/neurapress" target="_blank">
                  <Github className="mr-2 h-5 w-5" />
                  查看源码
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              强大的功能特性
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              为内容创作者量身定制的编辑体验，让你的创作更加高效和专业
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Platforms Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              支持多个平台
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              针对不同平台优化的编辑器，满足你的多样化需求
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {platforms.map((platform, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-4 h-4 rounded-full ${platform.color}`}></div>
                    <CardTitle className="text-2xl">{platform.name}</CardTitle>
                  </div>
                  <CardDescription className="text-base">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full group-hover:bg-primary/90 transition-colors">
                    <Link href={platform.href}>
                      立即体验
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            准备开始创作了吗？
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            选择你的平台，开启高效的内容创作之旅
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/wechat">
                微信公众号编辑器
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8" asChild>
              <Link href="/xiaohongshu">
                小红书笔记编辑器
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg px-8 border-2 border-amber-500 text-amber-600 hover:bg-amber-50 hover:text-amber-700" >
              <Link href="https://mp.leti.ltd/" target="_blank">
                <Crown className="mr-2 h-5 w-5" />
                NeuraPress Pro
                <ExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <Logo className="w-8 h-8" />
              <span className="text-xl font-bold">NeuraPress</span>
            </div>
            <div className="flex items-center gap-6">
              <Link
                href="https://github.com/tianyaxiang/neurapress"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-5 w-5" />
              </Link>
              <Link
                href="https://x.com/tianyaxiang"
                target="_blank"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </Link>
              <Link
                href="mailto:tianyaxiang@qq.com"
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-5 w-5" />
              </Link>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © 2024 NeuraPress. All rights reserved. Built with ❤️ using Next.js
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}