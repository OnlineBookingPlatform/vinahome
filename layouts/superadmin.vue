<script lang="ts">
</script>
<template>
    <div>
    <el-container>
      <el-aside width="200px">
        <AdminMenuAdmin/>
      </el-aside>
      <el-container>
        <el-header>Header</el-header>
        <el-main>
            <slot />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>