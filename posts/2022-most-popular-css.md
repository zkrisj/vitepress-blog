---
date: 17:39 2023/3/23
title: 2022 最受欢迎的 CSS 类名、ID 和选择器是什么
tags:
- CSS
description: 与 2020 年和 2021 年一样，网络上最受欢迎的类名是 active，Font Awesome 的 fa，fa-* 前缀仍然排在第二和第三。
---
## 介绍
CSS 是用于布局、格式化网页和其他媒体的语言。它和用于结构的 HTML 和用于行为的 JavaScript 是网络的三种主要语言。

在过去的几年中，出现了一系列新的 CSS 功能。其中许多是从开发人员已经使用 JavaScript 或预处理器所做的事情中获得灵感的，而另一些则提供了几年前不可能完成的事情的方法。提供新功能是一回事，但开发人员是否真的在他们的生产网页和应用程序中使用它们？

## 类名
![](https://almanac.httparchive.org/static/images/2022/css/top-selector-classes.png)

---
与 2020 年和 2021 年一样，网络上最受欢迎的类名是 active，Font Awesome 的 fa，fa-* 前缀仍然排在第二和第三。

wp-* 类名已经攀升至第四位，它们现在出现在 31% 的页面上，2021 年为 20%，这些在新的 WordPress 块编辑器中使用，还有诸如 has-large-font-size 的类名。

clearfix 已经从前 20 名中消失了，现在只出现在 10% 的页面上，这非常清楚地表明基于浮动的布局正在从网络上消失。

## ID
![](https://almanac.httparchive.org/static/images/2022/css/top-selector-ids.png)

---
content 再次成为最流行的 ID 名称，其次是 footer 和 header。以 fb_ 开头的 ID 表示使用 Facebook 小部件。

2021，7% 的页面上出现了以 rc- 开头的 ID，表明使用了谷歌的 reCAPTCHA 系统，尽管被 Facebook 的 ID 挤出前十位，但仍然以同样的频率出现。

## 伪类
![](https://almanac.httparchive.org/static/images/2022/css/pseudo-classes.png)

---
:hover、:focus 和 :active 用户操作伪类再次位居前三名。否定伪类 :not() 也继续流行，:root 可能用于创建自定义属性。

去年有人指出 :focus-visible，一种以更符合用户期望的方式对焦点元素进行样式设置的方法出现在不到 1% 的页面中。自 2022 年 3 月以来，该属性已在所有三个主要引擎中可用，现在在 10% 的桌面和 9% 的移动页面上都可以找到。

## 伪元素
![](https://almanac.httparchive.org/static/images/2022/css/pseudo-elements.png)

---
我们过滤掉了任何带前缀的，特定于浏览器的伪元素，这些通常用于选择界面组件或浏览器的部分。

自去年以来，使用 ::before 和 ::after 有所增加。这些用于将生成的内容插入到文档中。通过检查 content 属性的使用，可以看到它最常用于插入空字符串，用于样式目的。生成的内容是一种无需添加元素即可设置网格区域样式的方法，也许这有助于这些属性的使用量增加。

伪元素 ::marker 使用率现在已经达到 1%，这表明人们正在慢慢开始利用选择和样式列表标记的能力。

## 属性选择器
![](https://almanac.httparchive.org/static/images/2022/css/attribute-selectors.png)

---
最受欢迎的属性选择器是 type，出现在 54% 的页面上。然后分别是 class 37%、disabled 25% 和 dir 17% 出现在页面上的比例。

## Sass
![](https://almanac.httparchive.org/static/images/2022/css/sass-function-calls.png)

---
像 Sass 这样的预处理器可以被看作是开发人员使用 CSS 无法实现的一个很好的指标。但是，随着 CSS 越来越强大，开发人员的一个常见问题是我们是否还需要使用 Sass。我们可以从自定义属性使用的增加中看出，一种常见的预处理器使用是拥有变量或常量的能力——而现在有了内置的 CSS 等价物。

![](https://almanac.httparchive.org/static/images/2022/css/sass-nesting.png)

---
CSS 嵌套的未来规范目前也正在 CSS 工作组开发和讨论中。嵌套在 SCSS 表中很常见，可以通过查找 & 字符来识别。

## 参考资料
- [https://almanac.httparchive.org/en/2022/css](https://almanac.httparchive.org/en/2022/css)