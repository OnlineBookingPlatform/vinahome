<script setup lang="ts">
import type { BookingData } from "~/types/PendingType";

defineProps<{ pendingData: BookingData; }>();
const methodModel = defineModel()

</script>

<template>
  <div class="bg-white py-6 rounded-xl border w-full payment-method">
    <div class="border-b px-6 py-4">
      <h5>Phương thức thanh toán</h5>
    </div>
    <PaymentMethodRadio v-model="methodModel" :pending-data="pendingData" />
  </div>
</template>