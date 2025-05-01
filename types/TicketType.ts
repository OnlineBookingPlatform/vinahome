export interface TicketType {
  id: number;
  seat_code: string;
  seat_column: number;
  seat_row: number;
  seat_floor: number;
  seat_status: boolean;
  seat_name: string;
  base_price: number;
  status_booking_ticket: boolean;
}
export interface SelectedTicket {
  id: number;
  seat_name: string;
  price: number;
}

export interface DTO_RQ_UpdateTicketOnPlatform {
  id: number | null;
  passenger_name: string | null;
  passenger_phone: string | null;
  point_up: string | null;
  point_down: string | null;
  ticket_note: string | null;
  email: string | null;
  gender: number | null;
  creator_by_id: string | null;
}

export interface DTO_RQ_TicketSearch {
  phone: string | null;
  code: number | null;
}
export interface DTO_RP_TicketSearch {
  id: number;
  passenger_name: string;
  passenger_phone: string;
  point_up: string;
  point_down: string;
  email: string;
  base_price: number;
  payment_method: number;
  seat_name: string;
  route_name: string;
  license_plate: string;
  start_time: string;
  start_date: string;
}
