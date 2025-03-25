<script setup lang="ts">
definePageMeta({
  layout: "default",
});

const loading = ref(false);

const tickets = ref([
  {
    id: "12342131",
    status: "Đang chờ",
    departureTime: "20:00 - 17/02/2025",
    route: "Sài Gòn - Buôn Ma Thuột",
    pickupPoint: { location: "Ngã tư An Sương", time: "20:00" },
    dropoffPoint: { location: "TP. Buôn Ma Thuột", time: "05:00" },
    company: "Long Vân",
    seat: "B1D",
    price: "200.000 đ",
  },
  {
    id: "98765432",
    status: "Đã xác nhận",
    departureTime: "08:00 - 18/02/2025",
    route: "Hà Nội - Đà Nẵng",
    pickupPoint: { location: "Bến xe Mỹ Đình", time: "08:00" },
    dropoffPoint: { location: "Bến xe Trung Tâm Đà Nẵng", time: "16:00" },
    company: "Phương Trang",
    seat: "A2C",
    price: "250.000 đ",
  },
]);
</script>

<template>
  <NuxtLayout name="layout-v1">
    <h2 class="text-lg">Vé Của Tôi</h2>
    <div class="bg-white rounded-lg w-full py-2" v-loading="loading">
      <div class="mx-5 my-5 flex items-center">
        <div class="flex flex-col w-full">
          <div
            v-for="ticket in tickets"
            :key="ticket.id"
            class="border-gray-300 rounded-lg border shadow-md mb-4"
          >
            <div
              class="px-4 py-2 flex flex-wrap justify-between items-start border-b border-dashed border-gray-300"
            >
              <span class="text-sm">{{ ticket.departureTime }}</span>
              <div class="bg-blue-100 px-2 rounded-md">
                <span class="text-red-700 text-sm">{{ ticket.status }}</span>
              </div>
            </div>
            <div class="px-4 py-1 flex justify-between items-center">
              <div>
                <div class="flex items-center">
                  <span class="mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      width="16"
                      height="16"
                    >
                      <path
                        d="M0 80C0 53.5 21.5 32 48 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48L0 80zM64 96l0 64 64 0 0-64L64 96zM0 336c0-26.5 21.5-48 48-48l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96zm64 16l0 64 64 0 0-64-64 0zM304 32l96 0c26.5 0 48 21.5 48 48l0 96c0 26.5-21.5 48-48 48l-96 0c-26.5 0-48-21.5-48-48l0-96c0-26.5 21.5-48 48-48zm80 64l-64 0 0 64 64 0 0-64z"
                      />
                    </svg>
                  </span>
                  <span class="text-md">Mã vé: </span>
                  <span class="font-semibold text-[#0072bc]">{{
                    ticket.id
                  }}</span>
                </div>
                <div>
                  <span class="text-md">Tuyến: </span>
                  <span class="font-semibold">{{ ticket.route }}</span>
                </div>
                <div>
                  <span class="text-md">Điểm đón: </span>
                  <span class="font-semibold">{{
                    ticket.pickupPoint.location
                  }}</span>
                  <span class="text-sm ml-2"
                    >({{ ticket.pickupPoint.time }})</span
                  >
                </div>
                <div>
                  <span class="text-md">Điểm trả: </span>
                  <span class="font-semibold">{{
                    ticket.dropoffPoint.location
                  }}</span>
                  <span class="text-sm ml-2"
                    >({{ ticket.dropoffPoint.time }})</span
                  >
                </div>
                <div>
                  <span class="text-md">Nhà xe: </span>
                  <span class="font-semibold">{{ ticket.company }}</span>
                </div>
              </div>
              <div>
                <el-button type="danger">Hủy vé</el-button>
                <el-button type="success">Tải vé</el-button>
              </div>
            </div>
            <div
              class="px-4 pb-2 flex flex-wrap justify-between items-start border-t border-dashed border-gray-300 pt-2"
            >
              <div class="flex flex-col">
                <span class="text-sm">Chỗ đã đặt</span>
                <span class="font-semibold">{{ ticket.seat }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-sm">Giá vé</span>
                <span class="font-semibold">{{ ticket.price }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped></style>
