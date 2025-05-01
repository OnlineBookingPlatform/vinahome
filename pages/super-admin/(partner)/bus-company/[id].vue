<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, type FormInstance } from "element-plus";
import TableListAccount from "~/components/super-admin/company-bus/TableListAccount.vue";
import { createAccountBySuperAdminAPI, deleteAccountBySuperAdminAPI, getListAccountByCompanyOnPlatformAPI, getListsAccountByCompanyAPI, updateAccountBySuperAdminAPI } from "~/api/accountAPI";
import type { AccountByCompanyBusType } from "~/types/AccountType";
import Quill from "~/components/Quill.vue";
definePageMeta({
  layout: "superadmin",
});
onMounted(() => {
  const companyId = route.params.id;
  // fetchAccounts(Number(companyId));
});
const route = useRoute();
const companyId = route.params.id;
const isLoading = ref(false);
const dialogVisible = ref(false);
const tableData = ref<AccountByCompanyBusType[]>([]);
const ruleFormRef = ref<FormInstance>()
const isEditMode = ref(false)
const ruleForm = reactive<AccountByCompanyBusType>({
  id: null,
  name: null,
  username: null,
  password: null,
  phone: null,
  email: null,
  status: false,
  company_id: Number(companyId),
  gender: 1,
  role: null,
});
const rules = reactive({
  name: [
    { required: true, message: "Vui lòng nhập họ tên", trigger: "blur" },
  ],
  username: [
    { required: true, message: "Vui lòng nhập tài khoản", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Vui lòng nhập mật khẩu", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
  ],
  role: [
    { required: true, message: "Vui lòng chọn vai trò", trigger: "blur" },
  ],
});
const resetForm = () => {
  ruleForm.id = null
  ruleForm.name = null
  ruleForm.username = null
  ruleForm.password = null
  ruleForm.phone = null
  ruleForm.email = null
  ruleForm.status = false
  ruleForm.company_id = Number(companyId)
  ruleFormRef.value?.clearValidate()
}
const handleClose = (done: () => void) => {
  ElMessageBox.confirm('Bạn chắc chắn muốn đóng không?')
    .then(() => {
      done()
      resetForm()
    })
    .catch(() => {
      // catch error
    })
}
const handleCloseDialog = () => {
  dialogVisible.value = false
  resetForm()
}
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      try {
        isLoading.value = true
        if (isEditMode.value) {
          const res = await updateAccountBySuperAdminAPI(ruleForm)
          ElMessage.success('Cập nhật tài khoản thành công')

          const index = tableData.value.findIndex(item => item.id === res.result.id)
          if (index !== -1) {
            tableData.value[ index ] = { ...res.result }
          }
        } else {
          const res = await createAccountBySuperAdminAPI(ruleForm)
          if (res.status === 200) {
            ElMessage.success('Thêm tài khoản thành công')
            tableData.value.push(res.result)
          } else {
            ElMessage.error(res.message || 'Thêm không thành công')
          }
        }
        dialogVisible.value = false
      } catch (error) {
        ElMessage.error("Lỗi hệ thống, vui lòng thử lại!");
      } finally {
        isLoading.value = false;
      }
    } else {
      console.log('error submit!!');
    }
  })
}
const handleEdit = (row: AccountByCompanyBusType) => {
  console.log("Edit row: ", row);
  isEditMode.value = true
    Object.assign(ruleForm, row) // Điền thông tin vào form

    // Hiển thị modal
    dialogVisible.value = true
}
const handleDelete = async (row: AccountByCompanyBusType) => {
  try {
    await ElMessageBox.confirm(
      `Bạn có chắc chắn muốn xoá tài khoản "${row.username}"?`,
      'Xác nhận xoá',
      {
        confirmButtonText: 'Xoá',
        cancelButtonText: 'Huỷ',
        type: 'warning',
      }
    )

    isLoading.value = true
    const res = await deleteAccountBySuperAdminAPI(row)
    if (res.status === 200) {
      tableData.value = tableData.value.filter(item => item.id !== row.id)

      ElMessage.success('Xoá tài khoản thành công')
    } else {
      ElMessage.error(res.message || 'Xoá không thành công')
    }
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.')
    }
  } finally {
    isLoading.value = false
  }
}

const fetchAccounts = async (companyId: number) => {
  try {
    const res = await getListAccountByCompanyOnPlatformAPI(companyId);
    if (res.status === 200) {
      tableData.value = res.result;
    } else {
      ElMessage.error(res.message || "Lỗi khi tải danh sách tài khoản");
    }
  } catch (error) {
    ElMessage.error("Lỗi hệ thống, vui lòng thử lại sau.");
  }
};
onMounted(() => {
  fetchAccounts(Number(companyId));
});



</script>

<template>
  <section class="p-2">
    <el-tabs type="border-card">
      <el-tab-pane label="Tài khoản">
        <div>
          <el-button type="primary" @click="dialogVisible = true">Thêm tài khoản</el-button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" label="STT" width="50" />
          <el-table-column prop="name" label="Tên" />
          <el-table-column prop="username" label="Tài khoản" />
          <el-table-column prop="phone" label="Số điện thoại" />
          <el-table-column prop="gender" label="Giới tính">
            <template #default="{ row }">
              <el-tag
                :type="row.gender === 1 ? 'primary' : row.gender === 2 ? 'danger' : row.gender === 3 ? 'warning' : 'info'">
                {{ row.gender === 1 ? 'Nam' : row.gender === 2 ? 'Nữ' : row.gender === 3 ? 'Khác' : 'Không rõ' }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column prop="role" label="Vai trò">
            <template #default="{ row }">
              <el-tag
                :type="row.role === 5 ? 'success' : row.role === 4 ? 'info' : row.role === 3 ? 'warning' : 'danger'">
                {{ row.role === 5 ? 'Quản trị viên' : row.role === 4 ? 'Nhân viên' : row.role === 3 ? 'Tài xế' :
                  row.role === 3 ? 'Phụ xe' : 'Khác' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="email" label="Email" />
          <el-table-column prop="status" label="Trạng thái">
            <template #default="{ row }">
              <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status ? 'Đang hoạt động' : 'Ngưng hoạt động' }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="right">
            <template #default="{ row }">
              <el-button type="primary" :icon="Edit" circle @click="handleEdit(row)" />
              <el-button type="danger" :icon="Delete" circle @click="handleDelete(row)" />
            </template>
          </el-table-column>
        </el-table>

        <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'" width="500px"
          :before-close="handleClose">
          <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" status-icon label-width="auto">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Tài khoản" prop="username" label-position="top">
                  <el-input v-model="ruleForm.username" placeholder="Nhập tài khoản" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tên" prop="name" label-position="top">
                  <el-input v-model="ruleForm.name" placeholder="Nhập họ tên"></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item v-if="!isEditMode" label="Mật khẩu" prop="password" label-position="top">
                  <el-input v-model="ruleForm.password" placeholder="Nhập mật khẩu" type="password" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Số điện thoại" prop="phone" label-position="top">
                  <el-input v-model="ruleForm.phone" placeholder="Nhập số điện thoại" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="Giới tính" prop="gender">
                <el-radio-group v-model="ruleForm.gender">
                  <el-radio :value="1">Nam</el-radio>
                  <el-radio :value="2">Nữ</el-radio>
                  <el-radio :value="3">Khác</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-form-item label="Vai trò" prop="role">
              <el-select v-model="ruleForm.role" placeholder="Chọn vai trò">
                <el-option label="Phụ xe" :value="2"></el-option>
                <el-option label="Tài xế" :value="3"></el-option>
                <el-option label="Nhân viên" :value="4"></el-option>
                <el-option label="Quản trị viên" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Vai trò" prop="role">
              <el-switch v-model="ruleForm.status" size="large" active-text="Kích hoạt"
                inactive-text="Ngưng kích hoạt" />
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="ruleForm.email" placeholder="Nhập email" />
            </el-form-item>
          </el-form>

          <template #footer>
            <el-button @click="handleCloseDialog()">Hủy</el-button>
            <el-button type="primary" @click="submitForm(ruleFormRef)">Lưu</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="Chính sách">

        <Quill />
      </el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
  </section>
</template>
