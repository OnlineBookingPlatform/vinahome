<template>
    <div class="login-container">
        <div class="form">
            <div class="image-section">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfSVkN04PJBh_ud6G2Oeg4oZaVXHdrLXDrFA&s"
                    alt="Bus Ticket Booking" />
            </div>
            <div class="content-section">
                <img src="/static/logo-4.png" alt="Logo" class="app-logo" />
                <p class="tagline">Đặt vé dễ dàng - Hành trình thuận tiện!</p>
                <el-form :model="form"  class="login-form" :rules="rules">
                    <div class="login-input">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="Nhập tên đăng nhập" class="username-input" size="large" />
                        </el-form-item>

                        <el-form-item prop="password">
                            <el-input v-model="form.password" type="password" class="password-input "  prop="password" placeholder="Nhập mật khẩu" show-password size="large" />
                        </el-form-item>
                    </div>

                    <el-button type="primary" class="submit-btn" @click="submitForm">Đăng nhập</el-button>
                    <p class="login-link">Bạn chưa có tài khoản? <a href="/register" class="link">Đăng ký</a></p>

                    <div class="divider">Đăng nhập bằng cách khác</div>
                    <div class="social-login">
                        <img src="/static/google.png" alt="Google" class="google-icon social-icon">
                        <img src="/static/facebook.png" alt="Facebook" class="facebook-icon social-icon">
                    </div>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';

const form = reactive({
    username: '',
    password: '',
});

const rules = {
    username: [
        { required: true, message: 'Vui lòng nhập tên đăng nhập', trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Vui lòng nhập mật khẩu', trigger: 'blur' },
        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự', trigger: 'blur' },
    ],
};

const loginForm = ref();

const submitForm = () => {
    loginForm.value.validate((valid: boolean) => {
        if (valid) {
            console.log('Login info:', form);
        } else {
            console.log('Validation failed');
        }
    });
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
    width: 90%;
    height: 90%;
}

.app-logo {
    width: 400px;
    margin: 0 auto 10px;
}

.content-section {
    padding: 30px;
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: 20px;
    background-color: hsl(184, 77%, 91%);
}


.image-section {
    width: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.image-section img {
    width: 100%;
    height: auto;
}

.submit-btn {
    width: 100%;
    height: 12%;
}

.login-link {
    margin-top: 10px;
    font-size: 0.9rem;
    text-align: left;
}

.link {
    color: #007bff;
    text-decoration: none;
}

.link:hover {
    text-decoration: underline;
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

.social-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    cursor: pointer;
    background-color: white;
    padding: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.divider {
    margin-top: 10%;
    display: flex;
    align-items: center;
    gap: 10px;
    color: #888;
    font-size: 14px;
}

.divider::before,
.divider::after {
    content: "";
    flex-grow: 1;
    height: 1px;
    background: #ddd;
}

.tagline {
    font-size: 1.1rem; 
    font-weight: bold; 
    text-align: center; 
    margin-top: 10px;
}

</style>