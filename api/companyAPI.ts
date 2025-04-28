import type {BusCompanyType} from "~/types/CompanyType";
import type { ApiResponse } from "./APIResponse";
// const API_BASE_URL = "https://vinahome-server.onrender.com";
// const API_BASE_URL = "http://localhost:3002";
const config = useRuntimeConfig();
const API_GATEWAY_URL = config.public.API_GATEWAY_URL;

export const createCompanyAPI = async (companyInfo: BusCompanyType): Promise<ApiResponse<BusCompanyType>> => {
    try {
        return await $fetch<ApiResponse<BusCompanyType>>(`${API_GATEWAY_URL}/v2/company/create-company`, {
            method: "POST",
            body: companyInfo,
        });
    } catch (error) {
        console.error("Create company: ", error);
        throw error;
    }
}
export const updateCompanyAPI = async (companyId: number, companyInfo: BusCompanyType): Promise<ApiResponse<BusCompanyType>> => {
    try {
        return await $fetch<ApiResponse<BusCompanyType>>(`${API_GATEWAY_URL}/v2/company/update-company/${companyId}`, {
            method: "PUT",
            body: companyInfo,
        });
    } catch (error) {
        console.error("Update company: ", error);
        throw error;
    }
}
export const getCompanyAPI = async (): Promise<ApiResponse<BusCompanyType[]>> => {
    try {
        return await $fetch<ApiResponse<BusCompanyType[]>>(`${API_GATEWAY_URL}/v2/company/get-all`, {
            method: "GET",
        });
    } catch (error) {
        console.error("Get company failed: ", error);
        throw error;
    }
}
export const deleteCompanyAPI = async (companyId: number): Promise<ApiResponse<void>> => {
    try {
        return await $fetch<ApiResponse<void>>(`${API_GATEWAY_URL}/v2/company/delete-company/${companyId}`, {
            method: "DELETE",
        });
    } catch (error) {
        console.error("Delete company: ", error);
        throw error;
    }
}

export const createPolicyAPI = async (companyId: number, policyInfo: any): Promise<ApiResponse<any>> => {
    try {
        return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/company/create-policy/${companyId}`, {
            method: "POST",
            body: policyInfo,
        });
    } catch (error) {
        console.error("Create policy: ", error);
        throw error;
    }
}

export const getPolicyAPI = async (companyId: number): Promise<ApiResponse<any>> => {
    try {
        return await $fetch<ApiResponse<any>>(`${API_GATEWAY_URL}/v2/company/get-policy/${companyId}`, {
            method: "GET",
        });
    } catch (error) {
        console.error("Get policy failed: ", error);
        throw error;
    }
}