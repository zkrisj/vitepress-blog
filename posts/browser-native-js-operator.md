---
date: 20:03 2023/3/23
title: 几个新的高效浏览器原生 JS 运算符
tags:
- JS
description: 空值合并 、可选链、求幂、数字取整、标签函数。
---
## 介绍
运算符包括赋值，比较，算数，位运算，逻辑，模板字符串，三元等。

## 空值合并
从 chrome 80 开始支持，空值合并运算符（??）是一个逻辑运算符，当左侧的操作数为 null 或者 undefined 时，返回其右侧操作数，否则返回左侧操作数。

1. 与布尔逻辑或运算符（||）不同，布尔逻辑或运算符会在左侧操作数为假值时返回右侧操作数。也就是说，如果使用 || 来为某些变量设置默认值，可能会遇到意料之外的行为，比如为假值 ''、0 或 NaN 时同样会返回右侧操作数。
```js
null ?? 'default' // default
'' ?? 'default' // ''
1 ?? 'default' // 1
NaN ?? 'default' // NaN

'' || 'default' // default
NaN || 'default' // default
```
2. 与布尔逻辑或（||）、布尔逻辑与（&&）运算符相同，当左表达式不为 null 或 undefined 时，不会对右表达式进行求值。
```js
function A() { console.log('函数 A 被调用了'); return undefined; }
function B() { console.log('函数 B 被调用了'); return false; }
function C() { console.log('函数 C 被调用了'); return "foo"; }

console.log( A() ?? C() );
// 依次打印 "函数 A 被调用了"、"函数 C 被调用了"、"foo"
// A() 返回了 undefined，所以运算符两边的表达式都被执行了

console.log( B() ?? C() );
// 依次打印 "函数 B 被调用了"、"false"
// B() 返回了 false（既不是 null 也不是 undefined）
// 所以右侧表达式没有被执行
```
3. 目前，空值合并运算符和其他逻辑运算符之间的运算优先级/运算顺序是未定义的，将它们组合使用会抛出 SyntaxError。但是，可以使用括号来显式指定运算优先级。
```js
null || undefined ?? "foo"; // SyntaxError
true || undefined ?? "foo"; // SyntaxError
(null || undefined ) ?? "foo"; // foo
```

## 可选链
从 chrome 80 开始支持，可选链运算符（?.）的功能类似于 `.` 链式运算符，不同之处在于，?. 运算符不必明确验证链中的每个引用是否有效，在引用为空 (null 或者 undefined) 的情况下不会引起错误。当尝试访问可能不存在的对象属性时，可选链运算符将会使表达式更短、更简明。在探索一个对象的内容时，如果不能确定哪些属性必定存在，可选链运算符是很有帮助的。
```js
obj.val?.prop
// 使用方括号与属性名表示法
obj.val?.[expr]
// 调用可选链函数
obj.func?.(args)
```
1. 当在表达式中使用可选链时，如果左操作数是 null 或 undefined，表达式将不会被继续计算。
```js
const potentiallyNullObj = null;
let x = 0;
const prop = potentiallyNullObj?.[x++];

console.log(x); // x 将不会被递增，依旧输出 0

potentiallyNullObj?.a.b; // 不会引起错误，因为在第一个可选链已经终止计算

// 如果对可选链的一部分进行分组，则仍将计算后续的属性
(potentiallyNullObj?.a).b; // TypeError: Cannot read properties of undefined (reading 'b')
```
2. 不能用于赋值。
```js
const object = {};
object?.property = 1; // SyntaxError: Invalid left-hand side in assignment
```
3. 不能用于未声明的变量。
```js
undeclaredVar?.prop; // ReferenceError
```
4. 可选链联合空值合并使用：
```js
const customer = {};
const customerCity = customer?.city ?? "Unknown";
console.log(customerCity); // Unknown
```

## 求幂
求幂运算符（**）返回将第一个操作数加到第二个操作数的幂的结果。
- 等效于 Math.pow，不同之处在于它也接受 BigInt 作为操作数。
- 求幂运算符是右结合的: a ** b ** c 等于 a ** (b ** c)。
- 不能将一个一元运算符（+/-/~/!/delete/void/typeof）放在基数前，这样会导致一个不明确的求幂表达式，抛出语法错误。
- 可以与等号结合，形成一个求幂赋值运算符。
```js
3 ** 4 //  81
10 ** -2 //  0.01
2 ** 3 ** 2 //  512
(2 ** 3) ** 2 //  64

-(2 ** 2) //  -4
(-2) ** 2 //  4
-2 ** 2 //  SyntaxError

let a = 3;
a **= 2 //  9
a **= 'hello' //  NaN
```

## 数字取整
二进制按位非运算符（~）将每个二进制位都变为相反值（将二进制位码 0 变为 1，1 变为 0），可以简单记忆成，一个数与自身的取反值相加，等于 -1。
- 对一个整数连续两次二进制按位非运算，将得到它自身。
- 所有的位运算都只对整数有效，当二进制否运算遇到小数时，会将小数部分舍去，只保留整数部分。
- 所以，对一个小数连续进行两次二进制按位非运算，能达到取整效果。
- 近似等效于 Math.trunc，但 Math.trunc 对于 NaN 和非数字都返回 NaN，而 ~~ 都返回 0。
- 使用二进制否运算取整，是所有取整方法中最快的一种。
```js
~ 3 // -4
~ -3 // 2
~ NaN // -1

~~3 // 3
~~-2.9 // -2
~~1.9999 // 1

Math.trunc('a') // NaN
Math.trunc(NaN) // NaN
~~'a' // 0
~~NaN // 0
```

## 标签函数
标签函数用来解析模板字符串。当我们使用模板字符串时，模板字符串和占位符表达式被传递给一个默认解析函数。默认函数仅执行字符串插值以替换占位符，然后将部分连接成单个字符串。标签函数即是提供自己的解析函数，在模板文字前加上函数名称（结果称为标记模板），模板文字会被传递给标签函数，然后可以在其中对模板文字的不同部分执行想要的任何操作。
- 标签函数的第一个参数是包含一个字符串值的数组，它的长度等于占位符表达式的数量加一，因此总是非空的。
- 为了进一步保证数组值的稳定性，第一个参数和它的 raw 属性都被冻结了，所以不能以任何方式改变它们。
- 其余的参数是模板字符串中的占位符表达式（${expression}）。
```js
const person = "Mike";
const age = 28;

function myTag(strings, personExp, ageExp) {
  const str0 = strings[0]; // "That "
  const str1 = strings[1]; // " is a "
  const str2 = strings[2]; // "."

  const ageStr = ageExp > 99 ? "centenarian" : "youngster";

  // 还可以返回使用默认模板文本构建的字符串
  return `${str0}${personExp}${str1}${ageStr}${str2}`;
}

const output = myTag`That ${person} is a ${age}.`;
console.log(output); // That Mike is a youngster.
```
- 标签函数甚至不需要返回字符串。
```js
function template(strings, ...keys) {
  return (...values) => {
    const dict = values[values.length - 1] || {};
    const result = [strings[0]];
    keys.forEach((key, i) => {
      const value = Number.isInteger(key) ? values[key] : dict[key];
      result.push(value, strings[i + 1]);
    });
    return result.join("");
  };
}
const t1Closure = template`${0}${1}${0}!`; // 相当于 template(["","","","!"],0,1,0)
t1Closure("Y", "A"); // YAY!

const t2Closure = template`${0} ${"foo"}!`; // 相当于 template([""," ","!"],0,"foo");
t2Closure("Hello", { foo: "World" }); // Hello World!

// 相当于 template(["I'm ", ". I'm almost ", " years old."], "name", "age");
const t3Closure = template`I'm ${"name"}. I'm almost ${"age"} years old.`;
t3Closure({ name: "MDN", age: 30 }); // I'm MDN. I'm almost 30 years old.
```
- 标签也不必是函数，可以是属性访问、函数调用、任何优先级大于 16 的表达式，甚至是另一个标记模板。
```js
console.log`Hello`; // [ 'Hello' ]
console.log.bind(null, 2)`Hello`; // 2 [ 'Hello' ]
new Function("console.log(arguments)")`Hello`; // [Arguments] { '0': [ 'Hello' ] }

function recursive(strings, ...values) {
  console.log(strings, values);
  return recursive;
}
recursive`Hello``World`;
// [ 'Hello' ] []
// [ 'World' ] []
```
- 可选链会引发语法错误。
```js
console?.log`Hello`; // SyntaxError: Invalid tagged template on optional chain
```
- 一个模板字符串标签函数始终使用完全相同的字符串数组参数，无论模板字符串被解析多少次。
```js
const callHistory = [];

function tag(strings, ...values) {
  callHistory.push(strings);
  return {}; // 返回一个新对象
}

function evaluateLiteral() {
  return tag`Hello, ${"world"}!`;
}

console.log(callHistory[0] === callHistory[1]); // true
console.log(evaluateLiteral() === evaluateLiteral()); // false 每次返回的是一个新对象

const strings = callHistory[0], { raw } = strings;
console.log(Object.isExtensible(strings), Object.isExtensible(raw)); // false false
```

## 参考资料
- [MDN Template literals (Template strings)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)