// 导出状态
export enum Status {
    DEFAULT = '', // 全部
    ING = '导出中',
    SUCCESS = '成功',
    FAILED = '失败',
}
// 与后端对接时获得，如：导出企业租客、导出工商个体租客、导出个人租客等
export enum ExportType {
    METER = '导出抄表数据',
}

export interface IExportListParams {
    stage_id: string; // 项目id
    type: ExportType;
    page: number; // 页码
    page_size: number; // 单页长度
    keyword?: string; // 关键词
    status?: Status; // 导出状态
    start_date?: string; // 导出开始时间
    end_date?: string; // 导出结束时间
}

export interface IHistoryParams {
    stage_id: string;
    type: ExportType;
}

// TODO Exclude<IExportListParams, IHistoryParams>
export interface IExportCardParams extends Partial<IExportListParams> {}

export interface IExportConfigItem {
    name: string;
    backUrl: string;
}
export interface IExportConfig extends Record<ExportType, IExportConfigItem> {}

// 导出记录
export default interface IExportItemType {
    created_on: string; // 导出时间
    created_by: string; // 导出人
    status: Status; // 状态
}
