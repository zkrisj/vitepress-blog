---
date: 23:12 2023/3/23
title: 不使用 input file 元素，JS 如何操作文件
tags:
- JS
description: 从 Chrome 86 开始，在浏览器中 File System Access API 提供了 JS 操作文件的能力，目前只有基于 Chromium 系列的浏览器全面支持，Safari 部分支持，而 Firefox 未支持。该 API 允许读取文件、写入或保存文件以及访问目录结构，包括本地文件系统和网络文件系统。
---
## 介绍
NodeJS 之前，JS 操作文件只能通过 HTML `<input type="file">` 元素或 XMLHttpRequest（或之后的 fetch），来对本地文件进行一些浏览和上传操作。NodeJS 给予了 JS 操作系统底层 API 的能力，但这只能局限在 NodeJS 项目中。

![微信截图_20221127210410.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b440a3ae50bf45848683501dbaa87889~tplv-k3u1fbpfcp-watermark.image?)

从 Chrome 86 开始，在浏览器中 File System Access API 提供了 JS 操作文件的能力，目前只有基于 Chromium 系列的浏览器全面支持，Safari 部分支持，而 Firefox 未支持。该 API 允许**读取文件、写入或保存文件以及访问目录结构**，包括本地文件系统和网络文件系统。

## 接口
大多数与文件和目录的交互都是通过句柄（FileSystemHandle 的子类）完成的。FileSystemHandle 有两个子类：FileSystemFileHandle 和 FileSystemDirectoryHandle，分别用于文件和目录。

获取句柄的方法通常是 window.showOpenFilePicker 和 window.showDirectoryPicker（另外，DataTransferItem.getAsFileSystemHandle() 也可以获取文件系统访问句柄），并且这些方法都是异步的，返回值为 Promise。这些方法被调用后，文件选择器就会弹出，用户可以选择一个或多个文件或目录来获取句柄。

### showOpenFilePicker(options)
用来显示一个文件选择器，用户选择一个或多个文件后返回包含所选择文件的句柄数组的 Promise。

参数 options 可选，支持以下属性：
- multiple  
默认为 false，设置为 true 时，可以选择多个文件。
- excludeAcceptAllOption  
默认为 false，是否排除 types 中的 accept 文件类型列表。
- types  
可选择的文件类型数组，每个数组项也是个对象，支持下面两个参数：
    - description  
    文件或者文件夹的描述，字符串，可选。
    - accept  
    一个对象，表示接受的文件类型，对象的键是文件的 MIME 类型，值表示支持的文件后缀的数组。

### showDirectoryPicker(options)
用来显示一个目录选择器，用户选择一个目录后返回包含所选择的目录的句柄的 Promise。

参数 options 可选，支持下以下属性：
- id  
通过指定 id，可以用来区分不同的目录，相同 id 将打开同一目录。
- mode  
读写模式，默认为 read，可以设置为 readwrite。
- startIn  
起始目录，例如 "desktop"（桌面）, "documents"（文档）, "downloads"（下载）, "music"（音乐）, "pictures"（图片）, "videos"（视频）。

## 使用
以前我们想要更改 input type=file 文件选择框的样式，要么隐藏文件选择输入框，然后使用 `<label>` 元素模拟文件选择框，或者使用 CSS 伪元素 ::file-selector-button。现在有了 File System Access API，我们可以直接在页面中任意元素上来触发文件操作。
```html
<body>
  <button id="selectFile">选择文件</button>
  <button id="selectDirectory">选择目录</button>
</body>
<script>
  selectFile.addEventListener('click', async function() {
    const arrFileHandle = await window.showOpenFilePicker({
      types: [{
        accept: {
          'image/*': ['.png', '.gif', '.jpeg', '.jpg', '.webp']
        }
      }],
      multiple: true
    });
    for (const fileHandle of arrFileHandle) {
      const fileData = await fileHandle.getFile();
      document.body.insertAdjacentHTML('beforeend', `<img src="${URL.createObjectURL(fileData)}">`);
    }
  });
  selectDirectory.addEventListener('click', async function() {
    const dirHandle = await window.showDirectoryPicker({
      startIn: 'pictures'
    });
    const values = dirHandle.values();
    const files = [];
    let next;
    async function getFile() {
      next = await values.next();
      const { value } = next;
      if (value) {
        if (value.kind === 'file') files.push(await value.getFile());
        else console.log('是目录', value.name);
      }
    }
    await getFile();
    while (!next.done) await getFile();
    files.forEach(file => {
      /^image\/.+/.test(file.type) && document.body.insertAdjacentHTML('beforeend', `<img src="${URL.createObjectURL(file)}">`);
    });
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
  img {
    max-width: 100%;
  }
</style>
```

## 注意事项
1. 需要 https 协议，如果是本地 localhost 不受此限制。
2. 不能在 iframe 内使用，会报 SecurityError。所以很遗憾，马上掘金上面不能体验了。
```
Uncaught (in promise) {"name":"SecurityError","message":"Failed to execute 'showOpenFilePicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.","stack":"Error: Failed to execute 'showOpenFilePicker' on 'Window': Cross origin sub frames aren't allowed to show a file picker.\n at HTMLButtonElement. (:3:38)"}
```

关于 File System Access API 的写入和保存文件的能力，后续补充。