---
date: 23:37 2023/3/22
title: ⚓ URI 的编码和解码
tags:
- JS
description: 一般来说，URL 只能使用英文字母、阿拉伯数字和某些标点符号，不能使用其他文字和符号。这意味着，如果 URL 中有汉字，就必须编码后使用。
---
## URI
URI（统一资源标识符）是一个用于标志某一互联网资源名称的字符串。

### 与 URL 和 URN 的关系
![URI_Euler_Diagram_no_lone_URIs.svg.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ab37c4df17554db89644d988d4d6361a~tplv-k3u1fbpfcp-watermark.image?)

---
URL（统一资源定位符）和 URN（统一资源名称）属于 URI 的子集，URI 可以为 URL、URN 两者之一或同时是 URI 和 URN。URN 描述资源的名称，URL 描述资源的地址，而 URI 描述资源的 id。URI 可以是一个资源的 URL（地址）、或 URN（名称）。

例如，`ISBN 0-486-27557-4` 标志出了一个 ISBN 系统中的图书《罗密欧与朱丽叶》的某一特定版本。为获得该资源并阅读该书，需要它的位置，也就是一个 URL 地址，例如 `file:///home/username/RomeoAndJuliet.pdf`，该 URL 标志出了存储于本地硬盘中的电子书文件。因此，URL 和 URN 有着互补的关系。

## 编码和解码
一般来说，URL 只能使用英文字母、阿拉伯数字和某些标点符号，不能使用其他文字和符号。这意味着，如果 URL 中有汉字，就必须编码后使用。

### escape() 已废弃
将字符串（除了 ASCII 字符集（字母、数字、标点符号和 `@*_+-./`））转义成十六进制形式（Unicode 编码值）并返回。当值小于等于 `0xFF` 时，用一个 2 位转义序列: `%xx` 表示。大于 `0xFF` 则使用 4 位序列：`%uxxxx` 表示。
```js
escape("abc123");     // "abc123"
escape("äöü");        // "%E4%F6%FC"
escape("ć");          // "%u0107" 表示在Unicode字符集中ć是第107个字符
escape(" ");          // "%20"


// 特殊字符除外
escape("@*_+-./");    // "@*_+-./"
```

> 注意，escape() 不对 `+` 号编码，而网页在提交表单的时候，如果有空格，则会被转化为 `+` 号。服务器处理数据的时候，也会把 `+` 号处理成空格。所以，使用的时候要小心。

### unescape() 已废弃
将十六进制形式字符串（除了 ASCII 字符集（字母、数字、标点符号和 `@*_+-./`）的的十六进制形式）解码并返回。
```js
unescape('abc123');     // "abc123"
unescape('%E4%F6%FC');  // "äöü"
unescape('%u0107');     // "ć"
unescape('%u4F60%u597D');// 你好
unescape('\u4F60\u597D');// 你好
```

### encodeURI()
将字符串（除了 `A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #`）转义成 utf-8 形式，并且在每个字节前加上 `%`。

```js
encodeURI("my test.asp?name=ståle&msg=你好"); // my%20test.asp?name=st%C3%A5le&msg=%E4%BD%A0%E5%A5%BD
encodeURI("A-Za-z0-9;,/?:@&=+$-_.!~*'()#"); // A-Za-z0-9;,/?:@&=+$-_.!~*'()#
```

### decodeURI()
解码 utf-8 形式的字符串（除了 `A-Z a-z 0-9 ; , / ? : @ & = + $ - _ . ! ~ * ' ( ) #` 的十六进制形式）并返回。

```js
decodeURI('my%20test.asp?name=st%C3%A5le&msg=%E4%BD%A0%E5%A5%BD'); // my test.asp?name=ståle&msg=你好
decodeURI('%C2%A9'); // ©
decodeURI('\u00a9'); // ©
```

### encodeURIComponent()
将字符串（除了 `A-Z a-z 0-9 - _ . ! ~ * ' ( )`）转义成 utf-8 形式，并且在每个字节前加上 `%`。与 encodeURI() 的区别是，它用于对 URL 的组成部分进行个别编码，而不用于对整个 URL 进行编码。，比 encodeURI() 多转义了 `; , / ? : @ & = + $ #` 11 种字符。

```js
encodeURIComponent("https://w3schools.com/my test.asp?name=ståle&msg=你好"); // https%3A%2F%2Fw3schools.com%2Fmy%20test.asp?name=st%C3%A5le&msg=%E4%BD%A0%E5%A5%BD
encodeURIComponent("A-Za-z0-9-_.!~*'()"); // A-Za-z0-9-_.!~*'()
```

> 注意，如果对 URL 路径前的字符进行转义，URL 将不能访问。

### decodeURIComponent()
解码 utf-8 形式的字符串（除了 `A-Z a-z 0-9 - _ . ! ~ * ' ( )` 的十六进制形式）并返回。

```js
decodeURIComponent('https%3A%2F%2Fw3schools.com%2Fmy%20test.asp?name=st%C3%A5le&msg=%E4%BD%A0%E5%A5%BD'); // https://w3schools.com/my test.asp?name=ståle&msg=你好
decodeURIComponent('%40'); // @
```