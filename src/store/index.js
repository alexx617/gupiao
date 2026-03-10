import { createStore } from 'vuex';
import stocks from './modules/stocks';

const STORAGE_KEY = 'stock_broadcast_data';

const loadState = () => {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            return JSON.parse(data);
        }
    } catch (e) {
        console.error('加载本地存储数据失败:', e);
    }
    return null;
};

const saveState = (state) => {
    try {
        const data = {
            stockHistory: state.stocks.stockHistory || []
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.error('保存本地存储数据失败:', e);
    }
};

const persistedState = loadState();

const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {
        stocks
    }
});

if (persistedState && persistedState.stockHistory) {
    store.state.stocks.stockHistory = persistedState.stockHistory;
}

store.subscribe((mutation, state) => {
    if (['stocks/ADD_TO_HISTORY', 'stocks/REMOVE_FROM_HISTORY'].includes(mutation.type)) {
        saveState(state);
    }
});

export default store;
