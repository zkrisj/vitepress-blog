---
date: 23:07 2023/3/22
title: HTML5 dataset 的使用
tags:
- JS
- HTML
description: data-* 全局属性是一类被称为自定义数据属性的属性，它赋予我们在所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本在 HTML 与 DOM 表现之间进行专有数据的交换。
---
## 介绍
HTML5 是具有扩展性的设计，它初衷是数据应与特定的元素相关联，但不需要任何定义。

`data-*` 全局属性是一类被称为自定义数据属性的属性，它赋予我们在所有 HTML 元素上嵌入自定义数据属性的能力，并可以通过脚本在 HTML 与 DOM 表现之间进行专有数据的交换。通过添加 `data-*` 属性，即使是普通的 HTML 元素也能变成相当复杂且强大的编程对象，而不需要使用 DOM 标准额外属性或是 `setUserData` 之类的技巧。

其中 * 可以被遵循 xml 规则的任何名称替换，并具有一些限制：
- 不能以 xml 开头（不区分大小写）；
- 不能包含冒号 `:`；
- 不能包含大写字母。

## 使用
1. CSS 访问：因为 `data-*` 设定为 HTML 属性，所以他们同样能被 CSS 访问。比如你可以通过 CSS `content` 属性，使用 `attr` 函数来显示 `data-*` 的内容：
```html
<ul>
  <li data-id="Alex Trevelyan">006: Agent turned terrorist leader; James' nemesis in "Goldeneye".</li>
  <li data-id="James Bond">007: The main man; shaken but not stirred.</li>
</ul>
```
```css
li:after {
  content: 'Data ID: 'attr(data-id);
  position: absolute;
  top: -22px;
  left: 10px;
  background: black;
  color: white;
  padding: 2px;
  border: 1px solid #eee;
  opacity: 0;
  transition: 0.5s opacity;
}

li:hover:after {
  opacity: 1;
}
```

2. JavaScript 访问：在外部使用 JavaScript 去访问这些属性的值同样非常简单。你可以使用 `Element.getAttribute()` 配合它们完整的 HTML 名称去读取它们。但标准定义了一个更简单的方法：通过 `HTMLElement.dataset.propertyName` (或者 `HTMLElement.dataset["propertyName"]`) 来获取属性名中 `data-` 之后的部分，要注意的是破折号连接的名称需要改写为骆驼拼写法，例如 `data-index-number` 转换为 `indexNumber`。
```html
<article
  id="electriccars"
  data-columns="3"
  data-index-number="12314"
  data-parent="cars">
...
</article>
```
```js
const article = document.querySelector('#electriccars');

article.dataset.columns // "3"
article.dataset.indexNumber // "12314"
article.dataset.parent // "cars"
```

## 示例
<iframe src="https://code.juejin.cn/pen/7137503930279264264"></iframe>