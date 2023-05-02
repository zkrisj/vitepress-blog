---
date: 13:33 2023/5/2
title: V3 Admin Vite 介绍和基本使用
tags:
- Vue
description: V3 Admin Vite 是一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术。
---
## 介绍
[V3 Admin Vite](https://github.com/un-pany/v3-admin-vite) 是一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术。另外还有：
- Vue-Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

## 功能
- **用户管理**：登录、登出演示
- **权限管理**：内置页面权限（动态路由）、指令权限、权限函数、路由守卫
- **多环境**：开发环境（development）、预发布环境（staging）、正式环境（production）
- **多主题**：内置普通、黑暗、深蓝三种主题模式
- **错误页面**: 403、404
- **Dashboard**：根据不同用户显示不同的 Dashboard 页面
- **其他内置功能**：SVG、动态侧边栏、动态面包屑、标签页快捷导航、Screenfull 全屏、自适应收缩侧边栏

## 特性
- **Vue3**：采用 Vue3 + script setup 最新的 Vue3 组合式 API
- **Element Plus**：Element UI 的 Vue3 版本
- **Pinia**: 传说中的 Vuex5
- **Vite**：真的很快
- **Vue Router**：路由路由
- **TypeScript**：JavaScript 语言的超集
- **PNPM**：更快速的，节省磁盘空间的包管理工具
- **Scss**：和 Element Plus 保持一致
- **CSS 变量**：主要控制项目的布局和颜色
- **ESlint**：代码校验
- **Prettier**：代码格式化
- **Axios**：发送网络请求（已封装好）
- **UnoCSS**：具有高性能且极具灵活性的即时原子化 CSS 引擎
- **注释**：各个配置项都写有尽可能详细的注释
- **兼容移动端**: 布局兼容移动端页面分辨率

## 本地安装
1. 克隆仓库：
```sh
git clone https://github.com/un-pany/v3-admin-vite.git
// 或克隆国内镜像仓库
git clone https://gitee.com/un-pany/v3-admin-vite.git
```
2. V3 Admin Vite 是推荐使用 pnpm 命令来安装第三方依赖，而不是直接使用 npm 命令，所以需要安装 pnpm。
```sh
npm install -g pnpm
```
3. 安装依赖：
```sh
pnpm i
```
如果安装太慢，可以选择将官方依赖源切换为淘宝依赖源：
```sh
pnpm config set registry https://registry.npmmirror.com
```
4. 运行开发版预览：
```sh
pnpm dev
```
如下图所示代表运行成功：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/c36fb50ab238498aa8c890069ce344ba~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

打开项目地址后，界面如下：

![image.png](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/b90b2ee7d0944e9081a87a4558e8c331~tplv-k3u1fbpfcp-watermark.image?)

5. 构建和预览：预发布环境、正式环境。
```sh
# 构建预发布环境
pnpm build:stage

# 预览预发布环境
pnpm preview:stage

# 构建正式环境
pnpm build:prod

# 预览正式环境
pnpm preview:prod
```
6. 代码格式化和单元测试：
```sh
# 代码格式化
pnpm lint

# 单元测试
pnpm test
```

## Git 提交规范参考
- `feat` 增加新的业务功能
- `fix` 修复业务问题/BUG
- `perf` 优化性能
- `style` 更改代码风格, 不影响运行结果
- `refactor` 重构代码
- `revert` 撤销更改
- `test` 测试相关, 不涉及业务代码的更改
- `docs` 文档和注释相关
- `chore` 更新依赖/修改脚手架配置等琐事
- `workflow` 工作流改进
- `ci` 持续集成相关
- `types` 类型定义文件更改
- `wip` 开发中

## 目录结构
```sh
# v3-admin-vite
├─ .husky                # 用户提交代码时格式化代码
├─ .vscode               # 本项目推荐的 vscode 配置和拓展
├─ public
│  ├─ favicon.ico
│  ├─ app-loading.css    # 首屏加载 loading
├─ src
│  ├─ api                # api 接口
│  ├─ assets             # 静态资源
│  ├─ components         # 全局组件
│  ├─ config             # 全局配置
│  ├─ constant           # 常量/枚举
│  ├─ directives         # 全局指令
│  ├─ hooks              # 全局 hook
│  ├─ icons              # svg icon
│  ├─ layout             # 布局
│  ├─ plugins            # 全局插件
│  ├─ router             # 路由
│  ├─ store              # pinia store
│  ├─ styles             # 全局样式
│  ├─ utils              # 全局公共方法
│  └─ views              # 所有页面
│  ├─ App.vue            # 入口页面
│  └─ main.ts            # 入口文件
├─ tests                 # 单元测试
├─ types                 # ts 声明
├─ .env.development      # 开发环境
├─ .env.production       # 正式环境
├─ .env.staging          # 预发布环境
├─ .eslintrc.js          # eslint 配置
├─ .prettier.config.js   # prettier 配置
├─ tsconfig.json         # ts 编译配置
├─ unocss.config.ts      # unocss 配置
└─ vite.config.ts        # vite 配置
```

## 参考资料
1. [【V3 Admin Vite】教程一：环境、下载、运行项目](https://juejin.cn/post/7207824074708680763)