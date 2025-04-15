<script setup lang="ts">
import { ArrowLeft, Ticket } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { createZaloPayPayment } from "~/api/paymentAPI";
import { changeTicketAvailableAPI } from "~/api/ticketAPI";
import { calculateTotalTime } from "~/lib/calculateTotalTime";
import type { UserType } from "~/types/AccountType";
import type { BookingData } from "~/types/PendingType";
import type { DTO_RQ_ZaloPay } from "~/types/ZaloPayType";
const showPaymentMethods = ref(false);
const showTripInfo = ref(false);
const showFormTripInfo = ref(false);

const contactInfoForm = ref({
  gender: "male",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  note: "",
});

const showPriceDetail = ref(true);

const router = useRouter();
const handleBack = () => {
  if (showPaymentMethods.value) {
    // Quay lại bước "Thông tin chuyến đi"
    showPaymentMethods.value = false;
  } else {
    // Đã ở bước "Thông tin chuyến đi", quay về trang trước
    router.back();
    localStorage.removeItem("paymentStartTime");
  }
};

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
const localUserData = ref({
  name: "",
  email: "",
  phone: "",
  gender: 1,
  note: "",
});
onMounted(async () => {
  isLoading.value = true;

  userStore.loadUserData();
  pendingTicketStore.loadPendingTicket();

  const user = userStore.userData;
  if (user) {
    localUserData.value.name = user.name || "";
    localUserData.value.email = user.email || "";
    localUserData.value.phone = user.phone || "";
    localUserData.value.gender = user.gender || 1;
  }

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

const resetTrigger = ref(false);
const timer = ref<NodeJS.Timeout | null>(null);
const currentTimeleft = ref(0);
const TOTAL_TIME = 1200; // 20 phút

const initCountdown = () => {
  const savedStartTime = localStorage.getItem("paymentStartTime");
  const now = Math.floor(Date.now() / 1000);

  if (savedStartTime) {
    const elapsed = now - parseInt(savedStartTime);
    const remaining = TOTAL_TIME - elapsed;
    return Math.max(0, remaining);
  }

  localStorage.setItem("paymentStartTime", now.toString());
  return TOTAL_TIME;
};

const startCountdown = () => {
  currentTimeleft.value = initCountdown();

  if (currentTimeleft.value > 0) {
    timer.value = setInterval(async () => {
      currentTimeleft.value -= 1;

      if (currentTimeleft.value <= 0) {
        clearInterval(timer.value as NodeJS.Timeout);
        try {
          await changeTicketAvailableAPI(pendingData.value?.selectedTicket);
          localStorage.removeItem("paymentStartTime");
          router.back();
          pendingTicketStore.clearPendingTicket();
          ElMessage.warning("Thời gian thanh toán đã hết!");
        } catch (error) {
          ElMessage.error("Lỗi hệ thống! Vui lòng thử lại sau.");
        }
      }
    }, 1000);
  } else {
    console.log("Thời gian đã hết ngay từ đầu!");
  }
};
const resetCountdown = () => {
  localStorage.removeItem("paymentStartTime");
  clearTimer();
  startCountdown();
};
const clearTimer = () => {
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};
const formattedTime = computed(() => {
  const minutes = Math.floor(currentTimeleft.value / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (currentTimeleft.value % 60).toString().padStart(2, "0");
  return { minutes, seconds };
});
const background = computed(() =>
  currentTimeleft.value < 600 ? "bg-warning" : "bg-primary"
);
watch(resetTrigger, () => {
  resetCountdown();
});
onMounted(() => {
  startCountdown();
  if (currentTimeleft.value <= 12) {
    currentTimeleft.value = 12;
  }
});
onUnmounted(clearTimer);
</script>

<template>
  <section class="container mx-auto flex justify-center my-10 gap-6">
    <div v-if="isLoading" class="text-center py-10">
      <el-spinner size="large" />
      <p>Đang tải thông tin vé...</p>
    </div>
    <div class="flex-1 max-w-3xl space-y-6" v-else-if="pendingData">
      <div>
        <el-button type="primary" :icon="ArrowLeft" link @click="handleBack"
          >Quay lại</el-button
        >
      </div>
      <!-- Thông tin thanh toán + Thông tin chuyến đi -->
      <div class="bg-white py-6 rounded-xl border w-full payment-method">
        <div class="border-b px-6 py-4">
          <h5 v-if="!showPaymentMethods">Thông tin chuyến đi của bạn</h5>
          <h5 v-else>Phương thức thanh toán</h5>
        </div>
        <PaymentTripInfo
          v-if="!showPaymentMethods"
          :pending-data="pendingData"
        />
        <PaymentMethodRadio
          v-else
          v-model="paymentMethod"
          :pending-data="pendingData"
        />
      </div>
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
        <el-form
          v-model="contactInfoForm"
          require-asterisk-position="right"
          :disabled="showPaymentMethods"
        >
          <div class="flex gap-6 *:flex-1">
            <el-form-item label="Họ và tên" required>
              <el-input
                v-model="localUserData.name"
                placeholder="Nhập họ tên"
              />
            </el-form-item>
            <el-form-item label="Giới tính">
              <el-radio-group v-model="localUserData.gender">
                <el-radio-button label="Nam" :value="1" />
                <el-radio-button label="Nữ" :value="2" />
                <el-radio-button label="Khác" :value="3" />
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="flex gap-6">
            <el-form-item
              label="Email nhận thông tin đặt chỗ"
              required
              class="flex-1"
            >
              <el-input
                v-model="localUserData.email"
                placeholder="Nhập email của bạn"
                class="w-full"
              />
            </el-form-item>

            <el-form-item label="Số điện thoại" required class="flex-1">
              <el-input
                v-model="localUserData.phone"
                placeholder="+84"
                class="w-full"
              >
                <template #prepend>
                  <Icon name="vinahome:phone-flag" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <el-form-item label="Ghi chú thêm (nếu có)">
            <el-input
              v-model="localUserData.note"
              placeholder="Nhập thêm ghi chú của bạn cho nhà xe hoặc nhân viên trên xe"
            />
          </el-form-item>
        </el-form>
      </div>
      <button
        class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75"
        @click="submitForm"
      >
        {{ showPaymentMethods ? "Xác nhận thanh toán" : "Tiếp tục thanh toán" }}
      </button>
    </div>

    <aside class="min-w-72 ml-10 space-y-4">
      <PaymentCountdown
        :minutes="formattedTime.minutes"
        :seconds="formattedTime.seconds"
        :background="background"
      />

      <!--Form số tiền cần thanh toán -->
      <div class="bg-white border rounded-xl">
        <div
          class="p-4 flex justify-between items-center cursor-pointer"
          @click="() => (showPriceDetail = !showPriceDetail)"
        >
          <p class="font-semibold text-xl">Số tiền cần thanh toán</p>
          <div
            class="flex items-center justify-center bg-primary p-2 rounded-full"
          >
            <Icon
              :name="showPriceDetail ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-white"
            />
          </div>
        </div>
        <div
          v-show="showPriceDetail"
          class="text-sm space-y-2 text-muted px-4 pb-4"
        >
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
              <template
                v-for="(ticket, index) in pendingData?.selectedTicket"
                :key="index"
              >
                {{ ticket.seat_name }}
                {{
                  index < (pendingData?.selectedTicket?.length ?? 0) - 1
                    ? ", "
                    : ""
                }}
              </template>
            </span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Khuyến mãi</span>
            <span class="text-green-500">0đ</span>
          </div>
        </div>
        <div
          class="p-4 border-t font-bold text-white bg-primary flex justify-between rounded-b-xl"
        >
          <span>Tổng tạm tính</span>
          <span
            >{{
              (
                Number(pendingData?.selectedTicket?.[0]?.price || 0) *
                (pendingData?.selectedTicket?.length || 0)
              ).toLocaleString("vi-VN")
            }}đ</span
          >
        </div>
      </div>

      <!--Form số tiền cần thanh toán -->
      <div
        class="bg-white rounded-xl shadow border text-sm w-72"
        v-if="showFormTripInfo"
      >
        <div
          class="p-4 border-b flex justify-between items-center cursor-pointer"
          @click="showTripInfo = !showTripInfo"
        >
          <p class="font-semibold text-xl">Thông tin chuyến đi</p>
          <div
            class="flex items-center justify-center bg-primary p-2 rounded-full"
          >
            <Icon
              :name="showTripInfo ? 'mdi:chevron-up' : 'mdi:chevron-down'"
              class="text-white"
            />
          </div>
        </div>

        <div v-show="showTripInfo" class="p-4 space-y-4">
          <div
            class="flex justify-center items-center gap-2 rounded-2xl overflow-hidden border border-gray-300 h-[160px] w-[100%]"
          >
            <img
              :src="pendingData?.tripData.company.url_vehicle_online"
              alt="Xe"
              class="object-cover"
            />
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
              <div
                class="size-5 my-1 border-2 bg-white border-black rounded-full"
              ></div>
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
              <div
                class="size-5 mt-1 text-black z-10 flex items-center justify-center"
              >
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
    </aside>
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
