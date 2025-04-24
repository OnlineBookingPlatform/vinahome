<script setup lang="ts">
import { calculateTotalTime } from "~/lib/libTime";
import type { BookingData } from "~/types/PendingType";

defineProps<{
  pendingData: BookingData;
}>();
</script>
<template>
  <div class="mt-4 p-6 trip-info gap-x-4 gap-y-[18px]">
    <div class="space-y-2">
      <h5>{{ pendingData.tripData.company.name }}</h5>
      <p class="text-lg text-muted">{{ pendingData.tripData.seat_map.name }}</p>
    </div>
    <div class="flex row-span-3 items-center gap-4">
      <div class="border-l h-[125px]"></div>
      <div
        class="flex items-center gap-2 rounded-2xl overflow-hidden border border-gray-300 h-[160px] w-[200px]"
      >
        <img
          :src="pendingData.tripData.company.url_vehicle_online"
          alt="Xe"
          class="w-full object-cover"
        />
      </div>
    </div>
    <div class="grid grid-cols-[16px_auto] grid-rows-[24px_auto_auto] gap-x-3">
      <div
        class="size-4 my-1 border-2 bg-white border-black rounded-full"
      ></div>
      <div class="h-full border-timeline border-l ml-2 order-3"></div>
      <Icon name="fa6-solid:location-dot" class="order-4 size-4 my-1" />
      <div class="row-span-2">
        <span class="text-muted text-sm font-bold">Điểm đón</span>
        <div class="flex gap-2 items-center">
          <h6>
            {{
              calculateTotalTime(
                pendingData.pointUp.start_time,
                pendingData.pointUp.time_point
              )
            }}
          </h6>
          <p>{{ pendingData.pointUp.name }}</p>
        </div>
        <p class="text-muted text-sm">{{ pendingData.pointUp.address }}</p>
        <button class="text-sm text-primary underline">Thay đổi</button>
      </div>
      <div class="order-last">
        <span class="text-muted text-sm font-bold">Điểm trả</span>
        <div class="flex gap-2 items-center">
          <h6>
            {{
              calculateTotalTime(
                pendingData.pointDown.start_time,
                pendingData.pointDown.time_point
              )
            }}
          </h6>
          <p>{{ pendingData.pointDown.name }}</p>
        </div>
        <p class="text-muted text-sm">{{ pendingData.pointDown.address }}</p>
        <button class="text-sm text-primary underline">Thay đổi</button>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <Icon name="fa6-solid:user" />
      <p class="text-sm">
        Số lượng ghế:
        <span class="font-bold">{{ pendingData.selectedTicket.length }}</span>
      </p>
    </div>
  </div>
</template>

<style scoped>
.trip-info {
  display: grid;
  grid-template-columns: 1fr 240px;
}

@container (max-width: 600px) {
  .trip-info {
    display: flex;
    flex-direction: column;
  }
}
</style>
