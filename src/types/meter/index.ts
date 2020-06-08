// 【单价标准】——列表 /meter/standard-price/list
export interface IStandardPriceParams {
    page: number; //
    page_size: number; //
    meter_type_id?: string; //
    is_enabled?: string; //
    keyword?: string; //
}

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

// 【调整单】—— 列表 /meter/price-adjustment/list
export interface IAdjustmentParams {
    page: number; //
    page_size: number; //
    status: string; //
    meter_type_id?: string; //
    keyword?: string; //
}

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
    status: string; //
    standard_name: string; // 调整单名称
    meter_type_name: string; // 类型名称
}
