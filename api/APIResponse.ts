export interface ApiResponse<T> {
    response: DetailTripType | { id: number; seat_map_id: number; total_floor: number; total_row: number; total_column: number; tickets: { id: number; seat_code: string; seat_column: number; seat_row: number; seat_floor: number; seat_status: boolean; seat_name: string; }[]; };
    value: any;
    status: number;
    message: string;
    result: T;
}
