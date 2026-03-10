export default {
    namespaced: true,

    state: () => ({
        stockList: [],
        stockData: {},
        stockHistory: [],
        broadcastInterval: 1,
        isBroadcasting: false
    }),

    mutations: {
        ADD_STOCK(state, stockCode) {
            if (!state.stockList.includes(stockCode)) {
                state.stockList.push(stockCode);
            }
        },

        REMOVE_STOCK(state, stockCode) {
            const index = state.stockList.indexOf(stockCode);
            if (index > -1) {
                state.stockList.splice(index, 1);
            }
            if (state.stockData[stockCode]) {
                delete state.stockData[stockCode];
            }
        },

        UPDATE_STOCK_DATA(state, { stockCode, data }) {
            state.stockData = { ...state.stockData, [stockCode]: data };
        },

        ADD_TO_HISTORY(state, { code, name }) {
            const existingIndex = state.stockHistory.findIndex(item => item.code === code);
            if (existingIndex > -1) {
                state.stockHistory.splice(existingIndex, 1);
            }
            state.stockHistory.unshift({ code, name, addedAt: Date.now() });
            if (state.stockHistory.length > 20) {
                state.stockHistory.pop();
            }
        },

        REMOVE_FROM_HISTORY(state, stockCode) {
            const index = state.stockHistory.findIndex(item => item.code === stockCode);
            if (index > -1) {
                state.stockHistory.splice(index, 1);
            }
        },

        SET_BROADCAST_INTERVAL(state, interval) {
            state.broadcastInterval = interval;
        },

        SET_BROADCASTING(state, status) {
            state.isBroadcasting = status;
        },

        CLEAR_ALL_DATA(state) {
            state.stockList = [];
            state.stockData = {};
        }
    },

    getters: {
        getStockList: state => state.stockList,
        getStockData: state => stockCode => state.stockData[stockCode],
        getAllStockData: state => state.stockData,
        getStockHistory: state => state.stockHistory,
        getBroadcastInterval: state => state.broadcastInterval,
        isBroadcasting: state => state.isBroadcasting
    }
};
