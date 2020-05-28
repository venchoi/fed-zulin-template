import { IExportConfig, ExportType } from '@/types/export';
export const exportConfig: IExportConfig = {
    [ExportType.METER]: {
        name: '抄表管理',
        backUrl: '/static/meter/list',
    },
};
