import type { UserType } from "~/types/UserType";
import type { ApiResponse } from "~/api/APIResponse";
// const API_BASE_URL = "https://vinahome-server.onrender.com";
const API_BASE_URL = "http://localhost:3002";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsw7kuodi/image/upload";
const UPLOAD_PRESET = "account";

export const getAccountInfo = async (
  userId?: number
): Promise<ApiResponse<UserType>> => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_BASE_URL}/account/get-account-info/${userId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get Data Account failed: ", error);
    throw error;
  }
};

export const updateAccountInfo = async (
  userId: number,
  userData: Partial<UserType>
): Promise<ApiResponse<UserType>> => {
  if (!userId) {
    throw new Error("userId is required");
  }
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_BASE_URL}/account/update-account-info/${userId}`,
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
  try {
    return await $fetch<ApiResponse<UserType>>(
      `${API_BASE_URL}/account/update-avatar-account/${userId}`,
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
