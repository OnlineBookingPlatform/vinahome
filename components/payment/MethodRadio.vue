<script setup lang="ts">
import QRCode from "qrcode";
import type { BookingData } from "~/types/PendingType";
const props = defineProps<{
  pendingData: BookingData;
}>();
const pendingData = toRef(props, "pendingData");
const paymentMethod = defineModel();

const bankCode = "MB";
const bankName = "MB Bank";
const accountNumber = "0877717575";

console.log("pendingData", pendingData.value);

const amount = computed(() => {
  if (pendingData.value.selectedTicket.length > 0) {
    return pendingData.value.selectedTicket.reduce(
      (total, ticket) => total + ticket.price,
      0
    );
  }
  return 0;
});

console.log("amount", amount.value);
const content = computed(() => {
  const ticketIds = pendingData.value.selectedTicket
    .map((ticket) => ticket.id)
    .join(", ");
  return `Thanh toán vé ${ticketIds}`;
});

const vietQRUrl = computed(() => {
  return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact.png?amount=${amount.value}&addInfo=${encodeURIComponent(content.value)}`;
});
</script>

<template>
  <div class="mt-4 p-6">
    <!-- {{ pendingData }} -->
    <el-radio-group v-model="paymentMethod" class="space-y-6">
      <!-- <el-radio value="qr" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center ">
            <Icon name="fa6-solid:qrcode" class="size-4 mr-1.5" />
            <span class="font-bold">QR chuyển khoản/ Ví điện tử</span>
          </p>
          <p class="text-grey-600">
            Không cần nhập thông tin. Xác nhận thanh toán tức thì, nhanh chóng
            và ít sai sót
          </p>
          <div
            class="bg-blue-100 flex justify-between items-center p-4 mt-2 rounded-lg w-full"
          >
            <div class="flex flex-col gap-1">
              <div class="flex gap-1">
                <span class="text-gray-500">Ngân hàng:</span>
                <span class="text-black">{{ bankName }}</span>
              </div>
              <div class="flex gap-1">
                <span class="text-gray-500">Số tài khoản:</span>
                <span class="text-black">{{ accountNumber }}</span>
              </div>
              <div class="flex gap-1">
                <span class="text-gray-500">Tổng tiền:</span>
                <span class="text-black">
                  {{
                    new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(amount)
                  }}
                </span>
              </div>
              <div class="flex gap-1">
                <span class="text-gray-500">Nội dung:</span>
                <span class="text-black">{{ content }}</span>
              </div>
            </div>
            <div
              class="bg-white p-3 rounded border border-gray-200 flex justify-center"
            >
              <img
                :src="vietQRUrl"
                alt="QR Code VietQR"
                width="160"
                class="mb-2"
              />
            </div>
          </div>
        </template>
</el-radio> -->
      <el-radio value="vnpay" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <Icon name="fa6-solid:credit-card" class="size-4 mr-1.5" />
            <span class="font-bold">Thanh toán VNPAY - QR</span>
          </p>
          <p class="text-grey-600">Thiết bị cần cài đặt Ứng dụng ngân hàng (Mobile Banking) hoặc Ví VNPAY</p>
        </template>
      </el-radio>
      <el-radio value="momo" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <img src="/icon/momo.png" alt="ZaloPay" width="20" class="mr-1.5" />
            <span class="font-bold">Ví MoMo</span>
          </p>
          <p class="text-grey-600">Điện thoại của bạn phải được cài đặt ứng dụng MoMo</p>
        </template>
      </el-radio>
      <el-radio value="zalopay" border class="[&>*:first-child]:mt-1 w-full">
        <template #default>
          <p class="flex items-center payment-label">
            <img src="/icon/zalopay.jpeg" alt="ZaloPay" width="30" class="mr-1.5" />
            <span class="font-bold">Ví ZaloPay</span>
          </p>
          <p class="text-grey-600">Điện thoại của bạn phải được cài đặt ứng dụng Zalopay</p>
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
</style>
