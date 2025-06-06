<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { registerSaleTicketOnPlatformAPI } from '~/api/companyAPI';
import type { DTO_RQ_RegisterSaleTicketOnPlatform } from '~/types/CompanyType';

definePageMeta({
  layout: "default",
});

const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive<DTO_RQ_RegisterSaleTicketOnPlatform>({
  name: null,
  phone: null,
  email: null,
  address: null,
  note: null,
  bus_company_name: null,
})
const rules = reactive<FormRules<DTO_RQ_RegisterSaleTicketOnPlatform>>({
  name: [
    { required: true, message: 'Vui lòng nhập họ và tên', trigger: 'blur' },
  ],
  phone: [
    { required: true, message: 'Vui lòng nhập số điện thoại', trigger: 'blur' },
  ],
  bus_company_name: [
    { required: true, message: 'Vui lòng nhập tên nhà xe', trigger: 'blur' },
  ],
})
const successMessage = ref('')
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      console.log('submit!', ruleForm)
      await registerSaleTicketOnPlatformAPI(ruleForm)
      ElMessage.success('Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.');
      successMessage.value = 'Đăng ký thành công! Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.'
    } else {
      console.log('error submit!', fields)
      ElMessage.error('Vui lòng kiểm tra lại thông tin đã nhập.');
    }
  })
}
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' 
  });
}
</script>

<template>
  <!-- Phần 1: Header (Màu xanh) -->
  <section class="bg-blue-500 text-white py-20 [@media(max-width:450px)]:py-10">
    <el-row class="container mx-auto [@media(max-width:450px)]:px-2">
      <el-col :xs="24" :md="14" class="flex items-center">
        <div class="px-10 [@media(max-width:450px)]:px-2">
          <h1 class="text-5xl font-bold leading-tight [@media(max-width:450px)]:text-4xl">
            Tăng 30% lượng khách đặt vé khi mở bán online trên Vinahome ngay hôm nay!
          </h1>
          <h2 class="text-2xl font-bold leading-tight mt-5 [@media(max-width:450px)]:text-1xl">
            Đăng ký miễn phí và chỉ mất 1 phút để hoàn tất
          </h2>
        </div>
      </el-col>

      <el-col :xs="24" :md="10">
        <div class="flex justify-center [@media(min-width:1200px)]:justify-start mt-[20px]">
          <div
            class="max-w-[500px] p-8 bg-white text-black rounded-lg shadow-lg border border-gray-300 [@media(max-width:450px)]:max-w-[300px] [@media(max-width:450px)]:p-2">
            <h2 class="text-base md:text-lg font-bold leading-tight text-center mb-5 [@media(max-width:450px)]:text-lg">
              Bắt đầu lấp đầy chỗ trống trên xe của bạn cùng với nền tảng bán vé xe khách trực tuyến VinaHome
            </h2>
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules">
              <el-row :gutter="20">
                <el-col :xs="24" :md="12">
                  <el-form-item label="Họ và tên" label-position="top" prop="name">
                    <el-input placeholder="Nhập họ và tên" size="large" v-model="ruleForm.name" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                  <el-form-item label="Số điện thoại liên hệ" label-position="top" prop="phone">
                    <el-input placeholder="Nhập số điện thoại" size="large" v-model="ruleForm.phone" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row :gutter="20">
                <el-col :xs="24" :md="12">
                  <el-form-item label="Email" label-position="top" prop="email">
                    <el-input placeholder="Nhập email" size="large" v-model="ruleForm.email" />
                  </el-form-item>
                </el-col>
                <el-col :xs="24" :md="12">
                  <el-form-item label="Tên nhà xe" label-position="top" prop="bus_company_name">
                    <el-input placeholder="Nhập tên nhà xe" size="large" v-model="ruleForm.bus_company_name" />
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item label="Địa chỉ" label-position="top" prop="address">
                <el-input placeholder="Nhập thông tin" size="large" v-model="ruleForm.address" />
              </el-form-item>
              <el-form-item label="Nội dung tư vấn" label-position="top" prop="note">
                <el-input type="textarea" placeholder="Nhập nội dung tư vấn" size="large" v-model="ruleForm.note"
                  :autosize="{ minRows: 2, maxRows: 4 }" />
              </el-form-item>
              <el-button type="primary" size="large" class="w-full" @click="submitForm(ruleFormRef)">
                Đăng ký mở bán
              </el-button>
            </el-form>
            <p class="text-center text-gray-500 mt-4">
              {{ successMessage }}
            </p>

          </div>
        </div>
      </el-col>
    </el-row>
  </section>

  <!-- Phần 2: Nội dung (Màu trắng) -->
  <section class="bg-white text-gray-800 py-16">
    <div class="container mx-auto text-center [@media(max-width:450px)]:px-1">
      <h2 class="text-4xl font-bold text-center mb-4 [@media(max-width:450px)]:text-2xl">
        Sự an tâm của Chủ nhà xe luôn là ưu tiên hàng đầu tại Vinahome
      </h2>

      <div class="grid md:grid-cols-3 gap-12 mt-16 [@media(max-width:450px)]:mt-12 [@media(max-width:450px)]:gap-10">
        <div class="px-8 flex flex-col text-left items-center [@media(max-width:450px)]:text-center">
          <div class="flex justify-center mb-4">
            <img src="/icon/chart.png" alt="" class="w-14 h-14" />
          </div>
          <h3 class="text-xl font-semibold mb-3 text-center">
            Tỷ lệ khách đặt vé nhưng không sử dụng dịch vụ tại Vinahome chỉ chiếm tỉ lệ rất nhỏ
          </h3>
          <p class="text-lg leading-relaxed flex-1">
            Lượng khách hàng đặt vé thông qua Vinahome đều là khách thực tế, giúp nhà xe hạn chế tối đa tình trạng giữ
            chỗ ảo làm thất thoát doanh thu.
          </p>
        </div>
        <div class="px-8 flex flex-col text-left items-center [@media(max-width:450px)]:text-center">
          <div class="flex justify-center mb-4">
            <img src="/icon/money-bag.png" alt="" class="w-14 h-14" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-center">
            Đối soát và thanh toán công nợ minh bạch, đúng lịch
          </h3>
          <p class="text-lg leading-relaxed flex-1">
            Vinahome cam kết quy trình thanh toán rõ ràng và đúng hạn, hỗ trợ nhà xe chủ động dòng tiền với nhiều lựa
            chọn phương thức thanh toán linh hoạt.
          </p>
        </div>
        <div class="px-8 flex flex-col text-left items-center [@media(max-width:450px)]:text-center">
          <div class="flex justify-center mb-4">
            <img src="/icon/support.png" alt="" class="w-14 h-14" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-center">
            Hỗ trợ tận tâm từ đội ngũ chuyên viên Vinahome
          </h3>
          <p class="text-lg leading-relaxed flex-1">
            Ngay từ khi đăng ký bán vé, nhà xe sẽ nhận được sự đồng hành, hướng dẫn chi tiết từ đội ngũ Vinahome xuyên
            suốt quá trình hoạt động.
          </p>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-12 mt-12 place-items-center">
        <div
          class="px-32 flex flex-col text-left items-center [@media(max-width:450px)]:px-8 [@media(max-width:450px)]:text-center">
          <div class="flex justify-center mb-4">
            <img src="/icon/movies.png" alt="" class="w-14 h-14" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-center">
            Linh hoạt đăng bán số lượng vé theo tuyến/chuyến phù hợp
          </h3>
          <p class="text-lg leading-relaxed flex-1">
            Vinahome không yêu cầu nhà xe phải mở bán toàn bộ tuyến/chuyến hoặc ghế trống, cho phép nhà xe tự do điều
            chỉnh theo nhu cầu thực tế nhằm tối ưu hiệu quả kinh doanh.
          </p>
        </div>
        <div
          class="px-32 flex flex-col text-left items-center  [@media(max-width:450px)]:px-8 [@media(max-width:450px)]:text-center">
          <div class="flex justify-center mb-4">
            <img src="/icon/software.png" alt="" class="w-14 h-14" />
          </div>
          <h3 class="text-xl font-semibold mb-2 text-center">
            Sàn giao dịch vé xe khách uy tín và chuyên nghiệp
          </h3>
          <p class="text-lg leading-relaxed flex-1">
            Thành lập từ năm 2024, Vinahome đã trở thành cầu nối tin cậy giữa nhà xe và hành khách, hỗ trợ tăng trưởng
            thương hiệu và tiếp cận lượng khách hàng rộng lớn.
          </p>
        </div>
      </div>
      <div class="mt-12">
        <button
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300" @click="scrollToTop">
          Đăng ký mở bán
        </button>
      </div>
    </div>
  </section>

  <!-- Phần 3: Lắng nghe khách hàng (Màu trắng) -->
  <section class="bg-gray-100 text-gray-800 py-16">
    <div class="container mx-auto px-4 [@media(max-width:450px)]:px-1">
      <h2 class="text-4xl font-bold text-center  [@media(max-width:450px)]:text-2xl mb-10">Lắng nghe khách hàng nói về
        Vina Home</h2>
     

      <div class="space-y-10 [@media(max-width:450px)]:px-5">
        <div class="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row items-center md:items-start">
          <div class="flex flex-col items-center">
            <img src="" alt="Khách hàng 1" class="w-32 h-32 rounded-full object-cover border-4 border-yellow-400" />
            <p class="font-semibold mt-3">Anh Hoàng Khánh Chiến</p>
            <p class="text-gray-500 text-sm">Nhà xe Tiến Oanh</p>
          </div>
          <div class="mt-4 md:mt-0 md:ml-6">
            <p class="text-gray-700 italic">
              "Vinahome đã là đối tác vô cùng quý giá trong hành trình thành công của chúng tôi. Doanh thu và quy mô của
              chúng tôi đã tăng đáng kể từ 2 lên 20 xe kể từ khi bán vé trên nền tảng của Vinahome. Với sự hỗ trợ và
              hướng
              dẫn từ Vinahome, chúng tôi đã và đang là top nhà xe được khách hàng yêu thích tại tuyến Sài Gòn - Buôn Mê
              Thuột. <br><br>
              Điểm đặc biệt của Vinahome là đội ngũ rất chuyên nghiệp. Họ đã luôn đồng hành cùng chúng tôi, phân tích
              chiến lược các tuyến đường và xác định những điểm cần cải thiện trong hoạt động của chúng tôi. Việc có một
              đại diện của Vinahome ngồi cùng chúng tôi, cung cấp thông tin và hướng dẫn đã đóng vai trò quan trọng
              trong
              thành công của chúng tôi. Họ thấu hiểu sự quan trọng của việc cộng tác chặt chẽ để giúp chúng tôi đạt được
              mục tiêu. Chúng tôi đã tối ưu hóa hoạt động, nâng cao chất lượng dịch vụ và thu hút nhiều khách hàng hơn.
              Sự chuyên môn và hỗ trợ của họ đã tạo ra giá trị không thể đo đạc trong việc thúc đẩy kinh doanh của chúng
              tôi. Chúng tôi rất biết ơn sự cam kết và tận tụy của họ đối với thành công của chúng tôi. <br><br>
              Chúng tôi giới thiệu Vinahome cho bất kỳ công ty vận chuyển nào muốn phát triển kinh doanh và đạt được kết
              quả xuất sắc. Họ không chỉ đơn thuần là một nền tảng, mà còn là một đối tác chiến lược quan tâm đến thành
              công của chúng tôi."
            </p>
          </div>
        </div>

        <div class="bg-white p-6 rounded-xl shadow-md flex flex-col md:flex-row-reverse items-center md:items-start">
          <div class="flex flex-col items-center">
            <img src="" alt="Khách hàng 2" class="w-32 h-32 rounded-full object-cover border-4 border-yellow-400" />
            <p class="font-semibold mt-3">Chị Huỳnh Thị Tường Vân</p>
            <p class="text-gray-500 text-sm">Nhà xe An Anh Limousine</p>
          </div>
          <div class="mt-4 md:mt-0 md:mr-6">
            <p class="text-gray-700 italic">
              "Với sự hỗ trợ toàn diện từ Vinahome, nhà xe của chúng tôi đã có thể tăng doanh thu bán vé thông qua sàn
              giao dịch. Vinahome cung cấp một loạt công cụ giúp tăng lượng truy cập vào gian hàng của chúng tôi trên
              nền
              tảng, đồng thời hỗ trợ tăng số lượng khách hàng mua vé thông qua các chương trình ưu đãi hấp dẫn như ưu
              đãi đặt sớm và ưu đãi phút chót. Nhờ đó, chúng tôi đã có cơ hội mở rộng quy mô kinh doanh và đạt được kết
              quả đáng kinh ngạc. <br><br>
              Bên cạnh đó, chúng tôi rất hài lòng với các chương trình độc quyền từ Vinahome. Nhà xe của chúng tôi đã
              được
              tận hưởng bộ quyền lợi truyền thông trị giá lên đến 50 triệu đồng, được ưu tiên hiển thị trên các trang
              bán vé của Vinahome và được hưởng ưu đãi đặc biệt trong hệ sinh thái Vinahome. Những quyền lợi này đã giúp
              chúng tôi nổi bật và thu hút sự chú ý từ khách hàng. <br><br>
              Việc đăng ký mở bán vé trên Vinahome cực kỳ đơn giản. Chỉ cần hoàn tất quy trình đăng ký, chúng tôi đã có
              thể tận hưởng những lợi ích vô cùng đáng giá mà Vinahome mang lại. Chúng tôi thật sự biết ơn Vinahome vì
              sự hỗ
              trợ và cơ hội phát triển kinh doanh tuyệt vời này!"
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Phần 4: Đăng ký (Màu xám) -->
  <section class="bg-gray-800 text-white py-16">
    <div class="container mx-auto px-4 [@media(max-width:450px)]:px-1">
      <h2 class="text-4xl font-bold text-center mb-10 [@media(max-width:450px)]:text-2xl"> Đăng ký mở bán theo 4 bước
        đơn giản</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6 [@media(max-width:450px)]:px-5">
        <div class="bg-white text-gray-900 p-6 rounded-2xl shadow-lg text-center">
          <div
            class="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mx-auto text-lg font-bold mb-4">
            1</div>
          <h3 class="text-xl font-semibold">Đăng ký thông tin</h3>
          <p class="text-gray-600 mt-2 text-lg">
            Quý khách vui lòng để lại thông tin hoặc liên hệ hotline để được tư vấn hỗ trợ.
          </p>
        </div>

        <div class="bg-white text-gray-900 p-6 rounded-2xl shadow-lg text-center">
          <div
            class="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mx-auto text-lg font-bold mb-4">
            2</div>
          <h3 class="text-xl font-semibold">Tư vấn</h3>
          <p class="text-gray-600 mt-2 text-lg">
            Vinahome sẽ liên hệ xác minh thông tin và tư vấn sớm nhất. Giải đáp tất cả thắc mắc của nhà xe về tệp khách
            hàng mục tiêu và kỷ vọng của nhà xe.
          </p>
        </div>

        <div class="bg-white text-gray-900 p-6 rounded-2xl shadow-lg text-center">
          <div
            class="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mx-auto text-lg font-bold mb-4">
            3</div>
          <h3 class="text-xl font-semibold">Ký hợp đồng</h3>
          <p class="text-gray-600 mt-2 text-lg">
            Sau khi tư vấn thành công, Chủ nhà xe và Vinahome sẽ tiến hành ký kết hợp đồng.
          </p>
        </div>

        <div class="bg-white text-gray-900 p-6 rounded-2xl shadow-lg text-center">
          <div
            class="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full mx-auto text-lg font-bold mb-4">
            4</div>
          <h3 class="text-xl font-semibold">Mở bán tại Vinahome</h3>
          <p class="text-gray-600 mt-2 text-lg">
            Chúng tôi luôn đồng hành và hỗ trợ nhà xe cho đến khi phát sinh doanh thu. Chủ
            nhà xe hoàn toàn kiểm soát được nội dung hiển thị trên sàn về thương hiệu nhà xe.
          </p>
        </div>
      </div>
      <div class="flex justify-center mt-8">
        <button
          class="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300" @click="scrollToTop">
          Đăng ký mở bán
        </button>
      </div>
    </div>
  </section>



  <!-- Phần 5: Lợi ích (Màu xám) -->
  <section class="bg-white text-gray-900 py-16">
    <div class="container mx-auto px-4 [@media(max-width:450px)]:px-1">
      <h2 class="text-4xl font-bold text-center mb-10 [@media(max-width:450px)]:text-2xl">Giải đáp thắc mắc của bạn</h2>

      <el-collapse class="bg-white [@media(max-width:450px)]:px-5" style="--el-collapse-border-color: transparent;">
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
