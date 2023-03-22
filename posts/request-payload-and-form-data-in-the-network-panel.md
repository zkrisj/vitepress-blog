---
date: 22:16 2023/3/22
title: 开发者工具网络面板中的 Request Payload 和 Form Data
tags:
- 工具
description: Chrome 96 开始，当你想查看网络请求中的 Request Payload 和 Form Data 信息时，可以使用网络面板里面的 Payload（载荷）边栏。
---
## 介绍
Request Payload 和 Form Data 是浏览器传输给接口的两种格式，这两种方式浏览器是通过 [`Content-Type`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Type) 来进行区分的，如果是 `application/x-www-form-urlencoded`，则为 Form Data 方式，如果是 `application/json` 或 `multipart/form-data`，则为 Request Payload 的方式。

## 开发者工具网络面板
Chrome 96 之前，Request Payload 和 Form Data 信息信息出现在报头边栏里。

比如如下使用 ajax 方式的提交 post 请求得到的响应标头（默认：`content-type:text/plain;charset=UTF-8`）：

![微信截图_20220816232651.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/14018deec22744758dfd46b1e2c8da27~tplv-k3u1fbpfcp-watermark.image?)

`content-type:multipart/form-data` 提交 post 请求得到的响应标头：

![微信截图_20220816232707.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f9230a71c33e4b4f98ef0ccbae61ccab~tplv-k3u1fbpfcp-watermark.image?)

`content-type:application/x-www-form-urlencoded` 提交 post 请求得到的响应标头：

![微信截图_20220816232623.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8bfe4000619e4eea9e71165ad433f87d~tplv-k3u1fbpfcp-watermark.image?)

Chrome 96 开始，当您想查看网络请求中的 Request Payload 和 Form Data 信息时，可以使用网络面板里面的 Payload（载荷）边栏。

`content-type:application/json` 提交 post 请求得到的响应标头：

![微信截图_20220816233328.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2530d410c604d23bfc22a410061e84c~tplv-k3u1fbpfcp-watermark.image?)

`content-type:application/x-www-form-urlencoded` 提交 post 请求得到的响应标头：

![微信截图_20220816233239.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b62b0d95fa5c40d5bbc7065ac8c6a210~tplv-k3u1fbpfcp-watermark.image?)

`content-type:application/x-www-form-urlencoded` 请求标头代码：
```js
const res = await fetch('https://www.runoob.com/try/ajax/demo_post2.php', {
  method: 'post',
  body: 'fname=Henry&lname=Ford',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}).then(res => res.text());

console.log(res); // <p style='color:red;'>你好，Henry Ford，今天过得怎么样？</p>
```

`content-type:application/json` 请求标头代码：
```js
const res = await fetch('https://www.runoob.com/try/ajax/demo_post2.php', {
  method: 'post',
  body: '{"fname":"Henry","lname":"Ford"}',
  headers: {
    'Content-Type': 'application/json'
  }
}).then(res => res.text());

console.log(res); // <p style='color:red;'>你好， ，今天过得怎么样？</p>
```
可以看到不能得到正确响应，`fname` 和 `lname` 没有传递成功，也就是后台只接受 Form Data 的参数，不接受 Request Payload 的参数。

## 默认请求标头 Content-Type
1. `fetch` 默认请求标头为：`'Content-Type': 'text/plain;charset=UTF-8'`。所以使用 `fetch` 提交 `post` 或其他 `非 get` 请求时，一定要设置 `Content-Type` 请求标头。

2. axios 默认请求标头为：`'Content-Type': 'application/x-www-form-urlencoded'`。
```js
axios({
  method: 'post',
  url: 'https://www.runoob.com/try/ajax/demo_post2.php',
  data: 'fname=Henry&lname=Ford'
});
// 或者
axios.post('https://www.runoob.com/try/ajax/demo_post2.php', 'fname=Henry&lname=Ford');
```

3. html 表单 `enctype` 默认：`application/x-www-form-urlencoded`，`get` 请求时设置 `enctype` 属性其他值会被忽略。
```html
<form action="https://www.runoob.com/try/ajax/demo_post2.php" method="post">
  <input name="fname">
  <input name="lname">
  <input type="submit">
</form>
```
