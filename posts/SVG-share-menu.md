---
date: 21:06 2023/3/23
title: SVG 实现分享菜单按钮的粘滞融合效果
tags:
- SVG
description: 点击分享按钮，弹出常见的社交分享按钮，然后相互间粘滞，同时分享按钮还会抖动动画。
---
## 介绍
CSS filter 属性用于将模糊或颜色偏移等图形效果应用于元素。CSS 标准里包含了一些已实现预定义效果的函数（blur、brightness、contrast、drop-shadow、grayscale、hue-rotate、invert、opacity、saturate、sepia）。也可以通过一个 URL 链接到 SVG 的 filter 滤镜元素的方式来引用一个 SVG 滤镜。

## 效果
点击分享按钮，弹出常见的社交分享按钮，然后相互间粘滞，同时分享按钮还会抖动动画。

![分享菜单粘滞融合效果gif](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/42c4a8dc241348f3bdf4c893d4d611b3~tplv-k3u1fbpfcp-zoom-1.image)

HTML 如下：
```html
<input type="checkbox" id="share">
<div class="target">
  <label class="share" for="share">分享</label>
  <span class="icon-share-weibo"><img src="weibo.png"></span>
  <span class="icon-share-wechat"><img src="wechat.png"></span>
  <span class="icon-share-qq"><img src="qq.png"></span>
</div>
```

## 步骤
1. 添加 SVG 滤镜：
```svg
<svg width="0" height="0" style="position:absolute;">
  <defs>
    <filter id="goo">
      <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
      <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
      <feComposite in="SourceGraphic" in2="goo" operator="atop"/>
    </filter>
  </defs>
</svg>
```
原理：
- 先让图形高斯模糊；
- 再使用 feColorMatrix 滤镜增加 alpha 透明通道的对比度，于是可以把高斯模糊重合的部分进行合并，形成融合效果；
- 最后使用 feComposite 滤镜的 operator 属性的 atop 值让原始的图形在上面显示。
- 对于方形元素而言，其四角边缘因为高斯模糊而变弯了，于是使用 feColorMatrix 滤镜 alpha 通道增强的时候，四边的直角会变成圆角。
- 如果元素原本就是个正圆，则没有这个问题，融合效果最好，因为正圆的高斯模糊它是均匀的。
2. 在需要粘滞融合的元素 CSS 中添加 transition 过渡属性。
```css
[class*="icon-share-"] {
  position: absolute;
  width: 48px;
  height: 48px;
  background-color: #cd0000;
  border-radius: 50%;
  transition: transform .5s;
  transform: scale(0.5);
}
```
3. 然后在需要粘滞融合元素的父元素 CSS 中通过一个 URL 链接到 SVG 的 filter 滤镜元素。
```css
.target {
  filter: url("#goo");
}
```
4. 点击时将需要粘滞融合的元素使用 transform translate 函数转换位置。
```css
:checked+.target .icon-share-weibo {
  transform: scale(1) translate(-70px, 60px);
}
:checked+.target .icon-share-wechat {
  transform: scale(1) translate(0, 75px);
}
:checked+.target .icon-share-qq {
  transform: scale(1) translate(70px, 60px);
}
```
这里使用了 checkbox 的 checked 属性来切换展开和收起状态，而无需 JS 代码。

5. 为了效果更佳灵动，我们还可以给分享按钮加一个小动画，我们可以从 [animate.css](https://daneden.github.io/animate.css/) 上找一个合适的 CSS3 动画效果，例如 jello，拷贝相关 CSS 代码，添加在分享按钮上。
```css
:checked+.target .share {
  animation: jello 1s;
}
@keyframes jello {
  from, 11.1%, to {
    transform: none;
  }
  22.2% {
    transform: skewX(-12.5deg) skewY(-12.5deg);
  }
  33.3% {
    transform: skewX(6.25deg) skewY(6.25deg);
  }
  44.4% {
    transform: skewX(-3.125deg) skewY(-3.125deg);
  }
  55.5% {
    transform: skewX(1.5625deg) skewY(1.5625deg);
  }
  66.6% {
    transform: skewX(-0.78125deg) skewY(-0.78125deg);
  }
  77.7% {
    transform: skewX(0.390625deg) skewY(0.390625deg);
  }
  88.8% {
    transform: skewX(-0.1953125deg) skewY(-0.1953125deg);
  }
}
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7160600126749474853"></iframe>

## 参考资料
- [HTML 元素粘滞融合效果](https://www.zhangxinxu.com/wordpress/2017/12/svg-filter-fuse-gooey-effect/)