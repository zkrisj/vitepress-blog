---
date: 23:33 2023/3/23
title: Vue3+Vite 中 JSX 的使用方式
tags:
- Vue
description: JSX 语法并没有定义运行时语义，并且能被编译成各种不同的输出形式，Vue 的 JSX 编译方式与 React 中 JSX 的编译方式不同。
---
## 介绍
JSX（JavaScript 和 XML），是一个 HTML-in-JavaScript 的语法扩展，首先在 React 中被进入。JSX 可以很好地描述 UI 应该呈现出它应有交互的本质形式。JSX 是在 JavaScript 语法上的拓展，因此类似于 HTML 的代码可以和 JS 共存。例如：
```js
const button = <MyButton color="blue" shadowSize={2}>
  Click Me
</MyButton>
```
该 button 常量称为 JSX 表达式。可以使用它在我们的应用程序中渲染 `<MyButton>` 标签。浏览器是无法读取直接解析 JSX 的。JSX 表达式经过（ Babel 或 Parcel 之类的工具）编译之后是这样的：
```js
React.createElement(
  MyButton,
  {color: 'blue', shadowSize: 2},
  'Click Me'
)
```
实际上，JSX 仅仅只是 React.createElement(component, props, ...children) 函数的语法糖。可以使用 React.createElement() 自己编写 UI 来跳过编译步骤。但是，这样做会失去 JSX 的声明性优势，并且代码变得更难以阅读。编译是开发过程中的一个额外步骤，但是 React 社区中的许多开发人员都认为 JSX 的可读性值得。另外，流行的工具使 JSX-to-JavaScript 编译成为其设置过程的一部分。除非您愿意，否则不必自己配置编译。如果你想测试一些特定的 JSX 会转换成什么样的 JavaScript，你可以尝试使用 [在线的 Babel 编译器](https://babeljs.io/repl/#?presets=react&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG4B8AEhlogO5xnr0AhLQD0jVgG4iAXyJA)。

React 并不强制要求使用 JSX。当你不想在构建环境中配置有关 JSX 编译时，不在 React 中使用 JSX 会更加方便。例如，用 JSX 编写的代码：
```js
class Hello extends React.Component {
  render() {
    return <div>Hello {this.props.toWhat}</div>;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Hello toWhat="World" />);
```
可以编写为不使用 JSX 的代码：
```js
class Hello extends React.Component {
  render() {
    return React.createElement('div', null, `Hello ${this.props.toWhat}`);
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Hello, {toWhat: 'World'}, null));
```

## 在 Vue3 中使用 JSX
Vue 使用单文件组件，把 template 模板、相关脚本和 CSS 一起整合放在 .vue 结尾的一个单文件中。这些文件最终会通过 JS 打包或构建工具（例如 Webpack、Vite）处理。

> `<template>` 元素包含了所有的标记结构和组件的展示逻辑。template 可以包含任何合法的 HTML，以及 Vue 特定的语法。通过设置 `<template>` 标签的 `lang` 属性，例如可以通过设置 `<template lang="pug">` 就可以在使用 Pug 模板来替代标准 HTML。
> 
> 而 .vue 文件中的 `<script>` 标签包含组件中所有的非显示逻辑，并且需要默认导出一个 JS 对象。该对象是在本地注册组件、定义属性、处理本地状态、定义方法等的地方。在构建阶段这个包含了 template 模板的对象会被处理和转换成为一个有 render() 函数的 Vue 组件。
> 
> 组件的 CSS 样式写在 `<style>` 标签里，如果添加了 `scoped` 属性，Vue 会把样式的范围限制到单文件组件的内容里。这是类似于 CSS-in-JS 的解决方案，只不过允许书写纯粹的 CSS。如果通过 CLI 创建项目时选择了 CSS 预处理器，则可以将 `lang` 属性添加到 `<style>` 标签中，以便 Webpack 可以在构建时处理内容。

虽然 jsx 最早是由 React 引入，但实际上 JSX 语法并没有定义运行时语义，并且能被编译成各种不同的输出形式。如果你之前使用过 JSX 语法，那么请注意 **Vue 的 JSX 编译方式与 React 中 JSX 的编译方式不同**，因此不能在 Vue 应用中使用 React 的 JSX 编译。与 React JSX 语法的一些明显区别包括：
- 可以使用 HTML attributes 比如 `class` 和 `for` 作为 props - 不需要使用 `className` 或 `htmlFor`。
- 传递子元素给组件 (比如 slots) 的[方式不同](https://cn.vuejs.org/guide/extras/render-function.html#passing-slots)。

Vue 的类型定义也提供了 TSX 语法的类型推导支持。当使用 TSX 语法时，确保在 `tsconfig.json` 中配置了 `"jsx": "preserve"`，这样的 TypeScript 就能保证 Vue JSX 语法编译过程中的完整性。

### 安装插件（@vitejs/plugin-vue-jsx）
vite 官方提供了官方的插件来支持在 vue3 中使用 jsx/tsx，直接安装就行。
```
npm i @vitejs/plugin-vue-jsx -D
```
安装完之后在 vite.config.js 文件中的 plugins 字段中添加 jsx 支持：
```js
import vueJsx from "@vitejs/plugin-vue-jsx";

export default defineConfig({
  plugins: [
    vueJsx(),
  ]
})
```
这样就可以在项目中使用 jsx/tsx 了。

### 新建 jsx 文件
在项目中新建 jsx 或 tsx 后缀的文件，语法和 js 文件类似，但是和 .vue 文件中的 `<script>` 标签一样，jsx 文件模块需要默认导出一个 JS 对象。该对象用来在本地注册组件、定义属性、处理本地状态、定义方法等。
```js
import HelloWorld from './HelloWorld.vue'
export default {
  setup() {
    return () => <HelloWorld msg="11" />;
  },
};
```

### 语法
1. 插值。与 vue 模板语法中的插值一样，但是双大括号 {{}} 变为了单大括号 {}。大括号内支持任何有效的 JavaScript 表达式，比如：2 + 2，user.firstName，formatName(user) 等。
```html
// 模板语法
<span>{{ a + b }}</span>

// jsx/tsx
<span>{ a + b }</span>
```
2. class 类名绑定。有两种方式，使用模板字符串或者使用数组。
```html
// 模板字符串
<div className={ `header ${ isBg ? 'headerBg' : '' }` }>header</div>
// 数组
<div class={ [ 'header', isBg && 'headerBg' ] } >header</div>
```
3. style 样式绑定。需要使用双大括号。
```jsx
const color = 'red'
const element = <sapn style={{ color, fontSize: '16px' }}>style</sapn>
```
4. 条件渲染。由于 jsx 本身具有 js 语法，所以不再需要使用 v-if 指令，使用 if/else 和三元表达式都可以实现。但是支持 v-show 指令。
```js
const element = (name) => {
  if (name) {
    return <h1>Hello, { name }</h1>
  } else {
    return <h1>Hello, Stranger</h1>
  }
}

const element = icon ? <span class="icon"></span> : null;
// 以上代码等效于：
const element = icon && <span class="icon"></span>;
```
5. 列表渲染。同样，由于 jsx 本身具有 js 语法，所以不再需要使用 v-for 指令，使用 JS 数组的 map 方法即可。

```js
const listData = [
   {name: 'Tom', age: 18},
   {name: 'Jim', age: 20},
   {name: 'Lucy', age: 16}
]
return () => (
   <div>
     <div class={'box'}>
       <span>姓名</span>
       <span>年龄</span>
     </div>
   {
   prop.listData.map(item => <div class={'box'}>
       <span>{item.name}</span>
       <span>{item.age}</span>
     </div>
     })
   </div>
)
```
6. 标签属性绑定。也是使用大括号包裹，不能使用 v-bind 指令。而 vue 组件中通过 `<div v-bind="properties"></div>` 批量绑定标签属性，在 JSX 中需要使用 `<div {...properties}></div>`。
```js
const href = 'https://cn.vuejs.org/'
const element = <a href={href}>Vue3</a>
```
7. 事件绑定。使用的也是 单大括号 {}，不过事件绑定不是以 @为前缀了，而是改成了 on，与原生相同。例如：click 事件是 onClick 或 onclick。
```js
const confirm = () => {
  // 确认提交
}
<button onClick={confirm}>确定</button>
```
如果要带参数，需要使用箭头函数进行包裹：
```js
const confirm = (name) => {
  // 确认提交
}
<button onClick={() => confirm('Are you sure')}>确定</button>
```
8. 事件修饰符。需要使用 withModifiers 方法，接收两个参数，第一个参数是绑定的事件，第二个参数是需要使用的事件修饰符。
```js
import { withModifiers, defineComponent, ref } from 'vue'

const App = defineComponent({
  setup() {
    const count = ref(0);

    const inc = () => {
      count.value++;
    };

    return () => (
      <div onClick={ withModifiers(inc, ['self']) }>{ count.value }</div>
    );
  },
})
export default App
```
注意：Vue 模板中 ref 变量是可以直接解构的，但是在 jsx 中不行，需要添加 .value，比如上面的 { count.value }。

9. v-model 双向绑定。需要使用单大括号 {}。如果绑定属性则需要一个数组，第一个元素为绑定的值，第二个元素为绑定的属性。
```js
// 绑定值
<input v-model="show" /> // vue
<input v-model={show.value} /> // jsx

// 绑定属性
<input v-model:prop="show" /> // vue
<input v-model={[show.value,'prop']} /> // jsx

// 修饰符写法
<input v-model:prop.trim="show" /> // vue
<input v-model={[show.value,'prop',['trim']]} /> // jsx
```
10. slot 插槽。jsx/tsx 中无法使用 slot 标签，定义插槽方式一：通过 setup 函数的第一个参数 ctx 上下文对象的 slots 的属性，setup 函数默认接收两个参数：
- props - 组件传入的参数对象。
- ctx - 上下文对象，上下文对象暴露了其他一些在 setup 中可能会用到的值，包括：
    - attrs - 透传的 Attributes（非响应式的对象，等价于 $attrs）。
    - slots - 插槽（非响应式的对象，等价于 $slots）。
    - emit - 触发事件的函数（等价于 $emit）。
    - expose - 暴露公共属性的函数。

如果解构了 `props` 对象，解构出的变量将会丢失响应性，因此推荐通过 `props.xxx` 的形式来使用其中的 props。如果确实需要解构 `props` 对象，或者需要将某个 prop 传到一个外部函数中并保持响应性，可以使用 [toRefs()](https://cn.vuejs.org/api/reactivity-utilities.html#torefs) 和 [toRef()](https://cn.vuejs.org/api/reactivity-utilities.html#toref) 这两个工具函数：
```js
import { toRefs, toRef } from 'vue'

export default {
  setup(props) {
    // 将 `props` 转为一个其中全是 ref 的对象，然后解构
    const { title } = toRefs(props)
    // `title` 是一个追踪着 `props.title` 的 ref
    console.log(title.value)

    // 或者，将 `props` 的单个属性转为一个 ref
    const title = toRef(props, 'title')
  }
}
```
ctx 上下文对象是非响应式的，可以安全地解构：
```js
export default {
  setup(props, { attrs, slots, emit, expose }) {
    ...
  }
}
```
attrs 和 slots 都是响应式（有状态）的对象，它们总是会随着组件自身的更新而更新。这意味着你应当避免解构它们，并始终通过 attrs.x 或 slots.x 的形式使用其中的属性。此外，和 props 不同，attrs 和 slots 的属性都不是响应式的。如果想要基于 attrs 或 slots 的改变来执行副作用，那么应该在 onBeforeUpdate 生命周期钩子中编写相关逻辑。

expose 函数用于显式地限制该组件暴露出的属性，当父组件通过模板引用访问该组件的实例时，将仅能访问 expose 函数暴露出的内容：
```js
export default {
  setup(props, { expose }) {
    // 让组件实例处于 “关闭状态”
    // 即不向父组件暴露任何东西
    expose()

    const publicCount = ref(0)
    const privateCount = ref(0)
    // 有选择地暴露局部状态
    expose({ count: publicCount })
  }
}
```
通过 ctx 上下文对象的 slots 的属性获取插槽对象后，就可以定义插槽了。
```js
import { defineComponent } from 'vue'

export default defineComponent({
  setup(props, { slots }) { // 逻辑
    return () => {
      return <p>
     <button>{ slots.test?.() }</button>
     <button>{ slots.default?.() }</button>
     </p>
    }
  },
})

// 在引用的组件中
<template #test>slot-test</template>
<template #>slot-default</template>
```
定义插槽方式二：使用 renderSlot 函数。
```js
import { renderSlot } from 'vue'

<button>
  { renderSlot(slots, 'default') }
</button>
```
而如果在 jsx 中使用插槽，可以直接通过标签属性 slot，或通过 v-slots 指令。
```js
import HelloWorld from './HelloWorld'
export default defineComponent({
  setup() {
    return () => <div class={'box'}>
      <HelloWorld v-slots={{
        title: () => {
          return <p>我是title插槽</p>
        },
        default: () => {
          return <p>我是default插槽</p>
         }
      }} />
    </div>
  }
})
```
11. CSS Modules。引入局部样式，相当于 vue 组件中 `<style>` 标签的 scoped 属性。
```js
import styles from './index.module.scss'

<div class={styles.wrap}></div>
```

## GitHub 源码
- [Vue3 中自定义组件](https://github.com/zkrisj/vue-defineCustomElement)

## 参考资料
- [在 vue3 中优雅的使用 jsx/tsx](https://mp.weixin.qq.com/s/FtVZEdkrXLSfJpPYaToAYQ)