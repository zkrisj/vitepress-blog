---
date: 8:35 2023/5/1
title: 计算机网络概论 ｜ 青训营笔记
tags:
- 术语
description: 建立对计算机网络的整体认知，对计算机网络中的各种概念（网络分层、网络协议、网络应用等)有初步的理解，进而可以在后续的实际工作中能高效解决网络问题。
---
## 介绍
建立对计算机网络的整体认知，对计算机网络中的各种概念（网络分层、网络协议、网络应用等)有初步的理解，进而可以在后续的实际工作中能高效解决网络问题。

## 课程内容
1. 通过一个示例建立对计算机网络的整体认识
2. 建立对网络协议分层的认知
3. 分析 HTTP1、2、3的关系
4. 介绍 CDN 运行的基本原理
5. 了解网络安全的最基本原则

但不包括：
1. 详细描述如何开发一个基于HTTP协议（或者其他协议)的网络应用
2. 深入介绍课程中所涉及协议的规范（Specification）内容和实现细节

### 分析方法
1. 自底向上

    - 从简单开始，逐渐变复杂
    - 将模块逐步拼凑成一个系统

2. 自顶向下

    - 从复杂开始，逐渐变简单
    - 从复杂的系统问题入手，拆分为模块问题

## 蟹堡王帝国
蟹老板想挣一个“小目标”，三步走战略：
1. 在比奇堡开通外卖
2. 在北京和上海开分店
3. 在全国开分店并开通外卖

## 计算机网络基础
### 网络组成部分
1. 主机：客户端和服务端
2. 路由器
3. 网络协议

### 网络结构：网络的网络
1. 比奇堡和小区网络：本地网络
2. 北京和上海分店+比奇堡：三个本地网络节点的网络
3. 全国通信网络：本地网络的网络
4. 区域网络、城域网和广域网

### 网络分层
1. 快递员不关心包裹内容
2. 卡车司机不关心车厢里拉的是什么
3. 高速公路不关心开的什么车

### 协议
协议的存在依赖于连接。
```
01001000011001010110110001101100011011110010110000100000
010101110110111101110010011011000110010000100001
7210110810811144328711111410810033
H e l l o ,  W o r l d !
```
协议定义了在两个或多个通信实体之间交换的报文**格式**和**顺序**，以及报文发送和接受一条报文或其他事件所采取的动作。

### 标头和载荷
收件人、寄件人关注：
1. 收件地址、寄件地址
2. 收件人、寄件人的姓名和电话
3. 包裹内容

快递公司关注：
1. **收件人、寄件人关注的东西**
2. 该由哪个集散点发出，哪个集散点收
3. 哪个网点派送

### HTTP 协议示例
#### 链路层-本地帧头部

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7c1335ac5bff43fd9ecb8c3693c44dc9~tplv-k3u1fbpfcp-watermark.image?)

#### 链路层-IP协议头部

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ebc835e0fa1441b3925b8e45aa3e9e6a~tplv-k3u1fbpfcp-watermark.image?)

#### 运输层-TCP协议头部

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/77979a6e444046aa921a8b51314a161f~tplv-k3u1fbpfcp-watermark.image?)

#### 应用层-HTTP协议头部

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/793ab70627f34bd89de0615922c1797b~tplv-k3u1fbpfcp-watermark.image?)

#### TCP 协议格式

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/425584abd44e4eef9b2276f6d8deed99~tplv-k3u1fbpfcp-watermark.image?)

### 小结
1. 网络组成部分：由主机、路由器、交换机等组成
2. 网络结构：网络的网络
3. 信息交换方式：电路交换和分组交换
4. 网络分层：分清职责，物理层、链路层、网络层、运输层和应用层
5. 网络协议：标头和载荷

## Web 中的网络
### HTTP 协议

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/418b22e2977842b28ab7ffbcb49f4159~tplv-k3u1fbpfcp-watermark.image?)

### HTTP 连接模型

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2641fa70ba644866b476cfee5e2ddc63~tplv-k3u1fbpfcp-watermark.image?)

> 队头堵塞（Head of Line Blocking）

### HTTP1.1：无法多路复用

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b470c4b24d84055a70e5b3b2998b826~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fdc41c1e899a40d8ad182cb061e16402~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e9381e0d0de84f2c9e7779017464e949~tplv-k3u1fbpfcp-watermark.image?)

### HTTP2：帧

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/964d8627daaa46129a01c7d2bf929558~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/87c5fa37ac684d54bee4185cc9089b64~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ef93a88a90084d4e93ae5a89153c6805~tplv-k3u1fbpfcp-watermark.image?)

### HTTP2：帧带来的额外好处
1. 调整响应传输的优先级
2. 头部压缩
3. Server Push

### HTTP2：3RTT启动（HTTP 2：队头堵塞，但是在 TCP 上）
1. HTTP客户端：我要和大哥说话！
2. TCP客户端默默对HTTP客户端说，我知道你很急，但你先别急。
3. TCP客户端：嗨！服务端，你在吗？
4. TCP服务端：嗨！客户端，我在，你在吗？
5. TLS客户端：Helo!能给我把钥匙吗？
6. TLS服务端：Hello!给！你的钥匙！
7. HTTP客户端：终于到我了，我要index.html!

### HTTP3：QUIC
1. Quick UDP Internet Connection
2. 现存网络设备对TCP和UDP支持已经僵化
3. UDP不靠谱但是QUIC靠谱
4. QUIC可以为除HTTP协议以外的应用层协议提供支持

### HTTP 3：QUIC-1 RTT
1. （QUIC第一次访问）HTTP客户端：我要和大哥说话！
2. QUC客户端：嗨！服务端，你在吗？在的话能给我把钥匙吗？
3. QU1C服务端：嗨！客户端，我在，这是你的钥匙！
4. HTTP客户端：今天这么快？我要index.html!
5. QUIC服务端（偷偷地告诉客户端）：这还有把钥匙，下次找我可以不用问，直接用。

### HTTP：QUIC-0 RTT
1. （QUIC第二次访问）HTTP客户端：我要和大哥说话！
2. QU1C客户端：嗨！服务端，你在吗？后面的话我已经用上次你给我的钥匙加密过了，HTTP那小子肯定要index.html!
3. QUlC服务端：嗨！客户端，我在，我知道你要index.html,给你！
4. HTTP客户端：？

### CDN
速度：
- HTTP 3 快吗?
- 快!
- 那从美国到中国，HTTP 3 要多久?
- 150 ms!
- 和北京到上海比，还快吗?
- 好像不够?

收费：
- 流量多少钱一个 G?
- 1块
- 那我在北京给工海的人发一部 10 G 电影得 10 块?
- 对!
- 发10 次一样的电影要 100 块?
- 是的!
- 我都发到上海了，不能内部共享下吗?

流量：
- 我们有几台服务器?
- 1台
- 他能抗多少流量?
- 100G!
- 双一一峰值得 1000G 啊，扛得住吗?
- 不一定，可能挂.....

还得是我：
北京
上海
广州
成都
长沙
兰州
长春

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/4358d433fc0a45cd9410db944b814319~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/07844b75c45642a09ed5d324efb56fb5~tplv-k3u1fbpfcp-watermark.image?)

### DNS 劫持
1. 域名解析一般由网站自己处理
2. 要加速的域名则重定向到 CDN 厂商的域名解析服务处理
3. CDN 厂商根据来源确定最近的 CDN 服务器的 IP
4. 用户直接访问最近的 CDN 服务器

## WebSocket
1. 有状态的持久连接
2. 服务端可以主动推送消息
3. 用 WebSocket 发送消息延迟比 HTTP 低

服务端：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0f00151e74454aa4a8c7e0881d8160ee~tplv-k3u1fbpfcp-watermark.image?)

客户端：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7150df25487a41fd97e7dc6e5d53c337~tplv-k3u1fbpfcp-watermark.image?)

请求头：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6843c6469eb848c69f4c0c9c8aefc2f6~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7cfb22bf64fb42b581e5a605c4f0b64a~tplv-k3u1fbpfcp-watermark.image?)

响应头：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/22fb1c17648945e985f23abd8f83a08a~tplv-k3u1fbpfcp-watermark.image?)

客户端消息：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50a8d3d329e34ecb9910ae71354117f4~tplv-k3u1fbpfcp-watermark.image?)

服务端消息：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec5af4b739e14a9e8d0f0d27302419f4~tplv-k3u1fbpfcp-watermark.image?)

## 网络安全
1. 网络安全三要素: 机密性、完整性和身份验证
2. 在没有提前交换秘密信息的前提下，无法在不安全的信道交换秘密信息
3. PKI 保证了普通用户不需要”面对面”和根证书机构交换根证书
4. HTTPS 使用 PKI 完成了除客户端身份验证以外的特性，客户端身份验证靠HTTP 协议实现

## 总结
1. HTTP 1 2 3 的演进历史。
2. CDN 解决了 HTTP 协议之外的问题。
3. WebSocket 从 HTTP 协议升级而来。
4. 网络安全三要素：
    1. 机密性: 攻击者无法获知通信内容
    2. 完整性:攻击者对内容进行篡改时能被发现
    3. 身份验证: 攻击者无法伪装成通信双方的任意一方与另一方通信
