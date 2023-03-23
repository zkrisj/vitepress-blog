---
date: 22:16 2023/3/23
title: 新 CSS 属性 offset-path 使元素沿着不规则路径运动
tags:
- CSS
description: SVG SMIL animation 可以很容易实现元素沿着不规则的路径运动动画，但由于其依赖 SVG 元素和 HTML 属性，容易造成复用时的冗余，不利于维护。新 CSS 属性 offset-path 可以看成是其替代方案，它指定了元素的运动路径，并定义元素在父容器或 SVG 坐标系中的定位。
---
## 介绍
SVG SMIL animation 可以很容易实现元素沿着不规则的路径运动动画，但由于其依赖 SVG 元素和 HTML 属性，容易造成复用时的冗余，不利于维护。新 CSS 属性 offset-path 可以看成是其替代方案，它指定了元素的运动路径，并定义元素在父容器或 SVG 坐标系中的定位。

![微信截图_20221109205634.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bf225d6fb2c142fcb00103eebc816f05~tplv-k3u1fbpfcp-watermark.image?)

与其相关的几个属性：
- offset-distance 指定元素沿 offset-path 路径运动的距离，可以是数值或者百分比单位，100% 则表示把所有的路径都跑完了。
- offset-position 定义元素的 offset-path 初始位置，类似于属性 background-position。
- offset-anchor 指定 offset-path 路径框内的原点，其属性值和 transform-origin 类似。
- offset-rotate 定义元素沿 offset-path 路径的角度，默认是 auto，表示自动计算当前路径的切线方向，并朝着这个方向前进。

offset-anchor、offset-distance、offset-path、offset-position、offset-rotate 可以简写为一个属性 offset。
```
[ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> || <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]?  
```

## 使用
只需要设置元素的 offset-path 和原路径重合即可。

<iframe src="https://code.juejin.cn/pen/7164021657483345933"></iframe>

作为对比，下面是使用 SVG SMIL animateMotion 元素实现的动画。

<iframe src="https://code.juejin.cn/pen/7163848226150285326"></iframe>

## 示例
下面这个示例则是一个剪刀沿着一个房子图形运动的轨迹动画。
```html
<body>
  <svg xmlns="http://www.w3.org/2000/svg"
    width="700"
    height="450"
    viewBox="350 0 1400 900">
    <rect x="595" y="423" width="610" height="377" fill="blue" />
    <polygon points="506,423 900,190 1294,423" fill="yellow" />
    <polygon points="993,245 993,190 1086,190 1086,300" fill="red" />
    <path
      id="house"
      d="M900,190 L993,245 V201 A11,11 0 0,1 1004,190 H1075 A11,11 0 0,1 1086,201 V300 L1294,423 H1216 A11,11 0 0,0 1205,434 V789 A11,11 0 0,1 1194,800 H606 A11,11 0 0,1 595,789 V434 A11,11 0 0,0 584,423 H506 L900,190"
      fill="none"
      stroke="black"
      stroke-width="13"
      stroke-linejoin="round"
      stroke-linecap="round" />
    <path
      class="scissorHalf"
      d="M30,0 H-10 A10,10 0 0,0 -20,10 A20,20 0 1,1 -40,-10 H20 A10,10 0 0,1 30,0 M-40,20 A10,10 1 0,0 -40,0 A10,10 1 0,0 -40,20 M0,0"
      transform="translate(0,0)"
      fill="green"
      stroke="black"
      stroke-width="5"
      stroke-linejoin="round"
      stroke-linecap="round"
      fill-rule="evenodd" />
    <path
      class="scissorHalf"
      d="M30,0 H-10 A10,10 0 0,1 -20,-10 A20,20 0 1,0 -40,10 H20 A10,10 0 0,0 30,0 M-40,-20 A10,10 1 0,0 -40,0 A10,10 1 0,0 -40,-20 M0,0"
      transform="translate(0,0)"
      fill="forestgreen"
      stroke="black"
      stroke-width="5"
      stroke-linejoin="round"
      stroke-linecap="round"
      fill-rule="evenodd" />
  </svg>
</body>
<style>
  .scissorHalf {
    offset-path: path(
      "M900,190  L993,245 V201  A11,11 0 0,1 1004,190  H1075  A11,11 0 0,1 1086,201  V300  L1294,423 H1216  A11,11 0 0,0 1205,434  V789  A11,11 0 0,1 1194,800  H606  A11,11 0 0,1 595,789  V434  A11,11 0 0,0 584,423  H506 L900,190"
    );
    animation: followpath 10s linear infinite;
  }
  @keyframes followpath {
    to {
      offset-distance: 100%;
    }
  }
</style>
```

<iframe src="https://code.juejin.cn/pen/7164022969734266894"></iframe>

## 浏览器兼容
目前只有 Safari 浏览器不支持 offset-path 的路径函数。

## 参考资料
- [使用 CSS offset-path 让元素沿着不规则路径运动](https://www.zhangxinxu.com/wordpress/2017/03/offset-path-css-animation/)