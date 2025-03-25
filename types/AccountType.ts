export interface UserType {
    id: number;
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
    id: number;
    name: string;
    username: string;
    phone: string;
    gender: number;
    role: number;
    email: string;
}