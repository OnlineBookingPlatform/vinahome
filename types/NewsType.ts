export interface NewsType {
    id: number;
    email: string;
    created_at: string;
}
export interface DTO_RQ_NewsType{
    email: string | null;
}