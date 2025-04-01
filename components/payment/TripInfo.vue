<script setup lang="ts">
interface TripInfo {
  destination: string;
  bus: string;
  pickupInfo: {
    time: string;
    locationName: string;
    address: string;
  }
  returnInfo: {
    time: string;
    locationName: string;
    address: string;
  };
  seats: number;
}
defineProps<{ tripInfo: TripInfo }>()
</script>
<template>
  <div class="mt-4 p-6 grid grid-cols-[1fr_240px] gap-x-4 gap-y-[18px]">
    <div class="space-y-2">
      <h5>{{ tripInfo.destination }}</h5>
      <p class="text-lg text-muted">{{ tripInfo.bus }}</p>
    </div>
    <div class="flex row-span-3 items-center gap-4">
      <div class="border-l h-[125px]"></div>
      <div class="rounded-2xl overflow-hidden">
        <img class="size-full object-cover" src="https://placehold.co/200x160" alt="">
      </div>
    </div>
    <div class="grid grid-cols-[16px_auto] grid-rows-[24px_auto_auto] gap-x-3">
      <div class="size-4 my-1 border-2 bg-white border-black rounded-full"></div>
      <div class="h-full border-timeline border-l ml-2 order-3"></div>
      <Icon name="fa6-solid:location-dot" class="order-4 size-4 my-1" />
      <div class="row-span-2">
        <span class="text-muted text-sm font-bold">Điểm đón</span>
        <div class="flex gap-2 items-center">
          <h6>{{ tripInfo.pickupInfo.time }}</h6>
          <p>{{ tripInfo.pickupInfo.locationName }}</p>
        </div>
        <p class="text-muted text-sm">{{ tripInfo.pickupInfo.address }}</p>
        <button class="text-sm text-primary underline">Thay đổi</button>
      </div>
      <div class="order-last">
        <span class="text-muted text-sm font-bold">Điểm trả</span>
        <div class="flex gap-2 items-center">
          <h6>{{ tripInfo.returnInfo.time }}</h6>
          <p>{{ tripInfo.returnInfo.locationName }}</p>
        </div>
        <p class="text-muted text-sm">{{ tripInfo.returnInfo.address }}</p>
        <button class="text-sm text-primary underline">Thay đổi</button>
      </div>
    </div>
  </div>
</template>