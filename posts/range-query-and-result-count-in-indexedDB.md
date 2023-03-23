---
date: 23:52 2023/3/23
title: 前端本地存储数据库 IndexedDB 的范围查询和对结果计数
tags:
- indexedDB
description: SQL 语句中有 BETWEEN 操作符和 COUNT() 函数可以用来对匹配的记录进行过滤和计数。IndexedDB 也提供了 IDBKeyRange 接口和 IDBObjectStore.count() 方法可以实现相同的目的。
---
## 介绍
![微信截图_20221209222347.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff12ea5c5c484009a4776744a294b685~tplv-k3u1fbpfcp-watermark.image?)

IndexedDB 是一种浏览器底层 API，目前各浏览器都已支持，兼容性很好。

1. IndexedDB 内部采用对象仓库（object store）存放键值对数据。可以存储结构化克隆算法支持的任何对象。每一个数据记录都有对应的主键，主键是独一无二的，并且不能有重复。
2. 使用索引实现对数据的高性能搜索。
3. IndexedDB API 大部分都是异步的。不会通过返回值提供数据，而是要传递一个回调函数来获取返回值。
4. 同大多数 Web 存储解决方案一样，IndexedDB 遵循同源策略。即可以访问相同域内存储的数据，但无法跨不同域访问数据。
5. 可以存储文件/二进制对象。
6. 在 Web Worker 中可用。
7. IndexedDB 属于 NoSQL 和事务型面向对象数据库系统。对数据库的所有操作，都要通过事务完成。

后端开发者都知道，SQL 语句中有 BETWEEN 操作符和 COUNT() 函数可以用来对匹配的记录进行过滤和计数。IndexedDB 也提供了 IDBKeyRange 接口和 IDBObjectStore.count() 方法可以实现相同的目的。
```sql
SELECT COUNT(*) FROM Persons WHERE LastName BETWEEN 'Adams' AND 'Carter';
```

## 范围搜索
键集合 IDBKeyRange 对象通过使用一个键或某个范围的键从 IDBObjectStore 和 IDBIndex 对象中检索记录，并可以使用下限和上限来限制范围。下表给出了检索特定范围内的方法：

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

bound()、only()、lowerBound()、upperBound() 方法即是方法名字面意思：“范围内”、“仅仅是”、“小于某值、“大于某值”。方法最后还支持两个布尔值参数，布尔值参数为 true 的时候表示不含范围边界。

## 结果计数
IDBObjectStore 接口的 count(query) 方法返回一个 IDBRequest 对象，并在单独的线程中返回与提供的键或匹配的记录总数。其中 query 参数可以是键属性或 IDBKeyRange 对象。如果未提供参数，则返回存储中的记录总数。

## 使用
下面我们在 IndexedDB 存储中插入一系列数据，然后通过 IDBKeyRange 对象对结果进行范围搜索，并使用 IDBObjectStore 接口的 count(query) 方法对结果进行计数。
```html
<!DOCTYPE html>
<body>
  <ul></ul>
  <form>
    <div>
      <div>
        <label for="none">不筛选</label>
        <input type="radio" name="value" value="none" id="none" checked />
      </div>
    </div>
    <div>
      <div>
        <label for="only">单个值筛选</label>
        <input type="radio" name="value" value="only" id="only" />
      </div>
      <div>
        <label for="onlytext">值</label>
        <input type="text" name="onlytext" id="onlytext" />
      </div>
    </div>
    <div>
      <div>
        <label for="range">筛选范围内的值</label>
        <input type="radio" name="value" value="range" id="range" />
      </div>
      <div>
        <label for="rangelowertext">范围下限</label>
        <input type="text" name="rangelowertext" id="rangelowertext" />
      </div>
      <div>
        <label for="rangeuppertext">范围上限</label>
        <input type="text" name="rangeuppertext" id="rangeuppertext" />
      </div>
    </div>
    <div>
      <div>
        <label for="lower">筛选不低于下限的值</label>
        <input type="radio" name="value" value="lower" id="lower" />
      </div>
      <div>
        <label for="lowerboundtext">下限</label>
        <input type="text" name="lowerboundtext" id="lowerboundtext" />
      </div>
    </div>
    <div>
      <div>
        <label for="upper">筛选不高于上限的值</label>
        <input type="radio" name="value" value="upper" id="upper" />
      </div>
      <div>
        <label for="upperboundtext">上限</label>
        <input type="text" name="upperboundtext" id="upperboundtext" />
      </div>
    </div>
    <div>
      <div>
        <input type="radio" name="filterIndex" value="fThing" id="thing" checked />
        <label for="thing">按名称筛选和排序</label>
      </div>
      <div>
        <input type="radio" name="filterIndex" value="fRating" id="rating" />
        <label for="rating">按评分筛选和排序</label>
      </div>
    </div>
    <input class="run" type="submit" value="查询">
  </form>
</body>
<script>
  var db;
  var things = [
    { fThing: "Drum kit", fRating: 10 },
    { fThing: "Family", fRating: 10 },
    { fThing: "Batman", fRating: 9 },
    { fThing: "Brass eye", fRating: 9 },
    { fThing: "The web", fRating: 9 },
    { fThing: "Mozilla", fRating: 9 },
    { fThing: "Firefox OS", fRating: 9 },
    { fThing: "Curry", fRating: 9 },
    { fThing: "Paneer cheese", fRating: 8 },
    { fThing: "Mexican food", fRating: 8 },
    { fThing: "Chocolate", fRating: 7 },
    { fThing: "Heavy metal", fRating: 10 },
    { fThing: "Monty Python", fRating: 8 },
    { fThing: "Aphex Twin", fRating: 8 },
    { fThing: "Gaming", fRating: 7 },
    { fThing: "Frank Zappa", fRating: 9 },
    { fThing: "Open minds", fRating: 10 },
    { fThing: "Hugs", fRating: 9 },
    { fThing: "Ale", fRating: 9 },
    { fThing: "Christmas", fRating: 8 },
    ];
  var list = document.querySelector("ul");
  var form = document.querySelector("form");
  var thing = document.querySelector("#thing");
  var rating = document.querySelector("#rating");
  var button = document.querySelector("button");
  var onlyText = document.querySelector("#onlytext");
  var rangeLowerText = document.querySelector("#rangelowertext");
  var rangeUpperText = document.querySelector("#rangeuppertext");
  var lowerBoundText = document.querySelector("#lowerboundtext");
  var upperBoundText = document.querySelector("#upperboundtext");
  window.onload = function() {
    rating.onchange = e => {
      document.querySelectorAll('input[type=text]').forEach(v => {
        v.setAttribute('pattern', '[0-9]');
        v.title = '请输入数字！';
      });
    };
    thing.onchange = e => {
      document.querySelectorAll('input[type=text]').forEach(v => {
        v.setAttribute('pattern', '[A-Z]{1}');
        v.title = '请输入单个大写字母！';
      });
    };
    form.onsubmit = e => {
      e.preventDefault();
      displayData();
    };
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    var DBOpenRequest = window.indexedDB.open("fThings", 1);
    DBOpenRequest.onsuccess = function(event) {
      db = DBOpenRequest.result;
      populateData();
    };
    DBOpenRequest.onupgradeneeded = function(event) {
      var db = event.target.result;
      db.onerror = function(event) {
        note.innerHTML += "<li>Error loading database.</li>";
      };
      var objectStore = db.createObjectStore("fThings", { keyPath: "fThing" });
      objectStore.createIndex("fRating", "fRating", { unique: false });
    };

    function populateData() {
      var transaction = db.transaction(["fThings"], "readwrite");
      var objectStore = transaction.objectStore("fThings");
      for (i = 0; i < things.length; i++) {
        var request = objectStore.put(things[i]);
      }
      transaction.oncomplete = function() {
        displayData();
      };
    }
    var keyRangeValue = null;

    function displayData() {
      checkedValue = document.querySelector('input[name="value"]:checked').value;
      var transaction = db.transaction(["fThings"], "readonly");
      var objectStore = transaction.objectStore("fThings");
      var filterIndex = document.querySelector('input[name="filterIndex"]:checked').value;
      if (filterIndex == "fThing") {
        if (checkedValue == "none") {
          keyRangeValue = null;
        } else if (checkedValue == "only") {
          keyRangeValue = IDBKeyRange.only(onlyText.value);
        } else if (checkedValue == "range") {
          keyRangeValue = IDBKeyRange.bound(rangeLowerText.value, rangeUpperText.value, false, false);
        } else if (checkedValue == "lower") {
          keyRangeValue = IDBKeyRange.lowerBound(lowerBoundText.value);
        } else if (checkedValue == "upper") {
          keyRangeValue = IDBKeyRange.upperBound(upperBoundText.value);
        }
      } else {
        //遍历 fRating 索引而不是对象存储：
        objectStore = objectStore.index("fRating");
        if (checkedValue == "none") {
          keyRangeValue = null;
        } else if (checkedValue == "only") {
          keyRangeValue = IDBKeyRange.only(parseFloat(onlyText.value));
        } else if (checkedValue == "range") {
          keyRangeValue = IDBKeyRange.bound(parseFloat(rangeLowerText.value), parseFloat(rangeUpperText.value), false, false);
        } else if (checkedValue == "lower") {
          keyRangeValue = IDBKeyRange.lowerBound(parseFloat(lowerBoundText.value));
        } else if (checkedValue == "upper") {
          keyRangeValue = IDBKeyRange.upperBound(parseFloat(upperBoundText.value));
        }
      }
      if (keyRangeValue != null) {
        const { lower, upper, lowerOpen, upperOpen } = keyRangeValue;
        console.log(`范围的下限: ${lower},下限值是否包含在键范围内: ${lowerOpen}\n
          范围的上限: ${upper}, 上限值是否包含在键范围内: ${upperOpen}`);
      }
      list.innerHTML = "";
      objectStore.openCursor(keyRangeValue).onsuccess = function(event) {
        var cursor = event.target.result;
        if (cursor) {
          var listItem = document.createElement("li");
          listItem.innerHTML = "<strong>" + cursor.value.fThing + "</strong>, " + cursor.value.fRating;
          list.appendChild(listItem);
          cursor.continue();
        }
      };
      var countRequest = objectStore.count(keyRangeValue);
      countRequest.onsuccess = function() {
        var listItem = document.createElement("li");
        listItem.innerHTML = "<strong>总计</strong>: " + countRequest.result;
        list.insertAdjacentElement('afterbegin', listItem);
      };
    };
  };
</script>
<style>
  ul {
    list-style-type: none;
    flex: 100px;
    margin-right: 1em;
    padding: 2rem 1rem;
    text-align: center;
    background: white linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
    box-shadow: 3px 3px 10px black;
  }
  li {
    padding-bottom: 1rem;
  }
  body {
    display: flex;
  }
  form {
    flex: 5;
    margin-top: 1rem;
  }
  form>div {
    margin-bottom: 1rem;
    padding: 1rem 1rem 2rem;
    background: white linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2));
    box-shadow: 3px 3px 10px black;
  }
  form div div {
    clear: both;
    margin-top: 1rem;
  }
  form div label {
    width: 55%;
    clear: both;
  }
  form div input {
    float: right;
  }
  form div input[type="text"] {
    width: 30%;
  }
  form div input[type="radio"] {
    margin-right: 10px;
  }
  button {
    display: block;
    width: 30%;
    margin: 0 auto;
    line-height: 1.5;
    box-shadow: 1px 1px 2px black;
  }
  :invalid {
    outline-color: red;
  }
</style>
```

## 马上掘金
<iframe src="https://code.juejin.cn/pen/7177060500306395140"></iframe>

## 其他
- [前端本地存储数据库 IndexedDB 的增删改查](https://juejin.cn/post/7176211543330144315)
- [前端本地存储数据库 IndexedDB 和 Web SQL、Web Storage 的对比](https://juejin.cn/post/7176556381376348215)