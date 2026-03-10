# 双接口股票播报系统 Spec

## Why
当前系统使用单一接口获取股票数据，需要优化播报性能。添加股票时使用 hsa_fenshi 接口获取详细信息，循环播报时使用 alltick 批量接口提高效率。

## What Changes
- 添加股票功能继续使用 hsa_fenshi 接口
- 循环播报数据刷新改用 alltick 批量接口
- 新增 alltick 接口请求封装
- 新增接口数据映射逻辑，将 alltick 返回数据映射到现有数据结构

## Impact
- Affected specs: 股票数据获取、播报功能
- Affected code: src/service/ajax.js, src/utils/stockApi.js, src/components/BroadcastControl.vue

## ADDED Requirements

### Requirement: Alltick 批量接口集成
系统 SHALL 提供 alltick 批量接口用于播报时获取股票数据。

#### Scenario: 批量获取股票数据
- **WHEN** 系统进行播报数据刷新时
- **THEN** 使用 alltick 接口批量请求所有股票数据

### Requirement: 接口数据映射
系统 SHALL 将 alltick 接口返回数据映射到现有数据结构。

#### Scenario: 数据映射
- **GIVEN** alltick 接口返回 tick_list 数据
- **WHEN** 系统处理返回数据
- **THEN** 将 code、price、volume、turnover 等字段映射到现有股票数据结构

## MODIFIED Requirements

### Requirement: 股票数据获取
添加股票时使用 hsa_fenshi 接口获取完整股票信息（名称、价格等）。

播报刷新时使用 alltick 批量接口获取实时价格数据。

## 接口详情

### Alltick 接口
- **URL**: `https://quote.alltick.co/quote-stock-b-api/trade-tick`
- **Method**: GET
- **参数**:
  - token: `528e4b8d16ccb1ca4eaba4ed6c513457-c-app`
  - query: JSON 格式查询参数

#### 请求示例
```
https://quote.alltick.co/quote-stock-b-api/trade-tick?token=528e4b8d16ccb1ca4eaba4ed6c513457-c-app&query={%20%22data%22:%20{%20%22symbol_list%22:%20[%20{%20%22code%22:%20%22001280.SZ%22%20}%20]%20}%20}
```

#### 返回数据结构
| 字段 | 类型 | 说明 |
|------|------|------|
| ret | integer | 返回code |
| msg | string | 返回消息 |
| trace | string | 请求trace |
| data.tick_list | array | 成交列表 |
| tick_list[].code | string | 股票代码 |
| tick_list[].seq | string | 序号 |
| tick_list[].tick_time | string | 时间戳 |
| tick_list[].price | string | 成交价 |
| tick_list[].volume | string | 成交量 |
| tick_list[].turnover | string | 成交额 |
| tick_list[].trade_direction | integer | 交易方向(0默认,1买入,2卖出) |

#### 股票代码格式
- 深市股票: `代码.SZ` (如 `001280.SZ`)
- 沪市股票: `代码.SH`
