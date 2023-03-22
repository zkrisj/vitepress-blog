---
date: 21:39 2023/3/22
title: 如何使用严格模式
tags:
- JS
description: 严格模式体现了 Javascript 更合理、更安全、更严谨的发展方向，有助于更细致深入地理解 Javascript，让你变成一个更好的程序员。
---
## 介绍
$\color{lime}{ECMAScript 5}$ 开始添加了严格模式，在多个方面改变了 JavaScript 的语义，使 Javascript 在更严格的条件下运行，浏览器能更容易的解析代码，现在已经被大多浏览器实现（包括 IE10）。

它的产生是为了形成与正常代码不同的语义，而不仅仅是 JavaScript 的一个子集，主要目的是：
- 消除 Javascript 语法的一些不合理、不严谨之处，减少一些怪异行为；
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 修复了一些导致 JavaScript 引擎难以执行优化的缺陷，相同的代码，严格模式可以比非严格模式下运行得更快。
- 为新版本的 Javascript 做好铺垫。

## 使用
严格模式可以应用到整个脚本或个别函数中。在 eval 、Function 、内联事件处理属性、WindowTimers.setTimeout() 方法中传入的脚本字符串，其行为类似于开启了严格模式的一个单独脚本，它们会如预期一样工作。**在单独的封闭大括弧 {} 内声明是没有效果的。**
### 整个脚本文件
为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句 "use strict";（或 'use strict';）。
```js
// 整个脚本都开启严格模式的语法
"use strict";
let s = "Hi!  I'm a strict mode script!";
```
这种语法存在陷阱，合并均为严格模式的脚本或均为非严格模式的都没问题，但在合并严格模式与非严格模式时可能会有问题。所以不能盲目的合并冲突代码，建议按一个个函数去开启严格模式（至少在学习的过渡期要这样做）。

### 单个函数
要给某个函数开启严格模式，要把 "use strict";（或 'use strict';）声明放在函数体所有语句之前。
```js
function strict() {
  // 函数级别严格模式语法
  'use strict';
  function nested() {
    return "And so am I!";
  }
  return "Hi!  I'm a strict mode function!  " + nested();
}

function notStrict() {
  return "I'm not strict.";
}
```

## 语法和行为
严格模式同时改变了语法及运行时行为，变化通常分为这几类：将问题直接转化为错误（如语法错误或运行时错误）, 简化了如何为给定名称的特定变量计算，简化了 eval 以及 arguments。

### 静默错误转成异常|语法错误
JavaScript 被设计为能使新人开发者更易于上手，所以有时候会给错误操作赋予不报错误的语义 (non-error semantics)。有时候这可以解决当前的问题，但有时候却会给以后留下更大的问题。严格模式则把这些失误当成错误，以便可以发现并立即将其改正。
1. 不能隐式声明全局变量。
```js
"use strict";
// ReferenceError: mistypedVariable is not defined
mistypedVariable = 17;
```
2. 不能给不可写属性，只读属性 (getter-only) ，不可扩展对象 (non-extensible object) 的新属性赋值。
```js
"use strict";

// 给不可写属性赋值
let obj1 = {};
Object.defineProperty(obj1, "x", { value: 42, writable: false });
obj1.x = 9; // 抛出 TypeError 错误

// 给只读属性赋值
let obj2 = { get x() { return 17; } };
obj2.x = 5; // 抛出 TypeError 错误

// 给不可扩展对象的新属性赋值
let fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = "ohai"; // 抛出 TypeError 错误
```
3. 不能删除不可删除的属性。
```js
"use strict";
delete Object.prototype; // 抛出 TypeError 错误
```
3. 函数不能有重名参数。正常模式下最后一个重名参数名会掩盖之前的重名参数，之前的参数仍然可以通过 `arguments[i]` 来访问。
```js
function sum(a, a, c) { // !!! 语法错误
  "use strict";
  return a + a + c; // 代码运行到这里会出错
}
```
4. 禁止八进制数字语法。在 ECMAScript 6 中支持为一个数字加"0o"的前缀来表示八进制数，例如 `0644 === 420` 还有 `"\045" === "%"`。
```js
"use strict";
let sum = 015 + // !!! 语法错误
          197 +
          142;
```
5. 禁止设置原始类型的属性。不采用严格模式，设置属性将会简单忽略 (no-op)。
```js
(function() {
  "use strict";

  false.true = "";              //TypeError
  (14).sailing = "home";        //TypeError
  "with".you = "far away";      //TypeError
})();
```

### 简化变量的使用
Javascript 语言的一个特点，就是允许"动态绑定"，即某些属性和方法到底属于哪一个对象，不是在编译时确定的，而是在运行时（runtime）确定的。严格模式简化了代码中变量名字映射到变量定义的方式。很多编译器的优化是依赖存储变量的位置的能力，这对全面优化 JavaScript 代码至关重要。严格模式移除了大多数这种情况的发生，所以编译器可以更好的优化严格模式的代码。
1. 禁用 `with`。`with` 所引起的问题是块内的任何名称可以映射 (map) 到 `with` 传进来的对象的属性，也可以映射到包围这个块的作用域内的变量 (甚至是全局变量), 这一切都是在运行时决定的：在代码运行之前是无法得知的。
```js
"use strict";
let x = 17;
const obj = { x: 1 };
with (obj) { // !!! 语法错误
  // 如果没有开启严格模式，with 中的这个 x 会指向 with 上面的那个 x，还是 obj.x？
  // 如果不运行代码，我们无法知道，因此，这种代码让引擎无法进行优化，速度也就会变慢。
  x;
}
```
一种取代 `with` 的简单方法是，将目标对象赋给一个短命名变量，然后访问这个变量上的相应属性。

2. `eval` 不再为上层范围 (包围 eval 代码块的范围) 引入新变量，仅仅为被运行的代码创建变量。在正常模式下， 代码 `eval("let x;")` 会给上层函数或者全局引入一个新的变量 `x`，这意味着，在一个包含 `eval` 调用的函数内所有没有引用到参数或者局部变量的名称都必须在运行时才能被映射到特定的定义 (因为 `eval` 可能引入的新变量会覆盖它的外层变量)。
```js
let x = 17;
let evalX = eval("'use strict'; let x = 42; x");
console.assert(x === 17);
console.assert(evalX === 42);
```
3. 禁止删除声明变量。
```js
"use strict";

let x;
delete x; // !!! 语法错误

eval("let y; delete y;"); // !!! 语法错误
```

### 让 eval 和 arguments 变的简单
严格模式让 `arguments` 和 `eval` 少了一些奇怪的行为。两者在通常的代码中都包含了很多奇怪的行为：`eval` 会添加删除绑定，改变绑定好的值，还会通过用它索引过的属性给形参取别名的方式修改形参。虽然在未来的 ECMAScript 版本解决这个问题之前，是不会有补丁来完全修复这个问题，但严格模式下将 `eval` 和 `arguments` 作为关键字对于此问题的解决是很有帮助的。
1. 名称 eval 和 arguments 不能通过程序语法被绑定 (be bound) 或赋值。以下的所有尝试将引起语法错误：
```js
"use strict";
eval = 17;
arguments++;
++eval;
let obj = { set p(arguments) { } };
let eval;
try { } catch (arguments) { }
function x(eval) { }
function arguments() { }
let y = function eval() { };
let f = new Function("arguments", "'use strict'; return 17;");
```
2. 参数的值不会随 `arguments` 对象的值的改变而变化。在正常模式下，对于第一个参数是 `arg` 的函数，对 `arg` 赋值时会同时赋值给 `arguments[0]`，反之亦然（除非没有参数，或者 `arguments[0]` 被删除）。严格模式下，函数的 `arguments` 对象会保存函数被调用时的原始参数。`arguments[i]` 的值不会随与之相应的参数的值的改变而变化，同名参数的值也不会随与之相应的 `arguments[i]` 的值的改变而变化。
```js
function f(a) {
  "use strict";
  a = 42;
  return [a, arguments[0]];
}
let pair = f(17);
console.assert(pair[0] === 42);
console.assert(pair[1] === 17);
```
3. 不再支持 `arguments.callee`。正常模式下，`arguments.callee` 指向当前正在执行的函数。这个作用很小：直接给执行函数命名就可以了！此外，`arguments.callee` 十分不利于优化，例如内联函数，因为 `arguments.callee` 会依赖对非内联函数的引用。
```js
"use strict";
let f = function() { return arguments.callee; };
f(); // 抛出类型错误
```

## "安全的" JavaScript
在浏览器环境下，JavaScript 能够获取用户的隐私信息，因此，此类 JavaScript 在运行之前必须进行部分转换，以审查对被禁止功能的访问。JavaScript 的灵活性使得在没有运行时检查的情况下不可能有效地做到这一点。开启严格模式并且**用特定的方式调用**，就会大大减少在执行时进行检查的必要，从而避免引起性能损耗。
1. `this` 不再被封装为对象，而且如果没有指定 `this` 的话它值是 `undefined`。对一个普通的函数来说，`this` 总会是一个对象：不管调用时 `this` 它本来就是一个对象；还是用布尔值，字符串或者数字调用函数时函数里面被封装成对象的 `this`；还是使用 `undefined` 或者 `null` 调用函数时 `this` 指向的全局对象。**这种自动转化为对象的过程不仅是一种性能上的损耗，同时在浏览器中暴露出全局对象也会成为安全隐患，因为全局对象提供了访问那些所谓安全的 JavaScript 环境必须限制的功能的途径。**
```js
"use strict";
function fun() { return this; }
console.assert(fun() === undefined);
console.assert(fun.call(2) === 2);
console.assert(fun.apply(null) === null);
console.assert(fun.call(undefined) === undefined);
console.assert(fun.bind(true)() === true);
```
2. `fun.caller` 和 `fun.arguments` 都是不可删除的属性而且在存值、取值时都会报错。在普通模式下使用这些广泛实现的 ECMAScript 扩展时，当一个叫 `fun` 的函数正在被调用的时候，`fun.caller` 是最后一个调用 `fun` 的函数，而且 `fun.arguments` 包含调用 `fun` 时用的形参。
> 在一些旧时的 ECMAScript 实现中 `arguments.caller` 曾经是一个对象，里面存储的属性指向那个函数的变量。这是一个安全隐患，因为它通过函数抽象打破了本来被隐藏起来的保留值；它同时也是引起大量优化工作的原因。出于这些原因，现在的浏览器没有实现它。
```js
function restricted() {
  "use strict";
  restricted.caller;    // 抛出类型错误
  restricted.arguments; // 抛出类型错误
}

restricted();
```

## 为未来的 ECMAScript 版本铺平道路
未来版本的 ECMAScript 很有可能会引入新语法，ECMAScript5 中的严格模式就提早设置了一些限制来减轻之后版本改变产生的影响。如果提早使用了严格模式中的保护机制，那么做出改变就会变得更容易。
- `implements`, `interface`, `let`, `package`, `private`, `protected`, `public`, `static`和`yield` 变成了保留的关键字，不能再作为变量名或者形参名。
```js
function package(protected) { // !!!
  "use strict";
  let implements; // !!!

  interface: // !!!
  while (true) {
    break interface; // !!!
  }

  function private() { } // !!!
}
function fun(static) { 'use strict'; } // !!!
```

## 总结
"严格模式"体现了 Javascript 更合理、更安全、更严谨的发展方向，有助于更细致深入地理解 Javascript，让你变成一个更好的程序员。
