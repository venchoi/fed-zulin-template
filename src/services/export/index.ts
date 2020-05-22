import ajax from '@/api/utils/ajax';
import { IExportListParams } from '@/types/exportTypes';

export const getExportList = (data: IExportListParams) => {
    return ajax('/exporter/exporter/list', { ...data, _csrf: '' }, 'POST');
};
