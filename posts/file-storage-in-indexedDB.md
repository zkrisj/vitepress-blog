---
date: 23:58 2023/3/23
title: 前端本地存储数据库 IndexedDB 存储文件
tags:
- indexedDB
description: 在页面中定义一个文件上传按钮，选择图片文件后，会将文件保存到 IndexedDB 数据库中，当我们刷新页面，或关闭页面后，再次进入，会发现图片文件可以从 IndexedDB 数据库中读取，然后在页面中显示。
---
## 介绍
![微信截图_20221209222347.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff12ea5c5c484009a4776744a294b685~tplv-k3u1fbpfcp-watermark.image?)

IndexedDB 是一种浏览器底层 API，目前各浏览器都已支持，兼容性很好。

## 特点
1. IndexedDB 内部采用对象仓库（object store）存放键值对数据。可以存储结构化克隆算法支持的任何对象。每一个数据记录都有对应的主键，主键是独一无二的，并且不能有重复。
2. 使用索引实现对数据的高性能搜索。
3. IndexedDB API 大部分都是异步的。不会通过返回值提供数据，而是要传递一个回调函数来获取返回值。
4. 同大多数 Web 存储解决方案一样，IndexedDB 遵循同源策略。即可以访问相同域内存储的数据，但无法跨不同域访问数据。
5. 可以存储文件、二进制对象。
6. 在 Web Worker 中可用。
7. IndexedDB 属于 NoSQL 和事务型面向对象数据库系统。对数据库的所有操作，都要通过事务完成。

IndexedDB 允许存储和检索用键索引的对象，它可以存储结构化克隆算法支持的任何对象。

## 结构化克隆
结构化克隆是由 HTML5 规范定义的用于复制复杂 JavaScript 对象的算法，例如 `structuredClone()` 函数的调用，`Workers` 的 `postMessage()` 方法或使用 `IndexedDB` 存储对象时在内部的调用。结构化克隆算法使 `postMessage()` 在 `Worker` 和主线程之间不再仅仅传输字符串类型，还可以传输包括 `File`, `Blob`, `ArrayBuffer`, `JSON` 对象类型。支持的类型：
- `symbols` 除外的所有原始类型。
- `Boolean` `String` 原始类型包装对象。
- `Array` `Map` `Set` `Date` `RegExp` 内置对象。
- `Blob` `File` `FileList` 文件类型对象。
- `ArrayBuffer` `TypedArray` `DataView` `Buffer` 类型对象。
- `ImageBitmap` `ImageData` 图形对象。
- `Object` 仅包括普通对象，例如对象字面量。
- `Error`, `EvalError`, `RangeError`, `ReferenceError`, `SyntaxError`, `TypeError`, `URIError` 错误类型，其他类型错误 `name` 属性会被转成 `Error`，`message` 属性会丢失。

## IndexedDB 存储文件
下面我们通过在页面中定义一个文件上传按钮，选择图片文件后，会将文件保存到 IndexedDB 数据库中，当我们刷新页面，或关闭页面后，再次进入，会发现图片文件可以从 IndexedDB 数据库中读取，然后在页面中显示。
```html
<body>
  <label for="fileImg">上传图片</label>
  <input type="file" id="fileImg" accept="image/*" hidden>
  <p id="result"></p>
</body>
<script>
  var eleImg = document.createElement('img');
  let db;
  const request = indexedDB.open('the_file', 1);
  request.onerror = console.log;
  request.onsuccess = function(ev) {
    console.log('打开');
    db = request.result;
    db.transaction(db.objectStoreNames).objectStore('files').openCursor().onsuccess = function(event) {
      const cursor = event.target.result;
      if (cursor) {
        console.log(cursor.value);
        const img = new Image();
        img.src = URL.createObjectURL(cursor.value.file);
        result.append(img);
        cursor.continue();
      }
    }
  };
  request.onupgradeneeded = function(ev) {
    console.log('升级');
    db = request.result;
    if (!db.objectStoreNames.contains('files')) {
      const table = db.createObjectStore('files', { keyPath: 'id', autoIncrement: true });
      table.createIndex('file', 'file', { unique: false });
    }
  };
  fileImg.onchange = e => {
    const file = fileImg.files[0];
    const request = db.transaction(['files'], 'readwrite').objectStore('files').add({ file });
    request.onsuccess = function(event) {
      console.log('数据写入成功');
      const img = new Image();
      img.src = URL.createObjectURL(file);
      result.append(img);
    };
    request.onerror = function(event) { console.log('数据写入失败'); }
  };
</script>
<style>
  label {
    display: inline-block;
    padding: 1em;
    border-radius: .5em;
    background: red;
    color: white;
    font-family: Arial, Helvetica, sans-serif
  }
</style>
```

## 码上掘金
<iframe src="https://code.juejin.cn/pen/7177758045026385980"></iframe>