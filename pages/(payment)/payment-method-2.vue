<script setup lang="ts">
import { ArrowLeft, Ticket } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { useRouter } from "vue-router";
import { checkZaloPayPayment, createMomoPayment, createZaloPayPayment } from "~/api/paymentAPI";
import { changeTicketAvailableAPI, updateTicketOnPlatformAPI } from "~/api/ticketAPI";
import ResultSuccess from "~/components/payment/ResultSuccess.vue";
import { calculateTotalTime } from "~/lib/libTime"
import type { UserType } from "~/types/AccountType";
import type { DTO_RQ_DataPay } from "~/types/PaymentType";
import type { BookingData } from "~/types/PendingType";
import type { DTO_RQ_UpdateTicketOnPlatform } from "~/types/TicketType";
import type { DTO_RP_StatusZaloPay, DTO_RQ_ZaloPay } from "~/types/ZaloPayType";
const showPaymentMethods = ref(false);
const showTripInfo = ref(false);
const showFormTripInfo = ref(false);
const showPriceDetail = ref(true);
const router = useRouter();
const pendingTicketStore = usePendingTicketStore();
const userStore = useUserStore();
const pointStore = usePointStore();
const isLoading = ref(true);

const localUserData = ref({
  name: "",
  email: "",
  phone: "",
  gender: 1,
  note: "",
});


const pendingData = computed(() => {
  if (!pendingTicketStore.pendingTicket) {
    console.warn("Pending ticket data is null");
    return null;
  }
  return pendingTicketStore.pendingTicket as BookingData;
});


onMounted(async () => {
  try {
    isLoading.value = true;

    await Promise.all([
      userStore.loadUserData(),
      pointStore.loadPoints(),
      pendingTicketStore.loadPendingTicket()
    ]);

    console.log("localUserData ticket:", localUserData.value);


    const user = userStore.userData;
    if (user) {
      localUserData.value = {
        ...localUserData.value,

        name: user.name ?? "",
        email: user.email ?? "",
        phone: user.phone ?? "",
        gender: user.gender ?? 1,
        note: user.note ?? "",
      };
    }
  } catch (error) {
    console.error("Error in onMounted:", error);
  } finally {
    isLoading.value = false;
  }
});






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

const startCountdown = async () => {
  try {
    currentTimeleft.value = initCountdown();

    if (currentTimeleft.value <= 0) {
      console.log("Thời gian đã hết ngay từ đầu!");
      await handleTimeoutActions();
      return;
    }

    timer.value = setInterval(async () => {
      currentTimeleft.value -= 1;

      if (currentTimeleft.value <= 0) {
        clearInterval(timer.value as NodeJS.Timeout);
        await handleTimeoutActions();
      }
    }, 1000);
  } catch (error) {
    console.error("Lỗi trong quá trình đếm ngược:", error);
    ElMessage.error("Có lỗi xảy ra trong quá trình đếm ngược");
  }
};

const handleTimeoutActions = async () => {
  try {
    await changeTicketAvailableAPI(pendingData.value?.selectedTicket);
    localStorage.removeItem("paymentStartTime");
    pointStore.clearPoints();
    pendingTicketStore.clearPendingTicket();
    ElMessage.warning("Thời gian thanh toán đã hết!");

    // Thêm delay nhỏ để đảm bảo các action hoàn thành trước khi chuyển trang
    setTimeout(() => {
      router.push("/");
    }, 100);
  } catch (error) {
    console.error("Lỗi khi xử lý hết thời gian:", error);
    ElMessage.error("Lỗi hệ thống! Vui lòng thử lại sau.");
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
  if (currentTimeleft.value <= 1) {
    currentTimeleft.value = 1;
  }

});
onUnmounted(clearTimer);

const handleBack = async () => {
  if (showPaymentMethods.value) {
    // Quay lại bước "Thông tin chuyến đi"
    showPaymentMethods.value = false;
  } else {
    // Đã ở bước "Thông tin chuyến đi", quay về trang trước
    try {
      await changeTicketAvailableAPI(pendingData.value?.selectedTicket);
      localStorage.removeItem("paymentStartTime");
      pointStore.clearPoints();
      router.back();
      pendingTicketStore.clearPendingTicket();
    } catch (error) {
      ElMessage.error("Lỗi hệ thống! Vui lòng thử lại sau.");
    }
  }
};


// Xử lý params khi thanh toán thành công
const paymentSuccess = ref(false);
const paymentMethod = ref("vnpay");
const submitForm = async () => {
  showPaymentMethods.value = true;
  const fieldsToUpdate: Partial<typeof localUserData.value> = {
    name: localUserData.value.name,
    phone: localUserData.value.phone,
    note: localUserData.value.note,
    gender: localUserData.value.gender,
    email: localUserData.value.email,
  };
  userStore.setUserData({
    ...userStore.userData,
    ...fieldsToUpdate,
  } as UserType);

  // ✅ Tính toán giá vé sau khi trừ discount
  const selectedTickets = pendingTicketStore.pendingTicket?.selectedTicket || [];
  const totalDiscount = selectedDiscount.value?.discount_value || 0;
  const discountPerTicket = selectedTickets.length > 0
    ? totalDiscount / selectedTickets.length
    : 0;

  const ticketsWithDiscount = selectedTickets.map(ticket => ({
    id: ticket.id,
    seat_name: ticket.seat_name,
    price: Math.max(0, ticket.price - discountPerTicket), // ✅ Giá sau giảm
  }));

  const dataPay: DTO_RQ_DataPay = {
    service_provider_id: pendingTicketStore.pendingTicket?.tripData.company.id || null,
    service_provider_name: pendingTicketStore.pendingTicket?.tripData.company.name || null,
    ticket: ticketsWithDiscount,

    passenger_name: localUserData.value.name || null,
    passenger_phone: localUserData.value.phone || null,
    point_up: typeof pointStore.pointUp?.name === 'string'
      ? pointStore.pointUp.name
      : null,
    point_down: typeof pointStore.pointDown?.name === 'string'
      ? pointStore.pointDown.name
      : null,
    ticket_note: localUserData.value.note || null,
    email: localUserData.value.email || null,
    gender: localUserData.value.gender ?? null,
    creator_by_id: userStore.userData?.id || null,

  };

  console.log("✅ Vé sau khi trừ giảm giá:", ticketsWithDiscount);
  console.log("🧾 Dữ liệu gửi lên server (dataPay):", dataPay);



  if ((showPaymentMethods.value = true)) {
    if (paymentMethod.value == "vnpay") {
      localStorage.setItem('paymentMethod', 'vnpay');
      console.log("VNPAY selected");
    }
    if (paymentMethod.value == "momo") {
      localStorage.setItem('paymentMethod', 'momo');
      console.log("MoMo selected");
      try {
        console.log("MoMo Data send to Server:", dataPay);
        const response = await createMomoPayment(dataPay);
        if (response.result) {
          console.log("MoMo:", response.result);

          window.location.href = response.result.payUrl;
        } else {
          ElMessage.error(response.message || "Thanh toán thất bại");
        }
      } catch (error) {
        ElMessage.error("Có lỗi xảy ra khi tạo thanh toán MoMo");
      }
    }
    if (paymentMethod.value == "zalopay") {
      localStorage.setItem('paymentMethod', 'zalopay');
      console.log("ZaloPay selected");
      try {
        console.log("ZaloPay Data send to Server:", dataPay);
        const response = await createZaloPayPayment(dataPay);
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
    if (paymentMethod.value == "national") {
      localStorage.setItem('paymentMethod', 'national');
      console.log("National selected");
    }
  }
};

import { getDiscountsByCompanyAPI } from '~/api/discountAPI';
import type { DiscountType } from '~/types/DiscountType';

const discountData = ref<DiscountType[]>([]);
const companyId = computed(() => pendingTicketStore.pendingTicket?.tripData.company.id ?? null);
const selectedDiscount = ref<DiscountType | null>(null);

const fetchDiscountsByCompanyId = async () => {
  try {
    if (companyId.value) {
      const response = await getDiscountsByCompanyAPI(companyId.value);
      discountData.value = response.result;
      console.log("Mã giảm giá lấy được:", response);
    }
  } catch (error) {
    console.error("Lỗi lấy mã giảm giá:", error);
  }
};

onMounted(() => {
  fetchDiscountsByCompanyId();
});

function selectDiscount(discount: DiscountType) {
  if (selectedDiscount.value?.id === discount.id) {
    selectedDiscount.value = null; // Bỏ chọn khi nhấn lại
  } else {
    selectedDiscount.value = discount;
  }
}

function formatDate(dateStr: string | null | undefined) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}




// const fetchBookingDataTicketAPI = async () => {
//   try {
//     await userStore.loadUserData();
//     await pendingTicketStore.loadPendingTicket();

//     const selectedTickets = pendingData.value?.selectedTicket ?? [];

//     const ticketData: DTO_RQ_UpdateTicketOnPlatform[] = selectedTickets.map(ticket => ({
//       id: ticket.id ?? null,
//       passenger_name: localUserData.value.name || null,
//       passenger_phone: localUserData.value.phone || null,
//       point_up: typeof pointStore.pointUp?.name === 'string'
//         ? pointStore.pointUp.name
//         : null,
//       point_down: typeof pointStore.pointDown?.name === 'string'
//         ? pointStore.pointDown.name
//         : null,
//       ticket_note: localUserData.value.note || null,
//       email: localUserData.value.email || null,
//       gender: localUserData.value.gender ?? null,
//       creator_by_id: userStore.userData?.id || null,
//     }));
//     console.log("Ticket data to update:", ticketData);
//     const response = await updateTicketOnPlatformAPI(ticketData);
//     if (response.status === 200) {
//       console.log('Cập nhật vé thành công!');
//       ElMessage.success('Đặt vé thành công!');
//     } else {
//       console.error('Cập nhật vé thất bại');
//       ElMessage.error('Đặt vé thất bại!');
//     }
//   } catch (error) {
//     console.error("Error calling API:", error);
//   }
// };


// const checkPaymentStatus = () => {
//   const urlParams = new URLSearchParams(window.location.search);
//   const status = urlParams.get('status');

//   if (status && status === '1' && !hasCalledAPI.value) {
//     hasCalledAPI.value = true;
//     paymentSuccess.value = true;
//     console.log("Payment success detected!");
//     fetchBookingDataTicketAPI()
//   } else if (status !== '1') {
//     paymentSuccess.value = false;
//   }
// };
// onMounted(() => {
//   checkPaymentStatus();
//   const interval = setInterval(() => {
//     checkPaymentStatus();
//   }, 10000); // Kiểm tra mỗi giây
//   onBeforeUnmount(() => {
//     clearInterval(interval);
//   });
// });
</script>

<template>
  <section class="container mx-auto flex justify-center my-10 gap-6">
    <div v-if="isLoading" class="text-center py-10">
      <!-- <el-spinner size="large" /> -->
      <p>Đang tải thông tin vé...</p>
    </div>
    <div class="flex-1 max-w-3xl space-y-6" v-else-if="pendingData">
      <div>
        <el-button type="primary" :icon="ArrowLeft" link @click="handleBack">Quay lại</el-button>
      </div>
      <div v-if="paymentMethod === 'national'" class="stripe-card-container">
        <div id="card-element" class="stripe-card-element"></div>



      </div>
      <!-- Thông tin thanh toán + Thông tin chuyến đi -->
      <div class="bg-white py-6 rounded-xl border w-full payment-method">
        <div class="border-b px-6 py-4">
          <h5 v-if="!showPaymentMethods">Thông tin chuyến đi của bạn</h5>
          <h5 v-else>Phương thức thanh toán</h5>
        </div>
        <!-- <ResultSuccess v-if="paymentSuccess" /> -->

        <PaymentTripInfo v-if="!paymentSuccess && !showPaymentMethods" :pending-data="pendingData"
          :point-up="pointStore.pointUp" :point-down="pointStore.pointDown" />
        <PaymentMethodRadio v-else-if="!paymentSuccess && showPaymentMethods" v-model="paymentMethod"
          :pending-data="pendingData" />
      </div>
      <!-- Form Thông tin liên hệ -->
      <div class="bg-white p-6 rounded-xl border w-full space-y-8" v-if="!paymentSuccess">
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
        <el-form v-model="localUserData" require-asterisk-position="right" :disabled="showPaymentMethods">
          <div class="flex gap-6 *:flex-1">
            <el-form-item label="Họ và tên" required>
              <el-input v-model="localUserData.name" placeholder="Nhập họ tên" />
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
            <el-form-item label="Email nhận thông tin đặt chỗ" required class="flex-1">
              <el-input v-model="localUserData.email" placeholder="Nhập email của bạn" class="w-full" />
            </el-form-item>

            <el-form-item label="Số điện thoại" required class="flex-1">
              <el-input v-model="localUserData.phone" placeholder="+84" class="w-full">
                <template #prepend>
                  <Icon name="vinahome:phone-flag" />
                </template>
              </el-input>
            </el-form-item>
          </div>

          <el-form-item label="Ghi chú thêm (nếu có)">
            <el-input v-model="localUserData.note"
              placeholder="Nhập thêm ghi chú của bạn cho nhà xe hoặc nhân viên trên xe" />
          </el-form-item>
        </el-form>
      </div>
      <button class="button-gradient h-[50px] w-full text-white text-lg font-bold rounded-lg hover:brightness-75"
        v-if="!paymentSuccess" @click="submitForm">
        {{ showPaymentMethods ? "Xác nhận thanh toán" : "Tiếp tục thanh toán" }}
      </button>
    </div>

    <aside class="min-w-72 ml-10 space-y-4" v-if="!paymentSuccess">
      <PaymentCountdown :minutes="formattedTime.minutes" :seconds="formattedTime.seconds" :background="background" />

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
            <span class="text-green-500">
              {{ selectedDiscount?.discount_value ? selectedDiscount.discount_value.toLocaleString("vi-VN") + "đ"
                : "0đ" }}
            </span>
          </div>
        </div>
        <div class="p-4 border-t font-bold text-white bg-primary flex justify-between rounded-b-xl">
          {{
            (
              (Number(pendingData?.selectedTicket?.[0]?.price || 0) *
                (pendingData?.selectedTicket?.length || 0)) -
              (selectedDiscount?.discount_value || 0)
            ).toLocaleString("vi-VN")
          }}đ
        </div>
      </div>

      <!--Form số tiền cần thanh toán -->
      <div class="bg-white rounded-xl shadow border text-sm w-72" v-if="!paymentSuccess && showFormTripInfo">
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
                      pointStore?.pointUp?.start_time || "",
                      pointStore?.pointUp?.time_point || ""
                    )
                  }}</span>

                  <span>{{ pointStore?.pointUp?.name }}</span>
                </div>
                <p class="text-muted text-xs">
                  {{ pointStore?.pointUp?.address }}
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
                      pointStore?.pointDown?.start_time || "",
                      pointStore?.pointDown?.time_point || ""
                    )
                  }}</span>
                  <span>{{ pointStore?.pointDown?.name }}</span>
                </div>
                <p class="text-muted text-xs">
                  {{ pointStore?.pointDown?.address }}
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

      <div>
        <h3 class="mb-4 font-bold text-lg">Chọn mã giảm giá</h3>
        <ul>
          <li v-for="discount in discountData" :key="discount.id" @click="selectDiscount(discount)" :class="[
            'p-4 mb-3 border rounded cursor-pointer',
            selectedDiscount?.id === discount.id ? 'bg-blue-100 border-blue-600' : 'border-gray-300',
          ]">
            <div class="flex justify-between items-center">
              <div>
                <div class="font-semibold text-lg">{{ discount.discount_code }}</div>
                <div class="text-sm text-gray-700">{{ discount.description }}</div>
                <div class="text-sm text-green-600 font-bold mt-1">
                  Giảm {{ discount.discount_value.toLocaleString('vi-VN') }}đ
                </div>
                <div class="text-xs text-gray-500 mt-1">
                  Áp dụng từ {{ formatDate(discount.date_start) }} đến {{ formatDate(discount.date_end) }}
                </div>
              </div>
              <div v-if="selectedDiscount?.id === discount.id" class="text-blue-700 font-bold">
                Đã chọn
              </div>
            </div>
          </li>
        </ul>
        <div v-if="discountData.length === 0" class="text-gray-500">Không có mã giảm giá nào.</div>
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
