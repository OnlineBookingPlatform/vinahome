import type { AccountByCompanyBusType, UserType } from "~/types/AccountType";
import type { ApiResponse } from "~/api/APIResponse";
import { ElMessage } from "element-plus";
// const API_BASE_URL = "http://localhost:3002";
// const API_BASE_URL = "https://8ace-2001-ee0-4f00-57d0-f4b5-6d0d-6d5-45c3.ngrok-free.app";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.API_GATEWAY_URL;
// const API_GATEWAY_URL = "http://localhost:3002";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsw7kuodi/image/upload";
const UPLOAD_PRESET = "account";

export const getAccountInfo = async (
  userId: string
): Promise<ApiResponse<UserType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  if (!userId) {
    ElMessage.error("Thông tin người dùng không hợp lệ");
  }
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_GATEWAY_URL}/v1/account/get-account-info/${userId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get Data Account failed: ", error);
    ElMessage.error("Tải dữ liệu tài khoản thất bại");
    throw error;
  }
};

export const updateAccountInfo = async (
  userId: number,
  userData: Partial<UserType>
): Promise<ApiResponse<UserType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_GATEWAY_URL}/v1/account/update-account-info/${userId}`,
      {
        method: "PUT",
        body: userData,
      }
    );
  } catch (error) {
    console.error("Update Account Info failed: ", error);
    throw error;
  }
};

export const updateAvatarOnServer = async (
  userId: number,
  url_avatar: string
) => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_GATEWAY_URL}/v1/account/update-avatar-account/${userId}`,
      {
        method: "PUT",
        body: { url_avatar },
      }
    );
  } catch (error) {
    console.error("Error updating avatar:", error);
    return { result: false };
  }
};

export const uploadAvatarToCloudinary = async (
  file: File
): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const res = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    console.log("Upload Avatar CloudDinary Response:", data);
    return data.secure_url || null;
  } catch (error) {
    console.error("Upload Error:", error);
    return null;
  }
};

export const getListsAccountByCompanyAPI = async (
  companyId: number
): Promise<ApiResponse<AccountByCompanyBusType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<AccountByCompanyBusType[]>>(
      `${API_GATEWAY_URL}/account/get-list-account-by-company/${companyId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get List Account By Company failed: ", error);
    throw error;
  }
};
