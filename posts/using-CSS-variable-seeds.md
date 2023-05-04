---
date: 6:03 2023/5/5
title: 使用变量种子计数器扩展 CSS 动画
tags:
- CSS
description: 不是所有的 CSS 属性都能使用 animation 属性实现动画效果，最典型的例子就是 background-image 渐变。
---
## 介绍
不是所有的 CSS 属性都能使用 `animation` 属性实现动画效果，最典型的例子就是 `background-image` 渐变。
```css
.gradient {
  background-image: linear-gradient(45deg, red 50%, blue 50%);
}
```
其中无论是角度（`45deg`），颜色（`red`, `blue`）还是位置（`50%`）单独作为属性者都是可以动画过渡的，但是合在一起作为渐变背景的时候是无法产生过渡效果的，因为 `background-image` 的语义是图片。

## 变量种子计数器
Chrome 等浏览器（不包括 Safari）有个特性，就是当我们使用 `@keyframes` 定义关键帧的时候，关键帧里面设置的属性也是会运行的，典型的案例就是 `content` 属性与内容变化。

例如实现一个“正在加载中…”效果：
```html
<button>正在加载中<dot></dot></button>
```
```css
dot::before {
  content: '...';
  position: absolute;
  animation: dot 3s infinite step-start both;
}
dot:after {
  content: '...';
  color: transparent;
}
@keyframes dot {
  33% {
    content: '.';
  }
  66% {
    content: '..';
  }
}
```
<iframe src="https://code.juejin.cn/pen/7228433196566708263"></iframe>

不仅普通的 CSS 属性可以在 CSS 动画关键帧中运行，CSS 自定义属性（CSS 变量）也可以在 CSS 动画关键帧中运行。例如：
```css
@keyframes var {
  33% { --someVar: 33%; }
  66% { --someVar: 66%; }
}
```
如果我们某一个 CSS 属性值是基于这个 `--someVar` 变量构成的，那岂不是就算这个属性值不支持 CSS 动画，我只要让每一个百分比值的间隙足够的小，不也能够实现一个平滑的动画效果？

具体做法就是，把 CSS 动画关键帧从 0%-100% 分成 101 份，然后每一份从 0 开始依次计数，就像是个计数器一样，然后把这个计数器分配给一个特定的 CSS 变量。最终我们可以得到一个如下所示的 CSS 动画“变量种子计数器”。
```css
@keyframes seed {
  0%{--seed:0}1%{--seed:1}2%{--seed:2}3%{--seed:3}4%{--seed:4}5%{--seed:5}6%{--seed:6}7%{--seed:7}8%{--seed:8}9%{--seed:9}10%{--seed:10}11%{--seed:11}12%{--seed:12}13%{--seed:13}14%{--seed:14}15%{--seed:15}16%{--seed:16}17%{--seed:17}18%{--seed:18}19%{--seed:19}20%{--seed:20}21%{--seed:21}22%{--seed:22}23%{--seed:23}24%{--seed:24}25%{--seed:25}26%{--seed:26}27%{--seed:27}28%{--seed:28}29%{--seed:29}30%{--seed:30}31%{--seed:31}32%{--seed:32}33%{--seed:33}34%{--seed:34}35%{--seed:35}36%{--seed:36}37%{--seed:37}38%{--seed:38}39%{--seed:39}40%{--seed:40}41%{--seed:41}42%{--seed:42}43%{--seed:43}44%{--seed:44}45%{--seed:45}46%{--seed:46}47%{--seed:47}48%{--seed:48}49%{--seed:49}50%{--seed:50}51%{--seed:51}52%{--seed:52}53%{--seed:53}54%{--seed:54}55%{--seed:55}56%{--seed:56}57%{--seed:57}58%{--seed:58}59%{--seed:59}60%{--seed:60}61%{--seed:61}62%{--seed:62}63%{--seed:63}64%{--seed:64}65%{--seed:65}66%{--seed:66}67%{--seed:67}68%{--seed:68}69%{--seed:69}70%{--seed:70}71%{--seed:71}72%{--seed:72}73%{--seed:73}74%{--seed:74}75%{--seed:75}76%{--seed:76}77%{--seed:77}78%{--seed:78}79%{--seed:79}80%{--seed:80}81%{--seed:81}82%{--seed:82}83%{--seed:83}84%{--seed:84}85%{--seed:85}86%{--seed:86}87%{--seed:87}88%{--seed:88}89%{--seed:89}90%{--seed:90}91%{--seed:91}92%{--seed:92}93%{--seed:93}94%{--seed:94}95%{--seed:95}96%{--seed:96}97%{--seed:97}98%{--seed:98}99%{--seed:99}100%{--seed:100}
}
```
上面这段 `@keyframes seed{}` 相关 CSS 代码就是一个可以无限使用的“动画种子”，无论是那些原本支持 CSS 动画的属性，还是不支持 CSS 动画的属性，只要它的属性值是与数值相关的，都能够借助这个“动画种子”实现动画效果。

例如一开始那个线性渐变的例子，我们可以让渐变旋转角度和我们“动画种子”中的 `--seed` 变量相关联，配合 `animation` 属性就能实现渐变旋转的效果了：
```css
.gradient {
  width: 150px;
  height: 150px;
  background-image: linear-gradient(calc(3.6deg * var(--seed)), red 50%, blue 50%);
  animation: seed 1s linear infinite;
}
```
<iframe src="https://code.juejin.cn/pen/7228431837340074045"></iframe>

## 参考资料
1. [使用“变量种子计数器”扩展CSS动画更多可能性](https://www.zhangxinxu.com/wordpress/2019/05/css-variable-seed-extend-animation/)
