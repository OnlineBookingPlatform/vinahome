<script setup lang="ts">
const paymentMethod = defineModel();
</script>

<template>
  <div class="mt-4 p-6">
    <el-radio-group v-model="paymentMethod" class="space-y-6">
      <el-radio value="qr" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <Icon name="fa6-solid:qrcode" class="size-4 mr-1.5" />
            <span class="font-bold">QR chuyển khoản/ Ví điện tử</span>
          </p>
          <p class="text-grey-600">
            Không cần nhập thông tin. Xác nhận thanh toán tức thì, nhanh chóng và ít sai sót.
          </p>
        </template>
      </el-radio>
      <el-radio value="international" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <Icon name="fa6-solid:credit-card" class="size-4 mr-1.5" />
            <span class="font-bold">Thẻ thanh toán quốc tế</span>
          </p>
          <p class="text-grey-600">
            Thẻ Visa, MasterCard, JCB.
          </p>
        </template>
      </el-radio>
      <el-radio value="national" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <Icon name="fa6-solid:building-columns" class="size-4 mr-1.5" />
            <span class="font-bold">Thẻ ATM nội địa / Internet Banking</span>
          </p>
          <p class="text-grey-600">
            Thẻ Napas, MBBank, TPBank, BIDV, và 46 ngân hàng khác trong nước.
          </p>
        </template>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<style scoped>
.el-radio {
  padding: 14px;
  align-items: start;
  height: auto;
  border-radius: 12px;
  margin-right: 0;
}

.el-radio:has(input:not(:checked)) .payment-label {
  color: black
}
</style>