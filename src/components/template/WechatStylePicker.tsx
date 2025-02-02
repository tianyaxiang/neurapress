'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { templates } from '@/config/wechat-templates'
import { Button } from "@/components/ui/button"

interface WechatStylePickerProps {
  value?: string
  onSelect: (value: string) => void
}

export function WechatStylePicker({ value, onSelect }: WechatStylePickerProps) {
  const [open, setOpen] = React.useState(false)
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          {value ? templates.find(t => t.id === value)?.name : '选择样式...'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>选择样式模板</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-4">
          {templates.map((template) => (
            <div
              key={template.id}
              className={cn(
                "template-preview-card relative flex flex-col gap-4 rounded-lg border bg-card p-4 cursor-pointer",
                value === template.id && "border-primary"
              )}
              onClick={() => {
                onSelect(template.id)
                setOpen(false)
              }}
            >
              <div className="aspect-[4/3] overflow-hidden rounded-md border bg-white">
                <div className={cn(
                  "transform scale-[0.45] origin-top-left",
                  template.styles
                )} style={{
                  backgroundColor: template.id === 'smartisan' ? 'rgb(251, 247, 238)' : 'transparent',
                  width: '220%',
                  minHeight: '220%',
                  padding: template.id === 'smartisan' ? '20px' : '16px',
                  fontFamily: template.id === 'smartisan' ? 'PingFangSC-regular, -apple-system, BlinkMacSystemFont, sans-serif' : 'inherit',
                  transform: 'scale(0.45)',
                  transformOrigin: 'top left',
                  position: 'relative'
                }}>
                  <h1 style={{
                    ...template.options?.block?.h1,
                    fontSize: '24px',
                    color: template.id === 'smartisan' ? '#333333' : undefined,
                    marginBottom: template.id === 'smartisan' ? '1.5em' : undefined,
                    textAlign: 'left',
                    padding: '0',
                    border: 'none'
                  } as React.CSSProperties}>
                    {template.id === 'smartisan' ? '锤子便签风格' : '标题示例'}
                  </h1>
                  <p style={{
                    ...template.options?.block?.p,
                    fontSize: '16px',
                    color: template.id === 'smartisan' ? '#333333' : undefined,
                    lineHeight: template.id === 'smartisan' ? '1.8' : undefined,
                    margin: '1em 0'
                  } as React.CSSProperties}>
                    {template.id === 'smartisan' 
                      ? '这是锤子便签的经典样式，保持了简约、优雅的设计风格。文字的排版和间距都经过精心调整，让阅读体验更加舒适。'
                      : '这是一段示例文本，展示不同样式模板的效果。'
                    }
                  </p>
                  <blockquote style={{
                    ...template.options?.block?.blockquote as React.CSSProperties,
                    borderLeft: template.id === 'smartisan' ? '4px solid rgba(0, 0, 0, 0.4)' : undefined,
                    background: template.id === 'smartisan' ? 'rgba(0, 0, 0, 0.05)' : undefined,
                    padding: template.id === 'smartisan' ? '1em 1.2em' : undefined,
                    margin: template.id === 'smartisan' ? '1.2em 0' : undefined,
                    color: template.id === 'smartisan' ? '#666666' : undefined,
                    fontSize: '14px'
                  }}>
                    {template.id === 'smartisan' 
                      ? '保持简单，保持优雅'
                      : '引用文本示例'
                    }
                  </blockquote>
                  {template.id === 'smartisan' && (
                    <ul style={{
                      ...template.options?.block?.ul as React.CSSProperties,
                      margin: '1em 0',
                      paddingLeft: '1.5em',
                      listStyle: 'disc',
                      color: '#333333',
                      fontSize: '14px'
                    }}>
                      <li style={{
                        ...template.options?.inline?.listitem as React.CSSProperties,
                        margin: '0.5em 0',
                        lineHeight: '1.8'
                      }}>精心设计的字体</li>
                      <li style={{
                        ...template.options?.inline?.listitem as React.CSSProperties,
                        margin: '0.5em 0',
                        lineHeight: '1.8'
                      }}>舒适的行间距</li>
                    </ul>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-muted-foreground">{template.description}</p>
              </div>
              {value === template.id && (
                <div className="absolute top-2 right-2">
                  <Check className="h-4 w-4 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
} 