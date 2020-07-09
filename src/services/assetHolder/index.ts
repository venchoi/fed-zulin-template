import ajax from '@/api/utils/ajax';
import { IIdCardType, IAddAssetHolder, IAddAssetHolderBank, IAssetHolderBankList } from '@/types/assetHolder';

// 获取证件类型
export const getIdCardList = (data: IIdCardType) => {
    return ajax('/parameter/parameter/list-options', { ...data, _csrf: '' }, 'GET');
};

// 新增 持有人
export const postAddAssetHolder = (data: IAddAssetHolder) => {
    return ajax('/asset/holder/add', { ...data, _csrf: '' }, 'POST');
};

// 新增资产银行账户列表
export const postAddAssetHolderBank = (data: IAddAssetHolderBank) => {
    return ajax('/asset/bank/add', { ...data, _csrf: '' }, 'POST');
};

// 资产银行账户列表
export const getAssetHolderBankList = (data: IAssetHolderBankList) => {
    return ajax('/asset/bank/list', { ...data, _csrf: '' }, 'GET');
};
