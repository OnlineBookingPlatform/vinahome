<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from "element-plus";
import { searchTicketOnPlatformAPI } from "~/api/ticketAPI";
import { lookUpTicketsList } from "~/mocks/tra-cuu";
import type { DTO_RP_TicketSearch, DTO_RQ_TicketSearch } from "~/types/TicketType";
const ticketData = ref<DTO_RP_TicketSearch | null>(null);
const isLoading = ref(false);
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<DTO_RQ_TicketSearch>({
  phone: null,
  code: null,
})
const rules = reactive<FormRules<DTO_RQ_TicketSearch>>({
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Vui lòng nhập mã vé', trigger: 'blur' },
  ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!', ruleForm)
      isLoading.value = true;
      try {
        const response = await searchTicketOnPlatformAPI(ruleForm)
        ticketData.value = response.result
      } catch (error) {
        ElMessage.error('Lỗi hệ thông, vui lòng thử lại sau.');
      } finally {
        isLoading.value = false;
      }
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="container space-y-6 justify-center text-center mt-10 mb-10">
    <h1 class="text-xl font-bold">TRA CỨU THÔNG TIN ĐẶT VÉ</h1>
    <el-form ref="ruleFormRef" style="max-width: 500px" class="mx-auto" :model="ruleForm" :rules="rules">
      <el-form-item prop="phone">
        <span>Số điện thoại</span>
        <el-input v-model="ruleForm.phone" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item prop="code">
        <span>Mã vé</span>
        <el-input v-model="ruleForm.code" type="text" autocomplete="off" />
      </el-form-item>
      <el-form-item class="mt-10">
        <div class="w-full flex justify-center items-center gap-4">
          <el-button type="primary" round @click="submitForm(ruleFormRef)" class="w-[200px]" :loading="isLoading">
            Tra cứu
          </el-button>
        </div>
      </el-form-item>

    </el-form>
  </div>
  <div class="container w-[80%] mb-10 p-4 mt-4 mx-auto" v-if="ticketData">
    <div class="w-full bg-slate-50 rounded-lg px-4 py-4 mx-auto shadow border-l-4 border-[#0072bc]">
      <div class="flex">
        <div class="flex-1">
          <div class="flex mx-2">
            <div class="font-semibold text-gray-700 mb-2 w-28">Họ tên:</div>
            <span class="text-gray-900">{{ ticketData.passenger_name }}</span>
          </div>
          <div class="flex mx-2">
            <div class="font-semibold text-gray-700 mb-2 w-28">Số điện thoại:</div>
            <span class="text-gray-900">{{ ticketData.passenger_phone }}</span>
          </div>
          <div class="flex mx-2">
            <div class="font-semibold text-gray-700 mb-2 w-28">Email:</div>
            <span class="text-gray-900">{{ ticketData.email }}</span>
          </div>

          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Giá vé:</span>
            <span class="text-gray-900">
              {{ ticketData.base_price?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
            </span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Trạng thái:</span>
            <span class="text-gray-900">{{ ticketData.payment_method }}</span>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Mã vé:</span>
            <span class="text-gray-900">{{ ticketData.id }}</span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Số ghế:</span>
            <span class="text-gray-900">{{ ticketData.seat_name }}</span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Tuyến xe:</span>
            <span class="text-gray-900">{{ ticketData.route_name }}</span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Biển số xe:</span>
            <span class="text-gray-900">{{ ticketData.license_plate }}</span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Khởi hành:</span>
            <span class="text-gray-900">
              {{ ticketData.start_time?.split(':').slice(0, 2).join(':') }} -
              {{ new Date(ticketData.start_date).toLocaleDateString('vi-VN') }}
            </span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Điểm lên:</span>
            <span class="text-gray-900">{{ ticketData.point_up }}</span>
          </div>
          <div class="flex mx-2">
            <span class="font-semibold text-gray-700 mb-2 w-28">Điểm xuống:</span>
            <span class="text-gray-900">{{ ticketData.point_down }}</span>
          </div>

        </div>
        <div class="flex-1 w-full flex justify-center items-center">
          <div class="mx-2" style="width: 150px; height: 150px;">
            <img src="https://upload.wikimedia.org/wikipedia/commons/3/30/Superqr.svg" alt="QR code"
              class="w-full h-full object-cover" />
          </div>
        </div>



      </div>
    </div>

  </div>


  <!-- <p>
      <NuxtLink to="/">Trang chủ</NuxtLink> >
      <span class="underline decoration-primary">Tra cứu vé xe</span>
    </p> -->
  <!-- <form
      class="mx-auto border border-black/20 rounded-2xl p-3 mt-4 w-fit"
      @submit.prevent="onSubmit"
    >
      <h6>Tra cứu thông tin đặt vé</h6>
      <p class="text-xs opacity-50">
        Vui lòng nhập mã vé hoặc số điện thoại của bạn để xem thông tin vé của
        bạn
      </p>
      <div class="flex gap-6 mt-4">
        <div class="flex-1 space-y-0.5">
          <label for="">Mã vé xe</label>
          <input
            type="text"
            placeholder="Nhập mã vé xe"
            class="px-6 py-2 border border-black/20 rounded w-80 focus-within:outline-none"
            v-model="lookUpModel.orderCode"
          />
        </div>
        <div class="flex-1 space-y-0.5">
          <label for="">Số điện thoại</label>
          <input
            type="text"
            placeholder="Nhập số điện thoại"
            class="px-6 py-2 border border-black/20 rounded w-80 focus-within:outline-none"
            v-model="lookUpModel.phoneNumber"
          />
        </div>
      </div>
      <button
        type="submit"
        class="bg-primary px-8 py-2 mt-4 block ml-auto hover:bg-primary-600 transition-colors duration-300 rounded"
      >
        Tra cứu
      </button>
    </form> -->
  <!-- {{ resultTicket }} -->

</template>

<style>
/* .custom-button>.el-form-item__content {
  justify-content: center !important;
} */
</style>
