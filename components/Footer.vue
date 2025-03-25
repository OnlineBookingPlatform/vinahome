<template>
    <footer class="bg-gray-100 text-white py-8 border-t-[8px] border-[#0072bc]">
        <div class="container mx-auto px-4">
            <el-row>
                <el-col :span="4">
                    <div class="space-y-4">
                        <h3 class="text-black font-bold text-lg">Về chúng tôi</h3>
                        <div class="flex flex-col space-y-2 m-2">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Giới thiệu
                                Vinahome</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Tuyển dụng</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Tin tức</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Liên hệ</a>
                        </div>
                    </div>

                </el-col>
                <el-col :span="4">
                    <div class="space-y-4">
                        <h3 class="text-black font-bold text-lg">Hỗ trợ</h3>
                        <div class="flex flex-col space-y-2 m-2">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Hướng dẫn thanh toán</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Tra cứu vé</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Câu hỏi thường gặp</a>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="space-y-4">
                        <h3 class="text-black font-bold text-lg">Sản phẩm</h3>
                        <div class="flex flex-col space-y-2 m-2">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Vé xe khách</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Cho thuê xe</a>
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Khách sạn</a>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <div class="space-y-4">
                        <h3 class="text-black font-bold text-lg">Giải pháp hỗ trợ</h3>
                        <div class="flex flex-col space-y-2 m-2">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Hệ thống quản lý nhà xe</a>
                        </div>
                    </div>
                </el-col>
                <el-col :span="4">
                    <h3 class="text-black font-bold text-lg">Theo dõi chúng tôi trên</h3>
                    <div class="flex flex-col gap-2 m-2">
                        <div class="flex items-center gap-2 ">
                            <img src="/static/footer-social-facebook.svg" alt="Facebook" class="w-6 h-6">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Facebook</a>
                        </div>
                        <div class="flex items-center gap-2 my-2">
                            <img src="/static/footer-social-youtube.svg" alt="Youtube" class="w-6 h-6">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Youtube</a>
                        </div>
                        <div class="flex items-center gap-2">
                            <img src="/static/footer-social-tiktok.svg" alt="Tiktok" class="w-6 h-6">
                            <a href="#" class="text-gray-600 hover:text-blue-600 transition-colors text-[13px]">Tiktok</a>
                        </div>
                    </div>

                </el-col>
                <el-col :span="4">
                    <h3 class="text-black font-bold text-lg">Tải ứng dụng Vinahome</h3>
                    <div class="m-2">
                        <img src="/static/app-store.png" alt="App Store" class="w-[150px] my-2" />
                        <img src="/static/gg-play.png" alt="Google Play" class="w-[150px]" />
                    </div>
                </el-col>
            </el-row>
            <div class="mt-8 border-t border-gray-400 pt-4 text-center">
                <p class="text-gray-400">&copy; 2025 VinaHome. All rights reserved.</p>
            </div>
        </div>
    </footer>
</template>

<style scoped></style>