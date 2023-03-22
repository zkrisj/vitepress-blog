---
date: 23:45 2023/3/22
title: 页面滚动顶部指示进度条 JS 和 CSS 实现
tags:
- JS
- CSS
description: 页面滚动顶部指示，是在页面上下滚动时，顶部显示一个滚动条，指示页面的滚动距离和页面的滚动高度的比例。
---
## 介绍
页面滚动顶部指示，是在页面上下滚动时，顶部显示一个滚动条，指示页面的滚动距离和页面的滚动高度的比例。效果如下：

![CPT2209131004-668x576-min.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6706dfda6cf54b468c1297bcb04245ec~tplv-k3u1fbpfcp-watermark.image?)

## JS 实现
原理是顶部放一个宽度为 0 的滚动条，然后监听窗口滚动事件，把页面的滚动距离和页面的滚动高度（页面的实际高度 - 页面的视口高度）进行比较，然后更新滚动条的宽度。
```js
window.onscroll = function(e) {
  var height = document.scrollingElement.scrollHeight - document.scrollingElement.clientHeight;
  progressBar.style.width = (document.scrollingElement.scrollTop / height) * 100 + "%";
}
```

```css
.progress-container {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(0, 0, 0, .1);
}

.progress-bar {
  width: 0;
  height: 8px;
  background: rgba(0, 200, 0, .7);
}
```
<iframe src="https://code.juejin.cn/pen/7142718964181925900"></iframe>

## CSS 实现
原理是给页面添加一个线性渐变的背景，背景的宽度等于页面的宽度，背景的高度要等于页面的滚动高度（页面的实际高度 - 页面的视口高度），这可以使用 CSS 的函数 calc(100% - 100vh) 来得到，然后加上滚动条的高度，比如 5px，calc(100% - 100vh + 5px)。

```css
body {
  background: linear-gradient(to top right, lime 50%, white 50%) no-repeat;
  background-size: 100% calc(100% - 100vh + 5px);
}
```

这里使用 linear-gradient 函数创建了一个两种颜色的渐变色，在 50% 位置共享一个颜色停止点，即渐变的一半。这将在两种颜色之间创建一条硬线，即创建一个条纹而不是逐渐过渡。

![CPT2209131207-1349x1029-min.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27b46221b7084a4fa984625c4f4115dc~tplv-k3u1fbpfcp-watermark.image?)

接下来就是把多余背景遮盖，可以使用伪元素来完成：
```css
body::after {
  content: "";
  position: fixed;
  top: 5px;
  left: 0;
  bottom: 0;
  right: 0;
  background: white;
  z-index: -1;
}
```

这种方法的滚动条不能太高，不然滚动条末端的倾斜条纹会很明显。

<iframe src="https://code.juejin.cn/pen/7142725459602571278"></iframe>

以上的 JS 和 CSS 实现在 IE11 中都有效果。