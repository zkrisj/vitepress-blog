---
date: 19:21 2023/3/23
title: 使用 Canvas API 简单制作一个彩色时钟
tags:
- Canvas
description: Canvas 适合绘制大数据量图形元素的图表（如热力图、地理坐标系或平行坐标系上的大规模线图或散点图等），也适合实现某些视觉特效。它还能能够以 png、jpg 或 webp 格式保存图像。
---
## 介绍
`<canvas>` 最早由 Apple 引入 WebKit，用于 Mac OS X 的 DashBoard，随后被各个浏览器实现。如今，所有主流的浏览器都支持它。Canvas API 提供了一个通过 JavaScript 和 HTML 的 `<canvas>` 元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。Canvas 适合绘制大数据量图形元素的图表（如热力图、地理坐标系或平行坐标系上的大规模线图或散点图等），也适合实现某些视觉特效。它还能能够以 png、jpg 或 webp 格式保存图像。Canvas 提供了强大的 Web 绘图能力，所以我们要学会使用它。

## 创建一个画布
默认情况下 `<canvas>` 元素没有边框和内容。默认大小为 300 × 150px（宽 × 高），可以使用 `width` 和 `height` 属性指定。
```html
<canvas id="canvas"></canvas>
```

## 获取画布和半径
为了在 `<canvas>` 上绘制图形，我们需要使用一个 JavaScript 上下文对象，它能动态创建图像。这里建立了一个 `CanvasRenderingContext2D` 二维渲染上下文。
```js
const ctx = canvas.getContext('2d');
let radius = canvas.height / 2;
```

## 绘制圆周和时钟中心
- beginPath() 用来起始一条路径，或重置当前路径。
- arc() 用于创建圆形或弧形。
- fill() 用来填充图形。
- stroke() 用来绘制路径。
```js
function drawFace(context, radius) {
context.beginPath();
context.arc(0, 0, radius, 0, 2 * Math.PI);
context.fillStyle = 'white';
context.fill();
// 重置路径 画时钟中心圆点
context.beginPath();
context.arc(0, 0, radius * 0.06, 0, 2 * Math.PI);
context.fillStyle = 'green';
context.fill();
}
```

## 绘制表盘数字
- rotate() 用来旋转当前绘图。360 度角等于 Math.PI * 2，Math.PI / 6 就是 30 度角。
- translate() 用来将原点移动到新位置。
- fillText() 用来绘制文本。
```js
function drawNumbers(context, radius) {
context.fillStyle = 'green';
context.font = radius * 0.15 + 'px arial';
context.textBaseline = 'middle';
context.textAlign = 'center';
for (let num = 1; num <= 12; num++) {
const angle = num * Math.PI / 6;
context.rotate(angle);
context.translate(0, -radius * 0.82);
context.rotate(-angle);
context.fillText(num.toString(), 0, 0);
context.rotate(angle);
context.translate(0, radius * 0.82);
context.rotate(-angle);
}
}
```

## 绘制表盘刻度
- moveTo() 移动路径到指定点。
- lineTo() 添加一个新点，并创建从最后指定点到该点的线条。
```js
function drawLine(context, radius) {
context.lineCap = 'butt';
for (let i = 1; i <= 60; i++) {
context.strokeStyle = i % 5 === 0 ? 'yellowgreen' : 'lightgray';
context.beginPath();
context.lineWidth = i % 5 === 0 ? radius * 0.03 : radius * 0.02;
context.rotate(i * Math.PI / 30);
context.moveTo(0, -radius);
context.lineTo(0, i % 5 === 0 ? -radius * 0.93 : -radius * 0.96);
context.stroke();
context.rotate(-i * Math.PI / 30);
}
}
```

## 绘制表盘时、分、秒针
```js
function drawTime(context, radius) {
const date = new Date();
const h = date.getHours();
const m = date.getMinutes();
const s = date.getSeconds();
const hourAngle = (h * Math.PI / 6) + (m * Math.PI / (6 * 60)) + (s * Math.PI / (6 * 60 * 60));
const minuteAngle = (m * Math.PI / 30) + (s * Math.PI / (30 * 60));
const secondAngle = (s * Math.PI / 30);
drawHand(context, hourAngle, radius * 0.5, radius * 0.05, 'green');
drawHand(context, minuteAngle, radius * 0.7, radius * 0.04, 'dodgerblue');
drawHand(context, secondAngle, radius * 0.9, radius * 0.02, 'orange');
}

function drawHand(context, angle, length, width, color) {
context.beginPath();
context.lineWidth = width;
context.lineCap = 'round'; // 圆形末端
context.moveTo(0, 0);
context.rotate(angle);
context.lineTo(0, -length);
context.strokeStyle = color;
context.stroke();
context.rotate(-angle);
}
```

## 添加样式
由于 canvas 画圆会有锯齿，这里使用 CSS 样式会更圆润。
```css
canvas {
  background: green;
  border-radius: 50%;
}
```

## 启动时钟
translate(radius, radius) 将位置移动到画布中心。
```js
ctx.translate(radius, radius);
radius = radius * 0.9; // 时钟半径
function draw() {
drawFace(ctx, radius);
drawNumbers(ctx, radius);
drawLine(ctx, radius);
drawTime(ctx, radius);
requestAnimationFrame(draw);
}
draw();
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7157738025919709214"></iframe>