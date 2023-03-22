---
date: 23:50 2023/3/21
title: CSS flex 属性的几种写法
tags:
- CSS
description: 2009年，W3C 提出了一种新的方案 - Flex 布局，定义了一种针对用户界面设计而优化的 CSS 盒子模型。目前，它已经得到了所有浏览器的支持。如果学会使用它写 CSS 布局，简直太方便了。
---
## 介绍
2009年，W3C 提出了一种新的方案----Flex 布局，定义了一种针对用户界面设计而优化的 CSS 盒子模型。目前，它已经得到了所有浏览器的支持。如果学会使用它写 CSS 布局，简直太方便了。

## 容器的属性
Flex 容器存在两根轴：水平的主轴（main axis）和垂直的交叉轴（cross axis），主轴由 `flex-direction` 定义。以下6个属性设置在容器上。
> - flex-direction: row | row-reverse | column | column-reverse;
> - flex-wrap: nowrap | wrap | wrap-reverse;
> - flex-flow: <'flex-direction'> || <'flex-wrap'>;
> - justify-content: flex-start | flex-end | center | space-between | space-around;
> - align-items: flex-start | flex-end | center | baseline | stretch;
> - align-content: flex-start | flex-end | center | space-between | space-around | stretch;

## 项目的属性
以下6个属性设置在项目上。
> - order: `<integer>`;
> - flex-grow: `<number>`; /* 负值无效。省略时默认值为 1。 (初始值为 0) */
> - flex-shrink: `<number>`; /* 负值无效。省略时默认值为1。 (初始值为 1) */
> - flex-basis: `<length>` | auto; /* 若值为0，则必须加上单位，以免被视作伸缩性。省略时默认值为 0。(初始值为 auto) */
> - flex: none | auto | initial  | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
> - align-self: auto | flex-start | flex-end | center | baseline | stretch;

## flex属性
`flex` 属性是 `flex-grow`, `flex-shrink` 和 `flex-basis` 的简写，默认值为 `0 1 auto`。

### 关键字语法：
- `initial`
    元素会根据自身宽高设置尺寸。它会缩短自身以适应 flex 容器，但不会伸长并吸收 flex 容器中的额外自由空间来适应 flex 容器 。相当于将属性设置为 `flex: 0 1 auto`。
- `auto`
    元素会根据自身的宽度与高度来确定尺寸，但是会伸长并吸收 flex 容器中额外的自由空间，也会缩短自身来适应 flex 容器。这相当于将属性设置为 `flex: 1 1 auto`.
- `none`
    元素会根据自身宽高来设置尺寸。它是完全非弹性的：既不会缩短，也不会伸长来适应 flex 容器。相当于将属性设置为 `flex: 0 0 auto`。

### 单值语法：
1. 无单位数: 它会被当作`flex:<number> 1 0;`，其中 `<flex-grow>` 的值为 `number`，`<flex-shrink>` 的值被假定为 1，然后 `<flex-basis>` 的值被假定为`0`。
2. 一个有效的宽度 (`width`)值：它会被当作 `<flex-basis>` 的值。

### 双值语法:
1. 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。第二个值必须为一个无单位数：它会被当作 `<flex-shrink>` 的值。
2. 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。第二个值必须为一个有效的宽度值：它会被当作 `<flex-basis>` 的值。

### 三值语法：
- 第一个值必须为一个无单位数，并且它会被当作 `<flex-grow>` 的值。
- 第二个值必须为一个无单位数，并且它会被当作 `<flex-shrink>` 的值。
- 第三个值必须为一个有效的宽度值，并且它会被当作 `<flex-basis>` 的值。

## 示例
一般将 flex 设置为以下值之一：`auto`，`initial`，`none`，或一个无单位正数。调整以下 flex 容器的大小查看这些值的效果：
<iframe src="https://code.juejin.cn/pen/7125330277345263629"></iframe>
