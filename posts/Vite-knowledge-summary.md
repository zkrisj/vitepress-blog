---
date: 15:34 2023/3/29
title: Vite 知识体系简单总结 ｜ 青训营笔记
tags:
- Vite
description: 在开发阶段 Vite 通过 Dev Server 基于浏览器原生 ESM 的支持实现了no-bundle 服务，生产环境无法做到完全 no-bundle，因为会有网络性能问题。Vite 并不是简单地开发阶段使用 Esbuild（Bundler、Transformer、Minifier），生产环境用 Rollup（插件机制、还是底层的打包）。
---
## Vite 介绍
前端工程的痛点：
1. 首先是前端的模块化需求。我们知道，业界的模块标准非常多，包括 ESM、CommonJS、AMD 和 CMD 等等。前端工程一方面需要落实这些模块规范，保证模块正常加载。另一方面需要兼容不同的模块规范，以适应不同的执行环境。
2. 其次是兼容浏览器，编译高级语法。由于浏览器的实现规范所限，只要高级语言/语法（TypeScript、 JSX 等）想要在浏览器中正常运行，就必须被转化为浏览器可以理解的形式。这都需要工具链层面的支持，而且这个需求会一直存在。
3. 再者是线上代码的质量问题。和开发阶段的考虑侧重点不同，生产环境中，我们不仅要考虑代码的安全性、兼容性问题，保证线上代码的正常运行，也需要考虑代码运行时的性能问题。由于浏览器的版本众多，代码兼容性和安全策略各不相同，线上代码的质量问题也将是前端工程中长期存在的一个痛点。
4. 同时，开发效率也不容忽视。我们知道，项目的冷启动/二次启动时间、热更新时间都可能严重影响开发效率，尤其是当项目越来越庞大的时候。因此，提高项目的启动速度和热更新速度也是前端工程的重要需求。

那么，前端构建工具是如何解决以上问题的呢？

![解决.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/91a3386bbde3472580de332e01d2b662~tplv-k3u1fbpfcp-watermark.image?)

1. 模块化方面，提供模块加载方案，并兼容不同的模块规范。
2. 语法转译方面，配合 Sass、TSC、Babel 等前端工具链，完成高级语法的转译功能，同时对于静态资源也能进行处理，使之能作为一个模块正常加载。
3. 产物质量方面，在生产环境中，配合 Terser 等压缩工具进行代码压缩和混淆，通过 Tree Shaking 删除未使用的代码，提供对于低版本浏览器的语法降级处理等等。
4. 开发效率方面，构建工具本身通过各种方式来进行性能优化，包括使用原生语言 Go/Rust、no-bundle 等思路，提高项目的启动性能和热更新的速度。

### 为什么 Vite 是当前最高效的构建工具？
1. 首先是开发效率。传统构建工具普遍的缺点就是太慢了，与之相比，Vite 能将项目的启动性能提升一个量级，并且达到毫秒级的瞬间热更新效果。就拿 Webpack 来说，一般的项目使用 Webpack 之后，启动花个几分钟都是很常见的事情，热更新也经常需要等待十秒以上。这主要是因为：
- webpack、Rollup、Parcel 开发服务器都会从我们的源代码和 node_modules 文件夹中把我们的整个代码库打包在一起，通过构建过程运行这些代码，比如 Babel、TypeScript 或 PostCSS，然后将打包的代码推送到我们的浏览器上。
- Snowpack、Vite、wmr 开发服务器则不采用这种模式。相反，它们会等到浏览器找到一个 import 语句，并为模块发出 HTTP 请求，在这个请求发出后，该工具才会对请求的模块和模块导入树中的任何叶节点应用转换，然后将这些转换提供给浏览器。这大大加快了速度，因为在推送到开发服务器的过程中减少了工作。

Vite 在开发阶段基于浏览器原生 ESM 的支持实现了no-bundle 服务。另一方面，借助 Esbuild 超快的编译速度来做第三方库构建和 TS/JSX 语法编译，从而能够有效提高开发效率。

2. 除了开发效率，在其他三个维度上， Vite 也表现不俗。
- 模块化方面，Vite 基于浏览器原生 ESM 的支持实现模块加载，并且无论是开发环境还是生产环境，都可以将其他格式的产物（如 CommonJS）转换为 ESM。
- 语法转译方面，Vite 内置了对 TypeScript、JSX、Sass 等高级语法的支持，也能够加载各种各样的静态资源，如图片、Worker 等等。
- 产物质量方面，Vite 基于成熟的打包工具 Rollup 实现生产环境打包，同时可以配合 Terser、Babel 等工具链，可以极大程度保证构建产物的质量。

### ES6 Module
1. ES6 Module 也被称作 ES Module（或 ESM）， 是由 ECMAScript 官方提出的模块化规范，作为一个官方提出的规范，ES Module 已经得到了现代浏览器的内置支持。
2. 在现代浏览器中，如果在 HTML 中加入含有 `type="module"` 属性的 `script` 标签，那么浏览器会按照 ES Module 规范来进行依赖加载和模块解析，这也是 Vite 在开发阶段实现 no-bundle 的原因，由于模块加载的任务交给了浏览器，即使不打包也可以顺利运行模块代码。
3. 全球浏览器对原生 ESM 的普遍支持，目前占比 92% 以上。不仅如此，一直以 CommonJS 作为模块标准的 Node.js 也紧跟 ES Module 的发展步伐，从 12.20 版本开始正式支持原生 ES Module。也就是说，如今 ES Module 能够同时在浏览器与 Node.js 环境中执行，拥有天然的跨平台能力。

### Esbuild
![编译.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14a497fa35304917b775ff8eb38fbef3~tplv-k3u1fbpfcp-watermark.image?)

基于 Golang 开发的前端工具，具备如下能力：
- 打包器 Bundler
- 编译器 Transformer，性能极高（见上图对比测试），在 Vite 中被深度使用
- 压缩器 Minifier

## 功能简介
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

例如，以下 webpack.config.js 配置文件：
```js
export default {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.[tj]sx?$/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-typescript'],
          }
        }]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin
          .loader :
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              //开启CSS Modules
              modules: true
            }
          },
          'postcss-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: {
          process.env.NODE_ENV === 'production' ? MiniCssExtractPlugin
          .loader : 'style-loader',
          {
            loader: 'css-loader',
            options: {
              //开启CSS Modules
              modules: true
            }
          },
          'postcss-loader',
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
    new HTMLWebpackPlugin()
  ]
};
```
等价于以下 vite.config.js 配置：
```ts
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()]
});
```
### Tree-Shaking - 树摇
用于删除 Dead Code：
- 代码没有被用到，不可到达
- 代码的执行结果不会被用到
- 代码只读不写

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/88f2751692ed47d38bdedd998c47ca67~tplv-k3u1fbpfcp-watermark.image?)

CommonJS 格式不能做到 Tree Shaking，因为 `require` 的部分可能依赖运行时计算的结果（例如 `require(someVariable)`）。优化原理:
1. 基于 ESM 的 import/export 语句依赖关系，与运行时状态无关。
2. 在构建阶段将未使用到的代码进行删除。

### 依赖预打包
![pre.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7e82753acf442678042949a84cf7c7b~tplv-k3u1fbpfcp-watermark.image?)

1. 避免 node modules 过多的文件请求（请求瀑布流）。例如 `loadsh-es` 库本身是有 ES 版本产物的，可以在 Vite 中直接运行。但实际上，它在加载时会发出特别多的请求，导致页面加载的前几秒几都乎处于卡顿状态，拿一个简单的 demo 项目举例，请求情况如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0d1499fce86c44dbaff1c660f0a6c55a~tplv-k3u1fbpfcp-watermark.image?)

如果在应用代码中调用了 `debounce` 方法，这个方法会依赖很多工具函数，如下图所示：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/768f73d4c53048c092bb38a9d203802f~tplv-k3u1fbpfcp-watermark.image?)

每个 `import` 都会触发一次新的文件请求，因此在这种`依赖层级深`、`涉及模块数量多`的情况下，会触发成百上千个网络请求，巨大的请求量加上 Chrome 对同一个域名下只能同时支持 `6` 个 HTTP 并发请求的限制，导致页面加载十分缓慢，与 Vite 主导性能优势的初衷背道而驰。不过，在进行**依赖的预构建**之后，`lodash-es` 这个库的代码被打包成了一个文件，这样请求的数量会骤然减少，页面加载也快了许多。下图是进行预构建之后的请求情况：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/517d467da8d540c1b8251a8791f808d8~tplv-k3u1fbpfcp-watermark.image?)

2. 将 CommonJs 格式转换为 ESM 格式。Vite 是基于浏览器原生 ES 模块规范实现的 Dev Server，不论是应用代码，还是第三方依赖的代码，符合 ESM 规范才能够正常运行。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b377bd9539cf4fbb8a03d6104ee80a74~tplv-k3u1fbpfcp-watermark.image?)

我们没有办法控制第三方的打包规范。就目前来看，还有相当多的第三方库仍然没有 ES 版本的产物，比如 `react`：
```ts
// react 入口文件
// 只有 CommonJS 格式
if (process.env.NODE_ENV === "production") {
  module.exports = require("./cjs/react.production.min.js");
} else {
  module.exports = require("./cjs/react.development.js");
}
```
这种 CommonJS 格式的代码在 Vite 当中无法直接运行，所以需要将它转换成 ESM 格式的产物，使其在浏览器可以通过 `<script type="module"><script>` 的方式正常加载。


实现原理：
1. 服务启动前扫描代码中用到的依赖。
2. 使用 **Esbuild** 对依赖代码进行预打包（Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了近 100 倍）。
3. 改写 `import` 语句，指定依赖为预构建产物路径。

## Vite 架构
Vite 并不是简单地开发阶段使用 Esbuild，生产环境用 Rollup，下面是 Vite 架构图：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/faeeef4ab0384e7a96722675163725ad~tplv-k3u1fbpfcp-watermark.image?)

### 性能利器 - Esbuild
Vite 将 Esbuild 作为自己的性能利器，将 Esbuild 各个垂直方向的能力（Bundler、Transformer、Minifier）利用的淋漓尽致，给 Vite 的高性能提供了有力的保证。
#### 作为 Bundle 工具
首先是开发阶段的依赖预构建阶段。
1. `node_modules` 依赖的大小动辄几百 MB 甚至上 GB ，会远超项目源代码。如果这些依赖直接在 Vite 中使用，会出现一系列的问题，所以对于第三方依赖，需要在应用启动前进行打包并且转换为 ESM 格式。
2. Vite 1.x 使用了 Rollup 来进行依赖预构建，在 2.x 版本将 Rollup 换成了 Esbuild，编译速度提升了近 100 倍。
3. 但是 Esbuild 作为打包工具也有一些缺点。
- 不支持语法降级到 ES5，这意味着在低端浏览器代码会跑不起来
- 不支持 `const enum` 等语法，这意味着单独使用这些语法在 esbuild 中会直接抛错。
- 不提供操作打包产物的接口，像 Rollup 中灵活处理打包产物的能力(如 `renderChunk` 钩子)在 Esbuild 当中完全没有。
- 不支持自定义 Code Splitting 策略。传统的 Webpack 和 Rollup 都提供了自定义拆包策略的 API，而 Esbuild 并未提供，从而降低了拆包优化的灵活性。

#### 编译工具
在依赖预构建阶段，Esbuild 作为 Bundler 的角色存在。而在 TS(X)/JS(X) 单文件编译上面，Vite 也使用 Esbuild 进行语法转译，也就是将 Esbuild 作为 Transformer 来用。Esbuild 转译 TS 或者 JSX 的能力通过 Vite 插件提供，这个 Vite 插件在开发环境和生产环境都会执行，可以在架构图中 `Vite Plugin Pipeline` 部分注意到：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6667c421b4d84a8bb078f3051286f85a~tplv-k3u1fbpfcp-watermark.image?)

这部分能力 Esbuild 替换原先的 Babel 或者 TSC 的功能，因为无论是 Babel 还是 TSC 都有性能问题。当 Vite 使用 Esbuild 做单文件编译之后，提升可以说相当大了，我们以一个巨大的、50 多 MB 的纯代码文件为例，来对比 Esbuild、Babel、TSC 包括 SWC 的编译性能：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6b4a3f30d784f79a589a4afec48da6a~tplv-k3u1fbpfcp-watermark.image?)

虽然 Esbuild Transfomer 能带来巨大的性能提升，但其自身也有局限性，最大的局限性就在于 TS 中的类型检查问题。这是因为 Esbuild 并没有实现 TS 的类型系统，在编译 `TS`(或者 `TSX`) 文件时仅仅抹掉了类型相关的代码，暂时没有能力实现类型检查。所以 `vite build` 之前会先执行 `tsc` 命令，也就是借助 TS 官方的编译器进行类型检查。

要解决类型问题，可以通过使用 TS 的编辑器插件，在开发阶段就能早早把问题暴露出来并解决，不至于等到项目要打包上线的时候。

#### 压缩工具
Vite 从 2.6 版本开始，就官宣默认使用 Esbuild 来进行生产环境的代码压缩，包括 JS 代码和 CSS 代码。从架构图中可以看到，在生产环境中 Esbuild 压缩器通过插件的形式融入到了 Rollup 的打包流程中：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85146437ca1f4f8ba74ba1c159509b30~tplv-k3u1fbpfcp-watermark.image?)

传统的方式都是使用 Terser 这种 JS 开发的压缩器来实现，在 Webpack 或者 Rollup 中作为一个 Plugin 来完成代码打包后的压缩混淆的工作。但 Terser 其实很慢，主要有 2 个原因：
1. 压缩这项工作涉及大量 AST 操作，并且在传统的构建流程中，AST 在各个工具之间无法共享，比如 Terser 就无法与 Babel 共享同一个 AST，造成了很多重复解析的过程。
2. JS 本身属于解释性 + JIT（即时编译） 的语言，对于压缩这种 CPU 密集型的工作，其性能远远比不上 Golang 这种原生语言。

因此，Esbuild 这种从头到尾**共享 AST** 以及**原生语言编写**的 Minifier 在性能上能够甩开传统工具的好几十倍。可以看下面这个大型库 echarts 的压缩性能测试：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5a60e1560edb449a8b9e3de7538cf4b8~tplv-k3u1fbpfcp-watermark.image?)

压缩一个大小为 3.2 MB 的库，Terser 需要耗费 8798 ms，而 Esbuild 仅仅需要 361 ms，压缩效率较 Terser 提升了二三十倍，并且产物的体积几乎没有劣化，因此 Vite 果断将其内置为默认的压缩方案。

### 构建基石 - Rollup
Rollup 既是 Vite 用作生产环境打包的核心工具，也直接决定了 Vite 插件机制的设计。
#### 生产环境 Bundle
生产环境无法做到完全 no-bundle，因为会有网络性能问题。为了在生产环境中也能取得优秀的产物性能，Vite 默认选择在生产环境中利用 Rollup 打包，并基于 Rollup 本身成熟的打包能力进行扩展和优化，主要包含 3 个方面：
1. CSS 代码分割。如果某个异步模块中引入了一些 CSS 代码，Vite 就会自动将这些 CSS 抽取出来生成单独的文件，提高线上产物的`缓存复用率`。
2. 自动预加载。Vite 会自动为入口 chunk 的依赖自动生成预加载标签 `<link rel="modulepreload">`，这种适当预加载的做法会让浏览器提前下载好资源，优化页面性能。
```html
<head>
  <!-- 省略其它内容 -->
  <!-- 入口 chunk -->
  <script type="module" crossorigin src="/assets/index.250e0340.js"></script>
  <!--  自动预加载入口 chunk 所依赖的 chunk-->
  <link rel="modulepreload" href="/assets/vendor.293dca09.js">
</head>
```
3. 异步 Chunk 加载优化。在异步引入的 Chunk 中，通常会有一些公用的模块，如现有两个异步引入的 Chunk: `A` 和 `B`，而且两者有一个公共依赖 `C`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/78b5d4b1395a47378b79ebf2aad88308~tplv-k3u1fbpfcp-zoom-1.image)

一般情况下，Rollup 打包之后，会先请求 `A`，然后浏览器再加载 `A` 的过程中才决定请求和加载 `C`，但 Vite 进行优化之后，请求 `A` 的同时会自动预加载 `C`，通过优化 Rollup 产物依赖加载方式节省了不必要的网络开销。

#### 插件机制
![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0e44762a1dd146b1802f718e17a10fb6~tplv-k3u1fbpfcp-watermark.image?)

无论是开发阶段还是生产环境，Vite 都根植于 Rollup 的插件机制和生态。
- 开发阶段使用 `Plugin Container`，用来模拟 Rollup 调度各个 Vite 插件的执行逻辑
- 生产环境直接使用 Rollup

但不是 Rollup 的插件都可以使用到 Vite 中，插件兼容性具体可查阅 `https://vite-rollup-plugins.patak.dev/`。

### 总结
1. Esbuild 作为构建的性能利器，Vite 利用其 Bundler 的功能进行依赖预构建，用其 Transformer 的能力进行 TS 和 JSX 文件的转译，也用到它的压缩能力进行 JS 和 CSS 代码的压缩。
2. 无论是插件机制、还是底层的打包手段，都基于 Rollup 来实现，可以说 Vite 是对于 Rollup 一种场景化的深度扩展，将 Rollup 从传统的 JS 库打包场景扩展至完整 Web 应用打包。

## 使用
1. Vite 项目初始化。
```ts
#提前安装 pnpm
npm i -g pnpm
#初始化命令
pnpm create vite
#安装依赖
pnpm install
#启动项目
pnpm run dev
```
然后我们在浏览器中打开 `http://localhost:5173` 页面，你可以看到：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd1187614a5e4bd4b52b60d2e71d79d6~tplv-k3u1fbpfcp-watermark.image?)

至此，我们成功搭建起了一个 React 前端项目。怎么样？利用 Vite 来初始化一个前端项目是不是非常简单？经过初步尝试，Vite 给人的第一感觉就是简洁、轻量、快速。拿 react 官方基于 Webpack 的脚手架 `create-react-app`，也就是大家常说的 `cra` 来测试，从项目初始化到依赖安装所花的时间与 Vite 对比如下:

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ccce5656262046e9bf3a1e1ce776eb36~tplv-k3u1fbpfcp-watermark.image?)

2. 现在，项目的目录结构如下:
```
.
├── index.html
├── package.json
├── pnpm-lock.yaml
├── assets
│   └── react.svg
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tsconfig.json
└── vite.config.ts
```
在项目根目录中有一个 `index.html` 文件，这个文件十分关键，因为 Vite 默认会把项目根目录下的 `index.html` 作为入口文件。也就是说，当你访问 `http://localhost:5173` 的时候，Vite 的 Dev Server 会自动返回这个 HTML 文件的内容。我们来看看这个 HTML:
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```
可以看到这个 HTML 文件的内容非常简洁，在 `body` 标签中除了 `id="root"` 的根节点之外，还包含了一个声明了 `type="module"` 的 `script` 标签:
```html
<script type="module" src="/src/main.tsx"></script>
```
上面的 `script` 标签声明了 `type="module"`，同时 `src` 指向了`/src/main.tsx`文件，此时相当于请求了 `http://localhost:5173/src/main.tsx` 这个资源，Vite 的 Dev Server 此时会接收到这个请求，然后读取对应的文件内容，进行一定的中间处理，最后将处理的结果返回给浏览器。`main.tsx` 的内容如下:
```tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
浏览器并不识别 tsx 语法，也无法直接 `import` css 文件，上面这段代码究竟是如何被浏览器正常执行的呢？这就归功了 Vite Dev Server 所做的“中间处理”了，也就是说，在读取到 `main.tsx` 文件的内容之后，Vite 会对文件的内容进行编译，大家可以从 Chrome 的网络调试面板看到编译后的结果:

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8a8dc30c2599477991413a11eb849712~tplv-k3u1fbpfcp-watermark.image?)

这里 Vite 会将项目的源代码编译成浏览器可以识别的代码，一个 `import` 语句即代表一个 HTTP 请求，例如下面：
```ts
import App from '/src/App.tsx';
import '/src/index.css';
```
正是 Vite 的 Dev Server 来接收这些请求、进行文件转译，返回浏览器可以解析运行的代码。当浏览器解析到新的 `import` 语句，又会发出新的请求，以此类推，直到所有的资源都加载完成。所以，no-bundle 的真正含义：**利用浏览器原生 ES 模块的支持，实现开发阶段的 Dev Server，进行模块的按需加载**，而不是**先整体打包再进行加载**。相比 Webpack 这种必须打包再加载的传统构建模式，Vite 在开发阶段省略了繁琐且耗时的打包过程。

## 配置
可以通过两种方式来对 Vite 进行配置，一是通过命令行参数，例如 `vite --port=8888`，二是通过配置文件，一般情况下，大多数的配置都通过配置文件的方式来声明。支持多种配置文件类型，包括 `.js`、`.ts`、`.mjs` 三种后缀的文件，脚手架项目中的配置 `vite.config.ts` 如下：
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
```
可以看到配置文件中默认在 `plugins` 数组中配置了官方的 react 插件，来提供 React 项目编译和热更新的功能。

### 配置案例
如果页面的入口文件 `index.html` 并不在项目根目录下，而需要放到 src 目录下，如何在访问 `localhost:5173` 的时候让 Vite 自动返回 src 目录下的 `index.html` 呢？我们可以通过 `root` 参数配置项目根目录的位置:
```ts
// vite.config.ts
import { defineConfig } from 'vite'
// 引入 path 包注意两点:
// 1. 为避免类型报错，你需要通过 `pnpm i @types/node -D` 安装类型
// 2. tsconfig.node.json 中设置 `allowSyntheticDefaultImports: true`，以允许下面的 default 导入方式
import path from 'path'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // 手动指定项目根目录位置
  root: path.join(__dirname, 'src')
  plugins: [react()]
})
```
当手动指定 `root` 参数之后，Vite 会自动从这个路径下寻找 `index.html` 文件，也就是说当我直接访问 `localhost:5173` 的时候，Vite 从 src 目录下读取入口文件，这样就成功实现了刚才的需求。

### 使用 Sass/Scss & CSS Modules
1. 安装 Sass，`pnpm i sass -D`。
2. 新建文件夹 components/Header，文件 index.tsx、index.module.scss。
```
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── components
│      ├── Header
│         ├── index.module.scss
│         ├── index.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
```
- index.module.scss
```scss
.header {
  color: red;
}
```
- index.tsx
```tsx
import styles from './index.module.scss';
//使用CSS Modules模块化方案，防止className命名冲突
export function Header() {
  return <p className={styles.header}>This is Header</p>
};
```

### 使用静态资源
1. 在 Vite 的配置文件中配置一下别名，方便后续的图片引入。
```ts
import path from 'path';
// ...
{
  resolve: {
    // 别名配置
    alias: {
      '@assets': path.join(__dirname, 'src/assets')
    }
  }
}
```
这样 Vite 在遇到 `@assets` 路径的时候，会自动帮我们定位至根目录下的 `src/assets` 目录。值得注意的是，`alias` 别名配置不仅在 JavaScript 的 `import` 语句中生效，在 CSS 代码的 `@import` 和 `url` 导入语句中也同样生效。

2. 以 svg 图片为例，在 App.tsx 文件中导入一个静态资源会返回解析后的 URL，然后可以通过单花括号包裹，将其赋值给 `img` 元素的 `src` 属性。
```tsx
import { Header } from "./components/Header";
import logoUrl from './assets/react.svg';
import './App.css'
function App() {
  return (
    <div>
      <img src={logoUrl} className="logo react" alt="React logo" />
      <Header />
    </div>
  )
}
export default App;
```
3. 除了常见的图片格式，Vite 也内置了对于 JSON、Worker、WASM 资源的加载支持。例如，对于 JSON 文件的解析，底层使用 `@rollup/pluginutils` 的 `dataToEsm` 方法将 JSON 对象转换为一个包含各种具名导出的 ES 模块：
```ts
import { version } from '../../../package.json';
```
也可以在配置文件禁用按名导入的方式:
```ts
// vite.config.ts
// ...
{
  json: {
    stringify: true
  }
}
```
这样会将 JSON 的内容解析为 `export default JSON.parse("xxx")`，这样会失去`按名导出`的能力，不过在 JSON 数据量比较大的时候，可以优化解析性能。

4. 如果项目中还存在其它格式的静态资源，还可以通过 `assetsInclude` 配置让 Vite 来支持加载：
```ts
// vite.config.ts
// ...
{
  assetsInclude: ['.gltf']
}
```
5. Vite 中引入静态资源时，也支持在路径最后加上一些特殊的 query 后缀，包括:
- `?url`：表示获取资源的路径，这在只想获取文件路径而不是内容的场景将会很有用。
- `?raw`：表示获取资源的字符串内容，如果你只想拿到资源的原始内容，可以使用这个后缀。
- `?inline`：表示资源强制内联，而不是打包成单独的文件。
- `?worker`：加载为 Web Worker。
- `?worker&inline`：在构建时 Web Worker 内联为 base64 字符串。

## 生产环境构建
在开发阶段 Vite 通过 Dev Server 实现了不打包的特性，而在生产环境中，Vite 依然会基于 Rollup 进行打包，并采取一系列的打包优化手段。在脚手架项目的 `package.json` 中：
```json
"scripts": {
  // 开发阶段启动 Vite Dev Server
  "dev": "vite",
  // 生产环境打包
  "build": "tsc && vite build",
  // 生产环境打包完预览产物
  "preview": "vite preview"
},
```
其中的 `build` 命令就是 Vite 专门用来进行生产环境打包的。为什么在 `vite build` 命令执行之前要先执行 `tsc` 呢？

`tsc` 作为 TypeScript 的官方编译命令，可以用来编译 TypeScript 代码并进行类型检查，而这里的作用主要是用来做类型检查（Esbuild 不支持类型检查），我们可以从项目的 `tsconfig.json` 中看到配置：
```json
{
  "compilerOptions": {
    // 省略其他配置
    // 1. noEmit 表示只做类型检查，而不会输出产物文件
    // 2. 这行配置与 tsc --noEmit 命令等效
    "noEmit": true,
  },
}
```
虽然 Vite 提供了开箱即用的 TypeScript 以及 JSX 的编译能力，但实际上底层并没有实现 TypeScript 的类型校验系统，因此需要借助 `tsc` 来完成类型校验（在 Vue 项目中使用 `vue-tsc` 这个工具来完成），在打包前提早暴露出类型相关的问题，保证代码的健壮性。

执行一下 `pnpm run build`：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb974de412624f328a92271d467a4e0c~tplv-k3u1fbpfcp-watermark.image?)

此时 Vite 就生成了最终的打包产物，我们可以通过 `pnpm run preview` 命令预览一下打包产物的执行效果。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/80572af9e6b34ebdae20dc3a223c4b36~tplv-k3u1fbpfcp-watermark.image?)

在浏览器中打开 `http://localhost:4173` 地址，将看到和开发阶段一样的页面内容，证明我们成功完成了 Vite 项目的生产环境构建。