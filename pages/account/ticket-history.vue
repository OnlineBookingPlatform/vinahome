<script setup lang="ts">
import { ElMessage, ElMessageBox } from 'element-plus';
import { getTicketByAccountIdAPI, abortTicketOnPlatformAPI } from '~/api/ticketAPI';
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
  const companyId = ticketData.value.find((ticket) => ticket.company_id)?.company_id;
  const tripId = ticketData.value.find((ticket) => ticket.trip_id)?.trip_id;
  const ticketId = ticketData.value.find((ticket) => ticket.id)?.id;
  const ticketPhone = ticketData.value.find((ticket) => ticket.passenger_phone)?.passenger_phone;
  console.log("Company ID:", companyId);

  if (companyId) {
    router.push({ 
      path: '/account/review-trip', 
      query: { company_id: companyId , trip_id: tripId, ticket_id: ticketId, ticket_phone: ticketPhone }
    });
  } else {
    ElMessage.error("Không tìm thấy thông tin nhà xe");
  }
};
const handleDownloadTicket = () => {
  ElMessage({
    message: 'Chức năng đang được phát triển',
    type: 'warning',
    duration: 2000,
  });
};

const handleAbortTicket = async (ticketId: number) => {
  try {
    await ElMessageBox.confirm(
      'Bạn có chắc chắn muốn hủy vé này?',
      'Xác nhận hủy vé',
      {
        confirmButtonText: 'Hủy vé',
        cancelButtonText: 'Không',
        type: 'warning',
      }
    );
    
    loading.value = true;
    const response = await abortTicketOnPlatformAPI(ticketId);
    
    if (response.status === 200) {
      ElMessage.success('Hủy vé thành công');
      // Refresh the ticket list after successfully aborting
      await fetchTicketByAccountId();
    } else {
      ElMessage.error(response.message || 'Hủy vé không thành công');
    }
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error aborting ticket:', error);
      ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau');
    }
  } finally {
    loading.value = false;
  }
};

</script>

<template>
  <NuxtLayout name="layout-v1">
    <h1 class="text-xl font-bold mb-4 text-center text-blue-600">Vé của tôi</h1>
    <div class="bg-white rounded-lg w-full py-2" v-loading="loading">
      <div class="mx-5 my-5 flex items-center">
        <div class="flex flex-col w-full">
          <div v-if="ticketData.length === 0" class="text-center py-8">
            <div class="flex justify-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" width="40" height="40" class="text-gray-400">
                <path fill="currentColor" stroke="#9ca3af" stroke-width="10" d="M64 64C28.7 64 0 92.7 0 128v64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320v64c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V320c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6V128c0-35.3-28.7-64-64-64H64zm64 112l0 160c0 8.8 7.2 16 16 16H432c8.8 0 16-7.2 16-16V176c0-8.8-7.2-16-16-16H144c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32H448c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H128c-17.7 0-32-14.3-32-32V160z" />
              </svg>
            </div>
            <p class="text-gray-500 text-lg">Hiện tại chưa có vé</p>
          </div>
          <div v-else v-for="ticket in ticketData" :key="ticket.id" class="border-gray-300 rounded-lg border shadow-md mb-4">
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
                <el-button type="warning" @click="handleEvaluate()">Đánh giá</el-button>
                <el-button type="success" @click="handleDownloadTicket()">Tải vé</el-button>
                <el-button type="danger" @click="handleAbortTicket(ticket.id)">Hủy vé</el-button>
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
