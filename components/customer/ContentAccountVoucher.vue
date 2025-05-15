<template>
    <h1 class="text-2xl font-bold mb-4">Ưu Đãi & Voucher</h1>

    <div class="max-w-6xl mx-auto bg-white p-6 shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-for="voucher in vouchers" :key="voucher.code" class="flex bg-white shadow-2xl overflow-hidden relative hover:scale-105 transition-transform duration-300 w-86 ">
                <!-- Phần bên trái (Logo hoặc Tên công ty) -->
                <div class="bg-blue-500 text-white flex items-center justify-center px-3 py-4 w-20 relative rounded-none">
                    <span class="text-center text-xs font-bold leading-tight text-yellow-300">VINAHOME<br>Voucher</span>
                    <!-- Rãnh ở cạnh trái -->
                    <div class="absolute left-0 top-0 h-full flex flex-col justify-between py-2">
                        <div v-for="n in 12" :key="n" class="w-2 h-2 bg-white rounded-full border border-gray-300 -ml-1"></div>
                    </div>
                </div>

                <!-- Phần bên phải (Thông tin Voucher) -->
                <div class="flex-1 p-3 relative border-l ">
                    <h2 class="text-base font-bold text-gray-800 mb-1 flex items-center">
                        <span>{{ voucher.title }}</span>
                    </h2>
                    <p class="text-gray-700 mb-1">Trị giá: <span class="font-semibold text-green-500">{{voucher.discount }}</span></p>
                    <p class="text-gray-500 text-sm mb-2">HSD: {{ voucher.expiry }}</p>
                    <div class="flex justify-between items-center">
                        <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded-lg border border-gray-300">{{voucher.code}}</span>
                        <button class="text-blue-500 text-xs hover:underline" @click="copyCode(voucher.code)">Lưu mã</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const vouchers = ref([
    {
        title: 'Giảm 20% cho chuyến đi đầu tiên',
        discount: '20% giá vé',
        expiry: '2025-06-30',
        code: 'FIRST20',
    },
    {
        title: 'Miễn phí vé tất cả tuyến bus',
        discount: '100% giá vé',
        expiry: '2025-07-15',
        code: 'FREEBUS',
    },
    {
        title: 'Giảm 50K cho đơn từ 300K',
        discount: '50,000đ',
        expiry: '2025-08-01',
        code: 'SAVE50',
    },
    {
        title: 'Giảm 20K cho đơn từ 100K',
        discount: '20,000đ',
        expiry: '2025-08-01',
        code: 'SAVE20',
    },
]);

import { ElMessage } from 'element-plus';
import { getDiscountsByUserPurchase } from '~/api/discountAPI';
import type { DiscountType } from '~/types/DiscountType';

const loading = ref(false);

const discountData = ref<DiscountType[]>([]);
const userStore = useUserStore();

const fetchDiscountsByAccountId = async () => {
  loading.value = true;
  try {
    if (userStore.userData?.id) {
      console.log("Lấy mã giảm giá cho userId:", userStore.userData.id);
      const response = await getDiscountsByUserPurchase('67e0ff57e4ac1f541884f17d');
      discountData.value = response.result;
      console.log("Mã giảm giá lấy được:", response);
    } else {
      ElMessage.error("Không tìm thấy userId");
    }
  } catch (error) {
    console.error("Error fetching:", error);
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  userStore.loadUserData();
  fetchDiscountsByAccountId();
});

const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Đã sao chép mã: ${code}`);
};
</script>

<style scoped>
.border-dashed {
    border-style: dashed;
}
</style>