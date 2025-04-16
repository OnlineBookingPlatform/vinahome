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
  id: number;
  passenger_name: string;
  passenger_phone: string;
  point_up: string;
  point_down: string;
  ticket_note: string;
  email: string;
  gender: number;
}

