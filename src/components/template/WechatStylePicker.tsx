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
                  "p-4 transform scale-[0.6] origin-top-left",
                  template.styles
                )}>
                  <h1 style={{
                    ...template.options?.block?.h1,
                    fontSize: template.options?.block?.h1?.fontSize || '1.2em'
                  } as React.CSSProperties}>
                    标题示例
                  </h1>
                  <p style={{
                    ...template.options?.block?.p,
                    fontSize: template.options?.block?.p?.fontSize || '1em'
                  } as React.CSSProperties}>
                    这是一段示例文本，展示不同样式模板的效果。
                  </p>
                  <blockquote style={template.options?.block?.blockquote as React.CSSProperties}>
                    引用文本示例
                  </blockquote>
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