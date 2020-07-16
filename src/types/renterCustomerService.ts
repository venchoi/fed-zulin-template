
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

export interface getContractDetailParams {
    contract_code: string;
}

export interface addContractAdminParams {
    admin_user_name?: string;
    contract_code?: string;
    phone?: string;
    email?: string;
}

export interface getAuditDetailParams {
    apply_id: string;
}

export interface auditRenterParams {
    apply_id: string;
    status: string;
}