import type {
  BusCompanyType,
  DTO_RP_RegisterSaleTicketOnPlatform,
  DTO_RQ_RegisterSaleTicketOnPlatform,
} from "~/types/CompanyType";
import type { ApiResponse } from "./APIResponse";

// const API_BASE_URL = "https://vinahome-server.onrender.com";
// const API_BASE_URL = "http://localhost:3002";
// const config = useRuntimeConfig();
// const API_GATEWAY_URL = config.public.API_GATEWAY_URL;
// const API_GATEWAY_URL = "http://localhost:3002";

export const createCompanyAPI = async (
  companyInfo: BusCompanyType
): Promise<ApiResponse<BusCompanyType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<BusCompanyType>>(
      `${API_GATEWAY_URL}/v2/company/create-company`,
      {
        method: "POST",
        body: companyInfo,
      }
    );
  } catch (error) {
    console.error("Create company: ", error);
    throw error;
  }
};
export const updateCompanyAPI = async (
  companyId: number,
  companyInfo: BusCompanyType
): Promise<ApiResponse<BusCompanyType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<BusCompanyType>>(
      `${API_GATEWAY_URL}/v2/company/update-company/${companyId}`,
      {
        method: "PUT",
        body: companyInfo,
      }
    );
  } catch (error) {
    console.error("Update company: ", error);
    throw error;
  }
};

export const getAllCompanyAPI = async (): Promise<
  ApiResponse<BusCompanyType[]>
> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<BusCompanyType[]>>(
      `${API_GATEWAY_URL}/v2/company/get-all`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get company failed: ", error);
    throw error;
  }
};

export const getCompanyAPI = async (
  id: string
): Promise<ApiResponse<BusCompanyType>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<BusCompanyType>>(
      `${API_GATEWAY_URL}/v2/company/get-company/${id}`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    console.error("Get company failed: ", error);
    throw error;
  }
};

export const deleteCompanyAPI = async (
  companyId: number
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/company/delete-company/${companyId}`,
      {
        method: "DELETE",
      }
    );
  } catch (error) {
    console.error("Delete company: ", error);
    throw error;
  }
};

export const registerSaleTicketOnPlatformAPI = async (
  data: DTO_RQ_RegisterSaleTicketOnPlatform
): Promise<ApiResponse<void>> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<void>>(
      `${API_GATEWAY_URL}/v2/company/register-sale-ticket-on-platform`,
      {
        method: "POST",
        body: data,
      }
    );
  } catch (error) {
    throw error;
  }
};

export const getSaleTicketOnPlatformAPI = async (): Promise<
  ApiResponse<DTO_RP_RegisterSaleTicketOnPlatform[]>
> => {
  const config = useRuntimeConfig();
  const API_GATEWAY_URL = config.public.apiGatewayUrl;
  try {
    return await $fetch<ApiResponse<DTO_RP_RegisterSaleTicketOnPlatform[]>>(
      `${API_GATEWAY_URL}/v2/company/get-sale-ticket-on-platform`,
      {
        method: "GET",
      }
    );
  } catch (error) {
    throw error;
  }
};
