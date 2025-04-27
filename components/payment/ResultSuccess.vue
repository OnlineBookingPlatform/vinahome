<script setup lang="ts">
import { lo } from 'element-plus/es/locales.mjs';

const router = useRouter();
const userStore = useUserStore();
const pendingTicketStore = usePendingTicketStore();
const user = userStore.userData;
const goToHome = () => {
  pendingTicketStore.clearPendingTicket();
  localStorage.removeItem('paymentStartTime');
  router.push('/');
};
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
</template>