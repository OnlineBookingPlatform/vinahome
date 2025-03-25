<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100">
      <el-card class="w-full max-w-md">
        <h2 class="text-2xl font-bold mb-6 text-center">Admin Login</h2>
        <el-form ref="loginFormRef" :model="loginForm" :rules="rules" label-width="90px">
          <el-form-item label="Tài khoản" prop="username">
            <el-input v-model="loginForm.username" type="text" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="Mật khẩu" prop="password">
            <el-input v-model="loginForm.password" type="password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">Đăng nhập</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { ElMessage } from 'element-plus';
  
  const loginForm = ref({
    username: '',
    password: ''
  });
  
  const loginFormRef = ref(null);
  
  const rules = {
    username: [
      { required: true, message: 'Vui lòng nhập tài khoản', trigger: 'blur' }
    ],
    password: [
      { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
      { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }
    ]
  };
  
  const login = () => {
    console.log(`Username: ${loginForm.value.username}, Password: ${loginForm.value.password}`);
    ElMessage.success('Login successful');
  };
  
  const submitForm = () => {
    if (!loginFormRef.value) return;
    loginFormRef.value.validate((valid) => {
      if (valid) {
        login();
      } else {
        console.log('error submit!!');
      }
    });
  };
  </script>
  
  <style scoped>
  /* Add any additional styles if needed */
  </style>
  