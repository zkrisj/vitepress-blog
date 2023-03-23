---
date: 20:52 2023/3/23
title: Vue3 中使用 defineCustomElement 定义组件
tags:
- Vue
description: Vue 和 Web Components 是互补的技术，Vue 为使用和创建自定义元素提供了出色的支持。你可以将自定义元素集成到现有的 Vue 应用中，或使用 Vue 来构建和分发自定义元素。
---
## 使用 Vue 构建自定义元素
Web Components 是一组 web 原生 API 的统称，允许开发者创建可复用的自定义元素 (custom elements)。

自定义元素的主要好处是，它们可以在使用任何框架，甚至是在不使用框架的场景下使用。当你面向的最终用户可能使用了不同的前端技术栈，或是当你希望将最终的应用与它使用的组件实现细节解耦时，它们会是理想的选择。

Vue 和 Web Components 是互补的技术，Vue 为使用和创建自定义元素提供了出色的支持。你可以将自定义元素集成到现有的 Vue 应用中，或使用 Vue 来构建和分发自定义元素。

Vue [在 Custom Elements Everywhere 测试中取得了 100% 的分数](https://custom-elements-everywhere.com/libraries/vue/results/results.html)。在 Vue 应用中使用自定义元素基本上与使用原生 HTML 元素的效果相同，但需要进行一些额外的配置才能工作：

### 跳过组件解析
默认情况下，Vue 会将任何非原生的 HTML 标签优先当作 Vue 组件处理，而将“渲染一个自定义元素”作为后备选项。这会在开发时导致 Vue 抛出一个“解析组件失败”的警告。
- 要让 Vue 知晓特定元素应该被视为自定义元素并跳过组件解析，我们可以指定 compilerOptions.isCustomElement 这个选项，设置在此选项对象上的值将会在浏览器内进行模板编译时使用，并会影响到所配置应用的所有组件。
- 另外也可以通过 compilerOptions 选项在每个组件的基础上覆盖这些选项（针对当前组件有更高的优先级）。

因为它是一个编译时选项，构建工具需要将配置传递给 @vue/compiler-dom：
- vue-loader：通过 compilerOptions loader 的选项传递。
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
- vite：通过 @vitejs/plugin-vue 的选项传递。
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
- 浏览器内编译时的配置。
```js
// src/main.js
// 仅在浏览器内编译时才会工作
const app = createApp(App)
app.config.compilerOptions.isCustomElement = (tag) => tag.includes('-')
```

### 传递 DOM 属性
由于 DOM attribute 只能为字符串值，因此我们只能使用 DOM 对象的属性来传递复杂数据。当为自定义元素设置 props 时，Vue 3 将通过 `in` 操作符自动检查该属性是否已经存在于 DOM 对象上，并且在这个 key 存在时，更倾向于将值设置为一个 DOM 对象的属性。这意味着，在大多数情况下，如果自定义元素遵循[推荐的最佳实践](https://web.dev/custom-elements-best-practices/)，你就不需要考虑这个问题。

然而，也会有一些特别的情况：必须将数据以一个 DOM 对象属性的方式传递，但该自定义元素无法正确地定义/反射这个属性 (因为 `in` 检查失败)。在这种情况下，你可以强制使用一个 `v-bind` 绑定、通过 `.prop` 修饰符来设置该 DOM 对象的属性：
```js
<my-element :user.prop="{ name: 'jack' }"></my-element>
<!-- 等价简写 -->
<my-element .user="{ name: 'jack' }"></my-element>
```

## defineCustomElement()
Vue 提供了一个和定义一般 Vue 组件几乎完全一致的 defineCustomElement 方法来支持创建自定义元素。这个方法接收的参数和 defineComponent 完全相同。但它会返回一个继承自 HTMLElement 的原生自定义元素类的构造器（可以通过 customElements.define() 注册）。
```ts
function defineCustomElement(
  component:
    | (ComponentOptions & { styles?: string[] })
    | ComponentOptions['setup']
): {
  new (props?: object): HTMLElement
}
```
除了常规的组件选项，defineCustomElement() 还支持一个特别的选项 styles，它是一个内联 CSS 字符串的数组，所提供的 CSS 会被注入到该元素的 ShadowRoot 上。
```html
<my-vue-element></my-vue-element>
```
```js
import { defineCustomElement } from 'vue'

const MyVueElement = defineCustomElement({
  // 这里是同平常一样的 Vue 组件选项
  props: {},
  emits: {},
  template: `...`,

  // defineCustomElement 特有的：注入进 ShadowRoot 的 CSS
  styles: [`/* css */`]
})

// 注册自定义元素之后，所有此页面中的 `<my-vue-element>` 标签都会被升级
customElements.define('my-vue-element', MyVueElement)

// 也可以在注册之后实例化元素：
document.body.appendChild(
  new MyVueElement({
    // 初始化 props（可选）
  })
)
```
$\color{red}{如果这时控制台报错：}$Component provided template option but runtime compilation is not supported，在 vite.config.js 或 vue.config.js 中添加以下配置：
```js
resolve: { alias: { 'vue': 'vue/dist/vue.esm-bundler.js' } },
```

### 生命周期
1. 当该元素的 connectedCallback 初次调用时，一个 Vue 自定义元素会在内部挂载一个 Vue 组件实例到它的 ShadowRoot 上。
2. 当此元素的 disconnectedCallback 被调用时，Vue 会在一个微任务后检查元素是否还留在文档中。
    - 如果元素仍然在文档中，那么说明它是一次移动操作，组件实例将被保留；
    - 如果该元素不再存在于文档中，那么说明这是一次移除操作，组件实例将被销毁。

### Props
1. 所有使用 props 选项声明了的 props 都会作为属性定义在该自定义元素上。Vue 会自动地、恰当地处理其作为 attribute 还是属性的反射。
2. attribute 总是根据需要反射为相应的属性类型。基础类型的属性值 (string，boolean 或 number) 会被反射为 attribute。
3. 当它们被设为 attribute 时 (永远是字符串)，Vue 也会自动将以 Boolean 或 Number 类型声明的 prop 转换为所期望的类型。比如下面这样的 props 声明：
```js
props: {
  selected: Boolean,
  index: Number
}
```
并以下面这样的方式使用自定义元素：
```html
<my-element selected index="1"></my-element>
```
在组件中，selected 会被转换为 true (boolean 类型值) 而 index 会被转换为 1 (number 类型值)。

### 事件
1. emit 触发的事件都会通过以 CustomEvents 的形式从自定义元素上派发。
2. 额外的事件参数 (payload) 将会被暴露为 CustomEvent 对象上的一个 detail 数组。

### 插槽
1. 在一个组件中，插槽将会照常使用 `<slot>` 渲染。然而，当使用最终的元素时，它只接受原生插槽的语法，而不支持作用域插槽。
2. 当传递具名插槽时，应使用 slot attribute 而不是 v-slot 指令：
```html
<my-element>
  <div slot="named">hello</div>
</my-element>
```

### 依赖注入
1. Provide / Inject API 和相应的组合式 API 在 Vue 定义的自定义元素中都可以正常工作。
2. 但是，依赖关系只在自定义元素之间起作用。例如一个 Vue 定义的自定义元素就无法注入一个由常规 Vue 组件所提供的属性。

### 将 SFC 编译为自定义元素
defineCustomElement 也可以搭配 Vue 单文件组件 (SFC) 使用。但是，根据默认的工具链配置，SFC 中的 `<style>` 在生产环境构建时仍然会被抽取和合并到一个单独的 CSS 文件中。当正在使用 SFC 编写自定义元素时，通常需要改为注入 `<style>` 标签到自定义元素的 ShadowRoot 上。

官方的 SFC 工具链支持以“自定义元素模式”导入 SFC (需要 @vitejs/plugin-vue@^1.4.0 或 vue-loader@^16.5.0)。一个以自定义元素模式加载的 SFC 将会内联其 `<style>` 标签为 CSS 字符串，并将其暴露为组件的 styles 选项。这会被 defineCustomElement 提取使用，并在初始化时注入到元素的 ShadowRoot 上。

要开启这个模式，将组件文件以 .ce.vue 结尾即可：
```html
// Example.ce.vue
<template>
  <h1>Example.ce</h1>
</template>
<script>
</script>
<style>
  h1 {
    color: red;
  }
</style>
```
```js
import { defineCustomElement } from 'vue'
import Example from './Example.ce.vue'

console.log(Example.styles)

// 转换为自定义元素构造器
const ExampleElement = defineCustomElement(Example)

// 注册
customElements.define('my-example', ExampleElement)
```

### 基于 Vue 构建自定义元素库
按元素分别导出构造函数，以便用户可以灵活地按需导入它们，还可以通过导出一个函数来方便用户自动注册所有元素。
```js
// Vue 自定义元素库的入口文件
import { defineCustomElement } from 'vue'
import Foo from './MyFoo.ce.vue'
import Bar from './MyBar.ce.vue'

const MyFoo = defineCustomElement(Foo)
const MyBar = defineCustomElement(Bar)

// 分别导出元素
export { MyFoo, MyBar }

export function register() {
  customElements.define('my-foo', MyFoo)
  customElements.define('my-bar', MyBar)
}
```

## defineComponent()
用来在定义 Vue 组件时为 TypeScript 提供类型推导的辅助函数。
- 对于一个 ts 文件，如果我们直接写 export default {}，无法有针对性的提示 vue 组件里应该有哪些属性。
- 但是，增加一层 defineComponet 的话，export default defineComponent({})，就可以对参数进行一些类型推导和属性的提示等操作。
```ts
function defineComponent(
  component: ComponentOptions | ComponentOptions['setup']
): ComponentConstructor
```
参数是一个组件选项对象。返回值将是该选项对象本身，因为该函数实际上在运行时没有任何操作，仅用于提供类型推导，注意返回值的类型有一点特别：它是一个构造函数类型，它是根据选项推断出的组件实例类型。这是为了能让该返回值在 TSX 中用作标签时提供类型推导支持。

你可以像这样从 `defineComponent()` 的返回类型中提取出一个组件的实例类型 (与其选项中的 `this` 的类型等价)：
```ts
const Foo = defineComponent(/* ... */)
type FooInstance = InstanceType<typeof Foo>
```

## defineAsyncComponent()
用来定义一个异步组件。在大型项目中，我们可能需要拆分应用为更小的块，并仅在需要时再从服务器加载相关组件。defineAsyncComponent 在运行时是懒加载的，参数可以是一个返回 Promise 的异步加载函数（resolve 回调方法应该在从服务器获得组件定义时调用），或是对加载行为进行更具体定制的一个选项对象。
```ts
import { defineAsyncComponent } from 'vue'

const AsyncComp = defineAsyncComponent(() => {
  return new Promise((resolve, reject) => {
    // ...从服务器获取组件
    resolve(/* 获取到的组件 */)
  })
})
// ... 像使用其他一般组件一样使用 `AsyncComp`

// 也可以使用 ES 模块动态导入
const AsyncComp = defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
)
```
得到的 AsyncComp 是一个外层包装过的组件，仅在页面需要它渲染时才会调用加载内部实际组件的函数。它会将接收到的 props 和插槽传给内部组件，所以你可以使用这个异步的包装组件无缝地替换原始组件，同时实现延迟加载。

与普通组件一样，异步组件可以使用 app.component() 全局注册：
```js
app.component('MyComponent', defineAsyncComponent(() =>
  import('./components/MyComponent.vue')
))
```
也可以直接在父组件中直接定义它们：
```js
<script setup>
import { defineAsyncComponent } from 'vue'

const AdminPage = defineAsyncComponent(() =>
  import('./components/AdminPageComponent.vue')
)
</script>

<template>
  <AdminPage />
</template>
```
异步操作不可避免地会涉及到加载和错误状态，因此 defineAsyncComponent() 也支持在高级选项中处理这些状态：
```js
const AsyncComp = defineAsyncComponent({
  // 加载函数
  loader: () => import('./Foo.vue'),
  // 加载异步组件时使用的组件
  loadingComponent: LoadingComponent,
  // 展示加载组件前的延迟时间，默认为 200ms
  delay: 200,
  // 加载失败后展示的组件
  errorComponent: ErrorComponent,
  // 如果提供了一个时间限制，并超时了，也会显示这里配置的报错组件，默认值是：Infinity
  timeout: 3000
})
```

## GitHub 源码
[Vue3 中使用 defineCustomElement 自定义组件](https://github.com/zkrisj/vue-defineCustomElement)