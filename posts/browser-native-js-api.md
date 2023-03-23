---
date: 20:02 2023/3/23
title: 几个新的高效浏览器原生 JS API
tags:
- JS
description: 有些功能，我们使用浏览器自带的 API，而不必依赖第三方库，或使用复杂的代码就可以实现。
---
## 介绍
随着浏览器的更新，有些功能，我们使用浏览器自带的 API，而不必依赖第三方库，或使用复杂的代码就可以实现。

## 复制内容到剪贴板
document.execCommand 只能复制选中状态的文本（getSelection()），而 Clipboard API 提供了完整的响应剪贴板命令（剪切、复制和粘贴）与异步读写系统剪贴板的能力。但当前 document 需要处于焦点状态，例如在控制台使用会报错。
```js
const copyToClipboard = async text => await navigator.clipboard.writeText(text);
```

## 数字转中文
将阿拉伯数字转成中文数字。
```js
const fmt = new Intl.NumberFormat('zh-Hans-CN-u-nu-hanidec'); // 大批量处理数字时可以重复使用
const toCnNumber = number => fmt.format(number);
toCnNumber(123); // 一二三
```

## 金额转中文
将阿拉伯数字转成中文金额。
```js
const toCnCurrency = number => new Intl.NumberFormat('zh-CN', { notation: 'compact',style: 'currency', currency: 'CNY' }).format(number);
toCnCurrency(123456789); // ¥1.2亿
```

## 公历转农历
将日期转为农历日期。
```js
const toCnDate = date => date.toLocaleString('zh-u-ca-chinese', { dateStyle: 'full' }) + ' ' + date.toLocaleTimeString(0, { hour12: false });
toCnDate(new Date); // 2022壬寅年九月廿九星期一 21:45:11
```

## 生成随机 uuid
在 chrome 92 开始可用，使用加密安全随机数生成器生成 v4 版本 UUID（用连字符分隔的 5 个十六进制的长度 36 位的字符串）。
```js
const uuid = () => crypto.randomUUID();
uuid(); // 6eae9ae-0ca0-4a78-94c8-0cd2dae671e2
```

## URL 参数解析
解析一个 URL 并返回解析的参数键值对象。
```js
const parseURL = url => Object.fromEntries([...new URL(url).searchParams]);
```

## 深克隆
structuredClone 在 chrome 98 开始可用，深克隆一个可序列化对象（DOM 节点、函数对象都是不可序列化对象），支持克隆递归引用。
```js
const o1 = { a: { b: 1 }, c: 1 };
o1.myself = o1;
const o2 = window.structuredClone(o1);
o1.a.b = 2;
o1.c = 2;
console.log(o2.a.b, o2.c , o2.myself === o2, o1.a === o2.a); // 1 1 true false
```

## 匹配媒体查询
检测是否匹配当前媒体查询。返回的 MediaQueryList 对象在一个 document 上维持着一系列的媒体查询，并可以使用 change 事件监听媒体查询在其 document 上发生的变化。
```js
const isMatch = media =>  window.matchMedia && window.matchMedia(`(${media})`).matches;
isMatch('max-width: 600px');
isMatch('prefers-color-scheme: dark');
```

## 朗读文本
```js
const speechSynthesis = message => {
  const msg = new SpeechSynthesisUtterance(message);
  msg.voice = window.speechSynthesis.getVoices()[0];
  window.speechSynthesis.speak(msg);
};
speechSynthesis('Hello, World');
```

## 管理 cookie
cookieStore 在 chrome 87 开始可用（目前只有 chrome 和 edge 支持），是一个用于管理 cookie 的 API。
```js
await cookieStore.set('cookie1', 'cookie1-value');
const day = 24 * 60 * 60 * 1000;
await cookieStore.set({
  name: 'cookie2',
  value: 'cookie2-value',
  expires: Date.now() + day,
  domain: '127.0.0.1'
});
const cookie = await cookieStore.get('cookie2');
const allCookies = await cookieStore.getAll();
await cookieStore.delete('cookie1');
```
![CookieStore.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5c23d45a26f349dc8d525be54d6f0daa~tplv-k3u1fbpfcp-watermark.image?)