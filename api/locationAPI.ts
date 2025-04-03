import type { Province } from "~/types/LocationType";
import type { ApiResponse } from "./APIResponse";

const API_GATEWAY_URL = "http://localhost:3002";

export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
  try {
    return await $fetch<ApiResponse<Province[]>>(
      `${API_GATEWAY_URL}/v2/location/provinces`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Error fetching provinces:", error);
    throw error;
  }
};
