---
date: 12:55 2023/3/23
title: CSS contain 属性和新特性容器查询
tags:
- CSS
description: 媒体查询可以根据视口的大小来更改文档布局，然而很多组件并不总是与视口的大小有关，而是与组件在布局中的放置位置有关。
---
## 介绍
媒体查询可以根据视口的大小来更改文档布局，然而很多组件并不总是与视口的大小有关，而是与组件在布局中的放置位置有关。

容器查询可以在不改变浏览器视口宽度的前提下，根据容器中的空间大小进行布局调整。

容器查询规范将成为 [CSS Containment](#CSS-Containment) 的一部分，它为 Web 开发人员提供了一种隔离 DOM 部分并向浏览器声明它们独立于文档其余部分的方法以允许性能优化。

## 容器查询属性
### container-type
将元素定义为查询容器。后代可以查询其大小、布局、样式和状态等方面。可以具有以下值：
- size
    - 为块和内联轴上的维度查询建立查询容器。将布局、样式和大小包含应用于元素。
- inline-size
    - 为容器的内联轴上的维度查询建立查询容器。将布局、样式和内联大小包含应用于元素。
- block-size
    - 在容器的块轴上建立维度查询的查询容器。将布局、样式和块大小包含应用于元素。
- style
    - 为样式查询建立查询容器。
- state
    - 为状态查询建立查询容器。

### container-name
指定 @container 规则的查询容器名称列表，用于过滤目标查询容器。同 grid-area 一样，是一个 `<custom-ident>` 类型（用户自定义字符串标识符）。例如以下定义：
```css
.sidebar {
  container-type: inline-size;
  container-name: sidebar;
}
```
然后，可以通过将名称添加到容器查询中来仅定位该查询容器：
```css
@container sidebar (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 2fr 1fr;
  }
}
```

### container
container-name / container-type 的组合简写形式。

## 示例
以下组件在容器有剩余空间时将显示为两列，如果没有剩余空间将堆叠显示。

![balloon.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/313591169ef94fcbb29adcd29601b88e~tplv-k3u1fbpfcp-watermark.image?)

---
<iframe src="https://code.juejin.cn/pen/7145378595756572680"></iframe>

## <a id="CSS-Containment" href="#">CSS Containment</a>
该规范的定义只有一个属性：contain，它的值表明你想用何种方式控制其 containment，使浏览器在重新计算布局、样式、绘图、大小或它们的任意组合时，只影响到有限的 DOM 区域，而不是整个页面。

### 作用
1. CSS Containment 允许开发者将某些子树从页面中独立出来，在包含大量独立组件的页面时非常实用，它可以防止某个小部件的 CSS 规则改变对页面上的其他东西造成影响。
2. 节点的独立性对于开发者来说，是事先知道的。但浏览器却不能够从你的内容里推测出哪些部分会是独立的。因此，通过 CSS 让浏览器知道这一点，浏览器就可以通过这个信息来进行一些可观的性能优化。

### 使用
大多数的网页都包含了一些独立于网页中其他部分的区块。比如一个包含文章标题和内容的列表，如下：
```html
<h1>My blog</h1>
<article>
  <h2>Heading of a nice article</h2>
  <p>Content here.</p>
</article>
<article>
  <h2>Another heading of another article</h2>
  <p>More content here.</p>
</article>
```
在这个页面中，每个 article 都独立于其他的 article，通过设置 contain: content（contain: layout paint 的缩写），可以告诉浏览器这些节点相互独立，该节点内部的渲染和排版完全独立于外部的其他内容，并且所有的内容渲染都只限定在其节点边界内部，溢出的部分不会显示。当新的内容被加入到该节点中时，浏览器就知道不用重排和重绘节点以外的页面内容。如果 `<article>` 设置了其 CSS 属性能让其大小根据其内容改变（比如 height: auto），浏览器依旧会进行其大小的计算。
```css
article {
  contain: content;
}
```

#### Layout containment
布局的影响通常是整个页面的，比如你移动了某个节点，不论你是把它移动到哪儿，浏览器都会重新计算整个页面的布局。通过使用 contain: layout 你可以告诉浏览器，它只会影响到该节点内部的布局，所有内部的改变都不会影响外部页面的布局，这个容器建立了一个独立的格式化上下文。
```css
article {
  contain: layout;
}
```
> 注意：
> - float 布局会独立存在。
> - 布局边界不会存在边距塌陷。
> - 该布局容器会成为 absolute/fixed 定位的。
> - 容器会创建一个栈式上下文，因此可以使用 z-index。

#### Paint containment
表示这个元素的后代元素不会在它的边界外显示。如果一个元素在视窗外或因其他原因导致不可见，则它的子孙节点也同样不会被显示。如果后代元素溢出包含元素的边界，那么该后代元素将被裁剪到包含元素的边框。
```css
article {
  contain: paint;
}
```

#### Size containment
元素的子元素的大小不会影响元素本身的大小——它的大小被计算为忽略子元素时的大小，好像它没有子元素一样。
```css
article {
  contain: size|inline-size;
}
```
> 注意：
> - size 和 inline-size（内联大小）不能同时使用。
> - 使用该值需要指定已应用此元素的元素的大小，如果你不手动给它一个大小，它在大多数情况下最终会是零大小。

#### Style containment
该值并不提供像 Shadow DOM那样的作用域样式。主要用例是防止在元素中更改 CSS 计数器的情况，使用 contain: style 将确保 counter-increment 和 counter-set 属性创建仅限于该子树的新计数器。

#### 特殊值
1. contain: content 相当于同时开启 layout 和 paint。
2. contain: strict 将获得尽可能多的包含，其行为与 contain: size layout paint 相同。

### 示例
1. 下面的标记由两篇文章组成，每篇文章都有内容和图像，并且图像是浮动的：
```html
<h1>My blog</h1>
<article>
  <h2>Heading of a nice article</h2>
  <p>Content here.</p>
</article>
<article>
  <h2>Another heading of another article</h2>
  <img src="graphic.jpg" alt="photo" />
  <p>More content here.</p>
</article>
```
```css
img {
  float: left;
}
```
这会存在一个问题，因为浮动元素的布局超出了文章的底部，DOM 树的很大一部分会被重新布局或重新绘制，第一篇文章的图片最终出现在第二篇文章的区域内。

<iframe src="https://code.juejin.cn/pen/7145365254372294697"></iframe>

如果我们给每个 article 属性 contain 赋值 content，当插入新元素时，浏览器只需要重新计算包含元素的子树，而不需要重新计算它之外的任何东西。这也意味着第一个图像不再浮动到第二个文章，而是停留在其包含元素的边界内。
```css
article {
  contain: content;
}
```
<iframe src="https://code.juejin.cn/pen/7145367185559388191"></iframe>

2. 对于 CSS 计数器，contain: style 使 counter-increment 和 counter-reset 被限定为元素的子树，并且计数器会恢复到 1。

<iframe src="https://code.juejin.cn/pen/7145368299033853955"></iframe>

3. 想象一下，如果 DOM 树具有非常复杂的结构和内容，但只有一小部分页面被修改，我们就可以将其与页面的其余部分隔离开来，帮助改善性能。在一个有 10,000 个元素的页面上，如果单个元素发生了 DOM 变化，Chromium 也会在布局上花费大量时间，因为它会遍历整个 DOM 树（10,000 个元素）。如果我们在每个元素上使用了样式 contain: strict，浏览器就不需要在其内部发生变化时检查其他元素节点。要注意的是，如果内容溢出，元素节点会被剪裁，而如果没有为元素节点设置固定大小，它将被呈现为一个空框。

<iframe src="https://code.juejin.cn/pen/7146072936703590439"></iframe>
