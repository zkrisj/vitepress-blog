---
date: 23:46 2023/3/23
title: 前端本地存储数据库 IndexedDB 和 Web SQL、Web Storage 的对比
tags:
- indexedDB
description: Web SQL 直接把 SQL 语句嵌入到 JS 中了，与关系型数据库的操作非常类似。这个设计成为了 Web SQL 被舍弃的重要原因。
---
## 介绍
将大量数据储存在客户端，这样可以减少从服务器获取数据的压力，提升用户体验。现有的浏览器数据储存方案，都不适合储存大量数据：Cookie 的大小不超过4KB，且每次请求都会发送回服务器；Storage 存储在 5MB 左右，各浏览器不同，而且不提供搜索功能，也不能建立自定义的索引。所以，需要一种新的解决方案在客户端存储数据。

![微信截图_20221203165025.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/da43f47ea94346e8b8d8cba6ccf977d1~tplv-k3u1fbpfcp-watermark.image?)

IndexedDB 是一种将数据持久存储在用户浏览器中的方法，它可以创建**具有丰富查询能力**的 Web 应用程序，并且**可以在线和离线工作**，它的**存储空间比 Storage 大得多**，一般来说不少于 250MB，甚至没有上限。IndexedDB 适用于存储大量数据的应用程序（例如，图书馆中的目录）和不需要持续互联网连接即可工作的应用程序（例如，邮件客户端、待办事项列表和记事本）。

## 同源策略
- 与大多数 Web 存储解决方案一样，IndexedDB 遵循同源策略。
- 可以访问相同域内存储的数据，但无法跨不同域访问数据。
- 第三方窗口内容（例如 `<iframe>` 内容）可以访问其嵌入来源的 IndexedDB 存储，除非浏览器设置为从不接受第三方 cookie。

## 面向对象的数据库
- IndexedDB 是一个基于 JavaScript 的面向对象数据库，IndexedDB 内部采用对象仓库（object store）存放数据。
- 允许存储和检索使用“键”索引的对象。
- 所有类型的数据都可以直接存入，包括结构化克隆算法支持的任何 JavaScript 对象都可以持久保存到该存储。
- 支持储存二进制数据（ArrayBuffer 对象和 Blob 对象）。
- 对象仓库中，数据以"键值对"的形式保存，每一个数据记录都有对应的主键，主键是独一无二的，不能有重复，否则会抛出错误。

## NoSQL 数据库
- IndexedDB 不是一个关系型数据库，在传统的关系数据库中，使用表来存储数据行和命名数据类型列的集合。
- IndexedDB 不使用结构化查询语言 (SQL)，更接近 NoSQL 数据库。
- 它在生成游标的索引上使用查询，您可以使用游标遍历结果集。
- IndexedDB 要求您为一种数据类型创建对象存储并将 JavaScript 对象持久保存到该存储。每个对象存储都可以有一个索引集合，可以高效地查询和迭代。

## 事务型
- IndexedDB 属于事务型数据库系统，对数据库所做的所有更改都发生在事务中。这意味着一系列操作步骤之中，只要有一步失败，整个事务就都取消，数据库回滚到事务发生之前的状态，不存在只改写一部分数据的情况。
- 在 IndexedDB 中所做的一切都在事务上下文中发生，IndexedDB API 提供了许多代表索引、表、游标等的对象，但每个对象都与特定事务相关联。因此，不能在事务外执行命令或打开游标。
- 事务对象提供 error、abort 和 complete 三个事件，用来监听操作结果。
- 事务具有明确定义的生命周期，因此在事务完成后尝试使用它会抛出异常。
- 此外，事务自动提交，不能手动提交。例如，当同时在两个不同的选项卡中打开 Web 应用程序的两个实例时，如果没有事务操作，这两个实例可能会干扰彼此的修改。

## 异步
- IndexedDB API 大部分都是异步的。异步设计是为了防止大量数据的读写，拖慢网页的表现。
- API 不会通过返回值提供数据；相反，它必须传递一个回调函数来获取返回值。
- 例如，很多请求具有 onsuccess 和 onerror 属性，也可以对它们调用 addEventListener() 和 removeEventListener()。
- 它们还有 readyState、result 和 errorCode 属性可以告诉您请求的状态。result 属性特别神奇，因为它可以是许多不同的东西，具体取决于请求的生成方式（例如，一个 IDBCursor 实例，或者您刚刚插入数据库的值的键）。

## 数据同步
- IndexedDB API 并非设计用于处理与服务器端数据库的同步。
- 如果需要与服务器端数据库的同步，可以编写将客户端 indexedDB 数据库与服务器端数据库同步的代码。

## 清除数据库
注意，浏览器可以清除数据库，例如在以下情况下：
- 浏览器的设置允许用户删除给定网站存储的所有数据，包括 cookie、书签、存储的密码和 IndexedDB 数据。
- 某些浏览器具有“隐私浏览”(Firefox) 或“隐身”(Chrome) 模式。在会话结束时，浏览器会清除数据库。
- 已达到磁盘或配额限制。
- 数据已损坏。
- 对该功能进行了不兼容的更改。

## 主要接口
### 数据库：IDBDatabase 对象
- 数据库是一系列相关数据的容器。每个域名（严格的说，是协议 + 域名 + 端口）都可以新建任意多个数据库。
- IDBDatabase 接口提供一个到数据库的连接。
- 使用 IDBDatabase 对象在数据库中打开一个 transaction, 然后进行操作或者删除数据库中的对象。
- IDBDatabase 接口是唯一一个能够访问和管理数据库版本的接口。
- IndexedDB 数据库在同一个时刻，只能有一个版本的数据库存在。
- 如果要修改数据库结构（新增或删除表、索引或者主键），只能通过升级数据库版本完成。

### 对象仓库：IDBObjectStore 对象
- 每个数据库包含若干个对象仓库（object store）。它类似于关系型数据库的表格。
- 对象库中的记录根据其键值进行排序。这种排序可以实现快速插入，查找和有序检索。
- 对象仓库保存的是数据记录。每条记录类似于关系型数据库的行，但是只有主键和数据体两部分。主键用来建立默认的索引，必须是不同的，否则会报错。主键可以是数据记录里面的一个属性，也可以指定为一个递增的整数编号。数据体可以是任意数据类型，不限于对象。

### 索引： IDBIndex 对象
- 为了加速数据的检索，可以在对象仓库里面，为不同的属性建立索引。
- IDBIndex 接口提供了异步获取数据库中一个 index（被引用的 object store）的功能。
- 可以通过使用该接口来取回数据。IDBCursor 也提供了另一种方式。
- 一个 index 可以让你在 object store 的记录中，通过使用记录的 properties（属性）来寻找记录。
- 在 object store 中新增、更新或是删除记录时，索引中的记录将自动填充。
- 索引中的每条记录只能指向其引用的 object store 中的唯一一条记录，但是多个索引可以引用同一个 object store。
- 当 object store 变更时，所有引用 object store 的索引都会自动更新。

### 事务： IDBTransaction 对象
- 异步事务使用数据库中的事件对象属性。
- 由 IDBDatabase 发起事务，通过 IDBTransaction 来设置事务的模式（例如：是否只读 readonly 或读写 readwrite）。
- 事务在被创建的时候就已经开始，并非在发起第一个请求（IDBRequest) 的时候。例如下面的例子，代码执行后，object store 应该具有值 "2", 因为 trans2 应该在 trans1 之后执行。

```js
const trans1 = db.transaction("foo", "readwrite");
const trans2 = db.transaction("foo", "readwrite");
const objectStore2 = trans2.objectStore("foo")
const objectStore1 = trans1.objectStore("foo")
objectStore2.put("2", "key");
objectStore1.put("1", "key");
```
事务失败的情况：
1. 由于请求出错而中止，例如尝试 IDBObjectStore.add() 添加相同的键的记录两次，或 IDBObjectStore.put() 更新具有唯一性约束的相同索引键。这会导致请求错误，并会冒泡到事务错误，从而中止事务。这可以通过在 IDBRequest.error 事件上使用 preventDefault() 来防止。
2. 显式调用 IDBTransaction.abort() 方法（回滚与此事务关联的数据库中对象的所有更改）。
3. IDBRequest 的 success 和 error 事件处理程序中的未捕获异常。
4. I/O 错误（例如实际写入磁盘失败，或其他操作系统/硬件故障）。
5. 超出配额（存储）。
6. 用户代理（浏览器）崩溃。

### 操作请求：IDBRequest 对象
- indexedDB 所有异步操作立即返回一个 IDBRequest 实例。
- 这个对象通过三个事件 error（打开数据库失败）、success（打开数据库成功）、upgradeneeded（打开数据库的版本号，大于数据库的实际版本号）来处理打开数据库的操作结果。
- 每一个请求都有一个 readyState 属性，初始时为 pending，当请求完成或失败的时候，readyState 会变为 done。当状态值变为 done 时，每一个请求都会返回 result 和 error 属性，并且会触发一个事件（success 或 error）。
- 当状态保持为 pending 时，任何尝试访问 result 或 error 属性的行为会触发一个 InvalidStateError 异常。

```js
const request = window.indexedDB.open(databaseName, version);
request.onsuccess = function (event) {
  db = request.result;
  console.log('数据库打开成功');
};
request.onupgradeneeded = function (event) {
  db = event.target.result;
}
```

### 游标： IDBCursor 对象
- 遍历数据表格的多条记录，要使用指针对象 IDBCursor，它使应用程序能够异步处理在游标范围内的所有记录。
- 游标有一个 source 只读属性，指示游标正在迭代的索引（IDBIndex）或者对象存储区（IDBObjectStore）。
- 游标在所属区间范围内有一个位置，根据记录健（存储字段）的顺序递增或递减方向移动。
- 可以在同一时间拥有多个游标。

```js
function readAll() {
  const objectStore = db.transaction('person').objectStore('person');
  // openCursor()方法是一个异步操作，所以要监听success事件
   objectStore.openCursor().onsuccess = function (event) {
     const cursor = event.target.result;

     if (cursor) {
       console.log('Id: ' + cursor.key);
       console.log('Name: ' + cursor.value.name);
       console.log('Age: ' + cursor.value.age);
       console.log('Email: ' + cursor.value.email);
       cursor.continue();
    } else {
      console.log('没有更多数据了！');
    }
  };
}
```

### 键集合：IDBKeyRange 对象
- 通过使用一个键或某个范围的键从 IDBObjectStore 和 IDBIndex 对象中检索记录。
- 可以使用下限和上限来限制范围。例如，可以遍历具有 A–Z 范围中的键的所有值。
- 下表给出了检索特定范围内的键的方法：

|特定范围	|方法|
|-|-|
|All keys ≥ x	|IDBKeyRange.lowerBound (x)|
|All keys > x	|IDBKeyRange.lowerBound (x, true)|
|All keys ≤ y	|IDBKeyRange.upperBound (y)|
|All keys < y	|IDBKeyRange.upperBound (y, true)|
|All keys ≥ x && ≤ y	|IDBKeyRange.bound (x, y)|
|All keys > x &&< y	|IDBKeyRange.bound (x, y, true, true)|
|All keys > x && ≤ y	|IDBKeyRange.bound (x, y, true, false)|
|All keys ≥ x &&< y	|IDBKeyRange.bound (x, y, false, true)|
|The key = z	|IDBKeyRange.only (z)|

## IndexedDB 库
localForage、dexie.js、PouchDB、idb、idb-keyval、JsStore、lovefield 等库使 IndexedDB 的使用对开发者来说更加友好。

## 和 Web Storage 存储对比
![微信截图_20221203164453.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c97874be1f8446baa68ea7976264f9b2~tplv-k3u1fbpfcp-watermark.image?)

Web Storage 包含如下两种机制：
1. sessionStorage 为每一个给定的源（origin）维持一个独立的存储区域，该存储区域在页面会话期间可用（即只要浏览器处于打开状态，包括页面重新加载和恢复）。
2. localStorage 同样的功能，但是在浏览器关闭，然后重新打开后数据仍然存在。

```js
localStorage.colorSetting = '#a4509b';
localStorage['colorSetting'] = '#a4509b';
localStorage.setItem('colorSetting', '#a4509b');
```
这三种方式都设置了 colorSetting 条目。

对比如下：
- indexedDB 存储 IE10+ 支持，Storage 存储 IE8+ 支持，后者兼容性更好。
- Storage 存储，结果每次写入都要字符串化，写出要解析成对象。使用 indexedDB 则无需数据转换。
- indexedDB 可以在 Web Worker 中使用，Storage 存储在 Web Worker 中不可用。所以在进行 PWA 开发的时候，数据存储只能使用 indexedDB。

如何选择：
1. 如果存储数据结构简单，例如基本类型，使用 Storage 存储更加方便。
2. 如果数据结构比较复杂，同时对浏览器兼容性没要求，可以使用 indexedDB。
3. 如果是在 Service Worker 中开发应用，只能使用 indexedDB 数据存储。

## 和 Web SQL 对比
![微信截图_20221202202657.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/803c23a136b84b82b6fb55c7907a0547~tplv-k3u1fbpfcp-watermark.image?)

除了 IE 和 Firefox 不支持 Web SQL，Safari 从 13 开始也舍弃了 Web SQL，目前只有基于 Chromium 系列的浏览器继续支持。使用方式如下：
```js
const db = openDatabase('mydb', '1.0', 'Test DB', 1024 * 10);
const msg = ['www.w3school.com.cn', 2];
db.transaction(function(tx) {
  tx.executeSql('CREATE TABLE IF NOT EXISTS LOGS (id unique, log)');
});
db.transaction(function(tx) {
  tx.executeSql('INSERT INTO LOGS (id, log) VALUES (1, "mdn")');
  tx.executeSql('INSERT INTO LOGS (id, log) VALUES (2, "https://developer.mozilla.org/")');
});
db.transaction(function(tx) {
  tx.executeSql('SELECT * FROM LOGS', [], console.log);
});
db.transaction(function(tx) {
  tx.executeSql('DELETE FROM LOGS  WHERE id=1', [], console.log);
});
db.transaction(function(tx) {
  tx.executeSql('UPDATE LOGS SET log=? WHERE id=?', msg, console.log);
});
```
上面这段代码即完成了建表、插入、查询、删除、更新数据的 Web SQL。可以看到直接把 SQL 语句嵌入到 JS 中了，与关系型数据库的操作非常类似。这个设计成为了 Web SQL 被舍弃的重要原因：
- 学习成本高了很多，SQL 虽然本身并不复杂，但与前端跨度较大。
- 本身使用很不方便，需要把 JS 对象转换成关系型的字符串语句。

详细对比表格：
||Web SQL	|IndexedDB|
|-|-|-|
|优点	|真正意义上的关系型数据库，类似于 SQLite（遵守 ACID 的轻型关系型数据库管理系统）。|<li>允许对象的快速索引和搜索，因此在 Web 应用程序场景中，您可以非常快速地管理数据以及读取/写入数据。</li><li>由于是 NoSQL 数据库，因此我们可以根据实际需求设定我们的 JavaScript 对象和索引。</li><li>在异步模式下工作，每个事务具有适度的粒状锁。这允许您在 JavaScript 的事件驱动模块内工作。</li>|
|不足	|<li>新规范不再支持。</li><li>由于使用 SQL 语言，因此需要掌握 SQL 语法和转换 JavaScript 对象为对应的 SQL 语句。</li><li>非对象驱动。</li>|API 复杂。|
|位置	|包含行和列的表。	|包含 JavaScript 对象和键的存储对象。|
|查询机制	|SQL	|Cursor APIs，Key Range APIs，应用程序代码|
|事务	|锁可以发生在数据库，表，行的“读写”时候。	|锁可以发生在数据库版本变更，或是存储对象“只读”和“读写”事务时候。|
|事务提交	|事务创建是显式的。默认是回滚，除非我们调用提交。	|事务创建是显式的。默认是提交，除非我们调用中止或有一个错误没有被捕获。|

## 增删改查示例
参见 [前端本地存储数据库 IndexedDB 的增删改查](https://juejin.cn/post/7176211543330144315)

## 参考资料
- [HTML5 indexedDB前端本地存储数据库实例教程](https://www.zhangxinxu.com/wordpress/2017/07/html5-indexeddb-js-example/)