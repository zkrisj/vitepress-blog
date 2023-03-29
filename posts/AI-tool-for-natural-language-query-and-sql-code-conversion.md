---
date: 16:54 2023/3/29
title: 将自然语言查询转换为 SQL 代码的 AI 工具
tags:
- AI
description: 人工智能可以帮助我们实现将自然语言查询和 SQL 代码进行互相转换，这种技术通过自然语言处理（NLP）和机器学习，训练模型来理解和生成自然语言和 SQL 代码之间的映射关系。
---
## 介绍
人工智能可以帮助我们实现将自然语言查询和 SQL 代码进行互相转换，这种技术通过自然语言处理（NLP）和机器学习，训练模型来理解和生成自然语言和 SQL 代码之间的映射关系。

[SQL Translator](https://www.sqltranslate.app/) 是一个使用人工智能（OPENAI API）将自然语言查询和 SQL 代码互相转换的工具。通过使用 SQL 和自然语言翻译器，你可以简单地用自然语言输入您的查询并获得相应的 SQL 代码，或者输入您的 SQL 代码并获得人类可读的翻译，使你无需了解 SQL 的专业知识，即可方便地查询和分析数据库中的数据。这个项目是 100% 免费和开源的（MIT 许可证）。

> SQL（Structured Query Language，结构化查询语言）是一种用于管理和操作关系数据库中数据的编程语言，虽然它是一种强大的工具，但它也是相当复杂且难以理解的。相反，自然语言是我们在日常生活中说和写的语言，对于不熟悉技术术语的人来说，它通常是首选的交流方式。

## 功能
- SQL 到自然语言和自然语言到 SQL
- 自带黑暗模式
- 小写 / 大写切换
- 可复制到剪贴板
- SQL 语法高亮
- schema awareness（测试版）
- 可查询历史

## 本地安装
1. 克隆存储库：
    ```
    git clone https://github.com/whoiskatrin/sql-translator.git
    ```
2. 安装所需的包：
    ```
    cd sql-translator
    npm install
    ```
3. 在 `.env` 文件中输入您的 OPENAI API 密钥，您可以 [在此处](https://beta.openai.com/account/api-keys) 获取您的 API 密钥：
    ```
    OPENAI_API_KEY=$YOUR_API_KEY
    ```
4. 启动开发服务器：
    ```
    npm run dev
    ```
5. 构建并启动生产服务器：
    ```
    npm run build
    npm start
    ```
6. 在 Web 浏览器中导航至 `http://localhost:3000` 来访问该应用程序。

## 使用
SQL Translator 支持中文翻译，所以可以直接使用中文。
1. 从自然语言翻译成 SQL：

找出蓝色的车

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bad1c29bcccb4e9f9527743d433dfb07~tplv-k3u1fbpfcp-watermark.image?)

可以通过添加表结构，使其根据指定的表字段进行翻译：

找出2023年的帕萨特的280TSI商务版的白色的车

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3c668b74b24e41f88cda0b4d050ac068~tplv-k3u1fbpfcp-watermark.image?)

结果面板的 `AA` 复选框按钮可以切换生成的 SQL 语句的大小写。

2. 从 SQL 翻译成自然语言：

```sql
SELECT * FROM cars WHERE year = 2023 AND brand = '帕萨特' AND model = '280TSI商务版' AND color = '白色';
```

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/02c159534b7b43fcba27e5483ea95058~tplv-k3u1fbpfcp-watermark.image?)

自然语言的翻译结果是英文的，可以使用翻译工具再转成中文。

## 仓库地址
1. SQL Translator (SQL to Natural Language and Natural Language to SQL)：https://github.com/whoiskatrin/sql-translator
2. 在线使用：https://www.sqltranslate.app/