---
date: 18:16 2023/4/29
title: CSS border 生成三角形技术原理
tags:
- CSS
description: 使用 CSS border 属性创建三角形是一种简单、灵活、响应式、可维护、兼容性好的方法，可以帮助开发人员创建高效且可靠的界面元素。
---
## 介绍
在 CSS 中使用 `border` 属性创建三角形的原理：每个 `border` 都有一个宽度、一个样式和一个颜色，可以设置不同的 `border` 宽度和样式来创建各种形状。

## 生成三角形
HTML 代码如下：
```html
<div class="test"></div>
```
CSS 代码如下：
```css
.test {
  width: 50px;
  height: 50px;
  border-left: 50px solid lime;
  border-right: 50px solid blue;
  border-top: 50px solid red;
  border-bottom: 50px solid magenta;
}
```
`div` 应用了上面这个样式后，结果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5de41e44123c433da290a483be1133f8~tplv-k3u1fbpfcp-watermark.image?)

现在，如果我们现在只保留一个一个上边框，其余边框均为 `transparent` 透明（或与背景色同色），那么是不是就只显示一个上面红色的边框了，我们测试下，与上面的代码类似，只是修改下其余三个边框的颜色。
```css
.test {
  width: 50px;
  height: 50px;
  border: 50px solid;
  border-color: #ff0000 #ffffff #ffffff #ffffff;
}
```
得到的是一个梯形，结果如下图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4507d392b06c43c29f57607b85da62d2~tplv-k3u1fbpfcp-watermark.image?)

如果把 `div` 的高宽都变成 `0`，只留一边，不就是三角了吗？代码如下：
```css
.test {
  width: 0;
  height: 0;
  border: 50 px solid;
  border - color: #ff0000 #ffffff #ffffff #ffffff;
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5b4ae44e7ef644acab3719e0ff94e598~tplv-k3u1fbpfcp-watermark.image?)

上图为等腰直角三角形，之所以为等腰直角，是因为所有的边框宽度是一样的，如果我们将边框宽度设置为不同，则会形成等腰三角形。
```css
.test {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 50px 30px;
  border-color: #ff0000 #ffffff #ffffff #ffffff;
}
```

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1bde52f04590434287e887b2ec4d5f56~tplv-k3u1fbpfcp-watermark.image?)

要更改箭头的方向，只需要对 border-width 和 border-color 进行修改即可：
```js
.test {
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 30px 50px;
  border-color: #ffffff #ffffff #ffffff #ff0000;
}
```

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1a6f268e525f4daa8180c744dddc1cc0~tplv-k3u1fbpfcp-watermark.image?)

可以不局限于保留一条边框，也可以保留两条，于是我们可以告别等腰，得到更加锐利的三角：
```js
.test {
  width: 0;
  height: 0;
  border-width: 20px 10px;
  border-style: solid;
  border-color: blue blue #ffffff #ffffff;
}
```
下面是这种形状的一个应用 - 消息框底部箭头：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e7bcaafdf1b4acdb494a62af8fa5e42~tplv-k3u1fbpfcp-watermark.image?)

<iframe src="https://code.juejin.cn/pen/7227411408458088487"></iframe>

## 总结
使用 CSS border 属性创建三角形有以下好处：
1. 轻量级：与使用图片或 SVG 等其他方法相比，使用 CSS border 属性创建三角形可以减少对服务器的请求，从而提高页面加载速度，特别是对于需要频繁使用的小型图形而言。
2. 灵活性：使用 CSS border 属性可以创建各种不同形状的三角形，可以根据需要调整大小和颜色，同时不需要额外的代码或工具。
3. 响应式设计：使用 CSS border 属性创建的三角形可以随着屏幕大小和设备类型的变化自动调整大小和位置，从而实现响应式设计。
4. 可维护性：使用 CSS border 属性创建三角形可以使代码更易于维护。当需要更改三角形的大小或颜色时，只需要修改 CSS 属性值即可，而无需编辑图像或其他代码。
5. 兼容性：使用 CSS border 属性创建三角形不需要使用特殊的浏览器插件或其他技术，因此可以在各种浏览器和设备上正常工作。

综上所述，使用 CSS border 属性创建三角形是一种简单、灵活、响应式、可维护、兼容性好的方法，可以帮助开发人员创建高效且可靠的界面元素。

## 参考资料
1. [CSS border三角、圆角图形生成技术简介](https://www.zhangxinxu.com/wordpress/2010/05/css-border%E4%B8%89%E8%A7%92%E3%80%81%E5%9C%86%E8%A7%92%E5%9B%BE%E5%BD%A2%E7%94%9F%E6%88%90%E6%8A%80%E6%9C%AF%E7%AE%80%E4%BB%8B/)
