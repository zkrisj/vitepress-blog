---
date: 23:23 2023/3/23
title: 修改单选框、复选框、下拉框的默认样式
tags:
- CSS
description: 从 Chrome 93 开始支持的 CSS accent-color 属性提供了更简单的修改表单控件的样式的方法，它可以在不改变浏览器默认表单组件基本样式的前提下重置组件的颜色。
---
## 介绍
HTML 原生的单选框、复选框元素样式在各个浏览器上面由用户代理默认设置样式，如果在页面上应用了其他颜色或主题时，我们通常也相应的更改这些输入框或按钮的颜色或背景，否则会出现颜色与背景或主题不融入的样式不一致问题。

## appearance
通常的做法是使用 display: none、绝对定位或隐藏它们，然后使用 :before 或 :after 伪元素实现样式。

从 Chrome 83 开始支持的 appearance CSS 属性提供了更有效的用于控制基于操作系统主题的 UI 控件的原生外观的方法。目前，除了 IE，其他浏览器都已支持，兼容性很好。

![微信截图_20221205221051.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/33913ab5a67c493d8f938d7b21a72411~tplv-k3u1fbpfcp-watermark.image?)

## 单选框
```html
<body>
  <label>
    <input type="radio" name="contact" value="email" checked>Email
  </label>
  <label>
    <input type="radio" name="contact" value="phone">Phone
  </label>
  <label>
    <input type="radio" name="contact" value="mail">Mail
  </label>
</body>
<style>
  input[type=radio] {
    appearance: none;
    border-radius: 50%;
    width: 16px;
    height: 16px;
    border: 2px solid #999;
    transition: 0.2s all linear;
    margin-right: 5px;
    vertical-align: top;
  }
  input[type=radio]:checked {
    border: 6px solid black;
  }
</style>
```

<iframe src="https://code.juejin.cn/pen/7173667078539313165"></iframe>

## 复选框
```html
<body>
  <label class="label">
    <input type="checkbox">
    <i class="check"></i>
    <span>Apple</span>
  </label>
  <label class="label">
    <input type="checkbox">
    <i class="check"></i>
    <span>Banana</span>
  </label>
  <label class="label">
    <input type="checkbox">
    <i class="check"></i>
    <span>Pear</span>
  </label>
</body>
<style>
  .label {
    display: inline-flex;
    align-items: center;
    margin: 1em .5em;
  }
  .label input[type=checkbox] {
    appearance: none;
  }
  .label input[type=checkbox]+.check {
    width: .5em;
    height: .5em;
    margin-right: .5em;
    border: solid black;
    transition: .2s;
  }
  .label input[type=checkbox]:checked+.check {
    height: .2em;
    border-top: transparent;
    border-right: transparent;
    transform: rotate(-45deg);
  }
</style>
```

<iframe src="https://code.juejin.cn/pen/7173670223390703652"></iframe>

## 下拉框
`<select>` 元素的内部结构复杂，难以控制，所以很难用 CSS 进行高效的设计，但可以像其他元素一样改变某些方面——例如，调整 盒模型、显示的字体等，还可以使用 appearance 属性来去除默认的系统外观。如果要实现自定义 `<select>` 元素，可以考虑使用第三方 UI 库，或者尝试使用非语义元素和 JavaScript 来制作下拉菜单，再使用 WAI-ARIA 来提供语义。

<iframe src="https://code.juejin.cn/pen/7173698045593255947"></iframe>

## accent-color
![微信截图_20221205231321.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bc5422aaa5c543a3bde553321522babe~tplv-k3u1fbpfcp-watermark.image?)

从 Chrome 93 开始支持的 CSS accent-color 属性提供了更简单的修改表单控件的样式的方法，它可以在不改变浏览器默认表单组件基本样式的前提下重置组件的颜色。目前支持下面这些 HTML 控件元素：
- `<input type="checkbox">`
- `<input type="radio">`
- `<input type="range">`
- `<progress>`

并且，accent-color 属性具有继承性，只需要在对应表单控件元素的祖先元素上设置，响应的控件的颜色就会发生变化。

<iframe src="https://code.juejin.cn/pen/7173698375756283935"></iframe>

## 参考资料
- [如何构建表单小工具](https://developer.mozilla.org/zh-CN/docs/Learn/Forms/How_to_build_custom_form_controls)