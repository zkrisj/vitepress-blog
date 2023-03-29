---
date: 15:29 2023/3/29
title: Webpack 知识体系简单总结 ｜ 青训营笔记
tags:
- Webpack
description: 关于 Webpack 的使用方法，基本都围绕配置展开，而这些配置大致可划分为两类：流程类: 作用于流程中某个或若干个环节直接影响打包效果的配置项；工具类: 主流程之外，提供更多工程化能力的配置项。
---
## Webpack 介绍
一个前端项目是由 CSS 样式文件、图片文件、JS 文件、Vue 文件、TS 文件、JSX 文件等部分组成。我们可以手动管理这些资源：
- 如果资源文件过多，手工操作流程繁琐。
- 当文件之间有依赖关系时，必须严格按依赖顺序书写。
- 开发与生产环境需要一致，难以接入 JS 和 TS 的新特性。
- 比较难接入 Less、Sass 等。
- JS、图片、CSS 资源管理模型不一致。

2009年诞生的 Node.js 和2010年诞生的 npm 将前端项目带入了工程化，而 Node.js 的 CommonJS 模块化规范不兼容浏览器。所以相继出现了一些打包工具，比如 Browserify、Gulp、RequireJS、Rollup、Webpack 等。

Webpack 本质上是一种前端资源编译、打包工具。
- 多份资源文件打包成一个 Bundle，减少 http 请求数
- 支持 Babel、Eslint、TS、CoffeScript、Less、Sass
- 支持模块化处理 CSS、图片等资源文件
- 统一图片、CSS、字体等其它资源的处理模型
- 支持 HMR + 开发服务器
- 支持持续监听、持续构建
- 支持代码分离支持 Tree-shaking
- 支持 SourceMap

![编译.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6336240a642499aaf859b169bb09b8a~tplv-k3u1fbpfcp-watermark.image?)

核心流程：
1. 入口处理：编译入口，webpack 编译的起点，从 `entry` 文件开始，启动编译流程。
2. 依赖解析：从 `entry` 文件开始，根据 `require` 或 `import` 等语句找到依赖资源。
3. 资源解析：根据 `module` 配置项，调用资源转移器，将图片、CSS 等非标准 JS 资源转译为 JS 内容。webpack 内部所有资源都会以 module 对象形式存在，所有关于资源的操作、转译、合并都是以 module 为基本单位进行的。
4. 资源合并打包：将转译后的资源内容合并打包为可直接在浏览器运行的 JS 文件。

其中，2、3 步骤会递归调用，直到所有资源处理完毕。

## 使用
关于 Webpack 的使用方法，基本都围绕配置展开，而这些配置大致可划分为两类：
- 流程类: 作用于流程中某个或若干个环节直接影响打包效果的配置项。
    - 输入: entry、context
    - 模块解析: resolve、externals
    - 模块转译: module
    - 后处理: optimization、mode、target
    - 输出：output
- 工具类: 主流程之外，提供更多工程化能力的配置项。
    - 开发效率类：watch、devtool、devServer
    - 性能优化类：cache、performance
    - 日志类：stats、infrastructureLogging

1. 首先，`npm i -D webpack webpack-cli` 安装。
2. 定义入口和产物出口。
```js
const path = require("path");
module.exports = {
  entry: "./src/index",
  output: {
    filename:"[name].js",
    path: path.join(__dirname,"./dist"),
  },
}
```
3. 安装 loader 处理 CSS，`npm add -D css-loader style-loader`。
- webpack.config.js
```js
const path = require("path");
module.exports = {
  entry:"./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  module: {
    // css 处理器
    rules: [{
      test: /\.css/i,
      use: [
        "style-loader",
        "css-loader",
      ]
    }],
  },
};
```
- index.js
```js
const styles = require('./index.css');
// or
import styles from './index.css';
```
4. 安装 loader 接入 Babel，`npm i -D @babel/core ababel/preset-env babel-loader`。
- webpack.config.js
```js
const path = require("path");
module.exports = {
  entry:"./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  module: {
    // Babel 处理器
    rules: [{
      test: /\.js?$/,
      use: [{
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env']
          ]
        }
      }, ]
    }],
  },
};
```
- index.js
```js
class Person {
  constructor() {
    this.name = 'Tecvan';
  }
}
console.log((new Person()).name);
const say = () => {};
```
5. 生成 HTML 需要使用的是插件，`npm i -D html-webpack-plugin`。
- webpack.config.js
```js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry:"./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  plugins: [new HtmlWebpackplugin()]
};
```
- index.html
```html
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<script defer src="main.js"></script>
</head>
<body>
</body>
</html>
```
6. Hot Module Replacement（HMR） - 模块热替换。

![HMR.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ac072be608b045318343a4f07009546c~tplv-k3u1fbpfcp-watermark.image?)

![HMR.gif](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/226287246b844dc99c0ded2ea42c5b81~tplv-k3u1fbpfcp-watermark.image?)

- webpack.config.js
```js
const path = require("path");
module.exports = {
  // ...
  watch: true,
  devServer: {
    hot: true,
    open: true
  }
};
```
- 命令需要带 serve：npx webpack serve。

7. Tree-Shaking -树摇，用于删除 Dead Code：
- 代码没有被用到，不可到达
- 代码的执行结果不会被用到
- 代码只读不写

![Tree-Shaking.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/86b544d8cd254503b95d5e660deba21b~tplv-k3u1fbpfcp-watermark.image?)

- webpack.config.js
```js
const path = require("path");
module.exports = {
  // ...
  mode: "production",
  optimization: {
    usedExports: true,
  }
};
```
对工具类库如 Lodash 有奇效。

## Loader
为了处理非标准 JS 资源，设计出资源翻译模块 Loader，最核心的只能是实现内容转换器 —— 将各式各样的资源转化为标准 JavaScript 内容格式，例如：
- less-loader: 实现 less => css 的转换，输出 css 内容，无法被直接应用在 Webpack 体系下。
- css-loader：将 css 转换为 `__WEBPACK_DEFAULT_EXPORT__ = ".a { xxx }"` 格式。
- style-loader：将 css 模块包进 `require` 语句，并在运行时调用 `iniectStyle` 等函数将内容注入到页面的 `link`，`style` 标签，并挂载到 html 中，让 css 代码能够正确运行在浏览器上。
- html-loader：将 html 转换为 `__WEBPACK_DEFAULT_EXPORT__ = "<!DOCTYPE html"` 格式。
- vue-loader：更复杂一些，会将 `.vue` 文件转化为多个 JavaScript 函数，分别对应 template、js、css、custom block。

![less.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5cee27ccb88e4a0a86172bc96e37828e~tplv-k3u1fbpfcp-watermark.image?)

- webpack.config.js
```js
const path = require("path");
module.exports = {
  entry:"./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  module: {
    // css 处理器
    rules: [{
      test: /\.less/i,
      use: [
        "style-loader",
        "css-loader",
        "less-loader",
      ]
    }],
  },
};
```
- index.js
```js
import styles from './a.less';
```
### 如何编写 loader
Loader 通常是一个函数，结构如下：
```js
module.exports = function(source, sourceMap?, data?) {
  // source 为 loader 的输入，可能是文件内容，也可能是上一个 loader 处理结果
  return source;
};
```
Loader 函数接收三个参数，分别为：
- `source`：资源输入，对于第一个执行的 loader 为资源文件的内容；后续执行的 loader 则为前一个 loader 的执行结果。
- `sourceMap`: 可选参数，代码的 sourcemap 结构。
- `data`: 可选参数，其它需要在 Loader 链中传递的信息，比如 posthtml/posthtml-loader 就会通过这个参数传递参数的 AST 对象。

其中 `source` 是最重要的参数，大多数 Loader 要做的事情就是将 `source` 转译为另一种形式的 `output` ，比如 webpack-contrib/raw-loader 的核心源码：
```js
//... 
export default function rawLoader(source) {
  // ...
  const json = JSON.stringify(source)
    .replace(/\u2028/g, '\u2028')
    .replace(/\u2029/g, '\u2029');
  const esModule =
    typeof options.esModule !== 'undefined' ? options.esModule : true;
  return `${esModule ? 'export default' : 'module.exports ='} ${json};`;
}
```
这段代码的作用是将文本内容包裹成 JavaScript 模块，例如：
```
// source
I am Tecvan
// output
module.exports = "I am Tecvan"
```
经过模块化包装之后，这段文本内容转身变成 Webpack 可以处理的资源模块，其它 module 也就能引用、使用它了。

上例通过 `return` 语句返回处理结果，除此之外 Loader 还可以以 `callback` 方式返回更多信息，供下游 Loader 或者 Webpack 本身使用，例如在 webpack-contrib/eslint-loader 中：
```
export default function loader(content, map) {
  // ...
  linter.printOutput(linter.lint(content));
  this.callback(null, content, map);
}
```
通过 `this.callback(null, content, map)` 语句同时返回转译后的内容与 sourcemap 内容。`callback` 的完整签名如下：
```ts
this.callback(
  // 异常信息，Loader 正常运行时传递 null 值即可
  err: Error | null,
  // 转译结果
  content: string | Buffer,
  // 源码的 sourcemap 信息
  sourceMap ? : SourceMap,
  // 任意需要在 Loader 间传递的值
  // 经常用来传递 ast 对象，避免重复解析
  data ? : any
);
```

## 插件
前端社区里很多有名的框架都各自有一套插件架构，例如 axios、quill、vscode、webpack、vue、rollup 等等。插件架构灵活性高，扩展性强，但是通常需要非常强的架构能力，需要至少解决三个方面的问题：
- 接口：需要提供一套逻辑接入方法，让开发者能够将逻辑在特定时机插入特定位置
- 输入：如何将上下文信息高效传导给插件
- 输出：插件内部通过何种方式影响整套运行体系

针对这些问题，webpack 为开发者提供了基于 tapable 钩子的插件方案：
1. 编译过程的特定节点以钩子形式，通知插件此刻正在发生什么事情；
2. 通过 tapable 提供的回调机制，以参数方式传递上下文信息；
3. 在上下文参数对象中附带了很多存在 side effect 的交互接口，插件可以通过这些接口改变

### 与 Loader 区别
都是 Webpack 的扩展机制。
- Loader 是一个函数，负责代码的转换、编译。在 webpack 读取模块内容之后，生成 AST 语法树之前进行。操作的是文件，比如将 A.scss 转换为 A.css，是单纯的文件转换过程。
- 插件是一个类，利用 webpack 提供的 hooks，当什么时，执行什么。可以在 webpack 整个打包过程中进行。功能更强，能够在各个对象的钩子中插入特化处理逻辑，它可以覆盖 Webpack 全生命流程，能力、灵活性、复杂度都会比 Loader 强很多。甚至，Webpack 本身的很多功能也是基于插件实现的。不直接操作文件，而是基于事件机制工作，会监听 webpack 打包过程中的某些事件钩子，执行任务。通过 plugin 可以访问 compliler 和 compilation 过程，通过钩子拦截 webpack 的执行。

- 使用 html-webpack-plugin + DefinePlugin
```js
const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry:"./src/index",
  output: {
    filename: "[name].js",
    path: path.join(__dirname, "./dist"),
  },
  plugins: [
    new HtmlWebpackplugin(),
    new webpack.DefinePlugin({
      PRODUCTION: JSON.stringify(true),
      VERSION: JSON.stringify('5fa3b9')
    }
  ]
};
```
### 如何编写插件
1. Webpack 的插件体系是一种基于 Tapable 实现的强耦合架构。
2. 它在特定时机触发钩子时会附带上足够的上下文信息，插件定义的钩子回调中，能也只能与这些上下文背后的数据结构、接口交互产生 side effect（副作用），进而影响到编译状态和后续流程。

从形态上看，插件通常是一个带有 `apply` 函数的类：
```
class SomePlugin {
  apply(compiler) {}
}
```
Webpack 会在启动后按照注册的顺序逐次调用插件对象的 `apply` 函数，同时传入编译器对象 `compiler` ，插件开发者可以以此为起点触达到 webpack 内部定义的任意钩子，例如：
```
class SomePlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap('SomePlugin', (compilation, params) => {
    })
  }
}
```
- `thisCompilation` 为 tapable 仓库提供的钩子对象。
- `tap` 为订阅函数，用于注册回调。
- `compilation`、`params` 参数是 webpack 传递给插件的上下文信息，也是插件能拿到的输入。不同钩子会传递不同的上下文对象，这一点在钩子被创建的时候就定下来了。

![钩子.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/af15b326966d4041a92e5fa1c8a4a405~tplv-k3u1fbpfcp-watermark.image?)

钩子的核心信息：
- 时机: 编译过程的特定节点，Webpack 会以钩子形式通知插件此刻正在发生什么事情。
- 上下文: 通过 tapable 提供的回调机制，以参数方式传递上下文信息。
- 交互: 在上下文参数对象中附带了很多存在副作用的交互接口，插件可以通过这些接口改变。

```js
class EntryPlugin {
  apply(compiler) {
    compiler.hooks.compilation.tap(
      "Entryplugin",
      (compilation, { normalModuleFactory }) => {
        compilation.dependencyFactories.set(
          EntryDependency,
          normalModuleFactory
        );
      }
    );
    compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
      const { entry, options, context } = this;
      const dep = EntryPlugin.createDependency(entry, options);
      compilation.addEntry(context, dep, options, (err) => {
        callback(err);
      });
    });
  }
}
```
- 时机：`compier.hooks.compilation`。
- 参数：`compilation`、`callback` 等。
- 交互：`dependencyFactories.set`。