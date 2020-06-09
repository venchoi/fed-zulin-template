export enum IStatus {
    ALL = '全部',
    AUDITLESS = '待审核',
    AUDITED = '已审核',
    EFFECTED = '已生效',
    CANCELED = '已作废',
}

export enum StandardHandleType {
    DELETE = 'DELETE',
    ENABLED = 'ENABLED',
}

export enum PriceAdjustHandleType {
    AUDIT = 'AUDIT',
    CANCELAUDIT = 'CANCELAUDIT',
    VOID = 'VOID'
}

export interface IStandardICURDParams {
    id: string;
    type: StandardHandleType;
}
export interface IAdjustmentICURDParams {
    id: string;
    type: PriceAdjustHandleType;
}
// 【单价标准】—— 列表 —— 参数 /meter/standard-price/list
export interface IStandardPriceParams {
    page: number; //
    page_size: number; //
    meter_type_id?: string; //
    is_enabled?: string; //
    keyword?: string; //
}

// 【单价标准】—— 列表 —— 返回items /meter/standard-price/list
export interface IStandardPriceItem {
    id: string;
    name: string; // 名称
    meter_type_id: string; // 类型id
    meter_type_name: string; // 类型名称
    is_step: string; // 是否阶梯价
    step_data: string; //
    price: string; // 单价
    unit: string; // 单位
    remark: string; // 说明
    effect_date: string; // 生效时间
    is_enabled: string; // 是否启用
}

// 【调整单】—— 列表 —— 参数 /meter/price-adjustment/list
export interface IAdjustmentParams {
    page: number; //
    page_size: number; //
    status?: IStatus; //
    meter_type_id?: string; //
    keyword?: string; //
}

// 【调整单】—— 列表 —— 返回items /meter/price-adjustment/list
export interface IAdjustmentItem {
    id: string; //
    meter_standard_price_id: string; //
    code: string; //
    is_step: string; //
    step_data: string; //
    price: string; //
    unit: string; //
    reason: string; // 调整原因
    start_date: string; //
    end_date: string; //
    created_on: string; // 提交时间
    status: IStatus; //
    standard_name: string; // 调整单名称
    meter_type_name: string; // 类型名称
}

// 标准单价类型
export interface IMeterTypeItem {
    meter_type_id: string; // 类型id
    meter_type_name: string; // 类型名称
    value: string;
}

export interface IStatusItem {
    status: IStatus;
    value: string;
}
