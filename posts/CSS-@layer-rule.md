---
date: 23:57 2023/3/22
title: CSS @layer 规则的使用
tags:
- CSS
description: CSS @规则 中的 @layer 声明了一个级联层，同一层内的规则将级联在一起。也可用于定义多个级联层的优先顺序。
---
## 介绍
CSS @规则 中的 @layer 声明了一个级联层，同一层内的规则将级联在一起。也可用于定义多个级联层的优先顺序。

## 语法
```css
/* layer-name 的主要作用是用来灵活设置 @layer 和其他 @layer 规则的前后优先级。 */
/* rules 是级联层中的一组 CSS 规则 */
@layer layer-name {rules}
@layer layer-name;
@layer layer-name1, layer-name2, layer-name3;
@layer {rules}
```
> 注意：不属于任何一级联层的样式将被集中到同一匿名层，并置于所有层的后部，这意味着任何在层外声明的样式都会覆盖在层内声明的样式，而不管选择器权重和优先级如何。

## @layer 的使用场景
### 问题1
我们在实际开发的时候，经常会使用第三方组件。但是这些组件虽然功能是我们需要的，但是 UI 样式却和产品的风格不一致，我们需要对这些组件的 UI 进行重置，换个肤，变个色什么的。这时，我们可以使用优先级更高的选择器进行覆盖。例如：
```css
.container .some-button {}
```
覆盖的时候，需要增加一点权重。
```css
body .container .some-button {}
```
但是，这种做法很繁琐，不灵活。

### 问题2
但是，有些 Web 组件甚至还有 CSS reset 代码，而所有的 CSS 在同一个文档流中都公用同一个上下文（无论是 Shadow DOM 还是 iframe 都可以看成是一个独立的上下文），这就导致这些 CSS 代码会影响全局样式。例如，组件内设置了：
```
a { color: blue; }
a:hover { color: darkblue; }
```
由于引入组件的 CSS 往往都在项目 common.css 的后方，所以优先级更高，导致整个网页的链接元素的颜色都被污染了。这时，需要将 common.css 中的相关优先级提高才行。例如：
```
body a { color: blue; }
body a:hover { color: blue; }
```

### 问题3
对于链接元素的 CSS reset，最好的方法是使用 `:any-link` 伪类（匹配每一个有 `href` 属性的 `<a>`、`<area>` 或 `<link>` 元素）：
```
:any-link { color: blue; }
:any-link:hover { color: darkblue; }
```
这样语义最好，匹配最精准，且无需担心 `:visited` 伪类的干扰。但是因为伪类的优先级比较高，一旦设置，某个 `<a>` 元素按钮想要重置颜色，所需要的选择器成本就会很高，提高了整个项目的选择器复杂度。

### @layer 的解决方法
以上三个场景描述都指向了同一个问题，同一个 CSS 上下文中，有些 CSS 声明需要设置低优先级，且这种优先级不受选择器权重的影响。@layer 规则就是解决上面这种场景应运而生的，可以让 CSS 声明的优先级下降一整个级联级别。
1. 对于组件或者模块的 CSS，我们可以全部写在 @layer 规则中，把自身的优先级降到底部。例如：
```css
@layer {
    .container .some-button { height: 30px; }
    :any-link { color: blue; }
    :any-link:hover { color: darkblue; }
}
```
此时，业务中的 CSS 代码就可以无视组件 CSS 中的优先级了，直接这样设置就可以进行重置：
```css
.some-button { height: 40px; }
a { color: deepskyblue; }
a:hover { color: skyblue; }
```

2. 对于第三方的 CSS 文件，尤其是那些走 CDN 的绝对地址 CSS，我们是没办法修改相关的代码的，此时可以在传统的 @import 语法后面再添加个 layer(layer-name)：
```css
@import './lib.css' layer(lib);
```
此时，lib.css 里面所有 CSS 声明的优先级都会低于常规设置的 CSS 声明。

## 使用
1. 创建一个命名的级联层，其中包含该层的 CSS 规则，如下所示：
```css
@layer utilities {
  .padding-sm {
    padding: 0.5rem;
  }
  .padding-lg {
    padding: 0.8rem;
  }
}
```

2. 定义命名的级联层而不分配任何样式。如下所示：
```css
/* 定义一个命名的级联层 */
@layer utilities;

/* 一次定义多个命名的级联层 */
@layer theme, layout, utilities;
```
`级联层最初被指定的顺序决定了它是否有优先级，如果同一声明中有多个级联层被指定，则最后一个级联层中的样式将优先于其他层。`因此，在上面的例子中，如果 theme 层和 utilities 层中存在冲突的规则，那么 utilities 层中的将优先被应用。

`级联层顺序建立之后，选择器的出现顺序和优先级都会被忽略。这将使创建 CSS 选择器变得更加简单，因为你不需要确保每一个选择器都有足够高的优先级来覆盖其他冲突的规则，你只需要确保它们出现在一个顺序更靠后的级联层中。`

> 注意：在声明级联层的名称后，它们的顺序即被确立，你可以重复声明某级联层的名字来向其添加新的 CSS 规则。这些样式将被附加到该层的末尾，但级联层之间的顺序不会改变。

3. 创建一个匿名的级联层。除创建后无法向其添加规则外，该层和其他命名层功能一致。
```css
@layer {
  p {
    margin-block: 1rem;
  }
}
```

4. 使用 @import 创建级联层。在这种情况下，规则将在导入的样式表中，@import at 规则必须位于所有（除了 @charset）其他类型的规则之前。
```css
@import "theme.css" layer(utilities);
```
也可以直接使用 layer 关键字，而不是作为一个方法使用，来匿名引入：
```css
@import './lib.css' layer;
```

5. 级联层允许嵌套，例如：
```css
@layer framework {
  @layer layout {

  }
}
```
向 framework 层内部的 layout 层附加规则，只需用符号 `.` 连接这两层。
```css
@layer framework.layout {
  p {
    margin-block: 1rem;
  }
}
```

6. 在 `<link>` 元素上创建级联层。
```html
<!-- lib.css的样式属于名为 lib 的级联层 -->
<link rel="stylesheet" href="lib.css" layer="lib">

<!-- 样式引入到一个匿名级联层中 -->
<link rel="stylesheet" href="lib.css" layer>
```

## 示例
### 示例1
在以下示例中，创建了两个 CSS 规则。一个用于级联层之外的元素 p，一个用于命名为 type 的层内 .box p。如果没有级联层，选择器 .box p 将会有最高的优先级，文字 Hello, world! 将被显示为绿色。声明了 type 级联层后，文本将会是紫色的。要注意顺序，即使我们先声明了非分层样式，它仍然会应用在 layer 层级之后。
```html
<div class="box">
  <p>Hello, world!</p>
</div>
```
```css
p {
  color: rebeccapurple;
}

@layer type {
  .box p {
    font-weight: bold;
    font-size: 1.3em;
    color: green;
  }
}
```
<iframe src="https://code.juejin.cn/pen/7143164560185229346"></iframe>

### 示例2
下面的例子创建了两个没有规则的级联层，随后，CSS 规则被添加到这两个层中。base 层定义了 color、border、font-size 和 padding 属性。special 层定义了不同的 color 属性。special 层在定义时排在最后，所以其中的 color 属性将会被应用，文字的颜色将显示为 rebeccapurple。但 base 层中的其他规则仍然有效。
```html
<div class="item">
  I am displayed in <code>color: rebeccapurple</code> because the
  <code>special</code> layer comes after the <code>base</code> layer. My green
  border, font-size, and padding come from the <code>base</code> layer.
</div>
```
```css
@layer base, special;

@layer special {
  .item {
    color: rebeccapurple;
  }
}

@layer base {
  .item {
    color: green;
    border: 5px solid green;
    font-size: 1.3em;
    padding: 0.5em;
  }
}
```
<iframe src="https://code.juejin.cn/pen/7143165618810781737"></iframe>

### 示例3
下面的例子，创建了两个嵌套的级联层，它们都定义了 button 的样式。但是外层的优先级高于内层。因此，最终生效的是外层的样式 width:100px 和 height:30px。
```css
@layer outer {
  button {
    width: 100px;
    height: 30px;
  }
  @layer inner {
    button {
      height: 40px;
      width: 160px;
    }
  }
}
```
上面的内外嵌套语法还可以写成下面这样：
```css
@layer outer {
  button {
    width: 100px;
    height: 30px;    
  }
}
@layer outer.inner {
  button {
    height: 40px;
    width: 160px;
  }    
}
```
渲染效果是一样的。

### 示例4
多个嵌套语法下的优先级：内部的 @layer 的优先级由外部的 @layer 规则决定。
```css
@layer 甲 {
  p { color: red; }
  @layer 乙 {
    p { color: green; }
  }
}
@layer 丙 {
  p { color: orange; }
  @layer 丁 {
    p { color: blue; }
  }
}
```
<iframe src="https://code.juejin.cn/pen/7143191449478103047"></iframe>

其中的优先级大小是这样的：丙 > 丙.丁 > 甲 > 甲.乙。打开浏览器可以看到下面的优先级覆盖关系：

![微信截图_20220914195010.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ea3f0fb11934fb4afee91909e930828~tplv-k3u1fbpfcp-watermark.image?)

> 查看 @layer 效果，需要升级你的浏览器到以下版本：

![developer.mozilla.org_zh-CN_docs_Web_CSS_@layer.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/41441a2c49e0405ea053354ac5b379e1~tplv-k3u1fbpfcp-watermark.image?)

## 参考资料
- [详解日后定会大规模使用的 CSS @layer 规则](https://www.zhangxinxu.com/wordpress/2022/05/css-layer-rule/)