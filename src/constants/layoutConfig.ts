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
    render?: (text?: string, item: IField) => void;
    [propsName: string]: any;
}

// 资产持有人列表 表格默认列宽
export const asset_holder_list_layout = {
    name: 350,
    projects: 277,
    short_name: 100,
    id_code_type: 100,
    id_code: 100,
    status: 120,
    english_name: 100,
    english_short_name: 137,
    contacter: 100,
    mobile: 100,
    address: 100,
    manager: 100,
};
