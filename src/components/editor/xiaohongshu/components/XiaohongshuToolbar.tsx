'use client'

import { Save, Copy, Palette, Image as ImageIcon, Settings, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Logo } from '@/components/icons/Logo'
import Link from 'next/link'
import { 
  xiaohongshuTemplates, 
  pageModes,
  pageNumberOptions,
  pageSizeOptions,
  type XiaohongshuTemplateId, 
  type PageMode,
  type PageNumberPosition,
  type PageSizeOption 
} from '../constants'

interface XiaohongshuToolbarProps {
  selectedTemplate: XiaohongshuTemplateId
  isDraft: boolean
  isGeneratingImage: boolean
  pageMode: PageMode
  pageNumberPosition: PageNumberPosition
  pageSize: PageSizeOption
  totalPages: number
  onTemplateChange: (template: XiaohongshuTemplateId) => void
  onSave: () => void
  onCopyMarkdown: () => void
  onCopyHTML: () => void
  onGenerateImage: () => void
  onPageModeChange: (mode: PageMode) => void
  onPageNumberPositionChange: (position: PageNumberPosition) => void
  onPageSizeChange: (size: PageSizeOption) => void
}

export function XiaohongshuToolbar({
  selectedTemplate,
  isDraft,
  isGeneratingImage,
  pageMode,
  pageNumberPosition,
  pageSize,
  totalPages,
  onTemplateChange,
  onSave,
  onCopyMarkdown,
  onCopyHTML,
  onGenerateImage,
  onPageModeChange,
  onPageNumberPositionChange,
  onPageSizeChange,
}: XiaohongshuToolbarProps) {
  return (
    <div className="flex-none border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-20">
      <div className="px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold text-primary flex items-center gap-2">
              <Logo className="w-6 h-6" />
              小红书编辑器
            </Link>
            
            <div className="flex items-center gap-3">
              <Palette className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedTemplate} onValueChange={onTemplateChange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(xiaohongshuTemplates).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 分页设置对话框 */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-1" />
                  分页设置
                  {pageMode === 'multiple' && (
                    <span className="ml-1 text-xs text-muted-foreground">
                      ({totalPages}页)
                    </span>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    分页设置
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  {/* 分页模式 */}
                  <div className="space-y-3">
                    <Label htmlFor="page-mode">分页模式</Label>
                    <Select value={pageMode} onValueChange={onPageModeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(pageModes).map(([key, mode]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{mode.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {mode.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 页码显示 */}
                  <div className="space-y-3">
                    <Label htmlFor="page-number">页码显示</Label>
                    <Select value={pageNumberPosition} onValueChange={onPageNumberPositionChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(pageNumberOptions).map(([key, option]) => (
                          <SelectItem key={key} value={key}>
                            {option.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 分页大小设置 */}
                  <div className="space-y-3">
                    <Label htmlFor="page-size">分页大小</Label>
                    <Select value={pageSize} onValueChange={onPageSizeChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(pageSizeOptions).map(([key, option]) => (
                          <SelectItem key={key} value={key}>
                            <div>
                              <div className="font-medium">{option.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {option.description}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 当前状态信息 */}
                  <div className="pt-4 border-t space-y-2 text-sm text-muted-foreground">
                    <div className="flex justify-between">
                      <span>当前模式：</span>
                      <span className="font-medium">{pageModes[pageMode].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>总页数：</span>
                      <span className="font-medium">{totalPages} 页</span>
                    </div>
                    <div className="flex justify-between">
                      <span>页码位置：</span>
                      <span className="font-medium">{pageNumberOptions[pageNumberPosition].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>分页大小：</span>
                      <span className="font-medium">{pageSizeOptions[pageSize].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>每页字符数：</span>
                      <span className="font-medium">{pageSizeOptions[pageSize].maxLength}</span>
                    </div>
                    {pageMode === 'multiple' && totalPages > 1 && (
                      <div className="flex justify-between">
                        <span>高度优化：</span>
                        <span className="font-medium text-green-600">已启用</span>
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {isDraft ? '未保存' : '已保存'}
            </span>
            <Button
              variant={isDraft ? "default" : "outline"}
              size="sm"
              onClick={onSave}
            >
              <Save className="h-4 w-4 mr-1" />
              保存
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyMarkdown}
            >
              <Copy className="h-4 w-4 mr-1" />
              复制MD
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyHTML}
            >
              <Copy className="h-4 w-4 mr-1" />
              复制HTML
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={onGenerateImage}
              disabled={isGeneratingImage}
              title="推荐上传3:4至2:1比例、分辨率不低于720*960的照片"
            >
              {isGeneratingImage ? (
                <div className="h-4 w-4 mr-1 animate-spin rounded-full border-2 border-b-transparent" />
              ) : (
                <ImageIcon className="h-4 w-4 mr-1" />
              )}
              {pageMode === 'multiple' && totalPages > 1 
                ? `生成${totalPages}张图片` 
                : '生成图片'
              }
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 