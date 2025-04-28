export interface BusCompanyType {
  id: number;
  name: string;
  phone: string;
  address: string;
  tax_code: string;
  status: boolean;
  url_logo: string;
  code: string;
  note: string;
  created_at: string;
}

export interface DTO_RQ_RegisterSaleTicketOnPlatform {
  name: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  note: string | null;
  bus_company_name: string | null;
}
