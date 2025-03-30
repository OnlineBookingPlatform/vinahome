<script setup lang="ts">
import { z } from 'zod';

const formSchema = z.object({
  name: z.string(),
  birthdate: z.string().date(),
  gender: z.enum(["male", "female"]),
  phone: z.string(),
  email: z.string().email(),
  password: z.string(),
  avatar: z.string().url(),
})

const defaultAvatar = 'https://i.pinimg.com/originals/c6/e5/65/c6e56503cfdd87da299f72dc416023d4.jpg';

const customer = ref<z.infer<typeof formSchema>>({
  name: 'Nguyễn Văn A',
  birthdate: '1990-05-15',
  gender: 'male',
  phone: '0982460352',
  email: 'nguyenvana@example.com',
  password: '********',
  avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDI5h1MYhsDtHz8OHPTEKVBc_unp6tPtUOr6ym1E_azguPoUl-jsT4K0KmNQQYsfRalMo&usqp=CAU',
});

const maskedPhone = computed(() => customer.value.phone.replace(/(\d{3})\d{4}(\d{1})(\d{2})/, '*** **** *$3'));

const fileInput = ref<HTMLInputElement | null>(null);

const triggerFileInput = () => {
  fileInput.value?.click();
};

const updateAvatar = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];

  if (file && file.size <= 5 * 1024 * 1024) { // Giới hạn 5MB
    customer.value.avatar = URL.createObjectURL(file);
  } else {
    alert("Vui lòng chọn ảnh có dung lượng tối đa 5MB!");
  }
};

const isValid = computed(() => formSchema.safeParse(customer.value).success);

const saveChanges = () => {
  // Send ref up to api or whatever
};
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">Thông tin khách hàng</h1>
  <ValidateForm class="p-6 bg-white rounded-lg shadow max-w-6xl mx-auto">
    <div class="flex items-center mb-6">
      <!-- Ảnh đại diện -->
      <div class="flex flex-col items-center mr-6">
        <p class="block text-m font-medium mb-2">Ảnh đại diện</p>
        <div class="relative w-24 h-24 border border-gray-300 rounded-full overflow-hidden">
          <img :src="customer.avatar || defaultAvatar" alt="Profile Picture" class="w-full h-full object-cover" />
        </div>
      </div>
      <!-- Nút cập nhật & thông tin định dạng -->
      <div class="flex flex-col">
        <input type="file" @change="updateAvatar" accept="image/jpeg, image/png" class="hidden" ref="fileInput" />
        <button @click="triggerFileInput"
          class="bg-gray-300 text-black px-5 py-3 rounded-lg shadow font-medium text-lg mb-1 text-left">
          Cập nhật ảnh mới
        </button>
        <p class="text-gray-500 text-sm">Dung lượng file tối đa 5 MB.</p>
        <p class="text-gray-500 text-sm">Định dạng: .JPEG, .PNG</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-center">
      <!-- Cột Trái -->
      <div class="space-y-6">
        <div>
          <label class="block text-lg font-medium mb-2">Họ và tên</label>
          <input v-model="customer.name" type="text"
            class="w-5/6 border border-gray-300 p-2 font-medium text-lg rounded-lg" placeholder="Khách hàng" />
        </div>
        <div>
          <label class="block text-lg font-medium mb-2">Ngày sinh</label>
          <input v-model="customer.birthdate" type="date"
            class="w-5/6 border border-gray-300 p-2 font-medium text-lg rounded-lg" />
        </div>
        <div>
          <label class="block text-lg font-medium mb-2">Giới tính</label>
          <select v-model="customer.gender" class="w-5/6 border border-gray-300 rounded-lg p-2 font-medium text-lg">
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
      </div>
      <!-- Đường thẳng giữa hai cột -->
      <div class="w-px bg-gray-300 h-full mx-auto"></div>
      <!-- Cột Phải -->
      <div class="space-y-6">
        <div>
          <label class="block text-lg font-medium mb-2">Số điện thoại</label>
          <p class="w-3/4 border border-transparent rounded p-2 font-medium text-lg">{{ maskedPhone }}</p>
        </div>
        <div>
          <label class="block text-lg font-medium mb-2">Email</label>
          <div class="flex items-center justify-between">
            <p class="w-3/4 border border-transparent rounded p-2 mr-2 font-medium text-lg">{{ customer.email }}</p>
            <button class="text-blue-500 hover:underline font-medium text-lg">Cập nhật</button>
          </div>
        </div>
        <div>
          <label class="block text-lg font-medium mb-2">Mật khẩu</label>
          <div class="flex items-center justify-between">
            <span class="font-medium text-lg">Đổi mật khẩu</span>
            <button class="text-blue-500 hover:underline font-medium text-lg">Cập nhật</button>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-end">
      <button :class="[
        'px-6 py-2 rounded shadow font-medium text-lg bg-blue-500 text-white',
        'disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed'
      ]" :disabled="isValid" @click="saveChanges">
        Lưu thay đổi
      </button>
    </div>
  </ValidateForm>
</template>

<style scoped></style>
