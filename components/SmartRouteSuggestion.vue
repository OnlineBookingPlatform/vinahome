<script setup lang="ts">
import { computed, onMounted } from 'vue';
import type { ConnectedTripType } from '~/types/TripType';

const props = defineProps<{
  connectedTrips: ConnectedTripType[]
}>();

const emit = defineEmits<{
  selectConnection: [connection: ConnectedTripType]
}>();

const handleSelectConnection = (connection: ConnectedTripType) => {
  emit('selectConnection', connection);
};

const handleKeyDown = (event: KeyboardEvent, connection: ConnectedTripType) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    emit('selectConnection', connection);
  }
};

const formatTime = (time: string) => {
  if (!time) return '';
  
  // Kiểm tra và đảm bảo định dạng HH:MM
  const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:[0-5][0-9])?$/;
  if (timeRegex.test(time)) {
    // Nếu có định dạng HH:MM:SS, cắt bỏ phần giây
    if (time.split(':').length === 3) {
      return time.substring(0, 5);
    }
    
    // Đảm bảo định dạng HH:MM đủ 2 chữ số
    const [hours, minutes] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  }
  
  // Xử lý trường hợp thời gian là số hoặc định dạng không chuẩn
  try {
    // Thử chuyển đổi thành số và định dạng lại
    const timeNum = parseInt(time);
    if (!isNaN(timeNum)) {
      const hours = Math.floor(timeNum / 60) % 24;
      const minutes = timeNum % 60;
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
  } catch (e) {
    console.error('Lỗi khi xử lý định dạng thời gian:', e);
  }
  
  console.log('Định dạng thời gian không chuẩn:', time);
  return time;
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Thêm hàm tính ngày đến dựa trên thời gian khởi hành và đến
const calculateArrivalDate = (departureDate: string, departureTime: string, arrivalTime: string, duration?: number, fromProvince?: string, toProvince?: string): string => {
  // Function no longer needed, keeping it for reference only
  const depDate = new Date(departureDate);
  return depDate.toISOString().split('T')[0];
};

/**
 * Tính toán và hiển thị thời gian đến chính xác
 * Sử dụng thông tin từ destinationInfo nếu có
 */
const getArrivalTime = (trip: any) => {
  // Ưu tiên sử dụng arrivalTime từ backend
  if (trip?.destinationInfo?.arrivalTime) {
    return formatTime(trip.destinationInfo.arrivalTime);
  }
  
  // Sử dụng time từ destinationInfo
  if (trip?.destinationInfo?.time) {
    return formatTime(trip.destinationInfo.time);
  }
  
  return 'N/A';
};

/**
 * Lấy ngày đến từ dữ liệu backend
 */
const getArrivalDate = (trip: any): string => {
  // Ưu tiên sử dụng arrivalDate từ backend
  if (trip?.destinationInfo?.arrivalDate) {
    return trip.destinationInfo.arrivalDate;
  }
  
  // Nếu không có arrivalDate, sử dụng ngày khởi hành
  // (backend có thể dùng dateDeparture hoặc date_departure)
  const departureDate = trip.dateDeparture || trip.date_departure;
  
  // Với tuyến Đăk Lăk - Hà Nội luôn là ngày hôm sau
  const fromProvince = trip?.departureInfo?.province || '';
  const toProvince = trip?.destinationInfo?.province || '';
  
  if ((fromProvince.includes('Đăk Lăk') || fromProvince.includes('Đắk Lắk')) && 
      toProvince.includes('Hà Nội')) {
    const depDate = new Date(departureDate);
    const nextDay = new Date(depDate);
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay.toISOString().split('T')[0];
  }
  
  return departureDate;
};

// Thêm log cho debug để hiểu dữ liệu đến từ backend
const logConnectedTripDetails = (connection: ConnectedTripType) => {
  console.log('===== TRIP CONNECTION DEBUG =====');
  console.log('First Trip:', {
    id: connection.firstTrip.id,
    departure: {
      time: connection.firstTrip.time_departure,
      date: connection.firstTrip.dateDeparture || connection.firstTrip.date_departure,
      point: connection.firstTrip.departureInfo?.pointName,
      province: connection.firstTrip.departureInfo?.province
    },
    destination: {
      time: connection.firstTrip.destinationInfo?.time,
      arrivalTime: connection.firstTrip.destinationInfo?.arrivalTime,
      arrivalDate: connection.firstTrip.destinationInfo?.arrivalDate,
      point: connection.firstTrip.destinationInfo?.pointName,
      province: connection.firstTrip.destinationInfo?.province
    },
    duration: connection.firstTrip.duration
  });
  
  console.log('Second Trip:', {
    id: connection.secondTrip.id,
    departure: {
      time: connection.secondTrip.time_departure,
      date: connection.secondTrip.dateDeparture || connection.secondTrip.date_departure,
      point: connection.secondTrip.departureInfo?.pointName,
      province: connection.secondTrip.departureInfo?.province
    },
    destination: {
      time: connection.secondTrip.destinationInfo?.time,
      arrivalTime: connection.secondTrip.destinationInfo?.arrivalTime,
      arrivalDate: connection.secondTrip.destinationInfo?.arrivalDate,
      point: connection.secondTrip.destinationInfo?.pointName,
      province: connection.secondTrip.destinationInfo?.province
    },
    duration: connection.secondTrip.duration
  });
  
  console.log('Connection Info:', {
    waitingTime: connection.waitingTime,
    waitingMinutes: connection.waitingMinutes,
    totalDuration: connection.totalDuration,
    connectionPoint: connection.connectionPoint
  });
  console.log('=============================');
};

onMounted(() => {
  if (props.connectedTrips && props.connectedTrips.length > 0) {
    // Log the first connected trip for debugging
    logConnectedTripDetails(props.connectedTrips[0]);
  }
});
</script>

<template>
  <div v-if="connectedTrips && connectedTrips.length > 0" class="mt-6 border border-yellow-100 bg-yellow-50 p-4 rounded-lg">
    <div class="flex items-center mb-3">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-5 w-5 mr-2 text-yellow-600">
        <path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm0-384c13.3 0 24 10.7 24 24V264c0 13.3-10.7 24-24 24s-24-10.7-24-24V152c0-13.3 10.7-24 24-24zM224 352a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z"/>
      </svg>
      <h3 class="text-lg font-semibold">Không có chuyến trực tiếp. Gợi ý cho bạn:</h3>
    </div>
    
    <div v-for="(connection, index) in connectedTrips" :key="index" class="mt-4 border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
      <div class="flex items-center">
        <div class="w-full">
          <!-- First trip -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <img :src="connection.firstTrip.company.urlLogo" class="h-8 w-8 object-contain mr-2" :alt="`Logo của ${connection.firstTrip.company.name}`" />
                <div class="text-lg font-medium">{{ connection.firstTrip.company.name }}</div>
              </div>
              <div class="flex items-center mt-3">
                <div class="mr-4">
                  <div class="text-sm text-gray-500">Khởi hành</div>
                  <div class="font-semibold">{{ formatTime(connection.firstTrip.time_departure) }}</div>
                  <div class="text-sm">{{ formatDate(connection.firstTrip.dateDeparture) }}</div>
                </div>
                <div class="flex-1 px-4">
                  <div class="relative">
                    <div class="text-center text-sm font-medium mb-2">
                      {{ connection.firstTrip.departureInfo.pointName }} → {{ connection.firstTrip.destinationInfo.pointName }}
                    </div>
                    <div class="border-t-2 border-dashed border-gray-300 w-full"></div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Đến</div>
                  <div class="font-semibold">{{ getArrivalTime(connection.firstTrip) }}</div>
                  <div class="text-sm">{{ formatDate(getArrivalDate(connection.firstTrip)) }}</div>
                </div>
              </div>
            </div>
            <div class="ml-4 text-right">
              <div class="font-semibold text-lg text-red-600">{{ formatCurrency(connection.firstTrip.route.base_price) }}</div>
            </div>
          </div>

          <!-- Transfer -->
          <div class="my-4 border-l-4 border-yellow-500 pl-4 py-2 bg-yellow-50">
            <div class="text-sm">
              <span class="font-medium text-yellow-700">Chuyển tiếp tại {{ connection.connectionPoint.pointName }} ({{ connection.connectionPoint.province.name }})</span>
              <span class="text-gray-600 ml-2">· Thời gian chờ: {{ connection.waitingTime }}</span>
            </div>
          </div>

          <!-- Second trip -->
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <img :src="connection.secondTrip.company.urlLogo" class="h-8 w-8 object-contain mr-2" :alt="`Logo của ${connection.secondTrip.company.name}`" />
                <div class="text-lg font-medium">{{ connection.secondTrip.company.name }}</div>
              </div>
              <div class="flex items-center mt-3">
                <div class="mr-4">
                  <div class="text-sm text-gray-500">Khởi hành</div>
                  <div class="font-semibold">{{ formatTime(connection.secondTrip.time_departure) }}</div>
                  <div class="text-sm">{{ formatDate(connection.secondTrip.dateDeparture) }}</div>
                </div>
                <div class="flex-1 px-4">
                  <div class="relative">
                    <div class="text-center text-sm font-medium mb-2">
                      {{ connection.secondTrip.departureInfo.pointName }} → {{ connection.secondTrip.destinationInfo.pointName }}
                    </div>
                    <div class="border-t-2 border-dashed border-gray-300 w-full"></div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Đến</div>
                  <div class="font-semibold">{{ getArrivalTime(connection.secondTrip) }}</div>
                  <div class="text-sm">{{ formatDate(getArrivalDate(connection.secondTrip)) }}</div>
                </div>
              </div>
            </div>
            <div class="ml-4 text-right">
              <div class="font-semibold text-lg text-red-600">{{ formatCurrency(connection.secondTrip.route.base_price) }}</div>
            </div>
          </div>
          
          <!-- Total -->
          <div class="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
            <div class="text-sm text-gray-600">
              Tổng thời gian: {{ connection.totalDuration || 'Đang tính...' }}
            </div>
            <div>
              <div class="text-sm text-gray-500">Tổng chi phí</div>
              <div class="font-bold text-xl text-red-600">{{ formatCurrency(connection.totalPrice) }}</div>
            </div>
          </div>

          <button 
            class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition"
            @click="handleSelectConnection(connection)"
            tabindex="0"
            aria-label="Chọn hành trình này"
            @keydown="handleKeyDown($event, connection)"
          >
            Chọn hành trình này
          </button>
        </div>
      </div>
    </div>
  </div>
</template> 