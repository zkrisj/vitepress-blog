---
date: 0:16 2023/3/24
title: 「兔了个兔」来看看夜晚能聚光的🐇
tags:
- SVG
description: 一群在夜晚的兔子，眼睛发射着聚光，当鼠标悬停在 svg 元素上或通过键盘 Tab 键导航来聚焦到 svg 元素时时，将切换到白天正常的状态。
---
## 介绍
宠物科普：小兔是有各种颜色的，它们的眼睛也是有不一样颜色的。那是因为它们身体里有一种叫色素的东西。兔子眼睛的颜色与它们的皮毛颜色有关系，黑兔子的眼睛是黑色的，灰兔子的眼睛是灰色的，白兔子的眼睛红色的。因为兔子是夜行动物，所以它的眼睛能大量聚光，即使在微暗处也能看到东西。

![RabbitMomBabies.jpg](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/29237c86e29f41f6ada56603319669a1~tplv-k3u1fbpfcp-watermark.image?)

下面我们来做一个 svg 动效：一群在夜晚的兔子，眼睛发射着聚光，当鼠标悬停在 svg 元素上或通过键盘 Tab 键导航来聚焦到 svg 元素时时，将切换到白天正常的状态。

## 实现
1. 定义 SVG 容器，设置视口在用户空间中的位置为 0 0，尺寸为 500 500。
```svg
<svg viewBox="0 0 500 500" tabIndex="0">
</svg>
```
设置 tabindex="0"，表示 SVG 元素是可聚焦的，并且可以通过键盘 Tab 键导航来聚焦到该元素。

2. 定义一个公共（可重用）的 svg symbol 图形模板对象元素。
```svg
<symbol id="creature" viewBox="0 0 100 100">
</symbol>
```

3. 在 symbol 元素中定义兔子各个身体元素，并创建眼睛 `.eyes` CSS 类，设置 visibility 属性为 visible。
```svg
<g id="body">
  <!-- 右后腿 -->
  <path d="M80,85 C85,90 75,90 60,92S 60,85 67,83
           C50,70 60,60 65,60" transform="translate(-5,-1)" />
  <!-- 右前腿 -->
  <path id="limb" d="M33,80C28,85 28,95 24,94 S20,85 27,77" />
  <!-- 肚子 -->
  <ellipse cx="45" cy="65" rx="40" ry="20" />
  <!-- 左后腿 -->
  <path d="M30,45C70,30 85,50 90,70 C92.5,80 85,83 80,85
           C85,90 75,90 60,92S 60,85 67,83
           C50,70 60,60 65,60" />
  <!-- 左前腿 -->
  <use href="#limb" x="4" y="2" />
  <!-- 脑袋 -->
  <path d="M40,70C30,85 0,85 0,60 C0,50 5,45 10,40
           C0,30 0,0 5,0S20,25 20,35 Q22,34 25,35
           C25,25 30,-2 35,0 S38,28 35,38 C40,42 43,45 45,55" />
  <!-- 尾巴 -->
  <path d="M89,72c-2,-5 9,-7 8,-2 
           c1,3 -3,9 -5,7 c-1,3 -4,5 -5,-2" />
</g>
<!-- 脸 -->
<g id="face">
  <!-- 耳朵 -->
  <g fill="lightSalmon" fill-opacity="0.75">
    <ellipse ry="15" rx="4" transform="translate(10,21)rotate(-15)" />
    <ellipse ry="14" rx="3" transform="translate(32,21)rotate(10)" />
  </g>
  <!-- 鼻子 -->
  <path fill="coral" stroke="lightCoral" stroke-linejoin="round" d="M12,65L17,65 15,69 Q17,72 20,70 Q15,73 10,70 Q13,72 15,69Z" />
  <!-- 眼睛 -->
  <g class="eyes" fill="white">
    <!-- 眼圈 -->
    <g stroke="none">
      <ellipse ry="7" rx="5" cx="10" cy="55" />
      <ellipse ry="7" rx="5" cx="20" cy="55" />
    </g>
    <!-- 眼珠 -->
    <g fill="#222" stroke="#444" stroke-width="0.5">
      <ellipse ry="3" rx="2.5" cx="10" cy="58" />
      <ellipse ry="3" rx="2.5" cx="20" cy="58" />
    </g>
  </g>
</g>
```

4. 创建组合兔子元素对象的容器，并创建 `.dark` CSS 类，设置 visibility 属性为 hidden。通过 use 元素，根据 symbol 图形模板对象元素 id，创建多个不同颜色和尺寸的小兔子。
```svg
<g class="dark">
  <!-- 白色兔子 银色轮廓 -->
  <use href="#creature" stroke="silver" fill="white" width="80" height="80" x="300" y="20" />
  <!-- 粉色兔子 褐色轮廓 -->
  <use href="#creature" stroke="tan" fill="pink" width="100" height="100" x="50" y="20" />
  <!-- 巧克力色兔子 -->
  <use href="#creature" stroke="chocolate" fill="chocolate" width="100" height="100" x="400" y="100" />
  <!-- 黑色兔子 -->
  <use href="#creature" stroke="black" fill="black" width="120" height="120" x="200" y="120" />
  <!-- 白色兔子 -->
  <use href="#creature" stroke="white" fill="white" width="120" height="120" x="50" y="150" />
  <!-- 粉色兔子 -->
  <use href="#creature" stroke="pink" fill="pink" width="140" height="140" x="350" y="170" />
  <!-- 灰色兔子 -->
  <use href="#creature" stroke="gray" fill="gray" width="150" height="150" x="70" y="300" />
  <!-- 棕色兔子 -->
  <use href="#creature" stroke="saddlebrown" fill="saddlebrown" width="160" height="160" x="340" y="330" />
</g>
```

5. 设置默认样式：兔子元素不可见，但眼睛元素可见。svg 元素在光标悬停在元素上或通过键盘 Tab 键导航来聚焦到 svg 元素时设置 `.dark` 的 visibility 属性为 visible，切换兔子元素为可见。
```css
.dark {
  visibility: hidden;
}

.eyes {
  visibility: visible;
}

svg:hover .dark,
svg:focus .dark {
  visibility: visible;
}
```

## 完整代码+码上掘金

<iframe src="https://code.juejin.cn/pen/7188111289636356156"></iframe>