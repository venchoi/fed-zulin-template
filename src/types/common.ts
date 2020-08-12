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
