<template>
  <el-menu default-active="2" class="el-menu-vertical-demo">
    <NuxtLink to="/super-admin/dashboard">
      <el-menu-item index="2">
        <span>Tổng quan</span>
      </el-menu-item>
    </NuxtLink>
    <NuxtLink to="/super-admin/route-popular">
      <el-menu-item index="3">
        <span>Tuyến đường phổ biến</span>
      </el-menu-item>
    </NuxtLink>

    <el-sub-menu index="1">
      <template #title>
        <span>Danh sách đối tác</span>
      </template>
      <NuxtLink to="/super-admin/bus-company">
        <el-menu-item index="1-1">Xe khách</el-menu-item>
      </NuxtLink>

      <el-menu-item index="1-2">Khách sạn</el-menu-item>
      <el-menu-item index="1-3">Cho thuê xe</el-menu-item>


    </el-sub-menu>

  </el-menu>
</template>
<script setup lang="ts">
</script>