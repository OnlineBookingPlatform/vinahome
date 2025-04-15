<script setup lang="ts">
import type { BookingData } from "~/types/PendingType";

defineProps<{ pendingData: BookingData; }>();
</script>

<template>
  <div class="bg-white py-6 rounded-xl border w-full payment-method">
    <div class="border-b px-6 py-4">
      <h5>Thông tin chuyến đi của bạn</h5>
    </div>
    <PaymentTripInfo :pending-data="pendingData" />
  </div>
</template>