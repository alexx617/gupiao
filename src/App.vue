<template>
    <el-config-provider :locale="state.locale">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import speech from '@/utils/speech';

const state = reactive({
    locale: zhCn
});

const handleBeforeUnload = () => {
    speech.stop();
};

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
});

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    speech.stop();
});
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
