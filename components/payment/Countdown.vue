<script setup lang="ts">
let timer: string | number | NodeJS.Timeout | undefined;
const timeSincePaymentCreated = ref(1200)
const currentTimeleft = ref(0)

const formattedTime = computed(() => {
  const minutes = Math.floor(currentTimeleft.value / 60).toString().padStart(2, '0')
  const seconds = (currentTimeleft.value % 60).toString().padStart(2, '0')

  return { minutes, seconds }
})

const background = computed(() => currentTimeleft.value < (10 * 60) ? 'bg-warning' : 'bg-primary');

onMounted(() => {
  if (timer) clearInterval(timer)

  currentTimeleft.value = timeSincePaymentCreated.value
  timer = setInterval(() => {
    if (currentTimeleft.value > 0) currentTimeleft.value--
    else {
      clearInterval(timer)
    }
  }, 1000)
})

onUnmounted(() => {
  if (timer) clearInterval(timer)
})

</script>

<template>
  <div class="py-4 w-full bg-white border *:m-auto rounded-xl space-y-4">
    <p class="text-lg text-center">Thời gian thanh toán còn lại</p>
    <div class="flex gap-2 w-fit">
      <div class="text-center">
        <div :class="['px-4 py-1.5 text-white rounded-lg', background]">
          <span>{{ formattedTime.minutes }}</span>
        </div>
        <span class="text-sm text-muted">phút</span>
      </div>
      <span class="!bg-transparent text-primary -mt-0.5 text-3xl font-bold">:</span>
      <div class="text-center">
        <div :class="['px-4 py-1.5 text-white rounded-lg', background]">
          <span>{{ formattedTime.seconds }}</span>
        </div>
        <span class="text-sm text-muted">giây</span>
      </div>
    </div>
  </div>
</template>