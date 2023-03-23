---
date: 17:43 2023/3/23
title: 2022 JavaScript 年度报告（翻译）
tags:
- JS
description: 随着 Web 平台的成熟，我们希望看到更多地直接采用它的各种 API 和功能，因为这样做是有意义的。
---
## 介绍
JavaScript 是一股强大的力量，它在网络上提供了最大份额的交互性。它将行为从简单推向复杂，并使网络上的事情比以往任何时候都多。

然而，增加使用 JavaScript 来提供丰富的用户体验是有代价的。从下载、解析和编译 JavaScript 的那一刻起，到它执行的每一行代码，浏览器必须协调各种工作以使一切成为可能。对 JavaScript 做得太少意味着您可能无法实现用户体验和业务目标。另一方面，在 JavaScript 上做得过多意味着您将创建加载缓慢、响应迟缓以及让用户感到沮丧的用户体验。

今年，我们将再次关注 JavaScript 在 Web 中的作用，展示我们对 2022 年的发现，并为创造令人愉悦的用户体验提供建议。

## 我们加载了多少 JavaScript？
首先，我们将评估 JavaScript Web 开发人员在 Web 上发布的数量。毕竟，在进行改进之前，必须对当前情况进行评估。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/740d20c3f01f4f2eb761abad1807a86a~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页加载的 JavaScript 字节量的分布。</p>

---
与去年一样，今年标志着向浏览器发送的 JavaScript 数量又一次增加。从 2021 年到 2022 年，移动设备增长了 8%，而桌面设备增长了 10%。虽然这种增长没有前几年那么陡峭，但它仍然是一个令人担忧的趋势的延续。虽然设备功能不断改进，但并不是每个人都在运行最新的设备。事实仍然是，更多的 JavaScript 等于对设备资源造成更大的压力。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cb6fbd825a604ac998422d5a3988e955~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>未使用的 JavaScript 字节量的分布。</p>

---
根据 Lighthouse 的说法，移动页面的中位数加载了 162 KB 的未使用 JavaScript。在第 90 个百分位，604 KB 的 JavaScript 未被使用。这比去年略有上升，去年未使用 JavaScript 的中位数和 90% 分别为 155 KB 和 598 KB。所有这些都代表了大量未使用的 JavaScript，尤其是当您考虑到此分析跟踪 JavaScript 资源的传输大小时，如果压缩，则意味着已使用 JavaScript 的解压缩部分可能比图表显示的要大得多。

与中位数的移动页面加载的总字节数相比，未使用的 JavaScript 占所有加载脚本的 35%。这比去年的 36% 略有下降，但仍然有很大一部分已加载但未使用。这表明许多页面正在加载可能不会在当前页面上使用的脚本，或者由页面生命周期后期的交互触发，并且可能受益于动态 import() 以降低启动成本。

## 每页的 JavaScript 请求数
页面上的每个资源都会启动至少一个请求，如果一个资源对更多资源发出额外请求，则可能会启动更多。

就脚本请求而言，请求越多，您不仅会加载更多 JavaScript，而且还会增加脚本资源之间的争用，这可能会导致主线程陷入困境，从而导致启动速度变慢。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f72de41588748dab0cf7cd0c7ab2dc8~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页 JavaScript 请求数的分布。</p>

---
2022 年，移动页面的中位数响应了 21 个 JavaScript 请求，而在第 90 个百分位，有 60 个。与去年相比，中位数的请求增加了 1 个，第 90 个百分位的请求增加了 4 个。

就 2022 年的桌面设备而言，中位数有 22 个 JavaScript 请求，第 90 个百分位有 63 个。与去年相比，中位数增加了 1 个 JavaScript 请求，90% 增加了 4 个——与移动设备的增长相同。

虽然请求数量没有大幅增加，但它确实延续了自 2019 年 Web Almanac 推出以来请求逐年增加的趋势。

## JavaScript是如何处理的？
自从 Node.js 等 JavaScript 运行时出现以来，依赖构建工具来打包和转换 JavaScript 变得越来越普遍。不可否认，这些工具很有用，但会影响 JavaScript 的发布量。
### 打包器
JavaScript 打包器是构建时工具，用于处理项目的 JavaScript 源代码，然后对其进行转换和优化。输出是生产就绪的 JavaScript。以下面的代码为例：
```js
function sum (a, b) {
  return a + b;
}
```
打包器会将此代码转换为更小但更优化的等效代码，从而减少浏览器下载时间：
```js
function n(n,r){return n+r}
```
鉴于打包器执行的优化，它们是优化源代码以在生产环境中获得更好性能的关键部分。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50ac441ad4c143dea192af364c725204~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>按网站排名使用 webpack 打包 JavaScript 的页面。</p>

---

在 1,000 个最受欢迎的网站中，17% 使用 webpack 作为打包工具。这是有道理的，因为 HTTP 存档爬取的许多热门页面很可能是使用 webpack 打包和优化源代码的知名电子商务网站。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b664521003f14d53bf14838435ac7510~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>按网站排名使用 Parcel 打包 JavaScript 的页面。</p>

---
Parcel 是 webpack 的一个值得注意的替代品，它的采用意义重大。Parcel 在所有网站排名中的采用率都是一致的，占网站排名的 1.2% 到 1.9%。

虽然 HTTP Archive 无法跟踪生态系统中所有打包器的使用情况，但打包器的使用在 JavaScript 的整体图景中非常重要，因为它们不仅对开发人员体验很重要，而且它们可以以依赖的形式贡献的开销管理代码可能是 JavaScript 发布量的一个因素。值得检查您的整体项目设置是如何配置的，以便为您的用户使用的浏览器生成最有效的输出。

### 编译器
编译器通常在构建时用于工具链中，以将较新的 JavaScript 功能转换为可在旧浏览器中运行的语法。由于 JavaScript 多年来发展迅速，这些工具仍在使用中。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dc38be667c334699b882232018b16816~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>按网站排名使用 Babel 的页面。</p>

---
考虑到这些年来 JavaScript 的发展程度，这些结果并不令人惊讶。为了保持对特定浏览器的广泛兼容性，Babel 使用转换来输出兼容的 JavaScript 代码。

转换通常比未转换的对应对象大。当转换在代码库中广泛或重复时，可能会向用户发送可能不必要甚至未使用的 JavaScript。这会对性能产生不利影响。

考虑到即使网站排名前 100 万的页面中有 26% 正在使用 Babel 转换他们的 JavaScript 源代码，假设其中一些体验可能正在运送他们不需要的转换并不是不合理的。如果您在项目中使用 Babel，请仔细查看 Babel 的可用配置选项和插件，以寻找优化其输出的机会。

由于 Babel 还依赖 Browserslist 来确定是否需要将某些功能转换为旧语法，因此请务必检查您的浏览器列表配置，以确保您的代码被转换为在用户实际使用的浏览器中工作。

## JavaScript 是如何被请求的？
请求 JavaScript 的方式也可能对性能产生影响。您可以通过多种最佳方式请求 JavaScript，但在某些情况下，这种方式远没有那么理想。在这里，我们将看到 Web 是如何整体交付 JavaScript 的，以及它如何与性能预期保持一致。

### async、defer、module 和 nomodule
`<script>` 元素上的 async 和 defer 属性控制脚本加载方式的行为。async 属性将防止脚本阻塞解析，但会在下载后立即执行，因此仍可能会阻塞渲染。defer 属性将延迟脚本的执行，直到 DOM 准备好，因此可以防止脚本阻塞解析和渲染。

type="module" 和 nomodule 属性表明脚本中是否有 ES6 模块。使用 type="module" 时，表示这些脚本的内容将包含 ES6 模块，并将延迟这些脚本的执行（与 defer 相同），直到默认构建 DOM。相反的，设置 nomodule 属性来标明这个脚本在支持 ES2015 modules 的浏览器中忽略，这可以在使用模块脚本的同时为不支持的浏览器提供无模块的后备脚本。

| 特征            | 桌面  | 移动 |
| --------------- | --- | --- |
| `async`         | 76% | 76% |
| `defer`         | 42% | 42% |
| `async`和`defer`| 28% | 29% |
| `module`        | 4%  | 4%  |
| `nomodule`      | 0%  | 0%  |

<p align=center>script 元素上使用 async、defer、type="module" 和 nomodule 属性的页面百分比。</p>

---
令人鼓舞的是，76% 的移动页面使用了 async。但是，defer 如此低的使用率表明仍有提高渲染性能的机会。

正如去年所指出的，同时使用 async 和 defer 是一种应该避免的反模式，因为 async 具有优先权 并将使 defer 属性被忽略。

type="module" 和 nomodule 的普遍缺失并不奇怪，因为似乎很少有页面提供 JavaScript 模块。随着时间的推移，type="module" 的使用可能会增加，因为开发人员会将未转换的 JavaScript 模块发送到浏览器。

查看所有站点的总体脚本百分比，可以看到略有不同的情况：

| 特征             | 桌面   | 移动 |
| --------------- | ----- | ----- |
| `async`         | 49.3% | 47.2% |
| `defer`         | 8.8%  | 9.1%  |
| `async`和`defer`| 3.0%  | 3.1%  |
| `module`        | 0.4%  | 0.4%  |
| `nomodule`      | 0%    | 0%    |

<p align=center>script 元素上使用 async、defer、type="module" 和 nomodule 属性的脚本的百分比。</p>

---
我们看到 async 和 defer 在这里的使用要小得多。其中一些脚本可能会在初始渲染后动态插入，但也可能有很大一部分页面没有在初始 HTML 中包含的脚本上设置这些属性，导致阻塞了渲染。

### preload、prefetch、和 modulepreload
资源预测（如 dns-prefetch、preconnect、prerender、preload、prefetch 和 modulepreload）可用于提示浏览器应尽早获取哪些资源。每种资源预测都有不同的用途，preload 用于获取当前导航所需的资源，modulepreload 相当于预加载包含 JavaScript 模块的脚本，以及 prefetch 用于下一次导航所需的资源。

| 资源预测         | 桌面  | 移动  |
| --------------- | ----- | ----- |
| `preload`       | 16.4% | 15.4% |
| `prefetch`      | 1.0%  | 0.8%  |
| `modulepreload` | 0.1%  | 0.1%  |

<p align=center>使用各种资源预测的页面百分比。</p>

---
分析资源预测采用的趋势很棘手。并非所有页面都受益于它们，并且笼统地建议广泛使用资源预测是不明智的，因为过度使用它们会产生其自身的后果——尤其是在 [preload 涉及到的地方](https://blog.webpagetest.org/posts/removing-unused-preloads-on-festival-foods/)。然而，preload 15% 的移动页面上相对丰富的资源预测表明，许多开发人员都意识到了这种性能优化，并试图利用它来发挥自己的优势。

prefetch 使用起来很棘手，尽管它对于长时间的多页会话可能是有益的。即便如此，prefetch 这完全是推测性的，以至于浏览器在某些情况下可能会忽略它。这意味着某些页面可能会通过请求未使用的资源来浪费数据。这真的“视情况而定”。

由于 `<script>` 元素上 type="module" 属性的采用率同样较低，因此 modulepreload 的缺少使用是有道理的。即使如此，不经过转换就发布 JavaScript 模块的应用程序也可以从这个资源预测中受益，因为它不会只获取命名的资源，而是获取整个模块树。这在某些情况下会有所帮助。

让我们深入分析使用了多少种资源预测类型。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/82e2a5ae428e42d18f6b6529d1dbcf5e~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页 JavaScript 资源的 prefetch 采用分布。</p>

---
这里采用 prefetch 有些令人惊讶，每个页面有三个针对 JavaScript 资源的 prefetch 预测。然而，这些预测在第 75 和第 90 百分位的数量表明，可能有相当数量的浪费，其形式是页面导航从未使用过的未使用资源。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/89baa953126b4732bfb7fdb5cffece32~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页 JavaScript 资源的 preload 采用分布。</p>

---
请记住 - 此分析跟踪使用一个或多个资源预测的页面上的 JavaScript 资源使用了多少 preload 预测。中间部分 preload 为 JavaScript 提供了两个预测，这在表面上还不错，但它通常取决于脚本的大小、可以启动多少处理脚本，或者 preload 初始时是否需要通过获取的脚本页面加载。

不幸的是，我们在第 90 个百分位看到了 5 个 JavaScript 资源 preload 预测，这可能太多了。这表明第 90 个百分位的页面特别依赖 JavaScript，并且正在 preload 尝试克服由此产生的性能问题。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb616ca3635547d181cc69f3966ceffb~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页 JavaScript 资源的 modulepreload 采用分布。</p>

---
我们在第 75 个百分位上看到了惊人的 6 个预测，在第 90 个百分位数上看到了 14 个预测！这表明，虽然在高百分位使用更多个 modulepreload 预测的页面将未转换的 ES6 模块直接发送到浏览器，但对如此多资源预测的需求表明在高百分位上过度依赖 JavaScript。

资源预测是优化我们如何在浏览器中加载资源的好工具，但如果您在使用它们时可以注意一条建议，那就是谨慎使用它们，以及最初可能无法发现的资源；例如，最初在 DOM 中加载的 JavaScript 文件请求另一个文件。与其预加载大量脚本，不如尝试减少您要交付的 JavaScript 数量，因为这将带来更好的用户体验，而不是预加载大量脚本。

### `<head>` 中的 JavaScript
一个古老且经常被吹捧的性能最佳实践是在文档的页脚中加载 JavaScript，以避免脚本的呈现阻塞，并确保在脚本有机会运行之前构造 DOM。然而，近年来，在某些体系结构中，将 `<script>` 元素放在文档 `<head>` 中更为常见。

这可能是在 Web 应用程序中优先加载 JavaScript 的好方法，但应尽可能使用 async 和 defer 属性以避免 DOM 的渲染阻塞。渲染阻塞是指浏览器必须停止页面的所有渲染以处理页面所依赖的资源。这样做是为了避免不愉快的影响，例如无样式内容的闪烁，或者当 DOM 未准备好依赖于 DOM 就绪的脚本时可能发生的 JavaScript 运行时错误。

我们发现 77% 的移动页面在文档 `<head>` 中至少有一个渲染阻塞脚本，而 79% 的桌面页面都有这个脚本。这是一个令人担忧的趋势，因为当脚本阻止呈现时，页面内容的绘制速度不会尽可能快。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/061ef20e32e64a38b6a22da42c03745a~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>根据网站排名具有阻塞渲染的脚本的页面占比。</p>

---
当按网站排名页面查看问题时，我们看到了类似的麻烦模式。特别是，在通过移动设备访问的前 1000 个网站中，63% 的网站在 `<head>` 中提供了至少一个阻塞渲染的脚本，并且随着网站排名的增加，页面的比例也在增加。

对此有解决方案： 使用 defer 属性是一种相对安全的选择，可以解除对 DOM 渲染的阻塞。使用async（如果可能）是一个不错的选择，它将允许脚本立即运行，但这些脚本不能对其他 `<script>` 元素有任何依赖关系，否则可能会发生错误。

在可能的情况下，渲染关键的 JavaScript 可以放在页脚，并 preload 加载，这样浏览器就可以提前开始请求这些资源。无论哪种方式，渲染阻塞 JavaScript 的状态与我们发布的 JavaScript 数量并不乐观，Web 开发人员应该更加努力地遏制这些问题。

### 脚本注入
脚本注入是一种模式，其中使用 document.createElement 在 JavaScript 中创建 HTMLScriptElement，并使用 DOM 插入方法注入 DOM。或者，可以通过 innerHTML 方法将字符串中的 `<script>` 元素标记注入 DOM。

脚本注入是一种相当普遍的做法，在很多情况下都会用到，但它的问题在于，它破坏了浏览器的预加载扫描器，使脚本在初始HTML有效载荷被解析时无法被发现。如果注入的脚本资源最终负责渲染标记，这可能会影响到最大的内容绘画（LCP）等指标，而这本身就会启动长时间的任务来解析大块的标记内容。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0a87f4f389e045679cdcd0d17f734e1d~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>注入脚本的百分比在各个百分点上的分布。</p>

---
在中位数上，我们看到 25% 的页面的脚本被注入，而不是让它们在最初的 HTML 响应中被渲染。更令人担忧的是，第 75 和第 90 百分位数的页面分别注入了 50% 和 70% 的脚本。

脚本注入在用于呈现用户使用的页面内容时有可能损害性能，在这些情况下应在必要时避免。脚本注入在当今的网络中如此普遍是一个令人担忧的趋势。现代框架和工具可能依赖于此模式，这意味着一些开箱即用的体验可能会依赖这种潜在的反模式来为网站提供功能。

### 第一方与第三方 JavaScript
网站经常发布两类 JavaScript：
- 为您网站的基本功能提供支持并提供交互性的第一方脚本。
- 外部供应商提供的满足各种需求的第三方脚本，例如 UX 研究、分析、提供广告收入以及嵌入视频和社交媒体功能等内容。

虽然第一方的 JavaScript 可能更容易优化，但第三方的 JavaScript 本身也可能是性能问题的一个重要来源，因为第三方供应商可能不会优先考虑优化他们的 JavaScript 资源，而是增加新的功能来为他们的客户提供额外的业务功能。此外，用户体验研究人员、营销人员和其他非技术人员可能对放弃这些脚本提供的功能或收入来源感到犹豫。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/79f873b60319436a88d1aa861fccecb8~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>第一方与第三方 JavaScript 主机请求数量分布。</p>

---
在这里，我们看到了一幅发人深省的画面。无论百分比如何，似乎所有观察到的主机都在提供等量的第一方和第三方脚本。中位数主机为每种类型服务 10 个，第 75 个百分位数为每种类型提供 20 个，第 90 个百分位数主机为 34 个第三方脚本服务！

这是一个有问题且令人担忧的趋势。当涉及到性能时，第三方脚本会造成各种损害。第三方脚本可能会做很多事情，例如运行昂贵的计时器来编排大量任务，附加他们自己的事件侦听器来增加额外的工作，从而延迟交互性，以及一些视频和社交媒体第三方提供大量的脚本为他们提供的服务提供动力。

缓解第三方脚本的步骤通常更像是一种文化问题，而不是工程问题。如果您要交付过多的第三方脚本，请对每个脚本进行审计，了解它们的作用，并分析它们的活动，以找出它们引发的性能问题。

如果您正在进行大量 UX 研究，请考虑收集您自己的字段数据（如果源发送正确的 [`Timing-Allow-Origin`](https://developer.mozilla.org/docs/Web/HTTP/Headers/Timing-Allow-Origin) 标头）以做出明智的决定，以避免某些第三方脚本可能导致的性能问题。对于您添加的每个第三方脚本，您不仅会产生加载成本，还会产生对用户输入的响应至关重要的运行时成本。

所以我们知道主机发送了大量第三方脚本，但是第一方脚本与第三方脚本的字节成本是多少？

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0fd3e75af85e49f785483671cc547d7a~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>第一方与第三方由主机提供的 JavaScript 字节大小分布。</p>

---
在几乎每一个百分点上，第三方脚本发送的字节数都超过了第一方脚本的字节数。在第 75 个百分位，第三方脚本有效负载似乎是第一方脚本的两倍。在第 90 个百分位，通过网络发送的第三方脚本的数量似乎接近 1 兆字节。

如果您发现您的网站的第一个与第三方脚本有效负载与上图相似，那么您应该与您的工程组织合作尝试降低这个数字是关键。如果您这样做，它只能帮助您的用户。

### 动态 import()
动态 import() 是静态 import 语法的一种变体，可以在脚本的任何地方运行，而静态 import 表达式必须在 JavaScript 文件的顶部运行，而不能在其他任何地方运行。

动态 import() 允许开发人员有效地从他们的主要包中“拆分”出 JavaScript 代码块，以便按需加载，这可以通过预先加载更少的 JavaScript 来提高启动性能。

目前观察到的所有移动页面中，只有 0.34% 的移动页面使用动态 import()，而 0.41% 的桌面页面使用它，这一比例低得惊人。这是一个在启动期间交付更少代码的机会。也许动态 import() 并没有看到太多用处，因为它根据功能按需而不是预先加载 JavaScript。

这很棘手，但可以取得平衡，它涉及衡量用户的意图。在不延迟交互的情况下延迟加载 JavaScript 的一种方法是在用户发出进行交互的信号时 preload 该 JavaScript。这方面的一个示例可能是延迟加载 JavaScript 以验证表单，并在用户关注该表单中的字段后预加载该 JavaScript。这样，当请求 JavaScript 时，它已经在浏览器缓存中。另一种方法可能是使用服务工作者在安装服务工作者时预缓存交互所需的 JavaScript。安装应该发生在页面在页面加载事件中完全加载的位置。这样，当请求必要的功能时，可以从 service worker 缓存中检索它，而无需启动成本。

动态 import() 使用起来很棘手，但更广泛地采用它可以帮助将加载 JavaScript 的性能成本从启动转移到页面生命周期的后期，大概是在网络资源争用较少的时候。我们希望看到更多采用动态 import()，因为我们看到在启动期间加载的 JavaScript 数量只会增加。

## Web Worker
Web Worker 是一种 Web 平台功能，它通过在自己的线程上启动一个不直接访问 DOM 的专门的 JavaScript 文件来减少主线程工作。这项技术可以用来卸载那些可能使主线程不堪重负的任务，在一个单独的线程上完成这些工作。

令人欣慰的是，目前有 12% 的移动和桌面页面使用一个或多个 Web Worker 来减轻可能使用户体验变差的主要工作线程——但还有很大的改进空间。

如果您有大量工作可以在不直接访问 DOM 的情况下完成，那么使用 Web worker 是一个好主意。虽然您必须使用 [专门的通信管道](https://developer.mozilla.org/docs/Web/API/Web_Workers_API/Using_web_workers#transferring_data_to_and_from_workers_further_details) 将数据传输到网络工作者或从网络工作者传输数据，但完全有可能通过使用该技术使您的网页对用户输入的响应更快。

但是，该通信管道的设置和使用可能很棘手，尽管有一些开源解决方案可以简化此过程。[comlink](https://www.npmjs.com/package/comlink) 就是一个这样的库，它可以帮助解决这个问题，并且可以使开发人员在 Web 工作者周围的体验更加愉快。

无论你是自己管理 Web worker 还是使用库管理，关键是：如果你有昂贵的工作要做，判断是否需要在主线程上进行，如果不需要，强烈考虑使用 Web worker 来制作您网站的用户体验尽可能好。

### Worklet
Worklet 是一种特殊类型的工作程序，它允许对绘制和音频处理等任务的渲染管道进行较低级别的访问。虽然有四种类型的工作集，但目前在浏览器中可用的实现只有两种————[绘制工作集](https://caniuse.com/mdn-api_css_paintworklet) 和 [音频工作集](https://caniuse.com/mdn-api_audioworklet)。Worklet 的一个显着性能优势是它们在自己的线程上运行，从而将主线程从昂贵的绘图和音频处理工作中解放出来。

由于 Worklet 是这样的特殊类型技术，因此它们没有被广泛使用也就不足为奇了。Paint Worklet 是将生成艺术品的昂贵处理工作转移到另一个线程上的绝佳方式——更不用说为用户体验增添一点天赋的伟大技术了。对于每 100 万个网站，其中只有 13 个使用 Paint Worklet。

音频工作集的采用率更低：百万分之四的网站使用它。随着时间的推移，这些技术的采用趋势将如何变化，这将是一件有趣的事情。

## JavaScript 是如何交付的？
JavaScript 性能的一个同样重要的方面是我们如何向浏览器提供脚本，其中包括一些常见但有时会错过的优化机会，从我们如何压缩 JavaScript 开始。

### 压缩
压缩是一种常用的技术，主要适用于基于文本的资源，例如 HTML、CSS、SVG 图像，当然还有 JavaScript。有多种压缩技术在网络上广泛使用，可以加快脚本向浏览器的传递，有效缩短资源加载阶段。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/17b69e007335496a89e1d838cc7a4326~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>JavaScript 压缩方式。</p>

---
有一些压缩技术可用于减少脚本的传输大小，其中 [Brotli](https://github.com/google/brotli) (br) 方法是[最有效](https://www.smashingmagazine.com/2016/10/next-generation-server-compression-with-brotli/)的。尽管 Brotli [在现代浏览器中提供了出色的支持](https://caniuse.com/brotli)，但很明显 [gzip](https://www.gzip.org/) 是最受青睐的压缩方法。这可能是由于许多 Web 服务器将其用作默认设置。

当某些东西是默认值时，该默认值有时会保持不变，而不是被调整以获得更好的性能。鉴于观察到的页面中只有 34% 使用 Brotli 压缩脚本，很明显有机会提高脚本资源的加载性能，但也值得注意的是，与去年 30% 的采用率相比，这是一个改进。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/62381dc33d444038b8022c6372e21ecd~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>主机上的脚本资源压缩方式。</p>

---
第三方脚本提供商使问题变得更糟，他们仍然比 Brotli 更广泛地部署 gzip 压缩，分别为 60% 和 29%。鉴于第三方 JavaScript 在当今网络上是一个严重的性能问题，因此可以通过使用 Brotli 部署第三方资源来减少这些资源的资源加载时间。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed14abaf437640d88fc32f29bbcfd952~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>主机上未压缩的资源。</p>

---
值得庆幸的是，我们看到它主要是最小的资源，特别是那些负载小于 5 KB 的第三方脚本，它们是在没有压缩的情况下交付的。这是因为压缩在应用于小资源时会产生收益递减，事实上，动态压缩的额外开销可能会导致资源交付延迟。不幸的是，有一些机会可以压缩更大的资源，例如一些负载超过 100 KB 的第一方脚本。

始终检查您的压缩设置，以确保您通过网络交付尽可能小的脚本有效负载，并记住：压缩加速资源交付。这些脚本一旦交付给浏览器，就会被解压缩，并且它们的处理时间不会因压缩而改变。压缩不是提供大量脚本有效负载的好借口，这可能会使启动期间的交互性变得更糟。

### 简化
文本资源的简化是一种经过时间考验的减小文件大小的做法。这种做法包括从源代码中删除所有不必要的空格和注释，以减少它们的传输大小。另一个称为 uglification 的步骤应用于 JavaScript，它将脚本中的所有变量、类名和函数名简化为更短、不可读的符号。Lighthouse 的 [Minify JavaScript](https://web.dev/unminified-javascript/)审计检查未简化的 JavaScript。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/71a2071076ed452597811bec21772703~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>未简化的 JavaScript 审计得分分布。</p>

---
这里，0.00 代表最差分数，而 1.00 代表最好分数。在 Lighthouse 的精简 JavaScript 审核中，68% 的移动页面得分在 0.9 到 1.0 之间，而桌面页面的得分为 79%。这意味着在移动设备上，32% 的页面有机会发布简化的 JavaScript，而桌面页面的这一数字为 21%。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a7b88778d4904a1390bbd4cc5df6eeb5~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>未简化的 JavaScript 的可节省大小。</p>

---
在中间值上，我们看到页面发送的 JavaScript 大小约为 12 KB，可以简化。然而，当我们到达第 75 个和第 90 个百分位数时，这个数字会跳跃很多，从 34 KB 增加到大约 76 KB。第三方在整个过程中都非常好，直到我们达到第 90 个百分位，然而，他们发送大约 19 KB 的未压缩 JavaScript。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/727e8404a4234d639fe3f0df6fa027d4~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>未简化的 JavaScript 平均浪费的字节数。</p>

---
鉴于我们刚刚提供的数据，当您查看平均值时，未压缩 JavaScript 浪费的字节数并不足为奇。第一方绝大多数是交付未压缩 JavaScript 的最大罪魁祸首，占比略高于 80%。其余的略低于 20%，可以做更多的事情来通过网络传输更少的字节。

简化解决了 Web 性能的首要原则之一：发送更少的字节。如果您未通过 Lighthouse 对未精简 JavaScript 的审核，请检查您的打包器的配置，以确保您的第一方代码尽可能地简化生产。如果您注意到未简化的第三方脚本，可能是时候与该供应商沟通，看看他们能做些什么来修复它。请参阅 [第三方](https://almanac.httparchive.org/en/2022/third-parties) 章节，以更深入地了解网络上第三方的状态。

### Source maps
[源映射](https://firefox-source-docs.mozilla.org/devtools-user/debugger/how_to/use_a_source_map/index.html) 是 Web 开发人员用来将简化和压缩的生产代码映射到其原始源的工具。源映射用于生产 JavaScript 文件，是一种有用的调试工具。源映射可以在指向资源末尾源映射文件的注释中指定，也可以作为 [`SourceMap`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/SourceMap) HTTP 响应标头指定。

通过移动设备访问的 14% 的 JavaScript 资源将源映射注释传递到可公开访问的源映射，而通过桌面设备访问的 15% 的 JavaScript 资源提供它们。但是，对于使用源映射 HTTP 标头的页面来说，情况就大不相同了。

移动设备上只有 0.12% 的 JavaScript 资源请求使用源映射 HTTP 标头，而桌面设备的这一数字为 0.07%。

从性能的角度来看，这并不意味着什么。源映射是一种开发人员体验增强功能。但是，您应该避免使用内联源映射，它将原始源的 base64 表示插入到生产就绪的 JavaScript 资产中。内联源映射意味着您不仅将 JavaScript 资源发送给用户，还发送给用户的源映射，这可能导致 JavaScript 资产过大，需要更长的时间来下载和处理。

## 响应能力
JavaScript 影响的不仅仅是启动性能。当我们依赖 JavaScript 提供交互性时，这些交互是由需要时间执行的事件处理程序驱动的。根据交互的复杂性和驱动它们所涉及的脚本数量，用户可能会遇到输入响应不佳的情况。
### 指标
许多指标用于评估实验室和现场的响应能力，Lighthouse、Chrome UX Report (CrUX) 和 HTTP Archive 等工具跟踪这些指标，以提供当今网站当前响应状态的数据驱动视图. 除非另有说明，否则以下所有图表均描述了原始级别的该指标的第 75 个百分位[（Core Web Vitals 确定通过的阈值） ](https://web.dev/vitals/#core-web-vitals)。

其中第一个是 [首次输入延迟 (FID)](https://web.dev/fid/)，它记录了与页面进行的第一次交互的输入延迟。输入延迟是用户与页面交互与该交互的事件处理程序开始运行之间的时间。它被认为是一种负载响应指标，侧重于用户在与网站交互时获得的第一印象。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/718dd4b336f2403cbfdaac50283a4ede~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>网站的第 75 个百分位 FID 值分布。</p>

---
此图表显示了所有网站的第 75 个百分位 FID 值的分布。对于至少 75% 的桌面和手机用户体验，中位网站的 FID 值为 0 毫秒。这种“完美的 FID”体验甚至延伸到 75% 的网站。只有当我们到达第 90 个百分位时，我们才开始看到不完美的 FID 值，但只有 25 毫秒。

鉴于“良好”的 FID 阈值为 [100 毫秒](https://web.dev/fid/#what-is-a-good-fid-score)，我们可以说至少 90% 的网站符合此标准。事实上，我们从 [性能](https://almanac.httparchive.org/en/2022/performance) 一章中所做的分析得知，100% 的网站实际上在桌面设备上具有“良好”的 FID 体验，而在移动设备上这一比例为 92%。FID 是一个异常宽松的指标。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/18d19fae7abe4cfc8d0856ce3787a5d5~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>网站的第 75 个百分位 INP 值分布。</p>

---
但是，为了全面了解整个页面生命周期中的页面响应能力，我们需要查看 [与下一次绘制 (INP) 的交互](https://web.dev/inp/)，它评估与页面进行的所有键盘、鼠标和触摸交互并选择高百分比旨在表示整体页面响应能力的交互延迟。

考虑一个“好”的 INP 分数是 [200 毫秒](https://web.dev/inp/#what's-a-%22good%22-inp-value) 或更短。在中位数，移动和桌面的得分都低于这个阈值，但第 75 个百分位是另一回事，移动和桌面细分市场都在“需要改进”的范围内。该数据与 FID 完全不同，它表明网站有很多机会尽其所能在页面上运行更少的 [长任务](https://web.dev/long-tasks-devtools/)，这是导致 INP 分数不太好的关键因素。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f66cbd064fa744c99900362828e225fc~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>页面上的基于实验室的 TBT 值分布。</p>

---
与长任务相吻合，有 [总阻塞时间（TBT）](https://web.dev/tbt/) 指标，它计算启动期间长任务的总阻塞时间。

请注意，与前面关于 FID 和 INP 的统计数据不同，TBT 和 TTI（如下）并非来自真实用户数据。相反，我们正在 [模拟](https://almanac.httparchive.org/en/2022/methodology#lighthouse) 桌面和移动环境中测量合成性能，并启用了适合设备的 CPU 和网络节流。由于这种方法，我们为每个页面获得了一个 TBT 和 TTI 值，而不是整个网站的真实用户值分布。

考虑到 [INP 与 TBT 的相关性非常好](https://github.com/GoogleChromeLabs/chrome-http-archive-analysis/blob/main/notebooks/HTTP_Archive_TBT_and_INP.ipynb)，可以合理地假设高 TBT 分数可能会产生较差的 INP 分数。使用我们的综合方法，我们看到台式机和移动设备之间存在巨大差距，这表明具有更好处理能力和内存的台式机设备的性能大大优于功能较弱的移动设备。在第 75 个百分位，页面有近 3.6 秒的阻塞时间，这被认为是糟糕的体验。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cd3f24b342c4a69b9bbfe81bd30a598~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>按来源和百分位数的 TTI 得分分布。</p>

---
最后，我们来看看 [交互时间 (TTI)](https://web.dev/tti/)，如果指标在 5 秒内出现，则认为这是“好”的。鉴于只有第 10 个百分位几乎没有滑到 5 秒以下，我们模拟环境中的大多数网站都依赖 JavaScript，以至于页面无法在合理的时间范围内变得交互——尤其是第 90 个百分位，这需要惊人的时间 41.2 秒变为互动。

### 长任务/阻塞时间
正如您可能从上一节中了解到的，交互响应能力差的主要原因是任务太长。澄清一下，长任务是在主线程上运行超过 50 毫秒的任何任务。超过50毫秒的任务长度就是该任务的阻塞时间，可以通过从任务的总时间中减去50毫秒来计算。

长任务是一个问题，因为它们会阻止主线程执行任何其他工作，直到该任务完成。当一个页面有很多长任务时，浏览器会觉得响应用户输入很慢。在极端情况下，甚至感觉浏览器根本没有响应。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cd13772bbafe4411a2ffafe70a5cca2c~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页的长任务数分布。</p>

---
中间页面在移动设备上遇到 19 个长任务，在桌面设备上遇到 7 个长任务。当您考虑到大多数桌面设备比移动设备具有更大的处理能力和内存资源并且主动冷却时，这是有道理的。

然而，在较高的百分位数时情况会变得更糟。每页第 75 个百分位的长任务在移动设备和桌面设备上分别为 32 和 12。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/642579871e0a451ea9f996d37a1c81c2~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>每页的长任务时长分布。</p>

---
仅仅知道每页有多少长任务是不够的——我们需要了解这些任务在页面上占用的总时间。移动页面的中位数有 3.59 秒的时间专门用于长任务，而桌面页面的时间要少得多，为 0.74 秒。

对于移动设备上的用户来说，第 75 个百分位的情况要糟糕得多，每页专门用于处理长任务的处理时间接近 6.6 秒。这是浏览器花费大量时间在可以优化甚至可能转移到不同线程上的网络工作者的紧张工作上。无论如何，这些结果都会给移动网络和响应能力带来麻烦。

### Scheduler API
调度 JavaScript 任务在历史上一直推迟到浏览器上。有一些新的方法，如 requestIdleCallback 和 queueMicrotask，但这些 API 以粗略的方式安排任务，特别是在如果 queueMicrotask 被滥用的情况下，可能会导致性能问题。

[Scheduler API](https://caniuse.com/mdn-api_scheduler_posttask) 最近发布了，它使开发人员可以根据优先级更好地控制调度任务——尽管它目前仅限于基于 Chromium 的浏览器。

目前只有百万分之 20 (0.002%) 的移动页面使用 Scheduler API 的 JavaScript，而百万分之 30 (0.003%) 的桌面页面使用。这并不奇怪，考虑到缺乏关于这个非常新的特性的文档，以及它的有限支持。但是，我们预计随着该功能的文档可用，这个数字会增加，尤其是在框架中使用它时。我们相信，采用这一重要的新功能最终将带来更好的用户体验结果。

### 同步 XHR
AJAX — 或使用 XMLHttpRequest (XHR) 方法在没有导航请求的情况下异步检索数据和更新页面信息 — 是一种非常流行的创建动态用户体验的方法。它在很大程度上已被异步 fetch 方法所取代，但所有主流浏览器仍然支持 XHR。

XHR 有一个标志，允许您发出同步请求。[同步 XHR](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Synchronous_and_Asynchronous_Requests#synchronous_request) 对性能有害，因为事件循环和主线程在请求完成之前被阻塞，导致页面挂起，直到数据可用。 fetch 是一种更有效和更高效的替代方案，具有更简单的 API，并且不支持同步获取数据。

虽然同步 XHR 仅用于 2.5% 的移动页面和 2.8% 的桌面页面，但其继续使用（无论多么小）仍然表明一些遗留应用程序可能依赖这种损害用户体验的过时方法。

避免使用同步 XHR 和一般的 XHR。fetch 是一种更符合人体工程学的替代方案，在设计上就没有同步功能。如果没有同步 XHR，您的页面会表现得更好，我们希望有一天能看到这个数字降到零。

### document.write
在引入 DOM 插入方法（例如 appendChild 和其他方法）之前，document.write 被用来在文档中插入内容。

document.write 是非常有问题的。首先，它阻塞了 HTML 解析器，而且由于其他一些原因，HTML 规范本身也警告不要使用它。在慢速连接中，以这种方式阻塞文档解析以追加节点，会产生完全可以避免的性能问题。

令人惊讶的是，18% 的页面仍在使用 document.write 向 DOM 添加内容而不是使用正确的插入方法，而 17% 的桌面页面仍在这样做。对此的解释可能是遗留应用程序没有被重写以使用首选的 DOM 方法将新节点插入到文档中，甚至是一些仍在使用它的第三方脚本。

我们希望看到这种趋势有所下降。所有主流浏览器都明确警告不要使用这种方法。虽然它还没有被弃用，但它在未来几年在浏览器中的存在并不能保证。如果您的网站中有 document.write 调用，则应优先考虑尽快将其删除。

### 遗留的 JavaScript
在过去的几年里，JavaScript 有了很大的发展。新的语言特性的引入使 JavaScript 成为一种能力更强、更优雅的语言，帮助开发人员编写更简洁的 JavaScript，从而减少 JavaScript 的加载量--前提是这些特性没有被 Babel 等转码器不必要地转化为传统语法。

Lighthouse 目前会检查那些在现代网络中可能不必要的 Babel 转换，例如转换 async 和 await 的使用、JavaScript 类，以及其他较新但被广泛支持的语言特性。

超过三分之二的移动页面正在传送正在转换的 JavaScript 资源，或者包含不必要的旧版 JavaScript。

为了兼容性，转换可以为生产 JavaScript 添加大量额外字节，但除非有必要支持旧版浏览器，否则其中许多转换是不必要的，并且会损害启动性能。如此多的移动页面（以及 68% 的桌面页面）正在交付这些转换，这令人担忧。

Babel 为解决这个问题做了很多开箱即用的工作，例如通过 [编译器假设功能](https://babeljs.io/docs/en/assumptions)，但 Babel 仍然由用户定义的配置驱动，并且只能在存在过时的配置文件的情况下做这么多。

如上所述，我们强烈建议开发人员仔细检查他们的 [Babel](https://babeljs.io/docs/en/configuration) 和 [Browserslist](https://github.com/browserslist/browserslist) 配置，以确保对代码应用最少的转换，以便它们在所需的浏览器中工作。这样做会导致发送给最终用户的字节数大大减少。开发人员在这方面有很多工作要做，我们希望看到这个数字随着时间的推移而下降，因为该语言的演变已经相对稳定。

## JavaScript 是如何使用的？
构建网页的方法不止一种。虽然有些人可能会选择直接使用 Web 平台，但不可否认的是，Web 开发人员行业的趋势是追求抽象，使我们的工作更容易进行和推理。与往年一样，我们将探索库和框架的作用，以及这些库和框架出现安全漏洞的频率，这些漏洞可能使网络成为用户面临风险的地方。
### 库和框架
库和框架是开发人员体验的重要组成部分——有可能通过框架开销损害性能。尽管开发人员在很大程度上接受了这种权衡，但了解 Web 上常用的库和框架非常重要，因为它有助于我们了解 Web 的构建方式。在本节中，我们将了解 2022 年 Web 上的库和框架的状态。

### 库的使用
为了了解库和框架的使用，HTTP Archive 使用 [Wappalyzer](https://almanac.httparchive.org/en/2022/methodology#wappalyzer) 来检测页面上使用的技术。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a466decfd1df48cfaf53c8abf1c4d7de~tplv-k3u1fbpfcp-zoom-1.image)

<p align=center>顶级库和框架的使用率。</p>

---
jQuery 是当今网络上使用最多的库仍然不足为奇。部分原因是 [35%](https://almanac.httparchive.org/en/2022/cms##most-popular-cmss) 的网站使用 WordPress，但即便如此，大部分 jQuery 的使用发生在 WordPress 平台之外。

虽然 jQuery 相对较小且运行速度相当快，但它仍然代表应用程序中的一定量的开销。jQuery 提供的大部分功能现在都可以通过原生 DOM API 实现，并且在当今的 Web 应用程序中可能是不必要的。

core-js 的使用也不足为奇，因为许多 Web 应用程序使用 Babel 转换其代码，Babel 经常使用 core-js 来填补跨浏览器 API 中缺失的部分。随着浏览器的成熟，这个数字应该会下降——这确实是一件好事，因为现代浏览器比以往任何时候都更有能力，而交付 core-js 代码最终可能会浪费字节。

与去年相比，React 的使用率明显保持不变，为 8%，这可能表明由于 JavaScript 生态系统中的选择越来越多，该库的采用率已经趋于平稳。

### 组合使用的库
在同一页面上看到使用多个框架和库的情况并不少见。与去年一样，我们将研究这一现象，以深入了解 2022 年有多少库和框架一起使用。

| Libraries	| Desktop	| Mobile |
| --------------- | ----- | ----- |
| jQuery	| 10.19%	| 10.33% |
| jQuery, jQuery Migrate	| 4.30%	| 4.94% |
| core-js, jQuery, jQuery Migrate	| 2.48%	| 2.80% |
| core-js, jQuery	| 2.78%	| 2.74% |
| jQuery, jQuery UI	| 2.40%	| 2.07% |
| core-js, jQuery, jQuery Migrate, jQuery UI	| 1.18%	| 1.36% |
| jQuery, jQuery Migrate, jQuery UI	| 0.88%	| 0.99% |
| GSAP, Lodash, Polyfill, React	| 0.48%	| 0.93% |
| Modernizr, jQuery	| 0.87%	| 0.86% |
| core-js	| 0.92%	| 0.85% |

<p align=center>库和框架组合使用的百分比。</p>

---
很明显，jQuery 有一些强大的持久力，它的一些组合、它的 UI 框架和它的迁移插件出现在前七名中，而 core-js 在库的使用中也扮演着突出的角色。

### 安全漏洞
鉴于当今 Web 上 JavaScript 的广泛传播，以及可安装 JavaScript 包的出现，JavaScript 生态系统中存在安全漏洞也就不足为奇了。

尽管 57% 的移动页面提供了易受攻击的 JavaScript 库或框架，但这一数字比去年的 64% 有所下降。这是令人鼓舞的，但要降低这个数字还有很多工作要做。我们希望随着更多安全漏洞的修补，开发人员将被激励更新他们的依赖项，以避免让他们的用户受到伤害。

| Library or framework                | Desktop | Mobile |
| ----------------------------------- | ------- | ------ |
| jQuery                              | 49.12%  | 48.80% |
| jQuery UI                           | 16.01%  | 14.88% |
| Bootstrap                           | 11.53%  | 11.19% |
| Moment.js                           | 4.54%   | 3.91%  |
| Underscore                          | 3.41%   | 3.11%  |
| Lo-Dash                             | 2.52%   | 2.44%  |
| GreenSock JS                        | 1.65%   | 1.62%  |
| Handlebars                          | 1.27%   | 1.12%  |
| [AngularJS](https://angularjs.org/) | 0.99%   | 0.79%  |
| Mustache                            | 0.44%   | 0.57%  |

<p align=center>十大最常用的库和框架中存在已知 JavaScript 漏洞的页面的百分比。</p>

---
由于 jQuery 是当今 Web 上最流行的库，因此它及其相关的 UI 框架代表了当今用户在 Web 上暴露的大量安全漏洞也就不足为奇了。这可能是因为一些开发人员仍在使用这些脚本的旧版本，这些脚本没有利用对已知漏洞的修复。

[一个值得注意的条目是 Bootstrap](https://almanac.httparchive.org/en/2022/css)，它是一个 UI 框架，可帮助开发人员在不直接使用 CSS 的情况下快速原型化或构建新布局。鉴于 Grid 或 Flexbox 等较新的 CSS 布局模式的发布，我们可能会看到 Bootstrap 的使用随着时间的推移而减少，或者取而代之的是，开发人员会更新他们的 Bootstrap 依赖项以发布更安全的网站。

无论您使用什么库和框架，请务必尽可能定期更新您的依赖项，以避免让您的用户受到伤害。虽然包更新确实会不时导致一些重构或代码修复，但付出的努力值得减少责任并提高用户安全性。

### Web components 和 Shadow DOM
一段时间以来，Web 开发一直由众多框架采用的组件化模型驱动。Web 平台也进行了类似的发展，以通过 Web 组件和 Shadow DOM 提供对逻辑和样式的封装。为了开始今年的分析，我们将从自定义元素开始。

使用自定义元素的桌面页面的百分比 2.0% 比去年对桌面页面上自定义元素使用情况的分析有所下降，后者为 3%。凭借自定义元素提供的优势以及它们在现代浏览器中相当广泛的支持，我们希望 Web 组件模型将迫使开发人员利用 Web 平台内置功能来创建更快的用户体验。

Shadow DOM 允许您在文档中创建专用节点，这些节点包含它们自己的子元素和样式范围，从而将组件与主 DOM 树隔离开来。与去年 0.37% 的页面使用 Shadow DOM 的数字相比，该功能的采用率基本保持不变，有 0.39% 的移动页面和 0.47% 的桌面页面使用它。

template 元素帮助开发人员重用标记模式。它们的内容仅在被 JavaScript 引用时呈现。模板可以很好地与 Web 组件配合使用，因为 JavaScript 尚未引用的内容随后会使用 Shadow DOM 附加到 Shadow Root。

目前，桌面和移动设备上大约 0.05% 的网页正在使用 template 元素。尽管模板在浏览器中得到了很好的支持，但它们的采用目前还很少。

使用 is 属性的移动页面的百分比为 0.08%。HTML is 属性是将自定义元素插入页面的另一种方式。不是使用自定义元素的名称作为 HTML 标记，而是将名称传递给任何标准的 HTML 元素，该元素实现了 Web 组件逻辑。is 属性是一种使用 Web 组件的方法，如果 Web 组件未能在页面上注册，该组件仍可以退回到标准 HTML 元素行为。

这是我们跟踪此属性使用情况的第一年，不出所料，它的采用率低于自定义元素本身。由于 Safari 缺乏支持，这意味着 iOS 和 macOS 上的 Safari 无法使用该属性，这可能导致该属性的使用受限。

## 结论
随着 Web 平台的成熟，我们希望看到更多地直接采用它的各种 API 和功能，因为这样做是有意义的。对于那些需要框架来获得更好的开发体验的开发者，我们希望看到框架作者有更多的优化和采用新的 API 来帮助开发者产生更好的开发体验和创造出更好的用户体验。

我们期待明年向着预示趋势的转变。与此同时，[我们继续尽我们所能让网络尽可能快](https://web.dev/fast/)，同时密切关注 [实验室数据](https://web.dev/lab-and-field-data-differences/#lab-data) 和 [实时数据](https://web.dev/lab-and-field-data-differences/#field-data)。

## 原文链接
- [https://almanac.httparchive.org/en/2022/javascript](https://almanac.httparchive.org/en/2022/javascript)