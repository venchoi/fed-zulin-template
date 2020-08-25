import ajax from '@/api/utils/ajax';
import { getCategoryParamsType, getCategoryStatParamsType } from '@/types/workspace';

export const getCategoryList = (data: getCategoryParamsType) => {
    return ajax('/workbench/workbench/get-pending-list', { ...data, _csrf: '' }, 'GET');
};

export const getCategoryStat = (data: getCategoryStatParamsType) => {
    return ajax('/workbench/workbench/get-pending-total-by-code', { ...data, _csrf: '' }, 'POST');
};
