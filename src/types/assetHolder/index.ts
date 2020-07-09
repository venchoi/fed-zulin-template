import { Status } from '@t/meter';

// 证件类型
export interface IIdCardType {
    code: string; // 类型
}

export interface IManageList {
    project_id: string; // 项目Id
}

// 资产持有人 列表
export interface IAssetHolderList {
    page: number; // 当前页码
    page_size: number; // 每个大小
    keyword?: string; //  搜索关键字
}

// 添加资产持有人
export interface IAddAssetHolder {
    name: string; // 姓名
    short_name: string; // 简称
    id_code_type: string; // 证件类型
    id_code: string; // 证件号码
    english_name: string; // 英文姓名
    english_short_name: string; // 英文简称
    type: string; // 租客类型(个人,工商个体,企业)
    contacter: string; // 联系人
    mobile: string; // 电话号码
    address: string; // 地址
    project_id: string; // 关联项目 多个项目用,分隔
    manager: string; // 负责人  【与产品经理确认过，此处的负责人为单选】
}

// 添加银行账号
export interface IAddAssetHolderBank {
    id: string; // 持有人Id
    bank: string; // 开户行
    account: string; // 银行账号
    account_name: string; // 户名
    remark: string; // 备注
}

// 银行账号列表
export interface IAssetHolderBankList {
    page: number; // 当前页码
    page_size: number; // 每个大小
    keyword?: string; //  搜索关键字
}
