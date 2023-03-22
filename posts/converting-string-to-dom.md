---
date: 23:10 2023/3/22
title: 字符串转 DOM 的几种方法和安全措施
tags:
- JS
description: 使用 Element.setHTML() 代替 Element.innerHTML，这是浏览器的一个最新方法，可以删除 HTML 字符串中在当前元素的上下文中任何不安全或无效的元素、属性或注释。
---
## 介绍
有时我们想得到现有的 DOM 树序列化后的字符串，如果仅仅想得到指定节点的后代，可以直接用 `Element.innerHTML` 属性；如果你想得到包括节点本身及它所有的后代的话，可以使用 `Element.outerHTML` 属性。

如果将字符串内容解析为 DOM 树，则有几种方法。

## 字符串转 DOM
1. innerHTML
```js
function parse(html) {
  const placeholder = document.createElement("div");
  placeholder.innerHTML = html;
  return placeholder;
}
```
- [x] 安全：没有[脚本执行](#scripts)
- [ ] 允许的节点：[只有有效的节点](#html-limits)

2. insertAdjacentHTML
```js
function parse(html) {
  const placeholder = document.createElement("div");
  placeholder.insertAdjacentHTML("afterbegin", html);
  return placeholder;
}
```
- [x] 安全：没有[脚本执行](#scripts)
- [ ] 允许的节点：[只有有效的节点](#html-limits)

3. DOMParser
```js
function parse(html) {
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.childNodes;
}
```
- [x] 安全：没有[脚本执行](#scripts)
- [ ] 允许的节点：[只有有效的节点](#html-limits)

4. createContextualFragment
```js
function parse(html) {
  const fragment = document.createRange().createContextualFragment(html);
  return fragment.childNodes;
}
```
- [ ] 安全：会[执行脚本](#scripts)
- [x] 允许的节点：[可以设置上下文允许的节点](#html-limits)

## <b id="scripts">脚本执行</b>
除了 `createContextualFragment` 之外，所有方法都会阻止常规脚本执行。例如：
```js
const name = "<script>alert('I am John in an annoying alert!')</script>";
el.innerHTML = name; // harmless in this case
```
这并不会导致 XSS 攻击，因为在 HTML5 中不会执行由 `innerHTML` 插入的 script 脚本。

但是，有很多不依赖 script 标签去执行 JavaScript 的方式。例如：
```js
const name = "<img src='x' onerror='alert(1)'>";
el.innerHTML = name; // shows the alert
```
上面的代码在浏览器中会执行 `alert(1)`，其他类似的属性还有 `onload`，例如上面代码 `onerror` 换成 `onload`，`src` 改成正常的 URL 地址，在在浏览器中同样会执行。通过几种措施可以阻止这些情况：
1. 可以在将实际节点附加到 DOM 之前去除子节点的所有违规属性：
```js
[...placeholder.querySelectorAll("*")].forEach((node) =>
    node.removeAttribute("onerror");
);
```
2. 当插入纯文本时，建议使用 `Node.textContent` 代替 `Element.innerHTML`，它不会把给定的内容解析为 HTML，它仅仅是将原始文本插入给定的位置。
3. 使用 `Element.setHTML()` 代替 `Element.innerHTML`，这是浏览器的一个最新方法，可以删除 HTML 字符串中在当前元素的上下文中任何不安全或无效的元素、属性或注释。
```js
const unsanitized_string = '<img src="x" onerror="console.log(1)">';
el.setHTML(unsanitized_string);
console.log(el.innerHTML); // <img src="x">
```
4. 使用 `Sanitizer.sanitizeFor()` 代替 `Document.createElement()` 创建新节点。该方法接收一个 HTML 标记名称，例如 div、table、p 等，和一个 HTML 字符串参数。返回一个解析和清理后的与参数中指定的标记相对应的 HTML 元素。
```js
const unsanitized_string = '<img src="x" onerror="console.log(1)">';
const p = new Sanitizer().sanitizeFor('p', unsanitized_string); 
console.log(p.innerHTML); // <img src="x">
```

## <b id="html-limits">HTML 限制</b>
HTML 中有一些限制会阻止将某些类型的节点添加到像 div 这样的节点，例如 thead、tbody、tr 和 td。
```js
const placeholder = document.createElement("div");
placeholder.innerHTML = `<tr><td>Foo</td></tr>`;
const node = placeholder.firstElementChild; //=> null
```

但可以通过几种方法来避免这种情况：
1. 通过 createContextualFragment 设置上下文：
```js
const table = document.createElement(`table`);
const tbody = document.createElement(`tbody`);
table.appendChild(tbody);

const range = document.createRange();
range.selectNodeContents(tbody);
const node = range.createContextualFragment(`<tr><td>Foo</td></tr>`);
node.firstChild //=> tr
```
2. 使用模板标签作为占位符，它没有任何内容限制：
```js
const template = document.createElement("template");
template.innerHTML = `<tr><td>Foo</td></tr>`;
const node = template.content;
node.firstChild //=> tr
```
3. 创建临时节点：
```js
const tr=document.createElement('tr');
tr.innerHTML = `<tr><td>Foo</td></tr>`;
const placeholder = document.createElement("table");
placeholder.appendChild(tr);
placeholder.firstChild //=> tr
```
4. 使用文档片段：
```js
const tr=document.createElement('tr');
tr.innerHTML = `<tr><td>Foo</td></tr>`;
const fragment = new DocumentFragment();
fragment.appendChild(tr);
fragment.firstChild //=> tr
```

## 参考资料：
1. [从 HTML 字符串创建 DOM 节点](https://grrr.tech/posts/create-dom-node-from-html-string/)
2. [盘点HTML字符串转DOM的各种方法及细节](https://www.zhangxinxu.com/wordpress/2021/02/html-string-dom/)