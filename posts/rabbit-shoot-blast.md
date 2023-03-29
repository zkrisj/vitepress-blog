---
date: 0:11 2023/3/24
title: 兔年让这只🐇发射💣来爆破你的所有坏运
tags:
- Canvas
description: 页面右下角有一只搞怪的兔子，鼠标在页面中悬停时，兔子会跟着做出不同的动作和表情。然后可以在页面中任意位置（离兔子太近不能发射）点击鼠标，将从兔子眼睛👀里发射炮弹，随之击中爆破的是你的霉 运、压 力、贫 穷、疾 病😮‍💨。
---
## 前言
Hello，掘友们好！又是一年新春之际，祝福大家兔年快乐！给大家介绍一个有趣的动效（兼容 IE），页面右下角有一只搞怪的兔子，鼠标在页面中悬停时，兔子会跟着做出不同的动作和表情。然后可以在页面中任意位置（离兔子太近不能发射，会伤到兔子😆）点击鼠标，将从兔子眼睛👀里发射炮弹，随之击中爆破的是你的霉 运、压 力、贫 穷、疾 病😮‍💨。

## 实现
1. 定义一个随机文本块。
```html
<p id="p1"></p>
```

2. 定义兔子的构造函数。
```js
function HoverRabbit() {
  this.explodeImage = new Image();
  this.explodeImage.src = "img/explode.png";
  for (var i = 1; i <= 6; i++) {
    this.images[i] = new Image();
    this.images[i].src = "img/s" + i + ".png";
  }
  if (typeof(CanvasGradient) != 'undefined') {
    this.canvas = document.createElement("canvas");
    this.canvas.width = screen.width + 100;
    this.canvas.height = screen.height;
    this.canvas.style.position = 'absolute';
    this.canvas.style.left = '0px';
    this.canvas.style.top = '0px';
    this.canvas.style.display = 'none';
    document.body.appendChild(this.canvas);
    this.canvas.style.position = 'fixed';
  }
}
```

3. 定义兔子原型的属性和方法。
```js
HoverRabbit.prototype = {
  images: [],
  explodeImage: null,
  eyePositions: [],
  current: 1,
  frame: 1,
  canvas: null,
  interval: null,
  start: function() {
    var me = this;
    this.eyePositions[1] = {
      eye1x: 123,
      eye1y: 47,
      eye2x: 104,
      eye2y: 53
    };
    this.eyePositions[2] = {
      eye1x: 120,
      eye1y: 50,
      eye2x: 101,
      eye2y: 54
    };
    this.eyePositions[3] = {
      eye1x: 119,
      eye1y: 54,
      eye2x: 97,
      eye2y: 56
    };
    this.eyePositions[4] = {
      eye1x: 112,
      eye1y: 61,
      eye2x: 90,
      eye2y: 61
    };
    this.eyePositions[5] = {
      eye1x: 105,
      eye1y: 64,
      eye2x: 85,
      eye2y: 61
    };
    this.eyePositions[6] = {
      eye1x: 98,
      eye1y: 68,
      eye2x: 79,
      eye2y: 56
    };
    document.onmousemove = function(e) {
      me.onmousemove(e);
    }
    if (this.canvas) {
      document.addEventListener("click", function(e) {
        me.ondblclick(e);
      });
    }
  },
  onmousemove: function(e) {
    var event = e || window.event;
    var deg = Math.abs(screen.height - event.screenY) / (Math.abs(screen.width - event.screenX) + 1);
    var n = 1;
    if (deg > 2) n = 6;
    else if (deg > 1.4) n = 5;
    else if (deg > 0.7) n = 4;
    else if (deg > 0.45) n = 3;
    else if (deg > 0.2) n = 2;
    this.deg = n;
    if (this.current != n) {
      document.body.style.backgroundImage = "url(" + this.images[n].src + ")";
      this.current = n;
    }
  },
  drawBomb: function(ctxt, n, x, y) {
    var sx = 64 * (n % 4);
    var sy = 64 * (Math.floor(n / 4));
    ctxt.drawImage(this.explodeImage, sx, sy, 64, 64, x - 32, y - 32, 64, 64);
  },
  ondblclick: function(e) {
    if (this.canvas.style.display != 'none') return;
    var me = this;
    if (e.clientX > window.innerWidth - 200 && e.clientY > window.innerHeight - 200) return;
    var ctxt = this.canvas.getContext("2d");
    this.frame = 1;
    this.interval = setInterval(function(e2) {
      ctxt.clearRect(0, 0, me.canvas.width, me.canvas.height);
      switch (me.frame) {
        case 1:
          ctxt.strokeStyle = 'rgba(247,166,71,1)';
          me.canvas.style.display = 'block';
        case 2:
          if (me.frame == 2) {
            ctxt.strokeStyle = 'rgba(247,166,71,0.5)';
            me.drawBomb(ctxt, 0, e.clientX, e.clientY);
          }
          case 3:
            if (me.frame == 3) {
              ctxt.strokeStyle = 'rgba(247,166,71,0.1)';
              me.drawBomb(ctxt, 1, e.clientX, e.clientY);
            }
            var eye1x = window.innerWidth - me.eyePositions[me.current].eye1x;
            var eye1y = window.innerHeight - me.eyePositions[me.current].eye1y;
            ctxt.lineWidth = 3;
            ctxt.beginPath();
            ctxt.moveTo(eye1x, eye1y);
            ctxt.lineTo(e.clientX, e.clientY);
            ctxt.stroke();
            var eye2x = window.innerWidth - me.eyePositions[me.current].eye2x;
            var eye2y = window.innerHeight - me.eyePositions[me.current].eye2y;
            ctxt.beginPath();
            ctxt.moveTo(eye2x, eye2y);
            ctxt.lineTo(e.clientX, e.clientY);
            p1.textContent = ['霉 运', '压 力', '贫 穷', '疾 病'][Math.floor(Math.random() * 4)];
            p1.style.display = 'block';
            p1.style.transform = 'rotate(' + (-150 + me.deg * 30) + 'deg)';
            p1.style.left = e.clientX - 30 + 'px';
            p1.style.top = e.clientY - 30 + 'px';
            fade(p1);
            ctxt.stroke();
            break;
          case 4:
            me.drawBomb(ctxt, 2, e.clientX, e.clientY);
            break;
          case 14:
            me.canvas.style.display = 'none';
            window.clearInterval(me.interval);
            break;
          default:
            me.drawBomb(ctxt, me.frame - 2, e.clientX, e.clientY);
      }
      me.frame++;
    }, 50);
  }
};
```
各个属性和方法说明：
- images - 兔子不同的动作的图片数组。
- explodeImage - 炮弹图片元素。
- eyePositions - 兔子眼睛位置的数组。
- current - 整型数字，兔子当前动作的指针。
- frame - 整型数字，发射炮弹动画的帧数指针。
- canvas - 画布元素。
- interval - 发射炮弹动画时间间隔定时器的 interval ID。
- start - 启动页面交互的方法，在这里初始化了兔子眼睛位置的数组数据，绑定页面鼠标移动事件、点击事件。
- onmousemove - 定义页面鼠标移动的实现方法。
- ondblclick - 定义页面鼠标点击的实现方法。
- drawBomb - 定义绘制和更新炮弹动画的方法。

4. 定义文字淡出的动画。
```js
function fade(e) {
  var s = e.style;
  s.opacity = 1;
  (function hide() {
    (s.opacity -= .01) < 0 ? s.display = "none" : requestAnimationFrame(hide);
  })();
}
```

5. 创建兔子对象，调用启动交互方法。
```js
var s = new HoverRabbit();
s.start();
```

## 码上掘金

<iframe src="https://code.juejin.cn/pen/7186181146755989562"></iframe>