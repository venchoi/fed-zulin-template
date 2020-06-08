import ajax from '@/api/utils/ajax';
import { IStandardPriceParams, IAdjustmentParams } from '@t/meter';

interface ICURDParams {
    id: string;
}
// 【单价标准】—— 列表
export const getStandardPriceList = (params: IStandardPriceParams) => {
    return ajax('/meter/standard-price/list', params, 'GET');
};
// 单价标准】—— 启用禁用
export const postPriceEnabled = (params: ICURDParams) => {
    return ajax('/meter/standard-price/handle-enabled', params, 'GET');
};
// 【调整单】—— 列表
export const getPriceAdjustmentList = (params: IAdjustmentParams) => {
    return ajax('/meter/price-adjustment/list', params, 'GET');
};
// 【调整单】—— 审核
export const postAdjustmentAudit = (params: ICURDParams) => {
    return ajax('/meter/price-adjustment/audit', params, 'GET');
};
// 【调整单】—— 取消审核
export const postAdjustmentCancelAudit = (params: ICURDParams) => {
    return ajax('/meter/price-adjustment/cancel-audit', params, 'GET');
};
// 【调整单】—— 作废
export const postAdjustmentVoid = (params: ICURDParams) => {
    return ajax('/meter/price-adjustment/void', params, 'GET');
};
