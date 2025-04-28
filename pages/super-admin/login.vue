<script setup lang="ts">
import { ref } from 'vue';
import { ElMessage, type FormInstance } from 'element-plus';
import type { DTO_RQ_SuperAdminLogin } from '~/types/AccountType';
import { loginSuperAdminAPI } from '~/api/authAPI';
import { fa } from 'element-plus/es/locales.mjs';
definePageMeta({
  layout: false,
});

const isLoading = ref(false);
const ruleFormRef = ref<FormInstance>();

const ruleForm = reactive<DTO_RQ_SuperAdminLogin>({
  username: null,
  password: null,
});

const rules = {
  username: [
    { required: true, message: 'Vui lòng nhập tài khoản', trigger: 'blur' }
  ],
  password: [
    { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
    { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
  ]
};


const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!', ruleForm)
      isLoading.value = true;
      try {
        const response = await loginSuperAdminAPI(ruleForm)
        console.log('Login response:', response)
      } catch (error) {
        ElMessage.error('Lỗi hệ thông, vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    } else {
      console.log('error submit!', fields)
    }
  })
};

</script>
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <el-card class="w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>
      <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" >
        <el-form-item label="Tài khoản" prop="username" label-position="top">
          <el-input v-model="ruleForm.username" type="text" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="Mật khẩu" prop="password" class="mt-5" label-position="top">
          <el-input v-model="ruleForm.password" type="password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item class="mt-10">
          <div class="w-full flex justify-center items-center gap-4">
            <el-button type="primary" round @click="submitForm(ruleFormRef)" class="w-[200px]" :loading="isLoading">
              Đăng nhập
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>



<style scoped>
/* Add any additional styles if needed */
</style>