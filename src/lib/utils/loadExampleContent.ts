/**
 * Utility function to load the example.md content
 * This provides a default content for the editor when first opened
 */

// Import the example.md content directly
const exampleContent = `# NeuraPress 简介
Markdown 转微信公众帐号内容神器，能让\`Markdown\`内容，无需作任何调整就能**一键复制**到微信公众号使用，特别针对代码展示做了优化。


GitHub 地址：

[https://github.com/tianyaxiang/neurapress](https://github.com/tianyaxiang/neurapress)

> 使用微信公众号编辑器有一个十分头疼的问题——粘贴出来的代码，格式错乱，而且特别丑。




### Markdown基本语法
#### 标题
支持6种大小的标题，分别对应\`#\`,\`##\`,\`###\`,\`####\`,\`#####\`,\`######\`，和样式文件中的\`h1,...,h6\`如：
# H1
## H2
#### 行内代码
如：\`AppCompatActivity\`类,markdown对行内代码的语法是前后用：\\\`,其中 \\\` 为windows键盘左上角那个,

#### 强调
**我是强调**
#### 斜体
试试*斜体*
#### 强调的斜体
试试***强调的斜体***
#### 删除
试试 ~~删除~~
#### 外链的超链接
试试外链的超链接：[我是外链的超链接](https://www.leti.ltd),markdown对链接的语法为：\`[]()\`,如：\`[我是外链的超链接](https://www.leti.ltd)\`
#### 页内的超链接
试试页内的超链接：[我是页内的超链接](#jump_1)，注：你先要在要跳转的到地方放置一个类似：\`<a id="jump_1">任意内容</a>\`的锚点。由\`id="jump_1" \`来匹配。


#### 有序列表
1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

#### 无序列表
- 无序列表 1
- 无序列表 2
- 无序列表 3

#### 引用块
只需要在前面加 \`>\`,如下:
>我是引用块
微信公众号：孟晨
欢迎关注我，一起学习，一起进步，做终身学习者!

#### 分隔线
***


### Markdown扩展语法

#### 表格
| 班级 | 男生 | 女生 |
|-----|-----|------|
| 一(7)班 | 30   | 25 |
| 一(8)班 | 25   | 30 |


### 直接支持html,css
如果你懂html和css，那下面这些效果就不在话下了：

<a href="#jump_1">来个页内跳转</a>，跳转到文未的：\`<a id="jump_1">我是页内跳转到的位置</a>\` ,对应：\`id="jump_1"\`
<span  style="color: #5bdaed; ">先给点颜色你看看</span>
<span  style="color: #AE87FA; ">再给点颜色你看看</span>
<span  style="font-size:1.3em;">试试改变字体大小</span>

<a id="jump_1">我是页内跳转到的位置</a>

### 任务列表
- [x] 已完成任务
- [ ] 未完成任务
- [ ] 未完成任务2

### 数学公式
使用两个美元符号包裹TeX或LaTeX格式的数学公式：

$$
E=mc^2
$$

### 代码块显示效果
注：markdown对代码块的语法是开始和结束行都要添加：\\\`\\\`\\\`,其中 \\\` 为windows键盘左上角那个，如下：
\`\`\`yaml
kind: RoleBinding
apiVersion: rbac.authorization.k8s.io/v1
metadata:
  name: haimaxy-sa-rolebinding
  namespace: kube-system
subjects:
- kind: ServiceAccount
  name: haimaxy-sa
  namespace: kube-system
roleRef:
  kind: Role
  name: haimaxy-sa-role
  apiGroup: rbac.authorization.k8s.io
\`\`\`


在页面头部提供了很多中**代码主题**风格，可以根据需要选择合适的即可。

### 用户体验
- 支持自动保存
- 支持多种主题
- 支持快捷键
`;

/**
 * Returns the example.md content
 */
export function getExampleContent(): string {
  return exampleContent;
}
