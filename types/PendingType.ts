import type { DTO_RP_TripInfo } from "./TripType";

export interface Ticket {
  id: number;
  seat_name: string;
  price: number;
}



export interface BookingData {
  selectedTicket: Ticket[];
  selectedTripId: number;
  tripData: DTO_RP_TripInfo;
}
