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
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

const formatCurrency = (amount: number) => {
  if (!amount && amount !== 0) return '0 ₫';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Calculate trip duration
const calculateDurationText = (trip: any): string => {
  if (trip.duration) {
    return `Thời gian: ${trip.duration}`;
  }
  
  // Nếu không có duration nhưng có thể tính từ thời gian khởi hành và thời gian đến
  const departureTime = trip.time_departure;
  const arrivalTime = trip.destinationInfo?.time || trip.destinationInfo?.arrivalTime;
  
  if (departureTime && arrivalTime) {
    try {
      // Parse time in format HH:MM or HH:MM:SS
      const parseTime = (timeStr: string): number => {
        const parts = timeStr.split(':');
        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        return hours * 60 + minutes; // Convert to minutes
      };
      
      let departureMinutes = parseTime(departureTime);
      let arrivalMinutes = parseTime(arrivalTime);
      
      // Handle overnight trips
      if (arrivalMinutes < departureMinutes) {
        arrivalMinutes += 24 * 60; // Add 24 hours
      }
      
      const durationMinutes = arrivalMinutes - departureMinutes;
      const hours = Math.floor(durationMinutes / 60);
      const minutes = durationMinutes % 60;
      
      if (hours > 0 && minutes > 0) {
        return `Thời gian: ${hours}h ${minutes}p`;
      } else if (hours > 0) {
        return `Thời gian: ${hours}h`;
      } else {
        return `Thời gian: ${minutes}p`;
      }
    } catch (e) {
      console.error('Lỗi khi tính thời gian di chuyển:', e);
      return '';
    }
  }
  
  return '';
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
    duration: connection.firstTrip.duration,
    tickets_available: connection.firstTrip.tickets_available,
    seat_map: connection.firstTrip.seat_map
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
    duration: connection.secondTrip.duration,
    tickets_available: connection.secondTrip.tickets_available,
    seat_map: connection.secondTrip.seat_map
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
  <div v-if="connectedTrips && connectedTrips.length > 0" class="mt-6 space-y-6">
    <div class="flex items-center mb-3">
      <h3 class="text-lg font-semibold">Chuyến nối có thể phù hợp với bạn</h3>
    </div>
    
    <div v-for="(connection, index) in connectedTrips" 
         :key="index" 
         class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300">
      <!-- Header with destination overview -->
      <div class="bg-blue-600 text-white p-3">
        <div class="flex justify-between items-center">
          <div class="font-medium">
            {{ connection.firstTrip.departureInfo.pointName }} → {{ connection.secondTrip.destinationInfo.pointName }}
          </div>
          <div class="text-sm">
            Tổng thời gian: <span class="font-semibold">{{ connection.totalDuration || 'Đang tính...' }}</span>
          </div>
        </div>
      </div>
      
      <div class="p-4">
        <!-- First trip -->
        <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <img :src="connection.firstTrip.company.urlLogo || connection.firstTrip.company.url_vehicle_online" class="h-8 w-8 object-contain mr-2" :alt="`Logo của ${connection.firstTrip.company.name}`" />
                <div class="flex items-center gap-2">
                  <div class="text-lg font-medium">{{ connection.firstTrip.company.name }}</div>
                  <div v-if="connection.firstTrip.seat_map" class="text-sm text-gray-500">({{ connection.firstTrip.seat_map.name }})</div>
                </div>
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
                    <div class="text-center text-xs text-gray-500 mt-1">
                      {{ calculateDurationText(connection.firstTrip) }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Đến</div>
                  <div class="font-semibold">{{ getArrivalTime(connection.firstTrip) }}</div>
                  <div class="text-sm">{{ formatDate(getArrivalDate(connection.firstTrip)) }}</div>
                </div>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 mr-1 text-amber-500" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span class="text-amber-600 text-sm font-medium">
                    Còn {{ connection.firstTrip.tickets_available > 0 ? connection.firstTrip.tickets_available : '0' }} chỗ trống
                  </span>
                </div>
                <div class="text-blue-600 font-semibold">
                  {{ formatCurrency(connection.firstTrip.route.base_price) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Transfer -->
        <div class="my-4 flex items-center justify-center">
          <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
          <div class="ml-3">
            <div class="text-sm font-medium">Chuyển tiếp tại {{ connection.connectionPoint.pointName }}</div>
            <div class="text-xs text-gray-500">{{ connection.connectionPoint.province.name }} · Thời gian chờ: {{ connection.waitingTime }}</div>
          </div>
        </div>

        <!-- Second trip -->
        <div class="rounded-lg border border-gray-200 p-3 bg-gray-50">
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <div class="flex items-center">
                <img :src="connection.secondTrip.company.urlLogo || connection.secondTrip.company.url_vehicle_online" class="h-8 w-8 object-contain mr-2" :alt="`Logo của ${connection.secondTrip.company.name}`" />
                <div class="flex items-center gap-2">
                  <div class="text-lg font-medium">{{ connection.secondTrip.company.name }}</div>
                  <div v-if="connection.secondTrip.seat_map" class="text-sm text-gray-500">({{ connection.secondTrip.seat_map.name }})</div>
                </div>
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
                    <div class="text-center text-xs text-gray-500 mt-1">
                      {{ calculateDurationText(connection.secondTrip) }}
                    </div>
                  </div>
                </div>
                <div>
                  <div class="text-sm text-gray-500">Đến</div>
                  <div class="font-semibold">{{ getArrivalTime(connection.secondTrip) }}</div>
                  <div class="text-sm">{{ formatDate(getArrivalDate(connection.secondTrip)) }}</div>
                </div>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-4 w-4 mr-1 text-amber-500" fill="none" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                  </svg>
                  <span class="text-amber-600 text-sm font-medium">
                    Còn {{ connection.secondTrip.tickets_available > 0 ? connection.secondTrip.tickets_available : '0' }} chỗ trống
                  </span>
                </div>
                <div class="text-blue-600 font-semibold">
                  {{ formatCurrency(connection.secondTrip.route.base_price) }}
                </div>
              </div>
            </div>
          </div>
        </div>
          
        <!-- Total -->
        <div class="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
          <div class="text-sm text-gray-600">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Tổng thời gian: {{ connection.totalDuration || 'Đang tính...' }}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-500">Tổng chi phí</div>
            <div class="font-bold text-xl text-blue-600">{{ formatCurrency(connection.totalPrice) }}</div>
          </div>
        </div>

        <button 
          class="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
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
</template>

<style scoped>
.seat-availability {
  display: inline-flex;
  align-items: center;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}
</style> 