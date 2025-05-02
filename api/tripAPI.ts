import type {
  DetailTripType,
  DTO_RP_TripInfo,
  SearchTripParams,
  TripType,
} from "~/types/TripType";
import type { ApiResponse } from "./APIResponse";
import type { TripPointType } from "~/types/PointType";

// const config = useRuntimeConfig();
// const API_GATEWAY_URL = "http://localhost:3002";

export const getTripOnPlatform = async (
  params: SearchTripParams
): Promise<ApiResponse<DTO_RP_TripInfo[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<DTO_RP_TripInfo[]>>(
      `${API_GATEWAY_URL}/v2/trip/search`,
      {
        method: "POST",
        body: params,
      }
    );
  } catch (error) {
    console.error("Lỗi khi tìm kiếm chuyến đi:", error);
    throw error;
  }
};

export const getTripDetail = async (
  tripId: number
): Promise<ApiResponse<DetailTripType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<DetailTripType>>(
      `${API_GATEWAY_URL}/v2/trip/get-trip-detail-on-platform/${tripId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chuyến đi:", error);
    throw error;
  }
};

export const getPointUpByTrip = async (
  tripId: number
): Promise<ApiResponse<TripPointType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<TripPointType[]>>(
      `${API_GATEWAY_URL}/v2/trip/get-point-up-by-trip/${tripId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chuyến đi:", error);
    throw error;
  }
};

export const getPointDownByTrip = async (
  tripId: number
): Promise<ApiResponse<TripPointType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<TripPointType[]>>(
      `${API_GATEWAY_URL}/v2/trip/get-point-down-by-trip/${tripId}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Lỗi khi lấy thông tin chuyến đi:", error);
    throw error;
  }
};
