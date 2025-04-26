<script setup lang="ts">
import { Headset, ArrowDown, CaretBottom, User } from "@element-plus/icons-vue";
import type { LoginType } from "~/types/LoginType";
import {
  useTokenClient,
  type AuthCodeFlowSuccessResponse,
  type AuthCodeFlowErrorResponse,
} from "vue3-google-signin";
import { useUserStore } from "~/stores/userStore";
import { loginWithGoogle } from "~/api/authAPI";
import { loginWithFacebook } from "~/api/authAPI";
import { HFaceBookLogin } from '@healerlab/vue3-facebook-login';
import FacebookLogo from '~/components/icons/FacebookLogo.vue';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const visible = ref(false);



const onFacebookSuccess = async (response: any) => {
  // get your auth token and info
  console.log("Response: ", response);
  
  if (!response?.authResponse?.accessToken) {
    console.error("Error: Facebook access token is missing.");
    return;
  }

  try {
    const responseData = await loginWithFacebook(response.authResponse.accessToken);
    console.log("Full Response from Server: ", responseData?.result);

    if (responseData?.result) {
      const userStore = useUserStore();
      userStore.setUserData(responseData.result);

      if (visible?.value !== undefined) {
        visible.value = false;
      }
    } else {
      console.error("Error: Facebook login response data is undefined or null.");
    }
  } catch (error) {
    console.error("Error logging in with Facebook: ", error);
  }
}

const onFacebookFailure = (error: any) => {
  // logic if auth failed
  console.log("Error: ", error);
}

const handleOnSuccess = async (response: AuthCodeFlowSuccessResponse) => {
  if (!response?.access_token) {
    console.error("Error: Access token is missing.");
    return;
  }

  console.log("Access Token: ", response.access_token);

  try {
    const responseData = await loginWithGoogle(response.access_token);
    console.log("Full Response from Server: ", responseData?.result);
    console.log("Full Response: ", responseData);

    if (responseData?.result) {
      const userStore = useUserStore();
      userStore.setUserData(responseData?.result);
      console.log("User Store Data: ", userStore.userData);

      if (visible?.value !== undefined) {
        visible.value = false;
      }
    } else {
      console.error("Error: `responseData` is undefined or null.");
    }
  } catch (error) {
    console.error("Error logging in with Google: ", error);
  }
};

const userStore = useUserStore();
const avatarUrl = computed(() => {
  return userStore.userData?.url_avatar || "";
});
const handleLogout = async () => {
  await userStore.clearUserData();
  localStorage.clear();
  router.push("/");
};

// watch(avatarUrl, (newValue) => {
//   console.log("Avatar URL:", newValue);
// });


const handleOnError = (errorResponse: AuthCodeFlowErrorResponse) => {
  console.log("Error: ", errorResponse);
};

const { isReady, login } = useTokenClient({
  onSuccess: handleOnSuccess,
  onError: handleOnError,

});


const loginForm: LoginType = reactive({
  phone: '',
});
const error = ref('');
const handleLogin = () => {
  if (!loginForm.phone) {
    error.value = 'Vui lòng nhập số điện thoại.';
    return;
  }
  if (!/^\d{10}$/.test(loginForm.phone)) {
    error.value = 'Số điện thoại không hợp lệ.';
    return;
  }
  error.value = '';
  // Add login logic here
  console.log('Số điện thoại:', loginForm.phone);
};

const isMenuOpen = ref(false);

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
}

const handleSelectMenu = () => {
  isMenuOpen.value = false; 
}

</script>

<template>
  <nav class="h-16 w-full">
    <div class="container mx-auto flex items-center justify-between px-4 h-full">
      <!-- Logo Section -->
      <div class="flex items-center">
        <NuxtLink to="/">
          <img src="/static/logo-4.png" alt="Logo" class="w-40" />
        </NuxtLink>
      </div>

      <!-- Desktop Menu, ẩn khi màn hình < 450px -->
      <ul class="hidden sm:flex space-x-2 md:flex lg:flex xl:flex">
        <li>
          <NuxtLink to="/tra-cuu-ve">
            <el-button text class="button-link">Tra cứu vé</el-button>
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/mo-ban-ve-tren-vinahome">
            <el-button text class="button-link">Mở bán vé trên VinaHome</el-button>
          </NuxtLink>
        </li>
        <li>
          <el-dropdown>
            <el-button text class="button-link">
              Trở thành đối tác
              <el-icon class="el-icon--right">
                <ArrowDown />
              </el-icon>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <span>Hệ thống quản lý nhà xe</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span>Dịch vụ cho thuê xe</span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span>Liên kết khách sạn</span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
        <li>
          <el-button type="warning" :icon="Headset" plain round>Hỗ trợ 24/7</el-button>
        </li>
        <li v-if="userStore && userStore.userData === null">
          <el-button type="primary" :icon="User" @click="visible = true" round>Đăng nhập</el-button>
        </li>
        <li v-else>
          <el-dropdown trigger="click" class="ml-5">
            <span class="el-dropdown-link flex items-center">
              <el-avatar :size="35" :src="avatarUrl" />
              <el-icon class="el-icon--right" style="color: black;">
                <CaretBottom />
              </el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <RouterLink to="/account/personal-info">
                  <el-dropdown-item>Thông tin tài khoản</el-dropdown-item>
                </RouterLink>
                <el-dropdown-item @click="handleLogout">Đăng xuất</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </li>
      </ul>

      <!-- Mobile Toggle Button, chỉ hiển thị dưới 450px -->
      <button class="sm:hidden block focus:outline-none" @click="toggleMenu" aria-label="Toggle mobile menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
      </button>
    </div>

    <el-menu v-if="isMenuOpen" class="sm:hidden absolute w-full left-0 z-10 bg-white shadow" mode="vertical" @select="handleSelectMenu">
      <el-menu-item index="/">
        <NuxtLink to="/">Trang chủ</NuxtLink>
      </el-menu-item>

      <el-menu-item index="/tra-cuu-ve">
        <NuxtLink to="/tra-cuu-ve">Tra cứu vé</NuxtLink>
      </el-menu-item>

      <el-menu-item index="/mo-ban-ve-tren-vinahome">
        <NuxtLink to="/mo-ban-ve-tren-vinahome">Mở bán vé trên VinaHome</NuxtLink>
      </el-menu-item>

      <el-sub-menu index="doi-tac">
        <template #title>Trở thành đối tác</template>
        <el-menu-item index="nha-xe">
          <span>Hệ thống quản lý nhà xe</span>
        </el-menu-item>
        <el-menu-item index="thue-xe">
          <span>Dịch vụ cho thuê xe</span>
        </el-menu-item>
        <el-menu-item index="khach-san">
          <span>Liên kết khách sạn</span>
        </el-menu-item>
      </el-sub-menu>

      <el-menu-item index="support">
        <span>Hỗ trợ 24/7</span>
      </el-menu-item>

      <el-menu-item v-if="userStore && userStore.userData === null" index="login">
        <el-button type="primary" :icon="User" @click="visible = true" round>Đăng nhập</el-button>
      </el-menu-item>

      <el-sub-menu v-else index="user">
        <template #title>
          <span>Xin chào, {{ userStore?.userData?.name || 'Người dùng' }}</span>
        </template>
        <el-menu-item index="/account/personal-info">
          <NuxtLink to="/account/personal-info">Thông tin tài khoản</NuxtLink>
        </el-menu-item>
        <el-menu-item @click="handleLogout">
          <span>Đăng xuất</span>
        </el-menu-item>
      </el-sub-menu>
    </el-menu>
  </nav>


  <el-dialog v-model="visible" :show-close="false" width="350" destroy-on-close center class="modal-login">
    <template #header>
      <h3 class="font-bold text-[17px]">Đăng nhập</h3>
    </template>
    <div class="p-4">
      <h2 class="font-bold text-[15px]">Số điện thoại</h2>
      <el-input size="large" v-model="loginForm.phone" placeholder="Nhập số điện thoại" maxlength="10" show-word-limit
        class="mt-2" />
      <p v-if="error" class="text-red-500 text-sm mt-1">{{ error }}</p>
      <el-button type="warning" round block size="large" class="mt-4 w-full" @click="handleLogin">
        Tiếp tục
      </el-button>

      <el-divider content-position="center">Hoặc</el-divider>

      <div class="flex items-center">
        <el-button type="primary" class="flex-1" round size="large" plain :disabled="!isReady" @click="() => login()">
          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48"
            class="mr-2">
            <path fill="#fbc02d"
              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z">
            </path>
            <path fill="#e53935"
              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z">
            </path>
            <path fill="#4caf50"
              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z">
            </path>
            <path fill="#1565c0"
              d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z">
            </path>
          </svg>
          Google
        </el-button>

        <el-button type="primary" class="flex-1" round size="large" plain>
          <HFaceBookLogin 
            v-slot="fbLogin"
            class="flex justify-center items-center"
            app-id="1346584449902628" 
            @onSuccess="onFacebookSuccess" 
            @onFailure="onFacebookFailure"
            scope="email"
            fields="id,email"
          >
            <div @click="fbLogin.initFBLogin()" class="flex justify-center items-center w-full cursor-pointer">
              <FacebookLogo />
              Facebook
            </div>
          </HFaceBookLogin>
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<style scoped>
.button-link {
  color: black;

}

.button-link:hover {
  color: black;
}

.el-button:focus-visible,
.el-button.is-text:not(.is-disabled):focus-visible {
  outline: none;
}

.modal-login {
  border-radius: 100px !important;
}
</style>
