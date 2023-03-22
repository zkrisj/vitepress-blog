---
date: 22:00 2023/3/22
title: Web Animations API 的使用
tags:
- CSS
- JS
description: Web Animations API 可以把 CSS3 实现的 animation 动画由 JS 代码实现。它通过组合两个模型来实现：时序模型（CSS transitions）和动画模型（CSS animations）。
---
## 介绍
`Web Animations API` 可以把 `CSS3` 实现的 `animation` 动画由 `JS` 代码实现。它通过组合两个模型来实现：时序模型（`CSS transitions`）和动画模型（`CSS animations`）。

## 接口
- `document.getAnimations()`
- 返回当前对文档中的元素有效的 `Animation` 对象的数组。
- `Element.getAnimations()`
- 返回正在或即将影响当前元素的 `Animation` 对象的数组。
- `Element.animate(keyframes, options)`
- 用于在元素上创建和播放动画，返回创建的 `Animation` 对象实例。
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

## 使用
1. 一个由多个关键帧（`keyframe`）的属性和值组成的对象所构成的数组：
```js
element.animate([
  { // from
    opacity: 0,
    color: "#fff"
  },
  { // to
    opacity: 1,
    color: "#000"
  }
], 2000);
```
2. 对每个关键帧的偏移可以通过提供一个offset来指定：
```js
element.animate([ { opacity: 1 },
  { opacity: 0.1, offset: 0.7 },
  { opacity: 0 } ],
2000);
```
`offset` 的值必须是在 **[0.0, 1.0]** 这个区间内，且须升序排列。并非所有的关键帧都需要设置 `offset`。没有指定 `offset` 的关键帧将与相邻的关键帧均匀间隔。

3. 通过提供 `easing` 过渡来给指定关键帧之间应用过渡效果：
```js
element.animate([ { opacity: 1, easing: 'ease-out' },
  { opacity: 0.1, easing: 'ease-in' },
  { opacity: 0 } ],
2000);
```
指定的 `easing` 仅适用于指定它的关键帧到下一帧之间。但是在 `options` 中指定的 `easing` 值都将应用在一个动画的整个持续时间里。

4. 包含动画的属性和要循环变化的值的数组：
```js
element.animate({
  opacity: [ 0, 1 ],          // [ from, to ]
  color:   [ "#fff", "#000" ] // [ from, to ]
}, 2000);
```
5. 每个数组的元素数量不必相等，所提供的值将独立分开：
```js
element.animate({
  opacity: [ 0, 1 ], // offset: 0, 1
  backgroundColor: [ "red", "yellow", "green" ], // offset: 0, 0.5, 1
}, 2000);
```
6. `offset`，`easing` 和 `composite` 可以与属性值一起指定：
```js
element.animate({
  opacity: [ 0, 0.9, 1 ],
  offset: [ 0, 0.8 ], // [ 0, 0.8, 1 ] 的简写
  easing: [ 'ease-in', 'ease-out' ],
}, 2000);
```

## 示例
下面示例的四个动画都使用了三个关键帧：第一帧完全透明，第二帧完全不透明，第三帧完全透明。`offset` 对应 `CSS3 animation` 中的百分比，`{ opacity: 1, offset: 0.5 }` 等同于 CSS 中 `@keyframes xxx { 50% { opacity: 1; } }`，也就是动画进程 `50%` 位置透明度为 `1`。不设置 `offset` 和 `offset` 设置为 `0.5` 都将在相邻关键帧之间均匀分布，效果相同。`easing: 'steps(8, end)'` 定义了一个 `timing function`，以等距步长划分动画进程。

<iframe src="https://code.juejin.cn/pen/7131575373527482383"></iframe>