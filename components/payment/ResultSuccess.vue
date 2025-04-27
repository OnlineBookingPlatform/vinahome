<script setup lang="ts">

const router = useRouter();
const userStore = useUserStore();
const pendingTicketStore = usePendingTicketStore();
const user = userStore.userData;
const remainingTime = ref(10);
let timer: ReturnType<typeof setInterval> | undefined;

const goToHome = () => {
  pendingTicketStore.clearPendingTicket();
  localStorage.removeItem('paymentStartTime');
  router.push('/');
};
onMounted(() => {
  timer = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--;
    } else {
      clearInterval(timer);  // Stop the timer when time is up
      goToHome();  // Redirect to the home page
    }
  }, 1000); // 1000ms = 1 second
});

// Clean up the interval when the component is unmounted
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>
<template>
  <div
    class="bg-white py-12 rounded-xl border w-full payment-method flex flex-col justify-center items-center space-y-6 px-6">
    <Icon name="vinahome:payment-complete" size="108" />
    <h5>Thanh toán thành công</h5>
    <p class="text-muted max-w-md text-center">
      Thông tin chuyến xe đã được gửi đến
      <span class="font-bold">{{ user?.email || 'N/A' }}</span>
      Hãy kiểm tra nhé.
    </p>
    <button class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75"
      @click="goToHome">
      Trang chủ
    </button>
  </div>
  <div class="flex items-center justify-center text-sm text-muted mt-4">
    <span>Hệ thống sẽ quay về trang chủ sau <span>{{ remainingTime }}</span> giây ... </span>
  </div>
</template>