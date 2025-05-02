<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import { checkMomoPayment } from '~/api/paymentAPI';
import ResultSuccess from '~/components/payment/ResultSuccess.vue';
import type { DTO_RQ_CheckMomoPayment } from '~/types/PaymentType';

const route = useRoute();
const pendingTicketStore = usePendingTicketStore();

const isLoading = ref(true);
const paymentStatus = ref<'success' | 'failed' | null>(null);

onMounted(async () => {
  await pendingTicketStore.loadPendingTicket();
  const paymentMethod = localStorage.getItem('paymentMethod');

  if (paymentMethod === 'momo') {
    const data: DTO_RQ_CheckMomoPayment = {
      orderId: route.query.orderId as string,
      requestId: route.query.requestId as string,
      ticket:
        pendingTicketStore.pendingTicket?.selectedTicket.map((ticket) => ({
          id: ticket.id,
          seat_name: ticket.seat_name,
          price: ticket.price,
        })) || [],
    };

    if (data.orderId && data.requestId) {
      try {
        const res = await checkMomoPayment(data);
        if (res.status === 200) {
          paymentStatus.value = 'success';
          ElMessage.success('Giao dịch MoMo đã hoàn tất.');
        } else {
          paymentStatus.value = 'failed';
          ElMessage.warning('Giao dịch MoMo chưa hoàn tất');
        }
      } catch (err) {
        paymentStatus.value = 'failed';
        ElMessage.error('Lỗi khi truy vấn trạng thái MoMo');
      }
    } else {
      paymentStatus.value = 'failed';
    }
  } else {
    paymentStatus.value = 'failed';
  }

  isLoading.value = false;
});
</script>

<template>
  <section class="px-24 py-10 relative">
    <div v-if="isLoading" class="text-center py-10">Đang kiểm tra thanh toán...</div>

    <template v-else>
      <ResultSuccess v-if="paymentStatus === 'success'" />
      <div v-else class="text-red-500 text-center text-lg font-medium">
        ❌ Không thể xác nhận giao dịch. Vui lòng thử lại hoặc liên hệ hỗ trợ.
      </div>
    </template>
  </section>
</template>
