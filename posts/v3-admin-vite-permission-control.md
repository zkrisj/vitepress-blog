---
date: 7:39 2023/5/9
title: V3 Admin Vite 权限控制
tags:
- Vue
description: 需要挂载的路由就存放在 constantRoutes 数组下，比如登录页、首页；需要用户登录并根据角色字段来判断是否有权限的动态路由，就放在 asyncRoutes 数组下，并且要为该路由配置好 roles 和 name 属性。
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

## 页面权限
1. 动态路由：`@/src/router/index.ts` 就是用来存放常驻路由和动态路由的文件，如图所示：

![](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/708d49a7f7294ee1babb74bdd640cfa5~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

需要挂载的路由就存放在 `constantRoutes` 数组下，比如登录页、首页；需要用户登录并根据角色字段来判断是否有权限的路由，就放在 `asyncRoutes` 数组下，并且要为该路由配置好 `roles` 和 `name` 属性。下面是项目中写好的一个动态路由示例：
```ts
{
  path: "/permission",
  component: Layout,
  redirect: "/permission/page",
  name: "Permission", // 不要忘了写
  meta: {
    title: "权限管理",
    svgIcon: "lock",
    roles: ["admin", "editor"], // 可以在根路由中设置角色
    alwaysShow: true // 将始终显示根菜单
  },
  children: [
    {
      path: "page",
      component: () => import("@/views/permission/page.vue"),
      name: "PagePermission", // 不要忘了写
      meta: {
        title: "页面权限",
        roles: ["admin"] // 或者在子导航中设置角色
      }
    },
    {
      path: "directive",
      component: () => import("@/views/permission/directive.vue"),
      name: "DirectivePermission", // 不要忘了写
      meta: {
        title: "指令权限" // 如果未设置角色，则表示：该页面不需要权限，但会继承根路由的角色
      }
    }
  ]
}
```
登录 `admin` 账号时，可以看见这两个页面：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/2869f2c542b7430bb98d23b3a3da8464~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

登录 `editor` 账号时，只能看见一个页面：

![](https://p9-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/9ebca4a5f48a42b6a49d585ec36a1bb2~tplv-k3u1fbpfcp-zoom-in-crop-mark:1512:0:0:0.awebp?)

2. 项目默认开启动态路由功能，在 `@/src/config/async-route.ts` 文件中可以找到是否开启动态路由的开关，源码如下，只需要将下面代码中的 `asyncRouteSettings.open` 设置为 `true` 就可以开启动态路由功能：
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
开启以后，主要是作用于路由守卫 `@/src/router/permission.ts` 中的这样一段代码：
```ts
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
```
如果开启该功能，那么通过用户详情接口拿到用户角色数组后，根据角色去过滤动态路由，然后再通过 `router.addRoute()` 挂载过滤之后的动态路由。

3. 如果选择关闭动态路由功能，要记得将所有路由都写在常驻路由数组里面（虽然写在动态路由数组里也行，因为程序兼容了这种偷懒），这样的话，所有登陆的用户能访问的页面都是一模一样的了。

## 内容权限
1. `@/src/utils/permission.ts` 文件里，有一个 `checkPermission` 权限判断函数：
```ts
import { useUserStoreHook } from "@/store/modules/user"

/** 权限判断函数 */
export const checkPermission = (value: string[]): boolean => {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStoreHook().roles
    const permissionRoles = value
    return roles.some((role) => {
      return permissionRoles.includes(role)
    })
  } else {
    console.error("need roles! Like checkPermission(['admin','editor'])")
    return false
  }
}
```
向该函数传递一个权限数组，然后它会去对比当前登录用户的角色数组，如果能匹配上，就返回 `true`，它的使用方法非常简单，`checkPermission` 函数配合 `v-if` 即可：
```html
// 引入
import { checkPermission } from "@/utils/permission"
```
```html
// 使用
<el-button v-if="checkPermission(['admin'])">按钮</el-button>
```
更多详细的使用案例，可见 `@/views/permission/directive.vue` 页面。

2. `@/directives/permission/index.ts` 文件里，写好了权限判断指令 `v-permission`：
```ts
import { type Directive } from "vue"
import { useUserStoreHook } from "@/store/modules/user"

/** 权限指令 */
export const permission: Directive = {
  mounted(el, binding) {
    const { value } = binding
    const roles = useUserStoreHook().roles
    if (value && value instanceof Array && value.length > 0) {
      const permissionRoles = value
      const hasPermission = roles.some((role) => {
        return permissionRoles.includes(role)
      })
      if (!hasPermission) {
        el.style.display = "none"
      }
    } else {
      throw new Error(`need roles! Like v-permission="['admin','editor']"`)
    }
  }
}
```
向该指令传递一个权限数组，然后它会去对比当前登录用户的角色数组，如果不能匹配上，就通过 CSS `style.display = "none"` 将其隐藏，`v-permission` 已经通过 `app.directive()` 挂载完成，可以直接在 `template` 中直接使用：
```html
<el-button v-permission="['admin']">按钮</el-button>
```
更多详细的使用案例，可见 `@/views/permission/directive.vue` 页面。

## 参考资料
1. [【V3 Admin Vite】教程五：前端权限（涉及角色、动态路由、权限函数、权限指令）](https://juejin.cn/post/7226261250576597050)
