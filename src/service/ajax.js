/**
 * API接口列表
 * 封装所有后端接口的请求方法
 */
import service from '@/service/server';

const HSA_FENSHI_TOKEN = 'c33eca087bb2315b45a7a9440285470e';
const ALLTICK_TOKEN = '528e4b8d16ccb1ca4eaba4ed6c513457-c-app';

const isProduction = process.env.NODE_ENV === 'production';
const HSA_FENSHI_BASE_URL = isProduction ? process.env.VUE_APP_HSA_FENSHI_URL : '';
const ALLTICK_BASE_URL = isProduction ? process.env.VUE_APP_ALLTICK_URL : '';

const HSA_FENSHI_PATH = isProduction ? '/v1/hsa_fenshi' : '/api/v1/hsa_fenshi';
const ALLTICK_PATH = isProduction ? '/quote-stock-b-api/trade-tick' : '/alltick/quote-stock-b-api/trade-tick';

const formatCodeToAlltick = (code) => {
    if (!code) return '';
    if (code.includes('.SZ') || code.includes('.SH')) {
        return code;
    }
    const codeNum = code.replace(/^[a-zA-Z]*/, '');
    if (code.startsWith('6')) {
        return `${codeNum}.SH`;
    }
    return `${codeNum}.SZ`;
};

export default {
    getStockInfo(code, all = 0) {
        return service({
            method: 'get',
            url: `${HSA_FENSHI_BASE_URL}${HSA_FENSHI_PATH}`,
            data: {
                token: HSA_FENSHI_TOKEN,
                code: code,
                all: all
            }
        });
    },

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
            url: `${ALLTICK_BASE_URL}${ALLTICK_PATH}`,
            data: {
                token: ALLTICK_TOKEN,
                query: query
            }
        });
    }
};
