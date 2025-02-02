'use client'

import { codeThemes, type CodeThemeId } from '@/config/code-themes'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

interface CodeThemeSelectorProps {
  value: CodeThemeId
  onChange: (value: CodeThemeId) => void
}

export function CodeThemeSelector({ value, onChange }: CodeThemeSelectorProps) {
  return (
    <div className="flex items-center gap-4">
      <Label>代码主题</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="选择代码主题" />
        </SelectTrigger>
        <SelectContent>
          {codeThemes.map((theme) => (
            <SelectItem key={theme.id} value={theme.id}>
              {theme.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
} 