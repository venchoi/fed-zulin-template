import ajax from '@/api/utils/ajax';
import { getTreeDataParams } from '@/types/derateTypes';

export const getProjectTreeData = (data: getTreeDataParams) => {
    return ajax('/resource/stage/get-organization-tree', { ...data, _csrf: '' }, 'GET');
};
