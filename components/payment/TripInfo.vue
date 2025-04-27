<script setup lang="ts">
import { ElMessage } from "element-plus";
import { getPointDownByTrip, getPointUpByTrip } from "~/api/tripAPI";
import { calculateTotalTime } from "~/lib/libTime";
import type { BookingData } from "~/types/PendingType";
import type { TripPointType } from "~/types/PointType";

const props = defineProps<{
  pendingData: BookingData;
  pointUp: TripPointType | null;
  pointDown: TripPointType | null;
}>();
// State quản lý điểm
const valuePointUp = ref<TripPointType | null>(null);
const valuePointDown = ref<TripPointType | null>(null);
const optionsPointDown = ref<TripPointType[]>([]);
const optionsPointUp = ref<TripPointType[]>([]);

// State quản lý dialog
const dialogVisible = ref(false);
const dialogTitle = ref('');
const isEditingPointUp = ref(true);

// Biến tạm để chỉnh sửa
const tempPointUp = ref<TripPointType | null>(null);
const tempPointDown = ref<TripPointType | null>(null);

const openEditPointDialog = (isPointUp: boolean) => {
  isEditingPointUp.value = isPointUp;
  dialogTitle.value = isPointUp ? 'Thay đổi điểm đón' : 'Thay đổi điểm trả';

  // Copy giá trị hiện tại vào biến tạm từ props
  // tempPointUp.value = pointUp ? { ...pointUp } : null;
  // tempPointDown.value = pointDown ? { ...pointDown } : null;

  dialogVisible.value = true;
};

const confirmChanges = () => {
  if (isEditingPointUp.value && tempPointUp.value) {
    valuePointUp.value = tempPointUp.value;
  } else if (!isEditingPointUp.value && tempPointDown.value) {
    valuePointDown.value = tempPointDown.value;
  }

  dialogVisible.value = false;
};

const handleClose = () => {
  dialogVisible.value = false;
};

const fetchPointUpOptions = async () => {
  try {
    const response = await getPointUpByTrip(props.pendingData.tripData.id);
    optionsPointUp.value = response.result || [];
  } catch (error) {
    console.error("Lỗi khi lấy thông tin điểm đón:", error);
    ElMessage.error("Có lỗi xảy ra khi lấy thông tin điểm đón. Vui lòng thử lại sau.");
  }
};

const fetchPointDownOptions = async () => {
  try {
    const response = await getPointDownByTrip(props.pendingData.tripData.id);
    optionsPointDown.value = response.result || [];
  } catch (error) {
    console.error("Lỗi khi lấy thông tin điểm đón:", error);
    ElMessage.error("Có lỗi xảy ra khi lấy thông tin điểm đón. Vui lòng thử lại sau.");
  }
};

onMounted(() => {
  fetchPointUpOptions();
  fetchPointDownOptions();
});


</script>
<template>
  <div class="mt-4 p-6 trip-info gap-x-4 gap-y-[18px]">
    <div class="space-y-2">
      <h5>{{ pendingData.tripData.company.name }}</h5>
      <p class="text-lg text-muted">{{ pendingData.tripData.seat_map.name }}</p>
    </div>
    <div class="flex row-span-3 items-center gap-4">
      <div class="border-l h-[125px]"></div>
      <div class="flex items-center gap-2 rounded-2xl overflow-hidden border border-gray-300 h-[160px] w-[200px]">
        <img :src="pendingData.tripData.company.url_vehicle_online" alt="Xe" class="w-full object-cover" />
      </div>
    </div>
    <div class="grid grid-cols-[16px_auto] grid-rows-[24px_auto_auto] gap-x-3">
      <div class="size-4 my-1 border-2 bg-white border-black rounded-full"></div>
      <div class="h-full border-timeline border-l ml-2 order-3"></div>
      <Icon name="fa6-solid:location-dot" class="order-4 size-4 my-1" />
      <div class="row-span-2">
        <span class="text-muted text-sm font-bold">Điểm đón</span>
        <div class="flex gap-2 items-center">
          <h6>
            {{
              calculateTotalTime(
                pointUp?.start_time || "",
                pointUp?.time_point || ""
              )
            }}
          </h6>
          <p>{{ pointUp?.name }}</p>
        </div>
        <p class="text-muted text-sm">{{ pointUp?.address }}</p>
        <button class="text-sm text-primary underline" @click="openEditPointDialog(true)">Thay đổi</button>
      </div>
      <div class="order-last">
        <span class="text-muted text-sm font-bold">Điểm trả</span>
        <div class="flex gap-2 items-center">
          <h6>
            {{
              calculateTotalTime(
                pointDown?.start_time || "",
                pointDown?.time_point || ""
              )
            }}
          </h6>
          <p>{{ pointDown?.name }}</p>
        </div>
        <p class="text-muted text-sm">{{ pointDown?.address }}</p>
        <button class="text-sm text-primary underline" @click="openEditPointDialog(false)">Thay đổi</button>
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
  <!-- Form thay đổi thông điểm đi/điểm đến -->
  <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500" :before-close="handleClose">
    <div v-if="isEditingPointUp" class="px-2">
      <el-radio-group v-model="tempPointUp" class="flex flex-col items-start gap-4">
        <el-radio v-for="item in optionsPointUp" :key="item.id" :label="item">
          <div class="flex flex-col">
            <span class="text-[15px]">{{ calculateTotalTime(item.start_time, item.time_point) }} - {{ item.name }}</span>
            <span class="text-sm font-normal">Địa chỉ: {{ item.address }}</span>
          </div>
        </el-radio>
      </el-radio-group>
    </div>


    <div v-else class="px-2">
      <el-radio-group v-model="tempPointDown" class="flex flex-col items-start gap-4">
        <el-radio v-for="item in optionsPointDown" :key="item.id" :label="item">
          <div class="flex flex-col">
            <span class="text-[15px]">{{ calculateTotalTime(item.start_time, item.time_point) }} - {{ item.name }}</span>
            <span class="text-sm font-normal">Địa chỉ: {{ item.address }}</span>
          </div>
        </el-radio>
      </el-radio-group>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">Hủy</el-button>
        <el-button type="primary" @click="confirmChanges" :disabled="isEditingPointUp ? !tempPointUp : !tempPointDown">
          Xác nhận
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.trip-info {
  display: grid;
  grid-template-columns: 1fr 240px;
}
.el-radio-group{
  align-items: flex-start;
}
@container (max-width: 600px) {
  .trip-info {
    display: flex;
    flex-direction: column;
  }
}
</style>
