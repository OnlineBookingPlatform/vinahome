<script setup lang="ts">

definePageMeta({
  layout: "default",
});

import { ref } from "vue";

const activeIndex = ref(null);

const faqs = ref([
  {
    question: "Lợi ích của việc trở thành đối tác bán vé trên sàn Vexere là gì?",
    answer: "Thông tin về lợi ích khi trở thành đối tác trên sàn Vexere."
  },
  {
    question: "Quy trình đăng ký xe mở bán vé trên Vexere như thế nào?",
    answer: "Thông tin chi tiết về quy trình đăng ký mở bán vé trên Vexere."
  },
  {
    question: "Vexere thu những khoản phí nào?",
    answer: "Chi tiết về các khoản phí mà Vexere thu từ đối tác."
  },
  {
    question: "Làm thế nào để tôi quản lý kho vé trên Vexere?",
    answer: "Hướng dẫn cách quản lý kho vé trên nền tảng Vexere."
  },
  {
    question: "Làm thế nào để tôi biết nếu một chỗ ngồi đã được đặt?",
    answer: "Cách kiểm tra trạng thái đặt vé trên hệ thống."
  },
  {
    question: "Làm thế nào để tôi nhận được thanh toán khi bán vé trên sàn Vexere?",
    answer: "Vexere cam kết thanh toán đúng hẹn qua chuyển khoản ngân hàng."
  }
]);

</script>

<template>
  <!-- Phần 1: Header (Màu xanh) -->
  <section class="bg-blue-600 text-white py-20">
    <el-row class="container mx-auto">
      <el-col :span="14" class="flex items-center">
        <div class="px-10">
          <h1 class="text-5xl font-bold leading-tight">
            Tăng 30% lượng khách đặt vé khi mở bán online trên Vinahome ngay hôm nay!
          </h1>
          <h2 class="text-2xl font-bold leading-tight mt-5">
            Đăng ký miễn phí và chỉ mất 1 phút để hoàn tất
          </h2>
        </div>
      </el-col>

      <el-col :span="10" class="flex justify-center">
        <el-card class="p-8 w-[500px] bg-white shadow-lg rounded-lg border border-gray-300">
          <h2 class="text-lg font-bold leading-tight text-center mb-5">
            Bắt đầu lấp đầy chỗ trống trên xe của bạn với hơn 10 triệu lượt khách đi thành công trên Vinahome
          </h2>
          <el-form>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Họ và tên" label-position="top" required>
                  <el-input placeholder="Nhập họ và tên" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Số điện thoại liên hệ" label-position="top" required>
                  <el-input placeholder="Nhập số điện thoại" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="Email" label-position="top">
                  <el-input placeholder="Nhập email" size="large" />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="Tên nhà xe" label-position="top">
                  <el-input placeholder="Nhập tên nhà xe" size="large" />
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item label="Tỉnh (Thành phố) / Tuyến đường" label-position="top" required>
              <el-input placeholder="Nhập thông tin" size="large" />
            </el-form-item>
            <el-form-item label="Nội dung tư vấn" label-position="top">
              <el-input type="textarea" placeholder="Nhập nội dung tư vấn" size="large" />
            </el-form-item>
            <el-button type="primary" size="large" class="w-full">
              Đăng ký mở bán
            </el-button>
          </el-form>
          <div class="text-center mt-4 text-sm text-gray-500">
            <span class="text-orange-500 font-bold">Create your own free forms</span> to generate leads from your
            website.
          </div>
        </el-card>
      </el-col>
    </el-row>
  </section>

  <!-- Phần 2: Nội dung (Màu trắng) -->
  <section class="bg-gray-100 text-gray-800 py-16">
    <div class="container mx-auto text-center">
      <h2 class="text-2xl font-bold mb-8">
        Sự an tâm của Chủ nhà xe là ưu tiên hàng đầu của Vexere
      </h2>
      <div class="grid md:grid-cols-3 gap-12">
        <div class="px-8 flex flex-col text-left items-center">
          <div class="flex justify-center mb-4">
            <el-avatar size="50" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          </div>
          <h3 class="text-lg font-semibold mb-2 text-center">Tỷ lệ khách đặt vé mà không đi qua sàn Vexere rất thấp chỉ
            0.2%</h3>
          <p class="text-sm leading-relaxed flex-1">99.8% khách hàng đặt vé trên sàn Vexere là khách thật, giúp nhà xe
            cắt giảm tình trạng đặt ảo giữ ghế mà không đi, không bán được cho khách khác gây thất thoát doanh thu của
            nhà xe.</p>
        </div>
        <div class="px-8 flex flex-col text-left items-center">
          <div class="flex justify-center mb-4">
            <el-avatar size="50" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          </div>
          <h3 class="text-lg font-semibold mb-2 text-center">Quy trình đối soát, thanh toán công nợ đúng hạn</h3>
          <p class="text-sm leading-relaxed flex-1">Vexere đảm bảo thanh toán đúng hạn, giúp nhà xe yên tâm về dòng tiền
            và dễ dàng kiểm soát công nợ với các phương thức thanh toán linh hoạt.</p>
        </div>
        <div class="px-8 flex flex-col text-left items-center">
          <div class="flex justify-center mb-4">
            <el-avatar size="50" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          </div>
          <h3 class="text-lg font-semibold mb-2 text-center">Được hỗ trợ tận tình từ đội ngũ chuyên viên Vexere</h3>
          <p class="text-sm leading-relaxed flex-1">Sau khi đăng ký mở bán, nhà xe được đội ngũ Vexere hỗ trợ hướng dẫn
            quy trình từ thiết lập dịch vụ đến thanh toán trong suốt quá trình hoạt động.</p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-12 mt-12 place-items-center">
        <div class="px-8 flex flex-col text-left items-center">
          <div class="flex justify-center mb-4">
            <el-avatar size="50" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          </div>
          <h3 class="text-lg font-semibold mb-2 text-center">Nhà xe có thể đăng bán một số lượng tuyến/chuyến ghế trống
            nhất định</h3>
          <p class="text-sm leading-relaxed flex-1">Vexere không bắt buộc nhà xe bán tất cả các tuyến/chuyến/ghế trống,
            linh hoạt theo nhu cầu của nhà xe mà vẫn đảm bảo doanh thu tối ưu.</p>
        </div>
        <div class="px-8 flex flex-col text-left items-center">
          <div class="flex justify-center mb-4">
            <el-avatar size="50" src="https://cdn-icons-png.flaticon.com/512/190/190411.png" />
          </div>
          <h3 class="text-lg font-semibold mb-2 text-center">Sàn bán vé xe khách trực tuyến uy tín, đáng tin cậy</h3>
          <p class="text-sm leading-relaxed flex-1">Vexere là nền tảng đặt vé xe khách hoạt động từ năm 2013, giúp nhà
            xe tăng độ phủ thương hiệu và tiếp cận lượng khách hàng tiềm năng lớn.</p>
        </div>
      </div>
      <div class="mt-12">
        <el-button type="warning" size="large">Đăng ký mở bán</el-button>
      </div>
    </div>
  </section>

  <!-- Phần 3: Lợi ích (Màu xám) -->
  <section class="bg-white text-gray-900 py-16">
    <div class="max-w-7xl mx-auto">
      <h2 class="text-4xl font-bold text-center mb-10">Giải đáp thắc mắc của bạn</h2>

      <el-collapse class="bg-white" style="--el-collapse-border-color: transparent;">
        <el-collapse-item name="1" class="mb-4">
          <template #title>
            <span class="text-blue-600 text-xl font-semibold">
              1. Lợi ích của việc trở thành đối tác bán vé trên Vinahome là gì?
            </span>
          </template>
          <div class="p-6 text-lg text-gray-700 border border-gray-300 rounded-lg shadow w-full">
            Khi trở thành đối tác của Vinahome, bạn không chỉ có cơ hội tiếp cận hơn 10 triệu khách hàng tiềm năng mỗi
            tháng,
            mà còn có thể gia tăng doanh thu và tối ưu hóa hoạt động kinh doanh một cách hiệu quả.
            <br /><br />
            Vinahome cung cấp một hệ thống đặt vé trực tuyến hiện đại, giúp bạn dễ dàng quản lý lịch trình, cập nhật số
            lượng vé
            và tự động hóa quy trình bán vé. Nhờ đó, bạn sẽ giảm thiểu tình trạng vé trống, tối ưu hóa số lượng khách
            hàng trên
            mỗi chuyến đi.
            <br /><br />
            Ngoài ra, bạn còn được hưởng các chương trình hỗ trợ quảng bá miễn phí từ Vinahome, giúp thương hiệu nhà xe
            của bạn
            tiếp cận nhiều khách hàng hơn mà không cần tốn chi phí marketing.
          </div>
        </el-collapse-item>

        <el-collapse-item name="2" class="mb-4">
          <template #title>
            <span class="text-blue-600 text-xl font-semibold">
              2. Quy trình đăng ký xe mở bán vé trên Vinahome như thế nào?
            </span>
          </template>
          <div class="p-6 text-lg text-gray-700 border border-gray-300 rounded-lg shadow w-full">
            Để đăng ký trở thành đối tác của Vinahome, bạn chỉ cần thực hiện một số bước đơn giản sau:
            <br /><br />
            <strong>Bước 1: Điền thông tin đăng ký</strong><br>
            Cung cấp thông tin chi tiết về nhà xe, tuyến đường hoạt động, số lượng xe và các dịch vụ đi kèm.
            <br /><br />
            <strong>Bước 2: Xác minh thông tin</strong><br>
            Đội ngũ Vinahome sẽ kiểm tra và xác minh giấy phép kinh doanh, thông tin về xe và chất lượng dịch vụ.
            <br /><br />
            <strong>Bước 3: Kích hoạt tài khoản</strong><br>
            Sau khi xác minh thành công, bạn có thể bắt đầu mở bán vé ngay trong vòng 24 giờ mà không mất bất kỳ khoản
            phí nào.
            <br /><br />
            Trong quá trình hoạt động, đội ngũ hỗ trợ Vinahome luôn sẵn sàng giúp bạn tối ưu hóa doanh thu và giải quyết
            mọi vấn
            đề phát sinh**.
          </div>
        </el-collapse-item>

        <el-collapse-item name="3" class="mb-4">
          <template #title>
            <span class="text-blue-600 text-xl font-semibold">
              3. Vinahome thu những khoản phí nào?
            </span>
          </template>
          <div class="p-6 text-lg text-gray-700 border border-gray-300 rounded-lg shadow w-full">
            Vinahome cam kết minh bạch về chi phí và chỉ thu phí dựa trên mỗi vé bán thành công. Không có phí đăng ký
            ban đầu
            hay các chi phí ẩn khác.
            <br /><br />
            <strong>Các loại phí chính bao gồm:</strong><br>
            - Phí dịch vụ: Một tỷ lệ nhỏ trên mỗi vé bán thành công, giúp duy trì và phát triển nền tảng. <br>
            - Phí giao dịch thanh toán: Áp dụng khi khách hàng thanh toán qua cổng thanh toán online.
            <br /><br />
            Tất cả các khoản phí này sẽ được hiển thị minh bạch trong bảng điều khiển của nhà xe, giúp bạn dễ dàng theo
            dõi và
            quản lý tài chính.
            Vinahome không thu phí hoa hồng nếu vé không được bán ra, giúp bạn tối ưu hóa lợi nhuận mà không phải chịu
            rủi ro.
          </div>
        </el-collapse-item>

        <el-collapse-item name="4">
          <template #title>
            <span class="text-blue-600 text-xl font-semibold">
              4. Làm thế nào để tôi quản lý kho vé trên Vinahome?
            </span>
          </template>
          <div class="p-6 text-lg text-gray-700 border border-gray-300 rounded-lg shadow w-full">
            Vinahome cung cấp một hệ thống quản lý vé thông minh, giúp bạn dễ dàng theo dõi, cập nhật và kiểm soát lượng
            vé bán
            ra.
            <br /><br />
            <strong>Các tính năng quản lý kho vé bao gồm:</strong><br>
            - Cập nhật số lượng vé theo thời gian thực: Bạn có thể nhanh chóng điều chỉnh số lượng vé có sẵn cho từng
            chuyến. <br>
            - Điều chỉnh giá vé linh hoạt: Dễ dàng thay đổi giá vé dựa trên nhu cầu thị trường. <br>
            - Theo dõi báo cáo chi tiết: Hệ thống cung cấp báo cáo doanh thu, tỷ lệ lấp đầy và hiệu suất bán vé, giúp
            bạn đưa ra
            quyết định kinh doanh chính xác hơn.
            <br /><br />
            Với giao diện thân thiện và hỗ trợ từ đội ngũ Vinahome, việc quản lý kho vé trở nên đơn giản hơn bao giờ
            hết, giúp
            bạn tiết kiệm thời gian và tối ưu hóa doanh thu.
          </div>
        </el-collapse-item>

      </el-collapse>
    </div>
  </section>

</template>

<style scoped>
:deep(.el-collapse-item) {
  border-bottom: 1px solid #ddd !important;
}
</style>
