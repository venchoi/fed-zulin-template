import { fileType } from '@t/common';
export interface Props {
    history: History;
    user: User;
}

export interface RenterListProps {
    setLoading(isLoading: boolean): void;
    setTotalSize(total: number): void;
    totalSize: number;
    page: number;
    pageSize: number;
    stageId: string;
    handleShowAddAdminModal(record: renterListType): void;
    requestRenterList?: boolean;
}

export interface AuditListProps {
    setLoading(isLoading: boolean): void;
    setTotalSize(total: number): void;
    totalSize: number;
    page: number;
    pageSize: number;
    stageId: string;
}

export interface renterType {
    alias: string;
    organization_name: string;
}

export interface contractRoomType {
    contract_id: string;
    id: string;
    room_name: string;
}

export interface renterListType {
    id: string;
    code: string;
    start_date: string; 
    end_date: string;
    contract_renter: renterType[];
    contract_room: contractRoomType[];
    admin_user_name: string;
    phone: string;
    email: string;
}

export interface statusMapType {
    [index: string]: string;
}

export interface paramsType {
    keyword: string;
    renter_type: string;
    contract_status: string;
}

export interface searchAreaProps {
    onSearch(params: paramsType): void;
    keywordValue: string;
}

export interface auditParamsType {
    keyword: string;
    status: string;
}

export interface auditSearchAreaProps {
    onSearch(params: auditParamsType): void;
    keywordValue: string;
}

export interface auditListType {
    code: string;
    created_on: string; 
    stage_name: string;
    contract_renter: renterType[];
    contract_room: contractRoomType[];
    apply_user_name: string;
    master_phone: string;
    origin_master_name: string;
    origin_master_phone: string;
    contract_status: string;
    status: string;
    apply_id: string;
}

export interface contractRoomType {
    contract_id: string;
    id: string;
    room_name: string;
}
export interface auditDetailType {
    contract_code: string;
    project_name: string;
    contract_room: contractRoomType[];
    created_on: string;
    apply_user_name: string;
    master_phone: string;
    origin_master_name: string;
    origin_master_phone: string;
    attachment?: fileType[]
}