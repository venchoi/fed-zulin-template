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
