本 Markdown 速查表改编自：
[https://guides.github.com/features/mastering-markdown/](https://guides.github.com/features/mastering-markdown/)  



**什么是 Markdown？**  
Markdown 是一种轻量级标记语言，用于在网页上格式化文本。它允许用户控制文档的呈现方式——例如将文字设为粗体或斜体、添加图片、创建列表等。本质上，Markdown 是纯文本，仅需添加少量非字母字符（如 `#` 或 `*`）即可实现富文本效果。  

**语法指南**  
以下是 GitHub.com 及本地文本文件中支持的 Markdown 语法概览。  

#### 标题（正常渲染效果是一级标题字体最大）  
```markdown
# 这是一级标题  
## 这是二级标题  
#### 这是四级标题  
```  
**渲染效果：**  
# 这是一级标题  
## 这是二级标题  
#### 这是四级标题  



#### 强调  
```markdown
_这段文本会显示为斜体_  

**这段文本会显示为粗体**  

_你可以**组合**使用这两种格式_  
```  
**渲染效果：**  
_这段文本会显示为斜体_  
**这段文本会显示为粗体**  
_你可以**组合**使用这两种格式_  



#### 列表  
**无序列表**  
```markdown
- 项目 1  
- 项目 2  
  - 子项目 2a  
  - 子项目 2b  
```  
**渲染效果：**  
- 项目 1  
- 项目 2  
  - 子项目 2a  
  - 子项目 2b  

**有序列表**  
```markdown
1. 项目 1  
1. 项目 2  
1. 项目 3  
   1. 子项目 3a  
   1. 子项目 3b  
```  
**渲染效果：**  
1. 项目 1  
2. 项目 2  
3. 项目 3  
   1. 子项目 3a  
   2. 子项目 3b  



#### 图片  
```markdown
![GitHub 图标](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)  
格式：`![替代文本](图片链接)`  
```  
**渲染效果：**  
![GitHub 图标](https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png)  



#### 链接  
```markdown
http://github.com - 自动识别为链接！  
[GitHub](http://github.com)  
```  
**渲染效果：**  
http://github.com - 自动识别为链接！  
[GitHub](http://github.com)  



#### 引用  
```markdown
正如 Kanye West 所说：  

> 我们活在未来的世界里，  
> 所以当下已成过去。  
```  
**渲染效果：**  
正如 Kanye West 所说：  

> 我们活在未来的世界里，所以当下已成过去。  



#### 行内代码  
```markdown
建议在此处使用 `<addr>` 元素。  
```  
**渲染效果：**  
建议在此处使用 `<addr>` 元素。  



#### 语法高亮  
GitHub Flavored Markdown 的语法高亮示例：  
````markdown
```js:fancyAlert.js  
function fancyAlert(arg) {  
  if (arg) {  
    $.facebox({ div: '#foo' });  
  }  
}  
```  
````  
**渲染效果（含代码标题与高亮）：**  
`fancyAlert.js`  
```js  
function fancyAlert(arg) {  
  if (arg) {  
    $.facebox({ div: '#foo' });  
  }  
}  
```  



#### 脚注  
```markdown
这是一个简单的脚注[^1]。后续补充文本。  

[^1]: 我的参考内容。  
```  
**渲染效果：**  
这是一个简单的脚注[^1]。后续补充文本。  

[^1]: 我的参考内容。  



#### 任务列表（ github支持，但是现在用的 markdown 编辑器不支持）  
```markdown
- [x] 支持任意无序或有序列表语法  
- [x] 已完成的任务  
- [ ] 未完成的任务  
```  
**渲染效果：**  
- [x] 支持任意无序或有序列表语法  
- [x] 已完成的任务  
- [ ] 未完成的任务  



#### 表格  
```markdown
| 第一列标题      | 第二列标题         |  
|---------------|-----------|  
| 单元格 1 的内容 | 单元格 2 的内容 |  
| 左列内容          | 右列内容           |  
```  
**渲染效果：**  

| 第一列标题         | 第二列标题         |  
|--------------------|--------------------|  
| 单元格 1 的内容    | 单元格 2 的内容    |  
| 左列内容           | 右列内容           |  



#### 删除线  
```markdown
用双波浪号包裹文字（例如 ~~像这样~~）会显示为删除效果。  
```  
**渲染效果：**  
~~像这样~~  