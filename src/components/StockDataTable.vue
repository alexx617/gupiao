<template>
    <div class="stock-data-table">
        <div class="stock-data-table-header">
            <h3>股票列表</h3>
            <el-button
                type="primary"
                size="small"
                @click="handleRefresh"
                :loading="loading"
            >
                刷新数据
            </el-button>
        </div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            max-height="600"
        >
            <el-table-column prop="code" label="股票代码" width="100"  fixed />
            <el-table-column prop="name" label="股票名称" width="100" fixed />
            <el-table-column label="最新价(元)" width="100" fixed>
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'price') }">{{ format.formatPrice(row.price) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="行情时间" width="100">
                <template #default="{ row }">
                    <span>{{ row.time || '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="涨跌幅(%)" width="100">
                <template #default="{ row }">
                    <span :class="[getChangeClass(row.changePercent), { 'cell-changed': isChanged(row.code, 'changePercent') }]">
                        {{ format.formatChange(row.changePercent) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="涨速(%)" width="90">
                <template #default="{ row }">
                    <span :class="[getChangeClass(row.changeSpeed), { 'cell-changed': isChanged(row.code, 'changeSpeed') }]">
                        {{ format.formatPercent(row.changeSpeed) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="成交量(手)" width="110">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'volume') }">{{ format.formatVolume(row.volume) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="成交额(元)" width="120">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'amount') }">{{ format.formatAmount(row.amount) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="开盘价(元)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'openPrice') }">{{ format.formatPrice(row.openPrice) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最高价(元)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'highPrice') }">{{ format.formatPrice(row.highPrice) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="最低价(元)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'lowPrice') }">{{ format.formatPrice(row.lowPrice) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="昨收价(元)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'preClose') }">{{ format.formatPrice(row.preClose) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="振幅(%)" width="90">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'amplitude') }">{{ format.formatPercent(row.amplitude) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="换手率(%)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'turnoverRate') }">{{ format.formatPercent(row.turnoverRate) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="量比" width="80">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'volumeRatio') }">{{ format.formatNumber(row.volumeRatio) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="委比(%)" width="90">
                <template #default="{ row }">
                    <span :class="[getChangeClass(row.bidAskRatio), { 'cell-changed': isChanged(row.code, 'bidAskRatio') }]">
                        {{ format.formatPercent(row.bidAskRatio) }}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="内盘(手)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'innerVolume') }">{{ format.formatVolume(row.innerVolume) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="外盘(手)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'outerVolume') }">{{ format.formatVolume(row.outerVolume) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="均价(元)" width="100">
                <template #default="{ row }">
                    <span :class="{ 'cell-changed': isChanged(row.code, 'avgPrice') }">{{ format.formatPrice(row.avgPrice) }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" fixed="right">
                <template #default="{ row }">
                    <el-button
                        type="danger"
                        size="small"
                        @click="handleDelete(row.code)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div v-if="stockList.length === 0" class="empty-tip">
            暂无股票数据，请先添加股票
        </div>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useStore } from 'vuex';
import format from '@/utils/format';
import stockApi from '@/utils/stockApi';

const store = useStore();
const loading = ref(false);
const prevData = ref({});
const changedCells = ref({});

const stockList = computed(() => store.getters['stocks/getStockList']);
const stockData = computed(() => store.getters['stocks/getAllStockData']);

watch(stockData, (newData) => {
    const changes = {};
    stockList.value.forEach(code => {
        const newStock = newData[code];
        const oldStock = prevData.value[code];
        if (newStock && oldStock) {
            const fields = ['price', 'changePercent', 'changeSpeed', 'volume', 'amount', 
                'openPrice', 'highPrice', 'lowPrice', 'preClose', 'amplitude', 
                'turnoverRate', 'volumeRatio', 'bidAskRatio', 'innerVolume', 
                'outerVolume', 'avgPrice'];
            fields.forEach(field => {
                if (newStock[field] !== oldStock[field]) {
                    changes[`${code}-${field}`] = true;
                }
            });
        }
    });
    changedCells.value = changes;
    prevData.value = JSON.parse(JSON.stringify(newData));
    setTimeout(() => {
        changedCells.value = {};
    }, 1000);
}, { deep: true });

const tableData = computed(() => {
    return stockList.value.map(code => {
        const data = stockData.value[code] || {};
        return {
            code: code,
            name: data.name || '--',
            price: data.price,
            time: data.time,
            changePercent: data.changePercent,
            changeSpeed: data.changeSpeed,
            volume: data.volume,
            amount: data.amount,
            openPrice: data.openPrice,
            highPrice: data.highPrice,
            lowPrice: data.lowPrice,
            preClose: data.preClose,
            amplitude: data.amplitude,
            turnoverRate: data.turnoverRate,
            volumeRatio: data.volumeRatio,
            bidAskRatio: data.bidAskRatio,
            innerVolume: data.innerVolume,
            outerVolume: data.outerVolume,
            avgPrice: data.avgPrice
        };
    });
});

const isChanged = (code, field) => {
    return changedCells.value[`${code}-${field}`];
};

const getChangeClass = (value) => {
    if (value === null || value === undefined || value === '') return '';
    const num = Number(value);
    if (isNaN(num)) return '';
    if (num > 0) return 'up';
    if (num < 0) return 'down';
    return '';
};

const handleRefresh = async () => {
    if (stockList.value.length === 0) return;
    
    loading.value = true;
    try {
        const alltickData = await stockApi.fetchAlltickData(stockList.value);
        const currentData = stockData.value;
        const mergedData = stockApi.mergeStockData(currentData, alltickData);
        
        Object.keys(mergedData).forEach(code => {
            store.commit('stocks/UPDATE_STOCK_DATA', { stockCode: code, data: mergedData[code] });
        });
    } finally {
        loading.value = false;
    }
};

const handleDelete = (code) => {
    store.commit('stocks/REMOVE_STOCK', code);
    const list = store.getters['stocks/getStockList'];
    localStorage.setItem('stock_list', JSON.stringify(list));
};
</script>

<style lang="scss" scoped>
.stock-data-table {
    padding: 20px;
    background: #fff;
    border-radius: 8px;

    .stock-data-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
            margin: 0;
            font-size: 16px;
            color: #303133;
        }
    }

    .up {
        color: #f56c6c;
        font-weight: 500;
    }

    .down {
        color: #67c23a;
        font-weight: 500;
    }

    .cell-changed {
        animation: cell-flash 3s ease-out;
        background-color: rgba(64, 158, 255, 0.3);
        border-radius: 4px;
        padding: 2px 4px;
    }

    @keyframes cell-flash {
        0% {
            background-color: rgba(64, 158, 255, 0.6);
            transform: scale(1.05);
        }
        100% {
            background-color: transparent;
            transform: scale(1);
        }
    }

    .empty-tip {
        padding: 40px 0;
        text-align: center;
        color: #909399;
        font-size: 14px;
    }
}

@media screen and (max-width: 768px) {
    .stock-data-table {
        padding: 12px;

        .stock-data-table-header {
            flex-direction: column;
            gap: 12px;
            align-items: flex-start;

            h3 {
                font-size: 15px;
            }

            .el-button {
                width: 100%;
            }
        }

        :deep(.el-table) {
            font-size: 12px;

            .el-table__header th {
                padding: 8px 0;
                font-size: 12px;
            }

            .el-table__body td {
                padding: 8px 0;
            }

            .cell {
                padding: 0 4px;
                font-size: 12px;
            }
        }
    }
}
</style>
