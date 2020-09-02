import ajax from '@/api/utils/ajax';
import { ResponseData } from '@/types/common';
import { IGetOutlayDetailParams, IOutlayDetail, IBillInfo, IGetBillInfoParams } from './type';

export const getOutLayDetail = (params: IGetOutlayDetailParams): Promise<ResponseData<IOutlayDetail>> => {
    return ajax('/transaction/exchange/detail', params, 'GET');
};

export const getWorkflowOutLayDetail = (params: IGetOutlayDetailParams): Promise<ResponseData<IOutlayDetail>> => {
    return ajax('/bill/bill/settle-exchange-detail', params, 'GET');
};

export const getBillInfo = (params: IGetBillInfoParams): Promise<ResponseData<IBillInfo>> => {
    return ajax('/transaction/exchange/bill-info', params, 'GET');
};
