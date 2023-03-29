---
date: 16:11 2023/3/29
title: WebGL 介绍和基本使用
tags:
- WebGL
description: WebGL 只关心两件事：裁剪空间中的坐标值和颜色值，使用 WebGL 只需要给它提供这两个东西。
---
## 介绍
1. WebGL（Web Graphics Library）是 Web 上 3D 图形的新标准，专为渲染 2D 图形和交互式 3D 图形而设计，允许 Internet 浏览器访问使用它们的计算机上的图形处理单元（GPU）。这种绘图技术标准允许把 JavaScript 和 OpenGL ES 2.0 结合在一起，通过增加 OpenGL ES 2.0 的一个 JavaScript 绑定，WebGL 可以为 HTML5 `Canvas` 提供硬件 3D 加速渲染，这样 Web 开发人员就可以借助系统显卡来在浏览器里更流畅地展示 3D 场景和模型了，还能创建复杂的导航、数据视觉化和 3D 网页游戏等。
2. WebGL 完美地解决了现有的 Web 交互式三维动画的两个问题：第一，它通过 HTML 脚本本身实现 Web 交互式三维动画的制作，无需任何浏览器专用渲染插件支持；第二，它利用底层的图形硬件加速功能进行的图形渲染，是通过统一的、标准的、跨平台的 OpenGL 接口实现的。
3. WebGL 程序包括用 JavaScript 写的控制代码，以及在图形处理单元（GPU, Graphics Processing Unit）中执行的着色代码（shader code，OpenGL Shading Language(GLSL)，类似于 C 或 C++）组成。
4. 渲染流水线设计如下：**应用程序层 -> 硬件抽象层 -> 硬件层**。

    ![40b60cd50811e24d3a3c3bb518e06d87b65.webp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fd7624df11a1455fbf3a6f950a2de215~tplv-k3u1fbpfcp-watermark.image?)

> CPU：它的优点在于调度、管理、协调能力强，计算能力则位于其次，对同一数据做许多事。
> 
> GPU：相当于一个接受 CPU 调度的 **拥有大量计算能力** 的员工，对大量数据做同一样事，图形处理，矩阵运算，机器学习。

## 发展和支持情况
1. WebGL 由非营利 [Khronos Group](https://www.khronos.org/) 设计和维护。
2. WebGL 1.0（2011年3月）基于 OpenGL ES 2.0，并提供了 3D 图形的 API。它使用 HTML5 Canvas 并允许利用文档对象模型接口。WebGL 2.0（2017年1月）基于 OpenGL ES 3.0，确保了提供许多选择性的 WebGL 1.0 扩展，并引入新的 API。可利用部分 Javascript 实现垃圾回收。
3. 目前，WebGL在最新的浏览器中被广泛支持。然而，WebGL 是否可用还是取决于硬件设备等其他因素（比如 GPU 是否支持 WebGL）。WebGL官方网站提供了一个 [简单的测试页](https://get.webgl.org/)。而第三方网站提供了更详细的消息（如浏览器使用的渲染器以及可用的扩展），例如 [WebGL Report](https://webglreport.com/)、[WebGL Browser Report](https://browserleaks.com/webgl)。

![微信截图_20230309160002.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4e877fe38e9546e6ada2ac52a00902f2~tplv-k3u1fbpfcp-watermark.image?)

4. 游戏引擎 Babylon.js，3D 渲染引擎 three.js 封装了 WebGL，提供了各个平台之间的兼容性。使用这些框架而非原生的 WebGL 可以更容易地开发 3D 应用和游戏。

## 着色器

![56daf249b5d8b76dfb3ae68c8329fd61598.webp](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ae45879484ef4554b9c99198023c63b0~tplv-k3u1fbpfcp-watermark.image?)

WebGL 在电脑的 GPU 中运行，因此需要使用能够在 GPU 上运行的代码。着色器是在 GPU 上运行的小程序，使用 OpenGL ES 着色语言(GLSL) 编写，可以对每个顶点和每个像素进行个性化的处理以呈现出想要的效果。WebGL 可以通过着色器解析顶点和片段信息，并对它们进行处理和渲染，实现复杂的图形效果，比如光照、阴影、反射等。另外，着色器也能够更有效地处理大量的数据，提高渲染效率。

同时，由于 WebGL 着色器是基于 OpenGL ES 2.0 的，因此开发人员可以利用 OpenGL 社区的丰富资源和工具来加快开发过程。

### 顶点着色器（Vertex shader）
1. 每次渲染一个形状时，顶点着色器会在形状中的每个顶点运行。它的工作是将输入顶点从原始坐标系转换到 WebGL 使用的裁剪空间坐标系，其中每个轴的坐标范围从 -1.0 到 1.0。
2. 根据计算出的一系列顶点位置，WebGL 可以对点、线和三角形在内的一些图元进行光栅化处理。当对这些图元进行光栅化处理时需要使用片段着色器方法。
```
attribute vec4 a_position;
void main () {
  gl_Position = a_position;
}
```
- 使用 `attribute` 存储限定符声明了一个全局 `vec4` 类型的全局变量。三种类型存储限定符：
    - attribute: 只能出现在顶点着色器中，表示从外部传入 WEBGL 的顶点属性，是 WebGL 外部顶点信息传入 WebGL 内部的桥梁变量。
    - uniform: 可以出现在顶点着色器和片元着色器中，表示统一的值。
    - varying:（光栅化阶段）可以出现在顶点着色器和片元着色器中，表示变化的值，是顶点着色器和片元着色器之间的连接桥梁。

- `vec4` 类型是 4 维向量类型，用于表示顶点的坐标信息。在 WebGL 中是采用的齐次坐标表示的坐标信息，我们用这样的形式 `(x, y, z, w)` 来表示一个坐标的位置，可以将它等同于这样的一个三维坐标 `(x / w, y / w, z / w)`。
- `void main` 表示顶点着色器的 `main` 函数，类似于 C 语言的 `main` 函数，它是顶点着色器中的唯一入口函数。
- `gl_Position` 是顶点着色器中的内置变量，它就表示了当前顶点的实际位置，所以我们需要将从外界接收信息的 `a_position` 的值赋给 `gl_Position` 这个变量。

### 片段着色器（Fragment shader）
1. 片段着色器的作用是计算出当前绘制图元中每个像素的颜色值，使其显示在屏幕上。
2. 片段着色器在顶点着色器处理完图形的顶点后，会被要绘制的每个图形的每个像素点调用一次。它的职责是确定像素的颜色，通过指定应用到像素的纹理元素（也就是图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色。之后颜色存储在特殊变量 `gl_FragColor` 中，返回到 WebGL 层。该颜色将最终绘制到屏幕上图形对应像素的对应位置。
```
precision mediump float;
void main () {
  highp vec4 color = vec4(1.0, 0.4, 0.0, 1.0);
  gl_FragColor = color;
}
```
- 全局声明了片元着色器中浮点数类型的精度。
- `main` 函数，与顶点着色中的含义相同。
- 声明了一个 `vec4` 类型的局部变量 `color`，并且指定了精度为高精度。
- 将 `color` 的值赋给 WebGL 的内置变量 `gl_FragColor`，`gl_FragColor` 表示的就是当前片元的颜色值。

### 使用方式
1. 往着色器中传递顶点数据需要使用 `WebGLBuffer` 对象。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e502bbfb0cc04ad2bdc7353cd31c95e6~tplv-k3u1fbpfcp-watermark.image?)

```js
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, colorBufferData, gl.STATIC_DRAW);
```
数据流程图如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22fcd846ef414dea879059ad223fa6c1~tplv-k3u1fbpfcp-watermark.image?)

- `ARRAY_BUFFER` 是 `gl` 上下文对象中的一个属性，在其中起到了一个桥梁的作用。
- 通过 `gl.bindBuffer` 方法将 `ARRAY_BUFFER` 与我们创建的 `WebGLBuffer` 绑定在一起。
- 然后再通过 `gl.bufferData` 方法将真正要传入的数据传递给 `ARRAY_BUFFER`，最终数据流向了 `WebGLBuffer`。
- `WebGLBuffer` 中已经有了数据后，还需要将着色器中的 `a_position` 与这个 `buffer` 建立联系。所以我们还需要通过下面这两个 API 建立着色器中变量与 `WebGLBuffer` 的联系。
    - `gl.enableVertexAttribArray`：所绑定的 `WebGLBuffer` 要与着色器中的哪个变量建立联系。
    - `gl.vertexAttribPointer`：如何去读取存在 `WebGLBuffer` 中的数据。

2. 往着色器中传递纹理数据需要使用 `WebGLTexture` 对象。
- 在计算机图形学中是把存储在内存里的位图包裹到3D渲染物体的表面。
- `<img>`、`<video>`、`<canvas>` 标签，或者是 `ImageBitmap` 对象，甚至是 `TypedArray` 都可以作为纹理。
- 如同图像是由像素排列而成，纹理是由纹素排列表示的，最后显示在屏幕上的像素是从纹理的纹素中计算的。
- 传入纹理数据的流程其实和传入顶点数据的流程差不多，如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ed480e9743f4b4bb8512a0a55e52b56~tplv-k3u1fbpfcp-watermark.image?)

数据流程图如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b54086e46d52479780fcf845cd57587c~tplv-k3u1fbpfcp-watermark.image?)

- 同样是有一个中间的对象 `TEXTURE_2D` 作为桥梁来传递纹理数据，略有不同的是在创建纹理对象之后，会有一个设置纹理裁剪参数的过程。
- 比如一张图片的实际大小是 `100 x 100` 大小的，提供的纹理坐标是 `(0.1, 0.2)`。那么得到的颜色就是图片实际坐标第 `(10, 20)` 个像素的颜色。

3. 往着色器中传递 `uniform` 类型的数据直接使用 WebGL 提供的 API 即可（例如 `uniformMatrix4fv`），而不需要额外的对象作为媒介。例如：
- `gl.uniform1f`，表示传递 1 个浮点数。
- `gl.uniform1fv`, 表示传递一个 1 维的浮点数向量。
- `gl.uniform2f`，表示传递 2 个浮点数。
- `gl.uniform2fv`, 表示传递一个 2 维的浮点数向量。
- `gl.uniformMatrix4fv`，表示向着色器中传递 4x4 矩阵类型的 `uniform` 变量

## 如何使用 WebGL
1. WebGL 只关心两件事：裁剪空间中的坐标值和颜色值，使用 WebGL 只需要给它提供这两个东西。
2. 需要提供两个着色器来做这两件事，一个顶点着色器提供裁剪空间坐标值，一个片段着色器提供颜色值。
3. WebGL 应用程序代码是 JavaScript 和 OpenGL 着色语言的组合。

![1-1512160H41Ia.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/221e94d6625a4b5f96d7759bb96ed004~tplv-k3u1fbpfcp-watermark.image?)

- JavaScript 与 CPU 进行沟通。
- OpenGL 着色语言（GLSL），与 GPU 通信。

4. 使用 JavaScript 编写以下操作的代码：
- 初始化 WebGL − 用于初始化 WebGL 的上下文。
- 创建数组 − 创建数组来保存几何数据。
- 缓冲区对象 − 通过将数组作为参数来创建缓冲区对象（顶点和索引）。
- 着色器 − 创建，编译和连接着色器。
- 属性 − 创建属性，启用它们并与缓冲区对象关联。
- 全局变量 − 创建全局变量。
- 变换矩阵 − 创建变换矩阵。

5. 使用 OpenGL 着色语言（GLSL）编写着色器。

### Hello GLSL
这个 WebGL 示例演示了如何通过使用顶点属性将用户输入发送到着色器来结合着色器编程和用户交互。
1. 为了使用 WebGL，首先需要一个 `canvas` 元素。
```html
<canvas style="background: black;">Your browser does not seem to support HTML canvas.</canvas>
```
2. 获取 `canvas` 元素和 WebGL 上下文，设置视口，清除画布颜色。
```js
const canvas = document.querySelector("canvas");
canvas.width = canvas.clientWidth;
canvas.height = canvas.clientHeight;
const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
if (!gl) {
  const paragraph = document.querySelector("p");
  paragraph.textContent = "Failed. Your browser or device may not support WebGL.";
  return null;
}
gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
```
3. 编写顶点着色器和片段着色器程序，编译它们，通过连接这两个程序将创建一个合并程序。
```html
<script type="x-shader/x-vertex" id="vertex-shader">
  #version 100
  precision highp float;

  attribute float position;

  void main() {
    gl_Position = vec4(position, 0.0, 0.0, 1.0);
    gl_PointSize = 64.0;
  }
</script>
<script type="x-shader/x-fragment" id="fragment-shader">
  #version 100
  precision mediump float;
  void main() {
    gl_FragColor = vec4(0.18, 0.54, 0.34, 1.0);
  }
</script>
```
```js
let source = document.querySelector("#vertex-shader").innerHTML;
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, source);
gl.compileShader(vertexShader);
source = document.querySelector("#fragment-shader").innerHTML;
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, source);
gl.compileShader(fragmentShader);
program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
```
4. 打开属性数组列表中指定索引处（`0`）的通用顶点属性数组。创建一个用于储存顶点数据或着色数据的缓冲区对象，将其绑定到包含顶点属性（顶点坐标，纹理坐标数据或顶点颜色数据）的 `gl.ARRAY_BUFFER`，指定缓冲区绑定目标 `gl.ARRAY_BUFFER` 和将被复制到缓冲区的数据存储区（`new Float32Array([0.0])`），指定数据存储区的使用方法 `gl.STATIC_DRAW`，绑定当前缓冲区范围到 `gl.ARRAY_BUFFER`。
```js
gl.enableVertexAttribArray(0);
buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.0]), gl.STATIC_DRAW);
gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);
```
5. 使用着色器程序。
```js
gl.useProgram(program);
```
6. 从向量数组中绘制对象。
```js
gl.drawArrays(gl.POINTS, 0, 1);
```
7. 绑定 DOM 事件。
```js
document.querySelector("canvas").addEventListener("click", (evt) => {
  const clickXRelativeToCanvas = evt.pageX - evt.target.offsetLeft;
  const clickXinWebGLCoords = 2.0 * (clickXRelativeToCanvas - gl.drawingBufferWidth / 2) / gl.drawingBufferWidth;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([clickXinWebGLCoords]), gl.STATIC_DRAW, );
  gl.drawArrays(gl.POINTS, 0, 1);
}, false);
```
<iframe src="https://code.juejin.cn/pen/7208892805996314661"></iframe>