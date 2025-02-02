import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { HelpCircle } from 'lucide-react'

const cheatSheet = [
  {
    title: '标题',
    items: [
      { label: '大标题', syntax: '# 标题文本' },
      { label: '二级标题', syntax: '## 标题文本' },
      { label: '三级标题', syntax: '### 标题文本' },
    ]
  },
  {
    title: '强调',
    items: [
      { label: '粗体', syntax: '**粗体文本**' },
      { label: '斜体', syntax: '*斜体文本*' },
      { label: '删除线', syntax: '~~删除文本~~' },
    ]
  },
  {
    title: '列表',
    items: [
      { label: '无序列表', syntax: '- 列表项\n- 列表项\n- 列表项' },
      { label: '有序列表', syntax: '1. 列表项\n2. 列表项\n3. 列表项' },
      { label: '任务列表', syntax: '- [ ] 待办事项\n- [x] 已完成' },
    ]
  },
  {
    title: '引用和代码',
    items: [
      { label: '引用', syntax: '> 引用文本' },
      { label: '行内代码', syntax: '`代码`' },
      { label: '代码块', syntax: '```语言\n代码块\n```' },
    ]
  },
  {
    title: '链接和图片',
    items: [
      { label: '链接', syntax: '[链接文本](URL)' },
      { label: '图片', syntax: '![替代文本](图片URL)' },
    ]
  },
  {
    title: '表格',
    items: [
      {
        label: '基本表格',
        syntax: '| 表头 | 表头 |\n| --- | --- |\n| 单元格 | 单元格 |'
      },
    ]
  },
  {
    title: '数学公式',
    items: [
      { label: '行内公式', syntax: '$E = mc^2$' },
      { label: '行间公式', syntax: '$$\\frac{n!}{k!(n-k)!} = \\binom{n}{k}$$' },
      { label: '带反引号的行间公式', syntax: '$$`\\sum_{i=1}^n a_i = \\int_0^{\\pi} \\sin(x) dx`$$' },
    ]
  },
  {
    title: '其他',
    items: [
      { label: '水平分割线', syntax: '---' },
      { label: '注脚', syntax: '这里是文字[^1]\n\n[^1]: 这里是注脚' },
    ]
  },
]

export function MarkdownCheatSheet() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <HelpCircle className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Markdown 语法指南</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {cheatSheet.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="font-medium text-lg">{section.title}</h3>
              <div className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="space-y-1">
                    <div className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </div>
                    <pre className="p-2 rounded-md bg-muted text-sm font-mono">
                      {item.syntax}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 