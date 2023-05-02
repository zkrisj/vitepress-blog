---
date: 13:35 2023/5/2
title: V3 Admin Vite 接口和打包配置
tags:
- Vue
description: 部署前端到线上环境的时候，需要采用 Nginx 或其他工具来实现线上环境的反向代理。
---
## 介绍
[V3 Admin Vite](https://github.com/un-pany/v3-admin-vite) 是一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术。另外还有：
- Vue-Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

## 接口
1. 所有的请求最终都是通过 Axios 来发送的，我们可以找到封装 Axios 的文件，看见后端接口的 `baseURL` 是 `import.meta.env.VITE_BASE_API`。

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/f8f85842a20f43c2940d7bbb6b6cba4d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 可以在 `.env` 配置文件（`.env.development` 代表开发环境配置， `.env.staging` 代表预发布环境配置，`.env.production` 代表正式环境配置）中找到定义 `VITE_BASE_API` 的地方：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3871161ed651459ca040fbf25e058034~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

- 这里采用了相对路径 `/api/v1`，例如开发环境运行在 `http://localhost:3333` 路径下，也就意味着前端调用后端接口时，调用的具体的 `baseURL` 将会是 `http://localhost:3333/api/v1`。
- 登录接口的 url 是 `users/login`，也就意味着，在调用该接口时，最终请求的路径将会是：`baseURL` + 该接口的 url = `http://localhost:3333/api/v1/users/login`。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d451db34766e4cf7a8b9dbf562af2d7d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

3. 由于真实后端接口是部署在线上的，假如线上部署的登录接口完整路径是：
`https://mock.mengxuegu.com/mock/6321865fb4c53348ed2bc212/api/ul/users/login`，
那么我们可以通过反向代理来将 `http://localhost:3333` 代理到 `https://mock.mengxuegu.com/mock/63218b5fb4c53348ed2bc212`。反向代理配置如图：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a64fe4d5f0cd43f2b1060cf076767a68~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 这只是开发环境配置好了反向代理，以后部署前端到线上环境的时候，需要采用 Nginx 或其他工具来实现线上环境的反向代理。

## 打包
1. 模板项目本身是需要部署到这个域名下：`https://un-pany.github.io/v3-admin-vite/`，所以我们需要在 `.env.staging` 和 `.env.production` 中设置打包路径：
```sh
## 打包路径（就是网站前缀，例如部署到 https://un-pany.github.io/v3-admin-vite/ 域名下，就需要填写 /v3-admin-vite/）
VITE_PUBLIC_PATH = '/v3-admin-vite/'
```
- 假如是要部署到 `https://xxx.com/yyy/` 下，那么就需要填写 `VITE_PUBLIC_PATH = '/yyy/'`。假如是要部署到 `https://xxx.com/` 下，那么就需要填写 `VITE_PUBLIC_PATH = '/'`。

2. 和打包相关的命令是 `build`，我们以打包正式环境为例，就要运行下面的命令：
```sh
pnpm build:prod
```
这个命令就会自动去读取我们前文配置好的 `.env.production` 文件，而 `pnpm build:stage` 会自动读取 `.env.staging` 文件，代表的是预发布环境。

3. 打包完成后，就可以在根目录下，看见一个名为 `dist` 的静态资源文件夹，这整个文件夹就是需要丢到前端服务器上去的东西。

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3e7973a6e6824b028c9c7a94ebe2662e~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

4. 然后可以通过运行 `pnpm preview:stage` 或 `pnpm preview:prod` 来预览 `dist` 中的静态资源文件。

## 参考资料
1. [【V3 Admin Vite】教程二：接口、跨域、打包](https://juejin.cn/post/7209852595002409018)
