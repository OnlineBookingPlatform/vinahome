<script setup lang="ts">
import { ref, computed } from "vue";
import type { AccountByCompanyBusType } from "~/types/AccountType";

const props = defineProps<{ loading: boolean; accounts: AccountByCompanyBusType[] }>();

const search = ref("");

const filterTableData = computed(() =>
  props.accounts.filter(
    (data) =>
      !search.value ||
      data.name.toLowerCase().includes(search.value.toLowerCase())
  )
);

const handleEdit = (index: number, row: AccountByCompanyBusType) => {
  console.log("Edit:", index, row);
};

const handleDelete = (index: number, row: AccountByCompanyBusType) => {
  console.log("Delete:", index, row);
};
</script>

<template>
  <el-table :data="filterTableData" style="width: 100%" v-loading="loading">
    <el-table-column label="STT" type="index" width="50" />
    <el-table-column label="Tên" prop="name" />
    <el-table-column label="Tài khoản" prop="username" />
    <el-table-column label="Số điện thoại" prop="phone" />
    <el-table-column label="Giới tính" prop="gender" />
    <el-table-column label="Vai trò" prop="role" />
    <el-table-column label="Email" prop="email" />
    <el-table-column align="right">
      <template #header>
        <el-input
          v-model="search"
          size="small"
          placeholder="Tìm kiếm tài khoản"
        />
      </template>
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">
          Edit
        </el-button>
        <el-button
          size="small"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)"
        >
          Delete
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
