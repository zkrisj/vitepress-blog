---
date: 22:26 2023/3/23
title: 使用 SVG forginObject 对页面 DOM 元素截图
tags:
- SVG
- Canvas
description: 使用 html2canvas 库可以实现在 node 项目中对页面元素截图。而在不使用第三方库的情况下，利用 SVG 代码可以内联在 base64 字符串中的特性，通过原生的 SVG forginObject 元素也可以实现对 DOM 元素截图。
---
## 介绍
可缩放矢量图形（Scalable Vector Graphics，SVG）是由万维网联盟（W3C）自 1999 年开始开发的开放标准。SVG 能够优雅而简洁地渲染不同大小的图形，并可以和 CSS、DOM 和 SMIL 等其他网络标准无缝衔接。它实现了 DOM 接口，这点比 Canvas 与 JavaScript 交互方便。

SVG 可以通过定义必要的线和形状来创建一个图形，也可以修改已有的位图，或者将这两种方式结合起来创建图形。图形和其组成部分可以转换变形、合成、或者通过滤镜完全改变外观。

和传统的点阵图像模式（例如 JPEG 和 PNG）不同的是，SVG 格式提供的是矢量图，这意味着它的图像能够被无限放大而不失真或降低质量，并且可以方便地修改内容，无需图形编辑器。

> 目前，SVG2.0 正在制定当中，它采用了类似 CSS3 的制定方法，通过若干松散耦合的组件形成一套标准。

## 命名空间
作为 XML 的一个方言，SVG 需要在一个命名空间内（is namespaced）。
- 命名空间声明通过 xmlns（XML Namespaces）属性声明。
- 这意味着这个 `<svg>` 标签和它的子节点都属于 `http://www.w3.org/2000/svg` 这个 SVG 命名空间。
- 浏览器如果能识别这个命名空间，就决定他们如何处理这个标记。
- 但是，如果 SVG 元素是直接内联在 HTML 页面中，则可以不指定命名空间。

## SVG 中的 `<foreignObject>` 元素
- 允许包含来自不同的 XML 命名空间的元素，例如在 SVG 中嵌入 HTML。
- 并可以作为其它标记的容器和 SVG 样式属性的载体。
- 因为 foreignObject 是一个 SVG 元素，所以可以使用任何 SVG 的语法应用到它的内容。

<iframe src="https://code.juejin.cn/pen/7165417827774496806"></iframe>

## 生成图片
使用 html2canvas 库可以实现在 node 项目中对页面元素截图。而在不使用第三方库的情况下，利用 SVG 代码可以内联在 base64 字符串中的特性，通过原生的 SVG forginObject 元素也可以实现对 DOM 元素截图。例如，页面有以下元素：
```html
<div id="box">
  <div style="padding: 1rem; text-align: center;">
    <img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c579b7ac874849dd89b7a9792f6b9412~tplv-k3u1fbpfcp-watermark.image?" crossorigin="Anonymous">
    <p class="name">名称</p>
    <p class="title">标题</p>
  </div>
</div>
```
1. 创建一个空的 canvas  元素和其上下文。
```js
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
```
2. 定义绘制 canvas 图片的方法。
```js
function draw(img) {
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;
  context.clearRect(0, 0, width, height);
  context.drawImage(img, 0, 0);
}
```
3. 定义 DOM 元素转 SVG 元素方法，如果元素中含有 img 元素，需要将 src 属性中的 url 转成base64 字符串。
```js
function dom2Svg(eleTarget) {
  if (!eleTarget) return eleTarget;
  const cloneDom = eleTarget.cloneNode(true);
  if (cloneDom.tagName == 'IMG') {
    draw(cloneDom);
    cloneDom.src = canvas.toDataURL();
  } else cloneDom.querySelectorAll('img').forEach(img => {
    draw(img);
    img.src = canvas.toDataURL();
  });
  const { offsetWidth, offsetHeight } = eleTarget;
  const htmlSvg = `data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="${offsetWidth}" height="${offsetHeight}"><foreignObject x="0" y="0" width="100%" height="100%">${new XMLSerializer().serializeToString(cloneDom) + document.querySelector('style').outerHTML}</foreignObject></svg>`
    .replace(/\n/g, '').replace(/\t/g, '').replace(/#/g, '%23');
  return htmlSvg;
}
```
4. 绑定 DOM 元素点击事件下载转换的图片。
```js
box.addEventListener('click', function(event) {
  const { target } = event;
  if (target !== this) {
    const eleLink = document.createElement('a');
    eleLink.download = Date.now();
    eleLink.style.display = 'none';
    const img = new Image();
    img.onerror = console.error;
    img.onload = function() {
      draw(this);
      eleLink.href = canvas.toDataURL();
      eleLink.click();
    };
    img.src = dom2Svg(target);
  }
});
```

注意事项：
1. 元素的样式需要内联设置在 style 属性上（或将 `<style>` 内联在元素内），才能在 SVG 中生效。
2. 如果元素中含有 img 元素，需要在 img 元素上设置 crossorigin="Anonymous"，否则可能出现跨域报错。
```
Uncaught SecurityError: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported./preview?projectId=7165157247490719751:19:25 Error: Failed to execute 'toDataURL' on 'HTMLCanvasElement': Tainted canvases may not be exported.
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7165157247490719751"></iframe>

## 浏览器支持
目前，除了 IE，其他浏览器均支持 SVG forginObject 元素。

![foreignObject.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c595f77a7260494daec6428ba638881a~tplv-k3u1fbpfcp-watermark.image?)

## 参考资料
[SVG `<foreignObject>` 简介与截图等应用](https://www.zhangxinxu.com/wordpress/2017/08/svg-foreignobject/)