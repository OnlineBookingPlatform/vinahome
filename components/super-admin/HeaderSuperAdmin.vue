<script setup lang="ts">
import {
    House, SwitchButton
} from "@element-plus/icons-vue";
</script>
<template>
    <section class="h-full flex items-center justify-start px-2">
        <el-button type="primary" :icon="House">VinaHome</el-button>
        <el-button type="warning" :icon="SwitchButton">Đăng xuất</el-button>
    </section>

</template>