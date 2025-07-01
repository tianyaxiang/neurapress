import { MainNav } from '@/components/nav/MainNav'
import { Logo } from '@/components/icons/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { 
  Heart,
  Target,
  Users,
  Lightbulb,
  Github,
  Twitter,
  Mail,
  ExternalLink
} from 'lucide-react'

const values = [
  {
    icon: Lightbulb,
    title: '创新驱动',
    description: '持续探索新技术，为用户提供最佳的创作体验'
  },
  {
    icon: Users,
    title: '用户至上',
    description: '倾听用户需求，打造真正有价值的产品功能'
  },
  {
    icon: Heart,
    title: '开源精神',
    description: '相信开源的力量，与社区共同成长和进步'
  },
  {
    icon: Target,
    title: '专业品质',
    description: '追求极致的产品品质和用户体验'
  }
]

const features = [
  '🎨 现代化的用户界面设计',
  '📱 完美的移动端适配',
  '⚡ 基于 Next.js 的高性能架构',
  '🔧 灵活的样式定制选项',
  '📝 支持标准 Markdown 语法',
  '🚀 实时预览和同步滚动',
  '📋 一键复制功能',
  '🎭 多种排版模板'
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <Logo className="w-16 h-16 text-primary" />
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              关于 NeuraPress
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              NeuraPress 诞生于对高效内容创作的渴望。我们致力于为内容创作者提供最优质的 Markdown 编辑体验，
              让创作变得更加简单、高效和愉悦。
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
                我们的使命
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  让内容创作更简单
                </h3>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  在信息爆炸的时代，内容创作者需要的不仅仅是一个编辑器，而是一个能够理解他们需求、
                  提升效率的创作伙伴。NeuraPress 正是为此而生。
                </p>
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  我们深知每个平台都有其独特的排版需求，因此专门为微信公众号、小红书等平台优化了编辑体验，
                  让创作者能够专注于内容本身，而非格式调整。
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/wechat">
                      立即体验
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="https://github.com/tianyaxiang/neurapress" target="_blank">
                      <Github className="mr-2 h-4 w-4" />
                      查看源码
                    </Link>
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
              我们的价值观
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              这些核心价值观指导着我们的产品开发和团队文化
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center border-0 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              技术栈
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              我们使用现代化的技术栈构建 NeuraPress，确保产品的性能、稳定性和可维护性
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">Next</span>
                </div>
                <p className="font-medium">Next.js 14</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-cyan-600">React</span>
                </div>
                <p className="font-medium">React 18</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-blue-600">TS</span>
                </div>
                <p className="font-medium">TypeScript</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-slate-600">TW</span>
                </div>
                <p className="font-medium">Tailwind CSS</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6">
              联系我们
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              有任何问题、建议或合作意向，欢迎随时联系我们
            </p>
            
            <div className="flex justify-center gap-6 mb-8">
              <Link 
                href="https://github.com/tianyaxiang/neurapress" 
                target="_blank"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="h-6 w-6" />
                <span>GitHub</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              
              <Link 
                href="https://x.com/tianyaxiang" 
                target="_blank"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Twitter className="h-6 w-6" />
                <span>Twitter</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
              
              <Link 
                href="mailto:tianyaxiang@qq.com"
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-6 w-6" />
                <span>Email</span>
              </Link>
            </div>
            
            <Card className="border-0 shadow-md bg-primary/5">
              <CardContent className="p-6">
                <p className="text-foreground font-medium mb-2">
                  开源项目，欢迎贡献
                </p>
                <p className="text-muted-foreground">
                  NeuraPress 是一个开源项目，我们欢迎任何形式的贡献，包括代码、文档、设计建议等。
                  让我们一起打造更好的内容创作工具！
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
} 