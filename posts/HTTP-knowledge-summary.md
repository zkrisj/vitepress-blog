---
date: 17:09 2023/3/24
title: HTTP 知识总结 ｜ 青训营笔记
tags:
- 术语
description: HTTP 标头是用于 HTTP 请求或响应的字段，它传递关于请求或者响应的额外上下文和元数据。
---
## 介绍
HTTP（超文本传输协议，英语：HyperText Transfer Protocol）是一个用于传输超媒体文档（例如 HTML）的应用层协议，是万维网的数据通信的基础。

## 版本
1. 1999年6月公布的 RFC 2616，定义了 HTTP 协议中现今广泛使用的一个版本 HTTP 1.1。
2. 2015年5月以 RFC 7540 正式发布 HTTP/2 标准，取代 HTTP 1.1 成为 HTTP 的实现标准。
3. 2022年6月6日标准化为 RFC9114 的最新版本 HTTP/3，抛弃使用 TCP，通过 UDP 上使用 QUIC 来承载应用层数据。

## 通信过程
1. 使用 TCP 协议，通过网页浏览器、网络爬虫或者其它的工具，客户端（user agent，用户代理程序）发起一个 HTTP 请求到服务器上指定端口（默认端口为80）。
2. 应答的服务器（origin server）上存储着一些资源，比如 HTML 文件和图像，服务器在那个端口监听客户端的请求。在用户代理和源服务器中间可能存在多个“中间层”，比如代理服务器、网关或者隧道（tunnel）。
3. 一旦收到请求，服务器会向客户端返回一个状态，比如"HTTP/1.1 200 OK"，以及返回的内容，如请求的文件、错误消息、或者其它信息。
4. 每次连接只处理一个请求，服务器处理完客户的请求，并收到客户的应答后，即断开连接，采用这种方式可以节省传输时间。HTTP/2 中的连接具有复用性，即每个目标地址建立连接后，可以永久被利用，所以每个来源仅需要一个连接。

## 请求方法
它们都实现了不同的语义，但根据共同的特征由可以分类为：safe（安全）, idempotent（幂等）, 或 cacheable（可缓存）。
- GET 的请求应该只被用于获取数据。
- HEAD 方法请求一个与 GET 请求的响应相同的响应，但没有响应体。
- POST 方法用于将实体提交到指定的资源，通常导致在服务器上的状态变化或副作用。
- PUT 方法用请求有效载荷替换目标资源的所有当前表示。
- DELETE 方法删除指定的资源。
- CONNECT 方法建立一个到由目标资源标识的服务器的隧道。
- OPTIONS 方法用于描述目标资源的通信选项。
- TRACE 方法沿着到目标资源的路径执行一个消息环回测试。
- PATCH 方法用于对资源应用部分修改。

### Safe（安全）
1. 指这是个不会修改服务器的数据的方法，也就是说，这是一个对服务器只读操作的方法。
2. 浏览器调用安全的方法不用考虑会给服务端造成什么危害，这样，服务端就能允许客户端预加载资源。
3. 这些方法是安全的：GET，HEAD 和 OPTIONS。所有安全的方法都是幂等的，但并非所有幂等方法都是安全的，例如，PUT 和 DELETE 都是幂等的，但不是安全的。

### Idempotent（幂等）
1. 指的是同样的请求被执行一次与连续执行多次，客户端接收到的结果都是一样的，服务器的状态也是一样的，也就是说，幂等方法不应该具有副作用（统计用途除外）。
2. 在正确实现的条件下， GET、HEAD、OPTIONS、PUT 和 DELETE 等方法都是幂等的，而 POST 方法不是。所有的 safe 方法也都是幂等的。例如下面调用多次 POST 方法，就会增加多行记录：
```
POST /add_row HTTP/1.1
POST /add_row HTTP/1.1   -> Adds a 2nd row
POST /add_row HTTP/1.1   -> Adds a 3rd row
```
下面即使请求多次 DELETE 方法接收到的状态码不一样，但也是幂等的：
```
DELETE /idX/delete HTTP/1.1   -> Returns 200 if idX exists
DELETE /idX/delete HTTP/1.1   -> Returns 404 as it just got deleted
DELETE /idX/delete HTTP/1.1   -> Returns 404
```

### Cacheable（可缓存）
1. 可以被缓存的 HTTP 响应，将被存储以供以后检索和使用。
2. 请求中使用的方法本身是可缓存的，即一个 GET 或一个 HEAD 方法。如果指示新鲜度并设置了 Content-Location 标头，也可以缓存对 POST 或 PATCH 请求的响应，但这很少实现。其他方法如 PUT 或 DELETE 不可缓存，它们响应的结果也无法缓存。
3. 应用程序缓存可以根据响应的状态代码，认为它是可缓存的。以下状态代码是可缓存的：200、203、204、206、300、301、404、405、410、414 和 501。
4. 如果响应中有特定的标头，如 Cache-Control，可防止缓存。

## HTTP 标头（header）
1. HTTP 标头是用于 HTTP 请求或响应的字段，它传递关于请求或者响应的额外上下文和元数据。
2. 例如，请求消息可以使用标头表明它首选的媒体格式，而响应可以使用标头表明返回主体的媒体格式。
3. 标头是不区分大小写，开始于行首，后面紧跟着一个 ':' 和与之相关的值。字段值在一个换行符（CRLF）前或者整个消息的末尾结束。
4. 根据不同的消息上下文，标头可以分为：
- 请求标头：包含要获取的资源或者客户端自身的更多信息。例如，Accept-* 标头指示响应的允许格式和首选格式。其他标头可用于提供身份验证凭据（Authorization、Token 授权等）、控制缓存或获取有关用户代理（user agent）或引荐来源网址（referrer）等的信息。
- 响应标头：包含有关响应的额外信息，例如响应的位置（Location）、响应时间（Date）、最后更新时间（Last-Modified）或者关于服务器自身的信息（Server，包括名字、版本等）。
- 表示标头：包含消息主体中资源的元数据（例如，编码、MIME 媒体类型、压缩方案等）。包括 Content-Type、Content-Encoding、Content-Language 和 Content-Location。
- 有效负荷标头：包含有关有效载荷数据表示的单独信息，包括内容长度和用于传输的编码。包括 Content-Length、Content-Range、Trailer 和 Transfer-Encoding。
5. 并非所有可以出现在请求中的标头都被规范称为请求标头，并非所有出现在响应中的标头都根据规范将其归类为响应标头。例如，Content-Type 就是一个表示标头，在请求中 (如 POST 或 PUT)，客户端告诉服务器实际发送的数据类型；在响应中，Content-Type 标头告诉客户端实际返回的内容的内容类型。
6. 下图列出了一些与请求和响应相关常见的标头。
![常用请求头.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/417eed5b2d9b432a83441f39c40797b4~tplv-k3u1fbpfcp-watermark.image?)

![常用响应头.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c472eab28699455e967f7cf217fe7091~tplv-k3u1fbpfcp-watermark.image?)

## 响应状态码
![HTTP状态码.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed3cc642ead1420aa63fbf241ee9bbae~tplv-k3u1fbpfcp-watermark.image?)

用来表明特定 HTTP 请求是否成功完成，归为以下五大类：
1. 信息响应 (100–199)
2. 成功响应 (200–299)
3. 重定向消息 (300–399)
4. 客户端错误响应 (400–499)
5. 服务端错误响应 (500–599)

## Cookie
Cookie 是服务器发送到用户浏览器并保存在本地的一小块数据。HTTP 是无状态协议，这意味着服务器不会在两个请求之间保留任何数据（状态），而 Cookie 使基于无状态的 HTTP 协议记录稳定的状态信息成为了可能。浏览器会存储 Cookie 并在下次向同一服务器再发起请求时携带并发送到服务器上。

工作机制如下：

![cookie.webp](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdb25cd7ce384796bbb847d01b61130c~tplv-k3u1fbpfcp-watermark.image?)

服务器使用**Set-Cookie 响应标头**向用户代理（一般是浏览器）发送 Cookie 信息。例如：
```
Set-Cookie: <cookie-name>=<cookie-value>
```
这指示服务器发送标头告知客户端存储一对 Cookie：
```
HTTP/1.0 200 OK
Content-type: text/html
Set-Cookie: yummy_cookie=choco
Set-Cookie: tasty_cookie=strawberry

[页面内容]
```
现在，对该服务器发起的每一次新请求，浏览器都会将之前保存的 Cookie 信息通过**Cookie 请求标头**再发送给服务器。
```
GET /sample_page.html HTTP/1.1
Host: www.example.org
Cookie: yummy_cookie=choco; tasty_cookie=strawberry
```
Secure 属性和 HttpOnly 属性可以确保 Cookie 被安全发送，并且不会被意外的参与者或脚本访问。
1. 标记为 Secure 的 Cookie 只应通过被 HTTPS 协议加密过的请求发送给服务端。它永远不会使用不安全的 HTTP 发送（本地主机除外），这意味着中间人攻击者无法轻松访问它。不安全的站点（http）无法使用 Secure 属性设置 Cookie。但是，Secure 不会阻止对 Cookie 中敏感信息的访问。例如，有权访问客户端硬盘（如果未设置 HttpOnly 属性，则有权访问 JavaScript）的人可以读取和修改它。
2. JavaScript Document.cookie 无法访问带有 HttpOnly 属性的 Cookie,此类 Cookie 仅作用于服务器。例如，持久化服务器端会话的 Cookie 不需要对 JavaScript 可用，而应具有 HttpOnly 属性。此预防措施有助于缓解跨站点脚本（XSS）攻击。

Cookie 主要用于以下三个方面：
- 会话状态管理 - 如用户登录状态、购物车、游戏分数或其它需要记录的信息
- 个性化设置 - 如用户自定义设置、主题和其他设置
- 浏览器行为跟踪 - 如跟踪分析用户行为等

Cookie 曾一度用于客户端数据的存储，因当时并没有其它合适的存储办法而作为唯一的存储手段，但现在推荐使用现代存储 API。新的浏览器 API 已经允许开发者直接将数据存储到本地，如使用 Web storage API（localStorage 和 sessionStorage）或 IndexedDB。

### Cookie vs Session vs Token
由于服务器指定 Cookie 后，浏览器的每次请求都会携带 Cookie 数据，会带来额外的性能开销（尤其是在移动环境下）。

以购物车为例，需要有一个机制记录每个连接的关系，这样我们就知道加入购物车的商品到底属于谁了，每次浏览器请求后 server 都会将本次商品 id 存储在 Cookie 中返回给客户端，客户端会将 Cookie 保存在本地，下一次再将上次保存在本地的 Cookie 传给 server，这样每个 Cookie 都保存着用户信息和商品 id。

![cookie.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/60a7a395926048ecab4b35f38057776a~tplv-k3u1fbpfcp-watermark.image?)

但是，随着购物车内的商品越来越多，每次请求的 cookie 也越来越大，这对每个请求来说是一个很大的负担，我只是想将一个商品加入购买车，为何要将历史的商品记录也一起返回给 server？而且，购物车信息其实已经保存在 server 中了。

#### Session
由于用户的购物车信息都会保存在 Server 中，所以在 Cookie 里只要保存能识别用户身份的信息，知道是谁发起了加入购物车操作即可，这样每次请求后只要在 Cookie 里带上用户的身份信息，请求体里也只要带上本次加入购物车的商品 id，大大减少了 cookie 的体积大小，我们把这种能识别哪个请求由哪个用户发起的机制称为 Session（会话机制），生成的能识别用户身份信息的字符串称为 sessionId。

![session.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1e91adc0894240bf819db78c367466f8~tplv-k3u1fbpfcp-watermark.image?)

1. 首先用户登录，server 会为用户生成一个 session，为其分配唯一的 sessionId，这个 sessionId 是与某个用户绑定的，也就是说根据此 sessionid（假设为 abc） 可以查询到它到底是哪个用户，然后将此 sessionid 通过 cookie 传给浏览器。
2. 之后浏览器的每次添加购物车请求中只要在 cookie 里带上 sessionId=abc 这一个键值对即可，server 根据 sessionId 找到它对应的用户后，把传过来的商品 id 保存到 server 中对应用户的购物车即可。

可以看到通过这种方式再也不需要在 cookie 里传所有的购物车的商品 id 了，大大减轻了请求的负担！另外，cookie 是存储在 client 的，而 session 保存在 server，sessionId 需要借助 cookie 的传递才有意义。

但是，上述情况能正常工作是因为我们假设 server 是单机工作的，实际生产中，为了保障高可用，一般服务器至少需要两台机器，客户端请求后，由负载均衡器（如 Nginx）来决定到底打到哪台机器。

![Nginx.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bee4319c1b68497aa36a1f57a741228d~tplv-k3u1fbpfcp-watermark.image?)

假设登录请求打到了 A 机器，A 机器生成了 session 并在 cookie 里添加 sessionId 返回给了浏览器，那么问题来了：下次添加购物车时如果请求打到了 B 或者 C，由于 session 是在 A 机器生成的，此时的 B,C 是找不到 session 的，那么就会发生无法添加购物车的错误，就得重新登录了。

目前各大公司普遍采用的方案是将 session 保存在 redis，memcached 等中间件中，请求到来时，各个机器去这些中间件取一下 session 即可。就是每个请求都要去 redis 取一下 session，多了一次内部连接，消耗了一点性能，另外为了保证 redis 的高可用，必须做集群，当然了对于大公司来说，redis 集群基本都会部署，所以这方案可以说是大公司的首选了。

![share.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ec73b44de384a4b88c79d8c7ec051b9~tplv-k3u1fbpfcp-watermark.image?)

但是，对于小厂来说可能它的业务量还未达到用 redis 的程度，那有没有其他不用 server 存储 session 的用户身份校验机制呢？

#### Token
![token组成.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/00870117afc6468ab23f06cb88df8aab~tplv-k3u1fbpfcp-watermark.image?)

token（JSON Web Token，JWT）主要由三部分组成：
- header：指定了签名算法。
- payload：可以指定用户 id，过期时间等非敏感数据。
- Signature: 签名，server 根据 header 知道它该用哪种签名算法，再用密钥根据此签名算法对 head + payload 生成签名，这样一个 token 就生成了。

其中，header, payload 是以 base64 的形式存在的。
1. 首先请求方输入自己的用户名，密码，然后 server 据此生成 token，客户端拿到 token 后会保存到本地（服务端没有存储），之后向 server 请求时在请求头带上此 token 即可。
2. 当 server 收到浏览器传过来的 token 时，它会首先取出 token 中的 header + payload，根据密钥生成签名，然后再与 token 中的签名比对，如果成功则说明签名是合法的，即 token 是合法的。
3. 只要 server 保证密钥不泄露，那么生成的 token 就是安全的，因为如果伪造 token 的话在签名验证环节是无法通过的。
4. 鉴权 - session 会根据 sessionId 找到 userid 呢，token 如何知道是哪个用户？
- token 中的 payload 中存有我们的 userId，所以拿到 token 后直接在 payload 中就可获取 userid，避免了像 session 那样要从 redis 去取的开销。

可以看到通过这种方式有效地避免了 token 必须保存在 server 的弊端，实现了分布式存储。
##### 注意
1. token 一旦由 server 生成，它就是有效的，直到过期，无法让 token 失效，除非在 server 为 token 设立一个黑名单，在校验 token 前先过一遍此黑名单，如果在黑名单里则此 token 失效，但一旦这样做的话，那就意味着黑名单就必须保存在 server，这又回到了 session 的模式，那直接用 session 不香吗。所以一般的做法是当客户端登出要让 token 失效时，直接在本地移除 token 即可，下次登录重新生成 token 就好。
2. token 是存在浏览器的，如果放在 cookie 里可能导致 cookie 超限（cookie 一般有大小限制的，如 4kb），那就只好放在 local storage 里，但这样会造成安全隐患，因为 local storage 这类的本地存储是可以被 JS 直接读取的，另外上文也提到，token 一旦生成无法让其失效，必须等到其过期才行，这样的话如果服务端检测到了一个安全威胁，也无法使相关的 token 失效。所以 token 更适合一次性的命令认证，设置一个比较短的有效期。

#### SSO
Cookie 跨站是不能共享的，所以使用 Cookie 实现多应用（多系统）的单点登录（SSO，指在多个应用系统中，用户只需要登录一次就可以访问所有相互信任的应用系统）的话就很困难（要用比较复杂的 trick 来实现）。

发送 token 时一般放在标头的 Authorization 自定义头里，不是放在 Cookie 里的，这主要是因为跨域不能共享 Cookie。如果用 token 来实现 SSO 会非常简单，只要在标头中的 authorize 字段（或其他自定义）加上 token 即可完成所有跨域站点的认证。

![SSO.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9f3fd3d2bf86485f8e2f44f6a5590e66~tplv-k3u1fbpfcp-watermark.image?)

#### 跨站请求伪造（CSRF）
是一种冒充受信任用户，向服务器发送非预期请求的攻击方式。比如用户登录了某银行网站（假设为 `http://www.examplebank.com/`，并且转账地址为 `http://www.examplebank.com/withdraw?amount=1000&transferTo=PayeeName`），登录银行网站后 cookie 里会包含登录用户的 sessionid，攻击者可以在另一个网站上放置如下代码
```html
<img src="http://www.examplebank.com/withdraw?account=Alice&amount=1000&for=Badman">
```
那么如果正常的用户误点了上面这张图片，由于相同域名的请求会自动带上 cookie，而 cookie 里带有正常登录用户的 sessionid 等身份认证的信息，银行网站会认为是真正的用户操作而去运行,上面这样的转账操作在 server 就会成功，会造成极大的安全风险。

![CSRF.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e0d3ed2524414b2bb152f532474e32be~tplv-k3u1fbpfcp-watermark.image?)

CSRF 攻击的根本原因在于对于同样域名的每个请求来说，它的 cookie 都会被自动带上，这个是浏览器的机制决定的，所以很多人据此认定 cookie 不安全。

使用 token 确实避免了 CSRF 的问题，但正如上文所述，由于 token 保存在 local storage，它会被 JS 读取，从存储角度来看也不安全（实际上防护 CSRF 攻击的正确方式是用 CSRF token）。

所以不管是 cookie 还是 token，从存储角度来看其实都不安全，都有暴露的风险，我们所说的安全更多的是强调传输中的安全，可以用 HTTPS 协议来传输， 这样的话请求头都能被加密，也就保证了传输中的安全。

#### 总结
1. 其实我们把 cookie 和 token 比较本身就不合理，一个是存储方式，一个是验证方式，正确的比较应该是 session vs token。
2. session 和 token 本质上是没有区别的，都是对用户身份的认证机制，只是他们实现的校验机制不一样而已（一个保存在 server，通过在 redis 等中间件获取来校验，一个保存在 client，通过签名校验的方式来校验），多数场景上使用 session 会更合理，但如果在单点登录，一次性命令认证上使用 token 会更合适，最好在不同的业务场景中合理选型，才能达到事半功倍的效果。

## RESTful API
REST（表现层状态转换，英语：Representational State Transfer）是一种设计提供万维网络服务的软件构建风格，目的是便于不同软件/程序在网络（例如互联网）中互相传递信息。

![RESTful.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ba0ec5734abf477d876a260d085d4760~tplv-k3u1fbpfcp-watermark.image?)

它基于超文本传输协议（HTTP）之上而确定的一组约束和属性，RESTful 就代表满足 REST 原则的。
1. 每一个 URI 代表一种资源。
2. 客户端和服务器之间，传递这种资源的某种表现层。
3. 客户端通过 HTTP 方法，对服务器资源进行操作，实现“表现层状态转化”。

## 跨源资源共享（CORS）
1. 同源策略是浏览器的一个重要的安全策略（不属于 HTTP），它用于限制一个源（Origin）的文档或者它加载的脚本如何能与另一个源的资源进行交互。它能帮助阻隔恶意文档，减少可能被攻击的媒介。
2. 如果两个 URL 的协议、端口（如果指定）和主机都相同，则两个 URL 是同源。
3. 浏览器某些操作仅限于同源内容，但可以使用 CORS 解除这个限制。
4. CORS 是一种基于 HTTP 标头的机制，通过这些 HTTP 标头决定浏览器是否阻止 JavaScript 代码获取跨源请求的响应。即 CORS 给了 web 服务器这样的权限：服务器可以选择是否允许跨域请求访问到它的资源。
5. 另外几个解决跨域问题的方法：
- 代理服务器 - 通过部署一个与当前域名同源的服务器，请求时发到代理服务器，再由代理服务器转发到真实服务器；然后真实服务器响应给代理服务器，代理服务器再把响应转发到我们的浏览器上。例如 Webpack 的一个插件 devServer 就具备了代理服务器的功能，可以在开发模式下帮助我们进行联调。

![代理服务器.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cbe3bc53c92a421da85a055e0395964e~tplv-k3u1fbpfcp-watermark.image?)

- iframe - 通过把一个 src 与服务器同源的 iframe 元素嵌入到页面中，再通过 window.postMessage 来实现 iframe 元素与当前页面通信。
- JSONP - 嵌入的跨域资源不受同源策略约束。利用这个开放策略，使用 script 标签替代 XMLHttpRequest 对象或 fetch 来请求数据。用 JSONP 抓到的资料并不是 JSON，而是任意的 JavaScript 代码。

![jsonp.webp](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27e97b99c31d4297ac94a4969eaefcd7~tplv-k3u1fbpfcp-watermark.image?)

## HTTPS
![https.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0ff6bf93e39d4b56b1e49da8ba3878f0~tplv-k3u1fbpfcp-watermark.image?)

1. HTTPS（超文本传输安全协议，英语：HyperText Transfer Protocol Secure）是 HTTP 协议的加密版本。
2. 它使用 SSL 或 TLS 协议来加密客户端和服务器之间所有的通信。
3. 安全连接允许客户端与服务器安全地交换敏感数据，例如网上银行或者在线商城等涉及金钱的操作。
4. 对称加密
- 加密方和解密使用同一密钥
- 加密解密的速度比较快
- 常见有：Blowfish、IDEA、RC5、RC6、DES、3DES、AES。
5. 非对称加密
- 使用两把密钥进行加密和解密，即公钥（public key）和私钥（private key）
- 公钥加密私钥解密，私钥加密公钥可以解密
- 加密或者解密，速度非常慢
- 私钥和公钥是成对出现的
- 常见有：RSA、DSA、Elgamal、背包算法、Rabin、D-H、ECC。
6. HTTPS 同时使用了对称加密（性能）和非对称加密（安全），并使用 CA 机构颁发的数字证书解决公钥传输问题。

![HTTPS证书验证.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/003314f64b8e4f53bcab48dbe986c01d~tplv-k3u1fbpfcp-watermark.image?)

### 如何使用 HTTPS
![使用HTTPS.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6b2d4817e79047c4b5042adbbd88628e~tplv-k3u1fbpfcp-watermark.image?)

以访问 `www.helloworld.net` 网站为例，分为 3 个阶段：
1. 网站申请证书阶段：
    1. 网站向 CA 机构申请数字证书（需要提交一些材料，比如域名）。
    2. CA 向证书中写入摘要算法，域名，网站的公钥等重要信息。
    3. CA 根据证书中写入的摘要算法，计算出证书的摘要。
    4. CA 用自己的私钥对摘要进行加密，计算出签名。
    5. CA 生成一张数字证书，颁发给了 `www.helloworld.net`。
    6. 网站的管理员，把证书放在自己的服务器上。

2. 浏览器验证证书阶段：
    1. 浏览器在地址栏中输入 `https://www.helloworld.net` 并回车。
    2. 服务器将数字证书发送给浏览器。
    3. 浏览器用操作系统内置的 CA 的数字证书，拿到 CA 的公钥。
    4. 浏览器用 CA 公钥对 `www.helloworld.net` 的数字证书进行验签。
    5. 具体就是，浏览器用 CA 公钥，对 helloworld 的数字证书中的签名进行解密，得到摘要 D1。
    6. 浏览器根据 helloworld 数字证书中的摘要算法，计算出证书的摘要 D2。
    7. 对比 D1 和 D2 是否相等。
    8. 如果不相等，说明证书被掉包了。
    9. 如果相等，说明证书验证通过了。

3. 协商对称加密密钥阶段：
    1. 浏览器验证数字证书通过以后。
    2. 浏览器拿到数字证书中的公钥，也就是 `www.helloworld.net` 网站的公钥。
    3. 浏览器有了网站的公钥后，就用公钥进行对**密钥S**进行加密，加密以后的密文发送给服务器。
    4. 服务器收到密文后，用自己的私钥进行解密，得到**密钥S**。
    5. 此后浏览器，服务器双方就用**密钥S**进行对称加密的通信了。
