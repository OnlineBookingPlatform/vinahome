interface Ticket {
    id: number;
    seat_name: string;
    price: number;
}
export interface DTO_RQ_DataPay {
    account_id: string | null;
    service_provider_id: number | null;
    service_provider_name: string | null;
    ticket: Ticket[];
}