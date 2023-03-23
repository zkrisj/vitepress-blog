---
date: 22:53 2023/3/23
title: 使用 <dialog> 元素和 Popup API 自定义对话框
tags:
- HTML
description: 通过在 HTML 元素上定义 popup 属性即可实现将任意元素（除了 template 模板元素）包装为一个弹框，并且将默认地具有用户代理提供的样式。
---
## 介绍
alert、confirm、prompt 对话框：
- 不能自定义样式和复杂的内容。
- 会阻塞页面渲染和脚本的执行，直到这个对话框被点击。

所以在开发的过程中，我们一般根据自己自己的需求来自定义或者使用第三方的 UI 库。随着浏览器 API 的不断更新，我们现在可以很容易地使用浏览器的原生能力来实现自己想要的需求。比如 HTML5 中的 `<dialog>` 元素和最新的 Popup API。

## dialog
![QQ截图20221120152102.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c299fc5b264c423da8296ae0c2ea859f~tplv-k3u1fbpfcp-watermark.image?)

HTML 5.2 推出了一个新的原生模态对话框元素 `<dialog>`，目前除了 IE，其他浏览器都已支持。`<dialog>` 元素默认定义了基本的用户代理提供的样式，如自动边距、粗边框样式等，并且可以使用 CSS 自定义。它还提供了一系列的专有属性、方法和事件：
- open 属性用来标识和切换对话框的显示。
- returnValue 属性用来获取对话框的值。
- close() 方法用来关闭对话框。可选传入类字符串参数，用来更新对话框的 returnValue。
- show() 方法用来不带遮罩显示这个对话框，即：打开这个对话框之后依然可以和其他内容进行交互。
- showModal() 方法用来遮罩模式显示这个对话框，并且将会至于所有其他页面元素和对话框的顶层（屏蔽其他页面元素和对话框的交互）。
- cancel 事件当用户按下 Esc 键或单击作为浏览器 UI 一部分的“关闭对话框”按钮时触发。
- close 事件当 `<dialog>` 元素被关闭时触发。

<iframe src="https://code.juejin.cn/pen/7134693206738305055"></iframe>

## Popup API
由 [Open UI 小组](https://open-ui.org/) 发布的 [Pop-Up API 提案](https://open-ui.org/components/popup.research.explainer)，从 Chrome 106 开始支持。
- 目前除了 Chrome 其他浏览器都不支持，所以在兼容性方面比 HTML5 `<dialog>` 元素差太多。
- 它提供了比 `<dialog>` 更简单的方式来定义弹框：通过在 HTML 元素上定义 popup 属性即可实现将任意元素（除了 template 模板元素）包装为一个弹框，并且将默认地具有用户代理提供的样式。
```js
[popup] {
  position: fixed;
  width: fit-content;
  height: fit-content;
  color: canvastext;
  background-color: canvas;
  inset: 0px;
  margin: auto;
  border-width: initial;
  border-style: solid;
  border-color: initial;
  border-image: initial;
  padding: 0.25em;
  overflow: auto;
}
```
例如，通过以下方式，无需任何 CSS  和 JS，就可以创建一个简单的弹框和一个按钮用来切换显示和关闭：
```html
<div id="my-first-pop-up" popup>Pop-up content!</div>
<button popuptoggletarget="my-first-pop-up">Toggle Pop-up</button>
```

### 对比 `<dialog>` 元素
- 与 `<dialog>` 元素的最大区别是它没有遮罩模式。
- Popup 弹框支持 `Esc` 键关闭弹框，而非遮罩模式 `<dialog>` 元素不支持 `Esc` 键关闭。
- form 表单元素支持通过 `method="dialog"` 关联父 `<dialog>` 元素。

### HTML 属性
- defaultopen  
在页面加载时自动打开弹框。
- popup  
将元素变成弹框元素。
- popuptoggletarget  
创建一个触发器元素，用于在显示和隐藏状态之间切换关联的弹框元素。
- popupshowtarget  
创建一个显示关联的弹框元素的触发器元素。
- popuphidetarget  
创建一个触发器元素，用于关闭关联的弹框元素。

### CSS 属性
- ::backdrop  
匹配弹框元素后面的其余页面内容，例如，可以设置将其模糊或变暗效果。
- :open  
匹配显示的弹框元素。

### 方法
- showPopUp()  
显示弹框元素。
- hidePopUp()  
关闭弹框元素。

### 事件
- show  
弹框元素显示时触发。
- hide  
弹框元素被关闭时触发。

<iframe src="https://code.juejin.cn/pen/7168076758657269799"></iframe>

## 参考资料
- [The Pop-Up API](https://developer.chrome.com/docs/web-platform/pop-up-api/)