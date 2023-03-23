---
date: 16:26 2023/3/23
title: Canvas Confetti 五彩纸屑特效 JS 插件
tags:
- Canvas
description: canvas-confetti 是一个 canvas 五彩纸屑特效 JS 插件，体积只有 10 KB 左右大小。可以用来制作烟花等特效。
---
## 介绍
canvas-confetti 是一个使用 canvas 的五彩纸屑特效 JS 插件。先看下效果：

<iframe src="https://code.juejin.cn/pen/7150195820950716452"></iframe>

## 使用方式
1. NPM 安装：
```
npm install --save canvas-confetti
```
```js
import confetti from 'canvas-confetti'
confetti()
```

2. 从 CDN 导入 HTML 页面中（也可以将 JS 文件下载到本地，体积只有 10 KB 左右大小）：
```
<script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js" defer></script>
```
然后在页面中任意地方调用 `confetti()` 方法即可显示特效。

## 控制发射原点
- origin.x：Number（默认值：0.5）：发射的水平方向原点，0 表示左边缘，1 表示右边缘。
- origin.y：Number (默认值: 0.5) :发射的垂直方向原点，0 表示上边缘，1 表示下边缘。
```js
app.onclick = e => confetti({
  origin: {
    x: e.clientX / innerWidth,
    y: e.clientY / innerHeight
  }
});
```
这里的 e.clientX / innerWidth 表示鼠标事件的 X 坐标除以窗口的内部宽度，e.clientY / innerHeight 表示鼠标事件的 Y 坐标除以窗口的内部高度。

<iframe src="https://code.juejin.cn/pen/7149933809293590532"></iframe>

## 控制数量和扩散角度
- particleCount：Number（默认值：50），要发射的五彩纸屑的数量。
- spread：Number（默认值：45），五彩纸屑在垂直方向扩散的角度，45 表示五彩纸屑以垂直方向正负 22.5 度角发射。
```js
app.onclick = e => confetti({
  particleCount: 200,
  spread: 180,
  origin: {
    x: e.clientX / innerWidth,
    y: e.clientY / innerHeight
  }
});
```
<iframe src="https://code.juejin.cn/pen/7150164667837448223"></iframe>

## 控制发射角度
- angle：Number（默认值：90）：发射的角度，0 表示水平向右；90 表示垂直向上；180 表示水平向左；270 表示垂直向下。
```js
function randomInRange(min, max) {
  return Math.random() * (max - min) + min;
}
app.onclick = e => confetti({
  particleCount: 200,
  spread: 180,
  angle: randomInRange(0, 360),
  origin: {
    x: e.clientX / innerWidth,
    y: e.clientY / innerHeight
  }
});
```
<iframe src="https://code.juejin.cn/pen/7150172729042272287"></iframe>

## 控制重力和消失的速度
- gravity：Number（默认值：1），粒子下落的速度。1 是全重力，0.5 是半重力，0 表示无重力；大于 1 表示加速下落，负值表示粒子会向上升起。
- ticks：Number (默认值: 200) ，值越小粒子消失得越快，值越大粒子消失得越慢。
- startVelocity：Number（默认值：45），五彩纸屑开始移动的速度，以像素为单位。
```js
app.onclick = e => confetti({
  particleCount: 400,
  spread: 180,
  shapes: ['circle', 'circle', 'square'],
  gravity: 0,
  startVelocity: 30,
  ticks: 1000,
  origin: {
    x: e.clientX / innerWidth,
    y: e.clientY / innerHeight
  }
});
```
<iframe src="https://code.juejin.cn/pen/7150179287486693412"></iframe>

## 控制颜色和形状
- colors Array：颜色字符串数组，采用 HEX 格式（# + 3 位或 6 位十六进制数字），可以重复颜色来增加比例，例如 ['#f00', '#f00', '#f00', '#f00', '#0f0', '#00f', '#ff0'] 表示红色占七分之四，绿色、蓝色、黄色各占七分之一比例。
- shapes Array：五彩纸屑的形状数组，可以为 square 和 circle。默认设置是均匀混合使用这两种形状。['circle', 'circle', 'square'] 表示使用三分之二的圆圈和三分之一的正方形。

<iframe src="https://code.juejin.cn/pen/7150498720264486944"></iframe>

## 烟花特效
<iframe src="https://code.juejin.cn/pen/7150188321468055584"></iframe>

## 雪花特效
<iframe src="https://code.juejin.cn/pen/7150192496214016011"></iframe>

## 庆祝特效
<iframe src="https://code.juejin.cn/pen/7150194268496691214"></iframe>

## 自定义 confetti
```ts
confetti.create(canvas, [globalOptions]): Function
```
此方法创建一个使用自定义 `canvas` 元素的 `confetti` 函数实例。例如，可以通过提供自己的 `canvas` 元素来限制五彩纸屑出现的位置。
- 默认情况下，此方法不会以任何方式修改 `canvas` 元素（除了绘制它）。
- 另外，应该保留自定义实例并避免使用同一 `canvas` 元素多次初始化 `confetti` 函数实例。

`globalOptions` 具有以下属性：
- `resize Boolean`（默认值：`false`）：是否允许设置 `canvas` 元素图像大小，以及是否在窗口改变大小（例如调整窗口大小、旋转移动设备等）时保持正确大小。默认情况下，不会修改 `canvas` 元素大小。
- `useWorker Boolean`（默认值：`false`）：是否尽可能使用异步 web worker 来渲染五彩纸屑动画。默认关闭，这意味着动画将始终在主线程上执行。如果打开并且浏览器支持它，动画将在主线程之外执行，这样它就不会阻塞页面其他工作。使用此选项也将修改 `canvas` 元素，你不能再以任何方式尝试使用 `canvas` 元素（除了将其从 DOM 中删除），它会引发错误。因为当使用 worker 进行渲染时， `canvas` 元素的控制权必须转移给 web worker，以防止在主线程上使用该 `canvas` 元素。如果你必须以其他方式操纵 `canvas` 元素，请不要使用此选项。如果浏览器不支持，该值将被忽略。
- `disableForReducedMotion Boolean`（默认值：`false`）：当设置了 [prefer reduced motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion) 媒体查询时完全禁用五彩纸屑。当设置为 `true` 时，使用此 `confetti` 函数实例将始终接受用户减少页面动效的请求并为他们禁用五彩纸屑。

<iframe src="https://code.juejin.cn/pen/7203695990552363068"></iframe>
