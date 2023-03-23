---
date: 23:42 2023/3/23
title: 前端本地存储数据库 IndexedDB 的增删改查
tags:
- indexedDB
description: IndexedDB 是一种浏览器底层 API，目前各浏览器都已支持，兼容性很好。虽然 Web Storage 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。
---
## 介绍
![微信截图_20221209222347.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff12ea5c5c484009a4776744a294b685~tplv-k3u1fbpfcp-watermark.image?)

IndexedDB 是一种浏览器底层 API，目前各浏览器都已支持，兼容性很好。虽然 Web Storage 在存储较少量的数据很有用，但对于存储更大量的结构化数据来说力不从心。而 IndexedDB 提供了这种场景的解决方案。

## 特点
1. IndexedDB 内部采用对象仓库（object store）存放键值对数据。可以存储结构化克隆算法支持的任何对象。每一个数据记录都有对应的主键，主键是独一无二的，并且不能有重复。
2. 使用索引实现对数据的高性能搜索。
3. IndexedDB API 大部分都是异步的。不会通过返回值提供数据，而是要传递一个回调函数来获取返回值。
4. 同大多数 Web 存储解决方案一样，IndexedDB 遵循同源策略。即可以访问相同域内存储的数据，但无法跨不同域访问数据。
5. 可以存储文件/二进制对象。
6. 在 Web Worker 中可用。

IndexedDB 属于 NoSQL 和事务型面向对象数据库系统。对数据库的所有操作，都要通过事务完成。下面我们通过一个项目管理的增删改查来演示 IndexedDB API 的使用。

## 连接数据库
为了获取数据库的访问权限，需要在 window 对象的 indexedDB 属性上调用 open() 方法。该方法返回一个 IDBRequest 对象，异步操作通过在 IDBRequest 对象上触发事件来和调用进行通信。
```js
const DBOpenRequest = window.indexedDB.open('project', 2);
```
连接数据库会在一个单独的线程中进行，包括以下几个步骤：
1. 指定数据库已经存在时：
- 等待 versionchange 操作完成。
- 如果数据库已计划删除，那等着删除完成。
2. 如果已有数据库版本高于给定的 version，中止操作并返回类型为 VersionError 的 DOMError。
3. 如果已有数据库版本低于给定的 version，触发一个 versionchange 操作。
4. 如果数据库不存在，创建指定名称的数据库，将版本号设置为给定版本，如果未给定版本号，则设置为 1。
5. 创建数据库连接。

> 要注意的是，如果指定了版本号，后续的操作主要在 upgradeneeded 事件的监听函数里面完成。版本号不能使用浮点数，否则它将会被转变成离它最近的整数，这可能导致 upgradeneeded 事件不会被触发。
> ```js
> const request = indexedDB.open("MyTestDatabase", 2.4); // 不要这么做，因为版本会被置为 2。
> ```
> 我们对数据库某一行数据进行增加删除操作，我们是没有必要对数据库的版本号进行修改的。但是对于字段修改就不一样了，比方说原来是5列数据，我们现在改成6列，由于相关设置是在 onupgradeneeded 回调中，因此，这时我们需要增加版本号来触发字段修改。

indexedDB.open() 方法会返回一个 IDBRequest 对象。这个对象通过三种事件 error、success、upgradeneeded，处理打开数据库的操作结果。
```js
let db;
request.onerror = function (event) {
  console.log('数据库打开报错');
};
request.onsuccess = function (event) {
  db = request.result;
  console.log('数据库打开成功');
};
request.onupgradeneeded = function (event) {
  db = event.target.result;
};
```

## 新建对象仓库（新建表）
IndexedDB 中新建对象仓库（新建表）需要使用 IDBDatabase 接口的 IDBDatabase.createObjectStore(name, options) 方法。
```js
const objectStore = db.createObjectStore('project', { keyPath: 'id' });
```
- name
    - 被创建的 object store 的名称。
- options
    - 可选参数，其中包括以下的属性：
    - keyPath - 新对象存储要使用的主键属性，定义浏览器应从对象存储或索引中的何处提取主键。如果为空或未指定，则创建对象存储时没有主键并将使用外键。还可以传入一个数组作为 keyPath。
    - autoIncrement - 是否使用自动递增的整数作为主键（第一个数据记录为1，第二个数据记录为2，以此类推），默认为 false。一般来说，keyPath 和 autoIncrement 属性只要使用一个就够了。

## 新建索引
IDBObjectStore.createIndex(indexName, keyPath, objectParameters) 法用来创建索引，可以理解为创建表字段，参数：
- indexName
    - 创建的索引名称，可以使用空名称作为索引。
- keyPath
    - 索引使用的键属性，可以使用空创建索引, 也可以传递数组。
- objectParameters
    - 可选参数。常用参数之一是unique，表示该字段值是否唯一，不能重复。

## 新增数据
向对象仓库写入数据记录需要通过事务完成。
1. 首先，新建一个事务。
```js
const transaction = db.transaction('project', "readwrite");
```
2. 打开存储对象。
```js
const objectStore = transaction.objectStore('project');
```
3. 添加到数据对象中
```
const objectStoreRequest = objectStore.add(newItem);
```
4. 使用一行语句表示就是：

```
db.transaction('project', "readwrite").objectStore('project').add(newItem);
```
这里的 `newItem` 就是一个原生的纯粹的 JavaScript 对象，在本 demo 中，`newItem` 数据类似下面这样：
```json
{
  "name": "第一个项目",
  "begin": "2022-12-12",
  "end": "2057-07-16",
  "person": "张三",
  "remark": "测试测试"
}
```

## 更新数据
1. 先根据 id 使用 objectStore.get(id) 方法获得对应行的存储对象。
2. 再使用 objectStore.put(record) 进行数据库数据替换。
```js
// 新建事务
const transaction = db.transaction('project', "readwrite");
// 打开已经存储的数据对象
const objectStore = transaction.objectStore(project);
// 获取存储的对应键的存储对象
const objectStoreRequest = objectStore.get(id);
// 获取成功后替换当前数据
objectStoreRequest.onsuccess = function(event) {
  // 当前数据
  const myRecord = objectStoreRequest.result;
  // 遍历替换
  for (const key in updateData) {
    if (typeof myRecord[key] != 'undefined') {
      myRecord[key] = data[key];
    }
  }
  // 更新数据库存储数据             
  objectStore.put(myRecord);
};
```

## 删除数据
使用 IDBObjectStore.delete(key) 方法，和添加操作正好相反，但代码结构却是类似的。
```js
const objectStoreRequest = db.transaction('project', "readwrite").objectStore('project').delete(id);
```

## 获取数据
IDBCursor 可以让我们一行一行读取数据库数据。
```js
const objectStore = db.transaction(dbName).objectStore(dbName);
objectStore.openCursor().onsuccess = function(event) {
    const cursor = event.target.result;
    if (cursor) {
        // cursor.value就是数据对象
        // 游标没有遍历完，继续
        cursor.continue();
    } else {
        // 如果全部遍历完毕...
    }
}
```
可以看到，我们使用存储对象的 openCursor() 打开游标，在 onsuccess 回调中就可以遍历我们的游标对象了。其中 cursor.value 就是完整的数据对象，纯JS对象，就像下面这样：
```json
{
  "id": 1,
  "name": "第一个项目",
  "begin": "2022-12-12",
  "end": "2057-07-16",
  "person": "张三",
  "remark": ""
}
```
IDBKeyRange 需要和 IDBCursor 一起使用。例如，只获取 id 从 4~10 之间的数据：
```js
// 确定打开的游标的主键范围
const keyRangeValue = IDBKeyRange.bound(4, 10);
// 打开对应范围的游标
const objectStore = db.transaction(dbName).objectStore(dbName);
objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
    const cursor = event.target.result;
    // ...
}
```
其中，有 bound()、only()、lowerBound()、upperBound() 这几个方法，意思就是方法名字面意思：“范围内”、“仅仅是”、“小于某值、“大于某值”。方法最后还支持两个布尔值参数，例如：
```js
const keyRangeValue = IDBKeyRange.bound(4, 10, true, true);
```
则表示范围 3~9，布尔值参数为 true 的时候不含范围边界。

## 查找记录
1. IDBObjectStore 接口的 index(name) 方法在当前对象存储中打开一个命名索引，之后它可以用于，例如，使用游标返回按该索引排序的一系列记录。
2. IDBObjectStore.get(key) 用于从对象储存检索特定记录，它在单独的线程中返回由指定键选择的对象储存。
3. IDBObjectStore.getAll(query, count) 返回对象存储中与指定参数匹配的所有对象，如果没有给出参数，则返回存储中的所有对象。
```js
const store = db.transaction([dbName], 'readwrite').objectStore(dbName);
const request = store.index(name).getAll(value);
```

## 完整代码+马上掘金
<iframe src="https://code.juejin.cn/pen/7176188633831964687"></iframe>

## 参考资料
- [HTML5 indexedDB前端本地存储数据库实例教程](https://www.zhangxinxu.com/wordpress/2017/07/html5-indexeddb-js-example/)