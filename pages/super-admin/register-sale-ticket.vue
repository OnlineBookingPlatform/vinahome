<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getSaleTicketOnPlatformAPI } from '~/api/companyAPI';
import type { DTO_RP_RegisterSaleTicketOnPlatform } from '~/types/CompanyType';

definePageMeta({
    layout: "superadmin",
});

const tableData = ref<DTO_RP_RegisterSaleTicketOnPlatform[]>([]);
const loading = ref(false);

const fetchRegisterSaleTicket = async () => {
    loading.value = true;
    try {
        const response = await getSaleTicketOnPlatformAPI();
        if (response.result) {
            tableData.value = response.result;
        } else {
            ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Error fetching register sale ticket:', error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchRegisterSaleTicket();
});
</script>
<template>
    <section class="p-2">
        <el-table :data="tableData" style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="name" label="Họ tên" />
            <el-table-column prop="phone" label="Số điện thoại" />
            <el-table-column prop="email" label="Email" />
            <el-table-column prop="address" label="Địa chỉ" />
            <el-table-column prop="bus_company_name" label="Tên nhà xe" />
            <el-table-column prop="note" label="Nội dung tư vấn" />
            <el-table-column prop="status" label="Trạng thái" />
            <el-table-column prop="created_at" label="Ngày nhận tin" />
        </el-table>
    </section>
</template>