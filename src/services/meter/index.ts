import ajax from '@/api/utils/ajax';
import {
    IStandardPriceParams,
    IAdjustmentParams,
    StandardHandleType,
    PriceAdjustHandleType,
    IStandardICURDParams,
    IAdjustmentICURDParams,
    IStandardPriceAddItem,
    IStandardPriceEditItem,
} from '@t/meter';

// 【单价标准】—— 列表
export const getStandardPriceList = (params: IStandardPriceParams) => {
    return ajax('/meter/standard-price/list', params, 'GET');
};
// 【单价管理】—— 详情
export const getStandardPriceDetail = (params: { id: string }) => {
    return ajax('/meter/standard-price/detail', params, 'GET');
};
// 【单价管理】—— 调整记录
export const getStandardPriceAdjustment = (params: {
    meter_standard_price_id: string;
    page: number;
    page_size: number;
}) => {
    return ajax('/meter/standard-price/get-adjustment-list', params, 'GET');
};
// 【单价标准】 —— 启用禁用 、删除
export const postStandardPrice = ({ type, id }: IStandardICURDParams) => {
    const map: Record<StandardHandleType, string> = {
        [StandardHandleType.DELETE]: '/meter/standard-price/delete',
        [StandardHandleType.ENABLED]: '/meter/standard-price/handle-enabled',
    };
    return ajax(map[type], { id }, 'POST');
};
// 【单价标准】 —— 新增
export const postStandardAdd = (params: IStandardPriceAddItem) => {
    return ajax('/meter/standard-price/add', params, 'POST');
};
// 【单价标准】 —— 编辑
export const postStandardEdit = (params: IStandardPriceEditItem) => {
    return ajax('/meter/standard-price/edit', params, 'POST');
};
// 【单价标准】—— 类型列表
export const getMeterTypeList = () => {
    return ajax('/meter/standard-price/get-support-meter-types', {}, 'GET');
};

// 【调整单】—— 列表
export const getPriceAdjustmentList = (params: IAdjustmentParams) => {
    return ajax('/meter/price-adjustment/list', params, 'GET');
};
// 【调整单】—— 详情
export const getPriceAdjustmentDetail = (params: { id: string }) => {
    return ajax('/meter/price-adjustment/detail', params, 'GET');
};
// TODO confirm
// 【调整单】—— 审核、取消审核、作废
export const postPrice = ({ type, id }: IAdjustmentICURDParams) => {
    const map: Record<PriceAdjustHandleType, string> = {
        [PriceAdjustHandleType.AUDIT]: '/meter/price-adjustment/audit',
        [PriceAdjustHandleType.CANCELAUDIT]: '/meter/price-adjustment/cancel-audit',
        [PriceAdjustHandleType.VOID]: '/meter/price-adjustment/void',
    };
    return ajax(map[type], { id }, 'POST');
};
