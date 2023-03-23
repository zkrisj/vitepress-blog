---
date: 21:21 2023/3/23
title: 进击的 PostgreSQL，下坠的 MySQL
tags:
- SQL
description: StackOverflow 发布的 2022 开发者调查报告中，在专业开发者群体受欢迎排行榜中，PostgreSQL（46.48%）首次超越 MySQL（45.68%）拔得头筹。专业开发者与初学者的不同之处在于，他们更倾向于选择 Redis、PostgreSQL、Microsoft SQL Server 和 Elasticsearch。
---
原文链接：https://mp.weixin.qq.com/s/27SH8RFoWInD9zM3Dt1h1Q

## 2022 开发者调查报告
![640 (1).png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2230d30ad4f143cf9162c61f11601179~tplv-k3u1fbpfcp-watermark.image?)

StackOverflow 发布的 2022 开发者调查报告中，在专业开发者群体受欢迎排行榜中，PostgreSQL（46.48%）首次超越 MySQL（45.68%）拔得头筹。专业开发者与初学者的不同之处在于，他们更倾向于选择 Redis、PostgreSQL、Microsoft SQL Server 和 Elasticsearch。

初学者群体当中，MySQL 也并不乐观，紧随其后的 MongoDB 位居第二，占比近1/3。“这很合理，因为它支持大量的语言和应用开发平台。”

值得一提的是，正在使用 MySQL 的开发者同样也在考虑、希望或想要使用别的数据库工作，下图展示了调查结果。

![640.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/102beec331af453abca3f0924dd10ac2~tplv-k3u1fbpfcp-watermark.image?)

有 11185 名 MySQL 开发者想使用 PostgreSQL 工作，以及 9520 名 MySQL 开发者想使用 MongoDB 工作。

不止 StackOverflow 的报告，根据最新的 10 月 DB-Engines 流行趋势上看，也可以看见 MySQL 的受欢迎程度已经连续几年呈现下滑趋势。

![640 (1).png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6e4ea7e47b0d4a229e6cc921127e5d3a~tplv-k3u1fbpfcp-watermark.image?)

## MySQL
可以判断，如果不出意外，同样在开源关系型数据库之列的 PostgreSQL ，超越 MySQL 只是时间的问题。
1. 如今，行业的发展开始向金融、电信、物联网、零售、制造等传统行业倾斜，这些行业与二十年前的互联网相比，更加注重数据可靠性、安全性、规范性。
2. 疫情以来，企业基础设施的现代化要求加速提上议程，旨在让企业更加灵活，并对快速变化的客户需求做出反应。而承担这些项目的全球系统集成商们，往往选择应用最容易部署的技术，从而为其服务带来最佳利润，然而，商业版 MySQL 是需要付费的，且 MySQL 对于多语言的支持明显存在自身的瓶颈。
3. MySQL 的客户端遵循 GPL 许可协议，所以开发人员必须向 Oracle 付费或者将自己的应用程序开源。而 PostgreSQL 采用类似 MIT 的许可协议，允许开发人员做任何事情，包括在开源或闭源产品中商用。从这个层面讲，不管出于商用还是其他，PostgreSQL 都是最有利的选择。

## PostgreSQL
前面我们从开源热情、行业发展、商用的角度分析了 MySQL 停滞的原因。这里我们以开发者的视角，具体列举一些 PostgreSQL 的好处：
1. 支持多种可用于商业解决方案的性能优化，包括地理空间数据支持、无读锁并发等，被广泛应用于大型系统；
2. 对于需要执行复杂查询的系统最为有利；
3. 在商业智能（BI）应用程序中表现良好，更适合需要快速读/写速度的数据分析和数据仓库应用程序，因此，它也适用于 OLTP/OLAP 系统；
4. 可以在单个产品中存储结构化和非结构化数据类型，它支持大多数数据类型，比如对 JSON 的支持。多年来 PostgreSQL 的最大创新之一是在其 PostgreSQL 9.2 中引入了生成 JSON 数据功能。

![640.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f62bac79df704718a462df5f9c8bd744~tplv-k3u1fbpfcp-watermark.image?)

另外，云计算公司 Joyent 的解决方案工程总监 Elijah Zupancic 也提到了文档的重要性，“从开发的角度来看，使用它是一种乐趣，其文档很精彩，数据类型反映了开发人员的工作类型。”