<script setup lang="ts">
import { defineProps, defineEmits } from "vue";
import type { AccountByCompanyBusType } from "~/types/AccountType";

const props = defineProps({
  accounts: {
    type: Array as () => AccountByCompanyBusType[],
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["edit", "delete"]);

// Handle Edit
const handleEdit = (account: AccountByCompanyBusType) => {
  emit("edit", account);
};

// Handle Delete
const handleDelete = (accountId: string) => {
  emit("delete", accountId);
};

</script>

<template>
  <el-table :data="props.accounts" style="width: 100%" v-loading="props.loading">
    <el-table-column label="STT" type="index" width="50" />
    <el-table-column label="Tên" prop="name" />
    <el-table-column label="Tài khoản" prop="username" />
    <el-table-column label="Mật khẩu" prop="password" />
    <el-table-column label="Số điện thoại" prop="phone" />

    <el-table-column label="Giới tính" prop="gender">
      <template #default="{ row }">
        <el-tag v-if="row.gender === 1">
          Nam
        </el-tag>
        <el-tag v-if="row.gender === 2">
          Nữ
        </el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Vai trò" prop="role">
      <template #default="{ row }">
        <el-tag v-if="row.role === 2" type="success">Phụ xe</el-tag>
        <el-tag v-if="row.role === 3" type="warning">Tài xế</el-tag>
        <el-tag v-if="row.role === 4" type="danger">Nhân viên</el-tag>
        <el-tag v-if="row.role === 5" type="primary">Quản trị viên</el-tag>
      </template>
    </el-table-column>

    <el-table-column label="Email" prop="email" />
    <el-table-column align="right">
      <template #default="scope">
        <el-button size="small" @click="handleEdit(scope.row)">Sửa</el-button>
        <el-button size="small" type="danger" @click="handleDelete(scope.row.id)">Xóa</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
