'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { type RendererOptions } from '@/lib/markdown'

const stylePresets = {
  default: {
    name: '默认样式',
    options: {
      base: {
        primaryColor: '#333333',
        textAlign: 'left',
        lineHeight: '1.75'
      },
      block: {
        h1: { fontSize: '24px', color: '#1a1a1a' },
        h2: { fontSize: '20px', color: '#1a1a1a' },
        h3: { fontSize: '18px', color: '#1a1a1a' },
        p: { fontSize: '15px', color: '#333333' },
        code_pre: { fontSize: '14px', color: '#333333' }
      },
      inline: {
        link: { color: '#576b95' },
        codespan: { color: '#333333' },
        em: { color: '#666666' }
      }
    }
  },
  modern: {
    name: '现代简约',
    options: {
      base: {
        primaryColor: '#2d3748',
        textAlign: 'left',
        lineHeight: '1.8'
      },
      block: {
        h1: { fontSize: '28px', color: '#1a202c' },
        h2: { fontSize: '24px', color: '#1a202c' },
        h3: { fontSize: '20px', color: '#1a202c' },
        p: { fontSize: '16px', color: '#2d3748' },
        code_pre: { fontSize: '15px', color: '#2d3748' }
      },
      inline: {
        link: { color: '#4299e1' },
        codespan: { color: '#2d3748' },
        em: { color: '#718096' }
      }
    }
  }
}

interface StyleConfigDialogProps {
  value: RendererOptions
  onChangeAction: (options: RendererOptions) => void
}

export function StyleConfigDialog({ value, onChangeAction }: StyleConfigDialogProps) {
  const [currentOptions, setCurrentOptions] = useState<RendererOptions>(value)

  const handlePresetChange = (preset: keyof typeof stylePresets) => {
    const newOptions = stylePresets[preset].options
    setCurrentOptions(newOptions)
    onChangeAction(newOptions)
  }

  const handleOptionChange = (
    category: keyof RendererOptions,
    subcategory: string,
    value: string
  ) => {
    const newOptions = {
      ...currentOptions,
      [category]: {
        ...currentOptions[category],
        [subcategory]: value
      }
    }
    setCurrentOptions(newOptions)
    onChangeAction(newOptions)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          样式设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>样式配置</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="presets" className="w-full">
          <TabsList>
            <TabsTrigger value="presets">预设样式</TabsTrigger>
            <TabsTrigger value="base">基础</TabsTrigger>
            <TabsTrigger value="block">块级元素</TabsTrigger>
            <TabsTrigger value="inline">行内元素</TabsTrigger>
          </TabsList>

          <TabsContent value="presets" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(stylePresets).map(([key, preset]) => (
                <div
                  key={key}
                  className="p-4 border rounded-lg cursor-pointer hover:border-primary"
                  onClick={() => handlePresetChange(key as keyof typeof stylePresets)}
                >
                  <h3 className="font-medium mb-2">{preset.name}</h3>
                  <div className="space-y-2">
                    <p style={{ fontSize: preset.options.block?.p?.fontSize, color: preset.options.block?.p?.color }}>
                      正文示例
                    </p>
                    <h2 style={{ fontSize: preset.options.block?.h2?.fontSize, color: preset.options.block?.h2?.color }}>
                      标题示例
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="base" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentOptions.base && Object.entries(currentOptions.base).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleOptionChange('base', key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="block" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentOptions.block && Object.entries(currentOptions.block).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={JSON.stringify(value)}
                    onChange={(e) => handleOptionChange('block', key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inline" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {currentOptions.inline && Object.entries(currentOptions.inline).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={JSON.stringify(value)}
                    onChange={(e) => handleOptionChange('inline', key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 