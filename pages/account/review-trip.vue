<script setup lang="ts">
definePageMeta({
  layout: 'default'
});

import ContentAccountComments from "~/components/customer/ContentAccountComments.vue"
</script>

<template>
  <NuxtLayout name="layout-v1">
    <ContentAccountComments/>
  </NuxtLayout>
</template>

<style scoped></style>