---
date: 23:16 2023/3/23
title: Web 应用程序的文件系统写入能力
tags:
- JS
description: File System Access API 允许直接读取、写入或保存对用户设备上的文件和文件夹的更改。此 API 使开发人员能够构建功能强大的 Web 应用程序，例如 IDE、文本编辑器、图片编辑器和视频编辑器等等。
---
## 介绍
NodeJS 之前，JS 操作文件只能通过 HTML `<input type="file">` 元素或 XMLHttpRequest（或之后的 fetch），来对本地文件进行一些浏览和上传操作。NodeJS 给予了 JS 操作系统底层 API 的能力，但这只能局限在 NodeJS 项目中。

File System Access API 允许直接读取、写入或保存对用户设备上的文件和文件夹的更改。此 API 使开发人员能够构建功能强大的 Web 应用程序，例如 IDE、文本编辑器、图片编辑器和视频编辑器等等。

![微信截图_20221127210410.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b440a3ae50bf45848683501dbaa87889~tplv-k3u1fbpfcp-watermark.image?)

从 Chrome 86 开始支持 File System Access API，目前只有基于 Chromium 系列的浏览器全面支持，Safari 部分支持（支持读取，不支持写入和保存），而 Firefox 未支持。

下面我们从制作一个网页文本编辑器，来演示文件系统访问 API。

## 读取文件
大多数与文件和目录的交互都是通过句柄（FileSystemHandle 的子类）完成的。获取句柄的方法通常是 window.showOpenFilePicker 和 window.showDirectoryPicker，调用必须在[安全上下文](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts)中完成，并且必须从用户手势（事件触发）中调用。
```js
let fileHandle;
butOpenFile.addEventListener('click', async () => {
  [fileHandle] = await window.showOpenFilePicker();
});
```
保留对文件句柄的引用很有帮助，以便以后可以使用。例如，需要它来保存对文件的更改，或执行任何其他文件操作。

获取了文件的句柄，您可以获取文件的属性，或访问文件本身。调用 handle.getFile() 将返回一个 File 对象，然后我们可以通过 slice(), stream(), text(), 或 arrayBuffer() 等方法对其处理。
```js
const file = await fileHandle.getFile();
const contents = await file.text();
```
> 注意：FileSystemFileHandle.getFile() 返回的 File 对象只有在磁盘上的文件未更改时才可读。如果磁盘上的文件被修改，File 对象将变得不可读，您将需要再次调用 getFile() 以获取新的 File 对象来读取更改后的数据。

下面当点击按钮时，浏览器会显示一个文件选择器。一旦他们选择了一个文件，应用程序就会读取内容并将它们放入一个 `<textarea>` 内显示。
```js
let fileHandle;
butOpenFile.addEventListener('click', async () => {
  [fileHandle] = await window.showOpenFilePicker();
  const file = await fileHandle.getFile();
  const contents = await file.text();
  textArea.value = contents;
});
```

## 写入文件
将数据写入磁盘需要使用一个 FileSystemWritableFileStream 对象，通过文件句柄对象调用 fileHandle.createWritable() 来创建该可写流。
### FileSystemWritableFileStream.write(data)
![微信截图_20221201202900.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c30717a02afa4339978a8c278cdf3ebf~tplv-k3u1fbpfcp-watermark.image?)

在当前文件光标偏移处将内容写入调用该方法的文件中。

参数 data 可以为以下类型：ArrayBuffer、TypedArray、DataView、Blob、String 类型或包含以下属性的对象：
- type  
为以下之一的字符串："write"、"seek" 或 "truncate"。
- data  
要写入的文件数据，可以为以下类型：ArrayBuffer、TypedArray、DataView、Blob。如果 type 设置为 "write"，则此属性是必需的。
- position  
如果 type 设置为 "seek"，表示当前文件光标应移动到的字节位置。如果 type 设置为 "write"，表示开始写入的位置。
- size  
一个无符号 long 类型，表示流应包含的字节数。如果 type 设置为 "truncate"，则此属性是必需的。

该方法返回一个包含 undefined 的 Promise。
```js
// 只传入数据
writableStream.write(data);
// 从确定的位置将数据写入流
writableStream.write({ type: "write", position, data });
// 将当前文件光标偏移量更新到指定位置
writableStream.write({ type: "seek", position });
// 将文件大小调整为 size 字节长
writableStream.write({ type: "truncate", size });
```
要注意的是，在流关闭之后，才会将更改写入磁盘上的实际文件。
```js
async function writeFile(fileHandle, contents) {
  const writable = await fileHandle.createWritable();
  await writable.write(contents);
  await writable.close();
}
```
另外，还可以将流直接通过管道传递给写入流，下面 pipeTo() 方法调用后，默认关闭目标管道，无需再关闭写入流。
```js
async function writeURLToFile(fileHandle, url) {
  const writable = await fileHandle.createWritable();
  const response = await fetch(url);
  await response.body.pipeTo(writable);
}
```

### showSaveFilePicker(options)
![微信截图_20221201202940.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fc8cae6752be496494199a77fe8a9d13~tplv-k3u1fbpfcp-watermark.image?)

显示一个允许用户保存文件的文件选择器。返回处理后的包含 FileSystemFileHandle 对象的 Promise。

参数 options 可选，支持以下属性：
- id  
通过指定一个 id，浏览器可以记住上次使用的目录。
- startIn  
起始目录，例如 "desktop"（桌面）, "documents"（文档）, "downloads"（下载）, "music"（音乐）, "pictures"（图片）, "videos"（视频）。还可以将现有文件或目录句柄传递到此参数。
- suggestedName  
文件名。
- excludeAcceptAllOption  
默认为 false，是否排除 types 中的 accept 文件类型列表。
- types  
可选择的文件类型数组，每个数组项也是个对象，支持下面两个参数：
    - description  
    文件或者文件夹的描述，字符串，可选。
    - accept  
    一个对象，键为 MIME 类型，值为保存的扩展名数组。

如果需要保存为一个 .txt 扩展名的文本文件：
```js
async function getNewFileHandle() {
  const opts = {
    types: [{
      description: 'Text file',
      accept: {'text/plain': ['.txt']},
    }],
  };
  return await window.showSaveFilePicker(opts);
}
```
一般在文本编辑器中，有两种保存文件的方法：保存和另存为。保存只是使用先前检索到的文件句柄将更改写回原始文件。但是另存为会创建一个新文件，因此需要一个新的文件句柄。

## 注意事项
1. 需要 https 协议，如果是本地 localhost 不受此限制。
2. 不能在 iframe 内使用，会报 SecurityError。所以很遗憾，马上掘金上面不能体验了。
```
Uncaught (in promise) {"name":"SecurityError","message":"Failed to execute 'showSaveFilePicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.","stack":"Error: Failed to execute 'showSaveFilePicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.\n at HTMLButtonElement. (:17:37)"}
```

## 使用
下面定义两个按钮，分别写入文本和图片并保存。文本和图片 URL 可以根据需求自定义。
```html
<body>
  <button id="saveText">保存文本文件</button>
  <button id="saveImg">保存图片</button>
</body>
<script>
  async function writeFile(fileHandle, contents) {
    const writable = await fileHandle.createWritable();
    await writable.write(contents);
    await writable.close();
  }
  async function writeURLToFile(fileHandle, url) {
    const writable = await fileHandle.createWritable();
    const response = await fetch(url);
    await response.body.pipeTo(writable);
  }
  saveText.addEventListener('click', async function() {
    const opts = {
      startIn: 'downloads',
      types: [{
        description: 'Text file',
        accept: { 'text/plain': ['.txt'] },
      }],
      suggestedName: 'Untitled',
      id: 0,
    };
    await writeFile(await window.showSaveFilePicker(opts), '你好！');
  });
  saveImg.addEventListener('click', async function() {
    const opts = {
      startIn: 'downloads',
      types: [{
        description: 'Image file',
        accept: { 'image/jpg': ['.jpg'] },
      }],
      suggestedName: 'Untitled',
      id: 0,
    };
    await writeURLToFile(await window.showSaveFilePicker(opts),
      'https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/211a1a5980f94f0095a46017e9bc9755~tplv-k3u1fbpfcp-watermark.image?');
  });
</script>
<style>
  button {
    border: 0;
    border-radius: .5em;
    padding: 1em;
    background: coral;
    color: white;
  }
</style>
```