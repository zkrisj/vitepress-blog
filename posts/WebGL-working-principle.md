---
date: 16:18 2023/3/29
title: WebGL 工作原理
tags:
- WebGL
description: GLSL 不同于 JavaScript，它是强类型语言（不可以隐式的转换类型或直接转型），并且内置很多数学公式用于计算向量和矩阵。
---
## 介绍
WebGL 是一种基于 Web 的图形渲染技术，它允许在浏览器中使用 JavaScript 和 OpenGL ES API 创建 3D 和 2D 图形，而无需插件或其他软件。

通过 WebGL，开发人员可以使用 GPU 加速来实现更高效的图形渲染，从而提供更流畅、更快速的用户体验。WebGL 还支持与其他 Web 技术（如 HTML、CSS 和 JavaScript）的集成，使其成为创建交互式 Web 应用程序和游戏的强大工具。

它的发展经历了以下几个阶段：
1. WebGL 1.0：2011 年发布，提供了基本的 3D 渲染功能，但受到硬件和驱动支持的限制。
2. WebGL 2.0：2017 年发布，增加了更多的特性和扩展，如多重渲染目标、几何着色器等，提升了渲染效率和灵活性。
3. WebGL Next：正在开发中，旨在进一步提升 WebGL 的性能和功能，包括更好的异步编程模型、更低的延迟、更高的帧率等。

## GLSL
GLSL - OpenGL Shading Language 也称作 GLslang，是一个以 C 语言为基础的高阶着色语言，是一种类似于 C 语言的编程语言，用于描述 GPU 中的计算流程和数据处理，GLSL **直接由图形管道执行**。OpenGL ARB 在 OpenGL 2.0 核心中正式纳入 GLSL。

GLSL 不同于 JavaScript，它是强类型语言（不可以隐式的转换类型或直接转型），并且内置很多数学公式用于计算向量和矩阵。

### 数据类型
GLSL 语言规格定义了 22 个基本数据类型，有些用法与 C 相同，其它的是绘图处理器特有的。
- void – 用于没有返回值的函数。
- float：表示单精度浮点数，通常用于表示坐标、颜色等数值。
- vec2、vec3、vec4：表示 2、3、4 个浮点数的向量，由于 WebGL 是一个基于向量的 API，因此很常用，通常用于表示坐标、颜色等向量值。
- mat2、mat3、mat4：表示 2x2、3x3、4x4 矩阵，通常用于表示变换矩阵。
- int、ivec2、ivec3、ivec4：表示整数或整数向量。
- bool、bvec2、bvec3、bvec4：表示布尔值或布尔向量。
- sampler2D、samplerCube：表示 2D 纹理和 3D 纹理，用于从纹理中获取颜色值。

### 函数和控制结构
1. 类似于 C 语言，GLSL 支持循环和分支，包括 if、else、if/else、for、do-while、break、continue 等。

2. 支持使用者定义函式，且各种常用的函式也已内建。这也就让绘图卡制造商，能够在硬件层次上最佳化这些内建的函式。许多函式与 C 语言相同，如 `exp()` 以及 `abs()`，其它绘图编程特有的，如 `smoothstep()` 以及 `texture2D()`。

### 数据存储类型
GLSL 为着色器提供了三种不同作用的数据存储方式，用来处理着色器（shader）的输入和输出。
1. `attribute`：用于在顶点着色器中传递顶点数据。`attribute` 变量仅仅在顶点着色器中被声明，它的值被插值后传递到片段着色器中。在 WebGL 中，`attribute` 变量可以从缓冲区中读取数据，并把它传递到一个顶点着色器中。

2. `varying`：定义的变量用于在顶点着色器和片段着色器之间传递数据，在顶点着色器中定义，然后在片段着色器中使用。`varying` 变量是根据传递给片段着色器的屏幕像素位置差值计算出的。
3. `uniform`：用于在着色器程序中传递全局数据，在着色器程序中的所有着色器中都可以访问。`uniform` 变量的值不会随着顶点的变化而变化，并且必须使用 JavaScript 代码来更新 `uniform` 变量的值。例如，视图矩阵、投影矩阵、转换矩阵、光源信息等可以使用 `uniform` 变量传递到着色器程序中。

简单地说，`attribute`、`varying` 和 `uniform` 是 WebGL 中的三种不同的变量类型，它们分别用于传递顶点数据、在着色器程序中传递数据和传递全局状态信息。每种数据依作用不同可以被一种或者全部着色器访问（取决于数据存储类型），也可通过 Javascript 代码进行访问。

### 基本图形
1. 在 WebGL 中，只有三种基本图形：**点、线、三角形**，所有的复杂的图形都是由点、线、三角形这三类基本图形所产生。
2. 通过 `gl.drawArray(mode, first, count)` 这个 API 绘制基本图形，其中 `mode` 参数就是绘制的基本图形类型，具体的方式如下图所示：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dccc29d7c4554b88b49c02ca9bb15f79~tplv-k3u1fbpfcp-watermark.image?)
![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ff8f551f807f4f1bbb198904e8b9aa57~tplv-k3u1fbpfcp-watermark.image?)

### 坐标系统
1. HTML 的 2D 坐标表示中如左下图所示，webgl 的 2D 坐标如右下图所示。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5d5723505dc743feaf0a4b2cbeb62aff~tplv-k3u1fbpfcp-watermark.image?)

2. 如果我们要把 HTML 中的坐标转换为 webgl 的坐标，需要使用裁剪矩阵来做坐标的转换。
3. 就像其他的 3D 坐标，Z 轴表示深度，正值表示屏幕里，负值表示屏幕外。
4. WebGL 的坐标被限制为 (-1,-1,-1)~(1,1,1)。

### 着色器（Shader）
1. 着色器是一段运行在 GPU 上的程序，它可以根据顶点坐标、法向量、纹理等信息来计算出每个像素的颜色值，实现光照、纹理、网格和其他图形效果。WebGL 使用着色器来处理 3D 场景中的图元，包括点、线、三角形等。
2. WebGL 着色器使用 GLSL 编写。顶点着色器负责将顶点数据转换为 WebGL 中理解的格式，而片段着色器则负责对每个像素执行颜色计算，以实现最终的渲染效果。一个顶点着色器和一个片段着色器链接在一起放入一个着色程序（或者只叫程序）中，一个 WebGL 应用可以有多个着色程序。
- 顶点着色器的目的是设置 `gl_Position` 变量——这是一个特殊的、全局的、内置的 GLSL 变量，用于存储当前顶点的位置，每个顶点调用一次。
```
void main(void) {
  gl_Position = ftransform();
}
```
- 片段着色器的目的是设置变量 `gl_FragColor` 变量——也是一个特殊的、全局的、内置的 GLSL 变量，用于指定片元（像素）的颜色值，单个片段着色器被每个像素调用一次。
```
void main(void) {
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
```
3. 使用着色器步骤：

    1. 创建着色器程序：
    
        通过调用 WebGL 上下文的 `createShader()` 方法创建顶点着色器和片元着色器，并使用 WebGL 上下文的 `createProgram()` 方法创建着色器程序。使用 GLSL 编写顶点着色器和片元着色器的代码，并将代码存储到创建的着色器对象中。
    2. 绑定数据源：
    
        将顶点数据绑定到顶点着色器，或将纹理数据绑定到片元着色器。在顶点着色器中，数据源可能包括顶点位置、纹理坐标和法向量等。在片段着色器中，数据源可能包括颜色、纹理像素等。
    3. 编译着色器：
    
        与通常在 CPU 上执行的 JavaScript 代码不同，WebGL 着色器需要编译，因为在 WebGL 中，着色器是用 GLSL 语言编写的。编译过程将 GLSL 代码转换为 GPU 可以运行的机器代码，以便能够在 WebGL 中使用。这个过程包括语法分析，语义分析和代码生成。如果着色器代码存在错误，则编译过程将失败并产生错误信息，从而帮助开发者找到和修复代码中的问题。
    4. 绑定着色器：
    
        WebGL 支持同时使用多个着色器程序，因此需要指定当前使用的着色器程序。例如，如果需要在同一个渲染管线中使用不同的顶点着色器或片段着色器，需要在需要的时候切换绑定到不同的着色器。
    5. 链接着色器程序：
    
        通过调用 WebGL 上下文的 `attachShader()` 和 `linkProgram()` 方法将顶点着色器和片元着色器关联到着色器程序中。
    6. 使用着色器程序：
    
        在绘制图形时，通过调用 WebGL 上下文的 `useProgram()` 方法来激活着色器程序，并通过 `uniform` 变量将数据传递给着色器程序。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ee445c5b0260431fbb3189bdf5feb52c~tplv-k3u1fbpfcp-watermark.image?)

#### 与其他对象结合使用
着色器程序可以与缓冲对象和纹理对象等其他 WebGL 元素进行结合使用，从而实现更加复杂的渲染效果，例如反射、折射、阴影等。
1. 使用缓冲对象：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e502bbfb0cc04ad2bdc7353cd31c95e6~tplv-k3u1fbpfcp-watermark.image?)

在着色器程序中，通过使用 `attribute` 变量来接收缓冲对象中的顶点数据。通过调用 WebGL 上下文的 `bindBuffer()` 方法将缓冲对象绑定到 `GL_ARRAY_BUFFER` 类型上，并使用 WebGL 上下文的 `bufferData()` 方法将顶点数据存储到缓冲对象中。然后，在绘制图形时，通过调用 WebGL 上下文的 `drawArrays()` 或 `drawElements()` 方法来使用缓冲对象中的数据。

数据流程图如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22fcd846ef414dea879059ad223fa6c1~tplv-k3u1fbpfcp-watermark.image?)

2. 使用纹理对象：

传入纹理数据的流程其实和传入顶点数据的流程差不多，如下图所示：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2ed480e9743f4b4bb8512a0a55e52b56~tplv-k3u1fbpfcp-watermark.image?)

在着色器程序中，通过使用 `uniform` 变量来接收纹理对象中的像素数据。通过调用 WebGL 上下文的 `createTexture()` 方法创建纹理对象，并使用 WebGL 上下文的 `texImage2D()` 方法将像素数据存储到纹理对象中。然后，通过调用 WebGL 上下文的 `bindTexture()` 方法将纹理对象绑定到 `GL_TEXTURE_2D` 类型上，并使用 `glUniform1i()` 方法将纹理对象的位置传递给着色器程序。最后，在片元着色器中，通过调用` texture2D()` 函数来计算纹理坐标对应的像素颜色值。

数据流程图如下：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b54086e46d52479780fcf845cd57587c~tplv-k3u1fbpfcp-watermark.image?)

3. 使用帧缓冲对象：

    在着色器程序中，通过调用 WebGL 上下文的 `createFramebuffer()` 方法创建帧缓冲对象，并使用 WebGL 上下文的 `bindFramebuffer() `方法将帧缓冲对象绑定到 `GL_FRAMEBUFFER` 类型上。然后，通过调用 WebGL 上下文的 `attachTexture()` 或 `attachRenderbuffer()` 方法将纹理对象或渲染缓冲对象附加到帧缓冲对象上。最后，在绘制图形时，通过调用 WebGL 上下文的 `drawArrays()` 或 `drawElements()` 方法将帧缓冲对象中的像素数据渲染到屏幕上。

4. 往着色器中传递 `uniform` 类型的数据直接使用 WebGL 提供的 API 即可，而不需要额外的对象作为媒介。例如：
    - `gl.uniform1f`，表示传递 1 个浮点数。
    - `gl.uniform1fv`, 表示传递一个 1 维的浮点数向量。
    - `gl.uniform2f`，表示传递 2 个浮点数。
    - `gl.uniform2fv`, 表示传递一个 2 维的浮点数向量。

### 缓冲对象（WebGLBuffer）
1. 在 WebGL 中，顶点数据包括顶点坐标、颜色、法向量等信息，而索引数据用于指定顶点之间的连接关系，以便构建三角形网格。

2. 缓冲区对象是 WebGL 系统中的一块内存区域，可以通过缓冲对象在 GPU 内存中存储大量的顶点和索引数据，来对数据进行排序、过滤、转换等操作，很方便地管理顶点和索引数据：一次性可以处理很多个顶点，充分发挥 GPU 并行渲染的能力，从而减少与 CPU 之间的数据传输，提高渲染效率
3. WebGL 提供了两种类型的缓冲对象：
    1. 顶点缓冲对象（Vertex Buffer Object，VBO）：用于存储顶点数据，包括顶点坐标、颜色、法向量等信息。
    
    2. 索引缓冲对象（Index Buffer Object，IBO）：用于存储索引数据，指定顶点之间的连接关系，以便构建三角形网格。

#### 创建和管理
WebGL 缓冲对象可以在 WebGL 上下文中创建和管理。
1. 创建缓冲对象：调用 WebGL 上下文的 `createBuffer()` 方法创建一个新的缓冲对象。
2. 绑定缓冲对象：

    通过调用 WebGL 上下文的 `bindBuffer()` 方法将缓冲对象绑定到指定的缓冲区类型上，例如 `GL_ARRAY_BUFFER` 或 `GL_ELEMENT_ARRAY_BUFFER`。
3. 存储数据：通过调用 WebGL 上下文的 `bufferData()` 方法将数据存储到缓冲对象中。
4. 使用缓冲对象：在绘制图形时，通过调用 WebGL 上下文的 `drawArrays()` 或 `drawElements()` 方法使用缓冲对象中的数据。

#### 帧缓冲对象
帧缓冲对象（Framebuffer Object，FBO）是一个渲染目标，它包含了多个附加点（Attachment Point），每个附加点都可以绑定一个纹理或渲染缓冲区，用于渲染操作、存储渲染结果。

WebGL 缓冲对象和帧缓冲对象是两个不同的概念：
1. 缓冲对象存储的数据类型可以是顶点坐标、法线、纹理坐标等，而帧缓冲对象存储的数据类型必须是颜色或深度值。
2. 缓冲对象用于存储图形数据，例如顶点数据、颜色数据、法线数据等，而帧缓冲对象用于渲染到纹理或渲染缓冲区，实现高级的图形特效，例如反射、折射、阴影等。
3. 缓冲对象的数据可以被用于多次绘制，而帧缓冲对象的数据只能被用于一次绘制。

### 纹理（Texture）
1. 纹理是用于三维空间的二维图像，使物体看起来更好、更逼真。纹理是由称为纹素的单个纹理元素组合而成的，就像图片元素由像素组合而成一样。在渲染管道的片段处理阶段将纹理应用到物体上，允许我们在必要时通过包裹和过滤来调整它。

2. 纹理可以是数字图像，如 PNG 或 JPG 文件，可以是二进制数据，也可以是从 HTML5 画布或视频元素提取的像素数据。
3. 纹理数据可以通过各种方式加载，例如从图像文件加载、从 `HTMLCanvasElement` 对象中生成等，纹理数据通常被存储在 GPU 内存中，以提高渲染性能。

### 法线向量（normal vector）
1. 法线向量是一种描述 3D 对象表面朝向的矢量，在渲染三维图形时，每个顶点通常都有一个法线向量。

2. 法线向量可以用于计算光照和阴影效果。例如，可以使用法线向量来计算表面的漫反射光照效果，从而实现物体表面的阴影效果。
3. 在计算光照效果时，需要将法线向量与光源的方向向量进行计算，以确定光线的入射角度和表面的反射情况。

### 测试（Testing）
测试用于决定是否绘制图形中的特定像素，是 WebGL 实现高级图形效果的核心要素之一。深度测试和模板测试可以用于实现许多不同的视觉效果，包括阴影、反射和折射等。测试过程中会丢弃掉部分无用的片元内容，然后生成可绘制的二维图像绘制并显示。
1. 深度测试（Depth Testing）就是对 `z` 轴的值做测试，值比较小的片元内容会覆盖值比较大的（类似于近处的物体会遮挡远处物体）。

2. 模板测试（Stencil Testing）可以理解为镜像观察，模拟观察者的观察行为，即标记所有镜像中出现的片元，最后只绘制有标记的内容。模板缓存存储了每个像素的模板值，开发人员可以将模板值与特定值进行比较，以决定哪些像素应该被绘制，哪些不应该被绘制。

### 光栅化（Rasterization）
在 WebGL 中，光栅是指将 3D 场景中的三角形转成 2D 像素的过程，而光栅化是指在这个过程中对每个像素进行颜色计算和屏幕位置分配的过程。通过图元装配生成的多边形，计算像素并填充，剔除不可见的部分，剪裁掉不在可视范围内的部分，最终生成可见的带有颜色数据的图形并绘制。

光栅化是渲染管线中的一个阶段，它将 3D 场景中的几何体转换为 2D 图像。在光栅化阶段，WebGL 将 3D 几何体的顶点转换为屏幕上的像素，以便在屏幕上呈现 3D 图形。此过程包括剪裁、投影、光栅化和深度测试等步骤。在光栅化过程中，WebGL 还会对像素进行深度测试，以确定哪些像素应该显示在屏幕上，哪些像素应该被遮挡。这个过程是通过使用光栅化器（Rasterizer）来实现的。

光栅化流程图解：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1da17e3732fc49899255d0480b85d7ba~tplv-k3u1fbpfcp-watermark.image?)

### 渲染管线
1. 要渲染 3D 图形，我们必须遵循一系列步骤。这些步骤被称为图形管线或渲染管线。
2. 渲染管线的流程中总是将上一步的结果作为下一步的输入，就像水管一样接起来，管线的名字也因此得来。
3. 下图简要的展示了渲染管线的一个流程：

![1-1512160G942319.jpg](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d508b39591b84eb08d0712fe9bcdde15~tplv-k3u1fbpfcp-watermark.image?)

![c1e8c04c034d8eef1e9f4cda6838bd95.webp](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bdb6253ba98a4f778670749c21d66731~tplv-k3u1fbpfcp-watermark.image?)

- 顶点着色器（可编程）：首先通过顶点着色器，确定我们设置的顶点位置。
- 图元装配：`gl.drawArray` 方法会指定图元装配的方式（点、线、三角形），根据我们设定的装配方式将其组装成我们想要的基本图形。
- 光栅化：实际上就是一个将上一步装配好的图形用像素来表示的过程。
- 片元着色器（可编程）：光栅化完成后，每个像素的片元都会执行片元着色器中的程序，得到最后的颜色值。
- 测试与混合：这一阶段主要是 WebGL 内部进行了一些模版测试、深度测试，最后再与上一帧的数据进行混合。

4. 小结：WebGL 绘制图形的方式不是命令式的，而是 **连接式** 的，通过 `WebGLRenderingContext` 这个上下文将外部的变量与 GPU 内部的着色器程序发生联系。渲染管线就可以通过着色器运行出我们想要的结果，需要掌握的重难点就在于如何向 WebGL 中传入各种类型的数据。

## 矩阵（Matrix）
矩阵可以用于表示空间中的对象的变换，并且是 Web 页面可视化的重要工具。矩阵是许多不同技术使用的核心概念，包括 WebGL、WebXR（VR 和 AR）API 和 GLSL 着色器。

矩阵之所以重要，是因为它可以用少量的数字描述大量的空间中的变换，并且能轻易地在程序间共享。矩阵可以不同的坐标空间，甚至一些矩阵乘法可以将一组数据从一个坐标空间映射到另一个坐标空间。矩阵能够高效率地保存生成它们的每一步变换。

对于在 WebGL 中使用，显卡尤其擅长大量的点乘矩阵运算。各种各样的运算，如点定位、光线运算、动态角色，都依赖这个基础工具。

### 三维变换矩阵
这种矩阵由一个 4x4 方阵，共 16 个值组成。在 JavaScript 中，可以很方便的用数组表示矩阵。比如典型的单位矩阵：单位阵乘上一个点或者矩阵，其结果保持不变。
```js
const identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];
```
由于 3D 点只需要三个值（`x`、`y`、和 `z`），而变换矩阵是一个 4×4 值矩阵，为此我们加上了额外的第四维，这个维度称为**透视**，用字母表示 `w`。一般来说，把 `w` 设为 1 就可以了。

注意矩阵和点的对齐方式：
```js
[1, 0, 0, 0,
 0, 1, 0, 0,
 0, 0, 1, 0,
 0, 0, 0, 1]

[4, 3, 2, 1] // Point at [x, y, z, w]
```

下面定义了一个函数 `multiplyMatrixAndPoint()` 来乘以一个矩阵和一个点：
```js
function multiplyMatrixAndPoint(matrix, point) {

  // 给矩阵的每一部分一个简单的变量名，列数（c）与行数（r）
  let c0r0 = matrix[ 0], c1r0 = matrix[ 1], c2r0 = matrix[ 2], c3r0 = matrix[ 3];
  let c0r1 = matrix[ 4], c1r1 = matrix[ 5], c2r1 = matrix[ 6], c3r1 = matrix[ 7];
  let c0r2 = matrix[ 8], c1r2 = matrix[ 9], c2r2 = matrix[10], c3r2 = matrix[11];
  let c0r3 = matrix[12], c1r3 = matrix[13], c2r3 = matrix[14], c3r3 = matrix[15];

  // 定义点坐标
  let x = point[0];
  let y = point[1];
  let z = point[2];
  let w = point[3];

  // 点坐标和第一列对应相乘，再求和
  let resultX = (x * c0r0) + (y * c0r1) + (z * c0r2) + (w * c0r3);

  // 点坐标和第二列对应相乘，再求和
  let resultY = (x * c1r0) + (y * c1r1) + (z * c1r2) + (w * c1r3);

  // 点坐标和第三列对应相乘，再求和
  let resultZ = (x * c2r0) + (y * c2r1) + (z * c2r2) + (w * c2r3);

  // 点坐标和第四列对应相乘，再求和
  let resultW = (x * c3r0) + (y * c3r1) + (z * c3r2) + (w * c3r3);

  return [resultX, resultY, resultZ, resultW]
}
```
现在使用上面的函数，我们可以将一个点乘以矩阵。使用单位矩阵它应该返回一个与原始点相同的点，因为一个点（或任何其他矩阵）乘以单位矩阵总是等于它自己：
```js
// identityResult 等于 [4,3,2,1]
let identityResult = multiplyMatrixAndPoint(identityMatrix, [4,3,2,1]);
```
除了把矩阵和点相乘，你也可以把两个矩阵相乘。之前的函数可以帮助我们简化这个过程：
```js
function multiplyMatrices(matrixA, matrixB) {

  // 将第二个矩阵按列切片
  let column0 = [matrixB[0], matrixB[4], matrixB[8], matrixB[12]];
  let column1 = [matrixB[1], matrixB[5], matrixB[9], matrixB[13]];
  let column2 = [matrixB[2], matrixB[6], matrixB[10], matrixB[14]];
  let column3 = [matrixB[3], matrixB[7], matrixB[11], matrixB[15]];

  // 将每列分别和矩阵相乘
  let result0 = multiplyMatrixAndPoint( matrixA, column0 );
  let result1 = multiplyMatrixAndPoint( matrixA, column1 );
  let result2 = multiplyMatrixAndPoint( matrixA, column2 );
  let result3 = multiplyMatrixAndPoint( matrixA, column3 );

  // 把结果重新组合成矩阵
  return [
    result0[0], result1[0], result2[0], result3[0],
    result0[1], result1[1], result2[1], result3[1],
    result0[2], result1[2], result2[2], result3[2],
    result0[3], result1[3], result2[3], result3[3]
  ]
}

let someMatrix = [
  4, 0, 0, 0,
  0, 3, 0, 0,
  0, 0, 5, 0,
  4, 8, 4, 1
]
let identityMatrix = [
  1, 0, 0, 0,
  0, 1, 0, 0,
  0, 0, 1, 0,
  0, 0, 0, 1
];
// 返回 someMatrix 的数组表示
let someMatrixResult = multiplyMatrices(identityMatrix, someMatrix);
```
这些函数新建了大量数组，可能在实时运算时导致垃圾回收的巨大开销。在实际产品中最好使用优化过的函数。比如 [glMatrix](https://glmatrix.net/) 就是一个注重速度和性能的库，它的核心是在更新循环之前分配目标数组。

### 平移矩阵
平移矩阵基于单位矩阵，它将一个对象沿 x，y，z 其中一个方向进行移动。最简单的想象平移的方式是设想拿起一个咖啡杯，咖啡杯必须保持直立和朝向相同以免咖啡洒出来。

你不能仅仅使用平移矩阵来喝咖啡，因为要喝咖啡，你必须能够倾斜或旋转杯子以将咖啡倒进嘴里。用来执行此操作的矩阵类型称为旋转矩阵。
```js
let x = 50;
let y = 100;
let z = 0;
// 将沿三个轴的距离放在平移矩阵的相应位置，然后乘以需要在三维空间中移动的点或矩阵
let translationMatrix = [
    1,    0,    0,   0,
    0,    1,    0,   0,
    0,    0,    1,   0,
    x,    y,    z,   1
];
```

### 缩放矩阵
缩放矩阵使对象的高度、宽度和深度三个维度的其中之一变大或变小。在典型（笛卡尔）坐标系中，这将使得 x，y，z 坐标拉伸或收缩。
```js
let w = 1.5; // width  (x)
let h = 0.7; // height (y)
let d = 1; // depth  (z)

let scaleMatrix = [
    w,    0,    0,   0,
    0,    h,    0,   0,
    0,    0,    d,   0,
    0,    0,    0,   1
];
```
应用于每个宽度、高度和深度的变化量从左上角开始，以对角线的方式向右下角移动。

### 旋转矩阵
旋转矩阵比平移和缩放矩阵要稍复杂一些，其中用到了三角函数来完成旋转。
```js
// 不借助矩阵将点绕原点旋转
let point = [10,2];

// 计算到原点的距离
let distance = Math.sqrt(point[0] * point[0] + point[1] * point[1]);

// 60 度
let rotationInRadians = Math.PI / 3;

let transformedPoint = [
  Math.cos( rotationInRadians ) * distance,
  Math.sin( rotationInRadians ) * distance
];
```
可以将上述步骤表示为一个矩阵，并且单独应用到 x，y，和 z 坐标。下面是绕 z 轴旋转的表示：
```js
let sin = Math.sin;
let cos = Math.cos;

let a = Math.PI * 0.3; // 转角

// 绕 Z 轴旋转，由于变换中没有透视，所以此时的旋转只会出现缩小 div
let rotateZMatrix = [
  cos(a), -sin(a),    0,    0,
  sin(a),  cos(a),    0,    0,
       0,       0,    1,    0,
       0,       0,    0,    1
];
```

### 使用矩阵
使用矩阵的一个简单方法是使用 CSS3 里的 `matrix3d` 变换。首先，创建一个 `<div>` 并加上一些内容。
```html
<div id='move-me' class='transformable'>
  <h2>Move me with a matrix</h2>
  <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit...</p>
</div>
```
然后，创建一个 4×4 矩阵，要注意的是，即使矩阵由 4 行和 4 列组成，它也会折叠成一行 16 个值，因为在 JavaScript 中，矩阵总是存储在一维列表中。将其传入 `matrix3d` 变换以更新 `<div>` 的样式。
```js
// 从矩阵数组创建 matrix3d 样式属性
function matrixArrayToCssMatrix(array) {
  return "matrix3d(" + array.join(',') + ")";
}

// 获取 DOM 元素
let moveMe = document.getElementById('move-me');

// 返回结果如："matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 50, 100, 0, 1);"
let matrix3dRule = matrixArrayToCssMatrix( translationMatrix );

// 设置变换
moveMe.style.transform = matrix3dRule;
```
[jcode](https://code.juejin.cn/pen/7209310803131007010)

### 矩阵组合
矩阵的真正厉害之处在于矩阵的组合。
1. 矩阵相乘的结果与顺序有关：两个数相乘时，a * b = c 和 b * a = c 都为真。例如 3 * 4 = 12 和 4 * 3 = 12。在数学中，这些数字称为**可交换的**。*如果顺序交换，则不能*保证矩阵相同，因此矩阵是**不可交换的**。

2. 在 WebGL 和 CSS3 中的矩阵相乘需要和变换发生的顺序相反。例如，要将某个对象缩放对象到 80%，向下移动 200 像素，然后绕原点旋转 90 度：
```
transformation = rotate * translate * scale
```

## 工作原理
可以简要概括为：
1. WebGL 程序通过 JavaScript 发送渲染指令到浏览器。

2. 浏览器使用图形卡(GPU)上的 OpenGL ES 系统来处理指令并执行实际渲染。
3. 渲染输出被显示在 HTML5 `canvas` 元素上。

所以 WebGL 基本上是 JavaScript 与 OpenGL ES 之间的一个接口。它允许 JavaScript 访问 GPU 的功能,以便于高性能渲染和平台硬件加速渲染。

### 基本步骤
1. 创建 WebGL 上下文：

    由于 WebGL 需要在 web 浏览器中进行实时渲染，因此需要创建用于渲染的 WebGL 上下文。通常，这需要在 HTML 中使用特殊的 `canvas` 元素来实现。
```js
const glCanvas = document.getElementById("glcanvas");
const gl = glCanvas.getContext("webgl");
```
2. 准备顶点数据、颜色数据和索引数据：

    在 WebGL 中，需要将三维物体的顶点数据转化为浏览器可以识别的格式。这个过程通常涉及到将顶点坐标、法线向量、纹理坐标等数据存储在缓冲区中，并使用缓冲区对象来管理这些数据。
```js
const vertices = [
  -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1,
  -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1,
  -1, -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1,
  1, -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1,
  -1, -1, -1, -1, -1, 1, 1, -1, 1, 1, -1, -1,
  -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1,
];
const colors = [
  5, 3, 7, 5, 3, 7, 5, 3, 7, 5, 3, 7,
  1, 1, 3, 1, 1, 3, 1, 1, 3, 1, 1, 3,
  0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1,
  1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0,
  1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0
];
const indices = [
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7,
  8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14, 15,
  16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23
];
```
3. 创建和配置顶点缓冲区和纹理缓冲区：

    顶点缓冲区和纹理缓冲区是 WebGL 中另一个重要的组件，用于存储模型数据和纹理数据。通过创建并配置这些缓冲区，我们可以告诉 WebGL 如何读取和处理模型和纹理数据。
```js
const vertex_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
// Create and store data into color buffer
const color_buffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
// Create and store data into index buffer
const index_buffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
```
4. 获取并编译着色器：

    WebGL 中的着色器是编写图形渲染程序的必要组件，其中顶点着色器和片段着色器是最重要的两种着色器类型。在 WebGL 中，我们需要先获取并编译这些着色器才能进一步使用它们。
```js
const vertCode = `
  attribute vec3 position;
  uniform mat4 Pmatrix;
  uniform mat4 Vmatrix;
  uniform mat4 Mmatrix;
  attribute vec3 color; //the color of the point
  varying vec3 vColor;
  void main(void) {
    gl_Position = Pmatrix * Vmatrix * Mmatrix * vec4(position, 1.);
    vColor = color;
  }`;
const fragCode = `
  precision mediump float;
  varying vec3 vColor;
  void main(void) {
    gl_FragColor = vec4(vColor, 1.);
  }`;
const vertShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertShader, vertCode);
gl.compileShader(vertShader);
const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragShader, fragCode);
gl.compileShader(fragShader);
const shaderprogram = gl.createProgram();
gl.attachShader(shaderprogram, vertShader);
gl.attachShader(shaderprogram, fragShader);
gl.linkProgram(shaderprogram);
```

5. 将属性关联到顶点着色器：

    属性可以通过顶点缓冲区将数据关联到顶点着色器中，以便在渲染过程中使用。这是 WebGL 中实现高效渲染的关键步骤之一。
```js
const _Pmatrix = gl.getUniformLocation(shaderprogram, "Pmatrix");
const _Vmatrix = gl.getUniformLocation(shaderprogram, "Vmatrix");
const _Mmatrix = gl.getUniformLocation(shaderprogram, "Mmatrix");
gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
const _position = gl.getAttribLocation(shaderprogram, "position");
gl.vertexAttribPointer(_position, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(_position);
gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
const _color = gl.getAttribLocation(shaderprogram, "color");
gl.vertexAttribPointer(_color, 3, gl.FLOAT, false, 0, 0);
gl.enableVertexAttribArray(_color);
gl.useProgram(shaderprogram);
```
6. 处理矩阵：

    可以使用矩阵来执行坐标变换、相机视图变换、透视变换等操作，从而实现各种三维绘图效果。WebGL 提供了一些内置的矩阵函数，可以用于执行基本的线性代数变换，例如 `gl.uniformMatrix4fv`。
```js
function get_projection(angle, a, zMin, zMax) {
  const ang = Math.tan((angle * .5) * Math.PI / 180); //angle*.5
  return [
    0.5 / ang, 0, 0, 0,
    0, 0.5 * a / ang, 0, 0,
    0, 0, -(zMax + zMin) / (zMax - zMin), -1,
    0, 0, (-2 * zMax * zMin) / (zMax - zMin), 0
  ];
}
const proj_matrix = get_projection(40, canvas.width / canvas.height, 1, 100);
const mo_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const view_matrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
view_matrix[14] = view_matrix[14] - 6;
```
7. 绑定 DOM 事件，绘制图形：

    在准备好顶点数据和着色器程序之后，可以使用 WebGL 的绘图函数来渲染图形。常用的绘图函数包括 `gl.drawArrays` 和 `gl.drawElements`。在绘制图形时，需要指定要使用的缓冲区、顶点数据的格式、着色器程序等。

    通过修改渲染状态来控制更新绘制结果，例如设置深度测试、剔除面、光照模型等。如果需要在 WebGL 中生成动画，则需要定期更新每个帧的数据。对于每个帧，我们需要重新计算每个动画元素的状态，并在下一个渲染周期开始之前更新缓冲区中的数据。可以使用 `requestAnimationFrame` 方法实现连续的绘制循环。
```js
/*================= Mouse events ======================*/
const AMORTIZATION = 0.95;
let drag = false;
let old_x, old_y;
let dX = 0, dY = 0;
const mouseDown = function(e) {
  drag = true;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
  return false;
};
const mouseUp = function(e) {
  drag = false;
};
const mouseMove = function(e) {
  if (!drag) return false;
  dX = (e.pageX - old_x) * 2 * Math.PI / canvas.width,
    dY = (e.pageY - old_y) * 2 * Math.PI / canvas.height;
  THETA += dX;
  PHI += dY;
  old_x = e.pageX, old_y = e.pageY;
  e.preventDefault();
};
canvas.addEventListener("mousedown", mouseDown, false);
canvas.addEventListener("mouseup", mouseUp, false);
canvas.addEventListener("mouseout", mouseUp, false);
canvas.addEventListener("mousemove", mouseMove, false);
/*=========================rotation================*/
function rotateX(m, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const mv1 = m[1], mv5 = m[5], mv9 = m[9];
  m[1] = m[1] * c - m[2] * s;
  m[5] = m[5] * c - m[6] * s;
  m[9] = m[9] * c - m[10] * s;
  m[2] = m[2] * c + mv1 * s;
  m[6] = m[6] * c + mv5 * s;
  m[10] = m[10] * c + mv9 * s;
}

function rotateY(m, angle) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const mv0 = m[0], mv4 = m[4], mv8 = m[8];
  m[0] = c * m[0] + s * m[2];
  m[4] = c * m[4] + s * m[6];
  m[8] = c * m[8] + s * m[10];
  m[2] = c * m[2] - s * mv0;
  m[6] = c * m[6] - s * mv4;
  m[10] = c * m[10] - s * mv8;
}
/*=================== Drawing =================== */
let THETA = 0, PHI = 0;
let time_old = 0;
const animate = function(time) {
  const dt = time - time_old;
  if (!drag) {
    dX *= AMORTIZATION, dY *= AMORTIZATION;
    THETA += dX, PHI += dY;
  }
  //set model matrix to I4
  mo_matrix[0] = 1, mo_matrix[1] = 0, mo_matrix[2] = 0,
    mo_matrix[3] = 0,
    mo_matrix[4] = 0, mo_matrix[5] = 1, mo_matrix[6] = 0,
    mo_matrix[7] = 0,
    mo_matrix[8] = 0, mo_matrix[9] = 0, mo_matrix[10] = 1,
    mo_matrix[11] = 0,
    mo_matrix[12] = 0, mo_matrix[13] = 0, mo_matrix[14] = 0,
    mo_matrix[15] = 1;
  rotateY(mo_matrix, THETA);
  rotateX(mo_matrix, PHI);
  time_old = time;
  gl.enable(gl.DEPTH_TEST);
  // gl.depthFunc(gl.LEQUAL);
  gl.clearColor(0.5, 0.5, 0.5, 0.9);
  gl.clearDepth(1.0);
  gl.viewport(0.0, 0.0, canvas.width, canvas.height);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.uniformMatrix4fv(_Pmatrix, false, proj_matrix);
  gl.uniformMatrix4fv(_Vmatrix, false, view_matrix);
  gl.uniformMatrix4fv(_Mmatrix, false, mo_matrix);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, index_buffer);
  gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  window.requestAnimationFrame(animate);
}
animate(0);
```
<iframe src="https://code.juejin.cn/pen/7209327894018359333"></iframe>