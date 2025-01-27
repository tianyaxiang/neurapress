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
      fontSize: {
        h1: '24px',
        h2: '20px',
        h3: '18px',
        paragraph: '15px',
        code: '14px'
      },
      colors: {
        text: '#333333',
        heading: '#1a1a1a',
        link: '#576b95',
        code: '#333333',
        quote: '#666666'
      },
      spacing: {
        paragraph: '20px',
        heading: '30px',
        list: '20px',
        quote: '20px'
      }
    }
  },
  modern: {
    name: '现代简约',
    options: {
      fontSize: {
        h1: '28px',
        h2: '24px',
        h3: '20px',
        paragraph: '16px',
        code: '15px'
      },
      colors: {
        text: '#2d3748',
        heading: '#1a202c',
        link: '#4299e1',
        code: '#2d3748',
        quote: '#718096'
      },
      spacing: {
        paragraph: '24px',
        heading: '36px',
        list: '24px',
        quote: '24px'
      }
    }
  }
}

interface StyleConfigDialogProps {
  value: RendererOptions
  onChange: (options: RendererOptions) => void
}

export function StyleConfigDialog({ value, onChange }: StyleConfigDialogProps) {
  const [currentOptions, setCurrentOptions] = useState<RendererOptions>(value)

  const handlePresetChange = (preset: keyof typeof stylePresets) => {
    const newOptions = stylePresets[preset].options
    setCurrentOptions(newOptions)
    onChange(newOptions)
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
    onChange(newOptions)
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
            <TabsTrigger value="font">字体</TabsTrigger>
            <TabsTrigger value="colors">颜色</TabsTrigger>
            <TabsTrigger value="spacing">间距</TabsTrigger>
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
                    <p style={{ fontSize: preset.options.fontSize.paragraph, color: preset.options.colors.text }}>
                      正文示例
                    </p>
                    <h2 style={{ fontSize: preset.options.fontSize.h2, color: preset.options.colors.heading }}>
                      标题示例
                    </h2>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="font" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentOptions.fontSize || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleOptionChange('fontSize', key, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentOptions.colors || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <div className="flex gap-2">
                    <Input
                      value={value}
                      onChange={(e) => handleOptionChange('colors', key, e.target.value)}
                    />
                    <Input
                      type="color"
                      value={value}
                      className="w-12"
                      onChange={(e) => handleOptionChange('colors', key, e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="spacing" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(currentOptions.spacing || {}).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={value}
                    onChange={(e) => handleOptionChange('spacing', key, e.target.value)}
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