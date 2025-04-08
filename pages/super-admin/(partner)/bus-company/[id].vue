<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TableListAccount from "~/components/super-admin/company-bus/TableListAccount.vue";
import { getListsAccountByCompanyAPI } from "~/api/accountAPI";
import type { AccountByCompanyBusType } from "~/types/AccountType";
import Quill from "~/components/Quill.vue";
definePageMeta({
  layout: "superadmin",
});

const route = useRoute();
const loading = ref(false);
const companyId = route.params.id;

onMounted(() => {
  const companyId = route.params.id;
  // fetchAccounts(Number(companyId));
});

const fetchAccounts = async (companyId: number) => {
  loading.value = true;
  try {
    const response = await getListsAccountByCompanyAPI(companyId);
    accounts.value = response.result;
  } catch (error) {
    ElMessage.error("Lỗi hệ thống, vui lòng thử lại!");
  } finally {
    loading.value = false;
  }
};

// Dữ liệu tài khoản
const accounts = ref<AccountByCompanyBusType[]>([
  {
    id: "1",
    name: "Nguyễn Văn A",
    username: "nguyenvana",
    password: "123456",
    phone: "0901234567",
    email: "a@gmail.com",
    company_id: Number(companyId),
    gender: 1,
    role: 2,
  },
  {
    id: "2",
    name: "Trần Thị B",
    username: "tranthib",
    password: "123456",
    phone: "0907654321",
    email: "b@gmail.com",
    company_id: Number(companyId),
    gender: 2,
    role: 4,
  },
]);

// Modal
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedAccountId = ref<string | null>(null);
const userForm = ref<any>(null);

const newAccount = ref<AccountByCompanyBusType>({
  id: "",
  name: "",
  username: "",
  password: "",
  phone: "",
  email: "",
  company_id: Number(companyId),
  gender: 1,
  role: 2,
});

// Validation Rules
const rules = {
  name: [
    { required: true, message: "Tên không được để trống", trigger: "blur" },
  ],
  username: [
    {
      required: true,
      message: "Tài khoản không được để trống",
      trigger: "blur",
    },
    { min: 6, message: "Tài khoản phải có ít nhất 6 ký tự", trigger: "blur" },
  ],
  password: [
    {
      required: true,
      message: "Mật khẩu không được để trống",
      trigger: "blur",
    },
    { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự", trigger: "blur" },
  ],
  phone: [
    {
      required: true,
      message: "Số điện thoại không được để trống",
      trigger: "blur",
    },
    {
      pattern: /^[0-9]{10}$/,
      message: "Số điện thoại không hợp lệ",
      trigger: "blur",
    },
  ],
  email: [
    { required: true, message: "Email không được để trống", trigger: "blur" },
    { type: "email", message: "Email không hợp lệ", trigger: "blur" },
  ],
  role: [
    { required: true, message: "Vui lòng chọn vai trò", trigger: "change" },
  ],
};

// Mở modal thêm
const openAddModal = () => {
  isEditMode.value = false;
  selectedAccountId.value = null;
  Object.assign(newAccount.value, {
    id: "",
    name: "",
    username: "",
    password: "",
    phone: "",
    email: "",
    company_id: Number(companyId),
    gender: 1,
    role: 2,
  });
  isModalOpen.value = true;
};

// Mở modal chỉnh sửa
const openEditModal = (account: AccountByCompanyBusType) => {
  isEditMode.value = true;
  selectedAccountId.value = account.id;
  Object.assign(newAccount.value, account);
  isModalOpen.value = true;
};

// Lưu tài khoản
const saveAccount = () => {
  userForm.value?.validate((valid: boolean) => {
    if (!valid) return;

    if (isEditMode.value && selectedAccountId.value) {
      const index = accounts.value.findIndex(
        (acc) => acc.id === selectedAccountId.value
      );
      if (index !== -1) accounts.value[index] = { ...newAccount.value };
      ElMessage.success("Cập nhật tài khoản thành công!");
      console.log("Cập nhật tài khoản với ID:", newAccount.value);
    } else {
      newAccount.value.id = generateUniqueId();
      accounts.value.push({ ...newAccount.value });
      ElMessage.success("Thêm tài khoản thành công!");
      console.log("Thêm tài khoản mới:", newAccount.value);
    }

    isModalOpen.value = false;
  });
};

// Xóa tài khoản
const deleteAccount = (accountId: string) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn xóa tài khoản này?", "Xác nhận", {
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    type: "warning",
  })
    .then(() => {
      accounts.value = accounts.value.filter(
        (account) => account.id !== accountId
      );
      ElMessage.success("Xóa tài khoản thành công!");
    })
    .catch(() => {
      console.log("Hủy xóa");
    });
};

// Tạo ID ngẫu nhiên cho tài khoản mới
const generateUniqueId = () => {
  return `id-${Math.floor(Math.random() * 1000000)}`;
};

// Đóng modal
const closeModal = () => {
  isModalOpen.value = false;
  userForm.value?.resetFields();
};

// Xác nhận trước khi đóng modal
const handleBeforeClose = (done?: () => void) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn thoát không?", "Xác nhận", {
    confirmButtonText: "OK",
    cancelButtonText: "Hủy",
    type: "warning",
  })
    .then(() => {
      isModalOpen.value = false;
      userForm.value?.resetFields();
      if (done) done();
    })
    .catch(() => {});
};


</script>

<template>
  <section class="p-2">
    <el-tabs type="border-card">
      <el-tab-pane label="Tài khoản">
        <div>
          <el-button type="primary" @click="openAddModal"
            >Thêm tài khoản</el-button
          >
        </div>
        <TableListAccount
          :loading="loading"
          :accounts="accounts"
          @edit="openEditModal"
          @delete="deleteAccount"
        />
        <!-- Modal -->
        <el-dialog
          v-model="isModalOpen"
          :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'"
          width="500px"
          :before-close="handleBeforeClose"
        >
          <el-form :model="newAccount" ref="userForm" :rules="rules">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Tài khoản"
                  prop="username"
                  label-position="top"
                >
                  <el-input
                    v-model="newAccount.username"
                    placeholder="Nhập tài khoản"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tên" prop="name" label-position="top">
                  <el-input
                    v-model="newAccount.name"
                    placeholder="Nhập họ tên"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item
                  label="Mật khẩu"
                  prop="password"
                  label-position="top"
                >
                  <el-input
                    v-model="newAccount.password"
                    placeholder="Nhập mật khẩu"
                    type="password"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  label="Số điện thoại"
                  prop="phone"
                  label-position="top"
                >
                  <el-input
                    v-model="newAccount.phone"
                    placeholder="Nhập số điện thoại"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item label="Giới tính" prop="gender">
                <el-radio-group v-model="newAccount.gender">
                  <el-radio :value="1">Nam</el-radio>
                  <el-radio :value="2">Nữ</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="Vai trò" prop="role">
                  <el-select
                    v-model="newAccount.role"
                    placeholder="Chọn vai trò"
                  >
                    <el-option label="Phụ xe" :value="2"></el-option>
                    <el-option label="Tài xế" :value="3"></el-option>
                    <el-option label="Nhân viên" :value="4"></el-option>
                    <el-option label="Quản trị viên" :value="5"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Email" prop="email">
              <el-input
                v-model="newAccount.email"
                placeholder="Nhập email"
              ></el-input>
            </el-form-item>
          </el-form>

          <template #footer>
            <el-button @click="closeModal">Hủy</el-button>
            <el-button type="primary" @click="saveAccount">Lưu</el-button>
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
