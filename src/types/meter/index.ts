// 【单价标准】——列表 /meter/standard-price/list
export interface IStandardPriceParams {
    page: ''; //
    page_size: ''; //
    meter_type_id?: ''; //
    is_enabled?: ''; //
    keyword?: ''; //
}

export interface IStandardPriceItem {
    id: '';
    name: ''; // 名称
    meter_type_id: ''; // 类型id
    meter_type_name: ''; // 类型名称
    is_step: ''; // 是否阶梯价
    step_data: ''; //
    price: ''; // 单价
    unit: ''; // 单位
    remark: ''; // 说明
    effect_date: ''; // 生效时间
    is_enabled: ''; // 是否启用
}

// 【调整单】——列表 /meter/standard-price/list
export interface IAdjustmentParams {
    page: ''; //
    page_size: ''; //
    status: ''; //
    meter_type_id?: ''; //
    keyword?: ''; //
}

export interface IAdjustmentItem {
    id: ''; //
    meter_standard_price_id: ''; //
    code: ''; //
    is_step: ''; //
    step_data: ''; //
    price: ''; //
    unit: ''; //
    reason: ''; // 调整原因
    start_date: ''; //
    end_date: ''; //
    created_on: ''; // 提交时间
    status: ''; //
    standard_name: ''; // 调整单名称
    meter_type_name: ''; // 类型名称
}
