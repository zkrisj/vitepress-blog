---
date: 21:49 2023/3/22
title: 结构化克隆、序列化、可传输对象
tags:
- JS
description: 结构化克隆是由 HTML5 规范定义的用于复制复杂 JavaScript 对象的算法，例如 structuredClone() 函数的调用，Workers 的 postMessage() 方法或使用 IndexedDB 存储对象时在内部的调用。
---
## 结构化克隆
1. 结构化克隆是由 HTML5 规范定义的用于复制复杂 JavaScript 对象的算法，例如 `structuredClone()` 函数的调用，`Workers` 的 `postMessage()` 方法或使用 `IndexedDB` 存储对象时在内部的调用。
2.  `DOM` 节点, `Function` 对象不能被结构化克隆算法复制，否则会抛出 `DATA_CLONE_ERR` 的异常。
3. `RegExp` 对象的 `lastIndex` 字段，原形链上的属性（例如，一个类的实例会被复制为一个普通对象），属性描述符（例如，如果一个对象用属性描述符标记为 `read-only`，它将会被复制为 `read-write`，因为这是默认的情况。），`getters` 和 `setters` 以及其他类似元数据的功能不会被保留。
4. 支持的类型：
    - `symbols` 除外的所有原始类型。
    - `Boolean` `String` 原始类型包装对象。
    - `Array` `Map` `Set` `Date` `RegExp` 内置对象。
    - `Blob` `File` `FileList` 文件类型对象。
    - `ArrayBuffer` `TypedArray` `DataView` `Buffer` 类型对象。
    - `ImageBitmap` `ImageData` 图形对象。
    - `Object` 仅包括普通对象，例如对象字面量。
    - `Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError` 错误类型，其他类型错误 `name` 属性会被转成 `Error`，`message` 属性会丢失。

## 序列化
1. 序列化指将对象或数据结构转换为适合通过网络或存储（例如，数组缓冲区或文件格式）传输的格式的过程。例如通过 `JSON.stringify()` 将对象序列化为 `JSON` 字符串，通过 `CSSStyleDeclaration.getPropertyValue` 函数将 `CSS` 值序列化为字符串 `document.styleSheets[0].cssRules[0].style.getPropertyValue('margin')`。
2. 反序列化指将较低级别的格式（例如，已通过网络传输或存储在数据存储中）转换为可读对象或其他数据结构的过程。例如通过 `JSON.parse()` 将 `JSON` 字符串反序列化为对象。
3. 可序列化对象指可以在 js 作用域中进行序列化和反序列化的对象，所有原始值都是可序列化的，但不是所有对象都是可序列化的。可以序列化的对象包括结构化克隆算法支持的类型。

## 可传输对象
1. 结构化克隆算法使 `postMessage()` 在 `Worker` 和主线程之间不再仅仅传输字符串类型，还可以传输包括 `File`, `Blob`, `ArrayBuffer`, `JSON` 对象类型。但结构化克隆算法仍然是一种复制操作，例如将 32MB 的 `ArrayBuffer` 传递给 `Worker` 的开销可能是数百毫秒。
2. `Transferable` 接口可以巨大改进消息传递性能。可以将其视为传递引用，但是与传递引用不同，调用上下文中的“版本”一旦传输到新上下文就不再可用，这样能防止多个线程同时修改数据。可传输对象是零拷贝，极大地提高了向 `Worker` 发送数据的性能。
3. 类型化数组是可序列化的，但不可传输，但它们的底层缓冲区 `buffer` 属性是一个 `ArrayBuffer`，是一个可传输对象。例如，我们可以在传输数组中发送 `uInt8Array.buffer`，但不能在传输数组中发送 `uInt8Array`。

## 参考资料
1. [The structured clone algorithm](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)
2. [Serializable object](https://developer.mozilla.org/en-US/docs/Glossary/Serializable_object)
3. [Transferable objects](https://developer.mozilla.org/en-US/docs/Glossary/Transferable_objects)
4. [Transferable objects - Lightning fast](https://developer.chrome.com/blog/transferable-objects-lightning-fast/)