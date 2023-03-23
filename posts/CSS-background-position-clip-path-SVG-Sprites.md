---
date: 22:33 2023/3/23
title: CSS background-position、clip-path 和 SVG Sprites 小图标生成方法
tags:
- CSS
- SVG
description: 将 clipPathUnits 设为 objectBoundingBox（相对于应用剪切路径的元素的边界框，坐标系的原点是对象边界框的左上角，对象边界框的宽度和高度都具有 1 个单位值的长度）模式的数值，即可以将剪裁的图标适用于任意的 HTML 元素尺寸。
---
## CSS Sprites
CSS Sprites 翻译为 CSS 贴图、图像精灵（sprite，意为精灵），指图像合并，通过 CSS `background-position` 属性定位图像的一部分来使用，使得使用一个图像文件可以替代多个小文件。但是有很多缺点：
- 不便于维护和扩展、定位不精确等问题，例如：在后期项目迭代中我们需要删除其中一个小图，那么排在它后面的小图位置都要移动，需要再次修改 CSS 样式，或每次都要打开 PS 删除某图标再导出。
- 无法修改小图颜色，要 UI 设计师调整后替换。
- 在移动端的大屏手机图标会模糊。

<iframe src="https://code.juejin.cn/pen/7166131877646958606"></iframe>

## SVG Sprites
类似于 CSS 中的 Sprite，图标图形整合在一起，实际呈现的时候准确显示特定图标。
- SVG Sprites 使用 `xlink:href="#id"` 的方式获取，便于维护和扩展，因为小图的 `id` 不会随便改动;
- 方便改变图片颜色，通过设置 `fill: 颜色值`，随意改变小图颜色;
- IE9 以上支持。

### symbol
目前，SVG Sprite 最佳实践是使用 `<symbol>` 元素。`<symbol>` 元素用于定义可由 `<use>` 元素实例化的图形模板对象，SVG Sprite 即是 `<symbol>` + `<use>` 元素的联合使用。
- 对同一文档中多次使用的图形使用 `<symbol>` 元素可以增加结构和语义。
- 结构丰富的文档可以以图形方式、语音或盲文形式呈现，从而提高可访问性和无障碍。
- 一个 `symbol` 元素本身是不呈现的，只有 `symbol` 元素的实例（即一个引用了 `symbol` 的 `<use>` 元素）才能呈现。
- `<symbol>` 可以拥有单独的 `viewBox` 和 `preserveAspectRatio` 坐标系属性。而 `<g>` 元素和 `<defs>` 元素则没有这些属性，这要比 `<defs>` 元素方便，例如创建包含多个具有完全不同边界的图标 fontAwesome 字体。
- SVG 中的 `use` 元素支持外链 SVG 文件，即可以调用其他 SVG 文件的元素，所以我们只要在页面使用 `use` 元素链接到一个 Sprite(包含各个图标的 `<symbol>` 元素) SVG 文件，然后图标尺寸由 CSS 控制即可。

<iframe src="https://code.juejin.cn/pen/7166226289836490764"></iframe>

### 对比 font-face
- `font-face` 在部分 win 系统下，字体较小的时候，会产生锯齿。
- `font-face` 异步加载会延时渲染。
- 某些浏览器下 `font-face` 有跨域问题。
- SVG 图标具备 `font-face` 几乎所有的优点：尺寸、颜色可由 CSS 定制。
- SVG 图标支持渐变色。
- SVG 图标中每个 `path` 元素可以独立控制。

## CSS clip-path 联合 SVG
1. CSS `clip-path` 属性除了剪裁圆、多边形之外，还支持 `url()` 函数语法，即可以把 SVG 元素中的路径作为剪裁路径。
2. SVG 提供了 `clipPathUnits` 属性用于指示 `<clipPath>` 元素内容要使用哪种坐标系，默认 `userSpaceOnUse`（相对创建剪切路径时定义的根坐标），设为 `objectBoundingBox`（相对于应用剪切路径的元素的边界框，坐标系的原点是对象边界框的左上角，对象边界框的宽度和高度都具有 1 个单位值的长度）模式的数值，即可以将剪裁的图标适用于任意的 HTML 元素尺寸。

<iframe src="https://code.juejin.cn/pen/7166214744100061197"></iframe>

### 对比 SVG Sprites
|   支持   | 传统 SVG Sprites | clipPath Sprites |
| ---- | ------------- | ---------------------------------- |
| 矢量   | ✔             | ✔                                  |
| 颜色可变 | ✔             | ✔                                  |
| **支持渐变** | ✘             | ✔                                  |
| 标签   | svg>use       | 任意 HTML 标签（IE 除外）                     |
| 兼容性  | IE9+          | IE9+（需使用 SVG 元素）                   |
| 尺寸控制 | 灵活            | transform 方法受限，clipPathUnits 方法灵活 |
| 工具   | 丰富 ✔          | 起步中…… |

## 参考资料
- [介绍一种全新的clipPath Sprites小图标技术](https://www.zhangxinxu.com/wordpress/2020/10/clip-path-sprites-icon/)
- [SVG Sprites技术介绍](https://www.zhangxinxu.com/wordpress/2014/07/introduce-svg-sprite-technology/)