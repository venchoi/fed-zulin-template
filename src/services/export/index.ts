import ajax from '@/api/utils/ajax';
import { ExportListParams } from '@/types/exportTypes';

export const getExportList = (data: ExportListParams) => {
    return ajax('/exporter/exporter/list', data, 'POST');
};
