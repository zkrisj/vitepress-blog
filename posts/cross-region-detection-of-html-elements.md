---
date: 23:28 2023/3/22
title: ⛱ HTML 元素的交叉区域检测
tags:
- HTML
description: Intersection Observer API 用于检测目标元素与祖先元素或 viewport 相交情况变化，它可以自动观察元素是否可见，可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做交叉观察器。
---
## 介绍
有时我们需要观察元素是否可见，来进行一些操作。随着互联网的发展，这种需求却与日俱增，比如，下面这些情况都需要用到相交检测：
- 图片懒加载——当图片滚动到可见时才进行加载
- 内容无限滚动——也就是用户滚动到接近内容底部时直接加载更多，而无需用户操作翻页，给用户一种网页可以无限滚动的错觉
- 检测广告的曝光情况——为了计算广告收益，需要知道广告元素的曝光情况
- 在用户看见某个区域时执行任务或播放动画

过去，要检测一个元素是否可见或者两个元素是否相交并不容易，很多解决办法不可靠或性能很差。例如，相交检测通常要用到事件监听，并且需要频繁调用 Element.getBoundingClientRect() 方法以获取相关元素的边界信息。事件监听和调用 Element.getBoundingClientRect() 都是在主线程上运行，因此频繁触发、调用可能会造成性能问题。这种检测方法极其怪异且不优雅。

Intersection Observer API 用于检测目标元素与祖先元素或 viewport 相交情况变化，它可以自动"观察"元素是否可见，可见（visible）的本质是，目标元素与视口产生一个交叉区，所以这个 API 叫做"交叉观察器"。

Intersection Observer API 会注册一个回调函数，每当被监视的元素进入或者退出另外一个元素时 (或者 viewport )，或者两个元素的相交部分大小发生变化时，该回调方法会被触发执行。这样，我们网站的主线程不需要再为了监听元素相交而辛苦劳作，浏览器会自行优化元素相交管理。

Intersection Observer API 无法提供重叠的像素个数或者具体哪个像素重叠，常见的使用方式是——当两个元素相交比例在 N% 左右时，触发回调，以执行某些逻辑。

## 接口
### IntersectionObserver
```js
const observer = new IntersectionObserver(callback);
const observer = new IntersectionObserver(callback, options);

// 开始观察
observer.observe(elementA);
observer.observe(elementB);

// 停止观察
observer.unobserve(element);

// 关闭观察器
observer.disconnect();

// 相交信息对象的数组
observer.takeRecords()
```
- callback
    - 当元素可见比例超过指定阈值后，就会调用观察器的回调函数 callback，一般会触发两次。一次是目标元素刚刚进入视口（开始可见），另一次是完全离开视口（开始不可见）。此回调函数接受两个参数：
        - entries
            - 一个 IntersectionObserverEntry 对象的数组，例如，如果同时有两个被观察的对象的可见性发生变化，entries 数组就会有两个成员。
        - observer
            - 被调用的 IntersectionObserver 实例。

- options 
    - threshold
        - 可以是单一的 number 也可以是 number 数组，target 元素和 root 元素相交程度达到该值的时候 IntersectionObserver 注册的回调函数将会被执行。如果你只是想要探测当 target 元素的在 root 元素中的可见性超过 50% 的时候，你可以指定该属性值为 0.5。如果你想要 target 元素在 root 元素的可见程度每超过 25% 或者减少 25% 就执行一次回调，那么你可以指定一个数组 [0, 0.25, 0.5, 0.75, 1]。默认值是 0 (意味着只要有一个 target 像素出现在 root 元素中，回调函数将会被执行)。该值为 1.0 含义是当 target 完全出现在 root 元素中时候 回调才会被执行。
    - root
        - 指定根 (root) 元素，用于检查目标的可见性。必须是目标元素的父级元素。如果未指定或者为 null，则默认为浏览器视窗。
    - rootMargin
        - 根 (root) 元素的外边距。这组值用于在计算交点之前增大或缩小根元素边界框的每一侧。类似于 CSS 中的 margin 属性，比如 "10px 20px 30px 40px" (top, right, bottom, left)。也可以使用百分比来取值。默认值为 0。在执行回调函数时可由 `IntersectionObserverEntry.rootBounds` 得到。

### IntersectionObserverEntry
描述了目标元素与其根元素容器在某一时刻的交集。可以通过调用 `IntersectionObserver.takeRecords()` 来获取。
#### 属性
- boundingClientRect 只读
    - 目标元素的矩形区域的信息，计算方式与 Element.getBoundingClientRect() 相同。
- intersectionRatio 只读
    - 目标元素的可见比例，即 intersectionRect 占 boundingClientRect 的比例，完全可见时为 1，完全不可见时小于等于 0。
- intersectionRect 只读
    - 根和目标元素的相交区域。与 Element.getBoundingClientRect() 数据结构相同。
- isIntersecting  只读
    - 如果目标元素与交叉区域观察者对象的根相交，则返回 true，即变换是从非交叉状态到交叉状态; 如果返回 false, 变换是从交叉状态到非交叉状态。
- rootBounds 只读
    - 根元素的矩形区域的信息，getBoundingClientRect(root) 方法的返回值，如果没有根元素（即直接相对于视口滚动），则返回 null。
- target 只读
    - 观察的目标元素。
- time 只读
    - 返回交叉被触发时的时间戳。

注意：所有区域均被 Intersection Observer API 当做一个矩形看待。如果元素是不规则的图形也将会被看成一个包含元素所有区域的最小矩形，相似的，如果元素发生的交集部分不是一个矩形，那么也会被看作是一个包含他所有交集区域的最小矩形。上述解释有助于理解 IntersectionObserverEntry 提供的属性。

#### 方法
此接口没有方法。

## 使用
1. 创建一个 IntersectionObserver 对象，并传入相应参数和回调用函数，该回调函数将会在目标 (target) 元素和根 (root) 元素的交集大小超过阈值 (threshold) 规定的大小时候被执行。

```js
const options = {
  root: document.querySelector('#scrollArea'),
  rootMargin: '0px',
  threshold: 1.0
}

const observer = new IntersectionObserver(callback, options);
```
阈值为 1.0 意味着目标元素完全出现在 root 选项指定的元素中可见时，回调函数将会被执行。

2. 创建一个 observer 后需要给定一个目标元素进行观察。

```js
const target = document.querySelector('#listItem');
observer.observe(target);
```
注意：如果指定了 root 选项，则目标必须是根元素的后代。

3. 只要目标满足为 IntersectionObserver 指定的 threshold 阈值，就会调用回调。回调接收 IntersectionObserverEntry 对象和观察者的列表：

```js
const callback =(entries, observer) => {
  entries.forEach(entry => {
    // Each entry describes an intersection change for one observed target element:
    // entry.boundingClientRect
    // entry.intersectionRatio
    // entry.intersectionRect
    // entry.isIntersecting
    // entry.rootBounds
    // entry.target
    // entry.time
  });
};
```
注意：注册的回调函数将会在主线程中被执行。所以该函数执行速度要尽可能的快。如果有一些耗时的操作需要执行，建议使用 `window.requestIdleCallback()` 方法。

## 懒加载（lazy load）
某些静态资源（比如图片），只有用户向下滚动，它们进入视口时才加载，这样可以节省带宽，提高网页性能。
```js
const observer = new IntersectionObserver(
  function(changes) {
    changes.forEach(function(change) {
      const container = change.target;
      const content = container.querySelector('template').content;
      container.appendChild(content);
      observer.unobserve(container);
    });
  }
);

document.querySelectorAll('.lazy-loaded').forEach(function (item) {
  observer.observe(item);
});
```
上面代码中，只有目标区域可见时，才会将模板内容插入真实 DOM，从而加载静态资源。

## 无限滚动（infinite scroll）
一旦页尾栏可见，就表示用户到达了页面底部，从而加载新的条目放在页尾栏前面。
```js
const intersectionObserver = new IntersectionObserver(
  function (entries) {
    // 如果不可见，就返回
    if (entries[0].intersectionRatio <= 0) return;
    loadItems(10);
    console.log('Loaded new items');
  });

// 开始观察
intersectionObserver.observe(
  document.querySelector('.scrollerFooter')
);
```

## 示例1
以下的例子，每一个 box 的四个边角都会显示自身在根元素中的可见程度百分比，所以在你滚动根元素的时候你将会看到四个边角的数值一直在发生变化。每一个 box 都有不同的 thresholds：
1. 第一个盒子的 thresholds 数组是 [0.00, 0.01, 0.02, ..., 0.99, 1.00]。
2. 第二个盒子只有唯一的值 [0.5]。
3. 第三个盒子的 thresholds 按 10% 从 0 递增 (0%, 10%, 20%, etc.)。
4. 最后一个盒子为 [0, 0.25, 0.5, 0.75, 1.0]。

<iframe src="https://code.juejin.cn/pen/7140247142072844320"></iframe>

## 示例2
同样上下滚动这个页面，查看盒子的背景变化。

<iframe src="https://code.juejin.cn/pen/7140261765115281411"></iframe>