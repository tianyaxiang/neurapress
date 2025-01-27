'use client'

import { Check, ChevronDown } from "lucide-react"
import * as SelectPrimitive from '@radix-ui/react-select'
import { cn } from "@/lib/utils"
import { templates } from '@/config/templates'
import { useState } from 'react'

export function TemplateSelector({ 
  onSelect 
}: { 
  onSelect: (template: string, subTemplate?: string) => void 
}) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')

  return (
    <div className="flex gap-2">
      <SelectPrimitive.Root 
        onValueChange={(value) => {
          setSelectedTemplate(value)
          onSelect(value)
        }}
      >
        <SelectPrimitive.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground min-w-[120px]">
          <SelectPrimitive.Value placeholder="选择模板..." />
          <SelectPrimitive.Icon>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content className="overflow-hidden bg-popover rounded-md border shadow-md">
            <SelectPrimitive.Viewport className="p-1">
              {templates.map((template) => (
                <SelectPrimitive.Item
                  key={template.id}
                  value={template.id}
                  className={cn(
                    "relative flex items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                  )}
                >
                  <SelectPrimitive.ItemText>{template.name}</SelectPrimitive.ItemText>
                  <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                    <Check className="h-4 w-4" />
                  </SelectPrimitive.ItemIndicator>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.Viewport>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>

      {selectedTemplate && templates.find(t => t.id === selectedTemplate)?.subTemplates && (
        <SelectPrimitive.Root onValueChange={(value) => onSelect(selectedTemplate, value)}>
          <SelectPrimitive.Trigger className="inline-flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium border border-input hover:bg-accent hover:text-accent-foreground min-w-[120px]">
            <SelectPrimitive.Value placeholder="选择样式..." />
            <SelectPrimitive.Icon>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </SelectPrimitive.Icon>
          </SelectPrimitive.Trigger>
          <SelectPrimitive.Portal>
            <SelectPrimitive.Content className="overflow-hidden bg-popover rounded-md border shadow-md">
              <SelectPrimitive.Viewport className="p-1">
                {templates
                  .find(t => t.id === selectedTemplate)
                  ?.subTemplates?.map((subTemplate) => (
                    <SelectPrimitive.Item
                      key={subTemplate.id}
                      value={subTemplate.id}
                      className={cn(
                        "relative flex items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground cursor-pointer"
                      )}
                    >
                      <SelectPrimitive.ItemText>{subTemplate.name}</SelectPrimitive.ItemText>
                      <SelectPrimitive.ItemIndicator className="absolute left-2 inline-flex items-center">
                        <Check className="h-4 w-4" />
                      </SelectPrimitive.ItemIndicator>
                    </SelectPrimitive.Item>
                  ))}
              </SelectPrimitive.Viewport>
            </SelectPrimitive.Content>
          </SelectPrimitive.Portal>
        </SelectPrimitive.Root>
      )}
    </div>
  )
} 