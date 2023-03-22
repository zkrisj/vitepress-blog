---
date: 21:54 2023/3/22
title: 如何使用 meta 标签
tags:
- HTML
description: meta 标签的属性定义了与文档相关联的名称/值对，元数据总是以名称/值的形式被成对传递的。
---
## 介绍
`<meta>` 元素用来表示不能由其它 `HTML` 元相关（meta-related）元素（(`<base>`、`<link>`、`<script>`、`<style>` 或 `<title>`）之一表示的数据信息，元素标签内不包含任何内容。

具有不同属性的多个 `<meta>` 元素可以在同一页面上使用。`<meta>` 元素内容不会显示在页面上，但是对于机器是可读的，可用于模拟 `HTTP` 响应头字段的使用，页面描述、关键字用于搜索引擎优化，或其他 `web` 服务。

## 属性
`<meta>` 标签的属性定义了与文档相关联的名称/值对，元数据总是以名称/值的形式被成对传递的。

对于 **HTML 4.01** 和 **XHTML 1.0**，有四个有效的属性：`content`、`http-equiv`、`name` 和 `scheme`。在 **HTML 5** 下，现在有五个有效的属性，添加了 `charset`。`http-equiv` 用于模拟 HTTP 标题，并用 `name` 来嵌入元数据。无论哪种情况，语句的值都包含在 `content` 属性中，除非给出 `charset`，否则这是唯一必需的属性。

`<meta>` 标签通常位于 `<head>` 区域内，但在 **HTML5** 中不再需要 `<head>` 标签。

属性 | 值 | 描述
-- | -- | --
charset| character_set| 规定 HTML 文档的字符编码。
content| text| 定义与 http-equiv 或 name 属性相关的元信息。
http-equiv| content-security-policy<br>content-type<br>default-style<br>refresh| 把 content 属性关联到 HTTP 头部。
name| application-name<br>author<br>description<br>generator<br>keywords<br>viewport| 把 content 属性关联到一个名称。
scheme|	format/URI| 定义用于翻译 content 属性值的格式。

### name 属性
`name` 属性提供了名称/值对中的名称。HTML 和 XHTML 标签都没有指定任何预先定义的 `<meta>` 名称。通常情况下，您可以自由使用对自己和源文档的读者来说富有意义的名称。

`keywords` 是一个经常被用到的名称。它为文档定义了一组关键字。某些搜索引擎在遇到这些关键字时，会用这些关键字对文档进行分类。

类似这样的 `meta` 标签可能对于进入搜索引擎的索引有帮助：
```html
<meta name="keywords" content="HTML,ASP,PHP,SQL">
```
如果没有提供 `name` 属性，那么名称/值对中的名称会采用 `http-equiv` 属性的值。
### http-equiv 属性
`http-equiv` 属性为名称/值对提供了名称。并指示服务器在发送实际的文档之前先在要传送给浏览器的 `MIME` 文档头部包含名称/值对。

当服务器向浏览器发送文档时，会先发送许多名称/值对。虽然有些服务器会发送许多这种名称/值对，但是所有服务器都至少要发送一个：`content-type:text/html`。这将告诉浏览器准备接受一个 `HTML` 文档。

使用带有 `http-equiv` 属性的 `<meta>` 标签时，服务器将把名称/值对添加到发送给浏览器的内容头部。例如，添加：
```html
<meta http-equiv="expires" content="31 Dec 2008">
```
这样发送到浏览器的头部就应该包含：
```
content-type: text/html
charset:iso-8859-1
expires:31 Dec 2008
```
当然，只有浏览器可以接受这些附加的头部字段，并能以适当的方式使用它们时，这些字段才有意义。
### content 属性
`content` 属性提供了名称/值对中的值。该值可以是任何有效的字符串。

`content` 属性始终要和 `name` 属性或 `http-equiv` 属性一起使用。
### scheme 属性
`scheme` 属性用于指定要用来翻译属性值的方案。此方案应该在由 `<head>` 标签的 `profile` 属性指定的概况文件中进行了定义。

## HTML 4.01 与 HTML5之间的差异
在 **HTML5** 中，有一个新的 `charset` 属性，它使字符集的定义更加容易：
- HTML 4.01：`<meta http-equiv="content-type" content="text/html; charset=UTF-8">`
- HTML5：`<meta charset="UTF-8">`

## 示例
1. 定义创作者和修改信息：
```html
<meta name="author" content="Chris Mills">

<meta name="revised" content="David Yang,8/1/07">
```
2. 定义文档关键词和页面描述，用于搜索引擎：
```html
<meta name="description" content="HTML examples">

<meta name="keywords" content="HTML, CSS, XML, XHTML, JavaScript">
```
3. 下面示例演示 3 秒后，重定向到另外一个地址，如果 `url` 为空则会刷新当前网页：
```html
<meta http-equiv="refresh" content="3;url=https://www.baidu.com">
```
4. 在文档级别上设置浅色模式与深色模式的工作方式与 CSS `color-scheme` 属性允许单个元素指定其首选和接受的配色方案相同：
```html
<meta name="color-scheme" content="dark light">
```
5. 为当前页面定义内容策略，例如，已经存在的一个网站，用了太多内联代码修复问题，而且想确保资源（如图片、字体、脚本等）只从 `https` 加载，并且禁止插件：
```html
<meta http-equiv="Content-Security-Policy" content="default-src https: 'unsafe-eval' 'unsafe-inline'; object-src 'none'">
```
6. 微前端需要按功能拆分多个子应用，主应用在加载的过程中经常出现加载失败的问题。因为 `https` 地址中，如果加载了 `http` 资源，浏览器将认为这是不安全的资源，将会默认阻止。后来在文档中添加了以下 `<meta>` 标签完美解决：
```html
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
```
7. 禁止浏览器从本地机的缓存中调阅页面内容，设定后，一旦离开网页就无法从 Cache 中再调出：
```html
<meta http-equiv="Pragma" content="no-cache">
```
8. 定义搜索引擎机器人(不包括恶意爬虫)对此页面的处理行为：
```html
<meta name="robots" content="index,follow">
```
> - `index`：允许机器人索引此页面（默认）。
> - `follow`：允许机器人跟随此页面上的链接（默认）。
> - `noindex`：要求机器人不索引此页面。
> - `nofollow`：要求机器人不跟随此页面上的链接。
> - `all`：与 index, follow 相同。
> - `none`：与 noindex, nofollow 相同。
> - `noarchive`：要求搜索引擎不缓存页面内容。
> - `nocache`：noarchive 的替代名称。
> - `nosnippet`：防止在搜索引擎结果中显示页面的任何描述。
> - `noimageindex`：要求此页面不显示为图片索引的引用页面。
9. 典型的移动优化网站会设置 `<meta>` 标签视口宽度等于屏幕宽度，这样可以避免当视口宽度大于屏幕宽度时，出现横向滚动条：
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```
> `<meta>` 标签的 `viewport` 的属性包括：
> - `width`：视口的宽度，可以设置为特殊值 `device-width`，数字（1-10000），或 `100vw`, `100%` 这样的有效值。负值：忽略。
> - `height`：视口的高度，可以设置为特殊值 `device-height`，数字（1-10000），或 `100vh`, `100%` 这样的有效值。负值：忽略。
> - `initial-scale`：控制第一次加载页面时的缩放级别。最小值：0.1。最大值：10。默认值：1。负值：忽略。
> - `minimum-scale`：控制页面上允许的缩小程度。最小值：0.1。最大值：10。默认值：0.1。负值：忽略。
> - `maximum-scale`：控制页面上允许的放大程度。最小值：0.1。最大值：10。默认值：10。负值：忽略。
> - `user-scalable`：控制页面上是否允许放大和缩小操作。有效值：0、1、yes 或 no。默认值：1，与 yes 相同。将该值设置为 0（与否相同），将违反 Web 内容可访问性指南 (WCAG)。

## 引用资料
1. [meta标签到底是做什么的](https://juejin.cn/post/6987919006468407309)
2. [HTML `<meta>` 标签](https://www.w3schools.com/tags/tag_meta.asp)
