<script setup lang="ts">
import MenuAccountCustomer from "~/components/customer/MenuAccountCustomer.vue";
</script>

<template>
  <div>
    <el-container class="bg-gray-100 p-4 sm:p-10">
      <div class="w-full max-w-7xl mx-auto flex flex-col sm:flex-row gap-4">
        
        <!-- Menu nằm trên khi mobile -->
        <div class="w-full sm:w-[250px]">
          <MenuAccountCustomer />
        </div>

        <!-- Nội dung nằm dưới khi mobile -->
        <div class="flex-1 pl-0 sm:pl-4">
          <el-main>
            <slot />
          </el-main>
        </div>

      </div>
    </el-container>
  </div>
</template>


<style scoped></style>