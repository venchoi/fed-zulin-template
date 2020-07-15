import ajax from '@/api/utils/ajax';
import {
    getrenterListParams,
    getAuditListParams,
    unbindRenterParams
} from '@/types/renterCustomerService';

// 获取减免列表
export const getRenterList = (data: getrenterListParams) => {
    return ajax('/user/contract-admin/list', { ...data, _csrf: '' }, 'POST');
};

// 解绑
export const unbindRenter = (data: unbindRenterParams) => {
    return ajax('/user/contract-admin/unbind', { ...data, _csrf: '' }, 'POST');
};

// 获取待审核列表
export const getAuditList = (data: getAuditListParams) => {
    return ajax('/user/contract-admin/apply-list', { ...data, _csrf: '' }, 'POST');
};