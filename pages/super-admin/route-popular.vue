<script setup lang="ts">
import { ref } from "vue";
import { Edit, Delete, Plus } from "@element-plus/icons-vue";
import { ElMessageBox, ElMessage } from "element-plus";

definePageMeta({
    layout: "superadmin",
});

interface Route {
    id: number;
    image: string;
    name: string;
    price: number;
    status: boolean;
}

const routes = ref<Route[]>([
    { id: 4, image: "https://res.cloudinary.com/dsw7kuodi/image/upload/v1742804367/account/v1/hn0gvv67zf0kua468qge.jpg", name: "Hà Nội - Sài Gòn", price: 500000, status: true },
    { id: 7, image: "https://res.cloudinary.com/dsw7kuodi/image/upload/v1742804367/account/v1/hn0gvv67zf0kua468qge.jpg", name: "Đà Nẵng - Hà Nội", price: 350000, status: false },
    { id: 9, image: "https://res.cloudinary.com/dsw7kuodi/image/upload/v1742804367/account/v1/hn0gvv67zf0kua468qge.jpg", name: "Hải Phòng - Quảng Ninh", price: 20000, status: true }
]);

// Modal
const isModalOpen = ref(false);
const isEditMode = ref(false);
const selectedRouteId = ref<number | null>(null);
const routeForm = ref<any>(null);

const newRoute = ref<Route>({
    id: 0,
    image: "",
    name: "",
    price: 0,
    status: true,
});

// Rules
const rules = {
    name: [{ required: true, message: "Tên tuyến không được để trống", trigger: "blur" }],
    price: [
        { required: true, message: "Giá vé không được để trống", trigger: "blur" },
        {
            validator: (_rule: any, value: number, callback: Function) => {
                if (value <= 0) callback(new Error("Giá vé phải lớn hơn 0"));
                else callback();
            }, trigger: "blur"
        }
    ],
    image: [
        { required: true, message: "Vui lòng nhập URL hình ảnh", trigger: "blur" },
        { type: "url", message: "URL hình ảnh không hợp lệ", trigger: "blur" },
    ],
};

// Mở modal add
const openAddModal = () => {
    isEditMode.value = false;
    selectedRouteId.value = null;
    Object.assign(newRoute.value, { id: 0, image: "", name: "", price: 0, status: true });
    isModalOpen.value = true;
};

// Mở modal edit
const openEditModal = (route: Route) => {
    isEditMode.value = true;
    selectedRouteId.value = route.id;
    Object.assign(newRoute.value, route);
    isModalOpen.value = true;
};

// Button Lưu
const saveRoute = () => {
    routeForm.value?.validate((valid: boolean) => {
        if (!valid) return;

        if (isEditMode.value && selectedRouteId.value !== null) {
            const index = routes.value.findIndex((r) => r.id === selectedRouteId.value);
            if (index !== -1) routes.value[index] = { ...newRoute.value };
            ElMessage.success("Cập nhật tuyến xe thành công!");
        } else {
            const maxId = routes.value.length > 0 ? Math.max(...routes.value.map((r) => r.id)) : 0;
            newRoute.value.id = maxId + 1;
            routes.value.push({ ...newRoute.value });
            ElMessage.success("Thêm tuyến xe thành công!");
        }

        isModalOpen.value = false;
    });
};

// Button Xóa
const deleteRoute = (routeId: number) => {
    ElMessageBox.confirm("Bạn có chắc chắn muốn xóa tuyến xe này?", "Xác nhận", {
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
        type: "warning",
    })
        .then(() => {
            routes.value = routes.value.filter((route) => route.id !== routeId);
            ElMessage.success("Xóa tuyến xe thành công!");
        })
        .catch(() => {
            console.log("Hủy xóa");
        });
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
            if (done) done();
        })
        .catch(() => { });
};

</script>


<template>
    <el-card class="box-card">
        <div class="header">
            <h2 class="text-lg font-semibold">Danh Sách Tuyến Xe</h2>
            <el-button type="primary" :icon="Plus" @click="openAddModal">Thêm tuyến</el-button>
        </div>

        <!-- Table -->
        <el-table :data="routes" style="width: 100%">
            <el-table-column type="index" label="STT" width="60"></el-table-column>
            <el-table-column label="Hình ảnh">
                <template #default="{ row }">
                    <el-image :src="row.image" fit="cover" style="width: 150px; height: 90px; border-radius: 5px" />
                </template>
            </el-table-column>

            <el-table-column prop="name" label="Tên tuyến"></el-table-column>
            <el-table-column label="Giá vé">
                <template #default="{ row }">
                    {{ new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(row.price) }}
                </template>
            </el-table-column>

            <el-table-column label="Trạng thái">
                <template #default="{ row }">
                    <el-tag :type="row.status ? 'success' : 'info'">
                        {{ row.status ? "Hiện" : "Ẩn" }}
                    </el-tag>
                </template>
            </el-table-column>

            <el-table-column label="Tùy chọn" width="150">
                <template #default="{ row }">
                    <el-button type="primary" :icon="Edit" circle @click="openEditModal(row)"></el-button>
                    <el-button type="danger" :icon="Delete" circle @click="deleteRoute(row.id)"></el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

    <!-- Modal -->
    <el-dialog v-model="isModalOpen" :title="isEditMode ? 'Chỉnh Sửa Tuyến Xe' : 'Thêm Tuyến Xe'" width="500px"
        :close-on-click-modal="false" :before-close="handleBeforeClose">

        <el-form ref="routeForm" :model="newRoute" :rules="rules" label-width="120px" @submit.prevent="saveRoute">
            <el-form-item label="Tên tuyến" prop="name">
                <el-input v-model="newRoute.name" placeholder="Nhập tên tuyến"></el-input>
            </el-form-item>

            <el-form-item label="Giá vé" prop="price">
                <el-input v-model="newRoute.price" placeholder="Nhập giá vé" type="number"
                    @input="newRoute.price = Number(newRoute.price) || 0">
                </el-input>
            </el-form-item>

            <el-form-item label="Hình ảnh" prop="image">
                <el-input v-model="newRoute.image" placeholder="Nhập URL hình ảnh"></el-input>
            </el-form-item>

            <el-form-item label="Trạng thái">
                <el-switch v-model="newRoute.status" active-text="Hiện" inactive-text="Ẩn" />
            </el-form-item>
        </el-form>

        <template #footer>
            <el-button @click="isModalOpen = false">Hủy</el-button>
            <el-button type="primary" @click="saveRoute">Lưu</el-button>
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
</style>
