---
date: 15:58 2023/3/29
title: Vitest 知识总结 ｜ 青训营笔记
tags:
- 测试
description: 基于浏览器的运行器，如 Cypress，可以捕捉到基于 Node 的运行器（如 Vitest）所不能捕捉的问题（比如样式问题、原生 DOM 事件、Cookies、本地存储和网络故障），但基于浏览器的运行器比 Vitest 慢几个数量级，因为它们要执行打开浏览器，编译样式表以及其他步骤。
---
## Vitest 简介
由 Vite 提供支持的极速原生的单元测试框架。安装 `pnpm add -D vitest`，Vitest 需要 Vite >=v3.0.0 和 Node >=v14。
1. Vite 支持  
重复使用 Vite 的配置、转换器、解析器和插件 - 在您的应用程序和测试中保持一致。

2. 兼容 Jest  
拥有预期、快照、覆盖等 - 从 Jest 迁移很简单。

3. 智能即时浏览模式  
智能文件监听模式，就像是测试的 HMR！

4. ESM, TypeScript, JSX  
由 esbuild 提供的开箱即用 ESM、TypeScript 和 JSX 支持。

## Vitest 跟其他的测试框架进行对比
Vitest 和基于浏览器的运行器之间的主要区别是速度和执行上下文。简而言之，基于浏览器的运行器，如 Cypress，可以捕捉到基于 Node 的运行器（如 Vitest）所不能捕捉的问题（比如样式问题、原生 DOM 事件、Cookies、本地存储和网络故障），但基于浏览器的运行器比 Vitest 慢几个数量级，因为它们要执行打开浏览器，编译样式表以及其他步骤。
### Jest
[Jest](https://jestjs.io/zh-Hans/) 通过为大多数的 JavaScript 项目提供了开箱即用的测试支持，填补了测试框架的空白，有着舒适的 API（例如 `it` 和 `expect`），以及大多数所需要的全套测试功能（例如快照，对象模拟，代码测试覆盖率）。

如果你的项目由 Vite 驱动，Jest 和 Vite 之间有很多重复的部分，让用户不得不创建两个不同的配置文件。配置和维护两个不同的容器是一件极其不合理的操作。使用 Vitest，你就可以将开发，构建和测试环境的配置定义为单个容器，共享相同的插件和 `vite.config.js`。同时可以通过相同的插件 API 进行扩展，与 Vite 形成完美的集成。

由于 Jest 的使用规模，Vitest 提供了与之兼容的 API，允许在大多数项目中将其作为备选使用，同时还包括了单元测试时最常见的功能（模拟，快照以及覆盖率）。Vitest 与大多数 Jest API 和生态系统库都有较好的兼容性，因此在大多数项目中，可以无缝的将 Jest 替换成 Vitest 。

### Cypress
[Cypress](https://www.cypress.io/) 是著名的端到端测试工具，是基于浏览器的测试工具，是 Vitest 的补充工具之一。

基于浏览器运行测试的框架（Cypress、Web Test），会捕获到 Vitest 无法捕获的问题，因为他们都是使用真实的浏览器和 APIs。相比之下，Vitest 专注于为非浏览器逻辑提供最佳的开发体验。如果你想使用 Cypress，建议将 Vitest 用于测试项目中非浏览器逻辑，将 Cypress 用于测试依赖浏览器的逻辑。

Cypress 更像是一个 IDE 而不是测试框架，因为您还可以在浏览器中看到真实呈现的组件，以及它的测试结果和日志。Cypress 还尝试将 Vite 集成进他们自己的产品中：使用 Vitesse 重新构建他们的应用程序的 UI，并使用 Vite 来测试驱动他们项目的开发。

Vitest 支持各种实现部分浏览器环境的第三方包，例如 jsdom，可以让我们快速的对于任何引用浏览器 APIs 的代码进行单元测试。但这些浏览器环境在实现上有局限性，例如 jsdom 缺少相当数量的特性，诸如 `window.navigation` 或者布局引擎（`offsetTop` 等）。

Cypress 不是对业务代码进行单元测试的好选择，但使用 Cypress（用于端对端和组件测试）配合 Vitest（用于非浏览器逻辑的单元测试）将满足你应用程序的测试需求。

## Vitest 主要功能
- 与 Vite 通用的配置、转换器、解析器和插件。
- 使用你的应用程序中的相同配置来进行测试！
- 智能文件监听模式（默认启用），就像是测试的 HMR！
- 支持测试 Vue、React、Lit 等框架中的组件。
- 开箱即用的 ES Module / TypeScript / JSX support / PostCSS
- ESM 优先，支持模块顶级 await
- 注重性能，通过 tinypool 使用 Worker 线程尽可能多地并发运行
- 使用 Tinybench 来支持基准测试
- 套件和测试的过滤、超时、并发配置
- Jest 的快照功能
- 内置 Chai 进行断言 + 与 Jest expect 语法兼容的 API
- 内置用于对象模拟(Mock)的 Tinyspy
- 使用 jsdom 或 happy-dom 用于 DOM 模拟
- 通过 c8 来输出代码测试覆盖率
- 类似于 Rust 语言的 源码内联测试
- 通过 expect-type 进行类型测试

### 测试环境
Vitest 提供 `environment` 选项以在特定环境中运行代码，可以使用 `environmentOptions` 选项修改环境的行为方式。默认情况下，可以使用这些环境：
- `node` 为默认环境
- `jsdom` 通过提供 Browser API 模拟浏览器环境，使用 [`jsdom`](https://github.com/jsdom/jsdom) 包
- `happy-dom` 通过提供 Browser API 模拟浏览器环境，被认为比 jsdom 更快，但缺少一些 API，使用 [`happy-dom`](https://github.com/capricorn86/happy-dom) 包
- `edge-runtime` 模拟 Vercel 的 [edge-runtime](https://edge-runtime.vercel.app/)，使用 [`@edge-runtime/vm`](https://www.npmjs.com/package/@edge-runtime/vm) 包

1. 设置 `environment` 选项时，它将应用于项目中的所有测试文件。要获得更细粒度的控制，可以使用控制注释为特定文件指定环境，以 `@vitest-environment` 开头，后跟环境名称的注释：
```ts
// @vitest-environment jsdom

import { test } from 'vitest'

test('test', () => {
  expect(typeof window).not.toBe('undefined')
})
```
也可以通过设置 `environmentMatchGlobs` 选项，根据 glob 模式指定环境。

2. 从 0.23.0 开始，你可以创建自己的包，名为 `vitest-environment-${name}`，来扩展 Vitest 环境。该包应导出一个具有 `Environment` 属性的对象：
```ts
import type { Environment } from 'vitest'

export default <Environment>{
  name: 'custom',
  setup() {
    // custom setup
    return {
      teardown() {
        // called after all tests with this env have been run
      },
    }
  },
}
```
可以通过 `vitest/environments` 访问默认的 Vitest 环境：
```ts
import { builtinEnvironments, populateGlobal } from 'vitest/environments'

console.log(builtinEnvironments) // { jsdom, happy-dom, node, edge-runtime }
```
`populateGlobal` 实用函数用于将属性从对象移动到全局命名空间。

### 测试上下文
Vitest 的测试上下文允许你定义可在测试中使用的工具(utils)、状态(states)和固定装置(fixtures)。
1. 每个测试回调的第一个参数是测试上下文。
```ts
import { it } from 'vitest'

it('should work', (ctx) => {
  // prints name of the test
  console.log(ctx.meta.name)
})
```
2. 内置的测试上下文。
- context.meta  
包含关于测试的元数据的只读对象。
- context.expect  
绑定到当前测试的 expect API。

3. 每个测试的上下文都不同。可以在 `beforeEach` 和 `afterEach` hooks 中访问和扩展它们。
```ts
import { beforeEach, it } from 'vitest'

beforeEach(async (context) => {
  // extend context
  context.foo = 'bar'
})

it('should work', ({ foo }) => {
  console.log(foo) // 'bar'
})
```
4. 可以通过添加聚合(aggregate)类型 `TestContext`, 为你的自定义上下文属性提供类型支持。
```ts
declare module 'vitest' {
  export interface TestContext {
    foo?: string
  }
}
```
如果只想为特定的 `beforeEach`、`afterEach`、`it` 或 `test` hooks 提供属性类型，则可以将类型作为泛型传递。
```ts
interface LocalTestContext {
  foo: string
}

beforeEach<LocalTestContext>(async (context) => {
  // typeof context is 'TestContext & LocalTestContext'
  context.foo = 'bar'
})

it<LocalTestContext>('should work', ({ foo }) => {
  // typeof foo is 'string'
  console.log(foo) // 'bar'
})
```

### 扩展断言(Matchers)
由于 Vitest 兼容 Chai 和 Jest，所以可以根据个人喜好使用 `chai.use` API 或者 `expect.extend`。
1. 可以使用对象包裹断言的形式调用 `expect.extend` 方法扩展默认的断言。
```ts
expect.extend({
  // 第一个参数是接收值，其余参数将直接传给断言
  toBeFoo(received, expected) {
    const { isNot } = this
    return {
      // 请勿根据 isNot 参数更改你的 "pass" 值，Vitest 为你做了这件事情
      pass: received === 'foo',
      message: () => `${received} is${isNot ? ' not' : ''} foo`,
    }
  },
})
```
断言方法可以访问上下文 `this` 对象中的这些属性:
- `isNot`  
    如果断言是在 `not` 方法上调用的( `expect(received).not.toBeFoo()` )，则返回 `true`。
- `promise`  
    如果断言是在 `resolved/rejected` 中调用的，它的值将包含此断言的名称。否则，它将是一个空字符串。
- `equals`  
    这是一个工具函数，他可以帮助你比较两个值。如果是相同的则返回 `true`，反之返回 `false`。这个方法几乎在每个断言内部都有使用。默认情况下，它支持非对称的断言。
- `utils`  
    它包含了一系列工具函数，可以使用它们来显示信息。

`this` 上下文也包含了当前测试的信息，可以通过调用 `expect.getState()` 来获取它，有用的属性是：
- `currentTestName`  
    当前测试的全称(包括 describe 块)。
- `testPath`  
    当前测试的路径。

断言的返回值应该兼容如下接口：
```ts
interface MatcherResult {
  pass: boolean
  message: () => string
  // 如果你传了这些参数，它们将自动出现在 diff 信息中，
  // 所以即便断言不通过，你也不必自己输出 diff
  actual?: unknown
  expected?: unknown
}
```

2. 使用 TypeScript 时，可以使用以下代码扩展默认的 Matchers 接口：
```ts
interface CustomMatchers<R = unknown> {
  toBeFoo(): R
}

declare global {
  namespace Vi {
    interface Assertion extends CustomMatchers {}
    interface AsymmetricMatchersContaining extends CustomMatchers {}
  }
  // jest.Matchers interface will also work.
}
```

### 源码内联测试
Vitest 还提供了一种方式，可以运行与你的代码实现放在一起的测试，允许测试与实现共享相同的闭包，并且能够在不导出的情况下针对私有状态进行测试。可用于:
- 小范围的功能或工具的单元测试
- 原型设计
- 内联断言
对于更复杂的测试，比如组件测试或 E2E 测试，建议**使用单独的测试文件取而代之**。
1. 首先，在 `if (import.meta.vitest)` 代码块内写一些测试代码并放在文件的末尾，例如：
```ts
// src/index.ts

// 函数实现
export function add(...args: number[]) {
  return args.reduce((a, b) => a + b, 0)
}

// 源码内的测试套件
if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('add', () => {
    expect(add()).toBe(0)
    expect(add(1)).toBe(1)
    expect(add(1, 2, 3)).toBe(6)
  })
}
```
2. 更新 Vitest 配置文件内的 `includeSource` 以获取到 `src/` 下的文件：
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
})
```
3. 执行测试。
```js
npx vitest
```
4. 对于生产环境的构建，你需要设置配置文件内的 `define` 选项，让打包器清除无用的代码。
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
+ define: {
+   'import.meta.vitest': 'undefined',
+ },
  test: {
    includeSource: ['src/**/*.{js,ts}']
  },
})
```
5. 要获得对 `import.meta.vitest` 的 TypeScript 支持，添加 `vitest/importMeta` 到 `tsconfig.json`：
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": [
+     "vitest/importMeta"
    ]
  }
}
```

### 快照
当希望确保函数的输出不会意外更改时，可以使用快照测试，兼容 Jest 快照测试。使用快照时，Vitest 将获取给定值的快照，将其比较时将参考存储在测试旁边的快照文件。如果两个快照不匹配，则测试将失败：要么更改是意外的，要么参考快照需要更新到测试结果的新版本。

要将一个值快照，你可以使用 `expect()` 的 `toMatchSnapshot()` API：
```ts
import { expect, it } from 'vitest'
it('renders correctly', () => {
  const result = toUpperCase('foobar')
  expect(result).toMatchSnapshot()
})
```
此测试在第一次运行时，Vitest 会创建一个快照文件，如下所示：
```ts
// Vitest Snapshot v1

exports['toUpperCase 1'] = '"FOOBAR"'
```
快照文件应该与代码更改一起提交，并作为代码审查过程的一部分进行审查。在随后的测试运行中，Vitest 会将执行的输出与之前的快照进行比较。如果他们匹配，测试就会通过。如果它们不匹配，要么测试运行时在你的代码中发现了应该修复的错误，要么实现已经更改，需要更新快照：
- 在监听(watch)模式下, 你可以在终端中键入 `u` 键直接更新失败的快照。
- 或者，你可以在 CLI 中使用 `--update` 或 `-u` 标记，`vitest -u` 使 Vitest 进入快照更新模式。

### 指定超时阈值
你可以选择将超时阈值（以毫秒为单位）作为第三个参数传递给测试。默认值为 5 秒。
```ts
import { test } from 'vitest'

test('name', async () => { /* ... */ }, 1000)
```
Hooks 也可以接收超时阈值，默认值为 5 秒。
```ts
import { beforeAll } from 'vitest'

beforeAll(async () => { /* ... */ }, 1000)
```

### 选择、跳过、待办测试套件和测试
1. 使用 `.only` 仅运行某些测试套件或测试。
```ts
import { assert, describe, it } from 'vitest'

// 仅运行此测试套件（以及标记为 Only 的其他测试套件）
describe.only('suite', () => {
  it('test', () => {
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('another suite', () => {
  it('skipped test', () => {
    // 已跳过测试，因为测试在 Only 模式下运行
    assert.equal(Math.sqrt(4), 3)
  })

  it.only('test', () => {
    // 仅运行此测试（以及标记为 Only 的其他测试）
    assert.equal(Math.sqrt(4), 2)
  })
})
```
2. 使用 `.skip` 以避免运行某些测试套件或测试。
```ts
import { assert, describe, it } from 'vitest'

describe.skip('skipped suite', () => {
  it('test', () => {
    // 已跳过此测试套件，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})

describe('suite', () => {
  it.skip('skipped test', () => {
    // 已跳过此测试，无错误
    assert.equal(Math.sqrt(4), 3)
  })
})
```
3. 使用 `.todo` 留存将要实施的测试套件和测试的待办事项。
```ts
import { describe, it } from 'vitest'

// 此测试套件的报告中将显示一个条目
describe.todo('unimplemented suite')

// 此测试的报告中将显示一个条目
describe('suite', () => {
  it.todo('unimplemented test')
})
```

### 类型测试
1. 从 Vitest 0.25.0 开始，Vitest 附带 expect-type 包，可以使用 `expectTypeOf` 或 `assertType` 语法为你的类型编写测试。
2. 在测试文件中触发的任何类型错误都将被视为测试错误，因此可以使用任何类型技巧来测试项目中的类型。
3. 默认情况下，`*.test-d.ts` 文件中的所有测试都被视为类型测试，但可以使用 `typecheck.include` 配置选项更改它。
4. Vitest 不运行或编译这些文件，它们仅由编译器静态分析，因此你不能使用任何动态语句，所以不能使用动态测试名称和 `test.each`、`test.runIf`、`test.skipIf`、`test.each`、`test.concurrent` API，但可以使用其他 API，例如 `test`、`describe`、`.only`、`.skip` 和 `.todo`。
5. 使用 CLI 标志，如 `--allowOnly` 和 `-t` 也支持类型检查。
```ts
import { assertType, expectTypeOf } from 'vitest'
import { mount } from './mount.js'

test('my types work properly', () => {
  expectTypeOf(mount).toBeFunction()
  expectTypeOf(mount).parameter(0).toMatchTypeOf<{ name: string }>()

  // @ts-expect-error name is a string
  assertType(mount({ name: 42 }))
})
```
6. 在 `package.json` 文件 `scripts` 部分添加如下命令：
```json
{
  "scripts": {
    "typecheck": "vitest typecheck"
  }
}
```
Vitest 使用 `tsc --noEmit` 或 `vue-tsc --noEmit`，具体取决于配置。

### 同时运行多个测试
在连续测试中使用 `.concurrent` 将会并发运行它们。
```ts
import { describe, it } from 'vitest'
// 标记为concurrent的两个测试将并行运行
describe('suite', () => {
  it('serial test', async () => {
    /* ... */
  })
  it.concurrent('concurrent test 1', async ({ expect }) => {
    /* ... */
  })
  it.concurrent('concurrent test 2', async ({ expect }) => {
    /* ... */
  })
})
```
在测试套件中使用 `.concurrent`，则其中的每个测试用例都将并发运行。
```ts
import { describe, it } from 'vitest'
// 此套件中的所有测试都将并行运行
describe.concurrent('suite', () => {
  it('concurrent test 1', async ({ expect }) => {
    /* ... */
  })
  it('concurrent test 2', async ({ expect }) => {
    /* ... */
  })
  it.concurrent('concurrent test 3', async ({ expect }) => {
    /* ... */
  })
})
```
还可以将 `.skip`、`.only` 和 `.todo` 用于并发测试套件和测试用例。

## Vitest 配置
Vitest 的主要优势之一是它与 Vite 的统一配置，`vitest` 将读取你的根目录 `vite.config.ts` 以匹配插件，例如 `resolve.alias` 和 `plugins` 的配置将会在 Vitest 中开箱即用。
- 创建 `vitest.config.ts`，优先级将会最高。
- 将 `--config` 选项传递给 CLI，例如 `vitest --config ./path/to/vitest.config.ts`。
- 在 `defineConfig` 上使用 `process.env.VITEST` 或 `mode` 属性（如果没有被覆盖，将设置为 `test`）有条件地在 `vite.config.ts` 中应用不同的配置。

使用 `vite` 的 `defineConfig` 还需要将 `三斜线指令` 写在配置文件的顶部，可以参考下面的格式：
```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    /* 使用global避免全局导入（description、test、expect） */
    // globals: true,
  },
})
```
使用 `vitest` 的 `defineConfig` 可以参考下面的格式：
```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // ...
  },
})
```
如果有需要，可以获取到 Vitest 的默认选项以扩展它们：
```ts
import { configDefaults, defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    exclude: [...configDefaults.exclude, 'packages/template/*'],
  },
})
```

### 对象模拟(Mocking)
在编写测试时，可能会因为时间问题，需要创建内部或外部服务的 “假” 版本，这通常被称为 **对象模拟** 操作。Vitest 通过 **vi** 提供了一些实用的函数用于解决这个问题。你可以使用 `import { vi } from 'vitest'` 或者 **全局配置** 进行访问它(当启用 **全局配置** 时)。
```ts
import { expect, vi } from 'vitest'
const fn = vi.fn()
fn('hello', 1)
expect(vi.isMockFunction(fn)).toBe(true)
expect(fn.mock.calls[0]).toEqual(['hello', 1])
fn.mockImplementation(arg => arg)
fn('world', 2)
expect(fn.mock.results[1].value).toBe('world')
```
Vitest 支持 [happy-dom](https://github.com/capricorn86/happy-dom) 或 [jsdom](https://github.com/jsdom/jsdom) 来模拟 DOM 和浏览器 API。Vitest 并不内置它们，所以需要安装：
```
npm i -D happy-dom
# or
npm i -D jsdom
```
然后，更改 `environment` 配置文件中的选项：
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    environment: 'happy-dom', // or 'jsdom', 'node'
  },
})
```

### 测试覆盖率
1. Vitest 通过 c8 支持本机代码覆盖率。同时也支持 istanbul。默认情况下，启用 c8。可以通过将 `test.coverage.provider` 设置为 `c8` 或 `istanbul` 来选择覆盖工具：
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
  },
})
```
2. 当你启动 Vitest 进程时，它会提示你自动安装相应的支持包：
```
npm i -D @vitest/coverage-c8
# or
npm i -D @vitest/coverage-istanbul
```
3. 要在启用的情况下进行测试，在 CLI 中传递 `--coverage` 标志：
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```
4. 要对其进行配置，需要在配置文件中设置 `test.coverage` 选项：
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'
export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```
5. 也可以通过将 `'custom'` 传递给 `test.coverage.provider` 来配置你的自定义覆盖率提供者：
```ts
// vite.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'custom',
      customProviderModule: 'my-custom-coverage-provider',
    },
  },
})
```
自定义覆盖率提供者需要一个 `customProviderModule` 选项，它是一个模块名称或从中加载 `CoverageProviderModule` 的路径。它必须将实现 `CoverageProviderModule` 的对象导出为默认导出：
```ts
// my-custom-coverage-provider.ts
import type {
  CoverageProvider,
  CoverageProviderModule,
  ResolvedCoverageOptions,
  Vitest,
} from 'vitest'

const CustomCoverageProviderModule: CoverageProviderModule = {
  getProvider(): CoverageProvider {
    return new CustomCoverageProvider()
  },

  // Implements rest of the CoverageProviderModule ...
}

class CustomCoverageProvider implements CoverageProvider {
  name = 'custom-coverage-provider'
  options!: ResolvedCoverageOptions

  initialize(ctx: Vitest) {
    this.options = ctx.config.coverage
  }

  // Implements rest of the CoverageProvider ...
}

export default CustomCoverageProviderModule
```
6. 运行覆盖率报告时，会在项目的根目录中创建一个 `coverage` 文件夹。如果想将它移动到不同的目录，使用 `vite.config.js` 文件中的 `test.coverage.reportsDirectory` 属性：
```ts
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    coverage: {
      reportsDirectory: './tests/unit/coverage',
    },
  },
})
```

### 命令行
在安装了 Vitest 的项目中，可以在 npm 脚本中使用 vitest 脚本，或者直接使用 `npx vitest` 运行它。以下是脚手架 Vitest 项目中的默认 npm 脚本：
```json
{
  "scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage"
  }
}
```
1. vitest 在开发环境下默认启动时使用 `监听模式(watch mode)`，当你修改源代码或测试文件时，Vitest 智能搜索模块依赖树并只重新运行相关测试，就像 HMR 在 Vite 的工作方式一样！
2. 在 CI 环境（当 `process.env.CI` 出现时）中以 `运行模式(run mode)` 启动，在不监视文更改的情况下执行单次运行。
3. 可以使用 `vitest watch` 或 `vitest run` 明确指定所需的模式。
4. 可以使用 CLI 按名称筛选测试文件，例如 `vitest basic` 将只执行包含 `basic` 路径名的测试文件。
```
basic.test.ts
basic-foo.test.ts
```
5. Vitest 默认启动多线程，可以通过 CLI 中的 `--no-threads` 禁用。
6. Vitest 还隔离了每个测试文件的运行环境，因此一个文件中的运行环境改变不会影响其他文件，可以通过将 `--no-isolate` 传递给 CLI 来禁用隔离（以正确性换取运行性能）。
7. 还可以指定其他 CLI 选项，例如 `--port` 或 `--https`，在项目中运行 `npx vitest --help` 获取有关 CLI 选项的完整列表。

## Vitest UI
Vitest 由 Vite 提供能力，在运行测试时有一个开发服务器。这允许 Vitest 提供一个漂亮的 UI 界面来查看并与测试交互。
1. 安装：
```
npm i -D @vitest/ui
```
2. 通过传入 `--ui` 参数来启动测试的 UI 界面：
```
vitest --ui
```
3. 通过 `http://localhost:51204/__vitest__/` 可以访问 Vitest UI 界面。
4. Vitest 0.26.0 开始, UI 也可以用作测试报告器。在 Vitest 配置中使用 `'html'` 报告器生成 HTML 输出并预览测试结果，如果仍想在终端中实时查看测试的运行情况，不要忘记将 `default` 报告器添加到 `reporters` 选项。
```ts
// vitest.config.ts

export default {
  test: {
    reporters: ['default', 'html'],
  },
}
```
5. 要预览你的 HTML 报告，可以使用 `vite preview` 命令：
```js
npx vite preview --base __vitest__ --outDir ./html
```
可以使用 `--outputFile=<path>` 配置选项配置输出，`./html/index.html` 是默认值。

## API
- describe 描述, 会形成一个作用域，用来组织测试和基准，使报告更加清晰
- test 别名 it，定义了一组关于测试期望的方法，接收测试名称和一个含有测试期望的函数，可以提供一个超时时限（以毫秒为单位）用于指定等待多长时间后终止测试，默认为 5 秒，也可以通过 `testTimeout` 选项进行全局配置
- expect 用来创建断言
    - not 将会否定断言
    - toBe 可用于断言基础对象是否相等
    - toBeDefined 断言检查值是否不等于 undefined
    - toBeUndefined 断言检查值是否等于 undefined
    - toBeNull 简单地断言检查值是否为 null，是 .toBe(null) 的别名
    - toBeNaN 简单地断言是否为 NaN，是 .toBe(NaN) 的别名
    - toBeTruthy 会将检查值转换为布尔值，断言该值是否为 true
    - toBeFalsy 会将检测值转换为布尔值，断言该值是否为 false
    - toBeTypeOf 断言检查值是否属于接收的类型
    - toBeInstanceOf 断言检查值是否为接收的类的实例
    - toBeGreaterThan 断言检查值是否大于接收值
    - toBeGreaterThanOrEqual 断言检查值是否大于等于接收值
    - toBeLessThan 断言检查值是否小于接收值
    - toBeLessThanOrEqual 断言检查值是否小于等于接收值
    - toEqual 断言检查值是否等于接收值，或者是同样的结构，如果是对象类型（将会使用递归的方法进行比较）
    - toStrictEqual 断言检查值是否等于接收值或者同样的结构，如果是对象类型（将会使用递归的方法进行比较），并且会比较它们是否是相同的类型
    - toContain 断言检查值是否在数组中，还可以检查一个字符串是否为另一个字符串的子串
    - toContainEqual 断言在数组中是否包含具有特定结构和值的元素，就像对每个元素进行 toEqual 操作
    - toHaveLength 断言一个对象是否具有 .length 属性，并且为数值
    - toHaveProperty 用于断言对象上是否存在指定 key 的属性，同时该方法还提供了一个可选参数，用于进行深度对比，就像使用 toEqual 比较接收到的属性值
    - toMatch 断言字符串是否匹配指定的正则表达式或字符串
    - toMatchObject 用于断言对象是否匹配指定的对象属性的子集，还可以传递对象数组。如果我们只想检查两个数组的元素数量是否匹配，该方法就会很有用，它不同于 arrayContaining ，它允许接收数组中的额外元素
    - toThrowError 断言函数在调用时是否抛出错误，可以提供一个可选参数来测试是否引发了指定的错误：
        - 正则表达式：错误信息通过正则表达式匹配
        - 字符串：错误消息包含指定子串
    - resolves 可以从待处理的 Promise 中去展开它的值，并使用通常的断言语句来断言它的值
    - rejects 可以来展开 Promise 被拒绝的原因，并使用通常的断言语句来断言它的值
- expect.assertions 在测试通过或失败后，它将会验证在测试期间调用了多少次断言，常用于检查异步代码是否被调用了
- expect.anything 这种非对称匹配器与相等检查一起使用时，将始终返回 true，如果你只是想确保该属性存在时很有用
- expect.any 这种非对称匹配器与相等检查一起使用时，仅当 value 是指定构造函数的实例时才会返回 true，如果你有一个每次都生成的值，并且只想知道它以正确的类型存在是很有用
- expect.arrayContaining 当与相等检查一起使用时，如果 value 是一个数组并包含指定的选项，则此非对称匹配器将返回 true，可以将 expect.not 与此匹配器一起使用来否定预期值
- expect.objectContaining 当与相等检查一起使用时，如果 value 具有相似的结构，则此非对称匹配器将返回 true，可以将 expect.not 与此匹配器一起使用来否定预期值
- expect.stringContaining 当与相等检查一起使用时，如果 value 是字符串并且包含指定的子字符串，则此非对称匹配器将返回 true，可以将 expect.not 与此匹配器一起使用来否定预期值
- expect.stringMatching 当与相等检查一起使用时，如果 value 是字符串并且包含指定的子字符串或字符串匹配正则表达式，则此非对称匹配器将返回 true，可以将 expect.not 与此匹配器一起使用来否定预期值
- 

- `not`
```ts
import { expect, test } from 'vitest'

const input = Math.sqrt(16)

expect(input).not.to.equal(2) // chai API
expect(input).not.toBe(2) // jest API
```
- `toEqual` 和 `toBe` 之间的区别
```ts
import { expect, test } from 'vitest'

const stockBill = {
  type: 'apples',
  count: 13,
}

const stockMary = {
  type: 'apples',
  count: 13,
}

test('stocks have the same properties', () => {
  expect(stockBill).toEqual(stockMary)
})

test('stocks are not the same', () => {
  expect(stockBill).not.toBe(stockMary)
})
```
- `toEqual` 和 `toStrictEqual` 之间的区别
```ts
import { expect, test } from 'vitest'

class Stock {
  constructor(type) {
    this.type = type
  }
}

test('structurally the same, but semantically different', () => {
  expect(new Stock('apples')).toEqual({ type: 'apples' })
  expect(new Stock('apples')).not.toStrictEqual({ type: 'apples' })
})
```
- `toHaveProperty`
```ts
import { expect, test } from 'vitest'

const invoice = {
  'isActive': true,
  'P.O': '12345',
  'customer': {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
  'total_amount': 5000,
  'items': [
    {
      type: 'apples',
      quantity: 10,
    },
    {
      type: 'oranges',
      quantity: 5,
    },
  ],
}

test('John Doe Invoice', () => {
  expect(invoice).toHaveProperty('isActive') // 断言 key 存在
  expect(invoice).toHaveProperty('total_amount', 5000) // 断言 key 存在且值相等

  expect(invoice).not.toHaveProperty('account') // 断言 key 不存在

  // 使用 dot 进行深度引用
  expect(invoice).toHaveProperty('customer.first_name')
  expect(invoice).toHaveProperty('customer.last_name', 'Doe')
  expect(invoice).not.toHaveProperty('customer.location', 'India')

  // 使用包含 key 的数组进行深度引用
  expect(invoice).toHaveProperty('items[0].type', 'apples')
  expect(invoice).toHaveProperty('items.0.type', 'apples') // 使用 dot 也可以工作

  // 在数组中包装你的 key 来避免它作为深度引用
  expect(invoice).toHaveProperty(['P.O'], '12345')
})
```
- `toMatch`
```ts
import { expect, test } from 'vitest'

test('top fruits', () => {
  expect('top fruits include apple, orange and grape').toMatch(/apple/)
  expect('applefruits').toMatch('fruit') // toMatch 也可以是一个字符串
})
```
- `toMatchObject`
```ts
import { expect, test } from 'vitest'

const johnInvoice = {
  isActive: true,
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
  total_amount: 5000,
  items: [
    {
      type: 'apples',
      quantity: 10,
    },
    {
      type: 'oranges',
      quantity: 5,
    },
  ],
}

const johnDetails = {
  customer: {
    first_name: 'John',
    last_name: 'Doe',
    location: 'China',
  },
}

test('invoice has john personal details', () => {
  expect(johnInvoice).toMatchObject(johnDetails)
})

test('the number of elements must match exactly', () => {
  // 断言对象数组是否匹配
  expect([{ foo: 'bar' }, { baz: 1 }]).toMatchObject([
    { foo: 'bar' },
    { baz: 1 },
  ])
})
```
- `toThrowError`
```ts
import { expect, test } from 'vitest'

function getFruitStock(type) {
  if (type === 'pineapples') {
    throw new DiabetesError(
      'Pineapples is not good for people with diabetes'
    )
  }

  // 可以做一些其他的事情
}

test('throws on pineapples', () => {
  // 测试错误消息是否在某处显示 "diabetes" ：这些是等效的
  expect(() => getFruitStock('pineapples')).toThrowError(/diabetes/)
  expect(() => getFruitStock('pineapples')).toThrowError('diabetes')

  // 测试确切的错误信息
  expect(() => getFruitStock('pineapples')).toThrowError(
    /^Pineapples is not good for people with diabetes$/
  )
})
```
- `resolves`
```ts
import { expect, test } from 'vitest'

async function buyApples() {
  return fetch('/buy/apples').then(r => r.json())
}

test('buyApples returns new stock id', async () => {
  // toEqual 现在返回一个 Promise ，所以我们必须等待它
  await expect(buyApples()).resolves.toEqual({ id: 1 }) // jest API
  await expect(buyApples()).resolves.to.equal({ id: 1 }) // chai API
})
```
- `rejects`
```ts
import { expect, test } from 'vitest'

async function buyApples(id) {
  if (!id)
    throw new Error('no id')
}

test('buyApples throws an error when no id provided', async () => {
  // toThrow 现在返回一个 Promise ，所以你必须等待它
  await expect(buyApples()).rejects.toThrow('no id')
})
```
- `expect.assertions`
```ts
import { expect, test } from 'vitest'

async function doAsync(...cbs) {
  await Promise.all(cbs.map((cb, index) => cb({ index })))
}

test('all assertions are called', async () => {
  expect.assertions(2)
  function callback1(data) {
    expect(data).toBeTruthy()
  }
  function callback2(data) {
    expect(data).toBeTruthy()
  }

  await doAsync(callback1, callback2)
})
```
- `expect.anything`
```ts
import { expect, test } from 'vitest'

test('object has "apples" key', () => {
  expect({ apples: 22 }).toEqual({ apples: expect.anything() })
})
```
- `expect.any`
```ts
import { expect, test } from 'vitest'
import { generateId } from './generators'

test('"id" is a number', () => {
  expect({ id: generateId() }).toEqual({ id: expect.any(Number) })
})
```
- `expect.arrayContaining`
```ts
import { expect, test } from 'vitest'

test('basket includes fuji', () => {
  const basket = {
    varieties: ['Empire', 'Fuji', 'Gala'],
    count: 3,
  }
  expect(basket).toEqual({
    count: 3,
    varieties: expect.arrayContaining(['Fuji']),
  })
})
```
- `expect.objectContaining`
```ts
import { expect, test } from 'vitest'

test('basket has empire apples', () => {
  const basket = {
    varieties: [
      {
        name: 'Empire',
        count: 1,
      },
    ],
  }
  expect(basket).toEqual({
    varieties: [expect.objectContaining({ name: 'Empire' })],
  })
})
```
- `expect.stringContaining`
```ts
import { expect, test } from 'vitest'

test('variety has "Emp" in its name', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(basket).toEqual({
    name: expect.stringContaining('Emp'),
    count: 1,
  })
})
```
- `expect.stringMatching`
```ts
import { expect, test } from 'vitest'

test('variety ends with "re"', () => {
  const variety = {
    name: 'Empire',
    count: 1,
  }
  expect(basket).toEqual({
    name: expect.stringMatching(/re$/),
    count: 1,
  })
})
```

## 使用
1. 在 `package.json` 文件 `scripts` 部分添加如下命令：
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```
2. 配置 `vite.config.ts`：
```ts
/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config/)

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
})
```
3. 定义文件。
- `suite.test.ts`
```ts
import { assert, describe, expect, it } from 'vitest'

describe('suite name', () => {
  it('foo', () => {
    assert.equal(Math.sqrt(4), 2)
  })

  it('bar', () => {
    expect(1 + 1).eq(2)
  })

  it('snapshot', () => {
    expect({ foo: 'bar' }).toMatchSnapshot()
  })
})
```
- `sum.ts`
```ts
export default function sum(...numbers:number[]){
  return numbers.reduce((total,number)=>total+number,0)
}
```
- `sum.test.ts`
```ts
import sum from './sum'
import {describe,expect,it} from "vitest"
describe("#sum", () => {
  it("returns 0 with no numbers", () => {
    expect(sum()).toBe(0)
  })
})
```
3. 运行测试 `pnpm run test:run`，在 `suite.test.ts` 文件目录下面生成了一个快照文件 `__snapshots__/suite.test.ts.snap`：
```
// Vitest Snapshot v1

exports[`suite name > snapshot 1`] = `
{
  "foo": "bar",
}
`;
```

## 组件测试示例
1. 定义组件：
- Case.tsx
```tsx
import { defineComponent, ref, watchEffect } from 'vue'

export default defineComponent({
  name: 'TestComponent',
  props: {
    value: String,
  },
  emits: ['update:value'],
  setup(props, { emit }) {
    const local = ref('')

    watchEffect(() => {
      emit('update:value', local)
    })
    watchEffect(() => {
      local.value = props.value!
    })

    return {
      local,
    }
  },
  render() {
    return (
      <a-select v-model={[this.local, 'value']}>
        <a-select-option value="aaa">aaa</a-select-option>
      </a-select>
    )
  },
})
```
- Link.tsx
```tsx
import { defineComponent, PropType, ref } from "vue";

export type IType = 'default' | 'primary' | 'success' | 'warning' | 'danger'| 'info'
export type IColor = 'black' | 'blue' | 'green' | 'yellow'| 'red' | 'gray'
export const props = {
  type: {
    type: String as PropType<IType>,
    default: "default",
  },
  color: {
    type: String as PropType<IColor>,
    default: "black",
  },
  plain: {
    type: Boolean,
    default: true,
  },
  href: {
    type: String,
    required: true,
  },
} as const;

export default defineComponent({
  name: "CLink",
  props,
  setup(props, { slots }) {
        return () => (
      <a
      class={`
        text-${props.plain ? props.color + "-500" : "white"}
        hover:text-${props.color}-400
        cursor-pointer
        text-lg
        hover:text-white
        transition duration-300 ease-in-out transform hover:scale-105
        mx-1
        decoration-none
        `}
      href={props.href}      
    >
      {slots.default ? slots.default() : 'Link'}
    </a>
    );    
  },
});
```
2. vitest 本身是不支持单元组件测试的，需要安装 Vue Test Utils：`pnpm add @vue/test-utils jsdom -D`。
3. 配置：
- package.json
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  },
}
```
- vite.config.ts
```ts
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import Jsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  plugins: [Vue(), Jsx()],
  test: {
    globals: true,
    environment: 'jsdom',
    transformMode: {
      web: [/.[tj]sx$/],
    },
  },
})
```
4. 定义测试。
- case.test.ts
```ts
//创建一个包含被挂载和渲染的组件的Wrapper，和mount不同的是shallowMount仅限测试组件，不牵扯子组件内容
import { shallowMount } from '@vue/test-utils'
import { expect, test } from 'vitest'
import Case from '../src/Case'

test('mount component', () => {
  const wrapper = shallowMount(Case, {
    props: {
      value: 'test',
    },
    global: {
      stubs: ['a-select', 'a-select-option'],
    },
  })
  //返回 Wrapper DOM 节点的 HTML 字符串到快照
  expect(wrapper.html()).toMatchSnapshot()
})
```
- link.test.ts
```ts
import Link from '../src/link/Link'
import { shallowMount } from '@vue/test-utils'
import { describe, expect, test } from 'vitest'
//使用shallowMount()方法挂载组件，并使用expect断言方法来检验组件的渲染是否正确
describe('Link', () => {
  test("mount @vue/test-utils", () => {
    const wrapper = shallowMount(Link, {
      slots: {
        default: 'Link'
      }
    });
    //断言
    expect(wrapper.text()).toBe("Link")
  })
})
//对组件颜色进行测试，测试默认link颜色
describe("Link", () => {
  test("default color is black", () => {
    // 使用 shallowMount 方法挂载组件
    const wrapper = shallowMount(Link);
    // 断言组件默认颜色是否是 black
    expect(wrapper.props().color).toBe("black");
  });
});
```
4. 运行测试 `pnpm run test:run`，在 `case.test.ts` 文件目录下面生成了一个快照文件 `__snapshots__/case.test.ts.snap`：
```
// Vitest Snapshot v1

exports[`mount component 1`] = `"<a-select-stub value=\\"test\\"></a-select-stub>"`;
```