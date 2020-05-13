// 导出状态
export enum Status {
    '', // 全部
    '导出中',
    '成功',
    '失败',
}

export interface ExportListParams {
    stage_id: string; // 项目id
    type: string; // 与后端对接时获得，如：导出企业租客、导出工商个体租客、导出个人租客等
    page: number; // 页码
    page_size: number; // 单页长度
    keyword?: string; // 关键词
    status: keyof Status; // 导出状态
    start_date?: string; // 导出开始时间
    end_date?: string; // 导出结束时间
}

// 导出记录
export default interface ExportItemType {
    created_on: string; // 导出时间
    created_by: string; // 导出人
    status: keyof Status; // 状态
}
