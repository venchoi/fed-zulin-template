import { derateType, feeItem } from '../list.d';
import { fileType } from '@/types/common';

export interface derateSubRowProps {
    record: derateType;
}

export type status = '' | 'success' | 'warning' | 'error' | 'validating';

export interface feeItemType {
    id: string;
    renter_organization_name: string;
    contract_code?: string;
    room_name: string;
    full_room_name: string;
    derated_amount: number | string;
    tempDerateAmount: number | string;
    demurrage_derated_amount: number;
    stayDemurrageAmount: number;
    stay_demurrage_amount: number;
    stay_amount: number;
    stayAmount: number;
    renter_name: string;
    start_date: string;
    end_date: string;
    amount: string;
    rowSpan?: number;
    validateStatus?: status;
    isDemurrage: boolean;
    bill_item_id: string;
}

interface derateDetail {
    items: feeItemType[];
    proj_name: string;
    remark: string;
    attachment: fileType[];
    proj_id: string;
    id: string;
}

interface derateItemType {
    bill_item_id: string;
    derated_amount?: string | number;
    demurrage_derated_amount?: string | number;
}

interface saveDataType {
    attachment: fileType[];
    derated_items: derateItemType[];
    remark?: string;
    proj_id: string;
    id: string;
}
