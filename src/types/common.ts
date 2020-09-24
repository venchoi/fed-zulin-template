export interface fileType {
    auth_file_path: string;
    done: boolean;
    file_name: string;
    file_path: string;
    id: string;
    image_path: string;
    process: number;
    status: string;
    type: string;
    edit?: string | boolean;
}
export enum ENABLE {
    NOTENABLED = '0',
    ENABLED = '1',
}
export interface responseType {
    status?: boolean;
    msg?: string;
    data?: any[];
}

// 请求的接口放回报文结构
export interface ResponseData<T> {
    data: T;
    msg: string;
    result: boolean;
}

// 支付方式
export interface PaymentMode {
    ext?: string; // 额外信息，json字符串，eg: "{"name":"现金支付","isNeedFee":"1","feeMode":"按比例","ratio":1}"
    id: string;
    is_enabled?: number;
    is_system?: string;
    scope_id?: string | null;
    sort?: number;
    title?: string;
    value: string;
}

export type SearchEvent =
    | React.ChangeEvent<HTMLInputElement>
    | React.MouseEvent<HTMLElement, MouseEvent>
    | React.KeyboardEvent<HTMLInputElement>
    | undefined;

export interface OpLogParams {
    key_name: string;
    desc: string;
    detail: string;
}

export interface IField {
    id?: string;
    field: string; // "name"
    is_default: boolean; //
    sorter?: boolean;
    key: string; // "39f649c3-d5a2-0e18-56eb-d7f8bcaf9edb"
    name: string; // "姓名"
    selected?: boolean; //
    width?: number | string;
}

export interface IInvoice {
    id: string;
    number: string;
    type_name: string;
    amount: string;
    receipt_date: string;
    receipt_by_name: string;
}

export interface IReceipt {
    id: string;
    number: string;
    payee_name: string;
    amount: string;
    receipt_time: string;
}

// 登录用户信息
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
