interface Ticket {
    id: number;
    seat_name: string;
    price: number;
}
export interface DTO_RQ_DataPay {
    service_provider_id: number | null;
    service_provider_name: string | null;
    ticket: Ticket[];
    passenger_name: string | null;
    passenger_phone: string | null;
    point_up: string | null;
    point_down: string | null;
    ticket_note: string | null;
    email: string | null;
    gender: number | null;
    creator_by_id: string | null;
}
export interface DTO_RQ_CheckMomoPayment {
    orderId: string;
    requestId: string;
    ticket: Ticket[];
}
export interface DTO_RP_Transaction {
    id: number;
    created_at: string;
    order_id: string;
    amount: number;
    status: string;
    description: string;
    email: string;
    phone: string;
}