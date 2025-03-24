<script setup lang="ts">
import type { UserType } from "~/types/AccountType";

definePageMeta({
  layout: 'default'
});
import ContentAccountCustomer from "~/components/customer/ContentAccountCustomer.vue"
import { ElMessage, ElMessageBox, type UploadProps, type UploadUserFile } from 'element-plus'
import { getAccountInfo, updateAccountInfo, updateAvatarOnServer, uploadAvatarToCloudinary } from "~/api/accountAPI";
import { useUserStore } from "~/stores/userStore";

const userStore = useUserStore();
const userId = ref<number | null>(null);
const userInfo = ref<UserType>({} as UserType);
const loading = ref(false)

const fetchUserInfo = async () => {
  if (!userId.value) return;
  loading.value = true;
  try {
    const response = await getAccountInfo(userId.value);
    console.log("response", response);
    if (response) {
      userInfo.value = response.result;
      // ElMessage.success("Tải thông tin người dùng thành công!");
    } else {
      console.error("Failed to fetch user data:", response);
      ElMessage.error("Lỗi khi tải thông tin người dùng");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    ElMessage.error("Có lỗi xảy ra, vui lòng thử lại");
  } finally {
    loading.value = false;
  }
};

const fileList = ref([]);

const handleAvatarUpload: UploadProps[ "onSuccess" ] = (response, file) => {
  if (userInfo.value) {
    userInfo.value.url_avatar = URL.createObjectURL(file.raw as Blob);
  }
};
const beforeAvatarUpload = async (file: File) => {
  loading.value = true;
  const imageUrl = await uploadAvatarToCloudinary(file);

  if (imageUrl) {
    console.log("Avatar uploaded:", imageUrl);
    if (userId.value !== null) {
      await updateAvatarOnServer(userId.value, imageUrl);
    }
    userInfo.value.url_avatar = imageUrl; 
    userStore.setUserData({
        ...userStore.userData,
        url_avatar: imageUrl,
      });
    ElMessage.success("Cập nhật ảnh đại diện thành công!");
  } else {
    ElMessage.error("Tải ảnh thất bại!");
  }
  loading.value = false;
};

const saveChanges = async () => {
  console.log("Dữ liệu cập nhật:", userInfo.value);
  if (!userId.value) return;
  loading.value = true;
  try {
    const updatedData: Partial<UserType> = {
      name: userInfo.value.name,
      date_birth: userInfo.value.date_birth,
      gender: userInfo.value.gender,
      phone: userInfo.value.phone,
    };
    const response = await updateAccountInfo(userId.value, updatedData);
    if (response.result) {
      ElMessage.success("Cập nhật thông tin thành công!");
    } else {
      ElMessage.error("Lỗi khi cập nhật thông tin");
    }
  } catch (error) {
    console.error("Error updating account:", error);
    ElMessage.error("Có lỗi xảy ra, vui lòng thử lại");
  } finally {
    loading.value = false;
  }
};

watchEffect(async () => {
  if (userStore.userData?.id) {
    userId.value = userStore.userData.id;
    await fetchUserInfo();
  }
});
onMounted(() => {
  if (userStore.userData?.id) {
    userId.value = userStore.userData.id;
    fetchUserInfo();
  }
});

</script>

<template>
  <NuxtLayout name="layout-v1">
    <!--    <ContentAccountCustomer/>-->
    <h2 class="text-lg">Thông tin cá nhân</h2>
    <div class="bg-white rounded-lg w-full py-2" v-loading="loading">
      <div class="mx-5 my-5 flex items-center">
        <div class="flex flex-col w-full">
          <span class="text-sm font-semibold mb-2">Ảnh đại diện</span>
          <div class="flex items-center mb-6">
            <el-avatar :size="70" :src="userInfo.url_avatar" />
            <el-upload class="upload-demo mx-3" 
              :auto-upload="true" 
              :show-file-list="false" 
              :before-upload="beforeAvatarUpload"
              accept="image/*"
            >
              <el-button type="info">
                Cập nhật ảnh mới
              </el-button>
            </el-upload>
          </div>
          <div class="flex w-full">
            <div class="w-1/2 mr-2">
              <div class="flex flex-col w-full ">
                <span class="text-sm font-semibold mb-2">Họ và tên</span>
                <el-input v-model="userInfo.name" size="large" placeholder="Họ và tên" />
              </div>
              <div class="flex flex-col w-full my-5">
                <span class="text-sm font-semibold mb-2">Ngày sinh</span>
                <el-date-picker v-model="userInfo.date_birth" type="date" placeholder="Ngày sinh" class="w-full"
                  size="large" />
              </div>
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Giới tính</span>
                <el-radio-group v-model="userInfo.gender">
                  <el-radio size="large" :value="1">Nam</el-radio>
                  <el-radio size="large" :value="2">Nữ</el-radio>
                  <el-radio size="large" :value="3">Khác</el-radio>
                </el-radio-group>
              </div>
            </div>
            <el-divider direction="vertical" class="" />
            <div class="w-1/2 ml-2">
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Số điện thoại</span>
                <el-input v-model="userInfo.phone" size="large" placeholder="Số điện thoại" />
              </div>
              <div class="flex flex-col w-full my-5">
                <span class="text-sm font-semibold mb-2">Email</span>
                <el-input v-model="userInfo.email" size="large" placeholder="Email" disabled />
              </div>
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Mật khẩu</span>
                <el-button type="warning" plain>Đổi mật khẩu</el-button>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <el-button type="primary" size="large" class="w-[250px]" @click="saveChanges">Lưu thay đổi</el-button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style>
.el-divider--vertical {
  height: 15em !important;
}
</style>