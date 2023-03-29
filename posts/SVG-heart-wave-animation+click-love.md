---
date: 16:07 2023/3/29
title: 代码的浪漫 - SVG 心形波纹动画 + Click Love
tags:
- SVG
description: 当心形的放大倍数大于 18 时，将其调整为 0，并将元素从 svg 子节点中删除并重新添加到子节点列表的末尾处（如果某个节点已经拥有父节点，在被传入 appendChild 方法参数中调用后，它首先会被移除，再被插入到新的位置）。
---
## 介绍
代码的世界可以很简单也可以很浪漫，又到了一年一度秀浪漫的日子（过去几天了），给大家介绍一个 SVG 心形波纹动画和 Click Love 页面点击特效，效果如下：

![动画.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e8538d2d729b4a70961a709130d9f543~tplv-k3u1fbpfcp-watermark.image?)

## SVG 心形波纹动画
1. 定义一个 `svg` 元素。
```js
<svg id="hearts" viewBox="-600 -400 1200 800"
  preserveAspectRatio="xMidYMid slice">
  <symbol id="heart" viewBox="-69 -16 138 138">
    <path d="M0,12 C 50,-30 110,50  0,120 C-110,50 -50,-30 0,12z" />
  </symbol>
</svg>
```
- `viewBox` 属性的值是一个包含四个数字的列表：`x`、`y`、`width` 和 `height`。`x` 和 `y` 表示视口的左上角坐标，`width` 和 `height` 代表它的尺寸。这些数字由空格或逗号分隔，指定了用户空间中的一个矩形，指定了 `svg` 元素的视口边界（而非浏览器视口）。
- `preserveAspectRatio` 属性指示具有提供给定纵横比的 `viewBox` 的元素必须如何适应具有不同纵横比的视口。因为 SVG 图像的纵横比是由 `viewBox` 属性定义的，所以如果未设置该属性，则 `preserveAspectRatio` 属性无效（有一个例外，对于 `<image>` 元素，`preserveAspectRatio` 定义引用图像应如何适合 `<image>` 元素定义的矩形）。
    - `xMidYMid`（默认值）- 表示强制统一缩放。将元素的 `viewBox` 的中点 `x` 值与视口的中点 `x` 值对齐；将元素的 `viewBox` 的中点 `y` 值与视口的中点 `y` 值对齐。
    - 第二个参数是可选的：`meet`（默认）表示缩放图形，整个 `viewBox` 在视口中可见；`slice` 表示缩放图形，但 `viewBox` 绘制的区域大于视口。
- 使用 `symbol` 元素定义了一个图形模板对象，下面可以使用 `use` 元素复用这个模板。

2. 定义颜色数组、心形数组。
```js
const colors = ["#e03776", "#8f3e98", "#4687bf", "#3bab6f", "#f9c25e", "#f47274"];
const hearts = [];
```

3. 向心形数组添加 `symbol` 元素的 `use` 元素实例。
```js
function useTheHeart(n) {
  const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
  use.n = n;
  use.setAttribute('href', '#heart');
  use.setAttribute('transform', `scale(${use.n})`);
  use.setAttribute('fill', colors[n % colors.length]);
  use.setAttribute('x', -69);
  use.setAttribute('y', -69);
  use.setAttribute('width', 138);
  use.setAttribute('height', 138);
  hearts.push(use);
  svg.appendChild(use);
}
for (let n = 18; n >= 0; n--) useTheHeart(n);
```
- `use` 元素实例的 `x`、`y`、`width` 和 `height` 属性需要和 `symbol` 元素的 `viewBox` 坐标系相对应。
- 根据 `use` 元素的序号对其进行放大指定倍数，同时将放大倍数绑定到元素上。

4. 定义动画函数。
```js
function Frame() {
  window.requestAnimationFrame(Frame);
  for (let i = 0; i < hearts.length; i++) {
    if (hearts[i].n < 18) {
      hearts[i].n += .01;
    } else {
      hearts[i].n = 0;
      svg.appendChild(hearts[i]);
    }
    hearts[i].setAttribute('transform', `scale(${hearts[i].n})`);
  }
}
Frame();
```
- 循环遍历 `hearts` 数组，将每个心形放大倍数 `+= .01`。
- 当心形的放大倍数大于 `18` 时，将其调整为 `0`，并将元素从 `svg` 子节点中删除并重新添加到子节点列表的末尾处（如果某个节点已经拥有父节点，在被传入 `appendChild` 方法参数中调用后，它首先会被移除，再被插入到新的位置）。

## Click Love 页面点击特效
这是一个迷你的页面小插件，体积只有 1KB 多，通过 `script` 标签引入后，点击页面任意处会出现小爱心的图形。源码如下：
```js
!function(e,t,a){function r(){for(var e=0;e<n.length;e++)n[e].alpha<=0?(t.body.removeChild(n[e].el),n.splice(e,1)):(n[e].y--,n[e].scale+=.004,n[e].alpha-=.013,n[e].el.style.cssText="left:"+n[e].x+"px;top:"+n[e].y+"px;opacity:"+n[e].alpha+";transform:scale("+n[e].scale+","+n[e].scale+") rotate(45deg);background:"+n[e].color+";z-index:99999");requestAnimationFrame(r)}var n=[];e.requestAnimationFrame=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.oRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,1e3/60)},function(e){var a=t.createElement("style");a.type="text/css";try{a.appendChild(t.createTextNode(e))}catch(t){a.styleSheet.cssText=e}t.getElementsByTagName("head")[0].appendChild(a)}(".heart{width: 10px;height: 10px;position: fixed;background: #f00;transform: rotate(45deg);-webkit-transform: rotate(45deg);-moz-transform: rotate(45deg);}.heart:after,.heart:before{content: '';width: inherit;height: inherit;background: inherit;border-radius: 50%;-webkit-border-radius: 50%;-moz-border-radius: 50%;position: fixed;}.heart:after{top: -5px;}.heart:before{left: -5px;}"),function(){var a="function"==typeof e.onclick&&e.onclick;e.onclick=function(e){a&&a(),function(e){var a=t.createElement("div");a.className="heart",n.push({el:a,x:e.clientX-5,y:e.clientY-5,scale:1,alpha:1,color:"rgb("+~~(255*Math.random())+","+~~(255*Math.random())+","+~~(255*Math.random())+")"}),t.body.appendChild(a)}(e)}}(),r()}(window,document);
```
将以上代码保存为一个 JS 文件，通过 `script` 标签引入到页面即可开启动效。

## 码上掘金

<iframe src="https://code.juejin.cn/pen/7203751914763190330"></iframe>