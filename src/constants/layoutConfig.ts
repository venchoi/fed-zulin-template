export interface IHeader {
    title: string;
    dataIndex?: string;
    key?: string;
    sort: boolean;
    align?: string;
    isNoResize?: boolean;
    fixed?: string;
    width: number;
    [propsName: string]: any;
}
