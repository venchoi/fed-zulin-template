// 证件类型
export interface IIdCardType {
    code: string; // 类型
}

export interface ITableColumn {
    field: string; // 字段英文名称 如 sale_price
    key: string; // 字段的key    如"76d76931-b33e-305c-1e2c-23542d1a160c"
    name: string; // 字段的中文名称 如 "销售价格"
    selected: boolean; // 字段是否选中 如 true
    width: number; // 设置的列宽    如 100
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

export interface ISaveCustomLayout {
    key: string; //
    value: IAddAssetHolder[];
}

export interface IGetCustomLayout {
    field: string; // 字段英文名称  如 sale_price
    width: number; // 设置的列宽    如 100
    selected?: boolean; // 是否選中
}

export interface IManageList {
    project_id: string; // 项目Id
}

// 资产持有人 列表
export interface IAssetHolderList {
    proj_id: string; // 项目Id
    advanced_select_fields: IField[];
    page: number; // 当前页码
    page_size: number; // 每个大小
    order_by?: string; // 排序字段
    name?: string; // 搜索关键字
    type?: string; // 证件类型
    status?: string; // 合作状态
    order_method?: string; // 排序方式
}

// 添加资产持有人
export interface IAddAssetHolder {
    id?: string;
    name: string; // 姓名
    short_name: string; // 简称
    id_code_type: string; // 证件类型Id
    id_code_type_name?: string; // 证件类型名称
    id_code: string; // 证件号码
    english_name: string; // 英文姓名
    english_short_name: string; // 英文简称
    type: string; // 租客类型(个人,工商个体,企业)
    contacter: string; // 联系人
    mobile: string; // 电话号码
    address: string; // 地址
    project_id: string; // 关联项目 多个项目用,分隔
    projects?: string[]; // 关联项目中文 接口数组返回
    manager: string; // 负责人Id  【与产品经理确认过，此处的负责人为单选】
    manager_name?: string; // 负责人名称
    accounts: IAddAssetHolderBank[];
    created_on?: string; // 创建时间
    created_by_name?: string; // 创建人
    modified_on?: string; // 最后修改时间
    modified_on_name?: string; // 最后修改人
}

// 添加银行账号
export interface IAddAssetHolderBank {
    id?: string; //
    holder_id: string; // 持有人Id
    bank: string; // 开户行
    account: string; // 银行账号
    account_name: string; // 户名
    remark: string; // 备注
    width?: number;
}

// 银行账号列表
export interface IAssetHolderBankList {
    id: string; //
    page: number; // 当前页码
    page_size: number; // 每个大小
    keyword?: string; //  搜索关键字
}
