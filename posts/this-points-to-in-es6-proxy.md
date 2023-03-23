---
date: 13:17 2023/3/23
title: ES6 Proxy 中的 this 指向
tags:
- JS
description: 在 handler 拦截函数中，如果遇到 target 中有定义的 getter，则 getter 中的 this 指向调用的 target，即不会改变指向，但可以手动将其指向 receiver。
---
## 介绍
`Proxy` 和 `Reflect` 内置对象从 ECMAScript 2015 开始支持，允许拦截并定义自定义行为。

## 语法
```js
const p = new Proxy(target, { ...traps })
```
- traps
    - 被代理对象上的自定义行为。包含捕获器（操作发生时所对应的处理函数）的方法列表。
- target
    - 被代理的目标对象。

```js
const handler = {
  get(target, name, receiver) {
    // 如果对象中包含该属性，返回该属性，否则返回 not exists
    return name in target ? Reflect.get(...arguments) : 'not exists';
  },
  set(target, name, value, receiver) {
    // 如果属性为 age，判断值的类型是否为 number 和大于 0
    if (name === 'age') {
      if (!Number.isNaN(parseInt(value))) {
        target[name] = value > 0 ? value : 0;
        return true;
      } else throw 'invalid age';
    } else return Reflect.set(...arguments);
  },
};

const p = new Proxy({}, handler);
p.a = 1;
console.log(p.a, p.b); // 1, not exists
p.age = 12;
console.log(p.age); // 12
p.age = -12;
console.log(p.age); // 0
p.age = 'a';
console.log(p.age); // Uncaught invalid age
```
使 `Proxy` 代理起作用，必须对 **proxy 对象** 进行操作，而不是原对象。

## this 指向
1. `Proxy` 代理的原对象内部的 `this` 指向其代理对象。
```js
const target = {
  m () {
    return this === proxy;
  }
};
const proxy = new Proxy(target, {});

console.log(target.m()); // false
console.log(proxy.m());  // true
```
2. `handler` 拦截函数内部的 `this`，指向的是 `handler` 对象本身。
```js
const handler = {
  get() {
    console.log(this === handler);
  }
};
new Proxy({}, handler).foo; // true
```
3. 有些原生对象的内部属性，只有通过正确的 `this` 才能获取。
```js
const target = new Date();
new Proxy(target, {}).getDate(); // TypeError: this is not a Date object

const handler = {
  get(target, prop) {
    const val = target[prop];
    return typeof val === 'function' ? val.bind(target) : Reflect.get(...arguments);
  }
};
const proxy = new Proxy(target, handler);
console.log(proxy.getDate()); // 可以获取日期
```

## receiver 指向
1. `get` 和 `set` 捕获器函数的最后一个参数都是一个 `receiver` 对象，指向当前代理对象。
```js
const proxy = new Proxy({}, {
  get(target, key, receiver) {
    return receiver;
  }
});
proxy.getReceiver === proxy // true
```
2. 但是，代理对象作为其他对象的原型被继承时，`receiver` 会指向被继承的对象。
```js
let obj;
const proxy = new Proxy({ foo: 3 }, {
  get(target, prop, receiver) {
    console.log(receiver === proxy, receiver === obj);
    return target[prop];
  }
});
console.log(proxy.foo); // true false 3
obj = Object.create(proxy);
console.log(obj.foo); // false true 3
```
3. 在 `handler` 拦截函数中，如果遇到 `target` 中有定义的 `getter`，则 `getter` 中的 `this` 指向调用的 `target`，即不会改变指向，但可以手动将其指向 `receiver`。
```js
const obj = { foo: 1 };
const proxy = new Proxy({
  foo: 3,
  get info() {
    return this.foo;
  }
}, {
  get(target, prop, receiver) {
    console.log(receiver === obj); // true
    console.log(target[prop]); // 3
    console.log(Reflect.get(target, prop)); // 3
    return Reflect.get(...arguments); // Reflect.get(target, prop, receiver)
  }
});
Object.setPrototypeOf(obj, proxy);
console.log(obj.info); // 1
```

## 参考资料
[ES6 教程 Proxy](https://wangdoc.com/es6/proxy.html#this-%E9%97%AE%E9%A2%98)