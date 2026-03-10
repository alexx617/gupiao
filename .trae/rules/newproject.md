# 项目代码规则

## 技术栈概览

- **框架**：Vue3 最新版本
- **状态管理**：Vuex 最新版本
- **路由**：Vue Router 最新版本
- **UI 库**：Element Plus 最新版本
- **HTTP 客户端**：Axios 最新版本
- **时间处理**：Dayjs 最新版本
- **样式**：SCSS
- **构建工具**：Vue CLI 最新版本

## 项目结构规范

- **src/assets/**：静态资源文件（图片、图标、音频等）
- **src/common/**：通用组件（如对话框、分页器等）
- **src/components/**：业务组件，按功能模块组织
- **src/hooks/**：自定义 Vue 3 Composition API 钩子
- **src/service/**：API 服务和网络请求
- **src/store/**：Vuex 状态管理
- **src/utils/**：工具函数
- **src/App.vue**：根组件
- **src/main.js**：应用入口文件

## 网络请求规范

### 封装方式
- 使用 `@/service/server.js` 作为基础请求封装
- 所有 API 请求必须通过 `service` 函数发起
- API 接口按功能模块分离到不同的 ajax 文件中（如 `ajax.js`、`userMeAjax.js` 等）

### 请求格式
- GET 请求：参数通过 `params` 传递，自动转换为 `{ param: JSON.stringify(data) }`
- POST 请求：参数通过 `data` 传递，自动转换为 `{ param: JSON.stringify(data) }`
- 统一设置 `Content-Type` 为 `application/x-www-form-urlencoded`

### 错误处理
- 统一的错误处理机制，通过 axios 拦截器处理
- 接口错误通过 `errcode.js` 统一处理
- 网络错误和重复请求处理

### 请求风格
- 使用 async/await 语法发起异步请求
- 使用 try/catch 捕获请求错误
- 接口返回数据结构：`{ status: { code: number }, data: any, result: any }`
- 判断接口是否成功：`data && data.status.code == 0`

### 其他
- 支持取消重复请求
- 自动添加环境前缀（通过 `setAPI` 函数）
- 统一的超时设置（10000ms）

## 项目配置规范

### vue.config.js 配置
- 输出目录：`build/static`
- 入口 HTML 路径：`../pages/index.html`
- 开发服务器配置：
  - 主机：`dev.weidian.com`
  - 端口：`8088`
  - HTTPS：开发环境使用自签名证书
- 跨域代理配置：
  - `/api` 代理到 `https://thor.{env}weidian.com`
- 别名配置：
  - `@` 指向 `src` 目录
  - `@assets` 指向 `src/assets` 目录
- 自动导入 Element Plus 组件

### 样式配置
- 使用 reset.css 重置 CSS 样式
- 全局引入 reset.css

### Element UI 配置
- 使用最新版本的 Element Plus
- 配置 Element Plus 为中文
- 通过 `unplugin-auto-import` 和 `unplugin-vue-components` 自动导入组件

## 路由配置规范

### 路由模式
- 使用 `createWebHashHistory` 哈希模式

### 路由结构
- 主路由：`/session/:page?`，包含多个子路由
- 子路由包括：未读页面、联系人页、子账号联系人页、工作报表页、历史消息页、客服管理页、设置页等
- 其他独立路由：下载页、风控滑块、图片预览、连锁店转接、连锁店批量转接等

### 路由配置风格
- 使用懒加载：`component: () => import(/* webpackChunkName: "xxx" */ '../components/xxx/xxx.vue')`
- 设置路由名称：`name: 'xxx'`
- 支持 props 传递：`props: true`
- 路由重定向：`redirect: '/path'`

### 路由守卫
- 使用 `router.beforeEach` 全局前置守卫
- 使用 `router.afterEach` 全局后置守卫

## App.vue 文件风格

### 结构
- 仅作为路由入口
- 使用 `<el-config-provider :locale="state.locale">` 包裹 `<router-view />`
- 配置 Element Plus 为中文

### 内容
- 引入 Element Plus 中文语言包
- 使用 `reactive` 管理状态
- 简洁的样式配置

## 首页面配置

### 位置
- 具体首页面放在 `views` 文件中的 `Home.vue` 中

### 结构
- 包含 Menu 组件和路由视图
- 使用 `v-if` 判断用户是否登录
- 适配桌面版和网页版

## Store 文件夹风格

### 结构
- 模块化结构，包含 `modules` 文件夹
- 每个模块单独放在一个文件中（如 `user.js`、`sessions.js` 等）
- 主文件 `store.js` 引入所有模块

### 配置
- 使用 `createStore` 创建 store
- 开发环境开启严格模式
- 模块间通过 mutations 和 actions 通信

## Plugins 文件夹配置

### Element Plus 按需加载
- 保留 `element.js` 文件
- 使用按需加载的方式导入 Element Plus 组件
- 提供 `loadComponent` 函数用于注册组件
- 注释掉不需要的组件以减少打包体积

## 测试与质量规范

### 代码质量工具
- 使用 ESLint 进行代码质量检查
- 使用 Prettier 进行代码格式化

### ESLint 规则
- 生产环境禁用 console
- 生产环境禁用 debugger
- 允许未使用的变量

### 性能优化
- 使用防抖（debounce）和节流（throttle）优化频繁操作
- 合理使用 Vue 3 的 `computed` 和 `watch`
- 图片请求大小调整（性能优化用）

### 代码模式
- 自定义 Hook 封装业务逻辑
- 使用 provide/inject 进行组件间通信
- 使用事件总线（$bus）进行跨组件通信

## 版本控制
- 使用 Volta 管理 Node.js 版本（固定为 14.16.1）
- 忽略 node_modules、dist、build 等目录

## 环境配置
- 使用 .env 文件管理不同环境配置
- 支持 daily、pre、production 三种环境
