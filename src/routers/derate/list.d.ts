import { History } from 'history';

export interface User {
    account: string;
    displayName: string;
    display_name: string;
    key: string;
    org_id: string;
    organ_name: string;
    tenantCode: string;
    tenant_code: string;
    tenant_name: string;
    user_id: string;
}

export interface Props {
    history: History;
    user: User;
}

export interface projsValue {
    projIds: Array<string>;
    projNames: Array<string>;
}

export interface feeItem {
    full_room_name: string;
    fee_name: string;
    renter_organization_name: string;
}
export interface derateType {
    id: string;
    code: string;
    items: feeItem[];
    created_on: string;
    fee_names: string;
    derated_amount: string | number;
    demurrage_derated_amount: string | number;
    status: string;
    proj_id: string;
    wh_approval_info: any;
    workflow_instance_id: string;
    show_third_detail: string | number;
    wh_new_approval_info: any;
    wh_renew_approval_info: any;
    created_by: string;
    package_rooms?: { package_name: string; room_names: string }[];
    apply_time: string;
}

export interface statusMapType {
    [index: string]: string;
}

export interface responseType {
    result?: boolean;
    msg?: string;
    data?: any[];
}

export interface enableItemType {
    isEnabled: boolean;
    oaName: string;
    oaId: string;
    gotIsEnabled: boolean;
    projId: string;
}

export interface billFeeItemType {
    text: string;
    value: string;
}

export interface callbackFn {
    (keyword: string): void;
}
