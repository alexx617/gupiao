<template>
    <div class="stock-table">
        <div class="stock-table-header">
            <h3>股票列表</h3>
            <span class="stock-count">共 {{ stockList.length }} 只</span>
        </div>
        <el-table
            :data="tableData"
            stripe
            style="width: 100%"
            max-height="400"
        >
            <el-table-column prop="code" label="股票代码" width="120" />
            <el-table-column prop="name" label="股票名称">
                <template #default="{ row }">
                    <span>{{ row.name || '--' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80" align="center">
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
            暂无股票，请添加
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from 'vuex';
import { ElMessage, ElMessageBox } from 'element-plus';

const store = useStore();

const stockList = computed(() => store.getters['stocks/getStockList']);
const stockData = computed(() => store.getters['stocks/getAllStockData']);

const tableData = computed(() => {
    return stockList.value.map(code => {
        const data = stockData.value[code];
        return {
            code: code,
            name: data?.name || '--'
        };
    });
});

const handleDelete = (code) => {
    ElMessageBox.confirm('确定要删除该股票吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        store.commit('stocks/REMOVE_STOCK', code);
        ElMessage.success('删除成功');
    }).catch(() => {});
};
</script>

<style lang="scss" scoped>
.stock-table {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    .stock-table-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h3 {
            margin: 0;
            font-size: 16px;
            color: #303133;
        }

        .stock-count {
            font-size: 14px;
            color: #909399;
        }
    }

    .empty-tip {
        padding: 40px 0;
        text-align: center;
        color: #909399;
        font-size: 14px;
    }
}
</style>
