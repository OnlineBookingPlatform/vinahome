<script setup lang="ts">
const showPaymentMethods = ref(false)
const showTripInfo = ref(false)
const showFormTripInfo = ref(false)

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
  showFormTripInfo.value = true
  showTripInfo.value = true
}

const showPriceDetail = ref(true)


const minutes = ref(15)
const seconds = ref(0)
const countdown = () => {
  if (seconds.value === 0) {
    if (minutes.value === 0) return
    minutes.value--
    seconds.value = 59
  } else {
    seconds.value--
  }
}
const togglePriceDetail = () => {
  showPriceDetail.value = !showPriceDetail.value
}

onMounted(() => {
  setInterval(countdown, 1000)
})
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

    <aside class="min-w-72 ml-10 space-y-4">
      <!--Form thời gian giữ vé -->
      <div class="bg-white border rounded-xl p-4 text-center shadow">
        <p class="text-base font-semibold text-black mb-3">Thời gian giữ vé còn lại</p>
        <div class="flex justify-center items-center gap-4 font-bold text-white text-xl">
          <div class="flex flex-col items-center">
            <div class="bg-[#38c7f3] rounded-lg px-3 py-1 min-w-[44px] text-center">
              {{ minutes.toString().padStart(2, '0') }}
            </div>
            <span class="text-xs text-muted mt-1">phút</span>
          </div>
          <div class=" justify-center text-[#38c7f3] text-xl font-bold">
            <span class="leading-none h-10 flex ">:</span>
          </div>
          <div class="flex flex-col items-center">
            <div class="bg-[#38c7f3] rounded-lg px-3 py-1 min-w-[44px] text-center">
              {{ seconds.toString().padStart(2, '0') }}
            </div>
            <span class="text-xs text-muted mt-1">giây</span>
          </div>
        </div>
      </div>

      <!--Form số tiền cần thanh toán -->
      <div class="bg-white border rounded-xl shadow">
        <div class="p-4 border-b flex justify-between items-center cursor-pointer" @click="togglePriceDetail">
          <p class="font-semibold text-xl">Số tiền cần thanh toán</p>
          <div class="flex items-center justify-center bg-[#38c7f3] p-2 rounded-full">
            <Icon :name="showPriceDetail ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-white" />
          </div>
        </div>
        <div v-show="showPriceDetail" class="p-4 text-sm space-y-2 text-muted">
          <div class="flex justify-between">
            <span class="text-gray-600">Giá vé</span>
            <span class="font-bold text-black">130.000đ x 2</span>
          </div>
          <div class="flex justify-between text-xs text-gray-400 italic">
            <span>Giá gốc</span>
            <span>Mã ghế/giường: 3, 4</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Khuyến mãi</span>
            <span class="text-green-500">-20.000đ</span>
          </div>
        </div>
        <div class="p-4 border-t font-bold text-white bg-[#38c7f3] flex justify-between rounded-b-xl">
          <span>Tổng tạm tính</span>
          <span>240.000đ</span>
        </div>
      </div>

      <!--Form số tiền cần thanh toán -->
      <div class="bg-white rounded-xl shadow border text-sm w-72" v-if="showFormTripInfo">
        <div class="p-4 border-b flex justify-between items-center cursor-pointer"
          @click="showTripInfo = !showTripInfo">
          <p class="font-semibold text-xl">Thông tin chuyến đi</p>
          <div class="flex items-center justify-center bg-[#38c7f3] p-2 rounded-full">
            <Icon :name="showTripInfo ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-white" />
          </div>
        </div>

        <div v-show="showTripInfo" class="p-4 space-y-4">
          <div class="w-26 h-24 rounded-xl overflow-hidden">
            <img class="w-full h-full object-cover" src="https://placehold.co/200x160" alt="bus image">
          </div>
          
          <div>
            <h5 class="text-base font-semibold">{{ mockTripDetail.destination }}</h5>
            <p class="text-muted">{{ mockTripDetail.bus }}</p>
          </div>

          <div class="relative ">
            <!-- Đường dọc -->
            <div class="absolute top-[26px] left-[7px] h-[94px] w-px bg-gray-400"></div>

            <!-- Điểm đón -->
            <div class="flex gap-2 items-start mb-6">
              <div class="size-5 my-1 border-2 bg-white border-black rounded-full"></div>
              <div>
                <div class="flex gap-2 items-center font-semibold">
                  <span>{{ mockTripDetail.pickupInfo.time }}</span>
                  <span>{{ mockTripDetail.pickupInfo.locationName }}</span>
                </div>
                <p class="text-muted text-xs">{{ mockTripDetail.pickupInfo.address }}</p>
                <button class="text-primary text-sm underline">Thay đổi</button>
              </div>
            </div>

            <!-- Điểm trả -->
            <div class="flex gap-2 items-start">
              <div class="size-5 mt-1 text-black z-10 flex items-center justify-center">
                <Icon name="fa6-solid:location-dot" class="size-4" />
              </div>
              <div>
                <div class="flex gap-2 items-center font-semibold">
                  <span>{{ mockTripDetail.returnInfo.time }}</span>
                  <span>{{ mockTripDetail.returnInfo.locationName }}</span>
                </div>
                <p class="text-muted text-xs">{{ mockTripDetail.returnInfo.address }}</p>
                <button class="text-primary text-sm underline">Thay đổi</button>
              </div>
            </div>
          </div>

          <div class="text-sm font-medium">
            Ghế: <span class="font-semibold">{{ mockTripDetail.seats }} khách</span>
          </div>
        </div>
      </div>

    </aside>
  </section>
</template>

<style scoped>
.el-form-item {
  display: block
}
</style>