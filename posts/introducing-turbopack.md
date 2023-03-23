---
date: 20:37 2023/3/23
title: 比 Webpack 快 700 倍、比 Vite 快 10 倍的打包器 Turbopack
tags:
- 工具
description: Webpack 将在 Next.js 中保持足够长的活跃时间，但同时其团队还将继续改进 Turbopack，从而实现最终在 Next.js 中完全取代 Webpack。
---
## 介绍
Vercel 是由 Guillermo Rauch 创立的云服务公司，前身为 Zeit，有 Next.js、Node.js 的 websocket 框架 socket.io 和 MongoDB 客户端 mongoose 等知名开源项目为大众所知。Next.js 为了实现后端渲染，重度使用了 JS 生态中的打包构建工具 webpack。

昨天，Vercel 的团队宣布推出了 Next.js 13，该版本的一些亮点更新内容包括：
- [**Directory (beta)：**](https://nextjs.org/blog/next-13#app-directory-beta)更简单、更快、更少的客户端 JS。
    - [**Layouts**](https://nextjs.org/blog/next-13#layouts)
    - [**React Server Components**](https://nextjs.org/blog/next-13#server-components)
    - [**Streaming**](https://nextjs.org/blog/next-13#streaming)
- **[Turbopack (alpha)：](https://nextjs.org/blog/next-13#introducing-turbopack-alpha)** 速度提高 700 倍的基于 Rust 的 Webpack 替代品。
- **[新的 `next/image` (stable)：](https://nextjs.org/blog/next-13#nextimage)** native browser 延迟加载速度更快。
- **[新的 `@next/font` (beta)：](https://nextjs.org/blog/next-13#nextfont)** 具有零布局偏移的自动自托管字体。
- **[改进 `next/link`：](https://nextjs.org/blog/next-13#breaking-changes)** Simplified API with automatic `<a>`。

**更新：**
```
npm i next@latest react@latest react-dom@latest eslint-config-next@latest
```

## **[Directory (beta)](https://nextjs.org/blog/next-13#app-directory-beta)**
通过引入 app/directory 来改进 Next.js 中的路由和布局，这是之前为征求社区反馈而发布的 [Layouts RFC 的结果。](https://nextjs.org/blog/layouts-rfc)包括对以下内容的支持：
- **[Layouts：](https://nextjs.org/blog/next-13#layouts)** 轻松共享 UI，同时保留状态并避免重新渲染。
- **[Server Components：](https://nextjs.org/blog/next-13#server-components)** 使服务器优先成为大多数动态应用程序的默认设置。
- **[Streaming：](https://nextjs.org/blog/next-13#streaming)** 显示即时加载状态并流式传输更新。
- **[Suspense for Data Fetching：](https://nextjs.org/blog/next-13#data-fetching)** 新的 `use` hook 支持 component-level fetching。

该 app/directory 可以与现有 pages directory 共存以进行 incremental adoption。公告指出，虽然在升级到 Next.js 13 时**不需要使用该 app/directory，但其正在为构建复杂的 interfaces 奠定基础，同时减少 JavaScript 的数量。**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/147146d2e5c84115860e326d9be02cbf~tplv-k3u1fbpfcp-zoom-1.image)

## **[引入 Turbopack (alpha)](https://nextjs.org/blog/next-13#introducing-turbopack-alpha)**
Next.js 13 中包含 [Turbopack](https://vercel.com/blog/turbopack) —— Webpack 的新的基于 Rust 的继任者，针对 JavaScript 和 TypeScript 优化的增量打包器。

“Webpack 已被下载超过 **30 亿次**。虽然它是构建 Web 不可或缺的一部分，但我们已经达到了基于 JavaScript 的工具所能达到的最大性能的极限。在 Next.js 12 中，我们开始过渡到 native Rust 驱动的工具。我们首先从 Babel 迁移，这导致转译速度提高了 17 倍。然后，我们替换了 Terser，这使得 minification 提高了 6 倍。现在是时候全身心投入到原生的打包工作中去了。”

将 Turbopack (alpha) 与 Next.js 13 一起使用可以：
- 更新速度比 Webpack **快 700 倍**
- 更新速度比 Vite **快 10 倍**
- cold starts（冷启动）速度比 Webpack **快 4 倍**

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a193912ac2fc485086c0ea6324de9e5d~tplv-k3u1fbpfcp-zoom-1.image) 

根据介绍，Turbopack 只打包开发中所需要的最小资产，所以启动时间非常快。在一个有 3000 个模块的应用程序中，Turbopack 的启动时间为 1.8 秒。Vite 需要 11.4 秒，Webpack 需要 16.5 秒。

Turbopack 对服务器组件、TypeScript、JSX、CSS 等提供了开箱即用的支持。不过在 Alpha 版期间，[许多功能](https://turbo.build/pack/docs/features)尚不受支持。

> **注意：** Next.js 中的 Turbopack 目前仅支持 `next dev`，可查看[支持的功能](https://turbo.build/pack/docs/features)。开发团队还在努力通过 Turbopack 添加 `next build` 支持。未来我们将发布独立的 CLI、插件 API，并支持其他框架，如 Svelte 和 Vue。

可在 Next.js 13 中通过 `next dev --turbo` 试用 Turbopack (alpha)。

## 打包与原生 ESM
像 Vite 这样的框架使用了一种技术，它们不会在开发模式下打包应用程序源代码。相反，它们依赖于浏览器的原生 ES Modules 系统。这种方法会导致令人难以置信的响应更新，因为它们只需要转换单个文件。

但是，Vite 可能会遇到由许多模块组成的大型应用程序的扩展问题。浏览器中的大量级联网络请求会导致启动时间相对较慢。对于浏览器来说，如果它可以在尽可能少的网络请求中接收到它需要的代码——即使是在本地服务器上，它会更快。

这就是为什么我们决定像 Webpack 一样，希望 Turbopack 将代码打包在开发服务器中。Turbopack 可以更快地完成它，尤其是对于大型应用程序，因为它是用 Rust 编写的，并且跳过了仅在生产环境中需要的优化工作。

## 增量计算
我们的团队吸取了 Webpack 10 年的经验教训，结合了[Turborepo](https://turbo.build/repo) 和 Google 的 Bazel 在增量计算方面的创新，并创建了一个可以支持未来几十年计算的架构。

有两种方法可以加快进程：减少工作量或并行工作。我们知道，如果我们想让最快的打包器成为可能，我们需要用力拉动两个杠杆。

我们决定为分布式和增量行为创建一个可重用的 Turbo 构建引擎。Turbo 引擎就像函数调用的调度程序一样工作，允许在所有可用内核上并行调用函数。

Turbo 引擎还缓存它调度的所有函数的结果，这意味着它永远不需要两次执行相同的工作。简而言之，**它以最大速度做最少的工作**。

### Vite 和 esbuild
其他工具对“做更少的工作”采取不同的态度。Vite 通过在开发模式下使用 Native ESM 将工作量降至最低。出于上述原因，我们决定不采用这种方法。

在底层，Vite 将 esbuild 用于许多任务。esbuild 是一个打包器 - 一个非常快的。它不会强迫您使用本机 ESM。但出于几个原因，我们决定不采用 esbuild。

esbuild 的代码针对一项任务进行了超优化 - 快速打包。它没有 HMR，我们不想从我们的开发服务器中丢失它。

esbuild 是一个非常快速的打包工具，但它并没有做太多的缓存。这意味着你最终*会*一次又一次地做同样的工作，即使这项工作是以本机的速度进行的。

[Evan Wallace 将 esbuild 称为下一代打包器的概念验证](https://news.ycombinator.com/item?id=22336334)。我们认为他是对的。我们认为**具有增量计算的 Rust 驱动**的打包器在更大的规模上可以比 esbuild 更好地执行。

## 懒惰打包
Next.js 的早期版本试图在开发模式下打包 **整个Web 应用程序**。我们很快意识到这种“急切”的方法并不是最优的。Next.js 的现代版本仅打包开发服务器请求的页面。例如，如果您转到 `localhost:3000`，它将仅打包 `pages/index.jsx`，以及它导入的模块。

这种更“懒惰”的方法（仅在绝对必要时打包资产）是快速开发服务器的关键。本机 ESM 无需太多魔法即可处理此问题 - 您请求一个模块，该模块又请求其他模块。但是，出于上述原因，我们想构建一个打包器。

esbuild 没有“惰性”打包的概念——除非您专门针对某些入口点，否则它是全有或全无的。

Turbopack 的开发模式会根据收到的请求构建应用程序导入和导出的最小图，并且仅打包必要的最少代码。[在核心概念文档](https://turbo.build/pack/docs/core-concepts)中了解更多信息。

这种策略使 Turbopack 在第一次启动开发服务器时变得非常快。我们只计算渲染页面所需的代码，然后将其以单个块的形式发送到浏览器。在大规模情况下，这最终比原生 ESM 快得多。

我们想要：
- 构建一个打包器。在处理大型应用程序时，打包程序的性能优于本机 ESM。
- 使用增量计算。Turbo 引擎将这一点带入 Turbopack 架构的核心——最大化速度并最小化完成的工作。
- 优化我们的开发服务器的启动时间。为此，我们构建了一个惰性资产图来仅计算请求的资产。

这就是我们选择构建 Turbopack 的原因。更多详情可[查看官方公告](https://nextjs.org/blog/next-13)。

---
$${\color{orange}值得一提的是，\color{lime}Turbopack \space 还是出自 \space Webpack \space 作者 \space Tobias Koppers \space 之手。}$$Tobias Koppers 于 2021 年 4 月加入 Vercel，参与了 Turbopack 的开发。

关于 Turbopack 的由来，Vercel 首席执行官 Guillermo Rauch [透露](https://devclass.com/2022/10/25/webpack-founder-debuts-rust-based-turbopack-that-is-700x-faster/)，Next.js 早在 2016 年就开始使用 Webpack 作为一个组件。“我们可能是 Webpack 的最大用户。我们开始和作者聊了很多，因为当时我们有像沃尔玛这样的客户，有超过 250 名工程师在 Next.js 代码库上工作，分享关于编译过程的反馈。我们意识到 JavaScript 和 TypeScript 代码的数量增长如此之快，以至于超出了基于 JavaScript 的工具和架构的能力。Tobias 从未想过该工具会得到如此广泛的采用。”

另一个因素是 Webpack 面向单页应用程序 (SPA) 的方向。“[2016 年] 每个人都在构建单页应用程序。我们对市场说不，我们将进行服务器渲染并编排由多个入口点组成的复杂应用程序，因此我们开始改变 Webpack 的默认设置。Webpack 非常单一且面向 SPA。”

当 Tobias 加入 Vercel 时，“他带来了 10 年的专业知识，见证了这件事情的发展。但他意识到架构和运行时的所有缺陷。因此，Tobias 成为了 Rust 专家。”

此外，Vercel 首席技术官 Malte Ubl 还表示，**Turbopack 旨在成为 Webpack 的直接替代品，Next.js 则是它的第一个客户。** “随着时间的推移，我们计划针对所有开发者用例继续迭代和改进 Turbopack。它是开源的，我们期待看到社区如何参与该工具的早期阶段。”

在被问及如何看待 Webpack 的未来，以及是否预计在更广泛的网络社区中，大量的 Webpack 使用会迁移到 Turbopack 这一问题时？

Tobias 的回答是，“现在是整个网络生态系统的编译器基础架构的一个新起点。Webpack 已被下载超过 30 亿次。它已成为 Web 构建不可或缺的一部分。但就像 Babel 和 Terser 一样，现在是 all-in on native 的时候了。我加入了 Vercel，组建了一个团队来构建网络的下一代 bundler。”

他还补充称，预计 Webpack 不会很快从 Next.js 中消失。向后兼容性是 Next.js 不可或缺的一部分，他们将关心所有使用自定义插件的 Next.js 用户。Webpack 将在 Next.js 中保持足够长的活跃时间，但同时其团队还将继续改进 Turbopack，从而实现最终在 Next.js 中完全取代 Webpack。