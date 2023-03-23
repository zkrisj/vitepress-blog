---
date: 23:38 2023/3/23
title: 圣诞即将到来，纯 CSS 制作一个圣诞礼物动画
tags:
- CSS
description: 使用 CSS clip-path 属性设置蝴蝶结和五角星形状。
---
## 介绍
CSS 动画包括两个部分：描述动画的样式规则和用于指定动画开始、结束以及中间点样式的关键帧。相较于传统的脚本实现动画技术，使用 CSS 动画有三个主要优点：
1. 能够非常容易地创建简单动画，你甚至不需要了解 JavaScript 就能创建动画。
2. 动画运行效果良好，甚至在低性能的系统上。渲染引擎会使用跳帧或者其他技术以保证动画表现尽可能的流畅。而使用 JavaScript 实现的动画通常表现不佳（除非经过很好的设计）。
3. 让浏览器控制动画序列，允许浏览器优化性能和效果，如降低位于隐藏选项卡中的动画更新频率。

> 创建动画序列，需要使用 animation 属性或其子属性，该属性允许配置动画时间、时长以及其他动画细节，但该属性不能配置动画的实际表现，动画的实际表现是由 @keyframes 规则实现。通过使用 @keyframes 建立两个或两个以上关键帧来实现动画。每一个关键帧都描述了动画元素在给定的时间点上应该如何渲染。因为动画的时间设置是通过 CSS 样式定义的，关键帧使用 percentage 来指定动画发生的时间点。0% 表示动画的第一时刻，100% 表示动画的最终时刻。因为这两个时间点十分重要，所以还有特殊的别名：from 和 to，若 from/0% 或 to/100% 未指定，则浏览器使用计算值开始或结束动画。也可包含 0%-100% 之间的关键帧，描述动画开始和结束之间的状态。

圣诞节即将到来，Codepen 上面大佬使用纯 CSS 制作了一个圣诞礼物动画，效果如下：

![CPT2212111726-366x366.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc8e2805a2604daaa45a3d477be320d2~tplv-k3u1fbpfcp-watermark.image?)

## 定义使用的 CSS 变量
```css
:root {
  --red1: hsl(345, 100%, 48%);
  --red2: hsl(345, 100%, 38%);
  --white1: hsl(0, 0%, 100%);
  --white2: hsl(0, 0%, 90%);
  --blue: hsl(120, 100%, 20%);
}
```
- --red1：系带的颜色。
- --red2：系带的阴影颜色。
- -white1：盒子的颜色。
- -white2：盒子的阴影颜色。
- --blue：页面的背景颜色。

## 添加礼物容器、盒子和盒盖元素
```html
<div class="gift">
  <div class="gift__box"></div>
  <div class="gift__lid"></div>
</div>
```
然后，在盒子元素上面加上盒盖的阴影元素：
```html
<div class="gift__box">
  <div class="gift__lid-shadow"></div>
</div>
```
设置礼物盒子、盒盖阴影、盒盖元素样式，盒子和盒盖上面的系带条纹由 linear-gradient 函数实现：
```css
body {
  background-color: var(--blue);
  color: var(--white1);
  font: 1em/1.5 sans-serif;
  height: 100vh;
  display: grid;
  place-items: center;
  margin: 0;
}
.gift {
  position: relative;
  width: 18em;
  height: 18em;
}
.gift__box,
.gift__lid,
.gift__lid-shadow {
  position: absolute;
}
.gift__box,
.gift__lid,
.gift__lid-shadow {
  transform-origin: 50% 100%;
}
.gift__box {
  background:
    linear-gradient(var(--red2), var(--red2)) 50% 50% / 3.3em 100% no-repeat,
    var(--white2);
  border-radius: 1.5em;
  bottom: 0.5em;
  left: 3.3em;
  overflow: hidden;
  width: 11.4em;
  height: 9em;
}
.gift__lid,
.gift__lid-shadow {
  border-radius: 1em;
  width: 13em;
  height: 3.3em;
}
.gift__lid {
  background:
    linear-gradient(var(--red1), var(--red1)) 50% 50% / 3.3em 100% no-repeat,
    var(--white1);
  bottom: 8.7em;
  left: 2.5em;
}
.gift__lid-shadow {
  background-color: hsla(0, 0%, 0%, 0.1);
  top: -1.5em;
  left: -1em;
}
```
现在我们实现了礼物盒子和它的盒盖的形状：

![微信截图_20221211195413.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e75279d81f54f5284c9b843ae69e96f~tplv-k3u1fbpfcp-watermark.image?)

## 添加系带元素
接下来我们给礼物盒子添加一个蝴蝶结系带，系带分为系带容器和左边、中间、右边元素。
```html
<div class="gift__bow">
  <div class="gift__bow-left"></div>
  <div class="gift__bow-right"></div>
  <div class="gift__bow-center"></div>
</div>
```
设置样式，使用 CSS clip-path 属性设置蝴蝶结形状：
```css
.gift__bow,
.gift__bow-center,
.gift__bow-left,
.gift__bow-right {
  position: absolute;
}
.gift__bow-center,
.gift__bow-left,
.gift__bow-right {
  background-color: var(--red2);
}
.gift__bow {
  bottom: 11em;
  left: 7.5em;
  width: 3em;
  height: 2em;
  transform-origin: 50% 230%;
}
.gift__bow-center {
  border-radius: 1em;
  width: 100%;
  height: 100%;
}
.gift__bow-left,
.gift__bow-right {
  box-shadow: 0 0 0 0.7em var(--red1) inset;
  top: 0.3em;
  width: 4em;
  height: 5em;
  z-index: -1;
}
.gift__bow-left:before,
.gift__bow-right:before {
  background-color: var(--red1);
  border-radius: inherit;
  content: "";
  display: block;
  position: absolute;
  inset: 0;
}
.gift__bow-left {
  border-radius: 1.5em 0 3em 1em / 1.5em 0 3em 3.5em;
  right: calc(100% - 0.75em);
  transform: rotate(35deg);
  transform-origin: 100% 15%;
}
.gift__bow-left:before {
  clip-path: polygon(0 42%, 100% 12%, 100% 100%, 0 100%);
}
.gift__bow-right {
  border-radius: 0 1.5em 1em 3em / 0 1.5em 3.5em 3em;
  left: calc(100% - 0.75em);
  transform: rotate(-35deg);
  transform-origin: 0% 15%;
}
.gift__bow-right:before {
  clip-path: polygon(0 12%, 100% 42%, 100% 100%, 0 100%);
}
```
现在已经实现了一个完整的礼物图片了：

![微信截图_20221211200527.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f546db58f9a04ad5a65c2d2938027045~tplv-k3u1fbpfcp-watermark.image?)

## 添加 CSS 动画
设置动画时长 CSS 变量，分别给礼物盒子、盒盖阴影、盒盖元素、系带容器和左边、右边元素添加 CSS 动画：
```css
.gift {
  --dur: 1.5s;
}
.gift__bow {
  animation: bowBounce var(--dur) ease-in-out infinite;
}
.gift__bow-left {
  animation: bowLeftPivot var(--dur) ease-in-out infinite;
}
.gift__bow-right {
  animation: bowRightPivot var(--dur) ease-in-out infinite;
}
.gift__box {
  animation: boxBounce var(--dur) ease-in-out infinite;
}
.gift__lid {
  animation: lidBounce var(--dur) ease-in-out infinite;
}
.gift__lid-shadow {
  animation: lidShadowBounce var(--dur) ease-in-out infinite;
}
@keyframes bowBounce {
  from,
  50% {
    transform: translateY(0) rotate(0);
  }
  62.5% {
    animation-timing-function: ease-in;
    transform: translateY(75%) rotate(0);
  }
  68.75% {
    animation-timing-function: ease-out;
    transform: translateY(-37.5%) rotate(15deg);
  }
  75% {
    animation-timing-function: ease-in-out;
    transform: translateY(-150%) rotate(5deg);
  }
  87.5% {
    transform: translateY(65%) rotate(-3deg);
  }
  to {
    transform: translateY(0) rotate(0);
  }
}
@keyframes bowLeftPivot {
  from,
  50% {
    transform: rotate(35deg);
  }
  62.5% {
    transform: rotate(45deg);
  }
  75% {
    transform: rotate(30deg);
  }
  87.5% {
    transform: rotate(45deg);
  }
  to {
    transform: rotate(35deg);
  }
}
@keyframes bowRightPivot {
  from,
  50% {
    transform: rotate(-35deg);
  }
  62.5% {
    transform: rotate(-45deg);
  }
  75% {
    transform: rotate(-34deg);
  }
  87.5% {
    transform: rotate(-45deg);
  }
  to {
    transform: rotate(-35deg);
  }
}
@keyframes boxBounce {
  from,
  50% {
    transform: translateY(0) scale(1, 1);
  }
  62.5% {
    transform: translateY(4%) scale(1.12, 0.89);
  }
  75% {
    transform: translateY(-11%) scale(0.92, 1.1);
  }
  87.5% {
    transform: translateY(0) scale(1.05, 0.9);
  }
  to {
    transform: translateY(0) scale(1, 1);
  }
}
@keyframes lidBounce {
  from,
  50% {
    transform: translateY(0) scale(1, 1) rotate(0);
  }
  62.5% {
    animation-timing-function: ease-in;
    transform: translateY(45%) scale(1.14, 0.95) rotate(0);
  }
  68.75% {
    animation-timing-function: ease-out;
    transform: translateY(-22.5%) scale(1.05, 1.03) rotate(15deg);
  }
  75% {
    animation-timing-function: ease-in-out;
    transform: translateY(-90%) scale(0.96, 1.1) rotate(5deg);
  }
  87.5% {
    transform: translateY(30%) scale(1.12, 0.93) rotate(-3deg);
  }
  to {
    transform: translateY(0) scale(1, 1) rotate(0);
  }
}
@keyframes lidShadowBounce {
  from,
  50% {
    transform: translateY(0) scale(1, 1) rotate(0);
  }
  62.5% {
    animation-timing-function: ease-in;
    transform: translateY(10%) scale(1.14, 0.95) rotate(0);
  }
  68.75% {
    animation-timing-function: ease-out;
    transform: translateY(-10%) scale(1.05, 1.03) rotate(15deg);
  }
  75% {
    animation-timing-function: ease-in-out;
    transform: translateY(-30%) scale(0.96, 1.1) rotate(5deg);
  }
  87.5% {
    transform: translateY(10%) scale(1.12, 0.93) rotate(-3deg);
  }
  to {
    transform: translateY(0) scale(1, 1) rotate(0);
  }
}
```
现在我们已经完成了一个完整的礼物图片和循环的弹起动画了，为了让圣诞礼物看起来更炫酷、崭新的样子，可以添加几个闪烁的星星来衬托这个圣诞礼物。
```html
<div class="gift__star gift__star--1"></div>
<div class="gift__star gift__star--2"></div>
<div class="gift__star gift__star--3"></div>
<div class="gift__star gift__star--4"></div>
<div class="gift__star gift__star--5"></div>
```
使用 CSS clip-path 属性设置五角星形状：
```css
.gift__star {
  animation: starRotateCW var(--dur) ease-in infinite;
  background-color: var(--white1);
  clip-path: polygon(50% 0, 65% 35%, 100% 50%, 65% 65%, 50% 100%, 35% 65%, 0 50%, 35% 35%);
  transform: scale(0);
}
.gift__star--2,
.gift__star--4,
.gift__star--5 {
  animation-name: starRotateCCW;
}
.gift__star--1 {
  animation-delay: calc(var(--dur) * 0.5);
  top: 0;
  left: 12.5em;
  width: 1.5em;
  height: 1.5em;
}
.gift__star--2 {
  animation-delay: calc(var(--dur) * 0.125);
  top: 2em;
  left: 10em;
  width: 1.75em;
  height: 1.75em;
}
.gift__star--3 {
  animation-delay: calc(var(--dur) * 0.25);
  top: 8em;
  left: 0;
  width: 1.25em;
  height: 1.25em;
}
.gift__star--4 {
  top: 10.5em;
  right: 0;
  width: 1.75em;
  height: 1.75em;
}
.gift__star--5 {
  animation-delay: calc(var(--dur) * 0.375);
  top: 12em;
  left: 1.8em;
  width: 2.5em;
  height: 2.5em;
}
```
添加五角星闪烁的动画：
```css
@keyframes starRotateCW {
  from {
    transform: scale(0) rotate(0);
  }
  25% {
    animation-timing-function: ease-out;
    transform: scale(1) rotate(0.25turn);
  }
  50%,
  to {
    transform: scale(0) rotate(0.5turn);
  }
}
@keyframes starRotateCCW {
  from {
    transform: scale(0) rotate(0);
  }
  25% {
    animation-timing-function: ease-out;
    transform: scale(1) rotate(-0.25turn);
  }
  50%,
  to {
    transform: scale(0) rotate(-0.5turn);
  }
}
```
## 完整代码+马上掘金
<iframe src="https://code.juejin.cn/pen/7175827138870771771"></iframe>