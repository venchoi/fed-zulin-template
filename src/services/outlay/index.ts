import ajax from '@/api/utils/ajax';
import { ResponseData } from '@/types/common';
import { FeeItem, OutLayListItem, CanApplyInvoice } from '@/types/outlay';
import { GetOutlayListParams } from '../../routers/outlay/index.d';

// 根据项目获取费项列表
export const getFeeList = (params: { proj_id: string }): Promise<ResponseData<FeeItem[]>> => {
    return ajax('/bill/extra/get-bill-item-fee-name', params, 'POST');
};

// 获取收支表格数据
export const getOutlayList = (
    params: GetOutlayListParams
): Promise<ResponseData<{ items: OutLayListItem[]; total: string }>> => {
    return ajax('/transaction/exchange/list', params, 'POST');
};

export const getCanApplyInvoice = (): Promise<ResponseData<CanApplyInvoice>> => {
    return ajax('/receipt/receipt/get-switch', {}, 'GET');
};
