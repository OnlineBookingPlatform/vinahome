<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { createEvaluateAPI } from '~/api/evaluateAPI';
import type { EvaluateType } from '~/types/EvaluateType';

definePageMeta({
  layout: 'default'
});

const showForm = ref(false);

const feedbacks = ref([
  { feedbackId: 1, title: 'Cải thiện giao diện', content: 'Giao diện nên có thêm chế độ tối.', date: '2025-02-25' },
  { feedbackId: 2, title: 'Tăng tốc độ tải trang', content: 'Trang tải hơi chậm vào giờ cao điểm.', date: '2025-02-24' }
]);

const responses = ref([
  { responseId: 1, feedbackId: 1, content: 'Chúng tôi sẽ xem xét và cập nhật trong phiên bản tới.', date: '2025-02-25' },
  { responseId: 2, feedbackId: 1, content: 'Chúng tôi đã hoàn tất bản cập nhật.', date: '2025-02-25' },
  { responseId: 3, feedbackId: 2, content: 'Đội ngũ kỹ thuật đang tối ưu hóa tốc độ tải trang.', date: '2025-02-24' },
]);

const newFeedback = ref({ title: '', content: '' });

// const submitFeedback = () => {
//   if (newFeedback.value.title && newFeedback.value.content) {
//     feedbacks.value.push({
//       feedbackId: feedbacks.value.length + 1,
//       ...newFeedback.value,
//       date: new Date().toISOString().split('T')[ 0 ]
//     });
//     newFeedback.value = { title: '', content: '' };
//     showForm.value = false;
//     alert('Góp ý đã được gửi. Cảm ơn bạn!');
//   } else {
//     alert('Vui lòng điền đầy đủ thông tin.');
//   }
// };

const route = useRoute();
const isValidParams = ref(false);
const companyId = ref<string | null>(null);
const tripId = ref<string | null>(null);
const ticketId = ref<string | null>(null);
const ticketPhone = ref<string | null>(null);
const userStore = useUserStore();
const form = reactive<EvaluateType>({
  id: null,
  desc: null,
  rating: null,
  company_id: companyId.value ? parseInt(companyId.value, 10) : null,
  trip_id: tripId.value ? parseInt(tripId.value, 10) : null,
  ticket_id: ticketId.value ? parseInt(ticketId.value, 10) : null,
  account_id: userStore.userData?.id ?? null,
  account_name: userStore.userData?.name ?? null,
  ticket_phone: ticketPhone.value,
  account_email: userStore.userData?.email ?? null,
  account_avatar: userStore.userData?.url_avatar ?? null,
});

const submitFeedback = async () => {
  if (form.desc && form.rating) {
    console.log("Đánh giá:", form);
    ElMessage.success('Góp ý đã được gửi. Cảm ơn bạn!');

    const response = await createEvaluateAPI(form);
    if (response.status === 200) {
      console.log("Đánh giá thành công:", response.result);
      ElMessage.success('Góp ý đã được gửi thành công.');
    } else {
      console.error("Lỗi khi gửi đánh giá:", response);
      ElMessage.error('Có lỗi xảy ra khi gửi góp ý.');
    }
  } else {
    ElMessage.warning('Vui lòng điền đầy đủ thông tin.');
  }
};

onMounted(async () => {
  await userStore.loadUserData();
  companyId.value = route.query.company_id as string | null;
  tripId.value = route.query.trip_id as string | null;
  ticketId.value = route.query.ticket_id as string | null;
  ticketPhone.value = route.query.ticket_phone as string | null;


  if (companyId && tripId && ticketId) {
    console.log("Params hợp lệ:", { companyId, tripId, ticketId });
    isValidParams.value = true;

    form.company_id = companyId.value ? parseInt(companyId.value, 10) : null;
    form.trip_id = tripId.value ? parseInt(tripId.value, 10) : null;
    form.ticket_id = ticketId.value ? parseInt(ticketId.value, 10) : null;
    form.account_id = userStore.userData?.id ?? null;
    form.account_name = userStore.userData?.name ?? null;
    form.ticket_phone = ticketPhone.value;
    form.account_email = userStore.userData?.email ?? null;
    form.account_avatar = userStore.userData?.url_avatar ?? null;
  } else {
    console.error("Thiếu params trong URL");
    isValidParams.value = false;
  }
});
</script>

<template>
  <NuxtLayout name="layout-v1">
    <h1 class="text-xl font-bold mb-4 text-center text-blue-600">Đánh Giá & Góp Ý</h1>
    <div class="bg-white rounded-lg w-full py-2">
      <div v-if="isValidParams">
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-800">Thông tin chuyến đi</h2>
          <p><strong>Company ID:</strong> {{ companyId }}</p>
          <p><strong>Trip ID:</strong> {{ tripId }}</p>
          <p><strong>Ticket ID:</strong> {{ ticketId }}</p>
        </div>
        <div class="p-4">
          <h2 class="text-lg font-bold text-gray-800">Gửi đánh giá</h2>
          <el-form :model="form" label-width="auto">
            <el-form-item label="Đánh giá" label-position="top">


              <el-rate v-model="form.rating" :texts="[ 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Rất tốt' ]" show-text />

            </el-form-item>
            <el-form-item label="Nội dung đánh giá" label-position="top">
              <el-input v-model="form.desc" type="textarea" :rows="4" />
            </el-form-item>
          </el-form>
          <button @click="submitFeedback" class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Gửi
            đánh giá</button>
        </div>

      </div>
      <div v-else class="text-red-500 text-center">
        <p>Không tìm thấy thông tin vé. Vui lòng kiểm tra lại.</p>
      </div>
      <!-- Danh sách góp ý và phản hồi -->
      <!-- <div v-for="feedback in feedbacks" :key="feedback.feedbackId" class="mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <h2 class="text-xl font-bold text-gray-800 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-500 mr-2" viewBox="0 0 20 20"
            fill="currentColor">
            <path
              d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.174c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.967c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.967a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.174a1 1 0 00.95-.69l1.286-3.967z" />
          </svg>
          {{ feedback.title }}
        </h2>
        <p class="text-gray-700 mt-1">{{ feedback.content }}</p>
        <p class="text-sm text-gray-500 mt-1">Ngày: {{ feedback.date }}</p>

        <div v-for="response in responses.filter(r => r.feedbackId === feedback.feedbackId)" :key="response.responseId"
          class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p class="text-gray-800 font-semibold">Phản hồi:</p>
          <p class="text-gray-700">{{ response.content }}</p>
          <p class="text-sm text-gray-500">Ngày: {{ response.date }}</p>
        </div>
      </div> -->

      <!-- Nút hiển thị biểu mẫu góp ý -->
      <button @click="showForm = !showForm"
        class="bg-blue-500 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-600 transition-transform">
        {{ showForm ? 'Ẩn Biểu Mẫu' : 'Gửi Góp Ý' }}
      </button>

      <!-- Biểu mẫu góp ý dưới dạng modal -->
      <div v-if="showForm" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div class="bg-white p-8 rounded-lg shadow-lg w-[500px]">
          <h2 class="text-2xl font-bold text-center mb-4">Biểu Mẫu Góp Ý</h2>
          <input v-model="newFeedback.title" type="text" placeholder="Tiêu đề"
            class="w-full p-3 mb-3 border rounded focus:ring-2 focus:ring-blue-300" />
          <textarea v-model="newFeedback.content" rows="5" placeholder="Nội dung góp ý"
            class="w-full p-3 mb-3 border rounded focus:ring-2 focus:ring-blue-300"></textarea>
          <div class="flex justify-between">
            <button @click="submitFeedback"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">Gửi</button>
            <button @click="showForm = false"
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">Hủy</button>
          </div>
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
.border-dashed {
  border-style: dashed;
}
</style>