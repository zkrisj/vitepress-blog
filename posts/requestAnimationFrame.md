---
date: 21:23 2023/3/22
title: 学会使用 requestAnimationFrame
tags:
- JS
description: requestAnimationFrame 是由浏览器专门为动画提供的API，用法类似于 setTimeout，但是不需要设置时间间隔。
---
## 介绍
大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.7ms。

`setTimeout` 和 `setInterval` 的问题是，它们都不精确。它们的内在运行机制决定了时间间隔参数实际上只是指定了把动画代码添加到浏览器UI线程队列中以等待执行的时间。如果队列前面已经加入了其他任务，那动画代码就要等前面的任务完成后再执行。

`requestAnimationFrame` 是由浏览器专门为动画提供的API，用法类似于 `setTimeout`，但是不需要设置时间间隔。

当 `requestAnimationFrame()` 运行在后台标签页或者隐藏的 `<iframe>` 里时，`requestAnimationFrame()` 会被暂停调用，从而就提升性能和电池寿命。

## 语法
```js
requestID: int = window.requestAnimationFrame(callback);
window.cancelAnimationFrame(requestID);
```
回调函数会被传入一个 `double` 类型时间戳，该参数与 `performance.now()` 的返回值相同，它表示开始去执行回调函数的时刻。

在同一个帧中的多个回调函数，它们每一个都会接受到一个相同的时间戳，即使在计算上一个回调函数的工作负载期间已经消耗了一些时间。

返回一个 `long` 整数，是个非零值，表示请求 ID ，是回调列表中唯一的标识，用于传给 `window.cancelAnimationFrame()` 以取消回调函数。

## 使用
```html
<div id="myDiv">0%</div>
<script>
let start;
myDiv.style.width = 0;
(function fn() {
    if (parseInt(myDiv.style.width) < 500) {
        myDiv.style.width = parseInt(myDiv.style.width) + 5 + 'px';
        myDiv.innerHTML = parseInt(myDiv.style.width) / 5 + '%';
        timer = requestAnimationFrame(fn);
    } else cancelAnimationFrame(timer);
})();
</script>
<style>
    div {
        background: lightblue;
        width: 0;
    }
</style>
```
<iframe src="https://code.juejin.cn/pen/7127173816790286349"></iframe>

## 总结
`requestAnimationFrame()` 可以让各种网页动画效果（DOM动画、Canvas动画、SVG动画、WebGL动画）能够有一个统一的刷新机制，从而节省系统资源，提高系统性能，改善视觉效果。
