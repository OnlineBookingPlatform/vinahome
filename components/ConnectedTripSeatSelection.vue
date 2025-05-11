<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import type { ConnectedTripType } from '~/types/TripType';
import type { TicketType } from '~/types/TicketType';
import type { SelectedTicket } from '~/types/PendingType';
import { getTripDetail } from '~/api/tripAPI';

const props = defineProps<{
  connectedTrip: ConnectedTripType
}>();

const emit = defineEmits<{
  proceed: [firstTripTickets: SelectedTicket[], secondTripTickets: SelectedTicket[]]
}>();

// Trip details for both trips
const firstTripDetail = ref<any>(null);
const secondTripDetail = ref<any>(null);

// Selected tickets for both trips
const selectedFirstTripTickets = ref<SelectedTicket[]>([]);
const selectedSecondTripTickets = ref<SelectedTicket[]>([]);

// Loading states
const loadingFirstTrip = ref(true);
const loadingSecondTrip = ref(true);

// Active tab for each trip
const firstTripActiveTab = ref(1);
const secondTripActiveTab = ref(1);

// Fetch trip details
const fetchTripDetails = async () => {
  try {
    // Reset seat selections when fetching new trip details
    selectedFirstTripTickets.value = [];
    selectedSecondTripTickets.value = [];
    
    // Fetch first trip details
    loadingFirstTrip.value = true;
    const firstResponse = await getTripDetail(props.connectedTrip.firstTrip.id);
    if (firstResponse.result) {
      firstTripDetail.value = firstResponse.result;
      console.log("First trip details:", firstTripDetail.value);
    } else {
      console.error("No result in first trip response");
      ElMessage.error("Không thể tải thông tin chuyến đi đầu tiên");
    }
    loadingFirstTrip.value = false;
    
    // Fetch second trip details
    loadingSecondTrip.value = true;
    const secondResponse = await getTripDetail(props.connectedTrip.secondTrip.id);
    if (secondResponse.result) {
      secondTripDetail.value = secondResponse.result;
      console.log("Second trip details:", secondTripDetail.value);
    } else {
      console.error("No result in second trip response");
      ElMessage.error("Không thể tải thông tin chuyến đi thứ hai");
    }
    loadingSecondTrip.value = false;
  } catch (error) {
    console.error("Error fetching trip details:", error);
    ElMessage.error("Lỗi khi tải thông tin chuyến đi. Vui lòng thử lại sau.");
    loadingFirstTrip.value = false;
    loadingSecondTrip.value = false;
  }
};

// Formatted date
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// Seat handling functions for first trip
const getFirstTripFloors = computed(() => {
  if (!firstTripDetail.value?.tickets) return [];
  return [...new Set(firstTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_floor))];
});

const getFirstTripRows = (floor: number) => {
  if (!firstTripDetail.value?.tickets) return [];
  return [...new Set(
    firstTripDetail.value.tickets
      .filter((ticket: TicketType) => ticket.seat_floor === floor)
      .map((ticket: TicketType) => ticket.seat_row)
  )];
};

const getFirstTripColumns = computed(() => {
  if (!firstTripDetail.value?.tickets) return [];
  return [...new Set(firstTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_column))];
});

const getFirstTripSeatName = (floor: number, row: number, col: number) => {
  if (!firstTripDetail.value?.tickets) return "";
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_name : "";
};

const getFirstTripSeatPrice = (floor: number, row: number, col: number) => {
  if (!firstTripDetail.value?.tickets) return "0 ₫";
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  if (!seat) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(seat.base_price);
};

const getFirstTripSeatStatus = (floor: number, row: number, col: number): boolean => {
  if (!firstTripDetail.value?.tickets) return false;
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat?.status_booking_ticket ?? false;
};

const toggleFirstTripSeatSelection = (floor: number, row: number, col: number) => {
  if (!firstTripDetail.value?.tickets) return;
  
  // If we're dealing with a "remove" action (special case with 0,0,0)
  if (floor === 0 && row === 0 && col === 0) {
    // Simply remove the last ticket in the selected tickets array
    if (selectedFirstTripTickets.value.length > 0) {
      selectedFirstTripTickets.value.pop();
    }
    return;
  }
  
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  
  if (!seat) return;

  const index = selectedFirstTripTickets.value.findIndex((s) => s.id === seat.id);
  if (index !== -1) {
    selectedFirstTripTickets.value.splice(index, 1);
  } else {
    selectedFirstTripTickets.value.push({
      id: seat.id,
      seat_name: seat.seat_name,
      price: seat.base_price,
    });
  }
};

const getFirstTripButtonClass = (floor: number, row: number, col: number) => {
  if (getFirstTripSeatStatus(floor, row, col)) {
    return "bg-gray-300 text-gray-500 cursor-not-allowed";
  }
  return isFirstTripSeatSelected(floor, row, col)
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-white text-blue-600 hover:bg-blue-50";
};

const isFirstTripSeatSelected = (floor: number, row: number, col: number) => {
  if (!firstTripDetail.value?.tickets) return false;
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat && selectedFirstTripTickets.value.some((s) => s.id === seat.id);
};

// Seat handling functions for second trip
const getSecondTripFloors = computed(() => {
  if (!secondTripDetail.value?.tickets) return [];
  return [...new Set(secondTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_floor))];
});

const getSecondTripRows = (floor: number) => {
  if (!secondTripDetail.value?.tickets) return [];
  return [...new Set(
    secondTripDetail.value.tickets
      .filter((ticket: TicketType) => ticket.seat_floor === floor)
      .map((ticket: TicketType) => ticket.seat_row)
  )];
};

const getSecondTripColumns = computed(() => {
  if (!secondTripDetail.value?.tickets) return [];
  return [...new Set(secondTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_column))];
});

const getSecondTripSeatName = (floor: number, row: number, col: number) => {
  if (!secondTripDetail.value?.tickets) return "";
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_name : "";
};

const getSecondTripSeatPrice = (floor: number, row: number, col: number) => {
  if (!secondTripDetail.value?.tickets) return "0 ₫";
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  if (!seat) return "0 ₫";
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(seat.base_price);
};

const getSecondTripSeatStatus = (floor: number, row: number, col: number): boolean => {
  if (!secondTripDetail.value?.tickets) return false;
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat?.status_booking_ticket ?? false;
};

const toggleSecondTripSeatSelection = (floor: number, row: number, col: number) => {
  if (!secondTripDetail.value?.tickets) return;
  
  // If we're dealing with a "remove" action (special case with 0,0,0)
  if (floor === 0 && row === 0 && col === 0) {
    // Simply remove the last ticket in the selected tickets array
    if (selectedSecondTripTickets.value.length > 0) {
      selectedSecondTripTickets.value.pop();
    }
    return;
  }
  
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  
  if (!seat) return;

  const index = selectedSecondTripTickets.value.findIndex((s) => s.id === seat.id);
  if (index !== -1) {
    selectedSecondTripTickets.value.splice(index, 1);
  } else {
    selectedSecondTripTickets.value.push({
      id: seat.id,
      seat_name: seat.seat_name,
      price: seat.base_price,
    });
  }
};

const getSecondTripButtonClass = (floor: number, row: number, col: number) => {
  if (getSecondTripSeatStatus(floor, row, col)) {
    return "bg-gray-300 text-gray-500 cursor-not-allowed";
  }
  return isSecondTripSeatSelected(floor, row, col)
    ? "bg-blue-600 text-white hover:bg-blue-700"
    : "bg-white text-blue-600 hover:bg-blue-50";
};

const isSecondTripSeatSelected = (floor: number, row: number, col: number) => {
  if (!secondTripDetail.value?.tickets) return false;
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat && selectedSecondTripTickets.value.some((s) => s.id === seat.id);
};

// Calculate totals
const firstTripTotal = computed(() => {
  return selectedFirstTripTickets.value.reduce((sum, seat) => sum + seat.price, 0);
});

const secondTripTotal = computed(() => {
  return selectedSecondTripTickets.value.reduce((sum, seat) => sum + seat.price, 0);
});

const totalPrice = computed(() => {
  return firstTripTotal.value + secondTripTotal.value;
});

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Check if can proceed
const canProceed = computed(() => {
  return selectedFirstTripTickets.value.length > 0 && selectedSecondTripTickets.value.length > 0;
});

// Handle proceed button
const handleProceed = () => {
  if (canProceed.value) {
    emit('proceed', selectedFirstTripTickets.value, selectedSecondTripTickets.value);
  } else {
    ElMessage.warning('Vui lòng chọn ghế cho cả hai chuyến đi');
  }
};

onMounted(() => {
  fetchTripDetails();
});
</script>

<template>
  <div class="connected-trip-seat-selection bg-gray-50 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-4 text-center text-blue-700">Chọn chỗ ngồi cho chuyến đi</h2>
    
    <!-- Connection information -->
    <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-blue-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Thông tin chuyến nối
        </h3>
        <div class="text-blue-700 font-medium">
          Thời gian chờ: {{ props.connectedTrip.waitingTime }}
        </div>
      </div>
      <div class="flex items-center text-gray-700">
        <div class="font-medium">Điểm chuyển tiếp:</div>
        <div class="ml-2">{{ props.connectedTrip.connectionPoint.pointName }} ({{ props.connectedTrip.connectionPoint.province.name }})</div>
      </div>
      <div class="mt-2 text-gray-700 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        <span class="text-sm">Vui lòng chọn ghế cho cả hai chuyến đi</span>
      </div>
    </div>

    <!-- Dual seat selection panels -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- First Trip Seat Selection -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-600 p-4 text-white">
          <h3 class="font-bold text-lg">Chuyến 1</h3>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center">
              <img :src="props.connectedTrip.firstTrip.company.urlLogo" class="h-8 w-8 object-contain mr-2" alt="Company logo" />
              <div>{{ props.connectedTrip.firstTrip.company.name }}</div>
            </div>
            <div>{{ formatDate(props.connectedTrip.firstTrip.dateDeparture) }}</div>
          </div>
          <div class="mt-2 text-sm">
            {{ props.connectedTrip.firstTrip.departureInfo.pointName }} → {{ props.connectedTrip.firstTrip.destinationInfo.pointName }}
          </div>
        </div>

        <div v-if="loadingFirstTrip" class="p-8 text-center">
          <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-2 text-gray-600">Đang tải thông tin ghế...</p>
        </div>

        <div v-else-if="!firstTripDetail" class="p-8 text-center text-red-600">
          <p>Không thể tải thông tin ghế. Vui lòng thử lại sau.</p>
        </div>

        <div v-else class="p-4">
          <!-- First Trip Tabs -->
          <div class="mb-4 border-b border-gray-200">
            <div class="flex -mb-px">
              <button
                v-for="floor in getFirstTripFloors"
                :key="'first-floor-' + floor"
                @click="firstTripActiveTab = floor"
                class="px-4 py-2 font-medium text-sm mr-2"
                :class="firstTripActiveTab === floor ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              >
                Tầng {{ floor }}
              </button>
            </div>
          </div>

          <!-- First Trip Seat Grid -->
          <div v-for="floor in getFirstTripFloors" :key="'first-floor-content-' + floor" v-show="firstTripActiveTab === floor">
            <div class="mb-6">
              <div class="grid grid-cols-5 gap-2">
                <template v-for="row in getFirstTripRows(floor)" :key="'first-row-' + row">
                  <template v-for="col in getFirstTripColumns" :key="'first-col-' + col">
                    <button
                      v-if="getFirstTripSeatName(floor, row, col)"
                      :disabled="getFirstTripSeatStatus(floor, row, col)"
                      :class="getFirstTripButtonClass(floor, row, col)"
                      class="p-2 rounded-md text-center transition-colors border border-gray-200 shadow-sm"
                      @click="toggleFirstTripSeatSelection(floor, row, col)"
                    >
                      {{ getFirstTripSeatName(floor, row, col) }}
                      <div class="text-xs mt-1">{{ getFirstTripSeatPrice(floor, row, col) }}</div>
                    </button>
                    <div v-else class="p-2"></div>
                  </template>
                </template>
              </div>
            </div>
          </div>

          <!-- First Trip Selected Seats -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-gray-700 mb-2">Ghế đã chọn:</div>
            <div v-if="selectedFirstTripTickets.length === 0" class="text-gray-500 text-sm">
              Chưa chọn ghế nào
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <div
                v-for="ticket in selectedFirstTripTickets"
                :key="'first-selected-' + ticket.id"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
              >
                {{ ticket.seat_name }}
                <button
                  @click="toggleFirstTripSeatSelection(0, 0, 0)" 
                  class="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label="Bỏ chọn ghế"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-2 font-semibold text-right">
              Tổng tiền: {{ formatCurrency(firstTripTotal) }}
            </div>
          </div>
        </div>
      </div>

      <!-- Second Trip Seat Selection -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="bg-blue-600 p-4 text-white">
          <h3 class="font-bold text-lg">Chuyến 2</h3>
          <div class="flex items-center justify-between mt-2">
            <div class="flex items-center">
              <img :src="props.connectedTrip.secondTrip.company.urlLogo" class="h-8 w-8 object-contain mr-2" alt="Company logo" />
              <div>{{ props.connectedTrip.secondTrip.company.name }}</div>
            </div>
            <div>{{ formatDate(props.connectedTrip.secondTrip.dateDeparture) }}</div>
          </div>
          <div class="mt-2 text-sm">
            {{ props.connectedTrip.secondTrip.departureInfo.pointName }} → {{ props.connectedTrip.secondTrip.destinationInfo.pointName }}
          </div>
        </div>

        <div v-if="loadingSecondTrip" class="p-8 text-center">
          <div class="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p class="mt-2 text-gray-600">Đang tải thông tin ghế...</p>
        </div>

        <div v-else-if="!secondTripDetail" class="p-8 text-center text-red-600">
          <p>Không thể tải thông tin ghế. Vui lòng thử lại sau.</p>
        </div>

        <div v-else class="p-4">
          <!-- Second Trip Tabs -->
          <div class="mb-4 border-b border-gray-200">
            <div class="flex -mb-px">
              <button
                v-for="floor in getSecondTripFloors"
                :key="'second-floor-' + floor"
                @click="secondTripActiveTab = floor"
                class="px-4 py-2 font-medium text-sm mr-2"
                :class="secondTripActiveTab === floor ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'"
              >
                Tầng {{ floor }}
              </button>
            </div>
          </div>

          <!-- Second Trip Seat Grid -->
          <div v-for="floor in getSecondTripFloors" :key="'second-floor-content-' + floor" v-show="secondTripActiveTab === floor">
            <div class="mb-6">
              <div class="grid grid-cols-5 gap-2">
                <template v-for="row in getSecondTripRows(floor)" :key="'second-row-' + row">
                  <template v-for="col in getSecondTripColumns" :key="'second-col-' + col">
                    <button
                      v-if="getSecondTripSeatName(floor, row, col)"
                      :disabled="getSecondTripSeatStatus(floor, row, col)"
                      :class="getSecondTripButtonClass(floor, row, col)"
                      class="p-2 rounded-md text-center transition-colors border border-gray-200 shadow-sm"
                      @click="toggleSecondTripSeatSelection(floor, row, col)"
                    >
                      {{ getSecondTripSeatName(floor, row, col) }}
                      <div class="text-xs mt-1">{{ getSecondTripSeatPrice(floor, row, col) }}</div>
                    </button>
                    <div v-else class="p-2"></div>
                  </template>
                </template>
              </div>
            </div>
          </div>

          <!-- Second Trip Selected Seats -->
          <div class="mt-4 p-3 bg-gray-50 rounded-lg">
            <div class="font-medium text-gray-700 mb-2">Ghế đã chọn:</div>
            <div v-if="selectedSecondTripTickets.length === 0" class="text-gray-500 text-sm">
              Chưa chọn ghế nào
            </div>
            <div v-else class="flex flex-wrap gap-2">
              <div
                v-for="ticket in selectedSecondTripTickets"
                :key="'second-selected-' + ticket.id"
                class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center"
              >
                {{ ticket.seat_name }}
                <button
                  @click="toggleSecondTripSeatSelection(0, 0, 0)"
                  class="ml-1 text-blue-600 hover:text-blue-800"
                  aria-label="Bỏ chọn ghế"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            <div class="mt-2 font-semibold text-right">
              Tổng tiền: {{ formatCurrency(secondTripTotal) }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Total and continue button -->
    <div class="mt-6 bg-white p-4 rounded-lg shadow-md">
      <div class="flex items-center justify-between">
        <div class="text-lg">
          <span class="font-medium">Tổng tiền:</span>
          <span class="font-bold text-blue-600 ml-2">{{ formatCurrency(totalPrice) }}</span>
        </div>
        <button
          @click="handleProceed"
          :disabled="!canProceed"
          :class="canProceed ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-300 cursor-not-allowed'"
          class="px-6 py-3 rounded-lg text-white font-medium transition-colors"
        >
          Tiếp tục
        </button>
      </div>
    </div>
    
    <!-- Seat color legend -->
    <div class="mt-4 flex items-center justify-center gap-6 text-sm">
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-sm bg-white border border-gray-300 mr-2"></div>
        <span>Còn trống</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-sm bg-blue-600 mr-2"></div>
        <span>Đã chọn</span>
      </div>
      <div class="flex items-center">
        <div class="w-4 h-4 rounded-sm bg-gray-300 mr-2"></div>
        <span>Đã đặt</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.connected-trip-seat-selection {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 