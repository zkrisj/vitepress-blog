---
date: 23:54 2023/3/22
title: CSS 的 @规则介绍
tags:
- CSS
description: at 规则以 @ 开始，后跟一个标识符，一直到以分号或右大括号结束。
---
## 介绍
at 规则以 @ 开始，后跟一个标识符，一直到以分号或右大括号结束。

## 语法
```css
/* 常规规则 */
@identifier RULE;

/* 嵌套规则 */
@identifier (RULE) {}
```

## 常规规则
- @charset 定义样式表使用的字符集。
- @import 包含一个外部样式表。
- @namespace 所有内容以 XML 命名空间为前缀。

## 嵌套规则
- @media 如果设备满足使用媒体查询定义的条件的标准，将应用其内容的条件组规则。
- @supports 如果浏览器满足给定条件的标准，将应用其内容的条件组规则。
- @document 如果应用样式表的文档满足给定条件的标准，则将应用其内容的条件组规则。
- @page 描述打印文档时将应用的布局。
- @font-face 描述要下载的外部字体。
- @keyframes 描述 CSS 动画序列中的中间步骤。
- @viewport 已弃用，描述小屏幕设备的视口。
- @counter-style 定义不属于预定义样式集的特定计数器样式。
- @property 描述自定义属性和变量。
- @layer 声明一个级联层并定义多个级联层的优先顺序。

### 条件组规则
在 CSS Level 3 中定义，可以包含嵌套语句或嵌套规则，都链接了某种类型的条件，它们所指的条件会评估为 true 或 false。如果条件评估为 true，则将应用组内的所有语句。包括：
- @media
- @supports
- @document （推迟到 CSS Level 4 规范)。

## 示例
```css
/* 示例：告诉浏览器使用 UTF-8 编码处理样式中的字符 */
@charset "utf-8";
/* 示例：浏览器支持 flex 和屏幕最大宽度 400px 时引入指定外部样式 */
@import url(narrow.css) supports(display: flex) screen and (max-width: 400px);

/* 示例：为 --my-color 自定义属性添加颜色值类型检查，设置默认值并且设置属性值不允许被继承 */
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
/* 示例：定义浏览器不支持 grid 且支持 flex 时的样式 */
@supports (display: flex) and (not (display: grid)) {
  div {
    display: flex;
  }
  span {
    float: right;
  }
}
/* 示例：定义浏览器支持 flex 且屏幕宽度在 400px 和 700px 之间时的样式 */
@supports (display: flex) {
  /* 媒体查询 Level 4 的范围语法，Chrome 104 开始支持 */
  @media (400px <= width <= 700px) {
    body {
      line-height: 1.4;
    }
    article {
      display: flex;
    }
  }
}
```