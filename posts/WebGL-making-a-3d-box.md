---
date: 16:13 2023/3/29
title: WebGL - 制作 3D 立体盒子
tags:
- WebGL
description: 矩阵计算是一个很复杂的运算，通常使用一个矩阵运算库，而不会自己实现矩阵运算，这里使用的是 glMatrix 库来执行其矩阵操作。
---
## 如何使用 WebGL
1. WebGL 只关心两件事：裁剪空间中的坐标值和颜色值，使用 WebGL 只需要给它提供这两个东西。
2. 需要提供两个着色器来做这两件事，一个顶点着色器提供裁剪空间坐标值，一个片段着色器提供颜色值。
3. WebGL 应用程序代码是 JavaScript 和 OpenGL 着色语言的组合。

![1-1512160H41Ia.jpg](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/221e94d6625a4b5f96d7759bb96ed004~tplv-k3u1fbpfcp-watermark.image?)

- JavaScript 需要与 CPU 进行沟通
- OpenGL 着色语言（GLSL），需要与 GPU 通信

4. 使用 JavaScript 编写以下操作的代码：
- 初始化 WebGL − 用于初始化 WebGL 的上下文。
- 创建数组 − 创建数组来保存几何数据。
- 缓冲区对象 − 通过将数组作为参数来创建缓冲区对象（顶点和索引）。
- 着色器 − 创建，编译和连接着色器。
- 属性 − 创建属性，启用它们并与缓冲区对象关联。
- 全局变量 − 创建全局变量。
- 变换矩阵 − 创建变换矩阵。

5. 使用 OpenGL 着色语言（GLSL）编写着色器。

## 制作 3D 立体盒子
1. 新建一个 `canvas` 元素并设置一个 `onload` 事件处理程序来初始化我们的 WebGL 上下文。
```html
<body onload="main()">
  <canvas id="glcanvas" width="640" height="480">
    你的浏览器似乎不支持或者禁用了 HTML5 <code>&lt;canvas&gt;</code> 元素。
  </canvas>
</body>
```
2. 下面 JavaScript 代码中的 `main()` 函数将会在文档加载完成之后被调用。它的任务是设置 WebGL 上下文并开始渲染内容。
```js
// 从这里开始
function main() {
  const canvas = document.querySelector("#glcanvas");
  // 初始化 WebGL 上下文
  const gl = canvas.getContext("webgl");

  // 确认 WebGL 支持性
  if (!gl) {
    alert("无法初始化 WebGL，你的浏览器、操作系统或硬件等可能不支持 WebGL。");
    return;
  }

  // 使用完全不透明的黑色清除所有图像
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  // 用上面指定的颜色清除缓冲区
  gl.clear(gl.COLOR_BUFFER_BIT);
}
```
- 当我们获取到 `canvas` 之后，向 `getContext` 函数传递 `"webgl"` 参数，来获取 `WebGLRenderingContext`。
- 如果浏览器不支持 webgl, `getContext` 将会返回 `null`，我们就可以显示一条消息给用户然后退出。
- 在这个例子里，我们用黑色清除上下文内已有的元素（用背景颜色重绘 `canvas`）。

3. 矩阵计算是一个很复杂的运算，通常使用一个矩阵运算库，而不会自己实现矩阵运算。我们使用的是 [glMatrix](https://glmatrix.net/) 库来执行其矩阵操作，因此需要引入它，这里通过 CDN 形式引入使用。
4. 我们要将物体画在一个三维空间里，需要创建着色器代码到 `main()` 函数中来渲染。

下面是顶点着色器：
```js
  const vsSource = `
    attribute vec4 aVertexPosition;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    void main() {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
    }
  `;
```
- 顶点着色器的工作是将输入顶点从原始坐标系转换到 WebGL 使用的裁剪空间坐标系，需要对顶点坐标进行必要的转换，在每个顶点基础上进行其他调整或计算，然后通过将其保存在由 GLSL 提供的特殊变量（`gl_Position`）中来返回变换后的顶点。
- 上面的顶点着色器接收一个属性 `aVertexPosition` 定义的顶点位置值，这个值将与两个 `4x4` 的矩阵（`uProjectionMatrix` 和 `uModelMatrix`）相乘，乘积赋值给 `gl_Position`。
- 这里我们还没应用任何纹理，也没有计算任何光照效果。

下面是片段着色器：
```js
const fsSource = `
    void main() {
      gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
  `;
```
- 片段着色器的职责是确定像素的颜色，通过指定应用到像素的纹理元素（也就是图形纹理中的像素），获取纹理元素的颜色，然后将适当的光照应用于颜色。
- 之后颜色存储在特殊变量 `gl_FragColor` 中，返回到 WebGL 层。

5. 现在我们已经定义了两个着色器，我们需要将它们传递给 WebGL，编译并将它们连接在一起。将下面两个函数添加到 `webgl-demo.js` 文件中：
```js
//  初始化着色器程序，让 WebGL 知道如何绘制我们的数据
function initShaderProgram(gl, vsSource, fsSource) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  // 创建着色器程序
  const shaderProgram = gl.createProgram();
  gl.attachShader(shaderProgram, vertexShader);
  gl.attachShader(shaderProgram, fragmentShader);
  gl.linkProgram(shaderProgram);

  // 如果创建失败，alert
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    return null;
  }

  return shaderProgram;
}

// 创建指定类型的着色器，上传 source 源码并编译
function loadShader(gl, type, source) {
  const shader = gl.createShader(type);

  // 将 source 发送到着色器对象
  gl.shaderSource(shader, source);

  // 一旦着色器获取到 source，就编译着色器程序
  gl.compileShader(shader);

  // 检查着色器参数 gl.COMPILE_STATUS 状态，查看是否编译成功
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    // 如果返回错误，则着色器无法编译，从编译器中获取日志信息并 alert
    alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  
  // 如果着色器被加载并成功编译，则返回编译的着色器
  return shader;
}

// 调用着色器初始化程序
const shaderProgram = initShaderProgram(gl, vsSource, fsSource);
```
- 通过调用 `loadShader()`，为着色器传递类型和来源，创建了两个着色器。
- 然后创建一个附加着色器的程序，将它们连接在一起。
- 如果编译或链接失败，代码将弹出 `alert`。

6. 在创建着色器程序之后，我们需要查找 WebGL 返回分配的输入位置，我们有一个 `attribute` 和两个 `uniform`。
- 属性从缓冲区接收值，顶点着色器的每次迭代都从分配给该属性的缓冲区接收下一个值。
- `uniform` 类似于 JavaScript 全局变量，它们在着色器的所有迭代中保持相同的值。
- 由于 `attribute` 和 `uniform`的位置是特定于单个着色器程序的，因此我们将它们存储在一起以使它们易于传递。

添加下面代码到 `main()` 函数中：
```js
const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };
```
7. 在画盒子中的正方形前，我们需要创建一个缓冲器来存储它的顶点。`initBuffers()` 函数可以有更多参数，来创建更复杂的三维物体。创建 `init-buffers.js` 文件：
```js
function initBuffers(gl) {
  const positionBuffer = initPositionBuffer(gl);

  return {
    position: positionBuffer,
  };
}

function initPositionBuffer(gl) {
  // 为方块的位置创建一个缓冲区
  const positionBuffer = gl.createBuffer();

  // 选择 positionBuffer 作为应用缓冲区操作的对象
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // 为正方形创建一个位置数组
  const positions = [1.0, 1.0, -1.0, 1.0, 1.0, -1.0, -1.0, -1.0];

  // 使用 Float32Array 来填充当前缓冲区，将位置列表传递给 WebGL 以构建方块
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return positionBuffer;
}

export { initBuffers }; 
```
8. 当着色器和物体都创建好后，我们可以开始渲染这个场景了。因为我们这个例子不会产生动画，所以 `drawScene()` 方法非常简单。创建 `draw-scene.js` 文件：
```js
function drawScene(gl, programInfo, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
  gl.clearDepth(1.0);                 // Clear everything
  gl.enable(gl.DEPTH_TEST);           // Enable depth testing
  gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

  // 开始绘制之前清除画布
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // 创建一个透视矩阵，一种特殊的矩阵，用于模拟相机中透视的变形。
  // 我们的视野是 45 度，设置 45 度的视图角度，并且设置一个适合实际图像的宽高比，
  // 指定在摄像机距离 0.1 到 100 单位长度的范围内的物体可见。

  const fieldOfView = 45 * Math.PI / 180;   // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
  const zNear = 0.1;
  const zFar = 100.0;
  const projectionMatrix = mat4.create();

  // 注意：glmatrix.js 始终将第一个参数作为接收结果的目的地
  mat4.perspective(projectionMatrix,
                   fieldOfView,
                   aspect,
                   zNear,
                   zFar);

  // 将绘图位置设置为场景的中心
  const modelViewMatrix = mat4.create();

  // 将绘图位置稍微移动到我们要开始绘制正方形的位置
  mat4.translate(modelViewMatrix,     // destination matrix
                 modelViewMatrix,     // matrix to translate
                 [-0.0, 0.0, -6.0]);  // amount to translate

  {
    const numComponents = 2;  // pull out 2 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next
                              // 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
   //  绑定正方形的顶点缓冲到上下文
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
        programInfo.attribLocations.vertexPosition,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(
        programInfo.attribLocations.vertexPosition);
  }

  // 告诉 WebGL 在绘图时使用我们的程序
  gl.useProgram(programInfo.program);

  // 设置着色器 uniforms
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.projectionMatrix,
      false,
      projectionMatrix);
  gl.uniformMatrix4fv(
      programInfo.uniformLocations.modelViewMatrix,
      false,
      modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 4;
    // 画出对象
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}

// 如何将位置缓冲区中的位置提取到 vertexPosition 属性中
function setPositionAttribute(gl, buffers, programInfo) {
  const numComponents = 2; // pull out 2 values per iteration
  const type = gl.FLOAT; // the data in the buffer is 32bit floats
  const normalize = false; // don't normalize
  const stride = 0; // how many bytes to get from one set of values to the next
  // 0 = use type and numComponents above
  const offset = 0; // how many bytes inside the buffer to start from
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexPosition,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
}

export { drawScene };
```
9. 在 `webgl-demo.js` 文件头部引入 `initBuffers()` 和 `drawScene()`：
```js
import { initBuffers } from "./init-buffers.js";
import { drawScene } from "./draw-scene.js";
```
在 `main()` 函数结尾处添加如下代码：
```js
// 构建我们将要绘制的所有对象
const buffers = initBuffers(gl);

// 绘制场景
drawScene(gl, programInfo, buffers);
```
现在效果如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0bbef355a0a74d03a32afe36ba9a6224~tplv-k3u1fbpfcp-watermark.image?)

### 添加颜色
我们已经创建好了一个正方形，接下来就是给它添加颜色，可以通过修改着色器来实现。
- 在 WebGL 中，物体是由一系列顶点组成的，每一个顶点都有位置和颜色信息。
- 在默认情况下，所有像素的颜色（以及它所有的属性，包括位置）都由线性插值计算得来，自动形成平滑的渐变。

1. 首先我们要创建一个顶点颜色数组，然后将它们存在 WebGL 的缓冲区中。在 `initBuffers()` 函数中加入如下代码：
```js
function initColorBuffer(gl) {
  const colors = [
    1.0,
    1.0,
    1.0,
    1.0, // 白
    1.0,
    0.0,
    0.0,
    1.0, // 红
    0.0,
    1.0,
    0.0,
    1.0, // 绿
    0.0,
    0.0,
    1.0,
    1.0, // 蓝
  ];

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  return colorBuffer;
}
```
- `colors` 数组中包含四组四值向量，每一组向量代表一个顶点的颜色。
- 然后，创建一个 WebGL 缓冲区用来存储这些颜色——将数组中的值转换成 WebGL 所规定的浮点型后存储。

2. 在 `initBuffers()` 中调用这个新函数，并返回它创建的新缓冲区。用下面代码替换旧的 `return` 语句：
```js
const colorBuffer = initColorBuffer(gl);

return {
  position: positionBuffer,
  color: colorBuffer,
};
```
3. 修改顶点着色器，使得着色器可以从颜色缓冲区中正确取出颜色。在 `main()` 函数中更新 `vsSource` 的定义：
```js
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;

    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying lowp vec4 vColor;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
  `;
```
与之前相比，现在每个顶点都与一个颜色数组中的数值相连接。

为使每个像素都得到插值后的颜色，我们只需要在此从 `vColor` 变量中获取这个颜色的值。在 `main()` 函数中更新 `fsSource` 的定义：
```js
const fsSource = `
    varying lowp vec4 vColor;

    void main(void) {
      gl_FragColor = vColor;
    }
  `;
```
这是一个非常简单的改变，每个片段只是根据其相对于顶点的位置得到一个插值过的颜色，而不是一个指定的颜色值。

4. 接下来，我们要初始化颜色属性，以便着色器程序使用。在 `main()` 函数中更新 `programInfo` 的定义：
```js
// 收集使用着色器程序所需的所有信息
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    vertexColor: gl.getAttribLocation(shaderProgram, "aVertexColor"),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
  },
};
```
修改 `drawScene()` 使之在绘制正方形时使用这些颜色，在 `draw-scene.js` 文件中添加下面函数：
```js
// 告诉 WebGL 如何将颜色缓冲区中的颜色提取到 vertexColor 属性中
function setColorAttribute(gl, buffers, programInfo) {
  const numComponents = 4;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexColor,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
}
```
`drawScene()` 函数中在调用 `gl.useProgram()` 之前，先调用 `setColorAttribute()`：
```js
setColorAttribute(gl, buffers, programInfo);
```
现在效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b87b849d20a3453998d37027f1de493f~tplv-k3u1fbpfcp-watermark.image?)

### 添加动画
1. 首先创建一个变量，用于跟踪正方形的当前旋转：
```js
let squareRotation = 0.0;
```
2. 更新 `drawScene()` 函数以在绘制正方形时将当前旋转应用于正方形：
```js
  mat4.rotate(modelViewMatrix,  // destination matrix
              modelViewMatrix,  // matrix to rotate
              squareRotation,   // amount to rotate in radians
              [0, 0, 1]);       // axis to rotate around
```
这会将 `modelViewMatrix` 的当前值 `squareRotation` 绕 Z 轴旋转。

3. 添加 `squareRotation` 随时间更改值的代码。创建一个新变量来跟踪上次动画播放的时间（`then`），然后将以下代码添加到 `main()` 函数的末尾：
```js
  let then = 0;

  // 反复绘制场景
  function render(now) {
    now *= 0.001;  // convert to seconds
    const deltaTime = now - then;
    then = now;

    drawScene(gl, programInfo, buffers, deltaTime);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
```
将以下要更新的代码 `squareRotation` 添加到 `drawScene()` 函数的末尾：
```js
squareRotation += deltaTime;
```
使用自上次我们更新值以来所经过的时间 `squareRotation` 来确定旋转正方形的距离。

现在效果如下：

![1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/343d43ae90484e3fbf5cb950d0ee9d3e~tplv-k3u1fbpfcp-watermark.image?)

### 创建 3D 对象
现在让我们给之前的正方形添加五个面从而可以创建一个三维的立方体。最简单的方式就是通过调用方法 `gl.drawElements()` 使用顶点数组列表来替换之前的通过方法 `gl.drawArrays()` 直接使用顶点数组。

现在会存在这样一个问题：每个面需要 4 个顶点，而每个顶点会被 3 个面共享。我们会创建一个包含 24 个顶点的数组列表，通过使用数组下标来索引顶点，然后把这些用于索引的下标传递给渲染程序而不是直接把整个顶点数据传递过去，这样来减少数据传递。那么也许你就会问：那么使用 8 个顶点就好了，为什么要使用 24 个顶点呢？这是因为每个顶点虽然被 3 个面共享但是它在每个面上需要使用不同的颜色信息。24 个顶点中的每一个都会有独立的颜色信息，这就会造成每个顶点位置都会有 3 份副本。

1. 首先，更新 `initBuffers()` 函数代码，创建顶点位置数据缓存。现在的代码看起来和渲染正方形时的代码很相似，只是比之前的代码更长因为现在有了 24 个顶点（每个面使用 4 个顶点）：
```js
const vertices = [
  // 前面
  -1.0, -1.0,  1.0,
   1.0, -1.0,  1.0,
   1.0,  1.0,  1.0,
  -1.0,  1.0,  1.0,

  // 后面
  -1.0, -1.0, -1.0,
  -1.0,  1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0, -1.0, -1.0,

  // 上面
  -1.0,  1.0, -1.0,
  -1.0,  1.0,  1.0,
   1.0,  1.0,  1.0,
   1.0,  1.0, -1.0,

  // 下面
  -1.0, -1.0, -1.0,
   1.0, -1.0, -1.0,
   1.0, -1.0,  1.0,
  -1.0, -1.0,  1.0,

  // 右面
   1.0, -1.0, -1.0,
   1.0,  1.0, -1.0,
   1.0,  1.0,  1.0,
   1.0, -1.0,  1.0,

  // 左面
  -1.0, -1.0, -1.0,
  -1.0, -1.0,  1.0,
  -1.0,  1.0,  1.0,
  -1.0,  1.0, -1.0
];
```
2. 为每个面定义颜色，然后用一个循环语句为每个顶点定义颜色信息。
```js
const colors = [
  [1.0,  1.0,  1.0,  1.0],    // Front face: white
  [1.0,  0.0,  0.0,  1.0],    // Back face: red
  [0.0,  1.0,  0.0,  1.0],    // Top face: green
  [0.0,  0.0,  1.0,  1.0],    // Bottom face: blue
  [1.0,  1.0,  0.0,  1.0],    // Right face: yellow
  [1.0,  0.0,  1.0,  1.0]     // Left face: purple
];

const generatedColors = [];

for (let j=0; j<6; j++) {
  const c = colors[j];

  for (let i=0; i<4; i++) {
    generatedColors = generatedColors.concat(c);
  }
}

const cubeVerticesColorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);
```
3. 创建好了顶点数组，接下来就要创建元素（三角形）数组了。
```js
const cubeVerticesIndexBuffer = gl.createBuffer();
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

// 该数组将每一个面都使用两个三角形来渲染，
// 通过立方体顶点数组的索引指定每个三角形的顶点，
// 这个立方体就是由 12 个三角形组成的了。
const cubeVertexIndices = [
  0,  1,  2,      0,  2,  3,    // front
  4,  5,  6,      4,  6,  7,    // back
  8,  9,  10,     8,  10, 11,   // top
  12, 13, 14,     12, 14, 15,   // bottom
  16, 17, 18,     16, 18, 19,   // right
  20, 21, 22,     20, 22, 23    // left
];

// 现在将元素数组发送到 GL
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
```
4. 接下来就需要在 `drawScene()` 函数里添加代码使用立方体顶点索引数据来渲染这个立方体了。
```js
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
setMatrixUniforms();
gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
```
立方体的每个面都由 2 个三角形组成，那就是每个面需要 6 个顶点，或者说总共 36 个顶点，尽管有许多重复的。然而，因为索引数组的每个元素都是简单的整数类型，所以每一帧动画需要传递给渲染程序的数据也不是很多。

到现在为止，我们已经创建了一个颜色生动的并且会在场景中移动和旋转的立方体。

![1.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cdd47c08e1a643c5b0d0dc70671de87c~tplv-k3u1fbpfcp-watermark.image?)

### 动画纹理
可以使用类似的代码来使用任何类型的数据作为纹理的源，例如 `<video>`（或 `<canvas>`），将静态纹理替换为正在播放的 mp4 视频文件的帧即可。

1. 首先创建将用于检索视频帧的 `<video>` 元素。将以下声明添加到 `webgl-demo.js` 文件的开头：
```js
// 当视频可以复制到纹理中时将被设置为 true
let copyVideo = false;
```
2. 将以下函数添加到 `webgl-demo.js` 文件中：
```js
function setupVideo(url) {
  const video = document.createElement("video");

  let playing = false;
  let timeupdate = false;

  video.playsInline = true;
  video.muted = true;
  video.loop = true;

  // 等待以下两个事件
  // 确保 video 中已有数据

  video.addEventListener(
    "playing",
    () => {
      playing = true;
      checkReady();
    },
    true
  );

  video.addEventListener(
    "timeupdate",
    () => {
      timeupdate = true;
      checkReady();
    },
    true
  );

  video.src = url;
  video.play();

  function checkReady() {
    if (playing && timeupdate) {
      copyVideo = true;
    }
  }

  return video;
}
```
    1. 首先，我们创建一个视频元素。我们将其设置为自动播放、静音和循环播放视频。
    2. 然后，我们设置了两个事件以确保视频正在播放并且时间轴已更新。我们需要进行这两项检查，因为如果将尚无可用数据的视频上传到 WebGL，它将产生错误。检查这两个事件可确保有可用数据，并且可以安全地开始将视频上传到 WebGL 纹理。
    3. 确认是否同时发生了这两个事件。如果是这样，我们将全局变量设置 copyVideo 为 true，以表示可以安全地开始将视频复制到纹理。
    4. 最后，我们将 src 属性设置为 start 并调用 play 以开始加载和播放视频。

3. 接下来的更改是初始化纹理。创建一个空的纹理对象，在其中放置一个像素，然后设置其过滤条件以供后续使用。将 `webgl-demo.js` 文件中的 `loadTexture()` 函数替换为以下代码：
```js
function initTexture(gl) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // 因为视频必须通过互联网下载
  // 可能需要一些时间才能准备好
  // 因此在纹理中放置一个像素，以便我们
  // 可以立即使用它。
  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]); // 不透明的蓝色
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    width,
    height,
    border,
    srcFormat,
    srcType,
    pixel
  );

  // 关闭 mips 并将包裹（wrapping）设置为边缘分割（clamp to edge）
  // 这样无论视频的尺寸如何，都可以正常工作。
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

  return texture;
}
```
将以下函数添加到 `webgl-demo.js` 文件中：
```js
function updateTexture(gl, texture, video) {
  const level = 0;
  const internalFormat = gl.RGBA;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    level,
    internalFormat,
    srcFormat,
    srcType,
    video
  );
}
```
4. 然后，我们需要在 `main()` 函数中调用几个新的函数。将调用 `loadTexture()` 的代码替换为以下内容：
```js
const texture = initTexture(gl);
const video = setupVideo("Firefox.mp4");
```
将 `render()` 函数替换为以下内容：
```js
// 重复绘制场景
function render(now) {
  now *= 0.001; // 转换为秒
  deltaTime = now - then;
  then = now;

  if (copyVideo) {
    updateTexture(gl, texture, video);
  }

  drawScene(gl, programInfo, buffers, texture, cubeRotation);
  cubeRotation += deltaTime;

  requestAnimationFrame(render);
}
```
如果 `copyVideo` 为真，我们将会在调用 `drawScene()` 之前调用 `updateTexture()`。

### 在 3D 空间中模拟现实灯光
与定义更广泛的 OpenGL 不同，WebGL 并没有继承 OpenGL 中灯光的支持。所以你只能由自己完全得控制灯光，但是，这也并不是很难。

> 光源类型可以概括成如下三种：
> 1. **环境光** 是一种可以渗透到场景的每一个角落的光。它是非方向光并且会均匀地照射物体的每一个面，无论这个面是朝向哪个方向的。
> 2. **方向光** 是一束从一个固定的方向照射过来的光。这种光的特点可以理解为好像是从一个很遥远的地方照射过来的，然后光线中的每一个光子与其他光子都是平行运动的。举个例子来说，阳光就可以认为是方向光。
> 3. **点光源光** 是指光线是从一个点发射出来的，是向着四面八方发射的。这种光在我们的现实生活中是最常被用到的。举个例子来说，电灯泡就是向各个方向发射光线的。

我们会简化光照模型，只考虑简单的方向光和环境光，不会考虑任何镜面反射和点光源。这样的话，我们只需要在我们使用的环境光上加上照射到旋转立方体的方向光就可以了。虽然可以抛开点光源和镜面反射，但是关于方向光还是有几点需要注意一下：

    1. 需要在每个顶点信息中加入面的朝向法线。这个法线是一个垂直于这个顶点所在平面的向量。
    2. 需要明确方向光的传播方向，可以使用一个方向向量来定义。
    3. 接着，我们会更新顶点着色器，考虑到环境光，再考虑到方向光（方向光的作用会因为光线方向与面的夹角关系而不同），计算每一个顶点的颜色。

1. 首先我们需要做的第一件事是为构成我们立方体的所有顶点生成法线数组。由于立方体是一个非常简单的对象，因此很容易做到；显然，对于更复杂的对象，计算法线会更加复杂。将此函数添加到 `init-buffer.js` 文件中：
```js
function initNormalBuffer(gl) {
  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

  const vertexNormals = [
    // Front
    0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0,

    // Back
    0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0,

    // Top
    0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0,

    // Bottom
    0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0,

    // Right
    1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0,

    // Left
    -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0, -1.0, 0.0, 0.0,
  ];

  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(vertexNormals),
    gl.STATIC_DRAW
  );

  return normalBuffer;
}
```
现在看起来应该很熟悉了；我们创建一个新缓冲区，将其绑定为我们正在使用的缓冲区，然后通过调用 `bufferData()` 将我们的顶点法线数组发送到缓冲区中。

2. 在 `initBuffers() `函数的末尾，添加以下代码，替换现有的 `return` 语句，返回它创建的缓冲区：
```js
const normalBuffer = initNormalBuffer(gl);

return {
  position: positionBuffer,
  normal: normalBuffer,
  textureCoord: textureCoordBuffer,
  indices: indexBuffer,
};
```
3. 然后我们将法线数组绑定到着色器属性，以便着色器代码可以访问它。将此函数添加到 `draw-scene.js` 文件中：
```js
// 告诉 WebGL 如何将法线从法线缓冲区中提取到 vertexNormal 属性中
function setNormalAttribute(gl, buffers, programInfo) {
  const numComponents = 3;
  const type = gl.FLOAT;
  const normalize = false;
  const stride = 0;
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
  gl.vertexAttribPointer(
    programInfo.attribLocations.vertexNormal,
    numComponents,
    type,
    normalize,
    stride,
    offset
  );
  gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);
}
```
将此行添加到 `draw-scene.js` 文件的 `drawScene()` 函数中，在 `gl.useProgram()` 行之前：
```js
setNormalAttribute(gl, buffers, programInfo);
```
4. 最后，我们需要更新构建统一矩阵的代码，以生成法线矩阵并将其传递给着色器，该法线矩阵用于在处理立方体相对于光源的当前方向时转换法线。将以下代码添加到 `draw-scene.js` 文件的 `drawScene()` 函数中，在 `mat4.rotate()` 调用之后：
```js
const normalMatrix = mat4.create();
mat4.invert(normalMatrix, modelViewMatrix);
mat4.transpose(normalMatrix, normalMatrix);
```
将以下代码添加到 `draw-scene.js` 文件的 `drawScene()` 函数中，在 `gl.uniformMatrix4fv()` 调用之后：
```js
gl.uniformMatrix4fv(
  programInfo.uniformLocations.normalMatrix,
  false,
  normalMatrix
);
```
#### 更新着色器
现在着色器需要的所有数据都可用了，我们需要更新着色器本身的代码。
1. 首先要做的是更新顶点着色器，让它给每一个基于环境光和方向光的顶点一个着色器值。更新 `main()` 函数中的 `vsSource` 声明：
```js
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec3 aVertexNormal;
    attribute vec2 aTextureCoord;

    uniform mat4 uNormalMatrix;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;

    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vTextureCoord = aTextureCoord;

      // 应用灯光效果
      highp vec3 ambientLight = vec3(0.3, 0.3, 0.3);
      highp vec3 directionalLightColor = vec3(1, 1, 1);
      highp vec3 directionalVector = normalize(vec3(0.85, 0.8, 0.75));

      highp vec4 transformedNormal = uNormalMatrix * vec4(aVertexNormal, 1.0);

      highp float directional = max(dot(transformedNormal.xyz, directionalVector), 0.0);
      vLighting = ambientLight + (directionalLightColor * directional);
    }
  `;
```
一旦计算出顶点的位置，我们就可以获得纹理对应于顶点的坐标，从而计算出顶点的阴影。

我们先根据立方体位置和朝向，通过顶点法线乘以法线矩阵来转换法线。然后，我们可以通过计算变换后的法线和方向向量（即光的来源方向）的点积来计算顶点反射方向光的量。如果这个值小于零，那么我们将值设为零，因为不能有小于零的光。

当方向光的量计算完，我们可以通过获取环境光并且添加方向光的颜色和要提供的定向光的量来生成光照值（lighting value）。最终结果我们会得到一个 RGB 值，用于片段着色器调整我们渲染的每一个像素的颜色。

2. 现在需要根据顶点着色器计算出的光照值来更新片段着色器。更新 `main()` 函数中的 `fsSource` 声明：
```js
const fsSource = `
    varying highp vec2 vTextureCoord;
    varying highp vec3 vLighting;

    uniform sampler2D uSampler;

    void main(void) {
      highp vec4 texelColor = texture2D(uSampler, vTextureCoord);

      gl_FragColor = vec4(texelColor.rgb * vLighting, texelColor.a);
    }
  `;
```
和先前我们获取纹理的颜色一样，不同的是在设置片段颜色之前，我们将纹理的颜色乘以光照值来调整纹理以达到我们光源的效果。

剩下的就只剩下查找 `aVertexNormal` 属性和 `uNormalMatrix` 全局变量的位置了。更新 `main()` 函数中的 `programInfo` 声明：
```js
const programInfo = {
  program: shaderProgram,
  attribLocations: {
    vertexPosition: gl.getAttribLocation(shaderProgram, "aVertexPosition"),
    vertexNormal: gl.getAttribLocation(shaderProgram, "aVertexNormal"),
    textureCoord: gl.getAttribLocation(shaderProgram, "aTextureCoord"),
  },
  uniformLocations: {
    projectionMatrix: gl.getUniformLocation(shaderProgram, "uProjectionMatrix"),
    modelViewMatrix: gl.getUniformLocation(shaderProgram, "uModelViewMatrix"),
    normalMatrix: gl.getUniformLocation(shaderProgram, "uNormalMatrix"),
    uSampler: gl.getUniformLocation(shaderProgram, "uSampler"),
  },
};
```
我们实现了基本的每个顶点的照明。对于更高级的图形，你将可能需要实现逐像素的照明。

## 码上掘金
<iframe src="https://code.juejin.cn/pen/7208840543965544451"></iframe>