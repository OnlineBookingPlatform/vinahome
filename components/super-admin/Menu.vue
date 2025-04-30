<template>
  <el-menu default-active="2" class="el-menu-vertical-demo">
    <NuxtLink to="/super-admin/dashboard">
      <el-menu-item index="1">
        <span>Tổng quan</span>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/super-admin/account">
      <el-menu-item index="2">
        <span>Tài khoản quản trị</span>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/super-admin/register-sale-ticket">
      <el-menu-item index="3">
        <span>Đăng ký mở bán vé</span>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/super-admin/receive-news">
      <el-menu-item index="4">
        <span>Đăng ký nhận tin</span>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/super-admin/route-popular">
      <el-menu-item index="5">
        <span>Tuyến đường phổ biến</span>
      </el-menu-item>
    </NuxtLink>

    <el-sub-menu index="6">
      <template #title>
        <span>Danh sách đối tác</span>
      </template>
      <NuxtLink to="/super-admin/bus-company">
        <el-menu-item index="4-1">Xe khách</el-menu-item>
      </NuxtLink>

      <el-menu-item index="4-2">Khách sạn</el-menu-item>
      <el-menu-item index="4-3">Cho thuê xe</el-menu-item>


    </el-sub-menu>

  </el-menu>
</template>
<script setup lang="ts">
</script>