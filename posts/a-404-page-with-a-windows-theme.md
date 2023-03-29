---
date: 16:44 2023/3/29
title: 一个  Windows 主题的 404 页面
tags:
- jQuery
description: Browser95-404 是一个 Windows 95 主题的 404 页面。页面显示为 Windows 95 的桌面，可以点击桌面上的图标进行一些交互。
---
## 介绍
Browser95-404 是一个 Windows 95 主题的 404 页面。页面显示为 Windows 95 的桌面，可以点击桌面上的图标进行一些交互，效果如下：

![95.gif](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f999c15bc72d4509b46b93dfadebfe08~tplv-k3u1fbpfcp-watermark.image?)

## 交互
1. 桌面上随机位置有一个 404 错误弹窗，可以自由拖动。
2. 点击 "确定" 或 "X" 关闭按钮会在随机位置产生另一个弹窗。
3. "?" 按钮是一个指向 baidu.com 的假链接，可以用其他网址代替。
4. “我的电脑” 打开一个假的上传对话框（将接受但不处理任何文件）。
5. “回收站” 重新加载当前页面，从而清除和初始化桌面。
6. “打印机” 提供该页面的 PDF 文件，因此您可以与所有朋友分享您的错误窗口。
7. “开始” 是一个指向 baidu.com 的假链接，你可以重定向到你的应用的主页面。
8. “时钟” 显示实际时间。

## Win10
Windows 95 主题太古老了，我把它修改成了 Win10 主题样式。
### 页面结构
```html
<body style="background: #01A3F6; height: 100%; overflow: hidden;">
  <div class="win">
    <div id="desktop">
      <div class="desktopIcon" id="mycomputer" onclick="openDialog()">
        <img src="data:image/x-icon;base64," />
        <div class="iconText">此电脑</div>
      </div>
      <div class="desktopIcon" id="trash" onclick="location.reload()">
        <img src="data:image/x-icon;base64," />
        <div class="iconText">回收站</div>
      </div>
      <div class="desktopIcon" id="print" onclick="window.print()">
        <img src="data:image/x-icon;base64," />
        <div class="iconText">打印机</div>
      </div>
    </div>
    <div id="taskbar">
      <a href="https://juejin.cn" id="start">
      </a>
      <div id="notifications">
        <div id="clock"></div>
        <div class="division"></div>
      </div>
    </div>
  </div>
</body>
```
- 最外层是 `.win` 容器元素。
- `.win` 容器分为 `#desktop` 桌面和 `#taskbar` 任务栏两部分。
- 桌面有 `#mycomputer`、`#trash` 和 `#print` 三个图标。
- 任务栏有 `#start` 开始按钮、`#clock` 时间区域和 `#division` 分隔符。

### JS 代码
1. 页面使用了 jQuery UI 拖拽组件，需要使用 script 标签引入它们： 
```html
<script src="https://unpkg.com/jquery@3.6.4/dist/jquery.min.js"></script>
<script src="https://unpkg.com/jquery-ui@1.13.2/dist/jquery-ui.min.js"></script>
```
2. 初始化时间和鼠标悬停时的提示文本（日期和星期）。
```js
function startTime() {
  const date = new Date();
  $('#clock').text(date.toLocaleTimeString(0, { hour12: false })).attr('title', date.toLocaleString(0, { dateStyle: 'full' }));
  setTimeout(function() { startTime() }, 500);
}
```
3. 创建错误窗口方法，并处理它们的拖拽操作。
```js
let errNum = 404;
let posZ = 0;
function spawnWindow() {
  const posx = (Math.random() * ($(document).width() - 292)).toFixed();
  const posy = (Math.random() * ($(document).height() - 125)).toFixed();
  posZ += 1;
  // 生成新窗口
  $('body').append(`<div class="box draggable" style="top: ${posy}px; left: ${posx}px; z-index: ${posZ}">
    <div class="title" id="header">
      <img src="data:image/png;base64," width="16" height="16" class="title" />
      <p class="title">&nbsp;Error ${errNum}</p>
      <button onclick="spawnWindow()">X</button>
      <a href="https://juejin.cn">
        <button>?</button>
      </a>
    </div>
    <div class="body">
      <img style="float: left;margin-left: 10px;" src="data:image/x-icon;base64,">
      <p style="float: right;margin-top: 5px;"><b>Message</b>: Unable to locate your page.</p>
      <button style="top: 15px; width: 60px;" class="button" onclick="spawnWindow()">OK</button>
    </div>
</div>
`).find('div.draggable').draggable({ scroll: false });
  // 将聚焦窗口置于最前面
  $(".draggable").on('mousedown', function(event) {
    if ($(this).css("z-index") < posZ) {
      posZ += 1;
      $(this).css(`z-index`, posZ);
    }
  });
  errNum += 1;
}
```
4. 绑定 “我的电脑” 图标点击事件，打开虚拟文件选择对话框。
```js
function openDialog() {
  const input = document.createElement('input');
  input.type = 'file';
  input.click();
}
```
5. 将函数绑定到文档的就绪事件（当文档完成加载时）。
```js
$(document).ready(function() {
  startTime();
  spawnWindow();
});
```

## 码上掘金
<iframe src="https://code.juejin.cn/pen/7211159147981570082"></iframe>

## 仓库地址
Browser95-404：https://github.com/Daenges/Browser95-404