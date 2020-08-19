import ajax from '@/api/utils/ajax';

// 获取退租合同
export const getContractList = (data: { keywords: string; project_ids: string; page: number; page_size: number }) => {
    return ajax('contract/contract/list', { ...data, _csrf: '' }, 'GET');
};
