---
date: 23:02 2023/3/23
title: 如何更简单地更改 input type=file 文件选择框的样式
tags:
- CSS
description: Chrome 89 开始支持，目前除了 IE，其他各浏览器都已支持，通过伪元素 ::file-selector-button 匹配 input type="file" 元素上的按钮，定制文件选择框的样式。
---
## 介绍
HTML 原生的 `<input type="file">` 文件选择框元素样式在各个浏览器上面由用户代理默认设置样式，如果在页面上应用了其他颜色或主题时，我们通常也相应的更改这些输入框或按钮的颜色或背景，否则会出现颜色与背景或主题不融入的样式不一致问题。

通常的做法是隐藏文件选择输入框，然后使用 `<label>` 元素模拟文件选择框，点击 `<label>` 元素就会自动触发文件选择输入框的点击选择行为，再通过监听文件选择框的 change 事件还可以将文件信息显示在页面上。HTML 结构示意如下：
```html
<body>
  <label for="fileInput">Choose a file to upload</label>
  <input id="fileInput" onchange="updateFileList(this)" type="file" multiple>
  <ul id="fileList"></ul>
</body>
<script>
  function updateFileList(fileInput) {
    while (fileList.firstChild) fileList.removeChild(fileList.firstChild);
    var curFiles = fileInput.files;
    if (!(curFiles.length === 0)) {
      [].forEach.call(curFiles, function(file) {
        var listItem = document.createElement('li');
        listItem.textContent = 'File name: ' + file.name + '; file size ' + returnFileSize(file.size) + '.';
        fileList.appendChild(listItem);
      });
    }
  }

  function returnFileSize(number) {
    if (number < 1024) {
      return number + 'bytes';
    } else if (number >= 1024 && number < 1048576) {
      return (number / 1024).toFixed(1) + 'KB';
    } else if (number >= 1048576) {
      return (number / 1048576).toFixed(1) + 'MB';
    }
  }
</script>
<style>
  button, label, input {
    display: inline-block;
    padding: .5em 1em;
  }
  input[type=file] {
    display: none;
  }
  label[for=fileInput] {
    background: linear-gradient(to bottom, #eee, #ccc);
  }
</style>
```
<iframe src="https://code.juejin.cn/pen/7171005126797164558"></iframe>

这种方式虽然比较繁琐，但是可以定制更多内容，并且兼容 IE。

## CSS 伪元素 ::file-selector-button
![微信截图_20221128172300.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bb37d02aa5d84e888c289e3bed796d0f~tplv-k3u1fbpfcp-watermark.image?)

Chrome 89 开始支持，目前除了 IE，其他各浏览器都已支持，匹配 `<input type="file">` 元素上的按钮，兼容写法为 ::-webkit-file-upload-button。通过伪元素 ::file-selector-button 定制文件选择框的样式更加简单了：
```html
<body>
  <input type="file" multiple>
</body>
<style>
  /* 后面的提示文字颜色 */
  [type=file] {
    color: red;
    /* font-size: 0; */
  }
  /* 主按钮的样式自定义 */
  ::file-selector-button {
    height: 3rem;
    color: #fff;
    border-radius: .25rem;
    border: 1px solid #2a80eb;
    padding: .75rem 1rem;
    background-color: #2a80eb;
    cursor: pointer;
  }
  ::-ms-browse {
    height: 3rem;
    color: #fff;
    border-radius: .25rem;
    border: 1px solid #2a80eb;
    padding: .75rem 1rem;
    background-color: #2a80eb;
    cursor: pointer;
  }
</style>
```
<iframe src="https://code.juejin.cn/pen/7171009839273869320"></iframe>

IE 浏览器（IE10+）也支持对文件选择框样式自定义，但是使用的是私有的 ::-ms-browse 伪元素。另外，如果希望隐藏按钮后面的“未选择任何文件”的文字，只需对当前 `<input>` 元素设置样式 `font-size: 0` 即可。

## 参考资料
- [CSS ::file-selector-button 伪元素简介](https://www.zhangxinxu.com/wordpress/2022/10/css-file-selector-button/)
- [::file-selector-button](https://developer.mozilla.org/en-US/docs/Web/CSS/::file-selector-button)