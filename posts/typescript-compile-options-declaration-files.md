---
date: 15:19 2023/3/29
title: TypeScript 编译选项、声明文件 ｜ 青训营笔记
tags:
- TypeScript
description: TypeScript 的核心在于静态类型，我们在编写 TS 的时候会定义很多的类型，但是主流的库都是 JS 编写的，并不支持类型系统。这个时候你不能用 TS 重写主流的库，我们只需要编写仅包含类型注释的 d.ts 文件，然后在你的 TS 代码中，可以在仍然使用纯 JS 库的同时，获得静态类型检查的优势。
---
## TypeScript 介绍
1. TypeScript 是 JavaScript 的超集，提供了 JavaScript 的所有功能，并提供了可选的静态类型、Mixin、类、接口和泛型等特性。
2. TypeScript 的目标是通过其类型系统帮助及早发现错误并提高 JavaScript 开发效率。
3. 通过 TypeScript 编译器或 Babel 转码器转译为 JavaScript 代码，可运行在任何浏览器，任何操作系统。
4. 任何现有的 JavaScript 程序都可以运行在 TypeScript 环境中，并只对其中的 TypeScript 代码进行编译。
5. 在完整保留 JavaScript 运行时行为的基础上，通过引入静态类型定义来提高代码的可维护性，减少可能出现的 bug。
6. 永远不会改变 JavaScript 代码的运行时行为，例如数字除以零等于 Infinity。这意味着，如果将代码从 JavaScript 迁移到 TypeScript ，即使 TypeScript 认为代码有类型错误，也可以保证以相同的方式运行。
7. 对 JavaScript 类型进行了扩展，增加了例如 `any`、`unknown`、`never`、`void`。
8. 一旦 TypeScript 的编译器完成了检查代码的工作，它就会 **擦除** 类型以生成最终的“已编译”代码。这意味着一旦代码被编译，生成的普通 JS 代码便没有类型信息。这也意味着 TypeScript 绝不会根据它推断的类型更改程序的 **行为**。最重要的是，尽管可能会在编译过程中看到类型错误，但类型系统自身与程序如何运行无关。
9. 在较大型的项目中，可以在单独的文件 tsconfig.json 中声明 TypeScript 编译器的配置，并细化地调整其工作方式、严格程度、以及将编译后的文件存储在何处。

## 编译选项
TypeScript 提供了很多不同功能的编译选项，既可以通过配置 tsconfig.json 文件中的 `compilerOptions` 属性来实现编译，也可以使用在 `tsc` 命令后跟随参数这种形式，直接编译 `.ts` 文件。

以下这些选项可以同时在命令行和 tsconfig.json 里使用。
| 选项 | 类型 | 默认值 | 描述 |
| --- | ------- | ----- | ---------------------------------- |
| –-allowJs                      | boolean | false | 允许编译 JavaScript 文件 |
| –-allowSyntheticDefaultImports | boolean | false | 允许从没有设置默认导出的模块中默认导入 |
| –-allowUnreachableCode         | boolean | false | 不报告执行不到的代码错误 |
| –-allowUnusedLabels            | boolean | false | 不报告未使用的标签错误 |
| –-alwaysStrict                 | boolean | false | 以严格模式解析并为每个源文件生成 "use strict" 语句 |
| -–checkJs        | boolean | false | 在 .js 文件中报告错误，与 --allowJs 配合使用 |
| -–declaration -d | boolean | false | 生成相应的 .d.ts 文件 |
| -–declarationDir | string  |       | 生成声明文件的输出路径 |
| -–diagnostics    | boolean | false | 显示诊断信息 |
| –-experimentalDecorators           | boolean | false | 启用实验性的ES装饰器     |
| –-extendedDiagnostics              | boolean | false | 显示详细的诊断信息       |
| –-forceConsistentCasingInFileNames | boolean | false | 禁止对同一个文件的不一致的引用 |
| –-inlineSourceMap | boolean | false | 生成单个 sourcemaps 文件，而不是将每 sourcemaps 生成不同的文件 |
| –-inlineSources   | boolean | false | 将代码与 sourcemaps 生成到一个文件中，要求同时设置了 --inlineSourceMap 或 --sourceMap 属性 |
| --init         |         |       | 初始化 TypeScript 项目并创建一个 tsconfig.json 文件 |
| –-listEmittedFiles | boolean | false | 打印出编译后生成文件的名字 |
| –-listFiles        | boolean | false | 编译过程中打印文件名 |
| --module -m      | string | target == "ES6" ? "ES6" : "commonjs" | 指定生成哪个模块系统代码： "None"、"CommonJS"、"AMD"、"System"、"UMD"、"ES6" 或 "ES2015"。<br>► 只有 "AMD" 和 "System" 能和 --outFile 一起使用。<br>► "ES6" 和 "ES2015" 可使用在目标输出为 "ES5" 或更低的情况下。 |
| --moduleResolution | string | module == "AMD" or "System" or "ES6" ? "Classic" : "Node" | 决定如何处理模块 |
| --noEmit                     | boolean | false | 不生成输出文件 |
| --noEmitHelpers              | boolean | false | 不在输出文件中生成用户自定义的帮助函数代码，如 `__extends`。 |
| --noEmitOnError              | boolean | false | 报错时不生成输出文件 |
| --noErrorTruncation          | boolean | false | 不截短错误消息 |
| --noFallthroughCasesInSwitch | boolean | false | 报告 switch 语句的 fallthrough 错误（即不允许 switch 的 case 语句贯穿） |
| --noImplicitAny              | boolean | false | 在表达式和声明上有隐含的 any 类型时报错。 |
| --noImplicitReturns          | boolean | false | 当不是函数的所有返回路径都有返回值时报错 |
| --noImplicitThis             | boolean | false | 当 this 表达式的值为 any 类型时生成一个错误 |
| --noImplicitUseStrict        | boolean | false | 模块输出中不包含 "use strict" 指令 |
| --noLib                      | boolean | false | 不包含默认的库文件（ lib.d.ts） |
| --noResolve                  | boolean | false | 不把 `/// <reference>` 或模块导入的文件加到编译文件列表 |
| --noStrictGenericChecks      | boolean | false | 禁用在函数类型里对泛型签名进行严格检查 |
| --noUnusedLocals             | boolean | false | 若有未使用的局部变量则抛错 |
| --noUnusedParameters         | boolean | false | 若有未使用的参数则抛错 |
| --outDir | string |   | 重定向输出目录 |
| –-outFile   | string |   | 将输出文件合并为一个文件，合并的顺序是根据传入编译器的文件顺序和 `///<reference>` 和 import 的文件顺序决定的。 |
| --preserveConstEnums	| boolean	| false	| 保留 const enum 声明 |
| --preserveSymlinks    | boolean | false | 不把符号链接解析为其真实路径；将符号链接文件视为真正的文件 |
| --preserveWatchOutput | boolean | false | 保留 watch 模式下过时的控制台输出 |
| --project -p | string |   | 编译指定目录下的项目，这个目录应该包含一个 tsconfig.json文件来管理编译 |
| --removeComments | boolean | false | 删除所有注释，除了以 `/!*` 开头的版权信息 |
| –-skipDefaultLibCheck | boolean | false | 忽略库的默认声明文件的类型检查 |
| –-skipLibCheck        | boolean | false | 忽略所有的声明文件（ `*.d.ts` ）的类型检查 |
| --sourceMap        | boolean | false | 生成相应的 .map 文件 |
| --sourceRoot | string  |         | 指定 TypeScript 源文件的路径，以便调试器定位。当 TypeScript 文件的位置是在运行时指定时使用此标记，路径信息会被加到 sourceMap 里。 |
| --strict     | boolean | false | 启用所有严格类型检查选项，相当于启用 --noImplicitAny、--noImplicitThis、--alwaysStrict、--strictNullChecks、--strictFunctionTypes 和 --strictPropertyInitialization。 |
| --strictFunctionTypes | boolean | false | 禁用函数参数双向协变检查 |
| --strictPropertyInitialization | boolean | false | 确保类的非 undefined 属性已经在构造函数里初始化，需要同时启用 --strictNullChecks。 |
| --strictNullChecks             | boolean | false | 在严格的 null 检查模式下，null 和 undefined 值不包含在任何类型里，只允许用它们自己和 any 来赋值（有个例外，undefined 可以赋值到 void）。 |
| --target -t     | string   | ES3 | 指定 ECMAScript 目标版本 ES3（默认）、ES5、ES6/ ES2015、ES2016、ES2017 或 ESNext。<br>注意：ESNext 最新的生成目标列表为 [ES proposed features](https://github.com/tc39/proposals)。 |
| --traceResolution | boolean  | false | 生成模块解析日志信息 |
| --types           | string[] |         | 要包含的类型声明文件名列表 |
| --typeRoots | string[] |   | 要包含的类型声明文件路径列表 |
| –-watch -w |   |   | 在监视模式下运行编译器，会监视输出文件，在它们改变时重新编译。监视文件和目录的具体实现可以通过环境变量进行配置。 |

## tsconfig.json
1. 可以通过 `tsc --init` 命令在根目录生成 `tsconfig.json` 文件。
2. 目录中存在 `tsconfig.json` 文件表示该目录是 TypeScript 项目的根目录。
3. `tsconfig.json` 文件指定编译项目所需的根文件和编译器选项，主要有以下配置项：
```
{
  "compilerOptions": {},
  "files": [
    "core.ts",
    "index.ts",
    "types.ts"
  ],
  "exclude": [
    "node_modules", 
    "lib", 
    "**/*.test.ts"
  ],
  "include": [
    "src/**/*"
  ],
  "extends": "@tsconfig/recommended/tsconfig.json"
}
```
- `compilerOptions` - 对象类型，用来设置编译选项，若不设置则默认使用上述编译选项的默认配置。
- `files` - 指定一个包含相对或绝对文件路径的列表，不支持 glob 匹配模式。
- `include` - 指定一个文件 glob 匹配模式列表。
- `exclude` - 排除一个文件 glob 匹配模式列表。
- `extends` - 字符串类型，指向另一个要继承的配置文件的路径。例如，可以继承一个推荐配置 `npm i @tsconfig/recommended`，`"extends": "@tsconfig/recommended/tsconfig.json"`。
    - 如果有同名配置，继承文件里的配置会覆盖源文件里的配置。
    - 配置文件里的相对路径在解析时相对于它所在的文件。

> glob 通配符有:
> - `*` 匹配 0 或多个字符（不包括目录分隔符）
> - `?` 匹配一个任意字符（不包括目录分隔符）
> - `**/` 递归匹配任意子目录

1. 如果一个 glob 模式里的某部分不包含文件扩展名（只包含 `*` 或 `.*`），那么仅有支持的文件扩展名类型被包含在内（默认情况下为 .ts、.tsx 和 .d.ts），如果 `allowJs` 设置为 `true`，也包括 .js 和 .jsx。
2. 如果 `files` 和 `include` 都没有被指定，编译器默认包含当前目录和子目录下所有的 TypeScript 文件（.ts、.tsx 和 .d.ts），排除在 `exclude` 里指定的文件。
3. 如果同时指定了 `files` 或 `include`，编译器会将它们结合一并包含进来。
4. 使用 `include` 引入的文件可以使用 `exclude` 属性过滤。然而，通过 `files` 属性明确指定的文件却总是会被包含在内，不管 `exclude` 如何设置。
5. 使用 `outDir` 指定的目录下的文件永远会被编译器排除，除非明确地使用 `files` 将其包含进来（这时就算用 `exclude` 指定也没用）。
6. 如果没有特殊指定，`exclude` 默认情况下会排除 node_modules、bower_components、jspm_packages 和 `outDir` 目录。
7. 任何被 `files` 或 `include` 指定的文件所引用的文件也会被包含进来。例如，`A.ts` 引用了 `B.ts`，因此 `B.ts` 不能被排除，除非引用它的 `A.ts` 在 `exclude` 列表中。
8. 编译器不会去引入那些可能作为输出的文件。例如，我们包含了 `index.ts`，那么 `index.d.ts` 和 `index.js` 会被排除在外。
9. 优先级：命令行配置 > `files` > `exclude` > `include`。

### declaration
用来为工程中的每个 TypeScript 或 JavaScript 文件生成 `.d.ts` 文件，这些 `.d.ts` 文件是描述模块外部 API 的类型定义文件。编辑工具可以通过 `.d.ts` 文件为非类型化的代码提供 intellisense 和精确的类型。

当 `declaration` 设置为 `true` 时，用编译器执行下面的 TypeScript 代码：
```ts
export let helloWorld = "hi";
```
将会生成如下这样的 `index.js` 文件：
```ts
export let helloWorld = "hi";
```
以及一个相应的 `helloWorld.d.ts`：
```ts
export declare let helloWorld: string;
```
当使用 `.d.ts` 文件处理 JavaScript 文件时，需要使用 `emitDeclarationOnly` 或 `outDir` 来确保 JavaScript 文件不会被覆盖。

### strictFunctionTypes
- 协变：允许子类型转换为父类型(可以里式替换 LSP 原则进行理解)。
- 逆变：允许父类型转换为子类型。

1. 在函数的参数类型中，是符合逆变的，函数的关系和参数的关系是相反的。
2. 在老版本的 TS 中，函数参数是双向协变的。也就是说，既可以协变又可以逆变，但是这并不是类型安全的。
3. 在新版本 TS(2.6+)中 ，可以通过开启 `strictFunctionTypes` 来修复这个问题。设置之后，函数参数就不再是双向协变的了，函数参数检查更正确。

下面是一个禁用 `strictFunctionTypes` 的示例：
```ts
// @strictFunctionTypes: false
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Unsafe assignment
let func: StringOrNumberFunc = fn;
// Unsafe call - will crash
func(10);
```
启用 `strictFunctionTypes` 后，将正确检测到错误：
```ts
// @strictFunctionTypes: true
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Unsafe assignment
let func: StringOrNumberFunc = fn;
// Type '(x: string) => void' is not assignable to type 'StringOrNumberFunc'.
//   Types of parameters 'x' and 'ns' are incompatible.
//     Type 'string | number' is not assignable to type 'string'.
//       Type 'number' is not assignable to type 'string'.
```
在此功能的开发过程中，发现了大量本质上不安全的类层次结构，包括 DOM 中的一些。因此，该设置仅适用于以函数语法编写的函数，不适用于方法语法中的函数：
```ts
// @strictFunctionTypes: true
type Methodish = {
  func(x: string | number): void;
};

function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

// Ultimately an unsafe assignment, but not detected
const m: Methodish = {
  func: fn,
};
m.func(10);
```

### typeAcquisition
对象类型，用以设置自动引入库类型定义文件（.d.ts），该属性下面有3个子属性：
- `enable`: 布尔类型，用以设置是否开启自动引入库类型定义文件
- `include`: 数组类型，允许自动引入的库名列表，如 `["jquery", "kendo-ui"]`
- `exclude`: 数组类型，排除的库名列表

## 代码提示的秘密 - d.ts
1. 在使用 TypeScript 的时候，最大的一个好处就是可以给 JS 各种类型约束，使得 JS 能够完成静态代码分析，推断代码中存在的类型错误或者进行类型提示。
2. 而 TypeScript 完成类型推断，需要事先知道变量的类型，如果我们都是用 TypeScript 书写代码，并且给变量都指定了明确的类型，TypeScript 是可以很好的完成类型推断工作的。
3. 但是有时，我们不免会引入外部的 JS 库，这时 TypeScript 就对引入的 JS 文件里变量的具体类型不明确了，为了告诉 TypeScript 变量的类型，因此就有了类型定义文件 `d.ts`（d 即 `declare`），TypeScript 的声明文件。
4. 如何让这些第三方库也可以进行类型推导呢？需要考虑如何让 JS 库也能定义静态类型。JavaScript 和 TypeScript 的静态类型交叉口 — 类型定义文件，类似于 C/C++ 的 `.h`头文件（`#include <stdio.h>`），轻松让 JavaScript 也能支持定义静态类型。
5. `d.ts` 文件用于为 TypeScript 提供有关用 JavaScript 编写的 API 的类型信息。简单讲，就是你可以在 ts 文件中调用的 js 文件的声明文件。
6. TypeScript 的核心在于静态类型，我们在编写 TS 的时候会定义很多的类型，但是主流的库都是 JS 编写的，并不支持类型系统。这个时候你不能用 TS 重写主流的库，我们只需要编写仅包含类型注释的 `d.ts` 文件，然后在你的 TS 代码中，可以在仍然使用纯 JS 库的同时，获得静态类型检查的优势。
7. 在此期间，解决的方式经过了许多的变化，从 [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) 到 [typings](https://github.com/typings/typings)（已停止维护）。最后是 [@types](ttps://www.npmjs.com/~types)。在 Typescript 2.0 之后，推荐使用 @types 方式，TypeScript 将会默认地检查 `./node_modules/@types` 文件夹，自动从这里来获取模块的类型定义，当然了，你需要独立安装这个类型定义。Microsoft 在 [The Future of Declaration Files](https://blogs.msdn.microsoft.com/typescript/2016/06/15/the-future-of-declaration-files/) 介绍了 TypeScript 的这个新特性。

### 类型路径 - @types
1. 默认情况下，所有的 `@types` 包都会在编译时应用，任意层的 `node_modules/@types` 都会被使用，进一步说，在 `node_modules/@types` 中的任何包都被认为是可见的，这意味着包含了 `./node_modules/@types/`、`../node_modules/@types/`、`../../node_modules/@types/` 中所有的包。
2. 如果你的类型定义不在上面这个默认文件夹中，可以使用 `typesRoot` 来配置，只有 `typeRoots` 下面的包才会被包含进来。例如：
```
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```
这个配置文件将包含 `./typings` 和 `./vendor/types` 下的所有包，而不包括 `./node_modules/@types` 下的。其中所有的路径都是相对于 `tsconfig.json`。

3. 当 `types` 被指定，则只有列出的包才会被包含在全局范围内。例如：
```
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```
这个配置文件将只会包含 `./node_modules/@types/node`、`./node_modules/@types/jest` 和 `./node_modules/@types/express`。其他在 `node_modules/@types/*` 下的包将不会被包含。此功能与 `typeRoots` 不同的是，它只指定你想要包含的具体类型，而 `typeRoots` 支持你想要特定的文件夹。

4. 可以指定 `"types": []` 来禁用自动引入 `@types` 包。自动引入只在你使用了全局的声明（相反于模块）时是重要的，如果你使用 `import "foo"` 语句，TypeScript 仍然会查找 `node_modules` 和 `node_modules/@types` 文件夹来获取 `foo` 包。
5. `types` 选项不会影响 `@types/*` 如何被包含在你的代码中，例如：
```ts
import * as moment from "moment";
moment().format("MMMM Do YYYY, h:mm:ss a");
```
`moment` 导入会有完整的类型。当你设置了不在 `types` 数组中包含它们时，它将：
- 不会在你的项目中添加全局声明（例如 node 中的 `process` 或 Jest 中的 `expect`）。
- 导出不会出现在自动导入的建议中。

### d.ts 和 @types 的关系
`@types` 是 npm 的一个分支，用来存放 `d.ts` 文件，如果对应的 npm 包存放在 `@types` 中，要使用必须下载！如果是自己本地的 `d.ts` 申明文件，则和 `@types` 没有任何关系！

### 实验
以下 `baby.ts` 文件，导出了一个 Baby 类，和一个叫 baby 的实例。`Baby` 包含一个私有的字段 `_name`，静态的方法 `smile`，公开的方法 `getBabyName`, 在通过 `new` 调用 `constructor` 的时候，会初始化我们的 `_name`，而 `getBabyName` 就是拿到我们私有的 `_name`，之所以需要 `getBabyName`，是因为通过 `private` 关键字指定的私有字段和方法，在实例中是无法访问的。
```ts
export class Baby {
  private _name: string;
  constructor(name: string) {
    this._name = name;
    console.log('小宝贝正在哭泣，哇哇哇哇哇~~~')
  }

  static smile() {
    console.log('O(∩_∩)O哈！')
  }

  getBabyName(): string {
    return this._name;
  }
}

export let baby = new Baby('Nico');
```
我们加上 `-d` 选项编译 ts 文件：
```ts
tsc baby.ts -d
```
会有一个编译后的 `baby.js` 文件，你还会发现我们多出了一个 `baby.d.ts` 文件。大多数 ts 初学者会这样问：请问一下，如何在 ts 文件里面，引入已经写好的 js 文件呢？答案就在这里，d.ts 文件。
```ts
export declare class Baby {
  private _name;
  constructor(name: string);
  static smile(): void;
  getBabyName(): string;
}
export declare let baby: Baby;
```
我们发现 `baby.ts` 里面所有的方法声明都被导入到了 `baby.d.ts` 文件里面，而 TypeScript 恰恰就是通过这个 `d.ts` 文件进行代码提示的。

1. 现在重命名一下我们的 `baby.ts`，把它改成 `baby.copy.ts`。
2. 新建 `main.ts` 文件，当使用 `import { baby } from "./baby";` 语句导入的时候，VSCode 会自动提示 `baby.d.ts` 和 `baby.copy.ts`。
3. 我们选择 `baby.d.ts`（`baby.js` 模块文件的声明文件），然后再敲 `baby.`，此时我们就看到了 `getBabyName` 方法的提示。
4. 如果删除 `baby.d.ts` 文件，会发现提示警告：`无法找到模块“./baby”的声明文件。“baby.js”隐式拥有 "any" 类型。`

### 添加自己的 typings 文件夹
如何解决没有库的 d.ts 文件时报错？
1. 添加 `typeRoots` 配置项，就可以加载自己的 d.ts 文件了。
```json
{
  "compilerOptions": {
    "typeRoots": ["typings"]
  }
}
```
2. 在 typings 目录下新建一个 xxx.d.ts ，xxx 可以随意写。
```ts
declare module "koa" {
  interface Context {
    render(filename: string, ...args: any[]) : any;
    session: any;
    i18n: any;
    csrf: any;
    flash: any;
  }
}
```
3. `"koa"` 就是你的报错库的名称，这里就只是给 `koa` 库添加一些属性，防止代码编辑器报错。
3. 还有一点要注意的是，报错一定是因为该包主目录下没有一个 `index.js`，或者放到 `lib` 目录下面了，新版本的 TypeScript 只要你安装了库，并且它的下面有 `index.js` 就可以加载到，不会报错但是会让你导入的是 `any` 类型。

### 如何发布 d.ts 文件
1. 第一种方式就是在你的库下面的 `package.json` 里面配置。这里最好写上相对路径：
```json
"types": "./lib/main.d.ts"

// or
"typings": "./lib/main.d.ts"
```
如果你的项目没有使用模块系统的话，可以将包中包含类型定义的 `.d.ts` 文件手动通过 `/// <reference path="" />` 引入。

2. 第二种方式是给[这个地址](https://github.com/DefinitelyTyped/DefinitelyTyped.git)提交 PR。
```
https://github.com/DefinitelyTyped/DefinitelyTyped.git
```
- 最近的构建都具有完善的 [类型标注](https://github.com/microsoft/DefinitelyTyped-tools/tree/master/packages/dtslint)：[![Build Status](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c023a6399374ad1893ceec98677e9b5~tplv-k3u1fbpfcp-zoom-1.image)](https://dev.azure.com/definitelytyped/DefinitelyTyped/_build/latest?definitionId=1&branchName=master)
- 所有的包基于 typescript@next 版本都有完善的类型标注：[![Build status](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b97524c4b3554ca4bde374f32b2b4e9b~tplv-k3u1fbpfcp-zoom-1.image)](https://dev.azure.com/definitelytyped/DefinitelyTyped/_build/latest?definitionId=8)
- 所有的包都会在1小时30分钟内 [发布到 npm](https://github.com/microsoft/DefinitelyTyped-tools/tree/master/packages/publisher): [![Publish Status](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/08125252f78c4b66934b6522f3fa2648~tplv-k3u1fbpfcp-zoom-1.image)](https://dev.azure.com/definitelytyped/DefinitelyTyped/_build/latest?definitionId=5&branchName=master)
- [typescript-bot](https://github.com/typescript-bot) 在 Definitely Typed 一直处于活跃状态 [![Activity Status](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed9f6ecee6544cc4aa548f82c124c987~tplv-k3u1fbpfcp-zoom-1.image)](https://dev.azure.com/definitelytyped/DefinitelyTyped/_build/latest?definitionId=6&branchName=master)

### Definitely Typed
是一个高质量的 TypeScript 类型定义的仓库。
1. npm 包中并不总是有可用的类型，可能有时项目不再维护，有时他们不感兴趣，或没有时间使用 TypeScript。
2. 由于缺少类型，在 TypeScript 中使用非类型化 npm 包将不会再具有类型安全性。
3. 为了帮助 TypeScript 开发人员使用这些包，有一个社区维护的项目叫做 Definitely Typed。
4. Definitely Typed 是一个为没有类型的 NPM 包提供类型脚本定义的中央存储库的项目。
5. 安装声明包后，通常不需要其他步骤来使用类型，TypeScript 会在使用包本身时自动选择类型。
```
npm install --save-dev @types/jquery
npm install --save-dev @types/node
```
编译器中会自动引入这些类型。如果你的项目没有使用模块系统的话，你可能需要使用 `types` 指令进行手动引用：
```ts
/// <reference types="node" />
```
6. 当缺少类型时，VSCode 等编辑器通常会建议安装此类包。对于 npm 包 "foo"，它的类型定义的包名应该是 "@types/foo"。如果没有找到你的包，请在 [TypeSearch](https://microsoft.github.io/TypeSearch/) 查询。
7. Definitely Typed 和 npm 上的 [@types](https://www.npmjs.com/~types) 包有什么关系？Definitely Typed GitHub 仓库 [master 分支](https://github.com/DefinitelyTyped/DefinitelyTyped) 会通过 [DefinitelyTyped-tools](https://github.com/microsoft/DefinitelyTyped-tools/tree/master/packages/publisher) 自动发布到 npm 上的 [@types](https://www.npmjs.com/~types)。