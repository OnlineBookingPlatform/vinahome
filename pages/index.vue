<script setup lang="ts">

import { Search } from "@element-plus/icons-vue";
import { ElMessage, type FormInstance } from "element-plus";
import { registerReceiveNewsAPI } from "~/api/newsAPI";
import SelectTrip_v2 from "~/components/select/SelectTrip_v2.vue";
import type { DTO_RQ_NewsType } from "~/types/NewsType";

const radio1 = ref('Vé xe khách')

// Dữ liệu tuyến đường
const routes = ref([
  {
    name: 'Sài Gòn - Đà Lạt',
    image: 'https://lh3.googleusercontent.com/proxy/uTgoaqDytL6PqMttFbnRi-nrJlcJ3fRVAz3rJwOHh1a8BXLQbUFMyLpQRqqGcw4OqBi9CcDGTvO6ZHPe5KnEYXABmcCksD9YXJBw3LQcYRnkmwKnReZgcDnrWOA4ZRNUV19IvrrmAWZD58k'
  },
  {
    name: 'Sài Gòn - Phan Thiết',
    image: 'https://lh3.googleusercontent.com/proxy/uTgoaqDytL6PqMttFbnRi-nrJlcJ3fRVAz3rJwOHh1a8BXLQbUFMyLpQRqqGcw4OqBi9CcDGTvO6ZHPe5KnEYXABmcCksD9YXJBw3LQcYRnkmwKnReZgcDnrWOA4ZRNUV19IvrrmAWZD58k'
  },
  {
    name: 'Hà Nội - Sapa',
    image: 'https://lh3.googleusercontent.com/proxy/uTgoaqDytL6PqMttFbnRi-nrJlcJ3fRVAz3rJwOHh1a8BXLQbUFMyLpQRqqGcw4OqBi9CcDGTvO6ZHPe5KnEYXABmcCksD9YXJBw3LQcYRnkmwKnReZgcDnrWOA4ZRNUV19IvrrmAWZD58k'
  },
  {
    name: 'Sài Gòn - Nha Trang',
    image: 'https://lh3.googleusercontent.com/proxy/uTgoaqDytL6PqMttFbnRi-nrJlcJ3fRVAz3rJwOHh1a8BXLQbUFMyLpQRqqGcw4OqBi9CcDGTvO6ZHPe5KnEYXABmcCksD9YXJBw3LQcYRnkmwKnReZgcDnrWOA4ZRNUV19IvrrmAWZD58k'
  },
  {
    name: 'Đà Nẵng - Huế',
    image: 'https://lh3.googleusercontent.com/proxy/uTgoaqDytL6PqMttFbnRi-nrJlcJ3fRVAz3rJwOHh1a8BXLQbUFMyLpQRqqGcw4OqBi9CcDGTvO6ZHPe5KnEYXABmcCksD9YXJBw3LQcYRnkmwKnReZgcDnrWOA4ZRNUV19IvrrmAWZD58k'
  }
]);

// Dữ liệu chỉ số carousel hiện tại
const currentIndex = ref(0);

const handleCarouselChange = (newIndex: number) => {
  currentIndex.value = newIndex;
};


// Đăng ký nhận bản tin
const receiveNews = ref<DTO_RQ_NewsType>({
  email: null
})
const submitFormReceiveNews = async () => {
  console.log('submit form', receiveNews.value)
  try {
    const response = await registerReceiveNewsAPI(receiveNews.value)
    console.log('response', response)
    if (response.status === 200) {
      ElMessage.success('Đăng ký nhận tin thành công')
    } else {
      ElMessage.error(response.message || 'Đăng ký nhận tin thất bại')
    }
  } catch (error) {
    ElMessage.error('Lỗi hệ thống, vui lòng thử lại sau.')
  }
}
</script>

<template>
  <section class="container mx-auto px-24 sm:px-4 xs:px-2 [@media(max-width:450px)]:px-0">
    <div class="relative overflow-hidden from-white to-blue-50 px-8 py-16">
      <img src="/static/xe-khach/Star3.png" class="absolute top-10 left-20 h-6 w-6 " />
      <img src="/static/xe-khach/Star3.png" class="absolute top-16 right-32 h-6 w-6 " />
      <img src="/static/xe-khach/Star3.png" class="absolute bottom-20 left-1/4 h-10 w-10 " />
      <img src="/static/xe-khach/Star3.png" class="absolute top-5 right-10 h-8 w-8" />
      <img src="/static/xe-khach/Star3.png" class="absolute bottom-32 left-10 h-7 w-7" />
      <img src="/static/xe-khach/Star3.png" class="absolute bottom-5 right-1/3 h-9 w-9" />
      <div class="mx-auto flex max-w-7xl items-center justify-between">
        <div class="max-w-xl">
          <h1 class="mb-4 text-4xl font-bold leading-tight text-navy-900">
            Nền tảng <span class="text-blue-500">Đặt vé xe</span> nhanh nhất Việt Nam
          </h1>
          <p class="text-base text-gray-600">
            Cam kết hoàn 150% nếu nhà xe không cung cấp dịch vụ vận chuyển (*)
          </p>
        </div>
        <div class="relative ml-8 w-[500px] h-[300px]">
          <img src="/static/xe-khach/Ellipse152.png"
            class="fixed left-[70%] top-[40%] -translate-y-1/2 w-[600px] opacity-70 z-0" />
          <img src="/static/xe-khach/Container.png"
            class="absolute left-[1%] sm:top-[40%] top-[10%] transform-translate-y-1/2 w-full" />
          <img src="/static/xe-khach/bus.png" class="relative w-full drop-shadow-lg z-10" />
        </div>
      </div>
    </div>
  </section>

  <section class="container mx-auto px-24 sm:px-4 xs:px-2 [@media(max-width:450px)]:px-5">
    <div class="flex gap-4 [@media(max-width:450px)]:hidden">
      <el-radio-group v-model="radio1" size="large" id="homepage-group">
        <el-radio-button value="Vé xe khách" class="mr-2">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" />
              </svg>
              <span>Vé xe khách</span>
            </div>
          </template>
        </el-radio-button>


        <el-radio-button value="3" class="mr-2">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32zm96 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8l144 0z" />
              </svg>
              <span>Khách sạn</span>
            </div>
          </template>
        </el-radio-button>
        <el-radio-button value="4" class="mr-2">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M200 0c-30.6 0-56 54.7-56 86.1l0 106.5L7.8 274.3C2.9 277.2 0 282.4 0 288l0 64c0 5.1 2.4 9.8 6.4 12.8s9.3 3.9 14.1 2.5l123.4-37 0 81.2-50 40c-3.8 3-6 7.6-6 12.5l0 32c0 5.1 2.5 10 6.6 13s9.5 3.8 14.4 2.2L200 480.9 290.4 511c-1.6-4.7-2.4-9.8-2.4-15l0-32.6c-18.2-10.5-30.7-29.7-31.9-51.8l-.1-.1 0-3.5 0-82.5L256 184l0-1.1s0 0 0 0l0-96.9C256 54.7 231.5 0 200 0zm88 176l0 224c0 20.9 13.4 38.7 32 45.3l0 42.7c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-40 160 0 0 40c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-42.7c18.6-6.6 32-24.4 32-45.3l0-224c0-26.5-21.5-48-48-48l-256 0c-26.5 0-48 21.5-48 48zm79.8 78.7c3.3-8.7 11.2-14.7 20.5-14.7l151.4 0c9.2 0 17.2 6 20.5 14.7L576 304l-224 0 15.8-49.3zM568 352a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM336 376a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
              </svg>
              <span>Đưa đón sân bay</span>
            </div>
          </template>
        </el-radio-button>
        <el-radio-button value="5" class="mr-2">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M192 0c-17.7 0-32 14.3-32 32l0 32 0 .2c-38.6 2.2-72.3 27.3-85.2 64.1L39.6 228.8C16.4 238.4 0 261.3 0 288L0 432l0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48 320 0 0 48c0 17.7 14.3 32 32 32l32 0c17.7 0 32-14.3 32-32l0-48 0-144c0-26.7-16.4-49.6-39.6-59.2L437.2 128.3c-12.9-36.8-46.6-62-85.2-64.1l0-.2 0-32c0-17.7-14.3-32-32-32L192 0zM165.4 128l181.2 0c13.6 0 25.7 8.6 30.2 21.4L402.9 224l-293.8 0 26.1-74.6c4.5-12.8 16.6-21.4 30.2-21.4zM96 288a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm288 32a32 32 0 1 1 64 0 32 32 0 1 1 -64 0z" />
              </svg>
              <span>Cho thuê xe</span>
            </div>
          </template>
        </el-radio-button>
        <el-radio-button value="6" class="mr-2">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M383.5 192c.3-5.3 .5-10.6 .5-16c0-51-15.9-96-40.2-127.6C319.5 16.9 288.2 0 256 0s-63.5 16.9-87.8 48.4C143.9 80 128 125 128 176c0 5.4 .2 10.7 .5 16L240 192l0 128-32 0c-7 0-13.7 1.5-19.7 4.2L68.2 192l28.3 0c-.3-5.3-.5-10.6-.5-16c0-64 22.2-121.2 57.1-159.3C62 49.3 18.6 122.6 4.2 173.6C1.5 183.1 9 192 18.9 192l6 0L165.2 346.3c-3.3 6.5-5.2 13.9-5.2 21.7l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-7.8-1.9-15.2-5.2-21.7L487.1 192l6 0c9.9 0 17.4-8.9 14.7-18.4C493.4 122.6 450 49.3 358.9 16.7C393.8 54.8 416 112.1 416 176c0 5.4-.2 10.7-.5 16l28.3 0L323.7 324.2c-6-2.7-12.7-4.2-19.7-4.2l-32 0 0-128 111.5 0z" />
              </svg>
              <span>Hoạt động & Vui chơi</span>
            </div>
          </template>
        </el-radio-button>
        <el-radio-button value="7">
          <template #default>
            <div class="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                <path
                  d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z" />
              </svg>
              <span>Xem thêm</span>
            </div>
          </template>
        </el-radio-button>
      </el-radio-group>
    </div>

    <!-- Menu dropdown cho màn hình nhỏ -->
    <div class="sm:hidden">
      <el-dropdown trigger="click" @command="radio1 = $event">
        <el-button type="primary">
          {{ radio1 || 'Vé xe khách' }}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-if="radio1 !== 'Vé xe khách'" command="Vé xe khách">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" />
                </svg>
                <span>Vé xe khách</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="radio1 !== 'Khách sạn'" command="Khách sạn">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M0 32C0 14.3 14.3 0 32 0L480 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l0 384c17.7 0 32 14.3 32 32s-14.3 32-32 32l-176 0 0-48c0-26.5-21.5-48-48-48s-48 21.5-48 48l0 48L32 512c-17.7 0-32-14.3-32-32s14.3-32 32-32L32 64C14.3 64 0 49.7 0 32zm96 80l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM240 96c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zM112 192c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zm112 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm144-16c-8.8 0-16 7.2-16 16l0 32c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l0-32c0-8.8-7.2-16-16-16l-32 0zM328 384c13.3 0 24.3-10.9 21-23.8c-10.6-41.5-48.2-72.2-93-72.2s-82.5 30.7-93 72.2c-3.3 12.8 7.8 23.8 21 23.8l144 0z" />
                </svg>
                <span>Khách sạn</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="radio1 !== 'Đưa đón sân bay'" command="Đưa đón sân bay">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M200 0c-30.6 0-56 54.7-56 86.1l0 106.5L7.8 274.3C2.9 277.2 0 282.4 0 288l0 64c0 5.1 2.4 9.8 6.4 12.8s9.3 3.9 14.1 2.5l123.4-37 0 81.2-50 40c-3.8 3-6 7.6-6 12.5l0 32c0 5.1 2.5 10 6.6 13s9.5 3.8 14.4 2.2L200 480.9 290.4 511c-1.6-4.7-2.4-9.8-2.4-15l0-32.6c-18.2-10.5-30.7-29.7-31.9-51.8l-.1-.1 0-3.5 0-82.5L256 184l0-1.1s0 0 0 0l0-96.9C256 54.7 231.5 0 200 0zM88 160l0 224c0 20.9 13.4 38.7 32 45.3l0 42.7c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-40 160 0 0 40c0 13.3 10.7 24 24 24l16 0c13.3 0 24-10.7 24-24l0-42.7c18.6-6.6 32-24.4 32-45.3l0-224c0-26.5-21.5-48-48-48l-256 0c-26.5 0-48 21.5-48 48zm79.8 78.7c3.3-8.7 11.2-14.7 20.5-14.7l151.4 0c9.2 0 17.2 6 20.5 14.7L576 304l-224 0 15.8-49.3zM568 352a24 24 0 1 1 0 48 24 24 0 1 1 0-48zM336 376a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z" />
                </svg>
                <span>Đưa đón sân bay</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="radio1 !== 'Cho thuê xe'" command="Cho thuê xe">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M192 0c-17.7 0-32 14.3-32 32l0 32 0 .2c-38.6 2.2-72.3 27.3-85.2 64.1l-25.5 69.3C46.1 242.2 32 278.3 32 316.6l0 32c0 20.4 16.6 36.9 36.8 36.9l153.3 0 0 32c0 11 9 20 20 20l48 0c11 0 20-9 20-20l0-32 156.1 0c19.8 0 36.8-16.5 36.8-36.9l0-32c0-38.2-14.1-74.4-49.3-101.2l-25.4-69.3c-12.9-36.8-46.6-61.9-85.2-64.1l0-.2 0-32c0-17.7-14.3-32-32-32zM93.2 159.7c7.6-20.8 27.1-34.7 50.8-37.4c0 0 5.3 0 8.2 0c14.5 0 28.6 6.5 38.5 17.8l11.8 14.5L209.6 192H98.4L93.2 159.7zM96 288c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 32c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24l0-32zM392 288c0-13.3 10.7-24 24-24l48 0c13.3 0 24 10.7 24 24l0 32c0 13.3-10.7 24-24 24l-48 0c-13.3 0-24-10.7-24-24l0-32z" />
                </svg>
                <span>Cho thuê xe</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="radio1 !== 'Hoạt động & Vui chơi'" command="Hoạt động & Vui chơi">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M383.5 192c.3-5.3 .5-10.6 .5-16c0-51-15.9-96-40.2-127.6C319.5 16.9 288.2 0 256 0s-63.5 16.9-87.8 48.4C143.9 80 128 125 128 176c0 5.4 .2 10.7 .5 16L240 192l0 128-32 0c-7 0-13.7 1.5-19.7 4.2L68.2 192l28.3 0c-.3-5.3-.5-10.6-.5-16c0-64 22.2-121.2 57.1-159.3C62 49.3 18.6 122.6 4.2 173.6C1.5 183.1 9 192 18.9 192l6 0L165.2 346.3c-3.3 6.5-5.2 13.9-5.2 21.7l0 96c0 26.5 21.5 48 48 48l96 0c26.5 0 48-21.5 48-48l0-96c0-7.8-1.9-15.2-5.2-21.7L487.1 192l6 0c9.9 0 17.4-8.9 14.7-18.4C493.4 122.6 450 49.3 358.9 16.7C393.8 54.8 416 112.1 416 176c0 5.4-.2 10.7-.5 16l28.3 0L323.7 324.2c-6-2.7-12.7-4.2-19.7-4.2l-32 0 0-128 111.5 0z" />
                </svg>
                <span>Hoạt động & Vui chơi</span>
              </div>
            </el-dropdown-item>
            <el-dropdown-item v-if="radio1 !== 'Xem thêm'" command="Xem thêm">
              <div class="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="w-4 h-4" fill="currentColor">
                  <path
                    d="M40 48C26.7 48 16 58.7 16 72l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24L40 48zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM16 232l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24l0 48c0 13.3 10.7 24 24 24l48 0c13.3 0 24-10.7 24-24l0-48c0-13.3-10.7-24-24-24l-48 0z" />
                </svg>
                <span>Xem thêm</span>
              </div>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <el-divider class="" />
    <div class="flex justify-center items-center ">
      <SelectTrip_v2 />
    </div>

    <div class="mt-[200px] [@media(max-width:450px)]:mt-[100px]">
      <div class="mx-auto max-w-2xl lg:text-center">
        <p
          class="mt-2 text-[20px] font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl lg:text-balance [@media(max-width:450px)]:text-center">
          Đồng hành cùng VinaHome</p>
        <p class="mt-6 text-lg text-gray-600 [@media(max-width:450px)]:text-center">Chúng tôi giúp bạn kết nối đến mọi
          nơi,
          mang đến lựa chọn di chuyển tiện
          lợi và tiết kiệm chi phí.</p>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 p-4 [@media(max-width:450px)]:gap-y-4">
        <div>
          <div
            class="min-h-[110px] bg-[#FEF6F3] p-4 rounded-lg border border-[#FCDED6] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#FF5603] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="#fff">
                <path
                  d="M352 256c0 22.2-1.2 43.6-3.3 64l-185.3 0c-2.2-20.4-3.3-41.8-3.3-64s1.2-43.6 3.3-64l185.3 0c2.2 20.4 3.3 41.8 3.3 64zm28.8-64l123.1 0c5.3 20.5 8.1 41.9 8.1 64s-2.8 43.5-8.1 64l-123.1 0c2.1-20.6 3.2-42 3.2-64s-1.1-43.4-3.2-64zm112.6-32l-116.7 0c-10-63.9-29.8-117.4-55.3-151.6c78.3 20.7 142 77.5 171.9 151.6zm-149.1 0l-176.6 0c6.1-36.4 15.5-68.6 27-94.7c10.5-23.6 22.2-40.7 33.5-51.5C239.4 3.2 248.7 0 256 0s16.6 3.2 27.8 13.8c11.3 10.8 23 27.9 33.5 51.5c11.6 26 20.9 58.2 27 94.7zm-209 0L18.6 160C48.6 85.9 112.2 29.1 190.6 8.4C165.1 42.6 145.3 96.1 135.3 160zM8.1 192l123.1 0c-2.1 20.6-3.2 42-3.2 64s1.1 43.4 3.2 64L8.1 320C2.8 299.5 0 278.1 0 256s2.8-43.5 8.1-64zM194.7 446.6c-11.6-26-20.9-58.2-27-94.6l176.6 0c-6.1 36.4-15.5 68.6-27 94.6c-10.5 23.6-22.2 40.7-33.5 51.5C272.6 508.8 263.3 512 256 512s-16.6-3.2-27.8-13.8c-11.3-10.8-23-27.9-33.5-51.5zM135.3 352c10 63.9 29.8 117.4 55.3 151.6C112.2 482.9 48.6 426.1 18.6 352l116.7 0zm358.1 0c-30 74.1-93.6 130.9-171.9 151.6c25.5-34.2 45.2-87.7 55.3-151.6l116.7 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Đặt vé online</h3>
            <p class="text-gray-600 mt-2 text-sm">Nhanh chóng, tiện lợi, chỉ với vài cú click.</p>
          </div>
        </div>
        <div>
          <div
            class="min-h-[110px] bg-[#F2EFFF] p-4 rounded-lg border border-[#D8CFFF] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#866BF8] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-6 w-6" fill="#fff">
                <path
                  d="M288 0C422.4 0 512 35.2 512 80l0 16 0 32c17.7 0 32 14.3 32 32l0 64c0 17.7-14.3 32-32 32l0 160c0 17.7-14.3 32-32 32l0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32-192 0 0 32c0 17.7-14.3 32-32 32l-32 0c-17.7 0-32-14.3-32-32l0-32c-17.7 0-32-14.3-32-32l0-160c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32c0 0 0 0 0 0l0-32s0 0 0 0l0-16C64 35.2 153.6 0 288 0zM128 160l0 96c0 17.7 14.3 32 32 32l112 0 0-160-112 0c-17.7 0-32 14.3-32 32zM304 288l112 0c17.7 0 32-14.3 32-32l0-96c0-17.7-14.3-32-32-32l-112 0 0 160zM144 400a32 32 0 1 0 0-64 32 32 0 1 0 0 64zm288 0a32 32 0 1 0 0-64 32 32 0 1 0 0 64zM384 80c0-8.8-7.2-16-16-16L208 64c-8.8 0-16 7.2-16 16s7.2 16 16 16l160 0c8.8 0 16-7.2 16-16z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Xe giường nằm & Limousine cao cấp</h3>
            <p class="text-gray-600 mt-2 text-sm">Cung cấp nhiều dòng xe: ghế ngồi, giường nằm, Limousine VIP.</p>
          </div>
        </div>
        <div>
          <div
            class="min-h-[110px] bg-[#FFFAE9] p-4 rounded-lg border border-[#FCD8CF] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#F5C207] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-6 w-6" fill="#fff">

                <path
                  d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Vé điện tử</h3>
            <p class="text-gray-600 mt-2 text-sm">Xác nhận vé điện tử qua tin nhắn SMS/Zalo/Email.</p>
          </div>
        </div>
        <div>
          <div
            class="min-h-[110px] bg-[#F2FDF7] p-4 rounded-lg border border-[#C7FDDE] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#0AD561] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="#fff">

                <path
                  d="M280 0C408.1 0 512 103.9 512 232c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-101.6-82.4-184-184-184c-13.3 0-24-10.7-24-24s10.7-24 24-24zm8 192a32 32 0 1 1 0 64 32 32 0 1 1 0-64zm-32-72c0-13.3 10.7-24 24-24c75.1 0 136 60.9 136 136c0 13.3-10.7 24-24 24s-24-10.7-24-24c0-48.6-39.4-88-88-88c-13.3 0-24-10.7-24-24zM117.5 1.4c19.4-5.3 39.7 4.6 47.4 23.2l40 96c6.8 16.3 2.1 35.2-11.6 46.3L144 207.3c33.3 70.4 90.3 127.4 160.7 160.7L345 318.7c11.2-13.7 30-18.4 46.3-11.6l96 40c18.6 7.7 28.5 28 23.2 47.4l-24 88C481.8 499.9 466 512 448 512C200.6 512 0 311.4 0 64C0 46 12.1 30.2 29.5 25.4l88-24z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Hỗ trợ 24/7</h3>
            <p class="text-gray-600 mt-2 text-sm">Luôn sẵn sàng giúp bạn bất cứ lúc nào.</p>
          </div>
        </div>
        <div>
          <div
            class="min-h-[110px] bg-[#F1F8FE] p-4 rounded-lg border border-[#0382F7] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#0382F7] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="#fff">

                <path
                  d="M470.7 9.4c3 3.1 5.3 6.6 6.9 10.3s2.4 7.8 2.4 12.2c0 0 0 .1 0 .1c0 0 0 0 0 0l0 96c0 17.7-14.3 32-32 32s-32-14.3-32-32l0-18.7L310.6 214.6c-11.8 11.8-30.8 12.6-43.5 1.7L176 138.1 84.8 216.3c-13.4 11.5-33.6 9.9-45.1-3.5s-9.9-33.6 3.5-45.1l112-96c12-10.3 29.7-10.3 41.7 0l89.5 76.7L370.7 64 352 64c-17.7 0-32-14.3-32-32s14.3-32 32-32l96 0s0 0 0 0c8.8 0 16.8 3.6 22.6 9.3l.1 .1zM0 304c0-26.5 21.5-48 48-48l416 0c26.5 0 48 21.5 48 48l0 160c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 304zM48 416l0 48 48 0c0-26.5-21.5-48-48-48zM96 304l-48 0 0 48c26.5 0 48-21.5 48-48zM464 416c-26.5 0-48 21.5-48 48l48 0 0-48zM416 304c0 26.5 21.5 48 48 48l0-48-48 0zm-96 80a64 64 0 1 0 -128 0 64 64 0 1 0 128 0z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Giá vé hợp lý</h3>
            <p class="text-gray-600 mt-2 text-sm">Cam kết giá cả phải chăng, không phí ẩn.</p>
          </div>
        </div>
        <div>
          <div
            class="min-h-[110px] bg-[#FFF6FB] p-4 rounded-lg border border-[#FFDAE9] flex flex-col relative pl-10 pr-2">
            <div
              class="w-[64px] h-[64px] bg-[#F05697] rounded-full flex items-center justify-center absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-6 w-6" fill="#fff">

                <path
                  d="M512 96c0 50.2-59.1 125.1-84.6 155c-3.8 4.4-9.4 6.1-14.5 5L320 256c-17.7 0-32 14.3-32 32s14.3 32 32 32l96 0c53 0 96 43 96 96s-43 96-96 96l-276.4 0c8.7-9.9 19.3-22.6 30-36.8c6.3-8.4 12.8-17.6 19-27.2L416 448c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0c-53 0-96-43-96-96s43-96 96-96l39.8 0c-21-31.5-39.8-67.7-39.8-96c0-53 43-96 96-96s96 43 96 96zM117.1 489.1c-3.8 4.3-7.2 8.1-10.1 11.3l-1.8 2-.2-.2c-6 4.6-14.6 4-20-1.8C59.8 473 0 402.5 0 352c0-53 43-96 96-96s96 43 96 96c0 30-21.1 67-43.5 97.9c-10.7 14.7-21.7 28-30.8 38.5l-.6 .7zM128 352a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zM416 128a32 32 0 1 0 0-64 32 32 0 1 0 0 64z" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold">Đa dạng tuyến đường</h3>
            <p class="text-gray-500 mt-2 text-sm">Linh hoạt với nhiều lựa chọn điểm đến.</p>
          </div>
        </div>
      </div>

      <div class="mt-[100px]">
        <div class="mx-auto max-w-2xl lg:text-center">
          <p
            class="mt-2 text-[20px] font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl lg:text-balance [@media(max-width:450px)]:text-center">
            Tuyến đường phổ biến</p>
          <p class="mt-6 text-lg text-gray-600 [@media(max-width:450px)]:text-center">Những tuyến đường được yêu thích
            nhất,
            mang đến trải nghiệm di chuyển
            thoải mái, tiết kiệm và thuận tiện cho mọi hành trình!</p>
        </div>

        <div class="mt-10 mb-10">
          <el-carousel :interval="4000" type="card" height="280px" :current-index="currentIndex"
            @change="handleCarouselChange">

            <el-carousel-item v-for="(route, index) in routes" :key="index" :style="{ background: 'none' }">
              <div class="relative w-full h-full flex justify-center items-center">
                <div
                  class="relative w-[340px] h-[200px] flex-shrink-0 rounded-2xl overflow-visible transition-all duration-300 cursor-pointer"
                  :class="[
                    currentIndex === index ? 'scale-105 ring-2 ring-[#03acff]' : '',
                    'hover:scale-105'
                  ]">
                  <img :src="route.image" class="w-full h-full object-cover rounded-2xl" />
                  <div
                    class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-full shadow px-4 h-12 w-[280px] flex items-center z-20 transition-all duration-300 hover:bg-blue-50 hover:text-blue-600"
                    :class="currentIndex === index ? 'justify-start pr-4 ring-2 ring-[#03acff] scale-105' : 'justify-center'">
                    <span class="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      {{ route.name }}
                    </span>
                    <div v-if="currentIndex === index"
                      class="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0 h-[48px] w-[48px] bg-[#03acff] ring-2 ring-[#03acff] rounded-full flex items-center justify-center text-white shadow-md">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </el-carousel-item>
          </el-carousel>
        </div>
      </div>

      <div class="mt-[100px]">
        <div class="mx-auto max-w-2xl lg:text-center">
          <p
            class="mt-2 text-[20px] font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl lg:text-balance [@media(max-width:450px)]:text-center">
            Các bước đơn giản để tận hưởng chuyến đi</p>
          <p class="mt-6 text-lg text-gray-600 [@media(max-width:450px)]:text-center">Hãy tận hưởng hành trình của bạn,
            trân
            trọng từng khoảnh khắc và khám
            phá vẻ đẹp từ những điều giản đơn.
          </p>
        </div>
        <div
          class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 [@media(max-width:450px)]:gap-y-4 pt-10 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          <article
            class="relative flex max-w-xl flex-col items-start justify-between bg-white rounded-md p-4 border border-transparent hover:border-[#0382F7] transition">
            <div class="absolute top-2 right-2 h-20 w-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="#F5F5F6">
                <path
                  d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
              </svg>
            </div>

            <div class="flex flex-col gap-x-2 :gap-y-2 w-full">
              <div class="flex items-center justify-center w-12 h-12 bg-[#FF5603] p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="h-5 w-5" fill="#fff">
                  <path
                    d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" />
                </svg>
              </div>
              <div class="flex flex-col justify-between flex-1">
                <h3 class="mt-auto text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  Tìm kiếm điểm đến! 🔍
                </h3>
                <ul class="space-y-2 text-gray-700 mt-2">
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Chọn điểm đi/điểm đến
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Chọn ngày đi
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Chọn chuyến xe
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article
            class="relative flex max-w-xl flex-col items-start justify-between bg-white rounded-md p-4 border border-transparent hover:border-[#0382F7] transition">
            <div class="absolute top-2 right-2 h-20 w-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#F5F5F6">
                <path
                  d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
              </svg>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <div class="flex items-center justify-center w-12 h-12 bg-[#0382F7] p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-8 w-8" fill="#fff">
                  <path
                    d="M64 64C28.7 64 0 92.7 0 128l0 64c0 8.8 7.4 15.7 15.7 18.6C34.5 217.1 48 235 48 256s-13.5 38.9-32.3 45.4C7.4 304.3 0 311.2 0 320l0 64c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-64c0-8.8-7.4-15.7-15.7-18.6C541.5 294.9 528 277 528 256s13.5-38.9 32.3-45.4c8.3-2.9 15.7-9.8 15.7-18.6l0-64c0-35.3-28.7-64-64-64L64 64zm64 112l0 160c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-160c0-8.8-7.2-16-16-16l-288 0c-8.8 0-16 7.2-16 16zM96 160c0-17.7 14.3-32 32-32l320 0c17.7 0 32 14.3 32 32l0 192c0 17.7-14.3 32-32 32l-320 0c-17.7 0-32-14.3-32-32l0-192z" />
                </svg>
              </div>
              <div class="flex flex-col justify-between flex-1">
                <h3 class="mt-auto text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  Chọn vé! 🎫
                </h3>
                <ul class="space-y-2 text-gray-700 mt-2">
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Chọn chỗ ngồi mong muốn
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Điền đầy đủ thông tin cần thiết
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Xác nhận thông tin đặt vé
                  </li>
                </ul>
              </div>
            </div>
          </article>

          <article
            class="relative flex max-w-xl flex-col items-start justify-between bg-white rounded-md p-4 border border-transparent hover:border-[#0382F7] transition">
            <div class="absolute top-2 right-2 h-20 w-20 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" fill="#F5F5F6">
                <path
                  d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
              </svg>
            </div>

            <div class="flex flex-col gap-2 w-full">
              <div class="flex items-center justify-center w-12 h-12 bg-[#FF5603] p-3 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="h-10 w-10" fill="#fff">
                  <path
                    d="M512 80c8.8 0 16 7.2 16 16l0 32L48 128l0-32c0-8.8 7.2-16 16-16l448 0zm16 144l0 192c0 8.8-7.2 16-16 16L64 432c-8.8 0-16-7.2-16-16l0-192 480 0zM64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l448 0c35.3 0 64-28.7 64-64l0-320c0-35.3-28.7-64-64-64L64 32zm56 304c-13.3 0-24 10.7-24 24s10.7 24 24 24l48 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-48 0zm128 0c-13.3 0-24 10.7-24 24s10.7 24 24 24l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-112 0z" />
                </svg>
              </div>
              <div class="flex flex-col justify-between flex-1">
                <h3 class="mt-auto text-lg font-semibold text-gray-900 group-hover:text-gray-600">
                  Thanh toán & bắt đầu hành trình! 💳
                </h3>
                <ul class="space-y-2 text-gray-700 mt-2">
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Lựa chọn phương thức thanh toán
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Hoàn tất các bước thanh toán
                  </li>
                  <li class="flex items-center gap-x-2 text-[#909295] text-sm">
                    <span class="w-2 h-2 bg-orange-500 rounded-full"></span> Nhận vé & sẵn sàng lên đường
                  </li>
                </ul>
              </div>
            </div>
          </article>
        </div>
      </div>

      <div class="mt-[100px]">
        <div class="mx-auto max-w-2xl lg:text-center">
          <p
            class="mt-2 text-[20px] font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl lg:text-balance [@media(max-width:450px)]:text-center">
            Những địa điểm được ghé thăm nhiều</p>
          <p class="mt-6 text-lg text-gray-600 [@media(max-width:450px)]:text-center">Khám phá những cảnh quan ngoạn
            mục, di
            tích lịch sử và những thành phố
            sôi động trên khắp Việt Nam.</p>
        </div>

        <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">
          <div class="mt-10 grid gap-4 sm:mt-16 lg:grid-cols-3 lg:grid-rows-2">
            <div class="relative lg:row-span-2 h-full">
              <div class="absolute inset-px rounded-lg bg-white lg:rounded-l-[2rem]"></div>
              <div
                class="relative overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)] h-full">
                <img class="w-full h-full object-cover object-top rounded-lg" src="/ha-long.jpg" alt="" />
              </div>
            </div>

            <div class="relative max-lg:row-start-1">
              <img class="w-full h-full object-cover object-top rounded-lg" src="/ha-long.jpg" alt="" />
            </div>

            <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">
              <img class="w-full h-full object-cover object-top rounded-lg" src="/ha-long.jpg" alt="" />
            </div>

            <div class="relative lg:row-span-2">
              <div
                class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]">
                <img class="w-full h-full object-cover object-top rounded-lg" src="/ha-long.jpg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-[100px] mb-10">
      <div class="mx-auto max-w-2xl lg:text-center">
        <p
          class="mt-2 text-[20px] font-semibold tracking-tight text-pretty text-gray-900 sm:text-4xl lg:text-balance [@media(max-width:450px)]:text-center">
          Thanh toán đa dạng</p>
        <p class="mt-6 text-lg text-gray-600 [@media(max-width:450px)]:text-center">Thanh toán dễ dàng, nhanh chóng và
          bảo
          mật với nhiều phương thức tiện
          lợi.</p>
      </div>

      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          class="mx-auto mt-10 grid max-w-lg grid-cols-4 items-center gap-x-8 gap-y-10 sm:max-w-xl sm:grid-cols-6 sm:gap-x-10 lg:mx-0 lg:max-w-none lg:grid-cols-5">

          <div class="col-span-2 lg:col-span-1 overflow-hidden rounded-lg">
            <img class="max-h-[80px] w-full object-cover" src="/vn-pay.jpg" alt="Transistor" />
          </div>

          <div class="col-span-2 lg:col-span-1 overflow-hidden rounded-lg">
            <img class="max-h-[80px] w-full object-cover" src="/vn-pay.jpg" alt="Reform" />
          </div>

          <div class="col-span-2 lg:col-span-1 overflow-hidden rounded-lg">
            <img class="max-h-[80px] w-full object-cover" src="/vn-pay.jpg" alt="Tuple" />
          </div>

          <div class="col-span-2 sm:col-start-2 lg:col-span-1 overflow-hidden rounded-lg">
            <img class="max-h-[80px] w-full object-cover" src="/vn-pay.jpg" alt="SavvyCal" />
          </div>

          <div class="col-span-2 col-start-2 sm:col-start-auto lg:col-span-1 overflow-hidden rounded-lg">
            <img class="max-h-[80px] w-full object-cover" src="/vn-pay.jpg" alt="Statamic" />
          </div>
        </div>
      </div>
    </div>

    <div
      class="relative isolate bg-[#03ACFF] rounded-lg mb-10 mt-[200px] min-h-[350px] [@media(max-width:450px)]:mt-[100px]">
      <div class="mx-auto max-w-7xl px-6 lg:px-8 py-10 sm:py-10 lg:py-14 relative z-10">
        <div class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2">
          <div class="max-w-xl lg:max-w-lg">
            <h2 class="text-4xl font-semibold tracking-tight text-white">Đăng ký nhận bản tin</h2>
            <p class="mt-4 text-md text-white">Cập nhật ngay những mẹo du lịch mới nhất và ưu đãi hấp dẫn nhất</p>
            <div class="mt-6 flex max-w-md gap-x-4">
              <div class="bg-white rounded-lg w-full flex p-1.5">
                <input v-model="receiveNews.email" id="email-address" name="email" type="email" autocomplete="email"
                  class="w-full outline-none mx-1" placeholder="Nhập địa chỉ email" />
                <el-button type="primary" size="large" @click="submitFormReceiveNews()">Đăng ký</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="absolute bottom-0 z-0 md:z-10 right-0 md:right-[-50px]">
        <img src="/static/a1.png" class="w-full max-w-[620px]" />
      </div>
    </div>
  </section>
</template>

<style>
#homepage-group .el-radio-button__inner {
  border-radius: 50px !important;
  border: 1px solid #e5e7eb;
}

.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}

.el-carousel__indicators,
.el-carousel__indicator,
.el-carousel__indicator--horizontal,
.el-carousel__indicator.is-active {
  display: none !important;
}

.el-carousel__mask {
  background-color: transparent;
}
</style>