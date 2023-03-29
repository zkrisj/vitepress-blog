---
date: 16:25 2023/3/29
title: GPT-4 发布了，赶紧申请 API 候补名单
tags:
- GPT
description: GPT-4 是一个多模态大型语言模型（支持接受图像和文本输入，以文本形式输出），OpenAI 已面向开发者开放 GPT-4 API 的申请通道，提交申请后，进入 waitlist 中等待通过。
---
## 介绍
GPT-4（Generative Pre-trained Transformer 4）是 OpenAI 开发的一种大型语言模型。它在 GPT-3 的基础上进一步优化和扩展，提供了更加精确和全面的语言理解与生成能力。以下是官网介绍：
1. GPT-4 是一个多模态大型语言模型（支持接受图像和文本输入，以文本形式输出），也是 OpenAI 努力扩展深度学习的最新里程碑。虽然 GPT-4 对于许多现实场景的处理比人类差，但它在各种体现专业和学术能力的 benchmark 上，已表现出和人类相当的水平。
2. 例如，GPT-4 通过了模拟律师考试，其分数在应试者的前 10% 左右；相比之下，GPT-3.5 的得分却在倒数 10% 左右。OpenAI 表示，他们花了 6 个月的时间来使用对抗性测试程序，以及通过 ChatGPT 的经验教训迭代调整 GPT-4，从而在真实性和可控性等方面取得了有史以来最好的结果（尽管远非完美）。
3. 我们还开源了 [OpenAI Evals](https://github.com/openai/evals)，这是我们用于自动评估 AI 模型性能的框架，允许任何人报告我们模型中的缺点，以帮助指导进一步改进。

## 对比
在随意的谈话中，GPT-3.5 和 GPT-4 之间的区别可能很微妙。当任务的复杂性达到足够的阈值时，差异就会出现——GPT-4 比 GPT-3.5 更可靠、更有创意，并且能够处理更细微的指令。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19e5140afbc246eaa5c15392dddaf9c3~tplv-k3u1fbpfcp-watermark.image?)

OpenAI 还将机器学习模型的传统 benchmark 用于评估 GPT-4。结果显示，GPT-4 已经远远超过现有的大型语言模型，以及大多数最先进的 SOTA（state-of-the-art）模型。benchmark 数据如下：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/dcaf26ad204f4fd78667fbb798044233~tplv-k3u1fbpfcp-watermark.image?)

在 MMLU benchmark 中（一个基准数据集，包括来自于 STEM、人文、社科等 57 个学科的选择题，它用于测试 LLM 的世界知识和问题解答的能力），GPT-4 处理中文的准确度大约是 80%，已经优于其他 LLM 的英文表现，比如 GPT-3.5、Chinchilla、PALM。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/345354cd9b81465fad9d8be314f82490~tplv-k3u1fbpfcp-watermark.image?)

## 示例
1. 创造力：GPT-4 比以往任何时候都更具创造性和协作性。它可以生成、编辑并与用户一起迭代创意和技术写作任务，例如创作歌曲、编写剧本或学习用户的写作风格。

- 输入

    用一个句子解释灰姑娘的情节，其中每个单词必须以字母表中从 A 到 Z 的下一个字母开头，不重复任何字母。
- 输出

    A beautiful Cinderella, dwelling eagerly, finally gains happiness; inspiring jealous kin, love magically nurtures opulent prince; quietly rescues, slipper triumphs, uniting very wondrously, xenial youth zealously.（翻译：美丽的灰姑娘，热切的栖居，终于获得幸福；激起嫉妒的亲人，爱情神奇地孕育出富贵的王子；悄悄拯救，拖鞋胜利，团结无比，热心青年。）

2. 视觉输入：GPT-4 可以接受图像作为输入并生成说明、分类和分析。

- 输入

    我可以用这些原料做什么？

    ![放在表面上的配料，包括鸡蛋、面粉、黄油和牛奶](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fe8415043e6e48dcb62546d780465df7~tplv-k3u1fbpfcp-zoom-1.image)

- 输出

    你可以用这些原料做很多选择！一些可能性包括：- 煎饼或华夫饼 - 可丽饼 - 法式吐司 - 煎蛋卷或菜肉馅煎蛋饼 - 乳蛋饼 - 奶油冻或布丁 - 蛋糕或纸杯蛋糕 - 松饼或面包 - 饼干。这些只是几个例子，但可能性是无穷无尽的！

- 输入

    这张图有什么好笑的？并对图片中的每部分进行描述。

    ![消息 0 附件 0](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/617119914ce34bd38b3bb441206d3df9~tplv-k3u1fbpfcp-zoom-1.image)

- 输出

    图片显示了一个 "Lightning Cable" 适配器的包装，总共包含三个部分。

    图片 1：一部智能手机，其充电端口插着一个 VGA 接口（大的蓝色 15 针接口，通常用于电脑显示器）。

    图片 2："Lightning Cable" 适配器的包装上有一张 VGA 接口的图片。

    图片 3：VGA 连接器的特写，末端是一个小的 Lightning 连接器（用于为 iPhone 和其他苹果设备充电）。

   这张图片中的幽默来自将过时的大型 VGA 连接器插入小型现代智能手机充电端口的荒谬做法。

3. 更长的上下文：GPT-4 能够处理超过 25,000 个单词的文本，允许使用长格式内容创建、扩展对话以及文档搜索和分析等用例。

- 输入

    [文章来自：https://en.wikipedia.org/wiki/Rihanna] 描述她在超级碗比赛中的表现以及它的特别之处（文章很长，要比 GPT3.5 能处理的文本长出一倍，下面是截图）。

    ![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/73cddaef875040db93288885e9f75ca2~tplv-k3u1fbpfcp-watermark.image?)

- 输出

    出于多种原因，蕾哈娜 (Rihanna) 的超级碗 LVII 中场秀表演很特别。首先，这是她五年多来的第一次现场表演，也是她第一次登上超级碗中场秀的头条新闻。此外，她还创造了历史，成为第一个在怀孕期间在超级碗上表演的人。该节目本身广受好评，许多人称赞她充满活力的表演和令人印象深刻的歌声。它还获得了巨大的收视率，成为历史上收视率第二高的中场秀。

## 高级用法
上面的示例看起来很简单？OpenAI 紧接着展示了高级用法 —— 读论文。简单来说就是给 GPT-4 提供论文的图片格式文件，让它阅读并总结出要点。效果如下：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/59549e8e688f4d6aa0b0707d6cbdaf1f~tplv-k3u1fbpfcp-watermark.image?)

回答图片中包含的提问内容等操作：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef3adab4ec1f47ed89e1130a4382ccaa~tplv-k3u1fbpfcp-watermark.image?)

甚至回答图片中对应题号的问题：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e86fdcd52d2347808fd0522954137b51~tplv-k3u1fbpfcp-watermark.image?)

## GPT-4 局限性
GPT-4 跟 GPT-3.5 类似，对训练数据中断后（2021 年 9 月）所发生的事情不太了解，也会犯一些在我们看来很简单的推理性错误，给用户提供不合理的建议，以及在生成的代码中引入安全漏洞。

在内部的对抗性真实性评估中，GPT-4 的得分比最新的 GPT-3.5 高 40%：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/5104c18d005143a7a7d1b82f15a73c12~tplv-k3u1fbpfcp-watermark.image?)

也就是说，即便 GPT4 生成的答案更准确，但也只是比 GPT-3.5 更加可信了 40% 而已！

在使用语言模型输出时，尤其是在高风险上下文中，应非常小心，使用与特定用例需求匹配的精确协议（如人工审查、附加上下文基础或完全避免高风险使用）。

对于这些潜在性的危险因素，团队也聘请了来自多个不同行业的专家对模型进行了优化调整，但是其具体效果，还需要等后面场景应用较为广泛后，才能得出结论。

## 试用
如果你有 ChatGPT Plus 订阅会员，则可以直接在 chat.openai.com 上获得 GPT-4 访问权限，无需等待。不过有一定限制，在 4 小时内，最多只能发布 100 条信息。

获得访问权限后，用户当前还是只能向 GPT-4 模型发出纯文本请求，图像输入仍然只是研究预览阶段，得等一些时间才对外开放。

## 申请 GPT-4 API
OpenAI 已面向开发者开放 GPT-4 API 的申请通道，想使用的话，可以先提交申请，进入 waitlist 中等待通过。

申请通道：https://openai.com/waitlist/gpt-4-api

如果申请成功，会收到一封官方的邮件：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6520704b3fdc4ee0972fa387cc5a15ca~tplv-k3u1fbpfcp-watermark.image?)