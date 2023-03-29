---
date: 15:12 2023/3/29
title: TypeScript 命名空间、模块、声明合并 ｜ 青训营笔记
tags:
- TypeScript
description: 声明合并是指编译器将针对同一个名字的两个独立声明合并为单一声明，合并后的声明同时拥有原先两个声明的特性。
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

## 三斜杠指令
1. 三斜杠指令是包含单个 XML 标记的单行注释，注释的内容会做为编译器指令使用。
2. 三斜线指令仅可放在包含它的文件的最顶端。一个三斜线指令的前面只能出现单行或多行注释，这包括其它的三斜线指令。如果它们出现在一个语句或声明之后，那么它们会被当做普通的单行注释，并且不具有特殊的涵义。

### `/// <reference path="..." />`
1. `/// <reference path="..." />` 引用指令是三斜线指令中最常见的一种，它用于声明文件间的**依赖**，告诉编译器在编译过程中要引入的额外的文件。
2. 当使用 `--out` 或 `--outFile` 时，它也可以做为调整输出内容顺序的一种方法，文件在输出文件内容中的位置与经过预处理后的输入顺序一致。
3. 编译器会对输入文件进行预处理来解析所有三斜线引用指令。在这个过程中，额外的文件会加到编译过程中，该过程从一组 *根文件* 开始；这些文件是在命令行中指定或是在 `tsconfig.json` 中的 `"files"` 列表里指定；这些 *根文件* 按指定的顺序进行预处理。在一个文件被加入列表前，它包含的所有三斜线引用都要被处理，还有它们包含的目标。三斜线引用以它们在文件里出现的顺序，使用深度优先的方式解析。
4. 一个三斜线引用路径是相对于包含它的文件的，如果不是根文件。引用不存在的文件会报错，一个文件用三斜线指令引用自己也会报错。
5. 如果指定了 `noResolve` 编译选项，三斜线引用会被忽略；它们不会增加新文件，也不会改变给定文件的顺序。

### `/// <reference types="..." />`
1. 与 `/// <reference path="..." />` 指令类似，三斜线类型引用指令是用来声明 *依赖* 的；一个 `/// <reference types="..." />` 指令则声明了对某个包的依赖。
2. 对这些包的名字的解析与在 `import` 语句里对模块名的解析类似。可以简单地把三斜线类型引用指令当做 `import` 声明包的一种简单方法。
3. 例如，把 `/// <reference types="node" />` 引入到声明文件，表明这个文件使用了 `@types/node/index.d.ts` 里面声明的名字；并且，这个包需要在编译阶段与声明文件一起被包含进来。
4. 仅当在你需要写一个 `d.ts` 文件时才使用这个指令。
5. 对于那些在编译阶段生成的声明文件，编译器会自动地添加 `/// <reference types="..." />`；*当且仅当* 结果文件中使用了引用的包里的声明时才会在生成的声明文件里添加 `/// <reference types="..." />` 语句。
6. 若要在 `.ts` 文件里声明一个对 `@types` 包的依赖，使用 `--types` 命令行选项或在 `tsconfig.json` 里指定 `types`。
7. 通过指令包含的方式，假如我们每一个文件都写一个这种指令，会非常的烦，所以可以在 `tsconfig.json` 里面配置，分别是 `types` 指定文件，`typeRoots` 指定目录，选择一样即可。

### `/// <reference no-default-lib="true"/>`
1. 这个指令把一个文件标记成 *默认库*。你会在 `lib.d.ts` 文件和它不同的变体的顶部看到这个注释。
2. 这个指令告诉编译器在编译过程中不要包含默认库（即 `lib.d.ts`）。这与在命令行上使用 `--noLib` 相似。
3. 还要注意，当传递了 `--skipDefaultLibCheck` 时，编译器只会忽略检查带有 `/// <reference no-default-lib="true"/>` 的文件。

## 命名空间
> TypeScript 1.5 里术语名已经发生了变化。“内部模块”现在称做“命名空间”。“外部模块”现在则简称为“模块”，这是为了与 ECMAScript 2015 里的术语保持一致。另外，任何使用 `module` 关键字来声明一个内部模块的地方都应该使用 `namespace` 关键字来替换，这就避免了让新的使用者被相似的名称所迷惑。

我们定义几个简单的字符串验证器，使用它们来验证表单里的用户输入或验证外部数据。
1. 所有的验证器都放在一个文件里。
```ts
interface StringValidator {
  isAcceptable(s: string): boolean;
}
let lettersRegexp = /^[A-Za-z]+$/;
let numberRegexp = /^[0-9]+$/;
class LettersOnlyValidator implements StringValidator {
  isAcceptable(s: string) {
    return lettersRegexp.test(s);
  }
}
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
let strings = ["Hello", "98052", "101"];
// 使用的验证器
let validators: { [s: string]: StringValidator } = {};
validators["ZIP code"] = new ZipCodeValidator();
validators["Letters only"] = new LettersOnlyValidator();
for (let s of strings) {
  for (let name in validators) {
    let isMatch = validators[name]!.isAcceptable(s);
    console.log(`'${s}' ${isMatch ? "matches" : "does not match"} '${name}'.`);
  }
}
```
2. 随着更多验证器的加入，我们需要一种手段来组织代码，以便于在记录它们类型的同时还不用担心与其它对象产生命名冲突。因此，我们把验证器包裹到一个命名空间内，而不是把它们放在全局命名空间下。下面我们把所有与验证器相关的类型都放到一个叫做 `Validation` 的命名空间里。因为我们想让这些接口和类在命名空间之外也是可访问的，所以需要使用 `export`。相反的，变量 `lettersRegexp` 和 `numberRegexp` 是实现的细节，不需要导出，因此它们在命名空间外是不能访问的。在文件末尾的测试代码里，由于是在命名空间之外访问，因此需要限定类型的名称，比如 `Validation.LettersOnlyValidator`。
```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
  const lettersRegexp = /^[A-Za-z]+$/;
  const numberRegexp = /^[0-9]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
let strings = ["Hello", "98052", "101"];
// 使用的验证器
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${validators[name]!.isAcceptable(s) ? "matches" : "does not match"
      } '${name}'`
    );
  }
}
```
3. 当应用变得越来越大时，我们需要将代码分离到不同的文件中以便于维护。现在，我们把 `Validation` 命名空间分割成多个文件。尽管是不同的文件，它们仍是同一个命名空间，并且在使用的时候就如同它们在一个文件中定义的一样。因为不同文件之间存在依赖关系，所以我们加入了引用标签来告诉编译器文件之间的关联。

Validation.ts
```ts
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }
}
```
LettersOnlyValidator.ts
```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const lettersRegexp = /^[A-Za-z]+$/;
  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}
```
ZipCodeValidator.ts
```ts
/// <reference path="Validation.ts" />
namespace Validation {
  const numberRegexp = /^[0-9]+$/;
  export class ZipCodeValidator implements StringValidator {
    isAcceptable(s: string) {
      return s.length === 5 && numberRegexp.test(s);
    }
  }
}
```
Test.ts
```ts
/// <reference path="Validation.ts" />
/// <reference path="LettersOnlyValidator.ts" />
/// <reference path="ZipCodeValidator.ts" />
let strings = ["Hello", "98052", "101"];
let validators: { [s: string]: Validation.StringValidator } = {};
validators["ZIP code"] = new Validation.ZipCodeValidator();
validators["Letters only"] = new Validation.LettersOnlyValidator();
for (let s of strings) {
  for (let name in validators) {
    console.log(
      `"${s}" - ${
        validators[name].isAcceptable(s) ? "matches" : "does not match"
      } ${name}`
    );
  }
}
```
当涉及到多文件时，我们必须确保所有编译后的代码都被加载了。我们有两种方式。  
第一种方式，把所有的输入文件编译为一个输出文件，需要使用 `--outFile` 标记：
```
tsc --outFile sample.js Test.ts
```
编译器会根据源码里的引用标签自动地对输出进行排序。你也可以单独地指定每个文件。
```
tsc --outFile sample.js Validation.ts LettersOnlyValidator.ts ZipCodeValidator.ts Test.ts
```
第二种方式，我们可以使用按文件编译（默认）为每个输入文件生成一个 JavaScript 文件。然后，在页面上通过 `<script>` 标签把所有生成的 JavaScript 文件按正确的顺序引进来。
```
<!-- MyTestPage.html -->
<script src="Validation.js" type="text/javascript" />
<script src="LettersOnlyValidator.js" type="text/javascript" />
<script src="ZipCodeValidator.js" type="text/javascript" />
<script src="Test.js" type="text/javascript" />
```
4. 另一种简化命名空间操作的方法是使用 `import q = x.y.z` 给常用的对象起一个短的名字。注意不要与用来加载模块的 `import x = require('name')` 语法弄混了，这里的语法是为指定的符号创建一个别名。你可以用这种方法为任意标识符创建别名，也包括导入的模块中的对象。
```ts
namespace Shapes {
  export namespace Polygons {
    export class Triangle {}
    export class Square {}
  }
}
import polygons = Shapes.Polygons;
let sq = new polygons.Square(); // Same as 'new Shapes.Polygons.Square()'
```
注意，我们并没有使用 `require` 关键字，而是直接使用导入符号的限定名赋值。这与使用 `var` 相似，但它还适用于导入符号的类型和命名空间含义。重要的是，对于值来讲，`import` 会生成与原始符号不同的引用，所以改变别名的值并不会影响原始变量的值。

5. 为了描述不是用 TypeScript 编写的类库的类型，我们需要声明类库导出的 API。由于大部分 JavaScript 库只提供少数的顶级对象，所以命名空间是表示它们的好方法。我们叫它声明因为它不是“外部程序”的具体实现。它们通常是在 `.d.ts` 文件里定义的。如果你熟悉 C/C++，你可以把它们当做 `.h` 文件。例如流行的程序库 D3 在全局对象 `d3` 里定义它的功能。因为这个库通过一个 `<script>` 标签加载（不是通过模块加载器），它的声明文件使用内部模块来定义它的类型。为了让 TypeScript 编译器识别它的类型，我们使用外部命名空间声明。
```ts
// D3.d.ts（简化）
declare namespace D3 {
  export interface Selectors {
    select: {
      (selector: string): Selection;
      (element: EventTarget): Selection;
    };
  }
  export interface Event {
    x: number;
    y: number;
  }
  export interface Base extends Selectors {
    event: Event;
  }
}
declare var d3: D3.Base;
```

## 模块
1. 从 ECMAScript 2015 开始，JavaScript 有了模块的概念。TypeScript 与 es6 的模块基本是一致的。
2. TypeScript 与 ECMAScript 2015 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。
3. 相反地，如果一个文件不带有顶级的 `import` 或者 `export` 声明，那么它的内容被视为全局可见的（因此对模块也是可见的）。

### 导出
#### 导出声明
任何声明（例如变量、函数、类、类型别名或接口）都可以通过添加 `export` 关键字来导出。
```ts
// StringValidator.ts
export interface StringValidator {
  isAcceptable(s: string): boolean;
}
```
```ts
// ZipCodeValidator.ts
import { StringValidator } from "./StringValidator";
export const numberRegexp = /^[0-9]+$/;
export class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
```

#### 导出语句
当我们需要对导出的部分重命名时，导出语句很方便，所以上面的例子可以这样改写：
```ts
class ZipCodeValidator implements StringValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export { ZipCodeValidator };
export { ZipCodeValidator as mainValidator };
```

#### 重新导出
我们经常会去扩展其它模块，并且只导出那个模块的部分内容。重新导出功能并不会在当前模块导入那个模块或定义一个新的局部变量。
```ts
// ParseIntBasedZipCodeValidator.ts
export class ParseIntBasedZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && parseInt(s).toString() === s;
  }
}
// 导出原先的验证器但做了重命名
export { ZipCodeValidator as RegExpBasedZipCodeValidator } from "./ZipCodeValidator";
```
或者一个模块可以包裹多个模块，并把他们导出的内容联合在一起通过语法：`export * from "module"`。
```ts
// AllValidators.ts
export * from "./StringValidator"; // exports 'StringValidator' interface
export * from "./ZipCodeValidator"; // exports 'ZipCodeValidator' class and 'numberRegexp' constant value
export * from "./ParseIntBasedZipCodeValidator"; //  exports the 'ParseIntBasedZipCodeValidator' class
// and re-exports 'RegExpBasedZipCodeValidator' as alias
// of the 'ZipCodeValidator' class from 'ZipCodeValidator.ts' module.
```

### 导入
#### 导入一个模块中的单个导出内容
```ts
import { ZipCodeValidator } from "./ZipCodeValidator";
let myValidator = new ZipCodeValidator();
```
导入也可以重命名：
```ts
import { ZipCodeValidator as ZCV } from "./ZipCodeValidator";
let myValidator = new ZCV();
```

#### 将整个模块导入到单个变量中
```ts
import * as validator from "./ZipCodeValidator";
let myValidator = new validator.ZipCodeValidator();
```

#### 仅为副作用导入模块
一些模块会设置一些全局状态供其它模块使用。这些模块可能没有任何的导出或用户根本就不关注它的导出。
```ts
import "./my-module.js";
```

#### **导入类型**
从 TypeScript 3.8，可以使用 `import` 语句或使用 `import type` 导入类型。
```ts
import { APIResponseType } from "./api";
// 显式使用导入类型
import type { APIResponseType } from "./api";
// 显式导入一个值（getResponse）和一个类型（APIResponseType）
import { getResponse, type APIResponseType} from "./api";
```

### 默认导出
1. 每个模块都可以有一个 `default` 导出。
2. 默认导出使用 `default` 关键字标记；并且一个模块只能够有一个 `default` 导出。
3. 比如，像 JQuery 这样的类库可能有一个默认导出 `jQuery` 或 `$`，并且我们基本上也会使用同样的名字 `jQuery` 或 `$` 导入它。
```ts
// JQuery.d.ts
declare let $: JQuery;
export default $;

// App.ts
import $ from "jquery";
$("button.continue").html("Next Step...");
```
4. 类和函数声明可以直接被标记为默认导出。标记为默认导出的类和函数的名字是可以省略的。
```ts
// ZipCodeValidator.ts
export default class ZipCodeValidator {
  static numberRegexp = /^[0-9]+$/;
  isAcceptable(s: string) {
    return s.length === 5 && ZipCodeValidator.numberRegexp.test(s);
  }
}

// Test.ts
import validator from "./ZipCodeValidator";
let myValidator = new validator();
```
5. `default` 导出也可以是一个值。
```ts
// OneTwoThree.ts
export default "123";

// Log.ts
import num from "./OneTwoThree";
console.log(num); // "123"
```

### **export = 和 import = require()**
1. CommonJS 和 AMD 都有一个 `exports` 对象的概念，它包含一个模块的所有导出。
2. `exports` 可以被赋值为一个`对象`, 这种情况下其作用就类似于 es6 语法里的默认导出，即 `export default` 语法了。虽然作用相似，但是 `export default` 语法并不能兼容 CommonJS 和 AMD 的 `exports`。
3. 为了支持 CommonJS 和 AMD 的 `exports`, TypeScript 提供了 `export =` 语法。
4. `export =` 语法定义一个模块的导出`对象`，这可以是类、接口、命名空间、函数或枚举。
5. 使用 `export =` 导出一个模块，则必须使用 TypeScript 的特定语法 `import module = require("module")` 来导入此模块。
```ts
// ZipCodeValidator.ts
let numberRegexp = /^[0-9]+$/;
class ZipCodeValidator {
  isAcceptable(s: string) {
    return s.length === 5 && numberRegexp.test(s);
  }
}
export = ZipCodeValidator;
```
```ts
// Test.ts
import zip = require("./ZipCodeValidator");
let strings = ["Hello", "98052", "101"];
let validator = new zip();
strings.forEach((s) => {
  console.log(
    `"${s}" - ${validator.isAcceptable(s) ? "matches" : "does not match"}`
  );
});
```

### 可选的模块加载和其它高级加载场景
1. 有时候，你只想在某种条件下才加载某个模块。在 TypeScript 里，使用下面的方式来实现它和其它高级的加载场景，我们可以直接调用模块加载器并且可以保证类型完全。
2. 编译器会检测是否每个模块都会在生成的 JavaScript 中用到。如果一个模块标识符只在类型注解部分使用，并且完全没有在表达式中使用时，就不会生成 `require` 这个模块的代码。
3. 这种模式的核心是 `import id = require("...")` 语句可以让我们访问模块导出的类型。模块加载器会被动态调用（通过 `require`），就像下面 `if` 代码块里那样。它利用了省略引用的优化，所以模块只在被需要时加载。为了让这个模块工作，一定要注意 `import` 定义的标识符只能在表示类型处使用（不能在会转换成 JavaScript 的地方）。
4. 省略未使用的引用是一种很好的性能优化，并且还允许可选地加载这些模块。
5. 为了确保类型安全性，我们可以使用 `typeof` 关键字。当在表示类型的地方使用 `typeof` 关键字时，会得出一个类型值，这里就表示模块的类型。

#### Node.js 中的动态模块加载
```ts
declare function require(moduleName: string): any;
import { ZipCodeValidator as Zip } from "./ZipCodeValidator";
if (needZipValidation) {
  let ZipCodeValidator: typeof Zip = require("./ZipCodeValidator");
  let validator = new ZipCodeValidator();
  if (validator.isAcceptable("...")) {
    /* ... */
  }
}
```

### 使用其他 JavaScript 库
要想描述非 TypeScript 编写的类库的类型，我们需要声明类库所暴露出的 API。我们叫它声明因为它不是“外部程序”的具体实现。它们通常是在 `.d.ts` 文件里定义的。如果你熟悉 C/C++，你可以把它们当做 `.h` 文件。

#### 外部模块
在 Node.js 里大部分工作是通过加载一个或多个模块实现的。我们可以使用顶级的 `export` 声明来为每个模块都定义一个 `.d.ts` 文件，但最好还是写在一个大的 `.d.ts` 文件里。我们使用与构造一个外部命名空间相似的方法，但是这里使用 `module` 关键字并且把名字用引号括起来，方便之后 `import`。例如：
```ts
// node.d.ts（简化）
declare module "url" {
  export interface Url {
    protocol?: string;
    hostname?: string;
    pathname?: string;
  }
  export function parse(
    urlStr: string,
    parseQueryString?,
    slashesDenoteHost?
  ): Url;
}
declare module "path" {
  export function normalize(p: string): string;
  export function join(...paths: any[]): string;
  export var sep: string;
}
```
现在我们可以 `/// <reference> node.d.ts` 并且使用 `import url = require("url");` 或 `import * as URL from "url"` 加载模块。
```ts
/// <reference path="node.d.ts"/>
import * as URL from "url";
let myUrl = URL.parse("https://www.typescriptlang.org");
```
#### 外部模块简写
假如你不想在使用一个新模块之前花时间去编写声明，你可以采用声明的简写形式以便能够快速使用它。
```ts
// declarations.d.ts
declare module "hot-new-module";
```
```ts
// 简写模块里所有导出的类型将是any。
import x, { y } from "hot-new-module";
x(y);
```
#### 模块声明通配符
某些模块加载器如 SystemJS 和 AMD 支持导入非 JavaScript 内容。它们通常会使用一个前缀或后缀来表示特殊的加载语法。模块声明通配符可以用来表示这些情况。
```ts
declare module "*!text" {
  const content: string;
  export default content;
}
declare module "json!*" {
  const value: any;
  export default value;
}
```
现在你就可以导入匹配 `"*!text"` 或 `"json!*"` 的内容了。
```ts
import fileContent from "./xyz.txt!text";
import data from "json!http://example.com/data.json";
console.log(data, fileContent);
```
#### UMD 模块
有些模块被设计成兼容多个模块加载器，或者不使用模块加载器（全局变量）。它们以 UMD 模块为代表。这些库可以通过导入的形式或全局变量的形式访问。例如：
```ts
// math-lib.d.ts
export function isPrime(x: number): boolean;
export as namespace mathLib;
```
之后，这个库可以在某个模块里通过导入来使用：
```ts
import { isPrime } from "math-lib";
isPrime(2);
mathLib.isPrime(2); // 错误: 不能在模块内使用全局定义。
```
它同样可以通过全局变量的形式使用，但只能在某个脚本（指不带有模块导入或导出的脚本文件）里。
```ts
mathLib.isPrime(2);
```

### 构建模块的指南
#### 尽可能地在顶层导出
1. 用户应该更容易地使用你模块导出的内容，嵌套层次过多会变得难以处理。
2. 从你的模块中导出一个命名空间就是一个增加嵌套的例子。虽然命名空间有时候有它们的用处，在使用模块的时候它们额外地增加了一层，这对用户来说是很不便的并且通常是多余的。
3. 导出类的静态方法也有同样的问题 - 这个类本身就增加了一层嵌套。除非它能方便表述或便于清晰使用，否则请考虑直接导出一个辅助方法。

#### 如果仅导出单个 class 或 function，使用 export default
就像“在顶层上导出”帮助减少用户使用的难度，一个默认的导出也能起到这个效果。如果一个模块就是为了导出特定的内容，那么你应该考虑使用一个默认导出。这会令模块的导入和使用变得些许简单。
```ts
// MyClass.ts
export default class SomeType {
  constructor() { ... }
}

// MyFunc.ts
export default function getThing() {
  return "thing";
}

// Consumer.ts
import t from "./MyClass";
import f from "./MyFunc";
let x = new t();
console.log(f());
```
对用户来说这是最理想的。他们可以随意命名导入模块的类型（本例为 `t`）并且不需要多余的（`.`）来找到相关对象。

#### 如果要导出多个对象，把它们放在顶层里导出
```ts
// MyThings.ts
export class SomeType {
  /* ... */
}
export function someFunc() {
  /* ... */
}
```
相反地，当导入的时候需要明确地列出导入的名字：
```ts
// Consumer.ts
import { SomeType, someFunc } from "./MyThings";
let x = new SomeType();
let y = someFunc();
```

#### 当你要导入大量内容的时候使用命名空间导入模式
```ts
// MyLargeModule.ts
export class Dog { ... }
export class Cat { ... }
export class Tree { ... }
export class Flower { ... }

// Consumer.ts
import * as myLargeModule from "./MyLargeModule.ts";
let x = new myLargeModule.Dog();
```

#### 使用重新导出进行扩展
你可能经常需要去扩展一个模块的功能。JS 里常用的一个模式是 JQuery 那样去扩展原对象。如我们之前提到的，模块不会像全局命名空间对象那样去合并。推荐的方案是 不要去改变原来的对象，而是导出一个新的实体来提供新的功能。

假设 `Calculator.ts` 模块里定义了一个简单的计算器实现。这个模块同样提供了一个辅助函数来测试计算器的功能，通过传入一系列输入的字符串并在最后给出结果。
```ts
// Calculator.ts
export class Calculator {
  private current = 0;
  private memory = 0;
  private operator: string;
  protected processDigit(digit: string, currentValue: number) {
    if (digit >= "0" && digit <= "9") {
      return currentValue * 10 + (digit.charCodeAt(0) - "0".charCodeAt(0));
    }
  }
  protected processOperator(operator: string) {
    if (["+", "-", "*", "/"].indexOf(operator) >= 0) {
      return operator;
    }
  }
  protected evaluateOperator(
    operator: string,
    left: number,
    right: number
  ): number {
    switch (this.operator) {
      case "+":
        return left + right;
      case "-":
        return left - right;
      case "*":
        return left * right;
      case "/":
        return left / right;
    }
  }
  private evaluate() {
    if (this.operator) {
      this.memory = this.evaluateOperator(
        this.operator,
        this.memory,
        this.current
      );
    } else {
      this.memory = this.current;
    }
    this.current = 0;
  }
  public handleChar(char: string) {
    if (char === "=") {
      this.evaluate();
      return;
    } else {
      let value = this.processDigit(char, this.current);
      if (value !== undefined) {
        this.current = value;
        return;
      } else {
        let value = this.processOperator(char);
        if (value !== undefined) {
          this.evaluate();
          this.operator = value;
          return;
        }
      }
    }
    throw new Error(`Unsupported input: '${char}'`);
  }
  public getResult() {
    return this.memory;
  }
}
export function test(c: Calculator, input: string) {
  for (let i = 0; i < input.length; i++) {
    c.handleChar(input[i]);
  }
  console.log(`result of '${input}' is '${c.getResult()}'`);
}
```
下面使用导出的 `test` 函数来测试计算器。
```ts
// TestCalculator.ts
import { Calculator, test } from "./Calculator";
let c = new Calculator();
test(c, "1+2*33/11="); // 9
```
现在扩展它，添加支持输入其它进制（十进制以外）。
```ts
// ProgrammerCalculator.ts
import { Calculator } from "./Calculator";
class ProgrammerCalculator extends Calculator {
  static digits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F",];
  constructor(public base: number) {
    super();
    const maxBase = ProgrammerCalculator.digits.length;
    if (base <= 0 || base > maxBase) {
      throw new Error(`base has to be within 0 to ${maxBase} inclusive.`);
    }
  }
  protected processDigit(digit: string, currentValue: number) {
    if (ProgrammerCalculator.digits.indexOf(digit) >= 0) {
      return (
        currentValue * this.base + ProgrammerCalculator.digits.indexOf(digit)
      );
    }
  }
}
// Export the new extended calculator as Calculator
export { ProgrammerCalculator as Calculator };
export { test } from "./Calculator";
```
新的 `ProgrammerCalculator` 模块导出的 API 与原先的 `Calculator` 模块很相似，但却没有改变原模块里的对象。
```ts
// TestProgrammerCalculator.ts
import { Calculator, test } from "./ProgrammerCalculator";
let c = new Calculator(2);
test(c, "001+010="); // 3
```

#### 模块里不要使用命名空间
当初次进入基于模块的开发模式时，可能总会控制不住要将导出包裹在一个命名空间里。模块具有其自己的作用域，并且只有导出的声明才会在模块外部可见。记住这点，命名空间在使用模块时几乎没什么价值。

在组织方面，命名空间对于在全局作用域内对逻辑上相关的对象和类型进行分组是很便利的。例如，在 C# 里，你会从 `System.Collections` 里找到所有集合的类型。通过将类型有层次地组织在命名空间里，可以方便用户找到与使用那些类型。然而，模块本身已经存在于文件系统之中，我们必须通过路径和文件名找到它们，这已经提供了一种逻辑上的组织形式。例如我们可以创建 `/collections/generic/` 文件夹，把相应模块放在这里面。

命名空间对解决全局作用域里命名冲突来说是很重要的。比如，你可以有一个 `My.Application.Customer.AddForm` 和 `My.Application.Order.AddForm` -- 两个类型的名字相同，但命名空间不同。然而，这对于模块来说却不是一个问题。在一个模块里，没有理由两个对象拥有同一个名字。从模块的使用角度来说，使用者会挑出他们用来引用模块的名字，所以也没有理由发生重名的情况。

#### 常见错误
- 文件的顶层声明是 `export namespace Foo { ... }`（删除 `Foo` 并把所有内容向上层移动一层）。
- 文件只有一个 `export class` 或 `export function`（考虑使用 `export default`）。
- 多个文件的顶层具有同样的 `export namespace Foo {`（不要以为这些会合并到一个 `Foo` 中！）。

## 命名空间和模块
### 使用命名空间
1. 命名空间是一种特定于 TypeScript 的代码组织方式。
2. 命名空间只是在全局命名空间中一个普通的带有名字的 JavaScript 对象，这使得命名空间成为一个非常简单的结构来使用。
3. 与模块不同，它们可以跨越多个文件，并可以通过 `--outFile` 标志结合在一起。
4. 命名空间是在 Web 应用程序中构建代码的好方法，你可以把所有依赖都放在 HTML 页面的 `<script>` 标签里。
5. 但就像其它的全局命名空间污染一样，它很难去识别组件之间的依赖关系，尤其是在大型的应用中。

### 使用模块
1. 像命名空间一样，模块可以包含代码和声明。不同的是模块可以**声明它的依赖**。
2. 模块还依赖于模块加载器（例如 CommonJs/Require.js）或支持 ES 模块的运行时。对于小型的JS应用来说可能没必要，但是对于大型应用，这一点点的花费会带来长久的模块化和可维护性上的便利。模块也提供了更好的代码重用，更强的封闭性以及更好的使用工具进行优化。
3. 对于 Node.js 应用来说，模块是默认并推荐的组织代码的方式，*我们建议在现代代码中使用模块而不是名称空间*。
4. 从 ECMAScript 2015 开始，模块成为了语言内置的部分，应该会被所有正常的解释引擎所支持。因此，对于新项目来说推荐使用模块做为组织代码的方式。

### 常见陷阱
这部分我们会描述常见的命名空间和模块的使用陷阱和如何去避免它们。
1. 一个常见的错误是使用 `/// <reference ... />` 语法来引用模块文件，而不是使用 `import` 语句。要理解这之间的区别，我们首先应该弄清编译器是如何根据 `import` 路径（例如 `import x from "...";` 或 `import x = require("...")` 里面的 `...`）来定位模块的类型信息的。编译器首先尝试去查找相应路径下的 `.ts`，`.tsx`，然后是 `.d.ts`。如果这些文件都找不到，编译器会查找 *外部模块声明*。回想一下，这些需要在 `.d.ts` 文件中声明。
- `myModules.d.ts`
```
// 在 .d.ts 文件或不是模块的 .ts 文件中：
declare module "SomeModule" {
  export function fn(): string;
}
```
- `myOtherModule.ts`
```
/// <reference path="myModules.d.ts" />
import * as m from "SomeModule";
```
这里的引用标签指定了外来模块的位置。这就是一些 TypeScript 例子中引用 `node.d.ts` 的方法。

2. 不必要的命名空间。假如有以下文件：
```ts
// shapes.ts
export namespace Shapes {
  export class Triangle {
    /* ... */
  }
  export class Square {
    /* ... */
  }
}
```
这里的顶级命名空间 `Shapes` 包裹了 `Triangle` 和 `Square`。对于使用它的人来说这是令人迷惑和讨厌的：
```ts
// shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Shapes.Triangle(); // shapes.Shapes?
```
TypeScript 里模块的一个特点是不同的模块永远也不会在相同的作用域内使用相同的名字。因为使用模块的人会为它们命名，所以完全没有必要把导出的符号包裹在一个命名空间里。

再次重申，不应该对模块使用命名空间，使用命名空间是为了提供逻辑分组和避免命名冲突。模块文件本身已经是一个逻辑分组，并且它的名字是由导入这个模块的代码指定，所以没有必要为导出的对象增加额外的模块层。

下面是改进后的例子：
```ts
// shapes.ts
export class Triangle {
  /* ... */
}
export class Square {
  /* ... */
}
```
```ts
// shapeConsumer.ts
import * as shapes from "./shapes";
let t = new shapes.Triangle();
```
3. 就像每个 JS 文件对应一个模块一样，TypeScript 里模块文件与生成的 JS 文件也是一一对应的。这会产生一种影响，根据你指定的目标模块系统的不同，你可能无法连接多个模块源文件。例如当目标模块系统为 `commonjs` 或 `umd` 时，无法使用 `outFile` 选项。但是在 TypeScript 1.8 以上的版本，当 `target` 为 `amd` 或 `system` 时[能够](https://www.tslang.cn/docs/release-notes/typescript-1.8.html#concatenate-amd-and-system-modules-with---outfile)使用 `outFile` 选项。

## 声明合并
1. TypeScript 中有些独特的概念可以在类型层面上描述 JavaScript 对象的模型。这其中尤其独特的一个例子是“声明合并”的概念。
2. 声明合并是指编译器将针对同一个名字的两个独立声明合并为单一声明。合并后的声明同时拥有原先两个声明的特性，任何数量的声明都可被合并，不局限于两个声明。
3. 理解了这个概念，将有助于操作现有的 JavaScript 代码。同时，也会有助于理解更多高级抽象的概念。

### 基础概念
TypeScript 中的声明会创建以下三种实体之一：命名空间，类型或值。下表说明了声明类型都创建了什么实体：

| 声明类型 | 创建了命名空间 | 创建了类型 | 创建了值 |
| ---------- | ------- | ----- | ---- |
| Namespace  | √       |       | √    |
| Class      |         | √     | √    |
| Enum       |         | √     | √    |
| Interface  |         | √     |      |
| Type Alias |         | √     |      |
| Function   |         |       | √    |
| Variable   |         |       | √    |

创建命名空间的声明会新建一个命名空间，它包含了用（`.`）符号来访问时使用的名字。创建类型的声明是：用声明的模型创建一个类型并绑定到给定的名字上。最后，创建值的声明会创建在 JavaScript 输出中看到的值。

### 合并接口
最简单也最常见的声明合并类型是接口合并。从根本上说，合并的机制是把双方的成员放到一个同名的接口里。
```ts
interface Box {
  height: number;
  width: number;
}
interface Box {
  scale: number;
}
let box: Box = { height: 5, width: 6, scale: 10 };
```
- 接口的非函数的成员应该是唯一的。如果它们不是唯一的，那么它们必须是相同的类型。如果两个接口中同时声明了同名的非函数成员且它们的类型不同，则编译器会报错。
- 对于函数成员，每个同名函数声明都会被当成这个函数的一个重载。同时需要注意，当接口 `A` 与后面的接口 `A` 合并时，后面的接口具有更高的优先级。
```ts
interface Cloner {
  clone(animal: Animal): Animal;
}
interface Cloner {
  clone(animal: Sheep): Sheep;
}
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
}
```
这三个接口将合并成一个声明，每组接口里的声明顺序保持不变，但各组接口之间的顺序是后来的接口重载出现在靠前位置。
```ts
interface Cloner {
  clone(animal: Dog): Dog;
  clone(animal: Cat): Cat;
  clone(animal: Sheep): Sheep;
  clone(animal: Animal): Animal;
}
```
有一个例外是当出现特殊的函数签名时，如果签名里有一个参数的类型是 *单一的字符串字面量*（例如不是字符串字面量的联合类型），那么它将会被提升到重载列表的最顶端。
```ts
interface Document {
  createElement(tagName: any): Element;
}
interface Document {
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
}
interface Document {
  createElement(tagName: string): HTMLElement;
  createElement(tagName: "canvas"): HTMLCanvasElement;
}
```
合并后的 `Document` 如下：
```ts
interface Document {
  createElement(tagName: "canvas"): HTMLCanvasElement;
  createElement(tagName: "div"): HTMLDivElement;
  createElement(tagName: "span"): HTMLSpanElement;
  createElement(tagName: string): HTMLElement;
  createElement(tagName: any): Element;
}
```

### 合并命名空间
与接口类似，同名的命名空间也会合并它们的成员。由于命名空间同时创建命名空间和值，我们需要了解两者如何合并。
1. 为了合并命名空间，模块导出的同名接口进行合并，构成单一命名空间，内含合并后的接口。
2. 对于命名空间里值的合并，如果当前已经存在给定名字的命名空间，那么后来的命名空间的导出成员会被添加到第一个命名空间来扩展它。
```ts
namespace Animals {
  export class Zebra {}
}
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Dog {}
}
```
合并后：
```ts
namespace Animals {
  export interface Legged {
    numberOfLegs: number;
  }
  export class Zebra {}
  export class Dog {}
}
```
3. 非导出成员仅在其原有的（合并前的）命名空间内可见，也就是说合并之后，从其它命名空间合并进来的成员无法访问非导出成员。
```ts
namespace Animal {
  let haveMuscles = true;
  export function animalsHaveMuscles() {
    return haveMuscles;
  }
}
namespace Animal {
  export function doAnimalsHaveMuscles() {
    return haveMuscles; // Error, because haveMuscles is not accessible here
  }
}
```
因为 `haveMuscles` 并没有导出，只有 `animalsHaveMuscles` 函数共享了原始未合并的命名空间可以访问这个变量。`doAnimalsHaveMuscles` 函数虽是合并命名空间的一部分，但是访问不了未导出的成员。

### 将命名空间与类、函数和枚举合并
命名空间足够灵活，可以与其他类型的声明合并。只要命名空间的定义符合将要合并类型的定义，合并结果包含两者的声明类型。TypeScript 使用这个功能去实现一些 JavaScript 里的设计模式。
1. 将命名空间与类合并，这为用户提供了一种描述内部类的方法。
```ts
class Album {
  label: Album.AlbumLabel;
}
namespace Album {
  export class AlbumLabel {};
  export const num = 10;
}
console.log(new Album().label, Album.AlbumLabel, Album.num) // undefined [Function: AlbumLabel] 10
```
- 命名空间内的成员必须导出，合并后的类才能访问。
- 命名空间内导出的成员，相当于合并后类的静态属性。
- 命名空间要放在类的定义后面。

2. 创建一个函数稍后扩展它增加一些属性也是很常见的。TypeScript 使用声明合并来达到这个目的并保证类型安全。
```ts
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix;
}
namespace buildLabel {
  export let suffix = "";
  export let prefix = "Hello, ";
}
console.log(buildLabel('Mr.Pioneer')) // Hello, Mr.Pioneer.C
```
3. 同样，命名空间可用于扩展具有静态成员的枚举。
```ts
enum Color {
  red = 1,
  green = 2,
  blue = 4,
}
namespace Color {
  export function mixColor(colorName: string) {
    if (colorName == "yellow") {
      return Color.red + Color.green;
    } else if (colorName == "white") {
      return Color.red + Color.green + Color.blue;
    } else if (colorName == "magenta") {
      return Color.red + Color.blue;
    } else if (colorName == "cyan") {
      return Color.green + Color.blue;
    }
  }
}
console.log(Color.mixColor('yellow')); // 3
```
4. 目前，类不能与其它类或变量合并。

### 模块扩展
虽然 JavaScript 模块不支持合并，但你可以为导入的对象打补丁以更新它们。
```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
Observable.prototype.map = function (f) {
  // ... another exercise for the reader
};
```
这在 TypeScript 中也能正常工作，但编译器不知道 `Observable.prototype.map`，你可以使用扩展模块来将它告诉编译器：
```ts
// observable.ts
export class Observable<T> {
  // ... implementation left as an exercise for the reader ...
}

// map.ts
import { Observable } from "./observable";
declare module "./observable" {
  interface Observable<T> {
    map<U>(f: (x: T) => U): Observable<U>;
  }
}
Observable.prototype.map = function(f) {
  let rets = f(1);
  return new Observable<typeof rets>();
};

// consumer.ts
import { Observable } from "./observable";
import "./map";
let o: Observable<number> = new Observable();
o.map((x) => x.toFixed());
```
模块名的解析和用 `import`/`export` 解析模块标识符的方式是一致的，当这些声明在扩展中合并时，就好像在原始位置被声明了一样。但是有两个限制：
1. 不能在扩展中声明新的顶级声明－仅可以扩展模块中已经存在的声明。
2. 默认导出也不能扩展－只能扩展命名导出。因为需要通过导出名称扩展导出，而 `default` 是保留字。

### 全局扩展
1. 还可以从模块内部向全局范围添加声明。
2. 全局扩展与模块扩展的行为和限制是相同的。
3. 像 JQuery 那样，在浏览器中全局就可以访问的对象，通常我们会使用 `namespace`，好处就是防止命名冲突。
4. 通常全局变量在源码中会有如下特性：
- 顶级的 `var` 语句或 `function` 声明。
- 挂载变量到 `window` 上。
```ts
export class Observable<T> {
  // ... still no implementation ...
}
declare global {
  interface Array<T> {
    toObservable(): Observable<T>;
  }
}
Array.prototype.toObservable = function () {
  return {};
};

namespace jQuery {
  export let $: { version: number };
}
let $ = jQuery.$;
declare global {
  interface Window {
    $
  }
}
```