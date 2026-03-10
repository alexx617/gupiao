# Tasks

- [x] Task 1: 添加 alltick 接口请求封装
  - [x] SubTask 1.1: 在 src/service/ajax.js 中添加 alltick 批量接口请求方法
  - [x] SubTask 1.2: 添加股票代码格式转换函数（纯代码转 .SZ/.SH 格式）
  - [x] SubTask 1.3: 配置 alltick 接口代理（如需要）

- [x] Task 2: 创建 alltick 数据映射工具
  - [x] SubTask 2.1: 在 src/utils/stockApi.js 中添加 alltick 返回数据转换函数
  - [x] SubTask 2.2: 实现股票代码格式反向解析（.SZ/.SH 转纯代码）
  - [x] SubTask 2.3: 添加 alltick 批量获取股票数据方法

- [x] Task 3: 修改播报控制组件
  - [x] SubTask 3.1: 修改 BroadcastControl.vue 中的数据刷新逻辑
  - [x] SubTask 3.2: 播报时调用 alltick 批量接口获取数据
  - [x] SubTask 3.3: 合并 alltick 数据到现有股票数据

# Task Dependencies
- Task 2 依赖 Task 1
- Task 3 依赖 Task 1, Task 2
