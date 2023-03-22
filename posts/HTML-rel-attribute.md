---
date: 23:12 2023/3/22
title: HTML rel 属性的使用
tags:
- HTML
description: rel 属性表示 “关系 (relationship) ”，在 link、a、area 和 form 元素上有效，属性值表示 link 的链接方式或与包含它的文档之间的关系。
---
## 介绍
通过 `<a>`, `<area>`、`<form>` 或 `<link>` 元素可以使一个页面链接到另一个页面，通过 `href` 属性（`<form>` 属性是 `action`）可以设置外部资源的路径。

`rel` 属性表示 “关系 (relationship) ”，在 `<link>`、`<a>`、`<area>` 和 `<form>` 元素上有效，属性值表示 `<link>` 的链接方式或与包含它的文档之间的关系。

## 支持的类型
### alternate
在 `<link>`、`<a>`、`<area>` 元素上有效。
如果元素是 `<link>` 并且 `rel` 属性也包含 stylesheet 类型，则链接定义替代样式表；在这种情况下，`title` 属性必须存在。
```html
<link href="reset.css" rel="stylesheet">
<link href="default.css" rel="stylesheet" title="默认">
<link href="red.css" rel="alternate stylesheet" title="红色">
<link href="green.css" rel="alternate stylesheet" title="绿色">
```
上面4个 `<link>` 元素，共定义了 3 种不同性质的 CSS 样式文件加载：
- 没有 `title` 属性，`rel` 属性值仅仅是 `stylesheet` 的 `<link>` 无论如何都会加载并渲染，如 reset.css；
- 有 `title` 属性，`rel` 属性值仅仅是 `stylesheet` 的 `<link>` 作为默认样式 CSS 文件加载并渲染，如 default.css；
- 有 `title` 属性，`rel` 属性值同时包含 `alternate` 和 `stylesheet` 的 `<link>` 作为备选样式 CSS 文件加载，默认不渲染，如 red.css 和 green.css。

在 IE 和 Firefox 中可以通过菜单切换样式：

![微信图片编辑_20220901124007.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cff8a077b1be4348acd74aac7a0e4497~tplv-k3u1fbpfcp-watermark.image?)

![微信图片编辑_20220901123729.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9665dd8b116a4fb8a24ea704354ef37b~tplv-k3u1fbpfcp-watermark.image?)

---
而在 Chrome 中则需要手动添加 JS 切换：
```js
// 渲染red.css这个皮肤
document.querySelector('link[href="red.css"]').disabled = false;
```

### 用来增强链接语义的类型
archives、author、glossary、help、first、last、prev、next、index、contents、chapter、section、subsection、appendix、license 在 `<link>`、`<a>`、`<area>` 元素上有效，表明这个链接指向归档、作者信息介绍页面、使用的词汇的术语表页面、与上下文相关的帮助页面或资源、一系列链接中的第一个页面、最后一个页面、上一个页面、下一个页面、根页面、文档的目录、章、节、小节、附录、版权说明页面；bookmark，external、nofollow 在 `<a>`、`<area>` 元素上有效，表明这是一个固定链接、外部链接（点击这个链接会离开当前网站）、搜索引擎无需抓取的链接。

### canonical
在 `<link>` 元素上有效，定义当前文档的首选 URL，这对搜索引擎很有用，可以为类似网页或重复网页指定规范网页。例如 wordpress 文章链接地址有多种 URL 表示，我希望用户通过 `https://www.zhangxinxu.com/wordpress/2019/05/html-a-rel/`（而非 `https://www.zhangxinxu.com/wordpress/?p=8488`）访问这篇文章，则可以新增如下代码：
```html
<link rel="canonical" href="https://www.zhangxinxu.com/wordpress/2019/05/html-a-rel/">
```

### dns-prefetchExperimenta
在 `<link>` 元素上有效，提示浏览器该资源需要在用户点击链接之前进行 DNS 查询和协议握手。例如：
```html
<link rel="dns-prefetch" href="http://www.zhangxinxu.com/">
```
此时如果页面中有链接地址的域名也是 `www.zhangxinxu.com`，那么当用户点击这个链接的时候，新打开的页面就少了 DNS 向上查找这一步，因为之前浏览器已经 DNS 预读取了，页面呈现速度就会快一些。

### icon
同义词 shortcut，在 `<link>` 元素上有效，指定网站标题栏小图标。例如：
```html
<link rel="icon" href="favicon.ico">
```

### manifest
在 `<link>` 元素上有效，表示链接到的文件是 Web App Manifest，一个 JSON 文本文件，在其中提供有关 PWA 应用程序的信息（如名称，作者，图标和描述）。

### modulepreload
预加载原生模块脚本。浏览器已经原生支持 JavaScript 模块，包括静态和动态导入支持。这意味着现在可以编写在浏览器中本地运行的基于模块的 JavaScript，而无需转译器或捆绑器。但是，模块依赖引入了一个加载问题，因为浏览器需要等待一个模块加载，然后才能发现它的依赖是什么。解决此问题的一种方法是预加载依赖项，以便浏览器提前了解所有依赖文件。`modulepreload` 即是 `preload` 的 JavaScript 模块版本，它解决了后者的许多问题。
```html
<link rel="modulepreload" href="./1.mjs">
<script src="./1.mjs" type="module"></script>
```
Chrome 现在知道您要预加载的是一个模块，因此它可以很智能，并在完成获取后立即解析和编译模块，而不是等到它尝试运行。

#### 模块的依赖关系呢？
以递归方式预加载依赖项，但需要浏览器需要具有强大的模块重复数据删除功能。通常最佳实践是声明模块及其依赖项的平面列表。
```html
<!-- dog.js 依赖 dog-head.js, dog-head.js 依赖 dog-head-mouth.js, dog-head-mouth.js 依赖 dog-head-mouth-tongue.js. -->
<link rel="modulepreload" href="dog-head-mouth-tongue.mjs">
<link rel="modulepreload" href="dog-head-mouth.mjs">
<link rel="modulepreload" href="dog-head.mjs">
<link rel="modulepreload" href="dog.mjs">
```

#### 预加载模块是否有助于提高性能？
预加载可以帮助最大化带宽使用，通过告诉浏览器它需要获取什么，这样它就不会在那些漫长的往返过程中无事可做。如果您正在尝试使用模块并由于深度依赖树而遇到性能问题，那么创建一个平面的预加载列表肯定会有所帮助。

### noopener
在 `<a>`、`<area>`、`<form>` 元素上有效，在打开不受信任的链接时确保它们不能通过 `window.opener` 属性篡改原始文档。目前除了 IE 都已默认。与 `window.open(url, 'OpenNewWindow', 'noopener')` 功能相同。

### opener
在 `<a>`、`<area>`、`<form>` 元素上有效，在打开链接时恢复对 `window.opener` 属性的引用。

### noreferrer
在 `<a>`、`<area>`、`<form>` 元素上有效，阻止浏览器导航到另一个页面时，通过 `Referer：HTTP header` 请求头将该页面地址或任何其他值作为 `Referrer` 发送。与 `window.open(url, 'OpenNewWindow', 'noreferrer')` 功能相同。

### preconnect
在 `<link>` 元素上有效，表示预连接，作用是告知浏览器提前连接链接地址对应站点，不过只是连接，并不会公开任何私人信息或者下载任何内容。好处是打开链接内容的时候可以更快的获取（节约了 DNS 查询、重定向以及指向处理用户请求的最终服务器的若干往返）。

### prefetch
在 `<link>` 元素上有效，表示预获取将在下一次导航/页面加载中使用的资源，例如搜索结果列表中首个产品的详情页面或搜索分页内容的下一页，`prefetch` 获取页面并不会加载页面中的 css 和 js 资源，而是加载页面本身。`prefetch` 比 `preload` 的优先级低——因为当前页面比下一个页面更重要。

### preload
在 `<link>` 元素上有效，表示预加载，通常是一些静态资源（字体、图片、样式或脚本），因为这些资源通常隐藏在 CSS 文件中，有时甚至有好几级。在这种情况下，浏览器必须等待多次往返才能发现它需要获取一个大字体文件，而它本可以利用这段时间开始下载并利用完整的连接带宽。

`preload` 及其等效的 HTTP 标头提供了一种简单的声明性方式，在浏览器需要资源之前提前声明式请求资源。当浏览器遇到 `preload` 时，它就会开始为资源进行高优先级下载，因此在实际需要它时它已经被获取或部分存在。

需要同时设置 `as` 属性中的资源类型（这是内容安全策略和设置正确的 `Accept` 请求标头所必需的）来指定要预加载的内容类型，这样可以使浏览器：
- 更准确地优先加载资源。
- 存储在缓存中以供将来的请求使用，并在适当的情况下重用资源。
- 将正确的内容安全策略应用于资源。
- 为其设置正确的 `Accept` 请求标头。
```html
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="main.js" as="script">
```
可以预加载许多不同的内容类型，可能的 `as` 属性值是：
- audio：音频文件，通常用于 `<audio>`。
- document: 由 `<frame>` 或 `<iframe>` 嵌入的 HTML 文档。
- embed：要嵌入到 `<embed>` 元素中的资源。
- fetch：要通过 fetch 或 XHR 请求访问的资源，例如 ArrayBuffer 或 JSON 文件。
- font: CSS @font-face 字体文件。
- image： 图像文件。
- object：要嵌入到 `<object>` 元素中的资源。
- script: JavaScript 文件。
- style: CSS 样式表。
- track: WebVTT 文件。
- worker：一个 web worker 或 shared worker。
- video：视频文件，通常用于 `<video>`。

还可以同时指定一个 `type` 属性，该属性包含元素指向的资源的 MIME 类型。这在预加载资源时特别有用——浏览器将使用 `type` 属性值来确定它是否支持该资源，如果支持则会下载它，如果不支持则忽略它，这样可以在浏览器不支持的情况下不必要地预加载它。

### prerender
在 `<link>` 元素上有效，表示预渲染，在后台呈现指定的网页，如果用户导航到该网页，则可以加快其加载速度。
> 由于可能浪费用户带宽，Chrome 使用 [`NoState Prefetch`](https://developer.chrome.com/blog/nostate-prefetch/) 替代 `prerender`——它和 `prerender` 一样提前获取资源；但它不会执行 JavaScript 或提前渲染页面的任何部分。`NoState Prefetch` 的目标是使用比预渲染更少的内存，同时仍然减少页面加载时间。

### shortlink
在 `<link>` 元素上有效，给出当前页面对应的短链接，这样分享链接的时候要更容易。

### stylesheet
最常用，在 `<link>` 元素上有效，定义要用作样式表的外部资源。

### tag
在 `<a>`、`<area>` 元素上有效，定义适用于当前文档的标签的链接，这样 SEO 会更加精准，质量更高。

## 参考资料
[HTML rel属性值释义大全](https://www.zhangxinxu.com/wordpress/2019/06/html-a-link-rel/)