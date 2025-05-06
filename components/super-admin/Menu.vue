<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <el-menu
    class="el-menu-vertical-demo"
    :default-active="route.path"
    router
  >
    <el-menu-item index="/super-admin/dashboard">
      <span>Tổng quan</span>
    </el-menu-item>

    <el-menu-item index="/super-admin/account">
      <span>Tài khoản quản trị</span>
    </el-menu-item>

    <el-menu-item index="/super-admin/register-sale-ticket">
      <span>Đăng ký mở bán vé</span>
    </el-menu-item>

    <el-menu-item index="/super-admin/receive-news">
      <span>Đăng ký nhận tin</span>
    </el-menu-item>

    <el-menu-item index="/super-admin/route-popular">
      <span>Tuyến đường phổ biến</span>
    </el-menu-item>

    <el-menu-item index="/super-admin/bus-ticket-booking-history">
      <span>Giao dịch vé xe</span>
    </el-menu-item>

    <el-sub-menu index="8">
      <template #title>
        <span>Danh sách đối tác</span>
      </template>

      <el-menu-item index="/super-admin/bus-company">Xe khách</el-menu-item>
      <el-menu-item index="8-2">Khách sạn</el-menu-item>
      <el-menu-item index="8-3">Cho thuê xe</el-menu-item>
    </el-sub-menu>
  </el-menu>
</template>
