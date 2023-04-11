---
title: 基于对话式交互的 SQL 客户端 - SQL Chat
date: 2023-04-11 16:59:00
tags: [AI, SQL]
description: SQL Chat 是一个基于聊天的 SQL 客户端，可以使用自然语言询问数据库问题和查询数据库。
---
## 介绍
SQL Chat 是一个基于聊天的 SQL 客户端，可以使用自然语言询问数据库问题和查询数据库。由 Next.js 构建，国内可直接部署到腾讯云 Web 应用托管服务，国外也可一键部署到 Vercel，同样支持私有化部署。现支持以下数据库，预计以后会添加更多数据库的支持：
- MySQL
- PostgreSQL

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9576ebb858544a6bab059c0a3e034a17~tplv-k3u1fbpfcp-zoom-1.image)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/19b3ced89de84acf933670bf02e2e19c~tplv-k3u1fbpfcp-zoom-1.image)

## 数据隐私
1. 所有数据库连接配置都存储在本地浏览器中，还可以访问浏览器设置以清除数据。
2. 只有数据库模式会被发送到 OpenAI API，而不会发送表数据。

## 本地安装
1. 复制示例环境变量文件；
```
cp .env.example .env
```
2. 将您的 [API 密钥](https://platform.openai.com/account/api-keys) 和 OpenAI API 端点（Endpoint，可选）添加到新创建的 `.env` 文件中；
3. 安装依赖项并启动开发服务器；
```
pnpm i && pnpm dev
```

## 使用
1. SQL Chat提供了连接数据库与数据库建立连接的功能，可以直接连接到一个公网数据库：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50ea42ad69d247678ea0127cd2c4ef86~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 连上数据库之后，其最大的作用是可以对连接的数据库执行查询：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/15ae6d34e287424ea38089a6f572d5af~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

3. 点这个小三角，就可以在连接的数据库中执行该查询 sql:

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f0acc80e4dfb4a6091723a43ef385bb2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

4. 它只支持去执行查询，查询以外的操作是无法支持的。比如 `insert` 语句就没有可执行的小三角了。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b63f1ed0322243028b37a90a8d3bcbd9~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

5. 可以根据提供的 SQL 提供常规的优化建议，对于很长的 sql 可以直接丢进去分析一波。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3f437e9f7d614e499a406a6b3e775fe0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/836b70c1adf84993b162e356f3ef0b77~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7f7ecb3150cd4397ba1f771466ac58f5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 总结
1. 集成了数据库连接会话功能，可以对 SQL Chat 回答的查询语句进行执行认证，这是一个亮点的功能。
2. 其次在 SQL 优化建议方面的回答也似乎比 ChatGPT 更完善一些。
3. 不足之处是会话功能仅支持执行 sql 查询操作，如果能执行所有的 SQL 操作，能进行写操作和执行 DDL 语句，即可以通过回答的 sql 来直接管理数据库，这将是一个不错的体验。

## 参考资料
1. [Bytebase SQL Chat 功能体验](https://juejin.cn/post/7220243380621590584)
2. [仓库地址](https://github.com/sqlchat/sqlchat)