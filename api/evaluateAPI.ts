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

export const getEvaluatesAverageByCompanyIdAPI = async (companyId: number): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/evaluate/get-evaluates-average-by-company-id/${companyId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Get evaluates average by company id: ", error);
    throw error;
  }
}

export const getEvaluatesByCompanyIdAPI = async (companyId: number): Promise<ApiResponse<any>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/evaluate/get-evaluates-by-company-id/${companyId}`, {
      method: "GET",
    });
  } catch (error) {
    console.error("Get evaluates by company id: ", error);
    throw error;
  }
}