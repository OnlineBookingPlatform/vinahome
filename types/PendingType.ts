import type { DTO_RP_TripInfo, TripPointType } from "./TripType";

export interface Ticket {
  id: number;
  seat_name: string;
  price: number;
}



export interface BookingData {
  selectedTicket: Ticket[];
  pointUp: TripPointType;
  pointDown: TripPointType;
  selectedTripId: number;
  tripData: DTO_RP_TripInfo;
}
