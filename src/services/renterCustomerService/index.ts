import ajax from '@/api/utils/ajax';
import {
    getrenterListParams,
    getAuditListParams,
    unbindRenterParams,
    getContractDetailParams,
    addContractAdminParams,
    getAuditDetailParams,
    auditRenterParams,
    getApplyListCountParams,
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

// 获取合同详情
export const getContractDetail = (data: getContractDetailParams) => {
    return ajax('/user/contract-admin/get-contract-detail', { ...data, _csrf: '' }, 'GET');
};

// 新增编辑管理员
export const addContractAdmin = (data: addContractAdminParams) => {
    return ajax('/user/contract-admin/set-contract-admin', { ...data, _csrf: '' }, 'POST');
};

// 获取审批详情
export const fetchAuditDetail = (data: getAuditDetailParams) => {
    return ajax('/user/contract-admin/apply-detail', { ...data, _csrf: '' }, 'GET');
};

// 审核
export const auditRenter = (data: auditRenterParams) => {
    return ajax('/user/contract-admin/pass-apply', { ...data, _csrf: '' }, 'POST');
};

// 获取待审核数量
export const getApplyListCount = (data: getApplyListCountParams) => {
    return ajax('/user/contract-admin/apply-list-count', { ...data, _csrf: '' }, 'POST');
};
