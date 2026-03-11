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

const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
        if (speech.isPaused()) {
            speech.resume();
        }
    }
};

onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
});

onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    speech.stop();
});
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
