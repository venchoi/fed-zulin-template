import ajax from '@/api/utils/ajax';
import { getTreeDataParams, getTemplateIsEnabled, getDerateListParams } from '@/types/derateTypes';

export const getProjectTreeData = (data: getTreeDataParams) => {
    return ajax('/resource/stage/get-organization-tree', { ...data, _csrf: '' }, 'GET');
};

export const fetchMuiltStageWorkflowTempIsEnabled = (data: getTemplateIsEnabled) => {
    return ajax('/workflow/scenario/is-enabled-templates', { ...data, _csrf: '' }, 'GET');
};

export const getDerateList = (data: getDerateListParams) => {
    return ajax('/bill/derated/list', { ...data, _csrf: '' }, 'POST');
};
