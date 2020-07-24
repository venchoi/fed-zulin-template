import { IField } from '@t/assetHolder';

export interface IHeader {
    title: string;
    dataIndex?: string;
    key?: string;
    sorter?: boolean;
    align?: string;
    isNoResize?: boolean;
    fixed?: string;
    width: number | string;
    ellipsis?: boolean;
    render?: (item: IField) => void;
    [propsName: string]: any;
}

// 资产持有人列表 表格默认列宽
export const asset_holder_list_layout = {};
