import type { ConnectedTripType, DTO_RP_TripInfo } from "./TripType";

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

export interface ConnectedBookingData {
  firstTrip: {
    selectedTicket: Ticket[];
    tripData: DTO_RP_TripInfo;
  };
  secondTrip: {
    selectedTicket: Ticket[];
    tripData: DTO_RP_TripInfo;
  };
  connectionInfo: {
    transferPoint: string;
    waitingTime: string;
    totalPrice: number;
    totalDuration: string;
  };
}
