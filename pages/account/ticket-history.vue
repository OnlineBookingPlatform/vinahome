<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { getTicketByAccountIdAPI } from '~/api/ticketAPI';
import type { DTO_RP_TicketSearch } from '~/types/TicketType';

definePageMeta({
  layout: "default",
});

const loading = ref(false);
const router = useRouter();

const ticketData = ref<DTO_RP_TicketSearch[]>([]);
const userStore = useUserStore();

const fetchTicketByAccountId = async () => {
  loading.value = true;
  try {
    if (userStore.userData?.id) {
      console.log("Fetching tickets for user ID:", userStore.userData.id);
      const response = await getTicketByAccountIdAPI(userStore.userData.id);
      ticketData.value = response.result;
      console.log("Tickets fetched successfully:", response);
    } else {
      console.error("User ID is undefined");
      ElMessage.error("User ID is undefined");
    }
  } catch (error) {
    console.error("Error fetching tickets:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  userStore.loadUserData();
  fetchTicketByAccountId();
});

const handleEvaluate = () => {
  router.push({ path: '/account/review-trip' })
};
const handleDownloadTicket = () => {
  ElMessage({
    message: 'Chức năng đang được phát triển',
    type: 'warning',
    duration: 2000,
  });
};
</script>

<template>
  <NuxtLayout name="layout-v1">
    <h2 class="text-lg">Vé Của Tôi</h2>
    <div class="bg-white rounded-lg w-full py-2" v-loading="loading">
      <div class="mx-5 my-5 flex items-center">
        <div class="flex flex-col w-full">
          <div v-for="ticket in ticketData" :key="ticket.id" class="border-gray-300 rounded-lg border shadow-md mb-4">
            <div class="px-4 py-2 flex flex-wrap justify-between items-start border-b border-dashed border-gray-300">
              <span class="text-sm">
                {{ ticket.start_time.slice(0, 5) }} -
                {{ new Date(ticket.start_date).toLocaleDateString('vi-VN') }}
              </span>

              <div class="bg-blue-100 px-2 rounded-md">
                <span class="text-red-700 text-sm">
                  {{ ticket.payment_method === 1 ? 'Thanh toán online' : 'Thanh toán tại quầy' }}
                </span>

              </div>
            </div>
            <div class="px-4 py-1 flex justify-between items-center">
              <div>
                <div class="flex items-center">
                  <span class="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                      <path
                        d="M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48L0 80zM64 96l0 64 64 0 0-64L64 96zM0 336c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96zm64 16l0 64 64 0 0-64-64 0zM304 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm80 64l-64 0 0 64 64 0 0-64z" />
                    </svg>
                  </span>
                  <span class="text-md">Mã vé: </span>
                  <span class="font-semibold text-[#0072bc]">{{
                    ticket.id
                    }}</span>
                </div>
                <div>
                  <span class="text-md">Tuyến: </span>
                  <span class="font-semibold">{{ ticket.route_name }}</span>
                </div>
                <div>
                  <span class="text-md">Điểm đón: </span>
                  <span class="font-semibold">{{
                    ticket.point_up
                    }}</span>
                </div>
                <div>
                  <span class="text-md">Điểm trả: </span>
                  <span class="font-semibold">{{
                    ticket.point_down
                    }}</span>
                  
                </div>
                <div>
                  <span class="text-md">Số điện thoại: </span>
                  <span class="font-semibold">{{ticket.passenger_phone }}</span>
                </div>
              </div>
              <div>
                <el-button type="danger" @click="handleEvaluate()">Đánh giá</el-button>
                <el-button type="success" @click="handleDownloadTicket()">Tải vé</el-button>
              </div>
            </div>
            <div
              class="px-4 pb-2 flex flex-wrap justify-between items-start border-t border-dashed border-gray-300 pt-2">
              <div class="flex flex-col">
                <span class="text-sm">Chỗ đã đặt</span>
                <span class="font-semibold">{{ ticket.seat_name }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm">Giá vé</span>
                <span class="font-semibold">
                  {{ new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(ticket.base_price) }}
                </span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
