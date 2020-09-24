import ajax from '@/api/utils/ajax';
import { ResponseData } from '@/types/common';
import {
    IGetOutlayDetailParams,
    IOutlayDetail,
    IBillInfo,
    IGetBillInfoParams,
    GetOutlayListParams,
    OutLayListItem,
    FeeItem,
    StageDataItem,
    CanApplyInvoice,
    StatisticData,
} from './type';

// 根据项目获取费项列表
export const getFeeList = (params: { proj_id: string }): Promise<ResponseData<FeeItem[]>> => {
    return ajax('/bill/extra/get-bill-item-fee-name', params, 'POST');
};

// 获取收支表格数据
export const getOutlayList = (
    params: GetOutlayListParams
): Promise<ResponseData<{ items: OutLayListItem[]; total: string; stages: StageDataItem[] }>> => {
    return ajax('/transaction/exchange/list', params, 'POST');
};

// 获取开具发票功能是否打开
export const getCanApplyInvoice = (): Promise<ResponseData<CanApplyInvoice>> => {
    return ajax('/receipt/receipt/get-switch', {}, 'GET');
};

export const getStatistics = (params: GetOutlayListParams): Promise<ResponseData<StatisticData>> => {
    return ajax('/transaction/exchange/statistics', params, 'POST');
};

export const getOutLayDetail = (params: IGetOutlayDetailParams): Promise<ResponseData<IOutlayDetail>> => {
    return ajax('/transaction/exchange/detail', params, 'GET');
};

export const getWorkflowOutLayDetail = (params: IGetOutlayDetailParams): Promise<ResponseData<IOutlayDetail>> => {
    return ajax('/bill/bill/settle-exchange-detail', params, 'GET');
};

export const getBillInfo = (params: IGetBillInfoParams): Promise<ResponseData<IBillInfo>> => {
    return ajax('/transaction/exchange/bill-info', params, 'GET');
};
