---
date: 22:25 2023/3/22
title: DocumentFragment 的使用
tags:
- JS
description: DocumentFragment（文档片段），与 document 一样，没有父节点，存储由节点（Node）组成的文档结构。但它不是主 DOM 树的一部分，它的变化不会触发 DOM 树的重新渲染，且不会对性能产生影响。
---
## 介绍
构建渲染树的任何改变都可能导致重绘或回流，例如：
- 添加、删除、更新 `DOM` 节点。
- 使用 `display: none`（回流和重绘）或 `visibility: hidden`（仅重绘，因为没有几何形状发生变化）隐藏 `DOM` 节点。
- `DOM` 节点的移动和动画。
- 添加样式表或调整样式属性。
- 用户操作，例如调整窗口大小、更改字体大小或滚动页面。

以前我们可以使用节点的 `cloneNode()` 方法，在克隆的节点上进行操作，然后再用克隆的节点替换原始节点来优化性能，而现在我们可以使用 `DocumentFragment`。

`DocumentFragment`（文档片段），与 `document` 一样，没有父节点，存储由节点（`Node`）组成的文档结构。但它不是主 `DOM` 树的一部分，它的变化不会触发 `DOM` 树的重新渲染，且不会对性能产生影响。

因为文档片段存在于内存中，并不在 `DOM` 树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来 [更好的性能](https://johnresig.com/blog/dom-documentfragments/)。

## 使用
文档片段接口没有特定属性和方法，都继承自其父接口 `Node`。

最常用的方法是使用 `DocumentFragment` 创建并组成一个 `DOM` 子树，然后将其插入到 `DOM` 中。这种情况下会插入片段的所有子节点，并留下一个空的 `DocumentFragment`。因为所有的节点会被一次插入到文档中，所以仅会发生一个重渲染的操作，而不是每个节点分别被插入到文档中从而发生多次重渲染的操作。

该接口在 `Web` 组件（`Web components`）中也非常有用：`<template>` 元素在其 `HTMLTemplateElement.content` 属性中包含了一个 `DocumentFragment`。

可以使用 `document.createDocumentFragment` 方法或者构造函数 `new DocumentFragment()` 来创建一个空的 `DocumentFragment`。

```js
let fragement = document.createDocumentFragment();
console.log(fragement.nodeName); // #document-fragment
console.log(fragement.nodeType); // 11
console.log(fragement.nodeValue); // null
console.log(fragement.parentNode); // null
fragement.append(document.createElement('p'));
console.log(fragment.childElementCount); // 1
document.body.append(fragement);
console.log(fragment.childElementCount); // 0
```

## 示例
比如，我们要在一个列表中插入 `10000` 个节点：
```html
<button onclick="myFunction()">document</button>
<button onclick="myFunction2()">DocumentFragment</button>
<ul id="ul">
  <li>0</li>
</ul>
```
一个个的插入到 `DOM`，并计算所用时间：
```js
function myFunction() {
  console.time('document');
  for (let i = 1; i <= 10000; i++) {
    const li = document.createElement('li');
    li.textContent = 'document';
    ul.append(li);
  }
  console.timeEnd('document');
}
```
先把所有节点添加到 `DocumentFragment`，然后一次性插入 `DOM`，并计算所用时间：
```js
function myFunction2() {
  const fragment = new DocumentFragment();
  console.time('DocumentFragment');
  for (let i = 1; i <= 10000; i++) {
    const li = document.createElement('li');
    li.textContent = 'DocumentFragment';
    fragment.append(li);
  }
  ul.appendChild(fragment);
  console.timeEnd('DocumentFragment');
}
```
可以看到使用 `DocumentFragment` 在处理大批量 `DOM` 操作时，可以节省很大的性能，在 `DOM` 操作越多时，这种优势越明显。

![4bd237cfc98c4264ba50a5937ded3c37_tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.awebp](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ecaf477fe05c46e7af9b503ca7509b20~tplv-k3u1fbpfcp-watermark.image?)


![02cb8793421b4355bbd7afdb635f068a_tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.awebp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9cb06ca00950472f9d6480decdf8c609~tplv-k3u1fbpfcp-watermark.image?)


![微信截图_20220818125903.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f129cd5fb616496496e08aaee16a461a~tplv-k3u1fbpfcp-watermark.image?)

<iframe src="https://code.juejin.cn/pen/7133071969871724581"></iframe>

## 引用资料：
1. [深入理解DocumentFragment -文档片段](https://juejin.cn/post/6952499015879507982)
2. [网页性能管理详解](https://www.ruanyifeng.com/blog/2015/09/web-page-performance-in-depth.html)
3. [DOM DocumentFragments](https://johnresig.com/blog/dom-documentfragments/)