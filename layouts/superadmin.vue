<script lang="ts">
import { SuperAdminHeaderSuperAdmin } from '#components';



</script>
<template>
    <div>
    <el-container>
      <el-aside width="200px">
        <SuperAdminMenu/>
      </el-aside>
      <el-container>
        <el-header class="bg-[#0072bc]">
          <SuperAdminHeaderSuperAdmin/>
        </el-header>
        <el-main>
            <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>