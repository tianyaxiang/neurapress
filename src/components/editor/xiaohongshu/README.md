# 小红书编辑器模块架构

本模块按照**功能、可维护性、可扩展性**三个维度进行了重构拆分。

## 📁 目录结构

```
src/components/editor/xiaohongshu/
├── README.md                          # 架构说明文档
├── constants.ts                       # 常量配置
├── XiaohongshuMarkdownEditor.tsx      # 主组件入口
├── components/                        # UI组件
│   ├── XiaohongshuToolbar.tsx        # 顶部工具栏
│   ├── XiaohongshuMarkdownToolbar.tsx # Markdown工具栏
│   ├── XiaohongshuEditor.tsx         # 编辑器区域
│   └── XiaohongshuPreview.tsx        # 预览区域
└── hooks/                            # 逻辑Hooks
    ├── useXiaohongshuEditor.ts       # 主编辑器逻辑
    ├── useImageGeneration.ts         # 图片生成逻辑
    ├── usePreviewControls.ts         # 预览控制逻辑
    └── useToolbarInsert.ts          # 工具栏插入逻辑
```

## 🎯 拆分原则

### 1. **功能维度拆分**

#### **UI组件层**
- `XiaohongshuToolbar`: 顶部工具栏，负责保存、复制、图片生成等操作
- `XiaohongshuMarkdownToolbar`: Markdown编辑工具栏，负责文本格式化
- `XiaohongshuEditor`: 编辑器区域，负责文本输入和编辑
- `XiaohongshuPreview`: 预览区域，负责内容展示和预览控制

#### **逻辑层（Hooks）**
- `useXiaohongshuEditor`: 核心编辑器状态管理和文本处理
- `useImageGeneration`: 图片生成功能
- `usePreviewControls`: 预览缩放和全屏控制
- `useToolbarInsert`: 工具栏文本插入逻辑

#### **配置层**
- `constants.ts`: 模板配置、默认内容、存储键名等常量

### 2. **可维护性维度优化**

#### **单一职责原则**
- 每个组件只负责一个明确的功能区域
- 每个Hook只处理一类相关的逻辑
- 配置与实现分离

#### **清晰的接口设计**
- 组件props类型明确，易于理解和使用
- Hook返回值结构清晰，便于调用
- 统一的命名规范

#### **错误处理集中化**
- 所有异步操作都有统一的错误处理
- Toast消息统一管理
- 类型安全保障

### 3. **可扩展性维度设计**

#### **组件组合模式**
- 主组件通过组合子组件实现功能
- 便于替换或扩展单个组件
- 支持功能的独立测试

#### **Hook复用性**
- 逻辑Hook可以在其他编辑器中复用
- 状态管理与UI解耦
- 便于单元测试

#### **配置驱动**
- 模板系统易于扩展新样式
- 工具栏配置可以轻松添加新功能
- 存储策略可以灵活调整

## 🔄 数据流

```
┌─────────────────┐
│ 用户操作        │
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ UI组件          │ ← 接收用户输入
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ Hook逻辑层      │ ← 处理业务逻辑
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ 状态更新        │ ← 更新应用状态
└─────┬───────────┘
      │
      ▼
┌─────────────────┐
│ UI重新渲染      │ ← 反映状态变化
└─────────────────┘
```

## 🚀 扩展指南

### 添加新模板
1. 在 `constants.ts` 中添加模板配置
2. 在 CSS 文件中添加对应样式类
3. 模板会自动出现在选择器中

### 添加新工具栏功能
1. 在 `XiaohongshuMarkdownToolbar.tsx` 的 `tools` 数组中添加配置
2. 定义图标、标题、插入文本等属性
3. 功能会自动集成到工具栏

### 添加新的编辑器功能
1. 创建新的Hook处理相关逻辑
2. 在主组件中引入和使用Hook
3. 通过props传递给相关子组件

### 自定义存储策略
1. 修改 `constants.ts` 中的存储键名
2. 在相关Hook中实现新的存储逻辑
3. 保持接口一致性

## 📊 性能优化

- **按需渲染**: 使用React.memo优化子组件重渲染
- **回调优化**: 使用useCallback避免不必要的函数重新创建
- **状态分离**: 将不相关的状态分离到不同的Hook中
- **延迟加载**: 大型功能可以实现为动态导入

## 🧪 测试策略

- **组件测试**: 每个UI组件可以独立测试
- **Hook测试**: 使用React Testing Library测试Hook逻辑
- **集成测试**: 测试组件间的协作关系
- **E2E测试**: 测试完整的用户操作流程

这种架构设计使得小红书编辑器具有良好的可维护性和可扩展性，同时保持了清晰的功能分离。 