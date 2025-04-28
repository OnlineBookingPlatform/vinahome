import type { Province } from "~/types/LocationType";
import type { ApiResponse } from "./APIResponse";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.apiGateway;


export const getProvinces = async (): Promise<ApiResponse<Province[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
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
