---
date: 23:40 2023/3/22
title: call()、apply()、bind() 的使用场景
tags:
- JS
description: 每个 JavaScript 函数都是一个 Function 对象：(function () {}).constructor === Function 返回 true。
---
## 介绍
每个 JavaScript 函数都是一个 Function 对象：(function () {}).constructor === Function 返回 true。

Function 对象有自己的属性。
```js
function f(p1, p2) {}
console.log(f.length); // 2
console.log(f.name); // "f"

```

Function 对象也有自己的构造函数。
```js
const sum = new Function('a', 'b', 'return a + b');
console.log(sum(2, 6)); // 8
```

在 Function.prototype 上面共有四个方法：
- Function.prototype.apply()
    - 调用函数并给定 this 值，参数通过数组或类数组对象传递。
- Function.prototype.bind()
    - 创建一个新函数，并给定 this 值，参数通过列表传递。
- Function.prototype.call()
    - 调用函数并给定 this 值，参数通过列表传递。
- Function.prototype.toString()
    - 返回表示函数源代码的字符串。重写 Object.prototype.toString 方法。

## 使用场景
1. typeof 在类型判断时只能返回如下几个结果：number、boolean、string、function（函数）、object（null、数组、对象）、undefined。

`Object.prototype.toString` 方法会返回 `[object Type]` 这种格式的字符串，其中 `Type` 是对象的类型。
```js
Object.prototype.toString(); // [object Object]
({}).toString(); // [object Object]
```
所有类型都继承自 Object，我们就可以利用这个方法将 this 指向要判断的数据，然后就可以得到 `[object Type]` 这种格式的字符串，然后再提取字符串中的 `Type` 部分转成小写方便我们进行比较。
```js
const typeOf = o => Object.prototype.toString.call(o).slice(8, -1).toLowerCase();
typeOf(null); // null
typeOf([]); // array
(function (){ console.log(typeOf(arguments)); })(); // arguments
```
> 从 ECMAScript 5 开始，toString() 调用 null 返回 [object Null]，undefined 返回 [object Undefined]。用户自定义的类，除非使用自定义 Symbol.toStringTag 属性，否则将返回 “[object Object]”。

2. 一些类数组对象，具有数组的索引和长度属性，却没有数组的方法。我们可以将数组对象方法的 this 指向类数组对象，从而使它们能够使用这些方法。例如，下面代码可以获取页面所有自定义元素：
```js
[].filter.call(document.all, v => /\w+-\w+/.test(v.tagName))
```

3. apply 的第二个参数是数组或类数组对象，可以直接传入函数的 arguments 对象。这点在处理函数参数时非常方便。下面在 Student 构造函数里面调用 Person 的构造实现继承。
```js
function Person(name, age) {
  this.name = name;
  this.age = age;
  this.toString = () => this.name + ', ' + this.age;
}
function Student() {
  Person.apply(this, arguments);
}
const tom = new Student('Tom', 20);
console.log(tom.toString()); // Tom, 20
```

4. bind 方法会返回一个指定参数列表的新函数，并不立即调用。这可以用来包装函数来添加一些功能。
```js
function add(x, y) {
  return x + y;
}
const plus5 = add.bind(null, 5);
plus5(10); // 15
```

5. JavaScript 一个常见的错误是将包含 this 引用的方法直接当作回调函数，当回调函数执行时内部的 this 会指向全局对象。通过使用 bind() 方法可以显式将 this 绑定到回调函数上面。
```js
const name = 'outerName';
const obj = { name: 'myName', f() { console.log(this.name); } };
const unbound = obj.f, bound = obj.f.bind(obj);
unbound(); // outerName
bound(); // myName
setTimeout(unbound); // outerName
setTimeout(bound); // myName
```