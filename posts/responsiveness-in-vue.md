---
date: 15:13 2023/4/14
title: Vue 中的响应性
tags:
- Vue
description: Vue 组件状态都是由响应式的 JavaScript 对象组成的，当更改它们时，视图会随即自动更新。本质上，响应性是一种可以使我们声明式地处理变化的编程范式。
---
## 响应性本质
Vue 组件状态都是由响应式的 JavaScript 对象组成的，当更改它们时，视图会随即自动更新。本质上，响应性是一种可以使我们声明式地处理变化的编程范式。一个典型例子是 Excel 表格：

|   | A | B | C |
| - | - | - | - |
| 0 | 1 |   |   |
| 1 | 2 |   |   |
| 2 | 3 |   |   |

这里单元格 `A2` 中的值是通过公式 `= A0 + A1` 来定义的 (可以在 `A2` 上点击来查看或编辑该公式)，因此最终得到的值为 `3`。当更改 `A0` 或 `A1` 时，`A2` 也会随即自动更新。

JavaScript 代码：
```js
let A0 = 1
let A1 = 2
let A2

function update() {
  A2 = A0 + A1
}
```
- `A0` 和 `A1` 被视为这个作用的**依赖**（`dependency`），因为它们的值被用来执行这个作用。
- `update()` 函数会产生一个**副作用**，或者就简称为**作用**（`effect`），因为它会更改程序里的状态。

## Vue 中的响应性是如何工作的
我们无法直接追踪对上述示例中局部变量的读写，原生 JavaScript 没有提供任何机制能做到这一点。但是我们是可以追踪**对象属性**的读写的，在 JavaScript 中有两种劫持 `property` 访问的方式：`getter / setters` 和 `Proxies`。Vue2 使用 `getter / setters` 完全是出于支持旧版本浏览器的限制。而在 Vue3 中则使用了 `Proxy` 来创建响应式对象，仅将 `getter / setter` 用于 `ref`。下面的伪代码说明了它们是如何工作的：
```js
function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, value) {
      target[key] = value
      trigger(target, key)
    }
  })
}

function ref(value) {
  const refObject = {
    get value() {
      track(refObject, 'value')
      return value
    },
    set value(newValue) {
      value = newValue
      trigger(refObject, 'value')
    }
  }
  return refObject
}
```
- `track()` 方法会检查当前是否有正在运行的副作用（`update`）。如果有，会将当前这个副作用作为新订阅者添加到存储了所有该属性的订阅者的 `Set` 中。
```js
// 运行的副作用
let activeEffect

function track(target, key) {
  if (activeEffect) {
    const effects = getSubscribersForProperty(target, key)
    effects.add(activeEffect)
  }
}
```
- `trigger()` 方法会查找该属性的所有订阅副作用，并执行它们。
```js
function trigger(target, key) {
  const effects = getSubscribersForProperty(target, key)
  effects.forEach((effect) => effect())
}
```
- 接下来，我们需要一个函数 `whenDepsChange()`，能够在**依赖**变化时调用 `update()`，产生一个**副作用**。
```js
function whenDepsChange(update) {
  const effect = () => {
    activeEffect = effect
    update()
    activeEffect = null
  }
  effect()
}
```
- 它将原本的 `update` 函数包装在了一个副作用函数中。在运行实际的更新之前，这个外部函数会将自己设为当前运行的副作用。这使得在更新期间的 `track()` 调用都能定位到这个当前运行的副作用。现在，我们就创建了一个能自动跟踪其依赖的副作用，它会在任意依赖被改动（`update`）时重新运行。我们称其为**响应式副作用**。

`whenDepsChange()` 函数将完成以下任务：
1. 当一个变量被读取时进行追踪，例如我们执行了表达式 `A0 + A1` 的计算，则 `A0` 和 `A1` 都被读取到了。
2. 如果一个变量在当前运行的副作用中被读取了，就将该副作用设为此变量的一个订阅者。例如由于 `A0` 和 `A1` 在 `update()` 执行时被访问到了，则 `update()` 需要在第一次调用之后成为 `A0` 和 `A1` 的订阅者。
3. 监测一个变量的变化，例如当我们给 `A0` 赋了一个新值后，应该通知所有订阅了此变量的副作用重新执行。

### watchEffect
Vue 提供了一个 API 来创建响应式副作用 `watchEffect()`，它的使用方式和上面的函数 `whenDepsChange()` 非常相似。我们用真正的 Vue API 改写上面的例子：
```js
import { ref, watchEffect } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = ref()

watchEffect(() => {
  // 追踪 A0 和 A1
  A2.value = A0.value + A1.value
})

// 将触发副作用
A0.value = 2
```
<i id="computed"></i>
### computed
使用一个响应式副作用来更改一个 `ref` 并不是最优解，使用计算属性会更直观简洁：
```js
import { ref, computed } from 'vue'

const A0 = ref(0)
const A1 = ref(1)
const A2 = computed(() => A0.value + A1.value)

A0.value = 2
```
在内部，`computed` 会使用响应式副作用来管理失效与重新计算的过程。

### 响应式副作用更新 DOM
常见的响应式副作用的使用场景是：更新 DOM，例如，一个简单的响应式渲染：
```js
import { ref, watchEffect } from 'vue'

const count = ref(0)

watchEffect(() => {
  document.body.innerHTML = `计数：${count.value}`
})

// 更新 DOM
count.value++
```
Vue 组件使用了比 `innerHTML` 更高效的方式（虚拟 DOM）来更新 DOM。

## 响应式 API
### ref vs reactive
1. `ref` 可以接受任何值类型，返回一个响应式的、可更改的 `ref` 对象，它只有一个指向其内部值的属性 `.value`， 所有对 `.value` 的操作都将被追踪，并且写操作会触发与之相关的副作用。在模板中作为顶层属性被访问时，会被自动 **解包**，不需要使用 `.value`。
2. `reactive` 返回一个对象的响应式代理，仅对对象类型有效（对象、数组和 `Map`、`Set` 这样的[集合类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects#%E4%BD%BF%E7%94%A8%E9%94%AE%E7%9A%84%E9%9B%86%E5%90%88%E5%AF%B9%E8%B1%A1)），而对 `string`、`number` 和 `boolean` 这样的 [原始类型](https://developer.mozilla.org/zh-CN/docs/Glossary/Primitive) 无效。由于我们访问的是代理对象的自身属性，所以不需要 `.value`。
```js
console.log(ref(0)) // => RefImpl
console.log(reactive({value: 0}) // => Proxy
```
3. 将一个对象（引用类型）赋值给 `ref` 时：
- 会用 `reactive()` 自动转换它的 `.value`，将其转为具有深层次响应式的对象（`shallowRef` 不会转换）；
- `.value` 可以替换整个对象，而不失去响应性（`shallowRef` 会失去响应性）。
```js
let state = reactive({ count: 0 })
// ({ count: 0 }) 将不再被追踪（响应性连接已丢失！）
state = reactive({ count: 1 })

const objectRef = ref({ count: 0 })
// 是响应式的替换
objectRef.value = { count: 1 }
console.log(isProxy(objectRef.value), isReactive(objectRef.value)); // true true
```
> 简言之，如果 `ref` 的参数是基本类型，会使用 `Object.defineProperty()` 的 `getter / setter` 定义响应式；如果 `ref` 的参数是引用类型，底层会使用 `reactive` 的 `Proxy` 定义响应式，变成这样：`{ value: reactive(obj) }`。所以 `ref(obj)` 等价于 `{ value: reactive(obj) }`。

4. `ref` 被嵌套在一个 `reactive` 对象中，作为其属性被访问或更改时，或将一个 `ref` 赋值给一个 `reactive` 的属性时，该 `ref` 会被会自动解包（`shallowReactive` 不会解包）。
```js
const count = ref(0)
const state = reactive({ count })
console.log(state.count) // 0
state.count = 1
console.log(count.value) // 1

const obj = reactive({})
obj.count = count
console.log(obj.count) // 1
console.log(obj.count === count.value) // true
```
但 `ref` 被嵌套在 `reactive` 数组或 `Map` 这样的原生集合类型中时，**不会** 执行 `ref` 的解包：
```js
const books = reactive([ref('Vue 3 Guide')])
// 这里需要 .value
console.log(books[0].value)

const map = reactive(new Map([['count', ref(0)]]))
// 这里需要 .value
console.log(map.get('count').value)
```
5. 将 `reactive` 对象的属性赋值、解构至本地变量，或是将属性传入一个函数时，会失去响应性，因为对局部变量的访问不再触发 `get / set` 代理捕获器。
```js
const state = reactive({ count: 0 })

let n = state.count
// 失去响应性，不会影响原始的 state
n++
console.log(n, state.count); // 1 0

const callSomeFunction = n => n++
callSomeFunction(state.count)
console.log(n, state.count); // 1 0

let { count } = state
// 失去响应性，不会影响原始的 state
count++
console.log(count, state.count); // 1 0
```
而 `ref` 被传递给函数、为其 `.value` 赋值，或是从一般对象上被解构时，不会丢失响应性。
```js
const objectRef = ref({ count: 0 })

// 包含对象类型值的 ref 可以响应式地替换整个对象
objectRef.value = { count: 1 }

const obj = {
  foo: ref(1),
  bar: ref(2)
}

// 函数接收一个 ref，需要通过 .value 取值，会保持响应性
const callSomeFunction = n => n.value++
callSomeFunction(obj.foo)
console.log(obj.foo.value); // 2

// 被解构时，仍然是响应式的
const { foo, bar } = obj
foo.value++
console.log(obj.foo.value); // 3
```
> 简言之，`ref()` 让我们能创造一种对任意值的 “引用”，并能够在不丢失响应性的前提下传递这些引用。所以 `ref()` 经常用于将逻辑提取到 **组合函数** 中，组合式函数始终返回一个包含多个 `ref` 的普通（非 `reactive`）对象，这样该对象在组件中被解构为 `ref` 之后仍可以保持响应性。如果从组合式函数返回一个 `reactive` 对象会导致在对象解构过程中丢失与组合式函数内状态的响应性连接。

#### 如何选择
1. 如果需要一个响应式原始值，使用 `ref()` 是正确的选择。
2. 如果需要一个响应式对象，层级不深，那么使用 `ref` 也可以。
3. 如果需要一个响应式可变对象，并且对象层级较深，需要深度跟踪，那么使用 `reactive`。
4. 可以把 `reactive` 看成 `ref` 的子集，`ref` 可以解决一切问题。

### toRef vs toRefs
1. `toRef` 基于 `reactive` 对象上的一个属性，创建一个对应的 `ref`。这样创建的 `ref` 与其源属性保持同步：改变源属性的值将更新 `ref` 的值，反之亦然。
```js
const state = reactive({ foo: 1, bar: 2 })
const fooRef = toRef(state, 'foo')
// fooRef2 不会和 state.foo 保持同步，因为这个 ref() 接收到的是一个纯数值
const fooRef2 = ref(state.foo)
// 更改 fooRef 会更新源属性
fooRef.value++
fooRef2.value = 5
console.log(state.foo) // 2
// 更改源属性也会更新 fooRef
state.foo++
console.log(fooRef.value) // 3
```
当 `toRef` 与组件 `props` 结合使用时，关于禁止对 `props` 做出更改的限制依然有效。尝试将新的值传递给创建的 `ref` 等效于尝试直接更改 `props`，这是不允许的。可以使用可写 的 `computed` 或在组件上使用 `v-model` 替代。

2. `toRefs()` 将一个 `reactive` 对象转换为一个普通对象，这个普通对象的每个属性都是指向源对象相应属性的 `ref`。每个单独的 `ref` 都是使用 `toRef()` 创建的。
```js
const state = reactive({ foo: 1, bar: 2 })
const stateAsRefs = toRefs(state)
// stateAsRefs 中的 ref 和源属性已经“链接上了”
state.foo++
console.log(stateAsRefs.foo.value) // 2
stateAsRefs.foo.value++
console.log(state.foo) // 3
```
当从组合式函数中返回响应式对象时，`toRefs` 相当有用，消费者组件可以解构/展开返回的对象而不会失去响应性：
```js
function useFeatureX() {
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // ...基于状态的操作逻辑

  // 在返回时都转为 ref
  return toRefs(state)
}

// 可以解构而不会失去响应性
const { foo, bar } = useFeatureX()
```
3. 即使源属性当前不存在，`toRef()` 也会返回一个可用的 `ref`，相比之下 `toRefs` 就不会为可选 `props` 创建对应的 `ref`，只会为源对象上可以枚举的属性创建 `ref`。

### computed
1. `computed()` 接受一个 `getter` 函数，返回一个 **只读**（应该更新它所依赖的源状态以触发新的计算）的响应式 `ref` 对象，通过 `.value` 暴露 `getter` 函数的返回值。
2. 也可以接受一个带有 `get` 和 `set` 函数的对象来创建一个 **可写** 的 `ref` 对象。
3. 和一般的 `ref` 类似，可以通过 `.value` 访问计算结果，计算属性 `ref` 也会在模板中自动解包，无需添加 `.value`。

#### 方法 vs computed
**方法和计算属性两种方式的最终效果是完全相同的，不同的是计算属性是基于它的响应式依赖进行缓存的，只在相关响应式依赖发生改变时才会重新求值。**

下面例子中只要 `message` 还没有发生改变，多次访问 `reversedMessage` 计算属性会立即返回之前的计算结果，而不必重复执行 `getter` 函数。
```js
<template>
  <p>Original message: "{{ message }}"</p>
  <p>Computed reversed message: "{{ reversedMessage }}"</p>
</template>
<script setup>
import { ref, computed } from 'vue'
const message = ref('Hello')
const reversedMessage = computed(() => {
  return message.value.split('').reverse().join('')
})
</script>
```
所以下面的计算属性永远不会更新，因为 `Date.now()` 并不是一个响应式依赖：
```js
const now = computed(() => Date.now())
```
相比之下，**方法调用总是会在重渲染发生时再次执行函数**。

##### 为什么需要缓存呢？
假如有一个非常耗性能的计算属性 `list`，需要循环一个巨大的数组并做许多计算逻辑，并且可能也有其他计算属性依赖于 `list`。没有缓存的话，我们会重复执行非常多次 `list` 的 `getter`，然而这实际上没有必要！如果确定不需要缓存，那么也可以使用`方法调用`。

### watch
#### watch vs computed
1.  `计算属性`描述的是如何根据其他值派生一个值，因此 `getter` 的职责应该仅为计算和返回该值，而没有任何其他的`副作用`（如 **异步请求或者更改 DOM**）。
2. 如果需要在状态变化时执行一些`副作用`：例如更改 DOM，或是根据异步操作的结果去修改另一处的状态时，`监听器`提供了一个更通用的方法，当需要在数据变化时执行异步或开销较大的操作时，来响应数据的变化。
3. 但是像上面[响应性本质里面的例子](#computed)一样，使用一个响应式副作用来更改一个 `ref` 反而不是最优解，使用计算属性会更直观简洁。

#### watchEffect()
1. `watchEffect()` 立即运行一个函数，同时响应式地追踪其依赖，并在依赖更改时重新执行。返回值是一个用来停止该副作用的函数。
```js
const unwatch = watchEffect(() => {})
// ...当该侦听器不再需要时
unwatch()
```
2. 第一个参数就是要运行的副作用函数，它的参数也是一个函数，用来注册清理回调：会在该副作用下一次执行前被调用，可以用来清理无效的副作用，例如等待中的异步请求。
```js
watchEffect(async (onCleanup) => {
  const { response, cancel } = doAsyncWork(id.value)
  // `cancel` 会在 `id` 更改时调用，以便取消之前未完成的请求
  onCleanup(cancel)
  data.value = await response
})
```
3. 第二个参数是一个可选的选项，可以用来调整副作用的刷新时机或调试副作用的依赖、钩子事件。
4. 当更改了响应式状态，可能会同时触发 Vue 组件更新和侦听器回调。默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用，这意味着在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。如果想在侦听器回调中访问被 Vue 更新**之后**的 DOM，可以设置 `flush: 'post'` 第二个参数选项。后置刷新的 `watchEffect()` 有个更方便的别名 `watchPostEffect()`：
```js
watchEffect(callback, { flush: 'post' })
watchPostEffect(() => { /* 在 Vue 更新后执行 */ })
```
5. 在某些特殊情况下（例如要使缓存失效），可能要在响应式依赖发生改变时立即触发侦听器。这可以通过设置 `flush: 'sync'` 来实现。该设置应谨慎使用，因为如果有多个属性同时更新，这将导致一些性能和数据一致性的问题。同步的 `watchEffect()` 也有个别名 `watchSyncEffect()`：
```js
watchEffect(callback, { flush: 'sync' })
watchSyncEffect(() => {})
```

#### watch()
1. 侦听一个或多个响应式数据源，并在数据源变化时调用所给的回调函数。返回值是一个用来停止该副作用的函数。
2. 第一个参数是侦听器的**来源**，可以是以下几种：
- 一个 `getter` 函数（返回一个值，**回调只在此函数的返回值变化时才会触发**）
- 一个 `ref`（包括计算属性）
- 一个 `reactive` 对象（**不能直接侦听属性值，需要用一个返回该属性的 `getter` 函数**）
- 由以上类型的值组成的数组
```js
import { ref, reactive, watch } from 'vue'
const x = ref(0)
const y = ref(0)
const obj = reactive({ count: 0 })
// 错误，因为 watch() 得到的参数是一个 number
// watch(obj.count, (count) => {
//   console.log(`count is: ${count}`)
// })
// 需要提供一个 getter 函数
watch(
  () => obj.count,
  (newCount, old) => {
    console.log(`count is: ${newCount}`, old)
  }
)
// 单个 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})
// getter 函数
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  })
// 多个来源组成的数组
watch([x, () => y.value, obj], ([newX, newY, newObj], [oldX, oldY, old]) => {
  console.log(newX, newY, newObj, oldX, oldY, old);
})
```
3. 第二个参数是在发生变化时要调用的回调函数。这个回调函数接受三个参数：新值、旧值（当侦听多个来源时，为两个数组，分别对应来源数组中的新值和旧值），以及一个用于注册副作用清理的回调函数：会在副作用下一次重新执行前调用，可以用来清除无效的副作用，例如等待中的异步请求。
```js
watch(id, async (newId, oldId, onCleanup) => {
  const { response, cancel } = doAsyncWork(newId)
  // `cancel` 会在 `id` 更改时调用，以便取消之前未完成的请求
  onCleanup(cancel)
  data.value = await response
})
```
4. 第三个可选的参数是一个对象，支持以下这些选项：
- **`immediate`**：在侦听器创建时立即触发回调。第一次调用时旧值是 `undefined`。
- **`deep`**：如果源是对象，强制深度遍历，以便在深层级变更时触发回调。
- **`flush`**：调整回调函数的刷新时机。
- **`onTrack / onTrigger`**：调试侦听器的依赖。

5. 直接给 `watch()` 传入一个响应式对象，会隐式地创建一个深层侦听器——该回调函数在所有嵌套的变更时都会被触发。
```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发，`newValue` 和 `oldValue` 是相等的
  // 因为它们是同一个对象！
})
obj.count++ // 会触发
```
6. 当使用 `getter` 函数作为源时，回调只在此函数的返回值变化时才会触发。如果让回调在深层级变更时也能触发，需要使用 `{ deep: true }` 强制侦听器进入深层级模式。在深层级模式时，如果回调函数由于深层级的变更而被触发，那么新值和旧值将是同一个对象。
```js
const obj = reactive({ count: 0 })

watch(() => obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发，`newValue` 和 `oldValue` 是相等的
  // 因为它们是同一个对象！
}, { deep: true })
obj.count++ // 会触发
```
7. 给 `watch()` 传入一个对象类型 `ref` 时，如果需要侦听其深层属性变化，也需要使用 `{ deep: true }`。
```js
const obj = ref({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 在嵌套的属性变更时触发，`newValue` 和 `oldValue` 是相等的
  // 因为它们是同一个对象！
}, { deep: true })
obj.value.count++ // 会触发
```
> 深度侦听需要遍历被侦听对象中的所有嵌套的属性，当用于大型数据结构时，开销很大。因此只在必要时才使用它，并且要留意性能。

8. 当更改了响应式状态，可能会同时触发 Vue 组件更新和侦听器回调。默认情况下，用户创建的侦听器回调，都会在 Vue 组件更新**之前**被调用，这意味着在侦听器回调中访问的 DOM 将是被 Vue 更新之前的状态。如果想在侦听器回调中访问被 Vue 更新**之后**的 DOM，可以设置 `flush: 'post'` 第三个参数选项。
```js
watch(source, () => { /* 在 Vue 更新后执行 */ }, { flush: 'post' })
```

#### watch vs watchEffect
`watch` 和 `watchEffect` 都能响应式地执行有副作用的回调。它们之间的主要区别是追踪响应式依赖的方式：
- `watch` 默认是懒执行的：仅当数据源变化时，才会执行回调。`watchEffect` 会立即执行一次副作用函数。
- `watch` 可以访问所侦听状态的前一个值和当前值。
- `watch` **只追踪明确侦听的数据源，不会追踪任何在回调中访问到的东西**，更加明确是应该由哪个状态触发侦听器重新执行。`watch` **会避免在发生副作用时追踪依赖**，因此，我们能更加精确地控制回调函数的触发时机。
- `watchEffect`，则**会在副作用发生期间追踪依赖**。它会在同步执行过程中，**自动追踪所有能访问到的响应式属性**。这更方便，而且代码往往更简洁，但有时**其响应性依赖关系会不那么明确**。

1. 在某些场景中，我们希望在创建 `watch` 侦听器时，立即执行一遍回调。例如我们请求一些初始数据后，在相关状态更改时重新请求数据。可以通过传入 `immediate: true` 选项来强制侦听器的回调立即执行：
```js
const obj = reactive({ count: 0 })
watch(
  () => obj.count,
  (newCount, old) => {
    console.log(`count is: ${newCount}`, old)
  }, { immediate: true } // 立即执行，且当 `source` 改变时再次执行
)
// 相当于
watchEffect(
  (onCleanup) => {
    console.log(`count is: ${obj.count}`)
  }
)
```
2. 侦听器的回调使用与源完全相同的响应式状态时，使用 `watchEffect()` 会更简单。例如下面的代码，在每当 `todoId` 的引用发生变化时使用侦听器来加载一个远程资源：
```js
const todoId = ref(1)
const data = ref(null)

watch(todoId, async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
}, { immediate: true })
```
这里注意侦听器是两次使用了 `todoId`，一次是作为源，一次是在回调中。`watchEffect()` 允许我们自动跟踪回调的响应式依赖，所以上面的侦听器可以重写为：
```js
watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
这个例子中，回调会立即执行，不需要指定 `immediate: true`。在执行期间，它会自动追踪 `todoId.value` 作为依赖（和`计算属性`类似）。每当 `todoId.value` 变化时，回调会再次执行。有了 `watchEffect()`，我们不再需要明确传递 `todoId` 作为源值。

> `watchEffect` 仅会在其**同步**执行期间，才追踪依赖。在使用异步回调时，只有在第一个 `await` 正常工作前访问到的属性才会被追踪。

3. 对于上面例子中只有一个依赖项的例子来说，`watchEffect()` 的好处相对较小。但是对于有多个依赖项的侦听器来说，使用 `watchEffect()` 可以消除手动维护依赖列表的负担。此外，**如果你需要侦听一个嵌套数据结构中的几个属性，`watchEffect()` 可能会比深度侦听器更有效，因为它将只跟踪回调中被使用到的属性，而不是递归地跟踪所有的属性。**

#### 异步和停止侦听器
1. 在 `setup()` 或 `<script setup>` 中用**同步**语句创建的侦听器，会自动绑定到宿主组件实例上，并且会在宿主组件卸载时自动停止。因此，在大多数情况下，无需关心怎么停止一个侦听器。
2. 如果用异步回调创建一个侦听器，那么它不会绑定到当前组件上，你必须手动停止它，以防内存泄漏。要手动停止一个侦听器，调用 `watch` 或 `watchEffect` 返回的函数：
```js
// 会自动停止
watchEffect(() => {})

// 不会自动停止！
setTimeout(() => {
  watchEffect(() => {})
}, 100)

const unwatch = watchEffect(() => {})

// ...当该侦听器不再需要时
unwatch()
```
3. 需要异步创建侦听器的情况很少，尽可能选择同步创建。如果需要等待一些异步数据，可以使用条件侦听逻辑：
```js
// 需要异步请求得到的数据
const data = ref(null)

watchEffect(() => {
  // 请求数据...
  if (data.value) {
    // 数据加载后执行某些操作
  }
})
```