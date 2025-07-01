'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/icons/Logo'
import { Github } from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: '微信公众号', href: '/wechat' },
  { name: '小红书', href: '/xiaohongshu' },
  { name: '公众号转Markdown', href: 'https://mp2md.leti.ltd/', target: '_blank' },
  { name: '关于我们', href: '/about' },
  { name: '使用帮助', href: '/help' },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="border-b border-gray-200 bg-background">
      <div className="container mx-auto">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center gap-2 text-xl font-bold text-primary">
                <Logo className="w-8 h-8" />
                <span>NeuraPress</span>
              </Link>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-3 py-2 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-sm text-muted-foreground hidden md:block">
              专业的内容转换工具
            </p>
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              asChild
            >
              <Link
                href="https://github.com/tianyaxiang/neurapress"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
} 