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
}

export interface AccountByCompanyBusType {
    id: string;
    name: string;
    username: string;
    password: string;
    phone: string;
    gender: number;
    role: number;
    email: string;
    company_id:number;
}