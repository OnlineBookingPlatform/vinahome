<script setup lang="ts">
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus';
import { createSuperAdminAccountAPI, deleteSuperAdminAccountAPI, getListSuperAdminAccountAPI, updateSuperAdminAccountAPI } from '~/api/accountAPI';
import type { DTO_RP_SuperAdmin, DTO_RQ_SuperAdmin } from '~/types/AccountType';
import { Delete, Edit } from "@element-plus/icons-vue";
definePageMeta({
    layout: "superadmin",
});
const dialogVisible = ref(false);
const tableData = ref<DTO_RP_SuperAdmin[]>([]);
const isLoading = ref(false);
const ruleFormRef = ref<FormInstance>()
const isEditMode = ref(false)
const handleEdit = async (row: DTO_RP_SuperAdmin) => {
    // Đặt chế độ chỉnh sửa
    isEditMode.value = true
    Object.assign(ruleForm, row) // Điền thông tin vào form

    // Hiển thị modal
    dialogVisible.value = true
}
const ruleForm = reactive<DTO_RQ_SuperAdmin>({
    id: null,
    username: null,
    password: null,
    name: null,
    account_type: null,
})
const rules = reactive({
    username: [
        { required: true, message: 'Vui lòng nhập tên tài khoản', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    ],
    name: [
        { required: true, message: 'Vui lòng nhập họ tên', trigger: 'blur' },
    ],
})
const resetForm = () => {
    ruleForm.id = null
    ruleForm.account_type = null
    ruleForm.username = null
    ruleForm.password = null
    ruleForm.name = null
    isEditMode.value = false
}
const submitForm = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            try {
                isLoading.value = true

                if (isEditMode.value) {
                    const res = await updateSuperAdminAccountAPI(ruleForm)
                    ElMessage.success('Cập nhật tài khoản thành công')

                    const index = tableData.value.findIndex(item => item.id === res.result.id)
                    if (index !== -1) {
                        tableData.value[ index ] = { ...res.result }
                    }
                } else {
                    const res = await createSuperAdminAccountAPI(ruleForm)
                    if (res.status === 200) {
                        ElMessage.success('Thêm tài khoản thành công')
                        tableData.value.push(res.result)
                    } else {
                        ElMessage.error(res.message || 'Thêm không thành công')
                    }
                }
                dialogVisible.value = false
            } catch (error) {
                ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.')
            } finally {
                isLoading.value = false
                resetForm()
            }
        } else {
            console.log('error submit!', fields)
        }
    })
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
const fetchSuperAdminAccount = async () => {
    isLoading.value = true;
    try {
        const response = await getListSuperAdminAccountAPI()
        tableData.value = response.result
    } catch (error) {
        ElMessage.error('Lỗi hệ thông, vui lòng thử lại sau.');
    } finally {
        isLoading.value = false;
    }
}

const handleDelete = async (row: DTO_RP_SuperAdmin) => {
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
        const res = await deleteSuperAdminAccountAPI(row)
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
const handleCloseDialog = () => {
    dialogVisible.value = false
    resetForm()
}

onMounted(() => {
    fetchSuperAdminAccount()
})  
</script>
<template>
    <section class="p-2">
        <el-button type="primary" @click="dialogVisible = true">Thêm tài khoản</el-button>
    </section>
    <section class="p-2">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="name" label="Họ tên" />
            <el-table-column prop="username" label="Tài khoản" />
            <el-table-column prop="account_type" label="Loại tài khoản">
                <template #default="{ row }">
                    <el-tag>
                        {{ row.account_type }}
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

    </section>

    <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Chỉnh sửa tài khoản' : 'Thêm tài khoản'" width="500"
        :before-close="handleClose">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
            class="demo-ruleForm">
            <el-form-item label="Họ tên" prop="name" label-position="top">
                <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Tài khoản" prop="username" label-position="top">
                <el-input v-model="ruleForm.username" type="text" autocomplete="off" />
            </el-form-item>

            <el-form-item v-if="!isEditMode" label="Mật khẩu" prop="password" label-position="top">
                <el-input v-model="ruleForm.password" type="password" autocomplete="off" />
            </el-form-item>
        </el-form>

        <template #footer>
            <div class="dialog-footer">
                <el-button @click="handleCloseDialog()">Thoát</el-button>
                <el-button type="primary" @click="submitForm(ruleFormRef)" :loading="isLoading">Lưu</el-button>
            </div>
        </template>
    </el-dialog>

</template>