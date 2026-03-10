/**
 * API接口列表
 * 封装所有后端接口的请求方法
 */
import service from '@/service/server';

// 接口令牌配置
const HSA_FENSHI_TOKEN = 'c33eca087bb2315b45a7a9440285470e';  // 散户量化接口token
const ALLTICK_TOKEN = '528e4b8d16ccb1ca4eaba4ed6c513457-c-app';  // alltick接口token

/**
 * 格式化股票代码为alltick接口要求的格式
 * alltick接口要求代码格式: "001280.SZ" 或 "600519.SH"
 * @param {string} code - 原始股票代码，如 "sz001280" 或 "001280"
 * @returns {string} 格式化后的代码，如 "001280.SZ"
 */
const formatCodeToAlltick = (code) => {
    if (!code) return '';
    // 如果已经是正确格式，直接返回
    if (code.includes('.SZ') || code.includes('.SH')) {
        return code;
    }
    // 去掉可能的前缀字母，只保留数字部分
    const codeNum = code.replace(/^[a-zA-Z]*/, '');
    // 6开头是上海交易所，其他是深圳交易所
    if (code.startsWith('6')) {
        return `${codeNum}.SH`;  // 上海交易所
    }
    return `${codeNum}.SZ`;  // 深圳交易所
};

export default {
    /**
     * 获取股票分时数据（散户量化接口）
     * 用于添加股票时获取完整的基础信息（名称、价格、涨跌幅等）
     * @param {string} code - 股票代码
     * @param {number} all - 是否获取全部数据: 0仅最新, 1全部
     * @returns {Promise<Object>} 接口响应数据
     */
    getStockInfo(code, all = 0) {
        return service({
            method: 'get',
            url: `/api/v1/hsa_fenshi`,
            data: {
                token: HSA_FENSHI_TOKEN,
                code: code,
                all: all
            }
        });
    },

    /**
     * 批量获取股票实时成交数据（alltick接口）
     * 用于播报时批量更新所有股票的实时价格
     * @param {Array<string>} codes - 股票代码数组
     * @returns {Promise<Object>} 接口响应数据，包含tick_list数组
     */
    getAlltickData(codes) {
        const symbolList = codes.map(code => ({
            code: formatCodeToAlltick(code)
        }));
        
        const query = JSON.stringify({
            data: {
                symbol_list: symbolList
            }
        });
        
        return service({
            method: 'get',
            url: `/alltick/quote-stock-b-api/trade-tick`,
            data: {
                token: ALLTICK_TOKEN,
                query: query
            }
        });
    }
};
