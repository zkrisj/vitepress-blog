---
date: 22:45 2023/3/23
title: Canvas drawImage() 方法实现图片压缩
tags:
- Canvas
description: CanvasRenderingContext2D.drawImage() 方法可以从页面 DOM 元素作为图像源来根据坐标和大小重新绘制该图像。HTMLCanvasElement.toDataURL() 和 HTMLCanvasElement.toBlob() 方法支持导出为 base64 字符串或 Blob 对象。
---
## 图片压缩原理
1. CanvasRenderingContext2D.drawImage() 方法可以从页面 DOM 元素作为图像源来根据坐标和大小重新绘制该图像。
2. HTMLCanvasElement.toDataURL() 和 HTMLCanvasElement.toBlob() 方法支持导出为 base64 字符串或 Blob 对象。

## CanvasRenderingContext2D.drawImage()
```js
drawImage(image, dx, dy)
drawImage(image, dx, dy, dWidth, dHeight)
drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)
```
- image
    - 绘制到上下文的元素。允许任何的画布图像源，包括 canvas、img、svg、video 元素和 ImageBitmap 对象等。
- dx, dy, dWidth, dHeight
    - 这几个属性表示在 canvas 画布上指定一片区域用来放置图片，dx、dy 指定图片的左上角在 canvas 上的坐标，dWidth、dHeight 指定图片在 canvas 上绘制的区域宽高。如果没有指定 sx、sy、sWidth、sHeight 这4个参数，则图片会被拉伸或缩放在 canvas 区域内。
- sx, sy, swidth, sheight
    - 这几个属性是针对图片元素的，表示图片在 canvas 画布上显示的大小和位置。sx、sy 表示在图片上作为左上角的坐标，然后往右下角方向 swidth、sheight 尺寸范围作为最终在 canvas 上显示的图片内容。

图片压缩，需要使用的是 CanvasRenderingContext2D.drawImage() 5个参数的语法，即指定图片的左上角在 canvas 上的坐标为 0 0，图片在 canvas 上绘制的区域宽高为 canvas 的宽高。例如，图片的原始尺寸是 `4000*3000`，现在要把尺寸限制为 `400*300` 大小。
```js
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
canvas.width = 400;
canvas.height = 300;
context.drawImage(img,0,0,canvas.width,canvas.height);
```

> 如果需要将转换后的图像渲染到页面 DOM 元素，可以使用 HTMLCanvasElement.toDataURL() 方法来获取转换后的图像 base64 格式信息的字符串传递给 img 元素的 src。或使用 HTMLCanvasElement.toBlob() 方法获取 Blob 格式的对象，然后使用 URL.createObjectURL() 获取对象 URL 传递给 img 元素的 src。也可以将该 base64 字符串或 Blob 对象上传到后端服务器。

## HTMLCanvasElement.toDataURL()
该方法将图片转换成 base64 格式信息的字符串表示法。
```js
toDataURL()
toDataURL(type)
toDataURL(type, encoderOptions)
```
- type 可选
    - 图片格式，默认为 image/png。File 或 Blob 对象中的 type 属性可以传到此参数。
- encoderOptions 可选
    - 在指定图片格式为 image/jpeg 或 image/webp 时，可以从 0 到 1 的区间内选择图片的质量。默认值 0.92 是一个比较合理的图片质量输出参数，通常情况下，我们无需再设定。如果超出取值范围，或使用其他类型参数会被忽略。

### HTMLCanvasElement.toBlob()
- 比 HTMLCanvasElement.toDataURL() 方法多了一个 callback 参数，其他参数相同。
- 该方法是异步的，无返回值，需要在 callback 回调方法中处理转换结果。
- callback 回调方法参数是转换好的包含 canvas 画布上的图像的 Blob 对象，如果图像未被成功创建，可能会获得 null 值。
```js
toBlob(callback)
toBlob(callback, type)
toBlob(callback, type, quality)
```

## 示例
下面原始图片 `1920*1200` 的大小为 84867 字节（大约 83KB），压缩成 `400*300` 后大小仅为 16354 字节（约 16KB）。

<iframe src="https://code.juejin.cn/pen/7166639452587032583"></iframe>