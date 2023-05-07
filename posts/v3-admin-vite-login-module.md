---
date: 9:06 2023/5/7
title: V3 Admin Vite 登录模块
tags:
- Vue
description: login action 返回值是一个 Promise，所以后面链式跟一个 .then 、 .catch 和 .finally，接口调用成功则会执行 .then （跳转到首页），如果途中发生错误，则会执行 .catch，而无论什么情况都会执行 .finally。
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

## 建立目录结构
1. `@/src/api` 目录下的 `login` 文件夹（没有的话就需要新建一个）即代表了登录模块。
2. 在 `login` 文件夹里面再建立一个 `types` 文件夹（专门放置和登录模块相关的 `TS 类型`）和 `index.ts`。

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/ddeb13d52fed498a992aa7d184af1dd3~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

> 假如一个模块叫系统管理 `system`，里面有两个子模块，分别叫用户管理 `user`、角色管理 `role`，那么我们建立的目录大致就应该长这个样子：
> 
> ![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a5cee0f1f9484d88a4cd0840f8f0694b~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 编写 TS 类型
编写接口的 TS 类型，需要根据后端同事提供的接口文档，拿到接口的请求参数和响应数据的格式。
1. 请求数据类型 `ILoginRequestData`：
```ts
export interface ILoginRequestData {
  /** admin 或 editor */
  username: "admin" | "editor"
  /** 密码 */
  password: string
  /** 验证码 */
  code: string
}
```
2. 响应数据类型 `LoginResponseData`：
```ts
export type LoginResponseData = IApiResponseData<{ token: string }>
```
3. `IApiResponseData` 这个类型作为一个全局类型，被定义在 `@/types/api.d.ts` 文件里：
```ts
/** 所有 api 接口的响应数据都应该准守该格式 */
interface IApiResponseData<T> {
  code: number
  data: T
  message: string
}
```
4. 所以最终响应数据类型 `LoginResponseData` 就相当于：
```ts
{
  code: number
  data: { token: string }
  message: string
}
```
5. 最终效果如下：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/a6479deb94544c98baf0c285a98e2dce~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 编写接口
1. 发送请求是通过封装好的 Axios，所以第一步就是导入相关的方法：
```ts
import { request } from "@/utils/service"
```
2. 将上文写好的登录接口的类型导入进来：
```ts
import type * as Login from "./types/login"
```
3. 登录接口的函数名为 `loginApi`，它接受一个参数 `data`，类型为 `ILoginRequestData`。
```ts
/** 登录并返回 Token */
export function loginApi(data: Login.ILoginRequestData) {
  return request<Login.LoginResponseData>({
    url: "users/login",
    method: "post",
    data
  })
}
```
- `request<Login.LoginResponseData>` 则表示的是待会接口响应成功的 `data` 数据类型为 `LoginResponseData`。
- `url` 代表接口地址，`method` 代表接口方法（get/post/put/delete），`data` 表示请求体数据（如果是 get 请求，则要换成 `params`）。

6. 接口写好后如下图：

![](https://p1-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d1a2151a47f640eebbba3e2661f4ac87~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 调用登录接口
首先点击登录按钮将调用的函数是 `handleLogin`：
```ts
const handleLogin = () => {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true
      useUserStore()
        .login({
          username: loginForm.username,
          password: loginForm.password,
          code: loginForm.code
        })
        .then(() => {
          router.push({ path: "/" })
        })
        .catch(() => {
          createCode()
          loginForm.password = ""
        })
        .finally(() => {
          loading.value = false
        })
    } else {
      return false
    }
  })
}
```
- `loginFormRef.value?.validate` 是校验登录表单。
- `useUserStore()` 是状态管理器 Pinia 的 `Store`，调用该 Store 的 `login action`，并传入用户名、密码、验证码三个参数即可。
- `login action` 返回值是一个 Promise，所以后面链式跟一个 `.then` 、 `.catch` 和 `.finally`，接口调用成功则会执行 `.then` （跳转到首页），如果途中发生错误，则会执行 `.catch`，而无论什么情况都会执行 `.finally`。

## 状态管理
1. 由于点击登录按钮触发了 `useUserStore` 的 `login` action，然后在 `login` action 中调用这个 `loginApi` 并传入对应参数（**如果这里参数传递错误，那么 TS 就会报错提醒我们，因为我们在上文中定义接口的时候已经约束了类型**）。

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/3d4630a01f9e49f38625ff31d1dd57ab~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 调用登录接口成功时，我们将接口返回的响应数据 `res` 中的 `token` 分别保存到 `cookie`（对应语句 `setToken(res.data.token)`）和 `当前 Store`（对应语句 `token.value = res.data.token`） 中，如果接口失败，则直接 `reject`。
3. 如果这里执行了 `.then` 那么登录页面也将执行 `.then`，也就会开始跳转路由到首页，那么就会触发路由守卫。

## 路由守卫
1. `@/src/router/permission.ts` 包含了路由守卫全部的代码：
```ts
import router from "@/router"
import { useUserStoreHook } from "@/store/modules/user"
import { usePermissionStoreHook } from "@/store/modules/permission"
import { ElMessage } from "element-plus"
import { whiteList } from "@/config/white-list"
import { getToken } from "@/utils/cache/cookies"
import asyncRouteSettings from "@/config/async-route"
import NProgress from "nprogress"
import "nprogress/nprogress.css"

NProgress.configure({ showSpinner: false })

router.beforeEach(async (to, _from, next) => {
  NProgress.start()
  const userStore = useUserStoreHook()
  const permissionStore = usePermissionStoreHook()
  // 判断该用户是否登录
  if (getToken()) {
    if (to.path === "/login") {
      // 如果已经登录，并准备进入 Login 页面，则重定向到主页
      next({ path: "/" })
      NProgress.done()
    } else {
      // 检查用户是否已获得其权限角色
      if (userStore.roles.length === 0) {
        try {
          if (asyncRouteSettings.open) {
            // 注意：角色必须是一个数组！ 例如: ['admin'] 或 ['developer', 'editor']
            await userStore.getInfo()
            const roles = userStore.roles
            // 根据角色生成可访问的 Routes（可访问路由 = 常驻路由 + 有访问权限的动态路由）
            permissionStore.setRoutes(roles)
          } else {
            // 没有开启动态路由功能，则启用默认角色
            userStore.setRoles(asyncRouteSettings.defaultRoles)
            permissionStore.setRoutes(asyncRouteSettings.defaultRoles)
          }
          // 将'有访问权限的动态路由' 添加到 Router 中
          permissionStore.dynamicRoutes.forEach((route) => {
            router.addRoute(route)
          })
          // 确保添加路由已完成
          // 设置 replace: true, 因此导航将不会留下历史记录
          next({ ...to, replace: true })
        } catch (err: any) {
          // 过程中发生任何错误，都直接重置 Token，并重定向到登录页面
          userStore.resetToken()
          ElMessage.error(err.message || "路由守卫过程发生错误")
          next("/login")
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    // 如果没有 Token
    if (whiteList.indexOf(to.path) !== -1) {
      // 如果在免登录的白名单中，则直接进入
      next()
    } else {
      // 其他没有访问权限的页面将被重定向到登录页面
      next("/login")
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
```
- 判断用户是否登录，没登录则只能进入白名单页面，比如登录页。
- 如果已经登录，将不允许进入登录页。
- 如果已经登录，还要检查是否拿到用户角色，如果没有，并且开启了动态路由功能，则要调用用户详情接口。
- 如果没有开启动态路由功能，则启用默认角色。
- 一旦发生错误，就重置 `Token`，并重定向到登录页。
- 如果通过路由守卫的检查后，就能正常跳转到首页了。

## 鉴权
1. 后续所有的操作，都将携带保存在前端的 `token` 去调用接口，`token` 将是后端服务判断当前请求合不合法的依据，项目本身已经写在 Axios 的封装里面了：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/d3682dbd5f7744eda74b7b3dc9c12872~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 假如 `token` 已经过期后，理论上接口会抛出一个 `http code 401` 的错误，我们只需要在响应拦截器里重定向到登录页即可：

![](https://p6-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9aca133d3dfc4d09949e12478f2fe4b0~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

## 参考资料
1. [【V3 Admin Vite】教程三：掌握登录模块（涉及 API、Axios、Pinia、路由守卫、鉴权）](https://juejin.cn/post/7214026775143350329)