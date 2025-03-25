<script setup lang="ts">
import type { BusCompanyType } from "~/types/CompanyType";
import TableListAccount from "~/components/super-admin/company-bus/TableListAccount.vue";
import { getListsAccountByCompanyAPI } from "~/api/accountAPI";
import type { AccountByCompanyBusType } from "~/types/AccountType";
import { ElMessage } from "element-plus";

definePageMeta({
  layout: "superadmin",
});
const route = useRoute();
const companyData = ref<BusCompanyType | null>(null);
const loading = ref(false);
const accounts = ref<AccountByCompanyBusType[]>([]);
onMounted(() => {
  const companyId = route.params.id;
  console.log(companyId);
  fetchAccounts(Number(companyId));
});
const fetchAccounts = async (companyId: number) => {
  loading.value = true;
  try {
    console.log("Company ID:", companyId);
    const response = await getListsAccountByCompanyAPI(companyId);
    console.log("Danh sách tài khoản:", response);
    accounts.value = response.result;
  } catch (error) {
    ElMessage.error("Lỗi hệ thống, vui lòng thử lại!");
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <section class="p-2">
    <el-tabs type="border-card">
      <el-tab-pane label="Tài khoản">
        <div>
          <el-button type="primary">Thêm tài khoản</el-button>
        </div>
        <TableListAccount :loading="loading" :accounts="accounts"/>
        
      </el-tab-pane>
      <el-tab-pane label="Tuyến">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
  </section>
</template>
<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
