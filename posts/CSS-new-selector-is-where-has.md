---
date: 23:48 2023/3/22
title: CSS 新选择器 :is() :where() :has()
tags:
- CSS
description: :has(selector) 匹配包含（相对于 selector 的 :scope）指定选择器的元素。它的强大之处是，可以实现父选择器和前面兄弟选择器的功能。支持所有的 CSS 选择符。
---
## :is()
匹配列表中任意一个选择器可以选择的元素。:matches() 重命名之后的写法。兼容写法：:-webkit-any()、:-moz-any()。

### 语法
```css
:is( <forgiving-selector-list> )

/* 设置 header, main, footer 里的任意一个 p 标签的 hover 状态 */
header p:hover, main p:hover, footer p:hover {
  /* … */
}

/* 可以使用 :is() 简写为以下 */
:is(header, main, footer) p:hover {
  /* … */
}
```

### :is() 伪类函数不能选择伪元素
```css
some-element::before, some-element::after {
  /* … */
}
```
不能使用 :is() 简写：
```css
some-element:is(::before, ::after) {
  /* … */
}
```

### forgiving-selector
原谅选择器解析可以避免选择器列表失效。在 CSS 中使用选择器列表时，如果任何选择器无效，则整个列表都被视为无效。而当使用 :is() 或 :where() 选择器列表时，如果一个选择器解析失败，则将忽略不正确或不受支持的选择器并使用其他选择器。下面代码即使在浏览器不支持 :unsupported 时，仍然会正确解析并匹配 :valid。
```css
:is(:valid, :unsupported) {
  /* … */
}
```
下面代码在浏览器不支持 :unsupported 时将被忽略，即使它们支持 :valid。
```css
:valid, :unsupported {
  /* … */
}
```

## :where()
与 :is() 语法和作用相同，区别是 :where() 的优先级总是为 0 ，:is() 的优先级是由它的选择器列表中优先级最高的选择器决定的。

### 示例
在下面这个例子中，我们有两篇文章，每篇文章都包含一个部分、一个旁白和一个页脚。然后定义了不同的样式：
```css
:is(section.is-styling, aside.is-styling, footer.is-styling) a {
  color: red;
}

:where(section.where-styling, aside.where-styling, footer.where-styling) a {
  color: orange;
}
```
如果我们稍后想使用简单的选择器覆盖页脚中链接的颜色：
```css
footer a {
  color: blue;
}
```
因为类选择器比元素选择器具有更高的优先级，:is() 的优先级是由它的选择器列表中优先级最高的选择器决定的，所以这不会对 :is() 选择器中页脚链接的样式覆盖。但是，:where() 选择器的优先级总是为 0，因此 :where() 选择器中页脚链接的样式将被覆盖。

<iframe src="https://code.juejin.cn/pen/7142863632617963533"></iframe>

## :has(selector)
匹配包含（相对于 selector 的 :scope）指定选择器的元素。可以认为 selector 的前面有一个看不见的 :scope 伪类（a:has(a > img)这样的写法是不合法的）。它的强大之处是，可以实现父选择器和前面兄弟选择器的功能。支持所有的 CSS 选择符。

### 语法
```css
:has( <forgiving-relative-selector-list> )
/* 只要 <a> 元素里面有 <img> 元素，这个 <a> 元素就会匹配： */
a:has(img) { /* … */ }
/* 匹配直接包含 <img> 子元素的 <a> 元素： */
a:has(> img) { /* … */ }
/* 匹配其后紧跟着 <p> 元素的 <h1> 元素： */
h1:has(+ p) { /* … */ }
/* 只要 <article> 元素内有 <h5> 元素或者有 <p> 元素就会匹配 */
article:has(h5, p) { /* … */ }
/* <article> 元素内同时有 <h5> 元素和 <p> 元素才匹配 */
article:has(h5):has(p) { /* … */ }
```

### 示例
<iframe src="https://code.juejin.cn/pen/7142861125166563336"></iframe>

需要升级你的浏览器到以下版本：

![developer.mozilla.org_zh-CN_docs_Web_CSS__has.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b73ed38807740368e832b1393612817~tplv-k3u1fbpfcp-watermark.image?)

## 参考资料
- [来了，来了，CSS :has() 伪类她来了](https://www.zhangxinxu.com/wordpress/2022/08/css-has-pseudo-class/)
