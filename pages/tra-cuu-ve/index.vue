<script setup lang="ts">
import type { FormInstance, FormRules } from "element-plus";
import { lookUpTicketsList } from "~/mocks/tra-cuu";

// const phoneRegex = new RegExp(
//   /^(?:\+?\d{1,3}[-.\s]?)?(?:\(?\d{1,4}\)?[-.\s]?)?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/
// );

// const lookUpModel = reactive({
//   orderCode: "",
//   phoneNumber: "",
// });

// const resultTicket = ref("");

// const onSubmit = () => {
//   const { phoneNumber, orderCode } = lookUpModel;
//   if (!!phoneNumber && !phoneRegex.test(phoneNumber)) {
//     alert("Sai format số điện thoại");
//     return;
//   }

//   let ticket;

//   if (
//     (ticket = lookUpTicketsList.find(
//       (ticket) =>
//         ticket.orderCode === orderCode || ticket.passenger.phone === phoneNumber
//     ))
//   ) {
//     resultTicket.value = JSON.stringify(ticket);
//   } else {
//     alert("Không tìm được vé");
//   }
// };
interface RuleForm {
  phone: string;
  code: string;
}
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<RuleForm>({
  phone: '',
  code: '',
})
const rules = reactive<FormRules<RuleForm>>({
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
  ],
  code: [
    { required: true, message: 'Vui lòng nhập mã vé', trigger: 'blur' },
  ],
})
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}
</script>

<template>
  <div class="container space-y-6 justify-center text-center mt-10 mb-20">
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
          <el-button type="primary" round @click="submitForm(ruleFormRef)" class="w-[200px]">
          Tra cứu
        </el-button>
        </div>
      </el-form-item>

    </el-form>
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
