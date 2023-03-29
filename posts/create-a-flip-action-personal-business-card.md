---
date: 16:31 2023/3/24
title: 「青训营 X 码上掘金」制作一个翻转动效的个人名片
tags:
- CSS
description: rotateY 函数定义了一个 2D 转换，它可以让一个元素围绕纵坐标 (垂直轴) 旋转，transform-style 设置元素的子元素是位于 3D 空间中还是平面中。
---
## 介绍
> 名片（Business card），是一种载有关于公司或个人的联系信息的卡片，常用于商务往来场合之中，作为一种便利和记忆辅助工具的共享。名片通常包括：姓名、单位或商业机构名称（通常带有商标）、以及联系信息（如：街道地址、电话号码、传真号码、电子邮件地址及网站）。

名片是向人介绍自我的重要工具，作为一名程序员用代码做自我介绍是一件非常酷炫的事情。用代码制作一张名片最直观地介绍给别人的方式就是通过使用 HTML 绘制一个网页来显示了，下面我们就来制作一个翻转动效的个人名片。

## 实现
1. 创建一个外部容器用来封装名片内部各个元素，一个内部容器用来实现翻转动效。
```html
<div class="flip-card">
  <div class="flip-card-inner"></div>
</div>
```
翻转动效需要使用 CSS transform、transform-style 属性和 rotateY 函数，rotateY 函数定义了一个 2D 转换，它可以让一个元素围绕纵坐标 (垂直轴) 旋转，transform-style 设置元素的子元素是位于 3D 空间中还是平面中。
```css
.flip-card {
  width: 480px;
  height: 320px;
  margin-bottom: 1em;
}
.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}
.rotate {
  transform: rotateY(180deg);
}
```

2. 创建名片正面的元素。
```html
<div class="flip-card-front">
  <figure class="snip">
    <figcaption>
      <h2>斯图尔特 <span>怀特</span>
      </h2>
      <p>我想如果我们不能嘲笑那些没有意义的事情，我们就无法对很多生活做出反应。</p>
      <div class="icons">
        <a href="#">
          <i class="ion-ios-home"></i>
        </a>
        <a href="#">
          <i class="ion-ios-email"></i>
        </a>
        <a href="#">
          <i class="ion-ios-telephone"></i>
        </a>
      </div>
    </figcaption>
    <img src="https://i.328888.xyz/2023/01/15/2wXwF.jpeg">
    <div class="position">网站设计者</div>
  </figure>
</div>
```
由于要使用网络字体和图标，所以要通过链接引入（也可以使用 link 元素）。
```css
@import url(https://fonts.googleapis.com/css?family=Raleway:400,200,300,800);
@import url(https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css);
body {
  font-family: 'Raleway', Arial, sans-serif;
  background-color: #212121;
}
```

3. 创建名片背面的元素。
```html
<div class="flip-card-back" style="--img: url(https://i.328888.xyz/2023/01/15/2wXwF.jpeg)">
  <h2>电话：123</h2>
  <h2>邮箱：123@qq.com</h2>
  <h2>地址：浙江省·杭州市</h2>
  <h2>网址：https://zkrisj.gitee.io</h2>
</div>
```
背面是个人信息的详细资料，背景设置为正面图片+径向渐变，由于字体颜色容易被背景色光线干扰，所以加了一个 background-blend-mode CSS 属性，它用来定义该元素的背景图片与背景色如何混合。
```css
.flip-card-front, .flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  z-index: 1;
}
.flip-card-front {
  background-color: #bbb;
}
.flip-card-back {
  background: var(--img) 0 / 100% 100%, radial-gradient(#e4d8fb, #3F51B5);
  background-blend-mode: darken;
  color: white;
  transform: rotateY(180deg);
  display: grid;
}
.flip-card-back h2 {
  margin-left: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
figure.snip {
  position: relative;
  overflow: hidden;
  margin: auto;
  width: 480px;
  height: 320px;
  background: #ffffff;
  color: #000000;
}
figure.snip * {
  box-sizing: border-box;
}
figure.snip>img {
  width: 50%;
  border-radius: 50%;
  border: 4px solid #ffffff;
  transition: all 0.35s ease-in-out;
  transform: scale(1.6);
  position: relative;
  float: right;
  right: -15%;
}
figure.snip figcaption {
  padding: 20px 30px 20px 20px;
  position: absolute;
  left: 0;
  width: 50%;
}
figure.snip figcaption h2,
figure.snip figcaption p {
  margin: 0;
  text-align: left;
  padding: 10px 0;
  width: 100%;
}
figure.snip figcaption h2 {
  font-size: 1.3em;
  font-weight: 300;
  text-transform: uppercase;
  border-bottom: 1px solid rgba(0, 0, 0, 0.2);
}
figure.snip figcaption h2 span {
  font-weight: 800;
}
figure.snip figcaption p {
  font-size: 0.9em;
  opacity: 0.8;
}
figure.snip figcaption .icons {
  width: 100%;
  text-align: left;
}
figure.snip figcaption .icons i {
  font-size: 28px;
  padding: 5px;
  top: 50%;
  color: #000000;
}
figure.snip figcaption a {
  opacity: 0.3;
  transition: opacity 0.35s;
}
figure.snip figcaption a:hover {
  opacity: 0.8;
}
figure.snip .position {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: left;
  padding: 15px 30px;
  font-size: 0.9em;
  opacity: 1;
  font-style: italic;
  color: #ffffff;
  background: #000000;
  clear: both;
}
```

4. 绑定点击事件，当点击正面图片时，名片将翻转到背面，而点击背面背景时切换回正面。
```js
for (const f of document.querySelectorAll('.flip-card-inner')) {
  f.querySelectorAll('img, .flip-card-back').forEach(v => v.onclick = e => {
    f.classList.toggle('rotate');
  });
}
```

## 完整代码+码上掘金

<iframe src="https://code.juejin.cn/pen/7188753914756333625"></iframe>