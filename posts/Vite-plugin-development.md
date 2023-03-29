---
date: 15:46 2023/3/29
title: Vite 插件开发 ｜ 青训营笔记
tags:
- Vite
description: 插件可以很好的扩展 vite 自身不能做到的事情，比如文件图片的压缩、对 commonjs 的支持、打包进度条等。
---
## Vite 简介
Vite 开箱即用的功能等价于：
- webpack
- webpack-dev-server
- css-loader
- style-loader
- less-loader
- sass-loader
- postcss-loader
- file-loader
- MiniCssExtractPlugin
- HTMLWebpackPlugin
- HMR 无需额外配置，自动开启
- Tree Shaking 无需配置，默认开启
- ...

## 使用插件
若要使用一个插件，需要将它添加到项目的 `devDependencies` 并在 `vite.config.js` 配置文件中的 `plugins` 数组中引入它。例如，要想为传统浏览器提供支持，可以按下面这样使用官方插件 [@vitejs/plugin-legacy](https://github.com/vitejs/vite/tree/main/packages/plugin-legacy)：
```ts
npm add -D @vitejs/plugin-legacy
```
```js
// vite.config.js
import legacy from '@vitejs/plugin-legacy'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    legacy({
      targets: ['defaults', 'not IE 11'],
    }),
  ],
})
```
`plugins` 也可以接受将多个插件作为单个模块文件的预设。这对于使用多个插件实现的复杂特性（如框架集成）很有用。该数组将在内部被扁平化（flatten）。
```js
// 框架插件
import frameworkRefresh from 'vite-plugin-framework-refresh'
import frameworkDevtools from 'vite-plugin-framework-devtools'

export default function framework(config) {
  return [frameworkRefresh(config), frameworkDevTools(config)]
}
```
```js
// vite.config.js
import { defineConfig } from 'vite'
import framework from 'vite-plugin-framework'

export default defineConfig({
  plugins: [framework()]
})
```

### 插件排序
为了与某些 Rollup 插件兼容，可能需要强制修改插件的执行顺序，或者只在构建时使用。这应该是 Vite 插件的实现细节。可以使用 `enforce` 修饰符来强制插件的位置:
- Alias（路径别名）相关的插件
- `pre`：在 Vite 核心插件之前调用该插件
- Vite 核心插件
- `normal`（默认）：在 Vite 核心插件之后调用该插件
- Vite 生产环境构建用的插件
- `post`：在 Vite 构建插件之后调用该插件
- Vite 后置构建插件（压缩、manifest、报告）
```js
// vite.config.js
import image from '@rollup/plugin-image'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...image(),
      enforce: 'pre'
    }
  ]
})
```

### 按需应用
默认情况下 Vite 插件同时被用于开发环境和生产环境，可以使用 `apply` 属性指明它们仅在 `'build'`（生产环境）或 `'serve'`（开发环境）时调用：
```js
// vite.config.js
import typescript2 from 'rollup-plugin-typescript2'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...typescript2(),
      apply: 'build'
    }
  ]
})
```
`apply` 属性还可以配置成一个函数，进行更灵活的控制：
```js
apply(config, { command }) {
  // 只用于非 SSR 情况下的生产环境构建
  return command === 'build' && !config.build.ssr
}
```

## 开发插件
插件可以很好的扩展 `vite` 自身不能做到的事情，比如 `文件图片的压缩`、 `对 commonjs 的支持`、 `打包进度条` 等。

1. Vite 的插件机制是基于 Rollup 来设计的，Vite 和 Rollup 中具有相同的 Hook 如 `resolveId`、`load`、`transform`。
2. Vite 插件扩展了 Rollup 接口，带有一些 Vite 独有的配置项。因此，你只需要编写一个 Vite 插件，就可以同时为开发环境和生产环境工作。
3. 当创作插件时，可以在 `vite.config.js` 中直接使用它，没必要直接为它创建一个新的 package。
4. Vite 插件应该有一个带 `vite-plugin-` 前缀、语义清晰的名称。如果只适用于特定的框架，它的名字应该遵循以下前缀格式：
- `vite-plugin-vue-` 前缀作为 Vue 插件
- `vite-plugin-react-` 前缀作为 React 插件
- `vite-plugin-svelte-` 前缀作为 Svelte 插件

5. Vite 插件与 Rollup 插件结构类似，是一个具有 `name` 属性和各种插件 Hook 的对象：
```ts
{
  // 插件名称
  name: 'vite-plugin-xxx',
  load(code) {
    // 钩子逻辑
  },
}
```
6. 一般情况下因为要考虑到外部传参，我们不会直接写一个对象，而是实现一个返回插件对象的`工厂函数`。
```js
// myPlugin.js
export function myVitePlugin(options) {
  return {
    name: 'vite-plugin-xxx',
    load(id) {
      // 在钩子逻辑中可以通过闭包访问外部的 options 传参
    }
  }
}
```
```js
// vite.config.ts
import { myVitePlugin } from './myVitePlugin';
export default {
  plugins: [myVitePlugin({ /* 给插件传参 */ })]
}
```

### Hook
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e44762a1dd146b1802f718e17a10fb6~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a951108fd62d44f88b1489d7906c9482~tplv-k3u1fbpfcp-zoom-in-crop-mark:4536:0:0:0.image?)

#### 通用 Hook
Vite 在开发阶段会创建一个插件容器 `Plugin Container` 来调用 Rollup 构建钩子，这个钩子主要分为三个阶段:
- **服务器启动阶段**: `options` 和 `buildStart` 钩子会在服务启动时被调用。
- **请求响应阶段**: 当浏览器发起请求时，Vite 内部依次调用 `resolveId`、`load` 和 `transform` 钩子。
- **服务器关闭阶段**: Vite 会依次执行 `buildEnd` 和 `closeBundle` 钩子。

除了以上钩子，其他 Rollup 插件钩子，例如 `moduleParsed`、`renderChunk` 均不会在 Vite 开发阶段调用，因为 Vite 为了性能会避免完整的 AST 解析。而在生产环境下 Vite 会直接使用 Rollup，所以 Vite 插件中所有 Rollup 的插件钩子都会生效。

##### 构建阶段
1. `options(options)` ：在服务器启动时被调用：获取、操纵Rollup选项，严格意义上来讲，它执行于属于构建阶段之前；
1. `buildStart(options)`：在每次开始构建时调用；
1. `resolveId(source, importer, options)`：在每个传入模块请求时被调用，创建自定义确认函数，可以用来定位第三方依赖；
1. `load(id)`：在每个传入模块请求时被调用，可以自定义加载器，可用来返回自定义的内容；
1. `transform(code, id)`：在每个传入模块请求时被调用，主要是用来转换单个模块；
1. `buildEnd(error?: Error)`：在构建阶段结束后被调用，此处构建结束只是代表所有模块转义完成；

##### 输出阶段
1. `outputOptions(options)`：接受输出参数；
1. `renderStart(outputOptions, inputOptions)`：每次 bundle.generate 和 bundle.write 调用时都会被触发；
1. `augmentChunkHash(chunkInfo)`：用来给 chunk 增加 hash；
1. `renderChunk(code, chunk, options)`：转译单个的chunk时触发。rollup 输出每一个chunk文件的时候都会调用；
1. `generateBundle(options, bundle, isWrite)`：在调用 bundle.write 之前立即触发这个 hook；
1. `writeBundle(options, bundle)`：在调用 bundle.write后，所有的chunk都写入文件后，最后会调用一次 writeBundle；
1. `closeBundle()`：在服务器关闭时被调用。

#### Vite 独有 Hook
Vite 中具有一些特有的 Hook，这些 Hook 只会在 Vite 内部调用，而放到 Rollup 中会被直接忽略。
##### config
- 类型： `(config: UserConfig, env: { mode: string, command: string }) => UserConfig | null | void`
- 种类： async, sequential

Vite 在读取完配置文件 vite.config.ts 之后，会拿到用户导出的配置对象，然后执行 config 钩子。在这个钩子里面，你可以对配置文件导出的对象进行自定义的操作：
```ts
// 返回部分配置（推荐）
const editConfigPlugin = () => ({
  name: 'vite-plugin-modify-config',
  config: () => ({
    alias: {
      react: require.resolve('react')
    }
  })
})
```
也可以通过钩子的入参拿到 `config` 对象进行自定义的修改：
```ts
const mutateConfigPlugin = () => ({
  name: 'mutate-config',
  // command 为 `serve`(开发环境) 或者 `build`(生产环境)
  config(config, { command }) {
    // 生产环境中修改 root 参数
    if (command === 'build') {
      config.root = __dirname;
    }
  }
})
```
在一些比较深层的对象配置中，这种直接修改配置的方式会显得比较麻烦，如 `optimizeDeps.esbuildOptions.plugins`，需要写很多的样板代码：
```ts
// 防止出现 undefined 的情况
config.optimizeDeps = config.optimizeDeps || {}
config.optimizeDeps.esbuildOptions = config.optimizeDeps.esbuildOptions || {}
config.optimizeDeps.esbuildOptions.plugins = config.optimizeDeps.esbuildOptions.plugins || []
```
可以直接返回一个配置对象，这样会方便很多：
```ts
config() {
  return {
    optimizeDeps: {
      esbuildOptions: {
        plugins: []
      }
    }
  }
}
```
##### configResolved
- 类型： `(config: ResolvedConfig) => void | Promise<void>`
- 种类： async, parallel

Vite 在解析完配置之后会调用 `configResolved` 钩子，这个钩子一般用来记录最终的配置信息，而不建议再修改配置。
```ts
const examplePlugin = () => {
  let config

  return {
    name: 'read-config',

    configResolved(resolvedConfig) {
      // 存储最终解析的配置
      config = resolvedConfig
    },

    // 在其他钩子中使用存储的配置
    transform(code, id) {
      if (config.command === 'serve') {
        // dev: 由开发服务器调用的插件
      } else {
        // build: 由 Rollup 调用的插件
      }
    }
  }
}
```
在开发环境下，`command` 的值为 `serve`（在 CLI 中，`vite` 和 `vite dev` 是 `vite serve` 的别名）。

##### configureServer
- 类型： `(server: ViteDevServer) => (() => void) | void | Promise<(() => void) | void>`
- 种类： async, sequential

1. 这个钩子仅在**开发阶段**会被调用，在运行生产版本时不会被调用，用于扩展 Vite 的 Dev Server，最常见的用例是在内部 connect 应用程序中添加自定义中间件。
2. `configureServer` 钩子将在内部中间件被安装前调用，所以自定义的中间件将会默认会比内部中间件早运行。
3. 如果你想注入一个在内部中间件 **之后** 运行的中间件，你可以从 `configureServer` 返回一个函数，将会在内部中间件安装后被调用。
```ts
const myPlugin = () => ({
  name: 'configure-server',
  configureServer(server) {
    // 姿势 1: 在 Vite 内置中间件之前执行
    server.middlewares.use((req, res, next) => {
      // 自定义请求处理...
    })
    // 姿势 2: 在 Vite 内置中间件之后执行
    // 返回一个在内部中间件安装后被调用的后置钩子
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义请求处理...
      })
    }
  }
})
```
4. 在某些情况下，其他插件钩子可能需要访问开发服务器实例（例如访问 websocket 服务器、文件系统监视程序或模块图）。这个钩子也可以用来存储服务器实例以供其他钩子访问。
```ts
const myPlugin = () => {
  let server
  return {
    name: 'configure-server',
    configureServer(_server) {
      server = _server
    },
    transform(code, id) {
      if (server) {
        // 使用 server...
      }
    }
  }
}
```
##### configurePreviewServer
- 类型： `(server: { middlewares: Connect.Server, httpServer: http.Server }) => (() => void) | void | Promise<(() => void) | void>`
- 种类： async, sequential

与 configureServer 相同但是用于预览服务器。它提供了一个 connect 服务器实例及其底层的 `httpServer`。这个钩子也是在其他中间件安装前被调用的，如果你想要在其他中间件 之后 安装一个插件，你可以从 configurePreviewServer 返回一个函数，它将会在内部中间件被安装之后再调用：
```ts
const myPlugin = () => ({
  name: 'configure-preview-server',
  configurePreviewServer(server) {
    // 返回一个钩子，会在其他中间件安装完成后调用
    return () => {
      server.middlewares.use((req, res, next) => {
        // 自定义处理请求 ...
      })
    }
  }
})
```
##### transformIndexHtml
- 类型： `IndexHtmlTransformHook | { enforce?: 'pre' | 'post', transform: IndexHtmlTransformHook }`
- 种类： async, sequential

转换 `index.html` 的专用钩子，可以拿到原始的 html 内容后进行任意的转换。这个钩子可以是异步的，并且可以返回以下其中之一:
- 经过转换的 HTML 字符串
- 注入到现有 HTML 中的标签描述符对象数组（`{ tag, attrs, children }`）。每个标签也可以指定它应该被注入到哪里（默认是在 `<head>` 之前）
- 一个包含 `{ html, tags }` 的对象

```ts
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replace(
        /<title>(.*?)<\/title>/,
        `<title>Title replaced!</title>`
      )
    }
  }
}
```
也可以返回如下的对象结构，一般用于添加某些标签。
```ts
const htmlPlugin = () => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return {
        html,
        // 注入标签
        tags: [{
          // 放到 body 末尾，可取值还有`head`|`head-prepend`|`body-prepend`，顾名思义
          injectTo: 'body',
          // 标签属性定义
          attrs: {
            type: 'module',
            src: './index.ts'
          },
          // 标签名
          tag: 'script',
        }, ],
      }
    }
  }
}
```
##### handleHotUpdate
- 类型： `(ctx: HmrContext) => Array<ModuleNode> | void | Promise<Array<ModuleNode> | void>`

执行自定义 HMR 更新处理。
- 可以进行热更模块的过滤（过滤和缩小受影响的模块列表，使 HMR 更准确）；
- 也可以返回一个空数组，并通过向客户端发送自定义事件来执行完整的自定义 HMR 处理；
```ts
handleHotUpdate({ server }) {
  server.ws.send({
    type: 'custom',
    event: 'special-update',
    data: {}
  })
  return []
}
```
- 或者进行自定义的热更处理。

钩子接收一个带有以下签名的上下文对象：
```ts
interface HmrContext {
  file: string
  timestamp: number
  modules: Array<ModuleNode>
  read: () => string | Promise<string>
  server: ViteDevServer
}
```
- `modules` 是受更改文件影响的模块数组。它是一个数组，因为单个文件可能映射到多个服务模块（例如 Vue 单文件组件）。
- `read` 这是一个异步读函数，它返回文件的内容。之所以这样做，是因为在某些系统上，文件更改的回调函数可能会在编辑器完成文件更新之前过快地触发，这样 `fs.readFile` 会直接返回空内容。传入的 `read` 函数规范了这种行为。

```ts
const handleHmrPlugin = () => {
  return {
    async handleHotUpdate(ctx) {
      // 需要热更的文件
      console.log(ctx.file)
      // 需要热更的模块，如一个 Vue 单文件会涉及多个模块
      console.log(ctx.modules)
      // 时间戳
      console.log(ctx.timestamp)
      // Vite Dev Server 实例
      console.log(ctx.server)
      // 读取最新的文件内容
      console.log(await read())
      // 自行处理 HMR 事件
      ctx.server.ws.send({
        type: 'custom',
        event: 'special-update',
        data: { a: 1 }
      })
      return []
    }
  }
}

// 前端代码中加入
// 客户端代码应该使用 HMR API 注册相应的处理器（这应该被相同插件的 transform 钩子注入）
if (import.meta.hot) {
  import.meta.hot.on('special-update', (data) => {
    // 执行自定义更新
    // { a: 1 }
    console.log(data)
    window.location.reload();
  })
}
```

#### 插件 Hook 执行顺序

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98b92116b47f4a7e8ae24889adf2d840~tplv-k3u1fbpfcp-watermark.image?)

- 服务启动阶段: `config`、`configResolved`、`options`、`configureServer`、`buildStart`。
- 请求响应阶段: 如果是 HTML 文件，仅执行 `transformIndexHtml` 钩子；对于非 HTML 文件，则依次执行 `resolveId`、`load` 和 `transform`钩子。
- 热更新阶段: 执行 `handleHotUpdate` 钩子。
- 服务关闭阶段: 依次执行 `buildEnd` 和 `closeBundle` 钩子。

### Rollup 插件兼容性
相当数量的 Rollup 插件将直接作为 Vite 插件工作（例如：`@rollup/plugin-alias` 或 `@rollup/plugin-json`），但并不是所有的，因为有些插件钩子在非构建式的开发服务器上下文中没有意义。

一般来说，只要 Rollup 插件符合以下标准，它就应该像 Vite 插件一样工作：
- 没有使用 [`moduleParsed`](https://rollupjs.org/guide/en/#moduleparsed) 钩子。
- 它在打包钩子和输出钩子之间没有很强的耦合。

如果一个 Rollup 插件只在构建阶段有意义，则在 `build.rollupOptions.plugins` 下指定即可。它的工作原理与 Vite 插件的 `enforce: 'post'` 和 `apply: 'build'` 相同。

也可以用 Vite 独有的属性来扩展现有的 Rollup 插件：
```js
// vite.config.js
import example from 'rollup-plugin-example'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    {
      ...example(),
      enforce: 'post',
      apply: 'build'
    }
  ]
})
```
可以查看 [Vite Rollup 插件](https://vite-rollup-plugins.patak.dev/) 获取兼容的官方 Rollup 插件列表及其使用指南。

### 虚拟模块
作为构建工具，一般需要处理两种形式的模块，一种存在于真实的磁盘文件系统中，另一种并不在磁盘而在内存当中，也就是`虚拟模块`。通过虚拟模块，我们既可以把自己手写的一些代码字符串作为单独的模块内容，又可以将内存中某些经过计算得出的**变量**作为模块内容进行加载，非常灵活和方便。
1. 虚拟模块是一种很实用的模式，使你可以对使用 ESM 语法的源文件传入一些编译时信息。
2. 虚拟模块在 Vite（以及 Rollup）中都以 `virtual:` 为前缀，作为面向用户路径的一种约定。插件名应该被用作命名空间，以避免与生态系统中的其他插件发生冲突。例如，`vite-plugin-posts` 可以要求用户导入一个 `virtual:posts` 或者 `virtual:posts/helpers` 虚拟模块来获得编译时信息。
3. 在内部，使用了虚拟模块的插件在解析时应该将模块 ID 加上前缀 `\0`，这一约定来自 rollup 生态。这避免了其他插件尝试处理这个 ID（比如 node 解析），而例如 sourcemap 这些核心功能可以利用这一信息来区别虚拟模块和正常文件。`\0` 在导入 URL 中不是一个被允许的字符，因此我们需要在导入分析时替换掉它们。一个虚拟 ID 为 `\0{id}` 在浏览器中开发时，最终会被编码为 `/@id/__x00__{id}`。这个 id 会被解码回进入插件处理管线前的样子，因此这对插件钩子的代码是不可见的。
4. 直接从真实文件派生出来的模块，就像单文件组件中的脚本模块（如.vue 或 .svelte SFC）不需要遵循这个约定。SFC 通常在处理时生成一组子模块，但这些模块中的代码可以映射回文件系统。对这些子模块使用 `\0` 会使 sourcemap 无法正常工作。
```js
export default function myPlugin() {
  const virtualModuleId = 'virtual:my-module'
  const resolvedVirtualModuleId = '\0' + virtualModuleId

  return {
    name: 'my-plugin', // 必须的，将会在 warning 和 error 中显示
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId
      }
    },
    load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const msg = "from virtual module"`
      }
    }
  }
}
```
然后可以在 JavaScript 中引入这些模块，并获取它们返回的数据：
```js
import { msg } from 'virtual:my-module'
console.log(msg); // "from virtual module"
```
可以看到，虚拟模块的内容完全能够被动态计算出来，因此它的灵活性和可定制程度非常高，实用性也很强，在 Vite 内部的插件被深度地使用，社区当中也有不少知名的插件(如 `vite-plugin-windicss`、`vite-plugin-svg-icons` 等)也使用了虚拟模块的技术。

### 示例
我们有时候希望能将 svg 当做一个组件来引入，这样我们可以很方便地修改 svg 的各种属性，相比于 `img` 标签的引入方式也更加优雅。但 Vite 本身并不支持将 svg 转换为组件的代码，需要我们通过插件来实现。
1. 首先安装一下需要的依赖：
```
pnpm i resolve @svgr/core -D
```
2. 用户通过传入 `defaultExport` 可以控制 svg 资源的默认导出。
- 当 `defaultExport` 为 `component`，默认当做组件来使用：
```tsx
import Logo from './Logo.svg'

// 在组件中直接使用
<Logo />
```
- 当 `defaultExports` 为 `url`，默认当做 url 使用，如果需要用作组件，可以通过`具名导入`的方式来支持：
```tsx
import logoUrl, { ReactComponent as Logo } from './logo.svg';

// url 使用
<img src={logoUrl} />
// 组件方式使用
<Logo />
```
3. 在 `plugins` 目录新建 `svgr.ts`。我们的主要逻辑在 `transform(code, id)` 钩子中，完成转换单个模块。
- 根据 id 入参过滤出 svg 资源；
- 读取 svg 文件内容；
- 利用 @svgr/core 将 svg 转换为 React 组件代码;
- 处理默认导出为 url 的情况；
- 将组件的 jsx 代码转译为浏览器可运行的代码。
```ts
import { Plugin } from "vite";
import * as fs from "fs";
import * as resolve from "resolve";

interface SvgrOptions {
  defaultExport: "url" | "component";
}

export default function viteSvgrPlugin(options: SvgrOptions): Plugin {
  const { defaultExport = "component" } = options;

  return {
    name: "vite-plugin-svgr",

    async transform(code, id) {
      if (!id.endsWith(".svg")) {
        return code;
      }
      console.log(code);
      const svgrTransform = require("@svgr/core").transform;
      const esbuildPackagePath = resolve.sync("esbuild", {
        basedir: require.resolve("vite"),
      });
      const esbuild = require(esbuildPackagePath);
      const svg = await fs.promises.readFile(id, "utf8");
      const svgrResult = await svgrTransform(
        svg,
        {},
        { componentName: "ReactComponent" }
      );
      let componentCode = svgrResult;
      if (defaultExport === "url") {
        componentCode = svgrResult.replace(
          "export default ReactComponent",
          "export { ReactComponent }"
        );
        // 加上 Vite 默认的 `export default 资源路径`
        componentCode += code;
      }
      const result = await esbuild.transform(componentCode, {
        loader: "jsx",
      });
      return result.code;
    },
  };
}
```
4. 在项目中使用这个插件。
```ts
// vite.config.ts
import svgr from './plugins/svgr';

// 返回的配置
{
  plugins: [
    // 省略其它插件
    svgr({ defaultExport: "component" })
  ]
}
```
5. 在项目中用组件的方式引入 svg。
```tsx
// App.tsx
import Logo from './logo.svg'

function App() {
  return (
    <>
      <Logo />
    </>
  )
}

export default App;
```

### 调试
另外，在开发调试插件的过程，可以装上 `vite-plugin-inspect` 插件。
```ts
// vite.config.ts
import inspect from 'vite-plugin-inspect';

// 返回的配置
{
  plugins: [
    // 省略其它插件
    inspect()
  ]
}
```
这样当再次启动项目时，会发现多出一个调试地址：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7561a58dc04847ff974d6d1b9358414f~tplv-k3u1fbpfcp-watermark.image?)

可以通过这个地址来查看项目中各个模块的编译结果：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4c49f48c18e943e3a394c8e7f492a05e~tplv-k3u1fbpfcp-watermark.image?)

通过这个面板，我们可以很清楚地看到相应模块经过插件处理后变成了什么样子，让插件的调试更加方便。