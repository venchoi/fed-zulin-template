import ajax from '@/api/utils/ajax';
import {
    IIdCardType,
    IAddAssetHolder,
    IAddAssetHolderBank,
    IAssetHolderBankList,
    IAssetHolderList,
    IField,
} from '@/types/assetHolder';
import { IHeader } from '@/constants/layoutConfig';

// 资产持有人管理
export const getCustomLayout = (data: { key: string }) => {
    return ajax('/parameter/tables/get-custom-layout', { ...data, _csrf: '' }, 'GET');
};

// 字段数据
export const getFiles = (data: { type: string }) => {
    return ajax('/parameter/tables/fields', { ...data, _csrf: '' }, 'GET');
};

// 资产持有人管理
export const postCustomLayout = (data: { value: IHeader[]; key: string }) => {
    return ajax('/parameter/tables/save-custom-layout', { ...data, _csrf: '' }, 'POST');
};

// 获取证件类型
export const getIdCardList = (data: IIdCardType) => {
    return ajax('/parameter/parameter/list-options', { ...data, _csrf: '' }, 'GET');
};

// 负责人列表
export const getManageList = () => {
    return ajax('/asset/holder/get-auth-user-list', { _csrf: '' }, 'GET');
};

// 新增 持有人
export const postAddAssetHolder = (data: IAddAssetHolder) => {
    return ajax('/asset/holder/add', { ...data, _csrf: '' }, 'POST');
};

// 详情 持有人
export const getAssetHolderDetail = (data: { id: string }) => {
    return ajax('/asset/holder/detail', { ...data, _csrf: '' }, 'GET');
};

// 列表 持有人
export const getAssetHolderList = (data: IAssetHolderList) => {
    return ajax('/asset/holder/list', { ...data, _csrf: '' }, 'POST');
};

// 新增资产银行账户列表
export const postAddAssetHolderBank = (data: IAddAssetHolderBank) => {
    return ajax('/asset/holder/account-add', { ...data, _csrf: '' }, 'POST');
};

// 新增资产银行账户列表
export const postDeleteAssetHolderBank = (data: { id: string }) => {
    return ajax('/asset/holder/account-delete', { ...data, _csrf: '' }, 'POST');
};

// 详情 资产银行账户
export const getAssetHolderBankDetail = (data: { id: string }) => {
    return ajax('/asset/holder/account-detail', { ...data, _csrf: '' }, 'GET');
};

// 资产银行账户列表
export const getAssetHolderBankList = (data: IAssetHolderBankList) => {
    return ajax('/asset/holder/account-list', { ...data, _csrf: '' }, 'GET');
};

export const deleteAssetHolder = (data: { id: string }) => {
    return ajax('/asset/holder/delete', { ...data, _csrf: '' }, 'POST');
};

export const batchDeleteAssetHolder = (data: { id: string[] }) => {
    return ajax('/asset/holder/delete', { ...data, _csrf: '' }, 'POST');
};
