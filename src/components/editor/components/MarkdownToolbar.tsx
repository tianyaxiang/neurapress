import React from 'react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { Separator } from '@/components/ui/separator'
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Table,
  Heading1,
  Heading2,
  Heading3,
  Minus,
  CheckSquare
} from 'lucide-react'
import { MarkdownCheatSheet } from './MarkdownCheatSheet'

interface MarkdownToolbarProps {
  onInsert: (text: string, options?: { wrap?: boolean; placeholder?: string; suffix?: string }) => void
}

type ToolButton = {
  icon: React.ReactNode
  title: string
  text: string
  wrap?: boolean
  placeholder?: string
  suffix?: string
}

type Tool = ToolButton | { type: 'separator' }

export function MarkdownToolbar({ onInsert }: MarkdownToolbarProps) {
  const tools: Tool[] = [
    {
      icon: <Heading1 className="h-4 w-4" />,
      title: '标题 1',
      text: '# ',
      placeholder: '标题'
    },
    {
      icon: <Heading2 className="h-4 w-4" />,
      title: '标题 2',
      text: '## ',
      placeholder: '标题'
    },
    {
      icon: <Heading3 className="h-4 w-4" />,
      title: '标题 3',
      text: '### ',
      placeholder: '标题'
    },
    { type: 'separator' },
    {
      icon: <Bold className="h-4 w-4" />,
      title: '粗体',
      text: '**',
      wrap: true,
      placeholder: '粗体文本'
    },
    {
      icon: <Italic className="h-4 w-4" />,
      title: '斜体',
      text: '*',
      wrap: true,
      placeholder: '斜体文本'
    },
    { type: 'separator' },
    {
      icon: <List className="h-4 w-4" />,
      title: '无序列表',
      text: '- ',
      placeholder: '列表项'
    },
    {
      icon: <ListOrdered className="h-4 w-4" />,
      title: '有序列表',
      text: '1. ',
      placeholder: '列表项'
    },
    {
      icon: <CheckSquare className="h-4 w-4" />,
      title: '任务列表',
      text: '- [ ] ',
      placeholder: '任务'
    },
    { type: 'separator' },
    {
      icon: <Quote className="h-4 w-4" />,
      title: '引用',
      text: '> ',
      placeholder: '引用文本'
    },
    {
      icon: <Code className="h-4 w-4" />,
      title: '代码块',
      text: '```\n',
      wrap: true,
      suffix: '\n```',
      placeholder: '在此输入代码'
    },
    { type: 'separator' },
    {
      icon: <Link className="h-4 w-4" />,
      title: '链接',
      text: '[',
      wrap: true,
      suffix: '](url)',
      placeholder: '链接文本'
    },
    {
      icon: <Image className="h-4 w-4" />,
      title: '图片',
      text: '![',
      wrap: true,
      suffix: '](url)',
      placeholder: '图片描述'
    },
    { type: 'separator' },
    {
      icon: <Table className="h-4 w-4" />,
      title: '表格',
      text: '| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |',
      placeholder: ''
    },
    {
      icon: <Minus className="h-4 w-4" />,
      title: '分割线',
      text: '\n---\n',
      placeholder: ''
    }
  ]

  return (
    <TooltipProvider>
      <div className="flex items-center gap-0.5 px-2 py-1 border-b">
        {tools.map((tool, index) => {
          if ('type' in tool && tool.type === 'separator') {
            return <Separator key={index} orientation="vertical" className="mx-0.5 h-4" />
          }

          const buttonTool = tool as ToolButton
          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={(e) => {
                    e.preventDefault()
                    onInsert(buttonTool.text, {
                      wrap: buttonTool.wrap,
                      placeholder: buttonTool.placeholder,
                      suffix: buttonTool.suffix
                    })
                  }}
                >
                  {buttonTool.icon}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>{buttonTool.title}</p>
              </TooltipContent>
            </Tooltip>
          )
        })}
        <Separator orientation="vertical" className="mx-1 h-6" />
        <Tooltip>
          <TooltipTrigger asChild>
            <MarkdownCheatSheet />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Markdown 语法帮助</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  )
} 