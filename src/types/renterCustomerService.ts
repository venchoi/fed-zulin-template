
export interface getrenterListParams {
    stage_id: string;
    keyword: string;
    page: number;
    page_size: number;
    renter_type: string;
    contract_status: string;
} 

export interface unbindRenterParams {
    id: string;
}

export interface getAuditListParams {
    stage_id: string;
    keyword: string;
    page: number;
    page_size: number;
    status: string;
} 