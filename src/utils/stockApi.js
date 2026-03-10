import ajax from '@/service/ajax';

/**
 * 格式化价格（转换为元）
 * hsa_fenshi接口返回的价格需要除以1000转换为"元"
 * 例如：JiaGe=91020 表示 91.02元，计算方式：91020/1000 = 91.02
 * @param {number|string} value - 原始价格值
 * @returns {string} 格式化后的价格，保留2位小数
 */
const formatPrice = (value) => {
    if (value === null || value === undefined || value === '--') return '--';
    const num = Number(value);
    if (isNaN(num)) return '--';
    return (num / 10).toFixed(2);
};

/**
 * 解析alltick接口返回的股票代码
 * alltick返回格式如 "001280.SZ"，需要去掉后缀得到纯代码 "001280"
 * @param {string} code - 带后缀的股票代码
 * @returns {string} 纯股票代码
 */
const parseAlltickCode = (code) => {
    if (!code) return '';
    return code.replace(/\.(SZ|SH)$/, '');
};

/**
 * 格式化alltick接口返回的价格字符串
 * alltick返回的价格是字符串格式，如 "91.690000"，需要转换为 "91.69"
 * @param {string} priceStr - 价格字符串
 * @returns {string} 格式化后的价格，保留2位小数
 */
const formatAlltickPrice = (priceStr) => {
    if (!priceStr || priceStr === '--') return '--';
    const num = Number(priceStr);
    if (isNaN(num)) return '--';
    return num.toFixed(2);
};

/**
 * 格式化alltick接口返回的时间戳字符串
 * alltick返回的时间戳是字符串格式，如 "1773124986852"，需要转换为 "HH:MM:SS" 格式
 * @param {string} timeStr - 时间戳字符串（毫秒）
 * @returns {string} 格式化后的时间，如 "14:30:25"
 */
const formatAlltickTime = (timeStr) => {
    if (!timeStr || timeStr === '--') return '--';
    const timestamp = Number(timeStr);
    if (isNaN(timestamp)) return '--';
    
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    
    return `${hours}:${minutes}:${seconds}`;
};

/**
 * 转换hsa_fenshi接口数据为统一格式
 * 该接口返回完整的股票信息，用于添加股票时获取基础数据
 * @param {Object} response - 接口原始响应
 * @param {string} stockCode - 股票代码
 * @returns {Object|null} 转换后的股票数据
 */
const transformHsaFenshiData = (response, stockCode) => {
    if (!response || response.ret !== 200) {
        return null;
    }
    
    const base = response.base || {};
    // data数组包含分时数据，取最后一条作为最新数据
    const latestData = (response.data && response.data.length > 0) 
        ? response.data[response.data.length - 1] 
        : {};
    
    return {
        code: base.code || stockCode,           // 股票代码
        name: base.name || '--',                // 股票名称
        date: base.date || '--',                // 交易日期
        price: formatPrice(latestData.JiaGe),   // 最新价(元) - 对应表格"最新价"列
        time: latestData.ShiJian || '--',       // 行情时间 - 对应表格"行情时间"列
        changePercent: latestData.ZhangFu ?? '--',     // 涨跌幅(%) - 对应表格"涨跌幅"列
        changeSpeed: latestData.ZhangSu ?? '--',       // 涨速(%) - 对应表格"涨速"列
        volume: latestData.ZongLiang ?? '--',          // 成交量(手) - 对应表格"成交量"列
        amount: latestData.JinE ?? '--',               // 成交额(元) - 对应表格"成交额"列
        openPrice: formatPrice(base.KaiPan),           // 开盘价(元) - 对应表格"开盘价"列
        highPrice: formatPrice(base.ZuiGao),           // 最高价(元) - 对应表格"最高价"列
        lowPrice: formatPrice(base.ZuiDi),             // 最低价(元) - 对应表格"最低价"列
        preClose: formatPrice(base.ZuoShou),           // 昨收价(元) - 对应表格"昨收价"列
        amplitude: base.ZhenFu ?? '--',                // 振幅(%) - 对应表格"振幅"列
        turnoverRate: latestData.HuanShou ?? '--',     // 换手率(%) - 对应表格"换手率"列
        volumeRatio: latestData.LiangBi ?? '--',       // 量比 - 对应表格"量比"列
        bidAskRatio: latestData.WeiBi ?? '--',         // 委比(%) - 对应表格"委比"列
        innerVolume: latestData.NeiPan ?? '--',        // 内盘(手) - 对应表格"内盘"列
        outerVolume: latestData.WaiPan ?? '--',        // 外盘(手) - 对应表格"外盘"列
        avgPrice: formatPrice(latestData.JunJia),      // 均价(元) - 对应表格"均价"列
        dataSource: 'hsa_fenshi'                       // 数据来源标识
    };
};

/**
 * 转换alltick接口数据为统一格式
 * 该接口返回实时成交数据，用于播报时更新实时价格
 * @param {Object} response - 接口原始响应
 * @returns {Object} 转换后的股票数据，key为股票代码
 */
const transformAlltickData = (response) => {
    // 检查响应是否有效
    if (!response || response.ret !== 200 || !response.data || !response.data.tick_list) {
        return {};
    }
    
    const result = {};
    // 遍历tick列表，提取每只股票的实时数据
    response.data.tick_list.forEach(tick => {
        const code = parseAlltickCode(tick.code);
        if (code) {
            result[code] = {
                code: code,                                    // 股票代码
                price: formatAlltickPrice(tick.price),         // 最新价 - 格式化字符串价格
                volume: tick.volume || '--',                   // 成交量 - 用于更新表格"成交量"列
                amount: tick.turnover || '--',                 // 成交额 - 用于更新表格"成交额"列
                time: formatAlltickTime(tick.tick_time),       // 成交时间 - 格式化时间戳
                tradeDirection: tick.trade_direction || 0,     // 交易方向: 0默认, 1买入, 2卖出
                dataSource: 'alltick'                          // 数据来源标识
            };
        }
    });
    
    return result;
};

/**
 * 根据错误码获取错误信息
 * @param {number} ret - 错误码
 * @returns {string} 错误信息
 */
const getErrorMsg = (ret) => {
    const errorMap = {
        200: '成功',
        201: '盘前无数据',
        300: '令牌错误',
        301: '余额不足',
        302: '股票代码无效'
    };
    return errorMap[ret] || `请求失败(错误码: ${ret})`;
};

/**
 * 股票API模块
 * 封装两个接口的调用和数据转换逻辑
 */
const stockApi = {
    /**
     * 获取单个股票信息（hsa_fenshi接口）
     * 用于添加股票时获取完整的基础信息
     * @param {string} code - 股票代码
     * @returns {Promise<Object>} 包含success和data/error的对象
     */
    async fetchStockInfo(code) {
        const response = await ajax.getStockInfo(code);
        if (response && response.ret === 200) {
            return { success: true, data: transformHsaFenshiData(response, code) };
        }
        return { 
            success: false, 
            error: response ? getErrorMsg(response.ret) : '请求失败',
            ret: response?.ret
        };
    },

    /**
     * 批量获取股票实时数据（alltick接口）
     * 用于播报时批量更新所有股票的实时价格
     * @param {Array<string>} stockList - 股票代码数组
     * @returns {Promise<Object>} 股票数据对象，key为股票代码
     */
    async fetchAlltickData(stockList) {
        if (!stockList || stockList.length === 0) {
            return {};
        }
        
        try {
            const response = await ajax.getAlltickData(stockList);
            return transformAlltickData(response);
        } catch (error) {
            console.error('获取 alltick 数据失败:', error);
            return {};
        }
    },

    /**
     * 计算涨跌幅
     * 公式：(最新价格 - 昨收价) / 昨收价 * 100%
     * @param {number|string} currentPrice - 当前最新价格
     * @param {number|string} preClose - 昨收价
     * @returns {string} 涨跌幅百分比，保留2位小数
     */
    calculateChangePercent(currentPrice, preClose) {
        const price = Number(currentPrice);
        const pre = Number(preClose);
        if (isNaN(price) || isNaN(pre) || pre === 0) {
            return '--';
        }
        const change = ((price - pre) / pre * 100).toFixed(2);
        return change;
    },

    /**
     * 合并两个接口的数据
     * 用alltick的实时价格更新hsa_fenshi的基础数据
     * 同时计算涨跌幅：(最新价格 - 昨收价) / 昨收价 * 100%
     * @param {Object} existingData - 现有数据（来自hsa_fenshi）
     * @param {Object} alltickData - alltick实时数据
     * @returns {Object} 合并后的数据
     */
    mergeStockData(existingData, alltickData) {
        const merged = { ...existingData };
        
        Object.keys(alltickData).forEach(code => {
            const tickData = alltickData[code];
            if (merged[code]) {
                // 计算涨跌幅：(最新价格 - 昨收价) / 昨收价 * 100%
                const changePercent = this.calculateChangePercent(
                    tickData.price,
                    merged[code].preClose
                );
                
                // 用alltick的实时数据覆盖现有数据中的对应字段
                merged[code] = {
                    ...merged[code],
                    price: tickData.price,           // 更新最新价
                    volume: tickData.volume,         // 更新成交量
                    amount: tickData.amount,         // 更新成交额
                    time: tickData.time,             // 更新行情时间
                    changePercent: changePercent,    // 计算涨跌幅
                    dataSource: 'merged'             // 标记为合并数据
                };
            }
        });
        
        return merged;
    },

    /**
     * 格式化数据用于表格展示
     * 确保所有字段都有默认值，避免显示undefined
     * @param {Object} stockData - 股票数据
     * @returns {Object} 格式化后的展示数据
     */
    mapDataForDisplay(stockData) {
        return {
            code: stockData.code || '--',                              // 股票代码
            name: stockData.name || '--',                              // 股票名称
            price: stockData.price ?? '--',                            // 最新价(元)
            time: stockData.time || '--',                              // 行情时间
            changePercent: stockData.changePercent ?? '--',            // 涨跌幅(%)
            changeSpeed: stockData.changeSpeed ?? '--',                // 涨速(%)
            volume: stockData.volume ?? '--',                          // 成交量(手)
            amount: stockData.amount ?? '--',                          // 成交额(元)
            openPrice: stockData.openPrice ?? '--',                    // 开盘价(元)
            highPrice: stockData.highPrice ?? '--',                    // 最高价(元)
            lowPrice: stockData.lowPrice ?? '--',                      // 最低价(元)
            preClose: stockData.preClose ?? '--',                      // 昨收价(元)
            amplitude: stockData.amplitude ?? '--',                    // 振幅(%)
            turnoverRate: stockData.turnoverRate ?? '--',              // 换手率(%)
            volumeRatio: stockData.volumeRatio ?? '--',                // 量比
            bidAskRatio: stockData.bidAskRatio ?? '--',                // 委比(%)
            innerVolume: stockData.innerVolume ?? '--',                // 内盘(手)
            outerVolume: stockData.outerVolume ?? '--',                // 外盘(手)
            avgPrice: stockData.avgPrice ?? '--'                       // 均价(元)
        };
    }
};

export default stockApi;
