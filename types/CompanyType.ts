export interface BusCompanyType {
  id: number | null;
  name: string | null;
  phone: string | null;
  address: string | null;
  tax_code: string | null;
  status: boolean;
  url_logo: string | null;
  code: string | null;
  note: string | null;
  url_vehicle_online: string | null;
}

export interface DTO_RQ_RegisterSaleTicketOnPlatform {
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
  bus_company_name: string | null;
}

export interface DTO_RP_RegisterSaleTicketOnPlatform {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  note: string;
  bus_company_name: string;
  status: number;
  created_at: string;
}
