---
date: 23:19 2023/3/22
title: HTML 的页面可见性
tags:
- HTML
description: 页面可见性可以通过让页面在文档不可见时避免执行不必要的任务，从而来节省资源和提高性能。
---
## 介绍
开发者在过去通常通过监听 blur 和 focus 事件来了解页面是否处于活动状态，虽然 onblur 和 onfocus 会告诉你用户是否切换窗口，但不一定意味着它是隐藏的。当用户切换选项卡或最小化包含选项卡的浏览器窗口时，页面才会隐藏。

页面可见性可以通过让页面在文档不可见时避免执行不必要的任务，从而来节省资源和提高性能。例如：
- 网站有图片轮播效果，只有在用户观看轮播的时候，才会自动展示下一张幻灯片。
- 显示信息仪表盘的应用程序不希望在页面不可见时轮询服务器进行更新。
- 页面想要检测是否正在渲染，以便可以准确的计算网页浏览量。
- 网站想要在设备处于待机模式时关闭声音（用户按下电源按钮关闭屏幕）。
- 网站正在播放视频，它可以在用户将选项卡置于后台时暂停视频，并在用户返回选项卡时恢复播放。

1. 当用户最小化窗口或切换到另一个选项卡时，Document 会发送 `visibilitychange` 事件，让监听者知道页面状态已更改，然后可以检测事件并执行某些操作。
2. iframe 的可见性状态与父文档相同。使用 CSS 属性（例如 `display: none;`）隐藏 iframe 不会触发可见性事件或更改框架中包含的文档的状态。

## 接口
目前页面可见性 API 有两个属性，一个事件：

Document.hidden 已弃用 只读
- 如果页面处于被认为对用户隐藏的状态，则返回 true，否则返回 false。

Document.visibilityState 只读
- 指示文档当前可见性状态的字符串。可能的值为：

    visible
    - 页面内容可能至少部分可见。实际上，这意味着页面是非最小化窗口的前景选项卡。

    hidden
    - 该页面的内容对用户不可见，原因可能是文档的选项卡位于背景中，或者是最小化窗口的一部分，或者是因为设备的屏幕已关闭。

    prerender
    - 页面内容正在预呈现，用户看不到。一个文档可以从该prerender状态开始，但永远不会从任何其他状态切换到该状态，因为一个文档只能预渲染一次。
    - 注意：并非所有浏览器都支持预渲染。

    unloaded
    - 该页面正在从内存中卸载。
    - 注意：并非所有浏览器都支持该unloaded值。

visibilitychange
- 当标签的内容变得可见或隐藏时被触发的事件。

## 示例1
当切换或打开另一个标签时，视频应该暂停，并在返回选项卡时再次播放。这可以降低功耗或停止烦人的背景音频。
```html
<body>
  <video id="videoElement" src="../assets/cat2.mp4" width="320" height="240" controls autoplay></video>
</body>
<script>
  document.onvisibilitychange = e => {
    if (document.visibilityState === 'visible') videoElement.play();
    else if (document.visibilityState === 'hidden') videoElement.pause();
  }
  videoElement.addEventListener("pause", () => {
    document.title = 'Paused';
  }, false);
  videoElement.addEventListener("play", () => {
    document.title = 'Playing';
  }, false);
</script>
```

## 示例2
比如以下场景：
1. 打开网站，未登录状态下，进入首页。
2. 然后新窗口打开任意页面，登录成功。
3. 再次访问刚才打开的首页，发现页面还是未登录状态，实际上用户已经登录了。

有了页面可见性 API，我们就可以在步骤2设置登录状态，然后在步骤3通过 visibilitychange 事件获取登录状态并登录。
```html
<body>
  <p id="info">您尚未登录，请<a href="login.html" target="_blank">登录</a></p>
</body>
<script>
  window.onload = login;
  document.onvisibilitychange = e => {
    if (document.visibilityState === 'visible') login();
  }

  function login() {
    const {
      username
    } = localStorage;
    if (username) info.textContent = 'Hi, ' + username;
    else info.innerHTML = '您尚未登录，请<a href="login.html" target="_blank">登录</a>';
  }
</script>
```
登录页面：
```html
<body>
  <form id="loginForm" method="post">
    <p>用户名：
      <input type="text" name="username" required>
    </p>
    <p>密码：
      <input type="password" name="password" required>
    </p>
    <p>
      <input type="submit">
    </p>
  </form>
</body>
<script>
  loginForm.addEventListener('submit', function(e) {
    localStorage.username = this.username.value;
    alert('登录成功！回到刚才的页面查看效果！');
    this.reset();
    e.preventDefault();
  });
</script>
```