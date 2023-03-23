---
date: 19:09 2023/3/23
title: 如何在外部修改 Shadow DOM 内部的 CSS 样式
tags:
- CSS
- JS
description: ::part CSS 伪元素表示在 Shadow DOM 中任何匹配 part 属性的元素。只需要在 Shadow DOM 中元素上添加 part 属性，然后在外部使用 ::part 伪元素选择匹配 part 属性的元素改变样式即可。
---
## 介绍
比如，自定义了一个按钮：
```html
<ui-button type="primary">按钮</ui-button>
```
如何在外部修改已定义的 Web Components 的 Shadow DOM 内部样式？下面是两种方法。

## 使用 CSS 变量
在 Shadow DOM 内部使用 CSS 变量定义样式，然后在使用 Web Components 的地方改变 CSS 变量的值即可改变 Shadow DOM 内部样式。
```js
class UiButton extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
      <style>
        button {
          padding: 9px 1em;
          border: 1px solid;
          border-radius: var(--ui-button-radius, 4px);
          background: var(--ui-button-background, #fff);
          color: var(--ui-button-color, #333);
          border-color: var(--ui-border-color, #ccc);
        }
      </style>
      <button part="button">${this.textContent}</button>`;
  }
}
customElements.define('ui-button', UiButton);
```
```css
[type=primary] {
  --ui-button-radius: 1mm;
  --ui-button-background: deepskyblue;
  --ui-button-color: #fff;
  --ui-border-color: lightblue;
}
```
<iframe src="https://code.juejin.cn/pen/7156867580354330654"></iframe>

## 使用 ::part 伪元素
`::part` CSS 伪元素表示在 Shadow DOM 中任何匹配 `part` 属性的元素。只需要在 Shadow DOM 中元素上添加 `part` 属性，然后在外部使用 `::part` 伪元素选择匹配 `part` 属性的元素改变样式即可。
```js
class UiButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' }).innerHTML = `
    <style>
      button {
        padding: 9px 1em;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: #fff;
        color: #333;
      }
    </style>
    <button part="button">${this.textContent}</button>`;
  }
}
customElements.define('ui-button', UiButton);
```
```css
[type=primary]::part(button) {
  border-color: coral;
  background: orangered;
  color: #fff;
}
```
<iframe src="https://code.juejin.cn/pen/7156867596891979813"></iframe>

1. `part` 全局属性包含一个以元素中 `part` 属性名称组成的列表，该列表以空格分隔。
2. 在任意元素（包括 `HTMLUnknownElement`）上，`element.part` 都会返回一个 `DOMTokenList` 对象。所以判断一个元素是否含有 `part` 属性，不能使用 `element.part`，要用 `Element.hasAttribute('part')` 方法。
3. 可以通过 DOM 事件改变 `part` 属性的值，来动态改变伪元素 `::part` 选择的元素的 CSS 样式：

<iframe src="https://code.juejin.cn/pen/7156891626982834206"></iframe>

## 浏览器支持
在安卓手机，苹果手机和 PC 端测试，都可以完全支持，查看到效果。而 is 属性目前只有 Safari 浏览器不支持。

![developer.mozilla.org_en-US_docs_Web_CSS___part.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9297d924aec141cdae3dd1c57c460356~tplv-k3u1fbpfcp-watermark.image?)

![CPT2210211722-617x293.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3268243723554aa7a1b48dc8c0922b36~tplv-k3u1fbpfcp-watermark.image?)