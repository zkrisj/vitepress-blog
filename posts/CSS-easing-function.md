---
date: 22:04 2023/3/22
title: CSS easing-function 的使用
tags:
- CSS
description: easing-function 描述数值变化率的数学函数，可用于 transition-timing-function 属性和 animation-timing-function 属性。
---
## 介绍
`easing-function` 描述数值变化率的数学函数，可用于 `transition-timing-function` 属性和 `animation-timing-function` 属性。这使得可以在动画持续时间内改变动画的速度，还可在颜色渐变中的两种颜色之间进行插值。

## 语法
```css
/* linear function */
linear;

/* cubic-bezier functions */
cubic-bezier(x1, y1, x2, y2);
ease;
ease-in;
ease-out;
ease-in-out;

/* step functions */
steps(4, end);
step-start;
step-end;
```
- `linear`：从头到尾以恒定速率进行，相当于 `cubic-bezier(0.0, 0.0, 1.0, 1.0)`。
- `cubic-bezier()` 函数：定义贝塞尔曲线，由四个点组成。由于这些曲线是连续的，它们通常用于平滑插值的开始和结束，因此有时称为 `easing` 函数。纵坐标 `y1` 和 `y2` 如果超出 `[0, 1]` 的范围，将产生弹跳效果。横坐标 `x1` 和 `x2` 必须在 `[0, 1]` 范围内，否则 `CSS` 将忽略整个属性。
    - 有几个常见的贝塞尔曲线函数的关键字：
    - `ease`：开始缓慢，然后急剧加速，然后逐渐变慢。相当于 `cubic-bezier(0.25, 0.1, 0.25, 1.0)`。与 `ease-in-out` 类似，但它在开始时加速更快。
    - `ease-in`：动画缓慢开始，然后逐渐加速直到结束，在结束点时突然停止。相当于 `cubic-bezier(0.42, 0.0, 1.0, 1.0)`。
    - `ease-in-out`：动画缓慢开始，然后加速，最后减速直至结束。相当于 `cubic-bezier(0.42, 0.0, 0.58, 1.0)`。开始时类似于 `ease-in`，结束时类似于 `ease-out`。
    - `ease-out`：动画突然开始，然后逐渐减速至结束。相当于 `cubic-bezier(0.0, 0.0, 0.58, 1.0)`。
- `steps()` 函数：`steps(number_of_steps, direction)` 以等距步长划分动画。`number_of_steps` 只能是正整数，`0`、浮点数和负数都无效。`direction` 是一个关键字，指示跳转发生的时间，默认 `end`。
    - 关键字有：
    - `jump-start`：在动画开始时跳转到 `first step`。
    - `jump-end`：在动画结束时跳转到 `last step`。
    - `jump-both`：在动画开始时跳转到 `first step`，在动画结束时跳转到 `last step`。
    - `jump-none`：在动画开始和结束时都不跳转。
    - `start`：相当于 `jump-start`。
    - `end`：相当于 `jump-end`，默认。

## 示例
<iframe src="https://code.juejin.cn/pen/7131662113244151849"></iframe>
