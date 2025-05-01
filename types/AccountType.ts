export interface UserType {
    id: string;
    name: string;
    email: string;
    url_avatar: string;
    phone: string;
    account_type: string;
    gender: number;
    date_birth: string;
    token: string;
    note: string;
}


export interface AccountByCompanyBusType {
    id: string | null;
    name: string | null;
    username: string | null;
    password: string | null;
    phone: string | null;
    gender: number | null;
    role: number | null;
    email: string | null;
    status: false;
    company_id: number | null;
}

export interface DTO_RQ_SuperAdminLogin {
    username: string | null;
    password: string | null;
}
export interface DTO_RP_SuperAdmin {
    id: string;
    name: string;
    username: string;
    account_type: string;
}

export interface DTO_RQ_SuperAdmin {
    id: string | null;
    username: string | null;
    password: string | null;
    name: string | null;
    account_type: string | null;
}

export interface SuperAdminType {
    id: string;
    name: string;
    username: string;
    token: string;
    account_type: string;
}

export interface AccountByCompanyBusType {
    id: string | null;
    name: string | null;
    username: string | null;
    password: string | null;
    phone: string | null;
    gender: number | null;
    role: number | null;
    email: string | null;
    company_id: number | null;
}