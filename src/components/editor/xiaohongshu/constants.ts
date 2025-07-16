// 小红书模板配置
export const xiaohongshuTemplates = {
  default: {
    name: '默认模板',
    id: 'default',
    styles: 'xiaohongshu-default'
  },
  cute: {
    name: '可爱风格',
    id: 'cute',
    styles: 'xiaohongshu-cute'
  },
  minimal: {
    name: '极简风格',
    id: 'minimal',
    styles: 'xiaohongshu-minimal'
  },
  elegant: {
    name: '优雅风格',
    id: 'elegant',
    styles: 'xiaohongshu-elegant'
  }
} as const

export type XiaohongshuTemplateId = keyof typeof xiaohongshuTemplates

// 分页模式配置
export const pageModes = {
  single: {
    name: '单页模式',
    id: 'single',
    description: '整个内容生成一张图片'
  },
  multiple: {
    name: '多页模式', 
    id: 'multiple',
    description: '内容自动分页，生成多张图片'
  }
} as const

export type PageMode = keyof typeof pageModes

// 页码显示配置
export const pageNumberOptions = {
  none: {
    name: '不显示页码',
    id: 'none'
  },
  bottom: {
    name: '底部居中',
    id: 'bottom'
  },
  'bottom-right': {
    name: '底部右侧',
    id: 'bottom-right'
  }
} as const

export type PageNumberPosition = keyof typeof pageNumberOptions

// 分页大小配置
export const pageSizeOptions = {
  small: {
    name: '小内容量',
    id: 'small',
    description: '每页约800字符，适合短篇内容',
    maxLength: 800
  },
  medium: {
    name: '中内容量',
    id: 'medium',
    description: '每页约1500字符，适合中篇内容',
    maxLength: 1500
  },
  large: {
    name: '大内容量',
    id: 'large',
    description: '每页约2500字符，适合长篇内容',
    maxLength: 2500
  },
  xlarge: {
    name: '超大内容量',
    id: 'xlarge',
    description: '每页约4000字符，适合超长内容',
    maxLength: 4000
  }
} as const

export type PageSizeOption = keyof typeof pageSizeOptions

// 分页设置
export const PAGE_SETTINGS = {
  maxHeight: 800, // 每页最大高度（像素）
  minHeight: 400, // 每页最小高度（像素）
  pageMargin: 40, // 页面边距
  defaultPageSize: 'medium' as PageSizeOption, // 默认分页大小
} as const

// 默认Markdown内容
export const defaultMarkdown = `# 我的小红书笔记 📱

## 今天想分享的内容 ✨

**粗体文字强调重点**

*斜体文字表达情感*

### 小贴士 💡

- 第一个要点
- 第二个要点  
- 第三个要点

> 引用一些有意思的话

\`\`\`
代码片段示例
console.log('Hello Xiaohongshu!');
\`\`\`

---

记得点赞收藏哦～ ❤️

## 更多内容

这里是更多的内容，用来演示分页功能。当内容足够长时，会自动分成多页显示。

### 技术分享

分享一些技术相关的内容：

1. 前端开发技巧
2. 设计模式应用
3. 性能优化方案

### 生活感悟

- 保持学习的习惯
- 享受编程的乐趣
- 分享知识的快乐

> 持续学习，持续成长！

### 结语

感谢大家的阅读，希望这些内容对你有帮助。记得点赞收藏哦！`

// 本地存储键名
export const STORAGE_KEYS = {
  CONTENT: 'xiaohongshu_editor_content',
  TEMPLATE: 'xiaohongshu_editor_template',
  ZOOM: 'xiaohongshu_editor_zoom',
  PAGE_MODE: 'xiaohongshu_page_mode',
  PAGE_NUMBER_POSITION: 'xiaohongshu_page_number_position',
  PAGE_SIZE: 'xiaohongshu_page_size'
} as const 