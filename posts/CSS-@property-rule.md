---
date: 12:38 2023/3/23
title: CSS 自定义属性 @property 的使用
tags:
- CSS
description: property at 规则提供了一个直接在样式表中注册自定义属性的方式，跟 CSS.registerProperty 函数使用同样的参数调用效果相同。
---
## 介绍
CSS 属性和值 API 是 CSS Houdini API（一组底层渲染 API）的一部分，包括 JS 接口CSS.registerProperty 和 CSS 接口 @property 两部分。

## CSS.registerProperty
用于注册自定义属性，允许检查属性类型、默认值以及继承或不继承其值。
### 语法
```js
CSS.registerProperty(PropertyDefinition)
```
PropertyDefinition 是一个字典对象，包含以下字段：
- name
    - 一个字符串，表示正在定义的属性的名称。
- syntax
    - 表示已定义属性的预期语法的字符串。默认为 `*`。
- inherits
    - 一个布尔值，定义是否应该继承定义的属性。默认为 false.
- initialValue
    - 表示已定义属性的初始值的字符串。

## @property
@property 规则提供了一个直接在样式表中注册自定义属性的方式，跟 CSS.registerProperty 函数使用同样的参数调用效果相同。并可以**对属性类型检查、设定默认值及定义是否可以被继承。**

## 语法
```css
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: #c0ffee;
}
```
以上相当于以下 JS 代码：
```js
window.CSS.registerProperty({
  name: '--my-color',
  syntax: '<color>',
  inherits: false,
  initialValue: '#c0ffee',
});
```
- `syntax` 和 `inherits` 描述符是必需的。如果其中任何一项缺失，整条规则都将失效并且会被忽略。
- `initial-value` 描述符仅在 `syntax` 描述符为通用语法定义（`*`）或接受了任何有效的标记值时是可选的，否则也是必需的——如果此时该描述符缺失，整条规则都将失效且被忽略。
- 未知描述符被视为无效并被忽略，但不会使 @property 规则无效。

### syntax
描述了 @property 规则所允许的语法结构。
#### 语法
```css
syntax: '<color>'; /* 接收一个颜色值 */
syntax: '<color#>'; /* 接受逗号分隔的颜色值列表 */
syntax: '<length+>'; /* 接受以空格分隔的长度值列表 */
syntax: '<length | length+>'; /* 接受单个长度或以空格分隔的长度列表 */
syntax: '<length> | <percentage>'; /* 接收长度或百分比参数，但是二者之间不进行计算合并 */
syntax: 'small | medium | large'; /* 接收这些参数值之一作为自定义标识符 */
syntax: '*'; /* 任何有效字符 */
```
#### 类型
- `<length>`
	- 由一个 `<number>` 和一个长度单位构成。与所有 CSS 维度一样，单位的字面值与数字之间没有空格。数字为 0 时，长度单位是可选的。例如 `1em 10px;`。
- `<number>`
	- 可以是整数或带有小数部分的数字。
- `<percentage>`
	- 一个百分比值。
- `<length-percentage>`
	- 可以是 `<length>` 或 `<percentage>`，例如 200px、20%、calc(100% - 200px)。
- `<color>`
	- 使用关键字（比如 blue 或 transparent）、以 `#` 加十六进制或者 rgb() 和 rgba() 函数表达式的形式，或以 hsl() 和 hsla() 函数表达式的形式。
- `<image>`
	- CSS 渐变（图像）、矢量图形（比如 SVG 格式的图像）和 jpeg 等格式的图像。例如 url(test.jpg)、linear-gradient(to bottom, blue, red)。
- `<url>`
	- 指向一个资源。它没有独有的表达形式，只能通过 url() 函数定义。
- `<integer>`
	- 没有带单位的正整数或负整数。
- `<angle>`
	- 表示角的大小，单位为度（deg）、百分度（grad）、弧度（rad）或圈数（turn）。在 `<gradient>` 和 transform 的某些方法等场景中使用。
- `<time>`
	- 表示以秒（s）或毫秒（ms）为单位的时间的值，可为小数和负值。于 animation、transition 及相关属性中使用。
- `<resolution>`
	- 表示输出设备的像素密度。由严格为正 `<number>` 组成，后跟下面列出的单位之一。与所有 CSS 维度一样，单位字面值与数字之间没有空格。用于媒体查询中使用，例如 `@media print and (min-resolution: 300dpi) { ... }`。

            - dpi：表示每英寸的点数。
            - dpcm：每厘米上的点数。1 英寸是 2.54 厘米，1dpcm ≈ 2.54dpi。
            - dppx：表示每个px的点数。 由于 CSS px 的固定比率为 1:96，因此 1dppx 相当于 96dpi。
            - x：dppx 的别名。
- `<transform-function>`
	- 用于对元素的显示做变换的 CSS 函数，matrix()、matrix3d()、perspective()、rotate()、rotate3d()、rotateX()、rotateY()、rotateZ()、scale()、scale3d()、scaleX()、scaleY()、scaleZ()、skew()、skewX()、skewY()、translate()、translate3d()、translateX()、translateY()、translateZ()。
- `<custom-ident>`
	- 任何用户自定义字符串标识符，要区分大小写。
- `<transform-list>`
	- 有效的 `<transform-function>` 值的列表。

### inherits
控制由 @property 声明注册的自定义属性默认情况下是否会被继承。可为以下取值：
- `true`
    - 属性默认继承。
- `false`
    - 属性默认不继承。
- `auto`
    - 默认值，自动设置。

### initial-value
initial-value 的值是对于设定的 syntax 具有正确值的字符串。依照 syntax 描述符定义，必须可以正确地解析。因此，如果 syntax 描述符为 `<color>`，那么初始值必须是一个有效的 color 值。

## 使用
@property 的类型为浏览器提供了更多的上下文信息，这可以使我们为浏览器提供所需的信息来转换和动画这些属性。这为那些不支持 transition 过渡或 animation 动画的 CSS 属性提供了一种解决方案。
1. 下面例子中有四个饼图：没有使用变量定义的饼图、使用普通变量定义 conic-gradient 颜色的饼图、使用 @property 变量定义 conic-gradient 颜色的饼图和使用 JS 方法 CSS.registerProperty 注册属性定义 conic-gradient 颜色的饼图。可以看到**只有使用 @property 属性和使用 JS 方法 CSS.registerProperty 注册属性定义的 CSS 值可以实现动画效果，普通变量定义的 CSS 值没有动画效果**。
```css
@property --property {
  syntax: "<percentage> | <angle>";
  inherits: false;
  initial-value: 18deg;
}
.property {
  background: conic-gradient(red, red var(--property), transparent var(--property), transparent 100%);
  transition: --property .5s linear;
}
.property:hover {
  --property: 360deg;
}
```
```js
CSS.registerProperty && CSS.registerProperty({
  name: '--color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'red',
});
```
<iframe src="https://code.juejin.cn/pen/7143633010762448935"></iframe>

2. 由于 @property 的值可以通过伪元素的 content 属性传递到 DOM，所以我们有了一种通过 CSS 来改变 DOM 的方法。
```css
@keyframes load {
  0%,
  10% {
    --angle: 0deg;
    --hue: 0;
    --dot: '';
  }

  40% {
    --hue: 30;
    --dot: '.';
  }

  70% {
    --hue: 60;
    --dot: '..';
  }

  100% {
    --angle: 360deg;
    --hue: 90;
    --dot: '...';
  }
}
```
<iframe src="https://code.juejin.cn/pen/7144284205617250338"></iframe>

## 浏览器支持
Firefox 和 Safari 浏览器在 PC 和移动端均不支持 @property 属性。

![developer.mozilla.org_zh-CN_docs_Web_CSS_@property.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a678e3884d964d45b24a397917c3f2fb~tplv-k3u1fbpfcp-watermark.image?)