<script setup lang="ts">
import { dayjs, ElMessage } from 'element-plus';
import { getTransactionHistoryAPI } from '~/api/paymentAPI';
import type { DTO_RP_Transaction } from '~/types/PaymentType';

definePageMeta({
    layout: "superadmin",
});
const tableData = ref<DTO_RP_Transaction[]>([]);
const loading = ref(false);
const fetchTransactionHistory = async () => {
    loading.value = true;
    try {
        const response = await getTransactionHistoryAPI();
        if (response.result) {
            tableData.value = response.result;
            console.log('Transaction History Data:', tableData.value);
        } else {
            ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Error fetching transaction history:', error);
    } finally {
        loading.value = false;
    }
};
const formatDateTime = (_: any, __: any, value: string) => {
    return dayjs(value).format('HH:mm DD/MM/YYYY');
};
onMounted(() => {
    fetchTransactionHistory();
});
</script>
<template>
    <section class="p-2">
        <el-table v-loading="loading" :data="tableData" style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="order_id" label="Mã giao dịch" />
            <el-table-column label="Tổng tiền">
                <template #default="{ row }">
                    <span>{{ row.amount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) || '0 ₫'
                        }}</span>
                </template>
            </el-table-column>

            <el-table-column prop="status" label="Trạng thái" />
            <el-table-column prop="description" label="Nội dung" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="phone" label="Số điện thoại" />
            <el-table-column prop="created_at" label="Thời gian" :formatter="formatDateTime" />
        </el-table>
    </section>
</template>