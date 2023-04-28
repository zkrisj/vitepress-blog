---
date: 9:28 2023/4/28
title: 跨端容器简介
tags:
- 术语
description: 跨端容器（Cross-platform container）是一种软件技术，它可以将应用程序在不同的操作系统和/或硬件平台上运行，而无需修改应用程序代码。
---
## 介绍
跨端容器（Cross-platform container）是一种软件技术，它可以将应用程序在不同的操作系统和/或硬件平台上运行，而无需修改应用程序代码。跨端容器通常提供了一层抽象，使得应用程序可以在不同的平台上运行，而无需了解底层平台的细节。

跨端容器通常使用虚拟化技术来实现平台无关性。例如，Java 虚拟机（JVM）是一种跨平台容器，它可以在不同的操作系统上运行 Java 应用程序。类似地，Docker 是一种跨平台容器，它可以将应用程序和其依赖项打包到容器中，以保证在不同的环境中具有一致的行为。

在移动应用开发中，跨平台容器也被称为跨平台开发框架或混合开发框架。常见的跨端容器包括 React Native、Flutter、Ionic 等。这些框架可以让开发者使用常见的 Web 技术（如 HTML、CSS 和 JavaScript）来构建原生应用程序，并在多个平台上运行，包括 iOS、Android 和 Web 等。

## 为什么需要跨端

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b2e2e379db394d6c94de65ec9dd8407c~tplv-k3u1fbpfcp-watermark.image?)

1. 开发成本、效率。
2. 一致性体验。
3. 前端开发生态。

## Webview
1. Webview，即网页视图，用于加载网页 Url,并展示其内容的控件。
2. 可以内嵌在移动端 App 内，实现前端混合开发，大多数混合框架都是基于 Webview 的二次开发；比如 Ionic、Cordova。
3. 下面列出了常用的 Webview：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4d4886e4fe3c4eb4a08f09d6a05648e8~tplv-k3u1fbpfcp-watermark.image?)

### Webview 优势
1. 一次开发，处处使用，学习成本低。
2. 随时发布，即时更新，不用下载安装包。
3. 移动设备性能不断提升，性能有保障。
4. 通过 JSBridge 和原生系统交互，实现复杂功能。

### Webview 使用原生能力
Javascript 调用 Native：
1. API 注入：Native 获取 Javascript 环境上下文，对其挂载的对象或者方法进行拦截
2. 使用 Webview URL Scheme 跳转拦截
3. IOS 上 window.webkit.messageHandler 直接通信

Native 调用 Javascript：
1. 直接通过 Webview 暴露的 API 执行 JS 代码
2. IOS webview.stringByEvaluatingJavaScriptFromString
3. Android webview.evaluateJavascript

### Webview 和 Native 通信

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/32e718fa15224feeadbcec11590466f1~tplv-k3u1fbpfcp-watermark.image?)

1. JS 环境中提供通信的 JSBridge。
2. Native 端提供 SDK 响应 JSBridge 发出的调用前端和客户端分别实现对应功能模块。

### 实现一个简易 JSBridge

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2c404a88c9a0490bb1554d1576b02615~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="48%" />

<img src="https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53cf79f1e13b4507a0b934dadcc6ce72~tplv-k3u1fbpfcp-watermark.image?" alt="image.png" width="49%" />

## 小程序

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/178b0f7669fb4047a8b51e4167b04a70~tplv-k3u1fbpfcp-watermark.image?)

1. 微信、支付宝、百度小程序、小米直达号
2. 渲染层-Webview
3. 双线程，多 Webview 架构
4. 数据通信，Native 转发

## React Native/WeeX

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/47d6ac1fc4e04330a5f8817eb10a2e59~tplv-k3u1fbpfcp-watermark.image?)

1. 原生组件渲染
2. React/Vue框架
3. virtual dom
4. JSBridge

## Lynx

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc72752c72b44d98b7376a9c9088cdb3~tplv-k3u1fbpfcp-watermark.image?)

1. Vue
2. JS Core /V8
3. JSBinding
4. Native Ul/Skia

## Flutter

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4300c9dc2ee142579cb4073acc220cbf~tplv-k3u1fbpfcp-watermark.image?)

1. wideget
2. dart vm
3. skia 图形库

## 通用原理

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f54073609a314c038f48395901e07c03~tplv-k3u1fbpfcp-watermark.image?)

1. UI 组件
2. 渲染引擎
3. 逻辑控制引擎
4. 通信桥梁
5. 底层 API 抹平表现差异

## 跨端方案对比

![compare.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5e17feabaae54d87ad36a48613b1fb07~tplv-k3u1fbpfcp-watermark.image?)
