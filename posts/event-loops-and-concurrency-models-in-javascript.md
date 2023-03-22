---
date: 23:15 2023/3/22
title: 理解 JavaScript 中的事件循环和并发模型
tags:
- JS
description: JavaScript 为什么是单线程？因为 JavaScript 是可操纵 DOM 的，如果两个线程同时操作 DOM，那浏览器就无法保证 DOM 数据的一致性了。
---
## [单线程]
我们先了解一下进程和线程的概念。
1. 进程：CPU 进行资源分配的基本单位，线程：CPU 调度的最小单位。
2. 进程是一个应用的执行程序，线程则是进程内部执行某个部分的程序。
3. 线程完成任务后将结果返回给进程，进程再返回给 CPU 处理。

### JavaScript 为什么是单线程？
因为 JavaScript 是可操纵 DOM 的，如果两个线程同时操作 DOM，那浏览器就无法保证 DOM 数据的一致性了。

在单线程上运行代码非常容易，不必处理多线程环境中出现的复杂场景，例如死锁，但也无法充分发挥计算机的 CPU 计算能力。

#### 与 GUI 渲染线程互斥
如果 JS 引擎线程和 GUI 渲染线程同时运行，初始渲染在修改元素之后完成，那么渲染前后获得的元素数据就不一致了。
1. 当 JS 引擎线程执行时 GUI 会被挂起，GUI更新会被保存在一个队列中等到 JS 引擎线程空闲时执行。
2. 如果 JS 引擎线程正在进行巨量的计算，此时就算 GUI 有更新，也会被保存到队列中等待，就会造成页面的渲染阻塞。

#### Web Worker
现在浏览器可以使用 Web Worker API 为 JavaScript 创造多线程环境，为主线程（通常是 UI 线程）创建 Worker 线程，并负责一些计算密集型或高延迟的任务。

在 nodeJS 中通过以下方式使用：
```js
const {
  Worker,
  isMainThread,
  setEnvironmentData,
  getEnvironmentData,
} = require('worker_threads');

if (isMainThread) {
  setEnvironmentData('Hello', 'World!');
  const worker = new Worker(__filename);
} else {
  console.log(getEnvironmentData('Hello'));  // Prints 'World!'.
}
```
工作者（线程）对于执行 CPU 密集型 JavaScript 操作很有用。它们对 I/O 密集型工作没有多大帮助。Node.js 内置的异步 I/O 操作比 Workers 效率更高。

### nodeJS 也是单线程吗？
1. Javascript 代码由 JS 执行线程 V8 执行（是单线程的），I/O（数据交换，通常是磁盘、网络等）操作是有其它线程的。

![单线程.webp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dbc67bb519f14453a6e551a0988cdd4b~tplv-k3u1fbpfcp-watermark.image?)

2. nodeJS 并没有给 Javascript 执行时创建新线程的能力，所有阻塞操作通过 I/O 线程池来执行，由 Libuv（是一个跨平台的异步 I/O 库，它结合了 UNIX 下的 libev 和 Windows 下的 IOCP 的特性）实现。

## 调用栈 vs 消息队列 vs 微任务
- 调用栈：函数调用形成了一个由若干帧组成的先进后出的栈。
- 消息队列：一个待处理消息的任务队列。每一个消息都关联着一个用以处理这个消息的回调函数。队列和栈是相反的，队列是先进先出的。例如 setTimeout()、setInterval() 和事件触发的回调。消息队列中的任务需要在下一次事件循环迭代开始之后才会被执行。
- 微任务：ECMAScript 2015 引入了作业队列（微任务）的概念，Promise 使用了该队列（也在 ES2015 引入）。微任务在下一次事件循环开始之前执行。

优先级：调用栈 > 微任务 > 消息队列。
```js
// 调用栈
function func() {
    console.log("func");
}
// 消息队列
setTimeout(() => {
    console.log("setTimeout");
});
const p = new Promise((resolve, reject) => {
    // 调用栈
    console.log("Promise");
    resolve();
});
// 微任务
p.then(() => {
    console.log("then");
});
func();
/*
 打印结果：
 Promise
 func
 then
 setTimeout
 */
```

## 事件循环
1. 不断地检查调用栈，按顺序执行这些任务，直到调用栈为空；
2. 之后，微任务将被执行，直到微任务队列为空；
3. 然后浏览器可能会选择更新渲染；
4. 开始下一轮循环。消息队列中的任务会放在下次循环中执行。

事件循环不一定对应于实现线程。例如，可以在单个线程中协同调度多个窗口事件循环。

为了协调事件、用户交互、脚本、渲染、网络等，浏览器必须使用事件循环。由单独的事件触发线程管理。事件循环既可能是浏览器的主事件循环也可能是被一个 web worker 所驱动的事件循环。分为三种类型：
- Window 事件循环：驱动所有同源的窗口，不是指同源策略中的源，而是指由同一个窗口打开的多个子窗口或同一个窗口中的多个 iframe 等。
- Worker 事件循环：驱动 worker。包括所有种类的 worker：web worker、shared worker 和 service worker。由于 Worker 被放在一个或多个独立于主线程的代理中，浏览器可能会用单个或多个事件循环来处理给定类型的所有 worker。
- Worklet 事件循环：驱动运行 worklet 的代理。这包含了 Worklet、AudioWorklet 以及 PaintWorklet。

在特定情况下，同源窗口之间共享事件循环，例如：
- 如果一个窗口打开了另一个窗口，它们可能共享一个事件循环。
- 如果窗口是包含在 iframe 中，则它可能会和包含它的窗口共享一个事件循环。
- 在多进程浏览器中多个窗口碰巧共享了同一个进程。

JavaScript 的事件循环模型与许多其他语言不同的一个特性是：永不阻塞，处理 I/O 时通常通过事件和回调执行，因此当应用程序等待 IndexedDB 查询返回或 XHR 请求返回时，它仍然可以处理其他事情，例如用户输入。由于历史原因有一些例外，如 alert 或者同步 XHR，但应该尽量避免使用它们。

## 并发模型
JavaScript 的并发模型是基于事件循环的，事件循环负责执行代码、收集和处理事件以及执行队列中的子任务。

nodeJS 也是基于事件循环使用事件驱动和异步 I/O（遇到 I/O 请求不阻塞后面的计算，当 I/O 完成后，以事件的方式通知）的方式，由 V8 引擎提供的异步执行回调接口，通过事件和回调来处理大量的并发的。

- 浏览器和 nodeJS 基于不同的技术实现了各自的事件循环。
- nodeJS 的事件循环是基于 libuv，而浏览器的事件循环模型则在 html5 的规范中明确定义。

[单线程]: https://developer.mozilla.org/zh-CN/docs/Web/API/HTML_DOM_API/Microtask_guide/In_depth#%E4%BB%8B%E7%BB%8D