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

// Error states
const firstTripError = ref(false);
const secondTripError = ref(false);

// Retry counts
const maxRetries = 3;
const firstTripRetryCount = ref(0);
const secondTripRetryCount = ref(0);

// Active tab for each trip
const firstTripActiveTab = ref(1);
const secondTripActiveTab = ref(1);

// Fetch trip details with retry mechanism
const fetchTripDetails = async () => {
  // Reset the states
  firstTripError.value = false;
  secondTripError.value = false;
  selectedFirstTripTickets.value = [];
  selectedSecondTripTickets.value = [];
  
  try {
    // Fetch first trip details
    await fetchFirstTripDetails();
    // Fetch second trip details
    await fetchSecondTripDetails();
  } catch (error) {
    console.error("Error fetching trip details:", error);
    ElMessage.error("Lỗi khi tải thông tin chuyến đi. Vui lòng thử lại sau.");
  }
};

// Fetch first trip details with retry logic
const fetchFirstTripDetails = async () => {
  loadingFirstTrip.value = true;
  firstTripError.value = false;
  firstTripDetail.value = null;
  
  try {
    console.log(`=== FETCHING FIRST TRIP DETAILS ===`);
    console.log(`Trip ID: ${props.connectedTrip.firstTrip.id}`);
    console.log(`Company: ${props.connectedTrip.firstTrip.company.name}`);
    console.log(`Route: ${props.connectedTrip.firstTrip.departureInfo.pointName} → ${props.connectedTrip.firstTrip.destinationInfo.pointName}`);
    console.log(`Date: ${props.connectedTrip.firstTrip.dateDeparture}`);
    
    // This is the key part - similar to how index.vue handles it
    const response = await getTripDetail(props.connectedTrip.firstTrip.id);
    
    console.log(`API Response status:`, response.status);
    console.log(`API Response message:`, response.message);
    console.log(`API Response has result:`, !!response.result);
    
    // Simplify validation like in index.vue
    if (response && response.result) {
      firstTripDetail.value = response.result;
      console.log("First trip details loaded successfully");
      
      // Log basic structure information
      console.log("Response result structure:", Object.keys(response.result));
      console.log("Has tickets property:", 'tickets' in response.result);
      console.log("Has seat_map property:", 'seat_map' in response.result);
      
      if (response.result.tickets) {
        console.log("Tickets is array:", Array.isArray(response.result.tickets));
        console.log("Tickets count:", Array.isArray(response.result.tickets) ? response.result.tickets.length : 'N/A');
      }
      
      // Debug the ticket data
      debugTicketData(firstTripDetail.value, "First Trip");
      
      // Special handling for empty ticket arrays
      if (!firstTripDetail.value.tickets || !Array.isArray(firstTripDetail.value.tickets) || firstTripDetail.value.tickets.length === 0) {
        console.warn("First trip has no tickets array or empty array");
        ElMessage.warning("Chuyến đi đầu tiên không có dữ liệu ghế ngồi hoặc đã hết vé");
      }
    } else {
      console.warn("First trip response invalid:", response);
      console.warn("Response stringified:", JSON.stringify(response));
      firstTripError.value = true;
      ElMessage.error("Không thể tải thông tin ghế cho chuyến đi đầu tiên");
    }
  } catch (error) {
    console.error("Error fetching first trip details:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    firstTripError.value = true;
    ElMessage.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
  } finally {
    loadingFirstTrip.value = false;
    console.log(`=== END FETCHING FIRST TRIP DETAILS ===`);
  }
};

// Fetch second trip details with retry logic
const fetchSecondTripDetails = async () => {
  loadingSecondTrip.value = true;
  secondTripError.value = false;
  secondTripDetail.value = null;
  
  try {
    console.log(`=== FETCHING SECOND TRIP DETAILS ===`);
    console.log(`Trip ID: ${props.connectedTrip.secondTrip.id}`);
    console.log(`Company: ${props.connectedTrip.secondTrip.company.name}`);
    console.log(`Route: ${props.connectedTrip.secondTrip.departureInfo.pointName} → ${props.connectedTrip.secondTrip.destinationInfo.pointName}`);
    console.log(`Date: ${props.connectedTrip.secondTrip.dateDeparture}`);
    
    // This is the key part - similar to how index.vue handles it
    const response = await getTripDetail(props.connectedTrip.secondTrip.id);
    
    console.log(`API Response status:`, response.status);
    console.log(`API Response message:`, response.message);
    console.log(`API Response has result:`, !!response.result);
    
    // Simplify validation like in index.vue
    if (response && response.result) {
      secondTripDetail.value = response.result;
      console.log("Second trip details loaded successfully");
      
      // Log basic structure information
      console.log("Response result structure:", Object.keys(response.result));
      console.log("Has tickets property:", 'tickets' in response.result);
      console.log("Has seat_map property:", 'seat_map' in response.result);
      
      if (response.result.tickets) {
        console.log("Tickets is array:", Array.isArray(response.result.tickets));
        console.log("Tickets count:", Array.isArray(response.result.tickets) ? response.result.tickets.length : 'N/A');
      }
      
      // Debug the ticket data
      debugTicketData(secondTripDetail.value, "Second Trip");
      
      // Special handling for empty ticket arrays
      if (!secondTripDetail.value.tickets || !Array.isArray(secondTripDetail.value.tickets) || secondTripDetail.value.tickets.length === 0) {
        console.warn("Second trip has no tickets array or empty array");
        ElMessage.warning("Chuyến đi thứ hai không có dữ liệu ghế ngồi hoặc đã hết vé");
      }
    } else {
      console.warn("Second trip response invalid:", response);
      console.warn("Response stringified:", JSON.stringify(response));
      secondTripError.value = true;
      ElMessage.error("Không thể tải thông tin ghế cho chuyến đi thứ hai");
    }
  } catch (error) {
    console.error("Error fetching second trip details:", error);
    console.error("Error type:", error instanceof Error ? error.constructor.name : typeof error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    secondTripError.value = true;
    ElMessage.error("Không thể kết nối đến máy chủ. Vui lòng thử lại sau.");
  } finally {
    loadingSecondTrip.value = false;
    console.log(`=== END FETCHING SECOND TRIP DETAILS ===`);
  }
};

// Formatted date
const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN');
};

// Seat handling functions for first trip - using simplified approach from index.vue
const getFirstTripFloors = computed(() => {
  if (!firstTripDetail.value?.tickets) return [];
  try {
    const floors = new Set<number>(
      firstTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_floor)
    );
    return Array.from(floors).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting first trip floors:", error);
    return [];
  }
});

const getFirstTripRows = (floor: number): number[] => {
  if (!firstTripDetail.value?.tickets) return [];
  try {
    const rows = new Set<number>(
      firstTripDetail.value.tickets
        .filter((ticket: TicketType) => ticket.seat_floor === floor)
        .map((ticket: TicketType) => ticket.seat_row)
    );
    return Array.from(rows).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting first trip rows:", error);
    return [];
  }
};

const getFirstTripColumns = computed(() => {
  if (!firstTripDetail.value?.tickets) return [];
  try {
    const cols = new Set<number>(
      firstTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_column)
    );
    return Array.from(cols).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting first trip columns:", error);
    return [];
  }
});

const getFirstTripSeatName = (floor: number, row: number, col: number): string => {
  if (!firstTripDetail.value?.tickets) return "";
  const seat = firstTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_name : "";
};

const getFirstTripSeatPrice = (floor: number, row: number, col: number): string => {
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
    currency: 'VND',
    minimumFractionDigits: 0
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

// Seat handling functions for second trip - using simplified approach from index.vue
const getSecondTripFloors = computed(() => {
  if (!secondTripDetail.value?.tickets) return [];
  try {
    const floors = new Set<number>(
      secondTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_floor)
    );
    return Array.from(floors).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting second trip floors:", error);
    return [];
  }
});

const getSecondTripRows = (floor: number): number[] => {
  if (!secondTripDetail.value?.tickets) return [];
  try {
    const rows = new Set<number>(
      secondTripDetail.value.tickets
        .filter((ticket: TicketType) => ticket.seat_floor === floor)
        .map((ticket: TicketType) => ticket.seat_row)
    );
    return Array.from(rows).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting second trip rows:", error);
    return [];
  }
};

const getSecondTripColumns = computed(() => {
  if (!secondTripDetail.value?.tickets) return [];
  try {
    const cols = new Set<number>(
      secondTripDetail.value.tickets.map((ticket: TicketType) => ticket.seat_column)
    );
    return Array.from(cols).sort((a: number, b: number) => a - b);
  } catch (error) {
    console.error("Error getting second trip columns:", error);
    return [];
  }
});

const getSecondTripSeatName = (floor: number, row: number, col: number): string => {
  if (!secondTripDetail.value?.tickets) return "";
  const seat = secondTripDetail.value.tickets.find(
    (ticket: TicketType) => 
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );
  return seat ? seat.seat_name : "";
};

const getSecondTripSeatPrice = (floor: number, row: number, col: number): string => {
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
    currency: 'VND',
    minimumFractionDigits: 0
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

// Simple debug function to log seat information
const debugTicketData = (tripDetail: any, tripName: string) => {
  console.log(`===== DEBUG ${tripName} =====`);
  
  if (!tripDetail) {
    console.error(`${tripName} detail is null or undefined`);
    return;
  }
  
  // Log the entire response for inspection
  console.log(`${tripName} full response:`, JSON.stringify(tripDetail));
  
  // Check for tickets array
  if (!tripDetail.tickets) {
    console.error(`${tripName} has no 'tickets' property`);
  } else if (!Array.isArray(tripDetail.tickets)) {
    console.error(`${tripName} tickets is not an array, it's:`, typeof tripDetail.tickets);
  } else if (tripDetail.tickets.length === 0) {
    console.error(`${tripName} tickets array is empty`);
  } else {
    // Log ticket information
    console.log(`${tripName} tickets count:`, tripDetail.tickets.length);
    console.log(`${tripName} first ticket sample:`, JSON.stringify(tripDetail.tickets[0]));
    
    // Log available vs booked seats
    const bookedSeats = tripDetail.tickets.filter((t: any) => t.status_booking_ticket).length;
    const availableSeats = tripDetail.tickets.length - bookedSeats;
    console.log(`${tripName} booked seats: ${bookedSeats}, available seats: ${availableSeats}`);
    
    // Log floor information
    const floors = new Set(tripDetail.tickets.map((ticket: any) => ticket.seat_floor));
    console.log(`${tripName} floors:`, Array.from(floors));
    
    // Log seat layout
    Array.from(floors).forEach((floor: any) => {
      const rows = new Set(tripDetail.tickets
        .filter((t: any) => t.seat_floor === floor)
        .map((t: any) => t.seat_row));
      
      const cols = new Set(tripDetail.tickets
        .filter((t: any) => t.seat_floor === floor)
        .map((t: any) => t.seat_column));
      
      console.log(`${tripName} floor ${floor} layout: ${Array.from(rows).length} rows × ${Array.from(cols).length} columns`);
    });
  }
  
  // Check for seat_map property (vehicle layout)
  if (!tripDetail.seat_map) {
    console.error(`${tripName} has no 'seat_map' property`);
  } else {
    console.log(`${tripName} seat_map:`, JSON.stringify(tripDetail.seat_map));
  }
  
  console.log(`===== END DEBUG ${tripName} =====`);
};

// Add a diagnostic function to be called from the browser console
const runDiagnostics = () => {
  console.log("RUNNING FULL CONNECTED TRIP DIAGNOSTICS");
  console.log("Connected Trip Props:", props.connectedTrip);
  
  // Check IDs 
  console.log("First Trip ID:", props.connectedTrip.firstTrip.id);
  console.log("Second Trip ID:", props.connectedTrip.secondTrip.id);
  
  // Log available seats from the original connected trip data
  console.log("First Trip available seats from connector:", props.connectedTrip.firstTrip.tickets_available);
  console.log("Second Trip available seats from connector:", props.connectedTrip.secondTrip.tickets_available);
  
  // Log detail data
  if (firstTripDetail.value) {
    debugTicketData(firstTripDetail.value, "First Trip Detail");
  } else {
    console.error("First Trip Detail is not loaded");
  }
  
  if (secondTripDetail.value) {
    debugTicketData(secondTripDetail.value, "Second Trip Detail");
  } else {
    console.error("Second Trip Detail is not loaded");
  }
  
  console.log("DIAGNOSTICS COMPLETE");
};

// Expose diagnostics to window for console access
onMounted(() => {
  console.log("ConnectedTripSeatSelection mounted with connectedTrip:", props.connectedTrip);
  console.log("First Trip ID:", props.connectedTrip.firstTrip.id);
  console.log("Second Trip ID:", props.connectedTrip.secondTrip.id);
  
  // Make diagnostics available globally
  if (typeof window !== 'undefined') {
    (window as any).runConnectedTripDiagnostics = runDiagnostics;
    console.log("Diagnostics function available. Run 'window.runConnectedTripDiagnostics()' in console to debug");
  }
  
  fetchTripDetails();
});
</script>

<template>
  <div class="connected-trip-seat-selection bg-gray-50 p-4 rounded-lg">
    <h2 class="text-xl font-bold mb-4 text-center text-blue-700">Chọn chỗ ngồi cho chuyến đi</h2>
    
    <!-- Retry button at the top -->
    <div v-if="firstTripError || secondTripError" class="mb-4 bg-yellow-50 border border-yellow-300 rounded-lg p-4 flex justify-between items-center">
      <div class="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>Không thể tải thông tin ghế. Vui lòng thử lại.</span>
      </div>
      <button 
        @click="fetchTripDetails" 
        class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
        Tải lại
      </button>
    </div>
    
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

        <div v-else-if="firstTripError" class="p-8 text-center">
          <div class="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Không thể tải thông tin ghế. Vui lòng thử lại sau.</p>
          </div>
          <button 
            @click="fetchFirstTripDetails" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>

        <div v-else-if="!firstTripDetail?.tickets || firstTripDetail.tickets.length === 0" class="p-8 text-center">
          <div class="text-amber-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Chuyến đi này không có dữ liệu ghế ngồi hoặc đã hết vé.</p>
          </div>
          <p class="text-sm text-gray-500 my-2">Thử lại hoặc liên hệ nhà xe để được hỗ trợ.</p>
          <button 
            @click="fetchFirstTripDetails" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
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

        <div v-else-if="secondTripError" class="p-8 text-center">
          <div class="text-red-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Không thể tải thông tin ghế. Vui lòng thử lại sau.</p>
          </div>
          <button 
            @click="fetchSecondTripDetails" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
        
        <div v-else-if="!secondTripDetail?.tickets || secondTripDetail.tickets.length === 0" class="p-8 text-center">
          <div class="text-amber-600 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p>Chuyến đi này không có dữ liệu ghế ngồi hoặc đã hết vé.</p>
          </div>
          <p class="text-sm text-gray-500 my-2">Thử lại hoặc liên hệ nhà xe để được hỗ trợ.</p>
          <button 
            @click="fetchSecondTripDetails" 
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
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
    
    <!-- Diagnostic information for debugging -->
    <div class="mt-8 border-t border-gray-200 pt-4">
      <details class="bg-gray-50 p-2 rounded-lg">
        <summary class="cursor-pointer text-sm font-medium text-gray-700 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Thông tin chẩn đoán (dành cho nhà phát triển)
        </summary>
        
        <div class="mt-2 text-xs font-mono bg-gray-100 p-3 rounded overflow-auto max-h-60">
          <div class="mb-2">
            <strong>Chuyến đi 1:</strong>
            <div>ID: {{ props.connectedTrip.firstTrip.id }}</div>
            <div>Công ty: {{ props.connectedTrip.firstTrip.company.name }}</div>
            <div>Tuyến: {{ props.connectedTrip.firstTrip.departureInfo.pointName }} → {{ props.connectedTrip.firstTrip.destinationInfo.pointName }}</div>
            <div>Ghế trống (ban đầu): {{ props.connectedTrip.firstTrip.tickets_available || 'Không có' }}</div>
            <div>Trạng thái: {{ loadingFirstTrip ? 'Đang tải' : firstTripError ? 'Lỗi' : firstTripDetail ? 'Đã tải' : 'Chưa tải' }}</div>
            <div v-if="firstTripDetail?.tickets">Số ghế trong response: {{ firstTripDetail.tickets.length }}</div>
            <div v-if="firstTripDetail?.seat_map">Loại xe: {{ firstTripDetail.seat_map.name }}</div>
          </div>
          
          <div class="mb-2">
            <strong>Chuyến đi 2:</strong>
            <div>ID: {{ props.connectedTrip.secondTrip.id }}</div>
            <div>Công ty: {{ props.connectedTrip.secondTrip.company.name }}</div>
            <div>Tuyến: {{ props.connectedTrip.secondTrip.departureInfo.pointName }} → {{ props.connectedTrip.secondTrip.destinationInfo.pointName }}</div>
            <div>Ghế trống (ban đầu): {{ props.connectedTrip.secondTrip.tickets_available || 'Không có' }}</div>
            <div>Trạng thái: {{ loadingSecondTrip ? 'Đang tải' : secondTripError ? 'Lỗi' : secondTripDetail ? 'Đã tải' : 'Chưa tải' }}</div>
            <div v-if="secondTripDetail?.tickets">Số ghế trong response: {{ secondTripDetail.tickets.length }}</div>
            <div v-if="secondTripDetail?.seat_map">Loại xe: {{ secondTripDetail.seat_map.name }}</div>
          </div>
          
          <div class="mt-4">
            <button 
              @click="runDiagnostics" 
              class="bg-gray-700 text-white px-2 py-1 rounded text-xs"
            >
              Chạy chẩn đoán đầy đủ (xem console)
            </button>
          </div>
        </div>
      </details>
    </div>
  </div>
</template>

<style scoped>
.connected-trip-seat-selection {
  max-width: 1200px;
  margin: 0 auto;
}
</style> 