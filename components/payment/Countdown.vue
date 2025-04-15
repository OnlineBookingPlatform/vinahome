<script setup lang="ts">
defineProps<{
  minutes: string
  seconds: string
  background: string
}>()
</script>

<template>
  <div class="py-4 w-full bg-white border *:m-auto rounded-xl space-y-4">
    <p class="text-lg text-center">Thời gian thanh toán còn lại</p>
    <div class="flex gap-2 w-fit">
      <div class="text-center">
        <div :class="['px-4 py-1.5 text-white rounded-lg', background]">
          <span>{{ minutes }}</span>
        </div>
        <span class="text-sm text-muted">phút</span>
      </div>
      <span class="!bg-transparent text-primary -mt-0.5 text-3xl font-bold">:</span>
      <div class="text-center">
        <div :class="['px-4 py-1.5 text-white rounded-lg', background]">
          <span>{{ seconds }}</span>
        </div>
        <span class="text-sm text-muted">giây</span>
      </div>
    </div>
  </div>
</template>