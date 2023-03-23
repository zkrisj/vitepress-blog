---
date: 20:58 2023/3/23
title: Vue3 中 pinia-plugin-persistedstate Vite 插件的使用
tags:
- Vue
description: pinia-plugin-persistedstate 插件可以使 Pinia 存储的持久性变得更简单和可配置。
---
## Pinia
Vuex 用于管理和多个组件共享状态（数据源）。现在，Vue 的官方状态管理库已更改为 [Pinia](https://pinia.vuejs.org/)，它由 Vue 核心团队维护。Pinia 具有与 Vuex 5 几乎完全相同或增强的 API，在 [Vuex 5 RFC](https://github.com/vuejs/rfcs/pull/271) 中进行了描述。可以简单地将 Pinia 视为具有不同名称的 Vuex 5（Pinia 也适用于 Vue 2.x）。Vue 官方推荐使用 Pinia：
- 更强的团队协作约定。
- 与 Vue DevTools 集成，包括时间轴、组件内部审查和时间旅行调试。
- 模块热更新 (HMR)。
- 服务端渲染支持。
- 即使在 JavaScript 中也具有类型，为 JS 用户提供适当的 TypeScript 支持或自动完成功能。
- 与 TypeScript 一起使用时具有可靠的类型推断支持。

## pinia-plugin-persistedstate
pinia-plugin-persistedstate 插件可以使 Pinia 存储的持久性变得更简单和可配置：
- 类似于 vuex-persistedstate 的 API。
- 单个 Store 的配置。
- 自定义存储方式和自定义序列化数据。
- 注水 hooks。
- 与 Vue 2 和 3 兼容。
- 没有外部依赖。
- 体积超小（<1kB gzipped）。

## 示例
1. 使用 `npm create vite@latest` 命令创建 vite 项目：
- `Select a framework` 选择 Vue；
- `Select a variant` 选择 `Customize with create-vue`；
- `Add Pinia for state management?` 选择 Yes。

2. 安装后，在 src 下面会生成一个 stores 文件夹和一个 counter.js 示例文件。可以看到默认使用了 Composition API 写法，导出了一个响应属性 count、一个计算属性 doubleCount 和一个方法 increment。内容如下：
```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
})
```

3. 将 App.vue 文件修改为以下即可引用 counter.js 中定义的 Store：
```js
<template>
  {{ countStore.count }}
  <hr>
  {{ countStore.doubleCount }}
  <hr>
  <button @click="countStore.increment">increment</button>
</template>
<script setup>
  import { useCounterStore } from "./stores/counter"
  const countStore = useCounterStore()
</script>
<style>
</style>
```
当点击按钮时，响应属性 count 和计算属性 doubleCount 都会改变。但是，刷新页面后，它们都会恢复为 0，说明数据没有被持久化。

4. 安装持久化插件：
```
npm i pinia-plugin-persistedstate
```

5. 修改 src/main.js 文件：
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))

app.mount('#app')
```

6. 修改 counter.js 文件：
```js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
  }

  return { count, doubleCount, increment }
}, {
  persist: true,
})
```
当点击 increment 按钮时，响应属性 count 和计算属性 doubleCount 都会改变。刷新页面后可以看到，它们也都显示为刷新之前的数据，说明数据已经被持久化了。

7. 插件预先配置了以下内容：
- localStorage 作为存储。
- store.$id 作为存储的默认键，即 defineStore 的第一个参数。
- JSON.stringify/JSON.parse 作为序列化器/反序列化器。
- 所有属性都会被持久化到本地存储中。

但是，可以将传递一个对象给 store 的 persist 属性来配置持久性。
```js
import { stringify, parse } from 'zipson'

persist: {
  key: 'my-custom-key',
  storage: sessionStorage,
  paths: ['count'],
  serializer: {
    deserialize: parse,
    serialize: stringify
  },
  beforeRestore: (ctx) => {
    console.log(`about to restore '${ctx.store.$id}'`)
  },
  afterRestore: (ctx) => {
    console.log(`just restored '${ctx.store.$id}'`)
  },
  debug: true,
},
```
- key 用于引用存储中存储的反序列化数据的密钥。
- storage 将数据持久保存到的存储类型。必须有 getItem: (key: string) => string | null 和 setItem: (key: string, value: string) => void 方法。
- paths 持久化属性数组。 [] 表示没有状态被持久化， undefined 或 null 表示整个状态被持久化。
- serializer 自定义序列化程序在持久化数据之前序列化数据，并在重新水化存储之前反序列化数据。必须同时有 serialize: (value: StateTree) => string 和 deserialize: (value: string) => StateTree 方法。
- beforeRestore 钩子函数在恢复持久状态之前运行。该钩子可以访问整个 PiniaPluginContext。这可用于在水合之前强制执行特定操作。
- afterRestore 钩子函数在恢复持久状态后运行。该钩子可以访问整个 PiniaPluginContext。这可用于在水合后强制执行特定操作。
- debug 设置为 true 时，在持久化/水合存储时可能发生的任何错误都将记录为 console.error。

8. 全局持久性配置：初始化插件时不使用 pinia-plugin-persistedstate 的默认导出项，而使用公开的 createPersistedState 方法使用全局选项初始化插件。这些选项成为应用内所有 Store 的新默认选项。修改 src/main.js 文件：
```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
// import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPersistedState } from 'pinia-plugin-persistedstate'

import './assets/main.css'

const app = createApp(App)

// const pinia = createPinia().use(piniaPluginPersistedstate)
const pinia = createPinia().use(createPersistedState({
  storage: sessionStorage,
  paths: ['count', 'count2'],
}))

app.use(pinia)

app.mount('#app')
```
这样，默认情况下，每个声明的 Store 中的 persist: true 配置都会将数据持久化到sessionStorage 中。但是传递给单个 Store 的 persist 配置的任何选项都可以覆盖其在全局选项中声明的对应项。可用的全局选项包括：
- storage
- serializer
- beforeRestore
- afterRestore

9. 单个 Store 可以有多个持久性属性配置：可以将数据保存到不同的存储中，persist 选项可以接受一系列配置。
```js
// src/stores/counter.js
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const count2 = ref(0)
  const doubleCount = computed(() => count.value * 2)
  function increment() {
    count.value++
    count2.value++
  }

  return { count, count2, doubleCount, increment }
}, {
  // persist: true,
  persist: [
    {
      paths: ['count'],
      storage: localStorage,
    },
    {
      paths: ['count2'],
      storage: sessionStorage,
    },
  ],
})
```
这样，count 值将被持久化到 localStorage，而 count2 值将被持久化到 sessionStorage。

## GitHub 源码
[vue3 pinia-plugin-persistedstate vite 插件的使用](https://github.com/zkrisj/vue3-pinia-plugin-persistedstate)