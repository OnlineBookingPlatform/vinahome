<script setup lang="ts">
import SelectTrip_v2 from "~/components/select/SelectTrip_v2.vue";
import {
  Delete,
  LocationFilled,
  Place,
  Minus,
  Search,
  CaretRight,
} from "@element-plus/icons-vue";
import {
  type DetailTripType,
  type DTO_RP_TripInfo,
  type SearchTripParams,
} from "~/types/TripType";
import { ElMessage } from "element-plus";
import { getTripDeatil, getTripOnPlatform } from "~/api/tripAPI";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const tripData = ref<DTO_RP_TripInfo[]>([]);
const loading = ref(true);

onMounted(async () => {
  // Lấy params từ URL
  const { departureId, destinationId, departureDate, numberOfTickets } =
    route.query;

  console.log("Search params:", {
    departureId,
    destinationId,
    departureDate,
    numberOfTickets,
  });

  // Chuẩn bị params để gọi API
  const searchParams = {
    departureId: departureId ? Number(departureId) : null,
    destinationId: destinationId ? Number(destinationId) : null,
    departureDate: departureDate as string,
    numberOfTickets: numberOfTickets ? Number(numberOfTickets) : 1,
  };

  console.log("Formatted search params:", searchParams);

  loading.value = true;
  try {
    const response = await getTripOnPlatform(searchParams);
    console.log("API response:", response);

    if (response?.result) {
      tripData.value = response.result;
    } else {
      tripData.value = [];
      ElMessage.warning("Không tìm thấy chuyến đi phù hợp");
    }
  } catch (err) {
    console.error("Search error:", err);
    ElMessage.error("Có lỗi xảy ra khi tìm kiếm chuyến đi");
    tripData.value = [];
  } finally {
    loading.value = false;
  }
});

const valuePoint = ref(1);

const checked1 = ref(true);
const checked2 = ref(false);

const timeToSeconds = (timeStr: string): number => {
  if (!timeStr) return 0;
  const parts = timeStr.split(":").map((part) => parseInt(part) || 0);
  return parts[0] * 3600 + parts[1] * 60 + (parts[2] || 0);
};

// Chuyển đổi số giây thành chuỗi HH:MM
const secondsToTime = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600) % 24;
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
  ].join(":");
};

// Tính tổng 2 mốc thời gian
const calculateTotalTime = (time1: string, time2: string): string => {
  const totalSeconds = timeToSeconds(time1) + timeToSeconds(time2);
  return secondsToTime(totalSeconds);
};

const calculateDuration = (startTime: string, endTime: string): string => {
  const startSec = timeToSeconds(startTime);
  const endSec = timeToSeconds(endTime);

  const durationSec =
    endSec >= startSec ? endSec - startSec : 86400 - startSec + endSec;

  const hours = Math.floor(durationSec / 3600);
  const minutes = Math.floor((durationSec % 3600) / 60);

  return `${hours}h${minutes.toString().padStart(2, "0")}`;
};

const activeTabs = ref<Record<string, number | null>>({});
const tripDetail = ref<DetailTripType | null>(null);

const selectedTripId = ref<number | null>(null);
const selectedTicket = ref<SelectedTicket[]>([]);
const openTrip = async (tripId: number) => {
  if (selectedTripId.value !== null && selectedTripId.value !== tripId) {
    selectedTicket.value = [];
    activeTabs.value[String(selectedTripId.value)] = null;
  }

  (activeTabs.value as Record<number, number | null>)[tripId] = 1;
  selectedTripId.value = tripId;

  const response = await getTripDeatil(tripId);
  console.log("API response:", response.result);
  if (response.result) {
    tripDetail.value = response.result;
  }
};
const handleClick = async (tripId: number, tab: any) => {
  console.log("Tab được chọn:", tab.props.name);
  console.log(
    "activeTabs trước khi cập nhật:",
    activeTabs.value[String(tripId)]
  );
  if (tab.props.name === 1) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
    }
    await openTrip(tripId);
  } else if (tab.props.name === 2) {
    console.log("API response cho tab 2:");
  } else if (tab.props.name === 3) {
    console.log("API response cho tab 3:");
  } else if (tab.props.name === 4) {
    console.log("API response cho tab 4:");
  } else {
    activeTabs.value[tripId] =
      activeTabs.value[tripId] === tab.props.name ? null : tab.props.name;
    selectedTripId.value = tripId;
  }
};
const closeTrip = (tripId: number) => {
  activeTabs.value[tripId] = null;
  selectedTripId.value = null;
  tripDetail.value = null;

  selectedTicket.value = [];
};

const getFloors = computed(() => {
  if (!tripDetail.value) return [];
  const floors = new Set(
    tripDetail.value.tickets.map((ticket) => ticket.seat_floor)
  );
  return Array.from(floors).sort((a, b) => a - b);
});

const getRows = (floor: number) => {
  if (!tripDetail.value) return [];
  const rows = new Set(
    tripDetail.value.tickets
      .filter((ticket) => ticket.seat_floor === floor)
      .map((ticket) => ticket.seat_row)
  );
  return Array.from(rows).sort((a, b) => a - b);
};

const getColumns = computed(() => {
  if (!tripDetail.value) return [];
  const cols = new Set(
    tripDetail.value.tickets.map((ticket) => ticket.seat_column)
  );
  return Array.from(cols).sort((a, b) => a - b);
});

const getSeatName = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return "";
  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_name : "";
};

const getSeatStatus = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return false;
  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_status : false;
};
const getBasePrice = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return "0 ₫";

  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );

  if (!seat) return "0 ₫";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(seat.base_price);
};

interface SelectedTicket {
  id: number;
  seat_name: string;
  price: number;
}

const toggleSeatSelection = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return;

  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );

  if (!seat) return;

  const index = selectedTicket.value.findIndex((s) => s.id === seat.id);
  if (index !== -1) {
    selectedTicket.value.splice(index, 1); // Bỏ chọn nếu đã chọn trước đó
  } else {
    selectedTicket.value.push({
      id: seat.id,
      seat_name: seat.seat_name,
      price: seat.base_price,
    });
  }
  console.log("Danh sách vé đã chọn:", selectedTicket.value);
};

const totalPrice = computed(() => {
  const total = selectedTicket.value.reduce((sum, seat) => sum + seat.price, 0);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(total);
});

const getButtonClass = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return "";

  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );

  return seat && selectedTicket.value.some((s) => s.id === seat.id)
    ? "bg-green-500 text-white"
    : "";
};
const isSeatSelected = (floor: number, row: number, col: number) => {
  if (!tripDetail.value) return false;
  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat && selectedTicket.value.some((s) => s.id === seat.id);
};
const activeStep = ref(0);

watch(
  () => selectedTicket.value.length,
  (newLength) => {
    activeStep.value = newLength > 0 ? 1 : 0;
  }
);

const selectedStep = ref(1);
const nextStep = () => {
  selectedStep.value = 2;
  activeStep.value = 1;
};
const preStep = () => {
  selectedStep.value = 1;
  activeStep.value = 1;
};

const value = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1",
  },
  {
    value: "Option2",
    label: "Option2",
  },
  {
    value: "Option3",
    label: "Option3",
  },
  {
    value: "Option4",
    label: "Option4",
  },
  {
    value: "Option5",
    label: "Option5",
  },
];
</script>

<template>
  <section class="container mx-auto mt-10 mb-16">
    <div class="flex justify-center items-center">
      <SelectTrip_v2 />
    </div>
    <div class="mt-16">
      <el-row :gutter="20" class="mb-10">
        <el-col :span="7">
          <div class="p-4 bg-white rounded-2xl">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-lg">BỘ LỌC TÌM KIẾM</h2>
              <el-button type="danger" text>
                Bỏ lọc <el-icon class="el-icon--right"><Delete /></el-icon>
              </el-button>
            </div>

            <el-collapse accordion>
              <el-collapse-item title="Consistency" name="1">
                <template #title>
                  <span class="font-semibold text-lg"> Giờ đi </span>
                </template>
                <div class="flex flex-col px-4">
                  <el-checkbox
                    v-model="checked1"
                    label="00:00 - 06:00"
                    size="large"
                  />
                  <el-checkbox
                    v-model="checked2"
                    label="06:00 - 12:00"
                    size="large"
                  />
                  <el-checkbox
                    v-model="checked2"
                    label="12:00 - 18:00"
                    size="large"
                  />
                  <el-checkbox
                    v-model="checked2"
                    label="18:00 - 24:00"
                    size="large"
                  />
                </div>
                <div></div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title>
                  <span class="font-semibold text-lg"> Nhà xe </span>
                </template>
                <div></div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template #title>
                  <span class="font-semibold text-lg"> Giá vé </span>
                </template>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template #title>
                  <span class="font-semibold text-lg"> Loại xe </span>
                </template>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template #title>
                  <span class="font-semibold text-lg"> Đánh giá </span>
                </template>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-col>
        <el-col :span="17">
          <h2 class="text-lg font-semibold mb-4">Danh sách chuyến đi</h2>
          <div v-if="loading" class="loading-container">
            <el-skeleton :rows="5" animated />
          </div>
          <div v-else class="flex flex-col gap-4">
            <div
              v-for="trip in tripData"
              :key="trip.id"
              :class="[
                'trip-card rounded-2xl bg-white pt-4',
                selectedTripId === trip.id
                  ? 'border-[#03ACFF] border-[3px]'
                  : '',
              ]"
              :loading="loading"
            >
              <div class="flex justify-between mx-4">
                <!-- Ảnh -->
                <div
                  class="flex items-center gap-2 rounded overflow-hidden border border-gray-300 h-[140px] w-[200px]"
                >
                  <img
                    src="/static/a2.png"
                    class="h-full w-full object-cover"
                  />
                </div>
                <!-- Thông tin chuyến đi -->
                <div class="w-full ml-4">
                  <div class="flex">
                    <div class="text-sm flex flex-col">
                      <div class="flex items-center gap-4">
                        <span class="text-[20px] font-semibold">{{
                          trip.company.name
                        }}</span>
                        <div class="px-2">
                          <el-rate
                            v-model="valuePoint"
                            disabled
                            show-score
                            text-color="#ff9900"
                            score-template="{value}"
                          />
                        </div>
                      </div>
                      <span class="text-[#909295] mt-2">{{
                        trip.seat_map.name
                      }}</span>
                    </div>
                    <div class="ml-auto flex flex-col text-right">
                      <span class="text-xl font-bold text-red-500">
                        {{
                          Number(trip.route.base_price).toLocaleString("vi-VN")
                        }}đ
                      </span>
                      <div class="flex gap-1">
                        <span class="line-through text-gray-500">
                          {{
                            Number(trip.route.base_price).toLocaleString(
                              "vi-VN"
                            )
                          }}đ
                        </span>
                        <div class="bg-red-500 px-[2px] rounded">
                          <span class="text-sm text-white items-center"
                            >-10%</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="flex text-base font-medium my-1">
                    <div class="flex flex-col">
                      <div class="flex items-center gap-2">
                        <el-icon :style="{ color: 'red', fontSize: '1.5rem' }"
                          ><Place
                        /></el-icon>
                        <span class="text-black text-xl w-16 text-center">
                          {{
                            calculateTotalTime(
                              trip.time_departure,
                              trip.departureInfo.time
                            )
                          }}
                        </span>
                        <el-icon style="color: #99a9bf"><CaretRight /></el-icon>
                        <span class="text-black text-md">{{
                          trip.departureInfo.pointName
                        }}</span>
                      </div>
                      <div class="py-[1px] flex items-center gap-2">
                        <el-icon
                          :style="{
                            fontSize: '1.5rem',
                            transform: 'rotate(90deg)',
                            color: '#909295',
                          }"
                          ><Minus
                        /></el-icon>
                        <span class="text-sm text-gray-500 mx-2">
                          {{
                            calculateDuration(
                              calculateTotalTime(
                                trip.time_departure,
                                trip.departureInfo.time
                              ),
                              calculateTotalTime(
                                trip.time_departure,
                                trip.destinationInfo.time
                              )
                            )
                          }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2">
                        <el-icon
                          :style="{ color: '#3B82F6', fontSize: '1.5rem' }"
                          ><LocationFilled
                        /></el-icon>
                        <span class="text-black text-xl w-16 text-center">
                          {{
                            calculateTotalTime(
                              trip.time_departure,
                              trip.destinationInfo.time
                            )
                          }}
                        </span>
                        <el-icon style="color: #99a9bf"><CaretRight /></el-icon>
                        <span class="text-black text-md">
                          {{ trip.destinationInfo.pointName }}</span
                        >
                      </div>
                    </div>
                    <!-- <div class="ml-5">
                      <ul>
                        <li>
                          <div class="flex items-center gap-2">
                            <el-icon style="color: #108AB1"><Check /></el-icon>
                            <span class="text-sm text-gray-500">Xác nhận tức thì</span>
                          </div>
                        </li>
                        <li>
                          <div class="flex items-center gap-2">
                            <el-icon style="color: #108AB1"><Check /></el-icon>
                            <span class="text-sm text-gray-500">Không cần thanh toán trước</span>
                          </div>
                        </li>
                      </ul>
                    </div> -->
                    <div
                      class="text-white px-3 py-1 rounded ml-auto flex items-end"
                    >
                      <span class="text-amber-600 text-md"
                        >Còn 24 chỗ trống</span
                      >
                    </div>
                  </div>
                </div>
              </div>

              <!-- Tabs -->
              <div class="relative">
                <el-divider />

                <el-button
                  v-if="!activeTabs[trip.id]"
                  type="primary"
                  round
                  class="absolute bottom-[-35px] right-4 z-10 mt-[3px]"
                  @click="openTrip(trip.id)"
                >
                  <span class="mx-2">Chọn chuyến</span>
                </el-button>
                <el-button
                  v-else
                  type="danger"
                  round
                  class="absolute bottom-[-35px] right-4 z-10 mt-[3px]"
                  @click="closeTrip(trip.id)"
                >
                  <span class="mx-2">Đóng</span>
                </el-button>
              </div>

              <el-tabs
                v-model="activeTabs[trip.id]"
                class="demo-tabs relative z-0"
                @tab-click="
                  (tab: any): void => {
                    handleClick(trip.id, tab);
                  }
                "
              >
                <el-tab-pane label="Chọn ghế" :name="1" class="">
                  <div class="mt-5 items-center">
                    <el-steps
                      :active="activeStep"
                      align-center
                      finish-status="success"
                    >
                      <el-step title="Chỗ mong muốn" />
                      <el-step title="Điểm đón/trả" />
                    </el-steps>
                  </div>
                  <div v-if="selectedStep === 1">
                    <el-row>
                      <el-col :span="8">
                        <div
                          class="flex flex-col mt-5 mx-4 bg-[#f5f5f5] rounded-xl p-2"
                        >
                          <span class="text-base font-semibold">Chú thích</span>
                          <div class="mt-3">
                            <el-button circle class="mx-2"></el-button>
                            Còn trống
                          </div>
                          <div class="mt-3">
                            <el-button
                              circle
                              class="mx-2"
                              type="info"
                            ></el-button>
                            Đã đặt
                          </div>
                          <div class="mt-3">
                            <el-button
                              circle
                              class="mx-2"
                              type="warning"
                            ></el-button>
                            Không bán
                          </div>
                        </div>
                      </el-col>
                      <el-col :span="16" class="flex justify-center">
                        <div
                          v-if="tripDetail"
                          class="flex flex-wrap justify-center gap-8 mb-5 mt-5"
                        >
                          <div
                            v-for="floor in getFloors"
                            :key="floor"
                            class="flex flex-col items-center"
                          >
                            <h3 class="text-base">Tầng {{ floor }}</h3>
                            <div
                              class="flex flex-col bg-[#f5f5f5] rounded-xl p-2"
                            >
                              <div
                                v-for="row in getRows(floor)"
                                :key="row"
                                style="display: flex"
                              >
                                <div
                                  v-for="col in getColumns"
                                  :key="col"
                                  style="margin: 5px"
                                  class=""
                                >
                                  <el-tooltip
                                    :content="
                                      'Số ghế: ' +
                                      getSeatName(floor, row, col) +
                                      ' -  Giá:' +
                                      ' ' +
                                      getBasePrice(floor, row, col)
                                    "
                                    placement="top"
                                  >
                                    <el-button
                                      circle
                                      size="large"
                                      class="mx-2"
                                      :class="getButtonClass(floor, row, col)"
                                      :type="
                                        isSeatSelected(floor, row, col)
                                          ? 'danger'
                                          : ''
                                      "
                                      @click="
                                        toggleSeatSelection(floor, row, col)
                                      "
                                      >{{
                                        getSeatName(floor, row, col)
                                      }}</el-button
                                    >
                                  </el-tooltip>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div v-else>
                          <el-skeleton :rows="5" animated />
                        </div>
                        <!-- <div v-else>Loading seat map...</div> -->
                      </el-col>
                    </el-row>
                  </div>
                  <div v-if="selectedStep === 2">
                    <el-row class="mx-10">
                      <el-col :span="12">
                        <div class="rounded-xl bg-gray-100 p-4 m-2 mt-5">
                          <span>Thông tin điểm đón</span>
                          <el-select
                            v-model="value"
                            class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>

                        </div>
                      </el-col>
                      <el-col :span="12">
                        <div class="bg-gray-100 rounded-xl p-4 m-2 mt-5">
                          <span>Thông tin điểm trả</span>
                          <el-select
                            v-model="value"
                            class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          >
                            <el-option
                              v-for="item in options"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value"
                            />
                          </el-select>
                        </div>
                      </el-col>
                    </el-row>
                  </div>
                  <div class="w-full bg-[#4D5054] rounded-b-[14px] px-5">
                    <div class="flex justify-between items-center py-2">
                      <div class="text-white flex justify-center items-center">
                        <el-button
                          color="#fff"
                          @click="preStep"
                          v-if="selectedStep === 2"
                          class="mr-5"
                        >
                          Quay lại
                        </el-button>
                        <span>
                          Ghế:
                          {{
                            selectedTicket.map((s) => s.seat_name).join(", ")
                          }}
                        </span>
                      </div>
                      <div>
                        <span class="text-white text-sm mr-5"
                          >Tổng cộng: {{ totalPrice }}</span
                        >
                        <el-button color="#fff" @click="nextStep"
                          >Tiếp tục</el-button
                        >
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Lịch trình" :name="2">
                  <div class="p-4">
                    Đón/ trả tận nơi: - Thời gian nhận khách : Trước 4 tiếng. -
                    Thời gian xe đón : Chuẩn bị trước 2 -3 tiếng, do mật độ giao
                    thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau
                    nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ. - Hẻm
                    nhỏ xe không quay đầu được : Xe trung chuyển sẽ đón Khách
                    đầu hẻm/ đầu đường. - Khu vực có biển cấm dừng đỗ xe không
                    đón được : Xe trung chuyển sẽ đón tại vị trí gần nhất có
                    thể. - Hành lý : Hành lý nhỏ gọn dưới 20 kg, không vận
                    chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ
                    chảy nước trên xe.nn
                  </div></el-tab-pane
                >
                <el-tab-pane label="Trung chuyển" :name="3">
                  <div class="p-4">
                    Đón/ trả tận nơi: - Thời gian nhận khách : Trước 4 tiếng. -
                    Thời gian xe đón : Chuẩn bị trước 2 -3 tiếng, do mật độ giao
                    thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau
                    nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ. - Hẻm
                    nhỏ xe không quay đầu được : Xe trung chuyển sẽ đón Khách
                    đầu hẻm/ đầu đường. - Khu vực có biển cấm dừng đỗ xe không
                    đón được : Xe trung chuyển sẽ đón tại vị trí gần nhất có
                    thể. - Hành lý : Hành lý nhỏ gọn dưới 20 kg, không vận
                    chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ
                    chảy nước trên xe.nn
                  </div>
                </el-tab-pane>
                <el-tab-pane label="Chính sách" :name="4">
                  <div class="p-4">
                    Đón/ trả tận nơi: - Thời gian nhận khách : Trước 4 tiếng. -
                    Thời gian xe đón : Chuẩn bị trước 2 -3 tiếng, do mật độ giao
                    thông trong thành phố và sẽ kết hợp đón nhiều điểm khác nhau
                    nên thời gian đón cụ thể tài xế sẽ liên hệ hẹn giờ. - Hẻm
                    nhỏ xe không quay đầu được : Xe trung chuyển sẽ đón Khách
                    đầu hẻm/ đầu đường. - Khu vực có biển cấm dừng đỗ xe không
                    đón được : Xe trung chuyển sẽ đón tại vị trí gần nhất có
                    thể. - Hành lý : Hành lý nhỏ gọn dưới 20 kg, không vận
                    chuyển kèm động vật , thú cưng, không mang đồ có mùi, đồ
                    chảy nước trên xe.nn
                  </div></el-tab-pane
                >
              </el-tabs>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
  </section>
</template>

<style>
.el-tabs__nav {
  float: left !important;
}
.el-tabs__nav-wrap:after {
  background-color: #fff !important;
}
.el-tabs__header {
  padding: 0 !important;
  margin: 0 !important;
}
.el-collapse-item__content {
  padding-bottom: 10px !important;
}
.el-checkbox.el-checkbox--large .el-checkbox__label {
  font-size: 15px !important;
}
.el-tabs__nav-scroll {
  margin-left: 10px !important;
  margin-right: 10px !important;
}
.el-tabs__nav-wrap:after {
  height: 0 !important;
}
.el-divider--horizontal {
  margin: 0 !important;
  margin-top: 10px !important;
}
.el-select__selected-item{
  margin-left: 10px;
} 

</style>
