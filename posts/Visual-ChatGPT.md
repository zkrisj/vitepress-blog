---
date: 16:43 2023/3/29
title: Visual ChatGPT - 用图像交互的方式，跟 ChatGPT 聊天
tags:
- GPT
description: 微软亲自构建和开源了一个名为 Visual ChatGPT 的系统（3 月 10 日发布），其中包含不同的视觉基础模型。
---
## 介绍
ChatGPT 正在吸引跨领域的兴趣，因为它提供了一种语言界面，具有跨多个领域的卓越对话能力和推理能力。然而，由于 ChatGPT 是用语言训练的，它目前无法处理或生成来自视觉世界的图像。

相比较而言，视觉基础模型（VFM，Visual Foundation Models）在计算机视觉方面潜力巨大，因而能够理解和生成复杂的图像。例如，BLIP 模型是理解和提供图像描述的专家；大热的 Stable Diffusion 可以基于文本提示合成图像。然而由于 VFM 模型对输入 - 输出格式的苛求和固定限制，使得其在人机交互方面不如会话语言模型灵活。

为此，微软亲自构建和开源了一个名为 [Visual ChatGPT](https://github.com/microsoft/visual-chatgpt) 的系统（3 月 10 日发布），其中包含不同的视觉基础模型，使用户能够通过以下方式与 ChatGPT 进行交互：
1. ChatGPT（或 LLM）充当通用界面，提供对图像的理解和用户的交互功能。
2. 基础图像模型通过提供特定领域的深入知识来充当背后的技术专家。
3. 不仅发送和接收语言，还发送和接收图像。
4. 提供复杂的视觉问题或视觉编辑指令，需要多个 AI 模型进行多步骤协作。
5. 提供反馈并要求更正结果。我们设计了一系列提示将视觉模型信息注入 ChatGPT，考虑到多个输入/输出的模型和需要视觉反馈的模型。

## 技术架构
论文地址：https://arxiv.org/pdf/2303.04671.pdf

他们不是从头开始训练一个新的多模态 ChatGPT，而是直接基于 ChatGPT 构建 Visual ChatGPT，并结合了各种 VFM。为了弥合 ChatGPT 和这些 VFM 之间的差距，该研究提出了一个 Prompt Manager，其支持以下功能：
1. 明确告诉 ChatGPT 每个 VFM 的功能并指定输入输出格式；
2. 将不同的视觉信息，例如 png 图像、深度图像和 mask 矩阵，转换为语言格式以帮助 ChatGPT 理解；
3. 处理不同 VFM 的历史、优先级和冲突。

在 Prompt Manager 的帮助下，ChatGPT 可以利用这些 VFM，并以迭代的方式接收它们的反馈，直到满足用户的需求或达到结束条件。

总结而言，本文贡献如下： 
- 提出 Visual ChatGPT，打开了 ChatGPT 和 VFM 连接的大门，使 ChatGPT 能够处理复杂的视觉任务；
- 设计了一个 Prompt Manager，其中涉及 22 个不同的 VFM，并定义了它们之间的内在关联，以便更好地交互和组合；
- 进行了大量的零样本实验，并展示了大量的案例来验证 Visual ChatGPT 的理解和生成能力。

仓库中列出了技术架构及原理图：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ad9be6f6c86a47d0af0cd14ed60e4348~tplv-k3u1fbpfcp-watermark.image?)

上面这张图片，拆分为左、中、右三部分：
1. 左：

    项目 Demo 示例，在该 Demo 中，用户与 ChatGPT 进行了三次交流。

    第一次交流（Q1 & A1）：用户发送了一张沙发图片，ChatGPT 回复「收到」。
    
    第二次交流（Q2 & A2）：用户让 ChatGPT 将图片中的沙发替换为桌子，并让其看起来像一幅水墨画。ChatGPT 收到指令并生成了两幅示例图。
    
    第三次交流（Q3 & A3）：用户问 ChatGPT，图像中墙壁的颜色，ChatGPT 回答「蓝色」。

2. 中：代表的是 Visual ChatGPT 的工作流程，在模型接收到提问（Query）后，会判断是否需要使用 VFM 进行处理并提供答案。
3. 右：代表的是 VFM 详细处理说明，分别表示模型在接到不同消息指令时，具体的处理与答复流程。

## 应用
1. 图像描述：根据提供的图片，生成描述图片内容的文本。
2. 问答系统：用户可以根据图片向 Visual ChatGPT 提问，模型会生成与图片内容相关的答案。
3. 图像标注和分类：Visual ChatGPT 可以根据图片内容生成相应的标签或类别。
4. 辅助创作：基于图片元素，Visual ChatGPT 可以帮助创作者生成创意文本、广告语或其他相关内容。
5. 教育辅导：Visual ChatGPT 可以帮助学生通过交流更好地理解图片中的概念或知识点。

## 示例
Visual ChatGPT 的出现，就像在以文字交流的 APP 中首次添加了表情包功能，而且还是根据用户输入的文本自动生成的 “定制化表情包”，大大提升了 ChatGPT 的趣味性和应用领域。

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/31df92aa099c4564a92c9ba22243a5b3~tplv-k3u1fbpfcp-watermark.image?)

如图所示，用户上传了一张黄色花朵的图像，并输入一条复杂的语言指令「请根据该图像生成的深度图在生成一朵红色花朵，然后逐步将其制作成卡通图片。」在 Prompt Manager 帮助下，Visual ChatGPT 启动了和 VFM 相关的执行链。

其执行过程是这样的：
1. 首先是深度估计模型，用来检测图像深度信息；
2. 然后是深度 - 图像模型，用来生成具有深度信息的红花图像；
3. 最后利用基于 Stable Diffusion 的风格迁移 VFM 将该图像风格转换为卡通图像。

在上述 pipeline 中，Prompt Manager 作为 ChatGPT 的调度器，提供可视化格式的类型并记录信息转换的过程。最后，当 Visual ChatGPT 从 Prompt Manager 获得卡通提示时，它将结束执行 pipeline 并显示最终结果。

![demo_short.gif](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/377391b824b448699b90d3cf6776ec8c~tplv-k3u1fbpfcp-watermark.image?)

在接下来的示例中：
1. 用户输入提示：你能帮我生成一张猫的图像吗？收到指示后，Visual ChatGPT 生成一张正在看书的猫的图像。
2. 然后，用户要求 Visual ChatGPT 将图像中的猫换成狗，然后把书删除。
3. 然后，要求 Visual ChatGPT 生成 canny 边缘检测，然后基于此生成另一张图像。