---
date: 22:12 2023/3/22
title: JSONP、CORS 和 axios 的跨域
tags:
- JS
- HTTP
description: CORS（Cross-Origin Resource Sharing，跨域资源共享）是一种基于 HTTP 头的机制，通过新增一组 HTTP 头，来决定网页如何处理跨域请求。
---
## 介绍
同源策略是一个重要的安全策略，允许一个网页可以访问具有相同来源（有相同的 `URI`、主机名和端口号）的另一个网页的数据，但限制与另一个源的资源进行交互，默认阻止跨域获取资源。

## CORS
`CORS`（`Cross-Origin Resource Sharing`，跨域资源共享）是一种基于 `HTTP` 头的机制，通过新增一组 `HTTP` 头，来决定网页如何处理跨域请求。即 `CORS` 给了 `web` 服务器这样的权限：服务器可以选择是否允许跨域请求访问到它的资源。2006 年 5 月提交了第一个 W3C 工作草案。2009 年 3 月，该草案更名为“跨域资源共享”，并于 2014 年 1 月被接受为 W3C 推荐。

请求标头包括：
- `Access-Control-Request-Headers`
- 用于发起一个预请求，告知服务器正式请求会使用那些 HTTP 头。
- `Access-Control-Request-Method`
- 用于发起一个预请求，告知服务器正式请求会使用哪一种 HTTP 请求方法。
- `Origin`
- 指示获取资源的请求是从什么域发起的。

响应标头包括：
- `Access-Control-Allow-Origin`
- 指示请求的资源能共享给哪些域。
- `Access-Control-Allow-Credentials`
- 指示当请求的凭证标记为 true 时，是否响应该请求。
- `Access-Control-Allow-Headers`
- 用在对预请求的响应中，指示实际的请求中可以使用哪些 HTTP 头。
- `Access-Control-Allow-Methods`
- 指定对预请求的响应中，哪些 HTTP 方法允许访问请求的资源。
- `Access-Control-Expose-Headers`
- 指示哪些 HTTP 头的名称能在响应中列出。
- `Access-Control-Max-Age`
- 指示预请求的结果能被缓存多久。

例如，以下在设置了允许跨域的网址上，可以正常得到响应结果：
```js
const res = await fetch('https://cors-demo.glitch.me/allow-cors')
.then(res => res.json()); // {message: "You are handling CORS like a pro!"}
```

### 原理
1. 对于简单请求（请求方法只包括 `HEAD`、`GET` 或 `POST`，请求头只包括 `Accept`、`Accept-Language`、`Content-Language` 或值为 `application/x-www-form-urlencoded`、`multipart/form-data`、`text/plain` 类型的 `Content-Type`），浏览器直接发出 `CORS` 请求，就是在头信息之中，增加一个 `Origin` 字段。

假如站点 `https://foo.example` 的网页应用想要访问 `https://bar.other` 的资源，发送的请求标头：
```shell
GET /resources/public-data/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example
```
请求首部字段 `Origin` 表明该请求来源于 `http://foo.example`。下面是响应标头：
```shell
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 00:23:53 GMT
Server: Apache/2
Access-Control-Allow-Origin: *
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Transfer-Encoding: chunked
Content-Type: application/xml

[XML Data]
```
服务端返回的 `Access-Control-Allow-Origin: *` 表明，该资源可以被 任意 外域访问。如果服务端仅允许来自 `https://foo.example` 的访问，服务端将返回以下标头：`Access-Control-Allow-Origin: https://foo.example`。本例中，使用 `Origin` 和 `Access-Control-Allow-Origin` 就能完成最简单的访问控制。

2. 对那些可能对服务器数据产生副作用的 `HTTP` 非简单请求，浏览器必须首先使用 `OPTIONS` 方法发起一个预检请求（`preflight request`），从而获知服务端是否允许该跨源请求。服务器确认允许之后，才发起实际的 `HTTP` 请求。使用预检请求以确定请求是否有权执行该操作，可以避免跨域请求对服务器的用户数据造成影响。在预检请求的返回中，服务器端也可以通知客户端，是否需要携带身份凭证（包括 `Cookies` 和 `HTTP` 认证 相关数据）。

假如站点 `https://foo.example` 的网页要向 `https://bar.other` 发送一个非简单请求，浏览器检测到，从 JavaScript 中发起的请求需要被预检，这时发送的请求标头为：
```shell
OPTIONS /doc HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Origin: https://foo.example
Access-Control-Request-Method: POST
Access-Control-Request-Headers: X-PINGOTHER, Content-Type
```
我们可以看到发送了一个使用 `OPTIONS` 方法的预检请求。`OPTIONS` 是 `HTTP/1.1` 协议中定义的方法，用以从服务器获取更多信息。该方法不会对服务器资源产生影响。首部字段 `Access-Control-Request-Method` 告知服务器，实际请求将使用 `POST` 方法。首部字段 `Access-Control-Request-Headers` 告知服务器，实际请求将携带两个自定义请求首部字段：`X-PINGOTHER` 与 `Content-Type`。服务器据此决定，该实际请求是否被允许。下面是响应标头：
```shell
HTTP/1.1 204 No Content
Date: Mon, 01 Dec 2008 01:15:39 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: X-PINGOTHER, Content-Type
Access-Control-Max-Age: 86400
Vary: Accept-Encoding, Origin
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
```
服务器的响应携带了 `Access-Control-Allow-Origin: https://foo.example`，从而限制请求的源域。`Access-Control-Allow-Methods: POST, GET, OPTIONS` 表明服务器允许客户端使用 POST 和 GET 方法发起请求，`Access-Control-Allow-Headers: X-PINGOTHER, Content-Type` 表明服务器允许请求中携带字段 X-PINGOTHER 与 Content-Type。首部字段 `Access-Control-Max-Age` 表明该响应的有效时间为 `86400` 秒，也就是 `24` 小时。在有效时间内，浏览器无须为同一请求再次发起预检请求。请注意，浏览器自身维护了一个最大有效时间，如果该首部字段的值超过了最大有效时间，将不会生效。在 `Firefox` 中，上限是 `24` 小时 （即 `86400` 秒）。 在 `Chromium v76` 之前， 上限是 `10` 分钟（即 `600` 秒)。 从 `Chromium v76` 开始，上限是 `2` 小时（即 `7200` 秒)。 `Chromium` 同时规定了一个默认值 `5` 秒。 如果值为 `-1`，表示禁用缓存，则每次请求前都需要使用 `OPTIONS` 预检请求。

预检请求完成之后，浏览器将发出实际请求。如果 `https://bar.other` 不接受来自该来源的跨站点请求，那么它将错误地响应 `OPTIONS` 请求，并且浏览器不会发出实际请求。以下是实际请求：
```shell
POST /doc HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
X-PINGOTHER: pingpong
Content-Type: text/xml; charset=UTF-8
Referer: https://foo.example/examples/preflightInvocation.html
Content-Length: 55
Origin: https://foo.example
Pragma: no-cache
Cache-Control: no-cache

<person><name>Arun</name></person>
```
实际响应如下：
```shell
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:15:40 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 235
Keep-Alive: timeout=2, max=99
Connection: Keep-Alive
Content-Type: text/plain

[Some XML payload]
```
以下是整个流程图：

![preflight_correct.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ddb3aa7aba0470ba96c1f95bfbc97db~tplv-k3u1fbpfcp-watermark.image?)

---
比如我们使用 fetch 请求以下资源：
```js
await fetch("https://poster.prodapi.cn/api/link", {
  headers: {
    "token": "ApfrIzxCoK1DwNZOEJCwlrnv6QZ0PCdv"
  },
  body: '{"title":"人工智能+机器学习","id":2}',
  method: "POST",
}).then(res=>res.json());
```
打开控制台，可以看到发出了两次请求，一次是预检请求，一次是 fetch 请求。

![微信截图_20220831200902.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/53eded5e26074dbc85f7fb439f298b5a~tplv-k3u1fbpfcp-watermark.image?)

### 向服务器发送 Cookies
对于跨源 `XMLHttpRequest` 或 `Fetch` 请求，浏览器不会发送身份凭证信息。但 `XMLHttpRequest` 或 `Fetch` 可以基于 `HTTP cookies` 和 `HTTP` 认证信息发送身份凭证。

假如 `https://foo.example` 的某脚本向 `https://bar.other` 发起一个 `GET` 请求，并设置 `Cookies`：
```js
const invocation = new XMLHttpRequest();
const url = 'https://bar.other/resources/credentialed-content/';

function callOtherDomain() {
  if (invocation) {
    invocation.open('GET', url, true);
    invocation.withCredentials = true;
    invocation.onreadystatechange = handler;
    invocation.send();
  }
}
```
第 7 行将 `XMLHttpRequest` 的 `withCredentials` 标志设置为 `true`，从而向服务器发送 `Cookies`。因为这是一个简单 `GET` 请求，所以浏览器不会对其发起“预检请求”。但是，如果服务器端的响应中未携带 `Access-Control-Allow-Credentials: true`，浏览器将不会把响应内容返回给请求的发送者。客户端发送的请求头如下：
```shell
GET /resources/credentialed-content/ HTTP/1.1
Host: bar.other
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:71.0) Gecko/20100101 Firefox/71.0
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip,deflate
Connection: keep-alive
Referer: https://foo.example/examples/credential.html
Origin: https://foo.example
Cookie: pageAccess=2
```
服务端的响应如下：
```shell
HTTP/1.1 200 OK
Date: Mon, 01 Dec 2008 01:34:52 GMT
Server: Apache/2
Access-Control-Allow-Origin: https://foo.example
Access-Control-Allow-Credentials: true
Cache-Control: no-cache
Pragma: no-cache
Set-Cookie: pageAccess=3; expires=Wed, 31-Dec-2008 01:34:53 GMT
Vary: Accept-Encoding, Origin
Content-Encoding: gzip
Content-Length: 106
Keep-Alive: timeout=2, max=100
Connection: Keep-Alive
Content-Type: text/plain

[text/plain payload]
```
流程图如下：

![Access-Control-Allow-Credentials.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a31177709a204ed7a25b22bbd4915518~tplv-k3u1fbpfcp-watermark.image?)

---
需要注意的是，如果要发送 `Cookie` 这样附带身份凭证的请求时，`Access-Control-Allow-Origin` 就不能设为星号，必须指定明确的、与请求网页一致的域名。同时，`Cookie` 依然遵循同源政策，只有用服务器域名设置的 `Cookie` 才会上传，其他域名的 `Cookie` 并不会上传，且（跨源）原网页代码中的 `document.cookie` 也无法读取服务器域名下的 `Cookie`。另外，响应首部中也携带了 `Set-Cookie` 字段，将尝试对 `Cookie` 进行修改。如果用户设置其浏览器拒绝所有第三方 `cookies`，那么将不会被保存。

### 获取响应头
在跨源访问时，`XMLHttpRequest` 对象的 `getResponseHeader()` 方法只能拿到一些最基本的响应头，`Cache-Control`、`Content-Language`、`Content-Type`、`Expires`、`Last-Modified`、`Pragma`，如果要访问其他头，则需要服务器设置本响应头。Access-Control-Expose-Headers 头让服务器把允许浏览器访问的头放入白名单，例如：`Access-Control-Expose-Headers: X-My-Custom-Header, X-Another-Custom-Header`。这样浏览器就能够通过 `getResponseHeader` 访问 `X-My-Custom-Header` 和 `X-Another-Custom-Header` 响应头了。

### 使用
实际使用中，我们只需要在服务端配置允许跨域的响应 `HTTP` 头。
PHP 的服务端设置：
```php
<?php
header('Access-Control-Allow-Origin:*');
// 接下来就可以给跨域请求返回数据
?>
```
nodeJS http 模块的服务端设置：
```js
require('http').createServer(function(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*'); // 默认只允许简单请求方法
  res.setHeader('Access-Control-Allow-Headers', '*'); // 默认只允许简单请求标头
  res.end(`hello`);
}).listen(8080, 'localhost', function() {
  console.log(this.address());
});
```
express 的中间件设置：
```js
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', '*'); // 默认只允许简单请求方法
  res.setHeader('Access-Control-Allow-Headers', '*'); // 默认只允许简单请求标头
  next();
});
```

## JSONP
![jsonp.webp](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/67b423bdacc748e998850608dbc3fb9f~tplv-k3u1fbpfcp-watermark.image?)

---
`JSONP` 指的是 `JSON with Padding`。鲍勃·伊波利托（Bob Ippolito）于 2005 年 12 月提出了 JSONP 最原始的提案，其中填充部分为回调函数。
### 原理
由于同源策略，从另一个域请求文件会引起问题，而嵌入的跨域资源不受同源策略约束。`JSONP` 利用了这个开放策略，使用 `script` 标签替代 `XMLHttpRequest` 对象或 `fetch` 来请求数据。用 `JSONP` 抓到的资料并不是 `JSON`，而是任意的 `JavaScript` 代码。

### 使用步骤
#### php
1. 服务端设置响应 `JavaScript` 代码：
```php
<?php
$myJSON = '{ "name":"Bill Gates", "age":62, "city":"Seattle" }';
 
echo "myFunc(".$myJSON.");";
?>
```
2. 本地请求服务端 `JSONP` 脚本：
```html
<script src="https://www.w3school.com.cn/demo/demo_php_jsonp.php" defer></script>
```
3. 本地设置 `JavaScript` 回调函数：
```js
function myFunc(myObj)  {
    document.getElementById("demo").innerHTML =  myObj.name;
}
```
#### nodeJS
1. 服务端设置响应 `JavaScript` 代码：
```js
require('http').createServer(function(req, res) {
  const origin = req.headers.host + req.url;
  const cb = new URL(origin).searchParams.get('cb');
  res.end(`${cb}({name: 'Tom', age: 12, city: 'Seattle'})`);
}).listen(8080, 'localhost', function() {
  console.log(this.address());
});
```
2. 本地请求服务端 `JSONP` 脚本：
```html
<script src="http://localhost:8080?cb=myFunc" defer></script>
```
3. 本地设置 `JavaScript` 回调函数：
```js
function myFunc(myObj)  {
    document.getElementById("demo").innerHTML =  myObj.name;
}
```
#### jsonp 封装
jsonp 封装，每个网站的 `callbackKey` 可能不一样，但通常是 `cb`：
```js
function jsonp({ url, params = {}, callbackKey = 'cb' }) {
  if (typeof arguments[0] === 'string') url = arguments[0];
  return new Promise((resolve, reject) => {
    const scriptEle = document.createElement('script');
    params[callbackKey] = 'cb';
    scriptEle.src = `${url}?${Object.keys(params).map(v=>`${v}=${encodeURIComponent(params[v])}`).join('&')}`;
    document.head.appendChild(scriptEle);
    window.cb = data => {
      resolve(data);
      delete window.cb;
      document.head.removeChild(scriptEle);
    };
  });
}
```

## CORS vs JSONP
1. `JSONP` 仅支持 `GET` 请求方法，但 `CORS` 还支持其他类型的 `HTTP` 请求。
2. `CORS` 使开发者能够使用常规 `XMLHttpRequest` 或 `fetch`，它有比 `JSONP` 更好的错误处理。
3. 使用远程网站的 `script` 标签会让远程网站得以注入任何内容至网站里。如果远程的网站有跨站点脚本漏洞，原来的网站也会受到影响。粗略的 `JSONP` 部署很容易受到 `跨站请求伪造（CSRF/XSRF）` 的攻击。因为 `<script>` 标签在浏览器里不遵守同源策略，恶意网页可以要求并获取带有用户个人隐私资料的网站的 `JSON` 资料。当用户正登录带有用户个人隐私资料的网站时，使得该恶意网站得以操作该 `JSON` 资料，可能泄漏用户的密码或是其他敏感资料。
4. `JSONP` 的主要优势在于它能够在支持 `CORS` 之前的旧版浏览器（Opera Mini 和 Internet Explorer 9 及更早版本）上工作。

## 代理服务器
服务器之间通信不会出现跨域的问题，因为同源策略是浏览器的策略。所以我们可以申请一个和页面在同一个源的代理服务器，然后把请求转发到有数据的服务器上，得到数据后代理服务器再返回给浏览器。

![621df0ffdde04c93a97d52351fa87355_tplv-k3u1fbpfcp-zoom-in-crop-mark_3024_0_0_0.awebp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb39a917190e459283fbbe5ba163884d~tplv-k3u1fbpfcp-watermark.image?)

代理适用的场景是：生产环境不发生跨域，但开发环境发生跨域。因此，只需要在开发环境使用代理解决跨域即可，这种代理又称之为开发代理。对于前端开发而言，大部分的跨域问题，都是通过代理解决的。

![cors-proxy.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3158835f2dbf4db196821f4fa52f2d9c~tplv-k3u1fbpfcp-watermark.image?)

### 在 Vue 和 axios 中使用
1. 在 `vue.config.js` 或 `webpack` 的配置文件中，新增以下代码：
```js
module.exports = {
  devServer: {
    host: '127.0.0.1',
    port: 8080,
    open: true, // 启动时自动打开浏览器
    proxy: {
      '/api': { // 代理标识，/api 前缀的 url 使用代理
        target: "http://xxx.xxx.xx.xx:8080", // 后台服务器地址
        changeOrigin: true, // 是否跨域
        pathRewrite: { // 实际 url 中的 '/api' 替换为 ''
          '^/api': ''
        }
      }
    }
  }
}
```
2. 配置 `axios` 的根路径：
```js
axios.defaults.baseURL = '/api';
```

引用资料：
1. [几种常见的跨域解决方法](https://juejin.cn/post/7126875654850609183)
2. [跨域资源共享 (CORS)](https://web.dev/cross-origin-resource-sharing/)