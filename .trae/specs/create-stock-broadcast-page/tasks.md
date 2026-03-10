# Tasks

- [x] Task 1: 初始化 Vue3 项目结构
  - [x] SubTask 1.1: 创建 package.json 配置文件，包含所需依赖（Vue3, Vuex, Vue Router, Element Plus, Axios, Dayjs, SCSS）
  - [x] SubTask 1.2: 创建 vue.config.js 配置文件
  - [x] SubTask 1.3: 创建项目入口文件 main.js
  - [x] SubTask 1.4: 创建根组件 App.vue
  - [x] SubTask 1.5: 创建 index.html 模板文件

- [x] Task 2: 创建网络请求服务
  - [x] SubTask 2.1: 创建 src/service/server.js 基础请求封装
  - [x] SubTask 2.2: 创建 src/service/ajax.js 股票 API 接口封装

- [x] Task 3: 创建 Vuex 状态管理
  - [x] SubTask 3.1: 创建 src/store/index.js 主 store 文件
  - [x] SubTask 3.2: 创建 src/store/modules/stocks.js 股票状态模块

- [x] Task 4: 创建工具函数
  - [x] SubTask 4.1: 创建 src/utils/utils.js 通用工具函数
  - [x] SubTask 4.2: 创建 src/utils/speech.js 语音播报工具函数
  - [x] SubTask 4.3: 创建 src/utils/format.js 数据格式化工具函数（价格、百分比转换）

- [x] Task 5: 创建业务组件
  - [x] SubTask 5.1: 创建 src/views/Home.vue 首页组件
  - [x] SubTask 5.2: 创建 src/components/StockTable.vue 股票列表表格组件（展示股票代码、名称、删除按钮）
  - [x] SubTask 5.3: 创建 src/components/AddStock.vue 添加股票组件（输入股票代码，自动获取名称）
  - [x] SubTask 5.4: 创建 src/components/StockDataTable.vue 股票详情数据表格组件（展示完整行情数据）
  - [x] SubTask 5.5: 创建 src/components/BroadcastControl.vue 播报控制组件

- [x] Task 6: 创建路由配置
  - [x] SubTask 6.1: 创建 src/router/index.js 路由配置文件

- [x] Task 7: 创建样式文件
  - [x] SubTask 7.1: 创建 src/assets/styles/reset.css 样式重置文件
  - [x] SubTask 7.2: 创建 src/assets/styles/global.scss 全局样式文件

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1
- Task 4 依赖 Task 1
- Task 5 依赖 Task 2, Task 3, Task 4
- Task 6 依赖 Task 1
- Task 7 依赖 Task 1
