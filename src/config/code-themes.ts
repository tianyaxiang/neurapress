export const codeThemes = [
  {
    id: 'github',
    name: 'GitHub',
    description: 'GitHub 风格代码主题',
    theme: {
      background: '#f6f8fa',
      text: '#24292e',
      comment: '#6a737d',
      keyword: '#d73a49',
      string: '#032f62',
      number: '#005cc5',
      function: '#6f42c1',
      class: '#22863a',
      variable: '#24292e',
      operator: '#d73a49'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    description: '暗黑风格代码主题',
    theme: {
      background: '#282a36',
      text: '#f8f8f2',
      comment: '#6272a4',
      keyword: '#ff79c6',
      string: '#f1fa8c',
      number: '#bd93f9',
      function: '#50fa7b',
      class: '#8be9fd',
      variable: '#f8f8f2',
      operator: '#ff79c6'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    description: '经典 Sublime Text 主题',
    theme: {
      background: '#272822',
      text: '#f8f8f2',
      comment: '#75715e',
      keyword: '#f92672',
      string: '#e6db74',
      number: '#ae81ff',
      function: '#a6e22e',
      class: '#66d9ef',
      variable: '#f8f8f2',
      operator: '#f92672'
    }
  },
  {
    id: 'solarized-light',
    name: 'Solarized Light',
    description: '护眼浅色主题',
    theme: {
      background: '#fdf6e3',
      text: '#657b83',
      comment: '#93a1a1',
      keyword: '#859900',
      string: '#2aa198',
      number: '#d33682',
      function: '#268bd2',
      class: '#b58900',
      variable: '#657b83',
      operator: '#859900'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    description: '北欧风格主题',
    theme: {
      background: '#2e3440',
      text: '#d8dee9',
      comment: '#4c566a',
      keyword: '#81a1c1',
      string: '#a3be8c',
      number: '#b48ead',
      function: '#88c0d0',
      class: '#8fbcbb',
      variable: '#d8dee9',
      operator: '#81a1c1'
    }
  }
] as const

export type CodeTheme = typeof codeThemes[number]
export type CodeThemeId = CodeTheme['id'] 