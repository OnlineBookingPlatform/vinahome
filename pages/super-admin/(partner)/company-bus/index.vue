<script setup lang="ts">
definePageMeta({
  layout: "superadmin",
});
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import {
  createCompanyAPI,
  getCompanyAPI,
  updateCompanyAPI,
} from "~/api/companyAPI";
import type { BusCompanyType } from "~/types/CompanyType";

const isEditing = ref(false);
const dialogVisible = ref(false);
const dialogData = ref<BusCompanyType>({
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
const tableData = ref<BusCompanyType[]>([]);
const loading = ref(false);

const openEditDialog = (row: BusCompanyType) => {
  isEditing.value = true;
  dialogData.value = { ...row };
  dialogVisible.value = true;
};
const router = useRouter();
const openDetailCompanyBus = (row: BusCompanyType) => {
  router.push(`/super-admin/company-bus/${row.id}`);
};

const saveData = async () => {
  try {
    loading.value = true;
    if (isEditing.value) {
      if (!dialogData.value.id) {
        ElMessage.error("Không tìm thấy ID của công ty cần cập nhật!");
        return;
      }

      const response = await updateCompanyAPI(
        dialogData.value.id,
        dialogData.value
      );
      if (response.result) {
        const index = tableData.value.findIndex(
          (item) => item.id === dialogData.value.id
        );
        if (index !== -1) {
          tableData.value.splice(index, 1, { ...dialogData.value });
        }
        ElMessage.success("Cập nhật thành công!");
      } else {
        ElMessage.error(response.message || "Lỗi cập nhật dữ liệu!");
      }
    } else {
      const response = await createCompanyAPI(dialogData.value);
      console.log("Data send to server:", dialogData.value);
      if (response.result) {
        tableData.value.push(response.result);
        ElMessage.success("Thêm mới thành công!");
      } else {
        ElMessage.error(response.message || "Lỗi thêm mới dữ liệu!");
      }
    }
  } catch (error) {
    ElMessage.error("Lỗi hệ thống, vui lòng thử lại!");
  } finally {
    loading.value = false;
    dialogVisible.value = false;
    resetForm();
  }
};
const resetForm = () => {
  isEditing.value = false;
  dialogData.value = {
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
  ElMessageBox.confirm("Are you sure to close this dialog?")
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
      <el-table-column type="index" label="No" width="50" />
      <el-table-column prop="name" label="Name" />
      <el-table-column prop="phone" label="Phone" />
      <el-table-column prop="address" label="Address" />
      <el-table-column prop="status" label="Status" width="150">
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

      <el-table-column prop="tax_code" label="Tax Code" />
      <el-table-column prop="code" label="Code" />
      <el-table-column prop="note" label="Note" />
      <el-table-column fixed="right" label="Operations">
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

    <el-form label-width="120px">
      <el-form-item label="Tên nhà xe">
        <el-input v-model="dialogData.name" />
      </el-form-item>
      <el-form-item label="Số điện thoại">
        <el-input v-model="dialogData.phone" />
      </el-form-item>
      <el-form-item label="Địa chỉ">
        <el-input v-model="dialogData.address" />
      </el-form-item>
      <el-form-item label="Trạng thái">
        <el-select v-model="dialogData.status" placeholder="Chọn trạng thái">
          <el-option label="Hoạt động" :value="true" />
          <el-option label="Ngưng hoạt động" :value="false" />
        </el-select>
      </el-form-item>
      <el-form-item label="Mã số thuế">
        <el-input v-model="dialogData.tax_code" />
      </el-form-item>
      <el-form-item label="Mã nhà xe">
        <el-input v-model="dialogData.code" />
      </el-form-item>
      <el-form-item label="Ghi chú">
        <el-input v-model="dialogData.note" type="textarea" />
      </el-form-item>
    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Thoát</el-button>
        <el-button type="primary" @click="saveData">
          {{ isEditing ? "Cập nhật" : "Thêm mới" }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
