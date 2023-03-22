---
date: 23:32 2023/3/22
title: 使用 Manifest V3 做一个简单 Chrome 页面右键菜单搜索扩展
tags:
- JS
description: 如果做一些简单的功能，油猴脚本就可以做到；要做一些复杂的带有界面的功能，就需要 Chrome 扩展来做了。
---
## 介绍
如果做一些简单的功能，油猴脚本就可以做到；要做一些复杂的带有界面的功能，就需要 Chrome 扩展来做了。

Chrome 扩展是基于 HTML、JavaScript 和 CSS 等 Web 技术构建的，在单独的沙盒执行环境中运行，并与 Chrome 浏览器交互。

Chrome 浏览器可以自定义地址栏搜索引擎，但是切换比较麻烦，如果有一个方便切换搜索引擎的扩展，就很方便我们搜索我们想要的东西了。下面介绍一下，如何做一个 Chrome 右键菜单搜索扩展。

因为 manifest_version2 会提示过时，所以本例使用的是 manifest_version3 来创建扩展程序。

## 创建清单
每个扩展都要有一个名为 `manifest.json` 的 JSON 格式的清单文件，第一步要创建这个文件。

```json
{
  "name": "搜索",
  "description": "百度 必应 360 搜狗 谷歌",
  "version": "1.0",
  "manifest_version": 3,
  "icons": {
    "16": "img/icon.png",
    "48": "img/icon.png",
    "128": "img/icon.png"
  },
  "action": {
    "default_icon": "img/icon.png",
    "default_title": "搜索",
    "default_popup": "index.html"
  },
  "background": {
    "service_worker": "background.js"
  },
  "permissions": [
    "notifications",
    "contextMenus"
  ],
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content-script.js"],
    "run_at": "document_idle"
  }]
}
```
1. manifest_version、name、version 字段是必须的。
2. action 定义扩展的图标、标题和用户界面。
3. manifest_version2 的 background.scripts 要替换为 manifest_version3 的 background.service_worker。
4. 与 DOM 互动要使用 content_scripts 里面的 js 字段配置。matches 字段可使用通配符设置，例如 `*://*.juejin.cn/*`。
5. permissions 字段定义要使用的权限。这里使用了两个：通知和弹出菜单。

> manifest_version3 不支持多个后台脚本，但可以将 service_worker 声明为 ES 模块来引入多个文件：
```json
// Manifest V2
{
  ...
  "background": {
    "scripts": [
      "backgroundContextMenus.js",
      "backgroundOauth.js"
    ],
    "persistent": false
  },
  ...
}
// Manifest V3
{
  ...
  "background": {
    "service_worker": "background.js",
    "type": "module" //optional
  }
  ...
}
```

## 交互逻辑
`manifest.json` 清单文件里面定义的文件都要保证不能缺少。不然会报错无法使用。

### background.js
这个是 service_worker，用来与浏览器互动，并与 content_scripts 通信。下面定义了两个事件监听，一个点击弹出菜单项的事件，一个点击扩展图标的事件。

```js
const sendData = (data) => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }).then(tabs => {
    chrome.tabs.sendMessage(tabs[0].id, data)
  });
};
// 点击弹出菜单
chrome.contextMenus.onClicked.addListener(function(item, tab) {
  if (!tab.url.startsWith('chrome://')) sendData(item);
});
// 点击扩展图标
chrome.runtime.onMessage.addListener(function(data, sender, sendResponse) {
  sendData(data);
});
```

### content-script.js
这个文件是与 background.js 通信，根据收到的数据，可对页面 DOM 进行操作。

```js
chrome.runtime.onMessage.addListener((data, sender, sendResponse) => {
  if (data.menuItemId) {
    switch (data.menuItemId) {
      case 'bing':
        url = 'https://cn.bing.com/search?q=';
        break;
      case '360':
        url = 'https://www.so.com/s?q=';
        break;
      case 'sogou':
        url = 'https://sogou.com/web?query=';
        break;
      case 'google':
        url = 'https://www.google.com/search?q=';
        break;
      default:
        url = 'https://www.baidu.com/s?wd=';
    }
    window.open(data.selectionText ? url + data.selectionText : new URL(url).origin);
  }
});
```

## 使用
1. git clone https://github.com/zkrisj/chrome-search.git。
2. 打开扩展程序管理页面。
3. 点击右上角开启开发者模式。
4. 点击 加载已解压的扩展程序。选择第 1 步的文件夹。

![捕获.PNG](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/095dc0e947fe4638832d3064b4eac1b8~tplv-k3u1fbpfcp-watermark.image?)

## 效果

![微信截图_20220907234713.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f2c56f301a334b4d85ce09f6f8fca64a~tplv-k3u1fbpfcp-watermark.image?)

---
![微信图片编辑_20220907235551.jpg](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5281b1a762347989ac0832f4fd224f6~tplv-k3u1fbpfcp-watermark.image?)

## 完整代码仓库地址
[https://github.com/zkrisj/chrome-search](https://github.com/zkrisj/chrome-search)