import type { ConnectedTripType, DTO_RP_TripInfo } from "./TripType";

export interface Ticket {
  id: number;
  seat_name: string;
  price: number;
}

export interface SelectedTicket {
  id: number;
  seat_name: string;
  price: number;
  trip_id?: number;
  trip_name?: string;
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

// Add extended connected trip type with ticket information
export interface ConnectedTripWithTickets extends ConnectedTripType {
  firstTripTickets?: SelectedTicket[];
  secondTripTickets?: SelectedTicket[];
}
