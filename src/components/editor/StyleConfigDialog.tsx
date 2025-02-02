'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Settings } from 'lucide-react'
import { type RendererOptions } from '@/lib/markdown'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const themeColors = [
  { name: '经典黑', value: '#1a1a1a' },
  { name: '深蓝', value: '#1e40af' },
  { name: '墨绿', value: '#065f46' },
  { name: '深紫', value: '#5b21b6' },
  { name: '酒红', value: '#991b1b' },
  { name: '海蓝', value: '#0369a1' },
  { name: '森绿', value: '#166534' },
  { name: '靛蓝', value: '#1e3a8a' },
  { name: '玫红', value: '#9d174d' },
  { name: '橙色', value: '#c2410c' },
  { name: '棕褐', value: '#713f12' },
  { name: '石墨', value: '#374151' },
]

interface StyleConfigDialogProps {
  value: RendererOptions
  onChangeAction: (options: RendererOptions) => void
}

export function StyleConfigDialog({ value, onChangeAction }: StyleConfigDialogProps) {
  const [currentOptions, setCurrentOptions] = useState<RendererOptions>(value)
  const [customizedFields, setCustomizedFields] = useState<Set<string>>(new Set())

  useEffect(() => {
    setCurrentOptions(value)
    setCustomizedFields(new Set())
  }, [value])

  const handleOptionChange = (
    category: keyof RendererOptions,
    subcategory: string,
    value: string | null
  ) => {
    setCustomizedFields(prev => {
      const next = new Set(prev)
      if (value === null) {
        next.delete(`${category}.${subcategory}`)
      } else {
        next.add(`${category}.${subcategory}`)
      }
      return next
    })

    const newOptions = {
      ...currentOptions,
      [category]: {
        ...(currentOptions[category] as object || {}),
        [subcategory]: value === null ? undefined : value
      }
    }

    // 如果是主题颜色变更，同时更新标题颜色
    if (category === 'base' && subcategory === 'themeColor') {
      if (value === null) {
        // 重置为模板默认值
        newOptions.block = {
          ...newOptions.block,
          h1: { ...(newOptions.block?.h1 || {}), color: undefined },
          h2: { ...(newOptions.block?.h2 || {}), color: undefined },
          h3: { ...(newOptions.block?.h3 || {}), color: undefined }
        }
      } else {
        newOptions.block = {
          ...newOptions.block,
          h1: { ...(newOptions.block?.h1 || {}), color: value },
          h2: { ...(newOptions.block?.h2 || {}), color: value },
          h3: { ...(newOptions.block?.h3 || {}), color: value }
        }
      }
    }

    setCurrentOptions(newOptions)
    onChangeAction(newOptions)
  }

  const resetToDefault = (field: string) => {
    const [category, subcategory] = field.split('.')
    handleOptionChange(category as keyof RendererOptions, subcategory, null)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          样式设置
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>样式配置</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>主题颜色（标题）</Label>
                {customizedFields.has('base.themeColor') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => resetToDefault('base.themeColor')}
                  >
                    重置
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2 mb-2">
                {themeColors.map((color) => (
                  <button
                    key={color.value}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      currentOptions.base?.themeColor === color.value
                        ? 'border-primary scale-110'
                        : 'border-transparent hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => handleOptionChange('base', 'themeColor', color.value)}
                    title={color.name}
                  />
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  type="color"
                  value={currentOptions.base?.themeColor || '#1a1a1a'}
                  className="w-16 h-8 p-1"
                  onChange={(e) => handleOptionChange('base', 'themeColor', e.target.value)}
                />
                <Input
                  value={currentOptions.base?.themeColor || '#1a1a1a'}
                  onChange={(e) => handleOptionChange('base', 'themeColor', e.target.value)}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                此颜色将应用于一级到三级标题
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>字体大小</Label>
                {customizedFields.has('base.fontSize') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => resetToDefault('base.fontSize')}
                  >
                    重置
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="12"
                  max="24"
                  value={parseInt(currentOptions.base?.fontSize || '15')}
                  className="w-24"
                  onChange={(e) => handleOptionChange('base', 'fontSize', `${e.target.value}px`)}
                />
                <span className="flex items-center">px</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>文本对齐</Label>
                {customizedFields.has('base.textAlign') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => resetToDefault('base.textAlign')}
                  >
                    重置
                  </Button>
                )}
              </div>
              <Select 
                value={currentOptions.base?.textAlign || 'left'}
                onValueChange={(value: string) => handleOptionChange('base', 'textAlign', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="left">左对齐</SelectItem>
                  <SelectItem value="center">居中对齐</SelectItem>
                  <SelectItem value="right">右对齐</SelectItem>
                  <SelectItem value="justify">两端对齐</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>行高</Label>
                {customizedFields.has('base.lineHeight') && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => resetToDefault('base.lineHeight')}
                  >
                    重置
                  </Button>
                )}
              </div>
              <Input
                type="number"
                min="1"
                max="3"
                step="0.1"
                value={parseFloat(String(currentOptions.base?.lineHeight || '1.75'))}
                onChange={(e) => handleOptionChange('base', 'lineHeight', e.target.value)}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 