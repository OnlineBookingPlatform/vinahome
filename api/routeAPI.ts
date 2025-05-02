import type { RoutePopularType } from "~/types/RouteType";
import type { ApiResponse } from "./APIResponse";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/dsw7kuodi/image/upload";
const UPLOAD_PRESET = "route_popular";
export const createRoutePopularAPI = async (
  data: RoutePopularType
): Promise<ApiResponse<RoutePopularType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<RoutePopularType>>(
      `${API_GATEWAY_URL}/v2/route/create-route-popular`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    console.error("Create Route Popular failed: ", error);
    throw error;
  }
}

export const updateRoutePopularAPI = async (
  data: RoutePopularType
): Promise<ApiResponse<RoutePopularType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<RoutePopularType>>(
      `${API_GATEWAY_URL}/v2/route/update-route-popular/${data.id}`,
      {
        method: "PUT",
        body: data,
      }
    );
  } catch (error) {
    console.error("Update Route Popular failed: ", error);
    throw error;
  }
}

export const deleteRoutePopularAPI = async (
  data: RoutePopularType
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/route/delete-route-popular/${data.id}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Delete Route Popular failed: ", error);
    throw error;
  }
}

export const getListRoutePopularAPI = async (): Promise<ApiResponse<RoutePopularType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<RoutePopularType[]>>(
      `${API_GATEWAY_URL}/v2/route/get-list-route-popular`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get List Route Popular failed: ", error);
    throw error;
  }
}

export const getListRoutePopularOnPlatformAPI = async (): Promise<ApiResponse<RoutePopularType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<RoutePopularType[]>>(
      `${API_GATEWAY_URL}/v2/route/get-list-route-popular-on-platform`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get List Route Popular On Platform failed: ", error);
    throw error;
  }
}

export const getRoutePopularAPI = async (): Promise<ApiResponse<RoutePopularType[]>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<RoutePopularType[]>>(
      `${API_GATEWAY_URL}/v2/route/get-list-route-popular`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get Route Popular failed: ", error);
    throw error;
  }
}
