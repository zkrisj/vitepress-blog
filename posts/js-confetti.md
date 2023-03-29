---
date: 16:09 2023/3/29
title: 🎉JavaScript 五彩纸屑库 js-confetti
tags:
- Canvas
description: 如果您有一个页面，您希望用五彩纸屑特效引起您的用户注意，那么这个插件就是为您准备的。
---
## 介绍
如果您有一个页面，您希望用五彩纸屑特效引起您的用户注意，那么这个插件就是为您准备的。去年介绍过一个很好用的插件 [canvas-confetti](https://juejin.cn/post/7150201876066074661)，掘金年度作者投票按钮的特效就是使用的这个，两者对比如下：
1. 两者都提供了 npm 安装和从 cdn 导入两种使用方式。
2. `canvas-confetti` 提供了很多自定义的选项，包括：发射原点、发射数量、扩散角度、发射角度、重力、消失的速度、颜色和形状等。而 `js-confetti` 自定义的选项比较少，但是体积也小了，压缩文件只有 6KB 多。
3. `js-confetti` npm 包体积 35.8 kB，`canvas-confetti` npm 包体积 66.3 kB。
4. `js-confetti` 支持表情符号作为五彩纸屑。
5. 两者特效调用函数都返回 `Promise` 对象，当添加的五彩纸屑由于五彩纸屑的重力物理而从用户屏幕上消失时变成 `resolved` 状态。
6. 另外，`js-confetti` npm 包中包含内置的 TypeScript 类型声明，而 `canvas-confetti` 需要额外的 npm 包 [@types/canvas-confetti](https://www.npmjs.com/package/@types/canvas-confetti) 提供 TypeScript 的类型声明。

## 使用方式
1. NPM 安装：
```
npm i js-confetti
```
```js
import JSConfetti from 'js-confetti'

const confetti = new JSConfetti()

function showConfetti() {
  confetti.addConfetti()
}

showConfetti()
```
<iframe src="https://code.juejin.cn/pen/7208105546606444603"></iframe>

2. 从 CDN 导入 HTML 页面中（也可以将 JS 文件下载到本地）：
```
<script src="https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js"></script>
```
然后访问 `JSConfetti` 全局变量。
```js
const confetti = new JSConfetti()

function showConfetti() {
  confetti.addConfetti()
}

showConfetti()
```
<iframe src="https://code.juejin.cn/pen/7208109119847759906"></iframe>

> 注意：`new JSConfetti()` 将创建 HTML `Canvas` 元素并将其添加到页面，因此可以只创建一个并复用它。

## 类型定义
通过 npm 安装 `js-confetti`，其内置的 TypeScript 类型声明文件如下：
```ts
// Type definitions for js-confetti
// TypeScript Version: 4.1.2

export = JSConfetti;

interface IJSConfettiConfig {
  canvas?: HTMLCanvasElement,
}

interface IAddConfettiConfig {
  confettiRadius?: number,
  confettiNumber?: number,
  confettiColors?: string[],
  emojis?: string[],
  emojiSize?: number,
}

declare class JSConfetti {
  constructor(jsConfettiConfig?: IJSConfettiConfig);

  addConfetti(confettiConfig?: IAddConfettiConfig): Promise<void>;
  clearCanvas(): void;
}
```

## 自定义 `canvas` 元素
如果需要在自定义 `canvas` 元素中使用特效，可以将 `canvas` 元素作为参数传递给 `JSConfetti` 构造函数。
```js
const canvas = document.getElementById('your_custom_canvas_id')
const jsConfetti = new JSConfetti({ canvas })
```
<iframe src="https://code.juejin.cn/pen/7208110991475736635"></iframe>

## 使用表情符号
通过向 `addConfetti` 方法传递选项参数 `emojis` 和 `emojiSize` 来使用表情符号作为五彩纸屑。
```js
const jsConfetti = new JSConfetti()
jsConfetti.addConfetti({
   emojis: ['🌈', '⚡️', '💥', '✨', '💫', '🌸'],
   emojiSize: 20,
})
```

## 自定义五彩纸屑颜色
通过向 `addConfetti` 方法传递选项参数 `confettiColors` 来自定义五彩纸屑颜色。
```js
const jsConfetti = new JSConfetti()
jsConfetti.addConfetti({
  confettiColors: [
    '#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7',
  ],
})
```

## 自定义五彩纸屑半径和数量
通过向 `addConfetti` 方法传递选项参数 `confettiRadius` 和 `confettiNumber` 来使用表情符号作为五彩纸屑。
```js
const jsConfetti = new JSConfetti()
jsConfetti.addConfetti({
  confettiRadius: 6,
  confettiNumber: 500,
})
```
<iframe src="https://code.juejin.cn/pen/7208114926719041592"></iframe>

## 清除画布和结束
通过 `JSConfetti` 类的实例上的 `clearCanvas` 方法清除画布。`addConfetti` 方法返回 `Promise` 对象，特效结束时变成 `resolved` 状态。

<iframe src="https://code.juejin.cn/pen/7208132023825891383"></iframe>