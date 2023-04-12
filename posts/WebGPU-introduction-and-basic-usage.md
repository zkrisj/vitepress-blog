---
title: 'WebGPU 介绍和基本使用'
date: 2023-04-12 16:28:55
tags: [WebGPU]
description: WebGPU 规范由 Web Community Group 发布，是 W3C（但它不是 W3C 标准，也不在 W3C 标准轨道上）的 GPU for the Web 社区组共同努力的结果，其中包括 Mozilla、Apple、Intel 和 Microsoft 等大公司的贡献。
---
## 介绍
1. WebGL 在 2011 年左右首次出现后，在图形功能方面彻底改变了网络。WebGL 是 OpenGL ES 2.0 图形库的 JavaScript 端口，允许网页将渲染计算直接传递给设备的 GPU 进行处理以非常高的速度，并在元素内渲染结果 `<canvas>`。
2. WebGPU 是 WebGL 的继任者（与 OpenGL ES 无关），提供了与现代 GPU 更好的兼容性、支持通用 GPU 计算、更快的操作以及访问更高级的 GPU 功能。
3. WebGPU 的开发始于 2017 年，这项技术的目标是借助现代 GPU 的计算能力来加速图形和计算并且允许在 Web 上进行高性能 3D 图形和数据并行计算。
4. 与 DirectX 和 Vulkan 等其他图形 API 类似，WebGPU 也提供了直接在 GPU 上渲染和访问高级功能的功能，从而提高图形渲染的速度和效率。
5. WebGPU 大幅减少相同图形的 JavaScript 工作量，以及为机器学习模型推理提供 3 倍以上的改进。因为 WebGPU 提供了更灵活的 GPU 编程和访问，从而实现 WebGL 无法提供的高级功能。
6. 目前已在 Chrome 113 Beta 中默认启用。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8ae6f706e8c64ad0b8b78e24142078cb~tplv-k3u1fbpfcp-watermark.image?)

## GPU on the Web Community Group
1. GPU 规范由 Web Community Group 发布，但它不是 W3C 标准，也不在 W3C 标准轨道上。WebGPU 是 W3C 的 GPU for the Web 社区组共同努力的结果，其中包括 Mozilla、Apple、Intel 和 Microsoft 等大公司的贡献。经过 6 年的开发（90 位贡献者，2000 次提交，3000 次发布），从 2017 年的初始设计开始，现在可以在 Chrome 中使用的第一个实现，并在支持 Firefox 和 Safari 进行中。
2. GPU on the Web Community Group 的使命是提供 Web 平台与本机系统平台中存在的现代 3D 图形和计算功能之间的接口。
3. 目标是设计一个新的 Web API，以高效、强大和安全的方式公开这些现代技术，与现有平台 API 一起工作，例如 [Microsoft 的 Direct3D 12](https://docs.microsoft.com/en-us/windows/win32/direct3d12/direct3d-12-graphics)、[Apple 的 Metal](https://developer.apple.com/metal/) 和 [The Khronos Group 的 Vulkan](https://www.vulkan.org/)。即由浏览器封装了现代图形 API（Dx12、Vulkan、Metal），提供给 Web 3D 程序员，将为 Web 释放更多的 GPU 硬件的功能。
4. WebGPU 的这个初始版本是未来更新和增强的构建基础。API 将提供更高级的图形功能，鼓励开发人员发送对其他功能的请求。Chrome 团队还计划提供对着色器核心的更深入访问，以便在 WGSL（WebGPU 着色语言）中进行更多的机器学习优化和额外的人体工程学。
5. Chromium 的 Dawn 库和 Firefox 的 wgpu 库都可以作为独立包使用，它们提供了出色的可移植性和人体工程学层，可以抽象操作系统 GPU API。在本机应用程序中使用这些库还可以更轻松地通过 Emscripten和 Rust web-sys移植到 WASM。
6. 一些 WebGL 库已经在实施对 WebGPU 的支持，这意味着使用 WebGPU 可能只需要进行一行更改：
- [Babylon.js](https://doc.babylonjs.com/setup/support/webGPU)已经拥有完整的 WebGPU 支持。
- [PlayCanvas](https://blog.playcanvas.com/initial-webgpu-support-lands-in-playcanvas-engine-1-62/)宣布了最初的 WebGPU 支持。
- [TensorFlow.js](https://www.npmjs.com/package/@tensorflow/tfjs-backend-webgpu)支持大多数运算符的 WebGPU 优化版本。
- [Three.js](https://threejs.org/) WebGPU 支持正在进行中，请参阅[示例](https://threejs.org/examples/?q=webgpu#webgpu_particles)。

## 发展
1. 2018 年起，Google Chrome 团队就已经宣布着手 WebGPU 标准的实现工作。
2. 2022 年 11 月，商用开源 3D 引擎 Cocos 发布了支持 WebGPU 的新版本 Cocos Creator 3.6.2，为国内首个支持该渲染后端的开源引擎。
3. 时至今日，WebGPU 的各类接口、生态、应用已日趋完善，WebGPU 1.0 已于 2023 年初正式推出。
4. 作为 Google、Apple、Mozilla 等浏览器厂商共同推进的次时代图形标准，WebGPU 毫无疑问会在未来取代 WebGL，这也是 Cocos 投资 WebGPU 技术的核心原因。
5. 从时间上来看，WebGPU 的出现时间稍晚，但也正因如此，让 WebGPU 得以借助次时代图形 API 的经验，做出更好的设计。未来随着 WebGPU 标准在主流浏览器的逐步落地，其能力将给 H5、小程序等的内容创作与性能表现带来更多可能，也一定会在 Web 平台出现不逊于原生 app 的图形渲染效果，同时基于 Web 端的优势给用户带来更轻量和便捷的体验。

## 使用
1. 首先，确保用户的浏览器支持 WebGPU。可以使用以下代码检查浏览器是否支持 WebGPU：
```js
if ('gpu' in navigator) {
  // WebGPU is supported
} else {
  // WebGPU is not supported
}
```
2. 要使用 WebGPU，首先需要获取一个 `GPUDevice` 对象。这是与物理 GPU 交互的接口。以下代码用于获取 GPU 设备：
```js
async function getGPUDevice() {
  const adapter = await navigator.gpu.requestAdapter();
  const device = await adapter.requestDevice();
  return device;
}
```
3. 为画布（`canvas`）创建一个 WebGPU 上下文：
```js
const canvas = document.querySelector('canvas');
const context = canvas.getContext('webgpu');
```
4. 使用 GPU 设备和上下文创建一个 `GPUSwapChain`：
```
function createSwapChain(device, context) {
  const swapChainFormat = 'bgra8unorm';

  const swapChainDescriptor = {
    device: device,
    format: swapChainFormat
  };

  context.configureSwapChain(swapChainDescriptor);
}
```
5. 在 WebGPU 中，渲染管道定义了如何将顶点、纹理等数据转换为像素。创建一个管道需要提供顶点着色器、片段着色器和其他一些描述符：
```js
async function createRenderPipeline(device) {
  const vertexShaderModule = device.createShaderModule({
    code: `...` // GLSL or WGSL code for the vertex shader
  });

  const fragmentShaderModule = device.createShaderModule({
    code: `...` // GLSL or WGSL code for the fragment shader
  });

  const pipelineDescriptor = {
    vertex: {
      module: vertexShaderModule,
      entryPoint: 'main',
      buffers: [/* ... */], // Vertex buffer layout
    },
    fragment: {
      module: fragmentShaderModule,
      entryPoint: 'main',
      targets: [
        {
          format: 'bgra8unorm',
        },
      ],
    },
    primitive: {
      topology: 'triangle-list',
    },
    depthStencil: {/* ... */}, // Depth and stencil state (if needed)
    multisample: {/* ... */}, // Multisampling configuration (if needed)
  };

  const pipeline = device.createRenderPipeline(pipelineDescriptor);
  return pipeline;
}
```
6. 创建缓冲区、纹理等资源，并编写绘图命令。这需要使用 `GPUBuffer`、`GPUTexture` 等对象，并使用 `GPUCommandEncoder` 记录命令。
7. 最后，创建一个渲染循环，用于在每一帧中绘制场景。在渲染循环中，首先需要获取一个 `GPUTexture`，然后使用管道和资源进行绘图：
```js
function renderLoop() {
  const texture = context.getCurrentTexture();
  const renderPassDescriptor = {
    colorAttachments: [
      {
        view: texture.createView(),
        loadValue: [0, 0, 0, 1],
        storeOp: 'store',
      },
    ],
  };

  const commandEncoder = device.createCommandEncoder();
  const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor);

  passEncoder.setPipeline(pipeline);
  // Set bind groups, vertex buffers, index buffers, etc.
  passEncoder.draw(/* ... */);
  passEncoder.endPass();

  const commandBuffer = commandEncoder.finish();
  device.queue.submit([commandBuffer]);

  requestAnimationFrame(renderLoop);
}
```

## 示例
- [基本计算演示](https://mdn.github.io/dom-examples/webgpu-compute-demo/)
- [基本渲染演示](https://mdn.github.io/dom-examples/webgpu-render-demo/)
- [WebGPU 示例](https://webgpu.github.io/webgpu-samples/)

## 参考资料
1. [Chrome 发布了 WebGPU](https://developer.chrome.com/blog/webgpu-release/)
2. [WebGPU API](https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API)
3. [WebGPU](https://gpuweb.github.io/gpuweb/)