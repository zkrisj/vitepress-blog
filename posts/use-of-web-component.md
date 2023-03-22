---
date: 22:54 2023/3/22
title: Web Components 的使用
tags:
- JS
description: Vue、React 等前端框架的核心特性就是数据绑定和组件复用。而现在浏览器已经实现了自己的 Web Components API，允许创建可重用的定制元素，并且在 web 应用中使用它们。
---
## 介绍
Vue、React 等前端框架的核心特性就是数据绑定和组件复用。而现在浏览器已经实现了自己的 Web Components API，允许创建可重用的定制元素，并且在 web 应用中使用它们。

## 接口和 CSS 属性
window.customElements
返回 CustomElementRegistry 对象的引用，用来注册和查询已注册自定义元素。

customElements.define(name, constructor, options);
没有返回值。
- name，自定义元素名，自定义元素的名称必须包含连词线，用以区别原生的 HTML 元素。
- constructor，自定义元素构造器。
- options 可选，控制元素如何定义。目前有一个选项支持：
    - extends 指定继承的已创建的元素。被用于创建自定义元素。

### 定义在自定义元素的类定义中的生命周期回调函数
- `connectedCallback`：当自定义元素第一次被连接到文档 DOM 时被调用。
- `disconnectedCallback`：当自定义元素与文档 DOM 断开连接时被调用。
- `adoptedCallback`：当自定义元素被移动到新文档时被调用。
- `attributeChangedCallback`：当自定义元素的一个属性被增加、移除或更改时被调用。

### 与自定义元素特别相关的伪类
- :defined：匹配任何已定义的元素，包括内置元素和使用 CustomElementRegistry.define() 定义的自定义元素。
- :host：选择 shadow DOM 的 shadow host，内容是它内部使用的 CSS（containing the CSS it is used inside）。
- :host()：选择 shadow DOM 的 shadow host，内容是它内部使用的 CSS（这样您可以从 shadow DOM 内部选择自定义元素）— 但只匹配给定方法的选择器的 shadow host 元素。
- :host-context(): 选择 shadow DOM 的 shadow host，内容是它内部使用的 CSS（这样您可以从 shadow DOM 内部选择自定义元素）— 但只匹配给定方法的选择器匹配元素的子 shadow host 元素。

### slots 相关的伪元素
- ::slotted：匹配任何已经插入一个 slot 的内容。

### shadow DOM
将一个隐藏的、独立的 DOM 附加到一个元素上，从而将标记结构、样式和行为隐藏起来，并与页面上的其他代码相隔离，保证不同的部分不会混在一起，可使代码更加干净、整洁。

### custom elements 类型
1. 不继承其他内建的 HTML 元素。直接把它们写成 HTML 标签的形式，来在页面上使用。例如 `<popup-info>`，或者是 `document.createElement("popup-info")`。
2. 继承自基本的 HTML 元素。在创建时，必须指定所需扩展的元素；使用时，需要先写出基本的元素标签，并通过 is 属性指定 custom element 的名称。例如 `<p is="word-count">`, 或者 `document.createElement("p", { is: "word-count" })`。

## 使用
1. 创建一个类或函数来指定 web 组件的功能，并继承 `HTMLElement`（或子类）。
2. 使用 `<template>` 和 `<slot>` 定义一个 HTML 模板。
3. 使用 `customElements.define(name, constructor, options)` 方法注册自定义元素 ，并向其传递要定义的元素名称、指定元素功能的类、以及可选的其所继承自的元素。
4. 使用 `Element.attachShadow()` 方法获取 shadow DOM，使用通常的 DOM 方法向 shadow DOM 中添加子元素、事件监听器等。

## 示例
<iframe src="https://code.juejin.cn/pen/7134948258882781184"></iframe>

引用资料：
1. [如何基于 WebComponents 封装 UI 组件库](https://juejin.cn/post/7096265630466670606)
2. [Web Components 入门实例教程](https://www.ruanyifeng.com/blog/2019/08/web_components.html)
3. [HTML slot 插槽元素深入](https://www.zhangxinxu.com/wordpress/2021/09/html-slot-dom/)
