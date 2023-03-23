---
date: 16:29 2023/3/23
title: CSS 块级格式上下文（BFC）和 flow-root 布局
tags:
- CSS
description: 无论是内联元素，还是原本就是块级元素，在应用 display:flow-root 声明后，都会变成块级元素，同时这个元素将创建一个新的 BFC，而不会产生任何其他潜在的问题副作用。
---
## 块级格式上下文（BFC）
块格式化上下文（Block Formatting Context，BFC）是 Web 页面的可视 CSS 渲染的一部分，是块级盒子的布局过程发生的区域，也是浮动元素与其他元素交互的区域。

下列方式会创建块级格式化上下文：
- 根元素（`<html>`，也称为初始块格式上下文）。
- 浮动元素（`float` 值不为 `none`）。
- 绝对定位元素（`position` 值为 `absolute` 或 `fixed`）。
- 行内块元素（`display` 值为 `inline-block`）。
- 表格单元格（`display` 值为 `table-cell`，HTML 表格单元格默认值）。
- 表格标题（`display` 值为 `table-caption`，HTML 表格标题默认值）。
- 匿名表格单元格元素（`display` 值为 `table`、`table-row`、`table-row-group`、`table-header-group`、`table-footer-group`（分别是 HTML 元素 `table`、`tr`、`tbody`、`thead`、`tfoot` 的默认值）或 `inline-table`）。
- `overflow` 值不为 `visible`、`clip` 的块元素。
- **`display` 值为 `flow-root` 的元素**。
- `contain` 值为 `layout`、`content` 或 `paint` 的元素。
- 弹性元素（`display` 值为 `flex` 或 `inline-flex` 元素的直接子元素），而它们本身不是 `flex`、`grid` 或 `table` 容器。
- 网格元素（`display` 值为 `grid` 或 `inline-grid` 元素的直接子元素），而它们本身不是 `flex`、`grid` 或 `table` 容器。
- 多列容器（`column-count` 或 `column-width` 值不为 `auto`，包括 `column-count` 为 1）
- `column-span` 值为 `all` 的元素始终会创建一个新的 BFC，即使该元素没有包裹在一个多列容器中。

> 脱离常规流的元素：
> - floated items（浮动的元素）。
> - `position` 属性为 `absolute` 或者 `fixed` 的元素。
> - 根元素（`html`）。
> 
> 脱离常规流的元素会创建一个新的块级格式化上下文环境，其中包含的所有元素构成了一个小的布局环境，与页面中的其他内容分隔开来。而根元素，作为页面中所有内容的容器，自身脱离常规流，为整个文档创建了一个块级格式化上下文环境。

下面的示例中，`<div>` 中有一个浮动元素，该 `div` 的内容与浮动元素一起浮动。由于 `float` 的内容比它旁边的内容高，所以现在 `div` 贯穿了浮动元素。浮动元素已脱离文档流，因此 `div` 的背景和边框仅包含内容，而不包含浮动元素。

<iframe src="https://code.juejin.cn/pen/7151036137736241183"></iframe>

而如果我们在容器元素上创建一个新的 BFC，则容器将包含该浮动元素。在过去的典型方法是设置 `overflow: auto`（或设置其他不是 `overflow: visible` 的值），将自动创建包含浮动元素的新 BFC。

<iframe src="https://code.juejin.cn/pen/7151036888839634958"></iframe>

设置 `overflow: auto` 后，`div` 容器变成了一个迷你布局，所有子元素都将包含在其中。
1. 但是，`overflow` 属性本是用来如何处理溢出的内容，如果仅仅使用此属性创建新的 BFC，在某些情况下会产生不必要的滚动条或剪切阴影。
2. 另外，对于其他开发人员来说，它可能不太可读，因为不能显式地表明为什么要使用溢出来实现这一目的。如果使用了这个方法，最好对代码进行注释以便他人理解。

## flow-root 布局
下面我们使用新的 CSS 属性 `display: flow-root` 来显式创建 BFC。无论是内联元素，还是原本就是块级元素，在应用 `display:flow-root` 声明后，都会变成块级元素，同时这个元素将创建一个新的 BFC，而不会产生任何其他潜在的问题副作用。

<iframe src="https://code.juejin.cn/pen/7151040729567985672"></iframe>

给 `<div>` 元素设置 `display: flow-root` 属性后，`<div>` 中的所有内容都会参与该容器的 BFC，并且浮动的内容不会从底部溢出。可以从 `flow-root` 这个值的名字上看出来，它创建一个新的用于流式布局的上下文，表现类似于文档的根元素（`html`）。

## BFC 的其他作用
1. BFC 除了可以用来布局之外，还有清除浮动的作用。下面这个例子，`<p>` 元素设置了 `outline` 轮廓，由于内部的 `img` 元素浮动，容器的 `outline` 轮廓都合并在了一起。给 `<p>` 元素设置 `display:flow-root` 或 `overflow: auto` 后，内部元素浮动导致容器元素轮廓合并、高度塌陷的问题就不存在了。

<iframe src="https://code.juejin.cn/pen/7151049062857637896"></iframe>

2. 创建新的 BFC 还可以避免两个相邻的元素之间外边距折叠（合并）。下面例子中，第一个 `div` 的 `p` 元素的 `margin`  属性被合并了，所以 `margin` 属性不能被应用。而下面的 `div`，因为设置了 d`isplay:flow-root`，所以 `p` 元素的 `margin`  属性不会被合并。

<iframe src="https://code.juejin.cn/pen/7151052144139829263"></iframe>

## 参考资料
- [快速了解CSS display:flow-root声明](https://www.zhangxinxu.com/wordpress/2020/05/css-display-flow-root/)