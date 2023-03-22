---
date: 21:54 2023/3/22
title: 学会使用 Fetch API
tags:
- JS
description: Fetch 是一个用来获取网络资源的 API，与 XMLHttpRequest 功能基本相同，但 Fetch 使用 Promise 处理响应，而不是回调函数。
---
## 介绍
Fetch 是一个用来获取网络资源的 API，与 XMLHttpRequest 功能基本相同，但 Fetch 使用 Promise 处理响应，而不是回调函数。

## 语法
```ts
Promise<Response> fetch(input:string|Request[, options:object]);
```
> 当接收到一个代表错误的 HTTP 响应状态码时，从 `fetch()` 返回的 Promise **不会被标记为 reject**，即使是 404 或 500 状态，也都会将 Promise 状态标记为 resolve（如果响应的 HTTP 状态码不在 200 - 299 的范围内，则设置 resolve 返回值的 `ok` 属性为 false）。只有当网络故障时或请求被阻止时，**才会被标记为 reject**。

### options
- `method`: 请求使用的方法，如 `GET`、`POST`。
- `headers`: 请求的头信息，可以为 `Headers` 对象或包含 `Headers` 属性和值的对象字面量。
- `body`: 请求的 body 信息：`Blob`、`FormData`、`URLSearchParams` 对象或者字符串。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
- `signal`: 指定一个 `AbortSignal` 实例，用于取消 `fetch()` 请求。
- `keepalive`：用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据。一个典型的场景就是，用户离开网页时，脚本向服务器提交一些用户行为的统计信息。这时，如果不用 `keepalive` 属性，数据可能无法发送，因为浏览器已经把页面卸载了。
- `mode`: 请求的模式，如 `cors`（默认值，允许跨域请求。）、`no-cors`（请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求。）或者 `same-origin`（只允许同源请求）。
- `credentials`: 请求的 credentials，`same-origin`（默认值，同源请求时发送 `cookie`，跨域请求时不发送。）、`omit`（一律不发送）或者 `include`（不管同源请求，还是跨域请求，一律发送 `cookie`。）。为了在当前域名内自动发送 `cookie`，必须提供这个选项，从 Chrome 50 开始，这个属性也可以接受 `FederatedCredential` 实例或是一个 `PasswordCredential` 实例。
- `cache`: 请求的 cache 模式：`default`、 `no-store`、 `reload` 、 `no-cache`、 `force-cache` 或者 `only-if-cached`。
    - `default`：默认值，先在缓存里面寻找匹配的请求。
    - `no-store`：直接请求远程服务器，并且不更新缓存。
    - `reload`：直接请求远程服务器，并且更新缓存。
    - `no-cache`：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存。
    - `force-cache`：缓存优先，只有不存在缓存的情况下，才请求远程服务器。
    - `only-if-cached`：只检查缓存，如果缓存里面不存在，将返回504错误。

- `redirect`: 可用的 redirect 模式：`follow` (自动跟随重定向), `error` (如果产生重定向 `fetch()` 将自动终止并抛出错误），或者 `manual` (`fetch()` 不跟随 HTTP 跳转，但是 `response.url` 属性会指向新的 URL，`response.redirected` 属性会变为 `true`，由开发者自己决定后续如何处理跳转。)。在 Chrome 中默认使用 `follow`（Chrome 47 之前的默认值是 `manual`）。
- `referrer`: `no-referrer`、`client` 或一个 URL。默认是 `client`。
- `referrerPolicy`: 指定了 HTTP 头部 referer 字段的值。可能为以下值之一：`no-referrer`、 `no-referrer-when-downgrade`、`origin`、`origin-when-cross-origin`、 `unsafe-url`。
- `integrity`: 请求的 **SRI**（子资源完整性（Subresource Integrity）是允许浏览器检查其获得的资源（例如从 CDN 获得的）是否被篡改的一项安全特性。它通过验证获取文件的哈希值和你提供的哈希值是否一样来判断资源是否被篡改。比如，下载文件时，检查文件的 SHA-256 哈希值是否相符，确保没有被篡改。) 值（例如： `sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=`）。

```js
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-8"
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```


## Response 对象
`fetch()` 方法返回一个 Promise，resolve 时得到一个 Response 对象。

### 属性
- Response.headers 只读
- 包含此 Response 所关联的 Headers 对象。
- Response.ok 只读
- 包含了一个布尔值，表示该 Response 成功（HTTP 状态码的范围在 200-299）。
- Response.redirected 只读
- 表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。
- Response.status 只读
- 包含 Response 的状态码（例如 200 表示成功）。
- Response.statusText 只读
- 包含了与该 Response 状态码一致的状态信息（例如，OK 对应 200）。
- Response.type 只读
- 包含 Response 的类型（例如，basic、cors）。
- Response.url 只读
- 包含 Response 的 URL。
- Response.body 只读
- 一个简单的 getter，用于暴露一个 ReadableStream 类型的 body 内容。
- Response.bodyUsed 只读
- 包含了一个布尔值，表示该 Response 是否读取过 Body。

### 方法
- Response.clone()
- 创建一个 Response 对象的克隆。
- Response.error()
- 返回一个绑定了网络错误的新的 Response 对象。
- Response.redirect()
- 用另一个 URL 创建一个新的 Response。
- 以下方法 Responses 对象被设置为了 stream 的方式，所以只能被读取一次：
- Response.arrayBuffer()
- 读取 Response 对象并且将它设置为已读，并返回一个被解析为 ArrayBuffer 格式的 Promise 对象。
- Response.blob()
- 读取 Response 对象并且将它设置为已读，并返回一个被解析为 Blob 格式的 Promise 对象。
- Response.formData()
- 读取Response 对象并且将它设置为已读，并返回一个被解析为 FormData 格式的 Promise 对象。
- Response.json()
- 读取 Response 对象并且将它设置为已读，并返回一个被解析为 JSON 格式的 Promise 对象。
- Response.text()
- 读取 Response 对象并且将它设置为已读，并返回一个被解析为 USVString 格式的 Promise 对象。

## 使用
```js
const response = await fetch("https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web//static/favicons/favicon-32x32.png");
for (let [key, value] of response.headers) { 
  console.log(`${key} : ${value}`);  
}
response.headers.forEach(
  (value, key) => console.log(key, ':', value)
);
console.log(response.headers.get('Content-Type'));
const response = await fetch("https://api.juejin.cn/content_api/v1/author_center/task_list", {
  "headers": {
    "content-type": "application/json",
  },
  "body": "{\"cursor\":\"0\",\"limit\":10}",
  "method": "POST",
  "credentials": "include"
});
console.log(await response.clone().json());
```

### 上传文件
上传二进制文件时，不用修改标头的 `Content-Type`，浏览器会自动设置。
1. 方式一，已存在的表单元素：`fetch(url, { body: new FormData(form:HTMLFormElement) })`。
2. 方式二，构造出一个表单对象：
```js
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append('file', input.files[0]);
data.append('username', 'foo');

const response = fetch(url, {
  method: 'POST',
  body: data
});
```
3. 方式三，直接上传二进制数据，将 `Blob` 或 `ArrayBuffer` 对象放在 `body` 属性里面：
```js
const blob = await new Promise(resolve =>   
  canvasElem.toBlob(resolve,  'image/png')
);

const response = await fetch(url, {
  method:  'POST',
  body: blob
});
```

## 总结和对比 axios
- Fetch API 是 WHATWG 规范标准，axios 使用的是 XMLHttpRequest，都是基于 promise 的，在 IE 中都需要 promise Polyfill。
- Fetch 没有 `XMLHttpRequest.onprogress` 事件，但可以通过 `Response.body` 接口返回的 ReadableStream 对象获取当前数据块大小，监测上传下载进度。
- **中断请求功能** 可以通过 AbortController、AbortSignal API 实现。
- **拦截请求和响应功能** 可以通过包装 `fetch()` 方法或 npm 库 fetch-intercept 实现。