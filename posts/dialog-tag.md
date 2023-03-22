---
date: 22:52 2023/3/22
title: 使用浏览器原生的 <dialog> 元素替换 alert、confirm、prompt 对话框
tags:
- JS
description: HTML 5.2 推出了一个新的原生模态对话框元素 dialog。dialog 可以通过 showModal 方法显示和 ::backdrop 伪元素自定义遮罩层（mask）样式。
---
## 介绍
alert、confirm、prompt 对话框不能自定义样式和复杂的内容，所以在开发的过程中，我们一般根据自己自己的需求造轮子或者使用第三方的，现在 HTML 5.2 推出了一个新的原生模态对话框元素 `<dialog>`。

`<dialog>` 可以通过 `showModal` 方法显示和 `::backdrop `伪元素自定义遮罩层（mask）样式。遮罩层是用户触发弹出框后，形成的一个对话框与页面主体的分割图层，它的存在可以给用户一个更明显的视觉差效果，同时也避免在对话框显示时与应用程序的其余部分进行交互。

`<dialog>` 默认定义了基本的用户代理提供的样式，如自动边距、粗边框样式等，也可以使用 CSS 自定义。

## 属性和方法
HTMLDialogElement.open  
Boolean，设置或返回对话框是否显示。

HTMLElement.hidden  
Boolean，设置或返回元素是否隐藏。

HTMLDialogElement.returnValue  
DOMString，设置或返回对话框的返回值。

HTMLDialogElement.close([returnValue])  
关闭对话框。可选字符串参数，更新对话框的 `returnValue`。

HTMLDialogElement.show()  
无遮罩层显示对话框，即仍然允许与对话框外的内容进行交互。

HTMLDialogElement.showModal()  
将对话框显示为遮罩模式，并且将会至于所有其他对话框的顶层（屏蔽其他对话框的交互）。

## 使用
以下定义了一个简单的 dialog：
```html
<button onclick="i1.showModal()" id="b1" disabled>showModal</button>
<button onclick="i1.show();b1.disabled=true" id="b2">show</button>
<dialog id="i1" open>
  <h2>Hello world.</h2>
  <button onclick="i1.close();b1.disabled=false">close</button>
</dialog>
<style>
  dialog::backdrop {
    background: rgba(0, 0, 0, .3);
  }
</style>
```
<iframe src="https://code.juejin.cn/pen/7134583317881421862"></iframe>

默认情况下非模态对话框不能通过 `Esc` 键关闭，当表单通过 `method="dialog"` 关联父对话框时，默认表单中的按钮点击触发父对话框的关闭事件，并将按钮的 `value` 值赋给父对话框的 `returnValue`。
```html
<dialog open>
  <p>Greetings, one and all!</p>
  <form method="dialog">
    <button>OK</button>
  </form>
</dialog>
```
<iframe src="https://code.juejin.cn/pen/7134693206738305055"></iframe>