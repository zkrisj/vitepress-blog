---
date: 23:03 2023/3/22
title: 使用 grid 轻松实现各种布局
tags:
- CSS
description: 网格布局和 flex 弹性盒布局的主要区别在于弹性盒布局是一维布局（沿横向或纵向的），而网格布局是二维布局（同时沿着横向和纵向）。
---
## 介绍
CSS 网格布局用于将一个页面划分为几个主要区域，以及定义这些区域的大小、位置、层次等关系。

与 table 表格一样，网格布局让我们能够按行或列来对齐元素，但在布局上，网格比表格更容易做到且更简单。

### 与弹性盒
网格布局和 flex 弹性盒布局的主要区别在于弹性盒布局是一维布局（沿横向或纵向的），而网格布局是二维布局（同时沿着横向和纵向）。

### 弹性盒的不足
比如以下一个宽度 `500px` 的容器内有五个元素区域，我们使用弹性盒来对齐这些区域。在每个子项目上设置 `flex: 1 1 150px;`，以在 `150px` 基准上伸缩。`flex-wrap` 属性为 `wrap`，从而当容器变得太窄时，元素会换到新的一行。
```html
<div class="wrapper">
  <div>One</div>
  <div>Two</div>
  <div>Three</div>
  <div>Four</div>
  <div>Five</div>
</div>
```
```css
.wrapper {
  width: 500px;
  display: flex;
  flex-wrap: wrap;
}
.wrapper > div {
  flex: 1 1 150px;
}
```
<iframe src="https://code.juejin.cn/pen/7136847075873914911"></iframe>

你可以看到有两个元素被换到了新行。这两个元素共享了这行的可用空间，并没有与上一行的元素对齐。这表示当你允许弹性元素换行时，每个新行都变成了一个新的弹性容器。那有没有可以在新行也与上一行保持对齐的方法？答案是网格。

我们用网格更简单地创建同样的布局。只需要给这些子元素设置设置 3 个 `1fr` 的列，并不需要任何其他属性，它们会自动按顺序填充到网格的单元格中。你可以看到它们按网格规整的排列，行与行、列与列对齐。当有 5 个子元素时，第二行的尾部会留出一个空隙。
```css
.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}
```
`fr` 关键字为 fraction 的缩写，表示了网格容器中的一段可变长度。`repeat()` 函数用于在 CSS 中快速编写网格，`repeat(3, 1fr)` 相当于 `1fr 1fr 1fr`。
<iframe src="https://code.juejin.cn/pen/7136851598386397192"></iframe>

#### 如何选择该用网格还是弹性盒？
- 我只需要按行或者列控制布局？那就用弹性盒子。
- 我需要同时按行和列控制布局？那就用网格。

弹性盒关注的是内容，而网格侧重布局。当你使用弹性盒，并发现自己禁用了一些弹性特性，那你可能需要的是 CSS 网格布局。例如，你给一个弹性元素设置百分比宽度来使它和上一行的元素对齐。这种情况下，网格很可能是一个更好的选择。

详细可以 [MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Grid_Layout) 了解以下，接下来我们来使用 grid 实现各种布局。

## 超级居中布局
![bg2020080703.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c2973a8b3fc447887d47844cac893bc~tplv-k3u1fbpfcp-watermark.image?)

```css
.parent {
    display: grid;
    place-items: center;
} 
```
<iframe src="https://code.juejin.cn/pen/7136843852375130143"></iframe>

其中 `place-items` 属性是一个简写形式。
```
place-items: <align-items> <justify-items>;
```
`align-items` 属性控制垂直位置，`justify-items` 属性控制水平位置。如果未提供第二个值，则第一个值作为第二个值的默认值。所以，`place-items: center;` 等同于 `place-items: center center;`。

## 侧边栏布局
一个边栏，一个主栏。

![微信截图_20220828174254.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4de0883e4022498b8058dcdb862afab2~tplv-k3u1fbpfcp-watermark.image?)

```css
.container {
    display: grid;
    grid-template-columns: minmax(150px, 25%) 1fr;
}
```
<iframe src="https://code.juejin.cn/pen/7136859008542965768"></iframe>

这里使用 `minmax(最小值, 最大值)` 函数定义了一个长宽范围的闭区间，表示列宽不会收缩小于 150px 且不会拉伸大于容器宽度的 25%。每个参数分别是 `<length>`、`<percentage>`、`<flex>` 的一种，或者是 `max-content`、`min-content`、或 `auto` 之一。如果 `最大值` < `最小值`，则 `最大值` 被忽略并返回 `最小值`。`<flex>` 值作为 `最大值` 时设置网格轨道的弹性系数；作为 `最小值` 时无效。`auto` 
作为最大值时，等价于 `max-content`；作为 `最小值` 时，它表示轨道中单元格最小长宽（`min-width/min-height`）的最大值。

## 三明治布局
页面在垂直方向上，分成三部分：页眉、内容区、页脚。这个布局会根据设备宽度，自动适应，并且不管内容区有多少内容，页脚始终在容器底部（粘性页脚）。

![bg2020080715.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/04babcbe2e5a4c6a867ad24dfd004a64~tplv-k3u1fbpfcp-watermark.image?)

```css
.container {
    display: grid;
    grid-template-rows: auto 1fr auto;
}
```
<iframe src="https://code.juejin.cn/pen/7136862067188826152"></iframe>
其中第一部分（页眉）和第三部分（页脚）的高度都为 `auto`，表示本来的内容高度；第二部分（内容区）的高度为 `1fr`，表示剩余的所有高度，这可以保证页脚始终在容器的底部。

## 经典圣杯布局
最常用的布局，所以被比喻为圣杯。它将页面分成五个部分，除了页眉和页脚，内容区分成左边栏、主栏、右边栏。

![bg2020080717.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/52a948e54e304a98ab5245a4211557a8~tplv-k3u1fbpfcp-watermark.image?)

```css
.container {
    display: grid;
    grid-template: auto 1fr auto / auto 1fr auto;
}
```
<iframe src="https://code.juejin.cn/pen/7136886700675956743"></iframe>

`grid-template` 是 `grid-template-rows`、`grid-template-columns` 与 `grid-template-areas` 的简写形式。有三种写法：
1. 关键字，默认 `grid-template: none;`。
2. `grid-template-rows / grid-template-columns`，例如本例子中的 `grid-template: auto 1fr auto / auto 1fr auto;`。
3. `grid-template-areas grid-template-rows / grid-template-column`，例如：
```
grid-template: 
            "a a a" 40px
            "b c c" 40px
            "b c c" 40px / 1fr 1fr 1fr;
```

## 圣杯布局2
将页面分成四个部分，除了页眉和页脚，内容区分成左边栏、主栏。

![圣杯布局2.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0480ac7e5e7b4a84acf3b9fa222c8052~tplv-k3u1fbpfcp-watermark.image?)

```css
#container {
  display: grid;
  grid-template: "head head" 30px
                 "nav  main" 1fr
                 "nav  foot" 30px / 120px 1fr;
}

header {
  background-color: lime;
  grid-area: head;
}

nav {
  background-color: lightblue;
  grid-area: nav;
}

main {
  background-color: yellow;
  grid-area: main;
}

footer {
  background-color: red;
  grid-area: foot;
}
```
<iframe src="https://code.juejin.cn/pen/7137164499039027231"></iframe>

这里自定义了四个 `grid-area` 标识，并在  `grid-template` 中引用它们。然后页眉被分配了 30px 固定高度和 100% 的宽度；左边栏被分配了 1fr + 30px 弹性高度和 120px 固定宽度；主栏被分配了 1fr 的弹性高度和 1fr 的弹性宽度；页脚被分配了 30px 的固定高度和 1fr 的弹性宽度。

## 瀑布流布局
表现为参差不齐的多栏布局，以图片为主，大小不一的图片按照一定的规律排列。随着页面滚动条向下滚动，还会不断加载数据块并附加至当前尾部。

![微信截图_20220917133843.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/683d4ae1a6e24117b84b6562e4e9f1d3~tplv-k3u1fbpfcp-watermark.image?)

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  grid-auto-rows: minmax(100px, auto);
}
.one {
  grid-column: 1 / 2;
  grid-row: 1;
  background: #19CAAD;
}
.two { 
  grid-column: 2 / 4;
  grid-row: 1 / 3;
  background: #8CC7B5;
}
.three {
  grid-row: 2 / 5;
  grid-column: 1;
  background: #D1BA74;
}
.four {
  grid-column: 3;
  grid-row: 3;
  background: #BEE7E9;
}
.five {
  grid-column: 2;
  grid-row: 3/5;
  background: #E6CEAC;
}
.six {
  grid-column: 3;
  grid-row: 4;
  background: #ECAD9E;
}
```
<iframe src="https://code.juejin.cn/pen/7144219708022226975"></iframe>

`grid-auto-columns` 属性和 `grid-auto-rows` 属性表示浏览器将根据指定值自动设置网格的列宽和行高。它们的写法与 `grid-template-columns` 和 `grid-template-rows` 完全相同。如果没有指定这四个属性，浏览器会根据单元格内容的大小，决定网格的列宽和行高。

## 跨网格布局
另一个经典布局：12 网格布局。

![1linelayouts.glitch.me_.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b5b7dbf808a4a39acfa9a16e5a9d48f~tplv-k3u1fbpfcp-watermark.image?)

```css
.parent {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
}

.child-span-12 {
  grid-column: 1 / 13;
}
```
<iframe src="https://code.juejin.cn/pen/7136878064616603663"></iframe>

`repeat(12, 1fr);` 表示 12 弹性宽度列。`grid-column: 1 / 13` 将跨越从第一列到最后一列（第 13 列），总共占 12 列。也可以使用 `span` 关键字，设置起始线，然后设置从该起点跨越的列数。`grid-column: 1 / span 12` 等效于 `grid-column: 1 / 13` ，而 `grid-column: 2 / span 6` 等效于 `grid-column: 2 / 8` 。

## 参考资料
1. [1-Line Layouts*](https://1linelayouts.glitch.me/)
2. [只要一行代码，实现五种 CSS 经典布局](http://www.ruanyifeng.com/blog/2020/08/five-css-layouts-in-one-line.html)