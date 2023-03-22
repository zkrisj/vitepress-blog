---
date: 23:24 2023/3/22
title: 🚀 使用油猴做一个划词翻译
tags:
- JS
description: 用户脚本是一段 JS 代码，能为网站添加新的功能。编写 JS 脚本比 crx 扩展简单得多，不必为了实现一个简单的功能加入其他的文件。
---
## 用户脚本
用户脚本是一段 JS 代码，能为网站添加新的功能。编写 JS 脚本比 crx 扩展简单得多，不必为了实现一个简单的功能加入其他的文件。

使用用户脚本需要安装一个脚本管理器，最常用的就是油猴（Tampermonkey）或暴力猴（Violentmonkey），Firefox 应用商店、Edge 应用商店或 chrome 应用商店搜索 Tampermonkey 或 Violentmonkey，然后下载安装即可。

## Tampermonkey vs Violentmonkey
云端备份、导出备份、自动更新、筛选排序这些脚本管理的重要功能，油猴和暴力猴上都有。

Tampermonkey 多了一些定制，编辑工具功能也多一些。

![微信截图_20220905232306.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcb87fe0957d46e3a2aaccf97acaac8e~tplv-k3u1fbpfcp-watermark.image?)

---
Violentmonkey 安装包体积较小，界面比较清爽一些，设置也比较简单。

![微信截图_20220905232614.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/303501d591074b8ca7014de232d00090~tplv-k3u1fbpfcp-watermark.image?)

---
Violentmonkey 还多了一个比较实用的功能，为当前网站查找匹配的脚本。

![微信截图_20220905233157.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/30d8d29966f24141a1c3ca1cdc3e8425~tplv-k3u1fbpfcp-watermark.image?)

## 编写脚本
以 Violentmonkey 为例。
1. 新建脚本。首先点击 Violentmonkey 扩展图标上面的 + 号，新建一个脚本。

![微信截图_20220905233417.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/10add441b486490ab24ddf85215514ca~tplv-k3u1fbpfcp-watermark.image?)

2. 设置脚本。以 `// ==UserScript==` 开头，`// ==/UserScript==` 结尾。下面是一些常用的设置：
- @namespace 和 @name 组合是发布到脚本网站时，用户脚本的唯一标识符。
- @author：脚本的作者。
- @version：脚本版本，用于更新发布脚本。
- @description：脚本的描述，可以添加命名来国际化，比如 @description:en。
- @include、@exclude：脚本应该和不应该运行的页面。允许指定多个。
- @require：加载外部脚本的 URL。允许指定多个。
- @resource：一些外部静态资源。可以通过 GM_getResourceURL 和 GM_getResourceText 方法访问。
```js
// @resource logo https://my.cdn.com/logo.png
// @resource text https://my.cdn.com/some-text.txt
```
- @connect：定义允许被 GM_xmlhttpRequest 方法访问的域名。允许指定多个。
- @grant：给 `GM_*` 方法授权并可在脚本执行时使用。如果使用任何特殊 API，则必须明确授予。
```js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_setClipboard
// @grant GM_openInTab
// @grant GM_xmlhttpRequest
```
除了GM API之外，还可以授予以下权限：
```js
// @grant window.close
// @grant window.focus
// @grant window.onurlchange

if (window.onurlchange === null) {
    // feature is supported
    window.addEventListener('urlchange', (info) => ...);
}
```
- @run-at：定义脚本何时执行。
    - document-end 默认值
        - 脚本在 DOMContentLoaded 被触发时执行。此时，页面的基本 HTML 已准备就绪，图像等其他资源可能仍在加载中。
    - document-start
        - 脚本会尽快执行。不能保证脚本在页面中的其他脚本之前执行。在 Greasemonkey v3 中，甚至可以在加载 HTML 之前确保脚本执行，但对于 Violentmonkey 作为 Web 扩展来说这是不可能的。
    - document-idle
        - 脚本在 DOMContentLoaded 触发后执行。
3. 加入代码。
```js
// ==UserScript==
// @name        无需梯子 谷歌划词翻译 translate.google.cn
// @namespace   https://violentmonkey.github.io
// @version     1.13
// @description 基于 translate.google.cn，中译英，英译中，拼音、音标显示
// @license     https://www.apache.org/licenses/LICENSE-2.0
// @author      zkrisj
// @include     *
// @exclude     https://juejin.cn/editor/drafts/*
// @exclude     https://translate.google.cn/*
// @run-at      document-end
// @connect     translate.google.cn
// @grant       GM_xmlhttpRequest
// ==/UserScript==
(function() {
  'use strict';
  // var googleUrl = 'https://translate.google.cn/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&source=input&hl=auto&sl=auto';
  // 无需梯子
  var googleUrl = 'https://translate.google.cn/_/TranslateWebserverUi/data/batchexecute?&source-path=%2F&rpcids=MkEWBc&soc-app=1&soc-platform=1&soc-device=1&_reqid=632656&rt=c';
  var icon = document.createElement('div');
  var word = '';
  icon.innerHTML = '<svg style="position: absolute;margin: 4px;" width="24" height="24" viewBox="0 0 768 768">' +
    '<path d="M672 640.5v-417c0-18-13.5-31.5-31.5-31.5h-282l37.5 129h61.5v-33h34.5v33h115.5v33h-40.5c-10.5 40.5-33 79.5-61.5 112.5l87 85.5-22.5 24-87-85.5-28.5 28.5 25.5 88.5-64.5 64.5h225c18 0 31.5-13.5 31.5-31.5zM447 388.5c7.5 15 19.5 34.5 36 54 39-46.5 49.5-88.5 49.5-88.5h-127.5l10.5 34.5h31.5zM423 412.5l19.5 70.5 18-16.5c-15-16.5-27-34.5-37.5-54zM355.5 339c0-7.381-0.211-16.921-3-22.5h-126v49.5h70.5c-4.5 19.5-24 48-67.5 48-42 0-76.5-36-76.5-78s34.5-78 76.5-78c24 0 39 10.5 48 19.5l3 1.5 39-37.5-3-1.5c-24-22.5-54-34.5-87-34.5-72 0-130.5 58.5-130.5 130.5s58.5 130.5 130.5 130.5c73.5 0 126-52.5 126-127.5zM640.5 160.5c34.5 0 63 28.5 63 63v417c0 34.5-28.5 63-63 63h-256.5l-31.5-96h-225c-34.5 0-63-28.5-63-63v-417c0-34.5 28.5-63 63-63h192l28.5 96h292.5z" style="fill:#3e84f4;"/></svg>';
  icon.setAttribute('style', 'width:32px;' + 'height:32px;' + 'display:none;' + 'background:#fff;' + 'border-radius:16px;' +
    'box-shadow:4px 4px 8px #888;' + 'position:absolute;' + 'z-index:2147483647;');
  // 添加翻译图标到 DOM
  document.documentElement.appendChild(icon);
  document.addEventListener('mousedown', function(e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode
        .parentNode == icon)) { // 点击翻译图标时阻止选中的文本消失
      e.preventDefault();
    }
  });
  // 选中变化事件
  document.addEventListener("selectionchange", function() {
    if (!window.getSelection().toString().trim()) {
      icon.style.display = 'none';
      // server.containerDestroy();
    }
  });
  // 显示、隐藏翻译图标
  document.addEventListener('mouseup', function(e) {
    if (e.target == icon || (e.target.parentNode && e.target.parentNode == icon) || (e.target.parentNode.parentNode && e.target.parentNode
        .parentNode == icon)) { // 点击了翻译图标
      e.preventDefault();
      return;
    }
    var text = window.getSelection().toString().trim();
    if (text && text.length < 800 && icon.style.display == 'none') {
      icon.style.top = e.pageY + 12 + 'px';
      icon.style.left = e.pageX + 'px';
      icon.style.display = 'block';
    } else if (!text) {
      icon.style.display = 'none';
      for (var i = 0; i < server.rendered.length; i++) { // 点击了翻译内容面板
        if (e.target == server.rendered[i]) return; // 不再创建翻译图标
      }
      server.containerDestroy(); // 销毁翻译内容面板
    }
  });
  // 翻译图标点击事件
  icon.addEventListener('click', function(e) {
    var text = window.getSelection().toString().trim();
    if (text) {
      icon.style.display = 'none';
      server.containerDestroy(); // 销毁翻译内容面板
      // 新建翻译内容面板
      var container = server.container();
      container.style.top = e.pageY + 'px';
      if (e.pageX + 350 <= document.body.clientWidth) // container 面板css最大宽度为250px
        container.style.left = e.pageX + 'px';
      else container.style.left = document.body.clientWidth - 350 + 'px';
      document.body.appendChild(container);
      server.rendered.push(container);
      if (isChina(text)) {
        // ajax(googleUrl + '&tl=en&q=' + encodeURIComponent(text), container);
        ajax(googleUrl, container, 'POST', "f.req=" + JSON.stringify([[["MkEWBc", "[[" + encodeURIComponent(text) + ",'zh-CN','en']]"]]]));
      } else {
        // ajax(googleUrl + '&tl=zh&dt=t&q=' + encodeURIComponent(text), container);
        text = text.replace(/[A-Z][^A-Z ]/g, function(v) { return ' ' + v.toLowerCase() }).replace(/\p{P}/gu, ' ').replace(/  /g, ' ').trim();
        word = text;
        ajax(googleUrl, container, 'POST', "f.req=" + JSON.stringify([[["MkEWBc", "[[" + encodeURIComponent(text) + ",'auto','zh-CN']]"]]]));
      }
    }
  });

  function isChina(str) {
    var reg = /^([\u4E00-\u9FA5]|[\uFF00-\uFF20]|[\u3000-\u301C])+$/;
    return reg.test(str);
  }

  function ajax(url, element, method, data, headers) {
    if (!method) method = 'GET';
    // 因为Tampermonkey跨域访问(a.com)时会自动携带对应域名(a.com)的对应cookie，不会携带当前域名的cookie
    // 所以，GM_xmlhttpRequest【不存在】cookie跨域访问安全性问题
    if (!headers) headers = { "content-type": "application/x-www-form-urlencoded;charset=UTF-8", };
    GM_xmlhttpRequest({
      method: method,
      url: url,
      headers: headers,
      data: data,
      onload: function(res) {
        console.log(url, data, res);
        // google(res.responseText, element);
        if (res.responseText.startsWith('<!DOCTYPE html>')) {
          displaycontainer("获取失败", element);
        } else {
          res = JSON.parse(JSON.parse(res.responseText.match(/^\)]}'\n\n\d+\n(\[\[.*(?!\n\d)\]\])/)[1])[0][2]);
          var phonetic = res[0][0] ? res[0][0] + "\r\n" : "";
          var translation = res[1][0][0][5][0][0];
          if (res[3] && word === res[3][0] && res[3][5] && res[3][5][0] && res[3][5][0][0] && res[3][5][0][0][1] && res[3][5][0][0][1][0])
            translation = res[3][5][0][0][1][0][0];
          displaycontainer(phonetic.toLowerCase() + translation, element);
        }
      },
      onerror: function(res) {
        displaycontainer("连接失败", element);
      }
    });
  }

  function google(rst, element) {
    var json = JSON.parse(rst), html = '';
    console.log(json);
    for (var i = 0; i < json.sentences.length; i++) {
      html += json.sentences[i].trans;
    }
    displaycontainer(html, element);
    // console.log(word, html, element);
  }

  function displaycontainer(text, element) {
    element.textContent = text;
    element.style.display = 'block'; // 显示结果
  }
  var server = {
    // 存放已经生成的翻译内容面板（销毁的时候用）
    rendered: [],
    // 销毁已经生成的翻译内容面板
    containerDestroy: function() {
      for (var i = this.rendered.length - 1; i >= 0; i--) {
        if (this.rendered[i] && this.rendered[i].parentNode) {
          this.rendered[i].parentNode.removeChild(this.rendered[i]);
        }
      }
    },
    // 生成翻译结果面板 DOM （此时还未添加到页面）
    container: function() {
      var pre = document.createElement('pre');
      pre.setAttribute('style', 'display:none;' + 'position:absolute;' + 'font-size:13px;' + 'overflow:auto;' + 'background:#fff;' +
        'font-family:sans-serif,Arial;' + 'font-weight:normal;' + 'text-align:left;' + 'color:#000;' + 'padding:0.5em 1em;' +
        'line-height:1.5em;' + 'border-radius:5px;' + 'border:1px solid #ccc;' + 'box-shadow:4px 4px 8px #888;' + 'max-width:350px;' +
        'max-height:216px;' + 'z-index:2147483647;');
      return pre;
    }
  };
})();
```
如果自己使用，不需要分享给其他人，下面步骤就省了。

4. [GreasyFork](https://greasyfork.org/zh-CN) 上面发布。没有注册需要先注册。
5. 脚本地址：[谷歌划词翻译 translate.google.cn](https://greasyfork.org/zh-CN/scripts/450786-%E6%97%A0%E9%9C%80%E6%A2%AF%E5%AD%90-%E8%B0%B7%E6%AD%8C%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91-translate-google-cn)，[谷歌划词翻译 translate.googleapis.com](https://greasyfork.org/zh-CN/scripts/451371-%E6%97%A0%E9%9C%80%E6%A2%AF%E5%AD%90-%E8%B0%B7%E6%AD%8C%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91-translate-googleapis-com)
