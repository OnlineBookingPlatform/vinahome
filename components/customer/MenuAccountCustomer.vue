<template>
  <!--    <div class="w-full p-4 bg-white rounded-lg shadow">-->
  <!--        <ul>-->
  <!--            <li v-for="item in menuItems" :key="item.path" class="mb-4 flex items-center">-->
  <!--                <el-icon :class="isActive(item.path) ? 'text-blue-600' : 'text-gray-600'" class="mr-3">-->
  <!--                    <component :is="item.icon" />-->
  <!--                </el-icon>-->
  <!--                <router-link :to="item.path"-->
  <!--                    :class="isActive(item.path) ? 'text-blue-600 font-semibold' : 'text-gray-800'"-->
  <!--                    class="text-lg font-medium hover:text-yellow-500">-->
  <!--                    {{ item.label }}-->
  <!--                </router-link>-->
  <!--            </li>-->
  <!--        </ul>-->
  <!--    </div>-->
  <div>
    <el-menu :default-active="route.path" class="el-menu-vertical-demo rounded-lg hidden sm:block" v-if="!isMobile">
      <NuxtLink v-for="item in menuItems" :key="item.index" :to="item.to" class="no-underline">
        <el-menu-item :index="item.index">
          <span v-html="item.icon" class="mr-2"></span>
          <span class="text-[1rem] font-bold">{{ item.label }}</span>
        </el-menu-item>
      </NuxtLink>
      <el-menu-item index="logout" @click="handleLogout">
        <span class="mr-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
            
            <path
              d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
          </svg>
        </span>
        <span class="text-[1rem] font-bold">Đăng xuất</span>
      </el-menu-item>
    </el-menu>

    <!-- Menu thu gọn cho màn hình nhỏ -->
    <div class="block sm:hidden">
      <el-dropdown trigger="click">
        <el-button type="primary">
          Menu <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="item in menuItems" :key="item.index" @click="navigateTo(item.to)">
              <span v-html="item.icon" class="mr-2"></span>
              {{ item.label }}
            </el-dropdown-item>
            <el-dropdown-item divided>
              <span class="mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20"
                  fill="currentColor">
                  <path
                    d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z" />
                </svg>
              </span>
              Đăng xuất
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { User, Ticket, Discount, ChatDotRound, Bell } from '@element-plus/icons-vue';
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();
interface MenuItem {
  index: string;
  icon: string;
  label: string;
  to: string;
}

const menuItems: MenuItem[] = [
  {
    index: "/account/personal-info",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="20" height="20" fill="currentColor">
      <path d="M406.5 399.6C387.4 352.9 341.5 320 288 320l-64 0c-53.5 0-99.4 32.9-118.5 79.6C69.9 362.2 48 311.7 48 256C48 141.1 141.1 48 256 48s208 93.1 208 208c0 55.7-21.9 106.2-57.5 143.6zm-40.1 32.7C334.4 452.4 296.6 464 256 464s-78.4-11.6-110.5-31.7c7.3-36.7 39.7-64.3 78.5-64.3l64 0c38.8 0 71.2 27.6 78.5 64.3zM256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-272a40 40 0 1 1 0-80 40 40 0 1 1 0 80zm-88-40a88 88 0 1 0 176 0 88 88 0 1 0 -176 0z"/>
    </svg>`,
    label: "Thông tin cá nhân",
    to: "/account/personal-info"
  },
  {
    index: "/account/ticket-history",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="20" height="20" fill="currentColor"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z"/></svg>`,
    label: "Vé của tôi",
    to: "/account/ticket-history"
  },
  {
    index: "/account/discount-code",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" width="20" height="20" fill="currentColor"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M14 2.2C22.5-1.7 32.5-.3 39.6 5.8L80 40.4 120.4 5.8c9-7.7 22.3-7.7 31.2 0L192 40.4 232.4 5.8c9-7.7 22.3-7.7 31.2 0L304 40.4 344.4 5.8c7.1-6.1 17.1-7.5 25.6-3.6s14 12.4 14 21.8l0 464c0 9.4-5.5 17.9-14 21.8s-18.5 2.5-25.6-3.6L304 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L192 471.6l-40.4 34.6c-9 7.7-22.3 7.7-31.2 0L80 471.6 39.6 506.2c-7.1 6.1-17.1 7.5-25.6 3.6S0 497.4 0 488L0 24C0 14.6 5.5 6.1 14 2.2zM96 144c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 144zM80 352c0 8.8 7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 336c-8.8 0-16 7.2-16 16zM96 240c-8.8 0-16 7.2-16 16s7.2 16 16 16l192 0c8.8 0 16-7.2 16-16s-7.2-16-16-16L96 240z"/></svg>`,
    label: "Mã giảm giá",
    to: "/account/discount-code"
  },
  {
    index: "/account/review-trip",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20" fill="currentColor"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M208 352c114.9 0 208-78.8 208-176S322.9 0 208 0S0 78.8 0 176c0 38.6 14.7 74.3 39.6 103.4c-3.5 9.4-8.7 17.7-14.2 24.7c-4.8 6.2-9.7 11-13.3 14.3c-1.8 1.6-3.3 2.9-4.3 3.7c-.5 .4-.9 .7-1.1 .8l-.2 .2s0 0 0 0s0 0 0 0C1 327.2-1.4 334.4 .8 340.9S9.1 352 16 352c21.8 0 43.8-5.6 62.1-12.5c9.2-3.5 17.8-7.4 25.2-11.4C134.1 343.3 169.8 352 208 352zM448 176c0 112.3-99.1 196.9-216.5 207C255.8 457.4 336.4 512 432 512c38.2 0 73.9-8.7 104.7-23.9c7.5 4 16 7.9 25.2 11.4c18.3 6.9 40.3 12.5 62.1 12.5c6.9 0 13.1-4.5 15.2-11.1c2.1-6.6-.2-13.8-5.8-17.9c0 0 0 0 0 0s0 0 0 0l-.2-.2c-.2-.2-.6-.4-1.1-.8c-1-.8-2.5-2-4.3-3.7c-3.6-3.3-8.5-8.1-13.3-14.3c-5.5-7-10.7-15.4-14.2-24.7c24.9-29 39.6-64.7 39.6-103.4c0-92.8-84.9-168.9-192.6-175.5c.4 5.1 .6 10.3 .6 15.5z"/></svg>`,
    label: "Nhận xét chuyến đi",
    to: "/account/review-trip"
  }
];

// const menuItems = ref([
//     { label: 'Thông tin cá nhân', path: '/account/thong-tin', icon: User },
//     { label: 'Thông tin vé của tôi', path: '/account/ve-cua-toi', icon: Ticket },
//     { label: 'Ưu đãi', path: '/account/uu-dai', icon: Discount },
//     { label: 'Nhận xét', path: '/account/nhan-xet', icon: ChatDotRound },
//     { label: 'Thông báo của tôi', path: '/', icon: Bell },
// ]);
// Kiểm tra xem đường dẫn hiện tại có khớp với menu không
const isActive = (path: string) => route.path === path;

const isMobile = ref(false)

const handleLogout = async () => {
  await userStore.clearUserData();
  router.push("/");
};


</script>

<style scoped></style>