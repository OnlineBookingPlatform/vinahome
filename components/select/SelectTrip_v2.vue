<script setup lang="ts">
import {
  Switch,
  CaretBottom,
  Check,
  ArrowLeftBold,
  ArrowRightBold,
} from "@element-plus/icons-vue";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { getProvinces } from "~/api/locationAPI";
import { getTripOnPlatform } from "~/api/tripAPI";
import type { Province } from "~/types/LocationType";
import type { SearchTripParams } from "~/types/TripType";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";

// const isOpenPointDown = ref(false);
const isOpenNumberTicket = ref(false);
const isOpenDepartureDate = ref(false);

// const toggleDropdownPointUp = () => {
//   isOpenPointUp.value = !isOpenPointUp.value;
//   isOpenPointDown.value = false;
//   isOpenDepartureDate.value = false;
//   isOpenNumberTicket.value = false;
// };

// const toggleDropdownPointDown = () => {
//   isOpenPointDown.value = !isOpenPointDown.value;
//   isOpenPointUp.value = false;
//   isOpenDepartureDate.value = false;
//   isOpenNumberTicket.value = false;
// };

const toggleDropdownTicketNumber = () => {
  isOpenNumberTicket.value = !isOpenNumberTicket.value;
  // isOpenPointDown.value = false;
  isOpenDepartureDate.value = false;
};
const toggleDropdownDepartureDate = () => {
  isOpenDepartureDate.value = !isOpenDepartureDate.value;
  // isOpenPointDown.value = false;
  isOpenNumberTicket.value = false;
};

const radio = ref(1);

const optionsNumberTicket = ref([1, 2, 3, 4, 5]);

const selectNumberTicket = ref(1);

const selectDepartureDate = ref(new Date());

const selectOption = (option: number, event: Event) => {
  event.stopPropagation();
  selectNumberTicket.value = option;
  isOpenNumberTicket.value = false;
};

const weekDays = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const monthNames = [
  "Tháng 1",
  "Tháng 2",
  "Tháng 3",
  "Tháng 4",
  "Tháng 5",
  "Tháng 6",
  "Tháng 7",
  "Tháng 8",
  "Tháng 9",
  "Tháng 10",
  "Tháng 11",
  "Tháng 12",
];
const daysInMonth = ref<{ day: number | null; lunar: string | null }[]>([]);

const selectedYear = ref<number>(dayjs().year());
const selectedMonth = ref<number>(dayjs().month());
const formattedDate = ref<string>(dayjs().format("YYYY-MM-DD"));
const lunarMonths = [29, 30];

dayjs.locale("vi");

const capitalizeWords = (str: string) => {
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

const displayDate = computed(() => {
  const date = dayjs(formattedDate.value, "YYYY-MM-DD");
  const weekday = capitalizeWords(date.format("dddd"));

  return `${weekday}, ${date.format("DD/MM/YYYY")}`;
});

const getLunarDate = (year: number, month: number, day: number): string => {
  if (!day) return "";
  const totalDays = calculateDaysFromStartOfYear(year, month, day);
  let lunarMonth = 0;
  let lunarDay = totalDays + 1;

  while (lunarDay > lunarMonths[lunarMonth % 2]) {
    lunarDay -= lunarMonths[lunarMonth % 2];
    lunarMonth++;
  }

  return `${lunarDay}`;
};

const calculateDaysFromStartOfYear = (
  year: number,
  month: number,
  day: number
): number => {
  let totalDays = 0;
  for (let i = 0; i < month - 1; i++) {
    totalDays += dayjs(`${year}-${i + 1}-01`).daysInMonth();
  }
  totalDays += day;
  return totalDays;
};
const selectDate = (day: number, isNextMonth: boolean = false) => {
  const year =
    isNextMonth && selectedMonth.value === 11
      ? selectedYear.value + 1
      : selectedYear.value;
  const month = isNextMonth
    ? (selectedMonth.value + 1) % 12
    : selectedMonth.value;
  formattedDate.value = dayjs(new Date(year, month, day)).format("YYYY-MM-DD");
  console.log("Ngày được chọn:", formattedDate.value);
};

const isPastDate = (day: number | null, isNextMonth: boolean = false) => {
  if (day === null) return true;
  const year =
    isNextMonth && selectedMonth.value === 11
      ? selectedYear.value + 1
      : selectedYear.value;
  const month = isNextMonth
    ? (selectedMonth.value + 1) % 12
    : selectedMonth.value;
  return dayjs(`${year}-${month + 1}-${day}`).isBefore(dayjs(), "day");
};

const isSelectedDay = (day: number, isNextMonth: boolean = false) => {
  const year =
    isNextMonth && selectedMonth.value === 11
      ? selectedYear.value + 1
      : selectedYear.value;
  const month = isNextMonth
    ? (selectedMonth.value + 1) % 12
    : selectedMonth.value;

  return (
    formattedDate.value ===
    dayjs(`${year}-${month + 1}-${day}`).format("YYYY-MM-DD")
  );
};

const isToday = (day: number) => {
  return (
    dayjs().date() === day &&
    dayjs().month() === selectedMonth.value &&
    dayjs().year() === selectedYear.value
  );
};

const updateDaysInMonth = () => {
  const year = selectedYear.value;
  const month = selectedMonth.value;
  const firstDayIndex = dayjs(`${year}-${month + 1}-01`).day(); // Lấy thứ trong tuần của ngày đầu tháng
  const adjustedFirstDayIndex = (firstDayIndex + 6) % 7; // Điều chỉnh để phù hợp với weekDays

  const days: { day: number | null; lunar: string | null }[] = [];

  // Thêm các ô trống trước ngày 1 của tháng
  for (let i = 0; i < adjustedFirstDayIndex; i++) {
    days.push({ day: null, lunar: null });
  }

  // Thêm các ngày trong tháng
  for (
    let day = 1;
    day <= dayjs(`${year}-${month + 1}-01`).daysInMonth();
    day++
  ) {
    days.push({ day, lunar: getLunarDate(year, month + 1, day) });
  }

  daysInMonth.value = days;
};

const selectToday = () => {
  const today = dayjs();
  formattedDate.value = today.format("YYYY-MM-DD"); // Lưu ngày theo YYYY-MM-DD
  selectedYear.value = today.year();
  selectedMonth.value = today.month();
  updateDaysInMonth();
};
const prevMonth = () => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  // Chỉ cho phép quay lại nếu chưa về tháng hiện tại của năm hiện tại
  if (
    selectedYear.value > currentYear ||
    (selectedYear.value === currentYear && selectedMonth.value > currentMonth)
  ) {
    selectedMonth.value--;
    updateDaysInMonth();
  } else {
    console.log("Không thể quay lại tháng trước.");
  }
};

const nextMonth = () => {
  const currentMonth = dayjs().month();
  const currentYear = dayjs().year();

  // Chỉ cho phép tiến tới nếu chưa vượt quá tháng 12 của năm hiện tại
  if (
    selectedYear.value < currentYear ||
    (selectedYear.value === currentYear && selectedMonth.value < 11)
  ) {
    selectedMonth.value++;
    updateDaysInMonth();
  } else {
    console.log("Không thể chuyển sang tháng sau.");
  }
};

onMounted(() => {
  updateDaysInMonth();
  selectToday();
});

const removeAccents = (str: string): string => {
  if (!str) return "";
  let normalized = str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
  const charMap: Record<string, string> = {
    đ: "d",
    ă: "a",
    â: "a",
    ê: "e",
    ô: "o",
    ơ: "o",
    ư: "u",
    " ": "-",
    _: "-",
    ".": "",
    ",": "",
  };
  normalized = normalized.replace(
    /[đăâêôơư _.,]/g,
    (match) => charMap[match] || ""
  );
  normalized = normalized.replace(/[^a-z0-9-]/g, "");
  return normalized;
};

// State quản lý điểm đi
const departureQuery = ref("");
const isOpenDeparture = ref(false);
const selectedDeparture = ref<Province | null>(null);

// State quản lý điểm đến
const destinationQuery = ref("");
const isOpenDestination = ref(false);
const selectedDestination = ref<Province | null>(null);

// Danh sách tỉnh/thành phố
const cityList = ref<Province[]>([]);
// Lấy danh sách tỉnh/thành phố
const fetchProvinces = async () => {
  try {
    const response = await getProvinces();
    if (response.result) {
      cityList.value = response.result;
    }
  } catch (error) {
    console.error("Error fetching provinces:", error);
  }
};

// Filter điểm đi
const filteredDepartures = computed(() => {
  if (!departureQuery.value) return cityList.value;
  const query = removeAccents(departureQuery.value);
  return cityList.value.filter((city) =>
    removeAccents(city.name).includes(query)
  );
});

// Filter điểm đến
const filteredDestinations = computed(() => {
  if (!destinationQuery.value) return cityList.value;
  const query = removeAccents(destinationQuery.value);
  return cityList.value.filter((city) =>
    removeAccents(city.name).includes(query)
  );
});

// Xử lý chọn điểm đi
const selectDeparture = (city: Province) => {
  selectedDeparture.value = city;
  departureQuery.value = city.name;
  isOpenDeparture.value = false;
  setTimeout(() => {
    isOpenDeparture.value = false;
  }, 100);
};

// Xử lý chọn điểm đến
const selectDestination = (city: Province) => {
  selectedDestination.value = city;
  destinationQuery.value = city.name;
  isOpenDestination.value = false;
  setTimeout(() => {
    isOpenDestination.value = false;
  }, 100);
};

// Đổi chỗ điểm đi và điểm đến
const swapLocations = () => {
  [departureQuery.value, destinationQuery.value] = [
    destinationQuery.value,
    departureQuery.value,
  ];
  [selectedDeparture.value, selectedDestination.value] = [
    selectedDestination.value,
    selectedDeparture.value,
  ];
};

// Mở dropdown điểm đi
const openDepartureDropdown = () => {
  isOpenDestination.value = false;
  isOpenDepartureDate.value = false;
  isOpenDeparture.value = true;
  isOpenNumberTicket.value = false;
  departureQuery.value = "";
};

// Mở dropdown điểm đến
const openDestinationDropdown = () => {
  isOpenDeparture.value = false;
  isOpenDestination.value = true;
  isOpenNumberTicket.value = false;
  isOpenDepartureDate.value = false;
  destinationQuery.value = "";
};
watch([selectedDeparture, selectedDestination], () => {
  isOpenDeparture.value = false;
  isOpenDestination.value = false;
});
// const handleSearchTrip = () => {
//   console.log("Tìm chuyến xe");
//   console.log("Điểm đi:", selectedDeparture.value?.id);
//   console.log("Điểm đến:", selectedDestination.value?.id);
//   console.log("Ngày đi:", formattedDate.value);
//   console.log("Số vé:", selectNumberTicket.value);
// };
const router = useRouter();
const handleSearchTrip = async () => {
  if (!selectedDeparture.value?.id) {
    ElMessage.error("Vui lòng chọn điểm đi!");
    return;
  }

  if (!selectedDestination.value?.id) {
    ElMessage.error("Vui lòng chọn điểm đến!");
    return;
  }

  if (!formattedDate.value) {
    ElMessage.error("Vui lòng chọn ngày đi!");
    return;
  }

  if (selectedDeparture.value.id === selectedDestination.value.id) {
    ElMessage.error("Điểm đi và điểm đến không được giống nhau!");
    return;
  }

  try {
    const params: SearchTripParams = {
      departureId: selectedDeparture.value.id,
      destinationId: selectedDestination.value.id,
      departureDate: formattedDate.value,
      numberOfTickets: selectNumberTicket.value || 1,
    };

    // const query = Object.fromEntries(
    //   Object.entries(params).filter(
    //     ([_, value]) => value !== undefined && value !== null
    //   )
    // );
    // console.log("Data select", query)

    await router.replace({
    path: '/ve-xe-khach',
    query: Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)])
    ),
  });
  } catch (err) {
    console.error("Lỗi chuyển trang:", err);
    alert("Có lỗi xảy ra khi tìm kiếm");
  }
};
onMounted(() => {
  fetchProvinces();
});
</script>

<template>
  <div class="bg-white p-5 rounded-xl shadow-lg flex flex-col gap-4 w-full relative">
    <!-- Hàng trên: Radio Group -->
    <div class="flex">
      <el-radio-group v-model="radio" class="flex gap-4">
        <el-radio :value="1" size="large">Một chiều</el-radio>
        <el-radio :value="2" size="large">Khứ hồi</el-radio>
      </el-radio-group>
    </div>

    <!-- Hàng dưới: Các ô nhập thông tin -->
    <div class="flex flex-wrap gap-4 items-center mb-[40px] md:flex-row flex-col">
      <!-- Điểm đi -->
      <div class="flex flex-col h-[70px] w-full md:flex-1">
        <span class="text-[13px] mb-1 text-black mx-2">Điểm đi</span>
        <div @click="isOpenDeparture = true" :class="{ 'ring-2 ring-blue-400': isOpenDeparture }"
          class="relative flex items-center border border-gray-300 rounded-lg p-1 py-[10px] px-2 w-full md:flex-1 h-[60px] cursor-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="w-5 h-5 mx-2" fill="#03ACFF">
            <path
              d="M16 144a144 144 0 1 1 288 0A144 144 0 1 1 16 144zM160 80c8.8 0 16-7.2 16-16s-7.2-16-16-16c-53 0-96 43-96 96c0 8.8 7.2 16 16 16s16-7.2 16-16c0-35.3 28.7-64 64-64zM128 480l0-162.9c10.4 1.9 21.1 2.9 32 2.9s21.6-1 32-2.9L192 480c0 17.7-14.3 32-32 32s-32-14.3-32-32z" />
          </svg>
          <input type="text" v-model="departureQuery" @input="isOpenDeparture = true" @focus="openDepartureDropdown"
            class="text-lg bg-white text-[15px] outline-none w-full"
            :placeholder="selectedDeparture ? '' : 'Nhập để tìm kiếm'" />
          <div v-if="isOpenDeparture"
            class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 p-2">
            <span class="text-sm font-semibold text-gray-700">TỈNH/THÀNH PHỐ</span>
            <el-scrollbar height="350px">
              <ul class="mt-2 space-y-1">
                <li v-if="filteredDepartures.length === 0" class="text-gray-500 p-2 text-center">
                  Không tìm thấy kết quả
                </li>
                <li v-for="city in filteredDepartures" :key="city.id"
                  class="p-2 cursor-pointer hover:bg-blue-50 rounded-md transition duration-150"
                  @click="selectDeparture(city)">
                  <div class="font-medium">{{ city.name }}</div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <!-- Nút đổi chỗ -->
      <div class="flex items-center justify-center md:mt-[28px] mt-0 z-0 md:mx-[-23px] mx-auto md:z-10">
        <el-button circle class="shadow-md" size="default" @click="swapLocations">
          <el-icon class="transition-transform duration-300 hover:rotate-180" color="#0072bc">
            <Switch />
          </el-icon>
        </el-button>
      </div>

      <!-- Điểm đến -->
      <div class="flex flex-col h-[70px] w-full md:flex-1">
        <span class="text-[13px] mb-1 text-black mx-2">Điểm đến</span>
        <div @click="isOpenDestination = true" :class="{ 'ring-2 ring-blue-400': isOpenDestination }"
          class="relative flex items-center border border-gray-300 rounded-lg p-1 py-[10px] px-2 w-full md:flex-1 h-[60px] cursor-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" class="w-5 h-5 mx-2" fill="#03ACFF">
            <path
              d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 128a64 64 0 1 1 0 128 64 64 0 1 1 0-128z" />
          </svg>
          <input type="text" v-model="destinationQuery" @input="isOpenDestination = true"
            @focus="openDestinationDropdown" class="text-lg bg-white text-[15px] outline-none w-full"
            :placeholder="selectedDestination ? '' : 'Nhập để tìm kiếm'" />
          <div v-if="isOpenDestination"
            class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 p-2">
            <span class="text-sm font-semibold text-gray-700">TỈNH/THÀNH PHỐ</span>
            <el-scrollbar height="350px">
              <ul class="mt-2 space-y-1">
                <li v-if="filteredDestinations.length === 0" class="text-gray-500 p-2 text-center">
                  Không tìm thấy kết quả
                </li>
                <li v-for="city in filteredDestinations" :key="city.id"
                  class="p-2 cursor-pointer hover:bg-blue-50 rounded-md transition duration-150"
                  @click="selectDestination(city)">
                  <div class="font-medium">{{ city.name }}</div>
                </li>
              </ul>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="flex flex-col h-[70px] w-full md:flex-1">
        <span class="text-[13px] mb-1 text-black mx-2">Ngày đi</span>
        <div @click="toggleDropdownDepartureDate" :class="{ 'ring-2 ring-blue-400': isOpenDepartureDate }"
          class="relative flex items-center border border-gray-300 rounded-lg p-1 py-[10px] px-2 w-full md:flex-1 h-[60px] cursor-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="w-5 h-5 mx-2" fill="#03ACFF">
            <path
              d="M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm64 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm128 0l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM64 400l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16z" />
          </svg>
          <span class="text-lg mx-2">{{ displayDate }}</span>
          <div v-if="isOpenDepartureDate"
            class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10 p-2">
            <div class="flex justify-between mb-2">
              <el-button @click.stop="prevMonth" :icon="ArrowLeftBold" circle />
              <div class="text-center font-semibold">
                <span class="text-md">{{ monthNames[selectedMonth] }}, {{ selectedYear }}</span>
              </div>
              <el-button @click.stop="nextMonth" :icon="ArrowRightBold" circle />
            </div>

            <div>
              <div class="grid grid-cols-7 gap-2 text-center text-sm font-semibold border-b py-2">
                <div v-for="(day, index) in weekDays" :key="index"
                  :class="index >= weekDays.length - 2 ? 'text-red-500' : ''">
                  {{ day }}
                </div>
              </div>

              <div class="grid grid-cols-7 gap-2 mt-2">
                <div v-for="(day, index) in daysInMonth" :key="index" @click="
                  day.day !== null &&
                  !isPastDate(day.day) &&
                  selectDate(day.day)
                  " :class="[
                    'text-center cursor-pointer',
                    day.day !== null && isSelectedDay(day.day)
                      ? 'bg-yellow-500 text-black rounded py-[2px]'
                      : '',
                    isPastDate(day.day)
                      ? 'text-gray-400 cursor-not-allowed'
                      : '',
                    day.day !== null && isToday(day.day)
                      ? 'text-[#0072bc] rounded hover:bg-blue-100 hover:rounded hover:shadow'
                      : '',
                    day.day !== null &&
                      !isSelectedDay(day.day) &&
                      !isToday(day.day) &&
                      !isPastDate(day.day)
                      ? 'hover:bg-blue-100 hover:rounded hover:shadow'
                      : '',
                  ]">
                  <span v-if="day.day">{{ day.day }}</span>
                  <br />
                  <small v-if="day.lunar" class="text-gray-500 block text-right mr-[5px] text-[11px] my-[2px]">
                    {{ day.lunar }}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex flex-col h-[70px] w-full md:flex-1" v-if="radio === 2">
        <span class="text-[13px] mb-1 text-black mx-2">Ngày về</span>
        <div
          class="border border-gray-300 rounded-lg p-1 px-2 w-full md:flex-1 h-[60px] focus-within:ring-2 focus-within:ring-blue-400 cursor-text">
          <input type="date" class="block bg-white text-[15px] outline-none w-full h-full" />
        </div>
      </div>

      <div class="flex flex-col h-[70px] w-full md:flex-1">
        <span class="text-[13px] mb-1 text-black mx-2">Số vé</span>
        <div @click="toggleDropdownTicketNumber" :class="{ 'ring-2 ring-blue-400': isOpenNumberTicket }"
          class="relative border border-gray-300 flex items-center rounded-lg p-1 py-[10px] px-2 w-full md:flex-1 h-[60px] cursor-text">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-5 h-5" fill="#03ACFF">
            <path
              d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
          </svg>
          <span class="text-lg mx-2">{{ selectNumberTicket }}</span>
          <div
            class="absolute top-1/2 right-2 -translate-y-1/2 flex items-center justify-center bg-gray-200 w-6 h-6 rounded pointer-events-none">
            <el-icon class="text-gray-600">
              <CaretBottom />
            </el-icon>
          </div>
          <div v-if="isOpenNumberTicket"
            class="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-1 z-10">
            <div v-for="option in optionsNumberTicket" :key="option"
              class="flex justify-between items-center px-4 py-2 text-[15px] hover:bg-blue-100 cursor-pointer w-full"
              :class="{ 'bg-blue-200': option === selectNumberTicket }" @click="(event) => selectOption(option, event)">
              <span class="text-lg">{{ option }}</span>
              <el-icon v-if="option === selectNumberTicket" class="text-blue-500">
                <Check />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      class="w-full flex justify-center mt-6 md:absolute md:bottom-[-25px] md:left-1/2 md:transform md:-translate-x-1/2">
      <button class="shadow-lg btn-search" @click="handleSearchTrip">
        Tìm chuyến xe
      </button>
    </div>
  </div>
</template>

<style>
.btn-search {
  width: 250px;
  height: 50px;
  border-radius: 9999px;
  /* Bo tròn 2 bên */
  font-size: 17px;
  padding: 12px 24px;
  background-color: #03acff;
  color: white;
}
</style>
