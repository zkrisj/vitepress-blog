---
date: 15:32 2023/4/14
title: Vue 组合式函数
tags:
- Vue
description: Composition API 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。
---
## 组合式 API
Composition API 是一系列 API 的集合，使我们可以使用函数而不是声明选项的方式书写 Vue 组件。包括：
- 响应式 API：例如 `ref()` 和 `reactive()`，使我们可以直接创建响应式状态、计算属性和侦听器。
- 生命周期钩子：例如 `onMounted()` 和 `onUnmounted()`，使我们可以在组件各个生命周期阶段添加逻辑。
- 依赖注入：例如 `provide()` 和 `inject()`，使我们可以在使用响应式 API 时，利用 Vue 的依赖注入系统。
- 其他选项：`props`，`emits`，`name` 和 `inheritAttrs`。如果使用 `<script setup>`，那么 `inheritAttrs` 应该是唯一一个需要用额外的 `<script>` 块书写的选项了。

### 对比选项式 API
1. 更好的逻辑复用：组合式 API 最基本的优势是它使我们能够通过组合函数来实现更加简洁高效的逻辑复用。在选项式 API 中我们主要的逻辑复用机制是 mixins，而组合式 API 解决了 mixins 的所有缺陷：
- 不清晰的数据来源：当使用了多个 mixin 时，实例上的数据属性来自哪个 mixin 变得不清晰，这使追溯实现和理解组件行为变得困难。而在组合式函数中使用 `ref` + 解构模式：让属性的来源在消费组件时一目了然。
- 命名空间冲突：多个来自不同作者的 mixin 可能会注册相同的属性名，造成命名冲突。若使用组合式函数，你可以通过在解构变量时对变量进行重命名来避免相同的键名。
- 隐式的跨 mixin 交流：多个 mixin 需要依赖共享的属性名来进行相互作用，这使得它们隐性地耦合在一起。而一个组合式函数的返回值可以作为另一个组合式函数的参数被传入，像普通函数那样。
- 基于上述理由，我们不再推荐在 Vue 3 中继续使用 mixin。保留该功能只是为了项目迁移的需求和照顾熟悉它的用户。

2. 更灵活的代码组织：许多用户喜欢选项式 API 的原因是它在默认情况下就能够让人写出有组织的代码：大部分代码都自然地被放进了对应的选项里。然而，选项式 API 在单个组件的逻辑复杂到一定程度时，会面临一些无法忽视的限制。
- 这些限制主要体现在需要处理多个逻辑关注点的组件中，处理相同逻辑关注点的代码被强制拆分在了不同的选项中，位于文件的不同部分。在一个几百行的大组件中，要读懂代码中的一个逻辑关注点，需要在文件中反复上下滚动。另外，如果我们想要将一个逻辑关注点抽取重构到一个可复用的工具函数中，需要从文件的多个不同部分找到所需的正确片段。
- 而使用组合式 API，与同一个逻辑关注点相关的代码被归为了一组：我们无需再为了一个逻辑关注点在不同的选项块间来回滚动切换。此外，我们现在可以很轻松地将这一组代码移动到一个外部文件中，不再需要为了抽象而重新组织代码，大大降低了重构成本，这在长期维护的大型项目中非常关键。

3. 更好的类型推导：选项式 API 的类型推导在处理 mixins 和依赖注入类型时依然不甚理想。因此，很多想要搭配 TS 使用 Vue 的开发者采用了由 `vue-class-component` 提供的 `Class` API。
- 基于 `Class` 的 API 非常依赖 `ES 装饰器`，但 Vue3 没有向 `Class` API 的方向发展。另外，基于 `Class` 的 API 和选项式 API 在逻辑复用和代码组织方面存在相同的限制。
- 相比之下，组合式 API 主要利用基本的变量和函数，它们本身就是类型友好的。用组合式 API 重写的代码可以享受到完整的类型推导，不需要书写太多类型标注。**大多数时候，用 TypeScript 书写的组合式 API 代码和用 JavaScript 写都差不太多**！这也让许多纯 JavaScript 用户也能从 IDE 中享受到部分类型推导功能。

> 不再推荐在 Vue3 中使用 `Class` API，因为组合式 API 提供了很好的 TypeScript 集成，并具有额外的逻辑重用和代码组织优势。

4. 更小的生产包体积：
- 选项式 API 需要从实例中代理，依赖 `this` 上下文对象访问属性。对象的属性名不能被压缩。
- 由于 `<script setup>` 形式书写的组件模板被编译为了一个内联函数，和 `<script setup>` 中的代码位于同一作用域，所以被编译的模板可以直接访问 `<script setup>` 中定义的变量。本地变量的名字可以被压缩。

5. 可以在一个钩子选项式 API 的组件中通过 `setup()` 选项来使用组合式 API。通常只在以下情况下使用：
- 需要在非单文件组件中使用组合式 API 时。
- 需要在基于选项式 API 的组件中集成基于组合式 API 的代码时。

> - 当通过 `this` 访问从 `setup` 返回的 `ref` 时会自动浅层解包。
> - `setup()` 自身并不含对组件实例的访问权，即在 `setup()` 中访问 `this` 会是 `undefined`。
> - 可以在选项式 API 中访问组合式 API 暴露的值，但反过来则不行。
> - 唯一可以使用 `async setup()` 的情况是，该组件是 `Suspense` 组件的后代。

6. 组合式 API 更适用于大型的项目，而对于中小型项目来说选项式 API 仍然是一个不错的选择。

### 对比 React Hooks
组合式 API 提供了和 React Hooks 相同级别的逻辑组织能力。
#### React Hooks
- React Hooks 在组件每次更新时都会重新调用。
- Hooks 有严格的调用顺序，并不可以写在条件分支中。
- React 组件中定义的变量会被一个钩子函数闭包捕获，若开发者传递了错误的依赖数组，它会变得“过期”。
- 昂贵的计算需要使用 `useMemo`，这也需要传入正确的依赖数组。
- 在默认情况下，传递给子组件的事件处理函数会导致子组件进行不必要的更新，需要显式的调用 `useCallback` 做优化。这个优化同样需要正确的依赖数组，并且几乎在任何时候都需要。
- 不好处理需要在多次渲染间保持引用 (通过 `useRef`) 的可变状态。

#### 组合式 API
- 组合式 API 仅调用 `setup()` 或 `<script setup>` 的代码一次。这使得代码更符合日常 JavaScript 的直觉，不需要担心闭包变量的问题。
- 组合式 API 也并不限制调用顺序，还可以有条件地进行调用。
- Vue 的响应性系统运行时会自动收集计算属性和侦听器的依赖，因此无需手动声明依赖。
- 无需手动缓存回调函数来避免不必要的组件更新。Vue 细粒度的响应性系统能够确保在绝大部分情况下组件仅执行必要的更新。

## 组合式函数
组合式函数(Composables) 是一个利用 Vue 的组合式 API 来封装和复用**有状态逻辑**的函数。
- **无状态的逻辑**指在接收一些输入后立刻返回所期望的输出。复用无状态逻辑的库有很多，比如 [lodash](https://lodash.com/) 或 [date-fns](https://date-fns.org/)。
- 相比之下，有状态逻辑负责管理会随时间而变化的状态。一个简单的例子是跟踪当前鼠标在页面中的位置。在实际应用中，也可能是像触摸手势或与数据库的连接状态这样的更复杂的逻辑。
- 可以嵌套多个组合式函数：一个组合式函数可以调用一个或多个其他的组合式函数。这使得我们可以像使用多个组件组合成整个应用一样，用多个较小且逻辑独立的单元来组合形成复杂的逻辑，这正是为什么将实现了这一设计模式的 API 集合命名为组合式 API。

### 使用
1. 组合式函数约定用驼峰命名法命名，并以 `use` 作为开头。
2. 如果编写的组合式函数会被其他开发者使用，最好在处理输入参数时兼容 `ref` 而不只是原始的值。
```js
import { unref } from 'vue'

function useFeature(maybeRef) {
  // 若 maybeRef 确实是一个 ref，它的 .value 会被返回
  // 否则，maybeRef 会被原样返回
  const value = unref(maybeRef)
}
```
3. 推荐的约定是组合式函数始终返回一个包含多个 `ref` 的普通的非 `reactive` 对象，这样该对象在组件中被解构为 `ref` 之后仍可以保持响应性，而从组合式函数返回一个响应式对象会导致在对象解构过程中丢失与组合式函数内状态的响应性连接。
```js
// x 和 y 是两个 ref
const { x, y } = useMouse()
```
4. 如果你更希望以对象属性的形式来使用组合式函数中返回的状态，可以将返回的对象用 `reactive()` 包装一次，这样其中的 `ref` 会被自动解包
```js
const mouse = reactive(useMouse())
// mouse.x 链接到了原来的 x ref
console.log(mouse.x)
```
```html
Mouse position is at: {{ mouse.x }}, {{ mouse.y }}
```
5. 如果你的应用用到了服务端渲染 (SSR)，请确保在组件挂载后才调用的生命周期钩子中执行 DOM 相关的副作用，例如：`onMounted()`。这些钩子仅会在浏览器中被调用，因此可以确保能访问到 DOM。
6. 确保在 `onUnmounted()` 时清理副作用。举例来说，如果一个组合式函数设置了一个事件监听器，它就应该在 `onUnmounted()` 中被移除 (就像我们在 `useMouse()` 示例中看到的一样)。
7. 组合式函数在 `<script setup>` 或 `setup()` 钩子中，应始终被**同步地**调用。在某些场景下，你也可以在像 `onMounted()` 这样的生命周期钩子中使用他们。
8. 抽取组合式函数不仅是为了复用，也是为了代码组织。随着组件复杂度的增高，你可以基于逻辑问题将组件代码拆分成更小的函数：
```html
<script setup>
import { useFeatureA } from './featureA.js'
import { useFeatureB } from './featureB.js'
import { useFeatureC } from './featureC.js'

const { foo, bar } = useFeatureA()
const { baz } = useFeatureB(foo)
const { qux } = useFeatureC(baz)
</script>
```
在某种程度上，你可以将这些提取出的组合式函数看作是可以相互通信的组件范围内的服务。

9. 如果你正在使用选项式 API，组合式函数必须在 `setup()` 中调用。且其返回的绑定必须在 `setup()` 中返回，以便暴露给 `this` 及其模板：
```js
import { useMouse } from './mouse.js'
import { useFetch } from './fetch.js'

export default {
  setup() {
    const { x, y } = useMouse()
    const { data, error } = useFetch('...')
    return { x, y, data, error }
  },
  mounted() {
    // setup() 暴露的属性可以在通过 `this` 访问到
    console.log(this.x)
  }
  // ...其他选项
}
```

### 示例
如果我们要直接在组件中使用组合式 API 实现鼠标跟踪功能，它会是这样的：
```html
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const x = ref(0)
const y = ref(0)

function update(event) {
  x.value = event.pageX
  y.value = event.pageY
}

onMounted(() => window.addEventListener('mousemove', update))
onUnmounted(() => window.removeEventListener('mousemove', update))
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```
如果我们想在多个组件中复用这个相同的逻辑，可以把这个逻辑以一个组合式函数的形式提取到外部文件中，并返回需要暴露的状态。
```html
<script setup>
import { useMouse } from './mouse.js'

const { x, y } = useMouse()
</script>

<template>Mouse position is at: {{ x }}, {{ y }}</template>
```
```js
// mouse.js
import { ref } from 'vue'
import { useEventListener } from './event'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  useEventListener(window, 'mousemove', (event) => {
    x.value = event.pageX
    y.value = event.pageY
  })

  return { x, y }
}
```
可以将添加和清除 DOM 事件监听器的逻辑也封装进一个组合式函数中：
```js
// event.js
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target, event, callback) {
  // 也可以用字符串形式的 CSS 选择器来寻找目标 DOM 元素
  onMounted(() => target.addEventListener(event, callback))
  onUnmounted(() => target.removeEventListener(event, callback))
}
```
每一个调用 `useMouse()` 的组件实例会创建其独有的 `x`、`y` 状态拷贝，因此他们不会互相影响。如果有一部分状态需要在多个组件实例间共享，可以使用 `reactive()` 创建一个响应式对象，或使用其他响应式 API 例如 `ref()` 或是 `computed()`，甚至通过一个组合式函数来返回一个全局状态，并将它导入到多个组件中：
```js
// store.js
import { ref, reactive } from 'vue'

export const store = reactive({
  count: 0,
  increment() {
    this.count++
  }
})
// 全局状态，创建在模块作用域下
const globalCount = ref(1)
export function useCount() {
  // 局部状态，每个组件都会创建
  const localCount = ref(1)
  return {
    globalCount,
    localCount
  }
}
```
```html
<!-- ComponentA.vue -->
<template>
  <button @click="store.increment">
    store.count 来自 A：{{ store.count }}
  </button>
  <button @click="globalCount++">
    globalCount 来自 A：{{ globalCount }}
  </button>
  <button @click="localCount++">
    localCount 来自 A：{{ localCount }}
  </button>
</template>
<script setup>
import { store, useCount } from './store.js'
const { globalCount, localCount } = useCount()
</script>
```
```html
<!-- ComponentB.vue -->
<template>
  <button @click="store.increment()">
    store.count 来自 B：{{ store.count }}
  </button>
  <button @click="globalCount++">
    globalCount 来自 B：{{ globalCount }}
  </button>
  <button @click="localCount++">
    localCount 来自 B：{{ localCount }}
  </button>
</template>
<script setup>
import { store, useCount } from './store.js'
const { globalCount, localCount } = useCount()
</script>
```

### 对比无渲染组件
一些组件可能只包括了逻辑而不需要自己渲染内容，视图输出通过作用域插槽全权交给了消费者组件。我们将这种类型的组件称为**无渲染组件**。
1. 组合式函数相对于无渲染组件的主要优势是：组合式函数不会产生额外的组件实例开销。
2. 当在整个应用中使用时，由无渲染组件产生的额外组件实例会带来无法忽视的性能开销。
3. 推荐在纯逻辑复用时使用组合式函数，在需要同时复用逻辑和视图布局时使用无渲染组件。

例如一个封装了追踪当前鼠标位置逻辑的组件：
```html
<!-- MouseTracker -->
<template>
  <slot :x="x" :y="y"/>
</template>
<script>
export default {
  data() {
    return {
      x: 0,
      y: 0
    }
  },
  methods: {
    update(e) {
      this.x = e.pageX
      this.y = e.pageY
    }
  },
  mounted() {
    window.addEventListener('mousemove', this.update)
  },
  unmounted() {
    window.removeEventListener('mousemove', this.update)
  }
}
</script>
```
父组件中引用：
```html
<MouseTracker v-slot="{ x, y }">
  Mouse is at: {{ x }}, {{ y }}
</MouseTracker>
```
虽然这个模式很有趣，但大部分能用无渲染组件实现的功能都可以通过组合式 API 以另一种更高效的方式实现，并且还不会带来额外组件嵌套的开销。就像上面我们在 `useMouse()` 示例中一样更高效地实现追踪鼠标位置的功能。