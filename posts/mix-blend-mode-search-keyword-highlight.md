---
date: 21:27 2023/3/23
title: 使用 mix-blend-mode 实现不套标签搜索关键字高亮
tags:
- CSS
description: 一般实现是文字搜索高亮，需要动态给文字内容套一层标签，然后才能改变匹配文字的颜色。现在，通过 mix-blend-mode 混合模式，我们可以在不嵌套任何标签的情况下，让任意的文字颜色变色。
---
## mix-blend-mode
一般实现是文字搜索高亮，需要动态给文字内容套一层标签，然后才能改变匹配文字的颜色。现在，通过 mix-blend-mode 混合模式，我们可以在不嵌套任何标签的情况下，让任意的文字颜色变色。

mix-blend-mode CSS 属性设置元素的内容与元素的背景或元素的直系父元素的内容如何混合。它的取值数据类型为 `<blend-mode>`，描述当元素重叠时，颜色应当如何呈现。

当层重叠时，采用前景和背景的颜色值，执行其混合模式计算并返回最终的颜色值。
```md
<blend-mode> = 
  normal       | 最终颜色都是顶层颜色，无论底层颜色是什么。
  multiply     | 最终颜色是顶层和底层颜色相乘叠加的结果。
  screen       | 最终的颜色是反转顶层颜色和底层颜色，将反转后的两个颜色相乘，再反转得到结果。
  overlay      | 如果底层颜色比顶层颜色深，则最终颜色是 multiply 的结果；
                 如果底层颜色比顶层颜色浅，则最终颜色是 screen 的结果。
                 适合实现文字水印效果。
  darken       | 最终颜色由两层颜色中每个颜色通道的最暗值所组成的颜色。
  lighten      | 最终颜色由两层颜色中每个颜色通道的最亮值所组成的颜色。
  color-dodge  | 最终颜色是将底层颜色除以顶层颜色的反色的结果。
                 可以用来保护底图的高光，适合处理高光下的人物照片。
  color-burn   | 最终颜色是反转底色并将值除以顶色然后反转该值的结果。
                 和特定的色彩进行混合，可以营造更加幽深的意境。
  hard-light   | 如果顶层颜色比底层颜色深，则最终颜色是 multiply 的结果；
                 如果顶层颜色比底层颜色浅，则最终颜色是 screen 的结果。 
                 相当于 overlay 两层颠倒的结果。
                 好像耀眼的聚光灯照射过来，表现为图像亮的地方更亮，暗的地方更暗。
  soft-light   | 最终颜色类似于 hard-light 的结果，但更加柔和一些。 
                 好像发散的光源弥漫过来，给图像着色的时候常用此混合模式。
  difference   | 最终颜色是 两种颜色中较浅的颜色 减去 两种颜色中较深的颜色 得到的结果。
                 黑色层不会造成变化，而白色层会反转另一层的颜色。
                 可以实现颜色的反色效果。
  exclusion    | 最终颜色类似于 difference，但对比度更低一些。 
  hue          | 最终颜色具有顶层颜色的色调，同时使用底层颜色的饱和度和亮度。
  saturation   | 最终颜色具有顶层颜色的饱和度，同时使用底层颜色的色调和亮度。
                 饱和度为零的纯灰色背景层不会造成变化。
  color        | 最终颜色具有顶层颜色的色调和饱和度，同时使用底层颜色的亮度。
                 该效果保留了灰度，可用于为前景着色。
  luminosity   | 最终颜色具有顶层颜色的亮度，同时使用底层颜色的色调和饱和度。
                 相当于 color 模式两层颠倒的结果。
```

## 原理
1. 绑定输入事件。
2. 获取输入的关键字和其文本长度。
3. 将原文文本根据关键字拆分成数组并遍历。
4. 对每个拆分子项创建一个 Range 文档片段，设置起始位置为原文文本节点，偏移量为当前子项的长度；设置结束位置为原文文本节点，偏移量为当前子项的长度 + 关键字文本长度。
5. 获取每个拆分子项的 DOMRect 对象，它包含了 Range 中所有元素组成的矩形边界的信息。
6. 对每个拆分子项创建一个对应浮层元素，设置绝对定位，左边界为当前 DOMRect 对象的左坐标值，上边界为当前 DOMRect 对象的顶坐标值 + 文档在垂直方向已滚动的像素值，宽高为为当前 DOMRect 对象的宽高。设置浮层元素 mix-blend-mode: overlay。

HTML 代码如下：
```html
<input id="search" type="search" placeholder="输入内容搜索">
<h6 id="target">
上面输入框可以输入任意这段内容中出现的文字或者单词，就会看到文字有高亮效果。但是，这种高亮效果既不是文字选中，也不是通过包裹标签元素实现的，而是直接覆盖在上面，然后通过叠加混合模式实现的。值 overlay 叠加混合模式适合浅色文字，如果是深色文字，可以使用 lighten；如果要高亮背景，可以使用 difference。
</h6>
```
CSS 代码如下：
```css
ui-overlay {
  position: absolute;
  background: red;
  mix-blend-mode: overlay;
}
[id] {
  background: white;
  color: gray;
}
```
JS 代码如下：
```js
search.addEventListener('input', e => {
  document.querySelectorAll('ui-overlay').forEach(overlay => overlay.remove());
  const value = this.value.trim();
  const { length } = value;
  if (!length) return;
  const arrMatchs = target.textContent.split(value);
  if (arrMatchs.length > 1) {
    let start = 0;
    arrMatchs.forEach((parts, index) => {
      if (index === arrMatchs.length - 1) return;
      const range = document.createRange();
      start += parts.length;
      range.setStart(target.firstChild, start);
      range.setEnd(target.firstChild, start + length);
      const bound = range.getBoundingClientRect();
      const eleOverlay = document.createElement('ui-overlay');
      document.body.appendChild(eleOverlay);
      eleOverlay.style.left = bound.left + 'px';
      eleOverlay.style.top = (bound.top + window.pageYOffset) + 'px';
      eleOverlay.style.width = bound.width + 'px';
      eleOverlay.style.height = bound.height + 'px';
      start += length;
    });
  }
});
```

## 改进
上面的搜索原文只能为文本节点，如果原文嵌套了标签，则无法高亮。所以需要递归遍历原文所有子节点：
```js
function getNodeAndOffset(wrap_dom, start = 0, end = 0) {
  const txtList = [];
  // 递归遍历，提取出所有 #text
  (function map(chlids) {
    [...chlids].forEach(el => el.nodeName === '#text' ? txtList.push(el) : map(el.childNodes));
  })(wrap_dom.childNodes);
  // 计算文本的位置区间 [0,3]、[3, 8]、[8,10]
  const clips = txtList.reduce((arr, item, index) => {
    const end = item.textContent.length + (arr[index - 1] ? arr[index - 1][2] : 0);
    arr.push([item, end - item.textContent.length, end]);
    return arr;
  }, []);
  // 查找满足条件的范围区间
  const startNode = clips.find(el => start >= el[1] && start < el[2]);
  const endNode = clips.find(el => end >= el[1] && end < el[2]);
  return [startNode[0], start - startNode[1], endNode[0], end - endNode[1]];
}
```
然后设置每个拆分子项对应的 Range 文档片段的起始位置、结束位置、偏移量：
```js
const nodes = getNodeAndOffset(target, start, start + length);
range.setStart(nodes[0], nodes[1]);
range.setEnd(nodes[2], nodes[3]);
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7161999028673052679"></iframe>