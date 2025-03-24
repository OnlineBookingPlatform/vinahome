<script setup lang="ts">
import type { UserType } from "~/types/UserType";
import { ElMessage } from 'element-plus'
import { getAccountInfo, updateAccountInfo, updateAvatarOnServer, uploadAvatarToCloudinary } from "~/api/accountAPI";
import { useUserStore } from "~/stores/userStore";
import { z } from "zod";

definePageMeta({
  layout: 'default'
});

const formSchema = z.object({
  name: z.string(),
  date_birth: z.string().date(),
  gender: z.enum(["male", "female"]),
  phone: z.string(),
  avatar: z.string().url(),
})

const userForm = ref<Partial<UserType>>({});
const isValid = ref(true);

const { userData } = useUserStore();
const { data: userInfo, status, error, refresh } = await useAsyncData('userInfo', () => getAccountInfo(userData?.id));

watch(() => userData, () => refresh());
watch(userForm.value, () => isValid.value = formSchema.safeParse(userForm.value).success)

const uploadAvatar = async (file: File) => {
  const imageUrl = await uploadAvatarToCloudinary(file);

  if (imageUrl) {
    console.log("Avatar uploaded:", imageUrl);
    if (userInfo.value?.result.id) {
      await updateAvatarOnServer(userInfo.value.result.id, imageUrl).then(() => refresh());
    }
    userForm.value.url_avatar = imageUrl;
    ElMessage.success("Cập nhật ảnh đại diện thành công!");
  } else {
    ElMessage.error("Tải ảnh thất bại!");
  }
};

const saveChanges = async () => {
  console.log("Dữ liệu cập nhật:", userForm.value);

  if (!userInfo.value?.result.id) return;

  const updatedData: Partial<UserType> = {
    ...userForm.value
  };

  await updateAccountInfo(userInfo.value.result.id, updatedData).then(() => {
    ElMessage.success("Cập nhật thông tin thành công!");
  }).catch((error) => {
    console.error("Error updating account:", error);
    ElMessage.error("Lỗi khi cập nhật thông tin");
  });
};
</script>

<template>
  <NuxtLayout name="layout-v1">
    <h2 class="text-lg">Thông tin cá nhân</h2>
    <div class="bg-white rounded-lg w-full py-2" v-loading="status == 'pending'">
      <div class="mx-5 my-5 flex items-center">
        <div class="flex flex-col w-full">
          <span class="text-sm font-semibold mb-2">Ảnh đại diện</span>
          <div class="flex items-center mb-6">
            <el-avatar :size="70" :src="userData?.url_avatar" />
            <el-upload class="upload-demo mx-3" :auto-upload="true" :show-file-list="false"
              :before-upload="uploadAvatar" accept="image/*">
              <el-button type="info">
                Cập nhật ảnh mới
              </el-button>
            </el-upload>
          </div>
          <div class="flex w-full">
            <div class="w-1/2 mr-2">
              <div class="flex flex-col w-full ">
                <span class="text-sm font-semibold mb-2">Họ và tên</span>
                <el-input v-model="userForm.name" size="large" placeholder="Họ và tên" />
              </div>
              <div class="flex flex-col w-full my-5">
                <span class="text-sm font-semibold mb-2">Ngày sinh</span>
                <el-date-picker v-model="userForm.date_birth" type="date" placeholder="Ngày sinh" class="w-full"
                  size="large" />
              </div>
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Giới tính</span>
                <el-radio-group v-model="userForm.gender">
                  <el-radio size="large" value="male">Nam</el-radio>
                  <el-radio size="large" value="female">Nữ</el-radio>
                </el-radio-group>
              </div>
            </div>
            <el-divider direction="vertical" class="" />
            <div class="w-1/2 ml-2">
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Số điện thoại</span>
                <el-input v-model="userForm.phone" size="large" placeholder="Số điện thoại" />
              </div>
              <div class="flex flex-col w-full my-5">
                <span class="text-sm font-semibold mb-2">Email</span>
                <el-input v-model="userForm.email" size="large" placeholder="Email" disabled />
              </div>
              <div class="flex flex-col w-full">
                <span class="text-sm font-semibold mb-2">Mật khẩu</span>
                <el-button type="warning" plain>Đổi mật khẩu</el-button>
              </div>
            </div>
          </div>
          <div class="mt-5">
            <el-button type="primary" size="large" class="w-[250px]" @click="saveChanges" :disabled="isValid">
              Lưu thay đổi
            </el-button>
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