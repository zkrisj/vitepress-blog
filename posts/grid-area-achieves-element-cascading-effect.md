---
date: 13:00 2023/3/23
title: 使用 grid-area 实现元素层叠效果和对比其他方法
tags:
- CSS
description: Grid 布局实现的元素层叠不改变容器元素的层叠上下文关系和元素的包含块关系。
---
## 介绍
实现如下图所示的排版效果，一段关于图片的信息浮在图片上。

![CPT2209261952-520x325-min.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/700b446601bd4b5983fb16fdf1c56f77~tplv-k3u1fbpfcp-watermark.image?)

---
HTML 结构如下：
```HTML
<figure>
  <img src="../img/1.jpg" width="100%">
  <figcaption>自然风景</figcaption>
</figure>
```

## translateY
这种方式最简单，但是元素原本的位置会保留，即 figcaption 原来的宽高还会留在原位置。
```css
figcaption {
  transform: translateY(-3em);
}
```
<iframe src="https://code.juejin.cn/pen/7147656821539340296"></iframe>

## 相对定位
跟上一种方法一样，figcaption 原来的宽高还会留在原位置。
```css
figcaption {
  position: relative;
  top: -3em;
}
```
<iframe src="https://code.juejin.cn/pen/7147662852784914463"></iframe>

## margin 负值定位
这种方法元素原本的位置不会保留，也使用了相对定位，使 figcaption 的背景能覆盖图片之上。
```css
figcaption {
  position: relative;
  margin-top: -3em;
}
```
<iframe src="https://code.juejin.cn/pen/7147663509847801889"></iframe>

## 绝对定位
这种方法元素原本的位置不会保留，也需要使用相对定位将其限制在父容器之内。
```css
figure {
  position: relative;
}
figure>figcaption {
  position: absolute;
  bottom: 0;
  width: 100%;
}
```
<iframe src="https://code.juejin.cn/pen/7147667593946628104"></iframe>

## Grid 布局
使用 grid-area 属性指定 grid 子项所占用的网格。
```css
figure {
  display: grid;
}
figure>img,
figure>figcaption {
  grid-area: 1 / 1;
}
figcaption {
  align-self: end;
}
```
<iframe src="https://code.juejin.cn/pen/7147671641005883406"></iframe>

### grid-area 语法
grid-area 是以下 CSS 属性的简写：
- grid-row-start
- grid-column-start
- grid-row-end
- grid-column-end

```css
grid-area: <row-start> / <column-start> / <row-end> / <column-end>;
```
可以使用四种写法：
1. 4 个值，grid-row-start 会被设为第一个值，grid-column-start 为第二个值，grid-row-end 为第三个值，grid-column-end 为第四个值。
2. 3 个值，grid-row-start 会被设为第一个值，grid-column-start 为第二个值，grid-row-end 为第三个值。如果 grid-column-start 为字符串，grid-column-end 则为该字符串；否则为 auto。
3. 2 个值，grid-row-start 会被设为第一个值，grid-column-start 为第二个值。如果 grid-row-start 为字符串，grid-row-end 则为该字符串；否则为 auto。如果 grid-column-start 为字符串，grid-column-end 则为该字符串；否则为 auto。
4. 1 个值，grid-row-start 会被设为该值，如果 grid-row-start 为字符串，则其他三项属性值均为该值；否则均为 auto。

所以上面的 grid-area: 1 / 1 相当于：
```css
grid-row-start: 1;
grid-row-end: auto;
grid-column-start: 1;
grid-column-end: auto;
```
img 和 figcaption 具有相同的行开始和列开始，所以发生了重叠。还可以使用字符串写法：
```css
figure {
  display: grid;
  grid: 'nature';
}
figure>img,
figure>figcaption {
  grid-area: nature;
}
```
这里的 grid 是 grid-template-areas 的简写形式，'nature' 字符串可以是任意的（包括中文）。

<iframe src="https://code.juejin.cn/pen/7147681961460318249"></iframe>

### 优点
1. Grid 布局实现的元素层叠不改变容器元素的层叠上下文关系和元素的包含块关系。
2. 方便地控制元素的位置，比如这里的 align-self: end 表示 figcaption 元素的位置在图片的底部，改成 align-self: start 或 align-self: center 则使 figcaption 元素的位置在图片的顶部或中部。
3. 通过设置 align-self:stretch 可以实现半透明覆盖效果。

<iframe src="https://code.juejin.cn/pen/7147683016481964039"></iframe>

## 参考资料
- [使用grid-area等Grid布局属性轻松实现元素层叠效果](https://www.zhangxinxu.com/wordpress/2021/02/grid-area-absolute-cover/)