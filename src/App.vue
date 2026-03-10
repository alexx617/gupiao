<template>
    <el-config-provider :locale="state.locale">
        <router-view />
    </el-config-provider>
</template>

<script setup>
import { reactive } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';

const state = reactive({
    locale: zhCn
});
</script>

<style lang="scss">
#app {
    width: 100%;
    height: 100%;
}
</style>
