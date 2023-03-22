---
date: 23:00 2023/3/22
title: 关于 虚拟 DOM、Shadow DOM 和 DocumentFragment
tags:
- JS
- Vue
description: 如果数据绑定将开发者从操作 DOM 中解放了出来，那虚拟 DOM 则为数据绑定提供了性能保证，还有分层设计、跨平台以及服务端渲染等特性。
---
## Virtual DOM
如果[数据绑定](https://zh.wikipedia.org/wiki/%E6%95%B0%E6%8D%AE%E7%BB%91%E5%AE%9A "数据绑定")将开发者从操作 DOM 中解放了出来，那虚拟 DOM 则为数据绑定提供了性能保证，还有分层设计、跨平台以及服务端渲染等特性。

### 原理
虚拟 DOM 本质上就是在 JS 和 DOM 之间做了一个缓存。可以类比 CPU（JS） 和硬盘（DOM），直接操作硬盘（DOM）很慢，我们就在它们之间加个内存（Virtual DOM），CPU（JS）只操作内存（Virtual DOM），最后再把变更写入硬盘（DOM）。

并且虚拟 DOM 还会使用 Diff 算法来计算出真正需要更新的节点，从而最大限度地减少 DOM 操作，提升性能。

虚拟 DOM 的实现主要包括三个部分：
1. 用 JavaScript 对象模拟真实 DOM 树，对真实 DOM 进行抽象；
2. diff 算法 — 比较两棵虚拟 DOM 树的差异；
3. pach 算法(打补丁) — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

例如，一个 Vue 组件的 HTML 结构为：
```html
<template>
    <div id="app" class="container">
        <h1>hello</h1>
    </div>
</template>
```
Vue 在编译时会将 template 模板转换成 VNode 对象并缓存下来：
```html
{
  type:'div',
  props:{ id:'app', class:'container' },
  children: [
    { type: 'h1', children:'hello' }
  ]
}
```
这样当组件状态数据发生变化时，会触发虚拟 DOM 数据的变化，然后 Vue 会通过 Diff 算法把数据发生变化后生成的 VNode 与前一次缓存下来的 VNode 进行对比，找出差异，然后只对有差异的的真实 DOM 节点进行更新。

**可以看到，虚拟 DOM 的主要作用就是控制重新渲染。** 那浏览器什么情况下会重新渲染？
### 控制重绘（repaint）和回流（reflow）的频率
一个页面从加载到完成，首先需要构建 DOM 树，然后根据 DOM 节点的几何属性形成 render 树(渲染树)，当渲染树构建完成，页面就根据 DOM 树开始布局，渲染树也根据设置的样式对应的渲染这些节点。当 DOM 树改变时会发生回流，而当 DOM 树或者渲染树改变时都会发生重绘。

当我们增删 DOM 节点或修改一个元素的宽高时，页面布局就会发生变化，DOM 树结构也会发生变化，那么肯定要重新构建 DOM 树，而 DOM 树与渲染树是紧密相连的，DOM 树构建完，渲染树也会随之对页面进行再次渲染，**这种引起 DOM 树结构变化，页面布局变化的行为叫回流。**

当我们给一个元素更换颜色，这样的行为是不会影响页面布局的，DOM 树不会变化，但颜色变了，渲染树得重新渲染页面，**这种只是样式的变化，不会引起DOM树变化，页面布局变化的行为叫重绘。**

**回流的代价要远大于重绘，且回流必然会造成重绘，但重绘不一定会造成回流。**

大批量的操作 DOM 时，控制 **重绘和回流** 的频率非常重要，所以 Vue 或者 React 等框架都会**使用 Diff 算法来控制重新渲染的频率和范围**。
### Diff 算法
是对虚拟 DOM 和真实 DOM 进行比对，并计算出最小的变化，然后再去根据这个最小的变化去更新真实的 DOM。简单说就是三步：
1. 遍历老的虚拟 DOM；
2. 遍历新的虚拟 DOM；
3. 然后根据变化（改变或新增），再重新排序。

可是这样会有很大问题，假如有 1000 个节点，就需要计算 1000³ 次，也就是10亿次，这样性能消耗将非常巨大。所以 Vue 或者 React 里 Diff 算法都遵循深度优先，同层比较的策略来计算出最小变化。

**虚拟 DOM 通过 Diff 算法进行批量替换，可以保证 DOM 大量或大范围操作下的性能下限，对视图进行合理、高效的更新，而真实 DOM 操作每次都需要重绘或回流，造成不必要的性能浪费。**

### 跨平台
虚拟 DOM 提供了一个非常重要的特性：Parser 解析转化。这意味着其实相当多的东西我们都可以在编译阶段解决。比如考虑这样一个情况：我们是否可以编写一套转换器，用来把 python 代码转换为 js？这其中比较麻烦的就是 DOM，因为 DOM 是 js 中独有的东西，可是有了 **虚拟 DOM**，我们就可以在 python 中操作 **虚拟 DOM** 这样一个统一的抽象数据格式，这样不就实现了其他编程语言平台来编写前端代码？事实上 ssr（服务端渲染）就是这个原理：因为 node 是没有 DOM 的，通过虚拟 DOM 来抽象即可达到操作 DOM 的目的，还有我们在 jsx 里使用函数来声明式编写原本命令式的 DOM 操作也是这样。再比如我们可以把前端平台代码移植到其他平台，像 React Native、Flutter，很多小程序框架等。

另一种将大量 DOM 操作缓存到内存中的方法是 [DocumentFragment（点击链接查看如何使用）](https://juejin.cn/post/7133105073462181919)。
## DocumentFragment
DocumentFragment 是一个定义了最小文档对象而没有父对象的接口。它被当作轻量级的 Document ，用来存储 DOM 对象。文档片段对实际 DOM 没有影响，但其子节点可以按需插入到实际的 DOM 里。

因为文档片段存在于内存中，并不在 DOM 树中，所以将子元素插入到文档片段时不会引起页面回流（对元素位置和几何上的计算）。因此，使用文档片段通常会带来更好的性能。

### 虚拟 DOM 源自 DocumentFragment 吗？
虚拟 DOM 和文档片段采用相同的理念去提升 UI 的性能，但虚拟 DOM 不使用任何文档片段，通过查看 Vue 和 React 的源码也不会有 `DocumentFragment`，虚拟 DOM 具有一些独立的消除差异和渲染的阶段。

React 创建了 React.Fragment 语法，它可以包裹一组子元素而不额外引入新的 DOM 节点。但除了命名相似，React 片段和 DocumentFragment 没有任何关系。
```js
function Glossary(props) {
  return (
    <dl>
      {props.items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  );
}
```

## Shadow DOM
以前浏览器只提供了一种机制来将一段代码与另一段代码隔离开来： `<iframe>` 框架，但对于大多数封装需求，框架过于沉重，且有很多限制。

现在浏览器提供了一种编写真正封装的组件的方法： Shadow DOM，使得在没有工具或命名约定的情况下，将 CSS 与 HTML 标记捆绑在一起，封装成组件（[Web Components（点击链接查看如何使用）](https://juejin.cn/post/7134951647192547341)），简单说就是将隐藏的 DOM 树附加到常规的 DOM 树中。

通过使用 `Element.attachShadow()` 方法将一个 shadow DOM 附加到自定义元素上。你可以像普通 DOM 一样来操作 Shadow DOM，例如添加子节点、设置属性，以及为节点添加自己的样式（例如通过 `element.style` 属性），或者为整个 Shadow DOM 添加样式（例如在 `<style>` 元素内添加样式）。不同的是，Shadow DOM 内部的元素始终不会影响到它外部的元素（除了 `:focus-within`），这为封装提供了便利。

通过查看 `ShadowRoot.prototype`，可以发现其继承自 `DocumentFragment`，表明 Shadow DOM 是基于文档片段接口的。

### 组成
Shadow DOM 从一个 Shadow root 开始，包括以下几个部分：
- Shadow host：一个常规 DOM 节点，Shadow DOM 会被附加到这个节点上。
- Shadow tree：Shadow DOM 内部的 DOM 树。
- Shadow boundary：Shadow DOM 结束的地方，也是常规 DOM 开始的地方。
- Shadow root: Shadow tree 的根节点。

比如一个自定义的 button 组件：
```html
<better-button>
  <img src="gear.svg" slot="icon">
  <span>Settings</span>
</better-button>
```
我们可以在检查元素中看到它的 Shadow DOM 结构：
```html
<better-button>
  #shadow-root
  <style>
    ...
  </style>
  <slot name="icon">
    <img src="gear.svg" slot="icon">
  </slot>
  <span id="wrapper">
    <slot>
      <span>Settings</span>
    </slot>
  </span>
</better-button>
```

浏览器自带一些封装的原生组件件元素，比如 `<video>`、 `<input>`、 `<select>` 等，在 `<video>` 它的 Shadow DOM 中，实际上就包含了一系列的按钮和其他控制器。

### Shadow DOM 和 虚拟 DOM 是一回事吗？
不一样。Shadow DOM 是一种浏览器技术，主要用于在 web 组件中封装变量和 CSS。虚拟 DOM 则是一种由 Javascript 类库基于浏览器 API 实现的概念。

### 与 Web Components
创建 Web Components 不一定必须要使用 Shadow DOM，但使用 Shadow DOM 创建自定义元素，意味着可以利用 CSS 作用域、DOM 操作和事件监听等功能。
