<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getSaleTicketOnPlatformAPI } from '~/api/companyAPI';
import type { DTO_RP_RegisterSaleTicketOnPlatform } from '~/types/CompanyType';
import { MoreFilled } from "@element-plus/icons-vue";

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
            console.log('Register Sale Ticket Data:', tableData.value);
        } else {
            ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.');
        }
    } catch (error) {
        console.error('Error fetching register sale ticket:', error);
    } finally {
        loading.value = false;
    }
};
const handleDelete = (row: DTO_RP_RegisterSaleTicketOnPlatform) => {
  console.log('Xoá:', row)
  // Gọi API xoá
}

const handleMarkUnprocessed = (row: DTO_RP_RegisterSaleTicketOnPlatform) => {
  console.log('Chuyển về "Chưa xử lý":', row)
  // Gọi API cập nhật status về 1
}

const handleMarkProcessed = (row: DTO_RP_RegisterSaleTicketOnPlatform) => {
  console.log('Chuyển về "Đã xử lý":', row)
  // Gọi API cập nhật status về 2 
}
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
            <el-table-column prop="status" label="Trạng thái">
                <template #default="{ row }">
                    <span>
                        {{ row.status === 1 ? 'Chưa xử lý' : 'Đã xử lý' }}
                    </span>
                </template>
            </el-table-column>

            <el-table-column prop="created_at" label="Ngày nhận tin">
                <template #default="{ row }">
                    {{ new Date(row.created_at).toLocaleDateString('vi-VN') }}
                </template>
            </el-table-column>
            <el-table-column fixed="right">
                <template #default="{ row }">
                    <el-dropdown :hide-on-click="false">
                        <span class="el-dropdown-link">
                            <el-icon>
                                <MoreFilled />
                            </el-icon>
                        </span>
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="() => handleDelete(row)">Xoá</el-dropdown-item>
                                <el-dropdown-item @click="() => handleMarkUnprocessed(row)">Chưa xử
                                    lý</el-dropdown-item>
                                <el-dropdown-item @click="() => handleMarkProcessed(row)">Đã xử lý</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                </template>
            </el-table-column>

        </el-table>
    </section>
</template>