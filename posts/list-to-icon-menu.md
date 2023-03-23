---
date: 18:41 2023/3/23
title: 将列表转化为一个带图标的可折叠/展开的菜单
tags:
- CSS
- HTML
- JS
description: 将一个无序列表转化为一个带图标的可折叠/展开的菜单。可以使用 Web Component、使用 details 和 summary 配合 ::marker 伪元素、使用 checkbox 和 label 标签这几种方式。
---
## 介绍
将一个无序列表转化为一个带图标的可折叠/展开的菜单。下面是三种实现方法。

## 使用 Web Components
1. 首先使用 `customElements.define()` 方法注册一个元素。
```js
customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
```
第三个参数是一个包含 `extends` 属性的配置对象，指定了所创建的元素继承自哪个内置元素，可以继承任何内置元素。

2. 然后，定义这个元素的实现类 `ExpandingList`，并继承 `HTMLUListElement`。
```js
class ExpandingList extends HTMLUListElement {
  constructor() {
    self = super();
    self.querySelectorAll('li').forEach(li => {
      if (li.querySelector('ul')) {
        li.setAttribute('class', 'closed');
        const { firstChild } = li;
        // 使用 span 替换 li 节点文本，并绑定事件
        const newSpan = document.createElement('span');
        newSpan.textContent = firstChild.textContent;
        newSpan.onclick = self.showul;
        firstChild.replaceWith(newSpan);
      }
    });
  }
  // 折叠/展开菜单
  showul(e) {
    const nextul = e.target.nextElementSibling;
    if (nextul.style.display == 'block') {
      nextul.style.display = 'none';
      nextul.parentNode.setAttribute('class', 'closed');
    } else {
      nextul.style.display = 'block';
      nextul.parentNode.setAttribute('class', 'open');
    }
  };
}
```

3. 在页面上使用 `<ul>` 标签，通过 `is` 属性指定这个自定义内置元素的名称。
```html
<ul is="expanding-list">
</ul>
```
`is` 全局属性是一种使用 Web 组件的方法，是将自定义元素（实现了 Web 组件逻辑）插入页面的另一种方式。
- 不是使用自定义元素的名称作为 HTML 标记，而是将名称传递给内置 HTML 元素。
- 如果 Web 组件没有在页面上注册，该组件仍可以退回到标准 HTML 元素行为。

<iframe src="https://code.juejin.cn/pen/7156825074647957518"></iframe>

## 使用 details 和 summary 标签配合 ::marker 伪元素
- `<details>` 元素可创建一个部件，仅在被切换成展开状态时，它才会显示内含的信息。
- `<summary>` 元素可为 `<details>` 部件提供显示的标题信息。默认标题信息左边会有一个小三角形图标。
- `::marker` CSS 伪元素可为设置了 `display: list-item` 的元素或伪元素上定义样式，例如 `<li>` 和 `<summary>`，它们通常含有一个项目符号或者数字。但是，目前只能使用某些 CSS 属性：
    - 所有字体属性
    - white-space
    - color
    - text-combine-upright, unicode-bidi, direction
    - content
    - 所有 animation 和 transition 属性

<iframe src="https://code.juejin.cn/pen/7156829659248721951"></iframe>

## 使用 input checkbox 和 label 标签
使用单选框以及复选框自带的一些特性，然后配合 CSS 一些特殊的选择器，可以在不使用任何 JavaScript 代码情况下实现元素的显示隐藏、多级下拉列表、选项卡切换效果等。目前兼容性最好。

<iframe src="https://code.juejin.cn/pen/7156830830696857630"></iframe>

## 浏览器支持
目前，Safari 浏览器对前两种方法都不支持。

![developer.mozilla.org_zh-CN_docs_Web_HTML_Global_attributes_is.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/800ea9a32ac745acb81e29c3a2abac61~tplv-k3u1fbpfcp-watermark.image?)

![marker.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/96bf2c92f9524f8780d22ea77ef580d3~tplv-k3u1fbpfcp-watermark.image?)

## 参考资料
- [CSS radio/checkbox单复选框元素显隐技术](https://www.zhangxinxu.com/wordpress/2012/01/css-css3-selector-element-display-tab-listdown/)