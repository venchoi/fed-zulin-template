import ajax from '@/api/utils/ajax';
import { getCategoryParamsType } from '@/types/workspace';

export const getCategoryList = (data: getCategoryParamsType) => {
    return ajax('/workbench/workbench/get-pending-list', { ...data, _csrf: '' }, 'GET');
};
