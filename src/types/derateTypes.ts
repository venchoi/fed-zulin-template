import { fileType } from './common';

export interface getTreeDataParams {}

export interface getTemplateIsEnabled {
    proj_id: string;
    scenario_code: string;
}

export interface getDerateListParams {
    proj_id?: string;
    page: number;
    page_size: number;
    keyword?: string;
}

export interface getDerateDetailParams {
    id: string;
}

interface derateItemType {
    bill_item_id: string;
    derated_amount?: string | number;
    demurrage_derated_amount?: string | number;
}

export interface saveDataType {
    attachment: fileType[];
    derated_items: derateItemType[];
    remark?: string;
    proj_id: string;
    id: string;
}
