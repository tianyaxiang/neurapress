import { useState, useEffect, useCallback } from 'react'
import { marked } from 'marked'
import { useToast } from '@/components/ui/use-toast'
import { defaultMarkdown, STORAGE_KEYS, type XiaohongshuTemplateId } from '../constants'

export function useXiaohongshuEditor() {
  const [markdown, setMarkdown] = useState(defaultMarkdown)
  const [selectedTemplate, setSelectedTemplate] = useState<XiaohongshuTemplateId>('default')
  const [parsedHtml, setParsedHtml] = useState('')
  const [isDraft, setIsDraft] = useState(false)
  const { toast } = useToast()

  // 配置marked
  useEffect(() => {
    marked.setOptions({
      breaks: true,
      gfm: true,
    })
  }, [])

  // 异步解析markdown为HTML
  useEffect(() => {
    const parseMarkdown = async () => {
      try {
        const html = await marked.parse(markdown)
        setParsedHtml(html)
      } catch (error) {
        console.error('Markdown parsing error:', error)
        setParsedHtml('<p>解析错误</p>')
      }
    }
    
    parseMarkdown()
  }, [markdown])

  // 处理文本变化
  const handleTextChange = useCallback((value: string) => {
    setMarkdown(value)
    setIsDraft(true)
  }, [])

  // 保存内容
  const handleSave = useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CONTENT, markdown)
      localStorage.setItem(STORAGE_KEYS.TEMPLATE, selectedTemplate)
      setIsDraft(false)
      toast({
        title: "保存成功",
        description: "内容已保存到本地",
        duration: 2000
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "保存失败",
        description: "无法保存内容，请检查浏览器存储空间",
      })
    }
  }, [markdown, selectedTemplate, toast])

  // 复制HTML内容
  const copyHTML = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(parsedHtml)
      toast({
        title: "复制成功",
        description: "HTML内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请重试",
        variant: "destructive",
      })
    }
  }, [parsedHtml, toast])

  // 复制Markdown内容
  const copyMarkdown = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(markdown)
      toast({
        title: "复制成功", 
        description: "Markdown内容已复制到剪贴板",
      })
    } catch (error) {
      toast({
        title: "复制失败",
        description: "请重试",
        variant: "destructive",
      })
    }
  }, [markdown, toast])

  // 加载保存的内容
  useEffect(() => {
    const savedContent = localStorage.getItem(STORAGE_KEYS.CONTENT)
    const savedTemplate = localStorage.getItem(STORAGE_KEYS.TEMPLATE) as XiaohongshuTemplateId
    
    if (savedContent) {
      setMarkdown(savedContent)
      setIsDraft(false)
    }
    
    if (savedTemplate && savedTemplate in { default: 1, cute: 1, minimal: 1, elegant: 1 }) {
      setSelectedTemplate(savedTemplate)
    }
  }, [])

  return {
    // 状态
    markdown,
    selectedTemplate,
    parsedHtml,
    isDraft,
    
    // 操作
    setMarkdown: handleTextChange,
    setSelectedTemplate,
    handleSave,
    copyHTML,
    copyMarkdown,
  }
} 