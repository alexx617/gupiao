<template>
    <div class="add-stock">
        <div class="add-stock-left">
            <div class="section-header">
                <h3>添加股票</h3>
            </div>
            <div class="add-stock-content">
                <el-input
                    v-model="stockCode"
                    placeholder="请输入股票代码"
                    clearable
                    :disabled="loading"
                    @keyup.enter="handleAddStock"
                />
                <el-button type="primary" @click="handleAddStock" :loading="loading">
                    添加
                </el-button>
            </div>
            <div v-if="stockName" class="add-stock-info success">
                <el-icon><SuccessFilled /></el-icon>
                <span>{{ stockName }}</span>
            </div>
            <div v-if="errorMsg" class="add-stock-info error">
                <el-icon><CircleCloseFilled /></el-icon>
                <span>{{ errorMsg }}</span>
            </div>
        </div>

        <div class="add-stock-right">
            <div class="section-header">
                <h3>添加历史</h3>
                <el-button v-if="stockHistory.length > 0" type="text" size="small" @click="clearHistory">清空</el-button>
            </div>
            <div v-if="stockHistory.length > 0" class="history-list">
                <div 
                    v-for="item in stockHistory" 
                    :key="item.code" 
                    class="history-item"
                >
                    <div class="history-info">
                        <span class="history-code">{{ item.code }}</span>
                        <span class="history-name">{{ item.name }}</span>
                    </div>
                    <div class="history-actions">
                        <el-button 
                            type="primary" 
                            size="small" 
                            :disabled="isInStockList(item.code)"
                            @click="addToStockList(item)"
                        >
                            {{ isInStockList(item.code) ? '已添加' : '添加' }}
                        </el-button>
                        <el-button 
                            type="danger" 
                            size="small" 
                            @click="removeFromHistory(item.code)"
                        >
                            删除
                        </el-button>
                    </div>
                </div>
            </div>
            <div v-else class="history-empty">
                暂无历史记录
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { SuccessFilled, CircleCloseFilled } from '@element-plus/icons-vue';
import stockApi from '@/utils/stockApi';

const store = useStore();
const stockCode = ref('');
const stockName = ref('');
const errorMsg = ref('');
const loading = ref(false);

const emit = defineEmits(['stock-added']);

const stockHistory = computed(() => store.getters['stocks/getStockHistory']);
const stockList = computed(() => store.getters['stocks/getStockList']);

const isInStockList = (code) => {
    return stockList.value.includes(code);
};

const handleAddStock = async () => {
    const code = stockCode.value.trim();
    if (!code) {
        errorMsg.value = '请输入股票代码';
        stockName.value = '';
        return;
    }

    if (stockList.value.length >= 10) {
        errorMsg.value = '最多只能添加10只股票';
        return;
    }

    loading.value = true;
    stockName.value = '';
    errorMsg.value = '';

    try {
        const result = await stockApi.fetchStockInfo(code);
        if (result.success && result.data && result.data.name) {
            stockName.value = result.data.name;
            store.commit('stocks/ADD_STOCK', code);
            store.commit('stocks/UPDATE_STOCK_DATA', { stockCode: code, data: result.data });
            store.commit('stocks/ADD_TO_HISTORY', { code, name: result.data.name });
            stockCode.value = '';
            emit('stock-added', { code, data: result.data });
        } else {
            errorMsg.value = result.error || '未找到该股票信息';
        }
    } catch (error) {
        console.error('添加股票失败:', error);
        errorMsg.value = error.message || '添加股票失败，请稍后重试';
    } finally {
        loading.value = false;
    }
};

const addToStockList = async (item) => {
    if (isInStockList(item.code)) return;

    if (stockList.value.length >= 10) {
        errorMsg.value = '最多只能添加10只股票';
        setTimeout(() => { errorMsg.value = ''; }, 3000);
        return;
    }

    loading.value = true;
    try {
        const result = await stockApi.fetchStockInfo(item.code);
        if (result.success && result.data) {
            store.commit('stocks/ADD_STOCK', item.code);
            store.commit('stocks/UPDATE_STOCK_DATA', { stockCode: item.code, data: result.data });
            store.commit('stocks/ADD_TO_HISTORY', { code: item.code, name: item.name });
            emit('stock-added', { code: item.code, data: result.data });
        } else {
            errorMsg.value = result.error || '获取股票信息失败';
            setTimeout(() => { errorMsg.value = ''; }, 3000);
        }
    } catch (error) {
        console.error('添加股票失败:', error);
        errorMsg.value = error.message || '添加股票失败';
        setTimeout(() => { errorMsg.value = ''; }, 3000);
    } finally {
        loading.value = false;
    }
};

const removeFromHistory = (code) => {
    store.commit('stocks/REMOVE_FROM_HISTORY', code);
};

const clearHistory = () => {
    stockHistory.value.forEach(item => {
        store.commit('stocks/REMOVE_FROM_HISTORY', item.code);
    });
};
</script>

<style lang="scss" scoped>
.add-stock {
    display: flex;
    gap: 24px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .add-stock-left {
        flex: 1;
        min-width: 0;
    }

    .add-stock-right {
        flex: 1;
        min-width: 0;
        border-left: 1px solid #ebeef5;
        padding-left: 24px;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        h3 {
            margin: 0;
            font-size: 16px;
            color: #303133;
        }
    }

    .add-stock-content {
        display: flex;
        gap: 12px;

        .el-input {
            flex: 1;
        }
    }

    .add-stock-info {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-top: 12px;
        padding: 10px 12px;
        border-radius: 4px;
        font-size: 14px;

        &.success {
            background: #f0f9eb;
            color: #67c23a;
        }

        &.error {
            background: #fef0f0;
            color: #f56c6c;
        }
    }

    .history-list {
        max-height: 200px;
        overflow-y: auto;
    }

    .history-empty {
        padding: 20px;
        text-align: center;
        color: #909399;
        font-size: 14px;
    }

    .history-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 12px;
        background: #f5f7fa;
        border-radius: 4px;
        margin-bottom: 8px;

        &:last-child {
            margin-bottom: 0;
        }

        .history-info {
            display: flex;
            gap: 12px;

            .history-code {
                font-size: 14px;
                color: #303133;
                font-weight: 500;
            }

            .history-name {
                font-size: 14px;
                color: #909399;
            }
        }

        .history-actions {
            display: flex;
            gap: 8px;
        }
    }
}

@media screen and (max-width: 768px) {
    .add-stock {
        flex-direction: column;
        gap: 16px;
        padding: 12px;

        .add-stock-right {
            border-left: none;
            border-top: 1px solid #ebeef5;
            padding-left: 0;
            padding-top: 16px;
        }

        .section-header {
            h3 {
                font-size: 15px;
            }
        }

        .add-stock-content {
            flex-direction: column;
            gap: 8px;

            .el-button {
                width: 100%;
            }
        }

        .history-item {
            flex-direction: column;
            gap: 8px;
            align-items: flex-start;

            .history-actions {
                width: 100%;
                justify-content: flex-end;
            }
        }
    }
}
</style>
