---
date: 22:57 2023/3/22
title: Web Components 和 Vue 组件、React 组件
tags:
- JS
- Vue
description: Web Components 的主要好处是原生支持，Vue 组件的插槽机制是受原生 Web Component slot 元素的启发而诞生，同时还做了一些功能拓展。
---
## Web Components
我们以前一直在使用 `<input>`，`<video>`，`<select>` 这样的原生组件元素，而现在我们可以自己去定义这些组件。

[使用 Web Components](https://juejin.cn/post/7134951647192547341) 的主要好处是原生支持，这意味着可以不需要任何框架即可完成开发，也意味着这将有更低的网络请求，以及更稳定的迭代前景。当你面向的最终用户可能使用了不同的前端技术栈，或是当你希望将最终的应用与它使用的组件实现细节解耦时，它们会是理想的选择。有不少大公司充分利用了这项技术：
- Twitter：嵌入式推文使用 Web Components 构建
- YouTube：该站点是使用 Web Components 构建的
- Electronic Arts：该站点也是使用 Web Components 构建的
- Adobe Spectrum：该站点是一个基于 Web Components 的 UI 框架产品
- 维基百科

根据 w3techs.com 的数据，在 Chrome 浏览器中查看的所有网站中，有超过 15% 的网站至少注册了一个自定义元素。相比之下，只有 2.3% 的网站使用 React。

### 安全
对安全级别要求较高的情况（比如金融行业产品），不应使用第三方库，必须使用原生技术，并且必须控制导入库的全部内容。因为对于像 React 这样的大型库，从一个版本迁移到另一个版本很难审核所有依赖库的错误和漏洞。

### 组件生命周期
Web Components 具有原生的组件生命周期回调支持，当其与文档的连接与断开时无需额外的外部状态标记，这使得当组件被移动或被移除等场景无需通过钩子函数即可获取，同时也无需 VDOM 去应对 Diff 元素变化。即回归纯粹，又更优于性能。

### 组织和调试
例如，当你尝试在 DOM 中查找 React 制作的组件时，您在 DOM 中看到了什么？Div, div, div... Header 在哪里？在 DOM 中查找 JSX 代码的反射可能会很头疼，当然 Vue 和 React 的 Chrome 插件也可以解决一些问题。对于 Web 组件，如果您定义了 my-super-header，而你将直接在 DOM 中看到你的组件。

### Shadow DOM
Web Components 的另一个优势是使用了 Shadow DOM，它可以做到对主 DOM 没有侵害性（CSS、事件的有效隔离），对混合 React 而言同时还能降低 Diff 成本。也可以结合 ES6 Module 来轻松的完成组件的按需加载。

### 对比 JSX
作为浏览器的原生支持，相比于 JSX 无需预编译预处理，而 JSX 在每次 render 时，都需要完整的构造一个虚拟DOM，并且它还需要 JSS 将 CSS-in-JS 转换为样式表。因此同样功能的 JSX 将占用更多的 CPU 运算。

由于使用了 `Template`，模版节点操作的对象是一个 `DocumentFragement`，而并非是真实 DOM 的一部分，相比 JSX 产生的 JS 堆栈其内存占用更小。

## Vue 组件
Vue 组件的插槽机制是受原生 Web Component `<slot>` 元素的启发而诞生，同时还做了一些功能拓展。

一些开发者认为应该避免使用框架专有的组件模型，而改为全部使用自定义元素来构建应用，因为这样可以使应用“永不过时”。Vue 官方对此的解释是：
1. 自定义元素和 Vue 组件之间确实存在一定程度的功能重叠：它们都允许我们定义具有数据传递、事件发射和生命周期管理的可重用组件。
2. Web Components 的 API 相对来说更底层和更基础（即功能太简单）。要构建一个实际的应用，我们需要相当多平台没有涵盖的附加功能：
    - 一个声明式的、高效的模板系统；即数据绑定，这是 Web Components 缺少的。
    - 一个响应式的，利于跨组件逻辑提取和重用的状态管理系统；即 Web Components 没有状态管理机制。
    - 一种在服务器上呈现组件并在客户端“激活”(hydrate) 组件的高性能方法 (SSR)，这对 SEO 和 LCP 这样的 Web 关键指标非常重要。原生自定义元素 SSR 通常需要在 Node.js 中模拟 DOM，然后序列化更改后的 DOM，而 Vue SSR 则尽可能地将其编译为拼接起来的字符串，这会高效得多。即 Web Components 没有提供服务端渲染 (SSR) 方案。
3. Vue 的组件模型在设计时同时兼顾了这些需求，因此是一个更内聚的系统。
4. 我们认为 Vue 和 Web Components 是互补的技术。Vue 为使用和创建自定义元素提供了出色的支持。无论你是将自定义元素集成到现有的 Vue 应用中，还是使用 Vue 来构建和分发自定义元素都很方便。

### 在 Vue 中使用 Web Components
1. 浏览器内编译时的示例配置：
```js
// 仅在浏览器内编译时才会工作
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```
2. 使用了 Vite 构建工具示例配置：
```js
// vite.config.js
import vue from '@vitejs/plugin-vue'
export default {
  plugins: [
    vue({
      template: {
        compilerOptions: {
          // 将所有带短横线的标签名都视为自定义元素
          isCustomElement: (tag) => tag.includes('-')
        }
      }
    })
  ]
}
```
3. Vue CLI 示例配置：
```js
// vue.config.js
module.exports = {
  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => ({
        ...options,
        compilerOptions: {
          // 将所有带 ion- 的标签名都视为自定义元素
          isCustomElement: tag => tag.startsWith('ion-')
        }
      }))
  }
}
```
Vue 提供了一个和定义一般 Vue 组件几乎完全一致的 defineCustomElement 方法来支持创建自定义元素。这个方法接收的参数和 defineComponent 完全相同。但它会返回一个继承自 HTMLElement 的自定义元素构造器：
```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 这里是同平常一样的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 特有的：注入进 shadow root 的 CSS
  styles: [`/* inlined css */`]
})

// 注册自定义元素之后，所有此页面中的 `<my-vue-element>` 标签都会被升级
customElements.define('my-vue-element', MyVueElement)
```
注意问题：
1. 通过 this.$emit 或者 setup 中的 emit 触发的事件都会通过以 CustomEvents 的形式从自定义元素上派发。额外的事件参数 (payload) 将会被暴露为 CustomEvent 对象上的一个 detail 数组。
2. 不支持作用域插槽。当传递具名插槽时，应使用 slot attribute 而不是 v-slot 指令：
```
<my-element>
  <div slot="named">hello</div>
</my-element>
```
3. Provide / Inject API 和相应的组合式 API 在 Vue 定义的自定义元素中都可以正常工作。但是请注意，依赖关系只在自定义元素之间起作用。例如一个 Vue 定义的自定义元素就无法注入一个由常规 Vue 组件所提供的属性。
4. SFC 中的 `<style>` 在生产环境构建时仍然会被抽取和合并到一个单独的 CSS 文件中。当正在使用 SFC 编写自定义元素时，通常需要改为注入 `<style>` 标签到自定义元素的 shadow root 上，以“自定义元素模式”导入 SFC (需要 @vitejs/plugin-vue@^1.4.0 或 vue-loader@^16.5.0)。要开启这个模式，只需要将你的组件文件以 .ce.vue 结尾即可：
```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles) // ["/* 内联 css */"]

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)
customElements.define('my-example', ExampleElement)
```

## React 组件
React 官方对 React 组件和 Web Components 的关系给出的解释：
1. React 和 Web Components 为了解决不同的问题而生。
2. Web Components 为可复用组件提供了强大的封装，而 React 则提供了声明式的解决方案，使 DOM 与数据保持同步。
3. 两者旨在互补。作为开发人员，可以自由选择在 Web Components 中使用 React，或者在 React 中使用 Web Components，或者两者共存。

### 在 React 中使用 Web Components
Web Components 通常暴露的是命令式 API。例如，Web Components 的组件 video 可能会公开 play() 和 pause() 方法。要访问 Web Components 的命令式 API，你需要使用 ref 直接与 DOM 节点进行交互。如果你使用的是第三方 Web Components，那么最好的解决方案是编写 React 组件包装该 Web Components。
```js
class XSearch extends HTMLElement {
  connectedCallback() {
    const mountPoint = document.createElement('span');
    this.attachShadow({ mode: 'open' }).appendChild(mountPoint);

    const name = this.getAttribute('name');
    const url = 'https://www.google.com/search?q=' + encodeURIComponent(name);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<a href={url}>{name}</a>);
  }
}
customElements.define('x-search', XSearch);

class HelloMessage extends React.Component {
  render() {
    // Web Components 中使用 class 属性代替 className
    return <div>Hello <x-search class="demo">{this.props.name}</x-search>!</div>;
  }
}
```
注意问题：
1. Web Components 触发的事件可能无法通过 React 渲染树正确的传递。你需要在 React 组件中手动添加事件处理器来处理这些事件。
2. 如果使用 Babel 来转换 class，此代码将不会起作用。可以在加载 Web Components 前请引入 custom-elements-es5-adapter 来解决。