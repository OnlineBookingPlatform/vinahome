<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getListReceiveNewsAPI } from '~/api/newsAPI';
import type { NewsType } from '~/types/NewsType';

definePageMeta({
    layout: "superadmin",
});
const tableData = ref<NewsType[]>([]);
const isLoading = ref(false);
const fetchReceiveNews = async () => {
    isLoading.value = true;
    try {
        const response = await getListReceiveNewsAPI();
        if (response.status === 200) {
            tableData.value = response.result;
            console.log('Received news data:', tableData.value);
        } else {
            ElMessage.error(response.message || 'Lỗi khi tải dữ liệu');
        }
    } catch (error) {
        ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.');
    } finally {
        isLoading.value = false;
    }
};
onMounted(() => {
    fetchReceiveNews();
});

</script>
<template>
    <section class="p-2">
        <el-table :data="tableData" stripe style="width: 100%" v-loading="isLoading">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="createdAt" label="Ngày đăng ký">
                <template #default="scope">
                    {{ new Date(scope.row.createdAt).toLocaleDateString() }}
                </template>
            </el-table-column>
        </el-table>
    </section>
</template>
