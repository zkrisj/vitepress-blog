---
date: 21:25 2023/3/22
title: mouseenter mouseleave mouseover mouseout mousemove 鼠标事件冒泡对比
tags:
- JS
description: mouseenter mouseleave 不会冒泡；而 mouseover mouseout 会冒泡，即从自身元素和子元素上之间移动时也会触发。
---
## 介绍
- mouseenter
当使用定点设备（例如鼠标或触控板）将光标移动到元素上时，会触发 `mouseenter` 事件。
- mouseleave
当使用定点设备（例如鼠标或触控板）将光标移出某个元素时，会触发 `mouseleave` 事件。
- mouseover
当使用定点设备（例如鼠标或触控板）将光标移动到元素或其子元素之一上时，会在元素上触发 `mouseover` 事件。
- mouseout
当使用定点设备（例如鼠标或触控板）将光标移出元素或其子元素之一上时，会在元素上触发 `mouseout` 事件。
- mousemove
当使用定点设备（例如鼠标或触控板）将光标在元素上移动时，`mousemove` 事件被触发（事件冒泡）。

## 冒泡
事件冒泡指将事件定向到其预期的目标的过程：
-   单击按钮并将事件定向到该按钮；
-   如果为该对象设置了事件处理程序，则触发该事件；
-   如果没有为该对象设置事件处理程序，则事件会向上冒泡（就像水中的气泡）到对象的父级；
-   事件从父级冒泡到父级的父级，直到它被处理，或者直到它到达 document 对象为止。

事件是否为冒泡事件可由 event.bubbles 事件属性返回。
-   true - 事件可通过 DOM 冒泡
-   false - 事件不冒泡

```js
<button onclick="console.log(event.bubbles)">点击按钮查看 onclick 事件是否为冒泡事件</button>
```

> `addEventListener` 的第三个参数可以指定一个 `Boolean`，表示冒泡还是捕获，默认 `false`，表示在冒泡阶段执行，为 `true` 则表示在捕获阶段执行。第三个参数也可以指定一个键值选项，例如 `once: true` 表示只执行一次，这时的冒泡和捕获也要用键值 `capture` 表示。

## 示例
<iframe src="https://code.juejin.cn/pen/7126517297048944648"></iframe>

## 总结
鼠标从移入元素到移出，事件执行顺序为：
- 鼠标移入时，先触发 mouseover，再触发 mouseenter，然后 mousemove；
- 鼠标移出时，先触发 mouseout，再触发 mouseleave。

冒泡：
- mouseenter mouseleave 不会冒泡；
- 而 mouseover mouseout 会冒泡，即从自身元素和子元素上之间移动时也会触发。