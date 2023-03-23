---
date: 22:56 2023/3/23
title: 拖拽删除元素、拖拽排序、拖拽预览图片和拖拽移动元素
tags:
- JS
- HTML
description: HTML5 提供了专门的拖拽与拖放的 API，目前各浏览器都已支持，包括 IE。HTML Drag and Drop API 方便了我们对拖拽数据的处理。
---
## 介绍
![微信截图_20221124171306.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ee9c79dd8d9415ebccadf1c262895b1~tplv-k3u1fbpfcp-watermark.image?)

HTML5 提供了专门的拖拽与拖放的 API，目前各浏览器都已支持，包括 IE。HTML 拖放（Drag and Drop）接口使应用程序能够在浏览器中使用拖放功能。例如，用户可使用鼠标选择可拖拽（draggable）元素，将元素拖拽到可放置（droppable）元素，并释放鼠标按钮以放置这些元素。

## 事件类型
|事件	|On 型事件处理程序	|触发时刻|
|-|-|-|
|drag	|ondrag	|当拖拽元素或选中的文本时触发。|
|dragend	|ondragend	|当拖拽操作结束时触发 (比如松开鼠标按键或敲 Esc 键)。|
|dragenter	|ondragenter	|当拖拽元素或选中的文本到一个可释放目标时触发。|
|dragleave	|ondragleave	|当拖拽元素或选中的文本离开一个可释放目标时触发。|
|dragover	|ondragover	|当元素或选中的文本被拖到一个可释放目标上时触发（每 100 毫秒触发一次）。|
|dragstart	|ondragstart	|当用户开始拖拽一个元素或选中的文本时触发。|
|drop	|ondrop	|当元素或选中的文本在可释放目标上被释放时触发。|

> 注意：当从操作系统向浏览器中拖拽文件时，不会触发 dragstart 和dragend 事件。

## 接口
给应用程序添加 HTML 拖放功能，主要使用 DragEvent 和 DataTransfer 这两个接口。
### DragEvent
继承自 MouseEvent，有一个 dataTransfer 属性（DataTransfer 对象），在拖放交互期间传输的数据主要通过这个属性完成。

### DataTransfer
保存着拖拽操作中的数据，例如拖拽事件的类型（如拷贝 copy 或者移动 move），拖拽的数据（一个或者多个项）和每个拖拽项的类型（MIME 类型）。

#### items 属性
包含包含所有拖动数据 DataTransferItem 对象的列表（DataTransferItemList 对象，包括 add、remove 和 clear 方法）。一个 DataTransferItem 代表一个拖拽项目，每个项目都有一个 kind 属性（值为 string 或 file）和一个表示数据项目 MIME 类型的 type 属性。DataTransferItem 对象也有获取拖拽项目数据的方法：DataTransferItem.getAsFile() 和 DataTransferItem.getAsString()。

> DataTransfer 对象使用同步的 getData() 方法去得到拖拽项的数据，而 DataTransferItem 对象使用异步的 getAsString() 方法得到拖拽项的数据。

#### files 属性
包含数据传输中可用的所有本地文件的列表（FileList 对象）。如果拖动操作不涉及拖动文件，则此属性为空列表。

### HTML draggable 属性
这个属性是枚举类型，而不是布尔类型。这意味着必须显式指定值为 true 或者 false，而不能简写。
- 拖拽选中文本、拖拽图像和拖拽链接时，会使用默认拖拽行为。
- 拖拽图像或链接时，图像或链接的 URL 被设定为拖拽数据。
- 对于其他元素，只有当它们作为被选中的一部分时，才会触发默认拖拽行为。

除了图像、链接和选择的文本默认的可拖拽行为之外，其他元素在默认情况下是不可拖拽的。如果要使其他的 HTML 元素可拖拽：
1. 将想要拖拽的元素的 draggable 属性设置成 draggable="true"。
2. 为 dragstart 事件添加监听。
3. 在定义的监听中设置拖拽数据。
```html
<p draggable="true" ondragstart="event.dataTransfer.setData('text/plain', 'This text may be dragged')">
  This text <strong>may</strong> be dragged.
</p>
```

## 拖拽删除元素
拖拽右侧的列表项目到左侧时，在列表项目元素中通过 ondragstart 事件获取到当前的拖拽元素，然后在左侧容器元素中通过 ondrop 事件根据当前的拖拽元素，可以删除该列表项目。

<iframe src="https://code.juejin.cn/pen/7169627955818135582"></iframe>

## 拖拽排序
拖拽列表项目时，在列表项目元素中通过 dragstart 事件获取到当前的拖拽元素和事件的 offsetY，然后在列表容器元素中通过 dragover 事件，根据当前拖拽移动在上面的列表元素事件的 offsetY，对比当前拖拽中的元素的 offsetY，对当前拖拽移动在上面的列表元素进行 before 或 after 操作。

<iframe src="https://code.juejin.cn/pen/7170628532941520904"></iframe>

## 拖拽预览图片
从本地拖拽文件到页面中时，通过获取 DragEvent 的 DataTransfer 对象的 files 属性，然后由 URL.createObjectURL 创建对象 URL，可以预览该图片。

<iframe src="https://code.juejin.cn/pen/7169628540244066334"></iframe>

## 拖拽效果
HTML Drag and Drop API 方便了我们对拖拽数据的处理，如果需要实现 HTML 元素的拖拽移动，更加方便地是使用 mouse 事件。
1. 设置要拖拽的元素绝对定位或是相对定位（position:absolute/relative）。
2. 监听 onmousedown、onmouseup 和 onmousemove 事件，获取 clientX 和 clientY。
3. 将获取到的 clientX 和 clientY 赋值给元素的 CSS 属性 left 和 top。

<iframe src="https://code.juejin.cn/pen/7169632570613694496"></iframe>

## 参考资料
- [JavaScript实现最简单的拖拽效果](https://www.zhangxinxu.com/wordpress/2010/03/javascript%e5%ae%9e%e7%8e%b0%e6%9c%80%e7%ae%80%e5%8d%95%e7%9a%84%e6%8b%96%e6%8b%bd%e6%95%88%e6%9e%9c/)