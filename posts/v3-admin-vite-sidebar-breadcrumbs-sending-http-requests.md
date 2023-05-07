---
date: 5:49 2023/5/8
title: V3 Admin Vite 侧边栏、面包屑、发送 HTTP 请求
tags:
- Vue
description: 登录时通过获取当前用户的权限（角色）去比对路由表，生成当前用户具有的权限可访问的路由表，通过 addRoute 动态挂载到 router 上。
---
## 介绍
[V3 Admin Vite](https://github.com/un-pany/v3-admin-vite) 是一个免费开源的中后台管理系统基础解决方案，基于 Vue3、TypeScript、Element Plus、Pinia 和 Vite 等主流技术。另外还有：
- Vue-Cli 5.x 版: [v3-admin](https://github.com/un-pany/v3-admin)
- Electron 桌面版: [v3-electron-vite](https://github.com/un-pany/v3-electron-vite)

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

## 侧边栏
侧边栏 `@/layout/components/Sidebar` 是通过读取路由并结合权限判断而动态生成的（换句话说就是常驻路由 + 有权限的动态路由）。

<img src="https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/7746005771b54a798abc258d5b77b412~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?" alt="" width="63.5%" />

<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/796d157f7af2478a95fca2389702450d~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?" alt="" width="20%" />

可以在侧边栏中配置一个外链，只要你在 `path` 中填写了合法的 `url` 路径，当你点击侧边栏的外链时就会帮你打开这个页面。
```ts
{
  path: "/link",
  component: Layout,
  children: [{
    path: "https://github.com/un-pany/v3-admin-vite",
    component: () => {},
    name: "Link",
    meta: {
      title: "外链",
      icon: "link"
    }
  }]
}
```

## 面包屑
面包屑 `@/layout/components/BreadCrumb` 也是根据路由动态生成的，为路由设置 `breadcrumb: false` 时该路由将不会出现在面包屑中，设置 `redirect: 'noRedirect'` 时该路由在面包屑中不能被点击。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/400ab6098b9c4fe28f3a3057cf0ce235~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp)

## 权限
1. 登录时通过获取当前用户的权限（角色）去比对路由表，生成当前用户具有的权限可访问的路由表，通过 `addRoute` 动态挂载到 `router` 上。
2. 页面权限：控制代码都在路由守卫 `@/router/permission.ts` 中，这里可根据具体的业务做相应的修改。
3. 取消页面权限：假如你的业务场景中没有 `动态路由` 的概念，那么在 `@/config/async-route` 里可以关闭该功能，关闭后系统将启用默认角色（一般为最高权限的 `admin` 角色），即每个登录的用户都可见所有路由：
```ts
/** 动态路由配置 */
interface IAsyncRouteSettings {
  /**
   * 是否开启动态路由功能？
   * 1. 开启后需要后端配合，在查询用户详情接口返回当前用户可以用来判断并加载动态路由的字段（该项目用的是角色 roles 字段）
   * 2. 假如项目不需要根据不同的用户来显示不同的页面，则应该将 open: false
   */
  open: boolean
  /** 当动态路由功能关闭时：
   * 1. 应该将所有路由都写到常驻路由里面（表明所有登陆的用户能访问的页面都是一样的）
   * 2. 系统自动给当前登录用户赋值一个没有任何作用的默认角色
   */
  defaultRoles: Array<string>
}

const asyncRouteSettings: IAsyncRouteSettings = {
  open: true,
  defaultRoles: ["DEFAULT_ROLE"]
}

export default asyncRouteSettings
```
4. 指令权限：简单快速的实现按钮级别的权限判断（已注册到全局，可直接使用）：
```html
<el-tag v-permission="['admin']">admin可见</el-tag>
<el-tag v-permission="['editor']">editor可见</el-tag>
<el-tag v-permission="['admin','editor']">admin和editor都可见</el-tag>
```
但在某些情况下，不适合使用 `v-permission`。例如：element-plus 的 `el-tab` 或 `el-table-column` 以及其它动态渲染 dom 的场景。你只能通过手动设置 `v-if` 来实现。
```ts
import { checkPermission } from '@/utils/permission'
```
```html
<el-tab-pane v-if="checkPermission(['admin'])" label="Admin">admin可见</el-tab-pane>
<el-tab-pane v-if="checkPermission(['editor'])" label="Editor">editor可见</el-tab-pane>
<el-tab-pane v-if="checkPermission(['admin','editor'])" label="AdminEditor">admin和editor都可见</el-tab-pane>
```

## 发送 HTTP 请求
大致的流程如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/50d9b85bac81431b8b5ad89f8d72058b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

1. 统一管理的 API `@/api/login.ts`：
```ts
import { request } from "@/utils/service"
import type * as Login from "./types/login"

/** 获取登录验证码 */
export function getLoginCodeApi() {
  return request<Login.LoginCodeResponseData>({
    url: "login/code",
    method: "get"
  })
}

/** 登录并返回 Token */
export function loginApi(data: Login.ILoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}

/** 获取用户详情 */
export function getUserInfoApi() {
  return request<Login.UserInfoResponseData>({
    url: "users/info",
    method: "get"
  })
}
```
2. 封装的 `@/utils/service.ts`：是基于 axios 的封装，封装了全局 `request` 拦截器、`response` 拦截器、统一的错误处理、统一做了超时处理、`baseURL` 设置等。

## 参考资料
1. [V3 Admin Vite 中文文档](https://juejin.cn/post/7089377403717287972)
