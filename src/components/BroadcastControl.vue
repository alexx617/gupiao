<template>
    <div class="broadcast-control">
        <!-- 播报间隔设置区域 -->
        <div class="broadcast-control-item">
            <span class="label">播报间隔：</span>
            <el-input-number
                v-model="interval"
                :min="1"
                :max="60"
                :step="1"
                size="small"
                @change="handleIntervalChange"
            />
            <span class="unit">分钟</span>
        </div>
        
        <!-- 播报控制按钮区域 -->
        <div class="broadcast-control-item">
            <el-button
                type="success"
                @click="handleStart"
                :disabled="isBroadcasting"
            >
                开启播报
            </el-button>
            <el-button
                type="danger"
                @click="handleStop"
                :disabled="!isBroadcasting"
            >
                关闭播报
            </el-button>
        </div>
        
        <!-- 播报状态显示区域 -->
        <div class="broadcast-control-item">
            <span class="status-label">播报状态：</span>
            <el-tag :type="isBroadcasting ? 'success' : 'info'" size="small">
                {{ isBroadcasting ? '播报中' : '已停止' }}
            </el-tag>
        </div>
    </div>
</template>

<script setup>
/**
 * 播报控制组件
 * 负责管理股票语音播报的开启、关闭和定时刷新
 * 
 * 功能说明：
 * 1. 设置播报间隔（1-60分钟）
 * 2. 开启播报：调用alltick接口获取实时数据，语音播报股票信息
 * 3. 关闭播报：停止定时器和语音
 * 4. 自动检测股票列表变化，列表为空时自动停止播报
 */
import { ref, computed, watch, onUnmounted } from 'vue';
import { useStore } from 'vuex';
import { ElMessage } from 'element-plus';
import speech from '@/utils/speech';
import format from '@/utils/format';
import stockApi from '@/utils/stockApi';

const store = useStore();

// 播报间隔（分钟）
const interval = ref(1);

// 定时器ID，用于清除定时任务
let intervalId = null;

// 从store获取播报状态
const isBroadcasting = computed(() => store.getters['stocks/isBroadcasting']);

// 从store获取股票列表
const stockList = computed(() => store.getters['stocks/getStockList']);

// 从store获取所有股票数据
const stockData = computed(() => store.getters['stocks/getAllStockData']);

/**
 * 监听股票列表变化
 * 当股票列表变为空时，自动停止播报
 */
watch(stockList, (newList) => {
    if (newList.length === 0 && isBroadcasting.value) {
        handleStop();
        ElMessage.warning('股票列表为空，已自动关闭播报');
    }
}, { deep: true });

/**
 * 处理播报间隔变化
 * 更新store中的播报间隔设置
 * @param {number} value - 新的间隔值（分钟）
 */
const handleIntervalChange = (value) => {
    store.commit('stocks/SET_BROADCAST_INTERVAL', value);
};

/**
 * 生成播报文本
 * 根据股票数据生成语音播报的文本内容
 * 格式：股票名称，最新价XX元，涨跌幅XX%
 * @returns {string} 播报文本
 */
const generateBroadcastText = () => {
    const texts = [];
    stockList.value.forEach(code => {
        const data = stockData.value[code];
        if (data) {
            const name = data.name || code;  // 股票名称
            const price = format.formatPrice(data.price);  // 格式化价格
            const change = format.formatChange(data.changePercent);  // 格式化涨跌幅
            texts.push(`${name}，最新价${price}元，涨跌幅${change}%`);
        }
    });
    return texts.join('。');
};

/**
 * 播报股票数据
 * 核心播报逻辑：
 * 1. 调用alltick接口获取实时数据
 * 2. 合并到现有数据中
 * 3. 更新store中的股票数据
 * 4. 生成播报文本并语音播报
 */
const broadcastStockData = async () => {
    // 股票列表为空则停止播报
    if (stockList.value.length === 0) {
        handleStop();
        return;
    }

    // 1. 调用alltick接口获取实时数据
    const alltickData = await stockApi.fetchAlltickData(stockList.value);
    
    // 2. 合并现有数据和alltick实时数据
    const currentData = stockData.value;
    const mergedData = stockApi.mergeStockData(currentData, alltickData);
    
    // 3. 更新store中的股票数据，触发表格刷新
    Object.keys(mergedData).forEach(code => {
        const displayData = stockApi.mapDataForDisplay(mergedData[code]);
        store.commit('stocks/UPDATE_STOCK_DATA', { stockCode: code, data: displayData });
    });
    
    // 4. 生成播报文本并语音播报
    const text = generateBroadcastText();
    if (text) {
        try {
            await speech.speak(text);
        } catch (error) {
            console.error('语音播报失败:', error);
        }
    }
};

/**
 * 开启播报
 * 1. 检查股票列表是否为空
 * 2. 检查浏览器是否支持语音
 * 3. 立即执行一次播报
 * 4. 启动定时器，按间隔定时播报
 */
const handleStart = async () => {
    // 检查股票列表
    if (stockList.value.length === 0) {
        ElMessage.warning('请先添加股票');
        return;
    }

    // 检查浏览器语音支持
    if (!speech.isSupported()) {
        ElMessage.error('您的浏览器不支持语音播报');
        return;
    }

    // 更新播报状态
    store.commit('stocks/SET_BROADCASTING', true);
    ElMessage.success('开始播报');

    // 立即执行一次播报
    await broadcastStockData();

    // 启动定时器，按间隔定时播报
    intervalId = setInterval(async () => {
        if (stockList.value.length === 0) {
            handleStop();
            return;
        }
        await broadcastStockData();
    }, interval.value * 60 * 1000);  // 分钟转毫秒
};

/**
 * 关闭播报
 * 1. 更新播报状态
 * 2. 清除定时器
 * 3. 停止语音播放
 */
const handleStop = () => {
    store.commit('stocks/SET_BROADCASTING', false);
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    speech.stop();
};

/**
 * 组件卸载时清理定时器
 * 防止内存泄漏
 */
onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style lang="scss" scoped>
/**
 * 播报控制组件样式
 * 采用flex布局，水平排列各控制项
 */
.broadcast-control {
    display: flex;
    align-items: center;
    gap: 24px;
    padding: 16px 20px;
    background: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

    // 每个控制项的样式
    .broadcast-control-item {
        display: flex;
        align-items: center;
        gap: 8px;

        // 标签文字样式
        .label {
            font-size: 14px;
            color: #606266;
        }

        // 单位文字样式
        .unit {
            font-size: 14px;
            color: #909399;
        }

        // 状态标签文字样式
        .status-label {
            font-size: 14px;
            color: #606266;
        }
    }
}
</style>
