---
date: 22:39 2023/3/22
title: Windows 系统中的硬链接和软链接
tags:
- 工具
- nodeJS
description: 在 Windows 上使用符号链接至少可以说是有问题的，所以 pnpm 在 Windows 上使用连接点链接来代替符号链接。
---
## 介绍
NTFS 支持四种类型的链接：硬链接、符号链接、连接点链接、卷安装点。  
Windows NT 3.1 及后续版本支持 NTFS 硬链接；  
Windows 2000 开始支持连接点链接；  
Windows Vista 开始，符号链接在 NTFS 中可用。

## mklink
mklink 是 Windows 下用于创建链接的 cmd 内置命令，存在于 Windows Vista 及以后版本的 Windows 操作系统中。

命令格式
```
mklink [[/d] | [/h] | [/j]] <link> <target>
```
如果不指定 [/D] | [/H] | [/J] 参数，默认为创建文件符号链接。

| 参数       | 说明                            |
| ---------- | ----------------------------- |
| /d         | 创建目录符号链接。 |
| /h         | 创建硬链接而不是符号链接。                 |
| /j         | 创建目录连接点。                      |
| `<link>`   | 指定要创建的符号链接的名称。                |
| `<target>` | 指定新符号链接引用的路径 (相对或绝对) 。        |
| /?         | 在命令提示符下显示帮助。 |

使用 mklink 创建符号链接和连接点链接的时候，操作系统并不会检查目标是否存在，所以可以创建指向不存在的目标的符号链接。使用 mklink 创建硬链接时，如果目标不存在，会显示：系统找不到指定的路径。

删除文件符号链接和硬链接使用 del 命令，具体语法如下：
```
del \MyFile.file
```
删除目录符号链接和连接点链接使用 rd 命令，具体语法如下：
```
rd \MyFolder
```

## 硬链接
[硬链接（hard link）](https://docs.microsoft.com/zh-cn/windows/win32/fileio/hard-links-and-junctions)，多个文件平等地共享同一个文件存储单元（Windows 中的 MFT 条目、Unix/Linux 中的 inode）。
1. 只能用于同一个文件系统（对于 NTFS 是限制于同一个磁盘分区）；
2. 硬链接只能用于文件，不能用于目录，因为其父目录就有歧义了。
3. 可以用不同的文件名访问同样的内容；
4. 对文件内容进行修改，会影响到所有文件名；
5. 删除一个文件名，不影响另一个文件名的访问。

在根目录创建硬链接。当修改 MyFile.file 时，example.file 会同步变化，反之亦然。当删除 MyFile.file 时，example.file 不会删除，反之亦然。
```
mklink /h \MyFile.file \Users\User1\Documents\example.file
```
如果使用硬链接链接到目录，显示：拒绝访问。
```
mklink /h \MyFolder \Users\User1\Documents
```
如果使用硬链接链接到其他磁盘分区目录，显示：系统无法将文件移到不同的磁盘驱动器。
```
mklink /h C:\2.txt E:\1.txt
```

## 符号链接
[符号链接（symbolic link）](https://docs.microsoft.com/zh-CN/windows/win32/fileio/symbolic-links)，是指向另一个文件系统对象的文件系统对象。指向的对象称为目标。符号链接旨在帮助迁移和应用程序与 UNIX/Linux 操作系统的兼容性，使其功能与 UNIX/Linux 符号链接一样。

在根目录创建文件符号链接：
```
mklink \MyFile.file \User1\Documents\example.file
```
在根目录创建目录符号链接：
```
mklink /d \MyFolder \Users\User1\Documents
```
> 符号链接允许跨主机和网络文件共享。

### 快捷方式
快捷方式（shortcut）是一种功能上类似符号链接的文件对象，但与符号链接有本质的不同。
1. 快捷方式是普通的扩展名文件（拥有扩展名 .lnk），而非符号，有文件大小。
2. 快捷方式可以指向文件、文件夹或其他任何系统中合法的位置（包括控制面板、桌面等）。
3. 如果快捷方式指向可执行程序，则可以同时指定启动的命令行参数以及启动位置。
4. 快捷方式文件可以在任何文件系统（比如早期的 FAT32）下创建。

## 连接点链接
[连接点（NTFS junction point）](https://docs.microsoft.com/zh-cn/windows/win32/fileio/hard-links-and-junctions#junctions)，也称为软链接，类似于符号链接，但只支持目录，可以链接位于同一台计算机上不同本地卷上的目录。结点的操作与硬链接相同。

在根目录创建连接点链接：
```
mklink /j \MyFolder \Users\User1\Documents
```
> 在 Windows 上使用符号链接至少可以说是有问题的，[pnpm 在 Windows 上使用连接点链接来代替符号链接](https://pnpm.io/zh/faq#%E8%83%BD%E7%94%A8%E4%BA%8Ewindows%E5%90%97)。
