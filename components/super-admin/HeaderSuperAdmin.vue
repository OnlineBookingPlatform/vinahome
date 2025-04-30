<script setup lang="ts">
import {
    House, SwitchButton, User
} from "@element-plus/icons-vue";
const superAdminStore = useSuperAdminStore()
const router = useRouter();
function logout(): void {
  console.log('Đăng xuất');
  superAdminStore.clearData()
  router.push('/super-admin/login')
}
</script>
<template>
    <section class="h-full flex items-center justify-start px-2">
        <NuxtLink to="/" class="mr-2">
            <el-button type="primary" :icon="House">VinaHome</el-button>
        </NuxtLink>

        <NuxtLink to="/super-admin/account" class="mr-2">
            <el-button type="info" :icon="User">Tài khoản quản trị</el-button>
        </NuxtLink>
        <el-button type="warning" :icon="SwitchButton" @click="logout()">Đăng xuất</el-button>
    </section>

</template>