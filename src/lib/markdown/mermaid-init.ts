import mermaid from 'mermaid'
import type { MermaidConfig } from 'mermaid'

let initialized = false

// Initialize mermaid with default configuration
const config: MermaidConfig = {
  startOnLoad: false,
  theme: document.documentElement.classList.contains('dark') ? 'dark' : 'default',
  securityLevel: 'loose' as const,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif',
  themeVariables: {
    'fontSize': '16px',
    'fontFamily': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Microsoft YaHei", sans-serif',
    'primaryColor': document.documentElement.classList.contains('dark') ? '#7c3aed' : '#4f46e5',
    'primaryTextColor': document.documentElement.classList.contains('dark') ? '#fff' : '#000',
    'primaryBorderColor': document.documentElement.classList.contains('dark') ? '#7c3aed' : '#4f46e5',
    'lineColor': document.documentElement.classList.contains('dark') ? '#666' : '#999',
    'textColor': document.documentElement.classList.contains('dark') ? '#fff' : '#333'
  },
  pie: {
    textPosition: 0.75,
    useMaxWidth: true
  }
}

// 缓存已渲染的图表
const renderedDiagrams = new Map<string, string>()

// Generate a valid ID for mermaid diagrams
function generateMermaidId() {
  return `mermaid-${Math.floor(Math.random() * 100000)}`
}

// Clean and format mermaid definition
function cleanMermaidDefinition(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/[""]/g, '"') // 替换中文引号
    .replace(/：/g, ':') // 替换中文冒号
    .split('\n')
    .map(line => line.trim())
    .filter(line => line) // 移除空行
    .join('\n')
    .trim()
}

// Process pie chart definition
function processPieChart(definition: string): string {
  // 如果已经有 showData，直接返回
  if (definition.includes('showData')) {
    return definition
  }

  // 移除开头的 pie 并添加 showData
  const lines = definition.split('\n')
  if (lines[0].trim() === 'pie') {
    lines[0] = 'pie showData'
  } else {
    lines.unshift('pie showData')
  }

  return lines.join('\n')
}

// Function to initialize Mermaid diagrams
export async function initMermaid() {
  try {
    // 确保只初始化一次
    if (!initialized) {
      mermaid.initialize(config)
      initialized = true
    }

    // 查找所有 mermaid 图表
    const mermaidDivs = Array.from(document.querySelectorAll('div.mermaid'))
    
    // 处理每个图表
    for (const element of mermaidDivs) {
      try {
        const graphDefinition = element.textContent || ''
        if (!graphDefinition.trim()) continue

        const cleanDefinition = cleanMermaidDefinition(graphDefinition)
        const cacheKey = cleanDefinition

        // 检查缓存
        const cachedSvg = renderedDiagrams.get(cacheKey)
        if (cachedSvg && element.getAttribute('data-source') === cleanDefinition) {
          // 如果有缓存且内容没变，直接使用缓存
          const container = document.createElement('div')
          container.style.width = '100%'
          container.style.display = 'flex'
          container.style.justifyContent = 'center'
          container.style.margin = '1em 0'
          container.innerHTML = cachedSvg

          // 保存原始内容用于复制
          const originalContent = document.createElement('div')
          originalContent.style.display = 'none'
          originalContent.className = 'mermaid-source'
          originalContent.textContent = `\`\`\`mermaid
${graphDefinition.trim()}
\`\`\``

          element.innerHTML = ''
          element.appendChild(originalContent)
          element.appendChild(container)
          element.setAttribute('data-processed', 'true')
          element.setAttribute('data-source', cleanDefinition)
          continue
        }

        // 创建容器
        const container = document.createElement('div')
        container.style.width = '100%'
        container.style.display = 'flex'
        container.style.justifyContent = 'center'
        container.style.margin = '1em 0'
        
        try {
          // 处理不同类型的图表
          let finalDefinition = cleanDefinition
          if (cleanDefinition.includes('pie')) {
            finalDefinition = processPieChart(cleanDefinition)
          }

          // 渲染图表
          const id = generateMermaidId()
          const { svg } = await mermaid.render(id, finalDefinition)
          
          // 缓存渲染结果
          renderedDiagrams.set(cacheKey, svg)
          
          // 保存原始内容用于复制
          const originalContent = document.createElement('div')
          originalContent.style.display = 'none'
          originalContent.className = 'mermaid-source'
          originalContent.textContent = `\`\`\`mermaid
${graphDefinition.trim()}
\`\`\``
          
          // 更新 DOM
          container.innerHTML = svg
          element.innerHTML = ''
          element.appendChild(originalContent)
          element.appendChild(container)
          element.setAttribute('data-processed', 'true')
          element.setAttribute('data-source', finalDefinition)

          // 添加复制事件处理
          container.addEventListener('copy', (e) => {
            e.preventDefault()
            const sourceText = element.querySelector('.mermaid-source')?.textContent || ''
            if (e.clipboardData) {
              e.clipboardData.setData('text/plain', sourceText)
            }
          })
        } catch (renderError) {
          console.error('Mermaid render error:', renderError)
          console.log('Graph definition:', cleanDefinition)
          element.innerHTML = `<pre><code class="language-mermaid">${cleanDefinition}</code></pre>`
          element.setAttribute('data-processed', 'true')
          element.setAttribute('data-source', cleanDefinition)
        }
      } catch (error) {
        console.error('Mermaid processing error:', error)
      }
    }
  } catch (error) {
    console.error('Mermaid initialization error:', error)
  }
}