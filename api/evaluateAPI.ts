import type { EvaluateType } from "~/types/EvaluateType";
import type { ApiResponse } from "./APIResponse";

export const createEvaluateAPI = async (data: EvaluateType): Promise<ApiResponse<EvaluateType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<EvaluateType>>(`${API_GATEWAY_URL}/v2/evaluate/create-evaluate`, {
      method: "POST",
      body: data,
    });
  } catch (error) {
    console.error("Create evaluate: ", error);
    throw error;
  }
}

export const getEvaluatesAverageAPI = async (tripId: number): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/evaluate/get-evaluates-average/${tripId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Get evaluates average: ", error);
    throw error;
  }
}

export const getEvaluatesByTripIdAPI = async (tripId: number): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/evaluate/get-evaluates-by-trip-id/${tripId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Get evaluates by trip id: ", error);
    throw error;
  }
}