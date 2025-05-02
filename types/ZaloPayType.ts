export interface DTO_RQ_ZaloPay {
    account_id: string;
    service_provider_id: number;
    service_provider_name: string;
    ticket: DTO_RQ_Ticket[];
}
export interface DTO_RQ_Ticket {
    id: number;
    seat_name: string;
    price: number;
}
export interface DTO_RP_StatusZaloPay {
    app_trans_id: string;
}
