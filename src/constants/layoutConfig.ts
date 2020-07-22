import { IField } from '@t/assetHolder';

export interface IHeader {
    title: string;
    dataIndex?: string;
    key?: string;
    sorter: boolean;
    align?: string;
    isNoResize?: boolean;
    fixed?: string;
    width: number;
    ellipsis?: boolean;
    render?: () => void;
    [propsName: string]: any;
}
