<script setup lang="ts">
import type { NewsType } from '~/types/NewsType';

definePageMeta({
    layout: "superadmin",
});
const tableData = ref<NewsType[]>([]);

</script>
<template>
    <section class="p-2">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="created_at" label="Ngày đăng ký" />
        </el-table>
    </section>
</template>
