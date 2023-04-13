---
title: 'MouseEvent 鼠标事件详解'
date: 2023-04-13 15:25:34
tags: [JS]
description: 当页面没有滚动时，MouseEvent.clientX 和 MouseEvent.pageX 的值相等。但当页面滚动时，MouseEvent.clientX 的值不变，而 MouseEvent.pageX 的值会随着页面滚动而增加或减少。
---
## 介绍
1. MouseEvent 接口指用户与指针设备（如鼠标）交互时发生的事件。它包含了与鼠标相关的信息，比如鼠标的位置、鼠标键的状态等。
2. 使用此接口的常见事件包括：click、dblclick、mouseup、mousedown、mouseenter、mouseleave、mouseover、mouseout、mousemove 等。
3. 使用 `MouseEvent()` 构造函数创建一个 MouseEvent 对象，使用 `MouseEvent.initMouseEvent()` 方法可以保持向后兼容性。
4. MouseEvent 继承自 UIEvent，UIEvent 接口表示简单的用户界面事件，其后代有：MouseEvent, TouchEvent, FocusEvent, KeyboardEvent, InputEvent, 和 CompositionEvent。
5. 继承自 MouseEvent 的事件有：WheelEvent 和 DragEvent。

## 常用属性
- `clientX` 和 `clientY`: 鼠标事件发生时，鼠标指针相对于浏览器窗口左上角的水平距离和垂直距离。它不受页面滚动的影响，即使页面滚动，它的值也不会改变。
- `pageX` 和 `pageY`: 鼠标事件发生时，鼠标指针相对于整个文档左上角的水平距离和垂直距离。它受页面滚动的影响，即使页面滚动，它的值也会随之改变。
- `screenX` 和 `screenY`：鼠标相对于用户屏幕左上角的水平和垂直坐标。
- `x` 和 `y`：`MouseEvent.clientX` 和 `MouseEvent.clientY` 的别名。
- `offsetX` 和 `offsetY`：触发事件的元素左上角的坐标，取值范围是该元素的左边缘至右边缘。它的值取决于事件的目标元素，即如果鼠标事件发生在一个元素上，那么 `offsetX` 的值就是相对于该元素的左边缘的距离。
- `target`: 触发该事件的 DOM 元素。
- `button`: 鼠标键的状态，`0` 表示左键，`1` 表示中键，`2` 表示右键。
- `altKey`、`ctrlKey` 和 `shiftKey`：分别表示是否按下了 Alt、Ctrl 和 Shift 键。
- `type`: 事件类型，比如 `click`、`mousedown`、`mouseup` 等等。

> 当页面没有滚动时，`MouseEvent.clientX` 和 `MouseEvent.pageX` 的值相等。但当页面滚动时，`MouseEvent.clientX` 的值不变，而 `MouseEvent.pageX` 的值会随着页面滚动而增加或减少。
> 
> 如果需要获得相对于事件目标元素的坐标，应该使用 `MouseEvent.offsetX`。如果需要获得相对于当前窗口的坐标，应该使用 `MouseEvent.clientX`。

## 常用方法
1. `preventDefault()`：阻止事件的默认行为。例如，在链接上单击鼠标时，会跳转到链接指向的地址。如果在单击事件处理程序中调用了 `preventDefault() `方法，则不会跳转到链接地址。
2. `stopPropagation()`：阻止事件进一步传播到其他元素。例如，在一个元素上发生的单击事件可能会传播到该元素的父元素或其他子元素。如果在单击事件处理程序中调用了 `stopPropagation()` 方法，则事件将不会进一步传播。
3. `initMouseEvent()`：初始化一个 `MouseEvent` 对象。这个方法已经被废弃，不再建议使用。取而代之的是，开发人员可以使用 `MouseEvent` 构造函数来创建一个 `MouseEvent` 对象。
4. `getModifierState()`：返回一个布尔值，表示指定的修改键（例如 Shift、Ctrl、Alt 或 Meta）是否被按下。开发人员可以使用这个方法来检查鼠标事件发生时特定的修改键是否按下。

## 示例
<iframe src="https://code.juejin.cn/pen/7221423392421838906"></iframe>