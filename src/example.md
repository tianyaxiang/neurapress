# NeuraPress 简介
Markdown 转微信公众帐号内容神器，能让`Markdown`内容，无需作任何调整就能**一键复制**到微信公众号使用，特别针对代码展示做了优化。


GitHub 地址：

[https://github.com/tianyaxiang/neurapress](https://github.com/tianyaxiang/neurapress)

> 使用微信公众号编辑器有一个十分头疼的问题——粘贴出来的代码，格式错乱，而且特别丑。


### 代码块显示效果
注：markdown对代码块的语法是开始和结束行都要添加：\`\`\`,其中 \` 为windows键盘左上角那个，如下：
```yaml
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
```

要精确指定语言（如：`java,cpp,css,xml,javascript,python,php,go,kotlin,lua,objectivec`等等）时，在头部直接指定，如：\`\`\`javascript，如下：

```javascript
function showSnackbar() {
  var $snackbar = $('#snackbar');
  $snackbar.addClass('show');
  setTimeout(() => {
    $snackbar.removeClass('show');
  }, 3000);
}
```

在页面头部提供了很多中**代码主题**风格，可以根据需要选择合适的即可。

### Markdown基本语法
#### 标题
支持6种大小的标题，分别对应`#`,`##`,`###`,`####`,`#####`,`######`，和样式文件中的`h1,...,h6`如：
##### H5
###### H6
#### 行内代码
如：`AppCompatActivity`类,markdown对行内代码的语法是前后用：\`,其中 \` 为windows键盘左上角那个,

#### 强调
**我是强调**
#### 斜体
试试*斜体*
#### 强调的斜体
试试***强调的斜体***
#### 删除
试试 ~~删除~~
#### 外链的超链接
试试外链的超链接：[我是外链的超链接](https://www.leti.ltd),markdown对链接的语法为：`[]()`,如：`[我是外链的超链接](https://www.leti.ltd)`
#### 页内的超链接
试试页内的超链接：[我是页内的超链接](#jump_1)，注：你先要在要跳转的到地方放置一个类似：`<a id="jump_1">任意内容</a>`的锚点。由`id="jump_1" `来匹配。


#### 有序列表
1. 有序列表 1
2. 有序列表 2
3. 有序列表 3

#### 无序列表
- 无序列表 1
- 无序列表 2
- 无序列表 3

#### 引用块
只需要在前面加 `>`,如下:
>我是引用块
微信公众号：k8s技术圈
欢迎关注我，一起学习，一起进步，All in Kubernetes!

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

<a href="#jump_1">来个页内跳转</a>，跳转到文未的：`<a id="jump_1">我是页内跳转到的位置</a>` ,对应：`id="jump_1"`
<span  style="color: #5bdaed; ">先给点颜色你看看</span>
<span  style="color: #AE87FA; ">再给点颜色你看看</span>
<span  style="font-size:1.3em;">试试改变字体大小</span>
<span  style="font-size:1.3em;font-weight: bold;">改变字体大小，再来个粗体又如何？</span>

<p style="text-align:center">
试试内容居中

</p>

<p style="text-align:right">
那内容居右呢？
</p>

<p style="text-align:center;color:#1e819e;font-size:1.3em;font-weight: bold;">
来个综合的试试
<br/>
第二行
</p>



### 版本更新记录
***
#### TODO

- 自动保存功能
- 增加多种主题样式
- 增加本地图片自动上传图床功能

#### Changelog
版本号：V1.0.0
更新日期：2025-02-01

- FIX 复制内容错误的BUG
- 优化页面主题代码


- 增加编辑区域和预览区域同步滚动
- 更改页面样式为左右结构，实时预览
- 直接复制内容到粘贴板，不要手动复制
- 替换`google-code-prettify`源为国内`CDN`源
- 支持更换代码样式主题
- 代码长度溢出时横向滚动

**更多请参考**：
[NeuraPress版本更新记录](https://github.com/tianyaxiang/neurapress)

![qrcode](https://open.weixin.qq.com/qr/code?username=gh_e0164b13e4a0)

***
<a id="jump_1">我是页内跳转到的位置</a>

### LICENSE
MIT License