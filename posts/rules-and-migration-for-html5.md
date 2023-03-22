---
date: 22:44 2023/3/22
title: HTML5 的规则和迁移
tags:
- HTML
description: HTML5 提供的新元素和新的 API 简化了 web 应用程序的搭建。
---
## 介绍
- [x] HTML5 是专门为承载丰富的 web 内容而设计的，并且无需额外插件。
- [x] HTML5 拥有新的语义、图形以及多媒体元素。
- [x] HTML5 提供的新元素和新的 API 简化了 web 应用程序的搭建。
- [x] HTML5 是跨平台的，被设计为在不同类型的硬件（PC、平板、手机、电视机等等）之上运行。

## 迁移
| 典型的 HTML4         |典型的 HTML5 |
| -------------------- | ----------- |
| `<div id="header">`  | `<header>`  |
| `<div id="menu">`    | `<nav>`     |
| `<div id="content">` | `<section>` |
| `<div id="post">`    | `<article>` |
| `<div id="footer">`  | `<footer>`  |

![ct_sem_elements.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecc6c3bfda724e3192a1461cb48ac185~tplv-k3u1fbpfcp-watermark.image?)

> 1. 非语义元素：`<div>` 和 `<span>` - 无法提供关于其内容的信息。
> 2. 语义元素：`<form>`、`<table>` 以及 `<img>` - 清楚地向浏览器和开发者描述其意义。
> 3. `<section>` 元素表示有主题的内容组，一般来说会包含一个标题。一般通过是否包含一个标题 `<h1>-<h6>` 作为子节点来辨识每一个 `<section>`。
> 4. `<article>` 元素表示独立的或可复用的结构。例如论坛帖子、杂志或新闻文章、评论、交互式组件。
> 5. `<figure>` 元素表示独立的流内容（图像、图表、照片、代码等等）。与 `<figcaption>` 配合使用（在 `<figure>` 块里是第一个或最后一个）。

## 规则
1. `<!DOCTYPE html>` 确保浏览器按照最佳的相关规范进行渲染。
2. `<html lang="zh-CN">` 有利于可访问性和搜索引擎，有助于本地化内容。
3. 可以省略 `<html>`，`<head>` 和 `<body>` 标签（省略 `<body>` 会在老式浏览器（IE9）中产生错误）。
4. `<meta charset="utf-8">` 定义文档的字符集，确保恰当的解释，以及正确的搜索引擎索引。
5. `<meta name="viewport" content="width=device-width, initial-scale=1">` 更好地在移动设备上运行。
6. 设置有意义的标题，`<title>HTML5 Syntax and Coding Style</title>`。
7. 链接样式表和加载外部脚本时可省略 `type` 属性。
8. 不要完整地写出布尔属性，可以只写属性名来设置它。例如 `required`。
9. 属性值使用双引号，而不是单引号。例如 `class="nice"`。
10. 使用连字符分隔多个单词，不要使用驼峰式。例如 `class="editorial-summary"`。
11. 使用文字字符代替实体引用（仍然需要转义尖括号和引号等字符）。例如字符 `©` 对应实体 `&copy;`。
12. 不要为空元素包含 XHTML 样式的尾部斜杠，因为它们是不必要的并且会减慢速度。例如 `<hr />`。
13. 对所有元素名称和属性名称/值使用小写，因为它看起来更整洁。
14. 为了提高可读性，使用两个空格的缩进代替 `TAB`。
15. 在逗号或分号之后添加空格，是所有书写类型的通用规则。

## 示例

```html
<!DOCTYPE html>
<html lang="en">
<title>HTML</title>
<meta charset="utf-8">

<!--[if lt IE 9]>
<script src="http://cdn.static.runoob.com/libs/html5shiv/3.7/html5shiv.min.js"></script>
<![endif]-->

<style>
body {
    font-family:Verdana,sans-serif;font-size:0.8em;
}
header,footer,section,article {
    border:1px solid grey;
    margin:5px;margin-bottom:15px;padding:8px;
    background-color:white;
}
header,footer {
    color:white;background-color:#444;margin-bottom:5px;
}
section {
    background-color:#ddd;
}
nav ul  {
    margin:0;padding:0;
}
nav ul li {
    display:inline; margin:5px;
}
</style>

<body>

<header>
<h1>Monday Times</h1>
</header>

<nav>
<ul>
  <li>News</li>
  <li>Sports</li>
  <li>Weather</li>
</ul>
</nav>

<section>
<h2>News Section</h2>

<article>
<h2>News Article</h2>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
</article>

<article>
<h2>News Article</h2>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
<p>Ipsum lurum hurum turum ipsum lurum hurum turum
ipsum lurum hurum turum ipsum lurum hurum turum.</p>
</article>

</section>

<footer>
<p>© 2014 Monday Times. All rights reserved.</p>
</footer>

</body>
</html>
```
<iframe src="https://code.juejin.cn/pen/7134520346480705572"></iframe>
