<script setup lang="ts">
import { ArrowLeft, Ticket } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { createZaloPayPayment } from "~/api/paymentAPI";
import { calculateTotalTime } from "~/lib/calculateTotalTime";
import type { UserType } from "~/types/AccountType";
import type { BookingData } from "~/types/PendingType";
import type { DTO_RQ_ZaloPay } from "~/types/ZaloPayType";

const showPaymentMethods = ref(false);
const showTripInfo = ref(false);
const showFormTripInfo = ref(false);

const mockTripDetail = {
  destination: "Thành Nhân - Hải Phòng",
  bus: "Gường nằm 40 chỗ",
  pickupInfo: {
    time: "06:00",
    locationName: "Văn phòng 65 Khuất Duy Tiến (Big C Mỹ Đình)",
    address: "65 Khuất Duy Tiến, Phường Nhân Chính, Thanh Xuân, Hà Nội",
  },
  returnInfo: {
    time: "06:00",
    locationName: "Văn phòng 97 Hùng Vương (Bến xe Thượng Lý)",
    address: "Số 97 Hùng Vương, Phường Sở Dầu, Hồng Bàng, Hải Phòng",
  },
  seats: 2,
};


const showPriceDetail = ref(true);

const router = useRouter();
const route = useRoute();


const pendingTicketStore = usePendingTicketStore();
const userStore = useUserStore();

const isLoading = ref(true);

const pendingData = computed(() => {
  if (!pendingTicketStore.pendingTicket) {
    console.warn("Pending ticket data is null");
    return null;
  }
  return pendingTicketStore.pendingTicket as BookingData;
});

const contactInfoForm = ref({
  gender: 1,
  name: "",
  email: "",
  phone: "",
  note: "",
});

onMounted(async () => {
  isLoading.value = true;

  userStore.loadUserData();
  pendingTicketStore.loadPendingTicket();

  const user = userStore.userData;

  if (user) {
    contactInfoForm.value = { gender: user.gender, name: user.name, email: user.email, phone: user.phone, note: "" }
  }

  console.log()

  isLoading.value = false;
});

const paymentMethod = ref("vnpay");

const submitForm = async () => {
  showPaymentMethods.value = true;
  if ((showPaymentMethods.value = true)) {
    if (paymentMethod.value == "vnpay") {
      console.log("VNPAY selected");
    }

    if (paymentMethod.value == "momo") {
      console.log("MoMo selected");
    }

    if (paymentMethod.value == "zalopay") {
      console.log("ZaloPay selected");
      console.log(pendingTicketStore.pendingTicket);
      const data = {
        account_id: userStore.userData?.id || "",
        service_provider_id:
          pendingTicketStore.pendingTicket?.tripData.company.id || 0,
        service_provider_name:
          pendingTicketStore.pendingTicket?.tripData.company.name || "",
        ticket:
          pendingTicketStore.pendingTicket?.selectedTicket.map((ticket) => ({
            id: ticket.id,
            seat_name: ticket.seat_name,
            price: ticket.price,
          })) || [],
      } as DTO_RQ_ZaloPay;
      console.log(data);
      try {
        const response = await createZaloPayPayment(data);
        if (response.result) {
          console.log("ZaloPay:", response.result);
          window.location.href = response.result.order_url;
        } else {
          ElMessage.error(response.message || "Thanh toán thất bại");
        }
      } catch (error) {
        ElMessage.error("Có lỗi xảy ra khi tạo thanh toán ZaloPay");
      }
    }
  }
};

const buttonAction = {
  confirmation: () => navigateTo('method'),
  method: submitForm,
}
</script>

<template>
  <section class="container mx-auto my-10 gap-6 px-[25px] sm:px-[50px]">
    <div v-if="isLoading" class="text-center py-10">
      <el-spinner size="large" />
      <p>Đang tải thông tin vé...</p>
    </div>

    <div>
      <el-button type="primary" :icon="ArrowLeft" link @click="router.back()">Quay lại</el-button>
    </div>
    <div class="flex flex-col sm:flex-row justify-center gap-6">
      <div class="w-full sm:flex-1 max-w-3xl space-y-6">
        <!-- Thông tin thanh toán + Thông tin chuyến đi -->
        <NuxtPage v-model="paymentMethod" :pending-data="pendingData" />
        <!-- Form Thông tin liên hệ -->
        <div class="bg-white p-6 rounded-xl border w-full space-y-8">
          <div class="space-y-4">
            <h5>Thông tin liên hệ</h5>
            <p class="text-muted flex items-center">
              <Icon name="vuesax:info-circle" class="size-5" />
              <span class="ml-2">
                Số điện thoại và email được sử dụng để gửi thông tin đơn hàng và
                liên hệ khi cần thiết.
              </span>
            </p>
          </div>
          <el-form :model="contactInfoForm" require-asterisk-position="right" :disabled="showPaymentMethods">
            <div class="flex flex-col sm:flex-row sm:gap-6 gap-1 *:flex-1">
              <el-form-item label="Họ và tên" required>
                <el-input placeholder="Nhập họ tên" v-model="contactInfoForm.name" />
              </el-form-item>
              <el-form-item label="Giới tính">
                <el-radio-group v-model="contactInfoForm.gender">
                  <el-radio-button label="Nam" :value="1" />
                  <el-radio-button label="Nữ" :value="2" />
                  <el-radio-button label="Khác" :value="3" />
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="flex flex-col sm:flex-row sm:gap-6 gap-1">
              <el-form-item label="Email nhận thông tin đặt chỗ" required class="flex-1">
                <el-input placeholder="Nhập email của bạn" class="w-full" v-model="contactInfoForm.email" />
              </el-form-item>

              <el-form-item label="Số điện thoại" required class="flex-1">
                <el-input placeholder="+84" class="w-full" v-model="contactInfoForm.phone">
                  <template #prepend>
                    <Icon name="vinahome:phone-flag" />
                  </template>
                </el-input>
              </el-form-item>
            </div>
            <el-form-item label="Ghi chú thêm (nếu có)">
              <el-input placeholder="Nhập thêm ghi chú của bạn cho nhà xe hoặc nhân viên trên xe"
                v-model="contactInfoForm.note" />
            </el-form-item>
          </el-form>
        </div>
        <button
          class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75 hidden sm:block"
          @click="buttonAction[route.fullPath.split('/').at(-1)! as keyof typeof buttonAction]">
          {{ showPaymentMethods ? "Xác nhận thanh toán" : "Tiếp tục thanh toán" }}
        </button>
      </div>

      <aside class="sm:min-w-72 sm:ml-10 space-y-4">
        <PaymentCountdown />

        <!--Form số tiền cần thanh toán -->
        <div class="bg-white border rounded-xl">
          <div class="p-4 flex justify-between items-center cursor-pointer"
            @click="() => (showPriceDetail = !showPriceDetail)">
            <p class="font-semibold text-xl">Số tiền cần thanh toán</p>
            <div class="flex items-center justify-center bg-primary p-2 rounded-full">
              <Icon :name="showPriceDetail ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-white" />
            </div>
          </div>
          <div v-show="showPriceDetail" class="text-sm space-y-2 text-muted px-4 pb-4">
            <div class="border-t w-full h-[1px] mb-4"></div>
            <div class="flex justify-between">
              <span class="text-gray-600">Giá vé</span>
              <span class="font-bold text-black">
                {{
                  Number(pendingData?.selectedTicket[0].price).toLocaleString(
                    "vi-VN"
                  )
                }}
                x {{ pendingData?.selectedTicket.length }}
              </span>
            </div>
            <div class="flex justify-between text-xs text-gray-400 italic">
              <span>Mã ghế/giường</span>
              <span>
                <template v-for="(ticket, index) in pendingData?.selectedTicket" :key="index">
                  {{ ticket.seat_name }}
                  {{
                    index < (pendingData?.selectedTicket?.length ?? 0) - 1 ? ", " : "" }} </template>
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Khuyến mãi</span>
              <span class="text-green-500">0đ</span>
            </div>
          </div>
          <div class="p-4 border-t font-bold text-white bg-primary flex justify-between rounded-b-xl">
            <span>Tổng tạm tính</span>
            <span>{{
              (
                Number(pendingData?.selectedTicket?.[0]?.price || 0) *
                (pendingData?.selectedTicket?.length || 0)
              ).toLocaleString("vi-VN")
            }}đ</span>
          </div>
        </div>

        <!--Form số tiền cần thanh toán -->
        <div class="bg-white rounded-xl shadow border text-sm w-72" v-if="showFormTripInfo">
          <div class="p-4 border-b flex justify-between items-center cursor-pointer"
            @click="showTripInfo = !showTripInfo">
            <p class="font-semibold text-xl">Thông tin chuyến đi</p>
            <div class="flex items-center justify-center bg-primary p-2 rounded-full">
              <Icon :name="showTripInfo ? 'mdi:chevron-up' : 'mdi:chevron-down'" class="text-white" />
            </div>
          </div>

          <div v-show="showTripInfo" class="p-4 space-y-4">
            <div
              class="flex justify-center items-center gap-2 rounded-2xl overflow-hidden border border-gray-300 h-[160px] w-[100%]">
              <img :src="pendingData?.tripData.company.url_vehicle_online" alt="Xe" class="object-cover" />
            </div>

            <div>
              <h5 class="text-base font-semibold">
                {{ pendingData?.tripData.company.name }}
              </h5>
              <p class="text-muted">{{ pendingData?.tripData.seat_map.name }}</p>
            </div>

            <div class="relative">
              <!-- Điểm đón -->
              <div class="flex gap-2 items-start mb-6">
                <div class="size-5 my-1 border-2 bg-white border-black rounded-full"></div>
                <div>
                  <div class="flex gap-2 items-center font-semibold">
                    <span>{{
                      calculateTotalTime(
                        pendingData?.pointUp.start_time || "",
                        pendingData?.pointUp.time_point || ""
                      )
                    }}</span>
                    <span>{{ pendingData?.pointUp.name }}</span>
                  </div>
                  <p class="text-muted text-xs">
                    {{ pendingData?.pointUp.address }}
                  </p>
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
                    <span>{{
                      calculateTotalTime(
                        pendingData?.pointDown.start_time || "",
                        pendingData?.pointDown.time_point || ""
                      )
                    }}</span>
                    <span>{{ pendingData?.pointDown.name }}</span>
                  </div>
                  <p class="text-muted text-xs">
                    {{ pendingData?.pointDown.address }}
                  </p>
                  <button class="text-primary text-sm underline">Thay đổi</button>
                </div>
              </div>
            </div>

            <div class="text-sm font-medium">
              Số lượng vé:
              <span class="font-semibold">{{
                pendingData?.selectedTicket.length
              }}</span>
            </div>
          </div>
        </div>
        <!-- Nút dành cho màn hình mobile-->
        <div class="block sm:hidden mt-6">
          <button class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75"
            @click="buttonAction[route.fullPath.split('/').at(-1)! as keyof typeof buttonAction]">
            {{ showPaymentMethods ? "Xác nhận thanh toán" : "Tiếp tục thanh toán" }}
          </button>
        </div>
      </aside>
    </div>
  </section>
</template>

<style scoped>
.el-form-item {
  display: block;
}

.payment-method {
  container-type: inline-size;
}
</style>
