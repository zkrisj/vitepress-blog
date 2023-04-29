---
date: 8:58 2023/4/29
title: 一种新的可以使元素重叠的 CSS 技巧
tags:
- CSS
description: container-type CSS 属性将元素定义为查询容器。后代可以查询其大小、布局、样式和状态等方面。
---
## 介绍
实现如下图所示的排版效果，一段关于图片的信息浮在图片上。

![CPT2209261952-520x325-min.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/700b446601bd4b5983fb16fdf1c56f77~tplv-k3u1fbpfcp-watermark.image?)

HTML 结构如下：
```HTML
<figure>
  <img src="../img/1.jpg" width="100%">
  <figcaption>自然风景</figcaption>
</figure>
```
除了通过 [translateY、相对定位、margin 负值定位、绝对定位和 Grid 布局实现](https://juejin.cn/post/7147687148945145863)上面效果以外，CSS `container` 属性也可以实现元素重叠这种效果。

## container 属性与元素重叠

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/49a1b6db23604a51bf89f4e4958271ee~tplv-k3u1fbpfcp-watermark.image?)

1. `container-type` CSS 属性将元素定义为查询容器。后代可以查询其大小、布局、样式和状态等方面。可以具有以下值：
    - size：为块和内联轴上的维度查询建立查询容器。将布局、样式和大小包含应用于元素。
    - inline-size：为容器的内联轴上的维度查询建立查询容器。将布局、样式和内联大小包含应用于元素。
    - block-size：在容器的块轴上建立维度查询的查询容器。将布局、样式和块大小包含应用于元素。
    - style：为样式查询建立查询容器。
    - state：为状态查询建立查询容器。
2. 所有具有尺寸收缩特性的元素，设置为 `container` 容器元素后，其宽度尺寸都会变成 `0`，包括任意的 `display` 计算值是 `inline-*` 的元素，浮动元素，绝对定位元素，`flex` 子项，或者 `width` 宽度值设置 `fit-content` 的元素。例如：
```html
<span class="element">我的宽度是？</span>
```
```css
.element {
  float: left;
  container-type: inline-size;
}
```
此时，`.element` 元素占据的宽度一定是 `0`。

![宽度0](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0527e20037794de1933362974b752f71~tplv-k3u1fbpfcp-zoom-1.image)

所以，我们就可以利用这种特性来实现元素重叠效果。

## 实现
由于图片本身就有内在尺寸，因此，就算变成 `container` 容器也不会宽度是 `0`，所以，我们可以在外面再嵌套一层标签，所以 HTML 结构修改为如下：
```html
<figure>
  <span><img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78ef43c46d0a4b839226522bf2a3705f~tplv-k3u1fbpfcp-watermark.image"></span>
  <figcaption>自然风景</figcaption>
</figure>
```
此时，通过下面的 CSS 代码，就可以实现我们想要的布局效果了：
```css
figure {
  display: inline-flex;
}
figure>span {
  container-type: inline-size;
}
figure img {
  display: block;
  width: 256px;
  height: 192px;
}
figcaption {
  width: 256px;
  line-height: 2em;
  align-self: end;
  text-align: center;
  background-color: #0003;
  color: #fff;
  z-index: 1;
}
```
另外，如果希望高宽尺寸都是 `0`，可以设置 `container-type` 属性值是 `size`：
```css
container-type: size;
```

## 码上掘金
<iframe src="https://code.juejin.cn/pen/7227263539235258371"></iframe>

## 总结
1. translateY、相对定位、margin 负值定位，使元素位置偏移；
2. 绝对定位重叠，元素完全脱离文档流；Grid 重叠，宽高一致强制位置重合；
3. 而 `container` 重叠则是通过宽度为 `0` 达到重叠效果。

这几种重叠机制各异，也有各自适合使用的场景，大家根据实际情况酌情选择。

## 参考资料
1. [又发现一种无需绝对定位就可以元素重叠的CSS技巧](https://www.zhangxinxu.com/wordpress/2023/03/css-container-rule-overlap/)
