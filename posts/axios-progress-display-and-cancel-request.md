---
date: 21:32 2023/3/22
title: axios 上传下载进度显示和取消请求
tags:
- JS
description: Axios 是一个基于 promise 网络请求库，可用于 node.js 和浏览器中。
---
## 介绍
Axios 是一个基于 promise 网络请求库，可用于 node.js 和浏览器中。它是 isomorphic 的(同构，即同一套代码可以运行在浏览器和 node.js 中)。在服务端它使用原生 node.js http 模块, 而在客户端 (浏览端) 则使用 XMLHttpRequests。
### 特性
- 从浏览器创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF

## 上传和下载进度显示
由于 Axios 是基于 XMLHttpRequests 的，所以可以使用 XMLHttpRequests 接口的 ProgressEvent 事件监听下载或上传进度。代码如下：
```js
axios('https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg', {
  responseType: 'blob',
  onDownloadProgress(e) {
    if (e.lengthComputable) {
      result.textContent = Math.round((e.loaded * 100) / e.total) + '%';
      if (e.loaded === e.total) {
        result.textContent += `，用时：${e.timeStamp.toFixed(0)}ms`;
      }
    }
  },
})
const data = new FormData();
data.append('file', input.files[0]);
data.append('username', 'foo');
// 或者已存在表单元素
// const data = new FormData(form:HTMLFormElement));
axios.post('upload', data, {
  headers: {'Content-Type': 'multipart/form-data;charset=utf-8'},
  onUploadProgress(e) {
    if (e.lengthComputable) {
      result.textContent = Math.round((e.loaded * 100) / e.total) + '%';
      if (e.loaded === e.total) {
        result.textContent += `，用时：${e.timeStamp.toFixed(0)}ms`;
      }
    }
  },
})
```
其中的事件属性为：
- `ProgressEvent.lengthComputable` 只读
- 是一个 `Boolean` 标志，表示底层流程将需要完成的总工作量和已经完成的工作量是否可以计算。换句话说，它告诉我们进度是否可以被测量。
- `ProgressEvent.loaded` 只读
- 是一个 `long` 类型数据，表示底层流程已经执行的工作总量。可以用这个属性和 `ProgressEvent.total` 计算工作完成比例。当使用 `HTTP` 下载资源，它只表示内容本身的部分，不包括首部和其它开销。
- `ProgressEvent.total` 只读
- 是一个 `long` 类型数据，表示正在执行的底层流程的工作总量。当使用 `HTTP` 下载资源，它只表示内容本身的部分，不包括首部和其它开销。

## 取消请求
1. 使用 Axios `CancelToken` API，但从 v0.22.0 开始不推荐使用。
```js
const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
})

// 取消请求（message 参数是可选的）
source.cancel('Operation canceled by the user.');

// 也可以通过传递一个 executor 函数到 CancelToken 的构造函数来创建一个 cancel token：
let cancel;

axios.get('/user/12345', {
  cancelToken: new CancelToken(function executor(c) {
    // executor 函数接收一个 cancel 函数作为参数
    cancel = c;
  })
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

// 取消请求
cancel();
```

2. 从 v0.22.0 开始，Axios 支持以 `fetch` API 方式—— `AbortController` 取消请求：
```js
const controller = new AbortController();

axios.get('/foo/bar', {
   signal: controller.signal
}).then(function(response) {
   //...
}).catch(err => console.dir(err));
// 取消请求
controller.abort();
```

3. 可以使用同一个 `CancelToken` 或 `signal` 取消多个请求。可以使用这两种取消 API，即使是针对同一个请求：
```js
const controller = new AbortController();

const CancelToken = axios.CancelToken;
const source = CancelToken.source();

axios.get('/user/12345', {
  cancelToken: source.token,
  signal: controller.signal
}).catch(function (thrown) {
  if (axios.isCancel(thrown)) {
    console.log('Request canceled', thrown.message);
  } else {
    // 处理错误
  }
});

axios.post('/user/12345', {
  name: 'new name'
}, {
  cancelToken: source.token
})

// 取消请求 (message 参数是可选的)
source.cancel('Operation canceled by the user.');
// 或
controller.abort();
```

## 下载过程中断请求
```js
const source = axios.CancelToken.source();
axios('https://fetch-progress.anthum.com/30kbps/images/sunrise-baseline.jpg', {
  cancelToken: source.token,
  responseType: 'blob',
  onDownloadProgress(e) {
    if (e.lengthComputable) {
      progress.textContent = Math.round((e.loaded * 100) / e.total) + '%';
      if (e.loaded === e.total) {
        progress.textContent += `，用时：${e.timeStamp.toFixed(0)}ms`;
      }
    }
  }
}).then(res => {
  console.log(res);
  i1.src = URL.createObjectURL(res.data);
}).catch(err => progress.textContent = err.message);
stopBtn.onclick = e => source.cancel('Operation canceled by the user.');
```
