---
date: 22:13 2023/3/23
title: SVG animation 动画的使用
tags:
- SVG
description: 目前 SVG SMIL animation 动画相关资料还是太少，尤其对各个属性和方法的解释、示例，而且标准也在不断变动，所以 CSS 动画在功能和兼容方面还是更有优势。
---
## 介绍
SVG 内容可以通过以下方式进行动画处理：
- 使用 SVG 动画。SVG 动画文档片段可以描述对文档元素的基于时间的修改，可以定义运动路径，或插入元素的属性和样式属性。这些效果可以链接在一起或触发以响应文档中的其他事件。
- 使用 CSS 动画。这个 CSS 模块定义了使用关键帧随时间动画化 CSS 属性值的方法。这些关键帧动画的行为可以通过指定它们的持续时间、重复次数和重复行为来控制。
- 使用 CSS 过渡。此 CSS 模块定义属性以指定 CSS 属性值的更改在指定的持续时间内逐渐发生。
- 使用 SVG DOM。SVG DOM 被定义为 DOM4 规范的扩展。每个属性和样式表设置都可以通过脚本访问，并且 SVG 提供了一组额外的 DOM 接口来通过脚本支持高效的动画。理想情况下，支持脚本的浏览器也将实现 HTML 中定义的动画帧 API 。
- 使用 Web Animations API。这个 DOM API 提供了一个脚本接口来触发样式属性和属性的用户代理优化动画，而不需要计算单个帧的值。

SVG 动画通过 SMIL（Synchronized Multimedia Integration Language，同步多媒体合成语言）实现，通过在一个 SVG 元素内添加一个动画元素比如 `<animate>` 即可以实现动画。
- 动画元素的数字属性（x，y 等）
- 动画元素的颜色属性
- 动画元素的 transform 属性（平移或旋转等）
- 使元素沿着指定路径运动

## CSS 动画
下面通过 CSS 属性实现 SVG 的动画。

<iframe src="https://code.juejin.cn/pen/7142740773811781664"></iframe>

也可以通过 SMIL 方式实现，但是没有 CSS 控制动画灵活。

<iframe src="https://code.juejin.cn/pen/7163663019526848523"></iframe>

## SVG animation 元素
### set
用来设定一个属性值，并为该值赋予一个持续时间。它支持所有的属性类型，包括那些原理上不能插值的，例如值为字符串和布尔类型的属性。set 元素是非叠加的。无法在其上使用 additive 属性或 accumulate 属性，即使声明了这些属性也会自动被忽略。

<iframe src="https://code.juejin.cn/pen/7163817212350824462"></iframe>

### animate
放在形状元素的内部，用来定义一个元素的某个属性如何踩着时点改变。在指定持续时间里，属性从开始值变成结束值。

<iframe src="https://code.juejin.cn/pen/7163842952706392101"></iframe>

## animateTransform
在其目标元素上设置 transform 属性的动画，从而允许动画控制平移、缩放、旋转或倾斜等。

<iframe src="https://code.juejin.cn/pen/7163844251657175078"></iframe>

## animateMotion
定义元素如何沿着路径移动。

<iframe src="https://code.juejin.cn/pen/7163848226150285326"></iframe>

## 事件
下面示例绑定了几个动画事件：点击按钮开始，点击按钮停止，鼠标悬停暂停，鼠标移开取消暂停。
```html
<button id="b1">点击开始动画</button>
<button id="b2">点击停止动画</button>
<h5><mark>鼠标悬停暂停</mark></h5>
<svg width="300" height="100" id="svg">
  <title>SVG SMIL Animate with Path</title>
  <rect x="0" y="0" width="300" height="100" stroke="black" stroke-width="1" />
  <rect x="0" y="0" width="20" height="20" fill="blue" stroke="black" stroke-width="1">
    <animateMotion id="ani"
       path="M 250,80 H 50 Q 30,80 30,50 Q 30,20 50,20 H 250 Q 280,20,280,50 Q 280,80,250,80Z"
       dur="3s" repeatCount="indefinite" rotate="auto" begin="indefinite" />
  </rect>
</svg>
<script>
  svg.onmouseout = e => svg.unpauseAnimations();
  svg.onmouseover = e => svg.pauseAnimations();
  b1.onclick = e => ani.beginElement();
  b2.onclick = e => ani.endElement();
</script>
```
<iframe src="https://code.juejin.cn/pen/7163654617572573184"></iframe>

补充：目前 SVG SMIL animation 动画相关资料还是太少，尤其对各个属性和方法的解释、示例，而且标准也在不断变动，所以 CSS 动画在功能和兼容方面还是更有优势。

## 参考资料
- [SVG animation with SMIL](https://developer.mozilla.org/en-US/docs/Web/SVG/SVG_animation_with_SMIL)
- [超级强大的 SVG SMIL animation 动画详解](https://www.zhangxinxu.com/wordpress/2014/08/so-powerful-svg-smil-animation/)