---
date: 17:05 2023/3/24
title: HTML、CSS、JS 各司其职的原则 ｜ 青训营笔记
tags:
- HTML
- CSS
- JS
description: 遵循 HTML、CSS、JS 各司其职的原则，各自实现对应的功能，这样的好处不仅便于后续代码的维护扩展，而且可以做到代码简洁、可读性高。
---
## 介绍
![网页分层.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bec0cded34fb4581be049b02bda1ebfa~tplv-k3u1fbpfcp-watermark.image?)

我们知道，一个网页通常分为三层，JS 负责行为，CSS 负责表现，HTML 负责结构。在写页面时，遵循 HTML、CSS、JS 各司其职的原则，各自实现对应的功能，这样的好处不仅便于后续代码的维护扩展，而且可以做到代码简洁、可读性高。

## 示例
比如我们要实现一个深夜/白天模式切换的需求。点击"太阳🌞"图标时，切换为深夜模式，页面变成深色背景、浅色字体、图标变为"月亮🌜"。点击"月亮🌜"图标时，切换为白天模式，页面变成浅色背景、深色字体、图标变为"太阳🌞"。

### 版本一
我们在按钮上面绑定一个点击事件，根据按钮的 innerHTML 判断当前模式，然后设置 body.style，再设置按钮的 innerHTML。
```js
btn.addEventListener('click', (e) => {
  const body = document.body;
  if(e.target.innerHTML === '🌞') {
    body.style.backgroundColor = 'black';
    body.style.color = 'white';
    e.target.innerHTML = '🌜';
  } else {
    body.style.backgroundColor = 'white';
    body.style.color = 'black';
    e.target.innerHTML = '🌞';
  }
});
```
<iframe src="https://code.juejin.cn/pen/7191832759323590715"></iframe>

这样效果虽然实现了，但我们思考以下几点：
1. 对于不了解需求的人，阅读这段代码是否可以直接理解"按钮"点击的含义？
2. 使用了 JS 去修改页面的样式，也就是说 JS 做了 CSS 该做的事，如果再增加一个白底蓝字的模式，当 JS 代码很多的时候就变得维护困难。

### 版本二
按钮图标通过 CSS 伪元素 ::after 实现，同时增加一个 CSS night 类，设置 night 类对应的按钮图标，当切换到深夜模式时，将 night 类添加到 body 元素上，按钮图标也会对应的改变。
```css
#modeBtn::after {
  content: '🌞';
}
body.night {
  background: black;
  color: white;
  transition: 1s;
}
body.night #modeBtn::after {
  content: '🌜';
}
```
```js
const btn = document.getElementById('modeBtn');
btn.addEventListener('click', (e) => {
  const { body } = document;
  body.className = body.className ? '' : 'night';
});
```
这样就遵循了 CSS、JS 各司其职的原则，使用 CSS 类表示元素的状态，JS 只负责切换元素的状态。
1. 通过语义化的 CSS night 类，描述了这是一个夜间（night）模式的业务状态，便于快速了解业务需求和后续维护。
2. 如果需求变更，修改模式的颜色，只需修改 body.night 的样式，避免了由 JS 操作 CSS。
3. 按钮图标通过 CSS 伪元素 ::after 实现，按钮的文本内容就可以清除，避免了由 JS 操作 HTML。
4. JS 代码更简洁了。

<iframe src="https://code.juejin.cn/pen/7191836034320039973"></iframe>

但我们还要思考：对于这类纯展示类交互的需求，如果有零 JS 方案，那就会对我们以后的维护更加方便。

### 版本三
按钮图标通过 label 标签和 CSS 伪元素 ::after 实现，同时通过 input checkbox 元素的选中状态和 CSS 相邻兄弟选择器，切换深夜模式。
```html
<input id="modeCheckBox" type="checkbox">
<label id="modeBtn" for="modeCheckBox"></label>
<div class="content">...</div>
```
```css
#modeCheckBox {
  display: none;
}
#modeCheckBox:checked + .content {
  background: black;
  color: white;
  transition: 1s;
}
#modeBtn::after {
  content: '🌞';
}
#modeCheckBox:checked + .content #modeBtn::after {
  content: '🌜';
}
```
这样页面样式的更改在 HTML 的基础上完全依靠 CSS 实现，没有使用一行 JS 代码。
1. 修改模式的颜色，只需修改按钮选中状态 #modeCheckBox:checked+.content 的样式；
2. 修改按钮的图标，只需修改按钮的伪元素 ::after 的 content 属性即可。

<iframe src="https://code.juejin.cn/pen/7191836818348867619"></iframe>

## 总结
写好 JS 的一些原则：
- 让 HTML、CSS 和 JS 职能分离。
- 应当避免不必要的由 JS 直接操作样式和 HTML。
- 用 CSS 类（或伪元素）来表示状态。
- 纯展示类交互可以寻求零 JS 方案。