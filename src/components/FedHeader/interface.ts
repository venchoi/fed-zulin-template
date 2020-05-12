import { MouseEventHandler } from 'react';

export interface MapOptions {
    Apartment: string;
    AssetCenter: string;
    ManagementCenter: string;
    ManagementCenterDisabled: string;
    MemberCenter: string;
    OperationCenter: string;
    OperationCenterDisabled: string;
    PropertyBase: string;
    Rental: string;
    FangYi: string;
}

export interface AppInfo {
    key: keyof MapOptions;
    name: string;
    url: string;
    id: string;
    img: string;
    children?: AppInfo[];
    current: boolean;
}

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
    appCode?: string;
    appList: AppInfo[];
    user: User;
    personalCenterUrl: string;
    logoutUrl: string;
    className?: string;
}
