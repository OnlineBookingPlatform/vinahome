<script setup lang="ts">

const userStore = useUserStore();

onMounted(() => {
  userStore.loadUserData();
});

</script>

<template>
  <el-container class="layout-page">
    <el-header class="sticky top-0 z-50 w-full">
      <Header />
    </el-header>
    <el-main>
      <slot />
    </el-main>
    
      <Footer />
   
  </el-container>
</template>

<style>
.layout-page {
  position: relative;
  width: 100%;

  background: rgba(16, 138, 177, 0.1); /* Nền xanh nước biển trong suốt */
  overflow: hidden;
}

.layout-page::before {
  content: "";

  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: linear-gradient(
      rgba(255, 255, 255, 0.2) 10%,
      rgba(16, 138, 177, 0.5) 90%
  );
  opacity: 0.6;
}



</style>