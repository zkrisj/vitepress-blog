---
date: 23:34 2023/3/22
title: ⛪ 深克隆的标准方法 structuredClone 和克隆继承属性
tags:
- JS
description: 对象类型在内存中存储的是引用和值。所以克隆一个对象存在两种方式：一种是只改变引用在内存中的地址，不改变值的存储空间，叫做浅克隆；一种是改变引用在内存中的地址，并在内存中开辟一个新的区域来存放值，叫做深克隆。
---
## 介绍
原始类型在内存中存储的是值，改变原始类型的值，不影响引用它的变量。

```js
let a = 1;
let b = a;
a = 2;
console.log(b); // 1
```

对象类型在内存中存储的是引用和值。所以克隆一个**对象**存在两种方式：一种是只改变引用在内存中的地址，不改变值的存储空间，叫做浅克隆；一种是改变引用在内存中的地址，并在内存中开辟一个新的区域来存放值，叫做深克隆。

## 对象的浅克隆
浅克隆对象的属性与源对象共享相同的引用，当源对象的属性改变时，浅克隆对象的属性也会跟着改变，反之亦然。

```js
const o1 = { a: { b: 1 }, c: 1 };
const o2 = { ...o1 };
o1.a.b = 2;
o1.c = 2;
console.log(o2.a.b, o2.c, o1.a === o2.a); // 2 1 true
```
这里我们只克隆了 o1 的原始类型属性：o1.c，而对象属性 o1.a 没有被克隆，所以 o1.a 和 o2.a 指向同一个内存地址。

> ...（扩展语法）、Array.prototype.concat()、Array.prototype.slice()、Array.from()、Object.assign() 和 Object.create()）都是对源对象的浅克隆。

## 对象的深克隆
深克隆对象的属性与源对象不共享相同的引用，它们的属性改变互不影响。
1. JSON.parse(JSON.stringify(obj))
```js
const o1 = { a: { b: 1 }, c: 1 };
const o2 = JSON.parse(JSON.stringify(o1));
o1.a.b = 2;
o1.c = 2;
console.log(o2.a.b, o2.c, o1.a === o2.a); // 1 1 false
```
这种方法深克隆最简单，但是 `JSON.stringify()` 序列化字符串有很多限制：
- Boolean, Number, String（可通过构造函数 new 或 Object() 包装）对象序列化后会转换为相应的原始值。
- 序列化 BigInt 会抛出错误。
- undefined、Function 和 Symbol 值不是有效的 JSON 值。在对象中会被省略，在数组中会被更改为 null。Symbol 对象（可通过 Object() 获得）会序列化为空对象 {}。
- Infinity、NaN 会被序列化为 null。
- 数组只有索引属性会被序列化，其他属性会被忽略。
- 日期 Date 对象重写了 toJSON() 方法（同 Date.toISOString()），反序列化后还是字符串。
- 使用与 Object.keys() 相同的算法访问属性，不可枚举的属性会被忽略。这意味着 Map、Set、WeakMap、WeakSet、RegExp、ArrayBuffer 等内置类型，序列化之后会变成空对象 {}。
- 对包含循环引用的对象（对象之间相互引用，形成无限循环）执行此方法，会抛出错误。

```js
const arr = [Symbol('key1'), () => {}, undefined];
arr.a = 1;
console.log(JSON.stringify({
  undef: undefined,
  fun: () => {},
  ab: new ArrayBuffer(8),
  arr,
  blob: new Blob(['aFileParts'], {
    type: 'text/html'
  }),
  date: new Date,
  el: document.body,
  file: new File(['foo'], 'foo.txt', {
    type: 'text/plain',
  }),
  fileReader: new FileReader,
  img: new Image(100, 200),
  infinityMax: Infinity,
  map: new Map([
    [1, 'one'],
    [2, 'two'],
  ]),
  nan: NaN,
  reg: /a/,
  set: new Set([1, 2]),
  s: Object(String('a')),
  sy: Symbol('key1'),
  sy2: Object(Symbol('key1')),
  ws: new WeakSet([{
    a: 1
  }])
}, 0, 2));
/* 
输出结果：
{
  "ab": {},
  "arr": [
    null,
    null,
    null
  ],
  "blob": {},
  "date": "2022-09-08T08:57:39.831Z",
  "el": {},
  "file": {},
  "fileReader": {},
  "img": {},
  "infinityMax": null,
  "map": {},
  "nan": null,
  "reg": {},
  "set": {},
  "s": "a",
  "sy2": {},
  "ws": {}
}
*/

console.log(JSON.stringify(
  Object.create(null, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true },
    }
  )
)); // {"y":"y"}

const circularReference = {};
circularReference.myself = circularReference;
// TypeError: Converting circular structure to JSON
JSON.stringify(circularReference);
```

2. 通过递归对象的属性来深克隆。

```js
function deepClone(o, m = new WeakMap) {
  if (typeof o !== 'object') return o;
  if (m.get(o)) return m.get(o);
  const c = Array.isArray(o) ? [] : {};
  m.set(o, c); // 对自身引用克隆
  for (const i in o) c[i] = o[i] instanceof Object ? deepClone(o[i], m) : o[i];
  return c;
}
const o1 = { a: { b: 1 }, c: 1 };
o1.myself = o1;
const o2 = deepClone(o1);
o1.a.b = 2;
o1.c = 2;
console.log(o2.a.b, o2.c, o1.a === o2.a); // 1 1 false
```

3. HTML 标准方法：structuredClone()。

```js
const o1 = { a: { b: 1 }, c: 1 };
o1.myself = o1;
const o2 = window.structuredClone(o1);
o1.a.b = 2;
o1.c = 2;
console.log(o2.a.b, o2.c, o1.a === o2.a); // 1 1 false
```

对于可传输对象，structuredClone() 还提供了第二个参数，可以将可传输对象转移到克隆对象中，而不是复制（比如向 Worker 线程传输一个很大的视频流，如果复制会占用很大的带宽，转移就会直接将资源移动到新的上下文中，且资源在原上下文中不再可用）。

```js
// 16MB = 1024 * 1024 * 16
const uInt8Array = Uint8Array.from({ length: 1024 * 1024 * 16 }, (v, i) => i); 
const transferred = structuredClone(uInt8Array, { transfer: [uInt8Array.buffer] });
console.log(uInt8Array.byteLength, transferred.buffer.byteLength);  // 0 16777216
```

4. 以上几种深克隆都无法复制 Function、DOM 节点和对象的不可枚举属性。

4.1. 对于 Function 可使用以下方法：

```js
function cloneFunction(func) {
  const funcString = func.toString();
  if (!func.prototype) return eval(funcString);
  const param = /(?<=\().+(?=\)\s*{)/.exec(funcString);
  const body = /(?<={)(.|\n)*(?=})/m.exec(funcString);
  console.log('匹配到函数体：', body[0]);
  console.log('匹配到参数：', param[0]);
  return param ? new Function(param[0].split(','), body[0]) : new Function(body[0]);
}
```

4.2. 对于 DOM 节点，可使用 HTML Node 节点上的方法 node.cloneNode(true)。

4.3. 对于不可枚举属性，可用使用 Object.getOwnPropertyNames 来遍历对象的可枚举和不可枚举属性：

```js
function deepClone2(o, m = new WeakMap) {
  if (typeof o !== 'object') return o;
  if (m.get(o)) return m.get(o);
  const c = Array.isArray(o) ? [] : {};
  m.set(o, c); // 对自身引用克隆
  for (const i of Object.getOwnPropertyNames(o)) c[i] = o[i] instanceof Object ? deepClone2(o[i], m) : o[i];
  return c;
}
console.log(deepClone2(
  Object.create(null, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true },
    }
  )
).x); // x
```

但是这样仍然不能克隆继承的属性：

```js
Array.prototype.p = 3;
console.log(deepClone2(
  Object.create(Array.prototype, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true },
    }
  )
).p); // undefined
```

4.4 使用 Object.getPrototypeOf 来克隆继承的属性：

```js
function deepClone3(o, m = new WeakMap) {
  if (typeof o !== 'object') return o;
  if (m.get(o)) return m.get(o);
  const c = Array.isArray(o) ? [] : {};
  m.set(o, c); // 对自身引用克隆
  for (let i = o; i !== Object.prototype; i = Object.getPrototypeOf(i))
    for (const p of Object.getOwnPropertyNames(i)) c[p] = o[p] instanceof Object ? deepClone3(o[p], m) : o[p];
  return c;
}
console.log(deepClone3(
  Object.create(Array.prototype, {
      x: { value: 'x', enumerable: false },
      y: { value: 'y', enumerable: true },
    }
  )
).slice(0)); // []
```

但是这样，对于一些内部的私有 Symbol 属性还是无法克隆的。而像正则 RegExp、日期 Date 等类型的正常工作需要依赖这些内部私有属性，所以需要在递归时，手动判断：

```js
if (obj instanceof RegExp) {
  const getRegExp = re => {
    var flags = "";
    if (re.global) flags += "g";
    if (re.ignoreCase) flags += "i";
    if (re.multiline) flags += "m";
    return flags;
  };
  copy = new RegExp(obj.source, getRegExp(obj));
  if (obj.lastIndex) copy.lastIndex = obj.lastIndex;
}

if (obj instanceof Date) {
  copy = new Date(obj);
}
```