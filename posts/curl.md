---
date: 23:39 2023/3/21
title: 学会 curl 几个常用命令，可以代替 POSTMAN，apipost 等工具
tags:
- 工具
description: URL 命令行工具，cmd 和 powershell 中都可用。支持多种通信协议，包括 DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SBMS, SMTP, SMTPS, TELNET 和 TFTP。
---
## 介绍
URL 命令行工具，cmd 和 powershell 中都可用。支持多种通信协议，包括 DICT, FILE, FTP, FTPS, GOPHER, HTTP, HTTPS, IMAP, IMAPS, LDAP, LDAPS, POP3, POP3S, RTMP, RTMPS, RTSP, SCP, SFTP, SMB, SBMS, SMTP, SMTPS, TELNET 和 TFTP。

##### 查看网页源码
```
curl https://www.baidu.com
保存到文件
curl https://www.baidu.com -o 1.html
```

##### 获取头信息
```
curl https://www.baidu.com -i
curl https://www.baidu.com -I
```

##### 显示通信过程
```
curl https://www.baidu.com -v
保存到文件
curl https://www.baidu.com --trace 1.txt
curl https://www.baidu.com --trace-ascii 1.txt
```

##### HTTP动词(必须大写)
```
curl http://localhost:8080/secret -X POST
```

##### 传参数
-G 参数用来构造 URL 的查询字符串，如果省略 -G，会发出一个 POST 请求。-d 参数会自动加上标头 Content-Type:application/x-www-form-urlencoded，并且自动将请求转为 POST 方法，因此可以省略 -X POST。
```
curl "http://localhost:8080/process_get?first_name=a&last_name=b"
curl http://localhost:8080/process_get -G -d first_name=a -d last_name=b
curl http://localhost:8080/process_post -d "first_name=a&last_name=b"
从文件读取参数
curl http://localhost:8080/process_post -d @1.json
多个参数
curl http://localhost:8080/process_post -d first_name=a -d last_name=b
curl http://localhost:8080/process_post -F first_name=a -F last_name=b
```

##### 增加头信息
```
curl http://localhost:8080/process_post -d {\"first_name\":\"a\",\"last_name\":\"b\"} -H Content-Type:application/json
```

##### 文件下载
```
单个文件
curl -o 1.png https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/default.640d9a7.png
单个文件并使用源文件名
curl -O https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/default.640d9a7.png
多个文件
curl -o 1.png https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/default.640d9a7.png -o 2.png https://www.denojs.cn/img/logo.png
多个文件并使用源文件名
curl --remote-name-all https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/img/default.640d9a7.png https://www.denojs.cn/img/logo.png
```

##### 文件上传
-F 参数会自动加上标头Content-Type:multipart/form-data，默认把 MIME 类型设为application/octet-stream。@ 之后的路径为当前路径的相对路径。
```
curl http://localhost:8080/file_upload -F image=@Pictures/debug.png;type=image/png;filename=me.png
多个文件
curl http://localhost:8080/file_upload -F image=@Pictures/debug.png -F image=@Pictures/微信图片_20220621144632.jpg
```

##### 重定向
有些网络资源访问的时候必须经过另外一个地址跳转过去，这用术语来说是：referer。
```
curl http://localhost:8080 -e http://www.example.com
相当于
curl http://localhost:8080 -H 'Referer:http://www.example.com'
```

##### 模拟 User Agent
可以针对不同设备，返回不同格式的网页。
```
curl http://localhost:8080 -A "Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.119 Safari/537.36 HBuilderX"
```

##### 发送cookie
```
curl http://localhost:8080 -b 1.txt
curl http://localhost:8080 -b id=xxx;name=xxx
```

##### 服务器认证
```
curl https://google.com/login -u name:password
curl https://bob:12345@google.com/login
只设置了用户名，执行后，会提示用户输入密码：
curl https://google.com/login -u bob
```

##### http 认证
```
curl http://www.example.com -E mycert.pem
```

##### 请求 HTTPS 并指定 HOST
https 无法通过更改 Host 头部来指定 HOST，因为 TLS 握手时拿不到 Host，一般用于测试 CDN 加速。
```
请求 http://localhost:8080 并指定 Host 为 www.baidu.com
curl http://localhost:8080 -H 'Host:www.baidu.com'
请求 https://www.baidu.com 并指定 Host 为 localhost:8080
curl https://www.baidu.com --resolve www.baidu.com:443:localhost:8080
```

##### 跳过 SSL 检测
```
curl https://www.baidu.com -k
```

##### 跟随重定向
```
curl https://api.twitter.com/tweet -L -d 'tweet=hi'
```

##### 模拟慢网速(单位为每秒)
```
curl https://www.sina.com.cn --limit-rate 20k
```

##### 代理(协议默认为 HTTP)
```
curl https://www.example.com -x socks5://james:cats@myproxy.com:8080
```

##### 缩写
```
-#, --progress-bar
-A, --user-agent
-b, --cookie
-d, --data
-E, --cert
-e, --referer
-F, --form
-G, --get
-H, --header
-h, --help
-I, --head
-i, --include
-k, --insecure
-L, --location
-O, --remote-name
-o, --output
-u, --user
-V, --version
-v, --verbose
-X, --request
-x, --proxy
```