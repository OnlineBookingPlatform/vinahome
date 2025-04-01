<script setup lang="ts">
definePageMeta({
  layout: "superadmin",
});
import {
  ElMessage,
  ElMessageBox,
} from "element-plus";
import type { FormInstance, FormRules } from 'element-plus'
import { th } from "element-plus/es/locales.mjs";
import { ref } from "vue";
import {
  createCompanyAPI,
  deleteCompanyAPI,
  getCompanyAPI,
  updateCompanyAPI,
} from "~/api/companyAPI";
import type { BusCompanyType } from "~/types/CompanyType";

const isEditing = ref(false);
const isSaving = ref(false);
const dialogVisible = ref(false);
const tableData = ref<BusCompanyType[]>([]);
const loading = ref(false);
const isDeleting = ref(false);
const form = ref<BusCompanyType>({
  id: 0,
  name: "",
  phone: "",
  address: "",
  status: false,
  tax_code: "",
  code: "",
  note: "",
  url_logo: "",
  created_at: "",
});
const ruleFormRef = ref<FormInstance>();
const rules = reactive<FormRules<BusCompanyType>>({
  name: [
    { required: true, message: "Vui lòng nhập tên nhà xe", trigger: "blur" },
  ],
  phone: [
    { required: true, message: "Vui lòng nhập số điện thoại", trigger: "blur" },
  ],
  code: [
    { required: true, message: "Vui lòng nhập mã nhà xe", trigger: "blur" },
  ],
});
const openEditDialog = (row: BusCompanyType) => {
  isEditing.value = true;
  form.value = { ...row };
  dialogVisible.value = true;
};
const router = useRouter();
const openDetailCompanyBus = (row: BusCompanyType) => {
  router.push(`/super-admin/bus-company/${row.id}`);
};
const saveData = async () => {
  if (!ruleFormRef.value) return;
  try {
    await ruleFormRef.value.validate();
  } catch (error) {
    console.log("Lỗi validation:", error);
    return;
  }
  try {
    loading.value = true;
    isSaving.value = true;

    if (isEditing.value) {
      if (!form.value.id) {
        ElMessage.error("Không tìm thấy dữ liệu công ty cần cập nhật!");
        return;
      }

      const response = await updateCompanyAPI(form.value.id, form.value);

      if (response.result) {
        const index = tableData.value.findIndex(
          (item) => item.id === form.value.id
        );
        if (index !== -1) {
          tableData.value.splice(index, 1, { ...form.value });
        }
        ElMessage.success("Cập nhật thành công!");
        dialogVisible.value = false;
        resetForm();
      } else {
        ElMessage.error(response.message || "Lỗi cập nhật dữ liệu!");
      }
    } else {
      const response = await createCompanyAPI(form.value);
      console.log("Data sent to server:", form.value);
      if (response.result) {
        tableData.value.push(response.result);
        ElMessage.success("Thêm mới thành công!");
        dialogVisible.value = false;
        resetForm();
      } else {
        ElMessage.error(response.message || "Lỗi thêm mới dữ liệu!");
      }
    }
  } catch (error) {
    ElMessage.error("Lỗi hệ thống, vui lòng thử lại!");
    console.error("Lỗi khi gọi API:", error);
  } finally {
    loading.value = false;
    isSaving.value = false;
  }
};


const handleDelete = async () => {
  if (!form.value.id) {
    ElMessage.error("Không tìm thấy dữ liệu công ty để xóa!");
    return;
  }
  try {
    await ElMessageBox.confirm(
      "Bạn có chắc chắn muốn xóa công ty này?",
      "Xác nhận",
      {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
      }
    );
    isDeleting.value = true;
    await deleteCompanyAPI(form.value.id);
    ElMessage.success("Xóa công ty thành công!");
    tableData.value = tableData.value.filter(
      (item) => item.id !== form.value.id
    );
    dialogVisible.value = false;
  } catch (error) {
    ElMessage.error("Xóa công ty thất bại!");
  } finally {
    isDeleting.value = false;
  }
};
const resetForm = () => {
  isEditing.value = false;
  form.value = {
    id: 0,
    name: "",
    phone: "",
    address: "",
    status: false,
    tax_code: "",
    code: "",
    note: "",
    url_logo: "",
    created_at: "",
  };
};
const handleClose = (done: () => void) => {
  ElMessageBox.confirm("Bạn có chắc chắn muốn thoát không?")
    .then(() => {
      done();
      resetForm();
    })
    .catch(() => {
      // catch error
    });
};
const fetchCompanies = async () => {
  loading.value = true; // Bắt đầu hiển thị loading
  try {
    const response = await getCompanyAPI();
    if (response.result) {
      tableData.value = response.result;
    } else {
      console.error("Error fetching companies:", response.message);
    }
  } catch (error) {
    console.error("API error:", error);
  } finally {
    loading.value = false;
  }
};
const closeDialog = () => {
  dialogVisible.value = false;
  if (ruleFormRef.value) {
    ruleFormRef.value.resetFields();
  }
  resetForm();
};
onMounted(fetchCompanies);
</script>
<template>
  <section class="mx-auto p-4">
    <div class="flex justify-between items-center">
      <h3 class="text-lg font-semibold">Danh sách nhà xe</h3>
      <el-button type="primary" @click="dialogVisible = true"
        >Thêm nhà xe</el-button
      >
    </div>
    <el-table :data="tableData" style="width: 100%" v-loading="loading">
      <el-table-column type="index" label="STT" width="50" />
      <el-table-column prop="name" label="Tên nhà xe" />
      <el-table-column prop="phone" label="Số điện thoại" />
      <el-table-column prop="address" label="Địa chỉ" />
      <el-table-column prop="status" label="Trạng thái" width="150">
        <template #default="{ row }">
          <el-tag
            :type="row.status ? 'success' : 'danger'"
            class="text-center"
            disable-transitions
          >
            {{ row.status ? "Đang hoạt động" : "Ngừng hoạt động" }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="tax_code" label="Mã số thuế" />
      <el-table-column prop="code" label="Mã nhà xe" />
      <el-table-column prop="note" label="Ghi chú" />
      <el-table-column fixed="right" label="Tùy chọn">
        <template #default="{ row }">
          <el-button
            link
            type="primary"
            size="small"
            @click="openDetailCompanyBus(row)"
            >Detail</el-button
          >
          <el-button
            link
            type="primary"
            size="small"
            @click="openEditDialog(row)"
            >Edit</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </section>

  <el-dialog v-model="dialogVisible" width="500" :before-close="handleClose">
    <template #title>
      <span class="text-lg">{{
        isEditing ? "Chỉnh sửa nhà xe" : "Thêm nhà xe mới"
      }}</span>
    </template>

    <el-form
      label-width="120px"
      ref="ruleFormRef" :model="form" :rules="rules"
    >
      <el-form-item label="Tên nhà xe" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="Số điện thoại" prop="phone">
        <el-input v-model="form.phone" />
      </el-form-item>
      <el-form-item label="Địa chỉ">
        <el-input v-model="form.address" />
      </el-form-item>
      <el-form-item label="Trạng thái">
        <el-select v-model="form.status" placeholder="Chọn trạng thái">
          <el-option label="Hoạt động" :value="true" />
          <el-option label="Ngưng hoạt động" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mã số thuế">
        <el-input v-model="form.tax_code" />
      </el-form-item>
      <el-form-item label="Mã nhà xe" prop="code">
        <el-input v-model="form.code" />
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-input v-model="form.note" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" :loading="isDeleting" @click="handleDelete" v-if="isEditing"
          >Xóa</el-button
        >
        <el-button @click="closeDialog">Thoát</el-button>
        <el-button type="primary" @click="saveData" :loading="isSaving">
          {{ isEditing ? "Cập nhật" : "Thêm mới" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
