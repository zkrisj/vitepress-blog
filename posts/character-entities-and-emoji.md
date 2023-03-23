---
date: 12:42 2023/3/23
title: HTML 字符实体和 Emoji 的使用
tags:
- HTML
description: 表情符号（Emoji）是来自 UTF-8 字符集（HTML5 中的默认字符集）的字符，2010年10月发布的 Unicode 6.0 版首次收录表情符号编码（分配码点，可通过 HTML 实体书写）。
---
## HTML 实体
HTML 实体是一段以连字号（& 或 &#）开头、以分号（;）结尾的文本（字符串）。例如 A、B、C 的实体编号分别为 `&#65;`、`&#66;` 和 `&#67;`。

HTML 中的预留字符必须被替换为字符实体。例如，如需显示小于号和大于号，我们需要写实体名称：`&lt;` 和 `&gt;`，或实体编号：`&#60;` 和 `&#62;`。

HTML 对多个空格会折叠成一个空格，如果需要显示多个空格，需要写多个 `&nbsp;` 实体名称（多个空格的实体编号 `&#32;` 也会折叠成一个空格）。

使用实体名称而不是编号的好处是，名称易于记忆。不过坏处是，浏览器也许不支持所有实体名称（对实体编号的支持却很好）。

对于没有 HTML 实体名称的字符，可以使用十进制（dec）或十六进制（hex）引用。例如 ♥ 具有实体名称 `&hearts;`、十进制实体编号 `&#9829;` 和十六进制实体编号 `&#x2665;`，而 ♡ 没有实体名称，可以使用十进制实体编号 `&#9825;` 和十六进制实体编号 `&#x2661;` 来引用。

## Emoji
![bg2017041302-1.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27fbad334aea4e8497b53403283270b3~tplv-k3u1fbpfcp-watermark.image?)

---
表情符号（Emoji）是来自 UTF-8 字符集（HTML5 中的默认字符集）的字符，2010年10月发布的 Unicode 6.0 版首次收录表情符号编码（分配码点，可通过 HTML 实体书写）。它们可以像 HTML 中的其他任何字符一样复制、显示和调整它们的大小，也就是说，现在的 Emoji 符号就是一个文字，它会被渲染为图形。

Unicode 只是规定了 Emoji 的码点和含义，并没有规定它的样式。例如，码点 U+1F600 表示一张微笑的脸，但是这张脸长什么样，则由各个系统自己实现。如果用户的系统没有实现这个 Emoji 符号，用户就会看到一个没有内容的方框，因为系统无法渲染这个码点。IOS、安卓、Twitter、Github、Facebook 都有自己的 Emoji 实现。

![bg2017041305.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8c139fdb2b845d9868485da9969847a~tplv-k3u1fbpfcp-watermark.image?)

### Emoji 组合
Unicode 除了使用单个码点表示 Emoji，还允许多个码点组合表示一个 Emoji。

其中的一种方式是"零宽度连接符"（ZERO WIDTH JOINER，缩写 ZWJ）`U+200D`。举例来说，下面是三个 Emoji 的码点。
> - U+1F468：男人
> - U+1F469：女人
> - U+1F467：女孩

上面三个码点使用 `U+200D` 连接起来，`U+1F468 U+200D U+1F469 U+200D U+1F467`，就会显示为一个 Emoji 👨‍👩‍👧，表示他们组成的家庭。如果用户的系统不支持这种方法，就还是显示为三个独立的 Emoji 👨👩👧。

### 使用方式
Emoji 虽然是文字，但是无法书写，必须使用其他方法来插入文档中。
1. 最简单的方法当然是复制/粘贴，你可以到 [getEmoji.com](https://getemoji.com/) 选中一个 Emoji 贴在自己的文档即可。
2. 另一种方法是通过码点输入 Emoji。以 HTML 网页为例，将码点 U+1F600 写成 HTML 实体的形式 `&#128512;`（十进制）或 `&#x1F600;`（十六进制），就可以插入网页。码点可以到 [emojipedia.org](https://emojipedia.org/) 查询。
3. JavaScript 输入 Emoji，可以使用 [node-emoji](https://www.npmjs.com/package/node-emoji) 这个库。
```js
const emoji = require('node-emoji');
// 返回 coffee 的 Emoji，☕️
emoji.get('coffee'); 
// 返回 github 风格的 markdown 表情符号对应的 Emoji，❤️
emoji.get(':heart:');
// 将文字替换成 Emoji，返回 "I ❤️ ☕️!" 
emoji.emojify('I :heart: :coffee:!');
// 随机返回一个 Emoji 
emoji.random();
// 查询 Emoji 返回一个数组，`[{ emoji: '☕️', key: 'coffee' }, { emoji: ⚰', key: 'coffin'}]`
emoji.search('cof');
```
4. 通过 CSS 插入 Emoji。
```html
<link href="https://afeld.github.io/emoji-css/emoji.css" rel="stylesheet">
<i class="em em-baby"></i>
```
