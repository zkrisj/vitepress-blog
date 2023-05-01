---
date: 7:09 2023/4/28
title: 浏览器知识总结
tags:
- 术语
description: 浏览器是一个复杂的软件，它通常会将不同的任务分配给多个进程来提高性能和安全性。
---
## 浏览器架构
浏览器架构演进：
1. 单进程架构：所有模块运行在同一个进程里，包含网络、插件、JavaScript运行环境等。
2. 多进程架构：主进程、网络进程、渲染进程、GPU进程、插件进程。
3. 面向服务架构：将原来的U儿、数据库、文件、设备、网络等，作为一个独立的基础服务。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/348f1f51ccc343adbc7527941c2f6d3d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d552a8f4168d4563ae7bf2bf887b9cbc~tplv-k3u1fbpfcp-watermark.image?)

## 浏览器进程
浏览器是一个复杂的软件，它通常会将不同的任务分配给多个进程来提高性能和安全性。以下是常见的浏览器进程：

![浏览器进程2.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c88135878f0149ffa3de72b9043d5f52~tplv-k3u1fbpfcp-watermark.image?)

## 渲染进程
内部是多线程实现，主要负责页面渲染，脚本执行，事件处理，网络请求等。在浏览器中，渲染进程通常使用 HTML、CSS 和 JavaScript 来解析和渲染网页。渲染进程会将 HTML、CSS 和 JavaScript 文件解析成 DOM(文档对象模型)、CSSOM(CSS 对象模型) 和 JavaScript 对象，然后使用这些对象来渲染网页。

![浏览器渲染进程.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b31a5c62170a46268265316e3000f744~tplv-k3u1fbpfcp-watermark.image?)

### JS 引擎和渲染引擎通信
1. 解析执行 JS。
2. XML 解析生成渲染树，显示在屏幕。
3. 桥接方式通信。

### 渲染进程的多线程工作流程

![渲染进程多线程工作流程.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41fbd685d61b4e8b9370b84b00b4f99f~tplv-k3u1fbpfcp-watermark.image?)

1. 网络线程负责加载网页资源。
2. JS 引擎解析 JS 脚本并且执行。
3. JS 解析引擎空闲时，渲染线程立即工作。
4. 用户交互、定时器操作等产生回调函数放入任务队列中。
5. 事件线程进行事件循环，将队列里的任务取出交给 JS 引擎执行。

## Chrome 运行原理
### 如何展示网页
浏览器地址输入 URL 后发生了什么：

![浏览器地址输入URL后发生了什么.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/09e7cb2385a34a29ba82af355457b1ba~tplv-k3u1fbpfcp-watermark.image?)

### 输入处理
1. 用户 URL 框输入内容后，UI 线程会判断输入的是一个 URL 地址还是一个 query 查询条件。
2. 如果是 URL，直接请求站点资源。
3. 如果是 query，将输入发送给搜索引擎。

## 开始导航

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8ee77a67c7f4da8a5f1afc78b6f48e1~tplv-k3u1fbpfcp-watermark.image?)

1. 当用户按下回车，UI 线程通知网络线程发起一个网络请求，来获取站点内容。
2. 请求过程中，tab 处于 loading 状态。

### 读取响应

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e24b648a5401443abc354f48e1d3099c~tplv-k3u1fbpfcp-watermark.image?)

1. 网络线程接收到 HTTP 响应后，先检查响应头的媒体类型(MIME Type)。
2. 如果响应主体是一个 HTML 文件，浏览器将内容交给渲染进程处理。
3. 如果拿到的是其他类型文件，比如 Zip、exe 等，则交给下载管理器处理。

### 主进程寻找渲染进程

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17f85764605e487084e35a25ca167014~tplv-k3u1fbpfcp-watermark.image?)

1. 网络线程做完所有检查后，会告知主进程数据已准备完毕，主进程确认后为这个站点寻找一个渲染进程。
2. 主进程通过 IPC 消息告知渲染进程去处理本次导航。
3. 渲染进程开始接收数据并告知主进程自己已开始处理，导航结束，进入文档加载阶段。

### 渲染进程加载资源

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b7fcba3bc364404ad1b6f50baa17b5d~tplv-k3u1fbpfcp-watermark.image?)

1. 收到主进程的消息后，开始加载 HTML 文档。
2. 除此之外，还需要加载子资源，比如一些图片，CSS 样式文件以及 JavaScript 脚本。

### 渲染进程构建渲染树

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67c10f8ecb0c4376bb9470e48241bc42~tplv-k3u1fbpfcp-watermark.image?)

1. 构建 DOM 树，将 HTML 文本转化成浏览器能够理解的结构。
2. 构建 CSSOM 树，浏览器同样不认识 CSS，需要将 CSS 代码转化为可理解的 CSSOM。
3. 构建渲染树，渲染树是 DOM 树和 CSSOM 树的结合。

### 渲染进程进行页面布局

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da0e147f92a34b68a0af5790fe536ec1~tplv-k3u1fbpfcp-watermark.image?)

1. 根据渲染树计算每个节点的位置和大小。
2. 在浏览器页面区域绘制元素边框。
3. 遍历渲染树，将元素以盒模型的形式写入文档流。

### 渲染进程页面绘制

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/db3c90a8ce2d4e818dd1b5b00a5735f3~tplv-k3u1fbpfcp-watermark.image?)

1. 构建图层：为特定的节点生成专用图层。
2. 绘制图层：一个图层分成很多绘制指令，然后将这些指令按顺序组成一个绘制列表，交给合成线程。
3. 合成线程接收指令生成图块。
4. 栅格线程将图块进行栅格化。
5. 展示在屏幕上。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de43d4fd93f64e77b67f83a96b47f5b1~tplv-k3u1fbpfcp-watermark.image?)

## 前端性能 Performance

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbdb43549c6d41a28a870e044e683205~tplv-k3u1fbpfcp-watermark.image?)

1. 时间都花在哪里。
2. 什么情况下卡顿。

### 首屏优化
1. 压缩、分包、删除无用代码。
2. 静态资源分离。
3. JS 脚本非阻塞加载。
4. 缓存策略。
5. SSR。
6. 预置 loading、骨架屏。

### 渲染优化
1. GPU 加速。
2. 减少回流、重绘。
3. 离屏渲染。
4. 懒加载。

### JS 优化
1. 防止内存泄漏。
2. 循环尽早 `break`。
3. 合理使用闭包。
4. 减少 Dom 访问。
5. 防抖、节流。
6. 使用异步 JavaScript（消息队列，微任务）可以使得主线程在等待请求返回结果的同时继续往下执行。
7. Web Workers。

## 总结

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c44e408a1f554232b5ceaa40235ead6f~tplv-k3u1fbpfcp-watermark.image?)
