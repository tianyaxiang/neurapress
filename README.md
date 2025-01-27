# NeuraPress

NeuraPress 是一个现代化的 Markdown 编辑器，专注于提供优质的微信公众号排版体验。

## 特性

- 🎨 实时预览 - 所见即所得的编辑体验
- 📱 移动端预览 - 直观展示在手机上的显示效果
- 🎯 微信风格 - 完美适配微信公众号样式
- 🔧 样式定制 - 灵活的样式配置选项
- 📋 一键复制 - 支持复制源码和带格式的预览内容
- 🎭 模板系统 - 内置多种排版模板，一键切换
- 🚀 快速高效 - 基于 Next.js 构建，性能优异

## 快速开始

### 环境要求

- Node.js 18+
- pnpm 8+

### 安装

```bash
# 克隆项目
git clone https://github.com/tianyaxiang/neurapress.git

# 进入项目目录
cd neurapress

# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 构建

```bash
# 构建生产版本
pnpm build

# 启动生产服务器
pnpm start
```

## 使用指南

1. **编辑内容**
   - 左侧为 Markdown 编辑区
   - 支持标准 Markdown 语法
   - 支持 GFM (GitHub Flavored Markdown)

2. **预览内容**
   - 右侧为实时预览区
   - 展示最终在微信中的显示效果
   - 可以切换预览窗口的显示/隐藏

3. **样式设置**
   - 使用样式选择器选择预设模板
   - 通过样式配置对话框自定义样式
   - 支持自定义字体、颜色、间距等属性

4. **复制内容**
   - 点击"复制源码"获取 HTML 源码
   - 点击"复制预览"获取带格式的预览内容
   - 直接粘贴到微信公众号编辑器中使用

## 技术栈

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- ByteMD
- Marked
- shadcn/ui

## 贡献指南

欢迎提交 Issue 和 Pull Request。在提交 PR 之前，请确保：

1. 代码通过 ESLint 检查
2. 新功能包含适当的测试
3. 更新相关文档

## 许可证

[MIT License](LICENSE)
