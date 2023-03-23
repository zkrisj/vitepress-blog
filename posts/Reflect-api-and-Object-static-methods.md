---
date: 16:24 2023/3/23
title: Reflect API 和 Object 静态方法的对比
tags:
- JS
description: Proxy 一般需要和 Reflect 联合使用，Proxy 对象拦截操作，Reflect 完成默认行为，然后就可以在 Proxy 对象中部署额外的功能。
---
## 介绍
`Reflect` 内置对象提供了与 JavaScript 对象交互的方法，这些方法与 `Proxy handler`（捕获器）的方法相对应。
1. `Reflect` 不是一个函数对象，因此不能当构造函数。
2. `Proxy` 一般需要和 `Reflect` 联合使用，`Proxy` 对象拦截操作，`Reflect` 完成默认行为，然后就可以在 `Proxy` 对象中部署额外的功能。

## Reflect 操作函数化
1. `Reflect.has` 判断一个对象是否存在某个属性，和 `in` 运算符的功能完全相同。如果 `target` 不是 `Object`，会抛出 `TypeError`。
```js
Reflect.has(target, prop)
// 相当于
prop in target
```
2. `Reflect.deleteProperty` 删除一个对象的某个属性，和 `delete` 运算符的功能完全相同。如果 `target` 不是 `Object`，会抛出 `TypeError`。
```js
Reflect.deleteProperty(target, prop)
// 相当于
delete target[prop]
```

## Reflect.apply 更易读和理解
1. 在 `Reflect` 之前，使用 `Function.prototype.apply` 调用具有给定 `this` 值的函数。
```js
Function.prototype.apply.call(Math.floor, undefined, [1.75]); // 1
```
2. 使用 `Reflect.apply` 之后更易读和理解：
```js
Reflect.apply(Math.floor, undefined, [1.75]) // 1
Reflect.apply(String.fromCharCode, undefined, [104, 101, 108, 108, 111]) // "hello"
Reflect.apply(RegExp.prototype.exec, /ab/, ['confabulation']).index // 4
Reflect.apply(''.charAt, 'ponies', [3]) // "i"
```

## Reflect.defineProperty | setPrototypeOf 检查属性定义是否成功
1. 使用 `Object.defineProperty` 和 `Object.setPrototypeOf`，成功则返回传递给函数的对象，否则抛出 `TypeError`，需要使用 `try...catch` 块来捕获定义属性时发生的错误。
```js
try {
  Object.defineProperty(target, prop, descriptor) // success
} catch (err) {
  // failure
}
```
2. 使用 `Reflect.defineProperty` 和 `Reflect.setPrototypeOf`，返回一个布尔值表示成功状态，可以替换成 `if...else` 块：
```js
if (Reflect.defineProperty(target, prop, descriptor)) {
  // success
} else {
  // failure
}
```
3. 如果 `target` 不是 `Object`，它们都会抛出 `TypeError` 异常。

## 与 Object 对象的静态方法对比
**`Reflect` 上的一些方法对应于 ES2015 之前的 `Object` 上的静态方法**。有些在 `Reflect` 上的新方法，`Object` 上没有；而有些在 `Object` 上的方法 `Reflect` 上没有。
1. `defineProperty`，`Object` 和 `Reflect` 都有。
2. `defineProperties`，只有 `Object` 有。
3. `Reflect.has` 对应 `Object.hasOwn`。
4. `deleteProperty`，只有 `Reflect` 有。
5. `get`，只有 `Reflect` 有。
6. `set`，只有 `Reflect` 有，返回一个布尔值表示成功状态。
7. `keys`，只有 `Object` 有，返回一个可枚举的属性键的字符串数组。如果目标不是对象，在 ES5 中抛出 `TypeError`，在 ES2015 中则将其强制转换为对象。
8. `ownKeys`，只有 `Reflect` 有，返回一个由目标对象自身的属性键组成的数组。等同于 `Object.getOwnPropertyNames(targe
9. `getOwnPropertyDescriptor`，`Object` 和 `Reflect` 都有。如果指定的属性存在于对象上，则返回该属性描述符，如果不存在则返回 `undefined`。在 ES5 中，如果第一个参数不是对象（而是原始类型），会抛出 `TypeError`。而在 ES2015，第一个的参数不是对象类型会被强制转换为对象。
10. `getOwnPropertyDescriptors`，只有 `Object` 有。获取指定对象的所有自身属性的描述符，如果没有任何自身属性，则返回空对象。
> 浅拷贝一个对象：`Object.assign()` 方法只能拷贝源对象的可枚举的自身属性，同时拷贝时无法拷贝属性的描述符，而且访问器属性会被转换成数据属性，也无法拷贝源对象的原型，使用 `Object.getOwnPropertyDescriptors(obj)` 方法配合 `Object.create()` 方法则可以实现这些。
> ```js
> Object.create(
>   Object.getPrototypeOf(obj),
>   Object.getOwnPropertyDescriptors(obj)
> );
> ```
11. `getPrototypeOf`，`Object` 和 `Reflect` 都有，返回给定对象的原型。如果没有继承属性，则返回 `null`。在 ES5 中，如果参数不是一个对象类型，会抛出 `TypeError` 异常。在 ES2015 中，参数会被强制转换为一个对象。如果 `target` 不是 `Object`，会抛出 `TypeError`。
12. `setPrototypeOf`，`Object` 和 `Reflect` 都有。
- `Object.setPrototypeOf` 设置对象的新原型，并返回该对象。
- `Reflect.setPrototypeOf` 返回一个布尔值，指示原型是否成功设置。
- 如果 `prototype` 不是一个对象（或 `null`），会抛出 `TypeError` 异常。
- 如果 `obj` 参数是不可扩展的或是一个不可修改原型的对象（如 `Object.prototype` 或 `window`），`Object.setPrototypeOf` 会抛出 `TypeError` 异常，`Reflect.setPrototypeOf` 返回 `false`。

13. `isExtensible`，`Object` 和 `Reflect` 都有。返回一个 `Boolean` 值，指示一个对象是否是可扩展的（是否可以在它上面添加新的属性）。
- 默认情况下，对象是可扩展的：即可以为他们添加新的属性，并且可以重新分配其原型。
- `Object.preventExtensions`、`Object.seal` 或 `Object.freeze` 方法都可以使一个对象变为不可扩展。
- 在 ES5 中，如果参数不是对象（而是原始类型），`Object.isExtensible` 会抛出 `TypeError`。在 ES2015 中，如果传递了非对象参数，`Object.isExtensible` 将返回 `false` 而没有任何错误，因为根据定义，原始类型是不可变的。
- 如果参数不是对象（而是原始类型），`Reflect.isExtensible` 会抛出 `TypeError`。

14. `preventExtensions`，`Object` 和 `Reflect` 都有，阻止对象添加新属性和对象的原型被重新分配。
- 当将新属性添加到不可扩展对象将静默失败，严格模式下会抛出 `TypeError`。
- 当为不可扩展对象重新分配原型时，会抛出 `TypeError`。
- `Object.preventExtensions` 使对象不可扩展并会返回该对象。在 ES5 中，如果参数不是一个对象类型（而是原始类型），会抛出 `TypeError` 异常。在 ES2015 中，非对象参数将被视为一个不可扩展的普通对象，因此会被直接返回。
- `Reflect.preventExtensions` 返回一个 `Boolean` 值指示目标对象是否成功被设置为不可扩展。如果参数不是一个对象类型（而是原始类型），会抛出 `TypeError` 异常。