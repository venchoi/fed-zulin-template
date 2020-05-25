import ajax from '@/api/utils/ajax';
import {
    getTreeDataParams,
    getTemplateIsEnabled,
    getDerateListParams,
    getDerateDetailParams,
    saveDataType,
    auditParams,
    batchAuditParams,
    voidParams,
    cancelDerateParams,
    oaDetailParams,
    billItemFeeParams,
    workflowTempIsEnableParams,
    createWHInstanceParams,
    commitInfoStatusParams,
} from '@/types/derateTypes';

export const getProjectTreeData = (data: getTreeDataParams) => {
    return ajax('/resource/stage/get-organization-tree', { ...data, _csrf: '' }, 'GET');
};

export const fetchMuiltStageWorkflowTempIsEnabled = (data: getTemplateIsEnabled) => {
    return ajax('/workflow/scenario/is-enabled-templates', { ...data, _csrf: '' }, 'GET');
};

// 获取减免列表
export const getDerateList = (data: getDerateListParams) => {
    return ajax('/bill/derated/list', { ...data, _csrf: '' }, 'POST');
};

// 获取减免详情
export const getDerateDetail = (data: getDerateDetailParams) => {
    return ajax('/bill/derated/detail', { ...data, _csrf: '' }, 'GET');
};

// 编辑
export const submitDerate = (data: saveDataType) => {
    return ajax('/bill/derated/edit', { ...data, _csrf: '' }, 'POST');
};

// 审核
export const auditDerate = (data: auditParams) => {
    return ajax('/bill/derated/audit', { ...data, _csrf: '' }, 'POST');
};

export const batchAuditDerate = (data: batchAuditParams) => {
    return ajax('/bill/derated/batch-audit', { ...data, _csrf: '' }, 'POST');
};

// 作废
export const voidDerate = (data: voidParams) => {
    return ajax('/bill/derated/void', { ...data, _csrf: '' }, 'POST');
};

// 取消减免
export const cancelDerate = (data: cancelDerateParams) => {
    return ajax('/bill/derated/cancel-audited', { ...data, _csrf: '' }, 'POST');
};

// 获取筛选费项列表
export const getBillItemFee = (data: billItemFeeParams) => {
    return ajax('/bill/derated/get-bill-item-fee', { ...data, _csrf: '' }, 'POST');
};

export const fetchOaDetailData = (data: oaDetailParams) => {
    return ajax('/third/scene/get-third-url', { ...data, _csrf: '' }, 'POST');
};

// 获取是否设置了审批流
export const fetchWorkflowTempIsEnabled = (data: workflowTempIsEnableParams) => {
    return ajax('/workflow/scenario/has-enabled-templates', { ...data, _csrf: '' }, 'GET');
};

// 创建武汉审批流
export const createInstanceForWH = (data: createWHInstanceParams) => {
    return ajax('/workflow/workflow/async-commit-approval', { ...data, _csrf: '' }, 'POST');
};

export const getCommitInfoStatusForWH = (data: commitInfoStatusParams) => {
    return ajax('/workflow/workflow/get-commit-info', { ...data, _csrf: '' }, 'POST');
};
