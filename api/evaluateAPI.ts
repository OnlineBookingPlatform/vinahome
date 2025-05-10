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