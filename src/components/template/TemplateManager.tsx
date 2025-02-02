'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Settings2, Download, Upload, Star, Plus } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { templates as defaultTemplates, type Template } from '@/config/wechat-templates'
import { useLocalStorage } from '@/hooks/use-local-storage'
import { cn } from '@/lib/utils'

interface TemplateManagerProps {
  onTemplateChange: () => void
}

interface StyleConfig {
  base: {
    '--md-primary-color': string
    'text-align': string
    'line-height': string
  }
  block: {
    container?: React.CSSProperties
    h1?: React.CSSProperties
    h2?: React.CSSProperties
    h3?: React.CSSProperties
    h4?: React.CSSProperties
    h5?: React.CSSProperties
    h6?: React.CSSProperties
    p?: React.CSSProperties
    blockquote?: React.CSSProperties
    blockquote_p?: React.CSSProperties
    code_pre?: React.CSSProperties
    code?: React.CSSProperties
    image?: React.CSSProperties
    ol?: React.CSSProperties
    ul?: React.CSSProperties
    footnotes?: React.CSSProperties
    figure?: React.CSSProperties
    hr?: React.CSSProperties
  }
  inline: {
    listitem?: React.CSSProperties
    codespan?: React.CSSProperties
    em?: React.CSSProperties
    link?: React.CSSProperties
    wx_link?: React.CSSProperties
    strong?: React.CSSProperties
    table?: React.CSSProperties
    thead?: React.CSSProperties
    td?: React.CSSProperties
    footnote?: React.CSSProperties
    figcaption?: React.CSSProperties
  }
}

export function TemplateManager({ onTemplateChange }: TemplateManagerProps) {
  const [customTemplates, setCustomTemplates] = useLocalStorage<Template[]>('custom-templates', [])
  const [favoriteIds, setFavoriteIds] = useLocalStorage<string[]>('favorite-templates', [])
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({})

  const allTemplates = [...defaultTemplates, ...customTemplates]

  const handleAddTemplate = () => {
    if (!newTemplate.id || !newTemplate.name) return
    
    const template: Template = {
      id: newTemplate.id,
      name: newTemplate.name,
      description: newTemplate.description || '',
      styles: newTemplate.styles || '',
      options: {
        base: {
          themeColor: '#000000',
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
      },
      transform: (html) => html
    }

    setCustomTemplates([...customTemplates, template])
    setNewTemplate({})
    onTemplateChange()
  }

  const handleExportTemplates = () => {
    const exportData = customTemplates.map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      styles: template.styles,
      options: template.options
    }))

    const data = JSON.stringify(exportData, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'wechat-templates.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importData = JSON.parse(e.target?.result as string)
        const templates = importData.map((data: any) => ({
          id: data.id,
          name: data.name,
          description: data.description,
          styles: data.styles,
          options: data.options,
          transform: (html: string) => {
            return `
              <section>
                <style>
                  :root { --md-primary-color: ${data.options.base.themeColor}; }
                </style>
                ${html}
              </section>
            `
          }
        }))

        setCustomTemplates(prev => [...prev, ...templates])
        onTemplateChange()
      } catch (error) {
        console.error('导入失败:', error)
      }
    }
    reader.readAsText(file)
  }

  const toggleFavorite = (templateId: string) => {
    setFavoriteIds(prev => 
      prev.includes(templateId)
        ? prev.filter(id => id !== templateId)
        : [...prev, templateId]
    )
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          模板管理
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>模板管理</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">所有模板</TabsTrigger>
            <TabsTrigger value="favorites">收藏模板</TabsTrigger>
            <TabsTrigger value="custom">自定义模板</TabsTrigger>
            <TabsTrigger value="add">添加模板</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allTemplates.map((template) => (
                <div key={template.id} className="relative border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleFavorite(template.id)}
                    >
                      <Star
                        className={cn(
                          "h-4 w-4",
                          favoriteIds.includes(template.id)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-400"
                        )}
                      />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {allTemplates
                .filter(template => favoriteIds.includes(template.id))
                .map((template) => (
                  <div key={template.id} className="relative border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{template.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleFavorite(template.id)}
                      >
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="custom" className="space-y-4">
            <div className="flex justify-between mb-4">
              <div className="space-x-2">
                <Button onClick={handleExportTemplates}>
                  <Download className="h-4 w-4 mr-2" />
                  导出模板
                </Button>
                <Button variant="outline" onClick={() => document.getElementById('import-file')?.click()}>
                  <Upload className="h-4 w-4 mr-2" />
                  导入模板
                </Button>
                <input
                  id="import-file"
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleImportTemplates}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {customTemplates.map((template) => (
                <div key={template.id} className="relative border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{template.name}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setCustomTemplates(prev => prev.filter(t => t.id !== template.id))
                        onTemplateChange()
                      }}
                    >
                      删除
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">{template.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="add" className="space-y-4">
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>模板ID</Label>
                  <Input
                    value={newTemplate.id || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>模板名称</Label>
                  <Input
                    value={newTemplate.name || ''}
                    onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>描述</Label>
                <Textarea
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>样式类名</Label>
                <Input
                  value={newTemplate.styles || ''}
                  onChange={(e) => setNewTemplate({ ...newTemplate, styles: e.target.value })}
                />
              </div>
              <Button onClick={handleAddTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                添加模板
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
} 