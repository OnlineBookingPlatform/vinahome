<template>
    <div class="login-container">
        <div class="form">
            <div class="content-section">
                <img src="/static/logo-4.png" alt="Logo" class="app-logo" />

                <el-form :model="form" class="login-form" :rules="rules">
                    <div class="login-input">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="Nhập tên đăng nhập..." class="username-input"
                                size="large" />
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input v-model="form.password" type="password" class="password-input"
                                placeholder="Nhập mật khẩu..." show-password size="large" />
                        </el-form-item>
                    </div>

                    <div class="extra-options">
                        <el-checkbox v-model="form.rememberMe">Ghi nhớ đăng nhập</el-checkbox>
                        <a href="/forgot-password" class="forgot-password">Quên mật khẩu?</a>
                    </div>

                    <el-button type="primary" class="submit-btn" @click="submitForm">Log In</el-button>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

const form = reactive({
    username: '',
    password: '',
    rememberMe: false,
});

const rules = {
    username: [{ required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' }],
    password: [{ required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' }, { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' }],
};

const submitForm = () => {
    console.log('Đăng nhập với:', form);
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f4f4f4;
}

.form {
    display: flex;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 40%;
    height: 50%;
}

.app-logo {
    width: 400px;
    margin: 0 auto 10px;
}

.content-section {
    padding: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 20px;
}

.submit-btn {
    width: 100%;
    padding: 10px 0;
}

.username-input {
    font-size: 1rem;
}

.password-input {
    font-size: 1rem;
}

.login-input {
    width: 100%;
    align-items: flex-start;
}

.el-form-item__error {
    top: 85%;
}

.social-login {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-top: 20px;
    align-items: center;
}

.extra-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    flex-wrap: wrap;
    gap: 5px;
}

.extra-options .el-checkbox {
    flex-shrink: 0;
}

.forgot-password {
    color: #409eff;
    text-decoration: none;
    font-size: 14px;
    text-align: right;
    flex-grow: 1;
}

.forgot-password:hover {
    text-decoration: underline;
}

@media (max-width: 400px) { 
    .extra-options {
        flex-direction: column;
        align-items: flex-start;
    }

    .forgot-password {    
        text-align: left;
        width: 100%;
        margin-top: 5px;
    }
}

</style>