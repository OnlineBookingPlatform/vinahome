export interface TicketType {
  id: number;
  seat_code: string;
  seat_column: number;
  seat_row: number;
  seat_floor: number;
  seat_status: boolean;
  seat_name: string;
  base_price: number;
}
export interface SelectedTicket {
  id: number;
  seat_name: string;
  price: number;
}