import { projsValue } from '@t/project';
import { OutLayListItem, StageDataItem } from '@/types/outlay';

export interface GetOutlayListParams {
    stage_id?: string;
    subdistrict_id?: string;
    building_id?: string;
    floor_name?: string;
    room_id?: string;
    fee_name?: string;
    payment_mode_id?: string;
    keyword?: string;
    start_date?: string; // 支付开始时间
    end_date?: string; // 支付结束时间
    exchange_end_date?: string;
    exchange_start_date?: string;
    page: number;
    page_size: number;
}

export interface FilterProps {
    projIds: string[];
    projNames: string[];
    filterOptions: GetOutlayListParams; // 筛选条件
    onChange(filterOptions: GetOutlayListParams): void;
}

export interface TopRightFuncProps {
    projIds: Array<string>;
    projNames: Array<string>;
    extData: {canApplyInvoice: boolean, stageData: StageDataItem[], user: any};
    selectedRows: OutLayListItem[];
    selectedRowKeys: string[];
    onChange(type: string, value: projsValue | string): void;
}
