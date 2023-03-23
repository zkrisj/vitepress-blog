---
date: 23:29 2023/3/23
title: ✏️修改常见的原生表单控件的默认样式
tags:
- CSS
description: 针对特定表单控件，浏览器提供了特定的伪元素用来改变样式。
---
## 介绍
HTML 原生的表单控件样式在各个浏览器上面由用户代理默认设置样式，如果在页面上应用了其他颜色或主题时，我们通常也相应的更改这些输入框或按钮的颜色或背景，否则会出现颜色与背景或主题不融入的样式不一致问题。

一般而言，HTML 中表单控件的效果都是通过浏览器的 Shadow Dom 创建的，脱离文档主树，不受大环境 CSS 影响，要控制其 UI 只能使用浏览器开发的伪元素 API 接口。并且，只有部分的样式可以重置。而其余的默认样式我们是无法使用浏览器自带的开发工具查看到的，因为其并不属于文档树，只是背后的一棵子树。

针对特定表单控件，浏览器提供了特定的伪元素用来改变样式。

## input[type=search]
有如下 2 个伪元素可以改变搜索控件的 UI：
- ::-webkit-search-cancel-button - 搜索框右边的清除按钮，用来清除输入内容，在有内容时才显示。
- ::-webkit-search-results-button - 搜索框左边的菜单按钮，用来显示历史记录，现在浏览器已经不显示了。

<iframe src="https://code.juejin.cn/pen/7173599338621796388"></iframe>

## input[type=number]
有如下 2 个伪元素可以改变数字控件的 UI：
- ::-webkit-textfield-decoration-container – 填写数值的外部容器。
- ::-webkit-inner-spin-button – 上下箭头。

<iframe src="https://code.juejin.cn/pen/7173566521082380318"></iframe>

## input[type=range]
有如下 2 个伪元素可以改变滑块控件的 UI：
- ::-webkit-slider-runnable-track - 滑块凹槽，也就是滑块可滑动的区域。
- ::-webkit-slider-thumb - 滑块的具体样式，该伪类需要配合 ::-webkit-slider-runnable-track 使用，否则会没有效果。

<iframe src="https://code.juejin.cn/pen/7173586419850412032"></iframe>

## input[type=color]
有如下 2 个伪元素可以改变颜色选择控件的 UI：
- ::-webkit-color-swatch-wrapper - 颜色选择控件的容器元素。
- ::-webkit-color-swatch - 颜色选择控件的指示颜色。

<iframe src="https://code.juejin.cn/pen/7173550533599969280"></iframe>

## input[type=date]
有如下 8 个伪元素可以改变日期控件的 UI：
- ::-webkit-datetime-edit – 控制编辑区域。
- ::-webkit-datetime-edit-fields-wrapper – 控制年月日这个区域。
- ::-webkit-datetime-edit-text – 控制年月日之间的斜线或短横线。
- ::-webkit-datetime-edit-month-field – 控制月份。
- ::-webkit-datetime-edit-day-field – 控制日期。
- ::-webkit-datetime-edit-year-field – 控制年份。
- ::-webkit-inner-spin-button – 控制上下小箭头。
- ::-webkit-calendar-picker-indicator – 控制下拉小箭头。

<iframe src="https://code.juejin.cn/pen/7173556984266883109"></iframe>

## 单选框、复选框、下拉框、文件选择框
- 单选框、复选框、下拉框控件的样式修改参见：[如何更简单地修改单选框、复选框、下拉框的样式](https://juejin.cn/post/7173701016666243109)
- 文件选择框控件的样式修改参见：[如何更简单地更改 input type=file 文件选择框的样式](https://juejin.cn/post/7171015630269710349)

## meter
用做测量值、评分等。有如下伪元素可用：
- ::-webkit-meter-bar – 背景。
- ::-webkit-meter-optimum-value – 得分好的时候那部分区域状态。
- ::-webkit-meter-suboptimal-value – 分数凑合的时候区域状态。
- ::-webkit-meter-even-less-good-value – 分数糟糕的时候区域状态。

<iframe src="https://code.juejin.cn/pen/7173659858648956960"></iframe>

## progress
用来显示一项任务的完成进度。有如下伪元素可用：
- ::-webkit-progress-inner-element – 选择 `<progress>` 元素。
- ::-webkit-progress-bar – 背景进度条。
- ::-webkit-progress-value – 完成进度条。

其中，::-webkit-progress-bar 是::-webkit-progress-inner-element 伪元素的子元素，同时是 ::-webkit-progress-value 伪元素的父元素。

<iframe src="https://code.juejin.cn/pen/7173659869856481288"></iframe>

## 参考资料
- [伪元素表单控件默认样式重置与自定义大全](https://www.zhangxinxu.com/wordpress/2013/06/%e4%bc%aa%e5%85%83%e7%b4%a0-%e8%a1%a8%e5%8d%95%e6%a0%b7%e5%bc%8f-pseudo-elements-style-form-controls/)