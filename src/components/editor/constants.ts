export const PREVIEW_SIZES = {
  small: { width: '360px', label: '小屏' },
  medium: { width: '390px', label: '中屏' },
  large: { width: '420px', label: '大屏' },
  full: { width: '100%', label: '全屏' },
} as const

export type PreviewSize = keyof typeof PREVIEW_SIZES

export const AUTO_SAVE_DELAY = 3000 // 自动保存延迟（毫秒）

export interface Article {
  content: string
  template: string
} 