---
date: 21:02 2023/3/23
title: 使用 Web Animations API 实现点击阅读更多动画
tags:
- JS
description: 一个根据 jQuery 动画改写为 Web Animations API 的例子。
---
## 介绍
Web Animations API 可以把 CSS3 实现的 animation 动画由 JS 代码实现。它通过组合两个模型来实现：时序模型（CSS transitions）和动画模型（CSS animations）。

`Element.animate(keyframes, options)` 用于在元素上创建和播放动画，返回创建的 `Animation` 对象实例。
- `keyframes` 可以为任何[`css 动画属性`](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_animated_properties) 属性名称使用驼峰命名法指定，例如 `background-color` 变成 `backgroundColor`，`background-position-x` 变成 `backgroundPositionX`。也可以使用简写属性，例如 margin。
    - 两个特殊的 css 属性：
    - `float`, 必须写成 `cssFloat` ，因为 `float` 是 `JavaScript` 的关键字。
    - `offset`, 必须写成 `cssOffset` ，因为 `offset` 已经用来表示关键帧的偏移量。
    - 还可以指定以下特殊属性：
    - `offset` 关键帧的偏移量，介于 `0.0` 和 `1.0` 之间的数字或为 `null`。这相当于在 CSS 样式表中使用 `@keyframes` 以百分比指定开始和结束状态。如果为 `null` 或未指定，则关键帧将在相邻关键帧之间均匀分布。
    - `easing` 从当前 `keyframe` 到下一个 `keyframe` 所使用的 `timing function`。
    - `composite` 将 `keyframe` 中指定的值与基础值组合。
- `options` 表示动画持续时间（以毫秒为单位）的整数，或包含以下一项或多项的对象：
    - `delay` 延迟开始的毫秒数。默认为 `0`。
    - `direction` 动画的方向。默认为 `normal`，其他值包括：`reverse`，`alternate`，`alternate-reverse`。
    - `duration` 动画每次迭代完成所需的毫秒数。默认为 0。虽然这是可选的，但请记住，如果此值为 0，您的动画将不会运行。
    - `easing` 动画随时间变化的速率。接受预定义值 `linear`、`ease`、`ease-in`、`ease-out` 和 `ease-in-out`，或自定义 `cubic-bezier` 值，如 `cubic-bezier( 0.42、0、0.58、1)`。默认为 `linear`。
    - `endDelay` 动画结束后延迟的毫秒数。这主要用于根据另一个动画的结束时间对动画进行排序时使用。默认为 `0`。
    - `fill` 决定动画的效果是否应该先播放第一帧（`backwards`），在动画完成播放后保留最后一帧（`forwards`），或两者都有（`both`）。默认两者都不（`none`）。
    - `iterationStart` 描述动画应该在迭代中的哪个点开始。例如，`0.5` 表示在第一次迭代的中途开始，并且使用此值设置后，具有两次迭代的动画将在第三次迭代的中途结束。默认为 `0.0`。
    - `iterations` 动画重复的次数。默认为 `1`，也可以取 `Infinity`，使其在元素存在时重复。
    - `iterationComposite` 动画中如何迭代。可以设置为 `accumulate` 或 `replace`。默认 `replace`。
    - `composite` 如何在此动画和其他未指定其 `composite` 的单独动画之间组合。默认 `replace`，即用新值覆盖以前的值。其他值包括：`add`：例如 `translateX(-200px)` 和以前的 `rotate(20deg)` 会变成 `translateX(-200px) rotate(20deg)`；`accumulate`：例如 `blur(2)` 和 `blur(5)` 会变成 `blur(7)`。

效果如下：

![chrome-capture-2022-9-30.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d491f3d43c424db09f11506b608b5313~tplv-k3u1fbpfcp-watermark.image?)

## HTML
```html
<div id="box">
  <div id="content">Et netus et malesuada fames ac turpis egestas. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</div>
  <div id="more">
    <span class="button">阅读更多</span>
  </div>
</div>
```

## CSS
```css
.button {
  background: dodgerblue;
  padding: 5px 10px;
  border-radius: 8px;
  cursor: pointer;
}
.button:hover {
  background: deepskyblue;
}
#box {
  position: relative;
  width: 250px;
  height: 120px;
  padding: 20px;
  color: white;
  background-color: red;
  overflow: hidden;
}
#box #more {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 30px 0 20px 0;
  background-image: linear-gradient(rgba(255, 0, 0, 0), rgba(255, 0, 0, 100));
}
```

## JS
```js
function a(e) {
  const ani = box.animate({
    height: ['120px', content.scrollHeight + 40 + 'px']
  }, { duration: 200, fill: 'both' });
  e.textContent = '收起';
  a.b = true;
}
function s(e) {
  const ani = box.animate({
    height: [content.scrollHeight + 40 + 'px', '120px']
  }, { duration: 200, fill: 'both' });
  e.textContent = '阅读更多';
  a.b = false;
}

document.querySelector('.button').onclick=function(e) {
  a.b?s(this):a(this);
}
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7160312572833431583"></iframe>