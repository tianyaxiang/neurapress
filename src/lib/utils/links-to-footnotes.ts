export function convertExternalLinksToFootnotes(html: string): string {
  if (!html) return html

  // 匹配 <a ... href="http(s)://...">text</a>
  const linkRegex = /<a\s+([^>]*?)href=("|')(https?:\/\/[^"'>\s]+)\2([^>]*)>([\s\S]*?)<\/a>/gi
  const urls: string[] = []
  const urlIndexMap: Record<string, number> = {}

  // 替换函数：把链接替换为文本和脚注标记
  const replaced = html.replace(linkRegex, (match, preAttrs, quote, url, postAttrs, text) => {
    // 若链接是页面内部锚点或邮箱、javascript 等则保留，不处理
    const lower = url.toLowerCase()
    if (!lower.startsWith('http://') && !lower.startsWith('https://')) return match

    // 微信域名的链接保持原样，不转换为脚注
    const isWeChatLink =
      lower.includes('://mp.weixin.qq.com') ||
      lower.includes('://weixin.qq.com') ||
      lower.includes('://open.weixin.qq.com') ||
      lower.includes('://wx.qq.com')

    if (isWeChatLink) {
      return match
    }

    const attrs = `${preAttrs || ''} ${postAttrs || ''}`.toLowerCase()
    if (attrs.includes('data-wx-recommend') || attrs.includes('wx-article-card')) {
      return match
    }


    let idx = urlIndexMap[url]
    if (!idx) {
      urls.push(url)
      idx = urls.length // 1-based
      urlIndexMap[url] = idx
    }

    const sup = `<sup style="font-size:0.85em; vertical-align:super; margin-left:4px">[${idx}]</sup>`
    return `${text}${sup}`
  })


  if (urls.length === 0) return replaced

  // 构造底部引用块，使用简单内联样式以提高公众号兼容性
  const listItems = urls
    .map((u, i) => {
      // 显示短链（可选），但保留完整链接作为 title/可点击 a
      const safe = u.replace(/"/g, '%22')
      return `<li style="margin:6px 0; font-size:13px; color:#4a5568; line-height:1.4"><a href=\"${safe}\" style=\"color:#006651; text-decoration:underline\">${u}</a></li>`
    })
    .join('')

  const footnoteBlock = `\n<hr style="border:none; border-top:1px solid #e6f0ec; margin:16px 0;">\n<section class=\"wechat-footnotes\" style=\"font-size:13px; color:#718096; margin-top:12px;\">\n<strong style=\"display:block; margin-bottom:8px; color:#2d3748\">外部链接参考</strong>\n<ol style=\"padding-left:1.1em; margin:0;\">${listItems}</ol>\n</section>`

  return replaced + footnoteBlock
}
