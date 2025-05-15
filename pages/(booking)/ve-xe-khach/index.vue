<script setup lang="ts">
import SelectTrip_v2 from "~/components/select/SelectTrip_v2.vue";
import SmartRouteSuggestion from "~/components/SmartRouteSuggestion.vue";
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
  type ConnectedTripType,
  type SearchResults
} from "~/types/TripType";
import { dayjs, ElMessage } from "element-plus";
import {
  getPointDownByTrip,
  getPointUpByTrip,
  getTripDetail,
  getTripOnPlatform,
  findConnectedTrips
} from "~/api/tripAPI";
import { getEvaluatesAverageAPI, getEvaluatesByTripIdAPI, createEvaluateAPI } from "~/api/evaluateAPI";
import { useRoute, useRouter } from "vue-router";
import type { SelectedTicket } from "~/types/TicketType";
import type { BookingData, ConnectedTripWithTickets } from "~/types/PendingType";
import { changeTicketBookedAPI } from "~/api/ticketAPI";
import { timeToSeconds, calculateTotalTime, calculateDuration } from "~/lib/libTime"
import type { TripPointType } from "~/types/PointType";
import ConnectedTripSeatSelection from "~/components/ConnectedTripSeatSelection.vue";

const route = useRoute();
const router = useRouter();
const tripData = ref<DTO_RP_TripInfo[]>([]);
const loading = ref(true);
const userStore = useUserStore();
const activeTabs = ref<Record<string, number | null>>({});
const tripDetail = ref<DetailTripType | null>(null);
const selectedTripId = ref<number | null>(null);
const selectedTicket = ref<SelectedTicket[]>([]);
const selectedStep = ref(1);
const valuePointUp = ref<TripPointType | null>(null);
const valuePointDown = ref<TripPointType | null>(null);
const optionsPointDown = ref<TripPointType[]>([]);
const optionsPointUp = ref<TripPointType[]>([]);
const selectedPointUpId = ref<number | null>(null);
const selectedPointDownId = ref<number | null>(null);
const valuePoint = ref(0);
const checked1 = ref(true);
const checked2 = ref(false);
const pendingTicketStore = usePendingTicketStore();
const activeStep = ref(0);
const pointStore = usePointStore();
const connectedTrips = ref<ConnectedTripType[]>([]);
const allTrips = ref<DTO_RP_TripInfo[]>([]);
const selectedConnectedTrip = ref<ConnectedTripType | null>(null);
const showConnectedTripSeatSelection = ref(false);

// Review data
const tripReviews = ref<any[]>([]);
const tripAverageRating = ref<any>(null);
const reviewLoading = ref(false);
const userReview = ref<string>('');
const userRating = ref<number>(5);

// Bộ lọc theo tên công ty
const filterCompanies = ref<number[]>([])
const uniqueCompanies = computed(() => {
  const map = new Map<number, DTO_RP_TripInfo>()
  for (const trip of tripData.value) {
    if (!map.has(trip.company.id)) {
      map.set(trip.company.id, trip)
    }
  }
  return Array.from(map.values())
})

// Bộ lọc theo thời gian khởi hành
const filterTime = ref<string[]>([])

// Add a map to store trip ratings
const tripRatings = ref(new Map<number, any>());

const fetchTrips = async () => {
  const { departureId, destinationId, departureDate, numberOfTickets } = route.query;

  console.log("Search params:", {
    departureId,
    destinationId,
    departureDate,
    numberOfTickets,
  });

  const searchParams: SearchTripParams = {
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
      // Kiểm tra và xử lý định dạng kết quả trả về
      if ('directTrips' in response.result) {
        // Định dạng mới với chuyến nối
        const results = response.result as SearchResults;
        tripData.value = results.directTrips;
        connectedTrips.value = results.connectedTrips || [];
        allTrips.value = results.directTrips;
      } else {
        // Định dạng cũ, chỉ có chuyến trực tiếp
        tripData.value = response.result as DTO_RP_TripInfo[];
        connectedTrips.value = [];
        allTrips.value = response.result as DTO_RP_TripInfo[];
      }
    } else {
      tripData.value = [];
      connectedTrips.value = [];
      allTrips.value = [];
    }

    // Luôn tìm kiếm chuyến nối nếu không tìm thấy chuyến trực tiếp hoặc có ít hơn 2 chuyến trực tiếp
    if (tripData.value.length < 2) {
      try {
        console.log("Tìm kiếm chuyến nối với tham số:", searchParams);
        const connectedResponse = await findConnectedTrips(searchParams);
        console.log("Kết quả tìm kiếm chuyến nối:", connectedResponse);

        if (connectedResponse?.result && connectedResponse.result.length > 0) {
          connectedTrips.value = connectedResponse.result;
        }
      } catch (connectedErr) {
        console.error("Error fetching connected trips:", connectedErr);
      }
    }

    if (tripData.value.length === 0 && connectedTrips.value.length === 0) {
      ElMessage.warning("Không tìm thấy chuyến đi phù hợp");
    }
    
    // Fetch ratings for all trips right after they're loaded
    if (tripData.value.length > 0) {
      await fetchAverageRatingsForTrips(tripData.value);
    }
  } catch (err) {
    console.error("Search error:", err);
    ElMessage.error("Có lỗi xảy ra khi tìm kiếm chuyến đi");
    tripData.value = [];
    connectedTrips.value = [];
    allTrips.value = [];
  } finally {
    loading.value = false;
  }
};

// Function to fetch average ratings for all trips
const fetchAverageRatingsForTrips = async (trips: DTO_RP_TripInfo[]) => {
  try {
    const ratingPromises = trips.map(trip => getEvaluatesAverageAPI(trip.id));
    const ratingResponses = await Promise.all(ratingPromises);
    
    ratingResponses.forEach((response, index) => {
      if (response?.result) {
        tripRatings.value.set(trips[index].id, response.result);
      }
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
  }
};

// Add a computed function to get the rating for a specific trip
const getTripRating = (tripId: number): number => {
  const rating = tripRatings.value.get(tripId);
  return rating?.averageRating || valuePoint.value;
};

// Modified openTrip function to also fetch rating
const openTrip = async (tripId: number) => {
  if (selectedTripId.value !== null && selectedTripId.value !== tripId) {
    selectedTicket.value = [];
    activeStep.value = 0;
    activeTabs.value[String(selectedTripId.value)] = null;
  }

  (activeTabs.value as Record<number, number | null>)[tripId] = 1;
  selectedTripId.value = tripId;

  // Reset point chọn
  valuePointUp.value = null;
  valuePointDown.value = null;
  selectedPointUpId.value = null;
  selectedPointDownId.value = null;
  pointStore.clearPoints();
  activeStep.value = 0;

  const response = await getTripDetail(tripId);
  if (response.result) {
    tripDetail.value = response.result;
    console.log("API response:", tripDetail.value);
    
    // Fetch rating when opening a trip
    try {
      const ratingResponse = await getEvaluatesAverageAPI(tripId);
      if (ratingResponse?.result) {
        tripAverageRating.value = ratingResponse.result;
        tripRatings.value.set(tripId, ratingResponse.result);
      }
    } catch (error) {
      console.error("Error fetching trip rating:", error);
    }
  }
};

const handleClickTab = async (tripId: number, tab: any) => {
  console.log("Tab được chọn:", tab.props.name);
  console.log(
    "activeTabs trước khi cập nhật:",
    activeTabs.value[String(tripId)]
  );
  if (activeTabs.value[tripId] === tab.props.name) {
    activeTabs.value[tripId] = null;
    selectedTripId.value = null;
    return;
  }
  if (tab.props.name === 1) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }
    selectedStep.value = 1;
    selectedTicket.value = [];

    await openTrip(tripId);
  } else if (tab.props.name === 2) {
    if (selectedTripId.value !== null && selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }

    (activeTabs.value as Record<number, number | null>)[tripId] = 2;
    selectedTripId.value = tripId;

    console.log("API response cho tab 2:");
    const responsePointUp = await getPointUpByTrip(tripId);
    if (responsePointUp.result) {
      optionsPointUp.value = responsePointUp.result;
    } else {
      optionsPointUp.value = [];
    }
    const responsePointDown = await getPointDownByTrip(tripId);
    if (responsePointDown.result) {
      optionsPointDown.value = responsePointDown.result;
    } else {
      optionsPointDown.value = [];
    }
  } else if (tab.props.name === 3) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }
    selectedStep.value = 1;
    selectedTicket.value = [];

    await openTrip(tripId);
  } else if (tab.props.name === 4) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }
    selectedStep.value = 1;
    selectedTicket.value = [];

    await openTrip(tripId);
  } else if (tab.props.name === 5) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }
    selectedStep.value = 1;
    selectedTicket.value = [];

    await openTrip(tripId);
  } else if (tab.props.name === 6) {
    if (selectedTripId.value !== tripId) {
      selectedTicket.value = [];
      activeStep.value = 0;
    }

    (activeTabs.value as Record<number, number | null>)[tripId] = 6;
    selectedTripId.value = tripId;

    // Fetch review data when review tab is clicked
    await fetchReviewData(tripId);
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
  activeStep.value = 0;
  pointStore.clearPoints();
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
const getSeatStatus = (floor: number, row: number, col: number): boolean => {
  if (!tripDetail.value || !tripDetail.value.tickets) return false;

  const seat = tripDetail.value.tickets.find(
    (ticket) =>
      ticket.seat_floor === floor &&
      ticket.seat_row === row &&
      ticket.seat_column === col
  );

  return seat?.status_booking_ticket ?? false;
};

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
    selectedTicket.value.splice(index, 1);
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

watch(
  () => selectedTicket.value.length,
  (newLength) => {
    activeStep.value = newLength > 0 ? 1 : 0;
  }
);

const preStep = () => {
  selectedStep.value = 1;
  activeStep.value = 1;
};

const fetchPointUpOptions = async () => {
  try {
    if (selectedTripId.value !== null) {
      const response = await getPointUpByTrip(selectedTripId.value);
      optionsPointUp.value = response.result || [];
    } else {
      console.error("selectedTripId is null");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin điểm đón:", error);
    ElMessage.error(
      "Có lỗi xảy ra khi lấy thông tin điểm đón. Vui lòng thử lại sau."
    );
  }
};

const fetchPointDownOptions = async () => {
  try {
    if (selectedTripId.value !== null) {
      const response = await getPointDownByTrip(selectedTripId.value);
      optionsPointDown.value = response.result || [];
    } else {
      console.error("selectedTripId is null");
    }
  } catch (error) {
    console.error("Lỗi khi lấy thông tin điểm đón:", error);
    ElMessage.error(
      "Có lỗi xảy ra khi lấy thông tin điểm đón. Vui lòng thử lại sau."
    );
  }
};
watch(
  selectedTripId,
  async (newVal) => {
    if (newVal !== null) {
      await fetchPointUpOptions();
      await fetchPointDownOptions();
      activeStep.value = 0;
      selectedStep.value = 1;
    }
  },
  { immediate: true }
);

watch(selectedPointUpId, (newId) => {
  if (newId !== null) {
    const selectedPoint = optionsPointUp.value.find(p => p.id === newId) || null;
    pointStore.setPointUp(selectedPoint);
  }
});

watch(selectedPointDownId, (newId) => {
  if (newId !== null) {
    const selectedPoint = optionsPointDown.value.find(p => p.id === newId) || null;
    pointStore.setPointDown(selectedPoint);
  }
});

const nextStep = async () => {
  // Kiểm tra nếu bước hiện tại (selectedStep) đã là bước 2
  // selectedStep = 2 là bước chọn điểm đón/trả
  if (selectedStep.value === 2) {
    const selectedTrip = tripData.value.find(
      (trip) => trip.id === selectedTripId.value
    );
    const bookingData: BookingData = {
      selectedTicket: selectedTicket.value,
      selectedTripId: selectedTripId.value ?? 0,
      tripData: selectedTrip ?? ({} as DTO_RP_TripInfo),
    };

    if (!userStore.isLoggedIn) {
      ElMessage.warning("Bạn cần đăng nhập để tiếp tục!");
      return;
    }
    pendingTicketStore.setPendingTicket(bookingData);
    try {
      await changeTicketBookedAPI(selectedTicket.value);
      router.push("/payment-method-2");
    } catch (error) {
      ElMessage.error("Vé đã được đặt vui lòng chọn vé khác!");
    }

    console.log("Dữ liệu bookingData:", selectedTicket.value);

    console.log(
      "Dữ liệu pendingTicketStore:",
      pendingTicketStore.pendingTicket
    );
  } else {
    // Nếu chưa phải bước 2, chuyển sang bước 2
    // selectedStep = 1 là bước chọn ghế
    selectedStep.value = 2;
    activeStep.value = 2;
  }
};

import { Filter } from '@element-plus/icons-vue'
const showFilterDrawer = ref(false)
const drawerVisible = ref(false);
const openDrawerTrip = async (tripId: number) => {
  if (selectedTripId.value !== null && selectedTripId.value !== tripId) {
    selectedTicket.value = [];
    activeStep.value = 0;
    activeTabs.value[String(selectedTripId.value)] = null;
  }

  (activeTabs.value as Record<number, number | null>)[tripId] = 1;
  selectedTripId.value = tripId;

  // Reset point chọn
  valuePointUp.value = null;
  valuePointDown.value = null;
  selectedPointUpId.value = null;
  selectedPointDownId.value = null;
  pointStore.clearPoints();
  activeStep.value = 0;

  const response = await getTripDetail(tripId);
  if (response.result) {
    tripDetail.value = response.result;
    console.log("API response:", tripDetail.value);
  }

  drawerVisible.value = true; // mở drawer
};

// Thêm hàm xử lý cho việc đặt vé chuyến nối
const handleConnectedTrip = (connectedTrip: ConnectedTripType) => {
  ElMessage.info({
    message: 'Tính năng đặt vé cho chuyến nối đang được phát triển. Vui lòng đặt riêng từng chuyến.',
    type: 'info',
    duration: 5000
  });
};

// Hàm định dạng tiền tệ
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0
  }).format(amount);
};

// Hàm định dạng ngày
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  return dayjs(dateString).format('DD/MM/YYYY');
};

const handleSelectConnectedTrip = (connection: ConnectedTripType) => {
  console.log("Selected connected trip:", connection);
  selectedConnectedTrip.value = connection;
  showConnectedTripSeatSelection.value = true;
};

const handleConnectedTripProceed = (firstTripTickets: SelectedTicket[], secondTripTickets: SelectedTicket[]) => {
  console.log("Connected trip selected tickets:", {
    firstTripTickets,
    secondTripTickets
  });

  if (!selectedConnectedTrip.value) {
    ElMessage.error("Không tìm thấy thông tin chuyến nối");
    return;
  }

  // Combine both trip tickets into one selected ticket array with proper types
  const combinedTickets = [
    ...firstTripTickets.map(ticket => ({
      ...ticket,
      trip_id: selectedConnectedTrip.value!.firstTrip.id,
      trip_name: `${selectedConnectedTrip.value!.firstTrip.departureInfo.pointName} → ${selectedConnectedTrip.value!.firstTrip.destinationInfo.pointName}`
    })),
    ...secondTripTickets.map(ticket => ({
      ...ticket,
      trip_id: selectedConnectedTrip.value!.secondTrip.id,
      trip_name: `${selectedConnectedTrip.value!.secondTrip.departureInfo.pointName} → ${selectedConnectedTrip.value!.secondTrip.destinationInfo.pointName}`
    }))
  ];

  const connectedTripWithTickets: ConnectedTripWithTickets = {
    ...selectedConnectedTrip.value,
    firstTripTickets,
    secondTripTickets
  };

  pendingTicketStore.addConnectedTrip(connectedTripWithTickets);

  router.push({
    path: '/payment',
    query: {
      type: 'connected-trip',
      id: `${selectedConnectedTrip.value.firstTrip.id}-${selectedConnectedTrip.value.secondTrip.id}`
    }
  });
};

onMounted(fetchTrips);
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    // Chỉ fetch lại nếu query thực sự thay đổi (tránh gọi API liên tục)
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      fetchTrips();
    }
  },
  { deep: true }
);

// Lọc data theo thời gian khởi hành
watchEffect(() => {
  if (filterTime.value.length === 0) {
    tripData.value = allTrips.value;
  } else {
    tripData.value = allTrips.value.filter(trip => {
      const hour = dayjs(trip.time_departure, 'HH:mm:ss').hour();
      return filterTime.value.some(range => {
        const [start, end] = range.split('-').map(Number);
        return hour >= start && hour < end;
      });
    });
  }
});

// Fetch review data
const fetchReviewData = async (tripId: number) => {
  reviewLoading.value = true;
  try {
    const [averageResponse, reviewsResponse] = await Promise.all([
      getEvaluatesAverageAPI(tripId),
      getEvaluatesByTripIdAPI(tripId)
    ]);

    if (averageResponse?.result) {
      tripAverageRating.value = averageResponse.result;
      tripRatings.value.set(tripId, averageResponse.result);
    }

    if (reviewsResponse?.result) {
      tripReviews.value = reviewsResponse.result;
    }
  } catch (error) {
    console.error("Error fetching review data:", error);
    ElMessage.error("Có lỗi khi tải dữ liệu đánh giá");
  } finally {
    reviewLoading.value = false;
  }
};

// Submit review
const submitReview = async () => {
  if (!userStore.isLoggedIn) {
    ElMessage.warning("Bạn cần đăng nhập để gửi đánh giá!");
    return;
  }

  if (!selectedTripId.value) {
    ElMessage.warning("Không tìm thấy thông tin chuyến xe");
    return;
  }

  try {
    // Fix type errors in reviewData
    const reviewData: any = {
      trip_id: selectedTripId.value,
      desc: userReview.value,
      rating: userRating.value
    };
    
    // Add company_id only if it exists to avoid type errors
    if (tripDetail.value && 'company' in tripDetail.value) {
      reviewData.company_id = (tripDetail.value as any).company?.id;
    }

    await createEvaluateAPI(reviewData);
    ElMessage.success("Đánh giá của bạn đã được gửi thành công!");
    userReview.value = '';

    // Refresh review data
    await fetchReviewData(selectedTripId.value);
  } catch (error) {
    console.error("Error submitting review:", error);
    ElMessage.error("Có lỗi khi gửi đánh giá");
  }
};

</script>

<template>
  <div class="container mx-auto">
    <div class="w-full">
      <!-- Phần header và tìm kiếm -->
      <div class="mt-5 mx-2 md:mx-0">
        <SelectTrip_v2 />
      </div>

      <!-- Phần lọc và kết quả tìm kiếm -->
      <div class="mt-5 mx-2 md:mx-0 flex flex-col md:flex-row gap-4">
        <!-- Phần bộ lọc -->
        <div class="w-full md:w-[300px] bg-white rounded-2xl p-4 shadow-md h-min [@media(max-width:450px)]:hidden">
          <div class="flex justify-between items-center mb-5">
            <h2 class="text-base">BỘ LỌC TÌM KIẾM</h2>
            <el-button type="danger" text>
              Bỏ lọc <el-icon class="el-icon--right">
                <Delete />
              </el-icon>
            </el-button>
          </div>

          <el-collapse accordion>
            <el-collapse-item title="Consistency" name="1">
              <template #title>
                <span class="font-semibold text-lg"> Giờ đi </span>
              </template>
              <div>
                <el-checkbox-group v-model="filterTime" class="flex flex-col px-4">
                  <el-checkbox label="00:00 - 06:00" :value="'0-6'" size="large" />
                  <el-checkbox label="06:00 - 12:00" :value="'6-12'" size="large" />
                  <el-checkbox label="12:00 - 18:00" :value="'12-18'" size="large" />
                  <el-checkbox label="18:00 - 24:00" :value="'18-24'" size="large" />
                </el-checkbox-group>

              </div>
            </el-collapse-item>
            <el-collapse-item name="2">
              <template #title>
                <span class="font-semibold text-lg"> Nhà xe </span>
              </template>
              <div>
                <el-checkbox-group class="flex flex-col px-4" v-model="filterCompanies">
                  <el-checkbox v-for="company in uniqueCompanies" :key="company.id" :label="company.company.name"
                    :value="company.id" size="large" />
                </el-checkbox-group>
              </div>
            </el-collapse-item>
            <el-collapse-item name="3">
              <template #title>
                <span class="font-semibold text-lg"> Giá vé </span>
              </template>
              <div class="px-4">
                <el-slider />
              </div>
            </el-collapse-item>
            <el-collapse-item name="4">
              <template #title>
                <span class="font-semibold text-lg"> Loại xe </span>
              </template>
              <div>
                <el-checkbox-group class="flex flex-col px-4">
                  <el-checkbox label="Ghế ngồi" :value="'0-6'" size="large" />
                  <el-checkbox label="Ghế ngồi limousine" :value="'6-12'" size="large" />
                  <el-checkbox label="Giường nằm" :value="'12-18'" size="large" />
                  <el-checkbox label="Giường nằm limousine" :value="'18-24'" size="large" />
                  <el-checkbox label="Phòng VIP (Cabin)" :value="'18-24'" size="large" />
                </el-checkbox-group>

              </div>
            </el-collapse-item>
            <el-collapse-item name="5">
              <template #title>
                <span class="font-semibold text-lg"> Đánh giá </span>
              </template>
              <div class="flex flex-col px-4">
                <el-rate size="large" />
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>

        <!-- Nút lọc trên mobile -->
        <div class="sm:hidden mb-4">
          <el-button type="primary" @click="showFilterDrawer = true">
            <el-icon>
              <Filter />
            </el-icon>
            Bộ lọc
          </el-button>
        </div>

        <!-- Drawer hiển thị bộ lọc trên mobile -->
        <el-drawer v-model="showFilterDrawer" direction="btt" size="50%" :with-header="false">
          <div class="p-4 bg-white rounded-2xl">
            <div class="flex justify-between items-center mb-5">
              <h2 class="text-lg">BỘ LỌC TÌM KIẾM</h2>
              <el-button type="danger" text>
                Bỏ lọc
                <el-icon class="el-icon--right">
                  <Delete />
                </el-icon>
              </el-button>
            </div>
            <el-collapse accordion>
              <el-collapse-item name="1">
                <template #title><span class="font-semibold text-lg"> Giờ đi </span></template>
                <div>
                  <el-checkbox-group v-model="filterTime" class="flex flex-col px-4">
                    <el-checkbox label="00:00 - 06:00" :value="'0-6'" size="large" />
                    <el-checkbox label="06:00 - 12:00" :value="'6-12'" size="large" />
                    <el-checkbox label="12:00 - 18:00" :value="'12-18'" size="large" />
                    <el-checkbox label="18:00 - 24:00" :value="'18-24'" size="large" />
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item name="2">
                <template #title><span class="font-semibold text-lg"> Nhà xe </span></template>
                <div>
                  <el-checkbox-group class="flex flex-col px-4" v-model="filterCompanies">
                    <el-checkbox v-for="company in uniqueCompanies" :key="company.id" :label="company.company.name"
                      :value="company.id" size="large" />
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item name="3">
                <template #title><span class="font-semibold text-lg"> Giá vé </span></template>
                <div class="px-4"><el-slider /></div>
              </el-collapse-item>
              <el-collapse-item name="4">
                <template #title><span class="font-semibold text-lg"> Loại xe </span></template>
                <div>
                  <el-checkbox-group class="flex flex-col px-4">
                    <el-checkbox label="Ghế ngồi" :value="'0-6'" size="large" />
                    <el-checkbox label="Ghế ngồi limousine" :value="'6-12'" size="large" />
                    <el-checkbox label="Giường nằm" :value="'12-18'" size="large" />
                    <el-checkbox label="Giường nằm limousine" :value="'18-24'" size="large" />
                    <el-checkbox label="Phòng VIP (Cabin)" :value="'18-24'" size="large" />
                  </el-checkbox-group>
                </div>
              </el-collapse-item>
              <el-collapse-item name="5">
                <template #title><span class="font-semibold text-lg"> Đánh giá </span></template>
                <div class="flex flex-col px-4">
                  <el-rate size="large" />
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
        </el-drawer>

        <!-- Kết quả tìm kiếm -->
        <div class="w-full">
          <div class="mb-4 flex-1">
            <h1 class="text-xl font-bold">
              Kết quả tìm kiếm ({{ tripData.length > 0 ? tripData.length : "0" }})
            </h1>
          </div>

          <!-- Loading indicator -->
          <div v-if="loading" class="w-full flex justify-center items-center my-10">
            <el-skeleton animated :rows="5" />
          </div>

          <!-- No trips found and no connected trips -->
          <div v-else-if="tripData.length === 0 && connectedTrips.length === 0"
            class="text-center p-8 bg-white rounded-lg shadow">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-400" fill="none"
              viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 class="mt-4 text-lg font-medium text-gray-900">Không tìm thấy chuyến xe nào</h3>
            <p class="mt-2 text-sm text-gray-500">Vui lòng thử lại với điểm đi, điểm đến hoặc ngày khác.</p>
          </div>

          <!-- Connected trips when no direct trips are found -->
          <div v-else-if="tripData.length === 0 && connectedTrips.length > 0">
            <SmartRouteSuggestion :connectedTrips="connectedTrips" @selectConnection="handleSelectConnectedTrip" />
          </div>

          <!-- Direct trips list -->
          <div v-else>
            <div class="mt-8 mb-8">
              <!-- <h2 class="text-lg font-semibold mb-2 text-blue-600">Danh sách chuyến đi ({{ tripData.length }})</h2> -->
              <div v-if="loading" class="loading-container">
                <el-skeleton :rows="5" animated />
              </div>

              <div v-if="!loading" class="hidden sm:flex flex-col gap-4">
                <div v-for="trip in tripData" :key="trip.id" :class="[
                  'trip-card rounded-2xl bg-white pt-4',
                  selectedTripId === trip.id
                    ? 'border-[#03ACFF] border-[3px]'
                    : '',
                ]" :loading="loading">
                  <div class="flex justify-between mx-4">
                    <!-- Ảnh -->
                    <div
                      class="flex items-center gap-2 rounded overflow-hidden border border-gray-300 h-[140px] w-[200px]">
                      <img :src="trip.company.url_vehicle_online" class="w-full object-cover" loading="eager"
                        alt="Vehicle image for company" />
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
                              <el-rate :model-value="getTripRating(trip.id)" disabled show-score text-color="#ff9900"
                                score-template="{value}" />
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
                              <span class="text-sm text-white items-center">-10%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div class="flex text-base font-medium my-1">
                        <div class="flex flex-col">
                          <div class="flex items-center gap-2">
                            <el-icon :style="{ color: 'red', fontSize: '1.5rem' }">
                              <Place />
                            </el-icon>
                            <span class="text-black text-xl w-16 text-center">
                              {{
                                calculateTotalTime(
                                  trip.time_departure,
                                  trip.departureInfo.time
                                )
                              }}
                            </span>
                            <el-icon style="color: #99a9bf">
                              <CaretRight />
                            </el-icon>
                            <span class="text-black text-md">{{
                              trip.departureInfo.pointName
                            }}</span>
                          </div>
                          <div class="py-[1px] flex items-center gap-2">
                            <el-icon :style="{
                              fontSize: '1.5rem',
                              transform: 'rotate(90deg)',
                              color: '#909295',
                            }">
                              <Minus />
                            </el-icon>
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
                            <el-icon :style="{ color: '#3B82F6', fontSize: '1.5rem' }">
                              <LocationFilled />
                            </el-icon>
                            <span class="text-black text-xl w-16 text-center">
                              {{
                                calculateTotalTime(
                                  trip.time_departure,
                                  trip.destinationInfo.time
                                )
                              }}
                            </span>
                            <el-icon style="color: #99a9bf">
                              <CaretRight />
                            </el-icon>
                            <span class="text-black text-md">
                              {{ trip.destinationInfo.pointName }}</span>
                          </div>
                        </div>
                        <div class="text-white px-3 py-1 rounded ml-auto flex items-end">
                          <span class="text-amber-600 text-md">Còn {{ trip.tickets_available }} chỗ trống</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Tabs -->
                  <div class="relative">
                    <div class="border-t border-gray-300"></div>

                    <el-button v-if="!activeTabs[trip.id]" type="primary" round
                      class="absolute bottom-[-35px] right-4 z-10 mt-[3px]" @click="openTrip(trip.id)">
                      <span class="mx-2">Chọn chuyến</span>
                    </el-button>
                    <el-button v-else type="danger" round class="absolute bottom-[-35px] right-4 z-10 mt-[3px]"
                      @click="closeTrip(trip.id)">
                      <span class="mx-2">Đóng</span>
                    </el-button>
                  </div>

                  <el-tabs v-model="activeTabs[trip.id]" class="demo-tabs relative z-0" @tab-click="
                    (tab: any): void => {
                      handleClickTab(trip.id, tab);
                    }
                  ">
                    <el-tab-pane label="Chọn ghế" :name="1" class="">
                      <div class="mt-5 items-center">
                        <el-steps :active="activeStep" align-center finish-status="success">
                          <el-step title="Chỗ mong muốn" />
                          <el-step title="Điểm đón/trả" />
                        </el-steps>
                      </div>
                      <div v-if="selectedStep === 1">
                        <el-row>
                          <el-col :span="8">
                            <div class="flex flex-col mt-5 mx-4 bg-[#f5f5f5] rounded-xl p-2">
                              <span class="text-base font-semibold">Chú thích</span>
                              <div class="mt-3">
                                <el-button circle class="mx-2"></el-button>
                                Còn trống
                              </div>
                              <div class="mt-3">
                                <el-button circle class="mx-2" type="info"></el-button>
                                Đã đặt
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="16" class="flex justify-center">
                            <div v-if="tripDetail" class="flex flex-wrap justify-center gap-8 mb-5 mt-5">
                              <div v-for="floor in getFloors" :key="floor" class="flex flex-col items-center">
                                <h3 class="text-base">Tầng {{ floor }}</h3>
                                <div class="flex flex-col bg-[#f5f5f5] rounded-xl p-2">
                                  <div v-for="row in getRows(floor)" :key="row" style="display: flex">
                                    <div v-for="col in getColumns" :key="col" style="margin: 5px" class="">
                                      <el-tooltip :content="'Số ghế: ' +
                                        getSeatName(floor, row, col) +
                                        ' -  Giá:' +
                                        ' ' +
                                        getBasePrice(floor, row, col)
                                        " placement="top">
                                        <el-button circle size="large" class="mx-2"
                                          :disabled="getSeatStatus(floor, row, col)"
                                          :class="getButtonClass(floor, row, col)" :type="getSeatStatus(floor, row, col)
                                            ? 'info'
                                            : isSeatSelected(floor, row, col)
                                              ? 'danger'
                                              : ''
                                            " @click="
                                              toggleSeatSelection(floor, row, col)
                                              ">{{
                                                getSeatName(floor, row, col)
                                              }}</el-button>
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
                              <el-select v-model="selectedPointUpId" filterable allow-create default-first-option
                                class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                <el-option v-for="item in optionsPointUp" :key="item.id" :label="item.name"
                                  :value="item.id" class="mb-[2px]">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-sm">
                                      •
                                      {{
                                        calculateTotalTime(
                                          item.start_time,
                                          item.time_point
                                        )
                                      }}
                                      - {{ item.name }}</span>
                                    <span class="text-xs text-gray-600">{{
                                      item.address
                                    }}</span>
                                  </div>
                                </el-option>
                              </el-select>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="bg-gray-100 rounded-xl p-4 m-2 mt-5">
                              <span>Thông tin điểm trả</span>
                              <el-select v-model="selectedPointDownId" filterable allow-create default-first-option
                                class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                <el-option v-for="item in optionsPointDown" :key="item.id" :label="item.name"
                                  :value="item.id" class="mb-[2px]">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-sm">
                                      •
                                      {{
                                        calculateTotalTime(
                                          item.start_time,
                                          item.time_point
                                        )
                                      }}
                                      - {{ item.name }}</span>
                                    <span class="text-xs text-gray-600">{{
                                      item.address
                                    }}</span>
                                  </div>
                                </el-option>
                              </el-select>
                            </div>
                          </el-col>
                        </el-row>
                        <div class="flex justify-center items-center mt-5 mb-5">
                          <span class="text-sm italic text-gray-500">
                            * Vui lòng chọn hoặc nhập điểm đón và điểm trả
                          </span>
                        </div>
                      </div>
                      <div class="w-full bg-[#4D5054] rounded-b-[14px] px-5">
                        <div class="flex justify-between items-center py-2">
                          <div class="text-white flex justify-center items-center">
                            <el-button color="#fff" @click="preStep" v-if="selectedStep === 2" class="mr-5">
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
                            <span class="text-white text-sm mr-5">Tổng cộng: {{ totalPrice }}</span>
                            <el-button color="#fff" @click="nextStep" v-if="selectedTicket.length >= 1">Tiếp
                              tục</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Lịch trình" :name="2">
                      <div class="p-4">
                        <el-row :gutter="20">
                          <el-col :span="12">
                            <h3 class="text-lg font-semibold mb-2">Điểm đón</h3>
                            <ul class="list-disc pl-5">
                              <el-scrollbar height="400px">
                                <li v-for="point in optionsPointUp" :key="point.id" class="mb-2">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-base">{{
                                      point.name
                                    }}</span>
                                    <span class="text-sm text-gray-500">{{
                                      point.address
                                    }}</span>
                                    <span class="text-sm text-gray-400">
                                      Thời gian:
                                      {{
                                        calculateTotalTime(
                                          point.start_time,
                                          point.time_point
                                        )
                                      }}
                                    </span>
                                  </div>
                                </li>
                              </el-scrollbar>
                            </ul>
                          </el-col>
                          <el-col :span="12">
                            <h3 class="text-lg font-semibold mb-2">Điểm trả</h3>
                            <ul class="list-disc pl-5">
                              <el-scrollbar height="400px">
                                <li v-for="point in optionsPointDown" :key="point.id" class="mb-2">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-base">{{
                                      point.name
                                    }}</span>
                                    <span class="text-sm text-gray-500">{{
                                      point.address
                                    }}</span>
                                    <span class="text-sm text-gray-400">
                                      Thời gian:
                                      {{
                                        calculateTotalTime(
                                          point.start_time,
                                          point.time_point
                                        )
                                      }}
                                    </span>
                                  </div>
                                </li>
                              </el-scrollbar>
                            </ul>
                          </el-col>
                        </el-row>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Trung chuyển" :name="3">
                      <div class="prose p-4" v-html="tripDetail?.transit_content">
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Chính sách" :name="4">
                      <div class="prose p-4" v-html="tripDetail?.policy_content">
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Đánh giá" :name="6">
                      <div class="prose p-4">
                        <div v-if="reviewLoading" class="text-center">
                          <el-skeleton :rows="3" animated />
                        </div>
                        <div v-else>
                          <!-- Summary of reviews -->
                          <div class="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div class="flex items-center justify-between">
                              <div>
                                <h3 class="text-lg font-semibold">Đánh giá tổng quan</h3>
                                <p class="text-gray-600">Tổng số: {{ tripAverageRating?.totalReviews || 0 }} đánh giá
                                </p>
                              </div>
                              <div class="text-right">
                                <div class="flex items-center">
                                  <span class="text-2xl font-bold mr-2">{{ tripAverageRating?.averageRating?.toFixed(1)
                                    || 0
                                  }}</span>
                                  <el-rate :model-value="tripAverageRating?.averageRating || 0" disabled show-score />
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- List of reviews -->
                          <div class="border-t pt-4">
                            <h3 class="text-lg font-semibold mb-4">Tất cả đánh giá</h3>

                            <div v-if="tripReviews.length === 0" class="text-center p-8 text-gray-500">
                              Chưa có đánh giá nào cho chuyến xe này
                            </div>

                            <div v-else class="space-y-2">
                              <div v-for="review in tripReviews" :key="review.id" class="border-b pb-4 flex flex-col">
                                <div class="flex items-center">
                                  <img :src="review.account_avatar || 'https://via.placeholder.com/40'"
                                    class="w-8 h-8 rounded-full mr-2 object-cover" alt="Avatar" />
                                  <p class="text-base font-semibold">{{ review.account_name }}</p>
                                  <span class="text-xs text-gray-500 ml-2">
                                    {{ dayjs(review.created_at).format('DD/MM/YYYY') }}
                                  </span>
                                </div>
                                <div class="w-content pl-12">
                                  <el-rate :model-value="review.rating" disabled />
                                  <p class="text-gray-700">{{ review.desc }}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </div>
              </div>

              <!-- Hiển thị chuyến xe trên mobile -->
              <div v-if="!loading" class="block sm:hidden">
                <div v-for="trip in tripData" :key="trip.id" class="w-full h-full">
                  <div :class="[
                    'trip-card w-[150%] rounded-2xl bg-white pt-4 shadow-md',
                    selectedTripId === trip.id ? 'border-[#03ACFF] border-[3px]' : ''
                  ]">
                    <div class="flex flex-col px-4 pb-4 gap-2">
                      <!-- Tên nhà xe và giá -->
                      <div class="flex justify-between items-center">
                        <span class="text-base font-semibold truncate">{{ trip.company.name }}</span>
                        <span class="text-base font-bold text-red-500">
                          {{ Number(trip.route.base_price).toLocaleString("vi-VN") }}đ
                        </span>
                      </div>

                      <!-- Điểm đi - điểm đến -->
                      <div class="flex flex-col gap-1">
                        <div class="flex items-center gap-2">
                          <el-icon :style="{ color: 'red', fontSize: '1.25rem' }">
                            <Place />
                          </el-icon>
                          <span class="text-sm text-black">{{ trip.departureInfo.pointName }}</span>
                          <span class="text-xs text-gray-500 ml-auto">
                            {{ calculateTotalTime(trip.time_departure, trip.departureInfo.time) }}
                          </span>
                        </div>
                        <div class="flex items-center gap-2">
                          <el-icon :style="{ color: '#3B82F6', fontSize: '1.25rem' }">
                            <LocationFilled />
                          </el-icon>
                          <span class="text-sm text-black">{{ trip.destinationInfo.pointName }}</span>
                          <span class="text-xs text-gray-500 ml-auto">
                            {{ calculateTotalTime(trip.time_departure, trip.destinationInfo.time) }}
                          </span>
                        </div>
                      </div>

                      <!-- Số chỗ trống -->
                      <div class="flex justify-between items-center mt-2">
                        <span class="text-sm text-gray-500">{{ trip.seat_map.name }}</span>
                        <span class="text-amber-600 text-sm font-medium">Còn {{ trip.tickets_available }} chỗ</span>
                      </div>

                      <!-- Nút chọn chuyến -->
                      <div class="relative">
                        <el-button type="primary" round class="absolute bottom-[-35px] right-4 z-10 mt-[3px]"
                          @click="openDrawerTrip(trip.id)">
                          <span class="mx-2">Chọn chuyến</span>
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Drawer hiển thị chi tiết chuyến xe trên mobile -->
              <el-drawer v-model="drawerVisible" direction="btt" size="80%" title="Thông tin chuyến">
                <template v-if="selectedTripId">
                  <el-tabs v-model="activeTabs[selectedTripId]" class="demo-tabs relative z-0"
                    @tab-click="(tab: any) => handleClickTab(selectedTripId!, tab)">
                    <el-tab-pane label="Chọn ghế" :name="1" class="">
                      <div class="mt-5 items-center">
                        <el-steps :active="activeStep" align-center finish-status="success">
                          <el-step title="Chỗ mong muốn" />
                          <el-step title="Điểm đón/trả" />
                        </el-steps>
                      </div>
                      <div v-if="selectedStep === 1">
                        <el-row>
                          <el-col :span="8">
                            <div class="flex flex-col mt-5 mx-4 bg-[#f5f5f5] rounded-xl p-2">
                              <span class="text-base font-semibold">Chú thích</span>
                              <div class="mt-3">
                                <el-button circle class="mx-2"></el-button>
                                Còn trống
                              </div>
                              <div class="mt-3">
                                <el-button circle class="mx-2" type="info"></el-button>
                                Đã đặt
                              </div>
                            </div>
                          </el-col>
                          <el-col :span="16" class="flex justify-center">
                            <div v-if="tripDetail" class="flex flex-wrap justify-center gap-8 mb-5 mt-5">
                              <div v-for="floor in getFloors" :key="floor" class="flex flex-col items-center">
                                <h3 class="text-base">Tầng {{ floor }}</h3>
                                <div class="flex flex-col bg-[#f5f5f5] rounded-xl p-2">
                                  <div v-for="row in getRows(floor)" :key="row" style="display: flex">
                                    <div v-for="col in getColumns" :key="col" style="margin: 5px" class="">
                                      <el-tooltip :content="'Số ghế: ' +
                                        getSeatName(floor, row, col) +
                                        ' -  Giá:' +
                                        ' ' +
                                        getBasePrice(floor, row, col)
                                        " placement="top">
                                        <el-button circle size="large" class="mx-2"
                                          :disabled="getSeatStatus(floor, row, col)"
                                          :class="getButtonClass(floor, row, col)" :type="getSeatStatus(floor, row, col)
                                            ? 'info'
                                            : isSeatSelected(floor, row, col)
                                              ? 'danger'
                                              : ''
                                            " @click="
                                              toggleSeatSelection(floor, row, col)
                                              ">{{
                                                getSeatName(floor, row, col)
                                              }}</el-button>
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
                              <el-select v-model="selectedPointUpId" filterable allow-create default-first-option
                                class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                <el-option v-for="item in optionsPointUp" :key="item.id" :label="item.name"
                                  :value="item.id" class="mb-[2px]">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-sm">
                                      •
                                      {{
                                        calculateTotalTime(
                                          item.start_time,
                                          item.time_point
                                        )
                                      }}
                                      - {{ item.name }}</span>
                                    <span class="text-xs text-gray-600">{{
                                      item.address
                                    }}</span>
                                  </div>
                                </el-option>
                              </el-select>
                            </div>
                          </el-col>
                          <el-col :span="12">
                            <div class="bg-gray-100 rounded-xl p-4 m-2 mt-5">
                              <span>Thông tin điểm trả</span>
                              <el-select v-model="selectedPointDownId" filterable allow-create default-first-option
                                class="w-60 border bg-gray-100 border-gray-300 rounded-lg p-[1px] shadow-sm hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                                <el-option v-for="item in optionsPointDown" :key="item.id" :label="item.name"
                                  :value="item.id" class="mb-[2px]">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-sm">
                                      •
                                      {{
                                        calculateTotalTime(
                                          item.start_time,
                                          item.time_point
                                        )
                                      }}
                                      - {{ item.name }}</span>
                                    <span class="text-xs text-gray-600">{{
                                      item.address
                                    }}</span>
                                  </div>
                                </el-option>
                              </el-select>
                            </div>
                          </el-col>
                        </el-row>
                        <div class="flex justify-center items-center mt-5 mb-5">
                          <span class="text-sm italic text-gray-500">
                            * Vui lòng chọn hoặc nhập điểm đón và điểm trả
                          </span>
                        </div>
                      </div>
                      <div class="w-full bg-[#4D5054] rounded-b-[14px] px-5">
                        <div class="flex justify-between items-center py-2">
                          <div class="text-white flex justify-center items-center">
                            <el-button color="#fff" @click="preStep" v-if="selectedStep === 2" class="mr-5">
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
                            <span class="text-white text-sm mr-5">Tổng cộng: {{ totalPrice }}</span>
                            <el-button color="#fff" @click="nextStep" v-if="selectedTicket.length >= 1">Tiếp
                              tục</el-button>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Lịch trình" :name="2">
                      <div class="p-4">
                        <el-row :gutter="20">
                          <el-col :span="12">
                            <h3 class="text-lg font-semibold mb-2">Điểm đón</h3>
                            <ul class="list-disc pl-5">
                              <el-scrollbar height="400px">
                                <li v-for="point in optionsPointUp" :key="point.id" class="mb-2">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-base">{{
                                      point.name
                                    }}</span>
                                    <span class="text-sm text-gray-500">{{
                                      point.address
                                    }}</span>
                                    <span class="text-sm text-gray-400">
                                      Thời gian:
                                      {{
                                        calculateTotalTime(
                                          point.start_time,
                                          point.time_point
                                        )
                                      }}
                                    </span>
                                  </div>
                                </li>
                              </el-scrollbar>
                            </ul>
                          </el-col>
                          <el-col :span="12">
                            <h3 class="text-lg font-semibold mb-2">Điểm trả</h3>
                            <ul class="list-disc pl-5">
                              <el-scrollbar height="400px">
                                <li v-for="point in optionsPointDown" :key="point.id" class="mb-2">
                                  <div class="flex flex-col">
                                    <span class="font-semibold text-base">{{
                                      point.name
                                    }}</span>
                                    <span class="text-sm text-gray-500">{{
                                      point.address
                                    }}</span>
                                    <span class="text-sm text-gray-400">
                                      Thời gian:
                                      {{
                                        calculateTotalTime(
                                          point.start_time,
                                          point.time_point
                                        )
                                      }}
                                    </span>
                                  </div>
                                </li>
                              </el-scrollbar>
                            </ul>
                          </el-col>
                        </el-row>
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Trung chuyển" :name="3">
                      <div class="prose p-4" v-html="tripDetail?.transit_content">
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Chính sách" :name="4">
                      <div class="prose p-4" v-html="tripDetail?.policy_content">
                      </div>
                    </el-tab-pane>
                    <el-tab-pane label="Đánh giá" :name="6">
                      <div class="prose p-4">
                        <div v-if="reviewLoading" class="text-center">
                          <el-skeleton :rows="3" animated />
                        </div>
                        <div v-else>
                          <!-- Summary of reviews -->
                          <div class="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm">
                            <div class="flex items-center justify-between">
                              <div>
                                <h3 class="text-lg font-semibold">Đánh giá tổng quan</h3>
                                <p class="text-gray-600">Tổng số: {{ tripAverageRating?.totalReviews || 0 }} đánh giá
                                </p>
                              </div>
                              <div class="text-right">
                                <div class="flex items-center">
                                  <span class="text-2xl font-bold mr-2">{{ tripAverageRating?.averageRating?.toFixed(1)
                                    || 0
                                  }}</span>
                                  <el-rate :model-value="tripAverageRating?.averageRating || 0" disabled show-score />
                                </div>
                              </div>
                            </div>
                          </div>

                          <!-- List of reviews -->
                          <div class="border-t pt-4">
                            <h3 class="text-lg font-semibold mb-4">Tất cả đánh giá</h3>

                            <div v-if="tripReviews.length === 0" class="text-center p-8 text-gray-500">
                              Chưa có đánh giá nào cho chuyến xe này
                            </div>

                            <div v-else class="space-y-2">
                              <div v-for="review in tripReviews" :key="review.id" class="border-b pb-4 flex flex-col">
                                <div class="flex items-center">
                                  <img :src="review.account_avatar || 'https://via.placeholder.com/40'"
                                    class="w-8 h-8 rounded-full mr-2 object-cover" alt="Avatar" />
                                  <p class="text-base font-semibold">{{ review.account_name }}</p>
                                  <span class="text-xs text-gray-500 ml-2">
                                    {{ dayjs(review.created_at).format('DD/MM/YYYY') }}
                                  </span>
                                </div>
                                <div class="w-content pl-12">
                                  <el-rate :model-value="review.rating" disabled />
                                  <p class="text-gray-700">{{ review.desc }}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </el-tab-pane>
                  </el-tabs>
                </template>
              </el-drawer>

              <!-- Các chuyến xe -->
              <div v-if="connectedTrips.length > 0" class="mt-8">
                <h2 class="text-lg font-semibold mb-2 text-blue-600">Đề xuất chuyến nối ({{ connectedTrips.length }})
                </h2>
                <el-card v-for="(connectedTrip, index) in connectedTrips" :key="`connected-${index}`"
                  class="mb-4 border-l-4 border-blue-500" shadow="hover">
                  <div class="flex flex-col space-y-4">
                    <!-- Chuyến thứ nhất -->
                    <div class="flex items-start space-x-4 p-2 bg-blue-50 rounded-md">
                      <div class="w-1/6 text-center">
                        <div class="text-lg font-bold">{{ connectedTrip.firstTrip.time_departure }}</div>
                        <div class="text-sm">{{ formatDate(connectedTrip.firstTrip.dateDeparture) }}</div>
                      </div>
                      <div class="w-3/6">
                        <div class="font-semibold">{{ connectedTrip.firstTrip.company.name }}</div>
                        <div class="text-sm">
                          <span class="font-semibold">Từ:</span> {{ connectedTrip.firstTrip.departureInfo.pointName }}
                          <span class="text-xs">({{ connectedTrip.firstTrip.departureInfo.province }})</span>
                        </div>
                        <div class="text-sm">
                          <span class="font-semibold">Đến:</span> {{ connectedTrip.connectionPoint.pointName }}
                          <span class="text-xs">({{ connectedTrip.connectionPoint.province.name }})</span>
                        </div>
                      </div>
                      <div class="w-2/6 text-right">
                        <div class="text-blue-600 font-semibold">
                          {{ formatCurrency(connectedTrip.firstTrip.route.base_price) }}
                        </div>
                        <div class="text-sm">{{ connectedTrip.firstTrip.tickets_available || 0 }} ghế trống</div>
                      </div>
                    </div>

                    <!-- Hiển thị điểm nối -->
                    <div
                      class="flex items-center justify-center text-sm text-orange-500 py-2 border-dashed border-y border-gray-300">
                      <i class="el-icon-time mr-1"></i> Thời gian chờ tại {{ connectedTrip.connectionPoint.province.name
                      }}: {{
                        connectedTrip.waitingTime }}
                    </div>

                    <!-- Chuyến thứ hai -->
                    <div class="flex items-start space-x-4 p-2 bg-blue-50 rounded-md">
                      <div class="w-1/6 text-center">
                        <div class="text-lg font-bold">{{ connectedTrip.secondTrip.time_departure }}</div>
                        <div class="text-sm">{{ formatDate(connectedTrip.secondTrip.dateDeparture) }}</div>
                      </div>
                      <div class="w-3/6">
                        <div class="font-semibold">{{ connectedTrip.secondTrip.company.name }}</div>
                        <div class="text-sm">
                          <span class="font-semibold">Từ:</span> {{ connectedTrip.connectionPoint.pointName }}
                          <span class="text-xs">({{ connectedTrip.connectionPoint.province.name }})</span>
                        </div>
                        <div class="text-sm">
                          <span class="font-semibold">Đến:</span> {{ connectedTrip.secondTrip.destinationInfo.pointName
                          }}
                          <span class="text-xs">({{ connectedTrip.secondTrip.destinationInfo.province }})</span>
                        </div>
                      </div>
                      <div class="w-2/6 text-right">
                        <div class="text-blue-600 font-semibold">
                          {{ formatCurrency(connectedTrip.secondTrip.route.base_price) }}
                        </div>
                        <div class="text-sm">{{ connectedTrip.secondTrip.tickets_available || 0 }} ghế trống</div>
                      </div>
                    </div>

                    <!-- Hiển thị tổng cộng -->
                    <div class="flex justify-between items-center pt-3 border-t border-gray-200">
                      <div class="text-gray-600">
                        <span class="font-semibold">Tổng tiền:</span>
                        <span class="text-red-600 font-bold text-lg">{{ formatCurrency(connectedTrip.totalPrice)
                        }}</span>
                      </div>
                      <el-button type="primary" @click="handleSelectConnectedTrip(connectedTrip)">
                        Đặt vé
                      </el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Connected Trip Seat Selection Modal -->
  <el-dialog v-model="showConnectedTripSeatSelection" :title="'Chọn ghế cho chuyến đi'" width="90%" destroy-on-close
    append-to-body>
    <ConnectedTripSeatSelection v-if="selectedConnectedTrip" :connectedTrip="selectedConnectedTrip"
      @proceed="handleConnectedTripProceed" />
  </el-dialog>
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

/* .el-divider--horizontal {
  margin: 0 !important;
  margin-top: 10px !important;
} */
.el-select__selected-item {
  margin-left: 10px;
}
</style>
