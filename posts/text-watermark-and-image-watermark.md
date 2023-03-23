---
date: 22:49 2023/3/23
title: Canvas 实现文字水印和图片水印合成
tags:
- Canvas
description: CanvasRenderingContext2D.drawImage(image, dx, dy, dWidth, dHeight) 方法可以从页面 DOM 元素作为图像源来根据坐标和大小重新绘制该图像。HTMLCanvasElement.toDataURL() 方法支持导出为 base64 字符串。
---
## 介绍
给图片添加水印可以帮助网站或作者保护自己的版权，或防止内容被别人利用。给图片添加水印分为添加文字水印和添加图片水印，水印一般都做成半透明的，这样不至于影响原图内容的浏览。Canvas 图片水印合成与 [Canvas 实现图片压缩](https://juejin.cn/post/7166916696899321869) 原理基本相同：
1. CanvasRenderingContext2D.drawImage(image, dx, dy, dWidth, dHeight) 方法可以从页面 DOM 元素作为图像源来根据坐标和大小重新绘制该图像。
2. HTMLCanvasElement.toDataURL() 方法支持导出为 base64 字符串。

## 文字水印
1. 首先创建一个空的 canvas 元素，并获取其上下文。
```js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
```
2. 获取页面上需要合成水印的 img 元素，或者根据一个 File 或 Blob 对象，创建一个空的 img 元素，将其 src 设为 File 或 Blob 对象的 URL。
3. 设置 canvas 元素的宽高为 img 元素的宽高，清除画布，绘制图像。
```js
canvas.width = img.width;
canvas.height = img.height;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
```
4. 设置字体、对齐方式、旋转角度。
```js
ctx.font = `bold ${img.height / 10}px arial`;
ctx.fillStyle = 'rgba(255, 0, 0, .2)';
ctx.textBaseline = 'bottom';
ctx.transform(1, 0.5, -0.5, 1, 0, -canvas.height / 2);
```
5. 定义水印文字、水印高度，循环绘制水印。
```js
let txt = '1234567 ';
const txtHeight = img.height / 6;
txt = Array(Math.ceil(canvas.width / ctx.measureText(txt).width) * 2).join(txt);
for (let i = 0; i < Math.ceil(canvas.height / txtHeight) * 2; i++) {
  ctx.fillText(txt, 0, i * txtHeight);
}
```
6. 在页面渲染合成后的图像，释放创建的 URL 对象。
```js
result.src = canvas.toDataURL(type);
URL.revokeObjectURL(img.src);
```
7. 马上掘金（由于 canvas 的跨域问题，可能需要点击运行按钮重新运行一下才能看到效果）。

<iframe src="https://code.juejin.cn/pen/7167295362481258535"></iframe>

## 图片水印
1. 首先创建一个空的 canvas 元素，并获取其上下文。
```js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
```
2. 获取页面上需要合成水印的 img 元素，或者根据一个 File 或 Blob 对象，创建一个空的 img 元素，将其 src 设为 File 或 Blob 对象的 URL。
3. 设置 canvas 元素的宽高为 img 元素的宽高，清除画布，绘制图像。
```js
canvas.width = img.width;
canvas.height = img.height;
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
```
4. 设置旋转角度，创建重复图像的模式，绘制水印。
```js
ctx.transform(1, 0.5, -0.5, 1, 0, -canvas.height / 2);
ctx.rect(0, 0, canvas.width, canvas.height);
ctx.fillStyle = ctx.createPattern(imgCover, 'repeat');
ctx.fill();
```
5. 在页面渲染合成后的图像，释放创建的 URL 对象。
```js
result.src = canvas.toDataURL(type);
URL.revokeObjectURL(img.src);
```
6. 马上掘金（由于 canvas 的跨域问题，可能需要点击运行按钮重新运行一下才能看到效果）。

<iframe src="https://code.juejin.cn/pen/7167344907751784487"></iframe>