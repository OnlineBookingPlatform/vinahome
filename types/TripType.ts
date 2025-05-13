import type { TicketType } from "./TicketType";

export interface SearchTripParams {
  departureId: number | null;
  destinationId: number | null;
  departureDate: Date | string;
  numberOfTickets?: number | null;
}
export interface TripType {
  id: number;
}
// DTO cho thông tin điểm
export interface DTO_RP_TripPointInfo {
  pointId: number;
  pointName: string;
  address: string;
  province: string;
  time: string;
  arrivalTime?: string;
  arrivalDate?: string;
}

// DTO cho thông tin công ty
export interface DTO_RP_TripCompanyInfo {
  id: number;
  name: string;
  phone: string;
  address: string;
  taxCode: string;
  status: boolean;
  urlLogo: string;
  code: string;
  note: string;
  url_vehicle_online: string;
  createdAt: string;
}

// DTO cho thông tin tuyến đường
export interface DTO_RP_TripRouteInfo {
  id: number;
  createdAt: string;
  name: string;
  shortenName: string;
  base_price: number;
  status: boolean;
  note: string;
  displayOrder: number;
  companyId: number;
}

// DTO cho thông tin lịch trình
export interface DTO_RP_TripScheduleInfo {
  id: number;
  createdAt: string;
  startDate: string;
  endDate: string | null;
  startTime: string;
  isEndDateSet: boolean;
}

// DTO cho thông tin bản đồ ghế
export interface DTO_RP_SeatMapInfo {
  id: number;
  createdAt: string;
  name: string;
  totalFloor: number;
  totalRow: number;
  totalColumn: number;
  companyId: number;
}

// DTO cho thông tin chuyến đi
export interface DTO_RP_TripInfo {
  departureTime(
    arg0: string,
    arg1: string,
    departureTime: any,
    id: number
  ): unknown;
  id: number;
  time_departure: string;
  dateDeparture: string;
  date_departure?: string;
  route: DTO_RP_TripRouteInfo;
  schedule: DTO_RP_TripScheduleInfo;
  company: DTO_RP_TripCompanyInfo;
  seat_map: DTO_RP_SeatMapInfo;
  departureInfo: DTO_RP_TripPointInfo;
  destinationInfo: DTO_RP_TripPointInfo;
  tickets_available: number;
  duration?: number;
}

export interface DetailTripType {
  id: number;
  seat_map_id: number;
  total_floor: number;
  total_row: number;
  total_column: number;
  tickets: TicketType[];
  policy_content: string;
  transit_content: string;
}

// Thêm DTO cho ConnectionPoint
export interface ConnectionPoint {
  province: {
    id: number;
    name: string;
  };
  pointId: number;
  pointName: string;
}

// Thêm DTO cho ConnectedTrip
export interface ConnectedTripType {
  firstTrip: DTO_RP_TripInfo;
  secondTrip: DTO_RP_TripInfo;
  totalPrice: number;
  connectionPoint: ConnectionPoint;
  waitingTime: string;
  waitingMinutes?: number;
  totalDuration?: string;
}

// Thêm DTO cho kết quả tìm kiếm tổng hợp
export interface SearchResults {
  directTrips: DTO_RP_TripInfo[];
  connectedTrips: ConnectedTripType[];
}
