---
date: 8:33 2023/5/1
title: Shell 脚本和编程 ｜ 青训营笔记
tags:
- Linux
description: Shell 脚本是一种用Shell脚本语言编写的程序，它可以在 UNIX 或类 UNIX 操作系统上运行。Shell 脚本通常用于自动化任务、管理系统和编写小型应用程序。Shell 脚本可以完成许多任务，例如文件操作、进程管理、网络管理、系统配置等。
---
## 介绍
1. Shell 脚本是一种用Shell脚本语言编写的程序，它可以在 UNIX 或类 UNIX 操作系统上运行。Shell 脚本通常用于自动化任务、管理系统和编写小型应用程序。Shell 脚本可以完成许多任务，例如文件操作、进程管理、网络管理、系统配置等。
2. Shell 脚本语言基于命令行界面，它使用 Shell 解释器（例如 Bash）解释 Shell 脚本语言。
3. Shell 脚本语言的语法非常简单，可以包含各种命令和操作，例如条件语句、循环语句、函数、变量和输入/输出操作等，易于学习和使用。

### 学习 shell 的价值
1. Linux 服务器的基本操作和管理。
2. 前端 node.is 服务的进程管理、问题排查、资源监控等运维操作。
3. 使用 shell 编写 TCE、SCM、Docker 脚本，完成服务编译和部署。

## 概念
**物理终端 =>  软件终端 tty => 终端模拟器  =>  Shell**

- 终端：获取用户输入，展示运算结果的硬件设备。
- tty：teletypeWriter 的简称，和终端等价，早期指电报打印机，在 linux 中是输入输出环境。
- 终端模拟器：Mac Terminal、iTerm2 等，关联虚拟 tty 的输入输出软件。
- Shell：command interpreter，处理来自终端模拟器的输入，解释执行之后输出结果给终端。
- Bash：Shell 的一种具体实现。

## 流程
1. tty 或者说终端最开始指的是获取用户输入并输出的物理设备， 比如电传打字机。
2. 在 linux 中是接收用户输入、输出结果的终端仿真软件， 比如我们用的 mac terminal、 iterm2 等， 更强输入辅助功能、画面绘制输出的模拟终端器；
3. 而 tty 变成一个虚拟概念， 是 linux 的一个程序，每个终端模拟器关联一个虚拟 tty，和内核打交道。
4. 我们可以在终端模拟器中输入 tty 查看关联到的虚拟 tty bash 是 shell 的一种具体实现, 可以理解成实例和类的关系。

## 发展
1. Ken Thompson（来自贝尔实验室）在 1971 年为 UNIX 开发了第一个 shell，称为 V6 shell
2. Stephen Bourne 在贝尔实验室 为 V7 UNIX 所开发的 Bourne shell，即 sh
3. 开源组织 GNU 为了取代 Bourne shell 开发的 Bourne-Again shell，即 Bash
> 除了替代 v6 shell，sh 还有几个优点，把控制流程，循环，变量引入了脚本，提供了一种更具功能性的语言
> 
> 主流 Linux 系统使用的 shell，许多都以它为锚点。
> 
> bash是 sh 的超集，可以直接执行大部分 sh 脚本。
> Bash 在兼容 Bourne shell 脚本编程的同时，集成了 Korn shell 和 C shell 的功能，包括命令历史，命令行编辑，目录堆栈（pushd 和 popd），一些实用环境变量，命令自动补全等。

## 语法
1. shell 不仅提供了与内核和设备交互的方法，还集成了一些今天软件开发中通用的设计模式（比如管道和过滤器），具备控制流程，循环，变量，命令查找的机制。
2. 既是命令解释器，也是一门编程语言，作为命令解释器，它提供给用户接口，使用丰富的 GNU 工具集，第三方的或者内置的，比如 cd、pwd、exec、test、netstat 等。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/451e053dc7664f5f8e64bc56e33c224b~tplv-k3u1fbpfcp-watermark.image?)

### 变量

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e6ebbf7259bf4684b83f5dd58aacd3b8~tplv-k3u1fbpfcp-watermark.image?)

### 父子 Shell 的关系

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a8b1f909185d40d18eaec097ad30176f~tplv-k3u1fbpfcp-watermark.image?)

### 自定义变量
**declare [+/-] 选项 变量**

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3cbb1b735fe641a7a72a61a40feeb16d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2b81ba49314644d296e57dc219a859a0~tplv-k3u1fbpfcp-watermark.image?)

## 环境变量
Bash Shel 在启动时总要配置其运行环境，例如初始化环境变量、设置命令提示符、指定系统命令路径等。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d5ba89f74c9480a8a362ac715efd47c~tplv-k3u1fbpfcp-watermark.image?)

## 配置文件加载
1. 通过系统用户登录默认运行的 shell
2. 非登录交互式运行 shell
3. 执行脚本运行非交互式 shell

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/e4685f933d834ff4a781b523f538975e~tplv-k3u1fbpfcp-watermark.image?)

> 如果取得 bash 需要完整的登录流程，我们称之为 login shell，比如 ssh 远程登录一台主机。不需要登录的 bash 我们称为 non-login bash，比如在原来的 bash 中执行 bash开启子进程、 执行一些外部命令。如果修改了配置文件，不会立即生效，需要我们重启终端或者执行 source 命令。

```sh
source ~/bashrc
```

## 运算符和引用
1. 双引号：部分引用，使用这种引用时，`$`、\`(反引号)、\\(转义符) 这 3 个还是会解析成特殊的意义
2. 单引号：完全引用，只原样输出
3. 反引号：执行命令

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/fb041940c17347bf890a586052cc1bde~tplv-k3u1fbpfcp-watermark.image?)

> cmd & 实现让命令在后台运行：
> 
> 使用方法一的时候，当我们关闭终端，命令就会停止运行。加上nohup可以在关闭终端后不停止命令

## 管道与管道符 |
如果需要互通，比如第一个命令的返回传递给第二个命令，就需要用到管道了。管道的本质就是将多个程序进行了一个连接，和信号一样，也是进程通信的方式之一。
1. 作用：将前一个命令的结果传递给后面的命令
2. 语法: cmd1 | cmd2
3. 要求:管道右侧的命令必须能接受标准输入才行，比如 grep 命令，ls、mv等不能直接使用，可以使用 xargs 预处理注意: 管道命令仅仅处理 stdout，对于 stderr 会予以忽略，可以使用 set-o pipefail 设置 shell 遇到管道错误退出

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/abd592a75e6a4b3690b0d5d3ca7eb377~tplv-k3u1fbpfcp-watermark.image?)

## 重定向
输出重定向符号：
1. `v`：覆盖写入文件
2. `>>`：追加写入文件
3. `2>`：错误输出写入文件
4. `&>`：正确和错误输出统一写入到文件中

输入重定向符号：`>` 和 `>>`。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ffc91cb4374743518376b962c830e565~tplv-k3u1fbpfcp-watermark.image?)

> 每个 shell 命令在执行时都会打开三个文件描述符， 文件描述符 0、1、2， 分别对应 stdin、stdout、stderr， 这三个文件描述符默认默认指向 终端输入、终端输出，那么当命令需要获取输入的时候，它会去读取 fd0， 当要输出的时候它会像 fd1、fd2写入， 改变这些描述符指向的行为叫做重定向
> 
> 2>&1 必须写在 > 之后
> 
> << 比较特殊， 表示继续沿用当前的标准输入， 只是当识别到指定的标识符后停止， 将接收到的内容作为 stdin
> 
> 实例: 用户在命令行输入内容，当输入 EOF 的时候停止， 所输入的内容写入 foo.txt

## 判断命令
shell 中提供了 `test`、`[`、`[[` 三种判断符号，可用于：
1. 整数测试
2. 字符串测试
3. 文件测试

语法:
1. `test condition`
2. `[ condition ]`
3. `[[ condition ]]`

注意：
1. 中括号前后要有空格符
2. `[` 和 `test` 是命令只能使用自己支持的标志位，`<`、`>`、`=` 只能用来比较字符串
3. 中括号内的变量，最好都是用引号括起来
4. `[[` 更丰富，在整型比较中支持 `<`、`>`、`=`，在字符串比较中支持 `=`、`~` 正则

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ec6aae195eb240cdbbb7c9ae8bbe158d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6f2fd1e577c64b4f84591280016f45a6~tplv-k3u1fbpfcp-watermark.image?)

> 根据程序是否正常执行（程序退出的状态）进行判断：
> 1. exit：手动退出 shell 的命令
> 2. exit 10 返回 10 给 shell，返回值非 0 为不正常退出
> 3. $? 用于判读昂当前 shell 前一个进程是否正常退出（非 0 为不正常退出）

## 分支语句
语法1:
```
if condition ;then
程序段
elif condition ; then
程序段
esle
程序段
fi
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ed4ffaff364a42778f17212d1eda5b41~tplv-k3u1fbpfcp-watermark.image?)

语法2:
```
case $变量 in:
"第一个变量内容")
程序段
;;
"第一个变量内容")
程序段
;;
*)
程序段
esac
```

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a39552b07b4c4095a666374938e81745~tplv-k3u1fbpfcp-watermark.image?)

## 循环
1. while循环

    condition ; do 程序段; donewhile
2. unti1循环（当条件成立的时候跳出循环，与 while循环相反）

    until condition ; do 程序段; done
3. for循环

    for var in [words...];do 程序段:done

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/be81c61cdedd4273a4a4f40420581c35~tplv-k3u1fbpfcp-watermark.image?)

## 函数
1. 语法一：

    funcName() echo "abc";
2. 语法二：

    function funcName() { echo "abc"; }

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/85f74524ba664ac597ab65832559b13a~tplv-k3u1fbpfcp-watermark.image?)

3. 函数也是命令

    1. exit：手动退出 shell 、命令
    2. exit 10 返回 10 给 shell，返回值非 0 为不正常退出
    3. $? 用于判读昂当前 shell 前一个命令是否正常退出（非 0 为不正常退出）

    为了函数内定义的变量不污染全局， 我们最好使用 local 去定义， 或者在函数退出之前使用 unset 去处理一下

> 注意：
> 1. shell 自上而下执行，函数必须在使用前定义
> 2. 函数获取变量和 shell script 类似，$0 代表函数名， 后续参数通过 $1、$2 ...获取
> 3. 函数内 retun 仅仅表示函数执行状态，不代表函数执行结果
> 4. 返回结果一般使用 echo、printf， 在外面使用 $0 获取
> 5. 结果如果没有 return ，函数状态是上一条命令的执行状态，存储在 $? 中

## 模块化
模块化的原理是在当前 she11 内执行函数文件，方式：`source [函数库的路径]`。

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b8eccf571ccc4ec89902eb639d4f5a44~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/cf34b723d8c14a98a6c11118a73514ce~tplv-k3u1fbpfcp-watermark.image?)

## 常用命令

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/12b64125a88d40c199b04ce442c4d34c~tplv-k3u1fbpfcp-watermark.image?)

## 执行
1. shell 脚本文件一般以 `.sh` 结尾，也可以没有，这是一个约定; 第一行需要指定用什么命令解释器来执行。`#!` 是内核识别并选择合适的解释器之后，将文本文件再交给解释器执行。

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d57c43f8c50a4f12b7d5b0ad47cca008~tplv-k3u1fbpfcp-watermark.image?)

2. 启动方式：

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/bd3f509d339c466d9cfff7ec11921f4c~tplv-k3u1fbpfcp-watermark.image?)

## Shell 展开
1. 大括号展开 (Brace Expansion) {...}
2. 波浪号展开 (Tilde Expansion) ~
3. 参数展开 (Shell Parameter Expansion)
4. 命令替换 (Command Substitution)
5. 数学计算 (Arithmetic Expansion) $((..))
6. 文件名展开 (Filename Expansion) *?[..] 外壳文件名模式匹配

## 调试和前端集成
1. 普通 log，使用 echo、printf

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ce4ee0aa2f5942c8898d1d840a00deef~tplv-k3u1fbpfcp-watermark.image?)
2. 使用 set 命令

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/eb10427459c641d39e5e976d6e0e2443~tplv-k3u1fbpfcp-watermark.image?)
3. vscode debug 插件

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/6cea617816854762bb1731b09488edfa~tplv-k3u1fbpfcp-watermark.image?)

4. node

    1. node中通过 exec、spawn 调用 shell 命令
    2. shell 脚本中调用 node 命令
    3. 借助 zx 等库进行 javascript、 shell script 的融合

        1. 借助 shell 完成系统操作，文件io、内存、磁盘系统状态查借助 nodejs 完成应用层能力， 网络io、计算等
        2. 借助 shell 完成系统操作，文件io、内存、磁盘系统状态查借助 nodejs 完成应用层能力， 网络io、计算等

![image.png](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/8d714dd27df54f7b8eece8ab3c038d7d~tplv-k3u1fbpfcp-watermark.image?)

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/26ff6c607ebf4aff971e6edb2f06c765~tplv-k3u1fbpfcp-watermark.image?)

> exec 启动一个子 shell 进程执行传入的命令，并且将执行结果保存在缓冲区中， 并且缓冲区是有大小限制的，执行完毕通过回调函数返回， 
> 
> spawn 默认不使用 shell，而是直接启动子进程执行命令，且会直接返回一个 流对象，支持写入或者读取流数据，这个在大数据量交互的场景比较适合

## 总结
shell 的思想和语法和传统的编程语言不太一样，强调一条语句只干一件事，所以万物皆命令， 在执行过程中也是逐行、逐个连接符、逐个空格的解析出最小化的命令执行，执行完之后再解析下一句。了解 shell 的配置加载、执行方式、执行过程、命令解析过程、 必要的语法、常用命令，可以方便的写出自己的自动化脚本。
