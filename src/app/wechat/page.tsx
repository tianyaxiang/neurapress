import WechatEditor from '@/components/editor/WechatEditor'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from '@/components/theme/ThemeToggle'

export default function WechatPage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center px-4">
          <div className="flex items-center flex-1 gap-2">
            <div className="md:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="mr-2">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:w-[280px] p-0">
                  <nav className="flex flex-col">
                    <a
                      href="/wechat"
                      className="flex h-12 items-center border-b px-4 text-sm font-medium text-foreground"
                    >
                      微信编辑器
                    </a>
                    <a
                      href="/xiaohongshu"
                      className="flex h-12 items-center border-b px-4 text-sm font-medium text-foreground/60 hover:text-foreground/80"
                    >
                      小红书编辑器
                    </a>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
            <a className="flex items-center space-x-2" href="/">
              <span className="font-bold inline-block">
                NeuraPress
              </span>
            </a>
          </div>
          <nav className="flex items-center space-x-6">
            <div className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a
                href="/wechat"
                className="transition-colors hover:text-foreground/80 text-foreground"
              >
                微信编辑器
              </a>
              <a
                href="/xiaohongshu"
                className="text-foreground/60 transition-colors hover:text-foreground/80"
              >
                小红书编辑器
              </a>
            </div>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <div className="relative h-[calc(100vh-3.5rem)]">
        <WechatEditor />
      </div>
    </main>
  )
} 