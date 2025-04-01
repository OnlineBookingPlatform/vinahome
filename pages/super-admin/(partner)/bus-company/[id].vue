<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, ElMessageBox } from "element-plus";
import TableListAccount from "~/components/super-admin/company-bus/TableListAccount.vue";
import { getListsAccountByCompanyAPI } from "~/api/accountAPI";
import type { AccountByCompanyBusType } from "~/types/AccountType";

definePageMeta({
  layout: "superadmin",
});

const route = useRoute();
const loading = ref(false);
const accounts = ref<AccountByCompanyBusType[]>([]);
const isModalOpen = ref(false);
const isEditMode = ref(false);
const companyId = route.params.id;

const selectedAccount = ref<AccountByCompanyBusType>({
  id: '', 
  name: '',
  username: '',
  password:'',
  phone: '',
  gender: 1,  
  role: 2,    
  email: '',
  company_id: Number(companyId),
});

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

// Open modal for adding new account
const openAddModal = () => {
  isEditMode.value = false;
  selectedAccount.value = {
    id: '', 
    name: '',
    username: '',
    password:'',
    phone: '',
    gender: 1,
    role: 2,
    email: '',
    company_id: Number(companyId),
  };
  isModalOpen.value = true;
};

// Open modal for editing an account
const openEditModal = (account: AccountByCompanyBusType) => {
  isEditMode.value = true;
  selectedAccount.value = { ...account };
  isModalOpen.value = true;
};

const generateUniqueId = () => {
  return `id-${Math.floor(Math.random() * 1000000)}`;
};

// Save or update account
const saveUser = () => {
  if (!selectedAccount.value.name || !selectedAccount.value.username) {
    ElMessage.error("Vui lòng nhập đầy đủ thông tin.");
    return;
  }
  if (isEditMode.value) {
    if (!selectedAccount.value.id) {
      ElMessage.error("Không tìm thấy ID của tài khoản để cập nhật.");
      return;
    }
    const index = accounts.value.findIndex(acc => acc.id === selectedAccount.value.id);
    if (index !== -1) {
      accounts.value[index] = { ...selectedAccount.value };  
      ElMessage.success("Cập nhật tài khoản thành công!");
    } else {
      ElMessage.error("Tài khoản không tồn tại.");
    }
  } else {
    const newAccount = { ...selectedAccount.value, id: generateUniqueId() };
    accounts.value.push(newAccount);  
    ElMessage.success("Thêm tài khoản thành công!");
  }
  console.log("Account data being saved:", selectedAccount.value);
  isModalOpen.value = false;
};

// Handle account deletion
const handleDelete = (accountId: string) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn xóa tài khoản này?", "Xác nhận", {
    confirmButtonText: "Xóa",
    cancelButtonText: "Hủy",
    type: "warning",
  })
    .then(() => {
      accounts.value = accounts.value.filter(account => account.id !== accountId);
      ElMessage.success("Xóa tài khoản thành công!");
    })
    .catch(() => {
      console.log("Hủy xóa");
    });
};
</script>

<template>
  <section class="p-2">
    <el-tabs type="border-card">
      <el-tab-pane label="Tài khoản">
        <div>
          <el-button type="primary" @click="openAddModal">Thêm tài khoản</el-button>
        </div>
        <TableListAccount :loading="loading" :accounts="accounts" @edit="openEditModal" @delete="handleDelete" />
        <!-- Modal -->
        <el-dialog v-model="isModalOpen" :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'" width="500px">
          <el-form :model="selectedAccount" ref="userForm">
            <el-form-item label="Tên" prop="name">
              <el-input v-model="selectedAccount.name" placeholder="Nhập họ tên"></el-input>
            </el-form-item>
            <el-form-item label="Tài khoản" prop="username">
              <el-input v-model="selectedAccount.username" placeholder="Nhập tài khoản"></el-input>
            </el-form-item>
            <el-form-item label="Mật khẩu" prop="password">
              <el-input v-model="selectedAccount.password" placeholder="Nhập tài khoản"></el-input>
            </el-form-item>
            <el-form-item label="Số điện thoại" prop="phone">
              <el-input v-model="selectedAccount.phone" placeholder="Nhập số điện thoại"></el-input>
            </el-form-item>
            <el-form-item label="Giới tính" prop="gender">
              <el-radio-group v-model="selectedAccount.gender">
                <el-radio :value="1">Nam</el-radio>
                <el-radio :value="2">Nữ</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="Vai trò" prop="role">
              <el-select v-model="selectedAccount.role" placeholder="Chọn vai trò">
                <el-option label="Phụ xe" :value="2"></el-option>
                <el-option label="Tài xế" :value="3"></el-option>
                <el-option label="Nhân viên" :value="4"></el-option>
                <el-option label="Quản trị viên" :value="5"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="Email" prop="email">
              <el-input v-model="selectedAccount.email" placeholder="Nhập email"></el-input>
            </el-form-item>
          </el-form>

          <template #footer>
            <el-button @click="isModalOpen = false">Hủy</el-button>
            <el-button type="primary" @click="saveUser">Lưu</el-button>
          </template>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="Tuyến">Config</el-tab-pane>
      <el-tab-pane label="Role">Role</el-tab-pane>
      <el-tab-pane label="Task">Task</el-tab-pane>
    </el-tabs>
  </section>
</template>
