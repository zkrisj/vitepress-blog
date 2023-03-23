---
date: 22:19 2023/3/23
title: 使用 CSS mask 对图像应用遮罩效果
tags:
- CSS
description: CSS mask 属性通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域。可以使用图像、SVG 或渐变色作为遮罩来做一些特效。
---
## 为什么B站的弹幕可以不挡人物
[为什么B站的弹幕可以不挡人物](https://juejin.cn/post/7141012605535010823) 这篇文章里面介绍了这个神奇的 mask 属性，我们知道了B站的弹幕可以不挡人物的原理：
- 视频处理：对有人物出现的每一帧视频画面都由后台 AI 识别后生成对应的 base64 图片，这个图片具有人物的透明轮廓。一张图片也就一两K，不会造成性能负担。

![下载.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4426f8508069429bac4b192994e1eeb8~tplv-k3u1fbpfcp-watermark.image?)
- 视频画面上设置一个绝对定位元素。
- 视频播放时由 JS 动态设置绝对定位元素的 mask-image 的 url 地址为当前帧对应的 base64 图片。
<iframe src="https://code.juejin.cn/pen/7164216115084656644"></iframe>

## mask 属性
CSS mask 属性通过遮罩或者裁切特定区域的图片的方式来隐藏一个元素的部分或者全部可见区域。可以使用图像、SVG 或渐变色作为遮罩来做一些特效。它是以下 CSS 属性的简写：
- mask-image: 使用的图片资源，默认 none。
- mask-mode: 根据资源的类型自动采用合适的遮罩模式，默认 match-source（目前只有 Firefox 支持）。
- mask-repeat: 类似于 background-repeat 属性，默认 repeat。
- mask-position: 和 background-position 支持的属性值和表现一样，默认 center。
- mask-clip: 和 background-clip 类似，但是多了 SVG 元素支持，默认 border-box。
- mask-origin: 和 background-origin 类似，但是多了 SVG 元素支持，默认 border-box。
- mask-size: 和 background-size 类似，默认 auto。
- mask-composite: 使用多个图片进行遮罩时候的混合方式，默认 add，表示多个图片遮罩效果累加。其他值：
    - subtract
    - 遮罩相减。也就是遮罩图片重合的地方不显示。意味着遮罩图片越多，遮罩区域越小。
    - intersect
    - 遮罩相交。也就是遮罩图片重合的地方才显示遮罩，。
    - exclude
    - 遮罩排除。也就是后面遮罩图片重合的地方排除，当作透明处理。

另外，还有两个相关的 CSS 属性：
- mask-type：和 mask-mode 类似，但是只能作用在 SVG `<mask>` 元素上。
- -webkit-mask-box-image：为元素的边框设置遮罩图像（目前只有 Firefox 不支持）。

可以使用 CSS 功能查询来检测支持：
```css
@supports(-webkit-mask: url(#mask)) or (mask: url(#mask)) {
  /* code that requires mask here. */
}
```

## 使用
原图：  
![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c579b7ac874849dd89b7a9792f6b9412~tplv-k3u1fbpfcp-watermark.image?)
### 渐变色遮罩
下面创建了一个椭圆渐变色遮罩，所以只有椭圆形状之内的图像可见，并且渐变色可以产生模糊效果。
<iframe src="https://code.juejin.cn/pen/7164400360319090721"></iframe>

### 图片和 SVG 遮罩
这可以实现与 clip-path 类似的效果，但并不完全相同。遮罩只是将不可见部分用颜色转换隐藏，而 clip-path 则是将元素切割为可见部分，不可见部分已经不属于元素。通过鼠标 cursor: pointer 可以看到 clip-path 不可见部分没有鼠标样式了。
<iframe src="https://code.juejin.cn/pen/7165033624071307305"></iframe>

### 联合使用遮罩<iframe src="https://code.juejin.cn/pen/7165009405845766174"></iframe>

## SVG 中 `<mask>` 元素作为遮罩元素
- 既能够把内联 SVG 中的 `<mask>` 作为遮罩，也可以把外链的 SVG 文件中的 `<mask>` 作为遮罩。
- 既能够作用在普通 HTML 元素上，也能够作用在 SVG 元素上。
- 使用 mask 属性来引用一个遮罩元素。
<iframe src="https://code.juejin.cn/pen/7164407013999378470"></iframe>

## 浏览器兼容
目前，除了 Firefox 浏览器，都需要添加 -webkit- 前缀才能使用。

![mask.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c698b807fa5a4df48c8c05e98cd1d8e1~tplv-k3u1fbpfcp-watermark.image?)