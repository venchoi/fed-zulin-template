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
    start_date?: string;
    end_date?: string;
    fee_name?: string;
    room_id?: string;
    subdistrict_id?: string;
    building_id?: string;
    floor_id?: string;
    floor_name?: string;
    status?: string[];
    stage_id?: string;
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

export interface auditParams {
    id: string;
}

export interface batchAuditParams {
    ids: string[];
}

export interface auditAllParams {
    proj_ids: string;
    type: string;
}

export interface getAuditStatusParams {
    proj_ids: string;
    type: string;
}

export interface voidParams {
    id: string;
}

export interface cancelDerateParams {
    ids: string;
}

export interface oaDetailParams {
    business_id: string;
    scenario_code: string;
    url_field: string;
}

export interface billItemFeeParams {
    proj_id: string;
}

export interface workflowTempIsEnableParams {
    scenario_code: string;
    project_id: string;
}

export interface createWHInstanceParams {
    scene: string;
    business_id: string;
}

export interface commitInfoStatusParams {
    record_id: string;
}
