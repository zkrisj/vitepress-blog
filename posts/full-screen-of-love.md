---
date: 22:26 2023/3/23
title: 使用 Canvas 制作满屏爱心和文字动画
tags:
- Canvas
description: 获取 canvas 对象和上下文，初始化变量：窗口宽高、爱心和文字总数量、包含爱心和文字的数组，定义爱心图片，图片 src 可以是 base64 字符串类型或者本地图片文件和网络图片链接。
---
## 介绍
`<canvas>` 最早由 Apple 引入 WebKit，用于 Mac OS X 的 Dashboard，随后被各个浏览器实现。如今，所有主流的浏览器都支持它。Canvas API 提供了一个通过 JavaScript 和 HTML 的 `<canvas>` 元素来绘制图形的方式。它可以用于动画、游戏画面、数据可视化、图片编辑以及实时视频处理等方面。Canvas 适合绘制大数据量图形元素的图表（如热力图、地理坐标系或平行坐标系上的大规模线图或散点图等），也适合实现某些视觉特效。它还能能够以 png、jpg 或 webp 格式保存图像。Canvas 提供了强大的 Web 绘图能力，所以我们要学会使用它。

效果如下：

![CPT2211112159-785x407.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/095e5bd64b2340cf9045200d266fbc41~tplv-k3u1fbpfcp-watermark.image?)

## 步骤
1. 准备一个 canvas 元素。
```html
<canvas id="drawHeart"></canvas>
```

2. 获取 canvas 对象和上下文，初始化变量：窗口宽高、爱心和文字总数量、包含爱心和文字的数组，定义爱心图片，图片 src 可以是 base64 字符串类型或者本地图片文件和网络图片链接。
```js
const canvas = document.getElementById('drawHeart');
const ctx = canvas.getContext('2d');
let wW = window.innerWidth;
let wH = window.innerHeight;
const num = 100;
const hearts = [];
const heartImage = new Image();
heartImage.src = 'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path id="heart" d="M10,30 A20,20,0,0,1,50,30 A20,20,0,0,1,90,30 Q90,60,50,90 Q10,60,10,30 Z" fill="red"/></svg>';
```

3. 定义一个 Heart 类，构造函数参数 type 标识用来判断实例为爱心图片还是文字类型，定义重绘方法 draw 和更新方法 update。
```js
class Heart {
  constructor(type) {
    this.type = type;
    // 初始化生成范围
    this.x = Math.random() * wW;
    this.y = Math.random() * wH;
    this.opacity = Math.random() * .5 + .5;
    // 偏移量
    this.vel = {
      x: (Math.random() - .5) * 5,
      y: (Math.random() - .5) * 5
    }
    this.initialW = wW * .5;
    this.initialH = wH * .5;
    // 缩放比例
    this.targetScale = Math.random() * .15 + .02; // 最小0.02
    this.scale = Math.random() * this.targetScale;
    // 文字位置
    this.fx = Math.random() * wW;
    this.fy = Math.random() * wH;
    this.fs = Math.random() * 10;
    this.text = getText();
    this.fvel = {
      x: (Math.random() - .5) * 5,
      y: (Math.random() - .5) * 5,
      f: (Math.random() - .5) * 2
    }
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.drawImage(heartImage, this.x, this.y, this.width, this.height);
    // ctx.scale(this.scale + 1, this.scale + 1);
    if (!this.type) {
      // 设置文字属性
      ctx.fillStyle = getColor();
      ctx.font = 'italic ' + this.fs + 'px sans-serif';
      // 填充字符串
      ctx.fillText(this.text, this.fx, this.fy);
    }
    ctx.restore();
  }
  update() {
    this.x += this.vel.x;
    this.y += this.vel.y;
    if (this.x - this.width > wW || this.x + this.width < 0) {
      // 重新初始化位置
      this.scale = 0;
      this.x = Math.random() * wW;
      this.y = Math.random() * wH;
    }
    if (this.y - this.height > wH || this.y + this.height < 0) {
      // 重新初始化位置
      this.scale = 0;
      this.x = Math.random() * wW;
      this.y = Math.random() * wH;
    }
    // 放大
    this.scale += (this.targetScale - this.scale) * .1;
    this.height = this.scale * this.initialH;
    this.width = this.height * 1.4;
    // -----文字-----
    this.fx += this.fvel.x;
    this.fy += this.fvel.y;
    this.fs += this.fvel.f;
    if (this.fs > 50) {
      this.fs = 2;
    }
    if (this.fx - this.fs > wW || this.fx + this.fs < 0) {
      // 重新初始化位置
      this.fx = Math.random() * wW;
      this.fy = Math.random() * wH;
    }
    if (this.fy - this.fs > wH || this.fy + this.fs < 0) {
      // 重新初始化位置
      this.fx = Math.random() * wW;
      this.fy = Math.random() * wH;
    }
  }
}
```

4. 定义一个获取随机文字的方法，用来动态渲染屏幕文字。
```js
function getText() {
  const val = Math.random() * 10;
  if (val > 1 && val <= 3) {
    return 'always';
  } else if (val > 3 && val <= 5) {
    return 'zzy';
  } else if (val > 5 && val <= 8) {
    return 'taylor swift';
  } else {
    return 'I Love You';
  }
}
```

5. 定义一个获取随机颜色的方法，用来动态渲染屏幕文字颜色。
```js
function getColor() {
  const val = Math.random() * 10;
  if (val > 0 && val <= 1) {
    return '#00f';
  } else if (val > 1 && val <= 2) {
    return '#f00';
  } else if (val > 2 && val <= 3) {
    return '#0f0';
  } else if (val > 3 && val <= 4) {
    return '#368';
  } else if (val > 4 && val <= 5) {
    return '#666';
  } else if (val > 5 && val <= 6) {
    return '#333';
  } else if (val > 6 && val <= 7) {
    return '#f50';
  } else if (val > 7 && val <= 8) {
    return '#e96d5b';
  } else if (val > 8 && val <= 9) {
    return '#5be9e9';
  } else {
    return '#d41d50';
  }
}
```

6. 定义渲染和初始化方法，添加 resize 事件，在窗口调整大小时自动适应。
```js
function init() {
  canvas.width = wW;
  canvas.height = wH;
  for (let i = 0; i < num; i++) {
    hearts.push(new Heart(i % 5));
  }
  render();
}

function render() {
  ctx.clearRect(0, 0, wW, wH);
  for (let i = 0; i < hearts.length; i++) {
    hearts[i].draw();
    hearts[i].update();
  }
  setTimeout(render, 60);
}

init();
window.addEventListener('resize', function() {
  canvas.width = wW = window.innerWidth;
  canvas.height = wH = window.innerHeight;
});
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7164756645069733925"></iframe>

## 参考资料
[canvas实现满屏爱心](https://blog.csdn.net/qq_48802092/article/details/126159322)