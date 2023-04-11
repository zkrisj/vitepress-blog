---
title: 集成 GPT-4 的代码编辑器 - OpenAI Cursor（已限制使用和收费）
date: 2023-04-11 15:30:23
tags: [AI, 工具]
description: 现在新版本中，如果提问的跟编程技术无关的问题，会得不到答案：很抱歉，但我无法满足您的请求，因为它与编程或给定的上下文无关。还有什么我可以帮你的吗？
---
## 介绍
OpenAI 宣布推出了全新的代码编辑器——OpenAI Cursor，通过人工智能技术辅助程序员进行日常的编码，支持 Windows、Linux 和 macOS。最引人注目之处便是将 GPT-4 模型集成在了代码编辑环境中，使得代码编写过程中可实现更加高效、准确、智能化的提示与建议。主要功能有：
1. 代码补全。当用户输入代码时，Cursor 可以预测并提示可能的后续代码，这有助于快速填补函数参数、变量名等，减少编写代码时的打字量。

2. 错误修正。如果用户输入的代码有语法错误或拼写错误，Cursor 可以在边栏提示修正建议，帮助用户快速定位和修复问题。
3. 方法文档。当用户输入一个方法的开头，如 `def` 后面空格时，Cursor 可以预测该方法的文档字符串，用户可以选择接受或修改建议的文档字符串。
4. 重构代码。用户可以输入某段代码，然后在边栏选择“重构”，Cursor 会提供重构该代码段的建议，如提取变量、提取方法等，帮助用户进行代码重构。
5. 推荐库。当用户想要实现某些功能时，可以在 Cursor 中输入，Cursor 会推荐可以使用的库和相关示例代码。这有助于发现和学习新的库。
6. 代码格式化。用户可以选择让 Cursor 帮助格式化当前文件或选择的代码段，自动对齐缩进、添加空行等，使代码更规范整洁。

Cursor 的这些功能通过集成强大的 GPT-4 语言模型实现，可以显著增强编程体验，让代码编辑器的智能化更上一层楼。未来 Cursor 有望进一步扩充功能，成为程序员必备的 AI 编程助手。

## 当前版本信息
1. Version: 0.2.2
2. Commit: e8b34ac28f297eb86df40a0545ee06519b653263
3. Date: 2023-04-07T23:36:06.588Z
4. Electron: 19.1.9
5. Chromium: 102.0.5005.167
6. Node.js: 16.14.2
7. V8: 10.2.154.15-electron.0
8. OS: Windows_NT x64 10.0.19043
9. Sandboxed: No

## 界面
![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/97df8c3e120e4d4c9200ef89fd5891aa~tplv-k3u1fbpfcp-watermark.image?)

主要使用下面这三个快捷键：

![1681116981686.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5341925fd4c6457fb6949cff2d09f556~tplv-k3u1fbpfcp-watermark.image?)

可以使用 `Ctrl+Shift+P` 命令显示和修改快捷键映射：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/24ec5f17cefc419d86a5197c47115d04~tplv-k3u1fbpfcp-watermark.image?)

## 使用
1. 获取 `https://registry.npmjs.org/npm/latest` 这个地址的 `JSON` 数据，并显示在 HTML 页面中：
```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>fetch test</title>
  </head>
  <body>
  </body>
  <script>
    fetch('https://registry.npmjs.org/npm/latest')
      .then(res => res.json())
      .then(res => {
        const jsonStr = JSON.stringify(res);
        const jsonEl = document.createElement('pre');
        jsonEl.textContent = jsonStr;
        document.body.appendChild(jsonEl);
      });
  </script>
</html>
```
2. 向 `https://www.runoob.com/try/ajax/demo_post2.php` 这个地址发送 `POST` 请求，参数为 `fname=Henry&lname=Ford`，请求头为 `'Content-Type': 'application/x-www-form-urlencoded'`：
```js
fetch('https://www.runoob.com/try/ajax/demo_post2.php', {
  method: 'post',
  body: 'fname=Henry&lname=Ford',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
}).then(res=>res.text()).then(res=>console.log(res));
```
3. 如果你对某一行代码不太理解，只要按住鼠标选中，按住 Ctrl+L，然后输入关于代码你要问的问题（就像 ChatGPT 一样）。Cursor 就能立刻给你很详细的解释。例如我们选择 `res.text()` 这句代码，然后按住 Ctrl+L，输入 `这句是什么意思？用中文回答`：
    > 这段代码使用了Fetch API来发送HTTP请求。第一个请求使用GET方法从npmjs.org获取最新版本的npm包的元数据，并将响应转换为JSON格式，然后将其显示在页面的body标签中。第二个请求使用POST方法将表单数据发送到runoob.com的服务器，并将响应转换为文本格式，然后将其记录在控制台中。所以，这句代码}).then(res=>res.text()是将响应转换为文本格式，以便在后续的处理中使用。

4. 现在可以通过安装扩展来增加 Cursor 的功能，选择 `view->Extensions`，和 `vs code `一致，输入 `Chinese` 搜索汉化扩展并下载安装使用。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7ea431a4ca374c2191ba20640208d59d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

然后，按下 Ctrl+Shift+P 组合键以显示“命令面板”，然后键入“display”以筛选并显示“Configure Display Language”命令。按“Enter”，然后会按区域设置显示安装的语言列表，并突出显示当前语言设置，选择另一个“语言”以切换 UI 语言。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/99370a4f39844691ad6a6127483be828~tplv-k3u1fbpfcp-watermark.image?)

## 新版本
新版本之前，有一个重要特性：使用 Ctrl+L，可以做一些简单的 ChatGPT 问答。而现在新版本中，如果提问的跟编程技术无关的问题，会得不到答案：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdf668d648994a85a7a504a77292e131~tplv-k3u1fbpfcp-watermark.image?)

> 翻译为：很抱歉，但我无法满足您的请求，因为它与编程或给定的上下文无关。还有什么我可以帮你的吗？

问答次数一个月免费 100 条，但可以升级到 Pro 获取更多的使用：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f5cf5cdf463941ec9bc602edec336167~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a25ccc027d574179b5557977ec49dda7~tplv-k3u1fbpfcp-watermark.image?)

## 仓库和下载地址
1. [Cursor | Build Fast](https://www.cursor.so/)
2. [Github](https://github.com/getcursor/cursor)
3. [Gitee](https://gitee.com/mirrors/Cursor-Editor)