import { ENABLE, fileType } from '../common';
export enum Status {
    ALL = '',
    PENDING = '待审核',
    AUDITED = '已审核',
    EFFECTED = '已生效',
    VOID = '已作废',
}

export enum StandardHandleType {
    DELETE = 'DELETE',
    ENABLED = 'ENABLED',
}

export enum PriceAdjustHandleType {
    AUDIT = 'AUDIT',
    CANCELAUDIT = 'CANCELAUDIT',
    VOID = 'VOID',
}

export enum AdjustmentType {
    PRICE = '单价调整',
    FUTUREPRICE = '历史单价调整'
}

export interface IStepData {
    min: number | string;
    max: number | string;
    price: number | string;
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
    is_enabled?: ENABLE; //
    keyword?: string; //
}

export interface IStandardPriceAddItem {
    name: string; // 名称
    meter_type_id?: string; // 类型id
    is_step: string; // 是否阶梯价
    step_data: string; //
    price: string; // 单价
    unit: string; // 单位
    remark: string; // 说明
    effect_date: string; // 生效时间
}

export interface IStandardPriceEditItem {
    id: string;
    name: string; // 名称
    remark: string; // 说明
}
// 【单价标准】—— 列表items /meter/standard-price/list
export interface IStandardPriceItem extends IStandardPriceAddItem {
    id: string;
    meter_type_name: string; // 类型名称
    is_enabled: ENABLE; // 是否启用
}

// 【单价管理】——详情
export interface IStandardPriceDetail extends IStandardPriceItem {
    created_on: string; // 创建时间
    created_by: string; // 创建人
    modified_on: string; // 修改时间
    modified_by: string; // 修改人
    is_deleted: string;
    created_by_name: string;
}
// 【调整单】—— 列表 —— 参数 /meter/price-adjustment/list
export interface IAdjustmentParams {
    page: number; //
    page_size: number; //
    status?: Status; //
    meter_type_id?: string; //
    keyword?: string; //
}

export interface IStandardPriceAdjustmentItem {
    id: string;
    start_date: string;
    end_date: string;
    is_step: string;
    step_data: string;
    price: string;
    unit: string;
    status: string;
    created_on: string;
}
// 【调整单】—— 列表 —— 返回items /meter/price-adjustment/list
export interface IAdjustmentItem extends IStandardPriceAdjustmentItem {
    code: string; // 调整单号
    reason: string; // 调整原因
    standard_name: string; // 单价名称
    meter_type_name: string; // 类型名称
    meter_standard_price_id: string; //
}
export interface IAdjustmentAddItem {
    meter_standard_price_id: string;
    type: AdjustmentType;
    start_date: string;
    end_date: string;
    is_step: string,
    price: string,
    unit: string,
    reason: string; // 调整原因
    attachment: fileType;
}

// 【调整单】—— 详情 /meter/price-adjustment/detail
export interface IAdjustmentDetail extends IAdjustmentItem {
    type: string; // 类型
    attachment: string;
    audit_date: string; // 审核时间
    auditor_id: string; // 审核人id
    created_by: string; // 发起时间
    modified_on: string;
    modified_by: string;
    is_deleted: string;
    created_by_name: string; // 发起人
    auditor_id_name: string; // 审核人
}

// 标准单价统计item
export interface IMeterTypeStatisticItem {
    meter_type_id: string; // 类型id
    meter_type_name: string; // 类型名称
    value: string;
}
// 标准单价类型
export interface IStatisticsItem {
    id: string; // 类型id
    value: string; // 类型名称
    num: string | number;
}

// 标准单价类型item
export interface IMeterTypeItem {
    id: string;
    value: string;
    unit: string;
}

export interface IStatusItem {
    status: Status;
    value: string;
}
