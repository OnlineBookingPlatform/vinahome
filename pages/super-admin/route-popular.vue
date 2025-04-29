<script setup lang="ts">
import { ref } from "vue";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage, type FormInstance, type UploadProps, type UploadUserFile } from "element-plus";
import type { RoutePopularType } from "~/types/RouteType";
import { createRoutePopularAPI, updateRoutePopularAPI, getListRoutePopularAPI } from "~/api/routeAPI";

definePageMeta({
    layout: "superadmin",
});
const isLoading = ref(false);
const dialogVisible = ref(false);
const tableData = ref<RoutePopularType[]>([]);
const ruleFormRef = ref<FormInstance>()
const isEditMode = ref(false)
const ruleForm = reactive<RoutePopularType>({
    id: null,
    name: null,
    url_avatar: null,
    base_price: null,
    status: false,
});



const rules = reactive({
    name: [
        { required: true, message: 'Vui lòng nhập tên tuyến', trigger: 'blur' },
    ],
    base_price: [
        { required: true, message: 'Vui lòng nhập giá vé', trigger: 'blur' },
    ],
    url_avatar: [
        { required: true, message: 'Vui lòng nhập URL hình ảnh', trigger: 'blur' },
    ],
});
const resetForm = () => {
    ruleForm.id = null
    ruleForm.name = null
    ruleForm.url_avatar = null
    ruleForm.base_price = null
    ruleForm.status = false
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
                    const res = await updateRoutePopularAPI(ruleForm)
                    ElMessage.success('Cập nhật tuyến thành công')

                    const index = tableData.value.findIndex(item => item.id === res.result.id)
                    if (index !== -1) {
                        tableData.value[ index ] = { ...res.result }
                    }
                } else {
                    const res = await createRoutePopularAPI(ruleForm)
                    if (res.status === 200) {
                        ElMessage.success('Thêm tuyến thành công')
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

const fetchRoutePopular = async () => {
    try {
        const res = await getListRoutePopularAPI()
        if (res.status === 200) {
            tableData.value = res.result
        } else {
            ElMessage.error(res.message || 'Lấy danh sách tuyến không thành công')
        }
    } catch (error) {
        ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.')
    }
}


const handleEdit = (row: RoutePopularType) => {
    console.log("Edit row: ", row);
}
const handleDelete = (row: RoutePopularType) => {
    console.log("Delete row: ", row);
}
onMounted(() => {
    fetchRoutePopular()
})
</script>


<template>
    <section class="p-2">
        <el-button type="primary" @click="dialogVisible = true">Thêm tuyến</el-button>
    </section>
    <section class="p-2">
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column type="index" label="STT" width="50" />
            <el-table-column prop="name" label="Tên tuyến" />
            <el-table-column prop="url_avatar" label="URL Hình ảnh" />
            <el-table-column prop="base_price" label="Giá cơ bản">
                <template #default="{ row }">
                    {{
                        new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND',
                    minimumFractionDigits: 0
                    }).format(row.base_price)
                    }}
                </template>
            </el-table-column>

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
    </section>

    <el-dialog v-model="dialogVisible" :title="isEditMode ? 'Chỉnh sửa tuyến' : 'Thêm tuyến'" width="500"
        :before-close="handleClose">
        <el-form ref="ruleFormRef" :model="ruleForm" status-icon :rules="rules" label-width="auto"
            class="demo-ruleForm">
            <el-form-item label="Tên tuyến" prop="name" label-position="top">
                <el-input v-model="ruleForm.name" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="URL Hình ảnh" prop="url_avatar" label-position="top">
                <el-input v-model="ruleForm.url_avatar" type="textarea" autocomplete="off"
                    :autosize="{ minRows: 2, maxRows: 4 }" />
            </el-form-item>
            <el-form-item label="Giá cơ bản" prop="base_price" label-position="top">
                <el-input v-model="ruleForm.base_price" type="text" autocomplete="off" />
            </el-form-item>
            <el-form-item label="Trạng thái" prop="status" label-position="top">
                <el-switch v-model="ruleForm.status" active-text="Kích hoạt" inactive-text="Ngưng kích hoạt" />
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

<style scoped>
.box-card {
    padding: 20px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
}

.avatar-uploader-box {
    width: 150px;
    height: 90px;
    border: 2px dashed #dcdfe6;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 5px;
    cursor: pointer;
    font-size: 24px;
    color: #909399;
    background-color: #f9f9f9;
    transition: border-color 0.3s ease, background-color 0.3s ease;
}

.avatar-uploader-box:hover {
    border-color: #409eff;
    background-color: #f1faff;
}

.el-image {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
}
</style>
