---
date: 8:29 2023/5/1
title: Linux 基础 ｜ 青训营笔记
tags:
- Linux
description: Linux 是由内核(kernel)、 shell(命令解释器)、文件系统和应用程序等组成的操作系统。它提供了丰富的工具和命令行界面，使用户能够轻松地管理和控制计算机系统。
---
## 介绍
Linux 是由内核(kernel)、 shell(命令解释器)、文件系统和应用程序等组成的操作系统。它提供了丰富的工具和命令行界面，使用户能够轻松地管理和控制计算机系统。

Linux 具有稳定性高、安全性强、灵活性好、可靠性高等优点，同时还支持多任务处理和多用户操作，可以满足各种不同需求的用户。

Linux 操作系统被广泛应用于服务器、超级计算机、移动设备和嵌入式设备等领域，并且也逐渐普及到个人电脑的市场。

### 学习价值
1. Linux 是现代化应用程序交付的首选平台，无论是部署在裸机、虚拟化还是容器化环境。
2. 公司内部服务（TCE、FaaS、SCM）统一使用 Debian Linux 系统。
3. 熟悉 Linux 基础指令，熟练运维前端常用服务（Nginx、Node.js）。
4. 加深对操作系统概念和实现的理解，夯实基础知识。

## Logo
1. 企鹅是南极洲的标志性动物，根据国际公约，南极洲为全人类共同所有，不属于当今世界上的任何国家。
2. Linux 选择企鹅图案作标志，其含意也是表明：开源的 Linux 为全人类共同所有，任何公司无权将其私有。

## 计算机组成

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/39d7ff22cb554e29b7fbd34692968115~tplv-k3u1fbpfcp-watermark.image?)

1. 控制器
2. 运算器
3. 存储器单元
4. 输入单元
5. 输出单元

## 操作系统（Operating System，OS）

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/98c99177e158407aa54df8bd8b6e7388~tplv-k3u1fbpfcp-watermark.image?)

管理和控制计算机系统中的硬件和软件资源，用于在用户与系统硬件之间传递信息。操作系统是用于管理和控制计算机系统中的硬件和软件资源，用于在用户与系统硬件之间传递信息。操作系统主要提供了两个方面的能力，一个是管理计算机资源，包括处理器管理、存储管理、设备管理、文件管理等，另外一个能力是提供格种的用户接口，包括命令接口、图形用户接口、程序调用接口，实现外部程序与操作系统内核的交互。目前主流的计算机操作系统包括 mac 系统、linux 系统、windows、手机端安卓系统。

## 操作系统启动流程
程序启动必须有操作系统来执行，那操作系统本身也是一个程序，那是如何在开机时被执行的呢？

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3a7f0b734b624df0bda287e47e986285~tplv-k3u1fbpfcp-watermark.image?)

## 发展简史
1. 1969年，Unix 诞生于贝尔实验室
2. 1984年，贝尔实验室将 Unix 商业化
3. 1984年，Tanenbaum 开发 Minix 操作系统用于教学并开放源码
4. 1984年，Richard M.Stallman 发起自由软件(FSF)与 GNU 项目，起草 GPL(通用公共许可)
协议
5. 1991年，Linus Torvalds 受 Minix 影响实现初版的 Linux 内核
6. 1992年，Linux 内核以 GPL 协议发行V1.0

## Linux 版本

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/68345e1fa59a4ad0a099cf7f8a987ed7~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/0b3069fc2ef84ea7957ab9a7132a4449~tplv-k3u1fbpfcp-watermark.image?)

查看内核版本：

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6c12e182b1d47689cb364a4a911f2d7~tplv-k3u1fbpfcp-watermark.image?)

查看系统版本：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e905707b9ed74eedb39ba9c2917e7684~tplv-k3u1fbpfcp-watermark.image?)

## 应用领域
1. 服务器（操作系统、虚拟化和云计算）
2. 嵌入式和智能设备
3. 个人办公桌面
4. 学术研究与软件研发

## 基本组成

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/13cb905af85446cf90b8cea547391391~tplv-k3u1fbpfcp-watermark.image?)

1. 内核
2. shell
3. 文件系统
4. 应用程序

### 内核

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2a944ae9e16644f8bc12ee4105a60214~tplv-k3u1fbpfcp-watermark.image?)

1. 内核是硬件与软件之间的中间层
2. 内核是一个资源管理程序
3. 内核提供一组面向系统的命令

### 文件系统
文件系统负责管理持久化数的子系统，负责把用户的文件存到磁盘硬件中。

Linux 中一切皆文件：
![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50401d1e102044a781af9bf0e84b83e5~tplv-k3u1fbpfcp-watermark.image?)

Liux文件系统是采用树状的目录结构，最上层是/（根）目录。

/bin：
bin 是 Binaries (二进制文件) 的缩写, 这个目录存放着最经常使用的命令。

/boot：
这里存放的是启动 Linux 时使用的一些核心文件，包括一些连接文件以及镜像文件。

/dev ：
dev 是 Device(设备) 的缩写, 该目录下存放的是 Linux 的外部设备，在 Linux 中访问设备的方式和访问文件的方式是相同的。

/etc：
etc 是 Etcetera(等等) 的缩写,这个目录用来存放所有的系统管理所需要的配置文件和子目录。

/home：
用户的主目录，在 Linux 中，每个用户都有一个自己的目录，一般该目录名是以用户的账号命名的。

/lib：
lib 是 Library(库) 的缩写这个目录里存放着系统最基本的动态连接共享库，其作用类似于 Windows 里的 DLL 文件。几乎所有的应用程序都需要用到这些共享库。

/mnt：
系统提供该目录是为了让用户临时挂载别的文件系统的，我们可以将光驱挂载在 /mnt/ 上，然后进入该目录就可以查看光驱里的内容了。

/opt：
opt 是 optional(可选) 的缩写，这是给主机额外安装软件所摆放的目录。比如你安装一个ORACLE数据库则就可以放到这个目录下。默认是空的。

/proc：
proc 是 Processes(进程) 的缩写，/proc 是一种伪文件系统（也即虚拟文件系统），存储的是当前内核运行状态的一系列特殊文件，这个目录是一个虚拟的目录，它是系统内存的映射，我们可以通过直接访问这个目录来获取系统信息。

/root：
该目录为系统管理员，也称作超级权限者的用户主目录。

/sbin：
s 就是 Super User 的意思，是 Superuser Binaries (超级用户的二进制文件) 的缩写，这里存放的是系统管理员使用的系统管理程序。

/usr：
 usr 是 unix shared resources(共享资源) 的缩写，这是一个非常重要的目录，用户的很多应用程序和文件都放在这个目录下，类似于 windows 下的 program files 目录。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c87487620daa47068073aa52566a2c05~tplv-k3u1fbpfcp-watermark.image?)

### Linux 有这么多不同的文件系统，如何实现对用户提供统一调用接口的？
#### 虚拟文件系统 (VFS)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4ccad663d094b1d8ec2ca708baaf8f4~tplv-k3u1fbpfcp-watermark.image?)

1. 对应用层提供一个标准的文件操作接口
2. 对文件系统提供一个标准的文件接入接口

> 虚拟文件系统使得Linux可以存在多个“实际的文件系统”，比如分区1是ext2，分区2是ext3，分区3是fat32。那么每个“实际的文件系统”的结构和操作方式是不一样的。如果是这样的话用户怎么去操作它们呢？总不能每种不同的文件系统都采用不同的方法吧，那么这个时候就需要VFS作为中间层！用户直接控制VFS，VFS再去控制各个文件系统。虚拟文件系统使得Linux可以存在多个“实际的文件系统”，比如分区1是ext2，分区2是ext3，分区3是fat32。那么每个“实际的文件系统”的结构和操作方式是不一样的。如果是这样的话用户怎么去操作它们呢？总不能每种不同的文件系统都采用不同的方法吧，那么这个时候就需要VFS作为中间层！用户直接控制VFS，VFS再去控制各个文件系统。

查看文件系统类型：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2095eea83cf949b39ecffee6fbad3125~tplv-k3u1fbpfcp-watermark.image?)

文件基本操作：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/27fecd735c7f40fc990b2d98fcf56802~tplv-k3u1fbpfcp-watermark.image?)

文件读取流程：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/646a892e6ceb4ae38c947c7824c97f26~tplv-k3u1fbpfcp-watermark.image?)

## 进程管理

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7e0503402efe4ddaa57689ab070a18bf~tplv-k3u1fbpfcp-watermark.image?)

1. 进程是正在执行的一个程序或命令
2. 进程有自己的地址空间，占用一定的系统资源
3. 一个 CPU 核同一时间只能运行一个进程
4. 进程由它的进程 ID(PID)和它父进程的进程 ID(PPID)唯一识别

查看进程信息：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b44bf74b32744ba9072d89de46a08fa~tplv-k3u1fbpfcp-watermark.image?)

进程调度是指操作系统按某种策略或规则选择进程占用CPU进行运行的过程。
1. R(TASK RUNNING)，可执行状态
2. S(TASK INTERRUPTIBLE)，可中断的睡民状态
3. D(TASK UNINTERRUPTIBLE)，不可中断的睡眠状态
4. T(TASK STOPPED or TASK TRACED)，暂停状态或跟踪状态
5. Z(TASK DEAD-EXIT ZOMBIE)，退出状态，进程成为厘尸进程
6. X(TASK_DEAD-EXIT DEAD)，退出状态，进程即将被销毁

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d9fa0ec7db6546d7b817be62cc6b1eb5~tplv-k3u1fbpfcp-watermark.image?)

进程调度原则：
1. 一个 CPU 核同一时间只能运行一个进程
2. 每个进程有近乎相等的执行时间
3. 对于逻辑 CPU 而言进程调度使用轮询的方式执行，当轮间完成侧回到第一个进程反复
4. 进程执行消耗时间和进程量成正比

进程的系统调用：
1. 内核空间 (Kernal Space) : 系统内核运行的空间
2. 用户空间 (User Space) : 应用程序运行的空间

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be0f38d367674744aed3ab1956145b2d~tplv-k3u1fbpfcp-watermark.image?)

> 当进程运行在内核空间时就处于内核态，而进程运行在用户空间时则处于用户态。

## 用户
Linux 是一个多用户的系统，我们可以多个用户同时登陆 Linux。
1. 用户账户

    - 普通用户账户：在系统中进行营通作业
    - 超级用户账户：在系统中对普通用户和整个系统进行管理
2. 用户组
    - 标准组：可以容纳多个用户
    - 私有组：只有用户自己

文件权限关于用户有三个概念：
1. 所有者：文件的所有者
2. 所在组：文件的所有者所在的组
3. 其他人：除文件所有者及所在组外的其他人

每个用户对于文件都有不同权限，包括读(R)、写(W)、执行(X)。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/25b78612770544b8a8ffa54c9f7e42ea~tplv-k3u1fbpfcp-watermark.image?)

查看用户信息：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b6681e1156cc42a5b78b831db06b7135~tplv-k3u1fbpfcp-watermark.image?)

用户权限操作：

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f6290b43734945f6a153cfd56fabb2a0~tplv-k3u1fbpfcp-watermark.image?)

## 软件包
1. 软件包

    通常指的是一个应用程序，它可以是一个 GUI 应用程、命令行工具或(其他软件程序需要的) 软件库

2. 软件包管理

    底层工具: 主要用来处理安装和删除软件包文件等任务，DPKG，RPM
    - RPM(Red Hat Package Manager),为Red hat操作系统的包管理系统
    - DPKG(Debian package),为Debian操作系统的包管理系统
    
    上层工具: 主要用于数据的搜索任务和依赖解析任务，APT，YUM，DNF

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a3209821da8841cc854130010405754e~tplv-k3u1fbpfcp-watermark.image?)

### APT 常用命令
1. 列出所有可更新的软件清单命令：apt update
2. 安装指定的软件命令：apt install<package_name>
3. 安装多个软件包：apt install<package_1><package_2><package_3>
4. 更新指定的软件命令：apt update<package_name>
5. 删除软件包命令：apt remove<package_name>
6. 查找软件包命令：apt search<keyword>
7. 列出所有已安装的包：apt list-installed

通常 Debian 系的 Linux 软件源配置文件: /etc/apt/sources.list。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b4f951c14dd34e538d0e393fe21a123e~tplv-k3u1fbpfcp-watermark.image?)

1. 镜像地址: https://mirrors.aliyun.com/
2. /dists: 查看系统代号
3. /pool: 查看软件分支

nginx 安装：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abe86367f9774ab8893efdf6d313cd62~tplv-k3u1fbpfcp-watermark.image?)

nginx 配置修改：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/1817882539c74b5996ff4682ddc4d3ff~tplv-k3u1fbpfcp-watermark.image?)
