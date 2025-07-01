import { MainNav } from '@/components/nav/MainNav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Link from 'next/link'
import { 
  BookOpen,
  Play,
  Settings,
  Copy,
  Smartphone,
  HelpCircle,
  ArrowRight,
  ExternalLink,
  FileText,
  Eye,
  Palette
} from 'lucide-react'

const quickStart = [
  {
    step: 1,
    title: '选择编辑器',
    description: '根据发布平台选择对应的编辑器',
    details: '微信公众号编辑器适用于微信推文，小红书编辑器适用于小红书笔记'
  },
  {
    step: 2,
    title: '编写内容',
    description: '在左侧编辑区域输入 Markdown 内容',
    details: '支持标准 Markdown 语法，包括标题、列表、链接、图片等'
  },
  {
    step: 3,
    title: '预览效果',
    description: '右侧实时预览最终的排版效果',
    details: '预览区域会根据所选平台显示对应的样式效果'
  },
  {
    step: 4,
    title: '复制发布',
    description: '点击复制按钮获取格式化内容',
    details: '可以直接粘贴到目标平台的编辑器中使用'
  }
]

const features = [
  {
    icon: FileText,
    title: 'Markdown 编辑',
    description: '支持完整的 Markdown 语法',
    tips: [
      '使用 # 创建标题',
      '使用 ** 创建粗体文本',
      '使用 * 创建斜体文本',
      '使用 ``` 创建代码块'
    ]
  },
  {
    icon: Eye,
    title: '实时预览',
    description: '所见即所得的编辑体验',
    tips: [
      '编辑区和预览区同步滚动',
      '支持切换预览模式',
      '可以隐藏/显示预览区域',
      '预览内容与发布效果一致'
    ]
  },
  {
    icon: Palette,
    title: '样式定制',
    description: '丰富的样式配置选项',
    tips: [
      '选择预设的样式模板',
      '自定义字体和颜色',
      '调整段落间距',
      '设置代码高亮主题'
    ]
  },
  {
    icon: Copy,
    title: '一键复制',
    description: '复制带格式的内容',
    tips: [
      '复制 HTML 源码',
      '复制带格式的预览内容',
      '支持直接粘贴到编辑器',
      '保持原有的排版效果'
    ]
  }
]

const faqs = [
  {
    question: '如何在微信公众号中使用复制的内容？',
    answer: '点击"复制预览"按钮后，直接在微信公众号编辑器中粘贴即可。如果格式有问题，可以尝试使用"复制源码"功能。'
  },
  {
    question: '支持哪些 Markdown 语法？',
    answer: '支持标准的 Markdown 语法，包括标题、段落、列表、链接、图片、代码块、表格等。同时支持一些 GFM (GitHub Flavored Markdown) 扩展语法。'
  },
  {
    question: '移动端可以正常使用吗？',
    answer: '是的，NeuraPress 采用响应式设计，完美适配移动设备。在手机上也能获得良好的编辑体验。'
  },
  {
    question: '如何保存编辑的内容？',
    answer: '编辑器会自动保存到本地存储，下次打开时会自动恢复上次的编辑内容。建议重要内容及时备份到其他地方。'
  },
  {
    question: '可以自定义样式吗？',
    answer: '可以的。点击样式设置按钮，可以选择预设模板或自定义字体、颜色、间距等样式参数。'
  },
  {
    question: '图片如何处理？',
    answer: '目前需要先将图片上传到图床获取链接，然后使用 Markdown 图片语法插入。我们正在开发本地图片上传功能。'
  }
]

const shortcuts = [
  { keys: 'Ctrl/Cmd + B', description: '加粗选中文本' },
  { keys: 'Ctrl/Cmd + I', description: '斜体选中文本' },
  { keys: 'Ctrl/Cmd + K', description: '插入链接' },
  { keys: 'Ctrl/Cmd + S', description: '保存内容' },
  { keys: 'Ctrl/Cmd + Z', description: '撤销操作' },
  { keys: 'Ctrl/Cmd + Y', description: '重做操作' }
]

export default function HelpPage() {
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-6">
              使用帮助
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              快速上手 NeuraPress，掌握高效的内容创作技巧
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/wechat">
                  <Play className="mr-2 h-5 w-5" />
                  立即开始
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">
                  了解更多
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue="quickstart" className="space-y-8">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="quickstart">快速开始</TabsTrigger>
                <TabsTrigger value="features">功能详解</TabsTrigger>
                <TabsTrigger value="faq">常见问题</TabsTrigger>
                <TabsTrigger value="shortcuts">快捷键</TabsTrigger>
              </TabsList>
              
              {/* Quick Start */}
              <TabsContent value="quickstart" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    四步开始创作
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    跟随以下步骤，快速掌握 NeuraPress 的使用方法
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {quickStart.map((item, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                            {item.step}
                          </div>
                          <CardTitle className="text-xl">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-base">
                          {item.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">
                          {item.details}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Card className="inline-block border-0 shadow-md bg-primary/5">
                    <CardContent className="p-6">
                      <p className="text-foreground font-medium mb-4">
                        准备好开始了吗？
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild>
                          <Link href="/wechat">
                            微信公众号编辑器
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        <Button variant="outline" asChild>
                          <Link href="/xiaohongshu">
                            小红书笔记编辑器
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Features */}
              <TabsContent value="features" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    功能详解
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    深入了解 NeuraPress 的核心功能和使用技巧
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                            <feature.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-xl">{feature.title}</CardTitle>
                            <CardDescription>{feature.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {feature.tips.map((tip, tipIndex) => (
                            <li key={tipIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                              <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              {/* FAQ */}
              <TabsContent value="faq" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    常见问题
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    这里是用户最常遇到的问题和解决方案
                  </p>
                </div>
                
                <div className="space-y-6">
                  {faqs.map((faq, index) => (
                    <Card key={index} className="border-0 shadow-md">
                      <CardHeader>
                        <div className="flex items-start gap-3">
                          <HelpCircle className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                          <CardTitle className="text-lg leading-relaxed">
                            {faq.question}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="text-center mt-12">
                  <Card className="inline-block border-0 shadow-md bg-primary/5">
                    <CardContent className="p-6">
                      <p className="text-foreground font-medium mb-2">
                        没有找到答案？
                      </p>
                      <p className="text-muted-foreground mb-4">
                        欢迎通过以下方式联系我们获取帮助
                      </p>
                      <Button variant="outline" asChild>
                        <Link href="mailto:tianyaxiang@qq.com">
                          联系我们
                          <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              {/* Shortcuts */}
              <TabsContent value="shortcuts" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    快捷键
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    使用快捷键提升编辑效率
                  </p>
                </div>
                
                <div className="max-w-2xl mx-auto">
                  <Card className="border-0 shadow-md">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {shortcuts.map((shortcut, index) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <span className="text-muted-foreground">
                              {shortcut.description}
                            </span>
                            <div className="flex items-center gap-1">
                              {shortcut.keys.split(' + ').map((key, keyIndex) => (
                                <span key={keyIndex}>
                                  <kbd className="px-2 py-1 text-xs font-semibold text-foreground bg-muted border border-border rounded">
                                    {key}
                                  </kbd>
                                  {keyIndex < shortcut.keys.split(' + ').length - 1 && (
                                    <span className="mx-1 text-muted-foreground">+</span>
                                  )}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="text-center mt-12">
                  <Card className="inline-block border-0 shadow-md bg-primary/5">
                    <CardContent className="p-6">
                      <Smartphone className="w-8 h-8 text-primary mx-auto mb-3" />
                      <p className="text-foreground font-medium mb-2">
                        移动端提示
                      </p>
                      <p className="text-muted-foreground text-sm">
                        在移动设备上，可以使用工具栏按钮快速插入常用格式
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </div>
  )
} 