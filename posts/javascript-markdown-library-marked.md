---
date: 7:47 2023/4/30
title: JavaScript Markdown 库 marked
tags:
- JS
- Vue
description: marked 是一个基于 JavaScript 的 Markdown 解析器和编译器。它可以将 Markdown 语法解析为 HTML，并且可以扩展 Markdown 的功能。Marked 可以在浏览器端和 Node.js 环境下运行。
---
## 介绍
marked 是一个基于 JavaScript 的 Markdown 解析器和编译器。它可以将 Markdown 语法解析为 HTML，并且可以扩展 Markdown 的功能。Marked 可以在浏览器端和 Node.js 环境下运行。

使用 Marked 可以轻松地将 Markdown 文本转换为 HTML 文档，而无需手动编写 HTML 代码。它支持 Markdown 的所有基本语法，如标题、段落、列表、链接、图片等。此外，Marked 还支持一些扩展语法，如表格、代码块、代码高亮、删除线、粗体、斜体等。

## npm 方式
下面是 Vue3 的官网示例 - 一个简单的 markdown 编辑器。通过 ES Module 方式导入 `marked` 对象，然后通过 `computed` 计算属性根据左侧文本框内容将生成的 HTML 代码插入到右侧页面元素中，动态更新其内容，这里配合指令 `v-html` 将内容直接作为普通 HTML 插入。还使用了 `lodash-es` 模块的防抖函数 `debounce`，防止输入频率导致的性能问题。
```html
<template>
  <div class="editor">
    <textarea class="input" :value="input" @input="update"></textarea>
    <div class="output" v-html="output"></div>
  </div>
</template>
<script setup>
  import { marked } from 'marked'
  import { debounce } from 'lodash-es'
  import { ref, computed } from 'vue'
  const input = ref('# hello')
  const output = computed(() => marked(input.value))
  const update = debounce((e) => {
    input.value = e.target.value
  }, 100)
</script>
<style>
  body {
    margin: 0;
  }
  .editor {
    height: 100vh;
    display: flex;
  }
  .input,
  .output {
    overflow: auto;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .input {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
  }
  code {
    color: #f66;
  }
</style>
```
<iframe src="https://code.juejin.cn/pen/7227610957688602682"></iframe>

## CDN 方式
只需要在你的 HTML 文档中引入 `marked.js` 文件，然后使用 JavaScript 代码调用 `marked` 对象的函数即可将 Markdown 文本转换为 HTML。
```html
<body>
  <div class="editor">
    <textarea class="input" id="input"></textarea>
    <div class="output" id="output"></div>
  </div>
</body>
<script src="<script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>"></script>
<script>
  function debounce(fn, delay = 200) {
    let timer;
    return function() {
      clearTimeout(timer);
      timer = setTimeout(fn.bind(this, ...arguments), delay);
    }
  }
  input.value = '# hello'
  output.innerHTML = marked.parse(input.value)
  input.oninput = debounce((e) => {
    input.value = e.target.value
    output.innerHTML = marked.parse(input.value)
  }, 500)
</script>
<style>
  body {
    margin: 0;
  }
  .editor {
    height: 100vh;
    display: flex;
  }
  .input,
  .output {
    overflow: auto;
    width: 50%;
    height: 100%;
    box-sizing: border-box;
    padding: 0 20px;
  }
  .input {
    border: none;
    border-right: 1px solid #ccc;
    resize: none;
    outline: none;
    background-color: #f6f6f6;
    font-size: 14px;
    font-family: 'Monaco', courier, monospace;
    padding: 20px;
  }
  code {
    color: #f66;
  }
</style>
```
<iframe src="https://code.juejin.cn/pen/7227610927128903738"></iframe>

## 配置
marked 提供了许多配置选项，可以用来自定义转换过程中的行为和输出结果。
1. `gfm`：启用 GitHub 风格的 Markdown。默认为 `true`。
2. `breaks`：将行内的换行符转换为 `<br>`。默认为 `false`。
3. `sanitize`：启用 HTML 标签的转义。默认为 `false`。
4. `smartLists`：启用智能列表。默认为 `true`，即自动将 `-` 和 `*` 转换为无序列表，而将数字和 `.` 转换为有序列表。
5. `smartypants`：启用智能标点。默认为 `false`，即不自动将引号和破折号转换为智能标点。
6. `highlight`：用于高亮代码块的函数。默认为 `null`，即不进行代码高亮。
7. `renderer`：用于自定义输出 HTML 的渲染器。默认为 `new marked.Renderer()`，即使用默认的渲染器。

这些配置选项可以通过一个 JavaScript 对象进行设置，然后作为第二个参数传递给 marked 函数。例如：
```js
const marked = require('marked');

const markdown = '# Hello, world!';
const options = {
  gfm: true,
  breaks: true,
  smartLists: true,
  highlight: function(code) {
    return require('highlight.js').highlightAuto(code).value;
  }
};

const html = marked(markdown, options);
console.log(html);
```
上面的代码将一个 Markdown 字符串转换为 HTML，并启用了 GitHub 风格的 Markdown、智能列表和代码高亮等功能。

## 仓库和文档地址
1. https://github.com/markedjs/marked
2. [Marked Documentation](https://marked.js.org/)
