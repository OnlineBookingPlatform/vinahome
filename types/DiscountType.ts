export interface DiscountType{
    id: number, 
    company_id: number,
    discount_code: string | null, 
    date_start: Date | null, 
    date_end: Date | null, 
    discount_value: number,
    discount_type: boolean , //true: vnd, false: phần trăm 
    description: string | null, 
    number_of_uses: number | null,
}

