<script setup lang="ts">
const showPaymentMethods = ref(false)

const paymentMethod = ref("qr")

const mockTripDetail = {
  destination: "Thành Nhân - Hải Phòng",
  bus: "Gường nằm 40 chỗ",
  pickupInfo: {
    time: "06:00",
    locationName: "Văn phòng 65 Khuất Duy Tiến (Big C Mỹ Đình)",
    address: "65 Khuất Duy Tiến, Phường Nhân Chính, Thanh Xuân, Hà Nội"
  },
  returnInfo: {
    time: "06:00",
    locationName: "Văn phòng 97 Hùng Vương (Bến xe Thượng Lý)",
    address: "Số 97 Hùng Vương, Phường Sở Dầu, Hồng Bàng, Hải Phòng"
  },
  seats: 2,
}

const contactInfoForm = ref({
  gender: "male",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  note: ""
})

const submitForm = () => {
  showPaymentMethods.value = true
}
</script>

<template>
  <section class="container mx-auto flex justify-center my-10">
    <div class="flex-1 max-w-3xl space-y-6">
      <!-- Thông tin thanh toán + Thông tin chuyến đi -->
      <div class="bg-white py-6 rounded-xl border w-full">
        <div class="border-b px-6 py-4">
          <h5 v-if="!showPaymentMethods">Thông tin chuyến đi của bạn</h5>
          <h5 v-else>Phương thức thanh toán</h5>
        </div>
        <PaymentTripInfo v-if="!showPaymentMethods" :trip-info="mockTripDetail" />
        <PaymentMethodRadio v-else v-model="paymentMethod" />
      </div>
      <!-- Form Thông tin liên hệ -->
      <div class="bg-white p-6 rounded-xl border w-full space-y-8">
        <div class="space-y-4">
          <h5>Thông tin liên hệ</h5>
          <p class="text-muted flex items-center">
            <Icon name="vuesax:info-circle" class="size-5" />
            <span class="ml-2">
              Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và liên hệ khi cần thiết.
            </span>
          </p>
        </div>
        <el-form v-model="contactInfoForm" require-asterisk-position="right" :disabled="showPaymentMethods">
          <el-form-item label="Giới tính">
            <el-radio-group v-model="contactInfoForm.gender">
              <el-radio-button label="Nam" value="male" />
              <el-radio-button label="Nữ" value="female" />
              <el-radio-button label="Khác" value="other" />
            </el-radio-group>
          </el-form-item>
          <div class="flex gap-6 *:flex-1">
            <el-form-item label="Họ" required>
              <el-input v-model="contactInfoForm.firstName" placeholder="Nhập họ" />
            </el-form-item>
            <el-form-item label="Tên" required>
              <el-input v-model="contactInfoForm.lastName" placeholder="Nhập tên" />
            </el-form-item>
          </div>
          <div class="flex gap-6">
            <el-form-item label="Email nhận thông tin đặt chỗ" required class="flex-shrink-0">
              <el-input v-model="contactInfoForm.email" placeholder="Nhập email của bạn" />
            </el-form-item>
            <el-form-item label="Số điện thoại" required>
              <el-input v-model="contactInfoForm.phoneNumber" placeholder="+84">
                <template #prepend>
                  <Icon name="vinahome:phone-flag" />
                </template>
              </el-input>
            </el-form-item>
          </div>
          <el-form-item label="Ghi chú thêm (nếu có)">
            <el-input v-model="contactInfoForm.note"
              placeholder="Nhập thêm ghi chú của bạn cho tài xế hoặc nhân viên trên xe" />
          </el-form-item>
        </el-form>
      </div>
      <button class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75"
        @click="submitForm">Thanh toán</button>
    </div>
    <aside class="min-w-56">

    </aside>
  </section>
</template>

<style scoped>
.el-form-item {
  display: block
}
</style>