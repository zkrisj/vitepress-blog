---
date: 11:43 2023/5/2
title: 拖拽图片缩放效果
tags:
- JS
description: 页面中所有设置了类名 resizable，或者设置了 HTML 属性 resizable 的元素都可以四面拉伸了。
---
## 介绍
实现下图所示的图片拖拽缩放效果：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7a620935470f4ef68981bb426aa1129a~tplv-k3u1fbpfcp-watermark.image?)

1. 通常实现方式都是 `<img>` 元素外面包裹个 DIV，然后定位一些方框框，然后再去拉伸。如果是非编辑器产品，这么实现并没有多大的问题。
2. 但是如果是需要实时编辑的产品，IMG 外面还有其他标签，势必会影响很多编辑操作。
3. 当然，还有方法就是 JS 定位，拖拽层覆盖在图像上，从技术成本上讲，也是一个不错的实现，但如果页面发生了滚动，或者拖拽很快，拖拽的小方块就有可能跟不上（具体要看你的实现）。

## CSS

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/110352b459ac47449d52bcbde14f6749~tplv-k3u1fbpfcp-watermark.image?)

四个角四个圆圈圈，比较简洁，凡是这种在元素边框（不包括边角）包含规则图形（没有图形也是一种规律）的效果，一定是使用 CSS `border-image` 属性。

下图是使用处理后的素材配合 `border-image` 属性实现的效果：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e82a75e26fa84dfe8e144fbaa5c4e391~tplv-k3u1fbpfcp-watermark.image?)

可能图有些小，看不到细节，把边角放大 N 倍看下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a103f200dd4b408587e42bb460518b04~tplv-k3u1fbpfcp-watermark.image?)

`border-image` 生成的图形藏在了图像内容的后面。在 Web 中，`content` 内容的层级是最高的，`outline` 轮廓、`border` 边框、`background` 背景色等都是比图文内容的层级低的。因此，`border-image` 的图形在 IMG 元素内容的后面，导致边角的拖拽圈圈显示不全。

将拖拽图形全部改造为在图像元素的外部，这样就不会有被内容覆盖的问题了：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/661df0e9e65340b1bd8d42b245f0c372~tplv-k3u1fbpfcp-watermark.image?)

相关 CSS代码如下：
```css
img.resizable, img[resizable] {
  border: 3px solid transparent;
  border-image: url(./作者zhangxinxu.svg) 12 / 12px / 0; 
}
```

## JS 代码
```js
function onlyImageResize(options) {
  var doc = document;
  var win = window;
  // 参数处理
  var defaults = {
    selector: '.resizable, [resizable]',
    maxWidth: true,
    whenDisabled: function() {
      return win.imgResizable === false || doc.imgResizable === false;
    },
    // 拖拽完成
    onFinish: function() {}
  };
  options = options || {};
  var params = {};
  for (var key in defaults) {
    params[key] = options[key] || defaults[key];
  }
  // 存放临时数据的地方
  var store = {};
  // 匹配目标元素的选择器
  var strSelector = params.selector;
  var strSelectorImg = strSelector.split(',').map(function(selector) {
    return 'img' + selector.trim();
  }).join();
  var strSelectorActive = strSelector.split(',').map(function(selector) {
    return selector.trim() + '.active';
  }).join();
  // 载入必要的 CSS 样式
  var eleStyle = document.createElement('style');
  var strSvg = "data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath stroke='%23914AFF' d='M2.5 2.5h25v25h-25z'/%3E%3Cpath d='M0 0v12h2V2h10V0H0zM0 30V18h2v10h10v2H0zM30 0H18v2h10v10h2V0zM30 30H18v-2h10V18h2v12z' fill='%23914AFF'/%3E%3C/svg%3E";
  eleStyle.innerHTML = strSelectorImg + '{display:inline-block;vertical-align: bottom;font-size:12px;border: 3px solid transparent;margin:-1px;position: relative;-webkit-user-select: none; user-select: none; }' + strSelectorActive + '{border-image: url("' + strSvg + '") 12 / 12px / 0; cursor: default; z-index: 1;}';
  document.head.appendChild(eleStyle);
  // 先点击图片，进入可拉伸状态
  doc.addEventListener('click', function(event) {
    var eleTarget = event.target;
    if (!eleTarget || !eleTarget.matches) {
      return;
    }
    var eleActive = document.querySelector(strSelectorActive);
    if (eleActive && eleActive != eleTarget) {
      eleActive.classList.remove('active');
    }
    if (params.whenDisabled()) {
      return;
    }
    if (eleTarget.matches(strSelector)) {
      eleTarget.classList.add('active');
    }
  });
  // 设置拉伸触发的标志量
  doc.addEventListener('mousedown', function(event) {
    var eleTarget = event.target;
    if (eleTarget.matches && eleTarget.matches(strSelectorActive) && eleTarget.style.cursor) {
      event.preventDefault();
      store.reszing = true;
      store.image = eleTarget;
      store.clientX = event.clientX;
      store.clientY = event.clientY;
      // 此时图片的尺寸
      store.imageWidth = eleTarget.width || eleTarget.clientWidth;
      store.imageHeight = eleTarget.height || eleTarget.clientHeight;
      // 此时图片的拉伸方位
      store.position = eleTarget.position;
      // 最大宽度
      if (typeof params.maxWidth == 'number') {
        store.maxWidth = params.maxWidth;
      } else if (params.maxWidth) {
        // 使用第一个非内联水平的祖先元素的尺寸作为最大尺寸
        var eleParent = (function(element) {
          var step = function(ele) {
            var display = getComputedStyle(ele).style;
            if (/inline/.test(display)) {
              return step(ele.parentElement);
            }
            return ele;
          }
          return step(element);
        })(eleTarget.parentElement);
        // 设置最大尺寸
        if (eleParent) {
          store.maxWidth = eleParent.clientWidth - 4;
        }
      }
    }
  });
  // 设置手形，或者拖拽，视标志量决定
  doc.addEventListener('mousemove', function(event) {
    var eleTarget = event.target;
    if (store.reszing) {
      event.preventDefault();
      // 移动距离
      var distanceX = event.clientX - store.clientX;
      var distanceY = event.clientY - store.clientY;
      // 变化的尺寸
      var width = 0;
      var height = 0;
      // 方位计算是加还是减
      var scale = 1;
      // 不同方位有着不同的判断逻辑
      var position = store.position;
      // 左下角
      if ((position == 'bottom left' || position == 'top right') && distanceX * distanceY < 0) {
        // 左下方是变大，右上是变小
        // distanceX- distanceY+ 变大，distanceX+ distanceY-是变小
        // 右上角
        // 左下方是变小，右上是变大，正好和 'bottom left' 相反
        if (position == 'top right') {
          scale = -1;
        }
        width = store.imageWidth - distanceX * scale;
        height = store.imageHeight + distanceY * scale;
      } else if ((position == 'top left' || position == 'bottom right') && distanceX * distanceY > 0) {
        // 左上角
        // distanceX+, distanceY+是缩小
        // distanceX-, distanceY-是放大
        // 如果是右下角，则相反
        if (position == 'bottom right') {
          scale = -1;
        }
        width = store.imageWidth - distanceX * scale;
        height = store.imageHeight - distanceY * scale;
      }
      if (!width && !height) {
        return;
      }
      // 目标尺寸
      var imageWidth = 0;
      var imageHeight = 0;
      // 图像的原始比例
      var ratio = store.imageWidth / store.imageHeight;
      // 选择移动距离大的方向
      if (Math.abs(distanceX) > Math.abs(distanceY)) {
        // 宽度变化为主
        imageWidth = width;
        imageHeight = width / ratio;
      } else {
        // 高度变化为主
        imageHeight = height;
        imageWidth = height * ratio;
      }
      // 最终设置图片的尺寸
      store.image.width = Math.round(imageWidth);
      store.image.height = Math.round(imageHeight);
    } else if (eleTarget.matches && eleTarget.matches(strSelectorActive)) {
      // 根据位置设置手形
      var clientX = event.clientX;
      var clientY = event.clientY;
      var bounding = eleTarget.getBoundingClientRect();
      // 边缘判断
      if ((clientX - bounding.left < 20 && clientY - bounding.bottom > -20) || (clientX - bounding.right > -20 && clientY - bounding.top < 20)) {
        eleTarget.style.cursor = 'nesw-resize';
        // 判断位置
        if (clientX - bounding.left < 20) {
          eleTarget.position = 'bottom left';
        } else {
          eleTarget.position = 'top right';
        }
      } else if ((clientX - bounding.left < 20 && clientY - bounding.top < 20) || (clientX - bounding.right > -20 && clientY - bounding.bottom > -
          20)) {
        eleTarget.style.cursor = 'nwse-resize';
        // 判断位置
        if (clientX - bounding.left < 20) {
          eleTarget.position = 'top left';
        } else {
          eleTarget.position = 'bottom right';
        }
      } else {
        eleTarget.style.cursor = '';
        eleTarget.position = '';
      }
    }
  });
  // 拖拽结束
  doc.addEventListener('mouseup', function(event) {
    // 图片尺寸超出100%限制
    if (store.image && store.maxWidth && store.image.width > store.maxWidth) {
      // 目标尺寸
      var imageWidth = store.maxWidth;
      var imageHeight = imageWidth / (store.imageWidth / store.imageHeight);
      // 最终设置图片的尺寸
      store.image.width = Math.round(imageWidth);
      store.image.height = Math.round(imageHeight);
    }
    if (store.reszing) {
      store.reszing = false;
      params.onFinish();
    }
  });
};
```

## 使用
在 HTML 页面中直接引入上面 JS 代码就可以使用了：
```html
<script>
  onlyImageResize({
    // 参数在这里
  });
</script>
```
此时，页面中所有设置了类名 `.resizable`，或者设置了 HTML 属性 `resizable` 的元素都可以四面拉伸了。

options 为可选参数，包括：
- selector

    字符串值。默认值是 `'.resizable, [resizable]'`，表示识别为可拉伸图片的选择器。
- maxWidth

    数值或布尔值。默认是 `true`，表示有最大宽度限制，最大宽度值是第一个非内联祖先元素的宽度。支持设置为数值，指定最大宽度值。
- whenDisabled

    函数值，如果返回 `true`，表示禁用图像的拉伸，如果是 `false`，则拉伸执行。默认值是：
    ```js
    function () {
        return window.imgResizable === false || document.imgResizable === false;
    }
    ```
    表示，如果 `window.imgResizable` 或者 `document.imgResizable` 的值是 `false`，则禁用拉伸。
- onFinish

    函数值，默认是空函数，拖拽结束的时候触发。

## 码上掘金
<iframe src="https://code.juejin.cn/pen/7228490812546351163"></iframe>

## 参考资料
1. [JS之我用单img元素实现了图像resize拉伸效果](https://www.zhangxinxu.com/wordpress/2022/11/js-image-resize/)
2. 体验地址：<https://zhangxinxu.gitee.io/only-img-resize/>