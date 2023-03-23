---
date: 20:57 2023/3/23
title: 制作一个循环滚动的相册集
tags:
- CSS
- JS
description: 最后一个参数 animation-direction 的值 reverse 表示反向运行动画，每周期结束动画由尾到头运行。改成 normal，相册将从右向左循环滚动。
---
## 介绍
效果如下：

![chrome-capture-2022-9-28.gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de93d2d098a04945b5b147ad83bb311b~tplv-k3u1fbpfcp-watermark.image?)

## HTML
相册最后要补一个第一张图片的 img 元素，可以无缝循环。
```html
<div id="homeCarousel">
  <div id="homeCarouselWrap">
    <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1c406fa6844c33aa2097917494e643~tplv-k3u1fbpfcp-watermark.image?">
    <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d7898bd97e2449b5b72b76c114e84dfc~tplv-k3u1fbpfcp-watermark.image?">
    <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d25a89459f264d3d860c4533bdef6a68~tplv-k3u1fbpfcp-watermark.image?">
    <img src="https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a1c406fa6844c33aa2097917494e643~tplv-k3u1fbpfcp-watermark.image?">
  </div>
</div>
<div id="modal">
  <span id="closeBtn">×</span>
  <img id="img2">
</div>
```

## CSS
- --s CSS 变量表示相册的图片数量（不包括最后一个补上的）。
- --w CSS 变量表示相册的宽度。
- :hover 伪类控制鼠标悬浮时，停止滚动。
- animation 是 animation-name，animation-duration, animation-timing-function，animation-delay，animation-iteration-count，animation-direction，animation-fill-mode 和 animation-play-state 属性的一个简写形式。
- `animation: move calc(1s * var(--s)) linear infinite reverse;` 的第二个参数表示 animation-duration，动画的时长，这里使用了 calc 函数，1 秒乘以相册中图片的数量；最后一个参数 animation-direction 的值 reverse 表示反向运行动画，每周期结束动画由尾到头运行。改成 normal，相册将从右向左循环滚动。
```css
body {
  display: grid;
  place-items: center;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
#homeCarousel {
  width: 400px;
  height: 240px;
  line-height: 240px;
  overflow: hidden;
  border: solid rgba(0, 0, 0, 0.1);
}
#homeCarousel #homeCarouselWrap {
  display: flex;
  --w: 400;
  --s: 3;
  animation: move calc(1s * var(--s)) linear infinite reverse;
}
#homeCarousel #homeCarouselWrap>img {
  flex-shrink: 0;
  width: 100%;
  height: 240px;
  cursor: pointer;
  vertical-align: middle;
}
@keyframes move {
  0% {
    transform: translate(0, 0px);
  }
  100% {
    transform: translate(calc(var(--s) * var(--w) * -1px), 0);
  }
}
#homeCarousel #homeCarouselWrap:hover {
  animation-play-state: paused;
}
#modal {
  position: fixed;
  z-index: 1;
  left: 0;
  top: -100%;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.9);
  transition-duration: 0.4s;
  text-align: center;
}
#img2 {
  width: 75%;
  max-height: 80%;
}
#closeBtn {
  position: absolute;
  top: 5%;
  right: 2.5%;
  color: white;
  font-size: 40px;
  font-weight: bold;
  cursor: pointer;
}
@media(max-width: 400px) {
  #closeBtn {
    top: 0;
  }
}
```

## JS
添加鼠标事件，点击相册时预览当前图片。
```js
homeCarousel.onclick = function(e) {
  if(e.target.tagName === 'IMG') {
    modal.style.top = 0;
    modal.style.paddingTop = '12%';
    img2.src = e.target.src;
  }
};
closeBtn.onclick = function() {
  modal.style.top = '-100%';
  modal.style.paddingTop = 0;
};
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7159562726228885541"></iframe>