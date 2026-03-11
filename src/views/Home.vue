<template>
    <div class="home">
        <div class="home-content">
            <div class="top-section">
                <BroadcastControl />
            </div>
            <div class="main-section">
                <div class="add-stock-section">
                    <AddStock @stock-added="onStockAdded" />
                </div>
                <div class="stock-table-section">
                    <StockDataTable />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import BroadcastControl from '@/components/BroadcastControl.vue';
import AddStock from '@/components/AddStock.vue';
import StockDataTable from '@/components/StockDataTable.vue';

const store = useStore();

const STORAGE_KEY = 'stock_list';

const saveToLocalStorage = () => {
    const stockList = store.getters['stocks/getStockList'];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stockList));
};

const clearStockData = () => {
    localStorage.removeItem(STORAGE_KEY);
    store.commit('stocks/CLEAR_ALL_DATA');
};

const onStockAdded = () => {
    saveToLocalStorage();
};

onMounted(() => {
    clearStockData();
});

onUnmounted(() => {
    saveToLocalStorage();
});
</script>

<style lang="scss" scoped>
.home {
    width: 100%;
    min-height: 100vh;
    background: #f5f7fa;
    padding: 20px;
    box-sizing: border-box;

    .home-content {
        max-width: 1400px;
        margin: 0 auto;

        .top-section {
            margin-bottom: 20px;
        }

        .main-section {
            .add-stock-section {
                margin-bottom: 20px;
            }

            .stock-table-section {
                background: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
            }
        }
    }
}

@media screen and (max-width: 768px) {
    .home {
        padding: 12px;

        .home-content {
            .top-section {
                margin-bottom: 12px;
            }

            .main-section {
                .add-stock-section {
                    margin-bottom: 12px;
                }
            }
        }
    }
}
</style>
